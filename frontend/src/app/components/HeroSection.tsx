import { Search, TrendingUp, Zap, Shield, Calendar, FileText, Briefcase, GraduationCap, Newspaper, BookOpen, Loader2, ChevronRight, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { fetchNews, fetchJobs, fetchResults, fetchScholarships, fetchSchemes, fetchStudyMaterials } from "../../services/api";

export function HeroSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
    }
  };

  const [activeTab, setActiveTab] = useState("Results");
  const [updates, setUpdates] = useState<any[]>([]);
  const [updatesLoading, setUpdatesLoading] = useState(true);

  const quickAccess = [
    { icon: FileText, label: "Results", color: "from-blue-500 to-blue-600", path: "/results" },
    { icon: Calendar, label: "Admit Card", color: "from-purple-500 to-purple-600", path: "/results" },
    { icon: Briefcase, label: "Govt Jobs", color: "from-green-500 to-green-600", path: "/government-jobs" },
    { icon: GraduationCap, label: "Scholarship", color: "from-orange-500 to-orange-600", path: "/scholarship" },
    { icon: BookOpen, label: "Test Series", color: "from-red-500 to-red-600", path: "/study-material" },
    { icon: Newspaper, label: "Sarkari Yojna", color: "from-teal-500 to-teal-600", path: "/news" },
  ];

  useEffect(() => {
    let active = true;
    const loadTabContent = async () => {
      setUpdatesLoading(true);
      try {
        let data: any[] = [];
        if (activeTab === "Results") {
          const res = await fetchResults({ limit: 6 });
          if (res.success) data = res.data || [];
        } else if (activeTab === "Admit Card") {
          const res = await fetchResults({ limit: 15 });
          if (res.success) {
            const all = res.data || [];
            const filtered = all.filter((r: any) => 
              r.category?.toLowerCase() === "admit card" ||
              r.category?.toLowerCase() === "admit" ||
              r.title?.toLowerCase().includes("admit")
            );
            
            if (filtered.length === 0) {
              data = [
                { _id: "mock1", title: "Bihar Police Constable Admit Card 2026", date: "15 May 2026", isNewPost: true, isMock: true, organization: "BSEB" },
                { _id: "mock2", title: "Railway Group D Admit Card 2026", date: "20 May 2026", isNewPost: true, isMock: true, organization: "RRB" },
                { _id: "mock3", title: "SSC GD Constable Admit Card 2026", date: "25 May 2026", isNewPost: false, isMock: true, organization: "SSC" },
                { _id: "mock4", title: "UP Police Constable Admit Card 2026", date: "30 May 2026", isNewPost: false, isMock: true, organization: "UPPRPB" },
                { _id: "mock5", title: "Indian Army Agniveer Admit Card 2026", date: "25 May 2026", isNewPost: true, isMock: true, organization: "Indian Army" },
              ];
            } else {
              data = filtered.slice(0, 6);
            }
          }
        } else if (activeTab === "Govt Jobs") {
          const res = await fetchJobs({ limit: 6 });
          if (res.success) data = res.data || [];
        } else if (activeTab === "Scholarship") {
          const res = await fetchScholarships({ limit: 6 });
          if (res.success) data = res.data || [];
        } else if (activeTab === "Test Series") {
          const res = await fetchStudyMaterials({ limit: 6 });
          if (res.success) data = res.data || [];
        } else if (activeTab === "Sarkari Yojna") {
          const res = await fetchSchemes({ limit: 6 });
          if (res.success) data = res.data || [];
        }

        if (active) {
          setUpdates(data);
        }
      } catch (err) {
        console.error("Failed to load tab content:", err);
        if (active) setUpdates([]);
      } finally {
        if (active) setUpdatesLoading(false);
      }
    };

    loadTabContent();

    return () => {
      active = false;
    };
  }, [activeTab]);

  const getTabStyles = (tab: string) => {
    switch (tab) {
      case "Results":
        return {
          textColor: "text-blue-600",
          borderColor: "border-l-blue-500",
          hoverBg: "hover:bg-blue-50/50",
          btnBg: "from-blue-500 to-blue-600",
          accentColor: "#3B82F6",
        };
      case "Admit Card":
        return {
          textColor: "text-purple-600",
          borderColor: "border-l-purple-500",
          hoverBg: "hover:bg-purple-50/50",
          btnBg: "from-purple-500 to-purple-600",
          accentColor: "#8B5CF6",
        };
      case "Govt Jobs":
        return {
          textColor: "text-green-600",
          borderColor: "border-l-green-500",
          hoverBg: "hover:bg-green-50/50",
          btnBg: "from-[#6DBE45] to-[#2D7A1F]",
          accentColor: "#6DBE45",
        };
      case "Scholarship":
        return {
          textColor: "text-orange-600",
          borderColor: "border-l-orange-500",
          hoverBg: "hover:bg-orange-50/50",
          btnBg: "from-orange-500 to-orange-600",
          accentColor: "#F97316",
        };
      case "Test Series":
        return {
          textColor: "text-red-600",
          borderColor: "border-l-red-500",
          hoverBg: "hover:bg-red-50/50",
          btnBg: "from-red-500 to-red-600",
          accentColor: "#EF4444",
        };
      case "Sarkari Yojna":
        return {
          textColor: "text-teal-600",
          borderColor: "border-l-teal-500",
          hoverBg: "hover:bg-teal-50/50",
          btnBg: "from-teal-500 to-teal-600",
          accentColor: "#14B8A6",
        };
      default:
        return {
          textColor: "text-blue-600",
          borderColor: "border-l-blue-500",
          hoverBg: "hover:bg-blue-50/50",
          btnBg: "from-blue-500 to-blue-600",
          accentColor: "#3B82F6",
        };
    }
  };

  const getItemDetails = (item: any) => {
    switch (activeTab) {
      case "Results":
      case "Admit Card":
        return {
          title: item.title,
          subtext: `${item.organization || ""} ${item.date ? `| Date: ${item.date}` : ""}`,
          link: item.resultLink && item.resultLink !== "#" ? item.resultLink : "",
        };
      case "Govt Jobs":
        return {
          title: item.title,
          subtext: `${item.organization || ""} | Vacancies: ${item.posts || ""} | Last Date: ${item.lastDate || ""}`,
          link: `/government-jobs/${item._id}`,
        };
      case "Scholarship":
        return {
          title: item.title,
          subtext: `${item.provider || ""} | Award: ${item.amount || ""} | Deadline: ${item.deadline || ""}`,
          link: `/scholarship/${item._id}`,
        };
      case "Test Series":
        return {
          title: item.title,
          subtext: `Category: ${item.category || ""} | Downloads: ${item.downloads || 0}`,
          link: `/study-material`,
        };
      case "Sarkari Yojna":
        return {
          title: item.title,
          subtext: `Benefit: ${item.benefit || ""} | Eligibility: ${item.eligibility || ""}`,
          link: `/village-schemes/${item._id}`,
        };
      default:
        return {
          title: item.title || "",
          subtext: item.date || "",
          link: "",
        };
    }
  };

  const handleItemClick = (item: any) => {
    const details = getItemDetails(item);
    
    if (details.link.startsWith("http://") || details.link.startsWith("https://") || details.link.startsWith("www.")) {
      const formatted = details.link.startsWith("www.") ? `https://${details.link}` : details.link;
      window.open(formatted, '_blank', 'noopener,noreferrer');
    } else if (details.link) {
      navigate(details.link);
    } else {
      if (activeTab === "Results" || activeTab === "Admit Card") {
        navigate("/results");
      } else if (activeTab === "Test Series") {
        navigate("/study-material");
      }
    }
  };

  const handleViewMore = () => {
    const activeItem = quickAccess.find(item => item.label === activeTab);
    if (activeItem) {
      navigate(activeItem.path);
    } else {
      navigate("/results");
    }
  };

  const styles = getTabStyles(activeTab);

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
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: styles.accentColor }}></span>
                    Important Updates - {activeTab}
                  </h3>
                  <span className="text-xs text-[#F4511E] font-bold tracking-wider animate-pulse bg-red-50 px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-red-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F4511E]"></span>
                    LIVE
                  </span>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {updatesLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                      <Loader2 className="w-10 h-10 text-[#6DBE45] animate-spin" />
                      <p className="text-sm text-gray-500 font-medium animate-pulse">Fetching latest updates...</p>
                    </div>
                  ) : updates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      <p className="text-center text-sm">No updates available in this category</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {updates.map((item, index) => {
                        const details = getItemDetails(item);
                        const isExternal = details.link.startsWith("http://") || details.link.startsWith("https://") || details.link.startsWith("www.");
                        return (
                          <div
                            key={item._id || index}
                            onClick={() => handleItemClick(item)}
                            className={`p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all cursor-pointer border border-gray-100/80 flex items-start justify-between gap-3 group border-l-4 ${styles.borderColor} ${styles.hoverBg}`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-gray-900 transition-colors">
                                {details.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-2 font-medium">
                                {details.subtext}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 self-center">
                              {item.isNewPost && (
                                <span className="bg-[#F4511E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm shadow-red-200">
                                  NEW
                                </span>
                              )}
                              {isExternal ? (
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleViewMore}
                className={`w-full mt-6 bg-gradient-to-r ${styles.btnBg} text-white py-3 rounded-xl hover:shadow-xl transition-all font-bold text-sm shadow-md flex items-center justify-center gap-2`}
              >
                View All {activeTab}
              </button>
            </div>
          </div>

          {/* Quick Access Sidebar */}
          <div className="lg:col-span-2 order-3 lg:order-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-col gap-3 h-full">
              {quickAccess.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(item.label)}
                  className={`w-full bg-gradient-to-br ${item.color} text-white p-3 lg:p-4 rounded-xl shadow-md transition-all flex flex-col items-center justify-center gap-2 h-full min-h-[100px] lg:min-h-0 border-2 ${
                    activeTab === item.label
                      ? "scale-105 shadow-xl border-white ring-4 ring-offset-2 ring-gray-300 z-10"
                      : "opacity-75 hover:opacity-100 scale-95 saturate-[0.85] hover:saturate-100 border-transparent hover:scale-100"
                  }`}
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
