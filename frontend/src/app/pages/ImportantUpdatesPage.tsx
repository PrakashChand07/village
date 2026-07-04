import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { fetchImportantUpdates } from "../../services/api";
import { Zap, ExternalLink, Loader2, SearchX, Search, Calendar, Briefcase, FileText, GraduationCap, Shield, BookOpen, ChevronRight, Newspaper } from "lucide-react";

export function ImportantUpdatesPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const TYPES = [
    { value: "All", label: "All Updates" },
    { value: "job", label: "Govt Jobs" },
    { value: "result", label: "Results" },
    { value: "scholarship", label: "Scholarships" },
    { value: "scheme", label: "Schemes" },
    { value: "study-material", label: "Study Notes" },
    { value: "test-series", label: "Test Series" },
    { value: "news", label: "News" },
  ];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetchImportantUpdates({
          page,
          limit: 10,
        });
        if (response.success) {
          // Client-side filtering by type and search for combined flexibility
          let filtered = response.data || [];
          if (selectedType !== "All") {
            filtered = filtered.filter((item: any) => item.type === selectedType);
          }
          if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((item: any) =>
              item.title.toLowerCase().includes(query)
            );
          }
          setUpdates(filtered);
          // Recalculate total pages based on local filtering for simplicity
          setTotalPages(Math.max(1, Math.ceil(filtered.length / 10)));
        }
      } catch (error) {
        console.error("Failed to fetch important updates", error);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [page, selectedType, searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [selectedType, searchQuery]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, selectedType, searchQuery]);

  const getIconForType = (type: string) => {
    switch (type) {
      case "job": return Briefcase;
      case "result": return FileText;
      case "scholarship": return GraduationCap;
      case "scheme": return Shield;
      case "study-material": return BookOpen;
      case "test-series": return Calendar;
      default: return Newspaper;
    }
  };

  const getThemeForType = (type: string) => {
    switch (type) {
      case "job":
        return {
          bg: "bg-green-50 text-green-700 border-green-100",
          border: "border-l-green-500",
          iconColor: "text-green-600",
          label: "Govt Job",
        };
      case "result":
        return {
          bg: "bg-purple-50 text-purple-700 border-purple-100",
          border: "border-l-purple-500",
          iconColor: "text-purple-600",
          label: "Result",
        };
      case "scholarship":
        return {
          bg: "bg-orange-50 text-orange-700 border-orange-100",
          border: "border-l-orange-500",
          iconColor: "text-orange-600",
          label: "Scholarship",
        };
      case "scheme":
        return {
          bg: "bg-teal-50 text-teal-700 border-teal-100",
          border: "border-l-teal-500",
          iconColor: "text-teal-600",
          label: "Village Scheme",
        };
      case "study-material":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-100",
          border: "border-l-blue-500",
          iconColor: "text-blue-600",
          label: "Study Notes",
        };
      case "test-series":
        return {
          bg: "bg-red-50 text-red-700 border-red-100",
          border: "border-l-red-500",
          iconColor: "text-red-600",
          label: "Test Series",
        };
      default:
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
          border: "border-l-emerald-500",
          iconColor: "text-emerald-600",
          label: "News Update",
        };
    }
  };

  const handleUpdateClick = (update: any) => {
    if (!update.slug) return;
    if (update.slug.startsWith("http")) {
      window.open(update.slug, "_blank", "noopener,noreferrer");
    } else {
      navigate(update.slug);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6DBE45] to-[#2D7A1F] text-white rounded-3xl md:p-8 p-4 mb-4 md:mb-8 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-pulse">
              <Zap className="w-8 h-8 text-white fill-white/10" />
            </div>
            <div>
              <h1 className="text-xl md:text-4xl font-bold">Important Updates</h1>
              <p className="text-white/90 mt-2 text-sm md:text-xl">Latest government announcements, news, admit cards, and job alerts</p>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-6 md:mb-8 mb-4">
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg md:p-6 p-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search updates..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#6DBE45] focus:outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg md:p-6 p-2 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedType === type.value
                      ? "bg-[#6DBE45] text-white shadow-lg shadow-green-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-12 h-12 text-[#6DBE45] animate-spin" />
            <p className="text-gray-500 text-lg font-medium">Loading updates...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && updates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <SearchX className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700">No Updates Found</h3>
            <p className="text-gray-500 text-center max-w-sm">
              {searchQuery ? `No updates found for "${searchQuery}"` : "No important updates are currently available."}
            </p>
          </div>
        )}

        {/* Updates list */}
        {!loading && updates.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {updates.map((update, index) => {
              const Icon = getIconForType(update.type);
              const theme = getThemeForType(update.type);

              return (
                <div
                  key={update._id || index}
                  onClick={() => handleUpdateClick(update)}
                  className={`bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 ${theme.border} group`}
                >
                  <div className="flex items-start md:items-center gap-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${theme.bg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${theme.bg}`}>
                          {theme.label}
                        </span>
                        {update.isNewPost && (
                          <span className="bg-[#F4511E] text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                            NEW
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-800 text-base md:text-lg group-hover:text-[#6DBE45] transition-colors leading-snug">
                        {update.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5 text-[#F4511E]" />
                        <span>Posted on: {update.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end md:justify-center flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateClick(update);
                      }}
                      className="flex items-center gap-1.5 bg-gray-50 hover:bg-[#6DBE45] text-gray-600 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all group-hover:bg-[#6DBE45] group-hover:text-white border border-gray-100 group-hover:border-transparent whitespace-nowrap"
                    >
                      View Details
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && updates.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 pb-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition-all font-bold text-sm text-gray-600"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                  page === i + 1
                    ? "bg-gradient-to-r from-[#6DBE45] to-[#2D7A1F] text-white shadow-lg shadow-green-100"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition-all font-bold text-sm text-gray-600"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
