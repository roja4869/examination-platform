"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { LeaderboardEntry, Quiz } from "@/types";
import { ArrowLeft, Users, BarChart, Download } from "lucide-react";

export default function ExamResultsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [results, setResults] = useState<LeaderboardEntry[]>([]);
  const [exam, setExam] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, resultRes] = await Promise.all([
          api.get(`/quizzes/${id}`),
          api.get(`/attempts/leaderboard/${id}`)
        ]);
        setExam(quizRes.data);
        setResults(resultRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  const averageScore = results.length > 0 
    ? results.reduce((acc, r) => acc + r.score, 0) / results.length 
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <button 
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Exams</span>
        </button>

        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{exam?.title} - Results</h1>
            <p className="text-slate-500">Detailed performance analytics for this assessment.</p>
          </div>
          <div className="flex space-x-4">
            <div className="glass-card !bg-indigo-600 text-white px-6 py-3 flex items-center space-x-3">
              <Users size={24} />
              <div>
                <p className="text-xs opacity-70">Total Participants</p>
                <p className="text-xl font-bold">{results.length}</p>
              </div>
            </div>
            <div className="glass-card !bg-emerald-600 text-white px-6 py-3 flex items-center space-x-3">
              <BarChart size={24} />
              <div>
                <p className="text-xs opacity-70">Average Score</p>
                <p className="text-xl font-bold">{averageScore.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </header>

        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Student Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Score</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Submission Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {results.map((res, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{res.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-full max-w-[100px] bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${res.score}%` }}
                        />
                      </div>
                      <span className="font-bold">{res.score.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{new Date(res.completed_at).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:underline text-sm font-semibold">View Details</button>
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-400">No one has taken this exam yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
