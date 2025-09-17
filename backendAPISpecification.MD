# Backend API Specification for Ford Falcon Portal

## Overview

This document specifies the backend API requirements for the Ford Falcon Portal frontend application. The APIs are designed to support all frontend functionality including project management, session tracking, document processing, and AI-powered features.

## Base Configuration

### Base URL
```
Production: https://api.ford-falcon.com/v1
Development: http://localhost:8000/v1
```

### Authentication
All APIs require Bearer token authentication:
```
Authorization: Bearer <jwt_token>
```

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid project data",
    "details": {}
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 1. Dashboard APIs

### 1.1 Get Dashboard Overview
**Endpoint:** `GET /dashboard/overview`

**Description:** Retrieves KPI metrics and summary data for the main dashboard

**Response:**
```json
{
  "success": true,
  "data": {
    "kpis": {
      "liveProjects": 12,
      "completedProjects": 23,
      "totalLoC": 1567350,
      "weeklyLoC": [
        {
          "week": "W-7",
          "loc": 98450
        },
        {
          "week": "W-6", 
          "loc": 134220
        }
      ]
    },
    "evaluationScores": [
      {
        "metric": "Document Comprehension",
        "score": 4.6,
        "target": 4.5
      },
      {
        "metric": "Capability Extraction",
        "score": 4.37,
        "target": 4.5
      }
    ],
    "stageDistribution": [
      {
        "stage": "Data Ingestion",
        "count": 3
      },
      {
        "stage": "Document Generation",
        "count": 5
      }
    ]
  }
}
```

### 1.2 Get Projects List
**Endpoint:** `GET /projects`

