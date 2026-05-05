import { Smartphone, Bell, Download, Star } from "lucide-react";

export function AppDownloadSection() {
  const features = [
    "Instant job alerts & notifications",
    "Offline access to study material",
    "Track your applications",
    "Multilingual support (Hindi, English)",
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-[#6DBE45] via-[#2D7A1F] to-[#6DBE45] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
              <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
              <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
              <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
              <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
              <span className="text-white ml-2">4.8/5 (2.5K reviews)</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Download Village Help App
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Get all rural services & updates on your mobile. Available for Android devices.
            </p>

            <div className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white">✓</span>
                  </div>
                  <span className="text-white text-sm sm:text-base">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => alert("Redirecting to Play Store...")}
              className="bg-white text-[#2D7A1F] px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold hover:shadow-2xl transition-all flex items-center gap-3 group"
            >
              <Download className="w-6 h-6 group-hover:animate-bounce" />
              Download on Play Store
            </button>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="w-64 sm:w-80 h-[450px] sm:h-[600px] bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-[3rem] border-8 border-white/30 shadow-2xl mx-auto p-8 flex items-center justify-center">
              <div className="text-center">
                <Smartphone className="w-24 h-24 sm:w-32 sm:h-32 text-white mx-auto mb-6 opacity-50" />
                <Bell className="w-12 h-12 sm:w-16 sm:h-16 text-white mx-auto animate-pulse" />
                <p className="text-white mt-4 text-sm">App Mockup Preview</p>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-bounce">
              <Bell className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
