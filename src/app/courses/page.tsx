import { db } from "@/lib/db";
import Link from "next/link";
import { BookOpen, Sparkles, Clock, ArrowRight, User } from "lucide-react";

export default async function CoursesCatalogPage() {
  const courses = await db.course.findMany({
    include: {
      instructor: { select: { name: true } },
      _count: { select: { lessons: true, quizzes: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 shadow-inner mb-4">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Curated Learning Paths</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Full-Stack & AI Course Catalog</h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">
          Explore interactive courses powered by React 19 Server Components, Prisma persistence, and integrated AI tutoring.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-md bg-indigo-950 px-2.5 py-1 text-[10px] font-semibold text-indigo-300 border border-indigo-800">
                  {course.category}
                </span>
                <span className="text-xs font-medium text-slate-400">{course.difficulty}</span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 hover:text-indigo-400 transition-colors">
                <Link href={`/courses/${course.id}`}>{course.title}</Link>
              </h3>

              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                {course.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center space-x-1">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>{course.instructor.name}</span>
                </span>
                <span>{course._count.lessons} Lessons • {course._count.quizzes} Quizzes</span>
              </div>

              <Link
                href={`/courses/${course.id}`}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-indigo-600/20 border border-indigo-500/40 py-2.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all shadow-md"
              >
                <span>Start Learning</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
