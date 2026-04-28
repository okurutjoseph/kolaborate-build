import Link from "next/link";

import { Button } from "@/components/ui/button";

export function AppHeader({
  title,
  subtitle,
  cta,
}: {
  title: string;
  subtitle?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold tracking-tight">
          {title}
        </div>
        {subtitle ? (
          <div className="truncate text-xs text-muted-foreground">
            {subtitle}
          </div>
        ) : null}
      </div>
      {cta ? (
        <Button asChild size="sm">
          <Link href={cta.href}>{cta.label}</Link>
        </Button>
      ) : null}
    </header>
  );
}

