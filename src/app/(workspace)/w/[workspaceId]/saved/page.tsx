"use client";

import { useEffect, useMemo, useState } from "react";
import { useSavedStore } from "@/store/savedStore";
import type { SavedItem } from "@/store/savedStore";
import { useMessageStore } from "@/store/messageStore";
import type { MessageItemModel } from "@/store/messageStore";
import Link from "next/link";
import { Bookmark, Clock, Hash, UserCircle2, X } from "lucide-react";

export default function SavedItemsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { getSavedForWorkspace, removeSaved } = useSavedStore();
  const { messages } = useMessageStore();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    params.then((p) => mounted && setWorkspaceId(p.workspaceId));
    return () => {
      mounted = false;
    };
  }, [params]);

  type SavedRow = SavedItem & { message?: MessageItemModel };
  const saved: SavedRow[] = useMemo(() => {
    if (!workspaceId) return [] as SavedRow[];
    const items = getSavedForWorkspace(workspaceId);
    return items
      .map((i) => ({
        ...i,
        message: messages.find((m) => m.id === i.messageId),
      }))
      .filter((row) => row.message)
      .filter(
        (row) =>
          row.message!.message.toLowerCase().includes(query.toLowerCase()) ||
          (row.channelId?.toLowerCase().includes(query.toLowerCase()) ??
            false) ||
          (row.dmUserId?.toLowerCase().includes(query.toLowerCase()) ?? false)
      );
  }, [workspaceId, getSavedForWorkspace, messages, query]);

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
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Bookmark className="size-4" /> Saved Items
        </h1>
        <p className="text-sm text-gray-500">
          Your saved messages in this workspace.
        </p>
        <div className="mt-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search saved..."
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {saved.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            No saved items
          </div>
        ) : (
          <ul className="divide-y">
            {saved.map((row) => (
              <li
                key={row.messageId}
                className="flex items-center gap-3 p-4 hover:bg-gray-50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-white">
                  {row.channelId ? (
                    <Hash className="size-4 text-gray-600" />
                  ) : (
                    <UserCircle2 className="size-4 text-gray-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700">
                      {row.channelId ? "Channel" : "Direct Message"}
                    </span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500">
                      {row.channelId ? row.channelId : row.dmUserId}
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="size-3" /> {formatTime(row.savedAt)}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-gray-800">
                    {row.message!.message}
                  </p>
                  {row.message?.name && (
                    <p className="text-xs text-gray-500">
                      by {row.message.name}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {workspaceId && (
                    <Link
                      href={
                        row.channelId
                          ? `/w/${workspaceId}/c/${row.channelId}`
                          : `/w/${workspaceId}/d/${row.dmUserId}`
                      }
                      className="inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs hover:bg-gray-100"
                    >
                      View
                    </Link>
                  )}
                  <button
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs text-red-600 hover:bg-red-50"
                    onClick={() => removeSaved(row.messageId)}
                  >
                    <X className="size-3" /> Remove
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