**Query Parameters:**
- `search` (string, optional): Search by project name or owner
- `risk` (string, optional): Filter by risk level (low/medium/high)
- `stage` (number, optional): Filter by pipeline stage (1-10)
- `owner` (string, optional): Filter by project owner
- `page` (number, optional): Page number for pagination
- `limit` (number, optional): Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "misc-001",
        "name": "MISC",
        "owner": "Ford Credit",
        "progress": 8,
        "risk": "low",
        "createdAt": "2024-01-15T09:30:00Z",
        "updatedAt": "2024-01-20T14:45:00Z",
        "currentStage": "Code Evaluation",
        "completionPercentage": 80
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 25,
      "totalPages": 2
    }
  }
}
```

### 1.3 Get Project Details
**Endpoint:** `GET /projects/{projectId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "misc-001",
    "name": "MISC",
    "owner": "Ford Credit",
    "description": "Mainframe Integration System Conversion",
    "progress": 8,
    "risk": "low",
    "currentStage": "Code Evaluation",
    "pipeline": {
      "stages": [
        {
          "stage": 1,
          "name": "Data Ingestion",
          "status": "completed",
          "completedAt": "2024-01-20T10:30:00Z"
        },
        {
          "stage": 2,
          "name": "Document Generation",
          "status": "completed",
          "completedAt": "2024-01-25T14:20:00Z"
        }
      ]
    },
    "evaluations": {
      "documentComprehension": 4.6,
      "capabilityExtraction": 4.37,
      "applicationAccuracy": 4.4,
      "cobolTechDesign": 4.3,
      "codeQuality": 4.5,
      "performance": 4.2
    },
    "artifacts": {
      "inputDocuments": 5,
      "comprehensionDocuments": 3,
      "capabilityDocuments": 1,
      "applicationDocuments": 1,
      "codeConversionDocuments": 4
    }
  }
}
```

### 1.4 Create New Project
**Endpoint:** `POST /projects`

**Request Body:**
```json
{
  "name": "NewProject",
  "description": "Description of the new project",
  "owner": "Ford IT",
  "risk": "low"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "newproject-001",
    "name": "NewProject",
    "description": "Description of the new project",
    "owner": "Ford IT",
    "progress": 1,
    "risk": "low",
    "currentStage": "Data Ingestion",
    "createdAt": "2024-01-21T10:00:00Z",
    "updatedAt": "2024-01-21T10:00:00Z",
    "status": "active"
  }
}
```

---

## 2. Session Management APIs

### 2.1 Get Session History
**Endpoint:** `GET /projects/{projectId}/sessions`

**Query Parameters:**
- `status` (string, optional): Filter by status (active/completed/incomplete)
- `startDate` (string, optional): Filter sessions from date (ISO format)
- `endDate` (string, optional): Filter sessions to date (ISO format)
- `page` (number, optional): Page number
- `limit` (number, optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "misc_001",
        "projectId": "misc-001",
        "startTime": "2024-01-15T09:30:00Z",
        "endTime": "2024-01-15T16:45:00Z",
        "finalStage": 7,
        "status": "incomplete",
        "totalStages": 11,
        "duration": "PT7H15M",
        "artifacts": {
          "inputDocs": [
            {
              "name": "COBOL_Source_Files.zip",
              "type": "codebase",
              "size": 2048576
            }
          ],
          "outputDocs": [
            {
              "name": "Comprehension_Analysis.pdf",
              "type": "comprehension",
              "size": 512000
            }
          ],
          "codeArtifacts": [
            {
              "name": "Java_Conversion_Phase1.zip",
              "type": "converted_code",
              "size": 1536000
            }
          ]
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

### 2.2 Create New Session
**Endpoint:** `POST /projects/{projectId}/sessions`

**Request Body:**
```json
{
  "name": "Session 2 - Code Conversion",
  "description": "Second session focusing on code conversion phase",
  "expectedDuration": "PT4H",
  "targetStages": [8, 9, 10]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "misc_002",
    "startTime": "2024-01-21T10:00:00Z",
    "status": "active"
  }
}
```

### 2.3 Get Session Details
**Endpoint:** `GET /sessions/{sessionId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "misc_001",
    "projectId": "misc-001",
    "name": "Initial Conversion Session",
    "description": "First session for MISC project conversion",
    "startTime": "2024-01-15T09:30:00Z",
    "endTime": "2024-01-15T16:45:00Z",
    "status": "incomplete",
    "currentStage": 7,
    "totalStages": 11,
    "progress": {
      "completedStages": 7,
      "currentStageProgress": 65,
      "estimatedTimeRemaining": "PT2H30M"
    },
    "artifacts": {
      "inputDocuments": [
        {
          "id": "doc_001",
          "name": "COBOL_Source_Files.zip",
          "type": "codebase",
          "description": "Complete COBOL source code files",
          "version": "v1.2",
          "uploadDate": "2024-01-15T09:30:00Z",
          "size": 2048576,
          "status": "processed"
        }
      ],
      "outputDocuments": [
        {
          "id": "doc_002",
          "name": "Comprehension_Analysis.pdf",
          "type": "comprehension",
          "description": "Comprehension analysis for MISC_MAIN.cbl",
          "generatedDate": "2024-01-15T11:45:00Z",
          "size": 512000,
          "evaluationScore": 4.6,
          "status": "approved"
        }
      ]
    },
    "evaluations": [
      {
        "stage": 3,
        "stageName": "Document Evaluation",
        "score": 4.6,
        "target": 4.5,
        "status": "above_threshold",
        "evaluatedAt": "2024-01-15T14:20:00Z"
      }
    ]
  }
}
```

---

## 3. Document Management APIs

### 3.1 Upload Documents
**Endpoint:** `POST /projects/{projectId}/documents/upload`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `files[]`: Array of files
- `documentType`: Type of document (codebase/user_manual/meeting_recording/fsa/other)
- `description`: Document description
- `version`: Document version

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadedDocuments": [
      {
        "id": "doc_001",
        "name": "COBOL_Source_Files.zip",
        "type": "codebase",
        "description": "Complete COBOL source code files",
        "version": "v1.2",
        "size": 2048576,
        "uploadDate": "2024-01-15T09:30:00Z",
        "status": "uploaded",
        "processingStatus": "queued"
      }
    ]
  }
}
```

### 3.2 Get Project Documents
**Endpoint:** `GET /projects/{projectId}/documents`

**Query Parameters:**
- `type` (string, optional): Filter by document type
- `status` (string, optional): Filter by processing status
- `category` (string, optional): Filter by category (input/comprehension/capability/application/code)

**Response:**
```json
{
  "success": true,
  "data": {
    "documents": {
      "inputDocuments": [
        {
          "id": "doc_001",
          "name": "COBOL_Source_Files.zip",
          "type": "codebase",
          "description": "Complete COBOL source code files",
          "version": "v1.2",
          "uploadDate": "2024-01-15T09:30:00Z",
          "size": 2048576,
          "status": "processed",
          "processingStatus": "completed"
        }
      ],
      "comprehensionDocuments": [
        {
          "id": "doc_002",
          "name": "MISC_File1_Comprehension.pdf",
          "description": "Comprehension analysis for MISC_MAIN.cbl",
          "generatedDate": "2024-01-15T11:45:00Z",
          "size": 512000,
          "evaluation": {
            "score": 4.6,
            "report": "MISC_File1_Evaluation.pdf",
            "status": "approved"
          }
        }
      ],
      "capabilityDocuments": [
        {
          "id": "doc_003",
          "name": "MISC_Capability_Analysis.pdf",
          "description": "Comprehensive capability analysis document",
          "generatedDate": "2024-01-16T10:20:00Z",
          "size": 768000,
          "evaluation": {
            "score": 4.3,
            "report": "MISC_Capability_Evaluation.pdf",
            "status": "pending_review"
          }
        }
      ]
    }
  }
}
```

