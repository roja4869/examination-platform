"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User, LayoutDashboard, Settings, Trophy, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-card !rounded-none !border-t-0 !border-x-0 bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div 
              whileHover={{ rotate: 180 }}
              className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-rose-500 rounded-lg"
            />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-500">
              ExamPro
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-1 hover:text-indigo-600 transition-colors">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            {user?.role === "ADMIN" && (
              <Link href="/admin/exams" className="flex items-center space-x-1 hover:text-indigo-600 transition-colors">
                <Settings size={18} />
                <span>Admin</span>
              </Link>
            )}
            <Link href="/leaderboard" className="flex items-center space-x-1 hover:text-indigo-600 transition-colors">
              <Trophy size={18} />
              <span>Leaderboard</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-full">
                  <User size={16} />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <button 
                  onClick={logout}
                  className="flex items-center space-x-1 text-slate-500 hover:text-rose-500 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="btn-secondary !px-4 !py-1.5 text-sm">Login</Link>
                <Link href="/signup" className="btn-primary !px-4 !py-1.5 text-sm">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
