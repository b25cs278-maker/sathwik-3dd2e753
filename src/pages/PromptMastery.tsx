import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  BookOpen,
  Zap,
  Target,
  Trophy,
  ChevronRight,
  MessageSquare,
  Layers,
  GitBranch,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Lessons Available", value: "48+", icon: BookOpen },
  { label: "Practice Prompts", value: "200+", icon: Zap },
  { label: "Skill Challenges", value: "32", icon: Target },
  { label: "Achievements", value: "16", icon: Trophy },
];

const levels = [
  {
    level: 1,
    title: "Beginner",
    subtitle: "Basic Prompts",
    description:
      "Learn the fundamentals of communicating with AI. Understand how to write clear, effective prompts that get useful responses.",
    points: [
      "Writing clear instructions",
      "Asking the right questions",
      "Understanding AI capabilities",
      "Basic formatting & output control",
    ],
    color: "emerald",
    icon: MessageSquare,
    locked: false,
  },
  {
    level: 2,
    title: "Intermediate",
    subtitle: "Structured Prompts",
    description:
      "Discover how structure transforms your prompts. Learn templates, persona techniques, and context framing for consistent results.",
    points: [
      "Prompt templates & patterns",
      "Role & persona assignment",
      "Context window management",
      "Few-shot prompting techniques",
    ],
    color: "blue",
    icon: Layers,
    locked: false,
  },
  {
    level: 3,
    title: "Advanced",
    subtitle: "Multi-step Prompts",
    description:
      "Chain complex reasoning across multiple steps. Build sophisticated workflows that handle nuanced, multi-part tasks with precision.",
    points: [
      "Chain-of-thought reasoning",
      "Multi-step task decomposition",
      "Iterative refinement loops",
      "Conditional logic in prompts",
    ],
    color: "purple",
    icon: GitBranch,
    locked: true,
  },
];

export default function PromptMastery() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 pb-32 pt-20 text-white md:pb-48 md:pt-28">
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </div>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <div className="rounded-full bg-white/10 p-2 backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-indigo-200" />
            </div>
            <span className="text-sm font-semibold tracking-wider uppercase text-indigo-100">
              Prompt Engineering Mastery
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl"
          >
            Master the Art of <br />
            <span className="text-indigo-200">Prompt Engineering</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-12 max-w-2xl text-lg text-indigo-100/90 md:text-xl"
          >
            Progress through skill levels — from basic prompts to system-level
            thinking. Build real expertise with hands-on practice and guided
            challenges.
          </motion.p>

          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 gap-4 md:grid-cols-4"
            >
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10"
                >
                  <div className="mb-3 flex justify-center">
                    <stat.icon className="h-6 w-6 text-indigo-300" />
                  </div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-xs font-medium uppercase tracking-wider text-indigo-200/70">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      </section>

      {/* Levels */}
      <section className="container mx-auto -mt-16 px-4 pb-20 md:-mt-24 lg:-mt-28">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {levels.map((lvl) => (
            <motion.div
              key={lvl.level}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: lvl.level * 0.1 }}
              className={`group flex flex-col rounded-3xl bg-white shadow-xl shadow-slate-200/50 transition-all hover:shadow-2xl hover:shadow-slate-300/60 ${
                lvl.locked ? "opacity-90" : ""
              }`}
            >
              <div className={`h-2 rounded-t-3xl bg-${lvl.color}-500 w-full`} />

              <div className="relative flex-1 p-8 pt-10">
                <div className="absolute right-6 top-6 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  LEVEL {lvl.level}
                </div>

                <div
                  className={`mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-${lvl.color}-50 text-${lvl.color}-500`}
                >
                  <lvl.icon className="h-8 w-8" />
                </div>

                <h3 className="mb-1 text-2xl font-bold text-slate-900">
                  {lvl.title}
                </h3>
                <p
                  className={`mb-6 text-sm font-semibold tracking-wide text-${lvl.color}-500`}
                >
                  {lvl.subtitle}
                </p>
                <p className="mb-8 text-[15px] leading-relaxed text-slate-500">
                  {lvl.description}
                </p>

                <ul className="mb-10 space-y-4">
                  {lvl.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div
                        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-${lvl.color}-400`}
                      />
                      <span className="text-sm font-medium text-slate-600">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto border-t border-slate-100 pt-8">
                  {lvl.locked ? (
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                      <Lock className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Complete previous level to unlock
                      </span>
                    </div>
                  ) : (
                    <button
                      className={`group/btn flex w-full items-center justify-between rounded-xl bg-${lvl.color}-500 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-${lvl.color}-600 active:scale-95 shadow-lg shadow-${lvl.color}-500/30`}
                    >
                      <span>Start Learning</span>
                      <ChevronRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6 flex justify-center gap-2 items-center">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Prompt Mastery
            </span>
          </div>
          <p className="text-sm text-slate-500">
            © 2026 Prompt Engineering Mastery. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Tailwind color safelist for dynamic classes */}
      <div className="hidden bg-emerald-50 bg-emerald-100 bg-emerald-400 bg-emerald-500 bg-emerald-600 text-emerald-500 shadow-emerald-500/30 hover:bg-emerald-600" />
      <div className="hidden bg-blue-50 bg-blue-100 bg-blue-400 bg-blue-500 bg-blue-600 text-blue-500 shadow-blue-500/30 hover:bg-blue-600" />
      <div className="hidden bg-purple-50 bg-purple-100 bg-purple-400 bg-purple-500 bg-purple-600 text-purple-500 shadow-purple-500/30 hover:bg-purple-600" />
    </div>
  );
}
