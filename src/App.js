import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Area, AreaChart, CartesianGrid, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Cell
} from "recharts";
import { Search, Mic, Send, ChevronRight, Filter, Users, Palette, Sun, Eye } from "lucide-react";

// Import images from the assets folder
import fordLogo from "./assets/ford-logo.png";
import heroImage from "./assets/front_image.png";

// ---------------------------- Theme Definitions -----------------------------
const themes = {
  professional: {
    name: "Professional",
    icon: <Palette className="h-4 w-4" />,
    colors: {
      primary: "from-sky-50 via-white to-indigo-50",
      card: "bg-white/90 backdrop-blur",
      border: "border-slate-200",
      text: "text-slate-900",
      textSecondary: "text-slate-600",
      textMuted: "text-slate-500",
      accent: "bg-blue-600",
      accentHover: "hover:bg-blue-700",
      progress: "from-blue-400 to-indigo-600",
      header: "bg-white/80 backdrop-blur-xl",
      chart: "bg-white",
      tooltip: "bg-slate-900 text-white"
    },
    fonts: {
      base: "text-base",
      heading: "text-3xl md:text-4xl",
      kpi: "text-3xl",
      table: "text-sm"
    }
  },
  vibrant: {
    name: "Vibrant",
    icon: <Sun className="h-4 w-4" />,
    colors: {
      primary: "from-blue-600 via-blue-800 to-yellow-600",
      card: "bg-gradient-to-br from-blue-900/80 via-blue-800/80 to-yellow-600/70 backdrop-blur border-2",
      border: "border-blue-300",
      text: "text-white",
      textSecondary: "text-gray-100",
      textMuted: "text-gray-200",
      accent: "bg-gradient-to-r from-blue-700 via-blue-800 to-yellow-600",
      accentHover: "hover:from-blue-800 hover:via-blue-900 hover:to-yellow-700",
      progress: "from-blue-600 via-blue-800 to-yellow-600",
      header: "bg-gradient-to-r from-blue-900/80 via-blue-800/80 to-yellow-600/80 backdrop-blur-xl border-blue-300",
      chart: "bg-gradient-to-br from-blue-900/70 via-blue-800/70 to-yellow-600/60",
      tooltip: "bg-gradient-to-r from-blue-900 to-blue-800 text-white"
    },
    fonts: {
      base: "text-base",
      heading: "text-3xl md:text-4xl",
      kpi: "text-3xl",
      table: "text-sm"
    }
  },
  readable: {
    name: "Readable",
    icon: <Eye className="h-4 w-4" />,
    colors: {
      primary: "from-gray-50 via-white to-gray-100",
      card: "bg-white",
      border: "border-gray-300",
      text: "text-gray-900",
      textSecondary: "text-gray-700",
      textMuted: "text-gray-500",
      accent: "bg-gray-800",
      accentHover: "hover:bg-gray-900",
      progress: "from-gray-600 to-gray-800",
      header: "bg-white border-gray-300",
      chart: "bg-white",
      tooltip: "bg-gray-900 text-white"
    },
    fonts: {
      base: "text-lg",
      heading: "text-4xl md:text-5xl",
      kpi: "text-4xl",
      table: "text-base"
    }
  }
};

// ---------------------------- Mock Data -----------------------------
const kpis = {
  liveProjects: 12,
  completedProjects: 23,
  weeklyLoC: [
    { week: "W-7", loc: 98_450 },
    { week: "W-6", loc: 134_220 },
    { week: "W-5", loc: 187_890 },
    { week: "W-4", loc: 156_780 },
    { week: "W-3", loc: 223_450 },
    { week: "W-2", loc: 198_670 },
    { week: "W-1", loc: 267_890 },
  ],
  evalScores: [
    { metric: "Document Comprehension", score: 4.2 },
    { metric: "Capability Extraction", score: 4.7 },
    { metric: "Application Accuracy", score: 4.1 },
    { metric: "COBOL Tech Design", score: 4.5 },
    { metric: "Code Quality", score: 4.3 },
    { metric: "Performance", score: 4.8 },
  ],
};
const cumulativeLoC = 1_567_350; // > 1.5M with variation

