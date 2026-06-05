"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Bell, 
  HelpCircle, 
  Truck, 
  Sun, 
  Tractor, 
  Tent, 
  CloudRain, 
  Wind, 
  Thermometer, 
  Droplets,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Cloud,
  Check,
  X
} from "lucide-react";

interface RecommendationCard {
  id: string;
  category: "logistics" | "solar" | "agriculture" | "events";
  categoryLabel: string;
  categoryIcon: any;
  title: string;
  confidence: number;
  reasoning: string;
  tags: {
    label: string;
    value: string;
    icon: any;
  }[];
  isCritical?: boolean;
}

import { getCurrentUser, fetchUserProfile } from "@/lib/state";
import { UserProfile } from "@/types/recommendation";

const getActionPlanSteps = (category: string) => {
  switch (category) {
    case "logistics":
      return [
        "Recalculate shipping ETAs for North Region shipments.",
        "Notify freight dispatch of flooding threat on Interstate 5.",
        "Re-route hazardous units via US-97 bypass route."
      ];
    case "solar":
      return [
        "Set solar inverter grid injection targets to peak power mode.",
        "Discharge stored battery energy to grid between 13:00 and 15:00.",
        "Log grid transmission credits inside financial dashboard."
      ];
    case "agriculture":
      return [
        "Send automated command to irrigator controller to pause current schedule.",
        "Log natural precipitation volume into soil health record.",
        "Reschedule next irrigation pass for 48 hours post-storm."
      ];
    case "events":
      return [
        "Mobilize wind mitigation team to secure main stage rigging structures.",
        "Add structural tie-down anchors to dining marquees.",
        "Alert security details of potential 35mph peak wind gusts."
      ];
    default:
      return [
        "Audit atmospheric condition impacts on operation.",
        "Verify emergency protocols with facility manager.",
        "Log advisory notification in regional report logs."
      ];
  }
};

