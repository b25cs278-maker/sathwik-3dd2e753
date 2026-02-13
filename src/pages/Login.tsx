import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Leaf, Mail, Lock, Loader2, Shield, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<"student" | "admin">("student");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signOut, user, role } = useAuth();

  // Redirect authenticated users based on their role
  useEffect(() => {
    if (user && role) {
      // If user selected admin tab but isn't admin, sign them out
      if (loginType === "admin" && role !== "admin") {
        signOut();
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges. Please use the Student tab.",
          variant: "destructive",
        });
        return;
      }
      // If user selected student tab but is admin, sign them out  
      if (loginType === "student" && role === "admin") {
        signOut();
        toast({
          title: "Access Denied", 
          description: "Admin accounts must use the Admin tab to login.",
          variant: "destructive",
        });
        return;
      }
      
      // Redirect to appropriate dashboard
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    }
  }, [user, role, loginType, navigate, signOut, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      // Navigation is handled by the useEffect above
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
          <Tabs value={loginType} onValueChange={(v) => setLoginType(v as "student" | "admin")} className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student" className="flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Student
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </TabsTrigger>
            </TabsList>
          </Tabs>

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
            
            <Button type="submit" variant="hero" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>Sign In as {loginType === "admin" ? "Admin" : "Student"}</>
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
