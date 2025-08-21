import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Code, Users, Clock, CheckCircle, Play, Upload, Eye, Edit, Palette, Sun, Eye as EyeIcon, Mic, Send, ChevronRight, Zap, Bell, Play as AutoPlay, Hand } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line, ReferenceLine } from "recharts";
import ConfirmationPage from '../components/ConfirmationPage';
import SessionDetails from '../components/SessionDetails';
import NotificationsPage from '../components/NotificationsPage';
import DocumentChat from '../components/DocumentChat';
import { useTheme } from '../context/ThemeContext';

// Theme selector component
function ThemeSelector({ currentTheme, onThemeChange }) {
  const { themes } = useTheme();
  
  return (
    <div className="flex items-center gap-2">
      {Object.entries(themes).map(([key, themeConfig]) => (
        <button
          key={key}
          onClick={() => onThemeChange(key)}
          className={`p-2 rounded-xl transition-all duration-200 ${
            currentTheme === key
              ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
              : "hover:bg-slate-100 text-slate-600"
          }`}
          title={themeConfig.name}
        >
          <span className="text-lg">{themeConfig.icon}</span>
        </button>
      ))}
    </div>
  );
}

// Mock data - in real app this would come from API
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
];

// Sample session history data for all projects
const SAMPLE_SESSION_HISTORY = {
  MISC: [
    {
      id: "misc_001",
      startTime: "2024-01-15T09:30:00Z",
      endTime: "2024-01-15T16:45:00Z",
      finalStage: 7,
      status: 'incomplete',
      totalStages: 11,
      artifacts: {
        inputDocs: ["COBOL_Source_Files.zip", "Business_Requirements.pdf", "User_Manual.pdf"],
        outputDocs: ["Comprehension_Analysis.pdf", "Capability_Matrix.xlsx", "Application_Overview.docx"],
        codeArtifacts: ["Java_Conversion_Phase1.zip", "Test_Results.pdf"]
      }
    },
    {
      id: "misc_002", 
      startTime: "2024-01-10T14:20:00Z",
      endTime: "2024-01-10T18:30:00Z",
      finalStage: 4,
      status: 'incomplete',
      totalStages: 11,
      artifacts: {
        inputDocs: ["Legacy_Code_Base.zip", "System_Architecture.pdf"],
        outputDocs: ["Document_Analysis_Report.pdf"],
        codeArtifacts: []
      }
    }
  ],
  GEVIS: [
    {
      id: "gevis_001",
      startTime: "2024-01-12T11:15:00Z", 
      endTime: "2024-01-12T15:20:00Z",
      finalStage: 4,
      status: 'incomplete',
      totalStages: 11,
      artifacts: {
        inputDocs: ["GEVIS_Codebase.zip", "Technical_Specs.pdf", "Database_Schema.pdf"],
        outputDocs: ["GEVIS_Comprehension_Report.pdf", "Capability_Analysis.xlsx"],
        codeArtifacts: ["GEVIS_Phase1_Output.zip"]
      }
    }
  ],
  GEMSL: [
    {
      id: "gemsl_001",
      startTime: "2024-01-08T10:00:00Z",
      endTime: "2024-01-08T14:30:00Z", 
      finalStage: 6,
      status: 'incomplete',
      totalStages: 11,
      artifacts: {
        inputDocs: ["GEMSL_Source.zip", "Requirements_Doc.pdf"],
        outputDocs: ["GEMSL_Analysis.pdf", "Conversion_Plan.docx"],
        codeArtifacts: ["GEMSL_Java_Output.zip"]
      }
    }
  ],
  AC625100: [
    {
      id: "ac625100_001",
      startTime: "2024-01-05T13:45:00Z",
      endTime: "2024-01-05T17:20:00Z",
      finalStage: 10,
      status: 'completed',
      totalStages: 11,
      artifacts: {
        inputDocs: ["AC625100_Complete_Code.zip", "Business_Logic.pdf"],
        outputDocs: ["Final_Conversion_Report.pdf", "Testing_Results.pdf"],
        codeArtifacts: ["AC625100_Final_Java.zip", "Test_Suite.zip"]
      }
    }
  ]
};

// Project-specific data
const PROJECT_DATA = {
  MISC: {
    weeklyLoC: [
      { week: "W-7", loc: 45_230, cumulative: 45_230 },
      { week: "W-6", loc: 67_890, cumulative: 113_120 },
      { week: "W-5", loc: 89_450, cumulative: 202_570 },
      { week: "W-4", loc: 76_320, cumulative: 278_890 },
      { week: "W-3", loc: 98_760, cumulative: 377_650 },
      { week: "W-2", loc: 112_450, cumulative: 490_100 },
      { week: "W-1", loc: 134_890, cumulative: 624_990 },
    ],
    totalLoC: 624_990,
    evalScores: [
      { metric: "Document Comprehension", score: 4.6, target: 4.5 },
      { metric: "Capability Extraction", score: 4.3, target: 4.5 },
      { metric: "Application Accuracy", score: 4.4, target: 4.5 },
      { metric: "COBOL Tech Design", score: 4.2, target: 4.5 },
      { metric: "Code Quality", score: 4.5, target: 4.5 },
      { metric: "Performance", score: 4.1, target: 4.5 },
    ],
    documentEvalScores: [
      { metric: "Comprehension Docs", score: 4.7, target: 4.5 },
      { metric: "Capability Docs", score: 4.4, target: 4.5 },
      { metric: "Application Docs", score: 4.6, target: 4.5 },
      { metric: "SME Approval", score: 4.8, target: 4.5 },
    ],
    iterativeImprovement: {
      documentGeneration: [
        { iteration: 1, score: 2.5, threshold: 4.5, status: 'below_threshold' },
        { iteration: 2, score: 3.2, threshold: 4.5, status: 'below_threshold' },
        { iteration: 3, score: 3.8, threshold: 4.5, status: 'below_threshold' },
        { iteration: 4, score: 4.3, threshold: 4.5, status: 'below_threshold' },
        { iteration: 5, score: 4.6, threshold: 4.5, status: 'threshold_reached' },
        { iteration: 6, score: 4.7, threshold: 4.5, status: 'converged' }
      ],
      codeConversion: [
        { iteration: 1, score: 2.71, threshold: 4.5, status: 'below_threshold' },
        { iteration: 2, score: 3.16, threshold: 4.5, status: 'below_threshold' },
        { iteration: 3, score: 3.73, threshold: 4.5, status: 'below_threshold' },
        { iteration: 4, score: 4.1, threshold: 4.5, status: 'below_threshold' },
        { iteration: 5, score: 4.5, threshold: 4.5, status: 'threshold_reached' },
        { iteration: 6, score: 4.8, threshold: 4.5, status: 'converged' }
      ]
    }
  },
  GEVIS: {
    weeklyLoC: [
      { week: "W-7", loc: 23_450, cumulative: 23_450 },
      { week: "W-6", loc: 34_670, cumulative: 58_120 },
      { week: "W-5", loc: 45_890, cumulative: 104_010 },
      { week: "W-4", loc: 38_760, cumulative: 142_770 },
    ],
    totalLoC: 142_770,
    evalScores: [
      { metric: "Document Comprehension", score: 4.2, target: 4.5 },
      { metric: "Capability Extraction", score: 4.0, target: 4.5 },
      { metric: "Application Accuracy", score: 4.1, target: 4.5 },
      { metric: "COBOL Tech Design", score: 3.9, target: 4.5 },
      { metric: "Code Quality", score: 4.3, target: 4.5 },
      { metric: "Performance", score: 4.0, target: 4.5 },
    ],
    documentEvalScores: [
      { metric: "Comprehension Docs", score: 4.3, target: 4.5 },
      { metric: "Capability Docs", score: 4.1, target: 4.5 },
      { metric: "Application Docs", score: 4.2, target: 4.5 },
      { metric: "SME Approval", score: 4.0, target: 4.5 },
    ],
    iterativeImprovement: {
      documentGeneration: [
        { iteration: 1, score: 2.8, threshold: 4.5, status: 'below_threshold' },
        { iteration: 2, score: 3.4, threshold: 4.5, status: 'below_threshold' },
        { iteration: 3, score: 3.9, threshold: 4.5, status: 'below_threshold' },
        { iteration: 4, score: 4.2, threshold: 4.5, status: 'below_threshold' },
        { iteration: 5, score: 4.3, threshold: 4.5, status: 'below_threshold' },
        { iteration: 6, score: 4.5, threshold: 4.5, status: 'threshold_reached' }
      ],
      codeConversion: [
        { iteration: 1, score: 2.6, threshold: 4.5, status: 'below_threshold' },
        { iteration: 2, score: 3.1, threshold: 4.5, status: 'below_threshold' },
        { iteration: 3, score: 3.7, threshold: 4.5, status: 'below_threshold' },
        { iteration: 4, score: 4.0, threshold: 4.5, status: 'below_threshold' },
        { iteration: 5, score: 4.3, threshold: 4.5, status: 'below_threshold' },
        { iteration: 6, score: 4.6, threshold: 4.5, status: 'threshold_reached' }
      ]
    }
  }
};

