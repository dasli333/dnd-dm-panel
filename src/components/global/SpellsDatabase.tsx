import { useState, useEffect, useMemo, useRef } from "react";
import { Search, Filter, Book, Clock, Target, Zap, Sparkles, ChevronDown } from "lucide-react";
import type { SpellData, SpellFilters } from "@/types/data";

export default function SpellsDatabase() {
  const [spells, setSpells] = useState<SpellData[]>([]);
  const [selectedSpell, setSelectedSpell] = useState<SpellData | null>(null);
  const [filters, setFilters] = useState<SpellFilters>({
    search: "",
    level: [],
    school: [],
    classes: [],
    concentration: undefined,
    ritual: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const schoolDropdownRef = useRef<HTMLDivElement>(null);
  const classDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (schoolDropdownRef.current && !schoolDropdownRef.current.contains(event.target as Node)) {
        setShowSchoolDropdown(false);
      }
      if (classDropdownRef.current && !classDropdownRef.current.contains(event.target as Node)) {
        setShowClassDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadSpells = async () => {
      try {
        const response = await fetch("/data/spells.json");
        const spellData = await response.json();
        setSpells(spellData);
      } catch (error) {
        console.error("Failed to load spells:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSpells();
  }, []);

  const filteredSpells = useMemo(() => {
    return spells.filter((spell) => {
      if (
        filters.search &&
        !spell.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !spell.description.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.level && filters.level.length > 0 && !filters.level.includes(spell.level)) {
        return false;
      }
      if (filters.school && filters.school.length > 0 && !filters.school.includes(spell.school)) {
        return false;
      }
      if (
        filters.classes &&
        filters.classes.length > 0 &&
        !filters.classes.some((cls) => spell.classes.includes(cls))
      ) {
        return false;
      }
      if (filters.concentration !== undefined && spell.duration.concentration !== filters.concentration) {
        return false;
      }
      if (filters.ritual !== undefined && spell.ritual !== filters.ritual) {
        return false;
      }
      return true;
    });
  }, [spells, filters]);

  const uniqueSchools = useMemo(() => {
    const schools = new Set(spells.map((s) => s.school));
    return Array.from(schools).sort();
  }, [spells]);

  const uniqueClasses = useMemo(() => {
    const classes = new Set(spells.flatMap((s) => s.classes));
    return Array.from(classes).sort();
  }, [spells]);

  const getSpellLevelDisplay = (level: number, isCantrip: boolean) => {
    if (isCantrip) return "Cantrip";
    if (level === 1) return "1st Level";
    if (level === 2) return "2nd Level";
    if (level === 3) return "3rd Level";
    return `${level}th Level`;
  };

  const getComponentDisplay = (components: SpellData["components"]) => {
    const parts = [];
    if (components.verbal) parts.push("V");
    if (components.somatic) parts.push("S");
    if (components.material) parts.push("M");
    return parts.join(", ");
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full size-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading spells...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Book className="size-8 mr-3 text-purple-600" />
          Spells Database
        </h1>
        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
          {filteredSpells.length} spells
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
                  placeholder="Search spells..."
                  value={filters.search || ""}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:bg-white transition-colors text-sm"
                />
              </div>
            </div>

            {/* Compact Level Pills */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Level:</span>
              <div className="flex gap-1">
                {[
                  { level: 0, label: "C" },
                  { level: 1, label: "1" },
                  { level: 2, label: "2" },
                  { level: 3, label: "3" },
                  { level: 4, label: "4" },
                  { level: 5, label: "5" },
                  { level: 6, label: "6" },
                  { level: 7, label: "7" },
                  { level: 8, label: "8" },
                  { level: 9, label: "9" },
                ].map((item) => (
                  <button
                    key={item.level}
                    onClick={() => {
                      const newLevels = filters.level?.includes(item.level)
                        ? filters.level.filter((l) => l !== item.level)
                        : [...(filters.level || []), item.level];
                      setFilters({ ...filters, level: newLevels });
                    }}
                    className={`w-7 h-7 text-xs rounded-full font-medium transition-all duration-200 ${
                      filters.level?.includes(item.level)
                        ? "bg-purple-500 text-white shadow-md scale-110"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            {/* Modern Dropdown Filters */}
            <div className="relative" ref={schoolDropdownRef}>
              <button
                onClick={() => setShowSchoolDropdown(!showSchoolDropdown)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  filters.school?.length
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                <span className="text-xs">🎓</span>
                <span>{filters.school?.length ? `School (${filters.school.length})` : "School"}</span>
                <ChevronDown
                  className={`size-3 transition-transform duration-200 ${showSchoolDropdown ? "rotate-180" : ""}`}
                />
              </button>
              {showSchoolDropdown && (
                <div className="absolute top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-48 max-h-60 overflow-y-auto">
                  {uniqueSchools.map((school) => (
                    <label
                      key={school}
                      className="flex items-center px-3 py-2 hover:bg-purple-50 cursor-pointer text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={filters.school?.includes(school) || false}
                        onChange={(e) => {
                          const newSchools = e.target.checked
                            ? [...(filters.school || []), school]
                            : filters.school?.filter((s) => s !== school) || [];
                          setFilters({ ...filters, school: newSchools });
                        }}
                        className="mr-2 rounded text-purple-500 focus:ring-purple-500"
                      />
                      <span>{school}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={classDropdownRef}>
              <button
                onClick={() => setShowClassDropdown(!showClassDropdown)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  filters.classes?.length
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                <span className="text-xs">⚔️</span>
                <span>{filters.classes?.length ? `Class (${filters.classes.length})` : "Class"}</span>
                <ChevronDown
                  className={`size-3 transition-transform duration-200 ${showClassDropdown ? "rotate-180" : ""}`}
                />
              </button>
              {showClassDropdown && (
                <div className="absolute top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-48 max-h-60 overflow-y-auto">
                  {uniqueClasses.map((cls) => (
                    <label key={cls} className="flex items-center px-3 py-2 hover:bg-purple-50 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={filters.classes?.includes(cls) || false}
                        onChange={(e) => {
                          const newClasses = e.target.checked
                            ? [...(filters.classes || []), cls]
                            : filters.classes?.filter((c) => c !== cls) || [];
                          setFilters({ ...filters, classes: newClasses });
                        }}
                        className="mr-2 rounded text-purple-500 focus:ring-purple-500"
                      />
                      <span>{cls}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Modern Toggle Filters */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setFilters({
                    ...filters,
                    concentration: filters.concentration === true ? undefined : true,
                  })
                }
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                  filters.concentration === true
                    ? "bg-orange-100 text-orange-700 border border-orange-200"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                <span className="text-xs">🎯</span>
                <span>Concentration</span>
              </button>
              <button
                onClick={() =>
                  setFilters({
                    ...filters,
                    ritual: filters.ritual === true ? undefined : true,
                  })
                }
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                  filters.ritual === true
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                <span className="text-xs">📜</span>
                <span>Ritual</span>
              </button>

              <button
                onClick={() => setFilters({ search: "" })}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 transition-colors flex items-center gap-1"
              >
                <span className="text-xs">🗑️</span>
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.level?.length ||
            filters.school?.length ||
            filters.classes?.length ||
            filters.concentration !== undefined ||
            filters.ritual !== undefined) && (
            <div className="border-t border-gray-100 pt-3 mt-3">
              <div className="flex flex-wrap gap-2">
                {filters.level?.map((level) => (
                  <span
                    key={level}
                    className="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full border border-purple-200"
                  >
                    {level === 0 ? "Cantrip" : `Level ${level}`}
                    <button
                      onClick={() => {
                        const newLevels = filters.level?.filter((l) => l !== level) || [];
                        setFilters({ ...filters, level: newLevels });
                      }}
                      className="ml-1 hover:text-purple-900 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {filters.school?.map((school) => (
                  <span
                    key={school}
                    className="inline-flex items-center px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-200"
                  >
                    {school}
                    <button
                      onClick={() => {
                        const newSchools = filters.school?.filter((s) => s !== school) || [];
                        setFilters({ ...filters, school: newSchools });
                      }}
                      className="ml-1 hover:text-amber-900 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {filters.classes?.map((cls) => (
                  <span
                    key={cls}
                    className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                  >
                    {cls}
                    <button
                      onClick={() => {
                        const newClasses = filters.classes?.filter((c) => c !== cls) || [];
                        setFilters({ ...filters, classes: newClasses });
                      }}
                      className="ml-1 hover:text-blue-900 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {filters.concentration === true && (
                  <span className="inline-flex items-center px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full border border-orange-200">
                    Concentration
                    <button
                      onClick={() => setFilters({ ...filters, concentration: undefined })}
                      className="ml-1 hover:text-orange-900 font-bold"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.ritual === true && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                    Ritual
                    <button
                      onClick={() => setFilters({ ...filters, ritual: undefined })}
                      className="ml-1 hover:text-blue-900 font-bold"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Spells List */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 max-h-[800px] overflow-y-auto">
            {filteredSpells.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Book className="size-12 mx-auto mb-4 text-gray-300" />
                <p>No spells match your filters</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredSpells.map((spell, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedSpell(spell)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-purple-50 ${
                      selectedSpell === spell ? "bg-purple-100" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{spell.name}</h3>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {getSpellLevelDisplay(spell.level, spell.isCantrip)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">{spell.school}</span>
                      {spell.duration.concentration && <span className="ml-2 text-orange-600">(C)</span>}
                      {spell.ritual && <span className="ml-2 text-blue-600">(R)</span>}
                    </div>
                    <div className="text-xs text-gray-500">{spell.classes.join(", ")}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Spell Detail */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-6">
            {selectedSpell ? (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="size-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">{selectedSpell.name}</h2>
                </div>

                <div className="mb-4">
                  <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mr-2">
                    {getSpellLevelDisplay(selectedSpell.level, selectedSpell.isCantrip)} {selectedSpell.school}
                  </span>
                  {selectedSpell.duration.concentration && (
                    <span className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                      Concentration
                    </span>
                  )}
                  {selectedSpell.ritual && (
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs ml-1">
                      Ritual
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Clock className="size-4 mr-1" />
                      <strong>Casting Time:</strong>
                    </div>
                    <div className="ml-5">{selectedSpell.castingTime.time}</div>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Target className="size-4 mr-1" />
                      <strong>Range:</strong>
                    </div>
                    <div className="ml-5">{selectedSpell.range}</div>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Zap className="size-4 mr-1" />
                      <strong>Components:</strong>
                    </div>
                    <div className="ml-5">
                      {getComponentDisplay(selectedSpell.components)}
                      {selectedSpell.components.materialDescription && (
                        <div className="text-xs text-gray-500 mt-1">
                          ({selectedSpell.components.materialDescription})
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">
                      <strong>Duration:</strong>
                    </div>
                    <div className="ml-0">{selectedSpell.duration.durationType}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-gray-600 mb-2">
                    <strong>Classes:</strong>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedSpell.classes.map((cls) => (
                      <span key={cls} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <strong className="text-gray-900 block mb-2">Description:</strong>
                  <p className="text-gray-700 text-sm leading-relaxed">{selectedSpell.description}</p>
                </div>

                {selectedSpell.higherLevels && (
                  <div className="mb-4">
                    <strong className="text-gray-900 block mb-2">At Higher Levels:</strong>
                    <p className="text-gray-700 text-sm leading-relaxed">{selectedSpell.higherLevels}</p>
                  </div>
                )}

                {selectedSpell.damage && selectedSpell.damage.length > 0 && (
                  <div>
                    <strong className="text-gray-900 block mb-2">Damage:</strong>
                    {selectedSpell.damage.map((dmg, index) => (
                      <div key={index} className="text-sm text-gray-700">
                        {dmg.formula} {dmg.damageType} (avg: {dmg.average})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Book className="size-12 mx-auto mb-4 text-gray-300" />
                <p>Select a spell to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
