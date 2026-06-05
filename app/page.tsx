"use client";

import Link from "next/link";
import { 
  Play, 
  ArrowRight, 
  Cpu, 
  Folder, 
  WashingMachine, 
  Truck, 
  Calendar, 
  Sprout, 
  Sun, 
  HardHat, 
  Plane,
  CloudRain,
  BrainCircuit,
  MessageSquareCode
} from "lucide-react";

export default function LandingPage() {
  const activeForecasts = [
    {
      title: "Logistics Hub A",
      icon: Truck,
      desc: "Heavy rain predicted. Delay departure by 2 hours to avoid peak intensity.",
      badge: "RECOMMENDATION",
      badgeColor: "bg-primary/10 text-primary border-primary/20"
    },
    {
      title: "Solar Array Beta",
      icon: Sun,
      desc: "Cloud coverage clearing at 14:00. Boost grid injection by 15%.",
      badge: "EFFICIENCY RISK",
      badgeColor: "bg-secondary/15 text-secondary border-secondary/20"
    },
    {
      title: "Stadium Operations",
      icon: Calendar,
      desc: "Gusts exceeding 45mph, secure temporary structures immediately.",
      badge: "ACTION REQUIRED",
      badgeColor: "bg-error/15 text-error border-error/20"
    }
  ];

  const specializations = [
    { name: "Laundry", icon: WashingMachine },
    { name: "Logistics", icon: Truck },
    { name: "Events", icon: Calendar },
    { name: "Agriculture", icon: Sprout },
    { name: "Solar", icon: Sun },
    { name: "Construction", icon: HardHat },
    { name: "Travel", icon: Plane }
  ];

  return (
    <div className="relative min-h-screen bg-background text-on-background flex flex-col justify-between overflow-x-hidden">
      {/* Background glowing overlays */}
      <div className="absolute top-[-25%] left-[-10%] h-[700px] w-[700px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-20 flex flex-col gap-28 w-full z-10 relative">
        
        {/* HERO SECTION */}
        <section className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Column */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <div className="inline-flex items-center w-fit px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold tracking-widest uppercase text-label-mono">
              ⚡ NEXT-GEN WEATHER INTELLIGENCE
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Decision <br />
              Intelligence <br />
              <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Powered by Weather
              </span>
            </h1>

            <p className="text-sm text-on-surface-variant max-w-xl leading-relaxed mt-2">
              Transform weather forecasts into actionable business decisions with AI-powered recommendations. AtmosIQ processes atmospheric complexity into strategic clarity.
            </p>

            <div className="flex flex-row items-center gap-4 mt-4">
              <Link
                href="/signup"
                className="h-11 px-8 inline-flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-all shadow-lg shadow-primary/20"
              >
                Start Free
              </Link>
              <Link
                href="/dashboard"
                className="h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg border border-surface-stroke bg-surface-container-low text-on-surface hover:bg-surface-container-high text-xs font-bold transition-all group"
              >
                <div className="h-5 w-5 flex items-center justify-center rounded-full bg-on-surface/5 text-on-surface-variant group-hover:bg-on-surface/10 transition-colors">
                  <Play className="h-3 w-3 fill-current ml-0.5" />
                </div>
                View Demo
              </Link>
            </div>
          </div>

          {/* Hero Right Column: Active Forecast Card */}
          <div className="lg:col-span-5 w-full">
            <div className="border border-surface-stroke rounded-xl bg-surface-container-low p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-surface-stroke pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-surface-container-high border border-surface-stroke flex items-center justify-center text-primary">
                    <CloudRain className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-muted uppercase text-label-mono">Active Forecast</span>
                    <span className="text-xs font-bold text-on-surface">Precipitation Spike: +42%</span>
                  </div>
                </div>
                
                <span className="text-[9px] font-bold text-secondary border border-secondary/20 bg-secondary/15 px-2.5 py-0.5 rounded text-label-mono">
                  OPTIMIZED
                </span>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-4">
                {activeForecasts.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex gap-4 items-start p-3.5 rounded-lg border border-surface-stroke bg-surface-container-lowest">
                      <div className="h-8 w-8 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col gap-1.5 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs">{item.title}</span>
                          <span className={`text-[8px] font-bold border px-1.5 py-0.5 rounded text-label-mono ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* CORE INTELLIGENCE SECTION */}
        <section className="flex flex-col gap-12 text-center items-center">
          <div className="flex flex-col gap-2 max-w-xl">
            <h2 className="text-3xl font-extrabold tracking-tight">Core Intelligence</h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Moving beyond simple data points to deep atmospheric reasoning and automated risk mitigation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-6 w-full max-w-5xl text-left">
            {/* Card 1: AI Reasoning Engine */}
            <div className="lg:col-span-7 border border-surface-stroke bg-surface-container-low rounded-xl p-6 flex items-start gap-4 relative overflow-hidden">
              <div className="flex flex-col gap-3 flex-1">
                <h3 className="text-lg font-bold">AI Reasoning Engine</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Our neural networks don't just predict rain; they calculate the specific impact on your supply chain latency and labor costs.
                </p>
              </div>
              <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded bg-primary/10 text-primary">
                <BrainCircuit className="h-5 w-5" />
              </div>
            </div>

            {/* Card 2: Cross-Industry */}
            <div className="lg:col-span-5 border border-surface-stroke bg-surface-container-low rounded-xl p-6 flex items-start gap-4 relative overflow-hidden">
              <div className="flex flex-col gap-3 flex-1">
                <h3 className="text-lg font-bold">Cross-Industry Intelligence</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Pre-tuned models for seven distinct sectors, each with unique risk parameters.
                </p>
              </div>
              <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded bg-secondary/15 text-secondary">
                <Folder className="h-5 w-5" />
              </div>
            </div>

            {/* Card 3: Explainable Decisions */}
            <div className="lg:col-span-12 border border-surface-stroke bg-surface-container-low rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between relative overflow-hidden">
              <div className="flex flex-col gap-3 max-w-xl">
                <h3 className="text-lg font-bold">Explainable Decisions</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Never wonder "why" again. Every recommendation comes with a complete breakdown of meteorological triggers and historical correlation data.
                </p>
              </div>
              
              {/* Loaders/Visualization graphic */}
              <div className="w-full md:w-64 p-4 rounded-lg bg-surface-container-lowest border border-surface-stroke flex flex-col gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <div className="h-2 w-2 rounded-full bg-secondary animate-pulse [animation-delay:0.2s]" />
                  <div className="h-2 w-2 rounded-full bg-tertiary animate-pulse [animation-delay:0.4s]" />
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-2/3 rounded-full animate-pulse-slow" />
                </div>
                <div className="h-2 w-1/2 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-3/4 rounded-full animate-pulse-slow [animation-delay:0.3s]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VERTICAL SPECIALIZATIONS */}
        <section className="flex flex-col gap-8 w-full max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-2 max-w-lg">
              <h2 className="text-3xl font-extrabold tracking-tight">Vertical Specializations</h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Deep integration into the workflows that matter most. We speak the language of your industry, from harvest windows to construction safety.
              </p>
            </div>
            
            <Link 
              href="#" 
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
            >
              Explore All Use Cases <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 py-4">
            {specializations.map((spec, index) => {
              const Icon = spec.icon;
              return (
                <div 
                  key={index} 
                  className="flex flex-col items-center justify-center gap-3 p-5 rounded-lg border border-surface-stroke bg-surface-container-low hover:border-primary/40 transition-colors w-28 text-center"
                >
                  <div className="h-9 w-9 flex items-center justify-center rounded bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold tracking-tight">{spec.name}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* FINAL CTA PANEL */}
        <section className="w-full border border-surface-stroke bg-surface-container-low rounded-2xl p-10 md:p-16 flex flex-col items-center text-center gap-6 relative overflow-hidden bg-dot-grid">
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight max-w-xl leading-tight">
            Ready to master the atmosphere?
          </h3>
          
          <p className="text-xs text-on-surface-variant max-w-md leading-relaxed">
            Join 500+ enterprises optimizing their daily operations with AtmosIQ's actionable intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto">
            <Link
              href="/signup"
              className="h-10 px-6 inline-flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-colors shadow-lg shadow-primary/15"
            >
              Start Your Free Trial
            </Link>
            <Link
              href="#"
              className="h-10 px-6 inline-flex items-center justify-center rounded-lg border border-surface-stroke bg-surface-container-lowest text-on-surface hover:bg-surface-container-low text-xs font-semibold transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer className="w-full border-t border-surface-stroke bg-surface-container-low/50 py-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="text-base font-extrabold tracking-tight">AtmosIQ</span>
            <span className="text-[10px] text-text-muted">
              © {new Date().getFullYear()} AtmosIQ. Actionable Intelligence for a Changing Climate.
            </span>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-on-surface-variant font-semibold">
            <Link href="#" className="hover:text-on-background transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-on-background transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-on-background transition-colors">Contact Support</Link>
            <Link href="#" className="hover:text-on-background transition-colors">Global Network</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
