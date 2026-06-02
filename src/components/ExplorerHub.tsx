import React, { useState } from 'react';
import { 
  Compass, 
  Database, 
  Cpu, 
  GitMerge, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  Layers, 
  Globe, 
  Orbit, 
  Flame, 
  Beaker, 
  Settings, 
  TrendingUp, 
  Activity, 
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Copy,
  Play,
  Share2
} from 'lucide-react';
import { OrbitiumKnowledgeEngine } from '../utils/KnowledgeEngine';
import { ELEMENTS_DATA } from '../data';

interface ExplorerHubProps {
  onSelectElementBySymbol: (symbol: string) => void;
  onScaleChange?: (scaleId: string) => void;
}

// --------------------------------------------------
// DATA MODELS FOR THE ATLAS OF MATTER
// --------------------------------------------------

interface ScaleNode {
  id: string;
  name: string;
  exponent: string;
  metric: string;
  interaction: string;
  description: string;
  details: { label: string; value: string }[];
  associatedSymbols: string[];
}

interface ChemicalCompound {
  formula: string;
  name: string;
  class: string;
  weight: string;
  geometry: string;
  properties: string[];
  synthesis: string;
  humanSignificance: string;
  reactants: string[];
}

interface MaterialStructure {
  name: string;
  composition: string;
  bondingType: string;
  keyFeature: string;
  scientificContext: string;
  humanImportance: string;
  atomsRepresented: string[];
}

interface CivilizationPipeline {
  title: string;
  themeColor: string;
  steps: {
    label: string;
    sub: string;
    description: string;
  }[];
  associatedElements: string[];
}

interface NucleosynthesisEvent {
  title: string;
  era: string;
  narrative: string;
  keyYields: string;
  densityTemp: string;
  cosmicPercentage: string;
}

// --------------------------------------------------
// EXHILARATING SCIENTIFIC DATASETS
// --------------------------------------------------

const SCALE_NODES: ScaleNode[] = [
  {
    id: 'universe',
    name: 'Metagalaxy Universe',
    exponent: '10^26 m',
    metric: '93 Billion Light Years',
    interaction: 'General Relativity, Dark Energy Space Expansion',
    description: 'The observable cosmos is woven of endless galactic supercluster web filaments, stretching across astronomical gas oceans of dark plasma.',
    details: [
      { label: 'Observable Mass', value: '1.5 × 10^53 kg' },
      { label: 'Matter Split', value: '4.9% Baryons, 26.8% Dark Matter' },
      { label: 'Cosmological age', value: '13.787 Billion Years' }
    ],
    associatedSymbols: ['H', 'He', 'Li']
  },
  {
    id: 'galaxies',
    name: 'Nebular Galaxies',
    exponent: '10^21 m',
    metric: '100,000 Light Years',
    interaction: 'Supermassive Black Hole Gravitational Anchorage',
    description: 'Massive swirling collections of solar systems, glowing nurseries of cosmic dust, stellar nebulae, and stellar remants bounded by dark mass fields.',
    details: [
      { label: 'Average Stars', value: '100 Billion per Galaxy' },
      { label: 'Central Mass', value: 'Sagittarius A* (4.15M Suns)' },
      { label: 'Rotational Velocity', value: '220 km/s (Milky Way)' }
    ],
    associatedSymbols: ['H', 'He', 'C', 'O']
  },
  {
    id: 'stars',
    name: 'Stellar Nuclei',
    exponent: '10^9 m',
    metric: '1.39 Million km Dia',
    interaction: 'Thermonuclear Fusion vs. Hydrostatic Pressure',
    description: 'Primordial stellar factories fusing light elements into dense stellar matrices. Generates the thermal radiation pathways making biospheres possible.',
    details: [
      { label: 'Core Temp', value: '15.7 Million Kelvin' },
      { label: 'Energy Flux', value: '3.8 × 10^26 Watts' },
      { label: 'Alpha Steps', value: 'Carbon to Nickel-56' }
    ],
    associatedSymbols: ['H', 'He', 'C', 'Ne', 'O', 'Si', 'Fe']
  },
  {
    id: 'planets',
    name: 'Geodynamic Planets',
    exponent: '10^7 m',
    metric: '12,742 km Diameter',
    interaction: 'Gravitational Accretion, Crustal Geodynamics',
    description: 'Differentiated orbits accumulating chemical silicates, metallic cores, and surface atmospheres supporting chemical equilibrium states.',
    details: [
      { label: 'Core Content', value: 'Iron-Nickel Alloy Matrix' },
      { label: 'Atmosphere Buffers', value: 'N₂, O₂, CO₂, H₂O vapor' },
      { label: 'Magnetic Dipole', value: 'Geodynamo Fluid Convection' }
    ],
    associatedSymbols: ['Si', 'O', 'Fe', 'Ni', 'Mg', 'Al']
  },
  {
    id: 'elements',
    name: 'Macroscopic Elements',
    exponent: '10^-1 m',
    metric: 'Visible Lattice Form',
    interaction: 'Intermolecular forces, Van der Waals dispersion',
    description: 'Macroscopic pure substances exhibiting crystalline structures, phase boundaries, thermal conductivity, and mechanical behaviors.',
    details: [
      { label: 'Pure States STP', value: 'Solid, Liquid, Gas' },
      { label: 'Lattice Types', value: 'BCC, FCC, Hexagonal Close-Packed' },
      { label: 'Conductivity', value: 'Free-electron metallic electron clouds' }
    ],
    associatedSymbols: ['Cu', 'Au', 'Ag', 'Al', 'Ti', 'Pt']
  },
  {
    id: 'atoms',
    name: 'Schrödinger Atoms',
    exponent: '10^-10 m',
    metric: '52.9 pm Bohr Radius',
    interaction: 'Coulombic Electrostatic Attraction forces',
    description: 'Beautiful localized wave packets of electron charge probability dancing in orbital shells above a compact baryonic center.',
    details: [
      { label: 'Quantum States', value: 's, p, d, f orbitals' },
      { label: 'Ionization Energy', value: 'Planck-constant wavelength shift' },
      { label: 'Energy Levels', value: 'Principal Quantum Numbers (N=1..7)' }
    ],
    associatedSymbols: ['H', 'He', 'Li', 'Be', 'B', 'C']
  },
  {
    id: 'nuclei',
    name: 'Baryonic Nuclei',
    exponent: '10^-15 m',
    metric: '1.2 to 5.0 femtometers',
    interaction: 'Strong Interaction (Yukawa Meson Field Binding)',
    description: 'Dense baryonic cores holding the mass of reality. Stability is governed by the ratio of proton electrostatic repulsion and strong force binding.',
    details: [
      { label: 'Packing Density', value: '2.3 × 10^17 kg/m³' },
      { label: 'Nuclear Core State', value: 'Fermi gas of protons & neutrons' },
      { label: 'Magic Numbers', value: '2, 8, 20, 28, 50, 82, 126 (Shell closure)' }
    ],
    associatedSymbols: ['U', 'Pb', 'Th', 'Ra', 'Pu']
  },
  {
    id: 'protons',
    name: 'Nucleons (Protons)',
    exponent: '10^-15 m',
    metric: '0.84 femtometers Radius',
    interaction: 'Quantum Chromodynamics (Gluon Color Charge)',
    description: 'Subatomic hadrons comprising three valence quarks bound together by gluons, creating the charge metric of chemical atomic identity.',
    details: [
      { label: 'Quark Composition', value: '2 Up Quarks, 1 Down Quark (u-u-d)' },
      { label: 'Rest Mass Energy', value: '938.272 MeV/c²' },
      { label: 'Charge Metric', value: '+1 e (1.602 × 10^-19 Coulombs)' }
    ],
    associatedSymbols: ['H']
  },
  {
    id: 'quarks',
    name: 'Elementary Quarks',
    exponent: '10^-19 m',
    metric: 'Point-like limits <10^-19 m',
    interaction: 'SU(3) Gluon Gauge Coupling & Strong Color Charge',
    description: 'Constituent fermions of baryonic state structures with fractional electric charges, experiencing absolute color confinement.',
    details: [
      { label: 'Valence Flavors', value: 'Up (+2/3e), Down (-1/3e)' },
      { label: 'Asymptotic Freedom', value: 'Weakens at extremely close margins' },
      { label: 'Force Carriers', value: '8 Color-charged spin-1 Gauge Gluons' }
    ],
    associatedSymbols: ['H', 'U']
  }
];

