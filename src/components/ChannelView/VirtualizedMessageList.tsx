"use client";

import MessageItem from "./MessageItem";
import ImageViewer from "./ImageViewer";
import ConversationIntro from "./ConversationIntro";
import { useEffect, useLayoutEffect, useRef, useState, useCallback, useMemo } from "react";
import { useMessageStore } from "@/store/messageStore";
import { groupMessagesByDay, MessageListItem } from "@/lib/messageUtils";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

interface VirtualizedMessageListProps {
  channelId?: string;
  dmUserId?: string;
  workspaceId: string;
}

interface DateDividerProps {
  displayDate: string;
}

function DateDivider({ displayDate }: DateDividerProps) {
  return (
    <div className="flex items-center justify-center py-4 px-4">
      <div className="flex-grow border-t border-gray-200"></div>
      <div className="mx-4 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
        {displayDate}
      </div>
      <div className="flex-grow border-t border-gray-200"></div>
    </div>
  );
}

interface ItemRendererProps {
  index: number;
  style: React.CSSProperties;
  data: {
    items: MessageListItem[];
    workspaceId: string;
    channelId?: string;
    dmUserId?: string;
    onImageClick: (url: string, alt?: string) => void;
  };
}

function ItemRenderer({ index, style, data }: ItemRendererProps) {
  const { items, workspaceId, onImageClick } = data;
  const item = items[index];

  if (item.type === "date-divider") {
    return (
      <div style={style}>
        <DateDivider displayDate={item.displayDate} />
      </div>
    );
  }

  const message = item.message;
  return (
    <div style={style}>
      <MessageItem
        key={message.id}
        id={message.id}
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
        images={message.images}
        onImageClick={onImageClick}
        audioUrl={message.audioUrl}
        isVoiceMessage={message.isVoiceMessage}
        workspaceId={workspaceId}
        channelId={message.channelId}
        dmUserId={message.dmUserId}
      />
    </div>
  );
}

