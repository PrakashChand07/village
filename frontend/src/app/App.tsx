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
import { ContactPage } from "./pages/ContactPage";
import AdminApp from "./admin/AdminApp";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminApp />} />

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
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}