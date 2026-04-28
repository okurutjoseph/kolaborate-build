"use client";

import { DashboardShell } from "@/components/app/dashboard-shell";
import { freelancerNav } from "@/components/app/nav-links";
import { AppHeader } from "@/components/app/app-header";
import { Card } from "@/components/ui/card";

export default function FreelancerDashboardPage() {
  return (
    <DashboardShell sidebarTitle="Freelancer" links={freelancerNav}>
      <AppHeader
        title="Freelancer dashboard"
        subtitle="Complete your profile to get better matches."
        cta={{ label: "View matches", href: "/freelancer/matches" }}
      />
      <main className="flex-1 p-4 lg:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <div className="text-sm font-semibold">Your profile</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Add skills, rate, and availability.
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-sm font-semibold">New matches</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Matches will appear once projects exist.
            </div>
          </Card>
        </div>
      </main>
    </DashboardShell>
  );
}

