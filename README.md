# Ford Falcon Portal

An AI-driven legacy code conversion tracking portal for Ford's internal projects. This React application provides a comprehensive dashboard for monitoring project progress, evaluation scores, and real-time metrics with advanced automation capabilities.

## 🚀 Features

### Core Functionality
- **Real-time Dashboard**: Live project tracking with KPI metrics and performance indicators
- **Interactive Charts**: Weekly LoC processing, evaluation scores, and stage distribution visualization
- **Project Management**: Searchable project table with progress tracking and risk assessment
- **Voice & Chat Interface**: AI-powered chat with voice recognition capabilities
- **Multi-Theme Support**: Professional, Vibrant, and Readable theme options
- **Responsive Design**: Modern UI optimized for all devices and screen sizes
- **Session Management**: Track and manage project conversion sessions
- **Document Management**: Comprehensive document upload, analysis, and chat capabilities
- **Automation Engine**: AI-driven code conversion with iterative improvement cycles
- **Notification System**: Real-time notifications for project updates and milestones

### Advanced Features
- **Speech Recognition**: Voice-enabled project queries and document interactions
- **Document Chat**: AI-powered document analysis and Q&A capabilities
- **Session History**: Complete audit trail of project conversion sessions
- **Iterative Improvement**: Quality assessment with threshold-based iterations
- **SME Integration**: Subject Matter Expert approval workflows
- **Artifact Management**: Comprehensive tracking of input/output documents

## 🏗️ Project Structure

```
UI/
├── assets/                    # Static assets
│   ├── ford-logo.png         # Ford branding
│   ├── front_image.png       # Hero image
│   └── engine_start.mp3      # Audio feedback
├── public/                   # Public assets
│   ├── index.html           # Main HTML template
│   └── assets/              # Public static files
├── src/                     # React source code
│   ├── App.js              # Main application component with routing
│   ├── index.js            # React entry point
│   ├── index.css           # Global styles with Tailwind CSS
│   ├── components/         # Reusable UI components
│   │   ├── Dashboard.js           # Main dashboard with KPIs and charts
│   │   ├── ProjectDetails.js      # Project overview and timeline
│   │   ├── SessionDetails.js      # Session history and artifacts
│   │   ├── DocumentChat.js        # AI-powered document Q&A
│   │   ├── ConfirmationPage.js    # Project confirmation workflow
│   │   └── NotificationsPage.js   # Notification management
│   ├── pages/              # Page components
│   │   └── ProjectDetailsPage.js  # Detailed project view
│   └── context/            # React context providers
│       └── ThemeContext.js        # Theme management
├── data/                   # Project data and evaluations
│   ├── example_files/      # Sample evaluation documents
│   ├── GEVIS/             # GEVIS project data
│   └── misc/              # Miscellaneous project data
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── postcss.config.js      # PostCSS configuration
```

## 🧩 Components & Functions

### Core Components

#### Dashboard.js (644 lines)
**Main dashboard component with comprehensive project overview**

**Key Functions:**
- `useSpeechRecognition(enabled)` - Voice recognition hook for chat interface
- `KPI({ label, value, sub, theme })` - KPI card component with theme support
- `RiskBadge({ risk, theme })` - Risk level indicator with color coding
- `ThemeSelector({ currentTheme, onThemeChange })` - Theme switching component

**Features:**
- Real-time KPI metrics (live projects, completed projects, LoC processing)
- Interactive charts (weekly LoC, evaluation scores, stage distribution)
- Searchable project table with filtering
- Voice-enabled AI chat interface
- Theme switching with 3 preset themes
- Global notifications system

#### ProjectDetailsPage.js (2044 lines)
**Comprehensive project details and management interface**

**Key Functions:**
- `useSpeechRecognition(enabled)` - Voice recognition for project interactions
- `startEngine()` - Initiates AI conversion engine with audio feedback
- `handleStageProgress()` - Manages stage progression and automation
- `handleDocumentUpload()` - Document management and validation

