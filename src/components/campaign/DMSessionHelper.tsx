import { useState } from "react";
import { Wand2, Dice6, Users, Eye, Clock, Lightbulb, RefreshCw, Volume2 } from "lucide-react";

interface RandomEncounter {
  type: string;
  description: string;
  difficulty: string;
}

interface NameGenerator {
  category: string;
  names: string[];
}

const mockEncounters: RandomEncounter[] = [
  {
    type: "Social",
    description: "A traveling merchant offers rare magical items at suspicious prices",
    difficulty: "Easy",
  },
  { type: "Combat", description: "2-3 bandits ambush the party on a forest path", difficulty: "Medium" },
  { type: "Environmental", description: "A sudden thunderstorm forces the party to seek shelter", difficulty: "Easy" },
  { type: "Mystery", description: "Strange symbols appear carved into trees along the road", difficulty: "Hard" },
  { type: "Social", description: "A wounded messenger asks for escort to the next town", difficulty: "Medium" },
];

const nameGenerators: NameGenerator[] = [
  { category: "Human Male", names: ["Aldric", "Gareth", "Marcus", "Theron", "Godwin", "Edmund", "Leoric", "Roderick"] },
  {
    category: "Human Female",
    names: ["Lyanna", "Elara", "Seraphina", "Mira", "Cordelia", "Evelynn", "Rosalind", "Gwendolyn"],
  },
  { category: "Elf", names: ["Aelar", "Aerdrie", "Ahvak", "Aramil", "Berrian", "Dayereth", "Enna", "Galinndan"] },
  { category: "Dwarf", names: ["Adrik", "Baern", "Darrak", "Eberk", "Fargrim", "Gardain", "Harbek", "Kildrak"] },
  { category: "Tavern", names: ["The Prancing Pony", "The Dragon's Rest", "The Gilded Griffin", "The Sleeping Giant"] },
];

