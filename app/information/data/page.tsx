'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DataPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Data</h1>
          <Button asChild variant="outline">
            <Link href="/map">
              <i className="fas fa-globe mr-2"></i>
              Map
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl space-y-6">
          <div className="prose prose-lg">
            <h2 className="text-2xl font-bold text-primary mb-4">Data Sources</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The data presented in this application is derived from multiple sources and models:
            </p>

            <h3 className="text-xl font-semibold text-secondary mb-3">Climate Models</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>NOAA Geophysical Fluid Dynamic Laboratory Earth System Model 2G (GFDL-ESM2G)</li>
              <li>Institut Pierre Simon Laplace climate model 5A-MR (IPSL-CM6-MR)</li>
              <li>Max Planck Institute Earth System Model MR (MPI-ESM-MR)</li>
            </ul>

            <h3 className="text-xl font-semibold text-secondary mb-3">Data Processing</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              All model data have been regridded from the native grid system of each model onto a 0.5° latitude x 0.5° longitude grid of the world ocean.
            </p>

            <h3 className="text-xl font-semibold text-secondary mb-3">Spatial Coverage</h3>
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

            <h3 className="text-xl font-semibold text-secondary mb-3">Temporal Coverage</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Projections are available for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>Present day (1986-2005 baseline)</li>
              <li>Mid century (2040-2060)</li>
              <li>End of century (2080-2099)</li>
            </ul>

            <h3 className="text-xl font-semibold text-secondary mb-3">Climate Scenarios</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Data is available for two Representative Concentration Pathways (RCP):
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>RCP 2.6: Strong mitigation scenario (low emissions)</li>
              <li>RCP 8.5: High business-as-usual scenario (high emissions)</li>
            </ul>

            <h3 className="text-xl font-semibold text-secondary mb-3">Indicators</h3>
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

            <h3 className="text-xl font-semibold text-secondary mb-3">Data Access</h3>
            <p className="text-gray-700 leading-relaxed">
              For detailed information about data sources, processing methods, and access, please refer to the Methods section.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

