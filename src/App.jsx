import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SelectionProvider } from "./context/SelectionContext";
import Home from "./pages/Home";
import DomainsPage from "./pages/DomainsPage";
import InterviewSetupPage from "./pages/InterviewSetupPage";
import LiveInterviewPage from "./pages/LiveInterviewPage";
import ResultPage from "./pages/ResultPage";
import ReportPage from "./pages/ReportPage";

export default function App() {
  return (
    <SelectionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/domains" element={<DomainsPage />} />
          <Route path="/interview/setup" element={<InterviewSetupPage />} />
          <Route path="/interview/:sessionId" element={<LiveInterviewPage />} />
          <Route path="/interview/:sessionId/result" element={<ResultPage />} />
          <Route path="/interview/:sessionId/report" element={<ReportPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </SelectionProvider>
  );
}
