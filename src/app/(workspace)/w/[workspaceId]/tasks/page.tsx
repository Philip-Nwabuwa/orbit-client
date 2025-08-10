"use client";

import React, { useEffect, useState } from "react";
import { TaskBoardWithDetails } from "@/components/Tasks/TaskBoard";
import { useNavigationStore } from "@/store/navigationStore";

export default function TasksPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  // Next 15 server params come as a promise in this template
  const [resolvedParams, setResolvedParams] = useState<{
    workspaceId: string;
  } | null>(null);

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

  const workspaceId =
    resolvedParams?.workspaceId || useNavigationStore.getState().workspaceId;

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1">
        <TaskBoardWithDetails filters={{ workspaceId }} />
      </div>
    </div>
  );
}
