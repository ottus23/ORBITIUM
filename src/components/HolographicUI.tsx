/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
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
  Globe
} from 'lucide-react';
import { ChemicalElement, TableLayoutMode, ReactionConfig } from '../types';
import { CATEGORY_COLORS, REACTION_CONFIGS, ELEMENTS_DATA } from '../data';

interface HolographicUIProps {
  selectedElement: ChemicalElement | null;
  hoveredElement: ChemicalElement | null;
  onSelectElement: (element: ChemicalElement | null) => void;
  layoutMode: TableLayoutMode;
  onChangeLayoutMode: (mode: TableLayoutMode) => void;
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

  // Reset tab when element changes
  useEffect(() => {
    setActiveTab('overview');
  }, [selectedElement]);

  // Trigger Reaction Lifecycle animation
  const handleReactionInit = (re: ReactionConfig) => {
    onTriggerReaction(re);
    setReactionStage('mixing');
    onSetReactiveIntensity(4.0); // Crank up kinetic disturbances
    setReactionCountDown(3);
    
    // Automatically walk user to first element in the reaction
    const firstReactant = ELEMENTS_DATA.find(e => e.symbol === re.reactants[0]);
    if (firstReactant) {
      onSelectElement(firstReactant);
    }
  };

  useEffect(() => {
    if (reactionStage === 'mixing' && reactionCountDown > 0) {
      const timer = setTimeout(() => {
        setReactionCountDown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (reactionStage === 'mixing' && reactionCountDown === 0) {
      setReactionStage('stable');
      onSetReactiveIntensity(1.55); // Settle chemical state
    }
  }, [reactionStage, reactionCountDown]);

  const handleCancelReaction = () => {
    setReactionStage('idle');
    onTriggerReaction(null);
    onSetReactiveIntensity(1.0);
  };

  // Safe category retrieval
  const getCatMeta = (cat: string) => {
    return CATEGORY_COLORS[cat] || { hex: '#00E5FF', label: cat, description: '' };
  };

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
              onClick={onEnterObs}
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
      <header className="w-full flex justify-between items-start pointer-events-auto">
        {/* Logo and Tagline */}
        <div id="orb-hud-brand" className="flex items-center gap-3">
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

        {/* Dynamic status widgets */}
        <div className="hidden md:flex gap-4 font-mono text-[10px]">
          <div className="px-3 py-1.5 bg-[#0B1020]/60 backdrop-blur-md border border-[#EAF2FF]/10 rounded-sm">
            <span className="text-[#00FFB3] uppercase">● OBSERVATORY:</span> SECURE
          </div>
          <div className="px-3 py-1.5 bg-[#0B1020]/60 backdrop-blur-md border border-[#EAF2FF]/10 rounded-sm">
            <span className="text-[#00E5FF] uppercase">STABILITY:</span> 99.98%
          </div>
        </div>
      </header>

      {/* =======================================================
          MAIN INTERACTION HUD OVERLAYS (Left / Right / Middle)
          ======================================================= */}
      <main className="flex-1 my-4 flex flex-col md:flex-row gap-6 relative justify-between items-stretch">
        
        {/* LEFT HUD: CONTROLS & LAYOUT SWITCHER */}
        {isObsEntered && !selectedElement && (
          <div id="left-hud-controls" className="w-full md:w-72 flex flex-col justify-start gap-4 pointer-events-auto">
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
          </div>
        )}

        {/* MIDDLE OVERLAY (Active reaction notifications/simulations) */}
        {isObsEntered && activeReaction && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-30 select-none">
            {reactionStage === 'mixing' ? (
              <div className="px-6 py-4 bg-[#0B1020]/90 border border-[#D500F9]/40 rounded-sm shadow-[0_0_30px_rgba(213,0,249,0.3)] backdrop-blur-lg flex flex-col items-center text-center max-w-sm pointer-events-auto">
                <Activity className="w-8 h-8 text-[#D500F9] animate-bounce mb-2" />
                <div className="text-xs font-black tracking-widest text-[#D500F9] uppercase">COLLISION SEQUENCE ACTIVE</div>
                <div className="text-[28px] font-black font-mono text-[#EAF2FF] my-2">{reactionCountDown}s</div>
                <p className="text-[11px] text-[#EAF2FF]/70">
                  Synthesizing <span className="text-[#00FFB3] font-bold">{activeReaction.productFormula}</span>. Aligning orbitals and transferring valence energy particles.
                </p>
              </div>
            ) : reactionStage === 'stable' ? (
              <div className="px-6 py-5 bg-[#0B1020]/90 border border-[#00FFB3]/40 rounded-sm shadow-[0_0_30px_rgba(0,255,179,0.3)] backdrop-blur-lg flex flex-col items-center text-center max-w-sm pointer-events-auto">
                <CheckCircle2 className="w-10 h-10 text-[#00FFB3] mb-2 animate-bounce" />
                <div className="text-[10px] font-mono tracking-widest text-[#00FFB3] uppercase">INTEGRITY ENVELOPE SECURED</div>
                <div className="text-lg font-bold text-[#EAF2FF] tracking-wider my-1 uppercase">{activeReaction.productName}</div>
                <p className="text-[11px] text-[#EAF2FF]/70 leading-relaxed font-light mb-3">
                  {activeReaction.description}
                </p>
                
                <button
                  onClick={handleCancelReaction}
                  className="px-6 py-1.5 bg-[#070B14] border border-[#00E5FF] hover:bg-[#00E5FF]/15 text-[10px] uppercase font-bold tracking-widest text-[#00E5FF] transition-all cursor-pointer rounded-sm"
                >
                  RESET LAB FIELD
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* RIGHT HUD: SELECTED ELEMENT DETAILS */}
        {isObsEntered && selectedElement && (
          <div id="element-detail-sidebar" className="w-full md:w-85 ml-auto cyber-panel p-4 sm:p-5 rounded-sm flex flex-col justify-between shadow-2xl relative select-none pointer-events-auto overflow-y-auto max-h-[85vh] md:max-h-[calc(100vh-130px)]">
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
                      <div className="text-[9px] font-mono uppercase tracking-widest text-[#00FFB3] flex items-center gap-1">
                        <Atom className="w-3 h-3 text-[#00FFB3]" /> SCHRÖDINGER ENERGY SHELLS
                      </div>
                      <div className="flex gap-1 items-center font-mono">
                        {selectedElement.shells.map((eCount, idx) => (
                          <div key={idx} className="flex-1 p-1 bg-white/5 border border-white/10 rounded flex flex-col items-center">
                            <span className="text-[6.5px] text-[#EAF2FF]/40">N{idx+1}</span>
                            <span className="text-[10px] font-black text-[#00FFB3]">{eCount}ᴇ</span>
                          </div>
                        ))}
                      </div>
                      <span className="text-[9px] font-mono text-[#EAF2FF]/50">Configuration: <span className="text-[#EAF2FF]/95 font-bold">{selectedElement.electronConfig}</span></span>
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
      <footer className="w-full flex justify-between items-end select-none pointer-events-auto z-10">
        
        {/* HOVER STATUS FIELD */}
        {isObsEntered && !selectedElement && (
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
        {isObsEntered && selectedElement && (
          <button
            onClick={() => onSelectElement(null)}
            className="px-4 py-2 bg-[#0B1020]/70 border border-white/15 hover:border-[#00E5FF] hover:text-[#00E5FF] font-mono text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 rounded-sm cursor-pointer"
          >
            ← RETREAT TO COSMIC GRIDMAP
          </button>
        )}

        {/* System Coordinates */}
        <div className="hidden sm:block text-[9px] font-mono text-[#EAF2FF]/35 text-right tracking-widest lowercase">
          sys.status(running: true) // frame_hz: 60.0
        </div>
      </footer>
    </div>
  );
}
