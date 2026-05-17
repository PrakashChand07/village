import { BrowserRouter as Router, Routes, Route } from "react-router";
import { TopHeader } from "./components/TopHeader";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { GovernmentJobsPage } from "./pages/GovernmentJobsPage";
import { ResultsPage } from "./pages/ResultsPage";
import { ScholarshipPage } from "./pages/ScholarshipPage";
import { StudyMaterialPage } from "./pages/StudyMaterialPage";
import { FarmingHelpPage } from "./pages/FarmingHelpPage";
import { VillageSchemes } from "./pages/VillageSchemes";
import { NewsPage } from "./pages/NewsPage";
import { NewsDetailPage } from "./pages/NewsDetailPage";
import { ContactPage } from "./pages/ContactPage";
import AdminApp from "./admin/AdminApp";
import { UserAuthProvider } from "./test-series/context/UserAuthContext";
import PublicSeriesPage from "./test-series/pages/PublicSeriesPage";
import UserLoginPage from "./test-series/pages/UserLoginPage";
import UserRegisterPage from "./test-series/pages/UserRegisterPage";
import StudentDashboard from "./test-series/pages/StudentDashboard";
import TestsInSeriesPage from "./test-series/pages/TestsInSeriesPage";
import TestInstructionsPage from "./test-series/pages/TestInstructionsPage";
import LiveTestPage from "./test-series/pages/LiveTestPage";
import ResultPage from "./test-series/pages/ResultPage";
import MyResultsPage from "./test-series/pages/MyResultsPage";

export default function App() {
  return (
    <Router>
      <UserAuthProvider>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminApp />} />

          {/* Test Series Routes (no public navbar/footer) */}
          <Route path="/test-series" element={<PublicSeriesPage />} />
          <Route path="/test-series/login" element={<UserLoginPage />} />
          <Route path="/test-series/register" element={<UserRegisterPage />} />
          <Route path="/test-series/dashboard" element={<StudentDashboard />} />
          <Route path="/test-series/series/:seriesId" element={<TestsInSeriesPage />} />
          <Route path="/test-series/instructions/:testId" element={<TestInstructionsPage />} />
          <Route path="/test-series/live/:testId" element={<LiveTestPage />} />
          <Route path="/test-series/result/:attemptId" element={<ResultPage />} />
          <Route path="/test-series/my-results" element={<MyResultsPage />} />

          {/* Public Routes with Layout */}
          <Route path="/*" element={
            <div className="min-h-screen bg-[#F5F7FA]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <TopHeader />
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/government-jobs" element={<GovernmentJobsPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/scholarship" element={<ScholarshipPage />} />
                <Route path="/study-material" element={<StudyMaterialPage />} />
                <Route path="/farming-help" element={<FarmingHelpPage />} />
                <Route path="/village-schemes" element={<VillageSchemes />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:id" element={<NewsDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
              <Footer />
            </div>
          } />
        </Routes>
      </UserAuthProvider>
    </Router>
  );
}