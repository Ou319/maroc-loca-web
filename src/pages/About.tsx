
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check, Users, Award, ThumbsUp, Car, Calendar } from "lucide-react";

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* Hero Section */}
      <section 
        className="relative py-20"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1533395427226-788cee25cc7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container-custom relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("about.title")}
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            {t("about.subtitle")}
          </p>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="section">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-morocco-primary">
                {t("about.story.title")}
              </h2>
              <p className="text-gray-700 mb-4">
                Founded in 2010, Maroc Loca began as a small family business with just three cars. Today, we've grown into one of Morocco's leading car rental companies, with multiple locations across the country and a fleet of over 100 vehicles.
              </p>
              <p className="text-gray-700 mb-4">
                Our founder, Ahmed Benali, started the company with a simple vision: to provide tourists and locals alike with reliable, affordable transportation while delivering exceptional customer service.
              </p>
              <p className="text-gray-700">
                Over the years, we've stayed true to this vision, continuously upgrading our fleet and improving our services to meet the evolving needs of our valued customers.
              </p>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Maroc Loca Founder" 
                className="rounded-xl shadow-lg"
              />
              <div className="absolute -bottom-5 -left-5 bg-morocco-primary text-white py-2 px-4 rounded-lg">
                <p className="text-sm font-medium">Est. 2010</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-morocco-secondary">
              {t("about.why")}
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {t("about.why.subtitle")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Car className="w-12 h-12 text-morocco-primary" />,
                title: "Modern Fleet",
                description: "Our vehicles are regularly maintained and never older than 3 years, ensuring your safety and comfort."
              },
              {
                icon: <Check className="w-12 h-12 text-morocco-primary" />,
                title: "Easy Booking",
                description: "Our streamlined booking process makes it simple to reserve the perfect vehicle for your needs."
              },
              {
                icon: <Users className="w-12 h-12 text-morocco-primary" />,
                title: "Experienced Team",
                description: "Our multilingual staff is professionally trained to provide exceptional service."
              },
              {
                icon: <Award className="w-12 h-12 text-morocco-primary" />,
                title: "Quality Guaranteed",
                description: "We pride ourselves on the quality of our vehicles and the reliability of our service."
              },
              {
                icon: <Calendar className="w-12 h-12 text-morocco-primary" />,
                title: "Flexible Rental Options",
                description: "From daily to monthly rentals, we have plans to fit your schedule and budget."
              },
              {
                icon: <ThumbsUp className="w-12 h-12 text-morocco-primary" />,
                title: "Customer Satisfaction",
                description: "Our 95% customer satisfaction rate speaks for itself - your happiness is our priority."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("about.values.title")}
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {t("about.values.subtitle")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              {
                title: "Customer Satisfaction",
                description: "We go above and beyond to ensure our customers have an exceptional experience with us."
              },
              {
                title: "Integrity",
                description: "Honesty and transparency are at the core of everything we do."
              },
              {
                title: "Quality",
                description: "We maintain high standards in our fleet and services, never compromising on quality."
              },
              {
                title: "Innovation",
                description: "We continuously seek new ways to improve our services and stay ahead of industry trends."
              }
            ].map((value, index) => (
              <div key={index} className="flex">
                <div className="mr-4 mt-1">
                  <div className="w-8 h-8 rounded-full bg-morocco-primary text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("about.team.title")}
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {t("about.team.subtitle")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Ahmed Benali",
                title: "Founder & CEO",
                image: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                name: "Samira Tazi",
                title: "Operations Manager",
                image: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                name: "Karim Mansour",
                title: "Fleet Manager",
                image: "https://randomuser.me/api/portraits/men/22.jpg"
              },
              {
                name: "Leila Benjelloun",
                title: "Customer Relations",
                image: "https://randomuser.me/api/portraits/women/68.jpg"
              }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden group">
                <div className="h-60 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-morocco-primary">{member.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("about.testimonials.title")}
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {t("about.testimonials.subtitle")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "The service was impeccable from start to finish. The car was in perfect condition, and the staff was incredibly helpful in recommending scenic routes.",
                name: "Sophie Durand",
                country: "France"
              },
              {
                quote: "As a frequent visitor to Morocco, I've tried several car rental services, but Maroc Loca stands out for their reliability and customer care.",
                name: "James Wilson",
                country: "United Kingdom"
              },
              {
                quote: "We had an amazing road trip across Morocco thanks to the reliable SUV we rented from Maroc Loca. Will definitely use their services again.",
                name: "Ahmed Al-Farsi",
                country: "UAE"
              },
              {
                quote: "The booking process was straightforward, and the price was very competitive. The car was clean and performed perfectly throughout our journey.",
                name: "Maria Rodriguez",
                country: "Spain"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md relative">
                <div className="absolute top-4 left-4 text-morocco-primary opacity-20 text-7xl">"</div>
                <div className="relative z-10">
                  <p className="italic text-gray-600 mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-morocco-tertiary mr-3 flex items-center justify-center font-bold text-morocco-primary">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-morocco-primary text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("about.cta.title")}
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {t("about.cta.subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/cars" 
              className="bg-white text-morocco-primary px-8 py-3 rounded-md font-medium hover:bg-opacity-90 transition-all"
            >
              {t("about.cta.explore")}
            </a>
            <a 
              href="/location" 
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-morocco-primary transition-all"
            >
              {t("about.cta.contact")}
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
