"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useChannelStore } from "@/store/channelStore";
import { useDirectMessagesStore } from "@/store/directMessagesStore";
import { useMessageStore, MessageItemModel } from "@/store/messageStore";
import { Hash, UserCircle2, Search } from "lucide-react";
import avatarUrl from "@/assets/images/hero.jpeg";

type TargetType = "channel" | "dm";
type SelectedTarget = {
  type: TargetType;
  id: string;
  label: string;
};

interface ForwardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  sourceMessage: MessageItemModel | null;
}

export default function ForwardDialog({
  open,
  onOpenChange,
  workspaceId,
  sourceMessage,
}: ForwardDialogProps) {
  const { channels, initializeChannels } = useChannelStore();
  const { directMessages, initializeDirectMessages } = useDirectMessagesStore();
  const { addMessage } = useMessageStore();

  const [query, setQuery] = useState("");
  const [targetType, setTargetType] = useState<TargetType>("channel");
  const [selectedTargets, setSelectedTargets] = useState<SelectedTarget[]>([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (open) {
      setQuery("");
      setTargetType("channel");
      setSelectedTargets([]);
      setComment("");
      if (channels.length === 0) initializeChannels();
      if (directMessages.length === 0) initializeDirectMessages();
    }
  }, [
    open,
    channels.length,
    directMessages.length,
    initializeChannels,
    initializeDirectMessages,
  ]);

  const filteredChannels = useMemo(() => {
    return channels
      .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 50);
  }, [channels, query]);

  const filteredDMs = useMemo(() => {
    return directMessages
      .filter((d) => d.userName.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 50);
  }, [directMessages, query]);

  const canForward = Boolean(selectedTargets.length > 0 && sourceMessage);

  const toggleTarget = (t: SelectedTarget) => {
    setSelectedTargets((prev) => {
      const exists = prev.some((x) => x.type === t.type && x.id === t.id);
      if (exists) {
        return prev.filter((x) => !(x.type === t.type && x.id === t.id));
      }
      return [...prev, t];
    });
  };

  // Select-all functionality removed by request

  const handleForward = () => {
    if (!canForward || !sourceMessage) return;

    // Compute source attribution
    let sourceLabel = "";
    if (sourceMessage.channelId) {
      const ch = channels.find((c) => c.id === sourceMessage.channelId);
      sourceLabel = ch ? `#${ch.name}` : `#${sourceMessage.channelId}`;
    } else if (sourceMessage.dmUserId) {
      const dm = directMessages.find(
        (d) => d.userId === sourceMessage.dmUserId
      );
      sourceLabel = dm ? dm.userName : sourceMessage.dmUserId;
    } else {
      sourceLabel = "this conversation";
    }
    const attribution = `Forwarded from ${sourceLabel} by ${sourceMessage.name}`;

    // Forward to each selected target
    selectedTargets.forEach((t) => {
      const newId = `msg-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`;
      const target =
        t.type === "channel"
          ? { channelId: t.id as string, dmUserId: undefined }
          : { channelId: undefined, dmUserId: t.id as string };

      // Build message body: global comment > original
      const note = comment.trim();
      const parts: string[] = [];
      if (note) parts.push(note);
      parts.push(attribution);
      parts.push(sourceMessage.message);
      const finalMessage = parts.join("\n\n");

      // Build forwarded message, carrying over attachments/images/audio
      addMessage({
        id: newId,
        avatarUrl: avatarUrl.src,
        name: "You",
        time: "now",
        message: finalMessage,
        mentions: [],
        reactions: [],
        workspaceId,
        ...target,
        hasAttachment: sourceMessage.hasAttachment,
        attachmentTitle: sourceMessage.attachmentTitle,
        attachmentUrl: sourceMessage.attachmentUrl,
        imageUrl: sourceMessage.imageUrl,
        imageAlt: sourceMessage.imageAlt,
        images: sourceMessage.images,
        audioUrl: sourceMessage.audioUrl,
        isVoiceMessage: sourceMessage.isVoiceMessage,
      });
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Forward message</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border pl-8 pr-3 py-2 text-sm"
              placeholder="Search channels or people"
            />
          </div>

          {/* Toggle */}
          <div className="inline-flex rounded-md border p-0.5 text-xs">
            <button
              className={`px-3 py-1 rounded ${
                targetType === "channel"
                  ? "bg-gray-900 text-white"
                  : "text-gray-700"
              }`}
              onClick={() => setTargetType("channel")}
            >
              Channels
            </button>
            <button
              className={`px-3 py-1 rounded ${
                targetType === "dm" ? "bg-gray-900 text-white" : "text-gray-700"
              }`}
              onClick={() => setTargetType("dm")}
            >
              Direct Messages
            </button>
            {/* Select-all removed */}
          </div>

          {/* Selected summary */}
          <div className="flex flex-wrap gap-2">
            {selectedTargets.map((t) => (
              <span
                key={`${t.type}-${t.id}`}
                className="inline-flex items-center gap-1 rounded-full border bg-gray-50 px-2 py-1 text-xs"
              >
                {t.type === "channel" ? (
                  <Hash className="size-3" />
                ) : (
                  <UserCircle2 className="size-3" />
                )}
                {t.label}
                <button
                  className="ml-1 text-gray-400 hover:text-gray-600"
                  onClick={() => toggleTarget(t)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Per-target comments removed by request */}

          {/* List */}
          <div className="max-h-40 overflow-auto rounded-md border divide-y">
            {targetType === "channel"
              ? filteredChannels.map((c) => {
                  const checked = selectedTargets.some(
                    (t) => t.type === "channel" && t.id === c.id
                  );
                  return (
                    <label
                      key={c.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="mt-0.5"
                        checked={checked}
                        onChange={() =>
                          toggleTarget({
                            type: "channel",
                            id: c.id,
                            label: c.name,
                          })
                        }
                      />
                      <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-white">
                        <Hash className="size-4 text-gray-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm text-gray-800 truncate">
                          {c.name}
                        </div>
                        {c.description && (
                          <div className="text-xs text-gray-500 truncate">
                            {c.description}
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })
              : filteredDMs.map((d) => {
                  const checked = selectedTargets.some(
                    (t) => t.type === "dm" && t.id === d.userId
                  );
                  return (
                    <label
                      key={d.userId}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="mt-0.5"
                        checked={checked}
                        onChange={() =>
                          toggleTarget({
                            type: "dm",
                            id: d.userId,
                            label: d.userName,
                          })
                        }
                      />
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-white">
                        <UserCircle2 className="size-4 text-gray-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm text-gray-800 truncate">
                          {d.userName}
                        </div>
                      </div>
                    </label>
                  );
                })}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Add a comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Write a message to include with the forward"
            />
          </div>

          {/* Preview */}
          {sourceMessage && (
            <div className="rounded-md border bg-gray-50 p-3">
              <div className="text-xs text-gray-500 mb-1">Forwarding</div>
              <div className="text-sm text-gray-800 line-clamp-3 whitespace-pre-wrap">
                {sourceMessage.message}
              </div>
              {(sourceMessage.images?.length ||
                sourceMessage.imageUrl ||
                sourceMessage.hasAttachment ||
                sourceMessage.audioUrl) && (
                <div className="mt-2 text-xs text-gray-500">
                  Includes attachments
                </div>
              )}
            </div>
          )}
        </div>

        <Separator className="my-2" />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleForward} disabled={!canForward}>
            Forward
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
