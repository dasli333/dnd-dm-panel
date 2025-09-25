import { useState, useMemo } from "react";
import { Search, Filter, ShoppingBag, Coins, Star, Sword, Shield, Backpack, Gem, Plus } from "lucide-react";

interface Item {
  id: string;
  name: string;
  type: string;
  subtype?: string;
  rarity: "common" | "uncommon" | "rare" | "very-rare" | "legendary" | "artifact";
  price: {
    value: number;
    currency: string;
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
}

interface ItemFilters {
  search: string;
  type: string[];
  rarity: string[];
  priceRange: {
    min: number;
    max: number;
  };
  requiresAttunement?: boolean;
}

const mockItems: Item[] = [
  {
    id: "longsword",
    name: "Longsword",
    type: "weapon",
    subtype: "martial melee",
    rarity: "common",
    price: { value: 15, currency: "gp" },
    weight: 3,
    description: "A versatile martial weapon with a straight, double-edged blade.",
    damage: { dice: "1d8", type: "slashing" },
    properties: ["Versatile (1d10)"],
  },
  {
    id: "plate-armor",
    name: "Plate Armor",
    type: "armor",
    subtype: "heavy",
    rarity: "common",
    price: { value: 1500, currency: "gp" },
    weight: 65,
    description: "Heavy armor made of interlocking metal plates covering the entire body.",
    armorClass: 18,
  },
  {
    id: "flame-tongue",
    name: "Flame Tongue",
    type: "weapon",
    subtype: "martial melee",
    rarity: "rare",
    price: { value: 5000, currency: "gp" },
    weight: 3,
    description: "A magical longsword that can burst into flames on command.",
    damage: { dice: "1d8", type: "slashing" },
    properties: ["Versatile (1d10)", "Magic", "Fire damage (2d6)"],
    requiresAttunement: true,
  },
  {
    id: "healing-potion",
    name: "Potion of Healing",
    type: "consumable",
    subtype: "potion",
    rarity: "common",
    price: { value: 50, currency: "gp" },
    weight: 0.5,
    description: "A magical red liquid that restores hit points when consumed. Heals 2d4+2 hit points.",
  },
  {
    id: "bag-of-holding",
    name: "Bag of Holding",
    type: "magic-item",
    subtype: "wondrous item",
    rarity: "uncommon",
    price: { value: 500, currency: "gp" },
    weight: 15,
    description:
      "A magical bag that can hold much more than its size suggests. Has an internal capacity of 500 pounds and 64 cubic feet.",
  },
  {
    id: "thieves-tools",
    name: "Thieves' Tools",
    type: "tool",
    rarity: "common",
    price: { value: 25, currency: "gp" },
    weight: 1,
    description: "A set of tools including small files, lock picks, mirrors, and pliers for bypassing locks and traps.",
  },
  {
    id: "diamond",
    name: "Diamond (1000 gp)",
    type: "treasure",
    subtype: "gemstone",
    rarity: "rare",
    price: { value: 1000, currency: "gp" },
    weight: 0,
    description: "A precious gemstone, often used as a material component for powerful spells.",
  },
  {
    id: "cloak-of-protection",
    name: "Cloak of Protection",
    type: "magic-item",
    subtype: "wondrous item",
    rarity: "uncommon",
    price: { value: 1000, currency: "gp" },
    weight: 1,
    description: "A magical cloak that provides a +1 bonus to AC and saving throws.",
    requiresAttunement: true,
  },
];

export default function ItemsMarketplace() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [filters, setFilters] = useState<ItemFilters>({
    search: "",
    type: [],
    rarity: [],
    priceRange: { min: 0, max: 10000 },
    requiresAttunement: undefined,
  });

