import React, { useState } from 'react';
import { ChemicalElement } from '../types';
import { Share2, Beaker, Atom, Eye, Network, Globe, Activity } from 'lucide-react';
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

export const ElementWorldUI = React.memo(function ElementWorldUI({ selectedElement, onSelectElement, onSelectCompareElement, setCompareSelectorOpen, setActiveShellInfo, activeShellInfo }: ElementWorldUIProps) {
  const [activeConstellation, setActiveConstellation] = useState<string>('properties');

  const navNodes = [
    { id: 'properties', label: 'PROPERTIES', icon: Eye, layer: 3 },
    { id: 'reactivity', label: 'REACTIVITY', icon: Activity, layer: 9 },
    { id: 'applications', label: 'APPLICATIONS', icon: Network, layer: 5 },
    { id: 'deep_dive', label: 'DEEP DIVE', icon: Globe, layer: 11 },
  ];

  const getCatMeta = (cat: string) => CATEGORY_COLORS[cat] || { label: 'Unknown', hex: '#FFFFFF' };
  const catColor = getCatMeta(selectedElement.category).hex;
  
  const getActiveLayerMap = () => {
    const node = navNodes.find(n => n.id === activeConstellation);
    return node ? node.layer : 1;
  };

  const mapLayerToConstellation = (layer: number | ((prev: number) => number)) => {
    let nextLayer = typeof layer === 'function' ? layer(getActiveLayerMap()) : layer;
    const node = navNodes.find(n => n.layer === nextLayer);
    if (node) setActiveConstellation(node.id);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none flex justify-between p-6">
      
      {/* ZONE 3: CONTEXT PANEL (LEFT) */}
      <div className="pointer-events-auto h-full flex flex-col w-[340px] gap-6 animate-fade-in">
        <div className="bg-[#050812]/90 backdrop-blur-2xl border-l-[3px] border-[var(--primary-color)] p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)] rounded-r-lg">
          <div className="text-[10px] font-mono tracking-[0.3em] text-[var(--primary-color)] mb-1 uppercase">
            {selectedElement.nameOrigin || 'ELEMENTAL MATRIX'}
          </div>
          
          <div className="flex items-baseline gap-4 mt-2 mb-4">
            <h1 className="text-7xl leading-none font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              {selectedElement.symbol}
            </h1>
            <h2 className="text-3xl font-black uppercase text-white tracking-[0.2em] truncate">
              {selectedElement.name}
            </h2>
          </div>

          <div className="flex flex-col gap-2 font-mono text-[11px] text-white/50 tracking-widest mt-2 border-t border-white/10 pt-4">
            <div className="flex justify-between items-center">
              <span>ATOMIC MASS</span>
              <span className="text-white font-bold">{selectedElement.mass.toFixed(4)} u</span>
            </div>
            <div className="flex justify-between items-center">
              <span>ATOMIC NUMBER</span>
              <span className="text-white font-bold">{selectedElement.number}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>CATEGORY</span>
              <span className="text-[var(--primary-color)] font-bold uppercase">{selectedElement.category.replace('-', ' ')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>STATE AT STP</span>
              <span className="text-white font-bold uppercase">{selectedElement.state}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>LOCATION</span>
              <span className="text-white font-bold uppercase">GROUP {selectedElement.group} / PERIOD {selectedElement.period}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ZONE 4: KNOWLEDGE PANEL (RIGHT) */}
      <div className="pointer-events-auto h-full w-[480px] flex flex-col justify-start pb-6 animate-fade-in-right">
        <div className="bg-[#040814]/85 backdrop-blur-3xl border border-[var(--primary-color)]/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-lg overflow-hidden flex flex-col flex-1 h-[80%] max-h-[85vh]">
          
          {/* TABS HEADER */}
          <div className="flex overflow-x-auto scrollbar-none border-b border-white/10 bg-black/40 px-2 pt-2">
            {navNodes.map((node) => {
              const isActive = activeConstellation === node.id;
              const Icon = node.icon;
              return (
                <button
                  key={node.id}
                  onClick={() => setActiveConstellation(node.id)}
                  className={`flex flex-col items-center gap-1.5 px-4 py-3 min-w-max border-b-2 transition-all ${
                    isActive 
                      ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/10 text-white' 
                      : 'border-transparent text-white/40 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--primary-color)]' : ''}`} />
                  <span className="text-[9px] font-mono tracking-widest uppercase font-bold">{node.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT (ElementExplorationDepth) */}
          <div className="flex-1 relative overflow-hidden">
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
        </div>
      </div>
      
    </div>
  );
});
