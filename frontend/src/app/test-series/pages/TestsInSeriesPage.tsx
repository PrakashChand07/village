import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { useUserAuth } from '../context/UserAuthContext';
import { testsAPI, attemptsAPI } from '../api/testSeriesApi';
import { Clock, Target, Award, BookOpen, Play, ChevronLeft, RotateCcw, CheckCircle } from 'lucide-react';

interface Test {
  _id: string;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  totalMarks: number;
  isActive: boolean;
}

interface Series {
  _id: string;
  title: string;
  category: string;
  difficulty: string;
}

export default function TestsInSeriesPage() {
  const { seriesId } = useParams<{ seriesId: string }>();
  const { token, isAuthenticated } = useUserAuth();
  const [tests, setTests] = useState<Test[]>([]);
  const [series, setSeries] = useState<Series | null>(null);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!seriesId) return;
    const fetchPromises: any[] = [
      testsAPI.getBySeries(seriesId),
      import('../api/testSeriesApi').then(m => m.testSeriesAPI.getById(seriesId)),
    ];

    // Fetch attempts if user is logged in
    if (isAuthenticated && token) {
      fetchPromises.push(attemptsAPI.getMyHistory(token));
    }

    Promise.all(fetchPromises)
      .then((results) => {
        setTests(results[0].data.data);
        setSeries(results[1].data.data);
        if (results[2]) {
          // Sort attempts by date (newest first) to always show latest result
          const sortedAttempts = results[2].data.data.sort((a: any, b: any) =>
            new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
          );
          setAttempts(sortedAttempts);
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [seriesId, isAuthenticated, token]);

  const DIFF_COLOR: Record<string, string> = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Hard: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a3c1a] to-[#2D7A1F] text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/test-series" className="flex items-center gap-2 text-green-200 hover:text-white text-sm mb-4 transition-colors w-fit">
            <ChevronLeft className="w-4 h-4" /> Back to Test Series
          </Link>
          {series && (
            <>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full">{series.category}</span>
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full">{series.difficulty}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{series.title}</h1>
              <p className="text-green-200 mt-1">{tests.length} tests available</p>
            </>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-2xl border h-28 animate-pulse" />)}
          </div>
        ) : tests.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-500">No tests available yet</h3>
            <p className="text-gray-400 mt-1">Check back soon — tests are being added!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((test, idx) => {
              const myAttempt = attempts.find(a => a.test?._id === test._id || a.test === test._id);

              return (
                <div key={test._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col md:flex-row md:items-center gap-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl text-white font-bold text-lg flex-shrink-0 shadow-sm ${myAttempt ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-[#6DBE45] to-[#2D7A1F]'}`}>
                    {myAttempt ? <CheckCircle className="w-6 h-6" /> : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-gray-900 text-lg">{test.title}</h3>
                      {myAttempt && (
                        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-md border border-blue-100 whitespace-nowrap">
                          Score: {myAttempt.score} / {test.totalMarks} ({myAttempt.accuracy}%)
                        </span>
                      )}
                    </div>
                    {test.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{test.description}</p>}
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md"><Target className="w-4 h-4 text-gray-400" />{test.totalQuestions} Questions</span>
                      <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md"><Clock className="w-4 h-4 text-gray-400" />{test.duration} mins</span>
                      <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md"><Award className="w-4 h-4 text-gray-400" />{test.totalMarks} Marks</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 mt-4 md:mt-0">
                    {myAttempt ? (
                      <>
                        <Link
                          to={`/test-series/result/${myAttempt._id}`}
                          className="flex items-center justify-center gap-1.5 bg-white border-2 border-blue-600 text-blue-600 px-5 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-all text-sm"
                        >
                          Review Result
                        </Link>
                        <Link
                          to={`/test-series/instructions/${test._id}`}
                          className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#6DBE45] to-[#2D7A1F] text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all text-sm"
                        >
                          <RotateCcw className="w-4 h-4" /> Reattempt
                        </Link>
                      </>
                    ) : (
                      <Link
                        to={`/test-series/instructions/${test._id}`}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#6DBE45] to-[#2D7A1F] text-white px-8 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all text-sm"
                      >
                        <Play className="w-4 h-4 fill-current" /> Start Test
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
