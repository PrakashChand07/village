import { MapPin, Mail, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function TopHeader() {
  return (
    <div className="bg-gradient-to-r from-[#2D7A1F] to-[#6DBE45] text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center md:justify-between items-center text-xs sm:text-sm gap-2 md:gap-0">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Bihar, India</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>support@villagehelp.in</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-3">
            <a href="#" className="hover:opacity-80 transition-opacity">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
