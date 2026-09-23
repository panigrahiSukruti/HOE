"use client";

import { useState, useEffect } from "react";
import { Plus, Sparkles, BookOpen, Bot, Loader2, CheckCircle2 } from "lucide-react";

interface Course {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  description: string;
  _count: { lessons: number; quizzes: number };
}

export default function InstructorStudioPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [loading, setLoading] = useState(false);

  // AI Quiz Generator Modal State
  const [topic, setTopic] = useState("");
  const [genCount, setGenCount] = useState(3);
  const [generating, setGenerating] = useState(false);
  const [aiQuestions, setAiQuestions] = useState<any[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data.courses || []));
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, difficulty }),
      });

      if (res.ok) {
        setTitle("");
        setDescription("");
        fetchCourses();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create course");
      }
    } catch {
      alert("Error creating course");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAIQuiz = async () => {
    if (!topic.trim() || generating) return;
    setGenerating(true);
    setAiQuestions([]);

    try {
      const res = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, questionCount: genCount }),
      });

      const data = await res.json();
      if (res.ok) {
        setAiQuestions(data.questions);
      } else {
        alert(data.error || "Failed to generate AI Quiz");
      }
    } catch {
      alert("Error generating AI quiz");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-semibold text-cyan-300 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Instructor Studio & AI Curriculum Generator</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Course & Quiz Authoring Workspace</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create Course Form */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="h-5 w-5 text-indigo-400" /> Publish New Course Module
            </h2>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Next.js 16 Security & Middleware"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Web Development / AI"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive course breakdown..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Publish Course</span>}
              </button>
            </form>
          </div>

          {/* AI Quiz Generator Box */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Bot className="h-5 w-5 text-cyan-400" /> AI Quiz Generator Studio
            </h2>
            <p className="text-xs text-slate-400">
              Input any technical topic to auto-generate multiple-choice quiz questions with AI explanations.
            </p>

            <div className="space-y-3 text-xs">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Topic (e.g. Next.js App Router, JWT Security)"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-white focus:border-cyan-500 focus:outline-none"
              />

              <button
                onClick={handleGenerateAIQuiz}
                disabled={generating || !topic.trim()}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-cyan-600 py-2.5 font-semibold text-white hover:bg-cyan-500 disabled:opacity-50 transition-all shadow-lg shadow-cyan-600/20"
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate AI Quiz Questions</span>
                  </>
                )}
              </button>
            </div>

            {aiQuestions.length > 0 && (
              <div className="mt-4 space-y-3 border-t border-slate-800 pt-4">
                <span className="text-xs font-bold text-cyan-300">Generated AI Questions ({aiQuestions.length}):</span>
                {aiQuestions.map((q, idx) => (
                  <div key={idx} className="rounded-xl border border-cyan-800/40 bg-cyan-950/20 p-3 text-xs space-y-1">
                    <div className="font-bold text-white">{idx + 1}. {q.questionText}</div>
                    <div className="text-[11px] text-slate-400">Correct Index: {q.correctAnswer}</div>
                    <div className="text-[10px] text-cyan-300/80 italic">{q.explanation}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Published Courses List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-400" /> Managed Course Catalog ({courses.length})
          </h2>

          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-indigo-950 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-800">
                    {course.category}
                  </span>
                  <span className="text-xs text-slate-400">{course._count.lessons} Lessons • {course._count.quizzes} Quizzes</span>
                </div>
                <h3 className="text-base font-bold text-white">{course.title}</h3>
                <p className="text-xs text-slate-400">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
