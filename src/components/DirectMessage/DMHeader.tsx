import { useDirectMessagesStore } from "@/store/directMessagesStore";
import Image from "next/image";
import { useMemo } from "react";

interface DMHeaderProps {
  onToggleSettings: () => void;
  dmUserId: string;
  workspaceId: string;
}

export default function DMHeader({
  onToggleSettings,
  dmUserId,
}: DMHeaderProps) {
  const { directMessages } = useDirectMessagesStore();

  // Get current DM user info
  const userInfo = useMemo(() => {
    const dm = directMessages.find((dm) => dm.userId === dmUserId);
    return {
      name: dm?.userName || "Unknown User",
      avatar: dm?.avatar,
      isOnline: dm?.isOnline || false,
    };
  }, [dmUserId, directMessages]);

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="relative">
          {userInfo.avatar ? (
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={userInfo.avatar}
                alt={userInfo.name}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm text-gray-600">
                {userInfo.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {/* Online indicator */}
          <div
            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
              userInfo.isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {userInfo.name}
          </h2>
          <p className="text-sm text-gray-500">
            {userInfo.isOnline ? "Active now" : "Away"}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 rounded">
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
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
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
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
        <button
          className="p-2 hover:bg-gray-100 rounded"
          onClick={onToggleSettings}
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
