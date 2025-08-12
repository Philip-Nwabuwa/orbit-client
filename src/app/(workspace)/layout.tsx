import type { Metadata } from "next";
import AppDock from "@/components/AppDock/AppDock";
import Sidebar from "@/components/Sidebar/Sidebar";

export const metadata: Metadata = {
  title: "Collabix - Team Collaboration",
  description:
    "Modern team collaboration platform for seamless communication and project management",
};

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <AppDock />
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
