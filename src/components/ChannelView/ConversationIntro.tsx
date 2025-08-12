"use client";

import Image from "next/image";
import { Hash, Lock, Users, MessageSquare } from "lucide-react";
import { useChannelStore } from "@/store/channelStore";
import { useDirectMessagesStore } from "@/store/directMessagesStore";
import { useMemo } from "react";

interface ConversationIntroProps {
  channelId?: string;
  dmUserId?: string;
  workspaceId: string;
}

export default function ConversationIntro({
  channelId,
  dmUserId,
}: ConversationIntroProps) {
  const { channels } = useChannelStore();
  const { directMessages } = useDirectMessagesStore();

  const channelInfo = useMemo(() => {
    if (!channelId) return null;
    const channel = channels.find((c) => c.id === channelId);
    if (!channel) return null;
    return {
      name: channel.name,
      description: channel.description,
      type: channel.type,
      membersCount: channel.members?.length ?? 0,
    };
  }, [channelId, channels]);

  const dmInfo = useMemo(() => {
    if (!dmUserId) return null;
    const dm = directMessages.find((d) => d.userId === dmUserId);
    if (!dm) return null;
    return {
      name: dm.userName,
      avatar: dm.avatar,
      isOnline: dm.isOnline,
    };
  }, [dmUserId, directMessages]);

  if (!channelInfo && !dmInfo) return null;

  return (
    <div className="px-6 pt-6 pb-4">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="px-6 py-5 flex items-start gap-4">
          {/* Icon / Avatar */}
          <div className="flex-shrink-0">
            {channelInfo ? (
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                {channelInfo.type === "private" ? (
                  <Lock className="w-6 h-6 text-gray-600" />
                ) : (
                  <Hash className="w-6 h-6 text-gray-600" />
                )}
              </div>
            ) : dmInfo?.avatar ? (
              <Image
                src={dmInfo.avatar}
                alt={dmInfo.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-xl object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 text-xl">
                {dmInfo?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {channelInfo ? (
              <>
                <h3 className="text-base font-semibold text-gray-900">
                  #{channelInfo.name}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  This is the start of the #{channelInfo.name} channel.
                </p>
                {channelInfo.description && (
                  <p className="mt-2 text-sm text-gray-700">
                    {channelInfo.description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-4 h-4" /> {channelInfo.membersCount}{" "}
                    members
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" /> Start the conversation
                  </span>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-semibold text-gray-900">
                  Direct message with {dmInfo?.name}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  This is the start of your conversation.
                </p>
                <div className="mt-3">
                  <span
                    className={
                      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium " +
                      (dmInfo?.isOnline
                        ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                        : "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10")
                    }
                  >
                    {dmInfo?.isOnline ? "Active now" : "Offline"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
