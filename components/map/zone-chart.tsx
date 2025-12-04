'use client';

import { useState, useMemo, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import type { ClimateIndicator } from '@/lib/models/ClimateTypes';

interface ZoneChartProps {
  chartLabels: string[];
  chartData: {
    labels?: string[];
    datasets: {
      label: string;
      fill: boolean | string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
  climateIndicator: ClimateIndicator;
}

type ChartType = 'line' | 'area' | 'bar' | 'table';

export default function ZoneChart({ chartLabels, chartData, climateIndicator }: ZoneChartProps) {
  const [activeTab, setActiveTab] = useState<ChartType>('line');
  const [useFullHeight, setUseFullHeight] = useState(false); // Default to auto (false)

  // Get unit label from indicator (decode HTML entities)
  const unitLabel = useMemo(() => {
    const units = climateIndicator.units || '';
    // Decode HTML entities like &#176; to °
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = units;
    return tempDiv.textContent || tempDiv.innerText || units;
  }, [climateIndicator.units]);

  // Format number: show decimal places until more than 2 consecutive zeros appear
  // Also handles floating-point precision errors by rounding first
  const formatNumber = useCallback((value: number): string => {
    if (value === null || value === undefined || isNaN(value)) {
      return '';
    }
    
    // First, round to 10 decimal places to handle floating-point precision errors
    // This normalizes values like 15.199999999999999 to 15.2
    const rounded = Math.round(value * 10000000000) / 10000000000;
    
    // Convert to string with high precision to analyze decimal places
    // Use toFixed with high precision to avoid scientific notation
    const str = rounded.toFixed(15);
    
    // If no decimal point, return as is
    if (!str.includes('.')) {
      return str;
    }
    
    const [integerPart, decimalPart] = str.split('.');
    
    // Cap at 4 decimal places maximum
    const maxDecimals = Math.min(decimalPart.length, 4);
    let workingDecimal = decimalPart.substring(0, maxDecimals);
    
    // Find where 3 or more consecutive zeros start (more than 2 zeros)
    let truncateIndex = workingDecimal.length;
    let consecutiveZeros = 0;
    
    for (let i = 0; i < workingDecimal.length; i++) {
      if (workingDecimal[i] === '0') {
        consecutiveZeros++;
        if (consecutiveZeros >= 3) {
          // Found 3+ consecutive zeros, truncate before the first zero of this sequence
          truncateIndex = i - consecutiveZeros + 1;
          break;
        }
      } else {
        consecutiveZeros = 0;
      }
    }
    
    // If we found a truncation point, use it
    if (truncateIndex < workingDecimal.length) {
      const truncatedDecimal = workingDecimal.substring(0, truncateIndex);
      // Remove trailing zeros
      const cleaned = truncatedDecimal.replace(/0+$/, '');
      return cleaned ? `${integerPart}.${cleaned}` : integerPart;
    }
    
    // Otherwise return the number, removing trailing zeros
    const cleaned = workingDecimal.replace(/0+$/, '');
    return cleaned ? `${integerPart}.${cleaned}` : integerPart;
  }, []);

  // Prepare data for ECharts
  const echartsData = useMemo(() => {
    const meanData = chartData.datasets.find(d => d.label === 'Mean')?.data || [];
    const minData = chartData.datasets.find(d => d.label === 'Min')?.data || [];
    const maxData = chartData.datasets.find(d => d.label === 'Max')?.data || [];
    
    // Debug: log the data structure
    console.log('Chart data structure:', {
      meanLength: meanData.length,
      minLength: minData.length,
      maxLength: maxData.length,
      minSample: minData.slice(0, 5),
      maxSample: maxData.slice(0, 5),
      meanSample: meanData.slice(0, 5),
    });
    
    // Filter out null values and create pairs for area chart
    const validIndices: number[] = [];
    const processedMean: number[] = [];
    const processedMin: (number | null)[] = [];
    const processedMax: (number | null)[] = [];
    const processedLabels: string[] = [];

    meanData.forEach((value, index) => {
      if (value !== null && value !== undefined && !isNaN(value)) {
        validIndices.push(index);
        processedMean.push(value);
        processedLabels.push(chartLabels[index] || String(index));
        // Only add min/max if they have actual values, don't fall back to mean
        if (minData[index] !== null && minData[index] !== undefined && !isNaN(minData[index])) {
          processedMin.push(minData[index] as number);
        } else {
          processedMin.push(null);
        }
        if (maxData[index] !== null && maxData[index] !== undefined && !isNaN(maxData[index])) {
          processedMax.push(maxData[index] as number);
        } else {
          processedMax.push(null);
        }
      }
    });

    console.log('Processed echarts data:', {
      meanLength: processedMean.length,
      minLength: processedMin.length,
      maxLength: processedMax.length,
      hasMin: processedMin.some(v => v !== null),
      hasMax: processedMax.some(v => v !== null),
      minSample: processedMin.slice(0, 5),
      maxSample: processedMax.slice(0, 5),
    });

    return {
      labels: processedLabels,
      mean: processedMean,
      min: processedMin,
      max: processedMax,
    };
  }, [chartLabels, chartData]);

  const meanColor = chartData.datasets.find(d => d.label === 'Mean')?.borderColor || '#ffffff';
  const minColor = chartData.datasets.find(d => d.label === 'Min')?.borderColor || '#3b82f6';
  const maxColor = chartData.datasets.find(d => d.label === 'Max')?.borderColor || '#ef4444';

  // Calculate data range for auto-scaling
  const dataRange = useMemo(() => {
    const allValues: number[] = [];
    
    // Collect all valid values from all datasets
    echartsData.mean.forEach(v => {
      if (v !== null && v !== undefined && !isNaN(v)) allValues.push(v);
    });
    echartsData.min.forEach(v => {
      if (v !== null && v !== undefined && !isNaN(v)) allValues.push(v);
    });
    echartsData.max.forEach(v => {
      if (v !== null && v !== undefined && !isNaN(v)) allValues.push(v);
    });

    if (allValues.length === 0) {
      return { min: 0, max: 100 };
    }

    const dataMin = Math.min(...allValues);
    const dataMax = Math.max(...allValues);
    const range = dataMax - dataMin;
    
    // Add 10% padding on each side
    const padding = range * 0.1;
    
    return {
      min: dataMin - padding, // Allow negative values
      max: dataMax + padding,
    };
  }, [echartsData]);

  // Line chart option
  const lineOption = useMemo(() => ({
    backgroundColor: 'transparent',
    animation: false, // Disable animations for instant updates
    grid: {
      left: '10%',
      right: '10%',
      top: '15%',
      bottom: '15%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#666',
      textStyle: {
        color: '#fff',
      },
      formatter: (params: any) => {
        let result = `<div style="margin-bottom: 4px;"><strong>${params[0].axisValue}</strong></div>`;
        params.forEach((param: any) => {
          if (param.value !== null && param.value !== undefined && !isNaN(param.value)) {
            result += `<div>${param.marker} ${param.seriesName}: ${formatNumber(param.value)}</div>`;
          }
        });
        return result;
      },
    },
    legend: {
      data: [
        ...(echartsData.mean.length > 0 ? [unitLabel] : []),
        ...(echartsData.min.some(v => v !== null && v !== undefined) ? ['Min'] : []),
        ...(echartsData.max.some(v => v !== null && v !== undefined) ? ['Max'] : []),
      ],
      textStyle: {
        color: '#fff',
      },
      top: 10,
    },
    xAxis: {
      type: 'category',
      data: echartsData.labels,
      axisLabel: {
        color: '#fff',
        rotate: 45,
        interval: Math.floor(echartsData.labels.length / 10),
      },
      axisLine: {
        lineStyle: {
          color: '#fff',
        },
      },
    },
    yAxis: {
      type: 'value',
      min: useFullHeight ? undefined : dataRange.min,
      max: useFullHeight ? undefined : dataRange.max,
      axisLabel: {
        color: '#fff',
        formatter: (value: number) => formatNumber(value),
      },
      axisLine: {
        lineStyle: {
          color: '#fff',
        },
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    series: [
      ...(echartsData.mean.length > 0 ? [{
        name: unitLabel,
        type: 'line',
        data: echartsData.mean,
        smooth: false,
        lineStyle: {
          color: meanColor,
          width: 2,
        },
        itemStyle: {
          color: meanColor,
        },
        symbol: 'circle',
        symbolSize: 4,
      }] : []),
      ...(echartsData.min.length > 0 && echartsData.min.some(v => v !== null) ? [{
        name: 'Min',
        type: 'line',
        data: echartsData.min,
        smooth: false,
        lineStyle: {
          color: minColor,
          width: 2,
        },
        itemStyle: {
          color: minColor,
        },
        symbol: 'circle',
        symbolSize: 4,
      }] : []),
      ...(echartsData.max.length > 0 && echartsData.max.some(v => v !== null) ? [{
        name: 'Max',
        type: 'line',
        data: echartsData.max,
        smooth: false,
        lineStyle: {
          color: maxColor,
          width: 2,
        },
        itemStyle: {
          color: maxColor,
        },
        symbol: 'circle',
        symbolSize: 4,
      }] : []),
    ],
  }), [echartsData, meanColor, minColor, maxColor, chartData, useFullHeight, dataRange, unitLabel]);

  // Area chart option (with filled area for mean)
  const areaOption = useMemo(() => {
    const hasMinMax = echartsData.min.some(v => v !== null) && echartsData.max.some(v => v !== null);
    
    return {
      ...lineOption,
      animation: false, // Disable animations for instant updates
      series: [
        // Mean line with area fill
        ...(echartsData.mean.length > 0 ? [{
          name: unitLabel,
          type: 'line',
          data: echartsData.mean,
          smooth: false,
          lineStyle: {
            color: meanColor,
            width: 2,
          },
          itemStyle: {
            color: meanColor,
          },
          symbol: 'circle',
          symbolSize: 4,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: meanColor + '60' },
                { offset: 1, color: meanColor + '00' },
              ],
            },
          },
        }] : []),
        // Min and Max lines (for reference)
        ...(hasMinMax ? [
          {
            name: 'Min',
            type: 'line',
            data: echartsData.min,
            smooth: false,
            lineStyle: {
              color: minColor,
              width: 1,
              type: 'dashed',
              opacity: 0.7,
            },
            itemStyle: {
              color: minColor,
            },
            symbol: 'none',
          },
          {
            name: 'Max',
            type: 'line',
            data: echartsData.max,
            smooth: false,
            lineStyle: {
              color: maxColor,
              width: 1,
              type: 'dashed',
              opacity: 0.7,
            },
            itemStyle: {
              color: maxColor,
            },
            symbol: 'none',
          },
        ] : []),
      ],
    };
  }, [lineOption, echartsData, meanColor, minColor, maxColor, useFullHeight, dataRange, unitLabel]);

  // Bar chart option
  const barOption = useMemo(() => ({
    ...lineOption,
    animation: false, // Disable animations for instant updates
    series: [
      ...(echartsData.mean.length > 0 ? [{
        name: unitLabel,
        type: 'bar',
        data: echartsData.mean,
        itemStyle: {
          color: meanColor,
        },
      }] : []),
      ...(echartsData.min.length > 0 && echartsData.min.some(v => v !== null) ? [{
        name: 'Min',
        type: 'bar',
        data: echartsData.min,
        itemStyle: {
          color: minColor,
        },
      }] : []),
      ...(echartsData.max.length > 0 && echartsData.max.some(v => v !== null) ? [{
        name: 'Max',
        type: 'bar',
        data: echartsData.max,
        itemStyle: {
          color: maxColor,
        },
      }] : []),
    ],
  }), [lineOption, echartsData, meanColor, minColor, maxColor, useFullHeight, dataRange, unitLabel]);

  const tabs: { id: ChartType; label: string }[] = [
    { id: 'line', label: 'Line' },
    { id: 'area', label: 'Area' },
    { id: 'bar', label: 'Bar' },
    { id: 'table', label: 'Table' },
  ];

  return (
    <div className="w-full">
      {/* Tabs and Toggle */}
      <div className="flex items-center justify-between border-b border-white/20 mb-4">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-white'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Y-axis Scale Toggle - only show for chart views, not table */}
        {activeTab !== 'table' && (
          <div className="flex items-center gap-2 text-xs text-white/80">
            <span className={useFullHeight ? 'text-white/60' : 'text-white'}>Auto</span>
            <button
              onClick={() => setUseFullHeight(!useFullHeight)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                useFullHeight ? 'bg-blue-600' : 'bg-gray-600'
              }`}
              role="switch"
              aria-checked={useFullHeight}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  useFullHeight ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={useFullHeight ? 'text-white' : 'text-white/60'}>Full</span>
          </div>
        )}
      </div>

      {/* Chart Content */}
      <div className="h-64">
        {activeTab === 'line' && (
          <ReactECharts
            option={lineOption}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        )}
        {activeTab === 'area' && (
          <ReactECharts
            option={areaOption}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        )}
        {activeTab === 'bar' && (
          <ReactECharts
            option={barOption}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        )}
        {activeTab === 'table' && (
          <div className="overflow-y-auto h-full">
            <table className="w-full text-sm text-white">
              <thead className="sticky top-0 bg-primary/90">
                <tr>
                  <th className="px-3 py-2 text-left border-b border-white/20">Year</th>
                  {echartsData.mean.length > 0 && <th className="px-3 py-2 text-left border-b border-white/20">{unitLabel}</th>}
                  {echartsData.min.some(v => v !== null) && <th className="px-3 py-2 text-left border-b border-white/20">Min</th>}
                  {echartsData.max.some(v => v !== null) && <th className="px-3 py-2 text-left border-b border-white/20">Max</th>}
                </tr>
              </thead>
              <tbody>
                {echartsData.labels.map((label, index) => (
                  <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                    <td className="px-3 py-2">{label}</td>
                    {echartsData.mean.length > 0 && (
                      <td className="px-3 py-2">{echartsData.mean[index] !== null && echartsData.mean[index] !== undefined ? formatNumber(echartsData.mean[index]) : '-'}</td>
                    )}
                    {echartsData.min.some(v => v !== null) && (
                      <td className="px-3 py-2">{echartsData.min[index] !== null && echartsData.min[index] !== undefined ? formatNumber(echartsData.min[index]) : '-'}</td>
                    )}
                    {echartsData.max.some(v => v !== null) && (
                      <td className="px-3 py-2">{echartsData.max[index] !== null && echartsData.max[index] !== undefined ? formatNumber(echartsData.max[index]) : '-'}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

