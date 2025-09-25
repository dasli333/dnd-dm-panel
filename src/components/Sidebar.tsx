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
        ? "bg-blue-500 text-white"
        : disabled
          ? "text-gray-400 cursor-not-allowed"
          : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    <item.icon className="size-5 mr-3" />
    <span className="font-medium">{item.label}</span>
    {disabled && <span className="ml-auto text-xs">(Select Campaign)</span>}
  </button>
);

export default function Sidebar({ currentPage, onNavigate, currentCampaign, onLogout }: SidebarProps) {
  return (
    <div className="bg-white h-screen w-64 shadow-lg flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">DM Panel</h1>
        {currentCampaign && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">Current Campaign:</p>
            <p className="font-medium text-blue-600 truncate">{currentCampaign.name}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Global Features</h2>
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
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center">
            Campaign Features
            {!currentCampaign && <ChevronRight className="size-4 ml-2 text-gray-400" />}
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

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <LogOut className="size-5 mr-3" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
