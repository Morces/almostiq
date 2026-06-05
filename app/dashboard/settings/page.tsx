"use client";

import { useState, useEffect } from "react";
import { Settings, User, Check, RefreshCw, AlertTriangle, ShieldCheck, Heart } from "lucide-react";
import { getCurrentUser, setCurrentUser, clearRecommendationHistory } from "@/lib/state";
import { UserProfile } from "@/types/recommendation";
import { INDUSTRIES } from "@/lib/industries";

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    const activeUser = getCurrentUser();
    setUser(activeUser);
    setName(activeUser.name);
    setEmail(activeUser.email);
    setSelectedIds(activeUser.industries || []);
  }, []);

  const handleToggle = (id: string, isSupported: boolean) => {
    if (!isSupported) return;
    
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name || !email) return;

    const updatedUser = {
      ...user,
      name,
      email,
      industries: selectedIds
    };
    setCurrentUser(updatedUser);
    setUser(updatedUser);
    
    // Trigger success feedback
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetSandbox = () => {
    if (confirm("Resetting sandbox will delete all cached recommendation histories. Proceed?")) {
      clearRecommendationHistory();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-on-background px-6 py-10">
      <div className="mx-auto max-w-4xl flex flex-col gap-8">
        
        {/* Header */}
        <section className="border-b border-surface-stroke pb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Settings className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h1 className="text-3xl font-extrabold tracking-tight">System Settings</h1>
            <p className="text-sm text-on-surface-variant">Manage your user profile, active industry modules, and sandbox cache.</p>
          </div>
        </section>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Navigation Panel Menu */}
          <aside className="md:col-span-1 rounded-xl border border-surface-stroke bg-surface-container-low p-4 flex flex-col gap-1">
            <button className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg bg-primary/10 text-primary font-bold text-xs text-label-mono">
              <User className="h-4 w-4" /> Account Profile
            </button>
            <button className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant text-xs text-label-mono">
              <Settings className="h-4 w-4" /> Preferences
            </button>
          </aside>

          {/* Config form */}
          <main className="md:col-span-2 flex flex-col gap-6">
            {/* Form */}
            <form onSubmit={handleSave} className="rounded-xl border border-surface-stroke bg-surface-container-low p-6 flex flex-col gap-6 shadow-sm">
              <h3 className="text-lg font-bold border-b border-surface-stroke pb-3">
                General Profile Details
              </h3>

              {saveSuccess && (
                <div className="rounded-lg bg-secondary/10 border border-secondary/25 p-3 text-xs text-secondary font-semibold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> Profile updates saved successfully!
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant" htmlFor="name">
                    Profile Username
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 rounded-lg border border-surface-stroke bg-surface-container-lowest px-3 py-2 text-sm text-on-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant" htmlFor="email">
                    Account Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 rounded-lg border border-surface-stroke bg-surface-container-lowest px-3 py-2 text-sm text-on-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all"
                  />
                </div>
              </div>

              {/* Connected Sectors */}
              <div className="flex flex-col gap-3 border-t border-surface-stroke pt-4">
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-sm font-bold">Connected Industry Sectors</h4>
                  <p className="text-xs text-on-surface-variant">Toggle active analysis templates connected to your dashboard.</p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-3 mt-1">
                  {INDUSTRIES.map((ind) => {
                    const isSelected = selectedIds.includes(ind.id);
                    return (
                      <button
                        type="button"
                        key={ind.id}
                        onClick={() => handleToggle(ind.id, ind.isSupported)}
                        disabled={!ind.isSupported}
                        className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                          ind.isSupported
                            ? isSelected
                              ? "border-primary bg-primary/5 text-on-background hover:bg-primary/10"
                              : "border-surface-stroke bg-surface-container-lowest text-on-surface-variant hover:border-outline-variant"
                            : "border-surface-stroke/30 bg-surface-container-lowest opacity-40 cursor-not-allowed"
                        }`}
                      >
                        <span className="text-xs font-semibold">{ind.title}</span>
                        {ind.isSupported ? (
                          <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center ${
                            isSelected 
                              ? "border-primary bg-primary text-on-primary" 
                              : "border-surface-stroke bg-transparent"
                          }`}>
                            {isSelected && <Check className="h-3 w-3" />}
                          </div>
                        ) : (
                          <span className="text-[8px] font-semibold text-text-muted uppercase text-label-mono">Soon</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="self-end h-10 px-6 bg-primary text-on-primary hover:bg-primary-container font-semibold rounded-lg text-sm transition-colors shadow-lg shadow-primary/10"
              >
                Save Profile Changes
              </button>
            </form>

            {/* Sandbox reset card */}
            <div className="rounded-xl border border-surface-stroke bg-surface-container-low p-6 flex flex-col gap-4 shadow-sm">
              <h3 className="text-lg font-bold border-b border-surface-stroke pb-3 text-error flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Danger Zone
              </h3>

              {resetSuccess && (
                <div className="rounded-lg bg-secondary/10 border border-secondary/25 p-3 text-xs text-secondary font-semibold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> Cached logs cleared successfully!
                </div>
              )}

              <p className="text-xs text-on-surface-variant leading-relaxed">
                Clearing local storage cache deletes all saved recommendation logs, queries, and restores default mock profiles.
              </p>
              
              <button
                type="button"
                onClick={handleResetSandbox}
                className="h-10 px-5 bg-error/15 hover:bg-error/20 border border-error/30 text-error text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 self-start"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Clear Local State Cache
              </button>
            </div>
          </main>
        </div>

      </div>
    </div>
  );
}
