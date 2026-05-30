import React from 'react';
import { Atom, Globe, Activity, ChevronLeft, ChevronRight, X } from 'lucide-react';

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
    <div className="flex-1 flex flex-col justify-between h-full select-none text-[10px] leading-relaxed">
      
      {activeLayer === 1 && (
        <div className="animate-fade-in flex flex-col gap-3 font-sans">
          {/* Storytelling custom narrative for H, C, U and default for others */}
          <div className="p-3 bg-gradient-to-r from-white/[0.02] to-transparent border-l border-white/20 rounded-r text-[9.5px] leading-relaxed">
            <span className="font-mono text-[7px] font-extrabold uppercase tracking-widest text-[#00E5FF] block mb-1">
              🌌 SCIENTIFIC STORYTELLING //
            </span>
            {selectedElement.symbol === 'H' ? (
              <p className="text-[#EAF2FF]/85 text-justify leading-relaxed">
                <strong className="text-white">A primordial pioneer</strong>, forged in the explosive furnace of the Big Bang. Hydrogen is the ancient fuel of stars, breathing light into the universe through stellar <strong className="text-[#00E5FF]">thermonuclear fusion</strong>, and weaving the pristine structural lattices that seed organic life.
              </p>
            ) : selectedElement.symbol === 'C' ? (
              <p className="text-[#EAF2FF]/85 text-justify leading-relaxed">
                <strong className="text-white">The organic architect</strong> of existence. Carbon forms perfect covalent frameworks, weaving the strands of DNA, and powering <strong className="text-[#00FFB3]">terrestrial biospheres</strong> and modern technological industries.
              </p>
            ) : selectedElement.symbol === 'U' ? (
              <p className="text-[#EAF2FF]/85 text-justify leading-relaxed">
                <strong className="text-white">The nuclear titan</strong>. Packed with an ultra-dense unstable nucleus, Uranium fuels deep planetary geodynamic heat and powers human civilization in <strong className="text-red-400">high-yield modern containment cores</strong>.
              </p>
            ) : (
              <p className="text-[#EAF2FF]/80 text-justify leading-relaxed font-light">
                This element represents a crucial block of the cosmos' chemical architecture. Classified as an active <strong className="capitalize text-white font-bold">{selectedElement.category.replace('-', ' ')}</strong>, it plays a vital role across planetary and inter-stellar environments.
              </p>
            )}
          </div>

          <p className="text-[11px] leading-relaxed text-[#EAF2FF]/80 text-justify font-light">
            {selectedElement.summary}
          </p>

          <div className="p-3 bg-white/[0.03] border border-white/5 rounded-sm font-mono text-[9px] grid grid-cols-2 gap-2">
            <div>• Symbol: <span className="text-white font-black">{selectedElement.symbol}</span></div>
            <div>• Mass: <span className="text-white font-black">{selectedElement.mass.toFixed(4)} u</span></div>
            <div>• Period: <span className="text-white font-bold">{selectedElement.period}</span></div>
            <div>• Group: <span className="text-white font-bold">{selectedElement.group}</span></div>
            <div>• Block: <span className="text-[#00FFB3] font-bold uppercase">{core.block || 'S'}</span></div>
            <div>• STP State: <span className="text-[#00E5FF] font-black uppercase text-[8.5px]">{selectedElement.state}</span></div>
          </div>

          <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-sm">
            <span className="font-mono text-[7px] uppercase tracking-widest text-[#00E5FF] block mb-0.5 font-bold">NAME ETYMOLOGY & ORIGIN:</span>
            <span className="text-[9.5px] text-[#EAF2FF]/80 leading-relaxed block italic">
              "{selectedElement.nameOrigin}"
            </span>
          </div>
        </div>
      )}

      {activeLayer === 2 && (
        <div className="animate-fade-in flex flex-col gap-3 font-mono text-[9px]">
          {/* Nucleon counters */}
          <div className="grid grid-cols-3 gap-1 rounded-sm font-bold">
            <div className="p-1.5 bg-red-500/10 border border-red-500/20 text-center rounded-sm">
              <span className="block text-[6.5px] text-red-400">PROTONS (+)</span>
              <span className="text-[10px] font-black text-red-200">{selectedElement.protons}</span>
            </div>
            <div className="p-1.5 bg-blue-500/10 border border-blue-500/20 text-center rounded-sm">
              <span className="block text-[6.5px] text-blue-400">NEUTRONS (0)</span>
              <span className="text-[10px] font-black text-blue-200">{selectedElement.neutrons}</span>
            </div>
            <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 text-center rounded-sm">
              <span className="block text-[6.5px] text-emerald-400">ELECTRONS (-)</span>
              <span className="text-[10px] font-black text-emerald-200">{selectedElement.electrons}</span>
            </div>
          </div>

          {/* Volumetric filling path */}
          <div className="p-2.5 bg-white/[0.03] border border-white/5 rounded-sm">
            <span className="font-mono text-[7px] uppercase tracking-widest text-[#00E5FF] block mb-0.5 font-bold">VALENCE ORBITAL DIAGRAM:</span>
            <p className="text-[9.5px] text-white font-bold font-mono">
              {selectedElement.orbitalBreakdown}
            </p>
          </div>

          {/* Interactive click shell */}
          <div className="p-2.5 bg-white/[0.03] border border-white/5 rounded-sm flex flex-col gap-2">
            <div className="text-[8.5px] font-mono uppercase tracking-widest text-[#00FFB3] flex items-center justify-between">
              <span className="flex items-center gap-1 font-bold">
                <Atom className="w-3.5 h-3.5 text-[#00FFB3] animate-spin-slow" /> SCHRÖDINGER ENERGY SHELLS
              </span>
            </div>
            <div className="flex gap-0.5 items-center font-mono font-bold">
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
                      // Emit event to update 3D density cloud highlights
                      window.dispatchEvent(new CustomEvent('shell-probe', {
                        detail: { index: idx }
                      }));
                    }}
                    className={`flex-1 p-1 rounded flex flex-col items-center border transition-all duration-300 cursor-pointer focus:outline-none ${
                      isHighlighted 
                        ? 'bg-[#00FFB3]/10 border-[#00FFB3]/80 shadow-[0_0_8px_rgba(0,255,179,0.25)] scale-[1.04]'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-[6px] text-white/40">N{idx+1}({shellLabel})</span>
                    <span className={`text-[9.5px] font-black ${isHighlighted ? 'text-white' : 'text-[#00FFB3]'}`}>{eCount}ᴇ</span>
                  </button>
                );
              })}
            </div>
            
            {activeShellInfo ? (
              <div className="mt-1 p-2 bg-[#00FFB3]/5 border border-[#00FFB3]/20 rounded-sm font-mono text-[8.5px] flex flex-col gap-1.5 animate-fade-in text-[#EAF2FF]/80">
                <div className="flex justify-between items-center text-[#00FFB3] border-b border-white/5 pb-1 font-bold">
                  <span className="text-[7.5px] uppercase tracking-widest">PROBE ACTIVE: {activeShellInfo.shellName} shell</span>
                  <span className="text-[8px] bg-[#00FFB3]/20 px-1 py-0.2 rounded font-black text-white">{activeShellInfo.electrons} Electrons</span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[#EAF2FF]/70 font-semibold font-sans">
                  <div>• Type: <span className="text-white font-bold">{['S-Orbital', 'S+P Orbitals', 'S+P+D Clover', 'S+P+D+F Nodes'][activeShellInfo.shellIndex] || 'Hybrid Wave'}</span></div>
                  <div>• Radius: <span className="text-white font-bold">{(activeShellInfo.radius * 0.53).toFixed(2)} Å</span></div>
                  <div>• Radial Nodes: <span className="text-white font-bold">{activeShellInfo.shellIndex}</span></div>
                  <div>• Wave Density: <span className="text-[#00FFB3] font-bold">95.4%</span></div>
                </div>
              </div>
            ) : (
              <span className="text-[8.5px] text-[#EAF2FF]/50 text-center">Config: <span className="text-[#EAF2FF]/95 font-bold">{selectedElement.electronConfig}</span></span>
            )}
          </div>

          <div className="p-2.5 bg-[#00FFB3]/5 border border-[#00FFB3]/15 rounded-sm flex items-center justify-between text-[8px] font-bold">
            <div>
              <span className="text-white/40 block">VALENCE QUANTUM STATUS:</span>
              <span className="text-[#00FFB3] font-bold">{arch.valenceElectrons || 1} Outer Valence Core</span>
            </div>
            <div>
              <span className="text-white/40 block">ATOMIC RADIUS SIZE:</span>
              <span className="text-[#00E5FF] font-bold">{arch.atomicRadiusPm || 'N/A'} pm</span>
            </div>
          </div>
        </div>
      )}

      {activeLayer === 3 && (
        <div className="animate-fade-in flex flex-col gap-2.5 font-mono text-[9px]">
          <div className="p-2.5 bg-white/[0.03] border border-white/5 rounded-sm grid grid-cols-2 gap-x-2 gap-y-1.5 font-bold">
            <div>
              <span className="block text-[6.5px] text-white/40">DENSITY:</span>
              <span className="text-[9.5px] font-bold text-white">{selectedElement.density}</span>
            </div>
            <div>
              <span className="block text-[6.5px] text-white/40">MELTING POINT:</span>
              <span className="text-[9.5px] font-bold text-white">{selectedElement.meltingPoint}</span>
            </div>
            <div>
              <span className="block text-[6.5px] text-white/40">BOILING POINT:</span>
              <span className="text-[9.5px] font-bold text-[#00E5FF]">{selectedElement.boilingPoint}</span>
            </div>
            <div>
              <span className="block text-[6.5px] text-white/40">HARDNESS (MOHS):</span>
              <span className="text-[9.5px] font-bold text-white">{phys.hardness || 'N/A'}</span>
            </div>
          </div>

          {/* Crystal structure visualizer */}
          <div className="p-2.5 bg-white/[0.03] border border-white/5 rounded-sm">
            <span className="text-[7px] text-[#00E5FF] uppercase block mb-1 tracking-widest font-extrabold">CRYSTALLINE LATTICE PROFILE</span>
            <div className="p-2 bg-black/45 border border-white/5 text-[9px] rounded text-white/80 italic font-medium leading-relaxed font-sans font-light">
              {phys.crystalStructure || 'Solid state geometric lattices.'}
            </div>
          </div>

          {/* Thermo profile */}
          <div className="p-2.5 bg-[#0B1020]/40 border border-white/5 rounded-sm flex flex-col gap-1 text-[8.5px]">
            <span className="text-[7px] uppercase tracking-wider text-[#00FFB3] block font-bold">Thermal, Electrical, and Magnetic Flux</span>
            <p className="text-white/80 text-justify font-sans font-light leading-relaxed">{selectedElement.conductivity}</p>
            <div className="mt-1 flex justify-between items-center bg-white/5 p-1 text-[8px] rounded border border-white/5 font-bold">
              <span>Thermal Cond: <strong className="text-[#00FFB3]">{phys.thermalConductivity || 'Active'}</strong></span>
              <span>Magnetism: <strong className="text-[#00E5FF]">{phys.magneticProperties || 'Passive'}</strong></span>
            </div>
          </div>
        </div>
      )}

      {activeLayer === 4 && (
        <div className="animate-fade-in flex flex-col gap-2.5 font-mono text-[9px]">
          {/* Electronegativity Gauge */}
          <div className="p-2.5 bg-white/[0.03] border border-white/5 rounded-sm flex flex-col gap-1">
            <span className="text-[7px] text-[#FFD600] uppercase tracking-wider font-extrabold font-mono">Paulings Electronegativity Index</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-white/5 rounded overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500 rounded"
                  style={{ width: `${Math.min(100, ((selectedElement.electronegativity || 0) / 4) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-black text-white">{selectedElement.electronegativity !== null ? selectedElement.electronegativity.toFixed(2) : 'N/A'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 font-mono font-bold">
            <div className="p-2 bg-white/[0.03] border border-white/5 rounded-sm">
              <span className="block text-[6px] text-white/40">ELECTRON AFFINITY:</span>
              <span className="text-[9px] font-bold text-white truncate block">{chem.electronAffinity || 'N/A'}</span>
            </div>
            <div className="p-2 bg-white/[0.03] border border-white/5 rounded-sm">
              <span className="block text-[6px] text-white/40">IONIZATION ENERGY:</span>
              <span className="text-[9px] font-bold text-[#00E5FF] truncate block">{selectedElement.ionizationEnergy}</span>
            </div>
          </div>

          <div className="p-2.5 bg-white/[0.03] border border-white/5 rounded-sm flex flex-col gap-1">
            <span className="text-[7px] text-white/40 uppercase block font-bold">Active Oxidation States</span>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {(selectedElement.oxidationStates || []).map((stateVal: number, idx: number) => (
                <span key={idx} className="text-[8.5px] font-bold px-1.5 py-0.5 bg-[#00FFB3]/10 text-[#00FFB3] rounded-sm">
                  {stateVal > 0 ? `+${stateVal}` : stateVal}
                </span>
              ))}
            </div>
          </div>

          <div className="p-2.5 bg-amber-500/5 border border-amber-500/15 text-white/80 text-justify rounded-sm leading-relaxed font-sans text-[10px] font-light">
            <strong className="text-[7px] uppercase font-mono text-[#FFD600] tracking-widest block mb-0.5 font-bold">Reactivity Profile & Bonding</strong>
            {chem.bondingCharacteristics || 'Forms covalent/electrostatic coupling bonds across active elements.'}
          </div>
        </div>
      )}

      {activeLayer === 5 && (
        <div className="animate-fade-in flex flex-col gap-2 font-mono text-[9px]">
          <span className="text-[7.5px] text-[#00E5FF] font-black uppercase block tracking-wider mb-0.5">Real-World Civilization Impact //</span>
          {[
            { title: '💻 COMPUTERS & HIGH-TECH NANOTECH', desc: ind.semiconductors || 'Semiconductor fabrication in computational units.', theme: '#00E5FF' },
            { title: '✈️ AEROSPACE & MATERIAL ENGINEERING', desc: ind.aerospace || (selectedElement.applications && selectedElement.applications.industrial) || 'Crucial alloys deployed in extreme structural limits.', theme: '#FF80AB' },
            { title: '🩺 CLINICAL MEDICINE & DIAGNOSTICS', desc: ind.medicine || (selectedElement.applications && selectedElement.applications.medical) || 'Used in clinical tracking and target biometrics.', theme: '#00FFB3' },
            { title: '🔋 REVOLUTIONARY ENERGY & STAR-DRIVES', desc: ind.batteries || (selectedElement.applications && selectedElement.applications.spaceAndEnergy) || 'Supports high-output electrical cells.', theme: '#FFD600' }
          ].map((app, idx) => (
            <div key={idx} className="p-2 bg-white/[0.02] border border-white/5 rounded-sm hover:border-[#00FFB3]/25 transition-all">
              <span className="font-extrabold text-[8px] block mb-0.5 font-bold" style={{ color: app.theme }}>{app.title}</span>
              <p className="text-white/80 leading-normal text-justify text-[8.5px] font-sans font-light">{app.desc}</p>
            </div>
          ))}
        </div>
      )}

      {activeLayer === 6 && (
        <div className="animate-fade-in flex flex-col gap-2.5 text-[9px] leading-relaxed font-mono">
          {/* Origin of Matter path */}
          <div className="p-3 bg-[#00E5FF]/5 border border-[#00E5FF]/15 rounded-sm">
            <span className="font-mono text-[7px] uppercase tracking-widest text-[#00E5FF] flex items-center gap-1 mb-1 font-extrabold">
              <Globe className="w-3.5 h-3.5" /> ORIGIN OF MATTER PATHWAY //
            </span>
            <p className="text-white/85 text-justify text-[8.5px] font-sans font-light">
              {cosmic.stellarOrigin || selectedElement.cosmicRelevance}
            </p>
          </div>

          <div className="p-2.5 bg-white/[0.03] border border-white/5 rounded-sm flex items-center justify-between text-[8px] font-bold">
            <div>
              <span className="text-white/40 block font-normal">NUCLEOSYNTHESIS PROCESS:</span>
              <span className="text-[#00FFB3] font-bold text-[9px]">{cosmic.nucleosynthesisProcess || 'Sstellar Core'}</span>
            </div>
            <div>
              <span className="text-white/40 block font-normal">PLANETARY CRUST SEED:</span>
              <span className="text-white font-bold">{cosmic.planetaryPresence || 'Tectonic trace'}</span>
            </div>
          </div>

          <div className="p-2.5 bg-white/[0.03] border border-white/5 rounded-sm grid grid-cols-2 gap-2 text-[8px] font-mono text-[#EAF2FF]/70 font-bold">
            <div>Universe Density: <strong className="text-white">{cosmic.cosmicAbundance || 'Trace'}</strong></div>
            <div>Earth Abundance: <strong className="text-white">{cosmic.earthAbundance || 'Trace'}</strong></div>
          </div>
        </div>
      )}

      {activeLayer === 7 && (
        <div className="animate-fade-in flex flex-col gap-2.5 text-[9px] leading-relaxed font-mono">
          <div className="p-3 bg-[#00FFB3]/5 border border-[#00FFB3]/15 rounded-sm">
            <span className="font-mono text-[7px] uppercase tracking-widest text-[#00FFB3] flex items-center gap-1 mb-1 font-extrabold">
              <Activity className="w-3.5 h-3.5" /> METABOLIC BIOSPHERIC footprint
            </span>
            <p className="text-white/85 text-justify text-[8.5px] font-sans font-light">
              {bio.biologicalImportance || selectedElement.biologicalRelevance}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-1.5 font-mono text-[8px] font-bold">
            <div className="p-2 bg-white/[0.03] border border-white/5 rounded-sm">
              <span className="block text-white/40 text-[6px] font-normal">HUMAN CONTENT RATIO:</span>
              <span className="text-white font-bold block mt-0.5">{bio.humanBodyPresence || '0.00%'}</span>
            </div>
            <div className="p-2 bg-white/[0.03] border border-white/5 rounded-sm">
              <span className="block text-white/40 text-[6px] font-normal">NUTRITIVE CLASSIFICATION:</span>
              <span className="text-[#00FFB3] font-bold block mt-0.5 truncate">{bio.nutritionalRelevance || 'Inert'}</span>
            </div>
          </div>

          {/* Bio-hazard warning stripes */}
          <div className="p-2.5 bg-red-950/20 border border-red-500/15 text-[8.5px] rounded-sm text-red-200 flex items-start gap-2 leading-snug">
            <span className="font-mono px-1 py-0.5 bg-red-500/20 border border-red-500/45 text-[6.5px] leading-none font-extrabold rounded">HAZARD_ALERT</span>
            <div className="flex-1">
              <strong className="block font-mono text-[7px] tracking-wide uppercase text-red-400 font-bold">Biological Toxicity Spectrum</strong>
              <p className="font-sans font-light text-[8.5px]">{bio.toxicity || 'Non-dangerous organic element.'}</p>
            </div>
          </div>
        </div>
      )}

      {activeLayer === 8 && (
        <div className="animate-fade-in flex flex-col gap-2.5 font-mono text-[9px]">
          <div className="p-3 bg-white/[0.03] border border-white/5 rounded-sm">
            <span className="text-[6.5px] text-white/40 block">HISTORY TIMELINE DATA //</span>
            <div className="flex justify-between items-center text-[9.5px] text-white font-bold border-b border-white/5 pb-1 mt-0.5">
              <span>{selectedElement.discoveredBy}</span>
              <span className="text-[#FFD600] font-black">{selectedElement.year > 0 ? selectedElement.year : 'ANCIENT'}</span>
            </div>
            <p className="text-white/80 text-justify mt-1.5 leading-normal text-[8.5px] font-sans font-light">{hist.historicalSignificance || 'Discovered during classical scientific advancements.'}</p>
          </div>

          <div className="p-2 rounded-sm border border-white/5 bg-white/[0.01] flex flex-col gap-1 text-[8.5px]">
            <span className="text-[7.5px] font-black uppercase text-[#00E5FF] font-bold">Isotope Milestones & Experiments</span>
            <div className="space-y-1 text-white/80 font-bold font-sans font-light">
              {(hist.majorScientificMilestones || ['Identified via electromagnetic spectral readings']).map((mile: string, idx: number) => (
                <div key={idx} className="flex gap-1.5 text-[8px]">
                  <span className="text-[#00FFB3] font-bold font-mono">»</span>
                  <p className="leading-snug">{mile}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeLayer === 9 && (
        <div className="animate-fade-in flex flex-col gap-2.5 font-mono text-[9px]">
          <span className="text-[7.5px] text-[#00FFB3] uppercase font-black block mb-0.5 font-bold">LIVING REACTIVE PARTNER NETWORK //</span>
          <p className="text-white/50 text-[8px] italic leading-tight">Click partner nodes to traverse elements instantly inside the 3D grid observer.</p>

          <div className="relative p-2 bg-black/40 border border-white/5 rounded-sm flex flex-col gap-2 text-[8.5px]">
            <div className="flex flex-col gap-1">
              <span className="text-[6.5px] text-white/40 uppercase font-bold">ACTIVE REACTION CLUSTERS:</span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {(selectedElement.relationshipNetwork?.commonReactionPartners || reactIntel.compatibleElements || ['O', 'H']).map((partner: string, idx: number) => {
                  const cleanSymbol = partner.replace(/[0-9]/g, '').trim();
                  const linkedEl = ELEMENTS_DATA.find(e => e.symbol === cleanSymbol);
                  return (
                    <button
                      key={idx}
                      onClick={() => linkedEl && onSelectElement(linkedEl)}
                      className={`px-1.5 py-0.5 text-[8px] bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 hover:border-[#00FFB3] rounded font-black text-white hover:bg-cyan-500/15 duration-200 transition-all ${linkedEl ? 'cursor-pointer hover:scale-105 hover:shadow-[0_0_8px_rgba(0,255,179,0.2)]' : 'cursor-default opacity-50'}`}
                    >
                      • {partner}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1 border-t border-white/5 pt-1.5 mt-0.5">
              <span className="text-[6.5px] text-white/40 uppercase font-bold">ELEMENTAL SISTER GROUPS:</span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {(selectedElement.relationshipNetwork?.similarElements || []).map((similar: string, idx: number) => {
                  const linkedEl = ELEMENTS_DATA.find(e => e.symbol === similar);
                  return (
                    <button
                      key={idx}
                      onClick={() => linkedEl && onSelectElement(linkedEl)}
                      className={`px-1.5 py-0.5 text-[8px] bg-white/5 border border-white/10 hover:border-[#00E5FF] rounded font-semibold text-white/85 hover:bg-white/10 duration-200 transition-all ${linkedEl ? 'cursor-pointer hover:scale-105' : 'cursor-default opacity-50'}`}
                    >
                      {similar}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1 border-t border-white/5 pt-1.5 mt-0.5">
              <span className="text-[6.5px] text-white/40 uppercase font-bold">SYNTHESIS COMPOUNDS:</span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {(selectedElement.relationshipNetwork?.commonCompounds || []).map((comp: string, idx: number) => (
                  <span key={idx} className="px-1 py-0.5 bg-neutral-900 border border-white/5 rounded text-white font-bold uppercase tracking-wider text-[7.5px]">
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-2 bg-red-950/20 border border-red-500/15 text-red-300 text-[8.5px] rounded-sm leading-snug">
            <span className="block font-black text-[7px] text-red-400 mb-0.5 uppercase">UNSAFE REACTION ALERT:</span>
            <p className="font-sans font-light text-[8.5px]">{(reactIntel.dangerousReactions || [])[0] || 'Uncontrolled exothermic reactions if bonded incorrectly.'}</p>
          </div>
        </div>
      )}

      {activeLayer === 10 && (
        <div className="animate-fade-in flex flex-col gap-2.5 font-mono text-[9px]">
          <div className="p-3 bg-gradient-to-r from-[#7C4DFF]/15 to-transparent border-l border-[#7C4DFF] rounded-r font-sans">
            <span className="text-[7px] text-[#7C4DFF] block font-black uppercase font-mono">ENERGY FREQUENCY SIGNATURE:</span>
            <div className="text-[12px] font-black text-white uppercase tracking-wider mt-0.5">
              {personality.archetype || 'Quantum Harmonic Resonator'}
            </div>
            <p className="text-white/80 text-justify leading-relaxed text-[9.5px] mt-1 font-light italic">
              "{personality.scientificPersonality || 'A highly stable state with resonant electron frequency loops.'}"
            </p>
          </div>

          <div className="p-2 bg-white/[0.03] border border-white/5 rounded-sm flex flex-col gap-1 text-[8px] font-bold">
            <div>• Atmosphere: <span className="text-white font-bold">{personality.visualConfig?.environmentFeel || 'Scientific Observatory'}</span></div>
            <div>• Wave Resonance: <span className="text-[#00FFB3] font-black text-[8.5px]">{personality.visualConfig?.motionStyle || 'Staggered wave'}</span></div>
            <div>• Emission Lighting: <span className="text-white/70">{personality.visualConfig?.lightingStyle || 'Neon ambient glow'}</span></div>
            <div>• Core Velocity Signature: <span className="text-[#00E5FF] font-bold">{personality.energySignature || '13.4 kHz'}</span></div>
          </div>

          {/* Spectrum wave drawing */}
          <div className="h-10 border border-white/5 bg-black/40 rounded-sm flex items-center justify-center overflow-hidden relative shadow-inner">
            <svg className="w-full h-8" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path 
                d="M 0 10 Q 15 2, 30 10 T 60 10 T 90 10 T 100 10" 
                fill="none" 
                stroke={catColor} 
                strokeWidth="1.2"
                className="animate-pulse"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Previous / Next Layer stepper controls */}
      <div className="flex justify-between items-center border-t border-white/5 pt-2.5 mt-3 select-none text-[8.5px] font-mono text-[#EAF2FF]/50 font-bold">
        {activeLayer > 1 ? (
          <button
            onClick={() => setActiveLayer(activeLayer - 1)}
            className="text-white/45 hover:text-[#00FFB3] transition-colors cursor-pointer"
          >
            ◀ DEPTH 0{activeLayer - 1}
          </button>
        ) : <div className="invisible" />}

        <span className="text-white/20 uppercase text-[6.5px] tracking-widest font-black font-mono">OBS_MATRIX.STREAM</span>

        {activeLayer < 10 ? (
          <button
            onClick={() => setActiveLayer(activeLayer + 1)}
            className="text-white/45 hover:text-[#00FFB3] transition-colors cursor-pointer"
          >
            DEPTH 0{activeLayer + 1} ▶
          </button>
        ) : (
          <button
            onClick={() => onSelectElement(null)}
            className="text-red-400 hover:text-red-500 font-extrabold uppercase transition-colors cursor-pointer text-[8px]"
          >
            DISCONNECT CORE ✖
          </button>
        )}
      </div>

    </div>
  );
};
