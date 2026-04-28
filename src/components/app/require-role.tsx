"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";

import { api } from "@convex-generated/api";

function RequireRoleInner({
  role,
  children,
}: {
  role: "client" | "freelancer";
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const me = useQuery(api.users.getMe);

  useEffect(() => {
    if (me === undefined) return;
    if (!me?.role) {
      if (pathname !== "/onboarding/role") router.replace("/onboarding/role");
      return;
    }
    if (me.role !== role) {
      router.replace(me.role === "client" ? "/client/dashboard" : "/freelancer/dashboard");
    }
  }, [me, pathname, role, router]);

  if (me === undefined) return null;
  if (!me?.role) return null;
  if (me.role !== role) return null;
  return <>{children}</>;
}

export function RequireRole({
  role,
  children,
}: {
  role: "client" | "freelancer";
  children: React.ReactNode;
}) {
  return (
    <>
      <Unauthenticated>{null}</Unauthenticated>
      <Authenticated>
        <RequireRoleInner role={role}>{children}</RequireRoleInner>
      </Authenticated>
    </>
  );
}

