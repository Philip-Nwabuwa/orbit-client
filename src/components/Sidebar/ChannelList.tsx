"use client";

import React from "react";
import { ChevronDown, Plus } from "lucide-react";
import { useChannelStore } from "@/store/channelStore";
import ChannelListItem from "./ChannelListItem";
import AddChannelModal from "./AddChannelModal";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ChannelList() {
  const { channels, initializeChannels, getChannelHierarchy } =
    useChannelStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAddChannelModalOpen, setIsAddChannelModalOpen] = useState(false);

  useEffect(() => {
    if (channels.length === 0) {
      initializeChannels();
    }
  }, [channels.length, initializeChannels]);

  // Get hierarchical channels (top-level channels with their children)
  const hierarchicalChannels = getChannelHierarchy();
  const nonFavoriteChannels = hierarchicalChannels.filter(
    (channel) => !channel.isFavorite
  );

  // Recursive function to render channels and their children
  const renderChannelWithChildren = (
    channel: any,
    nestingLevel = 0
  ): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];

    // Render the parent channel
    elements.push(
      <ChannelListItem
        key={channel.id}
        channel={channel}
        nestingLevel={nestingLevel}
      />
    );

    // Always render children (no collapse functionality)
    if (channel.children && channel.children.length > 0) {
      channel.children.forEach((child: any) => {
        elements.push(...renderChannelWithChildren(child, nestingLevel + 1));
      });
    }

    return elements;
  };

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
          />{" "}
          <h4 className="text-sm font-medium text-gray-700">Channels</h4>
          <span className="text-xs text-gray-400">
            ({nonFavoriteChannels.length})
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Plus 
            className="size-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" 
            onClick={() => setIsAddChannelModalOpen(true)}
          />
        </div>
      </div>
      <div
        className={cn(
          "space-y-2 transition-all duration-300 ease-in-out overflow-hidden",
          isCollapsed ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"
        )}
      >
        {nonFavoriteChannels.flatMap((channel) =>
          renderChannelWithChildren(channel, 0)
        )}
      </div>
      
      <AddChannelModal 
        open={isAddChannelModalOpen} 
        onOpenChange={setIsAddChannelModalOpen} 
      />
    </div>
  );
}
