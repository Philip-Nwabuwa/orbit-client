import { useDirectMessagesStore } from "@/store/directMessagesStore";
import Image from "next/image";
import { useMemo } from "react";

interface DMInfoPanelProps {
  dmUserId: string;
  workspaceId: string;
}

export default function DMInfoPanel({ dmUserId }: DMInfoPanelProps) {
  const { directMessages } = useDirectMessagesStore();

  // Get current DM user info
  const userInfo = useMemo(() => {
    const dm = directMessages.find((dm) => dm.userId === dmUserId);
    return {
      name: dm?.userName || "Unknown User",
      avatar: dm?.avatar,
      isOnline: dm?.isOnline || false,
      lastMessageTime: dm?.lastMessageTime,
    };
  }, [dmUserId, directMessages]);

  const infoItems = [
    {
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
      label: "Name",
      value: userInfo.name,
      hasAvatar: true,
      avatarContent: userInfo.avatar,
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      label: "Status",
      value: userInfo.isOnline ? "Online" : "Away",
      isStatus: true,
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      label: "Last active",
      value: userInfo.lastMessageTime
        ? userInfo.lastMessageTime.toLocaleDateString()
        : "Unknown",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      ),
      label: "Shared Files",
      value: "0",
    },
  ];

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Direct Message Info
      </h2>
      <div className="space-y-3">
        {infoItems.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <span className="text-gray-400">{item.icon}</span>
                <span className="text-gray-600 text-sm">{item.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                {item.hasAvatar && item.avatarContent && (
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={item.avatarContent}
                      alt={userInfo.name}
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {item.isStatus ? (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      userInfo.isOnline
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        userInfo.isOnline ? "bg-green-600" : "bg-gray-600"
                      }`}
                    ></span>
                    {item.value}
                  </span>
                ) : (
                  <span className="text-gray-900 text-sm">{item.value}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-md font-medium text-gray-900 mb-3">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            📱 Call {userInfo.name}
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            📹 Video call
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            📎 View shared files
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            🚫 Block user
          </button>
        </div>
      </div>
    </div>
  );
}
