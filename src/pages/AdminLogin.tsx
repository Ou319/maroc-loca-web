
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Lock, User } from "lucide-react";

const AdminLogin = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication - in a real app, this would validate against a database
    setTimeout(() => {
      // For demo purposes, accept any admin/admin login
      if (credentials.username === "admin" && credentials.password === "admin") {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard!",
          duration: 3000,
        });
        navigate("/admin");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
          duration: 3000,
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-morocco-primary mb-2">Maroc Loca</h1>
          <p className="text-gray-600">Admin Dashboard</p>
        </div>
        
        <div className="bg-white shadow-md rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-morocco-secondary">
            {t("admin.login.title")}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                {t("admin.login.username")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={credentials.username}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-morocco-primary"
                  placeholder="Enter your username"
                />
              </div>
            </div>
            
            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                {t("admin.login.password")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-morocco-primary"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-morocco-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Logging in..." : t("admin.login.submit")}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Hint: For demo purposes, use username "admin" and password "admin"
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="text-morocco-secondary hover:underline"
          >
            ← Return to main website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
