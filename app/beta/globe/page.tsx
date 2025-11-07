'use client';

import { useState, useEffect } from 'react';
import { Globe3D } from '@/components/beta/globe-3d';
import { ClimateInfoService } from '@/lib/services/climate-info.service';
import type { ClimateIndicator, ClimateScenario, PeriodScenario } from '@/lib/models/ClimateTypes';

export default function GlobePage() {
  const [selectedIndicator, setSelectedIndicator] = useState<ClimateIndicator | null>(null);
  const [selectedClimate, setSelectedClimate] = useState<ClimateScenario | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodScenario | null>(null);
  const [indicators, setIndicators] = useState<ClimateIndicator[]>([]);
  const [climateScenarios, setClimateScenarios] = useState<ClimateScenario[]>([]);
  const [periodScenarios, setPeriodScenarios] = useState<PeriodScenario[]>([]);
  const [showPoints, setShowPoints] = useState(false);

  const climateInfoService = new ClimateInfoService();

  useEffect(() => {
    // Load climate indicators
    const stressors = climateInfoService.getClimateStressors();
    const risks = climateInfoService.getClimateRisks();
    const allIndicators = [...stressors, ...risks].filter(ind => ind.display);
    
    setIndicators(allIndicators);
    
    // Load scenarios
    const scenarios = climateInfoService.getClimateScenarios();
    const periods = climateInfoService.getPeriodScenarios();
    
    setClimateScenarios(scenarios);
    setPeriodScenarios(periods);
  }, [climateInfoService]);

  // Set default indicator
  useEffect(() => {
    if (indicators.length > 0 && !selectedIndicator) {
      setSelectedIndicator(indicators[0]);
    }
  }, [indicators, selectedIndicator]);

  // Set default climate scenario
  useEffect(() => {
    if (climateScenarios.length > 0 && !selectedClimate) {
      setSelectedClimate(climateScenarios[0]);
    }
  }, [climateScenarios, selectedClimate]);

  // Set default period scenario
  useEffect(() => {
    if (periodScenarios.length > 0 && !selectedPeriod) {
      setSelectedPeriod(periodScenarios[0]);
    }
  }, [periodScenarios, selectedPeriod]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Controls */}
      <div className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
        <h2 className="text-lg font-bold mb-4 text-gray-800">3D Globe Controls</h2>
        
        <div className="space-y-4">
          {/* Indicator Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Indicator
            </label>
            <select
              value={selectedIndicator?.id || ''}
              onChange={(e) => {
                const indicator = indicators.find(ind => ind.id === e.target.value);
                setSelectedIndicator(indicator || null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Select indicator...</option>
              {indicators.map((ind) => (
                <option key={ind.id} value={ind.id}>
                  {ind.label}
                </option>
              ))}
            </select>
          </div>

          {/* Climate Scenario Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Climate Scenario
            </label>
            <select
              value={selectedClimate?.id || ''}
              onChange={(e) => {
                const climate = climateScenarios.find(c => c.id === e.target.value);
                setSelectedClimate(climate || null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Select scenario...</option>
              {climateScenarios.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.label}
                </option>
              ))}
            </select>
          </div>

          {/* Period Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Period
            </label>
            <select
              value={selectedPeriod?.id || ''}
              onChange={(e) => {
                const period = periodScenarios.find(p => p.id === e.target.value);
                setSelectedPeriod(period || null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Select period...</option>
              {periodScenarios.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>

          {/* Show Points Toggle */}
          <div className="pt-4 border-t border-gray-200">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showPoints}
                onChange={(e) => setShowPoints(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">
                Show data points
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Display pixel data as colored points (may impact performance)
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            This is a beta feature. Use mouse to rotate, scroll to zoom.
          </p>
        </div>
      </div>

      {/* Globe Component */}
      {selectedIndicator && selectedClimate && selectedPeriod && (
        <Globe3D
          indicator={selectedIndicator}
          climateScenario={selectedClimate}
          periodScenario={selectedPeriod}
          showPoints={showPoints}
        />
      )}
    </div>
  );
}

