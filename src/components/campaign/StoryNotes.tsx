import { useState } from "react";
import { BookOpen, Plus, Search, Filter, MapPin, Users, Scroll, Tag, Edit3, Trash2, Save, X } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  category: "npc" | "location" | "quest" | "lore" | "general";
  tags: string[];
  created: string;
  updated: string;
  linkedNotes: string[];
}

const mockNotes: Note[] = [
  {
    id: "1",
    title: "The Broken Crown Tavern",
    content:
      "A popular tavern in the merchant district of Waterdeep. The owner, Miriel Grayhawk, is a retired adventurer who knows many secrets. The tavern serves as an informal information hub. Notable patrons include Captain Zelda of the city watch and the mysterious hooded figure who sits in the corner every evening.",
    category: "location",
    tags: ["waterdeep", "tavern", "information", "npc-hub"],
    created: "2024-01-15",
    updated: "2024-01-20",
    linkedNotes: ["2", "5"],
  },
  {
    id: "2",
    title: "Miriel Grayhawk",
    content:
      "Former adventurer turned tavern keeper. Mid-40s human female with graying auburn hair and keen green eyes. Missing her left pinky finger from an old trap. Knows about the secret passages beneath the city and has connections with the Harpers. Friendly but cautious with new customers.",
    category: "npc",
    tags: ["waterdeep", "tavern-keeper", "harpers", "informant"],
    created: "2024-01-15",
    updated: "2024-01-18",
    linkedNotes: ["1"],
  },
  {
    id: "3",
    title: "The Lost Crown of Aethermoor",
    content:
      "An ancient artifact that belonged to the last king of the fallen kingdom of Aethermoor. The crown is said to grant the wearer the ability to control the weather within a 10-mile radius. It was lost during the kingdom's fall 300 years ago. Recent rumors suggest it may be hidden in the Whispering Caverns.",
    category: "lore",
    tags: ["artifact", "crown", "weather-control", "aethermoor", "whispering-caverns"],
    created: "2024-01-10",
    updated: "2024-01-22",
    linkedNotes: ["4"],
  },
  {
    id: "4",
    title: "Quest: Recover the Lost Crown",
    content:
      "Lord Pemberton has hired the party to recover the Lost Crown of Aethermoor. He claims it's for his private collection, but the party suspects he wants to use it for political gain. The quest involves traveling to the Whispering Caverns, dealing with the guardian spirits, and solving the riddle of the crown's resting place.",
    category: "quest",
    tags: ["main-quest", "crown", "lord-pemberton", "whispering-caverns"],
    created: "2024-01-12",
    updated: "2024-01-23",
    linkedNotes: ["3", "6"],
  },
  {
    id: "5",
    title: "Captain Zelda Ironwood",
    content:
      "A stern but fair captain of the Waterdeep city watch. Dwarven female in her 50s with iron-gray braided hair and a scar across her left cheek. Values justice above all else but willing to bend rules for the greater good. Has a personal vendetta against the Zhentarim. Can be found at The Broken Crown most evenings.",
    category: "npc",
    tags: ["city-watch", "dwarf", "captain", "waterdeep", "justice"],
    created: "2024-01-16",
    updated: "2024-01-19",
    linkedNotes: ["1"],
  },
  {
    id: "6",
    title: "Lord Pemberton's True Motives",
    content:
      "Through investigation, the party has discovered that Lord Pemberton is actually working with a cult that worships an ancient storm deity. They plan to use the crown's power to summon a massive hurricane that will devastate the coastal cities, allowing the cult to seize power in the chaos that follows.",
    category: "lore",
    tags: ["lord-pemberton", "cult", "storm-deity", "conspiracy", "revelation"],
    created: "2024-01-20",
    updated: "2024-01-24",
    linkedNotes: ["4"],
  },
];

