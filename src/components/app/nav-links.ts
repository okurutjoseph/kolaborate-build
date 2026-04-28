import {
  BriefcaseBusiness,
  LayoutDashboard,
  Search,
  Settings,
  UserRound,
} from "lucide-react";

export type NavLink = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

export const clientNav: NavLink[] = [
  { href: "/client/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/client/projects/new", label: "New project", icon: BriefcaseBusiness },
  { href: "/client/settings", label: "Settings", icon: Settings },
];

export const freelancerNav: NavLink[] = [
  { href: "/freelancer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/freelancer/matches", label: "Matches", icon: Search },
  { href: "/freelancer/profile", label: "Profile", icon: UserRound },
  { href: "/freelancer/settings", label: "Settings", icon: Settings },
];

