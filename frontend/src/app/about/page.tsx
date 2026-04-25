"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Shield, Users, Target, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-500">
            About ExamPro
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            We are dedicated to providing the most secure, efficient, and user-friendly 
            online examination platform for students and educators worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <InfoCard 
            icon={<Shield className="text-indigo-600" />}
            title="Our Mission"
            description="To democratize high-quality assessments through technology, ensuring fairness and integrity in every exam."
          />
          <InfoCard 
            icon={<Target className="text-rose-500" />}
            title="Our Vision"
            description="To become the global standard for digital certifications and academic evaluations."
          />
        </div>

        <section className="glass-card p-10 text-center">
          <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
          <p className="text-slate-500 mb-8">
            Built with modern technology, ExamPro handles everything from simple quizzes to complex coding assessments 
            with real-time analytics and anti-cheat measures.
          </p>
          <div className="flex justify-center space-x-8">
            <Stat label="Active Users" value="10k+" />
            <Stat label="Exams Taken" value="50k+" />
            <Stat label="Integrity Rate" value="99.9%" />
          </div>
        </section>
      </main>
    </div>
  );
}

function InfoCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-card p-8">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-indigo-600">{value}</p>
      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{label}</p>
    </div>
  );
}