const PIPELINE = [
  "Data Ingestion",
  "Document Generation",
  "Document Evaluation",
  "SME Approval (Docs)",
  "TTD Generation",
  "Code Conversion",
  "Code Evaluation",
  "SME Approval (Code)",
  "Sandbox Release",
  "Project Completed",
];

const PROJECTS = [
  { name: "MISC", owner: "Ford Credit", progress: 8, risk: "low" },
  { name: "GEVIS", owner: "Ford NA", progress: 4, risk: "medium" },
  { name: "GEMSL", owner: "Global Parts", progress: 6, risk: "low" },
  { name: "AC625100", owner: "HR Apps", progress: 10, risk: "low" },
  { name: "CCAC6250", owner: "Finance Ops", progress: 7, risk: "medium" },
  { name: "EXWWB909", owner: "Vehicle Ops", progress: 5, risk: "low" },
  { name: "VINCENT-Bridge", owner: "Incentives", progress: 3, risk: "high" },
  { name: "Dealer360", owner: "Dealer IT", progress: 2, risk: "medium" },
  { name: "WarrantyIQ", owner: "Service", progress: 9, risk: "low" },
  { name: "GRC-Mainframe", owner: "Risk", progress: 1, risk: "high" },
  { name: "PartsTracker", owner: "Supply Chain", progress: 4, risk: "medium" },
  { name: "FleetManager", owner: "Logistics", progress: 6, risk: "low" },
  { name: "CustomerHub", owner: "Customer Care", progress: 8, risk: "low" },
  { name: "InventoryPro", owner: "Warehouse", progress: 2, risk: "high" },
  { name: "SalesForce", owner: "Sales Ops", progress: 5, risk: "medium" },
  { name: "QualityAssurance", owner: "QA Team", progress: 7, risk: "low" },
  { name: "MaintenanceTracker", owner: "Service Tech", progress: 3, risk: "medium" },
  { name: "FinancialAnalytics", owner: "Finance", progress: 9, risk: "low" },
  { name: "HRPortal", owner: "Human Resources", progress: 1, risk: "high" },
  { name: "SecurityMonitor", owner: "IT Security", progress: 6, risk: "medium" },
];

// Varied distribution for stage chart (counts by exact stage)
const stageBuckets = PIPELINE.map((stage, idx) => ({
  stage,
  count: PROJECTS.filter(p => p.progress === idx + 1).length,
}));

// ------------------------- Voice Chat Helper ------------------------
function useSpeechRecognition(enabled) {
  const [transcript, setTranscript] = useState("");
  const recRef = useRef(null);
  const start = () => {
    if (!enabled) return;
    const SR = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SR) return alert("SpeechRecognition not supported in this browser.");
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      const last = e.results[e.results.length - 1];
      setTranscript(last[0].transcript);
    };
    rec.start();
    recRef.current = rec;
  };
  const stop = () => recRef.current && recRef.current.stop && recRef.current.stop();
  return { transcript, setTranscript, start, stop };
}

