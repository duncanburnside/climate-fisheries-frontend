'use client';

import { DocsLayout } from '@/components/docs-layout';

const headings = [
  { id: 'data-sources', text: 'Data Sources', level: 1 },
  { id: 'climate-models', text: 'Climate Models', level: 2 },
  { id: 'data-processing', text: 'Data Processing', level: 2 },
  { id: 'spatial-coverage', text: 'Spatial Coverage', level: 2 },
  { id: 'temporal-coverage', text: 'Temporal Coverage', level: 2 },
  { id: 'climate-scenarios', text: 'Climate Scenarios', level: 2 },
  { id: 'indicators', text: 'Indicators', level: 2 },
  { id: 'data-access', text: 'Data Access', level: 2 },
];

export default function DataPage() {
  return (
    <DocsLayout title="Data" headings={headings} showNavLinks={true}>
      <div className="prose prose-lg max-w-none space-y-8">
        <section id="data-sources" className="space-y-6">
          <h1 className="text-4xl font-bold text-primary mb-8">Data Sources</h1>
          <p className="text-gray-700 leading-relaxed">
            The data presented in this application is derived from multiple sources and models:
          </p>

          <h2 id="climate-models" className="text-2xl font-bold text-primary mt-8 mb-4">Climate Models</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li>NOAA Geophysical Fluid Dynamic Laboratory Earth System Model 2G (GFDL-ESM2G)</li>
            <li>Institut Pierre Simon Laplace climate model 5A-MR (IPSL-CM6-MR)</li>
            <li>Max Planck Institute Earth System Model MR (MPI-ESM-MR)</li>
          </ul>

          <h2 id="data-processing" className="text-2xl font-bold text-primary mt-8 mb-4">Data Processing</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            All model data have been regridded from the native grid system of each model onto a 0.5° latitude x 0.5° longitude grid of the world ocean.
          </p>

          <h2 id="spatial-coverage" className="text-2xl font-bold text-primary mt-8 mb-4">Spatial Coverage</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The data covers multiple spatial boundaries:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li>FAO (Food and Agriculture Organization) areas</li>
            <li>LME (Large Marine Ecosystems)</li>
            <li>EEZ (Exclusive Economic Zones)</li>
            <li>BGCP (Biogeochemical Provinces)</li>
            <li>Grid cells (0.5° x 0.5°)</li>
          </ul>

          <h2 id="temporal-coverage" className="text-2xl font-bold text-primary mt-8 mb-4">Temporal Coverage</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Projections are available for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li>Present day (1986-2005 baseline)</li>
            <li>Mid century (2040-2060)</li>
            <li>End of century (2080-2099)</li>
          </ul>

          <h2 id="climate-scenarios" className="text-2xl font-bold text-primary mt-8 mb-4">Climate Scenarios</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Data is available for two Representative Concentration Pathways (RCP):
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li>RCP 2.6: Strong mitigation scenario (low emissions)</li>
            <li>RCP 8.5: High business-as-usual scenario (high emissions)</li>
          </ul>

          <h2 id="indicators" className="text-2xl font-bold text-primary mt-8 mb-4">Indicators</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The following climate indicators are available:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li>Sea Surface Temperature (SST)</li>
            <li>Sea Bottom Temperature (SBT)</li>
            <li>pH (acidity)</li>
            <li>Dissolved Oxygen (OXY)</li>
            <li>Net Primary Production (NPP)</li>
            <li>Multi-stressor Climate Potential (MCP)</li>
          </ul>

          <h2 id="data-access" className="text-2xl font-bold text-primary mt-8 mb-4">Data Access</h2>
          <p className="text-gray-700 leading-relaxed">
            For detailed information about data sources, processing methods, and access, please refer to the Methods section.
          </p>
        </section>
      </div>
    </DocsLayout>
  );
}
