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
  "navbar.language": {
    ar: "اللغة",
    fr: "Langue",
    en: "Language"
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
  // Dashboard
  "dashboard.title": {
    ar: "لوحة التحكم",
    fr: "Tableau de bord",
    en: "Dashboard"
  },
  "dashboard.welcome": {
    ar: "مرحبًا بك في لوحة تحكم مراكش لوكا.",
    fr: "Bienvenue dans le tableau de bord de Maroc Loca.",
    en: "Welcome to the Maroc Loca admin dashboard."
  },
  "dashboard.stats.totalCars": {
    ar: "إجمالي السيارات",
    fr: "Total des voitures",
    en: "Total Cars"
  },
  "dashboard.stats.activeReservations": {
    ar: "الحجوزات النشطة",
    fr: "Réservations actives",
    en: "Active Reservations"
  },
  "dashboard.stats.totalUsers": {
    ar: "إجمالي المستخدمين",
    fr: "Total des المستخدمين",
    en: "Total Users"
  },
  "dashboard.stats.totalRevenue": {
    ar: "إجمالي الإيرادات",
    fr: "Revenu total",
    en: "Total Revenue"
  },
  "dashboard.chart.reservations": {
    ar: "الحجوزات حسب الشهر",
    fr: "Réservations par mois",
    en: "Reservations by Month"
  },
  "dashboard.chart.carCategories": {
    ar: "الحجوزات حسب فئة السيارة",
    fr: "Réservations par catégorie de voiture",
    en: "Reservations by Car Category"
  },
  "dashboard.chart.revenue": {
    ar: "اتجاه الإيرادات",
    fr: "Tendance des revenus",
    en: "Revenue Trend"
  },
  "dashboard.activity.title": {
    ar: "النشاط الأخير",
    fr: "Activité récente",
    en: "Recent Activity"
  },
  "dashboard.activity.empty": {
    ar: "لا يوجد نشاط حديث للعرض.",
    fr: "Aucune activité récente à afficher.",
    en: "No recent activity to display."
  },
  // Home page sections
  "home.occasions.title": {
    ar: "المناسبات",
    fr: "Occasions",
    en: "Occasions"
  },
  "home.occasions.subtitle": {
    ar: "اجعل لحظاتك الخاصة أكثر تميزًا مع سياراتنا الفاخرة",
    fr: "Rendez vos moments spéciaux encore plus mémorables avec nos véhicules haut de gamme",
    en: "Make your special moments even more memorable with our premium vehicles"
  },
  "home.occasions.cta": {
    ar: "مشاهدة السيارات الفاخرة",
    fr: "Voir les voitures de luxe",
    en: "View Luxury Cars"
  },
  "home.economy.title": {
    ar: "سيارات اقتصادية بأسعار معقولة",
    fr: "Voitures économiques abordables",
    en: "Affordable Economy Cars"
  },
  "home.economy.subtitle": {
    ar: "سيارات عملية وموفرة للوقود مثالية لاستكشاف المدينة",
    fr: "Véhicules pratiques et économes en carburant, parfaits pour l'exploration urbaine",
    en: "Practical, fuel-efficient vehicles perfect for city exploration"
  },
  "home.economy.cta": {
    ar: "رؤية السيارات الاقتصادية",
    fr: "Voir les voitures économiques",
    en: "See Economy Cars"
  },
  "home.welcome.title": {
    ar: "مرحبًا بكم في تأجير سيارات مراكش لوكا",
    fr: "Bienvenue chez Maroc Loca Location de Voitures",
    en: "Welcome to Maroc Loca Car Rentals"
  },
  "home.welcome.content": {
    ar: "في مراكش لوكا، نؤمن بأن كل رحلة تستحق السيارة المثالية. من السيارات الفاخرة للمناسبات الخاصة إلى السيارات العملية للمغامرات اليومية، يلبي أسطولنا المتنوع جميع احتياجاتك. مع أسعار شفافة، وخيارات تأجير مرنة، وخدمة عملاء استثنائية، نجعل تأجير السيارات بسيطًا ومريحًا وممتعًا.",
    fr: "Chez Maroc Loca, nous croyons que chaque voyage mérite le véhicule parfait. Des voitures luxueuses pour les occasions spéciales aux voitures pratiques pour les aventures quotidiennes, notre flotte diversifiée répond à tous vos besoins. Avec des prix transparents, des options de location flexibles et un service client exceptionnel, nous rendons la location de voitures simple, pratique et agréable.",
    en: "At Maroc Loca, we believe every journey deserves the perfect vehicle. From luxurious rides for special occasions to practical cars for everyday adventures, our diverse fleet caters to your every need. With transparent pricing, flexible rental options, and exceptional customer service, we make car rental simple, convenient, and enjoyable."
  },
  "home.fleet.title": {
    ar: "أسطول سياراتنا",
    fr: "Notre flotte de véhicules",
    en: "Our Vehicle Fleet"
  },
  "home.fleet.subtitle": {
    ar: "استكشف مجموعتنا من السيارات الممتازة لأي مناسبة",
    fr: "Explorez notre collection de véhicules premium pour toute occasion",
    en: "Explore our collection of premium vehicles for any occasion"
  },
  "home.about.title": {
    ar: "عن مراكش لوكا",
    fr: "À propos de Maroc Loca",
    en: "About Maroc Loca"
  },
  "home.about.content": {
    ar: "مراكش لوكا هي خدمة تأجير السيارات الرائدة في المغرب، وتوفر سيارات عالية الجودة للسياح ورجال الأعمال على حد سواء.",
    fr: "Maroc Loca est le premier service de location de voitures au Maroc, fournissant des véhicules de haute qualité aux touristes et aux voyageurs d'affaires.",
    en: "Maroc Loca is Morocco's premier car rental service, providing high-quality vehicles for tourists and business travelers alike."
  },
  "home.about.cta": {
    ar: "معرفة المزيد",
    fr: "En savoir plus",
    en: "Learn More"
  },
  "home.cta.title": {
    ar: "جاهز للانطلاق في الطريق؟",
    fr: "Prêt à prendre la route ?",
    en: "Ready to Hit the Road?"
  },
  "home.cta.subtitle": {
    ar: "احجز سيارتك المثالية اليوم وتمتع بتجربة المغرب بأسلوب مميز",
    fr: "Réservez votre voiture idéale aujourd'hui et découvrez le Maroc avec style",
    en: "Book your perfect ride today and experience Morocco in style"
  },
  "home.cta.button": {
    ar: "تصفح السيارات",
    fr: "Parcourir les voitures",
    en: "Browse Cars"
  },
  "footer.tagline": {
    ar: "شريكك الموثوق لتأجير السيارات في المغرب. استمتع بالراحة والموثوقية والخدمة الاستثنائية.",
    fr: "Votre partenaire de confiance pour la location de voitures au Maroc. Profitez du confort, de la fiabilité et d'un service exceptionnel.",
    en: "Your trusted partner for car rentals in Morocco. Experience comfort, reliability, and exceptional service."
  },
  "footer.quickLinks": {
    ar: "روابط سريعة",
    fr: "Liens rapides",
    en: "Quick Links"
  },
  "footer.businessHours": {
    ar: "ساعات العمل",
    fr: "Heures d'ouverture",
    en: "Business Hours"
  },
  "footer.monday": {
    ar: "الإثنين - الجمعة:",
    fr: "Lundi - Vendredi:",
    en: "Monday - Friday:"
  },
  "footer.saturday": {
    ar: "السبت:",
    fr: "Samedi:",
    en: "Saturday:"
  },
  "footer.sunday": {
    ar: "الأحد:",
    fr: "Dimanche:",
    en: "Sunday:"
  },
  "footer.copyright": {
    ar: "© 2025 مراكش لوكا. جميع الحقوق محفوظة.",
    fr: "© 2025 Maroc Loca. Tous droits réservés.",
    en: "© 2025 Maroc Loca. All rights reserved."
  },
  // User Management
  "users.title": {
    ar: "إدارة المستخدمين",
    fr: "Gestion des utilisateurs",
    en: "User Management"
  },
  "users.description": {
    ar: "إدارة المستخدمين وحجوزاتهم.",
    fr: "Gérer les utilisateurs et leurs réservations.",
    en: "Manage users and their reservations."
  },
  "users.search": {
    ar: "البحث عن المستخدمين...",
    fr: "Rechercher des utilisateurs...",
    en: "Search users..."
  },
  "users.status": {
    ar: "حالة الحجز:",
    fr: "Statut de réservation:",
    en: "Reservation Status:"
  },
  "users.noReservations": {
    ar: "لا توجد حجوزات",
    fr: "Pas de réservations",
    en: "No Reservations"
  },
  "users.reservation": {
    ar: "حجز",
    fr: "réservation",
    en: "reservation"
  },
  "users.reservations": {
    ar: "حجوزات",
    fr: "réservations",
    en: "reservations"
  },
  "users.loading": {
    ar: "جاري تحميل بيانات المستخدم...",
    fr: "Chargement des données utilisateur...",
    en: "Loading user data..."
  },
  "users.noUsersFound": {
    ar: "لم يتم العثور على مستخدمين. حاول ضبط فلاتر البحث.",
    fr: "Aucun utilisateur trouvé. Essayez d'ajuster vos filtres de recherche.",
    en: "No users found. Try adjusting your search filters."
  },
  "users.delete": {
    ar: "حذف المستخدم",
    fr: "Supprimer l'utilisateur",
    en: "Delete User"
  },
  "users.deleteConfirm": {
    ar: "هل أنت متأكد أنك تريد حذف هذا المستخدم وجميع حجوزاته؟",
    fr: "Êtes-vous sûr de vouloir supprimer cet utilisateur et toutes ses réservations?",
    en: "Are you sure you want to delete this user and all their reservations?"
  },
  "users.deleteSuccess": {
    ar: "تم حذف المستخدم وحجوزاته.",
    fr: "L'utilisateur et ses réservations ont été supprimés.",
    en: "The user and their reservations have been deleted."
  },
  "users.deleteFailed": {
    ar: "فشل حذف المستخدم. يرجى المحاولة مرة أخرى.",
    fr: "Impossible de supprimer l'utilisateur. Veuillez réessayer.",
    en: "Could not delete the user. Please try again."
  },
  "users.confirmCall": {
    ar: "تأكيد المكالمة",
    fr: "Confirmer l'appel",
    en: "Confirm Call"
  },
  "users.confirmPickup": {
    ar: "تأكيد الاستلام",
    fr: "Confirmer la prise en charge",
    en: "Confirm Pickup"
  },
  "users.cancel": {
    ar: "إلغاء",
    fr: "Annuler",
    en: "Cancel"
  },
  "users.callConfirmed": {
    ar: "تأكيد المكالمة",
    fr: "Appel confirmé",
    en: "Confirmation Call"
  },
  "users.carPickedUp": {
    ar: "تم استلام السيارة",
    fr: "Voiture prise en charge",
    en: "Car Picked Up"
  },
  "users.reserved": {
    ar: "محجوز",
    fr: "Réservé",
    en: "Reserved"
  },
  "car.status.reserved": {
    ar: "محجوز",
    fr: "Réservé",
    en: "Reserved"
  },
  "car.status.available": {
    ar: "متاح",
    fr: "Disponible",
    en: "Available"
  },
  "car.seats": {
    ar: "مقاعد",
    fr: "sièges",
    en: "seats"
  },
  "car.year": {
    ar: "السنة:",
    fr: "Année:",
    en: "Year:"
  },
  "car.category": {
    ar: "الفئة:",
    fr: "Catégorie:",
    en: "Category:"
  },
  "car.fuel": {
    ar: "الوقود:",
    fr: "Carburant:",
    en: "Fuel:"
  },
  "car.transmission.automatic": {
    ar: "أوتوماتيك",
    fr: "Automatique",
    en: "Automatic"
  },
  "car.transmission.manual": {
    ar: "يدوي",
    fr: "Manuel",
    en: "Manual"
  },
  "car.currentlyReserved": {
    ar: "هذه السيارة محجوزة حاليا",
    fr: "Cette voiture est actuellement réservée",
    en: "This car is currently reserved"
  }
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
