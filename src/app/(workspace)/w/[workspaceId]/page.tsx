"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useChannelStore } from "@/store/channelStore";

export default function WorkspacePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const router = useRouter();
  const { channels, initializeChannels } = useChannelStore();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const didRedirectRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const p = await params;
      if (isMounted) setWorkspaceId(p.workspaceId);
    })();
    return () => {
      isMounted = false;
    };
  }, [params]);

  useEffect(() => {
    initializeChannels();
  }, [initializeChannels]);

  useEffect(() => {
    if (didRedirectRef.current) return;
    if (!workspaceId) return;
    if (!channels || channels.length === 0) return;

    const generalChannel =
      channels.find((c) => c.name.toLowerCase() === "general") || channels[0];
    if (generalChannel) {
      didRedirectRef.current = true;
      router.replace(`/w/${workspaceId}/c/${generalChannel.id}`);
    }
  }, [workspaceId, channels, router]);

  return (
    <div className="flex h-screen items-center justify-center text-gray-500">
      Redirecting to General…
    </div>
  );
}

export interface WorkspacePageProps {
  params: Promise<{ workspaceId: string }>;
}
