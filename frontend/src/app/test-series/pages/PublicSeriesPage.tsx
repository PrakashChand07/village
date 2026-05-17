import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useUserAuth } from '../context/UserAuthContext';
import { testSeriesAPI, paymentAPI } from '../api/testSeriesApi';
import { Search, BookOpen, Clock, Users, Star, ChevronRight, Award, Shield, Zap, Trophy, Filter, CheckCircle } from 'lucide-react';

interface TestSeries {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  price: number;
  discountPrice: number | null;
  isFree: boolean;
  totalTests: number;
  studentsEnrolled: number;
  rating: number;
  image: string;
}

const CATEGORIES = ['All', 'SSC', 'Banking', 'UPSC', 'Railway', 'State PCS', 'Police', 'Defence', 'Other'];
const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard: 'bg-red-100 text-red-700',
};

declare global {
  interface Window { Razorpay: any; }
}

export default function PublicSeriesPage() {
  const { user, token, isAuthenticated } = useUserAuth();
  const navigate = useNavigate();
  const [series, setSeries] = useState<TestSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [payingId, setPayingId] = useState<string | null>(null);

  useEffect(() => {
    loadSeries();
    if (isAuthenticated && token) loadPurchases();
  }, [isAuthenticated, token]);

  const loadSeries = async () => {
    try {
      const res = await testSeriesAPI.getAll();
      setSeries(res.data.data);
    } catch {
      setSeries([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPurchases = async () => {
    try {
      const res = await paymentAPI.getMyPurchases(token!);
      setPurchasedIds(res.data.purchasedSeriesIds || []);
    } catch { /* ignore */ }
  };

  const handleAccess = async (s: TestSeries) => {
    if (!isAuthenticated) {
      navigate('/test-series/login');
      return;
    }
    if (s.isFree || purchasedIds.includes(s._id)) {
      navigate(`/test-series/series/${s._id}`);
      return;
    }
    // Initiate payment
    await handlePayment(s);
  };

  const handlePayment = async (s: TestSeries) => {
    setPayingId(s._id);
    try {
      const res = await paymentAPI.createOrder(s._id, token!);
      const { order, key, testSeriesTitle } = res.data;

      const options = {
        key,
        amount: order.amount,
        currency: 'INR',
        name: 'Village Help',
        description: `Purchase: ${testSeriesTitle}`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            await paymentAPI.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              testSeriesId: s._id,
            }, token!);
            setPurchasedIds(prev => [...prev, s._id]);
            alert('🎉 Payment successful! You now have access to this test series.');
            navigate(`/test-series/series/${s._id}`);
          } catch {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: { name: user?.name, email: user?.email, contact: user?.phone },
        theme: { color: '#6DBE45' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setPayingId(null);
    }
  };

  const filtered = series.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchDiff = selectedDifficulty === 'All' || s.difficulty === selectedDifficulty;
    return matchSearch && matchCat && matchDiff;
  });

  const hasAccess = (s: TestSeries) => s.isFree || purchasedIds.includes(s._id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1a3c1a] via-[#2D7A1F] to-[#6DBE45] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1 text-sm mb-4">
            <Trophy className="w-4 h-4" /> India's #1 Village Competitive Exam Platform
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Prepare Smarter, Score Higher</h1>
          <p className="text-lg md:text-xl text-white/85 mb-8 max-w-2xl mx-auto">
            Expert-curated test series for SSC, Banking, UPSC, Railway & more. Start free or unlock premium.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Instant Results</div>
            <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Answer Explanations</div>
            <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Re-attempt Tests</div>
            <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Performance Analytics</div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 grid grid-cols-3 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: Users, label: 'Students', value: '10,000+' },
            { icon: BookOpen, label: 'Test Series', value: `${series.length}+` },
            { icon: Award, label: 'Questions', value: '5,000+' },
            { icon: Zap, label: 'Free Tests', value: series.filter(s => s.isFree).length + '+' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center">
              <Icon className="w-5 h-5 text-[#6DBE45] mb-1" />
              <div className="font-bold text-lg">{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search test series..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:border-[#6DBE45] transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="border rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#6DBE45] bg-white text-sm"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value)}
                className="border rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#6DBE45] bg-white text-sm"
              >
                {['All', 'Easy', 'Medium', 'Hard'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Showing <span className="font-semibold text-[#2D7A1F]">{filtered.length}</span> test series
          </p>
        </div>

        {/* Series Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl border p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-500">No test series found</h3>
            <p className="text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map(s => (
              <div key={s._id} className="bg-white rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
                {/* Color banner by category */}
                <div className={`h-2 w-full ${s.isFree ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-[#6DBE45] to-[#2D7A1F]'}`} />

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{s.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLORS[s.difficulty] || 'bg-gray-100 text-gray-600'}`}>{s.difficulty}</span>
                      {s.isFree && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">FREE</span>}
                      {hasAccess(s) && isAuthenticated && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Access</span>}
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-2 group-hover:text-[#2D7A1F] transition-colors">{s.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{s.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#6DBE45]" />
                      <span><strong>{s.totalTests}</strong> Tests</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#6DBE45]" />
                      <span><strong>{(s.studentsEnrolled / 1000).toFixed(1)}K</strong> Students</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span><strong>{s.rating}</strong> Rating</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-[#6DBE45]" />
                      <span>Expert Quality</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t">
                    <div>
                      {s.isFree ? (
                        <span className="text-2xl font-bold text-green-600">FREE</span>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-[#2D7A1F]">
                            ₹{s.discountPrice ?? s.price}
                          </span>
                          {s.discountPrice && (
                            <span className="text-sm text-gray-400 line-through">₹{s.price}</span>
                          )}
                        </div>
                      )}
                    </div>
                    {s.discountPrice && !s.isFree && (
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-bold">
                        {Math.round(((s.price - s.discountPrice) / s.price) * 100)}% OFF
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="px-5 pb-5">
                  {hasAccess(s) && isAuthenticated ? (
                    <Link
                      to={`/test-series/series/${s._id}`}
                      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      <CheckCircle className="w-4 h-4" /> View Tests
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  ) : s.isFree ? (
                    <button
                      onClick={() => handleAccess(s)}
                      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#6DBE45] to-[#2D7A1F] text-white py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      <Zap className="w-4 h-4" /> Start for Free
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAccess(s)}
                      disabled={payingId === s._id}
                      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#2D7A1F] to-[#1a3c1a] text-white py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-60"
                    >
                      {payingId === s._id ? 'Processing...' : `Buy Now — ₹${s.discountPrice ?? s.price}`}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
