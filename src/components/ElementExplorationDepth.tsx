import React from 'react';
import { 
  Atom, Globe, Activity, ChevronLeft, ChevronRight, X, 
  Hexagon, Zap, Thermometer, ShieldAlert, BookOpen, 
  Rocket, Lightbulb, Dna, Anchor, Microscope, Satellite,
  Network, Flame, Sparkles, Droplet
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

export const ElementExplorationDepth: React.FC<ElementExplorationDepthProps> = React.memo(({
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
  const phys = selectedElement.physicalProperties || {};
  const chem = selectedElement.chemicalProperties || {};
  const cosmic = selectedElement.cosmicProperties || {};
  const bio = selectedElement.biologicalProperties || {};
  const hist = selectedElement.historicalProperties || {};
  const ind = selectedElement.industrialApplications || {};
  const reactIntel = selectedElement.reactionIntelligence || {};

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

          {/* PROPERTIES COMPOSITE VIEW (LAYER 3) */}
          {activeLayer === 3 && (
            <div className="flex flex-col gap-8 pb-4">
              {/* Architecture Section */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 border-b border-white/20 pb-2">
                  <Atom className="w-5 h-5 text-[#00E5FF]" />
                  <h3 className="text-sm font-black tracking-widest text-[#00E5FF] uppercase">ATOMIC ARCHITECTURE</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-sm text-center">
                    <span className="block text-[9px] text-[#00E5FF] mb-1 font-bold">ELECTRONS</span>
                    <span className="text-xl font-black text-white">{selectedElement.electrons}</span>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-sm text-center">
                    <span className="block text-[9px] text-[#FF9100] mb-1 font-bold">PROTONS</span>
                    <span className="text-xl font-black text-white">{selectedElement.protons}</span>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-sm text-center">
                    <span className="block text-[9px] text-[#7C4DFF] mb-1 font-bold">NEUTRONS</span>
                    <span className="text-xl font-black text-white">{selectedElement.neutrons}</span>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-sm text-center flex flex-col justify-center">
                    <span className="block text-[9px] text-white/50 mb-1 font-bold leading-none">CONFIG</span>
                    <span className="text-[10px] font-black text-[#00FFB3] truncate">{selectedElement.electronConfig}</span>
                  </div>
                </div>

                <div className="p-4 border border-white/10 bg-black/40 rounded-sm">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#00FFB3] flex items-center gap-2 mb-3 font-bold block">
                    <Atom className="w-3.5 h-3.5 text-[#00FFB3] animate-spin-slow" /> ENERGY SHELLS (CLICK TO PROBE)
                  </span>
                  <div className="grid grid-cols-7 gap-1">
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
                          className={`p-1.5 rounded-sm flex flex-col items-center border transition-all duration-300 cursor-pointer ${
                            isHighlighted 
                              ? 'bg-[#00FFB3]/20 border-[#00FFB3] shadow-[0_0_15px_rgba(0,255,179,0.3)] scale-105'
                              : 'bg-white/5 border-white/10 hover:border-white/30'
                          }`}
                        >
                          <span className="text-[8px] text-white/50 font-bold mb-0.5">{shellLabel}</span>
                          <span className={`text-xs font-black ${isHighlighted ? 'text-white' : 'text-[#00FFB3]'}`}>{eCount}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Physical Section */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 border-b border-white/20 pb-2">
                  <Thermometer className="w-5 h-5 text-red-400" />
                  <h3 className="text-sm font-black tracking-widest text-red-400 uppercase">PHYSICAL METRICS</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-sm">
                    <div className="text-[9px] font-mono text-red-300 tracking-wider mb-1 font-bold">STATE AT STP</div>
                    <div className="text-sm font-black text-white uppercase">{selectedElement.state}</div>
                  </div>
                  <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-sm">
                    <div className="text-[9px] font-mono text-red-300 tracking-wider mb-1 font-bold">DENSITY (g/cm³)</div>
                    <div className="text-sm font-black text-white uppercase">{selectedElement.density || 'UNKNOWN'}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1 p-3 bg-amber-500/5 border border-amber-500/20 rounded-sm relative">
                    <div className="absolute top-2 right-2 text-amber-500/30"><Flame size={16} /></div>
                    <div className="text-[9px] font-mono text-amber-300 tracking-wider mb-1 font-bold">MELTING POINT</div>
                    <div className="text-sm font-black text-white uppercase">{selectedElement.meltingPoint !== null ? `${selectedElement.meltingPoint} K` : 'UNKNOWN'}</div>
                  </div>
                  <div className="flex-1 p-3 bg-orange-500/5 border border-orange-500/20 rounded-sm relative">
                    <div className="absolute top-2 right-2 text-orange-500/30"><Thermometer size={16} /></div>
                    <div className="text-[9px] font-mono text-orange-300 tracking-wider mb-1 font-bold">BOILING POINT</div>
                    <div className="text-sm font-black text-white uppercase">{selectedElement.boilingPoint !== null ? `${selectedElement.boilingPoint} K` : 'UNKNOWN'}</div>
                  </div>
                </div>
              </div>

              {/* Chemical Section */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 border-b border-white/20 pb-2">
                  <Zap className="w-5 h-5 text-[#FFD600]" />
                  <h3 className="text-sm font-black tracking-widest text-[#FFD600] uppercase">CHEMICAL PROFILE</h3>
                </div>

                <div className="p-4 border border-white/10 bg-black/40 rounded-sm flex flex-col gap-3">
                  <span className="text-[10px] text-[#FFD600] uppercase tracking-widest font-extrabold font-mono flex items-center justify-between">
                    <span>ELECTRONEGATIVITY (PAULING)</span>
                    <span className="text-lg text-white font-black">{selectedElement.electronegativity !== null ? selectedElement.electronegativity.toFixed(2) : 'N/A'}</span>
                  </span>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 rounded-full"
                      style={{ width: `${Math.min(100, ((selectedElement.electronegativity || 0) / 4) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-3 border border-white/10 bg-white/5 rounded-sm flex flex-col gap-1 text-center">
                    <span className="text-[8px] text-white/40 font-bold uppercase tracking-widest">ELECTRON AFFINITY</span>
                    <span className="text-sm font-black text-white mt-1">{chem.electronAffinity || 'N/A'}</span>
                  </div>
                  <div className="p-3 border border-white/10 bg-white/5 rounded-sm flex flex-col gap-1 text-center">
                    <span className="text-[8px] text-white/40 font-bold uppercase tracking-widest">IONIZATION ENERGY</span>
                    <span className="text-sm font-black text-[#00E5FF] mt-1">{selectedElement.ionizationEnergy || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REACTIVITY LAYER (LAYER 9) */}
          {activeLayer === 9 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: catColor + '40' }}>
                <Flame className="w-6 h-6" style={{ color: catColor }} />
                <h2 className="text-xl font-black tracking-widest uppercase" style={{ color: catColor }}>
                  Reactivity Profile
                </h2>
              </div>
              
              <div className="p-5 border border-amber-500/30 bg-amber-500/10 rounded-sm">
                 <strong className="text-[10px] uppercase font-mono text-[#FFD600] tracking-widest block mb-2 font-bold">Bonding Characteristics</strong>
                 <p className="text-sm text-white/90 leading-relaxed font-light">
                   {chem.bondingCharacteristics || chem.reactivityProfile || selectedElement.reactivity || 'Forms bonds based on available valence electrons.'}
                 </p>
              </div>

              <div className="p-5 border border-[#00FFB3]/30 bg-[#00FFB3]/5 rounded-sm">
                <span className="text-[10px] tracking-widest text-[#00FFB3] uppercase font-bold font-mono mb-3 block">Common Synthesis Partners</span>
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

          {/* LAYER 5: INDUSTRIAL APPLICATIONS */}
          {activeLayer === 5 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: catColor + '40' }}>
                <Network className="w-6 h-6" style={{ color: catColor }} />
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

          {/* DEEP DIVE COMPOSITE VIEW (LAYER 11) */}
          {activeLayer === 11 && (
            <div className="flex flex-col gap-8 pb-4">
              <div className="flex items-center gap-3 border-b pb-2" style={{ borderColor: catColor + '40' }}>
                <Globe className="w-5 h-5 text-white" />
                <h3 className="text-sm font-black tracking-widest text-white uppercase">DEEP DIVE</h3>
              </div>

              {/* Cosmic Origin */}
              <div className="bg-[#050812] border border-[#7C4DFF]/30 p-4 rounded-sm shadow-[0_0_20px_rgba(124,77,255,0.1)] relative overflow-hidden">
                <Rocket className="absolute top-2 right-2 w-16 h-16 text-[#7C4DFF]/10" />
                <h4 className="text-[10px] font-mono tracking-widest text-[#7C4DFF] font-bold mb-3">COSMIC ORIGIN</h4>
                <p className="text-sm text-[#EAF2FF]/80 leading-relaxed italic">{cosmic.nucleosynthesisPath || cosmic.stellarOrigin || 'Stellar nucleosynthesis.'}</p>
                <div className="mt-4 pt-3 border-t border-[#7C4DFF]/20 flex justify-between tracking-wider font-mono">
                  <span className="text-[9px] text-[#7C4DFF]">UNIVERSE ABUNDANCE:</span>
                  <span className="text-[9px] font-black text-white">{cosmic.universeAbundance || cosmic.cosmicAbundance || 'N/A'}</span>
                </div>
              </div>
              
              {/* Biological */}
              <div className="bg-[#050812] border border-green-500/30 p-4 rounded-sm shadow-[0_0_20px_rgba(34,197,94,0.1)] relative overflow-hidden">
                <Dna className="absolute top-2 right-2 w-16 h-16 text-green-500/10" />
                <h4 className="text-[10px] font-mono tracking-widest text-green-400 font-bold mb-3">BIOLOGICAL ROLE</h4>
                <p className="text-sm text-[#EAF2FF]/80 leading-relaxed italic">{bio.humanRole || bio.biologicalImportance || 'Not naturally occurring in biological life.'}</p>
              </div>

              {/* Historical */}
              <div className="bg-[#050812] border border-amber-500/30 p-4 rounded-sm shadow-[0_0_20px_rgba(245,158,11,0.1)] relative overflow-hidden">
                <BookOpen className="absolute top-2 right-2 w-16 h-16 text-amber-500/10" />
                <h4 className="text-[10px] font-mono tracking-widest text-amber-400 font-bold mb-3">DISCOVERY</h4>
                <div className="flex gap-4 mb-2">
                  <div className="flex-1 border-r border-amber-500/20">
                    <span className="text-[8px] tracking-widest text-amber-500/50 block">YEAR</span>
                    <span className="text-base font-black text-white">{selectedElement.year > 0 ? selectedElement.year : 'ANCIENT'}</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-[8px] tracking-widest text-amber-500/50 block">DISCOVERER</span>
                    <span className="text-sm font-bold text-amber-100">{selectedElement.discoverer || 'Unknown'}</span>
                  </div>
                </div>
                <p className="text-xs text-[#EAF2FF]/60 mt-3 pt-3 border-t border-amber-500/10">{hist.historicalContext || selectedElement.summary}</p>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
});
