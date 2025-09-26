import { useState } from "react";
import { Swords, Plus, Play, Pause, RotateCcw, Heart, Shield, Clock, Edit3, Trash2, Save, X } from "lucide-react";

interface CombatParticipant {
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
  notes?: string;
}

interface StatusEffect {
  name: string;
  description: string;
  duration?: number;
  concentration?: boolean;
}

interface CombatEncounter {
  id: string;
  name: string;
  participants: CombatParticipant[];
  currentRound: number;
  currentTurn: number;
  isActive: boolean;
  log: string[];
}

const mockStatusEffects = [
  { name: "Blessed", description: "+1d4 to attack rolls and saving throws" },
  { name: "Poisoned", description: "Disadvantage on attack rolls and ability checks" },
  { name: "Stunned", description: "Incapacitated, can't move, can speak falteringly" },
  { name: "Prone", description: "Disadvantage on attack rolls" },
  { name: "Grappled", description: "Speed becomes 0" },
  { name: "Restrained", description: "Speed becomes 0, disadvantage on attack rolls" },
];

export default function CombatTracker() {
  const [encounter, setEncounter] = useState<CombatEncounter>({
    id: "1",
    name: "Cave Ambush",
    participants: [
      {
        id: "1",
        name: "Thalion",
        type: "player",
        initiative: 18,
        hitPoints: { current: 42, maximum: 45 },
        armorClass: 16,
        statusEffects: [],
      },
      {
        id: "2",
        name: "Grenda",
        type: "player",
        initiative: 14,
        hitPoints: { current: 38, maximum: 42 },
        armorClass: 18,
        statusEffects: [{ name: "Blessed", description: "+1d4 to attack rolls and saving throws", duration: 8 }],
      },
      {
        id: "3",
        name: "Mystral",
        type: "player",
        initiative: 12,
        hitPoints: { current: 28, maximum: 38 },
        armorClass: 12,
        statusEffects: [],
      },
      {
        id: "4",
        name: "Orc Warrior",
        type: "monster",
        initiative: 10,
        hitPoints: { current: 15, maximum: 30 },
        armorClass: 13,
        statusEffects: [
          { name: "Poisoned", description: "Disadvantage on attack rolls and ability checks", duration: 3 },
        ],
      },
      {
        id: "5",
        name: "Orc Archer",
        type: "monster",
        initiative: 8,
        hitPoints: { current: 22, maximum: 22 },
        armorClass: 12,
        statusEffects: [],
      },
    ],
    currentRound: 2,
    currentTurn: 0,
    isActive: true,
    log: [
      "Round 1: Thalion attacks Orc Warrior - Hit for 12 damage",
      "Round 1: Grenda casts Bless on party",
      "Round 1: Mystral casts Poison Spray on Orc Warrior - Failed save",
      "Round 1: Orc Warrior attacks Grenda - Miss",
      "Round 1: Orc Archer shoots at Mystral - Hit for 8 damage",
    ],
  });

  const [editingParticipant, setEditingParticipant] = useState<CombatParticipant | null>(null);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [newParticipant, setNewParticipant] = useState<Partial<CombatParticipant>>({
    name: "",
    type: "monster",
    initiative: 10,
    hitPoints: { current: 20, maximum: 20 },
    armorClass: 12,
    statusEffects: [],
  });

  const sortedParticipants = [...encounter.participants].sort((a, b) => b.initiative - a.initiative);
  const currentParticipant = sortedParticipants[encounter.currentTurn];

  const nextTurn = () => {
    const nextTurnIndex = (encounter.currentTurn + 1) % sortedParticipants.length;
    const newRound = nextTurnIndex === 0 ? encounter.currentRound + 1 : encounter.currentRound;

    setEncounter({
      ...encounter,
      currentTurn: nextTurnIndex,
      currentRound: newRound,
    });
  };

  const toggleCombat = () => {
    setEncounter({ ...encounter, isActive: !encounter.isActive });
  };

  const resetCombat = () => {
    setEncounter({
      ...encounter,
      currentRound: 1,
      currentTurn: 0,
      isActive: false,
      log: [],
    });
  };

  const updateParticipantHP = (participantId: string, newCurrent: number) => {
    setEncounter({
      ...encounter,
      participants: encounter.participants.map((p) =>
        p.id === participantId
          ? { ...p, hitPoints: { ...p.hitPoints, current: Math.max(0, Math.min(newCurrent, p.hitPoints.maximum)) } }
          : p
      ),
    });
  };

  const addStatusEffect = (participantId: string, effect: StatusEffect) => {
    setEncounter({
      ...encounter,
      participants: encounter.participants.map((p) =>
        p.id === participantId ? { ...p, statusEffects: [...p.statusEffects, effect] } : p
      ),
    });
  };

  const removeStatusEffect = (participantId: string, effectIndex: number) => {
    setEncounter({
      ...encounter,
      participants: encounter.participants.map((p) =>
        p.id === participantId ? { ...p, statusEffects: p.statusEffects.filter((_, i) => i !== effectIndex) } : p
      ),
    });
  };

  const addParticipant = () => {
    if (newParticipant.name?.trim()) {
      const participant: CombatParticipant = {
        id: Date.now().toString(),
        name: newParticipant.name,
        type: newParticipant.type || "monster",
        initiative: newParticipant.initiative || 10,
        hitPoints: newParticipant.hitPoints || { current: 20, maximum: 20 },
        armorClass: newParticipant.armorClass || 12,
        statusEffects: [],
      };

      setEncounter({
        ...encounter,
        participants: [...encounter.participants, participant],
      });

      setNewParticipant({
        name: "",
        type: "monster",
        initiative: 10,
        hitPoints: { current: 20, maximum: 20 },
        armorClass: 12,
        statusEffects: [],
      });
      setShowAddParticipant(false);
    }
  };

  const removeParticipant = (participantId: string) => {
    setEncounter({
      ...encounter,
      participants: encounter.participants.filter((p) => p.id !== participantId),
    });
  };

  const getHealthPercentage = (current: number, maximum: number) => {
    return (current / maximum) * 100;
  };

  const getHealthColor = (percentage: number) => {
    if (percentage > 75) return "bg-green-500";
    if (percentage > 50) return "bg-yellow-500";
    if (percentage > 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "player":
        return "bg-blue-700 text-blue-200 border border-blue-600";
      case "monster":
        return "bg-red-700 text-red-200 border border-red-600";
      case "npc":
        return "bg-green-700 text-green-200 border border-green-600";
      default:
        return "bg-gray-700 text-gray-200 border border-gray-600";
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Swords className="size-8 mr-3 text-red-400" />
            Combat Tracker
          </h1>
          <div className="flex items-center gap-2">
            <span className="bg-red-700 text-red-200 px-3 py-1 rounded-full text-sm font-medium">
              Round {encounter.currentRound}
            </span>
            {encounter.isActive && (
              <span className="bg-green-700 text-green-200 px-3 py-1 rounded-full text-sm font-medium">Active</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddParticipant(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors shadow-xl"
          >
            <Plus className="size-4 mr-2" />
            Add Participant
          </button>
          <button
            onClick={toggleCombat}
            className={`flex items-center px-4 py-2 text-white rounded-lg transition-colors shadow-xl ${
              encounter.isActive ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {encounter.isActive ? <Pause className="size-4 mr-2" /> : <Play className="size-4 mr-2" />}
            {encounter.isActive ? "Pause" : "Start"}
          </button>
          <button
            onClick={resetCombat}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-xl"
          >
            <RotateCcw className="size-4 mr-2" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Initiative Tracker */}
        <div className="xl:col-span-3">
          <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
            <div className="p-4 bg-gray-700 border-b border-gray-600">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Clock className="size-5 mr-2 text-gray-300" />
                Initiative Order
                {currentParticipant && (
                  <span className="ml-4 text-lg text-red-400">Current: {currentParticipant.name}</span>
                )}
              </h2>
            </div>

            <div className="divide-y divide-gray-700">
              {sortedParticipants.map((participant, index) => {
                const isCurrentTurn = index === encounter.currentTurn && encounter.isActive;
                const healthPercentage = getHealthPercentage(
                  participant.hitPoints.current,
                  participant.hitPoints.maximum
                );

                return (
                  <div
                    key={participant.id}
                    className={`p-4 transition-colors ${
                      isCurrentTurn ? "bg-red-700/20 border-l-4 border-red-400" : "hover:bg-gray-700/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl font-bold text-white w-8 text-center">
                            {participant.initiative}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-semibold text-white">{participant.name}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(participant.type)}`}>
                                {participant.type}
                              </span>
                              {isCurrentTurn && (
                                <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                                  CURRENT TURN
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center space-x-2">
                                <Heart className="size-4 text-red-400" />
                                <span className="text-sm text-gray-300">
                                  {participant.hitPoints.current}/{participant.hitPoints.maximum}
                                </span>
                                <div className="w-20 h-2 bg-gray-700 rounded-full">
                                  <div
                                    className={`h-full rounded-full ${getHealthColor(healthPercentage)}`}
                                    style={{ width: `${healthPercentage}%` }}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Shield className="size-4 text-blue-400" />
                                <span className="text-sm text-gray-300">{participant.armorClass}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status Effects */}
                        {participant.statusEffects.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {participant.statusEffects.map((effect, effectIndex) => (
                              <button
                                key={effectIndex}
                                onClick={() => removeStatusEffect(participant.id, effectIndex)}
                                className="bg-purple-700 text-purple-200 px-2 py-1 rounded text-xs hover:bg-purple-600 transition-colors border border-purple-600"
                                title={effect.description}
                              >
                                {effect.name}
                                {effect.duration && ` (${effect.duration})`}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* HP Adjustment */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => updateParticipantHP(participant.id, participant.hitPoints.current - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-red-700 text-red-200 rounded hover:bg-red-600 text-lg font-bold border border-red-600"
                          >
                            -
                          </button>
                          <button
                            onClick={() => updateParticipantHP(participant.id, participant.hitPoints.current + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-green-700 text-green-200 rounded hover:bg-green-600 text-lg font-bold border border-green-600"
                          >
                            +
                          </button>
                        </div>

                        {/* Actions */}
                        <button
                          onClick={() => setEditingParticipant(participant)}
                          className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg"
                        >
                          <Edit3 className="size-4" />
                        </button>
                        <button
                          onClick={() => removeParticipant(participant.id)}
                          className="p-2 text-red-400 hover:text-red-200 hover:bg-red-700 rounded-lg"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {encounter.isActive && (
              <div className="p-4 bg-gray-700 border-t border-gray-600">
                <button
                  onClick={nextTurn}
                  className="w-full flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-xl"
                >
                  <Clock className="size-5 mr-2" />
                  Next Turn
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Combat Log */}
          <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-4">
            <h3 className="font-semibold text-white mb-3">Combat Log</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto text-sm">
              {encounter.log.length === 0 ? (
                <p className="text-gray-400 italic">No actions logged yet</p>
              ) : (
                encounter.log.map((entry, index) => (
                  <div key={index} className="text-gray-300">
                    {entry}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Status Effects Quick Add */}
          <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-4">
            <h3 className="font-semibold text-white mb-3">Quick Status Effects</h3>
            <div className="space-y-2">
              {mockStatusEffects.map((effect) => (
                <button
                  key={effect.name}
                  className="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors text-gray-300 border border-gray-600"
                  title={effect.description}
                >
                  {effect.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Participant Modal */}
      {showAddParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-white">Add Participant</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={newParticipant.name || ""}
                  onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                  <select
                    value={newParticipant.type}
                    onChange={(e) => setNewParticipant({ ...newParticipant, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    <option value="player">Player</option>
                    <option value="monster">Monster</option>
                    <option value="npc">NPC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Initiative</label>
                  <input
                    type="number"
                    value={newParticipant.initiative || 10}
                    onChange={(e) =>
                      setNewParticipant({ ...newParticipant, initiative: parseInt(e.target.value) || 10 })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max HP</label>
                  <input
                    type="number"
                    value={newParticipant.hitPoints?.maximum || 20}
                    onChange={(e) => {
                      const maxHP = parseInt(e.target.value) || 20;
                      setNewParticipant({
                        ...newParticipant,
                        hitPoints: { current: maxHP, maximum: maxHP },
                      });
                    }}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">AC</label>
                  <input
                    type="number"
                    value={newParticipant.armorClass || 12}
                    onChange={(e) =>
                      setNewParticipant({ ...newParticipant, armorClass: parseInt(e.target.value) || 12 })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddParticipant(false)}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={addParticipant}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 shadow-xl"
              >
                Add Participant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
