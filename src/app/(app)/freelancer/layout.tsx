import { RequireRole } from "@/components/app/require-role";

export default function FreelancerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireRole role="freelancer">{children}</RequireRole>;
}

