/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Atom, 
  Layers, 
  Activity, 
  Sparkles, 
  Sliders, 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Compass, 
  Info, 
  Flame, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Globe,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Orbit,
  Hexagon,
  Network,
  Search
} from 'lucide-react';
import { ChemicalElement, TableLayoutMode, ReactionConfig } from '../types';
import { CATEGORY_COLORS, REACTION_CONFIGS, ELEMENTS_DATA } from '../data';
import { MOLECULAR_DATABASE } from '../utils/molecularGenerator';
import { ElementExplorationDepth } from './ElementExplorationDepth';
import ObservatoryHub from './ObservatoryHub';
import { ElementWorldUI } from './ElementWorldUI';
import { BlocksUniverse } from './BlocksUniverse';
import { OrbitiumNetwork } from './OrbitiumNetwork';

interface HolographicUIProps {
  selectedElement: ChemicalElement | null;
  compareElement: ChemicalElement | null;
  onSelectCompareElement: (element: ChemicalElement | null) => void;
  hoveredElement: ChemicalElement | null;
  onSelectElement: (element: ChemicalElement | null) => void;
  layoutMode: TableLayoutMode;
  onChangeLayoutMode: (mode: TableLayoutMode) => void;
  appMode: 'observatory' | 'explorer' | 'bond_lab' | 'timeline' | 'molecular' | 'blocks' | 'network';
  onChangeAppMode: (mode: 'observatory' | 'explorer' | 'bond_lab' | 'timeline' | 'molecular' | 'blocks' | 'network') => void;
  timelineYear: number;
  onChangeTimelineYear: (year: number | ((prev: number) => number)) => void;
  selectedMoleculeId?: string | null;
  onSelectMoleculeId?: (id: string | null) => void;
  isExplodedView?: boolean;
  onSetExplodedView?: (val: boolean) => void;
  simulationSpeed: number;
  onSetSimulationSpeed: (speed: number) => void;
  reactiveIntensity: number;
  onSetReactiveIntensity: (intensity: number) => void;
  isObsEntered: boolean;
  onEnterObs: () => void;
  activeReaction: ReactionConfig | null;
  onTriggerReaction: (reaction: ReactionConfig | null) => void;
  adaptiveQuality: boolean;
  onChangeAdaptiveQuality: (active: boolean) => void;
  isLowPerfMode: boolean;
  currentFps: number;
}

export function analyzeReaction(symA: string, symB: string): ReactionConfig {
  // 1. Check if we have an exact match in REACTION_CONFIGS (or matching reverse reactant array)
  const matched = REACTION_CONFIGS.find(re => 
    (re.reactants[0] === symA && re.reactants[1] === symB) ||
    (re.reactants[0] === symB && re.reactants[1] === symA)
  );
  if (matched) return matched;

  // 2. Otherwise, construct a dynamic chemical reaction on the fly!
  const elA = ELEMENTS_DATA.find(e => e.symbol === symA);
  const elB = ELEMENTS_DATA.find(e => e.symbol === symB);

  if (!elA || !elB) {
    return {
      reactants: [symA, symB],
      productName: 'Unknown Compound Residue',
      productFormula: `${symA}${symB}`,
      description: 'The quantum engine was unable to map the exact valence fields for this pairing.',
      visualType: 'covalent'
    };
  }

  // Same elements
  if (symA === symB) {
    if (elA.category === 'noble-gas') {
      return {
        reactants: [symA, symB],
        productName: `Monoatomic ${elA.name} Environment`,
        productFormula: symA,
        description: `Highly stable inert noble gas. Atoms do not coalesce under standard forces and glide past each other cleanly in a zero-affinity field.`,
        visualType: 'covalent',
        conditions: 'Ambient temperature, cryogenic isolation pressures',
        resultingMaterial: `Pure gaseous and compressed liquid ${elA.name}`,
        realWorldApplications: ['High-vacuum science isolators', 'Protective inert shields', 'Scentless heavy insulation atmospheres'],
        whyItMatters: `${elA.name} is chemically complete. This inertness is a vital shield, ensuring that materials do not burn, decompose, or rust in key high-voltage or scientific vessels.`,
        structure: 'Isolated monoatomic noble arrangement',
        properties: ['Extremely low chemical affinity', 'Zero dipole interaction', 'High electrical ionization light discharge'],
        uses: ['Cryogenics', 'Laser discharge tracking', 'Atmospheric isolation']
      };
    } else {
      const isMetal = elA.category.includes('metal');
      return {
        reactants: [symA, symB],
        productName: `Diatomic ${elA.name} Lattice`,
        productFormula: `${symA}₂`,
        description: `Homonuclear ${isMetal ? 'Metallic' : 'Covalent'} coordination: Two identical atoms of ${elA.name} share valence orbitals, forming a homogeneous structural elemental network.`,
        visualType: isMetal ? 'ionic' : 'covalent',
        conditions: 'Thermal spark, vacuum condensing, or galvanic sublimation',
        resultingMaterial: `Homogeneous elemental crystals, filaments, or compressed diatomic vapor`,
        realWorldApplications: [`Pure ${elA.name} metal plating`, 'Atmospheric breathers', 'Laser source components'],
        whyItMatters: `Identical elements bonding with themselves represents the purest form of chemical substance, demonstrating the symmetry of quantum electron spins.`,
        structure: 'Symmetrical linear coordination, zero dipolar distortion',
        properties: ['Perfect bond charge balance', 'Zero electronegativity offset', 'Tightly packed atomic radius coordinates'],
        uses: ['Structural chemistry study', 'Catalytic surfaces', 'Raw metallurgy feedstocks']
      };
    }
  }

  // Noble gas interaction (inert)
  if (elA.category === 'noble-gas' || elB.category === 'noble-gas') {
    const noble = elA.category === 'noble-gas' ? elA : elB;
    const other = elA.category === 'noble-gas' ? elB : elA;
    return {
      reactants: [symA, symB],
      productName: `${noble.name} - ${other.name} Non-Bonding Field`,
      productFormula: `${symA}•${symB}`,
      description: `Inert Barrier: The noble gas ${noble.name} possesses a complete outer octet of valence electrons (closed subshells), establishing an impenetrable barrier which refuses standard chemical electron transfer.`,
      visualType: 'covalent',
      conditions: 'No standard reaction conditions exist. Requires massive electrical potential.',
      resultingMaterial: 'Inert gaseous mixture, completely separated physically',
      realWorldApplications: ['Gaseous arc welding shielding', 'High-voltage insulation chambers', 'Preventing standard chemical fires'],
      whyItMatters: `This absolute refusal to react protects highly energetic processes from cataclysmic burnouts. Without noble gas insulation, high frequency electronics would spark and dissolve instantly.`,
      structure: 'Inter-penetrating atomic clouds without electron orbital hybridization',
      properties: ['Zero bond energy association', 'Independent kinetic velocity matrices', 'High dielectric breakdown resistance'],
      uses: ['Inert atmosphere control', 'Preservation of old artifacts', 'Cryogenic space cooling lines']
    };
  }

  // Calculate electronegativity difference
  const enA = elA.electronegativity || 1.0;
  const enB = elB.electronegativity || 1.0;
  const diff = Math.abs(enA - enB);

  // Ionic bond (one metal, one highly electronegative non-metal)
  if (diff >= 1.6) {
    const metal = enA < enB ? elA : elB;
    const nonmetal = enA < enB ? elB : elA;
    const formula = `${metal.symbol}${nonmetal.symbol}`;
    return {
      reactants: [symA, symB],
      productName: `${metal.name} ${nonmetal.name.replace(/ine$/, 'ide').replace(/gen$/, 'ide')} Compound`,
      productFormula: formula,
      description: `Electrostatic Ionic Lattice: ${metal.name} surrenders its weakly held valence electrons to the aggressive electronegative cloud of ${nonmetal.name}, generating a high-melting ionic salt.`,
      visualType: 'ionic',
      conditions: 'Direct contact with thermal triggering and moisture ionization',
      resultingMaterial: 'Transparent, high-melting ionic crystalline solid blocks',
      realWorldApplications: ['Solid-state electrolyte batteries', 'Mineral supplements and dietary nutrients', 'Industrial salt solvents'],
      whyItMatters: `High electronegativity differences generate electrostatic potentials that form highly rigid ionic lattices. This dissociation is the engine of electrical chemistry, battery cells, and bio-electrics.`,
      structure: 'Crystalline electrostatic lattice arrangement',
      properties: ['High water solubility', 'High thermal melting boundary', 'Brittle glass-like mechanical cleavage'],
      uses: ['Lattice chemistry teaching', 'Electrochemical cells', 'Industrial chemical fluxes']
    };
  }

  // Metallic bond (both are metals)
  if (elA.category.includes('metal') && elB.category.includes('metal')) {
    return {
      reactants: [symA, symB],
      productName: `${elA.name}-${elB.name} Metallic Alloy`,
      productFormula: `${symA}${symB}`,
      description: `Electron-Sea Metallic Lattice: Valence electrons are delocalized into a shared quantum "sea", leaving positive atomic cores aligned inside a highly ductile, shiny metallic alloy matrix.`,
      visualType: 'covalent',
      conditions: 'Solid-state high-temperature sintering or vacuum liquid co-melting',
      resultingMaterial: 'Malleable, highly conductive solid metallic composite phase',
      realWorldApplications: ['Aviation skeletal frames', 'Heavy magnetic inductor cores', 'Solder materials for high precision electronics'],
      whyItMatters: `Alloys create structural properties that neither element can achieve on its own, like high-temperature creep resistance or ultra-durable rust prevention.`,
      structure: 'Close-packed metallic lattice sharing a delocalized Fermi sea of conduction energy',
      properties: ['Exceptional thermal and electric conductance', 'High plastic ductility and malleability', 'High mechanical yield threshold'],
      uses: ['Structural aviation engineering', 'Marine turbine blades', 'Electrical grid contacts']
    };
  }

  // Covalent bond (non-metals, moderate to low electronegativity difference)
  const formula = `${symA}${symB}`;
  return {
    reactants: [symA, symB],
    productName: `${elA.name} ${elB.name.replace(/gen$/, 'ide').replace(/ine$/, 'ide')} Molecule`,
    productFormula: formula,
    description: `Covalent Orbital Sharing: Moderate electronegativity differences allow adjacent p-orbitals to hybridize, creating discrete polar molecules with directional covalent bonds.`,
    visualType: 'covalent',
    conditions: 'Catalyzed gaseous firing or elevated UV radiation trigger',
    resultingMaterial: 'Volatile molecular fluid, high-clarity gas, or insulating organic crystal',
    realWorldApplications: ['Microchip chemical vapor deposition (CVD)', 'Synthetic organic polymers and pharmaceuticals', 'Specialized refrigeration agents'],
    whyItMatters: `Directional shared electron pairs allow complex chains and geometric rings to form, giving rise to all organic compounds and structural polymers that define modern medicine and chemistry.`,
    structure: 'Discrete polar molecular structure with hybridized valence shells',
    properties: ['Low boiling and freezing points', 'High inter-molecular dipole-dipole interactions', 'Electrical insulator behavior'],
    uses: ['Specialty solvent synthesis', 'Organic chemical processing', 'Silicon oxidation barriers']
  };
}

