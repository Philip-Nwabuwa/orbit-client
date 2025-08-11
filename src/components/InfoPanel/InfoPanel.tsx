"use client";

import { useMemo, useState } from "react";
import TaskBoard from "@/components/Tasks/TaskBoard";
import { useTaskStore } from "@/store/taskStore";
import { useChannelStore } from "@/store/channelStore";
import Image from "next/image";

interface InfoPanelProps {
  channelId: string;
  workspaceId: string;
}

export default function InfoPanel({ channelId, workspaceId }: InfoPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const tags = [
    { name: "Design System", color: "bg-blue-100 text-blue-700" },
    { name: "UI Components", color: "bg-purple-100 text-purple-700" },
    { name: "Frontend", color: "bg-green-100 text-green-700" },
    { name: "React", color: "bg-cyan-100 text-cyan-700" },
    { name: "TypeScript", color: "bg-indigo-100 text-indigo-700" },
    { name: "Tailwind CSS", color: "bg-pink-100 text-pink-700" },
    { name: "Accessibility", color: "bg-yellow-100 text-yellow-700" },
    { name: "Performance", color: "bg-red-100 text-red-700" },
    { name: "Documentation", color: "bg-gray-100 text-gray-700" },
    { name: "Testing", color: "bg-orange-100 text-orange-700" },
    { name: "Mobile First", color: "bg-teal-100 text-teal-700" },
    { name: "Responsive", color: "bg-lime-100 text-lime-700" },
    { name: "Best Practices", color: "bg-violet-100 text-violet-700" },
  ];

  const { channels } = useChannelStore();
  const tasks = useTaskStore((s) => s.tasks);

  // Get current channel info
  const currentChannel = channels.find((ch) => ch.id === channelId);

  const channelTaskCount = useMemo(() => {
    return tasks.filter((t) => {
      if (t.workspaceId !== workspaceId) return false;
      return (t.channelId ?? null) === channelId;
    }).length;
  }, [tasks, workspaceId, channelId]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const taskBoardFilters = useMemo(
    () => ({ workspaceId, channelId }),
    [workspaceId, channelId]
  );

  const infoItems = [
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      label: "Creator",
      value: "Andrew M.",
      hasAvatar: true,
      avatarUrl:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      label: "Date of creation",
      value: "28 May",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      label: "Status",
      value: "Active",
      isStatus: true,
    },
    {
      id: "tags",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      ),
      label: "Tags",
      value: "13",
      hasArrow: true,
      isClickable: true,
    },
    {
      id: "tasks",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
      label: "Tasks",
      value: String(channelTaskCount),
      hasArrow: true,
      isClickable: true,
    },
  ];

  return (
    <div className="relative">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Main info</h2>
      <div className="space-y-3">
        {infoItems.map((item, index) => (
          <div key={index}>
            <div
              className={`flex items-center justify-between py-2 ${
                item.isClickable
                  ? "cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                  : ""
              }`}
              onClick={() =>
                item.isClickable && item.id && toggleSection(item.id)
              }
            >
              <div className="flex items-center space-x-3">
                <span className="text-gray-400">{item.icon}</span>
                <span className="text-gray-600 text-sm">{item.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                {item.hasAvatar && (
                  <Image
                    src={item.avatarUrl}
                    alt={item.value}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                {item.isStatus ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1.5"></span>
                    {item.value}
                  </span>
                ) : (
                  <span className="text-gray-900 text-sm">{item.value}</span>
                )}
                {item.hasArrow && (
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedSection === item.id ? "rotate-90" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Expanded Tags Section */}
            {item.id === "tags" && expandedSection === "tags" && (
              <div className="mt-3 ml-8 animate-in slide-in-from-top-2 duration-200">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${tag.color} cursor-pointer hover:opacity-80 transition-opacity`}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Kanban Board Overlay for Tasks */}
      {expandedSection === "tasks" && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-white/10 backdrop-blur-md z-40 animate-in fade-in duration-200"
            onClick={() => setExpandedSection(null)}
          />

          {/* Kanban Board */}
          <div className="fixed right-0 top-0 h-full w-[1000px] bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-300">
            <button
              onClick={() => setExpandedSection(null)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close tasks"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <TaskBoard filters={taskBoardFilters} />
          </div>
        </>
      )}
    </div>
  );
}
