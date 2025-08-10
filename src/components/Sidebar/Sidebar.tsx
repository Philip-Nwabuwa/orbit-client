"use client";

import ChannelList from "./ChannelList";
import ChannelSearch from "./ChannelSearch";
import DirectMessagesList from "./DirectMessagesList";
import FavoritesList from "./FavoritesList";
import Logo from "./Logo";
import SidebarItemComponent, { SidebarItem } from "./SidebarItemComponent";
import { useNavigationSync } from "@/hooks/useNavigationSync";
import {
  Sparkles,
  File,
  BookMarked,
  Mail,
  MessageSquareMore,
} from "lucide-react";

const sidebarItems: SidebarItem[] = [
  { icon: Sparkles, label: "Assistant" },
  { icon: File, label: "Drafts" },
  { icon: BookMarked, label: "Saved Items" },
  { icon: Mail, label: "Inbox", unreadCount: 100 },
  { icon: MessageSquareMore, label: "Direct Messages", unreadCount: 5 },
];

export default function Sidebar() {
  useNavigationSync();

  return (
    <div className="bg-gray-100 flex h-full w-64 flex-col px-3 py-4">
      <div className="flex items-center justify-between gap-2 p-1 mb-3">
        <Logo />
        <ChannelSearch />
      </div>

      <div className="flex flex-col gap-1">
        {sidebarItems.map((item, index) => (
          <SidebarItemComponent key={index} item={item} />
        ))}
      </div>

      <div className="flex flex-col gap-6 mt-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <FavoritesList />
        <ChannelList />
        <DirectMessagesList />
      </div>
    </div>
  );
}
