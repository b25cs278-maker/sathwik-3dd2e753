import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { OfflineBanner } from "@/components/shared/OfflineBanner";
import { AuthShell } from "@/components/auth/AuthShell";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user, loading: authLoading } = useAuth();
  const online = useOnlineStatus();

  useEffect(() => {
    if (user) navigate("/student/dashboard", { replace: true });
  }, [user, navigate]);

  const [wasOffline, setWasOffline] = useState(false);
  useEffect(() => {
    if (!online) setWasOffline(true);
    else if (wasOffline) {
      toast({ title: "Back online", description: "You can try signing in again." });
      setWasOffline(false);
    }
  }, [online, wasOffline, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!online) {
      toast({ title: "You're offline", description: "Connect to the internet and try again.", variant: "destructive" });
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      toast({ title: "Missing fields", description: "Please enter both email and password.", variant: "destructive" });
      return;
    }
    setLoading(true);

    const attempt = async (retries = 2): Promise<{ error: Error | null }> => {
      const res = await signIn(normalizedEmail, password);
      if (!res.error) return res;
      const msg = res.error.message?.toLowerCase() ?? "";
      if (/failed to fetch|network|timeout|load failed/.test(msg) && retries > 0) {
        await new Promise((r) => setTimeout(r, 600));
        return attempt(retries - 1);
      }
      return res;
    };

    const { error } = await attempt();
    if (error) {
      const lower = (error.message || "").toLowerCase();
      let title = "Login failed";
      let description = error.message || "Something went wrong.";
      if (lower.includes("invalid login") || lower.includes("invalid credentials")) {
        title = "Incorrect email or password";
        description = "Use the same email and password you signed up with.";
      } else if (lower.includes("rate") || lower.includes("too many")) {
        title = "Too many attempts";
        description = "Please wait a minute and try again.";
      } else if (/failed to fetch|network|timeout|load failed/.test(lower)) {
        title = "Connection issue";
        description = "Check your internet and try again.";
      }
      toast({ title, description, variant: "destructive" });
    } else {
      toast({ title: "Welcome back!", description: "Signing you in…" });
    }
    setLoading(false);
  };

  return (
    <AuthShell>
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Welcome back</h1>
          <p className="text-gray-400 text-sm">Sign in to continue your journey</p>
        </div>

        {!online && <OfflineBanner className="mb-4" />}

        <form onSubmit={handleLogin} className="space-y-5">
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
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Password</label>
              <Link to="/forgot-password" className="text-xs text-cyan-400 hover:text-cyan-300">Forgot?</Link>
            </div>
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
          </div>

          <button
            type="submit"
            disabled={loading || authLoading || !online}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading || authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<>Sign in <ArrowRight className="h-4 w-4" /></>)}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          New to NexusCraft?{" "}
          <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold">Create an account</Link>
        </p>
      </div>
    </AuthShell>
  );
}
