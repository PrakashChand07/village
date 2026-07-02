import { useState, useEffect } from "react";
import { BookOpen, Download, FileText, Video, PenTool, Search } from "lucide-react";
import { fetchStudyMaterials, API_URL } from "../../services/api";

export function StudyMaterialPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "All", icon: BookOpen },
    { name: "Previous Paper", icon: FileText },
    { name: "Mock Test Paper", icon: PenTool },
    { name: "Study Notes", icon: BookOpen },
  ];

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadMaterials();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [activeCategory, searchQuery]);

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (activeCategory !== "All") {
        params.category = activeCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      
      const res = await fetchStudyMaterials(params);
      setMaterials(res.data || []);
    } catch (error) {
      console.error("Error loading study materials:", error);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  const getIconForCategory = (category) => {
    switch(category) {
      case 'Previous Paper': return FileText;
      case 'Mock Test Paper': return PenTool;
      case 'Study Notes': return BookOpen;
      default: return FileText;
    }
  };

  const getColorForCategory = (category) => {
    switch(category) {
      case 'Previous Paper': return "from-blue-500 to-blue-600";
      case 'Mock Test Paper': return "from-purple-500 to-purple-600";
      case 'Study Notes': return "from-green-500 to-green-600";
      default: return "from-teal-500 to-teal-600";
    }
  };

  const handleDownload = (id) => {
    window.location.href = `${API_URL}/study-materials/${id}/download`;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-3xl md:p-8 p-4 mb-4 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-4xl font-bold">Study Material</h1>
                <p className="text-white/90 mt-2 text-sm md:text-xl">Free notes, papers & mock tests</p>
              </div>
            </div>
            
            <div className="relative w-full md:w-96 text-gray-800">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search materials..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-white/50 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-4 mb-8 pb-2 hide-scrollbar">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <button
                key={index}
                onClick={() => setActiveCategory(category.name)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                  activeCategory === category.name
                    ? "bg-[#6DBE45] text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <Icon className="w-5 h-5" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Materials Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6DBE45]"></div>
          </div>
        ) : materials.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600">No materials found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material: any) => {
              const Icon = getIconForCategory(material.category);
              const colorClass = getColorForCategory(material.category);
              
              return (
                <div
                  key={material._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 flex flex-col h-full"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                        {material.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2" title={material.title}>
                      {material.title}
                    </h3>

                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subject:</span>
                        <span className="font-semibold text-gray-800 truncate max-w-[120px]" title={material.subject}>{material.subject}</span>
                      </div>
                      {material.fileSize && material.fileSize !== '0 MB' && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Size:</span>
                          <span className="font-semibold text-gray-800">{material.fileSize}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Downloads:</span>
                        <span className="font-semibold text-green-600">{material.downloads}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(material._id)}
                    className={`w-full mt-auto bg-gradient-to-r ${colorClass} text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold`}
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
