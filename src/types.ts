/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'reactive-nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide';

export interface VisualConfig {
  primaryColor: string;
  secondaryGlowColor: string;
  atmosphereType: 'gas' | 'crystal' | 'plasma' | 'liquid' | 'decay' | 'metal';
  particleStyle: 'nebula' | 'stellar' | 'lightning' | 'droplet' | 'decay-ray' | 'ring';
  energyBehavior: 'fusion' | 'lattice' | 'discharge' | 'fluid' | 'radioactive' | 'metallic';
  lightingStyle: string;
  environmentFeel: string;
  motionStyle: 'floating' | 'structured' | 'electric' | 'oscillating' | 'decay' | 'interlocking';
}

export interface ChemicalElement {
  number: number;
  symbol: string;
  name: string;
  mass: number;
  category: ElementCategory;
  period: number;
  group: number;
  state: 'gas' | 'liquid' | 'solid' | 'synthetic';
  electronConfig: string;
  shells: number[]; // e.g. [2, 8, 1] for Sodium
  summary: string;
  funFact: string;
  discoveredBy: string;
  year: number;
  density: string;
  boilingPoint: string; // Kelvin or String
  meltingPoint: string; // Kelvin or String
  
  // New properties for Orbiter Core Element Data System
  electronegativity: number | null;
  ionizationEnergy: string;
  realWorldUses: string[];
  reactivity: string;
  visual: VisualConfig;

  // Massively Expanded Scientific Properties
  protons: number;
  neutrons: number;
  electrons: number;
  oxidationStates: number[];
  conductivity: string;
  nameOrigin: string;
  cosmicRelevance: string;
  biologicalRelevance: string;
  nuclearProperties: string;
  orbitalBreakdown: string;
  applications: {
    industrial: string;
    technology: string;
    medical: string;
    spaceAndEnergy: string;
  };
}

export type TableLayoutMode = 'grid' | 'spiral' | 'sphere' | 'scatter';

export interface ReactionConfig {
  reactants: string[]; // Element symbols, e.g. ['H', 'O']
  productName: string;
  productFormula: string;
  description: string;
  visualType: 'covalent' | 'ionic' | 'explosion';
}
