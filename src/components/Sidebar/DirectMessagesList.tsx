"use client";

import { ChevronDown, Plus } from "lucide-react";
import { useDirectMessagesStore } from "@/store/directMessagesStore";
import DirectMessageItem from "./DirectMessageItem";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export default function DirectMessagesList() {
  const { directMessages, initializeDirectMessages } = useDirectMessagesStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (directMessages.length === 0) {
      initializeDirectMessages();
    }
  }, [directMessages.length, initializeDirectMessages]);

  const nonFavoriteDirectMessages = useMemo(() => {
    return directMessages
      .filter((dm) => !dm.isFavorite)
      .sort(
        (a, b) => Number(Boolean(b.isOnline)) - Number(Boolean(a.isOnline))
      );
  }, [directMessages]);

  return (
    <div>
      <div
        className={cn(
          "flex items-center justify-between gap-2 mb-4",
          isCollapsed && "mb-0"
        )}
      >
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded px-1 py-0.5 -mx-1 transition-colors"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronDown
            className={cn(
              "size-4 text-gray-500 transition-transform duration-200",
              isCollapsed && "rotate-[-90deg]"
            )}
          />
          <h4 className="text-sm font-medium text-gray-700">Direct Messages</h4>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400">
              ({nonFavoriteDirectMessages.length})
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Plus className="size-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
        </div>
      </div>
      <div
        className={cn(
          "space-y-2 transition-all duration-300 ease-in-out overflow-hidden",
          isCollapsed ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"
        )}
      >
        {nonFavoriteDirectMessages.map((dm) => (
          <DirectMessageItem key={dm.id} directMessage={dm} />
        ))}
      </div>
    </div>
  );
}
