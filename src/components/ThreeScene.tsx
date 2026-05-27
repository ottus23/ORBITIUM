/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChemicalElement, TableLayoutMode, ReactionConfig } from '../types';
import { ELEMENTS_DATA, CATEGORY_COLORS } from '../data';

interface ThreeSceneProps {
  selectedElement: ChemicalElement | null;
  hoveredElement: ChemicalElement | null;
  onSelectElement: (element: ChemicalElement | null) => void;
  onHoverElement: (element: ChemicalElement | null) => void;
  layoutMode: TableLayoutMode;
  simulationSpeed: number;
  reactiveIntensity: number;
  isObsEntered: boolean;
  activeReaction: ReactionConfig | null;
}

export default function ThreeScene({
  selectedElement,
  hoveredElement,
  onSelectElement,
  onHoverElement,
  layoutMode,
  simulationSpeed,
  reactiveIntensity,
  isObsEntered,
  activeReaction,
}: ThreeSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Keep values in ref to avoid re-triggering useEffect and tearing down the scene
  const propsRef = useRef({
    selectedElement,
    hoveredElement,
    layoutMode,
    simulationSpeed,
    reactiveIntensity,
    isObsEntered,
    activeReaction,
  });

  useEffect(() => {
    propsRef.current = {
      selectedElement,
      hoveredElement,
      layoutMode,
      simulationSpeed,
      reactiveIntensity,
      isObsEntered,
      activeReaction,
    };
  }, [selectedElement, hoveredElement, layoutMode, simulationSpeed, reactiveIntensity, isObsEntered, activeReaction]);

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

    // --- 3. SPACE PARTICLES / COSMIC BACKGROUND DUST ---
    const particleCount = window.innerWidth < 768 ? 800 : 2500;
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

    // --- 3B. ATMOSPHERIC PLASMA FIELD (FOREGROUND NEBULA ECOSYSTEM) ---
    const plasmaCount = window.innerWidth < 768 ? 150 : 450;
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
    const networkMat = new THREE.LineBasicMaterial({
      color: '#00E5FF',
      transparent: true,
      opacity: 0.15,
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

    // Adaptive fog and ambient lighting variables
    const defaultFogHex = '#070B14';
    const defaultAmbientHex = '#0B1020';
    
    const targetFogColor = new THREE.Color(defaultFogHex);
    const currentFogColor = new THREE.Color(defaultFogHex);
    const targetAmbientColor = new THREE.Color(defaultAmbientHex);

    // --- 4. PLANAR ATMOSPHERIC LAB GRID System ---
    const gridHelperY = new THREE.GridHelper(100, 50, '#00E5FF', '#0B1020');
    gridHelperY.position.set(0, -25, 0);
    gridHelperY.material.opacity = 0.12;
    gridHelperY.material.transparent = true;
    scene.add(gridHelperY);

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

    // Pre-draw standard assets for elements on dynamic CanvasTextures
    ELEMENTS_DATA.forEach((el, idx) => {
      const categoryConfig = CATEGORY_COLORS[el.category] || { hex: '#00E5FF' };
      const cardTexture = createCardTexture(el, categoryConfig.hex);
      
      const cardGeom = new THREE.PlaneGeometry(1.8, 2.3);
      const cardMat = new THREE.MeshBasicMaterial({
        map: cardTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      });

      const cardMesh = new THREE.Mesh(cardGeom, cardMat);
      
      // Wireframe futuristic glow bounding box
      const edgeGeom = new THREE.EdgesGeometry(cardGeom);
      const edgeMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(categoryConfig.hex),
        linewidth: 2,
        transparent: true,
        opacity: 0.4,
      });
      const glowOutline = new THREE.LineSegments(edgeGeom, edgeMat);
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
    const protonGeom = new THREE.SphereGeometry(0.35, 16, 16);
    const neutronGeom = new THREE.SphereGeometry(0.35, 16, 16);

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

    for (let i = 0; i < nucleonCount; i++) {
      const isProton = Math.random() > 0.48;
      const mesh = new THREE.Mesh(isProton ? protonGeom : protonGeom.clone(), isProton ? protonMat : neutronMat);
      
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
      trailPoints: THREE.Vector3[];
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

    // Interactive Camera Parallax & Elastic buoyancy
    let currentParallaxX = 0;
    let currentParallaxY = 0;

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

    const updateSelectedElementAtom = (el: ChemicalElement) => {
      // Clear previous world
      clearElementWorld();

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

      // Configure category energy identity of element
      const catColor = new THREE.Color(CATEGORY_COLORS[el.category]?.hex || '#00E5FF');
      
      // Update Core Lights & Nucleus mesh emissions
      coreLight.color.copy(catColor);

      const nucleusMaterial = new THREE.MeshPhongMaterial({
        color: catColor,
        emissive: catColor.clone().multiplyScalar(0.4),
        shininess: 120,
        specular: '#FFFFFF',
      });
      
      nucleons.forEach((node, idx) => {
        if (idx % 2 === 0) {
          node.material = nucleusMaterial;
        }
      });

      // Configure beautiful atmospheric environmental lights/fog based on element symbol/category!
      if (el.symbol === 'H') {
        // HYDROGEN: Cosmic gas clouds, blue energy fog, fusion atmosphere
        targetFogColor.set('#040d1e');
        targetAmbientColor.set('#041630');
        
        // Build H environment: 2 perpendicular orbiting torus rings
        const torusGeom1 = new THREE.TorusGeometry(3.2, 0.05, 8, 48);
        const torusMat1 = new THREE.MeshBasicMaterial({
          color: '#00E5FF',
          transparent: true,
          opacity: 0.35,
          wireframe: true,
          blending: THREE.AdditiveBlending
        });
        const torus1 = new THREE.Mesh(torusGeom1, torusMat1);
        torus1.rotation.x = Math.PI / 4;
        elementWorldGroup.add(torus1);

        const torusGeom2 = new THREE.TorusGeometry(3.2, 0.03, 8, 48);
        const torusMat2 = new THREE.MeshBasicMaterial({
          color: '#7C4DFF',
          transparent: true,
          opacity: 0.25,
          wireframe: true,
          blending: THREE.AdditiveBlending
        });
        const torus2 = new THREE.Mesh(torusGeom2, torusMat2);
        torus2.rotation.y = Math.PI / 4;
        elementWorldGroup.add(torus2);

        // Swarming fast-rotating particles (fusion fuel effect)
        const fSeedsCount = 50;
        const fGeom = new THREE.BufferGeometry();
        const fPositions = new Float32Array(fSeedsCount * 3);
        const fSpeeds = new Float32Array(fSeedsCount);
        const fRadii = new Float32Array(fSeedsCount);
        const fAngles = new Float32Array(fSeedsCount);
        
        for (let i = 0; i < fSeedsCount; i++) {
          fAngles[i] = Math.random() * Math.PI * 2;
          fRadii[i] = 2.0 + Math.random() * 2.5;
          fSpeeds[i] = 1.0 + Math.random() * 2.0;
          
          fPositions[i * 3] = Math.cos(fAngles[i]) * fRadii[i];
          fPositions[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
          fPositions[i * 3 + 2] = Math.sin(fAngles[i]) * fRadii[i];
        }
        fGeom.setAttribute('position', new THREE.BufferAttribute(fPositions, 3));
        const fMat = new THREE.PointsMaterial({
          size: 0.65,
          color: '#00E5FF',
          map: createCircularParticleTexture(),
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const fusionPoints = new THREE.Points(fGeom, fMat);
        elementWorldGroup.add(fusionPoints);

        activeWorldAnimate = (time, dt, sm) => {
          torus1.rotation.z += 0.4 * dt * sm;
          torus2.rotation.z -= 0.3 * dt * sm;
          
          const posAttr = fusionPoints.geometry.attributes.position as THREE.BufferAttribute;
          for (let i = 0; i < fSeedsCount; i++) {
            fAngles[i] += fSpeeds[i] * dt * 1.5 * sm;
            const dynamicRadius = fRadii[i] + Math.sin(time * 2.5 + i) * 0.3;
            
            posAttr.setX(i, Math.cos(fAngles[i]) * dynamicRadius);
            posAttr.setY(i, Math.sin(time * 1.8 + i) * 0.4);
            posAttr.setZ(i, Math.sin(fAngles[i]) * dynamicRadius);
          }
          posAttr.needsUpdate = true;
        };

      } else if (el.symbol === 'C') {
        // CARBON: Crystal structures, molecular geometry, dark industrial depth
        targetFogColor.set('#05070a');
        targetAmbientColor.set('#0b0e12');
        
        // Structured Buckyball / fullerene wireframe
        const buckyGeom = new THREE.IcosahedronGeometry(3.5, 1);
        const buckyMat = new THREE.MeshBasicMaterial({
          color: '#00FFB3',
          transparent: true,
          opacity: 0.4,
          wireframe: true,
        });
        const bucky = new THREE.Mesh(buckyGeom, buckyMat);
        elementWorldGroup.add(bucky);

        // Nodes at vertex coordinates
        const nodeGeom = new THREE.BufferGeometry();
        const posArr = buckyGeom.attributes.position.clone() as THREE.BufferAttribute;
        nodeGeom.setAttribute('position', posArr);
        const nodeMat = new THREE.PointsMaterial({
          size: 0.5,
          color: '#FFFFFF',
          map: createCircularParticleTexture(),
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const nodePoints = new THREE.Points(nodeGeom, nodeMat);
        elementWorldGroup.add(nodePoints);

        // Hexagonal/Diamond octahedron lattice inner skeleton
        const latticeGeom = new THREE.OctahedronGeometry(2.0, 0);
        const latticeMat = new THREE.MeshBasicMaterial({
          color: '#7C4DFF',
          transparent: true,
          opacity: 0.2,
          wireframe: true,
        });
        const lattice = new THREE.Mesh(latticeGeom, latticeMat);
        elementWorldGroup.add(lattice);

        activeWorldAnimate = (time, dt, sm) => {
          bucky.rotation.y += 0.012 * sm;
          bucky.rotation.x += 0.006 * sm;
          nodePoints.rotation.y = bucky.rotation.y;
          nodePoints.rotation.x = bucky.rotation.x;
          
          lattice.rotation.y -= 0.008 * sm;
          lattice.rotation.z += 0.015 * sm;
          
          const pulse = 1.0 + Math.sin(time * 2.0) * 0.04;
          bucky.scale.set(pulse, pulse, pulse);
          nodePoints.scale.set(pulse, pulse, pulse);
        };

      } else if (el.symbol === 'Ne' || el.category === 'noble-gas') {
        // NEON & NOBLE GASES: Glowing plasma, colorful energy clouds, electric atmosphere
        targetFogColor.set(el.symbol === 'He' ? '#12051e' : (el.symbol === 'Ne' ? '#200407' : '#051820'));
        targetAmbientColor.set(el.symbol === 'He' ? '#1a062e' : (el.symbol === 'Ne' ? '#2e070d' : '#072430'));

        const glowColor = el.symbol === 'He' ? '#E1BEE7' : (el.symbol === 'Ne' ? '#FF5252' : '#00FFB3');
        const secondaryGlowColor = el.symbol === 'He' ? '#7C4DFF' : (el.symbol === 'Ne' ? '#FF9100' : '#4DD0E1');

        // Concentric expanding plasma clouds
        const pSphereG1 = new THREE.SphereGeometry(3.0, 24, 24);
        const pSphereM1 = new THREE.MeshBasicMaterial({
          color: glowColor,
          transparent: true,
          opacity: 0.12,
          blending: THREE.AdditiveBlending,
        });
        const pSphere1 = new THREE.Mesh(pSphereG1, pSphereM1);
        elementWorldGroup.add(pSphere1);

        const pSphereG2 = new THREE.SphereGeometry(2.2, 24, 24);
        const pSphereM2 = new THREE.MeshBasicMaterial({
          color: secondaryGlowColor,
          transparent: true,
          opacity: 0.2,
          blending: THREE.AdditiveBlending,
        });
        const pSphere2 = new THREE.Mesh(pSphereG2, pSphereM2);
        elementWorldGroup.add(pSphere2);

        // Electric sparks / lightning bolts discharging
        const sparkLines: THREE.Line[] = [];
        const sparkCount = 6;
        const sparkSegs = 5;
        for (let s = 0; s < sparkCount; s++) {
          const sGeom = new THREE.BufferGeometry();
          const pts = [];
          for (let seg = 0; seg < sparkSegs; seg++) {
            pts.push(new THREE.Vector3(0,0,0));
          }
          sGeom.setFromPoints(pts);
          const sMat = new THREE.LineBasicMaterial({
            color: s % 2 === 0 ? glowColor : secondaryGlowColor,
            transparent: true,
            opacity: 0.8,
            linewidth: 2,
            blending: THREE.AdditiveBlending,
          });
          const line = new THREE.Line(sGeom, sMat);
          elementWorldGroup.add(line);
          sparkLines.push(line);
        }

        let sTimer = 0;
        activeWorldAnimate = (time, dt, sm) => {
          const pulse = 1.0 + Math.sin(time * 3.5) * 0.08;
          pSphere1.scale.setScalar(pulse);
          pSphere2.scale.setScalar(1.0 + Math.cos(time * 4) * 0.05);

          sTimer -= dt * sm;
          if (sTimer <= 0) {
            sTimer = 0.06 + Math.random() * 0.08;
            
            sparkLines.forEach((line) => {
              const posArr = new Float32Array(sparkSegs * 3);
              const dir = new THREE.Vector3(
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
                Math.random() * 2 - 1
              ).normalize();
              const radius = 2.2 + Math.random() * 1.5;

              for (let i = 0; i < sparkSegs; i++) {
                const frac = i / (sparkSegs - 1);
                const pt = dir.clone().multiplyScalar(radius * frac);
                if (i > 0 && i < sparkSegs - 1) {
                  pt.x += (Math.random() - 0.5) * 0.4;
                  pt.y += (Math.random() - 0.5) * 0.4;
                  pt.z += (Math.random() - 0.5) * 0.4;
                }
                posArr[i * 3] = pt.x;
                posArr[i * 3 + 1] = pt.y;
                posArr[i * 3 + 2] = pt.z;
              }
              line.geometry.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
              line.geometry.attributes.position.needsUpdate = true;
              (line.material as THREE.LineBasicMaterial).opacity = 0.3 + Math.random() * 0.6;
            });
          }
        };

      } else if (el.state === 'liquid' || el.symbol === 'Hg' || el.symbol === 'Br') {
        // LIQUIDS (Bromine, Mercury): weightless fluid blobs pulsating organically
        targetFogColor.set(el.symbol === 'Hg' ? '#080c10' : '#140602');
        targetAmbientColor.set(el.symbol === 'Hg' ? '#111822' : '#220b05');

        const mCount = 5;
        const mMeshes: THREE.Mesh[] = [];
        const mWeights: number[] = [];
        const mRadii: number[] = [];
        const mSpeeds: number[] = [];
        const mAxes: THREE.Vector3[] = [];
        const mAngles: number[] = [];

        const subGeom = new THREE.SphereGeometry(0.4, 24, 24);
        const subMat = new THREE.MeshPhongMaterial({
          color: el.symbol === 'Hg' ? '#CFD8DC' : '#FF3D00',
          emissive: el.symbol === 'Hg' ? '#37474F' : '#3E2723',
          shininess: el.symbol === 'Hg' ? 100 : 70,
          specular: '#FFFFFF',
        });

        for (let i = 0; i < mCount; i++) {
          const m = new THREE.Mesh(subGeom, subMat);
          elementWorldGroup.add(m);
          mMeshes.push(m);
          mWeights.push(0.6 + i * 0.12);
          mRadii.push(2.5 + Math.random() * 1.2);
          mSpeeds.push(1.0 + Math.random() * 1.5);
          mAngles.push(Math.random() * Math.PI * 2);
          mAxes.push(new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize());
        }

        activeWorldAnimate = (time, dt, sm) => {
          mMeshes.forEach((mesh, idx) => {
            mAngles[idx] += mSpeeds[idx] * dt * sm;
            const r = mRadii[idx] + Math.sin(time * 2.0 + idx) * 0.25;
            const ax = mAxes[idx];
            const angle = mAngles[idx];

            const pos = new THREE.Vector3(r * Math.sin(angle), 0, r * Math.cos(angle));
            pos.applyAxisAngle(ax, angle * 0.15);
            mesh.position.copy(pos);

            const scaleW = mWeights[idx] * (1.0 + Math.sin(time * 3.0 + idx) * 0.15 + Math.cos(time * 5.5 + idx) * 0.05);
            mesh.scale.set(scaleW, scaleW, scaleW);
          });
        };

      } else if (el.category === 'actinide' || el.category === 'lanthanide' || el.number >= 89) {
        // RADIOACTIVE ACTINIDES / RADIUM: Glowing radioactive decay alpha bursts
        targetFogColor.set('#04180d');
        targetAmbientColor.set('#062413');

        // Expanding decay rays
        const rCount = 10;
        const rLines: THREE.Line[] = [];
        const rPositions: THREE.Vector3[] = [];
        const rDirs: THREE.Vector3[] = [];
        const rSpeeds: number[] = [];
        const rAges: number[] = [];
        const rMaxAges: number[] = [];

        for (let r = 0; r < rCount; r++) {
          const rGeom = new THREE.BufferGeometry();
          rGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(2 * 3), 3));
          const rMat = new THREE.LineBasicMaterial({
            color: '#00FFB3',
            transparent: true,
            opacity: 0.9,
            linewidth: 2,
            blending: THREE.AdditiveBlending,
          });
          const line = new THREE.Line(rGeom, rMat);
          elementWorldGroup.add(line);
          rLines.push(line);

          rPositions.push(new THREE.Vector3(0,0,0));
          rDirs.push(new THREE.Vector3(0,0,0));
          rSpeeds.push(6.0 + Math.random() * 10);
          rAges.push(10); // trigger respawn immediately
          rMaxAges.push(0.35 + Math.random() * 0.4);
        }

        // Swirled radioactive particle mist
        const mistCount = 40;
        const mistPos = new Float32Array(mistCount * 3);
        const mistRadii = new Float32Array(mistCount);
        const mistAngles = new Float32Array(mistCount);
        const mistSpeeds = new Float32Array(mistCount);
        for(let i=0; i<mistCount; i++) {
          mistRadii[i] = 1.0 + Math.random() * 3.5;
          mistAngles[i] = Math.random() * Math.PI * 2;
          mistSpeeds[i] = 0.5 + Math.random() * 0.8;
        }
        const mistGeom = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(mistPos, 3));
        const mistPoints = new THREE.Points(mistGeom, new THREE.PointsMaterial({
          size: 0.5,
          color: '#CCFF90',
          map: createCircularParticleTexture(),
          transparent: true,
          opacity: 0.65,
          blending: THREE.AdditiveBlending
        }));
        elementWorldGroup.add(mistPoints);

        activeWorldAnimate = (time, dt, sm) => {
          // Mist rotation
          const mPosAttr = mistPoints.geometry.attributes.position as THREE.BufferAttribute;
          for (let i = 0; i < mistCount; i++) {
            mistAngles[i] += mistSpeeds[i] * dt * sm;
            const r = mistRadii[i] + Math.sin(time * 1.5 + i) * 0.25;
            mPosAttr.setX(i, Math.cos(mistAngles[i]) * r);
            mPosAttr.setY(i, Math.sin(time + i) * 0.6);
            mPosAttr.setZ(i, Math.sin(mistAngles[i]) * r);
          }
          mPosAttr.needsUpdate = true;

          // Process projectile rays
          rLines.forEach((line, rIdx) => {
            rAges[rIdx] += dt * sm;
            if (rAges[rIdx] >= rMaxAges[rIdx]) {
              rAges[rIdx] = 0.0;
              rPositions[rIdx].set(0, 0, 0);
              const u = Math.random() * 2 - 1;
              const theta = Math.random() * Math.PI * 2;
              const r = Math.sqrt(1 - u * u);
              rDirs[rIdx].set(r * Math.cos(theta), u, r * Math.sin(theta)).normalize();
              rSpeeds[rIdx] = 5.0 + Math.random() * 9.0;
              rMaxAges[rIdx] = 0.25 + Math.random() * 0.35;
            }

            const step = rSpeeds[rIdx] * dt * sm;
            const startPt = rPositions[rIdx].clone();
            rPositions[rIdx].addScaledVector(rDirs[rIdx], step);
            const endPt = rPositions[rIdx];

            const lPos = line.geometry.attributes.position as THREE.BufferAttribute;
            lPos.setX(0, startPt.x);
            lPos.setY(0, startPt.y);
            lPos.setZ(0, startPt.z);
            lPos.setX(1, endPt.x);
            lPos.setY(1, endPt.y);
            lPos.setZ(1, endPt.z);
            lPos.needsUpdate = true;

            const life = rAges[rIdx] / rMaxAges[rIdx];
            (line.material as THREE.LineBasicMaterial).opacity = Math.max(0, 1.0 - life) * 0.9;
          });
        };

      } else {
        // DEFAULT METALS / SYNTHETIC / CORE STRUCTURES: Concentric interlocking metallic/energy rings
        targetFogColor.set(catColor.clone().multiplyScalar(0.04).getStyle());
        targetAmbientColor.set(catColor.clone().multiplyScalar(0.12).getStyle());

        const ringCount = 3;
        const rings: THREE.Mesh[] = [];
        const speedsR: number[] = [];

        for (let i = 0; i < ringCount; i++) {
          const rG = new THREE.TorusGeometry(3.0 + i * 1.5, 0.03, 8, 36);
          const rM = new THREE.MeshBasicMaterial({
            color: catColor,
            transparent: true,
            opacity: 0.15 + (1.0 - i * 0.25) * 0.25,
            blending: THREE.AdditiveBlending,
            wireframe: true,
          });
          const r = new THREE.Mesh(rG, rM);
          r.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
          elementWorldGroup.add(r);
          rings.push(r);
          speedsR.push((0.1 + Math.random() * 0.15) * (i % 2 === 0 ? 1 : -1));
        }

        activeWorldAnimate = (time, dt, sm) => {
          rings.forEach((r, idx) => {
            r.rotation.x += speedsR[idx] * dt * sm;
            r.rotation.y += speedsR[idx] * 0.5 * dt * sm;
            r.rotation.z -= speedsR[idx] * 0.3 * dt * sm;

            const glow = 1.0 + Math.sin(time * 2.0 + idx) * 0.04;
            r.scale.set(glow, glow, glow);
          });
        };
      }

      // Spawn electron rings based on real structural shells with varying inclinations
      const activeShells = el.shells; // e.g. [2, 8, 1]
      
      activeShells.forEach((eCount, shellIdx) => {
        const radius = 3.5 + shellIdx * 2.2;
        
        // 1. Path ring geometry
        const ringPoints: THREE.Vector3[] = [];
        const segments = 120;
        
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
        shellGroup.add(pathRing);

        // 2. Generate whizzing electrons
        const electronGeom = new THREE.SphereGeometry(0.18, 16, 16);
        const electronMat = new THREE.MeshBasicMaterial({
          color: catColor.clone().addScalar(0.35),
        });

        for (let ec = 0; ec < eCount; ec++) {
          const elMesh = new THREE.Mesh(electronGeom, electronMat.clone());
          const initialAngle = (ec / eCount) * Math.PI * 2;
          const speed = (0.012 / (shellIdx + 1)) * (0.85 + Math.random() * 0.3);

          // Trail renderer
          const trailPoints: THREE.Vector3[] = [];
          const maxTrailPoints = 35;
          for (let ti = 0; ti < maxTrailPoints; ti++) {
            trailPoints.push(new THREE.Vector3(0, 0, 0));
          }
          const trailGeom = new THREE.BufferGeometry().setFromPoints(trailPoints);
          
          const trailColor = catColor.clone();
          const trailMat = new THREE.LineBasicMaterial({
            color: trailColor,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
          });
          const trailLine = new THREE.Line(trailGeom, trailMat);
          scene.add(trailLine);

          // Generate physical parameters for customized elliptic Kepler mechanics
          const eccentricity = 0.1 + (shellIdx * 0.04) + Math.random() * 0.05;
          const semiMinorAxis = radius * Math.sqrt(1 - eccentricity * eccentricity);

          activeElectrons.push({
            mesh: elMesh,
            shellRadius: radius,
            angle: initialAngle,
            speed,
            trail: trailLine,
            trailPoints,
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
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      mouse2D.set(x, y);

      if (isDragging) {
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
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMouseX = e.touches[0].clientX;
        previousMouseY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
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
    };

    // Element Click Selection Raycast
    const handleMouseClick = () => {
      if (!propsRef.current.isObsEntered) return;
      
      raycaster.setFromCamera(mouse2D, camera);
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

    const renderLoop = () => {
      frameId = requestAnimationFrame(renderLoop);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      
      const currentProps = propsRef.current;
      const simMultiplier = currentProps.simulationSpeed;

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
        cameraTargetZ = 16.5 + currentProps.selectedElement.shells.length * 1.5;
        
        rotXTarget *= 0.95;
        rotYTarget *= 0.95;
      } else {
        if (currentProps.layoutMode === 'spiral') {
          cameraTargetZ = 30;
          cameraTargetY = 2;
        } else if (currentProps.layoutMode === 'sphere') {
          cameraTargetZ = 38;
          cameraTargetY = 0;
        } else {
          cameraTargetZ = 38;
          cameraTargetY = 0.5;
        }
      }

      // Drag calculations slerp
      currentRotX += (rotXTarget - currentRotX) * 0.08;
      currentRotY += (rotYTarget - currentRotY) * 0.08;

      // Cinematic buoyancy drift offsets (lissajous shapes for alive zero-G perspective)
      const buoyancyX = Math.sin(elapsed * 0.35) * 1.2;
      const buoyancyY = Math.cos(elapsed * 0.28) * 0.8;
      const buoyancyZ = Math.sin(elapsed * 0.18) * 0.6;

      // Elastic cursor parallax
      const targetParallaxX = mouse2D.x * 3.5;
      const targetParallaxY = mouse2D.y * 2.2;
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.06;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.06;

      // Apply integrated slerp positioning
      camera.position.x += (cameraTargetX + buoyancyX + currentParallaxX - camera.position.x) * 0.07;
      camera.position.y += (cameraTargetY + buoyancyY + currentParallaxY + cameraYOffsetTarget - camera.position.y) * 0.07;
      camera.position.z += (cameraTargetZ + buoyancyZ - camera.position.z) * 0.07;

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

      // Update network lines based on current card mesh positions
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
      raycaster.setFromCamera(mouse2D, camera);
      const intersects = raycaster.intersectObjects(cardGroup.children, true);
      let hoveredMesh: THREE.Object3D | null = null;
      
      if (intersects.length > 0) {
        hoveredMesh = intersects[0].object;
      }

      let currentHoveredElement: ChemicalElement | null = null;

      elementCards.forEach((ci) => {
        ci.mesh.position.lerp(ci.targetPosition, 0.08);
        
        // Dynamic weightless floating float calculations
        const floatFactor = Math.sin(elapsed * 1.5 + ci.floatOffset) * 0.14;
        ci.mesh.position.y += floatFactor * (currentProps.selectedElement ? 0.0 : 1.0);

        // Smoothly rotate cards towards targeted layout angle
        const targetQ = new THREE.Quaternion().setFromEuler(ci.targetRotation);
        ci.mesh.quaternion.slerp(targetQ, 0.08);

        // Hover forward thrust inside grid matrices
        const isCurrentlyHovered = hoveredMesh && (hoveredMesh === ci.mesh || hoveredMesh.parent === ci.mesh);
        const outlineMat = ci.glowOutline.material as THREE.LineBasicMaterial;
        
        if (isCurrentlyHovered && !currentProps.selectedElement && currentProps.isObsEntered) {
          currentHoveredElement = ci.element;
          
          ci.mesh.translateZ(0.65);
          outlineMat.opacity = 0.95 + Math.sin(elapsed * 9) * 0.05;
          ci.glowOutline.scale.set(1.12, 1.12, 1.12);
        } else {
          outlineMat.opacity = 0.35 + Math.sin(elapsed * 1.8 + ci.floatOffset) * 0.08;
          ci.glowOutline.scale.set(1.05, 1.05, 1.05);

          if (ci.element.category === 'actinide') {
            const flicker = Math.random() > 0.88 ? 0.9 : 0.35;
            outlineMat.opacity = flicker;
          }
        }

        // Apply general grid fading
        if (currentProps.selectedElement) {
          const isSelected = ci.element.number === currentProps.selectedElement.number;
          ci.material.opacity += ((isSelected ? 1.0 : 0.0) - ci.material.opacity) * 0.1;
          ci.glowOutline.visible = isSelected;
        } else {
          ci.material.opacity += (0.9 - ci.material.opacity) * 0.1;
          ci.glowOutline.visible = true;
        }
      });

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

          // Energetic color flares during quantum excitation
          if (el.isJumping) {
            el.mesh.scale.setScalar(1.0 + Math.sin(el.jumpRatio * Math.PI) * 1.5);
            (el.mesh.material as THREE.MeshBasicMaterial).color.set('#FFF176'); // glowing bright gold-yellow
          } else {
            el.mesh.scale.setScalar(1.0);
            (el.mesh.material as THREE.MeshBasicMaterial).color.copy(el.baseColor);
          }

          // Update trail lines history
          el.trailPoints.push(p.clone());
          if (el.trailPoints.length > 25) {
            el.trailPoints.shift();
          }

          // Push geometry matching buffer updates
          const positionsArr = new Float32Array(el.trailPoints.length * 3);
          el.trailPoints.forEach((point, pIdx) => {
            positionsArr[pIdx * 3] = point.x;
            positionsArr[pIdx * 3 + 1] = point.y;
            positionsArr[pIdx * 3 + 2] = point.z;
          });

          el.trail.geometry.setAttribute('position', new THREE.BufferAttribute(positionsArr, 3));
          el.trail.geometry.computeBoundingSphere();
          el.trail.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 100);
          el.trail.geometry.attributes.position.needsUpdate = true;
          
          // Animate and fade the trail line visibility
          const trailMat = el.trail.material as THREE.LineBasicMaterial;
          if (el.isJumping) {
            trailMat.color.set('#FFD54F');
            trailMat.opacity = 0.85;
          } else {
            trailMat.color.copy(el.baseColor);
            trailMat.opacity = 0.42;
          }
        });

      } else {
        atomGroup.visible = false;
      }

      // 5. User cursor disturbance forces projected onto Z=0 workspace
      const cursor3D = new THREE.Vector3(mouse2D.x * 32, mouse2D.y * 22, 0);

      // (A) BACKGROUND SPACE DUST PARALLAX FORCE FIELD
      const posAttr = spaceDust.geometry.attributes.position as THREE.BufferAttribute;
      const count = posAttr.count;
      for (let j = 0; j < count; j++) {
        const bx = baseDustPositions[j * 3];
        const by = baseDustPositions[j * 3 + 1];
        const bz = baseDustPositions[j * 3 + 2];

        let currX = posAttr.getX(j);
        let currY = posAttr.getY(j);
        let currZ = posAttr.getZ(j);

        // Constant weightless downwards fall
        let baseNewY = by - speeds[j] * 0.08 * simMultiplier;
        if (baseNewY < -45) {
          baseNewY = 45;
        }
        baseDustPositions[j * 3 + 1] = baseNewY; // Retain falling base

        // Compute cursor proximity forces
        const dx = currX - cursor3D.x;
        const dy = currY - cursor3D.y;
        const dz = currZ - cursor3D.z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        let targetX = bx;
        let targetY = baseNewY;

        if (dist < 11.5) {
          // Soft magnetic orbital vortex swirl
          const force = (11.5 - dist) / 11.5;
          const swirlDirection = (j % 2 === 0 ? 1 : -1);
          const swirlAngle = Math.atan2(dy, dx) + 0.35 * swirlDirection * force;
          const expandRadius = dist + 2.0 * force * (1.0 + currentProps.reactiveIntensity * 0.5);

          targetX = cursor3D.x + Math.cos(swirlAngle) * expandRadius;
          targetY = cursor3D.y + Math.sin(swirlAngle) * expandRadius;
        }

        // Standard slerping back to equilibrium or swirl coordinates
        posAttr.setX(j, currX + (targetX - currX) * 0.08);
        posAttr.setY(j, currY + (targetY - currY) * 0.08);
      }
      posAttr.needsUpdate = true;
      spaceDust.rotation.y += 0.0007 * simMultiplier;

      // (B) FOREGROUND ATMOSPHERIC PLASMA NEBULA FLUID FIELD
      const plasmaPosAttr = atmosphericPlasma.geometry.attributes.position as THREE.BufferAttribute;
      const plasmaCountActual = plasmaPosAttr.count;
      for (let j = 0; j < plasmaCountActual; j++) {
        const bx = basePlasmaPositions[j * 3];
        const by = basePlasmaPositions[j * 3 + 1];
        const bz = basePlasmaPositions[j * 3 + 2];

        let currX = plasmaPosAttr.getX(j);
        let currY = plasmaPosAttr.getY(j);
        let currZ = plasmaPosAttr.getZ(j);

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
        const dz = currZ - cursor3D.z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        let targetX = baseNewX;
        let targetY = baseNewY;

        if (dist < 14) {
          const force = (14 - dist) / 14;
          // Soft fluid repulsive shockwave
          const pushAngle = Math.atan2(dy, dx);
          const pushDistance = dist + 3.8 * force * (1.0 + currentProps.reactiveIntensity * 0.3);

          targetX = cursor3D.x + Math.cos(pushAngle) * pushDistance;
          targetY = cursor3D.y + Math.sin(pushAngle) * pushDistance;
        }

        plasmaPosAttr.setX(j, currX + (targetX - currX) * 0.07);
        plasmaPosAttr.setY(j, currY + (targetY - currY) * 0.07);
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
      clearElementWorld();
      
      elementCards.forEach(c => {
        c.mesh.geometry.dispose();
        c.material.map?.dispose();
        c.material.dispose();
        c.glowOutline.geometry.dispose();
        (c.glowOutline.material as THREE.Material).dispose();
      });

      protonGeom.dispose();
      protonMat.dispose();
      neutronGeom.dispose();
      neutronMat.dispose();

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
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
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
