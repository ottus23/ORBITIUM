/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChemicalElement, TableLayoutMode, ReactionConfig } from '../types';
import { ELEMENTS_DATA, CATEGORY_COLORS } from '../data';
import { buildProceduralAtomWorld } from '../utils/atomWorldGenerator';

interface ThreeSceneProps {
  selectedElement: ChemicalElement | null;
  hoveredElement: ChemicalElement | null;
  onSelectElement: (element: ChemicalElement | null) => void;
  onHoverElement: (element: ChemicalElement | null) => void;
  layoutMode: TableLayoutMode;
  appMode: 'explorer' | 'bond_lab' | 'timeline';
  timelineYear: number;
  simulationSpeed: number;
  reactiveIntensity: number;
  isObsEntered: boolean;
  activeReaction: ReactionConfig | null;
  adaptiveQualityEnabled: boolean;
  onLowPerfModeChange: (isLow: boolean) => void;
  onFpsChange: (fps: number) => void;
}

const BOND_ENERGIES: Record<string, { value: number; unit: string; color: string; maxLimit: number }> = {
  'NaCl': { value: 787, unit: 'kJ/mol', color: '#D500F9', maxLimit: 2000 },      // Ionic, purple/pink
  'H₂O': { value: 926, unit: 'kJ/mol', color: '#00E5FF', maxLimit: 2000 },       // Covalent, cyan
  'CsOH + H₂': { value: 1120, unit: 'kJ/mol', color: '#FF3D00', maxLimit: 2000 }, // Explosive, orange-red
  'CO₂': { value: 1616, unit: 'kJ/mol', color: '#FFD700', maxLimit: 2000 },      // Double covalent, yellow-gold
  'Fe₂O₃': { value: 480, unit: 'kJ/mol', color: '#FF9100', maxLimit: 2000 },      // Slow ionic, bronze/rust
};

