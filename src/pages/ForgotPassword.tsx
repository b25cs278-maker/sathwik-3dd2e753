import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Leaf, Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { OfflineBanner } from "@/components/shared/OfflineBanner";

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
      toast({
        title: "You're offline",
        description: "Connect to the internet to request a reset link.",
        variant: "destructive",
      });
      return;
    }

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0].message);
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
        description = "You've requested too many resets. Please wait a few minutes and try again.";
      } else if (lower.includes("invalid") && lower.includes("email")) {
        title = "Invalid email";
        description = "Please enter a valid email address.";
      } else if (/failed to fetch|network|timeout|load failed/.test(lower)) {
        title = "Connection issue";
        description = "We couldn't reach the server. Check your internet and try again.";
      }
      toast({ variant: "destructive", title, description });
      return;
    }

    setSent(true);
    toast({
      title: "Email sent",
      description: "Check your inbox for the password reset link.",
    });
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-eco-leaf/5 p-4">
        <Card variant="glass" className="w-full max-w-md animate-scale-in">
          <CardContent className="pt-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-eco-leaf/20 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-eco-leaf" />
            </div>
            <h2 className="text-xl font-bold mb-2">Check your email</h2>
            <p className="text-muted-foreground mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <Link to="/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-eco-leaf/5 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-eco-leaf/10 rounded-full blur-3xl" />
      </div>

      <Card variant="glass" className="w-full max-w-md relative animate-scale-in">
        <CardHeader className="text-center pb-2">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-display font-bold">
              Eco<span className="text-primary">Learn</span>
            </span>
          </Link>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>Enter your email to receive a reset link</CardDescription>
        </CardHeader>

        <CardContent>
          {!online && <OfflineBanner className="mb-4" />}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 ${error ? "border-destructive" : ""}`}
                />
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>

            <Button type="submit" variant="hero" className="w-full" disabled={loading || !online}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
