'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { DocsLayout } from '@/components/docs-layout';
import { MathRenderer } from '@/components/math-renderer';

const methods = [
  {
    id: 'method1-climate-stressors',
    title: 'Climate stressors',
    explanation: [
      'Climate stressors refer here as the main oceanographic variables that are known to be changing and/or projected to change with greenhouse gas emissions from human activities and that their changes impact marine biodiversity, ecosystems and the services they provide [1].',
      'The main climate stressors presented here include temperature, pH and dissolved oxygen and changes in net primary production at sea surface and bottom. The Coupled Model Intercomparison Project (CMIP) provides outputs from earth system models developed by research institutes around the world under a common set of greenhouse gas emissions scenarios. Here, we present projections of changes in marine ecosystem stressors from three earth system models: the NOAA Geophysical Fluid Dynamic Laboratory Earth System Model 2G (GFDL-ESM2G), the Institut Pierre Simon Laplace climate model 5A-MR (IPSL-CM6-MR) and the Max Planck Institute Earth System Model MR (MPI-ESM-MR). Amongst the data available from the CMIP5 data portal, outputs from these three models are used and presented here because all the oceanographic variables that are required for calculating the indices presented in this website are available from these three models.',
      'We used one single realization of each model. All model data have been regridded from the native grid system of each model onto a 0.5° latitude x 0.5° longitude grid of the world ocean.'
    ]
  },
  {
    id: 'method2-multi-stressor-exposure-index',
    title: 'Multi-stressor exposure index',
    explanation: [
      'The multi-stressor exposure index is a composite indicator to represent the level of climate stress from multiple changing ocean variables that marine organisms and ecosystems are/will be experiencing under climate change. The method to calculate this index is detailed in [3,4]. The index is computed for each 0.5° latitude x 0.5° longitude grid of the world ocean.',
      'Here, exposure describes the extent to which marine species and ecosystems would be subjected to climate stressors (i.e., warming, acidification, oxygen loss and decrease in net primary production) (see climate stressors). Projected sea surface and bottom temperature, oxygen concentration and hydrogen ion concentration and net primary production from three earth system models: the Geophysical Fluid Dynamics Laboratory\'s Earth System Model 2G (GFDL-ESM-2G), Institut Pierre Simon Laplace\'s CM6-MR (IPSL-CM6-MR) and Max Planck Institute\'s Earth System Model-MR (MPI-ESM-MR). These model outputs were regridded and interpolated onto a 0.5° latitude x 0.5° longitude grid of the world ocean. Indicators of climate stressors (ExV) were calculated based on the mean change in each ocean variable (V) between baseline (average between 1951-2000) and any specific year (yr) from 1980 to 2099, divided by the standard deviation (SD) over baseline period (1951-2000). This takes into account the environmental variability of what marine organisms would be accustomed to experiencing, thereby characterizing where the trend in the environmental variable becomes perceptible for each species.',
      'ExV = \\frac{\\text{mean}(V_{\\text{yr}}) - \\text{mean}(V_{1951-2000})}{\\text{SD}(V_{1951-2000})}',
      'We categorized the level of exposure to each climate stressors into low, medium, high and very high (ExV, equation 1). These are fuzzy categorizes as the thresholds that delineate the categories overlap with one. Specifically, exposure to climate hazard is high when changes in the ocean drivers are within historical variability, i.e., ExV < 1. Intermediate exposure values of 0.5 < ExV < 2, and 1 < ExV < 3 are considered as moderate and high, while ExV > 2 are is also considered very high. To determine the member associated with ExV calculated from each climate stressor, we follow Cheung et al. (2005) [5] and assume trapezoid functions for the upper and lower categories (low and very high) and triangular functions for the intermediate categories (moderate and high). The fuzziness of the categories  (as indicated by the degree of overlap between the fuzzy sets) represents our uncertainty in deciding the exposure level.',
      'The algorithm calculated the final degree of membership associated with each level of conclusions based on all the available input variables. The algorithm explicitly carried all the uncertainties from the inputs to the final conclusion. For example, different hazard exposure levels calculated from different earth system model outputs could initiate different set of rules and draw different conclusions. Simultaneously, different input variables would initiate different sets of rules that could arrive at the same conclusions, with different degrees of membership. Thus, the degree of membership for the final conclusion was accumulated using an algorithm called MYCIN (see [3,4]), where:',
      '\\text{AccMem}_{i+1} = \\text{AccMem}_i + \\text{Membership}_{i+1} \\cdot (1 - \\text{AccMem}_i)',
      'where AccMem is the accumulated membership of a particular conclusion (e.g., high vulnerability) and i denote one of the rules that has lead to this conclusion.',
      'A defuzzification process was applied to calculate the multi-stressor index. The index was expressed on a scale from 1 to 100, 100 being the most vulnerable. Index values (Indval) correspond to each linguistic category were Low = 1, Medium = 25, High = 75 and Very high = 100. The final multi-stressor index was calculated from the average of the index values weighted by their accumulated membership.'
    ]
  },
  {
    id: 'method3-maximum-catch-potential',
    title: 'Maximum catch potential',
    explanation: [
      'Maximum catch potential (MCP) is a proxy of maximum sustainable yield (MSY). It was calculated by applying fishing mortality required to achieve MSY (FMSY) to each cell where the species is projected to occur (see [6] for details). Given the assumption of logistic population growth, fishing mortality required to achieve MSY (FMSY) is equal to half of the intrinsic rate of population increase of the fish stock. Annual average maximum catch potential of 892 exploited fishes and invertebrate are projected using a dynamic bioclimate envelope model (see [7] for details).'
    ]
  },
  {
    id: 'method4-species-turnover',
    title: 'Species turnover',
    explanation: [
      'Species turnover is the sum of local extinction and invasion. Species local extinction for each year was calculated by counting the number of species (species richness) disappearing from a spatial cell (i.e., when B = 0) in that year divided by the initial (average between 1986-2005) species richness in that cell. Local extinction is largely driven by temperature exceeding the inferred upper thermal tolerance of the species. Similarly, species gain is the number of species newly occurring in a cell relative to the initial species richness. Shift in species distribution and abundance of 892 exploited fishes and invertebrates are projected using a dynamic bioclimate envelope model (see [7] for details).'
    ]
  },
  {
    id: 'method5-maximum-potential-revenue',
    title: 'Maximum potential revenue',
    explanation: [
      'The maximum potential revenue is calculated by multiplying the ex-vessel price of a species and its maximum catch potential (see [8] for details). Ex-vessel prices are the prices that fishers receive directly for their catch, or the price at which the catch is sold when it first enters the supply chain. Ex-vessel price is based on the Fisheries Economics Research Unit price database while maximum catch potential of 892 exploited fishes and inverbrates are projected using a dynamic bioclimate envelope model (see [7] for details).'
    ]
  }
];

