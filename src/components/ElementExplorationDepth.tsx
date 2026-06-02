import React from 'react';
import { 
  Atom, Globe, Activity, ChevronLeft, ChevronRight, X, 
  Hexagon, Zap, Thermometer, ShieldAlert, BookOpen, 
  Rocket, Lightbulb, Dna, Anchor, Microscope, Satellite,
  Network, Flame, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ElementExplorationDepthProps {
  selectedElement: any;
  activeLayer: number;
  setActiveLayer: React.Dispatch<React.SetStateAction<number>>;
  onSelectElement: (element: any) => void;
  activeShellInfo: any;
  setActiveShellInfo: React.Dispatch<React.SetStateAction<any>>;
  getCatMeta: (category: string) => { label: string; hex: string };
  ELEMENTS_DATA: any[];
}

export const ElementExplorationDepth: React.FC<ElementExplorationDepthProps> = ({
  selectedElement,
  activeLayer,
  setActiveLayer,
  onSelectElement,
  activeShellInfo,
  setActiveShellInfo,
  getCatMeta,
  ELEMENTS_DATA
}) => {
  const catColor = getCatMeta(selectedElement.category).hex;

  // Let's guarantee helper data exists even if not populated in the model
  const core = selectedElement.coreIdentity || {};
  const arch = selectedElement.atomicArchitecture || {};
  const phys = selectedElement.physicalProperties || {};
  const chem = selectedElement.chemicalProperties || {};
  const cosmic = selectedElement.cosmicProperties || {};
  const bio = selectedElement.biologicalProperties || {};
  const hist = selectedElement.historicalProperties || {};
  const ind = selectedElement.industrialApplications || {};
  const reactIntel = selectedElement.reactionIntelligence || {};
  const personality = selectedElement.orbitiumPersonality || {};

  return (
    <div className="flex-1 flex flex-col h-full select-none text-[#EAF2FF] max-h-[80vh] overflow-y-auto custom-scrollbar relative px-6 py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLayer}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-6"
        >

          {/* LAYER 1: OVERVIEW / IDENTITY */}
          {activeLayer === 1 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: catColor + '40' }}>
                <Hexagon className="w-6 h-6" style={{ color: catColor }} />
                <h2 className="text-xl font-black tracking-widest uppercase" style={{ color: catColor }}>
                  Core Identity
                </h2>
              </div>
              
              <div className="p-5 border bg-black/40 rounded-sm relative overflow-hidden" style={{ borderColor: catColor + '30' }}>
                 <div className="absolute top-0 right-0 w-32 h-32 opacity-10" style={{ background: `radial-gradient(circle, ${catColor} 0%, transparent 70%)` }} />
                 <p className="text-sm font-light leading-relaxed mb-4 text-[#EAF2FF]/90">
                   {selectedElement.summary}
                 </p>
                 <div className="grid grid-cols-2 gap-4 font-mono text-xs font-bold">
                    <div>
                      <span className="text-white/40 block text-[10px] mb-1">CATEGORY</span>
                      <span className="uppercase" style={{ color: catColor }}>{selectedElement.category.replace('-', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[10px] mb-1">STATE AT STP</span>
                      <span className="uppercase text-white">{selectedElement.state}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[10px] mb-1">GROUP / PERIOD</span>
                      <span className="uppercase text-white">{selectedElement.group} / {selectedElement.period}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[10px] mb-1">BLOCK</span>
                      <span className="uppercase text-white">{core.block || 'S'}-BLOCK</span>
                    </div>
                 </div>
              </div>

              <div className="p-4 border border-white/5 bg-white/5 rounded-sm">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#00E5FF] block mb-2 font-bold">Etymology & Origin //</span>
                <span className="text-sm text-[#EAF2FF]/80 leading-relaxed font-light italic border-l-2 pl-3" style={{ borderColor: catColor }}>
                  "{selectedElement.nameOrigin}"
                </span>
              </div>
            </div>
          )}

          {/* LAYER 2: ATOMIC ARCHITECTURE */}
          {activeLayer === 2 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: catColor + '40' }}>
                <Atom className="w-6 h-6" style={{ color: catColor }} />
                <h2 className="text-xl font-black tracking-widest uppercase" style={{ color: catColor }}>
                  Atomic Architecture
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-3 font-bold font-mono">
                <div className="p-4 bg-white/5 border border-white/10 rounded-sm text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1 opacity-20"><Globe size={32} /></div>
                  <span className="block text-[10px] text-emerald-400 mb-1">ELECTRONS</span>
                  <span className="text-2xl font-black text-white">{selectedElement.electrons}</span>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-sm text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1 opacity-20"><Activity size={32} /></div>
                  <span className="block text-[10px] text-red-400 mb-1">PROTONS</span>
                  <span className="text-2xl font-black text-white">{selectedElement.protons}</span>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-sm text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1 opacity-20"><Hexagon size={32} /></div>
                  <span className="block text-[10px] text-blue-400 mb-1">NEUTRONS</span>
                  <span className="text-2xl font-black text-white">{selectedElement.neutrons}</span>
                </div>
              </div>

              <div className="p-5 border border-white/10 bg-black/40 rounded-sm flex flex-col gap-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 block mb-2 font-bold">VALENCE ORBITAL CONFIGURATION</span>
                  <p className="text-sm text-white font-bold font-mono tracking-widest">
                    {selectedElement.orbitalBreakdown || selectedElement.electronConfig}
                  </p>
                </div>
                
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#00FFB3] flex items-center gap-2 mb-3 font-bold block">
                    <Atom className="w-4 h-4 text-[#00FFB3] animate-spin-slow" /> SCHRÖDINGER ENERGY SHELLS
                  </span>
                  <div className="flex gap-2">
                    {selectedElement.shells.map((eCount: number, idx: number) => {
                      const shellLabels = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
                      const shellLabel = shellLabels[idx] || `S${idx + 1}`;
                      const isHighlighted = activeShellInfo !== null && activeShellInfo.shellIndex === idx;
                      return (
                        <button 
                          key={idx} 
                          onClick={() => {
                            setActiveShellInfo({
                              shellIndex: idx,
                              shellName: shellLabel,
                              electrons: eCount,
                              radius: (idx + 1) * 2.8
                            });
                            window.dispatchEvent(new CustomEvent('shell-probe', { detail: { index: idx } }));
                          }}
                          className={`flex-1 p-2 rounded-sm flex flex-col items-center border transition-all duration-300 cursor-pointer ${
                            isHighlighted 
                              ? 'bg-[#00FFB3]/20 border-[#00FFB3] shadow-[0_0_15px_rgba(0,255,179,0.3)] scale-105'
                              : 'bg-white/5 border-white/10 hover:border-white/30'
                          }`}
                        >
                          <span className="text-[10px] text-white/50 font-bold mb-1">N{idx+1}({shellLabel})</span>
                          <span className={`text-base font-black ${isHighlighted ? 'text-white' : 'text-[#00FFB3]'}`}>{eCount}ᴇ⁻</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LAYER 3: PHYSICAL PROPERTIES */}
          {activeLayer === 3 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: catColor + '40' }}>
                <Thermometer className="w-6 h-6" style={{ color: catColor }} />
                <h2 className="text-xl font-black tracking-widest uppercase" style={{ color: catColor }}>
                  Physical Properties
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono">
                <div className="p-4 border border-white/10 bg-white/5 rounded-sm flex flex-col gap-1">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">DENSITY</span>
                  <span className="text-lg font-black text-white">{selectedElement.density || 'N/A'}</span>
                </div>
                <div className="p-4 border border-white/10 bg-white/5 rounded-sm flex flex-col gap-1">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">HARDNESS (MOHS)</span>
                  <span className="text-lg font-black text-white">{phys.hardness || 'N/A'}</span>
                </div>
                <div className="p-4 border border-white/10 bg-red-900/20 rounded-sm flex flex-col gap-1">
                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">MELTING POINT</span>
                  <span className="text-lg font-black text-white">{selectedElement.meltingPoint || 'N/A'}</span>
                </div>
                <div className="p-4 border border-white/10 bg-blue-900/20 rounded-sm flex flex-col gap-1">
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">BOILING POINT</span>
                  <span className="text-lg font-black text-white">{selectedElement.boilingPoint || 'N/A'}</span>
                </div>
              </div>

              <div className="p-5 border border-white/10 bg-black/40 rounded-sm">
                <span className="text-[10px] text-[#00E5FF] uppercase block mb-3 tracking-widest font-extrabold">CRYSTALLINE LATTICE PROFILE</span>
                <p className="text-sm text-white/80 font-light leading-relaxed border-l-2 border-[#00E5FF] pl-4 italic">
                  {phys.crystalStructure || 'Solid state geometric lattices.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm font-light">
                 <div className="p-4 border border-white/10 bg-white/5 rounded-sm">
                   <strong className="block text-[10px] uppercase tracking-widest text-[#00FFB3] mb-2 font-mono">Thermal Flux</strong>
                   {selectedElement.conductivity || phys.thermalConductivity || 'N/A'}
                 </div>
                 <div className="p-4 border border-white/10 bg-white/5 rounded-sm">
                   <strong className="block text-[10px] uppercase tracking-widest text-[#FFD600] mb-2 font-mono">Magnetic Profile</strong>
                   {phys.magneticProperties || 'N/A'}
                 </div>
              </div>
            </div>
          )}

          {/* LAYER 4: CHEMICAL BEHAVIOR */}
          {activeLayer === 4 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: catColor + '40' }}>
                <Zap className="w-6 h-6" style={{ color: catColor }} />
                <h2 className="text-xl font-black tracking-widest uppercase" style={{ color: catColor }}>
                  Chemical Properties
                </h2>
              </div>

              <div className="p-5 border border-white/10 bg-black/40 rounded-sm flex flex-col gap-3">
                <span className="text-[10px] text-[#FFD600] uppercase tracking-widest font-extrabold font-mono flex items-center justify-between">
                  <span>Paulings Electronegativity Index</span>
                  <span className="text-lg text-white font-black">{selectedElement.electronegativity !== null ? selectedElement.electronegativity.toFixed(2) : 'N/A'}</span>
                </span>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 rounded-full"
                    style={{ width: `${Math.min(100, ((selectedElement.electronegativity || 0) / 4) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono">
                <div className="p-4 border border-white/10 bg-white/5 rounded-sm flex flex-col gap-1 text-center">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">ELECTRON AFFINITY</span>
                  <span className="text-sm font-black text-white mt-1">{chem.electronAffinity || 'N/A'}</span>
                </div>
                <div className="p-4 border border-white/10 bg-white/5 rounded-sm flex flex-col gap-1 text-center">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">IONIZATION ENERGY</span>
                  <span className="text-sm font-black text-[#00E5FF] mt-1">{selectedElement.ionizationEnergy || 'N/A'}</span>
                </div>
              </div>

              <div className="p-5 border border-white/10 bg-white/5 rounded-sm">
                <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-3 block font-mono">Active Oxidation States</span>
                <div className="flex flex-wrap gap-2">
                  {(selectedElement.oxidationStates || []).map((stateVal: number, idx: number) => (
                    <span key={idx} className="text-sm font-bold px-3 py-1 bg-[#00FFB3]/20 border border-[#00FFB3]/40 text-[#00FFB3] rounded-sm shadow-[0_0_10px_rgba(0,255,179,0.2)]">
                      {stateVal > 0 ? `+${stateVal}` : stateVal}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 border border-amber-500/30 bg-amber-500/10 rounded-sm">
                 <strong className="text-[10px] uppercase font-mono text-[#FFD600] tracking-widest block mb-2 font-bold">Reactivity Profile & Bonding</strong>
                 <p className="text-sm text-white/90 leading-relaxed font-light">
                   {chem.bondingCharacteristics || chem.reactivityProfile || selectedElement.reactivity || 'Forms bonds based on available valence electrons.'}
                 </p>
              </div>
            </div>
          )}

          {/* LAYER 5: INDUSTRIAL APPLICATIONS */}
          {activeLayer === 5 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: catColor + '40' }}>
                <Rocket className="w-6 h-6" style={{ color: catColor }} />
                <h2 className="text-xl font-black tracking-widest uppercase" style={{ color: catColor }}>
                  Industrial System
                </h2>
              </div>

              <p className="text-sm text-white/80 font-light leading-relaxed">
                Discover how this element powers modern civilization. Its unique atomic structure directly translates to technological breakthroughs.
              </p>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { title: 'COMPUTERS & ELECTRONICS', icon: Network, desc: ind.electronics || ind.semiconductors || 'Semiconductor fabrication in computational units.', theme: '#00E5FF' },
                  { title: 'AEROSPACE & MATERIAL ENG.', icon: Rocket, desc: ind.aerospace || ind.spaceTechnology || (selectedElement.applications && selectedElement.applications.spaceAndEnergy) || 'Crucial alloys deployed in extreme structural limits.', theme: '#FF80AB' },
                  { title: 'CLINICAL MEDICINE', icon: Microscope, desc: ind.medicine || (selectedElement.applications && selectedElement.applications.medical) || 'Used in clinical tracking and target biometrics.', theme: '#00FFB3' },
                  { title: 'ENERGY & BATTERIES', icon: Zap, desc: ind.batteries || ind.nuclearEnergy || 'Supports high-output electrical cells and power generation.', theme: '#FFD600' }
                ].map((app, idx) => {
                  const Icon = app.icon;
                  return (
                    <div key={idx} className="p-4 border border-white/10 bg-black/40 rounded-sm flex gap-4 items-start group hover:border-white/30 transition-colors">
                      <div className="w-10 h-10 rounded-sm bg-white/5 flex flex-shrink-0 items-center justify-center border border-white/10" style={{ color: app.theme }}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-xs tracking-widest uppercase mb-1 block" style={{ color: app.theme }}>{app.title}</span>
                        <p className="text-white/80 text-sm font-light leading-relaxed">{app.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* LAYER 6: COSMIC ORIGIN */}
          {activeLayer === 6 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: catColor + '40' }}>
                <Satellite className="w-6 h-6" style={{ color: catColor }} />
                <h2 className="text-xl font-black tracking-widest uppercase" style={{ color: catColor }}>
                  Cosmic Origin System
                </h2>
              </div>

              <div className="p-6 border border-[#00E5FF]/30 bg-[#00E5FF]/5 rounded-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 opacity-20" style={{ background: 'radial-gradient(circle, #00E5FF 0%, transparent 70%)' }} />
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#00E5FF] mb-3 font-extrabold flex items-center gap-2">
                  <Globe className="w-4 h-4" /> ORIGIN OF MATTER PATHWAY
                </span>
                <p className="text-base text-white/90 font-light leading-relaxed relative z-10 italic">
                  "{cosmic.stellarOrigin || selectedElement.cosmicRelevance}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-white/10 bg-white/5 rounded-sm flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono font-bold">Nucleosynthesis Process</span>
                  <span className="text-sm font-bold text-[#00FFB3] uppercase">{cosmic.nucleosynthesisProcess || 'Stellar Core Fusion'}</span>
                </div>
                <div className="p-4 border border-white/10 bg-white/5 rounded-sm flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono font-bold">Planetary Crust Seed</span>
                  <span className="text-sm font-bold text-white uppercase">{cosmic.planetaryPresence || 'Tectonic trace'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 border border-white/10 bg-black/40 rounded-sm text-center">
                  <span className="block text-[10px] uppercase tracking-widest text-[#EAF2FF]/50 font-mono mb-2">Universe Abundance</span>
                  <span className="text-xl font-black text-white">{cosmic.cosmicAbundance || 'Trace'}</span>
                </div>
                <div className="p-5 border border-white/10 bg-black/40 rounded-sm text-center">
                  <span className="block text-[10px] uppercase tracking-widest text-[#EAF2FF]/50 font-mono mb-2">Earth Abundance</span>
                  <span className="text-xl font-black text-white">{cosmic.earthAbundance || 'Trace'}</span>
                </div>
              </div>
            </div>
          )}

          {/* LAYER 7: BIOLOGICAL SYSTEM */}
          {activeLayer === 7 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: catColor + '40' }}>
                <Dna className="w-6 h-6" style={{ color: catColor }} />
                <h2 className="text-xl font-black tracking-widest uppercase" style={{ color: catColor }}>
                  Biological System
                </h2>
              </div>

              <div className="p-6 border border-[#00FFB3]/30 bg-[#00FFB3]/5 rounded-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Dna size={80} /></div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#00FFB3] flex items-center gap-2 mb-3 font-extrabold">
                  <Activity className="w-4 h-4" /> METABOLIC & BIOSPHERIC ROLE
                </span>
                <p className="text-base text-white/90 font-light leading-relaxed relative z-10 italic">
                  "{bio.biologicalImportance || selectedElement.biologicalRelevance}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 border border-white/10 bg-black/40 rounded-sm text-center">
                  <span className="block text-[10px] uppercase tracking-widest text-white/40 font-mono mb-2">Human Body Ratio</span>
                  <span className="text-2xl font-black text-white">{bio.humanBodyPresence || '0.00%'}</span>
                </div>
                <div className="p-5 border border-white/10 bg-black/40 rounded-sm text-center">
                  <span className="block text-[10px] uppercase tracking-widest text-white/40 font-mono mb-2">Nutrition Class</span>
                  <span className="text-lg font-black text-[#00FFB3] uppercase">{bio.nutritionalRelevance || 'Inert'}</span>
                </div>
              </div>

              <div className="p-5 border border-red-500/30 bg-red-950/20 rounded-sm flex items-start gap-4">
                <ShieldAlert className="w-8 h-8 text-red-500 flex-shrink-0" />
                <div>
                  <strong className="block text-[10px] tracking-widest uppercase text-red-400 font-mono mb-2 font-bold">Toxicity & Health Hazards</strong>
                  <p className="text-sm font-light leading-relaxed text-red-100">
                    {bio.toxicity || 'Considered non-toxic and organically safe under standard physiological conditions.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LAYER 8: HISTORICAL SYSTEM */}
          {activeLayer === 8 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: catColor + '40' }}>
                <BookOpen className="w-6 h-6" style={{ color: catColor }} />
                <h2 className="text-xl font-black tracking-widest uppercase" style={{ color: catColor }}>
                  Historical System
                </h2>
              </div>

              <div className="p-6 border border-white/10 bg-black/40 rounded-sm">
                <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono font-bold block mb-4">Discovery Milestones</span>
                <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-4">
                  <div>
                    <span className="block text-sm text-white/60 mb-1 font-light">Discovered By</span>
                    <span className="text-xl font-bold text-white">{hist.discoverer || selectedElement.discoveredBy}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm text-white/60 mb-1 font-light">Year</span>
                    <span className="text-3xl font-black text-[#FFD600]">{hist.discoveryYear || selectedElement.year > 0 ? selectedElement.year : 'ANCIENT'}</span>
                  </div>
                </div>
                <p className="text-sm text-white/80 font-light leading-relaxed">
                  {hist.historicalSignificance || 'Instrumental in advancing foundational physical chemistry and industrial metallurgy.'}
                </p>
              </div>

              <div className="p-5 border border-[#00E5FF]/20 bg-[#00E5FF]/5 rounded-sm">
                <span className="text-[10px] font-black uppercase text-[#00E5FF] tracking-widest mb-4 block font-mono">Major Scientific Milestones</span>
                <ul className="space-y-3">
                  {(hist.majorScientificMilestones || ['Identified via early spectrum analysis techniques.']).map((mile: string, idx: number) => (
                    <li key={idx} className="flex gap-3 items-start">
                      <Sparkles className="w-4 h-4 text-[#00E5FF] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-white/90 font-light leading-relaxed">{mile}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* LAYER 9: REACTION INTELLIGENCE */}
          {activeLayer === 9 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: catColor + '40' }}>
                <Flame className="w-6 h-6" style={{ color: catColor }} />
                <h2 className="text-xl font-black tracking-widest uppercase" style={{ color: catColor }}>
                  Reaction Intelligence
                </h2>
              </div>

              <p className="text-sm text-white/70 font-light italic">
                Interactive discovery node matrix. Select compatible partners below to chart molecular synthesis.
              </p>

              <div className="p-5 border border-[#00FFB3]/30 bg-[#00FFB3]/5 rounded-sm">
                <span className="text-[10px] tracking-widest text-[#00FFB3] uppercase font-bold font-mono mb-3 block">Common Reaction Partners</span>
                <div className="flex flex-wrap gap-2">
                  {(selectedElement.relationshipNetwork?.commonReactionPartners || reactIntel.compatibleElements || ['O', 'H', 'C', 'N']).map((partner: string, idx: number) => {
                    const cleanSymbol = partner.replace(/[0-9]/g, '').trim();
                    const linkedEl = ELEMENTS_DATA.find(e => e.symbol === cleanSymbol);
                    return (
                      <button
                        key={idx}
                        onClick={() => linkedEl && onSelectElement(linkedEl)}
                        className={`px-4 py-2 text-sm bg-black/40 border border-[#00FFB3]/40 hover:bg-[#00FFB3]/20 hover:border-[#00FFB3] rounded-sm font-bold text-white transition-all shadow-sm ${linkedEl ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,255,179,0.2)]' : 'cursor-default opacity-50'}`}
                      >
                        {partner}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-5 border border-white/10 bg-black/40 rounded-sm">
                <span className="text-[10px] tracking-widest text-white/50 uppercase font-bold font-mono mb-3 block">Major Synthesis Compounds</span>
                <div className="flex flex-wrap gap-2">
                  {(selectedElement.relationshipNetwork?.commonCompounds || reactIntel.commonCompounds || []).map((comp: string, idx: number) => (
                    <div key={idx} className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-sm text-sm font-bold tracking-widest font-mono text-white">
                      {comp}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 border border-red-500/30 bg-red-950/20 rounded-sm">
                <span className="text-[10px] tracking-widest text-red-400 uppercase font-bold font-mono mb-3 block">Dangerous Reactions</span>
                <ul className="space-y-2">
                  {(reactIntel.dangerousReactions || ['Vigorously reacts when exposed to extreme thermal oxidation.']).map((danger: string, idx: number) => (
                    <li key={idx} className="text-sm font-light text-red-200 flex gap-2 items-start">
                      <ShieldAlert className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      {danger}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* LAYER 10: ORBITIUM PERSONALITY */}
          {activeLayer === 10 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: catColor + '40' }}>
                <Anchor className="w-6 h-6" style={{ color: catColor }} />
                <h2 className="text-xl font-black tracking-widest uppercase" style={{ color: catColor }}>
                  Orbitium Personality
                </h2>
              </div>

              <div className="p-8 border rounded-sm relative overflow-hidden" style={{ borderColor: catColor + '50', backgroundColor: catColor + '0A' }}>
                <div className="absolute top-0 right-0 w-64 h-64 opacity-20" style={{ background: `radial-gradient(circle, ${catColor} 0%, transparent 70%)` }} />
                <span className="text-[10px] block font-black uppercase font-mono tracking-widest mb-2" style={{ color: catColor }}>ARCHETYPE SIGNATURE</span>
                <div className="text-3xl font-black text-white uppercase tracking-wider mb-4 drop-shadow-md">
                  {personality.archetype || 'Quantum Harmonic Resonator'}
                </div>
                <p className="text-lg text-white/90 leading-relaxed font-light italic relative z-10">
                  "{personality.scientificPersonality || 'A highly stable state with resonant electron frequency loops, commanding structural integrity.'}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono">
                <div className="p-4 border border-white/10 bg-black/40 rounded-sm flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Kinematic Style</span>
                  <span className="text-sm font-bold text-white uppercase">{personality.motionStyle || personality.interactionStyle || 'Fluid Dynamic'}</span>
                </div>
                <div className="p-4 border border-white/10 bg-black/40 rounded-sm flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Energy Frequency</span>
                  <span className="text-sm font-bold text-[#00E5FF] uppercase">{personality.energySignature || '13.4 kHz'}</span>
                </div>
                <div className="p-4 border border-white/10 bg-black/40 rounded-sm flex flex-col gap-2 col-span-2 text-center">
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Atmospheric Resonance</span>
                  <span className="text-base font-bold text-[#00FFB3] uppercase">{personality.visualConfig?.environmentFeel || personality.atmosphereType || 'Deep Scientific Void'}</span>
                </div>
              </div>

              {/* Spectrum wave drawing */}
              <div className="h-24 border border-white/10 bg-black/60 rounded-sm flex items-center justify-center overflow-hidden relative shadow-inner mt-2">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(90deg, transparent 95%, rgba(255,255,255,0.2) 100%)', backgroundSize: '20px 100%' }} />
                <svg className="w-full h-16 relative z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path 
                    d="M 0 10 Q 15 2, 30 10 T 60 10 T 90 10 T 100 10 M 0 10 Q 15 18, 30 10 T 60 10 T 90 10 T 100 10" 
                    fill="none" 
                    stroke={catColor} 
                    strokeWidth="0.5"
                    className="opacity-50"
                  />
                  <path 
                    d="M 0 10 Q 10 -5, 25 10 T 50 10 T 75 10 T 100 10" 
                    fill="none" 
                    stroke={catColor} 
                    strokeWidth="1.5"
                    className="animate-pulse drop-shadow-[0_0_10px_currentColor]"
                  />
                </svg>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* FOOTER CONTROLS */}
      <div className="sticky bottom-0 left-0 right-0 mt-8 pt-4 border-t border-white/10 bg-[#0A0F1D]/90 backdrop-blur-md flex justify-between items-center z-20">
        {activeLayer !== 1 ? (
          <button
            onClick={() => {
              const order = [1, 2, 3, 4, 6, 7, 8, 5, 9, 10];
              const currentIndex = order.indexOf(activeLayer);
              if (currentIndex > 0) {
                setActiveLayer(order[currentIndex - 1]);
              }
            }}
            className="px-4 py-2 flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-white/50 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> PREV
          </button>
        ) : <div className="w-24" />}

        <div className="flex gap-1">
          {[1, 2, 3, 4, 6, 7, 8, 5, 9, 10].map(L => (
            <div key={L} className={`w-1.5 h-1.5 rounded-full ${activeLayer === L ? 'bg-white shadow-[0_0_5px_white]' : 'bg-white/20'}`} />
          ))}
        </div>

        {activeLayer !== 10 ? (
          <button
            onClick={() => {
              const order = [1, 2, 3, 4, 6, 7, 8, 5, 9, 10];
              const currentIndex = order.indexOf(activeLayer);
              if (currentIndex < order.length - 1) {
                setActiveLayer(order[currentIndex + 1]);
              }
            }}
            className="px-4 py-2 flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#00FFB3] hover:text-[#00FFB3]/80 transition-colors"
          >
            NEXT <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => onSelectElement(null)}
            className="px-4 py-2 flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-red-400 hover:text-red-300 transition-colors"
          >
            DISCONNECT <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