export default function ThreeScene({
  selectedElement,
  hoveredElement,
  onSelectElement,
  onHoverElement,
  layoutMode,
  appMode,
  timelineYear,
  simulationSpeed,
  reactiveIntensity,
  isObsEntered,
  activeReaction,
  adaptiveQualityEnabled,
  onLowPerfModeChange,
  onFpsChange,
}: ThreeSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Keep values in ref to avoid re-triggering useEffect and tearing down the scene
  const propsRef = useRef({
    selectedElement,
    hoveredElement,
    layoutMode,
    appMode,
    timelineYear,
    simulationSpeed,
    reactiveIntensity,
    isObsEntered,
    activeReaction,
    adaptiveQualityEnabled,
    onLowPerfModeChange,
    onFpsChange,
  });

  useEffect(() => {
    propsRef.current = {
      selectedElement,
      hoveredElement,
      layoutMode,
      appMode,
      timelineYear,
      simulationSpeed,
      reactiveIntensity,
      isObsEntered,
      activeReaction,
      adaptiveQualityEnabled,
      onLowPerfModeChange,
      onFpsChange,
    };
  }, [
    selectedElement,
    hoveredElement,
    layoutMode,
    appMode,
    timelineYear,
    simulationSpeed,
    reactiveIntensity,
    isObsEntered,
    activeReaction,
    adaptiveQualityEnabled,
    onLowPerfModeChange,
    onFpsChange,
  ]);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // --- 1. CREATING THE SCENE, CAMERA, RENDERER ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#070B14', 0.015);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 45); // Initial epic camera spot

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // --- 2. LIGHTS & ATMOSPHERIC GLOW ---
    const ambientLight = new THREE.AmbientLight('#0B1020', 1.8);
    scene.add(ambientLight);

    const blueDirLight = new THREE.DirectionalLight('#00E5FF', 2.5);
    blueDirLight.position.set(-15, 20, 15);
    scene.add(blueDirLight);

    const purpleDirLight = new THREE.DirectionalLight('#7C4DFF', 1.8);
    purpleDirLight.position.set(15, -15, 10);
    scene.add(purpleDirLight);

    // Cosmic spot light focused on center with fine angle
    const spotLight = new THREE.SpotLight('#EAF2FF', 5.0, 120, Math.PI / 3.5, 0.6, 1.0);
    spotLight.position.set(0, 25, 25);
    scene.add(spotLight);

    // --- 3. SPACE PARTICLES / COSMIC BACKGROUND DUST (Performance Optimized Counts) ---
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 400 : 1500;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const baseDustPositions = new Float32Array(particleCount * 3); // To allow physical disturbance return state

    const dustColors = [
      new THREE.Color('#00E5FF'),
      new THREE.Color('#7C4DFF'),
      new THREE.Color('#00FFB3'),
      new THREE.Color('#FFFFFF'),
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      baseDustPositions[i * 3] = positions[i * 3];
      baseDustPositions[i * 3 + 1] = positions[i * 3 + 1];
      baseDustPositions[i * 3 + 2] = positions[i * 3 + 2];

      const color = dustColors[Math.floor(Math.random() * dustColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      speeds[i] = 0.05 + Math.random() * 0.15;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleTexture = createCircularParticleTexture();
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.35,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const spaceDust = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(spaceDust);

    // --- 3B. ATMOSPHERIC PLASMA FIELD (FOREGROUND NEBULA ECOSYSTEM) (Performance Optimized Counts) ---
    const plasmaCount = isMobile ? 80 : 250;
    const plasmaGeometry = new THREE.BufferGeometry();
    const plasmaPositions = new Float32Array(plasmaCount * 3);
    const plasmaColors = new Float32Array(plasmaCount * 3);
    const plasmaSpeeds = new Float32Array(plasmaCount);
    const basePlasmaPositions = new Float32Array(plasmaCount * 3);

    const plasmaColorsList = [
      new THREE.Color('#FF007F'), // Hot quantum magenta
      new THREE.Color('#00FFB3'), // Emerald core
      new THREE.Color('#00E5FF'), // Celestial cyan
      new THREE.Color('#7C4DFF'), // Electrifying violet
    ];

    for (let i = 0; i < plasmaCount; i++) {
      plasmaPositions[i * 3] = (Math.random() - 0.5) * 75;
      plasmaPositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      plasmaPositions[i * 3 + 2] = (Math.random() - 0.5) * 45; // Foreground presence

      basePlasmaPositions[i * 3] = plasmaPositions[i * 3];
      basePlasmaPositions[i * 3 + 1] = plasmaPositions[i * 3 + 1];
      basePlasmaPositions[i * 3 + 2] = plasmaPositions[i * 3 + 2];

      const color = plasmaColorsList[Math.floor(Math.random() * plasmaColorsList.length)];
      plasmaColors[i * 3] = color.r;
      plasmaColors[i * 3 + 1] = color.g;
      plasmaColors[i * 3 + 2] = color.b;

      plasmaSpeeds[i] = 0.02 + Math.random() * 0.06;
    }

    plasmaGeometry.setAttribute('position', new THREE.BufferAttribute(plasmaPositions, 3));
    plasmaGeometry.setAttribute('color', new THREE.BufferAttribute(plasmaColors, 3));

    const plasmaTexture = createCircularParticleTexture();
    const plasmaMaterial = new THREE.PointsMaterial({
      size: 1.25,
      map: plasmaTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const atmosphericPlasma = new THREE.Points(plasmaGeometry, plasmaMaterial);
    scene.add(atmosphericPlasma);

    // --- 3B-1B. GIANT ROTATING SCIENTIFIC OBSERVATORY DESIGNATION SHELLS (Distant Structures) ---
    const bgObservationGroup = new THREE.Group();
    bgObservationGroup.position.set(0, 0, -45);
    scene.add(bgObservationGroup);

    const bgRingGeom1 = new THREE.RingGeometry(80, 80.4, 64);
    const bgRingMat1 = new THREE.MeshBasicMaterial({
      color: '#00E5FF',
      transparent: true,
      opacity: 0.05,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const bgRing1 = new THREE.Mesh(bgRingGeom1, bgRingMat1);
    bgRing1.rotation.x = Math.PI / 2;
    bgObservationGroup.add(bgRing1);

    const bgRingGeom2 = new THREE.RingGeometry(90, 90.5, 64);
    const bgRingMat2 = new THREE.MeshBasicMaterial({
      color: '#7C4DFF',
      transparent: true,
      opacity: 0.04,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const bgRing2 = new THREE.Mesh(bgRingGeom2, bgRingMat2);
    bgRing2.rotation.y = Math.PI / 3;
    bgObservationGroup.add(bgRing2);

    const bgStructureGeom = new THREE.IcosahedronGeometry(72, 1);
    const bgStructureMat = new THREE.MeshBasicMaterial({
      color: '#00FFB3',
      wireframe: true,
      transparent: true,
      opacity: 0.02,
      blending: THREE.AdditiveBlending
    });
    const bgStructure = new THREE.Mesh(bgStructureGeom, bgStructureMat);
    bgObservationGroup.add(bgStructure);

    // --- 3B-2. DEEP SPACE CONSTELLATION MAP (FAR BACKGROUND NEBULA LAB) ---
    const farStarCount = 180;
    const farStarGeometry = new THREE.BufferGeometry();
    const farStarPositions = new Float32Array(farStarCount * 3);
    const farStarBasePos = new Float32Array(farStarCount * 3);
    
    for (let i = 0; i < farStarCount; i++) {
      // Distribute stars in a huge, far sphere shell
      const r = 130 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = -90 - Math.random() * 110; // pushed deep in the distance
      
      farStarPositions[i * 3] = x;
      farStarPositions[i * 3 + 1] = y;
      farStarPositions[i * 3 + 2] = z;
      
      farStarBasePos[i * 3] = x;
      farStarBasePos[i * 3 + 1] = y;
      farStarBasePos[i * 3 + 2] = z;
    }
    
    farStarGeometry.setAttribute('position', new THREE.BufferAttribute(farStarPositions, 3));
    const farStarMat = new THREE.PointsMaterial({
      size: 1.1,
      color: '#7C4DFF',
      map: createCircularParticleTexture(),
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const deepConstellation = new THREE.Points(farStarGeometry, farStarMat);
    scene.add(deepConstellation);

    // --- 3C. INTERACTIVE COSMIC GRID FILAMENTS (Periodic Connections) ---
    const periodicConnections: [number, number][] = [];
    ELEMENTS_DATA.forEach((el, index) => {
      // Periodic neighbors
      const nextInPeriod = ELEMENTS_DATA.findIndex(other => other.number === el.number + 1 && other.period === el.period);
      if (nextInPeriod !== -1) {
        periodicConnections.push([index, nextInPeriod]);
      }
      // Group neighbors
      const nextInGroup = ELEMENTS_DATA.findIndex(other => other.group === el.group && other.period === el.period + 1);
      if (nextInGroup !== -1) {
        periodicConnections.push([index, nextInGroup]);
      }
    });

    const networkGeom = new THREE.BufferGeometry();
    const networkPos = new Float32Array(periodicConnections.length * 2 * 3);
    networkGeom.setAttribute('position', new THREE.BufferAttribute(networkPos, 3));

    // Dynamic Energy Links: Set up vertex colors gradient representing scientific category connections
    const networkColors = new Float32Array(periodicConnections.length * 2 * 3);
    periodicConnections.forEach(([fromIdx, toIdx], cIdx) => {
      const elA = ELEMENTS_DATA[fromIdx];
      const elB = ELEMENTS_DATA[toIdx];
      
      const configA = CATEGORY_COLORS[elA.category] || { hex: '#00E5FF' };
      const configB = CATEGORY_COLORS[elB.category] || { hex: '#D500F9' };
      
      const colA = new THREE.Color(configA.hex);
      const colB = new THREE.Color(configB.hex);
      
      const iEdge = cIdx * 6;
      networkColors[iEdge] = colA.r;
      networkColors[iEdge + 1] = colA.g;
      networkColors[iEdge + 2] = colA.b;
      
      networkColors[iEdge + 3] = colB.r;
      networkColors[iEdge + 4] = colB.g;
      networkColors[iEdge + 5] = colB.b;
    });
    networkGeom.setAttribute('color', new THREE.BufferAttribute(networkColors, 3));

    const networkMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending
    });
    const networkLines = new THREE.LineSegments(networkGeom, networkMat);
    scene.add(networkLines);

    const hoverNetworkGeom = new THREE.BufferGeometry();
    const hoverNetworkPos = new Float32Array(32 * 2 * 3); // Max 32 connections highlight
    hoverNetworkGeom.setAttribute('position', new THREE.BufferAttribute(hoverNetworkPos, 3));
    const hoverNetworkMat = new THREE.LineBasicMaterial({
      color: '#FFFFFF',
      transparent: true,
      opacity: 0.0,
      linewidth: 3,
      blending: THREE.AdditiveBlending
    });
    const hoverNetworkLines = new THREE.LineSegments(hoverNetworkGeom, hoverNetworkMat);
    scene.add(hoverNetworkLines);

    // --- 3D SCIENTIFIC SECTORS SYSTEM ---
    const sectorsGroup = new THREE.Group();
    scene.add(sectorsGroup);

    // CanvasTexture label generator for billboarding labels
    function createSectorLabelSprite(name: string, subtitle: string, colorHex: string): THREE.Sprite {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(7, 11, 20, 0.45)';
        ctx.fillRect(0, 0, 512, 128);
        
        ctx.strokeStyle = colorHex;
        ctx.lineWidth = 3;
        ctx.strokeRect(6, 6, 500, 116);
        
        ctx.fillStyle = colorHex;
        ctx.fillRect(6, 6, 24, 4);
        ctx.fillRect(6, 6, 4, 24);
        ctx.fillRect(482, 6, 24, 4);
        ctx.fillRect(502, 6, 4, 24);
        ctx.fillRect(6, 118, 24, 4);
        ctx.fillRect(6, 98, 4, 24);
        ctx.fillRect(482, 118, 24, 4);
        ctx.fillRect(502, 98, 4, 24);
        
        ctx.fillRect(20, 64, 18, 2);
        ctx.fillRect(28, 55, 2, 20);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px monospace';
        ctx.fillText(name, 56, 50);
        
        ctx.fillStyle = 'rgba(234, 242, 255, 0.65)';
        ctx.font = '12.5px monospace';
        ctx.fillText(subtitle.toUpperCase(), 56, 85);
      }
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(7.5, 1.875, 1);
      return sprite;
    }

    interface SpatialSectorDef {
      name: string;
      desc: string;
      color: string;
      pos: THREE.Vector3;
      geom: THREE.BufferGeometry;
    }

    const sectorDefs: SpatialSectorDef[] = [
      {
        name: 'SEC-Ω: RADIOACTIVE ABYSS',
        desc: 'SYSTEM STABILITY: FAILING (DECAY: 94%)',
        color: '#7FFF00',
        pos: new THREE.Vector3(-24, -14, -14),
        geom: new THREE.IcosahedronGeometry(4.5, 0)
      },
      {
        name: 'SEC-E: PLASMA FIELD',
        desc: 'TEMPERATURE: EXTREME (1.2M KELVIN)',
        color: '#FF4500',
        pos: new THREE.Vector3(-18, 14, 2),
        geom: new THREE.DodecahedronGeometry(4.0, 0)
      },
      {
        name: 'SEC-M: METALLIC LATTICE',
        desc: 'MAGNETIC DECK: 4.8T COHERENT',
        color: '#CFD8DC',
        pos: new THREE.Vector3(0, -9, -9),
        geom: new THREE.OctahedronGeometry(4.5, 0)
      },
      {
        name: 'SEC-N: NOBLE ENVELOPE',
        desc: 'COHERENCE RATE: PERFECT (INERT)',
        color: '#00E5FF',
        pos: new THREE.Vector3(26, 11, 4),
        geom: new THREE.TorusGeometry(3.0, 0.5, 8, 24)
      },
      {
        name: 'SEC-S: MOLECULAR STORM',
        desc: 'PRESSURE: INTENSE FIELD DENSITY',
        color: '#FF007F',
        pos: new THREE.Vector3(14, -13, -10),
        geom: new THREE.ConeGeometry(2.8, 5.6, 4)
      },
      {
        name: 'SEC-A: ANOMALY DISTORTION',
        desc: 'DIMENSIONAL COUPLING: DEVIANT',
        color: '#7C4DFF',
        pos: new THREE.Vector3(5, 21, -22),
        geom: new THREE.TorusKnotGeometry(2.5, 0.4, 32, 4, 3, 4)
      }
    ];

    const sectorMeshes: THREE.Object3D[] = [];
    sectorDefs.forEach(def => {
      const secGroup = new THREE.Group();
      secGroup.position.copy(def.pos);
      
      const wireMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(def.color),
        transparent: true,
        opacity: 0.12,
        wireframe: true,
        blending: THREE.AdditiveBlending
      });
      const wireMesh = new THREE.Mesh(def.geom, wireMat);
      secGroup.add(wireMesh);
      
      const edgeGeom = new THREE.EdgesGeometry(def.geom);
      const edgeMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(def.color),
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending
      });
      const fineEdges = new THREE.LineSegments(edgeGeom, edgeMat);
      secGroup.add(fineEdges);
      
      const labelSprite = createSectorLabelSprite(def.name, def.desc, def.color);
      labelSprite.position.set(0, def.geom instanceof THREE.ConeGeometry ? 4.0 : 3.5, 0);
      secGroup.add(labelSprite);
      
      const particleCount = 10;
      const partGeom = new THREE.BufferGeometry();
      const partPos = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const r = 1.2 + Math.random() * 1.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        partPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        partPos[i * 3 + 1] = r * Math.cos(phi);
        partPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      }
      partGeom.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
      const partMat = new THREE.PointsMaterial({
        size: 0.35,
        color: new THREE.Color(def.color),
        transparent: true,
        opacity: 0.65,
        map: createCircularParticleTexture(),
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const points = new THREE.Points(partGeom, partMat);
      secGroup.add(points);
      
      sectorsGroup.add(secGroup);
      sectorMeshes.push(secGroup);
    });

    // Adaptive fog and ambient lighting variables
    const defaultFogHex = '#070B14';
    const defaultAmbientHex = '#0B1020';
    
    const targetFogColor = new THREE.Color(defaultFogHex);
    const currentFogColor = new THREE.Color(defaultFogHex);
    const targetAmbientColor = new THREE.Color(defaultAmbientHex);

    // 3D Reaction containment chamber & molecular representation variables
    let chamberRingsGroup: THREE.Group | null = null;
    let chamberRing1: THREE.Mesh | null = null;
    let chamberRing2: THREE.Mesh | null = null;
    let ringOuterMat: THREE.MeshBasicMaterial | null = null;
    let ringInnerMat: THREE.MeshBasicMaterial | null = null;
    let productMoleculeGroup: THREE.Group | null = null;
    let isReactionStable = false;

    // Bond Energy Gauge 3D elements
    let energyMeterGroup: THREE.Group | null = null;
    let energyBarMesh: THREE.Mesh | null = null;
    let energyBarMat: THREE.MeshPhongMaterial | null = null;
    let energyScoreLabelTexture: THREE.CanvasTexture | null = null;
    const energySegments: THREE.Mesh[] = [];
    const energySegmentMats: THREE.MeshPhongMaterial[] = [];
    let currentLevelRatio = 0; // Smooth rise target

    // --- 4. PLANAR ATMOSPHERIC LAB GRID System ---
    const gridHelperY = new THREE.GridHelper(100, 50, '#00E5FF', '#0B1020');
    gridHelperY.position.set(0, -25, 0);
    gridHelperY.material.opacity = 0.12;
    gridHelperY.material.transparent = true;
    scene.add(gridHelperY);

    // --- 4B. FUTURISTIC CONTAINMENT CHAMBER ---
    chamberRingsGroup = new THREE.Group();
    chamberRingsGroup.visible = false; // Displayed only in 'bond_lab' mode
    scene.add(chamberRingsGroup);

    // Large glowing boundary energy ring
    const ringOuterGeom = new THREE.TorusGeometry(14.0, 0.15, 16, 120);
    ringOuterMat = new THREE.MeshBasicMaterial({
      color: '#00E5FF',
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    chamberRing1 = new THREE.Mesh(ringOuterGeom, ringOuterMat);
    chamberRing1.rotation.x = Math.PI / 2;
    chamberRingsGroup.add(chamberRing1);

    // Secondary energy ring offset angled
    const ringInnerGeom = new THREE.TorusGeometry(13.8, 0.08, 16, 100);
    ringInnerMat = new THREE.MeshBasicMaterial({
      color: '#FF9100',
      transparent: true,
      opacity: 0.10,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    chamberRing2 = new THREE.Mesh(ringInnerGeom, ringInnerMat);
    chamberRing2.rotation.y = Math.PI / 3;
    chamberRingsGroup.add(chamberRing2);

    // Horizontal grid base inside the chamber
    const chamberGrid = new THREE.GridHelper(26, 12, '#20FFD0', '#103040');
    chamberGrid.position.y = -6.0;
    (chamberGrid.material as THREE.Material).transparent = true;
    (chamberGrid.material as THREE.Material).opacity = 0.12;
    chamberRingsGroup.add(chamberGrid);

    // Lateral electromagnetic coils cylinder pillars
    const coilGeom = new THREE.CylinderGeometry(0.3, 0.3, 14, 8);
    const coilMat = new THREE.MeshPhongMaterial({
      color: '#152540',
      emissive: '#09152a',
      shininess: 60,
      transparent: true,
      opacity: 0.8
    });

    const coilLeft = new THREE.Mesh(coilGeom, coilMat);
    coilLeft.position.set(-14.2, 0, 0);
    chamberRingsGroup.add(coilLeft);

    const coilRight = new THREE.Mesh(coilGeom, coilMat);
    coilRight.position.set(14.2, 0, 0);
    chamberRingsGroup.add(coilRight);

    // Chamber warning perimeter edge bounding cage
    const scanPlaneGeom = new THREE.BoxGeometry(28, 12, 10);
    const scanPlaneEdges = new THREE.EdgesGeometry(scanPlaneGeom);
    const scanPlaneMat = new THREE.LineBasicMaterial({
      color: '#00FFB3',
      transparent: true,
      opacity: 0.06
    });
    const chamberCage = new THREE.LineSegments(scanPlaneEdges, scanPlaneMat);
    chamberRingsGroup.add(chamberCage);

    // --- 4C. HOLOGRAPHIC BOND ENERGY DETECTOR (GAUGE) ---
    energyMeterGroup = new THREE.Group();
    // Position it on the left side within safe sight in the chamber limits
    energyMeterGroup.position.set(-9.8, -4.5, -2.5);
    chamberRingsGroup.add(energyMeterGroup);

    // Grid backdrop behind the indicator
    const gaugeBackdropGeom = new THREE.PlaneGeometry(1.5, 8.2);
    const gaugeBackdropMat = new THREE.MeshBasicMaterial({
      color: '#02070D',
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const gaugeBackdrop = new THREE.Mesh(gaugeBackdropGeom, gaugeBackdropMat);
    gaugeBackdrop.position.set(0, 4.0, -0.15);
    energyMeterGroup.add(gaugeBackdrop);

    // Decorative base ring
    const meterBaseGeom = new THREE.CylinderGeometry(1.0, 1.2, 0.25, 16);
    const meterBaseMat = new THREE.MeshPhongMaterial({
      color: '#1A2F4C',
      emissive: '#09152C',
      shininess: 40
    });
    const meterBase = new THREE.Mesh(meterBaseGeom, meterBaseMat);
    energyMeterGroup.add(meterBase);

    // Vertical supporting pylons/frame
    const frameGeom = new THREE.BoxGeometry(0.08, 8.0, 0.08);
    const frameMat = new THREE.MeshPhongMaterial({
      color: '#0D2036',
      transparent: true,
      opacity: 0.7
    });
    const frameLeft = new THREE.Mesh(frameGeom, frameMat);
    frameLeft.position.set(-0.65, 4.0, 0);
    energyMeterGroup.add(frameLeft);

    const frameRight = new THREE.Mesh(frameGeom, frameMat);
    frameRight.position.set(0.65, 4.0, 0);
    energyMeterGroup.add(frameRight);

    // Decorative cap
    const meterCap = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.7, 0.15, 16), meterBaseMat);
    meterCap.position.y = 8.0;
    energyMeterGroup.add(meterCap);

    // Energy segments (horizontal indicator steps)
    // 8 steps representing bonding intensity divisions
    const segmentCount = 8;
    for (let s = 0; s < segmentCount; s++) {
      const segGeom = new THREE.BoxGeometry(0.8, 0.18, 0.15);
      const segMat = new THREE.MeshPhongMaterial({
        color: '#00E5FF',
        emissive: '#00E5FF',
        emissiveIntensity: 0.05,
        transparent: true,
        opacity: 0.2
      });
      const segMesh = new THREE.Mesh(segGeom, segMat);
      // Place segments uniformly between y=0.8 and y=7.2
      segMesh.position.set(0, 0.8 + (s * 0.85), 0);
      energyMeterGroup.add(segMesh);
      energySegments.push(segMesh);
      energySegmentMats.push(segMat); // We store the material pointer
    }

    // Inside central glowing core energy cylinder bar
    const barGeom = new THREE.CylinderGeometry(0.18, 0.18, 6.8, 16);
    barGeom.translate(0, 3.4, 0); // Translate so bottom is at origin
    energyBarMat = new THREE.MeshPhongMaterial({
      color: '#00FFB3', // Default green, will shift based on reaction type color
      emissive: '#00FFB3',
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.85
    });
    energyBarMesh = new THREE.Mesh(barGeom, energyBarMat);
    energyBarMesh.position.set(0, 0.6, 0);
    energyBarMesh.scale.y = 0.001; // initial scale
    energyMeterGroup.add(energyBarMesh);

    // Create CanvasTexture for the HUD overlay text
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 256;
    labelCanvas.height = 128;
    energyScoreLabelTexture = new THREE.CanvasTexture(labelCanvas);

    const updateEnergyLabelCanvas = (formula: string, energyValue: number, colorHex: string) => {
      const ctx = labelCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 256, 128);
        
        // Semi-transparent backdrop
        ctx.fillStyle = 'rgba(7, 11, 20, 0.9)';
        ctx.beginPath();
        ctx.rect(5, 5, 246, 118);
        ctx.fill();
        
        ctx.strokeStyle = colorHex;
        ctx.lineWidth = 2.0;
        ctx.stroke();

        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#EAF2FF';
        ctx.textAlign = 'center';
        ctx.fillText('BOND ENERGY', 128, 28);

        ctx.font = 'bold 28px sans-serif';
        ctx.fillStyle = colorHex;
        ctx.fillText(`${energyValue}`, 128, 68);

        ctx.font = '10px monospace';
        ctx.fillStyle = 'rgba(234, 242, 255, 0.65)';
        ctx.fillText('kJ/mol (VALENCE)', 128, 92);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(25, 38); ctx.lineTo(231, 38);
        ctx.stroke();
      }
      if (energyScoreLabelTexture) energyScoreLabelTexture.needsUpdate = true;
    };

    const labelGeom = new THREE.PlaneGeometry(3.0, 1.5);
    const labelMat = new THREE.MeshBasicMaterial({
      map: energyScoreLabelTexture,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const labelMesh = new THREE.Mesh(labelGeom, labelMat);
    labelMesh.position.set(0, 9.2, 0);
    energyMeterGroup.add(labelMesh);
    energyMeterGroup.userData = { labelMesh, updateLabel: updateEnergyLabelCanvas };

    // Initial label
    updateEnergyLabelCanvas('N/A', 0, '#00E5FF');

    // --- 5. FLOATING ELEMENT CARDS SETUP ---
    const cardGroup = new THREE.Group();
    scene.add(cardGroup);

    interface CardMeshInfo {
      mesh: THREE.Mesh;
      element: ChemicalElement;
      basePosition: THREE.Vector3;
      targetPosition: THREE.Vector3;
      baseRotation: THREE.Euler;
      targetRotation: THREE.Euler;
      floatOffset: number;
      glowOutline: THREE.LineSegments;
      material: THREE.MeshBasicMaterial;
    }

    const elementCards: CardMeshInfo[] = [];

    // Shared reusable geometries to minimize WebGL allocations and memory usage on startup
    const sharedCardGeom = new THREE.PlaneGeometry(1.8, 2.3);
    const sharedEdgeConfigGeom = new THREE.EdgesGeometry(sharedCardGeom);

    // Pre-draw standard assets for elements on dynamic CanvasTextures
    ELEMENTS_DATA.forEach((el, idx) => {
      const categoryConfig = CATEGORY_COLORS[el.category] || { hex: '#00E5FF' };
      const cardTexture = createCardTexture(el, categoryConfig.hex);
      
      const cardMat = new THREE.MeshBasicMaterial({
        map: cardTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      });

      const cardMesh = new THREE.Mesh(sharedCardGeom, cardMat);
      
      // Wireframe futuristic glow bounding box
      const edgeMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(categoryConfig.hex),
        linewidth: 2,
        transparent: true,
        opacity: 0.4,
      });
      const glowOutline = new THREE.LineSegments(sharedEdgeConfigGeom, edgeMat);
      glowOutline.scale.set(1.05, 1.05, 1.05);
      glowOutline.position.z = 0.01;
      cardMesh.add(glowOutline);

      // Storing coordinates for multi-layouts
      const targetPos = new THREE.Vector3();
      const targetRot = new THREE.Euler();

      // Store meta info
      cardGroup.add(cardMesh);
      elementCards.push({
        mesh: cardMesh,
        element: el,
        basePosition: new THREE.Vector3(),
        targetPosition: targetPos,
        baseRotation: new THREE.Euler(),
        targetRotation: targetRot,
        floatOffset: Math.random() * Math.PI * 2,
        glowOutline,
        material: cardMat,
      });
    });

    // --- 6. ATOM VISUALIZER GROUP ---
    const atomGroup = new THREE.Group();
    scene.add(atomGroup);
    atomGroup.visible = false;

    // Pulse core representing Nucleus
    const nucleusGroup = new THREE.Group();
    atomGroup.add(nucleusGroup);

    const coreLight = new THREE.PointLight('#EAF2FF', 6.0, 35);
    coreLight.position.set(0, 0, 0);
    atomGroup.add(coreLight);

    // Generate protons and neutrons inside nucleus
    const nucleons: THREE.Mesh[] = [];
    const nucleonCount = 38; // Rich energetic core clump
    const sharedNucleonGeom = new THREE.SphereGeometry(0.35, 8, 8); // Optimized segment count (8x8) and pooled for protons/neutrons

    const protonMat = new THREE.MeshPhongMaterial({
      color: '#7C4DFF',
      emissive: '#4A148C',
      shininess: 95,
      specular: '#FFFFFF',
    });
    
    const neutronMat = new THREE.MeshPhongMaterial({
      color: '#00FFB3',
      emissive: '#004D40',
      shininess: 85,
      specular: '#FFFFFF',
    });

    const protonBasicMat = new THREE.MeshBasicMaterial({
      color: '#7C4DFF',
    });

    const neutronBasicMat = new THREE.MeshBasicMaterial({
      color: '#00FFB3',
    });

    for (let i = 0; i < nucleonCount; i++) {
      const isProton = Math.random() > 0.48;
      const mesh = new THREE.Mesh(sharedNucleonGeom, isProton ? protonMat : neutronMat);
      
      // Keep them clumped tightly in 3D sphere
      const r = Math.random() * 1.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      mesh.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
      nucleusGroup.add(mesh);
      nucleons.push(mesh);
    }

    // Dynamic shell path rings and whizzing electron spheres
    const shellGroup = new THREE.Group();
    atomGroup.add(shellGroup);

    interface ExtendedElectron {
      mesh: THREE.Mesh;
      shellRadius: number;
      angle: number;
      speed: number;
      trail: THREE.Line;
      eccentricity: number;
      semiMinorAxis: number;
      quantumJumpTimer: number;
      isJumping: boolean;
      jumpRatio: number;
      baseColor: THREE.Color;
      shellIndex: number;
      rotX: number;
      rotZ: number;
    }
    
    let activeElectrons: ExtendedElectron[] = [];
    let selectedShellIndex: number | null = null;
    let hitRings: THREE.Mesh[] = [];
    let densityCloud: THREE.Points | null = null;

    // --- 6B. ELEMENT WORLDS ENVIRONMENT GROUP ---
    const elementWorldGroup = new THREE.Group();
    atomGroup.add(elementWorldGroup);
    
    let activeWorldAnimate: ((elapsed: number, delta: number, simMultiplier: number) => void) | null = null;
    
    const clearElementWorld = () => {
      activeWorldAnimate = null;
      while (elementWorldGroup.children.length > 0) {
        const child = elementWorldGroup.children[0];
        elementWorldGroup.remove(child);
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          } else if (Array.isArray(child.material)) {
            child.material.forEach((m: any) => m.dispose());
          }
        } else if (child instanceof THREE.Points) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        } else if (child instanceof THREE.Line) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      }
    };

    // --- INTERACTION / DRAG CONTROLS ---
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    
    // Slow drift variables
    let cameraYOffsetTarget = 0;
    let rotXTarget = 0;
    let rotYTarget = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    // Reactant drag controls & status
    let reactantA: THREE.Group | null = null;
    let reactantB: THREE.Group | null = null;
    let draggedReactant: THREE.Group | null = null;
    let activeBondModeReaction: ReactionConfig | null = null;

    // Fusion visual assets
    let fusionShockwave: THREE.Mesh | null = null;
    let sparkPoints: THREE.Points | null = null;
    let sparkSpeeds: Float32Array | null = null;
    let sparkDirections: Float32Array | null = null;

    const createReactantAtom = (symbol: string, colorHex: string) => {
      const group = new THREE.Group();
      
      // Core glowing sphere representing nucleus
      const coreGeom = new THREE.SphereGeometry(1.4, 16, 16);
      const coreMat = new THREE.MeshPhongMaterial({
        color: new THREE.Color(colorHex),
        emissive: new THREE.Color(colorHex).multiplyScalar(0.45),
        transparent: true,
        opacity: 0.9,
        shininess: 70
      });
      const coreMesh = new THREE.Mesh(coreGeom, coreMat);
      group.add(coreMesh);

      // Extract the shells structure of the element from database for accurate subatomic orbits
      const elData = ELEMENTS_DATA.find(e => e.symbol === symbol);
      const shellSpecs = elData ? elData.shells : [2, 1];

      // Keep array of multiple whizzer electrons
      const electronMeshes: Array<{
        mesh: THREE.Mesh;
        radius: number;
        speed: number;
        angleOffset: number;
        tiltX: number;
        tiltY: number;
      }> = [];

      // Create orbital rings and electrons for each shell level
      shellSpecs.forEach((electronCount, shellIdx) => {
        const radius = 2.0 + shellIdx * 1.25;
        const tiltX = Math.PI / 2.5 + (shellIdx * 0.42);
        const tiltY = shellIdx * 0.65;

        // Visual orbital vector path torus ring
        const shellRingGeom = new THREE.RingGeometry(radius, radius + 0.04, 32);
        const shellRingMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(colorHex),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: Math.max(0.08, 0.32 - (shellIdx * 0.05)),
          blending: THREE.AdditiveBlending
        });
        const shellRing = new THREE.Mesh(shellRingGeom, shellRingMat);
        shellRing.rotation.set(tiltX, tiltY, 0);
        group.add(shellRing);

        // Spawn whizzers for this shell level
        for (let eIdx = 0; eIdx < electronCount; eIdx++) {
          const elGeom = new THREE.SphereGeometry(0.18 + Math.random() * 0.06, 8, 8);
          const elMat = new THREE.MeshBasicMaterial({
            color: '#EAF2FF',
            transparent: true,
            opacity: 0.95
          });
          const elMesh = new THREE.Mesh(elGeom, elMat);
          group.add(elMesh);

          electronMeshes.push({
            mesh: elMesh,
            radius,
            speed: (3.6 / radius) * (1.0 + Math.random() * 0.3), // Inner electrons orbit much faster!
            angleOffset: (eIdx / electronCount) * Math.PI * 2,
            tiltX,
            tiltY
          });
        }
      });

      // Maintain legacy reference placeholders for safety-checks
      const ring = group.children.find(c => c instanceof THREE.Mesh && c.geometry instanceof THREE.RingGeometry) as THREE.Mesh || null;
      const electron = group.children.find(c => c instanceof THREE.Mesh && c.geometry instanceof THREE.SphereGeometry && c !== coreMesh) as THREE.Mesh || null;

      // Element billboard flat text symbol Card
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 128, 128);
        ctx.fillStyle = '#050816EE';
        ctx.beginPath();
        ctx.arc(64, 64, 52, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = colorHex;
        ctx.lineWidth = 5;
        ctx.stroke();

        ctx.font = 'bold 50px monospace';
        ctx.fillStyle = '#EAF2FF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(symbol, 64, 64);
      }
      const tex = new THREE.CanvasTexture(canvas);
      const symbolMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2.0, 2.0),
        new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
      );
      symbolMesh.position.z = 1.6;
      group.add(symbolMesh);

      group.userData = {
        symbol,
        colorHex,
        electron,
        ring,
        electronMeshes,
        symbolMesh
      };

      return group;
    };

    const createLatticeLine = (pointA: THREE.Vector3, pointB: THREE.Vector3, parentGroup: THREE.Group, customColor = '#00E5FF') => {
      const direction = new THREE.Vector3().subVectors(pointB, pointA);
      const length = direction.length();
      const geom = new THREE.CylinderGeometry(0.06, 0.06, length, 8);
      geom.translate(0, length / 2, 0);
      geom.rotateX(Math.PI / 2);
      
      const mat = new THREE.MeshBasicMaterial({
        color: customColor,
        transparent: true,
        opacity: 0.55
      });
      const cylinder = new THREE.Mesh(geom, mat);
      cylinder.position.copy(pointA);
      cylinder.lookAt(pointB);
      parentGroup.add(cylinder);
    };

    const createCovalentBond = (pointA: THREE.Vector3, pointB: THREE.Vector3, parentGroup: THREE.Group, color1: string, color2: string) => {
      const direction = new THREE.Vector3().subVectors(pointB, pointA);
      const length = direction.length();
      const halfLength = length / 2;

      // First half (colored towards Atom 1)
      const geom1 = new THREE.CylinderGeometry(0.08, 0.08, halfLength, 8);
      geom1.translate(0, halfLength / 2, 0);
      geom1.rotateX(Math.PI / 2);
      const mat1 = new THREE.MeshPhongMaterial({
        color: new THREE.Color(color1),
        emissive: new THREE.Color(color1).multiplyScalar(0.5),
        transparent: true,
        opacity: 0.7
      });
      const cyl1 = new THREE.Mesh(geom1, mat1);
      cyl1.position.copy(pointA);
      cyl1.lookAt(pointB);
      parentGroup.add(cyl1);

      // Second half (colored towards Atom 2)
      const geom2 = new THREE.CylinderGeometry(0.08, 0.08, halfLength, 8);
      geom2.translate(0, halfLength / 2, 0);
      geom2.rotateX(Math.PI / 2);
      const mat2 = new THREE.MeshPhongMaterial({
        color: new THREE.Color(color2),
        emissive: new THREE.Color(color2).multiplyScalar(0.5),
        transparent: true,
        opacity: 0.7
      });
      const cyl2 = new THREE.Mesh(geom2, mat2);
      const midPoint = new THREE.Vector3().addVectors(pointA, pointB).multiplyScalar(0.5);
      cyl2.position.copy(midPoint);
      cyl2.lookAt(pointB);
      parentGroup.add(cyl2);
    };

    const createDoubleCovalentBond = (pointA: THREE.Vector3, pointB: THREE.Vector3, parentGroup: THREE.Group, color1: string, color2: string) => {
      // Calculate perpendicular offset vector for drawing twin parallel lines
      const direction = new THREE.Vector3().subVectors(pointB, pointA).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      if (Math.abs(direction.dot(up)) > 0.9) {
        up.set(1, 0, 0);
      }
      const right = new THREE.Vector3().crossVectors(direction, up).normalize().multiplyScalar(0.24);

      // Left Bond
      const leftA = pointA.clone().add(right);
      const leftB = pointB.clone().add(right);
      createCovalentBond(leftA, leftB, parentGroup, color1, color2);

      // Right Bond
      const rightA = pointA.clone().sub(right);
      const rightB = pointB.clone().sub(right);
      createCovalentBond(rightA, rightB, parentGroup, color1, color2);
    };

    const createHolographic3DLabel = (formula: string, name: string, parentGroup: THREE.Group) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 512, 128);
        
        // Semi-transparent high-tech hud back plate
        ctx.fillStyle = 'rgba(7, 11, 20, 0.85)';
        ctx.beginPath();
        ctx.rect(10, 10, 492, 108);
        ctx.fill();
        
        ctx.strokeStyle = '#00FFB3';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // High-tech corner bracket styles
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        // Top Left
        ctx.moveTo(15, 35); ctx.lineTo(15, 15); ctx.lineTo(35, 15);
        // Top Right
        ctx.moveTo(497, 35); ctx.lineTo(497, 15); ctx.lineTo(477, 15);
        // Bottom Left
        ctx.moveTo(15, 93); ctx.lineTo(15, 113); ctx.lineTo(35, 113);
        // Bottom Right
        ctx.moveTo(497, 93); ctx.lineTo(497, 113); ctx.lineTo(477, 113);
        ctx.stroke();

        ctx.font = 'bold 38px sans-serif';
        ctx.fillStyle = '#00FFB3';
        ctx.textAlign = 'left';
        ctx.fillText(formula, 42, 58);

        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = '#EAF2FF';
        ctx.fillText('SYNTHESIZED MATRIX', 42, 92);

        ctx.font = 'bold 20px sans-serif';
        ctx.fillStyle = 'rgba(234, 242, 255, 0.85)';
        ctx.textAlign = 'right';
        ctx.fillText(name, 470, 70);
      }

      const tex = new THREE.CanvasTexture(canvas);
      const material = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide
      });
      const geom = new THREE.PlaneGeometry(6.4, 1.6);
      const mesh = new THREE.Mesh(geom, material);
      
      mesh.position.set(0, 4.2, 0);
      parentGroup.add(mesh);
      parentGroup.userData.labelMesh = mesh;
    };

    const createProductMolecule = (re: ReactionConfig | null, position: THREE.Vector3) => {
      const group = new THREE.Group();
      group.position.copy(position);

      if (!re) return group;

      // Add a base golden holographic bounding grid / scanning emitter beneath the formed molecule!
      const gridHelper = new THREE.GridHelper(8, 8, '#00FFB3', '#00FFB3');
      gridHelper.position.y = -3.5;
      (gridHelper.material as THREE.Material).transparent = true;
      (gridHelper.material as THREE.Material).opacity = 0.15;
      group.add(gridHelper);

      // Add some scanning laser lines
      const scannerGeom = new THREE.RingGeometry(3.0, 3.1, 32);
      const scannerMat = new THREE.MeshBasicMaterial({
        color: '#00FFB3',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35
      });
      const scanner = new THREE.Mesh(scannerGeom, scannerMat);
      scanner.rotation.x = Math.PI / 2;
      scanner.position.y = -3.5;
      group.add(scanner);
      group.userData = { scanner };

      const formula = re.productFormula;

      if (formula === 'NaCl') {
        const spacing = 1.6;
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
              const isSodium = (x + y + z) % 2 === 0;
              const sphereGeom = new THREE.SphereGeometry(isSodium ? 0.38 : 0.52, 16, 16);
              const color = isSodium ? '#D500F9' : '#00FFB3';
              const sphereMat = new THREE.MeshPhongMaterial({
                color: new THREE.Color(color),
                emissive: new THREE.Color(color).multiplyScalar(0.4),
                shininess: 90,
                transparent: true,
                opacity: 0.85
              });
              const atomMesh = new THREE.Mesh(sphereGeom, sphereMat);
              atomMesh.position.set(x * spacing, y * spacing, z * spacing);
              group.add(atomMesh);

              if (x < 1) {
                createLatticeLine(atomMesh.position, new THREE.Vector3((x + 1) * spacing, y * spacing, z * spacing), group);
              }
              if (y < 1) {
                createLatticeLine(atomMesh.position, new THREE.Vector3(x * spacing, (y + 1) * spacing, z * spacing), group);
              }
              if (z < 1) {
                createLatticeLine(atomMesh.position, new THREE.Vector3(x * spacing, y * spacing, (z + 1) * spacing), group);
              }
            }
          }
        }
      } else if (formula === 'H₂O') {
        const oxGeom = new THREE.SphereGeometry(1.2, 32, 32);
        const oxMat = new THREE.MeshPhongMaterial({
          color: '#FF1744',
          emissive: '#4D000A',
          shininess: 80,
          transparent: true,
          opacity: 0.9
        });
        const ox = new THREE.Mesh(oxGeom, oxMat);
        group.add(ox);

        const hGeom = new THREE.SphereGeometry(0.6, 24, 24);
        const hMat = new THREE.MeshPhongMaterial({
          color: '#EAF2FF',
          emissive: '#203040',
          shininess: 70,
          transparent: true,
          opacity: 0.85
        });

        const angle = 104.5 * Math.PI / 180;
        const dist = 2.4;

        const h1 = new THREE.Mesh(hGeom, hMat);
        h1.position.set(Math.cos(angle / 2) * dist, Math.sin(angle / 2) * dist, 0);
        group.add(h1);

        const h2 = new THREE.Mesh(hGeom, hMat);
        h2.position.set(-Math.cos(angle / 2) * dist, Math.sin(angle / 2) * dist, 0);
        group.add(h2);

        createCovalentBond(ox.position, h1.position, group, '#FF1744', '#EAF2FF');
        createCovalentBond(ox.position, h2.position, group, '#FF1744', '#EAF2FF');

      } else if (formula.includes('CsOH')) {
        const csGeom = new THREE.SphereGeometry(1.6, 32, 32);
        const csMat = new THREE.MeshPhongMaterial({
          color: '#FFD700',
          emissive: '#554400',
          shininess: 100,
          transparent: true,
          opacity: 0.9
        });
        const cs = new THREE.Mesh(csGeom, csMat);
        cs.position.set(-2.0, 0.5, 0);
        group.add(cs);

        const oxGeom = new THREE.SphereGeometry(0.9, 24, 24);
        const oxMat = new THREE.MeshPhongMaterial({
          color: '#FF1744',
          emissive: '#400000',
          shininess: 80,
          transparent: true,
          opacity: 0.9
        });
        const ox = new THREE.Mesh(oxGeom, oxMat);
        ox.position.set(1.0, 0.8, -0.5);
        group.add(ox);

        const hGeom = new THREE.SphereGeometry(0.48, 20, 20);
        const hMat = new THREE.MeshPhongMaterial({ color: '#EAF2FF' });
        const h = new THREE.Mesh(hGeom, hMat);
        h.position.set(2.0, 1.2, -0.3);
        group.add(h);

        createCovalentBond(ox.position, h.position, group, '#FF1744', '#EAF2FF');

        const dimerGroup = new THREE.Group();
        dimerGroup.position.set(0.5, -2.0, 1.5);
        const hD1 = new THREE.Mesh(hGeom, hMat);
        hD1.position.set(-0.6, 0, 0);
        const hD2 = new THREE.Mesh(hGeom, hMat);
        hD2.position.set(0.6, 0, 0);
        dimerGroup.add(hD1);
        dimerGroup.add(hD2);
        createCovalentBond(hD1.position, hD2.position, dimerGroup, '#EAF2FF', '#EAF2FF');
        group.add(dimerGroup);

        const ionizationRingGeom = new THREE.TorusGeometry(3.0, 0.08, 16, 100);
        const ionizationRingMat = new THREE.MeshBasicMaterial({
          color: '#FF00E5',
          transparent: true,
          opacity: 0.45,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide
        });
        const ionRing = new THREE.Mesh(ionizationRingGeom, ionizationRingMat);
        ionRing.rotation.x = Math.PI / 4;
        group.add(ionRing);
        group.userData = { scanner, ionRing, dimer: dimerGroup };

      } else if (formula === 'CO₂') {
        const cGeom = new THREE.SphereGeometry(1.0, 28, 28);
        const cMat = new THREE.MeshPhongMaterial({
          color: '#2C3539',
          emissive: '#11161B',
          shininess: 90,
          transparent: true,
          opacity: 0.95
        });
        const carbon = new THREE.Mesh(cGeom, cMat);
        carbon.position.set(0, 0, 0);
        group.add(carbon);

        const oxGeom = new THREE.SphereGeometry(1.15, 28, 28);
        const oxMat = new THREE.MeshPhongMaterial({
          color: '#FF1744',
          emissive: '#4D000A',
          shininess: 80,
          transparent: true,
          opacity: 0.90
        });

        const oxLeft = new THREE.Mesh(oxGeom, oxMat);
        oxLeft.position.set(-2.5, 0, 0);
        group.add(oxLeft);

        const oxRight = new THREE.Mesh(oxGeom, oxMat);
        oxRight.position.set(2.5, 0, 0);
        group.add(oxRight);

        createDoubleCovalentBond(carbon.position, oxLeft.position, group, '#2C3539', '#FF1744');
        createDoubleCovalentBond(carbon.position, oxRight.position, group, '#2C3539', '#FF1744');

      } else if (formula === 'Fe₂O₃') {
        const positions = [
          { pos: new THREE.Vector3(-1.4, 0.8, -0.6), isIron: true },
          { pos: new THREE.Vector3(1.4, -0.6, 0.7), isIron: true },
          { pos: new THREE.Vector3(-0.2, -0.9, -1.0), isIron: false },
          { pos: new THREE.Vector3(-0.5, 0.2, 1.2), isIron: false },
          { pos: new THREE.Vector3(1.0, 1.0, 0.1), isIron: false },
        ];

        const nodes: THREE.Mesh[] = [];

        positions.forEach((node, idx) => {
          const geom = new THREE.SphereGeometry(node.isIron ? 1.2 : 0.8, 20, 20);
          const mat = new THREE.MeshPhongMaterial({
            color: node.isIron ? '#D2691E' : '#FF3D00',
            emissive: node.isIron ? '#3E1C07' : '#5E1100',
            shininess: node.isIron ? 30 : 60,
            transparent: true,
            opacity: 0.9
          });
          const mesh = new THREE.Mesh(geom, mat);
          mesh.position.copy(node.pos);
          group.add(mesh);
          nodes.push(mesh);
        });

        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            if (nodes[i].position.distanceTo(nodes[j].position) < 3.2) {
              createLatticeLine(nodes[i].position, nodes[j].position, group, '#8B4513');
            }
          }
        }
      }

      // 3D Bond Energy Aura Indicator: Custom dual-shell volumetric energy core wrapping the molecule
      const energyConfig = BOND_ENERGIES[formula] || { value: 300, color: '#00FFB3', maxLimit: 2000 };
      const auraScale = 3.6 + (energyConfig.value / energyConfig.maxLimit) * 2.2;
      const energyColor = energyConfig.color;
      const opacityCoeff = 0.05 + (energyConfig.value / energyConfig.maxLimit) * 0.12;

      const auraShell1 = new THREE.Mesh(
        new THREE.SphereGeometry(auraScale, 16, 16),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(energyColor),
          transparent: true,
          opacity: opacityCoeff,
          wireframe: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      group.add(auraShell1);

      const auraShell2 = new THREE.Mesh(
        new THREE.SphereGeometry(auraScale * 0.95, 12, 12),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(energyColor),
          transparent: true,
          opacity: opacityCoeff * 0.4,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      group.add(auraShell2);

      group.userData = {
        ...group.userData,
        auraShell1,
        auraShell2,
        energyConfig
      };

      createHolographic3DLabel(re.productFormula, re.productName, group);

      return group;
    };

    const spawnReactants = (re: ReactionConfig) => {
      // Clean up previous reactants if they exist
      if (reactantA) scene.remove(reactantA);
      if (reactantB) scene.remove(reactantB);
      if (fusionShockwave) scene.remove(fusionShockwave);
      if (sparkPoints) scene.remove(sparkPoints);
      if (productMoleculeGroup) {
        scene.remove(productMoleculeGroup);
        productMoleculeGroup = null;
      }

      isReactionStable = false;

      // Find color configurations
      const colorA = CATEGORY_COLORS[ELEMENTS_DATA.find(e => e.symbol === re.reactants[0])?.category || 'text']?.hex || '#00E5FF';
      const colorB = CATEGORY_COLORS[ELEMENTS_DATA.find(e => e.symbol === re.reactants[1])?.category || 'text']?.hex || '#D500F9';

      reactantA = createReactantAtom(re.reactants[0], colorA);
      reactantB = createReactantAtom(re.reactants[1], colorB);

      // Set initial spaced positions (Left & Right)
      reactantA.position.set(-8.5, 0, 0);
      reactantB.position.set(8.5, 0, 0);

      scene.add(reactantA);
      scene.add(reactantB);

      // Create a gorgeous fusion shockwave sphere (initially scale 0 and invisible)
      const shockwaveGeom = new THREE.SphereGeometry(4.0, 32, 32);
      const shockwaveMat = new THREE.MeshBasicMaterial({
        color: '#FFFFFF',
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      });
      fusionShockwave = new THREE.Mesh(shockwaveGeom, shockwaveMat);
      scene.add(fusionShockwave);

      // Create explosive reaction sparks/particles
      const sparkCount = re.visualType === 'explosion' ? 240 : 120;
      const sparkGeom = new THREE.BufferGeometry();
      const sparkPosArray = new Float32Array(sparkCount * 3);
      sparkSpeeds = new Float32Array(sparkCount);
      sparkDirections = new Float32Array(sparkCount * 3);

      for (let s = 0; s < sparkCount; s++) {
        sparkPosArray[s * 3] = 0;
        sparkPosArray[s * 3 + 1] = 0;
        sparkPosArray[s * 3 + 2] = 0;

        sparkSpeeds[s] = re.visualType === 'explosion' ? (8.0 + Math.random() * 16.0) : (4.0 + Math.random() * 12.0);

        // Random vector output
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        sparkDirections[s * 3] = Math.sin(phi) * Math.cos(theta);
        sparkDirections[s * 3 + 1] = Math.cos(phi);
        sparkDirections[s * 3 + 2] = Math.sin(phi) * Math.sin(theta);
      }

      sparkGeom.setAttribute('position', new THREE.BufferAttribute(sparkPosArray, 3));

      let sparkColor = new THREE.Color(colorA).lerp(new THREE.Color(colorB), 0.5);
      if (re.visualType === 'explosion') {
        sparkColor.set('#FF3D00');
      } else if (re.visualType === 'covalent') {
        sparkColor.set('#00E5FF');
      } else if (re.visualType === 'ionic') {
        sparkColor.set('#FFD700');
      }

      const sparkMat = new THREE.PointsMaterial({
        size: re.visualType === 'explosion' ? 0.55 : 0.42,
        color: sparkColor,
        map: createCircularParticleTexture(),
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      sparkPoints = new THREE.Points(sparkGeom, sparkMat);
      scene.add(sparkPoints);

      activeBondModeReaction = re;

      // Dispatch initial distance
      window.dispatchEvent(new CustomEvent('tether-distance', { detail: { distance: 17.0 } }));
      window.dispatchEvent(new CustomEvent('reaction-stage', { detail: { stage: 'idle' } }));
    };

    const handleResetReactor = () => {
      if (reactantA) reactantA.position.set(-8.5, 0, 0);
      if (reactantB) reactantB.position.set(8.5, 0, 0);
      if (reactantA) reactantA.visible = true;
      if (reactantB) reactantB.visible = true;
      isReactionStable = false;
      if (fusionShockwave) {
        fusionShockwave.visible = false;
        fusionShockwave.scale.set(0.01, 0.01, 0.01);
      }
      if (sparkPoints) {
        sparkPoints.visible = false;
      }
      if (productMoleculeGroup) {
        scene.remove(productMoleculeGroup);
        productMoleculeGroup = null;
      }
      // Notify back to UI
      window.dispatchEvent(new CustomEvent('reaction-stage', { detail: { stage: 'idle' } }));
    };
    window.addEventListener('reset-reactor', handleResetReactor);

    // Screen-shake animation state and reaction-stage event listener
    let shakeIntensity = 0;

    // Zoom Scale Multiplier system for seamless multi-scale transitions
    let zoomScaleMultiplier = 1.0;
    const handleSetCosmicZoom = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent && customEvent.detail && typeof customEvent.detail.multiplier === 'number') {
        zoomScaleMultiplier = customEvent.detail.multiplier;
      }
    };
    window.addEventListener('set-cosmic-zoom', handleSetCosmicZoom);

    const handleReactionStageEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent && customEvent.detail && customEvent.detail.stage === 'stable') {
        const vType = propsRef.current.activeReaction?.visualType;
        if (vType === 'explosion') {
          shakeIntensity = 2.4;
        } else if (vType === 'covalent') {
          shakeIntensity = 1.1;
        } else {
          shakeIntensity = 1.6;
        }
      }
    };
    window.addEventListener('reaction-stage', handleReactionStageEvent);

    // Interactive Camera Parallax & Elastic buoyancy
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    // Direct performance tracking parameters
    let lastMouseMoveTime = 0;
    let mouseActive = false;

    // Raycasting for cards hover and click
    const raycaster = new THREE.Raycaster();
    const mouse2D = new THREE.Vector2();

    const updateLayouts = (mode: TableLayoutMode, selectedEl: ChemicalElement | null) => {
      elementCards.forEach((ci, index) => {
        // Render and update positions
        if (selectedEl) {
          // If another element is selected, fade out and fly in other elements
          const dist = ci.element.number === selectedEl.number ? 0 : 1;
          if (dist > 0) {
            ci.targetPosition.set(
              (ci.element.group - 9.5) * 5.5,
              (4 - ci.element.period) * 5.5,
              -80 // Push far into background
            );
            ci.targetRotation.set(0, 0, 0);
          } else {
            // Selected element moves beautifully off to the left side or is invisible
            ci.targetPosition.set(-14, 0, 10);
            ci.targetRotation.set(0, 0.45, 0);
          }
          return;
        }

        // Standard positions based on Layout Mode
        if (mode === 'grid') {
          // Curvaceous cylinder panoramic command deck
          const angle = (ci.element.group - 9.5) * 0.11; // Radians distribution
          const cylinderRadius = 24;
          
          ci.targetPosition.set(
            Math.sin(angle) * cylinderRadius,
            (4 - ci.element.period) * 3.4 - 0.5,
            -Math.cos(angle) * cylinderRadius + cylinderRadius - 2
          );
          
          // Face elements inward toward the central command point
          ci.targetRotation.set(0, -angle, 0);

        } else if (mode === 'spiral') {
          // Glorious vertical sci-fi double-helix array
          const angle = index * 0.38 + ci.floatOffset * 0.05;
          const spiralRadius = 9;
          
          ci.targetPosition.set(
            Math.sin(angle) * spiralRadius,
            (index - elementCards.length / 2) * 1.1,
            Math.cos(angle) * spiralRadius
          );
          
          ci.targetRotation.set(0, angle + Math.PI / 2, 0);

        } else if (mode === 'sphere') {
          // High-contrast shell sphere
          const total = elementCards.length;
          const phi = Math.acos(-1 + (2 * index) / total);
          const theta = Math.sqrt(total * Math.PI) * phi;
          const radius = 18;

          ci.targetPosition.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
          );

          // Rotate to look at center (0,0,0) with billboard vectoring
          const copyPos = ci.targetPosition.clone();
          const targetRotMat = new THREE.Matrix4().lookAt(copyPos, new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0));
          ci.targetRotation.setFromRotationMatrix(targetRotMat);

        } else if (mode === 'scatter') {
          // Dynamic chemical scatter particle fields grouped by period and family
          const spacing = 1.3;
          ci.targetPosition.set(
            (ci.element.group - 9.5) * 2.8,
            (index % 3 - 1) * 6 + Math.random() * 2,
            -10 - (ci.element.number % 5) * 4
          );
          ci.targetRotation.set(
            (Math.random() - 0.5) * 0.4,
            (Math.random() - 0.5) * 0.4,
            0
          );
        }
      });
    };

    // Standard normal Gaussian random helper (Box-Muller transform)
    function randn_bm() {
      let u = 0, v = 0;
      while (u === 0) u = Math.random(); 
      while (v === 0) v = Math.random();
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }

    function getShellName(index: number): string {
      const names = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
      return names[index] || `Shell ${index + 1}`;
    }

    const rebuildDensityCloud = (shellIdx: number | null, el: ChemicalElement | null) => {
      // 1. Clear previous cloud
      if (densityCloud) {
        scene.remove(densityCloud);
        densityCloud.geometry.dispose();
        if (Array.isArray(densityCloud.material)) {
          densityCloud.material.forEach((m: any) => m.dispose());
        } else {
          densityCloud.material.dispose();
        }
        densityCloud = null;
      }

      if (shellIdx === null || !el) return;

      const radius = 3.5 + shellIdx * 2.2;
      const primaryColorHex = el.visual?.primaryColor || '#00E5FF';
      const catColor = new THREE.Color(primaryColorHex);
      
      const rotX = (shellIdx * 0.38) + 0.15;
      const rotZ = (shellIdx * -0.28) - 0.1;

      // 2. Spawn points for dense volumetric cloud
      const numPoints = isLowPerfActive ? 500 : 1200;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(numPoints * 3);
      const colors = new Float32Array(numPoints * 3);

      for (let i = 0; i < numPoints; i++) {
        const p = new THREE.Vector3();
        
        if (shellIdx === 0) {
          // K-Shell: S-orbital (uniform spherical density envelope)
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos((Math.random() * 2) - 1);
          // Distance follows high-probability shell thickness
          const dist = radius + (randn_bm() * 0.45);
          p.set(
            dist * Math.sin(phi) * Math.cos(theta),
            dist * Math.sin(phi) * Math.sin(theta),
            dist * Math.cos(phi)
          );
        } else if (shellIdx === 1) {
          // L-Shell: S+P orbitals. Dumbbell probability density nodes.
          const isLobe = Math.random() > 0.45;
          if (isLobe) {
            // p-orbital dumbbell oriented along orbital axis
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            // Proportional cos^2 or sin^2 orbital lobes
            const lobeWeight = Math.pow(Math.cos(phi), 2);
            const dist = radius * (0.65 + lobeWeight * 0.8) + (randn_bm() * 0.25);
            p.set(
              dist * Math.sin(phi) * Math.cos(theta),
              dist * Math.sin(phi) * Math.sin(theta),
              dist * Math.cos(phi)
            );
          } else {
            // standard spherical cloud base
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const dist = radius * 0.85 + (randn_bm() * 0.35);
            p.set(
              dist * Math.sin(phi) * Math.cos(theta),
              dist * Math.sin(phi) * Math.sin(theta),
              dist * Math.cos(phi)
            );
          }
        } else {
          // M/N/O-Shells: Complex d/f orbital lobe clover configurations
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos((Math.random() * 2) - 1);
          const petals = shellIdx === 2 ? 4 : 6;
          // Radiative sinusoidal modulation
          const orbitalMod = 1.0 + 0.45 * Math.sin(petals * theta) * Math.sin(phi);
          const dist = radius * orbitalMod * 0.8 + (randn_bm() * 0.28);
          p.set(
            dist * Math.sin(phi) * Math.cos(theta),
            dist * Math.sin(phi) * Math.sin(theta),
            dist * Math.cos(phi)
          );
        }

        // Apply exactly rotated orientation matching the shell's tilt!
        p.applyAxisAngle(new THREE.Vector3(1, 0, 0), rotX);
        p.applyAxisAngle(new THREE.Vector3(0, 0, 1), rotZ);

        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;

        // Add subtle quantum color variations (slightly cooler/warmer shades)
        const pointColor = catColor.clone();
        if (Math.random() > 0.6) {
          pointColor.addScalar(0.12);
        } else {
          pointColor.addScalar(-0.08);
        }
        colors[i * 3] = pointColor.r;
        colors[i * 3 + 1] = pointColor.g;
        colors[i * 3 + 2] = pointColor.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const pTexture = createCircularParticleTexture();
      const material = new THREE.PointsMaterial({
        size: isLowPerfActive ? 0.08 : 0.045,
        vertexColors: true,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        map: pTexture,
      });

      densityCloud = new THREE.Points(geometry, material);
      densityCloud.userData = { isDensityCloud: true };
      scene.add(densityCloud);
    };

    const updateSelectedElementAtom = (el: ChemicalElement) => {
      // Clear previous world
      clearElementWorld();

      // Clear previous hit rings
      hitRings.forEach(hr => {
        shellGroup.remove(hr);
        hr.geometry.dispose();
        if (Array.isArray(hr.material)) {
          hr.material.forEach(m => m.dispose());
        } else {
          hr.material.dispose();
        }
      });
      hitRings = [];

      // Clear previous density cloud
      if (densityCloud) {
        scene.remove(densityCloud);
        densityCloud.geometry.dispose();
        if (Array.isArray(densityCloud.material)) {
          densityCloud.material.forEach((m: any) => m.dispose());
        } else {
          densityCloud.material.dispose();
        }
        densityCloud = null;
      }
      selectedShellIndex = null;

      // Clear previous orbits & electrons
      activeElectrons.forEach(e => {
        scene.remove(e.mesh);
        scene.remove(e.trail);
        e.mesh.geometry.dispose();
        (e.mesh.material as THREE.Material).dispose();
        e.trail.geometry.dispose();
      });
      activeElectrons = [];

      // Clear previous shell paths
      while (shellGroup.children.length > 0) {
        const child = shellGroup.children[0] as THREE.Line;
        shellGroup.remove(child);
        child.geometry.dispose();
        (child.material as THREE.Material).dispose();
      }

      // Configure dynamic procedural environmental lights and nucleus attributes based on element visual identity
      const visualPrimary = new THREE.Color(el.visual?.primaryColor || '#00E5FF');
      const catColor = visualPrimary; // Bound to fine-tuned element visual design color
      
      // Update Core Lights & Nucleus mesh emissions with visual primary
      coreLight.color.copy(visualPrimary);

      const nucleusMaterial = isLowPerfActive
        ? new THREE.MeshBasicMaterial({
            color: visualPrimary,
          })
        : new THREE.MeshPhongMaterial({
            color: visualPrimary,
            emissive: visualPrimary.clone().multiplyScalar(0.4),
            shininess: 120,
            specular: '#FFFFFF',
          });
      
      nucleons.forEach((node, idx) => {
        if (idx % 2 === 0) {
          node.material = nucleusMaterial;
        }
      });

      // Call our robust modular procedural world generator to build the custom atomic atmosphere!
      const pTexture = createCircularParticleTexture();
      const generated = buildProceduralAtomWorld(el, elementWorldGroup, pTexture);

      targetFogColor.copy(generated.targetFogColor);
      targetAmbientColor.copy(generated.targetAmbientColor);
      activeWorldAnimate = generated.activeWorldAnimate;

      // Spawn electron rings based on real structural shells with varying inclinations
      const activeShells = el.shells; // e.g. [2, 8, 1]
      
      // Shared optimized electron sphere geometry to reduce GPU memory and polygon counts
      const sharedElectronGeom = new THREE.SphereGeometry(0.18, 8, 6);

      activeShells.forEach((eCount, shellIdx) => {
        const radius = 3.5 + shellIdx * 2.2;
        
        // 1. Path ring geometry (reduced segments for high-DPI performance)
        const ringPoints: THREE.Vector3[] = [];
        const segments = 64;
        
        // Tilt shell planes differently to make it look breathtakingly 3D (Rutherford models)
        const rotX = (shellIdx * 0.38) + 0.15;
        const rotZ = (shellIdx * -0.28) - 0.1;

        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          const p = new THREE.Vector3(radius * Math.cos(theta), 0, (radius * 0.9) * Math.sin(theta));
          p.applyAxisAngle(new THREE.Vector3(1, 0, 0), rotX);
          p.applyAxisAngle(new THREE.Vector3(0, 0, 1), rotZ);
          ringPoints.push(p);
        }

        const ringGeom = new THREE.BufferGeometry().setFromPoints(ringPoints);
        const ringMat = new THREE.LineBasicMaterial({
          color: catColor,
          opacity: 0.18,
          transparent: true,
          blending: THREE.AdditiveBlending,
        });
        const pathRing = new THREE.Line(ringGeom, ringMat);
        pathRing.userData = { isVisualRing: true, shellIndex: shellIdx, defaultColor: catColor.clone() };
        shellGroup.add(pathRing);

        // Interactive hit ring (invisible Mesh ring for easy hover/click detection)
        const hitGeom = new THREE.RingGeometry(radius - 0.4, radius + 0.4, 32);
        const hitMat = new THREE.MeshBasicMaterial({
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.0,
          depthWrite: false
        });
        const hitRing = new THREE.Mesh(hitGeom, hitMat);
        // Align hitRing to face the camera matching the custom vector rotation logic
        hitRing.rotation.x = Math.PI / 2 + rotX;
        hitRing.rotation.z = rotZ;
        hitRing.userData = { isShellHit: true, shellIndex: shellIdx, radius };
        shellGroup.add(hitRing);
        hitRings.push(hitRing);

        // 2. Generate whizzing electrons
        const electronMat = new THREE.MeshBasicMaterial({
          color: catColor.clone().addScalar(0.35),
        });

        for (let ec = 0; ec < eCount; ec++) {
          const elMesh = new THREE.Mesh(sharedElectronGeom, electronMat.clone());
          const initialAngle = (ec / eCount) * Math.PI * 2;
          const speed = (0.012 / (shellIdx + 1)) * (0.85 + Math.random() * 0.3);

          // Generate physical parameters for customized elliptic Kepler mechanics
          const eccentricity = 0.1 + (shellIdx * 0.04) + Math.random() * 0.05;
          const semiMinorAxis = radius * Math.sqrt(1 - eccentricity * eccentricity);

          // Calculate exact starting position
          const initP = new THREE.Vector3(radius * Math.cos(initialAngle), 0, semiMinorAxis * Math.sin(initialAngle));
          initP.applyAxisAngle(new THREE.Vector3(1, 0, 0), rotX);
          initP.applyAxisAngle(new THREE.Vector3(0, 0, 1), rotZ);

          // Precompute trail renderer with a statically pre-populated Float32Array to avoid frame drops
          const maxTrailPoints = 25;
          const trailGeom = new THREE.BufferGeometry();
          const trailPositions = new Float32Array(maxTrailPoints * 3);
          for (let ti = 0; ti < maxTrailPoints; ti++) {
            trailPositions[ti * 3] = initP.x;
            trailPositions[ti * 3 + 1] = initP.y;
            trailPositions[ti * 3 + 2] = initP.z;
          }
          trailGeom.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
          
          const trailColor = catColor.clone();
          const trailMat = new THREE.LineBasicMaterial({
            color: trailColor,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
          });
          const trailLine = new THREE.Line(trailGeom, trailMat);
          scene.add(trailLine);

          activeElectrons.push({
            mesh: elMesh,
            shellRadius: radius,
            angle: initialAngle,
            speed,
            trail: trailLine,
            eccentricity,
            semiMinorAxis,
            quantumJumpTimer: 3 + Math.random() * 8, // seconds before a quick quantum hop!
            isJumping: false,
            jumpRatio: 0.0,
            baseColor: catColor.clone().addScalar(0.35),
            shellIndex: shellIdx,
            rotX,
            rotZ
          });
          
          scene.add(elMesh);
        }
      });
    };

    // Initialize layout distributions on load
    updateLayouts(layoutMode, selectedElement);

    // --- EVENT HANDLERS ---
    const handleMouseDown = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouse2D.set(x, y);

      const currentProps = propsRef.current;
      if (currentProps.appMode === 'bond_lab' && reactantA && reactantB && !isReactionStable) {
        raycaster.setFromCamera(mouse2D, camera);
        const intersects = raycaster.intersectObjects([reactantA, reactantB], true);
        if (intersects.length > 0) {
          isDragging = true;
          let ancestor: THREE.Object3D | null = intersects[0].object;
          while (ancestor && ancestor !== reactantA && ancestor !== reactantB) {
            ancestor = ancestor.parent;
          }
          if (ancestor === reactantA || ancestor === reactantB) {
            draggedReactant = ancestor as THREE.Group;
            import('../utils/audioSynth').then(({ OrbitiumAudio }) => {
              OrbitiumAudio.triggerReactionSynth(activeBondModeReaction);
            });
            return;
          }
        }
      }

      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      mouse2D.set(x, y);
      lastMouseMoveTime = clock.getElapsedTime();
      mouseActive = true;

      const currentProps = propsRef.current;
      if (isDragging) {
        if (currentProps.appMode === 'bond_lab' && draggedReactant && !isReactionStable) {
          raycaster.setFromCamera(mouse2D, camera);
          const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
          const projectPoint = new THREE.Vector3();
          raycaster.ray.intersectPlane(planeZ, projectPoint);

          draggedReactant.position.set(
            Math.max(-20, Math.min(20, projectPoint.x)),
            Math.max(-12, Math.min(12, projectPoint.y)),
            0
          );
          return;
        }

        // Drag rotation camera control
        const deltaX = e.clientX - previousMouseX;
        const deltaY = e.clientY - previousMouseY;

        rotYTarget -= deltaX * 0.005;
        rotXTarget -= deltaY * 0.005;

        // Constraint rotX
        rotXTarget = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, rotXTarget));

        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
      } else {
        // Ambient cursor parallax hover drift calculations
        cameraYOffsetTarget = y * 2.5;
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
      draggedReactant = null;
    };

    const updateMouseFromTouch = (touch: Touch) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
      mouse2D.set(x, y);
      lastMouseMoveTime = clock.getElapsedTime();
      mouseActive = true;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        updateMouseFromTouch(e.touches[0]);
        const currentProps = propsRef.current;
        if (currentProps.appMode === 'bond_lab' && reactantA && reactantB && !isReactionStable) {
          raycaster.setFromCamera(mouse2D, camera);
          const intersects = raycaster.intersectObjects([reactantA, reactantB], true);
          if (intersects.length > 0) {
            isDragging = true;
            let ancestor: THREE.Object3D | null = intersects[0].object;
            while (ancestor && ancestor !== reactantA && ancestor !== reactantB) {
              ancestor = ancestor.parent;
            }
            if (ancestor === reactantA || ancestor === reactantB) {
              draggedReactant = ancestor as THREE.Group;
              import('../utils/audioSynth').then(({ OrbitiumAudio }) => {
                OrbitiumAudio.triggerReactionSynth(activeBondModeReaction);
              });
              return;
            }
          }
        }

        isDragging = true;
        previousMouseX = e.touches[0].clientX;
        previousMouseY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        updateMouseFromTouch(e.touches[0]);
        const currentProps = propsRef.current;
        if (currentProps.appMode === 'bond_lab' && draggedReactant && !isReactionStable) {
          raycaster.setFromCamera(mouse2D, camera);
          const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
          const projectPoint = new THREE.Vector3();
          raycaster.ray.intersectPlane(planeZ, projectPoint);

          draggedReactant.position.set(
            Math.max(-20, Math.min(20, projectPoint.x)),
            Math.max(-12, Math.min(12, projectPoint.y)),
            0
          );
          return;
        }

        const deltaX = e.touches[0].clientX - previousMouseX;
        const deltaY = e.touches[0].clientY - previousMouseY;

        rotYTarget -= deltaX * 0.008;
        rotXTarget -= deltaY * 0.008;
        rotXTarget = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, rotXTarget));

        previousMouseX = e.touches[0].clientX;
        previousMouseY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
      draggedReactant = null;
    };

    // Element Click Selection Raycast
    const handleMouseClick = () => {
      if (!propsRef.current.isObsEntered) return;
      
      raycaster.setFromCamera(mouse2D, camera);

      // If an element is active, check shell interactions first
      if (propsRef.current.selectedElement) {
        const intersects = raycaster.intersectObjects(hitRings);
        if (intersects.length > 0) {
          const hitMesh = intersects[0].object;
          const clickedShellIndex = hitMesh.userData.shellIndex;
          const radius = hitMesh.userData.radius;
          
          if (clickedShellIndex !== undefined) {
            // Toggle clicked shell index
            selectedShellIndex = (selectedShellIndex === clickedShellIndex) ? null : clickedShellIndex;
            
            // Dispatch custom event to update high-tech HUD specs overlays
            window.dispatchEvent(new CustomEvent('orbit-shell-clicked', {
              detail: {
                selected: selectedShellIndex !== null,
                shellIndex: clickedShellIndex,
                shellName: getShellName(clickedShellIndex),
                electrons: propsRef.current.selectedElement.shells[clickedShellIndex] || 0,
                radius: radius,
                element: propsRef.current.selectedElement
              }
            }));

            // Play procedural quantum high-end chime
            import('../utils/audioSynth').then(({ OrbitiumAudio }) => {
              OrbitiumAudio.playUnlockChime();
            });

            // Rebuild the probabilistic volumetric density cloud
            rebuildDensityCloud(selectedShellIndex, propsRef.current.selectedElement);
          }
          return;
        }
      }
      
      const intersects = raycaster.intersectObjects(
        elementCards.map(c => c.mesh)
      );

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const clickedCard = elementCards.find(c => c.mesh === hitMesh);
        if (clickedCard) {
          onSelectElement(clickedCard.element);
        }
      }
    };

    const attachEvents = () => {
      const dom = renderer.domElement;
      dom.addEventListener('mousedown', handleMouseDown);
      dom.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      dom.addEventListener('click', handleMouseClick);

      // Mobile touch support
      dom.addEventListener('touchstart', handleTouchStart, { passive: true });
      dom.addEventListener('touchmove', handleTouchMove, { passive: true });
      dom.addEventListener('touchend', handleTouchEnd);
    };

    const detachEvents = () => {
      const dom = renderer.domElement;
      if (dom) {
        dom.removeEventListener('mousedown', handleMouseDown);
        dom.removeEventListener('mousemove', handleMouseMove);
        dom.removeEventListener('click', handleMouseClick);
        dom.removeEventListener('touchstart', handleTouchStart);
        dom.removeEventListener('touchmove', handleTouchMove);
        dom.removeEventListener('touchend', handleTouchEnd);
      }
      window.removeEventListener('mouseup', handleMouseUp);
    };

    attachEvents();

    // --- GAME RENDERING CYCLE ---
    let frameId: number;
    let clock = new THREE.Clock();

    let lastSelected: ChemicalElement | null = null;
    let lastLayout: TableLayoutMode = 'grid';

    // Adaptive Quality state and dynamic adjustments helper
    let isLowPerfActive = false;
    let consecutiveLowFpsChecks = 0;
    let consecutiveHighFpsChecks = 0;
    let frameCount = 0;
    let lastFpsUpdateTime = performance.now();

    const applyQualityScaleDown = (isLow: boolean) => {
      // Scale down particle counts inside geometries using setDrawRange
      spaceDust.geometry.setDrawRange(0, isLow ? Math.floor(particleCount * 0.3) : particleCount);
      atmosphericPlasma.geometry.setDrawRange(0, isLow ? Math.floor(plasmaCount * 0.3) : plasmaCount);
      deepConstellation.geometry.setDrawRange(0, isLow ? Math.floor(farStarCount * 0.2) : farStarCount);

      // Hide/reveal filaments to save draw calls and line shaders CPU cost
      networkLines.visible = !isLow;

      // Swap nucleon materials in the background nucleus to BasicMaterial
      nucleons.forEach((node, idx) => {
        node.material = isLow
          ? (idx % 2 === 0 ? protonBasicMat : neutronBasicMat)
          : (idx % 2 === 0 ? protonMat : neutronMat);
      });

      // Scale down pixel ratio to reduce GPU raster/pixel operations
      renderer.setPixelRatio(isLow ? 1.0 : Math.min(window.devicePixelRatio, 2));

      // Dim lighting intensities if scale down active to reduce heavy specular calculations
      blueDirLight.intensity = isLow ? 1.0 : 2.5;
      purpleDirLight.intensity = isLow ? 0.6 : 1.8;
      spotLight.intensity = isLow ? 1.8 : 3.8;
    };

    const renderLoop = () => {
      frameId = requestAnimationFrame(renderLoop);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      
      const currentProps = propsRef.current;
      const simMultiplier = currentProps.simulationSpeed;

      // Measure real-time FPS with hysteretic stabilization checks
      frameCount++;
      const currentTimer = performance.now();
      if (currentTimer >= lastFpsUpdateTime + 1000) {
        const currentMeasuredFps = Math.round((frameCount * 1000) / (currentTimer - lastFpsUpdateTime));
        frameCount = 0;
        lastFpsUpdateTime = currentTimer;

        // Callback to update diagnostics overlay with genuine real-time values
        currentProps.onFpsChange(currentMeasuredFps);

        if (currentProps.adaptiveQualityEnabled) {
          if (currentMeasuredFps < 50) {
            consecutiveLowFpsChecks++;
            consecutiveHighFpsChecks = 0;
            if (consecutiveLowFpsChecks >= 3 && !isLowPerfActive) {
              isLowPerfActive = true;
              currentProps.onLowPerfModeChange(true);
              applyQualityScaleDown(true);
            }
          } else {
            if (currentMeasuredFps >= 54) {
              consecutiveLowFpsChecks = 0;
              if (isLowPerfActive) {
                consecutiveHighFpsChecks++;
                if (consecutiveHighFpsChecks >= 4) {
                  isLowPerfActive = false;
                  currentProps.onLowPerfModeChange(false);
                  applyQualityScaleDown(false);
                }
              }
            }
          }
        } else {
          // If adaptive toggle is disabled, restore max quality
          if (isLowPerfActive) {
            isLowPerfActive = false;
            currentProps.onLowPerfModeChange(false);
            applyQualityScaleDown(false);
          }
          consecutiveLowFpsChecks = 0;
          consecutiveHighFpsChecks = 0;
        }
      }

      // 1. Detect dynamic layout swaps or selection changes
      if (currentProps.layoutMode !== lastLayout || currentProps.selectedElement !== lastSelected) {
        lastLayout = currentProps.layoutMode;
        lastSelected = currentProps.selectedElement;
        
        updateLayouts(currentProps.layoutMode, currentProps.selectedElement);
        
        if (currentProps.selectedElement) {
          updateSelectedElementAtom(currentProps.selectedElement);
        } else {
          clearElementWorld();
          targetFogColor.set(defaultFogHex);
          targetAmbientColor.set(defaultAmbientHex);

          // Clear active shell visualization density cloud
          if (densityCloud) {
            scene.remove(densityCloud);
            densityCloud.geometry.dispose();
            if (Array.isArray(densityCloud.material)) {
              densityCloud.material.forEach((m: any) => m.dispose());
            } else {
              densityCloud.material.dispose();
            }
            densityCloud = null;
          }
          selectedShellIndex = null;
        }
      }

      // 2. Cinematic weightless floating and panning drone camera response
      let cameraTargetZ = 42;
      let cameraTargetY = 0;
      let cameraTargetX = 0;

      if (!currentProps.isObsEntered) {
        // Welcoming rotating cosmic sweep
        cameraTargetZ = 52;
        cameraTargetY = 12;
        cameraTargetX = Math.sin(elapsed * 0.12) * 22;
        
        rotYTarget = elapsed * 0.05;
        rotXTarget = -0.15;
      } else if (currentProps.selectedElement) {
        // Detailed Atom view focusing, camera offset to handle HUD neatness
        cameraTargetX = 4.8; 
        cameraTargetY = -0.2;
        cameraTargetZ = (16.5 + currentProps.selectedElement.shells.length * 1.5) * zoomScaleMultiplier;
        
        rotXTarget *= 0.95;
        rotYTarget *= 0.95;
      } else if (currentProps.appMode === 'bond_lab') {
        // High-end cinematic reaction camera tracking
        if (isReactionStable) {
          // Zoom in beautifully on the synthesized molecular mesh!
          cameraTargetX = 0;
          cameraTargetY = 0.5;
          cameraTargetZ = 16.5 * zoomScaleMultiplier;
        } else {
          // Dynamic zoom: as elements approach each other, camera automatically glides closer to emphasize structural matter!
          if (reactantA && reactantB) {
            const currentDist = reactantA.position.distanceTo(reactantB.position);
            cameraTargetZ = (19.0 + Math.min(9.0, currentDist * 0.6)) * zoomScaleMultiplier;
            cameraTargetY = Math.max(-1.5, -2.5 + (currentDist * 0.12));
          } else {
            cameraTargetZ = 28.0 * zoomScaleMultiplier;
            cameraTargetY = 0.0;
          }
          cameraTargetX = 0;
        }
        rotYTarget += (0 - rotYTarget) * 0.1;
        rotXTarget += (0 - rotXTarget) * 0.1;
      } else {
        if (currentProps.layoutMode === 'spiral') {
          cameraTargetZ = 30 * zoomScaleMultiplier;
          cameraTargetY = 2;
        } else if (currentProps.layoutMode === 'sphere') {
          cameraTargetZ = 38 * zoomScaleMultiplier;
          cameraTargetY = 0;
        } else {
          cameraTargetZ = 38 * zoomScaleMultiplier;
          cameraTargetY = 0.5;
        }
      }

      // Track mouse activity decaying over time
      if (mouseActive && elapsed - lastMouseMoveTime > 2.0) {
        mouseActive = false;
      }

      // Frame-rate independent lerp factors using exponential decay
      const animationSpeedScale = 5.0; // speed constant
      const lerpFactor = Math.min(1.0, animationSpeedScale * delta);
      const cameraLerpFactor = Math.min(1.0, 4.0 * delta);

      // Drag calculations slerp (Frame-rate independent)
      currentRotX += (rotXTarget - currentRotX) * lerpFactor;
      currentRotY += (rotYTarget - currentRotY) * lerpFactor;

      // Cinematic buoyancy drift offsets (lissajous shapes for alive zero-G perspective)
      const buoyancyX = Math.sin(elapsed * 0.35) * 1.2;
      const buoyancyY = Math.cos(elapsed * 0.28) * 0.8;
      const buoyancyZ = Math.sin(elapsed * 0.18) * 0.6;

      // Elastic cursor parallax
      const targetParallaxX = mouse2D.x * 3.5;
      const targetParallaxY = mouse2D.y * 2.2;
      currentParallaxX += (targetParallaxX - currentParallaxX) * lerpFactor;
      currentParallaxY += (targetParallaxY - currentParallaxY) * lerpFactor;

      // Apply integrated slerp positioning (Frame-rate independent)
      camera.position.x += (cameraTargetX + buoyancyX + currentParallaxX - camera.position.x) * cameraLerpFactor;
      camera.position.y += (cameraTargetY + buoyancyY + currentParallaxY + cameraYOffsetTarget - camera.position.y) * cameraLerpFactor;
      camera.position.z += (cameraTargetZ + buoyancyZ - camera.position.z) * cameraLerpFactor;

      // Apply highly immersive reactive screen-shake offsets
      if (shakeIntensity > 0.01) {
        const shakeX = (Math.random() - 0.5) * shakeIntensity;
        const shakeY = (Math.random() - 0.5) * shakeIntensity;
        const shakeZ = (Math.random() - 0.5) * shakeIntensity * 0.4; // Slightly damped in Z depth to avoid clip-throughs
        
        camera.position.x += shakeX;
        camera.position.y += shakeY;
        camera.position.z += shakeZ;

        // Fluid physical exponential damping over time
        shakeIntensity *= Math.exp(-6.5 * delta);
        if (shakeIntensity < 0.01) shakeIntensity = 0;
      }

      // Rotate nested background scientific observatory coordinates (Observation Rings & Lattice geometry)
      if (bgObservationGroup) {
        bgObservationGroup.rotation.y = elapsed * 0.008 * simMultiplier;
        bgObservationGroup.rotation.x = elapsed * 0.003 * simMultiplier;
        if (bgRing1) bgRing1.rotation.z = elapsed * -0.012 * simMultiplier;
        if (bgRing2) bgRing2.rotation.z = elapsed * 0.016 * simMultiplier;
        if (bgStructure) bgStructure.rotation.y = elapsed * -0.005 * simMultiplier;
      }

      // Animate the 3D Scientific Sectors
      if (sectorsGroup && sectorsGroup.children.length > 0) {
        sectorsGroup.children.forEach((sec, idx) => {
          const breath = 1.0 + Math.sin(elapsed * 1.1 + idx) * 0.05;
          sec.scale.setScalar(breath);
          
          sec.children.forEach(child => {
            if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
              child.rotation.y += 0.004 * simMultiplier * (idx % 2 === 0 ? 1 : -1);
              child.rotation.x += 0.0018 * simMultiplier;
            }
            if (child instanceof THREE.Points) {
              child.rotation.y -= 0.005 * simMultiplier;
            }
          });
          
          const def = sectorDefs[idx];
          if (def) {
            sec.position.x = def.pos.x + Math.sin(elapsed * 0.45 + idx) * 0.35;
            sec.position.y = def.pos.y + Math.cos(elapsed * 0.35 + idx) * 0.25;
            sec.position.z = def.pos.z + Math.sin(elapsed * 0.25 + idx) * 0.22;
          }
        });
      }

      // Point camera cinematic look
      const cameraLookTarget = new THREE.Vector3(currentProps.selectedElement ? 3.0 : 0, 0, 0);
      camera.lookAt(cameraLookTarget);

      // Slerp structures rotations
      cardGroup.rotation.x = currentRotX;
      cardGroup.rotation.y = currentRotY;

      // Responsive directional/ambient lights tilt
      blueDirLight.position.set(-15 + mouse2D.x * 12, 20 - mouse2D.y * 10, 15);
      purpleDirLight.position.set(15 - mouse2D.x * 12, -15 + mouse2D.y * 10, 10);
      spotLight.position.set(mouse2D.x * 15, 25 - mouse2D.y * 5, 25 + Math.sin(elapsed) * 3);

      // Interpolate adaptive background and atmospheric fog / ambient colors
      currentFogColor.lerp(targetFogColor, 0.035);
      ambientLight.color.lerp(targetAmbientColor, 0.035);

      // Update network lines based on current card mesh positions with elegant real-time pulsing
      if (networkLines && networkLines.geometry.attributes.position) {
        const netPosAttr = networkLines.geometry.attributes.position as THREE.BufferAttribute;
        let netIdx = 0;
        periodicConnections.forEach(([fromIdx, toIdx]) => {
          const fromCard = elementCards[fromIdx];
          const toCard = elementCards[toIdx];
          if (fromCard && toCard) {
            const p1 = fromCard.mesh.position;
            const p2 = toCard.mesh.position;
            
            netPosAttr.setXYZ(netIdx, p1.x, p1.y, p1.z);
            netPosAttr.setXYZ(netIdx + 1, p2.x, p2.y, p2.z);
            netIdx += 2;
          }
        });
        netPosAttr.needsUpdate = true;
        
        // Synaptic grid energy pulsing flow
        const activeMultiplier = currentProps.appMode === 'bond_lab' ? 0.04 : 1.0;
        (networkLines.material as THREE.LineBasicMaterial).opacity = 
          (0.25 + Math.sin(elapsed * 2.5) * 0.1) * activeMultiplier;
      }

      // Highlights path of the active hovered element
      if (hoverNetworkLines && hoverNetworkLines.geometry.attributes.position) {
        const hoverPosAttr = hoverNetworkLines.geometry.attributes.position as THREE.BufferAttribute;
        if (currentProps.hoveredElement && !currentProps.selectedElement) {
          const hoverIdx = ELEMENTS_DATA.findIndex(e => e.number === currentProps.hoveredElement?.number);
          if (hoverIdx !== -1 && elementCards[hoverIdx]) {
            let segmentIdx = 0;
            const connectedWithHover: number[] = [];
            
            periodicConnections.forEach(([fromIdx, toIdx]) => {
              if (fromIdx === hoverIdx) {
                connectedWithHover.push(toIdx);
              } else if (toIdx === hoverIdx) {
                connectedWithHover.push(fromIdx);
              }
            });

            const p1 = elementCards[hoverIdx].mesh.position;
            connectedWithHover.forEach(neighIdx => {
              if (segmentIdx < 32 && elementCards[neighIdx]) {
                const p2 = elementCards[neighIdx].mesh.position;
                hoverPosAttr.setXYZ(segmentIdx * 2, p1.x, p1.y, p1.z);
                hoverPosAttr.setXYZ(segmentIdx * 2 + 1, p2.x, p2.y, p2.z);
                segmentIdx++;
              }
            });

            // Pad remaining vertices to 0
            for (let i = segmentIdx; i < 32; i++) {
              hoverPosAttr.setXYZ(i * 2, p1.x, p1.y, p1.z);
              hoverPosAttr.setXYZ(i * 2 + 1, p1.x, p1.y, p1.z);
            }
            hoverPosAttr.needsUpdate = true;
            (hoverNetworkLines.material as THREE.LineBasicMaterial).opacity = 0.55 + Math.sin(elapsed * 5) * 0.15;
            const catColorHex = CATEGORY_COLORS[currentProps.hoveredElement.category]?.hex || '#FFFFFF';
            (hoverNetworkLines.material as THREE.LineBasicMaterial).color.set(catColorHex);
          }
        } else {
          (hoverNetworkLines.material as THREE.LineBasicMaterial).opacity = 0.0;
        }
      }

      // 2E. Animate custom element worlds
      if (currentProps.selectedElement && activeWorldAnimate) {
        activeWorldAnimate(elapsed, delta, simMultiplier);
      }

      // Low frequency breathing of background & spotlight cores
      ambientLight.intensity = 1.35 + Math.sin(elapsed * 0.65) * 0.18;
      spotLight.intensity = 3.8 + Math.sin(elapsed * 1.25) * 0.6 + Math.cos(elapsed * 2.8) * 0.3;

      // 3. Move and float each element card
      // Raycast ONLY if inside observatory, not viewing detail, and mouse/touch active to save up to 90% CPU
      let intersects: THREE.Intersection[] = [];
      if (currentProps.isObsEntered && !currentProps.selectedElement && (mouseActive || isDragging || elapsed - lastMouseMoveTime < 0.5)) {
        raycaster.setFromCamera(mouse2D, camera);
        intersects = raycaster.intersectObjects(cardGroup.children, true);
      }
      
      let hoveredMesh: THREE.Object3D | null = null;
      if (intersects.length > 0) {
        hoveredMesh = intersects[0].object;
      }

      let currentHoveredElement: ChemicalElement | null = null;
      const layoutLerpFactor = Math.min(1.0, 5.0 * delta);

      elementCards.forEach((ci) => {
        ci.mesh.position.lerp(ci.targetPosition, layoutLerpFactor);
        
        // Systemic Scientific Behavior: elements move and respond based on their chemical category
        const cat = ci.element.category;
        let floatFactor = 0;
        let jitterX = 0;
        let jitterZ = 0;
        let rotationWobble = 0;
        const speedMult = currentProps.simulationSpeed;

        if (cat === 'noble-gas') {
          // Noble Gases: Calm, slow, stable, elegant floating curves
          floatFactor = Math.sin(elapsed * 0.45 * speedMult + ci.floatOffset) * 0.08;
        } else if (cat === 'alkali-metal') {
          // Alkali Metals: Volatile, fast, high-frequency, highly active energy vibration
          floatFactor = Math.sin(elapsed * 3.6 * speedMult + ci.floatOffset) * 0.22 + Math.cos(elapsed * 7.5) * 0.06;
          jitterX = Math.sin(elapsed * 12.0 + ci.floatOffset) * 0.04;
          rotationWobble = Math.cos(elapsed * 8.5) * 0.08;
        } else if (cat === 'actinide' || cat === 'lanthanide') {
          // Radioactive Elements: Instability, sudden distorted quantum jumps/jitters
          floatFactor = Math.sin(elapsed * 2.0 * speedMult + ci.floatOffset) * 0.16 + Math.cos(elapsed * 4.2) * 0.04;
          if (Math.random() > 0.95) {
            jitterX = (Math.random() - 0.5) * 0.18;
            jitterZ = (Math.random() - 0.5) * 0.18;
            rotationWobble = (Math.random() - 0.5) * 0.09;
          }
        } else if (cat === 'transition-metal') {
          // Transition Metals: Dense, heavy, rigid structured industrial movement
          floatFactor = Math.sin(elapsed * 0.6 * speedMult + ci.floatOffset) * 0.04;
        } else {
          // Standard elements
          floatFactor = Math.sin(elapsed * 1.35 * speedMult + ci.floatOffset) * 0.14;
        }

        const applyPhysics = !currentProps.selectedElement;
        if (applyPhysics) {
          ci.mesh.position.x += jitterX;
          ci.mesh.position.y += floatFactor;
          ci.mesh.position.z += jitterZ;
        }

        // Smoothly rotate cards towards targeted layout angle (Frame-rate independent + dynamic scientific wobble)
        const rotTarget = ci.targetRotation.clone();
        if (applyPhysics) {
          rotTarget.z += rotationWobble;
        }
        const targetQ = new THREE.Quaternion().setFromEuler(rotTarget);
        ci.mesh.quaternion.slerp(targetQ, layoutLerpFactor);

        // Hover forward thrust inside grid matrices based on discovery status
        const isDiscovered = currentProps.appMode !== 'timeline' || ci.element.year <= currentProps.timelineYear;
        const isCurrentlyHovered = isDiscovered && hoveredMesh && (hoveredMesh === ci.mesh || hoveredMesh.parent === ci.mesh);
        const outlineMat = ci.glowOutline.material as THREE.LineBasicMaterial;
        
        let targetScale = 1.05;
        let targetOpacity = isDiscovered ? (0.35 + Math.sin(elapsed * 1.8 + ci.floatOffset) * 0.08) : 0.01;
        let emissiveIntensity = 1.0;

        if (isCurrentlyHovered && !currentProps.selectedElement && currentProps.isObsEntered) {
          currentHoveredElement = ci.element;
          
          ci.mesh.translateZ(0.65);
          emissiveIntensity = 1.6 + 0.45 * Math.sin(elapsed * 12);
          targetScale = 1.15 + 0.02 * Math.sin(elapsed * 12);
          targetOpacity = 0.95 + Math.sin(elapsed * 12) * 0.05;
        } else {
          targetScale = 1.05;
          targetOpacity = isDiscovered ? (0.35 + Math.sin(elapsed * 1.8 + ci.floatOffset) * 0.08) : 0.01;
          emissiveIntensity = 1.0;

          if (isDiscovered && ci.element.category === 'actinide') {
            const flicker = Math.random() > 0.88 ? 0.9 : 0.35;
            targetOpacity = flicker;
          }
        }

        // Apply smooth scale transition using frame-rate independent elements lerping
        const scaleLerpFactor = Math.min(1.0, 12.0 * delta);
        ci.glowOutline.scale.x += (targetScale - ci.glowOutline.scale.x) * scaleLerpFactor;
        ci.glowOutline.scale.y += (targetScale - ci.glowOutline.scale.y) * scaleLerpFactor;
        ci.glowOutline.scale.z += (targetScale - ci.glowOutline.scale.z) * scaleLerpFactor;

        // Apply animated emissive glow intensity color multiplier
        const categoryConfig = CATEGORY_COLORS[ci.element.category] || { hex: '#00E5FF' };
        const baseColor = new THREE.Color(categoryConfig.hex);
        outlineMat.color.copy(baseColor).multiplyScalar(emissiveIntensity);
        outlineMat.opacity += (targetOpacity - outlineMat.opacity) * scaleLerpFactor;

        // Apply general grid fading, hide during Bond Lab, and fade undiscovered elements
        if (currentProps.appMode === 'bond_lab') {
          ci.material.opacity += (0.01 - ci.material.opacity) * 0.2;
          ci.glowOutline.visible = false;
          ci.mesh.visible = ci.material.opacity > 0.02;
        } else if (currentProps.selectedElement) {
          const isSelected = ci.element.number === currentProps.selectedElement.number;
          ci.material.opacity += ((isSelected ? 1.0 : 0.0) - ci.material.opacity) * 0.15;
          ci.glowOutline.visible = isSelected;
          ci.mesh.visible = ci.material.opacity > 0.02;
        } else {
          if (!isDiscovered) {
            ci.material.opacity += (0.04 - ci.material.opacity) * 0.2;
            ci.glowOutline.visible = false;
            ci.mesh.visible = ci.material.opacity > 0.01;
          } else {
            ci.mesh.visible = true;
            ci.material.opacity += (0.9 - ci.material.opacity) * 0.15;
            ci.glowOutline.visible = true;
          }
        }
      });

      // 3B. Reactant & Fusion collision loop in Bond Lab mode
      if (currentProps.appMode !== 'bond_lab') {
        if (reactantA) reactantA.visible = false;
        if (reactantB) reactantB.visible = false;
        if (fusionShockwave) fusionShockwave.visible = false;
        if (sparkPoints) sparkPoints.visible = false;
        if (productMoleculeGroup) {
          scene.remove(productMoleculeGroup);
          productMoleculeGroup = null;
        }
        if (chamberRingsGroup) chamberRingsGroup.visible = false;
      } else {
        // Safe check to spawn reactants if empty or config changed
        if (currentProps.activeReaction && activeBondModeReaction?.productFormula !== currentProps.activeReaction.productFormula) {
          spawnReactants(currentProps.activeReaction);
        }

        // Keep chamber rings visible
        if (chamberRingsGroup) {
          chamberRingsGroup.visible = true;
          // Rotate chamber core rings smoothly
          if (chamberRing1) chamberRing1.rotation.z += 0.003 * simMultiplier;
          if (chamberRing2) {
            chamberRing2.rotation.y += 0.005 * simMultiplier;
            chamberRing2.rotation.x += 0.002 * simMultiplier;
          }

          // Dynamic light levels based on reaction distance
          if (reactantA && reactantB && !isReactionStable) {
            const currentDist = reactantA.position.distanceTo(reactantB.position);
            const intensityAlpha = 0.1 + (1.0 - Math.min(1.0, currentDist / 17.0)) * 0.35;
            if (ringOuterMat) ringOuterMat.opacity = intensityAlpha + Math.sin(elapsed * 6.5) * 0.03;
            if (ringInnerMat) ringInnerMat.opacity = (intensityAlpha * 0.72) + Math.cos(elapsed * 5.0) * 0.025;
          } else if (isReactionStable) {
            // Highly charged energy output
            if (ringOuterMat) ringOuterMat.opacity = 0.35 + Math.sin(elapsed * 9.0) * 0.06;
            if (ringInnerMat) ringInnerMat.opacity = 0.22 + Math.cos(elapsed * 7.0) * 0.04;
          } else {
            if (ringOuterMat) ringOuterMat.opacity = 0.15;
            if (ringInnerMat) ringInnerMat.opacity = 0.08;
          }
        }

        if (reactantA && reactantB) {
          reactantA.visible = !isReactionStable;
          reactantB.visible = !isReactionStable;

          // Spin orbits
          const ringA = reactantA.userData.ring as THREE.Mesh;
          const ringB = reactantB.userData.ring as THREE.Mesh;
          if (ringA) ringA.rotation.z += 0.012 * simMultiplier;
          if (ringB) ringB.rotation.z += 0.015 * simMultiplier;

          // Move dynamic shells multi-electron systems
          const meshesA = reactantA.userData.electronMeshes as Array<{
            mesh: THREE.Mesh;
            radius: number;
            speed: number;
            angleOffset: number;
            tiltX: number;
            tiltY: number;
          }>;
          const meshesB = reactantB.userData.electronMeshes as Array<{
            mesh: THREE.Mesh;
            radius: number;
            speed: number;
            angleOffset: number;
            tiltX: number;
            tiltY: number;
          }>;

          if (meshesA) {
            meshesA.forEach((e) => {
              const theta = elapsed * e.speed * simMultiplier + e.angleOffset;
              e.mesh.position.set(Math.cos(theta) * e.radius, Math.sin(theta) * e.radius, 0);
              e.mesh.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), e.tiltX);
              e.mesh.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), e.tiltY);
            });
          } else {
            // Legacy single electron fallback
            const electronA = reactantA.userData.electron as THREE.Mesh;
            const angleA = elapsed * 3.5 * simMultiplier;
            if (electronA) {
              electronA.position.set(Math.cos(angleA) * 2.1, Math.sin(angleA) * 2.1, 0);
              electronA.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2.5);
            }
          }

          if (meshesB) {
            meshesB.forEach((e) => {
              const theta = -elapsed * e.speed * simMultiplier + e.angleOffset;
              e.mesh.position.set(Math.cos(theta) * e.radius, Math.sin(theta) * e.radius, 0);
              e.mesh.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), e.tiltX);
              e.mesh.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), e.tiltY);
            });
          } else {
            // Legacy single electron fallback
            const electronB = reactantB.userData.electron as THREE.Mesh;
            const angleB = -elapsed * 4.0 * simMultiplier;
            if (electronB) {
              electronB.position.set(Math.cos(angleB) * 2.1, Math.sin(angleB) * 2.1, 0);
              electronB.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2.5);
            }
          }

          // Face element indicators towards center
          const billboardA = reactantA.userData.symbolMesh as THREE.Mesh;
          const billboardB = reactantB.userData.symbolMesh as THREE.Mesh;
          if (billboardA) billboardA.lookAt(camera.position);
          if (billboardB) billboardB.lookAt(camera.position);

          // Proximity collision detection
          if (!isReactionStable) {
            const dist = reactantA.position.distanceTo(reactantB.position);
            
            // MAGNETIC DRIFT ATTRACTION FIELD MECHANICS
            if (!draggedReactant) {
              const forceStrength = Math.max(0.005, (12.0 - dist) * 0.035); // pull gets exponentially higher inside field
              const pullDirection = new THREE.Vector3().subVectors(reactantB.position, reactantA.position).normalize();
              const driftStep = pullDirection.multiplyScalar(forceStrength * delta * 50.0 * simMultiplier);
              reactantA.position.add(driftStep);
              reactantB.position.sub(driftStep);
            }

            if (frameCount % 3 === 0) {
              window.dispatchEvent(new CustomEvent('tether-distance', { detail: { distance: dist } }));
            }

            // Sync with procedural audio synthesizer frequency
            import('../utils/audioSynth').then(({ OrbitiumAudio }) => {
              OrbitiumAudio.updateTetherProximity(dist);
            });

            // GATED COLLISION METRIC
            if (dist < 2.3) {
              isReactionStable = true;
              reactantA.visible = false;
              reactantB.visible = false;

              cameraTargetX = 0;
              cameraTargetY = 0;

              // Center reaction explosion shockwave
              const midPoint = new THREE.Vector3().addVectors(reactantA.position, reactantB.position).multiplyScalar(0.5);
              
              // CREATE THE BEAUTIFUL 3D PRODUCT MOLECULE SOLID FOR REAL TRANSFORMATION
              if (productMoleculeGroup) scene.remove(productMoleculeGroup);
              productMoleculeGroup = createProductMolecule(activeBondModeReaction, midPoint);
              scene.add(productMoleculeGroup);

              if (fusionShockwave) {
                fusionShockwave.position.copy(midPoint);
                fusionShockwave.visible = true;
                (fusionShockwave.material as THREE.MeshBasicMaterial).opacity = 1.0;
                fusionShockwave.scale.set(0.1, 0.1, 0.1);
                
                // Customize color based on visual type
                const vType = activeBondModeReaction?.visualType;
                if (vType === 'explosion') {
                  (fusionShockwave.material as THREE.MeshBasicMaterial).color.set('#FF3D00');
                } else if (vType === 'covalent') {
                  (fusionShockwave.material as THREE.MeshBasicMaterial).color.set('#00E5FF');
                } else {
                  (fusionShockwave.material as THREE.MeshBasicMaterial).color.set('#FFD700');
                }
              }

              if (sparkPoints) {
                sparkPoints.position.copy(midPoint);
                sparkPoints.visible = true;
                (sparkPoints.material as THREE.PointsMaterial).opacity = 1.0;
                const sparAttr = sparkPoints.geometry.attributes.position as THREE.BufferAttribute;
                const sArr = sparAttr.array as Float32Array;
                for (let si = 0; si < sArr.length; si++) sArr[si] = 0;
                sparAttr.needsUpdate = true;
              }

              // Event dispatch to reset UI overlays
              window.dispatchEvent(new CustomEvent('reaction-stage', { detail: { stage: 'stable' } }));

              // Play explosive collision sound from Web Audio synthesizer
              import('../utils/audioSynth').then(({ OrbitiumAudio }) => {
                const reactionType = activeBondModeReaction ? activeBondModeReaction.visualType : 'explosion';
                OrbitiumAudio.triggerReactionFusingRelease(reactionType);
              });
            }
          }
        }
      }

      // 3C. Sparks & shockwaves particle animation logic
      if (fusionShockwave && fusionShockwave.visible) {
        fusionShockwave.scale.addScalar(15.0 * delta * simMultiplier);
        (fusionShockwave.material as THREE.MeshBasicMaterial).opacity -= 1.8 * delta * simMultiplier;
        if ((fusionShockwave.material as THREE.MeshBasicMaterial).opacity <= 0) {
          fusionShockwave.visible = false;
        }
      }

      if (sparkPoints && sparkPoints.visible) {
        const sparAttr = sparkPoints.geometry.attributes.position as THREE.BufferAttribute;
        const sArr = sparAttr.array as Float32Array;
        for (let si = 0; si < sArr.length / 3; si++) {
          const speed = sparkSpeeds ? sparkSpeeds[si] : 5.0;
          const dirX = sparkDirections ? sparkDirections[si * 3] : 0;
          const dirY = sparkDirections ? sparkDirections[si * 3 + 1] : 1;
          const dirZ = sparkDirections ? sparkDirections[si * 3 + 2] : 0;

          sArr[si * 3] += dirX * speed * delta * simMultiplier;
          sArr[si * 3 + 1] += dirY * speed * delta * simMultiplier;
          sArr[si * 3 + 2] += dirZ * speed * delta * simMultiplier;
        }
        sparAttr.needsUpdate = true;
        (sparkPoints.material as THREE.PointsMaterial).opacity -= 1.4 * delta * simMultiplier;
        if ((sparkPoints.material as THREE.PointsMaterial).opacity <= 0) {
          sparkPoints.visible = false;
        }
      }

      // 3D. Animate formed product molecule structures
      if (currentProps.appMode === 'bond_lab' && productMoleculeGroup && productMoleculeGroup.visible) {
        // Slow organic rotation of the molecular formula matrix
        productMoleculeGroup.rotation.y = elapsed * 0.4;
        productMoleculeGroup.rotation.x = Math.sin(elapsed * 0.2) * 0.15;
        productMoleculeGroup.rotation.z = Math.cos(elapsed * 0.15) * 0.1;

        // Weightless zero-G floating displacement
        productMoleculeGroup.position.y = Math.sin(elapsed * 1.5) * 0.22;

        // Animated diagnostic laser swept ring inside molecule
        const scanner = productMoleculeGroup.userData.scanner as THREE.Mesh;
        if (scanner) {
          scanner.position.y = -3.2 + Math.sin(elapsed * 1.8) * 3.4;
          (scanner.material as THREE.MeshBasicMaterial).opacity = 0.12 + (1.0 - Math.abs(scanner.position.y / 3.4)) * 0.38;
        }

        // Active CsOH ionization field ring
        const ionRing = productMoleculeGroup.userData.ionRing as THREE.Mesh;
        if (ionRing) {
          ionRing.rotation.z += 0.04 * simMultiplier;
          ionRing.rotation.y = Math.sin(elapsed) * 0.4;
        }

        // Separate molecular H2 dimer oscillation
        const dimer = productMoleculeGroup.userData.dimer as THREE.Group;
        if (dimer) {
          dimer.position.y = -2.0 + Math.sin(elapsed * 3.5) * 0.3;
          dimer.rotation.y += 0.02 * simMultiplier;
        }

        // Diagnostic HUD label billboards to align facing the observer's camera
        const label = productMoleculeGroup.userData.labelMesh as THREE.Mesh;
        if (label) {
          label.lookAt(camera.position);
        }

        // Animate Bond Energy Aura Core Indicator: continuous breathing-pulsation & spinning of holographic shells
        const auraShell1 = productMoleculeGroup.userData.auraShell1 as THREE.Mesh;
        const auraShell2 = productMoleculeGroup.userData.auraShell2 as THREE.Mesh;
        if (auraShell1 && auraShell2) {
          // Slow contrasting rotation vectors
          auraShell1.rotation.y = elapsed * 0.15 * simMultiplier;
          auraShell1.rotation.z = elapsed * -0.05 * simMultiplier;
          auraShell2.rotation.y = elapsed * -0.22 * simMultiplier;
          
          // Breathing scale fluctuations mimicking active quantum energy fields (higher value = more active/volatile pulse)
          const config = productMoleculeGroup.userData.energyConfig || { value: 300, maxLimit: 2000 };
          const activityRate = 1.2 + (config.value / config.maxLimit) * 3.5;
          const fluctuationIntensity = 0.02 + (config.value / config.maxLimit) * 0.08;
          
          const pulse = 1.0 + Math.sin(elapsed * activityRate) * fluctuationIntensity;
          auraShell1.scale.setScalar(pulse);
          auraShell2.scale.setScalar(1.0 + Math.cos(elapsed * activityRate * 1.1) * (fluctuationIntensity * 0.7));
        }
      }

      // --- ANIMATE HOLOGRAPHIC BOND ENERGY DETECTOR (ENERGY METER) ---
      if (currentProps.appMode === 'bond_lab' && energyMeterGroup) {
        if (activeBondModeReaction) {
          const formula = activeBondModeReaction.productFormula;
          const energyConfig = BOND_ENERGIES[formula] || { value: 300, unit: 'kJ/mol', color: '#00FFB3', maxLimit: 2000 };
          
          // Calculate target level ratio
          // If stable, fill up to the actual value percentage
          // If in progress and reactants exist, fill dynamically as they approach
          let targetRatio = 0.05;
          if (isReactionStable) {
            targetRatio = energyConfig.value / energyConfig.maxLimit;
          } else if (reactantA && reactantB) {
            const currentDist = reactantA.position.distanceTo(reactantB.position);
            // Climbs to 0.45 of the final target scale as distance closes
            const distanceClimb = (1.0 - Math.min(1.0, currentDist / 17.0)) * 0.42;
            targetRatio = 0.05 + distanceClimb * (energyConfig.value / energyConfig.maxLimit);
          }

          // Smooth interpolation matching simulation speed
          currentLevelRatio += (targetRatio - currentLevelRatio) * 0.1 * simMultiplier;

          // Scale the energy core cylinder bar
          if (energyBarMesh) {
            energyBarMesh.scale.y = Math.max(0.001, currentLevelRatio);
          }

          // Update neon colors of the bar matching reaction type
          const reactionColor = new THREE.Color(energyConfig.color);
          if (energyBarMat) {
            energyBarMat.color.copy(reactionColor);
            energyBarMat.emissive.copy(reactionColor);
            // Core pulsing effect
            energyBarMat.emissiveIntensity = 0.35 + Math.sin(elapsed * 8.5) * 0.2;
          }

          // Light up the horizontal indicator segment bars
          const activeSegmentsCount = Math.min(8, Math.ceil(currentLevelRatio * 8));
          for (let s = 0; s < 8; s++) {
            const segMat = energySegmentMats[s];
            if (segMat) {
              if (s < activeSegmentsCount) {
                segMat.color.copy(reactionColor);
                segMat.emissive.copy(reactionColor);
                segMat.emissiveIntensity = 0.4 + Math.sin(elapsed * 10.0 + s * 1.5) * 0.25;
                segMat.opacity = 0.85;
              } else {
                segMat.color.set('#00E5FF');
                segMat.emissive.set('#00E5FF');
                segMat.emissiveIntensity = 0.05;
                segMat.opacity = 0.2;
              }
            }
          }

          // Face HUD Billboard towards camera and update values
          const labelMesh = energyMeterGroup.userData.labelMesh as THREE.Mesh;
          if (labelMesh) {
            labelMesh.lookAt(camera.position);

            if (frameCount % 4 === 0) {
              const displayedValue = isReactionStable 
                ? energyConfig.value 
                : Math.round(currentLevelRatio * energyConfig.maxLimit);
              
              energyMeterGroup.userData.updateLabel(formula, displayedValue, energyConfig.color);
            }
          }
        } else {
          // Reset when no active reaction
          currentLevelRatio += (0.001 - currentLevelRatio) * 0.15 * simMultiplier;
          if (energyBarMesh) energyBarMesh.scale.y = currentLevelRatio;
          
          if (energyBarMat) {
            energyBarMat.color.set('#00FFB3');
            energyBarMat.emissive.set('#00FFB3');
            energyBarMat.emissiveIntensity = 0.2;
          }

          for (let s = 0; s < 8; s++) {
            const segMat = energySegmentMats[s];
            if (segMat) {
              segMat.color.set('#00E5FF');
              segMat.emissive.set('#00E5FF');
              segMat.emissiveIntensity = 0.05;
              segMat.opacity = 0.15;
            }
          }

          const labelMesh = energyMeterGroup.userData.labelMesh as THREE.Mesh;
          if (labelMesh) {
            labelMesh.lookAt(camera.position);
            if (frameCount % 10 === 0) {
              energyMeterGroup.userData.updateLabel('N/A', 0, '#00E5FF');
            }
          }
        }
      }

      // Report current hovered element upward to standard React state
      if (propsRef.current.isObsEntered) {
        if (currentHoveredElement !== propsRef.current.hoveredElement) {
          onHoverElement(currentHoveredElement);
        }
      }

      // 4. Animate Core Quantum Atom Elements
      if (currentProps.selectedElement) {
        atomGroup.visible = true;
        
        // Nucleus organic eccentric rotation
        nucleusGroup.rotation.y += 0.012 * simMultiplier;
        nucleusGroup.rotation.z += 0.007 * simMultiplier;
        
        // Pulsating respiration core based on kinetic energy setting
        const breatheFactor = Math.sin(elapsed * 2.8) * 0.04 + Math.sin(elapsed * 14.0) * 0.015 * currentProps.reactiveIntensity;
        const coreScale = 1.0 + breatheFactor;
        nucleusGroup.scale.set(coreScale, coreScale, coreScale);

        // Jitter protons & neutrons with nuclear energetic kinetic Brownian noise
        const jitterForce = currentProps.activeReaction ? 0.09 * currentProps.reactiveIntensity : 0.015;
        nucleons.forEach((mesh, index) => {
          mesh.position.x += (Math.random() - 0.5) * jitterForce;
          mesh.position.y += (Math.random() - 0.5) * jitterForce;
          mesh.position.z += (Math.random() - 0.5) * jitterForce;
          
          // Tight magnetic pull back to center
          mesh.position.multiplyScalar(0.95);
        });

        // Pulsate PointLight source inside nucleus
        coreLight.intensity = (6.0 + Math.sin(elapsed * 8.0) * 2.5) * (1.0 + currentProps.reactiveIntensity * 0.3);

        // Update orbits and electron trail rings
        activeElectrons.forEach((el) => {
          // Progress orbits using Kepler's angle velocity (fast pericenter, slow apocenter)
          const e = el.eccentricity;
          const speedScalar = Math.pow(1.0 + e * Math.cos(el.angle), 2);
          el.angle += el.speed * simMultiplier * speedScalar;

          // Quantum Jump State handling
          if (!el.isJumping) {
            el.quantumJumpTimer -= delta * simMultiplier;
            if (el.quantumJumpTimer <= 0) {
              el.isJumping = true;
              el.jumpRatio = 0.0;
            }
          } else {
            el.jumpRatio += delta * 1.5 * simMultiplier;
            if (el.jumpRatio >= 1.0) {
              el.isJumping = false;
              el.quantumJumpTimer = 4 + Math.random() * 9;
              el.jumpRatio = 0.0;
            }
          }

          // Elliptic shell distances
          const rxBase = el.shellRadius;
          const ryBase = el.semiMinorAxis;

          // Compute custom excitation wave jump radius
          const orbitJumpMultiplier = el.isJumping ? Math.sin(el.jumpRatio * Math.PI) * 3.2 : 0.0;
          
          // Reaction kinetic shell vibrations
          const ringWobble = currentProps.activeReaction 
            ? Math.sin(elapsed * 15.0 + el.angle * 2.0) * 0.18 * currentProps.reactiveIntensity
            : Math.sin(elapsed * 3.5 + el.angle) * 0.02;

          const rx = rxBase + orbitJumpMultiplier + ringWobble;
          const ry = ryBase + orbitJumpMultiplier + ringWobble;

          const p = new THREE.Vector3(rx * Math.cos(el.angle), 0, ry * Math.sin(el.angle));

          // Apply unique tilted matrices
          p.applyAxisAngle(new THREE.Vector3(1, 0, 0), el.rotX);
          p.applyAxisAngle(new THREE.Vector3(0, 0, 1), el.rotZ);

          // Position matching
          el.mesh.position.copy(p);

          // Energetic color flares during quantum excitation or highlighted shell states
          const isSelectedShell = el.shellIndex === selectedShellIndex;
          if (el.isJumping) {
            el.mesh.scale.setScalar(1.0 + Math.sin(el.jumpRatio * Math.PI) * 1.5);
            (el.mesh.material as THREE.MeshBasicMaterial).color.set('#FFF176'); // glowing bright gold-yellow
          } else if (isSelectedShell) {
            // Highlights all electrons belonging to the clicked shell with breathing size & bright quantum color
            const elBreathe = 2.2 + Math.sin(elapsed * 10.0) * 0.4;
            el.mesh.scale.setScalar(elBreathe);
            (el.mesh.material as THREE.MeshBasicMaterial).color.set('#00FFB3'); // neon quantum mint-green
          } else {
            el.mesh.scale.setScalar(1.0);
            (el.mesh.material as THREE.MeshBasicMaterial).color.copy(el.baseColor);
          }

          // Highly optimized in-place trail updates avoiding allocations/GC thrashing
          const posAttr = el.trail.geometry.attributes.position as THREE.BufferAttribute;
          const array = posAttr.array as Float32Array;
          const maxTrailPoints = posAttr.count;

          // Shift coordinate indices down in GPU buffer array
          for (let ti = 0; ti < maxTrailPoints - 1; ti++) {
            array[ti * 3] = array[(ti + 1) * 3];
            array[ti * 3 + 1] = array[(ti + 1) * 3 + 1];
            array[ti * 3 + 2] = array[(ti + 1) * 3 + 2];
          }

          // Append new coordinate at the tail end
          array[(maxTrailPoints - 1) * 3] = p.x;
          array[(maxTrailPoints - 1) * 3 + 1] = p.y;
          array[(maxTrailPoints - 1) * 3 + 2] = p.z;

          posAttr.needsUpdate = true;
          
          // Animate and fade the trail line visibility
          const trailMat = el.trail.material as THREE.LineBasicMaterial;
          if (el.isJumping) {
            trailMat.color.set('#FFD54F');
            trailMat.opacity = 0.85;
          } else if (isSelectedShell) {
            trailMat.color.set('#00FFB3'); // highlighted trail matching the cyan-green resonance
            trailMat.opacity = 0.95;
          } else {
            trailMat.color.copy(el.baseColor);
            trailMat.opacity = 0.42;
          }
        });

        // Highlight visual path rings according to selected shell status
        shellGroup.children.forEach(child => {
          if (child.userData && child.userData.isVisualRing) {
            const ringLine = child as THREE.Line;
            const rMat = ringLine.material as THREE.LineBasicMaterial;
            const ringIdx = ringLine.userData.shellIndex;
            if (ringIdx === selectedShellIndex) {
              rMat.color.set('#00FFB3');
              rMat.opacity = 0.55 + Math.sin(elapsed * 8.0) * 0.3;
            } else {
              rMat.color.copy(ringLine.userData.defaultColor);
              rMat.opacity = 0.18;
            }
          }
        });

        // Slow quantum wave breathing/vibrating of our lovely probability density cloud points
        if (densityCloud && densityCloud.visible) {
          const cloudTime = elapsed * 2.2;
          const scale = 1.0 + Math.sin(cloudTime) * 0.03 + (Math.random() * 0.005);
          densityCloud.scale.setScalar(scale);

          if (densityCloud.material instanceof THREE.PointsMaterial) {
            densityCloud.material.opacity = 0.55 + Math.sin(elapsed * 4.5) * 0.18;
            densityCloud.material.size = (isLowPerfActive ? 0.08 : 0.045) * (1.0 + Math.cos(elapsed * 5.5) * 0.15);
          }
        }

      } else {
        atomGroup.visible = false;
      }

      // 5. User cursor disturbance forces projected onto Z=0 workspace
      const cursor3D = new THREE.Vector3(mouse2D.x * 32, mouse2D.y * 22, 0);

      // (A) BACKGROUND SPACE DUST PARALLAX FORCE FIELD (Optimized Float32Array and Selective Disturbance Checking)
      const posAttr = spaceDust.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      const count = posAttr.count;
      const checkDisturbance = (mouseActive || isDragging) && currentProps.isObsEntered;

      if (checkDisturbance) {
        for (let j = 0; j < count; j++) {
          const bx = baseDustPositions[j * 3];
          const by = baseDustPositions[j * 3 + 1];

          let currX = arr[j * 3];
          let currY = arr[j * 3 + 1];

          // Constant weightless downwards fall
          let baseNewY = by - speeds[j] * 0.08 * simMultiplier;
          if (baseNewY < -45) {
            baseNewY = 45;
          }
          baseDustPositions[j * 3 + 1] = baseNewY; // Retain falling base

          // Compute cursor proximity forces
          const dx = currX - cursor3D.x;
          const dy = currY - cursor3D.y;
          const distSq = dx*dx + dy*dy;

          let targetX = bx;
          let targetY = baseNewY;

          if (distSq < 132.25) { // 11.5 * 11.5 = 132.25
            const dist = Math.sqrt(distSq);
            // Soft magnetic orbital vortex swirl
            const force = (11.5 - dist) / 11.5;
            const swirlDirection = (j % 2 === 0 ? 1 : -1);
            const swirlAngle = Math.atan2(dy, dx) + 0.35 * swirlDirection * force;
            const expandRadius = dist + 2.0 * force * (1.0 + currentProps.reactiveIntensity * 0.5);

            targetX = cursor3D.x + Math.cos(swirlAngle) * expandRadius;
            targetY = cursor3D.y + Math.sin(swirlAngle) * expandRadius;
          }

          // Direct array writes avoiding expensive wrapper calls
          arr[j * 3] += (targetX - currX) * 0.08;
          arr[j * 3 + 1] += (targetY - currY) * 0.08;
        }
      } else {
        // High-speed drift bypass when there is no user cursor activity
        for (let j = 0; j < count; j++) {
          let baseNewY = baseDustPositions[j * 3 + 1] - speeds[j] * 0.08 * simMultiplier;
          if (baseNewY < -45) {
            baseNewY = 45;
          }
          baseDustPositions[j * 3 + 1] = baseNewY;
          arr[j * 3 + 1] = baseNewY;
        }
      }
      posAttr.needsUpdate = true;
      spaceDust.rotation.y += 0.0007 * simMultiplier;

      // (B) FOREGROUND ATMOSPHERIC PLASMA NEBULA FLUID FIELD (Optimized Float32Array and Selective Disturbance Checking)
      const plasmaPosAttr = atmosphericPlasma.geometry.attributes.position as THREE.BufferAttribute;
      const plasmaArr = plasmaPosAttr.array as Float32Array;
      const plasmaCountActual = plasmaPosAttr.count;

      if (checkDisturbance) {
        for (let j = 0; j < plasmaCountActual; j++) {
          const bx = basePlasmaPositions[j * 3];
          const by = basePlasmaPositions[j * 3 + 1];

          let currX = plasmaArr[j * 3];
          let currY = plasmaArr[j * 3 + 1];

          // Sinusoidal plasma swaying float
          let baseNewY = by - plasmaSpeeds[j] * 0.05 * simMultiplier;
          if (baseNewY < -30) {
            baseNewY = 30;
          }
          // Horizontal breathe sway
          let baseNewX = bx + Math.sin(elapsed * 0.8 + j) * 0.05;
          basePlasmaPositions[j * 3] = baseNewX;
          basePlasmaPositions[j * 3 + 1] = baseNewY;

          // Proximity calculation
          const dx = currX - cursor3D.x;
          const dy = currY - cursor3D.y;
          const distSq = dx*dx + dy*dy;

          let targetX = baseNewX;
          let targetY = baseNewY;

          if (distSq < 196) { // 14 * 14 = 196
            const dist = Math.sqrt(distSq);
            const force = (14 - dist) / 14;
            // Soft fluid repulsive shockwave
            const pushAngle = Math.atan2(dy, dx);
            const pushDistance = dist + 3.8 * force * (1.0 + currentProps.reactiveIntensity * 0.3);

            targetX = cursor3D.x + Math.cos(pushAngle) * pushDistance;
            targetY = cursor3D.y + Math.sin(pushAngle) * pushDistance;
          }

          plasmaArr[j * 3] += (targetX - currX) * 0.07;
          plasmaArr[j * 3 + 1] += (targetY - currY) * 0.07;
        }
      } else {
        // High-speed drift bypass when there is no user cursor activity
        for (let j = 0; j < plasmaCountActual; j++) {
          let baseNewY = basePlasmaPositions[j * 3 + 1] - plasmaSpeeds[j] * 0.05 * simMultiplier;
          if (baseNewY < -30) {
            baseNewY = 30;
          }
          let baseNewX = basePlasmaPositions[j * 3] + Math.sin(elapsed * 0.8 + j) * 0.05;
          basePlasmaPositions[j * 3] = baseNewX;
          basePlasmaPositions[j * 3 + 1] = baseNewY;

          plasmaArr[j * 3] = baseNewX;
          plasmaArr[j * 3 + 1] = baseNewY;
        }
      }
      plasmaPosAttr.needsUpdate = true;
      atmosphericPlasma.rotation.y += 0.0014 * simMultiplier;

      // Soft breathing atmospheric depth background fog exp density
      if (scene.fog && scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.copy(currentFogColor);
        scene.fog.density = 0.012 + Math.sin(elapsed * 0.45) * 0.003;
      }
      renderer.setClearColor(currentFogColor);

      // Render the scene!
      renderer.render(scene, camera);

    };

    renderLoop();

    // --- RESIZING SUPPORT ---
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // --- TEARDOWN ON DESTRUCT ---
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('reset-reactor', handleResetReactor);
      window.removeEventListener('reaction-stage', handleReactionStageEvent);
      window.removeEventListener('set-cosmic-zoom', handleSetCosmicZoom);
      detachEvents();
      
      // Memory cleanup for geometries & textures
      spaceDust.geometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
      atmosphericPlasma.geometry.dispose();
      plasmaMaterial.dispose();
      plasmaTexture.dispose();
      gridHelperY.geometry.dispose();
      
      networkLines.geometry.dispose();
      networkMat.dispose();
      hoverNetworkLines.geometry.dispose();
      hoverNetworkMat.dispose();

      // Dispose sectorsGroup structures
      sectorsGroup.children.forEach(secGroup => {
        secGroup.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) child.material.dispose();
          } else if (child instanceof THREE.LineSegments) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) child.material.dispose();
          } else if (child instanceof THREE.Sprite) {
            child.material.map?.dispose();
            child.material.dispose();
          } else if (child instanceof THREE.Points) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) child.material.dispose();
          }
        });
      });

      clearElementWorld();
      
      elementCards.forEach(c => {
        c.material.map?.dispose();
        c.material.dispose();
        (c.glowOutline.material as THREE.Material).dispose();
      });

      sharedCardGeom.dispose();
      sharedEdgeConfigGeom.dispose();

      sharedNucleonGeom.dispose();
      protonMat.dispose();
      neutronMat.dispose();

      // Dispose active density cloud
      if (densityCloud) {
        scene.remove(densityCloud);
        densityCloud.geometry.dispose();
        if (Array.isArray(densityCloud.material)) {
          densityCloud.material.forEach((m: any) => m.dispose());
        } else {
          densityCloud.material.dispose();
        }
        densityCloud = null;
      }

      // Dispose hit rings
      hitRings.forEach(hr => {
        hr.geometry.dispose();
        if (Array.isArray(hr.material)) {
          hr.material.forEach(m => m.dispose());
        } else {
          hr.material.dispose();
        }
      });
      hitRings = [];

      activeElectrons.forEach(e => {
        e.mesh.geometry.dispose();
        (e.mesh.material as THREE.Material).dispose();
        e.trail.geometry.dispose();
        (e.trail.material as THREE.Material).dispose();
      });

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onSelectElement, onHoverElement]);

  // Helper function to procedurally generate a high-contrast Circular Glow particle texture
  function createCircularParticleTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
      gradient.addColorStop(0.7, 'rgba(255,255,255,0.2)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 16, 16);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // Draw element card with high-end sci-fi HUD layouts on offscreen canvas
  function createCardTexture(el: ChemicalElement, glowHex: string): THREE.Texture {
    const isMobileDevice = window.innerWidth < 768;
    const canvas = document.createElement('canvas');
    canvas.width = isMobileDevice ? 128 : 256;
    canvas.height = isMobileDevice ? 160 : 320;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      if (isMobileDevice) {
        ctx.scale(0.5, 0.5);
      }
      // Clear background with glassmorphism dark slate
      ctx.fillStyle = '#0B1020';
      ctx.fillRect(0, 0, 256, 320);

      // Subtle atmospheric grid dots inside card
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let x = 16; x < 240; x += 16) {
        for (let y = 16; y < 300; y += 16) {
          ctx.fillRect(x, y, 1.5, 1.5);
        }
      }

      // Add category energy identity color bars
      ctx.fillStyle = glowHex;
      ctx.fillRect(0, 0, 256, 8); // Header border accent

      // Card thin tech borders
      ctx.strokeStyle = 'rgba(234, 242, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.strokeRect(8, 16, 240, 288);
      
      // Top corner brackets (sci-fi brackets)
      ctx.strokeStyle = glowHex;
      ctx.lineWidth = 2.5;
      
      // Top left bracket
      ctx.beginPath();
      ctx.moveTo(8, 30);
      ctx.lineTo(8, 16);
      ctx.lineTo(25, 16);
      ctx.stroke();

      // Top right bracket
      ctx.beginPath();
      ctx.moveTo(248, 30);
      ctx.lineTo(248, 16);
      ctx.lineTo(231, 16);
      ctx.stroke();

      // Draw Atomic Number
      ctx.fillStyle = '#EAF2FF';
      ctx.font = 'bold 20px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(el.number.toString(), 20, 42);

      // Draw Atomic Mass
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(234, 242, 255, 0.6)';
      ctx.fillText(el.mass.toFixed(3), 236, 39);

      // Big atomic symbol centered
      ctx.textAlign = 'center';
      ctx.fillStyle = '#EAF2FF';
      ctx.font = 'bold 72px "Inter", sans-serif';
      
      // Shadow glow for symbol
      ctx.shadowColor = glowHex;
      ctx.shadowBlur = 15;
      ctx.fillText(el.symbol, 128, 150);
      
      // Reset shadows
      ctx.shadowBlur = 0;

      // Full Element Name
      ctx.font = 'bold 15px "Inter", sans-serif';
      ctx.fillStyle = '#EAF2FF';
      ctx.fillText(el.name.toUpperCase(), 128, 205);

      // Sub description configured configurations
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = glowHex;
      ctx.fillText(el.electronConfig, 128, 235);

      // Bottom state & period indicators
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(234, 242, 255, 0.45)';
      ctx.fillText(`P ${el.period} | G ${el.group} | ${el.state.toUpperCase()}`, 128, 275);
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  return (
    <div
      id="orbitium-canvas-container"
      ref={mountRef}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
    />
  );
}
