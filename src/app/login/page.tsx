"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push(data.user.role === "INSTRUCTOR" ? "/instructor" : redirect);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fillPreset = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-slate-800 shadow-2xl">
        <div className="text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to your EduPulse AI account</p>
        </div>

        {/* Demo Preset Buttons */}
        <div className="mb-6 rounded-xl bg-slate-900/90 p-3 border border-slate-800 space-y-2 text-xs">
          <p className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider">Demo Credentials:</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillPreset("student@edupulse.ai", "student123")}
              className="flex-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/60 p-2 text-indigo-300 text-left transition-all"
            >
              🎓 Student Demo
            </button>
            <button
              type="button"
              onClick={() => fillPreset("instructor@edupulse.ai", "instructor123")}
              className="flex-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 p-2 text-cyan-300 text-left transition-all"
            >
              👨‍🏫 Instructor Demo
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Sign In</span>}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-indigo-400 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
