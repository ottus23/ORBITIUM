import * as THREE from 'three';

export interface MoleculeConfig {
  id: string;
  name: string;
  formula: string;
  category: 'molecule' | 'biology' | 'material';
  description: string;
  worldType: string;
}

export const MOLECULAR_DATABASE: MoleculeConfig[] = [
  // Molecules
  { id: 'water', name: 'Water', formula: 'H₂O', category: 'molecule', description: 'Polar covalent bent molecule. Universal solvent.', worldType: 'Oceanic World' },
  { id: 'co2', name: 'Carbon Dioxide', formula: 'CO₂', category: 'molecule', description: 'Linear covalent double bonds. Greenhouse gas.', worldType: 'Atmospheric Realm' },
  { id: 'methane', name: 'Methane', formula: 'CH₄', category: 'molecule', description: 'Tetrahedral geometry. Pure hydrocarbon.', worldType: 'Gas Giant Core' },
  { id: 'ammonia', name: 'Ammonia', formula: 'NH₃', category: 'molecule', description: 'Trigonal pyramidal. Hydrogen-bonding base.', worldType: 'Alkaline Vents' },
  { id: 'ozone', name: 'Ozone', formula: 'O₃', category: 'molecule', description: 'Bent geometry triatomic. UV shield.', worldType: 'Stratospheric Stratum' },
  { id: 'glucose', name: 'Glucose', formula: 'C₆H₁₂O₆', category: 'molecule', description: 'Hexagonal ring. Core biological energy source.', worldType: 'Metabolic Matrix' },
  { id: 'ethanol', name: 'Ethanol', formula: 'C₂H₅OH', category: 'molecule', description: 'Aliphatic alcohol. Psychoactive and fuel.', worldType: 'Fermenting Depths' },
  
  // Biology
  { id: 'dna', name: 'DNA Fragment', formula: 'Polymer', category: 'biology', description: 'Double helix geometry holding genetic codes.', worldType: 'Genetic Archive' },
  { id: 'rna', name: 'RNA Fragment', formula: 'Polymer', category: 'biology', description: 'Single helix messenger molecule.', worldType: 'Transcriptome' },
  { id: 'protein', name: 'Protein Fragment', formula: 'Polypeptide', category: 'biology', description: 'Folded amino acid chains as cellular machines.', worldType: 'Proteomic Factory' },
  { id: 'lipid', name: 'Lipid Bilayer', formula: 'Fatty Acids', category: 'biology', description: 'Hydrophobic barriers forming cell walls.', worldType: 'Cellular Border' },
  { id: 'carbohydrate', name: 'Complex Carbohydrate', formula: 'Polysaccharide', category: 'biology', description: 'Energy storage polymer chains.', worldType: 'Glycogen Reserve' },

  // Materials
  { id: 'graphene', name: 'Graphene', formula: 'C (Hex)', category: 'material', description: 'Single-layer hexagonal carbon lattice. Ultra-strong.', worldType: 'Nano-Material Realm' },
  { id: 'steel', name: 'Steel Lattice', formula: 'Fe-C', category: 'material', description: 'Iron-carbon interstitial solid solution.', worldType: 'Industrial Forge' },
  { id: 'silicon', name: 'Silicon Crystal', formula: 'Si (Lattice)', category: 'material', description: 'Diamond-cubic semiconducting matrix.', worldType: 'Computational Landscape' },
  { id: 'carbonfiber', name: 'Carbon Fiber', formula: 'C (Fiber)', category: 'material', description: 'Aligned polyacrylonitrile carbon crystals. High tensile strength.', worldType: 'Aerospace Weave' },
  { id: 'ceramic', name: 'Advanced Ceramic', formula: 'Al₂O₃', category: 'material', description: 'Ionic/covalent refractory solid.', worldType: 'Thermal Shield' },
  { id: 'polymer', name: 'Synthetic Polymer', formula: 'Plastics', category: 'material', description: 'Extruded hydrocarbon macromolecules.', worldType: 'Synthetic Expanse' },
  { id: 'semiconductor', name: 'Doped Semiconductor', formula: 'Si-P/B', category: 'material', description: 'N/P junction crystal for electron transit.', worldType: 'Transistor Valley' }
];

