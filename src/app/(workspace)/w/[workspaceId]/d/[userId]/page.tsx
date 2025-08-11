"use client";

import { useState, useEffect } from "react";
import DMHeader from "@/components/DirectMessage/DMHeader";
import DMView from "@/components/DirectMessage/DMView";
import DMInfoPanel from "@/components/DirectMessage/DMInfoPanel";
import { useDirectMessagesStore } from "@/store/directMessagesStore";

export default function DirectMessagePage({
  params,
}: {
  params: Promise<{ workspaceId: string; userId: string }>;
}) {
  const [showSettings, setShowSettings] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{
    workspaceId: string;
    userId: string;
  } | null>(null);

  const { initializeDirectMessages } = useDirectMessagesStore();

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

  // Initialize direct messages when component mounts
  useEffect(() => {
    initializeDirectMessages();
  }, [initializeDirectMessages]);

  if (!resolvedParams) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-gray-500">Loading conversation...</div>
      </div>
    );
  }

  const { workspaceId, userId } = resolvedParams;

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex flex-col flex-1">
        <DMHeader
          onToggleSettings={() => setShowSettings(!showSettings)}
          dmUserId={userId}
          workspaceId={workspaceId}
        />
        <DMView dmUserId={userId} workspaceId={workspaceId} />
      </div>
      {showSettings && <DMInfoPanel dmUserId={userId} workspaceId={workspaceId} />}
    </div>
  );
}
