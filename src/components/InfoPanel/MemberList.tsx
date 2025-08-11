"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useMemberStore } from "@/store/memberStore";

interface Member {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  department?: string;
  isOffline?: boolean;
}

interface MembersListProps {
  channelId: string;
  workspaceId: string;
}

export default function MembersList({
  channelId,
  workspaceId,
}: MembersListProps) {
  const { members, initializeMembers } = useMemberStore();

  useEffect(() => {
    if (members.length === 0) {
      initializeMembers();
    }
  }, [members.length, initializeMembers]);

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "Design":
        return "bg-green-100 text-green-800";
      case "Management":
        return "bg-orange-100 text-orange-800";
      case "Development":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const onlineMembers = members.filter((m) => !m.isOffline);
  const offlineMembers = members.filter((m) => m.isOffline);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-900">Members</h2>
          <span className="text-gray-400 text-sm">{members.length}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1 hover:bg-gray-100 rounded">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Online Members */}
        {onlineMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src={member.avatarUrl}
                  alt={member.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {member.name}
                </p>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getDepartmentColor(
                member.department || ""
              )}`}
            >
              {member.department}
            </span>
          </div>
        ))}

        {/* Offline Section */}
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-3">Offline</p>
          {offlineMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center space-x-3 opacity-60"
            >
              <div className="relative">
                <Image
                  src={member.avatarUrl}
                  alt={member.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full opacity-60"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 border-2 border-white rounded-full"></span>
              </div>
              <div className="opacity-60">
                <p className="text-sm font-medium text-gray-900">
                  {member.name}
                </p>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
