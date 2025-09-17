import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import mermaid from 'mermaid';
import { 
  ArrowLeft, ArrowRight, CheckCircle, Clock, FileText, Code, 
  Database, TestTube, Settings, Users, Target, Download, 
  User, Send, MessageSquare, Edit3, Save, Play, Eye, 
  FileCheck, BookOpen, Code2, FileInput,
  Scroll, FileSearch, Plus, X, ChevronDown, ChevronUp, Bot, Paperclip,
  Bell, AlertCircle, CheckCircle2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Custom Mermaid Component
const MermaidDiagram = ({ chart }) => {
  const ref = useRef(null);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize Mermaid once
    if (!isInitialized) {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          themeVariables: {
            primaryColor: '#3b82f6',
            primaryTextColor: '#1f2937',
            primaryBorderColor: '#3b82f6',
            lineColor: '#6b7280',
            secondaryColor: '#f3f4f6',
            tertiaryColor: '#ffffff'
          },
          securityLevel: 'loose',
          fontFamily: 'Arial, sans-serif'
        });
        setIsInitialized(true);
        console.log('Mermaid initialized successfully');
      } catch (err) {
        console.error('Mermaid initialization error:', err);
        setError('Failed to initialize Mermaid: ' + err.message);
      }
    }
  }, [isInitialized]);

  useEffect(() => {
    if (chart && isInitialized) {
      console.log('MermaidDiagram: Rendering chart:', chart.substring(0, 100) + '...');
      
      const renderDiagram = async () => {
        try {
          const id = 'mermaid-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
          console.log('MermaidDiagram: Using ID:', id);
          
          const { svg } = await mermaid.render(id, chart);
          console.log('MermaidDiagram: Successfully rendered SVG');
          setSvg(svg);
          setError('');
        } catch (err) {
          console.error('Mermaid render error:', err);
          setError('Failed to render diagram: ' + err.message);
        }
      };

      renderDiagram();
    }
  }, [chart, isInitialized]);

  if (error) {
    return (
      <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm">Diagram Error: {error}</p>
        <details className="mt-2">
          <summary className="text-red-600 text-xs cursor-pointer">Show chart code</summary>
          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">{chart}</pre>
        </details>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="my-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-600 text-sm">Initializing diagram engine...</p>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="my-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-600 text-sm">Loading diagram...</p>
        <div className="mt-2 text-xs text-gray-600">
          <details>
            <summary className="cursor-pointer">Show chart code</summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">{chart}</pre>
          </details>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={ref}
      className="my-4 flex justify-center overflow-x-auto border border-gray-200 rounded-lg p-4 bg-white"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

// SME (Subject Matter Expert) data
const SME_OPTIONS = [
  { id: 'rajan', name: 'Rajan Patel', role: 'Senior Technical Architect', email: 'rajan.patel@ford.com' },
  { id: 'vardhini', name: 'Vardhini Sharma', role: 'Business Analyst', email: 'vardhini.sharma@ford.com' },
  { id: 'siddharth', name: 'Siddharth Kumar', role: 'System Integration Specialist', email: 'siddharth.kumar@ford.com' },
  { id: 'deepak', name: 'Deepak Singh', role: 'Data Migration Expert', email: 'deepak.singh@ford.com' },
  { id: 'pooja', name: 'Pooja Mehta', role: 'Legacy Systems Expert', email: 'pooja.mehta@ford.com' }
];

// Document categories and mock documents
const DOCUMENT_CATEGORIES = [
  {
    id: 'capability_comprehensions',
    name: 'Capability Comprehensions',
    icon: <FileCheck className="h-5 w-5" />,
    description: 'MISC system capability documentation',
    documents: [
      { id: 'cc_001', name: 'Data Processing Capability', type: 'pdf', size: '2.3 MB' },
      { id: 'cc_002', name: 'Data Transmission Capability', type: 'pdf', size: '1.8 MB' },
      { id: 'cc_003', name: 'Year End Processing Capability', type: 'pdf', size: '2.1 MB' }
    ]
  },
  {
    id: 'application_comprehensions',
    name: 'Application Comprehensions',
    icon: <BookOpen className="h-5 w-5" />,
    description: 'Application-level understanding documents',
    documents: [
      { id: 'ac_001', name: 'MISC Application Overview', type: 'pdf', size: '3.2 MB' },
      { id: 'ac_002', name: 'Application Architecture Document', type: 'pdf', size: '2.8 MB' }
    ]
  },
  {
    id: 'code_comprehensions',
    name: 'Code Comprehensions',
    icon: <Code2 className="h-5 w-5" />,
    description: 'Code analysis and understanding documents',
    documents: [
      { id: 'coc_001', name: 'COBOL Program Analysis', type: 'pdf', size: '4.1 MB' },
      { id: 'coc_002', name: 'JCL Script Analysis', type: 'pdf', size: '1.9 MB' }
    ]
  },
  {
    id: 'code_files',
    name: 'Code Files',
    icon: <Code className="h-5 w-5" />,
    description: 'Source code files and programs',
    documents: [
      { id: 'cf_001', name: 'CUSTMAIN.cbl', type: 'cobol', size: '156 KB' },
      { id: 'cf_002', name: 'LOANPROC.cbl', type: 'cobol', size: '203 KB' },
      { id: 'cf_003', name: 'PAYMENT.cbl', type: 'cobol', size: '178 KB' }
    ]
  },
  {
    id: 'input_output_documents',
    name: 'Input/Output Documents',
    icon: <FileInput className="h-5 w-5" />,
    description: 'Data input and output specifications',
    documents: [
      { id: 'io_001', name: 'Customer Data Input Spec', type: 'pdf', size: '1.4 MB' },
      { id: 'io_002', name: 'Transaction Output Format', type: 'pdf', size: '1.1 MB' }
    ]
  },
  {
    id: 'user_manuals',
    name: 'User Manuals',
    icon: <BookOpen className="h-5 w-5" />,
    description: 'User guides and operational manuals',
    documents: [
      { id: 'um_001', name: 'System User Manual', type: 'pdf', size: '5.2 MB' },
      { id: 'um_002', name: 'Administrator Guide', type: 'pdf', size: '3.8 MB' }
    ]
  },
  {
    id: 'coding_standards',
    name: 'Coding Standards',
    icon: <Scroll className="h-5 w-5" />,
    description: 'Coding standards and guidelines',
    documents: [
      { id: 'cs_001', name: 'COBOL Coding Standards', type: 'pdf', size: '2.1 MB' },
      { id: 'cs_002', name: 'Java Migration Guidelines', type: 'pdf', size: '1.9 MB' }
    ]
  },
  {
    id: 'additional_documents',
    name: 'Additional Documents',
    icon: <FileSearch className="h-5 w-5" />,
    description: 'Other relevant documentation',
    documents: [
      { id: 'ad_001', name: 'System Requirements', type: 'pdf', size: '1.7 MB' },
      { id: 'ad_002', name: 'Performance Specifications', type: 'pdf', size: '1.3 MB' }
    ]
  }
];

// Default questions for initial stage
const DEFAULT_QUESTIONS = [
  {
    "id": "target_technology",
    "question": "What is your target language for target technology (frontend and backend)?",
    "category": "technology",
    "default_answer": "Java 21+ with Spring Boot 3.4.9, Spring Cloud 2024.0.2 for backend, Angular 16+ with TypeScript 5.0+ for frontend"
  },
  {
    "id": "target_platform",
    "question": "What is the target platform for the application and what services in target platform you want to utilize?",
    "category": "platform",
    "default_answer": "Google Cloud Platform (GCP) with Cloud Run for compute, Cloud Storage for file storage, Pub/Sub for messaging, Secret Manager for secrets, and Cloud Monitoring for observability"
  },
  {
    "id": "conversion_approach",
    "question": "What is the conversion approach and architecture pattern?",
    "category": "approach",
    "default_answer": "Microservices architecture with cloud-native refactoring approach using domain-driven design and event-driven communication"
  },
  {
    "id": "ford_ecoboost_services",
    "question": "Which Ford EcoBoost pre-existing services do you want to leverage (CacheService, FileStorageService, MessageService, RestServiceClient, Security configurations)?",
    "category": "ford_specific",
    "default_answer": "Utilize all Ford EcoBoost services: CacheService for Redis operations, FileStorageService for GCS operations, MessageService for Pub/Sub messaging, RestServiceClient for external API calls, and pre-configured security services for OAuth2/JWT authentication"
  },
  {
    "id": "build_system",
    "question": "What build system and quality gates do you want to implement?",
    "category": "build_system",
    "default_answer": "Gradle with gradle-boost 5.4.0, SonarQube 5.1.0.4882 with Ford Way quality gate, Jacoco with 85% coverage minimum, Jib 3.4.5 for containerization, and CycloneDX 2.2.0 for SBOM generation"
  },
  {
    "id": "database_strategy",
    "question": "What database technology and migration strategy do you prefer for your data layer?",
    "category": "database",
    "default_answer": "Cloud SQL PostgreSQL 15+ with HikariCP connection pooling, Flyway for database migrations, automated daily backups with point-in-time recovery, customer-managed encryption keys, Hibernate Envers for audit trails, and database-per-service pattern for microservices"
  },
  {
    "id": "security_framework",
    "question": "What security framework and authentication/authorization approach should be implemented?",
    "category": "security",
    "default_answer": "OAuth2 with Azure AD/EntraID authentication, JWT token validation, role-based authorization with Spring Security, Ford security tools (@EnableFordSecurityTools), and RSA-4096 encryption with OAEP padding for sensitive data"
  },
  {
    "id": "monitoring_observability",
    "question": "What monitoring, observability, and alerting requirements do you have?",
    "category": "monitoring",
    "default_answer": "Micrometer with Prometheus metrics, structured JSON logging with Logback, OpenTelemetry with GCP Cloud Trace, GCP Cloud Monitoring with PagerDuty/Slack alerts, and custom business metrics dashboards"
  },
  {
    "id": "batch_processing",
    "question": "How should batch processing and job scheduling be implemented?",
    "category": "batch_processing",
    "default_answer": "Spring Batch with Cloud Run Jobs, Cloud Scheduler with Pub/Sub for orchestration, process 1M+ records within 4-hour window, 99.9% success rate with automatic retry mechanisms"
  },
  {
    "id": "messaging_integration",
    "question": "What messaging and integration patterns should be used?",
    "category": "messaging",
    "default_answer": "GCP Pub/Sub with Spring Cloud Stream, event-driven architecture, saga pattern for distributed transactions, dead letter queues for failed messages, and correlation IDs for end-to-end tracing"
  },
  {
    "id": "caching_strategy",
    "question": "What caching strategy and implementation approach do you prefer?",
    "category": "caching",
    "default_answer": "Redis (GCP Memorystore) with Ford EcoBoost CacheService, cache-aside pattern, configurable TTL per cache type, LRU eviction policy, and encryption for cached sensitive data"
  },
  {
    "id": "performance_requirements",
    "question": "What are your performance, scalability, and availability requirements?",
    "category": "performance",
    "default_answer": "99.95% availability SLA, sub-200ms API response times (95th percentile), 1000+ RPS throughput capacity, horizontal auto-scaling, 10,000+ TPS peak load support, and multi-zone deployment with automatic failover"
  },
  {
    "id": "code_standards",
    "question": "What coding standards, package structure, and development practices should be followed?",
    "category": "code_standards",
    "default_answer": "Ford package naming convention (com.ford.{business_unit}.{service_name}.{domain}.{layer}), constructor injection with @Autowired, Lombok for boilerplate reduction, and OpenAPI 3.0 API documentation"
  },
  {
    "id": "testing_strategy",
    "question": "What testing strategy and frameworks should be implemented?",
    "category": "testing",
    "default_answer": "Spring Boot Test with Testcontainers for integration testing, MockWebServer for API mocking, WireMock for external service simulation, 85% line coverage minimum, and performance testing with JMeter/Gatling"
  },
  {
    "id": "deployment_strategy",
    "question": "What deployment and CI/CD strategy should be implemented?",
    "category": "deployment",
    "default_answer": "GitOps with Cloud Build CI/CD, containerization with Jib and distroless Java 21 base images, blue-green deployment strategy, and automated rollback capabilities"
  }
];

// Pre-filled data based on existing project documents
const getPrefilledData = (projectName) => {
  // This would typically come from API integration with existing documents
  const baseData = {
    project_overview: `The ${projectName} system is a legacy COBOL application that handles core business processes for Ford Credit. The system manages customer account information, loan processing, and payment transactions. It serves as a critical component in the financial services infrastructure, processing thousands of transactions daily and maintaining customer data integrity.`,
    business_context: `The system supports several key business processes including customer onboarding, loan origination, payment processing, account management, and regulatory compliance reporting. It integrates with external credit bureaus, payment processors, and regulatory systems to ensure accurate and compliant operations.`,
    user_roles: `Primary users include Ford Credit customer service representatives, loan officers, account managers, and administrative staff. The system also serves back-office operations teams, compliance officers, and management reporting personnel who rely on the system for daily operations and strategic decision-making.`,
    integration_points: `The system integrates with external credit bureau services, payment processing gateways, regulatory reporting systems, and Ford's internal customer relationship management platform. Additional integrations include document management systems, email notification services, and reporting dashboards.`,
    performance_requirements: `The system must handle 10,000+ concurrent users during peak business hours, process 50,000+ transactions per day, and maintain 99.9% uptime. Response times should be under 2 seconds for standard queries and under 5 seconds for complex reporting operations.`,
    
    // Business Rules and Logic Stage - Pre-filled data
    data_validation_rules: `## Data Validation Rules for ${projectName} System (1099 Generation)

### Field-Level Validation
- **Taxpayer Identification Number (TIN)**: Must be valid SSN (XXX-XX-XXXX) or EIN (XX-XXXXXXX) format
- **Recipient Names**: Must match IRS requirements - legal business name or individual full name
- **Address Validation**: USPS-verified addresses required for 1099 delivery, PO Boxes allowed
- **Amount Fields**: Must be positive numbers with maximum 2 decimal places, range $0.01 - $999,999.99
- **Tax Year**: Must be current or previous tax year, cannot be future years
- **Form Type Codes**: Must be valid 1099 form types (1099-MISC, 1099-NEC, 1099-DIV, etc.)

### Business Rule Validation
- **Threshold Validation**: 1099 forms required for payments ≥ $600 in a calendar year
- **Recipient Validation**: TIN must match IRS records, name/TIN combination must be valid
- **Payment Classification**: Must correctly categorize payments (contractor, interest, dividends, etc.)
- **State Tax Validation**: State-specific requirements based on recipient location
- **Backup Withholding**: Apply 24% backup withholding for invalid TINs

### Cross-Field Validation
- **Name/TIN Matching**: Recipient name must match IRS records for provided TIN
- **Address Consistency**: Mailing address must be valid for tax year and recipient
- **Payment Period**: Payment dates must fall within specified tax year
- **Multiple Forms**: Ensure no duplicate 1099s for same recipient in same tax year

### Error Handling
- **TIN Validation Failures**: Flag for backup withholding and manual review
- **Address Validation**: Auto-correct common address errors, flag invalid addresses
- **Amount Discrepancies**: Validate against source payment systems
- **Audit Trail**: Log all validation failures with timestamp, user ID, and correction actions`,

    business_constraints: `## Business Constraints for ${projectName} System (1099 Generation)

### Regulatory Compliance Constraints
- **Internal Revenue Code (IRC) Section 6041**: Required reporting for payments ≥ $600 to non-employees
- **IRC Section 6041A**: Backup withholding requirements for invalid or missing TINs
- **Treasury Regulation 301.6721-1**: Penalties for incorrect or late 1099 filings
- **Privacy Act of 1974**: Protection of taxpayer information and TIN data
- **State Tax Requirements**: Compliance with state-specific 1099 reporting requirements

### Operational Constraints
- **Filing Deadlines**: 1099 forms must be mailed to recipients by January 31st, filed with IRS by March 31st
- **Processing Windows**: 1099 generation limited to October 1st - March 31st annually
- **IRS Transmission**: Electronic filing required for 250+ forms, paper filing allowed for <250 forms
- **System Maintenance**: Planned maintenance windows during non-peak periods (April-September)

### Financial Constraints
- **Threshold Limits**: Minimum $600 annual payment threshold for 1099 requirement
- **Penalty Structure**: $290 per incorrect 1099 form, up to $3.5M annually
- **Backup Withholding Rate**: Fixed 24% for invalid TINs or missing certifications
- **Interest Penalties**: 3% annual interest on late payments due to backup withholding

### Data Privacy Constraints
- **TIN Protection**: All taxpayer identification numbers must be encrypted and access-controlled
- **Data Retention**: 1099 data retained for 7 years per IRS requirements
- **Access Controls**: Role-based access with IRS-required audit trails
- **Third-Party Sharing**: Limited to authorized vendors with IRS-compliant agreements
- **Cross-Border Restrictions**: No international transmission of US taxpayer data`,

    approval_workflows: `## Approval Workflows for ${projectName} System (1099 Generation)

### 1099 Form Generation Workflow
1. **Data Collection**: Extract payment data from Ford's payment systems (AP, payroll, etc.)
2. **Recipient Identification**: Identify all vendors/contractors with payments ≥ $600
3. **TIN Validation**: Validate recipient TINs against IRS records
4. **Form Generation**: Generate 1099-MISC, 1099-NEC, or other appropriate forms
5. **Quality Review**: Automated and manual review of generated forms
6. **Approval Process**: Tax team approval for forms > $50,000 or exceptions
7. **Distribution**: Mail forms to recipients by January 31st deadline

### TIN Validation Workflow
1. **Initial Check**: System validates TIN format and basic structure
2. **IRS Verification**: Submit TINs to IRS TIN Matching Program
3. **Name Matching**: Verify recipient name matches IRS records
4. **Backup Withholding**: Apply 24% withholding for invalid TINs
5. **Exception Handling**: Route invalid TINs for manual resolution
6. **Certification**: Obtain W-9 or substitute form for missing TINs

### Exception Handling Workflow
1. **Exception Identification**: System flags forms requiring manual review
2. **Queue Assignment**: Route to appropriate tax specialist based on issue type
3. **Investigation**: Specialist reviews payment history and recipient data
4. **Resolution**: Correct data errors or apply backup withholding
5. **Re-validation**: Re-run validation after corrections
6. **Approval**: Tax manager approval for high-value exceptions`,

    calculation_logic: `## Calculation Logic for ${projectName} System (1099 Generation)

### Payment Aggregation Calculations
- **Annual Totals**: Sum all payments to same recipient within tax year (January 1 - December 31)
- **Threshold Check**: Flag recipients with total payments ≥ $600 for 1099 requirement
- **Multiple Form Types**: Separate calculations for different 1099 types (MISC, NEC, DIV, INT)
- **State Allocation**: Calculate state-specific amounts for multi-state recipients

### Backup Withholding Calculations
- **Backup Withholding Rate**: Fixed 24% on gross payments when TIN invalid
- **Withholding Amount**: Payment Amount × 0.24 (rounded to nearest cent)
- **Net Payment**: Gross Payment - Backup Withholding Amount
- **Interest Calculations**: 3% annual interest on late backup withholding payments

### Form Type Determination Logic
- **1099-MISC**: Non-employee compensation, rents, royalties, prizes, awards
- **1099-NEC**: Non-employee compensation (replaces Box 7 on 1099-MISC)
- **1099-DIV**: Dividends and distributions from investments
- **1099-INT**: Interest income from investments or loans
- **1099-G**: Government payments and refunds

### Penalty Calculations
- **Late Filing Penalties**: $290 per form for returns filed after March 31st
- **Incorrect Information**: $290 per form with incorrect recipient or amount data
- **Intentional Disregard**: $580 per form or 10% of payment amount (whichever greater)
- **Annual Maximum**: $3,532,500 for large businesses (1000+ forms)
- **Small Business Relief**: Reduced penalties for businesses with <1000 forms`,

    process_flows: `## Process Flows for ${projectName} System (1099 Generation)

### Annual 1099 Generation Process
1. **Data Extraction**: Pull payment data from Ford's AP, payroll, and vendor systems
2. **Recipient Identification**: Identify all vendors, contractors, and service providers
3. **Threshold Analysis**: Calculate annual totals for each recipient (January 1 - December 31)
4. **TIN Collection**: Gather W-9 forms or validate existing TINs in vendor master
5. **Form Generation**: Create 1099-MISC, 1099-NEC, and other appropriate forms
6. **Quality Control**: Automated and manual review of generated forms
7. **Approval Process**: Tax team approval for high-value or exception cases
8. **Distribution**: Mail forms to recipients and file with IRS

### TIN Validation Process
1. **Format Validation**: Check TIN format (SSN: XXX-XX-XXXX, EIN: XX-XXXXXXX)
2. **IRS TIN Matching**: Submit TINs to IRS TIN Matching Program for validation
3. **Name Matching**: Verify recipient names match IRS records exactly
4. **Exception Handling**: Flag invalid TINs for manual resolution
5. **W-9 Requests**: Send W-9 forms to vendors with missing or invalid TINs
6. **Backup Withholding**: Apply 24% withholding for unresolved TIN issues

### Monthly Data Processing Flow
1. **Payment Import**: Import monthly payment data from source systems
2. **Recipient Matching**: Match payments to existing vendor records
3. **Amount Aggregation**: Update running totals for each recipient
4. **Threshold Monitoring**: Track recipients approaching $600 annual threshold
5. **TIN Validation**: Validate TINs for new or updated vendors
6. **Data Quality**: Run validation checks on imported payment data
7. **Exception Reporting**: Generate reports for manual review items`,

    decision_points: `## Decision Points for ${projectName} System (1099 Generation)

### 1099 Form Requirement Decision Tree
1. **Payment Amount Check**: 
   - Total payments ≥ $600: 1099 form required
   - Total payments < $600: No 1099 form required
   - Multiple payment types: Separate forms for each type (MISC, NEC, DIV, INT)

2. **Recipient Type Analysis**:
   - Individual (SSN): Use 1099-MISC or 1099-NEC for non-employee compensation
   - Business (EIN): Use appropriate 1099 type based on payment classification
   - Tax-exempt organization: Special handling, may require different forms
   - Foreign entity: Additional reporting requirements (1042-S forms)

3. **TIN Validation Decision**:
   - Valid TIN: Proceed with normal processing
   - Invalid TIN: Apply 24% backup withholding
   - Missing TIN: Request W-9 form, apply backup withholding if not provided
   - TIN mismatch: Flag for manual review and resolution

4. **Form Type Determination**:
   - Non-employee compensation: 1099-NEC (Box 1)
   - Rent payments: 1099-MISC (Box 1)
   - Royalties: 1099-MISC (Box 2)
   - Other income: 1099-MISC (Box 3)
   - Interest income: 1099-INT
   - Dividend payments: 1099-DIV

### Risk Assessment Decision Matrix
1. **Low Risk** (Valid TIN, standard payments): Automated processing
2. **Medium Risk** (TIN validation issues, unusual amounts): Manual review
3. **High Risk** (Missing TIN, large amounts): Enhanced review, backup withholding
4. **Very High Risk** (Foreign entities, complex structures): Tax specialist review

### Exception Handling Decisions
1. **TIN Validation Failures**: Apply backup withholding, request W-9
2. **Name/TIN Mismatches**: Manual verification with recipient
3. **Large Payment Amounts**: Additional approval required (>$50,000)
4. **Foreign Recipients**: Special handling for international tax reporting`,

    exception_handling: `## Exception Handling for ${projectName} System (1099 Generation)

### TIN Validation Exceptions
1. **Invalid TIN Format**:
   - Flag for manual review and correction
   - Request W-9 form from recipient
   - Apply 24% backup withholding until resolved

2. **TIN Not Found in IRS Records**:
   - Verify recipient name spelling and format
   - Request updated W-9 with correct information
   - Apply backup withholding for 60 days, then resolve

3. **Name/TIN Mismatch**:
   - Contact recipient for verification
   - Request corrected W-9 form
   - Apply backup withholding until name matches IRS records

### Data Quality Exceptions
1. **Missing Recipient Information**:
   - Flag incomplete records for manual completion
   - Request missing data from source systems
   - Hold form generation until all required fields populated

2. **Payment Classification Errors**:
   - Route to tax specialist for proper categorization
   - Update vendor master with correct payment types
   - Regenerate affected 1099 forms

3. **Address Validation Failures**:
   - Use address standardization services
   - Contact recipient for address verification
   - Use last known good address if current invalid

### System Integration Exceptions
1. **Source System Data Errors**:
   - Log discrepancies for investigation
   - Use cached data if available and recent
   - Alert operations team for manual reconciliation

2. **IRS TIN Matching Service Failures**:
   - Retry validation requests up to 3 times
   - Use offline validation for critical deadlines
   - Apply conservative backup withholding approach

3. **Form Generation Failures**:
   - Identify specific form fields causing errors
   - Route to technical support for resolution
   - Generate manual forms for time-critical cases`,

    state_management: `## State Management for ${projectName} System (1099 Generation)

### Vendor/Recipient States
1. **Active**: Vendor with valid TIN and current information
2. **TIN Validation Required**: New vendor or TIN update needed
3. **TIN Invalid**: TIN failed IRS validation, backup withholding applied
4. **W-9 Pending**: Waiting for W-9 form from vendor
5. **Inactive**: Vendor no longer receiving payments
6. **Excluded**: Vendor excluded from 1099 reporting (employee, tax-exempt)

### 1099 Form States
1. **Data Collection**: Gathering payment data for tax year
2. **TIN Validation**: Validating recipient TINs with IRS
3. **Form Generation**: Creating 1099 forms for qualified recipients
4. **Quality Review**: Manual and automated review of generated forms
5. **Approved**: Forms approved for distribution and filing
6. **Mailed**: Forms mailed to recipients
7. **Filed**: Forms submitted to IRS
8. **Corrected**: Forms corrected and re-filed if needed

### Payment Processing States
1. **Imported**: Payment data imported from source systems
2. **Validated**: Payment data validated for completeness and accuracy
3. **Aggregated**: Payment amounts aggregated by recipient for tax year
4. **Threshold Check**: Recipients evaluated against $600 threshold
5. **Form Qualified**: Recipient qualifies for 1099 form generation
6. **Exception**: Payment flagged for manual review

### State Transition Rules
1. **Vendor State Transitions**:
   - Active → TIN Validation Required: TIN validation fails or expires
   - TIN Invalid → W-9 Pending: W-9 form requested from vendor
   - W-9 Pending → Active: Valid W-9 received and processed
   - Active → Inactive: No payments received for 2+ years

2. **Form State Transitions**:
   - Data Collection → TIN Validation: Tax year data collection complete
   - TIN Validation → Form Generation: All TINs validated successfully
   - Form Generation → Quality Review: Forms generated and ready for review
   - Quality Review → Approved: Forms pass all quality checks

3. **Payment State Transitions**:
   - Imported → Validated: Payment data passes validation rules
   - Validated → Aggregated: Payments grouped by recipient
   - Aggregated → Threshold Check: Annual totals calculated
   - Threshold Check → Form Qualified: Recipient meets $600 threshold`,

    // Data Handling Design Stage - Pre-filled data
    data_processing_approach: 'Database-centric processing (real-time, transactional)',
    file_processing_requirements: `## File Processing Requirements for ${projectName} System (1099 Generation)

### File Types and Formats
- **Input Files**: CSV files from AP systems, XML files from payroll, JSON files from vendor portals
- **Output Files**: 1099 forms (PDF), IRS transmission files (XML), reconciliation reports (CSV)
- **File Sizes**: Typical files 1-50MB, maximum 500MB for annual processing
- **Processing Frequency**: Daily imports, monthly processing, annual 1099 generation

### File Validation Rules
- **Format Validation**: Verify CSV headers, XML schema compliance, JSON structure
- **Data Validation**: Check required fields, data types, business rules
- **Size Limits**: Maximum file size 500MB, maximum records per file 100,000
- **Encoding**: UTF-8 encoding required for all text files

### Error Handling
- **Malformed Files**: Log errors, quarantine files, notify administrators
- **Data Errors**: Flag invalid records, continue processing valid records
- **Recovery**: Retry failed processing, manual intervention for persistent errors
- **Audit Trail**: Log all file processing activities and errors`,

    database_type_selection: 'Relational Database (PostgreSQL, MySQL, Oracle, SQL Server)',
    database_configuration: `## Database Configuration for ${projectName} System (1099 Generation)

### Connection Pooling Settings
- **Pool Size**: 20-50 connections for normal operations, 100+ for peak processing
- **Timeout Settings**: Connection timeout 30 seconds, query timeout 300 seconds
- **Connection Management**: Automatic connection recycling, connection health checks

### Indexing Strategy
- **Primary Indexes**: TIN, recipient name, payment date, tax year
- **Composite Indexes**: TIN + tax year, recipient + payment type
- **Performance Indexes**: Payment amount, processing status, validation flags
- **Index Maintenance**: Weekly index statistics update, monthly index optimization

### Partitioning Rules
- **Tax Year Partitioning**: Separate partitions for each tax year
- **Payment Type Partitioning**: Separate tables for different 1099 types
- **Archive Partitioning**: Move completed years to archive storage
- **Performance**: Enable partition pruning for better query performance

### Backup and Recovery
- **Daily Backups**: Full database backup with point-in-time recovery
- **Transaction Logs**: Continuous backup of transaction logs
- **Recovery Testing**: Monthly recovery testing procedures
- **Retention**: 7 years of backup retention per IRS requirements`,

    database_access_patterns: `## Database Access Patterns for ${projectName} System (1099 Generation)

### Read/Write Ratios
- **Read Operations**: 80% of total operations (queries, reports, validations)
- **Write Operations**: 20% of total operations (payment imports, form generation)
- **Peak Processing**: 90% write operations during annual 1099 generation
- **Normal Operations**: 95% read operations during regular business

### Query Complexity
- **Simple Queries**: Single table lookups by TIN or recipient name
- **Complex Queries**: Multi-table joins for payment aggregation and reporting
- **Analytical Queries**: Complex aggregations for compliance reporting
- **Performance Targets**: Simple queries <100ms, complex queries <5 seconds

### Transaction Requirements
- **ACID Compliance**: Full ACID properties for payment processing
- **Isolation Levels**: Read committed for normal operations, serializable for critical updates
- **Deadlock Prevention**: Optimized query order, timeout handling
- **Rollback Capability**: Full transaction rollback for error scenarios

### Concurrent User Expectations
- **Peak Users**: 50 concurrent users during tax season
- **Normal Users**: 10-20 concurrent users during regular operations
- **System Users**: Automated processes with dedicated connections
- **Performance**: Sub-second response times for user interactions`,

    database_access_control: `## Database Access Control for ${projectName} System (1099 Generation)

### User Roles and Permissions
- **Tax Administrators**: Full access to all 1099 data and operations
- **Data Entry Users**: Read/write access to payment data, read-only for forms
- **Reporting Users**: Read-only access to aggregated data and reports
- **System Accounts**: Limited access for automated processes and integrations

### Row-Level Security
- **Tax Year Filtering**: Users can only access current and previous tax years
- **Department Filtering**: Users limited to their department's vendors
- **Status Filtering**: Users limited to records in their workflow stage
- **Audit Logging**: All row-level access logged for compliance

### Column-Level Access Control
- **PII Protection**: TIN and personal data restricted to authorized users
- **Financial Data**: Payment amounts restricted to accounting personnel
- **System Fields**: Internal system fields hidden from business users
- **Sensitive Data**: Backup withholding flags restricted to tax team

### Database User Management
- **Active Directory Integration**: Single sign-on with Ford's AD
- **Role-Based Access**: Automatic permission assignment based on user roles
- **Temporary Access**: Time-limited access for contractors and consultants
- **Access Reviews**: Quarterly review of user permissions and access patterns`,

    data_encryption_requirements: `## Data Encryption Requirements for ${projectName} System (1099 Generation)

### Encryption at Rest
- **Database Encryption**: AES-256 encryption for all database files
- **File Encryption**: Encrypted storage for all 1099 forms and reports
- **Backup Encryption**: All backup files encrypted with separate keys
- **Key Management**: Hardware security modules (HSM) for key storage

### Encryption in Transit
- **Database Connections**: TLS 1.3 for all database connections
- **API Communications**: HTTPS with certificate pinning
- **File Transfers**: SFTP or encrypted file transfer protocols
- **Web Interface**: SSL/TLS encryption for all web communications

### Key Management
- **Key Rotation**: Annual rotation of encryption keys
- **Key Backup**: Secure backup of encryption keys in separate location
- **Key Recovery**: Documented key recovery procedures
- **Compliance**: Key management meets IRS and SOX requirements

### PII Protection
- **TIN Encryption**: Additional encryption layer for taxpayer identification numbers
- **Data Masking**: PII masked in non-production environments
- **Access Logging**: All PII access logged and monitored
- **Retention**: PII data retained per IRS 7-year requirement`,

    data_backup_recovery: `## Data Backup and Recovery Strategy for ${projectName} System (1099 Generation)

### Backup Frequency
- **Daily Backups**: Full database backup every night at 2 AM
- **Transaction Logs**: Continuous backup of transaction logs every 15 minutes
- **File Backups**: Daily backup of all 1099 forms and reports
- **Configuration Backups**: Weekly backup of system configuration

### Retention Policies
- **Database Backups**: 7 years retention per IRS requirements
- **Transaction Logs**: 30 days for point-in-time recovery
- **File Backups**: 7 years for 1099 forms, 3 years for other files
- **Archive Storage**: Long-term archival for completed tax years

### Recovery Objectives
- **RTO (Recovery Time Objective)**: 4 hours for critical systems
- **RPO (Recovery Point Objective)**: 15 minutes maximum data loss
- **Recovery Testing**: Monthly recovery testing and validation
- **Recovery Procedures**: Documented step-by-step recovery processes

### Disaster Recovery
- **Geographic Redundancy**: Backup data stored in different geographic region
- **Failover Procedures**: Automated failover to backup systems
- **Communication Plans**: Emergency communication procedures
- **Business Continuity**: Alternative processing procedures for extended outages`,

    data_migration_strategy: `## Data Migration Strategy for ${projectName} System (1099 Generation)

### Migration Approach
- **Incremental Migration**: Phased migration over 6 months
- **Parallel Processing**: Run legacy and new systems in parallel during transition
- **Data Validation**: Extensive validation at each migration phase
- **Rollback Plans**: Ability to rollback to legacy system if needed

### Data Mapping
- **Legacy to New**: Map COBOL data structures to modern database schema
- **Field Mapping**: Detailed mapping of all data fields and formats
- **Data Transformation**: Convert legacy data formats to modern standards
- **Quality Validation**: Validate data integrity after each migration phase

### Migration Timeline
- **Phase 1**: Vendor master data migration (Month 1-2)
- **Phase 2**: Payment history migration (Month 3-4)
- **Phase 3**: 1099 form templates and rules (Month 5)
- **Phase 4**: User data and permissions (Month 6)
- **Go-Live**: Full system cutover with legacy system backup

### Validation Procedures
- **Data Completeness**: Verify all records migrated successfully
- **Data Accuracy**: Validate data integrity and business rules
- **Performance Testing**: Ensure system performance meets requirements
- **User Acceptance**: User testing and acceptance of migrated data`,

    data_transformation_rules: `## Data Transformation Rules for ${projectName} System (1099 Generation)

### Field Mapping
- **TIN Format**: Convert legacy TIN formats to standard XXX-XX-XXXX format
- **Name Standardization**: Convert to proper case, remove extra spaces
- **Address Formatting**: Standardize address formats for USPS compatibility
- **Date Conversions**: Convert legacy date formats to ISO 8601 standard

### Data Type Conversions
- **Numeric Fields**: Convert text numbers to proper numeric types
- **Currency Fields**: Standardize currency formats and decimal places
- **Boolean Fields**: Convert legacy Y/N flags to true/false values
- **Code Values**: Map legacy codes to standardized code tables

### Business Rule Transformations
- **Payment Aggregation**: Sum payments by recipient and tax year
- **Threshold Calculations**: Apply $600 threshold rules for 1099 requirements
- **Tax Year Assignment**: Assign payments to correct tax year based on payment date
- **Form Type Determination**: Determine correct 1099 form type based on payment category

### Error Handling
- **Invalid Data**: Flag records with invalid data for manual review
- **Missing Data**: Apply default values where appropriate, flag for review
- **Duplicate Records**: Identify and handle duplicate payment records
- **Data Quality**: Generate data quality reports for review and correction`,

    data_validation_quality: `## Data Validation and Quality Rules for ${projectName} System (1099 Generation)

### Data Completeness Checks
- **Required Fields**: Verify all required fields are populated
- **TIN Validation**: Validate TIN format and check against IRS records
- **Name Validation**: Ensure recipient names are complete and properly formatted
- **Address Validation**: Verify addresses are complete and USPS-valid

### Format Validation
- **Date Formats**: Validate all dates are in correct format and reasonable ranges
- **Numeric Formats**: Validate currency amounts are positive and within limits
- **Text Formats**: Validate text fields meet length and character requirements
- **Code Validation**: Validate all code fields against reference tables

### Business Rule Validation
- **Payment Thresholds**: Validate payment amounts meet 1099 reporting requirements
- **Tax Year Rules**: Ensure payments are assigned to correct tax year
- **Form Type Logic**: Validate correct 1099 form type based on payment category
- **Duplicate Detection**: Identify and flag potential duplicate payments

### Data Quality Monitoring
- **Quality Metrics**: Track data completeness, accuracy, and consistency
- **Error Reporting**: Generate daily data quality reports
- **Trend Analysis**: Monitor data quality trends over time
- **Improvement Actions**: Identify and implement data quality improvements`,

    // Testing Strategy Stage - Pre-filled data
    unit_testing_framework: 'Jest + React Testing Library (React/JavaScript)',
    test_coverage_requirements: `## Test Coverage Requirements for ${projectName} System (1099 Generation)

### Code Coverage Targets
- **Minimum Coverage**: 80% line coverage for all modules
- **Branch Coverage**: 75% branch coverage for critical business logic
- **Critical Path Coverage**: 95% coverage for 1099 generation workflows
- **New Code Coverage**: 90% coverage for all new development

### Coverage Reporting
- **Tools**: Istanbul (JavaScript), JaCoCo (Java), Coverage.py (Python)
- **Reporting**: HTML reports with detailed coverage analysis
- **Integration**: Coverage reports integrated into CI/CD pipeline
- **Trends**: Track coverage trends over time with quality gates

### Critical Areas for High Coverage
- **Business Logic**: Payment processing, 1099 generation, validation rules
- **Data Processing**: File imports, data transformation, error handling
- **Security**: Authentication, authorization, data encryption
- **Integration**: API endpoints, database operations, external services`,

    api_testing_strategy: `## API Testing Strategy for ${projectName} System (1099 Generation)

### REST API Testing
- **CRUD Operations**: Test all CRUD operations for vendor and payment entities
- **Authentication**: Test JWT token validation and refresh mechanisms
- **Authorization**: Test role-based access control for different user types
- **Error Handling**: Test proper HTTP status codes and error messages

### API Contract Testing
- **Request Validation**: Test API request schema validation
- **Response Validation**: Test API response schema compliance
- **Versioning**: Test API versioning and backward compatibility
- **Documentation**: Validate API documentation accuracy

### Performance Testing
- **Response Times**: Test API response times under various loads
- **Concurrent Users**: Test API behavior with multiple concurrent users
- **Rate Limiting**: Test API rate limiting and throttling mechanisms
- **Timeout Handling**: Test API timeout scenarios and recovery`,

    performance_testing_strategy: `## Performance Testing Strategy for ${projectName} System (1099 Generation)

### Load Testing Scenarios
- **Normal Load**: 100 concurrent users during regular business hours
- **Peak Load**: 500 concurrent users during tax season peak
- **Data Volume**: 1 million payment records processing
- **File Processing**: Large file uploads (100MB+ files)

### Performance Benchmarks
- **Response Time**: <2 seconds for 95% of requests
- **Throughput**: 1000+ requests per minute
- **Resource Usage**: CPU <80%, Memory <85%, Disk I/O within limits
- **Error Rate**: <0.1% error rate under normal load

### Monitoring and Alerting
- **Performance Metrics**: Real-time performance monitoring
- **Alert Thresholds**: Automated alerts for performance degradation
- **Capacity Planning**: Regular capacity planning and scaling
- **Performance Trends**: Track performance trends over time`,

    // Deployment Strategy Stage - Pre-filled data
    skip_deployment_stage: 'No',
    deployment_method: 'Automated CI/CD Pipeline Deployment',
    deployment_environment_strategy: `## Deployment Environment Strategy for ${projectName} System (1099 Generation)

### Environment Hierarchy
- **Development Environment**: Local development and unit testing
- **Staging Environment**: Integration testing and user acceptance testing
- **Pre-Production Environment**: Production-like environment for final validation
- **Production Environment**: Live production system for end users

### Environment Promotion Process
- **Development → Staging**: Automated promotion after successful CI/CD pipeline
- **Staging → Pre-Production**: Manual approval required for business validation
- **Pre-Production → Production**: Change approval board approval required
- **Rollback Process**: Automated rollback capability between all environments

### Configuration Management
- **Environment-Specific Configs**: Separate configuration files for each environment
- **Secret Management**: Secure storage of environment-specific secrets and credentials
- **Database Configurations**: Environment-specific database connection strings and settings
- **Feature Flags**: Environment-specific feature flag configurations

### Environment-Specific Settings
- **Development**: Debug logging enabled, test data, relaxed security
- **Staging**: Production-like logging, anonymized production data, full security
- **Pre-Production**: Production-identical configuration, production data subset
- **Production**: Optimized logging, full security, production data`,

    deployment_phases: `## Deployment Phases for ${projectName} System (1099 Generation)

### Pre-Deployment Phase
- **Code Review**: Complete code review and approval process
- **Testing Validation**: All automated tests passing in CI/CD pipeline
- **Security Scanning**: Security vulnerability scanning completed
- **Performance Testing**: Performance benchmarks met in staging environment
- **Change Approval**: Change approval board approval for production deployment

### Deployment Execution Phase
- **Infrastructure Provisioning**: Automated infrastructure setup using IaC
- **Application Deployment**: Automated application deployment via CI/CD pipeline
- **Database Migration**: Automated database schema and data migrations
- **Configuration Deployment**: Environment-specific configuration deployment
- **Service Startup**: Automated service startup and health checks

### Post-Deployment Validation Phase
- **Health Checks**: Automated health check validation for all services
- **Smoke Testing**: Critical path smoke tests execution
- **Integration Testing**: Key integration points validation
- **Performance Validation**: Performance metrics validation against benchmarks
- **Security Validation**: Security configuration and access validation

### Go-Live Phase
- **Monitoring Activation**: Real-time monitoring and alerting activation
- **User Notification**: End-user notification of system availability
- **Support Activation**: Support team activation and monitoring
- **Documentation Update**: Deployment documentation and runbook updates`,

    deployment_automation: `## Deployment Automation for ${projectName} System (1099 Generation)

### CI/CD Pipeline Integration
- **Build Pipeline**: Automated build, test, and package creation
- **Deployment Pipeline**: Automated deployment to staging and production environments
- **Quality Gates**: Automated quality gates preventing deployment of substandard code
- **Approval Gates**: Manual approval gates for production deployments

### Infrastructure as Code
- **Terraform**: Infrastructure provisioning and management
- **Ansible**: Configuration management and application deployment
- **Docker**: Containerization for consistent deployment environments
- **Kubernetes**: Container orchestration for scalable deployments

### Automated Testing in Pipeline
- **Unit Tests**: Automated unit test execution on every commit
- **Integration Tests**: Automated integration test execution in staging
- **Performance Tests**: Automated performance test execution before production
- **Security Tests**: Automated security scanning and vulnerability assessment

### Deployment Approval Processes
- **Automated Approvals**: Automatic approval for non-production environments
- **Manual Approvals**: Manual approval required for production deployments
- **Business Validation**: Business stakeholder approval for critical deployments
- **Emergency Deployments**: Expedited approval process for critical fixes`,

    deployment_validation: `## Deployment Validation for ${projectName} System (1099 Generation)

### Health Checks
- **Application Health**: Application startup and basic functionality checks
- **Database Health**: Database connectivity and query execution checks
- **External Service Health**: External API connectivity and response validation
- **Infrastructure Health**: Server, network, and storage health validation

### Smoke Testing
- **User Authentication**: Login and authentication functionality
- **Core Business Functions**: 1099 generation and payment processing workflows
- **Data Access**: Database read/write operations validation
- **API Functionality**: Key API endpoints response validation

### Integration Testing
- **Payment Processing**: End-to-end payment processing workflow
- **1099 Generation**: Complete 1099 form generation and validation
- **External Integrations**: IRS TIN matching and payment gateway integration
- **File Processing**: File upload, processing, and download functionality

### Performance Validation
- **Response Times**: API response time validation against SLAs
- **Throughput**: Transaction processing rate validation
- **Resource Utilization**: CPU, memory, and disk usage validation
- **Concurrent Users**: Multi-user access and performance validation`,

    rollback_strategy: `## Rollback Strategy for ${projectName} System (1099 Generation)

### Automatic Rollback Triggers
- **Health Check Failures**: Automatic rollback on critical health check failures
- **Performance Degradation**: Automatic rollback on significant performance drops
- **Error Rate Thresholds**: Automatic rollback on error rate exceeding 5%
- **Database Connectivity**: Automatic rollback on database connectivity issues

### Manual Rollback Procedures
- **Immediate Rollback**: Manual rollback trigger for critical issues
- **Gradual Rollback**: Phased rollback for non-critical issues
- **Data Rollback**: Database state rollback procedures
- **Configuration Rollback**: Configuration and environment rollback

### Rollback Time Objectives
- **Critical Issues**: 5-minute rollback for critical production issues
- **Performance Issues**: 15-minute rollback for performance degradation
- **Feature Issues**: 30-minute rollback for feature-related problems
- **Data Issues**: 1-hour rollback for data corruption or loss

### Rollback Testing
- **Rollback Drills**: Monthly rollback testing and validation
- **Rollback Documentation**: Detailed rollback procedures and runbooks
- **Rollback Training**: Team training on rollback procedures
- **Rollback Monitoring**: Real-time rollback execution monitoring`,

    disaster_recovery: `## Disaster Recovery for ${projectName} System (1099 Generation)

### Backup and Recovery Procedures
- **Database Backups**: Daily automated database backups with point-in-time recovery
- **Application Backups**: Application code and configuration backups
- **File System Backups**: User data and generated document backups
- **Configuration Backups**: Environment and system configuration backups

### Failover Mechanisms
- **Database Failover**: Automated database failover to standby servers
- **Application Failover**: Load balancer-based application failover
- **Infrastructure Failover**: Cloud provider failover to alternative regions
- **Network Failover**: Network redundancy and failover mechanisms

### Recovery Objectives
- **RTO (Recovery Time Objective)**: 4 hours maximum downtime
- **RPO (Recovery Point Objective)**: 15 minutes maximum data loss
- **Recovery Testing**: Monthly disaster recovery testing and validation
- **Recovery Documentation**: Detailed recovery procedures and runbooks

### Business Continuity Planning
- **Alternative Processing**: Alternative processing procedures for extended outages
- **Communication Plans**: Emergency communication procedures and contacts
- **Vendor Coordination**: Coordination with external vendors and service providers
- **Regulatory Compliance**: Compliance with IRS requirements during outages`,

    monitoring_alerting: `## Deployment Monitoring for ${projectName} System (1099 Generation)

### Real-Time Monitoring Setup
- **Application Performance Monitoring**: New Relic or AppDynamics for application metrics
- **Infrastructure Monitoring**: Prometheus + Grafana for system metrics
- **Database Monitoring**: Database-specific performance monitoring tools
- **Log Aggregation**: ELK stack for centralized log management

### Alerting Thresholds
- **Response Time Alerts**: Alerts for response times exceeding 5 seconds
- **Error Rate Alerts**: Alerts for error rates exceeding 1%
- **Resource Utilization Alerts**: Alerts for CPU >90% or Memory >95%
- **Availability Alerts**: Alerts for service availability below 99.9%

### Performance Monitoring
- **Transaction Monitoring**: Real-time transaction processing monitoring
- **User Activity Monitoring**: User session and activity monitoring
- **System Resource Monitoring**: CPU, memory, disk, and network monitoring
- **External Service Monitoring**: Third-party service availability and performance

### Incident Response Procedures
- **Incident Classification**: Critical, High, Medium, Low severity classification
- **Escalation Procedures**: Automated escalation based on severity and duration
- **Communication Protocols**: Incident communication and notification procedures
- **Post-Incident Review**: Post-incident analysis and improvement procedures`
  };

  // Add default questions data
  DEFAULT_QUESTIONS.forEach(question => {
    baseData[question.id] = question.default_answer;
  });

  // Maintenance & Support Stage - Pre-filled data
  baseData.maintenance_schedule = `## Maintenance Schedule and Windows for ${projectName} System (1099 Generation)

### Regular Maintenance Windows
- **Daily Maintenance**: 2:00 AM - 4:00 AM EST (Low usage period)
  - Database optimization and cleanup
  - Log file rotation and archival
  - Performance metrics collection
  - System health checks

- **Weekly Maintenance**: Sundays 1:00 AM - 5:00 AM EST
  - Full system backup verification
  - Security patch application
  - Performance tuning and optimization
  - User access review and updates

- **Monthly Maintenance**: First Sunday of each month 12:00 AM - 8:00 AM EST
  - Major system updates and patches
  - Database schema maintenance
  - Security vulnerability assessments
  - Disaster recovery testing

- **Quarterly Maintenance**: First weekend of each quarter
  - Comprehensive system review
  - Capacity planning assessment
  - Technology stack updates
  - Business continuity testing

### Peak Usage Avoidance
- **Tax Season (January-April)**: Minimal maintenance windows, emergency only
- **Month-End Processing**: Avoid last 3 days of each month
- **Year-End Processing**: Avoid December 15 - January 15

### Emergency Maintenance Procedures
- **Critical Issues**: Immediate response, 24/7 on-call rotation
- **Escalation Process**: Level 1 → Level 2 → Management → Executive
- **Communication**: Automated alerts to stakeholders within 15 minutes`;

  baseData.update_procedures = `## System Update and Change Management Procedures for ${projectName} System (1099 Generation)

### Patch Management Process
- **Security Patches**: Apply within 48 hours of release
- **Critical Updates**: Apply within 1 week of release
- **Feature Updates**: Apply within 2 weeks of release
- **Testing Environment**: All updates tested in staging environment first

### Version Control Procedures
- **Git Repository**: Centralized code repository with branch protection
- **Release Branches**: Separate branches for each release version
- **Tagging Strategy**: Semantic versioning (Major.Minor.Patch)
- **Code Review**: Mandatory peer review for all changes

### Update Testing Protocols
- **Unit Testing**: Automated unit tests with 90%+ coverage requirement
- **Integration Testing**: Full system integration testing
- **User Acceptance Testing**: Business user validation required
- **Performance Testing**: Load testing for performance impact assessment

### Rollback Procedures
- **Automated Rollback**: Pre-configured rollback scripts for critical components
- **Data Integrity**: Database backup verification before updates
- **Service Restoration**: 15-minute maximum rollback time target
- **Communication**: Immediate stakeholder notification of rollback actions

### Change Approval Workflows
- **Minor Changes**: Team lead approval required
- **Major Changes**: Manager approval and business stakeholder sign-off
- **Emergency Changes**: Post-implementation review and documentation
- **Change Advisory Board**: Monthly review of all changes and lessons learned`;

  baseData.monitoring_setup = `## System Monitoring, Alerting, and Performance Management for ${projectName} System (1099 Generation)

### Key Performance Indicators (KPIs)
- **System Availability**: 99.9% uptime target
- **Response Time**: < 2 seconds for standard queries, < 5 seconds for complex operations
- **Throughput**: 50,000+ transactions per day capacity
- **Error Rate**: < 0.1% error rate target
- **User Satisfaction**: > 95% user satisfaction score

### Monitoring Tools and Platforms
- **Application Performance**: New Relic for application monitoring
- **Infrastructure Monitoring**: Prometheus + Grafana for system metrics
- **Database Monitoring**: Database-specific performance monitoring
- **Log Management**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Network Monitoring**: Network performance and connectivity monitoring

### Alert Thresholds and Escalation
- **Critical Alerts**: System down, data corruption, security breach
  - Immediate notification to on-call engineer
  - Escalation to management within 15 minutes
  - Business stakeholder notification within 30 minutes

- **Warning Alerts**: Performance degradation, high error rates
  - Notification to support team within 1 hour
  - Escalation to technical lead if unresolved in 4 hours

- **Info Alerts**: Scheduled maintenance, routine notifications
  - Daily digest to operations team
  - Weekly summary to management

### Performance Optimization Procedures
- **Daily Performance Review**: Automated performance report generation
- **Weekly Optimization**: Performance bottleneck identification and resolution
- **Monthly Capacity Planning**: Resource utilization analysis and forecasting
- **Quarterly Performance Audit**: Comprehensive performance assessment

### Incident Response Protocols
- **Incident Classification**: Critical, High, Medium, Low severity levels
- **Response Times**: Critical (15 min), High (1 hour), Medium (4 hours), Low (24 hours)
- **Communication Plan**: Automated status page updates and stakeholder notifications
- **Post-Incident Review**: Root cause analysis and improvement recommendations`;

  baseData.documentation_updates = `## Documentation Maintenance and User Support Procedures for ${projectName} System (1099 Generation)

### Documentation Update Schedules
- **User Manuals**: Updated monthly or with each major release
- **Technical Documentation**: Updated with each code change
- **Process Documentation**: Reviewed quarterly and updated as needed
- **Training Materials**: Updated annually or with significant system changes

### Documentation Version Control
- **Centralized Repository**: Single source of truth for all documentation
- **Version Tracking**: All documentation changes tracked and versioned
- **Review Process**: Technical and business review required for all updates
- **Approval Workflow**: Documentation changes require appropriate approvals

### User Support Procedures
- **Help Desk Operations**: 24/7 support availability during business hours
- **Support Ticket Management**: Categorization and prioritization system
- **Response Times**: Critical (1 hour), High (4 hours), Medium (24 hours), Low (72 hours)
- **Escalation Process**: Level 1 → Level 2 → Technical Lead → Management

### User Training Programs
- **New User Onboarding**: 2-hour comprehensive training session
- **Advanced Training**: Quarterly advanced user training sessions
- **Refresher Training**: Annual refresher training for existing users
- **Training Materials**: Video tutorials, user guides, and hands-on exercises

### Knowledge Management
- **Knowledge Base**: Centralized repository of common issues and solutions
- **Best Practices**: Documented best practices and lessons learned
- **Expert Knowledge**: Capture and preserve expert knowledge and experience
- **Continuous Improvement**: Regular review and update of support processes`;

  // TTD De-duplication & Consolidation Stage - Pre-filled data
  baseData.duplicate_identification = `## Duplicate Content Identification and Analysis for ${projectName} System (1099 Generation)

### Automated Duplicate Detection Algorithms
- **Text Similarity Analysis**: Using cosine similarity and Jaccard index for content comparison
- **Semantic Analysis**: NLP-based semantic similarity detection for conceptual duplicates
- **Cross-Section Comparison**: Automated comparison between TTD sections (Initial Questions, Capability Design, Application Production, Business Rules, Data Handling, Testing, Deployment, Maintenance)
- **Pattern Recognition**: Identification of repeated phrases, sentences, and paragraphs across sections

### Manual Review Processes
- **Expert Review**: Subject matter expert review of identified duplicates
- **Content Analysis**: Manual assessment of duplicate content relevance and accuracy
- **Priority Assessment**: Determination of which duplicate content should be retained
- **Quality Validation**: Verification of duplicate detection accuracy and completeness

### Content Similarity Analysis
- **Exact Matches**: Identical text blocks across multiple TTD sections
- **Near-Duplicates**: Similar content with minor variations (90%+ similarity)
- **Conceptual Overlaps**: Different wording but same meaning or information
- **Redundant Information**: Multiple sections covering the same topic or requirement

### Cross-Reference Checking
- **Section Dependencies**: Identification of content that references other sections
- **Consistency Validation**: Ensuring consistent information across all sections
- **Reference Resolution**: Updating cross-references after consolidation
- **Link Verification**: Validating all internal document links and references

### Duplicate Content Categorization
- **Critical Duplicates**: Essential information that must be preserved
- **Redundant Duplicates**: Information that can be safely removed
- **Conflicting Duplicates**: Information that conflicts and requires resolution
- **Complementary Duplicates**: Information that should be merged or integrated`;

  baseData.consolidation_rules = `## TTD Consolidation Rules and Merge Strategies for ${projectName} System (1099 Generation)

### Merge Priority Rules
- **Latest Information Priority**: Most recent or updated information takes precedence
- **Source Authority**: Information from authoritative sources (SMEs, official documents) has higher priority
- **Completeness Priority**: More complete or detailed information is retained
- **Accuracy Priority**: Verified and validated information takes precedence over unverified content

### Content Integration Strategies
- **Section Merging**: Combining related content from multiple sections into unified sections
- **Information Synthesis**: Creating comprehensive content by combining complementary information
- **Context Preservation**: Maintaining original context and intent while consolidating content
- **Flow Optimization**: Ensuring logical flow and readability in consolidated sections

### Section Reorganization Procedures
- **Logical Grouping**: Organizing content into logical, coherent sections
- **Hierarchical Structure**: Establishing clear hierarchy and navigation structure
- **Cross-Reference Updates**: Updating all cross-references to reflect new organization
- **Table of Contents**: Regenerating table of contents to reflect consolidated structure

### Conflicting Information Handling
- **Conflict Identification**: Systematic identification of conflicting information
- **Resolution Process**: Structured approach to resolving conflicts (SME consultation, additional research)
- **Documentation**: Recording of conflict resolution decisions and rationale
- **Validation**: Verification of resolved conflicts with stakeholders

### Version Control During Consolidation
- **Change Tracking**: Detailed tracking of all changes made during consolidation
- **Backup Preservation**: Maintaining backups of original sections before consolidation
- **Rollback Capability**: Ability to revert to original sections if needed
- **Audit Trail**: Complete audit trail of consolidation process and decisions

### Final Document Structure Planning
- **Unified Structure**: Creating cohesive document structure from all TTD sections
- **Navigation Design**: Designing intuitive navigation and cross-references
- **Content Flow**: Ensuring logical progression and readability
- **Format Standardization**: Applying consistent formatting and style throughout document`;

  baseData.content_optimization = `## Content Optimization and Streamlining for ${projectName} System (1099 Generation)

### Redundant Text Removal
- **Duplicate Paragraphs**: Removal of identical or near-identical paragraphs
- **Repetitive Phrases**: Elimination of repeated phrases and expressions
- **Redundant Descriptions**: Consolidation of multiple descriptions of the same concept
- **Unnecessary Repetition**: Removal of information that is repeated unnecessarily

### Content Streamlining Strategies
- **Information Density**: Optimizing information density for readability and comprehension
- **Conciseness**: Making content more concise while preserving essential information
- **Clarity Enhancement**: Improving clarity and reducing ambiguity
- **Structure Optimization**: Optimizing content structure for better flow and understanding

### Information Density Optimization
- **Balanced Detail**: Ensuring appropriate level of detail for each section
- **Progressive Disclosure**: Organizing information from general to specific
- **Visual Hierarchy**: Using formatting to create clear information hierarchy
- **Content Prioritization**: Prioritizing most important information prominently

### Readability Improvement
- **Language Simplification**: Using clear, simple language where possible
- **Sentence Structure**: Optimizing sentence structure for clarity
- **Paragraph Organization**: Organizing paragraphs for logical flow
- **Technical Accuracy**: Ensuring technical accuracy while maintaining readability

### Technical Accuracy Verification
- **Fact Checking**: Verification of all technical facts and specifications
- **Specification Validation**: Validation of technical specifications and requirements
- **Compliance Verification**: Ensuring compliance with relevant standards and regulations
- **Expert Review**: Technical review by subject matter experts

### Consistency Checking Across Sections
- **Terminology Consistency**: Ensuring consistent use of terminology throughout document
- **Format Consistency**: Maintaining consistent formatting and style
- **Reference Consistency**: Ensuring consistent cross-references and citations
- **Quality Consistency**: Maintaining consistent quality and depth across all sections`;

  baseData.quality_checks = `## Quality Assurance and Validation Checks for ${projectName} System (1099 Generation)

### Completeness Verification
- **Section Coverage**: Verification that all required TTD sections are present and complete
- **Content Completeness**: Ensuring all necessary content is included in each section
- **Requirement Coverage**: Verification that all project requirements are addressed
- **Stakeholder Needs**: Ensuring all stakeholder needs are met in the consolidated document

### Accuracy Validation
- **Technical Accuracy**: Validation of all technical information and specifications
- **Business Accuracy**: Verification of business requirements and processes
- **Compliance Accuracy**: Ensuring accuracy of compliance and regulatory information
- **Data Accuracy**: Validation of all data, metrics, and measurements

### Consistency Checking
- **Terminology Consistency**: Verification of consistent terminology usage throughout document
- **Format Consistency**: Ensuring consistent formatting, style, and presentation
- **Reference Consistency**: Validation of all cross-references and internal links
- **Quality Consistency**: Maintaining consistent quality and depth across all sections

### Formatting Standardization
- **Style Guide Compliance**: Ensuring compliance with established style guides
- **Format Uniformity**: Maintaining uniform formatting throughout document
- **Visual Consistency**: Ensuring consistent visual presentation and layout
- **Accessibility Compliance**: Meeting accessibility standards and requirements

### Cross-Reference Validation
- **Link Verification**: Verification of all internal and external links
- **Reference Accuracy**: Ensuring accuracy of all references and citations
- **Navigation Validation**: Validation of document navigation and structure
- **Index Validation**: Verification of table of contents and index accuracy

### Technical Correctness Review
- **Architecture Review**: Technical review of system architecture and design
- **Implementation Review**: Validation of implementation details and procedures
- **Security Review**: Verification of security requirements and implementations
- **Performance Review**: Validation of performance specifications and requirements

### Final Quality Gates
- **Stakeholder Approval**: Final approval from all key stakeholders
- **Technical Sign-off**: Technical sign-off from architecture and development teams
- **Business Validation**: Final business validation and acceptance
- **Delivery Readiness**: Verification that document is ready for delivery and use`;

  baseData.final_review = `## Final Document Review and Approval Process for ${projectName} System (1099 Generation)

### Stakeholder Review Process
- **Primary Stakeholders**: Review by business owners, technical leads, and project managers
- **Secondary Stakeholders**: Review by end users, support teams, and compliance officers
- **Review Schedule**: Structured review schedule with defined timelines and milestones
- **Feedback Collection**: Systematic collection and incorporation of stakeholder feedback

### Technical Review Requirements
- **Architecture Review**: Technical architecture review by senior architects
- **Implementation Review**: Implementation details review by development teams
- **Security Review**: Security requirements and implementations review by security team
- **Performance Review**: Performance specifications review by performance engineering team

### Business Validation Procedures
- **Business Requirements Validation**: Verification that all business requirements are met
- **Process Validation**: Validation of documented business processes and workflows
- **Compliance Validation**: Verification of regulatory and compliance requirements
- **User Acceptance**: User acceptance testing and validation of documented procedures

### Approval Workflow
- **Review Stages**: Multi-stage review process with defined approval criteria
- **Approval Authority**: Clear definition of approval authority for each review stage
- **Escalation Process**: Defined escalation process for unresolved issues or conflicts
- **Decision Tracking**: Systematic tracking of all review decisions and approvals

### Sign-off Requirements
- **Technical Sign-off**: Required sign-off from technical leadership and architecture team
- **Business Sign-off**: Required sign-off from business owners and stakeholders
- **Compliance Sign-off**: Required sign-off from compliance and regulatory teams
- **Final Approval**: Final approval from project sponsor and executive leadership

### Document Versioning
- **Version Control**: Systematic version control throughout review and approval process
- **Change Tracking**: Detailed tracking of all changes made during review process
- **Approval Tracking**: Tracking of all approvals and sign-offs with timestamps
- **Final Version**: Establishment of final approved version with proper documentation

### Final Delivery Preparation
- **Format Finalization**: Final formatting and presentation preparation
- **Distribution Planning**: Planning for document distribution to all stakeholders
- **Training Preparation**: Preparation of training materials and user guides
- **Implementation Planning**: Planning for implementation and rollout of documented procedures`;

  return baseData;
};

const TTD_STAGES = {
  initial_questions: {
    id: 'initial_questions',
    name: 'Initial Questions',
    description: 'Gather initial project requirements and context',
    icon: <FileText className="h-5 w-5" />,
    color: 'from-blue-500 to-blue-600',
    questions: [
      {
        id: 'project_overview',
        question: 'What is the primary purpose of this system?',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the main business purpose and functionality...'
      },
      {
        id: 'business_context',
        question: 'What business processes does this system support?',
        type: 'textarea',
        required: true,
        placeholder: 'List the key business processes...'
      },
      {
        id: 'user_roles',
        question: 'Who are the primary users of this system?',
        type: 'textarea',
        required: true,
        placeholder: 'Describe user roles and responsibilities...'
      },
      {
        id: 'integration_points',
        question: 'What external systems does this integrate with?',
        type: 'textarea',
        required: false,
        placeholder: 'List external systems and APIs...'
      },
      {
        id: 'performance_requirements',
        question: 'What are the performance and scalability requirements?',
        type: 'textarea',
        required: false,
        placeholder: 'Describe performance expectations...'
      },
      ...DEFAULT_QUESTIONS.map(q => ({
        id: q.id,
        question: q.question,
        type: 'textarea',
        required: true,
        placeholder: q.default_answer,
        category: q.category
      }))
    ]
  },
  capability_design: {
    id: 'capability_design',
    name: 'Capability Design Stage',
    description: 'Define system capabilities and functional requirements',
    icon: <Target className="h-5 w-5" />,
    color: 'from-green-500 to-green-600',
    sections: [
      {
        id: 'modernization_strategy',
        title: 'Modernization Strategy',
        description: 'Determine the approach for capability transformation',
        fields: [
          { 
            id: 'replication_vs_modernization', 
            label: 'Do we want to replicate the existing capability flow or do we want to modernize?', 
            type: 'select', 
            options: ['Replicate Existing Flow', 'Modernize with Enhanced Features', 'Hybrid Approach - Replicate Core, Modernize Extensions'], 
            required: true,
            placeholder: 'Select the approach for capability transformation...'
          },
          { 
            id: 'modernization_rationale', 
            label: 'What is the rationale for the chosen approach?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Explain the business and technical reasoning for replication vs modernization, including cost-benefit analysis, risk assessment, and strategic alignment...'
          }
        ]
      },
      {
        id: 'business_functionalities',
        title: 'Business Functionalities',
        description: 'Core business processes and capabilities',
        fields: [
          { 
            id: 'primary_business_functions', 
            label: 'What are the primary business functions this capability must perform?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Describe the main business operations: customer onboarding, loan processing, payment handling, account management, regulatory compliance, etc. Include specific workflows and decision points...'
          },
          { 
            id: 'business_rules_engine', 
            label: 'What business rules and decision logic need to be implemented?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Detail validation rules, approval workflows, calculation logic, risk assessment criteria, compliance requirements, and any complex business logic that drives system behavior...'
          },
          { 
            id: 'data_transformation_requirements', 
            label: 'What data transformation and processing requirements exist?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Describe data aggregation, summarization, formatting, validation, enrichment, and any complex data processing operations required for business operations...'
          },
          { 
            id: 'workflow_automation', 
            label: 'What workflows and processes need to be automated?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Specify automated processes, scheduled jobs, event-driven workflows, approval chains, notification systems, and any orchestration requirements...'
          }
        ]
      },
      {
        id: 'technical_functionalities',
        title: 'Technical Functionalities',
        description: 'Technical capabilities and system features',
        fields: [
          { 
            id: 'data_processing_engine', 
            label: 'What data processing and computation capabilities are required?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Detail batch processing, real-time processing, data streaming, complex calculations, statistical analysis, data mining, and any computational requirements...'
          },
          { 
            id: 'storage_and_retrieval', 
            label: 'What data storage and retrieval patterns are needed?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Specify data persistence requirements, query patterns, indexing needs, archival strategies, data lifecycle management, and performance requirements for data access...'
          },
          { 
            id: 'user_interaction_patterns', 
            label: 'What user interaction and interface patterns are required?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Describe user interfaces, dashboards, forms, reports, search capabilities, navigation patterns, accessibility requirements, and any specialized user experience needs...'
          },
          { 
            id: 'system_monitoring', 
            label: 'What system monitoring and observability features are needed?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Detail logging requirements, metrics collection, alerting mechanisms, performance monitoring, health checks, audit trails, and operational visibility needs...'
          }
        ]
      },
      {
        id: 'integration_patterns',
        title: 'Integration Patterns',
        description: 'System integration and communication requirements',
        fields: [
          { 
            id: 'external_system_integrations', 
            label: 'What external systems need to be integrated with?', 
            type: 'textarea', 
            required: true,
            placeholder: 'List all external systems: credit bureaus, payment processors, regulatory systems, Ford internal systems, third-party APIs, legacy systems, and describe integration patterns (REST, SOAP, messaging, file transfer)...'
          },
          { 
            id: 'data_exchange_requirements', 
            label: 'What data exchange and synchronization requirements exist?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Specify data formats (JSON, XML, CSV, fixed-width), exchange protocols, frequency of updates, data mapping requirements, transformation rules, and synchronization strategies...'
          },
          { 
            id: 'api_design_requirements', 
            label: 'What API design and consumption requirements are needed?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Detail API endpoints needed, request/response patterns, authentication methods, rate limiting, versioning strategies, documentation requirements, and any specialized API capabilities...'
          },
          { 
            id: 'event_driven_architecture', 
            label: 'What event-driven and asynchronous processing is required?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Describe event publishing/subscribing patterns, message queues, asynchronous processing, real-time notifications, event sourcing, and any reactive programming requirements...'
          }
        ]
      },
      {
        id: 'security_and_compliance',
        title: 'Security and Compliance',
        description: 'Security, compliance, and governance requirements',
        fields: [
          { 
            id: 'security_requirements', 
            label: 'What security and access control requirements exist?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Detail authentication methods, authorization models, data encryption requirements, secure communication protocols, audit logging, and any specialized security features...'
          },
          { 
            id: 'compliance_framework', 
            label: 'What regulatory and compliance requirements must be met?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Specify regulatory frameworks (SOX, PCI-DSS, GDPR, etc.), compliance reporting requirements, data retention policies, audit requirements, and any industry-specific compliance needs...'
          }
        ]
      }
    ]
  },
  application_production_design: {
    id: 'application_production_design',
    name: 'Application Production Design',
    description: 'Define application architecture, production environment, and non-functional requirements',
    icon: <Settings className="h-5 w-5" />,
    color: 'from-purple-500 to-purple-600',
    sections: [
      {
        id: 'architecture_design',
        title: 'Application Architecture Design',
        description: 'System architecture patterns and design decisions',
        fields: [
          { 
            id: 'architecture_pattern', 
            label: 'What architecture pattern will be used for the modernized system?', 
            type: 'select', 
            options: ['Microservices', 'Monolithic', 'Layered', 'Event-Driven', 'Service-Oriented Architecture (SOA)', 'Domain-Driven Design (DDD)'], 
            required: true,
            placeholder: 'Select the primary architecture pattern that best fits the system requirements and business domain...'
          },
          { 
            id: 'technology_stack_selection', 
            label: 'What technology stack will be implemented for the modernized system?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Detail the complete technology stack: Java 21+ with Spring Boot 3.4.9, Spring Cloud 2024.0.2, Angular 16+ with TypeScript 5.0+, PostgreSQL 15+, Redis, Docker, Kubernetes, etc. Include specific versions and rationale for each choice...'
          },
          { 
            id: 'design_patterns_implementation', 
            label: 'What design patterns will be implemented in the system?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Specify design patterns: Repository Pattern, Factory Pattern, Observer Pattern, Strategy Pattern, Circuit Breaker, Retry Pattern, CQRS, Event Sourcing, etc. Include implementation rationale and benefits...'
          },
          { 
            id: 'service_decomposition_strategy', 
            label: 'How will the legacy system be decomposed into services or components?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Describe service boundaries, domain separation, API design, data ownership, service communication patterns, and how legacy COBOL modules map to modern services...'
          }
        ]
      },
      {
        id: 'production_infrastructure',
        title: 'Production Infrastructure & Environment',
        description: 'Production deployment and infrastructure requirements',
        fields: [
          { 
            id: 'deployment_architecture', 
            label: 'What deployment architecture and strategy will be used?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Detail deployment approach: Cloud Run, Kubernetes, Docker containers, CI/CD pipeline, blue-green deployment, canary releases, rollback strategies, and environment management (dev, test, staging, prod)...'
          },
          { 
            id: 'infrastructure_requirements', 
            label: 'What infrastructure requirements are needed for production?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Specify infrastructure needs: GCP services (Cloud Run, Cloud SQL, Pub/Sub, Cloud Storage), compute resources, memory requirements, storage capacity, network configuration, load balancers, CDN, and scaling requirements...'
          },
          { 
            id: 'monitoring_observability_setup', 
            label: 'What monitoring and observability setup will be implemented?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Detail monitoring strategy: Cloud Monitoring, Prometheus metrics, Grafana dashboards, distributed tracing (OpenTelemetry), logging (structured JSON), alerting rules, health checks, and operational dashboards...'
          },
          { 
            id: 'backup_disaster_recovery', 
            label: 'What backup and disaster recovery strategy will be implemented?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Specify backup strategy: automated backups, point-in-time recovery, cross-region replication, disaster recovery procedures, RTO/RPO targets, data retention policies, and recovery testing procedures...'
          }
        ]
      },
      {
        id: 'performance_requirements',
        title: 'Performance & Scalability Requirements',
        description: 'Performance, scalability, and throughput requirements',
        fields: [
          { 
            id: 'performance_benchmarks', 
            label: 'What are the performance requirements and benchmarks?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Specify performance targets: response time (95th percentile < 200ms), throughput (1000+ RPS), concurrent users (10,000+), batch processing capacity, memory usage limits, and CPU utilization targets...'
          },
          { 
            id: 'scalability_strategy', 
            label: 'What scalability strategy will be implemented?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Detail scaling approach: horizontal vs vertical scaling, auto-scaling policies, load balancing strategies, database scaling (read replicas, sharding), caching strategies, and capacity planning...'
          },
          { 
            id: 'resource_optimization', 
            label: 'What resource optimization strategies will be used?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Specify optimization techniques: connection pooling, caching layers (Redis), database query optimization, CDN usage, compression, lazy loading, and resource utilization monitoring...'
          }
        ]
      },
      {
        id: 'security_requirements',
        title: 'Security & Compliance Requirements',
        description: 'Security, authentication, and compliance requirements',
        fields: [
          { 
            id: 'security_architecture', 
            label: 'What security architecture and controls will be implemented?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Detail security measures: OAuth2/JWT authentication, RBAC authorization, API security (rate limiting, input validation), data encryption (at rest and in transit), network security, and security monitoring...'
          },
          { 
            id: 'compliance_framework', 
            label: 'What compliance and regulatory requirements must be met?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Specify compliance requirements: SOX, PCI-DSS, GDPR, HIPAA, industry-specific regulations, audit trails, data retention policies, privacy controls, and compliance reporting...'
          },
          { 
            id: 'access_control_management', 
            label: 'How will access control and identity management be handled?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Detail access management: Azure AD/EntraID integration, SSO implementation, user provisioning, role-based access control, API key management, and privileged access management...'
          }
        ]
      },
      {
        id: 'reliability_availability',
        title: 'Reliability & Availability Requirements',
        description: 'System reliability, availability, and fault tolerance',
        fields: [
          { 
            id: 'availability_targets', 
            label: 'What are the availability and reliability targets?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Specify availability requirements: 99.95% SLA, uptime targets, planned maintenance windows, service level objectives (SLOs), and business impact tolerance...'
          },
          { 
            id: 'fault_tolerance_design', 
            label: 'What fault tolerance and resilience patterns will be implemented?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Detail resilience strategies: circuit breakers, retry mechanisms, timeout handling, graceful degradation, bulkhead pattern, chaos engineering, and failure recovery procedures...'
          },
          { 
            id: 'error_handling_strategy', 
            label: 'What error handling and exception management strategy will be used?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Specify error handling: exception hierarchy, error codes, logging strategies, error reporting, user-friendly error messages, and error recovery mechanisms...'
          }
        ]
      },
      {
        id: 'maintainability_operability',
        title: 'Maintainability & Operability Requirements',
        description: 'System maintainability, operability, and support requirements',
        fields: [
          { 
            id: 'code_quality_standards', 
            label: 'What code quality and maintainability standards will be enforced?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Detail quality standards: code review processes, static analysis (SonarQube), unit testing coverage (85%+), integration testing, code documentation standards, and technical debt management...'
          },
          { 
            id: 'operational_procedures', 
            label: 'What operational procedures and runbooks will be created?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Specify operational needs: deployment procedures, monitoring runbooks, incident response procedures, troubleshooting guides, maintenance procedures, and operational metrics...'
          },
          { 
            id: 'support_escalation', 
            label: 'What support and escalation procedures will be established?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Detail support structure: help desk procedures, escalation paths, on-call responsibilities, support SLAs, knowledge base management, and user training requirements...'
          }
        ]
      },
      {
        id: 'integration_compatibility',
        title: 'Integration & Compatibility Requirements',
        description: 'System integration and compatibility requirements',
        fields: [
          { 
            id: 'api_design_standards', 
            label: 'What API design and integration standards will be followed?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Specify API standards: RESTful design principles, OpenAPI 3.0 specifications, versioning strategies, backward compatibility, API documentation, and integration testing approaches...'
          },
          { 
            id: 'data_compatibility', 
            label: 'What data format and compatibility requirements exist?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Detail data compatibility: data format standards (JSON, XML, CSV), schema evolution, data migration strategies, backward compatibility, and data validation requirements...'
          },
          { 
            id: 'legacy_system_integration', 
            label: 'How will the system integrate with legacy systems during transition?', 
            type: 'textarea', 
            required: true,
            placeholder: 'Specify legacy integration: data synchronization, API adapters, message queues, file transfer protocols, parallel running strategies, and migration cutover procedures...'
          }
        ]
      }
    ]
  },
  business_rules_logic: {
    id: 'business_rules_logic',
    name: 'Business Rules and Logic',
    description: 'Document business rules and logical workflows',
    icon: <Code className="h-5 w-5" />,
    color: 'from-orange-500 to-orange-600',
    sections: [
      {
        id: 'business_rules',
        title: 'Data Validation and Business Constraints',
        description: 'Core business rules and constraints',
        fields: [
          { 
            id: 'data_validation_rules', 
            label: 'Data Validation Rules', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define comprehensive data validation rules including field formats, data types, range checks, business rule validations, cross-field validations, and error handling for invalid data...',
            detailLevel: {
              id: 'data_validation_detail',
              label: 'Detail Level for Data Validation Rules',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed rules, error codes, validation logic)' },
                { value: 'overview', label: 'Overall Flow (high-level validation approach)' },
                { value: 'placeholder', label: 'Placeholder (basic structure only)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'business_constraints', 
            label: 'Business Constraints', 
            type: 'textarea', 
            required: true,
            placeholder: 'Specify business constraints including regulatory requirements, compliance rules, business policy restrictions, operational limits, and any constraints that must be enforced...',
            detailLevel: {
              id: 'business_constraints_detail',
              label: 'Detail Level for Business Constraints',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed constraints, enforcement rules)' },
                { value: 'overview', label: 'Overall Flow (constraint categories and approach)' },
                { value: 'placeholder', label: 'Placeholder (basic constraint areas)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'approval_workflows', 
            label: 'Approval Workflows', 
            type: 'textarea', 
            required: false,
            placeholder: 'Define approval workflows including approval hierarchies, routing logic, escalation procedures, notification requirements, and approval criteria...',
            detailLevel: {
              id: 'approval_workflows_detail',
              label: 'Detail Level for Approval Workflows',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed workflow steps, routing rules)' },
                { value: 'overview', label: 'Overall Flow (approval process overview)' },
                { value: 'placeholder', label: 'Placeholder (basic approval structure)' }
              ],
              default: 'overview'
            }
          },
          { 
            id: 'calculation_logic', 
            label: 'Calculation Logic', 
            type: 'textarea', 
            required: false,
            placeholder: 'Specify calculation logic including formulas, algorithms, computational rules, rounding policies, currency conversions, and any mathematical operations...',
            detailLevel: {
              id: 'calculation_logic_detail',
              label: 'Detail Level for Calculation Logic',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed formulas, algorithms)' },
                { value: 'overview', label: 'Overall Flow (calculation approach and key formulas)' },
                { value: 'placeholder', label: 'Placeholder (basic calculation areas)' }
              ],
              default: 'complete'
            }
          }
        ]
      },
      {
        id: 'workflow_logic',
        title: 'Process Workflows and Decision Trees',
        description: 'Process workflows and decision trees',
        fields: [
          { 
            id: 'process_flows', 
            label: 'Process Flows', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define process flows including step-by-step procedures, process triggers, parallel processing requirements, sequential dependencies, and process orchestration...',
            detailLevel: {
              id: 'process_flows_detail',
              label: 'Detail Level for Process Flows',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed flow diagrams, step descriptions)' },
                { value: 'overview', label: 'Overall Flow (high-level process overview)' },
                { value: 'placeholder', label: 'Placeholder (basic process structure)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'decision_points', 
            label: 'Decision Points', 
            type: 'textarea', 
            required: true,
            placeholder: 'Specify decision points including conditional logic, branching rules, decision criteria, threshold values, and routing decisions...',
            detailLevel: {
              id: 'decision_points_detail',
              label: 'Detail Level for Decision Points',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed decision trees, conditions)' },
                { value: 'overview', label: 'Overall Flow (key decision points and outcomes)' },
                { value: 'placeholder', label: 'Placeholder (basic decision areas)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'exception_handling', 
            label: 'Exception Handling', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define exception handling including error scenarios, recovery procedures, rollback mechanisms, logging requirements, and notification protocols...',
            detailLevel: {
              id: 'exception_handling_detail',
              label: 'Detail Level for Exception Handling',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed error handling, recovery procedures)' },
                { value: 'overview', label: 'Overall Flow (exception handling approach)' },
                { value: 'placeholder', label: 'Placeholder (basic error handling areas)' }
              ],
              default: 'overview'
            }
          },
          { 
            id: 'state_management', 
            label: 'State Management', 
            type: 'textarea', 
            required: true,
            placeholder: 'Specify state management including entity states, state transitions, state persistence, state validation, and state synchronization requirements...',
            detailLevel: {
              id: 'state_management_detail',
              label: 'Detail Level for State Management',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed state machine, transition rules)' },
                { value: 'overview', label: 'Overall Flow (state management approach)' },
                { value: 'placeholder', label: 'Placeholder (basic state areas)' }
              ],
              default: 'overview'
            }
          }
        ]
      }
    ]
  },
  data_handling_design: {
    id: 'data_handling_design',
    name: 'Data Handling Design',
    description: 'Define data models, storage, and processing strategies',
    icon: <Database className="h-5 w-5" />,
    color: 'from-cyan-500 to-cyan-600',
    sections: [
      {
        id: 'data_architecture_approach',
        title: 'Data Architecture Approach',
        description: 'Choose between file processing and database approaches',
        fields: [
          { 
            id: 'data_processing_approach', 
            label: 'Data Processing Approach', 
            type: 'select', 
            options: [
              'File-based processing (batch files, CSV, XML)',
              'Database-centric processing (real-time, transactional)',
              'Hybrid approach (files + database)',
              'Stream processing (real-time data streams)',
              'Cloud-native data processing (serverless, managed services)'
            ],
            required: true,
            placeholder: 'Select the primary data processing approach for the system...',
            detailLevel: {
              id: 'data_processing_approach_detail',
              label: 'Detail Level for Data Processing Approach',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed architecture, implementation plan)' },
                { value: 'overview', label: 'Overall Flow (high-level approach and key components)' },
                { value: 'placeholder', label: 'Placeholder (basic approach selection)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'file_processing_requirements', 
            label: 'File Processing Requirements (if applicable)', 
            type: 'textarea', 
            required: false,
            placeholder: 'If using file-based processing, specify file formats (CSV, XML, JSON, fixed-width), file sizes, processing frequency, file validation rules, error handling for malformed files, and file archival strategies...',
            detailLevel: {
              id: 'file_processing_detail',
              label: 'Detail Level for File Processing Requirements',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed file specs, validation rules)' },
                { value: 'overview', label: 'Overall Flow (file types and processing approach)' },
                { value: 'placeholder', label: 'Placeholder (basic file processing areas)' }
              ],
              default: 'overview'
            }
          }
        ]
      },
      {
        id: 'database_selection',
        title: 'Database Selection and Configuration',
        description: 'Choose database technology and configuration',
        fields: [
          { 
            id: 'database_type_selection', 
            label: 'Database Type Selection', 
            type: 'select', 
            options: [
              'Relational Database (PostgreSQL, MySQL, Oracle, SQL Server)',
              'NoSQL Document Database (MongoDB, CouchDB)',
              'NoSQL Key-Value Store (Redis, DynamoDB)',
              'NoSQL Column Family (Cassandra, HBase)',
              'Graph Database (Neo4j, Amazon Neptune)',
              'Time Series Database (InfluxDB, TimescaleDB)',
              'Cloud Managed Database (AWS RDS, Azure SQL, Google Cloud SQL)',
              'Hybrid Multi-Database Architecture'
            ],
            required: true,
            placeholder: 'Select the primary database technology that best fits the data requirements...',
            detailLevel: {
              id: 'database_type_detail',
              label: 'Detail Level for Database Type Selection',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed database specs, configuration)' },
                { value: 'overview', label: 'Overall Flow (database approach and key features)' },
                { value: 'placeholder', label: 'Placeholder (basic database selection)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'database_configuration', 
            label: 'Database Configuration Requirements', 
            type: 'textarea', 
            required: true,
            placeholder: 'Specify database configuration details: connection pooling settings, indexing strategy, partitioning rules, backup and recovery procedures, performance tuning parameters, scalability requirements, and disaster recovery planning...',
            detailLevel: {
              id: 'database_config_detail',
              label: 'Detail Level for Database Configuration',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed configuration parameters)' },
                { value: 'overview', label: 'Overall Flow (key configuration areas)' },
                { value: 'placeholder', label: 'Placeholder (basic configuration needs)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'database_access_patterns', 
            label: 'Database Access Patterns and Performance', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define database access patterns: read/write ratios, query complexity, transaction requirements, concurrent user expectations, caching strategy, connection management, and performance optimization techniques...',
            detailLevel: {
              id: 'db_access_patterns_detail',
              label: 'Detail Level for Database Access Patterns',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed access patterns, performance specs)' },
                { value: 'overview', label: 'Overall Flow (access approach and performance goals)' },
                { value: 'placeholder', label: 'Placeholder (basic access requirements)' }
              ],
              default: 'overview'
            }
          }
        ]
      },
      {
        id: 'data_access_rules',
        title: 'Data Access Rules and Security',
        description: 'Define data access control and security policies',
        fields: [
          { 
            id: 'database_access_control', 
            label: 'Database Access Control Rules', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define database access control: user roles and permissions, row-level security, column-level access control, database user management, privilege escalation policies, and audit logging requirements...',
            detailLevel: {
              id: 'db_access_control_detail',
              label: 'Detail Level for Database Access Control',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed access rules, security policies)' },
                { value: 'overview', label: 'Overall Flow (access control approach)' },
                { value: 'placeholder', label: 'Placeholder (basic access control areas)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'data_encryption_requirements', 
            label: 'Data Encryption and Security Requirements', 
            type: 'textarea', 
            required: true,
            placeholder: 'Specify data encryption requirements: encryption at rest, encryption in transit, key management, data masking for non-production, PII protection, compliance requirements (SOX, PCI-DSS, GDPR), and security monitoring...',
            detailLevel: {
              id: 'data_encryption_detail',
              label: 'Detail Level for Data Encryption Requirements',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed encryption specs, key management)' },
                { value: 'overview', label: 'Overall Flow (encryption approach and compliance)' },
                { value: 'placeholder', label: 'Placeholder (basic encryption needs)' }
              ],
              default: 'overview'
            }
          },
          { 
            id: 'data_backup_recovery', 
            label: 'Data Backup and Recovery Strategy', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define backup and recovery strategy: backup frequency, retention policies, recovery time objectives (RTO), recovery point objectives (RPO), disaster recovery procedures, data replication, and business continuity planning...',
            detailLevel: {
              id: 'backup_recovery_detail',
              label: 'Detail Level for Backup and Recovery Strategy',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed backup procedures, recovery plans)' },
                { value: 'overview', label: 'Overall Flow (backup approach and recovery goals)' },
                { value: 'placeholder', label: 'Placeholder (basic backup requirements)' }
              ],
              default: 'overview'
            }
          }
        ]
      },
      {
        id: 'data_migration_transformation',
        title: 'Data Migration and Transformation',
        description: 'Define data migration strategy and transformation rules',
        fields: [
          { 
            id: 'data_migration_strategy', 
            label: 'Data Migration Strategy', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define data migration strategy: migration approach (big bang vs incremental), data mapping from legacy to new systems, data cleansing requirements, validation procedures, rollback plans, and migration timeline...',
            detailLevel: {
              id: 'data_migration_detail',
              label: 'Detail Level for Data Migration Strategy',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed migration plan, procedures)' },
                { value: 'overview', label: 'Overall Flow (migration approach and key steps)' },
                { value: 'placeholder', label: 'Placeholder (basic migration areas)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'data_transformation_rules', 
            label: 'Data Transformation Rules', 
            type: 'textarea', 
            required: true,
            placeholder: 'Specify data transformation rules: field mapping, data type conversions, business rule transformations, data validation rules, error handling for transformation failures, and data quality checks...',
            detailLevel: {
              id: 'data_transformation_detail',
              label: 'Detail Level for Data Transformation Rules',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed transformation logic, rules)' },
                { value: 'overview', label: 'Overall Flow (transformation approach and key rules)' },
                { value: 'placeholder', label: 'Placeholder (basic transformation areas)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'data_validation_quality', 
            label: 'Data Validation and Quality Rules', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define data validation and quality rules: data completeness checks, format validation, business rule validation, referential integrity, data profiling requirements, and data quality monitoring...',
            detailLevel: {
              id: 'data_validation_detail',
              label: 'Detail Level for Data Validation and Quality Rules',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed validation rules, quality metrics)' },
                { value: 'overview', label: 'Overall Flow (validation approach and quality goals)' },
                { value: 'placeholder', label: 'Placeholder (basic validation areas)' }
              ],
              default: 'complete'
            }
          }
        ]
      }
    ]
  },
  testing_strategy: {
    id: 'testing_strategy',
    name: 'Testing Strategy',
    description: 'Define comprehensive testing approach and strategies',
    icon: <TestTube className="h-5 w-5" />,
    color: 'from-red-500 to-red-600',
    sections: [
      {
        id: 'testing_framework_selection',
        title: 'Testing Framework and Tool Selection',
        description: 'Choose testing frameworks and tools for different testing types',
        fields: [
          { 
            id: 'unit_testing_framework', 
            label: 'Unit Testing Framework Selection', 
            type: 'select', 
            options: [
              'JUnit 5 (Java)',
              'TestNG (Java)',
              'Jest + React Testing Library (React/JavaScript)',
              'Mocha + Chai (JavaScript)',
              'Pytest (Python)',
              'NUnit (C#)',
              'PHPUnit (PHP)',
              'RSpec (Ruby)'
            ],
            required: true,
            placeholder: 'Select the primary unit testing framework for the application...',
            detailLevel: {
              id: 'unit_testing_framework_detail',
              label: 'Detail Level for Unit Testing Framework',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed framework setup, configuration)' },
                { value: 'overview', label: 'Overall Flow (framework selection and key features)' },
                { value: 'placeholder', label: 'Placeholder (basic framework selection)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'integration_testing_tools', 
            label: 'Integration Testing Tools and Frameworks', 
            type: 'textarea', 
            required: true,
            placeholder: 'Specify integration testing tools: API testing tools (Postman, Newman, RestAssured), database testing tools, message queue testing, service virtualization tools, and test data management tools...',
            detailLevel: {
              id: 'integration_testing_tools_detail',
              label: 'Detail Level for Integration Testing Tools',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed tool setup, integration procedures)' },
                { value: 'overview', label: 'Overall Flow (tool selection and testing approach)' },
                { value: 'placeholder', label: 'Placeholder (basic tool areas)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'performance_testing_tools', 
            label: 'Performance and Load Testing Tools', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define performance testing tools: JMeter, Gatling, K6, LoadRunner, Artillery, or cloud-based solutions (BlazeMeter, AWS Load Testing). Specify tool configuration, test scenarios, and performance metrics...',
            detailLevel: {
              id: 'performance_testing_tools_detail',
              label: 'Detail Level for Performance Testing Tools',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed tool setup, test scenarios)' },
                { value: 'overview', label: 'Overall Flow (tool selection and performance approach)' },
                { value: 'placeholder', label: 'Placeholder (basic performance testing areas)' }
              ],
              default: 'overview'
            }
          }
        ]
      },
      {
        id: 'unit_testing_strategy',
        title: 'Unit Testing Strategy and Coverage',
        description: 'Define unit testing approach, coverage requirements, and mocking strategy',
        fields: [
          { 
            id: 'test_coverage_requirements', 
            label: 'Test Coverage Requirements and Metrics', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define test coverage requirements: minimum code coverage percentage (80%+), branch coverage requirements, critical path coverage, mutation testing requirements, and coverage reporting tools...',
            detailLevel: {
              id: 'test_coverage_requirements_detail',
              label: 'Detail Level for Test Coverage Requirements',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed coverage metrics, reporting)' },
                { value: 'overview', label: 'Overall Flow (coverage approach and key metrics)' },
                { value: 'placeholder', label: 'Placeholder (basic coverage areas)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'mocking_strategy', 
            label: 'Mocking and Test Doubles Strategy', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define mocking strategy: mock objects for external dependencies, database mocking, API mocking, message queue mocking, file system mocking, and test data isolation...',
            detailLevel: {
              id: 'mocking_strategy_detail',
              label: 'Detail Level for Mocking Strategy',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed mocking rules, test isolation)' },
                { value: 'overview', label: 'Overall Flow (mocking approach and key principles)' },
                { value: 'placeholder', label: 'Placeholder (basic mocking areas)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'unit_test_cases', 
            label: 'Unit Test Case Categories and Examples', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define unit test case categories: happy path testing, edge case testing, boundary value testing, error handling testing, business logic validation, and test case naming conventions...',
            detailLevel: {
              id: 'unit_test_cases_detail',
              label: 'Detail Level for Unit Test Cases',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed test categories, examples)' },
                { value: 'overview', label: 'Overall Flow (test case approach and key categories)' },
                { value: 'placeholder', label: 'Placeholder (basic test case areas)' }
              ],
              default: 'complete'
            }
          }
        ]
      },
      {
        id: 'integration_testing_strategy',
        title: 'Integration Testing Strategy',
        description: 'Define integration testing approach for APIs, databases, and external systems',
        fields: [
          { 
            id: 'api_testing_strategy', 
            label: 'API Testing Strategy', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define API testing strategy: REST API testing, SOAP API testing, GraphQL testing, API contract testing, authentication testing, rate limiting testing, and API performance testing...',
            detailLevel: {
              id: 'api_testing_strategy_detail',
              label: 'Detail Level for API Testing Strategy',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed API test scenarios, validation)' },
                { value: 'overview', label: 'Overall Flow (API testing approach and key areas)' },
                { value: 'placeholder', label: 'Placeholder (basic API testing areas)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'database_integration_testing', 
            label: 'Database Integration Testing', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define database integration testing: CRUD operations testing, transaction testing, data integrity testing, stored procedure testing, database performance testing, and test data management...',
            detailLevel: {
              id: 'database_integration_testing_detail',
              label: 'Detail Level for Database Integration Testing',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed DB test scenarios, data validation)' },
                { value: 'overview', label: 'Overall Flow (database testing approach and key areas)' },
                { value: 'placeholder', label: 'Placeholder (basic database testing areas)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'external_system_integration', 
            label: 'External System Integration Testing', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define external system integration testing: third-party API integration, message queue integration, file transfer testing, payment gateway testing, and service virtualization for external dependencies...',
            detailLevel: {
              id: 'external_system_integration_detail',
              label: 'Detail Level for External System Integration Testing',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed integration test scenarios)' },
                { value: 'overview', label: 'Overall Flow (integration testing approach and key areas)' },
                { value: 'placeholder', label: 'Placeholder (basic integration testing areas)' }
              ],
              default: 'overview'
            }
          }
        ]
      },
      {
        id: 'performance_security_testing',
        title: 'Performance and Security Testing',
        description: 'Define performance, load, and security testing strategies',
        fields: [
          { 
            id: 'performance_testing_strategy', 
            label: 'Performance Testing Strategy', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define performance testing strategy: load testing scenarios, stress testing limits, volume testing requirements, spike testing, endurance testing, and performance benchmarks...',
            detailLevel: {
              id: 'performance_testing_strategy_detail',
              label: 'Detail Level for Performance Testing Strategy',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed performance test scenarios, metrics)' },
                { value: 'overview', label: 'Overall Flow (performance testing approach and key metrics)' },
                { value: 'placeholder', label: 'Placeholder (basic performance testing areas)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'security_testing_strategy', 
            label: 'Security Testing Strategy', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define security testing strategy: penetration testing, vulnerability scanning, authentication testing, authorization testing, data encryption testing, and compliance testing (OWASP, PCI-DSS)...',
            detailLevel: {
              id: 'security_testing_strategy_detail',
              label: 'Detail Level for Security Testing Strategy',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed security test scenarios, compliance)' },
                { value: 'overview', label: 'Overall Flow (security testing approach and key areas)' },
                { value: 'placeholder', label: 'Placeholder (basic security testing areas)' }
              ],
              default: 'overview'
            }
          },
          { 
            id: 'load_stress_testing', 
            label: 'Load and Stress Testing Requirements', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define load and stress testing requirements: concurrent user loads, transaction volumes, system resource limits, failure scenarios, recovery testing, and scalability testing...',
            detailLevel: {
              id: 'load_stress_testing_detail',
              label: 'Detail Level for Load and Stress Testing',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed load test scenarios, thresholds)' },
                { value: 'overview', label: 'Overall Flow (load testing approach and key requirements)' },
                { value: 'placeholder', label: 'Placeholder (basic load testing areas)' }
              ],
              default: 'overview'
            }
          }
        ]
      },
      {
        id: 'test_automation_ci_cd',
        title: 'Test Automation and CI/CD Integration',
        description: 'Define test automation strategy and continuous integration testing',
        fields: [
          { 
            id: 'test_automation_strategy', 
            label: 'Test Automation Strategy', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define test automation strategy: automated test execution, test data management, test environment provisioning, test reporting, and test maintenance procedures...',
            detailLevel: {
              id: 'test_automation_strategy_detail',
              label: 'Detail Level for Test Automation Strategy',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed automation procedures, tools)' },
                { value: 'overview', label: 'Overall Flow (automation approach and key processes)' },
                { value: 'placeholder', label: 'Placeholder (basic automation areas)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'ci_cd_testing_integration', 
            label: 'CI/CD Pipeline Testing Integration', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define CI/CD testing integration: unit tests in build pipeline, integration tests in deployment pipeline, smoke tests in production, rollback testing procedures, and quality gates...',
            detailLevel: {
              id: 'ci_cd_testing_integration_detail',
              label: 'Detail Level for CI/CD Testing Integration',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed pipeline integration, quality gates)' },
                { value: 'overview', label: 'Overall Flow (CI/CD testing approach and key stages)' },
                { value: 'placeholder', label: 'Placeholder (basic CI/CD testing areas)' }
              ],
              default: 'overview'
            }
          },
          { 
            id: 'test_environment_management', 
            label: 'Test Environment Management', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define test environment management: environment provisioning, test data management, environment isolation, configuration management, and environment cleanup procedures...',
            detailLevel: {
              id: 'test_environment_management_detail',
              label: 'Detail Level for Test Environment Management',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed environment procedures, data management)' },
                { value: 'overview', label: 'Overall Flow (environment approach and key processes)' },
                { value: 'placeholder', label: 'Placeholder (basic environment management areas)' }
              ],
              default: 'overview'
            }
          }
        ]
      }
    ]
  },
  deployment_strategy: {
    id: 'deployment_strategy',
    name: 'Deployment Strategy',
    description: 'Define deployment processes and rollback strategies',
    icon: <Settings className="h-5 w-5" />,
    color: 'from-indigo-500 to-indigo-600',
    sections: [
      {
        id: 'deployment_approach_selection',
        title: 'Deployment Approach Selection',
        description: 'Choose deployment strategy and decide if this stage is needed',
        fields: [
          { 
            id: 'skip_deployment_stage', 
            label: 'Skip Deployment Planning Stage', 
            type: 'select', 
            options: [
              'No',
              'Yes'
            ],
            required: true,
            placeholder: 'Choose whether to skip the deployment planning stage entirely...',
            detailLevel: {
              id: 'skip_deployment_stage_detail',
              label: 'Detail Level for Skip Decision',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed reasoning for skip decision)' },
                { value: 'overview', label: 'Overall Flow (high-level skip rationale)' },
                { value: 'placeholder', label: 'Placeholder (basic skip decision)' }
              ],
              default: 'overview'
            }
          },
          { 
            id: 'deployment_method', 
            label: 'Deployment Method Selection', 
            type: 'select', 
            options: [
              'Manual Deployment (traditional deployment)',
              'Automated CI/CD Pipeline Deployment',
              'Blue-Green Deployment',
              'Canary Deployment',
              'Rolling Deployment',
              'Immutable Infrastructure Deployment',
              'Container-based Deployment (Docker/Kubernetes)',
              'Serverless Deployment',
              'Hybrid Deployment Strategy'
            ],
            required: true,
            placeholder: 'Select the primary deployment method for the system...',
            detailLevel: {
              id: 'deployment_method_detail',
              label: 'Detail Level for Deployment Method',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed deployment strategy, procedures)' },
                { value: 'overview', label: 'Overall Flow (deployment approach and key components)' },
                { value: 'placeholder', label: 'Placeholder (basic deployment method selection)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'deployment_environment_strategy', 
            label: 'Deployment Environment Strategy', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define deployment environment strategy: development, staging, pre-production, production environments, environment promotion process, configuration management, and environment-specific settings...',
            detailLevel: {
              id: 'deployment_environment_strategy_detail',
              label: 'Detail Level for Deployment Environment Strategy',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed environment setup, promotion procedures)' },
                { value: 'overview', label: 'Overall Flow (environment approach and key processes)' },
                { value: 'placeholder', label: 'Placeholder (basic environment areas)' }
              ],
              default: 'complete'
            }
          }
        ]
      },
      {
        id: 'deployment_process_planning',
        title: 'Deployment Process Planning',
        description: 'Define detailed deployment procedures and workflows',
        fields: [
          { 
            id: 'deployment_phases', 
            label: 'Deployment Phases and Workflow', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define deployment phases: pre-deployment checks, deployment execution steps, post-deployment validation, smoke testing, monitoring setup, and go-live procedures...',
            detailLevel: {
              id: 'deployment_phases_detail',
              label: 'Detail Level for Deployment Phases',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed phase procedures, checklists)' },
                { value: 'overview', label: 'Overall Flow (deployment approach and key phases)' },
                { value: 'placeholder', label: 'Placeholder (basic deployment phases)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'deployment_automation', 
            label: 'Deployment Automation and CI/CD Integration', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define deployment automation: automated build and deployment pipelines, infrastructure as code, configuration management, automated testing in deployment pipeline, and deployment approval processes...',
            detailLevel: {
              id: 'deployment_automation_detail',
              label: 'Detail Level for Deployment Automation',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed automation procedures, CI/CD setup)' },
                { value: 'overview', label: 'Overall Flow (automation approach and key processes)' },
                { value: 'placeholder', label: 'Placeholder (basic automation areas)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'deployment_validation', 
            label: 'Deployment Validation and Testing', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define deployment validation: health checks, smoke tests, integration tests, performance validation, security checks, and user acceptance testing procedures...',
            detailLevel: {
              id: 'deployment_validation_detail',
              label: 'Detail Level for Deployment Validation',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed validation procedures, test scenarios)' },
                { value: 'overview', label: 'Overall Flow (validation approach and key checks)' },
                { value: 'placeholder', label: 'Placeholder (basic validation areas)' }
              ],
              default: 'complete'
            }
          }
        ]
      },
      {
        id: 'rollback_recovery_strategy',
        title: 'Rollback and Recovery Strategy',
        description: 'Define rollback procedures and disaster recovery',
        fields: [
          { 
            id: 'rollback_strategy', 
            label: 'Rollback Strategy and Procedures', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define rollback strategy: automatic rollback triggers, manual rollback procedures, rollback time objectives, data rollback procedures, and rollback testing...',
            detailLevel: {
              id: 'rollback_strategy_detail',
              label: 'Detail Level for Rollback Strategy',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed rollback procedures, triggers)' },
                { value: 'overview', label: 'Overall Flow (rollback approach and key procedures)' },
                { value: 'placeholder', label: 'Placeholder (basic rollback areas)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'disaster_recovery', 
            label: 'Disaster Recovery and Business Continuity', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define disaster recovery: backup and recovery procedures, failover mechanisms, recovery time objectives (RTO), recovery point objectives (RPO), and business continuity planning...',
            detailLevel: {
              id: 'disaster_recovery_detail',
              label: 'Detail Level for Disaster Recovery',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed recovery procedures, RTO/RPO targets)' },
                { value: 'overview', label: 'Overall Flow (recovery approach and key procedures)' },
                { value: 'placeholder', label: 'Placeholder (basic recovery areas)' }
              ],
              default: 'overview'
            }
          },
          { 
            id: 'monitoring_alerting', 
            label: 'Deployment Monitoring and Alerting', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define deployment monitoring: real-time monitoring setup, alerting thresholds, performance monitoring, error tracking, log aggregation, and incident response procedures...',
            detailLevel: {
              id: 'monitoring_alerting_detail',
              label: 'Detail Level for Deployment Monitoring',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed monitoring setup, alerting rules)' },
                { value: 'overview', label: 'Overall Flow (monitoring approach and key metrics)' },
                { value: 'placeholder', label: 'Placeholder (basic monitoring areas)' }
              ],
              default: 'overview'
            }
          }
        ]
      },
      {
        id: 'environment_configuration',
        title: 'Environment Configuration and Management',
        description: 'Define environment setup and configuration management',
        fields: [
          { 
            id: 'environment_setup', 
            label: 'Environment Setup and Provisioning', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define environment setup: infrastructure provisioning, environment configuration, database setup, application configuration, security configuration, and environment-specific settings...',
            detailLevel: {
              id: 'environment_setup_detail',
              label: 'Detail Level for Environment Setup',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed setup procedures, configuration)' },
                { value: 'overview', label: 'Overall Flow (environment approach and key setup areas)' },
                { value: 'placeholder', label: 'Placeholder (basic environment areas)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'configuration_management', 
            label: 'Configuration Management Strategy', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define configuration management: configuration versioning, environment-specific configurations, secret management, configuration validation, and configuration deployment procedures...',
            detailLevel: {
              id: 'configuration_management_detail',
              label: 'Detail Level for Configuration Management',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed config management procedures)' },
                { value: 'overview', label: 'Overall Flow (config management approach and key areas)' },
                { value: 'placeholder', label: 'Placeholder (basic config management areas)' }
              ],
              default: 'overview'
            }
          },
          { 
            id: 'deployment_checklist', 
            label: 'Deployment Checklist and Quality Gates', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define deployment checklist: pre-deployment checks, deployment execution checklist, post-deployment validation checklist, quality gates, approval processes, and sign-off procedures...',
            detailLevel: {
              id: 'deployment_checklist_detail',
              label: 'Detail Level for Deployment Checklist',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed checklists, quality gates)' },
                { value: 'overview', label: 'Overall Flow (checklist approach and key areas)' },
                { value: 'placeholder', label: 'Placeholder (basic checklist areas)' }
              ],
              default: 'complete'
            }
          }
        ]
      }
    ]
  },
  maintenance_support: {
    id: 'maintenance_support',
    name: 'Maintenance & Support',
    description: 'Define ongoing maintenance and support procedures',
    icon: <Users className="h-5 w-5" />,
    color: 'from-teal-500 to-teal-600',
    sections: [
      {
        id: 'maintenance_procedures',
        title: 'Comprehensive Maintenance and Support Procedures',
        description: 'Define ongoing maintenance, monitoring, updates, and user support procedures',
        fields: [
          { 
            id: 'maintenance_schedule', 
            label: 'Maintenance Schedule and Windows', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define comprehensive maintenance schedules including: regular maintenance windows (daily, weekly, monthly, quarterly), planned downtime schedules, peak usage avoidance periods, emergency maintenance procedures, maintenance calendar integration, and coordination with business operations...',
            detailLevel: {
              id: 'maintenance_schedule_detail',
              label: 'Detail Level for Maintenance Schedule',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed schedules, procedures, calendars)' },
                { value: 'overview', label: 'Overall Flow (maintenance approach and key schedules)' },
                { value: 'placeholder', label: 'Placeholder (basic maintenance areas)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'update_procedures', 
            label: 'System Update and Change Management Procedures', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define comprehensive update procedures including: patch management process, version control procedures, update testing protocols, rollback procedures, update approval workflows, change management processes, and update deployment strategies...',
            detailLevel: {
              id: 'update_procedures_detail',
              label: 'Detail Level for Update Procedures',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed procedures, workflows, protocols)' },
                { value: 'overview', label: 'Overall Flow (update approach and key procedures)' },
                { value: 'placeholder', label: 'Placeholder (basic update areas)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'monitoring_setup', 
            label: 'System Monitoring, Alerting, and Performance Management', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define comprehensive monitoring setup including: key performance indicators (KPIs), monitoring tools and platforms, alert thresholds and escalation procedures, dashboard configurations, performance optimization procedures, incident response protocols, and capacity planning processes...',
            detailLevel: {
              id: 'monitoring_setup_detail',
              label: 'Detail Level for Monitoring Setup',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed monitoring config, alert rules, procedures)' },
                { value: 'overview', label: 'Overall Flow (monitoring approach and key metrics)' },
                { value: 'placeholder', label: 'Placeholder (basic monitoring areas)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'documentation_updates', 
            label: 'Documentation Maintenance and User Support Procedures', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define documentation and support procedures including: documentation update schedules, documentation version control, user manual maintenance, technical documentation updates, help desk operations, user training programs, support ticket management, and user onboarding procedures...',
            detailLevel: {
              id: 'documentation_updates_detail',
              label: 'Detail Level for Documentation and Support',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed procedures, training programs, support processes)' },
                { value: 'overview', label: 'Overall Flow (documentation and support approach)' },
                { value: 'placeholder', label: 'Placeholder (basic documentation and support areas)' }
              ],
              default: 'complete'
            }
          }
        ]
      }
    ]
  },
  ttd_deduplication: {
    id: 'ttd_deduplication',
    name: 'TTD De-duplication & Consolidation',
    description: 'Remove duplicates and consolidate all TTD sections',
    icon: <FileText className="h-5 w-5" />,
    color: 'from-purple-500 to-purple-600',
    sections: [
      {
        id: 'deduplication_process',
        title: 'TTD Consolidation and De-duplication Process',
        description: 'Combine multiple TTD sections, remove duplicates, and create final consolidated document',
        fields: [
          { 
            id: 'duplicate_identification', 
            label: 'Duplicate Content Identification and Analysis', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define comprehensive duplicate identification strategy including: automated duplicate detection algorithms, manual review processes, content similarity analysis, cross-reference checking between TTD sections, redundant information identification, and duplicate content categorization (exact matches, near-duplicates, conceptual overlaps)...',
            detailLevel: {
              id: 'duplicate_identification_detail',
              label: 'Detail Level for Duplicate Identification',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed algorithms, analysis procedures)' },
                { value: 'overview', label: 'Overall Flow (identification approach and key methods)' },
                { value: 'placeholder', label: 'Placeholder (basic duplicate detection areas)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'consolidation_rules', 
            label: 'TTD Consolidation Rules and Merge Strategies', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define comprehensive consolidation rules including: merge priority rules (which TTD section takes precedence), content integration strategies, section reorganization procedures, cross-reference resolution, conflicting information handling, version control during consolidation, and final document structure planning...',
            detailLevel: {
              id: 'consolidation_rules_detail',
              label: 'Detail Level for Consolidation Rules',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed merge strategies, conflict resolution)' },
                { value: 'overview', label: 'Overall Flow (consolidation approach and key rules)' },
                { value: 'placeholder', label: 'Placeholder (basic consolidation areas)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'content_optimization', 
            label: 'Content Optimization and Streamlining', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define content optimization procedures including: redundant text removal, content streamlining strategies, information density optimization, readability improvement, technical accuracy verification, consistency checking across sections, and final content validation...',
            detailLevel: {
              id: 'content_optimization_detail',
              label: 'Detail Level for Content Optimization',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed optimization procedures, validation processes)' },
                { value: 'overview', label: 'Overall Flow (optimization approach and key strategies)' },
                { value: 'placeholder', label: 'Placeholder (basic optimization areas)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'quality_checks', 
            label: 'Quality Assurance and Validation Checks', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define comprehensive quality assurance procedures including: completeness verification (all required sections present), accuracy validation, consistency checking, formatting standardization, cross-reference validation, technical correctness review, and final quality gates...',
            detailLevel: {
              id: 'quality_checks_detail',
              label: 'Detail Level for Quality Checks',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed validation procedures, quality gates)' },
                { value: 'overview', label: 'Overall Flow (quality assurance approach and key checks)' },
                { value: 'placeholder', label: 'Placeholder (basic quality areas)' }
              ],
              default: 'complete'
            }
          },
          { 
            id: 'final_review', 
            label: 'Final Document Review and Approval Process', 
            type: 'textarea', 
            required: true,
            placeholder: 'Define final review and approval procedures including: stakeholder review process, technical review requirements, business validation procedures, approval workflow, sign-off requirements, document versioning, and final delivery preparation...',
            detailLevel: {
              id: 'final_review_detail',
              label: 'Detail Level for Final Review',
              type: 'select',
              options: [
                { value: 'complete', label: 'Complete Definition (detailed review procedures, approval workflows)' },
                { value: 'overview', label: 'Overall Flow (review approach and key requirements)' },
                { value: 'placeholder', label: 'Placeholder (basic review areas)' }
              ],
              default: 'complete'
            }
          }
        ]
      }
    ]
  }
};

export default function TTDGeneration({ projectName, onClose }) {
  const { theme } = useTheme();
  const [currentStage, setCurrentStage] = useState('initial_questions');
  const [formData, setFormData] = useState({});
  const [completedStages, setCompletedStages] = useState(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedSMEs, setSelectedSMEs] = useState([]);
  const [showSMEQuestions, setShowSMEQuestions] = useState(false);
  const [smeQuestions, setSmeQuestions] = useState('');
  const [editingField, setEditingField] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState({});
  const [showPromptReview, setShowPromptReview] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [stageTTDs, setStageTTDs] = useState({});
  const [stageQA, setStageQA] = useState({});
  const [showStageQA, setShowStageQA] = useState(false);
  const [editingTTD, setEditingTTD] = useState(false);
  const [editedTTDContent, setEditedTTDContent] = useState('');
  const [showReasoningStage, setShowReasoningStage] = useState(false);
  const [reasoningQuestions, setReasoningQuestions] = useState([]);
  const [reasoningAnswers, setReasoningAnswers] = useState({});
  const [currentReasoningRound, setCurrentReasoningRound] = useState(1);
  const [maxReasoningRounds] = useState(3);
  const [ttdProgress, setTtdProgress] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [processingStages, setProcessingStages] = useState(new Set());
  const [showCompletionPage, setShowCompletionPage] = useState(false);
  const [completedTTDs, setCompletedTTDs] = useState([]);
  const [showTTDCombination, setShowTTDCombination] = useState(false);
  const [selectedTTDs, setSelectedTTDs] = useState([]);

  // Initialize with pre-filled data
  useEffect(() => {
    const prefilledData = getPrefilledData(projectName);
    setFormData(prefilledData);
  }, [projectName]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-panel')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const stageKeys = Object.keys(TTD_STAGES);
  const currentStageIndex = stageKeys.indexOf(currentStage);

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSMESelection = (smeId) => {
    setSelectedSMEs(prev => {
      if (prev.includes(smeId)) {
        return prev.filter(id => id !== smeId);
      } else {
        return [...prev, smeId];
      }
    });
  };

  const handleSendSMEQuestions = () => {
    if (selectedSMEs.length === 0) {
      alert('Please select at least one SME to send questions to.');
      return;
    }
    
    if (!smeQuestions.trim()) {
      alert('Please enter questions to send to SMEs.');
      return;
    }

    const selectedSMENames = selectedSMEs.map(id => 
      SME_OPTIONS.find(sme => sme.id === id)?.name
    ).join(', ');

    alert(`Questions sent to: ${selectedSMENames}\n\nQuestions: ${smeQuestions}`);
    setShowSMEQuestions(false);
    setSmeQuestions('');
  };

  const toggleEditing = (fieldId) => {
    setEditingField(editingField === fieldId ? null : fieldId);
  };

  const handleDocumentSelection = (categoryId, documentId, selected) => {
    setSelectedDocuments(prev => ({
      ...prev,
      [categoryId]: selected 
        ? [...(prev[categoryId] || []), documentId]
        : (prev[categoryId] || []).filter(id => id !== documentId)
    }));
  };

  const handleStageQAChange = (questionId, answer) => {
    setStageQA(prev => ({
      ...prev,
      [currentStage]: {
        ...prev[currentStage],
        [questionId]: answer
      }
    }));
  };

  const addStageQuestion = () => {
    const questionId = `q_${Date.now()}`;
    setStageQA(prev => ({
      ...prev,
      [currentStage]: {
        ...prev[currentStage],
        [questionId]: ''
      }
    }));
  };

  const handleReasoningAnswerChange = (questionId, answer) => {
    setReasoningAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleReasoningSubmit = async () => {
    // Check if all questions are answered
    const allAnswered = reasoningQuestions.every(q => reasoningAnswers[q.id]?.trim());
    if (!allAnswered) {
      alert('Please answer all questions before proceeding.');
      return;
    }

    // Simulate processing reasoning answers
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if we should ask follow-up questions
    const nextRound = currentReasoningRound + 1;
    if (nextRound <= maxReasoningRounds) {
      const followUpQuestions = getReasoningQuestions(currentStage, nextRound);
      if (followUpQuestions.length > 0) {
        setReasoningQuestions(followUpQuestions);
        setCurrentReasoningRound(nextRound);
        setReasoningAnswers({});
        setIsGenerating(false);
        return;
      }
    }

    // No more questions, close reasoning stage
    setShowReasoningStage(false);
    setReasoningQuestions([]);
    setReasoningAnswers({});
    setCurrentReasoningRound(1);
    setIsGenerating(false);
  };

  const handleReasoningSkip = () => {
    setShowReasoningStage(false);
    setReasoningQuestions([]);
    setReasoningAnswers({});
    setCurrentReasoningRound(1);
  };

  const handleEditTTD = () => {
    const currentTTD = stageTTDs[currentStage] || '';
    setEditedTTDContent(currentTTD);
    setEditingTTD(true);
  };

  const handleSaveTTD = () => {
    setStageTTDs(prev => ({
      ...prev,
      [currentStage]: editedTTDContent
    }));
    setEditingTTD(false);
    addNotification('TTD content saved successfully', 'success');
  };

  const handleCancelEditTTD = () => {
    setEditingTTD(false);
    setEditedTTDContent('');
  };

  // Notification system functions
  const addNotification = (type, title, message, stageId = null) => {
    const notification = {
      id: Date.now(),
      type, // 'success', 'info', 'warning', 'error'
      title,
      message,
      stageId,
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [notification, ...prev]);
    
    // Auto-remove notification after 10 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 10000);
  };

  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // TTD Progress tracking
  const updateTTDProgress = (stageId, progress, status) => {
    setTtdProgress(prev => ({
      ...prev,
      [stageId]: { progress, status, updatedAt: new Date() }
    }));
  };

  const startTTDProcessing = (stageId) => {
    setProcessingStages(prev => new Set([...prev, stageId]));
    updateTTDProgress(stageId, 0, 'processing');
    addNotification('info', 'TTD Generation Started', `Started generating TTD for ${TTD_STAGES[stageId]?.name || stageId}`, stageId);
  };

  const completeTTDProcessing = (stageId) => {
    setProcessingStages(prev => {
      const newSet = new Set(prev);
      newSet.delete(stageId);
      return newSet;
    });
    updateTTDProgress(stageId, 100, 'completed');
    addNotification('success', 'TTD Generation Complete', `TTD for ${TTD_STAGES[stageId]?.name || stageId} is ready for review`, stageId);
  };

  const simulateTTDProgress = async (stageId) => {
    startTTDProcessing(stageId);
    
    // Simulate progress updates
    for (let progress = 10; progress <= 90; progress += 20) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateTTDProgress(stageId, progress, 'processing');
    }
    
    // Final processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    completeTTDProcessing(stageId);
  };

  const generatePrompt = () => {
    const stage = TTD_STAGES[currentStage];
    const selectedDocs = Object.values(selectedDocuments).flat();
    const stageQuestions = Object.entries(stageQA[currentStage] || {})
      .map(([id, answer]) => `Q: ${id}\nA: ${answer}`)
      .join('\n\n');

    const prompt = `
# Technical Transfer Document Generation Prompt
## COBOL to Java Conversion - ${projectName} Project

### Project Context
We are generating a comprehensive Technical Transfer Document (TTD) for converting the ${projectName} legacy COBOL system to modern Java architecture. This document will serve as a complete guide for the technical transfer process, ensuring seamless migration while maintaining system functionality and improving maintainability.

### Current Stage: ${stage.name}
**Stage Description**: ${stage.description}

### Selected Input Documents
${selectedDocs.length > 0 ? selectedDocs.map(docId => {
  const category = DOCUMENT_CATEGORIES.find(cat => 
    cat.documents.some(doc => doc.id === docId)
  );
  const document = category?.documents.find(doc => doc.id === docId);
  return `- ${document?.name} (${category?.name})`;
}).join('\n') : 'No documents selected for this stage'}

### System Requirements & Architecture
${Object.entries(formData).filter(([key, value]) => value && value.trim()).map(([key, value]) => {
  const question = stage.questions?.find(q => q.id === key);
  const questionText = question ? question.question : key;
  return `**${questionText}**: ${value}`;
}).join('\n\n')}

### Stage-Specific Questions & Answers
${stageQuestions || 'No stage-specific questions provided'}

### SME Collaboration
${smeQuestions ? `**Questions for Subject Matter Experts**: ${smeQuestions}\n**Selected SMEs**: ${selectedSMEs.map(id => SME_OPTIONS.find(sme => sme.id === id)?.name).join(', ')}` : 'No SME questions provided'}

### TTD Generation Instructions
Generate a comprehensive Technical Transfer Document section for **${stage.name}** that includes:

1. **Current State Analysis**: Detailed analysis of the COBOL system's current implementation for this stage
2. **Target Architecture**: Java-based solution design following microservices architecture
3. **Migration Strategy**: Step-by-step approach for converting COBOL components to Java
4. **Technical Specifications**: Detailed technical requirements, APIs, data models, and integration points
5. **Implementation Guidelines**: Coding standards, patterns, and best practices for Java development
6. **Testing Strategy**: Comprehensive testing approach including unit, integration, and system tests
7. **Risk Assessment**: Potential challenges and mitigation strategies
8. **Dependencies**: Required tools, libraries, and external services
9. **Performance Considerations**: Scalability, performance, and optimization requirements
10. **Documentation Requirements**: Code documentation, API documentation, and operational runbooks

**Focus Areas for ${stage.name}:**
- Ensure all COBOL business logic is properly mapped to Java equivalent
- Maintain data integrity and business rule compliance
- Follow Ford's technology stack and architectural standards
- Include specific implementation details for the target platform (GCP)
- Provide actionable guidance for development teams

**Output Format**: Generate detailed, technical content that can be directly used by development teams to implement the Java solution.
    `.trim();

    setCurrentPrompt(prompt);
    setShowPromptReview(true);
  };

  // Mock reasoning questions for different stages
  const getReasoningQuestions = (stageId, round = 1) => {
    const questionsByStage = {
      'initial_questions': {
        1: [
        {
          id: 'q1',
          question: "I notice the data processing capability has a SSN processing capability. Do you have existing modules for this or would you like us to design this from scratch. If the former, point us to the github link or upload the code here.",
          type: 'clarification'
        },
          {
            id: 'q2', 
            question: "For the regulatory compliance reporting, which specific regulations does the system need to comply with (e.g., GDPR, SOX, PCI-DSS)?",
            type: 'requirement'
          }
        ],
        2: [
          {
            id: 'q3',
            question: "Based on your previous answers, I see you're using Spring Batch for data processing. How do you plan to handle the migration of existing COBOL batch jobs that run on a nightly schedule?",
            type: 'technical'
          }
        ]
      },
      'capability_design': {
        1: [
          {
            id: 'q4',
            question: "For the Data Processing capability, what are the expected transaction volumes and peak load requirements?",
            type: 'performance'
          },
          {
            id: 'q5',
            question: "How should the Data Transmission capability handle real-time vs batch data transfer requirements?",
            type: 'architecture'
          }
        ]
      },
      'application_production_design': {
        1: [
          {
            id: 'q6',
            question: "For the microservices architecture, how many services do you anticipate breaking the monolith into, and what are the main domain boundaries?",
            type: 'design'
          }
        ]
      }
    };

    return questionsByStage[stageId]?.[round] || [];
  };

  const shouldShowReasoningStage = (stageId) => {
    // Define which stages should have reasoning (not all stages need it)
    const stagesWithReasoning = ['initial_questions', 'capability_design', 'application_production_design'];
    return stagesWithReasoning.includes(stageId);
  };

  // Generate stage-specific TTD content
  const generateStageSpecificTTD = (stageId, stage, selectedDocs) => {
    if (stageId === 'capability_design') {
      return generateCapabilityDesignTTD(stage, selectedDocs);
    }
    if (stageId === 'application_production_design') {
      return generateApplicationProductionDesignTTD(stage, selectedDocs);
    }
    // Default TTD for other stages
    return generateDefaultTTD(stage, selectedDocs);
  };

  const generateCapabilityDesignTTD = (stage, selectedDocs) => {
    const modernizationApproach = formData.replication_vs_modernization || '[PENDING]';
    const modernizationRationale = formData.modernization_rationale || '[PENDING]';
    const primaryBusinessFunctions = formData.primary_business_functions || '[PENDING]';
    const businessRulesEngine = formData.business_rules_engine || '[PENDING]';
    const dataTransformationRequirements = formData.data_transformation_requirements || '[PENDING]';
    const workflowAutomation = formData.workflow_automation || '[PENDING]';
    const dataProcessingEngine = formData.data_processing_engine || '[PENDING]';
    const storageAndRetrieval = formData.storage_and_retrieval || '[PENDING]';
    const userInteractionPatterns = formData.user_interaction_patterns || '[PENDING]';
    const systemMonitoring = formData.system_monitoring || '[PENDING]';
    const externalSystemIntegrations = formData.external_system_integrations || '[PENDING]';
    const dataExchangeRequirements = formData.data_exchange_requirements || '[PENDING]';
    const apiDesignRequirements = formData.api_design_requirements || '[PENDING]';
    const eventDrivenArchitecture = formData.event_driven_architecture || '[PENDING]';
    const securityRequirements = formData.security_requirements || '[PENDING]';
    const complianceFramework = formData.compliance_framework || '[PENDING]';

    // Identify pending BRD sections
    const pendingBRDSections = [];
    const missingInformation = [];

    if (!formData.replication_vs_modernization) {
      pendingBRDSections.push('Modernization Strategy Decision');
      missingInformation.push('Replication vs Modernization approach not defined');
    }
    if (!formData.primary_business_functions) {
      pendingBRDSections.push('Primary Business Functions');
      missingInformation.push('Core business processes not documented');
    }
    if (!formData.business_rules_engine) {
      pendingBRDSections.push('Business Rules Engine');
      missingInformation.push('Business logic and decision rules not specified');
    }
    if (!formData.external_system_integrations) {
      pendingBRDSections.push('External System Integrations');
      missingInformation.push('Integration points with external systems not identified');
    }
    if (!formData.api_design_requirements) {
      pendingBRDSections.push('API Design Requirements');
      missingInformation.push('API endpoints and consumption patterns not defined');
    }
    if (!formData.security_requirements) {
      pendingBRDSections.push('Security Requirements');
      missingInformation.push('Security and access control requirements not specified');
    }

    return generateCapabilityDesignContent(stage, selectedDocs, {
      modernizationApproach, modernizationRationale, primaryBusinessFunctions,
      businessRulesEngine, dataTransformationRequirements, workflowAutomation,
      dataProcessingEngine, storageAndRetrieval, userInteractionPatterns,
      systemMonitoring, externalSystemIntegrations, dataExchangeRequirements,
      apiDesignRequirements, eventDrivenArchitecture, securityRequirements,
      complianceFramework, pendingBRDSections, missingInformation
    });
  };

  const generateCapabilityDesignContent = (stage, selectedDocs, data) => {
    const {
      modernizationApproach, modernizationRationale, primaryBusinessFunctions,
      businessRulesEngine, dataTransformationRequirements, workflowAutomation,
      dataProcessingEngine, storageAndRetrieval, userInteractionPatterns,
      systemMonitoring, externalSystemIntegrations, dataExchangeRequirements,
      apiDesignRequirements, eventDrivenArchitecture, securityRequirements,
      complianceFramework, pendingBRDSections, missingInformation
    } = data;

    return `
# Technical Transfer Document - ${stage.name}
## COBOL to Java Conversion: ${projectName} Project

---

## Table of Contents
- [1. Migration Overview & Strategy](#1-migration-overview--strategy)
- [2. Comprehensive Business Rules & Operations Framework](#2-comprehensive-business-rules--operations-framework)
- [3. Capability Class and Function Dynamic Flow Design](#3-capability-class-and-function-dynamic-flow-design)
- [4. Target Technology Stack Design](#4-target-technology-stack-design)
- [5. Application Design Architecture](#5-application-design-architecture)
- [6. Use Case Development & Business Context](#6-use-case-development--business-context)
- [7. Data Architecture Design](#7-data-architecture-design)
- [8. Business Logic Migration Design](#8-business-logic-migration-design)
- [9. Detailed Capability Logic Design](#9-detailed-capability-logic-design)
- [10. Integration, Security, Performance & Quality Framework](#10-integration-security-performance--quality-framework)
- [BRD Status and Pending Items](#brd-status-and-pending-items)

---

# 1. Migration Overview & Strategy

## 1.1 Capability Migration Approach
**Modernization Strategy**: ${modernizationApproach}

**Rationale**: ${modernizationRationale}

**Migration Complexity Assessment**: 
- **Legacy System Analysis**: COBOL-based ${projectName} system with JCL job processing
- **Target Architecture**: Java-based microservices on Google Cloud Platform
- **Migration Scope**: ${modernizationApproach === 'Replicate Existing Flow' ? 'Direct replication of existing functionality with minimal changes' : modernizationApproach === 'Modernize with Enhanced Features' ? 'Complete modernization with enhanced capabilities and improved architecture' : 'Hybrid approach combining core replication with modernized extensions'}

## 1.2 Target Architecture Vision
*[Content will be generated in Application Production Design stage]*

## 1.3 Target Language Suitability Assessment
*[Content will be generated in Application Production Design stage]*

## 1.4 Capability Migration Architecture Diagram
*[Architecture diagrams will be generated in Application Production Design stage]*

---

# 2. Comprehensive Business Rules & Operations Framework

## 2.1 Business Rules Capture and Analysis
**Primary Business Functions**:
${primaryBusinessFunctions}

**Business Rules Engine Requirements**:
${businessRulesEngine}

**Data Transformation Requirements**:
${dataTransformationRequirements}

**Workflow Automation Requirements**:
${workflowAutomation}

## 2.2 Production Statistics-Based Technology Selection
*[Content will be generated based on production volume analysis in Application Production Design stage]*

---

# 3. Capability Class and Function Dynamic Flow Design

## 3.1 Modern Capability Class Architecture
*[Class diagrams will be generated in Application Production Design stage]*

## 3.2 Modern Capability Dynamic Flow Sequence Diagram
*[Sequence diagrams will be generated in Application Production Design stage]*

## 3.3 Data Flow Between Classes
*[Data flow diagrams will be generated in Application Production Design stage]*

## 3.4 Data Transfer Objects (DTOs) and POJOs Design
*[DTO designs will be generated in Application Production Design stage]*

---

# 4. Target Technology Stack Design

## 4.1 Technology Stack Selection
*[Technology stack will be defined in Application Production Design stage]*

## 4.2 Intelligent Dependency Selection Matrix
*[Dependency matrix will be generated in Application Production Design stage]*

## 4.3 Capability Architecture Implementation
*[Implementation details will be generated in Application Production Design stage]*

---

# 5. Application Design Architecture

## 5.1 Component Design Strategy
*[Component design will be generated in Application Production Design stage]*

## 5.2 Target Language Structure Design
*[Language structure will be generated in Application Production Design stage]*

## 5.3 Design Patterns Implementation
*[Design patterns will be generated in Application Production Design stage]*

## 5.4 Complete Mapping Details for Code Conversion
*[Mapping details will be generated in Application Production Design stage]*

---

# 6. Use Case Development & Business Context

## 6.1 Use Case Identification
*[Use cases will be generated in Application Production Design stage]*

## 6.2 Use Case Requirements Analysis
*[Requirements analysis will be generated in Application Production Design stage]*

---

# 7. Data Architecture Design

## 7.1 Data Migration Strategy with Error Handling
*[Data migration strategy will be generated in Data Handling Design stage]*

## 7.2 Data Processing Design with Fallback
**Data Processing Engine Requirements**:
${dataProcessingEngine}

**Storage and Retrieval Patterns**:
${storageAndRetrieval}

## 7.3 File Processing Architecture
*[File processing architecture will be generated in Data Handling Design stage]*

## 7.4 Capability Data Flow and Business Logic Architecture Diagram
*[Data flow diagrams will be generated in Data Handling Design stage]*

---

# 8. Business Logic Migration Design

## 8.1 Logic Conversion Strategy with Fallback
*[Logic conversion strategy will be generated in Business Rules and Logic stage]*

## 8.2 Control Flow Design with Error Recovery
*[Control flow design will be generated in Business Rules and Logic stage]*

---

# 9. Detailed Capability Logic Design & Complete Sub-Capability Business Flow Extraction

## 9.1 Complete Sub-Capability Logic Extraction with Custom Annotations
*[Sub-capability logic will be generated in Business Rules and Logic stage]*

## 9.2 Capability Business Logic Implementation
*[Business logic implementation will be generated in Business Rules and Logic stage]*

---

# 10. Integration, Security, Performance & Quality Framework

## 10.1 External System Integration with Fallback
**External System Integrations**:
${externalSystemIntegrations}

**Data Exchange Requirements**:
${dataExchangeRequirements}

**API Design Requirements**:
${apiDesignRequirements}

**Event-Driven Architecture**:
${eventDrivenArchitecture}

## 10.2 Security Architecture with Error Handling
**Security Requirements**:
${securityRequirements}

**Compliance Framework**:
${complianceFramework}

## 10.3 Performance & Scalability with Fallback
*[Performance considerations will be generated in Testing Strategy stage]*

## 10.4 Testing Architecture with Error Scenarios
*[Testing architecture will be generated in Testing Strategy stage]*

## 10.5 Deployment, Quality & Operations with Error Detection
*[Deployment and operations details will be generated in Deployment Strategy stage]*

## 10.6 Risk Management & Mitigation
*[Risk management will be generated in Deployment Strategy stage]*

---

# BRD Status and Pending Items

## ✅ Completed BRD Sections
- **Initial Project Requirements** (from Initial Questions stage)
- **Basic System Context** (from Initial Questions stage)
- **Technology Preferences** (from Initial Questions stage)

## ⚠️ Partially Completed BRD Sections
- **Capability Migration Strategy** - ${formData.replication_vs_modernization ? '✅ Completed' : '❌ Pending'}
- **Business Functionality Requirements** - ${formData.primary_business_functions ? '✅ Completed' : '❌ Pending'}
- **Business Rules Definition** - ${formData.business_rules_engine ? '✅ Completed' : '❌ Pending'}
- **Integration Requirements** - ${formData.external_system_integrations ? '✅ Completed' : '❌ Pending'}
- **Security and Compliance** - ${formData.security_requirements ? '✅ Completed' : '❌ Pending'}

## ❌ Pending BRD Sections
${pendingBRDSections.length > 0 ? pendingBRDSections.map(section => `- **${section}**`).join('\n') : '- All major BRD sections have been addressed in this stage'}

## 🔍 Missing Information Required
${missingInformation.length > 0 ? missingInformation.map(info => `- ${info}`).join('\n') : '- No critical information missing at this stage'}

## 📋 Next Stage Requirements
The following stages will address the remaining BRD sections:

1. **Application Production Design Stage**:
   - Target Architecture Vision
   - Technology Stack Selection
   - Component Design Strategy
   - Use Case Development

2. **Business Rules and Logic Stage**:
   - Detailed Business Logic Implementation
   - Logic Conversion Strategy
   - Control Flow Design

3. **Data Handling Design Stage**:
   - Data Migration Strategy
   - File Processing Architecture
   - Data Flow Diagrams

4. **Testing Strategy Stage**:
   - Testing Architecture
   - Performance Requirements
   - Quality Framework

5. **Deployment Strategy Stage**:
   - Deployment Configuration
   - Operations Requirements
   - Risk Management

---

## Document Status
- **Generated On**: ${new Date().toLocaleDateString()}
- **Stage**: ${stage.name}
- **Project**: ${projectName}
- **Documents Analyzed**: ${selectedDocs.length}
- **SME Contributors**: ${selectedSMEs.length}
- **Completion Status**: ${Math.round((Object.keys(formData).filter(key => formData[key] && formData[key] !== '[PENDING]').length / Object.keys(formData).length) * 100)}% Complete
- **BRD Completion**: ${Math.round(((Object.keys(formData).filter(key => formData[key] && formData[key] !== '[PENDING]').length + 15) / 25) * 100)}% Complete

**Note**: This TTD represents the current state of the Capability Design stage. Sections marked with *[Content will be generated in X stage]* will be populated in subsequent stages. The BRD Status section provides visibility into what information is still needed to complete the Business Requirements Document.
    `.trim();
  };

  const generateDefaultTTDContent = (stage, selectedDocs) => {
    return `
# Technical Transfer Document - ${stage.name}
## COBOL to Java Conversion: ${projectName} Project

---

## Table of Contents
- [1. Migration Overview & Strategy](#1-migration-overview--strategy)
  - [1.1 Capability Migration Approach](#11-capability-migration-approach)
  - [1.2 Target Architecture Vision](#12-target-architecture-vision)
  - [1.3 Target Language Suitability Assessment](#13-target-language-suitability-assessment)
  - [1.4 Capability Migration Architecture Diagram](#14-capability-migration-architecture-diagram)
- [2. Comprehensive Business Rules & Operations Framework](#2-comprehensive-business-rules--operations-framework)
  - [2.1 Business Rules Capture and Analysis](#21-business-rules-capture-and-analysis)
  - [2.2 Production Statistics-Based Technology Selection](#22-production-statistics-based-technology-selection)
- [3. Capability Class and Function Dynamic Flow Design](#3-capability-class-and-function-dynamic-flow-design)
  - [3.1 Modern Capability Class Architecture](#31-modern-capability-class-architecture)
  - [3.2 Modern Capability Dynamic Flow Sequence Diagram](#32-modern-capability-dynamic-flow-sequence-diagram)
  - [3.3 Data Flow Between Classes](#33-data-flow-between-classes)
  - [3.4 Data Transfer Objects (DTOs) and POJOs Design](#34-data-transfer-objects-dtos-and-pojos-design)
- [4. Target Technology Stack Design](#4-target-technology-stack-design)
  - [4.1 Technology Stack Selection](#41-technology-stack-selection)
  - [4.2 Intelligent Dependency Selection Matrix](#42-intelligent-dependency-selection-matrix)
  - [4.3 Capability Architecture Implementation](#43-capability-architecture-implementation)
- [5. Application Design Architecture](#5-application-design-architecture)
  - [5.1 Component Design Strategy](#51-component-design-strategy)
  - [5.2 Target Language Structure Design](#52-target-language-structure-design)
  - [5.3 Design Patterns Implementation](#53-design-patterns-implementation)
  - [5.4 Complete Mapping Details for Code Conversion](#54-complete-mapping-details-for-code-conversion)
- [6. Use Case Development & Business Context](#6-use-case-development--business-context)
  - [6.1 Use Case Identification](#61-use-case-identification)
  - [6.2 Use Case Requirements Analysis](#62-use-case-requirements-analysis)
- [7. Data Architecture Design](#7-data-architecture-design)
  - [7.1 Data Migration Strategy with Error Handling](#71-data-migration-strategy-with-error-handling)
  - [7.2 Data Processing Design with Fallback](#72-data-processing-design-with-fallback)
  - [7.3 File Processing Architecture](#73-file-processing-architecture)
  - [7.4 Capability Data Flow and Business Logic Architecture Diagram](#74-capability-data-flow-and-business-logic-architecture-diagram)
- [8. Business Logic Migration Design](#8-business-logic-migration-design)
  - [8.1 Logic Conversion Strategy with Fallback](#81-logic-conversion-strategy-with-fallback)
  - [8.2 Control Flow Design with Error Recovery](#82-control-flow-design-with-error-recovery)
- [9. Detailed Capability Logic Design & Complete Sub-Capability Business Flow Extraction](#9-detailed-capability-logic-design--complete-sub-capability-business-flow-extraction)
  - [9.1 Complete Sub-Capability Logic Extraction with Custom Annotations](#91-complete-sub-capability-logic-extraction-with-custom-annotations)
  - [9.2 Capability Business Logic Implementation](#92-capability-business-logic-implementation)
- [10. Integration, Security, Performance & Quality Framework](#10-integration-security-performance--quality-framework)
  - [10.1 External System Integration with Fallback](#101-external-system-integration-with-fallback)
  - [10.2 Security Architecture with Error Handling](#102-security-architecture-with-error-handling)
  - [10.3 Performance & Scalability with Fallback](#103-performance--scalability-with-fallback)
  - [10.4 Testing Architecture with Error Scenarios](#104-testing-architecture-with-error-scenarios)
  - [10.5 Deployment, Quality & Operations with Error Detection](#105-deployment-quality--operations-with-error-detection)
  - [10.6 Risk Management & Mitigation](#106-risk-management--mitigation)

---

# 1. Migration Overview & Strategy

## 1.1 Capability Migration Approach
*[Content will be generated based on project analysis and requirements]*

## 1.2 Target Architecture Vision
*[Content will be generated based on project analysis and requirements]*

## 1.3 Target Language Suitability Assessment
*[Content will be generated based on project analysis and requirements]*

## 1.4 Capability Migration Architecture Diagram
*[Architecture diagrams will be generated based on project analysis and requirements]*

---

# 2. Comprehensive Business Rules & Operations Framework

## 2.1 Business Rules Capture and Analysis
*[Content will be generated based on project analysis and requirements]*

## 2.2 Production Statistics-Based Technology Selection
*[Content will be generated based on project analysis and requirements]*

---

# 3. Capability Class and Function Dynamic Flow Design

## 3.1 Modern Capability Class Architecture
*[Class diagrams will be generated based on project analysis and requirements]*

## 3.2 Modern Capability Dynamic Flow Sequence Diagram
*[Sequence diagrams will be generated based on project analysis and requirements]*

## 3.3 Data Flow Between Classes
*[Data flow diagrams will be generated based on project analysis and requirements]*

## 3.4 Data Transfer Objects (DTOs) and POJOs Design
*[DTO designs will be generated based on project analysis and requirements]*

---

# 4. Target Technology Stack Design

## 4.1 Technology Stack Selection
*[Technology stack will be defined based on project analysis and requirements]*

## 4.2 Intelligent Dependency Selection Matrix
*[Dependency matrix will be generated based on project analysis and requirements]*

## 4.3 Capability Architecture Implementation
*[Implementation details will be generated based on project analysis and requirements]*

---

# 5. Application Design Architecture

## 5.1 Component Design Strategy
*[Component design will be generated based on project analysis and requirements]*

## 5.2 Target Language Structure Design
*[Language structure will be generated based on project analysis and requirements]*

## 5.3 Design Patterns Implementation
*[Design patterns will be generated based on project analysis and requirements]*

## 5.4 Complete Mapping Details for Code Conversion
*[Mapping details will be generated based on project analysis and requirements]*

---

# 6. Use Case Development & Business Context

## 6.1 Use Case Identification
*[Use cases will be generated based on project analysis and requirements]*

## 6.2 Use Case Requirements Analysis
*[Requirements analysis will be generated based on project analysis and requirements]*

---

# 7. Data Architecture Design

## 7.1 Data Migration Strategy with Error Handling
*[Data migration strategy will be generated based on project analysis and requirements]*

## 7.2 Data Processing Design with Fallback
*[Data processing design will be generated based on project analysis and requirements]*

## 7.3 File Processing Architecture
*[File processing architecture will be generated based on project analysis and requirements]*

## 7.4 Capability Data Flow and Business Logic Architecture Diagram
*[Data flow diagrams will be generated based on project analysis and requirements]*

---

# 8. Business Logic Migration Design

## 8.1 Logic Conversion Strategy with Fallback
*[Logic conversion strategy will be generated based on project analysis and requirements]*

## 8.2 Control Flow Design with Error Recovery
*[Control flow design will be generated based on project analysis and requirements]*

---

# 9. Detailed Capability Logic Design & Complete Sub-Capability Business Flow Extraction

## 9.1 Complete Sub-Capability Logic Extraction with Custom Annotations
*[Sub-capability logic will be generated based on project analysis and requirements]*

## 9.2 Capability Business Logic Implementation
*[Business logic implementation will be generated based on project analysis and requirements]*

---

# 10. Integration, Security, Performance & Quality Framework

## 10.1 External System Integration with Fallback
*[Integration details will be generated based on project analysis and requirements]*

## 10.2 Security Architecture with Error Handling
*[Security architecture will be generated based on project analysis and requirements]*

## 10.3 Performance & Scalability with Fallback
*[Performance considerations will be generated based on project analysis and requirements]*

## 10.4 Testing Architecture with Error Scenarios
*[Testing architecture will be generated based on project analysis and requirements]*

## 10.5 Deployment, Quality & Operations with Error Detection
*[Deployment and operations details will be generated based on project analysis and requirements]*

## 10.6 Risk Management & Mitigation
*[Risk management will be generated based on project analysis and requirements]*

---

## Document Status
- **Generated On**: ${new Date().toLocaleDateString()}
- **Stage**: ${stage.name}
- **Project**: ${projectName}
- **Documents Analyzed**: ${selectedDocs.length}
- **SME Contributors**: ${selectedSMEs.length}
- **Status**: Initial Structure - Content will be populated through subsequent stages

**Note**: This is the initial TTD structure. Each section will be progressively filled with detailed content as the TTD generation process continues through subsequent stages, incorporating SME feedback, document analysis, and technical specifications.
    `.trim();
  };

  const generateApplicationProductionDesignTTD = (stage, selectedDocs) => {
    const architecturePattern = formData.architecture_pattern || '[PENDING]';
    const technologyStack = formData.technology_stack_selection || '[PENDING]';
    const designPatterns = formData.design_patterns_implementation || '[PENDING]';
    const serviceDecomposition = formData.service_decomposition_strategy || '[PENDING]';
    const deploymentArchitecture = formData.deployment_architecture || '[PENDING]';
    const infrastructureRequirements = formData.infrastructure_requirements || '[PENDING]';
    const monitoringSetup = formData.monitoring_observability_setup || '[PENDING]';
    const backupStrategy = formData.backup_disaster_recovery || '[PENDING]';
    const performanceBenchmarks = formData.performance_benchmarks || '[PENDING]';
    const scalabilityStrategy = formData.scalability_strategy || '[PENDING]';
    const resourceOptimization = formData.resource_optimization || '[PENDING]';
    const securityArchitecture = formData.security_architecture || '[PENDING]';
    const complianceFramework = formData.compliance_framework || '[PENDING]';
    const accessControl = formData.access_control_management || '[PENDING]';
    const availabilityTargets = formData.availability_targets || '[PENDING]';
    const faultTolerance = formData.fault_tolerance_design || '[PENDING]';
    const errorHandling = formData.error_handling_strategy || '[PENDING]';
    const codeQuality = formData.code_quality_standards || '[PENDING]';
    const operationalProcedures = formData.operational_procedures || '[PENDING]';
    const supportEscalation = formData.support_escalation || '[PENDING]';
    const apiStandards = formData.api_design_standards || '[PENDING]';
    const dataCompatibility = formData.data_compatibility || '[PENDING]';
    const legacyIntegration = formData.legacy_system_integration || '[PENDING]';

    // Mermaid diagrams
    const systemArchitectureDiagram = `graph TB
subgraph "Legacy COBOL System"
    COBOL["COBOL Applications"]
    JCL["JCL Jobs"]
    DB[("Mainframe DB")]
end

subgraph "Modern Java System"
    API["API Gateway"]
    subgraph "Microservices"
        SVC1["Data Processing Service"]
        SVC2["Data Transmission Service"]
        SVC3["Year End Processing Service"]
    end
    subgraph "Infrastructure"
        K8S["Kubernetes"]
        GCP["Google Cloud Platform"]
    end
    subgraph "Storage"
        PG[("PostgreSQL")]
        REDIS[("Redis Cache")]
        GCS["Cloud Storage"]
    end
end

COBOL -->|Migration| API
JCL -->|Job Processing| SVC1
DB -->|Data Migration| PG
API --> SVC1
API --> SVC2
API --> SVC3
SVC1 --> PG
SVC2 --> PG
SVC3 --> PG
SVC1 --> REDIS
SVC2 --> REDIS
SVC3 --> REDIS
SVC1 --> GCS
SVC2 --> GCS
SVC3 --> GCS`;

    const serviceDecompositionDiagram = `graph LR
subgraph "Legacy MISC System"
    MISC["MISC COBOL Program"]
    DATA_PROC["Data Processing Module"]
    DATA_XMIT["Data Transmission Module"]
    YEAR_END["Year End Processing Module"]
end

subgraph "Modern Microservices"
    DP_SVC["Data Processing Service"]
    DT_SVC["Data Transmission Service"]
    YE_SVC["Year End Processing Service"]
end

MISC -->|Decompose| DP_SVC
DATA_PROC -->|Map to| DP_SVC
DATA_XMIT -->|Map to| DT_SVC
YEAR_END -->|Map to| YE_SVC`;

    const deploymentArchitectureDiagram = `graph TB
subgraph "CI/CD Pipeline"
    DEV["Development"]
    TEST["Testing"]
    STAGING["Staging"]
    PROD["Production"]
end

subgraph "Google Cloud Platform"
    subgraph "Production Environment"
        LB["Load Balancer"]
        subgraph "Kubernetes Cluster"
            POD1["Data Processing Pod"]
            POD2["Data Transmission Pod"]
            POD3["Year End Processing Pod"]
        end
        subgraph "Data Layer"
            PG_PROD[("PostgreSQL")]
            REDIS_PROD[("Redis")]
            GCS_PROD["Cloud Storage"]
        end
    end
    
    subgraph "Monitoring & Observability"
        MON["Cloud Monitoring"]
        LOG["Cloud Logging"]
        TRACE["Cloud Trace"]
    end
    
    subgraph "Security & Compliance"
        IAM["Identity & Access Management"]
        KMS["Key Management Service"]
        AUDIT["Audit Logs"]
    end
end

DEV --> TEST
TEST --> STAGING
STAGING --> PROD

LB --> POD1
LB --> POD2
LB --> POD3

POD1 --> PG_PROD
POD2 --> PG_PROD
POD3 --> PG_PROD

POD1 --> REDIS_PROD
POD2 --> REDIS_PROD
POD3 --> REDIS_PROD

POD1 --> GCS_PROD
POD2 --> GCS_PROD
POD3 --> GCS_PROD

POD1 --> MON
POD2 --> MON
POD3 --> MON

POD1 --> LOG
POD2 --> LOG
POD3 --> LOG`;

    const dataFlowDiagram = `graph TB
subgraph "Data Sources"
    LEGACY_DB[("Legacy Mainframe DB")]
    FILES["File Systems"]
    EXTERNAL["External Systems"]
end

subgraph "Data Processing Layer"
    INGESTION["Data Ingestion Service"]
    VALIDATION["Data Validation Service"]
    TRANSFORM["Data Transformation Service"]
end

subgraph "Business Logic Layer"
    DP_LOGIC["Data Processing Logic"]
    DT_LOGIC["Data Transmission Logic"]
    YE_LOGIC["Year End Processing Logic"]
end

subgraph "Storage Layer"
    PG[("PostgreSQL")]
    REDIS[("Redis Cache")]
    GCS["Cloud Storage"]
    BACKUP[("Backup Storage")]
end

subgraph "Output Layer"
    REPORTS["Report Generation"]
    APIS["API Endpoints"]
    NOTIFICATIONS["Notifications"]
end

LEGACY_DB -->|ETL| INGESTION
FILES -->|Batch Import| INGESTION
EXTERNAL -->|API Calls| INGESTION

INGESTION --> VALIDATION
VALIDATION --> TRANSFORM

TRANSFORM --> DP_LOGIC
TRANSFORM --> DT_LOGIC
TRANSFORM --> YE_LOGIC

DP_LOGIC --> PG
DT_LOGIC --> PG
YE_LOGIC --> PG

DP_LOGIC --> REDIS
DT_LOGIC --> REDIS
YE_LOGIC --> REDIS

DP_LOGIC --> GCS
DT_LOGIC --> GCS
YE_LOGIC --> GCS

PG --> REPORTS
REDIS --> APIS
GCS --> NOTIFICATIONS

PG --> BACKUP
REDIS --> BACKUP
GCS --> BACKUP`;

    return `
# Technical Transfer Document - ${stage.name}
## COBOL to Java Conversion: ${projectName} Project

---

## Table of Contents
- [1. Migration Overview & Strategy](#1-migration-overview--strategy)
- [2. Comprehensive Business Rules & Operations Framework](#2-comprehensive-business-rules--operations-framework)
- [3. Capability Class and Function Dynamic Flow Design](#3-capability-class-and-function-dynamic-flow-design)
- [4. Target Technology Stack Design](#4-target-technology-stack-design)
- [5. Application Design Architecture](#5-application-design-architecture)
- [6. Use Case Development & Business Context](#6-use-case-development--business-context)
- [7. Data Architecture Design](#7-data-architecture-design)
- [8. Business Logic Migration Design](#8-business-logic-migration-design)
- [9. Detailed Capability Logic Design](#9-detailed-capability-logic-design)
- [10. Integration, Security, Performance & Quality Framework](#10-integration-security-performance--quality-framework)
- [BRD Status and Pending Items](#brd-status-and-pending-items)

---

# 1. Migration Overview & Strategy

## 1.1 Capability Migration Approach
*[Content from Capability Design Stage]*

## 1.2 Target Architecture Vision
**Architecture Pattern**: ${architecturePattern}

**Service Decomposition Strategy**: ${serviceDecomposition}

## 1.3 Target Language Suitability Assessment
**Technology Stack Selection**: ${technologyStack}

## 1.4 Capability Migration Architecture Diagram

### High-Level System Architecture

\`\`\`mermaid
graph TB
subgraph "Legacy COBOL System"
    COBOL["COBOL Applications"]
    JCL["JCL Jobs"]
    DB[("Mainframe DB")]
end

subgraph "Modern Java System"
    API["API Gateway"]
    subgraph "Microservices"
        SVC1["Data Processing Service"]
        SVC2["Data Transmission Service"]
        SVC3["Year End Processing Service"]
    end
    subgraph "Infrastructure"
        K8S["Kubernetes"]
        GCP["Google Cloud Platform"]
    end
    subgraph "Storage"
        PG[("PostgreSQL")]
        REDIS[("Redis Cache")]
        GCS["Cloud Storage"]
    end
end

COBOL -->|Migration| API
JCL -->|Job Processing| SVC1
DB -->|Data Migration| PG
API --> SVC1
API --> SVC2
API --> SVC3
SVC1 --> PG
SVC2 --> PG
SVC3 --> PG
SVC1 --> REDIS
SVC2 --> REDIS
SVC3 --> REDIS
SVC1 --> GCS
SVC2 --> GCS
SVC3 --> GCS
\`\`\`

### Service Decomposition Strategy

\`\`\`mermaid
graph LR
subgraph "Legacy MISC System"
    MISC["MISC COBOL Program"]
    DATA_PROC["Data Processing Module"]
    DATA_XMIT["Data Transmission Module"]
    YEAR_END["Year End Processing Module"]
end

subgraph "Modern Microservices"
    DP_SVC["Data Processing Service"]
    DT_SVC["Data Transmission Service"]
    YE_SVC["Year End Processing Service"]
end

MISC -->|Decompose| DP_SVC
DATA_PROC -->|Map to| DP_SVC
DATA_XMIT -->|Map to| DT_SVC
YEAR_END -->|Map to| YE_SVC
\`\`\`

---

# 2. Comprehensive Business Rules & Operations Framework

## 2.1 Business Rules Capture and Analysis
*[Content from Capability Design Stage]*

## 2.2 Production Statistics-Based Technology Selection
**Performance Benchmarks**: ${performanceBenchmarks}

**Scalability Strategy**: ${scalabilityStrategy}

**Resource Optimization**: ${resourceOptimization}

---

# 3. Capability Class and Function Dynamic Flow Design

## 3.1 Modern Capability Class Architecture
**Design Patterns Implementation**: ${designPatterns}

## 3.2 Modern Capability Dynamic Flow Sequence Diagram
*[Sequence diagrams will be generated in Business Rules and Logic stage]*

## 3.3 Data Flow Between Classes
*[Data flow diagrams will be generated in Data Handling Design stage]*

## 3.4 Data Transfer Objects (DTOs) and POJOs Design
*[DTO designs will be generated in Data Handling Design stage]*

---

# 4. Target Technology Stack Design

## 4.1 Technology Stack Selection
**Selected Technology Stack**: ${technologyStack}

## 4.2 Intelligent Dependency Selection Matrix
*[Dependency matrix will be generated in Testing Strategy stage]*

## 4.3 Capability Architecture Implementation
*[Implementation details will be generated in Business Rules and Logic stage]*

---

# 5. Application Design Architecture

## 5.1 Component Design Strategy
**Architecture Pattern**: ${architecturePattern}

**Service Decomposition**: ${serviceDecomposition}

## 5.2 Target Language Structure Design
**Technology Stack**: ${technologyStack}

## 5.3 Design Patterns Implementation
**Design Patterns**: ${designPatterns}

## 5.4 Complete Mapping Details for Code Conversion
*[Mapping details will be generated in Business Rules and Logic stage]*

---

# 6. Use Case Development & Business Context

## 6.1 Use Case Identification
*[Use cases will be generated in Business Rules and Logic stage]*

## 6.2 Use Case Requirements Analysis
*[Requirements analysis will be generated in Business Rules and Logic stage]*

---

# 7. Data Architecture Design

## 7.1 Data Migration Strategy with Error Handling
*[Data migration strategy will be generated in Data Handling Design stage]*

## 7.2 Data Processing Design with Fallback
*[Content from Capability Design Stage]*

## 7.3 File Processing Architecture
*[File processing architecture will be generated in Data Handling Design stage]*

## 7.4 Capability Data Flow and Business Logic Architecture Diagram

### Data Flow Architecture

\`\`\`mermaid
graph TB
subgraph "Data Sources"
    LEGACY_DB[("Legacy Mainframe DB")]
    FILES["File Systems"]
    EXTERNAL["External Systems"]
end

subgraph "Data Processing Layer"
    INGESTION["Data Ingestion Service"]
    VALIDATION["Data Validation Service"]
    TRANSFORM["Data Transformation Service"]
end

subgraph "Business Logic Layer"
    DP_LOGIC["Data Processing Logic"]
    DT_LOGIC["Data Transmission Logic"]
    YE_LOGIC["Year End Processing Logic"]
end

subgraph "Storage Layer"
    PG[("PostgreSQL")]
    REDIS[("Redis Cache")]
    GCS["Cloud Storage"]
    BACKUP[("Backup Storage")]
end

subgraph "Output Layer"
    REPORTS["Report Generation"]
    APIS["API Endpoints"]
    NOTIFICATIONS["Notifications"]
end

LEGACY_DB -->|ETL| INGESTION
FILES -->|Batch Import| INGESTION
EXTERNAL -->|API Calls| INGESTION

INGESTION --> VALIDATION
VALIDATION --> TRANSFORM

TRANSFORM --> DP_LOGIC
TRANSFORM --> DT_LOGIC
TRANSFORM --> YE_LOGIC

DP_LOGIC --> PG
DT_LOGIC --> PG
YE_LOGIC --> PG

DP_LOGIC --> REDIS
DT_LOGIC --> REDIS
YE_LOGIC --> REDIS

DP_LOGIC --> GCS
DT_LOGIC --> GCS
YE_LOGIC --> GCS

PG --> REPORTS
REDIS --> APIS
GCS --> NOTIFICATIONS

PG --> BACKUP
REDIS --> BACKUP
GCS --> BACKUP
\`\`\`

---

# 8. Business Logic Migration Design

## 8.1 Logic Conversion Strategy with Fallback
*[Logic conversion strategy will be generated in Business Rules and Logic stage]*

## 8.2 Control Flow Design with Error Recovery
*[Control flow design will be generated in Business Rules and Logic stage]*

---

# 9. Detailed Capability Logic Design & Complete Sub-Capability Business Flow Extraction

## 9.1 Complete Sub-Capability Logic Extraction with Custom Annotations
*[Sub-capability logic will be generated in Business Rules and Logic stage]*

## 9.2 Capability Business Logic Implementation
*[Business logic implementation will be generated in Business Rules and Logic stage]*

---

# 10. Integration, Security, Performance & Quality Framework

## 10.1 External System Integration with Fallback
*[Content from Capability Design Stage]*

**API Design Standards**: ${apiStandards}

**Data Compatibility Requirements**: ${dataCompatibility}

**Legacy System Integration**: ${legacyIntegration}

## 10.2 Security Architecture with Error Handling
**Security Architecture**: ${securityArchitecture}

**Compliance Framework**: ${complianceFramework}

**Access Control Management**: ${accessControl}

## 10.3 Performance & Scalability with Fallback
**Performance Benchmarks**: ${performanceBenchmarks}

**Scalability Strategy**: ${scalabilityStrategy}

**Resource Optimization**: ${resourceOptimization}

## 10.4 Testing Architecture with Error Scenarios
*[Testing architecture will be generated in Testing Strategy stage]*

## 10.5 Deployment, Quality & Operations with Error Detection

### Deployment Architecture Diagram

\`\`\`mermaid
graph TB
subgraph "CI/CD Pipeline"
    DEV["Development"]
    TEST["Testing"]
    STAGING["Staging"]
    PROD["Production"]
end

subgraph "Google Cloud Platform"
    subgraph "Production Environment"
        LB["Load Balancer"]
        subgraph "Kubernetes Cluster"
            POD1["Data Processing Pod"]
            POD2["Data Transmission Pod"]
            POD3["Year End Processing Pod"]
        end
        subgraph "Data Layer"
            PG_PROD[("PostgreSQL")]
            REDIS_PROD[("Redis")]
            GCS_PROD["Cloud Storage"]
        end
    end
    
    subgraph "Monitoring & Observability"
        MON["Cloud Monitoring"]
        LOG["Cloud Logging"]
        TRACE["Cloud Trace"]
    end
    
    subgraph "Security & Compliance"
        IAM["Identity & Access Management"]
        KMS["Key Management Service"]
        AUDIT["Audit Logs"]
    end
end

DEV --> TEST
TEST --> STAGING
STAGING --> PROD

LB --> POD1
LB --> POD2
LB --> POD3

POD1 --> PG_PROD
POD2 --> PG_PROD
POD3 --> PG_PROD

POD1 --> REDIS_PROD
POD2 --> REDIS_PROD
POD3 --> REDIS_PROD

POD1 --> GCS_PROD
POD2 --> GCS_PROD
POD3 --> GCS_PROD

POD1 --> MON
POD2 --> MON
POD3 --> MON

POD1 --> LOG
POD2 --> LOG
POD3 --> LOG
\`\`\`

**Deployment Architecture**: ${deploymentArchitecture}

**Infrastructure Requirements**: ${infrastructureRequirements}

**Monitoring and Observability**: ${monitoringSetup}

**Backup and Disaster Recovery**: ${backupStrategy}

**Availability Targets**: ${availabilityTargets}

**Fault Tolerance Design**: ${faultTolerance}

**Error Handling Strategy**: ${errorHandling}

**Code Quality Standards**: ${codeQuality}

**Operational Procedures**: ${operationalProcedures}

**Support and Escalation**: ${supportEscalation}

## 10.6 Risk Management & Mitigation
*[Risk management will be generated in Deployment Strategy stage]*

---

# BRD Status and Pending Items

## ✅ Completed BRD Sections
- **Initial Project Requirements** (from Initial Questions stage)
- **Basic System Context** (from Initial Questions stage)
- **Technology Preferences** (from Initial Questions stage)
- **Capability Migration Strategy** (from Capability Design stage)
- **Business Functionality Requirements** (from Capability Design stage)
- **Application Architecture Design** (from Application Production Design stage)
- **Technology Stack Selection** (from Application Production Design stage)
- **Performance & Scalability Requirements** (from Application Production Design stage)
- **Security & Compliance Requirements** (from Application Production Design stage)

## ⚠️ Partially Completed BRD Sections
- **Business Rules Definition** - ${formData.business_rules_engine ? '✅ Completed' : '❌ Pending'}
- **Integration Requirements** - ${formData.external_system_integrations ? '✅ Completed' : '❌ Pending'}
- **Data Architecture Design** - ${formData.data_processing_engine ? '✅ Completed' : '❌ Pending'}

## ❌ Pending BRD Sections
- **Detailed Business Logic Implementation** (Business Rules and Logic stage)
- **Data Migration Strategy** (Data Handling Design stage)
- **Testing Strategy and Framework** (Testing Strategy stage)
- **Deployment Configuration** (Deployment Strategy stage)
- **Operations and Support Procedures** (Deployment Strategy stage)

## 🔍 Missing Information Required
${!formData.business_rules_engine ? '- Business logic and decision rules not specified' : ''}
${!formData.external_system_integrations ? '- Integration points with external systems not identified' : ''}
${!formData.data_processing_engine ? '- Data processing and storage requirements not defined' : ''}

## 📋 Next Stage Requirements
The following stages will address the remaining BRD sections:

1. **Business Rules and Logic Stage**:
   - Detailed Business Logic Implementation
   - Logic Conversion Strategy
   - Control Flow Design
   - Use Case Development

2. **Data Handling Design Stage**:
   - Data Migration Strategy
   - File Processing Architecture
   - Data Flow Diagrams
   - DTO and POJO Design

3. **Testing Strategy Stage**:
   - Testing Architecture
   - Quality Framework
   - Performance Testing Requirements

4. **Deployment Strategy Stage**:
   - Deployment Configuration
   - Operations Requirements
   - Risk Management
   - Support Procedures

---

## Document Status
- **Generated On**: ${new Date().toLocaleDateString()}
- **Stage**: ${stage.name}
- **Project**: ${projectName}
- **Documents Analyzed**: ${selectedDocs.length}
- **SME Contributors**: ${selectedSMEs.length}
- **Completion Status**: ${Math.round((Object.keys(formData).filter(key => formData[key] && formData[key] !== '[PENDING]').length / Object.keys(formData).length) * 100)}% Complete
- **BRD Completion**: ${Math.round(((Object.keys(formData).filter(key => formData[key] && formData[key] !== '[PENDING]').length + 25) / 35) * 100)}% Complete

**Note**: This TTD represents the current state of the Application Production Design stage. The architecture and technology decisions have been defined, and non-functional requirements have been captured. Sections marked with *[Content will be generated in X stage]* will be populated in subsequent stages.
    `.trim();
  };

  const generateDefaultTTD = (stage, selectedDocs) => {
    return generateDefaultTTDContent(stage, selectedDocs);
  };

  const processStageTTD = async () => {
    setIsGenerating(true);
    
    // Check if deployment stage is being skipped
    if (currentStage === 'deployment_strategy' && 
        formData['skip_deployment_stage'] === 'Yes') {
      
      // Skip TTD generation for deployment stage
      setStageTTDs(prev => ({
        ...prev,
        [currentStage]: `# Deployment Strategy - SKIPPED

This deployment planning stage has been intentionally skipped as requested.

## Skip Rationale
${formData['skip_deployment_stage_detail'] || 'Deployment planning not required for this project.'}

## Next Steps
The TTD generation process will proceed to the next stage without generating deployment-specific documentation.

---
*Stage completed by user request - no deployment planning required.*`
      }));
      
      setShowPromptReview(false);
      setIsGenerating(false);
      addNotification('Deployment stage skipped as requested', 'info');
      return;
    }
    
    // Start TTD processing with progress tracking
    await simulateTTDProgress(currentStage);
    
    const stage = TTD_STAGES[currentStage];
    const selectedDocs = Object.values(selectedDocuments).flat();
    
    const generatedTTD = generateStageSpecificTTD(currentStage, stage, selectedDocs);

    setStageTTDs(prev => ({
      ...prev,
      [currentStage]: generatedTTD
    }));

    setShowPromptReview(false);
    setIsGenerating(false);

    // Check if this stage should have reasoning
    if (shouldShowReasoningStage(currentStage)) {
      const questions = getReasoningQuestions(currentStage, 1);
      if (questions.length > 0) {
        setReasoningQuestions(questions);
        setCurrentReasoningRound(1);
        setReasoningAnswers({});
        setShowReasoningStage(true);
        return;
      }
    }
  };

  const isStageComplete = (stageId) => {
    const stage = TTD_STAGES[stageId];
    
    // If TTD has been generated for this stage, consider it complete
    if (stageTTDs[stageId]) {
      return true;
    }
    
    if (stage.questions) {
      // For initial questions stage
      return stage.questions.every(q => !q.required || formData[q.id]);
    }
    
    if (stage.sections) {
      // For Capability Design Stage, be more lenient - only require key fields
      if (stageId === 'capability_design') {
        const keyFields = ['replication_vs_modernization', 'primary_business_functions', 'business_rules_engine'];
        return keyFields.some(fieldId => formData[fieldId] && formData[fieldId].trim() !== '');
      }
      
      // For Application Production Design Stage, be more lenient - only require key fields
      if (stageId === 'application_production_design') {
        const keyFields = ['architecture_pattern', 'technology_stack_selection', 'deployment_architecture'];
        return keyFields.some(fieldId => formData[fieldId] && formData[fieldId].trim() !== '');
      }
      
      // For Business Rules and Logic Stage, be more lenient - only require key fields
      if (stageId === 'business_rules_logic') {
        const keyFields = ['data_validation_rules', 'business_constraints', 'process_flows', 'decision_points'];
        return keyFields.some(fieldId => formData[fieldId] && formData[fieldId].trim() !== '');
      }
      
      // For Data Handling Design Stage, be more lenient - only require key fields
      if (stageId === 'data_handling_design') {
        const keyFields = ['data_processing_approach', 'database_type_selection', 'database_access_control', 'data_migration_strategy'];
        return keyFields.some(fieldId => formData[fieldId] && formData[fieldId].trim() !== '');
      }
      
      // For Testing Strategy Stage, be more lenient - only require key fields
      if (stageId === 'testing_strategy') {
        const keyFields = ['unit_testing_framework', 'test_coverage_requirements', 'api_testing_strategy', 'performance_testing_strategy'];
        return keyFields.some(fieldId => formData[fieldId] && formData[fieldId].trim() !== '');
      }
      
      // For Deployment Strategy Stage, check for skip option first
      if (stageId === 'deployment_strategy') {
        // If user chose to skip deployment stage (Yes), consider it complete
        if (formData['skip_deployment_stage'] === 'Yes') {
          return true;
        }
        // If user chose not to skip (No), require key deployment fields
        if (formData['skip_deployment_stage'] === 'No') {
          const keyFields = ['deployment_method', 'deployment_phases', 'rollback_strategy', 'environment_setup'];
          return keyFields.some(fieldId => formData[fieldId] && formData[fieldId].trim() !== '');
        }
        // If no selection made yet, not complete
        return false;
      }
      
      // For other stages with sections, require all required fields
      return stage.sections.every(section => 
        section.fields.every(field => !field.required || formData[field.id])
      );
    }
    
    return false;
  };

  const handleNext = () => {
    if (isStageComplete(currentStage)) {
      setCompletedStages(prev => new Set([...prev, currentStage]));
      
      // If we're at the last stage (ttd_deduplication), show completion page
      if (currentStage === 'ttd_deduplication') {
        setShowCompletionPage(true);
        // Save the completed TTD to the list
        const finalTTD = generateFinalConsolidatedTTD();
        const newTTD = {
          id: `ttd_${Date.now()}`,
          name: `${projectName} - TTD ${completedTTDs.length + 1}`,
          projectName: projectName,
          createdAt: new Date().toISOString(),
          content: finalTTD,
          stages: Object.keys(stageTTDs),
          status: 'completed'
        };
        setCompletedTTDs(prev => [...prev, newTTD]);
      } else if (currentStageIndex < stageKeys.length - 1) {
        setCurrentStage(stageKeys[currentStageIndex + 1]);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStageIndex > 0) {
      setCurrentStage(stageKeys[currentStageIndex - 1]);
    }
  };

  // Generate final consolidated TTD
  const generateFinalConsolidatedTTD = () => {
    const consolidatedTTD = `# Technical Transfer Document (TTD)
## ${projectName} System - 1099 Generation

### Document Information
- **Project**: ${projectName}
- **Generated Date**: ${new Date().toLocaleDateString()}
- **Document Version**: 1.0
- **Status**: Final Consolidated Document

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [System Architecture](#system-architecture)
4. [Business Requirements](#business-requirements)
5. [Technical Specifications](#technical-specifications)
6. [Data Handling](#data-handling)
7. [Testing Strategy](#testing-strategy)
8. [Deployment Strategy](#deployment-strategy)
9. [Maintenance & Support](#maintenance--support)
10. [Appendices](#appendices)

---

## Executive Summary

This Technical Transfer Document (TTD) provides comprehensive documentation for the ${projectName} system, specifically designed for Ford's 1099 generation processes. The document consolidates all requirements, specifications, and procedures necessary for successful system implementation and maintenance.

---

## Project Overview

${formData.project_overview || 'Project overview information will be populated from the Initial Questions stage.'}

---

## System Architecture

${stageTTDs.application_production_design || 'System architecture details will be populated from the Application Production Design stage.'}

---

## Business Requirements

${stageTTDs.business_rules_logic || 'Business requirements will be populated from the Business Rules and Logic stage.'}

---

## Technical Specifications

${stageTTDs.capability_design || 'Technical specifications will be populated from the Capability Design stage.'}

---

## Data Handling

${stageTTDs.data_handling_design || 'Data handling specifications will be populated from the Data Handling Design stage.'}

---

## Testing Strategy

${stageTTDs.testing_strategy || 'Testing strategy will be populated from the Testing Strategy stage.'}

---

## Deployment Strategy

${stageTTDs.deployment_strategy || 'Deployment strategy will be populated from the Deployment Strategy stage.'}

---

## Maintenance & Support

${stageTTDs.maintenance_support || 'Maintenance and support procedures will be populated from the Maintenance & Support stage.'}

---

## Appendices

### A. Document Consolidation Details
This document represents the consolidated output from the following TTD generation stages:
${Object.keys(stageTTDs).map(stage => `- ${TTD_STAGES[stage]?.name || stage}`).join('\n')}

### B. Quality Assurance
${stageTTDs.ttd_deduplication || 'Quality assurance details will be populated from the TTD De-duplication stage.'}

### C. References and Resources
- Ford Credit 1099 Generation Requirements
- IRS Tax Processing Guidelines
- Ford IT Security Standards
- Ford Development Best Practices

---

*This document was generated using the Ford Falcon Portal TTD Generation system.*`;

    return consolidatedTTD;
  };

  // Download TTD functionality
  const handleDownloadTTD = (ttd) => {
    const blob = new Blob([ttd.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ttd.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Start new TTD for same project
  const handleNewTTD = () => {
    // Reset all state for new TTD
    setCurrentStage('initial_questions');
    setFormData(getPrefilledData(projectName));
    setCompletedStages(new Set());
    setStageTTDs({});
    setShowCompletionPage(false);
    addNotification(`Starting new TTD generation for ${projectName}`, 'info');
  };

  // Combine TTDs functionality
  const handleCombineTTDs = (selectedTTDs) => {
    const combinedContent = `# Combined Technical Transfer Document
## ${projectName} System - Multiple TTD Consolidation

### Document Information
- **Project**: ${projectName}
- **Combined Date**: ${new Date().toLocaleDateString()}
- **Combined TTDs**: ${selectedTTDs.length}
- **Status**: Combined Document

---

## Consolidated Content

${selectedTTDs.map((ttd, index) => `
### TTD ${index + 1}: ${ttd.name}

${ttd.content}

---
`).join('')}

## Combined Analysis

This document combines ${selectedTTDs.length} Technical Transfer Documents for the ${projectName} project, providing a comprehensive view of all generated TTDs.

---

*This combined document was generated using the Ford Falcon Portal TTD Generation system.*`;

    const combinedTTD = {
      id: `combined_ttd_${Date.now()}`,
      name: `${projectName} - Combined TTD`,
      projectName: projectName,
      createdAt: new Date().toISOString(),
      content: combinedContent,
      stages: ['combined'],
      status: 'combined',
      sourceTTDs: selectedTTDs.map(ttd => ttd.id)
    };

    setCompletedTTDs(prev => [...prev, combinedTTD]);
    setShowTTDCombination(false);
    addNotification(`Successfully combined ${selectedTTDs.length} TTDs`, 'success');
  };

  const handleGenerateTTD = async () => {
    setIsGenerating(true);
    
    // Simulate TTD generation process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsGenerating(false);
    setShowPreview(true);
  };

  const renderDocumentSelection = () => (
    <div className={`${theme.colors.card} rounded-xl border ${theme.colors.border} p-6 mb-6`}>
      <h3 className={`text-lg font-semibold ${theme.colors.text} mb-4`}>Document Inputs</h3>
      <p className={`text-sm ${theme.colors.textMuted} mb-4`}>
        Select the documents you want to use as inputs for this stage. You can run the stage multiple times with different document combinations.
      </p>
      
      <div className="space-y-4">
        {DOCUMENT_CATEGORIES.map((category) => (
          <div key={category.id} className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              {category.icon}
              <div>
                <h4 className={`font-medium ${theme.colors.text}`}>{category.name}</h4>
                <p className={`text-sm ${theme.colors.textMuted}`}>{category.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {category.documents.map((document) => {
                const isSelected = selectedDocuments[category.id]?.includes(document.id) || false;
                return (
                  <div
                    key={document.id}
                    onClick={() => handleDocumentSelection(category.id, document.id, !isSelected)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? `${theme.name === "Vibrant" ? "border-blue-400 bg-blue-600/20" : "border-blue-500 bg-blue-50"}`
                        : `${theme.colors.border} ${theme.name === "Vibrant" ? "hover:bg-white/5" : "hover:bg-gray-50"}`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium text-sm ${theme.colors.text}`}>{document.name}</p>
                        <p className={`text-xs ${theme.colors.textMuted}`}>{document.size}</p>
                      </div>
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"
                      }`}>
                        {isSelected && <CheckCircle className="h-3 w-3 text-white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStageQA = () => (
    <div className={`${theme.colors.card} rounded-xl border ${theme.colors.border} p-6 mb-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme.colors.text}`}>Stage-Specific Q&A</h3>
        <button
          onClick={() => setShowStageQA(!showStageQA)}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${
            showStageQA 
              ? `${theme.colors.accent} text-white` 
              : `${theme.name === "Vibrant" ? "bg-white/10 text-white border border-white/20" : "bg-blue-50 text-blue-700 border border-blue-200"}`
          } transition-colors`}
        >
          {showStageQA ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {showStageQA ? 'Hide' : 'Show'} Q&A
        </button>
      </div>

      {showStageQA && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className={`text-sm ${theme.colors.textMuted}`}>
              Add specific questions and answers for this stage
            </p>
            <button
              onClick={addStageQuestion}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${theme.colors.accent} text-white hover:${theme.colors.accentHover} transition-colors`}
            >
              <Plus className="h-4 w-4" />
              Add Question
            </button>
          </div>
          
          {Object.entries(stageQA[currentStage] || {}).map(([questionId, answer]) => (
            <div key={questionId} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className={`block text-sm font-medium ${theme.colors.text}`}>
                  Question
                </label>
                <button
                  onClick={() => {
                    setStageQA(prev => {
                      const updated = { ...prev };
                      delete updated[currentStage][questionId];
                      return updated;
                    });
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <textarea
                value={questionId}
                onChange={(e) => {
                  const newQA = { ...stageQA };
                  delete newQA[currentStage][questionId];
                  newQA[currentStage][e.target.value] = answer;
                  setStageQA(newQA);
                }}
                placeholder="Enter your question..."
                rows={2}
                className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme.name === "Vibrant" 
                    ? "bg-white/10 text-white placeholder-white/60" 
                    : "bg-white text-slate-900 placeholder-slate-500"
                }`}
              />
              <textarea
                value={answer}
                onChange={(e) => handleStageQAChange(questionId, e.target.value)}
                placeholder="Enter the answer..."
                rows={3}
                className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme.name === "Vibrant" 
                    ? "bg-white/10 text-white placeholder-white/60" 
                    : "bg-white text-slate-900 placeholder-slate-500"
                }`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderInitialQuestions = () => {
    const stage = TTD_STAGES.initial_questions;
    
    return (
      <div className="space-y-6">
        {/* Document Selection */}
        {renderDocumentSelection()}
        
        {/* Stage-Specific Q&A */}
        {renderStageQA()}
        
        {/* SME Selection and Questions Section */}
        <div className={`${theme.colors.card} rounded-xl border ${theme.colors.border} p-6 mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${theme.colors.text}`}>SME Collaboration</h3>
            <button
              onClick={() => setShowSMEQuestions(!showSMEQuestions)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                showSMEQuestions 
                  ? `${theme.colors.accent} text-white` 
                  : `${theme.name === "Vibrant" ? "bg-white/10 text-white border border-white/20" : "bg-blue-50 text-blue-700 border border-blue-200"}`
              } transition-colors`}
            >
              <MessageSquare className="h-4 w-4" />
              {showSMEQuestions ? 'Hide Questions' : 'Ask SME Questions'}
            </button>
          </div>

          {/* SME Selection */}
          <div className="mb-4">
            <label className={`block text-sm font-medium ${theme.colors.text} mb-3`}>
              Select Subject Matter Experts
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {SME_OPTIONS.map((sme) => (
                <div
                  key={sme.id}
                  onClick={() => handleSMESelection(sme.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedSMEs.includes(sme.id)
                      ? `${theme.name === "Vibrant" ? "border-blue-400 bg-blue-600/20" : "border-blue-500 bg-blue-50"}`
                      : `${theme.colors.border} ${theme.name === "Vibrant" ? "hover:bg-white/5" : "hover:bg-gray-50"}`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedSMEs.includes(sme.id) ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}>
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className={`font-medium ${theme.colors.text}`}>{sme.name}</p>
                      <p className={`text-sm ${theme.colors.textMuted}`}>{sme.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SME Questions */}
          {showSMEQuestions && (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                  Questions for Selected SMEs
                </label>
                <textarea
                  value={smeQuestions}
                  onChange={(e) => setSmeQuestions(e.target.value)}
                  placeholder="Enter your questions for the selected SMEs..."
                  rows={4}
                  className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme.name === "Vibrant" 
                      ? "bg-white/10 text-white placeholder-white/60" 
                      : "bg-white text-slate-900 placeholder-slate-500"
                  }`}
                />
              </div>
              <button
                onClick={handleSendSMEQuestions}
                className={`inline-flex items-center gap-2 px-4 py-2 ${theme.colors.accent} text-white rounded-lg hover:${theme.colors.accentHover} transition-colors`}
              >
                <Send className="h-4 w-4" />
                Send Questions to SMEs
              </button>
            </div>
          )}
        </div>

        {/* Questions with Pre-filled Data */}
        <div className="space-y-6">
          {/* Basic Questions */}
          <div>
            <h4 className={`text-lg font-semibold ${theme.colors.text} mb-4`}>Basic System Information</h4>
            <div className="space-y-4">
              {stage.questions.filter(q => !q.category).map((question) => (
                <div key={question.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className={`block text-sm font-medium ${theme.colors.text}`}>
                      {question.question}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <button
                      onClick={() => toggleEditing(question.id)}
                      className={`p-1 rounded-lg transition-colors ${
                        editingField === question.id
                          ? `${theme.colors.accent} text-white`
                          : `${theme.colors.textMuted} hover:bg-white/10`
                      }`}
                      title={editingField === question.id ? "Save changes" : "Edit field"}
                    >
                      {editingField === question.id ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {editingField === question.id ? (
                    <textarea
                      value={formData[question.id] || ''}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      placeholder={question.placeholder}
                      rows={4}
                      className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme.name === "Vibrant" 
                          ? "bg-white/10 text-white placeholder-white/60" 
                          : "bg-white text-slate-900 placeholder-slate-500"
                      }`}
                      autoFocus
                    />
                  ) : (
                    <div className={`p-4 rounded-lg border ${theme.colors.border} ${
                      theme.name === "Vibrant" ? "bg-white/5" : "bg-gray-50"
                    }`}>
                      <div className={`text-sm ${theme.colors.text} prose prose-sm max-w-none prose-headings:text-current prose-p:text-current prose-li:text-current prose-strong:text-current`}>
                        <ReactMarkdown 
                          components={{
                            code({node, inline, className, children, ...props}) {
                              const match = /language-(\w+)/.exec(className || '');
                              const language = match && match[1];
                              
                              if (language === 'mermaid') {
                                const chartCode = String(children).replace(/\n$/, '');
                                return (
                                  <MermaidDiagram chart={chartCode} />
                                );
                              }
                              
                              return (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                          {formData[question.id] || question.placeholder}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Technology and Architecture Questions */}
          <div>
            <h4 className={`text-lg font-semibold ${theme.colors.text} mb-4`}>Technology & Architecture Requirements</h4>
            <div className="space-y-4">
              {stage.questions.filter(q => q.category && ['technology', 'platform', 'approach', 'ford_specific'].includes(q.category)).map((question) => (
                <div key={question.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className={`block text-sm font-medium ${theme.colors.text}`}>
                      {question.question}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <button
                      onClick={() => toggleEditing(question.id)}
                      className={`p-1 rounded-lg transition-colors ${
                        editingField === question.id
                          ? `${theme.colors.accent} text-white`
                          : `${theme.colors.textMuted} hover:bg-white/10`
                      }`}
                      title={editingField === question.id ? "Save changes" : "Edit field"}
                    >
                      {editingField === question.id ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {editingField === question.id ? (
                    <textarea
                      value={formData[question.id] || ''}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      placeholder={question.placeholder}
                      rows={4}
                      className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme.name === "Vibrant" 
                          ? "bg-white/10 text-white placeholder-white/60" 
                          : "bg-white text-slate-900 placeholder-slate-500"
                      }`}
                      autoFocus
                    />
                  ) : (
                    <div className={`p-4 rounded-lg border ${theme.colors.border} ${
                      theme.name === "Vibrant" ? "bg-white/5" : "bg-gray-50"
                    }`}>
                      <div className={`text-sm ${theme.colors.text} prose prose-sm max-w-none prose-headings:text-current prose-p:text-current prose-li:text-current prose-strong:text-current`}>
                        <ReactMarkdown 
                          components={{
                            code({node, inline, className, children, ...props}) {
                              const match = /language-(\w+)/.exec(className || '');
                              const language = match && match[1];
                              
                              if (language === 'mermaid') {
                                const chartCode = String(children).replace(/\n$/, '');
                                return (
                                  <MermaidDiagram chart={chartCode} />
                                );
                              }
                              
                              return (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                          {formData[question.id] || question.placeholder}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Implementation Details */}
          <div>
            <h4 className={`text-lg font-semibold ${theme.colors.text} mb-4`}>Implementation Details</h4>
            <div className="space-y-4">
              {stage.questions.filter(q => q.category && ['build_system', 'database', 'security_framework', 'monitoring', 'testing', 'deployment'].includes(q.category)).map((question) => (
                <div key={question.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className={`block text-sm font-medium ${theme.colors.text}`}>
                      {question.question}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <button
                      onClick={() => toggleEditing(question.id)}
                      className={`p-1 rounded-lg transition-colors ${
                        editingField === question.id
                          ? `${theme.colors.accent} text-white`
                          : `${theme.colors.textMuted} hover:bg-white/10`
                      }`}
                      title={editingField === question.id ? "Save changes" : "Edit field"}
                    >
                      {editingField === question.id ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {editingField === question.id ? (
                    <textarea
                      value={formData[question.id] || ''}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      placeholder={question.placeholder}
                      rows={4}
                      className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme.name === "Vibrant" 
                          ? "bg-white/10 text-white placeholder-white/60" 
                          : "bg-white text-slate-900 placeholder-slate-500"
                      }`}
                      autoFocus
                    />
                  ) : (
                    <div className={`p-4 rounded-lg border ${theme.colors.border} ${
                      theme.name === "Vibrant" ? "bg-white/5" : "bg-gray-50"
                    }`}>
                      <div className={`text-sm ${theme.colors.text} prose prose-sm max-w-none prose-headings:text-current prose-p:text-current prose-li:text-current prose-strong:text-current`}>
                        <ReactMarkdown 
                          components={{
                            code({node, inline, className, children, ...props}) {
                              const match = /language-(\w+)/.exec(className || '');
                              const language = match && match[1];
                              
                              if (language === 'mermaid') {
                                const chartCode = String(children).replace(/\n$/, '');
                                return (
                                  <MermaidDiagram chart={chartCode} />
                                );
                              }
                              
                              return (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                          {formData[question.id] || question.placeholder}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Performance & Operations */}
          <div>
            <h4 className={`text-lg font-semibold ${theme.colors.text} mb-4`}>Performance & Operations</h4>
            <div className="space-y-4">
              {stage.questions.filter(q => q.category && ['batch_processing', 'messaging', 'caching', 'performance', 'code_standards'].includes(q.category)).map((question) => (
                <div key={question.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className={`block text-sm font-medium ${theme.colors.text}`}>
                      {question.question}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <button
                      onClick={() => toggleEditing(question.id)}
                      className={`p-1 rounded-lg transition-colors ${
                        editingField === question.id
                          ? `${theme.colors.accent} text-white`
                          : `${theme.colors.textMuted} hover:bg-white/10`
                      }`}
                      title={editingField === question.id ? "Save changes" : "Edit field"}
                    >
                      {editingField === question.id ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {editingField === question.id ? (
                    <textarea
                      value={formData[question.id] || ''}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      placeholder={question.placeholder}
                      rows={4}
                      className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme.name === "Vibrant" 
                          ? "bg-white/10 text-white placeholder-white/60" 
                          : "bg-white text-slate-900 placeholder-slate-500"
                      }`}
                      autoFocus
                    />
                  ) : (
                    <div className={`p-4 rounded-lg border ${theme.colors.border} ${
                      theme.name === "Vibrant" ? "bg-white/5" : "bg-gray-50"
                    }`}>
                      <div className={`text-sm ${theme.colors.text} prose prose-sm max-w-none prose-headings:text-current prose-p:text-current prose-li:text-current prose-strong:text-current`}>
                        <ReactMarkdown 
                          components={{
                            code({node, inline, className, children, ...props}) {
                              const match = /language-(\w+)/.exec(className || '');
                              const language = match && match[1];
                              
                              if (language === 'mermaid') {
                                const chartCode = String(children).replace(/\n$/, '');
                                return (
                                  <MermaidDiagram chart={chartCode} />
                                );
                              }
                              
                              return (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                          {formData[question.id] || question.placeholder}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSectionStage = (stageId) => {
    const stage = TTD_STAGES[stageId];
    
    return (
      <div className="space-y-8">
        {/* Document Selection */}
        {renderDocumentSelection()}
        
        {/* Stage-Specific Q&A */}
        {renderStageQA()}
        
        {/* SME Section for all stages */}
        <div className={`${theme.colors.card} rounded-xl border ${theme.colors.border} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${theme.colors.text}`}>SME Collaboration</h3>
            <button
              onClick={() => setShowSMEQuestions(!showSMEQuestions)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                showSMEQuestions 
                  ? `${theme.colors.accent} text-white` 
                  : `${theme.name === "Vibrant" ? "bg-white/10 text-white border border-white/20" : "bg-blue-50 text-blue-700 border border-blue-200"}`
              } transition-colors`}
            >
              <MessageSquare className="h-4 w-4" />
              {showSMEQuestions ? 'Hide Questions' : 'Ask SME Questions'}
            </button>
          </div>

          {/* SME Selection */}
          <div className="mb-4">
            <label className={`block text-sm font-medium ${theme.colors.text} mb-3`}>
              Select Subject Matter Experts
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {SME_OPTIONS.map((sme) => (
                <div
                  key={sme.id}
                  onClick={() => handleSMESelection(sme.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedSMEs.includes(sme.id)
                      ? `${theme.name === "Vibrant" ? "border-blue-400 bg-blue-600/20" : "border-blue-500 bg-blue-50"}`
                      : `${theme.colors.border} ${theme.name === "Vibrant" ? "hover:bg-white/5" : "hover:bg-gray-50"}`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedSMEs.includes(sme.id) ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}>
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className={`font-medium ${theme.colors.text}`}>{sme.name}</p>
                      <p className={`text-sm ${theme.colors.textMuted}`}>{sme.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SME Questions */}
          {showSMEQuestions && (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                  Questions for Selected SMEs
                </label>
                <textarea
                  value={smeQuestions}
                  onChange={(e) => setSmeQuestions(e.target.value)}
                  placeholder={`Enter your questions about ${stage.name} for the selected SMEs...`}
                  rows={4}
                  className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme.name === "Vibrant" 
                      ? "bg-white/10 text-white placeholder-white/60" 
                      : "bg-white text-slate-900 placeholder-slate-500"
                  }`}
                />
              </div>
              <button
                onClick={handleSendSMEQuestions}
                className={`inline-flex items-center gap-2 px-4 py-2 ${theme.colors.accent} text-white rounded-lg hover:${theme.colors.accentHover} transition-colors`}
              >
                <Send className="h-4 w-4" />
                Send Questions to SMEs
              </button>
            </div>
          )}
        </div>

        {/* Stage Sections */}
        {stage.sections.map((section) => (
          <div key={section.id} className={`${theme.colors.card} rounded-xl border ${theme.colors.border} p-6`}>
            <div className="mb-4">
              <h3 className={`text-lg font-semibold ${theme.colors.text}`}>{section.title}</h3>
              <p className={`text-sm ${theme.colors.textMuted}`}>{section.description}</p>
            </div>
            
            <div className="space-y-4">
              {section.fields.map((field) => {
                // Hide other deployment fields if skip is "Yes"
                if (currentStage === 'deployment_strategy' && 
                    formData['skip_deployment_stage'] === 'Yes' && 
                    field.id !== 'skip_deployment_stage') {
                  return null;
                }
                
                return (
                <div key={field.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className={`block text-sm font-medium ${theme.colors.text}`}>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <button
                      onClick={() => toggleEditing(field.id)}
                      className={`p-1 rounded-lg transition-colors ${
                        editingField === field.id
                          ? `${theme.colors.accent} text-white`
                          : `${theme.colors.textMuted} hover:bg-white/10`
                      }`}
                      title={editingField === field.id ? "Save changes" : "Edit field"}
                    >
                      {editingField === field.id ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {/* Detail Level Selector */}
                  {field.detailLevel && (
                    <div className="space-y-2">
                      <label className={`block text-xs font-medium ${theme.colors.textMuted}`}>
                        {field.detailLevel.label}
                      </label>
                      <select
                        value={formData[field.detailLevel.id] || field.detailLevel.default}
                        onChange={(e) => handleInputChange(field.detailLevel.id, e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                          theme.name === "Vibrant" 
                            ? "bg-white/10 text-white" 
                            : "bg-white text-slate-900"
                        }`}
                      >
                        {field.detailLevel.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {editingField === field.id ? (
                    field.type === 'select' ? (
                      <select
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          theme.name === "Vibrant" 
                            ? "bg-white/10 text-white" 
                            : "bg-white text-slate-900"
                        }`}
                      >
                        <option value="">Select an option</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <textarea
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                        rows={4}
                        className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          theme.name === "Vibrant" 
                            ? "bg-white/10 text-white placeholder-white/60" 
                            : "bg-white text-slate-900 placeholder-slate-500"
                        }`}
                        autoFocus
                      />
                    )
                  ) : (
                    <div className={`p-4 rounded-lg border ${theme.colors.border} ${
                      theme.name === "Vibrant" ? "bg-white/5" : "bg-gray-50"
                    }`}>
                      <div className={`text-sm ${theme.colors.text} prose prose-sm max-w-none prose-headings:text-current prose-p:text-current prose-li:text-current prose-strong:text-current`}>
                        <ReactMarkdown 
                          components={{
                            code({node, inline, className, children, ...props}) {
                              const match = /language-(\w+)/.exec(className || '');
                              const language = match && match[1];
                              
                              if (language === 'mermaid') {
                                const chartCode = String(children).replace(/\n$/, '');
                                return (
                                  <MermaidDiagram chart={chartCode} />
                                );
                              }
                              
                              return (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                          {formData[field.id] || `Enter ${field.label.toLowerCase()}...`}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStageContent = () => {
    switch (currentStage) {
      case 'initial_questions':
        return renderInitialQuestions();
      default:
        return renderSectionStage(currentStage);
    }
  };

  const renderPreview = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className={`text-2xl font-bold ${theme.colors.text} mb-2`}>TTD Generated Successfully!</h2>
          <p className={`${theme.colors.textMuted}`}>
            Your Technical Transfer Document for {projectName} has been generated.
          </p>
        </div>

        <div className={`${theme.colors.card} rounded-xl border ${theme.colors.border} p-6`}>
          <h3 className={`text-lg font-semibold ${theme.colors.text} mb-4`}>Document Summary</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className={`text-sm ${theme.colors.textMuted}`}>Project Name</p>
              <p className={`font-medium ${theme.colors.text}`}>{projectName}</p>
            </div>
            <div>
              <p className={`text-sm ${theme.colors.textMuted}`}>Generated On</p>
              <p className={`font-medium ${theme.colors.text}`}>{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className={`text-sm ${theme.colors.textMuted}`}>Sections Completed</p>
              <p className={`font-medium ${theme.colors.text}`}>{completedStages.size + 1}</p>
            </div>
            <div>
              <p className={`text-sm ${theme.colors.textMuted}`}>Status</p>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Ready for Review
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => window.print()}
            className={`inline-flex items-center gap-2 px-4 py-2 border ${theme.colors.border} ${
              theme.name === "Vibrant" 
                ? "text-white hover:bg-white/10" 
                : "text-slate-700 hover:bg-slate-50"
            } rounded-lg transition-colors`}
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
          <button
            onClick={onClose}
            className={`inline-flex items-center gap-2 px-4 py-2 ${theme.colors.accent} text-white rounded-lg hover:${theme.colors.accentHover} transition-colors`}
          >
            <CheckCircle className="h-4 w-4" />
            Complete
          </button>
        </div>
      </div>
    );
  };

  // Completion Page Component
  const renderCompletionPage = () => {
    const handleTTDSelection = (ttdId, isSelected) => {
      if (isSelected) {
        setSelectedTTDs(prev => [...prev, ttdId]);
      } else {
        setSelectedTTDs(prev => prev.filter(id => id !== ttdId));
      }
    };

    const handleCombineSelected = () => {
      const ttdsToCombine = completedTTDs.filter(ttd => selectedTTDs.includes(ttd.id));
      handleCombineTTDs(ttdsToCombine);
      setSelectedTTDs([]);
    };

    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.colors.primary} ${theme.colors.text}`}>
        {/* Header */}
        <header className={`sticky top-0 z-40 ${theme.colors.header} border-b ${theme.colors.border}`}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCompletionPage(false)}
                className={`p-2 rounded-lg hover:bg-white/10 ${theme.colors.textMuted}`}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className={`text-xl font-bold ${theme.colors.text}`}>TTD Generation Complete</h1>
                <p className={`text-sm ${theme.colors.textMuted}`}>Project: {projectName}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className={`text-3xl font-bold ${theme.colors.text} mb-2`}>TTD Generation Complete!</h2>
            <p className={`text-lg ${theme.colors.textMuted}`}>
              Your Technical Transfer Document for {projectName} has been successfully generated and consolidated.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Download TTD */}
            <div className={`${theme.colors.card} rounded-xl border ${theme.colors.border} p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Download className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className={`text-lg font-semibold ${theme.colors.text}`}>Download TTD</h3>
              </div>
              <p className={`text-sm ${theme.colors.textMuted} mb-4`}>
                Download the completed Technical Transfer Document in Markdown format.
              </p>
              <button
                onClick={() => handleDownloadTTD(completedTTDs[completedTTDs.length - 1])}
                className={`w-full px-4 py-2 ${theme.colors.accent} text-white rounded-lg hover:${theme.colors.accentHover} transition-colors flex items-center justify-center gap-2`}
              >
                <Download className="h-4 w-4" />
                Download Latest TTD
              </button>
            </div>

            {/* Generate Next TTD */}
            <div className={`${theme.colors.card} rounded-xl border ${theme.colors.border} p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Plus className="h-6 w-6 text-green-600" />
                </div>
                <h3 className={`text-lg font-semibold ${theme.colors.text}`}>Generate Next TTD</h3>
              </div>
              <p className={`text-sm ${theme.colors.textMuted} mb-4`}>
                Start generating another TTD for the same project (e.g., different capability).
              </p>
              <button
                onClick={handleNewTTD}
                className={`w-full px-4 py-2 ${theme.colors.accent} text-white rounded-lg hover:${theme.colors.accentHover} transition-colors flex items-center justify-center gap-2`}
              >
                <Plus className="h-4 w-4" />
                Start New TTD
              </button>
            </div>

            {/* Combine TTDs */}
            <div className={`${theme.colors.card} rounded-xl border ${theme.colors.border} p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className={`text-lg font-semibold ${theme.colors.text}`}>Combine TTDs</h3>
              </div>
              <p className={`text-sm ${theme.colors.textMuted} mb-4`}>
                Combine multiple TTDs for this project into a single comprehensive document.
              </p>
              <button
                onClick={() => setShowTTDCombination(true)}
                className={`w-full px-4 py-2 ${theme.colors.accent} text-white rounded-lg hover:${theme.colors.accentHover} transition-colors flex items-center justify-center gap-2`}
                disabled={completedTTDs.length < 2}
              >
                <FileText className="h-4 w-4" />
                Combine TTDs ({completedTTDs.length})
              </button>
            </div>
          </div>

          {/* Completed TTDs Table */}
          {completedTTDs.length > 0 && (
            <div className={`${theme.colors.card} rounded-xl border ${theme.colors.border} p-6`}>
              <h3 className={`text-lg font-semibold ${theme.colors.text} mb-4`}>Completed TTDs</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${theme.colors.border}`}>
                      <th className={`text-left py-3 px-4 ${theme.colors.text}`}>TTD Name</th>
                      <th className={`text-left py-3 px-4 ${theme.colors.text}`}>Created</th>
                      <th className={`text-left py-3 px-4 ${theme.colors.text}`}>Status</th>
                      <th className={`text-left py-3 px-4 ${theme.colors.text}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedTTDs.map((ttd) => (
                      <tr key={ttd.id} className={`border-b ${theme.colors.border}`}>
                        <td className={`py-3 px-4 ${theme.colors.text}`}>{ttd.name}</td>
                        <td className={`py-3 px-4 ${theme.colors.textMuted}`}>
                          {new Date(ttd.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            ttd.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {ttd.status === 'completed' ? 'Completed' : 'Combined'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDownloadTTD(ttd)}
                              className={`p-1 rounded hover:bg-white/10 ${theme.colors.textMuted}`}
                              title="Download TTD"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            {completedTTDs.length > 1 && (
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedTTDs.includes(ttd.id)}
                                  onChange={(e) => handleTTDSelection(ttd.id, e.target.checked)}
                                  className="mr-2"
                                />
                                <span className={`text-sm ${theme.colors.textMuted}`}>Select</span>
                              </label>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {selectedTTDs.length > 0 && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleCombineSelected}
                    className={`px-4 py-2 ${theme.colors.accent} text-white rounded-lg hover:${theme.colors.accentHover} transition-colors flex items-center gap-2`}
                  >
                    <FileText className="h-4 w-4" />
                    Combine Selected TTDs ({selectedTTDs.length})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Back to Project Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={onClose}
              className={`px-6 py-3 ${theme.colors.accent} text-white rounded-lg hover:${theme.colors.accentHover} transition-colors flex items-center gap-2`}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Project
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (showCompletionPage) {
    return renderCompletionPage();
  }

  if (showPreview) {
    return renderPreview();
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.primary} ${theme.colors.text}`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 ${theme.colors.header} border-b ${theme.colors.border}`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className={`p-2 rounded-lg hover:bg-white/10 ${theme.colors.textMuted}`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className={`text-xl font-bold ${theme.colors.text}`}>TTD Generation</h1>
              <p className={`text-sm ${theme.colors.textMuted}`}>Project: {projectName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-lg hover:bg-white/10 ${theme.colors.textMuted} transition-colors relative`}
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              
              {/* Notifications Panel */}
              {showNotifications && (
                <div className={`notification-panel absolute right-0 top-full mt-2 w-80 ${theme.colors.card} rounded-xl border ${theme.colors.border} shadow-xl z-50`}>
                  <div className={`p-4 border-b ${theme.colors.border}`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold ${theme.colors.text}`}>Notifications</h3>
                      {notifications.filter(n => !n.read).length > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className={`text-xs ${theme.colors.textMuted} hover:${theme.colors.text} transition-colors`}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className={`p-4 text-center ${theme.colors.textMuted}`}>
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b ${theme.colors.border} hover:bg-white/5 transition-colors ${
                            !notification.read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              notification.type === 'success' ? 'bg-green-500' :
                              notification.type === 'info' ? 'bg-blue-500' :
                              notification.type === 'warning' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium ${theme.colors.text} ${!notification.read ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </p>
                              <p className={`text-sm ${theme.colors.textMuted} mt-1`}>
                                {notification.message}
                              </p>
                              <p className={`text-xs ${theme.colors.textMuted} mt-1`}>
                                {notification.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                            <button
                              onClick={() => removeNotification(notification.id)}
                              className={`p-1 rounded hover:bg-white/10 ${theme.colors.textMuted}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className={`text-sm ${theme.colors.textMuted}`}>
              Stage {currentStageIndex + 1} of {stageKeys.length}
            </div>
            <div className="flex items-center gap-2">
              {stageKeys.map((stageId, index) => (
                <div
                  key={stageId}
                  className={`w-3 h-3 rounded-full relative ${
                    index <= currentStageIndex
                      ? completedStages.has(stageId)
                        ? 'bg-green-500'
                        : processingStages.has(stageId)
                        ? 'bg-yellow-500 animate-pulse'
                        : 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}
                  title={processingStages.has(stageId) ? `Processing ${TTD_STAGES[stageId]?.name}...` : ''}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stage Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${TTD_STAGES[currentStage].color} text-white`}>
                {TTD_STAGES[currentStage].icon}
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${theme.colors.text}`}>
                  {TTD_STAGES[currentStage].name}
                </h2>
                <p className={`${theme.colors.textMuted}`}>
                  {TTD_STAGES[currentStage].description}
                </p>
              </div>
            </div>
            
            {isStageComplete(currentStage) && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Complete</span>
              </div>
            )}
          </div>
          
          {/* Scrollable Stage Navigation */}
          <div className="overflow-x-auto">
            <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 min-w-max">
              {stageKeys.map((stageId, index) => (
                <button
                  key={stageId}
                  onClick={() => setCurrentStage(stageId)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    currentStage === stageId
                      ? `${theme.name === "Vibrant" ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-900 shadow-sm'}`
                      : `${theme.name === "Vibrant" ? 'text-gray-600 hover:text-blue-300' : theme.colors.textMuted + ' hover:text-gray-900'}`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {TTD_STAGES[stageId].icon}
                    <span className="hidden sm:inline">{TTD_STAGES[stageId].name}</span>
                    <span className="sm:hidden">{index + 1}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TTD Processing Progress */}
        {processingStages.has(currentStage) && ttdProgress[currentStage] && (
          <div className={`${theme.colors.card} rounded-xl border ${theme.colors.border} p-6 mb-6`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className={`font-semibold ${theme.colors.text}`}>
                  Generating TTD for {TTD_STAGES[currentStage]?.name}
                </h3>
                <p className={`text-sm ${theme.colors.textMuted}`}>
                  Processing your inputs and generating comprehensive documentation...
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className={theme.colors.textMuted}>Progress</span>
                <span className={`font-medium ${theme.colors.text}`}>
                  {ttdProgress[currentStage].progress}%
                </span>
              </div>
              
              <div className={`w-full bg-gray-200 rounded-full h-2 ${theme.name === "Vibrant" ? "bg-white/20" : "bg-gray-200"}`}>
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${ttdProgress[currentStage].progress}%` }}
                />
              </div>
              
              <div className={`text-xs ${theme.colors.textMuted} flex items-center gap-2`}>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                {ttdProgress[currentStage].progress < 50 && "Analyzing documents and requirements..."}
                {ttdProgress[currentStage].progress >= 50 && ttdProgress[currentStage].progress < 80 && "Generating technical specifications..."}
                {ttdProgress[currentStage].progress >= 80 && "Finalizing TTD document..."}
              </div>
            </div>
          </div>
        )}

        {/* Stage Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={`${theme.colors.card} rounded-xl border ${theme.colors.border} p-6 shadow-sm`}
          >
            {/* Stage Progress Tracker */}
            {processingStages.has(currentStage) && ttdProgress[currentStage] && (
              <div className={`mb-6 p-4 rounded-lg border ${theme.colors.border} ${
                theme.name === "Vibrant" ? "bg-white/5" : "bg-blue-50"
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${theme.colors.text}`}>
                      Generating TTD for {TTD_STAGES[currentStage]?.name}
                    </h4>
                    <p className={`text-xs ${theme.colors.textMuted}`}>
                      Processing your inputs and generating comprehensive documentation...
                    </p>
                  </div>
                  <div className={`text-xs font-medium ${theme.colors.text}`}>
                    {ttdProgress[currentStage].progress}%
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className={`w-full ${theme.name === "Vibrant" ? "bg-white/20" : "bg-gray-200"} rounded-full h-1.5`}>
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${ttdProgress[currentStage].progress}%` }}
                    />
                  </div>
                  
                  <div className={`text-xs ${theme.colors.textMuted} flex items-center gap-2`}>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    {ttdProgress[currentStage].progress < 30 && "Analyzing documents and requirements..."}
                    {ttdProgress[currentStage].progress >= 30 && ttdProgress[currentStage].progress < 60 && "Processing SME feedback..."}
                    {ttdProgress[currentStage].progress >= 60 && ttdProgress[currentStage].progress < 90 && "Generating technical specifications..."}
                    {ttdProgress[currentStage].progress >= 90 && "Finalizing TTD document..."}
                  </div>
                </div>
              </div>
            )}

            {/* Stage Status Indicator */}
            {stageTTDs[currentStage] && (
              <div className={`mb-6 p-4 rounded-lg border border-green-200 ${
                theme.name === "Vibrant" ? "bg-green-500/10" : "bg-green-50"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${theme.colors.text}`}>
                      TTD Ready for {TTD_STAGES[currentStage]?.name}
                    </h4>
                    <p className={`text-xs ${theme.colors.textMuted}`}>
                      Your Technical Transfer Document has been generated and is ready for review.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const element = document.querySelector('.ttd-content');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`text-xs px-2 py-1 rounded ${theme.colors.accent} text-white hover:${theme.colors.accentHover} transition-colors`}
                  >
                    View TTD
                  </button>
                </div>
              </div>
            )}

            {renderStageContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStageIndex === 0}
            className={`inline-flex items-center gap-2 px-4 py-2 border ${theme.colors.border} ${
              currentStageIndex === 0
                ? 'opacity-50 cursor-not-allowed'
                : theme.name === "Vibrant" 
                  ? "text-white hover:bg-white/10" 
                  : "text-slate-700 hover:bg-slate-50"
            } rounded-lg transition-colors`}
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          {/* Stage Processing Indicator */}
          {processingStages.has(currentStage) && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              theme.name === "Vibrant" ? "bg-blue-500/20" : "bg-blue-100"
            }`}>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className={`text-xs ${theme.colors.textMuted}`}>
                Processing {TTD_STAGES[currentStage]?.name}...
              </span>
            </div>
          )}

          {/* Stage Complete Indicator */}
          {stageTTDs[currentStage] && !processingStages.has(currentStage) && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              theme.name === "Vibrant" ? "bg-green-500/20" : "bg-green-100"
            }`}>
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className={`text-xs ${theme.colors.textMuted}`}>
                {TTD_STAGES[currentStage]?.name} Complete
              </span>
            </div>
          )}

          <div className="flex gap-3">
            {/* Generate Prompt Button */}
            <button
              onClick={generatePrompt}
              className={`inline-flex items-center gap-2 px-4 py-2 border ${theme.colors.border} ${
                theme.name === "Vibrant" 
                  ? "text-white hover:bg-white/10" 
                  : "text-slate-700 hover:bg-slate-50"
              } rounded-lg transition-colors`}
            >
              <Eye className="h-4 w-4" />
              Review Prompt
            </button>

            {/* Process Stage Button */}
            {stageTTDs[currentStage] ? (
              <button
                onClick={handleNext}
                disabled={!isStageComplete(currentStage)}
                className={`inline-flex items-center gap-2 px-4 py-2 ${theme.colors.accent} text-white rounded-lg hover:${theme.colors.accentHover} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Next Stage
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={processStageTTD}
                disabled={isGenerating}
                className={`inline-flex items-center gap-2 px-6 py-2 ${theme.colors.accent} text-white rounded-lg hover:${theme.colors.accentHover} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isGenerating ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Process Stage
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Prompt Review Modal */}
        {showPromptReview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${theme.colors.chart} rounded-2xl shadow-xl border ${theme.colors.border} w-full max-w-4xl max-h-[90vh] overflow-hidden`}
            >
              {/* Modal Header */}
              <div className={`px-6 py-4 border-b ${theme.name === "Vibrant" ? "border-white/20" : "border-slate-100"} flex items-center justify-between`}>
                <h2 className={`text-lg font-semibold ${theme.colors.text}`}>Review Generated Prompt</h2>
                <button
                  onClick={() => setShowPromptReview(false)}
                  className={`p-1 rounded-lg hover:bg-white/10 ${theme.colors.textMuted}`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <pre className={`text-sm whitespace-pre-wrap ${
                  theme.name === "Vibrant" 
                    ? "text-white bg-white/10" 
                    : "text-slate-900 bg-gray-50"
                } p-4 rounded-lg border ${theme.colors.border}`}>
                  {currentPrompt}
                </pre>
              </div>

              {/* Modal Footer */}
              <div className={`px-6 py-4 border-t ${theme.name === "Vibrant" ? "border-white/20" : "border-slate-100"} flex items-center justify-end gap-3`}>
                <button
                  onClick={() => setShowPromptReview(false)}
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
                    setShowPromptReview(false);
                    processStageTTD();
                  }}
                  className={`px-4 py-2 rounded-lg ${theme.colors.accent} text-white hover:${theme.colors.accentHover} transition-colors`}
                >
                  Process with This Prompt
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Reasoning Stage Modal */}
        {showReasoningStage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${theme.colors.chart} rounded-2xl shadow-xl border ${theme.colors.border} w-full max-w-3xl max-h-[90vh] overflow-hidden`}
            >
              {/* Modal Header */}
              <div className={`px-6 py-4 border-b ${theme.name === "Vibrant" ? "border-white/20" : "border-slate-100"} flex items-center justify-between`}>
                <div>
                  <h2 className={`text-lg font-semibold ${theme.colors.text}`}>Falcon Reasoning Stage</h2>
                  <p className={`text-sm ${theme.colors.textMuted}`}>
                    Round {currentReasoningRound} of {maxReasoningRounds} - Additional Clarifications
                  </p>
                </div>
                <button
                  onClick={handleReasoningSkip}
                  className={`p-1 rounded-lg hover:bg-white/10 ${theme.colors.textMuted}`}
                  title="Skip reasoning stage"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-6">
                  {/* Falcon Avatar and Message */}
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full ${theme.colors.accent} flex items-center justify-center flex-shrink-0`}>
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className={`${theme.colors.card} rounded-xl border ${theme.colors.border} p-4 flex-1`}>
                      <p className={`text-sm ${theme.colors.text}`}>
                        <strong>Falcon AI:</strong> I've analyzed your responses and the selected documents. I have some additional questions to ensure the TTD generation is comprehensive and accurate for your COBOL to Java conversion project.
                      </p>
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="space-y-4">
                    {reasoningQuestions.map((question, index) => (
                      <div key={question.id} className={`${theme.colors.card} rounded-xl border ${theme.colors.border} p-4`}>
                        <div className="flex items-start gap-3 mb-3">
                          <span className={`w-6 h-6 rounded-full ${theme.colors.accent} text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                question.type === 'clarification' ? 'bg-blue-100 text-blue-700' :
                                question.type === 'requirement' ? 'bg-green-100 text-green-700' :
                                question.type === 'technical' ? 'bg-purple-100 text-purple-700' :
                                question.type === 'performance' ? 'bg-orange-100 text-orange-700' :
                                question.type === 'architecture' ? 'bg-indigo-100 text-indigo-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
                              </span>
                            </div>
                            <div className="flex items-start gap-2 mb-3">
                              <p className={`text-sm ${theme.colors.text} flex-1`}>
                                <strong>Falcon:</strong> {question.question}
                              </p>
                              <button
                                className={`p-1 rounded-lg hover:bg-white/10 ${theme.colors.textMuted} transition-colors`}
                                title="Attach file or code"
                              >
                                <Paperclip className="h-4 w-4" />
                              </button>
                            </div>
                            <textarea
                              value={reasoningAnswers[question.id] || ''}
                              onChange={(e) => handleReasoningAnswerChange(question.id, e.target.value)}
                              placeholder="Your answer..."
                              rows={3}
                              className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                theme.name === "Vibrant" 
                                  ? "bg-white/10 text-white placeholder-white/60" 
                                  : "bg-white text-slate-900 placeholder-slate-500"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`px-6 py-4 border-t ${theme.name === "Vibrant" ? "border-white/20" : "border-slate-100"} flex items-center justify-between`}>
                <button
                  onClick={handleReasoningSkip}
                  className={`px-4 py-2 rounded-lg border ${theme.colors.border} ${
                    theme.name === "Vibrant"
                      ? "text-white hover:bg-white/10"
                      : "text-slate-700 hover:bg-slate-50"
                  } transition-colors`}
                >
                  Skip Reasoning
                </button>
                <div className="flex items-center gap-3">
                  <span className={`text-xs ${theme.colors.textMuted}`}>
                    Round {currentReasoningRound}/{maxReasoningRounds}
                  </span>
                  <button
                    onClick={handleReasoningSubmit}
                    disabled={isGenerating}
                    className={`px-4 py-2 rounded-lg ${theme.colors.accent} text-white hover:${theme.colors.accentHover} transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Submit Answers
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* TTD Editing Modal */}
        <AnimatePresence>
          {editingTTD && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`${theme.colors.chart} rounded-2xl shadow-xl border ${theme.colors.border} w-full max-w-6xl max-h-[90vh] overflow-hidden`}
              >
                {/* Modal Header */}
                <div className={`px-6 py-4 border-b ${theme.name === "Vibrant" ? "border-white/20" : "border-slate-100"} flex items-center justify-between`}>
                  <div>
                    <h2 className={`text-lg font-semibold ${theme.colors.text}`}>Edit TTD Content</h2>
                    <p className={`text-sm ${theme.colors.textMuted}`}>
                      {TTD_STAGES[currentStage].name} - Manual editing mode
                    </p>
                  </div>
                  <button
                    onClick={handleCancelEditTTD}
                    className={`p-1 rounded-lg hover:bg-white/10 ${theme.colors.textMuted}`}
                    title="Cancel editing"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 flex-1 overflow-hidden">
                  <div className="h-full flex flex-col">
                    <div className="mb-4">
                      <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                        TTD Content (Markdown)
                      </label>
                      <p className={`text-xs ${theme.colors.textMuted} mb-3`}>
                        You can edit the TTD content directly. Use Markdown syntax for formatting, and include Mermaid diagrams using \`\`\`mermaid code blocks.
                      </p>
                    </div>
                    
                    <textarea
                      value={editedTTDContent}
                      onChange={(e) => setEditedTTDContent(e.target.value)}
                      className={`flex-1 w-full px-4 py-3 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none ${
                        theme.name === "Vibrant" 
                          ? "bg-white/10 text-white placeholder-white/60" 
                          : "bg-white text-slate-900 placeholder-slate-500"
                      }`}
                      placeholder="Enter TTD content in Markdown format..."
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className={`px-6 py-4 border-t ${theme.name === "Vibrant" ? "border-white/20" : "border-slate-100"} flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${theme.colors.textMuted}`}>
                      Characters: {editedTTDContent.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCancelEditTTD}
                      className={`px-4 py-2 rounded-lg border ${theme.colors.border} ${
                        theme.name === "Vibrant"
                          ? "text-white hover:bg-white/10"
                          : "text-slate-700 hover:bg-slate-50"
                      } transition-colors`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveTTD}
                      className={`px-4 py-2 rounded-lg ${theme.colors.accent} text-white hover:${theme.colors.accentHover} transition-colors flex items-center gap-2`}
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generated TTD Display */}
        {stageTTDs[currentStage] && (
          <div className="mt-8 ttd-content">
            <div className={`${theme.colors.card} rounded-xl border ${theme.colors.border} p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${theme.colors.text}`}>
                  Generated TTD for {TTD_STAGES[currentStage].name}
                </h3>
                <button
                  onClick={handleEditTTD}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${theme.colors.border} ${
                    theme.name === "Vibrant"
                      ? "text-white hover:bg-white/10"
                      : "text-slate-700 hover:bg-slate-50"
                  } transition-colors`}
                  title="Edit TTD content"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit TTD
                </button>
              </div>
              <div className="text-sm text-black bg-white p-4 rounded-lg border max-h-96 overflow-y-auto prose prose-sm max-w-none prose-headings:text-black prose-p:text-black prose-li:text-black prose-strong:text-black">
                <ReactMarkdown 
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      const language = match && match[1];
                      
                      if (language === 'mermaid') {
                        const chartCode = String(children).replace(/\n$/, '');
                        console.log('Rendering Mermaid diagram:', chartCode.substring(0, 100) + '...');
                        return (
                          <MermaidDiagram chart={chartCode} />
                        );
                      }
                      
                      return (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    // Handle custom MermaidDiagram components
                    p({node, children, ...props}) {
                      // Check if this paragraph contains a MermaidDiagram component
                      const text = String(children);
                      if (text.includes('<MermaidDiagram chart="')) {
                        const match = text.match(/<MermaidDiagram chart="([^"]+)"/);
                        if (match) {
                          const chartCode = match[1];
                          console.log('Extracted chart code:', chartCode.substring(0, 100) + '...');
                          return <MermaidDiagram chart={chartCode} />;
                        }
                      }
                      return <p {...props}>{children}</p>;
                    }
                  }}
                >
                  {stageTTDs[currentStage]}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
