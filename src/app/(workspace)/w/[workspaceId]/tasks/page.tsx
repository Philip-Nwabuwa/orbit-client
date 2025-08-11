"use client";

import React, { useEffect, useState } from "react";
import { TaskBoardWithDetails } from "@/components/Tasks/TaskBoard";
import { WeeklyTaskBoard } from "@/components/Tasks/WeeklyTaskBoard";
import { DailyTaskBoard } from "@/components/Tasks/DailyTaskBoard";
import { useNavigationStore } from "@/store/navigationStore";
import { Button } from "@/components/ui/button";

type TaskView = "kanban" | "weekly" | "daily";

export default function TasksPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  // Next 15 server params come as a promise in this template
  const [resolvedParams, setResolvedParams] = useState<{
    workspaceId: string;
  } | null>(null);
  const [currentView, setCurrentView] = useState<TaskView>("kanban");

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

  const filters = { workspaceId };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        {/* Task View Switcher */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900 mr-4">Tasks</h2>
            <div className="flex items-center bg-gray-100 rounded-lg p-1 text-sm">
              <Button
                variant={currentView === "kanban" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView("kanban")}
                className="h-7"
              >
                Kanban
              </Button>
              <Button
                variant={currentView === "weekly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView("weekly")}
                className="h-7"
              >
                Weekly
              </Button>
              <Button
                variant={currentView === "daily" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView("daily")}
                className="h-7"
              >
                Daily
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {currentView === "kanban" && (
            <TaskBoardWithDetails filters={filters} />
          )}
          {currentView === "weekly" && (
            <WeeklyTaskBoard filters={filters} />
          )}
          {currentView === "daily" && (
            <DailyTaskBoard filters={filters} />
          )}
        </div>
      </div>
    </div>
  );
}
