import React, { useState } from 'react';
import { ChemicalElement } from '../types';
import { ELEMENTS_DATA } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Hexagon, Zap, Globe, ChevronRight, X, Atom, Orbit } from 'lucide-react';



interface BlocksUniverseProps {
  onSelectElement: (element: ChemicalElement) => void;
  onNavigateHome: () => void;
}

const BLOCKS_DATA = [
  {
    id: 's',
    name: 'S-BLOCK',
    subtitle: 'ENERGY & FOUNDATIONS',
    color: '#FF3366',
    theme: 'from-[#FF3366]/20 to-transparent border-[#FF3366]',
    textGlow: 'text-[#FF3366] drop-shadow-[0_0_15px_rgba(255,51,102,0.5)]',
    description: 'The realm of energy, reactivity, and foundations. Highly energetic alkali and alkaline earth metals define the left edge of the periodic table, characterized by their readiness to donate electrons and drive primitive chemical motion.',
    features: ['Electron Donation', 'Energy Flows', 'High Reactivity', 'Primitive Motion'],
    elements: ['H', 'He', 'Li', 'Be', 'Na', 'Mg', 'K', 'Ca', 'Rb', 'Sr', 'Cs', 'Ba', 'Fr', 'Ra'],
    icon: Zap,
    posOverview: { x: '-120%', y: 0, z: 40, rotateY: 15, rotateX: 0 },
    bgVisual: 'bg-s'
  },
  {
    id: 'p',
    name: 'P-BLOCK',
    subtitle: 'LIFE & DIVERSITY',
    color: '#00E5FF',
    theme: 'from-[#00E5FF]/20 to-transparent border-[#00E5FF]',
    textGlow: 'text-[#00E5FF] drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]',
    description: 'The realm of life, diversity, atmospheres, and advanced chemistry. A complex ecosystem hosting carbon networks, semiconductor patterns, and noble gas systems that compose the natural world.',
    features: ['Carbon Networks', 'Atmospheric Structures', 'Semiconductor Patterns', 'Noble Gas Systems'],
    elements: ['B', 'C', 'N', 'O', 'F', 'Ne', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'],
    icon: Globe,
    posOverview: { x: '120%', y: 0, z: -40, rotateY: -15, rotateX: 0 },
    bgVisual: 'bg-p'
  },
  {
    id: 'd',
    name: 'D-BLOCK',
    subtitle: 'INDUSTRY & CATALYSIS',
    color: '#FF9100',
    theme: 'from-[#FF9100]/20 to-transparent border-[#FF9100]',
    textGlow: 'text-[#FF9100] drop-shadow-[0_0_15px_rgba(255,145,0,0.5)]',
    description: 'The realm of materials, industry, engineering, and catalysis. Heavy, structurally robust metallic networks characterize the foundations of modern civilization and transition metal relationships.',
    features: ['Metallic Networks', 'Structural Systems', 'Industrial Chemistry', 'Transition Metals'],
    elements: ['Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Lr', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn'],
    icon: Hexagon,
    posOverview: { x: 0, y: '-110%', z: 80, rotateY: 0, rotateX: -10 },
    bgVisual: 'bg-d'
  },
  {
    id: 'f',
    name: 'F-BLOCK',
    subtitle: 'RARE EARTHS & NUCLEAR',
    color: '#7C4DFF',
    theme: 'from-[#7C4DFF]/20 to-transparent border-[#7C4DFF]',
    textGlow: 'text-[#7C4DFF] drop-shadow-[0_0_15px_rgba(124,77,255,0.5)]',
    description: 'The realm of rare earths, nuclear systems, and advanced technology. Deeply buried f-orbitals create mysterious elements harboring radioactive energy and high-energy structures at the frontier of science.',
    features: ['Radioactive Energy', 'Rare-Earth Networks', 'High-Energy Structures', 'Nuclear Systems'],
    elements: ['La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No'],
    icon: Activity,
    posOverview: { x: 0, y: '110%', z: -80, rotateY: 0, rotateX: 10 },
    bgVisual: 'bg-f'
  }
];

// Reusable cinematic backgrounds
const VisualBgS = () => (
  <div className="absolute inset-0 overflow-hidden opacity-40 group-hover:opacity-100 transition-opacity duration-1000 z-0">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#FF336640_0%,_transparent_70%)]" />
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.8, 0.2] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-dashed border-[#FF3366] rounded-full"
    />
  </div>
);

const VisualBgP = () => (
  <div className="absolute inset-0 overflow-hidden opacity-40 group-hover:opacity-100 transition-opacity duration-1000 z-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,229,255,0.1)_50%,transparent_75%)] bg-[length:40px_40px]">
     <svg className="absolute inset-0 w-full h-full opacity-30 animate-pulse">
       <pattern id="hex-p" width="40" height="69.282" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
         <path d="M40 17.32l-20 11.547L0 17.32V-5.774l20-11.547L40-5.774V17.32zm0 46.188l-20 11.548-20-11.548V40.414L0 28.867l20 11.547 20-11.547v23.094z" fill="none" stroke="#00E5FF" strokeWidth="1"/>
       </pattern>
       <rect width="100%" height="100%" fill="url(#hex-p)"/>
     </svg>
  </div>
);

const VisualBgD = () => (
  <div className="absolute inset-0 overflow-hidden opacity-40 group-hover:opacity-100 transition-opacity duration-1000 z-0 flex rounded-sm">
      <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-0.5 p-1 bg-[#FF9100]/10">
        {[...Array(16)].map((_, i) => (
          <motion.div 
            key={i} 
            className="bg-[#FF9100]/20"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>
  </div>
);

const VisualBgF = () => (
  <div className="absolute inset-0 overflow-hidden opacity-40 group-hover:opacity-100 transition-opacity duration-1000 z-0">
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,#7C4DFF80_90deg,transparent_180deg,#7C4DFF80_270deg,transparent_360deg)]"
    />
  </div>
);

const BlockBackground = ({ type }: { type: string }) => {
  switch (type) {
    case 'bg-s': return <VisualBgS />;
    case 'bg-p': return <VisualBgP />;
    case 'bg-d': return <VisualBgD />;
    case 'bg-f': return <VisualBgF />;
    default: return null;
  }
};


export const BlocksUniverse = React.memo(function BlocksUniverse({ onSelectElement, onNavigateHome }: BlocksUniverseProps) {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const activeBlockData = BLOCKS_DATA.find(b => b.id === activeBlockId);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (activeBlockId) return; // Freeze parallax when detailed view is open
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    setMousePos({ x, y });
  };

  return (
    <div 
      className="absolute inset-0 z-10 bg-[#040814]/95 backdrop-blur-2xl overflow-hidden pointer-events-auto text-white select-none"
      onMouseMove={handleMouseMove}
    >
      {/* 3D Overview Space */}
      <div className="w-full h-full flex items-center justify-center [perspective:1400px]">
        <motion.div 
          className="relative w-full max-w-lg h-[500px] md:h-[600px] flex items-center justify-center [transform-style:preserve-3d]"
          animate={!activeBlockId ? { 
            rotateX: mousePos.y * -15, 
            rotateY: mousePos.x * 15,
            scale: 1
          } : {
            rotateX: 0,
            rotateY: 0,
            scale: 0.95
          }}
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
        >
          
          {/* Central Nucleus Core (Only visible in overview) */}
          <AnimatePresence>
            {!activeBlockId && (
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute w-40 h-40 rounded-full border border-white/10 bg-white/[0.02] shadow-[0_0_80px_rgba(255,255,255,0.05)] flex items-center justify-center [transform:translateZ(-150px)]"
              >
                 <Orbit className="w-16 h-16 text-white/10 animate-[spin_10s_linear_infinite]" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Render the 4 Blocks */}
          {BLOCKS_DATA.map((block) => {
             const Icon = block.icon;
             const isActive = activeBlockId === block.id;

             return (
                <motion.div
                   key={block.id}
                   layoutId={`block-container-${block.id}`}
                   onClick={() => !isActive && setActiveBlockId(block.id)}
                   className={`absolute flex flex-col overflow-hidden bg-[#0A0F1D]/80 backdrop-blur-xl border border-white/10 rounded-sm group transition-colors cursor-pointer shadow-xl ${
                     isActive ? 'z-50 pointer-events-auto border-white/30' : 'z-10 pointer-events-auto hover:border-white/40'
                   }`}
                   animate={isActive ? {
                      width: '90vw',
                      maxWidth: 1200,
                      height: '80vh',
                      maxHeight: 800,
                      x: 0, y: 0, z: 100, rotateX: 0, rotateY: 0
                   } : {
                      width: 260,
                      height: 320,
                      ...block.posOverview
                   }}
                   transition={{ type: "spring", stiffness: 50, damping: 20, mass: 1 }}
                >
                   {/* Background Visual Payload */}
                   <motion.div layoutId={`block-bg-${block.id}`} className="absolute inset-0 z-0 ring-1 ring-inset mix-blend-screen" style={{ '--tw-ring-color': `${block.color}20` } as React.CSSProperties}>
                      <BlockBackground type={block.bgVisual} />
                   </motion.div>

                   {/* Header / Top Section */}
                   <motion.div 
                     layoutId={`block-header-${block.id}`}
                     className={`relative z-10 flex flex-col justify-end p-6 border-b border-white/5 ${isActive ? 'h-64' : 'h-1/2'}`}
                     style={{ background: `linear-gradient(to bottom, transparent 0%, ${block.color}20 100%)` }}
                   >
                     {/* Dynamic Icon */}
                     <motion.div layoutId={`block-icon-${block.id}`} className="absolute top-6 left-6 opacity-30">
                        <Icon size={isActive ? 64 : 32} color={block.color} />
                     </motion.div>

                     {/* Main Title */}
                     <motion.h2 
                       layoutId={`block-title-${block.id}`}
                       className={`font-sans font-black tracking-widest uppercase mt-auto ${isActive ? 'text-5xl md:text-7xl drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]' : 'text-3xl'}`}
                       style={{ color: isActive ? 'white' : block.color }}
                     >
                        {block.name}
                     </motion.h2>
                     <motion.div 
                        layoutId={`block-subtitle-${block.id}`}
                        className="text-[9px] md:text-[10px] font-mono tracking-[0.3em] font-bold mt-2 uppercase"
                        style={{ color: `${block.color}80` }}
                     >
                        {block.subtitle}
                     </motion.div>
                   </motion.div>

                   {/* Content payload */}
                   <div className="relative z-10 p-6 flex-1 flex flex-col min-h-0 bg-[#0A0F1D]/90">
                      {!isActive && (
                         <div className="flex flex-col h-full">
                           <p className="text-xs text-white/50 line-clamp-3 leading-relaxed">
                             {block.description}
                           </p>
                           <div className="mt-auto flex items-center justify-between">
                              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{block.elements.length} Elements</span>
                              <ChevronRight className="w-4 h-4 text-white/30" />
                           </div>
                         </div>
                      )}
                   </div>

                   {/* Close Details Button */}
                   {isActive && (
                      <motion.button 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center bg-black/50 border border-white/20 hover:border-white rounded-full text-white/60 hover:text-white cursor-pointer backdrop-blur-md transition-all hover:rotate-90 hover:scale-110"
                        onClick={(e) => {
                           e.stopPropagation();
                           setActiveBlockId(null);
                        }}
                      >
                         <X className="w-5 h-5" />
                      </motion.button>
                   )}
                </motion.div>
             );
          })}
        </motion.div>
      </div>

      {/* ZONE 3 & 4: Left & Right Rails for Active Block */}
      <AnimatePresence>
        {activeBlockData && (
          <React.Fragment>
            {/* Left Rail (Zone 3): Identity & Principles */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="absolute left-6 top-24 bottom-24 w-[340px] pointer-events-auto flex flex-col justify-end z-30 space-y-4"
            >
               <div 
                 className="bg-[#050812]/90 backdrop-blur-2xl border-l-[3px] shadow-[0_0_20px_rgba(0,0,0,0.8)] rounded-r-lg p-5 flex-1 flex flex-col"
                 style={{ borderColor: activeBlockData.color }}
               >
                 <div className="text-[10px] font-mono tracking-[0.2em] mb-4 uppercase flex items-center gap-2" style={{ color: activeBlockData.color }}>
                   <activeBlockData.icon className="w-3.5 h-3.5" /> SCIENTIFIC PRINCIPLES
                 </div>
                 
                 <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-4">
                   <p className="text-xs leading-relaxed text-[#EAF2FF]/80 font-light mb-6">
                     {activeBlockData.description}
                   </p>
                   
                   <div className="flex flex-col gap-2">
                     {activeBlockData.features.map(f => (
                       <div key={f} className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-sm">
                         <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeBlockData.color, boxShadow: `0 0 10px ${activeBlockData.color}` }} />
                         <span className="text-[10px] uppercase font-mono tracking-wider text-white/90">{f}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
            </motion.div>

            {/* Right Rail (Zone 4): Elements Table */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="absolute right-6 top-24 bottom-24 w-[400px] pointer-events-auto flex flex-col animate-fade-in-right z-40 pb-6"
            >
              <div 
                className="bg-[#040814]/85 backdrop-blur-3xl border shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-lg overflow-hidden flex flex-col flex-1 h-[80%] max-h-[85vh] p-5 custom-scrollbar select-none"
                style={{ borderColor: `${activeBlockData.color}40` }}
              >
                  <h3 className="text-[10px] font-mono uppercase tracking-widest mb-4 flex items-center justify-between" style={{ color: activeBlockData.color }}>
                    <span>ATOMIC REGISTRY</span>
                    <span className="text-white/20 font-sans tracking-normal">{activeBlockData.elements.length} / 118</span>
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 overflow-y-auto custom-scrollbar pr-2 pb-2 content-start">
                    {activeBlockData.elements.map(sym => {
                      const elData = ELEMENTS_DATA.find(e => e.symbol === sym);
                      if (!elData) return null;
                      return (
                        <button
                          key={sym}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectElement(elData);
                          }}
                          className="w-12 h-14 md:w-[3.25rem] md:h-[4rem] flex flex-col items-center justify-center border border-white/10 bg-[#0A0F1D] hover:bg-white/10 hover:scale-110 active:scale-95 transition-all outline-none rounded-sm cursor-pointer group relative overflow-hidden"
                        >
                           <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: activeBlockData.color }} />
                           <span className="text-[8px] font-mono text-white/40 group-hover:text-white/80 transition-colors uppercase select-none">{elData.number}</span>
                           <span className="font-sans font-black text-lg text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] select-none" style={{ color: activeBlockData.color }}>{sym}</span>
                        </button>
                      );
                    })}
                  </div>
              </div>
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>

    </div>
  );
});
