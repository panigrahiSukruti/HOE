"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Award, Clock, CheckCircle2, ArrowRight, ArrowLeft, Loader2, Sparkles } from "lucide-react";

interface Question {
  id: string;
  questionText: string;
  optionsJson: string;
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  questions: Question[];
}

export default function QuizPlayerPage() {
  const params = useParams();
  const quizId = params.id as string;
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(600); // Default 10 mins
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; correctCount: number; totalQuestions: number } | null>(null);

  useEffect(() => {
    // Fetch courses to find quiz
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        let foundQuiz: Quiz | null = null;
        for (const c of data.courses) {
          const q = c.quizzes?.find((qz: Quiz) => qz.id === quizId);
          if (q) {
            foundQuiz = q;
            break;
          }
        }
        if (foundQuiz) {
          setQuiz(foundQuiz);
          setTimeLeft(foundQuiz.timeLimitMinutes * 60);
        }
      });
  }, [quizId]);

  // Countdown Timer
  useEffect(() => {
    if (!quiz || result) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quiz, result]);

  if (!quiz) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIdx];
  const options: string[] = currentQuestion ? JSON.parse(currentQuestion.optionsJson) : [];

  const handleSelectOption = (optIndex: number) => {
    if (result) return;
    setUserAnswers({ ...userAnswers, [currentQuestion.id]: optIndex });
  };

  const handleSubmit = async () => {
    if (submitting || result) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/quizzes/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId,
          answers: userAnswers,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        alert(data.error || "Quiz submission error");
      }
    } catch {
      alert("Error submitting quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      {/* Quiz Top Banner */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">Skill Evaluation</span>
          <h1 className="text-xl font-bold text-white">{quiz.title}</h1>
        </div>

        {!result && (
          <div className="flex items-center space-x-2 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-mono font-bold text-amber-400">
            <Clock className="h-4 w-4" />
            <span>
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </div>
        )}
      </div>

      {/* Result Display State */}
      {result ? (
        <div className="glass-card rounded-3xl p-8 border border-slate-800 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800">
            <Award className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Assessment Complete!</h2>
            <p className="text-xs text-slate-400 mt-1">Your attempt has been recorded in the database.</p>
          </div>

          <div className="mx-auto max-w-sm rounded-2xl bg-slate-900/90 border border-slate-800 p-6">
            <div className="text-4xl font-extrabold text-emerald-400 mb-2">{result.score}%</div>
            <div className="text-xs text-slate-300">
              Answered <strong>{result.correctCount}</strong> out of <strong>{result.totalQuestions}</strong> questions correctly.
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-xl bg-indigo-600 px-6 py-3 text-xs font-semibold text-white hover:bg-indigo-500 transition-all"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        /* Question & Option Card */
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-4 border-b border-slate-800">
            <span>
              Question <strong>{currentIdx + 1}</strong> of <strong>{quiz.questions.length}</strong>
            </span>
            <span>Progress: {Math.round(((currentIdx + 1) / quiz.questions.length) * 100)}%</span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
            {currentQuestion.questionText}
          </h2>

          <div className="space-y-3">
            {options.map((opt, idx) => {
              const isSelected = userAnswers[currentQuestion.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                    isSelected
                      ? "bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/10"
                      : "bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-[11px] font-bold ${
                      isSelected ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation & Submit Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 disabled:opacity-30 hover:bg-slate-800 transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            {currentIdx < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx((prev) => Math.min(quiz.questions.length - 1, prev + 1))}
                className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-all"
              >
                <span>Next Question</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center space-x-2 rounded-xl bg-emerald-600 px-6 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 disabled:opacity-50 transition-all"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Submit Assessment</span>}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
