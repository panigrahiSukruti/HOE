"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { Sparkles, BookOpen, LayoutDashboard, LogOut, User as UserIcon, ShieldAlert } from "lucide-react";

interface UserSession {
  userId: string;
  name: string;
  email: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-2 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {siteConfig.navItems.map((item) => {
            const isActive = pathname === item.href;
            if (user && !item.roles.includes(user.role)) return null;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-indigo-400 ${
                  isActive ? "text-indigo-400 font-semibold" : "text-slate-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-semibold text-slate-200">{user.name}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition-all"
                title="Logout"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
