import { create } from "zustand";

export type TaskStatus = "todo" | "inProgress" | "reviewing" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeName?: string;
  assigneeAvatarUrl?: string;
  tags: string[];
  workspaceId: string;
  channelId?: string | null;
  createdAt: Date;
  dueAt?: Date;
  attachmentsCount?: number;
  commentsCount?: number;
  subtasksDone?: number;
  subtasksTotal?: number;
}

interface TaskState {
  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, "id" | "createdAt"> & { id?: string }) => void;
  updateTask: (taskId: string, updates: Partial<TaskItem>) => void;
  moveTask: (taskId: string, status: TaskStatus) => void;
  removeTask: (taskId: string) => void;
}

const DEFAULT_WORKSPACE_ID = "yrgGdg234j";

const initialTasks: TaskItem[] = [
  {
    id: "t-1",
    title: "Q3 Evaluation",
    description: "Q3 team and product evaluation",
    status: "inProgress",
    priority: "high",
    assigneeName: "Daniel Anderson",
    assigneeAvatarUrl: "/avatar1.jpg",
    tags: ["Internal", "Urgent"],
    workspaceId: DEFAULT_WORKSPACE_ID,
    channelId: "6",
    createdAt: new Date(),
    dueAt: new Date("2025-01-10T00:00:00Z"),
    attachmentsCount: 1,
    commentsCount: 2,
    subtasksDone: 2,
    subtasksTotal: 2,
  },
  {
    id: "t-2",
    title: "Monthly report",
    description: "Monthly team and individual reports",
    status: "todo",
    priority: "medium",
    assigneeName: "William Johnson",
    assigneeAvatarUrl: "/avatar3.jpg",
    tags: ["Internal", "Lead"],
    workspaceId: DEFAULT_WORKSPACE_ID,
    channelId: "6",
    createdAt: new Date(),
    dueAt: new Date("2025-01-11T00:00:00Z"),
    attachmentsCount: 0,
    commentsCount: 1,
    subtasksDone: 0,
    subtasksTotal: 0,
  },
  {
    id: "t-3",
    title: "Preparation of Q2 report",
    description: "Making monthly reports",
    status: "inProgress",
    priority: "high",
    assigneeName: "Emily Davis",
    assigneeAvatarUrl: "/avatar5.jpg",
    tags: ["Internal"],
    workspaceId: DEFAULT_WORKSPACE_ID,
    channelId: "6",
    createdAt: new Date(),
    dueAt: new Date("2025-01-12T00:00:00Z"),
    attachmentsCount: 0,
    commentsCount: 4,
    subtasksDone: 0,
    subtasksTotal: 0,
  },
  {
    id: "t-4",
    title: "Digital Marketing",
    description: "Marketing campaign for the month of Rama…",
    status: "done",
    priority: "low",
    assigneeName: "Andrew Miller",
    assigneeAvatarUrl: "/avatar2.jpg",
    tags: ["Internal", "Lead"],
    workspaceId: DEFAULT_WORKSPACE_ID,
    channelId: "6",
    createdAt: new Date(),
    dueAt: new Date("2025-01-10T00:00:00Z"),
    attachmentsCount: 0,
    commentsCount: 1,
    subtasksDone: 0,
    subtasksTotal: 0,
  },
  {
    id: "t-5",
    title: "Factory Visit",
    description: "Jakarta factory visit",
    status: "todo",
    priority: "low",
    assigneeName: "William Johnson",
    assigneeAvatarUrl: "/avatar3.jpg",
    tags: ["Lead"],
    workspaceId: DEFAULT_WORKSPACE_ID,
    channelId: "6",
    createdAt: new Date(),
    dueAt: new Date("2025-01-11T00:00:00Z"),
    commentsCount: 1,
    attachmentsCount: 0,
    subtasksDone: 4,
    subtasksTotal: 12,
  },
  {
    id: "t-6",
    title: "Print Brochures",
    description: "Print the latest marketing brochures",
    status: "todo",
    priority: "low",
    assigneeName: "Emily Davis",
    assigneeAvatarUrl: "/avatar5.jpg",
    tags: ["Lead"],
    workspaceId: DEFAULT_WORKSPACE_ID,
    channelId: "6",
    createdAt: new Date(),
    dueAt: new Date("2025-01-11T00:00:00Z"),
    commentsCount: 0,
    attachmentsCount: 0,
  },
  {
    id: "t-7",
    title: "March product exhibition",
    description: "Preparation for the March product exhibition",
    status: "inProgress",
    priority: "medium",
    assigneeName: "Andrew Miller",
    assigneeAvatarUrl: "/avatar2.jpg",
    tags: ["Urgent"],
    workspaceId: DEFAULT_WORKSPACE_ID,
    channelId: "6",
    createdAt: new Date(),
    dueAt: new Date("2025-01-12T00:00:00Z"),
    commentsCount: 1,
  },
  {
    id: "t-8",
    title: "Event 3.3",
    description: "Preparation for event 3.3",
    status: "done",
    priority: "medium",
    assigneeName: "Daniel Anderson",
    assigneeAvatarUrl: "/avatar1.jpg",
    tags: ["Urgent"],
    workspaceId: DEFAULT_WORKSPACE_ID,
    channelId: "6",
    createdAt: new Date(),
    dueAt: new Date("2025-01-10T00:00:00Z"),
    commentsCount: 0,
  },
  {
    id: "t-9",
    title: "New Product Development",
    description: "Preparation for new product launch Q2",
    status: "done",
    priority: "low",
    assigneeName: "Emily Davis",
    assigneeAvatarUrl: "/avatar5.jpg",
    tags: ["Lead"],
    workspaceId: DEFAULT_WORKSPACE_ID,
    channelId: "6",
    createdAt: new Date(),
    dueAt: new Date("2025-01-10T00:00:00Z"),
    commentsCount: 3,
    subtasksDone: 4,
    subtasksTotal: 12,
  },
];

export const useTaskStore = create<TaskState>((set) => ({
  tasks: initialTasks,

  addTask: (taskInput) =>
    set((state) => {
      const newTask: TaskItem = {
        id: taskInput.id ?? `t-${Date.now()}`,
        createdAt: new Date(),
        description: taskInput.description,
        title: taskInput.title,
        status: taskInput.status,
        priority: taskInput.priority,
        assigneeName: taskInput.assigneeName,
        assigneeAvatarUrl: taskInput.assigneeAvatarUrl,
        tags: taskInput.tags ?? [],
        workspaceId: taskInput.workspaceId,
        channelId: taskInput.channelId ?? null,
        dueAt: taskInput.dueAt,
      };
      return { tasks: [newTask, ...state.tasks] };
    }),

  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, ...updates } : t
      ),
    })),

  moveTask: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
    })),

  removeTask: (taskId) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) })),
}));
