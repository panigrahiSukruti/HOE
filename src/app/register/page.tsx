"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, User, Mail, Lock, ShieldCheck, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "INSTRUCTOR">("STUDENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push(role === "INSTRUCTOR" ? "/instructor" : "/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-slate-800 shadow-2xl">
        <div className="text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Create an Account</h2>
          <p className="text-xs text-slate-400 mt-1">Join EduPulse AI Platform today</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

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
                placeholder="Minimum 6 characters"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Account Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("STUDENT")}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                  role === "STUDENT"
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <span>🎓 Student</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("INSTRUCTOR")}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                  role === "INSTRUCTOR"
                    ? "bg-cyan-600/20 border-cyan-500 text-cyan-300"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <span>👨‍🏫 Instructor</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Create Account</span>}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