const scenarios = [
  {
    id: 'scenario1',
    title: 'Greenhouse gas emission',
    explanation: `Greenhouse gas emission scenarios are based on Representative Concentration Pathways (RCP) [9]. Specifically, RCP 2.6 and RCP 8.5 are used in order to maximize the high and low emission scenarios. The RCP2.6 is a strong mitigation greenhouse gas emissions scenario, which by the end of the 21st century is projected to lead to a net radiative forcing of 2.6 Wm-2. The RCP8.5 is a high business-as-usual greenhouse gas emissions scenario that projects a net radiative forcing of 8.5 Wm-2 by the end of this century.`
  }
];

const references = [
  {
    id: 'reference1',
    explanation: `Pörtner H-O, Karl DM, Boyd PW, Cheung W, Lluch-Cota SE, Nojiri Y, et al. Ocean systems. In: Climate change 2014: impacts, adaptation, and vulnerability Part A: global and sectoral aspects contribution of working group II to the fifth assessment report of the intergovernmental panel on climate change. Cambridge University Press; 2014. p. 411–84.`
  },
  {
    id: 'reference2',
    explanation: `Laufkötter C, Vogt M, Gruber N, Aita-Noguchi M, Aumont O, Bopp L, et al. Drivers and uncertainties of future global marine primary production in marine ecosystem models (2015). Biogeosciences 12: 6955–84.`
  },
  {
    id: 'reference3',
    explanation: 'Jones MC, Cheung WWL. Using fuzzy logic to determine the vulnerability of marine species to climate change (2018). Global Change Biology 24(2):e719--e731.'
  },
  {
    id: 'reference4',
    explanation: 'Cheung WWL, Jones MC, Reygondeau G, Frölicher TL (2018). Opportunities for climate-risk reduction through effective fisheries management. Global Change Biology: 24(11):5149–63.'
  },
  {
    id: 'reference5',
    explanation: 'Cheung WWL, Pitcher TJ, Pauly D (2005). A fuzzy logic expert system to estimate intrinsic extinction vulnerabilities of marine fishes to fishing. Biological Conservation 124(1): 97–111.'
  },
  {
    id: 'reference6',
    explanation: 'Cheung WWL, Reygondeau G, Frölicher TL (2016). Large benefits to marine fisheries of meeting the 1.5 C global warming target. Science 354(6319):1591–1594.'
  },
  {
    id: 'reference7',
    explanation: 'Cheung WWL, Jones MC, Reygondeau G, Stock CA, Lam VWY, Frölicher TL (2016) Structural uncertainty in projecting global fisheries catches under climate change. Ecological Modelling 325:57–66.'
  },
  {
    id: 'reference8',
    explanation: ' Lam VWY, Cheung WWL, Reygondeau G, Sumaila UR (2016). Projected change in global fisheries revenues under climate change. Scientific Report 6: 32607.'
  },
  {
    id: 'reference9',
    explanation: 'Meinshausen M, Meinshausen N, Hare W, Raper SCB, Frieler K, Knutti R, et al. Greenhouse-gas emission targets for limiting global warming to 2 oC (2009). Nature 458(7242): 1158–62.'
  }
];