### 3.3 Download Document
**Endpoint:** `GET /documents/{documentId}/download`

**Response:** File download with appropriate headers

### 3.4 Delete Document
**Endpoint:** `DELETE /documents/{documentId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Document deleted successfully"
  }
}
```

---

## 4. AI Document Chat APIs

### 4.1 Initialize Document Chat
**Endpoint:** `POST /documents/{documentId}/chat/initialize`

**Request Body:**
```json
{
  "sessionId": "chat_session_001",
  "context": "Focus on technical implementation details"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "chatSessionId": "chat_session_001",
    "documentContext": {
      "documentType": "comprehension",
      "keyTopics": ["COBOL", "Mainframe", "Business Logic"],
      "availableQueries": [
        "Explain the main business logic",
        "What are the key data structures?",
        "How does error handling work?"
      ]
    }
  }
}
```

### 4.2 Send Chat Message
**Endpoint:** `POST /documents/{documentId}/chat/message`

**Request Body:**
```json
{
  "chatSessionId": "chat_session_001",
  "message": "What is the main business logic in this COBOL program?",
  "messageType": "text" // or "voice"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "messageId": "msg_001",
    "response": {
      "text": "The main business logic in this COBOL program handles...",
      "markdown": "# Main Business Logic\n\nThe program implements...",
      "confidence": 0.92,
      "sources": [
        {
          "section": "PROCEDURE DIVISION",
          "line": 45,
          "content": "PERFORM PROCESS-BUSINESS-LOGIC"
        }
      ]
    },
    "timestamp": "2024-01-15T14:30:00Z"
  }
}
```

### 4.3 Get Chat History
**Endpoint:** `GET /documents/{documentId}/chat/history`

