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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function MapPage() {
  const router = useRouter();
  const [showSideBar, setShowSideBar] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [data, setData] = useState<any>(null);
  const [title] = useState('Climate-Fisheries');

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

  useEffect(() => {
    const stressors = climateInfoService.getClimateStressors();
    const risks = climateInfoService.getClimateRisks();
    const scenarios = climateInfoService.getClimateScenarios();
    const periods = climateInfoService.getPeriodScenarios();

    setClimateStressors(stressors as ClimateIndicator[]);
    setClimateRisks(risks as ClimateIndicator[]);
    setClimateScenarios(scenarios as ClimateScenario[]);
    setPeriodScenarios(periods as PeriodScenario[]);

    const selected = stressors[0];
    setClimateIndicatorSelected(selected);
    setClimateScenarioSelected(scenarios[0]);
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

  const updateChartXAxis = (yearsRange: number[] | [number, number]) => {
    if (!yearsRange || yearsRange.length < 2) return;
    const labels = [];
    labels.push(yearsRange[0].toString());

    for (let i = yearsRange[0] + 1; i < yearsRange[1]; i++) {
      if (i % 25 === 0) {
        labels.push(i.toString());
      } else {
        labels.push('');
      }
    }
    labels.push(yearsRange[1].toString());
    setChartLabels(labels);
  };

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
      let yearsData: Record<string, number> | number[][] | null = processedData.years;
      
      // If years is an object (not already an array of arrays), convert it
      if (yearsData && typeof yearsData === 'object' && !Array.isArray(yearsData)) {
        // Extract years and sort them
        const yearKeys = Object.keys(yearsData).filter(k => !isNaN(Number(k))).map(Number).sort((a, b) => a - b);
        
        // Convert to arrays: [mean_array, min_array, max_array]
        // For SST and similar indicators, we only have mean values per year
        const yearsObj = yearsData as Record<string, number>;
        const meanValues = yearKeys.map(year => yearsObj[year.toString()] || 0);
        
        // For indicators with min/max, we'd need those values per year
        // For now, check if we have min/max in the zone data
        const zoneDataKey = Object.keys(processedData).find(k => k !== 'years' && k !== 'chart');
        const zoneData = zoneDataKey ? processedData[zoneDataKey] : null;
        const hasMinMax = zoneData && (zoneData.min !== null || zoneData.max !== null);
        
        // Create min/max arrays - if we have min/max values, use them (but years object only has mean)
        // For now, we'll use empty arrays for min/max since years object only contains mean values
        const minValues = hasMinMax ? Array(yearKeys.length).fill(null) : [];
        const maxValues = hasMinMax ? Array(yearKeys.length).fill(null) : [];
        
        yearsData = [meanValues, minValues, maxValues];
        setChartLabels(yearKeys.map(y => y.toString()));
      } else if (Array.isArray(yearsData) && yearsData.length >= 3) {
        // Already in array format [mean, min, max]
        setChartLabels(yearsData[0]?.map((_: any, i: number) => (1950 + i).toString()) || []);
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


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2);
            }
            return label;
          }
        }
      },
      legend: {
        labels: {
          color: 'white'
        }
      }
    },
    elements: {
      point: {
        hitRadius: 5,
        radius: 0
      },
      line: {
        tension: 0,
        borderWidth: 2
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
          color: 'white',
          font: { size: 12 },
          maxRotation: 45,
          minRotation: 0,
          callback: (value: any, index: number) => {
            const label = chartLabels[index];
            return label === '' ? '' : label;
          }
        }
      },
      y: {
        ticks: {
          color: 'white',
          font: { size: 12 },
          callback: (value: any, index: number, ticks: any) => {
            if (index === 0 || index === ticks.length - 1) {
              return '';
            }
            return Number(value).toFixed(1);
          }
        }
      }
    }
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
        chartOptions={chartOptions}
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
