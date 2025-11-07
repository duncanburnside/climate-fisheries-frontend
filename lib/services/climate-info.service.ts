export class ClimateInfoService {
  title = 'Climate-Fisheries';
  
  colors = {
    blRd: ['#4575b4', '#91bfdb', '#e0f3f8', '#fee090', '#fc8d59', '#d73027'],
    brOr: ['#993404', '#d95f0e', '#fe9929', '#fec44f', '#fee391', '#ffffd4'],
    puOr: ['#542788', '#998ec3', '#d8daeb', '#fee0b6', '#f1a340', '#b35806'],
    rdGn: ['#d73027', '#fc8d59', '#fee08b', '#d9ef8b', '#91cf60', '#1a9850'],
    rd: ['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#de2d26', '#a50f15']
  };

  climateStressors = [
    {
      id: 'sea-surface-temp',
      name: 'SST',
      label: 'Warming (sea surface)',
      explanation: `Changes in the average temperature of the surface layer of the ocean relative to the average of 1951-2000 level.`,
      dataPlaceholder: 11,
      colors: this.colors.blRd,
      methodId: 'method1-climate-stressors',
      yearsRange: [1950, 2100],
      display: true,
      units: `&#176; C`
    },
    {
      id: 'sea-bottom-temp',
      name: 'SBOT',
      label: 'Warming (sea bottom)',
      explanation: `Average temperature of the bottom layer of the ocean relative to the average of 1951-2000 level.`,
      dataPlaceholder: 22,
      colors: this.colors.blRd,
      methodId: 'method1-climate-stressors',
      yearsRange: [1950, 2100],
      display: true,
      units: `&#176; C`
    },
    {
      id: 'deoxygenation',
      name: 'OXY',
      label: 'Oxygen',
      explanation: `Percentage change in oxygen concentration in the upper 200m of the ocean relative to the average of 1951-2000 level.`,
      dataPlaceholder: 33,
      colors: this.colors.brOr,
      methodId: 'method1-climate-stressors',
      yearsRange: [1950, 2100],
      display: true,
      units: '%'
    },
    {
      id: 'acidification',
      name: 'PH',
      label: 'pH',
      explanation: `Percentage change in pH (a measure of ocean acidity) in the surface layer of the ocean relative to the average of 1951-2000 level.`,
      dataPlaceholder: 44,
      colors: this.colors.puOr,
      methodId: 'method1-climate-stressors',
      yearsRange: [1950, 2100],
      display: true,
      units: '%'
    },
    {
      id: 'primary-production',
      name: 'NPP',
      label: 'Net primary production',
      explanation: `Percentage change in net primary production in the upper 200m of the ocean relative to the average of 1951-2000 level.`,
      dataPlaceholder: 55,
      colors: this.colors.rdGn,
      methodId: 'method1-climate-stressors',
      yearsRange: [1950, 2099],
      display: true,
      units: `%`
    }
  ];

  climateRisks = [
    {
      id: 'species-turnover',
      name: 'SPP',
      label: 'Species turnover',
      explanation: `Percentage change in species turnover (an indicator of changes in species composition) relative to the average of 1986-2005 level`,
      dataPlaceholder: 88,
      colors: this.colors.rd,
      methodId: 'method4-species-turnover',
      yearsRange: [1951, 2099],
      display: true,
      units: '%'
    },
    {
      id: 'multi-stress-index-surface',
      name: 'MSIS',
      label: 'Multi-stressor exposure index',
      aboutLabel: 'Multi-stressor exposure index',
      explanation: `Value of an index for the exposure to multiple climatic stressors (ocean warming, acidification, deoxygenation and decline in net primary production). The value ranges from 1 to 100, with 100 being the highest exposure to multiple climatic stressors.`,
      dataPlaceholder: 66,
      colors: this.colors.rd,
      methodId: 'method2-multi-stressor-exposure-index',
      yearsRange: [1980, 2099],
      display: true,
      units: '%'
    },
    {
      id: 'max-catch-potential',
      name: 'MCP',
      label: 'Maximum catch potential',
      explanation: `Percentage change in maximum catch potential (a proxy of maximum sustainable yield) of fish stocks relative to the average of 1986-2005 level.`,
      dataPlaceholder: 99,
      colors: this.colors.blRd,
      methodId: 'method3-maximum-catch-potential',
      yearsRange: [1950, 2099],
      display: true,
      units: 'x 1000 tonnes'
    },
    {
      id: 'revenue',
      name: 'NA',
      label: 'Maximum potential revenue',
      explanation: `Maximum revenue potential explanation placeholder.`,
      dataPlaceholder: 100,
      colors: this.colors.rd,
      methodId: 'method5-maximum-potential-revenue',
      display: false,
      units: '%'
    }
  ];

  climateScenarios = [
    {
      id: 'climate-scenario-low',
      name: '26',
      label: 'Low'
    },
    {
      id: 'climate-scenario-high',
      name: '85',
      label: 'High'
    }
  ];

  periodScenarios = [
    {
      id: 'period-present',
      name: 'present',
      label: 'Present day (1986 - 2005)'
    },
    {
      id: 'period-mid',
      name: 'mid',
      label: 'Mid century (2040 - 2060)'
    },
    {
      id: 'period-end',
      name: 'end',
      label: 'End of century (2080 - 2099)'
    }
  ];

  getClimateStressors() {
    return this.climateStressors;
  }

  getClimateRisks() {
    return this.climateRisks;
  }

  getClimateIndicators() {
    return [...this.climateStressors, ...this.climateRisks];
  }

  getClimateScenarios() {
    return this.climateScenarios;
  }

  getPeriodScenarios() {
    return this.periodScenarios;
  }

  getTitle() {
    return this.title;
  }
}

