
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  const { t } = useLanguage();
  
  // Sample company info - would come from database
  const companyInfo = {
    name: "Maroc Loca",
    address: "123 Avenue Hassan II, Casablanca, Morocco",
    phone: "+212 6 12 34 56 78",
    email: "contact@marocloca.ma",
    social: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com"
    }
  };

  return (
    <footer className="bg-morocco-dark text-white py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-morocco-accent mb-4">{companyInfo.name}</h3>
            <p className="text-gray-300 mb-6">
              Premium car rental service in Morocco offering the best vehicles at competitive prices.
            </p>
            <div className="flex space-x-4">
              <a 
                href={companyInfo.social.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-morocco-primary transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a 
                href={companyInfo.social.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-morocco-primary transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a 
                href={companyInfo.social.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-morocco-primary transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-morocco-primary transition-colors">
                  {t("navbar.home")}
                </Link>
              </li>
              <li>
                <Link to="/cars" className="text-gray-300 hover:text-morocco-primary transition-colors">
                  {t("navbar.cars")}
                </Link>
              </li>
              <li>
                <Link to="/location" className="text-gray-300 hover:text-morocco-primary transition-colors">
                  {t("navbar.location")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-morocco-primary transition-colors">
                  {t("navbar.about")}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mr-3 text-morocco-primary mt-1" size={18} />
                <span className="text-gray-300">{companyInfo.address}</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 text-morocco-primary" size={18} />
                <span className="text-gray-300">{companyInfo.phone}</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 text-morocco-primary" size={18} />
                <span className="text-gray-300">{companyInfo.email}</span>
              </li>
            </ul>
          </div>
          
          {/* Business Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4">Business Hours</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-300">Monday - Friday:</span>
                <span className="text-white">9:00 AM - 7:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-300">Saturday:</span>
                <span className="text-white">9:00 AM - 5:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-300">Sunday:</span>
                <span className="text-white">10:00 AM - 4:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-white/10 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {companyInfo.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
