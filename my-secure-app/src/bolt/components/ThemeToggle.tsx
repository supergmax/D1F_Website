import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 
                 dark:bg-slate-800 bg-gray-200 hover:bg-gray-300 dark:hover:bg-slate-700"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-blue-400" />
      ) : (
        <Moon size={20} className="text-blue-600" />
      )}
    </button>
  );
}