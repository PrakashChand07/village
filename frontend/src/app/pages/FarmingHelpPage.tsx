import { Tractor, Cloud, TrendingUp, Sprout, Phone, IndianRupee } from "lucide-react";

export function FarmingHelpPage() {
  const services = [
    {
      title: "Weather Forecast",
      description: "7-day weather prediction for Bihar",
      icon: Cloud,
      color: "from-blue-500 to-blue-600",
      action: "Check Weather",
    },
    {
      title: "Crop Prices",
      description: "Latest mandi rates & market trends",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      action: "View Prices",
    },
    {
      title: "Farming Schemes",
      description: "Government schemes for farmers",
      icon: Sprout,
      color: "from-orange-500 to-orange-600",
      action: "Explore Schemes",
    },
    {
      title: "Expert Advice",
      description: "Free consultation with agriculture experts",
      icon: Phone,
      color: "from-purple-500 to-purple-600",
      action: "Call Expert",
    },
  ];

  const schemes = [
    {
      name: "PM Kisan Samman Nidhi",
      benefit: "₹6,000 per year",
      description: "Direct income support to farmers",
      status: "Active",
    },
    {
      name: "Pradhan Mantri Fasal Bima Yojana",
      benefit: "Crop Insurance",
      description: "Insurance coverage for crop loss",
      status: "Active",
    },
    {
      name: "Soil Health Card Scheme",
      benefit: "Free Testing",
      description: "Get your soil tested for free",
      status: "Active",
    },
    {
      name: "Kisan Credit Card",
      benefit: "Low Interest Loan",
      description: "Credit facility for farmers at 4% interest",
      status: "Active",
    },
  ];

  const cropPrices = [
    { crop: "Paddy (धान)", price: "₹2,040/quintal", change: "+2.5%", trend: "up" },
    { crop: "Wheat (गेहूं)", price: "₹2,125/quintal", change: "+1.8%", trend: "up" },
    { crop: "Maize (मक्का)", price: "₹1,870/quintal", change: "-0.5%", trend: "down" },
    { crop: "Sugarcane (गन्ना)", price: "₹315/quintal", change: "+3.2%", trend: "up" },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6DBE45] to-[#2D7A1F] text-white rounded-3xl md:p-8 p-4 mb-4 md:mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Tractor className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-4xl font-bold" style={{ fontFamily: 'Mukta, sans-serif' }}>
                किसान सहायता
              </h1>
              <p className="text-white/90 mt-2 text-sm md:text-xl">Farming assistance & agricultural support</p>
            </div>
          </div>
        </div>

        {/* Quick Services */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 group cursor-pointer"
              onClick={() => alert(`Opening: ${service.title}`)}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <service.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{service.description}</p>
              <button className={`w-full bg-gradient-to-r ${service.color} text-white px-4 py-2 rounded-lg text-sm hover:shadow-lg transition-all`}>
                {service.action}
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Today's Crop Prices */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Today's Crop Prices</h2>
              <span className="text-sm text-gray-600">Updated: 1 May 2026</span>
            </div>
            <div className="space-y-4">
              {cropPrices.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                  <div>
                    <h3 className="font-bold text-gray-800">{item.crop}</h3>
                    <p className="text-sm text-gray-600">Minimum Support Price</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-800">{item.price}</p>
                    <p className={`text-sm ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.change} {item.trend === 'up' ? '↑' : '↓'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => alert("Viewing all crop prices...")}
              className="w-full mt-4 bg-gradient-to-r from-[#6DBE45] to-[#2D7A1F] text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all"
            >
              View All Prices
            </button>
          </div>

          {/* Farming Schemes */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Farming Schemes</h2>
            <div className="space-y-4">
              {schemes.map((scheme, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => alert(`Opening: ${scheme.name}`)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sprout className="w-4 h-4 text-[#6DBE45]" />
                    <h3 className="font-bold text-gray-800 text-sm">{scheme.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <IndianRupee className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">{scheme.benefit}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{scheme.description}</p>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                    {scheme.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
