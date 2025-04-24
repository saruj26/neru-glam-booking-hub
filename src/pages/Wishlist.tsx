
import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useWishlist } from '@/contexts/WishlistContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-neru-purple to-purple-800 py-16">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">My Wishlist</h1>
              <p className="text-xl text-white/90">Your favorite beauty services saved for later</p>
            </div>
          </div>
        </section>
        
        {/* Wishlist Content */}
        <section className="py-12 bg-neru-lightGray">
          <div className="container mx-auto px-4">
            {wishlist.length === 0 ? (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-neru-purple mb-4">Your wishlist is empty</h2>
                <p className="text-gray-600 mb-8">Browse our services and add your favorites to your wishlist.</p>
                <Button asChild className="bg-neru-gold hover:bg-amber-500 text-white">
                  <Link to="/services">Browse Services</Link>
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-neru-purple mb-8">Your Wishlist ({wishlist.length} items)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((item) => (
                    <Card key={item.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                      <div className="relative h-60">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 transition-colors"
                          aria-label="Remove from wishlist"
                        >
                          <X className="h-5 w-5 text-neru-purple" />
                        </button>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-neru-purple mb-2">{item.title}</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-neru-gold font-semibold">{item.price}</span>
                          <span className="text-sm text-gray-500">{item.category}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-6 pt-0 flex justify-between">
                        <Button asChild variant="outline" className="border-neru-purple text-neru-purple hover:bg-neru-purple/10 w-[48%]">
                          <Link to={`/services/${item.id}`}>View Details</Link>
                        </Button>
                        <Button asChild className="bg-neru-gold hover:bg-amber-500 text-white w-[48%]">
                          <Link to={`/booking?service=${item.id}`}>Book Now</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