const COMPOUNDS_LIBRARY: ChemicalCompound[] = [
  {
    formula: 'H₂O',
    name: 'Dihydrogen Monoxide (Water)',
    class: 'Polar Hydrogen-Bonded Solvent',
    weight: '18.0152 g/mol',
    geometry: 'Bent Tetrahedral (104.5° Angle)',
    properties: [
      'Universal solvent with extremely high dielectric constant',
      'Anomalous density peak at 4°C saving life in frozen biospheres',
      'Immensely energetic cohesive surface tension properties'
    ],
    synthesis: '2H₂ (g) + O₂ (g) → 2H₂O (l) + 572 kJ (Exothermic Activation)',
    humanSignificance: 'The core biophysical fluid of life, regulating global biochemical cycles, cellular osmotic balance, and terrestrial climate matrices.',
    reactants: ['H', 'O']
  },
  {
    formula: 'NH₃',
    name: 'Trihydrogen Nitride (Ammonia)',
    class: 'Trigonal Pyramidal Gas',
    weight: '17.031 g/mol',
    geometry: 'Trigonal Pyramidal (107.8° Angle)',
    properties: [
      'High coordinate complexing base, readily coordinate with transition metals',
      'Strongly alkaline solution inside polar solvent matrices'
    ],
    synthesis: 'N₂ (g) + 3H₂ (g) ⇌ 2NH₃ (g) [Haber-Bosch Process: Catalyst, 450°C, 200 atm]',
    humanSignificance: 'The primary chemical precursor feeding humanity; supports global agricultural fertilizers, bio-synthetic pathways, and modern refrigeration.',
    reactants: ['N', 'H']
  },
  {
    formula: 'CH₄',
    name: 'Methane',
    class: 'Alkanes (Saturated Hydrocarbon)',
    weight: '16.04 g/mol',
    geometry: 'Symmetrical Tetrahedral (109.5° Angle)',
    properties: [
      'Highly flammable clean-burning planetary hydrocarbon',
      'Ultra-potent greenhouse gas absorbing infra-red bands 28x more than CO₂'
    ],
    synthesis: 'CO₂ (g) + 4H₂ (g) → CH₄ (g) + 2H₂O (g) [Sabatier Reaction]',
    humanSignificance: 'Primary constituent of natural gas fuel grids, major prebiotic carbon marker, and primary rocket fuel coolant in methalox engines.',
    reactants: ['C', 'H']
  },
  {
    formula: 'CO₂',
    name: 'Carbon Dioxide',
    class: 'Linear Double-Covalent Gas',
    weight: '44.009 g/mol',
    geometry: 'Linear Symmetrical (180° Angle)',
    properties: [
      'Complete non-polar linear gas due to symmetry dipole cancellation',
      'High phase equilibrium saturation inside oceans forming carbon buffer systems'
    ],
    synthesis: 'C (s) + O₂ (g) → CO₂ (g) [Enthalpy -393.5 kJ/mol]',
    humanSignificance: 'Atmospheric thermodynamic regulator. Binds through photosynthesis to forge the carbon backbones comprising all biomass.',
    reactants: ['C', 'O']
  },
  {
    formula: 'C₅H₅N₅O',
    name: 'Guanine (DNA Core Base Pair)',
    class: 'Purine Heterocyclic Amines',
    weight: '151.13 g/mol',
    geometry: 'Planar Conjugated Ring Matrix',
    properties: [
      'Forms a pristine three-hydrogen-bond network with Cytosine',
      'Conjugated ring structure absorbs UV-light shielding biological code'
    ],
    synthesis: 'Formed via enzymatic purine biosynthesis starting from phosphoribosyl pyrophosphate.',
    humanSignificance: 'A central alphabet character of all planetary life, coding for genomic reproduction, protein synthesis, and cellular computation.',
    reactants: ['C', 'H', 'N', 'O']
  },
  {
    formula: '(C₂H₄)n',
    name: 'Polyethylene (Macromolecular)',
    class: 'Thermoplastic Linear Polymer',
    weight: 'Variable (>100,000 g/mol)',
    geometry: 'Saturated Carbon-Carbon Backbone Chain',
    properties: [
      'Exceptional chemical resistance to acids and strong oxidizers',
      'Low mechanical friction coupled with extremely high tensile resilience'
    ],
    synthesis: 'n C₂H₄ (g) → -(CH₂-CH₂)-n [Coordination polymerization using Ziegler-Natta transition-metal catalysts]',
    humanSignificance: 'The foundational substance of modern synthetic material technology, wrapping electronics, storage, medical devices, and manufacturing.',
    reactants: ['C', 'H']
  }
];

const MATERIALS_LIBRARY: MaterialStructure[] = [
  {
    name: 'Austenitic Steel (Iron-Carbon Alloy)',
    composition: 'Fe (Base) with 0.1% C, 18% Cr, 8% Ni',
    bondingType: 'Metallic Cohesion with Interstitial Carbon Pinning',
    keyFeature: 'Extreme mechanical toughness with high anti-corrosion chrome oxidation limits',
    scientificContext: 'Crucial interstitial carbon atoms settle within octahedral cavities of Face-Centered Cubic (FCC) iron lattices, pinning dislocation movements.',
    humanImportance: 'Built the industrial age: sky-scrapers, deep-ocean container hulls, turbine shafts, and critical nuclear core containment arrays.',
    atomsRepresented: ['Fe', 'C', 'Cr', 'Ni']
  },
  {
    name: 'Superconducting YBCO',
    composition: 'Y₁Ba₂Cu₃O₇-x',
    bondingType: 'Mixed Ionic-Covalent Crystal Plane Matrix',
    keyFeature: 'Zero electrical resistance below 93 Kelvin (Liquid Nitrogen limit)',
    scientificContext: 'Exhibits high-Tc superconductivity driven by electrical charge movement of copper-oxygen planes, pairing Cooper electrons via spin fluctuations.',
    humanImportance: 'Enables high-tesla magnetic field generators, frictionless maglev trains, compact fusion reactor field magnets, and MRI diagnostics.',
    atomsRepresented: ['Y', 'Ba', 'Cu', 'O']
  },
  {
    name: 'Hexagonal Graphene Sheets',
    composition: '100% sp² Carbon Atoms',
    bondingType: 'Planar sp² Hybridization with Delocalized Pi-Bonds',
    keyFeature: 'Highest tensile limits registered in nature with near-infinite electron mobility',
    scientificContext: 'A single atomic layer of carbon arranged in a pristine 2D honeycomb lattice. Conducts electricity matching copper but with 200x structural strength.',
    humanImportance: 'Driving advanced nanotech, bio-sensors, micro-supercapacitors, space elevator filaments, and next-gen ballistic composite sheets.',
    atomsRepresented: ['C']
  },
  {
    name: 'Monocrystalline Doped Silicon',
    composition: '99.9999999% Si doped with B (P-type) or P (N-type) at parts-per-billion',
    bondingType: 'Perfect Covalent Diamond Cubic Lattice',
    keyFeature: 'Controllable semiconductor charge channel switching at megahertz limits',
    scientificContext: 'Doping introduces holes or free charge carriers to the pure covalent crystal, allowing voltage to shift the material between conductor and isolator.',
    humanImportance: 'The atomic backbone of modern silicon computation: millions of nanoscale transistors etched via ultraviolet laser photolithography.',
    atomsRepresented: ['Si', 'B', 'P']
  }
];

