// Core D&D 5e data types based on existing data structure

export interface Spell {
  name: string;
  level: number;
  school: string;
  isCantrip: boolean;
  classes: string[];
  castingTime: {
    time: number;
    unit: string;
    ritual?: boolean;
  };
  range: {
    value: number | string;
    unit: string;
  };
  components: {
    verbal: boolean;
    somatic: boolean;
    material: boolean;
    materialDescription?: string;
  };
  duration: {
    type: string;
    value?: number;
    unit?: string;
    concentration?: boolean;
  };
  description: string;
  higherLevelDescription?: string;
}

export interface Monster {
  name: string;
  size: string;
  type: string;
  category: string;
  alignment: string;
  armorClass: number;
  hitPoints: number;
  hitDice: string;
  speed: Record<string, number>;
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  savingThrows?: Record<string, number>;
  skills?: Record<string, number>;
  damageResistances?: string[];
  damageImmunities?: string[];
  conditionImmunities?: string[];
  senses: string[];
  languages: string[];
  challengeRating: number;
  experiencePoints: number;
  proficiencyBonus: number;
  traits?: Trait[];
  actions: Action[];
  bonusActions?: Action[];
  reactions?: Action[];
  legendaryActions?: LegendaryAction;
}

export interface Trait {
  name: string;
  description: string;
}

export interface Action {
  name: string;
  description: string;
  attackRoll?: number;
  reach?: number;
  damage?: string;
  damageType?: string;
  savingThrow?: {
    ability: string;
    dc: number;
  };
  recharge?: string;
}

export interface LegendaryAction {
  uses: number;
  actions: Action[];
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  subtype?: string;
  rarity: Rarity;
  price: {
    value: number;
    currency: Currency;
  };
  weight?: number;
  description: string;
  properties?: string[];
  damage?: {
    dice: string;
    type: string;
  };
  armorClass?: number;
  requiresAttunement?: boolean;
  category: ItemCategory;
}

export interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  background: string;
  race: string;
  alignment: string;
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  hitPoints: {
    current: number;
    maximum: number;
    temporary: number;
  };
  armorClass: number;
  proficiencyBonus: number;
  skills: Record<string, boolean>;
  equipment: string[];
  spells?: string[];
  features: string[];
  backstory?: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  created: Date;
  lastPlayed?: Date;
  characters: Character[];
  sessions: Session[];
  notes: Note[];
  settings: CampaignSettings;
}

export interface Session {
  id: string;
  date: Date;
  title: string;
  summary: string;
  participants: string[];
  duration?: number;
  notes?: string;
  combatEncounters?: CombatEncounter[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  tags: string[];
  created: Date;
  updated: Date;
  linkedNotes?: string[];
}

export interface CombatEncounter {
  id: string;
  name: string;
  participants: CombatParticipant[];
  currentRound: number;
  currentTurn: number;
  isActive: boolean;
  log: CombatLogEntry[];
}

export interface CombatParticipant {
  id: string;
  name: string;
  type: "player" | "monster" | "npc";
  initiative: number;
  hitPoints: {
    current: number;
    maximum: number;
  };
  armorClass: number;
  statusEffects: StatusEffect[];
  position?: number;
}

export interface StatusEffect {
  name: string;
  description: string;
  duration?: number;
  concentration?: boolean;
}

export interface CombatLogEntry {
  id: string;
  round: number;
  timestamp: Date;
  actor: string;
  action: string;
  target?: string;
  damage?: number;
  healing?: number;
  description: string;
}

export interface CampaignSettings {
  useVariantRules: boolean;
  allowMulticlassing: boolean;
  startingLevel: number;
  maxLevel: number;
  restingRules: "standard" | "variant" | "gritty";
}

// Enums and Union Types
export type ItemType =
  | "weapon"
  | "armor"
  | "shield"
  | "consumable"
  | "tool"
  | "treasure"
  | "magic-item"
  | "adventuring-gear";

export type Rarity = "common" | "uncommon" | "rare" | "very-rare" | "legendary" | "artifact";

export type Currency = "cp" | "sp" | "ep" | "gp" | "pp";

export type ItemCategory =
  | "weapons"
  | "armor"
  | "adventuring-gear"
  | "tools"
  | "mounts"
  | "trade-goods"
  | "magic-items";

export type NoteCategory = "npc" | "location" | "quest" | "lore" | "general";

export type SpellSchool =
  | "Abjuration"
  | "Conjuration"
  | "Divination"
  | "Enchantment"
  | "Evocation"
  | "Illusion"
  | "Necromancy"
  | "Transmutation";

export type CharacterClass =
  | "Artificer"
  | "Barbarian"
  | "Bard"
  | "Cleric"
  | "Druid"
  | "Fighter"
  | "Monk"
  | "Paladin"
  | "Ranger"
  | "Rogue"
  | "Sorcerer"
  | "Warlock"
  | "Wizard";

// Application State Types
export interface User {
  id: string;
  username: string;
  email?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  defaultDiceRoller: boolean;
  autoSaveInterval: number;
  compactMode: boolean;
}

export interface AppState {
  user: User | null;
  currentCampaign: Campaign | null;
  campaigns: Campaign[];
  isLoading: boolean;
  error: string | null;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Filter and Search Types
export interface SpellFilters {
  level?: number[];
  school?: SpellSchool[];
  classes?: CharacterClass[];
  castingTime?: string[];
  concentration?: boolean;
  ritual?: boolean;
  search?: string;
}

export interface MonsterFilters {
  challengeRating?: number[];
  type?: string[];
  size?: string[];
  environment?: string[];
  search?: string;
}

export interface ItemFilters {
  type?: ItemType[];
  rarity?: Rarity[];
  category?: ItemCategory[];
  priceRange?: {
    min: number;
    max: number;
  };
  requiresAttunement?: boolean;
  search?: string;
}
