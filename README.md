# Ford Falcon Portal

An AI-driven legacy code conversion tracking portal for Ford's internal projects. This React application provides a comprehensive dashboard for monitoring project progress, evaluation scores, and real-time metrics.

## Features

- **Real-time Dashboard**: Live project tracking with KPI metrics
- **Interactive Charts**: Weekly LoC processing, evaluation scores, and stage distribution
- **Project Management**: Searchable project table with progress tracking
- **Voice & Chat Interface**: AI-powered chat with voice recognition capabilities
- **Responsive Design**: Modern UI optimized for all devices

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open in Browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
UI/
├── assets/                 # Images and static assets
│   ├── ford-logo.png
│   └── front_image.png
├── public/                 # Public assets
├── src/                    # React source code
│   ├── App.js             # Main application component
│   ├── index.js           # React entry point
│   └── index.css          # Global styles with Tailwind
├── data/                   # Project data and evaluations
└── package.json           # Dependencies and scripts
```

## Key Components

- **KPI Cards**: Live projects, completed projects, LoC metrics
- **Charts**: Area chart for weekly LoC, radar chart for evaluation scores, bar chart for stage distribution
- **Project Table**: Searchable list of all projects with progress indicators
- **Chat Interface**: Voice-enabled AI assistant for project queries

## Technologies Used

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Chart components
- **Lucide React** - Icon library
- **Web Speech API** - Voice recognition

## Development

The application uses mock data for demonstration. To integrate with real data:

1. Replace mock data in `src/App.js` with API calls
2. Implement authentication (Azure AD integration suggested)
3. Connect to your backend services
4. Add real-time updates using WebSocket or polling

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Browser Support

- Chrome (recommended for voice features)
- Firefox
- Safari
- Edge

Voice recognition requires HTTPS in production environments.
