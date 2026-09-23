"use client";

import { useState } from "react";
import { Bot, Send, Sparkles, X, User, Loader2 } from "lucide-react";

interface Message {
  sender: "user" | "ai";
  text: string;
}

interface AITutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle?: string;
  courseContext?: string;
}

export function AITutorDrawer({ isOpen, onClose, lessonTitle, courseContext }: AITutorDrawerProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: `Hello! I'm your **EduPulse AI Tutor**. Ask me anything about **${
        lessonTitle || "your lesson"
      }** or request code explanations, conceptual breakdowns, or key takeaways!`,
    },
  ]);

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const newMessages: Message[] = [...messages, { sender: "user", text: textToSend }];
    setMessages(newMessages);
    if (!customText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          lessonTitle,
          courseContext,
        }),
      });

      const data = await res.json();
      setMessages([...newMessages, { sender: "ai", text: data.reply || "Sorry, I couldn't process that right now." }]);
    } catch {
      setMessages([...newMessages, { sender: "ai", text: "Error connecting to AI service." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-slate-900 border-l border-slate-800 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 p-4 bg-slate-950/60">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              EduPulse AI Tutor <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            </h3>
            <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
              {lessonTitle ? `Topic: ${lessonTitle}` : "Interactive Learning Assistant"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Suggested Prompts */}
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-950/40 border-b border-slate-800/60 overflow-x-auto text-[11px]">
        <button
          onClick={() => handleSend("Explain the core concept in simple terms.")}
          className="shrink-0 rounded-full border border-indigo-800/60 bg-indigo-950/40 px-2.5 py-1 text-indigo-300 hover:bg-indigo-900/60 transition-all"
        >
          💡 Explain core concept
        </button>
        <button
          onClick={() => handleSend("Give a real-world code example.")}
          className="shrink-0 rounded-full border border-indigo-800/60 bg-indigo-950/40 px-2.5 py-1 text-indigo-300 hover:bg-indigo-900/60 transition-all"
        >
          💻 Code example
        </button>
        <button
          onClick={() => handleSend("Quiz me on this lesson!")}
          className="shrink-0 rounded-full border border-indigo-800/60 bg-indigo-950/40 px-2.5 py-1 text-indigo-300 hover:bg-indigo-900/60 transition-all"
        >
          ❓ Quiz me
        </button>
      </div>

      {/* Message Chat List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2.5 ${m.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
          >
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                m.sender === "user" ? "bg-indigo-600 text-white" : "bg-slate-800 text-indigo-400 border border-slate-700"
              }`}
            >
              {m.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
            </div>
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-950 border border-slate-800 text-slate-200"
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-xs text-indigo-400 bg-slate-950/80 p-3 rounded-xl border border-slate-800 w-fit">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>AI Tutor thinking...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-slate-800 p-4 bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Tutor a question..."
            className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
