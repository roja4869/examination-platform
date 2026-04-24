"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Quiz, Question } from "@/types";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Send, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";
import Editor from "@monaco-editor/react";
import Link from "next/link";

export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startQuiz = async () => {
      try {
        const quizRes = await api.get(`/quizzes/${id}`);
        setQuiz(quizRes.data);
        setTimeLeft(quizRes.data.duration * 60);

        const attemptRes = await api.post("/attempts/start", { quiz_id: id });
        setAttemptId(attemptRes.data.id);
      } catch (err: any) {
        alert(err.response?.data?.message || "Error starting quiz");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    startQuiz();
  }, [id, router]);

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, submitted]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const submitQuiz = async () => {
    if (submitting || submitted) return;
    setSubmitting(true);
    
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, user_answer]) => ({
        question_id: questionId,
        user_answer
      }));

      const res = await api.post("/attempts/submit", {
        attempt_id: attemptId,
        answers: formattedAnswers
      });

      setScore(res.data.score);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Error submitting quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Quiz...</div>;
  if (!quiz) return <div>Quiz not found</div>;

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-10 max-w-lg w-full text-center">
            <div className="mb-6 flex justify-center">
              <CheckCircle2 className="text-emerald-500" size={80} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
            <p className="text-slate-500 mb-8">Thank you for taking the assessment. Here are your results:</p>
            <div className="text-6xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-500">
              {score?.toFixed(1)}%
            </div>
            <Link href="/dashboard" className="btn-primary w-full inline-block">Back to Dashboard</Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions![currentQuestionIndex];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      {/* Quiz Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{quiz.title}</h1>
            <p className="text-sm text-slate-500">Question {currentQuestionIndex + 1} of {quiz.questions!.length}</p>
          </div>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full font-mono text-lg font-bold border-2 ${timeLeft < 60 ? "border-rose-500 text-rose-500 animate-pulse" : "border-indigo-100 text-indigo-600"}`}>
            <Clock size={20} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Main Quiz Content */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 flex flex-col">
        <div className="flex-1 glass-card p-6 md:p-10 mb-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 leading-tight">
                {currentQuestion.content}
              </h2>

              <div className="space-y-4">
                {currentQuestion.type === "MCQ" && (
                  <div className="grid grid-cols-1 gap-4">
                    {currentQuestion.options?.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswerChange(currentQuestion.id, option)}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${
                          answers[currentQuestion.id] === option
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400"
                            : "border-slate-100 dark:border-slate-800 hover:border-indigo-200"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className={`w-8 h-8 flex items-center justify-center rounded-full border ${
                            answers[currentQuestion.id] === option ? "bg-indigo-600 text-white border-indigo-600" : "border-slate-300"
                          }`}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="font-medium">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion.type === "SHORT_ANSWER" && (
                  <textarea
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="input-field min-h-[150px] text-lg"
                    placeholder="Type your answer here..."
                  />
                )}

                {currentQuestion.type === "CODING" && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 h-[350px]">
                    <Editor
                      height="100%"
                      defaultLanguage="javascript"
                      theme="vs-dark"
                      value={answers[currentQuestion.id] || "// Write your code here\\nfunction solution(a, b) {\\n  return a + b;\\n}"}
                      onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                      options={{ minimap: { enabled: false }, fontSize: 14 }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Footer */}
        <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <button
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            className="btn-secondary disabled:opacity-30 flex items-center space-x-1"
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>

          <div className="hidden md:flex space-x-2">
            {quiz.questions!.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuestionIndex(i)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                  currentQuestionIndex === i
                    ? "bg-indigo-600 text-white"
                    : answers[quiz.questions![i].id]
                    ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === quiz.questions!.length - 1 ? (
            <button
              onClick={submitQuiz}
              disabled={submitting}
              className="btn-primary !bg-emerald-600 hover:!bg-emerald-700 flex items-center space-x-2"
            >
              <span>Finish Quiz</span>
              <Send size={18} />
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              className="btn-primary flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
