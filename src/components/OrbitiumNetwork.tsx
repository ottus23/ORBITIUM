import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, Globe, Orbit, Database, ChevronRight, Hexagon, Zap, Cpu, Satellite, Beaker, GitMerge, Dna, Rocket, Sparkles, Building2, Target } from 'lucide-react';
import { ELEMENTS_DATA } from '../data';
import { ChemicalElement } from '../types';

interface OrbitiumNetworkProps {
  onSelectElement: (element: ChemicalElement) => void;
  onNavigateHome: () => void;
}

const NETWORK_TABS = [
  { id: 'blocks', label: 'THE BLOCK ECOSYSTEM', desc: 'Dependencies Of The Four Realms', icon: Hexagon, color: '#FF3366' },
  { id: 'pathways', label: 'PATHWAYS OF MATTER', desc: 'Atomic To Planetary Chains', icon: GitMerge, color: '#FF9100' },
  { id: 'biology', label: 'THE BIOLOGY NETWORK', desc: 'Atomic Roots Of Life', icon: Dna, color: '#00FFB3' },
  { id: 'civilization', label: 'CIVILIZATION NETWORK', desc: 'Silicon & Steel Matrix', icon: Building2, color: '#00E5FF' },
  { id: 'cosmic', label: 'THE COSMIC NETWORK', desc: 'Stellar Nucleosynthesis Origins', icon: Satellite, color: '#7C4DFF' },
];

const BLOCK_ECOSYSTEM = [
  { id: 'S-BLOCK', subtitle: 'SOURCE OF REACTIVITY', provides: ['Electron Donors', 'Energy Transfers', 'Fundamental Chemical Behavior'], color: '#FF3366', pos: { x: 50, y: 50 } },
  { id: 'P-BLOCK', subtitle: 'SOURCE OF COMPLEXITY', provides: ['Life Chemistry', 'Atmospheres', 'Semiconductors', 'Molecular Diversity'], color: '#00E5FF', pos: { x: 250, y: 150 } },
  { id: 'D-BLOCK', subtitle: 'SOURCE OF MATERIALS', provides: ['Structural Strength', 'Industrial Chemistry', 'Catalysis', 'Engineering Systems'], color: '#FF9100', pos: { x: 50, y: 250 } },
  { id: 'F-BLOCK', subtitle: 'SOURCE OF ADVANCED TECH', provides: ['Rare Earths', 'Nuclear Energy', 'Advanced Magnetics', 'Future Technologies'], color: '#7C4DFF', pos: { x: 250, y: 350 } }
];

const PATHWAYS = [
  {
    theme: '#00E5FF',
    nodes: [
      { id: 'HYDROGEN', type: 'element', x: 0 },
      { id: 'WATER', type: 'compound', x: 1 },
      { id: 'OCEANS', type: 'system', x: 2 },
      { id: 'CLIMATE', type: 'system', x: 3 },
      { id: 'LIFE', type: 'system', x: 4 }
    ]
  },
  {
    theme: '#00FFB3',
    nodes: [
      { id: 'CARBON', type: 'element', x: 0 },
      { id: 'ORGANIC MOLECULES', type: 'molecule', x: 1 },
      { id: 'DNA', type: 'molecule', x: 2 },
      { id: 'BIOLOGY', type: 'system', x: 3 },
      { id: 'ECOSYSTEMS', type: 'system', x: 4 }
    ]
  },
  {
    theme: '#FF9100',
    nodes: [
      { id: 'IRON', type: 'element', x: 0 },
      { id: 'STEEL', type: 'material', x: 1 },
      { id: 'INFRASTRUCTURE', type: 'system', x: 2 },
      { id: 'CITIES', type: 'system', x: 3 },
      { id: 'CIVILIZATION', type: 'system', x: 4 }
    ]
  },
  {
    theme: '#FF80AB',
    nodes: [
      { id: 'SILICON', type: 'element', x: 0 },
      { id: 'SEMICONDUCTORS', type: 'material', x: 1 },
      { id: 'MICROCHIPS', type: 'technology', x: 2 },
      { id: 'COMPUTERS', type: 'technology', x: 3 },
      { id: 'DIGITAL AGE', type: 'civilization', x: 4 }
    ]
  },
  {
    theme: '#7C4DFF',
    nodes: [
      { id: 'NEODYMIUM', type: 'element', x: 0 },
      { id: 'HIGH-STRENGTH MAGNETS', type: 'material', x: 1 },
      { id: 'ELECTRIC MOTORS', type: 'technology', x: 2 },
      { id: 'RENEWABLE ENERGY', type: 'system', x: 3 },
      { id: 'MODERN INDUSTRY', type: 'system', x: 4 }
    ]
  }
];

