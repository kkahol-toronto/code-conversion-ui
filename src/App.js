import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:projectName" element={<ProjectDetailsPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
