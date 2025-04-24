
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import TestimonialCard from '@/components/TestimonialCard';

const categories = [
  {
    id: 'birthday',
    title: 'Birthday Makeup',
    description: 'Special looks for birthday parties, styled to match personality and theme.',
    image: 'https://images.unsplash.com/photo-1596704017254-9b80443994d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    price: 'From $50'
  },
  {
    id: 'puberty',
    title: 'Puberty Ceremony',
    description: 'Traditional makeup styles for puberty-related events and cultural ceremonies.',
    image: 'https://images.unsplash.com/photo-1487412947147-5cdc1cdc5564?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    price: 'From $80'
  },
  {
    id: 'reception',
    title: 'Reception Makeup',
    description: 'Elegant and soft glam looks suitable for wedding receptions or evening functions.',
    image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    price: 'From $100'
  },
  {
    id: 'wedding',
    title: 'Wedding Makeup',
    description: 'Bridal makeup styles, from minimal to traditional full bridal glam.',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    price: 'From $150'
  }
];

const testimonials = [
  {
    name: 'Priya Shah',
    role: 'Wedding Client',
    quote: 'My bridal makeup was absolutely perfect! The artist understood exactly what I wanted and made me feel beautiful on my special day.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5
  },
  {
    name: 'Meera Patel',
    role: 'Birthday Client',
    quote: 'I loved my birthday makeup! It was exactly what I wanted - glamorous but still age-appropriate. Will definitely come back!',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5
  },
  {
    name: 'Aisha Khan',
    role: 'Reception Client',
    quote: 'The reception makeup was stunning and lasted all night through dancing and celebrations. Highly recommend!',
    image: 'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4
  }
];

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-purple-900 via-neru-purple to-purple-800 py-24 md:py-32">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
                Elevate Your Beauty with Neru
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
                Premium makeup services for your special occasions. From weddings to birthdays, we create looks that make you shine.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
                <Button size="lg" className="bg-white text-neru-purple hover:bg-gray-100 text-lg">
                  <Link to="/booking">Book Now</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 text-lg">
                  <Link to="/services">Explore Services</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Services Section */}
        <section className="py-16 bg-neru-lightGray">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neru-purple mb-4">Our Services</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover our range of personalized beauty services designed for your special moments.
                From birthdays to weddings, we create looks that reflect your personality.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category) => (
                <CategoryCard 
                  key={category.id}
                  id={category.id}
                  title={category.title}
                  description={category.description}
                  image={category.image}
                  price={category.price}
                />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button size="lg" className="bg-neru-purple hover:bg-purple-600 text-white">
                <Link to="/services">View All Services</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neru-purple mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Booking your beauty service with us is simple and convenient. Follow these easy steps to get started.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center p-6 animate-scale-in" style={{ animationDelay: '100ms' }}>
                <div className="w-16 h-16 bg-neru-pink rounded-full flex items-center justify-center text-neru-purple text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-xl font-semibold mb-3 text-neru-darkGray">Choose Your Service</h3>
                <p className="text-gray-600">Browse our services and select the one that best fits your needs and occasion.</p>
              </div>
              
              <div className="text-center p-6 animate-scale-in" style={{ animationDelay: '300ms' }}>
                <div className="w-16 h-16 bg-neru-pink rounded-full flex items-center justify-center text-neru-purple text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-xl font-semibold mb-3 text-neru-darkGray">Book Appointment</h3>
                <p className="text-gray-600">Select your preferred date and time and pay a 10% booking deposit to confirm.</p>
              </div>
              
              <div className="text-center p-6 animate-scale-in" style={{ animationDelay: '500ms' }}>
                <div className="w-16 h-16 bg-neru-pink rounded-full flex items-center justify-center text-neru-purple text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-xl font-semibold mb-3 text-neru-darkGray">Get Gorgeous</h3>
                <p className="text-gray-600">Visit our center on your appointment day and let our experts work their magic.</p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Button size="lg" className="bg-neru-purple hover:bg-purple-600 text-white">
                <Link to="/booking">Book Your Appointment</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 bg-gradient-to-br from-neru-purple/10 to-neru-pink/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neru-purple mb-4">What Our Clients Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our clients have to say about their experience with us.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard 
                  key={index}
                  name={testimonial.name}
                  role={testimonial.role}
                  quote={testimonial.quote}
                  image={testimonial.image}
                  rating={testimonial.rating}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-neru-darkGray text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Book Your Beauty Session?</h2>
              <p className="text-xl mb-8 text-gray-300">
                Join hundreds of satisfied clients who trust us with their special moments. Book your appointment today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="bg-neru-gold hover:bg-amber-500 text-white text-lg">
                  <Link to="/booking">Book Appointment</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg">
                  <Link to="/contact">Contact Us</Link>
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

export default Index;
