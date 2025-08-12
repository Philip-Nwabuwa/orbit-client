import MessageComposer from "../ChannelView/MessageComposer";
import MessageList from "../ChannelView/MessageList";

interface DMViewProps {
  dmUserId: string;
  workspaceId: string;
}

export default function DMView({ dmUserId, workspaceId }: DMViewProps) {
  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <MessageList dmUserId={dmUserId} workspaceId={workspaceId} />
      </div>

      {/* Composer */}
      <MessageComposer dmUserId={dmUserId} workspaceId={workspaceId} />
    </div>
  );
}
