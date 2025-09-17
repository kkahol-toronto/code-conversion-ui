import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Area, AreaChart, CartesianGrid, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Cell
} from "recharts";
import { Search, Mic, Send, ChevronRight, Filter, Users, Palette, Sun, Eye, Bell, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProjectDetails from "./ProjectDetails";
import NotificationsPage from "./NotificationsPage";
import ThemeSelector from "./ThemeSelector";
import { useTheme } from "../context/ThemeContext";

// Import images from the assets folder
import fordLogo from "../assets/ford-logo.png";
import heroImage from "../assets/front_image.png";

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
    { metric: "Document Comprehension", score: 4.6 },
    { metric: "Capability Extraction", score: 4.37 },
    { metric: "Application Accuracy", score: 4.4 },
    { metric: "COBOL Tech Design", score: 4.3 },
    { metric: "Code Quality", score: 4.5 },
    { metric: "Performance", score: 4.2 },
  ],
};

const cumulativeLoC = 1_567_350; // > 1M as requested

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

const INITIAL_PROJECTS = [
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
  { name: "InventoryPlus", owner: "Supply Chain", progress: 4, risk: "medium" },
  { name: "CustomerHub", owner: "Sales", progress: 6, risk: "low" },
  { name: "PaymentGateway", owner: "Finance", progress: 8, risk: "low" },
  { name: "AnalyticsEngine", owner: "Data Science", progress: 5, risk: "medium" },
  { name: "ComplianceTracker", owner: "Legal", progress: 3, risk: "high" },
  { name: "FleetManager", owner: "Operations", progress: 7, risk: "low" },
  { name: "QualityControl", owner: "Manufacturing", progress: 9, risk: "low" },
  { name: "HRPortal", owner: "Human Resources", progress: 2, risk: "medium" },
  { name: "SecurityCenter", owner: "IT Security", progress: 6, risk: "high" },
  { name: "ReportingSuite", owner: "Business Intelligence", progress: 4, risk: "low" },
];



const riskDescriptions = {
  low: "Minimal risk with well-defined requirements and stable technology stack",
  medium: "Moderate risk with some technical challenges and scope uncertainties",
  high: "High risk with complex legacy systems, unclear requirements, or tight timelines"
};

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

// ---------------------------- UI Bits -------------------------------
function KPI({ label, value, sub, theme }) {
  const vibrantGradients = [
    "from-blue-600/90 via-blue-700/90 to-blue-800/90",
    "from-indigo-600/90 via-indigo-700/90 to-indigo-800/90",
    "from-yellow-600/90 via-yellow-700/90 to-yellow-800/90",
    "from-blue-700/90 via-indigo-700/90 to-yellow-700/90"
  ];
  
  return (
    <div className={`p-5 ${theme.name === "Vibrant" ? `bg-gradient-to-br ${vibrantGradients[Math.floor(Math.random() * vibrantGradients.length)]} backdrop-blur border-2 border-blue-300` : theme.colors.card} rounded-2xl shadow-md ${theme.colors.border} flex flex-col gap-1`}>
      <div className={`text-sm ${theme.colors.textMuted}`}>{label}</div>
      <div className={`${theme.fonts.kpi} font-semibold tracking-tight ${theme.colors.text}`}>{value}</div>
      {sub && <div className={`text-xs ${theme.colors.textMuted}`}>{sub}</div>}
    </div>
  );
}

function ProgressPills({ progress, theme }) {
  const vibrantGradients = [
    "from-blue-600 via-blue-700 to-blue-800",
    "from-indigo-600 via-indigo-700 to-indigo-800",
    "from-yellow-600 via-yellow-700 to-yellow-800",
    "from-blue-700 via-indigo-700 to-yellow-700",
    "from-indigo-700 via-blue-700 to-yellow-600",
    "from-yellow-700 via-blue-600 to-indigo-700",
    "from-blue-800 via-yellow-600 to-indigo-600",
    "from-indigo-800 via-blue-600 to-yellow-700",
    "from-yellow-800 via-indigo-600 to-blue-700",
    "from-blue-600 via-yellow-800 to-indigo-600"
  ];
  
  return (
    <div className="flex items-center gap-1">
      {PIPELINE.map((_, i) => (
        <div key={i} className={`h-2 w-6 rounded-full ${
          i < progress 
            ? theme.name === "Vibrant" 
              ? `bg-gradient-to-r ${vibrantGradients[i % vibrantGradients.length]}`
              : "bg-gradient-to-r from-blue-400 to-indigo-600"
            : "bg-gray-200"
        }`} />
      ))}
    </div>
  );
}

