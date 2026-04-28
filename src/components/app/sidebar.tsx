import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavLink } from "@/components/app/nav-links";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export function Sidebar({
  title,
  links,
}: {
  title: string;
  links: NavLink[];
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-background">
      <div className="flex h-16 items-center px-5">
        <div className="flex flex-col leading-tight">
          <div className="text-sm font-semibold tracking-tight">{title}</div>
          <div className="text-xs text-muted-foreground">
            Build Challenge MVP
          </div>
        </div>
      </div>
      <Separator />
      <nav className="flex-1 px-3 py-3">
        <div className="space-y-1">
          {links.map((l) => {
            const active =
              pathname === l.href ||
              (pathname?.startsWith(l.href) && l.href !== "/");
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{l.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="px-5 py-4 text-xs text-muted-foreground">
        Kolaborate · v0.1
      </div>
    </aside>
  );
}

