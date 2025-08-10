interface MessageItemProps {
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
  imageUrl?: string;
  imageAlt?: string;
  onImageClick?: (url: string, alt?: string) => void;
}
export default function MessageItem({
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
  onImageClick,
}: MessageItemProps) {
  return (
    <div className="flex space-x-3 px-6 py-4 hover:bg-gray-50">
      <img src={avatarUrl} alt={name} className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-semibold text-gray-900">{name}</span>
          <span className="text-sm text-gray-500">{time}</span>
        </div>
        <div className="text-gray-700 mb-2">
          {message.split(" ").map((word, index) => {
            if (mentions.includes(word)) {
              return (
                <span
                  key={index}
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  {word}{" "}
                </span>
              );
            }
            return <span key={index}>{word} </span>;
          })}
        </div>

        {imageUrl && (
          <div className="mt-3">
            <img
              src={imageUrl}
              alt={imageAlt || "image attachment"}
              className="rounded-lg border border-gray-200 w-40 cursor-zoom-in"
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
