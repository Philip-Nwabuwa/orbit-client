export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-black">
        Workspace: {workspaceId}
      </h1>
    </div>
  );
}

// Define proper types for the component
export interface WorkspacePageProps {
  params: Promise<{ workspaceId: string }>;
}
