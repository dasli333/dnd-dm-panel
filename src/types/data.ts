// Data structure interfaces matching the actual JSON files

export interface SpellData {
  name: string;
  level: number;
  school: string;
  isCantrip: boolean;
  classes: string[];
  castingTime: {
    time: string;
    isRitual: boolean;
  };
  range: string;
  components: {
    verbal: boolean;
    somatic: boolean;
    material: boolean;
    materialDescription?: string;
  };
  duration: {
    durationType: string;
    concentration: boolean;
  };
  description: string;
  attackType?: string;
  ritual: boolean;
  tags: string[];
  higherLevels?: string;
  damage?: {
    formula: string;
    damageType: string;
    average: number;
  }[];
}

export interface MonsterData {
  name: string;
  size: string;
  type: string;
  category: string;
  alignment: string;
  senses: string[];
  languages: string[];
  abilityScores: {
    strength: {
      score: number;
      modifier: number;
      save: number;
    };
    dexterity: {
      score: number;
      modifier: number;
      save: number;
    };
    constitution: {
      score: number;
      modifier: number;
      save: number;
    };
    intelligence: {
      score: number;
      modifier: number;
      save: number;
    };
    wisdom: {
      score: number;
      modifier: number;
      save: number;
    };
    charisma: {
      score: number;
      modifier: number;
      save: number;
    };
  };
  // Additional fields will be added as needed
}

// Filter interfaces
export interface SpellFilters {
  level?: number[];
  school?: string[];
  classes?: string[];
  concentration?: boolean;
  ritual?: boolean;
  search?: string;
}

export interface MonsterFilters {
  size?: string[];
  type?: string[];
  alignment?: string[];
  search?: string;
}
