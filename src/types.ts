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

  // --- THE 10 UNIFIED ORBITIUM KNOWLEDGE ENGINE MODULES ---
  coreIdentity: {
    number: number;
    symbol: string;
    name: string;
    mass: number;
    category: ElementCategory;
    period: number;
    group: number;
    block: 's' | 'p' | 'd' | 'f';
    stateAtSTP: 'gas' | 'liquid' | 'solid' | 'synthetic';
    summary: string;
  };
  atomicArchitecture: {
    electronConfig: string;
    shells: number[];
    valenceElectrons: number;
    protons: number;
    neutrons: number;
    electrons: number;
    orbitalBreakdown: string;
    atomicRadiusPm: number;
    nuclearProperties: string;
  };
  physicalProperties: {
    density: string;
    meltingPointK: string;
    boilingPointK: string;
    crystalStructure: string;
    thermalConductivity: string;
    electricalConductivity: string;
    magneticProperties: string;
    hardness: string;
  };
  chemicalProperties: {
    electronegativity: number | null;
    electronAffinity: string;
    ionizationEnergy: string;
    oxidationStates: number[];
    reactivityProfile: string;
    bondingCharacteristics: string;
  };
  cosmicProperties: {
    stellarOrigin: string;
    nucleosynthesisProcess: string;
    cosmicAbundance: string;
    earthAbundance: string;
    planetaryPresence: string;
    stellarPresence: string;
  };
  biologicalProperties: {
    biologicalImportance: string;
    humanBodyPresence: string;
    toxicity: string;
    nutritionalRelevance: string;
    biologicalFunction: string;
  };
  historicalProperties: {
    discoveryYear: number;
    discoverer: string;
    namingOrigin: string;
    historicalSignificance: string;
    majorScientificMilestones: string[];
  };
  industrialApplications: {
    electronics: string;
    aerospace: string;
    medicine: string;
    construction: string;
    nuclearEnergy: string;
    batteries: string;
    semiconductors: string;
    spaceTechnology: string;
  };
  reactionIntelligence: {
    commonReactions: string[];
    commonCompounds: string[];
    compatibleElements: string[];
    dangerousReactions: string[];
    reactionCategories: string[];
    synthesisPossibilities: string[];
  };
  orbitiumPersonality: {
    archetype: string;
    scientificPersonality: string;
    energySignature: string;
    environmentalTheme: string;
    motionStyle: string;
    atmosphereType: string;
    interactionStyle: string;
    visualConfig: VisualConfig;
    particleBehavior: string;
  };
  relationshipNetwork: {
    similarElements: string[];
    groupRelationships: string;
    commonReactionPartners: string[];
    commonCompounds: string[];
    industrialConnections: string[];
    biologicalConnections: string[];
    cosmicConnections: string[];
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