export default function DMSessionHelper() {
  const [currentEncounter, setCurrentEncounter] = useState<RandomEncounter | null>(null);
  const [generatedName, setGeneratedName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState(nameGenerators[0].category);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [diceType, setDiceType] = useState<number>(20);
  const [initiativeList, setInitiativeList] = useState<{ name: string; initiative: number }[]>([]);
  const [newInitiativeName, setNewInitiativeName] = useState("");

  const generateEncounter = () => {
    const randomEncounter = mockEncounters[Math.floor(Math.random() * mockEncounters.length)];
    setCurrentEncounter(randomEncounter);
  };

  const generateName = () => {
    const category = nameGenerators.find((cat) => cat.category === selectedCategory);
    if (category) {
      const randomName = category.names[Math.floor(Math.random() * category.names.length)];
      setGeneratedName(randomName);
    }
  };

  const rollDice = () => {
    const result = Math.floor(Math.random() * diceType) + 1;
    setDiceResult(result);
  };

  const addToInitiative = () => {
    if (newInitiativeName.trim() && diceResult !== null) {
      setInitiativeList(
        [...initiativeList, { name: newInitiativeName.trim(), initiative: diceResult }].sort(
          (a, b) => b.initiative - a.initiative
        )
      );
      setNewInitiativeName("");
      setDiceResult(null);
    }
  };

  const clearInitiative = () => {
    setInitiativeList([]);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center">
          <Wand2 className="size-8 mr-3 text-purple-400" />
          DM Session Helper
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Random Encounter Generator */}
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Lightbulb className="size-5 mr-2 text-yellow-400" />
            Random Encounters
          </h2>
          <button
            onClick={generateEncounter}
            className="w-full mb-4 flex items-center justify-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <RefreshCw className="size-4 mr-2" />
            Generate Encounter
          </button>
          {currentEncounter && (
            <div className="bg-purple-800/30 border border-purple-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-200 bg-purple-700 px-2 py-1 rounded">
                  {currentEncounter.type}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    currentEncounter.difficulty === "Easy"
                      ? "bg-green-700 text-green-200"
                      : currentEncounter.difficulty === "Medium"
                        ? "bg-yellow-700 text-yellow-200"
                        : "bg-red-700 text-red-200"
                  }`}
                >
                  {currentEncounter.difficulty}
                </span>
              </div>
              <p className="text-purple-200">{currentEncounter.description}</p>
            </div>
          )}
        </div>

        {/* Name Generator */}
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Users className="size-5 mr-2 text-blue-400" />
            Name Generator
          </h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full mb-3 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
          >
            {nameGenerators.map((cat) => (
              <option key={cat.category} value={cat.category}>
                {cat.category}
              </option>
            ))}
          </select>
          <button
            onClick={generateName}
            className="w-full mb-4 flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="size-4 mr-2" />
            Generate Name
          </button>
          {generatedName && (
            <div className="bg-blue-800/30 border border-blue-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-200">{generatedName}</div>
            </div>
          )}
        </div>

        {/* Dice Roller */}
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Dice6 className="size-5 mr-2 text-green-400" />
            Dice Roller
          </h2>
          <div className="flex gap-2 mb-3">
            {[4, 6, 8, 10, 12, 20, 100].map((sides) => (
              <button
                key={sides}
                onClick={() => setDiceType(sides)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  diceType === sides ? "bg-green-500 text-white" : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                }`}
              >
                d{sides}
              </button>
            ))}
          </div>
          <button
            onClick={rollDice}
            className="w-full mb-4 flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Dice6 className="size-4 mr-2" />
            Roll d{diceType}
          </button>
          {diceResult !== null && (
            <div className="bg-green-800/30 border border-green-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-200">{diceResult}</div>
              <div className="text-sm text-green-300">d{diceType}</div>
            </div>
          )}
        </div>

        {/* Initiative Tracker */}
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6 lg:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Clock className="size-5 mr-2 text-red-400" />
              Initiative Tracker
            </h2>
            <button
              onClick={clearInitiative}
              className="px-3 py-1 text-sm bg-red-800/50 text-red-300 rounded hover:bg-red-800/70 transition-colors border border-red-700"
            >
              Clear All
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Character/Monster name"
              value={newInitiativeName}
              onChange={(e) => setNewInitiativeName(e.target.value)}
              className="flex-1 px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 text-white placeholder-gray-400"
            />
            <button
              onClick={addToInitiative}
              disabled={!newInitiativeName.trim() || diceResult === null}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Add ({diceResult || "?"})
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {initiativeList.length === 0 ? (
              <div className="text-center text-gray-400 py-4">
                <p className="text-sm">Roll initiative and add characters</p>
              </div>
            ) : (
              initiativeList.map((entry, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    index === 0 ? "bg-red-800/30 border border-red-700" : "bg-gray-700"
                  }`}
                >
                  <span className="font-medium text-white">{entry.name}</span>
                  <span className={`font-bold ${index === 0 ? "text-red-300" : "text-gray-300"}`}>
                    {entry.initiative}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick References */}
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Eye className="size-5 mr-2 text-indigo-400" />
            Quick References
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <div className="font-medium text-white mb-1">Difficulty Classes</div>
              <div className="text-gray-300 space-y-1">
                <div>Very Easy: DC 5</div>
                <div>Easy: DC 10</div>
                <div>Medium: DC 15</div>
                <div>Hard: DC 20</div>
                <div>Very Hard: DC 25</div>
              </div>
            </div>
            <div>
              <div className="font-medium text-white mb-1">Combat Actions</div>
              <div className="text-gray-300 space-y-1">
                <div>Attack: Action</div>
                <div>Dash: Action</div>
                <div>Dodge: Action</div>
                <div>Help: Action</div>
                <div>Hide: Action</div>
                <div>Ready: Action</div>
                <div>Search: Action</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sound Effects */}
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Volume2 className="size-5 mr-2 text-orange-400" />
            Atmosphere
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {["Tavern Ambience", "Forest Sounds", "Dungeon Echo", "Combat Music", "Mystical", "Thunder"].map(
              (sound) => (
                <button
                  key={sound}
                  className="px-3 py-2 text-sm bg-orange-800/30 text-orange-300 rounded-lg hover:bg-orange-800/50 transition-colors border border-orange-700"
                >
                  {sound}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
