"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { Plus, Trash2, Save, ArrowLeft, PlusCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditExamPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [examData, setExamData] = useState({
    title: "",
    description: "",
    duration: 30,
    attempt_limit: 1,
  });

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) {
      router.push("/dashboard");
      return;
    }

    const fetchExam = async () => {
      try {
        const res = await api.get(`/quizzes/${id}`);
        const { title, description, duration, attempt_limit, questions } = res.data;
        setExamData({ title, description, duration, attempt_limit });
        setQuestions(questions || []);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch exam data");
        router.push("/admin/exams");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "ADMIN") {
      fetchExam();
    }
  }, [id, user, authLoading, router]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: "MCQ",
        content: "",
        options: ["", "", "", ""],
        correct_answer: "",
      },
    ]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Update basic info
      await api.put(`/quizzes/${id}`, examData);
      
      // For simplicity in this demo, we'll tell the user to use the results view
      // or implement a full question sync here. 
      // Most production apps would have a more complex sync logic.
      
      alert("Exam updated successfully!");
      router.push("/admin/exams");
    } catch (err) {
      console.error(err);
      alert("Failed to update exam");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <button 
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <form onSubmit={handleSubmit} className="space-y-10">
          <section className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6">Edit Exam: {examData.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Exam Title</label>
                <input 
                  value={examData.title}
                  onChange={e => setExamData({...examData, title: e.target.value})}
                  className="input-field"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea 
                  value={examData.description}
                  onChange={e => setExamData({...examData, description: e.target.value})}
                  className="input-field min-h-[100px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                <input 
                  type="number"
                  value={examData.duration}
                  onChange={e => setExamData({...examData, duration: parseInt(e.target.value)})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Attempt Limit</label>
                <input 
                  type="number"
                  value={examData.attempt_limit}
                  onChange={e => setExamData({...examData, attempt_limit: parseInt(e.target.value)})}
                  className="input-field"
                />
              </div>
            </div>
          </section>

          <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
            <button 
              type="submit" 
              disabled={saving}
              className="btn-primary w-full py-4 text-lg flex items-center justify-center space-x-2"
            >
              <Save size={24} />
              <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