const CIVILIZATION_MAP: CivilizationPipeline[] = [
  {
    title: 'THE ENERGY PATHWAY (The Battery Age)',
    themeColor: '#00FFB3',
    steps: [
      { label: 'Raw Elements', sub: 'Li + Co + Ni + Mn', description: 'Highly electropositive alkaline metals and dense active transition metal crystals are refined from continental mineral ores.' },
      { label: 'Material Matrix', sub: 'NMC Layered Oxide Cathodes', description: 'Durable layered ceramic lattices are engineered to store and release lithium cations reversibly within interstitial gaps.' },
      { label: 'Technology', sub: 'Lithium-Ion Cells & Solid State Packs', description: 'Nanoscale polymer separators and non-aqueous ion gels facilitate ultra-fast rechargeable ion flow without dendrite shorting.' },
      { label: 'Civilization Impact', sub: 'Terrestrial Carbon-Free Electrification', description: 'Unlocks reliable grid energy reserves, global electric flight platforms, and autonomous zero-emission high-speed metropolitan centers.' }
    ],
    associatedElements: ['Li', 'Co', 'Ni', 'Mn']
  },
  {
    title: 'THE INFORMATION ARCHITECTURE (The Silicon Age)',
    themeColor: '#00E5FF',
    steps: [
      { label: 'Raw Elements', sub: 'Si + Ge + Ga + As', description: 'Ultra-pure metalloids and rare semiconductors are purified to nine-decimal atomic crystal perfection.' },
      { label: 'Material Matrix', sub: 'Ultrapure Epitaxial Silicon Wafers', description: 'Covalent matrices are layered with nanometer-thin gate oxide layers capable of maintaining quantum tunneling limits.' },
      { label: 'Technology', sub: 'Nanoscale FinFET Gate Transistors', description: 'Laser lithography etches billions of nanostructured electrostatic channels to toggle state registers synchronously.' },
      { label: 'Civilization Impact', sub: 'The Information Web & Emergent Artificial Intelligence', description: 'Spawns high-frequency global communication streams, supercomputing logic arrays, and sentient real-time digital minds.' }
    ],
    associatedElements: ['Si', 'Ge', 'Ga', 'As']
  },
  {
    title: 'THE CORE OF POWER (The Space & Reactor Age)',
    themeColor: '#FFD600',
    steps: [
      { label: 'Raw Elements', sub: 'U + Pu + Th + Zr', description: 'Unstable heavy actinides and high-melting-point refractory metals are refined and isotopically isolated.' },
      { label: 'Material Matrix', sub: 'Enriched Sintered Oxide Pellets (UO₂)', description: 'Sintered fuel matrices that sustain dense thermal nuclear fissions under continuous neutron irradiation.' },
      { label: 'Technology', sub: 'Pressurized Core Fission Reactors & RTGs', description: 'Control rod assemblies absorb runaway fluxes, turning atomic binding deficits into immense megawatt steam pressure.' },
      { label: 'Civilization Impact', sub: 'Interplanetary Stellar Explorations', description: 'Powers space thermonuclear engines, deep-probe radioactive generators, and localized grid energy output.' }
    ],
    associatedElements: ['U', 'Pu', 'Th', 'Zr']
  }
];

const COSMIC_CHRONOLOGY: NucleosynthesisEvent[] = [
  {
    title: 'Primordial Big Bang Nucleosynthesis',
    era: '10 to 20 Minutes post-creation',
    narrative: 'As the cooling primordial fire reduced to 1 Billion Kelvin, free protons and neutrons fused under titanic pressure. Matter was forged for the first time.',
    keyYields: '75% Hydrogen-1, 25% Helium-4, trace Deuterium and Lithium-7',
    densityTemp: 'Temp: 1.0 × 10^9 Kelvin | Density: ~0.1 kg/m³',
    cosmicPercentage: 'Over 99.8% of all atoms today trace their origin directly to this event.'
  },
  {
    title: 'Stellar Stellar Core Fusion',
    era: '10 Million Years to billions of years per Star',
    narrative: 'Gravity pulled gas clouds into thermonuclear cores. Under inward hydrostatic contraction, helium fused to carbon (Triple-Alpha), climbing the ladder of life-giving matter.',
    keyYields: 'Carbon, Nitrogen, Oxygen, Neon, Magnesium up to Iron (Fe)',
    densityTemp: 'Temp: 2.0 × 10^7 K to 3.5 × 10^9 K | Core Density: 10^5 to 10^9 kg/m³',
    cosmicPercentage: 'Synthesizes all biological carbon, oxygen, and structural iron.'
  },
  {
    title: 'Core-Collapse Supernova Shockwaves',
    era: '0.01 seconds during star detonation',
    narrative: 'Massive star cores collapse under gravity, triggering cataclysmic shockwaves. Titanic free-neutron fluxes activate r-process and s-process nucleosynthesis.',
    keyYields: 'Zinc up to Iodine, Krypton, Silver, Xenon and radioactive isotopes',
    densityTemp: 'Temp: > 10^10 Kelvin | Peak Neutron Density: ~10^20 neutrons/cm³',
    cosmicPercentage: 'Forges heavy chemical catalysts, precious metals, and halogens.'
  },
  {
    title: 'Neutron Star Mergers (Kilonovae)',
    era: 'Instantaneous relativistic collision',
    narrative: 'Relativistic binary neutron stars undergo extreme orbital decay, colliding to unleash space-time gravitational waves and massive decompressing neutron fluids.',
    keyYields: 'Gold, Platinum, Uranium, Thorium, Lead and heavy Actinides',
    densityTemp: 'Temp: 10^11 Kelvin | Neutron Density: Super-Nuclear limits ~10^33 cm³',
    cosmicPercentage: 'Generates virtually all the Universe’s gold and fissile actinides.'
  },
  {
    title: 'Planetogenesis Accretion Limits',
    era: '100 Million Years post Star Birth',
    narrative: 'Protostellar disks cool. Grains collide to forge planetesimals, stratifying heavy metallic iron deep inside magma cores and light silicates on structural planetary crusts.',
    keyYields: 'Differentiated mineral lattices, igneous basalt silicate rocks, surface atmospheres',
    densityTemp: 'Surface Temp: variable (200 - 1500 K) | Core Temp: ~6000 K',
    cosmicPercentage: 'Lays the geodynamic stage for liquid water, geochemistry, and life.'
  },
  {
    title: 'Chemical Life & Cognition',
    era: '3.8 Billion Years ago to Today',
    narrative: 'Planetary geothermal vents combine carbon, dihydrogen oxide, and trace elements, forming organic sequences. Matter coordinates self-replicating logic, eventually gaining civilization self-awareness.',
    keyYields: 'Peptides, Nucleic Acids, DNA computational codes, intelligent cities',
    densityTemp: 'Standard Temperature & Pressure (298 K, 1 atm)',
    cosmicPercentage: 'The dynamic universe achieves conscious self-reflection of its own atoms.'
  }
];