export default function RecommendationsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [executedIds, setExecutedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedRec, setSelectedRec] = useState<RecommendationCard | null>(null);

  useEffect(() => {
    const localUser = getCurrentUser();
    setUser(localUser);

    fetchUserProfile(localUser.id).then((profile) => {
      if (profile) {
        setUser(profile);
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

  const allAvailableTabs = [
    { id: "all", label: "All" },
    { id: "high", label: "High Priority" },
    { id: "logistics", label: "Logistics" },
    { id: "agriculture", label: "Agriculture" },
    { id: "events", label: "Events" },
    { id: "solar", label: "Solar" }
  ];

  // Filter tabs to keep "All" and "High Priority" and only selected onboarding industries
  const tabs = allAvailableTabs.filter(tab => 
    tab.id === "all" || 
    tab.id === "high" || 
    activeIndustries.includes(tab.id)
  );

  const recommendations: RecommendationCard[] = [
    {
      id: "rec-logistics-1",
      category: "logistics",
      categoryLabel: "Logistics",
      categoryIcon: Truck,
      title: "Reroute Northern Deliveries",
      confidence: 94,
      isCritical: true,
      reasoning: "Heavy localized flooding expected on I-5 North between 14:00 and 16:00. Projected delay for current route: 145 minutes.",
      tags: [
        { label: "Precip", value: "80%", icon: CloudRain },
        { label: "Wind", value: "12mph", icon: Wind },
        { label: "Temp", value: "54°F", icon: Thermometer }
      ]
    },
    {
      id: "rec-solar-1",
      category: "solar",
      categoryLabel: "Solar Energy",
      categoryIcon: Sun,
      title: "Grid Injection Peak: 13:00",
      confidence: 89,
      reasoning: "Clear sky window detected. Maximize battery discharge to grid during peak pricing window. Yield projected +14% above baseline.",
      tags: [
        { label: "UV Index", value: "8", icon: Sun },
        { label: "Cover", value: "5%", icon: Cloud }
      ]
    },
    {
      id: "rec-agriculture-1",
      category: "agriculture",
      categoryLabel: "Agriculture",
      categoryIcon: Tractor,
      title: "Delay Irrigation",
      confidence: 91,
      reasoning: "Significant precipitation (0.8\") forecast for tomorrow morning. Soil saturation levels will be optimal without intervention, saving 1.2M gallons.",
      tags: [
        { label: "Soil Hum", value: "62%", icon: Droplets },
        { label: "Precip", value: '0.8"', icon: CloudRain }
      ]
    },
    {
      id: "rec-events-1",
      category: "events",
      categoryLabel: "Outdoor Events",
      categoryIcon: Tent,
      title: "Deploy Wind Mitigation",
      confidence: 82,
      isCritical: true,
      reasoning: "Gusts exceeding 35mph expected between 18:00 and 22:00. Secure temporary structures and reinforce main stage anchors for Waterfront Gala.",
      tags: [
        { label: "Gusts", value: "35mph", icon: Wind },
        { label: "Risk", value: "High", icon: AlertTriangle }
      ]
    }
  ];

  // Filtering Logic
  const filteredRecs = recommendations.filter((rec) => {
    // 1. Filter by Tab
    if (selectedTab !== "all") {
      if (selectedTab === "high") {
        if (!rec.isCritical) return false;
      } else if (rec.category !== selectedTab) {
        return false;
      }
    }

    // 2. Filter by onboarding selected industries
    if (!activeIndustries.includes(rec.category)) {
      return false;
    }

    // 3. Filter by search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        rec.title.toLowerCase().includes(q) ||
        rec.reasoning.toLowerCase().includes(q) ||
        rec.categoryLabel.toLowerCase().includes(q)
      );
    }

    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-background relative pb-12">
      
      {/* Top Header Bar */}
      <section className="border-b border-surface-stroke py-3 px-8 flex items-center justify-between bg-transparent shrink-0">
        {/* Left Search input */}
        <div className="relative w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search insights..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-surface-stroke bg-surface-container-low text-xs text-on-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-text-muted" />
        </div>

        {/* Right Icons & Profile Badge */}
        <div className="flex items-center gap-5">
          <button className="text-on-surface-variant hover:text-on-surface transition-colors">
            <Bell className="h-4.5 w-4.5" />
          </button>
          <button className="text-on-surface-variant hover:text-on-surface transition-colors">
            <HelpCircle className="h-4.5 w-4.5" />
          </button>
          
          {/* Profile card badge */}
          <div className="flex items-center gap-3 pl-4 border-l border-surface-stroke">
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-on-surface">Marcus Chen</span>
              <span className="text-[7.5px] font-bold text-text-muted uppercase tracking-widest text-label-mono leading-none mt-0.5">Strategic Lead</span>
            </div>
            
            {/* User thumbnail profile picture */}
            <div className="relative h-8 w-8 rounded-full overflow-hidden border border-primary/20 bg-primary/10 flex items-center justify-center font-bold text-xs text-primary shadow">
              MC
            </div>
          </div>
        </div>
      </section>

      {/* Main Panel Content */}
      <main className="flex-1 px-8 py-8 flex flex-col gap-6 w-full max-w-7xl mx-auto">
        
        {/* Title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Recommendations</h1>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Actionable intelligence for your active sectors.
          </p>
        </div>

        {/* Horizontal Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {tabs.map((tab) => {
            const isActive = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? "bg-primary text-on-primary shadow shadow-primary/15"
                    : "border border-surface-stroke bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-background"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Recommendations Cards Grid */}
        {filteredRecs.length === 0 ? (
          <div className="border border-dashed border-surface-stroke rounded-xl bg-surface-container-low py-20 text-center px-6 mt-4">
            <ShieldAlert className="h-10 w-10 text-text-muted mx-auto mb-4" />
            <h4 className="font-bold text-base">No active recommendations found</h4>
            <p className="text-xs text-on-surface-variant max-w-xs mx-auto mt-1">
              No recommendations match the filter "{selectedTab}". Adjust your query or connectors.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            {filteredRecs.map((rec) => {
              const Icon = rec.categoryIcon;
              return (
                <div
                  key={rec.id}
                  className="border border-surface-stroke bg-surface-container-low rounded-xl p-6 flex flex-col justify-between min-h-[260px] relative overflow-hidden shadow-sm"
                >
                  <div className="flex flex-col gap-4">
                    {/* Card Header */}
                    <div className="flex items-center justify-between border-b border-surface-stroke/50 pb-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-surface-stroke bg-surface-container-lowest text-on-surface">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-label-mono">
                          {rec.categoryLabel}
                        </span>
                      </div>
                      
                      {/* Confidence meter */}
                      <div className="flex items-center gap-2 text-right">
                        <span className="text-[8.5px] font-bold text-text-muted uppercase tracking-wider text-label-mono">
                          Confidence
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-label-mono">{rec.confidence}%</span>
                          <div className="w-12 bg-surface-container border border-surface-stroke h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${rec.confidence}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Heading */}
                    <h3 className="text-xl font-extrabold tracking-tight mt-1">{rec.title}</h3>

                    {/* Reasoning Panel */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[8.5px] font-bold text-text-muted uppercase tracking-wider text-label-mono">
                        Reasoning
                      </span>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {rec.reasoning}
                      </p>
                    </div>

                    {/* Parameter Tags */}
                    <div className="flex flex-wrap gap-2 mt-1">
                      {rec.tags.map((tag, idx) => {
                        const TagIcon = tag.icon;
                        return (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-surface-container-high border border-surface-stroke text-[10px] font-bold text-on-surface text-label-mono"
                          >
                            <TagIcon className="h-3.5 w-3.5 text-text-muted" />
                            {tag.label}: {tag.value}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="flex items-center justify-between mt-6 border-t border-surface-stroke/50 pt-4">
                    {/* Optional Status Indicators */}
                    {rec.category === "events" ? (
                      <div className="flex flex-wrap items-center gap-3 text-[9px] text-text-muted font-bold text-label-mono">
                        <span className="flex items-center gap-1 text-secondary">
                          <div className="h-1.5 w-1.5 rounded-full bg-secondary" /> AI Engine Online
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Updated 2m ago
                        </span>
                      </div>
                    ) : (
                      <div className="w-1" /> // empty spacer
                    )}

                    <div className="flex items-center gap-3 ml-auto">
                      {executedIds.includes(rec.id) ? (
                        <button
                          disabled
                          className="h-9 px-5 bg-emerald-600 text-white font-bold text-xs rounded-lg cursor-not-allowed opacity-90 flex items-center gap-1.5 shadow"
                        >
                          <Check className="h-3.5 w-3.5" /> Executed
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setExecutedIds((prev) => [...prev, rec.id]);
                            setToastMessage(`⚡ Plan "${rec.title}" executed successfully. Dispatching commands...`);
                          }}
                          className="h-9 px-5 bg-primary text-on-primary font-bold text-xs rounded-lg hover:bg-primary-container transition-colors shadow"
                        >
                          Execute Plan
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedRec(rec)}
                        className="h-9 px-4 border border-surface-stroke bg-surface-container-lowest text-on-surface hover:bg-surface-container hover:text-on-background text-xs font-bold rounded-lg transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* View Details Custom Modal */}
      {selectedRec && (() => {
        const DetailIcon = selectedRec.categoryIcon;
        const isAlreadyExecuted = executedIds.includes(selectedRec.id);
        const steps = getActionPlanSteps(selectedRec.category);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg bg-surface-container-low border border-surface-stroke rounded-xl p-6 shadow-2xl flex flex-col gap-5 relative animate-in zoom-in-95 duration-200">
              
              {/* Modal Close Button */}
              <button 
                onClick={() => setSelectedRec(null)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal Header */}
              <div className="flex flex-col gap-2 border-b border-surface-stroke/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-surface-stroke bg-surface-container-lowest text-on-surface">
                    <DetailIcon className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-label-mono">
                      {selectedRec.categoryLabel}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-secondary bg-secondary/15 px-2 py-0.5 rounded text-label-mono">
                    {selectedRec.confidence}% Confidence
                  </span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-on-surface mt-1">
                  {selectedRec.title}
                </h3>
              </div>

              {/* Modal Body */}
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[350px] pr-1">
                
                {/* Weather Parameters Snapshot */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider text-label-mono">Atmospheric Snapshot</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedRec.tags.map((tag, idx) => {
                      const TagIcon = tag.icon;
                      return (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container border border-surface-stroke text-[10.5px] font-bold text-on-surface text-label-mono"
                        >
                          <TagIcon className="h-3.5 w-3.5 text-text-muted" />
                          {tag.label}: {tag.value}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Reasoning Panel */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider text-label-mono">Reasoning</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed bg-surface-container border border-surface-stroke/50 rounded-lg p-3">
                    {selectedRec.reasoning}
                  </p>
                </div>

                {/* Simulated Steps */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider text-label-mono">Proposed Operational Steps</span>
                  <div className="flex flex-col gap-2">
                    {steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-on-surface">
                        <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-[10px]">
                          {idx + 1}
                        </div>
                        <span className="leading-normal pt-0.5">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-surface-stroke/50 pt-4">
                <button
                  onClick={() => setSelectedRec(null)}
                  className="h-10 px-5 border border-surface-stroke bg-surface-container-lowest text-on-surface hover:bg-surface-container hover:text-on-background text-xs font-bold rounded-lg transition-colors"
                >
                  Close Report
                </button>
                {isAlreadyExecuted ? (
                  <button
                    disabled
                    className="h-10 px-6 bg-emerald-600 text-white font-bold text-xs rounded-lg cursor-not-allowed opacity-90 flex items-center gap-1.5 shadow"
                  >
                    <Check className="h-3.5 w-3.5" /> Executed
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setExecutedIds((prev) => [...prev, selectedRec.id]);
                      setToastMessage(`⚡ Plan "${selectedRec.title}" executed successfully. Dispatching commands...`);
                      setSelectedRec(null); // Close modal on execute
                    }}
                    className="h-10 px-6 bg-primary text-on-primary font-bold text-xs rounded-lg hover:bg-primary-container transition-colors shadow"
                  >
                    Execute Plan
                  </button>
                )}
              </div>

            </div>
          </div>
        );
      })()}

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

      {/* Footer */}
      <footer className="w-full text-center text-[9px] text-text-muted font-bold tracking-widest text-label-mono mt-12">
        © 2024 AtmosIQ. Actionable Intelligence for a Changing Climate.
      </footer>
    </div>
  );
}