**Features:**
- 10-stage project pipeline visualization
- Session history tracking
- Document upload and management
- AI-powered document chat
- Automation mode with progress tracking
- SME approval workflows
- Artifact generation and evaluation

#### DocumentChat.js (568 lines)
**AI-powered document analysis and Q&A interface**

**Key Functions:**
- `handleSendMessage()` - Processes user queries and generates AI responses
- `handleKeyPress()` - Keyboard shortcuts and input handling
- `scrollToBottom()` - Auto-scroll to latest messages

**Features:**
- Real-time document Q&A
- Markdown rendering for responses
- Voice input support
- Message history persistence
- Loading states and error handling

#### SessionDetails.js (569 lines)
**Session history and artifact management**

**Key Functions:**
- `formatDuration()` - Session duration calculation
- `getStageProgress()` - Progress tracking across pipeline stages
- `handleArtifactDownload()` - Document download functionality

**Features:**
- Complete session audit trail
- Artifact categorization and management
- Progress visualization
- Document evaluation tracking
- Export capabilities

### Context Providers

#### ThemeContext.js (121 lines)
**Theme management with localStorage persistence**

**Available Themes:**
1. **Professional** (🎨) - Clean, corporate design
2. **Vibrant** (☀️) - Dynamic, colorful interface
3. **Readable** (👁️) - High contrast, accessibility-focused

**Functions:**
- `useTheme()` - Hook for accessing theme context
- `changeTheme(themeName)` - Theme switching with persistence
- Automatic localStorage synchronization

## 🔄 Project Pipeline

The application manages a 10-stage legacy code conversion pipeline:

1. **Data Ingestion** - Document and code collection
2. **Document Generation** - AI-powered documentation creation
3. **Document Evaluation** - Quality assessment and review
4. **SME Approval (Docs)** - Subject Matter Expert validation
5. **TTD Generation** - Test-Driven Development framework
6. **Code Conversion** - AI-driven legacy code conversion
7. **Code Evaluation** - Quality assessment of converted code
8. **SME Approval (Code)** - Final technical review
9. **Sandbox Release** - Testing environment deployment
10. **Project Completed** - Final delivery and handover

## 📊 Data Models

### Project Structure
```javascript
{
  name: "MISC",
  owner: "Ford Credit", 
  progress: 8,           // Current pipeline stage (1-10)
  risk: "low"           // Risk level: low/medium/high
}
```

### Session History
```javascript
{
  id: "misc_001",
  startTime: "2024-01-15T09:30:00Z",
  endTime: "2024-01-15T16:45:00Z",
  finalStage: 7,
  status: 'incomplete',
  totalStages: 11,
  artifacts: {
    inputDocs: ["COBOL_Source_Files.zip"],
    outputDocs: ["Comprehension_Analysis.pdf"],
    codeArtifacts: ["Java_Conversion_Phase1.zip"]
  }
}
```

### Evaluation Metrics
```javascript
{
  metric: "Document Comprehension",
  score: 4.6,
  target: 4.5,
  status: "above_threshold"
}
```

## 🛠️ Technologies Used

### Frontend Framework
- **React 18** - Modern React with hooks and functional components
- **React Router DOM 7.8.1** - Client-side routing
- **Framer Motion 10.16.4** - Animation library for smooth transitions

### Styling & UI
- **Tailwind CSS 3.3.0** - Utility-first CSS framework
- **Lucide React 0.292.0** - Modern icon library
- **PostCSS 8.4.31** - CSS processing
- **Autoprefixer 10.4.16** - CSS vendor prefixing

### Data Visualization
- **Recharts 2.8.0** - Chart components for data visualization
  - Area charts for LoC trends
  - Radar charts for evaluation scores
  - Bar charts for stage distribution

### Content & Markdown
- **React Markdown 10.1.0** - Markdown rendering for AI responses

### Voice & Audio
- **Web Speech API** - Native browser speech recognition
- **HTML5 Audio** - Audio feedback for engine startup

