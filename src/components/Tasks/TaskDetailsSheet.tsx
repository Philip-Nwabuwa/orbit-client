"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { TaskItem, TaskPriority, TaskStatus } from "@/store/taskStore";
import { useTaskStore } from "@/store/taskStore";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function TaskDetailsSheet({
  task,
  open,
  onOpenChange,
}: {
  task: TaskItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const updateTask = useTaskStore((s) => s.updateTask);
  if (!task) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg">
        <SheetHeader className="pb-0">
          <SheetTitle className="text-lg">{task.title}</SheetTitle>
          <SheetDescription>
            {task.description || "No description"}
          </SheetDescription>
        </SheetHeader>
        <div className="p-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <p className="text-sm font-medium capitalize">{task.status}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Priority</p>
              <p className="text-sm font-medium capitalize">{task.priority}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Assignee</p>
              <div className="flex items-center gap-2 mt-1">
                {task.assigneeAvatarUrl && (
                  <img
                    src={task.assigneeAvatarUrl}
                    alt={task.assigneeName || "Assignee"}
                    className="h-6 w-6 rounded-full"
                  />
                )}
                <span className="text-sm text-gray-700">
                  {task.assigneeName || "Unassigned"}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Tags</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {task.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600"
                  >
                    {t}
                  </span>
                ))}
                {task.tags.length === 0 && (
                  <span className="text-xs text-gray-400">No tags</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700">
                Change Status
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {(
                  ["todo", "inProgress", "reviewing", "done"] as TaskStatus[]
                ).map((s) => (
                  <DropdownMenuItem
                    key={s}
                    className="capitalize"
                    onClick={() => updateTask(task.id, { status: s })}
                  >
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700">
                Change Priority
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {(["low", "medium", "high"] as TaskPriority[]).map((p) => (
                  <DropdownMenuItem
                    key={p}
                    className="capitalize"
                    onClick={() => updateTask(task.id, { priority: p })}
                  >
                    {p}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
