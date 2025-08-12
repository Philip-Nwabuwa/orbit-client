"use client";

import { useEffect, useMemo, useState } from "react";
import { useMessageStore } from "@/store/messageStore";
import Link from "next/link";
import { Mail, Hash, UserCircle2, Clock, Filter } from "lucide-react";

type InboxRow = {
  id: string;
  preview: string;
  source: "Channel" | "Direct Message";
  channelId?: string;
  dmUserId?: string;
  time: string;
};

export default function InboxPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { messages } = useMessageStore();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"all" | "channels" | "dms">("all");

  useEffect(() => {
    let mounted = true;
    params.then((p) => mounted && setWorkspaceId(p.workspaceId));
    return () => {
      mounted = false;
    };
  }, [params]);

  const rows: InboxRow[] = useMemo(() => {
    return messages
      .filter((m) => (workspaceId ? m.workspaceId === workspaceId : true))
      .filter((m) =>
        scope === "channels"
          ? !!m.channelId
          : scope === "dms"
          ? !!m.dmUserId
          : true
      )
      .map((m) => ({
        id: m.id,
        preview: m.message || (m.isVoiceMessage ? "Voice message" : ""),
        source: m.channelId ? "Channel" : "Direct Message",
        channelId: m.channelId,
        dmUserId: m.dmUserId,
        time: m.time,
      }))
      .filter((r) => r.preview.toLowerCase().includes(query.toLowerCase()))
      .slice()
      .reverse();
  }, [messages, workspaceId, query, scope]);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b p-4">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Mail className="size-4" /> Inbox
        </h1>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search inbox..."
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">View:</span>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as any)}
              className="rounded-md border px-2 py-1 text-sm"
            >
              <option value="all">All</option>
              <option value="channels">Channels</option>
              <option value="dms">DMs</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {rows.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            Nothing here
          </div>
        ) : (
          <ul className="divide-y">
            {rows.map((row) => (
              <li
                key={row.id}
                className="flex items-center gap-3 p-4 hover:bg-gray-50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-white">
                  {row.source === "Channel" ? (
                    <Hash className="size-4 text-gray-600" />
                  ) : (
                    <UserCircle2 className="size-4 text-gray-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700">
                      {row.source}
                    </span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500">
                      {row.channelId || row.dmUserId}
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="size-3" /> {row.time}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-gray-800">
                    {row.preview}
                  </p>
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
                      Open
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
