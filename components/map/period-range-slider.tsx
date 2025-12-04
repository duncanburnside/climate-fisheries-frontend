'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { PeriodScenario } from '@/lib/models/ClimateTypes';

interface PeriodRangeSliderProps {
  periodScenarios: PeriodScenario[];
  periodScenarioSelected: PeriodScenario;
  onRangeChange?: (range: { start: string; end: string; startOpacity: number; endOpacity: number } | null) => void;
  onYearRangeChange?: (yearRange: [number, number] | null) => void;
}

// Period year ranges
const PERIOD_RANGES: Record<string, [number, number]> = {
  present: [1986, 2005],
  mid: [2040, 2060],
  end: [2080, 2099],
};

export default function PeriodRangeSlider({
  periodScenarios,
  periodScenarioSelected,
  onRangeChange,
  onYearRangeChange,
}: PeriodRangeSliderProps) {
  const [useCustomRange] = useState(true); // Always active
  const [startYear, setStartYear] = useState(1986);
  const [endYear, setEndYear] = useState(2005);
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const startYearRef = useRef(startYear);
  const endYearRef = useRef(endYear);
  
  // Keep refs in sync with state
  useEffect(() => {
    startYearRef.current = startYear;
  }, [startYear]);
  
  useEffect(() => {
    endYearRef.current = endYear;
  }, [endYear]);

  // Get min and max years across all periods
  const allRanges = periodScenarios
    .map(p => PERIOD_RANGES[p.name])
    .filter(r => r !== undefined) as [number, number][];
  const minYear = Math.min(...allRanges.map(r => r[0]));
  const maxYear = Math.max(...allRanges.map(r => r[1]));
  const range = maxYear - minYear;

  // Always update slider positions to reflect the selected period
  useEffect(() => {
    if (periodScenarioSelected) {
      const periodRange = PERIOD_RANGES[periodScenarioSelected.name];
      if (periodRange) {
        // Always update the slider visual position to show the period range
        setStartYear(periodRange[0]);
        setEndYear(periodRange[1]);
        // Update refs immediately
        startYearRef.current = periodRange[0];
        endYearRef.current = periodRange[1];
      }
    }
  }, [periodScenarioSelected]);

  // Notify parent of year range changes - use ref to avoid stale closures
  const onYearRangeChangeRef = useRef(onYearRangeChange);
  useEffect(() => {
    onYearRangeChangeRef.current = onYearRangeChange;
  }, [onYearRangeChange]);

  useEffect(() => {
    if (useCustomRange) {
      onYearRangeChangeRef.current?.([startYear, endYear]);
    } else {
      onYearRangeChangeRef.current?.(null);
    }
  }, [useCustomRange, startYear, endYear]);

  // Calculate which periods are involved and their opacities
  useEffect(() => {
    if (!useCustomRange) {
      onRangeChange?.(null);
      return;
    }

    // Determine which periods the range spans
    const periods = periodScenarios.map(p => ({
      ...p,
      range: PERIOD_RANGES[p.name],
    })).filter(p => p.range);

    // Find periods that overlap with the selected range
    const startPeriod = periods.find(p => startYear >= p.range![0] && startYear <= p.range![1]);
    const endPeriod = periods.find(p => endYear >= p.range![0] && endYear <= p.range![1]);

    if (startPeriod && endPeriod && startPeriod.name === endPeriod.name) {
      // Single period - full opacity
      onRangeChange?.(null); // Use single period mode
    } else if (startPeriod && endPeriod) {
      // Range spans multiple periods
      const startPeriodEnd = startPeriod.range![1];
      const endPeriodStart = endPeriod.range![0];
      
      // Calculate opacity based on how much of each period is covered
      const startPeriodCoverage = (startPeriodEnd - startYear) / (startPeriodEnd - startPeriod.range![0]);
      const endPeriodCoverage = (endYear - endPeriodStart) / (endPeriod.range![1] - endPeriodStart);
      
      onRangeChange?.({
        start: startPeriod.name,
        end: endPeriod.name,
        startOpacity: 1.0,
        endOpacity: Math.max(0.3, endPeriodCoverage), // Minimum 30% opacity for visibility
      });
    } else {
      onRangeChange?.(null);
    }
  }, [useCustomRange, startYear, endYear, periodScenarios, onRangeChange]);

  const getPercentage = (value: number) => ((value - minYear) / range) * 100;

  const handleMouseDown = useCallback((type: 'start' | 'end') => {
    setIsDragging(type);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newValue = Math.round(minYear + (percentage / 100) * range);

    if (isDragging === 'start') {
      const newStart = Math.min(newValue, endYearRef.current - 1);
      setStartYear(newStart);
      // Immediately notify parent if custom range is active
      if (useCustomRange) {
        onYearRangeChangeRef.current?.([newStart, endYearRef.current]);
      }
    } else {
      const newEnd = Math.max(newValue, startYearRef.current + 1);
      setEndYear(newEnd);
      // Immediately notify parent if custom range is active
      if (useCustomRange) {
        onYearRangeChangeRef.current?.([startYearRef.current, newEnd]);
      }
    }
  }, [isDragging, minYear, range, useCustomRange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const startPercent = getPercentage(startYear);
  const endPercent = getPercentage(endYear);

  return (
    <div className="space-y-2">
      <div className="text-white text-xs text-center">
        {startYear} - {endYear}
      </div>
      <div
        ref={sliderRef}
        className="relative h-6 w-full cursor-pointer"
        style={{ touchAction: 'none' }}
      >
        {/* Track */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-600 rounded-full -translate-y-1/2" />
        
        {/* Active range */}
        <div
          className="absolute top-1/2 h-1 bg-blue-500 rounded-full -translate-y-1/2"
          style={{
            left: `${startPercent}%`,
            width: `${endPercent - startPercent}%`,
          }}
        />
        
        {/* Start handle */}
        <div
          className="absolute top-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-grab active:cursor-grabbing hover:scale-110 -translate-x-1/2 -translate-y-1/2 shadow-md transition-transform"
          style={{ left: `${startPercent}%` }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleMouseDown('start');
          }}
        />
        
        {/* End handle */}
        <div
          className="absolute top-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-grab active:cursor-grabbing hover:scale-110 -translate-x-1/2 -translate-y-1/2 shadow-md transition-transform"
          style={{ left: `${endPercent}%` }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleMouseDown('end');
          }}
        />
      </div>
    </div>
  );
}