export default function VirtualizedMessageList({
  channelId,
  dmUserId,
  workspaceId,
}: VirtualizedMessageListProps) {
  const {
    getMessagesForChannel,
    getMessagesForDM,
    initializeChannelMessages,
    initializeDMMessages,
    loadMoreChannelMessages,
    loadMoreDMMessages,
    getChannelPaginationState,
    getDMPaginationState,
  } = useMessageStore();

  const listRef = useRef<List>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasMountedRef = useRef(false);
  const isUserScrollingRef = useRef(false);
  const lastScrollTopRef = useRef(0);
  const [viewer, setViewer] = useState<{ url: string; alt?: string } | null>(null);
  const [containerHeight, setContainerHeight] = useState(600);

  // Get messages based on context
  const messages = useMemo(() => {
    return channelId
      ? getMessagesForChannel(channelId, workspaceId)
      : dmUserId
      ? getMessagesForDM(dmUserId, workspaceId)
      : [];
  }, [channelId, dmUserId, workspaceId, getMessagesForChannel, getMessagesForDM]);

  // Get pagination state
  const paginationState = useMemo(() => {
    return channelId
      ? getChannelPaginationState(channelId, workspaceId)
      : dmUserId
      ? getDMPaginationState(dmUserId, workspaceId)
      : { hasMore: false, isLoading: false };
  }, [channelId, dmUserId, workspaceId, getChannelPaginationState, getDMPaginationState]);

  // Group messages by day
  const items = useMemo(() => groupMessagesByDay(messages), [messages]);

  // Add conversation intro as first item
  const allItems = useMemo(() => {
    const introItem: MessageListItem = {
      type: "date-divider",
      date: "intro",
      displayDate: "Conversation Start",
    };
    return [introItem, ...items];
  }, [items]);

  // Handle container resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(container);
    setContainerHeight(container.clientHeight);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    // Initialize messages for current context
    if (channelId && messages.length === 0) {
      initializeChannelMessages(channelId, workspaceId);
    } else if (dmUserId && messages.length === 0) {
      initializeDMMessages(dmUserId, workspaceId);
    }
  }, [
    channelId,
    dmUserId,
    workspaceId,
    messages.length,
    initializeChannelMessages,
    initializeDMMessages,
  ]);

  // Load more messages when needed
  const loadMoreItems = useCallback(
    async (_startIndex: number, _stopIndex: number) => {
      if (paginationState.isLoading || !paginationState.hasMore) return;

      if (channelId) {
        await loadMoreChannelMessages(channelId, workspaceId);
      } else if (dmUserId) {
        await loadMoreDMMessages(dmUserId, workspaceId);
      }
    },
    [
      channelId,
      dmUserId,
      workspaceId,
      loadMoreChannelMessages,
      loadMoreDMMessages,
      paginationState,
    ]
  );

  // Check if item is loaded
  const isItemLoaded = useCallback(
    (index: number) => {
      // First item is always loaded (intro)
      if (index === 0) return true;
      
      // If we have more items to load and we're near the top, item might not be loaded
      return !paginationState.hasMore || index < allItems.length;
    },
    [allItems.length, paginationState.hasMore]
  );

  // Track if user is manually scrolling
  const handleScroll = useCallback(({ scrollOffset, scrollUpdateWasRequested }: { scrollDirection?: string; scrollOffset: number; scrollUpdateWasRequested: boolean }) => {
    // Don't consider programmatic scrolls as user scrolling
    if (scrollUpdateWasRequested) return;
    
    // User is scrolling up if scrollOffset is less than last position
    const isScrollingUp = scrollOffset < lastScrollTopRef.current;
    isUserScrollingRef.current = isScrollingUp;
    lastScrollTopRef.current = scrollOffset;
    
    // If user scrolled to bottom, reset user scrolling flag
    const list = listRef.current;
    if (list) {
      const listElement = (list as any)._outerRef;
      if (listElement) {
        const { scrollHeight, clientHeight } = listElement;
        const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollOffset) < 10;
        if (isAtBottom) {
          isUserScrollingRef.current = false;
        }
      }
    }
  }, []);

  // Auto-scroll to bottom for new messages
  useLayoutEffect(() => {
    // Don't auto-scroll if user is manually scrolling up
    if (isUserScrollingRef.current) return;

    // Track that component has mounted
    hasMountedRef.current = true;

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      if (listRef.current && allItems.length > 0) {
        listRef.current.scrollToItem(allItems.length - 1, "end");
      }
    });
  }, [allItems.length]);

  const handleImageClick = (url: string, alt?: string) => {
    setViewer({ url, alt });
  };

  // Calculate item height dynamically
  const getItemSize = (index: number) => {
    const item = allItems[index];
    if (item?.type === "date-divider") {
      return 60; // Height for date dividers
    }
    return 120; // Estimated height for message items
  };

  // Render data for items
  const itemData = {
    items: allItems,
    workspaceId,
    channelId,
    dmUserId,
    onImageClick: handleImageClick,
  };

  return (
    <>
      <div ref={containerRef} className="flex-1 overflow-hidden">
        {allItems.length > 0 && (
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={paginationState.hasMore ? allItems.length + 1 : allItems.length}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <List
                ref={(list) => {
                  listRef.current = list;
                  ref(list);
                }}
                height={containerHeight}
                itemCount={allItems.length}
                itemSize={getItemSize}
                itemData={itemData}
                onItemsRendered={onItemsRendered}
                onScroll={handleScroll}
                className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
              >
                {ItemRenderer}
              </List>
            )}
          </InfiniteLoader>
        )}

        {/* Show conversation intro for empty state */}
        {allItems.length === 1 && ( // Only intro item
          <div className="h-full flex items-center justify-center">
            <ConversationIntro
              channelId={channelId}
              dmUserId={dmUserId}
              workspaceId={workspaceId}
            />
          </div>
        )}
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