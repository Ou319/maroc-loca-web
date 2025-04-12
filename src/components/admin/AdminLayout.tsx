
import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Home, 
  Car, 
  Users, 
  Phone, 
  BarChart, 
  LogOut, 
  Menu, 
  X,
  Globe,
  ChevronDown,
  Moon,
  Sun
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  
  const handleLogout = () => {
    // In a real app, this would clear auth tokens and state
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
      duration: 3000,
    });
    navigate("/imran123");
  };
  
  const handleLanguageChange = (lang: 'ar' | 'fr' | 'en') => {
    setLanguage(lang);
    setLanguageMenuOpen(false);
  };
  
  const navItems = [
    { path: "/admin", icon: <Home size={20} />, label: "Dashboard" },
    { path: "/admin/cars", icon: <Car size={20} />, label: "Cars" },
    { path: "/admin/users", icon: <Users size={20} />, label: "Users" },
    { path: "/admin/contact", icon: <Phone size={20} />, label: "Contact" },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      {/* Top Navigation */}
      <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-sm z-20`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Mobile menu button */}
              <button
                type="button"
                className={`inline-flex items-center justify-center p-2 rounded-md ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-morocco-primary'} focus:outline-none md:hidden`}
                onClick={toggleSidebar}
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/admin" className="text-2xl font-bold text-morocco-primary">
                  Maroc Loca
                </Link>
              </div>
            </div>
            
            <div className="flex items-center">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`mr-4 flex items-center justify-center p-2 rounded-md ${
                  theme === 'dark' ? 'text-yellow-300 hover:text-yellow-200' : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className={`flex items-center px-3 py-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-morocco-primary'
                  }`}
                >
                  <Globe size={18} className="mr-1" />
                  <span className="uppercase">{language}</span>
                  <ChevronDown size={16} className="ml-1" />
                </button>
                
                {languageMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    <div className="py-1">
                      <button
                        onClick={() => handleLanguageChange('ar')}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          language === 'ar' 
                            ? theme === 'dark' 
                              ? 'bg-gray-700 text-white' 
                              : 'bg-gray-100 text-morocco-primary' 
                            : theme === 'dark'
                              ? 'text-gray-200 hover:bg-gray-700'
                              : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        العربية
                      </button>
                      <button
                        onClick={() => handleLanguageChange('fr')}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          language === 'fr' 
                            ? theme === 'dark' 
                              ? 'bg-gray-700 text-white' 
                              : 'bg-gray-100 text-morocco-primary' 
                            : theme === 'dark'
                              ? 'text-gray-200 hover:bg-gray-700'
                              : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        Français
                      </button>
                      <button
                        onClick={() => handleLanguageChange('en')}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          language === 'en' 
                            ? theme === 'dark' 
                              ? 'bg-gray-700 text-white' 
                              : 'bg-gray-100 text-morocco-primary' 
                            : theme === 'dark'
                              ? 'text-gray-200 hover:bg-gray-700'
                              : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        English
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Visit Website */}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className={`mr-4 px-3 py-2 text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-morocco-primary'
                }`}
              >
                View Website
              </a>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-morocco-primary'
                }`}
              >
                <LogOut size={18} className="mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar (for medium and larger screens) */}
        <aside 
          className={`fixed inset-y-0 z-10 flex-shrink-0 w-64 mt-16 overflow-y-auto ${
            theme === 'dark' 
              ? 'bg-gray-800 md:bg-transparent' 
              : 'bg-white md:bg-transparent'
          } md:static md:mt-0 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="py-4 md:py-8 md:pl-4">
            <div className="px-4 mb-6">
              <h2 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Admin Panel</h2>
            </div>
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    location.pathname === item.path
                      ? 'bg-morocco-primary text-white'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-morocco-primary'
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
            
            <div className="mt-12 px-6">
              <div className={`${
                theme === 'dark' 
                  ? 'bg-green-900 border-l-4 border-green-500' 
                  : 'bg-green-50 border-l-4 border-green-400'
              } p-4 rounded`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <BarChart className={`h-5 w-5 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-500'
                    }`} />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-green-300' : 'text-green-700'
                    }`}>
                      Total Reservations
                    </p>
                    <p className={`text-2xl font-semibold ${
                      theme === 'dark' ? 'text-green-200' : 'text-green-800'
                    }`}>
                      128
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-hidden ${
          theme === 'dark' ? 'bg-gray-900' : ''
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
