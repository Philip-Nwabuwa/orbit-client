"use client";

import avatarUrl from "@/assets/images/hero.jpeg";
import { useState, useRef, useEffect } from "react";

interface Member {
  id: string;
  name: string;
  avatarUrl?: string;
  emoji?: string;
}

export default function MessageComposer() {
  const [message, setMessage] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const members: Member[] = [
    { id: "1", name: "Diana Taylor", avatarUrl: avatarUrl.src },
    { id: "2", name: "Daniel Anderson", avatarUrl: avatarUrl.src },
  ];

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  useEffect(() => {
    // Check if the user typed '@'
    const lastChar = message[cursorPosition - 1];
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

    // Focus back on textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
      const newCursorPos = beforeMention.length + member.name.length + 2;
      textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white px-6 py-4 relative z-10 shadow-[0_-2px_8px_rgba(0,0,0,0.03)] rounded-t-xl">
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
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
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

      <div className="flex items-end space-x-4">
        <div className="flex-1">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextChange}
              onKeyUp={handleKeyUp}
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
              <button className="p-2 hover:bg-gray-100 rounded-lg">
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
              <button className="p-2 hover:bg-gray-100 rounded-lg">
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
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
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
              <button className="p-2 hover:bg-gray-100 rounded-lg">
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
              <button className="p-2 hover:bg-gray-100 rounded-lg">
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
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">
                Discard
              </button>
              <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
