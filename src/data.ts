/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChemicalElement, ReactionConfig, ElementCategory, VisualConfig } from './types';

// Compact list of all 118 Elements
// Formatted as: [number, symbol, name, mass, category, period, group, state]
const RAW_ELEMENTS: Array<[number, string, string, number, ElementCategory, number, number, 'gas' | 'liquid' | 'solid' | 'synthetic']> = [
  [1, "H", "Hydrogen", 1.008, "reactive-nonmetal", 1, 1, "gas"],
  [2, "He", "Helium", 4.0026, "noble-gas", 1, 18, "gas"],
  [3, "Li", "Lithium", 6.94, "alkali-metal", 2, 1, "solid"],
  [4, "Be", "Beryllium", 9.0122, "alkaline-earth", 2, 2, "solid"],
  [5, "B", "Boron", 10.81, "metalloid", 2, 13, "solid"],
  [6, "C", "Carbon", 12.011, "reactive-nonmetal", 2, 14, "solid"],
  [7, "N", "Nitrogen", 14.007, "reactive-nonmetal", 2, 15, "gas"],
  [8, "O", "Oxygen", 15.999, "reactive-nonmetal", 2, 16, "gas"],
  [9, "F", "Fluorine", 18.998, "halogen", 2, 17, "gas"],
  [10, "Ne", "Neon", 20.18, "noble-gas", 2, 18, "gas"],
  [11, "Na", "Sodium", 22.99, "alkali-metal", 3, 1, "solid"],
  [12, "Mg", "Magnesium", 24.305, "alkaline-earth", 3, 2, "solid"],
  [13, "Al", "Aluminium", 26.982, "post-transition-metal", 3, 13, "solid"],
  [14, "Si", "Silicon", 28.085, "metalloid", 3, 14, "solid"],
  [15, "P", "Phosphorus", 30.974, "reactive-nonmetal", 3, 15, "solid"],
  [16, "S", "Sulfur", 32.06, "reactive-nonmetal", 3, 16, "solid"],
  [17, "Cl", "Chlorine", 35.45, "halogen", 3, 17, "gas"],
  [18, "Ar", "Argon", 39.948, "noble-gas", 3, 18, "gas"],
  [19, "K", "Potassium", 39.098, "alkali-metal", 4, 1, "solid"],
  [20, "Ca", "Calcium", 40.078, "alkaline-earth", 4, 2, "solid"],
  [21, "Sc", "Scandium", 44.956, "transition-metal", 4, 3, "solid"],
  [22, "Ti", "Titanium", 47.867, "transition-metal", 4, 4, "solid"],
  [23, "V", "Vanadium", 50.942, "transition-metal", 4, 5, "solid"],
  [24, "Cr", "Chromium", 51.996, "transition-metal", 4, 6, "solid"],
  [25, "Mn", "Manganese", 54.938, "transition-metal", 4, 7, "solid"],
  [26, "Fe", "Iron", 55.845, "transition-metal", 4, 8, "solid"],
  [27, "Co", "Cobalt", 58.933, "transition-metal", 4, 9, "solid"],
  [28, "Ni", "Nickel", 58.693, "transition-metal", 4, 10, "solid"],
  [29, "Cu", "Copper", 63.546, "transition-metal", 4, 11, "solid"],
  [30, "Zn", "Zinc", 65.38, "transition-metal", 4, 12, "solid"],
  [31, "Ga", "Gallium", 69.723, "post-transition-metal", 4, 13, "solid"],
  [32, "Ge", "Germanium", 72.63, "metalloid", 4, 14, "solid"],
  [33, "As", "Arsenic", 74.922, "metalloid", 4, 15, "solid"],
  [34, "Se", "Selenium", 78.971, "reactive-nonmetal", 4, 16, "solid"],
  [35, "Br", "Bromine", 79.904, "halogen", 4, 17, "liquid"],
  [36, "Kr", "Krypton", 83.798, "noble-gas", 4, 18, "gas"],
  [37, "Rb", "Rubidium", 85.468, "alkali-metal", 5, 1, "solid"],
  [38, "Sr", "Strontium", 87.62, "alkaline-earth", 5, 2, "solid"],
  [39, "Y", "Yttrium", 88.906, "transition-metal", 5, 3, "solid"],
  [40, "Zr", "Zirconium", 91.224, "transition-metal", 5, 4, "solid"],
  [41, "Nb", "Niobium", 92.906, "transition-metal", 5, 5, "solid"],
  [42, "Mo", "Molybdenum", 95.95, "transition-metal", 5, 6, "solid"],
  [43, "Tc", "Technetium", 98, "transition-metal", 5, 7, "synthetic"],
  [44, "Ru", "Ruthenium", 101.07, "transition-metal", 5, 8, "solid"],
  [45, "Rh", "Rhodium", 102.91, "transition-metal", 5, 9, "solid"],
  [46, "Pd", "Palladium", 106.42, "transition-metal", 5, 10, "solid"],
  [47, "Ag", "Silver", 107.87, "transition-metal", 5, 11, "solid"],
  [48, "Cd", "Cadmium", 112.41, "transition-metal", 5, 12, "solid"],
  [49, "In", "Indium", 114.82, "post-transition-metal", 5, 13, "solid"],
  [50, "Sn", "Tin", 118.71, "post-transition-metal", 5, 14, "solid"],
  [51, "Sb", "Antimony", 121.76, "metalloid", 5, 15, "solid"],
  [52, "Te", "Tellurium", 127.6, "metalloid", 5, 16, "solid"],
  [53, "I", "Iodine", 126.9, "halogen", 5, 17, "solid"],
  [54, "Xe", "Xenon", 131.29, "noble-gas", 5, 18, "gas"],
  [55, "Cs", "Caesium", 132.91, "alkali-metal", 6, 1, "solid"],
  [56, "Ba", "Barium", 137.33, "alkaline-earth", 6, 2, "solid"],
  [57, "La", "Lanthanum", 138.91, "lanthanide", 6, 3, "solid"],
  [58, "Ce", "Cerium", 140.12, "lanthanide", 6, 3, "solid"],
  [59, "Pr", "Praseodymium", 140.91, "lanthanide", 6, 3, "solid"],
  [60, "Nd", "Neodymium", 144.24, "lanthanide", 6, 3, "solid"],
  [61, "Pm", "Promethium", 145, "lanthanide", 6, 3, "synthetic"],
  [62, "Sm", "Samarium", 150.36, "lanthanide", 6, 3, "solid"],
  [63, "Eu", "Europium", 151.96, "lanthanide", 6, 3, "solid"],
  [64, "Gd", "Gadolinium", 157.25, "lanthanide", 6, 3, "solid"],
  [65, "Tb", "Terbium", 158.93, "lanthanide", 6, 3, "solid"],
  [66, "Dy", "Dysprosium", 162.5, "lanthanide", 6, 3, "solid"],
  [67, "Ho", "Holmium", 164.93, "lanthanide", 6, 3, "solid"],
  [68, "Er", "Erbium", 167.26, "lanthanide", 6, 3, "solid"],
  [69, "Tm", "Thulium", 168.93, "lanthanide", 6, 3, "solid"],
  [70, "Yb", "Ytterbium", 173.05, "lanthanide", 6, 3, "solid"],
  [71, "Lu", "Lutetium", 174.97, "lanthanide", 6, 3, "solid"],
  [72, "Hf", "Hafnium", 178.49, "transition-metal", 6, 4, "solid"],
  [73, "Ta", "Tantalum", 180.95, "transition-metal", 6, 5, "solid"],
  [74, "W", "Tungsten", 183.84, "transition-metal", 6, 6, "solid"],
  [75, "Re", "Rhenium", 186.21, "transition-metal", 6, 7, "solid"],
  [76, "Os", "Osmium", 190.23, "transition-metal", 6, 8, "solid"],
  [77, "Ir", "Iridium", 192.22, "transition-metal", 6, 9, "solid"],
  [78, "Pt", "Platinum", 195.08, "transition-metal", 6, 10, "solid"],
  [79, "Au", "Gold", 196.97, "transition-metal", 6, 11, "solid"],
  [80, "Hg", "Mercury", 200.59, "transition-metal", 6, 12, "liquid"],
  [81, "Tl", "Thallium", 204.38, "post-transition-metal", 6, 13, "solid"],
  [82, "Pb", "Lead", 207.2, "post-transition-metal", 6, 14, "solid"],
  [83, "Bi", "Bismuth", 208.98, "post-transition-metal", 6, 15, "solid"],
  [84, "Po", "Polonium", 209, "post-transition-metal", 6, 16, "solid"],
  [85, "At", "Astatine", 210, "halogen", 6, 17, "solid"],
  [86, "Rn", "Radon", 222, "noble-gas", 6, 18, "gas"],
  [87, "Fr", "Francium", 223, "alkali-metal", 7, 1, "solid"],
  [88, "Ra", "Radium", 226, "alkaline-earth", 7, 2, "solid"],
  [89, "Ac", "Actinium", 227, "actinide", 7, 3, "solid"],
  [90, "Th", "Thorium", 232.04, "actinide", 7, 3, "solid"],
  [91, "Pa", "Protactinium", 231.04, "actinide", 7, 3, "solid"],
  [92, "U", "Uranium", 238.03, "actinide", 7, 3, "solid"],
  [93, "Np", "Neptunium", 237, "actinide", 7, 3, "synthetic"],
  [94, "Pu", "Plutonium", 244, "actinide", 7, 3, "synthetic"],
  [95, "Am", "Americium", 243, "actinide", 7, 3, "synthetic"],
  [96, "Cm", "Curium", 247, "actinide", 7, 3, "synthetic"],
  [97, "Bk", "Berkhelium", 247, "actinide", 7, 3, "synthetic"],
  [98, "Cf", "Californium", 251, "actinide", 7, 3, "synthetic"],
  [99, "Es", "Einsteinium", 252, "actinide", 7, 3, "synthetic"],
  [100, "Fm", "Fermium", 257, "actinide", 7, 3, "synthetic"],
  [101, "Md", "Mendelevium", 258, "actinide", 7, 3, "synthetic"],
  [102, "No", "Nobelium", 259, "actinide", 7, 3, "synthetic"],
  [103, "Lr", "Lawrencium", 262, "actinide", 7, 3, "synthetic"],
  [104, "Rf", "Rutherfordium", 267, "transition-metal", 7, 4, "synthetic"],
  [105, "Db", "Dubnium", 268, "transition-metal", 7, 5, "synthetic"],
  [106, "Sg", "Seaborgium", 269, "transition-metal", 7, 6, "synthetic"],
  [107, "Bh", "Bohrium", 270, "transition-metal", 7, 7, "synthetic"],
  [108, "Hs", "Hassium", 277, "transition-metal", 7, 8, "synthetic"],
  [109, "Mt", "Meitnerium", 278, "transition-metal", 7, 9, "synthetic"],
  [110, "Ds", "Darmstadtium", 281, "transition-metal", 7, 10, "synthetic"],
  [111, "Rg", "Roentgenium", 282, "transition-metal", 7, 11, "synthetic"],
  [112, "Cn", "Copernicium", 285, "transition-metal", 7, 12, "synthetic"],
  [113, "Nh", "Nihonium", 286, "post-transition-metal", 7, 13, "synthetic"],
  [114, "Fl", "Flerovium", 289, "post-transition-metal", 7, 14, "synthetic"],
  [115, "Mc", "Moscovium", 290, "post-transition-metal", 7, 15, "synthetic"],
  [116, "Lv", "Livermorium", 293, "post-transition-metal", 7, 16, "synthetic"],
  [117, "Ts", "Tennessine", 294, "halogen", 7, 17, "synthetic"],
  [118, "Og", "Oganesson", 294, "noble-gas", 7, 18, "synthetic"]
];

