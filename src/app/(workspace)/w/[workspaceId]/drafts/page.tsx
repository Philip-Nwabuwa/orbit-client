"use client";

import { useMemo, useState } from "react";
import { useDraftStore, makeConversationKey } from "@/store/draftStore";
import { useNavigationStore } from "@/store/navigationStore";
import Link from "next/link";
import {
  X,
  Trash2,
  Send,
  Clock,
  MessageSquare,
  UserCircle2,
} from "lucide-react";

type DraftRow = {
  key: string;
  scope: "Channel" | "Direct Message";
  targetId: string;
  preview: string;
  updatedAt: number;
};

export default function DraftsPage() {
  const { drafts, clearDraft } = useDraftStore();
  const { workspaceId } = useNavigationStore();
  const [query, setQuery] = useState("");

  const rows: DraftRow[] = useMemo(() => {
    return Object.entries(drafts)
      .map(([key, value]) => {
        const isChannel = key.includes("|c:");
        const targetId = key.split(isChannel ? "|c:" : "|dm:")[1];
        return {
          key,
          scope: isChannel ? "Channel" : "Direct Message",
          targetId,
          preview: value.text,
          updatedAt: value.updatedAt,
        } as DraftRow;
      })
      .filter((r) => r.preview.trim().length > 0)
      .filter(
        (r) =>
          r.preview.toLowerCase().includes(query.toLowerCase()) ||
          r.targetId.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [drafts, query]);

  const formatTime = (ts: number) => {
    const diffMs = Date.now() - ts;
    const mins = Math.floor(diffMs / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b p-4">
        <h1 className="text-lg font-semibold">Drafts & Scheduled</h1>
        <p className="text-sm text-gray-500">
          Review and manage your unsent drafts.
        </p>
        <div className="mt-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search drafts..."
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {rows.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            No drafts
          </div>
        ) : (
          <ul className="divide-y">
            {rows.map((row) => (
              <li
                key={row.key}
                className="flex items-center gap-3 p-4 hover:bg-gray-50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-white">
                  {row.scope === "Channel" ? (
                    <MessageSquare className="size-4 text-gray-600" />
                  ) : (
                    <UserCircle2 className="size-4 text-gray-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700">
                      {row.scope}
                    </span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500">
                      {row.targetId}
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="size-3" /> {formatTime(row.updatedAt)}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-gray-800">
                    {row.preview}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={
                      row.scope === "Channel"
                        ? `/w/${workspaceId}/c/${row.targetId}`
                        : `/w/${workspaceId}/d/${row.targetId}`
                    }
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs hover:bg-gray-100"
                  >
                    Edit
                  </Link>
                  <button
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs text-red-600 hover:bg-red-50"
                    onClick={() => clearDraft(row.key)}
                  >
                    <Trash2 className="size-3" /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
