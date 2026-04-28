"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { DashboardShell } from "@/components/app/dashboard-shell";
import { freelancerNav } from "@/components/app/nav-links";
import { AppHeader } from "@/components/app/app-header";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { api } from "@convex-generated/api";

function FreelancerProfileForm({
  initialTitle,
  initialSkills,
  initialBio,
}: {
  initialTitle: string;
  initialSkills: string;
  initialBio: string;
}) {
  const upsert = useMutation(api.freelancers.upsertMyProfile);

  const [title, setTitle] = useState(initialTitle);
  const [skills, setSkills] = useState(initialSkills);
  const [bio, setBio] = useState(initialBio);
  const [saving, setSaving] = useState(false);

  const skillsList = useMemo(
    () =>
      skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 30),
    [skills]
  );

  async function onSave() {
    setSaving(true);
    try {
      await upsert({
        title: title.trim() || undefined,
        bio: bio.trim() || undefined,
        skills: skillsList,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="p-5">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Full-stack developer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Top skills (comma-separated)</Label>
            <Input
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, Next.js, Node.js"
            />
            <div className="flex flex-wrap gap-2">
              {skillsList.slice(0, 8).map((s) => (
                <Badge key={s} variant="secondary">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short paragraph about what you do best…"
            className="min-h-28"
          />
        </div>

        <div className="flex items-center justify-end">
          <Button type="button" onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : "Save profile"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function FreelancerProfilePage() {
  const profile = useQuery(api.freelancers.getMyProfile);

  return (
    <DashboardShell sidebarTitle="Freelancer" links={freelancerNav}>
      <AppHeader
        title="Profile"
        subtitle="Your skills and preferences drive better matching."
      />
      <main className="flex-1 p-4 lg:p-6">
        {profile === undefined ? (
          <Card className="p-5">
            <div className="text-sm text-muted-foreground">Loading…</div>
          </Card>
        ) : (
          <FreelancerProfileForm
            key={profile?._id ?? "new"}
            initialTitle={profile?.title ?? ""}
            initialSkills={(profile?.skills ?? []).join(", ")}
            initialBio={profile?.bio ?? ""}
          />
        )}
      </main>
    </DashboardShell>
  );
}

