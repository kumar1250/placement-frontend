import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SelectionProvider } from "./context/SelectionContext";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import DomainsPage from "./pages/DomainsPage";
import InterviewSetupPage from "./pages/InterviewSetupPage";
import LiveInterviewPage from "./pages/LiveInterviewPage";
import ResultPage from "./pages/ResultPage";
import ReportPage from "./pages/ReportPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SelectionProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              }
            />
            <Route
              path="/interviews/history"
              element={
                <RequireAuth>
                  <HistoryPage />
                </RequireAuth>
              }
            />
            <Route
              path="/domains"
              element={
                <RequireAuth>
                  <DomainsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/interview/setup"
              element={
                <RequireAuth>
                  <InterviewSetupPage />
                </RequireAuth>
              }
            />
            <Route
              path="/interview/:sessionId"
              element={
                <RequireAuth>
                  <LiveInterviewPage />
                </RequireAuth>
              }
            />
            <Route
              path="/interview/:sessionId/result"
              element={
                <RequireAuth>
                  <ResultPage />
                </RequireAuth>
              }
            />
            <Route
              path="/interview/:sessionId/report"
              element={
                <RequireAuth>
                  <ReportPage />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Home />} />
          </Routes>
        </SelectionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
