"use client";

import { useEffect, useRef } from "react";
import { Authenticated, useMutation } from "convex/react";

import { api } from "@convex-generated/api";

function EnsureUserInner() {
  const ran = useRef(false);
  const upsert = useMutation(api.users.upsertFromClerk);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    void upsert({});
  }, [upsert]);

  return null;
}

export function EnsureUser() {
  return (
    <Authenticated>
      <EnsureUserInner />
    </Authenticated>
  );
}

