export default function LinkedThreads() {
  const threads = [
    { id: "1", name: "Front-end", count: 4 },
    { id: "2", name: "UI-kit design standards", count: null },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Linked threads
      </h2>
      <div className="space-y-2">
        {threads.map((thread) => (
          <div
            key={thread.id}
            className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">#</span>
              <span className="text-gray-700 text-sm">{thread.name}</span>
            </div>
            {thread.count && (
              <span className="text-gray-500 text-sm">{thread.count}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
