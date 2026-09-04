import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "@/components/Notifications/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { registerUser } from "@/api/user.api";
import { UserRole } from "@/vite-env";
import { 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  Eye, 
  EyeOff, 
  ArrowRight
} from "lucide-react";


export function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("candidate");
  const [companyName, setCompanyName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const { refreshUser } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      addNotification({
        id: Date.now().toString(),
        type: "warning",
        message: "Please fill in all required fields",
      });
      return;
    }

    if (password !== confirmPassword) {
      addNotification({
        id: Date.now().toString(),
        type: "error",
        message: "Passwords do not match",
      });
      return;
    }

    if (role === "recruiter" && !companyName.trim()) {
      addNotification({
        id: Date.now().toString(),
        type: "warning",
        message: "Company name is required for recruiter accounts",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        companyName: role === "recruiter" ? companyName.trim() : undefined,
      });

      addNotification({
        id: Date.now().toString(),
        type: "success",
        message: "Account registered successfully!",
      });

      await refreshUser();

      if (response?.user?.role === "recruiter") {
        navigate("/recruiter");
      } else if (response?.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || "Registration failed";
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
      <div className="w-full max-w-md my-8">
        {/* Logo & Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">MockMate AI</span>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-2">Create your account</h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose your role to get started with intelligent AI interviewing
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          {/* Role Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => setRole("candidate")}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                role === "candidate"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Candidate
            </button>
            <button
              type="button"
              onClick={() => setRole("recruiter")}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                role === "recruiter"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Recruiter
            </button>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === "recruiter" ? "Sarah Jenkins" : "Alex Rivera"}
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

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

            {role === "recruiter" && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corp or TechTalent"
                  className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
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

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                "Creating Account..."
              ) : (
                <>
                  Register as {role === "recruiter" ? "Recruiter" : "Candidate"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
