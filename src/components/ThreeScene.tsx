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

    // --- 2. LIGHTS ---
    const ambientLight = new THREE.AmbientLight('#0B1020', 1.5);
    scene.add(ambientLight);

    const blueDirLight = new THREE.DirectionalLight('#00E5FF', 2.0);
    blueDirLight.position.set(-15, 20, 15);
    scene.add(blueDirLight);

    const purpleDirLight = new THREE.DirectionalLight('#7C4DFF', 1.5);
    purpleDirLight.position.set(15, -15, 10);
    scene.add(purpleDirLight);

    // Cosmic spot light focused on center
    const spotLight = new THREE.SpotLight('#eaf2ff', 4.0, 100, Math.PI / 4, 0.5, 1.0);
    spotLight.position.set(0, 25, 25);
    scene.add(spotLight);

    // --- 3. SPACE PARTICLES / COSMIC DUST ---
    const particleCount = window.innerWidth < 768 ? 800 : 2500;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    const dustColors = [
      new THREE.Color('#00E5FF'),
      new THREE.Color('#7C4DFF'),
      new THREE.Color('#00FFB3'),
      new THREE.Color('#FFFFFF'),
    ];

    for (let i = 0; i < particleCount; i++) {
      // Outer space field
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      // Assign a cosmic color
      const color = dustColors[Math.floor(Math.random() * dustColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      speeds[i] = 0.05 + Math.random() * 0.15;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom shader material or simple glowing points for particles
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

    // --- 4. GIANT PLANAR ATMOSPHERIC LAB GRID SYSTEM ---
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

    const coreLight = new THREE.PointLight('#EAF2FF', 5.0, 30);
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
      shininess: 90,
      specular: '#FFFFFF',
    });
    
    const neutronMat = new THREE.MeshPhongMaterial({
      color: '#00FFB3',
      emissive: '#004D40',
      shininess: 80,
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

    interface ElectronParticle {
      mesh: THREE.Mesh;
      shellRadius: number;
      angle: number;
      speed: number;
      trail: THREE.Line;
      trailPoints: THREE.Vector3[];
    }
    
    let activeElectrons: ElectronParticle[] = [];

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

      // Spawn electron rings based on real structural shells
      const activeShells = el.shells; // e.g. [2, 8, 1]
      
      activeShells.forEach((eCount, shellIdx) => {
        const radius = 3.5 + shellIdx * 2.2;
        
        // 1. Path ring geometry
        const ringPoints: THREE.Vector3[] = [];
        const segments = 120;
        
        // Tilt shell planes differently to make it look breathtakingly 3D (Rutherford models)
        const rotX = (shellIdx * 0.4) + 0.15;
        const rotZ = (shellIdx * -0.3) - 0.1;

        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          const p = new THREE.Vector3(radius * Math.cos(theta), 0, radius * Math.sin(theta));
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
          color: catColor.clone().addScalar(0.3),
        });

        for (let ec = 0; ec < eCount; ec++) {
          const elMesh = new THREE.Mesh(electronGeom, electronMat);
          const initialAngle = (ec / eCount) * Math.PI * 2;
          const speed = (0.015 / (shellIdx + 1)) * (0.8 + Math.random() * 0.4);

          // Trail renderer
          const trailPoints: THREE.Vector3[] = [];
          const maxTrailPoints = 30;
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

          activeElectrons.push({
            mesh: elMesh,
            shellRadius: radius,
            angle: initialAngle,
            speed,
            trail: trailLine,
            trailPoints,
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
        cameraYOffsetTarget = y * 4;
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
        }
      }

      // 2. Fly camera toward detailed targets or table modes
      let cameraTargetZ = 42;
      let cameraTargetY = 0;
      let cameraTargetX = 0;

      if (!currentProps.isObsEntered) {
        // Cinematic rotating landing view perspective
        cameraTargetZ = 52;
        cameraTargetY = 12;
        cameraTargetX = Math.sin(elapsed * 0.12) * 22;
        
        rotYTarget = elapsed * 0.05;
        rotXTarget = -0.15;
      } else if (currentProps.selectedElement) {
        // Detailed Atom mode centering
        cameraTargetX = 5.0; // Offset camera to display holographic sidebar neatly
        cameraTargetY = 0;
        cameraTargetZ = 16.5 + currentProps.selectedElement.shells.length * 1.5;
        
        // Zero out user table rotation on detailed focus
        rotXTarget *= 0.95;
        rotYTarget *= 0.95;
      } else {
        // Tables screen heights based on Layout mode
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

      // Slerp dragging rotations
      currentRotX += (rotXTarget - currentRotX) * 0.08;
      currentRotY += (rotYTarget - currentRotY) * 0.08;

      // Slerp coordinates
      camera.position.x += (cameraTargetX - camera.position.x) * 0.08;
      camera.position.y += (cameraTargetY + cameraYOffsetTarget - camera.position.y) * 0.08;
      camera.position.z += (cameraTargetZ - camera.position.z) * 0.08;

      // Rotations matrices configuration
      cardGroup.rotation.x = currentRotX;
      cardGroup.rotation.y = currentRotY;

      // 3. Move and float each element card
      raycaster.setFromCamera(mouse2D, camera);
      const intersects = raycaster.intersectObjects(cardGroup.children, true);
      let hoveredMesh: THREE.Object3D | null = null;
      
      if (intersects.length > 0) {
        hoveredMesh = intersects[0].object;
      }

      let currentHoveredElement: ChemicalElement | null = null;

      elementCards.forEach((ci) => {
        // Weights & slerp motion vectors
        ci.mesh.position.lerp(ci.targetPosition, 0.08);
        
        // Dynamic weightless floating float calculations
        const floatFactor = Math.sin(elapsed * 1.5 + ci.floatOffset) * 0.15;
        ci.mesh.position.y += floatFactor * (currentProps.selectedElement ? 0.0 : 1.0);

        // Smoothly rotate cards towards targeted layout angle
        const targetQ = new THREE.Quaternion().setFromEuler(ci.targetRotation);
        ci.mesh.quaternion.slerp(targetQ, 0.08);

        // Hover responsive effects (push Z out on hover, glow highlight)
        const isCurrentlyHovered = hoveredMesh && (hoveredMesh === ci.mesh || hoveredMesh.parent === ci.mesh);
        const outlineMat = ci.glowOutline.material as THREE.LineBasicMaterial;
        
        if (isCurrentlyHovered && !currentProps.selectedElement && currentProps.isObsEntered) {
          currentHoveredElement = ci.element;
          
          // Hover forward thrust
          ci.mesh.translateZ(0.6);
          outlineMat.opacity = 0.9 + Math.sin(elapsed * 10) * 0.1;
          ci.glowOutline.scale.set(1.12, 1.12, 1.12);
        } else {
          outlineMat.opacity = 0.35 + Math.sin(elapsed * 2 + ci.floatOffset) * 0.1;
          ci.glowOutline.scale.set(1.05, 1.05, 1.05);

          // Render radioactive unstable flickers
          if (ci.element.category === 'actinide') {
            const flicker = Math.random() > 0.88 ? 0.95 : 0.32;
            outlineMat.opacity = flicker;
          }
        }

        // Apply general visibility fading
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

      // 4. Animate Atom Elements
      if (currentProps.selectedElement) {
        atomGroup.visible = true;
        
        // Nucleus organic rotation
        nucleusGroup.rotation.y += 0.012 * simMultiplier;
        nucleusGroup.rotation.z += 0.007 * simMultiplier;
        
        // Pulsate nucleons slightly to look "alive"
        const pulse = 1.0 + Math.sin(elapsed * 8) * 0.04;
        nucleusGroup.scale.set(pulse, pulse, pulse);

        // Update orbits and electron trail rings
        activeElectrons.forEach((el) => {
          // Progress angular orbiting position
          el.angle += el.speed * simMultiplier;
          
          // Electron positions calculations respecting Bohr matrices
          const radius = el.shellRadius;
          const shellIdx = Math.round((radius - 3.5) / 2.2);
          const rotX = (shellIdx * 0.4) + 0.15;
          const rotZ = (shellIdx * -0.3) - 0.1;

          const p = new THREE.Vector3(radius * Math.cos(el.angle), 0, radius * Math.sin(el.angle));
          
          // Apply reaction unstable distortions
          if (currentProps.activeReaction) {
            const distort = (Math.random() - 0.5) * currentProps.reactiveIntensity * 0.35;
            p.addScalar(distort);
          }

          p.applyAxisAngle(new THREE.Vector3(1, 0, 0), rotX);
          p.applyAxisAngle(new THREE.Vector3(0, 0, 1), rotZ);

          // Update Electron Mesh spot
          el.mesh.position.copy(p);

          // Update trail lines points history
          el.trailPoints.push(p.clone());
          if (el.trailPoints.length > 25) {
            el.trailPoints.shift();
          }

          // Force upload back to geometry
          const trailColor = new THREE.Color(CATEGORY_COLORS[currentProps.selectedElement!.category]?.hex || '#00E5FF');
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
        });

      } else {
        atomGroup.visible = false;
      }

      // 5. Animate Galactic background cosmic dust particles
      const posAttr = spaceDust.geometry.attributes.position as THREE.BufferAttribute;
      const count = posAttr.count;
      for (let j = 0; j < count; j++) {
        let py = posAttr.getY(j);
        
        // Slow float descent
        py -= speeds[j] * 0.1 * simMultiplier;
        if (py < -45) {
          py = 45; // Recycle particle on height
        }
        posAttr.setY(j, py);
      }
      posAttr.needsUpdate = true;
      spaceDust.rotation.y += 0.001 * simMultiplier;

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
      gridHelperY.geometry.dispose();
      
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
