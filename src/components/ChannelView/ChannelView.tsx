import MessageComposer from "./MessageComposer";
import MessageList from "./MessageList";

interface ChannelViewProps {
  channelId?: string;
  workspaceId: string;
}

export default function ChannelView({ channelId, workspaceId }: ChannelViewProps) {
  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <MessageList channelId={channelId} workspaceId={workspaceId} />
      </div>

      {/* Composer */}
      <MessageComposer channelId={channelId} workspaceId={workspaceId} />
    </div>
  );
}
