import avatarUrl from "@/assets/images/hero.jpeg";
import {
  FileIcon,
  DownloadIcon,
  MoreHorizontalIcon,
  ImageIcon,
  FileTextIcon,
  ArchiveIcon,
} from "lucide-react";
import Image from "next/image";

interface FileItem {
  id: string;
  name: string;
  type: "image" | "document" | "archive" | "other";
  size: string;
  uploadedBy: {
    name: string;
    avatar: string;
  };
  uploadedAt: string;
  url: string;
}

const files: FileItem[] = [
  {
    id: "1",
    name: "UI-Kit-v2.fig",
    type: "other",
    size: "2.4 MB",
    uploadedBy: {
      name: "Daniel Anderson",
      avatar: avatarUrl.src,
    },
    uploadedAt: "Yesterday",
    url: "#",
  },
  {
    id: "2",
    name: "Design-System-Docs.pdf",
    type: "document",
    size: "1.8 MB",
    uploadedBy: {
      name: "Andrew M.",
      avatar: avatarUrl.src,
    },
    uploadedAt: "3 days ago",
    url: "#",
  },
  {
    id: "3",
    name: "mockup-homepage.png",
    type: "image",
    size: "847 KB",
    uploadedBy: {
      name: "William Johnson",
      avatar: avatarUrl.src,
    },
    uploadedAt: "1 week ago",
    url: "#",
  },
  {
    id: "4",
    name: "assets.zip",
    type: "archive",
    size: "5.2 MB",
    uploadedBy: {
      name: "Emily Davis",
      avatar: avatarUrl.src,
    },
    uploadedAt: "2 weeks ago",
    url: "#",
  },
];

const getFileIcon = (type: FileItem["type"]) => {
  switch (type) {
    case "image":
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    case "document":
      return <FileTextIcon className="w-5 h-5 text-red-500" />;
    case "archive":
      return <ArchiveIcon className="w-5 h-5 text-orange-500" />;
    default:
      return <FileIcon className="w-5 h-5 text-gray-500" />;
  }
};

interface FilesPanelProps {
  channelId: string;
  workspaceId: string;
}

export default function FilesPanel({
  channelId,
  workspaceId,
}: FilesPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Files</h3>
        <span className="text-xs text-gray-500">{files.length} files</span>
      </div>

      {files.length > 0 ? (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
            >
              <div className="flex-shrink-0">{getFileIcon(file.type)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {file.size}
                  </span>
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <Image
                    src={file.uploadedBy.avatar}
                    alt={file.uploadedBy.name}
                    width={16}
                    height={16}
                    className="w-4 h-4 rounded-full"
                  />
                  <span className="text-xs text-gray-500">
                    {file.uploadedBy.name} • {file.uploadedAt}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 hover:bg-gray-200 rounded">
                  <DownloadIcon className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <MoreHorizontalIcon className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FileIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No files shared yet</p>
        </div>
      )}
    </div>
  );
}