// Helper to calculate exact orbital electrons distribution per shell
function getAtomicShells(num: number): number[] {
  if (num === 1) return [1];
  if (num === 2) return [2];
  if (num <= 10) return [2, num - 2];
  if (num <= 18) return [2, 8, num - 10];
  if (num <= 36) {
    if (num === 19) return [2, 8, 8, 1];
    if (num === 20) return [2, 8, 8, 2];
    if (num === 24) return [2, 8, 13, 1];
    if (num === 29) return [2, 8, 18, 1];
    if (num <= 28) return [2, 8, 8 + (num - 20), 2];
    return [2, 8, 18, num - 28];
  }
  if (num <= 54) {
    if (num === 37) return [2, 8, 18, 8, 1];
    if (num === 38) return [2, 8, 18, 8, 2];
    if (num === 41) return [2, 8, 18, 12, 1];
    if (num === 42) return [2, 8, 18, 13, 1];
    if (num === 44) return [2, 8, 18, 15, 1];
    if (num === 45) return [2, 8, 18, 16, 1];
    if (num === 46) return [2, 8, 18, 18];
    if (num === 47) return [2, 8, 18, 18, 1];
    if (num <= 45) return [2, 8, 18, 8 + (num - 38), 2];
    return [2, 8, 18, 18, num - 46];
  }
  if (num <= 86) {
    if (num === 55) return [2, 8, 18, 18, 8, 1];
    if (num === 56) return [2, 8, 18, 18, 8, 2];
    if (num >= 57 && num <= 71) {
      return [2, 8, 18, 18 + (num - 56), 8, 2];
    }
    if (num === 78) return [2, 8, 18, 32, 17, 1];
    if (num === 79) return [2, 8, 18, 32, 18, 1];
    if (num <= 80) return [2, 8, 18, 32, 8 + (num - 70), 2];
    return [2, 8, 18, 32, 18, num - 78];
  }
  if (num === 87) return [2, 8, 18, 32, 18, 8, 1];
  if (num === 88) return [2, 8, 18, 32, 18, 8, 2];
  if (num >= 89 && num <= 103) {
    return [2, 8, 18, 32, 18 + (num - 88), 8, 2];
  }
  if (num <= 112) return [2, 8, 18, 32, 32, 8 + (num - 102), 2];
  return [2, 8, 18, 32, 32, 18, num - 110];
}

// Helper to yield realistic scientific configurations dynamically
function getElectronConfig(num: number): string {
  const nobleGasCore = [
    { limit: 2, symbol: '[He]', num: 2 },
    { limit: 10, symbol: '[Ne]', num: 10 },
    { limit: 18, symbol: '[Ar]', num: 18 },
    { limit: 36, symbol: '[Kr]', num: 36 },
    { limit: 54, symbol: '[Xe]', num: 54 },
    { limit: 86, symbol: '[Rn]', num: 86 }
  ];
  if (num === 1) return '1s¹';
  if (num === 2) return '1s²';
  
  let core = { symbol: '', num: 0 };
  for (const c of nobleGasCore) {
    if (num > c.num) {
      core = c;
    }
  }
  
  const diff = num - core.num;
  if (num === 6) return '[He] 2s² 2p²';
  if (num === 7) return '[He] 2s² 2p³';
  if (num === 8) return '[He] 2s² 2p⁴';
  if (num === 14) return '[Ne] 3s² 3p²';
  if (num === 26) return '[Ar] 3d⁶ 4s²';
  if (num === 29) return '[Ar] 3d¹⁰ 4s¹';
  if (num === 79) return '[Xe] 4f¹⁴ 5d¹⁰ 6s¹';
  if (num === 92) return '[Rn] 5f³ 6d¹ 7s²';
  
  if (core.num === 2) return `${core.symbol} 2s${diff <= 2 ? diff : 2}${diff > 2 ? ` 2p${diff - 2}` : ''}`;
  if (core.num === 10) return `${core.symbol} 3s${diff <= 2 ? diff : 2}${diff > 2 ? ` 3p${diff - 2}` : ''}`;
  if (core.num === 18) {
    if (diff <= 2) return `${core.symbol} 4s${diff}`;
    return `${core.symbol} 3d${diff - 2 > 10 ? 10 : diff - 2} 4s${diff - 2 > 10 ? diff - 12 : 2}`;
  }
  if (core.num === 36) {
    if (diff <= 2) return `${core.symbol} 5s${diff}`;
    return `${core.symbol} 4d${diff - 2 > 10 ? 10 : diff - 2} 5s${diff - 2 > 10 ? diff - 12 : 2}`;
  }
  if (core.num === 54) {
    if (diff <= 2) return `${core.symbol} 6s${diff}`;
    if (diff <= 16) return `${core.symbol} 4f${diff - 2} 6s²`;
    return `${core.symbol} 4f¹⁴ 5d${diff - 16 > 10 ? 10 : diff - 16} 6s${diff - 16 > 10 ? diff - 26 : 2}`;
  }
  if (core.num === 86) {
    if (diff <= 2) return `${core.symbol} 7s${diff}`;
    if (diff <= 16) return `${core.symbol} 5f${diff - 2} 7s²`;
    return `${core.symbol} 5f¹⁴ 6d${diff - 16 > 10 ? 10 : diff - 16} 7s${diff - 16 > 10 ? diff - 26 : 2}`;
  }
  return '';
}

