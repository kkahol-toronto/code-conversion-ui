import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, Edit3, Save, RotateCcw, Download, MessageSquare, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Mock document content for demonstration
const MOCK_DOCUMENT_CONTENT = {
  "MISC_File1_Comprehension.pdf": `# MISC_MAIN.cbl - Comprehension Analysis

## Overview
This document provides a comprehensive analysis of the MISC_MAIN.cbl file, which serves as the primary entry point for the MISC (Miscellaneous) system.

## File Structure
- **Program Name**: MISC_MAIN
- **Language**: COBOL
- **Lines of Code**: 1,247
- **Complexity**: Medium

## Main Functions

### 1. Program Initialization
The program begins with standard COBOL initialization procedures:
- Sets up working storage
- Initializes data structures
- Establishes database connections

### 2. Menu Processing
The main menu system handles user navigation:
- Displays available options
- Validates user input
- Routes to appropriate subroutines

### 3. Data Processing
Core business logic includes:
- Customer data validation
- Transaction processing
- Report generation

## Key Variables

### Working Storage
\`\`\`cobol
01  WS-CUSTOMER-ID    PIC X(10).
01  WS-TRANSACTION-AMT PIC 9(10)V99.
01  WS-STATUS-CODE    PIC X(2).
\`\`\`

### Linkage Section
\`\`\`cobol
01  LS-PARAMETERS.
    05  LS-FUNCTION-CODE PIC X(2).
    05  LS-RETURN-CODE   PIC X(2).
\`\`\`

## Business Rules

1. **Customer Validation**
   - Customer ID must be 10 characters
   - Must exist in customer master file
   - Status must be 'AC' (Active)

2. **Transaction Processing**
   - Amount must be positive
   - Cannot exceed credit limit
   - Requires authorization for amounts > $10,000

3. **Error Handling**
   - All errors logged to system log
   - User receives appropriate error messages
   - Program continues processing when possible

## Integration Points

### Database Tables
- CUSTOMER-MASTER
- TRANSACTION-HISTORY
- SYSTEM-LOG

### External Programs
- MISC-VALIDATE
- MISC-REPORT
- MISC-AUDIT

## Performance Considerations

- Uses indexed database access
- Implements cursor-based processing
- Optimized for batch operations

## Security Features

- Input validation on all user data
- Authorization checks for sensitive operations
- Audit trail for all transactions

## Maintenance Notes

- Last updated: 2024-01-15
- Version: 2.1.3
- Responsible team: Ford Credit IT

## Future Enhancements

1. **API Integration**
   - RESTful service endpoints
   - JSON data format support
   - Real-time processing capabilities

2. **Performance Improvements**
   - Parallel processing for batch operations
   - Caching mechanisms
   - Database query optimization

3. **Security Enhancements**
   - Multi-factor authentication
   - Encryption for sensitive data
   - Advanced audit logging
`,

  "MISC_Capability_Analysis.pdf": `# MISC System Capability Analysis

## System Overview
The MISC (Miscellaneous) system is a comprehensive financial processing platform designed to handle various customer transactions and account management functions.

## Core Capabilities

### 1. Customer Management
- **Account Creation**: New customer account setup with validation
- **Profile Updates**: Modify customer information and preferences
- **Status Management**: Track account status (Active, Suspended, Closed)
- **Document Management**: Store and retrieve customer documents

### 2. Transaction Processing
- **Payment Processing**: Handle various payment types (ACH, Credit Card, Wire)
- **Fund Transfers**: Internal and external account transfers
- **Fee Assessment**: Automatic fee calculation and application
- **Reconciliation**: Daily transaction reconciliation

### 3. Reporting and Analytics
- **Standard Reports**: Monthly statements, transaction history
- **Custom Reports**: Ad-hoc reporting capabilities
- **Data Export**: Multiple format support (PDF, CSV, XML)
- **Analytics Dashboard**: Real-time performance metrics

## System Architecture

### Frontend Components
- Web-based user interface
- Mobile-responsive design
- Real-time notifications
- Interactive dashboards

### Backend Services
- RESTful API services
- Message queuing system
- Batch processing engine
- Data warehousing

### Integration Layer
- Database connectivity
- External system interfaces
- File transfer protocols
- API gateways

## Data Flow

### 1. Input Processing
1. User submits transaction request
2. System validates input data
3. Performs business rule checks
4. Generates transaction ID

### 2. Processing Pipeline
1. Queues transaction for processing
2. Executes business logic
3. Updates account balances
4. Generates confirmations

### 3. Output Generation
1. Creates transaction records
2. Sends notifications
3. Updates reports
4. Archives data

## Business Rules Engine

### Validation Rules
- **Data Format**: Ensures proper data types and formats
- **Business Logic**: Applies domain-specific rules
- **Authorization**: Checks user permissions
- **Compliance**: Validates regulatory requirements

### Processing Rules
- **Routing**: Directs transactions to appropriate handlers
- **Pricing**: Calculates fees and charges
- **Limits**: Enforces transaction limits
- **Timing**: Manages processing schedules

## Security Framework

### Authentication
- Multi-factor authentication
- Single sign-on integration
- Session management
- Password policies

### Authorization
- Role-based access control
- Permission matrix
- Resource-level security
- Audit logging

### Data Protection
- Encryption at rest and in transit
- Data masking for sensitive fields
- Backup and recovery procedures
- Compliance monitoring

## Performance Metrics

### Response Times
- Web interface: < 2 seconds
- API calls: < 500ms
- Batch processing: < 4 hours
- Report generation: < 30 seconds

### Throughput
- Concurrent users: 1,000+
- Transactions per second: 100+
- Daily volume: 50,000+ transactions
- Peak capacity: 200% of normal load

## Error Handling

### Exception Management
- Graceful degradation
- Automatic retry mechanisms
- Error logging and monitoring
- User-friendly error messages

### Recovery Procedures
- Transaction rollback capabilities
- Data consistency checks
- System health monitoring
- Disaster recovery plans

## Monitoring and Alerting

### System Health
- Real-time performance monitoring
- Resource utilization tracking
- Error rate monitoring
- Capacity planning

### Business Metrics
- Transaction success rates
- User activity patterns
- Revenue impact analysis
- Customer satisfaction scores

## Future Roadmap

### Phase 1 (Q2 2024)
- Enhanced mobile capabilities
- Real-time notifications
- Advanced analytics

### Phase 2 (Q3 2024)
- AI-powered fraud detection
- Predictive analytics
- Automated workflows

### Phase 3 (Q4 2024)
- Blockchain integration
- Advanced security features
- Global expansion support
`
};

