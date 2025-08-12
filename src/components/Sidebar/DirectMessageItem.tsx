"use client";

import Image from "next/image";
import { useDirectMessagesStore } from "@/store/directMessagesStore";
import { useNavigationStore } from "@/store/navigationStore";
import { formatDate } from "@/lib/formatDate";
import { BadgeCount } from "@/components/ui/count";
import ItemActions, {
  createDirectMessageActions,
} from "@/components/ui/item-actions";
import { useRouter } from "next/navigation";
import { makeConversationKey, useDraftStore } from "@/store/draftStore";
import { PencilLine } from "lucide-react";

interface DirectMessage {
  id: string;
  userId: string;
  userName: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isOnline: boolean;
  isFavorite?: boolean;
}

interface DirectMessageItemProps {
  directMessage: DirectMessage;
}

export default function DirectMessageItem({
  directMessage,
}: DirectMessageItemProps) {
  const { toggleFavorite } = useDirectMessagesStore();
  const { activeType, activeId, workspaceId, setActiveDirectMessage } =
    useNavigationStore();
  const { hasDraft } = useDraftStore();
  const router = useRouter();
  const isActive =
    activeType === "directMessage" && activeId === directMessage.userId;
  const draftKey = makeConversationKey(
    workspaceId,
    undefined,
    directMessage.userId
  );
  const showDraft = hasDraft(draftKey);

  const handleConversationClick = () => {
    setActiveDirectMessage(directMessage.userId);
    router.push(`/w/${workspaceId}/d/${directMessage.userId}`);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(directMessage.userId);
  };

  const handleCloseConversation = () => {
    console.log(`Closing conversation with: ${directMessage.userName}`);
    // TODO: Implement close conversation functionality
  };

  const handleBlockUser = () => {
    console.log(`Blocking user: ${directMessage.userName}`);
    // TODO: Implement block user functionality
  };

  const actions = createDirectMessageActions(
    !!directMessage.isFavorite,
    handleToggleFavorite,
    handleCloseConversation,
    handleBlockUser
  );

  const formatLastMessageTime = (time?: Date) => {
    if (!time) return "";

    const now = new Date();
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return formatDate(time);
  };

  return (
    <div
      className={`group flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1 rounded-md transition-colors ${
        isActive ? "bg-blue-50" : ""
      }`}
      onClick={handleConversationClick}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative">
          {directMessage.avatar ? (
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={directMessage.avatar}
                alt={directMessage.userName}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm text-gray-600">
                {directMessage.userName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {/* Online indicator */}
          <div
            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
              directMessage.isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={`text-xs truncate ${
                isActive ? "font-medium text-blue-700" : "font-medium"
              }`}
            >
              {directMessage.userName}
            </h4>
            {directMessage.lastMessageTime && (
              <span className="text-xs text-gray-400 flex-shrink-0">
                {formatLastMessageTime(directMessage.lastMessageTime)}
              </span>
            )}
          </div>
          {directMessage.lastMessage && (
            <p className="text-xs text-gray-500 truncate">
              {directMessage.lastMessage}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <BadgeCount count={directMessage.unreadCount} />
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
