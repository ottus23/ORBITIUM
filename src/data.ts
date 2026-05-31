/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChemicalElement, ReactionConfig } from './types';
import elementsJson from './database/elements.json';

// Seeded scientific database for all 118 elements exported as a unified type array
export const ELEMENTS_DATA = elementsJson as ChemicalElement[];

export const CATEGORY_COLORS: Record<string, { hex: string; label: string; description: string }> = {
  'alkali-metal': {
    hex: '#FF5722',
    label: 'Alkali Metals',
    description: 'Extremely volatile and reactive metallic elements.'
  },
  'alkaline-earth': {
    hex: '#FFD600',
    label: 'Alkaline Earth',
    description: 'Shiny, moderately reactive solids that burn with bright colorful flames.'
  },
  'transition-metal': {
    hex: '#8D99AE',
    label: 'Transition Metals',
    description: 'High strength, metallic, and lustrous elements that form dense structures.'
  },
  'post-transition-metal': {
    hex: '#00FFB3',
    label: 'Post-Transition Metals',
    description: 'Softer metals lying between transition metals and metalloids.'
  },
  'metalloid': {
    hex: '#00E676',
    label: 'Metalloids',
    description: 'Elements exhibiting properties intermediate between metals and nonmetals.'
  },
  'reactive-nonmetal': {
    hex: '#7C4DFF',
    label: 'Reactive Nonmetals',
    description: 'Abundant, vital non-metallic constituents of life and chemistry.'
  },
  'halogen': {
    hex: '#D500F9',
    label: 'Halogens',
    description: 'Highly electronegative, nonmetallic elements forming intense visual reactive fields.'
  },
  'noble-gas': {
    hex: '#00E5FF',
    label: 'Noble Gases',
    description: 'Highly stable, odorless, inert gases with beautiful glowing atomic discharges.'
  },
  'lanthanide': {
    hex: '#FF80AB',
    label: 'Lanthanides',
    description: 'Rare-earth reactive items with high magnetic and spark emissions.'
  },
  'actinide': {
    hex: '#39FF14',
    label: 'Actinides',
    description: 'Ultra-heavy, naturally unstable, unstable toxic radioactive components.'
  }
};