export function getNucleosynthesisTimeline(el: ChemicalElement) {
  const number = el.number;
  const sys = el.symbol;
  const name = el.name;
  const origin = el.cosmicProperties?.stellarOrigin || el.cosmicRelevance || 'Unknown stellar field';
  const process = el.cosmicProperties?.nucleosynthesisProcess || 'High-energy collision';

  // Step 1: Initial Stellar Origin State
  let step1Title = "Primordial Stellar Origin";
  let step1Desc = origin;
  const step1Accent = "#00E5FF"; // cyan

  // Step 2: Transition / Intermediate Fusion Reaction Mode
  let step2Title = "Stellar Core Ignition";
  let step2Desc = process;
  const step2Accent = "#FF9100"; // orange
  
  // Step 3: Final manifest stabilized element
  const step3Title = `${name} Materialization`;
  const step3Desc = `Stabilized atomic core of ${sys} with ${el.protons} protons and ${el.neutrons} neutrons.`;
  const step3Accent = "#00FFB3"; // green

  if (number <= 4) {
    // Light cosmic elements
    step1Title = "Big Bang Fireball";
    step1Desc = "First seconds of the universe; ultra-dense hot baryonic quark-gluon plasma cooling.";
    step2Title = "Cosmic Nucleosynthesis";
    step2Desc = "Protons and neutrons fuse into Helium & Trace Lithium under high thermal expansion.";
  } else if (number <= 26) {
    // Carbon up to Iron (stellar hydrostatic burning)
    step1Title = "Fusion Star Core";
    step1Desc = origin.replace(/\.$/, "") + " in hydrostatic stellar core equilibrium.";
    step2Title = "Thermonuclear Shell Fusion";
    step2Desc = process.replace(/\.$/, "") + " creating concentric carbon-to-iron layers.";
  } else if (el.category.includes('synthetic') || number > 94 || ['Tc', 'Pm', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr'].includes(sys)) {
    // Synthetic elements
    step1Title = "Advanced High-Energy Lab";
    step1Desc = "Controlled laboratory targets inside cyclotron or nuclear power core.";
    step2Title = "Artificial Nucleus Fusion";
    step2Desc = process;
    return [
      { title: step1Title, desc: step1Desc, accent: step1Accent },
      { title: step2Title, desc: step2Desc, accent: step2Accent },
      { title: `Synthetic Isotopic Matrix`, desc: `Highly transient and unstable ${sys} radioactive core captures.`, accent: step3Accent }
    ];
  } else if (process.toLowerCase().includes('rapid') || process.includes('r-process') || ['Au', 'Pt', 'U', 'Th', 'Pb', 'Hg'].includes(sys)) {
    // r-process extreme heavy elements
    step1Title = "Neutron Star Collision Core";
    step1Desc = "Two ultra-dense degenerate stellar cores colliding in a cataclysmic Kilonova explosion.";
    step2Title = "Rapid Neutron Capture (r-process)";
    step2Desc = "Extreme high-flux neutron capture flooding seed nuclei, followed by rapid beta-decay.";
  } else {
    // s-process or normal cosmic dust accretion
    step1Title = "Stellar Wind / AGB Giant";
    step1Desc = origin.replace(/\.$/, "") + " convective stellar envelopes.";
    step2Title = "Slow Neutron Capture (s-process)";
    step2Desc = "Iron seed nuclei slowly capturing neutrons inside helium shells over centuries.";
  }

  return [
    { title: step1Title, desc: step1Desc, accent: step1Accent },
    { title: step2Title, desc: step2Desc, accent: step2Accent },
    { title: step3Title, desc: step3Desc, accent: step3Accent }
  ];
}

export default function HolographicUI({
  selectedElement,
  compareElement,
  onSelectCompareElement,
  hoveredElement,
  onSelectElement,
  layoutMode,
  onChangeLayoutMode,
  appMode,
  onChangeAppMode,
  timelineYear,
  onChangeTimelineYear,
  selectedMoleculeId,
  onSelectMoleculeId,
  isExplodedView,
  onSetExplodedView,
  simulationSpeed,
  onSetSimulationSpeed,
  reactiveIntensity,
  onSetReactiveIntensity,
  isObsEntered,
  onEnterObs,
  activeReaction,
  onTriggerReaction,
  adaptiveQuality,
  onChangeAdaptiveQuality,
  isLowPerfMode,
  currentFps,
}: HolographicUIProps) {
  const [reactionStage, setReactionStage] = useState<'idle' | 'mixing' | 'stable'>('idle');
  const [reactionCountDown, setReactionCountDown] = useState(0);
  const [activeReactionTab, setActiveReactionTab] = useState<'overview' | 'reaction' | 'products' | 'applications' | 'pathways'>('overview');
  const [activeTab, setActiveTab] = useState<'overview' | 'atomic' | 'properties' | 'cosmic_bio' | 'applications'>('overview');
  const [activeLayer, setActiveLayer] = useState<number>(1);
  
  // Custom states for audio and timeline
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [liveDistance, setLiveDistance] = useState<number | null>(null);
  const [isMoreActive, setIsMoreActive] = useState(false);
  
  // Custom states for the Dynamic Compound Discovery Sandbox
  const [bondLabTab, setBondLabTab] = useState<'registry' | 'sandbox'>('registry');
  const [sandboxA, setSandboxA] = useState<string>('H');
  const [sandboxB, setSandboxB] = useState<string>('O');

  // Multi-Scale Exploration Scale state tracking
  const [scaleMode, setScaleMode] = useState<'cosmic' | 'periodic' | 'molecular' | 'atomic' | 'subatomic'>('periodic');

  // Compare & Pathway States
  const [compareSelectorOpen, setCompareSelectorOpen] = useState(false);
  const [compareSearchQuery, setCompareSearchQuery] = useState('');
  const [pathwayOpen, setPathwayOpen] = useState(false);

  // Selected electron shell info state
  const [activeShellInfo, setActiveShellInfo] = useState<{
    shellIndex: number;
    shellName: string;
    electrons: number;
    radius: number;
  } | null>(null);

  useEffect(() => {
    if (selectedElement) {
      if (activeShellInfo) {
        setScaleMode('subatomic');
      } else {
        setScaleMode('atomic');
      }
    } else if (appMode === 'bond_lab' || appMode === 'molecular') {
      setScaleMode('molecular');
    } else if (appMode === 'observatory') {
      setScaleMode('cosmic');
    } else {
      setScaleMode('periodic');
    }
  }, [selectedElement, appMode, activeShellInfo]);

  const [isDensityCloudActive, setIsDensityCloudActive] = useState(true);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('toggle-density-cloud', {
      detail: { enabled: isDensityCloudActive }
    }));
  }, [isDensityCloudActive]);

  // Discovery tracking states
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [discoveredAnomalies, setDiscoveredAnomalies] = useState<any[]>([]);
  const [lastDiscovery, setLastDiscovery] = useState<any | null>(null);

  // Collapsible section state variables for MORE Command Drawer
  const [geometryCollapsed, setGeometryCollapsed] = useState(false);
  const [scannerCollapsed, setScannerCollapsed] = useState(false);
  const [synthesizerCollapsed, setSynthesizerCollapsed] = useState(true); // default compressed for ultra clean dashboard
  const [chronoMetricsCollapsed, setChronoMetricsCollapsed] = useState(false);
  const [epochDeckCollapsed, setEpochDeckCollapsed] = useState(false);
  const [bondFormulaCollapsed, setBondFormulaCollapsed] = useState(false);
  const [bondDiagnosticsCollapsed, setBondDiagnosticsCollapsed] = useState(false);

  // Autonomous living multiverse event states
  const [liveQuantumEvents, setLiveQuantumEvents] = useState<string[]>([
    "SEC-Ω DETECTOR: TRANSURANIC DECAY RATES STEADY.",
    "SEC-E CONDENSER: HYDROGEN INJECTION SUCCESSFUL.",
    "SEC-N: COHERENT AR-NE CORRIDOR STABILIZED AT 100%."
  ]);
  const [activeSectorIndex, setActiveSectorIndex] = useState<number>(0);

  useEffect(() => {
    if (!isObsEntered) return;
    const interval = setInterval(() => {
      const eventTemplates = [
        "SEC-Ω: TRANSURANIC ALPHA FLUCTUATION TO +0.14 mSv.",
        "SEC-E: INITIATED STELLAR CORE COMPRESSION CYCLE.",
        "SEC-N: NEON PLASMA SHIELD RE-PHASE COMPLETED.",
        "SEC-M: MAG-FIELD COHERENCE LEVEL STABILIZED AT 4.2T.",
        "SEC-S: PRESSURE CORRIDOR SYNTHESIZED MOLECULAR GASES.",
        "SEC-A: LOCALIZED COUPLING FLUCTUATED SPATIAL DENSITY.",
        "GRID: IRON CORE ELECTROMAGNETIC SYNERGY PASSIVE PULSE.",
        "GRID: NEON ATOMIC ATMOSPHERE DENSITY INCREASED.",
        "COSMIC: NEBULA GAS CLUSTER COMPRESSION DETECTED."
      ];
      
      const randomEvent = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
      setLiveQuantumEvents(prev => [randomEvent, ...prev.slice(0, 7)]);

      // dispatch a subtle cosmic pulse to shake the 3D grid
      window.dispatchEvent(new CustomEvent('cosmic-pulse', { detail: { intensity: 0.35 + Math.random() * 0.4 } }));
    }, 8000);

    return () => clearInterval(interval);
  }, [isObsEntered]);

  // Private static discovery options database
  const DISCOVERY_DATABASE = [
    {
      id: 'heliogenesis',
      title: 'Stellar Heliogenesis Loop',
      desc: 'Discovered a hydrogen compression corridor inside Sector Helios. High-energy stellar fusion is now synthesizable.',
      reactantA: 'H',
      reactantB: 'H',
      pathway: 'H + H → He (Sun Core)',
      category: 'Fusion'
    },
    {
      id: 'excimer',
      title: 'Excimer Plasma Resonance',
      desc: 'Located argon gas excitation nodes under intense fluorine laser discharge inside Sector Neon.',
      reactantA: 'Ar',
      reactantB: 'F',
      pathway: 'Ar + F → ArF*',
      category: 'Plasma Optics'
    },
    {
      id: 'superconductive',
      title: 'Superconductive Perovskite',
      desc: 'Traced zero-ohm Cooper-pair corridors in layered Yttrium-Barium-Copper-Oxygen planes inside Sector Core.',
      reactantA: 'Y',
      reactantB: 'Cu',
      pathway: 'YBCO Lattice',
      category: 'Quantum Condensate'
    },
    {
      id: 'hawking_radiation',
      title: 'Quantum Hawking Leak',
      desc: 'Detected virtual baryonic particle leaks at the event horizon of high-mass black holes in Sector Omega decays.',
      reactantA: null,
      reactantB: null,
      pathway: 'Hawking Stream SEC-Ω',
      category: 'Singularity Anomaly'
    },
    {
      id: 'dimensional_rip',
      title: 'Dimensional Gravity Twist',
      desc: 'Identified trace curls of localized space-time warp fields in the high-frequency Anomaly Grid.',
      reactantA: null,
      reactantB: null,
      pathway: 'Micro-Warp Singularity',
      category: 'Gravity Tensors'
    }
  ];

  // Trigger scanning sequence
  const handleStartScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setLastDiscovery(null);

    // Shake camera and emit synth sound via existing events
    window.dispatchEvent(
      new CustomEvent('reaction-stage', {
        detail: { stage: 'mixing' }
      })
    );
  };

  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          
          // Select a discovery that has not been found, or repeat
          const unfound = DISCOVERY_DATABASE.filter(d => !discoveredAnomalies.some(found => found.id === d.id));
          const discovery = unfound.length > 0 
            ? unfound[Math.floor(Math.random() * unfound.length)]
            : DISCOVERY_DATABASE[Math.floor(Math.random() * DISCOVERY_DATABASE.length)];

          setDiscoveredAnomalies((prevList) => {
            if (prevList.some(item => item.id === discovery.id)) return prevList;
            return [...prevList, discovery];
          });
          setLastDiscovery(discovery);

          // Complete scan visual pulse
          window.dispatchEvent(
            new CustomEvent('reaction-stage', {
              detail: { stage: 'stable' }
            })
          );
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isScanning, discoveredAnomalies]);

  useEffect(() => {
    setActiveShellInfo(null);
  }, [selectedElement]);

  useEffect(() => {
    const handleShellClick = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.selected) {
        setActiveShellInfo({
          shellIndex: detail.shellIndex,
          shellName: detail.shellName,
          electrons: detail.electrons,
          radius: detail.radius
        });
      } else {
        setActiveShellInfo(null);
      }
    };
    
    window.addEventListener('orbit-shell-clicked', handleShellClick);
    return () => {
      window.removeEventListener('orbit-shell-clicked', handleShellClick);
    };
  }, []);

  // New ref for element-detail-sidebar
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Dynamic cybernetic pulsing requestAnimationFrame cycle for the sidebar border
  useEffect(() => {
    if (!selectedElement) return;

    let animId: number;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      // Cycles border alpha from 0.15 to 0.45 utilizing a smooth sine frequency
      const sinVal = Math.sin(elapsed * 4.5);
      const alpha = 0.15 + ((sinVal + 1) / 2) * 0.3;

      if (sidebarRef.current) {
        const catHex = getCatMeta(selectedElement.category).hex;
        const cleanHex = catHex.replace('#', '');
        let r = 0, g = 0, b = 0;
        if (cleanHex.length === 3) {
          r = parseInt(cleanHex[0] + cleanHex[0], 16);
          g = parseInt(cleanHex[1] + cleanHex[1], 16);
          b = parseInt(cleanHex[2] + cleanHex[2], 16);
        } else if (cleanHex.length === 6) {
          r = parseInt(cleanHex.substring(0, 2), 16);
          g = parseInt(cleanHex.substring(2, 4), 16);
          b = parseInt(cleanHex.substring(4, 6), 16);
        }
        sidebarRef.current.style.borderColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        sidebarRef.current.style.boxShadow = `0 0 25px rgba(${r}, ${g}, ${b}, ${alpha * 0.35})`;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [selectedElement]);

  // Reset tab and active layer when element changes
  useEffect(() => {
    setActiveTab('overview');
    setActiveLayer(1);
  }, [selectedElement]);

  // Audio setup bindings
  useEffect(() => {
    if (isObsEntered) {
      import('../utils/audioSynth').then(({ OrbitiumAudio }) => {
        OrbitiumAudio.setMute(isMuted);
      });
    }
  }, [isMuted, isObsEntered]);

  // Audio transitions on element selection
  useEffect(() => {
    if (isObsEntered && appMode === 'explorer') {
      import('../utils/audioSynth').then(({ OrbitiumAudio }) => {
        OrbitiumAudio.transitionToElement(selectedElement);
      });
    }
  }, [selectedElement, isObsEntered, appMode]);

  // Handle auto timeline progression
  useEffect(() => {
    if (!isPlayingTimeline || appMode !== 'timeline') return;

    const interval = setInterval(() => {
      onChangeTimelineYear((prev) => {
        let next = prev;
        if (prev < 1500) {
          next += 120; // Fast-forward through prehistoric centuries
        } else if (prev < 1850) {
          next += 5;
        } else if (prev < 1950) {
          next += 2;
        } else {
          next += 1;
        }

        if (next >= 2026) {
          setIsPlayingTimeline(false);
          return 2026;
        }
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isPlayingTimeline, appMode, onChangeTimelineYear]);

  // Listen to 3D scene reactive distance updates via lightweight custom DOM events
  useEffect(() => {
    const handleDist = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.distance === 'number') {
        setLiveDistance(customEvent.detail.distance);
      }
    };
    const handleStage = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        if (customEvent.detail.stage === 'stable') {
          setReactionStage('stable');
          onSetReactiveIntensity(1.5);
        } else if (customEvent.detail.stage === 'mixing') {
          setReactionStage('mixing');
        } else if (customEvent.detail.stage === 'idle') {
          setReactionStage('idle');
        }
      }
    };

    window.addEventListener('tether-distance', handleDist);
    window.addEventListener('reaction-stage', handleStage);
    return () => {
      window.removeEventListener('tether-distance', handleDist);
      window.removeEventListener('reaction-stage', handleStage);
    };
  }, [onSetReactiveIntensity]);

  // Enter world and unlock Web Audio API securely
  const handleEnterWorld = () => {
    onEnterObs();
    import('../utils/audioSynth').then(({ OrbitiumAudio }) => {
      OrbitiumAudio.init();
      // Initially, transition to empty state to kick-off atmospheric pad drone
      OrbitiumAudio.transitionToElement(null);
    });
  };

  // Trigger Reaction Lifecycle animation
  const handleReactionInit = (re: ReactionConfig) => {
    onTriggerReaction(re);
    setReactionStage('idle'); // The user must click and drag them, not immediate!
    onSetReactiveIntensity(1.2); 
    
    // Dispatch event to 3D scene to spawn reactants left & right
    window.dispatchEvent(new CustomEvent('load-reactants', { detail: { reaction: re } }));
  };

  const handleCancelReaction = () => {
    setReactionStage('idle');
    onTriggerReaction(null);
    setLiveDistance(null);
    onSetReactiveIntensity(1.0);
    window.dispatchEvent(new CustomEvent('reset-reactor', {}));
  };

  const REACTION_TELEMETRY: Record<string, {
    equation: string;
    energyChange: string;
    bondDetail: string;
    orbitalType: string;
    kinetics: string;
    thermalStatus: string;
    hazards: string;
  }> = {
    'NaCl': {
      equation: '2Na (s) + Cl₂ (g) → 2NaCl (s)',
      energyChange: 'ΔH = -787 kJ/mol (Lattice Energy release)',
      bondDetail: 'Ionic Electrostatic attraction. Complete valence electron shell donation from Sodium [Ne]3s¹ to Chlorine [Ne]3s²3p⁵.',
      orbitalType: 'Closed shell octet configuration [Na⁺][Cl⁻]',
      kinetics: 'Highly spontaneous, instantaneous lattice crystallization solidifying into face-centered cubic grids.',
      thermalStatus: 'Strongly Exothermic, crystalline consolidation',
      hazards: 'Corrosive gas + volatile alkali reduction.'
    },
    'H₂O': {
      equation: '2H₂ (g) + O₂ (g) → 2H₂O (l)',
      energyChange: 'ΔH = -572 kJ/mol (Highly Exothermic)',
      bondDetail: 'Dual single-covalent sigma (σ) bonds. Oxygen shares pairs with hydrogen s-orbitals.',
      orbitalType: 'Sp³ hybridized orbitals with bent geometry (~104.5° bond angle)',
      kinetics: 'Activated radical cascade chain propagation.',
      thermalStatus: 'Thermally explosive, immediate water vapor condensation',
      hazards: 'Highly flammable fuel, explosive shock front.'
    },
    'CsOH + H₂': {
      equation: '2Cs (s) + 2H₂O (l) → 2CsOH (aq) + H₂ (g)',
      energyChange: 'ΔH = -391 kJ/mol (Extremely Rapid Detonation)',
      bondDetail: 'Ionic Cs⁺/OH⁻ dissociation alongside covalent H-H gas formation.',
      orbitalType: 'Volatile plasma-coupled cationic transition phases',
      kinetics: 'Uncapped chain propagation supported by instant base boiling',
      thermalStatus: 'Superheated alkaline jet steam explosion + localized plasma ignition',
      hazards: 'Ultra-reactive alkali hazard, severe thermal blast pressure.'
    },
    'CO₂': {
      equation: 'C (s) + O₂ (g) → CO₂ (g)',
      energyChange: 'ΔH = -393.5 kJ/mol (Highly Spontaneous Combustion)',
      bondDetail: 'Double covalent sigma-pi (σ, π) bonds. Carbon shares 4 valence electrons with two separate Oxygens.',
      orbitalType: 'Sp hybridized linear molecule structure (180° bond angle)',
      kinetics: 'Slow or rapid oxidation depending on temperature catalysts.',
      thermalStatus: 'Exothermic gas expansion',
      hazards: 'Asphyxiant gas accumulating in negative grav fields.'
    },
    'Fe₂O₃': {
      equation: '4Fe (s) + 3O₂ (g) → 2Fe₂O₃ (s)',
      energyChange: 'ΔH = -824.2 kJ/mol (Slow Oxidation)',
      bondDetail: 'Metallic oxidation and electrostatic Fe³⁺ / O²⁻ ion exchange.',
      orbitalType: 'Unfilled d-orbital ligand coordination network',
      kinetics: 'Multi-day moisture-facilitated anode-cathode rust migration.',
      thermalStatus: 'Extremely slow heat dispersal, negligible instant spike',
      hazards: 'Structural fatigue material decay.'
    }
  };

  const getCatMeta = (cat: string) => {
    return CATEGORY_COLORS[cat] || { hex: '#00E5FF', label: cat, description: '' };
  };

  const getElectronegativityColor = (en: number | null): string => {
    if (en === null || en === undefined) return '#00E5FF';
    if (en < 1.0) return '#7C4DFF';
    if (en < 1.5) return '#00E5FF';
    if (en < 2.0) return '#00FFB3';
    if (en < 2.5) return '#FFD600';
    if (en < 3.0) return '#FF9100';
    return '#FF1744';
  };

  // Historical milestones helper
  const epochs = [
    { name: 'Antiquity', year: -5000, desc: 'Metals used in early civilizations.' },
    { name: 'Alchemical', year: 1650, desc: 'Early Scientific isolations.' },
    { name: 'Pneumatic', year: 1775, desc: 'Isolations of major oxygen/gases.' },
    { name: 'Electrolytic', year: 1810, desc: 'Humphry Davy alkali isolated cores.' },
    { name: 'Nuclear Age', year: 1945, desc: 'Synthesized synthetic transuranics.' },
    { name: 'Modern', year: 2026, desc: 'Complete modern 118 grid lattice.' },
  ];

  // Discovery period description helper
  const getPeriodDescription = (y: number) => {
    if (y <= -500) return "Class metals and items processed by ancient civilizations (Carbon, Copper, Gold, Iron, Silver, Sulfur).";
    if (y <= 1700) return "Post-classical metallurgy and early alchemical isolations (Phosphorus, Arsenic).";
    if (y <= 1800) return "Antoine Lavoisier defines modern elements. Gaseous element separation (Hydrogen, Nitrogen, Oxygen, Chlorine).";
    if (y <= 1900) return "Humphry Davy isolates alkali metals, Dmitri Mendeleev forms the table, Noble Gases extracted (Sodium, Helium, Argon).";
    return "Quantum physics and synchrotron synthesis of superheavy radioactive cyclotronic elements (Plutonium, Oganesson).";
  };

  // Total elements discovered at this point
  const totalDiscoveredCount = ELEMENTS_DATA.filter(e => e.year <= timelineYear).length;

  return (
    <div id="orbitium-hud-root" className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 z-10 font-sans text-[#EAF2FF]">
      
      {/* Cinematic Quantum Radar Scanline */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="w-full h-[1.5px] bg-[#00E5FF]/25 shadow-[0_0_12px_rgba(0,229,255,0.7)] animate-scanline" />
      </div>

      {/* =======================================================
          TOP LAYER NAVIGATION AND BRANDING (ZONE 1)
          ======================================================= */}
      <header className="w-full flex flex-col md:flex-row justify-between items-center gap-4 pointer-events-auto z-40 bg-[#0A0D1B]/50 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        {/* Logo and Tagline */}
        <div id="orb-hud-brand" className="flex items-center gap-3 self-start md:self-center cursor-pointer hover:opacity-80 transition-opacity flex-1" onClick={() => onChangeAppMode('explorer')}>
          <div className="w-9 h-9 rounded-sm border border-[#00E5FF]/20 flex items-center justify-center bg-[#0B1020]/80 backdrop-blur-md hover:border-[#00E5FF]/60 hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all">
            <Atom className="w-5 h-5 text-[#00E5FF] animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div>
            <div className="text-sm font-black tracking-[0.2em] text-[#EAF2FF]">ORBITIUM</div>
          </div>
        </div>

        {/* Universal Search Bar */}
        <div className="flex-1 w-full md:max-w-md">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-3 w-4 h-4 text-[#00E5FF]/50" />
            <input
              type="text"
              placeholder="SEARCH ELEMENT, SYMBOL, OR MATERIA..."
              className="w-full bg-black/40 border border-white/10 text-white font-mono text-[10px] pl-10 pr-4 py-2.5 rounded focus:outline-none focus:border-[#00E5FF]/50 hover:border-white/20 transition-colors uppercase placeholder:text-white/30"
              onChange={(e) => {
                const query = e.target.value.toLowerCase();
                if (query.trim() === '') return;
                window.dispatchEvent(new CustomEvent('orbitium-search', { detail: { query } }));
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                   const query = e.currentTarget.value.toLowerCase();
                   const el = ELEMENTS_DATA.find(el => el.name.toLowerCase() === query || el.symbol.toLowerCase() === query);
                   if (el) onSelectElement(el);
                }
              }}
            />
          </div>
        </div>

        {/* Dynamic status widgets and secondary toggles */}
        <div className="flex gap-3 font-mono text-[10px] self-end md:self-center justify-end items-center flex-1">
          {isObsEntered && (
            <button
              id="btn-toggle-more-protocols"
              onClick={() => {
                setIsMoreActive(!isMoreActive);
                import('../utils/audioSynth').then(({ OrbitiumAudio }) => {
                  OrbitiumAudio.playUnlockChime();
                }).catch(() => {});
              }}
              className={`px-3 py-1.5 justify-center rounded-sm border backdrop-blur-md flex items-center gap-1.5 cursor-pointer transition-all duration-300 ${
                isMoreActive
                  ? 'bg-gradient-to-r from-[#00FFB3]/15 to-[#00E5FF]/15 border-[#00FFB3] text-[#00FFB3] shadow-[0_0_15px_rgba(0,255,179,0.25)] font-black'
                  : 'bg-white/5 border-white/10 text-white/75 hover:border-[#00E5FF] hover:text-[#00E5FF] hover:bg-[#00E5FF]/5'
              }`}
              title={isMoreActive ? "Collapse advanced controls" : "Reveal advanced observatory controls"}
            >
              <Sliders className={`w-3.5 h-3.5 ${isMoreActive ? 'animate-spin' : ''}`} style={isMoreActive ? { animationDuration: '6s' } : {}} />
              <span className="hidden md:inline">{isMoreActive ? "CLOSE MENU" : "MORE"}</span>
            </button>
          )}

          {isObsEntered && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`px-2 py-1.5 justify-center rounded-sm border backdrop-blur-md flex items-center gap-1.5 cursor-pointer transition-all ${
                isMuted
                  ? 'bg-red-950/20 border-red-500/40 text-red-400'
                  : 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF] hover:border-[#00E5FF]'
              }`}
              title={isMuted ? "Unmute cosmic synthesizer engine" : "Mute cosmic synthesizer engine"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </header>

      {/* DYNAMIC PERFORMANCE QUALITY ACTION BANNER */}
      {/* Hidden to declutter UI */}


      {/* =======================================================
          MAIN INTERACTION HUD OVERLAYS (Left / Right / Middle)
          ======================================================= */}
      <main className="flex-1 my-4 flex flex-col md:flex-row gap-6 relative justify-between items-stretch">
        {/* LEFT & RIGHT HUD CONSOLIDATION TO A SINGLE SYSTEMS OBSERVATORY COMMAND DRAWER */}
        {/* =======================================================
            MORE SYSTEMS: FUTURISTIC SCIENTIFIC CONTROL HUB DRAWER
            ======================================================= */}
        <div 
          id="scientific-control-hub-drawer"
          className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-[#070C1B]/95 backdrop-blur-2xl border-l border-[#00FFB3]/25 shadow-[-15px_0_40px_rgba(0,0,0,0.85)] z-50 flex flex-col pointer-events-auto transition-all duration-500 ease-out select-none ${
            isMoreActive && isObsEntered && !selectedElement
              ? 'translate-x-0 opacity-100 ring-1 ring-[#00FFB3]/30'
              : 'translate-x-full opacity-0 pointer-events-none'
          }`}
        >
          {/* Top glowing laser line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FFB3] to-transparent shadow-[0_0_8px_#00FFB3]" />

          {/* Corner structural high-end decorations */}
          <div className="absolute top-3 left-3 w-2.5 h-2.5 border-t-2 border-l-2 border-[#00E5FF]/40" />
          <div className="absolute top-3 right-3 w-2.5 h-2.5 border-t-2 border-r-2 border-[#00E5FF]/40" />
          <div className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b-2 border-l-2 border-[#00E5FF]/40" />
          <div className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b-2 border-r-2 border-[#00E5FF]/40" />

          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.015]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 border border-[#00FFB3]/30 bg-[#00FFB3]/5 flex items-center justify-center rounded">
                <Sliders className="w-5 h-5 text-[#00FFB3]" />
              </div>
              <div>
                <div className="text-[7.5px] font-mono tracking-[0.3em] text-[#00E5FF] uppercase">// ADVANCED CRITICAL CONTROLS</div>
                <h2 className="text-xs font-black tracking-widest text-white uppercase mt-0.5">
                  OBSERVATORY SYSTEMS COMMAND
                </h2>
              </div>
            </div>
            
            <button
              onClick={() => {
                setIsMoreActive(false);
                import('../utils/audioSynth').then(({ OrbitiumAudio }) => {
                  OrbitiumAudio.playUnlockChime();
                }).catch(() => {});
              }}
              className="w-8 h-8 rounded border border-white/10 hover:border-[#00FFB3] hover:bg-[#00FFB3]/10 text-white/60 hover:text-[#00FFB3] flex items-center justify-center cursor-pointer transition-all duration-300"
              title="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content scroll area */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar scrollbar-thin">
            
            {/* 1. EXTENDED EXPLORATION MODES */}
            <div className="border border-white/10 rounded-sm bg-white/[0.015] overflow-hidden shadow-lg">
              <div className="w-full p-4 flex items-center justify-between font-mono text-[10px] uppercase text-[#00E5FF] tracking-widest bg-white/[0.02] border-b border-white/5">
                <span className="flex items-center gap-2 font-black">
                  <Globe className="w-4.5 h-4.5" /> EXPERIMENTAL ZONES
                </span>
              </div>
              <div className="p-4 flex flex-col gap-2">
                {[
                  { id: 'timeline', label: 'Timeline History', icon: TrendingUp },
                  { id: 'molecular', label: 'Molecular Universe', icon: Hexagon },
                  { id: 'blocks', label: 'Quantum Blocks', icon: Layers },
                  { id: 'observatory', label: 'Deep Space Observatory', icon: Orbit },
                ].map((mode) => {
                  const IconComp = mode.icon;
                  const isActive = appMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => onChangeAppMode(mode.id as any)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 text-[10px] font-mono uppercase tracking-widest font-extrabold border transition-all duration-300 cursor-pointer rounded-sm text-left ${
                        isActive
                          ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                          : 'bg-black/40 border-white/10 text-[#EAF2FF]/60 hover:text-white hover:bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. ATOMIC EXPLORER PANEL CONTROLS */}
            {appMode === 'explorer' && (
              <>
                {/* Collapsible Panel 1: Geometric Field Config & Wavefield Modulations */}
                <div className="border border-white/10 rounded-sm bg-white/[0.015] overflow-hidden shadow-lg">
                  <button 
                    onClick={() => setGeometryCollapsed(!geometryCollapsed)}
                    className="w-full p-4 flex items-center justify-between font-mono text-[10px] uppercase text-[#00E5FF] tracking-widest bg-white/[0.02] border-b border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="flex items-center gap-2 font-black">
                      <Layers className="w-4.5 h-4.5" /> COSMIC FIELD & WAVEFIELD
                    </span>
                    {geometryCollapsed ? <ChevronDown className="w-4 h-4 text-white/50" /> : <ChevronUp className="w-4.5 h-4.5 text-[#00E5FF]" />}
                  </button>

                  <div className={`transition-all duration-300 overflow-hidden ${geometryCollapsed ? 'max-h-0' : 'max-h-[850px] p-4 space-y-4'}`}>
                    {/* Layout mode buttons */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest font-black">CHOOSE ELEMENT LAYOUT GEOMETRY:</span>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {(['grid', 'spiral', 'sphere', 'scatter'] as TableLayoutMode[]).map((mode) => (
                          <button
                            key={mode}
                            onClick={() => onChangeLayoutMode(mode)}
                            className={`py-2 px-2 text-[10px] uppercase tracking-wider font-extrabold border transition-all cursor-pointer ${
                              layoutMode === mode
                                ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.1)]'
                                : 'bg-[#0B1020]/50 border-white/10 text-[#EAF2FF]/60 hover:border-white/20 hover:text-[#EAF2FF]'
                            }`}
                          >
                            {mode === 'grid' && 'COSMIC GRIDMAP'}
                            {mode === 'spiral' && 'STELLAR HELIX'}
                            {mode === 'sphere' && 'ATOMIC STAR SYSTEM'}
                            {mode === 'scatter' && 'NEBULA DRIFT'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Symmetrical divider */}
                    <div className="w-full h-[1px] bg-white/10" />

                    {/* Wavefield Modulations Range sliders */}
                    <div className="space-y-3.5">
                      <div className="text-[8.5px] font-mono text-[#7C4DFF] uppercase tracking-widest font-black flex items-center gap-1">
                        <Sliders className="w-3.5 h-3.5" /> WAVEFIELD PARAMETERS
                      </div>
                      {/* Speed Slider */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-[10px] font-mono text-[#EAF2FF]/60">
                          <span className="uppercase">TIME COUPLING [SPEED]:</span>
                          <span className="text-[#00E5FF] font-bold">{simulationSpeed.toFixed(1)}X</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="3"
                          step="0.1"
                          value={simulationSpeed}
                          onChange={(e) => onSetSimulationSpeed(parseFloat(e.target.value))}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
                        />
                      </div>

                      {/* Energy/Kinetic intensity */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-[10px] font-mono text-[#EAF2FF]/60">
                          <span className="uppercase font-semibold">KINETIC ENERGY SCALE:</span>
                          <span className="text-[#00FFB3] font-bold">{reactiveIntensity.toFixed(2)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="2.5"
                          step="0.05"
                          value={reactiveIntensity}
                          onChange={(e) => onSetReactiveIntensity(parseFloat(e.target.value))}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00FFB3]"
                        />
                      </div>
                    </div>

                    {/* Symmetrical divider */}
                    <div className="w-full h-[1px] bg-white/15" />

                    {/* Performance and diagnostics */}
                    <div className="flex flex-col gap-2.5">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-[#EAF2FF]/60 uppercase">SYSTEM DIAGNOSTICS HZ:</span>
                        <span className={`font-black tracking-widest text-[#00FFB3] font-bold`}>
                          {currentFps} FPS
                        </span>
                      </div>

                      <button
                        onClick={() => onChangeAdaptiveQuality(!adaptiveQuality)}
                        className={`w-full py-2 px-2 text-[10px] font-extrabold uppercase tracking-widest border transition-all cursor-pointer flex justify-between items-center bg-[#070B14] ${
                          adaptiveQuality
                            ? 'border-[#00E5FF]/40 text-[#00E5FF] hover:border-[#00E5FF]/70'
                            : 'border-white/10 text-[#EAF2FF]/40 hover:border-white/20'
                      }`}
                      >
                        <span>ADAPTIVE STABILIZATION:</span>
                        <span className="font-extrabold text-xs">{adaptiveQuality ? 'ENABLED' : 'DISABLED'}</span>
                      </button>

                      {adaptiveQuality && (
                        <div className="flex items-center gap-1.5 mt-0.5 px-2.5 py-1.5 rounded bg-black/40 text-[9px] font-mono border border-white/5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isLowPerfMode ? 'bg-[#FF9100] animate-pulse' : 'bg-[#00FFB3]'}`} />
                          <span className={isLowPerfMode ? 'text-[#FF9100]' : 'text-[#EAF2FF]/50'}>
                            {isLowPerfMode ? 'OPTIMIZED PERFORMANCE MODE ACTIVE' : 'AURA FLOW RATIO: PEAK CAPACITY'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Collapsible Panel 2: Cosmic Sector Telemetries & Anomaly Prober */}
                <div className="border border-white/10 rounded-sm bg-white/[0.015] overflow-hidden shadow-lg">
                  <button 
                    onClick={() => setScannerCollapsed(!scannerCollapsed)}
                    className="w-full p-4 flex items-center justify-between font-mono text-[10px] uppercase text-[#00FFB3] tracking-widest bg-white/[0.02] border-b border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="flex items-center gap-2 font-black">
                      <Compass className="w-4.5 h-4.5 text-[#00FFB3]" /> COSMIC SECTORS & SCANNER
                    </span>
                    {scannerCollapsed ? <ChevronDown className="w-4 h-4 text-white/50" /> : <ChevronUp className="w-4.5 h-4.5 text-[#00FFB3]" />}
                  </button>

                  <div className={`transition-all duration-300 overflow-hidden ${scannerCollapsed ? 'max-h-0' : 'max-h-[8000px] p-4 space-y-4'}`}>
                    {/* Scanner action trigger */}
                    <div className="p-3.5 bg-black/40 border border-[#FF1744]/20 rounded-sm flex flex-col gap-2.5 animate-fade-in text-[9px]">
                      {!isScanning ? (
                        <button
                          onClick={handleStartScan}
                          className="w-full py-2 bg-[#00E5FF]/10 border border-[#00E5FF]/40 hover:border-[#00E5FF] hover:bg-[#00E5FF]/20 text-[#00E5FF] text-[9.5px] uppercase font-mono tracking-widest font-black rounded-sm cursor-pointer transition-all hover:shadow-[0_0_12px_rgba(0,229,255,0.15)] flex justify-center items-center gap-2"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
                          <span>INITIATE ADVANCED DEEP VECTOR SCAN</span>
                        </button>
                      ) : (
                        <div className="flex flex-col gap-2 font-mono text-[9px]">
                          <div className="flex justify-between items-center text-[#00E5FF] font-semibold">
                            <span className="animate-pulse">PROBING COSMIC FILAMENTS...</span>
                            <span>{scanProgress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] transition-all duration-100"
                              style={{ width: `${scanProgress}%` }}
                            />
                          </div>
                          <span className="text-[7.5px] text-white/30 text-center uppercase tracking-wider">HARNESSING EM FIELD STEADY FLOW</span>
                        </div>
                      )}
                    </div>

                    {/* Scanned result card */}
                    {lastDiscovery && (
                      <div className="p-3.5 bg-[#00FFB3]/5 border border-[#00FFB3]/20 rounded-sm animate-fade-in flex flex-col gap-2">
                        <div className="flex items-center gap-1.5 text-[#00FFB3] text-[9.5px] font-mono font-bold uppercase">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>ANOMALY DETECTED:</span>
                        </div>
                        <div className="text-xs font-black text-white tracking-wide uppercase leading-tight font-sans mt-0.5">
                          {lastDiscovery.title}
                        </div>
                        <div className="text-[8.5px] font-mono text-[#00E5FF] font-bold">
                          {lastDiscovery.category.toUpperCase()} // UNLOCKED PATH
                        </div>
                        <p className="text-[10px] text-[#EAF2FF]/75 font-light leading-relaxed font-sans">
                          {lastDiscovery.desc}
                        </p>
                        {lastDiscovery.reactantA && (
                          <div className="mt-1 flex flex-col gap-1.5">
                            <div className="text-[8.5px] font-mono text-white/40 uppercase">VALENCE PAIRS STAGES:</div>
                            <div className="flex items-center justify-between text-[10.5px] font-mono bg-black/35 p-2 rounded border border-white/5">
                              <span className="text-[#00FFB3]">{lastDiscovery.pathway}</span>
                              <button
                                onClick={() => {
                                  onChangeAppMode('bond_lab');
                                  const reaction = REACTION_CONFIGS.find(r => r.reactants.includes(lastDiscovery.reactantA) && r.reactants.includes(lastDiscovery.reactantB));
                                  if (reaction) {
                                    onTriggerReaction(reaction);
                                  }
                                  setIsMoreActive(false); // Close drawer to focus on active reactants scene
                                }}
                                className="px-2 py-0.5 border border-[#00E5FF] text-[#00E5FF] rounded bg-[#070B14] hover:bg-[#00E5FF]/20 text-[9px] cursor-pointer transition-all whitespace-nowrap"
                              >
                                ENGAGE FUSION
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Diagnostics archive log summary */}
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="text-[8.5px] font-mono text-white/40 uppercase tracking-widest font-bold">
                        DIAGNOSTICS ARCHIVE LOG ({discoveredAnomalies.length}/5)
                      </div>
                      
                      {discoveredAnomalies.length === 0 ? (
                        <div className="border border-dashed border-white/10 rounded p-4 text-center text-[#EAF2FF]/35 font-sans font-light text-[10px]">
                          No sector anomalies scanned. Execute scans above to populate findings.
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1.5 overflow-y-auto max-h-36 pr-1">
                          {discoveredAnomalies.map((item, index) => (
                            <div 
                              key={index}
                              className="p-2 bg-[#0C1123]/90 border border-white/[0.06] rounded-sm flex flex-col gap-0.5 text-left font-mono text-[8.5px]"
                            >
                              <div className="flex justify-between w-full font-bold">
                                <span className="text-white/80 uppercase tracking-wide truncate max-w-[170px]">{item.title}</span>
                                <span className="text-[#00E5FF]">{item.category}</span>
                              </div>
                              <div className="text-[7.5px] text-white/40 leading-tight">PATHWAY: {item.pathway}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Symmetrical divider */}
                    <div className="w-full h-[1px] bg-white/10" />

                    {/* Sector tabs cockpit details */}
                    <div className="flex flex-col gap-2.5">
                      <div className="text-[8.5px] font-mono text-white/40 uppercase tracking-widest font-bold flex justify-between items-center">
                        <span>COSMIC REGIONAL ECOSYSTEMS</span>
                        <span className="text-[7px] text-[#00E5FF] font-black uppercase">GRID INTERACTION</span>
                      </div>

                      {/* Grid of Sector Tabs */}
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { name: 'Abyss', code: 'SEC-Ω', color: '#FF1744' },
                          { name: 'Plasma', code: 'SEC-E', color: '#FF9100' },
                          { name: 'Lattice', code: 'SEC-M', color: '#00FFB3' },
                          { name: 'Inert', code: 'SEC-N', color: '#00E5FF' },
                          { name: 'Storm', code: 'SEC-S', color: '#7C4DFF' },
                          { name: 'Anomaly', code: 'SEC-A', color: '#E040FB' }
                        ].map((sec, idx) => {
                          const isActive = activeSectorIndex === idx;
                          return (
                            <button
                              key={sec.code}
                              onClick={() => {
                                setActiveSectorIndex(idx);
                                window.dispatchEvent(new CustomEvent('cosmic-pulse', { detail: { intensity: 0.95 } }));
                                import('../utils/audioSynth').then(({ OrbitiumAudio }) => {
                                  OrbitiumAudio.playUnlockChime();
                                }).catch(() => {});
                              }}
                              className={`py-1.5 px-0.5 flex flex-col items-center justify-center rounded-sm transition-all cursor-pointer border text-center ${
                                isActive
                                  ? 'bg-white/5 font-black shadow-[inset_0_0_8px_rgba(255,255,255,0.05)] text-white'
                                  : 'border-white/5 bg-black/20 text-white/40 hover:text-white/70 hover:bg-white/5'
                              }`}
                              style={isActive ? { borderColor: sec.color, color: sec.color } : {}}
                            >
                              <span className="text-[9px] font-mono tracking-wider">{sec.code}</span>
                              <span className="text-[7px] opacity-75 capitalize truncate w-full">{sec.name}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected Sector Telemetry description */}
                      {(() => {
                        const sectMeta = [
                          { name: 'Radioactive Abyss', type: 'Transuranic Decay', code: 'SEC-Ω', color: '#FF1744', stats: { temp: '14.8M K', flux: '44.5 mSv', coherent: '12%' }, action: 'Boost Coils' },
                          { name: 'Plasma Energy Field', type: 'Beta Star Core Fusion', code: 'SEC-E', color: '#FF9100', stats: { temp: '150M K', flux: '1.24 G-deg', coherent: '98%' }, action: 'Ignite Fusion' },
                          { name: 'Metallic Lattice', type: 'Zero-Ohm Coherence', code: 'SEC-M', color: '#00FFB3', stats: { temp: '4.2 K', flux: '12.4 Tesla', coherent: '100%' }, action: 'Align Field' },
                          { name: 'Noble Void Envelope', type: 'Inert Buffer Barrier', code: 'SEC-N', color: '#00E5FF', stats: { temp: '77 K', flux: '0.002 bar', coherent: '99%' }, action: 'Saturate Buffer' },
                          { name: 'Molecular Storm', type: 'Pressure Condensation', code: 'SEC-S', color: '#7C4DFF', stats: { temp: '298 K', flux: '480 Atm', coherent: '45%' }, action: 'Squeeze Core' },
                          { name: 'Anomaly Warp Fields', type: 'Spacetime Gravitational Warp', code: 'SEC-A', color: '#E040FB', stats: { temp: '0 K', flux: 'G-Flux 1.14', coherent: '3.4%' }, action: 'Distort Space' }
                        ][activeSectorIndex];

                        if (!sectMeta) return null;

                        const noiseVal = Math.sin(Date.now() / 1500);
                        const noiseValCos = Math.cos(Date.now() / 2500);
                        const powerLevel = (84.5 + noiseVal * 4.2).toFixed(2);
                        const densityFlux = (1.142 + noiseValCos * 0.08).toFixed(3);

                        return (
                          <div className="p-3 bg-[#070B14]/75 border border-white/5 rounded-sm flex flex-col gap-2 animate-fade-in font-mono text-[9px] select-none text-left">
                            <div className="flex justify-between items-center text-[10px] font-bold" style={{ color: sectMeta.color }}>
                              <span className="capitalize">{sectMeta.name}</span>
                              <span className="text-[7.5px] px-1.5 py-0.5 bg-white/5 rounded uppercase font-normal">{sectMeta.type}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-1 py-1.5 border-t border-b border-white/[0.06] text-white/50">
                              <div>TEMP: <span className="text-white font-bold">{sectMeta.stats.temp}</span></div>
                              <div>FLUX: <span className="text-white font-bold">{sectMeta.stats.flux}</span></div>
                              <div>POWER: <span className="text-white font-bold">{powerLevel} GeV</span></div>
                              <div>DENSITY: <span className="text-white font-bold">{densityFlux} u³</span></div>
                            </div>

                            <div className="flex justify-between items-center mt-0.5">
                              <span className="text-white/40 text-[7px] uppercase tracking-wider">COHERENCE STATUS:</span>
                              <span className="font-extrabold text-[8px]" style={{ color: sectMeta.color }}>{sectMeta.stats.coherent} INGRESS</span>
                            </div>

                            <button
                              onClick={() => {
                                window.dispatchEvent(new CustomEvent('cosmic-pulse', { detail: { intensity: 1.85 } }));
                                import('../utils/audioSynth').then(({ OrbitiumAudio }) => {
                                  OrbitiumAudio.playUnlockChime();
                                }).catch(() => {});
                                const actMsg = `${sectMeta.code} OVERDRIVE: ${sectMeta.action.toUpperCase()} COMMENCED. METRICS BALANCED.`;
                                setLiveQuantumEvents(prev => [actMsg, ...prev.slice(0, 7)]);
                              }}
                              className="w-full mt-1.5 py-1.5 bg-white/5 hover:bg-white/12 hover:text-white transition-all text-white/70 border border-white/10 rounded-sm cursor-pointer uppercase font-extrabold text-[8px] tracking-widest text-center"
                            >
                              ENGAGE CORE: {sectMeta.action}
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Collapsible Panel 3: Reaction Registry Synthesizer list & Live logs */}
                <div className="border border-white/10 rounded-sm bg-white/[0.015] overflow-hidden shadow-lg">
                  <button 
                    onClick={() => setSynthesizerCollapsed(!synthesizerCollapsed)}
                    className="w-full p-4 flex items-center justify-between font-mono text-[10px] uppercase text-[#00FFB3] tracking-widest bg-white/[0.02] border-b border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="flex items-center gap-2 font-black">
                      <Flame className="w-4.5 h-4.5 text-[#00FFB3]" /> REACTION SYNTHESIZER
                    </span>
                    {synthesizerCollapsed ? <ChevronDown className="w-4 h-4 text-white/50" /> : <ChevronUp className="w-4.5 h-4.5 text-[#00FFB3]" />}
                  </button>

                  <div className={`transition-all duration-300 overflow-hidden ${synthesizerCollapsed ? 'max-h-0' : 'max-h-[9000px] p-4 space-y-4'}`}>
                    {/* Reaction options */}
                    <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                      {REACTION_CONFIGS.map((re, rIdx) => (
                        <div 
                          key={rIdx} 
                          className="p-2.5 bg-white/5 border border-white/10 rounded-sm flex flex-col justify-between items-start gap-1 hover:border-white/25 transition-colors group"
                        >
                          <div className="flex justify-between w-full items-center">
                            <span className="text-[11px] font-extrabold text-[#EAF2FF]/90 group-hover:text-[#00E5FF] transition-colors">{re.productFormula}</span>
                            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#070B14] text-[#EAF2FF]/40">{re.visualType.toUpperCase()}</span>
                          </div>
                          <div className="text-[10px] text-[#EAF2FF]/50">{re.productName}</div>
                          
                          <button
                            onClick={() => {
                              handleReactionInit(re);
                              setIsMoreActive(false); // Close drawer to focus on active reactants scene
                            }}
                            className="mt-1.5 w-full py-1 bg-[#0A0D1A] border border-white/15 hover:border-[#00FFB3] hover:text-[#00FFB3] text-[9.5px] uppercase tracking-wider font-bold transition-all cursor-pointer text-center text-[#EAF2FF]/70"
                          >
                            SYNTHESIZE IN 3D FIELD
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Symmetrical divider */}
                    <div className="w-full h-[1px] bg-white/10" />

                    {/* Live events ticker */}
                    <div className="space-y-2">
                      <div className="text-[8.5px] font-mono uppercase text-[#00E5FF] tracking-widest flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00FFB3] animate-ping" />
                          COSMOS CHRONO-MONITOR
                        </span>
                        <span className="text-[7px] text-white/30">sys.matter_clock()</span>
                      </div>

                      <div className="flex flex-col gap-1.5 pr-1 mt-0.5 max-h-36 overflow-y-auto">
                        {liveQuantumEvents.map((evt, idx) => (
                          <div 
                            key={idx} 
                            className={`text-[8px] font-mono leading-relaxed p-1.5 bg-[#070B14]/80 border ${
                              idx === 0 
                                ? 'text-[#00FFB3] border-[#00FFB3]/25 shadow-[inset_0_0_6px_rgba(0,255,179,0.05)]' 
                                : 'text-[#EAF2FF]/50 border-white/5'
                            } rounded-sm animate-fade-in`}
                          >
                            <span className="text-white/20 mr-1">[{new Date(Date.now() - idx * 8000).toLocaleTimeString([], { hour12: false })}]</span>
                            {evt}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer of the Drawer */}
          <div className="p-4 border-t border-white/10 bg-black/35 flex items-center justify-between font-mono text-[8px] text-[#EAF2FF]/45">
            <div>CONSOLE STATE: <span className="text-[#00FFB3] font-bold">SECURE ACCESSED</span></div>
            <div>STATION LINK: <span className="text-[#00E5FF] font-bold">STABLE TETHERED</span></div>
          </div>
        </div>

        {/* MIDDLE OVERLAY DELETED - IT NOW LIVES IN ZONE 4 RIGHT RAIL FOR BOND LAB */}

        {/* SUBATOMIC SHELL ANALYZER REMOVED - integrated directly into ElementWorldUI array */}

        {/* =======================================================
            CELESTIAL ATLAS OBSERVATORY MASTER DASHBOARD
            ======================================================= */}
        {isObsEntered && appMode === 'observatory' && !selectedElement && (
          <div className="flex-1 w-full flex flex-col justify-between p-4 bg-transparent pointer-events-auto overflow-hidden max-h-[85vh] md:max-h-[calc(100vh-130px)] select-none">
            <ObservatoryHub
              onSelectElementBySymbol={(symbol) => {
                const found = ELEMENTS_DATA.find(e => e.symbol === symbol);
                if (found) {
                  onSelectElement(found);
                }
              }}
              onScaleChange={(scaleId) => {
                // Trigger customized physical particle waves across visualizers
                window.dispatchEvent(new CustomEvent('cosmic-pulse', { detail: { intensity: 1.55 } }));
              }}
            />
          </div>
        )}

        {/* =======================================================
            BLOCKS FOUNDATION EXPERIENCE
            ======================================================= */}
        {isObsEntered && appMode === 'blocks' && !selectedElement && (
          <BlocksUniverse 
             onSelectElement={onSelectElement} 
             onNavigateHome={() => onChangeAppMode('observatory')} 
          />
        )}

        {/* =======================================================
            ORBITIUM KNOWLEDGE NETWORK
            ======================================================= */}
        {isObsEntered && appMode === 'network' && !selectedElement && (
          <OrbitiumNetwork
             onSelectElement={onSelectElement}
             onNavigateHome={() => onChangeAppMode('blocks')}
          />
        )}

        {/* =======================================================
            ZONE 3: HOME CONTEXT PANEL (QUICK EXPLORE)
            ======================================================= */}
        {isObsEntered && appMode === 'explorer' && !selectedElement && (
          <div className="absolute left-6 top-24 bottom-24 w-[340px] pointer-events-auto flex flex-col animate-fade-in z-30 space-y-4 justify-end">
            {/* Quick Explore Quick-Links */}
            <div className="bg-[#050812]/90 backdrop-blur-2xl border-l-[3px] border-[#00E5FF]/40 shadow-[0_0_20px_rgba(0,0,0,0.8)] rounded-r-lg p-5 flex flex-col max-h-[85vh]">
              <div className="text-[10px] font-mono tracking-[0.2em] text-[#00E5FF]/80 mb-3 uppercase flex items-center gap-2">
                <Compass className="w-3.5 h-3.5" /> QUICK EXPLORE
              </div>
              <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2 pb-2">
                {[
                  { label: "Life's Essentials (CHNOPS)", action: () => window.dispatchEvent(new CustomEvent('orbitium-search', { detail: { query: 'chnops' } })) },
                  { label: "Noble Gases", action: () => window.dispatchEvent(new CustomEvent('orbitium-search', { detail: { query: 'noble' } })) },
                  { label: "Precious Metals", action: () => window.dispatchEvent(new CustomEvent('orbitium-search', { detail: { query: 'precious' } })) },
                  { label: "Radioactive Core", action: () => window.dispatchEvent(new CustomEvent('orbitium-search', { detail: { query: 'radioactive' } })) },
                  { label: "Modern Semiconductors", action: () => window.dispatchEvent(new CustomEvent('orbitium-search', { detail: { query: 'semiconductor' } })) }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={item.action}
                    className="flex justify-between items-center text-left px-3 py-2.5 bg-white/5 hover:bg-[#00E5FF]/10 text-white/50 hover:text-white border border-white/5 hover:border-[#00E5FF]/30 transition-all rounded-sm cursor-pointer group"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-wider">{item.label}</span>
                    <ArrowRight className="w-3 h-3 text-white/20 group-hover:text-[#00E5FF] transition-colors -translate-x-2 group-hover:translate-x-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ELITE COCKPIT: SPATIAL HOLOGRAPHIC HUD PANELS (ELEMENT WORLD EXPERIENCE) */}
        {isObsEntered && selectedElement && !compareElement && (
          <div 
            className="absolute inset-0 z-30 select-none pointer-events-none flex flex-col justify-between"
            style={{
              '--primary-color': getCatMeta(selectedElement.category || 'reactive-nonmetal').hex,
              '--primary-color-alpha': `${getCatMeta(selectedElement.category || 'reactive-nonmetal').hex}38`
            } as React.CSSProperties}
          >
            <ElementWorldUI 
              selectedElement={selectedElement}
              onSelectElement={onSelectElement}
              onSelectCompareElement={onSelectCompareElement}
              setCompareSelectorOpen={setCompareSelectorOpen}
              setActiveShellInfo={setActiveShellInfo}
              activeShellInfo={activeShellInfo}
            />
          </div>
        )}


        {/* =======================================================
            UNIVERSAL KNOWLEDGE ZONE FOR TIMELINE / MOLECULAR / BOND LAB (ZONE 4)
            ======================================================= */}
        {!selectedElement && isObsEntered && (appMode === 'timeline' || appMode === 'bond_lab' || appMode === 'molecular') && (
          <div className="absolute right-6 top-24 bottom-24 w-[480px] pointer-events-auto flex flex-col animate-fade-in-right z-40 pb-6">
            <div className="bg-[#040814]/85 backdrop-blur-3xl border border-[#00E5FF]/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-lg overflow-hidden flex flex-col flex-1 h-[80%] max-h-[85vh] p-5 custom-scrollbar select-none">
              
              {/* 1. DISCOVERY TIMELINE PANEL CONTROLS */}
              {appMode === 'timeline' && (
              <>
                {/* Collapsible Panel 1: Chrono Metrics */}
                <div className="border border-white/10 rounded-sm bg-white/[0.01] overflow-hidden">
                  <button 
                    onClick={() => setChronoMetricsCollapsed(!chronoMetricsCollapsed)}
                    className="w-full p-4 flex items-center justify-between font-mono text-[10px] uppercase text-[#00FFB3] tracking-widest bg-white/[0.02] border-b border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="flex items-center gap-2 font-black">
                      <TrendingUp className="w-4 h-4 text-[#00FFB3]" /> CHRONO METRICS SCAN
                    </span>
                    {chronoMetricsCollapsed ? <ChevronDown className="w-4 h-4 text-white/50" /> : <ChevronUp className="w-4.5 h-4.5 text-[#00FFB3]" />}
                  </button>

                  <div className={`transition-all duration-300 overflow-hidden ${chronoMetricsCollapsed ? 'max-h-0' : 'max-h-[500px] p-4 space-y-3'}`}>
                    <div className="p-3 bg-[#0B1020]/80 border border-white/5 rounded-sm flex flex-col gap-1.5">
                      <div className="text-[9px] text-[#EAF2FF]/50 uppercase tracking-wider font-mono">SELECTED FOCUS YEAR:</div>
                      <div className="text-xl font-bold text-[#00E5FF] font-mono">
                        {timelineYear < 0 ? `${Math.abs(timelineYear)} BC` : `${timelineYear} AD`}
                      </div>
                      <div className="text-[11px] text-[#EAF2FF]/80 leading-normal font-light">
                        {getPeriodDescription(timelineYear)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 bg-white/[0.03] border border-white/5 rounded-sm text-center">
                        <div className="text-lg font-bold font-mono text-[#00FFB3]">{totalDiscoveredCount}</div>
                        <div className="text-[7.5px] text-[#EAF2FF]/40 font-mono uppercase tracking-widest">DISCOVERED</div>
                      </div>
                      <div className="p-2.5 bg-white/[0.03] border border-white/5 rounded-sm text-center">
                        <div className="text-lg font-bold font-mono text-white/40">{118 - totalDiscoveredCount}</div>
                        <div className="text-[7.5px] text-[#EAF2FF]/40 font-mono uppercase tracking-widest">UNDISCOVERED</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Collapsible Panel 2: Epoch Period Deck */}
                <div className="border border-white/10 rounded-sm bg-white/[0.01] overflow-hidden">
                  <button 
                    onClick={() => setEpochDeckCollapsed(!epochDeckCollapsed)}
                    className="w-full p-4 flex items-center justify-between font-mono text-[10px] uppercase text-[#00E5FF] tracking-widest bg-white/[0.02] border-b border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="flex items-center gap-2 font-black">
                      <Compass className="w-4 h-4 text-[#00E5FF]" /> HISTORIC STELLAR EPOCHS
                    </span>
                    {epochDeckCollapsed ? <ChevronDown className="w-4 h-4 text-white/50" /> : <ChevronUp className="w-4.5 h-4.5 text-[#00FFB3]" />}
                  </button>

                  <div className={`transition-all duration-300 overflow-hidden ${epochDeckCollapsed ? 'max-h-0' : 'max-h-[500px] p-4'}`}>
                    <div className="text-[9px] font-mono text-[#EAF2FF]/40 mb-2 uppercase tracking-wider">
                      QUICK PERIOD DECK:
                    </div>
                    <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
                      {epochs.map((ep) => (
                        <button
                          key={ep.name}
                          onClick={() => {
                            onChangeTimelineYear(ep.year);
                            setIsPlayingTimeline(false);
                          }}
                          className={`p-2 border rounded-sm flex items-center justify-between text-left cursor-pointer transition-all ${
                            (ep.year <= timelineYear && (timelineYear === ep.year || (epochs.findIndex(e => e.name === ep.name) < epochs.length - 1 && timelineYear < epochs[epochs.findIndex(e => e.name === ep.name) + 1].year)))
                              ? 'bg-[#00FFB3]/10 border-[#00FFB3] text-[#00FFB3]'
                              : 'bg-[#070B14] border-white/10 text-[#EAF2FF]/70 hover:border-white/20'
                          }`}
                        >
                          <div>
                            <div className="text-[9.5px] font-bold uppercase tracking-wider">{ep.name}</div>
                            <div className="text-[8px] text-[#EAF2FF]/50 font-light truncate max-w-[200px]">{ep.desc}</div>
                          </div>
                          <span className="text-[9px] font-mono font-bold">
                            {ep.year < 0 ? `${Math.abs(ep.year)} BC` : `${ep.year}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 2. BOND REACTOR PANEL CONTROLS */}
            {appMode === 'bond_lab' && (
              <>
                {/* Collapsible Panel 1: Chemistry Molecules Registry & Sandbox Mixing Chamber */}
                <div className="border border-white/10 rounded-sm bg-white/[0.015] overflow-hidden">
                  <div className="p-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-black text-[#FF9100] tracking-widest text-[#FF9100]">
                      <Flame className="w-4.5 h-4.5 text-[#FF9100]" /> BOND CHAMBER LAB
                    </span>
                    <button 
                      onClick={() => setBondFormulaCollapsed(!bondFormulaCollapsed)}
                      className="text-white/50 hover:text-white cursor-pointer"
                    >
                      {bondFormulaCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4 text-[#FF9100]" />}
                    </button>
                  </div>

                  <div className={`transition-all duration-300 overflow-hidden ${bondFormulaCollapsed ? 'max-h-0' : 'max-h-[1400px] p-4'}`}>
                    
                    {/* Tab Selection */}
                    <div className="grid grid-cols-2 gap-2 mb-3.5 border-b border-white/5 pb-3">
                      <button
                        onClick={() => setBondLabTab('registry')}
                        className={`py-1.5 px-2 bg-black/40 border text-[9.5px] font-mono tracking-wider font-extrabold transition-all cursor-pointer ${
                          bondLabTab === 'registry' 
                            ? 'border-[#FF9100] text-[#FF9100] shadow-[0_0_8px_rgba(255,145,0,0.15)] bg-[#FF9100]/5' 
                            : 'border-white/5 text-[#EAF2FF]/55 hover:border-white/15'
                        }`}
                      >
                        [ MOLECULAR CATALOG ]
                      </button>
                      <button
                        onClick={() => setBondLabTab('sandbox')}
                        className={`py-1.5 px-2 bg-black/40 border text-[9.5px] font-mono tracking-wider font-extrabold transition-all cursor-pointer ${
                          bondLabTab === 'sandbox' 
                            ? 'border-[#7C4DFF] text-[#7C4DFF] shadow-[0_0_8px_rgba(124,77,255,0.15)] bg-[#7C4DFF]/5' 
                            : 'border-white/5 text-[#EAF2FF]/55 hover:border-white/15'
                        }`}
                      >
                        [ PARTNER SANDBOX ]
                      </button>
                    </div>

                    {bondLabTab === 'registry' ? (
                      <>
                        <p className="text-[10px] text-[#EAF2FF]/60 leading-relaxed font-light mb-3 font-sans">
                          Select a molecular formula from the synthesized registry below to construct the reactants in 3D, then drag them together to observe orbital bonding.
                        </p>

                        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                          {REACTION_CONFIGS.map((re, rIdx) => {
                            const isSelected = activeReaction?.productFormula === re.productFormula;
                            return (
                              <button
                                key={rIdx}
                                onClick={() => handleReactionInit(re)}
                                className={`p-2.5 rounded-sm flex flex-col justify-between items-start text-left gap-1 border transition-all cursor-pointer group ${
                                  isSelected 
                                    ? 'bg-[#FF9100]/10 border-[#FF9100] text-[#FF9100] shadow-[0_0_12px_rgba(255,145,0,0.15)]'
                                    : 'bg-white/5 border-white/10 text-[#EAF2FF]/70 hover:border-white/20'
                                }`}
                              >
                                <div className="flex justify-between w-full items-center">
                                  <span className="text-[11px] font-extrabold tracking-wider group-hover:text-[#FF9100] transition-colors">{re.productFormula}</span>
                                  <span className={`text-[7px] font-mono px-1 py-0.5 rounded ${
                                    re.visualType === 'covalent' ? 'bg-blue-900/30 text-blue-400' :
                                    re.visualType === 'ionic' ? 'bg-green-900/30 text-green-400' :
                                    'bg-red-900/30 text-red-500 font-extrabold'
                                  }`}>{re.visualType.toUpperCase()}</span>
                                </div>
                                <div className="text-[9.5px] font-mono leading-tight">{re.productName}</div>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      /* SANDBOX MIXING CHAMBER MODE */
                      <div className="space-y-3 font-mono">
                        <p className="text-[10px] text-[#EAF2FF]/60 leading-relaxed font-light mb-2 font-sans">
                          Manually select any two elements from the periodic matrix below to compute their bonding affinity, orbital types, and real-world compound properties.
                        </p>

                        {/* Dropdown Selectors */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col gap-1">
                            <span className="text-[6.5px] text-white/40 uppercase font-black">REACTANT ALPHA:</span>
                            <select
                              value={sandboxA}
                              onChange={(e) => setSandboxA(e.target.value)}
                              className="w-full bg-[#0A0D14] border border-white/10 p-2 text-[#00FFB3] font-bold text-[10.5px] rounded outline-none cursor-pointer hover:border-white/25 transition-colors"
                            >
                              {ELEMENTS_DATA.slice(0, 92).map(el => (
                                <option key={el.symbol} value={el.symbol} className="bg-[#0A0D14] text-white font-mono">
                                  {el.symbol} - {el.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[6.5px] text-white/40 uppercase font-black">REACTANT BETA:</span>
                            <select
                              value={sandboxB}
                              onChange={(e) => setSandboxB(e.target.value)}
                              className="w-full bg-[#0A0D14] border border-white/10 p-2 text-[#00E5FF] font-bold text-[10.5px] rounded outline-none cursor-pointer hover:border-white/25 transition-colors"
                            >
                              {ELEMENTS_DATA.slice(0, 92).map(el => (
                                <option key={el.symbol} value={el.symbol} className="bg-[#0A0D14] text-white font-mono">
                                  {el.symbol} - {el.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Interactive Prediction Board */}
                        {(() => {
                          const result = analyzeReaction(sandboxA, sandboxB);

                          return (
                            <div className="space-y-3.5 bg-black/40 border border-[#7C4DFF]/20 p-3 rounded-sm animate-fade-in text-[9.5px]">
                              
                              {/* Element-to-Material Tracing Conduit Flow */}
                              <div className="flex items-center justify-between p-2 bg-white/[0.02] border border-white/5 rounded-sm">
                                <div className="flex flex-col items-center flex-1">
                                  <span className="text-[#00FFB3] font-extrabold text-[12px]">{sandboxA}</span>
                                  <span className="text-white/30 text-[6.5px] tracking-wider mt-0.5">ELEMENT A</span>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-white/10" />
                                <div className="flex flex-col items-center flex-1">
                                  <span className="text-[#00E5FF] font-extrabold text-[12px]">{sandboxB}</span>
                                  <span className="text-white/30 text-[6.5px] tracking-wider mt-0.5">ELEMENT B</span>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-[#7C4DFF]/50" />
                                <div className="flex flex-col items-center flex-1.5">
                                  <span className="text-[#FF9100] font-black text-[12px] truncate max-w-[80px]">{result.productFormula}</span>
                                  <span className="text-white/30 text-[6.5px] tracking-wider mt-0.5">COMPOUND</span>
                                </div>
                              </div>

                              {/* Prediction Status and Type */}
                              <div className="space-y-1.5 leading-tight">
                                <div className="flex justify-between items-center text-[8.5px]">
                                  <span className="text-white/30 uppercase">BOND COEFFICIENT:</span>
                                  <span className={`px-1.5 py-0.5 rounded font-black ${
                                    result.visualType === 'ionic' ? 'bg-green-500/10 text-green-400' :
                                    result.visualType === 'explosion' ? 'bg-red-500/10 text-red-400' :
                                    'bg-[#00E5FF]/10 text-[#00E5FF]'
                                  }`}>
                                    {result.visualType.toUpperCase()} AFFINITY
                                  </span>
                                </div>
                                <div className="text-[11.5px] font-black text-[#EAF2FF]/95 leading-normal">{result.productName}</div>
                                <p className="text-[#EAF2FF]/60 text-[9px] font-sans font-light leading-relaxed mt-1">
                                  {result.description}
                                </p>
                              </div>

                              {/* Material Conversion Info */}
                              {result.resultingMaterial && (
                                <div className="border-t border-white/5 pt-2 flex flex-col gap-0.5">
                                  <span className="text-[7.5px] text-white/30 uppercase font-black">RESULTING PHYSICAL MATERIAL:</span>
                                  <span className="text-[#00FFB3] font-sans font-medium text-[9.5px] leading-snug">{result.resultingMaterial}</span>
                                </div>
                              )}

                              {/* Synthesize Button */}
                              <button
                                onClick={() => {
                                  handleReactionInit(result);
                                  setIsMoreActive(false); // Focus on active scene
                                }}
                                className="w-full py-2 bg-[#7C4DFF]/15 border border-[#7C4DFF]/40 hover:border-[#00FFB3] text-[#EAF2FF]/90 hover:text-[#00FFB3] font-mono font-bold text-[9px] tracking-wider uppercase transition-all duration-200 cursor-pointer text-center rounded-sm"
                              >
                                ENGAGE REACTOR MATRIX
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Active Reaction Tracking */}
                    {activeReaction && (
                      <div className="mt-3.5 p-3 bg-black/40 border border-[#FF9100]/20 rounded-sm flex flex-col gap-1.5 animate-fade-in font-mono text-[9px]">
                        <div className="text-[8px] text-[#FF9100] uppercase tracking-wider font-extrabold flex items-center justify-between">
                          <span>3D REACTOR FEED:</span>
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-ping" />
                        </div>
                        <div className="flex justify-between text-[#EAF2FF]/75">
                          <span>REACTANT ALPHA:</span>
                          <span className="font-bold text-[#00FFB3]">{activeReaction.reactants[0]}</span>
                        </div>
                        <div className="flex justify-between text-[#EAF2FF]/75">
                          <span>REACTANT BETA:</span>
                          <span className="font-bold text-[#00E5FF]">{activeReaction.reactants[1]}</span>
                        </div>
                        
                        <div className="text-[8px] sm:text-[9px] font-mono bg-[#00E5FF]/10 border border-[#00E5FF]/20 px-2 py-1 rounded-sm text-[#00E5FF]/90 tracking-widest uppercase shadow-[0_0_10px_rgba(0,229,255,0.1)] w-full my-1">
                          TARGET: <span className="font-extrabold text-[#00FFF0]">{activeReaction.productFormula}</span>
                        </div>

                        {reactionStage === 'idle' && (
                          <div className="text-[#FF9100] text-[8px] uppercase tracking-widest bg-[#FF9100]/10 p-1.5 text-center border border-[#FF9100]/30 rounded-sm mb-1 animate-pulse">
                            Drag reactants together to fuse
                          </div>
                        )}

                        <div className="w-full h-[1px] bg-white/10 my-0.5" />
                        <div className="flex justify-between text-[#EAF2FF]/95">
                          <span>TETHER LINK CLAMP:</span>
                          <span className={`font-black uppercase ${liveDistance && liveDistance < 2.5 ? 'text-red-500 animate-pulse' : 'text-[#00FFB3]'}`}>
                            {liveDistance ? `${liveDistance.toFixed(2)} Å` : 'AWAITING LOCK'}
                          </span>
                        </div>
                        {liveDistance && (
                          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-0.5 mb-2">
                            <div 
                              className={`h-full transition-all duration-100 ${liveDistance < 2.5 ? 'bg-red-500' : 'bg-[#00FFB3]'}`}
                              style={{ width: `${Math.max(0, Math.min(100, (1 - (liveDistance / 12)) * 100))}%` }}
                            />
                          </div>
                        )}
                        
                        <button
                          onClick={handleCancelReaction}
                          className="w-full px-4 py-1.5 bg-[#0C1123]/80 border border-red-500/40 hover:border-red-500 text-[8px] font-mono tracking-[0.2em] text-red-400 font-extrabold uppercase transition-all rounded-sm cursor-pointer hover:bg-red-500/15"
                        >
                          ABORT SEQUENCE
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Collapsible Panel 2: Diagnostics Workstation & Rich Compound Exploration */}
                {activeReaction && (
                  <div className="border border-[#FF9100]/30 rounded-sm bg-white/[0.01] overflow-hidden">
                    <button 
                      onClick={() => setBondDiagnosticsCollapsed(!bondDiagnosticsCollapsed)}
                      className="w-full p-4 flex items-center justify-between font-mono text-[10px] uppercase text-[#00FFB3] tracking-widest bg-[#FF9100]/5 border-b border-[#FF9100]/25 cursor-pointer hover:bg-[#FF9100]/10 transition-colors"
                    >
                      <span className="flex items-center gap-2 font-black font-mono">
                        <Activity className="w-4 h-4 text-[#00FFB3]" /> REACTION DIAGNOSTICS DECK
                      </span>
                      {bondDiagnosticsCollapsed ? <ChevronDown className="w-4 h-4 text-white/50" /> : <ChevronUp className="w-4.5 h-4.5 text-[#00FFB3]" />}
                    </button>

                    <div className={`transition-all duration-300 overflow-hidden ${bondDiagnosticsCollapsed ? 'max-h-0' : 'max-h-[1600px] p-4 space-y-4 font-mono text-[10px]'}`}>
                      {/* Reaction Summary block */}
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-sm border border-white/10">
                        <div className="flex flex-col gap-0.5">
                          <div className="text-[7.5px] font-mono text-[#FF9100] tracking-wider uppercase font-black">COMPLETED COMPOUND:</div>
                          <div className="text-[13px] font-extrabold text-[#EAF2FF] tracking-wide leading-none mt-1 font-sans">{activeReaction.productName}</div>
                        </div>
                        <div className="text-[15px] font-black font-mono text-[#00E5FF]">{activeReaction.productFormula}</div>
                      </div>

                      {activeReaction.whyItMatters && (
                        /* REAL-WORLD CONTEXT PRIMARY CALLOUT (WHY DOES THIS MATTER?) */
                        <div className="p-3 bg-gradient-to-r from-[#FF9100]/20 via-[#FF9100]/5 to-transparent border-l-2 border-[#FF9100] rounded-r text-justify leading-relaxed">
                          <span className="text-[7.5px] text-[#FF9100] block font-black uppercase font-mono tracking-widest mb-1">
                            WHY DOES THIS MATTER?
                          </span>
                          <p className="text-[#EAF2FF]/95 text-[9.5px] font-sans font-light leading-relaxed italic">
                            "{activeReaction.whyItMatters}"
                          </p>
                        </div>
                      )}

                      {/* Scientific & Industrial Specifications */}
                      <div className="space-y-3 font-mono">
                        {/* Reaction Conditions */}
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] text-white/30 font-black uppercase">REACTION CONDITIONS:</span>
                          <span className="text-[#00E5FF] text-[9.5px] leading-snug font-sans font-medium px-2.5 py-1.5 bg-black/40 rounded-sm border border-[#00E5FF]/15">
                            {activeReaction.conditions || 'Standard temperature grid, high vacuum or thermal arc trigger.'}
                          </span>
                        </div>

                        {/* Resulting crystallite structure */}
                        {activeReaction.structure && (
                          <div className="flex flex-col gap-1">
                            <span className="text-[8px] text-white/30 font-black uppercase">CRYSTAL BOUND STRUCT:</span>
                            <span className="text-[#00FFB3] text-[9.5px] font-sans font-medium px-2.5 py-1.5 bg-black/40 rounded-sm border border-[#00FFB3]/15">
                              {activeReaction.structure}
                            </span>
                          </div>
                        )}

                        {/* Side-by-Side Properties and Key Uses */}
                        <div className="grid grid-cols-2 gap-3.5">
                          <div className="flex flex-col gap-1">
                            <span className="text-[8px] text-white/30 font-black uppercase">PROPERTIES:</span>
                            <div className="flex flex-col gap-1 font-sans text-[#EAF2FF]/75 text-[9px] font-light italic leading-snug">
                              {(activeReaction.properties || ['Ionic cohesion', 'Stable molecular crystal']).slice(0, 3).map((p, idx) => (
                                <div key={idx} className="flex gap-1.5 items-start">
                                  <span className="text-[#FF9100]">•</span>
                                  <span>{p}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <span className="text-[8px] text-white/30 font-black uppercase">PRACTICAL USES:</span>
                            <div className="flex flex-col gap-1 font-sans text-[#EAF2FF]/75 text-[9px] font-light italic leading-snug">
                              {(activeReaction.uses || ['Industrial application', 'Structural catalyst']).slice(0, 3).map((u, idx) => (
                                <div key={idx} className="flex gap-1.5 items-start font-mono">
                                  <span className="text-[#00FFB3]">•</span>
                                  <span>{u}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Neon Capsule Pill Badges for Real World Applications */}
                        {activeReaction.realWorldApplications && (
                          <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
                            <span className="text-[8px] text-white/30 font-black uppercase">REAL-WORLD MATERIALS & SYSTEMS:</span>
                            <div className="flex flex-wrap gap-1.5 mt-0.5 font-mono">
                              {activeReaction.realWorldApplications.map((app, idx) => (
                                <span 
                                  key={idx} 
                                  className="px-2 py-0.5 font-sans font-bold text-[8.5px] bg-[#FF9100]/5 border border-[#FF9100]/25 rounded-full text-[#FF9100]"
                                >
                                  {app}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* MOLECULAR UNIVERSE CONTROLS */}
            {appMode === 'molecular' && (
              <>
                <div className="border border-[#7C4DFF]/30 rounded-sm bg-[#7C4DFF]/[0.02] overflow-hidden">
                  <div className="p-3 bg-[#7C4DFF]/[0.05] border-b border-[#7C4DFF]/20 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-black text-[#7C4DFF] tracking-widest">
                      <Hexagon className="w-4 h-4 text-[#7C4DFF]" /> MOLECULAR UNIVERSE
                    </span>
                  </div>
                  <div className="p-4 space-y-4">
                    <p className="text-[10px] text-[#EAF2FF]/60 leading-relaxed font-light font-sans">
                      Explore the building blocks of the universe. Select a molecule or material to inspect its 3D atomic structure, geometric formulation, and real-world domain.
                    </p>

                    <div className="flex justify-between items-center bg-black/40 p-2 rounded-sm border border-white/5">
                      <span className="text-[9px] font-mono text-white/50 uppercase font-black">Spatial Explosion</span>
                      <button
                        onClick={() => onSetExplodedView?.(!isExplodedView)}
                        className={`text-[9.5px] font-mono tracking-wider font-extrabold uppercase px-3 py-1 cursor-pointer transition-colors border rounded-sm ${
                          isExplodedView 
                            ? 'bg-[#FF9100]/20 text-[#FF9100] border-[#FF9100]' 
                            : 'bg-white/5 text-white/50 border-white/10 hover:border-[#FF9100]/50'
                        }`}
                      >
                        {isExplodedView ? 'Collapse' : 'Explode'}
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1">
                      {['molecule', 'biology', 'material'].map((cat) => (
                        <div key={cat} className="mb-2">
                           <div className="text-[8px] font-mono text-[#00E5FF] tracking-widest font-black uppercase mb-1 border-b border-[#00E5FF]/20 pb-1">
                             {cat === 'molecule' ? 'Elemental Molecules' : cat === 'biology' ? 'Molecular Biology' : 'Materials & Lattices'}
                           </div>
                           <div className="flex flex-col gap-1.5">
                             {MOLECULAR_DATABASE.filter(m => m.category === cat).map((mol) => {
                               const isActive = selectedMoleculeId === mol.id;
                               return (
                                 <button
                                   key={mol.id}
                                   onClick={() => onSelectMoleculeId?.(mol.id)}
                                   className={`p-2.5 rounded-sm flex flex-col justify-between items-start text-left gap-1 border transition-all cursor-pointer group ${
                                     isActive 
                                       ? 'bg-[#7C4DFF]/20 border-[#7C4DFF] shadow-[0_0_12px_rgba(124,77,255,0.25)]'
                                       : 'bg-white/5 border-white/10 hover:border-[#7C4DFF]/50'
                                   }`}
                                 >
                                   <div className="flex justify-between w-full items-center">
                                      <span className={`text-[11px] font-black tracking-wider ${isActive ? 'text-white' : 'text-[#7C4DFF] group-hover:text-white'}`}>{mol.name}</span>
                                      <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-black/50 text-[#00E5FF] border border-[#00E5FF]/20">{mol.formula}</span>
                                   </div>
                                   <span className="text-[9px] font-sans font-light text-white/50">{mol.description}</span>
                                   <div className="text-[7.5px] font-mono text-[#FF9100] mt-0.5 tracking-wider w-full text-right">{mol.worldType.toUpperCase()}</div>
                                 </button>
                               )
                             })}
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            </div>
          </div>
        )}

        {/* COMPARE SELECTOR MODAL */}
        {compareSelectorOpen && (
          <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-lg flex items-center justify-center p-4 pointer-events-auto shadow-2xl">
            <div className="w-full max-w-lg bg-[#070C1B] border border-[#00E5FF]/40 rounded-sm p-6 shadow-[0_0_50px_rgba(0,229,255,0.15)] flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-2">
                <h3 className="text-xl font-bold font-mono tracking-widest text-[#00E5FF]">SELECT ELEMENT TO COMPARE</h3>
                <button 
                  onClick={() => setCompareSelectorOpen(false)}
                  className="text-white/50 hover:text-white"
                >
                  ✖
                </button>
              </div>
              <input
                type="text"
                placeholder="Search by name or symbol..."
                value={compareSearchQuery}
                onChange={(e) => setCompareSearchQuery(e.target.value)}
                className="w-full bg-[#030610] text-[#00E5FF] px-4 py-3 rounded-sm border border-white/10 font-mono text-sm focus:outline-none focus:border-[#00E5FF]/50 uppercase"
              />
              <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-1 mt-2 border border-white/5 p-2 bg-black/30">
                {ELEMENTS_DATA.map((el: ChemicalElement) => {
                  if (el.symbol === selectedElement?.symbol) return null;
                  if (compareSearchQuery && !el.name.toLowerCase().includes(compareSearchQuery.toLowerCase()) && !el.symbol.toLowerCase().includes(compareSearchQuery.toLowerCase())) return null;
                  return (
                    <button
                      key={el.number}
                      onClick={() => {
                        if (onSelectCompareElement) onSelectCompareElement(el);
                        setCompareSelectorOpen(false);
                      }}
                      className="text-left w-full px-3 py-2 border border-white/5 bg-white/5 hover:bg-[#00E5FF]/20 hover:border-[#00E5FF]/50 rounded-sm flex justify-between items-center transition-all cursor-pointer group"
                    >
                      <span className="text-[13px] font-black text-white group-hover:text-[#00E5FF]">{el.symbol} - {el.name}</span>
                      <span className="text-[9px] text-[#00E5FF] tracking-widest uppercase font-mono bg-[#00E5FF]/10 px-2 py-0.5 rounded-sm">COMPARE</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SPLIT SCREEN COCKPIT FOR COMPARISON */}
        {isObsEntered && selectedElement && compareElement && (
          <div className="absolute inset-0 z-30 select-none pointer-events-none flex w-full">
            
            {/* LEFT ELEMENT (Primary) */}
            <div 
              className="w-1/2 h-full relative"
              style={{
                '--primary-color': getCatMeta(selectedElement.category || 'reactive-nonmetal').hex,
                '--primary-color-alpha': `${getCatMeta(selectedElement.category || 'reactive-nonmetal').hex}38`
              } as React.CSSProperties}
            >
              <div className="absolute top-22 left-4 md:left-12 pointer-events-auto flex flex-col items-start text-left animate-fade-in z-30 w-[calc(100%-1rem)] sm:w-full max-w-[280px] md:max-w-sm px-0">
                <div className="text-5xl md:text-7xl font-black font-sans text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-[0_0_25px_var(--primary-color-alpha)]">
                  {selectedElement.symbol}
                </div>
                <h1 className="text-lg md:text-xl font-black tracking-[0.25em] uppercase text-white mt-1">
                  {selectedElement.name}
                </h1>
                
                <div className="mt-4 md:mt-8 p-3 md:p-4 bg-[#070C1B]/55 backdrop-blur-md border border-[var(--primary-color)]/30 rounded-sm shadow-xl w-full text-left">
                  <div className="text-[8px] md:text-[9px] font-mono tracking-widest text-[var(--primary-color)] mb-2">ATOMIC ARCHITECTURE</div>
                  <div className="grid grid-cols-2 gap-2 text-[9px] md:text-[10px] font-mono font-bold text-white mb-4">
                    <div className="bg-black/40 p-2 rounded-sm border border-white/5"><span className="text-[#EAF2FF]/50">MASS:</span> {selectedElement.mass.toFixed(3)}</div>
                    <div className="bg-black/40 p-2 rounded-sm border border-white/5"><span className="text-[#EAF2FF]/50">ELECTRONS:</span> {selectedElement.electrons}</div>
                    <div className="bg-black/40 p-2 rounded-sm border border-white/5"><span className="text-[#EAF2FF]/50">PROTONS:</span> {selectedElement.protons}</div>
                    <div className="bg-black/40 p-2 rounded-sm border border-white/5"><span className="text-[#EAF2FF]/50">NEUTRONS:</span> {selectedElement.neutrons}</div>
                  </div>
                  <div className="text-[8px] md:text-[9px] font-mono tracking-widest text-[#FF9100] mb-2 mt-4">PHYSICAL PROPERTIES</div>
                  <div className="grid grid-cols-2 gap-2 text-[9px] md:text-[10px] font-mono font-bold text-white">
                    <div className="bg-black/40 p-2 rounded-sm border border-white/5"><span className="text-[#EAF2FF]/50">MELT:</span> {selectedElement.meltingPoint || 'N/A'} K</div>
                    <div className="bg-black/40 p-2 rounded-sm border border-white/5"><span className="text-[#EAF2FF]/50">BOIL:</span> {selectedElement.boilingPoint || 'N/A'} K</div>
                    <div className="bg-black/40 p-2 rounded-sm border border-white/5"><span className="text-[#EAF2FF]/50">DENSITY:</span> {selectedElement.density || 'N/A'}</div>
                    <div className="bg-black/40 p-2 rounded-sm border border-white/5"><span className="text-[#EAF2FF]/50">STATE:</span> {selectedElement.state}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* VERTICAL DIVIDER */}
            <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0B1020] border border-white/20 text-[10px] font-mono font-bold text-white px-3 py-1 rounded-sm shadow-xl">
                VS
              </div>
            </div>

            {/* RIGHT ELEMENT (Compare) */}
            <div 
              className="w-1/2 h-full relative"
              style={{
                '--primary-color': getCatMeta(compareElement.category || 'reactive-nonmetal').hex,
                '--primary-color-alpha': `${getCatMeta(compareElement.category || 'reactive-nonmetal').hex}38`
              } as React.CSSProperties}
            >
              <div className="absolute top-22 right-4 md:right-12 pointer-events-auto flex flex-col items-end text-right animate-fade-in z-30 w-[calc(100%-1rem)] sm:w-full max-w-[280px] md:max-w-sm px-0">
                <div className="text-5xl md:text-7xl font-black font-sans text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-[0_0_25px_var(--primary-color-alpha)]">
                  {compareElement.symbol}
                </div>
                <h1 className="text-lg md:text-xl font-black tracking-[0.25em] uppercase text-white mt-1">
                  {compareElement.name}
                </h1>
                
                <div className="mt-4 md:mt-8 p-3 md:p-4 bg-[#070C1B]/55 backdrop-blur-md border border-[var(--primary-color)]/30 rounded-sm shadow-xl w-full text-left">
                  <div className="text-[8px] md:text-[9px] font-mono tracking-widest text-[var(--primary-color)] mb-2">ATOMIC ARCHITECTURE</div>
                  <div className="grid grid-cols-2 gap-2 text-[9px] md:text-[10px] font-mono font-bold text-white mb-4">
                    <div className="bg-black/40 p-2 rounded-sm border border-white/5">
                      <span className="text-[#EAF2FF]/50">MASS:</span> {compareElement.mass.toFixed(3)}
                      {compareElement.mass > selectedElement.mass && <span className="ml-2 text-emerald-400">▲</span>}
                      {compareElement.mass < selectedElement.mass && <span className="ml-2 text-red-400">▼</span>}
                    </div>
                    <div className="bg-black/40 p-2 rounded-sm border border-white/5">
                      <span className="text-[#EAF2FF]/50">ELECTRONS:</span> {compareElement.electrons}
                    </div>
                    <div className="bg-black/40 p-2 rounded-sm border border-white/5">
                      <span className="text-[#EAF2FF]/50">PROTONS:</span> {compareElement.protons}
                    </div>
                    <div className="bg-black/40 p-2 rounded-sm border border-white/5">
                      <span className="text-[#EAF2FF]/50">NEUTRONS:</span> {compareElement.neutrons}
                    </div>
                  </div>
                  <div className="text-[8px] md:text-[9px] font-mono tracking-widest text-[#FF9100] mb-2 mt-4">PHYSICAL PROPERTIES</div>
                  <div className="grid grid-cols-2 gap-2 text-[9px] md:text-[10px] font-mono font-bold text-white">
                    <div className="bg-black/40 p-2 rounded-sm border border-white/5">
                      <span className="text-[#EAF2FF]/50">MELT:</span> {compareElement.meltingPoint || 'N/A'} K
                      {compareElement.meltingPoint && selectedElement.meltingPoint && parseFloat(compareElement.meltingPoint) > parseFloat(selectedElement.meltingPoint) && <span className="ml-2 text-emerald-400">▲</span>}
                    </div>
                    <div className="bg-black/40 p-2 rounded-sm border border-white/5">
                      <span className="text-[#EAF2FF]/50">BOIL:</span> {compareElement.boilingPoint || 'N/A'} K
                      {compareElement.boilingPoint && selectedElement.boilingPoint && parseFloat(compareElement.boilingPoint) > parseFloat(selectedElement.boilingPoint) && <span className="ml-2 text-emerald-400">▲</span>}
                    </div>
                    <div className="bg-black/40 p-2 rounded-sm border border-white/5">
                      <span className="text-[#EAF2FF]/50">DENSITY:</span> {compareElement.density || 'N/A'}
                      {compareElement.density && selectedElement.density && parseFloat(compareElement.density) > parseFloat(selectedElement.density) && <span className="ml-2 text-emerald-400">▲</span>}
                    </div>
                    <div className="bg-black/40 p-2 rounded-sm border border-white/5">
                      <span className="text-[#EAF2FF]/50">STATE:</span> {compareElement.state}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-2 w-full max-w-xs mx-auto">
                    <button
                      onClick={() => {
                        if (onSelectCompareElement) onSelectCompareElement(null);
                      }}
                      className="flex-1 px-5 py-2.5 bg-red-950/45 border border-red-500/30 hover:border-red-500 text-[9px] font-mono tracking-[0.16em] text-red-200 font-extrabold uppercase transition-all rounded shadow-2xl hover:bg-red-500/15 cursor-pointer"
                    >
                      EXIT COMPARISON ✖
                    </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =======================================================
          BOTTOM HOVER CARD AND SYSTEM INDICATORS
          ======================================================= */}
      {/* =======================================================
          BOTTOM HOVER CARD AND SYSTEM INDICATORS
          ======================================================= */}
      <footer className="w-full pointer-events-auto z-40 select-none flex flex-col justify-end mt-auto">
        
        {/* TIMELINE SLIDER SCALED OVERLAY */}
        {isObsEntered && appMode === 'timeline' && !selectedElement && (
          <div id="timeline-hud-scrubber" className="w-full max-w-2xl mx-auto px-5 py-4 bg-[#0B1020]/95 backdrop-blur-md border border-[#00FFB3]/30 rounded-md text-left font-mono flex flex-col gap-3 shadow-[0_0_30px_rgba(0,255,179,0.15)] animate-fade-in absolute bottom-24 left-1/2 -translate-x-1/2">
            <div className="flex justify-between items-center mb-2">
               <div className="flex items-center gap-2">
                 <span className="text-[#00FFB3] font-bold text-xs tracking-wider">{timelineYear < 0 ? `${Math.abs(timelineYear)} BC` : `${timelineYear} AD`}</span>
               </div>
               <div className="flex items-center gap-2">
                 <button
                   onClick={() => setIsPlayingTimeline(!isPlayingTimeline)}
                   className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 rounded-sm cursor-pointer ${
                     isPlayingTimeline
                       ? 'bg-amber-500/20 border border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                       : 'bg-[#00FFB3]/10 border border-[#00FFB3]/35 text-[#00FFB3] hover:bg-[#00FFB3]/20'
                   }`}
                 >
                   {isPlayingTimeline ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                   <span>{isPlayingTimeline ? "PAUSING" : "AUTO DRIFT"}</span>
                 </button>
               </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[9px] text-[#EAF2FF]/30 select-none whitespace-nowrap">ANCIENT</span>
              <div className="flex-1 relative flex items-center">
                <input
                  type="range"
                  min="-5000"
                  max="2026"
                  step="5"
                  value={timelineYear}
                  onChange={(e) => {
                     onChangeTimelineYear(parseInt(e.target.value));
                     setIsPlayingTimeline(false);
                  }}
                  className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#00FFB3]"
                />
              </div>
              <span className="text-[9px] text-[#00FFB3] font-extrabold whitespace-nowrap">MODERN</span>
            </div>
          </div>
        )}

        {/* ZONE 5: ACTION BAR */}
        <div className="w-full flex justify-center pb-6">
          <div className="bg-[#050812]/90 backdrop-blur-2xl border border-[var(--primary-color,white)]/20 shadow-[0_0_20px_rgba(0,0,0,0.8)] rounded-lg px-2 py-2 flex items-center gap-2">
            
            {/* Core Navigation Controls */}
            {selectedElement && (
              <button
                onClick={() => {
                  onSelectElement(null);
                  if (onSelectCompareElement) onSelectCompareElement(null);
                  window.dispatchEvent(new CustomEvent('shell-probe-selected', { detail: { index: null } }));
                }}
                className="px-4 py-2 border-r border-white/10 hover:text-red-400 text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer text-white"
              >
                <X className="w-4 h-4" /> CLOSE
              </button>
            )}

            <button
              onClick={() => onChangeAppMode('explorer')}
              className={`px-4 py-2 border border-transparent hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/10 text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-2 rounded-sm cursor-pointer ${appMode === 'explorer' && !selectedElement ? 'text-[#00E5FF]' : 'text-white/60 hover:text-white'}`}
            >
              <Compass className="w-4 h-4" /> EXPLORE
            </button>

            {selectedElement && !compareElement && (
              <button
                onClick={() => setCompareSelectorOpen(true)}
                className="px-4 py-2 border border-transparent hover:border-[#FF9100]/50 hover:bg-[#FF9100]/10 text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-2 rounded-sm cursor-pointer text-white/60 hover:text-[#FF9100]"
              >
                <Share2 className="w-4 h-4" /> COMPARE
              </button>
            )}

            {selectedElement && compareElement && (
              <button
                onClick={() => {
                   onChangeAppMode('bond_lab');
                   const reaction = analyzeReaction(selectedElement.symbol, compareElement.symbol);
                   onTriggerReaction(reaction);
                }}
                className="px-4 py-2 border border-[#FF3366]/40 bg-[#FF3366]/20 hover:bg-[#FF3366]/40 hover:border-[#FF3366] shadow-[0_0_15px_rgba(255,51,102,0.3)] text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-2 rounded-sm cursor-pointer text-white"
              >
                <Flame className="w-4 h-4 text-[#FF3366]" /> RUN REACTION
              </button>
            )}

            <button
              onClick={() => onChangeAppMode('network')}
              className={`px-4 py-2 border border-transparent hover:border-[#7C4DFF]/50 hover:bg-[#7C4DFF]/10 text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-2 rounded-sm cursor-pointer ${appMode === 'network' ? 'text-[#7C4DFF]' : 'text-white/60 hover:text-white'}`}
            >
              <Network className="w-4 h-4" /> VIEW NETWORK
            </button>
            
          </div>
        </div>
      </footer>
    </div>
  );
}
