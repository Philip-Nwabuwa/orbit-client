"use client";

import MessageItem from "./MessageItem";
import ImageViewer from "./ImageViewer";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useMessageStore } from "@/store/messageStore";

interface MessageListProps {
  channelId?: string;
  dmUserId?: string;
  workspaceId: string;
}

export default function MessageList({ channelId, dmUserId, workspaceId }: MessageListProps) {
  const { 
    getMessagesForChannel, 
    getMessagesForDM, 
    initializeChannelMessages,
    initializeDMMessages
  } = useMessageStore();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasMountedRef = useRef(false);
  const isUserScrollingRef = useRef(false);
  const lastScrollTopRef = useRef(0);

  const [viewer, setViewer] = useState<{ url: string; alt?: string } | null>(
    null
  );

  // Get messages based on context
  const messages = channelId 
    ? getMessagesForChannel(channelId, workspaceId)
    : dmUserId 
    ? getMessagesForDM(dmUserId, workspaceId)
    : [];

  useEffect(() => {
    // Initialize messages for current context
    if (channelId && messages.length === 0) {
      initializeChannelMessages(channelId, workspaceId);
    } else if (dmUserId && messages.length === 0) {
      initializeDMMessages(dmUserId, workspaceId);
    }
  }, [channelId, dmUserId, workspaceId, messages.length, initializeChannelMessages, initializeDMMessages]);

  // Track if user is manually scrolling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;

      // User is scrolling up if scrollTop is less than last position
      isUserScrollingRef.current =
        !isAtBottom && scrollTop < lastScrollTopRef.current;
      lastScrollTopRef.current = scrollTop;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useLayoutEffect(() => {
    // Don't auto-scroll if user is manually scrolling up
    if (isUserScrollingRef.current) return;

    // First render: jump instantly; later renders: smooth scroll
    const behavior: ScrollBehavior = hasMountedRef.current
      ? "smooth"
      : "instant";
    hasMountedRef.current = true;

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({
        behavior,
        block: "end",
        inline: "nearest",
      });
    });
  }, [messages.length]);

  // Optional: Scroll to bottom when component first mounts
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "instant",
      block: "end",
    });
  }, []);

  const handleImageClick = (url: string, alt?: string) => {
    setViewer({ url, alt });
  };

  return (
    <>
      <div
        ref={containerRef}
        className="flex flex-col overflow-y-auto flex-1"
        style={{ scrollBehavior: "smooth" }}
      >
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            avatarUrl={message.avatarUrl}
            name={message.name}
            time={message.time}
            message={message.message}
            mentions={message.mentions}
            hasAttachment={message.hasAttachment}
            attachmentTitle={message.attachmentTitle}
            attachmentUrl={message.attachmentUrl}
            reactions={message.reactions}
            showQuickView={message.showQuickView}
            imageUrl={message.imageUrl}
            imageAlt={message.imageAlt}
            onImageClick={handleImageClick}
          />
        ))}
        <div ref={bottomRef} className="h-1" />
      </div>

      {viewer && (
        <ImageViewer
          url={viewer.url}
          alt={viewer.alt}
          onClose={() => setViewer(null)}
        />
      )}
    </>
  );
}
