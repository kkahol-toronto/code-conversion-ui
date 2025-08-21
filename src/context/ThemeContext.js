import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme definitions
const themes = {
  professional: {
    name: "Professional",
    icon: "🎨",
    colors: {
      primary: "from-sky-50 via-white to-indigo-50",
      card: "bg-white/90 backdrop-blur",
      border: "border-slate-200",
      text: "text-slate-900",
      textSecondary: "text-slate-600",
      textMuted: "text-slate-500",
      accent: "bg-blue-600",
      accentHover: "hover:bg-blue-700",
      progress: "from-blue-400 to-indigo-600",
      header: "bg-white/80 backdrop-blur-xl",
      chart: "bg-white",
      tooltip: "bg-slate-900 text-white"
    },
    fonts: {
      base: "text-base",
      heading: "text-3xl md:text-4xl",
      kpi: "text-3xl",
      table: "text-sm"
    }
  },
  vibrant: {
    name: "Vibrant",
    icon: "☀️",
    colors: {
      primary: "from-blue-600 via-blue-800 to-yellow-600",
      card: "bg-gradient-to-br from-blue-900/80 via-blue-800/80 to-yellow-600/70 backdrop-blur border-2",
      border: "border-blue-300",
      text: "text-white",
      textSecondary: "text-gray-100",
      textMuted: "text-gray-200",
      accent: "bg-gradient-to-r from-blue-700 via-blue-800 to-yellow-600",
      accentHover: "hover:from-blue-800 hover:via-blue-900 hover:to-yellow-700",
      progress: "from-blue-600 via-blue-800 to-yellow-600",
      header: "bg-gradient-to-r from-blue-900/80 via-blue-800/80 to-yellow-600/80 backdrop-blur-xl border-blue-300",
      chart: "bg-gradient-to-br from-blue-900/70 via-blue-800/70 to-yellow-600/60",
      tooltip: "bg-gradient-to-r from-blue-900 to-blue-800 text-white"
    },
    fonts: {
      base: "text-base",
      heading: "text-3xl md:text-4xl",
      kpi: "text-3xl",
      table: "text-sm"
    }
  },
  readable: {
    name: "Readable",
    icon: "👁️",
    colors: {
      primary: "from-gray-50 via-white to-gray-100",
      card: "bg-white",
      border: "border-gray-300",
      text: "text-gray-900",
      textSecondary: "text-gray-700",
      textMuted: "text-gray-500",
      accent: "bg-gray-800",
      accentHover: "hover:bg-gray-900",
      progress: "from-gray-600 to-gray-800",
      header: "bg-white border-gray-300",
      chart: "bg-white",
      tooltip: "bg-gray-900 text-white"
    },
    fonts: {
      base: "text-lg",
      heading: "text-4xl md:text-5xl",
      kpi: "text-4xl",
      table: "text-base"
    }
  }
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('professional');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('ford-falcon-theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('ford-falcon-theme', themeName);
    }
  };

  const value = {
    currentTheme,
    changeTheme,
    theme: themes[currentTheme],
    themes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
