/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, Suspense, lazy } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import HolographicUI from './components/HolographicUI';
import { ChemicalElement, TableLayoutMode, ReactionConfig } from './types';
import { ELEMENTS_DATA } from './data';

// Lazy load the heavy 3D WebGL scene to improve initial main bundle parse times
const ThreeScene = lazy(() => import('./components/ThreeScene'));

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null);
  const [compareElement, setCompareElement] = useState<ChemicalElement | null>(null);
  const [hoveredElement, setHoveredElement] = useState<ChemicalElement | null>(null);
  const [layoutMode, setLayoutMode] = useState<TableLayoutMode>('grid');
  
  // Custom Application Modes
  const [appMode, setAppMode] = useState<'observatory' | 'explorer' | 'bond_lab' | 'timeline' | 'molecular' | 'blocks' | 'network'>('explorer');
  const [timelineYear, setTimelineYear] = useState<number>(2026);
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string | null>('water');
  const [isExplodedView, setIsExplodedView] = useState<boolean>(false);
  
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1.2);
  const [reactiveIntensity, setReactiveIntensity] = useState<number>(1.0);
  const [isObsEntered, setIsObsEntered] = useState<boolean>(true);
  const [activeReaction, setActiveReaction] = useState<ReactionConfig | null>(null);
  const [adaptiveQuality, setAdaptiveQuality] = useState<boolean>(true);
  const [isLowPerfMode, setIsLowPerfMode] = useState<boolean>(false);
  const [currentFps, setCurrentFps] = useState<number>(60);
  const [showOrbitals, setShowOrbitals] = useState<boolean>(false);

  // Sync React Router URL -> App State
  useEffect(() => {
    setShowOrbitals(false); // Reset orbital visualization state when changing elements
    const path = location.pathname;
    if (path.startsWith('/element/')) {
      const sym = path.split('/')[2];
      const el = ELEMENTS_DATA.find(e => e.symbol.toLowerCase() === sym.toLowerCase());
      if (el) {
        setAppMode('explorer');
        setSelectedElement(el);
      }
    } else if (path === '/') {
      setAppMode('explorer');
      setSelectedElement(null);
    } else if (path === '/explorer' || path === '/observatory') {
      setAppMode('observatory');
      setSelectedElement(null);
    } else if (path === '/timeline') {
      setAppMode('timeline');
      setSelectedElement(null);
    } else if (path === '/blocks') {
      setAppMode('blocks');
      setSelectedElement(null);
    } else if (path === '/network') {
      setAppMode('network');
      setSelectedElement(null);
    } else if (path === '/bond-lab') {
      setAppMode('bond_lab');
      setSelectedElement(null);
    } else {
      setAppMode('explorer');
      if (!path.startsWith('/element/')) {
        setSelectedElement(null);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleScaleCommand = (e: Event) => {
      const cx = e as CustomEvent;
      if (cx.detail && cx.detail.mode) {
        if (cx.detail.mode === 'observatory') navigate('/explorer');
        else if (cx.detail.mode === 'explorer') navigate('/');
        else if (cx.detail.mode === 'bond_lab') navigate('/bond-lab');
        else navigate('/' + cx.detail.mode);
      }
    };
    window.addEventListener('request-change-app-mode', handleScaleCommand);
    return () => window.removeEventListener('request-change-app-mode', handleScaleCommand);
  }, [navigate]);

  const handleSelectElement = (el: ChemicalElement | null) => {
    if (el) navigate(`/element/${el.symbol.toLowerCase()}`);
    else navigate('/');
  };

  const handleChangeAppMode = (mode: 'observatory' | 'explorer' | 'bond_lab' | 'timeline' | 'molecular' | 'blocks' | 'network') => {
    if (mode === 'explorer') navigate('/');
    else if (mode === 'observatory') navigate('/explorer');
    else if (mode === 'bond_lab') navigate('/bond-lab');
    else navigate('/' + mode);
  };

  return (
    <div 
      id="orbitium-frame"
      className="relative w-screen h-screen bg-[#070B14] overflow-hidden select-none flex flex-col items-stretch"
    >
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-[#070B14]"><div className="text-[#00E5FF] font-mono tracking-widest text-sm animate-pulse">BOOTING QUANTUM RENDER CORE...</div></div>}>
        <ThreeScene
          selectedElement={selectedElement}
          compareElement={compareElement}
          hoveredElement={hoveredElement}
          onSelectElement={handleSelectElement}
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
          showOrbitals={showOrbitals}
          onToggleOrbitals={setShowOrbitals}
        />
      </Suspense>

      <HolographicUI
        selectedElement={selectedElement}
        compareElement={compareElement}
        onSelectCompareElement={setCompareElement}
        hoveredElement={hoveredElement}
        onSelectElement={handleSelectElement}
        layoutMode={layoutMode}
        onChangeLayoutMode={setLayoutMode}
        appMode={appMode}
        onChangeAppMode={handleChangeAppMode}
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
        onEnterObs={() => setIsObsEntered(true)}
        activeReaction={activeReaction}
        onTriggerReaction={setActiveReaction}
        adaptiveQuality={adaptiveQuality}
        onChangeAdaptiveQuality={setAdaptiveQuality}
        isLowPerfMode={isLowPerfMode}
        currentFps={currentFps}
        showOrbitals={showOrbitals}
        onToggleOrbitals={setShowOrbitals}
      />
    </div>
  );
}
