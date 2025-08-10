"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useNavigationStore } from "@/store/navigationStore";

export function useNavigationSync() {
  const pathname = usePathname();
  const {
    setActiveChannel,
    setActiveDirectMessage,
    setWorkspaceId,
    clearActive,
  } = useNavigationStore();

  useEffect(() => {
    // Parse the current pathname to determine active state
    const pathParts = pathname.split("/");

    if (pathParts.length >= 4 && pathParts[1] === "w") {
      const workspaceId = pathParts[2];
      const type = pathParts[3];
      const id = pathParts[4];

      // Update workspace ID
      setWorkspaceId(workspaceId);

      if (type === "c" && id) {
        // Channel route: /w/[workspaceId]/c/[channelId]
        setActiveChannel(id);
      } else if (type === "d" && id) {
        // Direct message route: /w/[workspaceId]/d/[userId]
        setActiveDirectMessage(id);
      } else {
        // Workspace home or other routes
        clearActive();
      }
    } else {
      // Not in workspace routes
      clearActive();
    }
  }, [
    pathname,
    setActiveChannel,
    setActiveDirectMessage,
    setWorkspaceId,
    clearActive,
  ]);
}
