"use client";

import { useState, useEffect } from "react";
import { 
  Shirt, 
  Truck, 
  Calendar, 
  History, 
  Trash2, 
  Search, 
  MapPin, 
  Clock, 
  Eye, 
  Info,
  CalendarDays,
  SlidersHorizontal
} from "lucide-react";
import { getRecommendations, deleteRecommendation, clearRecommendationHistory } from "@/lib/state";
import { DecisionRecommendation } from "@/types/recommendation";
import { getIndustryById } from "@/lib/industries";

export default function HistoryPage() {
  const [recs, setRecs] = useState<DecisionRecommendation[]>([]);
  const [filteredRecs, setFilteredRecs] = useState<DecisionRecommendation[]>([]);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [selectedRec, setSelectedRec] = useState<DecisionRecommendation | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterHistory();
  }, [recs, search, industryFilter]);

  const loadHistory = () => {
    setRecs(getRecommendations());
  };

  const filterHistory = () => {
    let list = [...recs];
    
    if (industryFilter !== "all") {
      list = list.filter(r => r.industry.toLowerCase() === industryFilter.toLowerCase());
    }

    if (search.trim() !== "") {
      const q = search.toLowerCase();
      list = list.filter(r => 
        r.question.toLowerCase().includes(q) || 
        r.location.toLowerCase().includes(q) || 
        r.recommendation.toLowerCase().includes(q)
      );
    }

    setFilteredRecs(list);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this decision log?")) {
      deleteRecommendation(id);
      loadHistory();
    }
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear ALL logged decision entries? This cannot be undone.")) {
      clearRecommendationHistory();
      loadHistory();
    }
  };

  const getIndustryIcon = (industryId: string) => {
    switch (industryId.toLowerCase()) {
      case "laundry": return Shirt;
      case "logistics": return Truck;
      case "events": return Calendar;
      default: return Info;
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-on-background px-6 py-10">
      <div className="mx-auto max-w-7xl flex flex-col gap-8">
        
        {/* Header */}
        <section className="border-b border-surface-stroke pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <History className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-3xl font-extrabold tracking-tight">Decision Logs</h1>
              <p className="text-sm text-on-surface-variant">Review the audit trail of weather queries and recommendations.</p>
            </div>
          </div>

          {recs.length > 0 && (
            <button
              onClick={handleClearAll}
              className="h-10 px-5 border border-error/30 hover:border-error/60 text-error bg-error/5 hover:bg-error/10 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear All History
            </button>
          )}
        </section>

        {/* Filter Controls Row */}
        <section className="grid sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-8 flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search logs by keyword or city..."
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-surface-stroke bg-surface-container text-xs text-on-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
            </div>

            {/* Filter Tabs */}
            <div className="flex border border-surface-stroke rounded-lg overflow-hidden bg-surface-container-low text-xs shrink-0 self-start sm:self-auto">
              {["all", "laundry", "logistics", "events"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setIndustryFilter(tab)}
                  className={`px-4 py-2 font-semibold capitalize border-r border-surface-stroke last:border-0 transition-colors ${
                    industryFilter === tab 
                      ? "bg-primary text-on-primary" 
                      : "text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="sm:col-span-4 text-right text-xs text-text-muted font-medium text-label-mono">
            Showing {filteredRecs.length} of {recs.length} total entries
          </div>
        </section>

        {/* Log Entries Grid/Table */}
        {filteredRecs.length === 0 ? (
          <div className="border border-dashed border-surface-stroke rounded-xl bg-surface-container-low py-20 text-center px-6">
            <Info className="h-10 w-10 text-text-muted mx-auto mb-4" />
            <h4 className="font-bold text-base">No matching records found</h4>
            <p className="text-xs text-on-surface-variant max-w-xs mx-auto mt-1">
              Adjust your search keywords or visit the AI Console to run a new decision analysis.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-surface-stroke bg-surface-container overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-container-high border-b border-surface-stroke text-on-surface-variant text-label-mono font-bold uppercase">
                    <th className="py-4 px-6">Sector</th>
                    <th className="py-4 px-6">Query Details</th>
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-6">Confidence</th>
                    <th className="py-4 px-6">Date Logged</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-stroke">
                  {filteredRecs.map((rec) => {
                    const Icon = getIndustryIcon(rec.industry);
                    const ind = getIndustryById(rec.industry);
                    const formattedDate = new Date(rec.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    });
                    const formattedTime = new Date(rec.createdAt).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit"
                    });

                    return (
                      <tr 
                        key={rec.id}
                        onClick={() => setSelectedRec(rec)}
                        className="hover:bg-surface-container-high transition-colors cursor-pointer group"
                      >
                        <td className="py-4 px-6 font-bold uppercase tracking-wider text-label-mono">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded bg-primary/10 text-primary flex items-center justify-center">
                              <Icon className="h-4 w-4" />
                            </div>
                            {ind?.title || rec.industry}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-medium max-w-xs truncate">
                          "{rec.question}"
                        </td>
                        <td className="py-4 px-6 text-on-surface-variant">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-text-muted" /> {rec.location}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-label-mono">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            rec.confidence >= 90 
                              ? "bg-secondary/15 text-secondary" 
                              : "bg-primary/15 text-primary"
                          }`}>
                            {rec.confidence}%
                          </span>
                        </td>
                        <td className="py-4 px-6 text-on-surface-variant font-medium">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5 text-text-muted" /> {formattedDate} <span className="text-[10px] text-text-muted font-normal">@{formattedTime}</span>
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedRec(rec); }}
                              className="h-8 w-8 rounded bg-surface-container-lowest hover:bg-primary/10 hover:text-primary border border-surface-stroke text-on-surface-variant flex items-center justify-center transition-colors"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => handleDelete(rec.id, e)}
                              className="h-8 w-8 rounded bg-surface-container-lowest hover:bg-error/15 hover:text-error border border-surface-stroke text-on-surface-variant flex items-center justify-center transition-colors"
                              title="Delete log"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal dialog for Detail View */}
        {selectedRec && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-xl border border-surface-stroke bg-surface-container-low p-6 shadow-2xl relative flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-surface-stroke pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold uppercase tracking-wider text-label-mono text-primary">
                    {getIndustryById(selectedRec.industry)?.title}
                  </span>
                  <span className="text-xs text-text-muted">• Audit Report</span>
                </div>
                <button
                  onClick={() => setSelectedRec(null)}
                  className="text-on-surface-variant hover:text-on-surface text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col gap-4 text-sm leading-relaxed">
                <div>
                  <span className="text-xs font-bold text-text-muted block uppercase text-label-mono mb-1">Inquiry Question</span>
                  <p className="font-semibold italic">"{selectedRec.question}"</p>
                </div>
                
                <div>
                  <span className="text-xs font-bold text-text-muted block uppercase text-label-mono mb-1">Decision Recommendation</span>
                  <div className="bg-surface-container-lowest border border-surface-stroke rounded-lg p-4 text-xs whitespace-pre-wrap">
                    {selectedRec.recommendation}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-surface-stroke pt-3 mt-1">
                  <div>
                    <span className="text-xs font-bold text-text-muted block uppercase text-label-mono mb-1">Location Details</span>
                    <span className="text-xs font-semibold flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> {selectedRec.location}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-text-muted block uppercase text-label-mono mb-1">Analyzed Time</span>
                    <span className="text-xs font-semibold flex items-center gap-1 text-label-mono">
                      <Clock className="h-3.5 w-3.5 text-secondary" /> {new Date(selectedRec.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Weather Parameters Snapshot */}
                <div className="border-t border-surface-stroke pt-3 mt-1">
                  <span className="text-xs font-bold text-text-muted block uppercase text-label-mono mb-2">Atmospheric snapshot</span>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-surface-container p-2.5 rounded border border-surface-stroke">
                      <span className="text-[10px] text-text-muted block text-label-mono">Temp</span>
                      <span className="text-xs font-bold">{selectedRec.weatherData.temperature}°C</span>
                    </div>
                    <div className="bg-surface-container p-2.5 rounded border border-surface-stroke">
                      <span className="text-[10px] text-text-muted block text-label-mono">Humidity</span>
                      <span className="text-xs font-bold">{selectedRec.weatherData.humidity}%</span>
                    </div>
                    <div className="bg-surface-container p-2.5 rounded border border-surface-stroke">
                      <span className="text-[10px] text-text-muted block text-label-mono">Rain Risk</span>
                      <span className="text-xs font-bold">{selectedRec.weatherData.rainChance}%</span>
                    </div>
                    <div className="bg-surface-container p-2.5 rounded border border-surface-stroke">
                      <span className="text-[10px] text-text-muted block text-label-mono">Wind</span>
                      <span className="text-xs font-bold">{selectedRec.weatherData.windSpeed} km/h</span>
                    </div>
                  </div>
                  <div className="mt-2 text-center text-xs text-label-mono font-semibold text-secondary uppercase bg-secondary/10 py-1.5 rounded">
                    Overall Condition: {selectedRec.weatherData.summary}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-surface-stroke mt-1">
                <button
                  onClick={() => setSelectedRec(null)}
                  className="h-10 px-6 bg-surface-container-high hover:bg-surface-container-highest border border-surface-stroke rounded-lg text-xs font-bold transition-colors"
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
