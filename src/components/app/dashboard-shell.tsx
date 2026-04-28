"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Sidebar } from "@/components/app/sidebar";
import type { NavLink } from "@/components/app/nav-links";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function DashboardShell({
  sidebarTitle,
  links,
  children,
}: {
  sidebarTitle: string;
  links: NavLink[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-muted/20">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1400px]">
        <Sidebar title={sidebarTitle} links={links} />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-14 items-center gap-2 border-b bg-background px-3 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>{sidebarTitle}</SheetTitle>
                </SheetHeader>
                <nav className="mt-4 space-y-1">
                  {links.map((l) => {
                    const Icon = l.icon;
                    return (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{l.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
            <div className="text-sm font-semibold tracking-tight">
              {sidebarTitle}
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

