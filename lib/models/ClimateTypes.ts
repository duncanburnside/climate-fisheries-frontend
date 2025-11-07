export interface ClimateIndicator {
  id: string;
  name: string;
  label: string;
  explanation: string;
  dataPlaceholder: number | string;
  colors: string[];
  methodId: string;
  yearsRange?: number[] | [number, number];
  display: boolean;
  units: string;
  aboutLabel?: string;
}

export interface ClimateScenario {
  id: string;
  name: string;
  label: string;
}

export interface PeriodScenario {
  id: string;
  name: string;
  label: string;
}

export interface ZoneData {
  id: string;
  name: string;
  mean: number | null;
  min: number | null;
  max: number | null;
}

export interface ZoneResponse {
  mean: number | null;
  min: number | null;
  max: number | null;
  years?: Record<string, number> | number[][];
  chart?: number[];
}

export interface ChartData {
  labels?: string[];
  datasets: {
    label: string;
    fill: boolean | string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

