import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/Layout";
import { MapPin, Navigation, Phone, Mail, Clock } from "lucide-react";

// Mock location data - would come from database
const LOCATION_DATA = {
  name: "Maroc Loca - Casablanca Branch",
  address: "123 Avenue Hassan II, Casablanca, Morocco",
  coordinates: { lat: 33.5731, lng: -7.5898 }, // Casablanca coordinates
  phone: "+212 6 12 34 56 78",
  email: "casablanca@marocloca.ma",
  hours: {
    monday: "9:00 AM - 7:00 PM",
    tuesday: "9:00 AM - 7:00 PM",
    wednesday: "9:00 AM - 7:00 PM",
    thursday: "9:00 AM - 7:00 PM",
    friday: "9:00 AM - 7:00 PM",
    saturday: "9:00 AM - 5:00 PM",
    sunday: "10:00 AM - 4:00 PM"
  }
};

const LocationPage = () => {
  const { t } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // This would typically use a proper map integration like Google Maps or Mapbox
    // For now, let's just render a static map image
    if (mapContainerRef.current && !mapLoaded) {
      const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${LOCATION_DATA.coordinates.lat},${LOCATION_DATA.coordinates.lng}&zoom=15&size=1200x600&markers=color:red%7C${LOCATION_DATA.coordinates.lat},${LOCATION_DATA.coordinates.lng}&key=YOUR_API_KEY`;
      
      const mapImage = document.createElement('img');
      mapImage.src = mapUrl;
      mapImage.alt = 'Location Map';
      mapImage.className = 'w-full h-full object-cover rounded-lg';
      
      // Instead of using an actual API key, let's use a placeholder image for demo
      const placeholderImage = document.createElement('div');
      placeholderImage.className = 'w-full h-full bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden';
      placeholderImage.style.minHeight = '400px';
      
      const mapPin = document.createElement('div');
      mapPin.className = 'absolute z-10 text-morocco-primary animate-bounce';
      mapPin.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
      
      const mapText = document.createElement('div');
      mapText.className = 'text-xl font-bold text-gray-600';
      mapText.textContent = 'Interactive Map Coming Soon';
      
      placeholderImage.appendChild(mapPin);
      placeholderImage.appendChild(mapText);
      
      // Clear previous content and append the new map
      mapContainerRef.current.innerHTML = '';
      mapContainerRef.current.appendChild(placeholderImage);
      
      setMapLoaded(true);
    }
  }, [mapLoaded]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-20 pb-10">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-morocco-primary">
            {t("location.title")}
          </h1>
          <p className="text-xl mb-0 max-w-3xl text-gray-600">
            {t("location.subtitle")}
          </p>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="pb-10">
        <div className="container-custom">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div ref={mapContainerRef} className="h-[400px] md:h-[500px]">
              {/* Map will be loaded here */}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Loading map...</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Location Details */}
      <section className="section">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-morocco-secondary">
                {t("location.contactInfo")}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="text-morocco-primary mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">{LOCATION_DATA.name}</h3>
                    <p className="text-gray-700">{LOCATION_DATA.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="text-morocco-primary mr-3 flex-shrink-0" />
                  <p className="text-gray-700">{LOCATION_DATA.phone}</p>
                </div>
                
                <div className="flex items-center">
                  <Mail className="text-morocco-primary mr-3 flex-shrink-0" />
                  <p className="text-gray-700">{LOCATION_DATA.email}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <a
                  href={`https://www.google.com/maps?q=${LOCATION_DATA.coordinates.lat},${LOCATION_DATA.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-morocco-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  <Navigation className="mr-2" size={18} />
                  {t("location.getDirections")}
                </a>
              </div>
            </div>
            
            {/* Business Hours */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-morocco-secondary flex items-center">
                <Clock className="mr-2 text-morocco-primary" size={20} />
                {t("location.businessHours")}
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Monday:</span>
                  <span>{LOCATION_DATA.hours.monday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tuesday:</span>
                  <span>{LOCATION_DATA.hours.tuesday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Wednesday:</span>
                  <span>{LOCATION_DATA.hours.wednesday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Thursday:</span>
                  <span>{LOCATION_DATA.hours.thursday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Friday:</span>
                  <span>{LOCATION_DATA.hours.friday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Saturday:</span>
                  <span>{LOCATION_DATA.hours.saturday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sunday:</span>
                  <span>{LOCATION_DATA.hours.sunday}</span>
                </div>
              </div>
            </div>
            
            {/* Nearby Attractions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-morocco-secondary">
                {t("location.nearbyAttractions")}
              </h2>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-morocco-primary rounded-full mt-2 mr-2"></div>
                  <div>
                    <h3 className="font-bold">Hassan II Mosque</h3>
                    <p className="text-gray-700">Just 2.5 km away - one of the largest mosques in the world</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-morocco-primary rounded-full mt-2 mr-2"></div>
                  <div>
                    <h3 className="font-bold">Morocco Mall</h3>
                    <p className="text-gray-700">4 km away - luxury shopping experience</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-morocco-primary rounded-full mt-2 mr-2"></div>
                  <div>
                    <h3 className="font-bold">Ain Diab Beach</h3>
                    <p className="text-gray-700">3 km away - beautiful beach with various activities</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-morocco-primary rounded-full mt-2 mr-2"></div>
                  <div>
                    <h3 className="font-bold">Old Medina</h3>
                    <p className="text-gray-700">5 km away - explore traditional Moroccan culture</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Other Locations */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-10 text-center">
            {t("location.otherLocations")}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Marrakech", "Rabat", "Tangier"].map((city, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-2">{city} Branch</h3>
                <p className="text-gray-700 mb-3">123 Main Street, {city}, Morocco</p>
                <div className="flex items-center text-gray-600 mb-2">
                  <Phone size={16} className="mr-2 text-morocco-primary" />
                  <span>+212 6 12 34 56 78</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Mail size={16} className="mr-2 text-morocco-primary" />
                  <span>{city.toLowerCase()}@marocloca.ma</span>
                </div>
                <a
                  href="#"
                  className="text-morocco-primary font-medium hover:underline"
                >
                  {t("location.viewDetails")}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LocationPage;
