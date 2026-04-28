"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAction, useMutation } from "convex/react";

import { DashboardShell } from "@/components/app/dashboard-shell";
import { clientNav } from "@/components/app/nav-links";
import { AppHeader } from "@/components/app/app-header";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { api } from "@convex-generated/api";

export default function NewProjectPage() {
  const router = useRouter();
  const analyze = useAction(api.ai.analyzeProjectBrief);
  const createProject = useMutation(api.projects.createProjectFromAnalysis);

  const [brief, setBrief] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<
    | null
    | {
        title: string;
        refinedBrief: string;
        extractedSkills: string[];
        deliverables: string[];
        seniority?: string;
        budgetMin?: number;
        budgetMax?: number;
        timeline?: string;
      }
  >(null);

  const canAnalyze = useMemo(() => brief.trim().length >= 20, [brief]);

  async function onAnalyze() {
    setLoading(true);
    try {
      const res = await analyze({ brief });
      setAnalysis(res);
    } finally {
      setLoading(false);
    }
  }

  async function onCreateProject() {
    if (!analysis) return;
    setLoading(true);
    try {
      await createProject({
        title: analysis.title,
        rawBrief: brief,
        refinedBrief: analysis.refinedBrief,
        extractedSkills: analysis.extractedSkills,
        deliverables: analysis.deliverables,
        seniority: analysis.seniority,
        budgetMin: analysis.budgetMin,
        budgetMax: analysis.budgetMax,
        timeline: analysis.timeline,
      });
      router.push("/client/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell sidebarTitle="Client" links={clientNav}>
      <AppHeader
        title="New project"
        subtitle="Start with a rough brief — AI will help refine it."
      />
      <main className="flex-1 p-4 lg:p-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold">Rough brief</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Describe what you want built, constraints, and success criteria.
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brief">Brief</Label>
                <Textarea
                  id="brief"
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder="Example: I need a landing page + Stripe checkout + admin dashboard..."
                  className="min-h-40"
                />
                <div className="text-xs text-muted-foreground">
                  Tip: include target users, must-have features, timeline, and budget range if you know it.
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  onClick={onAnalyze}
                  disabled={!canAnalyze || loading}
                >
                  {loading ? "Analyzing..." : "Analyze with AI"}
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            {!analysis ? (
              <div className="space-y-2">
                <div className="text-sm font-semibold">AI suggestions</div>
                <div className="text-sm text-muted-foreground">
                  Run analysis to generate a refined brief, extracted skills, and deliverables.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-sm font-semibold">Suggested title</div>
                  <div className="text-sm text-muted-foreground">{analysis.title}</div>
                </div>

                <Separator />

                <div className="space-y-1">
                  <div className="text-sm font-semibold">Refined brief</div>
                  <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {analysis.refinedBrief}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="text-sm font-semibold">Extracted skills</div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.extractedSkills.slice(0, 12).map((s) => (
                      <Badge key={s} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-semibold">Deliverables</div>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {analysis.deliverables.slice(0, 10).map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAnalysis(null)}
                    disabled={loading}
                  >
                    Reset
                  </Button>
                  <Button type="button" onClick={onCreateProject} disabled={loading}>
                    {loading ? "Creating..." : "Create project"}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </DashboardShell>
  );
}

