import { useChannelStore } from "@/store/channelStore";
import { useMemo } from "react";
import { Bookmark, Ellipsis, Hash, Info, Lock, Sparkles } from "lucide-react";

interface ChannelHeaderProps {
  onToggleSettings: () => void;
  channelId: string;
  workspaceId: string;
}

export default function ChannelHeader({
  onToggleSettings,
  channelId,
}: ChannelHeaderProps) {
  const { channels } = useChannelStore();

  // Get current channel info and build breadcrumb path
  const channelInfo = useMemo(() => {
    const channel = channels.find((ch) => ch.id === channelId);
    if (!channel)
      return {
        name: "Unknown Channel",
        breadcrumbs: [],
        type: "public" as const,
      };

    // Build breadcrumb path by traversing up the hierarchy
    const breadcrumbs: string[] = [];
    let current: typeof channel | undefined = channel;

    while (current) {
      breadcrumbs.unshift(current.name);
      if (current.parentId) {
        current = channels.find((ch) => ch.id === current?.parentId);
      } else {
        current = undefined;
      }
    }

    return {
      name: channel.name,
      description: channel.description,
      icon: channel.icon,
      type: channel.type,
      breadcrumbs,
    };
  }, [channelId, channels]);

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <span className="text-gray-500">
          {channelInfo.type === "private" ? (
            <Lock className="w-4 h-4" />
          ) : (
            <Hash className="w-4 h-4" />
          )}
        </span>
        <nav className="flex items-center space-x-2 text-sm">
          {channelInfo.breadcrumbs.map((segment, index) => (
            <span key={index} className="flex items-center space-x-2">
              {index > 0 && <span className="text-gray-400">/</span>}
              <span className="text-gray-700">{segment}</span>
            </span>
          ))}
        </nav>
        <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
          <Bookmark className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 rounded cursor-pointer">
          <Ellipsis className="w-5 h-5 text-gray-400" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded cursor-pointer">
          <Sparkles className="w-5 h-5 text-gray-400" />
        </button>
        <button
          className="p-2 hover:bg-gray-100 rounded cursor-pointer"
          onClick={onToggleSettings}
        >
          <Info className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