const BIO_NETWORK = [
  { symbol: 'C', name: 'CARBON', next: 'MACROMOLECULES', icon: Hexagon },
  { symbol: 'O', name: 'OXYGEN', next: 'RESPIRATION', icon: Globe },
  { symbol: 'N', name: 'NITROGEN', next: 'AMINO ACIDS', icon: Dna },
  { symbol: 'P', name: 'PHOSPHORUS', next: 'ATP ENERGY', icon: Zap },
  { symbol: 'S', name: 'SULFUR', next: 'PROTEIN FOLDING', icon: GitMerge },
  { symbol: 'Ca', name: 'CALCIUM', next: 'SKELETAL SYSTEMS', icon: Building2 },
  { symbol: 'Fe', name: 'IRON', next: 'HEMOGLOBIN', icon: Target },
];

const COSMIC_PIPELINE = [
  { id: 'BIG BANG', type: 'origin', desc: 'The initial singularity' },
  { id: 'STARS', type: 'origin', desc: 'Thermonuclear foundries' },
  { id: 'NUCLEOSYNTHESIS', type: 'process', desc: 'Fusing light nuclei' },
  { id: 'ELEMENT FORMATION', type: 'process', desc: 'Heavy element creation' },
  { id: 'PLANET FORMATION', type: 'system', desc: 'Accretion of matter' },
  { id: 'CHEMISTRY', type: 'system', desc: 'Molecular collisions' },
  { id: 'LIFE', type: 'system', desc: 'Biological emergence' },
  { id: 'INTELLIGENCE', type: 'system', desc: 'Sentient observers' },
  { id: 'TECHNOLOGY', type: 'system', desc: 'Manipulation of atoms' },
];

