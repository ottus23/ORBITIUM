import React, { useState } from 'react';
import { ChemicalElement } from '../types';
import { Share2, Beaker, Atom, Eye, Network, Globe, Activity } from 'lucide-react';
import Markdown from 'react-markdown';
import { ElementExplorationDepth } from './ElementExplorationDepth';
import { CATEGORY_COLORS, ELEMENTS_DATA } from '../data';

interface ElementWorldUIProps {
  selectedElement: ChemicalElement;
  onSelectElement: (el: ChemicalElement | null) => void;
  onSelectCompareElement?: (el: ChemicalElement | null) => void;
  setCompareSelectorOpen: (open: boolean) => void;
  setActiveShellInfo: (info: any) => void;
  activeShellInfo: any;
}

export function ElementWorldUI({ selectedElement, onSelectElement, onSelectCompareElement, setCompareSelectorOpen, setActiveShellInfo, activeShellInfo }: ElementWorldUIProps) {
  const [activeConstellation, setActiveConstellation] = useState<string>('overview');

  const navNodes = [
    { id: 'overview', label: 'OVERVIEW', icon: Share2, layer: 1 },
    { id: 'structure', label: 'ATOMIC STRUCTURE', icon: Atom, layer: 2 },
    { id: 'physical', label: 'PHYSICAL PROPERTIES', icon: Eye, layer: 3 },
    { id: 'chemical', label: 'CHEMICAL BEHAVIOR', icon: Eye, layer: 4 },
    { id: 'cosmic', label: 'COSMIC ORIGIN', icon: Globe, layer: 6 },
    { id: 'biological', label: 'BIOLOGICAL ROLE', icon: Network, layer: 7 },
    { id: 'applications', label: 'APPLICATIONS', icon: Network, layer: 5 },
    { id: 'reaction', label: 'REACTION NETWORKS', icon: Activity, layer: 9 },
  ];

  const getCatMeta = (cat: string) => CATEGORY_COLORS[cat] || { label: 'Unknown', hex: '#FFFFFF' };
  
  const getActiveLayerMap = () => {
    const node = navNodes.find(n => n.id === activeConstellation);
    return node ? node.layer : 1;
  };

  const mapLayerToConstellation = (layer: number | ((prev: number) => number)) => {
    // If it's a function update, compute new layer:
    let nextLayer = typeof layer === 'function' ? layer(getActiveLayerMap()) : layer;
    const node = navNodes.find(n => n.layer === nextLayer);
    if (node) {
      setActiveConstellation(node.id);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none">
      {/* Immersive HUD framing */}
      <div className="absolute top-4 md:top-8 left-4 md:left-8 border-l-2 border-t-2 border-[var(--primary-color)]/30 w-8 md:w-16 h-8 md:h-16 opacity-50" />
      <div className="absolute top-4 md:top-8 right-4 md:right-8 border-r-2 border-t-2 border-[var(--primary-color)]/30 w-8 md:w-16 h-8 md:h-16 opacity-50" />
      <div className="absolute bottom-20 md:bottom-28 left-4 md:left-8 border-l-2 border-b-2 border-[var(--primary-color)]/30 w-8 md:w-16 h-8 md:h-16 opacity-50" />
      <div className="absolute bottom-20 md:bottom-28 right-4 md:right-8 border-r-2 border-b-2 border-[var(--primary-color)]/30 w-8 md:w-16 h-8 md:h-16 opacity-50" />

      {/* Hero Name / Core Identity */}
      <div className="absolute top-16 md:top-12 left-4 md:left-12 max-w-[280px] sm:max-w-sm md:max-w-lg pointer-events-auto animate-fade-in group">
        <div className="text-[9px] md:text-[10px] font-mono tracking-[0.3em] text-[var(--primary-color)] mb-1 uppercase bg-[var(--primary-color)]/10 inline-block px-2 py-1 md:px-3 md:py-1 border border-[var(--primary-color)]/20 shadow-[0_0_15px_var(--primary-color-alpha)]">
          {selectedElement.nameOrigin || 'ELEMENTAL MATRIX'}
        </div>
        <div className="flex items-baseline gap-2 md:gap-4 mt-1 md:mt-2">
          <h1 className="text-6xl md:text-8xl lg:text-[7rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 drop-shadow-[0_0_20px_var(--primary-color-alpha)]">
            {selectedElement.symbol}
          </h1>
          <h2 className="text-xl md:text-3xl lg:text-4xl font-black uppercase text-white tracking-[0.2em] truncate">
            {selectedElement.name}
          </h2>
        </div>
        <div className="text-[9px] md:text-[11px] font-mono text-white/60 tracking-widest mt-1 md:mt-2 px-1 flex flex-wrap gap-x-2 md:gap-x-3 gap-y-1">
          <span>ATOMIC MASS: <span className="text-white font-bold">{selectedElement.mass.toFixed(4)} u</span></span>
          <span className="hidden md:inline border-l border-white/20" />
          <span>Z: <span className="text-white font-bold">{selectedElement.number}</span></span>
          <span className="hidden md:inline border-l border-white/20" />
          <span>STATE: <span className="text-[var(--primary-color)] font-bold">{selectedElement.state}</span></span>
        </div>
        <p className="mt-2 md:mt-4 text-[10px] md:text-xs font-sans font-light leading-relaxed text-[#EAF2FF]/80 max-w-sm md:max-w-md pl-3 md:pl-4 border-l-2 border-[var(--primary-color)]/40 hover:border-[var(--primary-color)] hover:bg-[var(--primary-color)]/5 py-1 transition-colors line-clamp-3 md:line-clamp-none">
          {selectedElement.summary}
        </p>
      </div>

      {/* Floating Constellation Nodes (Navigation) */}
      <div className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 md:gap-6 pointer-events-auto z-40">
        <div className="h-20 md:h-40 w-[1px] bg-gradient-to-b from-transparent via-[var(--primary-color)]/30 to-transparent absolute left-3 top-[-10px] md:top-[-20px] -z-10" />
        <div className="h-20 md:h-40 w-[1px] bg-gradient-to-b from-transparent via-[var(--primary-color)]/30 to-transparent absolute left-3 bottom-[-10px] md:bottom-[-20px] -z-10" />
        
        {navNodes.map((node, i) => {
          const isActive = activeConstellation === node.id;
          const Icon = node.icon;
          return (
            <button
              key={node.id}
              onClick={() => setActiveConstellation(node.id)}
              className={`flex items-center gap-3 md:gap-4 group transition-all duration-300 ${isActive ? 'translate-x-1 md:translate-x-2' : 'hover:translate-x-1'}`}
            >
              <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full border flex items-center justify-center transition-all ${
                isActive 
                  ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/20 shadow-[0_0_15px_var(--primary-color-alpha)]' 
                  : 'border-white/20 bg-black/50 group-hover:border-[var(--primary-color)]/50 group-hover:bg-[var(--primary-color)]/10'
              }`}>
                <Icon className={`w-3 h-3 ${isActive ? 'text-[var(--primary-color)]' : 'text-white/50 group-hover:text-[var(--primary-color)]'}`} />
              </div>
              <span className={`text-[9px] md:text-[10px] font-mono tracking-[0.2em] uppercase font-bold transition-colors ${
                isActive ? 'text-white' : 'text-white/40 group-hover:text-white/80'
              }`}>
                {node.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Constellation Data Cluster */}
      <div className="absolute right-4 md:right-12 bottom-20 md:bottom-auto md:top-1/2 md:-translate-y-1/2 max-w-[280px] w-full sm:max-w-sm md:w-80 pointer-events-auto animate-fade-in-right z-50 bg-[#040814]/80 backdrop-blur-3xl border border-[var(--primary-color)]/20 p-6 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <ElementExplorationDepth 
          selectedElement={selectedElement}
          activeLayer={getActiveLayerMap()}
          setActiveLayer={mapLayerToConstellation as any}
          onSelectElement={onSelectElement}
          activeShellInfo={activeShellInfo}
          setActiveShellInfo={setActiveShellInfo}
          getCatMeta={getCatMeta}
          ELEMENTS_DATA={ELEMENTS_DATA}
        />
      </div>

      {/* Disconnect and action bar at the very bottom center */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-auto flex items-center gap-4">
        <button
          onClick={() => {
            onSelectElement(null);
            if (onSelectCompareElement) onSelectCompareElement(null);
            window.dispatchEvent(new CustomEvent('shell-probe-selected', { detail: { index: null } }));
          }}
          className="px-8 py-3 bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/30 hover:border-[var(--primary-color)] text-[10px] font-mono tracking-[0.2em] text-white font-bold uppercase transition-all rounded-sm shadow-[0_0_20px_var(--primary-color-alpha)] hover:shadow-[0_0_30px_var(--primary-color)] cursor-pointer"
        >
          OPEN COSMIC GRID ✖
        </button>
      </div>

    </div>
  );
}
