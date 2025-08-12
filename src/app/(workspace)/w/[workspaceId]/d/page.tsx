"use client";

import { useEffect, useMemo, useState } from "react";
import { useDirectMessagesStore } from "@/store/directMessagesStore";
import Link from "next/link";
import { Search } from "lucide-react";

export default function DirectMessagesLandingPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { directMessages, initializeDirectMessages } = useDirectMessagesStore();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    initializeDirectMessages();
  }, [initializeDirectMessages]);

  useEffect(() => {
    let mounted = true;
    params.then((p) => mounted && setWorkspaceId(p.workspaceId));
    return () => {
      mounted = false;
    };
  }, [params]);

  const rows = useMemo(() => {
    return directMessages
      .filter((dm) => dm.userName.toLowerCase().includes(query.toLowerCase()))
      .sort(
        (a, b) => Number(Boolean(b.isOnline)) - Number(Boolean(a.isOnline))
      );
  }, [directMessages, query]);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b p-4">
        <h1 className="text-lg font-semibold">Direct Messages</h1>
        <div className="mt-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people..."
              className="w-full rounded-md border pl-8 pr-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {rows.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            No conversations
          </div>
        ) : (
          <ul className="divide-y">
            {rows.map((dm) => (
              <li
                key={dm.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        dm.isOnline ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {dm.userName}
                    </span>
                  </div>
                  {dm.lastMessage && (
                    <p className="mt-0.5 text-xs text-gray-500 truncate">
                      {dm.lastMessage}
                    </p>
                  )}
                </div>
                {workspaceId && (
                  <Link
                    href={`/w/${workspaceId}/d/${dm.userId}`}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs hover:bg-gray-100"
                  >
                    Open
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
