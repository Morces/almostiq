"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { setCurrentUser, getCurrentUser } from "@/lib/state";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    setError("");

    setTimeout(() => {
      try {
        const storedUser = getCurrentUser();
        const user = {
          ...storedUser,
          email: email.trim()
        };
        setCurrentUser(user);
        router.push("/dashboard");
      } catch (err) {
        setError("Failed to verify credentials.");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col justify-between overflow-hidden relative">
      
      {/* Dynamic visual splits */}
      <div className="grid lg:grid-cols-12 flex-1 w-full">
        
        {/* Left Column (Brand Panel) */}
        <div className="lg:col-span-5 hidden lg:flex flex-col justify-between p-12 bg-gradient-to-b from-[#0a0f19] to-[#04060a] border-r border-surface-stroke relative overflow-hidden">
          {/* Subtle overlay glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-primary/5 blur-[90px] pointer-events-none" />

          {/* Logo */}
          <div className="text-xl font-bold tracking-tight text-white z-10">
            AtmosIQ
          </div>

          {/* Center visual: Heading & Interactive wireframe globe */}
          <div className="flex flex-col gap-10 my-auto z-10">
            <div className="flex flex-col gap-3">
              <h2 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
                Welcome Back
              </h2>
              <p className="text-xs text-[#c1c6d6] leading-relaxed max-w-sm">
                Continue making smarter decisions with actionable intelligence for a changing climate.
              </p>
            </div>

            {/* Coordinate sphere visual */}
            <div className="h-64 w-full flex items-center justify-center relative">
              <svg className="w-64 h-64 text-primary/30 animate-spin-slow" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3"/>
                <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                <ellipse cx="50" cy="50" rx="15" ry="45" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.5"/>
                <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5"/>
              </svg>
            </div>
          </div>

          {/* Bottom status indicator */}
          <div className="z-10 w-fit">
            <div className="border border-surface-stroke rounded-lg p-4 bg-glass-fill backdrop-blur-md flex items-center gap-3">
              <div className="h-7 w-7 rounded bg-[#93ffde]/10 text-[#93ffde] flex items-center justify-center">
                <Sparkles className="h-4 w-4 animate-pulse" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-bold text-[#93ffde] uppercase tracking-wider text-label-mono">System Status</span>
                <span className="text-xs font-semibold text-on-surface">Predictive Engine Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Login Form) */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center px-6 py-12">
          
          <div className="w-full max-w-sm flex flex-col gap-6">
            
            {/* Header info */}
            <div className="flex flex-col gap-1.5 text-left">
              <h1 className="text-2xl font-extrabold tracking-tight">Sign In</h1>
              <p className="text-xs text-on-surface-variant">Enter your credentials to access your dashboard.</p>
            </div>

            {error && (
              <div className="rounded-lg bg-error/10 border border-error/25 p-3 text-xs text-error font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-label-mono" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 rounded-lg border border-surface-stroke bg-surface-container-low px-3 py-2 text-xs text-on-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-label-mono" htmlFor="password">
                    Password
                  </label>
                  <Link href="#" className="text-[10px] font-bold text-primary hover:underline text-label-mono">
                    Forgot Password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 rounded-lg border border-surface-stroke bg-surface-container-low px-3 py-2 text-xs text-on-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-surface-stroke bg-surface-container-low text-primary focus:ring-0"
                />
                <label htmlFor="remember" className="text-[10px] font-medium text-on-surface-variant">
                  Remember this device for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary-container disabled:opacity-50 transition-colors mt-2"
              >
                {loading ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  "Login to Command Center"
                )}
              </button>
            </form>

            {/* Separator */}
            <div className="flex items-center gap-3 my-2">
              <div className="h-[1px] bg-surface-stroke flex-1" />
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest text-label-mono">Or Continue With</span>
              <div className="h-[1px] bg-surface-stroke flex-1" />
            </div>

            {/* Provider Button */}
            <button
              onClick={() => { setLoading(true); setTimeout(() => router.push("/dashboard"), 800); }}
              className="flex h-10 items-center justify-center gap-2.5 rounded-lg border border-surface-stroke bg-surface-container-low text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors"
            >
              {/* Google SVG logo */}
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Google
            </button>

            {/* Footer request */}
            <div className="text-center text-xs text-on-surface-variant">
              Don't have an account?{" "}
              <Link href="/signup" className="font-bold text-primary hover:underline pl-0.5">
                Request Access
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <footer className="w-full border-t border-surface-stroke py-4 px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] text-text-muted font-bold tracking-widest text-label-mono bg-background">
        <div className="flex flex-wrap gap-x-6 justify-center">
          <span>ATMOSIQ PRECISION COMMAND v4.2</span>
          <span>SECURE AES-256 ENCRYPTED SESSION</span>
        </div>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-on-background transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-on-background transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
