import { RequireRole } from "@/components/app/require-role";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <RequireRole role="client">{children}</RequireRole>;
}

