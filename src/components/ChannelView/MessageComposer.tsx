// components/MessageComposer.tsx
"use client";

import avatarUrl from "@/assets/images/hero.jpeg";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useMessageStore } from "@/store/messageStore";
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
} from "@/components/common/emoji-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import VoiceRecorder from "@/components/common/VoiceRecorder";
import { makeConversationKey, useDraftStore } from "@/store/draftStore";
interface Member {
  id: string;
  name: string;
  avatarUrl?: string;
  emoji?: string;
}

interface MessageComposerProps {
  channelId?: string;
  dmUserId?: string;
  workspaceId: string;
}

// Emoji picker now uses emoji-picker-react library

export default function MessageComposer({
  channelId,
  dmUserId,
  workspaceId,
}: MessageComposerProps) {
  const { addMessage } = useMessageStore();
  const { setDraft, getDraftText, clearDraft } = useDraftStore();
  const [message, setMessage] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [selectedImages, setSelectedImages] = useState<
    { file: File; preview: string }[]
  >([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const draftKey = makeConversationKey(workspaceId, channelId, dmUserId);

  // Load draft on mount / conversation change
  useEffect(() => {
    const draft = getDraftText(draftKey);
    if (draft) setMessage(draft);
  }, [draftKey, getDraftText]);

  // Persist draft as user types
  useEffect(() => {
    setDraft(draftKey, message);
  }, [draftKey, message, setDraft]);

  const members: Member[] = [
    { id: "1", name: "Diana Taylor", avatarUrl: avatarUrl.src },
    { id: "2", name: "Daniel Anderson", avatarUrl: avatarUrl.src },
  ];

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  useEffect(() => {
    const lastWord = message.slice(0, cursorPosition).split(" ").pop() || "";

    if (lastWord.startsWith("@")) {
      setShowMentions(true);
      setMentionSearch(lastWord.slice(1));
    } else {
      setShowMentions(false);
      setMentionSearch("");
    }
  }, [message, cursorPosition]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.currentTarget.selectionStart);
  };

  const handleMentionClick = (member: Member) => {
    const beforeMention = message.slice(
      0,
      cursorPosition - mentionSearch.length - 1
    );
    const afterMention = message.slice(cursorPosition);
    const newMessage = `${beforeMention}@${member.name} ${afterMention}`;
    setMessage(newMessage);
    setShowMentions(false);
    setMentionSearch("");

    if (textareaRef.current) {
      textareaRef.current.focus();
      const newCursorPos = beforeMention.length + member.name.length + 2;
      textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
    }
  };

  const handleFileAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length > 0) {
      const newImages = imageFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setSelectedImages((prev) => [...prev, ...newImages]);
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInsertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      const linkText = prompt("Enter link text (optional):") || url;
      const beforeLink = message.slice(0, cursorPosition);
      const afterLink = message.slice(cursorPosition);
      const newMessage = `${beforeLink}[${linkText}](${url})${afterLink}`;
      setMessage(newMessage);
      textareaRef.current?.focus();
    }
  };

  const handleInsertCode = () => {
    const codeBlock = "```\n// Your code here\n```";
    const beforeCode = message.slice(0, cursorPosition);
    const afterCode = message.slice(cursorPosition);
    const newMessage = `${beforeCode}${codeBlock}${afterCode}`;
    setMessage(newMessage);

    if (textareaRef.current) {
      textareaRef.current.focus();
      const newCursorPos = cursorPosition + 4;
      setTimeout(() => {
        textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const handleEmojiSelect = (emojiData: { emoji: string; label: string }) => {
    const emoji = emojiData.emoji;
    const beforeEmoji = message.slice(0, cursorPosition);
    const afterEmoji = message.slice(cursorPosition);
    const newMessage = `${beforeEmoji}${emoji}${afterEmoji}`;
    setMessage(newMessage);
    setIsEmojiPickerOpen(false);

    if (textareaRef.current) {
      textareaRef.current.focus();
      const newCursorPos = cursorPosition + emoji.length;
      setTimeout(() => {
        textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const handleVoiceRecordStart = () => {
    setShowVoiceRecorder(true);
  };

  const handleVoiceSend = (audioBlob: Blob, audioUrl: string) => {
    const newMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      avatarUrl: avatarUrl.src,
      name: "You",
      time: "now",
      message: "",
      mentions: [],
      reactions: [],
      channelId,
      dmUserId,
      workspaceId,
      audioUrl: audioUrl,
      isVoiceMessage: true,
    };

    addMessage(newMessage);
    setShowVoiceRecorder(false);
  };

  const handleVoiceCancel = () => {
    setShowVoiceRecorder(false);
  };

  const handleSend = () => {
    if (!message.trim() && selectedImages.length === 0) return;

    const mentions = message.match(/@\w+\s?\w*/g) || [];

    const newMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      avatarUrl: avatarUrl.src,
      name: "You",
      time: "now",
      message: message.trim(),
      mentions: mentions,
      reactions: [],
      channelId,
      dmUserId,
      workspaceId,
      // Legacy single image support (for backward compatibility)
      imageUrl:
        selectedImages.length > 0 ? selectedImages[0].preview : undefined,
      imageAlt:
        selectedImages.length > 0 ? selectedImages[0].file.name : undefined,
      // New multiple images support
      images:
        selectedImages.length > 0
          ? selectedImages.map((img) => ({
              url: img.preview,
              alt: img.file.name,
            }))
          : undefined,
    };

    addMessage(newMessage);
    setMessage("");
    clearDraft(draftKey);
    setSelectedImages([]);
    setShowMentions(false);
    setMentionSearch("");

    // Note: Do NOT revoke object URLs here because they are used by the
    // just-sent message. They will be released when the page reloads or the
    // app unmounts. We only revoke when a user removes a preview or discards.

    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDiscard = () => {
    setMessage("");
    clearDraft(draftKey);
    setSelectedImages((prev) => {
      // Clean up object URLs
      prev.forEach((img) => URL.revokeObjectURL(img.preview));
      return [];
    });
    setShowMentions(false);
    setMentionSearch("");
    setIsEmojiPickerOpen(false);
    setShowVoiceRecorder(false);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  return (
    <div className="border-t border-gray-200 bg-white px-6 py-4 relative z-10 shadow-[0_-2px_8px_rgba(0,0,0,0.03)] rounded-t-xl">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        accept="image/*"
        multiple
      />

      {/* Mention Dropdown */}
      {showMentions && (
        <div className="absolute bottom-full left-6 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] max-w-xs">
          <div className="px-3 py-1 text-sm font-medium text-gray-500 border-b border-gray-100">
            Members
          </div>
          <div className="py-1">
            {filteredMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => handleMentionClick(member)}
                className="w-full px-3 py-2 flex items-center space-x-2 hover:bg-gray-50 text-left"
              >
                {member.avatarUrl ? (
                  <Image
                    src={member.avatarUrl}
                    alt={member.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full"
                  />
                ) : member.emoji ? (
                  <span className="text-xl">{member.emoji}</span>
                ) : null}
                <span className="text-sm text-gray-700">@{member.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image Previews */}
      {selectedImages.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedImages.map((image, index) => (
            <div key={index} className="relative group">
              <Image
                src={image.preview}
                alt={image.file.name}
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                unoptimized
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove image"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end space-x-4">
        <div className="flex-1">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextChange}
              onKeyUp={handleKeyUp}
              onKeyDown={handleKeyPress}
              onClick={(e) => setCursorPosition(e.currentTarget.selectionStart)}
              placeholder="Type a message..."
              className="w-full px-4 py-3 pr-32 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <span className="text-xs text-gray-400">
                Shift + Enter for new line
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              {/* Link */}
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                onClick={handleInsertLink}
                title="Insert link"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </button>

              {/* @Mention */}
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => {
                  setMessage((prev) => prev + "@");
                  textareaRef.current?.focus();
                }}
                title="Mention someone"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              {/* Code Block */}
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                onClick={handleInsertCode}
                title="Insert code"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </button>

              {/* Emoji */}
              <Popover
                onOpenChange={setIsEmojiPickerOpen}
                open={isEmojiPickerOpen}
              >
                <PopoverTrigger asChild>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="Add emoji"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
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
                </PopoverTrigger>
                <PopoverContent className="w-fit p-0">
                  <EmojiPicker
                    className="h-[312px]"
                    onEmojiSelect={handleEmojiSelect}
                  >
                    <EmojiPickerSearch />
                    <EmojiPickerContent />
                    <EmojiPickerFooter />
                  </EmojiPicker>
                </PopoverContent>
              </Popover>

              {/* Attachment */}
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                onClick={handleFileAttachment}
                title="Attach file"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>

              {/* Voice Recording */}
              <Popover
                onOpenChange={setShowVoiceRecorder}
                open={showVoiceRecorder}
              >
                <PopoverTrigger asChild>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="Record voice message"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <VoiceRecorder
                    onSend={handleVoiceSend}
                    onCancel={handleVoiceCancel}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDiscard}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
              >
                Discard
              </button>
              <button
                onClick={handleSend}
                disabled={!message.trim() && selectedImages.length === 0}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
