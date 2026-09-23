import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Github, Linkedin, Mail, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-8 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            <span className="text-sm font-semibold text-slate-200">{siteConfig.name}</span>
            <span className="text-xs text-slate-500">© 2026 House of Edtech Developer Assignment</span>
          </div>

          {/* Submission Guidelines Compliance: Candidate Info */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <span className="text-slate-400 font-medium">Developed by: <strong className="text-indigo-300">{siteConfig.candidate.name}</strong></span>
            <a
              href={siteConfig.candidate.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-slate-300 hover:text-indigo-400 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub Profile</span>
            </a>
            <a
              href={siteConfig.candidate.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-slate-300 hover:text-indigo-400 transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              <span>LinkedIn Profile</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
