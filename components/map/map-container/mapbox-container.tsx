'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import MapGL, { Source, Layer, Image as MapImage } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapTypes } from '@/lib/models/MapTypes';
import { MapService } from '@/lib/services/map.service';
import type { ClimateIndicator, ClimateScenario, PeriodScenario } from '@/lib/models/ClimateTypes';

interface MaplibreContainerProps {
  mapType: MapTypes;
  climateIndicator: ClimateIndicator;
  climateScenario: ClimateScenario;
  periodScenario: PeriodScenario;
  onZoneClicked: (data: any) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export interface MapboxContainerHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

const MaplibreContainerComponent = forwardRef<MapboxContainerHandle, MaplibreContainerProps>(function MaplibreContainerComponent({
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

  const mapService = new MapService();

  // Load GeoJSON data based on map type
  useEffect(() => {
    const loadGeoJSON = async () => {
      if (mapType === MapTypes.Grid) {
        // For Grid, load countries
        try {
          const countries = await mapService.getCountries();
          setCountriesData(countries);
        } catch (error) {
          console.error('Error loading countries:', error);
        }
      } else {
        // For zone maps, load the appropriate GeoJSON
        try {
          const zoneData = await mapService.getZoneAsset(MapTypes[mapType] as string);
          setGeoJsonData(zoneData);
        } catch (error) {
          console.error('Error loading zone data:', error);
        }
      }
    };

    loadGeoJSON();
  }, [mapType]);

  // Expose zoom methods via ref
  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (mapRef.current) {
        const currentZoom = viewState.zoom;
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
  }), [viewState.zoom]);

  // MapLibre doesn't require an access token - it's open source!

  // Handle zone clicks
  const handleZoneClick = async (event: any) => {
    const feature = event.features?.[0];
    if (!feature) return;

    setIsLoading(true);
    onLoadingChange?.(true);

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

      onZoneClicked({
        [model.toLowerCase()]: {
          id: zoneId,
          name: zoneName,
          mean: response.mean,
          min: response.min,
          max: response.max
        }
      });
    } catch (error) {
      console.error('Error fetching zone data:', error);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  };

  // Get image URL for Grid maps
  const getImageUrl = () => {
    if (mapType === MapTypes.Grid && climateIndicator.id !== 'revenue') {
      return `/assets/images/indicators/${climateIndicator.name}/${climateScenario.name}/${periodScenario.name}.png`;
    }
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <div className="relative w-full h-full">
      <MapGL
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle={{
          version: 8,
          sources: {
            'raster-tiles': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'simple-tiles',
              type: 'raster',
              source: 'raster-tiles',
              minzoom: 0,
              maxzoom: 22
            }
          ],
          glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
        }}
        projection={{ name: 'equirectangular' }}
        interactiveLayerIds={mapType !== MapTypes.Grid ? ['zones'] : []}
        onClick={mapType !== MapTypes.Grid ? handleZoneClick : undefined}
      >
        {/* Countries layer for Grid maps */}
        {mapType === MapTypes.Grid && countriesData && (
          <Source id="countries" type="geojson" data={countriesData}>
            <Layer
              id="countries-fill"
              type="fill"
              paint={{
                'fill-color': '#ffffff',
                'fill-opacity': 0.8
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
        )}

        {/* Zone layers for non-Grid maps */}
        {mapType !== MapTypes.Grid && geoJsonData && (
          <Source id="zones" type="geojson" data={geoJsonData}>
            <Layer
              id="zones-fill"
              type="fill"
              paint={{
                'fill-color': '#4575b4',
                'fill-opacity': 0.6
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

        {/* PNG overlay for Grid maps */}
        {imageUrl && (
          <MapImage
            id="indicator-overlay"
            url={imageUrl}
            coordinates={[
              [-180, 90], // top-left
              [180, 90],  // top-right
              [180, -90], // bottom-right
              [-180, -90] // bottom-left
            ]}
          />
        )}

        {/* Raster layer for PNG overlay */}
        {imageUrl && (
          <Layer
            id="indicator-layer"
            type="raster"
            source="indicator-overlay"
            paint={{
              'raster-opacity': 0.85
            }}
          />
        )}
      </MapGL>
    </div>
  );
});

export default MaplibreContainerComponent;

