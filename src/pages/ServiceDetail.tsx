
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ServiceDetail = () => {
  // Mock data for the themed birthday makeup service
  const service = {
    id: 'birthday-themed',
    title: 'Themed Birthday Makeup',
    description: 'Customized makeup to match your birthday theme or costume.',
    fullDescription: 'Transform your look with our themed birthday makeup service. Our expert artists will create a unique makeup design that perfectly matches your party theme or costume. Whether you are going for a magical fairy princess look, a glamorous Hollywood star, or any other theme, we will make your vision come to life. This service includes full face makeup with special attention to theme-specific details, the use of special effects products if needed, and a long-lasting setting spray to keep you looking perfect throughout your celebration.',
    image: 'https://images.unsplash.com/photo-1617220275046-90170ad2815f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    price: 'From $100',
    duration: '60-90 minutes',
    includes: [
      'Consultation to discuss theme and preferences',
      'Full face makeup application',
      'Theme-specific special effects if needed',
      'Setting spray for long-lasting wear',
      'Touch-up kit for the celebration',
      'Optional: false lashes'
    ]
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-neru-purple to-purple-800 py-16">
          <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${service.image})` }}></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{service.title}</h1>
              <p className="text-xl text-white/90">{service.description}</p>
            </div>
          </div>
        </section>

        {/* Service Details */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-neru-lightGray p-8 rounded-lg shadow-md">
                <div className="mb-8">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-[400px] object-cover rounded-lg mb-6"
                  />
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-semibold text-neru-gold">{service.price}</span>
                  <span className="text-gray-600">Duration: {service.duration}</span>
                </div>
                
                <div className="prose max-w-none mb-8">
                  <h2 className="text-2xl font-bold text-neru-purple mb-4">About this Service</h2>
                  <p className="text-gray-700 mb-6">{service.fullDescription}</p>
                  
                  <h3 className="text-xl font-semibold text-neru-purple mb-3">What's Included:</h3>
                  <ul className="space-y-2 mb-6">
                    {service.includes.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-neru-gold mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button size="lg" asChild className="w-full bg-neru-gold hover:bg-amber-500 text-white">
                  <Link to={`/booking?service=${service.id}`}>Book Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServiceDetail;
