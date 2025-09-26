import { useState } from "react";
import { Calendar, Plus, Edit3, Clock, Users, FileText, Save, X } from "lucide-react";

interface Session {
  id: string;
  date: string;
  title: string;
  duration: number; // in hours
  participants: string[];
  summary: string;
  keyEvents: string[];
  treasureFound: string[];
  experienceAwarded: number;
  nextSessionPlans: string;
}

const mockSessions: Session[] = [
  {
    id: "1",
    date: "2024-01-24",
    title: "The Crown's Secret",
    duration: 4,
    participants: ["Alex (Thalion)", "Sam (Grenda)", "Jordan (Mystral)"],
    summary:
      "The party discovered Lord Pemberton's true motives regarding the Crown of Aethermoor. Through careful investigation at The Broken Crown tavern, they learned about the storm cult's involvement. Captain Zelda provided crucial information about recent suspicious activities in the noble district.",
    keyEvents: [
      "Investigated Lord Pemberton's mansion at night",
      "Found cult symbols in the basement",
      "Rescued a captured informant",
      "Learned about the hurricane summoning ritual",
    ],
    treasureFound: ["500 gold pieces", "Potion of Greater Healing", "Scroll of Dispel Magic"],
    experienceAwarded: 800,
    nextSessionPlans:
      "The party will travel to the Whispering Caverns to find the crown before the cult does. They need to prepare for the journey and gather supplies.",
  },
  {
    id: "2",
    date: "2024-01-17",
    title: "Gathering Information",
    duration: 3.5,
    participants: ["Alex (Thalion)", "Sam (Grenda)", "Jordan (Mystral)"],
    summary:
      "The party spent time in Waterdeep gathering information about the Lost Crown. They met key NPCs including Miriel Grayhawk and Captain Zelda, establishing important relationships for future adventures.",
    keyEvents: [
      "First visit to The Broken Crown tavern",
      "Met Miriel Grayhawk and gained her trust",
      "Encountered Captain Zelda during a bar fight",
      "Researched the history of Aethermoor in the library",
    ],
    treasureFound: ["Ancient map of the Whispering Caverns (partial)", "200 gold pieces reward for stopping bar fight"],
    experienceAwarded: 600,
    nextSessionPlans: "Continue investigating Lord Pemberton's background and true intentions.",
  },
  {
    id: "3",
    date: "2024-01-10",
    title: "The Quest Begins",
    duration: 4.5,
    participants: ["Alex (Thalion)", "Sam (Grenda)", "Jordan (Mystral)"],
    summary:
      "The party was hired by Lord Pemberton to recover the Lost Crown of Aethermoor. Initial meeting established the quest parameters and the party's compensation. First signs that not everything is as it seems.",
    keyEvents: [
      "Met Lord Pemberton at his estate",
      "Negotiated quest terms and payment",
      "Noticed suspicious magical auras around the estate",
      "Formed the adventuring party officially",
    ],
    treasureFound: ["1000 gold advance payment", "Magical components worth 150 gold"],
    experienceAwarded: 500,
    nextSessionPlans: "Begin gathering information about the crown and its location.",
  },
];

