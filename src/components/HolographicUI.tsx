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
  Orbit
} from 'lucide-react';
import { ChemicalElement, TableLayoutMode, ReactionConfig } from '../types';
import { CATEGORY_COLORS, REACTION_CONFIGS, ELEMENTS_DATA } from '../data';
import { ElementExplorationDepth } from './ElementExplorationDepth';
import ObservatoryHub from './ObservatoryHub';

interface HolographicUIProps {
  selectedElement: ChemicalElement | null;
  hoveredElement: ChemicalElement | null;
  onSelectElement: (element: ChemicalElement | null) => void;
  layoutMode: TableLayoutMode;
  onChangeLayoutMode: (mode: TableLayoutMode) => void;
  appMode: 'observatory' | 'explorer' | 'bond_lab' | 'timeline';
  onChangeAppMode: (mode: 'observatory' | 'explorer' | 'bond_lab' | 'timeline') => void;
  timelineYear: number;
  onChangeTimelineYear: (year: number | ((prev: number) => number)) => void;
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

export default function HolographicUI({
  selectedElement,
  hoveredElement,
  onSelectElement,
  layoutMode,
  onChangeLayoutMode,
  appMode,
  onChangeAppMode,
  timelineYear,
  onChangeTimelineYear,
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

  useEffect(() => {
    if (selectedElement) {
      setScaleMode('atomic');
    } else if (appMode === 'bond_lab') {
      setScaleMode('molecular');
    } else {
      setScaleMode('periodic');
    }
  }, [selectedElement, appMode]);

  // Selected electron shell info state
  const [activeShellInfo, setActiveShellInfo] = useState<{
    shellIndex: number;
    shellName: string;
    electrons: number;
    radius: number;
  } | null>(null);

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
          LANDING OVERLAY (IfNotEntered)
          ======================================================= */}
      {!isObsEntered && (
        <div id="orbitium-welcome" className="absolute inset-0 bg-[#070B14]/90 backdrop-blur-lg flex flex-col justify-center items-center pointer-events-auto z-50 text-center px-4">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(0,229,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />
          
          <div className="relative max-w-2xl flex flex-col items-center">
            {/* Pulsing visual core icon */}
            <div className="w-20 h-20 rounded-full border border-[#00E5FF]/40 mb-6 flex items-center justify-center bg-[#0B1020] shadow-[0_0_30px_rgba(0,229,255,0.2)] animate-pulse">
              <Atom className="w-10 h-10 text-[#00E5FF]" />
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-[0.25em] text-[#EAF2FF] mb-3 uppercase">
              ORBITIUM
            </h1>
            
            <p className="text-sm sm:text-base text-[#00E5FF] tracking-[0.3em] uppercase mb-8 font-medium">
              THE LIVING ATOMIC COSMOS
            </p>

            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent mb-8" />

            <p className="text-[#EAF2FF]/70 text-sm sm:text-base leading-relaxed mb-10 max-w-lg font-light text-center">
              Enter a navigable, immersive sub-atomic universe. Travel through the structure of matter, explore element galaxy systems, and discover the unique atmospheric environments of individual elements.
            </p>

            <button
              id="btn-enter"
              onClick={handleEnterWorld}
              className="px-8 py-3.5 bg-[#070B14] border border-[#00E5FF] text-[#00E5FF] text-xs font-bold tracking-[0.2em] rounded-sm hover:bg-[#00E5FF]/10 hover:shadow-[0_0_25px_rgba(0,229,255,0.25)] transition-all duration-300 uppercase cursor-pointer flex items-center gap-3 active:scale-95"
            >
              NAVIGATE THE ATOMIC COSMOS <ArrowRight className="w-4 h-4" />
            </button>

            {/* Scientific credits */}
            <div className="mt-16 text-[9px] font-mono text-[#EAF2FF]/30 tracking-[0.15em] uppercase flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '20s' }} />
              COSMIC LABORATORY ENGINE v3.45.9
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          TOP LAYER NAVIGATION AND BRANDING
          ======================================================= */}
      <header className="w-full flex flex-col md:flex-row justify-between items-center md:items-start gap-4 pointer-events-auto z-40">
        {/* Logo and Tagline */}
        <div id="orb-hud-brand" className="flex items-center gap-3 self-start">
          <div 
            onClick={() => onSelectElement(null)}
            className="w-10 h-10 rounded-sm border border-[#00E5FF]/20 flex items-center justify-center bg-[#0B1020]/80 backdrop-blur-md cursor-pointer hover:border-[#00E5FF]/60 hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all"
          >
            <Atom className="w-5.5 h-5.5 text-[#00E5FF] animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div>
            <div className="text-sm font-black tracking-[0.2em] text-[#EAF2FF]">ORBITIUM</div>
            <div className="text-[9px] font-mono tracking-widest text-[#00E5FF] uppercase">ATOMIC OBSERVATORY</div>
          </div>
        </div>

        {/* Center App Mode Toggles */}
        {isObsEntered && (
          <div className="flex gap-1.5 p-1 bg-[#0A0D1A]/85 border border-[#00E5FF]/20 rounded-md shadow-[0_0_20px_rgba(0,229,255,0.1)] items-center backdrop-blur-md">
            {[
              { id: 'observatory', label: 'Observatory', icon: Orbit },
              { id: 'explorer', label: 'Explorer', icon: Compass },
              { id: 'bond_lab', label: '3D Bond Reactor', icon: Flame },
              { id: 'timeline', label: 'Timeline History', icon: TrendingUp }
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = appMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onChangeAppMode(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[9px] font-mono uppercase tracking-widest font-extrabold border transition-all duration-300 cursor-pointer rounded-sm ${
                    isActive
                      ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                      : 'bg-transparent border-transparent text-[#EAF2FF]/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Dynamic status widgets and audio node toggle */}
        <div className="flex gap-3.5 font-mono text-[10px] self-end md:self-start items-center">
          {isObsEntered && (
            <button
              id="btn-toggle-more-protocols"
              onClick={() => {
                setIsMoreActive(!isMoreActive);
                import('../utils/audioSynth').then(({ OrbitiumAudio }) => {
                  OrbitiumAudio.playUnlockChime();
                }).catch(() => {});
              }}
              className={`px-3.5 py-1.5 justify-center rounded-sm border backdrop-blur-md flex items-center gap-2 cursor-pointer transition-all duration-300 ${
                isMoreActive
                  ? 'bg-gradient-to-r from-[#00FFB3]/15 to-[#00E5FF]/15 border-[#00FFB3] text-[#00FFB3] shadow-[0_0_15px_rgba(0,255,179,0.25)] font-black'
                  : 'bg-white/5 border-white/10 text-white/75 hover:border-[#00E5FF] hover:text-[#00E5FF] hover:bg-[#00E5FF]/5'
              }`}
              title={isMoreActive ? "Collapse advanced controls" : "Reveal advanced observatory controls"}
            >
              <Sliders className={`w-3.5 h-3.5 ${isMoreActive ? 'animate-spin' : ''}`} style={isMoreActive ? { animationDuration: '6s' } : {}} />
              <span>{isMoreActive ? "COLLAPSE PANEL" : "MORE SYSTEMS"}</span>
            </button>
          )}

          {isObsEntered && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`px-3 py-1.5 justify-center rounded-sm border backdrop-blur-md flex items-center gap-2 cursor-pointer transition-all ${
                isMuted
                  ? 'bg-red-950/20 border-red-500/40 text-red-400'
                  : 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF] hover:border-[#00E5FF]'
              }`}
              title={isMuted ? "Unmute cosmic synthesizer engine" : "Mute cosmic synthesizer engine"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isMuted ? "SYNTH MUTED" : "COSMIC SYNTH"}</span>
            </button>
          )}

          <div className="hidden lg:flex px-3 py-1.5 bg-[#0B1020]/60 backdrop-blur-md border border-[#EAF2FF]/10 rounded-sm">
            <span className="text-[#00FFB3] uppercase">● OBS:</span> STABLE
          </div>
          <div className="hidden lg:flex px-3 py-1.5 bg-[#0B1020]/60 backdrop-blur-md border border-[#EAF2FF]/10 rounded-sm">
            <span className="text-[#00E5FF] uppercase">CORES:</span> 118
          </div>
        </div>
      </header>

      {/* =======================================================
          MAIN INTERACTION HUD OVERLAYS (Left / Right / Middle)
          ======================================================= */}
      <main className="flex-1 my-4 flex flex-col md:flex-row gap-6 relative justify-between items-stretch">
        {!isMoreActive && !selectedElement && isObsEntered && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 select-none pointer-events-none z-10 text-center animate-fade-in whitespace-nowrap">
            <span className="text-[7.5px] font-mono tracking-[0.3em] text-[#00E5FF]/45 uppercase">
              // IMMERSIVE COHERENCE FIELD ACTIVE
            </span>
            <div className="px-5 py-1.5 bg-[#0B1020]/50 backdrop-blur-md border border-white/[0.08] rounded-full flex items-center gap-2.5 text-[8.2px] font-mono text-white/50 tracking-wider shadow-xl">
              <span>DRAG TO ROTATE COSMOS</span>
              <span className="text-[#00FFB3]/30">•</span>
              <span>SCROLL TO ZOOM ATOMS</span>
              <span className="text-[#00FFB3]/30">•</span>
              <span className="text-[#00FFB3] font-bold">CLICK "MORE SYSTEMS" FOR ADVANCED CONTROLS</span>
            </div>
          </div>
        )}
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
                        <div className="w-full h-[1px] bg-white/10 my-0.5" />
                        <div className="flex justify-between text-[#EAF2FF]/95">
                          <span>TETHER LINK CLAMP:</span>
                          <span className={`font-black uppercase ${liveDistance && liveDistance < 2.5 ? 'text-red-500 animate-pulse' : 'text-[#00FFB3]'}`}>
                            {liveDistance ? `${liveDistance.toFixed(2)} Å` : 'AWAITING LOCK'}
                          </span>
                        </div>
                        {liveDistance && (
                          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-0.5">
                            <div 
                              className={`h-full transition-all duration-100 ${liveDistance < 2.5 ? 'bg-red-500' : 'bg-[#00FFB3]'}`}
                              style={{ width: `${Math.max(0, Math.min(100, (1 - (liveDistance / 12)) * 100))}%` }}
                            />
                          </div>
                        )}
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

        {/* MIDDLE OVERLAY (Active reaction notifications/simulations) */}
        {isObsEntered && activeReaction && (
          <div className="absolute z-40 select-none transition-all duration-700 ease-out flex flex-col items-center gap-4 w-[calc(100%-2rem)] max-w-sm sm:max-w-md md:max-w-lg px-4 md:px-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:left-12 lg:left-16 md:translate-x-0 md:top-1/2 md:-translate-y-1/2">
            {reactionStage === 'idle' ? (
              <div className="w-full max-w-sm sm:max-w-md mx-auto p-6 sm:p-7 bg-[#070C1B]/95 border border-[#FF9100]/40 rounded-sm shadow-[0_0_35px_rgba(255,145,0,0.2)] backdrop-blur-2xl flex flex-col items-center text-center pointer-events-auto animate-fade-in hover:shadow-[0_0_45px_rgba(255,145,0,0.3)] transition-all duration-500 ease-out select-none relative group">
                
                {/* Corner Frame accents */}
                <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-[#FF9100]/40 group-hover:border-[#FF9100] transition-colors" />
                <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-[#FF9100]/40 group-hover:border-[#FF9100] transition-colors" />
                <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-[#FF9100]/40 group-hover:border-[#FF9100] transition-colors" />
                <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-[#FF9100]/40 group-hover:border-[#FF9100] transition-colors" />

                <div className="w-12 h-12 border border-dashed border-[#FF9100]/50 rounded-full flex items-center justify-center animate-spin mb-4" style={{ animationDuration: '7s' }}>
                  <Flame className="w-5 h-5 text-[#FF9100]" />
                </div>
                
                {/* Header text */}
                <h3 className="text-[10px] sm:text-[11px] font-mono font-black tracking-[0.25em] text-[#FF9100]/90 uppercase">
                  REACTOR TETHER ACTIVE
                </h3>

                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-widest mt-3.5 mb-1">
                  {activeReaction.reactants[0]} + {activeReaction.reactants[1]}
                </h1>

                <div className="text-[8.5px] sm:text-[9.5px] font-mono text-[#00E5FF]/80 tracking-widest">
                  TARGET SYNTHESIS: <span className="font-extrabold text-[#00FFB3]">{activeReaction.productFormula}</span>
                </div>

                <p className="text-[10.5px] sm:text-[11px] text-[#EAF2FF]/75 leading-relaxed font-light mt-4.5 mb-6 border-t border-white/5 pt-4 max-w-xs sm:max-w-sm">
                  Atomic cores spawned in 3D electromagnetic grid. <span className="text-[#00FFB3] font-bold">Drag either reactant</span> across space into proximity to synthesize <span className="text-[#00E5FF] font-bold">{activeReaction.productFormula}</span>.
                </p>

                <button
                  onClick={handleCancelReaction}
                  className="w-full sm:w-auto px-6 py-2 bg-[#0C1123] border border-red-500/45 hover:border-red-500 text-[9px] font-mono tracking-widest text-red-400 font-extrabold uppercase transition-all rounded-sm cursor-pointer hover:bg-red-500/10"
                >
                  DISMANTLE BEAMS
                </button>
              </div>
            ) : reactionStage === 'stable' ? (
              <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto p-6 sm:p-8 bg-[#070C1B]/95 border border-[#00FFB3]/40 rounded-sm shadow-[0_0_40px_rgba(0,255,179,0.25)] backdrop-blur-2xl flex flex-col items-center text-center pointer-events-auto animate-fade-in hover:shadow-[0_0_50px_rgba(0,255,179,0.35)] transition-all duration-500 ease-out select-none relative group">
                
                {/* Advanced Scientific UI subtle frames/accents */}
                <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-[#00FFB3]/40 group-hover:border-[#00FFB3] transition-colors" />
                <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-[#00FFB3]/40 group-hover:border-[#00FFB3] transition-colors" />
                <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-[#00FFB3]/40 group-hover:border-[#00FFB3] transition-colors" />
                <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-[#00FFB3]/40 group-hover:border-[#00FFB3] transition-colors" />

                {/* Pulsing Science Core Emitter at top */}
                <div className="w-12 h-12 border border-[#00FFB3]/35 rounded-full flex items-center justify-center bg-[#00FFB3]/5 mb-5 relative group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 rounded-full border border-dashed border-[#00FFB3]/50 animate-spin" style={{ animationDuration: '8s' }} />
                  <CheckCircle2 className="w-6 h-6 text-[#00FFB3] animate-pulse" />
                </div>

                {/* LINE 1: PRIMARY REACTION FORMULA */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-widest text-[#00FFB3] drop-shadow-[0_0_15px_rgba(0,255,179,0.4)] transition-all duration-300 px-2 line-clamp-2 leading-none">
                  {activeReaction.productFormula}
                </h1>

                {/* Separator Line */}
                <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#00FFB3]/55 to-transparent my-4 sm:my-5" />

                {/* LINE 2: REACTION NAME */}
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#EAF2FF] uppercase tracking-wide leading-snug px-3 max-w-sm sm:max-w-md">
                  {activeReaction.productName}
                </h2>

                {/* LINE 3: REACTION STATUS OR METADATA */}
                <div className="mt-3.5 mb-5 select-none">
                  <span className="inline-block text-[9px] sm:text-[10px] uppercase font-mono font-black tracking-[0.25em] text-[#00E5FF]/80 bg-[#00E5FF]/10 border border-[#00E5FF]/25 px-3 py-1 rounded-sm shadow-[inset_0_0_8px_rgba(0,229,255,0.05)]">
                    SYNTHESIZED MATRIX // QUANTUM LOCK
                  </span>
                </div>

                {/* DESCRIPTION / SCIENTIFIC LOGS BRIEF */}
                <p className="text-[10px] sm:text-[11px] md:text-xs text-[#EAF2FF]/70 leading-relaxed font-light font-sans max-w-xs sm:max-w-sm border-t border-white/5 pt-4.5 mb-6">
                  {activeReaction.description}
                </p>
                
                {/* INTERACTIVE CONTROLS */}
                <button
                  onClick={handleCancelReaction}
                  className="w-full sm:w-auto px-8 py-2.5 bg-[#070B14] border border-[#00FFB3]/60 hover:bg-[#00FFB3]/15 text-[10px] uppercase font-mono font-black tracking-widest text-[#00FFB3] transition-all cursor-pointer rounded-sm shadow-[0_0_12px_rgba(0,255,179,0.1)] hover:shadow-[0_0_20px_rgba(0,255,179,0.3)] hover:border-[#00FFB3]"
                >
                  EJECT & REBOOT COILS
                </button>
              </div>
            ) : null}
          </div>
        )}

        

        {/* SUBATOMIC SHELL ANALYZER DEDICATED HUD PANEL */}
        {isObsEntered && selectedElement && activeShellInfo && (
          <div 
            id="subatomic-shell-hud"
            className="absolute z-50 md:right-[380px] bottom-32 md:bottom-auto md:top-[140px] w-[calc(100%-2rem)] md:w-80 mx-4 md:mx-0 p-5 bg-[#070C1B]/92 backdrop-blur-xl border border-[#00FFB3]/40 rounded-sm shadow-[0_0_25px_rgba(0,255,179,0.22)] animate-fade-in text-[#EAF2FF] select-none pointer-events-auto"
          >
            {/* Holographic grid lines & corner elements for futuristic high-end feel */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00FFB3]" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00FFB3]" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00FFB3]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00FFB3]" />
            
            <div className="flex justify-between items-start mb-3 border-b border-white/10 pb-2">
              <div>
                <span className="text-[8px] font-mono tracking-[0.3em] text-[#00FFB3] uppercase">// SUBATOMIC SHELL ANALYZER</span>
                <h3 className="text-xs font-black tracking-widest text-white uppercase mt-0.5">
                  Quantum Orb: {activeShellInfo.shellName} ({['k_shell', 'l_shell', 'm_shell', 'n_shell', 'o_shell', 'p_shell', 'q_shell'][activeShellInfo.shellIndex]})
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveShellInfo(null);
                  window.dispatchEvent(new CustomEvent('orbit-shell-clicked', { detail: { selected: false } }));
                }}
                className="w-5 h-5 border border-white/10 hover:border-red-500 hover:text-red-500 rounded flex items-center justify-center text-[#EAF2FF]/50 cursor-pointer transition-colors"
                title="Dismiss Shell Probe"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Shell Metrics Layout */}
              <div className="grid grid-cols-2 gap-3 font-mono text-[10px]">
                <div className="p-2.5 bg-white/[0.03] border border-white/5 rounded-sm">
                  <div className="text-white/40 text-[7.5px] uppercase tracking-wider">Shell Index (n)</div>
                  <div className="text-base font-black text-[#00FFB3] mt-0.5">n = {activeShellInfo.shellIndex + 1}</div>
                </div>
                <div className="p-2.5 bg-white/[0.03] border border-white/5 rounded-sm">
                  <div className="text-white/40 text-[7.5px] uppercase tracking-wider">Occupancy</div>
                  <div className="text-base font-black text-[#00E5FF] mt-0.5">
                    {activeShellInfo.electrons} <span className="text-[10px] font-medium text-white/50">Electrons</span>
                  </div>
                </div>
              </div>

              {/* Specific Atomic Orbital Types (s, p, d, f) associated with that shell */}
              <div className="p-3.5 bg-white/[0.02] border border-white/[0.07] rounded-sm flex flex-col gap-2">
                <div className="text-white/40 font-mono text-[7.5px] uppercase tracking-widest">Orbital Structure (s, p, d, f)</div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { type: 's', label: 's [Spherical]', active: activeShellInfo.shellIndex >= 0, desc: 'Lobe-free uniform spherical wave density.' },
                    { type: 'p', label: 'p [Dumbbell]', active: activeShellInfo.shellIndex >= 1, desc: 'Two lobes with a single focal nodal plane.' },
                    { type: 'd', label: 'd [Cloverleaf]', active: activeShellInfo.shellIndex >= 2, desc: 'Four lobes in clover geometry.' },
                    { type: 'f', label: 'f [Multi-Lobe]', active: activeShellInfo.shellIndex >= 3, desc: 'Complex eight-lobed spatial packet.' }
                  ].map((orb) => (
                    <div 
                      key={orb.type}
                      className={`flex-1 p-1.5 rounded-sm border text-center font-mono transition-all duration-300 flex flex-col items-center justify-center min-w-[62px] ${
                        orb.active
                          ? 'border-[#00FFB3]/40 bg-[#00FFB3]/5 text-white'
                          : 'border-white/[0.04] bg-white/[0.01] text-white/20'
                      }`}
                      title={orb.active ? orb.desc : 'Orbital unpopulated / energetically inaccessible'}
                    >
                      <span className={`text-[12px] font-black ${orb.active ? 'text-[#00FFB3]' : 'text-white/20'}`}>{orb.type}</span>
                      <span className="text-[6px] uppercase tracking-tighter mt-0.5">{orb.active ? 'Active' : 'Locked'}</span>
                    </div>
                  ))}
                </div>
                {/* Dynamically active orbital descriptions */}
                <div className="font-mono text-[8.2px] text-[#EAF2FF]/55 leading-relaxed mt-1">
                  <span>Constituent Subshells: </span>
                  <span className="text-[#00FFB3] font-bold">
                    {activeShellInfo.shellIndex === 0 && '1s'}
                    {activeShellInfo.shellIndex === 1 && '2s, 2p'}
                    {activeShellInfo.shellIndex === 2 && '3s, 3p, 3d'}
                    {activeShellInfo.shellIndex === 3 && '4s, 4p, 4d, 4f'}
                    {activeShellInfo.shellIndex >= 4 && `${activeShellInfo.shellIndex + 1}s, ${activeShellInfo.shellIndex + 1}p, ${activeShellInfo.shellIndex + 1}d, ${activeShellInfo.shellIndex + 1}f [complex series]`}
                  </span>
                  <p className="text-white/35 text-[7.5px] mt-1 leading-normal italic">
                    * Shell highlights trigger quantum tunneling simulations. Hover or zoom elements to monitor cloud variations.
                  </p>
                </div>
              </div>

              {/* Toggle 'Probability Density Cloud' overlay for individual electron shells */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between font-mono text-[9px]">
                <div className="flex flex-col">
                  <span className="text-white/50 font-bold uppercase text-[7.5px] tracking-wider">Probability Cloud</span>
                  <span className="text-white/35 text-[7px] leading-tight font-sans">Augmented wave representation</span>
                </div>
                <button
                  id="btn-toggle-prob-density"
                  onClick={() => setIsDensityCloudActive(!isDensityCloudActive)}
                  className={`px-3 py-1.5 rounded-sm border cursor-pointer font-bold transition-all duration-200 uppercase flex items-center gap-1.5 ${
                    isDensityCloudActive
                      ? 'bg-[#00FFB3]/15 border-[#00FFB3] text-[#00FFB3] shadow-[0_0_8px_rgba(0,255,179,0.15)]'
                      : 'bg-white/5 border-white/10 text-white/55 hover:border-white/25 hover:text-white'
                  }`}
                >
                  <Atom className={`w-3.5 h-3.5 ${isDensityCloudActive ? 'animate-spin' : ''}`} style={isDensityCloudActive ? { animationDuration: '4s' } : {}} />
                  <span>{isDensityCloudActive ? "CLOUD ENABLED" : "CLOUD DISABLED"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================
            CELESTIAL ATLAS OBSERVATORY MASTER DASHBOARD
            ======================================================= */}
        {isObsEntered && appMode === 'observatory' && !selectedElement && (
          <div className="flex-1 w-full flex flex-col justify-between p-4 bg-[#070B14]/75 border border-white/10 rounded backdrop-blur-2xl pointer-events-auto shadow-2xl overflow-hidden max-h-[85vh] md:max-h-[calc(100vh-130px)] select-none">
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

        {/* ELITE COCKPIT: SPATIAL HOLOGRAPHIC HUD PANELS (ELEMENT WORLD EXPERIENCE) */}
        {isObsEntered && selectedElement && (
          <div 
            className="absolute inset-0 z-30 select-none pointer-events-none flex flex-col justify-between"
            style={{
              '--primary-color': getCatMeta(selectedElement.category || 'reactive-nonmetal').hex,
              '--primary-color-alpha': `${getCatMeta(selectedElement.category || 'reactive-nonmetal').hex}38`
            } as React.CSSProperties}
          >
            {/* PANEL 1: CELESTIAL IDENTITY & NARRATIVE OVERLAY (TOP CENTER) */}
            <div className="absolute top-22 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center text-center animate-fade-in z-30 w-full max-w-lg px-4">
              <div className="relative flex items-center justify-center">
                {/* Visual neon drop glow under symbol */}
                <div className="absolute -inset-6 rounded-full bg-radial from-[var(--primary-color)]/25 to-transparent blur-xl animate-pulse" />
                
                <span className="text-7xl font-black tracking-tight font-sans text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-[0_0_25px_var(--primary-color-alpha)]">
                  {selectedElement.symbol}
                </span>
                <span className="absolute -top-3 -right-6 text-[10px] font-mono font-black border border-white/10 bg-[#070B14]/85 px-1.5 py-0.5 rounded text-[var(--primary-color)]">
                  #{selectedElement.number.toString().padStart(3, '0')}
                </span>
              </div>
              
              <h1 className="text-2.5xl font-black tracking-[0.25em] uppercase text-white mt-3 drop-shadow-md">
                {selectedElement.name}
              </h1>
              
              <div className="flex gap-2.5 items-center mt-1 text-[8.5px] font-mono text-[#EAF2FF]/50 uppercase tracking-widest bg-white/[0.02] border border-white/5 px-3 py-0.5 rounded-sm">
                <span className="font-bold text-[var(--primary-color)]">{getCatMeta(selectedElement.category).label}</span>
                <span>•</span>
                <span>Period: {selectedElement.period}</span>
                <span>•</span>
                <span>Block: {selectedElement.coreIdentity?.block?.toUpperCase() || 'S'}</span>
              </div>

              {/* Immersive cinematic storytelling narrative */}
              <p className="max-w-md text-[10.5px] text-[#EAF2FF]/80 italic leading-relaxed mt-4 px-4 font-sans font-light drop-shadow-lg text-center bg-[#070B14]/40 py-2 rounded border border-white/5 backdrop-blur-sm">
                {selectedElement.symbol === 'H' ? (
                  <span>"A primordial pioneer, forged in the explosive furnace of the Big Bang. Hydrogen is the fuel of stars, breathing light into the cosmos through thermonuclear fusion."</span>
                ) : selectedElement.symbol === 'C' ? (
                  <span>"The organic architect of existence. Carbon forms perfect covalent frameworks, weaving the strands of DNA, bionics, and chemical lifelines."</span>
                ) : selectedElement.symbol === 'U' ? (
                  <span>"The nuclear titan. Armed with an ultra-heavy unstable core, Uranium fuels geodynamic heating and powers modern industrial reactor cores."</span>
                ) : selectedElement.symbol === 'He' ? (
                  <span>"The silent celestial spark. Born in stellar fusion, Helium forms a perfect, non-reactive noble sphere, lifting the balloons of industry and deep-space cooling."</span>
                ) : selectedElement.symbol === 'Ne' ? (
                  <span>"The luminous beacon of stability. Neon burns with a vivid crimson-orange plasma discharge under excitation, inert and immortal in the noble void."</span>
                ) : (
                  <span>"{selectedElement.summary}"</span>
                )}
              </p>
            </div>

            {/* PANEL 2: ATOMIC STRUCTURAL CELL (MIDDLE LEFT) */}
            <div className="absolute top-28 left-4 md:left-8 w-72 pointer-events-auto flex flex-col gap-3 animate-fade-in z-30">
              <div className="relative p-3.5 bg-[#070C1B]/55 backdrop-blur-md border border-white/5 rounded-sm shadow-xl hover:border-[var(--primary-color)]/25 duration-300">
                <div className="text-[7.5px] font-mono tracking-widest text-[#00FFB3] uppercase font-bold flex items-center gap-1.5 mb-2.5">
                  <Atom className="w-4 h-4 text-[#00FFB3] animate-spin" style={{ animationDuration: '6s' }} /> // ATOMIC CORE METRICS
                </div>
                
                <div className="grid grid-cols-3 gap-1 font-mono text-[9px] font-black text-center">
                  <div className="p-1 px-0.5 bg-red-500/10 border border-red-500/15 rounded">
                    <span className="block text-[6px] text-red-400 font-bold">PROTONS</span>
                    <span className="text-[10px] text-red-200">{selectedElement.protons}</span>
                  </div>
                  <div className="p-1 px-0.5 bg-blue-500/10 border border-blue-500/15 rounded">
                    <span className="block text-[6px] text-blue-400 font-bold">NEUTRONS</span>
                    <span className="text-[10px] text-blue-200">{selectedElement.neutrons}</span>
                  </div>
                  <div className="p-1 px-0.5 bg-emerald-500/10 border border-emerald-500/15 rounded">
                    <span className="block text-[6px] text-emerald-400 font-bold">ELECTRONS</span>
                    <span className="text-[10px] text-emerald-200">{selectedElement.electrons}</span>
                  </div>
                </div>
                
                <div className="mt-2.5 text-[8.5px] font-mono text-white/50 border-t border-white/5 pt-2 flex justify-between">
                  <span>OUTER VALENCE:</span>
                  <span className="text-[#00FFB3] font-bold">{selectedElement.electronConfig}</span>
                </div>
              </div>

              {/* Schrödinger Valence Orbitals Probe Array */}
              <div className="relative p-3.5 bg-[#070C1B]/55 backdrop-blur-md border border-white/5 rounded-sm shadow-xl hover:border-[var(--primary-color)]/25 duration-300 flex flex-col gap-2">
                <span className="text-[7.5px] font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
                  🔮 SCHRÖDINGER ENERGY VALENCE
                </span>
                
                <div className="flex gap-1 items-center font-mono font-bold">
                  {selectedElement.shells.map((eCount: number, idx: number) => {
                    const shellLabel = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'][idx] || `S${idx + 1}`;
                    const isHighlighted = activeShellInfo !== null && activeShellInfo.shellIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          const shellInfoObj = {
                            shellIndex: idx,
                            shellName: shellLabel,
                            electrons: eCount,
                            radius: (idx + 1) * 2.8
                          };
                          setActiveShellInfo(shellInfoObj);
                          window.dispatchEvent(new CustomEvent('shell-probe-selected', { detail: { index: idx } }));
                        }}
                        className={`flex-1 p-1 rounded border text-center transition-all duration-300 cursor-pointer ${
                          isHighlighted
                            ? 'bg-[#00FFB3]/15 border-[#00FFB3] shadow-[0_0_8px_rgba(0,255,179,0.2)] scale-105'
                            : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-[6px] text-white/35">N{idx+1}</div>
                        <div className="text-[9px] font-black text-[#00FFB3]">{eCount}ᴇ</div>
                      </button>
                    );
                  })}
                </div>

                {activeShellInfo ? (
                  <div className="p-2.5 bg-[#00FFB3]/5 border border-[#00FFB3]/20 rounded-sm font-mono text-[8.5px] flex flex-col gap-1 animate-fade-in text-[#EAF2FF]/85">
                    <div className="flex justify-between items-center text-[#00FFB3] border-b border-white/5 pb-1 font-bold">
                      <span className="text-[7.5px] uppercase">PROBE STATUS: {activeShellInfo.shellName} shell active</span>
                      <span className="text-[9px] font-black text-white">{activeShellInfo.electrons} Electrons</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-1.5 gap-y-0.5 mt-0.5 text-[#EAF2FF]/70 font-light">
                      <div>Orbitals: <strong className="text-white font-semibold">{['1s', '2s, 2p', '3s, 3p, 3d', '4s, 4p, 4d, 4f', '5s, 5p, 5d, 5f'][activeShellInfo.shellIndex] || 'Complex Hybrid'}</strong></div>
                      <div>Radius: <strong className="text-[#00E5FF] font-semibold">{(activeShellInfo.radius * 0.53).toFixed(2)} Å</strong></div>
                    </div>
                  </div>
                ) : (
                  <span className="text-[8px] text-white/30 text-center font-mono py-1">Select shell node above to excite electronic waves</span>
                )}
              </div>

              {/* STP Lattice Matrix */}
              <div className="relative p-3.5 bg-[#070C1B]/55 backdrop-blur-md border border-white/5 rounded-sm shadow-xl hover:border-[var(--primary-color)]/25 duration-300">
                <span className="text-[7.5px] font-mono tracking-widest text-amber-400 uppercase font-bold block mb-1.5">
                  💠 STRUCTURAL STP STATE
                </span>
                <div className="text-[9px] text-[#EAF2FF]/85 leading-relaxed font-sans font-light">
                  {selectedElement.physicalProperties?.crystalStructure || 'Stable STP physical structure.'}
                </div>
                <div className="mt-2 flex justify-between font-mono text-[8px] text-white/40 border-t border-white/5 pt-2">
                  <span>STP state: <strong className="text-white capitalize font-bold">{selectedElement.state}</strong></span>
                  <span>Density: <strong className="text-[#00E5FF] font-bold">{selectedElement.density || 'N/A'}</strong></span>
                </div>
              </div>
            </div>

            {/* PANEL 3: THERMAL & REACTIVE FIELDS (MIDDLE RIGHT) */}
            <div className="absolute top-28 right-4 md:right-8 w-72 pointer-events-auto flex flex-col gap-3 animate-fade-in z-30">
              <div className="relative p-3.5 bg-[#070C1B]/55 backdrop-blur-md border border-white/5 rounded-sm shadow-xl hover:border-[var(--primary-color)]/25 duration-300">
                <div className="text-[7.5px] font-mono tracking-widest text-[#00E5FF] uppercase font-bold mb-2.5">
                  📊 THERMODYNAMIC METADATA
                </div>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[8PX] font-extrabold max-w-full">
                  <div className="p-1.5 bg-white/5 rounded border border-white/5">
                    <span className="text-[6.5px] text-white/40 block">MELTING PT</span>
                    <span className="text-white truncate block">{selectedElement.meltingPoint}</span>
                  </div>
                  <div className="p-1.5 bg-white/5 rounded border border-white/5">
                    <span className="text-[6.5px] text-white/40 block">BOILING PT</span>
                    <span className="text-[#00E5FF] truncate block">{selectedElement.boilingPoint}</span>
                  </div>
                  <div className="p-1.5 bg-white/5 rounded border border-white/5 col-span-2 flex justify-between items-center px-2">
                    <span className="text-[6.5px] text-white/40 block">IONIZATION</span>
                    <span className="text-[#00FFB3] font-bold">{selectedElement.ionizationEnergy}</span>
                  </div>
                </div>
              </div>

              {/* Pauling Electronegativity slider */}
              <div className="relative p-3.5 bg-[#070C1B]/55 backdrop-blur-md border border-white/5 rounded-sm shadow-xl hover:border-[var(--primary-color)]/25 duration-300 flex flex-col gap-1.5">
                <span className="text-[7.5px] font-mono tracking-widest text-[#FF80AB] uppercase font-bold">
                  🔗 PAULINGS ELECTRONEGATIVITY GAUGE
                </span>
                <div className="flex items-center gap-2 font-mono">
                  <div className="flex-1 h-1.5 bg-white/5 rounded overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 via-amber-400 to-red-500 rounded"
                      style={{ width: `${Math.min(100, ((selectedElement.electronegativity || 0) / 4) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-white">
                    {selectedElement.electronegativity !== null ? selectedElement.electronegativity.toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="text-[8px] text-white/40 border-t border-white/5 pt-1.5 flex justify-between font-mono">
                  <span>VALID OXIDATION STATES:</span>
                  <span className="text-white font-bold">{(selectedElement.oxidationStates || []).join(', ')}</span>
                </div>
              </div>

              {/* Chemical Reactivity brief */}
              <div className="relative p-3.5 bg-[#070C1B]/55 backdrop-blur-md border border-white/5 rounded-sm shadow-xl hover:border-[var(--primary-color)]/25 duration-300 flex flex-col gap-1">
                <span className="text-[7.5px] font-mono tracking-widest text-emerald-400 uppercase font-bold mb-0.5">
                  🪐 CORE CHEMICAL REACTIVITY
                </span>
                <p className="text-[9px] text-[#EAF2FF]/85 leading-relaxed font-sans font-light">
                  {selectedElement.chemicalProperties?.reactivityProfile || selectedElement.reactivity || 'Stable and inactive atmospheric noble gas element.'}
                </p>
              </div>
            </div>

            {/* PANEL 4: COSMIC EVOLUTION FLUX (BOTTOM LEFT) */}
            <div className="absolute bottom-16 left-4 md:left-8 w-72 pointer-events-auto flex flex-col gap-3 animate-fade-in z-30">
              <div className="relative p-3.5 bg-[#070C1B]/55 backdrop-blur-md border border-white/5 rounded-sm shadow-xl hover:border-[var(--primary-color)]/25 duration-300 flex flex-col gap-1.5">
                <span className="text-[7.5px] font-mono tracking-widest text-[#00E5FF] uppercase font-bold flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-[#00E5FF]" /> 🌌 COSMIC EVOLUTION & ABUNDANCE
                </span>
                <p className="text-[9px] text-[#EAF2FF]/80 leading-relaxed font-sans font-light border-b border-white/5 pb-1.5">
                  {selectedElement.cosmicProperties?.stellarOrigin || selectedElement.cosmicRelevance || 'Material synthesized in cyclotronic high-energy labs.'}
                </p>
                <div className="grid grid-cols-2 gap-y-1 gap-x-2 font-mono text-[8px] text-[#EAF2FF]/60 font-bold">
                  <div>Universe: <span className="text-white">{selectedElement.cosmicProperties?.cosmicAbundance || 'Trace'}</span></div>
                  <div>Earth Crust: <span className="text-white">{selectedElement.cosmicProperties?.earthAbundance || 'Trace'}</span></div>
                  <div className="col-span-2">Genesis: <span className="text-[#00FFB3]">{selectedElement.cosmicProperties?.nucleosynthesisProcess || 'Lab particles bombardment'}</span></div>
                </div>
              </div>
            </div>

            {/* PANEL 5: INDUSTRIAL IMPACT & BIORISK MONITOR (BOTTOM RIGHT) */}
            <div className="absolute bottom-16 right-4 md:right-8 w-72 pointer-events-auto flex flex-col gap-3 animate-fade-in z-30">
              <div className="relative p-3.5 bg-[#070C1B]/55 backdrop-blur-md border border-white/5 rounded-sm shadow-xl hover:border-[var(--primary-color)]/25 duration-300 flex flex-col gap-2">
                <span className="text-[7.5px] font-mono tracking-widest text-[#FF9100] uppercase font-bold">
                  🏭 CIVILLIAN & TECHNOLOGICAL IMPACT
                </span>
                
                <div className="space-y-1.5">
                  {[
                    { title: '💻 Semiconductors', desc: selectedElement.industrialApplications?.semiconductors || 'Quantum computational core design.' },
                    { title: '🩺 Medicine/Sciences', desc: selectedElement.industrialApplications?.medicine || 'Used in radio-isotope tracing.' },
                    { title: '⚡ Industrial Energy', desc: selectedElement.industrialApplications?.nuclearEnergy || selectedElement.industrialApplications?.batteries || 'Superconductor lattice frameworks.' }
                  ].map((item, idx) => (
                    <div key={idx} className="text-[8.5px] font-sans font-light leading-normal border-l border-white/10 pl-1.5 py-0.5">
                      <span className="font-mono text-[7px] font-bold uppercase text-[#00E5FF] block leading-none mb-0.5">{item.title}</span>
                      <span className="text-white/80">{item.desc}</span>
                    </div>
                  ))}
                </div>

                {/* Toxicity warnings */}
                <div className="mt-1 p-1 py-1 px-2.5 bg-red-950/20 border border-red-500/20 text-[8.2px] text-red-300 rounded flex gap-2 items-center font-mono">
                  <span className="text-[6px] bg-red-500/25 px-1 py-0.5 rounded font-black uppercase tracking-widest">HAZARD</span>
                  <span className="truncate font-sans font-light text-red-100">{selectedElement.biologicalProperties?.toxicity || 'Non-toxic, safe ecological constituent.'}</span>
                </div>
              </div>
            </div>

            {/* PANEL 6: CHEMICAL FUSION PORTAL (BOTTOM CENTER) */}
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-85 pointer-events-auto flex flex-col gap-2 items-center text-center animate-fade-in z-30">
              <div className="w-full relative p-3 bg-[#070C1B]/85 backdrop-blur-sm border border-white/5 rounded-sm shadow-xl text-left hover:border-[var(--primary-color)]/20 transition-colors">
                <span className="text-[7px] font-mono tracking-widest text-[#00FFB3] uppercase font-bold block mb-1">
                  🔗 MATTER SYNTHESIS & REACTION AFFINITIES
                </span>
                
                <div className="flex flex-wrap gap-1 justify-center mt-1.5">
                  {/* Pull common reaction partners */}
                  {(selectedElement.relationshipNetwork?.commonReactionPartners || 
                    selectedElement.reactionIntelligence?.compatibleElements || 
                    ['O', 'H']).slice(0, 4).map((partner: string, idx: number) => {
                      const cleanSymbol = partner.replace(/[0-9]/g, '').trim();
                      const linkedEl = ELEMENTS_DATA.find(e => e.symbol === cleanSymbol);
                      
                      // Check what compound can be formed
                      const possibleReaction = REACTION_CONFIGS.find(cfg => 
                        cfg.reactants.includes(selectedElement.symbol) && cfg.reactants.includes(cleanSymbol)
                      );

                      return (
                        <div key={idx} className="relative group">
                          <button
                            onClick={() => {
                              if (possibleReaction) {
                                // Direct launch into bond lab preloaded
                                handleReactionInit(possibleReaction);
                              } else if (linkedEl) {
                                onSelectElement(linkedEl);
                              }
                            }}
                            className={`px-2 py-0.8 text-[8.5px] bg-[#070B14] border border-white/10 rounded-sm font-mono font-bold text-white transition-all duration-150 cursor-pointer ${
                              possibleReaction 
                                ? 'hover:border-[#FF9100] text-[#FF9100]/90 hover:bg-[#FF9100]/10 hover:shadow-[0_0_8px_rgba(255,145,0,0.15)]' 
                                : 'hover:border-[#00FFB3] hover:bg-white/5'
                            }`}
                          >
                            + {partner} {possibleReaction && '⚛'}
                          </button>
                          
                          {/* Rich feedback tooltip detailing compounding */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-48 bg-[#090E1F] border border-white/15 p-2 rounded shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 text-[8px] font-mono z-50 text-left scale-95 origin-bottom group-hover:scale-100 ease-out">
                            {possibleReaction ? (
                              <>
                                <div className="text-[#FF9100] font-black uppercase mb-0.5">SYNTHESIS AVAILABLE:</div>
                                <div className="text-white font-black">{possibleReaction.productFormula}</div>
                                <div className="text-white/70 leading-tight mt-0.5">{possibleReaction.productName}</div>
                                <div className="text-[7.5px] text-[#00FFB3] mt-1 font-bold">CLICK SYSTEM TO PRELOAD SYNTHESIS PORTAL</div>
                              </>
                            ) : (
                              <>
                                <div className="text-[#00FFB3] font-black uppercase mb-0.5">COMPATIBLE PARTNER:</div>
                                <div className="text-white font-black">{partner}</div>
                                <div className="text-white/60 leading-tight mt-0.5">Transits matrix to {partner}'s subatomic field.</div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Dismiss element explorer */}
              <button
                onClick={() => {
                  onSelectElement(null);
                  window.dispatchEvent(new CustomEvent('shell-probe-selected', { detail: { index: null } }));
                }}
                className="px-5 py-2.5 bg-red-950/45 border border-red-500/30 hover:border-red-500 text-[9px] font-mono tracking-[0.16em] text-red-200 font-extrabold uppercase transition-all rounded shadow-2xl hover:bg-red-500/15 cursor-pointer max-w-[170px]"
              >
                DISCONNECT METADATA ✖
              </button>
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
      <footer className="w-full flex flex-col gap-4 pointer-events-auto z-40 select-none">
        
        {/* ELEMENT CATEGORY COLOR CODE LEGEND */}
        {isObsEntered && (
          <div id="orbital-category-legend" className="w-full max-w-7xl mx-auto px-4 py-2 bg-[#0B1020]/90 backdrop-blur-md border border-white/10 rounded-sm shadow-xl flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-center font-mono animate-fade-in pointer-events-auto">
            <div className="text-[8px] font-black uppercase text-[#00E5FF] tracking-widest border-r border-white/10 pr-3 mr-1 hidden lg:block">
              grid.category_index()
            </div>
            {Object.entries(CATEGORY_COLORS).map(([key, cat]) => (
              <div 
                key={key} 
                className="flex items-center gap-1.5 group cursor-help relative"
              >
                {/* Glowing indicator dot with category color */}
                <div 
                  className="w-2.5 h-2.5 rounded-sm border border-black/40 transition-transform group-hover:scale-125 duration-300"
                  style={{ 
                    backgroundColor: cat.hex,
                    boxShadow: `0 0 10px ${cat.hex}88`
                  }} 
                />
                
                {/* Label */}
                <span className="text-[9px] uppercase tracking-wider text-[#EAF2FF]/70 group-hover:text-white transition-colors">
                  {cat.label}
                </span>

                {/* Cybernetic Tooltip Hover Box */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 scale-90 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-250 z-50 p-2.5 w-48 bg-[#070C1B]/95 border border-[#00E5FF]/20 rounded-sm shadow-2xl text-left font-mono">
                  <div className="text-[9.5px] font-bold uppercase tracking-wide" style={{ color: cat.hex }}>{cat.label}</div>
                  <div className="text-[8.5px] text-[#EAF2FF]/70 leading-normal mt-1 font-light">{cat.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* TIMELINE SLIDER SCALED OVERLAY */}
        {isObsEntered && appMode === 'timeline' && (
          <div id="timeline-hud-scrubber" className="w-full max-w-4xl mx-auto px-5 py-4 bg-[#0B1020]/95 backdrop-blur-md border border-[#00FFB3]/30 rounded-md text-left font-mono flex flex-col gap-3 shadow-[0_0_30px_rgba(0,255,179,0.15)] animate-fade-in">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00FFB3]" />
                <span className="uppercase text-[#EAF2FF]/50 text-[10px] tracking-widest">CHRONO SEEKER CONSOLE:</span>
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
                  <span>{isPlayingTimeline ? "PAUSE DRIFT" : "CHRONO DRIFT"}</span>
                </button>
                <button
                  onClick={() => {
                    onChangeTimelineYear(-5000);
                    setIsPlayingTimeline(false);
                  }}
                  className="px-2 py-1 bg-white/5 border border-white/10 hover:border-white/30 text-[9px] font-bold uppercase rounded-sm cursor-pointer text-[#EAF2FF]"
                  title="Reset timeline to deep antiquity"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[9px] text-[#EAF2FF]/30 select-none whitespace-nowrap">ANCIENT BC</span>
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
                  className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#00FFB3]"
                />
              </div>
              <span className="text-[9px] text-[#00FFB3] font-extrabold whitespace-nowrap">2026 AD (MODERN)</span>
            </div>
            
            <div className="flex justify-between text-[7px] text-[#EAF2FF]/30 select-none uppercase tracking-widest font-bold">
              <span>-5000 BC (Antiquity metals)</span>
              <span>1700 (Alchemy age)</span>
              <span>1800 (Gaseous separation)</span>
              <span>1900 (Mendeleev Matrix)</span>
              <span>1950 (Superheavy labs)</span>
              <span>2026 AD (Modern physics)</span>
            </div>
          </div>
        )}

        <div className="w-full flex justify-between items-end select-none">
          {/* HOVER STATUS FIELD */}
          {!selectedElement && (
            <div id="orb-hud-details-preview" className="px-4 py-3 bg-[#0B1020]/80 backdrop-blur-md border border-white/10 rounded-sm text-left max-w-sm md:max-w-md h-18 font-mono flex items-center justify-between gap-4">
              {hoveredElement ? (
                <div className="flex items-center gap-3 animate-fade-in text-left">
                  <div className="relative flex items-center justify-center relative-symbol-container w-10 h-10 select-none">
                    {/* The Energy Field Background Expansion Layer */}
                    <div 
                      className="absolute inset-0 rounded-sm pointer-events-none energy-field-expansion"
                      style={{ 
                        '--en-color': getElectronegativityColor(hoveredElement.electronegativity)
                      } as React.CSSProperties}
                    />
                    
                    {/* The Main Dynamic Symbol Border Block */}
                    <div 
                      className="relative z-10 w-full h-full border bg-[#070B14]/90 flex items-center justify-center text-md font-black italic element-symbol-pulse transition-all duration-300"
                      style={{ 
                        '--pulse-color': getElectronegativityColor(hoveredElement.electronegativity), 
                        color: getCatMeta(hoveredElement.category).hex 
                      } as React.CSSProperties}
                    >
                      {hoveredElement.symbol}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase font-extrabold text-[#EAF2FF]">{hoveredElement.name} ({hoveredElement.number})</div>
                    <div className="text-[9px] uppercase tracking-wider text-[#EAF2FF]/50 leading-tight">
                      {getCatMeta(hoveredElement.category).label} | CONFIG: {hoveredElement.electronConfig}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[#EAF2FF]/30">
                  <Compass className="w-4.5 h-4.5 animate-pulse text-[#00E5FF]" />
                  <span className="text-[10px] uppercase tracking-widest">HOVER COSMIC ELEMENTS TO SCAN MOLECULAR STATE...</span>
                </div>
              )}
            </div>
          )}

          {/* QUANTUM MULTI-SCALE INDICATOR */}
          <div className="hidden lg:flex flex-col items-center gap-1.5 bg-[#0B1020]/90 border border-white/10 px-4 py-2 rounded-sm shadow-xl backdrop-blur-md pointer-events-auto">
            <span className="text-[8px] font-mono tracking-widest text-[#00E5FF]/80 uppercase font-black flex items-center gap-1">
              <Compass className="w-3 h-3 animate-spin" style={{ animationDuration: '12s' }} />
              QUANTUM SYSTEM SCALE NAVIGATOR
            </span>
            <div className="flex items-center gap-1.5 p-0.5 bg-black/40 rounded-sm border border-white/5">
              {[
                { id: 'cosmic', label: 'Cosmic', metric: '10¹² m', val: 2.2, color: '#7C4DFF' },
                { id: 'periodic', label: 'Gridmap', metric: '10⁻² m', val: 1.0, color: '#00E5FF' },
                { id: 'molecular', label: 'Molecular', metric: '10⁻⁹ m', val: 1.35, color: '#00FFB3' },
                { id: 'atomic', label: 'Atomic', metric: '10⁻¹⁰ m', val: 0.95, color: '#FFD600' },
                { id: 'subatomic', label: 'Core', metric: '10⁻¹⁵ m', val: 0.42, color: '#FF1744' }
              ].map((sc) => {
                const isSelected = scaleMode === sc.id;
                // Allow selecting only applicable modes per user-intent
                const isDisabled = (sc.id === 'cosmic' || sc.id === 'periodic') && selectedElement;
                const isAtomsOnly = (sc.id === 'atomic' || sc.id === 'subatomic') && !selectedElement;
                const active = isSelected;
                
                return (
                  <button
                    key={sc.id}
                    disabled={isDisabled || isAtomsOnly}
                    onClick={() => {
                      setScaleMode(sc.id as any);
                      window.dispatchEvent(new CustomEvent('set-cosmic-zoom', { detail: { multiplier: sc.val } }));
                    }}
                    className={`px-3 py-1.5 flex flex-col items-center justify-center rounded-sm transition-all cursor-pointer border ${
                      active
                        ? 'bg-[#00E5FF]/10 text-white font-black shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                        : isDisabled || isAtomsOnly
                          ? 'opacity-20 cursor-not-allowed border-transparent text-white/10'
                          : 'border-transparent text-white/50 hover:text-[#00E5FF] hover:bg-white/5'
                    }`}
                    style={active ? { borderColor: sc.color } : {}}
                  >
                    <span className="text-[9px] font-mono uppercase tracking-wider leading-none" style={active ? { color: sc.color } : {}}>{sc.label}</span>
                    <span className="text-[7px] font-mono mt-0.5 tracking-tighter text-white/30 leading-none">{sc.metric}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected element back indicator */}
          {selectedElement && (
            <button
              onClick={() => onSelectElement(null)}
              className="px-4 py-2 bg-[#0B1020]/70 border border-white/15 hover:border-[#00E5FF] hover:text-[#00E5FF] font-mono text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 rounded-sm cursor-pointer"
            >
              ← RETREAT TO COSMIC GRIDMAP
            </button>
          )}

          {/* System Coordinates */}
          <div className="hidden sm:block text-[9px] font-mono text-[#EAF2FF]/35 text-right tracking-widest lowercase">
            sys.status(running: true) // frame_hz: {currentFps}.0
          </div>
        </div>
      </footer>
    </div>
  );
}
