import React, { useState } from "react";
import InfoPanel from "./InfoPanel";
import LinkedThreads from "./LinkedThreads";
import MembersList from "./MemberList";
import PinsPanel from "./PinsPanel";
import FilesPanel from "./FilesPanel";
import LinksPanel from "./LinksPanel";

interface ChannelSettingsPaneProps {
  channelId: string;
  workspaceId: string;
}

export default function ChannelSettingsPane({ channelId, workspaceId }: ChannelSettingsPaneProps) {
  const [activeTab, setActiveTab] = useState("info");

  const tabs = [
    { id: "info", label: "Info" },
    { id: "pins", label: "Pins" },
    { id: "files", label: "Files" },
    { id: "links", label: "Links" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <div className="space-y-8">
            <InfoPanel channelId={channelId} workspaceId={workspaceId} />
            <LinkedThreads channelId={channelId} workspaceId={workspaceId} />
            <MembersList channelId={channelId} workspaceId={workspaceId} />
          </div>
        );
      case "pins":
        return <PinsPanel channelId={channelId} workspaceId={workspaceId} />;
      case "files":
        return <FilesPanel channelId={channelId} workspaceId={workspaceId} />;
      case "links":
        return <LinksPanel channelId={channelId} workspaceId={workspaceId} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-[350px] bg-white border-l border-gray-200 h-full overflow-y-auto">
      {/* Tab Navigation */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 pt-4 pb-2">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">{renderContent()}</div>
    </div>
  );
}
