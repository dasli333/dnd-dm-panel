import { useState } from "react";
import { Plus, Users, Calendar, Upload, Download, Play } from "lucide-react";
import { mockCampaigns } from "@/lib/services/mockData";
import type { MockCampaign } from "@/types/mockup";

interface CampaignDashboardProps {
  onCampaignSelect: (campaign: MockCampaign) => void;
  currentCampaign: MockCampaign | null;
}

interface CreateCampaignModalProps {
  onClose: () => void;
}

const CreateCampaignModal = ({ onClose }: CreateCampaignModalProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md">
      <h3 className="text-xl font-bold text-white mb-4">Create New Campaign</h3>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          // TODO: Handle form submission
          onClose();
        }}
      >
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-gray-200">
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600"
          >
            Create Campaign
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default function CampaignDashboard({ onCampaignSelect, currentCampaign }: CampaignDashboardProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [campaigns] = useState(mockCampaigns);

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
          Campaign Dashboard
        </h1>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
            <Upload className="size-4 mr-2" />
            Import
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
            <Download className="size-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-colors shadow-lg"
          >
            <Plus className="size-4 mr-2" />
            New Campaign
          </button>
        </div>
      </div>

      {currentCampaign && (
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl p-6 mb-6 border border-cyan-500/20 shadow-2xl">
          <h2 className="text-xl font-bold mb-2">Current Campaign</h2>
          <h3 className="text-2xl font-bold mb-2">{currentCampaign.name}</h3>
          <p className="opacity-90 mb-4">{currentCampaign.description}</p>
          <div className="flex items-center space-x-6 text-sm">
            <span className="flex items-center">
              <Users className="size-4 mr-1" />
              {currentCampaign.players} Players
            </span>
            <span className="flex items-center">
              <Calendar className="size-4 mr-1" />
              {currentCampaign.sessions} Sessions
            </span>
            <span>Level {currentCampaign.level}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-gray-800 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-cyan-500/50 group"
          >
            <div
              className="h-48 bg-cover bg-center rounded-t-xl"
              style={{ backgroundImage: `url(${campaign.thumbnail})` }}
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                {campaign.name}
              </h3>
              <p className="text-gray-300 mb-4 text-sm line-clamp-2">{campaign.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span className="flex items-center">
                  <Users className="size-4 mr-1" />
                  {campaign.players}
                </span>
                <span className="flex items-center">
                  <Calendar className="size-4 mr-1" />
                  {campaign.sessions}
                </span>
                <span>Lv. {campaign.level}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Last played: {new Date(campaign.lastPlayed).toLocaleDateString()}
                </span>
                <button
                  onClick={() => onCampaignSelect(campaign)}
                  className="flex items-center px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md hover:from-cyan-600 hover:to-blue-600 transition-colors text-sm shadow-lg"
                >
                  <Play className="size-4 mr-1" />
                  Select
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && <CreateCampaignModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
}
