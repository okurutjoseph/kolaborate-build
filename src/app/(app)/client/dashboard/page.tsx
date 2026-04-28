"use client";

import Link from "next/link";
import { useQuery } from "convex/react";

import { DashboardShell } from "@/components/app/dashboard-shell";
import { clientNav } from "@/components/app/nav-links";
import { AppHeader } from "@/components/app/app-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { api } from "@convex-generated/api";

export default function ClientDashboardPage() {
  const projects = useQuery(api.projects.listMyProjects);

  return (
    <DashboardShell sidebarTitle="Client" links={clientNav}>
      <AppHeader
        title="Client dashboard"
        subtitle="Create a project and get matched with the right freelancers."
        cta={{ label: "New project", href: "/client/projects/new" }}
      />
      <main className="flex-1 p-4 lg:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <div className="text-sm font-semibold">Active projects</div>
            {projects === undefined ? (
              <div className="mt-2 text-sm text-muted-foreground">Loading…</div>
            ) : projects.length === 0 ? (
              <div className="mt-2 text-sm text-muted-foreground">
                No projects yet. Create your first one.
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                {projects.slice(0, 5).map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {p.title}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        Status: {p.status}
                      </div>
                    </div>
                    <Badge variant="secondary">Open</Badge>
                  </div>
                ))}
                <Button asChild variant="outline" size="sm">
                  <Link href="/client/projects/new">Create another</Link>
                </Button>
              </div>
            )}
          </Card>
          <Card className="p-5">
            <div className="text-sm font-semibold">Top matches</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Matches will appear after you create a project.
            </div>
          </Card>
        </div>
      </main>
    </DashboardShell>
  );
}

