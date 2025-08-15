import { Metadata } from "next";
import Image from "next/image";

import LoginFlow from "@/components/auth/LoginFlow";
import dashboardPreview from "../../../../public/dashboard-preview.png";

export const metadata: Metadata = {
  title: "Collabix - Login",
  description:
    "Secure document collaboration made simple. Sign in to access your workspace.",
};

export default function LoginPage() {
  return (
    <main className="h-screen grid grid-cols-7 bg-white p-4">
      <div className="hidden lg:block col-span-3">
        <LoginFlow />
      </div>

      <div className="lg:block col-span-4 bg-gray-50 rounded-2xl pl-20 pt-10 h-full flex flex-col">
        <div className="flex flex-col">
          <div className="relative h-[600px]">
            <Image
              src={dashboardPreview}
              alt="Dashboard Preview"
              className="w-full h-full object-cover rounded-[12px]"
            />
            <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-white to-transparent rounded-b-[13px]" />
          </div>

          <div className="flex flex-col mt-10 flex-shrink-0">
            <h1 className="text-5xl font-medium text-gray-900 mb-4 leading-tight">
              Comprehensive CRM <br /> solution for your business
            </h1>
            <p className="text-gray-600 text-xl leading-relaxed max-w-2xl">
              A complete and comprehensive CRM solution designed to streamline
              customer relationships, optimize sales processes, and drive
              business growth through powerful automation and real-time
              insights.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
