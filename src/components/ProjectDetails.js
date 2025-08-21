import React, { useState } from 'react';
import { X, FileText, Code, Users, Clock, CheckCircle, AlertCircle, Play, Pause, MessageSquare, Upload, Download, Eye, Edit, Calendar } from 'lucide-react';

const PROJECT_STAGES = {
  ingestion: {
    name: "Document & Code Ingestion",
    description: "Onboarding process with project owners to gather comprehensive documentation and codebase",
    duration: "2-4 weeks",
    icon: <Upload className="h-5 w-5" />,
    color: "from-blue-500 to-blue-600",
    status: "active"
  },
  comprehension: {
    name: "Comprehension Documentation",
    description: "Generate detailed code file analysis and understanding documents",
    duration: "1-2 weeks",
    icon: <FileText className="h-5 w-5" />,
    color: "from-green-500 to-green-600",
    status: "pending"
  },
  capability: {
    name: "Capability Documentation",
    description: "Create system interaction and functionality capability documents",
    duration: "1-2 weeks",
    icon: <Code className="h-5 w-5" />,
    color: "from-purple-500 to-purple-600",
    status: "pending"
  },
  application: {
    name: "Application Documentation",
    description: "Generate high-level application architecture and business logic documents",
    duration: "1-2 weeks",
    icon: <Eye className="h-5 w-5" />,
    color: "from-orange-500 to-orange-600",
    status: "pending"
  },
  evaluation: {
    name: "Document Evaluation",
    description: "Iterative evaluation rounds with quality assessment and SME review",
    duration: "1-2 weeks",
    icon: <CheckCircle className="h-5 w-5" />,
    color: "from-red-500 to-red-600",
    status: "pending"
  },
  sme_approval: {
    name: "SME Approval",
    description: "Subject Matter Expert review and approval of all generated documents",
    duration: "3-5 days",
    icon: <Users className="h-5 w-5" />,
    color: "from-indigo-500 to-indigo-600",
    status: "pending"
  },
  ttd_generation: {
    name: "TTD Generation",
    description: "Test-Driven Development framework generation for target language",
    duration: "1 week",
    icon: <Code className="h-5 w-5" />,
    color: "from-teal-500 to-teal-600",
    status: "pending"
  },
  code_conversion: {
    name: "Code Conversion",
    description: "AI-driven legacy code conversion to target language (Java)",
    duration: "2-3 weeks",
    icon: <Edit className="h-5 w-5" />,
    color: "from-pink-500 to-pink-600",
    status: "pending"
  },
  code_evaluation: {
    name: "Code Evaluation",
    description: "Quality assessment and testing of converted code",
    duration: "1-2 weeks",
    icon: <CheckCircle className="h-5 w-5" />,
    color: "from-yellow-500 to-yellow-600",
    status: "pending"
  },
  final_approval: {
    name: "Final SME Approval",
    description: "Final review and approval of converted codebase",
    duration: "3-5 days",
    icon: <Users className="h-5 w-5" />,
    color: "from-emerald-500 to-emerald-600",
    status: "pending"
  },
  completed: {
    name: "Project Completed",
    description: "Successfully delivered and deployed converted application",
    duration: "N/A",
    icon: <CheckCircle className="h-5 w-5" />,
    color: "from-gray-500 to-gray-600",
    status: "completed"
  }
};

const REQUIRED_DOCUMENTS = [
  {
    category: "Code & Technical",
    documents: [
      "Source code files (COBOL, JCL, etc.)",
      "Database schemas and scripts",
      "Configuration files",
      "Build and deployment scripts"
    ]
  },
  {
    category: "User Documentation",
    documents: [
      "User manuals and guides",
      "UI screenshots and mockups",
      "User workflows and processes",
      "Training materials"
    ]
  },
  {
    category: "Business & Requirements",
    documents: [
      "Business requirement documents (BRD)",
      "Functional specification documents",
      "Meeting recordings (MP3) discussing features",
      "Process flow diagrams",
      "Business rules and logic documentation"
    ]
  },
  {
    category: "System & Architecture",
    documents: [
      "System architecture diagrams",
      "Integration documentation",
      "API specifications",
      "Performance requirements",
      "Security requirements"
    ]
  }
];

