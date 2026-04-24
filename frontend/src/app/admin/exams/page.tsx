"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { Quiz } from "@/types";
import { Plus, BookOpen, Clock, Award, BarChart3, Users, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminExamsPage() {
  const { user, loading: authLoading } = useAuth();
  const [exams, setExams] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.get("/quizzes");
        setExams(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === "ADMIN") {
      fetchExams();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Exam Management</h1>
            <p className="text-slate-500">Create, edit, and monitor your assessments.</p>
          </div>
          <Link href="/admin/exams/create" className="btn-primary flex items-center space-x-2">
            <Plus size={20} />
            <span>Create New Exam</span>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div key={exam.id} className="glass-card p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{exam.title}</h3>
                <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 text-xs font-bold rounded-md">
                  Active
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-6 flex-1 line-clamp-2">{exam.description}</p>
              
              <div className="flex items-center space-x-4 text-xs text-slate-400 mb-6">
                <span className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>{exam.duration}m</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Award size={14} />
                  <span>{exam.attempt_limit} Attempts</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link 
                  href={`/admin/exams/${exam.id}`} 
                  className="btn-secondary !py-2 text-xs flex items-center justify-center space-x-1"
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </Link>
                <Link 
                  href={`/admin/exams/${exam.id}/results`} 
                  className="btn-primary !py-2 text-xs flex items-center justify-center space-x-1"
                >
                  <Eye size={14} />
                  <span>Results</span>
                </Link>
              </div>
            </div>
          ))}

          {exams.length === 0 && (
            <div className="col-span-full py-20 text-center glass-card border-dashed">
              <p className="text-slate-400">No exams created yet. Start by creating your first assessment!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
