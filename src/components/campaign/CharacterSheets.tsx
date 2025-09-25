import { useState } from "react";
import { Users, Plus, Heart, Shield, Zap, Eye, Edit3, Save, X, Dice6 } from "lucide-react";

interface Character {
  id: string;
  name: string;
  playerName: string;
  class: string;
  level: number;
  race: string;
  background: string;
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
  spells: string[];
  notes: string;
}

const mockCharacters: Character[] = [
  {
    id: "1",
    name: "Thalion Silverleaf",
    playerName: "Alex",
    class: "Ranger",
    level: 5,
    race: "Elf",
    background: "Outlander",
    alignment: "Chaotic Good",
    stats: {
      strength: 14,
      dexterity: 18,
      constitution: 12,
      intelligence: 13,
      wisdom: 16,
      charisma: 10,
    },
    hitPoints: {
      current: 42,
      maximum: 45,
      temporary: 0,
    },
    armorClass: 16,
    proficiencyBonus: 3,
    skills: {
      "Animal Handling": true,
      Athletics: false,
      Insight: true,
      Investigation: false,
      Nature: true,
      Perception: true,
      Stealth: true,
      Survival: true,
    },
    equipment: ["Longbow", "Studded Leather Armor", "Shortsword", "Explorer's Pack"],
    spells: ["Hunter's Mark", "Cure Wounds", "Speak with Animals"],
    notes: "Has a wolf companion named Shadow. Tracking an orc warband.",
  },
  {
    id: "2",
    name: "Grenda Ironforge",
    playerName: "Sam",
    class: "Fighter",
    level: 4,
    race: "Dwarf",
    background: "Soldier",
    alignment: "Lawful Good",
    stats: {
      strength: 16,
      dexterity: 12,
      constitution: 16,
      intelligence: 10,
      wisdom: 13,
      charisma: 8,
    },
    hitPoints: {
      current: 38,
      maximum: 42,
      temporary: 5,
    },
    armorClass: 18,
    proficiencyBonus: 2,
    skills: {
      Athletics: true,
      History: true,
      Intimidation: true,
      Perception: true,
    },
    equipment: ["Warhammer", "Chain Mail", "Shield", "Dungeoneer's Pack"],
    spells: [],
    notes: "Seeking revenge against the dragon that destroyed her clan's mine.",
  },
  {
    id: "3",
    name: "Mystral Moonwhisper",
    playerName: "Jordan",
    class: "Wizard",
    level: 6,
    race: "Human",
    background: "Sage",
    alignment: "Neutral",
    stats: {
      strength: 8,
      dexterity: 14,
      constitution: 14,
      intelligence: 18,
      wisdom: 12,
      charisma: 11,
    },
    hitPoints: {
      current: 32,
      maximum: 38,
      temporary: 0,
    },
    armorClass: 12,
    proficiencyBonus: 3,
    skills: {
      Arcana: true,
      History: true,
      Investigation: true,
      Medicine: true,
      Religion: true,
    },
    equipment: ["Quarterstaff", "Dagger", "Spellbook", "Scholar's Pack"],
    spells: ["Fireball", "Magic Missile", "Shield", "Detect Magic", "Identify", "Counterspell"],
    notes: "Researching ancient magical artifacts. Has a familiar (owl) named Archimedes.",
  },
];

