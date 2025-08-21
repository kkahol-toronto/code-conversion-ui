import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, FileText, Code, Users, Clock, Zap, ChevronRight, X } from 'lucide-react';

const REQUIRED_DOCUMENT_CATEGORIES = [
  {
    category: "Code & Technical",
    documents: [
      "Source code files (COBOL, JCL, etc.)",
      "Database schemas and scripts",
      "Configuration files",
      "Build and deployment scripts"
    ],
    icon: <Code className="h-5 w-5" />,
    color: "from-blue-500 to-blue-600"
  },
  {
    category: "User Documentation",
    documents: [
      "User manuals and guides",
      "UI screenshots and mockups",
      "User workflows and processes",
      "Training materials"
    ],
    icon: <FileText className="h-5 w-5" />,
    color: "from-green-500 to-green-600"
  },
  {
    category: "Business & Requirements",
    documents: [
      "Business requirement documents (BRD)",
      "Functional specification documents",
      "Meeting recordings (MP3) discussing features",
      "Process flow diagrams",
      "Business rules and logic documentation"
    ],
    icon: <Users className="h-5 w-5" />,
    color: "from-purple-500 to-purple-600"
  },
  {
    category: "System & Architecture",
    documents: [
      "System architecture diagrams",
      "Integration documentation",
      "API specifications",
      "Performance requirements",
      "Security requirements"
    ],
    icon: <Clock className="h-5 w-5" />,
    color: "from-orange-500 to-orange-600"
  }
];

