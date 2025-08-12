"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Bookmark as BookmarkIcon } from "lucide-react";
import { useSavedStore } from "@/store/savedStore";
import AudioPlayer from "@/components/common/AudioPlayer";

interface MessageItemProps {
  id: string;
  avatarUrl: string;
  name: string;
  time: string;
  message: string;
  mentions?: string[];
  hasAttachment?: boolean;
  attachmentTitle?: string;
  attachmentUrl?: string;
  reactions?: { emoji: string; count: number }[];
  showQuickView?: boolean;
  imageUrl?: string; // Legacy single image support
  imageAlt?: string; // Legacy single image support
  images?: { url: string; alt?: string }[]; // New multiple images support
  onImageClick?: (url: string, alt?: string) => void;
  audioUrl?: string; // Voice message audio URL
  isVoiceMessage?: boolean; // Flag to identify voice messages
  workspaceId: string;
  channelId?: string;
  dmUserId?: string;
}

export default function MessageItem({
  id,
  avatarUrl,
  name,
  time,
  message,
  mentions = [],
  hasAttachment = false,
  attachmentTitle,
  attachmentUrl,
  reactions = [],
  showQuickView = false,
  imageUrl,
  imageAlt,
  images,
  onImageClick,
  audioUrl,
  isVoiceMessage = false,
  workspaceId,
  channelId,
  dmUserId,
}: MessageItemProps) {
  const [showToolbar, setShowToolbar] = useState(false);
  const { isSaved, toggleSaveMessage } = useSavedStore();
  const saved = isSaved(id);

  const escapedMentionsPattern = useMemo(() => {
    if (!mentions || mentions.length === 0) return null;
    const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(${mentions.map(escapeRegex).join("|")})`, "g");
  }, [mentions]);

  const renderedMessageParts = useMemo(() => {
    if (!escapedMentionsPattern) return [message];
    const parts = message.split(escapedMentionsPattern);
    return parts.map((part, index) =>
      mentions.includes(part) ? (
        <span
          key={`m-${index}`}
          className="text-blue-600 cursor-pointer hover:underline"
        >
          {part}
        </span>
      ) : (
        <span key={`t-${index}`}>{part}</span>
      )
    );
  }, [message, mentions, escapedMentionsPattern]);

  return (
    <div
      className="relative flex space-x-3 px-6 py-2 hover:bg-gray-50 group"
      onMouseEnter={() => setShowToolbar(true)}
      onMouseLeave={() => setShowToolbar(false)}
    >
      {/* Hover Toolbar */}
      {showToolbar && (
        <div className="absolute -top-9 right-4 bg-gray-800 rounded-lg shadow-lg flex items-center px-1 py-1 space-x-0.5 z-20">
          {/* Check/Complete */}
          <button
            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            title="Mark as complete"
          >
            <svg
              className="w-4 h-4 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Quote/Reply */}
          <button
            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            title="Quote message"
          >
            <svg
              className="w-4 h-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>

          {/* Hands/Reaction */}
          <button
            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            title="Add reaction"
          >
            <span className="text-base">🙌</span>
          </button>

          {/* Refresh/Sync */}
          <button
            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            title="Refresh"
          >
            <svg
              className="w-4 h-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

          {/* Comment */}
          <button
            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            title="Comment"
          >
            <svg
              className="w-4 h-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 4z"
              />
            </svg>
          </button>

          {/* Forward */}
          <button
            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            title="Forward"
          >
            <svg
              className="w-4 h-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>

          {/* Save / Unsave */}
          <button
            className={`p-1.5 rounded transition-colors ${
              saved ? "bg-yellow-600/20" : "hover:bg-gray-700"
            }`}
            title={saved ? "Unsave" : "Save"}
            onClick={() =>
              toggleSaveMessage({
                messageId: id,
                workspaceId,
                channelId,
                dmUserId,
                preview: message,
                authorName: name,
              })
            }
          >
            <BookmarkIcon
              className={`w-4 h-4 ${
                saved ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          </button>

          {/* More Options */}
          <button
            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            title="More options"
          >
            <svg
              className="w-4 h-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      )}

      <Image
        src={avatarUrl}
        alt={name}
        width={32}
        height={32}
        className="size-8 rounded-full"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-semibold text-gray-900">{name}</span>
          <span className="text-sm text-gray-500">{time}</span>
        </div>
        {/* Message text (only show if not a voice message or if there's additional text) */}
        {(!isVoiceMessage || message.trim()) && (
          <div className="text-gray-700 mb-2 whitespace-pre-wrap">
            {renderedMessageParts}
          </div>
        )}

        {/* Voice message audio player */}
        {isVoiceMessage && audioUrl && (
          <div className="mt-2 mb-3">
            <AudioPlayer audioUrl={audioUrl} />
          </div>
        )}

        {/* Multiple images display */}
        {images && images.length > 0 && (
          <div className="mt-3">
            <div
              className={`grid gap-2 ${
                images.length === 1
                  ? "grid-cols-1"
                  : images.length === 2
                  ? "grid-cols-2"
                  : images.length === 3
                  ? "grid-cols-2"
                  : "grid-cols-2"
              } max-w-md`}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`${
                    images.length === 3 && index === 0 ? "col-span-2" : ""
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `image attachment ${index + 1}`}
                    width={images.length === 1 ? 160 : 120}
                    height={images.length === 1 ? 160 : 120}
                    className="rounded-lg border border-gray-200 cursor-zoom-in w-full h-auto"
                    unoptimized={
                      image.url.startsWith("blob:") ||
                      image.url.startsWith("data:")
                    }
                    onClick={() => onImageClick?.(image.url, image.alt)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legacy single image display (for backward compatibility) */}
        {!images && imageUrl && (
          <div className="mt-3">
            <Image
              src={imageUrl}
              alt={imageAlt || "image attachment"}
              width={160}
              height={160}
              className="rounded-lg border border-gray-200 w-40 cursor-zoom-in"
              unoptimized={
                imageUrl.startsWith("blob:") || imageUrl.startsWith("data:")
              }
              onClick={() => onImageClick?.(imageUrl, imageAlt)}
            />
          </div>
        )}

        {hasAttachment && (
          <div className="border border-gray-200 rounded-lg p-4 mt-3 bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{attachmentTitle}</p>
                  <p className="text-sm text-gray-500">{attachmentUrl}</p>
                </div>
              </div>
              {showQuickView && (
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  Quick view
                </button>
              )}
            </div>
          </div>
        )}

        {reactions.length > 0 && (
          <div className="flex items-center space-x-2 mt-2">
            {reactions.map((reaction, index) => (
              <button
                key={index}
                className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <span>{reaction.emoji}</span>
                {reaction.count > 0 && (
                  <span className="text-sm text-gray-600">
                    {reaction.count}
                  </span>
                )}
              </button>
            ))}
            <button className="p-1 hover:bg-gray-100 rounded">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
