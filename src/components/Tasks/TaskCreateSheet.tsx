"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  type TaskPriority,
  type TaskStatus,
  useTaskStore,
} from "@/store/taskStore";

export default function TaskCreateSheet({
  open,
  onOpenChange,
  workspaceId,
  channelId,
  initialStatus = "todo",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  channelId?: string | null;
  initialStatus?: TaskStatus;
}) {
  const addTask = useTaskStore((s) => s.addTask);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [assigneeName, setAssigneeName] = useState("");
  const [dueDate, setDueDate] = useState<string>("");
  const [tagsText, setTagsText] = useState("");

  useEffect(() => {
    if (open) {
      setStatus(initialStatus);
    }
  }, [open, initialStatus]);

  const canSave = useMemo(() => title.trim().length > 0, [title]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      assigneeName: assigneeName.trim() || undefined,
      tags,
      workspaceId,
      channelId: channelId ?? null,
      dueAt: dueDate ? new Date(dueDate) : undefined,
    });
    onOpenChange(false);
    // reset fields for next use
    setTitle("");
    setDescription("");
    setPriority("medium");
    setAssigneeName("");
    setDueDate("");
    setTagsText("");
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg">
        <SheetHeader className="pb-0">
          <SheetTitle className="text-lg">Add Task</SheetTitle>
          <SheetDescription>Fill in the details and save.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 min-h-[80px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 capitalize"
              >
                <option value="todo">To do</option>
                <option value="inProgress">Doing</option>
                <option value="reviewing">Reviewing</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 capitalize"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Assignee
              </label>
              <input
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                placeholder="Assignee name"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Due date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Tags</label>
            <input
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="Comma separated (e.g., Internal, Urgent)"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSave}
              className="rounded-md bg-indigo-600 text-white px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Create Task
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
