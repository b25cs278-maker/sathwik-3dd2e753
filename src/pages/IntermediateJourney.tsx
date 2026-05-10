import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Trophy, Target, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Task {
  id: number;
  name: string;
  passed: boolean;
  attempts: string;
  bestScore: number;
  rating: string;
}

const tasks: Task[] = [
  { id: 1, name: "Networking Purpose Clarity", passed: false, attempts: "0/3", bestScore: 0, rating: "Pending" },
  { id: 2, name: "LinkedIn Content Strategy", passed: false, attempts: "0/3", bestScore: 0, rating: "Pending" },
  { id: 3, name: "Digital Footprint Review", passed: false, attempts: "0/3", bestScore: 0, rating: "Pending" },
  { id: 4, name: "Application Shortlisting Strategy", passed: false, attempts: "0/3", bestScore: 0, rating: "Pending" },
  { id: 5, name: "Skill Learning Order", passed: false, attempts: "0/3", bestScore: 0, rating: "Pending" },
  { id: 6, name: "Paid vs Unpaid Internship Choice", passed: false, attempts: "0/3", bestScore: 0, rating: "Pending" },
  { id: 7, name: "Confidence Building Plan", passed: false, attempts: "0/3", bestScore: 0, rating: "Pending" },
  { id: 8, name: "Resume Focus Decision", passed: false, attempts: "0/3", bestScore: 0, rating: "Pending" },
  { id: 9, name: "Internship Role Selection", passed: false, attempts: "0/3", bestScore: 0, rating: "Pending" },
  { id: 10, name: "Outreach Prioritisation", passed: false, attempts: "0/3", bestScore: 0, rating: "Pending" },
  { id: 11, name: "Side Income Choice", passed: false, attempts: "0/3", bestScore: 0, rating: "Pending" },
  { id: 12, name: "Scoring Improvement Plan", passed: false, attempts: "0/3", bestScore: 0, rating: "Pending" },
  { id: 13, name: "Daily Schedule Design", passed: false, attempts: "0/3", bestScore: 0, rating: "Pending" },
  { id: 14, name: "Freelancing Skill Fit", passed: false, attempts: "0/3", bestScore: 0, rating: "Pending" },
  { id: 15, name: "Skill Depth vs Breadth", passed: false, attempts: "0/3", bestScore: 0, rating: "Pending" },
  { id: 16, name: "Core vs Non-Core Career Choice", passed: false, attempts: "0/3", bestScore: 0, rating: "Pending" },
  { id: 17, name: "Study-Life Balance", passed: false, attempts: "0/3", bestScore: 0, rating: "Pending" },
  { id: 18, name: "Expense Planning for Studies", passed: false, attempts: "0/3", bestScore: 0, rating: "Pending" },
  { id: 19, name: "Monthly Expense Strategy", passed: false, attempts: "0/3", bestScore: 0, rating: "Pending" },
  { id: 20, name: "Internship Skill Alignment", passed: false, attempts: "0/3", bestScore: 0, rating: "Pending" },
];

const BUTTON_COLORS = [
  "bg-[#3b82f6] hover:bg-blue-600",
  "bg-[#fbbf24] hover:bg-amber-500",
  "bg-[#ec4899] hover:bg-pink-600",
  "bg-[#a855f7] hover:bg-purple-600",
  "bg-[#f97316] hover:bg-orange-600",
  "bg-[#14b8a6] hover:bg-teal-600",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function IntermediateJourney() {
  const navigate = useNavigate();
  const totalPassed = tasks.filter((t) => t.passed).length;
  const totalTasks = tasks.length;
  const progressPercent = Math.round((totalPassed / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-[#F9FBFC] pb-20 text-slate-900">
      <header className="bg-white px-4 md:px-8 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <div>
              <h1 className="text-3xl font-black flex items-center gap-2">
                Level 2 — <span className="text-[#3b82f6]">Intermediate</span>
              </h1>
              <p className="text-sm font-medium text-slate-500 mt-1">
                Master structured approaches to prompt design and professional context management.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#f0fdf4] text-[#166534] rounded-xl border border-[#dcfce7]">
              <Trophy className="w-4 h-4 text-[#22c55e]" />
              <span className="text-sm font-bold">Passed: {totalPassed}/{totalTasks}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#eff6ff] text-[#1e40af] rounded-xl border border-[#dbeafe]">
              <Target className="w-4 h-4 text-[#3b82f6]" />
              <span className="text-sm font-bold">Tasks: {totalTasks}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mb-12 relative overflow-hidden">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Your Progress</p>
              <h2 className="text-4xl font-black text-slate-900 leading-none">
                {totalPassed} of {totalTasks} Completed
              </h2>
            </div>
            <span className="text-5xl font-black text-[#052c22]">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#10b981] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-8 bg-[#8b4513]" />
            <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">The Intermediate Grid</p>
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4">Mastering the Nuance</h2>
          <p className="text-base font-medium text-slate-500 max-w-xl">
            You've built the foundation. Now it's time to refine your strategy with intermediate-level scenarios.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {tasks.map((task, index) => {
            const colorClass = BUTTON_COLORS[index % BUTTON_COLORS.length];
            return (
              <motion.div
                key={task.id}
                variants={itemVariants}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col hover:border-blue-100 transition-colors"
              >
                <div className="flex items-center gap-2 mb-4">
                  {task.passed ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
                      <span className="text-[10px] font-black text-[#22c55e] uppercase tracking-wider">Passed</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
                      <span className="text-[10px] font-black text-[#ef4444] uppercase tracking-wider">Pending</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <span className="text-sm font-black text-slate-900">{task.id}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">{task.name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Best Score</p>
                    <p className="text-2xl font-black text-slate-900">{task.bestScore}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Attempts Left</p>
                    <p className="text-2xl font-black text-slate-900">{task.attempts}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Rating</p>
                  <p className={`text-lg font-black ${task.passed ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                    {task.rating}
                  </p>
                </div>

                <button
                  className={`w-full py-4 px-6 rounded-2xl text-white font-black text-base transition-transform active:scale-95 ${colorClass}`}
                >
                  {task.passed ? "Review" : "Solve"}
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      <footer className="w-full bg-[#111111] py-24 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[14px] font-black tracking-[0.3em] text-slate-400 uppercase mb-8">Level 3 Awaits</p>
          <h2 className="text-4xl md:text-6xl text-white font-serif mb-12 flex flex-col items-center">
            <span>Ready to go beyond</span>
            <span>intermediate?</span>
          </h2>
          <div className="flex justify-center">
            <div className="w-16 h-[3px] bg-[#f97316]" />
          </div>
        </div>
      </footer>
    </div>
  );
}
