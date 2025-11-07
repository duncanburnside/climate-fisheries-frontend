'use client';

import { useEffect, useRef, useState } from 'react';
import type { ClimateIndicator, ClimateScenario, PeriodScenario } from '@/lib/models/ClimateTypes';
import { GlobeDataService, type GlobePoint } from '@/lib/services/beta/globe-data.service';

interface Globe3DProps {
  indicator: ClimateIndicator;
  climateScenario: ClimateScenario;
  periodScenario: PeriodScenario;
  showPoints?: boolean;
}

export function Globe3D({ indicator, climateScenario, periodScenario, showPoints = false }: Globe3DProps) {
  const globeEl = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState('Initializing...');

  useEffect(() => {
    if (!globeEl.current || typeof window === 'undefined') return;

    let mounted = true;

    const initGlobe = async () => {
      try {
        // Dynamically import globe.gl to avoid SSR issues
        const Globe = (await import('globe.gl')).default;

        if (!mounted || !globeEl.current) return;

        setLoadingStatus('Initializing globe...');

        // Initialize globe
        const globe = new Globe(globeEl.current)
          .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
          .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
          .showAtmosphere(true)
          .atmosphereColor('#3a5f8f')
          .atmosphereAltitude(0.15)
          .pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 0)
          .enablePointerInteraction(true)
          .polygonsTransitionDuration(0);

        globeRef.current = globe;

        // Load indicator image as texture overlay
        const imageUrl = `/assets/images/indicators/${indicator.name}/${climateScenario.name}/${periodScenario.name}.png`;
        
        setLoadingStatus('Loading texture...');
        
        // Preload texture image to ensure it's loaded before applying
        const textureImg = new Image();
        textureImg.crossOrigin = 'anonymous';
        textureImg.onload = async () => {
          if (!mounted) return;
          
          // Apply texture after it's loaded
          globe.globeImageUrl(imageUrl);
          
          // Wait a bit for texture to render, then load GeoJSON on top
          setTimeout(async () => {
            if (!mounted) return;
            
            setLoadingStatus('Loading data...');
            
            try {
              // Load countries GeoJSON after texture is rendered
              await loadGeoJSON(globe);
              
              // Then load or clear pixel data based on showPoints
              if (showPoints) {
                await loadPixelData(globe, indicator, climateScenario, periodScenario);
              } else {
                // Clear points if toggle is off
                globe.pointsData([]);
              }
            } catch (error) {
              console.error('Error loading data:', error);
            }
            
            if (mounted) {
              setIsLoading(false);
              setLoadingStatus('');
            }
          }, 300); // Wait for texture to render
        };
        textureImg.onerror = () => {
          console.error('Failed to load texture:', imageUrl);
          if (mounted) {
            setIsLoading(false);
            setLoadingStatus('Failed to load texture');
          }
        };
        textureImg.src = imageUrl;

      } catch (error) {
        console.error('Error initializing globe:', error);
        if (mounted) {
          setIsLoading(false);
          setLoadingStatus('Failed to initialize');
        }
      }
    };

    initGlobe();

    // Cleanup
    return () => {
      mounted = false;
      if (globeRef.current) {
        try {
          if (globeRef.current._destructor) {
            globeRef.current._destructor();
          }
          if (globeEl.current) {
            globeEl.current.innerHTML = '';
          }
        } catch (error) {
          console.error('Error cleaning up globe:', error);
        }
      }
    };
  }, [indicator, climateScenario, periodScenario, showPoints]);

  const loadGeoJSON = async (globe: any) => {
    try {
      // Load countries GeoJSON
      const response = await fetch('/assets/geoJSONs/countries.json');
      if (!response.ok) {
        console.warn('Could not fetch countries GeoJSON:', response.statusText);
        return;
      }

      const countriesData = await response.json();
      
      if (!countriesData || !countriesData.features) {
        console.warn('Invalid countries GeoJSON format');
        return;
      }

      // Filter and validate features
      const validFeatures = countriesData.features
        .filter((feature: any) => {
          // Check if feature exists and has valid geometry
          if (!feature || !feature.geometry) return false;
          
          // Only support Polygon and MultiPolygon types
          const geomType = feature.geometry.type;
          if (geomType !== 'Polygon' && geomType !== 'MultiPolygon') {
            return false;
          }
          
          // Check if coordinates exist and are valid
          if (!feature.geometry.coordinates || !Array.isArray(feature.geometry.coordinates)) {
            return false;
          }
          
          // Ensure coordinates array is not empty
          if (feature.geometry.coordinates.length === 0) {
            return false;
          }
          
          return true;
        })
        .map((feature: any) => {
          // Ensure each feature has the required structure
          return {
            type: 'Feature',
            geometry: feature.geometry,
            properties: feature.properties || {}
          };
        });

      if (validFeatures.length === 0) {
        console.warn('No valid polygon features found in countries GeoJSON');
        return;
      }

      console.log(`Processing ${validFeatures.length} valid features for globe`);

      // Add countries as flat polygons on the globe surface (altitude 0)
      // Set data first, then configure styling
      try {
        globe.polygonsData(validFeatures);
        
        // Configure polygon styling
        // Use a higher altitude to ensure polygons render well above the texture
        // Higher altitude ensures no z-fighting with the texture layer
        globe
          .polygonAltitude(0.02) // More elevated above surface to cover texture
          .polygonCapColor(() => '#ffffff') // Solid white fill (hex for full opacity)
          .polygonSideColor(() => '#ffffff') // White sides
          .polygonStrokeColor(() => '#7c96aa') // Border stroke
          .polygonLabel((d: any) => d?.properties?.name || '');
      } catch (polygonError) {
        console.error('Error setting polygon data:', polygonError);
        throw polygonError;
      }

      console.log(`Loaded ${validFeatures.length} countries on globe (filtered from ${countriesData.features.length} total)`);
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
    }
  };

  const loadPixelData = async (
    globe: any,
    indicator: ClimateIndicator,
    climateScenario: ClimateScenario,
    periodScenario: PeriodScenario
  ) => {
    try {
      // Map indicator name if needed (same as pixel route)
      const indicatorMapping: Record<string, string> = { 'SBOT': 'SBT' };
      const mappedIndicator = indicatorMapping[indicator.name] || indicator.name;

      // Fetch the full pixel JSON file
      const response = await fetch(
        `/api/pixel-data?indicator=${mappedIndicator}&climate=${climateScenario.name}&period=${periodScenario.name}`
      );

      if (!response.ok) {
        console.warn('Could not fetch pixel data:', response.statusText);
        return;
      }

      const pixelData = await response.json();
      
      if (!Array.isArray(pixelData) || pixelData.length === 0) {
        console.warn('Invalid pixel data format');
        return;
      }

      // Convert pixel data to points
      // Sample every 20th point for performance (259,200 points is too many)
      // This reduces to ~13,000 points instead of ~64,800
      const sampleRate = 20;
      const allPoints = GlobeDataService.convertPixelDataToPoints(
        pixelData,
        (entry) => {
          if (typeof entry === 'number') return entry;
          if (entry && typeof entry === 'object') {
            if (Array.isArray(entry.values) && entry.values.length > 0) {
              return entry.values[0]; // Use mean value
            }
            if (entry.value !== undefined) {
              return entry.value;
            }
            // Handle model data format
            if (typeof entry === 'object' && Object.keys(entry).length > 0) {
              const firstModel = Object.values(entry)[0] as any;
              if (firstModel && Array.isArray(firstModel.values) && firstModel.values.length > 0) {
                return firstModel.values[0];
              }
              if (firstModel && firstModel.value !== undefined) {
                return firstModel.value;
              }
            }
          }
          return null;
        }
      );

      // Sample points for performance
      const sampledPoints = GlobeDataService.samplePoints(allPoints, sampleRate);

      if (sampledPoints.length === 0) {
        console.warn('No valid points generated from pixel data');
        return;
      }

      // Get value range for color mapping
      const values = sampledPoints.map(p => p.value).filter(v => !isNaN(v));
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      const range = maxValue - minValue;

      // Map colors based on indicator colors
      const colorScale = indicator.colors || ['#4575b4', '#91bfdb', '#e0f3f8', '#fee090', '#fc8d59', '#d73027'];
      
      const pointsWithColors = sampledPoints.map(point => ({
        ...point,
        color: getColorForValue(point.value, minValue, maxValue, range, colorScale),
        radius: 0.3, // Small radius for points
      }));

      // Add points to globe
      globe
        .pointsData(pointsWithColors)
        .pointColor('color')
        .pointRadius('radius')
        .pointAltitude(0) // Points at surface level, below polygons
        .pointResolution(2);

      console.log(`Loaded ${pointsWithColors.length} points on globe`);

    } catch (error) {
      console.error('Error loading pixel data:', error);
    }
  };

  // Helper function to map value to color
  const getColorForValue = (
    value: number,
    min: number,
    max: number,
    range: number,
    colorScale: string[]
  ): string => {
    if (range === 0) return colorScale[Math.floor(colorScale.length / 2)];
    const normalized = (value - min) / range;
    const index = Math.floor(normalized * (colorScale.length - 1));
    return colorScale[Math.max(0, Math.min(index, colorScale.length - 1))];
  };

  return (
    <div className="w-full h-screen relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10 pointer-events-none">
          <div className="text-white text-lg">{loadingStatus || 'Loading globe...'}</div>
        </div>
      )}
      <div ref={globeEl} className="w-full h-full" />
    </div>
  );
}