export default function CharacterSheets() {
  const [characters, setCharacters] = useState<Character[]>(mockCharacters);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(characters[0] || null);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const getModifier = (score: number) => {
    return Math.floor((score - 10) / 2);
  };

  const getModifierText = (score: number) => {
    const modifier = getModifier(score);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const handleEditCharacter = (character: Character) => {
    setEditingCharacter({ ...character });
  };

  const handleSaveCharacter = () => {
    if (editingCharacter) {
      setCharacters((chars) => chars.map((c) => (c.id === editingCharacter.id ? editingCharacter : c)));
      setSelectedCharacter(editingCharacter);
      setEditingCharacter(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCharacter(null);
  };

  const handleHPChange = (type: "current" | "maximum" | "temporary", value: number) => {
    if (editingCharacter) {
      setEditingCharacter({
        ...editingCharacter,
        hitPoints: {
          ...editingCharacter.hitPoints,
          [type]: Math.max(0, value),
        },
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="size-8 mr-3 text-blue-600" />
            Character Sheets
          </h1>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {characters.length} characters
          </span>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="size-4 mr-2" />
          Add Character
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Characters List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="p-4 bg-blue-50 border-b">
              <h3 className="font-semibold text-gray-900">Party Members</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {characters.map((character) => (
                <div
                  key={character.id}
                  onClick={() => setSelectedCharacter(character)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-blue-50 ${
                    selectedCharacter?.id === character.id ? "bg-blue-100" : ""
                  }`}
                >
                  <h4 className="font-semibold text-gray-900">{character.name}</h4>
                  <div className="text-sm text-gray-600 mb-1">Played by {character.playerName}</div>
                  <div className="text-sm text-gray-500">
                    Level {character.level} {character.race} {character.class}
                  </div>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Heart className="size-3 mr-1 text-red-500" />
                    {character.hitPoints.current}/{character.hitPoints.maximum}
                    <Shield className="size-3 ml-3 mr-1 text-blue-500" />
                    {character.armorClass}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Character Sheet */}
        <div className="lg:col-span-3">
          {selectedCharacter ? (
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCharacter.name}</h2>
                    <div className="text-blue-100">
                      Level {selectedCharacter.level} {selectedCharacter.race} {selectedCharacter.class}
                    </div>
                    <div className="text-blue-200 text-sm">
                      {selectedCharacter.background} • {selectedCharacter.alignment}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditCharacter(selectedCharacter)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <Edit3 className="size-4" />
                    </button>
                    <div className="text-right">
                      <div className="text-sm text-blue-100">Player</div>
                      <div className="font-medium">{selectedCharacter.playerName}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {editingCharacter && editingCharacter.id === selectedCharacter.id ? (
                  // Edit Mode
                  <div className="space-y-6">
                    <div className="flex justify-end gap-2 mb-4">
                      <button
                        onClick={handleSaveCharacter}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Save className="size-4 mr-2" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <X className="size-4 mr-2" />
                        Cancel
                      </button>
                    </div>

                    {/* HP Editor */}
                    <div className="bg-red-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Heart className="size-5 mr-2 text-red-500" />
                        Hit Points
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Current</label>
                          <input
                            type="number"
                            value={editingCharacter.hitPoints.current}
                            onChange={(e) => handleHPChange("current", parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Maximum</label>
                          <input
                            type="number"
                            value={editingCharacter.hitPoints.maximum}
                            onChange={(e) => handleHPChange("maximum", parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Temporary</label>
                          <input
                            type="number"
                            value={editingCharacter.hitPoints.temporary}
                            onChange={(e) => handleHPChange("temporary", parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notes Editor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                      <textarea
                        value={editingCharacter.notes}
                        onChange={(e) => setEditingCharacter({ ...editingCharacter, notes: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="space-y-6">
                    {/* Core Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Hit Points */}
                      <div className="bg-red-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Heart className="size-5 mr-2 text-red-500" />
                          Hit Points
                        </h3>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-600">{selectedCharacter.hitPoints.current}</div>
                          <div className="text-gray-600">/ {selectedCharacter.hitPoints.maximum}</div>
                          {selectedCharacter.hitPoints.temporary > 0 && (
                            <div className="text-sm text-blue-600 mt-1">
                              +{selectedCharacter.hitPoints.temporary} temp
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Armor Class */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Shield className="size-5 mr-2 text-blue-500" />
                          Armor Class
                        </h3>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">{selectedCharacter.armorClass}</div>
                        </div>
                      </div>

                      {/* Proficiency Bonus */}
                      <div className="bg-green-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Zap className="size-5 mr-2 text-green-500" />
                          Proficiency
                        </h3>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600">+{selectedCharacter.proficiencyBonus}</div>
                        </div>
                      </div>
                    </div>

                    {/* Ability Scores */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Dice6 className="size-5 mr-2" />
                        Ability Scores
                      </h3>
                      <div className="grid grid-cols-6 gap-4">
                        {Object.entries(selectedCharacter.stats).map(([ability, score]) => (
                          <div key={ability} className="text-center bg-gray-50 rounded-lg p-3">
                            <div className="text-xs font-medium text-gray-600 uppercase mb-1">
                              {ability.slice(0, 3)}
                            </div>
                            <div className="text-xl font-bold text-gray-900">{score}</div>
                            <div className="text-sm text-gray-600">{getModifierText(score)}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Proficient Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(selectedCharacter.skills)
                          .filter(([, proficient]) => proficient)
                          .map(([skill]) => (
                            <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Equipment */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Equipment</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {selectedCharacter.equipment.map((item, index) => (
                          <div key={index} className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Spells */}
                    {selectedCharacter.spells.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Known Spells</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {selectedCharacter.spells.map((spell, index) => (
                            <div key={index} className="bg-purple-100 text-purple-800 px-3 py-2 rounded text-sm">
                              {spell}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {selectedCharacter.notes && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-gray-700">{selectedCharacter.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
              <Users className="size-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Character Selected</h3>
              <p className="text-gray-600">Select a character from the list to view their sheet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
