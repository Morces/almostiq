"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Check, 
  Sun, 
  Moon, 
  WashingMachine, 
  Truck, 
  Calendar, 
  Tractor, 
  Tent, 
  Wrench, 
  Compass, 
  Bed,
  ArrowRight
} from "lucide-react";
import { getCurrentUser, setCurrentUser, syncUserProfile } from "@/lib/state";
import { UserProfile } from "@/types/recommendation";

interface OnboardingIndustry {
  id: string;
  title: string;
  description: string;
  icon: any;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>(["logistics", "construction"]); // initial design selection
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    setUser(getCurrentUser());
    
    const storedTheme = localStorage.getItem("theme");
    const isDark = storedTheme === "dark" || (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setTheme(isDark ? "dark" : "light");
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

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    const updatedUser = {
      ...user,
      industries: selectedIds
    };
    await syncUserProfile(updatedUser);
    router.push("/dashboard");
  };

  const onboardingIndustries: OnboardingIndustry[] = [
    {
      id: "laundry",
      title: "Laundry",
      description: "Optimize cycles based on humidity.",
      icon: WashingMachine
    },
    {
      id: "logistics",
      title: "Logistics",
      description: "Predictive routing for weather events.",
      icon: Truck
    },
    {
      id: "agriculture",
      title: "Agriculture",
      description: "Precision irrigation and crop safety.",
      icon: Tractor
    },
    {
      id: "events",
      title: "Outdoor Events",
      description: "Operational safety for mass gatherings.",
      icon: Tent
    },
    {
      id: "construction",
      title: "Construction",
      description: "Site management and storm planning.",
      icon: Wrench
    },
    {
      id: "solar",
      title: "Solar Energy",
      description: "Cloud coverage and yield analysis.",
      icon: Sun
    },
    {
      id: "travel",
      title: "Travel",
      description: "Destination climate forecasting.",
      icon: Compass
    },
    {
      id: "hospitality",
      title: "Hospitality",
      description: "Guest experience atmospheric control.",
      icon: Bed
    }
  ];

  return (
    <div className="relative min-h-screen bg-background text-on-background flex flex-col justify-between overflow-x-hidden">
      
      {/* Onboarding Header */}
      <header className="w-full py-4 border-b border-surface-stroke bg-transparent">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 h-10">
          <span className="text-xl font-bold tracking-tight text-on-background">AtmosIQ</span>
          
          <div className="flex items-center gap-4">
            {/* Step progress label */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-surface-stroke bg-surface-container-low text-label-mono text-[9px] font-bold text-text-muted">
              Step 2 of 2
              <div className="h-1 w-6 bg-surface-stroke rounded-full overflow-hidden ml-1">
                <div className="h-full bg-primary w-full rounded-full" />
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="text-on-surface-variant hover:text-on-background transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="mx-auto max-w-5xl px-6 py-12 flex flex-col items-center gap-10 flex-1 justify-center z-10 w-full">
        <div className="text-center flex flex-col gap-2 max-w-xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            What industries do you work in?
          </h1>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            You can select multiple. AtmosIQ will personalize recommendations for your business.
          </p>
        </div>

        {/* 8-Grid Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full relative pb-10">
          {onboardingIndustries.map((ind) => {
            const Icon = ind.icon;
            const isSelected = selectedIds.includes(ind.id);
            return (
              <button
                key={ind.id}
                onClick={() => handleToggle(ind.id)}
                className={`relative flex flex-col text-center items-center justify-center p-6 rounded-lg border transition-all min-h-[160px] ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/5"
                    : "border-surface-stroke bg-surface-container-low hover:border-outline-variant"
                }`}
              >
                {/* Check icon indicator inside selected cards at top right */}
                {isSelected && (
                  <div className="absolute top-3 right-3 h-5.5 w-5.5 rounded-full bg-primary text-on-primary border border-primary/20 flex items-center justify-center shadow">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                )}

                <div className={`h-11 w-11 flex items-center justify-center rounded-full border mb-4 transition-colors ${
                  isSelected ? "bg-primary/15 border-primary/30 text-primary" : "bg-primary/5 border-surface-stroke text-primary"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="font-bold text-sm text-on-background mb-1">{ind.title}</h3>
                <p className="text-[10px] text-on-surface-variant leading-normal max-w-[140px]">
                  {ind.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Floating Continue Button */}
        <div className="relative z-20 mt-4">
          <button
            onClick={handleSave}
            disabled={selectedIds.length === 0}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary-container disabled:opacity-50 transition-all px-8 shadow-lg shadow-primary/25 hover:shadow-primary/35"
          >
            Continue to Dashboard <ArrowRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </main>

      {/* Onboarding Footer */}
      <footer className="w-full border-t border-surface-stroke py-6 px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] text-text-muted font-bold tracking-widest text-label-mono bg-background">
        <div className="flex items-center gap-3">
          <span>AtmosIQ</span>
          <span>© 2024 AtmosIQ. Actionable Intelligence for a Changing Climate.</span>
        </div>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-on-background transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-on-background transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-on-background transition-colors">Contact Support</Link>
        </div>
      </footer>
    </div>
  );
}
