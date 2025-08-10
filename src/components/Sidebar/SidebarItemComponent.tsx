import type { ComponentType } from "react";
import { BadgeCount } from "@/components/ui/count";

interface SidebarItem {
  icon: ComponentType<{ className?: string }>;
  label: string;
  unreadCount?: number;
}

export default function SidebarItemComponent({ item }: { item: SidebarItem }) {
  const Icon = item.icon;

  return (
    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition-colors">
      <Icon className="size-4 text-gray-600" />
      <p className="text-xs font-semibold text-gray-700">{item.label}</p>
      <div className="ml-auto">
        <BadgeCount count={item.unreadCount || 0} />
      </div>
    </div>
  );
}

export type { SidebarItem };
