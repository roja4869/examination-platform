"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { Quiz, LeaderboardEntry } from "@/types";
import { motion } from "framer-motion";
import { Trophy, Medal, Search, ArrowRight } from "lucide-react";

export default function LeaderboardPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<string>("");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get("/quizzes");
        setQuizzes(res.data);
        if (res.data.length > 0) {
          setSelectedQuiz(res.data[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!selectedQuiz) return;
      setLoading(true);
      try {
        const res = await api.get(`/attempts/leaderboard/${selectedQuiz}`);
        setLeaderboard(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [selectedQuiz]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block p-4 bg-amber-100 rounded-full text-amber-600 mb-4"
          >
            <Trophy size={48} />
          </motion.div>
          <h1 className="text-4xl font-black mb-4">Hall of Fame</h1>
          <p className="text-slate-500 max-w-md mx-auto">Top performers across our most challenging assessments.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Quiz Selection Sidebar */}
          <aside className="md:col-span-1 space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Select Quiz</h2>
            <div className="space-y-2">
              {quizzes.map(quiz => (
                <button
                  key={quiz.id}
                  onClick={() => setSelectedQuiz(quiz.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all text-sm font-medium ${
                    selectedQuiz === quiz.id
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {quiz.title}
                </button>
              ))}
            </div>
          </aside>

          {/* Leaderboard Table */}
          <main className="md:col-span-3">
            <div className="glass-card overflow-hidden">
              {loading ? (
                <div className="p-20 text-center text-slate-400">Updating leaderboard...</div>
              ) : leaderboard.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Rank</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Student</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {leaderboard.map((entry, index) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={index} 
                        className={`transition-colors ${index < 3 ? "bg-amber-50/30 dark:bg-amber-900/10" : "hover:bg-slate-50/50 dark:hover:bg-slate-900/30"}`}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold">
                            {index === 0 ? <Medal className="text-amber-500" size={24} /> : 
                             index === 1 ? <Medal className="text-slate-400" size={24} /> :
                             index === 2 ? <Medal className="text-amber-700" size={24} /> :
                             <span className="text-slate-400 text-sm">{index + 1}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-bold text-slate-800 dark:text-slate-200">{entry.name}</div>
                          <div className="text-xs text-slate-400">{new Date(entry.completed_at).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-5 text-right font-black text-xl text-indigo-600">
                          {entry.score.toFixed(1)}%
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-20 text-center">
                  <div className="text-slate-300 mb-4 flex justify-center"><Search size={48} /></div>
                  <p className="text-slate-500">No attempts yet for this quiz.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
