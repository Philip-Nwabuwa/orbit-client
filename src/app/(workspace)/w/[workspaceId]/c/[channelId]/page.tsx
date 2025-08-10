export default async function ChannelPage({
  params,
}: {
  params: Promise<{ workspaceId: string; channelId: string }>;
}) {
  const { workspaceId, channelId } = await params;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-black">Channel: {channelId}</h1>
      <p className="text-gray-600 mt-2">Workspace: {workspaceId}</p>
    </div>
  );
}
