import { useState, useEffect, useMemo } from "react";
import { Search, Skull, Zap, Eye, MessageSquare, Languages } from "lucide-react";
import type { MonsterData, MonsterFilters } from "@/types/data";
import { FilterDropdown } from "@/components/ui/filter-dropdown";

export default function MonstersDatabase() {
  const [monsters, setMonsters] = useState<MonsterData[]>([]);
  const [selectedMonster, setSelectedMonster] = useState<MonsterData | null>(null);
  const [filters, setFilters] = useState<MonsterFilters>({
    search: "",
    size: [],
    type: [],
    alignment: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<"en" | "pl">("en");

  useEffect(() => {
    const loadMonsters = async () => {
      try {
        const response = await fetch("/data/monsters-legendary.json");
        const monsterData = await response.json();
        setMonsters(monsterData);
      } catch (error) {
        console.error("Failed to load monsters:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMonsters();
  }, []);

  const filteredMonsters = useMemo(() => {
    return monsters.filter((monster) => {
      if (
        filters.search &&
        !monster.name.en.toLowerCase().includes(filters.search.toLowerCase()) &&
        !monster.name.pl.toLowerCase().includes(filters.search.toLowerCase()) &&
        !monster.type.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.size && filters.size.length > 0 && !filters.size.includes(monster.size)) {
        return false;
      }
      if (filters.type && filters.type.length > 0 && !filters.type.includes(monster.type)) {
        return false;
      }
      if (filters.alignment && filters.alignment.length > 0 && !filters.alignment.includes(monster.alignment)) {
        return false;
      }
      return true;
    });
  }, [monsters, filters]);

  const uniqueSizes = useMemo(() => {
    const sizes = new Set(monsters.map((m) => m.size));
    return Array.from(sizes).sort();
  }, [monsters]);

  const uniqueTypes = useMemo(() => {
    const types = new Set(monsters.map((m) => m.type));
    return Array.from(types).sort();
  }, [monsters]);

  const uniqueAlignments = useMemo(() => {
    const alignments = new Set(monsters.map((m) => m.alignment));
    return Array.from(alignments).sort();
  }, [monsters]);

  const getModifierText = (modifier: number) => {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center bg-gray-900 min-h-screen">
        <div className="animate-spin rounded-full size-8 border-b-2 border-cyan-400"></div>
        <span className="ml-2 text-gray-300">Loading monsters...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-transparent bg-clip-text flex items-center">
          <Skull className="size-8 mr-3 text-red-400" />
          Monsters & Enemies
        </h1>
        <span className="bg-red-900/30 text-red-300 px-3 py-1 rounded-full text-sm font-medium border border-red-700/50">
          {filteredMonsters.length} monsters
        </span>
      </div>

      {/* Modern Compact Filter Bar */}
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 mb-6">
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="flex-1 min-w-64 max-w-96">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search monsters..."
                  value={filters.search || ""}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border-0 bg-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:bg-gray-600/50 transition-colors text-sm text-white placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            {/* Modern Dropdown Filters */}
            <FilterDropdown
              label="Size"
              icon="📏"
              options={uniqueSizes}
              selectedValues={filters.size || []}
              onSelectionChange={(values) => setFilters({ ...filters, size: values })}
            />

            <FilterDropdown
              label="Type"
              icon="🐉"
              options={uniqueTypes}
              selectedValues={filters.type || []}
              onSelectionChange={(values) => setFilters({ ...filters, type: values })}
            />

            <FilterDropdown
              label="Alignment"
              icon="⚖️"
              options={uniqueAlignments}
              selectedValues={filters.alignment || []}
              onSelectionChange={(values) => setFilters({ ...filters, alignment: values })}
            />

            <button
              onClick={() => setFilters({ search: "" })}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600 transition-colors flex items-center gap-1"
            >
              <span className="text-xs">🗑️</span>
              <span>Clear</span>
            </button>

            {/* Language Switch */}
            <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-1 border border-gray-600">
              <Languages className="size-4 text-gray-400" />
              <span className="text-sm text-gray-400">Names:</span>
              <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  language === "en" ? "text-purple-500" : "text-gray-300 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("pl")}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  language === "pl" ? "text-purple-500" : "text-gray-300 hover:text-white"
                }`}
              >
                PL
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {((filters.size && filters.size.length > 0) ||
            (filters.type && filters.type.length > 0) ||
            (filters.alignment && filters.alignment.length > 0)) && (
            <div className="border-t border-gray-700 pt-3 mt-3">
              <div className="flex flex-wrap gap-2">
                {filters.size?.map((size) => (
                  <span
                    key={size}
                    className="inline-flex items-center px-2 py-1 bg-red-900/30 text-red-300 text-xs rounded-full border border-red-700/50"
                  >
                    {size}
                    <button
                      onClick={() => {
                        const newSizes = filters.size?.filter((s) => s !== size) || [];
                        setFilters({ ...filters, size: newSizes });
                      }}
                      className="ml-1 hover:text-red-900 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {filters.type?.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center px-2 py-1 bg-amber-900/30 text-amber-300 text-xs rounded-full border border-amber-700/50"
                  >
                    {type}
                    <button
                      onClick={() => {
                        const newTypes = filters.type?.filter((t) => t !== type) || [];
                        setFilters({ ...filters, type: newTypes });
                      }}
                      className="ml-1 hover:text-amber-900 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {filters.alignment?.map((alignment) => (
                  <span
                    key={alignment}
                    className="inline-flex items-center px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full border border-blue-700/50"
                  >
                    {alignment}
                    <button
                      onClick={() => {
                        const newAlignments = filters.alignment?.filter((a) => a !== alignment) || [];
                        setFilters({ ...filters, alignment: newAlignments });
                      }}
                      className="ml-1 hover:text-blue-900 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Monsters List */}
        <div className="lg:col-span-3">
          <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 max-h-[800px] overflow-y-auto">
            {filteredMonsters.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Skull className="size-12 mx-auto mb-4 text-gray-300" />
                <p>No monsters match your filters</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {filteredMonsters.map((monster, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedMonster(monster)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-700/50 ${
                      selectedMonster === monster ? "bg-gray-700" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white">{monster.name[language]}</h3>
                      <span className="text-xs bg-red-900/30 text-red-300 px-2 py-1 rounded border border-red-700/50">
                        {monster.size}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300 mb-2">
                      <span className="font-medium">{monster.type}</span>
                      <span className="mx-2">•</span>
                      <span>{monster.alignment}</span>
                    </div>
                    <div className="text-xs text-gray-400">Category: {monster.category}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Monster Detail */}
        <div className="lg:col-span-7">
          <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6 sticky top-6">
            {selectedMonster ? (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Skull className="size-6 text-red-400" />
                  <h2 className="text-2xl font-bold text-white">{selectedMonster.name[language]}</h2>
                </div>

                <div className="mb-4">
                  <span className="inline-block bg-red-900/30 text-red-300 px-3 py-1 rounded-full text-sm font-medium mr-2 border border-red-700/50">
                    {selectedMonster.size} {selectedMonster.type}
                  </span>
                  <div className="text-sm text-gray-300 mt-2">
                    <strong>Alignment:</strong> {selectedMonster.alignment}
                  </div>
                  <div className="text-sm text-gray-300">
                    <strong>Category:</strong> {selectedMonster.category}
                  </div>
                </div>

                {/* Ability Scores */}
                <div className="mb-6">
                  <h3 className="font-semibold text-white mb-3 flex items-center">
                    <Zap className="size-4 mr-2" />
                    Ability Scores
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(selectedMonster.abilityScores).map(([ability, stats]) => (
                      <div key={ability} className="text-center bg-gray-700 rounded p-2">
                        <div className="text-xs font-medium text-gray-300 uppercase">{ability.slice(0, 3)}</div>
                        <div className="text-lg font-bold text-white">{stats.score}</div>
                        <div className="text-sm text-gray-300">({getModifierText(stats.modifier)})</div>
                        <div className="text-xs text-gray-400">Save: {getModifierText(stats.save)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Senses */}
                {selectedMonster.senses && selectedMonster.senses.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-white mb-2 flex items-center">
                      <Eye className="size-4 mr-2" />
                      Senses
                    </h3>
                    <div className="text-sm text-gray-300">
                      {selectedMonster.senses.map((sense, index) => (
                        <div key={index} className="mb-1">
                          {sense}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {selectedMonster.languages && selectedMonster.languages.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-white mb-2 flex items-center">
                      <MessageSquare className="size-4 mr-2" />
                      Languages
                    </h3>
                    <div className="text-sm text-gray-300">
                      {selectedMonster.languages.map((language, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs mr-1 mb-1 border border-gray-600"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-center py-4 text-gray-400">
                  <p className="text-sm">Additional monster data available in full dataset</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <Skull className="size-12 mx-auto mb-4 text-gray-300" />
                <p>Select a monster to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
