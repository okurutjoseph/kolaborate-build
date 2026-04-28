"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { SignInButton } from "@clerk/nextjs";

import { api } from "@convex-generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function RolePicker() {
  const router = useRouter();
  const me = useQuery(api.users.getMe);
  const setRole = useMutation(api.users.setRole);
  const [submitting, setSubmitting] = useState<"client" | "freelancer" | null>(
    null
  );

  const existingRole = useMemo(() => me?.role ?? null, [me]);

  useEffect(() => {
    if (!existingRole) return;
    router.replace(
      existingRole === "client" ? "/client/dashboard" : "/freelancer/dashboard"
    );
  }, [existingRole, router]);

  async function choose(role: "client" | "freelancer") {
    setSubmitting(role);
    try {
      await setRole({ role });
      router.push(role === "client" ? "/onboarding/client" : "/onboarding/freelancer");
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-12">
      <div className="space-y-2">
        <Badge variant="secondary">Onboarding</Badge>
        <h1 className="text-balance text-3xl font-semibold tracking-tight">
          Choose your role
        </h1>
        <p className="text-muted-foreground">
          You can switch later, but we’ll tailor onboarding based on this choice.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-3">
            <div className="text-sm font-semibold">I’m a Client</div>
            <div className="text-sm text-muted-foreground">
              Create a scoped project brief and get matched with the right talent.
            </div>
            <Button
              className="w-full"
              onClick={() => choose("client")}
              disabled={submitting !== null}
            >
              {submitting === "client" ? "Setting up..." : "Continue as client"}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-3">
            <div className="text-sm font-semibold">I’m a Freelancer</div>
            <div className="text-sm text-muted-foreground">
              Build a profile and get matches with clear requirements and fit reasons.
            </div>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => choose("freelancer")}
              disabled={submitting !== null}
            >
              {submitting === "freelancer"
                ? "Setting up..."
                : "Continue as freelancer"}
            </Button>
          </div>
        </Card>
      </div>

      <div className="text-sm text-muted-foreground">
        <Link href="/" className="underline underline-offset-4">
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default function OnboardingRolePage() {
  return (
    <div className="min-h-dvh bg-muted/20">
      <Unauthenticated>
        <div className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-12">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in to continue
          </h1>
          <p className="text-sm text-muted-foreground">
            We’ll save your role and onboarding progress to your account.
          </p>
          <div className="flex items-center gap-2">
            <SignInButton mode="modal">
              <Button>Sign in</Button>
            </SignInButton>
            <Button asChild variant="outline">
              <Link href="/sign-in">Sign in page</Link>
            </Button>
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        <RolePicker />
      </Authenticated>
    </div>
  );
}

