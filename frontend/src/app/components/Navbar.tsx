import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";

export function Navbar() {
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Government Jobs", path: "/government-jobs" },
    { label: "Results", path: "/results" },
    { label: "Scholarship", path: "/scholarship" },
    { label: "Study Material", path: "/study-material" },
    { label: "Farming Help", path: "/farming-help" },
    { label: "Village Schemes", path: "/village-schemes" },
    { label: "News", path: "/news" },
    { label: "Contact", path: "/contact" }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div>
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-lg overflow-hidden flex items-center justify-center">
                  <img src="/image/logo.jpeg" alt="Village Help Logo" className="w-full h-full object-cover" />
                </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-2 xl:px-3 py-2 rounded-lg transition-all relative text-sm xl:text-base ${
                  location.pathname === item.path
                    ? "bg-[#6DBE45] text-white"
                    : "text-gray-700 hover:text-[#6DBE45]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 hover:bg-gray-100 rounded-full transition-all"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => alert("Login functionality coming soon!")}
              className="bg-gradient-to-r from-[#6DBE45] to-[#2D7A1F] text-white px-4 py-2 md:px-6 md:py-2 text-sm md:text-base rounded-full hover:shadow-lg transition-all whitespace-nowrap"
            >
              Login
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-all ${
                    location.pathname === item.path
                      ? "bg-[#6DBE45] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {showSearch && (
          <div className="mt-4 pb-2">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search jobs, schemes, scholarship..."
                className="w-full pl-12 pr-4 md:pr-24 py-3 border-2 border-gray-200 rounded-xl focus:border-[#6DBE45] focus:outline-none transition-all"
              />
              <button
                onClick={handleSearch}
                className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#6DBE45] to-[#2D7A1F] text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                Search
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