**Query Parameters:**
- `sessionId` (string, optional): Specific chat session
- `limit` (number, optional): Number of messages to retrieve

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_001",
        "role": "user",
        "content": "What is the main business logic?",
        "timestamp": "2024-01-15T14:25:00Z"
      },
      {
        "id": "msg_002",
        "role": "assistant",
        "content": "The main business logic handles...",
        "markdown": "# Main Business Logic\n\n...",
        "timestamp": "2024-01-15T14:30:00Z"
      }
    ]
  }
}
```

---

## 5. TTD Generation APIs

### 5.1 Initialize TTD Generation
**Endpoint:** `POST /projects/{projectId}/ttd/initialize`

**Request Body:**
```json
{
  "projectName": "MISC",
  "initiatedBy": "user_001",
  "version": "v1.0"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ttdId": "ttd_001",
    "projectId": "misc-001",
    "status": "initialized",
    "currentStage": "initial_questions",
    "createdAt": "2024-01-21T10:00:00Z",
    "version": "v1.0"
  }
}
```

### 5.2 Save TTD Stage Data
**Endpoint:** `PUT /ttd/{ttdId}/stages/{stageId}`

**Request Body:**
```json
{
  "stageId": "initial_questions",
  "formData": {
    "project_overview": "Legacy COBOL system for financial processing...",
    "business_context": "Handles customer account management...",
    "user_roles": "Bank tellers, customer service representatives...",
    "integration_points": "Core banking system, payment gateway...",
    "performance_requirements": "Must handle 1000+ concurrent users..."
  },
  "completedAt": "2024-01-21T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stageId": "initial_questions",
    "status": "completed",
    "nextStage": "capability_design",
    "progress": 12.5
  }
}
```

### 5.3 Get TTD Progress
**Endpoint:** `GET /ttd/{ttdId}/progress`

**Response:**
```json
{
  "success": true,
  "data": {
    "ttdId": "ttd_001",
    "projectId": "misc-001",
    "currentStage": "capability_design",
    "progress": 25,
    "completedStages": ["initial_questions"],
    "stages": [
      {
        "id": "initial_questions",
        "name": "Initial Questions",
        "status": "completed",
        "completedAt": "2024-01-21T10:30:00Z"
      },
      {
        "id": "capability_design",
        "name": "Capability Design Stage",
        "status": "in_progress",
        "startedAt": "2024-01-21T10:30:00Z"
      }
    ]
  }
}
```

### 5.4 Generate Final TTD Document
**Endpoint:** `POST /ttd/{ttdId}/generate`

**Request Body:**
```json
{
  "format": "pdf",
  "includeDiagrams": true,
  "template": "standard"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ttdId": "ttd_001",
    "documentId": "doc_ttd_001",
    "status": "generated",
    "downloadUrl": "/documents/doc_ttd_001/download",
    "generatedAt": "2024-01-21T12:00:00Z",
    "fileSize": 2048576,
    "sections": 8
  }
}
```

### 5.5 Get TTD Document
**Endpoint:** `GET /ttd/{ttdId}/document`

**Response:**
```json
{
  "success": true,
  "data": {
    "ttdId": "ttd_001",
    "projectId": "misc-001",
    "document": {
      "id": "doc_ttd_001",
      "name": "TTD_MISC_v1.0.pdf",
      "sections": [
        {
          "id": "initial_questions",
          "title": "Initial Questions",
          "content": "...",
          "completed": true
        },
        {
          "id": "capability_design",
          "title": "Capability Design Stage",
          "content": "...",
          "completed": true
        }
      ],
      "metadata": {
        "totalPages": 45,
        "wordCount": 12500,
        "generatedAt": "2024-01-21T12:00:00Z"
      }
    }
  }
}
```

### 5.6 Get Available SMEs
**Endpoint:** `GET /sme/available`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "rajan",
      "name": "Rajan Patel",
      "role": "Senior Technical Architect",
      "email": "rajan.patel@ford.com",
      "specializations": ["System Architecture", "Legacy Systems", "Integration"],
      "availability": "available"
    },
    {
      "id": "vardhini",
      "name": "Vardhini Sharma",
      "role": "Business Analyst",
      "email": "vardhini.sharma@ford.com",
      "specializations": ["Business Analysis", "Requirements", "Process Mapping"],
      "availability": "available"
    }
  ]
}
```

### 5.7 Send Questions to SMEs
**Endpoint:** `POST /ttd/{ttdId}/sme/questions`

**Request Body:**
```json
{
  "stageId": "initial_questions",
  "smeIds": ["rajan", "vardhini"],
  "questions": "Can you provide more details about the system architecture and integration points?",
  "priority": "medium",
  "requestedBy": "user_001"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "requestId": "req_001",
    "stageId": "initial_questions",
    "smeIds": ["rajan", "vardhini"],
    "questions": "Can you provide more details about the system architecture and integration points?",
    "status": "sent",
    "sentAt": "2024-01-21T10:30:00Z",
    "expectedResponseTime": "2024-01-22T10:30:00Z"
  }
}
```

### 5.8 Get SME Responses
**Endpoint:** `GET /ttd/{ttdId}/sme/responses`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "requestId": "req_001",
      "smeId": "rajan",
      "smeName": "Rajan Patel",
      "questions": "Can you provide more details about the system architecture?",
      "response": "The system uses a three-tier architecture with...",
      "respondedAt": "2024-01-21T14:30:00Z",
      "attachments": ["architecture_diagram.pdf"]
    }
  ]
}
```

### 5.9 Get Pre-filled TTD Data
**Endpoint:** `GET /ttd/{ttdId}/prefilled-data`

**Response:**
```json
{
  "success": true,
  "data": {
    "projectOverview": "The MISC system is a legacy COBOL application...",
    "businessContext": "The system supports several key business processes...",
    "userRoles": "Primary users include Ford Credit customer service representatives...",
    "integrationPoints": "The system integrates with external credit bureau services...",
    "performanceRequirements": "The system must handle 10,000+ concurrent users...",
    "sourceDocuments": [
      {
        "id": "doc_001",
        "name": "System Architecture Document",
        "type": "architecture",
        "extractedContent": "..."
      }
    ]
  }
}
```

---

## 6. AI Engine Management APIs

### 6.1 Start AI Engine
**Endpoint:** `POST /projects/{projectId}/engine/start`

**Request Body:**
```json
{
  "sessionId": "session_001",
  "mode": "automated", // or "manual"
  "targetStages": [8, 9, 10],
  "configuration": {
    "qualityThreshold": 4.5,
    "maxIterations": 6,
    "autoApprove": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "engineId": "engine_001",
    "status": "starting",
    "estimatedDuration": "PT2H30M",
    "currentStage": 8,
    "progress": 0
  }
}
```

### 5.2 Get Engine Status
**Endpoint:** `GET /engine/{engineId}/status`

**Response:**
```json
{
  "success": true,
  "data": {
    "engineId": "engine_001",
    "status": "running",
    "currentStage": 8,
    "stageProgress": 65,
    "overallProgress": 45,
    "currentOperation": "Code conversion in progress",
    "estimatedTimeRemaining": "PT1H45M",
    "iterations": [
      {
        "iteration": 1,
        "stage": 8,
        "score": 3.2,
        "threshold": 4.5,
        "status": "below_threshold",
        "timestamp": "2024-01-15T15:00:00Z"
      }
    ]
  }
}
```

### 5.3 Stop AI Engine
**Endpoint:** `POST /engine/{engineId}/stop`

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "stopped",
    "finalProgress": 45,
    "completedStages": [8],
    "artifactsGenerated": 3
  }
}
```

