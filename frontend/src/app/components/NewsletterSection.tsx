import { Mail, Send } from "lucide-react";
import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email.trim() && email.includes("@")) {
      alert(`Thank you! You've subscribed with: ${email}`);
      setEmail("");
    } else {
      alert("Please enter a valid email address");
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-[#F4511E] to-[#ff6b3d] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
        <div className="inline-block p-4 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
          <Mail className="w-12 h-12 text-white" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Stay Updated with Latest News
        </h2>
        <p className="text-white/90 text-sm sm:text-lg mb-8">
          Subscribe to get notifications about jobs, schemes, and important updates
        </p>

        <div className="max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 bg-white/20 backdrop-blur-xl p-2 rounded-2xl border border-white/30">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubscribe()}
              placeholder="Enter your email address"
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-white rounded-xl focus:outline-none text-gray-800 placeholder-gray-500"
            />
            <button
              onClick={handleSubscribe}
              className="bg-[#2D7A1F] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-[#1f5515] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Send className="w-5 h-5" />
              Subscribe
            </button>
          </div>
          <p className="text-white/80 text-xs sm:text-sm mt-4">
            Join 10,000+ subscribers. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
