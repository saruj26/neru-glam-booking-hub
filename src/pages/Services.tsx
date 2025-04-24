import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';

const services = [
  // Birthday Makeup
  {
    category: 'birthday',
    items: [
      {
        id: 'birthday-basic',
        title: 'Basic Birthday Glam',
        description: 'A fresh, youthful look perfect for daytime birthday celebrations.',
        image: 'https://images.unsplash.com/photo-1596704017254-9b80443994d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: 'From $50'
      },
      {
        id: 'birthday-premium',
        title: 'Premium Birthday Glam',
        description: 'Elevated makeup with shimmer and glow, perfect for evening parties.',
        image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: 'From $80'
      },
      {
        id: 'birthday-themed',
        title: 'Themed Birthday Makeup',
        description: 'Customized makeup to match your birthday theme or costume.',
        image: 'https://images.unsplash.com/photo-1617220275046-90170ad2815f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: 'From $100'
      }
    ]
  },
  // Puberty Ceremony
  {
    category: 'puberty',
    items: [
      {
        id: 'puberty-traditional',
        title: 'Traditional Ceremony Look',
        description: 'Classic makeup style perfect for traditional puberty ceremonies.',
        image: 'https://images.unsplash.com/photo-1487412947147-5cdc1cdc5564?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: 'From $80'
      },
      {
        id: 'puberty-modern',
        title: 'Modern Ceremony Look',
        description: 'Contemporary makeup with traditional elements for a fresh take.',
        image: 'https://images.unsplash.com/photo-1613324446652-383d8b677c7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: 'From $100'
      },
      {
        id: 'puberty-premium',
        title: 'Premium Ceremony Package',
        description: 'Complete beauty package including hair styling and draping assistance.',
        image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: 'From $150'
      }
    ]
  },
  // Reception Makeup
  {
    category: 'reception',
    items: [
      {
        id: 'reception-minimal',
        title: 'Minimal Reception Glam',
        description: 'Subtle, elegant makeup perfect for daytime receptions.',
        image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: 'From $100'
      },
      {
        id: 'reception-classic',
        title: 'Classic Reception Look',
        description: 'Timeless makeup with defined eyes and natural lips.',
        image: 'https://images.unsplash.com/photo-1509955252650-8f9d8a65b610?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: 'From $120'
      },
      {
        id: 'reception-glamour',
        title: 'Full Glamour Reception',
        description: 'Show-stopping makeup with dramatic eyes and perfect contouring.',
        image: 'https://images.unsplash.com/photo-1602910344008-22f323cc1817?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: 'From $150'
      }
    ]
  },
  // Wedding Makeup
  {
    category: 'wedding',
    items: [
      {
        id: 'wedding-minimal',
        title: 'Minimal Bridal Look',
        description: 'Natural, fresh bridal makeup that enhances your features subtly.',
        image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: 'From $150'
      },
      {
        id: 'wedding-traditional',
        title: 'Traditional Bridal Makeup',
        description: 'Classic bridal look with traditional elements and rich colors.',
        image: 'https://images.unsplash.com/photo-1595159901089-7d0b3608515e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: 'From $200'
      },
      {
        id: 'wedding-luxury',
        title: 'Luxury Bridal Package',
        description: 'Premium bridal makeup with hair styling, draping assistance, and touch-ups.',
        image: 'https://images.unsplash.com/photo-1607779097040-17baf87ddab0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: 'From $300'
      }
    ]
  },
  // Other Categories
  {
    category: 'other',
    items: [
      {
        id: 'festive-makeup',
        title: 'Festive Makeup',
        description: 'Special makeup for celebrations like Diwali, Eid, Christmas, etc.',
        image: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: 'From $70'
      },
      {
        id: 'photoshoot-makeup',
        title: 'Modeling/Photoshoot Makeup',
        description: 'Camera-ready makeup that looks perfect in photographs.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: 'From $120'
      },
      {
        id: 'office-makeup',
        title: 'Office/Interview Looks',
        description: 'Professional makeup for workplace environments and interviews.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: 'From $60'
      }
    ]
  }
];

const Services = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-neru-purple to-purple-800 py-16 md:py-24">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1588367867362-fb8db888bfdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Our Beauty Services
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Explore our range of premium makeup services tailored for every special occasion in your life.
              </p>
            </div>
          </div>
        </section>
        
        {/* Services Tabs Section */}
        <section className="py-16 bg-neru-lightGray">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="birthday" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-white/80 p-1">
                  <TabsTrigger value="birthday" className="px-4 py-2">Birthday</TabsTrigger>
                  <TabsTrigger value="puberty" className="px-4 py-2">Puberty Ceremony</TabsTrigger>
                  <TabsTrigger value="reception" className="px-4 py-2">Reception</TabsTrigger>
                  <TabsTrigger value="wedding" className="px-4 py-2">Wedding</TabsTrigger>
                  <TabsTrigger value="other" className="px-4 py-2">Other</TabsTrigger>
                </TabsList>
              </div>
              
              {services.map((service) => (
                <TabsContent key={service.category} value={service.category} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {service.items.map((item) => (
                      <CategoryCard 
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        description={item.description}
                        image={item.image}
                        price={item.price}
                      />
                    ))}
                  </div>
                  
                  <div className="mt-12 text-center">
                    <Button size="lg" className="bg-neru-purple hover:bg-purple-600 text-white">
                      <Link to="/booking">Book This Service</Link>
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
        
        {/* Custom Requests Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-neru-purple mb-6">Special Requests</h2>
              <p className="text-lg text-gray-600 mb-8">
                Can't find exactly what you're looking for? We offer customized makeup services tailored to your specific needs and preferences.
              </p>
              <Button size="lg" className="bg-neru-gold hover:bg-amber-500 text-white">
                <Link to="/contact">Contact Us for Custom Services</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;
