import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MarketingHome() {
  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12">
        <header className="flex items-center justify-between">
          <div className="text-sm font-semibold tracking-tight">Kolaborate</div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-up">Get started</Link>
            </Button>
          </div>
        </header>

        <main className="grid gap-6 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <Badge variant="secondary">Build Challenge MVP</Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-tight">
              AI-guided project briefs and transparent matching.
            </h1>
            <p className="text-pretty text-muted-foreground">
              Clients turn rough ideas into scoped projects. Freelancers get
              matches with clear requirements and fit reasons.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/sign-up">Create an account</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/onboarding/role">Choose a role</Link>
              </Button>
            </div>
          </div>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="text-sm font-semibold">What you can do</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Client: AI-assisted project creation</li>
                <li>• Freelancer: profile + match feed</li>
                <li>• Shared: clean dashboard shell</li>
              </ul>
              <div className="text-xs text-muted-foreground">
                Next: Clerk auth + Convex backend + OpenAI brief analysis.
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}

