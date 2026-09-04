import { Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import NotificationCard from "./components/Notifications/NotificationCard";
import { SignupPage } from "./pages/SignupPage";
import InterviewInterfacePage from "./pages/InterviewInterfacePage";
import CodeEditor from "./components/CodeEdior/CodeEditor";
import { InterviewDetails } from "./pages/InterviewDetails";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ResumeATSPage from "./pages/candidate/ResumeATSPage";
import RoadmapLeaderboardPage from "./pages/candidate/RoadmapLeaderboardPage";
import SystemDesignPage from "./pages/candidate/SystemDesignPage";
import SalaryNegotiationPage from "./pages/candidate/SalaryNegotiationPage";

function App() {

  return (
    <div className="bg-[#121214] min-h-screen text-slate-100 selection:bg-emerald-500 selection:text-black">
      <NotificationCard />
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Candidate Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["candidate", "admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-ats"
            element={
              <ProtectedRoute allowedRoles={["candidate", "admin"]}>
                <ResumeATSPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roadmap"
            element={
              <ProtectedRoute allowedRoles={["candidate", "admin"]}>
                <RoadmapLeaderboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/system-design"
            element={
              <ProtectedRoute allowedRoles={["candidate", "admin"]}>
                <SystemDesignPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salary-negotiation"
            element={
              <ProtectedRoute allowedRoles={["candidate", "admin"]}>
                <SalaryNegotiationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interviewinterface/:id"

            element={
              <ProtectedRoute allowedRoles={["candidate", "admin"]}>
                <InterviewInterfacePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interviewdetails/:id"
            element={
              <ProtectedRoute>
                <InterviewDetails />
              </ProtectedRoute>
            }
          />

          {/* Recruiter Protected Routes */}
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/test" element={<CodeEditor />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

