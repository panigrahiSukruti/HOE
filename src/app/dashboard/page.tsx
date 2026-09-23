import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Award, Brain, CheckCircle2, ArrowRight, Sparkles, Clock, Target } from "lucide-react";

export default async function DashboardPage() {
  const session = await getAuthSession();
  if (!session) {
    redirect("/login?redirect=/dashboard");
  }

  // Fetch courses, user attempts, and submissions
  const courses = await db.course.findMany({
    include: {
      instructor: { select: { name: true } },
      lessons: { select: { id: true } },
      quizzes: { select: { id: true, title: true } },
    },
  });

  const attempts = await db.quizAttempt.findMany({
    where: { userId: session.userId },
    include: { quiz: { select: { title: true } } },
    orderBy: { completedAt: "desc" },
  });

  const submissions = await db.submission.findMany({
    where: { userId: session.userId },
    orderBy: { gradedAt: "desc" },
  });

  const averageScore =
    attempts.length > 0
      ? Math.round(attempts.reduce((acc, curr) => acc + curr.score, 0) / attempts.length)
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3 py-1 text-xs font-semibold text-indigo-300 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Adaptive Student Mastery Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {session.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Track your learning path, review AI grading feedback, and attempt skill mastery quizzes.
            </p>
          </div>
          <Link
            href="/courses"
            className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all shrink-0"
          >
            <span>Browse All Courses</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Available Courses</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-3">{courses.length}</p>
          <span className="text-[11px] text-slate-500 mt-1 inline-block">Interactive modules</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Quizzes Completed</span>
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-3">{attempts.length}</p>
          <span className="text-[11px] text-slate-500 mt-1 inline-block">Skill evaluations</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Average Mastery Score</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-400 mt-3">{averageScore}%</p>
          <span className="text-[11px] text-slate-500 mt-1 inline-block">Across all completed quizzes</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">AI Submissions Graded</span>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Brain className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-purple-400 mt-3">{submissions.length}</p>
          <span className="text-[11px] text-slate-500 mt-1 inline-block">Automated rubric evaluations</span>
        </div>
      </div>

      {/* Main Grid: Enrolled Courses & Recent Attempts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Courses List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-400" /> Active Learning Paths
            </h2>
          </div>

          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="rounded-md bg-indigo-950 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-800">
                      {course.category}
                    </span>
                    <span className="text-xs text-slate-400">{course.difficulty}</span>
                  </div>
                  <h3 className="text-base font-bold text-white hover:text-indigo-400 transition-colors">
                    <Link href={`/courses/${course.id}`}>{course.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{course.description}</p>
                  <div className="flex items-center space-x-4 text-[11px] text-slate-500 pt-1">
                    <span>Instructor: {course.instructor.name}</span>
                    <span>• {course.lessons.length} Lessons</span>
                    <span>• {course.quizzes.length} Quizzes</span>
                  </div>
                </div>

                <Link
                  href={`/courses/${course.id}`}
                  className="rounded-xl border border-indigo-500/30 bg-indigo-600/10 px-4 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all shrink-0"
                >
                  Continue Course
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Quiz Scores & Recent AI Evaluations */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-cyan-400" /> Quiz History & Scores
          </h2>

          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            {attempts.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                No quizzes attempted yet. Select a course to start an assessment!
              </div>
            ) : (
              attempts.map((att) => (
                <div key={att.id} className="flex items-center justify-between border-b border-slate-800/80 pb-3 last:border-0 last:pb-0">
                  <div>
                    <div className="text-xs font-bold text-white">{att.quiz.title}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {new Date(att.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                    att.score >= 80 ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-amber-950 text-amber-300 border border-amber-800"
                  }`}>
                    {att.score}%
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