### Development Tools
- **React Scripts 5.0.1** - Create React App build tools
- **ESLint** - Code linting and quality enforcement
- **Jest** - Testing framework (via React Scripts)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager
- Modern browser with Web Speech API support (Chrome recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Start development server with hot reload
- `npm build` - Create optimized production build
- `npm test` - Run test suite
- `npm eject` - Eject from Create React App (irreversible)

## 🔧 Configuration

### Environment Variables
The application uses Create React App's environment variable system:

```bash
# .env.local (for local development)
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENABLE_VOICE=true
```

### Theme Configuration
Themes are configured in `src/context/ThemeContext.js` and include:
- Color schemes for different UI elements
- Font sizing and typography
- Border and spacing configurations
- Chart and component styling

### Tailwind Configuration
Custom Tailwind configuration in `tailwind.config.js`:
- Custom color palette
- Responsive breakpoints
- Component-specific utilities
- Animation configurations

## 🌐 Browser Support

### Recommended
- **Chrome 90+** - Full feature support including voice recognition
- **Firefox 88+** - Full feature support
- **Safari 14+** - Full feature support
- **Edge 90+** - Full feature support

### Voice Features
- Requires HTTPS in production environments
- Chrome provides best voice recognition accuracy
- Fallback to text input when voice is unavailable

## 🔒 Security Considerations

### Production Deployment
- Enable HTTPS for voice recognition features
- Implement proper authentication (Azure AD recommended)
- Configure CORS policies for API integration
- Use environment variables for sensitive configuration

### Data Handling
- All data is currently client-side (mock data)
- Implement proper data validation for API integration
- Consider data encryption for sensitive project information
- Implement proper session management

## 📈 Performance Optimization

### Current Optimizations
- React.memo for expensive components
- useMemo for computed values
- Lazy loading for large components
- Optimized bundle splitting

### Production Build
- Minified JavaScript and CSS
- Optimized images and assets
- Gzip compression enabled
- Service worker for caching (if implemented)

## 🔄 Integration Points

### Backend API Integration
To integrate with real backend services:

1. **Replace mock data** in components with API calls
2. **Implement authentication** (Azure AD integration recommended)
3. **Add real-time updates** using WebSocket or polling
4. **Configure CORS** for cross-origin requests

### Example API Integration
```javascript
// Replace mock data with API calls
const fetchProjects = async () => {
  const response = await fetch('/api/projects');
  const projects = await response.json();
  setProjects(projects);
};
```

## 🧪 Testing

### Current Test Setup
- Jest testing framework (via React Scripts)
- React Testing Library for component testing
- User event simulation for interaction testing

### Running Tests
```bash
npm test                    # Run all tests
npm test -- --watch        # Run tests in watch mode
npm test -- --coverage     # Generate coverage report
```

## 📝 Development Guidelines

### Code Style
- Use functional components with hooks
- Implement proper error boundaries
- Follow React best practices
- Use TypeScript for type safety (recommended)

### Component Structure
```javascript
// Component template
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ComponentName({ props }) {
  const { theme } = useTheme();
  const [state, setState] = useState(initialState);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  return (
    <div className={`${theme.colors.card} ${theme.colors.text}`}>
      {/* Component content */}
    </div>
  );
}
```

## 🐛 Troubleshooting

### Common Issues

**Voice Recognition Not Working**
- Ensure HTTPS in production
- Check browser permissions
- Verify Web Speech API support

**Build Errors**
- Clear node_modules and reinstall
- Check for conflicting dependencies
- Verify Node.js version compatibility

**Performance Issues**
- Check for memory leaks in useEffect
- Optimize expensive computations
- Implement proper memoization

## 📄 License

This project is proprietary to Ford Motor Company and is not licensed for public use.

## 🤝 Contributing

For internal Ford development teams:
1. Follow the established code style
2. Add tests for new features
3. Update documentation for API changes
4. Ensure accessibility compliance
5. Test across supported browsers

## 📞 Support

For technical support or questions:
- Internal Ford development teams
- Project maintainers
- Documentation updates

---

**Ford Falcon Portal** - Transforming legacy code conversion with AI-powered automation and comprehensive project management.