export function buildMolecularStructure(id: string): THREE.Group {
  const group = new THREE.Group();
  
  const atomMatGeom = new THREE.SphereGeometry(1, 32, 32);
  const getMat = (color: string) => new THREE.MeshPhysicalMaterial({
    color: color,
    metalness: 0.3,
    roughness: 0.2,
    transmission: 0.2,
    thickness: 0.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });

  const matO = getMat('#FF1744');
  const matH = getMat('#ECEFF1');
  const matC = getMat('#424242');
  const matN = getMat('#2962FF');
  const matFe = getMat('#78909C');
  const matSi = getMat('#00E5FF');
  const bondMat = new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: 0.6 });

  const addAtom = (mat: THREE.Material, scale: number, x: number, y: number, z: number) => {
    const mesh = new THREE.Mesh(atomMatGeom, mat);
    mesh.scale.setScalar(scale);
    mesh.position.set(x, y, z);
    
    // Set user data for explosion effect
    const origPos = new THREE.Vector3(x, y, z);
    mesh.userData = {
      originalPos: origPos,
      randomDir: origPos.clone().normalize().add(new THREE.Vector3((Math.random()-0.5)*0.5, (Math.random()-0.5)*0.5, (Math.random()-0.5)*0.5)).normalize(),
      explodeT: 0
    };
    
    group.add(mesh);
    return mesh.position;
  };

  const addBond = (p1: THREE.Vector3, p2: THREE.Vector3) => {
    const distance = p1.distanceTo(p2);
    const geom = new THREE.CylinderGeometry(0.15, 0.15, distance, 8);
    const mesh = new THREE.Mesh(geom, bondMat);
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    mesh.position.copy(mid);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(p2, p1).normalize());
    
    mesh.userData = {
      originalPos: mid.clone(),
      randomDir: mid.clone().normalize().add(new THREE.Vector3((Math.random()-0.5)*0.5, (Math.random()-0.5)*0.5, (Math.random()-0.5)*0.5)).normalize(),
      explodeT: 0
    };
    
    group.add(mesh);
  };

  if (id === 'water') {
    const o = addAtom(matO, 1.2, 0, 0, 0);
    const h1 = addAtom(matH, 0.6, -1.2, -1, 0);
    const h2 = addAtom(matH, 0.6, 1.2, -1, 0);
    addBond(o, h1);
    addBond(o, h2);
  } else if (id === 'co2') {
    const c = addAtom(matC, 1.2, 0, 0, 0);
    const o1 = addAtom(matO, 1.0, -2, 0, 0);
    const o2 = addAtom(matO, 1.0, 2, 0, 0);
    addBond(c, o1);
    addBond(c, o2);
  } else if (id === 'ozone') {
    const o1 = addAtom(matO, 1.2, 0, 1.0, 0);
    const o2 = addAtom(matO, 1.2, -1.8, -0.6, 0);
    const o3 = addAtom(matO, 1.2, 1.8, -0.6, 0);
    addBond(o1, o2); addBond(o1, o3);
  } else if (id === 'methane') {
    const c = addAtom(matC, 1.2, 0, 0, 0);
    const dist = 1.6;
    const h1 = addAtom(matH, 0.6, 0, dist, 0);
    const h2 = addAtom(matH, 0.6, 0, -dist/3, dist*0.94);
    const h3 = addAtom(matH, 0.6, -dist*0.81, -dist/3, -dist*0.47);
    const h4 = addAtom(matH, 0.6, dist*0.81, -dist/3, -dist*0.47);
    addBond(c, h1); addBond(c, h2); addBond(c, h3); addBond(c, h4);
  } else if (id === 'ammonia') {
    const n = addAtom(matN, 1.2, 0, 0.5, 0);
    const dist = 1.4;
    const h1 = addAtom(matH, 0.6, 0, -0.5, dist);
    const h2 = addAtom(matH, 0.6, -dist*0.86, -0.5, -dist*0.5);
    const h3 = addAtom(matH, 0.6, dist*0.86, -0.5, -dist*0.5);
    addBond(n, h1); addBond(n, h2); addBond(n, h3);
  } else if (id === 'ethanol') {
    const c1 = addAtom(matC, 1.1, -1, 0, 0);
    const c2 = addAtom(matC, 1.1, 1, 0, 0);
    const o = addAtom(matO, 1.0, 2.5, 1, 0);
    addBond(c1, c2); addBond(c2, o);
    const hC1_1 = addAtom(matH, 0.6, -1, 1.2, 0);
    const hC1_2 = addAtom(matH, 0.6, -1.5, -0.6, 1);
    const hC1_3 = addAtom(matH, 0.6, -1.5, -0.6, -1);
    addBond(c1, hC1_1); addBond(c1, hC1_2); addBond(c1, hC1_3);
    const hC2_1 = addAtom(matH, 0.6, 1, -1.2, 0);
    const hC2_2 = addAtom(matH, 0.6, 1.5, 0.6, 1);
    addBond(c2, hC2_1); addBond(c2, hC2_2);
    const hO = addAtom(matH, 0.6, 3.5, 0.5, 0);
    addBond(o, hO);
  } else if (id === 'glucose') {
    // Hexagonal pyranose ring approximation
    const c1 = addAtom(matC, 0.9, 2, 1, 0);
    const c2 = addAtom(matC, 0.9, 1, 2.5, 0);
    const c3 = addAtom(matC, 0.9, -1, 2.5, 0);
    const c4 = addAtom(matC, 0.9, -2, 1, 0);
    const c5 = addAtom(matC, 0.9, -1, -0.5, 0);
    const rO = addAtom(matO, 0.9, 1, -0.5, 0);
    addBond(c1, c2); addBond(c2, c3); addBond(c3, c4); addBond(c4, c5); addBond(c5, rO); addBond(rO, c1);
    const c6 = addAtom(matC, 0.9, -2, -2, 0);
    addBond(c5, c6);
  } else if (id === 'graphene') {
    // Hexagonal lattice
    const nodes: THREE.Vector3[] = [];
    for (let i = -3; i <= 3; i++) {
      for (let j = -3; j <= 3; j++) {
        const x = i * 2.5 + (j % 2 === 0 ? 0 : 1.25);
        const z = j * 2.16;
        if (x*x + z*z < 35) {
          nodes.push(addAtom(matC, 0.4, x, 0, z));
        }
      }
    }
    // Simple distance based bonding
    for(let i=0; i<nodes.length; i++) {
      for(let j=i+1; j<nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 2.6) {
          addBond(nodes[i], nodes[j]);
        }
      }
    }
  } else if (id === 'silicon') {
    // Diamond cubic lattice approximation
    const nodes: THREE.Vector3[] = [];
    for(let x=-2; x<=2; x+=2) {
      for(let y=-2; y<=2; y+=2) {
        for(let z=-2; z<=2; z+=2) {
           nodes.push(addAtom(matSi, 0.6, x, y, z));
           nodes.push(addAtom(matSi, 0.6, x+1, y+1, z+1));
        }
      }
    }
    for(let i=0; i<nodes.length; i++) {
      let bonds = 0;
      for(let j=i+1; j<nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 2.0 && bonds < 4) {
          addBond(nodes[i], nodes[j]);
          bonds++;
        }
      }
    }
  } else if (id === 'steel') {
    // Iron matrix with carbon interstitial
    const nodes: THREE.Vector3[] = [];
    for(let x=-2; x<=2; x+=2) {
      for(let y=-2; y<=2; y+=2) {
        for(let z=-2; z<=2; z+=2) {
           nodes.push(addAtom(matFe, 0.8, x, y, z));
           // BCC center
           if (x < 2 && y < 2 && z < 2) {
             nodes.push(addAtom(matFe, 0.8, x+1, y+1, z+1));
             // Interstitial carbon
             if (Math.random() > 0.6) {
               addAtom(matC, 0.3, x+1, y, z+0.5);
             }
           }
        }
      }
    }
  } else if (id === 'dna') {
     // Elegant double helix
     for(let i=0; i<40; i++) {
        const angle = i * 0.35;
        const y = (i - 20) * 0.6;
        const r = 2.0;
        const p1 = addAtom(matP_blue, 0.4, Math.cos(angle)*r, y, Math.sin(angle)*r);
        const p2 = addAtom(matP_red, 0.4, Math.cos(angle + Math.PI)*r, y, Math.sin(angle + Math.PI)*r);
        addBond(p1, p2);
        
        // Add backbone
        if (i > 0) {
           const prevAngle = (i-1) * 0.35;
           const prevY = (i - 1 - 20) * 0.6;
           const prev1 = new THREE.Vector3(Math.cos(prevAngle)*r, prevY, Math.sin(prevAngle)*r);
           const prev2 = new THREE.Vector3(Math.cos(prevAngle + Math.PI)*r, prevY, Math.sin(prevAngle + Math.PI)*r);
           addBond(p1, prev1);
           addBond(p2, prev2);
        }
     }
  } else {
     // Generic cluster for proteins, polymers, ceramis
     const nodes: THREE.Vector3[] = [];
     for(let i=0; i< 16; i++) {
        const v = new THREE.Vector3((Math.random()-0.5)*6, (Math.random()-0.5)*6, (Math.random()-0.5)*6);
        nodes.push(addAtom(i % 3 === 0 ? matO : matC, 0.6 + Math.random()*0.4, v.x, v.y, v.z));
     }
     for(let i=0; i<nodes.length; i++) {
        let connected = false;
        for(let j=i+1; j<nodes.length; j++) {
           if (nodes[i].distanceTo(nodes[j]) < 3.5 && !connected) {
              addBond(nodes[i], nodes[j]);
              connected = true;
           }
        }
     }
  }

  // Set up child initial positions for explosion effect
  group.children.forEach(child => {
    child.userData.originalPos = child.position.clone();
    child.userData.randomDir = new THREE.Vector3((Math.random()-0.5), (Math.random()-0.5), (Math.random()-0.5)).normalize();
  });

  // Animate specific data on group
  group.userData = { id, isMolecule: true };
  
  return group;
}

const matP_blue = new THREE.MeshPhysicalMaterial({ color: '#2962FF', metalness: 0, roughness: 0.1, transmission: 0.5 });
const matP_red = new THREE.MeshPhysicalMaterial({ color: '#FF1744', metalness: 0, roughness: 0.1, transmission: 0.5 });
