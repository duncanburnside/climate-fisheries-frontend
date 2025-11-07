'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback, useMemo } from 'react';
import MapGL, { Source, Layer, Image as MapImage } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as d3 from 'd3';
import { MapTypes } from '@/lib/models/MapTypes';
import { MapService } from '@/lib/services/map.service';
import { DataService } from '@/lib/services/data.service';
import type { ClimateIndicator, ClimateScenario, PeriodScenario } from '@/lib/models/ClimateTypes';

interface MaplibreContainerProps {
  mapType: MapTypes;
  climateIndicator: ClimateIndicator;
  climateScenario: ClimateScenario;
  periodScenario: PeriodScenario;
  onZoneClicked: (data: any) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export interface MaplibreContainerHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

const MaplibreContainerComponent = forwardRef<MaplibreContainerHandle, MaplibreContainerProps>(function MaplibreContainerComponent({
  mapType,
  climateIndicator,
  climateScenario,
  periodScenario,
  onZoneClicked,
  onLoadingChange
}, ref) {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 1.5
  });
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [countriesData, setCountriesData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const sourcesInitializedRef = useRef<Set<string>>(new Set());
  
  const mapService = new MapService();
  const dataService = new DataService();
  
  const colorsRef = useRef<string[] | null>(null);
  const [minVal, setMinVal] = useState(0);
  const [maxVal, setMaxVal] = useState(0);
  const [medianVal, setMedianVal] = useState(0);
  const [minDisplay, setMinDisplay] = useState(0);
  const [maxDisplay, setMaxDisplay] = useState(0);
  const [medianDisplay, setMedianDisplay] = useState(0);
  const [minRevenue, setMinRevenue] = useState(0);
  const [maxRevenue, setMaxRevenue] = useState(0);
  const [medianRevenue, setMedianRevenue] = useState(0);
  
  const imageColorbarRef = useRef<any>(null);
  const zoneColorbarRef = useRef<any>(null);
  const lastRevenueZoneRef = useRef<any>(null);
  const dataRef = useRef<any>({
    cell: null,
    lme: null,
    eez: null,
    fao: null,
    bgcp: null,
    country: null,
    years: null,
    chart: null
  });

  useEffect(() => {
    imageColorbarRef.current = dataService.getImageColorbars();
    zoneColorbarRef.current = dataService.getZoneColorbars();
    colorsRef.current = climateIndicator.colors;
  }, [climateIndicator]);

  useEffect(() => {
    const loadGeoJSON = async () => {
      try {
        const countries = await mapService.getCountries();
        setCountriesData(countries);
        
        if (mapType === MapTypes.Grid && climateIndicator.id === 'revenue') {
          initRevenuesColorbar(countries);
        }
      } catch (error) {
        console.error('Error loading countries:', error);
      }

      if (mapType === MapTypes.Grid) {
        setGeoJsonData(null);
      } else {
        try {
          const zoneData = await mapService.getZoneAsset(MapTypes[mapType] as string);
          setGeoJsonData(zoneData);
          setZoneInfo(zoneData);
        } catch (error) {
          console.error('Error loading zone data:', error);
        }
      }
    };

    loadGeoJSON();
  }, [mapType, climateIndicator, climateScenario, periodScenario]);

  const coloredGeoJsonData = useMemo(() => {
    if (!geoJsonData || mapType === MapTypes.Grid) return { type: 'FeatureCollection', features: [] };
    
    colorsRef.current = climateIndicator.colors;
    
    return {
      ...geoJsonData,
      features: geoJsonData.features.map((feature: any) => {
        const properties = { ...feature.properties };
        let color = '#F0F8FF';
        
        if (climateIndicator.id === 'revenue') {
          const value = properties[climateScenario.name];
          if (value !== undefined && value !== null) {
            color = getColor(value);
          }
        } else {
          if (properties[climateIndicator.name]) {
            const value = properties[climateIndicator.name][climateScenario.name]?.[periodScenario.name];
            if (value !== undefined && value !== null) {
              color = getColor(value);
            }
          }
        }
        
        return {
          ...feature,
          properties: {
            ...properties,
            color
          }
        };
      })
    };
  }, [geoJsonData, climateIndicator, climateScenario, periodScenario, minVal, maxVal, mapType]);


  const setZoneInfo = (zoneData: any) => {
    if (!zoneColorbarRef.current || !zoneData) return;

    const mapTypeStr = MapTypes[mapType] as string;
    const indicatorName = climateIndicator.name;
    const colorbar = zoneColorbarRef.current[mapTypeStr]?.[indicatorName];
    
    if (!colorbar) return;
    
    const newMinVal = colorbar[1];
    const newMaxVal = colorbar[2];
    const newMedianVal = colorbar[0];
    
    setMinVal(newMinVal);
    setMaxVal(newMaxVal);
    setMedianVal(newMedianVal);
    
    const minDisp = getColorbarDisplay(newMinVal);
    const maxDisp = getColorbarDisplay(newMaxVal);
    const medianDisp = getColorbarDisplay(newMedianVal);
    
    setMinDisplay(minDisp as number);
    setMaxDisplay(maxDisp as number);
    setMedianDisplay(medianDisp as number);
  };

  const initRevenuesColorbar = (features: any) => {
    if (!features || features.length === 0) return;

    let minRev = features[0].properties['26'];
    let maxRev = features[0].properties['26'];

    const revenues: number[] = [];
    features.forEach((feature: any) => {
      for (const climate of ['26', '85']) {
        const revenue = feature.properties[climate];
        if (revenue !== undefined && revenue !== null) {
          revenues.push(revenue);
          if (minRev > revenue) {
            minRev = revenue;
          }
          if (maxRev < revenue) {
            maxRev = revenue;
          }
        }
      }
    });

    const medianRev = getColorbarDisplay(revenues[Math.floor(revenues.length / 2)]);
    const minRevDisp = getColorbarDisplay(minRev);
    const maxRevDisp = getColorbarDisplay(maxRev);
    
    setMedianRevenue(medianRev as number);
    setMinRevenue(minRevDisp as number);
    setMaxRevenue(maxRevDisp as number);
    
    setMinVal(minRevDisp as number);
    setMaxVal(maxRevDisp as number);
    setMedianVal(medianRev as number);
    
    setMinDisplay(minRevDisp as number);
    setMaxDisplay(maxRevDisp as number);
    setMedianDisplay(medianRev as number);
  };

  const getColorbarDisplay = (value: number): number | string => {
    let adjustedValue = value;
    if (climateIndicator.name === 'MCP') {
      adjustedValue *= 10;
    }
    return adjustedValue < 0 ? parseFloat(adjustedValue.toFixed(2)) : Math.floor(adjustedValue);
  };

  const getColor = (value: number): string => {
    if (!colorsRef.current) return '#ffffff';

    const step = d3
      .scaleLinear()
      .domain([1, 6])
      .range([minVal, maxVal]);

    const color = d3
      .scaleLinear()
      .domain([minVal, step(2), step(3), step(4), step(5), maxVal])
      .range(colorsRef.current);

    if (value < minVal) {
      return String(color(minVal));
    } else if (value > maxVal) {
      return String(color(maxVal));
    } else {
      return String(color(value));
    }
  };

  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (mapRef.current) {
        mapRef.current.zoomIn({ duration: 300 });
      }
    },
    zoomOut: () => {
      if (mapRef.current) {
        mapRef.current.zoomOut({ duration: 300 });
      }
    },
    resetZoom: () => {
      if (mapRef.current) {
        setViewState({
          longitude: 0,
          latitude: 0,
          zoom: 1.5
        });
      }
    }
  }), []);

  const handleZoneClick = useCallback(async (event: any) => {
    const feature = event.features?.[0];
    if (!feature) return;

    setIsLoading(true);
    onLoadingChange?.(true);

    resetData();

    try {
      const zoneId = feature.properties?.id;
      const zoneName = feature.properties?.name;
      const model = MapTypes[mapType] as string;

      const response = await mapService.getZone(
        model,
        climateIndicator.name,
        climateScenario.name,
        periodScenario.name,
        zoneId
      );

      const data: any = {
        id: zoneId,
        name: zoneName,
        mean: response.mean ?? null,
        min: response.min ?? null,
        max: response.max ?? null
      };

      if (response.years) {
        dataRef.current.years = response.years;
      }
      if (response.chart) {
        dataRef.current.chart = response.chart;
      }

      if (climateIndicator.name === 'MCP' && data.mean !== null) {
        data.mean *= 10;
        if (data.min !== null) data.min *= 10;
        if (data.max !== null) data.max *= 10;
      }

      dataRef.current[model.toLowerCase()] = data;
      onZoneClicked(dataRef.current);
    } catch (error: any) {
      console.error('Error fetching zone data:', error);
      const basicData: any = {
        [MapTypes[mapType].toLowerCase()]: {
          id: feature.properties?.id,
          name: feature.properties?.name,
          mean: null,
          min: null,
          max: null
        }
      };
      onZoneClicked(basicData);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  }, [mapType, climateIndicator, climateScenario, periodScenario, onZoneClicked, onLoadingChange]);

  const handleGridClick = useCallback(async (event: any) => {
    if (climateIndicator.id === 'revenue') {
      const feature = event.features?.[0];
      if (!feature) return;
      
      lastRevenueZoneRef.current = feature;
      await emitRevenueData();
      return;
    }

    const lngLat = event.lngLat;
    if (!lngLat) return;

    setIsLoading(true);
    onLoadingChange?.(true);

    resetData();

    try {
      const response = await mapService.getPixel(
        climateIndicator.name,
        climateScenario.name,
        periodScenario.name,
        lngLat.lat,
        lngLat.lng
      );

      if (response && Object.keys(response).length > 0) {
        const cellValues: number[] = [];
        const cellMins: number[] = [];
        const cellMaxs: number[] = [];
        
        Object.entries(response).forEach(([model, modelData]: [string, any]) => {
          let data: any;
          if (modelData.values && Array.isArray(modelData.values)) {
            data = {
              name: modelData.names || model,
              mean: modelData.values[0] ?? null,
              min: modelData.values[1] ?? null,
              max: modelData.values[2] ?? null
            };
          } else if (modelData.value !== undefined && modelData.value !== null) {
            data = {
              name: modelData.name || model,
              id: modelData.id || null,
              mean: modelData.value ?? null,
              min: null,
              max: null
            };
          } else {
            return;
          }

          if (climateIndicator.name === 'MCP' && data.mean !== null) {
            data.mean *= 10;
            if (data.min !== null) data.min *= 10;
            if (data.max !== null) data.max *= 10;
          }

          if (data.mean !== null && data.mean !== undefined) {
            cellValues.push(data.mean);
          }
          if (data.min !== null && data.min !== undefined) {
            cellMins.push(data.min);
          }
          if (data.max !== null && data.max !== undefined) {
            cellMaxs.push(data.max);
          }

          dataRef.current[model.toLowerCase()] = data;
        });
        
        if (cellValues.length > 0) {
          const cellMean = cellValues.reduce((sum, val) => sum + val, 0) / cellValues.length;
          const cellMin = cellMins.length > 0 ? Math.min(...cellMins) : null;
          const cellMax = cellMaxs.length > 0 ? Math.max(...cellMaxs) : null;
          
          const latDir = lngLat.lat >= 0 ? 'N' : 'S';
          const lonDir = lngLat.lng >= 0 ? 'E' : 'W';
          
          dataRef.current.cell = {
            name: `${Math.abs(lngLat.lat).toFixed(2)}°${latDir}, ${Math.abs(lngLat.lng).toFixed(2)}°${lonDir}`,
            coordinates: `${Math.abs(lngLat.lat).toFixed(2)}°${latDir}, ${Math.abs(lngLat.lng).toFixed(2)}°${lonDir}`,
            mean: cellMean,
            min: cellMin,
            max: cellMax
          };
        }
      }

      onZoneClicked(dataRef.current);
    } catch (error: any) {
      console.error('Error fetching pixel data:', error);
      const latDir = lngLat.lat >= 0 ? 'N' : 'S';
      const lonDir = lngLat.lng >= 0 ? 'E' : 'W';
      dataRef.current.cell = {
        name: `${Math.abs(lngLat.lat).toFixed(2)}°${latDir}, ${Math.abs(lngLat.lng).toFixed(2)}°${lonDir}`,
        coordinates: `${Math.abs(lngLat.lat).toFixed(2)}°${latDir}, ${Math.abs(lngLat.lng).toFixed(2)}°${lonDir}`,
        mean: null,
        min: null,
        max: null
      };
      onZoneClicked(dataRef.current);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  }, [climateIndicator, climateScenario, periodScenario, onZoneClicked, onLoadingChange]);

  const emitRevenueData = async () => {
    if (!lastRevenueZoneRef.current) return;

    resetData();

    setIsLoading(true);
    onLoadingChange?.(true);

    try {
      const feature = lastRevenueZoneRef.current;
      const zoneId = feature.properties?.id;
      const zoneName = feature.properties?.name;

      const response = await mapService.getZone(
        'Grid',
        climateIndicator.name,
        climateScenario.name,
        periodScenario.name,
        zoneId
      );

      const data: any = {
        id: zoneId,
        name: zoneName,
        mean: response.mean ?? null,
        min: response.min ?? null,
        max: response.max ?? null
      };

      if (response.years) {
        dataRef.current.years = response.years;
      }
      if (response.chart) {
        dataRef.current.chart = response.chart;
      }

      dataRef.current.grid = data;
      onZoneClicked(dataRef.current);
    } catch (error: any) {
      console.error('Error fetching revenue data:', error);
      onZoneClicked(dataRef.current);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  };

  const resetData = () => {
    dataRef.current = {
      cell: null,
      lme: null,
      eez: null,
      fao: null,
      bgcp: null,
      country: null,
      years: null,
      chart: null
    };
  };

  const getImageUrl = () => {
    if (mapType === MapTypes.Grid && climateIndicator.id !== 'revenue') {
      return `/assets/images/indicators/${climateIndicator.name}/${climateScenario.name}/${periodScenario.name}.png`;
    }
    return null;
  };

  const imageUrl = getImageUrl();

  useEffect(() => {
    if (mapType === MapTypes.Grid && climateIndicator.id !== 'revenue') {
      const colorbar = imageColorbarRef.current?.[climateIndicator.name];
      if (colorbar) {
        const newMedianVal = colorbar[0];
        const newMinVal = colorbar[1];
        const newMaxVal = colorbar[2];
        
        setMedianVal(newMedianVal);
        setMinVal(newMinVal);
        setMaxVal(newMaxVal);
        
        const minDisp = getColorbarDisplay(newMinVal);
        const maxDisp = getColorbarDisplay(newMaxVal);
        const medianDisp = getColorbarDisplay(newMedianVal);
        
        setMinDisplay(minDisp as number);
        setMaxDisplay(maxDisp as number);
        setMedianDisplay(medianDisp as number);
      }
    } else if (mapType === MapTypes.Grid && climateIndicator.id === 'revenue') {
      const minRev = getColorbarDisplay(minRevenue);
      const maxRev = getColorbarDisplay(maxRevenue);
      const medianRev = getColorbarDisplay(medianRevenue);
      
      setMinDisplay(minRev as number);
      setMaxDisplay(maxRev as number);
      setMedianDisplay(medianRev as number);
      
      setMinVal(minRev as number);
      setMaxVal(maxRev as number);
      setMedianVal(medianRev as number);
    }
  }, [mapType, climateIndicator, climateScenario, periodScenario, minRevenue, maxRevenue, medianRevenue]);

  useEffect(() => {
    if (!mapRef.current || !imageUrl) return;

    const map = mapRef.current.getMap();
    if (!map) return;

    const addImageOverlay = () => {
      const sourceExists = sourcesInitializedRef.current.has('indicator-overlay-source');
      
      if (sourceExists) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          if (map.hasImage('indicator-overlay')) {
            map.removeImage('indicator-overlay');
          }
          map.addImage('indicator-overlay', canvas);
        };
        img.src = imageUrl;
        return;
      }

      if (map.getLayer('indicator-layer')) {
        map.removeLayer('indicator-layer');
      }
      if (map.getSource('indicator-overlay-source')) {
        map.removeSource('indicator-overlay-source');
      }
      if (map.hasImage('indicator-overlay')) {
        map.removeImage('indicator-overlay');
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        map.addImage('indicator-overlay', canvas);
        
        const worldBounds = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [-180, 90],
                  [180, 90],
                  [180, -90],
                  [-180, -90],
                  [-180, 90]
                ]]
              },
              properties: {}
            }
          ]
        };
        
        map.addSource('indicator-overlay-source', {
          type: 'geojson',
          data: worldBounds
        });
        sourcesInitializedRef.current.add('indicator-overlay-source');
        
        map.addLayer({
          id: 'indicator-layer',
          type: 'fill',
          source: 'indicator-overlay-source',
          paint: {
            'fill-pattern': 'indicator-overlay',
            'fill-opacity': 0.85
          }
        }, 'countries-fill');
      };
      img.onerror = (error) => {
        console.error('Error loading indicator image:', imageUrl, error);
      };
      img.src = imageUrl;
    };

    if (map.loaded()) {
      addImageOverlay();
    } else {
      map.once('load', addImageOverlay);
    }

    return () => {};
  }, [imageUrl]);

  return (
    <div className="relative w-full h-full">
      <MapGL
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle={{
          version: 8,
          sources: {},
          layers: [
            {
              id: 'background',
              type: 'background',
              paint: {
                'background-color': '#F0F8FF'
              }
            }
          ],
          glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
        }}
        projection={{ name: 'equirectangular' }}
        interactiveLayerIds={mapType !== MapTypes.Grid ? ['zones-fill'] : []}
        onClick={mapType !== MapTypes.Grid ? handleZoneClick : handleGridClick}
      >
        {mapType !== MapTypes.Grid && (
          <Source key="zones" id="zones" type="geojson" data={coloredGeoJsonData || { type: 'FeatureCollection', features: [] }}>
            <Layer
              id="zones-fill"
              type="fill"
              paint={{
                'fill-color': ['get', 'color'],
                'fill-opacity': 0.8
              }}
            />
            <Layer
              id="zones-stroke"
              type="line"
              paint={{
                'line-color': '#7c96aa',
                'line-width': 1
              }}
            />
          </Source>
        )}

        <Source key="countries" id="countries" type="geojson" data={countriesData || { type: 'FeatureCollection', features: [] }}>
          <Layer
            id="countries-fill"
            type="fill"
            paint={{
              'fill-color': '#ffffff',
              'fill-opacity': 1
            }}
          />
          <Layer
            id="countries-stroke"
            type="line"
            paint={{
              'line-color': '#7c96aa',
              'line-width': 0.5
            }}
          />
        </Source>
      </MapGL>
    </div>
  );
});

export default MaplibreContainerComponent;
