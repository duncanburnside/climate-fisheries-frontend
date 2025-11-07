'use client';

import { DocsLayout } from '@/components/docs-layout';

const faqData = [
  {
    id: "question1",
    question: "Why do we need to care about climate change effects on marine biodiversity, ecosystems and fisheries?",
    answer: "<p>The global fisheries sector supports the livelihoods of between 660 to 820 million people, directly or indirectly, which is about 10 – 12% of the world's population (FAO 2014), if the dependents of fishers are taken into account. Globally, fish also provides more than 3 billion people with 20% of their animal protein needs (FAO 2014) and is a crucial source of micronutrients including iron, zinc, omega-3 fatty acids and vitamins (Golden 2016). Seafood plays an important role in food and nutritional security particularly for the coastal indigenous communities with an average of consumption per capita 15 times higher than non-Indigenous country populations (Cisneros-Montemayor et al. 2016).</p>" +
            "<p>However, the potential impacts of climate change on the fish and fisheries add further pressure to the fisheries, which have already been exposed to multiple natural and anthropogenic stressors including extreme weather events, fluctuation in fish stocks, pollution, sedimentation, habitat destruction, shoreline development, coral mining, destructive fishing practices and overfishing. Several studies suggest that these non-climatic stresses and changes in management regimes may have a greater impact on fisheries than climate change in the short term (Eide 2007), while increasing uncertainty in climate poses a major threat to the world fisheries in the long run (Pörtner 2014). Evidence of the impact of climate change on fisheries in terms of change in catch and catch composition have already been observed in many different regions (Nye et al., 2009, Last et al., 2011, Pinsky and Fogarty, 2012).</p>" +
            "<p>Currently, global marine fisheries landings are estimated officially at between 80 and 85 million tonnes a year since 1990 (FAO, 2016), with corresponding mean annual gross revenues fluctuating around 100 billion USD annually (Swartz et al., 2012). Accounting for unreported catches, a recent study estimated the likely \"true\" annual global catch to be about 130 million tonne (Pauly and Zeller, 2016). Globally, a study revealed that marine fisheries revenues are projected to be negatively impacted in 89% of the world's fishing countries under the high range greenhouse gas (IPCC RCP 8.5) scenario in the 2050s relative to the current status (Lam et al., 2016).</p>" +
            "<p>Changes in ocean temperature, acidity, oxygen levels and circulation, lead to shifts in the distribution range of marine species (Clark et al., 2003, Rose, 2005, Cheung et al., 2009, Pinsky et al., 2013), changes in primary and secondary productivity, changes in trophic interaction (Blanchard et al., 2012, Fernandes et al., 2013) and shifts in timing of biological events (Pörtner et al., 2014). Warmer temperatures may also lead to decreases in maximum body sizes of marine fishes (Cheung et al., 2013). The combined effects of the predicted distributional shift of marine species and changes in ocean productivity under climate change are expected to lead to changes in species abundance and composition (Beaugrand et al., 2015) and hence global redistribution of maximum catch potential (MCP). These changes have direct effect on the quantity of catches and composition of exploited marine species and hence have large implications for people who depend on fish for food and income, and thus the contribution of fisheries to the global economy (Sumaila et al., 2011, Barange et al., 2014, Lam et al., 2016). Therefore, it is important for us to understand the impacts of climate change on our marine resources to help us manage the fisheries in a sustainable way. Also, understanding the potential threats on the marine resources under climate change would provide the incentive and driving force for different countries to reduce GHG emission in order to meet the targets under the Paris Agreement.</p>"
  },
  {
    id: "question2",
    question: "How reliable are our projected changes in ocean conditions and their impacts on fish stocks and fisheries?",
    answer: "<p>We do not have a crystal ball to tell us exactly what will happen in the future ocean and fish stocks. Instead, we could better understand and characterize the confidence and uncertainties to inform the design of ocean management to cope with such uncertainties.</p>" +
            "<p>There is high confidence that:</p>" +
            "<ul>" +
            "<li>Global ocean conditions are changing as a result of greenhouse gas emissions from human activities;</li>" +
            "<li>More greenhouse gas emissions will lead to bigger increase in marine climate stressors, and larger impacts on marine biodiversity and fisheries;</li>" +
            "<li>Sensitive fish stocks and ecosystems are already at risk of climate impacts;</li>" +
            "<li>The differences in projected changes and impacts between greenhouse gas emissions scenarios (i.e., between RCP2.6 and RCP8.5) increases towards 2100</li>" +
            "<li>There are regional differences in the characteristics and intensity of the impacts. e.g., decrease in maximum catch potential is highest in the tropical oceans.</li>" +
            "</ul>" +
            "<p>The main uncertainties of the projections include:</p>" +
            "<ul>" +
            "<li>Uncertainties in projections of changes in marine climate stressors vary between ocean variables, with a confidence level of the projection decreases from ocean acidity (pH), temperature to oxygen and net primary production</li>" +
            "<li>Local scale projections of changes in marine climate stressors, particularly in coastal region is more uncertain because of the coarse resolution of the earth system models and the increase in relative importance in the influence of climate variability at smaller spatial scales.</li>" +
            "<li>Impacts of climate change on fish stocks and their potential production to support fisheries may be affected by changes in inter-specific interactions, and interactions with other human stressors such as overfishing and pollution that are not considered in the indicators presented here.</li>" +
            "<li>The potential for evolutionary adaptation of marine species are not considered.</li>" +
            "</ul>"
  },
  {
    id: "question3",
    question: "What are the possible solutions to address the impacts of climate change on fish stocks and fisheries?",
    answer: "<p>Solution to climate change impacts fall into two categories: mitigation and adaptation.The most important solution truly lies in supporting global efforts to limit greenhouse gas emissions so that the rise in global temperatures stays below 1.5 °C. Beyond this level, the integrity of marine systems, and hence our food supplies, have been projected to be so compromised that any 'solution' may be in vain.</p>" +
            "<p>As overfishing compounds the effects of climate change, developing, adopting and enforcing sustainable fisheries management strategies and practices would go a long way towards curbing declines in fisheries productivity due to climate change. In fact Gaines et al. (2018) found that by limiting global warming below 2°C AND implementing effective fisheries management measures, our future could actually benefit from more abundant fish populations, more food for human consumption and more profit for fishermen, despite the negative impacts of climate change. What such management measures entail will vary according to locations, but include:</p>" +
            "<ul>" +
            "<li>setting and enforcing sound science-based limits to fisheries catches and effort;</li>" +
            "<li>developing incentive structures that align environmental and economic outcomes - including fisheries reforms that curtail 'bad ' subsidies that support fleets that would likely be unprofitable without them;</li>" +
            "<li>adapting to changes in fishery productivity through changes in species targeting (this can include associated changes in gears) for example;</li>" +
            "<li>creating effective institutions and mechanisms between countries that share stocks and which will see changes in the proportion of species spending time in their EEZ. Mechanisms will need to equitably and sustainably address these changes.</li>" +
            "</ul>" +
            "<p>Such improvements to our fishery management systems should actually be considered solutions even outside of the context of climate change - in other words we should be implementing them even if climate change was not unfolding.</p>" +
            "<p>Other measures that are part of the solutions are strengthening the protection of critical habitats as nursery and/or feeding grounds for many species important to fisheries - such as seagrass beds, mangroves and coral reefs. Other human stressors in the ocean such as pollution should also be addressed.</p>"
  },
  {
    id: "question4",
    question: "What actions can the general public take?",
    answer: "<p>Global citizens have a responsibility towards reducing the impact of climate change on fish stocks and fisheries by taking action towards the reduction of greenhouse gases emission. These actions could be achieved individually and collectively as citizens of the world. These are the 5 actions you can take;</p>" +
            "<ol>" +
            "<li>Learn more about climate change: Improve your knowledge on climate change, how we can mitigate and adapt to climate change, and other environmental issues could assist you in making the right decisions towards decreasing your <a href='https://en.wikipedia.org/wiki/Carbon_footprint' target='_blank' rel='noopener noreferrer'>'carbon footprint'</a>;</li>" +
            "<li>Learn more about your local fish stocks: Improve your knowledge of local fish stocks and how climate change could affect them. Such knowledge should assist you in participating in discussion towards better governmental policies;</li>" +
            "<li>Stop ocean pollution: Approximately half of the ocean pollution comes from land activities such as agricultural runoff (fertilisers and pesticides), sewage, garbage dumping and chemical spills (e.g. oil). This pollution leads to oxygen-depleted areas in the oceans, which affect the growth and abundance of fish stocks;</li>" +
            "<li>Possible change in diet and food waste: While shopping for food consider how much energy goes into its production, transportation and the production systems. Close to half of the food produced is wasted during production, transportation, processing and in homes. Reducing food waste will reduce the amount of food produced which could reduce the emission from food production;</li>" +
            "<li>Participate in the democratic process: Vote in political leaders that are climate-conscious and increase support for government policies and actions towards better management of the fish stocks.</li>" +
            "</ol>"
  },
  {
    id: "question5",
    question: "Will all northern countries be \"winners\" of climate change in fisheries?",
    answer: "<p>Countries at higher latitudes—i.e. towards the poles—will likely see an increase in abundance of fisheries species as they shift distributions towards higher latitudinal waters (Cheung et al., 2016). However, shifts in species ranges will also come with increased localized invasions, extinctions, and turnover. While fisheries species biomass may increase with climate change for northern countries, it may not translate to benefits to fisheries. Changes in supply of fishes will have major implications on the economies of fisheries with changes in demand and price dynamics. We can expect these changes to affect revenues, incomes, and employment (Lam et al., 2017; Sumaila et al., 2019).</p>" +
            "<p>Changes in fisheries stock biomass will require increased effort for fisheries management to make accurate predictions for catch allocations. Accelerated climate change increases the uncertainty of fisheries stocks, thereby increasing the risk of overfishing and overexploitation (Cheung, 2018). Increased resources are necessary to identify areas and species at greatest risk, and apply local mitigation and adaptation strategies.</p>" +
            "<p>Climate change increases risks and uncertainties to global fisheries, and the term 'climate change winners' should be sparingly used. While there may be some seemingly positive components of climate change for some countries, it will likely come with added trade-offs and difficulties for fisheries as a whole.</p>"
  },
  {
    id: "question6",
    question: "What are the implications for ocean policies?",
    answer: "<p>Given the scale and magnitude of climate change effects on the oceans, we need ocean policies that will:</p>" +
            "<ol>" +
            "<li>minimize the potential impacts through mitigation,</li>" +
            "<li>actively adapt society to the changes and</li>" +
            "<li>strengthen the resilience of ecosystems and society.</li>" +
            "</ol>" +
            "<p>For example, Cheung et al. (2016) showed that following a strong mitigation pathway (Paris Climate Agreement targeting a warming of 1.5 oC by 2100) would reduce losses in fisheries catches by a third relative to a 3.5 oC warming by end of century. Yet, we would still have to adapt to a loss of catches and biodiversity. Research and monitoring programs can help us understand how the environment is changing and allow us to predict how it might change in the future. With better information, we can identify and implement the most effective adaptation policies. In turn, our management frameworks need the flexibility to respond quickly to both predicted and surprise impacts.</p>" +
            "<p>We should reduce our vulnerability to climate change by increasing the resilience of marine ecosystems and the communities that depend on them. For marine ecosystems, this involves minimizing all other human pressures, like overfishing, pollution and habitat destruction, for example, by sustainably managing fisheries and creating Marine Protected Areas. For societies, this involves stabilising dependent communities through short-term effective support interventions that build strong and responsive social protection systems (Béné et al., 2012; Miller et al., 2018). Finally, the transformation of our environment will eventually become so large that the fishing sector will have to not only adapt but transform in the face of climate change.</p>"
  }
];

