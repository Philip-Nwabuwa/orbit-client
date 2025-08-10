export default async function DirectMessagePage({
  params,
}: {
  params: Promise<{ workspaceId: string; userId: string }>;
}) {
  const { workspaceId, userId } = await params;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-black">
        Direct Message with {userId}
      </h1>
      <p className="text-gray-600 mt-2">Workspace: {workspaceId}</p>
    </div>
  );
}
