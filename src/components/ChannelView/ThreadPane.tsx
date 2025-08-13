"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMessageStore } from "@/store/messageStore";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ThreadPaneProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rootMessageId: string;
  workspaceId: string;
  channelId?: string;
  dmUserId?: string;
}

export default function ThreadPane({
  open,
  onOpenChange,
  rootMessageId,
  workspaceId,
  channelId,
  dmUserId,
}: ThreadPaneProps) {
  const { messages, getThreadMessages, addThreadReply } = useMessageStore();
  const root = messages.find((m) => m.id === rootMessageId);
  const replies = getThreadMessages(rootMessageId);

  const [reply, setReply] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) setReply("");
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [replies.length, open]);

  if (!root) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Thread</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-auto px-4 py-2">
          {/* Root message */}
          <div className="mb-4 rounded-md border p-3 bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <Image
                src={root.avatarUrl}
                alt={root.name}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="text-sm font-medium text-gray-800">
                {root.name}
              </span>
              <span className="text-xs text-gray-500">{root.time}</span>
            </div>
            <div className="text-sm text-gray-800 whitespace-pre-wrap">
              {root.message}
            </div>
          </div>

          {/* Replies */}
          <div className="space-y-3">
            {replies.map((m) => (
              <div key={m.id} className="rounded-md border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Image
                    src={m.avatarUrl}
                    alt={m.name}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-800">
                    {m.name}
                  </span>
                  <span className="text-xs text-gray-500">{m.time}</span>
                </div>
                <div className="text-sm text-gray-800 whitespace-pre-wrap">
                  {m.message}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        </div>

        {/* Composer */}
        <div className="border-t p-3 flex items-center gap-2">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="flex-1 rounded-md border px-3 py-2 text-sm"
            placeholder="Reply in thread..."
            rows={2}
          />
          <Button
            onClick={() => {
              if (!reply.trim()) return;
              addThreadReply(rootMessageId, reply.trim(), {
                workspaceId,
                channelId,
                dmUserId,
              });
              setReply("");
            }}
          >
            Send
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