// Famous core overrides for selected elements to maintain pristine, high-end detailed commentary
const ELEMENT_OVERRIDES: Record<number, Partial<ChemicalElement>> = {
  1: {
    summary: 'The absolute primordial seed of the Cosmos, constituting roughly 75% of all baryonic gas mass.',
    funFact: 'Under extreme planetary pressures like Jupiter\'s core, H transforms into a superconducting liquid metal.',
    discoveredBy: 'Henry Cavendish', year: 1766, density: '0.08988 g/L', meltingPoint: '14.01 K (-259.14 °C)', boilingPoint: '20.28 K (-252.87 °C)',
    electronegativity: 2.20, ionizationEnergy: '1312 kJ/mol', realWorldUses: ['Clean Fuel Cells', 'Ammonia Production', 'Stellar Fusion Ignition'], reactivity: 'High'
  },
  2: {
    summary: 'A completely chemically inert, colorless noble gas. It represents the second lightest element in existence.',
    funFact: 'When chilled below 2.17 Kelvin, Helium becomes a superfluid with zero viscosity, crawling up the walls of its cell.',
    discoveredBy: 'Jules Janssen, Norman Lockyer', year: 1868, density: '0.1786 g/L', meltingPoint: '0.95 K (-272.2 °C)', boilingPoint: '4.22 K (-268.93 °C)',
    electronegativity: null, ionizationEnergy: '2372 kJ/mol', realWorldUses: ['Cryogenic Cooling', 'Deep Hull Pressurization', 'Superconducting Magnets'], reactivity: 'Inert'
  },
  3: {
    summary: 'A highly reactive, ultra-lightweight alkali metal displaying the lowest density of any solid element.',
    funFact: 'Lithium acts as a powerful electrochemical conductor, floating on oil and reacting immediately with moist air.',
    discoveredBy: 'Johan August Arfwedson', year: 1817, density: '0.534 g/cm³', meltingPoint: '453.69 K (180.54 °C)', boilingPoint: '1615 K (1342 °C)',
    electronegativity: 0.98, ionizationEnergy: '520 kJ/mol', realWorldUses: ['High-Energy Batteries', 'Heavy Metal Alloys', 'Tritium Breeding'], reactivity: 'High'
  },
  4: {
    summary: 'An extremely stiff, high-melting-point alkaline earth metal with superb thermal conductivity.',
    funFact: 'Beryllium is highly transparent to X-rays, making it the perfect choice for high-energy nuclear beam windows.',
    discoveredBy: 'Louis Nicolas Vauquelin', year: 1798, density: '1.85 g/cm³', meltingPoint: '1560 K (1287 °C)', boilingPoint: '2742 K (2469 °C)',
    electronegativity: 1.57, ionizationEnergy: '900 kJ/mol', realWorldUses: ['Aerospace Gyroscopes', 'X-ray Window Seals', 'James Webb Mirror Scaffolds'], reactivity: 'Moderate'
  },
  5: {
    summary: 'A tough, low-density metalloid crucial for establishing strong industrial borosilicate structures.',
    funFact: 'Amorphously synthesized boron burns with an intense, signature futuristic emerald green plasma glow.',
    discoveredBy: 'Joseph Louis Gay-Lussac', year: 1808, density: '2.34 g/cm³', meltingPoint: '2349 K (2076 °C)', boilingPoint: '4200 K (3927 °C)',
    electronegativity: 2.04, ionizationEnergy: '801 kJ/mol', realWorldUses: ['Reactor Control Rods', 'Borosilicate Glasses', 'Neodymium Magnets'], reactivity: 'Moderate'
  },
  6: {
    summary: 'The definitive geometric backbone of the structural carbon chemistry and all organic life forms.',
    funFact: 'Graphite layers slide like silk, yet carbon carbon lattice lattices create diamonds - the hardest natural minerals.',
    discoveredBy: 'Ancient civilizations', year: -3750, density: '2.267 g/cm³', meltingPoint: '3823 K (3550 °C)', boilingPoint: '4300 K (4027 °C)',
    electronegativity: 2.55, ionizationEnergy: '1086 kJ/mol', realWorldUses: ['Graphene Circuits', 'Reinforced Polymers', 'Radiocarbon Telemetry'], reactivity: 'Moderate'
  },
  7: {
    summary: 'A colorless gas making up about 78% of Earth\'s atmosphere, acting as an atmospheric inert buffer.',
    funFact: 'Liquid nitrogen boils instantly at room temperature, freezing cells instantly upon cryo engagement.',
    discoveredBy: 'Daniel Rutherford', year: 1772, density: '1.2506 g/L', meltingPoint: '63.15 K (-210 °C)', boilingPoint: '77.36 K (-195.79 °C)',
    electronegativity: 3.04, ionizationEnergy: '1402 kJ/mol', realWorldUses: ['Cryogenic Freezing', 'Inert Atmosphere Purge', 'Fertilizer Synthesis'], reactivity: 'Moderate'
  },
  8: {
    summary: 'An exceptionally reactive nonmetal and biological fuel agent powering aerobic respirators globally.',
    funFact: 'Liquid oxygen exhibits strong paramagnetic behaviors, hovering suspended between powerful magnetic poles.',
    discoveredBy: 'Carl Wilhelm Scheele', year: 1772, density: '1.429 g/L', meltingPoint: '54.36 K (-218.79 °C)', boilingPoint: '90.2 K (-182.95 °C)',
    electronegativity: 3.44, ionizationEnergy: '1314 kJ/mol', realWorldUses: ['Life Support Circuits', 'Stellar Rocket Oxidizers', 'Blast Furnace Smelting'], reactivity: 'Extreme'
  },
  9: {
    summary: 'The most reactive of all chemical elements, a pale yellow halogen that immediately eats organic matter.',
    funFact: 'Fluorine reacts explosively with water, ice, and glass, igniting carbon blocks at room temperature.',
    discoveredBy: 'Henri Moissan', year: 1886, density: '1.696 g/L', meltingPoint: '53.48 K (-219.67 °C)', boilingPoint: '85.03 K (-188.12 °C)',
    electronegativity: 3.98, ionizationEnergy: '1681 kJ/mol', realWorldUses: ['Uranium Enrichment', 'Acoustic Fluoropolymer coatings', 'Super-acid Synthesis'], reactivity: 'Extreme'
  },
  10: {
    summary: 'A colorless noble gas glowing with a vibrant, intense futuristic orange-red plasma discharge.',
    funFact: 'Despite its common presence in neon lights, neon is rare in Earth\'s crust, sourced mostly from air liquefaction.',
    discoveredBy: 'William Ramsay, Morris Travers', year: 1898, density: '0.9002 g/L', meltingPoint: '24.56 K (-248.59 °C)', boilingPoint: '27.07 K (-246.08 °C)',
    electronegativity: null, ionizationEnergy: '2081 kJ/mol', realWorldUses: ['Plasma Discharge Tubes', 'Excimer Laser Channels', 'Cryogenic Refrigerants'], reactivity: 'Inert'
  },
  11: {
    summary: 'A soft, silvery alkali metal that floats on water and oxidizes violently into white sodium oxides.',
    funFact: 'Sodium is so easily sliced that a warm laboratory knife glides through metallic sodium like refrigerated butter.',
    discoveredBy: 'Humphry Davy', year: 1807, density: '0.968 g/cm³', meltingPoint: '370.87 K (97.72 °C)', boilingPoint: '1156 K (883 °C)',
    electronegativity: 0.93, ionizationEnergy: '496 kJ/mol', realWorldUses: ['Sodium-Ion Batteries', 'Cooling Nuclear Reactors', 'Sodium Vapor Lights'], reactivity: 'High'
  },
  12: {
    summary: 'A lightweight alkaline earth metal that ignites with a blinding, pure white electromagnetic glow.',
    funFact: 'Magnesium acts as the central chlorophyll receptor, capturing solar rays to fuel planetary photosynthesis.',
    discoveredBy: 'Joseph Black', year: 1755, density: '1.738 g/cm³', meltingPoint: '923 K (650 °C)', boilingPoint: '1363 K (1090 °C)',
    electronegativity: 1.31, ionizationEnergy: '738 kJ/mol', realWorldUses: ['Lightweight Structural Alloys', 'Flares and Pyrotechnics', 'Biological Cell Engines'], reactivity: 'High'
  },
  13: {
    summary: 'A low-density, corrosion-resistant post-transition metal representing the foundation of aircraft frameworks.',
    funFact: 'Once more precious than gold because of difficult refining, Emperor Napoleon III dined with aluminum forks.',
    discoveredBy: 'Hans Christian Ørsted', year: 1825, density: '2.70 g/cm³', meltingPoint: '933.47 K (660.32 °C)', boilingPoint: '2792 K (2519 °C)',
    electronegativity: 1.61, ionizationEnergy: '578 kJ/mol', realWorldUses: ['Aviation Structures', 'Alloy Heat Sinks', 'Interstellar Shield Liners'], reactivity: 'Moderate'
  },
  14: {
    summary: 'An abundant semiconductor metalloid acting as the silicon foundational framework of microelectronics.',
    funFact: 'Silicon comprises more than 27% of Earth\'s structural crust, making up sands, quartz, and heavy clay fields.',
    discoveredBy: 'Jöns Jacob Berzelius', year: 1823, density: '2.329 g/cm³', meltingPoint: '1687 K (1414 °C)', boilingPoint: '3538 K (3265 °C)',
    electronegativity: 1.90, ionizationEnergy: '787 kJ/mol', realWorldUses: ['Semiconductor Microchips', 'Solar Panel Grids', 'Glassware Compounds'], reactivity: 'Moderate'
  },
  15: {
    summary: 'A highly reactive, non-metallic element existing in highly combustible red, white, and black structures.',
    funFact: 'White phosphorus ignites spontaneously in normal air, producing a bright white toxic phosphorus smoke.',
    discoveredBy: 'Hennig Brand', year: 1669, density: '1.823 g/cm³', meltingPoint: '317.3 K (44.15 °C)', boilingPoint: '553.6 K (280.5 °C)',
    electronegativity: 2.19, ionizationEnergy: '1012 kJ/mol', realWorldUses: ['Bio-energetic Phosphates', 'Combustive Flares', 'Specialty Chemical Smelts'], reactivity: 'High'
  },
  16: {
    summary: 'A pale yellow, nonmetallic crystalline element forming volcanic vapors and industrial battery acids.',
    funFact: 'Pure sulfur is entirely odorless, yet its volatile hydrogen sulfides create the classic rotten egg scent.',
    discoveredBy: 'Ancient civilizations', year: -2000, density: '2.07 g/cm³', meltingPoint: '388.36 K (115.21 °C)', boilingPoint: '717.8 K (444.6 °C)',
    electronegativity: 2.58, ionizationEnergy: '1000 kJ/mol', realWorldUses: ['Lithium-Sulfur Batteries', 'Industrial Sulfuric Acid', 'Rubber Vulcanization'], reactivity: 'Moderate'
  },
  17: {
    summary: 'A choking, neon-greenish-yellow halogen gas behaving as an exceptional biological purifier.',
    funFact: 'Even small leaks of highly reactive chlorine are immediately recognizable by its strong bleach odors.',
    discoveredBy: 'Carl Wilhelm Scheele', year: 1774, density: '3.2 g/L', meltingPoint: '171.6 K (-101.5 °C)', boilingPoint: '239.11 K (-34.04 °C)',
    electronegativity: 3.16, ionizationEnergy: '1251 kJ/mol', realWorldUses: ['Water Purification', 'Disinfectant Solvents', 'Isocyanates Synthesis'], reactivity: 'Extreme'
  },
  18: {
    summary: 'The third most abundant gas in Earth\'s envelope, an inert noble gas glowing with deep violet emissions.',
    funFact: 'Argon provides the perfect protective shield inside historic lightbulbs to halt filament decay.',
    discoveredBy: 'Lord Rayleigh, William Ramsay', year: 1894, density: '1.784 g/L', meltingPoint: '83.8 K (-189.3 °C)', boilingPoint: '87.3 K (-185.8 °C)',
    electronegativity: null, ionizationEnergy: '1521 kJ/mol', realWorldUses: ['GMAW Welding Inert Gas', 'Double-Pane Window Insulation', 'Titanium Refining Shields'], reactivity: 'Inert'
  },
  19: {
    summary: 'An incredibly soft, low-melting alkali metal reacting explosively with water to release hydrogen.',
    funFact: 'Potassium can explode under water even at sub-zero temperatures, forming highly caustic lye.',
    discoveredBy: 'Humphry Davy', year: 1807, density: '0.89 g/cm³', meltingPoint: '336.5 K (63.35 °C)', boilingPoint: '1032 K (759 °C)',
    electronegativity: 0.82, ionizationEnergy: '419 kJ/mol', realWorldUses: ['Potassium-Superoxide breathing masks', 'Agricultural Fertilizers', 'Cardiac Ion Regulators'], reactivity: 'High'
  },
  20: {
    summary: 'A moderately reactive, silver-white alkaline earth metal providing vital structural skeletons to earth life.',
    funFact: 'Calcium represents the fifth most rich element in planetary crusts, forming massive marble hills.',
    discoveredBy: 'Humphry Davy', year: 1808, density: '1.55 g/cm³', meltingPoint: '1115 K (842 °C)', boilingPoint: '1757 K (1484 °C)',
    electronegativity: 1.00, ionizationEnergy: '590 kJ/mol', realWorldUses: ['Structural Bone Scaffold', 'Concrete Formulations', 'Specialty Alloy Reducers'], reactivity: 'High'
  },
  22: {
    summary: 'An ultra-strong, low-density transition metal with superior resistance to seawater corroding agents.',
    funFact: 'Titanium possesses the highest strength-to-weight ratio of all metals, matching steel weight at half mass.',
    discoveredBy: 'William Gregor', year: 1791, density: '4.506 g/cm³', meltingPoint: '1941 K (1668 °C)', boilingPoint: '3560 K (3287 °C)',
    electronegativity: 1.54, ionizationEnergy: '659 kJ/mol', realWorldUses: ['Aeronautic Fuselages', 'Orthopedic Transplants', 'Chemical Reactor Pipes'], reactivity: 'Low'
  },
  24: {
    summary: 'A lustrous, hard transition metal displaying superb mirror polishing values and anti-corrosion properties.',
    funFact: 'Chromium creates the mesmerizing red shades of rubies and the vibrant emerald green of chromium gemstones.',
    discoveredBy: 'Louis Nicolas Vauquelin', year: 1797, density: '7.19 g/cm³', meltingPoint: '2180 K (1907 °C)', boilingPoint: '2944 K (2671 °C)',
    electronegativity: 1.66, ionizationEnergy: '653 kJ/mol', realWorldUses: ['Chrome Electroplating', 'Corrosion-Proof Stainless Steels', 'Pigment Coloring Markers'], reactivity: 'Moderate'
  },
  25: {
    summary: 'A hard, brittle gray-white metal crucial for hardening steel alloys against destructive friction wear.',
    funFact: 'First used in prehistoric cave paintings, manganese triggers crucial oxygen formation during plant respiration.',
    discoveredBy: 'Carl Wilhelm Scheele', year: 1774, density: '7.21 g/cm³', meltingPoint: '1519 K (1246 °C)', boilingPoint: '2334 K (2061 °C)',
    electronegativity: 1.55, ionizationEnergy: '717 kJ/mol', realWorldUses: ['High-Strength Manganese Alloys', 'Metal Rust Converters', 'Stony-Meteorite Research'], reactivity: 'Moderate'
  },
  26: {
    summary: 'The abundant planetary metal forming Earth\'s hot magnetic core and stellar nucleosynthesis end.',
    funFact: 'A star\'s life terminates in a supernova when its core fuses Fe, consuming more thermal energy than it returns.',
    discoveredBy: 'Ancient civilizations', year: -5000, density: '7.874 g/cm³', meltingPoint: '1811 K (1538 °C)', boilingPoint: '3134 K (2861 °C)',
    electronegativity: 1.83, ionizationEnergy: '762 kJ/mol', realWorldUses: ['Reinforced Structural Steels', 'Transformer Induction Cores', 'Atmospheric Oxygen Hemoglobins'], reactivity: 'Moderate'
  },
  27: {
    summary: 'A ferromagnetic, hard transition metal forming crucial high-temperature industrial superalloys.',
    funFact: 'Cobalt creates an iconic, deep radiant ocean blue color used historically in Egyptian glasswares.',
    discoveredBy: 'Georg Brandt', year: 1735, density: '8.90 g/cm³', meltingPoint: '1768 K (1495 °C)', boilingPoint: '3200 K (2927 °C)',
    electronegativity: 1.88, ionizationEnergy: '760 kJ/mol', realWorldUses: ['Jet Engine Turbine Blades', 'Rechargeable Battery Cathodes', 'Surgical Implant Structures'], reactivity: 'Low'
  },
  28: {
    summary: 'A silvery-white transition metal with superior resistance to atmospheric oxidation processes.',
    funFact: 'Nickel comprises a substantial portion of metallic meteorites, raining down on primordial Earth.',
    discoveredBy: 'Axel Fredrik Cronstedt', year: 1751, density: '8.908 g/cm³', meltingPoint: '1728 K (1455 °C)', boilingPoint: '3186 K (2913 °C)',
    electronegativity: 1.91, ionizationEnergy: '737 kJ/mol', realWorldUses: ['Electroplated Shell Coatings', 'Alnico High-Power Magnets', 'Monel Marine Corrosion Valves'], reactivity: 'Low'
  },
  29: {
    summary: 'A highly ductile metal exhibiting exceptional electrical conductivity and natural anti-microbial shields.',
    funFact: 'Freshly synthesized copper displays a reddish metallic luster, oxidizing gradually into a green patina armor.',
    discoveredBy: 'Middle East settlers', year: -9000, density: '8.96 g/cm³', meltingPoint: '1357.77 K (1084.62 °C)', boilingPoint: '2835 K (2562 °C)',
    electronegativity: 1.90, ionizationEnergy: '745 kJ/mol', realWorldUses: ['Global High-Voltage Wiring', 'Antibacterial Surfaces', 'Heat Exchanger Blocks'], reactivity: 'Moderate'
  },
  30: {
    summary: 'A blue-gray metal crucial for galvanizing iron against destructive atmospheric moisture rusting.',
    funFact: 'An essential cofactor in more than 300 human biological enzymes, zinc fuels genetic code repairs.',
    discoveredBy: 'Indian metallurgists', year: -1000, density: '7.14 g/cm³', meltingPoint: '692.68 K (419.53 °C)', boilingPoint: '1180 K (907 °C)',
    electronegativity: 1.65, ionizationEnergy: '906 kJ/mol', realWorldUses: ['Corrosion Protective Galvanizing', 'Brass and Bronze Alloys', 'Immune Defense Enzymes'], reactivity: 'Moderate'
  },
  33: {
    summary: 'A highly toxic grey metalloid historically renowned as the ultimate undetectable trace poison.',
    funFact: 'Despite its toxic traits, arsenic doping boosts the high-frequency speed of solar gallium-arsenide cells.',
    discoveredBy: 'Albertus Magnus', year: 1250, density: '5.727 g/cm³', meltingPoint: '1090 K (817 °C)', boilingPoint: '887 K (Sublimates)',
    electronegativity: 2.18, ionizationEnergy: '947 kJ/mol', realWorldUses: ['Gallium Arsenide Semiconductors', 'Preserving Wood Structural Borers', 'Lead-Alloy Bullet Hardening'], reactivity: 'Moderate'
  },
  35: {
    summary: 'The only nonmetallic element that exists as a heavy, reddish-brown volatile liquid at room temperatures.',
    funFact: 'Bromine fumes display a thick, highly dense orange gas cloud that irritates human eyes instantly.',
    discoveredBy: 'Antoine Jérôme Balard', year: 1826, density: '3.102 g/cm³', meltingPoint: '265.8 K (-7.2 °C)', boilingPoint: '332 K (58.8 °C)',
    electronegativity: 2.96, ionizationEnergy: '1140 kJ/mol', realWorldUses: ['Flame retardant treatments', 'Specialty Photographic Silver Halides', 'Chemical Emulsion Sanitizers'], reactivity: 'Extreme'
  },
  36: {
    summary: 'A heavy atmospheric noble gas glowing with a pristine bright green/orange spectral flash.',
    funFact: 'Krypton lasers power high-precision retinal photocoagulators to seal leaking eye vessels.',
    discoveredBy: 'William Ramsay, Morris Travers', year: 1898, density: '3.749 g/L', meltingPoint: '115.79 K (-157.36 °C)', boilingPoint: '119.93 K (-153.22 °C)',
    electronegativity: 3.00, ionizationEnergy: '1351 kJ/mol', realWorldUses: ['High-Power Airfield Strobe Lights', 'Therapeutic Retinal Laser Channels', 'Specialty Insulation Fillers'], reactivity: 'Inert'
  },
  47: {
    summary: 'A gorgeous, soft white metal with the absolute highest electrical conductivity of all known elements.',
    funFact: 'Silver represents the ultimate light reflector, bouncing back more than 99% of visible light rays.',
    discoveredBy: 'Anatolia miners', year: -3000, density: '10.49 g/cm³', meltingPoint: '1234.93 K (961.78 °C)', boilingPoint: '2435 K (2162 °C)',
    electronegativity: 1.93, ionizationEnergy: '731 kJ/mol', realWorldUses: ['High-Reflection Mirror Blanks', 'Micro-Electronic Solder Joints', 'Antibacterial Surgical Dressings'], reactivity: 'Low'
  },
  53: {
    summary: 'A deep violet, lustrous halogen solid that sublimates smoothly into highly dense purple vapors.',
    funFact: 'Iodine concentrates highly in active thyroid glands, building metabolic rate regulatory hormones.',
    discoveredBy: 'Bernard Courtois', year: 1811, density: '4.933 g/cm³', meltingPoint: '386.85 K (113.7 °C)', boilingPoint: '457.4 K (184.3 °C)',
    electronegativity: 2.66, ionizationEnergy: '1008 kJ/mol', realWorldUses: ['Surgical Antiseptics', 'Radio-contrast Diagnostic Agents', 'Anti-Radiation Potassium Pills'], reactivity: 'High'
  },
  54: {
    summary: 'An extremely heavy noble gas that glows with an incredibly clean sky-blue electric flash.',
    funFact: 'Xenon engines generate light-speed microscopic particle thrusts, driving robotic interplanetary probes.',
    discoveredBy: 'William Ramsay, Morris Travers', year: 1898, density: '5.894 g/L', meltingPoint: '161.4 K (-111.7 °C)', boilingPoint: '165.03 K (-108.07 °C)',
    electronegativity: 2.60, ionizationEnergy: '1170 kJ/mol', realWorldUses: ['Ion Propulsion Space Thrusters', 'Deep Seawater Diving Lights', 'IMAX Projection HMI Arc Lamps'], reactivity: 'Inert'
  },
  55: {
    summary: 'An extremely reactive alkali metal that melts in hands and explodes on contact with cool water.',
    funFact: 'Its ticking atomic resonance sets the global definition of a single second to atomic perfection.',
    discoveredBy: 'Robert Bunsen, Gustav Kirchhoff', year: 1860, density: '1.93 g/cm³', meltingPoint: '301.59 K (28.44 °C)', boilingPoint: '944 K (671 °C)',
    electronegativity: 0.79, ionizationEnergy: '376 kJ/mol', realWorldUses: ['Atomic Clocks Accuracy Calibration', 'Density Gradient Centrifugations', 'Photosensitive Vacuum Diodes'], reactivity: 'Extreme'
  },
  56: {
    summary: 'An active, soft alkaline earth metal manifesting as an exceptional medical tracer for intestinal scans.',
    funFact: 'Barium absorbs X-rays completely, outlining biological blockages during digestive imaging.',
    discoveredBy: 'Carl Wilhelm Scheele', year: 1774, density: '3.51 g/cm³', meltingPoint: '1000 K (727 °C)', boilingPoint: '2170 K (1897 °C)',
    electronegativity: 0.89, ionizationEnergy: '503 kJ/mol', realWorldUses: ['Intestinal Contrast marker', 'Vacuum Tube Degasser Traps', 'Fireworks Green Emission Starches'], reactivity: 'High'
  },
  78: {
    summary: 'An incredibly unreactive precious metal that acts as an exceptional agent for therapeutic cancer drugs.',
    funFact: 'Platinum is so stable that it resists all acids unless attacked by the lethal "royal water" (aqua regia).',
    discoveredBy: 'Antonio de Ulloa', year: 1735, density: '21.45 g/cm³', meltingPoint: '2041.4 K (1768.3 °C)', boilingPoint: '4098 K (3825 °C)',
    electronegativity: 2.28, ionizationEnergy: '870 kJ/mol', realWorldUses: ['Emission Catalytic Converter meshes', 'Pacemaker Lead Electrodes', 'Chemotherapy Metal Complexes'], reactivity: 'Low'
  },
  79: {
    summary: 'An extraordinarily dense, malleable precious metal that maintains a rich golden lustre and resists all chemical weathering.',
    funFact: 'Gold is so incredibly ductile that a single ounce can be drawn into a hair-thin wire stretching over 50 miles long.',
    discoveredBy: 'Prehistoric humans', year: -4000, density: '19.3 g/cm³', meltingPoint: '1337.33 K (1064.18 °C)', boilingPoint: '3129 K (2856 °C)',
    electronegativity: 2.54, ionizationEnergy: '890 kJ/mol', realWorldUses: ['Financial Assets Reserves', 'Corrosion-proof Micro-wiring', 'Astronaut Gold visor foils'], reactivity: 'Low'
  },
  80: {
    summary: 'The only transition metal that remains liquid at standard room temperature. Heavy, highly toxic, historically called "quicksilver".',
    funFact: 'Despite its liquid state, mercury represents such a dense fluid that heavy iron blocks can float on it like toy boats.',
    discoveredBy: 'Ancient Egyptians', year: -1500, density: '13.534 g/cm³', meltingPoint: '234.32 K (-38.83 °C)', boilingPoint: '629.88 K (356.73 °C)',
    electronegativity: 2.00, ionizationEnergy: '1007 kJ/mol', realWorldUses: ['Silent Liquid Contactors', 'Ultraviolet Fluorescent tubes', 'Precision Laboratory Barometers'], reactivity: 'Low'
  },
  82: {
    summary: 'A heavy, dense post-transition metal possessing exceptional ionizing radiation shielding performance.',
    funFact: 'Ancient Romans lined culinary lead water channels with lead, leading to chronic systemic toxicity.',
    discoveredBy: 'Middle East metallurgists', year: -6400, density: '11.34 g/cm³', meltingPoint: '600.61 K (327.46 °C)', boilingPoint: '2022 K (1749 °C)',
    electronegativity: 1.87, ionizationEnergy: '716 kJ/mol', realWorldUses: ['Ionizing Gamma Shields', 'Sealed Lead Batteries', 'Vibration Seismic Dampers'], reactivity: 'Low'
  },
  83: {
    summary: 'A heavy, brittle pinkish-white post-transition metal displaying highly unique diamagnetic properties.',
    funFact: 'Its safe nuclear configuration decays with a half-life of 20 billion billion years, virtually stable.',
    discoveredBy: 'Claude François Geoffroy', year: 1753, density: '9.78 g/cm³', meltingPoint: '544.7 K (271.5 °C)', boilingPoint: '1837 K (1564 °C)',
    electronegativity: 2.02, ionizationEnergy: '703 kJ/mol', realWorldUses: ['Fire Suppressing Fusible plugs', 'Nuclear Cooling Lead Alloys', 'Non-Toxic Lead replacements'], reactivity: 'Low'
  },
  86: {
    summary: 'An extremely heavy radioactive noble gas that pools in deep caverns and stone basement structures.',
    funFact: 'Radon holds the record as the densest known gas, weighing nearly 100 times more than air.',
    discoveredBy: 'Ernest Rutherford, Robert Owens', year: 1899, density: '9.73 g/L', meltingPoint: '202 K (-71 °C)', boilingPoint: '211.3 K (-61.8 °C)',
    electronegativity: 2.20, ionizationEnergy: '1037 kJ/mol', realWorldUses: ['Underground Seismological gas monitoring', 'Target Radioactive tumor therapies', 'Geological mineral tracking'], reactivity: 'Inert'
  },
  88: {
    summary: 'An unstable alkaline earth metal discovered by Marie Curie, glowing with a ghostly, faint green luminosity.',
    funFact: 'Marie Curie carried radium tubes inside her lab pockets, unaware of ionizing radiation hazards.',
    discoveredBy: 'Marie and Pierre Curie', year: 1898, density: '5.5 g/cm³', meltingPoint: '973 K (700 °C)', boilingPoint: '2010 K (1737 °C)',
    electronegativity: 0.90, ionizationEnergy: '509 kJ/mol', realWorldUses: ['Historical Self-Luminous Dials', 'Target Alpha Cancer treatments', 'Primary Neutron Spawning sources'], reactivity: 'Extreme'
  },
  90: {
    summary: 'A silver-white, weakly radioactive actinide metal presenting massive potential as a safe nuclear fuel alternative.',
    funFact: 'Thorium fission emits no weaponizable plutonium, acting as an exceptional civil atomic power option.',
    discoveredBy: 'Jöns Jacob Berzelius', year: 1828, density: '11.72 g/cm³', meltingPoint: '2023 K (1750 °C)', boilingPoint: '5061 K (4788 °C)',
    electronegativity: 1.30, ionizationEnergy: '587 kJ/mol', realWorldUses: ['High-Safety Molten Salt Reactors', 'Intense Heat Gas mantles', 'Specialty High-Refraction Lenses'], reactivity: 'Moderate'
  },
  92: {
    summary: 'A dense, uranium-heavy radioactive metal acting as the primary fuel source for nuclear power drives.',
    funFact: 'Traces of uranium added to vintage glass (Vaseline glass) generate a haunting neon-green glow under UV stars.',
    discoveredBy: 'Martin Heinrich Klaproth', year: 1789, density: '19.1 g/cm³', meltingPoint: '1405.3 K (1132.2 °C)', boilingPoint: '4404 K (4131 °C)',
    electronegativity: 1.38, ionizationEnergy: '597 kJ/mol', realWorldUses: ['Nuclear Fission Reactors', 'Naval Aircraft Carrier turbines', 'Armor Shield Heavy Alloys'], reactivity: 'Moderate'
  },
  94: {
    summary: 'An artificially synthesized actinide metal presenting immense energy potential for space propulsion.',
    funFact: 'Plutonium-238 isotopes generate thermal radiation that powers deep space voyagers for many decades.',
    discoveredBy: 'Glenn T. Seaborg', year: 1940, density: '19.81 g/cm³', meltingPoint: '912.5 K (639.4 °C)', boilingPoint: '3501 K (3228 °C)',
    electronegativity: 1.28, ionizationEnergy: '585 kJ/mol', realWorldUses: ['Radioisotope Thermoelectric Generators', 'Deep Space Voyager batteries', 'Atomic Warhead cores'], reactivity: 'Moderate'
  }
};

