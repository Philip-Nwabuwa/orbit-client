import { Hash, Lock, PencilLine, Users } from "lucide-react";
import { useChannelStore } from "@/store/channelStore";
import { useNavigationStore } from "@/store/navigationStore";
import { BadgeCount } from "@/components/ui/count";
import ItemActions, {
  createChannelActions,
} from "@/components/ui/item-actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { makeConversationKey, useDraftStore } from "@/store/draftStore";

interface Channel {
  id: string;
  name: string;
  type: "public" | "private" | "direct";
  members: string[];
  unreadCount: number;
  icon?: string;
  description?: string;
  isActive?: boolean;
  isFavorite?: boolean;
  parentId?: string;
  children?: Channel[];
}

interface ChannelListItemProps {
  channel: Channel;
  nestingLevel?: number;
}

export default function ChannelListItem({
  channel,
  nestingLevel = 0,
}: ChannelListItemProps) {
  const { toggleFavorite } = useChannelStore();
  const { activeType, activeId, workspaceId, setActiveChannel } =
    useNavigationStore();
  const { hasDraft } = useDraftStore();
  const router = useRouter();
  const isActive = activeType === "channel" && activeId === channel.id;
  const draftKey = makeConversationKey(workspaceId, channel.id);
  const showDraft = hasDraft(draftKey);

  const getChannelIcon = () => {
    if (channel.icon) return channel.icon;
    return channel.type === "private" ? "🔒" : "#";
  };

  const handleChannelClick = () => {
    setActiveChannel(channel.id);
    router.push(`/w/${workspaceId}/c/${channel.id}`);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(channel.id);
  };

  const handleChannelSettings = () => {
    console.log(`Opening settings for channel: ${channel.name}`);
    // TODO: Implement channel settings modal
  };

  const handleLeaveChannel = () => {
    console.log(`Leaving channel: ${channel.name}`);
    // TODO: Implement leave channel functionality
  };

  const actions = createChannelActions(
    !!channel.isFavorite,
    handleToggleFavorite,
    handleChannelSettings,
    channel.type !== "public" ? handleLeaveChannel : undefined
  );

  // Calculate indentation based on nesting level
  const indentationPx = nestingLevel * 16; // 16px per level

  return (
    <div
      className={cn(
        "group flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1 rounded-md transition-colors",
        isActive && "bg-blue-50"
      )}
      style={{ paddingLeft: `${4 + indentationPx}px` }}
      onClick={handleChannelClick}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-fit py-0.5 px-2.5 bg-white rounded-md shadow-sm">
          <span className="text-md">{getChannelIcon()}</span>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <h4
            className={cn(
              "text-xs truncate",
              isActive && "font-medium text-blue-700"
            )}
          >
            {channel.name}
          </h4>
          {channel.description && (
            <p className="text-xs text-gray-500 truncate">
              {channel.description}
            </p>
          )}
        </div>
        {channel.type === "private" && (
          <Lock className="size-3 text-gray-400 flex-shrink-0 mr-2" />
        )}
      </div>
      <div className="flex items-center gap-1">
        <BadgeCount count={channel.unreadCount} />
        {showDraft && (
          <span className="px-1.5 py-0.5 text-[10px] rounded text-yellow-800">
            <PencilLine className="size-3" />
          </span>
        )}
        <ItemActions actions={actions} className="ml-1" />
      </div>
    </div>
  );
}
