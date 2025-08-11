"use client";

import React, { useMemo, useState, useCallback } from "react";
import {
  useTaskStore,
  type DailyTaskItem,
  type TaskPriority,
} from "@/store/taskStore";
import { format, addDays, subDays, startOfDay, isToday, isTomorrow, isYesterday } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock,
  Calendar as CalendarIcon,
  Search 
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface DailyTaskBoardFilters {
  workspaceId: string;
  channelId?: string | null;
  assigneeName?: string;
}

function DailyTaskCard({ 
  task, 
  onToggle, 
  onClick 
}: { 
  task: DailyTaskItem; 
  onToggle: () => void;
  onClick: () => void;
}) {
  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer hover:shadow-md transition-all duration-200 border-l-4",
        task.completed 
          ? "bg-gray-50 opacity-75 border-l-gray-400" 
          : "bg-white border-l-blue-500",
        priorityColors[task.priority].split(" ")[2] // Get border color
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={onToggle}
            className="mt-1"
            onClick={(e) => e.stopPropagation()}
          />
          
          <div className="flex-1 min-w-0" onClick={onClick}>
            <div className="flex items-start justify-between mb-2">
              <h4 className={cn(
                "font-medium text-sm text-gray-900 line-clamp-2",
                task.completed && "line-through text-gray-600"
              )}>
                {task.title}
              </h4>
              <Badge 
                className={`text-xs ml-2 ${priorityColors[task.priority]}`}
                variant="outline"
              >
                {task.priority}
              </Badge>
            </div>
            
            {task.description && (
              <p className={cn(
                "text-xs text-gray-600 line-clamp-2 mb-2",
                task.completed && "line-through"
              )}>
                {task.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                {task.estimatedMinutes && (
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{task.estimatedMinutes}m</span>
                  </div>
                )}
                
                {task.assigneeName && (
                  <div className="flex items-center gap-2">
                    {task.assigneeAvatarUrl && (
                      <img
                        src={task.assigneeAvatarUrl}
                        alt={task.assigneeName}
                        className="w-4 h-4 rounded-full"
                      />
                    )}
                    <span className="text-gray-600">{task.assigneeName}</span>
                  </div>
                )}
              </div>
              
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DailyTaskBoard({ filters }: { filters: DailyTaskBoardFilters }) {
  const dailyTasks = useTaskStore((s) => s.dailyTasks);
  const addDailyTask = useTaskStore((s) => s.addDailyTask);
  const toggleDailyTask = useTaskStore((s) => s.toggleDailyTask);
  const removeDailyTask = useTaskStore((s) => s.removeDailyTask);
  
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const targetDateStr = selectedDate.toDateString();
    
    return dailyTasks.filter((task) => {
      if (task.workspaceId !== filters.workspaceId) return false;
      if (typeof filters.channelId !== "undefined") {
        const normFilter = filters.channelId ?? null;
        if ((task.channelId ?? null) !== normFilter) return false;
      }
      if (filters.assigneeName && task.assigneeName !== filters.assigneeName) return false;
      
      // Date filter
      if (task.scheduledDate.toDateString() !== targetDateStr) return false;
      
      // Search filter
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        const haystack = `${task.title} ${task.description ?? ""} ${task.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(searchLower)) return false;
      }
      
      return true;
    });
  }, [dailyTasks, filters, selectedDate, search]);

  const taskStats = useMemo(() => {
    const completed = filtered.filter(t => t.completed).length;
    const total = filtered.length;
    const totalMinutes = filtered.reduce((sum, task) => 
      sum + (task.estimatedMinutes || 0), 0
    );
    
    return { completed, total, totalMinutes };
  }, [filtered]);

  const organizedTasks = useMemo(() => {
    const completed = filtered.filter(t => t.completed);
    const pending = filtered.filter(t => !t.completed);
    
    // Sort pending by priority (high -> medium -> low)
    const priorityOrder: Record<TaskPriority, number> = {
      high: 0,
      medium: 1,
      low: 2,
    };
    
    pending.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    completed.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    return { pending, completed };
  }, [filtered]);

  const handleCreateTask = (title: string) => {
    if (!title.trim()) return;
    
    addDailyTask({
      title: title.trim(),
      completed: false,
      priority: "medium",
      tags: [],
      workspaceId: filters.workspaceId,
      channelId: filters.channelId,
      scheduledDate: selectedDate,
    });
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d, yyyy");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">Daily Tasks</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDate(subDays(selectedDate, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 min-w-[160px] justify-center">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {getDateLabel(selectedDate)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setSelectedDate(startOfDay(new Date()))}
              variant="outline"
              size="sm"
            >
              Today
            </Button>
            <CreateTaskButton onCreateTask={handleCreateTask} />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search daily tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="font-medium">{taskStats.completed}/{taskStats.total}</span>
              <span>completed</span>
            </div>
            {taskStats.totalMinutes > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{Math.floor(taskStats.totalMinutes / 60)}h {taskStats.totalMinutes % 60}m</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {taskStats.total > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.round((taskStats.completed / taskStats.total) * 100)}%` 
              }}
            />
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="p-6 flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <CalendarIcon className="h-12 w-12 mb-3 text-gray-300" />
            <h4 className="text-lg font-medium mb-1">No tasks for {getDateLabel(selectedDate).toLowerCase()}</h4>
            <p className="text-sm text-gray-400 mb-4">Create a new task to get started</p>
            <CreateTaskButton onCreateTask={handleCreateTask} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pending Tasks */}
            {organizedTasks.pending.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="font-semibold text-sm text-gray-900">
                    Pending Tasks
                  </h4>
                  <Badge variant="secondary" className="text-xs">
                    {organizedTasks.pending.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {organizedTasks.pending.map((task) => (
                    <DailyTaskCard
                      key={task.id}
                      task={task}
                      onToggle={() => toggleDailyTask(task.id)}
                      onClick={() => {
                        // TODO: Open task details modal
                        console.log("Open task details:", task.id);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Tasks */}
            {organizedTasks.completed.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="font-semibold text-sm text-gray-900">
                    Completed Tasks
                  </h4>
                  <Badge variant="secondary" className="text-xs">
                    {organizedTasks.completed.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {organizedTasks.completed.map((task) => (
                    <DailyTaskCard
                      key={task.id}
                      task={task}
                      onToggle={() => toggleDailyTask(task.id)}
                      onClick={() => {
                        // TODO: Open task details modal
                        console.log("Open task details:", task.id);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
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
      <form onSubmit={handleSubmit} className="flex-1 max-w-sm">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          className="h-8 text-sm"
          autoFocus
          onBlur={() => {
            setTimeout(() => {
              if (!title.trim()) setShowInput(false);
            }, 150);
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
      variant="default"
      size="sm"
      onClick={() => setShowInput(true)}
      className="gap-2"
    >
      <Plus className="h-4 w-4" />
      Add Task
    </Button>
  );
}

export default DailyTaskBoard;