export const OrbitiumNetwork = React.memo(function OrbitiumNetwork({ onSelectElement, onNavigateHome }: OrbitiumNetworkProps) {
  const [activeTab, setActiveTab] = useState<string>('blocks');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const getElementData = (symbolOrName: string) => {
    return ELEMENTS_DATA.find(e => e.symbol.toUpperCase() === symbolOrName.toUpperCase() || e.name.toUpperCase() === symbolOrName.toUpperCase());
  };

  const currentTabColor = NETWORK_TABS.find(t => t.id === activeTab)?.color || '#00E5FF';

  return (
    <div className="absolute inset-0 z-10 bg-[#050812] overflow-hidden text-[#EAF2FF] select-none font-sans flex flex-col pt-24">
      {/* Dynamic Background Noise */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tab-color)_0%,_transparent_60%)] opacity-30 blur-3xl animate-pulse" style={{ '--tab-color': currentTabColor } as any} />
        <svg className="w-full h-full opacity-10" style={{ stroke: currentTabColor }}>
           <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
             <path d="M 40 0 L 0 0 0 40" fill="none" strokeWidth="0.5"/>
           </pattern>
           <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* HEADER NAV / TITLE - Pushed down to exist in Zone 2 safely */}
      <div className="relative z-10 flex flex-col items-start px-6 md:px-8 mb-6">
        <h1 className="text-2xl md:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
          THE ORBITIUM NETWORK
        </h1>
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/40 mt-1">LIVING ECOSYSTEM OF MATTER</p>
      </div>

      {/* TABS */}
      <div className="relative z-20 flex px-6 md:px-8 gap-2 overflow-x-auto scrollbar-none pb-4">
        {NETWORK_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-start gap-2 p-4 min-w-[200px] border shrink-0 transition-all cursor-pointer backdrop-blur-md rounded-sm ${
                isActive 
                  ? 'bg-white/10 border-white/30 shadow-lg' 
                  : 'bg-black/40 border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-center gap-2" style={{ color: isActive ? tab.color : '#666' }}>
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-mono font-black tracking-widest uppercase">{tab.label}</span>
              </div>
              <span className={`text-xs font-light ${isActive ? 'text-white' : 'text-white/40'}`}>{tab.desc}</span>
            </button>
          );
        })}
      </div>

      {/* CONTENT CANVAS */}
      <div className="flex-1 relative z-10 overflow-auto scrollbar-none" ref={containerRef}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full min-h-[600px] p-6 md:p-8 flex items-center justify-center relative"
          >
            
            {/* VIEW: BLOCKS ECOSYSTEM */}
            {activeTab === 'blocks' && (
              <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-6xl">
                {BLOCK_ECOSYSTEM.map((block, idx) => (
                  <div key={block.id} className="flex-1 flex flex-col gap-4 relative group w-full">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color)]/5 to-transparent blur-xl -z-10 transition-opacity opacity-0 group-hover:opacity-100" style={{ '--color': block.color } as any} />
                    <div className="p-6 border bg-black/60 backdrop-blur-xl border-white/10 group-hover:border-[var(--color)]/50 rounded-lg transition-all transform group-hover:-translate-y-2" style={{ '--color': block.color } as any}>
                      <span className="text-3xl font-black block mb-1 drop-shadow-[0_0_10px_var(--color)]" style={{ color: block.color }}>{block.id}</span>
                      <span className="text-[10px] tracking-widest font-mono uppercase text-white/50 block mb-6">{block.subtitle}</span>
                      <div className="space-y-3">
                        {block.provides.map((prov, i) => (
                          <div key={i} className="flex items-start gap-2 border-l-2 pl-3" style={{ borderLeftColor: `${block.color}50` }}>
                            <span className="text-xs text-white/80 font-light">{prov}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* VIEW: PATHWAYS OF MATTER */}
            {activeTab === 'pathways' && (
              <div className="flex flex-col gap-8 w-full max-w-6xl overflow-x-auto pb-8 scrollbar-none mt-20">
                {PATHWAYS.map((path, pIdx) => (
                  <div key={pIdx} className="w-full min-w-[800px] flex items-center justify-between relative relative border border-white/5 bg-white/[0.02] p-6 rounded-lg group hover:border-white/10 transition-colors">
                    {/* Background Connection Line */}
                    <div className="absolute top-1/2 left-10 right-10 h-[1px] -z-10" style={{ background: `linear-gradient(90deg, transparent, ${path.theme}40, transparent)` }} />
                    <div className="absolute top-1/2 left-10 right-10 h-[10px] -translate-y-1/2 -z-10 opacity-20 blur-sm" style={{ background: `linear-gradient(90deg, transparent, ${path.theme}, transparent)` }} />
                    
                    {path.nodes.map((node, nIdx) => {
                      const elData = getElementData(node.id);
                      return (
                        <div key={nIdx} className="flex flex-col items-center gap-3 relative cursor-pointer"
                             onMouseEnter={() => setHoveredNode(node.id)}
                             onMouseLeave={() => setHoveredNode(null)}
                             onClick={() => { if(elData) onSelectElement(elData); }}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full z-10 transition-all ${hoveredNode === node.id ? 'scale-150' : ''}`} style={{ backgroundColor: path.theme, boxShadow: hoveredNode === node.id ? `0 0 15px ${path.theme}` : 'none' }} />
                          <div className={`flex flex-col items-center bg-black/80 px-4 py-2 border transition-colors rounded-sm ${hoveredNode === node.id ? 'border-[var(--theme)]' : 'border-white/10'}`} style={{ '--theme': path.theme } as any}>
                            <span className="text-xs font-black uppercase text-white tracking-widest">{node.id}</span>
                            <span className="text-[8px] font-mono uppercase text-white/40 tracking-wider mt-1">{node.type}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* VIEW: BIOLOGY NETWORK */}
            {activeTab === 'biology' && (
              <div className="relative w-full h-[600px] max-w-5xl flex items-center justify-center mt-10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#00FFB310_0%,_transparent_60%)]" />
                <div className="w-48 h-48 rounded-full border-4 border-[#00FFB3]/30 flex items-center justify-center relative shadow-[0_0_50px_rgba(0,255,179,0.2)] animate-spin-slow-30">
                  <div className="absolute w-[150%] h-[150%] border border-[#00FFB3]/10 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
                  <div className="absolute w-[200%] h-[200%] border border-[#00FFB3]/5 rounded-full animate-[spin_30s_linear_infinite]" />
                </div>
                
                {/* Central Concept */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <Dna className="w-12 h-12 text-[#00FFB3] mb-2" />
                  <span className="text-lg font-black tracking-widest uppercase text-white drop-shadow-[0_0_10px_#00FFB3]">LIFE</span>
                </div>

                {/* Orbiting Elements */}
                {BIO_NETWORK.map((bio, index) => {
                  const angle = (index / BIO_NETWORK.length) * 2 * Math.PI - Math.PI / 2;
                  const radius = 250;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  const elData = getElementData(bio.symbol);
                  const Icon = bio.icon;

                  return (
                    <div 
                      key={index}
                      className="absolute flex flex-col items-center gap-2 group cursor-pointer transition-transform hover:scale-110 z-20"
                      style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
                      onClick={() => { if(elData) onSelectElement(elData); }}
                    >
                      <div className="absolute top-1/2 left-1/2 w-[1px] h-[250px] origin-top bg-gradient-to-b from-[#00FFB3]/40 to-transparent -translate-x-1/2" style={{ transform: `rotate(${angle + Math.PI/2}rad)` }} />
                      <div className="w-12 h-12 rounded-sm bg-[#0A0D1B] border border-[#00FFB3]/40 text-[#00FFB3] flex items-center justify-center font-black text-lg group-hover:bg-[#00FFB3] group-hover:text-black transition-colors relative z-10 shadow-[0_0_15px_rgba(0,255,179,0.2)]">
                        {bio.symbol}
                      </div>
                      <div className="flex flex-col items-center bg-black/60 px-3 py-1.5 rounded border border-white/10 group-hover:border-[#00FFB3]/50">
                        <span className="text-[10px] font-black tracking-widest text-white uppercase">{bio.name}</span>
                        <span className="text-[8px] tracking-wider font-mono text-[#00FFB3] uppercase mt-0.5">{bio.next}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEW: CIVILIZATION NETWORK */}
            {activeTab === 'civilization' && (
              <div className="flex flex-col md:flex-row w-full max-w-6xl gap-6 h-[80%] items-center mt-12">
                 <div className="flex-1 flex flex-col gap-6 w-full relative">
                    <div className="p-6 bg-black/40 border border-[#00E5FF]/30 rounded-lg backdrop-blur-md">
                      <h2 className="text-[#00E5FF] font-black text-xl tracking-widest uppercase mb-4 flex items-center gap-2"><Cpu className="w-5 h-5"/> SILICON COMPUTATION</h2>
                      <div className="flex items-center gap-3">
                        <span className="w-12 h-12 bg-[#00E5FF]/20 text-[#00E5FF] font-black flex justify-center items-center rounded-sm text-xl border border-[#00E5FF]/40 cursor-pointer hover:bg-[#00E5FF] hover:text-black transition" onClick={() => { const el = getElementData('Si'); if(el) onSelectElement(el); }}>Si</span>
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-[#00E5FF]/50 to-transparent mx-2" />
                        <span className="text-xs uppercase font-bold tracking-widest text-white">Transistors & AI</span>
                      </div>
                    </div>
                    <div className="p-6 bg-black/40 border border-[#FF9100]/30 rounded-lg backdrop-blur-md">
                      <h2 className="text-[#FF9100] font-black text-xl tracking-widest uppercase mb-4 flex items-center gap-2"><Building2 className="w-5 h-5"/> IRON INFRASTRUCTURE</h2>
                      <div className="flex items-center gap-3">
                        <span className="w-12 h-12 bg-[#FF9100]/20 text-[#FF9100] font-black flex justify-center items-center rounded-sm text-xl border border-[#FF9100]/40 cursor-pointer hover:bg-[#FF9100] hover:text-black transition" onClick={() => { const el = getElementData('Fe'); if(el) onSelectElement(el); }}>Fe</span>
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-[#FF9100]/50 to-transparent mx-2" />
                        <span className="text-xs uppercase font-bold tracking-widest text-white">Cities & Transport</span>
                      </div>
                    </div>
                 </div>

                 <div className="w-12 flex flex-col items-center">
                   <div className="w-[1px] h-32 bg-white/20" />
                   <GitMerge className="w-8 h-8 text-white/50 my-4" />
                   <div className="w-[1px] h-32 bg-white/20" />
                 </div>

                 <div className="flex-1 flex flex-col gap-6 w-full">
                    <div className="p-6 bg-black/40 border border-[#7C4DFF]/30 rounded-lg backdrop-blur-md">
                      <h2 className="text-[#7C4DFF] font-black text-xl tracking-widest uppercase mb-4 flex items-center gap-2"><Zap className="w-5 h-5"/> URANIUM ENERGY CORE</h2>
                      <div className="flex items-center gap-3">
                        <span className="text-xs uppercase font-bold tracking-widest text-white">Nuclear Grids</span>
                        <div className="flex-1 h-[1px] bg-gradient-to-l from-[#7C4DFF]/50 to-transparent mx-2" />
                        <span className="w-12 h-12 bg-[#7C4DFF]/20 text-[#7C4DFF] font-black flex justify-center items-center rounded-sm text-xl border border-[#7C4DFF]/40 cursor-pointer hover:bg-[#7C4DFF] hover:text-black transition" onClick={() => { const el = getElementData('U'); if(el) onSelectElement(el); }}>U</span>
                      </div>
                    </div>
                    <div className="p-6 bg-black/40 border border-[#FF3366]/30 rounded-lg backdrop-blur-md">
                      <h2 className="text-[#FF3366] font-black text-xl tracking-widest uppercase mb-4 flex items-center gap-2"><Target className="w-5 h-5"/> LITHIUM MATRIX</h2>
                      <div className="flex items-center gap-3">
                        <span className="text-xs uppercase font-bold tracking-widest text-white">Portable Power</span>
                        <div className="flex-1 h-[1px] bg-gradient-to-l from-[#FF3366]/50 to-transparent mx-2" />
                        <span className="w-12 h-12 bg-[#FF3366]/20 text-[#FF3366] font-black flex justify-center items-center rounded-sm text-xl border border-[#FF3366]/40 cursor-pointer hover:bg-[#FF3366] hover:text-black transition" onClick={() => { const el = getElementData('Li'); if(el) onSelectElement(el); }}>Li</span>
                      </div>
                    </div>
                 </div>
              </div>
            )}

            {/* VIEW: COSMIC NETWORK */}
            {activeTab === 'cosmic' && (
              <div className="w-full h-full max-w-6xl flex items-center justify-center mt-12 pb-20">
                <div className="flex flex-col items-center gap-8 relative w-full pt-10">
                  <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-gradient-to-b from-white/40 via-[#7C4DFF] to-transparent -translate-x-1/2" />
                  
                  {COSMIC_PIPELINE.map((stage, idx) => (
                    <div key={idx} className={`flex items-center gap-6 w-full ${idx % 2 === 0 ? 'justify-end md:pr-[50%] pr-[60%]' : 'justify-start md:pl-[50%] pl-[40%]'}`}>
                      <div className={`p-4 bg-black/80 border border-white/10 hover:border-[#7C4DFF] rounded-lg transition-all w-48 shadow-lg ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                        <div className={`text-[8px] font-mono tracking-widest uppercase text-[#7C4DFF] block mb-1`}>{stage.type}</div>
                        <div className="text-sm font-black text-white">{stage.id}</div>
                        <div className="text-[10px] text-white/50 mt-2 font-light">{stage.desc}</div>
                      </div>
                      
                      <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border-2 border-[#7C4DFF] z-10 shadow-[0_0_10px_#7C4DFF]" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
});
