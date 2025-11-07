'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import IndicatorInfoDialog from '@/components/map/indicator-info-dialog';
import { MapTypes } from '@/lib/models/MapTypes';
import type { ClimateIndicator, ClimateScenario, PeriodScenario } from '@/lib/models/ClimateTypes';

interface FooterBottomProps {
  map: MapTypes;
  onMapTypeChange: (mapType: string | MapTypes) => void;
  climateIndicator: ClimateIndicator;
  climateStressors: ClimateIndicator[];
  climateRisks: ClimateIndicator[];
  onClimateIndicatorChange: (indicator: ClimateIndicator) => void;
  methodId: string;
}

export default function FooterBottom({
  map,
  onMapTypeChange,
  climateIndicator,
  climateStressors,
  climateRisks,
  onClimateIndicatorChange,
  methodId,
}: FooterBottomProps) {
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
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <Button
              variant={showStressors ? 'default' : 'outline'}
              className="rounded-l-md rounded-r-none"
              onClick={handleStressorClick}
            >
              <i className="fas fa-bolt mr-2"></i>
              Stressor
            </Button>
            <Button
              variant={showRisks ? 'default' : 'outline'}
              className="rounded-r-md rounded-l-none"
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
                <div key={indicator.id} className="inline-flex rounded-md shadow-sm w-full" role="group">
                  <Button
                    variant={climateIndicator.id === indicator.id ? 'default' : 'outline'}
                    className="flex-1 rounded-l-md rounded-r-none"
                    onClick={() => onClimateIndicatorChange(indicator)}
                  >
                    {indicator.label}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-r-md rounded-l-none border-l-0"
                    onClick={() => handleInfoClick(indicator)}
                  >
                    <i className="fas fa-info-circle"></i>
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Risk Items */}
          {showRisks && (
            <div className="space-y-1">
              {climateRisks
                .filter((indicator) => !(indicator.id === 'revenue' && map !== MapTypes.Grid))
                .map((indicator) => (
                  <div key={indicator.id} className="inline-flex rounded-md shadow-sm w-full" role="group">
                    <Button
                      variant={climateIndicator.id === indicator.id ? 'default' : 'outline'}
                      className="flex-1 rounded-l-md rounded-r-none"
                      onClick={() => onClimateIndicatorChange(indicator)}
                    >
                      {indicator.label}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-r-md rounded-l-none border-l-0"
                      onClick={() => handleInfoClick(indicator)}
                    >
                      <i className="fas fa-info-circle"></i>
                    </Button>
                  </div>
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

      {/* Methods and Data */}
      <div>
        <div className="text-white font-bold mb-2">Actions</div>
        <div className="flex items-center space-x-2">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="rounded-full bg-gray-600 text-white hover:bg-gray-500"
          >
            <Link href={`/information/methods?method=${methodId}`}>
              Methods
            </Link>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full bg-gray-600 text-white hover:bg-gray-500"
          >
            Data
          </Button>
        </div>
      </div>
    </div>
  );
}

