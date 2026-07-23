import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Loader2, ArrowLeft, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { OfflineBanner } from "@/components/shared/OfflineBanner";
import { AuthShell } from "@/components/auth/AuthShell";

const emailSchema = z.string().email("Please enter a valid email address");

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const online = useOnlineStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!online) {
      toast({ title: "You're offline", description: "Connect to the internet to request a reset link.", variant: "destructive" });
      return;
    }
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    const attempt = async (retries = 1): Promise<{ error: { message: string } | null }> => {
      try {
        const res = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (res.error && /failed to fetch|network|timeout|load failed/i.test(res.error.message) && retries > 0) {
          await new Promise((r) => setTimeout(r, 600));
          return attempt(retries - 1);
        }
        return { error: res.error };
      } catch (err) {
        if (retries > 0) {
          await new Promise((r) => setTimeout(r, 600));
          return attempt(retries - 1);
        }
        return { error: { message: (err as Error).message || "Network error" } };
      }
    };
    const { error: resetError } = await attempt();
    setLoading(false);
    if (resetError) {
      const lower = (resetError.message || "").toLowerCase();
      let title = "Couldn't send reset email";
      let description = resetError.message || "Please try again.";
      if (lower.includes("rate") || lower.includes("too many") || lower.includes("limit")) {
        title = "Too many requests";
        description = "Please wait a few minutes and try again.";
      } else if (/failed to fetch|network|timeout|load failed/.test(lower)) {
        title = "Connection issue";
        description = "Check your internet and try again.";
      }
      toast({ variant: "destructive", title, description });
      return;
    }
    setSent(true);
    toast({ title: "Email sent", description: "Check your inbox for the password reset link." });
  };

  if (sent) {
    return (
      <AuthShell>
        <div className="w-full text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-cyan-400/15 border border-cyan-400/20 flex items-center justify-center mb-5">
            <CheckCircle className="h-8 w-8 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-2">Check your email</h1>
          <p className="text-gray-400 text-sm mb-8">
            We've sent a password reset link to <strong className="text-white">{email}</strong>
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/10 text-gray-200 hover:bg-white/5 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Forgot password?</h1>
          <p className="text-gray-400 text-sm">Enter your email to receive a reset link</p>
        </div>

        {!online && <OfflineBanner className="mb-4" />}

        <form onSubmit={handleSubmit} className="space-y-5">
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
                className={`w-full pl-11 pr-4 py-3 bg-[#0f172a]/80 border rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition ${
                  error ? "border-red-500/60" : "border-white/10 focus:border-cyan-400/50"
                }`}
              />
            </div>
            {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !online}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<>Send reset link <ArrowRight className="h-4 w-4" /></>)}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Back to sign in
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
