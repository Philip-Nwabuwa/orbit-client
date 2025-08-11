"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DockItem from "./DockItem";
import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImage from "@/assets/images/hero.jpeg";

export default function AppDock() {
  const pathname = usePathname();
  const activeWorkspaceId = (() => {
    // Match /w/<workspaceId>
    const match = pathname.match(/^\/w\/([^/]+)/);
    return match ? match[1] : undefined;
  })();

  // TODO: Replace with real workspaces from API/store
  const dockItems = [
    { id: "yrgGdg234j", label: "Workspace 1", imageSrc: placeholderImage },
  ];

  return (
    <aside aria-label="Application Dock" className="h-full w-16">
      <div className="h-screen flex flex-col items-start justify-between">
        <div className="flex flex-col items-center gap-2 my-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {dockItems.map((item) => {
            const isActive = activeWorkspaceId === item.id;
            return (
              <div key={item.id} className="flex items-center gap-2">
                {isActive ? (
                  <div className="h-8 w-[3px] rounded-br-full rounded-tr-full bg-black/90" />
                ) : (
                  <div className="h-8 w-[3px] rounded-br-full rounded-tr-full bg-transparent" />
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/w/${item.id}`} prefetch>
                      <DockItem
                        label={item.label}
                        imageSrc={item.imageSrc.src}
                        active={isActive}
                      />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              </div>
            );
          })}

          <Tooltip>
            <TooltipTrigger asChild>
              <DockItem label="New" className="bg-gray-100 ml-2.5">
                <Plus className="h-6 w-6 text-black/80" />
              </DockItem>
            </TooltipTrigger>
            <TooltipContent side="right">New</TooltipContent>
          </Tooltip>
        </div>

        <div className="ml-2.5 my-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Profile"
                className="grid place-items-center rounded-full shadow-sm backdrop-blur transition-transform duration-200 ease-out hover:scale-[1.05] active:scale-95"
              >
                <Avatar className="size-10">
                  <AvatarImage src={placeholderImage.src} alt="User" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Profile</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </aside>
  );
}
