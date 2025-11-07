'use client';

import Link from 'next/link';
import FooterTop from './footer/footer-top';
import Controls from './footer/controls';
import type { ClimateIndicator, ClimateScenario, PeriodScenario } from '@/lib/models/ClimateTypes';
import { MapTypes } from '@/lib/models/MapTypes';
import { Button } from '@/components/ui/button';

interface LeftSidebarProps {
  climateScenarios: ClimateScenario[];
  climateScenarioSelected: ClimateScenario;
  onClimateScenarioChange: (scenario: ClimateScenario) => void;
  periodScenarios: PeriodScenario[];
  periodScenarioSelected: PeriodScenario;
  onPeriodScenarioChange: (period: PeriodScenario) => void;
  climateIndicator: ClimateIndicator;
  map: MapTypes;
  onMapTypeChange: (mapType: string | MapTypes) => void;
  climateStressors: ClimateIndicator[];
  climateRisks: ClimateIndicator[];
  onClimateIndicatorChange: (indicator: ClimateIndicator) => void;
  methodId: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function LeftSidebar({
  climateScenarios,
  climateScenarioSelected,
  onClimateScenarioChange,
  periodScenarios,
  periodScenarioSelected,
  onPeriodScenarioChange,
  climateIndicator,
  map,
  onMapTypeChange,
  climateStressors,
  climateRisks,
  onClimateIndicatorChange,
  methodId,
  collapsed,
  onToggleCollapse,
}: LeftSidebarProps) {
  return (
    <>
      <div className={`fixed left-0 top-14 bottom-0 bg-primary/90 z-40 overflow-y-auto border-r border-gray-700 transition-all duration-300 ${collapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-[300px]'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 space-y-6 flex-1">
            <FooterTop
              climateScenarios={climateScenarios}
              climateScenarioSelected={climateScenarioSelected}
              onClimateScenarioChange={onClimateScenarioChange}
              periodScenarios={periodScenarios}
              periodScenarioSelected={periodScenarioSelected}
              onPeriodScenarioChange={onPeriodScenarioChange}
              climateIndicator={climateIndicator}
            />
            
            <div className="border-t border-gray-700 pt-6">
              <Controls
                map={map}
                onMapTypeChange={onMapTypeChange}
                climateIndicator={climateIndicator}
                climateStressors={climateStressors}
                climateRisks={climateRisks}
                onClimateIndicatorChange={onClimateIndicatorChange}
                methodId={methodId}
              />
            </div>
          </div>
          
          {/* Bottom Section - Methods, Data & FAQ Links */}
          <div className="border-t border-gray-700 p-6 mt-auto">
            <div className="flex items-center justify-center space-x-4">
              <Link
                href={`/information/methods?method=${methodId}`}
                className="text-white hover:text-color4 transition-colors text-sm"
              >
                Methods
              </Link>
              <Link
                href="/data"
                className="text-white hover:text-color4 transition-colors text-sm"
              >
                Data
              </Link>
              <Link
                href="/faq"
                className="text-white hover:text-color4 transition-colors text-sm"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className={`fixed top-14 left-0 z-50 rounded-r-md rounded-l-none bg-slate-600 hover:bg-slate-700 text-white border-r border-gray-700 transition-all duration-300 ${collapsed ? 'translate-x-0' : 'translate-x-[300px]'}`}
        onClick={onToggleCollapse}
      >
        <i className={`fas ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
      </Button>
    </>
  );
}

