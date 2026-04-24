"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { Plus, Trash2, Save, ArrowLeft, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateExamPage() {
  const router = useRouter();
  const [examData, setExamData] = useState({
    title: "",
    description: "",
    duration: 30,
    attempt_limit: 1,
  });

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
    if (!examData.title) return alert("Title is required");
    if (questions.length === 0) return alert("Add at least one question");

    setLoading(true);
    try {
      const quizRes = await api.post("/quizzes", examData);
      const quizId = quizRes.data.id;

      // Add questions sequentially
      for (const q of questions) {
        await api.post(`/quizzes/${quizId}/questions`, q);
      }

      alert("Exam created successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <button 
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </button>

        <form onSubmit={handleSubmit} className="space-y-10">
          <section className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6">Exam Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Exam Title</label>
                <input 
                  value={examData.title}
                  onChange={e => setExamData({...examData, title: e.target.value})}
                  className="input-field"
                  placeholder="e.g., Advanced JavaScript Assessment"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea 
                  value={examData.description}
                  onChange={e => setExamData({...examData, description: e.target.value})}
                  className="input-field min-h-[100px]"
                  placeholder="What is this quiz about?"
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

          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Questions ({questions.length})</h2>
              <button 
                type="button"
                onClick={addQuestion}
                className="btn-secondary !py-2 flex items-center space-x-2"
              >
                <PlusCircle size={18} />
                <span>Add Question</span>
              </button>
            </div>

            <div className="space-y-6">
              <AnimatePresence>
                {questions.map((q, qIndex) => (
                  <motion.div 
                    key={qIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-card p-6 relative overflow-visible"
                  >
                    <button 
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="absolute -top-3 -right-3 p-2 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Type</label>
                        <select 
                          value={q.type}
                          onChange={e => updateQuestion(qIndex, "type", e.target.value)}
                          className="input-field"
                        >
                          <option value="MCQ">Multiple Choice</option>
                          <option value="SHORT_ANSWER">Short Answer</option>
                          <option value="CODING">Coding</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">Question Content</label>
                      <input 
                        value={q.content}
                        onChange={e => updateQuestion(qIndex, "content", e.target.value)}
                        className="input-field font-semibold"
                        placeholder="Type your question..."
                      />
                    </div>

                    {q.type === "MCQ" && (
                      <div className="space-y-3">
                        <label className="block text-sm font-medium">Options & Correct Answer</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {q.options.map((opt: string, oIndex: number) => (
                            <div key={oIndex} className="flex items-center space-x-2">
                              <input 
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={q.correct_answer === opt && opt !== ""}
                                onChange={() => updateQuestion(qIndex, "correct_answer", opt)}
                                className="w-5 h-5 accent-indigo-600"
                              />
                              <input 
                                value={opt}
                                onChange={e => updateOption(qIndex, oIndex, e.target.value)}
                                className="input-field !py-1.5"
                                placeholder={`Option ${oIndex + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {q.type === "SHORT_ANSWER" && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Correct Answer</label>
                        <input 
                          value={q.correct_answer}
                          onChange={e => updateQuestion(qIndex, "correct_answer", e.target.value)}
                          className="input-field"
                          placeholder="Expected exact text answer"
                        />
                      </div>
                    )}

                    {q.type === "CODING" && (
                      <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-lg text-sm text-slate-500 italic">
                        Coding questions use the default sum evaluation for this demo.
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {questions.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400">
                  <p>No questions added yet. Click "Add Question" to begin.</p>
                </div>
              )}
            </div>
          </section>

          <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
            <button 
              type="submit" 
              disabled={loading || questions.length === 0}
              className="btn-primary w-full py-4 text-lg flex items-center justify-center space-x-2"
            >
              <Save size={24} />
              <span>{loading ? "Creating Exam..." : "Save and Publish Exam"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
