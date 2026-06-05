"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const isDark = storedTheme === "dark" || (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const initialTheme = isDark ? "dark" : "light";
    setTheme(initialTheme);
    
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

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

  // Skip showing navbar on dashboard, onboarding, and auth routes
  const isAuthOrOnboarding = pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/onboarding");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  if (isAuthOrOnboarding || isDashboardRoute) return null;

  const isLandingPage = pathname === "/";

  return (
    <header className={`w-full z-40 bg-transparent transition-all duration-200 ${isDashboardRoute ? "border-b border-surface-stroke py-2" : "py-4"}`}>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        
        {/* Left Side: Brand Logo (Only show on non-dashboard route since Dashboard has it in Sidebar) */}
        {!isDashboardRoute ? (
          <Link href="/" className="text-xl font-bold tracking-tight text-on-background">
            AtmosIQ
          </Link>
        ) : (
          <div className="w-1" /> // empty spacer
        )}

        {/* Center: Main Links */}
        <nav className="flex items-center gap-6 text-sm font-semibold">
          <Link 
            href="#" 
            className="text-on-background relative py-1 border-b-2 border-primary"
          >
            Features
          </Link>
          <Link 
            href="#" 
            className="text-on-surface-variant hover:text-on-background transition-colors py-1"
          >
            Industries
          </Link>
          <Link 
            href="#" 
            className="text-on-surface-variant hover:text-on-background transition-colors py-1"
          >
            About
          </Link>
        </nav>

        {/* Right Side: Theme, Auth buttons */}
        <div className="flex items-center gap-6">
          <button
            onClick={toggleTheme}
            className="text-on-surface-variant hover:text-on-background transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4.5 w-4.5" />
            ) : (
              <Moon className="h-4.5 w-4.5" />
            )}
          </button>

          <Link
            href="/login"
            className="text-sm font-semibold text-on-surface-variant hover:text-on-background transition-colors"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="h-9 px-4 inline-flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-colors shadow-lg shadow-primary/10"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
