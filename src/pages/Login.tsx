import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Leaf, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { OfflineBanner } from "@/components/shared/OfflineBanner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user, loading: authLoading } = useAuth();
  const online = useOnlineStatus();

  // Redirect every authenticated user to the student dashboard.
  useEffect(() => {
    if (!user) return;

    navigate("/student/dashboard", { replace: true });
  }, [user, navigate]);

  // Notify on reconnect
  const [wasOffline, setWasOffline] = useState(false);
  useEffect(() => {
    if (!online) {
      setWasOffline(true);
    } else if (wasOffline) {
      toast({ title: "Back online", description: "You can try signing in again." });
      setWasOffline(false);
    }
  }, [online, wasOffline, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!online) {
      toast({
        title: "You're offline",
        description: "Connect to the internet and try again — we'll retry automatically when you're back.",
        variant: "destructive",
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    const attemptSignIn = async (retries = 2): Promise<{ error: Error | null }> => {
      const result = await signIn(normalizedEmail, password);
      if (!result.error) return result;
      const msg = result.error.message?.toLowerCase() ?? "";
      const isNetwork =
        msg.includes("failed to fetch") ||
        msg.includes("network") ||
        msg.includes("timeout") ||
        msg.includes("load failed");
      if (isNetwork && retries > 0) {
        await new Promise((r) => setTimeout(r, 600));
        return attemptSignIn(retries - 1);
      }
      return result;
    };

    const { error } = await attemptSignIn();

    if (error) {
      const raw = error.message || "";
      const lower = raw.toLowerCase();
      let title = "Login failed";
      let description = raw || "Something went wrong. Please try again.";

      if (lower.includes("invalid login") || lower.includes("invalid credentials")) {
        title = "Incorrect email or password";
        description = "Use the same email and password you used when creating the account.";
      } else if (lower.includes("refresh token") || lower.includes("session")) {
        title = "Session refreshed";
        description = "Your old session was cleared. Please try signing in one more time.";
      } else if (lower.includes("rate") || lower.includes("too many")) {
        title = "Too many attempts";
        description = "You've tried too many times. Please wait a minute and try again.";
      } else if (
        lower.includes("failed to fetch") ||
        lower.includes("network") ||
        lower.includes("load failed") ||
        lower.includes("timeout")
      ) {
        title = "Connection issue";
        description = "We couldn't reach the server. Check your internet and try again.";
      } else if (lower.includes("user not found")) {
        title = "No account found";
        description = "No account exists with that email. Try signing up instead.";
      }

      toast({ title, description, variant: "destructive" });
    } else {
      toast({ title: "Welcome back!", description: "Signing you in…" });
    }
    setLoading(false);
  };

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
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to continue your environmental journey</CardDescription>
        </CardHeader>
        
        <CardContent>
          {!online && <OfflineBanner className="mb-4" />}

          <form onSubmit={handleLogin} className="space-y-4">
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
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            <Button type="submit" variant="hero" className="w-full" disabled={loading || authLoading || !online}>
              {loading || authLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>Sign In</>
              )}
            </Button>

          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
