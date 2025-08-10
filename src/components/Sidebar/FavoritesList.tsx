"use client";

import { ChevronDown } from "lucide-react";
import { useChannelStore } from "@/store/channelStore";
import ChannelListItem from "./ChannelListItem";
import { useDirectMessagesStore } from "@/store/directMessagesStore";
import DirectMessageItem from "./DirectMessageItem";
import { useState } from "react";
import { cn } from "@/lib/utils";

type FavoriteItem = {
  type: "channel" | "directMessage";
  data: any;
  name: string;
  favoritedAt?: Date;
};

export default function FavoritesList() {
  const { channels, getChannelHierarchy } = useChannelStore();
  const { directMessages } = useDirectMessagesStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Get all favorite channels (both parent and child channels that are favorited)
  const allFavoriteChannels = channels.filter((channel) => channel.isFavorite);
  const favoriteDirectMessages = directMessages.filter((dm) => dm.isFavorite);

  // Combine and sort favorites like a stack (most recently favorited first)
  const combinedFavorites: FavoriteItem[] = [
    ...allFavoriteChannels.map((channel) => ({
      type: "channel" as const,
      data: channel,
      name: channel.name,
      favoritedAt: channel.favoritedAt,
    })),
    ...favoriteDirectMessages.map((dm) => ({
      type: "directMessage" as const,
      data: dm,
      name: dm.userName,
      favoritedAt: dm.favoritedAt,
    })),
  ].sort((a, b) => {
    // Sort by favoritedAt timestamp (most recent first)
    const aTime = a.favoritedAt?.getTime() || 0;
    const bTime = b.favoritedAt?.getTime() || 0;
    return bTime - aTime;
  });

  if (combinedFavorites.length === 0) {
    return null;
  }

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
          <h4 className="text-sm font-medium text-gray-700">Favorites</h4>
          <span className="text-xs text-gray-400">
            ({combinedFavorites.length})
          </span>
        </div>
      </div>
      <div
        className={cn(
          "space-y-2 transition-all duration-300 ease-in-out overflow-hidden",
          isCollapsed ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"
        )}
      >
        {combinedFavorites.map((item) =>
          item.type === "channel" ? (
            <ChannelListItem
              key={`channel-${item.data.id}`}
              channel={item.data}
              nestingLevel={0}
            />
          ) : (
            <DirectMessageItem
              key={`dm-${item.data.id}`}
              directMessage={item.data}
            />
          )
        )}
      </div>
    </div>
  );
}