---

## 6. Evaluation & Quality APIs

### 6.1 Get Evaluation Results
**Endpoint:** `GET /projects/{projectId}/evaluations`

**Query Parameters:**
- `stage` (number, optional): Filter by pipeline stage
- `type` (string, optional): Filter by evaluation type (document/code)

**Response:**
```json
{
  "success": true,
  "data": {
    "evaluations": [
      {
        "id": "eval_001",
        "stage": 3,
        "stageName": "Document Evaluation",
        "type": "document",
        "metric": "Document Comprehension",
        "score": 4.6,
        "target": 4.5,
        "status": "above_threshold",
        "evaluatedAt": "2024-01-15T14:20:00Z",
        "evaluator": "AI_System",
        "details": {
          "accuracy": 0.92,
          "completeness": 0.88,
          "clarity": 0.95
        }
      }
    ],
    "summary": {
      "averageScore": 4.4,
      "targetScore": 4.5,
      "passingEvaluations": 4,
      "totalEvaluations": 6
    }
  }
}
```

### 6.2 Submit SME Review
**Endpoint:** `POST /evaluations/{evaluationId}/sme-review`

**Request Body:**
```json
{
  "smeId": "sme_001",
  "approval": true,
  "comments": "Document meets quality standards",
  "recommendations": "Consider adding more examples"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reviewId": "review_001",
    "status": "approved",
    "reviewedAt": "2024-01-15T16:00:00Z"
  }
}
```

---

## 7. Notification APIs

### 7.1 Get Notifications
**Endpoint:** `GET /notifications`

**Query Parameters:**
- `type` (string, optional): Filter by notification type
- `read` (boolean, optional): Filter by read status
- `projectId` (string, optional): Filter by project
- `page` (number, optional): Page number
- `limit` (number, optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_001",
        "type": "project_update",
        "title": "Project MISC Stage Completed",
        "message": "Document Evaluation stage has been completed successfully",
        "projectId": "misc-001",
        "projectName": "MISC",
        "read": false,
        "createdAt": "2024-01-15T14:30:00Z",
        "priority": "medium"
      }
    ],
    "unreadCount": 5,
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 25,
      "totalPages": 2
    }
  }
}
```

### 7.2 Mark Notification as Read
**Endpoint:** `PUT /notifications/{notificationId}/read`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Notification marked as read"
  }
}
```

