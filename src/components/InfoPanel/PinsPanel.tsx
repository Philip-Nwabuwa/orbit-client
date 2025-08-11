import avatarUrl from "@/assets/images/hero.jpeg";
import Image from "next/image";
import { PinIcon, MoreHorizontalIcon, MessageCircleIcon } from "lucide-react";

interface PinnedMessage {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  replies: number;
}

const pinnedMessages: PinnedMessage[] = [
  {
    id: "1",
    author: {
      name: "Andrew M.",
      avatar: avatarUrl.src,
    },
    content:
      "Updated design system documentation is now available. Please review the new component guidelines before implementing.",
    timestamp: "2 days ago",
    replies: 3,
  },
  {
    id: "2",
    author: {
      name: "Daniel Anderson",
      avatar: avatarUrl.src,
    },
    content:
      "Team standup moved to 10:30 AM tomorrow due to client presentation.",
    timestamp: "1 week ago",
    replies: 0,
  },
  {
    id: "3",
    author: {
      name: "Emily Davis",
      avatar: avatarUrl.src,
    },
    content:
      "New branch protection rules are now in effect. All PRs require at least 2 approvals.",
    timestamp: "2 weeks ago",
    replies: 5,
  },
];

interface PinsPanelProps {
  channelId: string;
  workspaceId: string;
}

export default function PinsPanel({ channelId, workspaceId }: PinsPanelProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Pinned Messages</h3>

      {pinnedMessages.length > 0 ? (
        <div className="space-y-4">
          {pinnedMessages.map((message) => (
            <div
              key={message.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Image
                    src={message.author.avatar}
                    alt={message.author.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {message.author.name}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <PinIcon className="w-4 h-4 text-gray-400" />
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontalIcon className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                {message.content}
              </p>

              {message.replies > 0 && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <MessageCircleIcon className="w-3 h-3" />
                  <span>
                    {message.replies}{" "}
                    {message.replies === 1 ? "reply" : "replies"}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <PinIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No pinned messages yet</p>
        </div>
      )}
    </div>
  );
}
