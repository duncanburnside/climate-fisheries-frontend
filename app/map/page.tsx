'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ClimateInfoService } from '@/lib/services/climate-info.service';
import { useNavbar } from '@/components/navbar-context';
import { MapTypes } from '@/lib/models/MapTypes';
import type { ClimateIndicator, ClimateScenario, PeriodScenario, ZoneData, ZoneResponse, ChartData } from '@/lib/models/ClimateTypes';
import MapContainerComponent from '@/components/map/map-container/map-container';
import ZoomControls from '@/components/map/zoom-controls';
import ColorbarDisplay from '@/components/map/colorbar-display';
import Sidebar from '@/components/map/sidebar';
import LeftSidebar from '@/components/map/left-sidebar';
import { Toast } from '@/components/ui/toast';

export default function MapPage() {
  const router = useRouter();
  const [showSideBar, setShowSideBar] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [data, setData] = useState<any>(null);
  const [title] = useState('ClimateFisheries.org');

  const [map, setMap] = useState<MapTypes>(MapTypes.Grid);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mapContainerRef = useRef<{ zoomIn: () => void; zoomOut: () => void; resetZoom: () => void } | null>(null);
  const hasTriggeredInitialLoad = useRef(false);

  const climateInfoService = new ClimateInfoService();
  const { setIndicatorLabel } = useNavbar();
  const [climateStressors, setClimateStressors] = useState<ClimateIndicator[]>([]);
  const [climateRisks, setClimateRisks] = useState<ClimateIndicator[]>([]);
  const [climateIndicatorSelected, setClimateIndicatorSelected] = useState<ClimateIndicator | null>(null);

  const [climateScenarios, setClimateScenarios] = useState<ClimateScenario[]>([]);
  const [climateScenarioSelected, setClimateScenarioSelected] = useState<ClimateScenario | null>(null);

  const [periodScenarios, setPeriodScenarios] = useState<PeriodScenario[]>([]);
  const [periodScenarioSelected, setPeriodScenarioSelected] = useState<PeriodScenario | null>(null);

  const [label, setLabel] = useState('');
  const [dataPlaceHolder, setDataPlaceHolder] = useState<number | string>(0);
  const [methodId, setMethodId] = useState('');

  const [colors, setColors] = useState<string[] | null>(null);
  const [showChart, setShowChart] = useState(false);
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      { label: 'Mean', fill: false, data: [], borderColor: '#000', backgroundColor: '#000' },
      { label: 'Min', fill: '-1', data: [], borderColor: '#000', backgroundColor: '#000' },
      { label: 'Max', fill: '-2', data: [], borderColor: '#000', backgroundColor: '#000' }
    ]
  });
  const [dataKeys, setDataKeys] = useState<string[]>([]);
  const [customRange, setCustomRange] = useState<{ start: string; end: string; startOpacity: number; endOpacity: number } | null>(null);
  const [customYearRange, setCustomYearRange] = useState<[number, number] | null>(null);
  
  // Get year range for the selected period
  const getPeriodYearRange = (periodName: string): [number, number] | null => {
    switch (periodName) {
      case 'present':
        return [1986, 2005];
      case 'mid':
        return [2040, 2060];
      case 'end':
        return [2080, 2099];
      default:
        return null;
    }
  };

  // Function to update chart X-axis labels
  const updateChartXAxis = (yearsRange: number[] | [number, number]) => {
    if (!yearsRange || yearsRange.length < 2) return;
    const labels = [];
    const startYear = yearsRange[0];
    const endYear = yearsRange[1];
    const yearStep = Math.ceil((endYear - startYear) / 5);
    
    for (let i = startYear; i <= endYear; i += yearStep) {
      labels.push(i.toString());
    }
    
    // Ensure the end year is included
    if (labels[labels.length - 1] !== endYear.toString()) {
      labels.push(endYear.toString());
    }
    
    setChartLabels(labels);
  };

  // Initialize data on component mount
  useEffect(() => {
    const indicators = climateInfoService.getClimateIndicators();
    const stressors = indicators.filter(ind => ind.type === 'stressor');
    const risks = indicators.filter(ind => ind.type === 'risk');
    const selected = indicators.find(ind => ind.id === 'SST') || indicators[0];
    
    setClimateStressors(stressors);
    setClimateRisks(risks);
    setClimateIndicatorSelected(selected);
    
    const scenarios = climateInfoService.getClimateScenarios();
    setClimateScenarios(scenarios);
    setClimateScenarioSelected(scenarios[0]);
    
    const periods = climateInfoService.getPeriodScenarios();
    setPeriodScenarios(periods);
    setPeriodScenarioSelected(periods[0]);

    setLabel(selected.label);
    setDataPlaceHolder(selected.dataPlaceholder || 0);
    setMethodId(selected.methodId);
    setColors(selected.colors);
    if (selected.yearsRange && selected.yearsRange.length >= 2) {
      updateChartXAxis(selected.yearsRange);
    }
  }, []);

  // Update navbar with indicator label
  useEffect(() => {
    if (climateIndicatorSelected) {
      setIndicatorLabel(climateIndicatorSelected.label);
    }
    return () => {
      setIndicatorLabel(null);
    };
  }, [climateIndicatorSelected, setIndicatorLabel]);

  // Force map to load on initial mount by triggering a scenario change
  useEffect(() => {
    if (climateScenarioSelected && climateIndicatorSelected && periodScenarioSelected && !hasTriggeredInitialLoad.current) {
      // Small delay to ensure map container is initialized
      const timer = setTimeout(() => {
        // Temporarily switch to a different scenario, then back to force re-render
        const scenarios = climateInfoService.getClimateScenarios();
        if (scenarios.length > 1) {
          const otherScenario = scenarios.find(s => s.id !== climateScenarioSelected.id);
          if (otherScenario) {
            setClimateScenarioSelected(otherScenario);
            setTimeout(() => {
              setClimateScenarioSelected(climateScenarioSelected);
              hasTriggeredInitialLoad.current = true;
            }, 100);
          } else {
            hasTriggeredInitialLoad.current = true;
          }
        } else {
          hasTriggeredInitialLoad.current = true;
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [climateScenarioSelected, climateIndicatorSelected, periodScenarioSelected]);

  const switchClimateIndicator = (indicator: ClimateIndicator) => {
    if (climateIndicatorSelected === indicator) return;

    setLabel(indicator.label);
    setDataPlaceHolder(indicator.dataPlaceholder);
    setMethodId(indicator.methodId);

    if (indicator.id === 'revenue') {
      setMap(MapTypes.Grid);
      setShowSideBar(false);
    } else if (climateIndicatorSelected?.id === 'revenue') {
      setShowSideBar(false);
    } else {
      if (
        indicator.yearsRange &&
        climateIndicatorSelected?.yearsRange &&
        (indicator.yearsRange[0] !== climateIndicatorSelected.yearsRange[0] ||
        indicator.yearsRange[1] !== climateIndicatorSelected.yearsRange[1])
      ) {
        updateChartXAxis(indicator.yearsRange);
      } else if (indicator.yearsRange && !climateIndicatorSelected?.yearsRange) {
        updateChartXAxis(indicator.yearsRange);
      }
    }

    setClimateIndicatorSelected(indicator);
    setColors(indicator.colors);
  };

  const switchClimateScenario = (scenario: ClimateScenario) => {
    setClimateScenarioSelected(scenario);
  };

  const switchPeriodScenario = (period: PeriodScenario) => {
    setPeriodScenarioSelected(period);
    // Clear custom range when switching periods so slider reflects the period
    setCustomYearRange(null);
  };

  const onMapTypeChange = (mapTypeValue: string | MapTypes) => {
    let mapType: MapTypes;
    if (typeof mapTypeValue === 'string') {
      mapType = MapTypes[mapTypeValue as keyof typeof MapTypes] as MapTypes;
    } else {
      mapType = mapTypeValue;
    }
    setMap(mapType);
    setShowSideBar(false);
  };

  const onZoneClicked = (clickedData: Record<string, any>) => {
    if (!clickedData) return;

    console.log('onZoneClicked received data:', clickedData);

    const processedData: Record<string, any> = {};
    for (const key in clickedData) {
      if (key !== 'years' && key !== 'chart' && clickedData[key]) {
        processedData[key] = {
          ...clickedData[key],
          mean: clickedData[key].mean !== null && clickedData[key].mean !== undefined ? (+clickedData[key].mean).toFixed(2) : undefined,
          min: clickedData[key].min !== null && clickedData[key].min !== undefined ? (+clickedData[key].min).toFixed(2) : undefined,
          max: clickedData[key].max !== null && clickedData[key].max !== undefined ? (+clickedData[key].max).toFixed(2) : undefined,
        };
      } else {
        processedData[key] = clickedData[key];
      }
    }
    
    console.log('Processed data:', processedData);
    console.log('Data keys:', Object.keys(processedData));

    if (processedData.years) {
      // Convert years object to arrays if needed
      let yearsData: Record<string, number | number[]> | (number | null)[][] | null = processedData.years;
      
      // If years is an object (not already an array of arrays), convert it
      if (yearsData && typeof yearsData === 'object' && !Array.isArray(yearsData)) {
        // Extract years and sort them
        let yearKeys = Object.keys(yearsData).filter(k => !isNaN(Number(k))).map(Number).sort((a, b) => a - b);
        
        // Filter years based on custom range or selected period
        if (customYearRange) {
          yearKeys = yearKeys.filter(year => year >= customYearRange[0] && year <= customYearRange[1]);
        } else if (periodScenarioSelected) {
          const periodRange = getPeriodYearRange(periodScenarioSelected.name);
          if (periodRange) {
            yearKeys = yearKeys.filter(year => year >= periodRange[0] && year <= periodRange[1]);
          }
        }
        
        // Convert to arrays: [mean_array, min_array, max_array]
        // Check if years object contains arrays [mean, min, max] or just single values
        const yearsObj = yearsData as Record<string, number | number[]>;
        const firstYearValue = yearsObj[yearKeys[0]?.toString()];
        const isArrayFormat = Array.isArray(firstYearValue) && firstYearValue.length >= 3;
        
        console.log('Raw years data structure:', {
          firstYearKey: yearKeys[0],
          firstYearValue,
          firstYearValueType: typeof firstYearValue,
          isArray: Array.isArray(firstYearValue),
          isArrayFormat,
          sampleYears: yearKeys.slice(0, 3).map(y => ({
            year: y,
            value: yearsObj[y.toString()],
            valueType: typeof yearsObj[y.toString()],
            isArray: Array.isArray(yearsObj[y.toString()]),
          })),
        });
        
        let meanValues: number[] = [];
        let minValues: (number | null)[] = [];
        let maxValues: (number | null)[] = [];
        
        if (isArrayFormat) {
          // Years object contains arrays: {1950: [mean, min, max], 1951: [mean, min, max], ...}
          meanValues = yearKeys.map(year => {
            const yearData = yearsObj[year.toString()] as number[];
            return Array.isArray(yearData) && yearData.length >= 1 ? yearData[0] : 0;
          });
          minValues = yearKeys.map(year => {
            const yearData = yearsObj[year.toString()] as number[];
            return Array.isArray(yearData) && yearData.length >= 2 ? yearData[1] : null;
          });
          maxValues = yearKeys.map(year => {
            const yearData = yearsObj[year.toString()] as number[];
            return Array.isArray(yearData) && yearData.length >= 3 ? yearData[2] : null;
          });
          
          console.log('Extracted from array format:', {
            firstYear: yearKeys[0],
            firstYearRaw: yearsObj[yearKeys[0].toString()],
            firstMean: meanValues[0],
            firstMin: minValues[0],
            firstMax: maxValues[0],
            allSame: meanValues[0] === minValues[0] && minValues[0] === maxValues[0],
          });
        } else {
          // Years object contains single values: {1950: mean, 1951: mean, ...}
          meanValues = yearKeys.map(year => {
            const value = yearsObj[year.toString()];
            return typeof value === 'number' ? value : 0;
          });
          // For single-value indicators, no min/max per year
          minValues = [];
          maxValues = [];
        }
        
        yearsData = [meanValues, minValues, maxValues] as (number | null)[][];
        console.log('Years data extracted (object format):', {
          isArrayFormat,
          meanLength: meanValues.length,
          minLength: minValues.length,
          maxLength: maxValues.length,
          hasMin: minValues.some(v => v !== null),
          hasMax: maxValues.some(v => v !== null),
          firstYearValue,
          sampleMin: minValues.slice(0, 5),
          sampleMax: maxValues.slice(0, 5),
          sampleMean: meanValues.slice(0, 5),
        });
        setChartLabels(yearKeys.map(y => y.toString()));
      } else if (Array.isArray(yearsData) && yearsData.length >= 3) {
        // Already in array format [mean, min, max]
        // Filter by period if needed
        let filteredData = yearsData;
        let filteredLabels: string[] = [];
        
        // Use custom year range if available, otherwise use period range
        if (customYearRange) {
          // Assuming years start from 1950 (index 0 = 1950)
          const startIndex = Math.max(0, customYearRange[0] - 1950);
          const endIndex = Math.min(yearsData[0].length - 1, customYearRange[1] - 1950);
          
          filteredData = [
            yearsData[0].slice(startIndex, endIndex + 1),
            yearsData[1]?.slice(startIndex, endIndex + 1) || [],
            yearsData[2]?.slice(startIndex, endIndex + 1) || []
          ];
          filteredLabels = Array.from({ length: endIndex - startIndex + 1 }, (_, i) => (1950 + startIndex + i).toString());
        } else if (periodScenarioSelected) {
          const periodRange = getPeriodYearRange(periodScenarioSelected.name);
          if (periodRange) {
            // Assuming years start from 1950 (index 0 = 1950)
            const startIndex = Math.max(0, periodRange[0] - 1950);
            const endIndex = Math.min(yearsData[0].length - 1, periodRange[1] - 1950);
            
            filteredData = [
              yearsData[0].slice(startIndex, endIndex + 1),
              yearsData[1]?.slice(startIndex, endIndex + 1) || [],
              yearsData[2]?.slice(startIndex, endIndex + 1) || []
            ];
            filteredLabels = Array.from({ length: endIndex - startIndex + 1 }, (_, i) => (1950 + startIndex + i).toString());
          } else {
            filteredLabels = yearsData[0]?.map((_: any, i: number) => (1950 + i).toString()) || [];
          }
        } else {
          filteredLabels = yearsData[0]?.map((_: any, i: number) => (1950 + i).toString()) || [];
        }
        
        yearsData = filteredData;
        setChartLabels(filteredLabels);
      } else {
        yearsData = null;
      }
      
      if (yearsData && Array.isArray(yearsData) && yearsData.length >= 3) {
        setShowChart(true);
        setChartData({
          labels: chartLabels,
          datasets: [
            {
              label: 'Mean',
              fill: false,
              data: yearsData[0] || [],
              borderColor: colors ? colors[2] : '#000',
              backgroundColor: colors ? colors[2] : '#000',
            },
            {
              label: 'Min',
              fill: '-1',
              data: yearsData[1] || [],
              borderColor: colors ? colors[0] : '#000',
              backgroundColor: colors ? colors[0] : '#000',
            },
            {
              label: 'Max',
              fill: '-2',
              data: yearsData[2] || [],
              borderColor: colors ? colors[colors.length - 1] : '#000',
              backgroundColor: colors ? colors[colors.length - 1] : '#000',
            }
          ]
        });
      } else {
        setShowChart(false);
      }
    } else {
      setShowChart(false);
    }

    setData(processedData);
    setDataKeys(Object.keys(processedData));
    setShowSideBar(true);
    setHidden(false);
  };
  
  // Re-filter chart data when period or custom year range changes
  useEffect(() => {
    if (data && data.years && showChart) {
      // Re-process the chart data with the new period filter
      const processedData: Record<string, any> = { ...data };
      if (processedData.years) {
        let yearsData: Record<string, number | number[]> | (number | null)[][] | null = processedData.years;
        
        if (yearsData && typeof yearsData === 'object' && !Array.isArray(yearsData)) {
          let yearKeys = Object.keys(yearsData).filter(k => !isNaN(Number(k))).map(Number).sort((a, b) => a - b);
          
          // Use custom year range if available, otherwise use period range
          if (customYearRange) {
            yearKeys = yearKeys.filter(year => year >= customYearRange[0] && year <= customYearRange[1]);
          } else if (periodScenarioSelected) {
            const periodRange = getPeriodYearRange(periodScenarioSelected.name);
            if (periodRange) {
              yearKeys = yearKeys.filter(year => year >= periodRange[0] && year <= periodRange[1]);
            }
          }
          
          // Check if years object contains arrays [mean, min, max] or just single values
          const yearsObj = yearsData as Record<string, number | number[]>;
          const firstYearValue = yearsObj[yearKeys[0]?.toString()];
          const isArrayFormat = Array.isArray(firstYearValue) && firstYearValue.length >= 3;
          
          let meanValues: number[] = [];
          let minValues: (number | null)[] = [];
          let maxValues: (number | null)[] = [];
          
          if (isArrayFormat) {
            // Years object contains arrays: {1950: [mean, min, max], 1951: [mean, min, max], ...}
            meanValues = yearKeys.map(year => {
              const yearData = yearsObj[year.toString()] as number[];
              return Array.isArray(yearData) && yearData.length >= 1 ? yearData[0] : 0;
            });
            minValues = yearKeys.map(year => {
              const yearData = yearsObj[year.toString()] as number[];
              return Array.isArray(yearData) && yearData.length >= 2 ? yearData[1] : null;
            });
            maxValues = yearKeys.map(year => {
              const yearData = yearsObj[year.toString()] as number[];
              return Array.isArray(yearData) && yearData.length >= 3 ? yearData[2] : null;
            });
          } else {
            // Years object contains single values: {1950: mean, 1951: mean, ...}
            meanValues = yearKeys.map(year => {
              const value = yearsObj[year.toString()];
              return typeof value === 'number' ? value : 0;
            });
            // For single-value indicators, no min/max per year
            minValues = [];
            maxValues = [];
          }
          
          setChartLabels(yearKeys.map(y => y.toString()));
          setChartData({
            labels: yearKeys.map(y => y.toString()),
            datasets: [
              {
                label: 'Mean',
                fill: false,
                data: meanValues,
                borderColor: colors ? colors[2] : '#000',
                backgroundColor: colors ? colors[2] : '#000',
              },
              {
                label: 'Min',
                fill: '-1',
                data: minValues,
                borderColor: colors ? colors[0] : '#000',
                backgroundColor: colors ? colors[0] : '#000',
              },
              {
                label: 'Max',
                fill: '-2',
                data: maxValues,
                borderColor: colors ? colors[colors.length - 1] : '#000',
                backgroundColor: colors ? colors[colors.length - 1] : '#000',
              }
            ]
          });
        }
      }
    }
  }, [periodScenarioSelected, customYearRange, data, showChart, colors]);

  const clickHyperlink = () => {
    if (!data) return;
    let baseUrl = 'http://www.seaaroundus.org/data/#/';
    if (map === MapTypes.FAO && data.fao) {
      baseUrl += 'fao/' + data.fao.id;
    } else if (map === MapTypes.EEZ && data.eez) {
      baseUrl += 'eez/' + data.eez.id;
    } else if (map === MapTypes.LME && data.lme) {
      baseUrl += 'lme/' + data.lme.id;
    }
    baseUrl += '?chart=catch-chart&dimension=taxon&measure=tonnage&limit=10';
    window.open(baseUrl, '_blank');
  };

  if (!climateIndicatorSelected || !climateScenarioSelected || !periodScenarioSelected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">

      {/* Left Sidebar */}
      <LeftSidebar
        climateScenarios={climateScenarios}
        climateScenarioSelected={climateScenarioSelected}
        onClimateScenarioChange={switchClimateScenario}
        periodScenarios={periodScenarios}
        periodScenarioSelected={periodScenarioSelected}
        onPeriodScenarioChange={switchPeriodScenario}
        climateIndicator={climateIndicatorSelected}
        map={map}
        onMapTypeChange={onMapTypeChange}
        climateStressors={climateStressors}
        climateRisks={climateRisks}
        onClimateIndicatorChange={switchClimateIndicator}
        methodId={methodId}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onRangeChange={setCustomRange}
        onYearRangeChange={setCustomYearRange}
      />

      {/* Map Container - Full Screen, accounting for left sidebar */}
      <div className={`fixed top-14 bottom-0 right-0 transition-all duration-300 ${sidebarCollapsed ? 'left-0' : 'left-[300px]'}`}>
        <MapContainerComponent
          ref={mapContainerRef}
          mapType={map}
          climateIndicator={climateIndicatorSelected}
          climateScenario={climateScenarioSelected}
          periodScenario={periodScenarioSelected}
          onZoneClicked={onZoneClicked}
          onLoadingChange={setIsLoading}
          customRange={customRange}
        />
      </div>

      <ZoomControls
        onZoomIn={() => mapContainerRef.current?.zoomIn()}
        onZoomOut={() => mapContainerRef.current?.zoomOut()}
        onResetZoom={() => mapContainerRef.current?.resetZoom()}
      />

      <ColorbarDisplay units={climateIndicatorSelected.units} />

      <Sidebar
        showSideBar={showSideBar}
        hidden={hidden}
        onToggle={() => setHidden(!hidden)}
        data={data}
        dataKeys={dataKeys}
        map={map}
        climateIndicator={climateIndicatorSelected}
        showChart={showChart}
        chartLabels={chartLabels}
        chartData={chartData}
        onHyperlinkClick={clickHyperlink}
      />

      {/* Toast Notification */}
      <Toast 
        message="Loading..." 
        visible={isLoading} 
        onClose={() => setIsLoading(false)} 
      />
    </div>
  );
}
