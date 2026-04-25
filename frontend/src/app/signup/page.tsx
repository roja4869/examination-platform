"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, User as UserIcon, Loader2, ShieldCheck, GraduationCap } from "lucide-react";
import Navbar from "@/components/Navbar";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["STUDENT", "ADMIN"]),
});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const { user, loading: authLoading, signup } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "STUDENT" }
  });

  const currentRole = watch("role");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      await signup(data.name, data.email, data.password, data.role);
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <div className="glass-card p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Join ExamPro</h1>
              <p className="text-slate-500">Create your account to start assessing</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setValue("role", "STUDENT")}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-xl border-2 transition-all ${
                    currentRole === "STUDENT" 
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600" 
                      : "border-slate-100 bg-slate-50 text-slate-500 hover:border-indigo-200"
                  }`}
                >
                  <GraduationCap size={20} />
                  <span className="font-semibold">Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setValue("role", "ADMIN")}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-xl border-2 transition-all ${
                    currentRole === "ADMIN" 
                      ? "border-rose-500 bg-rose-50 text-rose-500" 
                      : "border-slate-100 bg-slate-50 text-slate-500 hover:border-rose-200"
                  }`}
                >
                  <ShieldCheck size={20} />
                  <span className="font-semibold">Admin</span>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    {...register("name")}
                    className="input-field pl-10"
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    {...register("email")}
                    className="input-field pl-10"
                    placeholder="name@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    {...register("password")}
                    type="password"
                    className="input-field pl-10"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>}
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center space-x-2 py-3 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <span>Create Account</span>}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-slate-500 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
