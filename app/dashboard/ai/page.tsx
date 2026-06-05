"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Cpu, 
  Info, 
  Paperclip, 
  Mic, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  Brain, 
  Snowflake, 
  CloudRain, 
  Wind, 
  Thermometer, 
  Cloud,
  Loader2,
  Sparkles
} from "lucide-react";
import { saveRecommendation, getCurrentUser } from "@/lib/state";
import { DecisionRecommendation } from "@/types/recommendation";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text?: string;
  card?: {
    summary: string;
    recommendation: string;
    confidence: number;
    reasoning: string;
    factors: {
      precip: string;
      wind: string;
      temp: string;
      cover: string;
    };
  };
}

function AiConsoleContent() {
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-bot",
      sender: "assistant",
      text: "Hello, Moses. I have synthesized current atmospheric parameters across Seattle, Nairobi, and London. What operation planning query would you like to execute?"
    }
  ]);

  const suggestions = [
    "Optimize solar storage for the next 48h.",
    "Project foot traffic based on upcoming frost.",
    "Can I host an outdoor wedding this Saturday in Seattle?"
  ];

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendQuery = async (textQuery: string) => {
    if (!textQuery.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: textQuery
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const q = textQuery.toLowerCase();
      
      // Auto-detect industry context
      let detectedIndustry = "events";
      if (q.includes("laundry") || q.includes("dry") || q.includes("wash") || q.includes("clothes") || q.includes("shirt")) {
        detectedIndustry = "laundry";
      } else if (q.includes("route") || q.includes("logistics") || q.includes("truck") || q.includes("delivery") || q.includes("ship")) {
        detectedIndustry = "logistics";
      } else if (q.includes("solar") || q.includes("energy") || q.includes("panel") || q.includes("grid")) {
        detectedIndustry = "solar";
      } else if (q.includes("farm") || q.includes("irrigation") || q.includes("crop") || q.includes("soil") || q.includes("water")) {
        detectedIndustry = "agriculture";
      }

      // Auto-detect city context
      let detectedLocation = "Seattle";
      if (q.includes("nairobi")) detectedLocation = "Nairobi";
      else if (q.includes("london")) detectedLocation = "London";
      else if (q.includes("paris")) detectedLocation = "Paris";
      else if (q.includes("chicago")) detectedLocation = "Chicago";
      else if (q.includes("seattle")) detectedLocation = "Seattle";

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          industry: detectedIndustry,
          location: detectedLocation,
          question: textQuery,
          userId: getCurrentUser().id
        })
      });

      if (!res.ok) {
        throw new Error(`Analyze API returned status ${res.status}`);
      }

      const responseData = await res.json();
      
      // Split direct summary recommendation from justification reasoning
      const parts = responseData.recommendation.split("\n\n");
      const recommendationText = parts[0] || "Precautions Recommended";
      const reasoningText = parts[1] || responseData.recommendation;

      const factors = responseData.factors || {
        precip: `${responseData.weather.rainChance}%`,
        wind: `${responseData.weather.windSpeed} km/h`,
        temp: `${responseData.weather.temperature}°C`,
        cover: responseData.weather.summary.toLowerCase().includes("cloud") ? "80%" : "15%"
      };

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "assistant",
        card: {
          summary: `Report compiled for ${responseData.location}:`,
          recommendation: recommendationText.replace("Direct Answer: ", ""),
          confidence: responseData.confidence,
          reasoning: reasoningText,
          factors: {
            precip: factors.precip,
            wind: factors.wind,
            temp: factors.temp,
            cover: factors.cover
          }
        }
      };

      setMessages((prev) => [...prev, botMsg]);

      // Cache locally as well
      const loggedRec: DecisionRecommendation = {
        id: `rec-${Date.now()}`,
        userId: getCurrentUser().id,
        industry: detectedIndustry,
        location: responseData.location,
        question: textQuery,
        recommendation: responseData.recommendation,
        confidence: responseData.confidence,
        weatherData: {
          temperature: responseData.weather.temperature,
          humidity: responseData.weather.humidity,
          rainChance: responseData.weather.rainChance,
          windSpeed: responseData.weather.windSpeed,
          summary: responseData.weather.summary
        },
        createdAt: Date.now()
      };
      saveRecommendation(loggedRec);
    } catch (error) {
      console.error("AI query execution failed:", error);
      setMessages((prev) => [...prev, {
        id: `bot-${Date.now()}`,
        sender: "assistant",
        text: "I encountered an error querying the intelligence engine. Please check your API keys and try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background text-on-background relative">
      
      {/* Top Header */}
      <section className="border-b border-surface-stroke py-4 px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Cpu className="h-5 w-5" />
          </div>
          <span className="text-sm font-bold text-on-surface">Ask AtmosIQ</span>
        </div>

        <div className="flex items-center gap-3">
          <Info className="h-4 w-4 text-on-surface-variant hover:text-on-surface cursor-pointer" />
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-secondary/25 bg-secondary/5 text-secondary text-[8.5px] font-bold text-label-mono uppercase tracking-wider animate-pulse">
            <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
            System Optimal
          </div>
        </div>
      </section>

      {/* Suggested chips overlay (Only show if thread is short/fresh) */}
      {messages.length === 1 && !loading && (
        <div className="flex flex-wrap items-center justify-center gap-3 px-8 mt-6">
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(sug)}
              className="px-4 py-2 border border-surface-stroke bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface rounded-lg transition-colors shadow-sm"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {/* Bot Profile Badge */}
            {msg.sender === "assistant" && (
              <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center border border-primary/25 shrink-0 mt-1 shadow-sm shadow-primary/5">
                <Cpu className="h-4.5 w-4.5" />
              </div>
            )}

            {/* Bubble */}
            {msg.text && (
              <div className={`p-4 rounded-xl text-xs max-w-xl leading-relaxed shadow ${
                msg.sender === "user"
                  ? "bg-surface-container-high border border-surface-stroke text-on-surface"
                  : "bg-surface-container border border-surface-stroke text-on-surface"
              }`}>
                {msg.text}
              </div>
            )}

            {/* High-fidelity Advisory Card */}
            {msg.card && (
              <div className="border border-surface-stroke bg-surface-container rounded-xl p-6 flex flex-col gap-5 max-w-2xl shadow-lg relative overflow-hidden flex-1">
                {/* Ribbon */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />

                {/* Summary text */}
                <p className="text-xs text-on-surface leading-relaxed font-semibold">
                  {msg.card.summary}
                </p>

                {/* Grid stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Recommendation Box */}
                  <div className="flex flex-col gap-1.5 p-4 rounded-lg bg-surface-container-lowest border-l-4 border-error border border-surface-stroke">
                    <span className="text-[8.5px] font-bold text-text-muted uppercase tracking-wider text-label-mono flex items-center gap-1.5">
                      <AlertTriangle className="h-3 w-3 text-error" /> Recommendation
                    </span>
                    <span className="text-sm font-bold text-on-surface">{msg.card.recommendation}</span>
                  </div>

                  {/* Confidence Box */}
                  <div className="flex flex-col gap-1.5 p-4 rounded-lg bg-surface-container-lowest border border-surface-stroke">
                    <span className="text-[8.5px] font-bold text-text-muted uppercase tracking-wider text-label-mono flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-secondary" /> Confidence Score
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-label-mono text-on-surface">{msg.card.confidence}%</span>
                      <div className="flex-1 bg-surface-container border border-surface-stroke h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-secondary transition-all duration-1000" 
                          style={{ width: `${msg.card.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reasoning Panel */}
                <div className="flex flex-col gap-2 pt-2">
                  <span className="text-[8.5px] font-bold text-text-muted uppercase tracking-wider text-label-mono flex items-center gap-1">
                    <Brain className="h-3 w-3 text-primary" /> Reasoning
                  </span>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    {msg.card.reasoning}
                  </p>
                </div>

                {/* Weather Factors */}
                <div className="flex flex-col gap-2 border-t border-surface-stroke pt-4">
                  <span className="text-[8.5px] font-bold text-text-muted uppercase tracking-wider text-label-mono flex items-center gap-1">
                    <Snowflake className="h-3.5 w-3.5 text-secondary animate-spin-slow" /> Weather Factors
                  </span>
                  
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-surface-container-high border border-surface-stroke text-[10px] font-bold text-on-surface text-label-mono">
                      <CloudRain className="h-3.5 w-3.5 text-primary" /> Precip: {msg.card.factors.precip}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-surface-container-high border border-surface-stroke text-[10px] font-bold text-on-surface text-label-mono">
                      <Wind className="h-3.5 w-3.5 text-secondary" /> Wind: {msg.card.factors.wind}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-surface-container-high border border-surface-stroke text-[10px] font-bold text-on-surface text-label-mono">
                      <Thermometer className="h-3.5 w-3.5 text-tertiary" /> Temp: {msg.card.factors.temp}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-surface-container-high border border-surface-stroke text-[10px] font-bold text-on-surface text-label-mono">
                      <Cloud className="h-3.5 w-3.5 text-primary" /> Cover: {msg.card.factors.cover}
                    </span>
                  </div>
                </div>

              </div>
            )}
          </div>
        ))}

        {/* Loader bubble */}
        {loading && (
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center border border-primary/25 shrink-0 animate-pulse">
              <Cpu className="h-4.5 w-4.5" />
            </div>
            <div className="flex items-center gap-2 p-3 bg-surface-container border border-surface-stroke rounded-xl">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-[10px] text-on-surface-variant text-label-mono">AtmosIQ is compiling weather factors...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Chat Input Form */}
      <section className="p-6 border-t border-surface-stroke shrink-0 bg-background flex flex-col gap-2.5">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendQuery(input); }}
          className="relative flex items-center max-w-4xl mx-auto w-full"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AtmosIQ anything about the environment..."
            className="w-full h-12 pl-4 pr-28 rounded-lg border border-surface-stroke bg-surface-container-low text-xs text-on-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-inner"
          />
          
          <div className="absolute right-2.5 flex items-center gap-2">
            <button 
              type="button" 
              className="text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-surface-container transition-colors"
              title="Add attachment"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <button 
              type="button" 
              className="text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-surface-container transition-colors"
              title="Voice input"
            >
              <Mic className="h-4 w-4" />
            </button>
            <button
              type="submit"
              disabled={!input.trim()}
              className="h-7 w-7 rounded-lg bg-[#a2c8ff] text-[#07224f] hover:bg-primary transition-colors flex items-center justify-center disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5 fill-current" />
            </button>
          </div>
        </form>

        <p className="text-[8px] text-text-muted text-center text-label-mono font-bold tracking-widest mt-1">
          ATMOSIQ MAY PROVIDE PROBABILISTIC DATA. VERIFY CRITICAL PLANS.
        </p>
      </section>

    </div>
  );
}

export default function AiConsolePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background text-on-background px-6 py-10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="text-xs text-text-muted font-medium text-label-mono">Initializing Console...</span>
        </div>
      </div>
    }>
      <AiConsoleContent />
    </Suspense>
  );
}
