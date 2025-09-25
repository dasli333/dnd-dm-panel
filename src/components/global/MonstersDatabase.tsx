import { useState, useEffect, useMemo, useRef } from "react";
import { Search, Filter, Skull, Shield, Heart, Zap, Eye, MessageSquare, ChevronDown } from "lucide-react";
import type { MonsterData, MonsterFilters } from "@/types/data";

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
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showAlignmentDropdown, setShowAlignmentDropdown] = useState(false);
  const sizeDropdownRef = useRef<HTMLDivElement>(null);
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const alignmentDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(event.target as Node)) {
        setShowSizeDropdown(false);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setShowTypeDropdown(false);
      }
      if (alignmentDropdownRef.current && !alignmentDropdownRef.current.contains(event.target as Node)) {
        setShowAlignmentDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        !monster.name.toLowerCase().includes(filters.search.toLowerCase()) &&
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
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full size-8 border-b-2 border-red-500"></div>
        <span className="ml-2">Loading monsters...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Skull className="size-8 mr-3 text-red-600" />
          Monsters & Enemies
        </h1>
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
          {filteredMonsters.length} monsters
        </span>
      </div>

      {/* Modern Compact Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
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
                  className="w-full pl-10 pr-4 py-2.5 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-red-500 focus:bg-white transition-colors text-sm"
                />
              </div>
            </div>

            {/* Modern Dropdown Filters */}
            <div className="relative" ref={sizeDropdownRef}>
              <button
                onClick={() => setShowSizeDropdown(!showSizeDropdown)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  filters.size && filters.size.length > 0
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                <span className="text-xs">📏</span>
                <span>
                  {filters.size && filters.size.length > 0
                    ? `Size (${filters.size.length})`
                    : "Size"}
                </span>
                <ChevronDown className={`size-3 transition-transform duration-200 ${
                  showSizeDropdown ? "rotate-180" : ""
                }`} />
              </button>
              {showSizeDropdown && (
                <div className="absolute top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-48 max-h-60 overflow-y-auto">
                  {uniqueSizes.map((size) => (
                    <label key={size} className="flex items-center px-3 py-2 hover:bg-red-50 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={filters.size?.includes(size) || false}
                        onChange={(e) => {
                          const newSizes = e.target.checked
                            ? [...(filters.size || []), size]
                            : filters.size?.filter((s) => s !== size) || [];
                          setFilters({ ...filters, size: newSizes });
                        }}
                        className="mr-2 rounded text-red-500 focus:ring-red-500"
                      />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={typeDropdownRef}>
              <button
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  filters.type && filters.type.length > 0
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                <span className="text-xs">🐉</span>
                <span>
                  {filters.type && filters.type.length > 0
                    ? `Type (${filters.type.length})`
                    : "Type"}
                </span>
                <ChevronDown className={`size-3 transition-transform duration-200 ${
                  showTypeDropdown ? "rotate-180" : ""
                }`} />
              </button>
              {showTypeDropdown && (
                <div className="absolute top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-48 max-h-60 overflow-y-auto">
                  {uniqueTypes.map((type) => (
                    <label key={type} className="flex items-center px-3 py-2 hover:bg-red-50 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={filters.type?.includes(type) || false}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...(filters.type || []), type]
                            : filters.type?.filter((t) => t !== type) || [];
                          setFilters({ ...filters, type: newTypes });
                        }}
                        className="mr-2 rounded text-red-500 focus:ring-red-500"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={alignmentDropdownRef}>
              <button
                onClick={() => setShowAlignmentDropdown(!showAlignmentDropdown)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  filters.alignment && filters.alignment.length > 0
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                <span className="text-xs">⚖️</span>
                <span>
                  {filters.alignment && filters.alignment.length > 0
                    ? `Alignment (${filters.alignment.length})`
                    : "Alignment"}
                </span>
                <ChevronDown className={`size-3 transition-transform duration-200 ${
                  showAlignmentDropdown ? "rotate-180" : ""
                }`} />
              </button>
              {showAlignmentDropdown && (
                <div className="absolute top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-48 max-h-60 overflow-y-auto">
                  {uniqueAlignments.map((alignment) => (
                    <label key={alignment} className="flex items-center px-3 py-2 hover:bg-red-50 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={filters.alignment?.includes(alignment) || false}
                        onChange={(e) => {
                          const newAlignments = e.target.checked
                            ? [...(filters.alignment || []), alignment]
                            : filters.alignment?.filter((a) => a !== alignment) || [];
                          setFilters({ ...filters, alignment: newAlignments });
                        }}
                        className="mr-2 rounded text-red-500 focus:ring-red-500"
                      />
                      <span>{alignment}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setFilters({ search: "" })}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 transition-colors flex items-center gap-1"
            >
              <span className="text-xs">🗑️</span>
              <span>Clear</span>
            </button>
          </div>

          {/* Active Filters Display */}
          {((filters.size && filters.size.length > 0) || (filters.type && filters.type.length > 0) || (filters.alignment && filters.alignment.length > 0)) && (
            <div className="border-t border-gray-100 pt-3 mt-3">
              <div className="flex flex-wrap gap-2">
                {filters.size?.map((size) => (
                  <span
                    key={size}
                    className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full border border-red-200"
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
                    className="inline-flex items-center px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-200"
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
                    className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
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
          <div className="bg-white rounded-lg shadow-md border border-gray-200 max-h-[800px] overflow-y-auto">
            {filteredMonsters.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Skull className="size-12 mx-auto mb-4 text-gray-300" />
                <p>No monsters match your filters</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredMonsters.map((monster, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedMonster(monster)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-red-50 ${
                      selectedMonster === monster ? "bg-red-100" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{monster.name}</h3>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">{monster.size}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">{monster.type}</span>
                      <span className="mx-2">•</span>
                      <span>{monster.alignment}</span>
                    </div>
                    <div className="text-xs text-gray-500">Category: {monster.category}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Monster Detail */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-6">
            {selectedMonster ? (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Skull className="size-6 text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900">{selectedMonster.name}</h2>
                </div>

                <div className="mb-4">
                  <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mr-2">
                    {selectedMonster.size} {selectedMonster.type}
                  </span>
                  <div className="text-sm text-gray-600 mt-2">
                    <strong>Alignment:</strong> {selectedMonster.alignment}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Category:</strong> {selectedMonster.category}
                  </div>
                </div>

                {/* Ability Scores */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Zap className="size-4 mr-2" />
                    Ability Scores
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(selectedMonster.abilityScores).map(([ability, stats]) => (
                      <div key={ability} className="text-center bg-gray-50 rounded p-2">
                        <div className="text-xs font-medium text-gray-600 uppercase">{ability.slice(0, 3)}</div>
                        <div className="text-lg font-bold text-gray-900">{stats.score}</div>
                        <div className="text-sm text-gray-600">({getModifierText(stats.modifier)})</div>
                        <div className="text-xs text-gray-500">Save: {getModifierText(stats.save)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Senses */}
                {selectedMonster.senses && selectedMonster.senses.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Eye className="size-4 mr-2" />
                      Senses
                    </h3>
                    <div className="text-sm text-gray-700">
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
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <MessageSquare className="size-4 mr-2" />
                      Languages
                    </h3>
                    <div className="text-sm text-gray-700">
                      {selectedMonster.languages.map((language, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-1 mb-1"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">Additional monster data available in full dataset</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
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