// ---------------------------- Theme Selector -------------------------------
function ThemeSelector({ currentTheme, onThemeChange }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors duration-150"
        title="Change theme"
      >
        {themes[currentTheme].icon}
        <span className="text-sm">{themes[currentTheme].name}</span>
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-lg z-50 min-w-48">
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => {
                onThemeChange(key);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors duration-150 ${
                currentTheme === key ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
              } ${key === 'professional' ? 'rounded-t-xl' : ''} ${key === 'readable' ? 'rounded-b-xl' : ''}`}
            >
              {theme.icon}
              <span className="text-sm font-medium">{theme.name}</span>
              {currentTheme === key && (
                <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------- UI Bits -------------------------------
function KPI({ label, value, sub, theme }) {
  const isVibrant = theme.name === "Vibrant";
  const vibrantGradients = [
    "bg-gradient-to-br from-blue-600/90 to-blue-800/90 border-blue-400",
    "bg-gradient-to-br from-blue-800/90 to-blue-900/90 border-blue-500", 
    "bg-gradient-to-br from-blue-700/90 to-yellow-600/90 border-yellow-400",
    "bg-gradient-to-br from-yellow-600/90 to-blue-600/90 border-yellow-300"
  ];
  const vibrantIndex = label.length % 4; // Use label length to determine gradient
  
  return (
    <div className={`p-5 ${isVibrant ? vibrantGradients[vibrantIndex] : theme.colors.card} rounded-2xl shadow-md border ${isVibrant ? 'border-2' : theme.colors.border} flex flex-col gap-1 ${isVibrant ? 'shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105' : ''}`}>
      <div className={`text-sm ${theme.colors.textMuted}`}>{label}</div>
      <div className={`${theme.fonts.kpi} font-semibold tracking-tight ${theme.colors.text}`}>{value}</div>
      {sub && <div className={`text-xs ${theme.colors.textMuted}`}>{sub}</div>}
    </div>
  );
}

function ProgressPills({ progress, theme }) {
  const isVibrant = theme.name === "Vibrant";
  const vibrantColors = [
    "from-blue-600 to-blue-800",
    "from-blue-700 to-blue-900", 
    "from-blue-800 to-yellow-600",
    "from-yellow-600 to-blue-700",
    "from-blue-700 to-blue-900",
    "from-blue-800 to-blue-900",
    "from-blue-900 to-yellow-700",
    "from-yellow-700 to-blue-800",
    "from-blue-800 to-blue-900",
    "from-blue-900 to-yellow-800"
  ];
  
  return (
    <div className="group relative flex items-center gap-1">
      {PIPELINE.map((stage, i) => (
        <div 
          key={i} 
          className={`h-2 w-6 rounded-full transition-all duration-200 ${
            i < progress 
              ? `bg-gradient-to-r ${isVibrant ? vibrantColors[i] : theme.colors.progress}` 
              : "bg-gray-200"
          }`}
          title={`${stage}${i < progress ? " ✓" : ""}`}
        />
      ))}
      <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 ${theme.colors.tooltip} text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10`}>
        {PIPELINE[progress - 1]}
      </div>
    </div>
  );
}

