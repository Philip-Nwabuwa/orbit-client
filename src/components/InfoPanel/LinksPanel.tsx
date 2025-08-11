import avatarUrl from "@/assets/images/hero.jpeg";
import { ExternalLinkIcon, GlobeIcon, MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface LinkItem {
  id: string;
  url: string;
  title: string;
  description?: string;
  domain: string;
  sharedBy: {
    name: string;
    avatar: string;
  };
  sharedAt: string;
  thumbnail?: string;
}

const links: LinkItem[] = [
  {
    id: "1",
    url: "https://www.figma.com/design-systems",
    title: "Design Systems in Figma",
    description:
      "Learn how to build and maintain design systems using Figma's powerful features and collaborative tools.",
    domain: "figma.com",
    sharedBy: {
      name: "Daniel Anderson",
      avatar: avatarUrl.src,
    },
    sharedAt: "2 days ago",
    thumbnail: "/api/placeholder/60/40",
  },
  {
    id: "2",
    url: "https://tailwindcss.com/docs",
    title: "Tailwind CSS Documentation",
    description:
      "A utility-first CSS framework for rapidly building custom designs.",
    domain: "tailwindcss.com",
    sharedBy: {
      name: "Emily Davis",
      avatar: avatarUrl.src,
    },
    sharedAt: "5 days ago",
    thumbnail: "/api/placeholder/60/40",
  },
  {
    id: "3",
    url: "https://github.com/company/ui-components",
    title: "UI Components Repository",
    domain: "github.com",
    sharedBy: {
      name: "Andrew M.",
      avatar: avatarUrl.src,
    },
    sharedAt: "1 week ago",
  },
  {
    id: "4",
    url: "https://dribbble.com/shots/modern-dashboard",
    title: "Modern Dashboard Design Inspiration",
    description:
      "Collection of modern dashboard designs for inspiration and reference.",
    domain: "dribbble.com",
    sharedBy: {
      name: "William Johnson",
      avatar: avatarUrl.src,
    },
    sharedAt: "2 weeks ago",
    thumbnail: "/api/placeholder/60/40",
  },
];

interface LinksPanelProps {
  channelId: string;
  workspaceId: string;
}

export default function LinksPanel({
  channelId,
  workspaceId,
}: LinksPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Shared Links</h3>
        <span className="text-xs text-gray-500">{links.length} links</span>
      </div>

      {links.length > 0 ? (
        <div className="space-y-4">
          {links.map((link) => (
            <div
              key={link.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex space-x-3">
                {link.thumbnail ? (
                  <Image
                    src={link.thumbnail}
                    alt=""
                    width={60}
                    height={40}
                    className="w-15 h-10 rounded bg-gray-100 flex-shrink-0 object-cover"
                  />
                ) : (
                  <div className="w-15 h-10 rounded bg-gray-100 flex-shrink-0 flex items-center justify-center">
                    <GlobeIcon className="w-5 h-5 text-gray-400" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 leading-tight"
                      >
                        {link.title}
                      </Link>
                      {link.description && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                          {link.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-1 mt-2">
                        <span className="text-xs text-gray-500">
                          {link.domain}
                        </span>
                        <ExternalLinkIcon className="w-3 h-3 text-gray-400" />
                      </div>
                    </div>

                    <button className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <MoreHorizontalIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
                    <Image
                      src={link.sharedBy.avatar}
                      alt={link.sharedBy.name}
                      width={16}
                      height={16}
                      className="w-4 h-4 rounded-full"
                    />
                    <span className="text-xs text-gray-500">
                      Shared by {link.sharedBy.name} • {link.sharedAt}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <GlobeIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No links shared yet</p>
        </div>
      )}
    </div>
  );
}
