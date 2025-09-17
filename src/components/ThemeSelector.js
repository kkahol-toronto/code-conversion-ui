import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeSelector({ currentTheme, onThemeChange }) {
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