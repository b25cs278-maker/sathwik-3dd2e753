import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminQuizzes() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={!!user} userRole={role || "admin"} onLogout={handleLogout} />
      
      <main className="container py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold text-foreground mb-4">
              Quiz Management
            </h1>
            <p className="text-muted-foreground">
              No data available
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}