  const filteredItems = useMemo(() => {
    return mockItems.filter((item) => {
      if (
        filters.search &&
        !item.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !item.description.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.type.length > 0 && !filters.type.includes(item.type)) {
        return false;
      }
      if (filters.rarity.length > 0 && !filters.rarity.includes(item.rarity)) {
        return false;
      }
      if (item.price.value < filters.priceRange.min || item.price.value > filters.priceRange.max) {
        return false;
      }
      if (filters.requiresAttunement !== undefined && item.requiresAttunement !== filters.requiresAttunement) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const uniqueTypes = useMemo(() => {
    const types = new Set(mockItems.map((item) => item.type));
    return Array.from(types).sort();
  }, []);

  const rarityColors = {
    common: "bg-gray-100 text-gray-800",
    uncommon: "bg-green-100 text-green-800",
    rare: "bg-blue-100 text-blue-800",
    "very-rare": "bg-purple-100 text-purple-800",
    legendary: "bg-orange-100 text-orange-800",
    artifact: "bg-red-100 text-red-800",
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case "weapon":
        return <Sword className="size-4" />;
      case "armor":
        return <Shield className="size-4" />;
      case "tool":
      case "consumable":
      case "treasure":
        return <Backpack className="size-4" />;
      case "magic-item":
        return <Gem className="size-4" />;
      default:
        return <ShoppingBag className="size-4" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ShoppingBag className="size-8 mr-3 text-green-600" />
            Items & Marketplace
          </h1>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {filteredItems.length} items
          </span>
        </div>
        <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
          <Plus className="size-4 mr-2" />
          Add Custom Item
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Filter className="size-4 mr-2" />
              Filters
            </h3>

            {/* Search */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <div className="space-y-2">
                {uniqueTypes.map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.type.includes(type)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...filters.type, type]
                          : filters.type.filter((t) => t !== type);
                        setFilters({ ...filters, type: newTypes });
                      }}
                      className="mr-2 rounded"
                    />
                    <span className="text-sm capitalize flex items-center">
                      {getItemIcon(type)}
                      <span className="ml-2">{type.replace("-", " ")}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rarity Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rarity</label>
              <div className="space-y-2">
                {Object.keys(rarityColors).map((rarity) => (
                  <label key={rarity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.rarity.includes(rarity)}
                      onChange={(e) => {
                        const newRarity = e.target.checked
                          ? [...filters.rarity, rarity]
                          : filters.rarity.filter((r) => r !== rarity);
                        setFilters({ ...filters, rarity: newRarity });
                      }}
                      className="mr-2 rounded"
                    />
                    <span
                      className={`text-xs px-2 py-1 rounded capitalize ${rarityColors[rarity as keyof typeof rarityColors]}`}
                    >
                      {rarity.replace("-", " ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (gp)</label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={filters.priceRange.max}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      priceRange: { ...filters.priceRange, max: parseInt(e.target.value) },
                    })
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{filters.priceRange.min} gp</span>
                  <span>{filters.priceRange.max} gp</span>
                </div>
              </div>
            </div>

            {/* Attunement Filter */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.requiresAttunement === true}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      requiresAttunement: e.target.checked ? true : undefined,
                    })
                  }
                  className="mr-2 rounded"
                />
                <span className="text-sm">Requires Attunement</span>
              </label>
            </div>

            <button
              onClick={() =>
                setFilters({
                  search: "",
                  type: [],
                  rarity: [],
                  priceRange: { min: 0, max: 10000 },
                  requiresAttunement: undefined,
                })
              }
              className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 max-h-[800px] overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <ShoppingBag className="size-12 mx-auto mb-4 text-gray-300" />
                <p>No items match your filters</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-green-50 ${
                      selectedItem === item ? "bg-green-100" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        {getItemIcon(item.type)}
                        <h3 className="font-semibold text-gray-900 ml-2">{item.name}</h3>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded capitalize ${rarityColors[item.rarity]}`}>
                        {item.rarity.replace("-", " ")}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2 flex items-center">
                      <Coins className="size-4 mr-1 text-yellow-500" />
                      <span className="font-medium">
                        {item.price.value} {item.price.currency}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="capitalize">{item.type.replace("-", " ")}</span>
                    </div>
                    {item.requiresAttunement && (
                      <div className="text-xs text-purple-600 flex items-center">
                        <Star className="size-3 mr-1" />
                        Requires Attunement
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Item Detail */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-6">
            {selectedItem ? (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {getItemIcon(selectedItem.type)}
                  <h2 className="text-2xl font-bold text-gray-900">{selectedItem.name}</h2>
                </div>

                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium mr-2 capitalize ${rarityColors[selectedItem.rarity]}`}
                  >
                    {selectedItem.rarity.replace("-", " ")}
                  </span>
                  {selectedItem.requiresAttunement && (
                    <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                      <Star className="size-3 inline mr-1" />
                      Attunement
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-gray-600 mb-1">
                      <strong>Type:</strong>
                    </div>
                    <div className="text-sm capitalize">{selectedItem.type.replace("-", " ")}</div>
                    {selectedItem.subtype && <div className="text-xs text-gray-500">({selectedItem.subtype})</div>}
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Coins className="size-4 mr-1 text-yellow-500" />
                      <strong>Price:</strong>
                    </div>
                    <div className="text-lg font-semibold text-green-600">
                      {selectedItem.price.value} {selectedItem.price.currency}
                    </div>
                  </div>
                  {selectedItem.weight && (
                    <div>
                      <div className="text-gray-600 mb-1">
                        <strong>Weight:</strong>
                      </div>
                      <div className="text-sm">{selectedItem.weight} lbs</div>
                    </div>
                  )}
                  {selectedItem.armorClass && (
                    <div>
                      <div className="text-gray-600 mb-1">
                        <strong>AC:</strong>
                      </div>
                      <div className="text-sm">{selectedItem.armorClass}</div>
                    </div>
                  )}
                </div>

                {selectedItem.damage && (
                  <div className="mb-4">
                    <div className="text-gray-600 mb-1">
                      <strong>Damage:</strong>
                    </div>
                    <div className="text-sm">
                      {selectedItem.damage.dice} {selectedItem.damage.type}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <strong className="text-gray-900 block mb-2">Description:</strong>
                  <p className="text-gray-700 text-sm leading-relaxed">{selectedItem.description}</p>
                </div>

                {selectedItem.properties && selectedItem.properties.length > 0 && (
                  <div className="mb-4">
                    <strong className="text-gray-900 block mb-2">Properties:</strong>
                    <div className="flex flex-wrap gap-1">
                      {selectedItem.properties.map((property, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {property}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-6">
                  <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    Add to Campaign
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <ShoppingBag className="size-12 mx-auto mb-4 text-gray-300" />
                <p>Select an item to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
