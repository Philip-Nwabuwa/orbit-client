import MessageComposer from "./MessageComposer";
import MessageList from "./MessageList";

export default function ChannelView() {
  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <MessageList />
      </div>

      {/* Composer */}
      <MessageComposer />
    </div>
  );
}