// Helper functions for Orbiter Expanded Scientific Knowledge Universe
function getOxidationStates(num: number, category: ElementCategory, group: number): number[] {
  if (category === 'noble-gas') return [0];
  if (category === 'alkali-metal') return [1];
  if (category === 'alkaline-earth') return [2];
  if (category === 'halogen') return [-1, 1, 3, 5, 7];
  if (num === 8) return [-2, -1]; // Oxygen
  if (num === 1) return [-1, 1]; // Hydrogen
  if (num === 7) return [-3, -2, -1, 1, 2, 3, 4, 5]; // Nitrogen
  if (num === 6) return [-4, -3, -2, -1, 1, 2, 3, 4]; // Carbon
  if (category === 'transition-metal') {
    if (num === 26) return [2, 3, 6]; // Iron
    if (num === 29) return [1, 2]; // Copper
    if (num === 79) return [1, 3]; // Gold
    if (num === 80) return [1, 2]; // Mercury
    return [2, 3, 4];
  }
  if (category === 'lanthanide') return [3, 4];
  if (category === 'actinide') return [3, 4, 5, 6];
  return [1, 2, 3, 4];
}

function getConductivityStyle(num: number, category: ElementCategory, state: string): string {
  if (num === 79) return 'Superb electrical and thermal conductor (4.1 × 10⁷ S/m). Highly resistant to oxidation.';
  if (num === 29) return 'Exceptional electrical conductivity (5.9 × 10⁷ S/m). The global standard for wiring.';
  if (category === 'noble-gas') return 'Insulator (0 S/m under standard conditions). Conducts beautifully via ionized plasma glow under high electric fields.';
  if (category === 'alkali-metal') return 'High electrical and heat conductivity typical of extremely reactive elements.';
  if (category === 'transition-metal') return 'Excellent thermal and electrical conductivity due to free-flowing sea of valence d-electrons.';
  if (category === 'metalloid') return 'Semi-conductive (conducts selectively based on temperature, doping levels, and light absorption).';
  if (state === 'gas' || category === 'reactive-nonmetal') return 'Extremely poor thermal and electrical conductor; acts as a highly effective insulator.';
  return 'Moderate electrical conductibility of metallic post-transition alloys.';
}

