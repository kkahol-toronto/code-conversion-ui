import React from "react";
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import TTDGeneration from "./components/TTDGeneration";
import { ThemeProvider } from "./context/ThemeContext";

function TTDGenerationWrapper() {
  const { projectName } = useParams();
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate(`/project/${projectName}`);
  };
  
  return <TTDGeneration projectName={projectName} onClose={handleClose} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:projectName" element={<ProjectDetailsPage />} />
          <Route path="/ttd/:projectName" element={<TTDGenerationWrapper />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
