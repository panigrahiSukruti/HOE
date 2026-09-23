"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Bot, Award, PlayCircle, CheckCircle2, Send, Sparkles, Loader2, ArrowLeft } from "lucide-react";
import { AITutorDrawer } from "@/components/AITutorDrawer";

interface Lesson {
  id: string;
  title: string;
  content: string;
  durationMinutes: number;
  orderIndex: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  instructor: { name: string };
  lessons: Lesson[];
  quizzes: Quiz[];
}

export default function SingleCoursePage() {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [submissionCode, setSubmissionCode] = useState("");
  const [gradingResult, setGradingResult] = useState<{ score: number; feedback: string; suggestions: string[] } | null>(null);
  const [gradingLoading, setGradingLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/courses`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.courses.find((c: Course) => c.id === courseId);
        if (found) setCourse(found);
      });
  }, [courseId]);

  if (!course) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const activeLesson = course.lessons[activeLessonIndex] || course.lessons[0];

  const handleGradeSubmission = async () => {
    if (!submissionCode.trim() || gradingLoading) return;
    setGradingLoading(true);
    setGradingResult(null);

    try {
      const res = await fetch("/api/ai/grade-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonTitle: activeLesson.title,
          codeContent: submissionCode,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setGradingResult(data);
      } else {
        alert(data.error || "Grading failed");
      }
    } catch {
      alert("Error grading submission");
    } finally {
      setGradingLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/courses" className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-indigo-400 mb-6 transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Catalog</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card rounded-2xl p-6 border border-slate-800 mb-8">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="rounded-md bg-indigo-950 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-800">
              {course.category}
            </span>
            <span className="text-xs text-slate-400">{course.difficulty}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">{course.title}</h1>
          <p className="text-xs text-slate-400 mt-1">Instructor: {course.instructor.name}</p>
        </div>

        <button
          onClick={() => setIsAITutorOpen(true)}
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all shrink-0"
        >
          <Bot className="h-4 w-4" />
          <span>Ask AI Tutor</span>
          <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Lesson & Quiz Navigation */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">Course Modules</h3>
            <div className="space-y-1">
              {course.lessons.map((lesson, idx) => (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    activeLessonIndex === idx
                      ? "bg-indigo-600/20 border border-indigo-500 text-white"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <PlayCircle className="h-4 w-4 shrink-0 text-indigo-400" />
                    <span className="truncate">{lesson.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">{lesson.durationMinutes}m</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quizzes List */}
          {course.quizzes.length > 0 && (
            <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 px-2 flex items-center gap-1.5">
                <Award className="h-4 w-4" /> Skill Assessments
              </h3>
              <div className="space-y-2">
                {course.quizzes.map((quiz) => (
                  <Link
                    key={quiz.id}
                    href={`/quizzes/${quiz.id}`}
                    className="block p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/50 hover:bg-cyan-900/40 text-xs font-semibold text-cyan-300 transition-all"
                  >
                    <div className="font-bold text-white mb-1">{quiz.title}</div>
                    <div className="text-[10px] text-cyan-400/80">⏱️ {quiz.timeLimitMinutes} min time limit</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area: Lesson Text & AI Code Grader */}
        <div className="lg:col-span-3 space-y-8">
          {/* Lesson Content Box */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3">{activeLesson.title}</h2>
            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {activeLesson.content}
            </div>
          </div>

          {/* AI Code / Practice Submission Evaluator Studio */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" /> Interactive Practice & AI Submission Auto-Grader
              </h3>
              <span className="text-[11px] text-slate-400">Automated Rubric Feedback</span>
            </div>

            <p className="text-xs text-slate-400">
              Submit your code implementation or concept explanation for instant AI evaluation and suggestions.
            </p>

            <textarea
              rows={5}
              value={submissionCode}
              onChange={(e) => setSubmissionCode(e.target.value)}
              placeholder="Paste your TypeScript / React component code or summary response here..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs font-mono text-indigo-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
            />

            <div className="flex justify-end">
              <button
                onClick={handleGradeSubmission}
                disabled={gradingLoading || !submissionCode.trim()}
                className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 disabled:opacity-50 transition-all"
              >
                {gradingLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Evaluate with AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Grading Output Display */}
            {gradingResult && (
              <div className="mt-4 rounded-xl border border-indigo-500/30 bg-indigo-950/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300">AI Evaluation Score</span>
                  <span className="text-sm font-extrabold text-emerald-400 px-3 py-1 bg-emerald-950 border border-emerald-800 rounded-lg">
                    {gradingResult.score} / 100
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{gradingResult.feedback}</p>
                {gradingResult.suggestions.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] font-semibold text-slate-400">Recommendations for Improvement:</span>
                    <ul className="mt-1 space-y-1 text-xs text-indigo-300 list-disc list-inside">
                      {gradingResult.suggestions.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Tutor Drawer */}
      <AITutorDrawer
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        lessonTitle={activeLesson.title}
        courseContext={course.title}
      />
    </div>
  );
}