const references = [
  {
    id: 'reference1',
    explanation: "Allison, E.H., Perry, A.L., Badjeck, M.-C., Adger, W.N., Brown, K., Conway, D., Halls, A.S., Pilling, G.M., Reynolds, J.D., Andrew, N.L., Dulvy, N.K., 2009. Vulnerability of national economies to the impacts of climate change on fisheries. Fish Fish. 10, 173–196. https://doi.org/10.1111/j.1467-2979.2008.00310.x"
  },
  {
    id: 'reference2',
    explanation: "BARANGE, M., MERINO, G., BLANCHARD, J., SCHOLTENS, J., HARLE, J., ALLISON, E., ALLEN, J., HOLT, J. & JENNINGS, S. 2014. Impacts of climate change on marine ecosystem production in societies dependent on fisheries. Nat. Clim. Change, 4, 211-216."
  },
  {
    id: 'reference3',
    explanation: "Béné, C., Wood, R.G., Newsham, A., Davies, M., 2012. Resilience: New Utopia or New Tyranny? Reflection about the Potentials and Limits of the Concept of Resilience in Relation to Vulnerability Reduction Programmes. IDS Work. Pap. 2012, 1–61. https://doi.org/10.1111/j.2040-0209.2012.00405.x"
  },
  {
    id: 'reference4',
    explanation: "BEAUGRAND, G., EDWARDS, M., RAYBAUD, V., GOBERVILLE, E. & KIRBY, R. R. 2015. Future vulnerability of marine biodiversity compared with contemporary and past changes. Nat. Clim. Change, 5, 695–701."
  },
  {
    id: 'reference5',
    explanation: "BLANCHARD, J. L., JENNINGS, S., HOLMES, R., HARLE, J., MERINO, G., ALLEN, J. I., HOLT, J., DULVY, N. K. & BARANGE, M. 2012. Potential consequences of climate change for primary production and fish production in large marine ecosystems. Phil. Trans. R. Soc. B, 367, 2979-2989."
  },
  {
    id: 'reference6',
    explanation: "CHEUNG, W. W., LAM, V. W., SARMIENTO, J. L., KEARNEY, K., WATSON, R. & PAULY, D. 2009. Projecting global marine biodiversity impacts under climate change scenarios. Fish Fish, 10, 235-251."
  },
  {
    id: 'reference7',
    explanation: "CHEUNG, W. W., SARMIENTO, J. L., DUNNE, J., FRÖLICHER, T. L., LAM, V. W., PALOMARES, M. D., WATSON, R. & PAULY, D. 2013. Shrinking of fishes exacerbates impacts of global ocean changes on marine ecosystems. Nat. Clim. Change, 3, 254-258."
  },
  {
    id: 'reference8',
    explanation: "Cheung, W.W.L., Reygondeau, G., Frölicher, T.L., 2016.. Large benefits to marine fisheries of meeting the 1.5°C global warming target. Science 354, 1591–1594. https://doi.org/10.1126/science.aag2331"
  },
  {
    id: 'reference9',
    explanation: "Cisneros-Montemayor, A.M., Pauly, D., Weatherdon, L.V. and Ota, Y., 2016. A global estimate of seafood consumption by coastal indigenous peoples. PLoS One, 11(12), p.e0166681."
  },
  {
    id: 'reference10',
    explanation: "CLARK, R. A., FOX, C. J., VINER, D. & LIVERMORE, M. 2003. North Sea cod and climate change–modelling the effects of temperature on population dynamics. Global Change Biol, 9, 1669-1680."
  },
  {
    id: 'reference11',
    explanation: "Eide, A. Economic impacts of global warming: The case of the Barents Sea fisheries. Nat Resour Model 20, 199-221 (2007)."
  },
  {
    id: 'reference12',
    explanation: "FAO 2016. The State of World Fisheries and Aquaculture 2016. Rome."
  },
  {
    id: 'reference13',
    explanation: "FAO. The State of World Fisheries and Aquaculture. 223 (Rome, 2014)."
  },
  {
    id: 'reference14',
    explanation: "FERNANDES, J. A., CHEUNG, W. W., JENNINGS, S., BUTENSCHÖN, M., MORA, L., FRÖLICHER, T. L., BARANGE, M. & GRANT, A. 2013. Modelling the effects of climate change on the distribution and production of marine fishes: accounting for trophic interactions in a dynamic bioclimate envelope model. Global change biology, 19, 2596-2607."
  },
  {
    id: 'reference15',
    explanation: "Golden, C. D. et al. Nutrition: Fall in fish catch threatens human health. Nature 534, 317-320 (2016)."
  },
  {
    id: 'reference16',
    explanation: "LAM, V. W. Y., CHEUNG, W. W. L., REYGONDEAU, G. & SUMAILA, U. R. 2016. Projected change in global fisheries revenues under climate change. Scientific Reports, 6, 32607."
  },
  {
    id: 'reference17',
    explanation: "LAST, P. R., WHITE, W. T., GLEDHILL, D. C., HOBDAY, A. J., BROWN, R., EDGAR, G. J. & PECL, G. 2011. Long‐term shifts in abundance and distribution of a temperate fish fauna: a response to climate change and fishing practices. Global Ecology and Biogeography, 20, 58-72."
  },
  {
    id: 'reference18',
    explanation: "Miller, D.D., Ota, Y., Sumaila, U.R., Cisneros-Montemayor, A.M., Cheung, W.W.L., 2018. Adaptation strategies to climate change in marine systems. Glob. Change Biol. 24, e1–e14. https://doi.org/10.1111/gcb.13829"
  },
  {
    id: 'reference19',
    explanation: "NYE, J. A., LINK, J. S., HARE, J. A. & OVERHOLTZ, W. J. 2009. Changing spatial distribution of fish stocks in relation to climate and population size on the Northeast United States continental shelf. Marine Ecology Progress Series, 393, 111-129."
  },
  {
    id: 'reference20',
    explanation: "PAULY, D. & ZELLER, D. 2016. Catch reconstructions reveal that global fisheries catches are higher than reported and declining. Nat. Commun., 7."
  },
  {
    id: 'reference21',
    explanation: "PINSKY, M. L. & FOGARTY, M. 2012. Lagged social-ecological responses to climate and range shifts in fisheries. Climatic change, 115, 883-891."
  },
  {
    id: 'reference22',
    explanation: "PINSKY, M. L., WORM, B., FOGARTY, M. J., SARMIENTO, J. L. & LEVIN, S. A. 2013. Marine taxa track local climate velocities. Science, 341, 1239-1242."
  },
  {
    id: 'reference23',
    explanation: "PÖRTNER, H.-O., KARL, D. M., BOYD, P. W., CHEUNG, W., LLUCH-COTA, S., NOJIRI, Y., SCHMIDT, D. N., ZAVIALOV, P. O., ALHEIT, J. & ARISTEGUI, J. 2014. Ocean systems. Climate Change 2014: Impacts, Adaptation, and Vulnerability. Part A: Global and Sectoral Aspects. Contribution of Working Group II to the Fifth Assessment Report of the Intergovernmental Panel on Climate Change, 411-484."
  },
  {
    id: 'reference24',
    explanation: "ROSE, G. 2005. On distributional responses of North Atlantic fish to climate change. ICES J Mar Sci, 62, 1360-1374."
  },
  {
    id: 'reference25',
    explanation: "SUMAILA, U. R., CHEUNG, W. W., LAM, V. W., PAULY, D. & HERRICK, S. 2011. Climate change impacts on the biophysics and economics of world fisheries. Nat. Clim. Change, 1, 449-456."
  },
  {
    id: 'reference26',
    explanation: "SWARTZ, W., SUMAILA, R. & WATSON, R. 2012. Global Ex-vessel Fish Price Database Revisited: A New Approach for Estimating 'Missing' Prices. Environ. Resour. Econ., 1-14."
  }
];

const headings = [
  { id: 'references', text: 'References', level: 1 },
];

export default function FAQPage() {
  return (
    <DocsLayout title="FAQ" headings={headings} showNavLinks={true}>
      <h1 id="faq" className="text-4xl font-bold text-primary mb-8">Frequently Asked Questions</h1>

      <div className="prose prose-lg max-w-none space-y-8">
        {faqData.map((faq) => (
          <section key={faq.id} id={faq.id} className="space-y-4">
            <h2 className="text-2xl font-bold text-primary mt-8 mb-4">{faq.question}</h2>
            <div 
              className="text-gray-700 leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-2 [&_a]:text-secondary [&_a]:hover:underline"
              dangerouslySetInnerHTML={{ __html: faq.answer }} 
            />
          </section>
        ))}

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
