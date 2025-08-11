"use client";

import React, { useMemo, useCallback, useState, useEffect } from "react";
import {
  useTaskStore,
  type TaskStatus,
  type TaskItem,
  type TaskPriority,
} from "@/store/taskStore";
import TaskCard from "./TaskCard";
import { useNavigationStore } from "@/store/navigationStore";
import TaskDetailsSheet from "./TaskDetailsSheet";
import TaskCreateSheet from "./TaskCreateSheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface TaskBoardFilters {
  workspaceId: string;
  channelId?: string | null;
  assigneeName?: string;
  search?: string;
}

export function TaskBoard({ filters }: { filters: TaskBoardFilters }) {
  const tasks = useTaskStore((s) => s.tasks);
  const moveTask = useTaskStore((s) => s.moveTask);
  const addTask = useTaskStore((s) => s.addTask);
  useNavigationStore();
  const [search, setSearch] = useState("");
  const [statusView, setStatusView] = useState<"all" | TaskStatus>("all");
  const [sortBy, setSortBy] = useState<"dueAt" | "priority" | "title">("dueAt");
  const [filtersUI, setFiltersUI] = useState<{
    assignee?: string;
    priority?: TaskPriority | "all";
    tag?: string;
  }>({ priority: "all" });

  const filtered = useMemo(() => {
    const combinedSearch = (filters.search ?? search).trim();
    const lowerSearch = combinedSearch
      ? combinedSearch.toLowerCase()
      : undefined;
    return tasks.filter((t) => {
      if (t.workspaceId !== filters.workspaceId) return false;
      if (typeof filters.channelId !== "undefined") {
        const normFilter = filters.channelId ?? null;
        if ((t.channelId ?? null) !== normFilter) return false;
      }
      if (filters.assigneeName && t.assigneeName !== filters.assigneeName)
        return false;
      if (filtersUI.assignee && t.assigneeName !== filtersUI.assignee)
        return false;
      if (
        filtersUI.priority &&
        filtersUI.priority !== "all" &&
        t.priority !== filtersUI.priority
      )
        return false;
      if (filtersUI.tag && !t.tags.includes(filtersUI.tag)) return false;
      if (lowerSearch) {
        const hay = `${t.title} ${t.description ?? ""} ${t.tags.join(
          " "
        )}`.toLowerCase();
        if (!hay.includes(lowerSearch)) return false;
      }
      return true;
    });
  }, [
    tasks,
    filters.workspaceId,
    filters.channelId,
    filters.assigneeName,
    filters.search,
    search,
    filtersUI.assignee,
    filtersUI.priority,
    filtersUI.tag,
  ]);

  const columns = useMemo(() => {
    const col: Record<TaskStatus, TaskItem[]> = {
      todo: [],
      inProgress: [],
      reviewing: [],
      done: [],
    };
    const sortFn = (a: TaskItem, b: TaskItem) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "priority") {
        const order: Record<TaskPriority, number> = {
          low: 2,
          medium: 1,
          high: 0,
        };
        return order[a.priority] - order[b.priority];
      }
      // dueAt default; nulls last
      const aD = a.dueAt ? new Date(a.dueAt).getTime() : Infinity;
      const bD = b.dueAt ? new Date(b.dueAt).getTime() : Infinity;
      return aD - bD;
    };
    filtered.forEach((t) => col[t.status].push(t));
    (Object.keys(col) as TaskStatus[]).forEach((k) => col[k].sort(sortFn));
    return col;
  }, [filtered, sortBy]);

  const onDropCard = useCallback(
    (ev: React.DragEvent<HTMLDivElement>, target: TaskStatus) => {
      const taskId = ev.dataTransfer.getData("text/plain");
      if (taskId) {
        moveTask(taskId, target);
      }
    },
    [moveTask]
  );

  const onDragOver = useCallback((ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
  }, []);

  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const openTask = filtered.find((t) => t.id === openTaskId) || null;
  const [showCreate, setShowCreate] = useState<{
    open: boolean;
    status: TaskStatus;
  }>({ open: false, status: "todo" });

  const header = (
    <div className="p-4 border-b border-gray-200 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">Task</h3>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <button className="font-medium text-gray-900">Kanban</button>
            <span className="text-gray-300">|</span>
            <button className="hover:text-gray-900">List</button>
            <span className="text-gray-300">|</span>
            <button className="hover:text-gray-900">Table</button>
          </div>
        </div>
        <button
          className="rounded-md bg-indigo-600 text-white px-3 py-1.5 text-sm"
          onClick={() => setShowCreate({ open: true, status: "todo" })}
        >
          + Add Task
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              className="rounded-md border border-gray-200 pl-8 pr-3 py-1.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Search task..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg
              className="absolute left-2.5 top-2 h-4 w-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.65 13.65z"
              />
            </svg>
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg p-1 text-xs text-gray-700">
            {(
              [
                ["all", "All Tasks"],
                ["todo", "To do"],
                ["inProgress", "Doing"],
                ["done", "Done"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setStatusView(key as any)}
                className={`px-2 py-1 rounded-md ${
                  statusView === (key as any)
                    ? "bg-white shadow-sm text-gray-900"
                    : ""
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700">
              Sort by
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("dueAt")}>
                Due date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("priority")}>
                Priority
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("title")}>
                Title
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700">
              Filter
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => setFiltersUI((f) => ({ ...f, priority: "all" }))}
              >
                All priorities
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setFiltersUI((f) => ({ ...f, priority: "high" }))
                }
              >
                High
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setFiltersUI((f) => ({ ...f, priority: "medium" }))
                }
              >
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFiltersUI((f) => ({ ...f, priority: "low" }))}
              >
                Low
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700">
            Import/Export
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {header}
      <div className="p-6 h-[calc(100%-80px)] overflow-auto">
        <div className="grid grid-cols-4 gap-4 h-full">
          {(
            [
              ["todo", { title: "To do", color: "bg-gray-100" }],
              ["inProgress", { title: "Doing", color: "bg-blue-100" }],
              ["reviewing", { title: "Reviewing", color: "bg-yellow-100" }],
              ["done", { title: "Done", color: "bg-green-100" }],
            ] as const
          ).map(([key, meta]) => (
            <div
              key={key}
              className={`${
                statusView !== "all" && statusView !== (key as any)
                  ? "hidden"
                  : "flex"
              } flex-col`}
            >
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${
                        key === "todo"
                          ? "bg-orange-500"
                          : key === "inProgress"
                          ? "bg-blue-500"
                          : key === "reviewing"
                          ? "bg-amber-500"
                          : "bg-green-500"
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-gray-800">
                          {meta.title}
                        </h4>
                        <span className="text-[10px] text-gray-500">
                          {columns[key].length} Tasks
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="p-1 hover:bg-gray-100 rounded"
                    aria-label={`Add ${meta.title} task`}
                    onClick={() =>
                      setShowCreate({ open: true, status: key as TaskStatus })
                    }
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
                <div
                  className="bg-gray-50 rounded-b-lg p-2 min-h-[400px]"
                  onDragOver={onDragOver}
                  onDrop={(e) => onDropCard(e, key as TaskStatus)}
                >
                  <div className="space-y-2">
                    {columns[key].map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", task.id);
                        }}
                        onClick={() => setOpenTaskId(task.id)}
                      >
                        <TaskCard task={task} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Create sheet mounted here */}
      <TaskCreateSheet
        open={showCreate.open}
        onOpenChange={(o) => setShowCreate((s) => ({ ...s, open: o }))}
        workspaceId={filters.workspaceId}
        channelId={filters.channelId ?? null}
        initialStatus={showCreate.status}
      />
    </div>
  );
}

// Details sheet mounted at root of board for simplicity
function TaskBoardWithSheet(props: { filters: TaskBoardFilters }) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const tasks = useTaskStore((s) => s.tasks);
  const task = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) || null,
    [tasks, selectedTaskId]
  );

  return (
    <div className="relative h-full">
      <TaskBoardInner {...props} onOpenTask={setSelectedTaskId} />
      <TaskDetailsSheet
        task={task}
        open={Boolean(task)}
        onOpenChange={(o) => !o && setSelectedTaskId(null)}
      />
    </div>
  );
}

function TaskBoardInner(props: {
  filters: TaskBoardFilters;
  onOpenTask: (taskId: string) => void;
}) {
  const { filters, onOpenTask } = props;
  const tasks = useTaskStore((s) => s.tasks);
  const moveTask = useTaskStore((s) => s.moveTask);
  useNavigationStore();
  const [search, setSearch] = useState("");
  const [statusView, setStatusView] = useState<"all" | TaskStatus>("all");
  const [showCreate, setShowCreate] = useState<{
    open: boolean;
    status: TaskStatus;
  }>({ open: false, status: "todo" });

  const filtered = useMemo(() => {
    const combinedSearch = (filters.search ?? search).trim();
    const lowerSearch = combinedSearch
      ? combinedSearch.toLowerCase()
      : undefined;
    return tasks.filter((t) => {
      if (t.workspaceId !== filters.workspaceId) return false;
      if (typeof filters.channelId !== "undefined") {
        const normFilter = filters.channelId ?? null;
        if ((t.channelId ?? null) !== normFilter) return false;
      }
      if (filters.assigneeName && t.assigneeName !== filters.assigneeName)
        return false;
      if (lowerSearch) {
        const hay = `${t.title} ${t.description ?? ""} ${t.tags.join(
          " "
        )}`.toLowerCase();
        if (!hay.includes(lowerSearch)) return false;
      }
      return true;
    });
  }, [
    tasks,
    filters.workspaceId,
    filters.channelId,
    filters.assigneeName,
    filters.search,
    search,
  ]);

  const columns = useMemo(() => {
    const col: Record<TaskStatus, TaskItem[]> = {
      todo: [],
      inProgress: [],
      reviewing: [],
      done: [],
    };
    filtered.forEach((t) => col[t.status].push(t));
    return col;
  }, [filtered]);

  const onDropCard = useCallback(
    (ev: React.DragEvent<HTMLDivElement>, target: TaskStatus) => {
      const taskId = ev.dataTransfer.getData("text/plain");
      if (taskId) moveTask(taskId, target);
    },
    [moveTask]
  );

  const onDragOver = useCallback((ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">Task</h3>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <button className="font-medium text-gray-900">Kanban</button>
              <span className="text-gray-300">|</span>
              <button className="hover:text-gray-900">List</button>
              <span className="text-gray-300">|</span>
              <button className="hover:text-gray-900">Table</button>
            </div>
          </div>
          <button 
            className="rounded-md bg-indigo-600 text-white px-3 py-1.5 text-sm"
            onClick={() => setShowCreate({ open: true, status: "todo" })}
          >
            + Add Task
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                className="rounded-md border border-gray-200 pl-8 pr-3 py-1.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="Search task..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg
                className="absolute left-2.5 top-2 h-4 w-4 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.65 13.65z"
                />
              </svg>
            </div>
            <div className="flex items-center bg-gray-100 rounded-lg p-1 text-xs text-gray-700">
              {(["all", "todo", "inProgress", "done"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setStatusView(k as any)}
                  className={`px-2 py-1 rounded-md ${
                    statusView === (k as any)
                      ? "bg-white shadow-sm text-gray-900"
                      : ""
                  }`}
                >
                  {k === "all"
                    ? "All Tasks"
                    : k === "todo"
                    ? "To do"
                    : k === "inProgress"
                    ? "Doing"
                    : "Done"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700">
              Sort by
            </button>
            <button className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700">
              Filter
            </button>
            <button className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700">
              Import/Export
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 h-[calc(100%-80px)] overflow-auto">
        <div className="grid grid-cols-4 gap-4 h-full">
          {(
            [
              ["todo", { title: "To do" }],
              ["inProgress", { title: "Doing" }],
              ["reviewing", { title: "Reviewing" }],
              ["done", { title: "Done" }],
            ] as const
          ).map(([key, meta]) => (
            <div
              key={key}
              className={`${
                statusView !== "all" && statusView !== (key as any)
                  ? "hidden"
                  : "flex"
              } flex-col`}
            >
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${
                        key === "todo"
                          ? "bg-orange-500"
                          : key === "inProgress"
                          ? "bg-blue-500"
                          : key === "reviewing"
                          ? "bg-amber-500"
                          : "bg-purple-500"
                      }`}
                    />
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-gray-800">
                        {meta.title}
                      </h4>
                      <span className="text-[10px] text-gray-500">
                        {columns[key].length} Tasks
                      </span>
                    </div>
                  </div>
                  <button
                    className="p-1 hover:bg-gray-100 rounded"
                    aria-label={`Add ${meta.title} task`}
                    onClick={() =>
                      setShowCreate({ open: true, status: key as TaskStatus })
                    }
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
                <div
                  className="bg-gray-50 rounded-b-lg p-2 min-h-[400px]"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onDropCard(e, key as TaskStatus)}
                >
                  <div className="space-y-2">
                    {columns[key].map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", task.id);
                        }}
                        onClick={() => onOpenTask(task.id)}
                      >
                        <TaskCard task={task} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Create task sheet */}
      <TaskCreateSheet
        open={showCreate.open}
        onOpenChange={(o) => setShowCreate((s) => ({ ...s, open: o }))}
        workspaceId={filters.workspaceId}
        channelId={filters.channelId ?? null}
        initialStatus={showCreate.status}
      />
    </div>
  );
}

export default TaskBoard;
export { TaskBoardWithSheet as TaskBoardWithDetails };
