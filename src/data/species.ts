import { SpeciesData, SurveyRecord, isFaunaSpecies } from '../types';

export function enrichSpeciesWithEducationalData(species: SpeciesData): SpeciesData {
  if (!species) return species;
  const common = (species.commonName || '').toLowerCase();
  const scientific = (species.scientificName || '').toLowerCase();
  const isFauna = isFaunaSpecies(species);

  let endangeredStatus = species.endangeredStatus;
  let conservationStatus = species.conservationStatus;
  let climateZone = species.climateZone;
  let medicinalProperties = species.medicinalProperties;
  let medicinalArticleUrl = species.medicinalArticleUrl;
  let medicinalArticleTitle = species.medicinalArticleTitle;
  let dietType = species.dietType;
  let dietDescription = species.dietDescription;
  let extinctionReasons = species.extinctionReasons;
  let preventiveMeasures = species.preventiveMeasures;
  let commonUses = species.commonUses;
  let predominantRegions = species.predominantRegions;
  let interestingFacts = species.interestingFacts;

  if (common.includes('prairie orchid') || scientific.includes('praeclara')) {
    endangeredStatus = endangeredStatus || 'Endangered - Critical Extinction Risk';
    conservationStatus = conservationStatus || 'IUCN Red List: Endangered (EN, Criteria A2)';
    climateZone = climateZone || 'Temperate Wet-Mesic Tallgrass Prairie';
    medicinalProperties = medicinalProperties || 'Historically utilized in Indigenous Great Plains healing washes for dermatological relief; rich in secondary metabolites with mild antioxidant and anti-inflammatory attributes.';
    medicinalArticleUrl = medicinalArticleUrl || 'https://pubmed.ncbi.nlm.nih.gov/?term=Platanthera+praeclara+medicinal+orchid';
    medicinalArticleTitle = medicinalArticleTitle || 'NCBI PMC: Ethnobotanical Uses and Secondary Metabolites of Platanthera Orchidaceae';
    extinctionReasons = extinctionReasons || [
      'Conversion of over 75% of native wet tallgrass prairie habitat into deep-soil tiled crop agriculture.',
      'Regional water table alterations from subterranean drainage ditches and tile networks.',
      'Decline in night-flying sphinx hawkmoth populations essential for cross-pollination.'
    ];
    preventiveMeasures = preventiveMeasures || [
      'Hydrological restoration of wet-mesic prairie fen reserves by disabling drainage tiles.',
      'Prescribed late-season burning to suppress competing invasive woody brush.',
      'Establishment of native night-blooming hawkmoth nectar host corridors.'
    ];
    commonUses = commonUses || 'Crucial ecological indicator of intact native tallgrass wetlands; protected under endangered botanical conservation treaties and habitat restoration programs.';
    predominantRegions = predominantRegions || ['United States (Minnesota, North Dakota, Iowa)', 'Canada (Manitoba)'];
    interestingFacts = interestingFacts || [
      'Blooms release a sweet night fragrance specifically calibrated to attract nocturnal sphinx hawkmoths whose long tongues reach the 5cm nectar spurs.',
      'Over 75% of its natural tallgrass prairie habitat was lost due to deep-soil agriculture and underground drainage alterations.'
    ];
  } else if (common.includes('monarch') || scientific.includes('plexippus')) {
    endangeredStatus = endangeredStatus || 'Vulnerable - Migratory Decline';
    conservationStatus = conservationStatus || 'IUCN Red List: Endangered / Vulnerable';
    climateZone = climateZone || 'Temperate to Subtropical Migration Corridors';
    dietType = dietType || 'Herbivore';
    dietDescription = dietDescription || 'Specialized herbivore: caterpillars feed exclusively on milkweed foliage and cardenolide-rich sap, while adult butterflies sip high-energy nectar from prairie blossoms.';
    extinctionReasons = extinctionReasons || [
      'Loss of over 85% of milkweed host plants across Midwest farm belts due to broad-spectrum herbicides.',
      'Deforestation and catastrophic winter freeze storms in Mexican wintering Oyamel fir sanctuaries.',
      'Rising climate volatility disrupting multi-generational migratory flight windows.'
    ];
    preventiveMeasures = preventiveMeasures || [
      'Plant pesticide-free native milkweed corridors along interstate highways and community habitats.',
      'Enforce international trilateral migratory flyway protection treaties between Canada, US, and Mexico.',
      'Halt prophylactic herbicide and insecticide spraying along rural field margins and utility easements.'
    ];
    commonUses = commonUses || 'Global flagship ambassador for pollinator conservation, citizen science tracking, and international prairie flyway treaties.';
    predominantRegions = predominantRegions || ['United States', 'Canada', 'Mexico (Oyamel Fir Reserves)', 'Australia & New Zealand'];
    interestingFacts = interestingFacts || [
      'Embarks on an extraordinary 4,800 km multi-generational migration from Canada to the high volcanic mountains of Mexico.',
      'A female monarch can lay up to 500 eggs, each carefully placed one-by-one exclusively on the underside of fresh milkweed leaves.'
    ];
  } else if (common.includes('milkweed') || scientific.includes('asclepias')) {
    endangeredStatus = endangeredStatus || 'Near Threatened in Prairie Biomes';
    conservationStatus = conservationStatus || 'IUCN Red List: Least Concern (Keystone Nursery)';
    climateZone = climateZone || 'Temperate & Subtropical Grasslands';
    medicinalProperties = medicinalProperties || 'Traditional Indigenous poultices used milky latex sap for warts and ringworm; root extracts (Pleurisy root) historically served as a mild expectorant.';
    medicinalArticleUrl = medicinalArticleUrl || 'https://pubmed.ncbi.nlm.nih.gov/?term=Asclepias+syriaca+cardiac+glycosides+medicinal';
    medicinalArticleTitle = medicinalArticleTitle || 'NCBI PubMed: Cardenolides & Bioactive Glycosides in Asclepias syriaca';
    extinctionReasons = extinctionReasons || [
      'Widespread agricultural use of broad-spectrum glyphosate eliminating field-margin milkweed.',
      'Frequent municipal roadside mowing during peak monarch egg-laying and flowering periods.'
    ];
    preventiveMeasures = preventiveMeasures || [
      'Establish designated pesticide-free pollinator highway rights-of-way with delayed autumn mowing.',
      'Community and classroom native prairie seed broadcasting programs.'
    ];
    commonUses = commonUses || 'Essential sole host nursery plant for monarch butterflies; silky seed floss historically gathered for buoyant life jacket insulation.';
    predominantRegions = predominantRegions || ['United States', 'Canada', 'Central Europe (Naturalized)'];
    interestingFacts = interestingFacts || [
      'The silky hairs of milkweed seeds are hollow and coated with a natural wax, making them 6 times more buoyant than cork and warmer than wool.',
      'During World War II, schoolchildren across the Midwest collected over 11 million pounds of milkweed pods to supply life jackets for the Navy!'
    ];
  } else if (common.includes('coneflower') || scientific.includes('echinacea')) {
    endangeredStatus = endangeredStatus || 'Near Threatened in Wild Habitats';
    conservationStatus = conservationStatus || 'IUCN Red List: Least Concern / Near Threatened in wild';
    climateZone = climateZone || 'Temperate Prairie & Dry Savanna';
    medicinalProperties = medicinalProperties || 'Widely recognized herbal immune booster rich in echinacosides and caffeic acid; clinically used to reduce duration of cold and upper respiratory symptoms.';
    medicinalArticleUrl = medicinalArticleUrl || 'https://pubmed.ncbi.nlm.nih.gov/?term=Echinacea+purpurea+clinical+immune+pharmacology';
    medicinalArticleTitle = medicinalArticleTitle || 'NIH National Library of Medicine: Immunomodulatory & Therapeutic Effects of Echinacea purpurea';
    extinctionReasons = extinctionReasons || [
      'Historical over-harvesting of wild roots for commercial herbal medicine extraction.',
      'Fragmentation of dry mesic prairies by agricultural and residential development.'
    ];
    preventiveMeasures = preventiveMeasures || [
      'Promote sustainable commercial nursery farming to eliminate pressure on wild root populations.',
      'Establish prairie buffer restoration corridors and rotational prescribed burns.'
    ];
    commonUses = commonUses || 'Formulated into herbal teas, lozenges, and dietary tinctures; planted in drought-resistant pollinator gardens for native bees.';
    predominantRegions = predominantRegions || ['United States (Great Plains & Midwest)', 'Canada (Ontario, Saskatchewan)', 'Cultivated throughout Europe & Asia'];
    interestingFacts = interestingFacts || [
      'Its name Echinacea comes from the Greek "echinos" (hedgehog or sea urchin), describing the spiny central cone disk.',
      'Deep taproots extend nearly 2 meters straight down into dry soil, surviving blistering droughts without supplemental water.'
    ];
  } else if (common.includes('lady\'s slipper') || scientific.includes('cypripedium')) {
    endangeredStatus = endangeredStatus || 'Endangered - Strict Legal Protection';
    conservationStatus = conservationStatus || 'IUCN Red List: Vulnerable / State Endangered';
    climateZone = climateZone || 'Boreal & Cold Temperate Calcareous Fens';
    medicinalProperties = medicinalProperties || 'Native Americans historically prepared a mild sedative tea from dried roots for anxiety and insomnia (known in folk medicine as American Valerian).';
    medicinalArticleUrl = medicinalArticleUrl || 'https://pubmed.ncbi.nlm.nih.gov/?term=Cypripedium+orchid+medicinal+compounds';
    medicinalArticleTitle = medicinalArticleTitle || 'NCBI Research: Bioactive Constituents & Traditional Pharmacopeia of Cypripedium';
    extinctionReasons = extinctionReasons || [
      'Illegal wild poaching and digging by rare orchid collectors and commercial traffickers.',
      'Drainage of boreal calcareous fens lowering regional water tables.',
      'Unchecked white-tailed deer browsing destroying fragile emerging flower shoots.'
    ];
    preventiveMeasures = preventiveMeasures || [
      'Strict legal enforcement of state endangered species trespass fines and trail surveillance.',
      'Install deer-exclusion fencing around verified wild orchid fen colonies.',
      'Hydrological restoration of calcareous wetlands and vernal fen margins.'
    ];
    commonUses = commonUses || 'Official state flower of Minnesota; premier flagship orchid for wetland fen conservation and orchid biology education.';
    predominantRegions = predominantRegions || ['United States (Minnesota, Wisconsin, Michigan)', 'Canada (Ontario, Quebec)'];
    interestingFacts = interestingFacts || [
      'Takes 15 to 16 years from seed to produce its very first flower in the wild!',
      'Relies on symbiotic mycorrhizal soil fungi to feed its microscopic seeds because orchid seeds carry zero nutrient reserves.'
    ];
  } else if (common.includes('bumblebee') || scientific.includes('bombus')) {
    endangeredStatus = endangeredStatus || 'Critically Endangered - High Collapse Risk';
    conservationStatus = conservationStatus || 'IUCN Red List: Critically Endangered (CR A1)';
    climateZone = climateZone || 'Temperate Grasslands & Woodland Parks';
    dietType = dietType || 'Herbivore';
    dietDescription = dietDescription || 'Herbivorous nectarivore & pollenivore: feeds on floral nectar for worker flight energy and collects floral pollen proteins to feed developing brood and queens.';
    extinctionReasons = extinctionReasons || [
      'Widespread agricultural and suburban use of neonicotinoid systemic pesticides toxic to bee neurology.',
      'Lethal microsporidian fungal pathogens (Nosema bombi) transferred from commercial greenhouse bumblebees.',
      'Severe loss of continuous spring-to-autumn floral blooming corridors across native grasslands.'
    ];
    preventiveMeasures = preventiveMeasures || [
      'Ban prophylactic neonicotinoid seed treatments across critical bumblebee habitat zones.',
      'Establish pesticide-free urban pollinator gardens and preserve uncompacted overwintering soil burrows.',
      'Plant diverse multi-species native floral arrays with continuous blooms from April to October.'
    ];
    commonUses = commonUses || 'Essential keystone wild pollinator for native cranberries, blueberries, tomatoes, and wildflowers.';
    predominantRegions = predominantRegions || ['Upper Mississippi Watershed', 'Great Lakes Region', 'Upper Midwest US'];
    interestingFacts = interestingFacts || [
      'The first federally endangered bumblebee in the continental United States.',
      'Performs "buzz pollination" by vibrating its flight muscles at Middle C frequency to shake pollen free from stubborn blossoms.'
    ];
  } else if (common.includes('turtle') || scientific.includes('blandingii')) {
    endangeredStatus = endangeredStatus || 'Endangered - High Extinction Risk';
    conservationStatus = conservationStatus || 'IUCN Red List: Endangered (EN A2)';
    climateZone = climateZone || 'Wetland Marshes, Fens & Vernal Pools';
    dietType = dietType || 'Omnivore';
    dietDescription = dietDescription || 'Aquatic and terrestrial omnivore: consumes crayfish, aquatic insects, snails, frog tadpoles, along with duckweed, water lily leaves, and seeds.';
    extinctionReasons = extinctionReasons || [
      'High vehicular road mortality when adult nesting females cross highways to find sandy nesting sites.',
      'Drainage and infilling of shallow wetland marshes and vernal pools for agriculture and housing.',
      'Subsidized raccoon and skunk populations destroying upwards of 80% of turtle nests each season.'
    ];
    preventiveMeasures = preventiveMeasures || [
      'Install specialized amphibian and reptile barrier fencing with eco-passage tunnels beneath crossing roads.',
      'Deploy predator-exclusion wire mesh cages over monitored turtle nests until eggs hatch.',
      'Legally protect contiguous wetland-upland complexes under state conservation easements.'
    ];
    commonUses = commonUses || 'Apex wetland bio-indicator; flagship species for interconnected freshwater marsh preservation.';
    predominantRegions = predominantRegions || ['Great Lakes Basin', 'Minnesota & Wisconsin Marshes', 'Southern Ontario (Canada)'];
    interestingFacts = interestingFacts || [
      'Easily identified by its bright canary-yellow throat and distinct curved "smile".',
      'Can live over 75 years in the wild and reproduce successfully well into its seventies!'
    ];
  } else if (common.includes('tiger') || scientific.includes('tigris')) {
    endangeredStatus = endangeredStatus || 'Endangered - Critical Population Threat';
    conservationStatus = conservationStatus || 'IUCN Red List: Endangered (EN Criteria C2a)';
    climateZone = climateZone || 'Dry Deciduous Forest & Subtropical Woodlands';
    dietType = dietType || 'Carnivore';
    dietDescription = dietDescription || 'Strict apex carnivore: stalks and preys upon large ungulates including Sambar deer, Chital (spotted deer), wild boar, and Nilgai; prevents overgrazing of forest understories.';
    extinctionReasons = extinctionReasons || [
      'Habitat fragmentation and loss of contiguous forest corridors connecting tiger reserves.',
      'Illegal wildlife poaching driven by international black market trade in tiger skins and bones.',
      'Depleted wild herbivore prey densities and retaliatory conflict around human settlements.'
    ];
    preventiveMeasures = preventiveMeasures || [
      'Expand and legally protect contiguous wildlife corridors connecting Ranthambore and adjacent forests.',
      'Deploy 24/7 SMART satellite anti-poaching patrols and AI-driven thermal camera surveillance.',
      'Community-based ecotourism benefit sharing and voluntary village relocation out of core tiger habitats.'
    ];
    commonUses = commonUses || 'National Animal of India; premier flagship apex predator maintaining ecological balance across Asian forest ecosystems.';
    predominantRegions = predominantRegions || ['India (Ranthambore, Jim Corbett, Sundarbans)', 'Nepal', 'Bhutan & Bangladesh'];
    interestingFacts = interestingFacts || [
      'Each tiger has a completely unique pattern of black stripes—no two tigers in the world share the same pattern, like human fingerprints!',
      'Unlike most other big cats, tigers love water and are powerful swimmers capable of crossing rivers several miles wide.'
    ];
  } else if (common.includes('leopard') || scientific.includes('pardus')) {
    endangeredStatus = endangeredStatus || 'Vulnerable - Near Human Settlements';
    conservationStatus = conservationStatus || 'IUCN Red List: Vulnerable (VU Criteria C1)';
    climateZone = climateZone || 'Aravalli Scrub & Dry Deciduous Hills';
    dietType = dietType || 'Carnivore';
    dietDescription = dietDescription || 'Opportunistic solitary carnivore: stalks medium to small prey including desert hares, langurs, peafowl, nilgai calves, and rodents across rocky scrub outcroppings.';
    extinctionReasons = extinctionReasons || [
      'Encroachment of urban development and vehicular collisions across peripheral highway roads.',
      'Prey depletion in fragmented scrub corridors forcing carnivores near human borders.',
      'Retaliatory trapping, poisoning, and illicit poaching for skins and claws.'
    ];
    preventiveMeasures = preventiveMeasures || [
      'Establish dedicated wildlife underpasses along major highway corridors to prevent roadkill.',
      'Construct wildlife rescue networks and rapid-response conflict resolution teams in urban border zones.',
      'Preserve contiguous rocky scrub ridges and restore natural wild prey populations in buffer hills.'
    ];
    commonUses = commonUses || 'Apex rocky-hill controller; bio-indicator of healthy dry-deciduous scrub ecosystems and coexistence models.';
    predominantRegions = predominantRegions || ['India (Jhalana Reserve, Aravalli Ranges, Rajasthan)', 'Central & Southern Indian Sanctuaries'];
    interestingFacts = interestingFacts || [
      'Jhalana Sanctuary in Jaipur is the world’s first dedicated urban leopard reserve, where leopards thrive right on the boundary of a city of 4 million people!',
      'Features distinctive rosette camouflage markings and can leap up to 6 meters horizontally.'
    ];
  } else if (common.includes('peafowl') || scientific.includes('pavo')) {
    endangeredStatus = endangeredStatus || 'Least Concern / Culturally Protected';
    conservationStatus = conservationStatus || 'IUCN Red List: Least Concern (National Bird of India)';
    climateZone = climateZone || 'Semi-Arid Scrub, City Parks & Riparian Woodlands';
    dietType = dietType || 'Omnivore';
    dietDescription = dietDescription || 'Adaptable ground-foraging omnivore: consumes wild grains, seeds, flower petals, berries, insects, ticks, grasshoppers, and small reptiles (including juvenile snakes).';
    extinctionReasons = extinctionReasons || [
      'Agricultural chemical seed dressing toxicity and pesticide runoff in peripheral croplands.',
      'Felling of historic tall roosting trees (banyan, neem) due to infrastructure expansion.'
    ];
    preventiveMeasures = preventiveMeasures || [
      'Promote organic farming practices and non-toxic seed treatments around village boundaries.',
      'Preserve ancient heritage roosting trees and establish community protected nesting groves.'
    ];
    commonUses = commonUses || 'National Bird of India; biological pest controller against insects and ticks; revered cultural icon.';
    predominantRegions = predominantRegions || ['India (Rajasthan, Gujarat, Madhya Pradesh)', 'Nepal', 'Sri Lanka & Pakistan'];
    interestingFacts = interestingFacts || [
      'Male peafowls (peacocks) do not grow their magnificent 5-foot iridescent eye-spotted tail train until they reach 3 years of age.',
      'Revered for centuries for their ability to hunt and consume venomous juvenile cobra snakes without harm.'
    ];
  } else if (common.includes('chinkara') || scientific.includes('gazella')) {
    endangeredStatus = endangeredStatus || 'Least Concern / Arid Zone Sentinel';
    conservationStatus = conservationStatus || 'IUCN Red List: Least Concern (State Heritage Animal)';
    climateZone = climateZone || 'Arid Desert & Aravalli Foothill Scrub';
    dietType = dietType || 'Herbivore';
    dietDescription = dietDescription || 'Specialized arid herbivore: browses on desert grasses, acacia foliage, wild gourds, and succulent desert shrubs, extracting required water metabolically.';
    extinctionReasons = extinctionReasons || [
      'Predation and harassment by feral stray dog packs around sanctuary perimeters.',
      'Linear infrastructure (high-speed roads, canals, wire fences) fragmenting grazing migration paths.'
    ];
    preventiveMeasures = preventiveMeasures || [
      'Feral dog population management and vaccination around wildlife sanctuary boundaries.',
      'Install wildlife-permeable fencing allowing gazelle movement without risk of entrapment.',
      'Strict enforcement of Indian Wildlife Protection Act Schedule I penalties against poaching.'
    ];
    commonUses = commonUses || 'State Heritage Animal of Rajasthan; primary native desert grazer preventing scrub bush overgrowth.';
    predominantRegions = predominantRegions || ['Thar Desert & Aravalli Foothills (Rajasthan, India)', 'Gujarat Arid Plains', 'Iran & Pakistan'];
    interestingFacts = interestingFacts || [
      'In hot desert conditions, Chinkaras can survive for months without drinking open water by absorbing moisture from desert dew and vegetation!',
      'Can run in graceful bounds reaching speeds of up to 64 km/h to escape predators.'
    ];
  } else if (common.includes('monitor') || scientific.includes('bengalensis')) {
    endangeredStatus = endangeredStatus || 'Least Concern / Legally Protected';
    conservationStatus = conservationStatus || 'IUCN Red List: Least Concern (Schedule I Protected)';
    climateZone = climateZone || 'Rocky Ridges, Fort Ruins & Dry Scrub';
    dietType = dietType || 'Carnivore';
    dietDescription = dietDescription || 'Carnivore and opportunistic scavenger: feeds on terrestrial beetles, snails, bird eggs, rodents, amphibians, crabs, and smaller lizards.';
    extinctionReasons = extinctionReasons || [
      'Illegal poaching driven by illicit trade in reptile leather, folk medicine, and meat.',
      'Loss of rocky scrub habitats and boulder fields to granite and quartzite quarrying.'
    ];
    preventiveMeasures = preventiveMeasures || [
      'Regulate and halt illegal rock quarrying across ancient Aravalli boulder corridors.',
      'Crack down on illicit wildlife trade networks and increase monitoring of local markets.',
      'Public educational campaigns countering superstitious beliefs about reptile remedies.'
    ];
    commonUses = commonUses || 'Schedule I protected reptile; natural controller of agricultural rodent pests and insect populations.';
    predominantRegions = predominantRegions || ['India (Amer Fort, Nahargarh, Rajasthan)', 'Bangladesh', 'Nepal & Pakistan'];
    interestingFacts = interestingFacts || [
      'Can grow up to 1.75 meters long and possesses razor-sharp claws with an iron-like grip on stone cliffs.',
      'In Indian history, Maratha warriors were said to have used trained monitor lizards with ropes to scale fortress walls at night!'
    ];
  } else if (common.includes('khejri') || scientific.includes('cineraria')) {
    endangeredStatus = endangeredStatus || 'Least Concern / Keystone Desert Anchor';
    conservationStatus = conservationStatus || 'State Tree of Rajasthan / Cultural Keystone';
    climateZone = climateZone || 'Arid & Semi-Arid Desert Ecosystems';
    medicinalProperties = medicinalProperties || 'Bark, leaves, and pods contain anti-inflammatory flavonoids and tannins traditionally brewed for skin ailments, rheumatism, and digestive health.';
    medicinalArticleUrl = medicinalArticleUrl || 'https://pubmed.ncbi.nlm.nih.gov/?term=Prosopis+cineraria+medicinal+phytochemical';
    medicinalArticleTitle = medicinalArticleTitle || 'NCBI PMC: Pharmacological Activities and Traditional Uses of Prosopis cineraria';
    extinctionReasons = extinctionReasons || [
      'Over-exploitation for firewood, charcoal, and severe unscientific branch lopping.',
      'Falling groundwater tables in arid zones affecting deep taproot access.'
    ];
    preventiveMeasures = preventiveMeasures || [
      'Support community sacred grove protection and traditional Bishnoi conservation practices.',
      'Enforce government protection against unauthorized logging of desert heritage trees.',
      'Construct rainwater harvesting check-dams to replenish shallow groundwater aquifers.'
    ];
    commonUses = commonUses || 'State Tree of Rajasthan; Kalpavriksha of the desert providing protein-rich Sangri pods for culinary food and camel fodder.';
    predominantRegions = predominantRegions || ['Thar Desert & Rajasthan (India)', 'Punjab & Gujarat', 'Oman & UAE'];
    interestingFacts = interestingFacts || [
      'Features a superhuman taproot that penetrates over 35 meters straight down into deep bedrock to tap ancient subterranean water!',
      'Famously protected in 1730 by Amrita Devi and 363 Bishnoi villagers who sacrificed their lives hugging the trees to prevent them from being cut down.'
    ];
  } else if (common.includes('compass plant') || scientific.includes('silphium')) {
    endangeredStatus = endangeredStatus || 'Vulnerable - Virgin Prairie Remnants';
    conservationStatus = conservationStatus || 'IUCN Red List: Vulnerable (Criteria A4)';
    climateZone = climateZone || 'Virgin Deep-Soil Tallgrass Prairies';
    medicinalProperties = medicinalProperties || 'Aromatic resin sap traditionally gathered by Indigenous Great Plains tribes as an antiseptic chewing gum and expectorant tea for respiratory wellness.';
    medicinalArticleUrl = medicinalArticleUrl || 'https://pubmed.ncbi.nlm.nih.gov/?term=Silphium+laciniatum+resin+medicinal';
    medicinalArticleTitle = medicinalArticleTitle || 'Botanical Science: Resin Glycosides and Medicinal Uses of Silphium laciniatum';
    extinctionReasons = extinctionReasons || [
      'Destruction of deep virgin tallgrass prairie sod by mechanized industrial plowing.',
      'Herbicide spraying on railway and highway remnant strips where relic populations persist.'
    ];
    preventiveMeasures = preventiveMeasures || [
      'Protect undisturbed virgin tallgrass prairie remnant easements.',
      'Harvest native seed and reseed in tallgrass prairie corridor buffer restorations.'
    ];
    commonUses = commonUses || 'Biological soil indicator of undisturbed virgin prairie sod; vital drought-proof native pollinator anchor.';
    predominantRegions = predominantRegions || ['United States (Great Plains, Midwest Tallgrass Remnants)', 'Canada'];
    interestingFacts = interestingFacts || [
      'Its deeply lobed leaves orient themselves North-South on edge to avoid scorching midday sun rays, acting as a natural magnetic compass!',
      'Taproots descend over 4 meters into undisturbed prairie sod, surviving severe droughts and wildfires.'
    ];
  } else if (common.includes('banana') || scientific.includes('musa')) {
    endangeredStatus = endangeredStatus || 'Wild Ancestors Endangered / Commercial Crops Secure';
    conservationStatus = conservationStatus || 'IUCN Red List: Wild ancestors Endangered (EN), Cultivated varieties Abundant';
    climateZone = climateZone || 'Humid Tropical & Subtropical Lowlands';
    medicinalProperties = medicinalProperties || 'Packed with potassium, vitamin B6, and prebiotic dietary fiber; supports electrolyte balance, blood pressure regulation, and gut digestion.';
    medicinalArticleUrl = medicinalArticleUrl || 'https://pubmed.ncbi.nlm.nih.gov/?term=Musa+acuminata+bioactive+compounds+health';
    medicinalArticleTitle = medicinalArticleTitle || 'ScienceDirect: Nutritional Composition and Health-Promoting Phytochemicals of Musa acuminata';
    extinctionReasons = extinctionReasons || [
      'Commercial clonal monocultures threatened by Tropical Race 4 (TR4) Fusarium fungal wilt.',
      'Loss of wild diploid ancestors in tropical rainforests due to agricultural expansion.'
    ];
    preventiveMeasures = preventiveMeasures || [
      'Preserve wild germplasm gene banks to cross-breed fungal disease resistance.',
      'Intercropping and organic soil microbiome bio-inoculation to suppress wilt pathogens.'
    ];
    commonUses = commonUses || 'World’s most consumed fresh fruit; massive waterproof leaves are widely used across Asia as biodegradable plates and steaming wraps.';
    predominantRegions = predominantRegions || ['India (largest producer)', 'Ecuador', 'Philippines', 'Brazil & Colombia'];
    interestingFacts = interestingFacts || [
      'Botanically, a banana is a berry, and the banana plant is not a tree at all—it is the world’s largest perennial herb!',
      'Cavendish bananas have no seeds; each plant is a genetic clone propagated from root suckers.'
    ];
  } else if (common.includes('apple') || scientific.includes('malus')) {
    endangeredStatus = endangeredStatus || 'Secure / Globally Cultivated';
    conservationStatus = conservationStatus || 'IUCN Red List: Least Concern';
    climateZone = climateZone || 'Temperate Continental & Maritime';
    medicinalProperties = medicinalProperties || 'High in soluble pectin fiber, vitamin C, and quercetin polyphenols; lowers LDL cholesterol and promotes cardiovascular cellular health.';
    medicinalArticleUrl = medicinalArticleUrl || 'https://pubmed.ncbi.nlm.nih.gov/?term=Malus+domestica+quercetin+cardiovascular+health';
    medicinalArticleTitle = medicinalArticleTitle || 'NCBI PubMed: Polyphenols, Dietary Fiber, and Human Health Benefits of Apples';
    extinctionReasons = extinctionReasons || [
      'Decline of wild solitary bee populations essential for cross-pollination.',
      'Spring frost volatility and erratic winter chill hours due to climate change.'
    ];
    preventiveMeasures = preventiveMeasures || [
      'Provide solitary bee nesting blocks and plant multi-species cover crops in orchards.',
      'Preserve heritage apple orchards with diverse genetic rootstocks.'
    ];
    commonUses = commonUses || 'Fresh eating, gourmet ciders, baking, applesauce, and commercial orchard agro-forestry.';
    predominantRegions = predominantRegions || ['United States (Washington, New York)', 'China', 'Poland', 'Turkey & Italy'];
    interestingFacts = interestingFacts || [
      'Honeycrisp cells are twice the size of standard apples, exploding with pressurized sweet juice when you take a bite!',
      'Apples float in water because 25% of their volume is air!'
    ];
  } else if (common.includes('tomato') || scientific.includes('lycopersicon') || scientific.includes('solanum')) {
    endangeredStatus = endangeredStatus || 'Secure / Globally Cultivated';
    conservationStatus = conservationStatus || 'IUCN Red List: Least Concern';
    climateZone = climateZone || 'Warm Subtropical & Temperate';
    medicinalProperties = medicinalProperties || 'Supercharged with lycopene, a potent lipid-soluble antioxidant linked to cardiovascular protection and cellular resilience against UV damage.';
    medicinalArticleUrl = medicinalArticleUrl || 'https://pubmed.ncbi.nlm.nih.gov/?term=Solanum+lycopersicum+lycopene+antioxidant+benefits';
    medicinalArticleTitle = medicinalArticleTitle || 'NCBI PubMed: Lycopene and Cardiovascular Health: Biological Mechanisms in Solanum lycopersicum';
    extinctionReasons = extinctionReasons || [
      'Crop loss from late blight fungal pathogens (Phytophthora infestans).',
      'Extreme heatwaves causing pollen sterility during peak blossom set.'
    ];
    preventiveMeasures = preventiveMeasures || [
      'Heirloom seed banking and breeding heat-tolerant wild nightshade crosses.',
      'Bumblebee buzz-pollination stewardship in greenhouse and garden settings.'
    ];
    commonUses = commonUses || 'Global culinary cornerstone (sauces, salads, pastes, soups) and high-yield hydroponic greenhouse horticulture.';
    predominantRegions = predominantRegions || ['Italy', 'Spain', 'United States (California)', 'China & India'];
    interestingFacts = interestingFacts || [
      'Cooked tomatoes with olive oil provide up to 4 times more bioavailable lycopene than raw tomatoes!',
      'Tomatoes were once nicknamed "love apples" in France and "poison apples" in 18th-century Britain.'
    ];
  } else if (common.includes('carrot') || scientific.includes('daucus')) {
    endangeredStatus = endangeredStatus || 'Secure / Widely Cultivated';
    conservationStatus = conservationStatus || 'IUCN Red List: Least Concern';
    climateZone = climateZone || 'Temperate & Subtropical Cool Season';
    medicinalProperties = medicinalProperties || 'Rich in beta-carotene which the human body converts into Vitamin A (retinol), vital for retinal night vision and immune defense.';
    medicinalArticleUrl = medicinalArticleUrl || 'https://pubmed.ncbi.nlm.nih.gov/?term=Daucus+carota+carotenoids+antioxidant+health';
    medicinalArticleTitle = medicinalArticleTitle || 'NCBI PubMed: Carotenoid Bioavailability & Health Attributes of Daucus carota';
    extinctionReasons = extinctionReasons || [
      'Soil compaction and root fly infestations in industrial monoculture plots.',
      'Loss of wild carrot genetic diversity from roadside herbicide spraying.'
    ];
    preventiveMeasures = preventiveMeasures || [
      'Companion planting with alliums and organic floating row covers.',
      'Preservation of wild Queen Anne’s Lace gene pools for pest resilience.'
    ];
    commonUses = commonUses || 'Culinary salads, stews, baby food, fresh juicing, and natural carotene beta-color extracts.';
    predominantRegions = predominantRegions || ['China', 'United States (California)', 'Russia', 'Netherlands'];
    interestingFacts = interestingFacts || [
      'Original wild carrots were purple and yellow; modern orange carrots were selectively bred in 17th-century Holland.',
      'The wild ancestor of the garden carrot is the common roadside wildflower known as Queen Anne’s Lace.'
    ];
  } else if (common.includes('cucumber') || scientific.includes('cucumis')) {
    endangeredStatus = endangeredStatus || 'Secure / Globally Cultivated';
    conservationStatus = conservationStatus || 'IUCN Red List: Least Concern';
    climateZone = climateZone || 'Warm Subtropical & Temperate';
    medicinalProperties = medicinalProperties || 'Contains 96% structured hydration water, caffeic acid, and silica; reduces puffiness, cools inflamed skin, and soothes digestion.';
    medicinalArticleUrl = medicinalArticleUrl || 'https://pubmed.ncbi.nlm.nih.gov/?term=Cucumis+sativus+cucurbitacins+anti-inflammatory';
    medicinalArticleTitle = medicinalArticleTitle || 'NCBI PMC: Phytochemical and Therapeutic Potential of Cucumis sativus';
    extinctionReasons = extinctionReasons || [
      'Vulnerability to powdery mildew and cucumber mosaic virus in humid climates.',
      'Pollinator deficits leading to misshapen fruit development.'
    ];
    preventiveMeasures = preventiveMeasures || [
      'Vertical trellis growing to increase air circulation and reduce fungal contact.',
      'Stewardship of specialized squash bees and native solitary pollinators.'
    ];
    commonUses = commonUses || 'Fresh salads, pickling, cooling spa cosmetic masks, and hydrating infused wellness beverages.';
    predominantRegions = predominantRegions || ['China', 'Turkey', 'Iran', 'Russia & Spain'];
    interestingFacts = interestingFacts || [
      'The interior core of a cucumber can be up to 11°C (20°F) cooler than ambient temperature on a hot day!',
      'Cucumbers originated over 3,000 years ago in the Himalayan foothills of India.'
    ];
  } else if (common.includes('sunflower') || scientific.includes('helianthus')) {
    endangeredStatus = endangeredStatus || 'Secure / Widely Cultivated';
    conservationStatus = conservationStatus || 'IUCN Red List: Least Concern';
    climateZone = climateZone || 'Temperate to Warm Subtropical Plains';
    medicinalProperties = medicinalProperties || 'Cold-pressed sunflower oil delivers high-potency vitamin E and phytosterols that protect arterial walls from oxidative stress.';
    medicinalArticleUrl = medicinalArticleUrl || 'https://pubmed.ncbi.nlm.nih.gov/?term=Helianthus+annuus+phytosterols+antioxidant';
    medicinalArticleTitle = medicinalArticleTitle || 'NCBI PMC: Nutritional, Phytochemical and Pharmacological Overview of Helianthus annuus';
    extinctionReasons = extinctionReasons || [
      'Heavy-metal soil contamination and urban soil compaction.',
      'Decline in native long-horned bee pollinators specialized on Asteraceae.'
    ];
    preventiveMeasures = preventiveMeasures || [
      'Plant diverse sunflower buffer rows for native bumblebee and avian forage.',
      'Soil aeration and phytoremediation stewardship in degraded urban lots.'
    ];
    commonUses = commonUses || 'Healthy vegetable cooking oil, roasted dietary seeds, wild avian feed, and soil phytoremediation.';
    predominantRegions = predominantRegions || ['Ukraine', 'Russia', 'United States (Kansas, Dakotas)', 'Argentina'];
    interestingFacts = interestingFacts || [
      'Immature sunflower flower heads perform solar tracking (heliotropism), turning from east to west every day with the sun!',
      'Capable of bio-accumulating heavy metals and radionuclides, sunflowers were planted to decontaminate soil at Chernobyl and Fukushima.'
    ];
  } else if (isFauna) {
    // General / Dynamic Fauna fallback
    endangeredStatus = endangeredStatus || (species.iucnStatus === 'Endangered' || species.iucnStatus === 'Critically Endangered' ? 'Endangered - Critical Population Threat' : species.iucnStatus === 'Vulnerable' ? 'Vulnerable - In Decline' : 'Secure / Monitoring');
    conservationStatus = conservationStatus || `IUCN Red List: ${species.iucnStatus || 'Least Concern'}`;
    climateZone = climateZone || (species.habitat ? `${species.habitat} Biome` : 'Temperate & Subtropical Eco-zone');
    
    // STRICT RULE: Health & medicinal properties and article links are NOT for fauna
    medicinalProperties = undefined;
    medicinalArticleUrl = undefined;
    medicinalArticleTitle = undefined;

    // Determine Fauna Diet: Herbivore, Omnivore, or Carnivore
    const isCarnivore = ['tiger', 'leopard', 'wolf', 'cat', 'dog', 'felid', 'carnivore', 'hawk', 'eagle', 'falcon', 'owl', 'snake', 'monitor', 'fox', 'lynx', 'shark', 'crocodil'].some(k => common.includes(k) || scientific.includes(k));
    const isOmnivore = ['peafowl', 'bear', 'turtle', 'crow', 'omnivore', 'pig', 'boar', 'badger', 'primate', 'monkey'].some(k => common.includes(k) || scientific.includes(k));
    dietType = dietType || (isCarnivore ? 'Carnivore' : isOmnivore ? 'Omnivore' : 'Herbivore');
    dietDescription = dietDescription || (dietType === 'Carnivore'
      ? 'Apex or mesopredator carnivore preying on smaller mammals, birds, or reptiles to regulate prey populations and sustain ecosystem balance.'
      : dietType === 'Omnivore'
      ? 'Opportunistic omnivore consuming seeds, plant shoots, wild fruits, insects, and small vertebrates.'
      : 'Primary consumer herbivore grazing and browsing on native grasses, foliage, roots, and flowers.');

    extinctionReasons = extinctionReasons || [
      'Habitat fragmentation and reduction of contiguous wildlife migration corridors.',
      'Retaliatory human-wildlife conflict and depleted natural wild prey densities.',
      'Anthropogenic disturbances including vehicular road collisions and seasonal climate volatility.'
    ];
    preventiveMeasures = preventiveMeasures || [
      'Establish and legally protect contiguous wildlife corridors and eco-passages.',
      'Deploy active anti-poaching patrols and community conservation initiatives.',
      'Restore native vegetation and prey species populations across buffer sanctuaries.'
    ];

    commonUses = commonUses || 'Ecological regulator; bio-indicator of habitat health and biodiversity equilibrium.';
    predominantRegions = predominantRegions || ['Regional Biosphere Reserve', 'Protected Wildlife Sanctuaries', 'Native Wild Habitats'];
    interestingFacts = interestingFacts || [
      `Plays an indispensable role maintaining demographic balance in its native ${species.habitat || 'ecosystem'}.`,
      'Sensory adaptations allow high-precision foraging and micro-habitat navigation in challenging wild environments.'
    ];
  } else {
    // General / Dynamic Flora fallback
    endangeredStatus = endangeredStatus || (species.iucnStatus === 'Endangered' ? 'Endangered - Rare Specimen' : species.iucnStatus === 'Vulnerable' ? 'Vulnerable' : 'Least Concern / Stable');
    conservationStatus = conservationStatus || `IUCN Red List: ${species.iucnStatus || 'Least Concern'}`;
    climateZone = climateZone || (species.habitat?.toLowerCase().includes('tropical') ? 'Tropical & Subtropical' : 'Temperate & Subtropical');
    
    // Flora receives medicinal properties & verified scientific article link
    medicinalProperties = medicinalProperties || 'Contains bioactive plant metabolites, flavonoids, and natural antioxidants supporting herbal wellness and plant defense.';
    medicinalArticleUrl = medicinalArticleUrl || `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(species.scientificName || species.commonName)}+medicinal+health`;
    medicinalArticleTitle = medicinalArticleTitle || `NCBI PubMed: Medical & Pharmacological Research on ${species.commonName || 'Botanical Specimen'}`;
    
    // Fauna diet is OMITTED for flora
    dietType = undefined;
    dietDescription = undefined;

    extinctionReasons = extinctionReasons || [
      'Habitat loss due to intensive agricultural expansion and urban development.',
      'Altered local hydrological regimes and prolonged climate drought stress.',
      'Competition from aggressive invasive weeds and agricultural herbicide drift.'
    ];
    preventiveMeasures = preventiveMeasures || [
      'Preserve native wild habitats and establish botanical sanctuary easements.',
      'Implement native seed collection, germplasm banking, and controlled restoration.',
      'Conduct community stewardship and invasive weed eradication programs.'
    ];

    commonUses = commonUses || 'Grown for botanical biodiversity, ecological pollination services, agricultural cultivation, or ornamental landscaping.';
    predominantRegions = predominantRegions || ['Native Continental Biome', 'Temperate & Subtropical Flora Zones', 'Botanical Preserves'];
    interestingFacts = interestingFacts || [
      'Co-evolved with native pollinators to exchange rich nectar rewards for specialized pollen transfer.',
      'Deep root networks prevent topsoil erosion and store atmospheric carbon deep in subterranean soil.'
    ];
  }

  // Ensure strict mutual exclusivity:
  if (isFauna) {
    medicinalProperties = undefined;
    medicinalArticleUrl = undefined;
    medicinalArticleTitle = undefined;
  } else {
    dietType = undefined;
    dietDescription = undefined;
  }

  return {
    ...species,
    endangeredStatus,
    conservationStatus,
    climateZone,
    medicinalProperties,
    medicinalArticleUrl,
    medicinalArticleTitle,
    dietType,
    dietDescription,
    extinctionReasons,
    preventiveMeasures,
    commonUses,
    predominantRegions,
    interestingFacts,
  };
}