function RiskBadge({ risk, theme }) {
  const isVibrant = theme.name === "Vibrant";
  const palette = isVibrant ? {
    low: "bg-gradient-to-r from-blue-600 to-blue-800 text-white border-blue-700",
    medium: "bg-gradient-to-r from-yellow-600 to-orange-600 text-white border-orange-600",
    high: "bg-gradient-to-r from-red-600 to-orange-700 text-white border-red-600",
  } : {
    low: "bg-emerald-100 text-emerald-800 border-emerald-300",
    medium: "bg-amber-100 text-amber-800 border-amber-300",
    high: "bg-rose-100 text-rose-800 border-rose-300",
  };
  const riskDescriptions = {
    low: "On track - minimal issues expected",
    medium: "Some concerns - requires attention",
    high: "Critical issues - immediate action needed"
  };
  
  return (
    <div className="group relative">
      <span className={`px-2.5 py-1 text-xs rounded-full border cursor-help transition-all duration-200 hover:scale-105 ${isVibrant ? 'shadow-lg hover:shadow-xl' : ''} ${palette[risk] || palette.low}`}>
        {risk}
      </span>
      <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 ${theme.colors.tooltip} text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 max-w-48`}>
        {riskDescriptions[risk]}
      </div>
    </div>
  );
}

// ----------------------------- Main UI ------------------------------
export default function App() {
  const [q, setQ] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentTheme, setCurrentTheme] = useState("professional");
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const { transcript, setTranscript, start } = useSpeechRecognition(true);

  useEffect(() => { if (transcript) setQ(transcript); }, [transcript]);

  const filtered = useMemo(
    () => PROJECTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.owner.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  const handleAsk = () => {
    if (!q.trim()) return;
    const found = PROJECTS.find(p => p.name.toLowerCase() === q.toLowerCase());
    const reply = found
      ? `${found.name} is at stage "${PIPELINE[found.progress - 1]}" with risk ${found.risk}.`
      : `I found ${filtered.length} matching projects. Try a full name (e.g., "MISC").`;
    setMessages(m => [...m, { role: "user", text: q }, { role: "assistant", text: reply }]);
    setQ("");
    setTranscript("");
  };

  // Radar with two series: Current vs Target
  const radarData = kpis.evalScores.map(e => ({ metric: e.metric, Current: e.score, Target: 4.5 }));
  const weeklyWithCum = kpis.weeklyLoC.map((d, i) => ({ ...d, cumulative: kpis.weeklyLoC.slice(0, i + 1).reduce((s, r) => s + r.loc, 0) }));

  // Image fallbacks (for canvas preview)
  const [logoSrc, setLogoSrc] = useState(fordLogo);
  const [heroSrc, setHeroSrc] = useState(heroImage);

  const theme = themes[currentTheme];
  
  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.primary} ${theme.colors.text}`}>
      {/* Top Nav */}
      <header className={`sticky top-0 z-40 ${theme.colors.header} border-b ${theme.colors.border}`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <img
            src={logoSrc}
            onError={() => setLogoSrc("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='36'%3E%3Crect width='100%25' height='100%25' rx='18' fill='%231e3a8a'/%3E%3Ctext x='50%25' y='62%25' text-anchor='middle' font-size='18' fill='white' font-family='Arial' %3EFord%3C/text%3E%3C/svg%3E")}
            alt="Ford" className="h-9" />
          <div className={`text-xl font-bold ${theme.colors.text}`}>Ford Falcon</div>
          <div className="ml-auto flex items-center gap-3">
            <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
            <button
              className={`rounded-xl border ${theme.colors.border} px-3 py-1.5 text-sm hover:bg-slate-50 ${theme.colors.text}`}
              onClick={() => alert("Hook this to your SSO auth route.")}
            >
              SSO Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <img
          src={heroSrc}
          onError={() => setHeroSrc("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230ea5e9'/%3E%3Cstop offset='1' stop-color='%236366f1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3Ctext x='50%25' y='55%25' text-anchor='middle' font-size='36' fill='white' font-family='Arial' %3EFalcon Hero%3C/text%3E%3C/svg%3E")}
          alt="Falcon Hero" className="w-full h-[300px] md:h-[400px] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/0" />
        <div className="absolute bottom-6 left-6 text-white max-w-4xl">
          <motion.h1 initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className={`${theme.fonts.heading} font-bold drop-shadow`}>
            AI‑Driven Legacy Code Conversion — at Ford Scale
          </motion.h1>
          <p className={`mt-2 text-white/90 max-w-2xl ${theme.fonts.base}`}>End‑to‑end ingestion, comprehension, and modernization with measurable quality and SME loops.</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 pb-24 mt-8">
        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <KPI label="Live Projects" value={`${kpis.liveProjects}`} sub="currently active" theme={theme} />
          <KPI label="Completed Projects" value={`${kpis.completedProjects}`} sub="all time" theme={theme} />
          <KPI label="LoC Processed (weekly)" value={`${(kpis.weeklyLoC.at(-1)?.loc || 0).toLocaleString()}`} theme={theme} />
          <KPI label="Cumulative LoC" value={`${cumulativeLoC.toLocaleString()}`} sub="> 1,000,000" theme={theme} />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Weekly LoC */}
          <div className={`${theme.colors.chart} rounded-2xl border ${theme.colors.border} p-4 shadow`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold ${theme.colors.text}`}>Lines of Code Processed</h3>
              <span className={`text-xs ${theme.colors.textMuted}`}>weekly</span>
            </div>
            <div className="h-56 mt-2">
              <ResponsiveContainer>
                <AreaChart data={weeklyWithCum}>
                  <defs>
                    <linearGradient id="loc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.name === "Vibrant" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)"} />
                  <XAxis dataKey="week" tick={{ fill: theme.name === "Vibrant" ? 'white' : '#374151', fontSize: 12 }} />
                  <YAxis tick={{ fill: theme.name === "Vibrant" ? 'white' : '#374151', fontSize: 12 }} />
                  <Tooltip contentStyle={{ 
                    backgroundColor: theme.name === "Vibrant" ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.95)', 
                    color: theme.name === "Vibrant" ? 'white' : '#374151', 
                    border: theme.name === "Vibrant" ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)' 
                  }} />
                  <Area type="monotone" dataKey="loc" stroke="#2563eb" fill="url(#loc)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Evaluation Scores Radar */}
          <div className={`${theme.colors.chart} rounded-2xl border ${theme.colors.border} p-4 shadow`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold ${theme.colors.text}`}>Evaluation Scores (0–5)</h3>
              <span className={`text-xs ${theme.colors.textMuted}`}>docs + code</span>
            </div>
            <div className="h-56 mt-2">
              <ResponsiveContainer>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={theme.name === "Vibrant" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)"} />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: theme.name === "Vibrant" ? 'white' : '#374151', fontSize: 10 }} />
                  <Radar name="Current" dataKey="Current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.35} />
                  <Radar name="Target" dataKey="Target" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} />
                  <Legend wrapperStyle={{ color: theme.name === "Vibrant" ? 'white' : '#374151' }} />
                  <Tooltip contentStyle={{ 
                    backgroundColor: theme.name === "Vibrant" ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.95)', 
                    color: theme.name === "Vibrant" ? 'white' : '#374151', 
                    border: theme.name === "Vibrant" ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)' 
                  }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stage Distribution */}
          <div className={`${theme.colors.chart} rounded-2xl border ${theme.colors.border} p-4 shadow`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold ${theme.colors.text}`}>Projects by Current Stage</h3>
              <span className={`text-xs ${theme.colors.textMuted}`}>count</span>
            </div>
            <div className="h-56 mt-2">
              <ResponsiveContainer>
                <BarChart data={stageBuckets}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.name === "Vibrant" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)"} />
                  <XAxis dataKey="stage" hide />
                  <YAxis allowDecimals={false} tick={{ fill: theme.name === "Vibrant" ? 'white' : '#374151', fontSize: 12 }} />
                  <Tooltip contentStyle={{ 
                    backgroundColor: theme.name === "Vibrant" ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.95)', 
                    color: theme.name === "Vibrant" ? 'white' : '#374151', 
                    border: theme.name === "Vibrant" ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)' 
                  }} />
                  <Bar dataKey="count">
                    {stageBuckets.map((_, i) => (
                      <Cell key={`c-${i}`} fill={["#0ea5e9","#22c55e","#f59e0b","#ef4444","#6366f1","#14b8a6","#84cc16","#e879f9","#06b6d4","#f97316"][i % 10]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className={`text-xs ${theme.colors.textMuted} mt-2`}>Hover bars for stage details</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 mt-8">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-2.5 h-4 w-4 text-white/60`} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search projects, owners…"
              className={`w-full pl-9 pr-3 py-2 rounded-xl border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white bg-white/10 placeholder-white/60`}
            />
          </div>
          <button className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border ${theme.colors.border} text-white hover:bg-white/10`}>
            <Filter className="h-4 w-4"/>Filters
          </button>
        </div>

        {/* Projects Table */}
        <div className={`mt-4 ${theme.colors.chart} rounded-2xl border ${theme.colors.border} overflow-hidden shadow`}>
          <div className={`px-4 py-3 border-b border-white/20 flex items-center gap-2`}>
            <Users className={`h-4 w-4 ${theme.colors.textSecondary}`}/>
            <div className={`font-semibold ${theme.colors.text}`}>Projects</div>
            <div className={`ml-auto text-xs ${theme.colors.textMuted} group relative`}>
              <span className="cursor-help">Showing {filtered.length} of {PROJECTS.length}</span>
              <div className={`absolute -top-20 right-0 ${theme.colors.tooltip} text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20 shadow-lg`}>
                <div className="font-semibold mb-1">Project Summary</div>
                <div>Total: {PROJECTS.length}</div>
                <div>Active: {PROJECTS.filter(p => p.progress < 10).length}</div>
                <div>Completed: {PROJECTS.filter(p => p.progress === 10).length}</div>
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className={`min-w-full ${theme.fonts.table}`}>
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-4 py-2">Name</th>
                  <th className="text-left px-4 py-2">Owner</th>
                  <th className="text-left px-4 py-2">Stage</th>
                  <th className="text-left px-4 py-2">Progress</th>
                  <th className="text-left px-4 py-2">Risk</th>
                  <th className="text-left px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.name} className="border-t border-slate-100 hover:bg-slate-50 transition-colors duration-150 group">
                    <td className={`px-4 py-2 font-medium ${theme.name === "Vibrant" ? "text-white group-hover:text-gray-200" : "group-hover:text-blue-600"} transition-colors duration-150`}>{p.name}</td>
                    <td className={`px-4 py-2 ${theme.name === "Vibrant" ? "text-white group-hover:text-gray-200" : "group-hover:text-slate-700"} transition-colors duration-150`}>{p.owner}</td>
                    <td className={`px-4 py-2 ${theme.name === "Vibrant" ? "text-white group-hover:text-gray-200" : "text-slate-600 group-hover:text-slate-800"} transition-colors duration-150`} title={`Stage ${p.progress} of ${PIPELINE.length}`}>
                      {PIPELINE[p.progress - 1]}
                    </td>
                    <td className="px-4 py-2">
                      <div className="group/progress relative">
                        <ProgressPills progress={p.progress} theme={theme} />
                        <div className={`absolute -top-16 left-1/2 transform -translate-x-1/2 ${theme.colors.tooltip} text-xs px-3 py-2 rounded-lg opacity-0 group-hover/progress:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20 shadow-lg`}>
                          <div className="font-semibold mb-1">{p.name}</div>
                          <div>Stage {p.progress} of {PIPELINE.length}</div>
                          <div className="text-slate-300">{PIPELINE[p.progress - 1]}</div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2"><RiskBadge risk={p.risk} theme={theme} /></td>
                    <td className="px-4 py-2">
                      <button 
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border ${theme.colors.border} hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-150`}
                        title={`View detailed information for ${p.name}`}
                      >
                        Details <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-150"/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6">
        {!isChatExpanded ? (
          // Minimized Chat Widget
          <button
            onClick={() => setIsChatExpanded(true)}
            className={`${theme.colors.chart} rounded-full p-4 shadow-xl border ${theme.colors.border} hover:scale-105 transition-all duration-300`}
            title="Open Chat"
          >
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${theme.colors.accent} animate-pulse`}></div>
              <span className={`${theme.colors.text} font-medium text-sm`}>Ask Falcon</span>
            </div>
          </button>
        ) : (
          // Expanded Chat Interface
          <div className={`w-96 h-96 ${theme.colors.chart} rounded-2xl shadow-xl border ${theme.colors.border} overflow-hidden flex flex-col`}>
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-white/20 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${theme.colors.accent} animate-pulse`}></div>
              <div className={`font-semibold ${theme.colors.text}`}>Ask Falcon</div>
              <div className={`ml-auto text-xs ${theme.colors.textMuted}`}>Chat + Voice</div>
              <button
                onClick={() => setIsChatExpanded(false)}
                className={`p-1 rounded hover:bg-white/10 text-white transition-colors duration-150`}
                title="Minimize Chat"
              >
                <ChevronRight className="h-4 w-4 rotate-90" />
              </button>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className={`w-12 h-12 rounded-full ${theme.colors.accent} mx-auto mb-3 flex items-center justify-center`}>
                    <Send className="h-6 w-6 text-white" />
                  </div>
                  <p className={`text-sm ${theme.colors.textMuted} mb-2`}>Welcome to Ford Falcon Chat!</p>
                  <p className={`text-xs ${theme.colors.textMuted}`}>Ask about projects, stages, or say: "What stage is GEVIS?"</p>
                </div>
              )}
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                    m.role === "user" 
                      ? `${theme.colors.accent} text-white` 
                      : "bg-white/20 text-white border border-white/30"
                  }`}>
                    <div className="text-sm">{m.text}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Chat Input */}
            <div className="p-4 border-t border-white/20">
              <div className="flex items-center gap-2">
                <button 
                  onClick={start} 
                  className={`p-2 rounded-xl border ${theme.colors.border} hover:bg-white/10 text-white transition-colors duration-150`} 
                  title="Voice Input"
                >
                  <Mic className="h-4 w-4"/>
                </button>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                  placeholder="Type your question…"
                  className={`flex-1 px-3 py-2 rounded-xl border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white bg-white/10 placeholder-white/60`}
                />
                <button 
                  onClick={handleAsk} 
                  className={`p-2 rounded-xl ${theme.colors.accent} text-white ${theme.colors.accentHover} transition-colors duration-150`}
                  title="Send Message"
                >
                  <Send className="h-4 w-4"/>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
