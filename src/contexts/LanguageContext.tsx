
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define supported languages
export type Language = 'ar' | 'fr' | 'en';

// Define translation structure
type Translations = {
  [key: string]: {
    [key in Language]: string;
  };
};

// Sample translations
const translations: Translations = {
  // Navbar
  "navbar.home": {
    ar: "الرئيسية",
    fr: "Accueil",
    en: "Home"
  },
  "navbar.cars": {
    ar: "السيارات",
    fr: "Voitures",
    en: "Cars"
  },
  "navbar.location": {
    ar: "الموقع",
    fr: "Localisation",
    en: "Location"
  },
  "navbar.about": {
    ar: "من نحن",
    fr: "À propos",
    en: "About Us"
  },
  "navbar.contact": {
    ar: "اتصل بنا",
    fr: "Contact",
    en: "Contact"
  },
  // Home
  "home.hero.title": {
    ar: "استئجار سيارتك المثالية في المغرب",
    fr: "Louez votre voiture idéale au Maroc",
    en: "Rent Your Perfect Car in Morocco"
  },
  "home.hero.subtitle": {
    ar: "تجربة قيادة لا تُنسى بأسعار معقولة",
    fr: "Une expérience de conduite inoubliable à des prix abordables",
    en: "An unforgettable driving experience at affordable prices"
  },
  "home.hero.cta": {
    ar: "اختر سيارتك الآن",
    fr: "Choisissez votre voiture maintenant",
    en: "Choose Your Car Now"
  },
  // Cars
  "cars.title": {
    ar: "أسطولنا",
    fr: "Notre flotte",
    en: "Our Fleet"
  },
  "cars.filter.all": {
    ar: "الكل",
    fr: "Tous",
    en: "All"
  },
  "cars.filter.economy": {
    ar: "اقتصادية",
    fr: "Économique",
    en: "Economy"
  },
  "cars.filter.suv": {
    ar: "دفع رباعي",
    fr: "SUV",
    en: "SUV"
  },
  "cars.filter.luxury": {
    ar: "فاخرة",
    fr: "Luxe",
    en: "Luxury"
  },
  "cars.card.reserve": {
    ar: "احجز الآن",
    fr: "Réserver",
    en: "Reserve"
  },
  "cars.card.details": {
    ar: "تفاصيل أكثر",
    fr: "Plus de détails",
    en: "More Details"
  },
  // About
  "about.title": {
    ar: "من نحن",
    fr: "À propos de nous",
    en: "About Us"
  },
  "about.why": {
    ar: "لماذا تختارنا",
    fr: "Pourquoi nous choisir",
    en: "Why Choose Us"
  },
  // Form
  "form.name": {
    ar: "الاسم",
    fr: "Prénom",
    en: "First Name"
  },
  "form.lastname": {
    ar: "اللقب",
    fr: "Nom",
    en: "Last Name"
  },
  "form.phone": {
    ar: "رقم الهاتف",
    fr: "Numéro de téléphone",
    en: "Phone Number"
  },
  "form.city": {
    ar: "المدينة",
    fr: "Ville",
    en: "City"
  },
  "form.pickup": {
    ar: "تاريخ الاستلام",
    fr: "Date de prise en charge",
    en: "Pick-up Date"
  },
  "form.return": {
    ar: "تاريخ الإرجاع",
    fr: "Date de retour",
    en: "Return Date"
  },
  "form.submit": {
    ar: "إرسال",
    fr: "Envoyer",
    en: "Submit"
  },
  // Admin
  "admin.login.title": {
    ar: "تسجيل الدخول للإدارة",
    fr: "Connexion administrateur",
    en: "Admin Login"
  },
  "admin.login.username": {
    ar: "اسم المستخدم",
    fr: "Nom d'utilisateur",
    en: "Username"
  },
  "admin.login.password": {
    ar: "كلمة المرور",
    fr: "Mot de passe",
    en: "Password"
  },
  "admin.login.submit": {
    ar: "دخول",
    fr: "Connexion",
    en: "Login"
  },
};

// Define context type
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  // Effect to set RTL for Arabic
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    console.warn(`Translation missing for key: ${key} in language: ${language}`);
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook for using the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