function getNameOriginInfo(num: number, symbol: string, name: string): string {
  if (num === 1) return "From the Greek word 'hydro' (water) and 'genes' (creator), representing its ability to form water upon oxidation.";
  if (num === 2) return "From 'Helios', the Greek God of the Sun, since it was first discovered spectroscopically in solar flares before Earth.";
  if (num === 3) return "From the Greek word 'lithos' (stone), reflecting its discovery inside solid mineral ores rather than plant ash.";
  if (num === 6) return "Derived from the Latin word 'carbo' (coal or charcoal), referring to its ancient uses and elemental carbon fuels.";
  if (num === 7) return "From the Greek 'nitron' (native soda) and 'genes' (forming), as it was found in nitric compounds.";
  if (num === 8) return "From the Greek 'oxys' (acid) and 'genes' (creator), because Antoine Lavoisier incorrectly believed it was an indispensable part of all acids.";
  if (num === 10) return "Derived from 'neos', the Greek word for 'new', reflecting its exciting discovery as a newly isolated atmospheric noble gas.";
  if (num === 26) return "From the Anglo-Saxon 'iren'. The classical symbol 'Fe' comes from the Latin 'ferrum', indicating strength and iron craftsmanship.";
  if (num === 79) return "From the Sanskrit 'jval' (to shine), and the Anglo-Saxon 'gold'. The chemical symbol 'Au' is from the Latin 'aurum' (shining dawn).";
  if (num === 80) return "Named after the swift Roman messenger planet Mercury. Symbol 'Hg' is from 'hydrargyrum' (Greek for silver water / quicksilver).";
  if (num === 92) return "Named in honor of the recently discovered planet Uranus by German chemist Martin Klaproth in 1789.";
  
  // Dynamic fallback based on category
  if (num >= 93) return `Named after astronomical bodies, deep classical mythologies, or world-class nuclear laboratories following its synthetic isolation.`;
  return `Derived from classical Latin or Greek roots which refer to its distinctive chemical properties, color, or the localized mineral ores of its discovery.`;
}

