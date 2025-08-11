import { create } from "zustand";

export type TaskStatus = "todo" | "inProgress" | "reviewing" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type TaskType = "standard" | "weekly" | "daily";
export type WeeklyTaskStatus = "new" | "ongoing" | "completed";

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  type?: TaskType;
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

export interface WeeklyTaskItem {
  id: string;
  title: string;
  description?: string;
  status: WeeklyTaskStatus;
  priority: TaskPriority;
  assigneeName?: string;
  assigneeAvatarUrl?: string;
  tags: string[];
  workspaceId: string;
  channelId?: string | null;
  createdAt: Date;
  weekStartDate: Date;
  weekEndDate: Date;
}

export interface DailyTaskItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  assigneeName?: string;
  assigneeAvatarUrl?: string;
  tags: string[];
  workspaceId: string;
  channelId?: string | null;
  createdAt: Date;
  scheduledDate: Date;
  estimatedMinutes?: number;
}

interface TaskState {
  tasks: TaskItem[];
  weeklyTasks: WeeklyTaskItem[];
  dailyTasks: DailyTaskItem[];
  addTask: (task: Omit<TaskItem, "id" | "createdAt"> & { id?: string }) => void;
  updateTask: (taskId: string, updates: Partial<TaskItem>) => void;
  moveTask: (taskId: string, status: TaskStatus) => void;
  removeTask: (taskId: string) => void;
  addWeeklyTask: (task: Omit<WeeklyTaskItem, "id" | "createdAt"> & { id?: string }) => void;
  updateWeeklyTask: (taskId: string, updates: Partial<WeeklyTaskItem>) => void;
  moveWeeklyTask: (taskId: string, status: WeeklyTaskStatus) => void;
  removeWeeklyTask: (taskId: string) => void;
  addDailyTask: (task: Omit<DailyTaskItem, "id" | "createdAt"> & { id?: string }) => void;
  updateDailyTask: (taskId: string, updates: Partial<DailyTaskItem>) => void;
  toggleDailyTask: (taskId: string) => void;
  removeDailyTask: (taskId: string) => void;
  getDailyTasksForDate: (date: Date) => DailyTaskItem[];
  getWeeklyTasksForWeek: (startDate: Date) => WeeklyTaskItem[];
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
    assigneeAvatarUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=778&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    assigneeAvatarUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    assigneeAvatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    assigneeAvatarUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    assigneeAvatarUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    assigneeAvatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    assigneeAvatarUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    assigneeAvatarUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=778&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    assigneeAvatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: initialTasks,
  weeklyTasks: [],
  dailyTasks: [],

  addTask: (taskInput) =>
    set((state) => {
      const newTask: TaskItem = {
        id: taskInput.id ?? `t-${Date.now()}`,
        createdAt: new Date(),
        description: taskInput.description,
        title: taskInput.title,
        status: taskInput.status,
        priority: taskInput.priority,
        type: taskInput.type ?? "standard",
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

  addWeeklyTask: (taskInput) =>
    set((state) => {
      const newTask: WeeklyTaskItem = {
        id: taskInput.id ?? `wt-${Date.now()}`,
        createdAt: new Date(),
        title: taskInput.title,
        description: taskInput.description,
        status: taskInput.status,
        priority: taskInput.priority,
        assigneeName: taskInput.assigneeName,
        assigneeAvatarUrl: taskInput.assigneeAvatarUrl,
        tags: taskInput.tags ?? [],
        workspaceId: taskInput.workspaceId,
        channelId: taskInput.channelId ?? null,
        weekStartDate: taskInput.weekStartDate,
        weekEndDate: taskInput.weekEndDate,
      };
      return { weeklyTasks: [newTask, ...state.weeklyTasks] };
    }),

  updateWeeklyTask: (taskId, updates) =>
    set((state) => ({
      weeklyTasks: state.weeklyTasks.map((t) =>
        t.id === taskId ? { ...t, ...updates } : t
      ),
    })),

  moveWeeklyTask: (taskId, status) =>
    set((state) => ({
      weeklyTasks: state.weeklyTasks.map((t) => 
        t.id === taskId ? { ...t, status } : t
      ),
    })),

  removeWeeklyTask: (taskId) =>
    set((state) => ({ 
      weeklyTasks: state.weeklyTasks.filter((t) => t.id !== taskId) 
    })),

  addDailyTask: (taskInput) =>
    set((state) => {
      const newTask: DailyTaskItem = {
        id: taskInput.id ?? `dt-${Date.now()}`,
        createdAt: new Date(),
        title: taskInput.title,
        description: taskInput.description,
        completed: taskInput.completed ?? false,
        priority: taskInput.priority,
        assigneeName: taskInput.assigneeName,
        assigneeAvatarUrl: taskInput.assigneeAvatarUrl,
        tags: taskInput.tags ?? [],
        workspaceId: taskInput.workspaceId,
        channelId: taskInput.channelId ?? null,
        scheduledDate: taskInput.scheduledDate,
        estimatedMinutes: taskInput.estimatedMinutes,
      };
      return { dailyTasks: [newTask, ...state.dailyTasks] };
    }),

  updateDailyTask: (taskId, updates) =>
    set((state) => ({
      dailyTasks: state.dailyTasks.map((t) =>
        t.id === taskId ? { ...t, ...updates } : t
      ),
    })),

  toggleDailyTask: (taskId) =>
    set((state) => ({
      dailyTasks: state.dailyTasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ),
    })),

  removeDailyTask: (taskId) =>
    set((state) => ({ 
      dailyTasks: state.dailyTasks.filter((t) => t.id !== taskId) 
    })),

  getDailyTasksForDate: (date: Date) => {
    const state = get();
    const targetDateStr = date.toDateString();
    return state.dailyTasks.filter(
      (task) => task.scheduledDate.toDateString() === targetDateStr
    );
  },

  getWeeklyTasksForWeek: (startDate: Date) => {
    const state = get();
    const startTime = startDate.getTime();
    const endTime = startTime + 7 * 24 * 60 * 60 * 1000;
    
    return state.weeklyTasks.filter((task) => {
      const taskStart = task.weekStartDate.getTime();
      return taskStart >= startTime && taskStart < endTime;
    });
  },
}));
