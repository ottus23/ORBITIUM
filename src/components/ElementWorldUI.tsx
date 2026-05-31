import React, { useState } from 'react';
import { ChemicalElement } from '../types';
import { Share2, Beaker, Atom, Eye, Network } from 'lucide-react';
import Markdown from 'react-markdown';

interface ElementWorldUIProps {
  selectedElement: ChemicalElement;
  onSelectElement: (el: ChemicalElement | null) => void;
  onSelectCompareElement?: (el: ChemicalElement | null) => void;
  setCompareSelectorOpen: (open: boolean) => void;
  setActiveShellInfo: (info: any) => void;
  activeShellInfo: any;
}

export function ElementWorldUI({ selectedElement, onSelectElement, onSelectCompareElement, setCompareSelectorOpen, setActiveShellInfo, activeShellInfo }: ElementWorldUIProps) {
  const [activeConstellation, setActiveConstellation] = useState<string>('origin');

  const navNodes = [
    { id: 'origin', label: 'COSMIC ORIGIN', icon: Share2 },
    { id: 'structure', label: 'ATOMIC ARCHITECTURE', icon: Atom },
    { id: 'behavior', label: 'THERMODYNAMIC BEHAVIOR', icon: Eye },
    { id: 'applications', label: 'CIVILIZATION & TECH', icon: Network },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none">
      {/* Immersive HUD framing */}
      <div className="absolute top-8 left-8 border-l-2 border-t-2 border-[var(--primary-color)]/30 w-16 h-16 opacity-50" />
      <div className="absolute top-8 right-8 border-r-2 border-t-2 border-[var(--primary-color)]/30 w-16 h-16 opacity-50" />
      <div className="absolute bottom-28 left-8 border-l-2 border-b-2 border-[var(--primary-color)]/30 w-16 h-16 opacity-50" />
      <div className="absolute bottom-28 right-8 border-r-2 border-b-2 border-[var(--primary-color)]/30 w-16 h-16 opacity-50" />

      {/* Hero Name / Core Identity */}
      <div className="absolute top-12 left-12 max-w-lg pointer-events-auto animate-fade-in group">
        <div className="text-[10px] font-mono tracking-[0.3em] text-[var(--primary-color)] mb-1 uppercase bg-[var(--primary-color)]/10 inline-block px-3 py-1 border border-[var(--primary-color)]/20 shadow-[0_0_15px_var(--primary-color-alpha)]">
          {selectedElement.nameOrigin || 'ELEMENTAL MATRIX'}
        </div>
        <div className="flex items-baseline gap-4 mt-2">
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 drop-shadow-[0_0_20px_var(--primary-color-alpha)]">
            {selectedElement.symbol}
          </h1>
          <h2 className="text-3xl font-black uppercase text-white tracking-[0.2em]">
            {selectedElement.name}
          </h2>
        </div>
        <div className="text-[11px] font-mono text-white/60 tracking-widest mt-2 px-1">
          ATOMIC MASS: <span className="text-white font-bold">{selectedElement.mass.toFixed(4)} u</span>
          <span className="mx-3 border-l border-white/20" />
          Z: <span className="text-white font-bold">{selectedElement.number}</span>
          <span className="mx-3 border-l border-white/20" />
          STATE: <span className="text-[var(--primary-color)] font-bold">{selectedElement.state}</span>
        </div>
        <p className="mt-4 text-xs font-sans font-light leading-relaxed text-[#EAF2FF]/80 max-w-md pl-4 border-l-2 border-[var(--primary-color)]/40 hover:border-[var(--primary-color)] hover:bg-[var(--primary-color)]/5 py-1 transition-colors">
          {selectedElement.summary}
        </p>
      </div>

      {/* Floating Constellation Nodes (Navigation) */}
      <div className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-col gap-6 pointer-events-auto">
        <div className="h-40 w-[1px] bg-gradient-to-b from-transparent via-[var(--primary-color)]/30 to-transparent absolute left-3 top-[-20px] -z-10" />
        <div className="h-40 w-[1px] bg-gradient-to-b from-transparent via-[var(--primary-color)]/30 to-transparent absolute left-3 bottom-[-20px] -z-10" />
        
        {navNodes.map((node, i) => {
          const isActive = activeConstellation === node.id;
          const Icon = node.icon;
          return (
            <button
              key={node.id}
              onClick={() => setActiveConstellation(node.id)}
              className={`flex items-center gap-4 group transition-all duration-300 ${isActive ? 'translate-x-2' : 'hover:translate-x-1'}`}
            >
              <div className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                isActive 
                  ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/20 shadow-[0_0_15px_var(--primary-color-alpha)]' 
                  : 'border-white/20 bg-black/50 group-hover:border-[var(--primary-color)]/50 group-hover:bg-[var(--primary-color)]/10'
              }`}>
                <Icon className={`w-3 h-3 ${isActive ? 'text-[var(--primary-color)]' : 'text-white/50 group-hover:text-[var(--primary-color)]'}`} />
              </div>
              <span className={`text-[10px] font-mono tracking-[0.2em] uppercase font-bold transition-colors ${
                isActive ? 'text-white' : 'text-white/40 group-hover:text-white/80'
              }`}>
                {node.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Constellation Data Cluster */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 max-w-sm pointer-events-auto w-80 animate-fade-in-right">
        {activeConstellation === 'origin' && (
          <div className="bg-[#040814]/80 backdrop-blur-3xl border border-[var(--primary-color)]/20 p-6 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <h3 className="text-[9px] font-mono tracking-widest text-[#FF9100] uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#FF9100] rounded-full animate-pulse" />
              Cosmic & Historical
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-white/50 font-mono tracking-widest mb-1">STELLAR ORIGIN</div>
                <div className="text-sm font-light text-white leading-relaxed">{selectedElement.cosmicProperties?.stellarOrigin || selectedElement.cosmicRelevance || 'Unknown'}</div>
              </div>
              <div className="w-full h-[1px] bg-gradient-to-r from-[var(--primary-color)]/30 to-transparent" />
              <div>
                <div className="text-[10px] text-white/50 font-mono tracking-widest mb-1">DISCOVERY</div>
                <div className="text-sm font-light text-white leading-relaxed">{selectedElement.year} by <span className="font-bold text-[var(--primary-color)]">{selectedElement.discoveredBy}</span></div>
              </div>
            </div>
          </div>
        )}

        {activeConstellation === 'structure' && (
          <div className="bg-[#040814]/80 backdrop-blur-3xl border border-[var(--primary-color)]/20 p-6 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <h3 className="text-[9px] font-mono tracking-widest text-[#00E5FF] uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#00E5FF] rounded-full animate-pulse" />
              Atomic Framework
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="border border-white/5 bg-white/5 p-3 rounded-sm">
                <div className="text-[8px] font-mono text-[#00E5FF]/70 tracking-widest mb-1 uppercase">Electrons</div>
                <div className="text-xl font-black text-white font-mono">{selectedElement.electrons}</div>
              </div>
              <div className="border border-[var(--primary-color)]/10 bg-[var(--primary-color)]/5 p-3 rounded-sm">
                <div className="text-[8px] font-mono text-[var(--primary-color)]/70 tracking-widest mb-1 uppercase">Subshells</div>
                <div className="text-sm font-black text-[var(--primary-color)] font-mono truncate">{selectedElement.electronConfig}</div>
              </div>
            </div>

            <div className="text-[9px] font-mono text-white/50 tracking-widest mb-2 mt-4 uppercase">Valence Shell Excitation</div>
            <div className="flex gap-1.5 items-center font-mono font-bold mb-4">
              {selectedElement.shells.map((eCount: number, idx: number) => {
                const shellLabel = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'][idx] || `S${idx + 1}`;
                const isHighlighted = activeShellInfo !== null && activeShellInfo.shellIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      const shellInfoObj = {
                        shellIndex: idx,
                        shellName: shellLabel,
                        electrons: eCount,
                        radius: (idx + 1) * 2.8
                      };
                      setActiveShellInfo(shellInfoObj);
                      window.dispatchEvent(new CustomEvent('shell-probe-selected', { detail: { index: idx } }));
                    }}
                    className={`flex-1 p-2 rounded-sm border text-center transition-all cursor-pointer ${
                      isHighlighted
                        ? 'bg-[var(--primary-color)]/20 border-[var(--primary-color)]/50 shadow-[0_0_10px_var(--primary-color-alpha)]'
                        : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-white/5'
                    }`}
                  >
                    <div className="text-[7px] text-white/40 mb-0.5">{shellLabel}</div>
                    <div className="text-[10px] text-white">{eCount}</div>
                  </button>
                );
              })}
            </div>
            {activeShellInfo && (
              <div className="text-[9px] font-mono text-[var(--primary-color)] tracking-widest text-center border-t border-[var(--primary-color)]/20 pt-2">
                PROBE ACTIVE: {activeShellInfo.electrons}e⁻ IN VIRTUAL ORBIT
              </div>
            )}
          </div>
        )}

        {activeConstellation === 'behavior' && (
          <div className="bg-[#040814]/80 backdrop-blur-3xl border border-[var(--primary-color)]/20 p-6 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <h3 className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Reactivity & State
            </h3>
            
            <p className="text-xs text-[#EAF2FF]/80 leading-relaxed font-light mb-4">
              {selectedElement.chemicalProperties?.reactivityProfile || selectedElement.reactivity || 'A stable structural component of the universe.'}
            </p>
            
            <div className="space-y-3 font-mono text-[9px] border-t border-white/10 pt-4">
              <div className="flex justify-between items-center bg-white/5 p-2 rounded-sm">
                <span className="text-white/50 tracking-widest uppercase">Melt Point</span>
                <span className="text-white font-bold">{selectedElement.meltingPoint} {selectedElement.meltingPoint !== 'N/A' && 'K'}</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-2 rounded-sm">
                <span className="text-white/50 tracking-widest uppercase">Boil Point</span>
                <span className="text-emerald-400 font-bold">{selectedElement.boilingPoint} {selectedElement.boilingPoint !== 'N/A' && 'K'}</span>
              </div>
              <div className="flex justify-between items-center bg-[var(--primary-color)]/5 p-2 rounded-sm border border-[var(--primary-color)]/10">
                <span className="text-[var(--primary-color)]/70 tracking-widest uppercase">Pauling Rating</span>
                <span className="text-[var(--primary-color)] font-bold">{selectedElement.electronegativity || '0.00'}</span>
              </div>
            </div>
          </div>
        )}

        {activeConstellation === 'applications' && (
          <div className="bg-[#040814]/80 backdrop-blur-3xl border border-[var(--primary-color)]/20 p-6 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <h3 className="text-[9px] font-mono tracking-widest text-[#FF1744] uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#FF1744] rounded-full animate-pulse" />
              Technology & Biology
            </h3>
            
            <div className="space-y-4">
              {selectedElement.biologicalProperties?.biologicalImportance && (
                <div className="bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-sm">
                  <div className="text-[8px] font-mono text-emerald-400 tracking-widest mb-1.5 uppercase">Biological Role</div>
                  <div className="text-xs text-white/80 font-light leading-relaxed">
                    {selectedElement.biologicalProperties.biologicalImportance}
                  </div>
                </div>
              )}
              
              <div className="bg-white/5 border border-white/10 p-3 rounded-sm">
                <div className="text-[8px] font-mono text-[var(--primary-color)] tracking-widest mb-1.5 uppercase">Industrial Nexus</div>
                <ul className="space-y-1.5">
                  {[
                    { key: 'Electronics', val: selectedElement.industrialApplications?.semiconductors || selectedElement.industrialApplications?.electronics },
                    { key: 'Energy & Space', val: selectedElement.industrialApplications?.nuclearEnergy || selectedElement.industrialApplications?.spaceTechnology }
                  ].map((app, idx) => app.val ? (
                    <li key={idx} className="text-[10px] font-sans font-light text-white/70 flex gap-2">
                       <span className="text-[var(--primary-color)] font-mono">▸</span>
                       {app.val}
                    </li>
                  ) : null)}
                </ul>
              </div>
            </div>
          </div>
        )}
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
