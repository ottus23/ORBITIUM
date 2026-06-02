/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import ThreeScene from './components/ThreeScene';
import HolographicUI from './components/HolographicUI';
import { ChemicalElement, TableLayoutMode, ReactionConfig } from './types';

export default function App() {
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null);
  const [compareElement, setCompareElement] = useState<ChemicalElement | null>(null);
  const [hoveredElement, setHoveredElement] = useState<ChemicalElement | null>(null);
  const [layoutMode, setLayoutMode] = useState<TableLayoutMode>('grid');
  
  // Custom Application Modes
  const [appMode, setAppMode] = useState<'observatory' | 'explorer' | 'bond_lab' | 'timeline' | 'molecular'>('explorer');
  const [timelineYear, setTimelineYear] = useState<number>(2026);
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string | null>('water');
  const [isExplodedView, setIsExplodedView] = useState<boolean>(false);
  
  // Wavefield Modulations Settings
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1.2);
  const [reactiveIntensity, setReactiveIntensity] = useState<number>(1.0);
  
  // Landing welcome state
  const [isObsEntered, setIsObsEntered] = useState<boolean>(false);
  
  // Action reactions config
  const [activeReaction, setActiveReaction] = useState<ReactionConfig | null>(null);

  // Adaptive Quality System
  const [adaptiveQuality, setAdaptiveQuality] = useState<boolean>(true);
  const [isLowPerfMode, setIsLowPerfMode] = useState<boolean>(false);
  const [currentFps, setCurrentFps] = useState<number>(60);

  useEffect(() => {
    const handleScaleCommand = (e: Event) => {
      const cx = e as CustomEvent;
      if (cx.detail && cx.detail.mode) {
        setAppMode(cx.detail.mode);
        if (cx.detail.mode !== 'explorer') {
           setSelectedElement(null);
           setCompareElement(null);
        }
        if (cx.detail.mode !== 'bond_lab') {
           setActiveReaction(null);
        }
      }
    };
    window.addEventListener('request-change-app-mode', handleScaleCommand);
    return () => window.removeEventListener('request-change-app-mode', handleScaleCommand);
  }, []);

  const handleEnterObs = () => {
    setIsObsEntered(true);
  };

  return (
    <div 
      id="orbitium-frame"
      className="relative w-screen h-screen bg-[#070B14] overflow-hidden select-none select-none flex flex-col items-stretch"
    >
      {/* 3D WebGL Canvas Layer */}
      <ThreeScene
        selectedElement={selectedElement}
        compareElement={compareElement}
        hoveredElement={hoveredElement}
        onSelectElement={setSelectedElement}
        onSelectCompareElement={setCompareElement}
        onHoverElement={setHoveredElement}
        layoutMode={layoutMode}
        appMode={appMode}
        timelineYear={timelineYear}
        selectedMoleculeId={selectedMoleculeId}
        isExplodedView={isExplodedView}
        simulationSpeed={simulationSpeed}
        reactiveIntensity={reactiveIntensity}
        isObsEntered={isObsEntered}
        activeReaction={activeReaction}
        adaptiveQualityEnabled={adaptiveQuality}
        onLowPerfModeChange={setIsLowPerfMode}
        onFpsChange={setCurrentFps}
      />

      {/* Holographic HUD UI Overlays */}
      <HolographicUI
        selectedElement={selectedElement}
        compareElement={compareElement}
        onSelectCompareElement={setCompareElement}
        hoveredElement={hoveredElement}
        onSelectElement={setSelectedElement}
        layoutMode={layoutMode}
        onChangeLayoutMode={setLayoutMode}
        appMode={appMode}
        onChangeAppMode={(mode) => {
          setAppMode(mode);
          // If switching model, perform cleanups
          if (mode !== 'explorer') {
            setSelectedElement(null);
            setCompareElement(null);
          }
          if (mode !== 'bond_lab') {
            setActiveReaction(null);
          }
        }}
        timelineYear={timelineYear}
        onChangeTimelineYear={setTimelineYear}
        selectedMoleculeId={selectedMoleculeId}
        onSelectMoleculeId={setSelectedMoleculeId}
        isExplodedView={isExplodedView}
        onSetExplodedView={setIsExplodedView}
        simulationSpeed={simulationSpeed}
        onSetSimulationSpeed={setSimulationSpeed}
        reactiveIntensity={reactiveIntensity}
        onSetReactiveIntensity={setReactiveIntensity}
        isObsEntered={isObsEntered}
        onEnterObs={handleEnterObs}
        activeReaction={activeReaction}
        onTriggerReaction={setActiveReaction}
        adaptiveQuality={adaptiveQuality}
        onChangeAdaptiveQuality={setAdaptiveQuality}
        isLowPerfMode={isLowPerfMode}
        currentFps={currentFps}
      />
    </div>
  );
}
