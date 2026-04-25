"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Shield, Zap, Code, Award } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Removed forced redirect to allow users to visit home page while logged in
  useEffect(() => {
    // We only log the state for debugging, no forced router.replace here
    console.log("Home page loaded", { loading, hasUser: !!user });
  }, [user, loading]);

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                Master Your Skills with <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500">
                  Precision Assessment
                </span>
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400 mb-10">
                The most advanced online examination platform for modern teams. 
                Experience seamless quiz management, real-time analytics, and secure coding environments.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  href={user ? "/dashboard" : "/signup"} 
                  className="btn-primary flex items-center space-x-2 text-lg px-8 py-3"
                >
                  <span>{user ? "Go to Dashboard" : "Get Started Free"}</span>
                  <ArrowRight size={20} />
                </Link>
                {!user && (
                  <Link href="/about" className="btn-secondary text-lg px-8 py-3">
                    Learn More
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Abstract Shapes */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-30">
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-indigo-400 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-rose-400 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield className="text-indigo-600" size={32} />}
              title="Secure Auth"
              description="Role-based access control with secure JWT authentication for students and administrators."
            />
            <FeatureCard 
              icon={<Code className="text-purple-600" size={32} />}
              title="Coding Sandbox"
              description="Real-time code execution with support for multiple languages and automated test cases."
            />
            <FeatureCard 
              icon={<Zap className="text-rose-500" size={32} />}
              title="Instant Results"
              description="Automated grading and immediate feedback with detailed analytics and ranking."
            />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-12">Everything you need for perfect assessments</h2>
          <div className="flex flex-wrap justify-center gap-10">
            {["Timer Controls", "Attempt Limits", "Detailed Reporting", "Leaderboards", "Short Answers", "MCQs"].map((item, i) => (
              <div key={i} className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="text-indigo-500" size={20} />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 ExamPro. Built for excellence.</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="glass-card p-8 text-center md:text-left"
    >
      <div className="mb-4 flex justify-center md:justify-start">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