const RAW_INITIAL_SPECIES_CATALOG: SpeciesData[] = [
  {
    id: 'pl-001',
    catalogNumber: '001',
    slotNumber: '#PL-001',
    level: 14,
    category: 'Flora',
    subType: 'Orchid',
    commonName: 'W. Prairie Orchid',
    scientificName: 'Platanthera praeclara',
    genderOrReproduction: 'HERMAPHRODITIC',
    imageUrl: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=800&q=80',
    visionMatchConfidence: 98.6,
    biodiversityRank: 1,
    biodiversityScore: 98.6,
    taxonomy: {
      kingdom: 'PLANTAE',
      order: 'ASPARAGALES',
      family: 'Orchidaceae',
      genusSpecies: 'P. PRAECLARA',
    },
    iucnStatus: 'Endangered',
    iucnCriteria: 'CRITERIA A2',
    habitat: 'WET-MESIC TALLGRASS',
    historicalPop2001: 150000,
    historicalPop2007: 135000,
    historicalPop2012: 120000,
    historicalPop2013: 105000,
    historicalPop2018: 72000,
    historicalPop2019: 68000,
    currentPop2026: 28500,
    predictedPop2031: 18500,
    unmitigatedCollapseYear: 2038,
    collapseFloor: 10000,
    reboundGoal: 85000,
    neuralConfidence: 94.8,
    vitalityStats: {
      populationHealthValue: '28,500 INDIV (LOW)',
      populationHealthPercent: 32,
      populationHealthStatus: 'LOW',
      habitatIntegrityPercent: 24,
      habitatIntegrityStatus: '24% REMAINING (CRITICAL)',
      pollinatorDensityPercent: 42,
      pollinatorDensityStatus: '42% ACTIVE (THREATENED)',
      climateResiliencePercent: 68,
      climateResilienceStatus: '68% MODERATE',
      extinctionModelRiskPercent: 74.2,
      extinctionHorizonYear: 2038,
    },
    limitingFactors: {
      habitatFragmentation: 88,
      pollinatorDensity: 42,
      climateVolatility: 64,
    },
    biologistMemo: {
      entryRef: 'MN-2026-B',
      reserveLocation: 'MINNESOTA TALLGRASS RESERVE',
      timeLogged: '14:22 UTC',
      details: 'Discovered in MINNESOTA TALLGRASS RESERVE Quad 4 at 14:22 UTC. Highly reliant upon nocturnal hawkmoths (Sphingidae) for cross-pollination. Soil pH: 7.2. Extremely vulnerable to sub-surface agricultural drainage alterations and untimely mowing regimens.',
    },
    curriculumDiscussion: 'Clusters of Western Prairie Fringed Orchid identified in Sector 4 demonstrate a continuous decline trajectory (-76.2% since 2012 baseline). Without tallgrass hydrology restoration and controlled burns, projection models predict regional extirpation by year 2038.',
  },
  {
    id: 'ins-002',
    catalogNumber: '002',
    slotNumber: '#IN-002',
    level: 18,
    category: 'Insecta',
    subType: 'Lepidoptera',
    commonName: 'Monarch Butterfly',
    scientificName: 'Danaus plexippus',
    genderOrReproduction: 'DIECIOUS',
    imageUrl: 'https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?auto=format&fit=crop&w=800&q=80',
    visionMatchConfidence: 97.8,
    biodiversityRank: 4,
    biodiversityScore: 91.8,
    taxonomy: {
      kingdom: 'ANIMALIA',
      order: 'LEPIDOPTERA',
      family: 'Nymphalidae',
      genusSpecies: 'D. PLEXIPPUS',
    },
    iucnStatus: 'Vulnerable',
    iucnCriteria: 'CRITERIA A3',
    habitat: 'MILKWEED CORRIDOR & PRAIRIE',
    historicalPop2001: 380000,
    historicalPop2007: 310000,
    historicalPop2012: 240000,
    historicalPop2013: 205000,
    historicalPop2018: 155000,
    historicalPop2019: 140000,
    currentPop2026: 82000,
    predictedPop2031: 52000,
    unmitigatedCollapseYear: 2042,
    collapseFloor: 30000,
    reboundGoal: 200000,
    neuralConfidence: 96.2,
    vitalityStats: {
      populationHealthValue: '82,000 INDIV (VULN)',
      populationHealthPercent: 41,
      populationHealthStatus: 'LOW',
      habitatIntegrityPercent: 36,
      habitatIntegrityStatus: '36% MILKWEED COVER (THREATENED)',
      pollinatorDensityPercent: 55,
      pollinatorDensityStatus: '55% MIGRATION CORRIDOR INTACT',
      climateResiliencePercent: 52,
      climateResilienceStatus: '52% MODERATE',
      extinctionModelRiskPercent: 58.4,
      extinctionHorizonYear: 2042,
    },
    limitingFactors: {
      habitatFragmentation: 72,
      pollinatorDensity: 58,
      climateVolatility: 68,
    },
    biologistMemo: {
      entryRef: 'MB-2026-F',
      reserveLocation: 'MIDWEST POLLINATOR HIGHWAY',
      timeLogged: '11:05 UTC',
      details: 'Multiple adult monarchs feeding on Asclepias syriaca (Common Milkweed). Overwintering forest degradation in Michoacan combined with glyphosate herbicide use across Midwestern flyway has suppressed generational egg densities.',
    },
    curriculumDiscussion: 'Monarch migration counts exhibit cyclical weather fluctuations overlaid atop a 65% multi-decade reduction. Re-establishing pesticide-free roadside milkweed corridors shows high student stewardship efficacy (+22% local rebound).',
  },
  {
    id: 'ins-003',
    catalogNumber: '003',
    slotNumber: '#IN-003',
    level: 22,
    category: 'Insecta',
    subType: 'Hymenoptera',
    commonName: 'Rusty Patched Bumblebee',
    scientificName: 'Bombus affinis',
    genderOrReproduction: 'EUSOCIAL COLONY',
    imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80',
    visionMatchConfidence: 95.4,
    biodiversityRank: 2,
    biodiversityScore: 96.4,
    taxonomy: {
      kingdom: 'ANIMALIA',
      order: 'HYMENOPTERA',
      family: 'Apidae',
      genusSpecies: 'B. AFFINIS',
    },
    iucnStatus: 'Critically Endangered',
    iucnCriteria: 'CRITERIA A1',
    habitat: 'GRASSLANDS & WOODLAND PARKS',
    historicalPop2001: 95000,
    historicalPop2007: 64000,
    historicalPop2012: 38000,
    historicalPop2013: 29000,
    historicalPop2018: 16000,
    historicalPop2019: 14200,
    currentPop2026: 5800,
    predictedPop2031: 2200,
    unmitigatedCollapseYear: 2033,
    collapseFloor: 1500,
    reboundGoal: 45000,
    neuralConfidence: 97.1,
    vitalityStats: {
      populationHealthValue: '5,800 QUEENS/COLONIES (CRIT)',
      populationHealthPercent: 18,
      populationHealthStatus: 'CRITICAL',
      habitatIntegrityPercent: 19,
      habitatIntegrityStatus: '19% NATIVE FLORAL RANGE',
      pollinatorDensityPercent: 28,
      pollinatorDensityStatus: '28% COLONY RESILIENCE',
      climateResiliencePercent: 44,
      climateResilienceStatus: '44% LOW-MODERATE',
      extinctionModelRiskPercent: 88.7,
      extinctionHorizonYear: 2033,
    },
    limitingFactors: {
      habitatFragmentation: 92,
      pollinatorDensity: 24,
      climateVolatility: 76,
    },
    biologistMemo: {
      entryRef: 'RP-2026-X',
      reserveLocation: 'UPPER MISSISSIPPI WATERSHED',
      timeLogged: '09:40 UTC',
      details: 'Queen identified near uncompacted soil burrows. Exposure to neonicotinoid pesticides and Nosema bombi microsporidian parasites has devastated historic colonies across 87% of its former geographical range.',
    },
    curriculumDiscussion: 'First federally endangered bumblebee in continental US. Critical keystone pollinator for cranberries, blueberries, and native wildflowers. Nesting site protection in suburban parklands offers immediately actionable class habitat patches.',
  },
  {
    id: 'rep-004',
    catalogNumber: '004',
    slotNumber: '#RP-004',
    level: 30,
    category: 'Reptilia',
    subType: 'Testudines',
    commonName: "Blanding's Turtle",
    scientificName: 'Emydoidea blandingii',
    genderOrReproduction: 'OVIPAROUS',
    imageUrl: 'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?q=80&w=1000&auto=format&fit=crop',
    visionMatchConfidence: 96.9,
    biodiversityRank: 3,
    biodiversityScore: 94.2,
    taxonomy: {
      kingdom: 'ANIMALIA',
      order: 'TESTUDINES',
      family: 'Emydidae',
      genusSpecies: 'E. BLANDINGII',
    },
    iucnStatus: 'Endangered',
    iucnCriteria: 'CRITERIA A2',
    habitat: 'WETLAND MARSHES & FENS',
    historicalPop2001: 42000,
    historicalPop2007: 36000,
    historicalPop2012: 30000,
    historicalPop2013: 28000,
    historicalPop2018: 22000,
    historicalPop2019: 20500,
    currentPop2026: 12400,
    predictedPop2031: 9100,
    unmitigatedCollapseYear: 2039,
    collapseFloor: 4000,
    reboundGoal: 32000,
    neuralConfidence: 93.4,
    vitalityStats: {
      populationHealthValue: '12,400 INDIV (DECLINE)',
      populationHealthPercent: 29,
      populationHealthStatus: 'LOW',
      habitatIntegrityPercent: 31,
      habitatIntegrityStatus: '31% WETLAND INTEGRITY',
      pollinatorDensityPercent: 62,
      pollinatorDensityStatus: '62% FOOD WEB STABILITY',
      climateResiliencePercent: 54,
      climateResilienceStatus: '54% MODERATE',
      extinctionModelRiskPercent: 71.5,
      extinctionHorizonYear: 2039,
    },
    limitingFactors: {
      habitatFragmentation: 84,
      pollinatorDensity: 60,
      climateVolatility: 58,
    },
    biologistMemo: {
      entryRef: 'BT-2026-N',
      reserveLocation: 'GREAT LAKES SHALLOW BASIN',
      timeLogged: '16:15 UTC',
      details: 'Adult specimen with characteristic bright yellow chin and throat observed sunning on submerged log. Requires 14-20 years to reach sexual maturity; road mortality of nesting females poses acute threat to cohort sustainability.',
    },
    curriculumDiscussion: 'Because Blanding’s turtles have extreme life spans (70+ years), low recruitment rates mask population senescence until abrupt collapse occurs. Wildlife underpass corridors drastically slash highway collision mortality.',
  },
  {
    id: 'pl-005',
    catalogNumber: '005',
    slotNumber: '#PL-005',
    level: 8,
    category: 'Flora',
    subType: 'Milkweed',
    commonName: 'Common Milkweed',
    scientificName: 'Asclepias syriaca',
    genderOrReproduction: 'HERMAPHRODITIC',
    imageUrl: 'https://images.unsplash.com/photo-1596728325396-857dcfae4d77?q=80&w=1000&auto=format&fit=crop',
    visionMatchConfidence: 99.1,
    biodiversityRank: 5,
    biodiversityScore: 89.5,
    taxonomy: {
      kingdom: 'PLANTAE',
      order: 'GENTIANALES',
      family: 'Apocynaceae',
      genusSpecies: 'A. SYRIACA',
    },
    iucnStatus: 'Least Concern',
    iucnCriteria: 'KEYSTONE NURSERY',
    habitat: 'TALLGRASS PRAIRIE & ROAD CORRIDORS',
    historicalPop2001: 920000,
    historicalPop2007: 740000,
    historicalPop2012: 560000,
    historicalPop2013: 510000,
    historicalPop2018: 380000,
    historicalPop2019: 350000,
    currentPop2026: 210000,
    predictedPop2031: 175000,
    unmitigatedCollapseYear: 2048,
    collapseFloor: 80000,
    reboundGoal: 600000,
    neuralConfidence: 98.4,
    vitalityStats: {
      populationHealthValue: '210,000 STEMS (MODERATE)',
      populationHealthPercent: 58,
      populationHealthStatus: 'MODERATE',
      habitatIntegrityPercent: 44,
      habitatIntegrityStatus: '44% INTACT PRAIRIE',
      pollinatorDensityPercent: 78,
      pollinatorDensityStatus: '78% HIGH NURSERY VALUE',
      climateResiliencePercent: 74,
      climateResilienceStatus: '74% ROBUST',
      extinctionModelRiskPercent: 38.2,
      extinctionHorizonYear: 2048,
    },
    limitingFactors: {
      habitatFragmentation: 62,
      pollinatorDensity: 48,
      climateVolatility: 35,
    },
    biologistMemo: {
      entryRef: 'MW-2026-A',
      reserveLocation: 'PRAIRIE EDGE TRACT 2',
      timeLogged: '13:10 UTC',
      details: 'Dense stand of Asclepias syriaca bearing fragrant pink-purple umbels. Found 3 Monarch 2nd-instar caterpillars and multiple native solitary bees actively foraging nectar.',
    },
    curriculumDiscussion: 'Common Milkweed is the sole larval host plant for monarch butterflies. Losing milkweed stands directly cascades into continent-wide migratory collapse.',
  },
  {
    id: 'pl-006',
    catalogNumber: '006',
    slotNumber: '#PL-006',
    level: 10,
    category: 'Flora',
    subType: 'Asteraceae',
    commonName: 'Purple Coneflower',
    scientificName: 'Echinacea purpurea',
    genderOrReproduction: 'HERMAPHRODITIC',
    imageUrl: 'https://images.unsplash.com/photo-1596728324424-c1f03f7ca45b?q=80&w=1000&auto=format&fit=crop',
    visionMatchConfidence: 98.2,
    biodiversityRank: 6,
    biodiversityScore: 87.2,
    taxonomy: {
      kingdom: 'PLANTAE',
      order: 'ASTERALES',
      family: 'Asteraceae',
      genusSpecies: 'E. PURPUREA',
    },
    iucnStatus: 'Near Threatened',
    iucnCriteria: 'CRITERIA B1',
    habitat: 'MESIC PRAIRIE & SAVANNA BORDERS',
    historicalPop2001: 340000,
    historicalPop2007: 290000,
    historicalPop2012: 230000,
    historicalPop2013: 215000,
    historicalPop2018: 165000,
    historicalPop2019: 155000,
    currentPop2026: 98000,
    predictedPop2031: 72000,
    unmitigatedCollapseYear: 2045,
    collapseFloor: 25000,
    reboundGoal: 250000,
    neuralConfidence: 96.8,
    vitalityStats: {
      populationHealthValue: '98,000 CLUMPS (MED)',
      populationHealthPercent: 52,
      populationHealthStatus: 'MODERATE',
      habitatIntegrityPercent: 46,
      habitatIntegrityStatus: '46% DENSE COVERS',
      pollinatorDensityPercent: 82,
      pollinatorDensityStatus: '82% EXCELLENT NECTAR',
      climateResiliencePercent: 86,
      climateResilienceStatus: '86% HIGH DROUGHT TOLERANCE',
      extinctionModelRiskPercent: 44.6,
      extinctionHorizonYear: 2045,
    },
    limitingFactors: {
      habitatFragmentation: 68,
      pollinatorDensity: 38,
      climateVolatility: 32,
    },
    biologistMemo: {
      entryRef: 'EC-2026-P',
      reserveLocation: 'BLUFFSIDE PRAIRIE QUAD 3',
      timeLogged: '15:45 UTC',
      details: 'Vibrant spiny conical flower heads attracting swallowtail butterflies and bumblebees. Deep taproots extend 1.8 meters down into limestone bedrock, resisting drought.',
    },
    curriculumDiscussion: 'Echinacea provides foundational late-summer forage and high seed value for American Goldfinches in late autumn.',
  },
  {
    id: 'pl-007',
    catalogNumber: '007',
    slotNumber: '#PL-007',
    level: 26,
    category: 'Flora',
    subType: 'Orchid',
    commonName: "Showy Lady's Slipper",
    scientificName: 'Cypripedium reginae',
    genderOrReproduction: 'CROSS-POLLINATED',
    imageUrl: 'https://images.unsplash.com/photo-1599598425947-4340d859fa20?q=80&w=1000&auto=format&fit=crop',
    visionMatchConfidence: 97.4,
    biodiversityRank: 7,
    biodiversityScore: 85.9,
    taxonomy: {
      kingdom: 'PLANTAE',
      order: 'ASPARAGALES',
      family: 'Orchidaceae',
      genusSpecies: 'C. REGINAE',
    },
    iucnStatus: 'Endangered',
    iucnCriteria: 'CRITERIA C1',
    habitat: 'CALCAREOUS FENS & BOG MARGINS',
    historicalPop2001: 52000,
    historicalPop2007: 41000,
    historicalPop2012: 32000,
    historicalPop2013: 27000,
    historicalPop2018: 18000,
    historicalPop2019: 16500,
    currentPop2026: 8900,
    predictedPop2031: 5400,
    unmitigatedCollapseYear: 2036,
    collapseFloor: 2000,
    reboundGoal: 35000,
    neuralConfidence: 95.7,
    vitalityStats: {
      populationHealthValue: '8,900 PLANTS (CRITICAL)',
      populationHealthPercent: 24,
      populationHealthStatus: 'CRITICAL',
      habitatIntegrityPercent: 22,
      habitatIntegrityStatus: '22% REMAINING WET FEN',
      pollinatorDensityPercent: 36,
      pollinatorDensityStatus: '36% SPECIALIST BEES',
      climateResiliencePercent: 48,
      climateResilienceStatus: '48% VULNERABLE TO DRYING',
      extinctionModelRiskPercent: 81.3,
      extinctionHorizonYear: 2036,
    },
    limitingFactors: {
      habitatFragmentation: 86,
      pollinatorDensity: 40,
      climateVolatility: 74,
    },
    biologistMemo: {
      entryRef: 'SLS-2026-F',
      reserveLocation: 'CEDAR SPRINGS WETLAND BASIN',
      timeLogged: '10:15 UTC',
      details: 'Magnificent white petals with rich magenta inflated pouch. Takes 7 to 10 years to produce its first flower and requires specialized Rhizoctonia mycorrhizal soil fungi to germinate.',
    },
    curriculumDiscussion: 'Minnesota State Flower and apex wetland bio-indicator. Highly sensitive to water table drops, illegal collection, and white-tailed deer browsing.',
  },
  {
    id: 'pl-008',
    catalogNumber: '008',
    slotNumber: '#PL-008',
    level: 16,
    category: 'Flora',
    subType: 'Asteraceae',
    commonName: 'Compass Plant',
    scientificName: 'Silphium laciniatum',
    genderOrReproduction: 'HERMAPHRODITIC',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000&auto=format&fit=crop',
    visionMatchConfidence: 96.5,
    biodiversityRank: 8,
    biodiversityScore: 82.3,
    taxonomy: {
      kingdom: 'PLANTAE',
      order: 'ASTERALES',
      family: 'Asteraceae',
      genusSpecies: 'S. LACINIATUM',
    },
    iucnStatus: 'Vulnerable',
    iucnCriteria: 'CRITERIA A4',
    habitat: 'VIRGIN DEEP-SOIL TALLGRASS',
    historicalPop2001: 180000,
    historicalPop2007: 155000,
    historicalPop2012: 125000,
    historicalPop2013: 110000,
    historicalPop2018: 84000,
    historicalPop2019: 78000,
    currentPop2026: 42000,
    predictedPop2031: 29000,
    unmitigatedCollapseYear: 2041,
    collapseFloor: 12000,
    reboundGoal: 110000,
    neuralConfidence: 94.2,
    vitalityStats: {
      populationHealthValue: '42,000 INDIV (DECLINE)',
      populationHealthPercent: 36,
      populationHealthStatus: 'LOW',
      habitatIntegrityPercent: 34,
      habitatIntegrityStatus: '34% DEEP PRAIRIE REMNANTS',
      pollinatorDensityPercent: 72,
      pollinatorDensityStatus: '72% BEE & FLY FORAGE',
      climateResiliencePercent: 88,
      climateResilienceStatus: '88% 4.5M TAPROOT RESILIENCE',
      extinctionModelRiskPercent: 66.8,
      extinctionHorizonYear: 2041,
    },
    limitingFactors: {
      habitatFragmentation: 80,
      pollinatorDensity: 46,
      climateVolatility: 42,
    },
    biologistMemo: {
      entryRef: 'CP-2026-Z',
      reserveLocation: 'TALLGRASS SOUTH TRANSECT',
      timeLogged: '12:30 UTC',
      details: 'Leaves orient themselves North-South on edge to minimize solar irradiance during midday heat. Taproots descend over 4 meters into undisturbed prairie sod.',
    },
    curriculumDiscussion: 'A true indicator of undisturbed virgin prairie sod. Because its taproot survives severe prairie wildfires, it is a primary ecosystem anchor.',
  },
  {
    id: 'pl-009',
    catalogNumber: '009',
    slotNumber: '#PL-009',
    level: 9,
    category: 'Flora',
    subType: 'Asteraceae',
    commonName: 'Sunflower',
    scientificName: 'Helianthus annuus',
    genderOrReproduction: 'MONOECIOUS / COMPOSITE',
    imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
    visionMatchConfidence: 99.4,
    biodiversityRank: 5,
    biodiversityScore: 91.2,
    taxonomy: {
      kingdom: 'PLANTAE',
      order: 'ASTERALES',
      family: 'Asteraceae',
      genusSpecies: 'H. ANNUUS',
    },
    iucnStatus: 'Least Concern',
    iucnCriteria: 'APG IV CLADE',
    habitat: 'RAMBAGH GARDENS & RIPARIAN FLOODPLAINS',
    historicalPop2001: 95000,
    historicalPop2007: 82000,
    historicalPop2012: 68000,
    historicalPop2013: 59000,
    historicalPop2018: 42000,
    historicalPop2019: 36000,
    currentPop2026: 14500,
    predictedPop2031: 9200,
    unmitigatedCollapseYear: 2046,
    collapseFloor: 5000,
    reboundGoal: 50000,
    neuralConfidence: 99.2,
    vitalityStats: {
      populationHealthValue: '14,500 INDIV (DWINDLED)',
      populationHealthPercent: 38,
      populationHealthStatus: 'CRITICAL',
      habitatIntegrityPercent: 44,
      habitatIntegrityStatus: 'URBAN SOIL COMPACTION',
      pollinatorDensityPercent: 62,
      pollinatorDensityStatus: 'BUMBLEBEE & HOVERFLY FORAGE',
      climateResiliencePercent: 78,
      climateResilienceStatus: 'HEAT & DROUGHT RESISTANT',
      extinctionModelRiskPercent: 48.5,
      extinctionHorizonYear: 2046,
    },
    limitingFactors: {
      habitatFragmentation: 68,
      pollinatorDensity: 42,
      climateVolatility: 35,
    },
    biologistMemo: {
      entryRef: 'RB-2026-SUNFLOWER',
      reserveLocation: 'RAMBAGH URBAN GARDENS & RIPARIAN BUFFER',
      timeLogged: '10:15 UTC',
      details: 'Demonstrates heliotropism in immature flower buds. Abundant nectar source for solitary bees, though urban soil compaction and altered water tables in Rambagh have caused local populations to dwindle.',
    },
    curriculumDiscussion: 'Helianthus annuus serves as a vital biological sentinel for urban pollinator corridors. Student census data reveals how altered garden irrigation and soil aeration directly affect bloom counts.',
  },
  {
    id: 'fr-010',
    catalogNumber: '010',
    slotNumber: '#FR-010',
    level: 7,
    category: 'Fruit & Crop',
    subType: 'Musaceae',
    commonName: 'Banana (Cavendish)',
    scientificName: 'Musa acuminata',
    genderOrReproduction: 'PARTHENOCARPIC BERRY',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
    visionMatchConfidence: 99.1,
    biodiversityRank: 6,
    biodiversityScore: 89.4,
    taxonomy: {
      kingdom: 'PLANTAE',
      order: 'ZINGIBERALES',
      family: 'Musaceae',
      genusSpecies: 'M. ACUMINATA',
    },
    iucnStatus: 'Least Concern',
    iucnCriteria: 'CULTIVATED CLONE',
    habitat: 'TROPICAL AGRICULTURAL & PALACE ORCHARDS',
    historicalPop2001: 240000,
    historicalPop2007: 235000,
    historicalPop2012: 230000,
    historicalPop2013: 228000,
    historicalPop2018: 220000,
    historicalPop2019: 215000,
    currentPop2026: 210000,
    predictedPop2031: 205000,
    unmitigatedCollapseYear: 2060,
    collapseFloor: 25000,
    reboundGoal: 250000,
    neuralConfidence: 98.9,
    vitalityStats: {
      populationHealthValue: '210,000 STANDS (PRODUCTIVE)',
      populationHealthPercent: 88,
      populationHealthStatus: 'STABLE',
      habitatIntegrityPercent: 82,
      habitatIntegrityStatus: 'MANAGED AGROFORESTRY',
      pollinatorDensityPercent: 74,
      pollinatorDensityStatus: 'BAT & INSECT FORAGE',
      climateResiliencePercent: 70,
      climateResilienceStatus: 'MOISTURE DEPENDENT',
      extinctionModelRiskPercent: 14.2,
      extinctionHorizonYear: 2060,
    },
    limitingFactors: {
      habitatFragmentation: 25,
      pollinatorDensity: 70,
      climateVolatility: 45,
    },
    biologistMemo: {
      entryRef: 'AG-2026-BANANA',
      reserveLocation: 'RAMBAGH ORCHARD EXPERIMENTAL PLOT',
      timeLogged: '09:40 UTC',
      details: 'Cavendish banana cluster displaying classic 4-5 facet elongated berries with yellow exocarp. Susceptible to Tropical Race 4 fungal wilt; student surveys test soil microbiome biodiversity to suppress Fusarium pathogens.',
    },
    curriculumDiscussion: 'Musa acuminata demonstrates the critical difference between clonal agricultural monocultures and wild genetic diversity. Student field questions evaluate moisture retention and pathogen shielding.',
  },
  {
    id: 'fr-011',
    catalogNumber: '011',
    slotNumber: '#FR-011',
    level: 8,
    category: 'Fruit & Crop',
    subType: 'Rosaceae',
    commonName: 'Cultivated Apple',
    scientificName: 'Malus domestica',
    genderOrReproduction: 'OBLIGATE CROSS-POLLINATED',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
    visionMatchConfidence: 99.3,
    biodiversityRank: 7,
    biodiversityScore: 88.0,
    taxonomy: {
      kingdom: 'PLANTAE',
      order: 'ROSALES',
      family: 'Rosaceae',
      genusSpecies: 'M. DOMESTICA',
    },
    iucnStatus: 'Least Concern',
    iucnCriteria: 'DOMESTICATED POME',
    habitat: 'TEMPERATE ORCHARD & BOTANIC GARDENS',
    historicalPop2001: 310000,
    historicalPop2007: 295000,
    historicalPop2012: 280000,
    historicalPop2013: 275000,
    historicalPop2018: 260000,
    historicalPop2019: 255000,
    currentPop2026: 245000,
    predictedPop2031: 240000,
    unmitigatedCollapseYear: 2065,
    collapseFloor: 30000,
    reboundGoal: 300000,
    neuralConfidence: 99.0,
    vitalityStats: {
      populationHealthValue: '245,000 TREES (SUSTAINED)',
      populationHealthPercent: 85,
      populationHealthStatus: 'STABLE',
      habitatIntegrityPercent: 78,
      habitatIntegrityStatus: 'ORCHARD ROW-CROPPING',
      pollinatorDensityPercent: 80,
      pollinatorDensityStatus: 'SOLITARY BEE DEPENDENT',
      climateResiliencePercent: 75,
      climateResilienceStatus: 'WINTER CHILL HOURS ADEQUATE',
      extinctionModelRiskPercent: 12.8,
      extinctionHorizonYear: 2065,
    },
    limitingFactors: {
      habitatFragmentation: 30,
      pollinatorDensity: 78,
      climateVolatility: 40,
    },
    biologistMemo: {
      entryRef: 'AP-2026-MALUS',
      reserveLocation: 'NORTH ALLUVIAL ORCHARD TRANSECT',
      timeLogged: '11:15 UTC',
      details: 'Crisp fruit with red skin and tiny breathing pores called lenticels. Apple blossoms need visits from bees to turn into tasty apples!',
    },
    curriculumDiscussion: 'Apples show students how flowers transform into fruits when pollinated by bees during spring!',
  },
  {
    id: 'fruit-001',
    catalogNumber: '012',
    slotNumber: '#FR-012',
    level: 10,
    category: 'Fruit & Crop',
    subType: 'Vitaceae',
    commonName: 'Grape (Red & Purple Grapevine)',
    scientificName: 'Vitis vinifera',
    genderOrReproduction: 'HERMAPHRODITIC BERRY',
    imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80',
    visionMatchConfidence: 99.4,
    biodiversityRank: 8,
    biodiversityScore: 89.5,
    taxonomy: {
      kingdom: 'PLANTAE',
      order: 'VITALES',
      family: 'Vitaceae',
      genusSpecies: 'V. VINIFERA',
    },
    iucnStatus: 'Least Concern',
    iucnCriteria: 'CULTIVATED & WILD VINES',
    habitat: 'TEMPERATE VINEYARDS, HILLSIDES & GARDENS',
    historicalPop2001: 420000,
    historicalPop2007: 410000,
    historicalPop2012: 400000,
    historicalPop2013: 395000,
    historicalPop2018: 385000,
    historicalPop2019: 380000,
    currentPop2026: 375000,
    predictedPop2031: 370000,
    unmitigatedCollapseYear: 2075,
    collapseFloor: 50000,
    reboundGoal: 420000,
    neuralConfidence: 99.2,
    vitalityStats: {
      populationHealthValue: '375,000 VINES (THRIVING)',
      populationHealthPercent: 90,
      populationHealthStatus: 'STABLE',
      habitatIntegrityPercent: 82,
      habitatIntegrityStatus: '82% HEALTHY VINEYARDS',
      pollinatorDensityPercent: 78,
      pollinatorDensityStatus: 'BEE & WIND POLLINATED',
      climateResiliencePercent: 84,
      climateResilienceStatus: 'DROUGHT-TOLERANT ROOTS',
      extinctionModelRiskPercent: 8.5,
      extinctionHorizonYear: 2075,
    },
    limitingFactors: {
      habitatFragmentation: 22,
      pollinatorDensity: 75,
      climateVolatility: 35,
    },
    biologistMemo: {
      entryRef: 'GR-2026-VITIS',
      reserveLocation: 'SUNNY SOUTH VALLEY VINEYARDS',
      timeLogged: '10:30 UTC',
      details: 'Grapes grow in large bunches on climbing woody vines. Each grape is a true berry packed with sweet natural juice and covered in a soft, dusty coating called the bloom.',
    },
    curriculumDiscussion: 'Grapes climb up fences and trees using curled grasping tendrils that reach for sunlight!',
  },
  {
    id: 'fruit-002',
    catalogNumber: '013',
    slotNumber: '#FR-013',
    level: 11,
    category: 'Fruit & Crop',
    subType: 'Rosaceae',
    commonName: 'Garden Strawberry',
    scientificName: 'Fragaria × ananassa',
    genderOrReproduction: 'RUNNER & SEED FORMATION',
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80',
    visionMatchConfidence: 99.1,
    biodiversityRank: 9,
    biodiversityScore: 88.7,
    taxonomy: {
      kingdom: 'PLANTAE',
      order: 'ROSALES',
      family: 'Rosaceae',
      genusSpecies: 'F. × ANANASSA',
    },
    iucnStatus: 'Least Concern',
    iucnCriteria: 'GARDEN & CROP BEDS',
    habitat: 'TEMPERATE FARMS, RAISED BEDS & MEADOWS',
    historicalPop2001: 350000,
    historicalPop2007: 340000,
    historicalPop2012: 330000,
    historicalPop2013: 325000,
    historicalPop2018: 315000,
    historicalPop2019: 310000,
    currentPop2026: 305000,
    predictedPop2031: 300000,
    unmitigatedCollapseYear: 2070,
    collapseFloor: 40000,
    reboundGoal: 350000,
    neuralConfidence: 98.9,
    vitalityStats: {
      populationHealthValue: '305,000 PLANTS (HEALTHY)',
      populationHealthPercent: 88,
      populationHealthStatus: 'STABLE',
      habitatIntegrityPercent: 80,
      habitatIntegrityStatus: 'PROTECTED GARDEN ROWS',
      pollinatorDensityPercent: 85,
      pollinatorDensityStatus: 'BEE VISITATION HIGH',
      climateResiliencePercent: 78,
      climateResilienceStatus: 'NEEDS REGULAR WATERING',
      extinctionModelRiskPercent: 9.2,
      extinctionHorizonYear: 2070,
    },
    limitingFactors: {
      habitatFragmentation: 25,
      pollinatorDensity: 82,
      climateVolatility: 38,
    },
    biologistMemo: {
      entryRef: 'SB-2026-FRAGARIA',
      reserveLocation: 'COMMUNITY TEACHING GARDEN',
      timeLogged: '09:45 UTC',
      details: 'Bright red, sweet garden fruit. Fun fact: strawberries are the only fruit with their tiny seeds (called achenes) on the outside of the fruit!',
    },
    curriculumDiscussion: 'Strawberries spread by shooting out long side stems called "runners" that make new baby plants in the soil!',
  },
  {
    id: 'veg-001',
    catalogNumber: '014',
    slotNumber: '#VG-014',
    level: 12,
    category: 'Fruit & Crop',
    subType: 'Solanaceae',
    commonName: 'Garden Tomato',
    scientificName: 'Solanum lycopersicum',
    genderOrReproduction: 'SELF-POLLINATING FLOWER',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    visionMatchConfidence: 99.2,
    biodiversityRank: 10,
    biodiversityScore: 89.0,
    taxonomy: {
      kingdom: 'PLANTAE',
      order: 'SOLANALES',
      family: 'Solanaceae',
      genusSpecies: 'S. LYCOPERSICUM',
    },
    iucnStatus: 'Least Concern',
    iucnCriteria: 'COMMON HOME & FARM CROP',
    habitat: 'WARM SUNNY GARDENS & GREENHOUSES',
    historicalPop2001: 500000,
    historicalPop2007: 490000,
    historicalPop2012: 480000,
    historicalPop2013: 475000,
    historicalPop2018: 470000,
    historicalPop2019: 465000,
    currentPop2026: 460000,
    predictedPop2031: 455000,
    unmitigatedCollapseYear: 2080,
    collapseFloor: 60000,
    reboundGoal: 500000,
    neuralConfidence: 99.1,
    vitalityStats: {
      populationHealthValue: '460,000 VINES (VERY ABUNDANT)',
      populationHealthPercent: 92,
      populationHealthStatus: 'STABLE',
      habitatIntegrityPercent: 85,
      habitatIntegrityStatus: '85% FERTILE GARDEN BEDS',
      pollinatorDensityPercent: 82,
      pollinatorDensityStatus: 'BUZZ-POLLINATION BY BUMBLEBEES',
      climateResiliencePercent: 80,
      climateResilienceStatus: 'LOVES WARM SUNNY DAYS',
      extinctionModelRiskPercent: 6.4,
      extinctionHorizonYear: 2080,
    },
    limitingFactors: {
      habitatFragmentation: 20,
      pollinatorDensity: 80,
      climateVolatility: 30,
    },
    biologistMemo: {
      entryRef: 'TM-2026-TOMATO',
      reserveLocation: 'VALLEY COMMUNITY ALLOTMENT',
      timeLogged: '13:10 UTC',
      details: 'Scientifically, a tomato is a berry fruit because it grows from a flower and holds seeds inside! But in the kitchen, we cook it like a delicious vegetable.',
    },
    curriculumDiscussion: 'Bumblebees visit tomato flowers and vibrate their wings at just the right pitch to shake the pollen loose—this is called "buzz pollination"!',
  },
  {
    id: 'veg-002',
    catalogNumber: '015',
    slotNumber: '#VG-015',
    level: 9,
    category: 'Fruit & Crop',
    subType: 'Apiaceae',
    commonName: 'Garden Carrot',
    scientificName: 'Daucus carota subsp. sativus',
    genderOrReproduction: 'TAPROOT BIENNIAL',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
    visionMatchConfidence: 98.8,
    biodiversityRank: 11,
    biodiversityScore: 87.5,
    taxonomy: {
      kingdom: 'PLANTAE',
      order: 'APIALES',
      family: 'Apiaceae',
      genusSpecies: 'D. CAROTA',
    },
    iucnStatus: 'Least Concern',
    iucnCriteria: 'ROOT VEGETABLE BEDS',
    habitat: 'LOOSE SANDY SOIL & VEGETABLE FARMS',
    historicalPop2001: 600000,
    historicalPop2007: 590000,
    historicalPop2012: 580000,
    historicalPop2013: 575000,
    historicalPop2018: 570000,
    historicalPop2019: 565000,
    currentPop2026: 560000,
    predictedPop2031: 555000,
    unmitigatedCollapseYear: 2085,
    collapseFloor: 80000,
    reboundGoal: 600000,
    neuralConfidence: 98.7,
    vitalityStats: {
      populationHealthValue: '560,000 ROOTS (EXTREMELY HEALTHY)',
      populationHealthPercent: 94,
      populationHealthStatus: 'STABLE',
      habitatIntegrityPercent: 88,
      habitatIntegrityStatus: 'LOOSE ORGANIC SOIL',
      pollinatorDensityPercent: 75,
      pollinatorDensityStatus: 'WASP & FLY POLLINATED FLOWERS',
      climateResiliencePercent: 88,
      climateResilienceStatus: 'FROST-TOLERANT UNDERGROUND',
      extinctionModelRiskPercent: 5.1,
      extinctionHorizonYear: 2085,
    },
    limitingFactors: {
      habitatFragmentation: 18,
      pollinatorDensity: 74,
      climateVolatility: 28,
    },
    biologistMemo: {
      entryRef: 'CR-2026-CARROT',
      reserveLocation: 'ALLUVIAL FARM PLOTS',
      timeLogged: '08:50 UTC',
      details: 'A root vegetable that grows hidden underground! The bright orange color comes from beta-carotene, an important nutrient our bodies turn into Vitamin A for healthy eyesight.',
    },
    curriculumDiscussion: 'Carrots store sugars inside their thick orange taproot during their first year so they can send up a tall umbrella flower head in their second year!',
  },
  {
    id: 'veg-003',
    catalogNumber: '016',
    slotNumber: '#VG-016',
    level: 10,
    category: 'Fruit & Crop',
    subType: 'Cucurbitaceae',
    commonName: 'Fresh Cucumber',
    scientificName: 'Cucumis sativus',
    genderOrReproduction: 'MONOECIOUS VINE',
    imageUrl: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=800&q=80',
    visionMatchConfidence: 98.9,
    biodiversityRank: 12,
    biodiversityScore: 88.2,
    taxonomy: {
      kingdom: 'PLANTAE',
      order: 'CUCURBITALES',
      family: 'Cucurbitaceae',
      genusSpecies: 'C. SATIVUS',
    },
    iucnStatus: 'Least Concern',
    iucnCriteria: 'GARDEN TRELLIS CROPS',
    habitat: 'WARM HUMID GARDENS & TRELLISES',
    historicalPop2001: 380000,
    historicalPop2007: 370000,
    historicalPop2012: 360000,
    historicalPop2013: 355000,
    historicalPop2018: 350000,
    historicalPop2019: 345000,
    currentPop2026: 340000,
    predictedPop2031: 335000,
    unmitigatedCollapseYear: 2075,
    collapseFloor: 45000,
    reboundGoal: 380000,
    neuralConfidence: 98.8,
    vitalityStats: {
      populationHealthValue: '340,000 VINES (THRIVING)',
      populationHealthPercent: 89,
      populationHealthStatus: 'STABLE',
      habitatIntegrityPercent: 83,
      habitatIntegrityStatus: 'TRELLISED GROWING SPACE',
      pollinatorDensityPercent: 84,
      pollinatorDensityStatus: 'HONEYBEE & SQUASH BEE VISITATION',
      climateResiliencePercent: 80,
      climateResilienceStatus: '95% WATER CONTENT FRUIT',
      extinctionModelRiskPercent: 7.8,
      extinctionHorizonYear: 2075,
    },
    limitingFactors: {
      habitatFragmentation: 22,
      pollinatorDensity: 82,
      climateVolatility: 32,
    },
    biologistMemo: {
      entryRef: 'CU-2026-CUCUMBER',
      reserveLocation: 'TRELLIS GARDEN SYSTEM',
      timeLogged: '11:40 UTC',
      details: 'Cylindrical green fruit with crisp, cooling flesh. Cucumbers are about 95% water! They have yellow flowers that grow along sprawling green vines with small gripping tendrils.',
    },
    curriculumDiscussion: 'Cucumber vines use spring-like tendrils to climb upward towards the sun, keeping the cucumbers off the damp ground!',
  },
  {
    id: 'fa-013',
    catalogNumber: '013',
    slotNumber: '#FA-013',
    level: 28,
    category: 'Fauna',
    subType: 'Felidae',
    commonName: 'Indian Leopard',
    scientificName: 'Panthera pardus fusca',
    genderOrReproduction: 'MAMMALIA DIOECIOUS',
    imageUrl: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=800&q=80',
    visionMatchConfidence: 99.1,
    biodiversityRank: 13,
    biodiversityScore: 94.5,
    taxonomy: {
      kingdom: 'ANIMALIA',
      order: 'CARNIVORA',
      family: 'Felidae',
      genusSpecies: 'P. PARDUS FUSCA',
    },
    iucnStatus: 'Vulnerable',
    iucnCriteria: 'CRITERIA C1 (ARAVALLI CORRIDOR)',
    habitat: 'JHALANA & ARAVALLI SCRUB (JAIPUR, INDIA)',
    historicalPop2001: 42,
    historicalPop2007: 36,
    historicalPop2012: 32,
    historicalPop2013: 28,
    historicalPop2018: 34,
    historicalPop2019: 37,
    currentPop2026: 45,
    predictedPop2031: 48,
    unmitigatedCollapseYear: 2042,
    collapseFloor: 15,
    reboundGoal: 70,
    neuralConfidence: 96.2,
    vitalityStats: {
      populationHealthValue: '45 INDIV IN JAIPUR URBAN RESERVE',
      populationHealthPercent: 62,
      populationHealthStatus: 'MODERATE',
      habitatIntegrityPercent: 68,
      habitatIntegrityStatus: 'URBAN BUFFER ADJACENT (JAIPUR)',
      pollinatorDensityPercent: 70,
      pollinatorDensityStatus: 'HIGH PREY DENSITY (PEAFOWL & BLUE BULL)',
      climateResiliencePercent: 78,
      climateResilienceStatus: 'DROUGHT-TOLERANT APEX FELID',
      extinctionModelRiskPercent: 44.5,
      extinctionHorizonYear: 2042,
    },
    limitingFactors: {
      habitatFragmentation: 68,
      pollinatorDensity: 30,
      climateVolatility: 42,
    },
    biologistMemo: {
      entryRef: 'JAI-2026-LEOPARD',
      reserveLocation: 'JHALANA LEOPARD SANCTUARY, JAIPUR, RAJASTHAN',
      timeLogged: '06:15 IST',
      details: 'Apex predator thriving in the ancient Aravalli hill ranges of Jaipur. Features distinctive rosette markings that camouflage against dry deciduous scrub and quartzite rock outcroppings. Key prey species include peafowl, nilgai, and desert hares.',
    },
    curriculumDiscussion: 'Jaipur’s Jhalana Reserve demonstrates remarkable human-wildlife coexistence, where leopards live peacefully right on the edge of a bustling city!',
  },
  {
    id: 'fl-014',
    catalogNumber: '014',
    slotNumber: '#FL-014',
    level: 18,
    category: 'Flora',
    subType: 'Fabaceae',
    commonName: 'Khejri Tree (Shami)',
    scientificName: 'Prosopis cineraria',
    genderOrReproduction: 'HERMAPHRODITIC (NITROGEN FIXING)',
    imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80',
    visionMatchConfidence: 98.7,
    biodiversityRank: 14,
    biodiversityScore: 96.8,
    taxonomy: {
      kingdom: 'PLANTAE',
      order: 'FABALES',
      family: 'Fabaceae',
      genusSpecies: 'P. CINERARIA',
    },
    iucnStatus: 'Least Concern',
    iucnCriteria: 'STATE TREE OF RAJASTHAN',
    habitat: 'ARAVALLI FOOTHILLS & NAHARGARH (JAIPUR, INDIA)',
    historicalPop2001: 950000,
    historicalPop2007: 880000,
    historicalPop2012: 820000,
    historicalPop2013: 790000,
    historicalPop2018: 750000,
    historicalPop2019: 730000,
    currentPop2026: 710000,
    predictedPop2031: 725000,
    unmitigatedCollapseYear: 2065,
    collapseFloor: 200000,
    reboundGoal: 900000,
    neuralConfidence: 97.4,
    vitalityStats: {
      populationHealthValue: '710,000 TREES (KEYSTONE)',
      populationHealthPercent: 82,
      populationHealthStatus: 'STABLE',
      habitatIntegrityPercent: 75,
      habitatIntegrityStatus: 'ARID ECOSYSTEM CORRIDOR',
      pollinatorDensityPercent: 88,
      pollinatorDensityStatus: 'HIGH APIS DORSATA BEE ATTRACTION',
      climateResiliencePercent: 95,
      climateResilienceStatus: 'EXTREME DROUGHT & HEAT TOLERANT',
      extinctionModelRiskPercent: 18.2,
      extinctionHorizonYear: 2065,
    },
    limitingFactors: {
      habitatFragmentation: 38,
      pollinatorDensity: 18,
      climateVolatility: 22,
    },
    biologistMemo: {
      entryRef: 'JAI-2026-KHEJRI',
      reserveLocation: 'NAHARGARH BIOLOGICAL PARK, JAIPUR',
      timeLogged: '08:45 IST',
      details: 'Known as the "Kalpavriksha of the Desert" and the State Tree of Rajasthan. Has remarkable taproots extending over 35 meters deep to reach subterranean water. Its pods (Sangri) are harvested for nutritious traditional food and foliage feeds camels and goats.',
    },
    curriculumDiscussion: 'The Khejri tree enriches soil with nitrogen, cool microclimates under its canopy, and was famously protected by the Bishnoi community in Rajasthan.',
  },
  {
    id: 'fa-015',
    catalogNumber: '015',
    slotNumber: '#FA-015',
    level: 16,
    category: 'Fauna',
    subType: 'Phasianidae',
    commonName: 'Indian Peafowl (Mor)',
    scientificName: 'Pavo cristatus',
    genderOrReproduction: 'SEXUAL POLYGAMOUS',
    imageUrl: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&w=800&q=80',
    visionMatchConfidence: 99.4,
    biodiversityRank: 15,
    biodiversityScore: 92.1,
    taxonomy: {
      kingdom: 'ANIMALIA',
      order: 'GALLIFORMES',
      family: 'Phasianidae',
      genusSpecies: 'P. CRISTATUS',
    },
    iucnStatus: 'Least Concern',
    iucnCriteria: 'NATIONAL BIRD OF INDIA',
    habitat: 'CITY GARDENS, RAMBAGH & NAHARGARH (JAIPUR, INDIA)',
    historicalPop2001: 180000,
    historicalPop2007: 175000,
    historicalPop2012: 168000,
    historicalPop2013: 165000,
    historicalPop2018: 162000,
    historicalPop2019: 160000,
    currentPop2026: 158000,
    predictedPop2031: 156000,
    unmitigatedCollapseYear: 2072,
    collapseFloor: 50000,
    reboundGoal: 190000,
    neuralConfidence: 98.6,
    vitalityStats: {
      populationHealthValue: '158,000 BIRDS (ABUNDANT)',
      populationHealthPercent: 88,
      populationHealthStatus: 'STABLE',
      habitatIntegrityPercent: 82,
      habitatIntegrityStatus: 'PARKS, MONUMENTS & RIDGEWAY WOODS',
      pollinatorDensityPercent: 80,
      pollinatorDensityStatus: 'SEED DISPERSER & INSECT CONTROL',
      climateResiliencePercent: 85,
      climateResilienceStatus: 'HIGH HEAT ADAPTABILITY',
      extinctionModelRiskPercent: 12.4,
      extinctionHorizonYear: 2072,
    },
    limitingFactors: {
      habitatFragmentation: 26,
      pollinatorDensity: 14,
      climateVolatility: 28,
    },
    biologistMemo: {
      entryRef: 'JAI-2026-PEAFOWL',
      reserveLocation: 'CENTRAL PARK & SISODIA RANI GARDENS, JAIPUR',
      timeLogged: '07:20 IST',
      details: 'The National Bird of India, widely revered across Jaipur and Rajasthan. Displays iridescent blue plumage with ornate eye-spotted tail coverts (train). Roosts high in banyan and neem trees at night to avoid predators.',
    },
    curriculumDiscussion: 'Peafowl calls are famous indicators of approaching monsoon rains across Jaipur!',
  },
  {
    id: 'fa-016',
    catalogNumber: '016',
    slotNumber: '#FA-016',
    level: 32,
    category: 'Fauna',
    subType: 'Felidae',
    commonName: 'Bengal Tiger (Bagh)',
    scientificName: 'Panthera tigris tigris',
    genderOrReproduction: 'MAMMALIA DIOECIOUS',
    imageUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80',
    visionMatchConfidence: 99.8,
    biodiversityRank: 16,
    biodiversityScore: 99.2,
    taxonomy: {
      kingdom: 'ANIMALIA',
      order: 'CARNIVORA',
      family: 'Felidae',
      genusSpecies: 'P. TIGRIS TIGRIS',
    },
    iucnStatus: 'Endangered',
    iucnCriteria: 'NATIONAL ANIMAL OF INDIA (CRITERIA C2A)',
    habitat: 'RANTHAMBORE DRY DECIDUOUS FOREST (RAJASTHAN, INDIA)',
    historicalPop2001: 28,
    historicalPop2007: 34,
    historicalPop2012: 52,
    historicalPop2013: 56,
    historicalPop2018: 71,
    historicalPop2019: 74,
    currentPop2026: 88,
    predictedPop2031: 96,
    unmitigatedCollapseYear: 2046,
    collapseFloor: 25,
    reboundGoal: 120,
    neuralConfidence: 97.9,
    vitalityStats: {
      populationHealthValue: '88 TIGERS IN RANTHAMBORE CLUSTER',
      populationHealthPercent: 74,
      populationHealthStatus: 'LOW',
      habitatIntegrityPercent: 86,
      habitatIntegrityStatus: 'PROTECTED TIGER RESERVE CORRIDOR',
      pollinatorDensityPercent: 78,
      pollinatorDensityStatus: 'HEALTHY HERBIVORE PREY BASE',
      climateResiliencePercent: 72,
      climateResilienceStatus: 'DEPENDENT ON WATERHOLES & LAKES',
      extinctionModelRiskPercent: 52.8,
      extinctionHorizonYear: 2046,
    },
    limitingFactors: {
      habitatFragmentation: 62,
      pollinatorDensity: 24,
      climateVolatility: 54,
    },
    biologistMemo: {
      entryRef: 'RAJ-2026-TIGER',
      reserveLocation: 'RANTHAMBORE TIGER RESERVE (JAIPUR RAIL LINK)',
      timeLogged: '16:10 IST',
      details: 'National Animal of India. Famous for hunting around historical ruins, Padam Talao, and Rajbagh lakes. Striated orange-and-black fur coat provides perfect camouflage in dry Dhok forests.',
    },
    curriculumDiscussion: 'Project Tiger in India is one of the world’s most successful conservation turnaround efforts, helping tiger numbers rebound from historic lows!',
  },
  {
    id: 'fa-017',
    catalogNumber: '017',
    slotNumber: '#FA-017',
    level: 15,
    category: 'Fauna',
    subType: 'Bovidae',
    commonName: 'Chinkara (Indian Gazelle)',
    scientificName: 'Gazella bennettii',
    genderOrReproduction: 'SEXUAL DIOECIOUS',
    imageUrl: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=800&q=80',
    visionMatchConfidence: 98.5,
    biodiversityRank: 17,
    biodiversityScore: 89.6,
    taxonomy: {
      kingdom: 'ANIMALIA',
      order: 'ARTIODACTYLA',
      family: 'Bovidae',
      genusSpecies: 'G. BENNETTII',
    },
    iucnStatus: 'Least Concern',
    iucnCriteria: 'STATE HERITAGE ANIMAL OF RAJASTHAN',
    habitat: 'ARAVALLI FOOTHILLS & NAHARGARH RIDGE (JAIPUR, INDIA)',
    historicalPop2001: 82000,
    historicalPop2007: 78000,
    historicalPop2012: 74000,
    historicalPop2013: 72000,
    historicalPop2018: 70000,
    historicalPop2019: 68000,
    currentPop2026: 66000,
    predictedPop2031: 65000,
    unmitigatedCollapseYear: 2060,
    collapseFloor: 20000,
    reboundGoal: 85000,
    neuralConfidence: 96.7,
    vitalityStats: {
      populationHealthValue: '66,000 INDIV (DESERT ADAPTED)',
      populationHealthPercent: 78,
      populationHealthStatus: 'STABLE',
      habitatIntegrityPercent: 72,
      habitatIntegrityStatus: 'ARID SCRUB & SANDY RIDGES',
      pollinatorDensityPercent: 74,
      pollinatorDensityStatus: 'GRAZER OF NATIVE SHRUBS',
      climateResiliencePercent: 94,
      climateResilienceStatus: 'CAN SURVIVE DAYS WITHOUT FREE WATER',
      extinctionModelRiskPercent: 24.1,
      extinctionHorizonYear: 2060,
    },
    limitingFactors: {
      habitatFragmentation: 48,
      pollinatorDensity: 18,
      climateVolatility: 32,
    },
    biologistMemo: {
      entryRef: 'JAI-2026-CHINKARA',
      reserveLocation: 'NAHARGARH BIOLOGICAL ZONE, JAIPUR',
      timeLogged: '09:05 IST',
      details: 'Slender antelope with delicate lyre-shaped horns. In desert conditions, Chinkara can extract all required hydration from dew drops and vegetation without needing standing open water.',
    },
    curriculumDiscussion: 'Chinkaras run in graceful bounds reaching up to 64 km/h to evade desert predators.',
  },
  {
    id: 'rp-018',
    catalogNumber: '018',
    slotNumber: '#RP-018',
    level: 17,
    category: 'Reptilia',
    subType: 'Varanidae',
    commonName: 'Bengal Monitor Lizard (Goh)',
    scientificName: 'Varanus bengalensis',
    genderOrReproduction: 'OVIPAROUS',
    imageUrl: 'https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?auto=format&fit=crop&w=800&q=80',
    visionMatchConfidence: 98.2,
    biodiversityRank: 18,
    biodiversityScore: 88.7,
    taxonomy: {
      kingdom: 'ANIMALIA',
      order: 'SQUAMATA',
      family: 'Varanidae',
      genusSpecies: 'V. BENGALENSIS',
    },
    iucnStatus: 'Least Concern',
    iucnCriteria: 'INDIAN WILDLIFE PROTECTION ACT SCHEDULE I',
    habitat: 'AMER & NAHARGARH ROCKY CREVICES (JAIPUR, INDIA)',
    historicalPop2001: 65000,
    historicalPop2007: 62000,
    historicalPop2012: 59000,
    historicalPop2013: 57000,
    historicalPop2018: 55000,
    historicalPop2019: 53000,
    currentPop2026: 51000,
    predictedPop2031: 49000,
    unmitigatedCollapseYear: 2062,
    collapseFloor: 16000,
    reboundGoal: 65000,
    neuralConfidence: 95.8,
    vitalityStats: {
      populationHealthValue: '51,000 REPTILES (STABLE)',
      populationHealthPercent: 80,
      populationHealthStatus: 'STABLE',
      habitatIntegrityPercent: 79,
      habitatIntegrityStatus: 'ANCIENT STONE FORTS & BOULDERS',
      pollinatorDensityPercent: 72,
      pollinatorDensityStatus: 'PREYS ON ARTHROPODS & RODENTS',
      climateResiliencePercent: 91,
      climateResilienceStatus: 'EXCELLENT HEAT REGULATION',
      extinctionModelRiskPercent: 21.6,
      extinctionHorizonYear: 2062,
    },
    limitingFactors: {
      habitatFragmentation: 42,
      pollinatorDensity: 20,
      climateVolatility: 28,
    },
    biologistMemo: {
      entryRef: 'JAI-2026-MONITOR',
      reserveLocation: 'AMER FORT RIDGE & NAHARGARH, JAIPUR',
      timeLogged: '12:30 IST',
      details: 'Large diurnal monitor lizard growing up to 1.75 meters. In folklore, Shivaji’s forces were said to have used trained monitor lizards with ropes to scale steep cliff faces due to their incredible claw grip on stone.',
    },
    curriculumDiscussion: 'Monitor lizards are cold-blooded ectotherms that bask on warm stone walls in the morning to fuel their muscles for hunting!',
  },
];

