'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import * as d3 from 'd3';
import { MapTypes } from '@/lib/models/MapTypes';
import { MapService } from '@/lib/services/map.service';
import { DataService } from '@/lib/services/data.service';

interface MapContainerProps {
  mapType: MapTypes;
  climateIndicator: any;
  climateScenario: any;
  periodScenario: any;
  onZoneClicked: (data: any) => void;
  onLoadingChange?: (loading: boolean) => void;
  customRange?: { start: string; end: string; startOpacity: number; endOpacity: number } | null;
}

export interface MapContainerHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

const MapContainerComponent = forwardRef<MapContainerHandle, MapContainerProps>(function MapContainerComponent({
  mapType,
  climateIndicator,
  climateScenario,
  periodScenario,
  onZoneClicked,
  onLoadingChange,
  customRange
}, ref) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const divRef = useRef<any>(null);
  const svgRef = useRef<any>(null);
  const gRef = useRef<any>(null);
  const backgroundRef = useRef<any>(null);
  const zonesRef = useRef<any>(null);
  const countriesRef = useRef<any>(null);
  const zoomRef = useRef<any>(null);
  const projectionRef = useRef<any>(null);
  const pathGeneratorRef = useRef<any>(null);
  
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [width, setWidth] = useState(3000);
  const [height, setHeight] = useState(1500);
  const [zoomFactor, setZoomFactor] = useState(1);
  
  const colorsRef = useRef<any>(null);
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

  const mapService = new MapService();
  const dataService = new DataService();

  const zoomMinRef = useRef(0.01);
  const zoomMaxRef = useRef(100);
  const zoomStepRef = useRef(2);
  const isEnforcingZoomRef = useRef(false);
  const oceanColor = '#F0F8FF';
  const oceanFillColor = '#F0F8FF';
  const countriesColor = '#fff';
  const borderColor = '#7c96aa';
  
  const strokeScale = d3.scaleLinear().domain([0, 3000]).range([0, 0.2]);

  useEffect(() => {
    if (!mapRef.current) return;

    imageColorbarRef.current = dataService.getImageColorbars();
    zoneColorbarRef.current = dataService.getZoneColorbars();

    initMap();
    
    setTimeout(() => {
      drawCountries();
      drawAntarctica();
      if (mapType !== MapTypes.Grid) {
        drawZones();
      }
    }, 200);

    return () => {
      if (svgRef.current) {
        svgRef.current.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!svgRef.current || !climateIndicator) return;

    colorsRef.current = climateIndicator.colors;
    switchScenario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [climateIndicator, climateScenario, periodScenario]);

  useEffect(() => {
    if (!svgRef.current || !climateIndicator || !climateScenario || !periodScenario) return;
    if (!backgroundRef.current || !projectionRef.current) return;

    if (mapType === MapTypes.Grid && climateIndicator.id !== 'revenue') {
      const existingImage = backgroundRef.current.select('image');
      if (existingImage.empty()) {
        drawBackground(customRange || undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapType, climateIndicator?.id, climateScenario?.id, periodScenario?.id]);

  useEffect(() => {
    if (!svgRef.current || !climateIndicator || !backgroundRef.current || !projectionRef.current) {
      const retryTimer = setTimeout(() => {
        if (svgRef.current && climateIndicator && backgroundRef.current && projectionRef.current) {
          if (mapType === MapTypes.Grid && climateIndicator.id !== 'revenue') {
            backgroundRef.current.selectAll('image').remove();
            backgroundRef.current.selectAll('rect').remove();
            drawBackground(customRange || undefined);
          }
        }
      }, 300);
      return () => clearTimeout(retryTimer);
    }
    
    const timer = setTimeout(() => {
      if (zonesRef.current) {
        zonesRef.current.selectAll('path.mapFeature').remove();
      }

      if (mapType === MapTypes.Grid) {
        if (climateIndicator.id !== 'revenue') {
          backgroundRef.current.selectAll('image').remove();
          backgroundRef.current.selectAll('rect').remove();
          drawBackground(customRange || undefined);
        }
        drawCountries();
        drawAntarctica();
        if (climateIndicator.id === 'revenue') {
          if (backgroundRef.current) {
            backgroundRef.current.selectAll('image').remove();
            backgroundRef.current.selectAll('rect').remove();
          }
          drawBackground(customRange || undefined);
        }
      } else {
        drawZones();
        if (backgroundRef.current) {
          backgroundRef.current.selectAll('image').remove();
          backgroundRef.current.selectAll('rect').remove();
          const fillX = 0;
          const fillY = windowHeight / 2 - height / 2;
          const fillWidth = windowWidth;
          const fillHeight = height;

          backgroundRef.current
            .append('rect')
            .style('cursor', 'pointer')
            .attr('fill', oceanFillColor)
            .attr('width', fillWidth)
            .attr('height', fillHeight)
            .attr('x', fillX)
            .attr('y', fillY)
            .on('click', (event: any, d: any) => {
              handleClick(event, d);
            });
        }
        drawCountries();
        drawAntarctica();
      }
    }, 50);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapType, climateIndicator?.id]);

  useEffect(() => {
    const handleResize = () => {
      if (!svgRef.current?.node()) return;
      
      const newWidth = svgRef.current.node().getBoundingClientRect().width;
      const newHeight = svgRef.current.node().getBoundingClientRect().height;
      
      setWindowWidth(newWidth);
      setWindowHeight(newHeight);
      setWidth(newWidth);
      setHeight(newWidth / 2);

      const newProjection = d3
        .geoEquirectangular()
        .translate([newWidth / 2, newHeight / 2])
        .scale(newWidth / (2 * Math.PI));

      projectionRef.current = newProjection;
      pathGeneratorRef.current = d3.geoPath().projection(newProjection);

      if (zoomRef.current) {
        zoomRef.current.scaleExtent([0.01, 100]);
      }

      if (divRef.current) {
        divRef.current.selectAll('path').attr('d', pathGeneratorRef.current);
        
        if (backgroundRef.current) {
          const mapHeight = newWidth / 2;
          const imageWidth = newWidth;
          const imageHeight = mapHeight;
          backgroundRef.current
            .select('image')
            .attr('width', imageWidth)
            .attr('height', imageHeight)
            .attr('x', 0)
            .attr('y', newHeight / 2 - imageHeight / 2);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const initMap = () => {
    if (!mapRef.current) return;

    divRef.current = d3.select(mapRef.current);
    
    svgRef.current = divRef.current
      .append('svg')
      .style('background-color', oceanColor)
      .attr('width', '100%')
      .attr('height', '100%')
      .style('cursor', 'default');

    zoomRef.current = d3
      .zoom()
      .scaleExtent([0.01, 100])
      .filter((event: any) => {
        const sourceEvent = event.sourceEvent;
        if (sourceEvent) {
          if (sourceEvent.type === 'mousedown' || sourceEvent.type === 'mousemove' || sourceEvent.type === 'click' || sourceEvent.type === 'mouseup') {
            return false;
          }
        }
        return true;
      })
      .on('zoom', (event: any) => {
        zoomed(event);
      })

    gRef.current = svgRef.current.append('g');
    svgRef.current.call(zoomRef.current);

    backgroundRef.current = gRef.current.append('g').attr('id', 'background');
    zonesRef.current = gRef.current.append('g').attr('id', 'zones');
    countriesRef.current = gRef.current.append('g').attr('id', 'countries').raise();

    const rect = svgRef.current.node().getBoundingClientRect();
    const newWidth = rect.width;
    const newHeight = rect.height;

    setWindowWidth(newWidth);
    setWindowHeight(newHeight);
    setWidth(newWidth);
    setHeight(newWidth / 2);
    
    const projection = d3
      .geoEquirectangular()
      .translate([newWidth / 2, newHeight / 2])
      .scale(newWidth / (2 * Math.PI));

    projectionRef.current = projection;
    pathGeneratorRef.current = d3.geoPath().projection(projection);
  };

  const drawCountries = async () => {
    try {
      const data = await mapService.getCountries();
      const features = data.features;
      initRevenuesColorbar(features);

      if (!countriesRef.current || !pathGeneratorRef.current) {
        setTimeout(() => drawCountries(), 100);
        return;
      }

      countriesRef.current.selectAll('path.mapFeature.countries').remove();

      const countriesSelection = countriesRef.current
        .selectAll('path.mapFeature.countries')
        .data(features);
      
      countriesSelection
        .enter()
        .append('path')
        .attr('d', pathGeneratorRef.current)
        .attr('class', 'mapFeature countries')
        .attr('vector-effect', 'non-scaling-stroke')
        .style('fill', countriesColor)
        .style('fill-opacity', 1)
        .style('stroke', borderColor)
        .style('stroke-width', 1)
        .style('pointer-events', 'none');

      countriesSelection
        .attr('d', pathGeneratorRef.current)
        .attr('vector-effect', 'non-scaling-stroke')
        .style('fill', countriesColor)
        .style('fill-opacity', 1)
        .style('stroke', borderColor)
        .style('stroke-width', 1)
        .style('pointer-events', 'none');

      countriesSelection.exit().remove();
    } catch (error) {
      console.error('Error loading countries:', error);
    }
  };

  const drawAntarctica = async () => {
    try {
      const data = await mapService.getAntarctica();
      
      if (!countriesRef.current || !pathGeneratorRef.current) {
        setTimeout(() => drawAntarctica(), 100);
        return;
      }

      countriesRef.current.selectAll('path.mapFeature.antarctica').remove();

      const antarcticaFeature = data.type === 'Feature' ? data : data.features?.[0];
      if (!antarcticaFeature) {
        console.warn('Antarctica data not found');
        return;
      }

      const antarcticaSelection = countriesRef.current
        .selectAll('path.mapFeature.antarctica')
        .data([antarcticaFeature]);
      
      antarcticaSelection
        .enter()
        .append('path')
        .attr('d', pathGeneratorRef.current)
        .attr('class', 'mapFeature antarctica')
        .attr('vector-effect', 'non-scaling-stroke')
        .style('fill', countriesColor)
        .style('fill-opacity', 1)
        .style('stroke', borderColor)
        .style('stroke-width', 1)
        .style('pointer-events', 'none');

      antarcticaSelection
        .attr('d', pathGeneratorRef.current)
        .attr('vector-effect', 'non-scaling-stroke')
        .style('fill', countriesColor)
        .style('fill-opacity', 1)
        .style('stroke', borderColor)
        .style('stroke-width', 1)
        .style('pointer-events', 'none');

      antarcticaSelection.exit().remove();
    } catch (error) {
      console.error('Error loading Antarctica:', error);
    }
  };

  const drawBackground = (customRange?: { start: string; end: string; startOpacity: number; endOpacity: number }) => {
    if (!backgroundRef.current || !projectionRef.current) return;

    backgroundRef.current.selectAll('rect').remove();

    if (climateIndicator.id !== 'revenue' && imageColorbarRef.current) {
      const imageX = 0;
      const imageY = windowHeight / 2 - height / 2;
      const imageWidth = windowWidth;
      const imageHeight = height;

      // If custom range is provided, blend multiple PNGs
      if (customRange && mapType === MapTypes.Grid) {
        // Get existing images
        const existingImages = backgroundRef.current.selectAll('image');
        
        // Add start period image at full opacity
        const startImageUrl = `/assets/images/indicators/${climateIndicator.name}/${climateScenario.name}/${customRange.start}.png`;
        const startImage = backgroundRef.current
          .append('image')
          .style('cursor', 'pointer')
          .style('opacity', 0)
          .attr('href', startImageUrl)
          .attr('width', imageWidth)
          .attr('height', imageHeight)
          .attr('x', imageX)
          .attr('y', imageY)
          .attr('preserveAspectRatio', 'none')
          .on('click', (event: any, d: any) => {
            handleClick(event, d);
          });

        // Add end period image at specified opacity
        const endImageUrl = `/assets/images/indicators/${climateIndicator.name}/${climateScenario.name}/${customRange.end}.png`;
        const endImage = backgroundRef.current
          .append('image')
          .style('cursor', 'pointer')
          .style('opacity', 0)
          .attr('href', endImageUrl)
          .attr('width', imageWidth)
          .attr('height', imageHeight)
          .attr('x', imageX)
          .attr('y', imageY)
          .attr('preserveAspectRatio', 'none')
          .on('click', (event: any, d: any) => {
            handleClick(event, d);
          });

        // Fade out old images while fading in new ones (cross-fade)
        existingImages
          .transition()
          .duration(1000)
          .style('opacity', 0)
          .remove();

        // Fade in both images
        startImage
          .transition()
          .duration(1000)
          .style('opacity', customRange.startOpacity);
        
        endImage
          .transition()
          .duration(1000)
          .style('opacity', customRange.endOpacity);
      } else {
        // Single image mode - cross-fade transition for Grid map type
        const imageUrl = `/assets/images/indicators/${climateIndicator.name}/${climateScenario.name}/${periodScenario.name}.png`;
        console.log('Loading PNG image:', imageUrl);

        if (mapType === MapTypes.Grid) {
          // Get existing images for cross-fade
          const existingImages = backgroundRef.current.selectAll('image');
          
          // Add new image behind existing ones (so it appears on top after fade)
          const newImage = backgroundRef.current
            .insert('image', ':first-child') // Insert at the beginning so it's behind
            .style('cursor', 'pointer')
            .style('opacity', 0)
            .attr('href', imageUrl)
            .attr('width', imageWidth)
            .attr('height', imageHeight)
            .attr('x', imageX)
            .attr('y', imageY)
            .attr('preserveAspectRatio', 'none')
            .on('click', (event: any, d: any) => {
              handleClick(event, d);
            });

          // Cross-fade: fade out old images while fading in new one
          existingImages
            .transition()
            .duration(1000)
            .style('opacity', 0)
            .remove();

          newImage
            .transition()
            .duration(1000)
            .style('opacity', 1);
        } else {
          // For non-Grid maps, just replace immediately
          backgroundRef.current.selectAll('image').remove();
          
          const newImage = backgroundRef.current
            .append('image')
            .style('cursor', 'pointer')
            .style('opacity', 1)
            .attr('href', imageUrl)
            .attr('width', imageWidth)
            .attr('height', imageHeight)
            .attr('x', imageX)
            .attr('y', imageY)
            .attr('preserveAspectRatio', 'none')
            .on('click', (event: any, d: any) => {
              handleClick(event, d);
            });
        }
      }

      if (imageColorbarRef.current[climateIndicator.name]) {
        const colorbar = imageColorbarRef.current[climateIndicator.name];
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

        drawColorbar();
      }
    } else {
      const fillX = 0;
      const fillY = windowHeight / 2 - height / 2;
      const fillWidth = windowWidth;
      const fillHeight = height;

      backgroundRef.current
        .append('rect')
        .style('cursor', 'pointer')
        .attr('fill', oceanFillColor)
        .attr('width', fillWidth)
        .attr('height', fillHeight)
        .attr('x', fillX)
        .attr('y', fillY)
        .on('click', (event: any, d: any) => {
          handleClick(event, d);
        });
    }
  };

  const drawZones = async () => {
    if (mapType === MapTypes.Grid) {
      return;
    }
    
    try {
      const mapTypeStr = MapTypes[mapType] as string;
      const data = await mapService.getZoneAsset(mapTypeStr);
      
      if (!zonesRef.current) return;

      zonesRef.current.selectAll(`path.mapFeature.mapType-${mapType}`).remove();

      const zonesSelection = zonesRef.current
        .selectAll(`path.mapFeature.mapType-${mapType}`)
        .data(data.features);

      setZoneInfo();
      drawFeatures(zonesSelection);
    } catch (error) {
      console.error('Error loading zones:', error);
    }
  };

  const setZoneInfo = () => {
    if (!zoneColorbarRef.current) return;

    const mapTypeStr = MapTypes[mapType] as string;
    const indicatorName = climateIndicator.name;
    const colorbar = zoneColorbarRef.current[mapTypeStr][indicatorName];
    
    const newMinVal = colorbar[1];
    const newMaxVal = colorbar[2];
    
    setMinVal(newMinVal);
    setMaxVal(newMaxVal);
    
    const minDisp = getColorbarDisplay(newMinVal);
    const maxDisp = getColorbarDisplay(newMaxVal);
    
    setMinDisplay(minDisp as number);
    setMaxDisplay(maxDisp as number);

    drawColorbar();
  };

  const fillFeatures = (countries = false) => {
    if (!zonesRef.current) return;

    if (countries) {
      return;
    }

    if (climateIndicator.id === 'revenue') {
      zonesRef.current
        .selectAll(`path.mapFeature.mapType-${mapType}`)
        .style('fill', (d: any) => getColor(d.properties[climateScenario.name]))
        .style('cursor', 'pointer');
    } else {
      zonesRef.current
        .selectAll(`path.mapFeature.mapType-${mapType}`)
        .style('fill', (d: any) => {
          if (d.properties[climateIndicator.name]) {
            const value = d.properties[climateIndicator.name][climateScenario.name][periodScenario.name];
            return getColor(value);
          } else {
            return oceanColor;
          }
        })
        .style('cursor', (d: any) => {
          if (!d.properties[climateIndicator.name]) {
            return 'grab';
          }
          return 'pointer';
        });
    }
  };

  const drawFeatures = (featuresSelection: any, countries = false) => {
    if (!pathGeneratorRef.current) return;

    const container = countries ? countriesRef.current : zonesRef.current;
    if (!container) return;

    if (!countries) {
      const existingPaths = container.selectAll(`path.mapFeature.mapType-${mapType}`);
      existingPaths.remove();
    }

    const paths = featuresSelection
      .enter()
      .append('path')
      .attr('d', pathGeneratorRef.current)
        .attr('class', `mapFeature mapType-${countries ? MapTypes.Grid : mapType}`)
        .attr('vector-effect', 'non-scaling-stroke')
        .style('fill', countries ? countriesColor : oceanColor)
        .style('fill-opacity', 1)
        .style('stroke', borderColor)
        .style('stroke-width', 1)
        .style('pointer-events', countries ? 'none' : 'all')
        .on('mouseover', (event: any, d: any) => {
        if (!countries) handleMouseover(event, d);
      })
      .on('mouseout', (event: any, d: any) => {
        if (!countries) handleMouseout(event, d);
      })
      .on('click', (event: any, d: any) => {
        if (!countries)           handleClick(event, d);
        });

    featuresSelection
      .attr('d', pathGeneratorRef.current)
      .attr('vector-effect', 'non-scaling-stroke')
      .style('stroke-width', 1);

    if (!countries) {
      fillFeatures(countries);
    }
  };

  const drawColorbar = () => {
    const colorbarContainer = document.getElementById('color-bar-svg');
    if (!colorbarContainer || !colorsRef.current) return;

    d3.select(colorbarContainer).selectAll('svg').remove();

    const svg = d3
      .select('#color-bar-svg')
      .append('svg')
      .attr('width', '200')
      .attr('height', '40')
      .append('g');

    const legend = svg
      .selectAll('.legend')
      .data(colorsRef.current)
      .enter()
      .append('g')
      .attr('transform', (d: any, i: number) => `translate(${30 + i * 25}, 0)`);

    legend
      .append('rect')
      .attr('width', 25)
      .attr('height', 25)
      .style('fill', (d: any, i: number) => colorsRef.current[i]);

    legend
      .append('text')
      .attr('y', 35)
      .attr('text-anchor', (d: any, i: number) => {
        if (i === 0) return 'middle';
        if (i === 3) return 'start';
        if (i === 5) return 'end';
        return 'middle';
      })
      .text((d: any, i: number) => {
        if (i === 0) return `< ${minDisplay}`;
        if (i === 3) return medianDisplay.toString();
        if (i === 5) return `> ${maxDisplay}`;
        return '';
      });
  };

  const zoomed = (event: any) => {
    if (!gRef.current || isEnforcingZoomRef.current) return;
    
    const { transform } = event;
    gRef.current.attr('transform', transform);
    const k = transform.k;
    setZoomFactor(k);

    if (divRef.current) {
      divRef.current
        .selectAll('path')
        .attr('vector-effect', 'non-scaling-stroke')
        .style('stroke-width', 1);
    }
  };

  const handleMouseover = (event: any, d: any) => {
    if (shouldIgnoreZone(d)) return;

    d3.select(event.currentTarget)
      .transition()
      .duration(100)
      .attr('opacity', 0.5);
  };

  const handleMouseout = (event: any, d: any) => {
    if (shouldIgnoreZone(d)) return;

    d3.select(event.currentTarget)
      .transition()
      .duration(100)
      .attr('opacity', 1);
  };

  const roundCoordinate = (coordinate: number): number => {
    return Math.round((coordinate + 0.25) * 2) / 2 - 0.25;
  };

  const centerCoordinates = (coordinates: number[]): number[] => {
    return [
      roundCoordinate(coordinates[0]),
      roundCoordinate(coordinates[1])
    ];
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

  const emitCoordinatesData = async (coordinates: number[]) => {
    const [latitude, longitude] = coordinates;
    const latDir = latitude >= 0 ? 'N' : 'S';
    const lonDir = longitude >= 0 ? 'E' : 'W';
    dataRef.current.cell = {
      name: `${Math.abs(latitude).toFixed(2)}°${latDir}, ${Math.abs(longitude).toFixed(2)}°${lonDir}`,
      coordinates: coordinates
    };

    setIsLoading(true);
    onLoadingChange?.(true);

    try {
      const response = await mapService.getPixel(
        climateIndicator.name,
        climateScenario.name,
        periodScenario.name,
        coordinates[0],
        coordinates[1]
      );

      if (response && Object.keys(response).length > 0) {
        console.log('Pixel API response:', response);
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
            console.warn(`Model ${model} has invalid or missing data:`, modelData);
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

          console.log(`Storing data for ${model}:`, data);
          dataRef.current[model.toLowerCase()] = data;
        });
        
        if (cellValues.length > 0) {
          const cellMean = cellValues.reduce((sum, val) => sum + val, 0) / cellValues.length;
          const cellMin = cellMins.length > 0 ? Math.min(...cellMins) : null;
          const cellMax = cellMaxs.length > 0 ? Math.max(...cellMaxs) : null;
          
          dataRef.current.cell = {
            ...dataRef.current.cell,
            mean: cellMean,
            min: cellMin,
            max: cellMax
          };
        }
        
        console.log('Final dataRef.current:', dataRef.current);
      } else {
        console.warn('Pixel API response is empty or invalid:', response);
      }

      onZoneClicked(dataRef.current);
    } catch (error: any) {
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ECONNREFUSED' && error.code !== 'ETIMEDOUT') {
        console.warn('API not available:', error);
      }
      onZoneClicked(dataRef.current);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  };

  const emitZoneData = async (model: string, id: string, name: string) => {
    setIsLoading(true);
    onLoadingChange?.(true);
    
    const basicData: any = {
      id: id,
      name: name,
      mean: null,
      min: null,
      max: null
    };
    
    dataRef.current[model.toLowerCase()] = basicData;
    
    try {
      const response = await mapService.getZone(
        model,
        climateIndicator.name,
        climateScenario.name,
        periodScenario.name,
        id
      );

      if (response && typeof response === 'object') {
        const data: any = {
          id: id,
          name: name,
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
          if (dataRef.current.years) {
            dataRef.current.years.forEach((arr: number[]) => {
              arr.forEach((value: number, j: number) => {
                arr[j] = value * 10;
              });
            });
          }
          if (dataRef.current.chart) {
            dataRef.current.chart.forEach((value: number, index: number) => {
              dataRef.current.chart[index] = value * 10;
            });
          }
        }

        dataRef.current[model.toLowerCase()] = data;
      }
      
      onZoneClicked(dataRef.current);
    } catch (error: any) {
      // Log error details for debugging
      const errorDetails: any = {
        model,
        indicator: climateIndicator.name,
        climate: climateScenario.name,
        period: periodScenario.name,
        id,
        errorCode: error?.code,
        errorMessage: error?.message,
        errorStatus: error?.response?.status,
        errorStatusText: error?.response?.statusText,
        errorResponse: error?.response?.data,
        errorName: error?.name,
        errorStack: error?.stack
      };
      
      if (error?.code === 'ERR_NETWORK' || error?.code === 'ECONNREFUSED' || error?.code === 'ETIMEDOUT') {
        // API not running - network error
        console.warn('Zone API network error:', errorDetails);
      } else if (error?.response?.status === 404) {
        // Zone data file not found
        console.warn('Zone data file not found:', errorDetails);
      } else {
        // Other error
        console.error('Error getting zone data:', errorDetails);
      }
      onZoneClicked(dataRef.current);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  };

  const emitRevenueData = () => {
    if (!lastRevenueZoneRef.current) return;

    dataRef.current.country = {
      id: lastRevenueZoneRef.current.properties.id,
      name: lastRevenueZoneRef.current.properties.name,
      mean: lastRevenueZoneRef.current.properties[climateScenario.name].toFixed(2)
    };

    onZoneClicked(dataRef.current);
  };

  const handleClick = (event: any, d: any) => {
    event.stopPropagation();
    
    resetData();

    if (d && shouldIgnoreZone(d)) return;

    if (mapType === MapTypes.Grid && climateIndicator.id !== 'revenue') {
      const [x, y] = d3.pointer(event);
      const coordinates = centerCoordinates(projectionRef.current.invert([x, y]));
      emitCoordinatesData(coordinates);
    } else if (mapType === MapTypes.Grid && climateIndicator.id === 'revenue') {
      if (!d) return;
      lastRevenueZoneRef.current = d;
      emitRevenueData();
    } else {
      if (!d || !d.properties) return;
      const model = MapTypes[mapType] as string;
      const id = d.properties.id;
      const name = d.properties.name;
      emitZoneData(model, id, name);
    }
  };

  const shouldIgnoreZone = (d: any): boolean => {
    if (!d || !d.properties) return false;
    return (
      climateIndicator.id !== 'revenue' &&
      (d.properties[climateScenario.name] !== undefined ||
        !d.properties[climateIndicator.name])
    );
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

  const initRevenuesColorbar = (features: any) => {
    if (!features || features.length === 0) return;

    let minRev = features[0].properties['26'];
    let maxRev = features[0].properties['26'];

    const revenues: number[] = [];
    features.forEach((feature: any) => {
      for (const climate of ['26', '85']) {
        const revenue = feature.properties[climate];
        revenues.push(revenue);
        if (minRev > revenue) {
          minRev = revenue;
        }
        if (maxRev < revenue) {
          maxRev = revenue;
        }
      }
    });

    const medianRev = getColorbarDisplay(revenues[Math.floor(revenues.length / 2)]);
    const minRevDisp = getColorbarDisplay(minRev);
    const maxRevDisp = getColorbarDisplay(maxRev);
    
    setMedianRevenue(medianRev as number);
    setMinRevenue(minRevDisp as number);
    setMaxRevenue(maxRevDisp as number);
  };

  const switchScenario = () => {
    if (!climateIndicator) return;
    
    colorsRef.current = climateIndicator.colors;

    if (mapType === MapTypes.Grid && climateIndicator.id !== 'revenue') {
      if (zonesRef.current) {
        zonesRef.current.selectAll('path.mapFeature').remove();
      }
      if (backgroundRef.current && projectionRef.current) {
        backgroundRef.current.selectAll('image').remove();
        backgroundRef.current.selectAll('rect').remove();
        drawBackground(customRange || undefined);
      } else {
        setTimeout(() => {
          if (backgroundRef.current && projectionRef.current) {
            backgroundRef.current.selectAll('image').remove();
            backgroundRef.current.selectAll('rect').remove();
            drawBackground(customRange || undefined);
          }
        }, 100);
      }
      drawCountries();
      drawAntarctica();
    } else if (mapType === MapTypes.Grid) {
      if (zonesRef.current) {
        zonesRef.current.selectAll('path.mapFeature').remove();
      }
      if (backgroundRef.current) {
        backgroundRef.current.selectAll('image').remove();
        backgroundRef.current.selectAll('rect').remove();
      }
      drawBackground();
      const minRev = getColorbarDisplay(minRevenue);
      const maxRev = getColorbarDisplay(maxRevenue);
      setMinDisplay(minRev as number);
      setMinVal(minRev as number);
      setMaxDisplay(maxRev as number);
      setMaxVal(maxRev as number);
      drawColorbar();
      fillFeatures();
      drawCountries();
      drawAntarctica();
    } else {
      if (backgroundRef.current) {
        backgroundRef.current.selectAll('image').remove();
        backgroundRef.current.selectAll('rect').remove();
      }
      if (backgroundRef.current) {
        const fillX = 0;
        const fillY = windowHeight / 2 - height / 2;
        const fillWidth = windowWidth;
        const fillHeight = height;

        backgroundRef.current
          .append('rect')
          .style('cursor', 'pointer')
          .attr('fill', oceanFillColor)
          .attr('width', fillWidth)
          .attr('height', fillHeight)
          .attr('x', fillX)
          .attr('y', fillY)
          .on('click', (event: any, d: any) => {
            handleClick(event, d);
          });
      }
      setZoneInfo();
      fillFeatures();
      drawCountries();
      drawAntarctica();
    }
  };

  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (zoomRef.current && svgRef.current) {
        const newFactor = zoomFactor * zoomStepRef.current;
        setZoomFactor(newFactor);
        zoomRef.current.scaleTo(svgRef.current, newFactor);
      }
    },
    zoomOut: () => {
      if (zoomRef.current && svgRef.current) {
        const newFactor = zoomFactor / zoomStepRef.current;
        setZoomFactor(newFactor);
        zoomRef.current.scaleTo(svgRef.current, newFactor);
      }
    },
    resetZoom: () => {
      if (zoomRef.current && svgRef.current && gRef.current) {
        setZoomFactor(1);
        zoomRef.current.scaleTo(svgRef.current, 1);
        gRef.current.attr('transform', 'translate(0,0) scale(1)');
      }
    }
  }), [zoomFactor]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} id="map-container" className="w-full h-full" />
    </div>
  );
});

export default MapContainerComponent;

