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
}

export type TableLayoutMode = 'grid' | 'spiral' | 'sphere' | 'scatter';

export interface ReactionConfig {
  reactants: string[]; // Element symbols, e.g. ['H', 'O']
  productName: string;
  productFormula: string;
  description: string;
  visualType: 'covalent' | 'ionic' | 'explosion';
}
