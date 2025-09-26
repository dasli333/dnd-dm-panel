import {
  Home,
  Package,
  Sparkles,
  Skull,
  Users,
  BookOpen,
  Calendar,
  HelpCircle,
  Sword,
  LogOut,
  ChevronRight,
} from "lucide-react";
import type { MockCampaign } from "@/types/mockup";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentCampaign: MockCampaign | null;
  onLogout: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const globalFeatures: MenuItem[] = [
  { id: "dashboard", label: "Campaign Dashboard", icon: Home },
  { id: "items", label: "Items & Marketplace", icon: Package },
  { id: "spells", label: "Spells Database", icon: Sparkles },
  { id: "monsters", label: "Monsters & Enemies", icon: Skull },
];

const campaignFeatures: MenuItem[] = [
  { id: "characters", label: "Character Sheets", icon: Users },
  { id: "notes", label: "Story & World Notes", icon: BookOpen },
  { id: "sessions", label: "Session Journal", icon: Calendar },
  { id: "dm-helper", label: "DM Session Helper", icon: HelpCircle },
  { id: "combat", label: "Combat Tracker", icon: Sword },
];

interface MenuItemComponentProps {
  item: MenuItem;
  isActive: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const MenuItemComponent = ({ item, isActive, disabled = false, onClick }: MenuItemComponentProps) => (
  <button
    onClick={() => !disabled && onClick()}
    disabled={disabled}
    className={`w-full flex items-center px-4 py-3 text-left transition-colors rounded-lg mb-1 ${
      isActive
        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
        : disabled
          ? "text-gray-500 cursor-not-allowed"
          : "text-gray-300 hover:bg-gray-700/50"
    }`}
  >
    <item.icon className="size-5 mr-3" />
    <span className="font-medium">{item.label}</span>
    {disabled && <span className="ml-auto text-xs text-gray-500">(Select Campaign)</span>}
  </button>
);

export default function Sidebar({ currentPage, onNavigate, currentCampaign, onLogout }: SidebarProps) {
  return (
    <div className="bg-gray-800 h-screen w-64 shadow-2xl flex flex-col border-r border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">DM Panel</h1>
        {currentCampaign && (
          <div className="mt-2">
            <p className="text-sm text-gray-400">Current Campaign:</p>
            <p className="font-medium text-cyan-300 truncate">{currentCampaign.name}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Global Features</h2>
          {globalFeatures.map((item) => (
            <MenuItemComponent
              key={item.id}
              item={item}
              isActive={currentPage === item.id}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </div>

        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center">
            Campaign Features
            {!currentCampaign && <ChevronRight className="size-4 ml-2 text-gray-500" />}
          </h2>
          {campaignFeatures.map((item) => (
            <MenuItemComponent
              key={item.id}
              item={item}
              isActive={currentPage === item.id}
              disabled={!currentCampaign}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-red-900/30 hover:text-red-400 rounded-lg transition-colors"
        >
          <LogOut className="size-5 mr-3" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
