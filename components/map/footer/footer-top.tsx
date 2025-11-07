'use client';

import { Button } from '@/components/ui/button';
import type { ClimateScenario, PeriodScenario, ClimateIndicator } from '@/lib/models/ClimateTypes';

interface FooterTopProps {
  climateScenarios: ClimateScenario[];
  climateScenarioSelected: ClimateScenario;
  onClimateScenarioChange: (scenario: ClimateScenario) => void;
  periodScenarios: PeriodScenario[];
  periodScenarioSelected: PeriodScenario;
  onPeriodScenarioChange: (period: PeriodScenario) => void;
  climateIndicator: ClimateIndicator;
}

export default function FooterTop({
  climateScenarios,
  climateScenarioSelected,
  onClimateScenarioChange,
  periodScenarios,
  periodScenarioSelected,
  onPeriodScenarioChange,
  climateIndicator,
}: FooterTopProps) {
  return (
    <div className="space-y-4">
      {/* Greenhouse Gas Emission */}
      <div>
        <div className="text-white font-bold mb-2">Greenhouse Gas Emission</div>
        <div className="flex rounded-md shadow-sm w-full" role="group">
          {climateScenarios.map((scenario, index) => (
            <Button
              key={scenario.id}
              variant={climateScenarioSelected.id === scenario.id ? 'default' : 'outline'}
              className={`flex-1 ${
                index === 0
                  ? 'rounded-l-md rounded-r-none'
                  : index === climateScenarios.length - 1
                  ? 'rounded-r-md rounded-l-none'
                  : 'rounded-none'
              }`}
              onClick={() => onClimateScenarioChange(scenario)}
            >
              {scenario.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Time Period */}
      {climateIndicator.id !== 'revenue' && (
        <div>
          <div className="text-white font-bold mb-2">Time Period</div>
          <div className="flex flex-col gap-2">
            {periodScenarios.map((period) => (
              <Button
                key={period.id}
                variant={periodScenarioSelected.id === period.id ? 'default' : 'outline'}
                className="w-full"
                onClick={() => onPeriodScenarioChange(period)}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

