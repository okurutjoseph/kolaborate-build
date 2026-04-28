import type { Metadata } from "next";

import { EnsureUser } from "@/components/app/ensure-user";

export const metadata: Metadata = {
  title: "Kolaborate",
  description: "AI-powered freelancing workflow",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EnsureUser />
      {children}
    </>
  );
}

