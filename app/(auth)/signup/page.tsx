"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { setCurrentUser } from "@/lib/state";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setError("");

    setTimeout(() => {
      try {
        const newUser = {
          id: `user-${Math.random().toString(36).substr(2, 9)}`,
          name,
          email,
          industries: ["laundry", "logistics", "events"], // default connected
          createdAt: Date.now()
        };
        setCurrentUser(newUser);
        router.push("/onboarding");
      } catch (err) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col justify-between overflow-hidden relative">
      
      {/* Splits */}
      <div className="grid lg:grid-cols-12 flex-1 w-full">
        
        {/* Left Column (Atmosphere Mountain Panel) */}
        <div className="lg:col-span-5 hidden lg:flex flex-col justify-between p-12 bg-gradient-to-b from-[#060a13] to-[#04060a] border-r border-surface-stroke relative overflow-hidden">
          
          {/* Logo */}
          <div className="text-xl font-bold tracking-tight text-white z-10">
            AtmosIQ
          </div>

          {/* Copy and Mountain Vector visual */}
          <div className="flex flex-col gap-10 mt-auto z-10 w-full">
            <div className="flex flex-col gap-3">
              <h2 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
                Master the <br />
                Atmosphere
              </h2>
              <p className="text-xs text-[#c1c6d6] leading-relaxed max-w-sm">
                Join the next generation of decision intelligence. Our platform transforms complex environmental data into actionable clarity for global leaders.
              </p>
            </div>

            {/* Glowing Mountain Ridge Vector */}
            <div className="w-full relative h-48 rounded-lg overflow-hidden border border-surface-stroke/30 bg-background/40">
              <svg className="w-full h-full text-primary" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00e9bd" stopOpacity="0.2"/>
                    <stop offset="40%" stopColor="#3b82f6" stopOpacity="0.05"/>
                    <stop offset="100%" stopColor="#080c14" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <rect width="400" height="200" fill="url(#skyGrad)"/>
                
                {/* Mountain Layers */}
                <path d="M 0 200 L 80 110 L 160 155 L 240 80 L 310 145 L 400 95 L 400 200 Z" fill="#0e1628"/>
                <path d="M 0 200 L 110 135 L 195 165 L 275 105 L 345 155 L 400 125 L 400 200 Z" fill="#090d18"/>
                <path d="M 0 200 L 50 155 L 125 175 L 200 130 L 295 170 L 400 145 L 400 200 Z" fill="#05080e"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column (Signup Form) */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center px-6 py-12 relative">
          
          {/* Step indicator in top-right */}
          <div className="absolute top-6 right-6 flex items-center gap-2 text-label-mono text-[9px] font-bold text-text-muted">
            <span>Step 1 of 2</span>
            <div className="h-1.5 w-12 bg-surface-stroke rounded-full overflow-hidden">
              <div className="h-full bg-primary w-1/2 rounded-full" />
            </div>
          </div>

          <div className="w-full max-w-sm flex flex-col gap-6">
            
            {/* Header info */}
            <div className="flex flex-col gap-1.5 text-left">
              <h1 className="text-2xl font-extrabold tracking-tight">Create Account</h1>
              <p className="text-xs text-on-surface-variant">Start your journey with AtmosIQ.</p>
            </div>

            {error && (
              <div className="rounded-lg bg-error/10 border border-error/25 p-3 text-xs text-error font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-label-mono" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 rounded-lg border border-surface-stroke bg-surface-container-low px-3 py-2 text-xs text-on-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

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

              {/* Passwords (side by side!) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-label-mono" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 rounded-lg border border-surface-stroke bg-surface-container-low px-3 py-2 text-xs text-on-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-label-mono" htmlFor="confirm">
                    Confirm
                  </label>
                  <input
                    id="confirm"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-10 rounded-lg border border-surface-stroke bg-surface-container-low px-3 py-2 text-xs text-on-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary-container disabled:opacity-50 transition-colors mt-2 shadow-lg shadow-primary/10"
              >
                {loading ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  "Create Account"
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
              onClick={() => { setLoading(true); setTimeout(() => router.push("/onboarding"), 800); }}
              className="flex h-10 items-center justify-center gap-2.5 rounded-lg border border-surface-stroke bg-surface-container-low text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors"
            >
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

            {/* Footer redirect */}
            <div className="text-center text-xs text-on-surface-variant">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-primary hover:underline pl-0.5">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <footer className="w-full border-t border-surface-stroke py-4 px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] text-text-muted font-bold tracking-widest text-label-mono bg-background">
        <div>
          <span>© 2024 AtmosIQ. Actionable Intelligence for a Changing Climate.</span>
        </div>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-on-background transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-on-background transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-on-background transition-colors">Help Center</Link>
        </div>
      </footer>
    </div>
  );
}