export default function ConfirmationPage({ 
  project, 
  inputDocuments, 
  onConfirm, 
  onCancel, 
  theme 
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Analyze input documents to determine what's provided vs missing
  const analyzeDocuments = () => {
    const analysis = {
      provided: [],
      missing: [],
      totalRequired: 0,
      totalProvided: 0
    };

    REQUIRED_DOCUMENT_CATEGORIES.forEach(category => {
      category.documents.forEach(doc => {
        analysis.totalRequired++;
        
        // Check if this type of document is provided
        const isProvided = inputDocuments.some(inputDoc => {
          const inputType = inputDoc.type;
          const docLower = doc.toLowerCase();
          
          if (docLower.includes('source code') || docLower.includes('cobol') || docLower.includes('jcl')) {
            return inputType === 'codebase';
          }
          if (docLower.includes('user manual') || docLower.includes('user guide')) {
            return inputType === 'user_manual';
          }
          if (docLower.includes('meeting recording') || docLower.includes('mp3')) {
            return inputType === 'meeting_recording';
          }
          if (docLower.includes('functional specification') || docLower.includes('fsa')) {
            return inputType === 'fsa';
          }
          // For other documents, consider them provided if we have any document
          return true;
        });

        if (isProvided) {
          analysis.provided.push(doc);
          analysis.totalProvided++;
        } else {
          analysis.missing.push(doc);
        }
      });
    });

    return analysis;
  };

  const documentAnalysis = analyzeDocuments();
  const coveragePercentage = Math.round((documentAnalysis.totalProvided / documentAnalysis.totalRequired) * 100);
  const hasMissingDocuments = documentAnalysis.missing.length > 0;

  const handleConfirm = () => {
    if (hasMissingDocuments && !confirmed) {
      setShowWarning(true);
      return;
    }
    onConfirm();
  };

  const handleProceedAnyway = () => {
    setConfirmed(true);
    setShowWarning(false);
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`${theme.colors.card} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border ${theme.colors.border}`}
      >
        {/* Header */}
        <div className={`p-6 border-b ${theme.colors.border}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${theme.colors.text}`}>Ready to Put the Pedal to the Metal?</h2>
                <p className={`text-sm ${theme.colors.textMuted}`}>Confirm your input documents and proceed with {project.name}</p>
              </div>
            </div>
            <button 
              onClick={onCancel}
              className={`p-2 rounded-xl hover:bg-gray-100 transition-colors ${theme.colors.text}`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-200px)]">
          {/* Document Coverage Summary */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${theme.colors.text}`}>Document Coverage</h3>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${theme.colors.textMuted}`}>
                  {documentAnalysis.totalProvided} of {documentAnalysis.totalRequired} document types provided
                </span>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  coveragePercentage >= 80 ? 
                    (theme.name === "Vibrant" ? 'bg-green-600/30 text-green-300' : 'bg-green-100 text-green-800') :
                  coveragePercentage >= 60 ?
                    (theme.name === "Vibrant" ? 'bg-yellow-600/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800') :
                    (theme.name === "Vibrant" ? 'bg-red-600/30 text-red-300' : 'bg-red-100 text-red-800')
                }`}>
                  {coveragePercentage}% Complete
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${coveragePercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-3 rounded-full ${
                  coveragePercentage >= 80 ? 'bg-green-500' :
                  coveragePercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              />
            </div>

            {/* Warning for missing documents */}
            {hasMissingDocuments && (
              <div className={`p-4 rounded-xl border-2 border-yellow-500/30 bg-yellow-500/10 mb-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className={`font-semibold ${theme.colors.text}`}>Missing Documents Detected</span>
                </div>
                <p className={`text-sm ${theme.colors.textSecondary}`}>
                  Some recommended documents are missing. While you can proceed with just the codebase, 
                  providing additional documentation like user manuals, meeting recordings, and business 
                  requirements will significantly improve the quality of the converted code.
                </p>
              </div>
            )}
          </div>

          {/* Document Categories */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {REQUIRED_DOCUMENT_CATEGORIES.map((category, index) => {
              const categoryDocs = category.documents;
              const providedDocs = categoryDocs.filter(doc => 
                documentAnalysis.provided.includes(doc)
              );
              const missingDocs = categoryDocs.filter(doc => 
                documentAnalysis.missing.includes(doc)
              );

              return (
                <div key={index} className={`p-4 rounded-xl border ${theme.colors.border} ${
                  theme.name === "Vibrant" ? "bg-white/10" : "bg-gray-50"
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color} text-white`}>
                      {category.icon}
                    </div>
                    <div>
                      <h4 className={`font-semibold ${theme.colors.text}`}>{category.category}</h4>
                      <p className={`text-xs ${theme.colors.textMuted}`}>
                        {providedDocs.length} of {categoryDocs.length} provided
                      </p>
                    </div>
                  </div>

                  {/* Provided Documents */}
                  {providedDocs.length > 0 && (
                    <div className="mb-3">
                      <h5 className={`text-sm font-medium ${theme.colors.text} mb-2 flex items-center gap-1`}>
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Provided
                      </h5>
                      <ul className="space-y-1">
                        {providedDocs.map((doc, docIndex) => (
                          <li key={docIndex} className={`text-xs ${theme.colors.textSecondary} flex items-center gap-2`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Missing Documents */}
                  {missingDocs.length > 0 && (
                    <div>
                      <h5 className={`text-sm font-medium ${theme.colors.text} mb-2 flex items-center gap-1`}>
                        <AlertTriangle className="h-3 w-3 text-yellow-500" />
                        Missing (Optional)
                      </h5>
                      <ul className="space-y-1">
                        {missingDocs.map((doc, docIndex) => (
                          <li key={docIndex} className={`text-xs ${theme.colors.textMuted} flex items-center gap-2`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Current Input Documents */}
          <div className="mb-6">
            <h3 className={`text-lg font-semibold ${theme.colors.text} mb-4`}>Your Input Documents</h3>
            <div className="grid gap-3">
              {inputDocuments.map((doc, index) => (
                <div key={index} className={`p-3 rounded-lg border ${theme.colors.border} ${
                  theme.name === "Vibrant" ? "bg-white/10" : "bg-gray-50"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doc.type === "codebase" ? (theme.name === "Vibrant" ? "bg-blue-600/30 text-blue-300" : "bg-blue-100 text-blue-800") :
                        doc.type === "user_manual" ? (theme.name === "Vibrant" ? "bg-green-600/30 text-green-300" : "bg-green-100 text-green-800") :
                        doc.type === "meeting_recording" ? (theme.name === "Vibrant" ? "bg-purple-600/30 text-purple-300" : "bg-purple-100 text-purple-800") :
                        doc.type === "fsa" ? (theme.name === "Vibrant" ? "bg-orange-600/30 text-orange-300" : "bg-orange-100 text-orange-800") :
                        (theme.name === "Vibrant" ? "bg-gray-600/30 text-gray-300" : "bg-gray-100 text-gray-800")
                      }`}>
                        {doc.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <div>
                        <h4 className={`font-medium ${theme.colors.text}`}>{doc.name}</h4>
                        <p className={`text-xs ${theme.colors.textMuted}`}>{doc.description}</p>
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`p-6 border-t ${theme.colors.border} flex items-center justify-between`}>
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${theme.colors.border} ${theme.colors.text} hover:bg-gray-100 transition-colors`}
          >
            Cancel
          </button>
          
          <div className="flex items-center gap-3">
            {hasMissingDocuments && (
              <div className={`text-sm ${theme.colors.textMuted} text-right`}>
                <p>Missing documents may reduce conversion quality</p>
                <p>You can add more documents later</p>
              </div>
            )}
            
            <button
              onClick={handleConfirm}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 ${
                theme.name === "Vibrant"
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700'
                  : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700'
              }`}
            >
              <Zap className="h-5 w-5" />
              Put the Pedal to the Metal
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Warning Modal */}
        {showWarning && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${theme.colors.card} rounded-2xl shadow-2xl max-w-md w-full border ${theme.colors.border} p-6`}
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                <h3 className={`text-lg font-semibold ${theme.colors.text}`}>Missing Documents Warning</h3>
              </div>
              
              <p className={`${theme.colors.textSecondary} mb-6`}>
                You're proceeding with only {coveragePercentage}% of recommended documents. 
                This may result in lower quality converted code. Are you sure you want to continue?
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowWarning(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border ${theme.colors.border} ${theme.colors.text} hover:bg-gray-100 transition-colors`}
                >
                  Go Back
                </button>
                <button
                  onClick={handleProceedAnyway}
                  className={`px-4 py-2 rounded-lg text-sm font-medium bg-yellow-600 text-white hover:bg-yellow-700 transition-colors`}
                >
                  Proceed Anyway
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