export default function SessionJournal() {
  const [sessions, setSessions] = useState<Session[]>(
    mockSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );
  const [selectedSession, setSelectedSession] = useState<Session | null>(sessions[0] || null);
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  const totalSessions = sessions.length;
  const totalHours = sessions.reduce((sum, session) => sum + session.duration, 0);
  const totalExperience = sessions.reduce((sum, session) => sum + session.experienceAwarded, 0);

  const handleAddSession = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      title: "New Session",
      duration: 4,
      participants: [],
      summary: "",
      keyEvents: [],
      treasureFound: [],
      experienceAwarded: 0,
      nextSessionPlans: "",
    };
    setSessions([newSession, ...sessions]);
    setEditingSession(newSession);
    setSelectedSession(newSession);
  };

  const handleEditSession = (session: Session) => {
    setEditingSession({ ...session });
  };

  const handleSaveSession = () => {
    if (editingSession) {
      setSessions((sessions) => sessions.map((s) => (s.id === editingSession.id ? editingSession : s)));
      setSelectedSession(editingSession);
      setEditingSession(null);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Calendar className="size-8 mr-3 text-indigo-400" />
            Session Journal
          </h1>
          <div className="flex gap-4 text-sm">
            <span className="bg-indigo-700 text-indigo-200 px-3 py-1 rounded-full font-medium">
              {totalSessions} sessions
            </span>
            <span className="bg-green-700 text-green-200 px-3 py-1 rounded-full font-medium">{totalHours}h played</span>
            <span className="bg-yellow-700 text-yellow-200 px-3 py-1 rounded-full font-medium">
              {totalExperience} XP total
            </span>
          </div>
        </div>
        <button
          onClick={handleAddSession}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-colors shadow-lg"
        >
          <Plus className="size-4 mr-2" />
          New Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions List */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 max-h-[800px] overflow-y-auto">
            <div className="p-4 bg-indigo-800/30 border-b border-gray-700">
              <h3 className="font-semibold text-white">Campaign Sessions</h3>
            </div>
            {sessions.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Calendar className="size-12 mx-auto mb-4 text-gray-500" />
                <p>No sessions recorded yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-700/50 ${
                      selectedSession?.id === session.id ? "bg-gray-700" : ""
                    }`}
                  >
                    <h4 className="font-semibold text-white mb-2">{session.title}</h4>
                    <div className="text-sm text-gray-300 mb-2">{new Date(session.date).toLocaleDateString()}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center">
                        <Clock className="size-3 mr-1" />
                        {session.duration}h
                      </span>
                      <span className="flex items-center">
                        <Users className="size-3 mr-1" />
                        {session.participants.length}
                      </span>
                      <span className="flex items-center">
                        <FileText className="size-3 mr-1" />
                        {session.experienceAwarded} XP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Session Detail */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            {selectedSession ? (
              <div>
                {editingSession && editingSession.id === selectedSession.id ? (
                  // Edit Mode
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Edit Session</h2>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveSession}
                          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          <Save className="size-4 mr-2" />
                          Save
                        </button>
                        <button
                          onClick={() => setEditingSession(null)}
                          className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                          <X className="size-4 mr-2" />
                          Cancel
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            value={editingSession.title}
                            onChange={(e) => setEditingSession({ ...editingSession, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                          <input
                            type="date"
                            value={editingSession.date}
                            onChange={(e) => setEditingSession({ ...editingSession, date: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
                          <input
                            type="number"
                            step="0.5"
                            value={editingSession.duration}
                            onChange={(e) =>
                              setEditingSession({ ...editingSession, duration: parseFloat(e.target.value) || 0 })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Experience Awarded</label>
                          <input
                            type="number"
                            value={editingSession.experienceAwarded}
                            onChange={(e) =>
                              setEditingSession({ ...editingSession, experienceAwarded: parseInt(e.target.value) || 0 })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Participants (one per line)
                        </label>
                        <textarea
                          value={editingSession.participants.join("\\n")}
                          onChange={(e) =>
                            setEditingSession({
                              ...editingSession,
                              participants: e.target.value.split("\\n").filter((p) => p.trim()),
                            })
                          }
                          rows={3}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Session Summary</label>
                        <textarea
                          value={editingSession.summary}
                          onChange={(e) => setEditingSession({ ...editingSession, summary: e.target.value })}
                          rows={4}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Key Events (one per line)
                        </label>
                        <textarea
                          value={editingSession.keyEvents.join("\\n")}
                          onChange={(e) =>
                            setEditingSession({
                              ...editingSession,
                              keyEvents: e.target.value.split("\\n").filter((e) => e.trim()),
                            })
                          }
                          rows={4}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Treasure Found (one per line)
                        </label>
                        <textarea
                          value={editingSession.treasureFound.join("\\n")}
                          onChange={(e) =>
                            setEditingSession({
                              ...editingSession,
                              treasureFound: e.target.value.split("\\n").filter((t) => t.trim()),
                            })
                          }
                          rows={3}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Next Session Plans</label>
                        <textarea
                          value={editingSession.nextSessionPlans}
                          onChange={(e) => setEditingSession({ ...editingSession, nextSessionPlans: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">{selectedSession.title}</h2>
                          <div className="text-indigo-100">
                            {new Date(selectedSession.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditSession(selectedSession)}
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                          >
                            <Edit3 className="size-4" />
                          </button>
                          <div className="text-right">
                            <div className="text-sm text-indigo-100">Duration</div>
                            <div className="font-bold">{selectedSession.duration} hours</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Session Stats */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-800/30 rounded-lg p-4 text-center border border-blue-700">
                          <Users className="size-6 mx-auto mb-2 text-blue-400" />
                          <div className="text-2xl font-bold text-blue-400">{selectedSession.participants.length}</div>
                          <div className="text-sm text-gray-300">Players</div>
                        </div>
                        <div className="bg-yellow-800/30 rounded-lg p-4 text-center border border-yellow-700">
                          <FileText className="size-6 mx-auto mb-2 text-yellow-400" />
                          <div className="text-2xl font-bold text-yellow-400">{selectedSession.experienceAwarded}</div>
                          <div className="text-sm text-gray-300">Experience</div>
                        </div>
                        <div className="bg-green-800/30 rounded-lg p-4 text-center border border-green-700">
                          <Clock className="size-6 mx-auto mb-2 text-green-400" />
                          <div className="text-2xl font-bold text-green-400">{selectedSession.duration}</div>
                          <div className="text-sm text-gray-300">Hours</div>
                        </div>
                      </div>

                      {/* Participants */}
                      <div>
                        <h3 className="font-semibold text-white mb-3">Participants</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedSession.participants.map((participant, index) => (
                            <span key={index} className="bg-blue-700 text-blue-200 px-3 py-1 rounded-full text-sm">
                              {participant}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Summary */}
                      <div>
                        <h3 className="font-semibold text-white mb-3">Session Summary</h3>
                        <p className="text-gray-300 leading-relaxed">{selectedSession.summary}</p>
                      </div>

                      {/* Key Events */}
                      {selectedSession.keyEvents.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-white mb-3">Key Events</h3>
                          <ul className="space-y-2">
                            {selectedSession.keyEvents.map((event, index) => (
                              <li key={index} className="flex items-start">
                                <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                                <span className="text-gray-300">{event}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Treasure */}
                      {selectedSession.treasureFound.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-white mb-3">Treasure Found</h3>
                          <div className="bg-yellow-800/30 border border-yellow-700 rounded-lg p-4">
                            <ul className="space-y-1">
                              {selectedSession.treasureFound.map((treasure, index) => (
                                <li key={index} className="text-yellow-300">
                                  • {treasure}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Next Session Plans */}
                      {selectedSession.nextSessionPlans && (
                        <div>
                          <h3 className="font-semibold text-white mb-3">Next Session Plans</h3>
                          <div className="bg-green-800/30 border border-green-700 rounded-lg p-4">
                            <p className="text-green-300">{selectedSession.nextSessionPlans}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-400">
                <Calendar className="size-16 mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-semibold text-white mb-2">No Session Selected</h3>
                <p className="text-gray-300">Select a session from the list to view its details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
