import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, User, Loader2, CheckCircle2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { OfflineBanner } from "@/components/shared/OfflineBanner";
import { AuthShell } from "@/components/auth/AuthShell";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref") || "";
  const { toast } = useToast();
  const { signUp, user, loading: authLoading } = useAuth();
  const online = useOnlineStatus();
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!online) setWasOffline(true);
    else if (wasOffline) {
      toast({ title: "Back online", description: "You can try creating your account again." });
      setWasOffline(false);
    }
  }, [online, wasOffline, toast]);

  useEffect(() => {
    if (user) navigate("/student/dashboard", { replace: true });
  }, [user, navigate]);

  const requirements = [
    { met: password.length >= 8, text: "At least 8 characters" },
    { met: /[A-Z]/.test(password), text: "One uppercase letter" },
    { met: /[0-9]/.test(password), text: "One number" },
  ];
  const allMet = requirements.every((r) => r.met);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!online) {
      toast({ title: "You're offline", description: "Connect to the internet and try again.", variant: "destructive" });
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    if (!trimmedName || !normalizedEmail || !password) {
      toast({ title: "Missing fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    if (!allMet) {
      toast({ title: "Password too weak", description: "Meet all password requirements.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signUp(normalizedEmail, password, trimmedName, refCode);
    if (error) {
      let msg = error.message;
      if (error.message.includes("already registered")) msg = "This email is already registered. Please sign in instead.";
      toast({ title: "Signup failed", description: msg, variant: "destructive" });
      setLoading(false);
    } else {
      toast({ title: "Account created!", description: "Welcome to NexusCraft!" });
    }
  };

  return (
    <AuthShell>
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Create your account</h1>
          <p className="text-gray-400 text-sm">
            Join thousands of innovators
            {refCode && <span className="block mt-1 text-cyan-400 font-medium">🎉 Referred by a friend!</span>}
          </p>
        </div>

        {!online && <OfflineBanner className="mb-4" />}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Full name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                id="name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#0f172a]/80 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#0f172a]/80 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 bg-[#0f172a]/80 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="space-y-1 mt-3">
              {requirements.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className={`h-3 w-3 ${r.met ? "text-cyan-400" : "text-gray-600"}`} />
                  <span className={r.met ? "text-cyan-400" : "text-gray-500"}>{r.text}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || authLoading || !online}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading || authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<>Create account <ArrowRight className="h-4 w-4" /></>)}
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-gray-500">
          By continuing, you agree to our{" "}
          <a href="#" className="text-cyan-400 hover:text-cyan-300">Terms</a> and{" "}
          <a href="#" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</a>.
        </p>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">Sign in</Link>
        </p>
      </div>
    </AuthShell>
  );
}
