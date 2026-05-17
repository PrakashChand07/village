import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useUserAuth } from '../context/UserAuthContext';
import { attemptsAPI } from '../api/testSeriesApi';
import { Clock, Target, Trophy, ChevronRight, Filter, RotateCcw, BarChart3 } from 'lucide-react';

interface Attempt {
  _id: string;
  score: number;
  totalMarks: number;
  accuracy: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  timeTaken: number;
  completedAt: string;
  test: { _id: string; title: string; duration: number };
  testSeries: { _id: string; title: string; category: string; difficulty: string };
}

export default function MyResultsPage() {
  const { token } = useUserAuth();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    attemptsAPI.getMyHistory(token!).then(res => setAttempts(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(attempts.map(a => a.testSeries?.category).filter(Boolean)))];

  const filtered = filterCategory === 'All'
    ? attempts
    : attempts.filter(a => a.testSeries?.category === filterCategory);

  // Group by series title
  const grouped: Record<string, Attempt[]> = {};
  filtered.forEach(a => {
    const key = a.testSeries?.title || 'Unknown';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(a);
  });

  const totalTests = attempts.length;
  const avgAcc = attempts.length > 0 ? Math.round(attempts.reduce((s, a) => s + a.accuracy, 0) / attempts.length) : 0;
  const bestAcc = attempts.length > 0 ? Math.max(...attempts.map(a => a.accuracy)) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#1a3c1a] to-[#2D7A1F] text-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/test-series/dashboard" className="flex items-center gap-2 text-green-200 hover:text-white text-sm mb-4 transition-colors w-fit">
            ← Dashboard
          </Link>
          <h1 className="text-2xl font-bold mb-1">My Test History</h1>
          <p className="text-green-200 text-sm">All your test attempts and performance</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Target, label: 'Tests Taken', value: totalTests },
            { icon: BarChart3, label: 'Avg Accuracy', value: `${avgAcc}%` },
            { icon: Trophy, label: 'Best Score', value: `${bestAcc}%` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white rounded-2xl border shadow-sm p-4 text-center">
              <Icon className="w-6 h-6 text-[#6DBE45] mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{loading ? '—' : value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-500" />
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${filterCategory === cat ? 'bg-[#6DBE45] text-white' : 'bg-white border text-gray-600 hover:border-[#6DBE45]'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grouped Results */}
        {loading ? (
          <div className="space-y-4">{[1,2].map(i => <div key={i} className="bg-white rounded-2xl border h-40 animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Target className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-500">No attempts yet</h3>
            <Link to="/test-series" className="mt-4 inline-flex items-center gap-2 bg-[#6DBE45] text-white px-5 py-2.5 rounded-xl font-semibold">
              Browse Test Series <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          Object.entries(grouped).map(([seriesTitle, seriesAttempts]) => (
            <div key={seriesTitle} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{seriesTitle}</h3>
                  <p className="text-sm text-gray-500">{seriesAttempts[0]?.testSeries?.category} • {seriesAttempts.length} attempts</p>
                </div>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                  Math.round(seriesAttempts.reduce((s,a)=>s+a.accuracy,0)/seriesAttempts.length) >= 75 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  Avg {Math.round(seriesAttempts.reduce((s,a)=>s+a.accuracy,0)/seriesAttempts.length)}%
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {['Test Name', 'Score', 'Accuracy', 'Correct/Wrong/Skip', 'Time', 'Date', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {seriesAttempts.map(a => (
                      <tr key={a._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{a.test?.title}</td>
                        <td className="px-4 py-3 font-bold text-[#2D7A1F]">{a.score}/{a.totalMarks}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${a.accuracy >= 75 ? 'bg-green-100 text-green-700' : a.accuracy >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {a.accuracy}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          <span className="text-green-600">{a.correctAnswers}C</span> / <span className="text-red-500">{a.wrongAnswers}W</span> / <span>{a.unanswered}S</span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {Math.floor(a.timeTaken/60)}m {a.timeTaken%60}s
                        </td>
                        <td className="px-4 py-3 text-gray-500">{new Date(a.completedAt).toLocaleDateString('en-IN')}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Link to={`/test-series/result/${a._id}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium">
                              Review <ChevronRight className="w-3 h-3" />
                            </Link>
                            <Link to={`/test-series/instructions/${a.test?._id}`} className="flex items-center gap-1 text-xs text-[#2D7A1F] hover:underline font-medium">
                              <RotateCcw className="w-3 h-3" /> Retry
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
