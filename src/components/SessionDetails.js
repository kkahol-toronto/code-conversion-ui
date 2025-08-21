import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, FileText, Code, Users, Clock, CheckCircle, Play, Upload, Eye, Edit, Calendar, Download, BarChart3, TrendingUp, Activity, Zap } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Cell, LineChart, Line } from "recharts";

// Mock data generator for session details
const generateSessionData = (session, projectName) => {
  const baseTime = new Date(session.startTime).getTime();
  const sessionDuration = new Date(session.endTime).getTime() - baseTime;
  
  // Generate hourly progress data
  const hourlyProgress = [];
  const totalHours = Math.max(1, Math.ceil(sessionDuration / (1000 * 60 * 60)));
  
  for (let i = 0; i <= totalHours; i++) {
    const timestamp = baseTime + (i * sessionDuration / totalHours);
    const date = new Date(timestamp);
    
    // Check if session spans multiple days
    const sessionStart = new Date(baseTime);
    const sessionEnd = new Date(baseTime + sessionDuration);
    const spansDays = sessionStart.toDateString() !== sessionEnd.toDateString();
    
    hourlyProgress.push({
      hour: spansDays 
        ? `${date.getMonth() + 1}/${date.getDate()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: date.toLocaleString(),
      progress: Math.min(100, (i / totalHours) * 100),
      locProcessed: Math.floor(Math.random() * 50000) + 10000,
      accuracy: 85 + Math.random() * 15,
      stage: i === 0 ? 1 : Math.min(11, i * 2 + 1)
    });
  }

  // Generate stage completion data
  const stageData = [
    { stage: "Data Ingestion", completed: true, duration: "2h 15m", accuracy: 98.5, artifacts: 3 },
    { stage: "Document Generation", completed: true, duration: "1h 45m", accuracy: 94.2, artifacts: 5 },
    { stage: "Document Evaluation", completed: true, duration: "1h 30m", accuracy: 91.8, artifacts: 4 },
    { stage: "SME Approval (Docs)", completed: true, duration: "45m", accuracy: 96.3, artifacts: 2 },
    { stage: "TTD Generation", completed: true, duration: "2h 0m", accuracy: 89.7, artifacts: 6 },
    { stage: "Code Conversion", completed: true, duration: "3h 15m", accuracy: 87.4, artifacts: 8 },
    { stage: "Code Evaluation", completed: true, duration: "1h 20m", accuracy: 92.1, artifacts: 3 },
    { stage: "SME Approval (Code)", completed: true, duration: "1h 0m", accuracy: 95.6, artifacts: 2 },
    { stage: "Sandbox Release", completed: false, duration: "N/A", accuracy: 0, artifacts: 0 },
    { stage: "Project Completed", completed: false, duration: "N/A", accuracy: 0, artifacts: 0 }
  ];

  // Generate quality metrics
  const qualityMetrics = [
    { metric: "Code Accuracy", score: 87.4, target: 90.0 },
    { metric: "Document Quality", score: 94.2, target: 90.0 },
    { metric: "Performance", score: 89.7, target: 85.0 },
    { metric: "Maintainability", score: 91.8, target: 88.0 },
    { metric: "Test Coverage", score: 96.3, target: 90.0 },
    { metric: "Integration", score: 92.1, target: 85.0 }
  ];

  // Generate artifacts data
  const artifacts = {
    inputDocuments: [
      { name: `${projectName}_Source_Code_v1.2.zip`, type: "codebase", size: "45.2 MB", status: "processed" },
      { name: `${projectName}_User_Manual.pdf`, type: "user_manual", size: "12.8 MB", status: "processed" },
      { name: `${projectName}_Requirements_Meeting.mp3`, type: "meeting_recording", size: "8.5 MB", status: "processed" },
      { name: `${projectName}_Business_Requirements.docx`, type: "other", size: "2.1 MB", status: "processed" }
    ],
    outputDocuments: [
      { name: `${projectName}_Comprehension_Analysis.pdf`, type: "comprehension", size: "15.3 MB", status: "generated" },
      { name: `${projectName}_Capability_Matrix.xlsx`, type: "capability", size: "3.2 MB", status: "generated" },
      { name: `${projectName}_Application_Overview.docx`, type: "application", size: "8.7 MB", status: "generated" },
      { name: `${projectName}_TTD_Framework.zip`, type: "ttd", size: "22.1 MB", status: "generated" },
      { name: `${projectName}_Java_Conversion.zip`, type: "converted_code", size: "67.8 MB", status: "generated" }
    ],
    evaluations: [
      { name: `${projectName}_Comprehension_Evaluation.pdf`, score: 94.2, status: "approved" },
      { name: `${projectName}_Capability_Evaluation.pdf`, score: 91.8, status: "approved" },
      { name: `${projectName}_Application_Evaluation.pdf`, score: 96.3, status: "approved" },
      { name: `${projectName}_Code_Evaluation.pdf`, score: 87.4, status: "approved" }
    ]
  };

  return {
    hourlyProgress,
    stageData,
    qualityMetrics,
    artifacts,
    summary: {
      totalLocProcessed: hourlyProgress.reduce((sum, h) => sum + h.locProcessed, 0),
      averageAccuracy: hourlyProgress.reduce((sum, h) => sum + h.accuracy, 0) / hourlyProgress.length,
      totalArtifacts: artifacts.outputDocuments.length + artifacts.evaluations.length,
      completionRate: (stageData.filter(s => s.completed).length / stageData.length) * 100
    }
  };
};

export default function SessionDetails({ session, project, isOpen, onClose, theme }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!isOpen || !session) return null;

  const sessionData = generateSessionData(session, project.name);

  const getStageStatusColor = (completed) => {
    return completed 
      ? (theme.name === "Vibrant" ? "text-green-300" : "text-green-600")
      : (theme.name === "Vibrant" ? "text-gray-400" : "text-gray-500");
  };

  const getStageStatusBg = (completed) => {
    return completed 
      ? (theme.name === "Vibrant" ? "bg-green-600/20" : "bg-green-50")
      : (theme.name === "Vibrant" ? "bg-gray-600/20" : "bg-gray-50");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`${theme.colors.card} rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden border ${theme.colors.border}`}
      >
        {/* Header */}
        <div className={`p-6 border-b ${theme.colors.border}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${theme.colors.text}`}>Session Details</h2>
                <p className={`text-sm ${theme.colors.textMuted}`}>
                  {project.name} • Session {session.id.slice(-8)} • {new Date(session.startTime).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className={`p-2 rounded-xl hover:bg-gray-100 transition-colors ${theme.colors.text}`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-3 border-b border-white/20 flex gap-1">
          {['overview', 'progress', 'artifacts', 'quality'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                activeTab === tab
                  ? `${theme.colors.accent} text-white`
                  : `${theme.colors.textMuted} hover:${theme.colors.textSecondary}`
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
                             {/* Session Summary Cards */}
               <div className="grid md:grid-cols-4 gap-4">
                 <div className={`p-4 rounded-xl border ${theme.colors.border} ${theme.name === "Vibrant" ? "bg-white/10" : "bg-gray-50"}`}>
                   <div className="flex items-center gap-3">
                     <div className="p-2 rounded-lg bg-indigo-500 text-white">
                       <Clock className="h-4 w-4" />
                     </div>
                     <div>
                       <div className={`text-2xl font-bold ${theme.colors.text}`}>
                         {new Date(session.endTime).getTime() - new Date(session.startTime).getTime() > 0 
                           ? Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60 * 60))
                           : 4
                         }h
                       </div>
                       <div className={`text-sm ${theme.colors.textMuted}`}>Session Duration</div>
                     </div>
                   </div>
                 </div>
                <div className={`p-4 rounded-xl border ${theme.colors.border} ${theme.name === "Vibrant" ? "bg-white/10" : "bg-gray-50"}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500 text-white">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${theme.colors.text}`}>
                        {sessionData.summary.totalLocProcessed.toLocaleString()}
                      </div>
                      <div className={`text-sm ${theme.colors.textMuted}`}>LoC Processed</div>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${theme.colors.border} ${theme.name === "Vibrant" ? "bg-white/10" : "bg-gray-50"}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500 text-white">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${theme.colors.text}`}>
                        {sessionData.summary.averageAccuracy.toFixed(1)}%
                      </div>
                      <div className={`text-sm ${theme.colors.textMuted}`}>Avg Accuracy</div>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${theme.colors.border} ${theme.name === "Vibrant" ? "bg-white/10" : "bg-gray-50"}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500 text-white">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${theme.colors.text}`}>
                        {sessionData.summary.totalArtifacts}
                      </div>
                      <div className={`text-sm ${theme.colors.textMuted}`}>Artifacts Generated</div>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${theme.colors.border} ${theme.name === "Vibrant" ? "bg-white/10" : "bg-gray-50"}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500 text-white">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${theme.colors.text}`}>
                        {sessionData.summary.completionRate.toFixed(0)}%
                      </div>
                      <div className={`text-sm ${theme.colors.textMuted}`}>Completion Rate</div>
                    </div>
                  </div>
                </div>
              </div>

                             {/* Progress Timeline */}
               <div>
                 <div className="flex items-center justify-between mb-4">
                   <h3 className={`text-lg font-semibold ${theme.colors.text}`}>Session Timeline</h3>
                   <div className={`text-sm ${theme.colors.textMuted}`}>
                     {new Date(session.startTime).toLocaleString()} - {new Date(session.endTime).toLocaleString()}
                   </div>
                 </div>
                 <div className="h-64">
                   <ResponsiveContainer>
                     <AreaChart data={sessionData.hourlyProgress}>
                       <defs>
                         <linearGradient id="progress" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                         </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke={theme.name === "Vibrant" ? "#ffffff40" : "#e5e7eb"} />
                                               <XAxis 
                          dataKey="hour" 
                          tick={{ fill: theme.name === "Vibrant" ? "#ffffff" : "#6b7280", fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          interval={0}
                        />
                       <YAxis tick={{ fill: theme.name === "Vibrant" ? "#ffffff" : "#6b7280" }} />
                       <Tooltip 
                         contentStyle={{
                           backgroundColor: theme.name === "Vibrant" ? "#1e3a8a" : "#ffffff",
                           color: theme.name === "Vibrant" ? "#ffffff" : "#000000",
                           border: theme.name === "Vibrant" ? "1px solid #3b82f6" : "1px solid #e5e7eb"
                         }}
                         formatter={(value, name) => {
                           if (name === 'progress') {
                             return [`${value.toFixed(1)}%`, 'Progress'];
                           }
                           return [value, name];
                         }}
                         labelFormatter={(label) => {
                           const dataPoint = sessionData.hourlyProgress.find(item => item.hour === label);
                           return dataPoint ? dataPoint.timestamp : label;
                         }}
                       />
                       <Area type="monotone" dataKey="progress" stroke="#3b82f6" fill="url(#progress)" />
                     </AreaChart>
                   </ResponsiveContainer>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${theme.colors.text} mb-4`}>Stage Progress</h3>
              
              {/* Stage Progress Chart */}
              <div className="h-64 mb-6">
                <ResponsiveContainer>
                  <BarChart data={sessionData.stageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.name === "Vibrant" ? "#ffffff40" : "#e5e7eb"} />
                    <XAxis dataKey="stage" hide />
                    <YAxis tick={{ fill: theme.name === "Vibrant" ? "#ffffff" : "#6b7280" }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: theme.name === "Vibrant" ? "#1e3a8a" : "#ffffff",
                        color: theme.name === "Vibrant" ? "#ffffff" : "#000000",
                        border: theme.name === "Vibrant" ? "1px solid #3b82f6" : "1px solid #e5e7eb"
                      }}
                    />
                    <Bar dataKey="accuracy">
                      {sessionData.stageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.completed ? "#10b981" : "#6b7280"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Stage Details */}
              <div className="grid gap-4">
                {sessionData.stageData.map((stage, index) => (
                  <div key={index} className={`p-4 rounded-xl border ${theme.colors.border} ${getStageStatusBg(stage.completed)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          stage.completed 
                            ? (theme.name === "Vibrant" ? "bg-green-600 text-white" : "bg-green-600 text-white")
                            : (theme.name === "Vibrant" ? "bg-gray-600 text-white" : "bg-gray-600 text-white")
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className={`font-semibold ${getStageStatusColor(stage.completed)}`}>{stage.stage}</h4>
                          <p className={`text-sm ${theme.colors.textMuted}`}>
                            Duration: {stage.duration} • Accuracy: {stage.accuracy}% • Artifacts: {stage.artifacts}
                          </p>
                        </div>
                      </div>
                      {stage.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'artifacts' && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${theme.colors.text} mb-4`}>Generated Artifacts</h3>
              
              {/* Input Documents */}
              <div>
                <h4 className={`font-semibold ${theme.colors.text} mb-3 flex items-center gap-2`}>
                  <Upload className="h-4 w-4" />
                  Input Documents
                </h4>
                <div className="grid gap-3 mb-6">
                  {sessionData.artifacts.inputDocuments.map((doc, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${theme.colors.border} ${theme.name === "Vibrant" ? "bg-white/10" : "bg-gray-50"}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            doc.type === "codebase" ? (theme.name === "Vibrant" ? "bg-blue-600/30 text-blue-300" : "bg-blue-100 text-blue-800") :
                            doc.type === "user_manual" ? (theme.name === "Vibrant" ? "bg-green-600/30 text-green-300" : "bg-green-100 text-green-800") :
                            doc.type === "meeting_recording" ? (theme.name === "Vibrant" ? "bg-purple-600/30 text-purple-300" : "bg-purple-100 text-purple-800") :
                            (theme.name === "Vibrant" ? "bg-gray-600/30 text-gray-300" : "bg-gray-100 text-gray-800")
                          }`}>
                            {doc.type.replace('_', ' ').toUpperCase()}
                          </span>
                          <div>
                            <h5 className={`font-medium ${theme.colors.text}`}>{doc.name}</h5>
                            <p className={`text-xs ${theme.colors.textMuted}`}>Size: {doc.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            theme.name === "Vibrant" ? "bg-green-600/30 text-green-300" : "bg-green-100 text-green-800"
                          }`}>
                            {doc.status}
                          </span>
                          <button className={`p-2 rounded-lg ${theme.name === "Vibrant" ? "bg-white/20 hover:bg-white/30" : "bg-gray-100 hover:bg-gray-200"} transition-colors`}>
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Output Documents */}
              <div>
                <h4 className={`font-semibold ${theme.colors.text} mb-3 flex items-center gap-2`}>
                  <FileText className="h-4 w-4" />
                  Output Documents
                </h4>
                <div className="grid gap-3 mb-6">
                  {sessionData.artifacts.outputDocuments.map((doc, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${theme.colors.border} ${theme.name === "Vibrant" ? "bg-white/10" : "bg-gray-50"}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            doc.type === "comprehension" ? (theme.name === "Vibrant" ? "bg-blue-600/30 text-blue-300" : "bg-blue-100 text-blue-800") :
                            doc.type === "capability" ? (theme.name === "Vibrant" ? "bg-green-600/30 text-green-300" : "bg-green-100 text-green-800") :
                            doc.type === "application" ? (theme.name === "Vibrant" ? "bg-purple-600/30 text-purple-300" : "bg-purple-100 text-purple-800") :
                            doc.type === "ttd" ? (theme.name === "Vibrant" ? "bg-orange-600/30 text-orange-300" : "bg-orange-100 text-orange-800") :
                            (theme.name === "Vibrant" ? "bg-yellow-600/30 text-yellow-300" : "bg-yellow-100 text-yellow-800")
                          }`}>
                            {doc.type.replace('_', ' ').toUpperCase()}
                          </span>
                          <div>
                            <h5 className={`font-medium ${theme.colors.text}`}>{doc.name}</h5>
                            <p className={`text-xs ${theme.colors.textMuted}`}>Size: {doc.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            theme.name === "Vibrant" ? "bg-blue-600/30 text-blue-300" : "bg-blue-100 text-blue-800"
                          }`}>
                            {doc.status}
                          </span>
                          <button className={`p-2 rounded-lg ${theme.name === "Vibrant" ? "bg-white/20 hover:bg-white/30" : "bg-gray-100 hover:bg-gray-200"} transition-colors`}>
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evaluations */}
              <div>
                <h4 className={`font-semibold ${theme.colors.text} mb-3 flex items-center gap-2`}>
                  <CheckCircle className="h-4 w-4" />
                  Evaluations
                </h4>
                <div className="grid gap-3">
                  {sessionData.artifacts.evaluations.map((evaluation, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${theme.colors.border} ${theme.name === "Vibrant" ? "bg-white/10" : "bg-gray-50"}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                                                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                             evaluation.score >= 90 ? (theme.name === "Vibrant" ? "bg-green-600 text-white" : "bg-green-600 text-white") :
                             evaluation.score >= 80 ? (theme.name === "Vibrant" ? "bg-yellow-600 text-white" : "bg-yellow-600 text-white") :
                             (theme.name === "Vibrant" ? "bg-red-600 text-white" : "bg-red-600 text-white")
                           }`}>
                             {evaluation.score}
                          </div>
                                                     <div>
                             <h5 className={`font-medium ${theme.colors.text}`}>{evaluation.name}</h5>
                             <p className={`text-xs ${theme.colors.textMuted}`}>Score: {evaluation.score}/100</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                                                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                             theme.name === "Vibrant" ? "bg-green-600/30 text-green-300" : "bg-green-100 text-green-800"
                           }`}>
                             {evaluation.status}
                           </span>
                          <button className={`p-2 rounded-lg ${theme.name === "Vibrant" ? "bg-white/20 hover:bg-white/30" : "bg-gray-100 hover:bg-gray-200"} transition-colors`}>
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quality' && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${theme.colors.text} mb-4`}>Quality Metrics</h3>
              
              {/* Quality Radar Chart */}
              <div className="h-64 mb-6">
                <ResponsiveContainer>
                  <RadarChart data={sessionData.qualityMetrics}>
                    <PolarGrid stroke={theme.name === "Vibrant" ? "#ffffff40" : "#e5e7eb"} />
                    <PolarAngleAxis 
                      dataKey="metric" 
                      tick={{ fill: theme.name === "Vibrant" ? "#ffffff" : "#6b7280", fontSize: 10 }}
                    />
                    <Radar name="Current" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.35} />
                    <Radar name="Target" dataKey="target" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} />
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

              {/* Quality Metrics Table */}
              <div className={`rounded-xl border ${theme.colors.border} overflow-hidden`}>
                <div className={`px-4 py-3 border-b ${theme.name === "Vibrant" ? "border-white/20" : "border-slate-100"} ${theme.colors.textMuted}`}>
                  <h4 className="font-semibold">Detailed Quality Metrics</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className={`${theme.name === "Vibrant" ? 'bg-white/10' : 'bg-slate-50'} ${theme.colors.textMuted}`}>
                      <tr>
                        <th className="text-left px-4 py-2">Metric</th>
                        <th className="text-left px-4 py-2">Current Score</th>
                        <th className="text-left px-4 py-2">Target</th>
                        <th className="text-left px-4 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessionData.qualityMetrics.map((metric, index) => (
                        <tr key={index} className={`border-t ${theme.name === "Vibrant" ? 'border-white/10' : 'border-slate-100'}`}>
                          <td className={`px-4 py-2 font-medium ${theme.colors.text}`}>{metric.metric}</td>
                          <td className={`px-4 py-2 ${theme.colors.text}`}>{metric.score}</td>
                          <td className={`px-4 py-2 ${theme.colors.textMuted}`}>{metric.target}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              metric.score >= metric.target ? 
                                (theme.name === "Vibrant" ? 'bg-green-600/30 text-green-300' : 'bg-green-100 text-green-800') :
                                (theme.name === "Vibrant" ? 'bg-yellow-600/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800')
                            }`}>
                              {metric.score >= metric.target ? 'Pass' : 'Below Target'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