// Voice Chat Helper
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

const PROJECT_STAGES = {
  ingestion: {
    name: "Document & Code Ingestion",
    description: "Onboarding process with project owners to gather comprehensive documentation and codebase",
    detailedDescription: "This stage involves intensive collaboration with project owners and SMEs to collect all necessary documentation. We conduct multiple rounds of conversations to understand the existing system architecture, business processes, and technical requirements. The process typically lasts 2-4 weeks and includes gathering source code files, user manuals, business requirement documents, meeting recordings, and system architecture diagrams.",
    duration: "2-4 weeks",
    icon: <Upload className="h-6 w-6" />,
    color: "from-blue-500 to-blue-600",
    status: "active",
    deliverables: [
      "Comprehensive documentation inventory",
      "Codebase structure analysis",
      "Business process mapping",
      "SME interview transcripts"
    ],
    team: ["Project Manager", "Technical Lead", "Business Analyst"],
    tools: ["Document Management System", "Code Repository", "Meeting Recording Tools"]
  },
  comprehension: {
    name: "Comprehension Documentation",
    description: "Generate detailed code file analysis and understanding documents",
    detailedDescription: "Using our RAG (Retrieval Augmented Generation) system, we analyze each code file to create comprehensive comprehension documents. These documents explain the purpose, logic, and functionality of individual code components. We generate detailed analysis for COBOL programs, JCL scripts, and database schemas, creating a foundation for understanding the legacy system.",
    duration: "1-2 weeks",
    icon: <FileText className="h-6 w-6" />,
    color: "from-green-500 to-green-600",
    status: "pending",
    deliverables: [
      "Code file comprehension reports",
      "Function analysis documents",
      "Data flow diagrams",
      "Code complexity assessments"
    ],
    team: ["AI Engineers", "Technical Writers", "Code Analysts"],
    tools: ["RAG System", "Code Analysis Tools", "Documentation Platform"]
  },
  capability: {
    name: "Capability Documentation",
    description: "Create system interaction and functionality capability documents",
    detailedDescription: "This stage focuses on understanding how different code files interact to provide specific business capabilities. We create documents that map system interactions, data flows between components, and the overall functionality provided by the application. This includes understanding business rules, validation logic, and integration points.",
    duration: "1-2 weeks",
    icon: <Code className="h-6 w-6" />,
    color: "from-purple-500 to-purple-600",
    status: "pending",
    deliverables: [
      "System interaction diagrams",
      "Capability mapping documents",
      "Business rule documentation",
      "Integration point analysis"
    ],
    team: ["System Architects", "Business Analysts", "Integration Specialists"],
    tools: ["Architecture Modeling Tools", "Business Process Tools", "Integration Platforms"]
  },
  application: {
    name: "Application Documentation",
    description: "Generate high-level application architecture and business logic documents",
    detailedDescription: "At the application level, we create comprehensive documentation that covers the entire system architecture, business logic, and user workflows. This includes understanding the overall application purpose, user interfaces, data models, and business processes. We document how the application serves its business purpose and what value it provides to end users.",
    duration: "1-2 weeks",
    icon: <Eye className="h-6 w-6" />,
    color: "from-orange-500 to-orange-600",
    status: "pending",
    deliverables: [
      "Application architecture overview",
      "Business logic documentation",
      "User workflow diagrams",
      "System requirements specification"
    ],
    team: ["Enterprise Architects", "Business Process Engineers", "UX Analysts"],
    tools: ["Enterprise Architecture Tools", "Process Modeling Software", "Requirements Management"]
  },
  evaluation: {
    name: "Document Evaluation",
    description: "Iterative evaluation rounds with quality assessment and SME review",
    detailedDescription: "All generated documents undergo rigorous evaluation using our proprietary assessment framework. We evaluate documents for accuracy, completeness, clarity, and alignment with business requirements. This stage includes multiple rounds of review with SMEs to ensure quality and correctness. Documents that don't meet standards are revised and re-evaluated.",
    duration: "1-2 weeks",
    icon: <CheckCircle className="h-6 w-6" />,
    color: "from-red-500 to-red-600",
    status: "pending",
    deliverables: [
      "Quality assessment reports",
      "SME review feedback",
      "Document revision tracking",
      "Approval documentation"
    ],
    team: ["Quality Assurance", "Subject Matter Experts", "Review Coordinators"],
    tools: ["Quality Management System", "Review Platforms", "Feedback Tracking Tools"]
  },
  sme_approval: {
    name: "SME Approval",
    description: "Subject Matter Expert review and approval of all generated documents",
    detailedDescription: "Subject Matter Experts conduct final review and approval of all generated documents. This includes technical SMEs for code-related documents, business SMEs for process documents, and domain experts for application-level documentation. SMEs validate accuracy, completeness, and alignment with business requirements before providing formal approval.",
    duration: "3-5 days",
    icon: <Users className="h-6 w-6" />,
    color: "from-indigo-500 to-indigo-600",
    status: "pending",
    deliverables: [
      "SME approval certificates",
      "Review feedback documentation",
      "Approval tracking reports",
      "Final document versions"
    ],
    team: ["Subject Matter Experts", "Project Stakeholders", "Approval Coordinators"],
    tools: ["Approval Workflow System", "Document Management", "Communication Platforms"]
  },
  ttd_generation: {
    name: "TTD Generation",
    description: "Test-Driven Development framework generation for target language",
    detailedDescription: "Based on the approved documentation, we generate comprehensive Test-Driven Development frameworks for the target Java environment. This includes unit test frameworks, integration test suites, and automated testing pipelines. The TTD framework ensures that the converted code maintains the same functionality and behavior as the original legacy system.",
    duration: "1 week",
    icon: <Code className="h-6 w-6" />,
    color: "from-teal-500 to-teal-600",
    status: "pending",
    deliverables: [
      "Unit test frameworks",
      "Integration test suites",
      "Automated testing pipelines",
      "Test data sets"
    ],
    team: ["Test Engineers", "Java Developers", "Automation Specialists"],
    tools: ["JUnit", "TestNG", "CI/CD Platforms", "Test Data Management"]
  },
  code_conversion: {
    name: "Code Conversion",
    description: "AI-driven legacy code conversion to target language (Java)",
    detailedDescription: "Using advanced AI models and the comprehensive documentation generated in previous stages, we convert the legacy COBOL/JCL code to modern Java. The conversion process maintains business logic, data integrity, and system behavior while modernizing the architecture. The AI system uses the approved documentation to ensure accurate conversion.",
    duration: "2-3 weeks",
    icon: <Edit className="h-6 w-6" />,
    color: "from-pink-500 to-pink-600",
    status: "pending",
    deliverables: [
      "Converted Java codebase",
      "Migration documentation",
      "Code comparison reports",
      "Performance benchmarks"
    ],
    team: ["AI Engineers", "Java Developers", "Migration Specialists"],
    tools: ["AI Code Conversion Platform", "Java Development Tools", "Code Analysis Tools"]
  },
  code_evaluation: {
    name: "Code Evaluation",
    description: "Quality assessment and testing of converted code",
    detailedDescription: "The converted Java code undergoes comprehensive evaluation and testing. This includes automated testing using the TTD framework, manual code review, performance testing, and integration testing. We verify that the converted code maintains the same functionality, performance characteristics, and business logic as the original system.",
    duration: "1-2 weeks",
    icon: <CheckCircle className="h-6 w-6" />,
    color: "from-yellow-500 to-yellow-600",
    status: "pending",
    deliverables: [
      "Test execution reports",
      "Code quality assessments",
      "Performance test results",
      "Integration test reports"
    ],
    team: ["QA Engineers", "Performance Testers", "Code Reviewers"],
    tools: ["Testing Frameworks", "Performance Monitoring", "Code Quality Tools"]
  },
  final_approval: {
    name: "Final SME Approval",
    description: "Final review and approval of converted codebase",
    detailedDescription: "Subject Matter Experts conduct final review and approval of the converted codebase. This includes validation of functionality, performance, and alignment with business requirements. SMEs verify that the converted system meets all specified requirements and is ready for deployment. Final approval is required before the project can be marked as completed.",
    duration: "3-5 days",
    icon: <Users className="h-6 w-6" />,
    color: "from-emerald-500 to-emerald-600",
    status: "pending",
    deliverables: [
      "Final approval certificates",
      "Deployment readiness reports",
      "Go-live authorization",
      "Project completion documentation"
    ],
    team: ["Subject Matter Experts", "Project Stakeholders", "Deployment Team"],
    tools: ["Approval Workflows", "Deployment Platforms", "Documentation Systems"]
  },
  completed: {
    name: "Project Completed",
    description: "Successfully delivered and deployed converted application",
    detailedDescription: "The project is successfully completed with the converted Java application deployed and operational. All deliverables have been provided, documentation is complete, and the system is running in production. The legacy system has been successfully modernized while maintaining all business functionality and improving performance and maintainability.",
    duration: "N/A",
    icon: <CheckCircle className="h-6 w-6" />,
    color: "from-gray-500 to-gray-600",
    status: "completed",
    deliverables: [
      "Deployed Java application",
      "Complete project documentation",
      "Training materials",
      "Support handover documentation"
    ],
    team: ["Deployment Team", "Support Engineers", "Training Specialists"],
    tools: ["Deployment Platforms", "Monitoring Tools", "Support Systems"]
  }
};



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

