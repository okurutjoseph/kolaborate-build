"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";

import { api } from "@convex-generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

function FreelancerOnboardingInner() {
  const router = useRouter();
  const me = useQuery(api.users.getMe);

  if (!me) return null;

  if (me.role !== "freelancer") {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <Card className="p-6">
          <div className="space-y-3">
            <div className="text-sm font-semibold">Wrong role</div>
            <div className="text-sm text-muted-foreground">
              Your account is set as <span className="font-medium">{me.role ?? "unknown"}</span>.
            </div>
            <Button asChild className="w-full">
              <Link href="/onboarding/role">Back to role selection</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12">
      <div className="space-y-2">
        <Badge variant="secondary">Freelancer onboarding</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">
          Build your profile basics
        </h1>
        <p className="text-muted-foreground">
          This MVP step helps matching. We’ll add richer inputs later.
        </p>
      </div>

      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g. Full-stack developer" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Top skills (comma-separated)</Label>
            <Input id="skills" placeholder="React, Next.js, Node.js" />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="/freelancer/dashboard">Skip for now</Link>
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/freelancer/dashboard")}
          >
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function FreelancerOnboardingPage() {
  return (
    <div className="min-h-dvh bg-muted/20">
      <Unauthenticated>
        <div className="mx-auto max-w-lg px-4 py-12">
          <Card className="p-6">
            <div className="space-y-3">
              <div className="text-sm font-semibold">Sign in required</div>
              <div className="text-sm text-muted-foreground">
                Please sign in, then return to onboarding.
              </div>
              <Button asChild className="w-full">
                <Link href="/sign-in">Go to sign in</Link>
              </Button>
            </div>
          </Card>
        </div>
      </Unauthenticated>
      <Authenticated>
        <FreelancerOnboardingInner />
      </Authenticated>
    </div>
  );
}

