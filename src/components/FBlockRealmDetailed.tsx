import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChemicalElement } from '../types';
import { ELEMENTS_DATA } from '../data';
import { Activity, Radio, Magnet, Zap, Target, ArrowRight, CornerDownRight, ShieldAlert, Info } from 'lucide-react';

interface FBlockRealmDetailedProps {
  block: any;
  onSelectElement: (element: ChemicalElement) => void;
}

export const FBlockRealmDetailed = ({ block, onSelectElement }: FBlockRealmDetailedProps) => {
  const [selectedNode, setSelectedNode] = useState<ChemicalElement | null>(null);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);

  const getElement = (sym: string) => ELEMENTS_DATA.find(e => e.symbol === sym);

  // F-Block structure
  const fBlockGrid = [
    // Lanthanides
    ['La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb'],
    // Actinides
    ['Ac', 'Th', 'Pa', 'U',  'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No']
  ];

  const domains = [
    {
      id: 'lanthanides',
      label: 'Lanthanides (Rare Earths)',
      icon: Magnet,
      color: '#7C4DFF',
      elements: ['La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb'],
      desc: 'The Rare Earth metals. Characterized by profound magnetic properties and powerful luminescence, these elements drive modern consumer electronics, lasers, and quantum computing.'
    },
    {
        id: 'actinides',
        label: 'Actinides (Nuclear)',
        icon: Radio,
        color: '#FF3D00',
        elements: ['Ac', 'Th', 'Pa', 'U',  'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No'],
        desc: 'The frontier of heavy nuclei. Dense, radioactive, and profoundly energetic. These elements unlock nuclear fission, spacecraft power generation, and particle accelerator synthesis.'
    },
    {
        id: 'magnetic',
        label: 'Super-Magnetic Cores',
        icon: Zap,
        color: '#00E5FF',
        elements: ['Nd', 'Sm', 'Gd', 'Dy'],
        desc: 'The strongest magnetic elements in the universe. Essential for electric vehicle motors, wind turbines, and advanced data storage.'
    },
    {
        id: 'synthetic',
        label: 'Synthetic Horizons',
        icon: Target,
        color: '#FFEA00',
        elements: ['Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No'],
        desc: 'Elements forged by human hands. Synthesized in particle accelerators and nuclear reactors, pushing the boundaries of the periodic table.'
    }
  ];

  const currentDomain = domains.find(d => d.id === activeDomain);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="flex flex-col md:flex-row h-full gap-8 overflow-y-auto custom-scrollbar relative p-4"
    >
      {/* Visual Nuclear Background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full border border-[#7C4DFF]/10 opacity-30 object-contain"
          style={{ background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, #7C4DFF20 90deg, transparent 180deg)' }}
        />
      </div>

      {/* Left Area: The F-Block Network */}
      <div className="flex-[2] flex flex-col min-w-[340px] gap-6 relative select-none">
        
        {/* Domain Filters */}
        <div className="flex flex-wrap gap-2 z-20">
           {domains.map(dom => {
              const Icon = dom.icon;
              const isActive = activeDomain === dom.id;
              return (
                 <button
                   key={dom.id}
                   onClick={() => {
                       setActiveDomain(isActive ? null : dom.id);
                       setSelectedNode(null);
                   }}
                   className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border transition-all cursor-pointer ${isActive ? 'bg-white/10' : 'bg-[#0B1020]/80 hover:bg-white/5'}`}
                   style={{ borderColor: isActive ? dom.color : 'rgba(255,255,255,0.1)', color: isActive ? dom.color : 'rgba(255,255,255,0.5)' }}
                 >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-mono uppercase tracking-widest font-bold">{dom.label}</span>
                 </button>
              );
           })}
        </div>

        {/* The Grid */}
        <div className="flex-1 flex flex-col gap-4 z-10 w-full xl:max-w-4xl py-6">
           <div className="flex flex-col gap-6 relative">
               {fBlockGrid.map((row, rowIndex) => (
                 <div key={rowIndex} className="flex flex-col relative w-full gap-2">
                    <div className="text-[10px] font-mono tracking-widest uppercase text-white/50 mb-2 border-b border-white/10 pb-2">
                       {rowIndex === 0 ? 'Lanthanide Series' : 'Actinide Series'}
                    </div>
                    <div className="grid grid-cols-7 xl:grid-cols-14 gap-2 w-full">
                        {row.map(sym => {
                        const elData = getElement(sym);
                        if (!elData) return <div key={sym} className="aspect-square opacity-0" />;
                        
                        const isSelected = selectedNode?.symbol === sym;
                        const isInDomain = currentDomain ? currentDomain.elements.includes(sym) : false;
                        const isDimmed = currentDomain ? !isInDomain : false;

                        return (
                            <div key={sym} className="relative aspect-square w-full min-w-[36px]">
                                <button
                                    onClick={() => setSelectedNode(elData)}
                                    className={`absolute inset-0 w-full h-full rounded-sm border backdrop-blur-md flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${isSelected ? 'z-20 border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.4)] bg-[#0B1020]' : isDimmed ? 'border-white/5 bg-[#0B1020]/40 opacity-30 z-0' : 'border-white/10 hover:border-white/40 bg-[#0B1020]/80 z-10'}`}
                                    style={isSelected && currentDomain ? { borderColor: currentDomain.color, boxShadow: `0 0 20px ${currentDomain.color}40` } : (isInDomain ? { borderColor: `${currentDomain?.color}60` } : {})}
                                >
                                    {isSelected && currentDomain && <motion.div layoutId="hover-glow-f" className="absolute inset-0" style={{ backgroundColor: `${currentDomain.color}20` }} />}
                                    <span className="text-[8px] sm:text-[9px] font-mono text-white/40 absolute top-0.5 sm:top-1 left-0.5 sm:left-1">{elData.number}</span>
                                    <span className="text-sm sm:text-xl font-sans font-black text-white mix-blend-screen">{sym}</span>
                                </button>
                            </div>
                        );
                        })}
                    </div>
                 </div>
               ))}
           </div>
        </div>
      </div>

      {/* Right Area: Scientific Analysis */}
      <div className="flex-[3] flex flex-col min-w-[350px] border-l border-white/10 pl-6 lg:pl-10 relative z-20 bg-[#0A0F1D]/50 backdrop-blur-sm -my-4 py-4 pr-4">
        <h3 className="text-xs font-mono tracking-[0.3em] uppercase text-[#7C4DFF] font-bold mb-8 flex items-center gap-3">
          <Activity className="w-4 h-4 text-[#7C4DFF]" /> F-Block Intelligence
        </h3>

        <AnimatePresence mode="wait">
          {selectedNode ? (
            <motion.div
              key={selectedNode.symbol}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full overflow-y-auto custom-scrollbar"
            >
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-5xl font-black text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{selectedNode.name}</h2>
                    <span className="text-2xl font-mono text-[#7C4DFF] bg-[#7C4DFF]/10 px-3 py-1 border border-[#7C4DFF]/30">{selectedNode.symbol}</span>
                  </div>
                  <div className="text-xs font-mono uppercase tracking-widest text-[#7C4DFF]">Atomic Number: {selectedNode.number} • Mass: {selectedNode.mass.toFixed(2)}</div>
                </div>
              </div>

              {/* Core scientific traits block */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 border border-white/10 p-4 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 opacity-10">
                     <Radio size={48} />
                   </div>
                   <div className="text-[9px] font-mono text-white/40 uppercase mb-1">State & Category</div>
                   <div className="font-bold text-white capitalize text-sm">{selectedNode.state} • {selectedNode.category.replace('-', ' ')}</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 opacity-10">
                     <Magnet size={48} />
                   </div>
                   <div className="text-[9px] font-mono text-white/40 uppercase mb-1">Electron Config</div>
                   <div className="font-mono text-[#7C4DFF] font-bold text-sm tracking-tighter">{selectedNode.electronConfig}</div>
                </div>
                <div className="bg-[#7C4DFF]/10 border border-[#7C4DFF]/30 p-4 relative overflow-hidden col-span-2 lg:col-span-1">
                   <div className="absolute top-0 right-0 p-2 opacity-10">
                     <Target size={48} />
                   </div>
                   <div className="text-[9px] font-mono text-[#7C4DFF] uppercase mb-1 font-bold">Radioactivity</div>
                   <div className="font-mono text-white font-bold text-sm">{selectedNode.number >= 84 || selectedNode.symbol === 'Pm' ? 'Radioactive' : 'Stable'}</div>
                </div>
              </div>

              {/* Contextual Storytelling  */}
              <div className="flex-1 flex flex-col gap-6">
                
                <div>
                   <h4 className="flex items-center gap-2 text-[10px] font-mono text-white/50 uppercase tracking-widest border-b border-white/10 pb-2 mb-3">
                     <Info className="w-3 h-3" /> Quantum Identity
                   </h4>
                   <p className="text-sm text-[#EAF2FF]/80 leading-relaxed font-light">
                     {selectedNode.summary}
                   </p>
                </div>

                <div>
                   <h4 className="flex items-center gap-2 text-[10px] font-mono text-[#FFD600] uppercase tracking-widest border-b border-[#FFD600]/20 pb-2 mb-3">
                     <ShieldAlert className="w-3 h-3" /> F-Block Characteristics
                   </h4>
                   <p className="text-sm text-[#EAF2FF]/80 leading-relaxed font-light mb-2">
                     {selectedNode.reactivity || 'A mysterious element operating at the frontier of high-energy physics mapping.'}
                   </p>
                   <p className="text-xs text-[#EAF2FF]/50 leading-relaxed font-light border-l border-white/10 pl-3 italic">
                      {selectedNode.category.includes('actinide') ? 
                        `As an actinide, ${selectedNode.name} possesses electrons filling the 5f orbital shell. These massive nuclei are inherently unstable, deeply radioactive, and profoundly energetic—capable of fission and exotic quantum states.` :
                        selectedNode.category.includes('lanthanide') ?
                        `As a lanthanide, ${selectedNode.name} forces electrons into the buried 4f orbital shell. This internal shielding generates incredibly strong localized magnetic moments and vibrant optical properties crucial for modern lasers and magnets.` :
                        `An advanced heavy-metal system with exotic physics.`
                      }
                   </p>
                </div>

              </div>

              {/* Enter Gateway */}
              <button 
                onClick={() => onSelectElement(selectedNode)}
                className="mt-8 flex items-center justify-between w-full p-4 border border-[#7C4DFF]/40 bg-[#7C4DFF]/10 hover:bg-[#7C4DFF]/20 transition-colors group cursor-pointer"
              >
                 <div className="flex flex-col text-left">
                   <span className="text-[10px] font-mono text-[#7C4DFF] uppercase tracking-widest font-bold">Initiate Full Analysis</span>
                   <span className="text-white text-lg font-bold">Enter Element World</span>
                 </div>
                 <div className="w-10 h-10 border border-[#7C4DFF]/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                   <ArrowRight className="text-[#7C4DFF] w-5 h-5 flex-shrink-0" />
                 </div>
              </button>
            </motion.div>
          ) : currentDomain ? (
            <motion.div 
              key="domain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full items-start"
            >
               <currentDomain.icon className="w-12 h-12 mb-6" style={{ color: currentDomain.color }} />
               <h2 className="text-4xl font-sans font-black text-white uppercase tracking-tighter mb-4">{currentDomain.label}</h2>
               <p className="text-[#EAF2FF]/70 text-lg font-light leading-relaxed mb-8 max-w-md">
                 {currentDomain.desc}
               </p>
               <div className="border border-white/10 bg-white/5 p-6 rounded-sm w-full max-w-md relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 opacity-10" style={{ background: `radial-gradient(circle, ${currentDomain.color} 0%, transparent 70%)` }} />
                   <h4 className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-4">Domain Constituents</h4>
                   <div className="flex flex-wrap gap-2">
                      {currentDomain.elements.map(sym => (
                         <div key={sym} className="px-3 py-1 bg-black/50 border rounded-sm font-sans font-bold text-sm" style={{ color: currentDomain.color, borderColor: currentDomain.color + '40' }}>
                           {sym}
                         </div>
                      ))}
                   </div>
               </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col justify-center items-center text-center opacity-70"
            >
               <Activity className="w-16 h-16 text-[#7C4DFF]/20 mb-6" />
               <div className="text-sm font-mono text-[#7C4DFF] uppercase tracking-widest font-bold">Select a Domain or Element</div>
               <div className="text-xs text-[#EAF2FF]/60 mt-2 max-w-[280px] leading-relaxed">
                 Explore the mysterious depths of the F-Block. Highlight specific domain engines to reveal the rare earths and nuclear systems.
               </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};
