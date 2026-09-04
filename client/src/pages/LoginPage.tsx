import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "@/api/user.api";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/components/Notifications/NotificationContext";
import { Sparkles, Eye, EyeOff, ArrowRight } from "lucide-react";

export function LoginPage() {
  const { addNotification } = useNotification();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      addNotification({
        id: Date.now().toString(),
        type: "warning",
        message: "Please enter both email and password",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await loginUser({
        email: email.trim().toLowerCase(),
        password,
      });

      addNotification({
        id: Date.now().toString(),
        type: "success",
        message: "Login successful!",
      });

      const updatedUser = await refreshUser();
      const userRole = updatedUser?.role || response?.user?.role || "candidate";

      if (from) {
        navigate(from, { replace: true });
      } else if (userRole === "recruiter") {
        navigate("/recruiter", { replace: true });
      } else if (userRole === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Invalid credentials or login failure";
      addNotification({
        id: Date.now().toString(),
        type: "error",
        message: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-black">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">MockMate AI</span>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-2">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to access your interview session or recruiter workspace
          </p>
        </div>

        {/* Login Box */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                "Signing In..."
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account yet?{" "}
            <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
