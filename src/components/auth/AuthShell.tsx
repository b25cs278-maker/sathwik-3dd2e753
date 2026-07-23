import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Leaf,
  Users,
  Zap,
} from "lucide-react";
import workspaceImg from "@/assets/auth/workspace.jpg";

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "AI Developer at Tech Corp",
    avatar: "PS",
    text: "NexusCraft transformed my career. The AI track gave me practical skills I use daily. Within 6 months, I landed my dream job as an AI developer!",
    achievement: "🎯 Completed 45 AI modules • 2,340 credits",
  },
  {
    name: "Alex Mercer",
    role: "Climate Tech Researcher",
    avatar: "AM",
    text: "Using machine learning to analyze deforestation patterns on the platform was mind-blowing. The community is incredibly collaborative and driven.",
    achievement: "🌱 12 Environmental Projects Completed",
  },
  {
    name: "Sarah Jenkins",
    role: "Sustainability Director",
    avatar: "SJ",
    text: "The combination of cutting-edge AI courses and environmental conservation challenges makes NexusCraft unique. Highly recommended for modern changemakers.",
    achievement: "🏆 1st Place in Global GreenTech Hackathon",
  },
];

const PLATFORM_FEATURES = [
  { icon: Cpu, title: "AI Development", desc: "Master practical machine learning, neural networks, and prompt engineering." },
  { icon: Leaf, title: "Eco Innovation", desc: "Apply technology directly to solve real-world climate and sustainability challenges." },
  { icon: Users, title: "Global Community", desc: "Collaborate with developers, researchers, and creators from over 120 countries." },
];

export function AuthShell({ children }: { children: ReactNode }) {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; delay: number; duration: number }[]
  >([]);
  const [tIndex, setTIndex] = useState(0);

  useEffect(() => {
    setParticles(
      Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 2,
        delay: Math.random() * 5,
        duration: Math.random() * 15 + 10,
      }))
    );
    const interval = setInterval(() => {
      setTIndex((p) => (p + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col lg:flex-row font-sans antialiased overflow-x-hidden relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20 blur-[1px]"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.x}%`,
              top: `${p.y}%`,
              animation: `float-up ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`,
              boxShadow: "0 0 8px rgba(6, 182, 212, 0.4)",
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(110vh) translateX(0) scale(1); opacity: 0; }
          10% { opacity: 0.35; }
          90% { opacity: 0.35; }
          100% { transform: translateY(-10vh) translateX(40px) scale(0.8); opacity: 0; }
        }
      `}</style>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] relative bg-[#070b14] border-r border-[#06b6d4]/10 flex-col justify-between p-12 overflow-hidden select-none z-10">
        <div className="absolute inset-0 z-0">
          <img src={workspaceImg} alt="NexusCraft Workspace" className="w-full h-full object-cover opacity-15 filter brightness-75 contrast-125 saturate-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-[#070b14]/90 to-[#070b14]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0e1a]" />
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="text-white w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-white tracking-wide">NexusCraft</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-cyan-400/15 text-cyan-400 border border-cyan-400/20">
                AI HUB
              </span>
            </div>
            <p className="text-[11px] text-gray-400">Environmental Innovation Platform</p>
          </div>
        </div>

        <div className="relative z-10 my-auto py-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-semibold rounded-full tracking-wider uppercase mb-6 border border-cyan-400/20">
            <Zap className="w-3.5 h-3.5" /> Sustainable Future Tech
          </span>
          <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight mb-6">
            Master AI skills through <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              real-world projects
            </span>
          </h2>
          <p className="text-gray-400 text-sm xl:text-base leading-relaxed mb-10 max-w-md">
            Join a global community of innovators using artificial intelligence to solve climate change, optimize green energy, and contribute to sustainability.
          </p>
          <div className="space-y-6 max-w-sm">
            {PLATFORM_FEATURES.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div key={index} className="flex gap-4">
                  <div className="p-2.5 bg-[#0f172a] border border-[#06b6d4]/20 rounded-xl shrink-0 flex items-center justify-center shadow-md">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-200">{feat.title}</h4>
                    <p className="text-xs text-gray-400 leading-normal mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 bg-[#0f172a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 max-w-md shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={tIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-2.5 py-0.5 rounded-full border border-cyan-400/20">
                  User Review
                </span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                  ))}
                </div>
              </div>
              <p className="text-gray-300 text-sm italic leading-relaxed">"{TESTIMONIALS[tIndex].text}"</p>
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    {TESTIMONIALS[tIndex].avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-white">{TESTIMONIALS[tIndex].name}</h4>
                    <p className="text-[11px] text-gray-400">{TESTIMONIALS[tIndex].role}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setTIndex((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                    className="p-1.5 bg-[#1e293b] hover:bg-[#334155] rounded-lg transition-colors border border-white/5"
                    aria-label="Previous review"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-gray-300" />
                  </button>
                  <button
                    onClick={() => setTIndex((p) => (p + 1) % TESTIMONIALS.length)}
                    className="p-1.5 bg-[#1e293b] hover:bg-[#334155] rounded-lg transition-colors border border-white/5"
                    aria-label="Next review"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  </button>
                </div>
              </div>
              <div className="text-[11px] text-cyan-400/90 font-medium flex items-center gap-1 bg-[#1e293b]/40 py-1.5 px-3 rounded-lg border border-cyan-400/5">
                {TESTIMONIALS[tIndex].achievement}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-grow flex items-center justify-center p-6 md:p-12 lg:p-16 z-10 relative">
        <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none lg:hidden" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none lg:hidden" />
        <div className="w-full max-w-[420px] mx-auto flex flex-col items-center">
          <div className="mb-6 select-none flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-wide">
              NexusCraft
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