export default function StoryNotes() {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    tags: [],
  });

  const categories = [
    { key: "npc", label: "NPCs", icon: Users, color: "blue" },
    { key: "location", label: "Locations", icon: MapPin, color: "green" },
    { key: "quest", label: "Quests", icon: Scroll, color: "purple" },
    { key: "lore", label: "Lore", icon: BookOpen, color: "amber" },
    { key: "general", label: "General", icon: Tag, color: "gray" },
  ];

  const filteredNotes = notes.filter((note) => {
    if (
      filters.search &&
      !note.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !note.content.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    if (filters.category && note.category !== filters.category) {
      return false;
    }
    return true;
  });

  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags))).sort();

  const getCategoryInfo = (category: string) => {
    return categories.find((cat) => cat.key === category) || categories[4];
  };

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "New Note",
      content: "",
      category: "general",
      tags: [],
      created: new Date().toISOString().split("T")[0],
      updated: new Date().toISOString().split("T")[0],
      linkedNotes: [],
    };
    setNotes([newNote, ...notes]);
    setEditingNote(newNote);
    setSelectedNote(newNote);
    setShowAddModal(false);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote({ ...note });
  };

  const handleSaveNote = () => {
    if (editingNote) {
      const updatedNote = {
        ...editingNote,
        updated: new Date().toISOString().split("T")[0],
      };
      setNotes((notes) => notes.map((n) => (n.id === editingNote.id ? updatedNote : n)));
      setSelectedNote(updatedNote);
      setEditingNote(null);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((notes) => notes.filter((n) => n.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BookOpen className="size-8 mr-3 text-amber-600" />
            Story & World Notes
          </h1>
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
            {filteredNotes.length} notes
          </span>
        </div>
        <button
          onClick={handleAddNote}
          className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          <Plus className="size-4 mr-2" />
          Add Note
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters & Categories */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Filter className="size-4 mr-2" />
              Categories
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setFilters({ ...filters, category: "" })}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filters.category === "" ? "bg-amber-100 text-amber-800" : "hover:bg-gray-100"
                }`}
              >
                All Categories ({notes.length})
              </button>
              {categories.map((category) => {
                const count = notes.filter((n) => n.category === category.key).length;
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.key}
                    onClick={() => setFilters({ ...filters, category: category.key })}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
                      filters.category === category.key
                        ? `bg-${category.color}-100 text-${category.color}-800`
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <IconComponent className="size-4 mr-2" />
                    {category.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 10).map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs cursor-pointer hover:bg-gray-200"
                  onClick={() => setFilters({ ...filters, search: tag })}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Notes List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 max-h-[800px] overflow-y-auto">
            {filteredNotes.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <BookOpen className="size-12 mx-auto mb-4 text-gray-300" />
                <p>No notes match your filters</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotes.map((note) => {
                  const categoryInfo = getCategoryInfo(note.category);
                  const IconComponent = categoryInfo.icon;
                  return (
                    <div
                      key={note.id}
                      onClick={() => setSelectedNote(note)}
                      className={`p-4 cursor-pointer transition-colors hover:bg-amber-50 ${
                        selectedNote?.id === note.id ? "bg-amber-100" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 flex items-center">
                          <IconComponent className="size-4 mr-2" />
                          {note.title}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded capitalize bg-${categoryInfo.color}-100 text-${categoryInfo.color}-800`}
                        >
                          {note.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{note.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {note.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                          {note.tags.length > 2 && (
                            <span className="text-xs text-gray-500">+{note.tags.length - 2} more</span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{new Date(note.updated).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Note Detail */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-6">
            {selectedNote ? (
              <div>
                {editingNote && editingNote.id === selectedNote.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl font-bold text-gray-900">Edit Note</h2>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveNote}
                          className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          <Save className="size-4 mr-2" />
                          Save
                        </button>
                        <button
                          onClick={() => setEditingNote(null)}
                          className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                          <X className="size-4 mr-2" />
                          Cancel
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={editingNote.title}
                        onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={editingNote.category}
                        onChange={(e) => setEditingNote({ ...editingNote, category: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      >
                        {categories.map((cat) => (
                          <option key={cat.key} value={cat.key}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={editingNote.tags.join(", ")}
                        onChange={(e) =>
                          setEditingNote({
                            ...editingNote,
                            tags: e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter((t) => t),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                      <textarea
                        value={editingNote.content}
                        onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                        rows={12}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                          {(() => {
                            const categoryInfo = getCategoryInfo(selectedNote.category);
                            const IconComponent = categoryInfo.icon;
                            return <IconComponent className="size-6 mr-3" />;
                          })()}
                          {selectedNote.title}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`text-sm px-2 py-1 rounded capitalize ${(() => {
                              const categoryInfo = getCategoryInfo(selectedNote.category);
                              return `bg-${categoryInfo.color}-100 text-${categoryInfo.color}-800`;
                            })()}`}
                          >
                            {selectedNote.category}
                          </span>
                          <span className="text-sm text-gray-500">
                            Updated: {new Date(selectedNote.updated).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditNote(selectedNote)}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit3 className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(selectedNote.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {selectedNote.tags.map((tag) => (
                          <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedNote.content}</p>
                    </div>

                    {selectedNote.linkedNotes.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-3">Linked Notes</h3>
                        <div className="space-y-2">
                          {selectedNote.linkedNotes.map((linkedId) => {
                            const linkedNote = notes.find((n) => n.id === linkedId);
                            if (!linkedNote) return null;
                            const categoryInfo = getCategoryInfo(linkedNote.category);
                            const IconComponent = categoryInfo.icon;
                            return (
                              <button
                                key={linkedId}
                                onClick={() => setSelectedNote(linkedNote)}
                                className="flex items-center p-2 w-full text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <IconComponent className="size-4 mr-2" />
                                <span className="font-medium">{linkedNote.title}</span>
                                <span
                                  className={`ml-auto text-xs px-2 py-1 rounded bg-${categoryInfo.color}-100 text-${categoryInfo.color}-800`}
                                >
                                  {linkedNote.category}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <BookOpen className="size-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Note Selected</h3>
                <p className="text-gray-600">Select a note from the list to view its contents.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