export const INITIAL_SPECIES_CATALOG: SpeciesData[] = RAW_INITIAL_SPECIES_CATALOG.map(enrichSpeciesWithEducationalData);

export const INITIAL_DEFAULT_SURVEY_RECORD: SurveyRecord = {
  recordId: 'REC-2026-8901',
  studentGuestId: 'GUEST-G8-042',
  gradeLevel: 'Grade 8',
  timestamp: '2026-09-04 14:22:00 UTC',
  speciesId: 'pl-001',
  speciesCommon: 'Western Prairie Fringed Orchid',
  speciesScientific: 'Platanthera praeclara',
  imageUrl: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=800&q=80',
  visionConfidence: '98.6% Match',
  observedCount: 4,
  habitatType: 'Tallgrass Prairie / Wet-Mesic',
  humanDisturbance: 'LOW',
  gpsCoordinates: '44.8142° N, 93.3524° W',
  sectorCoord: 'Prairie Quad Sector 4',
  historicalPop2001: 150000,
  historicalPop2007: 135000,
  historicalPop2012: 120000,
  historicalPop2013: 105000,
  historicalPop2019: 68000,
  currentPop2026: 28500,
  predictedPop2031: 18500,
  aiEndangeredStatus: 'Endangered',
  aiExtinctionRiskPercentage: 74.2,
  aiProjectedExtinctionYear: 'Year 2038 (if unmitigated)',
  smartReportUrl: 'https://app.wwf.org/reports/REP-8901.pdf',
  conservationLevers: {
    prairieBufferExpansion: 25,
    invasivePlantRemovalRate: 60,
  },
};
