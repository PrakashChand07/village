import { Sprout, CreditCard, Heart, Wallet, FileEdit, Building } from "lucide-react";

export function RuralServicesSection() {
  const services = [
    {
      icon: Sprout,
      title: "PM Kisan Yojana",
      description: "Check status, register & get ₹6000 annually",
      color: "bg-gradient-to-br from-green-500 to-green-600",
    },
    {
      icon: CreditCard,
      title: "Ration Card",
      description: "Apply online, download & update ration card",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      icon: Heart,
      title: "Ayushman Card",
      description: "Get free health insurance up to ₹5 lakh",
      color: "bg-gradient-to-br from-red-500 to-red-600",
    },
    {
      icon: Wallet,
      title: "Pension Services",
      description: "Old age, widow & disability pension schemes",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
    {
      icon: FileEdit,
      title: "Online Form Fillup",
      description: "Govt forms, applications & document services",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
    },
    {
      icon: Building,
      title: "CSC Services",
      description: "Banking, insurance & govt certificate services",
      color: "bg-gradient-to-br from-teal-500 to-teal-600",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Mukta, sans-serif' }}>
            ग्रामीण सेवाएं
          </h2>
          <p className="text-gray-600">Essential government services for villages</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100 group"
            >
              <div className={`w-16 h-16 ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <service.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              <button
                onClick={() => alert(`Opening: ${service.title}`)}
                className="text-[#6DBE45] font-medium text-sm hover:underline"
              >
                Learn More →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
