import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useUserAuth } from '../context/UserAuthContext';
import { attemptsAPI, testSeriesAPI } from '../api/testSeriesApi';
import { Trophy, BookOpen, Target, TrendingUp, Clock, Play, ChevronRight, BarChart3, LogOut } from 'lucide-react';

interface Attempt {
  _id: string;
  test: { title: string; duration: number };
  testSeries: { title: string; category: string };
  score: number;
  totalMarks: number;
  accuracy: number;
  completedAt: string;
}

export default function StudentDashboard() {
  const { user, token, logout } = useUserAuth();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [seriesCount, setSeriesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [attRes, serRes] = await Promise.all([
        attemptsAPI.getMyHistory(token!),
        testSeriesAPI.getAll(),
      ]);
      setAttempts(attRes.data.data);
      setSeriesCount(serRes.data.data.length);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const avgScore = attempts.length > 0
    ? Math.round(attempts.reduce((s, a) => s + a.accuracy, 0) / attempts.length)
    : 0;
  const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.accuracy)) : 0;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-[#1a3c1a] via-[#2D7A1F] to-[#6DBE45] relative overflow-hidden text-white pb-20 pt-10 px-4 shadow-lg">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
        
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="flex items-center gap-6 text-center md:text-left">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-xl">
              <span className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">
                {user?.name?.charAt(0).toUpperCase() || 'S'}
              </span>
            </div>
            <div>
              <p className="text-green-100 font-medium mb-1 tracking-wide uppercase text-xs md:text-sm">Student Dashboard</p>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 drop-shadow-sm">{user?.name}</h1>
              <p className="text-green-50 text-sm md:text-base flex items-center justify-center md:justify-start gap-2">
                <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                {user?.email}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto">
            <Link to="/test-series"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm">
              <BookOpen className="w-4 h-4" /> Browse
            </Link>
            <Link to="/test-series/my-results"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm">
              <BarChart3 className="w-4 h-4" /> History
            </Link>
            <button onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 border border-red-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20 pb-12 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: Target, label: 'Tests Taken', value: attempts.length, color: 'bg-white text-blue-600', gradient: 'from-blue-50 to-white' },
            { icon: TrendingUp, label: 'Avg Accuracy', value: `${avgScore}%`, color: 'bg-white text-green-600', gradient: 'from-green-50 to-white' },
            { icon: Trophy, label: 'Best Score', value: `${bestScore}%`, color: 'bg-white text-yellow-600', gradient: 'from-yellow-50 to-white' },
            { icon: BookOpen, label: 'Series Available', value: seriesCount, color: 'bg-white text-purple-600', gradient: 'from-purple-50 to-white' },
          ].map(({ icon: Icon, label, value, color, gradient }) => (
            <div key={label} className={`bg-gradient-to-b ${gradient} border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <Icon className="w-24 h-24" />
              </div>
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 shadow-sm`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-extrabold text-gray-800">{loading ? '—' : value}</div>
              <div className="text-sm font-medium text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Recent Attempts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#6DBE45]" /> Recent Activity
            </h2>
            <Link to="/test-series/my-results" className="text-sm font-semibold text-[#2D7A1F] hover:text-[#1a3c1a] bg-green-50 px-4 py-1.5 rounded-full flex items-center gap-1 transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse" />)}</div>
          ) : attempts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">No tests taken yet</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">Your recent test attempts and scores will appear here once you start taking tests.</p>
              <Link to="/test-series" className="inline-flex items-center gap-2 bg-[#6DBE45] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#2D7A1F] shadow-sm hover:shadow-md transition-all">
                Browse Test Series <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {attempts.slice(0, 5).map(attempt => (
                <div key={attempt._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-gray-100 rounded-xl hover:border-[#6DBE45]/30 hover:shadow-sm transition-all gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-lg truncate mb-1">{attempt.test?.title}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-md text-gray-700 font-medium">
                        {attempt.testSeries?.category}
                      </span>
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" />{new Date(attempt.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-0 pt-4 sm:pt-0">
                    <div className="text-center">
                      <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Score</div>
                      <div className={`text-lg font-black px-4 py-1.5 rounded-lg ${attempt.accuracy >= 75 ? 'bg-green-50 text-green-600 border border-green-100' : attempt.accuracy >= 50 ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {attempt.accuracy}%
                      </div>
                    </div>
                    <Link to={`/test-series/result/${attempt._id}`}
                      className="flex items-center gap-1.5 text-sm bg-white border-2 border-[#2D7A1F] text-[#2D7A1F] px-4 py-2 rounded-lg hover:bg-[#2D7A1F] hover:text-white font-bold transition-colors">
                      Review <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className={`grid gap-4 ${attempts.length > 0 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'}`}>
          <Link to="/test-series" className="group bg-white border border-gray-100 p-6 rounded-2xl hover:border-[#6DBE45] hover:shadow-lg transition-all flex items-center gap-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#6DBE45]/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000" />
            <div className="w-14 h-14 rounded-full bg-[#6DBE45]/10 text-[#2D7A1F] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="font-bold text-gray-800 text-lg group-hover:text-[#2D7A1F] transition-colors">Browse Tests</div>
              <div className="text-sm text-gray-500 mt-0.5">Explore all available test series</div>
            </div>
          </Link>
          
          <Link to="/test-series/my-results" className="group bg-white border border-gray-100 p-6 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all flex items-center gap-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000" />
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div>
              <div className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">My Results</div>
              <div className="text-sm text-gray-500 mt-0.5">Detailed history & analytics</div>
            </div>
          </Link>
          
          {attempts.length > 0 && (
            <Link to={`/test-series/result/${attempts[0]._id}`} className="group bg-white border border-gray-100 p-6 rounded-2xl hover:border-yellow-500 hover:shadow-lg transition-all flex items-center gap-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000" />
              <div className="w-14 h-14 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Play className="w-7 h-7 ml-1" />
              </div>
              <div>
                <div className="font-bold text-gray-800 text-lg group-hover:text-yellow-600 transition-colors">Review Last Test</div>
                <div className="text-sm text-gray-500 mt-0.5">Check your latest performance</div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
