"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { Quiz, Attempt } from "@/types";
import { motion } from "framer-motion";
import { Plus, BookOpen, Clock, Award, ChevronRight, BarChart3, Users } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, attemptRes] = await Promise.all([
          api.get("/quizzes"),
          api.get("/attempts/my-results")
        ]);
        setQuizzes(quizRes.data);
        setAttempts(attemptRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
          <p className="text-slate-500">Here's what's happening with your assessments.</p>
        </header>

        {user?.role === "ADMIN" ? (
          <AdminView quizzes={quizzes} />
        ) : (
          <StudentView quizzes={quizzes} attempts={attempts} />
        )}
      </div>
    </div>
  );
}

function AdminView({ quizzes }: { quizzes: Quiz[] }) {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<BookOpen />} label="Total Exams" value={quizzes.length} color="bg-indigo-500" />
        <StatCard icon={<Users />} label="Total Students" value="--" color="bg-rose-500" />
        <StatCard icon={<BarChart3 />} label="Total Attempts" value="--" color="bg-emerald-500" />
      </div>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Active Exams</h2>
          <Link href="/admin/exams/create" className="btn-primary flex items-center space-x-2">
            <Plus size={18} />
            <span>Create Exam</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="glass-card p-6">
              <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{quiz.description}</p>
              <div className="flex items-center space-x-4 text-sm text-slate-400 mb-6">
                <span className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>{quiz.duration}m</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Award size={14} />
                  <span>Max {quiz.attempt_limit} attempts</span>
                </span>
              </div>
              <div className="flex space-x-2">
                <Link href={`/admin/exams/${quiz.id}`} className="btn-secondary !px-3 !py-1.5 text-xs flex-1 text-center">
                  Edit
                </Link>
                <Link href={`/admin/exams/${quiz.id}/results`} className="btn-primary !px-3 !py-1.5 text-xs flex-1 text-center">
                  Results
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StudentView({ quizzes, attempts }: { quizzes: Quiz[], attempts: Attempt[] }) {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-6">Available Exams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="glass-card p-6 flex flex-col">
              <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
              <p className="text-slate-500 text-sm mb-6 flex-1">{quiz.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  <p>{quiz.duration} mins • {quiz.attempt_limit} attempts</p>
                </div>
                <Link href={`/quiz/${quiz.id}`} className="btn-primary !px-4 !py-2 text-sm flex items-center space-x-1">
                  <span>Start</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Recent Attempts</h2>
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold">Exam</th>
                <th className="px-6 py-4 text-sm font-semibold">Score</th>
                <th className="px-6 py-4 text-sm font-semibold">Completed At</th>
                <th className="px-6 py-4 text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {attempts.map((attempt) => (
                <tr key={attempt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{attempt.quiz_title}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${attempt.score >= 70 ? "text-emerald-500" : attempt.score >= 40 ? "text-amber-500" : "text-rose-500"}`}>
                      {attempt.score.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(attempt.completed_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">
                      {attempt.status}
                    </span>
                  </td>
                </tr>
              ))}
              {attempts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400">No attempts yet. Start your first quiz!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: any, color: string }) {
  return (
    <div className="glass-card p-6 flex items-center space-x-4">
      <div className={`p-4 rounded-xl text-white ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );
}
