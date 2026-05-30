/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChemicalElement, ReactionConfig } from './types';
import elementsJson from './database/elements.json';

// Seeded scientific database for all 118 elements exported as a unified type array
export const ELEMENTS_DATA = elementsJson as ChemicalElement[];

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