function getCosmicRelevance(num: number, symbol: string, category: ElementCategory): string {
  if (num === 1) return "The absolute primordial seed of the Cosmos. Created in massive quantities during the Hot Big Bang, it drives the nuclear furnace of every active main-sequence star.";
  if (num === 2) return "Born primarily during Big Bang nucleosynthesis, second only to Hydrogen. It serves as the primary byproduct of ongoing stellar fusion and is highly stable.";
  if (num === 6) return "Synthesized inside giant red stars via the triple-alpha process. It represents the central element of the biological universe and planetary soils.";
  if (num === 8) return "The third most abundant element in the universe. Produced by massive stars at the end of the helium burning cycle, and a crucial component of planetary crusts.";
  if (num === 26) return "The nuclear endpoint of stellar nucleosynthesis. Synthesizing heavier elements than Iron requires net energy input, triggering catastrophic stellar collapses (Supernovae).";
  if (num === 92) return "Synthesized during rapid neutron capture (r-process) in cataclysmic collisions of binary neutron stars (Kilonovae) and hypernovae.";
  
  if (category === 'noble-gas') return "Represents primordial elements or stellar fusion byproducts that remain highly gaseous and concentrated in planetary atmospheres and nebulas.";
  if (category === 'actinide' || num > 83) return "Exclusively generated via intense r-process neutron capture in neutron star merger events, seeding stellar nurseries with radioactive isotopes.";
  if (category === 'lanthanide') return "Synthesized primarily via successive stellar s-process slow neutron captures in giant stars or cataclysmic stellar supernova deaths.";
  return "Synthesized via cosmic-ray spallation or fusion sequences in stars, gradually distributed across interstellar gas clouds and solid planetesimals.";
}