// Mock LLM responses
const MOCK_LLM_RESPONSES = {
  "What is the main purpose of MISC_MAIN.cbl?": "The MISC_MAIN.cbl file serves as the primary entry point for the MISC (Miscellaneous) system. It handles program initialization, menu processing, and core data processing functions including customer data validation, transaction processing, and report generation. It's essentially the main controller program that orchestrates all the business operations for the MISC system.",
  
  "How does the system handle customer validation?": "The system handles customer validation through several key rules:\n\n1. **Customer ID Validation**: Must be exactly 10 characters long\n2. **Existence Check**: Customer must exist in the customer master file\n3. **Status Verification**: Customer status must be 'AC' (Active)\n\nThese validations are performed in the MISC-VALIDATE subroutine and any failures result in appropriate error messages being returned to the user.",
  
  "What are the security features implemented?": "The MISC system implements several security features:\n\n1. **Input Validation**: All user data is validated before processing\n2. **Authorization Checks**: Sensitive operations require proper authorization\n3. **Audit Trail**: All transactions are logged for audit purposes\n4. **Error Logging**: All errors are logged to the system log\n5. **Status Tracking**: Program continues processing when possible while maintaining security",
  
  "Explain the transaction processing flow": "The transaction processing flow in MISC_MAIN.cbl follows this sequence:\n\n1. **Input Validation**: Validates customer ID and transaction amount\n2. **Business Rule Checks**: Ensures amount is positive and within credit limits\n3. **Authorization**: Requires authorization for amounts > $10,000\n4. **Processing**: Executes the actual transaction logic\n5. **Database Update**: Updates relevant database tables\n6. **Confirmation**: Generates confirmation messages\n7. **Logging**: Records transaction in audit trail",
  
  "What database tables does the system use?": "The MISC system integrates with three main database tables:\n\n1. **CUSTOMER-MASTER**: Stores customer information and account details\n2. **TRANSACTION-HISTORY**: Records all transaction data and timestamps\n3. **SYSTEM-LOG**: Maintains audit trail and error logs\n\nThe system uses indexed database access for optimal performance and implements cursor-based processing for handling large datasets efficiently."
};

