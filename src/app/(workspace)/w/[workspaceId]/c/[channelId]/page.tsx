"use client";

import { useState } from "react";
import ChannelHeader from "@/components/ChannelView/ChannelHeader";
import ChannelView from "@/components/ChannelView/ChannelView";
import ChannelSettingsPane from "@/components/InfoPanel/ChannelSettingsPane";

export default function ChannelPage({
  params,
}: {
  params: Promise<{ workspaceId: string; channelId: string }>;
}) {
  const [showSettings, setShowSettings] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex flex-col flex-1">
        <ChannelHeader
          onToggleSettings={() => setShowSettings(!showSettings)}
        />
        <ChannelView />
      </div>
      {showSettings && <ChannelSettingsPane />}
    </div>
  );
}
