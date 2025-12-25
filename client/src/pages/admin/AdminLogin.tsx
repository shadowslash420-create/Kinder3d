import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, Chrome } from "lucide-react";
import { signInWithEmail, signInWithGoogle, getUserRole, auth, onAuthStateChanged } from "@/lib/firebase";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("AdminLogin: Auth state changed, user found:", user.email);
        const role = await getUserRole(user);
        console.log("AdminLogin: Detected role:", role);
        if (role === "admin") {
          setLocation("/admin/dashboard");
        } else if (role === "staff_a") {
          setLocation("/staff-a");
        } else if (role === "staff_b") {
          setLocation("/staff-b");
        } else if (role === "customer") {
          console.log("AdminLogin: Customer redirected to home");
          setLocation("/");
        }
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, [setLocation]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInWithEmail(email, password);
      const role = await getUserRole(result.user);
      
      console.log(`Login attempt for ${result.user.email} - Role: ${role}`);
      
      if (role !== "admin" && role !== "staff_a" && role !== "staff_b") {
        console.error(`User ${result.user.email} has role '${role}' but is not admin or staff`);
        throw new Error("You don't have admin access. Please contact the administrator.");
      }

      toast({ title: "Welcome back!", description: "You have been logged in successfully." });
      
      // Redirect based on role
      if (role === "admin") {
        setLocation("/admin/dashboard");
      } else if (role === "staff_a") {
        setLocation("/staff-a");
      } else if (role === "staff_b") {
        setLocation("/staff-b");
      }
    } catch (error: any) {
      let message = error.message;
      if (error.code === "auth/invalid-credential") {
        message = "Invalid email or password";
      } else if (error.code === "auth/user-not-found") {
        message = "No account found with this email";
      }
      console.error("Login error:", error);
      toast({ title: "Login Failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      console.log("Google login success, result:", result);
      const role = await getUserRole(result.user);
      
      console.log(`Google login for ${result.user.email} - Role: ${role}`);
      
      if (role !== "admin" && role !== "staff_a" && role !== "staff_b") {
        console.error(`User ${result.user.email} has role '${role}' but is not admin or staff`);
        toast({ title: "Access Denied", description: `You have been logged in as '${role}'. You don't have admin access.`, variant: "destructive" });
        setLocation("/"); // Redirect to home instead of throwing if they are just a customer
        return;
      }

      toast({ title: "Welcome back!", description: "You have been logged in successfully." });
      
      // Redirect based on role
      if (role === "admin") {
        setLocation("/admin/dashboard");
      } else if (role === "staff_a") {
        setLocation("/staff-a");
      } else if (role === "staff_b") {
        setLocation("/staff-b");
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-3 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Admin Portal</CardTitle>
          <CardDescription className="text-slate-300">
            Sign in to manage your creperie
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full bg-white hover:bg-gray-100 text-gray-800"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-800 px-2 text-slate-400">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