### 7.3 Mark All Notifications as Read
**Endpoint:** `PUT /notifications/read-all`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "All notifications marked as read",
    "updatedCount": 5
  }
}
```

---

## 8. Analytics & Reporting APIs

### 8.1 Get Project Analytics
**Endpoint:** `GET /analytics/projects/{projectId}`

**Query Parameters:**
- `startDate` (string, optional): Start date for analytics
- `endDate` (string, optional): End date for analytics
- `metrics` (string, optional): Comma-separated list of metrics

**Response:**
```json
{
  "success": true,
  "data": {
    "projectId": "misc-001",
    "timeframe": {
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-01-31T23:59:59Z"
    },
    "metrics": {
      "totalSessions": 3,
      "totalDuration": "PT15H30M",
      "averageSessionDuration": "PT5H10M",
      "documentsProcessed": 15,
      "codeLinesConverted": 45000,
      "qualityScore": 4.4,
      "completionRate": 80
    },
    "timeline": [
      {
        "date": "2024-01-15",
        "sessions": 1,
        "documentsProcessed": 5,
        "progress": 20
      }
    ],
    "qualityTrends": [
      {
        "stage": "Document Comprehension",
        "scores": [4.2, 4.4, 4.6],
        "trend": "improving"
      }
    ]
  }
}
```

### 8.2 Get Global Analytics
**Endpoint:** `GET /analytics/global`

**Query Parameters:**
- `timeframe` (string, optional): Timeframe for analytics (week/month/quarter/year)

**Response:**
```json
{
  "success": true,
  "data": {
    "timeframe": "month",
    "overview": {
      "totalProjects": 25,
      "activeProjects": 12,
      "completedProjects": 13,
      "totalLoC": 1567350,
      "averageQualityScore": 4.3
    },
    "performance": {
      "averageProjectDuration": "PT45H",
      "averageCompletionRate": 85,
      "successRate": 92
    },
    "trends": {
      "projectsStarted": [3, 5, 4, 6],
      "projectsCompleted": [2, 4, 3, 5],
      "qualityScores": [4.1, 4.2, 4.3, 4.4]
    }
  }
}
```

---

## 9. User Management APIs

### 9.1 Get User Profile
**Endpoint:** `GET /user/profile`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_001",
    "email": "user@ford.com",
    "name": "John Doe",
    "role": "project_manager",
    "department": "IT",
    "permissions": [
      "view_projects",
      "edit_projects",
      "manage_sessions",
      "approve_documents"
    ],
    "preferences": {
      "theme": "professional",
      "notifications": {
        "email": true,
        "push": true,
        "frequency": "immediate"
      }
    }
  }
}
```

### 9.2 Update User Preferences
**Endpoint:** `PUT /user/preferences`

**Request Body:**
```json
{
  "theme": "vibrant",
  "notifications": {
    "email": true,
    "push": false,
    "frequency": "daily"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Preferences updated successfully"
  }
}
```

---

## 10. Error Codes

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Application Error Codes
- `PROJECT_NOT_FOUND` - Project does not exist
- `SESSION_NOT_FOUND` - Session does not exist
- `DOCUMENT_NOT_FOUND` - Document does not exist
- `INVALID_DOCUMENT_TYPE` - Unsupported document type
- `ENGINE_ALREADY_RUNNING` - AI engine is already active
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `VALIDATION_ERROR` - Request data validation failed
- `FILE_TOO_LARGE` - Uploaded file exceeds size limit
- `UNSUPPORTED_FILE_TYPE` - File type not supported
- `ENGINE_ERROR` - AI engine encountered an error

---

## 11. WebSocket Events

### Real-time Updates
**WebSocket URL:** `wss://api.ford-falcon.com/v1/ws`

### Event Types

#### Project Updates
```json
{
  "type": "project_update",
  "data": {
    "projectId": "misc-001",
    "stage": 8,
    "progress": 65,
    "status": "in_progress"
  }
}
```

#### Engine Status
```json
{
  "type": "engine_status",
  "data": {
    "engineId": "engine_001",
    "status": "running",
    "progress": 45,
    "currentOperation": "Code conversion in progress"
  }
}
```

#### Notifications
```json
{
  "type": "notification",
  "data": {
    "id": "notif_001",
    "type": "project_update",
    "title": "Stage Completed",
    "message": "Document Evaluation completed"
  }
}
```

---

## 12. Rate Limiting

### Limits
- **API Calls:** 1000 requests per hour per user
- **File Uploads:** 10 files per minute per user
- **Chat Messages:** 100 messages per hour per user
- **Engine Starts:** 5 starts per hour per user

### Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1642248000
```

---

## 13. File Upload Specifications

### Supported File Types
- **Documents:** PDF, DOCX, TXT, RTF
- **Code:** ZIP, RAR, TAR.GZ
- **Audio:** MP3, WAV, M4A
- **Images:** PNG, JPG, JPEG, GIF

### File Size Limits
- **Documents:** 50MB per file
- **Code Archives:** 500MB per file
- **Audio Files:** 100MB per file
- **Images:** 10MB per file

### Processing Status
- `uploaded` - File uploaded successfully
- `processing` - File being processed
- `completed` - Processing completed
- `failed` - Processing failed
- `queued` - Waiting for processing

---

This API specification provides a comprehensive backend interface for all frontend functionality in the Ford Falcon Portal. The APIs support real-time updates, file management, AI-powered features, and comprehensive project tracking capabilities.
