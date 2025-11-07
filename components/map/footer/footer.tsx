'use client';

import FooterTop from './footer-top';
import FooterBottom from './footer-bottom';
import type { ClimateIndicator, ClimateScenario, PeriodScenario } from '@/lib/models/ClimateTypes';
import { MapTypes } from '@/lib/models/MapTypes';

interface FooterProps {
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
  showStressorDropdown: boolean;
  showRiskDropdown: boolean;
  onStressorDropdownToggle: () => void;
  onRiskDropdownToggle: () => void;
  onClimateIndicatorChange: (indicator: ClimateIndicator) => void;
  onClimateInfoIconClick: (event: React.MouseEvent, indicator: ClimateIndicator) => void;
  methodId: string;
}

export default function Footer({
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
  showStressorDropdown,
  showRiskDropdown,
  onStressorDropdownToggle,
  onRiskDropdownToggle,
  onClimateIndicatorChange,
  onClimateInfoIconClick,
  methodId,
}: FooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40">
      <FooterTop
        climateScenarios={climateScenarios}
        climateScenarioSelected={climateScenarioSelected}
        onClimateScenarioChange={onClimateScenarioChange}
        periodScenarios={periodScenarios}
        periodScenarioSelected={periodScenarioSelected}
        onPeriodScenarioChange={onPeriodScenarioChange}
        climateIndicator={climateIndicator}
      />
      <FooterBottom
        map={map}
        onMapTypeChange={onMapTypeChange}
        climateIndicator={climateIndicator}
        climateStressors={climateStressors}
        climateRisks={climateRisks}
        showStressorDropdown={showStressorDropdown}
        showRiskDropdown={showRiskDropdown}
        onStressorDropdownToggle={onStressorDropdownToggle}
        onRiskDropdownToggle={onRiskDropdownToggle}
        onClimateIndicatorChange={onClimateIndicatorChange}
        onClimateInfoIconClick={onClimateInfoIconClick}
        methodId={methodId}
      />
    </footer>
  );
}


