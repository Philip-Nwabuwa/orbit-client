"use client";

import { useState, useEffect } from "react";
import ChannelHeader from "@/components/ChannelView/ChannelHeader";
import ChannelView from "@/components/ChannelView/ChannelView";
import ChannelSettingsPane from "@/components/InfoPanel/ChannelSettingsPane";
import { useChannelStore } from "@/store/channelStore";

export default function ChannelPage({
  params,
}: {
  params: Promise<{ workspaceId: string; channelId: string }>;
}) {
  const [showSettings, setShowSettings] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{
    workspaceId: string;
    channelId: string;
  } | null>(null);

  const { initializeChannels } = useChannelStore();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const p = await params;
      if (isMounted) setResolvedParams(p);
    })();
    return () => {
      isMounted = false;
    };
  }, [params]);

  // Initialize channels when component mounts
  useEffect(() => {
    initializeChannels();
  }, [initializeChannels]);

  if (!resolvedParams) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-gray-500">Loading channel...</div>
      </div>
    );
  }

  const { workspaceId, channelId } = resolvedParams;

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex flex-col flex-1">
        <ChannelHeader
          onToggleSettings={() => setShowSettings(!showSettings)}
          channelId={channelId}
          workspaceId={workspaceId}
        />
        <ChannelView channelId={channelId} workspaceId={workspaceId} />
      </div>
      {showSettings && <ChannelSettingsPane channelId={channelId} workspaceId={workspaceId} />}
    </div>
  );
}
