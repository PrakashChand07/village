import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { fetchSchemes, fetchCategories } from "../../services/api";
import { Building, CreditCard, Heart, Home, Lightbulb, Users, Wallet, ExternalLink, Loader2, SearchX, Search } from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Housing: Home, Health: Heart, Food: CreditCard, Energy: Lightbulb,
  Pension: Wallet, Employment: Users, Infrastructure: Building,
  Sanitation: Home, Agriculture: Users, Other: Building,
};

const COLOR_MAP: Record<string, string> = {
  Housing: "from-blue-500 to-blue-600", Health: "from-red-500 to-red-600",
  Food: "from-green-500 to-green-600", Energy: "from-orange-500 to-orange-600",
  Pension: "from-purple-500 to-purple-600", Employment: "from-teal-500 to-teal-600",
  Infrastructure: "from-indigo-500 to-indigo-600", Sanitation: "from-pink-500 to-pink-600",
  Agriculture: "from-lime-500 to-lime-600", Other: "from-gray-500 to-gray-600",
};

const formatUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};

export function VillageSchemes() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetchSchemes({ 
          page,
          category: selectedCategory === "All" ? "" : selectedCategory,
          search: searchQuery
        });
        if (response.success) {
          setSchemes(response.data);
          setTotalPages(response.pages);
        }
      } catch (error) {
        console.error("Failed to fetch schemes", error);
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
        const response = await fetchCategories('scheme');
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
        <div className="bg-gradient-to-r from-[#2D7A1F] to-[#6DBE45] text-white rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Building className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold" style={{ fontFamily: 'Mukta, sans-serif' }}>
                ग्रामीण योजनाएं
              </h1>
              <p className="text-white/90 mt-2">Government welfare schemes for villages</p>
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
                placeholder="Search for schemes..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#2D7A1F] focus:outline-none transition-all"
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
                      ? "bg-gradient-to-r from-[#2D7A1F] to-[#6DBE45] text-white shadow-lg"
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
            <Loader2 className="w-12 h-12 text-[#6DBE45] animate-spin" />
            <p className="text-gray-500 text-lg font-medium">Loading schemes...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && schemes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <SearchX className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700">No Schemes Found</h3>
            <p className="text-gray-500 text-center max-w-sm">
              {searchQuery ? `No results found for "${searchQuery}"` : "No government schemes available right now. Check back soon."}
            </p>
          </div>
        )}

        {/* Schemes Table */}
        {!loading && schemes.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse block md:table">
                <thead className="hidden md:table-header-group">
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-4 sm:px-6 py-4 sm:py-5 text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider">Scheme Details</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider">Benefit</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="block md:table-row-group divide-y divide-transparent md:divide-gray-50 p-4 md:p-0 space-y-4 md:space-y-0 bg-gray-50 md:bg-transparent">
                  {schemes.map((scheme, index) => {
                    const color = COLOR_MAP[scheme.category] || "from-gray-500 to-gray-600";
                    return (
                      <tr key={scheme._id || index} className="block md:table-row bg-white rounded-2xl shadow-sm md:shadow-none p-4 md:p-0 hover:bg-gray-50/50 transition-colors group border border-gray-100 md:border-none">
                        <td className="block md:table-cell px-2 py-2 md:px-6 md:py-5 border-b border-gray-100 md:border-b-0">
                          <div className="md:hidden text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Scheme Details</div>
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-gray-900 group-hover:text-[#2D7A1F] transition-colors">{scheme.title}</span>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                              <span className={`bg-gradient-to-r ${color} bg-clip-text text-transparent font-bold uppercase`}>{scheme.category}</span>
                              <span className="hidden md:inline-block w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span className="truncate max-w-full md:max-w-[200px]">{scheme.description}</span>
                            </div>
                          </div>
                        </td>
                        <td className="block md:table-cell px-2 py-3 md:px-6 md:py-5 border-b border-gray-100 md:border-b-0">
                          <div className="md:hidden text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Benefit</div>
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-green-700">{scheme.benefit}</span>
                            <span className="text-[11px] text-gray-500">Eligibility: {scheme.eligibility}</span>
                          </div>
                        </td>
                        <td className="block md:table-cell px-2 py-4 md:px-6 md:py-5 text-center">
                          <div className="flex justify-center">
                            <button
                              onClick={() => navigate(`/village-schemes/${scheme._id}`)}
                              className="w-full md:w-auto bg-gradient-to-r from-green-600 to-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:from-green-700 hover:to-teal-700 transition-all whitespace-nowrap"
                            >
                              View Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && schemes.length > 0 && (
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
                    ? "bg-gradient-to-r from-[#2D7A1F] to-[#6DBE45] text-white shadow-lg"
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
