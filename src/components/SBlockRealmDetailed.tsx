import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChemicalElement } from '../types';
import { ELEMENTS_DATA } from '../data';
import { Zap, Activity, Info, Flame, ShieldAlert, ArrowRight, CornerDownRight } from 'lucide-react';

interface SBlockRealmDetailedProps {
  block: any;
  onSelectElement: (element: ChemicalElement) => void;
}

export const SBlockRealmDetailed = ({ block, onSelectElement }: SBlockRealmDetailedProps) => {
  const [selectedNode, setSelectedNode] = useState<ChemicalElement | null>(null);

  // Separate elements by logical group
  const group1 = ['H', 'Li', 'Na', 'K', 'Rb', 'Cs', 'Fr'];
  const group2 = ['Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Ra'];
  const nobleGas = ['He'];

  const getElement = (sym: string) => ELEMENTS_DATA.find(e => e.symbol === sym);

  // Group 1 increasing reactivity line
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="flex flex-col md:flex-row h-full gap-8 overflow-y-auto custom-scrollbar relative p-4"
    >
      {/* Visual Energy Background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="w-full h-full bg-[linear-gradient(rgba(255,51,102,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,51,102,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Left Area: The Reactivity Network */}
      <div className="flex-[2] flex min-w-[300px] gap-8 relative select-none">
        
        {/* Reactivity Trend Indicators */}
        <div className="absolute left-[-20px] top-20 bottom-10 w-4 flex flex-col justify-between items-center opacity-50">
          <div className="text-[8px] font-mono tracking-widest uppercase rotate-180 [writing-mode:vertical-rl] text-[#FF3366]">Reactivity Increases (Low IE)</div>
          <motion.div 
            className="w-[1px] flex-1 bg-gradient-to-b from-transparent via-[#FF3366] to-[#FF3366] my-2 cursor-default" 
          />
          <ArrowRight className="w-3 h-3 text-[#FF3366] rotate-90" />
        </div>

        {/* Group 1 Pillar */}
        <div className="flex flex-col gap-3 items-center z-10 w-32 relative">
          <div className="text-[10px] font-mono tracking-widest uppercase text-[#FF3366] font-bold mb-2">Group 1 (Alkali + H)</div>
          
          {group1.map((sym, index) => {
            const elData = getElement(sym);
            if (!elData) return null;
            const IE = elData.ionizationEnergy || 'Variable';
            const isHovered = selectedNode?.symbol === sym;
            
            return (
              <div key={sym} className="relative w-full flex justify-center group/node">
                {/* Connection line downwards */}
                {index < group1.length - 1 && (
                  <div className="absolute top-10 bottom-[-12px] w-[2px] bg-[#FF3366]/20 group-hover/node:bg-[#FF3366]/60 transition-colors" />
                )}
                <button
                  onClick={() => setSelectedNode(elData)}
                  className={`relative w-16 h-16 rounded-sm border bg-[#0B1020]/90 backdrop-blur-md flex flex-col items-center justify-center transition-all cursor-pointer z-10 overflow-hidden ${isHovered ? 'border-[#FF3366] scale-110 shadow-[0_0_20px_rgba(255,51,102,0.4)]' : 'border-white/10 hover:border-[#FF3366]/50'}`}
                >
                  {isHovered && <motion.div layoutId="hover-glow-s1" className="absolute inset-0 bg-[#FF3366]/10" />}
                  <span className="text-[9px] font-mono text-white/40 absolute top-1 left-1">{elData.number}</span>
                  <span className="text-xl font-sans font-black text-white mix-blend-screen">{sym}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Group 2 Pillar */}
        <div className="flex flex-col gap-3 items-center justify-end pb-0 z-10 w-32">
          <div className="text-[10px] font-mono tracking-widest uppercase text-[#FFD600] font-bold mb-2">Group 2 (Alkaline Earth)</div>
          
          {group2.map((sym, index) => {
            const elData = getElement(sym);
            if (!elData) return null;
            const isHovered = selectedNode?.symbol === sym;
            
            return (
              <div key={sym} className="relative w-full flex justify-center group/node">
                {/* Connection line downwards */}
                {index < group2.length - 1 && (
                  <div className="absolute top-10 bottom-[-12px] w-[2px] bg-[#FFD600]/20 group-hover/node:bg-[#FFD600]/60 transition-colors" />
                )}
                <button
                  onClick={() => setSelectedNode(elData)}
                  className={`relative w-16 h-16 rounded-sm border bg-[#0B1020]/90 backdrop-blur-md flex flex-col items-center justify-center transition-all cursor-pointer z-10 overflow-hidden ${isHovered ? 'border-[#FFD600] scale-110 shadow-[0_0_20px_rgba(255,214,0,0.4)]' : 'border-white/10 hover:border-[#FFD600]/50'}`}
                >
                  {isHovered && <motion.div layoutId="hover-glow-s2" className="absolute inset-0 bg-[#FFD600]/10" />}
                  <span className="text-[9px] font-mono text-white/40 absolute top-1 left-1">{elData.number}</span>
                  <span className="text-xl font-sans font-black text-white">{sym}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* He Pillar */}
        <div className="flex flex-col gap-3 justify-start items-center z-10 w-24">
          <div className="text-[10px] font-mono tracking-widest uppercase text-[#00E5FF] font-bold mb-2 text-center">Inert Core</div>
          
          {nobleGas.map((sym) => {
            const elData = getElement(sym);
            if (!elData) return null;
            const isHovered = selectedNode?.symbol === sym;
            
            return (
              <div key={sym} className="relative w-full flex justify-center group/node">
                <button
                  onClick={() => setSelectedNode(elData)}
                  className={`relative w-16 h-16 rounded-sm border bg-[#0B1020]/90 backdrop-blur-md flex flex-col items-center justify-center transition-all cursor-pointer z-10 overflow-hidden ${isHovered ? 'border-[#00E5FF] scale-110 shadow-[0_0_20px_rgba(0,229,255,0.4)]' : 'border-white/10 hover:border-[#00E5FF]/50'}`}
                >
                  {isHovered && <motion.div layoutId="hover-glow-s3" className="absolute inset-0 bg-[#00E5FF]/10" />}
                  <span className="text-[9px] font-mono text-white/40 absolute top-1 left-1">{elData.number}</span>
                  <span className="text-xl font-sans font-black text-white">{sym}</span>
                </button>
              </div>
            );
          })}
        </div>

      </div>

      {/* Right Area: Element Context & Scientific Story */}
      <div className="flex-[3] flex flex-col min-w-[350px] border-l border-white/10 pl-6 lg:pl-10 relative z-20 bg-[#0A0F1D]/50 backdrop-blur-sm -my-4 py-4 pr-4">
        <h3 className="text-xs font-mono tracking-[0.3em] uppercase text-white/30 font-bold mb-8 flex items-center gap-3">
          <Activity className="w-4 h-4 text-[#FF3366]" /> Block Intelligence
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
                    <span className="text-2xl font-mono text-[#FF3366] bg-[#FF3366]/10 px-3 py-1 border border-[#FF3366]/30">{selectedNode.symbol}</span>
                  </div>
                  <div className="text-xs font-mono uppercase tracking-widest text-[#FF3366]">Atomic Number: {selectedNode.number} • Mass: {selectedNode.mass.toFixed(2)}</div>
                </div>
              </div>

              {/* Core scientific traits block */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 border border-white/10 p-4 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 opacity-10">
                     <Flame size={48} />
                   </div>
                   <div className="text-[9px] font-mono text-white/40 uppercase mb-1">State & Category</div>
                   <div className="font-bold text-white capitalize text-sm">{selectedNode.state} • {selectedNode.category.replace('-', ' ')}</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 opacity-10">
                     <Zap size={48} />
                   </div>
                   <div className="text-[9px] font-mono text-white/40 uppercase mb-1">Electron Config</div>
                   <div className="font-mono text-[#FF3366] font-bold text-sm">{selectedNode.electronConfig}</div>
                </div>
                <div className="bg-[#FF3366]/10 border border-[#FF3366]/30 p-4 relative overflow-hidden col-span-2 lg:col-span-1">
                   <div className="absolute top-0 right-0 p-2 opacity-10">
                     <Activity size={48} />
                   </div>
                   <div className="text-[9px] font-mono text-[#FF3366] uppercase mb-1 font-bold">Ionization Energy</div>
                   <div className="font-mono text-white font-bold text-sm">{selectedNode.ionizationEnergy ? `${selectedNode.ionizationEnergy} kJ/mol` : 'Variable'}</div>
                </div>
              </div>

              {/* Contextual Storytelling  */}
              <div className="flex-1 flex flex-col gap-6">
                
                <div>
                   <h4 className="flex items-center gap-2 text-[10px] font-mono text-white/50 uppercase tracking-widest border-b border-white/10 pb-2 mb-3">
                     <Info className="w-3 h-3" /> Core Identity
                   </h4>
                   <p className="text-sm text-[#EAF2FF]/80 leading-relaxed font-light">
                     {selectedNode.summary}
                   </p>
                </div>

                <div>
                   <h4 className="flex items-center gap-2 text-[10px] font-mono text-[#FFD600] uppercase tracking-widest border-b border-[#FFD600]/20 pb-2 mb-3">
                     <ShieldAlert className="w-3 h-3" /> Reaction Intelligence
                   </h4>
                   <p className="text-sm text-[#EAF2FF]/80 leading-relaxed font-light mb-2">
                     {selectedNode.reactivity}
                   </p>
                   <p className="text-xs text-[#EAF2FF]/50 leading-relaxed font-light border-l border-white/10 pl-3 italic">
                      {selectedNode.category.includes('alkali') ? 
                        `As an alkali metal, ${selectedNode.name} has a single valence electron in its outermost s-orbital. It is highly motivated to lose this electron to achieve a stable noble-gas configuration.` :
                        selectedNode.category.includes('alkaline') ?
                        `As an alkaline earth metal, ${selectedNode.name} has two valence electrons. While slightly less reactive than alkali metals, it readily forms +2 cations, driving essential geological and biological processes.` :
                        selectedNode.symbol === 'H' ?
                        `Unique in the s-block, Hydrogen's single electron allows it to act both as an electron donor (like alkalis) or acceptor (like halogens).` :
                        `Helium features a fully closed 1s orbital (1s²). Unlike the rest of the energetic s-block, it represents perfect chemical stability and inertia.`
                      }
                   </p>
                </div>

              </div>

              {/* Enter Gateway */}
              <button 
                onClick={() => onSelectElement(selectedNode)}
                className="mt-8 flex items-center justify-between w-full p-4 border border-[#FF3366]/40 bg-[#FF3366]/10 hover:bg-[#FF3366]/20 transition-colors group cursor-pointer"
              >
                 <div className="flex flex-col text-left">
                   <span className="text-[10px] font-mono text-[#FF3366] uppercase tracking-widest font-bold">Initiate Full Analysis</span>
                   <span className="text-white text-lg font-bold">Enter Element World</span>
                 </div>
                 <div className="w-10 h-10 border border-[#FF3366]/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                   <ArrowRight className="text-[#FF3366] w-5 h-5 flex-shrink-0" />
                 </div>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col justify-center items-center text-center opacity-50"
            >
               <CornerDownRight className="w-12 h-12 text-white/20 mb-4" />
               <div className="text-sm font-mono text-white/50 uppercase tracking-widest">Select an Element to unlock</div>
               <div className="text-xs text-white/30 mt-2 max-w-[250px]">Trace the reactivity pathways and scientific properties of the S-Block realm.</div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};
