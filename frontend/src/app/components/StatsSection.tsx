import { Users, Briefcase, Award, Download } from "lucide-react";

export function StatsSection() {
  const stats = [
    { icon: Users, value: "50K+", label: "Students", color: "text-[#6DBE45]" },
    { icon: Briefcase, value: "10K+", label: "Jobs Posted", color: "text-[#F4511E]" },
    { icon: Award, value: "5K+", label: "Schemes", color: "text-[#2D7A1F]" },
    { icon: Download, value: "20K+", label: "Downloads", color: "text-blue-600" },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-[#2D7A1F] to-[#6DBE45] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h3 className="text-3xl sm:text-5xl font-bold text-white mb-2">{stat.value}</h3>
              <p className="text-white/90 text-sm sm:text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
