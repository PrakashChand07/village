import { Newspaper, Clock, TrendingUp, Tag } from "lucide-react";

export function NewsPage() {
  const news = [
    {
      title: "Bihar Government Announces New Scholarship Scheme for Girl Students",
      category: "Education",
      date: "1 May 2026",
      time: "2 hours ago",
      image: "📚",
      excerpt: "Chief Minister announces ₹50,000 scholarship for meritorious girl students pursuing higher education...",
      isTrending: true,
    },
    {
      title: "Railway Recruitment Board Releases 60,000 New Vacancies",
      category: "Jobs",
      date: "1 May 2026",
      time: "5 hours ago",
      image: "🚂",
      excerpt: "RRB announces massive recruitment drive for various posts across India. Application deadline is May 25...",
      isTrending: true,
    },
    {
      title: "PM Kisan 18th Installment to be Released on May 15",
      category: "Agriculture",
      date: "30 Apr 2026",
      time: "1 day ago",
      image: "🌾",
      excerpt: "Government confirms transfer of ₹2000 to farmer accounts. Beneficiaries advised to verify KYC...",
      isTrending: false,
    },
    {
      title: "NEET UG 2026 Result Date Announced by NTA",
      category: "Results",
      date: "30 Apr 2026",
      time: "1 day ago",
      image: "🎓",
      excerpt: "National Testing Agency to declare NEET UG results on May 5. Students can check scores on official website...",
      isTrending: false,
    },
    {
      title: "Bihar Board 10th Result Expected This Week",
      category: "Results",
      date: "29 Apr 2026",
      time: "2 days ago",
      image: "📋",
      excerpt: "BSEB likely to announce Class 10 results by May 3. Over 17 lakh students appeared for the examination...",
      isTrending: true,
    },
    {
      title: "New ITI Admission Process Starts from May 10",
      category: "Education",
      date: "29 Apr 2026",
      time: "2 days ago",
      image: "🏫",
      excerpt: "Online application for ITI courses begins. Students can apply through official portal with required documents...",
      isTrending: false,
    },
    {
      title: "Ayushman Card Registration Drive in Rural Bihar",
      category: "Health",
      date: "28 Apr 2026",
      time: "3 days ago",
      image: "💳",
      excerpt: "Special camps organized in villages for Ayushman Bharat card registration. Free health checkup included...",
      isTrending: false,
    },
    {
      title: "SSC Announces CGL Tier 2 Exam Dates",
      category: "Jobs",
      date: "28 Apr 2026",
      time: "3 days ago",
      image: "📝",
      excerpt: "Staff Selection Commission releases exam calendar for CGL Tier 2. Admit cards to be issued 15 days before exam...",
      isTrending: false,
    },
    {
      title: "Minimum Support Price Increased for Paddy Crops",
      category: "Agriculture",
      date: "27 Apr 2026",
      time: "4 days ago",
      image: "🌱",
      excerpt: "Government raises MSP by 7% for paddy. Farmers to get ₹2,183 per quintal for common variety...",
      isTrending: false,
    },
  ];

  const categories = ["All", "Jobs", "Education", "Agriculture", "Results", "Health"];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Newspaper className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Latest News & Updates</h1>
              <p className="text-white/90 mt-2">Stay updated with rural development & government news</p>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Tag className="w-5 h-5 text-gray-600" />
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => alert(`Filtering by: ${category}`)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 cursor-pointer group"
              onClick={() => alert(`Reading: ${item.title}`)}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="text-6xl">{item.image}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                    {item.isTrending && (
                      <span className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Trending
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.excerpt}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {item.time}
                    </div>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button
            onClick={() => alert("Loading more news...")}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-2xl hover:shadow-lg transition-all"
          >
            Load More News
          </button>
        </div>
      </div>
    </div>
  );
}
