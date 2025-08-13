import { useMessageStore } from "@/store/messageStore";
import Image from "next/image";

interface LinkedThreadsProps {
  channelId: string;
  workspaceId: string;
  onOpenThread?: (rootMessageId: string) => void;
}

export default function LinkedThreads({
  channelId,
  workspaceId,
  onOpenThread,
}: LinkedThreadsProps) {
  const { messages, getThreadCount } = useMessageStore();
  const roots = messages.filter(
    (m) =>
      m.channelId === channelId &&
      m.workspaceId === workspaceId &&
      !m.threadRootId
  );
  const threadRoots = roots
    .map((m) => ({ root: m, count: getThreadCount(m.id) }))
    .filter((t) => t.count > 0);

  if (threadRoots.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Linked threads
      </h2>
      <div className="space-y-2">
        {threadRoots.map(({ root, count }) => (
          <button
            key={root.id}
            onClick={() => onOpenThread?.(root.id)}
            className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Image
                src={root.avatarUrl}
                alt={root.name}
                width={20}
                height={20}
                className="rounded"
              />
              <span className="text-blue-600 text-sm truncate">
                {count} reply{count === 1 ? "" : "ies"}
              </span>
              <span className="text-gray-600 text-sm truncate">
                View thread
              </span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
