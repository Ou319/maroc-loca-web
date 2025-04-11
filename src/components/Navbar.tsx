
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X, Globe, Phone } from "lucide-react";

const Navbar = () => {
  const { t, language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // Sample company info - would come from database
  const companyInfo = {
    name: "Maroc Loca",
    phone: "+212 6 12 34 56 78",
    whatsapp: "+212612345678"
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLanguageChange = (lang: 'ar' | 'fr' | 'en') => {
    setLanguage(lang);
    closeMenu();
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl md:text-3xl font-bold text-morocco-primary"
            onClick={closeMenu}
          >
            {companyInfo.name}
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`navbar-link ${location.pathname === "/" ? "text-morocco-primary after:w-full" : ""}`}
            >
              {t("navbar.home")}
            </Link>
            <Link 
              to="/cars" 
              className={`navbar-link ${location.pathname === "/cars" ? "text-morocco-primary after:w-full" : ""}`}
            >
              {t("navbar.cars")}
            </Link>
            <Link 
              to="/location" 
              className={`navbar-link ${location.pathname === "/location" ? "text-morocco-primary after:w-full" : ""}`}
            >
              {t("navbar.location")}
            </Link>
            <Link 
              to="/about" 
              className={`navbar-link ${location.pathname === "/about" ? "text-morocco-primary after:w-full" : ""}`}
            >
              {t("navbar.about")}
            </Link>
          </nav>
          
          {/* Contact & Languages (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="relative group">
              <button
                className="flex items-center space-x-1 text-sm border px-3 py-1.5 rounded-lg hover:bg-gray-50"
              >
                <Globe size={16} />
                <span className="uppercase">{language}</span>
              </button>
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg overflow-hidden scale-0 group-hover:scale-100 transition-transform origin-top-right">
                <button
                  onClick={() => handleLanguageChange('ar')}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${language === 'ar' ? 'bg-gray-100' : ''}`}
                >
                  العربية
                </button>
                <button
                  onClick={() => handleLanguageChange('fr')}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${language === 'fr' ? 'bg-gray-100' : ''}`}
                >
                  Français
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${language === 'en' ? 'bg-gray-100' : ''}`}
                >
                  English
                </button>
              </div>
            </div>
            
            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/${companyInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <Phone size={16} className="mr-2" />
              <span>{companyInfo.phone}</span>
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-white z-40 pt-20 px-4 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : language === 'ar' ? "translate-x-full" : "-translate-x-full"
        } md:hidden`}
      >
        <nav className="flex flex-col space-y-6">
          <Link 
            to="/" 
            className="text-xl font-medium py-2 border-b"
            onClick={closeMenu}
          >
            {t("navbar.home")}
          </Link>
          <Link 
            to="/cars" 
            className="text-xl font-medium py-2 border-b"
            onClick={closeMenu}
          >
            {t("navbar.cars")}
          </Link>
          <Link 
            to="/location" 
            className="text-xl font-medium py-2 border-b"
            onClick={closeMenu}
          >
            {t("navbar.location")}
          </Link>
          <Link 
            to="/about" 
            className="text-xl font-medium py-2 border-b"
            onClick={closeMenu}
          >
            {t("navbar.about")}
          </Link>
          
          {/* Language Options (Mobile) */}
          <div className="py-4">
            <p className="text-sm font-medium text-gray-500 mb-2">{t("navbar.language")}</p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleLanguageChange('ar')}
                className={`px-4 py-2 rounded-md ${
                  language === 'ar' ? 'bg-morocco-primary text-white' : 'bg-gray-100'
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => handleLanguageChange('fr')}
                className={`px-4 py-2 rounded-md ${
                  language === 'fr' ? 'bg-morocco-primary text-white' : 'bg-gray-100'
                }`}
              >
                Français
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-4 py-2 rounded-md ${
                  language === 'en' ? 'bg-morocco-primary text-white' : 'bg-gray-100'
                }`}
              >
                English
              </button>
            </div>
          </div>
          
          {/* WhatsApp Button (Mobile) */}
          <a
            href={`https://wa.me/${companyInfo.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Phone size={20} className="mr-2" />
            <span>{companyInfo.phone}</span>
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
