/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
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
  VolumeX
} from 'lucide-react';
import { ChemicalElement, TableLayoutMode, ReactionConfig } from '../types';
import { CATEGORY_COLORS, REACTION_CONFIGS, ELEMENTS_DATA } from '../data';

interface HolographicUIProps {
  selectedElement: ChemicalElement | null;
  hoveredElement: ChemicalElement | null;
  onSelectElement: (element: ChemicalElement | null) => void;
  layoutMode: TableLayoutMode;
  onChangeLayoutMode: (mode: TableLayoutMode) => void;
  appMode: 'explorer' | 'bond_lab' | 'timeline';
  onChangeAppMode: (mode: 'explorer' | 'bond_lab' | 'timeline') => void;
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
  
  // Custom states for audio and timeline
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [liveDistance, setLiveDistance] = useState<number | null>(null);

  // Selected electron shell info state
  const [activeShellInfo, setActiveShellInfo] = useState<{
    shellIndex: number;
    shellName: string;
    electrons: number;
    radius: number;
  } | null>(null);

  // Discovery tracking states
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [discoveredAnomalies, setDiscoveredAnomalies] = useState<any[]>([]);
  const [lastDiscovery, setLastDiscovery] = useState<any | null>(null);

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

  // Reset tab when element changes
  useEffect(() => {
    setActiveTab('overview');
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
        <div className="flex gap-3 font-mono text-[10px] self-end md:self-start">
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
               {/* LEFT HUD: CONTROLS & LAYOUT SWITCHER */}
        {isObsEntered && !selectedElement && (
          <div id="left-hud-controls" className="w-full md:w-72 flex flex-col justify-start gap-4 pointer-events-auto z-40">
            
            {/* 1. ATOMIC EXPLORER PANEL CONTROLS */}
            {appMode === 'explorer' && (
              <>
                {/* Card Layout switcher */}
                <div className="cyber-panel p-4 rounded-sm flex flex-col gap-3 shadow-lg">
                  <div className="text-[10px] font-mono uppercase text-[#00E5FF] tracking-widest flex items-center gap-2">
                    <Layers className="w-4.5 h-4.5" /> COSMIC FIELD LAYOUT
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2">
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
                  <p className="text-[11px] text-[#EAF2FF]/50 leading-relaxed font-light mt-1">
                    Select layout to adjust spatial structure. Elements self-reorganize dynamically.
                  </p>
                </div>

                {/* Slider parameters panel */}
                <div className="cyber-panel p-4 rounded-sm flex flex-col gap-4 shadow-lg">
                  <div className="text-[10px] font-mono uppercase text-[#7C4DFF] tracking-widest flex items-center gap-2">
                    <Sliders className="w-4.5 h-4.5" /> WAVEFIELD MODULATION
                  </div>

                  {/* Slider 1: Simulation Speed */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-[#EAF2FF]/60">
                      <span className="uppercase">TIME COUPLING:</span>
                      <span className="text-[#00E5FF]">{simulationSpeed.toFixed(1)}X</span>
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

                  {/* Slider 2: Reactive intensity */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-[#EAF2FF]/60">
                      <span className="uppercase">KINETIC ENERGY:</span>
                      <span className="text-[#00FFB3]">{reactiveIntensity.toFixed(2)}x</span>
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

                  {/* Dynamic Adaptive Quality & Performance Stabilization */}
                  <div className="w-full h-[1px] bg-white/10 my-1" />

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-[#EAF2FF]/60 uppercase">DIAGNOSTICS:</span>
                      <span className={`font-black tracking-widest ${currentFps >= 50 ? 'text-[#00FFB3]' : 'text-[#FFD54F]'}`}>
                        {currentFps} FPS
                      </span>
                    </div>

                    <button
                      onClick={() => onChangeAdaptiveQuality(!adaptiveQuality)}
                      className={`w-full py-1.5 px-2 text-[10px] font-extrabold uppercase tracking-widest border transition-all cursor-pointer flex justify-between items-center bg-[#070B14] ${
                        adaptiveQuality
                          ? 'border-[#00E5FF]/40 text-[#00E5FF] hover:border-[#00E5FF]/70'
                          : 'border-white/10 text-[#EAF2FF]/40 hover:border-white/20'
                      }`}
                    >
                      <span>ADAPTIVE STABILIZATION:</span>
                      <span className="font-extrabold text-xs">{adaptiveQuality ? 'ON' : 'OFF'}</span>
                    </button>

                    {adaptiveQuality && (
                      <div className="flex items-center gap-1.5 mt-0.5 px-2 py-1 rounded bg-black/40 text-[9px] font-mono border border-white/5">
                        <span className={`w-1.5 h-1.5 rounded-full ${isLowPerfMode ? 'bg-[#FF9100] animate-pulse' : 'bg-[#00FFB3]'}`} />
                        <span className={isLowPerfMode ? 'text-[#FF9100]' : 'text-[#EAF2FF]/50'}>
                          {isLowPerfMode ? 'OPTIMIZED STABILIZATION ACTIVE' : 'AURA FLOW: MAX INTENSITY'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reaction Lab Drawer */}
                <div className="cyber-panel p-4 rounded-sm flex flex-col gap-3 shadow-lg">
                  <div className="text-[10px] font-mono uppercase text-[#00FFB3] tracking-widest flex items-center gap-2">
                    <Flame className="w-4.5 h-4.5 text-[#00FFB3]" /> REACTION SYNTHESIZER
                  </div>

                  <div className="flex flex-col gap-2 mt-1 max-h-48 overflow-y-auto pr-1">
                    {REACTION_CONFIGS.map((re, rIdx) => (
                      <div 
                        key={rIdx} 
                        className="p-2.5 bg-white/5 border border-white/10 rounded-sm flex flex-col justify-between items-start gap-1 hover:border-white/25 transition-colors group"
                      >
                        <div className="flex justify-between w-full items-center">
                          <span className="text-[11px] font-extrabold text-[#EAF2FF]/90 group-hover:text-[#00E5FF] transition-colors">{re.productFormula}</span>
                          <span className="text-[8px] font-mono px-1.5 py-0.5 borer rounded bg-[#070B14] text-[#EAF2FF]/40">{re.visualType.toUpperCase()}</span>
                        </div>
                        <div className="text-[10px] text-[#EAF2FF]/50">{re.productName}</div>
                        
                        <button
                          onClick={() => handleReactionInit(re)}
                          className="mt-1.5 w-full py-1 bg-[#0A0D1A] border border-white/15 hover:border-[#00FFB3] hover:text-[#00FFB3] text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer text-center text-[#EAF2FF]/70"
                        >
                          SYNTHESIZE
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* 2. DISCOVERY TIMELINE PANEL CONTROLS */}
            {appMode === 'timeline' && (
              <div className="cyber-panel p-4 rounded-sm flex flex-col gap-3 shadow-lg">
                <div className="text-[11px] font-mono uppercase text-[#00FFB3] tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-4.5 h-4.5 text-[#00FFB3]" /> CHRONO METRICS
                </div>
                
                <div className="p-3 bg-[#0B1020]/80 border border-white/5 rounded-sm flex flex-col gap-1.5 mt-1">
                  <div className="text-[9px] text-[#EAF2FF]/50 uppercase tracking-wider font-mono">SELECTED FOCUS YEAR:</div>
                  <div className="text-xl font-bold text-[#00E5FF] font-mono">
                    {timelineYear < 0 ? `${Math.abs(timelineYear)} BC` : `${timelineYear} AD`}
                  </div>
                  <div className="text-[11px] text-[#EAF2FF]/80 leading-normal font-light">
                    {getPeriodDescription(timelineYear)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="p-2.5 bg-white/[0.03] border border-white/5 rounded-sm text-center">
                    <div className="text-lg font-bold font-mono text-[#00FFB3]">{totalDiscoveredCount}</div>
                    <div className="text-[7.5px] text-[#EAF2FF]/40 font-mono uppercase tracking-widest">DISCOVERED</div>
                  </div>
                  <div className="p-2.5 bg-white/[0.03] border border-white/5 rounded-sm text-center">
                    <div className="text-lg font-bold font-mono text-white/40">{118 - totalDiscoveredCount}</div>
                    <div className="text-[7.5px] text-[#EAF2FF]/40 font-mono uppercase tracking-widest">UNDISCOVERED</div>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-[#EAF2FF]/40 mt-2 uppercase tracking-wider">
                  QUICK PERIOD DECK:
                </div>
                <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
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
                        <div className="text-[8px] text-[#EAF2FF]/50 font-light truncate max-w-[150px]">{ep.desc}</div>
                      </div>
                      <span className="text-[9px] font-mono font-bold">
                        {ep.year < 0 ? `${Math.abs(ep.year)} BC` : `${ep.year}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. BOND REACTOR PANEL CONTROLS */}
            {appMode === 'bond_lab' && (
              <div className="cyber-panel p-4 rounded-sm flex flex-col gap-3 shadow-lg">
                <div className="text-[10px] font-mono uppercase text-[#FF9100] tracking-widest flex items-center gap-2">
                  <Flame className="w-4.5 h-4.5 text-[#FF9100]" /> 3D CHEMICAL LAB
                </div>
                
                <p className="text-[11px] text-[#EAF2FF]/70 leading-relaxed font-light">
                  Select a molecular formula from the synthesized registry below to construct the reactants in 3D, then drag them together to observe orbital bonding.
                </p>

                <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1 mt-1">
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
                  <div className="mt-2 p-3 bg-black/40 border border-[#FF9100]/20 rounded-sm flex flex-col gap-1.5 animate-fade-in font-mono text-[9px]">
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
            )}
          </div>
        )}
        
        {/* RIGHT HUD: ANOMALOUS DIAGNOSTICS & DISCOVERY SCANNER */}
        {isObsEntered && !selectedElement && appMode === 'explorer' && (
          <div id="right-hud-discovery" className="w-full md:w-85 ml-auto cyber-panel p-4 sm:p-5 rounded-sm flex flex-col justify-start gap-4 shadow-2xl relative select-none pointer-events-auto overflow-y-auto max-h-[85vh] md:max-h-[calc(100vh-130px)] border-[#00E5FF]/20 animate-fade-in z-45 flex-shrink-0">
            <div className="absolute top-0 right-0 p-1 flex gap-1 bg-[#070B14]/40 border-l border-b border-white/10 text-[8px] font-mono tracking-widest text-[#00E5FF]/40 lowercase">
              sys.discovery_module()
            </div>

            <div className="text-[10px] font-mono uppercase text-[#00E5FF] tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#00E5FF] animate-pulse" />
              <span>COSMIC SCANNER & ANOMALY PROBE</span>
            </div>

            <p className="text-[11px] text-[#EAF2FF]/70 leading-relaxed font-sans font-light">
              Initiate deep radiation scans on the 3D scientific sector grids below to uncover hidden physical anomalies, Star-core compositions, and rare synthesis pathways.
            </p>

            <div className="p-4 bg-[#0A0D10]/80 border border-white/5 rounded-sm flex flex-col gap-3 mt-1">
              {!isScanning ? (
                <button
                  onClick={handleStartScan}
                  className="w-full py-2.5 bg-[#00E5FF]/10 border border-[#00E5FF]/30 hover:border-[#00E5FF] hover:bg-[#00E5FF]/20 text-[#00E5FF] text-[10px] uppercase font-mono tracking-widest font-extrabold rounded-sm cursor-pointer transition-all hover:shadow-[0_0_12px_rgba(0,229,255,0.15)] flex justify-center items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>INITIATE QUANTUM SECTOR SCAN</span>
                </button>
              ) : (
                <div className="flex flex-col gap-2 font-mono text-[9px]">
                  <div className="flex justify-between items-center text-[#00E5FF]">
                    <span className="animate-pulse">PROBING SPACE FILAMENTS...</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] transition-all duration-100"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <span className="text-[8px] text-white/30 text-center uppercase tracking-wider">DO NOT DISCONNECT TETHER COILS</span>
                </div>
              )}
            </div>

            {lastDiscovery && (
              <div className="p-3.5 bg-[#00FFB3]/5 border border-[#00FFB3]/20 rounded-sm animate-fade-in flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-[#00FFB3] text-[9.5px] font-mono font-bold uppercase">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>ANOMALY REACHED! Unlocked:</span>
                </div>
                <div className="text-sm font-extrabold text-white tracking-wide uppercase leading-tight font-sans mt-0.5">
                  {lastDiscovery.title}
                </div>
                <div className="text-[8.5px] font-mono text-[#00E5FF] font-bold">
                  {lastDiscovery.category.toUpperCase()} // STATUS: RESOLVED
                </div>
                <p className="text-[10.5px] text-[#EAF2FF]/75 font-light leading-relaxed font-sans">
                  {lastDiscovery.desc}
                </p>
                {lastDiscovery.reactantA && (
                  <div className="mt-1 flex flex-col gap-1.5">
                    <div className="text-[8.5px] font-mono text-white/40 uppercase">SYNTHESIS FORMULA PATH:</div>
                    <div className="flex items-center justify-between text-[10.5px] font-mono bg-black/30 p-2 rounded border border-white/5">
                      <span className="text-[#00FFB3]">{lastDiscovery.pathway}</span>
                      <button
                        onClick={() => {
                          onChangeAppMode('bond_lab');
                          const reaction = REACTION_CONFIGS.find(r => r.reactants.includes(lastDiscovery.reactantA) && r.reactants.includes(lastDiscovery.reactantB));
                          if (reaction) {
                            onTriggerReaction(reaction);
                          }
                        }}
                        className="px-2 py-0.5 border border-[#00E5FF] text-[#00E5FF] rounded bg-[#070B14] hover:bg-[#00E5FF]/10 text-[9px] cursor-pointer transition-all whitespace-nowrap"
                      >
                        ENGAGE REACTION
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex-1 flex flex-col gap-2 min-h-[144px] overflow-hidden">
              <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest font-bold">
                DIAGNOSTICS ARCHIVE LOG ({discoveredAnomalies.length}/5)
              </div>
              
              {discoveredAnomalies.length === 0 ? (
                <div className="flex-1 border border-dashed border-white/10 rounded-sm flex items-center justify-center p-6 text-center text-[#EAF2FF]/35 font-sans font-light text-[10.5px]">
                  No sector anomalies scanned. Execute quantum scans to populate the Observatory Archive.
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 overflow-y-auto max-h-48 pr-1 mt-0.5">
                  {discoveredAnomalies.map((item, index) => (
                    <div 
                      key={index}
                      className="p-2.5 bg-[#0C1123]/90 border border-white/[0.06] rounded-sm flex flex-col gap-1 hover:border-white/15 transition-all text-left font-mono text-[9px]"
                    >
                      <div className="flex justify-between w-full font-bold">
                        <span className="text-white/80 uppercase tracking-wide truncate max-w-[150px]">{item.title}</span>
                        <span className="text-[#00E5FF]">{item.category}</span>
                      </div>
                      <div className="text-[8px] text-white/40 leading-tight">PATH: {item.pathway}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MIDDLE OVERLAY (Active reaction notifications/simulations) */}
        {isObsEntered && activeReaction && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-30 select-none">
            {reactionStage === 'idle' ? (
              <div className="px-6 py-4 bg-[#0B1020]/95 border border-[#FF9100]/50 rounded-sm shadow-[0_0_30px_rgba(255,145,0,0.25)] backdrop-blur-lg flex flex-col items-center text-center max-w-sm pointer-events-auto animate-fade-in">
                <div className="w-10 h-10 border border-dashed border-[#FF9100]/60 rounded-full flex items-center justify-center animate-spin mb-2" style={{ animationDuration: '6s' }}>
                  <Flame className="w-5 h-5 text-[#FF9100]" />
                </div>
                <div className="text-xs font-black tracking-widest text-[#FF9100] uppercase">REACTOR TETHER ACTIVE</div>
                <p className="text-[10.5px] text-[#EAF2FF]/80 leading-relaxed mt-2">
                  Atomic cores spawned in 3D electromagnetic grid. <span className="text-[#00FFB3] font-bold">Drag either reactant</span> across space into proximity to synthesize <span className="text-[#00E5FF] font-bold">{activeReaction.productFormula}</span>.
                </p>
                <button
                  onClick={handleCancelReaction}
                  className="mt-3.5 px-4 py-1.5 bg-red-950/20 border border-red-500/30 hover:border-red-500 text-[9px] font-mono tracking-widest text-red-400 font-extrabold uppercase transition-all rounded-sm cursor-pointer"
                >
                  DISMANTLE BEAMS
                </button>
              </div>
            ) : reactionStage === 'stable' ? (
              <div className="px-6 py-5 bg-[#0B1020]/95 border border-[#00FFB3]/50 rounded-sm shadow-[0_0_35px_rgba(0,255,179,0.3)] backdrop-blur-lg flex flex-col items-center text-center max-w-sm pointer-events-auto animate-fade-in">
                <CheckCircle2 className="w-10 h-10 text-[#00FFB3] mb-2 animate-bounce" />
                <div className="text-[9px] font-mono tracking-widest text-[#00FFB3] uppercase font-black">SYNTHESIS ENVELOPE COMPLETED</div>
                <div className="text-lg font-extrabold text-[#EAF2FF] tracking-wider my-1 uppercase">{activeReaction.productName}</div>
                <div className="text-xs font-black font-mono text-[#00E5FF] px-2 py-0.5 bg-[#00E5FF]/10 border border-[#00E5FF]/20 rounded-sm mb-2">{activeReaction.productFormula}</div>
                <p className="text-[10.5px] text-[#EAF2FF]/75 leading-relaxed font-light mb-4">
                  {activeReaction.description}
                </p>
                
                <button
                  onClick={handleCancelReaction}
                  className="px-6 py-2 bg-[#070B14] border border-[#00FFB3] hover:bg-[#00FFB3]/15 text-[10px] uppercase font-mono font-bold tracking-widest text-[#00FFB3] transition-all cursor-pointer rounded-sm shadow-[0_0_10px_rgba(0,255,179,0.15)]"
                >
                  EJECT & REBOOT COILS
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* RIGHT HUD: REACTOR SPEC-DIAGNOSTIC WORKSTATION */}
        {isObsEntered && appMode === 'bond_lab' && activeReaction && (
          <div className="w-full md:w-90 ml-auto cyber-panel p-4 sm:p-5 rounded-sm flex flex-col gap-3.5 shadow-2xl relative select-none pointer-events-auto overflow-y-auto max-h-[85vh] md:max-h-[calc(100vh-130px)] border-[#FF9100]/30 animate-fade-in z-20">
            {/* Custom cybernetic overlay grids for detailed visual */}
            <div className="absolute top-0 right-0 p-1 flex gap-1 bg-[#070B14]/40 border-l border-b border-white/10 text-[8px] font-mono tracking-widest text-[#EAF2FF]/30 lowercase">
              sys.spectrograph_node()
            </div>

            <div className="text-[10px] font-mono uppercase text-[#00FFB3] tracking-widest border-b border-white/10 pb-2 flex items-center justify-between">
              <span>BOND DIAGNOSTICS WORKSTATION</span>
              <span className="text-[8px] text-[#EAF2FF]/30">CHAMBER_ONLINE</span>
            </div>

            {/* Reaction Summary block */}
            <div className="flex flex-col gap-1 p-3 bg-white/5 rounded-sm border border-white/10">
              <div className="text-[8.5px] font-mono text-[#FF9100] tracking-wider uppercase font-black">FORMULA PATHWAY SELECTED:</div>
              <div className="text-[17px] font-extrabold text-[#EAF2FF] tracking-wider leading-none mt-1">{activeReaction.productName}</div>
              <div className="text-[10px] font-mono text-[#00E5FF] mt-1 font-bold">{activeReaction.productFormula}</div>
            </div>

            {/* Deep Scientific Telemetry parameters displayed elegantly */}
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
                <div className="flex flex-col gap-3.5 font-mono text-[10px]">
                  {/* Reaction Equations */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] text-[#EAF2FF]/40 font-bold uppercase">EQUILIBRIUM EQUATION:</span>
                    <span className="text-[#00FFB3] text-[11px] font-black bg-black/40 px-2.5 py-1.5 rounded-sm border border-[#00FFB3]/15 tracking-wide">
                      {tel.equation}
                    </span>
                  </div>

                  {/* Energy changes */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] text-[#EAF2FF]/40 font-bold uppercase md:text-[7.5px]">ENERGY MODULATION (ENTHALPY):</span>
                    <span className="text-red-400 font-extrabold px-2 py-1 bg-red-950/20 rounded-sm border border-red-500/10">
                      {tel.energyChange}
                    </span>
                  </div>

                  {/* Bond Formation details */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] text-[#EAF2FF]/40 font-bold uppercase">BOND FORMATION MATRIX:</span>
                    <p className="text-[#EAF2FF]/80 text-[10px] leading-relaxed font-light font-sans">
                      {tel.bondDetail}
                    </p>
                  </div>

                  {/* Orbital geometry */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] text-[#EAF2FF]/40 font-bold uppercase">VALENCE ORBITAL HYBRID:</span>
                    <span className="text-[#00E5FF] font-semibold">{tel.orbitalType}</span>
                  </div>

                  {/* Chemical Kinetics */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] text-[#EAF2FF]/40 font-bold uppercase">REACTION VELOCITY:</span>
                    <span className="text-[#EAF2FF]/80 text-[10px] leading-relaxed font-sans font-light">{tel.kinetics}</span>
                  </div>

                  {/* Thermal Status */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] text-[#EAF2FF]/40 font-bold uppercase">THERMAL DISCHARGE:</span>
                    <span className="text-amber-400/90 font-medium">{tel.thermalStatus}</span>
                  </div>

                  {/* Hazards / Warnings */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] text-[#EAF2FF]/40 font-bold uppercase text-red-500/80">containment hazard:</span>
                    <span className="text-[9.5px] text-[#EAF2FF]/70 bg-black/30 p-1.5 rounded border border-white/5 font-sans font-light">{tel.hazards}</span>
                  </div>
                </div>
              );
            })()}
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

              {/* Custom SCI-FI interactive tabs */}
              <div className="flex border-b border-white/10 overflow-x-auto scrollbar-none gap-0.5 mb-3.5 select-none pb-0.5">
                {[
                  { id: 'overview', label: 'Core', icon: Info },
                  { id: 'atomic', label: 'Atomic', icon: Atom },
                  { id: 'properties', label: 'Metrics', icon: Activity },
                  { id: 'cosmic_bio', label: 'Cosmic/Bio', icon: Globe },
                  { id: 'applications', label: 'Tech.Uses', icon: Sparkles }
                ].map((tab) => {
                  const IconComp = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-1 px-2 py-1.5 text-[9px] font-mono uppercase tracking-wider border-b-2 transition-all duration-200 cursor-pointer whitespace-nowrap ${
                        isActive 
                          ? 'text-white font-extrabold' 
                          : 'text-white/40 border-transparent hover:text-white/70'
                      }`}
                      style={isActive ? { borderBottomColor: getCatMeta(selectedElement.category).hex } : {}}
                    >
                      <IconComp className="w-3 h-3" style={isActive ? { color: getCatMeta(selectedElement.category).hex } : {}} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB CONTENT MODULES */}
              <div className="min-h-[220px] mb-3.5">
                {activeTab === 'overview' && (
                  <div className="animate-fade-in flex flex-col gap-3">
                    <p className="text-[11.5px] leading-relaxed text-[#EAF2FF]/85 font-light text-justify">
                      {selectedElement.summary}
                    </p>

                    <div className="p-3 bg-white/[0.03] border border-white/5 rounded-sm">
                      <span className="font-mono text-[7.5px] uppercase tracking-widest text-[#00E5FF] block mb-0.5">NAME ETYMOLOGY & ORIGIN:</span>
                      <span className="text-[10px] text-[#EAF2FF]/80 leading-relaxed block italic">
                        "{selectedElement.nameOrigin}"
                      </span>
                    </div>

                    <div>
                      <span className="font-mono text-[7.5px] uppercase tracking-widest text-[#EAF2FF]/40 block mb-1">MAIN CHEMICAL APPLICATIONS:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedElement.realWorldUses && selectedElement.realWorldUses.map((use, uIdx) => (
                          <span key={uIdx} className="text-[9px] font-mono px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[#EAF2FF]/85 hover:bg-white/10 transition-colors">
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-[#7C4DFF]/15 to-transparent border-l border-[#7C4DFF] text-[10.5px] leading-relaxed rounded-r-md">
                      <span className="font-bold text-[#EAF2FF] block mb-0.5 tracking-wide uppercase font-mono text-[8px]">INTERACTIVE DATA ALERT:</span>
                      <span className="text-[#EAF2FF]/75">{selectedElement.funFact}</span>
                    </div>
                  </div>
                )}

                {activeTab === 'atomic' && (
                  <div className="animate-fade-in flex flex-col gap-3">
                    {/* Nucleon digital counters */}
                    <div className="grid grid-cols-3 gap-1.5 font-mono">
                      <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-sm text-center">
                        <span className="block text-[7px] text-red-400">PROTONS</span>
                        <span className="text-xs font-black text-red-200">{selectedElement.protons}</span>
                      </div>
                      <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-sm text-center">
                        <span className="block text-[7px] text-blue-400">NEUTRONS</span>
                        <span className="text-xs font-black text-blue-200">{selectedElement.neutrons}</span>
                      </div>
                      <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-sm text-center">
                        <span className="block text-[7px] text-emerald-400">ELECTRONS</span>
                        <span className="text-xs font-black text-emerald-200">{selectedElement.electrons}</span>
                      </div>
                    </div>

                    {/* Orbital Diagram filling path */}
                    <div className="p-3 bg-white/[0.03] border border-white/5 rounded-sm">
                      <span className="font-mono text-[7.5px] uppercase tracking-widest text-[#00E5FF] block mb-0.5">VALENCE ORBITAL DISTRIBUTION:</span>
                      <p className="text-[10px] text-[#EAF2FF]/80 leading-relaxed font-mono">
                        {selectedElement.orbitalBreakdown}
                      </p>
                    </div>

                    {/* Schrödinger Energy shells */}
                    <div className="p-3 bg-white/[0.03] border border-white/5 rounded-sm flex flex-col gap-2">
                      <div className="text-[9px] font-mono uppercase tracking-widest text-[#00FFB3] flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Atom className="w-3 h-3 text-[#00FFB3]" /> SCHRÖDINGER ENERGY SHELLS
                        </span>
                        <span className="text-[7.5px] text-[#EAF2FF]/40 lowercase">click shell to probe</span>
                      </div>
                      <div className="flex gap-1 items-center font-mono animate-fade-in">
                        {selectedElement.shells.map((eCount, idx) => {
                          const shellLabels = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
                          const shellLabel = shellLabels[idx] || `S${idx + 1}`;
                          const isHighlighted = activeShellInfo !== null && activeShellInfo.shellIndex === idx;
                          return (
                            <div 
                              key={idx} 
                              className={`flex-1 p-1 rounded flex flex-col items-center border transition-all duration-300 ${
                                isHighlighted 
                                  ? 'bg-[#00FFB3]/10 border-[#00FFB3]/80 shadow-[0_0_8px_rgba(0,255,179,0.25)] scale-[1.04]'
                                  : 'bg-white/5 border-white/10 hover:border-white/20'
                              }`}
                            >
                              <span className="text-[6.5px] text-[#EAF2FF]/40">N{idx+1} ({shellLabel})</span>
                              <span className={`text-[10px] font-black ${isHighlighted ? 'text-white' : 'text-[#00FFB3]'}`}>{eCount}ᴇ</span>
                            </div>
                          );
                        })}
                      </div>
                      
                      {activeShellInfo ? (
                        <div className="mt-1 p-2 bg-[#00FFB3]/5 border border-[#00FFB3]/20 rounded-sm font-mono text-[9px] flex flex-col gap-1.5 animate-fade-in">
                          <div className="flex justify-between items-center text-[#00FFB3] border-b border-white/5 pb-1">
                            <span className="font-extrabold uppercase text-[8px] tracking-widest">Active Probe: {activeShellInfo.shellName}-Shell (n={activeShellInfo.shellIndex + 1})</span>
                            <span className="text-[8.5px] bg-[#00FFB3]/20 px-1 py-0.2 rounded font-black text-white">{activeShellInfo.electrons} Electrons</span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[#EAF2FF]/70">
                            <div>• Prob. Type: <span className="text-white font-bold">{['S-Orbital', 'S+P Orbitals', 'S+P+D Clover', 'S+P+D+F Nodes'][activeShellInfo.shellIndex] || 'Hybrid Wave'}</span></div>
                            <div>• Orbital Radius: <span className="text-white font-bold">{(activeShellInfo.radius * 0.53).toFixed(2)} Å</span></div>
                            <div>• Radial Node Count: <span className="text-white font-bold">{activeShellInfo.shellIndex}</span></div>
                            <div>• Density Envelope: <span className="text-[#00FFB3] font-bold">95.4% Wave</span></div>
                          </div>
                          <div className="mt-1 text-[8px] text-[#EAF2FF]/40 leading-tight italic">
                            * Volumetric density cloud rendered on 3D canvas represents the calculated wave probability field.
                          </div>
                        </div>
                      ) : (
                        <span className="text-[9px] font-mono text-[#EAF2FF]/50">Configuration: <span className="text-[#EAF2FF]/95 font-bold">{selectedElement.electronConfig}</span></span>
                      )}
                    </div>

                    {/* Oxidation states list */}
                    <div className="p-2 bg-white/[0.03] border border-white/5 rounded-sm flex flex-col gap-1">
                      <span className="font-mono text-[7.5px] uppercase tracking-widest text-[#EAF2FF]/40 block">TYPICAL OXIDATION STATES:</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {selectedElement.oxidationStates.map((stateVal, idx) => (
                          <span key={idx} className="text-[9px] font-bold font-mono px-1.5 py-0.5 bg-[#00FFB3]/10 text-[#00FFB3] rounded-sm">
                            {stateVal > 0 ? `+${stateVal}` : stateVal}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'properties' && (
                  <div className="animate-fade-in flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <div className="p-2 bg-white/[0.03] border border-white/5 rounded-sm flex flex-col">
                        <span className="font-mono text-[7px] uppercase tracking-wider text-[#EAF2FF]/40">MELTING POINT:</span>
                        <span className="text-[10.5px] font-bold font-mono mt-0.5">{selectedElement.meltingPoint}</span>
                      </div>
                      <div className="p-2 bg-white/[0.03] border border-white/5 rounded-sm flex flex-col">
                        <span className="font-mono text-[7px] uppercase tracking-wider text-[#EAF2FF]/40">BOILING POINT:</span>
                        <span className="text-[10.5px] font-bold font-mono mt-0.5">{selectedElement.boilingPoint}</span>
                      </div>
                      <div className="p-2 bg-white/[0.03] border border-white/5 rounded-sm flex flex-col">
                        <span className="font-mono text-[7px] uppercase tracking-wider text-[#EAF2FF]/40">DENSITY:</span>
                        <span className="text-[10.5px] font-bold font-mono mt-0.5">{selectedElement.density}</span>
                      </div>
                      <div className="p-2 bg-white/[0.03] border border-white/5 rounded-sm flex flex-col">
                        <span className="font-mono text-[7px] uppercase tracking-wider text-[#EAF2FF]/40">STATE (STP):</span>
                        <span className="text-[10.5px] font-extrabold uppercase mt-0.5 tracking-wider text-[#00E5FF]">{selectedElement.state}</span>
                      </div>
                      <div className="p-2 bg-white/[0.03] border border-white/5 rounded-sm flex flex-col">
                        <span className="font-mono text-[7px] uppercase tracking-wider text-[#EAF2FF]/40">ELECTRONEGATIVITY:</span>
                        <span className="text-[10.5px] font-bold font-mono mt-0.5">{selectedElement.electronegativity !== null && selectedElement.electronegativity !== undefined ? selectedElement.electronegativity.toFixed(2) : 'N/A'}</span>
                      </div>
                      <div className="p-2 bg-white/[0.03] border border-white/5 rounded-sm flex flex-col">
                        <span className="font-mono text-[7px] uppercase tracking-wider text-[#EAF2FF]/40">IONIZATION:</span>
                        <span className="text-[10px] font-bold font-mono mt-0.5 truncate">{selectedElement.ionizationEnergy}</span>
                      </div>
                      <div className="p-2 bg-white/[0.03] border border-white/5 rounded-sm flex flex-col col-span-2">
                        <span className="font-mono text-[7px] uppercase tracking-wider text-[#EAF2FF]/40">CHEMICAL REACTIVITY RATIO:</span>
                        <span className="text-[10.5px] font-semibold font-mono mt-0.5 text-[#FFD600] uppercase tracking-widest">{selectedElement.reactivity}</span>
                      </div>
                    </div>

                    {/* Electrical Conductivity detail */}
                    <div className="p-3 bg-[#0B1020]/40 border border-white/5 rounded-sm">
                      <span className="font-mono text-[7.5px] uppercase tracking-widest text-[#00FFB3] block mb-0.5">THERMO-ELECTRICAL CONDUCTIVITY:</span>
                      <p className="text-[10px] text-[#EAF2FF]/80 leading-relaxed font-mono text-justify">
                        {selectedElement.conductivity}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'cosmic_bio' && (
                  <div className="animate-fade-in flex flex-col gap-3 text-[10px] leading-relaxed">
                    {/* Cosmic nucleosynthesis */}
                    <div className="p-2.5 bg-[#00E5FF]/5 border border-[#00E5FF]/15 rounded-sm">
                      <div className="font-mono text-[7.5px] uppercase tracking-widest text-[#00E5FF] flex items-center gap-1 mb-1">
                        <Globe className="w-3 h-3" /> COSMIC ORIGIN & STELLAR STORY
                      </div>
                      <p className="text-[#EAF2FF]/85 text-justify leading-relaxed">
                        {selectedElement.cosmicRelevance}
                      </p>
                    </div>

                    {/* Biological metabolic footprint */}
                    <div className="p-2.5 bg-[#00FFB3]/5 border border-[#00FFB3]/15 rounded-sm">
                      <div className="font-mono text-[7.5px] uppercase tracking-widest text-[#00FFB3] flex items-center gap-1 mb-1">
                        <Activity className="w-3 h-3" /> BIOLOGICAL ROLE & HAZARDS
                      </div>
                      <p className="text-[#EAF2FF]/85 text-justify leading-relaxed">
                        {selectedElement.biologicalRelevance}
                      </p>
                    </div>

                    {/* Nuclear isotopes details */}
                    <div className="p-2.5 bg-red-500/5 border border-red-500/15 rounded-sm">
                      <div className="font-mono text-[7.5px] uppercase tracking-widest text-red-400 flex items-center gap-1 mb-1">
                        <Atom className="w-3 h-3 animate-pulse" /> NUCLEAR CONFIGURATION & ISOTOPES
                      </div>
                      <p className="text-[#EAF2FF]/85 text-justify leading-relaxed">
                        {selectedElement.nuclearProperties}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'applications' && (
                  <div className="animate-fade-in flex flex-col gap-2">
                    <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-sm">
                      <span className="font-mono text-[7.2px] uppercase tracking-widest text-[#D4AF37] block mb-0.5">01 // INDUSTRIAL MASS ENGINEERING:</span>
                      <p className="text-[9.5px] text-[#EAF2FF]/85 leading-normal">{selectedElement.applications.industrial}</p>
                    </div>
                    <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-sm">
                      <span className="font-mono text-[7.2px] uppercase tracking-widest text-[#00E5FF] block mb-0.5">02 // COMPUTATION & NANOTECH:</span>
                      <p className="text-[9.5px] text-[#EAF2FF]/85 leading-normal">{selectedElement.applications.technology}</p>
                    </div>
                    <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-sm">
                      <span className="font-mono text-[7.2px] uppercase tracking-widest text-[#00FFB3] block mb-0.5">03 // MEDICAL & BIOMETRICS:</span>
                      <p className="text-[9.5px] text-[#EAF2FF]/85 leading-normal">{selectedElement.applications.medical}</p>
                    </div>
                    <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-sm">
                      <span className="font-mono text-[7.2px] uppercase tracking-widest text-[#FF5722] block mb-0.5">04 // ORBITAL STAR-DRIVES & SPACE:</span>
                      <p className="text-[9.5px] text-[#EAF2FF]/85 leading-normal">{selectedElement.applications.spaceAndEnergy}</p>
                    </div>
                  </div>
                )}
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
                <div className="flex items-center gap-3 animate-fade-in">
                  <div className="w-10 h-10 border border-[#00E5FF]/40 bg-[#070B14] flex items-center justify-center text-md font-black italic select-none" style={{ borderColor: getCatMeta(hoveredElement.category).hex, color: getCatMeta(hoveredElement.category).hex }}>
                    {hoveredElement.symbol}
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