export const REACTION_CONFIGS: ReactionConfig[] = [
  {
    reactants: ['Na', 'Cl'],
    productName: 'Sodium Chloride (Table Salt)',
    productFormula: 'NaCl',
    description: 'Ionic Bonding: Sodium (alkali metal) donates its valence electron to Chlorine (halogen), establishing a highly stable face-centered cubic ionic salt lattice crystal.',
    visualType: 'ionic',
    conditions: 'Direct alkali-halogen heat combination or gaseous halogen displacement',
    resultingMaterial: 'Isometric cubic salt crystal blocks with clear vitreous surfaces',
    realWorldApplications: ['Dietary mineral electrolytes', 'Industrial chlor-alkali feedstock', 'Oceanic salinity balance'],
    whyItMatters: 'Sodium Chloride maintains cellular osmotic tension, making nerve conduction, fluid retention, cardiac pacing, and muscular action potentials possible across all complex species.',
    structure: 'Face-centered cubic (FCC) ionic lattice, where each ion is coordinate-bonded by six opposing ions',
    properties: ['Strong ionic electrostatic bonds', 'Water-soluble lattice dissociation', 'High melting point (801 °C)'],
    uses: ['Culinary preservative & seasoning', 'Safety road de-icing agent', 'Saline drip IV fluids'],
    bondEnergy: 787,
    stabilityMetric: 'Ultra-Stable Crystal Lattice',
    reactionType: 'IONIC SYNTHESIS',
    discoveryPathways: ['Electrolysis yields pure Chlorine gas', 'Forms essential electrolyte solutions in biology', 'Basis for Chlor-alkali industrial processes']
  },
  {
    reactants: ['H', 'O'],
    productName: 'Water (Dihydrogen Monoxide)',
    productFormula: 'H₂O',
    description: 'Covalent Bonding: Two Hydrogen atoms share their single valence electrons with one Oxygen atom, forming stable, polar bent-molecular covalent water particles.',
    visualType: 'covalent',
    conditions: 'Thermal kinetic spark trigger, or catalytic fuel-cell membrane coupling',
    resultingMaterial: 'High-clarity polar aqueous fluid, forming flexible cohesive droplets',
    realWorldApplications: ['Cellular metabolic hydration', 'Cryogenic liquid rocket fuel', 'Planetary ecosystem climate solvent'],
    whyItMatters: 'Water is the absolute cradle of planetary life. Its high polarity creates hydrogen bonds that regulate Earth\'s climate, dissolve nutrients, and power metabolic cellular operations.',
    structure: 'Polar bent-geometry molecule (104.5° angle), holding infinite hydrogen-bonding networks',
    properties: ['Universal solvent capability', 'High specific heat capacity', 'Anomalous density expansion when frozen'],
    uses: ['Agricultural hydration and irrigation', 'Nuclear & industrial thermal heat absorption', 'Universal biological solvent'],
    bondEnergy: 927,
    stabilityMetric: 'Stable Polar Covalent',
    reactionType: 'SYNTHESIS (COMBUSTION)',
    discoveryPathways: ['Can be electrolyzed back into pure fuel', 'Acts as a universal solvent for complex biology', 'Precursor to acidic and basic solutions']
  },
  {
    reactants: ['Cs', 'H'],
    productName: 'Violent Caesium Hydroxide Alkaline Jet',
    productFormula: 'CsOH + H₂',
    description: 'Extreme Alkali Action: Caesium reacts violently with Hydrogen/vapor to form Caesium hydroxide, releasing flammable Hydrogen gas in an instant plasma explosion.',
    visualType: 'explosion',
    conditions: 'Immediate moisture contact with Caesium metal at cryogenic and ambient ranges',
    resultingMaterial: 'Highly corrosive alkaline slurry and high-energy hydrogen plasma',
    realWorldApplications: ['Silicon microchip anisotropic catalytic etching', 'Deep low-temperature battery electrolytes', 'Chemical kinetics demonstrations'],
    whyItMatters: 'This represents the absolute limit of chemical base alkalinity and electron release. It showcases the extreme volatility of highly shielded alkali metals.',
    structure: 'Monoclinic ionic Caesium Hydroxide matrix coupled with free diatomic nonpolar Hydrogen gas',
    properties: ['Extreme proton-stripping alkalinity', 'Exothermic blast release', 'Highly hygroscopic lattice structure'],
    uses: ['Low-temperature battery systems', 'Precision silicon microfabrication', 'Synthetic polymer catalysts'],
    bondEnergy: 342,
    stabilityMetric: 'Highly Unstable/Explosive',
    reactionType: 'SINGLE REPLACEMENT (EXOTHERMIC ALKALINE)',
    discoveryPathways: ['Forms extremophile environments', 'Creates highly conductive plasmas', 'Catalyzes rapid polymer bonds']
  },
  {
    reactants: ['C', 'O'],
    productName: 'Carbon Dioxide Gas',
    productFormula: 'CO₂',
    description: 'Double Covalent Carbon Bonds: A single Carbon atom shares two pairs of electrons with two separate Oxygen atoms to assemble linear, atmospheric carbon compounds.',
    visualType: 'covalent',
    conditions: 'Thermal combustion of carbonaceous fuels under atmospheric oxygen fields',
    resultingMaterial: 'Colorless, dense gas which solidifies directly into solid dry ice blocks at -78.5 °C',
    realWorldApplications: ['Photosynthetic carbon plant feedstock', 'Industrial fire extinguishers', 'Carbonated beverage carbonation'],
    whyItMatters: 'Carbon Dioxide is the primary structural building brick of biosphere flora. It drives the photosynthetic carbon cycle and forms the crucial thermal greenhouse blanket of Earth.',
    structure: 'Linear covalent compound with double bonds, zero net dipole moment',
    properties: ['Chemically stable linear shape', 'Water-soluble forming carbonic acid', 'Direct solid-gas sublimation'],
    uses: ['Refrigeration dry ice preservation', 'Active fire suppression grids', 'Greenhouse botanical acceleration'],
    bondEnergy: 799,
    stabilityMetric: 'Stable Linear Covalent',
    reactionType: 'COMBUSTION (OXIDATION)',
    discoveryPathways: ['Forms Carbonic Acid in water', 'Crucial reactant for plant photosynthesis', 'Can be reduced back to Carbon Monoxide']
  },
  {
    reactants: ['Fe', 'O'],
    productName: 'Iron Oxide (Hydrated Rust)',
    productFormula: 'Fe₂O₃',
    description: 'Metallic Oxidation: Iron loses electrons slowly in contact with environmental Oxygen molecules, transforming the dense transition metal into crumbly red rust.',
    visualType: 'ionic',
    conditions: 'Slow atmospheric oxidation catalyzed by environmental humidity and salt ions',
    resultingMaterial: 'Brittle, highly porous reddish-brown scales that flake away from dense core metal',
    realWorldApplications: ['Hematite geological iron ore', 'Magnetic recording tape oxides', 'Polishing rouge abrasives'],
    whyItMatters: 'Iron Oxide records geological history across planet crusts, colors the Martian regolith blood-red, and represents the structural decay that engineers must constantly fight.',
    structure: 'Hexagonal close-packed ionic crystal structure with iron ions filling octahedral holes',
    properties: ['Paramagnetic oxidation coat', 'Highly porous and mechanically weak', 'Water insoluble compound'],
    uses: ['Ceramic & clay masonry pigments', 'Steel smelting blast furnace feedstock', 'Historical magnetic stripes'],
    reactionType: 'OXIDATION (SLOW COMBUSTION)',
    discoveryPathways: ['Forms the red deserts of Mars', 'Foundational to the smelting of Steel', 'Destroys unchecked modern infrastructure']
  },
  {
    reactants: ['H', 'H'],
    productName: 'Thermonuclear Heliogenesis Fusion',
    productFormula: 'He (Primal Sun)',
    description: 'Nuclear Fusion Cascade: Under titanic stellar core pressures, two Hydrogen nuclei fuse directly into Helium, releasing blinding solar plasma streams and mass-energy.',
    visualType: 'explosion',
    conditions: 'Titanic gravitational pressures and nuclear temperatures exceeding 15 million Kelvin',
    resultingMaterial: 'Super-heated ionized Helium gas plasma emitting stellar daylight and gamma streams',
    realWorldApplications: ['Cosmic stellar nucleogenesis', 'Experimental magnetic fusion tokamaks', 'Stellar radiative energy'],
    whyItMatters: 'Stellar Hydrogen fusion is the ultimate powerhouse of our universe. Every photon of daylight warming Earth was seeded by this nuclear reaction, fusing matter and creating elements.',
    structure: 'Primal atomic Helium nuclei (alpha-particles) in an electron-degenerate high-energy plasma soup',
    properties: ['Direct mass-energy conversion (E=mc²)', 'Overcomes extreme Coulomb barriers', 'High thermal emission output'],
    uses: ['Generating daylight & planetary heat', 'Hydrogen energy fusion research', 'Astrophysical stellar models'],
    bondEnergy: 99999,
    stabilityMetric: 'Stellar Fusion Bound',
    reactionType: 'NUCLEAR FUSION',
    discoveryPathways: ['Synthesizes every heavy element in the universe', 'Provides the core energy for biological life', 'The ultimate goal of clean power generation']
  },
  {
    reactants: ['Ar', 'F'],
    productName: 'Excimer Plasma Quantum Laser',
    productFormula: 'ArF*',
    description: 'Quantum Excitation: Unstable excited argon gas coordinates briefly with reactive fluorine molecules, discharging coherent high-frequency ultraviolet light.',
    visualType: 'covalent',
    conditions: 'High-voltage pulsed electrical discharge inside pressurized argon-fluorine gas cells',
    resultingMaterial: 'Bluish-cyan ionized gas discharging coherent deep-ultraviolet photons',
    realWorldApplications: ['Deep-ultraviolet semiconductor photolithography', 'Ophthalmic LASIK vision correction', 'Precision nanomaterial ablation'],
    whyItMatters: 'By producing highly coherent 193 nm ultraviolet laser light, ArF* allows optical machines to etch transistor patterns onto microchips, enabling modern computer memory.',
    structure: 'Excited temporary dimer (Excimer) stabilized by electrostatic force, collapsing in nanoseconds',
    properties: ['Coherent deep 193 nm UV output', 'Extremely brief excited-state lifetime', 'High energy chemical discharge'],
    uses: ['Ultrafine microcircuit lithography', 'Corneal surgery ablation', 'Nanoscale laser analysis'],
    bondEnergy: 154,
    stabilityMetric: 'Nanosecond Excitonic State'
  },
  {
    reactants: ['Y', 'Cu'],
    productName: 'Superconducting YBCO Ceramic Matrix',
    productFormula: 'YBa₂Cu₃O₇-x',
    description: 'Quantum Perovskite Grid: Copper, Yttrium, Barium, and Oxygen coordinate in multi-layered crystalline structures, allowing perfect zero-resistance electrical currents.',
    visualType: 'ionic',
    conditions: 'High-temperature sintering of metal oxides in oxygen air-controlled kilns',
    resultingMaterial: 'Dark ceramic superconductor blocks displaying Meissner magnetic levitation',
    realWorldApplications: ['High-speed Maglev bullet trains', 'Hospital MRI superconducting magnets', 'Lossless electrical power grids'],
    whyItMatters: 'YBCO was the first discovered material to superconduct above liquid nitrogen boiling point (77 K), opening affordable pathways to quantum magnetic transport and lossless power grids.',
    structure: 'Orthorhombic perovskite oxygen-deficient copper-oxide planar sheet layers',
    properties: ['Perfect diamagnetism (Meissner effect)', 'Zero electrical resistivity', 'Critical temperature boundary at 93 K'],
    uses: ['Magnetic suspension levitators', 'Ultra-high field science magnets', 'Lossless grid cable prototypes'],
    bondEnergy: 624,
    stabilityMetric: 'Quantum Perovskite Matrix'
  },
  {
    reactants: ['Si', 'O'],
    productName: 'Silicon Dioxide (Quartz & Glass)',
    productFormula: 'SiO₂',
    description: 'Covalent Network Crystallite: A dense covalent network of Silicon-Oxygen tetrahedra, forming a rugged mineral scaffold that remains non-reactive and highly transparent.',
    visualType: 'covalent',
    conditions: 'High-temperature fusing of mineral sand or oxygenation of pure silicon crystals',
    resultingMaterial: 'Ultra-clear amorphous glass window panes or durable hexagonal quartz crystals',
    realWorldApplications: ['Fiber-optic global submarine communication lines', 'Silicon semiconductor dielectric barrier coatings', 'Science laboratory glassware containers'],
    whyItMatters: 'Silicon Dioxide forms the physical hardware of our global digital connection. As glass windows, telescope lenses, and fiber optics, it transmits light, databases, and structural strength across humanity.',
    structure: 'Infinite covalent tetrahedral network lattice with SiO₄ structural blocks',
    properties: ['High glass-transition thermal threshold', 'Excellent deep light transmission', 'Highly resistant to chemical acid attack'],
    uses: ['Optical lenses & macro fiber lines', 'High strength concrete & building materials', 'Precision chemical vessel containers'],
    bondEnergy: 798,
    stabilityMetric: 'Ultra-Stable Network Covalent',
    reactionType: 'SYNTHESIS (HIGH TEMP OXIDATION)',
    discoveryPathways: ['Transformed into semiconducting Silicon wafers', 'Provides the core structure of microchips', 'Forms the geological crust of terrestrial planets']
  },
  {
    reactants: ['N', 'H'],
    productName: 'Ammonia (Fertilizer Compound)',
    productFormula: 'NH₃',
    description: 'Pyramidal Electrophile: Nitrogen bonds covalently with three Hydrogen atoms, leaving a highly active lone electron pair that makes the gas highly soluble and alkaline.',
    visualType: 'covalent',
    conditions: 'Haber-Bosch Catalyst: Extreme 200 atm pressures and 450 °C heat over porous iron catalyst templates',
    resultingMaterial: 'Pungent, highly soluble gas that condenses into a clear liquid under light compression',
    realWorldApplications: ['Agricultural chemical nitrogen fertilizers', 'Eco-friendly industrial cold-storage refrigeration', 'Chemical ammunition and precursors'],
    whyItMatters: 'Synthesizing Ammonia represents the ultimate bridge between atmosphere and biosphere, extracting inert nitrogen from the air to fertilizer soils, feeding over half of human civilization.',
    structure: 'Trigonal pyramidal geometry with nitrogen sitting at the apex, presenting a highly polar dipole moment',
    properties: ['Exceptional water solubility', 'Extreme hydrogen-bonding capacity', 'Strong alkali conjugate proton affinity'],
    uses: ['Soil nitrogen crop enrichment', 'Industrial large-scale refrigeration coolant', 'Nitric acid chemical syntheses'],
    bondEnergy: 391,
    stabilityMetric: 'Stable Trigonal Pyramidal',
    reactionType: 'SYNTHESIS (CATALYTIC FIXATION)',
    discoveryPathways: ['Feeds agricultural crops artificially', 'Combines into complex nitrogen explosives', 'Crucial baseline for amino acid development']
  },
  {
    reactants: ['C', 'H'],
    productName: 'Methane (Aliphatic Hydrocarbon)',
    productFormula: 'CH₄',
    description: 'Perfect Tetrahedral Covalent: A single carbon atom coordinates four symmetrical hydrogen bonds, forming the lightest, most calorific hydrocarbon fuel.',
    visualType: 'covalent',
    conditions: 'Anaerobic metabolic decay of organic structures or thermal cracking of fossil reserves',
    resultingMaterial: 'Odorless, extremely light highly combustible natural gas',
    realWorldApplications: ['Municipal gas turbine power stations', 'Residential stove of heating systems', 'Carbon-black structural additives'],
    whyItMatters: 'Methane represents a massive energy source that burns cleaner than organic coal, serving as the core molecule of carbonochemistry and space fuel models.',
    structure: 'Highly symmetrical, nonpolar tetrahedral configuration (109.5° bonding angle)',
    properties: ['High heat density release', 'Extremely low boiling temperature (-161.5 °C)', 'Clean flame forming only CO₂ and water'],
    uses: ['Electrical turbine grid generators', 'Domestic natural heating grid supplies', 'Feedstock for hydrogen steam-methane reformers'],
    bondEnergy: 413,
    stabilityMetric: 'Highly Stable Aliphatic',
    reactionType: 'SYNTHESIS (ORGANIC DECAY)',
    discoveryPathways: ['Forms complex hydrocarbon polymer chains', 'Cracks into Hydrogen Gas and solid Carbon', 'Basis for complex extraterrestrial lakes (Titan)']
  },
  {
    reactants: ['H', 'Cl'],
    productName: 'Hydrochloric Acid',
    productFormula: 'HCl',
    description: 'Polar Dumbbell Covalent: Diatomic polar bonding. Chlorine\'s high electronegativity pulls the electron density, allowing instant dissociation into corrosive protons in water.',
    visualType: 'covalent',
    conditions: 'Direct gas combustion of Hydrogen in Chlorine gas, or treatment of rock salts with acid',
    resultingMaterial: 'Highly volatile, strongly fuming corrosive acidic solution',
    realWorldApplications: ['Mammalian gastric digestive acid', 'Industrial steel surface descaling', 'Chemical synthesis acid-catalysis'],
    whyItMatters: 'Without Hydrochloric Acid, mammalian stomach digestion would fail, as it activates key enzymes that dismantle proteins. In heavy industries, it works to pickle metals.',
    structure: 'Linear polar diatomic molecular structure with robust dipol momentum',
    properties: ['Infinite solubility in water', 'Complete ionic dissociation (Strong Mineral Acid)', 'Reactivates and dissolves metal oxides'],
    uses: ['Metal surface Rust removal and scale pickling', 'Aqueous chemical pH balance control', 'Food production starch hydrolyzation'],
    bondEnergy: 431,
    stabilityMetric: 'Stable Polar Diatomic'
  },
  {
    reactants: ['Li', 'O'],
    productName: 'Lithium Oxide (Battery Oxide)',
    productFormula: 'Li₂O',
    description: 'Ultra-Light Ionic Lattice: Lithium surrenders outer valence orbitals to Oxygen, creating a light, dense ionic structure highly valued in solid-state cell mechanics.',
    visualType: 'ionic',
    conditions: 'Controlled oxidation of lithium metal or calcination of lithium carbonate mineral salts',
    resultingMaterial: 'Compact, dense white abrasive ceramic powder',
    realWorldApplications: ['Solid-state lithium battery electrolyte matrices', 'Durability glaze coatings for spacecraft panels', 'Carbon-dioxide gas purification scrubbing'],
    whyItMatters: 'Lithium Oxide forms a highly protective chemical transition layer in modern rechargeable batteries, maximizing energy density while preventing internal short circuits and thermal runaway.',
    structure: 'Antifluorite crystal lattice configuration with lithium ions filling tetrahedral gaps',
    properties: ['Thermally stable up to 1438 °C', 'Extremely high ionic lithium mobility', 'Reacts with water to form lithium hydroxide'],
    uses: ['Advanced solid-state battery structures', 'Vitreous glass and ceramic thermal glazes', 'Nuclear tritium breeder blankets'],
    bondEnergy: 341,
    stabilityMetric: 'Stable Anti-Fluorite Lattice'
  },
  {
    reactants: ['U', 'F'],
    productName: 'Uranium Hexafluoride',
    productFormula: 'UF₆',
    description: 'Octahedral Heavy Volatile: A heavy central transition core surrounded by six fluorine ligands, forming a coordinate compound that vaporizes at mild temperatures for centrifuge spin.',
    visualType: 'explosion',
    conditions: 'Fluorination of refined uranium oxides at elevated processing temperatures',
    resultingMaterial: 'Corrosive, highly fuming dense heavy crystals that sublime easily into gas',
    realWorldApplications: ['Nuclear centrifuge isotope separation', 'Nuclear fuel isotope enrichment', 'Fission energy production'],
    whyItMatters: 'UF₆ is the absolute key of atomic energy. By turning uranium into a gas, centrifuges can separate fissionable Uranium-235 from heavy Uranium-238, supplying fuel for nuclear power hubs.',
    structure: 'Sub-monoclinic dense octahedral molecular geometry with weak intermolecular Van der Waals forces',
    properties: ['Vaporizes cleanly at 56.5 °C', 'Corrosive and radioactive', 'Reacts violently with moist air to release hydrofluoric acid gas'],
    uses: ['Gaseous centrifugation nuclear breeding', 'Nuclear reactor core fuel pellets'],
    bondEnergy: 512,
    stabilityMetric: 'Volatile Octahedral'
  }
];
