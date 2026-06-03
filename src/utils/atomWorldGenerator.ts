import * as THREE from 'three';
import { ChemicalElement } from '../types';

export interface GeneratedWorld {
  targetFogColor: THREE.Color;
  targetAmbientColor: THREE.Color;
  activeWorldAnimate: (time: number, dt: number, sm: number) => void;
}

export function buildProceduralAtomWorld(
  el: ChemicalElement,
  elementWorldGroup: THREE.Group,
  particleTexture: THREE.Texture,
  isLowPerf: boolean = false
): GeneratedWorld {
  // Extract custom color profiles defined in our Core Element Data System
  const visualPrimary = new THREE.Color(el.visual?.primaryColor || '#00E5FF');
  const visualSecondary = new THREE.Color(el.visual?.secondaryGlowColor || '#7C4DFF');

  // Compute ambient background fog and deep space illumination derived from visual identity
  const lowHSL = { h: 0, s: 0, l: 0 };
  visualPrimary.getHSL(lowHSL);
  const targetFogColor = new THREE.Color().setHSL(lowHSL.h, Math.min(lowHSL.s, 0.45), 0.025); // very dark cosmic dust fog
  const targetAmbientColor = new THREE.Color().setHSL(lowHSL.h, Math.min(lowHSL.s, 0.35), 0.06); // ambient aura glow

  const atmosphere = el.visual?.atmosphereType || 'metal';
  let activeWorldAnimate: (time: number, dt: number, sm: number) => void = () => {};

  // FLAGSHIP ELEMENT OVERRIDES
  if (el.symbol === 'H') {
    // HYDROGEN: Primordial Stellar Nebula, Fusion Streams, Birthplace of Stars
    visualPrimary.set('#FF2A6D');
    visualSecondary.set('#05D9E8');
    targetFogColor.set('#010A15');
    targetAmbientColor.set('#1A0B2E');

    const nebulaGeom = isLowPerf ? new THREE.SphereGeometry(18, 12, 12) : new THREE.SphereGeometry(18, 32, 32);
    const nebulaMat = new THREE.MeshBasicMaterial({
      color: visualPrimary,
      transparent: true,
      opacity: 0.08,
      wireframe: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const nebula = new THREE.Mesh(nebulaGeom, nebulaMat);
    elementWorldGroup.add(nebula);

    const streamCount = isLowPerf ? 4 : 15;
    const streams: THREE.Mesh[] = [];
    for (let i = 0; i < streamCount; i++) {
      const g = new THREE.TorusGeometry(3.5 + Math.random() * 4, 0.015 + Math.random() * 0.02, 3, isLowPerf ? 12 : 40);
      const m = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? visualPrimary : visualSecondary,
        transparent: true,
        opacity: 0.35 + Math.random() * 0.4,
        blending: THREE.AdditiveBlending
      });
      const stream = new THREE.Mesh(g, m);
      stream.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      elementWorldGroup.add(stream);
      streams.push(stream);
    }

    activeWorldAnimate = (time, dt, sm) => {
      nebula.rotation.y += 0.04 * dt * sm;
      nebula.rotation.z += 0.02 * dt * sm;
      const pulse = 1.0 + Math.sin(time * 0.5) * 0.08;
      nebula.scale.setScalar(pulse);

      streams.forEach((s, i) => {
        s.rotation.x += 0.25 * dt * sm * (i % 2 === 0 ? 1 : -1);
        s.rotation.y += 0.15 * dt * sm;
        const sPulse = 1.0 + Math.sin(time * 2.0 + i) * 0.1;
        s.scale.setScalar(sPulse);
      });
    };

  } else if (el.symbol === 'He') {
    // HELIUM: Pure Absolute Zero Fluid, Superfluidity Rings, Bose-Einstein Condensate
    visualPrimary.set('#E0FFFF');
    visualSecondary.set('#87CEFA');
    targetFogColor.set('#000510');
    targetAmbientColor.set('#001530');

    const rings: THREE.Mesh[] = [];
    const ringCount = isLowPerf ? 3 : 8;
    for (let i = 0; i < ringCount; i++) {
      const g = new THREE.TorusGeometry(2 + i * (isLowPerf ? 1.2 : 0.6), 0.05, 8, isLowPerf ? 16 : 64);
      const m = new THREE.MeshPhongMaterial({
        color: visualPrimary,
        emissive: visualSecondary.clone().multiplyScalar(0.5),
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        shininess: 100
      });
      const ring = new THREE.Mesh(g, m);
      ring.rotation.x = Math.PI / 2;
      elementWorldGroup.add(ring);
      rings.push(ring);
    }

    activeWorldAnimate = (time, dt, sm) => {
      rings.forEach((ring, i) => {
        // Smooth, frictionless wave motion
        ring.position.y = Math.sin(time * 2.0 + i * 0.8) * 0.4;
        ring.rotation.x = Math.PI / 2 + Math.sin(time * 1.5 + i * 0.5) * 0.15;
      });
    };

  } else if (el.symbol === 'C') {
    // CARBON: Diamond Lattice Matrix, Organic Hexagonal Web
    visualPrimary.set('#FFFFFF');
    visualSecondary.set('#00FFB3');
    targetFogColor.set('#020202');
    targetAmbientColor.set('#101010');

    const latticeGeom = isLowPerf ? new THREE.IcosahedronGeometry(7, 0) : new THREE.IcosahedronGeometry(7, 2);
    const wireMat = new THREE.LineBasicMaterial({
      color: visualSecondary,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const edges = new THREE.EdgesGeometry(latticeGeom);
    const lattice = new THREE.LineSegments(edges, wireMat);
    elementWorldGroup.add(lattice);

    const diamondGeom = new THREE.OctahedronGeometry(2, 0);
    const diamondMat = new THREE.MeshPhongMaterial({
      color: visualPrimary,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    });
    const diamond = new THREE.Mesh(diamondGeom, diamondMat);
    elementWorldGroup.add(diamond);

    activeWorldAnimate = (time, dt, sm) => {
      lattice.rotation.y += 0.05 * dt * sm;
      lattice.rotation.x += 0.02 * dt * sm;
      diamond.rotation.y -= 0.15 * dt * sm;
      lattice.scale.setScalar(1.0 + Math.sin(time) * 0.05);
    };

  } else if (el.symbol === 'N') {
    // NITROGEN: Cryogenic Atmospheric Storm
    visualPrimary.set('#4B00D1');
    visualSecondary.set('#00D0FF');
    targetFogColor.set('#050515');
    targetAmbientColor.set('#100A3A');

    const stormCount = isLowPerf ? 100 : 800;
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array(stormCount * 3);
    for(let i=0; i<stormCount; i++) {
       pos[i*3] = (Math.random()-0.5)*15;
       pos[i*3+1] = (Math.random()-0.5)*15;
       pos[i*3+2] = (Math.random()-0.5)*15;
    }
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
       size: 0.12,
       color: visualSecondary,
       map: particleTexture,
       transparent: true,
       opacity: 0.8,
       blending: THREE.AdditiveBlending
    });
    const storm = new THREE.Points(geom, mat);
    elementWorldGroup.add(storm);

    activeWorldAnimate = (time, dt, sm) => {
      storm.rotation.y -= 0.8 * dt * sm;
      storm.rotation.x += 0.2 * dt * sm;
      const pulse = 1.0 + Math.sin(time * 3.0) * 0.05;
      storm.scale.set(pulse, pulse, pulse);
    };

  } else if (el.symbol === 'O') {
    // OXYGEN: Combustive Plasma Reactivity / Blue Glow
    visualPrimary.set('#0066FF');
    visualSecondary.set('#00E5FF');
    targetFogColor.set('#001133');
    targetAmbientColor.set('#002266');

    const core = new THREE.Mesh(
       new THREE.SphereGeometry(3, isLowPerf ? 12 : 32, isLowPerf ? 12 : 32),
       new THREE.MeshBasicMaterial({ color: visualPrimary, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending })
    );
    elementWorldGroup.add(core);

    const reactCount = isLowPerf ? 1 : 4;
    const reactors: THREE.Mesh[] = [];
    for(let i=0; i<reactCount; i++) {
      const r = new THREE.Mesh(
        new THREE.RingGeometry(3.5 + i*0.8, 3.6 + i*0.8, isLowPerf ? 16 : 32),
        new THREE.MeshBasicMaterial({ color: visualSecondary, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
      );
      r.rotation.x = Math.random() * Math.PI;
      r.rotation.y = Math.random() * Math.PI;
      elementWorldGroup.add(r);
      reactors.push(r);
    }

    activeWorldAnimate = (time, dt, sm) => {
       core.scale.setScalar(1.0 + Math.sin(time*5.0) * 0.15); // aggressive pulse
       reactors.forEach((r, idx) => {
          r.rotation.x += 1.2 * dt * sm * (idx%2===0?1:-1);
          r.rotation.y += 0.8 * dt * sm;
       });
    };

  } else if (el.symbol === 'Ne') {
    // NEON: Intense Crimson-Orange Laser Plasma
    visualPrimary.set('#FF0033');
    visualSecondary.set('#FF5500');
    targetFogColor.set('#220000');
    targetAmbientColor.set('#440000');

    // Electric lattice
    const cage = new THREE.Mesh(
       new THREE.OctahedronGeometry(5, isLowPerf ? 0 : 2),
       new THREE.MeshBasicMaterial({ color: visualPrimary, wireframe: true, transparent: true, opacity: 0.4 })
    );
    elementWorldGroup.add(cage);

    const coreMesh = new THREE.Mesh(
       new THREE.SphereGeometry(1.5, isLowPerf ? 6 : 16, isLowPerf ? 6 : 16),
       new THREE.MeshBasicMaterial({ color: visualSecondary, wireframe: true })
    );
    elementWorldGroup.add(coreMesh);

    activeWorldAnimate = (time, dt, sm) => {
       cage.rotation.y += 0.4 * dt * sm;
       coreMesh.rotation.x -= 0.8 * dt * sm;
       const flicker = Math.random() > 0.8 ? 0.4 : 1.0;
       (cage.material as THREE.MeshBasicMaterial).opacity = 0.2 * flicker;
    };

  } else if (el.symbol === 'Na') {
    // SODIUM: High-Volatile Electron Sea / Yellow Sparks
    visualPrimary.set('#FFD700');
    visualSecondary.set('#FFA500');
    targetFogColor.set('#1A1300');
    targetAmbientColor.set('#332600');

    const sparkGeom = new THREE.BufferGeometry();
    const sparkCount = isLowPerf ? 60 : 300;
    const pos = new Float32Array(sparkCount * 3);
    for(let i=0; i<sparkCount; i++) {
       pos[i*3] = (Math.random()-0.5)*10;
       pos[i*3+1] = (Math.random()-0.5)*10;
       pos[i*3+2] = (Math.random()-0.5)*10;
    }
    sparkGeom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const sparkPoints = new THREE.Points(sparkGeom, new THREE.PointsMaterial({
      size: 0.2, color: visualPrimary, map: particleTexture, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending
    }));
    elementWorldGroup.add(sparkPoints);

    activeWorldAnimate = (time, dt, sm) => {
       sparkPoints.rotation.y += 1.5 * dt * sm;
       sparkPoints.scale.setScalar(1.0 + Math.sin(time*10.0)*0.1);
    };

  } else if (el.symbol === 'Si') {
    // SILICON: Precision Geometric Crystal Cyber-Grid
    visualPrimary.set('#00FFCC');
    visualSecondary.set('#0066FF');
    targetFogColor.set('#001111');
    targetAmbientColor.set('#002222');

    const gridGeom = isLowPerf ? new THREE.BoxGeometry(8, 8, 8, 1, 1, 1) : new THREE.BoxGeometry(8, 8, 8, 4, 4, 4);
    const gridEdges = new THREE.EdgesGeometry(gridGeom);
    const cyberGrid = new THREE.LineSegments(gridEdges, new THREE.LineBasicMaterial({
      color: visualPrimary, transparent: true, opacity: 0.4
    }));
    elementWorldGroup.add(cyberGrid);

    activeWorldAnimate = (time, dt, sm) => {
       cyberGrid.rotation.y += 0.1 * dt * sm;
       cyberGrid.rotation.x += 0.1 * dt * sm;
     };

  } else if (el.symbol === 'Fe') {
    // IRON: Molten Core Magnetic Fields
    visualPrimary.set('#FF4500');
    visualSecondary.set('#8B0000');
    targetFogColor.set('#1A0500');
    targetAmbientColor.set('#330A00');

    const magFields: THREE.Mesh[] = [];
    const fieldCount = isLowPerf ? 4 : 12;
    for(let i=0; i<fieldCount; i++) {
      const g = new THREE.TorusGeometry(4.5, 0.02, 3, isLowPerf ? 16 : 40);
      const m = new THREE.MeshBasicMaterial({ color: visualPrimary, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
      const t = new THREE.Mesh(g, m);
      t.rotation.x = (i / fieldCount) * Math.PI;
      elementWorldGroup.add(t);
      magFields.push(t);
    }

    activeWorldAnimate = (time, dt, sm) => {
       magFields.forEach((t) => {
          t.rotation.y += 1.5 * dt * sm;
       });
    };

  } else if (el.symbol === 'U') {
    // URANIUM: Radioactive Cherenkov Deep Green Core / Fission Decay Particles
    visualPrimary.set('#39FF14');
    visualSecondary.set('#00FF00');
    targetFogColor.set('#051A05');
    targetAmbientColor.set('#0A330A');

    const cherenkov = new THREE.Mesh(
       new THREE.SphereGeometry(3.5, isLowPerf ? 10 : 32, isLowPerf ? 10 : 32),
       new THREE.MeshBasicMaterial({ color: visualPrimary, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending })
    );
    elementWorldGroup.add(cherenkov);

    activeWorldAnimate = (time, dt, sm) => {
       const flicker = Math.random() > 0.8 ? 0.3 : 0.15;
       (cherenkov.material as THREE.MeshBasicMaterial).opacity = flicker;
       cherenkov.scale.setScalar(1.0 + Math.sin(time*20.0)*0.02);
    };

  } else if (atmosphere === 'gas') {
    // GAS/NEBULA ATMOSPHERE: Swirling gas rings, orbital core winds, and gas clouds
    const torusGeom1 = new THREE.TorusGeometry(3.2, 0.04, 3, isLowPerf ? 16 : 28);
    const torusMat1 = new THREE.MeshBasicMaterial({
      color: visualPrimary,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
      blending: THREE.AdditiveBlending
    });
    const torus1 = new THREE.Mesh(torusGeom1, torusMat1);
    torus1.rotation.x = Math.PI / 4;
    elementWorldGroup.add(torus1);

    const torusGeom2 = new THREE.TorusGeometry(3.2, 0.025, 3, isLowPerf ? 16 : 28);
    const torusMat2 = new THREE.MeshBasicMaterial({
      color: visualSecondary,
      transparent: true,
      opacity: 0.22,
      wireframe: true,
      blending: THREE.AdditiveBlending
    });
    const torus2 = new THREE.Mesh(torusGeom2, torusMat2);
    torus2.rotation.y = Math.PI / 4;
    elementWorldGroup.add(torus2);

    // Dynamic gas particle cloud
    const fSeedsCount = isLowPerf ? 15 : 60;
    const fGeom = new THREE.BufferGeometry();
    const fPositions = new Float32Array(fSeedsCount * 3);
    const fSpeeds = new Float32Array(fSeedsCount);
    const fRadii = new Float32Array(fSeedsCount);
    const fAngles = new Float32Array(fSeedsCount);
    
    for (let i = 0; i < fSeedsCount; i++) {
       fAngles[i] = Math.random() * Math.PI * 2;
       fRadii[i] = 1.8 + Math.random() * 2.8;
       fSpeeds[i] = 0.6 + Math.random() * 1.4;
       
       fPositions[i * 3] = Math.cos(fAngles[i]) * fRadii[i];
       fPositions[i * 3 + 1] = (Math.random() - 0.5) * 1.6;
       fPositions[i * 3 + 2] = Math.sin(fAngles[i]) * fRadii[i];
    }
    fGeom.setAttribute('position', new THREE.BufferAttribute(fPositions, 3));
    const fMat = new THREE.PointsMaterial({
      size: 0.5,
      color: visualPrimary,
      map: particleTexture,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const fusionPoints = new THREE.Points(fGeom, fMat);
    elementWorldGroup.add(fusionPoints);

    activeWorldAnimate = (time, dt, sm) => {
      torus1.rotation.z += 0.22 * dt * sm;
      torus2.rotation.z -= 0.16 * dt * sm;
      
      const posAttr = fusionPoints.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < fSeedsCount; i++) {
         fAngles[i] += fSpeeds[i] * dt * 1.1 * sm;
         const dynamicRadius = fRadii[i] + Math.sin(time * 2.0 + i) * 0.35;
         
         arr[i * 3] = Math.cos(fAngles[i]) * dynamicRadius;
         arr[i * 3 + 1] = Math.sin(time * 1.5 + i) * 0.45;
         arr[i * 3 + 2] = Math.sin(fAngles[i]) * dynamicRadius;
      }
      posAttr.needsUpdate = true;
    };

  } else if (atmosphere === 'plasma' || el.category === 'noble-gas') {
    // PLASMA/DISCHARGE FIELD: Concentric highly energetic shells with high tension electric sparks
    const pSphereG1 = new THREE.SphereGeometry(3.0, isLowPerf ? 6 : 14, isLowPerf ? 6 : 14);
    const pSphereM1 = new THREE.MeshBasicMaterial({
      color: visualPrimary,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      wireframe: true
    });
    const pSphere1 = new THREE.Mesh(pSphereG1, pSphereM1);
    elementWorldGroup.add(pSphere1);

    const pSphereG2 = new THREE.SphereGeometry(2.0, isLowPerf ? 6 : 14, isLowPerf ? 6 : 14);
    const pSphereM2 = new THREE.MeshBasicMaterial({
      color: visualSecondary,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      wireframe: true
    });
    const pSphere2 = new THREE.Mesh(pSphereG2, pSphereM2);
    elementWorldGroup.add(pSphere2);

    // Spark electrical nodes
    const sparkLines: THREE.Line[] = [];
    const sparkCount = isLowPerf ? 2 : 8;
    const sparkSegs = isLowPerf ? 4 : 6;
    for (let s = 0; s < sparkCount; s++) {
      const sGeom = new THREE.BufferGeometry();
      const pts = [];
      for (let seg = 0; seg < sparkSegs; seg++) {
        pts.push(new THREE.Vector3(0, 0, 0));
      }
      sGeom.setFromPoints(pts);
      const sMat = new THREE.LineBasicMaterial({
        color: s % 2 === 0 ? visualPrimary : visualSecondary,
        transparent: true,
        opacity: 0.8,
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
      pSphere2.scale.setScalar(1.0 + Math.cos(time * 4.0) * 0.06);

      // Re-route the sparkles with organic lightning fluctuations
      sTimer -= dt * sm;
      if (sTimer <= 0) {
        sTimer = 0.04 + Math.random() * 0.06;
        
        sparkLines.forEach((line) => {
          const posArr = new Float32Array(sparkSegs * 3);
          const dir = new THREE.Vector3(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
          ).normalize();
          const radius = 1.8 + Math.random() * 1.6;

          for (let i = 0; i < sparkSegs; i++) {
            const frac = i / (sparkSegs - 1);
            const pt = dir.clone().multiplyScalar(radius * frac);
            if (i > 0 && i < sparkSegs - 1) {
              pt.x += (Math.random() - 0.5) * 0.35;
              pt.y += (Math.random() - 0.5) * 0.35;
              pt.z += (Math.random() - 0.5) * 0.35;
            }
            posArr[i * 3] = pt.x;
            posArr[i * 3 + 1] = pt.y;
            posArr[i * 3 + 2] = pt.z;
          }
          line.geometry.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
          line.geometry.attributes.position.needsUpdate = true;
          (line.material as THREE.LineBasicMaterial).opacity = 0.2 + Math.random() * 0.7;
        });
      }
    };

  } else if (atmosphere === 'crystal' || el.state === 'solid' || el.symbol === 'C') {
    // CRYSTAL: Sacred geometry, diamond sublattices, atomic cages
    const crystalGeom = isLowPerf ? new THREE.IcosahedronGeometry(3.2, 0) : new THREE.IcosahedronGeometry(3.2, 1);
    const crystalMat = new THREE.MeshBasicMaterial({
      color: visualPrimary,
      transparent: true,
      opacity: 0.3,
      wireframe: true,
    });
    const crystalMesh = new THREE.Mesh(crystalGeom, crystalMat);
    elementWorldGroup.add(crystalMesh);

    const nodeGeom = new THREE.BufferGeometry();
    const posArr = crystalGeom.attributes.position.clone() as THREE.BufferAttribute;
    nodeGeom.setAttribute('position', posArr);
    const nodeMat = new THREE.PointsMaterial({
      size: 0.45,
      color: visualSecondary,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nodePoints = new THREE.Points(nodeGeom, nodeMat);
    elementWorldGroup.add(nodePoints);

    const coreLatticeG = new THREE.OctahedronGeometry(1.6, 0);
    const coreLatticeM = new THREE.MeshBasicMaterial({
      color: visualSecondary,
      transparent: true,
      opacity: 0.18,
      wireframe: true,
    });
    const coreLattice = new THREE.Mesh(coreLatticeG, coreLatticeM);
    elementWorldGroup.add(coreLattice);

    activeWorldAnimate = (time, dt, sm) => {
      crystalMesh.rotation.y += 0.008 * sm;
      crystalMesh.rotation.x += 0.004 * sm;
      nodePoints.rotation.y = crystalMesh.rotation.y;
      nodePoints.rotation.x = crystalMesh.rotation.x;
      
      coreLattice.rotation.y -= 0.006 * sm;
      coreLattice.rotation.z += 0.012 * sm;
      
      const pulse = 1.0 + Math.sin(time * 1.5) * 0.04;
      crystalMesh.scale.set(pulse, pulse, pulse);
      nodePoints.scale.set(pulse, pulse, pulse);
    };

  } else if (atmosphere === 'liquid' || el.state === 'liquid' || el.symbol === 'Hg' || el.symbol === 'Br') {
    // LIQUID/FLUID/AMORPHOUS: Weightless blobs moving through orbital currents of tension
    const mCount = isLowPerf ? 2 : 6;
    const mMeshes: THREE.Mesh[] = [];
    const mWeights: number[] = [];
    const mRadii: number[] = [];
    const mSpeeds: number[] = [];
    const mAxes: THREE.Vector3[] = [];
    const mAngles: number[] = [];

    const subGeom = new THREE.SphereGeometry(0.38, isLowPerf ? 6 : 12, isLowPerf ? 6 : 12);
    const subMat = new THREE.MeshPhongMaterial({
      color: visualPrimary,
      emissive: visualSecondary.clone().multiplyScalar(0.25),
      shininess: 90,
      specular: '#FFFFFF',
    });

    for (let i = 0; i < mCount; i++) {
      const m = new THREE.Mesh(subGeom, subMat);
      elementWorldGroup.add(m);
      mMeshes.push(m);
      mWeights.push(0.55 + i * 0.1);
      mRadii.push(2.1 + Math.random() * 1.4);
      mSpeeds.push(0.7 + Math.random() * 1.5);
      mAngles.push(Math.random() * Math.PI * 2);
      mAxes.push(new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize());
    }

    activeWorldAnimate = (time, dt, sm) => {
      mMeshes.forEach((mesh, idx) => {
        mAngles[idx] += mSpeeds[idx] * dt * sm;
        const r = mRadii[idx] + Math.sin(time * 1.8 + idx) * 0.28;
        const ax = mAxes[idx];
        const angle = mAngles[idx];

        const pos = new THREE.Vector3(r * Math.sin(angle), 0, r * Math.cos(angle));
        pos.applyAxisAngle(ax, angle * 0.12);
        mesh.position.copy(pos);

        // Fluid mechanical swell
        const scaleW = mWeights[idx] * (1.0 + Math.sin(time * 2.5 + idx) * 0.16 + Math.cos(time * 4.5 + idx) * 0.04);
        mesh.scale.set(scaleW, scaleW, scaleW);
      });
    };

  } else if (atmosphere === 'decay' || el.category === 'actinide' || el.number >= 89) {
    // DECAY/RADIOACTIVE: Highly energetic disintegration discharge ray bursts and a radioactive cloud mist
    const rCount = isLowPerf ? 3 : 12;
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
        color: visualPrimary,
        transparent: true,
        opacity: 0.9,
        linewidth: 1.8,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(rGeom, rMat);
      elementWorldGroup.add(line);
      rLines.push(line);

      rPositions.push(new THREE.Vector3(0, 0, 0));
      rDirs.push(new THREE.Vector3(0, 0, 0));
      rSpeeds.push(4.5 + Math.random() * 8.5);
      rAges.push(10.0); // instant initial spawning
      rMaxAges.push(0.3 + Math.random() * 0.4);
    }

    const mistCount = isLowPerf ? 12 : 50;
    const mistPos = new Float32Array(mistCount * 3);
    const mistRadii = new Float32Array(mistCount);
    const mistAngles = new Float32Array(mistCount);
    const mistSpeeds = new Float32Array(mistCount);
    for (let i = 0; i < mistCount; i++) {
      mistRadii[i] = 1.0 + Math.random() * 3.5;
      mistAngles[i] = Math.random() * Math.PI * 2;
      mistSpeeds[i] = 0.4 + Math.random() * 0.8;
    }
    const mistGeom = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(mistPos, 3));
    const mistPoints = new THREE.Points(mistGeom, new THREE.PointsMaterial({
      size: 0.45,
      color: visualSecondary,
      map: particleTexture,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending
    }));
    elementWorldGroup.add(mistPoints);

    activeWorldAnimate = (time, dt, sm) => {
      // Rotate of mist orbits
      const mPosAttr = mistPoints.geometry.attributes.position as THREE.BufferAttribute;
      const arr = mPosAttr.array as Float32Array;
      for (let i = 0; i < mistCount; i++) {
        mistAngles[i] += mistSpeeds[i] * dt * sm;
        const r = mistRadii[i] + Math.sin(time * 1.5 + i) * 0.22;
        arr[i * 3] = Math.cos(mistAngles[i]) * r;
        arr[i * 3 + 1] = Math.sin(time * 1.2 + i) * 0.5;
        arr[i * 3 + 2] = Math.sin(mistAngles[i]) * r;
      }
      mPosAttr.needsUpdate = true;

      // Pulse radiation rays
      rLines.forEach((line, rIdx) => {
        rAges[rIdx] += dt * sm;
        if (rAges[rIdx] >= rMaxAges[rIdx]) {
          rAges[rIdx] = 0.0;
          rPositions[rIdx].set(0, 0, 0);
          
          const u = Math.random() * 2.0 - 1.0;
          const theta = Math.random() * Math.PI * 2.0;
          const rVal = Math.sqrt(1.0 - u * u);
          rDirs[rIdx].set(rVal * Math.cos(theta), u, rVal * Math.sin(theta)).normalize();
          rSpeeds[rIdx] = 5.0 + Math.random() * 8.0;
          rMaxAges[rIdx] = 0.2 + Math.random() * 0.35;
        }

        const step = rSpeeds[rIdx] * dt * sm;
        const startPt = rPositions[rIdx].clone();
        rPositions[rIdx].addScaledVector(rDirs[rIdx], step);
        const endPt = rPositions[rIdx];

        const lPos = line.geometry.attributes.position as THREE.BufferAttribute;
        const lArr = lPos.array as Float32Array;
        lArr[0] = startPt.x;
        lArr[1] = startPt.y;
        lArr[2] = startPt.z;
        lArr[3] = endPt.x;
        lArr[4] = endPt.y;
        lArr[5] = endPt.z;
        lPos.needsUpdate = true;

        const life = rAges[rIdx] / rMaxAges[rIdx];
        (line.material as THREE.LineBasicMaterial).opacity = Math.max(0, 1.0 - life) * 0.9;
      });
    };

  } else {
    // METALS/STABLE CORES: Concentric orbital structures moving smoothly
    const ringCount = isLowPerf ? 1 : 3;
    const rings: THREE.Mesh[] = [];
    const speedsR: number[] = [];

    for (let i = 0; i < ringCount; i++) {
      const rG = new THREE.TorusGeometry(3.0 + i * 1.5, 0.035, 3, isLowPerf ? 12 : 24);
      const rM = new THREE.MeshBasicMaterial({
        color: visualPrimary,
        transparent: true,
        opacity: 0.2 + (1.0 - i * 0.25) * 0.25,
        blending: THREE.AdditiveBlending,
        wireframe: true,
      });
      const r = new THREE.Mesh(rG, rM);
      r.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      elementWorldGroup.add(r);
      rings.push(r);
      speedsR.push((0.08 + Math.random() * 0.12) * (i % 2 === 0 ? 1 : -1));
    }

    activeWorldAnimate = (time, dt, sm) => {
      rings.forEach((r, idx) => {
        r.rotation.x += speedsR[idx] * dt * sm;
        r.rotation.y += speedsR[idx] * 0.45 * dt * sm;
        r.rotation.z -= speedsR[idx] * 0.25 * dt * sm;

        const glow = 1.0 + Math.sin(time * 2.2 + idx) * 0.05;
        r.scale.set(glow, glow, glow);
      });
    };
  }

  return {
    targetFogColor,
    targetAmbientColor,
    activeWorldAnimate
  };
}
