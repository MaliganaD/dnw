import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="p-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#1a1d29] hover:bg-gray-200 dark:hover:bg-[#2d2f36] transition-colors">
      {theme === "light" ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-blue-400" />}
    </button>
  );
};
export default ThemeToggle;