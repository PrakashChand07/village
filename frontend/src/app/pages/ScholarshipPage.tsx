import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { fetchScholarships, fetchCategories } from "../../services/api";
import { GraduationCap, IndianRupee, Calendar, Users, ExternalLink, Loader2, SearchX, Search } from "lucide-react";

const formatUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};

export function ScholarshipPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetchScholarships({ 
          page,
          category: selectedCategory === "All" ? "" : selectedCategory,
          search: searchQuery
        });
        if (response.success) {
          setScholarships(response.data);
          setTotalPages(response.pages);
        }
      } catch (error) {
        console.error("Failed to fetch scholarships", error);
      } finally {
        setLoading(false);
      }
    };
    
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [page, selectedCategory, searchQuery]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories('scholarship');
        if (response.success) {
          const names = response.data.map((c: any) => c.name);
          setCategories(["All", ...names]);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Scholarship 2026</h1>
              <p className="text-white/90 mt-2">Apply for educational scholarships & financial aid</p>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for scholarships..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    selectedCategory === category
                      ? "bg-orange-600 text-white shadow-lg shadow-orange-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            <p className="text-gray-500 text-lg font-medium">Loading scholarships...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && scholarships.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <SearchX className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700">No Scholarships Found</h3>
            <p className="text-gray-500 text-center max-w-sm">
              {searchQuery ? `No results found for "${searchQuery}"` : "No scholarships available right now. Please check back later."}
            </p>
          </div>
        )}

        {/* Scholarships Table */}
        {!loading && scholarships.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse block md:table">
                <thead className="hidden md:table-header-group">
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-4 sm:px-6 py-4 sm:py-5 text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider">Scholarship Details</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider text-center">Eligibility</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider text-center">Amount</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="block md:table-row-group divide-y divide-transparent md:divide-gray-50 p-4 md:p-0 space-y-4 md:space-y-0 bg-gray-50 md:bg-transparent">
                  {scholarships.map((scholarship, index) => (
                    <tr key={scholarship._id || index} className="block md:table-row bg-white rounded-2xl shadow-sm md:shadow-none p-4 md:p-0 hover:bg-gray-50/50 transition-colors group border border-gray-100 md:border-none">
                      <td className="block md:table-cell px-2 py-2 md:px-6 md:py-5 border-b border-gray-100 md:border-b-0">
                        <div className="md:hidden text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Scholarship Details</div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{scholarship.title}</span>
                            {scholarship.isNewPost && (
                              <span className="bg-[#F4511E] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">NEW</span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                            <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md font-medium">{scholarship.provider}</span>
                            <span className="text-red-500 font-medium">Deadline: {scholarship.deadline}</span>
                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                              <Users className="w-3 h-3" /> {scholarship.applicants} Applied
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="block md:table-cell px-2 py-3 md:px-6 md:py-5 text-sm text-gray-600 font-medium text-left md:text-center border-b border-gray-100 md:border-b-0">
                        <div className="md:hidden text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Eligibility</div>
                        {scholarship.eligibility}
                      </td>
                      <td className="block md:table-cell px-2 py-3 md:px-6 md:py-5 text-left md:text-center border-b border-gray-100 md:border-b-0">
                        <div className="md:hidden text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Amount</div>
                        <span className="bg-green-50 text-green-700 px-4 py-1 rounded-full text-sm font-bold">
                          {scholarship.amount}
                        </span>
                      </td>
                      <td className="block md:table-cell px-2 py-4 md:px-6 md:py-5 text-center">
                        <div className="flex justify-center">
                          <button
                            onClick={() => navigate(`/scholarship/${scholarship._id}`)}
                            className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:from-purple-700 hover:to-violet-700 transition-all whitespace-nowrap"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && scholarships.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-12 pb-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition-all font-bold text-gray-600"
            >
              Prev
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-bold transition-all ${
                  page === i + 1
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition-all font-bold text-gray-600"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
