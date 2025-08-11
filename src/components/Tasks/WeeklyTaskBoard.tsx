"use client";

import React, { useMemo, useCallback, useState } from "react";
import {
  useTaskStore,
  type WeeklyTaskStatus,
  type WeeklyTaskItem,
  type TaskPriority,
} from "@/store/taskStore";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";

export interface WeeklyTaskBoardFilters {
  workspaceId: string;
  channelId?: string | null;
  assigneeName?: string;
}

function WeeklyTaskCard({ 
  task, 
  onClick 
}: { 
  task: WeeklyTaskItem; 
  onClick: () => void; 
}) {
  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow p-3" 
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
            {task.title}
          </h4>
          <Badge className={`text-xs ${priorityColors[task.priority]}`}>
            {task.priority}
          </Badge>
        </div>
        
        {task.description && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          {task.assigneeName && (
            <div className="flex items-center gap-2">
              {task.assigneeAvatarUrl && (
                <img
                  src={task.assigneeAvatarUrl}
                  alt={task.assigneeName}
                  className="w-5 h-5 rounded-full"
                />
              )}
              <span className="text-xs text-gray-600">{task.assigneeName}</span>
            </div>
          )}
          
          {task.tags.length > 0 && (
            <div className="flex gap-1">
              {task.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function WeeklyTaskBoard({ filters }: { filters: WeeklyTaskBoardFilters }) {
  const weeklyTasks = useTaskStore((s) => s.weeklyTasks);
  const moveWeeklyTask = useTaskStore((s) => s.moveWeeklyTask);
  const addWeeklyTask = useTaskStore((s) => s.addWeeklyTask);
  const removeWeeklyTask = useTaskStore((s) => s.removeWeeklyTask);
  
  const [currentWeek, setCurrentWeek] = useState(() => startOfWeek(new Date()));
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState<{
    show: boolean;
    status: WeeklyTaskStatus;
  }>({ show: false, status: "new" });

  const weekStart = startOfWeek(currentWeek);
  const weekEnd = endOfWeek(currentWeek);

  const filtered = useMemo(() => {
    return weeklyTasks.filter((task) => {
      if (task.workspaceId !== filters.workspaceId) return false;
      if (typeof filters.channelId !== "undefined") {
        const normFilter = filters.channelId ?? null;
        if ((task.channelId ?? null) !== normFilter) return false;
      }
      if (filters.assigneeName && task.assigneeName !== filters.assigneeName) return false;
      
      // Week filter
      const taskWeekStart = startOfWeek(task.weekStartDate);
      if (taskWeekStart.getTime() !== weekStart.getTime()) return false;
      
      // Search filter
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        const haystack = `${task.title} ${task.description ?? ""} ${task.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(searchLower)) return false;
      }
      
      return true;
    });
  }, [weeklyTasks, filters, weekStart, search]);

  const columns = useMemo(() => {
    const col: Record<WeeklyTaskStatus, WeeklyTaskItem[]> = {
      new: [],
      ongoing: [],
      completed: [],
    };
    
    filtered.forEach((task) => col[task.status].push(task));
    
    // Sort by priority (high -> medium -> low)
    const priorityOrder: Record<TaskPriority, number> = {
      high: 0,
      medium: 1,
      low: 2,
    };
    
    Object.values(col).forEach((tasks) => {
      tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    });
    
    return col;
  }, [filtered]);

  const onDropCard = useCallback(
    (ev: React.DragEvent<HTMLDivElement>, target: WeeklyTaskStatus) => {
      const taskId = ev.dataTransfer.getData("text/plain");
      if (taskId) {
        moveWeeklyTask(taskId, target);
      }
    },
    [moveWeeklyTask]
  );

  const handleCreateTask = (status: WeeklyTaskStatus, title: string) => {
    if (!title.trim()) return;
    
    addWeeklyTask({
      title: title.trim(),
      status,
      priority: "medium",
      tags: [],
      workspaceId: filters.workspaceId,
      channelId: filters.channelId,
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Tasks</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-gray-700 min-w-[200px] text-center">
                {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button
            onClick={() => setCurrentWeek(startOfWeek(new Date()))}
            variant="outline"
            size="sm"
          >
            Today
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search weekly tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="p-6 h-[calc(100%-120px)] overflow-auto">
        <div className="grid grid-cols-3 gap-6 h-full">
          {([
            ["new", { title: "New Items", color: "bg-blue-500" }],
            ["ongoing", { title: "Ongoing", color: "bg-yellow-500" }],
            ["completed", { title: "Completed", color: "bg-green-500" }],
          ] as const).map(([status, meta]) => (
            <div key={status} className="flex flex-col">
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm h-full">
                {/* Column Header */}
                <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block h-3 w-3 rounded-full ${meta.color}`} />
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-gray-800">
                        {meta.title}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {columns[status].length}
                      </Badge>
                    </div>
                  </div>
                  
                  <CreateTaskButton
                    onCreateTask={(title) => handleCreateTask(status, title)}
                  />
                </div>

                {/* Column Content */}
                <div
                  className="p-3 min-h-[500px] bg-gray-50/50 rounded-b-lg"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onDropCard(e, status)}
                >
                  <div className="space-y-3">
                    {columns[status].map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", task.id);
                        }}
                      >
                        <WeeklyTaskCard
                          task={task}
                          onClick={() => {
                            // TODO: Open task details modal
                            console.log("Open task details:", task.id);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CreateTaskButton({ 
  onCreateTask 
}: { 
  onCreateTask: (title: string) => void;
}) {
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateTask(title);
      setTitle("");
      setShowInput(false);
    }
  };

  if (showInput) {
    return (
      <form onSubmit={handleSubmit} className="flex-1 ml-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          className="h-7 text-xs"
          autoFocus
          onBlur={() => {
            if (!title.trim()) setShowInput(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setTitle("");
              setShowInput(false);
            }
          }}
        />
      </form>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="p-1 h-6 w-6"
      onClick={() => setShowInput(true)}
    >
      <Plus className="h-4 w-4" />
    </Button>
  );
}

export default WeeklyTaskBoard;