const ONBOARDING_CONVERSATIONS = [
  {
    round: 1,
    date: "2024-01-15",
    participants: ["Project Owner", "Ford Falcon Team"],
    topics: ["Project overview", "Initial requirements gathering", "Documentation availability"],
    status: "completed"
  },
  {
    round: 2,
    date: "2024-01-22",
    participants: ["Technical SME", "Ford Falcon Team"],
    topics: ["Codebase structure", "Technical architecture", "Integration points"],
    status: "completed"
  },
  {
    round: 3,
    date: "2024-01-29",
    participants: ["Business Analyst", "Ford Falcon Team"],
    topics: ["Business processes", "User workflows", "Business rules"],
    status: "scheduled"
  },
  {
    round: 4,
    date: "2024-02-05",
    participants: ["End Users", "Ford Falcon Team"],
    topics: ["User experience", "Pain points", "Improvement suggestions"],
    status: "pending"
  }
];

export default function ProjectDetails({ project, isOpen, onClose, theme }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStage, setSelectedStage] = useState(null);

  if (!isOpen || !project) return null;

  const currentStage = PROJECT_STAGES[Object.keys(PROJECT_STAGES)[project.progress - 1]];
  const completedStages = project.progress - 1;
  const totalStages = Object.keys(PROJECT_STAGES).length;

  const getStageStatus = (stageIndex) => {
    if (stageIndex < project.progress) return 'completed';
    if (stageIndex === project.progress - 1) return 'active';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${theme.colors.chart} rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/20 flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${theme.colors.text}`}>{project.name}</h2>
            <p className={`text-sm ${theme.colors.textMuted}`}>{project.owner} • {currentStage?.name}</p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl hover:bg-white/10 text-white transition-colors duration-150`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 py-3 border-b border-white/20 flex gap-1">
          {['overview', 'timeline', 'onboarding', 'documents', 'conversations'].map((tab) => (
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
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className={`text-lg font-semibold ${theme.colors.text} mb-3`}>Project Overview</h3>
                  <p className={`${theme.colors.textSecondary} leading-relaxed`}>
                    {project.name} is a legacy system modernization project that involves converting 
                    existing COBOL/JCL codebase to modern Java architecture. The project focuses on 
                    maintaining business logic while improving performance, maintainability, and 
                    integration capabilities.
                  </p>
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${theme.colors.text} mb-3`}>Current Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`${theme.colors.textSecondary}`}>Progress</span>
                      <span className={`${theme.colors.text} font-semibold`}>{completedStages}/{totalStages} stages</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`${theme.colors.textSecondary}`}>Current Stage</span>
                      <span className={`${theme.colors.text} font-semibold`}>{currentStage?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`${theme.colors.textSecondary}`}>Risk Level</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.risk === 'low' ? 'bg-green-100 text-green-800' :
                        project.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {project.risk}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${theme.colors.text} mb-4`}>Project Timeline</h3>
              <div className="space-y-4">
                {Object.entries(PROJECT_STAGES).map(([key, stage], index) => {
                  const status = getStageStatus(index + 1);
                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        status === 'completed' ? 'border-green-500/30 bg-green-500/10' :
                        status === 'active' ? 'border-blue-500/50 bg-blue-500/10' :
                        'border-gray-300/30 bg-gray-500/10'
                      } ${selectedStage === key ? 'ring-2 ring-blue-500/50' : ''}`}
                      onClick={() => setSelectedStage(selectedStage === key ? null : key)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${stage.color} text-white`}>
                          {stage.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-semibold ${theme.colors.text}`}>{stage.name}</h4>
                            {status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {status === 'active' && <Play className="h-4 w-4 text-blue-500" />}
                          </div>
                          <p className={`text-sm ${theme.colors.textMuted} mt-1`}>{stage.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className={`text-xs ${theme.colors.textMuted} flex items-center gap-1`}>
                              <Clock className="h-3 w-3" />
                              {stage.duration}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              status === 'completed' ? 'bg-green-100 text-green-800' :
                              status === 'active' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'onboarding' && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${theme.colors.text} mb-4`}>Onboarding Process</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`font-semibold ${theme.colors.text} mb-3`}>Process Overview</h4>
                  <p className={`${theme.colors.textSecondary} leading-relaxed mb-4`}>
                    The onboarding process is designed to be thorough and collaborative, typically lasting 
                    2-4 weeks. We work closely with project owners and SMEs to gather comprehensive 
                    documentation and understand the existing system architecture.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className={`${theme.colors.textSecondary} text-sm`}>Initial project assessment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className={`${theme.colors.textSecondary} text-sm`}>Documentation gathering</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className={`${theme.colors.textSecondary} text-sm`}>Technical architecture review</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className={`${theme.colors.textSecondary} text-sm`}>Business process mapping</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className={`font-semibold ${theme.colors.text} mb-3`}>SME Collaboration</h4>
                  <p className={`${theme.colors.textSecondary} leading-relaxed mb-4`}>
                    We conduct multiple rounds of conversations with Subject Matter Experts to ensure 
                    complete understanding of the system's functionality, business rules, and user workflows.
                  </p>
                  <div className="space-y-2">
                    {ONBOARDING_CONVERSATIONS.map((conv) => (
                      <div key={conv.round} className={`p-3 rounded-lg border ${
                        conv.status === 'completed' ? 'border-green-500/30 bg-green-500/10' :
                        conv.status === 'scheduled' ? 'border-yellow-500/30 bg-yellow-500/10' :
                        'border-gray-300/30 bg-gray-500/10'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-medium ${theme.colors.text}`}>Round {conv.round}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            conv.status === 'completed' ? 'bg-green-100 text-green-800' :
                            conv.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {conv.status}
                          </span>
                        </div>
                        <p className={`text-sm ${theme.colors.textMuted}`}>{conv.date}</p>
                        <p className={`text-sm ${theme.colors.textSecondary} mt-1`}>
                          {conv.participants.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${theme.colors.text} mb-4`}>Required Documents</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {REQUIRED_DOCUMENTS.map((category) => (
                  <div key={category.category} className="space-y-3">
                    <h4 className={`font-semibold ${theme.colors.text} flex items-center gap-2`}>
                      <FileText className="h-4 w-4" />
                      {category.category}
                    </h4>
                    <div className="space-y-2">
                      {category.documents.map((doc, index) => (
                        <div key={index} className={`flex items-center gap-2 p-2 rounded-lg bg-white/5`}>
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className={`text-sm ${theme.colors.textSecondary}`}>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'conversations' && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${theme.colors.text} mb-4`}>SME Conversations</h3>
              <div className="space-y-4">
                {ONBOARDING_CONVERSATIONS.map((conv) => (
                  <div key={conv.round} className={`p-4 rounded-xl border ${
                    conv.status === 'completed' ? 'border-green-500/30 bg-green-500/10' :
                    conv.status === 'scheduled' ? 'border-yellow-500/30 bg-yellow-500/10' :
                    'border-gray-300/30 bg-gray-500/10'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          conv.status === 'completed' ? 'bg-green-500' :
                          conv.status === 'scheduled' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        } text-white`}>
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className={`font-semibold ${theme.colors.text}`}>Conversation Round {conv.round}</h4>
                          <p className={`text-sm ${theme.colors.textMuted}`}>{conv.date}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        conv.status === 'completed' ? 'bg-green-100 text-green-800' :
                        conv.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {conv.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className={`text-sm font-medium ${theme.colors.textSecondary}`}>Participants: </span>
                        <span className={`text-sm ${theme.colors.textMuted}`}>{conv.participants.join(', ')}</span>
                      </div>
                      <div>
                        <span className={`text-sm font-medium ${theme.colors.textSecondary}`}>Topics: </span>
                        <span className={`text-sm ${theme.colors.textMuted}`}>{conv.topics.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