const headings = [
  { id: 'methods', text: 'Methods', level: 1 },
  { id: 'method1-climate-stressors', text: 'Climate stressors', level: 2 },
  { id: 'method2-multi-stressor-exposure-index', text: 'Multi-stressor exposure index', level: 2 },
  { id: 'method3-maximum-catch-potential', text: 'Maximum catch potential', level: 2 },
  { id: 'method4-species-turnover', text: 'Species turnover', level: 2 },
  { id: 'method5-maximum-potential-revenue', text: 'Maximum potential revenue', level: 2 },
  { id: 'scenarios', text: 'Scenarios', level: 1 },
  { id: 'scenario1', text: 'Greenhouse gas emission', level: 2 },
  { id: 'references', text: 'References', level: 1 },
];

// Helper function to convert citation numbers to links
function renderCitations(text: string): React.ReactNode {
  // Match citation patterns like [1], [3,4], [5], etc.
  const citationPattern = /\[(\d+(?:,\s*\d+)*)\]/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = citationPattern.exec(text)) !== null) {
    // Add text before the citation
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Process the citation numbers
    if (!match) continue;
    const citationNumbers = match[1].split(',').map(num => parseInt(num.trim(), 10));
    const citationLinks = citationNumbers.map((num, idx) => {
      const isLast = idx === citationNumbers.length - 1;
      return (
        <React.Fragment key={`${match!.index}-${idx}`}>
          <a
            href={`#reference${num}`}
            className="text-primary/50 hover:text-primary hover:underline"
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(`reference${num}`);
              if (element) {
                const offset = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
                });
              }
            }}
          >
            {num}
          </a>
          {!isLast && ', '}
        </React.Fragment>
      );
    });

    parts.push(
      <React.Fragment key={match.index}>
        [{citationLinks}]
      </React.Fragment>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

function MethodsContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const method = searchParams.get('method');
    if (method) {
      setTimeout(() => {
        const element = document.getElementById(method);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [searchParams]);

  return (
    <DocsLayout title="Methods" headings={headings} showNavLinks={true}>
      <h1 id="methods" className="text-4xl font-bold text-primary mb-8">Methods</h1>

      <div className="prose prose-lg max-w-none space-y-8">
        {methods.map((method) => (
          <section key={method.id} id={method.id} className="space-y-4">
            <h2 className="text-2xl font-bold text-primary mt-8 mb-4">{method.title}</h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              {method.explanation.map((para, idx) => {
                const isEquation = para.trim().startsWith('\\') || 
                  (para.includes('=') && (para.includes('ExV') || para.includes('AccMem') || para.includes('mean') || para.includes('SD')));
                
                if (isEquation) {
                  return (
                    <div key={idx} className="my-6 flex justify-center overflow-x-auto">
                      <MathRenderer display={true}>{para}</MathRenderer>
                    </div>
                  );
                }
                return <p key={idx}>{renderCitations(para)}</p>;
              })}
            </div>
          </section>
        ))}

        <hr className="my-12 border-gray-200" />

        <section id="scenarios" className="space-y-6">
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Scenarios</h2>
          {scenarios.map((scenario) => (
            <div key={scenario.id} id={scenario.id} className="space-y-3">
              <h3 className="text-xl font-semibold text-secondary">{scenario.title}</h3>
              <p className="text-gray-700 leading-relaxed">{renderCitations(scenario.explanation)}</p>
            </div>
          ))}
        </section>

        <hr className="my-12 border-gray-200" />

        <section id="references" className="space-y-4">
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">References</h2>
          <ol className="space-y-3 list-decimal list-inside text-gray-700 leading-relaxed">
            {references.map((reference) => (
              <li key={reference.id} id={reference.id}>
                {reference.explanation}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </DocsLayout>
  );
}

export default function MethodsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <MethodsContent />
    </Suspense>
  );
}