export default function DocumentChat({ document, isOpen, onClose, theme }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  // Get document content
  const documentContent = MOCK_DOCUMENT_CONTENT[document?.name] || 'Document content not available.';

  useEffect(() => {
    if (isOpen) {
      setEditedContent(documentContent);
      setMessages([
        {
          id: 1,
          type: 'assistant',
          content: `Hello! I'm here to help you with the **${document?.name}** document. You can ask me questions about the content, request edits, or I can help you understand specific sections. What would you like to know?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, document]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate LLM response
    setTimeout(() => {
      const response = MOCK_LLM_RESPONSES[inputMessage] || 
        `I understand you're asking about "${inputMessage}". Based on the document content, I can help you with that. The document contains comprehensive information about the MISC system, including its architecture, business rules, and implementation details. Could you please be more specific about what aspect you'd like me to explain or help you with?`;
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSave = () => {
    // In a real implementation, this would save to the backend
    setIsEditing(false);
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'assistant',
      content: '✅ Document has been saved successfully!',
      timestamp: new Date()
    }]);
  };

  const handleReset = () => {
    setEditedContent(documentContent);
    setIsEditing(false);
  };

  const handleDownload = () => {
    const blob = new Blob([editedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = document?.name?.replace('.pdf', '.md') || 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`${theme.colors.card} rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden border ${theme.colors.border} flex flex-col`}
      >
        {/* Header */}
        <div className={`p-6 border-b ${theme.colors.border} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${theme.colors.accent} text-white`}>
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${theme.colors.text}`}>
                Query & Edit: {document?.name}
              </h2>
              <p className={`text-sm ${theme.colors.textMuted}`}>
                Chat with AI assistant and edit document content
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className={`p-2 rounded-lg ${theme.name === "Vibrant" ? "bg-white/20 hover:bg-white/30" : "bg-gray-100 hover:bg-gray-200"} transition-colors`}
              title="Download Document"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${theme.name === "Vibrant" ? "bg-white/20 hover:bg-white/30" : "bg-gray-100 hover:bg-gray-200"} transition-colors`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Document Panel */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            <div className={`p-4 border-b ${theme.colors.border} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className={`font-medium ${theme.colors.text}`}>Document Content</span>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${theme.colors.accent} text-white ${theme.colors.accentHover} transition-colors`}
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleReset}
                      className={`px-3 py-1 rounded-lg text-sm font-medium border ${theme.colors.border} ${theme.colors.text} hover:bg-gray-100 transition-colors`}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium border ${theme.colors.border} ${theme.colors.text} hover:bg-gray-100 transition-colors`}
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {isEditing ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className={`w-full h-full p-4 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.colors.text} ${theme.name === "Vibrant" ? "bg-white/20" : "bg-white"} font-mono text-sm resize-none`}
                  placeholder="Edit document content..."
                />
              ) : (
                <div className={`prose prose-sm max-w-none ${theme.name === "Vibrant" ? "prose-invert" : ""}`}>
                  <ReactMarkdown>{editedContent}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>

          {/* Chat Panel */}
          <div className="w-1/2 flex flex-col">
            <div className={`p-4 border-b ${theme.colors.border}`}>
              <h3 className={`font-medium ${theme.colors.text}`}>AI Assistant</h3>
              <p className={`text-sm ${theme.colors.textMuted}`}>
                Ask questions about the document or request edits
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.type === 'user'
                        ? `${theme.colors.accent} text-white`
                        : theme.name === "Vibrant"
                          ? "bg-white/20 text-white border border-white/30"
                          : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-1 ${message.type === 'user' ? 'text-white/70' : theme.colors.textMuted}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    theme.name === "Vibrant" ? "bg-white/20 text-white border border-white/30" : "bg-gray-100 text-gray-900"
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-4 border-t ${theme.colors.border}`}>
              <div className="flex items-center gap-2">
                <button
                  className={`p-2 rounded-lg ${theme.name === "Vibrant" ? "bg-white/20 hover:bg-white/30" : "bg-gray-100 hover:bg-gray-200"} transition-colors`}
                  title="Voice Input"
                >
                  <Mic className="h-4 w-4" />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    ref={chatInputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question about the document..."
                    className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.colors.text} ${theme.name === "Vibrant" ? "bg-white/20" : "bg-white"} resize-none`}
                    rows="1"
                    style={{ minHeight: '40px', maxHeight: '120px' }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className={`p-2 rounded-lg ${theme.colors.accent} text-white ${theme.colors.accentHover} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