export default React.memo(function ExplorerHub({ onSelectElementBySymbol, onScaleChange }: ExplorerHubProps) {
  const [obsTab, setObsTab] = useState<'scale' | 'compounds' | 'materials' | 'civilization' | 'cosmic' | 'engine'>('scale');
  
  // Interactive nodes tracking states
  const [activeScaleNode, setActiveScaleNode] = useState<string>('universe');
  const [activeCompoundId, setActiveCompoundId] = useState<string>('H₂O');
  const [activeMaterialName, setActiveMaterialName] = useState<string>('Austenitic Steel (Iron-Carbon Alloy)');
  const [activeCivilizationIdx, setActiveCivilizationIdx] = useState<number>(0);
  const [activeCosmicIdx, setActiveCosmicIdx] = useState<number>(0);

  // Orbitium Knowledge Brain Workspace states
  const [engineSelectedSymbol, setEngineSelectedSymbol] = useState<string>('H');
  const [reactants, setReactants] = useState<{ a: string; b: string }>({ a: 'Na', b: 'Cl' });
  const [copiedState, setCopiedState] = useState<boolean>(false);
  const [diagLog, setDiagLog] = useState<any>(null);

  const selectedNode = SCALE_NODES.find(n => n.id === activeScaleNode) || SCALE_NODES[0];
  const selectedCompound = COMPOUNDS_LIBRARY.find(c => c.formula === activeCompoundId) || COMPOUNDS_LIBRARY[0];
  const selectedMaterial = MATERIALS_LIBRARY.find(m => m.name === activeMaterialName) || MATERIALS_LIBRARY[0];
  const selectedPipeline = CIVILIZATION_MAP[activeCivilizationIdx];
  const selectedCosmicEvent = COSMIC_CHRONOLOGY[activeCosmicIdx];

  const handleScaleNodeClick = (nodeId: string) => {
    setActiveScaleNode(nodeId);
    if (onScaleChange) {
      onScaleChange(nodeId);
    }
  };

  return (
    <div className="w-full text-[#EAF2FF] animate-fade-in flex flex-col gap-4 font-mono select-none h-full max-h-[82vh]">
      
      {/* 1. OBS SUBSYSTEM INTERNAL BAR */}
      <div className="flex border-b border-white/10 pb-2 flex-wrap gap-1 items-center justify-between">
        <div className="flex gap-1 items-center">
          <Orbit className="w-4 h-4 text-[#00E5FF] animate-spin-slow-30" />
          <span className="text-[10px] font-black tracking-wider text-white uppercase">ORBITIUM_EXPLORER.SYS</span>
        </div>
        
        <div className="flex bg-[#0A0D1B]/95 gap-0.5 border border-white/5 rounded p-0.5 max-w-full overflow-x-auto scrollbar-none">
          {[
            { id: 'scale', label: 'Reality Scale', icon: Compass },
            { id: 'compounds', label: 'Compounds', icon: Database },
            { id: 'materials', label: 'Materials', icon: Cpu },
            { id: 'civilization', label: 'Civilization', icon: GitMerge },
            { id: 'cosmic', label: 'Cosmic Origins', icon: Sparkles },
            { id: 'engine', label: 'Knowledge Brain', icon: Cpu }
          ].map((t) => {
            const Icon = t.icon;
            const isTabActive = obsTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setObsTab(t.id as any)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-[8.5px] uppercase tracking-wide font-extrabold rounded-sm border transition-all duration-200 cursor-pointer ${
                  isTabActive
                    ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/40 shadow-[0_0_8px_rgba(0,229,255,0.15)] font-black'
                    : 'bg-transparent text-white/50 border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. DYNAMIC WORKSPACE PANEL SCREEN */}
      <div className="flex-1 overflow-y-auto max-h-[70vh] flex flex-col gap-4 pr-1 scrollbar-none">
        
        {/* =======================================================
            TAB A: THE SCALE OF REALITY SYSTEM
            ======================================================= */}
        {obsTab === 'scale' && (
          <div className="animate-fade-in flex flex-col gap-3">
            
            {/* Linear Cascading Scale Track Map */}
            <div className="flex gap-1 items-center bg-black/45 border border-white/5 p-2 rounded max-w-full overflow-x-auto scrollbar-none font-mono">
              {SCALE_NODES.map((node, i) => {
                const isActive = node.id === activeScaleNode;
                return (
                  <React.Fragment key={node.id}>
                    <button
                      onClick={() => handleScaleNodeClick(node.id)}
                      className={`px-2.5 py-1.5 rounded text-[8px] tracking-wider uppercase flex flex-col items-center gap-0.5 font-bold transition-all border shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-white shadow-[0_0_10px_rgba(0,229,255,0.2)] font-black scale-[1.03]'
                          : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:text-white/70'
                      }`}
                    >
                      <span className="text-[6.5px] text-white/40">{node.exponent}</span>
                      <span>{node.name.split(' ')[0]}</span>
                    </button>
                    {i < SCALE_NODES.length - 1 && (
                      <ChevronRight className="w-3 h-3 text-[#00E5FF]/30 shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Selected Scale Detail Visual Board */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-1">
              <div className="md:col-span-7 flex flex-col gap-3 bg-[#0B1021]/80 border border-white/10 p-3.5 rounded">
                <div className="flex justify-between items-start border-b border-white/5 pb-2">
                  <div>
                    <span className="text-[7.5px] uppercase tracking-widest text-[#00E5FF] font-black">ACTIVE SCALE DEPTH</span>
                    <h3 className="text-sm font-black text-white mt-0.5 uppercase tracking-wide">{selectedNode.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] bg-[#00E5FF]/10 text-[#00E5FF] px-1.5 py-0.5 rounded border border-[#00E5FF]/20 font-black">{selectedNode.exponent}</span>
                    <div className="text-[7.5px] text-white/45 mt-1 font-bold">{selectedNode.metric}</div>
                  </div>
                </div>

                <div className="p-3 bg-white/[0.02] border border-white/5 rounded text-[10px] text-white/80 leading-relaxed font-sans font-light text-justify">
                  {selectedNode.description}
                </div>

                <div className="flex flex-col gap-1.5 text-[9px] bg-black/45 p-2 rounded border border-white/5">
                  <span className="text-[7.5px] text-white/30 uppercase font-black tracking-widest">DOMINANT GAUGE FORCE:</span>
                  <span className="text-[#00FFB3] font-bold text-[9.5px] tracking-wide">{selectedNode.interaction}</span>
                </div>

                {/* Symmetrical dynamic telemetry stats */}
                <div className="grid grid-cols-3 gap-2">
                  {selectedNode.details.map((det, idx) => (
                    <div key={idx} className="p-2 bg-[#050812] border border-white/5 rounded text-center">
                      <span className="block text-[6.5px] text-white/30 font-medium uppercase tracking-wider">{det.label}</span>
                      <span className="text-[9.5px] font-black text-white/90 block mt-0.5 truncate">{det.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar trigger connections to Elements */}
              <div className="md:col-span-5 flex flex-col gap-3 bg-[#080C17] border border-white/5 p-3 rounded">
                <span className="text-[8px] text-[#7C4DFF] font-extrabold tracking-widest block uppercase">CRITICAL SYSTEM ELEMENTS //</span>
                <p className="text-[8.5px] text-white/50 leading-relaxed font-sans font-light">
                  This cosmological scale directly regulates and stabilizes the quantum/macro lattice potentials of these key active elements:
                </p>

                <div className="flex flex-col gap-2 mt-1.5">
                  {selectedNode.associatedSymbols.map((sym) => (
                    <button
                      key={sym}
                      onClick={() => onSelectElementBySymbol(sym)}
                      className="p-2 bg-gradient-to-r from-white/[0.02] to-transparent border border-white/5 hover:border-[#00E5FF] hover:from-[#00E5FF]/5 rounded flex items-center justify-between text-left cursor-pointer hover:shadow-[0_0_8px_rgba(0,229,255,0.1)] transition-all duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-sm bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center font-extrabold text-[10px] border border-[#00E5FF]/20">{sym}</span>
                        <div className="font-mono text-[9px] font-bold">
                          {sym === 'H' && 'Hydrogen'}
                          {sym === 'He' && 'Helium'}
                          {sym === 'Li' && 'Lithium'}
                          {sym === 'C' && 'Carbon'}
                          {sym === 'O' && 'Oxygen'}
                          {sym === 'Ne' && 'Neon'}
                          {sym === 'Si' && 'Silicon'}
                          {sym === 'Fe' && 'Iron'}
                          {sym === 'Ni' && 'Nickel'}
                          {sym === 'Cu' && 'Copper'}
                          {sym === 'Au' && 'Gold'}
                          {sym === 'Ag' && 'Silver'}
                          {sym === 'Al' && 'Aluminum'}
                          {sym === 'Ti' && 'Titanium'}
                          {sym === 'Pt' && 'Platinum'}
                          {sym === 'Mg' && 'Magnesium'}
                          {sym === 'U' && 'Uranium'}
                          {sym === 'Pb' && 'Lead'}
                          {sym === 'Th' && 'Thorium'}
                          {sym === 'Ra' && 'Radium'}
                          {sym === 'Pu' && 'Plutonium'}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#00E5FF]/40" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================
            TAB B: THE COMPOUND UNIVERSE
            ======================================================= */}
        {obsTab === 'compounds' && (
          <div className="animate-fade-in flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              
              {/* Left Selector List */}
              <div className="md:col-span-4 flex flex-col gap-1.5 max-h-[50vh] overflow-y-auto scrollbar-none bg-[#050811] p-2 rounded border border-white/5">
                <span className="text-[8px] text-white/30 tracking-widest block uppercase font-black px-1.5 py-1">COMPOUNDS REGISTRY</span>
                {COMPOUNDS_LIBRARY.map((comp) => {
                  const isActive = comp.formula === activeCompoundId;
                  return (
                    <button
                      key={comp.formula}
                      onClick={() => setActiveCompoundId(comp.formula)}
                      className={`p-2.5 rounded text-left border flex flex-col gap-1 transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#00FFB3]/10 border-[#00FFB3] text-white'
                          : 'bg-white/[0.01] border-white/5 text-white/50 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-[10.5px] font-mono tracking-wide">{comp.formula}</span>
                        <span className={`text-[7px] font-black uppercase px-1 rounded-sm ${isActive ? 'bg-[#00FFB3]/20 text-[#00FFB3]' : 'bg-white/5 text-white/40'}`}>{comp.class.split(' ')[0]}</span>
                      </div>
                      <span className="text-[8.5px] truncate block opacity-85 font-sans font-light">{comp.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right Compound Detail Screen */}
              <div className="md:col-span-8 flex flex-col gap-3 bg-[#080C17] border border-white/10 p-4 rounded text-[9.5px]">
                <div className="flex justify-between items-start border-b border-white/5 pb-2.5">
                  <div>
                    <span className="text-[7.5px] text-[#00FFB3] uppercase tracking-widest font-black block">REACTION COUPLING VECTOR</span>
                    <h3 className="text-sm font-black text-white mt-1 font-mono tracking-wider">{selectedCompound.name} ({selectedCompound.formula})</h3>
                    <span className="text-[8.5px] text-white/45 mt-0.5 block italic">{selectedCompound.class}</span>
                  </div>
                  <div className="text-right flex flex-col gap-1">
                    <span className="text-[8px] bg-white/5 px-1.5 py-0.5 border border-white/5 rounded text-white/80 font-black">{selectedCompound.weight}</span>
                    <span className="text-[7.5px] text-white/40 font-semibold">{selectedCompound.geometry}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[7.5px] text-amber-400 font-extrabold uppercase tracking-widest block">STRUCTURAL CHARACTERISTICS & FLUX:</span>
                  <div className="grid grid-cols-1 gap-1">
                    {selectedCompound.properties.map((prop, index) => (
                      <div key={index} className="p-2 bg-black/40 border border-white/5 rounded flex gap-2 items-start font-sans leading-relaxed text-[#EAF2FF]/80 font-light">
                        <span className="text-[#00FFB3] font-bold font-mono text-[9px] mt-0.5 flex shrink-0">✔</span>
                        <p className="text-[9px]">{prop}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 bg-[#00FFB3]/5 border border-[#00FFB3]/20 rounded flex flex-col gap-1 font-mono">
                  <span className="text-[7px] tracking-widest text-[#00FFB3] font-black uppercase">CHEMICAL SYNTHESIS MATRIX:</span>
                  <div className="text-[10px] font-black text-white p-1 bg-black/40 border border-white/5 rounded mb-1 text-center select-all">{selectedCompound.synthesis}</div>
                  <p className="text-[8.5px] font-sans font-light text-white/70 leading-normal">{selectedCompound.humanSignificance}</p>
                </div>

                {/* Reactants traversal nodes */}
                <div className="flex items-center gap-2 border-t border-white/5 pt-2 flex-wrap">
                  <span className="text-[7.5px] text-white/40 font-bold uppercase">Reactant Cores:</span>
                  {selectedCompound.reactants.map(sym => (
                    <button
                      key={sym}
                      onClick={() => onSelectElementBySymbol(sym)}
                      className="px-2 py-0.5 bg-white/5 hover:bg-[#00FFB3]/10 border border-white/10 hover:border-[#00FFB3] rounded font-black text-[9px] text-[#00FFB3] tracking-wider cursor-pointer transition-all duration-200"
                    >
                      {sym}
                    </button>
                  ))}
                </div>

              </div>

            </div>
          </div>
        )}

        {/* =======================================================
            TAB C: THE MATERIALS LIBRARY
            ======================================================= */}
        {obsTab === 'materials' && (
          <div className="animate-fade-in flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              
              {/* Left Materials selector */}
              <div className="md:col-span-5 flex flex-col gap-2 max-h-[50vh] overflow-y-auto scrollbar-none bg-[#050811] p-2 rounded border border-white/5">
                <span className="text-[8px] text-white/30 tracking-widest block uppercase font-black px-1 py-1">MATERIALS SCIENCE SUITE</span>
                {MATERIALS_LIBRARY.map((mat) => {
                  const isActive = mat.name === activeMaterialName;
                  return (
                    <button
                      key={mat.name}
                      onClick={() => setActiveMaterialName(mat.name)}
                      className={`p-2.5 rounded text-left border flex flex-col gap-1 transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'border-[#FF80AB] bg-[#FF80AB]/10 text-white'
                          : 'bg-white/[0.01] border-white/5 text-white/50 hover:border-white/20'
                      }`}
                    >
                      <div className="font-extrabold text-[9.5px] leading-tight flex justify-between items-start gap-2">
                        <span>{mat.name.split(' (')[0]}</span>
                        <span className={`text-[6.5px] shrink-0 font-bold uppercase px-1 rounded-sm ${isActive ? 'bg-[#FF80AB]/20 text-[#FF80AB]' : 'bg-white/5 text-white/40'}`}>{mat.bondingType.split(' ')[0]}</span>
                      </div>
                      <span className="text-[8px] truncate font-sans font-light text-[#EAF2FF]/70 block">{mat.keyFeature}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right material info panel */}
              <div className="md:col-span-7 flex flex-col gap-3 bg-[#080C17] border border-white/10 p-4 rounded text-[9.5px]">
                <div className="border-b border-white/5 pb-2.5">
                  <span className="text-[7.5px] text-[#FF80AB] font-black uppercase tracking-widest block">MACROSCOPIC ENTHALPY CONFIG</span>
                  <h3 className="text-sm font-black text-white mt-1">{selectedMaterial.name}</h3>
                  <div className="text-[8.5px] text-white/50 font-semibold mt-1">Composition: <strong className="text-white">{selectedMaterial.composition}</strong></div>
                </div>

                <div className="p-3 bg-[#FF80AB]/5 border border-[#FF80AB]/20 rounded flex flex-col gap-1 text-[9px] leading-relaxed">
                  <span className="font-mono text-[7px] font-black uppercase tracking-wider text-[#FF80AB]">CRYSTALLINE STRUCTURAL MATRIX</span>
                  <p className="font-sans font-light text-white/80 text-justify italic">
                    "{selectedMaterial.scientificContext}"
                  </p>
                </div>

                <div className="p-2.5 bg-black/40 border border-white/5 rounded flex flex-col gap-1 font-sans">
                  <span className="font-mono text-[7px] text-white/30 uppercase font-black block">CIVILIZATIONAL CAPABILITY POTENTIAL</span>
                  <p className="text-[9px] text-[#EAF2FF]/80 leading-relaxed font-light text-justify">{selectedMaterial.humanImportance}</p>
                </div>

                <div className="flex justify-between items-center border-t border-white/5 pt-2 text-[8.5px] mt-1 flex-wrap gap-2 font-mono">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="text-white/40 uppercase text-[7.5px]">Crystal Atom Cores:</span>
                    {selectedMaterial.atomsRepresented.map(symbol => (
                      <button
                        key={symbol}
                        onClick={() => onSelectElementBySymbol(symbol)}
                        className="px-1.5 py-0.5 bg-white/5 hover:bg-[#FF80AB]/10 border border-white/10 hover:border-[#FF80AB] rounded font-black text-[#FF80AB] text-[8.5px] cursor-pointer"
                      >
                        {symbol}
                      </button>
                    ))}
                  </div>
                  <div className="text-white/40 font-bold uppercase text-[7px] tracking-widest">MAT_MATRIC.COMPILE</div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* =======================================================
            TAB D: THE CIVILIZATION MAP
            ======================================================= */}
        {obsTab === 'civilization' && (
          <div className="animate-fade-in flex flex-col gap-3">
            {/* Top selectors for Civilization pipelines */}
            <div className="grid grid-cols-3 gap-2">
              {CIVILIZATION_MAP.map((pipe, idx) => {
                const isActive = activeCivilizationIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveCivilizationIdx(idx)}
                    className={`p-2.5 rounded border text-center transition-all duration-300 font-bold cursor-pointer relative ${
                      isActive
                        ? 'bg-white/5 text-white'
                        : 'bg-black/40 border-white/5 text-[#EAF2FF]/40 hover:text-white'
                    }`}
                    style={isActive ? { borderColor: pipe.themeColor, boxShadow: `0 0 10px ${pipe.themeColor}1a` } : {}}
                  >
                    <span 
                      className="text-[7.5px] block font-black uppercase tracking-wider mb-0.5"
                      style={{ color: isActive ? pipe.themeColor : '#666' }}
                    >
                      PIPELINE 0{idx + 1}
                    </span>
                    <span className="text-[8.5px] font-mono block tracking-wide truncate">{pipe.title.split(' (')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Render Horizontal/Vertical Cascade Pipeline Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 bg-black/45 border border-white/10 p-3 rounded mt-1.5 min-h-[220px]">
              {selectedPipeline.steps.map((step, idx) => {
                return (
                  <div 
                    key={idx} 
                    className="relative flex flex-col justify-between p-3.5 bg-[#050812]/95 border border-white/5 hover:border-white/15 rounded flex-1 group transition-all duration-200"
                  >
                    
                    {/* Visual pipeline arrow connectors */}
                    {idx < 3 && (
                      <div className="hidden md:block absolute right-[-8px] top-1/2 -translate-y-1/2 z-10">
                        <ArrowRight className="w-3.5 h-3.5" style={{ color: selectedPipeline.themeColor }} />
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5 text-[9.5px]">
                      <div className="flex justify-between items-start border-b border-white/5 pb-1">
                        <span className="text-[6.5px] font-black uppercase tracking-wider font-mono px-1 py-0.2 rounded" style={{ backgroundColor: `${selectedPipeline.themeColor}22`, color: selectedPipeline.themeColor }}>
                          STEP 0{idx + 1}
                        </span>
                        <span className="text-[8px] font-bold text-white/50">{step.sub}</span>
                      </div>
                      <h4 className="text-[10px] font-black text-white mt-0.5">{step.label}</h4>
                      <p className="text-[8.5px] text-white/70 font-sans leading-relaxed text-justify font-light">{step.description}</p>
                    </div>

                    {idx === 0 && (
                      <div className="mt-3 flex gap-1 flex-wrap border-t border-white/5 pt-2">
                        {selectedPipeline.associatedElements.map(sym => (
                          <button
                            key={sym}
                            onClick={() => onSelectElementBySymbol(sym)}
                            className="text-[8px] font-black bg-white/5 border border-white/10 px-1.5 py-0.2 rounded hover:border-[#00FFB3] hover:text-[#00FFB3] duration-200 cursor-pointer"
                          >
                            {sym}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =======================================================
            TAB E: THE COSMIC CHEMISTRY ENGINE
            ======================================================= */}
        {obsTab === 'cosmic' && (
          <div className="animate-fade-in flex flex-col gap-3">
            {/* Horizontal chronology events map */}
            <div className="flex gap-1.5 items-center max-w-full overflow-x-auto scrollbar-none p-1.5 bg-black/45 rounded border border-white/5 font-mono select-none">
              {COSMIC_CHRONOLOGY.map((evt, idx) => {
                const isActive = activeCosmicIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveCosmicIdx(idx)}
                    className={`px-3 py-1.5 border hover:border-white/30 rounded text-left shrink-0 max-w-[200px] transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#7C4DFF]/15 border-[#7C4DFF] text-white shadow-[0_0_10px_rgba(124,77,255,0.2)]'
                        : 'bg-white/5 border-transparent text-white/45 hover:text-white/80'
                    }`}
                  >
                    <div className="text-[6.5px] font-black uppercase text-white/30 tracking-widest block mb-0.5">EPOCH 0{idx + 1}</div>
                    <span className="text-[9px] font-extrabold tracking-wide truncate block">{evt.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Active cosmic event visualization details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-1bg-[#090C18] border border-white/10 p-4.5 rounded">
              <div className="md:col-span-8 flex flex-col gap-3 bg-gradient-to-r from-white/[0.015] to-transparent p-4 rounded border border-white/5">
                <div className="border-b border-white/5 pb-2.5 flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <span className="text-[7px] uppercase tracking-widest font-black text-[#7C4DFF]">NUCLEOSYNTHETIC CHRONOPATH</span>
                    <h3 className="text-sm font-black text-white mt-1 uppercase tracking-wide">{selectedCosmicEvent.title}</h3>
                    <span className="text-[7.5px] text-[#00FFB3] tracking-widest uppercase font-bold font-mono mt-0.5 block">{selectedCosmicEvent.era}</span>
                  </div>
                </div>

                <div className="p-3 bg-black/30 border border-white/5 rounded text-[10px] text-[#EAF2FF]/85 text-justify italic leading-relaxed font-sans font-light">
                  "{selectedCosmicEvent.narrative}"
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[8.5px] mt-1">
                  <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded">
                    <span className="text-[6.5px] text-white/30 uppercase font-black block mb-0.5">THERMODYNAMIC CRITICAL PROFILE</span>
                    <strong className="text-[#00E5FF] font-bold text-[9px] font-mono block truncate">{selectedCosmicEvent.densityTemp}</strong>
                  </div>
                  <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded">
                    <span className="text-[6.5px] text-white/30 uppercase font-black block mb-0.5">ELEMENT MASS CONVERGENCE</span>
                    <strong className="text-white font-bold text-[9px] font-mono block truncate">{selectedCosmicEvent.keyYields}</strong>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col gap-3 bg-black/55 border border-white/5 p-4 rounded text-center justify-center min-h-[220px]">
                <span className="text-[6.5px] text-white/30 uppercase tracking-widest font-black block">COSMIC SEED ABUNDANCE RATIO</span>
                
                <div className="w-14 h-14 rounded-full border-r border-[#7C4DFF] border-t border-[#00E5FF] border-b border-[#00FFB3] mx-auto animate-spin flex items-center justify-center text-white/20 select-none" style={{ animationDuration: '30s' }}>
                  <Sparkles className="w-4.5 h-4.5 text-[#7C4DFF]/50" />
                </div>

                <div className="text-[9px] leading-relaxed text-[#EAF2FF]/80 font-sans font-light text-justify mt-2 p-2 bg-white/[0.01] border border-white/5 rounded">
                  <span className="text-[#7C4DFF] font-bold tracking-wider uppercase font-mono block text-center text-[7.5px] mb-1">COSMIC CONSEQUENCE</span>
                  {selectedCosmicEvent.cosmicPercentage}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =======================================================
            TAB F: ORBITIUM KNOWLEDGE ENGINE V1 INTERACTIVE WORKSPACE
            ======================================================= */}
        {obsTab === 'engine' && (() => {
          const flagshipElements = OrbitiumKnowledgeEngine.getFlagshipElements();
          const selectedElement = OrbitiumKnowledgeEngine.getElementBySymbol(engineSelectedSymbol) || flagshipElements[0];
          const calculatedReaction = OrbitiumKnowledgeEngine.synthesizeReaction([reactants.a, reactants.b]);
          const diagnostics = diagLog || OrbitiumKnowledgeEngine.runDiagnostics();

          const copyAIContext = async () => {
            const text = OrbitiumKnowledgeEngine.generateAIScientificPrompt(selectedElement.symbol);
            try {
              await navigator.clipboard.writeText(text);
              setCopiedState(true);
              setTimeout(() => setCopiedState(false), 2000);
            } catch (err) {
              console.error('Failed to copy text: ', err);
            }
          };

          const handleRunDiagnostics = () => {
            const result = OrbitiumKnowledgeEngine.runDiagnostics();
            setDiagLog(result);
          };

          return (
            <div className="animate-fade-in flex flex-col gap-4">
              
              {/* Core Title Banner */}
              <div className="flex justify-between items-center bg-[#070B14]/80 border border-white/5 p-3 rounded">
                <div>
                  <span className="text-[7px] uppercase tracking-widest font-black text-[#00E5FF]">CENTRAL PROCESSING CORE</span>
                  <h3 className="text-sm font-black text-white uppercase tracking-wide">Orbitium Knowledge Engine (OKE) V1</h3>
                  <p className="text-[8.5px] text-white/50 mt-0.5 leading-relaxed font-sans font-light">
                    The active semantic, quantum, and thermodynamic model serving as the analytical central brain of the Orbitium ecosystem.
                  </p>
                </div>
                <div>
                  <button 
                    onClick={handleRunDiagnostics}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[8.5px] font-black uppercase tracking-wider bg-[#00FFB3]/10 hover:bg-[#00FFB3]/25 text-[#00FFB3] border border-[#00FFB3]/35 rounded cursor-pointer transition-all duration-250 shadow-[0_0_8px_rgba(0,255,179,0.1)]"
                  >
                    <Activity className="w-3 h-3 animate-pulse" />
                    <span>Run Verification</span>
                  </button>
                </div>
              </div>

              {/* Grid 1: Diagnostics Console & Flagship Elements Selection */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                
                {/* Visual Scientific Verification Console */}
                <div className="md:col-span-7 flex flex-col gap-2.5 bg-[#0B1021]/80 border border-white/10 p-3.5 rounded text-left">
                  <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                    <span className="text-[8px] uppercase tracking-widest font-black text-[#00FFB3]">QUANTUM MODEL DIAGNOSTICS</span>
                    <span className="text-[7.5px] text-white/40 font-mono font-bold">DATABASE HEALTH: <span className="text-[#00FFB3] font-extrabold">{diagnostics.passed ? "NOMINAL" : "SKEW_DETECTED"}</span></span>
                  </div>

                  {/* Core Diagnostic Stats bar */}
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    <div className="bg-black/30 p-1 rounded border border-white/5">
                      <span className="text-[6px] text-white/40 block leading-none">TOTAL RECORDS</span>
                      <strong className="text-xs font-black text-white font-mono">{diagnostics.elementCount}</strong>
                    </div>
                    <div className="bg-black/30 p-1 rounded border border-white/5">
                      <span className="text-[6px] text-white/40 block leading-none">GASEOUS PHASE</span>
                      <strong className="text-xs font-black text-[#00E5FF] font-mono">{diagnostics.generalStats.gasCount}</strong>
                    </div>
                    <div className="bg-black/30 p-1 rounded border border-white/5">
                      <span className="text-[6px] text-white/40 block leading-none">METALLIC SOLIDS</span>
                      <strong className="text-xs font-black text-[#8D99AE] font-mono">{diagnostics.generalStats.solidCount}</strong>
                    </div>
                    <div className="bg-black/30 p-1 rounded border border-white/5">
                      <span className="text-[6px] text-white/40 block leading-none">SYNTHETICS</span>
                      <strong className="text-xs font-black text-[#39FF14] font-mono">{diagnostics.generalStats.syntheticCount}</strong>
                    </div>
                  </div>

                  {/* Programmatic checks console logs scroll area */}
                  <div className="flex-1 bg-black/55 border border-white/5 rounded p-2.5 font-mono text-[8px] flex flex-col gap-1.5 overflow-y-auto max-h-[145px] scrollbar-thin">
                    <div className="text-white/30 border-b border-white/5 pb-1 mb-1 block uppercase font-bold">Scientific Verification Pipeline Trace:</div>
                    {diagnostics.flagshipResults.map((res: any, idx: number) => (
                      <div key={res.symbol} className="flex justify-between items-start border-b border-white/[0.02] pb-1">
                        <div>
                          <span className="text-white font-bold">[{res.symbol}] {res.name}</span>
                          <div className="text-[7.5px] text-white/45 mt-0.5">
                            Valence Outer: <span className="text-white/80">{res.metrics.calculatedValence}</span> | Electronegativity: <span className="text-white/80">{res.metrics.electronegativity || 'N/A'}</span>
                          </div>
                          {res.warnings.map((w: string, i: number) => (
                            <div key={i} className="text-[#FF9100] text-[6.5px] mt-0.5 font-sans leading-none">▲ WARNING: {w}</div>
                          ))}
                          {res.errors.map((e: string, i: number) => (
                            <div key={i} className="text-[#FF1744] text-[6.5px] mt-0.5 font-sans leading-none">✖ CRITICAL: {e}</div>
                          ))}
                        </div>
                        <div className="flex items-center gap-1 shrink-0 mt-0.5">
                          <span className="text-[6.5px] text-white/35 font-mono">
                            {res.metrics.shellMatch ? 'SHELLS:OK' : 'SHELLS:FAIL'}
                          </span>
                          {res.valid ? (
                            <CheckCircle className="w-3 h-3 text-[#00FFB3]" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 text-[#FF1744]" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flagship Elements Detail Cards Selection */}
                <div className="md:col-span-4 flex flex-col gap-2.5 bg-[#0B1021]/80 border border-white/10 p-3.5 rounded text-left">
                  <span className="text-[8px] uppercase tracking-widest font-black text-[#7C4DFF] border-b border-white/5 pb-1 font-bold">FLAGSHIP SCIENTIFIC MODELS</span>
                  
                  {/* Horizontally scrolling quick-select bar of 10 Flagships */}
                  <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                    {flagshipElements.map((el) => {
                      const isActive = el.symbol === engineSelectedSymbol;
                      return (
                        <button
                          key={el.symbol}
                          onClick={() => {
                            setEngineSelectedSymbol(el.symbol);
                            setCopiedState(false);
                          }}
                          className={`px-2 py-1 text-[8.5px] font-black rounded border cursor-pointer transition-all shrink-0 ${
                            isActive
                              ? 'bg-[#7C4DFF]/15 border-[#7C4DFF] text-white shadow-[0_0_8px_rgba(124,77,255,0.2)] font-black'
                              : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
                          }`}
                        >
                          {el.symbol}
                        </button>
                      );
                    })}
                  </div>

                  {/* Flagship quick metadata spec card */}
                  <div className="flex-1 bg-black/45 rounded p-2.5 border border-white/5 flex flex-col justify-between text-[9px] min-h-[145px]">
                    <div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-1 mb-1.5">
                        <strong className="text-[#7C4DFF] font-black uppercase text-[10px] tracking-wide font-bold">{selectedElement.name} (Z={selectedElement.number})</strong>
                        <span className="text-[7.5px] font-mono text-white/50 bg-white/5 px-1 py-0.5 rounded tracking-widest">{selectedElement.coreIdentity?.block.toUpperCase()}-BLOCK</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono text-white/70">
                        <div>Mass: <span className="text-white font-bold">{selectedElement.mass.toFixed(4)} u</span></div>
                        <div>STP state: <span className="text-[#39FF14] font-bold">{selectedElement.coreIdentity?.stateAtSTP}</span></div>
                        <div>Density: <span className="text-white/90">{selectedElement.physicalProperties?.density}</span></div>
                        <div>Config: <span className="text-[#00E5FF] font-bold text-[8.5px]">{selectedElement.atomicArchitecture?.electronConfig}</span></div>
                        <div className="col-span-2 text-white/60 line-clamp-2 italic font-sans leading-relaxed text-[8.5px] mt-1">
                          "{selectedElement.coreIdentity?.summary}"
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={copyAIContext}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1 text-[8px] uppercase font-bold rounded border transition-all cursor-pointer ${
                          copiedState
                            ? 'bg-[#00FFB3]/10 border-[#00FFB3]/40 text-[#00FFB3]'
                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedState ? 'Copied AI Pack!' : 'Copy AI Prompt Pack'}</span>
                      </button>
                      <button
                        onClick={() => onSelectElementBySymbol(selectedElement.symbol)}
                        className="flex items-center gap-1 px-2.5 py-1 text-[8px] uppercase font-bold bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 rounded cursor-pointer transition-all"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Explore Depth</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* Section 2: Active Reaction Synthesizer Sandbox */}
              <div className="bg-[#0B1021]/80 border border-white/10 p-3.5 rounded text-left">
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-2.5">
                  <div className="flex gap-1.5 items-center">
                    <Beaker className="w-4 h-4 text-[#FFD600]" />
                    <span className="text-[8px] uppercase tracking-widest font-black text-[#FFD600] font-bold">ACTIVE MOLECULAR BOND SYNTHESIZER</span>
                  </div>
                  <span className="text-[7px] text-white/40 tracking-wider font-bold">REAL-TIME KINETIC ALIGNER</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                  
                  {/* Select Reactants Controls */}
                  <div className="md:col-span-4 flex flex-col gap-2 bg-black/45 border border-white/5 p-3 rounded">
                    <span className="text-[7.5px] text-white/40 uppercase block font-black">CHOOSE CHEMICAL REACTANTS:</span>
                    
                    {/* Reactant A Selection */}
                    <div className="flex flex-col gap-1 mt-1">
                      <label className="text-[6.5px] text-white/30 uppercase font-black">REACTANT ALPHA (A)</label>
                      <select
                        value={reactants.a}
                        onChange={(e) => setReactants(prev => ({ ...prev, a: e.target.value }))}
                        className="bg-[#0A0E1A] text-white text-[9px] font-mono border border-white/10 rounded px-2 py-1 focus:outline-none focus:border-[#FFD600] cursor-pointer"
                      >
                        {flagshipElements.map(el => (
                          <option key={`a-${el.symbol}`} value={el.symbol}>[{el.symbol}] {el.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Reactant B Selection */}
                    <div className="flex flex-col gap-1 mt-1">
                      <label className="text-[6.5px] text-white/30 uppercase font-black">REACTANT BETA (B)</label>
                      <select
                        value={reactants.b}
                        onChange={(e) => setReactants(prev => ({ ...prev, b: e.target.value }))}
                        className="bg-[#0A0E1A] text-white text-[9px] font-mono border border-white/10 rounded px-2 py-1 focus:outline-none focus:border-[#FFD600] cursor-pointer"
                      >
                        {flagshipElements.map(el => (
                          <option key={`b-${el.symbol}`} value={el.symbol}>[{el.symbol}] {el.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Quick relationship linkage helper */}
                    <div className="text-[7px] leading-relaxed text-white/40 mt-1 font-sans italic">
                      Synthesized outputs are dynamically quantified using electronegativity ratios across s-p-d-f orbital levels.
                    </div>
                  </div>

                  {/* Bond Reaction Outcome Display */}
                  <div className="md:col-span-8 flex flex-col bg-white/[0.02] border border-white/5 rounded p-3 text-[9px] justify-between">
                    <div>
                      <div className="flex justify-between items-start border-b border-white/5 pb-1 mb-2">
                        <div>
                          <span className="text-[6.5px] text-white/45 uppercase font-bold block">SYNTHESIZED ENTIRETY</span>
                          <strong className="text-white text-[10px] uppercase font-mono font-bold">{calculatedReaction.productName}</strong>
                        </div>
                        <div className="text-right">
                          <span className="text-[6.5px] text-[#00FFB3] uppercase block font-bold">Bonding formula</span>
                          <strong className="text-[#00FFB3] text-[10.5px] font-mono">{calculatedReaction.productFormula}</strong>
                        </div>
                      </div>

                      {/* Mechanism and hazards content */}
                      <p className="text-[#EAF2FF]/85 text-justify leading-relaxed font-sans font-light text-[8.5px]">
                        {calculatedReaction.scientificMechanism}
                      </p>

                      {/* Reaction metrics stats list */}
                      <div className="grid grid-cols-3 gap-2 text-[8px] font-mono mt-2.5">
                        <div className="p-1.5 bg-black/40 border border-white/5 rounded">
                          <span className="text-[5.5px] text-white/30 block mb-0.5 uppercase font-black">BOND TYPE CLASSIFICATION</span>
                          <strong className="text-[#FFD600] font-bold text-[9px] block uppercase font-bold">{calculatedReaction.bondingType}</strong>
                        </div>
                        <div className="p-1.5 bg-black/40 border border-[#00FFF1]/10 rounded">
                          <span className="text-[5.5px] text-white/30 block mb-0.5 uppercase font-black">ELECTRONEGATIVITY DIFF (ΔEN)</span>
                          <strong className="text-[#00E5FF] font-bold text-[9px] block">{calculatedReaction.electronegativityDiff !== null ? calculatedReaction.electronegativityDiff.toFixed(2) : 'N/A'}</strong>
                        </div>
                        <div className="p-1.5 bg-black/40 border border-[#00FFF1]/10 rounded">
                          <span className="text-[5.5px] text-white/30 block mb-0.5 uppercase font-black">ENTHALPY REACTION RATING</span>
                          <strong className="text-white font-bold text-[9px] block">{calculatedReaction.reactionEnergyKj} kJ/mol</strong>
                        </div>
                      </div>
                    </div>

                    {/* Hazard alert overlays */}
                    {calculatedReaction.hazardFlags.length > 0 && (
                      <div className="mt-2 bg-[#FF1744]/15 border border-[#FF1744]/35 p-1.5 rounded flex items-center gap-2 text-[#FF5252] text-[8px]">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 animate-bounce" />
                        <span className="font-bold flex-1 leading-normal uppercase">
                          HAZARDS: {calculatedReaction.hazardFlags.join('; ')}
                        </span>
                      </div>
                    )}
                  </div>

                </div>
              </div>

            </div>
          );
        })()}

      </div>

    </div>
  );
});
