import { useState, useEffect } from "react";
import { auth, campaigns } from "@/lib/services/storage";
import Sidebar from "@/components/Sidebar";
import CampaignDashboard from "@/components/dashboard/CampaignDashboard";
import ItemsMarketplace from "@/components/global/ItemsMarketplace";
import SpellsDatabase from "@/components/global/SpellsDatabase";
import MonstersDatabase from "@/components/global/MonstersDatabase";
import CharacterSheets from "@/components/campaign/CharacterSheets";
import StoryNotes from "@/components/campaign/StoryNotes";
import SessionJournal from "@/components/campaign/SessionJournal";
import DMSessionHelper from "@/components/campaign/DMSessionHelper";
import CombatTracker from "@/components/campaign/CombatTracker";
import type { MockUser, MockCampaign } from "@/types/mockup";

export default function DMPanelApp() {
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [currentCampaign, setCurrentCampaign] = useState<MockCampaign | null>(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const user = auth.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      const campaign = campaigns.getCurrent();
      setCurrentCampaign(campaign);
    } else {
      // Redirect to login if not authenticated
      window.location.href = "/login";
      return;
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    auth.logout();
    setCurrentUser(null);
    setCurrentCampaign(null);
    window.location.href = "/login";
  };

  const handleCampaignSelect = (campaign: MockCampaign) => {
    campaigns.setCurrent(campaign);
    setCurrentCampaign(campaign);
    setCurrentPage("characters"); // Navigate to first campaign-specific page
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <CampaignDashboard onCampaignSelect={handleCampaignSelect} currentCampaign={currentCampaign} />;
      case "items":
        return <ItemsMarketplace />;
      case "spells":
        return <SpellsDatabase />;
      case "monsters":
        return <MonstersDatabase />;
      case "characters":
        return <CharacterSheets />;
      case "notes":
        return <StoryNotes />;
      case "sessions":
        return <SessionJournal />;
      case "dm-helper":
        return <DMSessionHelper />;
      case "combat":
        return <CombatTracker />;
      default:
        return <CampaignDashboard onCampaignSelect={handleCampaignSelect} currentCampaign={currentCampaign} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full size-32 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currentCampaign={currentCampaign}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto">{renderCurrentPage()}</main>
    </div>
  );
}