function getBiologicalRelevance(num: number, symbol: string, category: ElementCategory): string {
  if (num === 1) return "Abundant in all living organisms as part of water, cellular fluids, proteins, DNA, carbohydrates, and lipids.";
  if (num === 6) return "The fundamental structural backbone of all organic molecules. Life as we know it is entirely carbon-based, storing and accessing chemical energy in carbon chains!";
  if (num === 7) return "A key constituent of amino acids (proteins), nucleic acids (DNA and RNA), and crucial bio-energetic transfer molecules.";
  if (num === 8) return "The essential electron acceptor in aerobic metabolic respiration, driving adenosine triphosphate (ATP) synthesis to power complex multicellular life.";
  if (num === 15) return "An essential component of the structural DNA/RNA backbone and the cellular energy driver, adenosine triphosphate (ATP).";
  if (num === 20) return "Crucial for physical structural support in skeletal bones/teeth, and a fundamental messenger in cellular muscle contractions.";
  if (num === 26) return "The mechanical center of hemoglobin proteins, binding and transferring atmospheric oxygen molecule packages throughout human blood vessels.";
  if (num === 80 || num === 82) return "Has absolutely no biological function and is extremely toxic. Interferes with neurological signaling, causing brain and cellular degradation.";
  if (category === 'alkali-metal' && (num === 11 || num === 19)) return "Provides the vital electrochemical ion gradient (sodium-potassium pump) needed for neurotransmitter signaling and cardiac rhythms.";
  if (category === 'actinide' || num > 84) return "Presents extreme radioactive biological hazards. Emission of alpha/beta particles destroys cellular double-stranded DNA structures.";
  return "Utilized as a minor trace element or cofactor in complex enzymatic reactions, or has no known biological role but is generally non-toxic at natural quantities.";
}

function getNuclearProperties(num: number, symbol: string, mass: number, state: string): string {
  if (num === 1) return "Three isotopes exist of which Protium (¹H) represents 99.98% of natural abundance. Deuterium (²H) and Tritium (³H) are rare and radioactive respectively.";
  if (num === 6) return "Possesses two highly stable isotopes: Carbon-12 and Carbon-13. Carbon-14 is an unstable radioactive cosmogenic isotope used for dating historic biological remains up to 50,000 years.";
  if (num === 92) return "Highly radioactive nuclear fuel. Naturally contains 0.72% Uranium-235 (fissionable in nuclear chain reactions) and 99.27% Uranium-238 (which requires neutron capture to breed plutonium).";
  if (num >= 84 || state === 'synthetic') return `Unstable and highly radioactive. Contains no stable isotopes; undergoes spontaneous decay via alpha/beta particle paths or spontaneous fission.`;
  return `Highly stable nuclear configuration with ${Math.ceil(mass - num)} neutrons bound tightly to ${num} protons by the strong nuclear force. Resists nuclear fission.`;
}

function getOrbitalBreakdown(num: number, config: string): string {
  if (num === 1) return "1s¹ orbital shell. Contains a single unpaired valence electron with spin-up orientation.";
  if (num === 2) return "1s² orbital shell. Fully closed spherical shell; holds two electrons with anti-parallel spins.";
  return `Valence electron shell configurations represented by ${config}. Outer electrons fill orbitals orderly based on Hund's Rule and Pauli Exclusion principles.`;
}

function getApplications(num: number, name: string): { industrial: string; technology: string; medical: string; spaceAndEnergy: string } {
  if (num === 1) return {
    industrial: "Ammonia synthesis via Haber-Bosch process for fertilizers.",
    technology: "Semiconductor manufacture atmosphere purging.",
    medical: "Therapeutic hydrogen breathing gases for systemic inflammation selective therapy.",
    spaceAndEnergy: "Heavy thrust rocket fuel propellant (liquid H₂ with liquid O₂)."
  };
  if (num === 2) return {
    industrial: "Purging welding shields and leak detection tracer systems.",
    technology: "Superconducting magnet cooling in particle colliders.",
    medical: "Heliox ventilation gases for patients in severe respiratory distress.",
    spaceAndEnergy: "Cryogenic pressurant for rocket fuel tanks and space structures."
  };
  if (num === 6) return {
    industrial: "Hardened steel smelting carbon coke and raw composite structures.",
    technology: "Graphene, carbon nanotubes, and lightweight conductive grids.",
    medical: "Activated charcoal for acute patient poisoning emergency treatments.",
    spaceAndEnergy: "Carbon-carbon heat shielding tiles for atmospheric atmospheric re-entry spacecraft."
  };
  if (num === 8) return {
    industrial: "Smelting oxy-fuel furnaces and blast furnaces for metal refining.",
    technology: "Assisting oxide plasma treatments in electronic manufacturing.",
    medical: "Intensive care resuscitation oxygen masks and mechanical ventilators.",
    spaceAndEnergy: "Primary fuel oxidizer for space shuttle boosters and long-range rockets."
  };
  if (num === 26) return {
    industrial: "Structural steel, beams, reinforcement bars, and load-bearing metal alloy machinery.",
    technology: "Electromagnetic induction transformer cores and magnetic media storage.",
    medical: "Iron-dextran nutritional infusions for severe microcytic anemia therapy.",
    spaceAndEnergy: "Thermal shield structural frames and heavy magnetic containment valves."
  };
  if (num === 79) return {
    industrial: "Rust-proof luxury items, electroplating protective layers, and currency holdings.",
    technology: "Highly reliable corrosion-proof micro-contacts in advanced microchips.",
    medical: "Gold-salt medicinal gels for joint inflammation and radioisotope cancer tracking seeds.",
    spaceAndEnergy: "Gold-coated thin polymer solar foils reflecting harsh solar infrared radiation."
  };
  if (num === 92) return {
    industrial: "Heavy radiation shielding weights and high-density counterweights in ships.",
    technology: "High-yield research reactors generating specialized medicine isotopes.",
    medical: "Uranium radiation sources used for historical therapeutic target ablation.",
    spaceAndEnergy: "Thermal-fission nuclear power drives, atomic spacecraft designs, and nuclear ships."
  };
  
  // Custom fallback categories according to element properties
  return {
    industrial: `Used widely in chemical production catalysis, raw alloy additives, or specialized manufacturing agents for ${name}-based compounds.`,
    technology: `Embedded selectively inside advanced sensor housings, specialty light transmitters, or structural micro-chips.`,
    medical: `Employed in diagnostic imaging chemical markers, trace nutritional cofactors, or specialized laboratory assays.`,
    spaceAndEnergy: `Used in lightweight thermal protection mixtures, highly specific electrical sensors, or high-temperature structural alloy segments.`
  };
}

