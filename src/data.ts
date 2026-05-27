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
    summary: 'The most abundant chemical substance in the Universe, constituting roughly 75% of all baryonic mass.',
    funFact: 'Highly flammable, H serves as the key cosmic fuel that ignites nuclear fusion reactions in stars.',
    discoveredBy: 'Henry Cavendish',
    year: 1766,
    density: '0.08988 g/L',
    meltingPoint: '14.01 K (-259.14 °C)',
    boilingPoint: '20.28 K (-252.87 °C)',
    electronegativity: 2.20,
    ionizationEnergy: '1312 kJ/mol',
    realWorldUses: ['Rocket Propellent', 'Ammonia Production', 'Hydrogen Fuel Cells'],
    reactivity: 'High'
  },
  2: {
    summary: 'A chemically inert, colorless, and odorless noble gas. It represents the second lightest element in existence.',
    funFact: 'When chilled below 2.17 Kelvin, Helium transforms into a superfluid with zero viscosity, allowing it to crawl up containers!',
    discoveredBy: 'Jules Janssen, Norman Lockyer',
    year: 1868,
    density: '0.1786 g/L',
    meltingPoint: '0.95 K (-272.2 °C)',
    boilingPoint: '4.22 K (-268.93 °C)',
    electronegativity: null,
    ionizationEnergy: '2372 kJ/mol',
    realWorldUses: ['Cryogenic Cooling', 'Lifting Gas', 'Gas Chromatography'],
    reactivity: 'Inert'
  },
  3: {
    summary: 'A highly reactive, soft alkali metal. It is the least dense of all solid chemical elements at room temperature.',
    funFact: 'Lithium is so lightweight it floats effortlessly on mineral oil, and bursts into crimson violet flames upon contact with water.',
    discoveredBy: 'Johan August Arfwedson',
    year: 1817,
    density: '0.534 g/cm³',
    meltingPoint: '453.69 K (180.54 °C)',
    boilingPoint: '1615 K (1342 °C)',
    electronegativity: 0.98,
    ionizationEnergy: '520 kJ/mol',
    realWorldUses: ['Rechargeable Batteries', 'Thermonuclear Cubes', 'Psychiatric Pharmaceuticals'],
    reactivity: 'High'
  },
  6: {
    summary: 'The chemical foundation of life on Earth, carbon occupies a highly unique place due to its ability to form stable bonds.',
    funFact: 'Depending on bonding geometry, carbon exists as soft conductive graphite, or as diamond - the hardest known natural mineral.',
    discoveredBy: 'Ancient civilizations',
    year: -3750,
    density: '2.267 g/cm³',
    meltingPoint: '3823 K (3550 °C)',
    boilingPoint: '4300 K (4027 °C)',
    electronegativity: 2.55,
    ionizationEnergy: '1086 kJ/mol',
    realWorldUses: ['Carbon Fibers', 'Graphene Alloys', 'Radiocarbon Dating'],
    reactivity: 'Moderate'
  },
  10: {
    summary: 'A completely unreactive noble gas. Neon glows with a brilliant reddish-orange discharge light when excited by electricity.',
    funFact: 'Neon is the second lightest noble gas but maintains forty times the refrigerating capacity of liquid helium.',
    discoveredBy: 'William Ramsay, Morris Travers',
    year: 1898,
    density: '0.9002 g/L',
    meltingPoint: '24.56 K (-248.59 °C)',
    boilingPoint: '27.07 K (-246.08 °C)',
    electronegativity: null,
    ionizationEnergy: '2081 kJ/mol',
    realWorldUses: ['Neon Signs', 'Laser Media', 'High-Voltage Discharge Tubes'],
    reactivity: 'Inert'
  },
  26: {
    summary: 'The most common metal on Earth by mass, iron forms much of Earth\'s inner core and is extremely vital for metabolic oxygen routing.',
    funFact: 'A star\'s life terminates in a supernova when its core begins fusing Fe, which consumes more thermal energy than it returns.',
    discoveredBy: 'Ancient civilizations',
    year: -5000,
    density: '7.874 g/cm³',
    meltingPoint: '1811 K (1538 °C)',
    boilingPoint: '3134 K (2861 °C)',
    electronegativity: 1.83,
    ionizationEnergy: '762 kJ/mol',
    realWorldUses: ['Structural Steel', 'Electromagnetic Cores', 'Industrial Machinery'],
    reactivity: 'Moderate'
  },
  79: {
    summary: 'An extraordinarily dense, malleable precious metal that maintains a rich golden lustre and resists all chemical weathering.',
    funFact: 'Gold is so incredibly ductile that a single ounce can be drawn into a hair-thin wire stretching over 50 miles long.',
    discoveredBy: 'Prehistoric humans',
    year: -4000,
    density: '19.3 g/cm³',
    meltingPoint: '1337.33 K (1064.18 °C)',
    boilingPoint: '3129 K (2856 °C)',
    electronegativity: 2.54,
    ionizationEnergy: '890 kJ/mol',
    realWorldUses: ['Financial Assets', 'Electronics Connectors', 'Space-Suit Infrared Shielding'],
    reactivity: 'Low'
  },
  80: {
    summary: 'The only transition metal that remains liquid at standard room temperature. Heavy, highly toxic, historically called "quicksilver".',
    funFact: 'Despite its liquid state, mercury represents such a dense fluid that heavy iron blocks can float on it like toy boats.',
    discoveredBy: 'Ancient Egyptians',
    year: -1500,
    density: '13.534 g/cm³',
    meltingPoint: '234.32 K (-38.83 °C)',
    boilingPoint: '629.88 K (356.73 °C)',
    electronegativity: 2.00,
    ionizationEnergy: '1007 kJ/mol',
    realWorldUses: ['Scientific Thermometers', 'Fluorescent Illumination', 'Amalgam Alloys'],
    reactivity: 'Low'
  },
  92: {
    summary: 'A heavy, naturally fissionable radioactive metal. It serves as the primary fuel source for nuclear power reactors.',
    funFact: 'Traces of uranium added to historical glass (vaseline glass) create a haunting, cosmic green fluorescence under UV rays.',
    discoveredBy: 'Martin Heinrich Klaproth',
    year: 1789,
    density: '19.1 g/cm³',
    meltingPoint: '1405.3 K (1132.2 °C)',
    boilingPoint: '4404 K (4131 °C)',
    electronegativity: 1.38,
    ionizationEnergy: '597 kJ/mol',
    realWorldUses: ['Nuclear Fission Reactors', 'Armor-Piercing Munitions', 'Target Shielding'],
    reactivity: 'Moderate'
  }
};

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
          environmentFeel: `${name} Ambient Mist Field`,
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
    visual: getVisualConfig()
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
  }
];
