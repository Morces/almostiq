"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  WashingMachine, 
  Truck, 
  Tent, 
  Activity, 
  Sparkles, 
  CheckCircle,
  ShieldAlert,
  ArrowUpRight,
  ChevronRight,
  Check
} from "lucide-react";
import { getCurrentUser, fetchUserProfile, fetchRecommendations } from "@/lib/state";
import { UserProfile } from "@/types/recommendation";

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [recs, setRecs] = useState<any[]>([]);
  const [executedIds, setExecutedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const localUser = getCurrentUser();
    setUser(localUser);

    fetchUserProfile(localUser.id).then((profile) => {
      if (profile) {
        setUser(profile);
      }
    });

    fetchRecommendations(localUser.id).then((data) => {
      if (data) {
        setRecs(data);
      }
    });
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (toastMessage) {
      timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const activeIndustries = user?.industries || ["laundry", "logistics", "events"];
  const opportunitiesCount = activeIndustries.filter((ind) => 
    ["laundry", "logistics", "events"].includes(ind)
  ).length;

  // Real Metric Calculations
  const avgConfidence = recs.length > 0
    ? `${(recs.reduce((sum, r) => sum + (r.confidence || 0), 0) / recs.length).toFixed(1)}%`
    : "91.4%";

  const latestRec = recs[0];
  const riskLevel = latestRec?.weatherData 
    ? latestRec.weatherData.windSpeed > 30 || latestRec.weatherData.rainChance > 50
      ? "Level 7.5"
      : latestRec.weatherData.windSpeed > 15 || latestRec.weatherData.rainChance > 20
        ? "Level 3.2"
        : "Level 1.2"
    : "Level 3.2";

  const riskLabel = latestRec?.weatherData
    ? latestRec.weatherData.windSpeed > 30 || latestRec.weatherData.rainChance > 50
      ? "High"
      : latestRec.weatherData.windSpeed > 15 || latestRec.weatherData.rainChance > 20
        ? "Moderate"
        : "Low"
    : "Moderate";

  const riskBadgeColor = latestRec?.weatherData
    ? latestRec.weatherData.windSpeed > 30 || latestRec.weatherData.rainChance > 50
      ? "bg-error/15 text-error border-error/20"
      : latestRec.weatherData.windSpeed > 15 || latestRec.weatherData.rainChance > 20
        ? "bg-primary/10 text-primary border-primary/20"
        : "bg-secondary/15 text-secondary border-secondary/20"
    : "bg-primary/10 text-primary border-primary/20";

  return (
    <div className="bg-background text-on-background px-8 py-8 flex flex-col gap-8 w-full max-w-7xl mx-auto">
      
      {/* Title greeting */}
      <section className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Good Morning, {user?.name || "Moses"}.
        </h1>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Today's weather is creating <span className="text-secondary font-bold">{opportunitiesCount} actionable opportunities</span> across your active sectors.
        </p>
      </section>

      {/* KPI Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weather Risk */}
        <div className="p-4 rounded-lg border border-surface-stroke bg-surface-container-low flex flex-col gap-2 relative overflow-hidden">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider text-label-mono">Weather Risk</span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-black">{riskLevel}</span>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded text-label-mono ${riskBadgeColor}`}>
              {riskLabel}
            </span>
          </div>
        </div>

        {/* AI Decisions */}
        <div className="p-4 rounded-lg border border-surface-stroke bg-surface-container-low flex flex-col gap-2 relative overflow-hidden">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider text-label-mono">AI Decisions Generated</span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-black">{recs.length}</span>
            {recs.length > 0 && (
              <span className="text-[9px] font-bold text-secondary bg-secondary/15 border border-secondary/20 px-2 py-0.5 rounded text-label-mono flex items-center gap-0.5">
                Active
              </span>
            )}
          </div>
        </div>

        {/* Industries connected */}
        <div className="p-4 rounded-lg border border-surface-stroke bg-surface-container-low flex flex-col gap-2 relative overflow-hidden">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider text-label-mono">Industries Connected</span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-black">{activeIndustries.length} Active</span>
          </div>
        </div>

        {/* Avg Confidence */}
        <div className="p-4 rounded-lg border border-surface-stroke bg-surface-container-low flex flex-col gap-2 relative overflow-hidden">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider text-label-mono">Avg Confidence Score</span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-black">{avgConfidence}</span>
          </div>
        </div>
      </section>

      {/* Priority Recommendations Title */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Priority Recommendations</h2>
          <Link href="/dashboard/history" className="text-xs font-semibold text-text-muted hover:text-on-background flex items-center gap-1 text-label-mono uppercase tracking-wider">
            View All Data Points <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Cards Layout */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Laundry Optimization Card (2/3 width) */}
          {activeIndustries.includes("laundry") && (
            <div className="lg:col-span-8 border border-surface-stroke bg-surface-container-low rounded-xl p-6 flex flex-col justify-between min-h-[260px] relative overflow-hidden">
              <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[9px] font-bold text-secondary border border-secondary/25 bg-secondary/15 px-2 py-0.5 rounded text-label-mono">
                      92% CONFIDENCE
                    </span>
                    <span className="text-[10px] font-semibold text-text-muted text-label-mono uppercase">
                      Industry: Retail & Services
                    </span>
                  </div>
                  
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <WashingMachine className="h-4.5 w-4.5" />
                  </div>
                </div>

                {/* Title & Desc */}
                <div className="flex flex-col gap-2 max-w-xl">
                  <h3 className="text-2xl font-black tracking-tight">Laundry Optimization</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Humidity levels expected to rise by 40% after 2 PM. Optimizing drying cycles now will save $2.4k in energy costs today.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 mt-6">
                {executedIds.includes("laundry-plan") ? (
                  <button
                    disabled
                    className="h-9 px-5 bg-emerald-600 text-white font-bold text-xs rounded-lg cursor-not-allowed opacity-90 flex items-center gap-1.5 shadow"
                  >
                    <Check className="h-3.5 w-3.5" /> Executed
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setExecutedIds((prev) => [...prev, "laundry-plan"]);
                      setToastMessage('⚡ Plan "Laundry Optimization" executed successfully. Dispatching commands...');
                    }}
                    className="h-9 px-5 bg-primary text-on-primary font-bold text-xs rounded-lg hover:bg-primary-container transition-colors shadow"
                  >
                    Execute Plan
                  </button>
                )}
                <Link
                  href="/dashboard/ai?industry=laundry"
                  className="h-9 px-5 border border-surface-stroke bg-surface-container-lowest text-on-surface hover:bg-surface-container hover:text-on-background text-xs font-bold rounded-lg transition-colors flex items-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          )}

          {/* Outdoor Events Card (1/3 width) */}
          {activeIndustries.includes("events") && (
            <div className="lg:col-span-4 border border-surface-stroke bg-surface-container-low rounded-xl p-6 flex flex-col justify-between min-h-[260px] relative overflow-hidden">
              <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-secondary">
                    <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-label-mono text-on-surface">Outdoor Events</h4>
                  </div>
                  
                  <span className="text-[10px] font-bold text-secondary bg-secondary/15 px-2 py-0.5 rounded text-label-mono">
                    95% CONFIDENCE
                  </span>
                </div>

                {/* Desc */}
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  High-pressure system moving in creates ideal conditions for the Sky Deck gala. No backup marquee needed.
                </p>

                {/* Parameter Metrics */}
                <div className="flex flex-col gap-2 mt-2 bg-surface-container-lowest border border-surface-stroke rounded-lg p-3">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-text-muted">Wind Speed</span>
                    <span className="font-bold text-label-mono">4mph Avg</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium border-t border-surface-stroke/50 pt-2">
                    <span className="text-text-muted">Precipitation</span>
                    <span className="font-bold text-label-mono">0.0%</span>
                  </div>
                </div>
              </div>

              {/* Button */}
              <Link
                href="/dashboard/ai?industry=events"
                className="h-9 w-full border border-surface-stroke bg-surface-container-lowest text-on-surface hover:bg-surface-container hover:text-on-background text-xs font-bold rounded-lg transition-colors flex items-center justify-center mt-4"
              >
                View Details
              </Link>
            </div>
          )}

          {/* Logistics Shift Card (Full Width) */}
          {activeIndustries.includes("logistics") && (
            <div className="lg:col-span-12 border border-surface-stroke bg-surface-container-low rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              {/* Left Column info */}
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Truck className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-lg font-bold">Logistics Shift</h3>
                </div>

                <p className="text-xs text-on-surface-variant max-w-md leading-relaxed">
                  A localized flash flood warning for District 4 suggests immediate rerouting of all hazardous cargo units.
                </p>

                <div className="flex items-center gap-4 text-xs font-bold tracking-wider text-label-mono mt-1">
                  <span className="text-primary bg-primary/10 px-2 py-0.5 rounded">88% CONFIDENCE</span>
                  <span className="text-error bg-error/10 border border-error/20 px-2 py-0.5 rounded flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3" /> Critical PRIORITY
                  </span>
                </div>
              </div>

              {/* Center route recalculation graphic */}
              <div className="w-full md:w-80 h-32 rounded-lg bg-surface-container-lowest border border-surface-stroke p-4 flex flex-col justify-between relative overflow-hidden">
                {/* Recalculating path SVG */}
                <div className="absolute inset-0 opacity-25">
                  <svg className="w-full h-full text-primary" viewBox="0 0 200 100" fill="none">
                    <circle cx="20" cy="50" r="3" fill="currentColor"/>
                    <circle cx="80" cy="20" r="3" fill="currentColor"/>
                    <circle cx="120" cy="80" r="3" fill="currentColor"/>
                    <circle cx="180" cy="40" r="3" fill="currentColor"/>
                    <path d="M20 50 Q 50 20 80 20 T 180 40" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3"/>
                    <path d="M20 50 Q 80 80 120 80 T 180 40" stroke="currentColor" strokeWidth="1.5" className="animate-pulse"/>
                  </svg>
                </div>

                <div className="mx-auto my-auto z-10">
                  <div className="px-4 py-2 rounded-full border border-secondary/20 bg-secondary/15 text-secondary text-[9.5px] font-bold text-label-mono tracking-wider animate-pulse flex items-center gap-1.5 shadow">
                    <Activity className="h-3 w-3 animate-spin-slow" />
                    Recalculating 14 Active Routes...
                  </div>
                </div>
              </div>

              {/* Right Column Action */}
              <div className="shrink-0 flex items-center md:self-stretch">
                {executedIds.includes("logistics-plan") ? (
                  <button
                    disabled
                    className="h-10 px-6 bg-emerald-600 text-white font-bold text-xs rounded-lg cursor-not-allowed opacity-90 flex items-center gap-1.5 shadow self-center md:my-auto md:w-36"
                  >
                    <Check className="h-3.5 w-3.5" /> Executed
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setExecutedIds((prev) => [...prev, "logistics-plan"]);
                      setToastMessage('⚡ Plan "Logistics Shift" executed successfully. Dispatching commands...');
                    }}
                    className="h-10 px-6 bg-primary text-on-primary font-bold text-xs rounded-lg hover:bg-primary-container transition-colors shadow self-center md:my-auto md:w-36"
                  >
                    Prioritize Pickups
                  </button>
                )}
              </div>
            </div>
          )}

          {opportunitiesCount === 0 && (
            <div className="lg:col-span-12 border border-dashed border-surface-stroke rounded-xl bg-surface-container-low py-16 text-center px-6">
              <h4 className="font-bold text-base text-on-surface">No active core sectors configured</h4>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto mt-1.5 leading-relaxed">
                You haven't selected Laundry, Logistics, or Outdoor Events in your onboarding setup. Please go to the <b>Industries</b> tab in the sidebar to configure your preferences.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface-container border border-surface-stroke text-on-surface p-4 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 max-w-sm">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div className="flex-1 flex flex-col gap-0.5">
            <span className="text-xs font-bold text-on-surface">Execution Dispatched</span>
            <span className="text-[10px] text-on-surface-variant leading-tight">
              {toastMessage}
            </span>
          </div>
        </div>
      )}

      {/* Footer info */}
      <footer className="w-full border-t border-surface-stroke py-6 text-center text-[9px] text-text-muted font-bold tracking-widest text-label-mono mt-10">
        © 2024 AtmosIQ. Actionable Intelligence for a Changing Climate.
      </footer>
    </div>
  );
}