export default function ProjectDetailsPage() {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const { currentTheme, changeTheme, theme: themeConfig } = useTheme();
  const [selectedStage, setSelectedStage] = useState(null);
  const [q, setQ] = useState("");
  const [messages, setMessages] = useState([]);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [enginesStarted, setEnginesStarted] = useState(false);
  const [isEngineStarting, setIsEngineStarting] = useState(false);
  const [showEngineAnimation, setShowEngineAnimation] = useState(false);
  const [showConfirmationPage, setShowConfirmationPage] = useState(false);
  const [currentStatusMessage, setCurrentStatusMessage] = useState("");
  const [sessionHistory, setSessionHistory] = useState(SAMPLE_SESSION_HISTORY[projectName] || []);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [newDocument, setNewDocument] = useState({ name: "", description: "", type: "other" });
  const [showAddDocumentForm, setShowAddDocumentForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSessionDetails, setShowSessionDetails] = useState(false);
  const [isAutomationMode, setIsAutomationMode] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isGlobalNotifications, setIsGlobalNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentStageProgress, setCurrentStageProgress] = useState(0);
  const [stageTimer, setStageTimer] = useState(null);
  const [showDocumentChat, setShowDocumentChat] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const { transcript, setTranscript, start } = useSpeechRecognition(true);
  const audioRef = useRef(null);

  // Artifacts data for current project
  const projectArtifacts = {
    MISC: {
      inputDocuments: [
        { name: "COBOL_Source_Files.zip", type: "codebase", description: "Complete COBOL source code files", version: "v1.2", date: "2024-01-15" },
        { name: "User_Manual_MISC.pdf", type: "user_manual", description: "Comprehensive user manual for MISC system", version: "v2.1", date: "2024-01-14" },
        { name: "Meeting_Recording_Phase1.mp3", type: "meeting_recording", description: "SME discussion on business requirements", version: "v1.0", date: "2024-01-13" },
        { name: "FSA_Documentation.pdf", type: "fsa", description: "Functional Specification Analysis document", version: "v1.5", date: "2024-01-12" },
        { name: "Business_Requirements.docx", type: "other", description: "Additional business requirements document", version: "v1.0", date: "2024-01-11" }
      ],
      comprehensionDocuments: [
        { name: "MISC_File1_Comprehension.pdf", description: "Comprehension analysis for MISC_MAIN.cbl", evaluation: "MISC_File1_Evaluation.pdf" },
        { name: "MISC_File2_Comprehension.pdf", description: "Comprehension analysis for MISC_PROCESS.cbl", evaluation: "MISC_File2_Evaluation.pdf" },
        { name: "MISC_File3_Comprehension.pdf", description: "Comprehension analysis for MISC_UTILS.cbl", evaluation: "MISC_File3_Evaluation.pdf" }
      ],
      capabilityDocument: [
        { name: "MISC_Capability_Analysis.pdf", description: "Comprehensive capability analysis document", evaluation: "MISC_Capability_Evaluation.pdf" }
      ],
      applicationDocument: [
        { name: "MISC_Application_Overview.pdf", description: "Complete application-level documentation", evaluation: "MISC_Application_Evaluation.pdf" }
      ],
      codeConversionDocuments: [
        { name: "MISC_TTD_Documents.zip", description: "Technical Transfer Documents for code conversion", evaluation: "MISC_TTD_Evaluation.pdf" },
        { name: "MISC_Conversion_Architecture.pdf", description: "Code conversion architecture specification", evaluation: "MISC_Architecture_Evaluation.pdf" },
        { name: "MISC_Pseudo_Code.pdf", description: "Pseudo code documentation for conversion", evaluation: "MISC_Pseudo_Evaluation.pdf" },
        { name: "MISC_Converted_Code.zip", description: "Complete converted Java codebase", evaluation: "MISC_Code_Evaluation.pdf" }
      ]
    },
    GEVIS: {
      inputDocuments: [
        { name: "GEVIS_Codebase.zip", type: "codebase", description: "GEVIS COBOL source files", version: "v1.0", date: "2024-01-12" },
        { name: "GEVIS_User_Guide.pdf", type: "user_manual", description: "GEVIS system user guide", version: "v1.1", date: "2024-01-11" },
        { name: "GEVIS_Requirements.mp3", type: "meeting_recording", description: "GEVIS requirements discussion", version: "v1.0", date: "2024-01-10" }
      ],
      comprehensionDocuments: [
        { name: "GEVIS_File1_Comprehension.pdf", description: "Comprehension analysis for GEVIS_MAIN.cbl", evaluation: "GEVIS_File1_Evaluation.pdf" },
        { name: "GEVIS_File2_Comprehension.pdf", description: "Comprehension analysis for GEVIS_DATA.cbl", evaluation: "GEVIS_File2_Evaluation.pdf" }
      ],
      capabilityDocument: [
        { name: "GEVIS_Capability_Analysis.pdf", description: "GEVIS capability analysis document", evaluation: "GEVIS_Capability_Evaluation.pdf" }
      ],
      applicationDocument: [
        { name: "GEVIS_Application_Overview.pdf", description: "GEVIS application documentation", evaluation: "GEVIS_Application_Evaluation.pdf" }
      ],
      codeConversionDocuments: [
        { name: "GEVIS_TTD_Documents.zip", description: "GEVIS technical transfer documents", evaluation: "GEVIS_TTD_Evaluation.pdf" },
        { name: "GEVIS_Conversion_Architecture.pdf", description: "GEVIS conversion architecture", evaluation: "GEVIS_Architecture_Evaluation.pdf" },
        { name: "GEVIS_Pseudo_Code.pdf", description: "GEVIS pseudo code documentation", evaluation: "GEVIS_Pseudo_Evaluation.pdf" },
        { name: "GEVIS_Converted_Code.zip", description: "GEVIS converted Java code", evaluation: "GEVIS_Code_Evaluation.pdf" }
      ]
    }
  };

  const currentArtifacts = projectArtifacts[projectName] || projectArtifacts.MISC;

  // Initialize input documents state
  const [inputDocuments, setInputDocuments] = useState(currentArtifacts.inputDocuments);

  // React hooks must be called before any early returns
  useEffect(() => {
    if (transcript) setQ(transcript);
  }, [transcript]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (stageTimer) {
        clearInterval(stageTimer);
      }
    };
  }, [stageTimer]);

  // Find the project
  const project = PROJECTS.find(p => p.name === projectName);
  
  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentStage = PROJECT_STAGES[Object.keys(PROJECT_STAGES)[project.progress - 1]];
  const completedStages = project.progress - 1;
  const totalStages = Object.keys(PROJECT_STAGES).length;

  const getStageStatus = (stageIndex) => {
    // Stage 1 (Data Ingestion) is always accessible
    if (stageIndex === 1) {
      if (stageIndex < project.progress) return 'completed';
      if (stageIndex === project.progress) return 'active';
      return 'pending';
    }
    
    // Stages 2+ require engines to be started
    if (!enginesStarted) return 'locked';
    
    if (stageIndex < project.progress) return 'completed';
    if (stageIndex === project.progress) return 'active';
    return 'pending';
  };

  // Add notification function
  const addNotification = (type, title, message, project = projectName) => {
    const newNotification = {
      id: Date.now(),
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      project
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Handle stage completion
  const handleStageComplete = (stageIndex) => {
    const stageName = PROJECT_STAGES[Object.keys(PROJECT_STAGES)[stageIndex - 1]].name;
    addNotification('success', `Stage ${stageIndex} Completed`, `${stageName} stage completed successfully.`);
    
    if (stageIndex < Object.keys(PROJECT_STAGES).length) {
      project.progress = stageIndex + 1;
      addNotification('info', `Stage ${stageIndex + 1} Started`, `${PROJECT_STAGES[Object.keys(PROJECT_STAGES)[stageIndex]].name} stage has begun.`);
      
      if (isAutomationMode) {
        // Start automation timer for next stage
        startStageTimer(stageIndex + 1);
      }
    }
  };

  // Start stage timer for automation
  const startStageTimer = (stageIndex) => {
    if (stageTimer) clearInterval(stageTimer);
    
    // Use shorter duration for demo purposes (30 seconds per stage)
    const duration = 30 * 1000; // 30 seconds
    
    const startTime = Date.now();
    setCurrentStageProgress(0);
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setCurrentStageProgress(progress);
      
      if (progress >= 100) {
        clearInterval(timer);
        handleStageComplete(stageIndex);
      }
    }, 1000);
    
    setStageTimer(timer);
  };

  // Handle manual stage start
  const handleManualStageStart = (stageIndex) => {
    if (stageIndex === project.progress && enginesStarted) {
      const stageName = PROJECT_STAGES[Object.keys(PROJECT_STAGES)[stageIndex - 1]].name;
      addNotification('info', `Stage ${stageIndex} Started`, `${stageName} stage initiated manually.`);
      startStageTimer(stageIndex);
    }
  };

  const theme = themeConfig;
  const projectData = PROJECT_DATA[projectName] || PROJECT_DATA.MISC;

  const handleAsk = () => {
    if (!q.trim()) return;
    
    const reply = `I can help you with ${projectName} project information. This project is currently at stage "${PIPELINE[project.progress - 1]}" with ${projectData.totalLoC.toLocaleString()} lines of code processed.`;
    
    setMessages(m => [...m, { role: "user", text: q }, { role: "assistant", text: reply }]);
    setQ("");
    setTranscript("");
  };

  const handleViewSessionDetails = (session) => {
    setSelectedSession(session);
    setShowSessionDetails(true);
  };

  const handleAddDocument = () => {
    if (newDocument.name.trim() && newDocument.description.trim()) {
      const documentToAdd = {
        ...newDocument,
        version: "v1.0",
        date: new Date().toISOString().split('T')[0]
      };
      setInputDocuments(prev => [...prev, documentToAdd]);
      setNewDocument({ name: "", description: "", type: "other" });
      setShowAddDocumentForm(false);
    }
  };

  const handleCancelAddDocument = () => {
    setNewDocument({ name: "", description: "", type: "other" });
    setShowAddDocumentForm(false);
  };

  const handleConfirmationConfirm = () => {
    setShowConfirmationPage(false);
    setEnginesStarted(true);
    // Update project stage to 2 (Comprehension Documentation)
    project.progress = 2;
    addNotification('success', 'Engines Started', 'AI processing engines have been successfully started.');
    
    if (isAutomationMode) {
      // Start automation for stage 2
      startStageTimer(2);
    }
  };

  const handleConfirmationCancel = () => {
    setShowConfirmationPage(false);
    // Reset to stage 1 if user cancels
    project.progress = 1;
  };

  const statusMessages = [
    "Establishing link with Falcon Backend...",
    "Initializing AI processing cores...",
    "AI processing engines are initializing..."
  ];

  const handleStartEngines = () => {
    // Archive current session if engines were previously started
    if (enginesStarted && currentSessionId) {
      const currentSession = {
        id: currentSessionId,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        finalStage: project.progress,
        status: 'incomplete',
        totalStages: 11,
        artifacts: {
          inputDocs: [`${projectName}_Input_Docs_${currentSessionId}.zip`],
          outputDocs: [`${projectName}_Output_${currentSessionId}.pdf`],
          codeArtifacts: [`${projectName}_Code_${currentSessionId}.zip`]
        }
      };
      setSessionHistory(prev => [currentSession, ...prev]); // Add to top of list
    }

    // Create new session
    const newSessionId = Date.now().toString();
    setCurrentSessionId(newSessionId);
    
    // Reset project to stage 1 for new session
    project.progress = 1;
    
    setIsEngineStarting(true);
    setShowEngineAnimation(true);
    setEnginesStarted(false);
    
    // Create and play the engine sound
    const audio = new Audio('/assets/engine_start.mp3');
    audioRef.current = audio;
    
    // Set audio properties
    audio.volume = 0.7;
    audio.preload = 'auto';
    
    // Add event listeners
    audio.addEventListener('canplaythrough', () => {
      console.log('Audio loaded successfully, starting playback');
    });
    
    audio.addEventListener('loadstart', () => {
      console.log('Audio loading started');
    });
    
    audio.addEventListener('loadeddata', () => {
      console.log('Audio data loaded');
    });
    
    audio.addEventListener('ended', () => {
      console.log('Audio playback completed');
      // Clear the message interval
      if (audioRef.current.messageInterval) {
        clearInterval(audioRef.current.messageInterval);
      }
      setIsEngineStarting(false);
      setShowEngineAnimation(false);
      setCurrentStatusMessage("");
      // Show confirmation page instead of immediately starting engines
      setShowConfirmationPage(true);
    });
    
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      console.log('Engine sound not found, proceeding without audio');
      // Clear the message interval if it exists
      if (audioRef.current.messageInterval) {
        clearInterval(audioRef.current.messageInterval);
      }
      // Simulate audio duration for animation
      setTimeout(() => {
        setIsEngineStarting(false);
        setShowEngineAnimation(false);
        setCurrentStatusMessage("");
        // Show confirmation page instead of immediately starting engines
        setShowConfirmationPage(true);
      }, 3000); // 3 second animation if no audio
    });
    
    // Try to play the audio
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Audio started playing successfully');
          // Start cycling through status messages continuously
          let messageIndex = 0;
          const messageInterval = setInterval(() => {
            setCurrentStatusMessage(statusMessages[messageIndex]);
            messageIndex = (messageIndex + 1) % statusMessages.length;
          }, 1200); // Change message every 1.2 seconds, cycles continuously
          
          // Store interval ID to clear it when animation ends
          audioRef.current.messageInterval = messageInterval;
        })
        .catch((error) => {
          console.error('Audio playback failed:', error);
          console.log('Audio playback failed, proceeding without sound');
          // Clear the message interval if it exists
          if (audioRef.current.messageInterval) {
            clearInterval(audioRef.current.messageInterval);
          }
          // Simulate audio duration for animation
          setTimeout(() => {
            setIsEngineStarting(false);
            setShowEngineAnimation(false);
            setCurrentStatusMessage("");
            // Show confirmation page instead of immediately starting engines
            setShowConfirmationPage(true);
          }, 3000); // 3 second animation if no audio
        });
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.primary} ${theme.colors.text}`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 ${theme.colors.header} border-b ${theme.colors.border}`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className={`p-2 rounded-xl hover:bg-slate-100 transition-colors ${theme.colors.text}`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className={`text-xl font-bold ${theme.colors.text}`}>Ford Falcon</div>
          <div className="ml-auto flex items-center gap-3">
            <ThemeSelector currentTheme={currentTheme} onThemeChange={changeTheme} />
            <button
              onClick={() => {
                setIsGlobalNotifications(true);
                setShowNotifications(true);
              }}
              className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors"
              title="Global Notifications"
            >
              <Bell className="h-5 w-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Welcome Mayur!
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="w-full h-64 bg-gradient-to-r from-blue-600 via-blue-800 to-yellow-600 relative overflow-hidden">
          {/* Binary Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255, 255, 255, 0.1) 10px,
                rgba(255, 255, 255, 0.1) 20px
              )`,
              backgroundSize: '20px 20px'
            }}>
              <div className="w-full h-full" style={{
                backgroundImage: `repeating-linear-gradient(
                  -45deg,
                  transparent,
                  transparent 15px,
                  rgba(255, 255, 255, 0.05) 15px,
                  rgba(255, 255, 255, 0.05) 30px
                )`,
                backgroundSize: '30px 30px'
              }} />
            </div>
          </div>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                {project.name}
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-white/90 max-w-2xl mx-auto"
              >
                Legacy System Modernization Project
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Project Overview */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold ${theme.colors.text} mb-4`}>Project Overview</h2>
          <div className={`${theme.colors.card} rounded-2xl border ${theme.colors.border} p-6 shadow-sm`}>
            <p className={`${theme.colors.textSecondary} leading-relaxed mb-4`}>
              {project.name} is a comprehensive legacy system modernization project that involves converting
              existing COBOL/JCL codebase to modern Java architecture. The project focuses on maintaining
              business logic while improving performance, maintainability, and integration capabilities.
              Our AI-driven approach ensures accurate conversion while preserving all critical functionality.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className={`text-center p-4 ${theme.name === "Vibrant" ? "bg-blue-600/20" : "bg-blue-50"} rounded-xl`}>
                <div className={`text-2xl font-bold ${theme.name === "Vibrant" ? "text-blue-300" : "text-blue-600"}`}>{completedStages}/{totalStages}</div>
                <div className={`text-sm ${theme.colors.textMuted}`}>Stages Completed</div>
              </div>
              <div className={`text-center p-4 ${theme.name === "Vibrant" ? "bg-green-600/20" : "bg-green-50"} rounded-xl`}>
                <div className={`text-2xl font-bold ${theme.name === "Vibrant" ? "text-green-300" : "text-green-600"}`}>{currentStage?.name}</div>
                <div className={`text-sm ${theme.colors.textMuted}`}>Current Stage</div>
              </div>
              <div className={`text-center p-4 ${theme.name === "Vibrant" ? "bg-orange-600/20" : "bg-orange-50"} rounded-xl`}>
                <div className={`text-2xl font-bold ${theme.name === "Vibrant" ? "text-orange-300" : "text-orange-600"} capitalize`}>{project.risk}</div>
                <div className={`text-sm ${theme.colors.textMuted}`}>Risk Level</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "overview"
                  ? `${theme.name === "Vibrant" ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-900 shadow-sm'}`
                  : `${theme.name === "Vibrant" ? 'text-gray-600 hover:text-blue-300' : theme.colors.textMuted + ' hover:text-gray-900'}`
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("artifacts")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "artifacts"
                  ? `${theme.name === "Vibrant" ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-900 shadow-sm'}`
                  : `${theme.name === "Vibrant" ? 'text-gray-600 hover:text-blue-300' : theme.colors.textMuted + ' hover:text-gray-900'}`
              }`}
            >
              Artifacts
            </button>
          </div>
        </div>

                {/* Overview Tab Content */}
        {activeTab === "overview" && (
          <>
            {/* Lines of Code and Evaluation Charts */}
            <div className="mb-8">
              <h2 className={`text-2xl font-bold ${theme.colors.text} mb-6`}>Project Metrics</h2>
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Lines of Code Chart */}
                <div className={`${theme.colors.chart} rounded-2xl border ${theme.colors.border} p-4 shadow`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-semibold ${theme.colors.text}`}>Lines of Code Processed</h3>
                    <span className={`text-xs ${theme.colors.textMuted}`}>weekly</span>
                  </div>
                  <div className="h-56">
                    <ResponsiveContainer>
                      <AreaChart data={projectData.weeklyLoC}>
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
                  <div className={`text-center mt-2 ${theme.colors.textMuted}`}>
                    Total: {projectData.totalLoC.toLocaleString()} LoC
                  </div>
                </div>

                {/* Code Evaluation Radar */}
                <div className={`${theme.colors.chart} rounded-2xl border ${theme.colors.border} p-4 shadow`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-semibold ${theme.colors.text}`}>Code Evaluation (0–5)</h3>
                    <span className={`text-xs ${theme.colors.textMuted}`}>quality metrics</span>
                  </div>
                  <div className="h-56">
                    <ResponsiveContainer>
                      <RadarChart data={projectData.evalScores}>
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
                </div>

                {/* Document Evaluation Radar */}
                <div className={`${theme.colors.chart} rounded-2xl border ${theme.colors.border} p-4 shadow`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-semibold ${theme.colors.text}`}>Document Evaluation (0–5)</h3>
                    <span className={`text-xs ${theme.colors.textMuted}`}>documentation quality</span>
                  </div>
                  <div className="h-56">
                    <ResponsiveContainer>
                      <RadarChart data={projectData.documentEvalScores}>
                        <PolarGrid stroke={theme.name === "Vibrant" ? "#ffffff40" : "#e5e7eb"} />
                        <PolarAngleAxis
                          dataKey="metric"
                          tick={{ fill: theme.name === "Vibrant" ? "#ffffff" : "#6b7280", fontSize: 10 }}
                        />
                        <Radar name="Current" dataKey="score" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.35} />
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
                </div>
              </div>

              {/* Iterative AI Agent Improvement */}
              <div className="mt-8">
                <h3 className={`text-2xl font-bold ${theme.colors.text} mb-6`}>AI Agent Iterative Improvement</h3>
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Document Generation Improvement */}
                  <div className={`${theme.colors.chart} rounded-2xl border ${theme.colors.border} p-4 shadow`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className={`font-semibold ${theme.colors.text}`}>Document Generation Quality</h4>
                      <span className={`text-xs ${theme.colors.textMuted}`}>iterative improvement</span>
                    </div>
                    <div className="h-56">
                      <ResponsiveContainer>
                        <LineChart data={projectData.iterativeImprovement?.documentGeneration || []}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.name === "Vibrant" ? "#ffffff40" : "#e5e7eb"} />
                          <XAxis 
                            dataKey="iteration" 
                            tick={{ fill: theme.name === "Vibrant" ? "#ffffff" : "#6b7280" }}
                            label={{ value: 'Iteration', position: 'insideBottom', offset: -5, fill: theme.name === "Vibrant" ? "#ffffff" : "#6b7280" }}
                          />
                          <YAxis 
                            domain={[1, 5]}
                            tick={{ fill: theme.name === "Vibrant" ? "#ffffff" : "#6b7280" }}
                            label={{ value: 'Score', angle: -90, position: 'insideLeft', fill: theme.name === "Vibrant" ? "#ffffff" : "#6b7280" }}
                          />
                          <ReferenceLine 
                            y={4.5} 
                            stroke="#22c55e" 
                            strokeDasharray="5 5" 
                            label={{ value: "Threshold (4.5)", position: "topRight", fill: "#22c55e" }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: theme.name === "Vibrant" ? "#1e3a8a" : "#ffffff",
                              color: theme.name === "Vibrant" ? "#ffffff" : "#000000",
                              border: theme.name === "Vibrant" ? "1px solid #3b82f6" : "1px solid #e5e7eb"
                            }}
                            formatter={(value, name) => [`${value}/5`, 'Quality Score']}
                            labelFormatter={(label) => `Iteration ${label}`}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#3b82f6" 
                            strokeWidth={3}
                            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 2, fill: "#ffffff" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className={`text-xs ${theme.colors.textMuted} mt-2 flex items-center justify-between`}>
                      <span>Agent stops at threshold (4.5) or manual intervention</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        projectData.iterativeImprovement?.documentGeneration?.some(iter => iter.status === 'threshold_reached')
                          ? (theme.name === "Vibrant" ? 'bg-green-600/30 text-green-300' : 'bg-green-100 text-green-800')
                          : (theme.name === "Vibrant" ? 'bg-orange-600/30 text-orange-300' : 'bg-orange-100 text-orange-800')
                      }`}>
                        {projectData.iterativeImprovement?.documentGeneration?.some(iter => iter.status === 'threshold_reached') ? 'Threshold Reached' : 'In Progress'}
                      </span>
                    </div>
                  </div>

                  {/* Code Conversion Improvement */}
                  <div className={`${theme.colors.chart} rounded-2xl border ${theme.colors.border} p-4 shadow`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className={`font-semibold ${theme.colors.text}`}>Code Conversion Quality</h4>
                      <span className={`text-xs ${theme.colors.textMuted}`}>iterative refinement</span>
                    </div>
                    <div className="h-56">
                      <ResponsiveContainer>
                        <LineChart data={projectData.iterativeImprovement?.codeConversion || []}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.name === "Vibrant" ? "#ffffff40" : "#e5e7eb"} />
                          <XAxis 
                            dataKey="iteration" 
                            tick={{ fill: theme.name === "Vibrant" ? "#ffffff" : "#6b7280" }}
                            label={{ value: 'Iteration', position: 'insideBottom', offset: -5, fill: theme.name === "Vibrant" ? "#ffffff" : "#6b7280" }}
                          />
                          <YAxis 
                            domain={[1, 5]}
                            tick={{ fill: theme.name === "Vibrant" ? "#ffffff" : "#6b7280" }}
                            label={{ value: 'Score', angle: -90, position: 'insideLeft', fill: theme.name === "Vibrant" ? "#ffffff" : "#6b7280" }}
                          />
                          <ReferenceLine 
                            y={4.5} 
                            stroke="#22c55e" 
                            strokeDasharray="5 5" 
                            label={{ value: "Threshold (4.5)", position: "topRight", fill: "#22c55e" }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: theme.name === "Vibrant" ? "#1e3a8a" : "#ffffff",
                              color: theme.name === "Vibrant" ? "#ffffff" : "#000000",
                              border: theme.name === "Vibrant" ? "1px solid #3b82f6" : "1px solid #e5e7eb"
                            }}
                            formatter={(value, name) => [`${value}/5`, 'Quality Score']}
                            labelFormatter={(label) => `Iteration ${label}`}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#f59e0b" 
                            strokeWidth={3}
                            dot={{ fill: "#f59e0b", strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, stroke: "#f59e0b", strokeWidth: 2, fill: "#ffffff" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className={`text-xs ${theme.colors.textMuted} mt-2 flex items-center justify-between`}>
                      <span>Continuous refinement until quality target met</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        projectData.iterativeImprovement?.codeConversion?.some(iter => iter.status === 'threshold_reached')
                          ? (theme.name === "Vibrant" ? 'bg-green-600/30 text-green-300' : 'bg-green-100 text-green-800')
                          : (theme.name === "Vibrant" ? 'bg-orange-600/30 text-orange-300' : 'bg-orange-100 text-orange-800')
                      }`}>
                        {projectData.iterativeImprovement?.codeConversion?.some(iter => iter.status === 'threshold_reached') ? 'Threshold Reached' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Artifacts Tab Content */}
        {activeTab === "artifacts" && (
          <div className="space-y-8">
            {/* Input Documents Section */}
            <div className={`${theme.colors.card} rounded-2xl border ${theme.colors.border} p-6 shadow-sm`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${theme.colors.text}`}>Input Documents</h3>
                <button 
                  onClick={() => setShowAddDocumentForm(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${theme.colors.accent} text-white ${theme.colors.accentHover} transition-colors`}
                >
                  + Add Document
                </button>
              </div>

              {/* Add Document Form */}
              {showAddDocumentForm && (
                <div className={`mb-6 p-4 rounded-xl border-2 border-dashed ${theme.colors.border} ${theme.name === "Vibrant" ? "bg-white/10" : "bg-gray-50"}`}>
                  <h4 className={`font-semibold ${theme.colors.text} mb-4`}>Add New Document</h4>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                        Document Name
                      </label>
                      <input
                        type="text"
                        value={newDocument.name}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter document name..."
                        className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.colors.text} ${theme.name === "Vibrant" ? "bg-white/20" : "bg-white"}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                        Document Type
                      </label>
                      <select
                        value={newDocument.type}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, type: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.colors.text} ${theme.name === "Vibrant" ? "bg-white/20" : "bg-white"}`}
                      >
                        <option value="codebase">Codebase</option>
                        <option value="user_manual">User Manual</option>
                        <option value="meeting_recording">Meeting Recording</option>
                        <option value="fsa">FSA Document</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                      Description
                    </label>
                    <textarea
                      value={newDocument.description}
                      onChange={(e) => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter document description..."
                      rows="3"
                      className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.colors.text} ${theme.name === "Vibrant" ? "bg-white/20" : "bg-white"}`}
                    />
                  </div>
                  <div className="mb-4">
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                      Upload File
                    </label>
                    <div className={`border-2 border-dashed ${theme.colors.border} rounded-lg p-6 text-center ${theme.name === "Vibrant" ? "bg-white/10" : "bg-gray-50"}`}>
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className={`mt-2 text-sm ${theme.colors.textMuted}`}>
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className={`text-xs ${theme.colors.textMuted}`}>
                        PDF, DOC, ZIP, MP3, or any file type
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={handleCancelAddDocument}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border ${theme.colors.border} ${theme.colors.text} hover:bg-gray-100 transition-colors`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddDocument}
                      disabled={!newDocument.name.trim() || !newDocument.description.trim()}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${theme.colors.accent} text-white ${theme.colors.accentHover} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      Add Document
                    </button>
                  </div>
                </div>
              )}
              
              <div className="grid gap-4">
                {inputDocuments.map((doc, index) => (
                  <div key={index} className={`p-4 rounded-xl border ${theme.colors.border} ${theme.name === "Vibrant" ? "bg-white/10" : "bg-gray-50"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            doc.type === "codebase" ? (theme.name === "Vibrant" ? "bg-blue-600/30 text-blue-300" : "bg-blue-100 text-blue-800") :
                            doc.type === "user_manual" ? (theme.name === "Vibrant" ? "bg-green-600/30 text-green-300" : "bg-green-100 text-green-800") :
                            doc.type === "meeting_recording" ? (theme.name === "Vibrant" ? "bg-purple-600/30 text-purple-300" : "bg-purple-100 text-purple-800") :
                            doc.type === "fsa" ? (theme.name === "Vibrant" ? "bg-orange-600/30 text-orange-300" : "bg-orange-100 text-orange-800") :
                            (theme.name === "Vibrant" ? "bg-gray-600/30 text-gray-300" : "bg-gray-100 text-gray-800")
                          }`}>
                          {doc.type.replace('_', ' ').toUpperCase()}
                        </span>
                          <span className={`text-sm ${theme.colors.textMuted}`}>v{doc.version}</span>
                        </div>
                        <h4 className={`font-semibold ${theme.colors.text} mb-1`}>{doc.name}</h4>
                        <p className={`text-sm ${theme.colors.textSecondary}`}>{doc.description}</p>
                        <p className={`text-xs ${theme.colors.textMuted} mt-2`}>Uploaded: {doc.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className={`p-2 rounded-lg ${theme.name === "Vibrant" ? "bg-white/20 hover:bg-white/30" : "bg-gray-100 hover:bg-gray-200"} transition-colors`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                        <button className={`p-2 rounded-lg ${theme.name === "Vibrant" ? "bg-white/20 hover:bg-white/30" : "bg-gray-100 hover:bg-gray-200"} transition-colors`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Output Documents Section */}
            <div className={`${theme.colors.card} rounded-2xl border ${theme.colors.border} p-6 shadow-sm`}>
              <h3 className={`text-xl font-bold ${theme.colors.text} mb-6`}>Output Documents & Artifacts</h3>
              
              {/* Comprehension Documents */}
              <div className="mb-8">
                <h4 className={`text-lg font-semibold ${theme.colors.text} mb-4`}>Comprehension Documents</h4>
                <div className="grid gap-4">
                  {currentArtifacts.comprehensionDocuments.map((doc, index) => (
                    <div key={index} className={`p-4 rounded-xl border ${theme.colors.border} ${theme.name === "Vibrant" ? "bg-white/10" : "bg-gray-50"}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className={`font-semibold ${theme.colors.text} mb-1`}>{doc.name}</h5>
                          <p className={`text-sm ${theme.colors.textSecondary}`}>{doc.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className={`px-3 py-1 rounded-lg text-xs font-medium ${theme.name === "Vibrant" ? "bg-blue-600/30 text-blue-300" : "bg-blue-100 text-blue-800"}`}>
                            Download
                          </button>
                          <button className={`px-3 py-1 rounded-lg text-xs font-medium ${theme.name === "Vibrant" ? "bg-green-600/30 text-green-300" : "bg-green-100 text-green-800"}`}>
                            View Evaluation
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedDocument(doc);
                              setShowDocumentChat(true);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-medium ${theme.name === "Vibrant" ? "bg-purple-600/30 text-purple-300" : "bg-purple-100 text-purple-800"}`}
                          >
                            Query & Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capability Document */}
              <div className="mb-8">
                <h4 className={`text-lg font-semibold ${theme.colors.text} mb-4`}>Capability Document</h4>
                <div className={`p-4 rounded-xl border ${theme.colors.border} ${theme.name === "Vibrant" ? "bg-white/10" : "bg-gray-50"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h5 className={`font-semibold ${theme.colors.text} mb-1`}>{currentArtifacts.capabilityDocument[0].name}</h5>
                      <p className={`text-sm ${theme.colors.textSecondary}`}>{currentArtifacts.capabilityDocument[0].description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className={`px-3 py-1 rounded-lg text-xs font-medium ${theme.name === "Vibrant" ? "bg-blue-600/30 text-blue-300" : "bg-blue-100 text-blue-800"}`}>
                        Download
                      </button>
                      <button className={`px-3 py-1 rounded-lg text-xs font-medium ${theme.name === "Vibrant" ? "bg-green-600/30 text-green-300" : "bg-green-100 text-green-800"}`}>
                        View Evaluation
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedDocument(currentArtifacts.capabilityDocument[0]);
                          setShowDocumentChat(true);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-medium ${theme.name === "Vibrant" ? "bg-purple-600/30 text-purple-300" : "bg-purple-100 text-purple-800"}`}
                      >
                        Query & Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Document */}
              <div className="mb-8">
                <h4 className={`text-lg font-semibold ${theme.colors.text} mb-4`}>Application Document</h4>
                <div className={`p-4 rounded-xl border ${theme.colors.border} ${theme.name === "Vibrant" ? "bg-white/10" : "bg-gray-50"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h5 className={`font-semibold ${theme.colors.text} mb-1`}>{currentArtifacts.applicationDocument[0].name}</h5>
                      <p className={`text-sm ${theme.colors.textSecondary}`}>{currentArtifacts.applicationDocument[0].description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className={`px-3 py-1 rounded-lg text-xs font-medium ${theme.name === "Vibrant" ? "bg-blue-600/30 text-blue-300" : "bg-blue-100 text-blue-800"}`}>
                        Download
                      </button>
                      <button className={`px-3 py-1 rounded-lg text-xs font-medium ${theme.name === "Vibrant" ? "bg-green-600/30 text-green-300" : "bg-green-100 text-green-800"}`}>
                        View Evaluation
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedDocument(currentArtifacts.applicationDocument[0]);
                          setShowDocumentChat(true);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-medium ${theme.name === "Vibrant" ? "bg-purple-600/30 text-purple-300" : "bg-purple-100 text-purple-800"}`}
                      >
                        Query & Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Conversion Documents */}
              <div>
                <h4 className={`text-lg font-semibold ${theme.colors.text} mb-4`}>Code Conversion Documents</h4>
                <div className="grid gap-4">
                  {currentArtifacts.codeConversionDocuments.map((doc, index) => (
                    <div key={index} className={`p-4 rounded-xl border ${theme.colors.border} ${theme.name === "Vibrant" ? "bg-white/10" : "bg-gray-50"}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className={`font-semibold ${theme.colors.text} mb-1`}>{doc.name}</h5>
                          <p className={`text-sm ${theme.colors.textSecondary}`}>{doc.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className={`px-3 py-1 rounded-lg text-xs font-medium ${theme.name === "Vibrant" ? "bg-blue-600/30 text-blue-300" : "bg-blue-100 text-blue-800"}`}>
                            Download
                          </button>
                          <button className={`px-3 py-1 rounded-lg text-xs font-medium ${theme.name === "Vibrant" ? "bg-green-600/30 text-green-300" : "bg-green-100 text-green-800"}`}>
                            View Evaluation
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedDocument(doc);
                              setShowDocumentChat(true);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-medium ${theme.name === "Vibrant" ? "bg-purple-600/30 text-purple-300" : "bg-purple-100 text-purple-800"}`}
                          >
                            Query & Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${theme.colors.text}`}>Project Timeline</h2>
            <div className="flex items-center gap-4">
              {/* Automation/Manual Toggle */}
              <div className="flex items-center gap-2">
                <span className={`text-sm ${theme.colors.textMuted}`}>Mode:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setIsAutomationMode(true)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                      isAutomationMode
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <AutoPlay className="h-4 w-4" />
                    Automation
                  </button>
                  <button
                    onClick={() => setIsAutomationMode(false)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                      !isAutomationMode
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Hand className="h-4 w-4" />
                    Manual
                  </button>
                </div>
              </div>
              
              {/* Notifications Button */}
              <button
                onClick={() => {
                  setIsGlobalNotifications(false);
                  setShowNotifications(true);
                }}
                className="relative px-3 py-2 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors flex items-center gap-2"
                title="Project Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="text-sm font-medium">Notifications</span>
                {notifications.filter(n => !n.read && n.project === projectName).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.filter(n => !n.read && n.project === projectName).length}
                  </span>
                )}
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(PROJECT_STAGES).map(([key, stage], index) => {
                const status = getStageStatus(index + 1);

                
                return (
                  <React.Fragment key={key}>
                    <div className="relative">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg relative ${
                          status === 'completed' ? 
                            (theme.name === "Vibrant" ? 'border-green-500/50 bg-green-600/20' : 'border-green-500/30 bg-green-50') :
                          status === 'active' ? 
                            (theme.name === "Vibrant" ? 'border-blue-500/50 bg-blue-600/20' : 'border-blue-500/50 bg-blue-50') :
                          status === 'locked' ?
                            (theme.name === "Vibrant" ? 'border-gray-500/30 bg-gray-600/20 opacity-50' : 'border-gray-300/30 bg-gray-50 opacity-50') :
                            (theme.name === "Vibrant" ? 'border-gray-500/30 bg-gray-600/20' : 'border-gray-300/30 bg-gray-50')
                        } ${selectedStage === key ? 'ring-2 ring-blue-500/50 shadow-lg' : ''} ${status !== 'locked' ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        onClick={() => {
                          if (status !== 'locked') {
                            if (selectedStage === key) {
                              setSelectedStage(null);
                            } else {
                              setSelectedStage(key);
                              // Handle manual stage start
                              if (!isAutomationMode && status === 'active' && enginesStarted) {
                                handleManualStageStart(index + 1);
                              }
                            }
                          }
                        }}
                      >
                        {/* Step Number */}
                        <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          theme.name === "Vibrant" ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${stage.color} text-white flex-shrink-0`}>
                            {stage.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className={`font-semibold ${theme.colors.text} truncate`}>{stage.name}</h3>
                              {status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />}
                              {status === 'active' && <Play className="h-4 w-4 text-blue-500 flex-shrink-0" />}
                            </div>
                            <p className={`text-sm ${theme.colors.textMuted} mb-3 line-clamp-2`}>{stage.description}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className={`flex items-center gap-1 ${theme.colors.textMuted}`}>
                                <Clock className="h-3 w-3" />
                                {stage.duration}
                              </span>
                              <span className={`px-2 py-1 rounded-full ${
                                status === 'completed' ? 
                                  (theme.name === "Vibrant" ? 'bg-green-600/30 text-green-300' : 'bg-green-100 text-green-800') :
                                status === 'active' ? 
                                  (theme.name === "Vibrant" ? 'bg-blue-600/30 text-blue-300' : 'bg-blue-100 text-blue-800') :
                                status === 'locked' ?
                                  (theme.name === "Vibrant" ? 'bg-red-600/30 text-red-300' : 'bg-red-100 text-red-800') :
                                  (theme.name === "Vibrant" ? 'bg-gray-600/30 text-gray-300' : 'bg-gray-100 text-gray-800')
                              }`}>
                                {status === 'locked' ? 'locked' : status}
                              </span>
                            </div>
                            
                            {/* Progress bar for active stage in automation mode */}
                            {status === 'active' && isAutomationMode && currentStageProgress > 0 && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className={theme.colors.textMuted}>Progress</span>
                                  <span className={theme.colors.textMuted}>{Math.round(currentStageProgress)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${currentStageProgress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                            
                            {/* Manual start button for manual mode */}
                            {status === 'active' && !isAutomationMode && enginesStarted && (
                              <div className="mt-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleManualStageStart(index + 1);
                                  }}
                                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium ${theme.colors.accent} text-white ${theme.colors.accentHover} transition-colors`}
                                >
                                  Start Stage
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Start the Engines Button - appears after stage 1 (Data Ingestion) */}
                    {index === 0 && (
                      <div className="relative md:col-span-2 lg:col-span-1 flex items-center justify-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.15 }}
                          className="relative"
                        >
                          {!enginesStarted ? (
                            <button
                              onClick={handleStartEngines}
                              disabled={isEngineStarting}
                              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                                isEngineStarting 
                                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                  : theme.name === "Vibrant"
                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700'
                                    : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700'
                              }`}
                            >
                              {isEngineStarting ? (
                                <span className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Starting Engines...
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">
                                  <Zap className="h-5 w-5" />
                                  Start the Engines
                                </span>
                              )}
                            </button>
                          ) : (
                            <div className={`px-4 py-2 rounded-xl border-2 ${
                              theme.name === "Vibrant" ? 'border-green-500/50 bg-green-600/20' : 'border-green-500/30 bg-green-50'
                            }`}>
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-green-600" />
                                <span className={`text-sm font-medium ${theme.colors.text}`}>Engines Running</span>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stage Details Modal */}
        {selectedStage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`${theme.colors.card} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border ${theme.colors.border}`}
            >
              <div className={`p-6 border-b ${theme.colors.border}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${PROJECT_STAGES[selectedStage].color} text-white`}>
                      {PROJECT_STAGES[selectedStage].icon}
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${theme.colors.text}`}>{PROJECT_STAGES[selectedStage].name}</h3>
                      <p className={`text-sm ${theme.colors.textMuted}`}>{PROJECT_STAGES[selectedStage].duration}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedStage(null)}
                    className={`p-2 rounded-xl hover:bg-gray-100 transition-colors ${theme.colors.text}`}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  <div>
                    <h4 className={`font-semibold ${theme.colors.text} mb-2`}>Description</h4>
                    <p className={`${theme.colors.textSecondary} leading-relaxed`}>{PROJECT_STAGES[selectedStage].detailedDescription}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className={`font-semibold ${theme.colors.text} mb-3`}>Deliverables</h4>
                      <ul className="space-y-2">
                        {PROJECT_STAGES[selectedStage].deliverables.map((deliverable, index) => (
                          <li key={index} className={`flex items-center gap-2 ${theme.colors.textSecondary}`}>
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className={`font-semibold ${theme.colors.text} mb-3`}>Team</h4>
                      <ul className="space-y-2">
                        {PROJECT_STAGES[selectedStage].team.map((member, index) => (
                          <li key={index} className={`flex items-center gap-2 ${theme.colors.textSecondary}`}>
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            {member}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className={`font-semibold ${theme.colors.text} mb-3`}>Tools & Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {PROJECT_STAGES[selectedStage].tools.map((tool, index) => (
                        <span key={index} className={`px-3 py-1 ${theme.name === "Vibrant" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"} rounded-full text-sm`}>
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

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
                    <p className={`text-sm ${theme.colors.textMuted} mb-2`}>Welcome to {projectName} Chat!</p>
                    <p className={`text-xs ${theme.colors.textMuted}`}>Ask about project progress, metrics, or stages</p>
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

        {/* Session History Table */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold ${theme.colors.text} mb-6`}>Session History</h2>
          <div className={`${theme.colors.card} rounded-2xl border ${theme.colors.border} overflow-hidden shadow`}>
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${theme.colors.accent} animate-pulse`}></div>
              <div className={`font-semibold ${theme.colors.text}`}>Processing Sessions</div>
              <div className={`ml-auto text-xs ${theme.colors.textMuted}`}>
                {sessionHistory.length + (currentSessionId ? 1 : 0)} total sessions
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className={`${theme.name === "Vibrant" ? 'bg-blue-900/20' : 'bg-slate-50'} ${theme.colors.text}`}>
                  <tr>
                    <th className="text-left px-4 py-2">Session ID</th>
                    <th className="text-left px-4 py-2">Start Time</th>
                    <th className="text-left px-4 py-2">End Time</th>
                    <th className="text-left px-4 py-2">Progress</th>
                    <th className="text-left px-4 py-2">Status</th>
                    <th className="text-left px-4 py-2">Artifacts</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Current Session */}
                  {currentSessionId && (
                    <tr className={`border-t ${theme.name === "Vibrant" ? 'border-white/20' : 'border-slate-100'}`}>
                      <td className={`px-4 py-2 font-medium ${theme.colors.text}`}>
                        {currentSessionId.slice(-8)}...
                      </td>
                      <td className={`px-4 py-2 ${theme.colors.textSecondary}`}>
                        {new Date().toLocaleString()}
                      </td>
                      <td className={`px-4 py-2 ${theme.colors.textSecondary}`}>
                        {enginesStarted ? 'Active' : 'Starting...'}
                      </td>
                      <td className={`px-4 py-2 ${theme.colors.textSecondary}`}>
                        {project.progress}/11
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          enginesStarted 
                            ? (theme.name === "Vibrant" ? 'bg-green-600/30 text-green-300' : 'bg-green-100 text-green-800')
                            : (theme.name === "Vibrant" ? 'bg-blue-600/30 text-blue-300' : 'bg-blue-100 text-blue-800')
                        }`}>
                          {enginesStarted ? 'Running' : 'Starting'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`text-xs ${theme.colors.textMuted}`}>
                          Generating...
                        </span>
                      </td>
                    </tr>
                  )}
                  
                  {/* Historical Sessions */}
                  {sessionHistory.map((session, index) => (
                    <tr 
                      key={session.id} 
                      className={`border-t ${theme.name === "Vibrant" ? 'border-white/20' : 'border-slate-100'} hover:bg-slate-50 cursor-pointer transition-colors`}
                      onClick={() => handleViewSessionDetails(session)}
                    >
                      <td className={`px-4 py-2 font-medium ${theme.colors.text}`}>
                        {session.id.slice(-8)}...
                      </td>
                      <td className={`px-4 py-2 ${theme.colors.textSecondary}`}>
                        {new Date(session.startTime).toLocaleString()}
                      </td>
                      <td className={`px-4 py-2 ${theme.colors.textSecondary}`}>
                        {new Date(session.endTime).toLocaleString()}
                      </td>
                      <td className={`px-4 py-2 ${theme.colors.textSecondary}`}>
                        {session.finalStage}/11
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          theme.name === "Vibrant" ? 'bg-gray-600/30 text-gray-300' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {session.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`text-xs ${theme.colors.textMuted}`}>
                          Click to view details
                        </span>
                      </td>
                    </tr>
                  ))}
                  
                  {/* Empty State */}
                  {sessionHistory.length === 0 && !currentSessionId && (
                    <tr className={`border-t ${theme.name === "Vibrant" ? 'border-white/20' : 'border-slate-100'}`}>
                      <td colSpan="5" className={`px-4 py-8 text-center ${theme.colors.textMuted}`}>
                        No processing sessions yet. Start the engines to begin your first session.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Engine Start Animation Overlay */}
      {showEngineAnimation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-center text-white"
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center"
            >
              <Zap className="h-12 w-12 text-white" />
            </motion.div>
                                  <h3 className="text-2xl font-bold mb-2">Starting Engines...</h3>
                      <motion.p 
                        key={currentStatusMessage}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-lg text-white/80 min-h-[1.5rem]"
                      >
                        {currentStatusMessage || "AI processing engines are initializing"}
                      </motion.p>
          </motion.div>
        </div>
      )}

      {/* Confirmation Page Overlay */}
      {showConfirmationPage && (
        <ConfirmationPage
          project={project}
          inputDocuments={inputDocuments}
          onConfirm={handleConfirmationConfirm}
          onCancel={handleConfirmationCancel}
          theme={theme}
        />
      )}

      {/* Session Details Overlay */}
      {showSessionDetails && selectedSession && (
        <SessionDetails
          session={selectedSession}
          project={project}
          isOpen={showSessionDetails}
          onClose={() => {
            setShowSessionDetails(false);
            setSelectedSession(null);
          }}
          theme={theme}
        />
      )}

      {/* Notifications Overlay */}
      {showNotifications && (
        <NotificationsPage
          projectName={projectName}
          isGlobal={isGlobalNotifications}
          onClose={() => setShowNotifications(false)}
          theme={theme}
        />
      )}

      {/* Document Chat Overlay */}
      {showDocumentChat && (
        <DocumentChat
          document={selectedDocument}
          isOpen={showDocumentChat}
          onClose={() => setShowDocumentChat(false)}
          theme={theme}
        />
      )}
    </div>
  );
}
