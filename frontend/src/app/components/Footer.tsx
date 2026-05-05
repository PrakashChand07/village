import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart } from "lucide-react";

export function Footer() {
  const footerLinks = {
    about: [
      "About Us",
      "Our Mission",
      "Our Team",
      "Contact Us",
      "Careers",
    ],
    services: [
      "Government Jobs",
      "Scholarship",
      "Study Material",
      "Farming Help",
      "Village Schemes",
    ],
    quickLinks: [
      "Results",
      "Admit Card",
      "Test Series",
      "Current Affairs",
      "Online Services",
    ],
    legal: [
      "Privacy Policy",
      "Terms & Conditions",
      "Disclaimer",
      "Refund Policy",
    ],
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center">
                <img src="/image/logo.jpeg" alt="Village Help Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Village Help</h3>
                <p className="text-xs text-gray-400">ग्रामीण सेवा मंच</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Digital solutions for rural India. Empowering villages with technology.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#6DBE45] transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#6DBE45] transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#6DBE45] transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#6DBE45] transition-all">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* About Links */}
          <div>
            <h4 className="font-bold mb-4">About</h4>
            <ul className="space-y-2">
              {footerLinks.about.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-gray-400 hover:text-[#6DBE45] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-gray-400 hover:text-[#6DBE45] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-gray-400 hover:text-[#6DBE45] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="w-5 h-5 text-[#6DBE45] flex-shrink-0" />
                <span>Bihar, India</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <Mail className="w-5 h-5 text-[#6DBE45] flex-shrink-0" />
                <span>support@villagehelp.in</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <Phone className="w-5 h-5 text-[#6DBE45] flex-shrink-0" />
                <span>+91 1800-XXX-XXXX</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-4">
            {footerLinks.legal.map((link, index) => (
              <a key={index} href="#" className="text-sm text-gray-400 hover:text-[#6DBE45] transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="border-t border-gray-700 mt-6 pt-6 text-center">
          <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for Rural India
          </p>
          <p className="text-xs text-gray-500 mt-2">
            © 2026 Village Help. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
