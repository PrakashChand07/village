import { Search, TrendingUp, Zap, Shield, Calendar, FileText, Briefcase, GraduationCap, Newspaper, BookOpen, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { fetchNews } from "../../services/api";

export function HeroSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const trendingTags = ["PM Kisan", "Railway Jobs", "SSC", "NEET Result", "Scholarship 2026"];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
    }
  };

  const [updates, setUpdates] = useState<any[]>([]);
  const [updatesLoading, setUpdatesLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetchNews({ limit: 5, page: 1 });
        if (response.success) setUpdates(response.data || []);
      } catch {
        setUpdates([]);
      } finally {
        setUpdatesLoading(false);
      }
    };
    loadNews();
  }, []);

  const quickAccess = [
    { icon: FileText, label: "Results", color: "from-blue-500 to-blue-600", path: "/results" },
    { icon: Calendar, label: "Admit Card", color: "from-purple-500 to-purple-600", path: "/results" },
    { icon: Briefcase, label: "Govt Jobs", color: "from-green-500 to-green-600", path: "/government-jobs" },
    { icon: GraduationCap, label: "Scholarship", color: "from-orange-500 to-orange-600", path: "/scholarship" },
    { icon: BookOpen, label: "Test Series", color: "from-red-500 to-red-600", path: "/study-material" },
    { icon: Newspaper, label: "Sarkari Yojna", color: "from-teal-500 to-teal-600", path: "/news" },
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#6DBE45]/10 via-[#F4511E]/5 to-[#2D7A1F]/10"></div>

      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-12 relative">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
          {/* Main Hero Content - Moved to top on mobile */}
          <div className="lg:col-span-4 order-1 lg:order-3">
            <div className="bg-white rounded-3xl shadow-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#6DBE45]/20 to-transparent rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div>
                    <h1 className="text-2xl text-gray-800" style={{ fontFamily: 'Mukta, sans-serif' }}>
                      गांव की हर समस्या का डिजिटल समाधान
                    </h1>
                    <p className="text-gray-600 mt-2 text-sm">
                      सरकारी योजना, नौकरी, खेती, स्कॉलरशिप और डिजिटल सेवाएं एक ही प्लेटफॉर्म पर।
                    </p>
                  </div>
                </div>

                <div className="mt-6 lg:mt-8">
                  {/* <div className="relative flex flex-col sm:flex-row gap-2 sm:gap-0">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search.."
                        className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl sm:rounded-r-none focus:border-[#6DBE45] focus:outline-none transition-all"
                      />
                    </div>
                    <button
                      onClick={handleSearch}
                      className="bg-gradient-to-r from-[#6DBE45] to-[#2D7A1F] text-white px-6 py-3 sm:py-4 rounded-xl sm:rounded-l-none hover:shadow-lg transition-all whitespace-nowrap"
                    >
                      Search
                    </button>
                  </div> */}

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-4">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-[#F4511E]" />
                      <span className="text-sm text-gray-600 whitespace-nowrap">Trending:</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {trendingTags.map((tag, index) => (
                        <button
                          key={index}
                          className="text-xs bg-gray-100 hover:bg-[#6DBE45] hover:text-white px-3 py-1 rounded-full transition-all"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 lg:mt-8">
                  <div className="bg-gradient-to-br from-[#6DBE45]/10 to-[#6DBE45]/5 p-4 rounded-xl border border-[#6DBE45]/20">
                    <Zap className="w-8 h-8 text-[#6DBE45] mb-2" />
                    <h3 className="font-semibold text-gray-800">Fast Updates</h3>
                    <p className="text-xs text-gray-600 mt-1">Real-time notifications</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#2D7A1F]/10 to-[#2D7A1F]/5 p-4 rounded-xl border border-[#2D7A1F]/20">
                    <GraduationCap className="w-8 h-8 text-[#2D7A1F] mb-2" />
                    <h3 className="font-semibold text-gray-800">Village Support</h3>
                    <p className="text-xs text-gray-600 mt-1">24/7 assistance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Updates Panel */}
          <div className="lg:col-span-6 order-2 lg:order-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Important Updates</h3>
                <span className="text-xs text-[#F4511E] animate-pulse">● LIVE</span>
              </div>

              <div className="space-y-3">
                {updatesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 text-[#6DBE45] animate-spin" />
                  </div>
                ) : updates.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-6">No updates available</p>
                ) : (
                  updates.map((update, index) => (
                    <div
                      key={update._id || index}
                      onClick={() => navigate(`/news/${update._id}`)}
                      className="p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all cursor-pointer border border-gray-100"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 line-clamp-2">{update.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{update.date}</p>
                        </div>
                        {update.isNewPost && (
                          <span className="bg-[#F4511E] text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                            NEW
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => navigate("/news")}
                className="w-full mt-4 bg-gradient-to-r from-[#6DBE45] to-[#2D7A1F] text-white py-2 rounded-xl hover:shadow-lg transition-all"
              >
                View More
              </button>
            </div>
          </div>

          {/* Quick Access Sidebar */}
          <div className="lg:col-span-2 order-3 lg:order-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-col gap-3 h-full">
              {quickAccess.map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`w-full bg-gradient-to-br ${item.color} text-white p-3 lg:p-4 rounded-xl hover:shadow-lg transition-all hover:scale-105 flex flex-col items-center justify-center gap-2 h-full min-h-[100px] lg:min-h-0`}
                >
                  <item.icon className="w-5 h-5 lg:w-6 lg:h-6" />
                  <span className="text-xs lg:text-sm font-medium text-center">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
