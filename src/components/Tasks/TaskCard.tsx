"use client";

import React from "react";
import type { TaskItem, TaskPriority } from "@/store/taskStore";
import { format } from "date-fns";

function getPriorityBorder(priority: TaskPriority) {
  switch (priority) {
    case "high":
      return "border-l-4 border-red-500";
    case "medium":
      return "border-l-4 border-yellow-500";
    case "low":
    default:
      return "border-l-4 border-green-500";
  }
}

export function TaskCard({ task }: { task: TaskItem }) {
  return (
    <div
      className={`bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow ${getPriorityBorder(
        task.priority
      )}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h5 className="text-sm font-semibold text-gray-900 leading-5">
            {task.title}
          </h5>
          {task.description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
              {task.description}
            </p>
          )}
        </div>
        <button
          className="p-1 hover:bg-gray-100 rounded"
          aria-label="More options"
        >
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>

      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {task.tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-gray-600 mt-3">
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {task.dueAt
          ? `Due Date ${format(task.dueAt, "dd MMM yyyy")}`
          : "No due date"}
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex -space-x-2 overflow-hidden">
          {task.assigneeAvatarUrl && (
            <img
              src={task.assigneeAvatarUrl}
              alt={task.assigneeName || "Assignee"}
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
            />
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {typeof task.subtasksDone === "number" &&
            typeof task.subtasksTotal === "number" && (
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7h18M3 12h18M3 17h18"
                  />
                </svg>
                {task.subtasksDone}/{task.subtasksTotal}
              </div>
            )}
          {typeof task.commentsCount === "number" && (
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h8m-8 4h6m2 5l-4-4H7a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v6a4 4 0 01-4 4z"
                />
              </svg>
              {task.commentsCount}
            </div>
          )}
          {typeof task.attachmentsCount === "number" && (
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21.44 11.05l-8.49 8.49a5.5 5.5 0 01-7.78-7.78l8.49-8.49a3.5 3.5 0 015 5l-8.49 8.49a1.5 1.5 0 11-2.12-2.12l7.78-7.78"
                />
              </svg>
              {task.attachmentsCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
