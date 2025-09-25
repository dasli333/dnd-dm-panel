// Types specific to the mockup data structure
export interface MockUser {
  id: number;
  username: string;
  email: string;
  name: string;
}

export interface MockCampaign {
  id: number;
  name: string;
  description: string;
  players: number;
  level: string;
  sessions: number;
  lastPlayed: string;
  thumbnail: string;
}

export interface MockItem {
  id: number;
  name: string;
  type: string;
  rarity: string;
  price: string;
  description: string;
}

export interface MockSpell {
  id: number;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  classes: string[];
  description: string;
}

export interface MockMonster {
  id: number;
  name: string;
  cr: number;
  type: string;
  size: string;
  hp: number;
  ac: number;
  description: string;
}

export interface MockCharacter {
  id: number;
  name: string;
  class: string;
  level: number;
  race: string;
  hp: number;
  maxHp: number;
  ac: number;
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface MockSession {
  id: number;
  date: string;
  title: string;
  participants: string[];
  summary: string;
}

export interface MockNPC {
  id: number;
  name: string;
  role: string;
  location: string;
  notes: string;
}

export interface MockLocation {
  id: number;
  name: string;
  type: string;
  description: string;
}

export interface MockQuest {
  id: number;
  name: string;
  status: string;
  description: string;
}

export interface MockNotes {
  npcs: MockNPC[];
  locations: MockLocation[];
  quests: MockQuest[];
}

// Authentication types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: MockUser;
  error?: string;
}
