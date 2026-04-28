"use client";

import { useQuery } from "convex/react";

import { DashboardShell } from "@/components/app/dashboard-shell";
import { freelancerNav } from "@/components/app/nav-links";
import { AppHeader } from "@/components/app/app-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { api } from "@convex-generated/api";

export default function FreelancerMatchesPage() {
  const matches = useQuery(api.matching.listMyMatches);

  return (
    <DashboardShell sidebarTitle="Freelancer" links={freelancerNav}>
      <AppHeader
        title="Matches"
        subtitle="Projects that fit your skills and availability."
      />
      <main className="flex-1 p-4 lg:p-6">
        {matches === undefined ? (
          <Card className="p-5">
            <div className="text-sm text-muted-foreground">Loading…</div>
          </Card>
        ) : matches.length === 0 ? (
          <Card className="p-5">
            <div className="text-sm font-semibold">No matches yet</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Add skills to your profile and wait for clients to create projects.
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {matches.slice(0, 8).map((m) => {
              if (!m.project) return null;
              return (
                <Card key={m._id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">
                        {m.project.title}
                      </div>
                      <div className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                        {m.project.refinedBrief}
                      </div>
                    </div>
                    <Badge variant="secondary">{m.score}/100</Badge>
                  </div>
                  {m.reasons.length > 0 ? (
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                      {m.reasons.slice(0, 3).map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  ) : null}
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </DashboardShell>
  );
}

