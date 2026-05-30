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
                {/* Collapsible Panel 1: Chemistry Molecules Registry */}
                <div className="border border-white/10 rounded-sm bg-white/[0.01] overflow-hidden">
                  <button 
                    onClick={() => setBondFormulaCollapsed(!bondFormulaCollapsed)}
                    className="w-full p-4 flex items-center justify-between font-mono text-[10px] uppercase text-[#FF9100] tracking-widest bg-white/[0.02] border-b border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="flex items-center gap-2 font-black">
                      <Flame className="w-4.5 h-4.5 text-[#FF9100]" /> CANDIDATE MOLECULES
                    </span>
                    {bondFormulaCollapsed ? <ChevronDown className="w-4 h-4 text-white/50" /> : <ChevronUp className="w-4.5 h-4.5 text-[#FF9100]" />}
                  </button>

                  <div className={`transition-all duration-300 overflow-hidden ${bondFormulaCollapsed ? 'max-h-0' : 'max-h-[500px] p-4'}`}>
                    <p className="text-[10px] text-[#EAF2FF]/60 leading-relaxed font-light mb-3">
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

                    {activeReaction && (
                      <div className="mt-3 p-3 bg-black/40 border border-[#FF9100]/20 rounded-sm flex flex-col gap-1.5 animate-fade-in font-mono text-[9px]">
                        <div className="text-[8px] text-[#FF9100] uppercase tracking-wider font-extrabold">OBSERVATION FEED:</div>
                        <div className="flex justify-between text-[#EAF2FF]/75">
                          <span>REACTANT A:</span>
                          <span className="font-bold text-[#00E5FF]">{activeReaction.reactants[0]}</span>
                        </div>
                        <div className="flex justify-between text-[#EAF2FF]/75">
                          <span>REACTANT B:</span>
                          <span className="font-bold text-[#EAF2FF]">{activeReaction.reactants[1]}</span>
                        </div>
                        <div className="w-full h-[1px] bg-white/15 my-0.5" />
                        <div className="flex justify-between text-[#EAF2FF]/95">
                          <span>LINK TELEMETRY:</span>
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

                {/* Collapsible Panel 2: Diagnostics Workstation */}
                {activeReaction && (
                  <div className="border border-[#FF9100]/30 rounded-sm bg-white/[0.01] overflow-hidden">
                    <button 
                      onClick={() => setBondDiagnosticsCollapsed(!bondDiagnosticsCollapsed)}
                      className="w-full p-4 flex items-center justify-between font-mono text-[10px] uppercase text-[#00FFB3] tracking-widest bg-[#FF9100]/5 border-b border-[#FF9100]/25 cursor-pointer hover:bg-[#FF9100]/10 transition-colors"
                    >
                      <span className="flex items-center gap-2 font-black">
                        <Activity className="w-4 h-4 text-[#00FFB3]" /> BOND DIAGNOSTICS LABORATORY
                      </span>
                      {bondDiagnosticsCollapsed ? <ChevronDown className="w-4 h-4 text-white/50" /> : <ChevronUp className="w-4.5 h-4.5 text-[#00FFB3]" />}
                    </button>

                    <div className={`transition-all duration-300 overflow-hidden ${bondDiagnosticsCollapsed ? 'max-h-0' : 'max-h-[900px] p-4 space-y-3.5 font-mono text-[10px]'}`}>
                      {/* Reaction Summary block */}
                      <div className="flex flex-col gap-1 p-3 bg-white/5 rounded-sm border border-white/10">
                        <div className="text-[8.5px] font-mono text-[#FF9100] tracking-wider uppercase font-black">FORMULA PATHWAY SELECTED:</div>
                        <div className="text-[14px] font-extrabold text-[#EAF2FF] tracking-wider leading-none mt-1">{activeReaction.productName}</div>
                        <div className="text-[10px] font-mono text-[#00E5FF] mt-1 font-bold">{activeReaction.productFormula}</div>
                      </div>

                      {(() => {
                        const tel = REACTION_TELEMETRY[activeReaction.productFormula] || {
                          equation: `${activeReaction.reactants[0]} + ${activeReaction.reactants[1]} → ${activeReaction.productFormula}`,
                          energyChange: 'ΔH < 0 (Unspecified heat release)',
                          bondDetail: 'Orbital hybridization and valence sharing sequence.',
                          orbitalType: 'Dynamic hybrid valence bonds',
                          kinetics: 'Spontaneous chain alignment',
                          thermalStatus: 'Energetically active fusion',
                          hazards: 'None identified.'
                        };

                        return (
                          <div className="space-y-3.5">
                            {/* Reaction Equations */}
                            <div className="flex flex-col gap-1">
                              <span className="text-[8px] text-[#EAF2FF]/40 font-bold uppercase">EQUILIBRIUM EQUATION:</span>
                              <span className="text-[#00FFB3] text-[11px] font-black bg-black/40 px-2.5 py-1.5 rounded-sm border border-[#00FFB3]/15 tracking-wide">
                                {tel.equation}
                              </span>
                            </div>

                            {/* Energy changes */}
                            <div className="flex flex-col gap-1">
                              <span className="text-[8px] text-[#EAF2FF]/40 font-bold uppercase">ENERGY MODULATION (ENTHALPY):</span>
                              <span className="text-red-400 font-extrabold px-2 py-1 bg-red-950/20 rounded-sm border border-red-500/10">
                                {tel.energyChange}
                              </span>
                            </div>

                            {/* Bond Formation details */}
                            <div className="flex flex-col gap-1 col-span-2">
                              <span className="text-[8px] text-[#EAF2FF]/40 font-bold uppercase">BOND FORMATION MATRIX:</span>
                              <p className="text-[#EAF2FF]/80 text-[10px] leading-relaxed font-light font-sans">
                                {tel.bondDetail}
                              </p>
                            </div>

                            {/* Orbital geometry */}
                            <div className="grid grid-cols-2 gap-3 pb-1 border-b border-white/5">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[7.5px] text-[#EAF2FF]/40 font-bold uppercase">VALENCE HYBRID:</span>
                                <span className="text-[#00E5FF] font-semibold text-[9px]">{tel.orbitalType}</span>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[7.5px] text-[#EAF2FF]/40 font-bold uppercase">REACTION VELOCITY:</span>
                                <span className="text-[#EAF2FF]/80 text-[9px] font-medium font-sans truncate">{tel.kinetics}</span>
                              </div>
                            </div>

                            {/* Thermal Status */}
                            <div className="flex flex-col gap-1">
                              <span className="text-[8px] text-[#EAF2FF]/40 font-bold uppercase">THERMAL DISCHARGE:</span>
                              <span className="text-amber-400/90 font-medium">{tel.thermalStatus}</span>
                            </div>

                            {/* Hazards */}
                            <div className="flex flex-col gap-1 pt-1">
                              <span className="text-[8px] text-[#EAF2FF]/40 font-bold uppercase text-red-500/80">containment hazard:</span>
                              <span className="text-[9px] text-[#EAF2FF]/70 bg-black/30 p-2 rounded border border-white/5 font-sans font-light leading-normal">{tel.hazards}</span>
                            </div>
                          </div>
                        );
                      })()}
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

        {/* RIGHT HUD: SELECTED ELEMENT DETAILS */}
        {isObsEntered && selectedElement && (
          <div ref={sidebarRef} id="element-detail-sidebar" className="w-full md:w-85 ml-auto cyber-panel p-4 sm:p-5 rounded-sm flex flex-col justify-between shadow-2xl relative select-none pointer-events-auto overflow-y-auto max-h-[85vh] md:max-h-[calc(100vh-130px)]">
            {/* Custom cybernetic overlay grids for detailed visual */}
            <div className="absolute top-0 right-0 p-1 flex gap-1 bg-[#070B14]/40 border-l border-b border-white/10 text-[8px] font-mono tracking-widest text-[#EAF2FF]/30 lowercase">
              sys.view_node()
            </div>

            {/* Close button */}
            <button
              onClick={() => onSelectElement(null)}
              className="absolute top-4 right-4 w-7 h-7 border border-white/10 hover:border-red-500 hover:text-red-500 rounded-full flex items-center justify-center text-[#EAF2FF]/60 cursor-pointer transition-colors active:scale-90"
              title="Close Element Explorer"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div>
              {/* Heading */}
              <div className="flex items-baseline gap-2 mb-3 mt-1.5">
                <span className="text-sm font-mono text-[#00E5FF]">{selectedElement.number.toString().padStart(3, '0')}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-white/5 uppercase rounded tracking-wider text-white/70">{getCatMeta(selectedElement.category).label}</span>
              </div>

              {/* Big symbol details */}
              <div className="flex items-center gap-3.5 mb-3.5">
                <div className="relative w-14 h-14 rounded border flex items-center justify-center bg-[#070B14]" style={{ borderColor: getCatMeta(selectedElement.category).hex }}>
                  <span className="text-xl font-black tracking-tighter" style={{ color: getCatMeta(selectedElement.category).hex }}>
                    {selectedElement.symbol}
                  </span>
                  <div className="absolute bottom-0 right-1 text-[8px] font-mono text-[#EAF2FF]/30">{selectedElement.number}</div>
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-widest text-[#EAF2FF] uppercase leading-tight">{selectedElement.name}</h2>
                  <div className="text-[10px] font-mono text-[#EAF2FF]/40 mt-0.5">Weight: <span className="text-[#EAF2FF]/90 font-bold">{selectedElement.mass.toFixed(4)} u</span></div>
                </div>
              </div>

              {/* Custom SCI-FI interactive 10-Layer depth header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3.5 select-none text-[9.5px]">
                <div className="flex flex-col">
                  <span className="text-[#00E5FF] font-black uppercase tracking-wider font-mono">MATTER EXPLORATION DEPTH</span>
                  <span className="text-white/40 text-[8px] font-mono tracking-widest mt-0.5">LAUNCHED PORTAL [ 0{activeLayer} / 10 ]</span>
                </div>
                <div className="flex gap-1 font-bold">
                  <button
                    disabled={activeLayer === 1}
                    onClick={() => setActiveLayer(prev => Math.max(1, prev - 1))}
                    className="px-2 py-0.5 border border-white/10 hover:border-white/35 hover:bg-white/5 rounded-sm disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-[9px] font-bold font-mono text-white/85 bg-[#050811]"
                  >
                    ◀
                  </button>
                  <button
                    disabled={activeLayer === 10}
                    onClick={() => setActiveLayer(prev => Math.min(10, prev + 1))}
                    className="px-2 py-0.5 border border-white/10 hover:border-white/35 hover:bg-white/5 rounded-sm disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-[9px] font-bold font-mono text-white/85 bg-[#050811]"
                  >
                    ▶
                  </button>
                </div>
              </div>

              {/* Split layout: Stepper on LEFT, Content on RIGHT */}
              <div className="flex gap-3 min-h-[385px] pb-3 select-none">
                
                {/* Vertical Stepper Rail (LEFT) */}
                <div className="w-8 shrink-0 flex flex-col items-center justify-between border-r border-white/5 pr-1.5 py-1 font-mono text-[9px] select-none">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                    const isActive = activeLayer === num;
                    const dotColor = getCatMeta(selectedElement.category).hex;
                    return (
                      <button
                        key={num}
                        onClick={() => setActiveLayer(num)}
                        className="group relative w-full flex flex-col items-center outline-none py-1 transition-all duration-200 cursor-pointer font-bold"
                      >
                        {/* Hidden knowledge bubble */}
                        <span className="absolute left-[-115px] bg-black/95 border border-white/10 text-[7px] text-white/90 px-1.5 py-0.5 rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 font-bold z-50 whitespace-nowrap tracking-wider uppercase">
                          {['CORE IDENTITY', 'ATOMIC STRUCTURE', 'PHYSICAL PROP.', 'CHEMICAL BEHAVIOR', 'TECH AND USES', 'COSMIC ORIGIN', 'BIOLOGICAL ROLE', 'HISTORIC IMPACT', 'REACTION NETWORK', 'ORBITIUM FREQ.'][num - 1]}
                        </span>

                        <span 
                          className={`text-[8px] font-black transition-all duration-300 text-center ${
                            isActive 
                              ? 'scale-115 font-black text-white' 
                              : 'text-white/20 group-hover:text-white/65'
                          }`}
                          style={isActive ? { color: dotColor, textShadow: `0 0 10px ${dotColor}` } : {}}
                        >
                          {num.toString().padStart(2, '0')}
                        </span>
                        
                        <div 
                          className={`w-1 h-1 rounded-full mt-0.5 transition-all duration-300 ${
                            isActive 
                              ? 'w-1.5 h-1.5 ring-1 ring-offset-1 ring-offset-black' 
                              : 'bg-white/10 group-hover:bg-white/35'
                          }`}
                          style={isActive ? { backgroundColor: dotColor, borderColor: dotColor } : {}}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Content Pane (RIGHT) */}
                <div className="flex-1 overflow-y-auto max-h-[52vh] pr-0.5 scrollbar-none flex flex-col justify-between">

                  <ElementExplorationDepth
                    selectedElement={selectedElement}
                    activeLayer={activeLayer}
                    setActiveLayer={setActiveLayer}
                    onSelectElement={onSelectElement}
                    activeShellInfo={activeShellInfo}
                    setActiveShellInfo={setActiveShellInfo}
                    getCatMeta={getCatMeta}
                    ELEMENTS_DATA={ELEMENTS_DATA}
                  />
                </div>
              </div>
            </div>

              

            {/* Historic Discoveries Info */}
            <div className="border-t border-white/10 pt-3 flex justify-between items-center text-[9.5px] font-mono text-[#EAF2FF]/50 mt-1">
              <div>
                <span className="block text-[7.5px] uppercase text-[#EAF2FF]/30">DISCOVERED BY:</span>
                <span className="text-[#EAF2FF]/95 font-medium">{selectedElement.discoveredBy}</span>
              </div>
              <div className="text-right">
                <span className="block text-[7.5px] uppercase text-[#EAF2FF]/30">YEAR ISSUED:</span>
                <span className="text-[#EAF2FF]/95 font-bold">{selectedElement.year > 0 ? selectedElement.year : 'ANCIENT'}</span>
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
                        '--pulse-color': getCatMeta(hoveredElement.category).hex, 
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
