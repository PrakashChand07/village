import { Routes, Route } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import JobsList from './pages/JobsList';
import ResultsList from './pages/ResultsList';
import ScholarshipsList from './pages/ScholarshipsList';
import SchemesList from './pages/SchemesList';
import Categories from './pages/Categories';
import NewsList from './pages/NewsList';
import ContactList from './pages/ContactList';
import TestSeriesAdmin from './pages/TestSeriesAdmin';
import TestsAdmin from './pages/TestsAdmin';
import QuestionsAdmin from './pages/QuestionsAdmin';
import './admin.css';

export default function AdminApp() {
  return (
    <div className="admin-root">
      <AuthProvider>
        <Routes>
          <Route path="login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="jobs" element={<JobsList />} />
            <Route path="results" element={<ResultsList />} />
            <Route path="scholarships" element={<ScholarshipsList />} />
            <Route path="schemes" element={<SchemesList />} />
            <Route path="news" element={<NewsList />} />
            <Route path="categories" element={<Categories />} />
            <Route path="contacts" element={<ContactList />} />
            {/* Test Series Routes */}
            <Route path="test-series" element={<TestSeriesAdmin />} />
            <Route path="test-series/:seriesId/tests" element={<TestsAdmin />} />
            <Route path="test-series/:seriesId/tests/:testId/questions" element={<QuestionsAdmin />} />
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}
