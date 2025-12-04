'use client';

import { Button } from '@/components/ui/button';
import { MapTypes } from '@/lib/models/MapTypes';
import type { ClimateIndicator, ChartData } from '@/lib/models/ClimateTypes';
import ZoneChart from './zone-chart';

interface SidebarProps {
  showSideBar: boolean;
  hidden: boolean;
  onToggle: () => void;
  data: Record<string, any> | null;
  dataKeys: string[];
  map: MapTypes;
  climateIndicator: ClimateIndicator;
  showChart: boolean;
  chartLabels: string[];
  chartData: ChartData;
  onHyperlinkClick: () => void;
}

export default function Sidebar({
  showSideBar,
  hidden,
  onToggle,
  data,
  dataKeys,
  map,
  climateIndicator,
  showChart,
  chartLabels,
  chartData,
  onHyperlinkClick,
}: SidebarProps) {
  if (!showSideBar) return null;

  return (
    <>
      {/* Sidebar Toggle */}
      <Button
        onClick={onToggle}
        variant="ghost"
        size="icon"
        className={`fixed top-14 z-50 rounded-l-md rounded-r-none bg-slate-600 hover:bg-slate-700 text-white border-l border-gray-700 transition-all duration-300 ${hidden ? 'right-0' : 'right-[500px]'}`}
      >
        <i className={`fas ${hidden ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
      </Button>

      {/* Sidebar */}
      <div className={`fixed top-14 right-0 bottom-0 w-[500px] bg-primary text-white z-40 opacity-90 transform transition-transform ${
        hidden ? 'translate-x-full' : 'translate-x-0'
      }`}>
        <div className="overflow-y-auto h-full p-8">
          {dataKeys.map((key) => {
            if (key === 'years' || key === 'chart') return null;
            if (!data || !data[key]) {
              return null;
            }
            
            // Special handling for cell - show value and coordinates separately
            if (key === 'cell') {
              const cellData = data[key];
              const hasValue = cellData.mean !== null && cellData.mean !== undefined;
              const coordinates = cellData.coordinates || cellData.name || '';
              
              return (
                <div key={key} className="mb-4">
                  <div className="flex items-center">
                    <span className="font-semibold text-white">
                      {key.toUpperCase()}:{' '}
                      {hasValue && (
                        <span className="text-color4">
                          {cellData.mean}
                        </span>
                      )}
                    </span>
                  </div>
                  {coordinates && (
                    <p className="text-color4 text-sm mt-1">
                      {coordinates}
                    </p>
                  )}
                  {(cellData.min !== null && cellData.min !== undefined) && (
                    <p className="text-color4">
                      Range: {cellData.min} &ndash; {cellData.max}
                      <span dangerouslySetInnerHTML={{ __html: climateIndicator.units }} />
                    </p>
                  )}
                </div>
              );
            }
            
            return (
              <div key={key} className="mb-4">
                <div className="flex items-center">
                  <span className="font-semibold text-white">
                    {key.toUpperCase()}: {data[key].name || key}
                  </span>
                  {map !== MapTypes.Grid && map !== MapTypes.BGCP && (
                    <img
                      src="/assets/images/seaaroundushyperlink.png"
                      className="w-6 h-6 ml-2 cursor-pointer"
                      onClick={onHyperlinkClick}
                      alt="Sea Around Us"
                      title="Go to Sea Around Us"
                    />
                  )}
                </div>
                {(data[key].mean !== null && data[key].mean !== undefined) && (
                  <h3 className="text-2xl mb-0 text-color4">
                    {data[key].mean}
                    <span dangerouslySetInnerHTML={{ __html: climateIndicator.units }} />
                  </h3>
                )}
                {(data[key].min !== null && data[key].min !== undefined) && (
                  <p className="text-color4">
                    Range: {data[key].min} &ndash; {data[key].max}
                    <span dangerouslySetInnerHTML={{ __html: climateIndicator.units }} />
                  </p>
                )}
              </div>
            );
          })}
          {showChart && (
            <>
              <hr className="border-white my-4" />
              <ZoneChart
                chartLabels={chartLabels}
                chartData={chartData}
                climateIndicator={climateIndicator}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

