'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import IndicatorInfoDialog from '@/components/map/indicator-info-dialog';
import { MapTypes } from '@/lib/models/MapTypes';
import type { ClimateIndicator, ClimateScenario, PeriodScenario } from '@/lib/models/ClimateTypes';

interface ControlsProps {
  map: MapTypes;
  onMapTypeChange: (mapType: string | MapTypes) => void;
  climateIndicator: ClimateIndicator;
  climateStressors: ClimateIndicator[];
  climateRisks: ClimateIndicator[];
  onClimateIndicatorChange: (indicator: ClimateIndicator) => void;
  methodId: string;
}

export default function Controls({
  map,
  onMapTypeChange,
  climateIndicator,
  climateStressors,
  climateRisks,
  onClimateIndicatorChange,
  methodId,
}: ControlsProps) {
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<ClimateIndicator | null>(null);
  const [activeType, setActiveType] = useState<'stressor' | 'risk' | null>(null);

  // Determine which type is active based on current indicator
  const isStressor = climateStressors.some(s => s.id === climateIndicator.id);
  const isRisk = climateRisks.some(r => r.id === climateIndicator.id);
  const showStressors = activeType === 'stressor' || (activeType === null && isStressor);
  const showRisks = activeType === 'risk' || (activeType === null && isRisk);

  const handleInfoClick = (indicator: ClimateIndicator) => {
    setSelectedIndicator(indicator);
    setInfoDialogOpen(true);
  };

  const handleStressorClick = () => {
    if (activeType === 'stressor') {
      setActiveType(null);
    } else {
      setActiveType('stressor');
    }
  };

  const handleRiskClick = () => {
    if (activeType === 'risk') {
      setActiveType(null);
    } else {
      setActiveType('risk');
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Type Buttons */}
      <div>
        <div className="text-white font-bold mb-2">Map Type</div>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          {climateIndicator.id !== 'revenue' && (
            <>
              <Button
                onClick={() => onMapTypeChange('FAO')}
                variant={map === MapTypes.FAO ? 'default' : 'outline'}
                size="sm"
                className="rounded-l-md rounded-r-none"
              >
                FAO
              </Button>
              <Button
                onClick={() => onMapTypeChange('LME')}
                variant={map === MapTypes.LME ? 'default' : 'outline'}
                size="sm"
                className="rounded-none"
              >
                LME
              </Button>
              <Button
                onClick={() => onMapTypeChange('EEZ')}
                variant={map === MapTypes.EEZ ? 'default' : 'outline'}
                size="sm"
                className="rounded-none"
              >
                EEZ
              </Button>
              <Button
                onClick={() => onMapTypeChange('BGCP')}
                variant={map === MapTypes.BGCP ? 'default' : 'outline'}
                size="sm"
                className="rounded-none"
              >
                BGCP
              </Button>
            </>
          )}
          <Button
            onClick={() => onMapTypeChange('Grid')}
            variant={map === MapTypes.Grid ? 'default' : 'outline'}
            size="sm"
            className={climateIndicator.id === 'revenue' ? 'rounded-md' : 'rounded-r-md rounded-l-none'}
          >
            All
          </Button>
        </div>
      </div>

      {/* Indicator Buttons */}
      <div>
        <div className="text-white font-bold mb-2">Indicators</div>
        <div className="space-y-2">
          {/* Stressor/Risk Button Group */}
          <div className="flex rounded-md shadow-sm w-full" role="group">
            <Button
              variant={showStressors ? 'default' : 'outline'}
              className="flex-1 rounded-l-md rounded-r-none"
              onClick={handleStressorClick}
            >
              <i className="fas fa-bolt mr-2"></i>
              Stressor
            </Button>
            <Button
              variant={showRisks ? 'default' : 'outline'}
              className="flex-1 rounded-r-md rounded-l-none"
              onClick={handleRiskClick}
            >
              <i className="fas fa-exclamation mr-2"></i>
              Risk
            </Button>
          </div>

          {/* Stressor Items */}
          {showStressors && (
            <div className="space-y-1">
              {climateStressors.map((indicator) => (
                <Button
                  key={indicator.id}
                  variant={climateIndicator.id === indicator.id ? 'default' : 'outline'}
                  className="w-full rounded-md justify-between"
                  onClick={() => onClimateIndicatorChange(indicator)}
                >
                  <span>{indicator.label}</span>
                  <i 
                    className="fas fa-info-circle ml-2 cursor-pointer hover:text-yellow-400 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInfoClick(indicator);
                    }}
                  ></i>
                </Button>
              ))}
            </div>
          )}

          {/* Risk Items */}
          {showRisks && (
            <div className="space-y-1">
              {climateRisks
                .filter((indicator) => !(indicator.id === 'revenue' && map !== MapTypes.Grid))
                .map((indicator) => (
                  <Button
                    key={indicator.id}
                    variant={climateIndicator.id === indicator.id ? 'default' : 'outline'}
                    className="w-full rounded-md justify-between"
                    onClick={() => onClimateIndicatorChange(indicator)}
                  >
                    <span>{indicator.label}</span>
                    <i 
                      className="fas fa-info-circle ml-2 cursor-pointer hover:text-accent transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInfoClick(indicator);
                      }}
                    ></i>
                  </Button>
                ))}
            </div>
          )}
        </div>
      </div>

      <IndicatorInfoDialog
        open={infoDialogOpen}
        onOpenChange={setInfoDialogOpen}
        indicator={selectedIndicator}
      />
    </div>
  );
}

