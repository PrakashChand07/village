import { BookOpen, Download, FileText, Video, PenTool } from "lucide-react";

export function StudyMaterialPage() {
  const materials = [
    {
      title: "SSC CGL Previous Year Papers (2015-2025)",
      type: "PDF",
      subject: "All Subjects",
      size: "25 MB",
      downloads: "15,000+",
      icon: FileText,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Bihar Board 12th Physics Notes",
      type: "PDF",
      subject: "Physics",
      size: "10 MB",
      downloads: "8,500+",
      icon: BookOpen,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Railway Group D Mock Test Series",
      type: "Online Test",
      subject: "All Subjects",
      size: "Online",
      downloads: "20,000+",
      icon: PenTool,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "NEET Biology Video Lectures",
      type: "Video",
      subject: "Biology",
      size: "2 GB",
      downloads: "12,000+",
      icon: Video,
      color: "from-red-500 to-red-600",
    },
    {
      title: "UPSC Prelims Previous Papers (Last 10 Years)",
      type: "PDF",
      subject: "GS + CSAT",
      size: "30 MB",
      downloads: "18,000+",
      icon: FileText,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Mathematics Formula Sheet (Class 10-12)",
      type: "PDF",
      subject: "Mathematics",
      size: "5 MB",
      downloads: "25,000+",
      icon: BookOpen,
      color: "from-teal-500 to-teal-600",
    },
  ];

  const categories = [
    { name: "Previous Papers", count: "500+", icon: FileText },
    { name: "Video Lectures", count: "1000+", icon: Video },
    { name: "Mock Tests", count: "300+", icon: PenTool },
    { name: "Study Notes", count: "800+", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Study Material</h1>
              <p className="text-white/90 mt-2">Free notes, papers & mock tests</p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => alert(`Browsing ${category.name}`)}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 group"
            >
              <category.icon className="w-12 h-12 text-[#6DBE45] mb-3 mx-auto group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-gray-800 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.count} resources</p>
            </button>
          ))}
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${material.color} rounded-xl flex items-center justify-center mb-4`}>
                <material.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-3">{material.title}</h3>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-semibold text-gray-800">{material.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subject:</span>
                  <span className="font-semibold text-gray-800">{material.subject}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-semibold text-gray-800">{material.size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Downloads:</span>
                  <span className="font-semibold text-green-600">{material.downloads}</span>
                </div>
              </div>

              <button
                onClick={() => alert(`Downloading: ${material.title}`)}
                className={`w-full bg-gradient-to-r ${material.color} text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2`}
              >
                <Download className="w-5 h-5" />
                Download Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