// Generates elements data with high physical accuracy and beautiful custom visuals
export const ELEMENTS_DATA: ChemicalElement[] = RAW_ELEMENTS.map(([num, symbol, name, mass, category, period, group, state]) => {
  const shells = getAtomicShells(num);
  const config = getElectronConfig(num);
  
  // Predict typical density, boiling and melting ranges programmatically if not overridden
  const baseElectronegativity = (() => {
    if (category === 'noble-gas') return null;
    if (category === 'alkali-metal') return 0.8 + (num * 0.002);
    if (category === 'alkaline-earth') return 1.0 + (num * 0.003);
    if (category === 'halogen') return 4.0 - (num * 0.012);
    return 1.2 + (num * 0.005);
  })();

  const rawOverride = ELEMENT_OVERRIDES[num] || {};

  // Standard visual configuration templates based on Orbitium visual identity system
  const getVisualConfig = (): VisualConfig => {
    switch (category) {
      case 'reactive-nonmetal':
        return {
          primaryColor: '#7C4DFF',
          secondaryGlowColor: '#B388FF',
          atmosphereType: num === 6 ? 'crystal' : 'gas',
          particleStyle: 'nebula',
          energyBehavior: num === 1 ? 'fusion' : 'lattice',
          lightingStyle: 'glowing',
          environmentFeel: `${name} Ambient Field`,
          motionStyle: num === 6 ? 'structured' : 'floating'
        };
      case 'noble-gas':
        return {
          primaryColor: '#00E5FF',
          secondaryGlowColor: '#80DEEA',
          atmosphereType: 'plasma',
          particleStyle: 'lightning',
          energyBehavior: 'discharge',
          lightingStyle: 'neon dynamic',
          environmentFeel: 'Vibrant Plasma Haze',
          motionStyle: 'electric'
        };
      case 'alkali-metal':
        return {
          primaryColor: '#FF5722',
          secondaryGlowColor: '#FFAB91',
          atmosphereType: 'liquid',
          particleStyle: 'stellar',
          energyBehavior: 'fluid',
          lightingStyle: 'warm pulse',
          environmentFeel: 'Thermal Alkali Atmosphere',
          motionStyle: 'floating'
        };
      case 'alkaline-earth':
        return {
          primaryColor: '#FFD600',
          secondaryGlowColor: '#FFE082',
          atmosphereType: 'crystal',
          particleStyle: 'stellar',
          energyBehavior: 'lattice',
          lightingStyle: 'metallic glow',
          environmentFeel: 'Scintillating Spark Lattices',
          motionStyle: 'structured'
        };
      case 'metalloid':
        return {
          primaryColor: '#00E676',
          secondaryGlowColor: '#A3FFD6',
          atmosphereType: 'crystal',
          particleStyle: 'stellar',
          energyBehavior: 'lattice',
          lightingStyle: 'crystalline refraction',
          environmentFeel: 'Semi-conductive Crystalline Array',
          motionStyle: 'structured'
        };
      case 'halogen':
        return {
          primaryColor: '#D500F9',
          secondaryGlowColor: '#F48FB1',
          atmosphereType: 'gas',
          particleStyle: 'decay-ray',
          energyBehavior: 'discharge',
          lightingStyle: 'chemical glare',
          environmentFeel: 'Reactive Aerosol Corridor',
          motionStyle: 'oscillating'
        };
      case 'post-transition-metal':
        return {
          primaryColor: '#00FFB3',
          secondaryGlowColor: '#A7FFEB',
          atmosphereType: 'liquid',
          particleStyle: 'droplet',
          energyBehavior: 'fluid',
          lightingStyle: 'cool metallic reflect',
          environmentFeel: 'Lustrous Alloy Matrix',
          motionStyle: 'oscillating'
        };
      case 'lanthanide':
        return {
          primaryColor: '#FF80AB',
          secondaryGlowColor: '#F8BBD0',
          atmosphereType: 'crystal',
          particleStyle: 'ring',
          energyBehavior: 'lattice',
          lightingStyle: 'fluorescent glow',
          environmentFeel: 'Fluorescent Rare-Earth Field',
          motionStyle: 'oscillating'
        };
      case 'actinide':
        return {
          primaryColor: '#39FF14',
          secondaryGlowColor: '#A5FF7F',
          atmosphereType: 'decay',
          particleStyle: 'decay-ray',
          energyBehavior: 'radioactive',
          lightingStyle: 'radioactive gamma glow',
          environmentFeel: 'Luminous Ionizing Decay Field',
          motionStyle: 'decay'
        };
      case 'transition-metal':
      default:
        return {
          primaryColor: num === 79 ? '#D4AF37' : '#8D99AE',
          secondaryGlowColor: num === 79 ? '#FFD700' : '#DDF0FF',
          atmosphereType: num === 80 ? 'liquid' : 'metal',
          particleStyle: num === 80 ? 'droplet' : 'ring',
          energyBehavior: num === 80 ? 'fluid' : 'metallic',
          lightingStyle: 'cold specular chrome',
          environmentFeel: `${name} Heavy Geometric Grid`,
          motionStyle: num === 80 ? 'oscillating' : 'structured'
        };
    }
  };

  return {
    number: num,
    symbol,
    name,
    mass,
    category,
    period,
    group,
    state,
    electronConfig: config,
    shells,
    summary: rawOverride.summary || `A significant chemical element located in group ${group} of period ${period}. It plays an important role in basic chemistry.`,
    funFact: rawOverride.funFact || `An intriguing atomic candidate in the ${category} family showing typical mechanical properties and unique atomic spacing.`,
    discoveredBy: rawOverride.discoveredBy || 'Unknown researchers',
    year: rawOverride.year !== undefined ? rawOverride.year : 0,
    density: rawOverride.density || `${(num * 0.12).toFixed(2)} g/cm³`,
    meltingPoint: rawOverride.meltingPoint || `${(num * 25).toFixed(0)} K`,
    boilingPoint: rawOverride.boilingPoint || `${(num * 32).toFixed(0)} K`,
    electronegativity: rawOverride.electronegativity !== undefined ? rawOverride.electronegativity : baseElectronegativity,
    ionizationEnergy: rawOverride.ionizationEnergy || `${(900 - num * 2).toFixed(0)} kJ/mol`,
    realWorldUses: rawOverride.realWorldUses || ['Industrial Alloys', 'Laboratory Research', 'Material Enhancers'],
    reactivity: rawOverride.reactivity || (category === 'noble-gas' ? 'Inert' : num % 3 === 0 ? 'High' : 'Moderate'),
    visual: getVisualConfig(),

    // Expanded Knowledge Universe Fields
    protons: num,
    electrons: num,
    neutrons: Math.round(mass) - num,
    oxidationStates: getOxidationStates(num, category, group),
    conductivity: getConductivityStyle(num, category, state),
    nameOrigin: getNameOriginInfo(num, symbol, name),
    cosmicRelevance: getCosmicRelevance(num, symbol, category),
    biologicalRelevance: getBiologicalRelevance(num, symbol, category),
    nuclearProperties: getNuclearProperties(num, symbol, mass, state),
    orbitalBreakdown: getOrbitalBreakdown(num, config),
    applications: getApplications(num, name)
  };
});

export const CATEGORY_COLORS: Record<string, { hex: string; label: string; description: string }> = {
  'alkali-metal': {
    hex: '#FF5722',
    label: 'Alkali Metals',
    description: 'Extremely volatile and reactive metallic elements.'
  },
  'alkaline-earth': {
    hex: '#FFD600',
    label: 'Alkaline Earth',
    description: 'Shiny, moderately reactive solids that burn with bright colorful flames.'
  },
  'transition-metal': {
    hex: '#8D99AE',
    label: 'Transition Metals',
    description: 'High strength, metallic, and lustrous elements that form dense structures.'
  },
  'post-transition-metal': {
    hex: '#00FFB3',
    label: 'Post-Transition Metals',
    description: 'Softer metals lying between transition metals and metalloids.'
  },
  'metalloid': {
    hex: '#00E676',
    label: 'Metalloids',
    description: 'Elements exhibiting properties intermediate between metals and nonmetals.'
  },
  'reactive-nonmetal': {
    hex: '#7C4DFF',
    label: 'Reactive Nonmetals',
    description: 'Abundant, vital non-metallic constituents of life and chemistry.'
  },
  'halogen': {
    hex: '#D500F9',
    label: 'Halogens',
    description: 'Highly electronegative, nonmetallic elements forming intense visual reactive fields.'
  },
  'noble-gas': {
    hex: '#00E5FF',
    label: 'Noble Gases',
    description: 'Highly stable, odorless, inert gases with beautiful glowing atomic discharges.'
  },
  'lanthanide': {
    hex: '#FF80AB',
    label: 'Lanthanides',
    description: 'Rare-earth reactive items with high magnetic and spark emissions.'
  },
  'actinide': {
    hex: '#39FF14',
    label: 'Actinides',
    description: 'Ultra-heavy, naturally unstable, unstable toxic radioactive components.'
  }
};

export const REACTION_CONFIGS: ReactionConfig[] = [
  {
    reactants: ['Na', 'Cl'],
    productName: 'Sodium Chloride (Table Salt)',
    productFormula: 'NaCl',
    description: 'Ionic Bonding: Sodium (alkali metal) donates its valence electron to Chlorine (halogen), establishing a highly stable face-centered cubic ionic salt lattice crystal.',
    visualType: 'ionic'
  },
  {
    reactants: ['H', 'O'],
    productName: 'Water',
    productFormula: 'H₂O',
    description: 'Covalent Bonding: Two Hydrogen atoms share their single valence electrons with one Oxygen atom, forming stable, bent-molecular covalent water particles.',
    visualType: 'covalent'
  },
  {
    reactants: ['Cs', 'H'],
    productName: 'Violent Caesium Hydroxide Alkaline Jet',
    productFormula: 'CsOH + H₂',
    description: 'Extreme Reaction: Caesium reacts violently with Hydrogen/water vapor to form Caesium hydroxide and release flammable Hydrogen gas in an instant plasma explosion.',
    visualType: 'explosion'
  },
  {
    reactants: ['C', 'O'],
    productName: 'Carbon Dioxide Gas',
    productFormula: 'CO₂',
    description: 'Covalent Carbon Bonds: A single Carbon atom shares two pairs of electrons with two separate Oxygen atoms to assemble linear, atmospheric carbon compounds.',
    visualType: 'covalent'
  },
  {
    reactants: ['Fe', 'O'],
    productName: 'Iron Oxide (Rust)',
    productFormula: 'Fe₂O₃',
    description: 'Metallic Oxidation: Iron loses electrons slowly in contact with environmental Oxygen molecules, transforming the dense transition metal into crumbly red rust.',
    visualType: 'ionic'
  },
  {
    reactants: ['H', 'H'],
    productName: 'Thermonuclear Heliogenesis Fusion',
    productFormula: 'He (Primal Sun)',
    description: 'Nuclear Fusion Cascade: Under titanic stellar core pressures, two Hydrogen nuclei fuse directly into Helium, releasing blinding solar plasma streams and mass-energy wave expansion.',
    visualType: 'explosion'
  },
  {
    reactants: ['Ar', 'F'],
    productName: 'Excimer Plasma Quantum Laser',
    productFormula: 'ArF*',
    description: 'Quantum Excitation: Unstable excited gas inert argon with reactive fluorine, discharging coherent high-frequency ultraviolet laser emissions in neon-cyan plasma channels.',
    visualType: 'covalent'
  },
  {
    reactants: ['Y', 'Cu'],
    productName: 'Superconducting YBCO Cuprate Matrix',
    productFormula: 'YBa₂Cu₃O₇-x',
    description: 'Coherent Quantum Levitation: Copper, Yttrium, Barium, and Oxygen coordinate in dense multi-layered perovskite lattices, achieving perfect zero-ohm superconductivity.',
    visualType: 'ionic'
  }
];
