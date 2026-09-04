import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/components/Notifications/NotificationContext";
import { 
  Sparkles, 
  Briefcase, 
  ShieldAlert, 
  User as UserIcon, 
  LogOut, 
  Layers,
  Trophy
} from "lucide-react";


export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isCandidate, isRecruiter, isAdmin } = useAuth();
  const { addNotification } = useNotification();

  const handleLogout = async () => {
    try {
      await logout();
      addNotification({
        id: Date.now().toString(),
        type: "success",
        message: "Logged out successfully",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 mx-auto w-full max-w-6xl px-4 py-3 md:top-4">
      <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/80 px-4 md:px-6 py-2.5 shadow-2xl backdrop-blur-xl">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1">
              MockMate <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">AI</span>
            </span>
          </div>
        </Link>

        {/* Dynamic Center Navigation Links based on Role */}
        <nav className="hidden md:flex items-center gap-1">
          {user && (
            <>
              {(isCandidate || isAdmin) && (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      location.pathname === "/dashboard"
                        ? "bg-slate-800 text-emerald-400 border border-slate-700"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Interviews
                  </Link>
                  <Link
                    to="/resume-ats"
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      location.pathname === "/resume-ats"
                        ? "bg-slate-800 text-blue-400 border border-slate-700"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Resume & ATS
                  </Link>
                  <Link
                    to="/system-design"
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      location.pathname === "/system-design"
                        ? "bg-slate-800 text-indigo-400 border border-slate-700"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    System Design
                  </Link>
                  <Link
                    to="/salary-negotiation"
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      location.pathname === "/salary-negotiation"
                        ? "bg-slate-800 text-emerald-400 border border-slate-700"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Salary Simulator
                  </Link>
                  <Link
                    to="/roadmap"
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      location.pathname === "/roadmap"
                        ? "bg-slate-800 text-amber-400 border border-slate-700"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    Roadmap & Badges
                  </Link>
                </>
              )}



              {(isRecruiter || isAdmin) && (
                <Link
                  to="/recruiter"
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    location.pathname.startsWith("/recruiter")
                      ? "bg-slate-800 text-emerald-400 border border-slate-700"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Recruiter Portal
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    location.pathname.startsWith("/admin")
                      ? "bg-slate-800 text-red-400 border border-slate-700"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Admin Suite
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Right Side Profile / Auth Action */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-white leading-tight">{user.name}</span>
                <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
                  {user.role} {user.companyName ? `• ${user.companyName}` : ""}
                </span>
              </div>

              <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>

              <button
                onClick={handleLogout}
                title="Log Out"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-red-950/40 text-slate-300 hover:text-red-400 border border-slate-800 hover:border-red-500/30 text-xs font-medium transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-emerald-500/20"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
