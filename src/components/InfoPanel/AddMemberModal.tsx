"use client";

import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMemberStore } from "@/store/memberStore";
import heroImage from "@/assets/images/hero.jpeg";
import { apiClient } from "@/lib/api";

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
}

function parseEmails(text: string): string[] {
  const parts = text
    .split(/[\n,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;
  const unique = Array.from(new Set(parts));
  return unique.filter((e) => emailRegex.test(e));
}

export default function AddMemberModal({
  open,
  onOpenChange,
  workspaceId,
}: AddMemberModalProps) {
  const { addMember } = useMemberStore();
  const [emailsInput, setEmailsInput] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emails = useMemo(() => parseEmails(emailsInput), [emailsInput]);
  const canSubmit = emails.length > 0 && !isSubmitting;

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    setError(null);
    try {
      // Best-effort API call. Backend should send invites and return created/pending users.
      // We optimistically add to local store for demo purposes.
      await apiClient.post("/workspaces/invite", {
        workspaceId,
        emails,
        role,
      });
    } catch (err: any) {
      // Continue optimistically even if API route isn't available in this demo.
      // Surface message for visibility.
      setError(err?.message ?? "Failed to invite. Adding locally.");
    }

    emails.forEach((email, index) => {
      const localPart = email.split("@")[0];
      addMember({
        id: `user-${Date.now()}-${index}`,
        name: localPart.replace(/[._-]/g, " ") || email,
        role: role === "admin" ? "Admin" : "Member",
        avatarUrl: heroImage.src,
        department: undefined,
        isOffline: false,
      });
    });

    setIsSubmitting(false);
    onOpenChange(false);
    setEmailsInput("");
    setRole("member");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite people to this workspace</DialogTitle>
          <DialogDescription>
            Add one or more email addresses. We’ll send an invite and add them
            to your workspace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email addresses
            </label>
            <textarea
              value={emailsInput}
              onChange={(e) => setEmailsInput(e.target.value)}
              rows={3}
              placeholder="user1@example.com, user2@example.com"
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate with commas, spaces, or line breaks. {emails.length}{" "}
              valid
              {emails.length === 1 ? " email" : " emails"} detected.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "member" | "admin")}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
              {error}
            </div>
          )}
        </form>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            disabled={!canSubmit}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Inviting..." : "Send Invites"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