function RiskBadge({ risk, theme }) {
  const vibrantGradients = {
    low: "from-green-600 via-green-700 to-green-800",
    medium: "from-yellow-600 via-yellow-700 to-yellow-800", 
    high: "from-red-600 via-red-700 to-red-800"
  };
  
  const palette = {
    low: theme.name === "Vibrant" 
      ? `bg-gradient-to-r ${vibrantGradients.low} text-white border-green-300`
      : "bg-emerald-100 text-emerald-800 border-emerald-300",
    medium: theme.name === "Vibrant"
      ? `bg-gradient-to-r ${vibrantGradients.medium} text-white border-yellow-300`
      : "bg-amber-100 text-amber-800 border-amber-300",
    high: theme.name === "Vibrant"
      ? `bg-gradient-to-r ${vibrantGradients.high} text-white border-red-300`
      : "bg-rose-100 text-rose-800 border-rose-300",
  };
  
  return <span className={`px-2.5 py-1 text-xs rounded-full border ${palette[risk] || palette.low}`}>{risk}</span>;
}



// ----------------------------- Main Dashboard ------------------------------
export default function Dashboard() {
  const navigate = useNavigate();
  const { currentTheme, changeTheme, theme: themeConfig } = useTheme();
  const [q, setQ] = useState("");
  const [messages, setMessages] = useState([]);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    owner: "",
    risk: "low"
  });
  const [projects, setProjects] = useState(() => {
    // Load projects from localStorage or use initial projects
    const savedProjects = localStorage.getItem('ford-falcon-projects');
    return savedProjects ? JSON.parse(savedProjects) : INITIAL_PROJECTS;
  });
  
  // Save projects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ford-falcon-projects', JSON.stringify(projects));
  }, [projects]);
  
  const { transcript, setTranscript, start } = useSpeechRecognition(true);

  useEffect(() => {
    if (transcript) setQ(transcript);
  }, [transcript]);

  const filtered = useMemo(
    () => projects.filter(p => 
      p.name.toLowerCase().includes(q.toLowerCase()) || 
      p.owner.toLowerCase().includes(q.toLowerCase())
    ),
    [q, projects]
  );

  const handleAsk = () => {
    if (!q.trim()) return;
    
    const found = projects.find(p => p.name.toLowerCase() === q.toLowerCase());
    const reply = found 
      ? `${found.name} is at stage "${PIPELINE[found.progress - 1]}" with risk ${found.risk}.`
      : `I found ${filtered.length} matching projects. Try a full name (e.g., "MISC").`;
    
    setMessages(m => [...m, { role: "user", text: q }, { role: "assistant", text: reply }]);
    setQ("");
    setTranscript("");
  };

  // Radar with two series: Current vs Target
  const radarData = kpis.evalScores.map(e => ({
    metric: e.metric,
    Current: e.score,
    Target: 4.5
  }));

  const weeklyWithCum = kpis.weeklyLoC.map((d, i) => ({
    ...d,
    cumulative: kpis.weeklyLoC.slice(0, i + 1).reduce((s, r) => s + r.loc, 0)
  }));

  // Varied distribution for stage chart (counts by exact stage)
  const stageBuckets = PIPELINE.map((stage, idx) => ({
    stage,
    count: projects.filter(p => p.progress === idx + 1).length,
  }));

  // Image fallbacks (for canvas preview)
  const [logoSrc, setLogoSrc] = useState(fordLogo);
  const [heroSrc, setHeroSrc] = useState(heroImage);

  const theme = themeConfig;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.primary} ${theme.colors.text}`}>
      {/* Top Nav */}
      <header className={`sticky top-0 z-40 ${theme.colors.header} border-b ${theme.colors.border}`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <img 
            src={logoSrc} 
            onError={() => setLogoSrc("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='36'%3E%3Crect width='100%25' height='100%25' rx='18' fill='%231e3a8a'/%3E%3Ctext x='50%25' y='62%25' text-anchor='middle' font-size='18' fill='white' font-family='Arial' %3EFord%3C/text%3E%3C/svg%3E")} 
            alt="Ford" 
            className="h-9" 
          />
          <div className={`text-xl font-bold ${theme.colors.text}`}>Ford Falcon</div>
          <div className="ml-auto flex items-center gap-3">
            <ThemeSelector currentTheme={currentTheme} onThemeChange={changeTheme} />
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors"
              title="Global Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <button 
              className={`rounded-xl border ${theme.colors.border} px-3 py-1.5 text-sm hover:bg-slate-50 ${theme.colors.text}`}
              onClick={() => alert("Hook this to your Azure AD auth route.")}
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
          alt="Falcon Hero" 
          className="w-full h-[300px] md:h-[400px] object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/0" />
        <div className="absolute bottom-6 left-6 text-white max-w-4xl">
          <motion.h1 
            initial={{ y: 16, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.6 }}
            className={`${theme.fonts.heading} font-bold drop-shadow`}
          >
            AI‑Driven Legacy Code Conversion — at Ford Scale
          </motion.h1>
          <p className={`mt-2 text-white/90 max-w-2xl ${theme.fonts.base}`}>
            End‑to‑end ingestion, comprehension, and modernization with measurable quality and SME loops.
          </p>
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
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.name === "Vibrant" ? "#ffffff40" : "#e5e7eb"} />
                  <XAxis 
                    dataKey="week" 
                    tick={{ fill: theme.name === "Vibrant" ? "#ffffff" : "#6b7280" }}
                  />
                  <YAxis tick={{ fill: theme.name === "Vibrant" ? "#ffffff" : "#6b7280" }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: theme.name === "Vibrant" ? "#1e3a8a" : "#ffffff",
                      color: theme.name === "Vibrant" ? "#ffffff" : "#000000",
                      border: theme.name === "Vibrant" ? "1px solid #3b82f6" : "1px solid #e5e7eb"
                    }}
                  />
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
                  <PolarGrid stroke={theme.name === "Vibrant" ? "#ffffff40" : "#e5e7eb"} />
                  <PolarAngleAxis 
                    dataKey="metric" 
                    tick={{ fill: theme.name === "Vibrant" ? "#ffffff" : "#6b7280" }}
                  />
                  <Radar name="Current" dataKey="Current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.35} />
                  <Radar name="Target" dataKey="Target" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} />
                  <Legend 
                    wrapperStyle={{ color: theme.name === "Vibrant" ? "#ffffff" : "#6b7280" }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: theme.name === "Vibrant" ? "#1e3a8a" : "#ffffff",
                      color: theme.name === "Vibrant" ? "#ffffff" : "#000000",
                      border: theme.name === "Vibrant" ? "1px solid #3b82f6" : "1px solid #e5e7eb"
                    }}
                  />
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
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.name === "Vibrant" ? "#ffffff40" : "#e5e7eb"} />
                  <XAxis dataKey="stage" hide />
                  <YAxis 
                    allowDecimals={false} 
                    tick={{ fill: theme.name === "Vibrant" ? "#ffffff" : "#6b7280" }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: theme.name === "Vibrant" ? "#1e3a8a" : "#ffffff",
                      color: theme.name === "Vibrant" ? "#ffffff" : "#000000",
                      border: theme.name === "Vibrant" ? "1px solid #3b82f6" : "1px solid #e5e7eb"
                    }}
                  />
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
            <Search className={`absolute left-3 top-2.5 h-4 w-4 ${theme.name === "Vibrant" ? "text-white/60" : "text-slate-400"}`} />
            <input 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              placeholder="Search projects, owners…" 
              className={`w-full pl-9 pr-3 py-2 rounded-xl border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme.name === "Vibrant" 
                  ? "bg-white/10 text-white placeholder-white/60" 
                  : "bg-white text-slate-900 placeholder-slate-500"
              }`}
            />
          </div>
          <button className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border ${theme.colors.border} ${
            theme.name === "Vibrant" 
              ? "text-white hover:bg-white/10" 
              : "text-slate-700 hover:bg-slate-50"
          }`}>
            <Filter className="h-4 w-4"/>Filters
          </button>
          <button 
            onClick={() => setShowAddProject(true)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${theme.colors.accent} text-white hover:${theme.colors.accentHover} transition-colors`}
          >
            <Plus className="h-4 w-4"/>Add Project
          </button>
        </div>

        {/* Projects Table */}
        <div className={`mt-4 ${theme.colors.chart} rounded-2xl border ${theme.colors.border} overflow-hidden shadow`}>
          <div className={`px-4 py-3 border-b ${theme.name === "Vibrant" ? "border-white/20" : "border-slate-100"} flex items-center gap-2`}>
            <Users className={`h-4 w-4 ${theme.colors.textMuted}`}/>
            <div className={`font-semibold ${theme.colors.text}`}>Projects</div>
            <div className={`ml-auto text-xs ${theme.colors.textMuted}`}>Showing {filtered.length} of {projects.length}</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className={`${theme.name === "Vibrant" ? "bg-white/10" : "bg-slate-50"} ${theme.colors.textMuted}`}>
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
                  <tr key={p.name} className={`border-t ${theme.name === "Vibrant" ? "border-white/10" : "border-slate-100"} hover:bg-slate-50 transition-colors group`}>
                    <td className={`px-4 py-2 font-medium ${
                      theme.name === "Vibrant" 
                        ? "text-white group-hover:text-gray-200" 
                        : "group-hover:text-blue-600"
                    }`}>
                      {p.name}
                    </td>
                    <td className={`px-4 py-2 ${
                      theme.name === "Vibrant" 
                        ? "text-white group-hover:text-gray-200" 
                        : "group-hover:text-slate-700"
                    }`}>
                      {p.owner}
                    </td>
                    <td className={`px-4 py-2 ${
                      theme.name === "Vibrant" 
                        ? "text-white group-hover:text-gray-200" 
                        : "text-slate-600 group-hover:text-slate-800"
                    }`}>
                      {PIPELINE[p.progress - 1]}
                    </td>
                    <td className="px-4 py-2">
                      <div className="group relative">
                        <ProgressPills progress={p.progress} theme={theme} />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          {PIPELINE[p.progress - 1]}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="group relative">
                        <RiskBadge risk={p.risk} theme={theme} />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 max-w-xs">
                          {riskDescriptions[p.risk]}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <button 
                        onClick={() => navigate(`/project/${p.name}`)}
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

      {/* Chat Dock */}
      <div className="fixed bottom-6 right-6 w-full max-w-md">
        {!isChatExpanded ? (
          <button
            onClick={() => setIsChatExpanded(true)}
            className={`${theme.colors.accent} text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3`}
          >
            <div className="relative">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
            <span className="font-medium">Ask Falcon</span>
          </button>
        ) : (
          <div className={`${theme.colors.chart} rounded-2xl shadow-xl border ${theme.colors.border} overflow-hidden w-96 h-96 flex flex-col`}>
            {/* Chat Header */}
            <div className={`px-4 py-3 border-b ${theme.name === "Vibrant" ? "border-white/20" : "border-slate-100"} flex items-center justify-between`}>
              <div className={`font-semibold ${theme.colors.text}`}>Ask Falcon</div>
              <button
                onClick={() => setIsChatExpanded(false)}
                className={`p-1 rounded-lg hover:bg-white/10 ${theme.colors.textMuted}`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {messages.length === 0 && (
                <p className={`text-sm ${theme.colors.textMuted} text-center`}>
                  Ask about a project (e.g., "MISC") or say: "What stage is GEVIS?"
                </p>
              )}
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`px-3 py-2 rounded-2xl max-w-xs ${
                    m.role === "user" 
                      ? theme.colors.accent
                      : theme.name === "Vibrant"
                        ? "bg-white/20 text-white border border-white/30"
                        : "bg-slate-100 text-slate-900"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className={`p-3 border-t ${theme.name === "Vibrant" ? "border-white/20" : "border-slate-100"} flex items-center gap-2`}>
              <button 
                onClick={start} 
                className={`p-2 rounded-xl border ${theme.colors.border} hover:bg-slate-50 ${
                  theme.name === "Vibrant" 
                    ? "hover:bg-white/10 text-white" 
                    : "text-slate-600"
                }`} 
                title="Speak"
              >
                <Mic className="h-4 w-4"/>
              </button>
              <input 
                value={q} 
                onChange={(e) => setQ(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                placeholder="Type your question…" 
                className={`flex-1 px-3 py-2 rounded-xl border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme.name === "Vibrant" 
                    ? "bg-white/10 text-white placeholder-white/60" 
                    : "bg-white text-slate-900 placeholder-slate-500"
                }`}
              />
              <button 
                onClick={handleAsk} 
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl ${theme.colors.accent} text-white hover:bg-blue-700`}
              >
                <Send className="h-4 w-4"/> Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`${theme.colors.chart} rounded-2xl shadow-xl border ${theme.colors.border} w-full max-w-md overflow-hidden`}
          >
            {/* Modal Header */}
            <div className={`px-6 py-4 border-b ${theme.name === "Vibrant" ? "border-white/20" : "border-slate-100"} flex items-center justify-between`}>
              <h2 className={`text-lg font-semibold ${theme.colors.text}`}>Add New Project</h2>
              <button
                onClick={() => setShowAddProject(false)}
                className={`p-1 rounded-lg hover:bg-white/10 ${theme.colors.textMuted}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                  Project Name *
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  placeholder="Enter project name"
                  className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme.name === "Vibrant" 
                      ? "bg-white/10 text-white placeholder-white/60" 
                      : "bg-white text-slate-900 placeholder-slate-500"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                  Project Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  placeholder="Enter project description"
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme.name === "Vibrant" 
                      ? "bg-white/10 text-white placeholder-white/60" 
                      : "bg-white text-slate-900 placeholder-slate-500"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                  Project Owner *
                </label>
                <input
                  type="text"
                  value={newProject.owner}
                  onChange={(e) => setNewProject({...newProject, owner: e.target.value})}
                  placeholder="Enter project owner"
                  className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme.name === "Vibrant" 
                      ? "bg-white/10 text-white placeholder-white/60" 
                      : "bg-white text-slate-900 placeholder-slate-500"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                  Initial Risk Level
                </label>
                <select
                  value={newProject.risk}
                  onChange={(e) => setNewProject({...newProject, risk: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme.name === "Vibrant" 
                      ? "bg-white/10 text-white" 
                      : "bg-white text-slate-900"
                  }`}
                >
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>

              <div className={`p-3 rounded-lg ${theme.name === "Vibrant" ? "bg-white/10" : "bg-blue-50"} border ${theme.name === "Vibrant" ? "border-white/20" : "border-blue-200"}`}>
                <p className={`text-sm ${theme.name === "Vibrant" ? "text-white/80" : "text-blue-700"}`}>
                  <strong>Note:</strong> New projects will start at Stage 1 (Data Ingestion) in the pipeline.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`px-6 py-4 border-t ${theme.name === "Vibrant" ? "border-white/20" : "border-slate-100"} flex items-center justify-end gap-3`}>
              <button
                onClick={() => setShowAddProject(false)}
                className={`px-4 py-2 rounded-lg border ${theme.colors.border} ${
                  theme.name === "Vibrant" 
                    ? "text-white hover:bg-white/10" 
                    : "text-slate-700 hover:bg-slate-50"
                } transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newProject.name.trim() && newProject.owner.trim()) {
                    // Add the new project to the projects array
                    const projectToAdd = {
                      name: newProject.name.trim(),
                      owner: newProject.owner.trim(),
                      progress: 1, // Always start at stage 1
                      risk: newProject.risk,
                      description: newProject.description.trim()
                    };
                    
                    // In a real app, this would be an API call
                    setProjects(prevProjects => [...prevProjects, projectToAdd]);
                    
                    // Reset form and close modal
                    setNewProject({
                      name: "",
                      description: "",
                      owner: "",
                      risk: "low"
                    });
                    setShowAddProject(false);
                    
                    // Show success message
                    alert(`Project "${projectToAdd.name}" has been added successfully!`);
                  } else {
                    alert("Please fill in the required fields (Project Name and Owner).");
                  }
                }}
                className={`px-4 py-2 rounded-lg ${theme.colors.accent} text-white hover:${theme.colors.accentHover} transition-colors`}
              >
                Add Project
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Project Details Modal */}
      <ProjectDetails
        project={selectedProject}
        isOpen={isProjectDetailsOpen}
        onClose={() => {
          setIsProjectDetailsOpen(false);
          setSelectedProject(null);
        }}
        theme={theme}
      />

      {/* Notifications Overlay */}
      {showNotifications && (
        <NotificationsPage
          projectName="Global"
          isGlobal={true}
          onClose={() => setShowNotifications(false)}
          theme={theme}
        />
      )}
    </div>
  );
}
