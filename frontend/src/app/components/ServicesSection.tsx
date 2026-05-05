import { Briefcase, GraduationCap, BookOpen, Tractor, FileCheck, Calendar } from "lucide-react";
import { useNavigate } from "react-router";

export function ServicesSection() {
  const navigate = useNavigate();

  const services = [
    {
      icon: Briefcase,
      title: "Government Jobs",
      description: "Latest central & state govt job notifications, exam dates & results",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      path: "/government-jobs",
    },
    {
      icon: GraduationCap,
      title: "Scholarship",
      description: "Apply for scholarships, track status & get updates on schemes",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      path: "/scholarship",
    },
    {
      icon: BookOpen,
      title: "Study Material",
      description: "Free notes, mock tests, previous papers for all exams",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      path: "/study-material",
    },
    {
      icon: Tractor,
      title: "Farming Assistance",
      description: "Weather updates, crop prices, farming schemes & expert advice",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      path: "/farming-help",
    },
    {
      icon: FileCheck,
      title: "Online Services",
      description: "Digital forms, certificates, bill payments & CSC services",
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100",
      path: "/village-schemes",
    },
    {
      icon: Calendar,
      title: "Exam Calendar",
      description: "Complete exam schedule with registration dates & deadlines",
      color: "from-teal-500 to-teal-600",
      bgColor: "from-teal-50 to-teal-100",
      path: "/results",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
          <p className="text-gray-600">Complete digital solutions for rural India</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${service.bgColor} p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-gray-100 group`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <service.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600 text-sm mb-6">{service.description}</p>
              <button
                onClick={() => navigate(service.path)}
                className={`bg-gradient-to-r ${service.color} text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all`}
              >
                Explore Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
