"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Cpu, 
  History, 
  Settings, 
  SlidersHorizontal,
  Bookmark,
  Building,
  Sparkles,
  Plus,
  Sun,
  Moon,
  User,
  LogOut
} from "lucide-react";
import { getCurrentUser, fetchUserProfile, setCurrentUser } from "@/lib/state";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [user, setUser] = useState<any>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (!popoverOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".avatar-popover-container")) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [popoverOpen]);

  const handleLogout = () => {
    setPopoverOpen(false);
    setCurrentUser(null);
    router.push("/login");
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const isDark = storedTheme === "dark" || (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setTheme(isDark ? "dark" : "light");

    const localUser = getCurrentUser();
    setUser(localUser);

    fetchUserProfile(localUser.id).then((profile) => {
      if (profile) {
        setUser(profile);
      }
    });
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "MC";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/ai", label: "AI Assistant", icon: Cpu },
    { href: "/dashboard/recommendations", label: "Recommendations", icon: Bookmark },
    { href: "/dashboard/history", label: "History", icon: History },
    { href: "/onboarding", label: "Industries", icon: Building },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background text-on-background w-full overflow-hidden">
      {/* Sidebar Panel */}
      <aside className="w-60 bg-surface border-r border-surface-stroke flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="flex flex-col gap-6 p-6">
          {/* Logo */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xl font-bold tracking-tight text-on-background">AtmosIQ</span>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-secondary/5 border border-secondary/15 text-secondary w-fit">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <div className="flex flex-col text-left">
                <span className="text-[7.5px] font-bold uppercase tracking-widest leading-none text-label-mono">Command Center</span>
                <span className="text-[7.5px] text-on-surface-variant font-medium leading-none text-label-mono mt-0.5">AI Decision Engine</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 mt-4">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? "bg-primary text-on-primary shadow shadow-primary/20"
                      : "text-on-surface-variant hover:text-on-background hover:bg-surface-container"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Button inside sidebar */}
        <div className="p-6">
          <Link
            href="/dashboard/ai"
            className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-surface-stroke text-on-surface hover:text-on-background hover:bg-surface-container transition-all text-xs font-bold"
          >
            <Plus className="h-4 w-4" />
            New Analysis
          </Link>
        </div>
      </aside>

      {/* Main Canvas Panel */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header inside main canvas */}
        <header className="w-full border-b border-surface-stroke py-3 flex items-center justify-end px-8 bg-transparent shrink-0">
          <div className="flex items-center justify-end gap-4">
            <button onClick={toggleTheme} className="text-on-surface-variant hover:text-on-background transition-colors" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
            <div className="relative avatar-popover-container">
              <button 
                onClick={() => setPopoverOpen(!popoverOpen)}
                className="h-8 w-8 rounded-full border border-primary/20 bg-primary/10 flex items-center justify-center font-bold text-xs text-primary shadow hover:bg-primary/20 transition-all focus:outline-none" 
                title={user?.name || "User Profile"}
              >
                {getInitials(user?.name || "Moses")}
              </button>

              {popoverOpen && (
                <div className="absolute right-0 mt-2.5 w-56 rounded-xl border border-surface-stroke bg-surface-container-low p-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 border-b border-surface-stroke mb-1 text-left">
                    <span className="block text-xs font-bold text-on-background truncate">
                      {user?.name || "Moses"}
                    </span>
                    <span className="block text-[10px] text-on-surface-variant truncate font-medium mt-0.5">
                      {user?.email || "moses@example.com"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setPopoverOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:text-on-background hover:bg-surface-container transition-colors text-left"
                    >
                      <User className="h-3.5 w-3.5" />
                      View Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-error hover:bg-error/10 transition-colors text-left w-full"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Child Views */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
