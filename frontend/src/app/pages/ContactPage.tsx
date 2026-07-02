import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Youtube, MessageCircle } from "lucide-react";
import { useState } from "react";
import { submitContact } from "../../services/api";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    // Validation: Name, Message are required, and either Email or Phone must be present
    if (!formData.name || !formData.message || (!formData.email && !formData.phone)) {
      setStatus({
        type: "error",
        message: "Please provide your Name, Message, and at least one contact method (Email or Phone).",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await submitContact(formData);
      if (response.success) {
        setStatus({ type: "success", message: "Message sent successfully! We will get back to you soon." });
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus({ type: "error", message: response.message || "Something went wrong. Please try again." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Failed to send message. Please try again later." });
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+91 8789015932", "Mon-Sat, 9 AM - 6 PM"],
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["support@villagehelp.in", "info@villagehelp.in"],
      color: "from-green-500 to-green-600",
    },
    {
      icon: MapPin,
      title: "Address",
      details: ["Ghorasahan East Champaran", "Bihar, India"],
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6DBE45] to-[#2D7A1F] text-white rounded-3xl md:p-8 p-4 mb-4 md:mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-4xl font-bold">Contact Us</h1>
              <p className="text-white/90 mt-2 text-sm md:text-xl">Get in touch with our support team</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center mb-4`}>
                <info.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-3">{info.title}</h3>
              {info.details.map((detail, idx) => (
                <p key={idx} className="text-gray-600 text-sm">
                  {detail}
                </p>
              ))}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Contact Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#6DBE45] focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#6DBE45] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#6DBE45] focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Subject of inquiry"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#6DBE45] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message here..."
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#6DBE45] focus:outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#6DBE45] to-[#2D7A1F] text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                {submitting ? "Sending..." : "Send Message"}
              </button>

              {status && (
                <div
                  className={`mt-4 p-4 rounded-xl text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-300 ${
                    status.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {status.message}
                </div>
              )}
            </form>
          </div>

          {/* Quick Links & Social */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Quick Links</h3>
              <div className="space-y-2">
                {["FAQs", "Support Center", "Privacy Policy", "Terms of Service", "Feedback"].map(
                  (link, index) => (
                    <button
                      key={index}
                      onClick={() => alert(`Opening: ${link}`)}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-[#6DBE45] hover:text-white rounded-lg transition-all"
                    >
                      {link}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#6DBE45] to-[#2D7A1F] rounded-2xl shadow-lg p-6 text-white">
              <h3 className="font-bold mb-4">Follow Us</h3>
              <p className="text-white/90 text-sm mb-4">
                Stay connected with us on social media for latest updates
              </p>
              <div className="flex gap-3 flex-wrap">
                <a
                  href="https://www.facebook.com/share/1PP876URNW/"
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook"
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="https://whatsapp.com/channel/0029Va8J"
                  target="_blank"
                  rel="noreferrer"
                  title="WhatsApp"
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <MessageCircle className="w-6 h-6" />
                </a>
                <a
                  href="https://www.instagram.com/krishnandan"
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram"
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="https://www.youtube.com/@VillageHelpkk"
                  target="_blank"
                  rel="noreferrer"
                  title="Village Help YouTube"
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <Youtube className="w-6 h-6" />
                </a>
                <a
                  href="https://youtube.com/channel/UChOVyMm3us8N9u69SneTuuA"
                  target="_blank"
                  rel="noreferrer"
                  title="KK Gyan YouTube"
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <Youtube className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Office Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-semibold text-gray-800">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-semibold text-gray-800">9:00 AM - 1:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-semibold text-red-600">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
