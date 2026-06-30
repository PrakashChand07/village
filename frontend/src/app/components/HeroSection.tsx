import { Search, TrendingUp, Zap, Shield, Calendar, FileText, Briefcase, GraduationCap, Newspaper, BookOpen, Loader2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { fetchNews } from "../../services/api";

export function HeroSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

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
        const response = await fetchNews({ limit: 8, page: 1 });
        if (response.success) {
          setUpdates(response.data || []);
        }
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
    { icon: BookOpen, label: "Test Series", color: "from-red-500 to-red-600", path: "/test-series" },
    { icon: Newspaper, label: "Sarkari Yojna", color: "from-teal-500 to-teal-600", path: "/news" },
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#6DBE45]/10 via-[#F4511E]/5 to-[#2D7A1F]/10"></div>

      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-12 relative">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">

          {/* Important Updates Panel */}
          <div className="lg:col-span-10 order-2 lg:order-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6DBE45]"></span>
                    Important Updates
                  </h3>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {updatesLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                      <Loader2 className="w-10 h-10 text-[#6DBE45] animate-spin" />
                      <p className="text-sm text-gray-500 font-medium animate-pulse">Fetching latest updates...</p>
                    </div>
                  ) : updates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      <p className="text-center text-sm">No updates available</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {updates.map((update, index) => (
                        <div
                          key={update._id || index}
                          onClick={() => navigate(`/news/${update._id}`)}
                          className="p-3.5 bg-gradient-to-r from-gray-50/50 to-white rounded-xl hover:shadow-md transition-all cursor-pointer border border-gray-100 flex items-center justify-between gap-4 group border-l-4 border-l-[#6DBE45] hover:bg-green-50/10 hover:border-green-100"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#6DBE45]/10 transition-colors">
                              <Newspaper className="w-4 h-4 text-[#6DBE45]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-gray-900 transition-colors">
                                {update.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                                <Calendar className="w-3 h-3 text-[#F4511E]" />
                                <span>{update.date}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {update.isNewPost && (
                              <span className="bg-[#F4511E] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm shadow-red-200">
                                NEW
                              </span>
                            )}
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-gray-600 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => navigate("/news")}
                className="w-full mt-6 bg-gradient-to-r from-[#6DBE45] to-[#2D7A1F] text-white py-3 rounded-xl hover:shadow-xl transition-all font-bold text-sm shadow-md flex items-center justify-center gap-2"
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
                  className={`w-full bg-gradient-to-br ${item.color} text-white p-3 lg:p-4 rounded-xl shadow-md transition-all flex flex-col items-center justify-center gap-2 h-full min-h-[100px] lg:min-h-0 hover:scale-105 hover:shadow-lg`}
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
