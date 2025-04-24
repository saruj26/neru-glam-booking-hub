
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Heart, Star, Send } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useWishlist } from '@/contexts/WishlistContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Sample data - in a real app, this would come from an API/database
const servicesData = {
  'birthday-basic': {
    id: 'birthday-basic',
    title: 'Basic Birthday Glam',
    description: 'A fresh, youthful look perfect for daytime birthday celebrations.',
    fullDescription: 'Our Basic Birthday Glam service provides a natural, fresh-faced look that enhances your features without being too dramatic. Perfect for daytime celebrations, this makeup look includes light foundation, subtle eyeshadow, mascara, and a neutral lip color that complements your skin tone. This service takes approximately 45-60 minutes and is ideal for teens and adults who want a polished but casual birthday look.',
    image: 'https://images.unsplash.com/photo-1596704017254-9b80443994d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    price: '$50',
    duration: '45-60 minutes',
    category: 'Birthday Makeup',
    includes: ['Foundation & concealer', 'Eyebrow styling', 'Natural eyeshadow', 'Mascara', 'Blush & highlight', 'Neutral lip color'],
    reviews: [
      { id: 1, user: 'Sarah M.', rating: 5, comment: 'Loved my birthday makeup! Looked natural but polished.' },
      { id: 2, user: 'Jennifer L.', rating: 4, comment: 'Great service, lasted all day through my party.' }
    ]
  },
  'birthday-premium': {
    id: 'birthday-premium',
    title: 'Premium Birthday Glam',
    description: 'Elevated makeup with shimmer and glow, perfect for evening parties.',
    fullDescription: 'The Premium Birthday Glam offers a more dramatic and festive look that\'s perfect for evening celebrations. This service includes full coverage foundation, contouring, highlighting, dramatic eye makeup with shimmer or glitter options, false lashes, and a bold lip color of your choice. The result is a glamorous, photo-ready look that will make you stand out on your special day. This service takes approximately 60-75 minutes.',
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    price: '$80',
    duration: '60-75 minutes',
    category: 'Birthday Makeup',
    includes: ['Full coverage foundation', 'Contouring & highlighting', 'Dramatic eyeshadow with shimmer', 'False lashes', 'Defined brows', 'Bold lip color'],
    reviews: [
      { id: 1, user: 'Aisha K.', rating: 5, comment: 'Absolutely stunning! Got so many compliments at my party.' },
      { id: 2, user: 'Rebecca T.', rating: 5, comment: 'Worth every penny! The false lashes really made my eyes pop.' }
    ]
  },
  // More service items would be defined here
};

// Sample bookings data - in a real app, this would come from an API
const bookings = [
  { date: new Date(2025, 3, 25), status: 'booked', user: 'other' }, // April 25, 2025 (booked by someone else)
  { date: new Date(2025, 3, 28), status: 'booked', user: 'current' }, // April 28, 2025 (booked by current user)
];

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const service = servicesData[serviceId as keyof typeof servicesData];
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  
  if (!service) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold text-neru-purple mb-4">Service Not Found</h1>
            <p className="mb-6">The service you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/services">Back to Services</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleWishlistToggle = () => {
    if (isInWishlist(service.id)) {
      removeFromWishlist(service.id);
    } else {
      addToWishlist({
        id: service.id,
        title: service.title,
        image: service.image,
        price: service.price,
        category: service.category
      });
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating before submitting your review.",
        variant: "destructive"
      });
      return;
    }

    if (reviewText.trim() === '') {
      toast({
        title: "Error",
        description: "Please write a review comment.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would send the review to the backend
    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback!",
    });

    // Reset form
    setUserRating(0);
    setReviewText('');
  };

  // Get booked dates by others and by current user
  const bookedByOthers = bookings
    .filter(booking => booking.user === 'other')
    .map(booking => booking.date);
  
  const bookedByUser = bookings
    .filter(booking => booking.user === 'current')
    .map(booking => booking.date);
  
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Service Info */}
              <div className="lg:col-span-2">
                <div className="bg-neru-lightGray p-6 rounded-lg mb-8">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-neru-purple">About this Service</h2>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={handleWishlistToggle}
                      className={`border-neru-purple ${isInWishlist(service.id) ? 'bg-neru-purple/10' : ''}`}
                    >
                      <Heart className={`h-5 w-5 ${isInWishlist(service.id) ? 'fill-neru-purple text-neru-purple' : 'text-neru-purple'}`} />
                    </Button>
                  </div>
                  <p className="text-gray-700 mb-6">{service.fullDescription}</p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xl font-semibold text-neru-gold">{service.price}</span>
                    <span className="text-gray-600">Duration: {service.duration}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-neru-purple mb-3">What's Included:</h3>
                  <ul className="space-y-2 mb-6">
                    {service.includes.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-neru-gold mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button size="lg" asChild className="w-full bg-neru-purple hover:bg-purple-600 text-white">
                    <Link to={`/booking?service=${service.id}`}>Book Now</Link>
                  </Button>
                </div>
                
                {/* Reviews Section */}
                <div className="bg-white">
                  <h2 className="text-2xl font-bold text-neru-purple mb-6">Customer Reviews</h2>
                  
                  <div className="space-y-6 mb-8">
                    {service.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-center mb-2">
                          <div className="flex mr-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'text-neru-gold' : 'text-gray-300'}`} 
                                fill={i < review.rating ? 'currentColor' : 'none'} 
                              />
                            ))}
                          </div>
                          <span className="font-semibold">{review.user}</span>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-neru-purple text-neru-purple hover:bg-neru-purple/10">
                        Write a Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle className="text-center text-neru-purple">Write Your Review</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <div className="text-center mb-2">Your Rating</div>
                          <div className="flex justify-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                onClick={() => setUserRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className={`h-8 w-8 cursor-pointer ${
                                  star <= (hoverRating || userRating) ? 'text-neru-gold' : 'text-gray-300'
                                }`}
                                fill={star <= (hoverRating || userRating) ? 'currentColor' : 'none'}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="review" className="block mb-2 text-sm font-medium">
                            Your Review
                          </label>
                          <Textarea
                            id="review"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Share your experience with this service..."
                            className="min-h-[120px]"
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button type="submit" className="bg-neru-gold hover:bg-amber-500 text-white">
                            Submit Review <Send className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              {/* Booking Calendar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-white p-6 border border-gray-200 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-neru-purple mb-4">Availability</h3>
                  <p className="text-gray-600 mb-4">Select a date to check availability and book your appointment.</p>
                  
                  <div className="mb-6">
                    <Calendar 
                      mode="single"
                      className="p-3 pointer-events-auto"
                      bookedDates={bookedByOthers}
                      userBookedDates={bookedByUser}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-200 rounded-full mr-2"></div>
                      <span className="text-sm">Booked by others</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-200 rounded-full mr-2"></div>
                      <span className="text-sm">Your bookings</span>
                    </div>
                  </div>
                  
                  <Button size="lg" asChild className="w-full mt-4 bg-neru-gold hover:bg-amber-500 text-white">
                    <Link to={`/booking?service=${service.id}`}>Check Specific Times</Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleWishlistToggle}
                    className={`w-full mt-4 border-neru-purple text-neru-purple hover:bg-neru-purple/10 flex items-center justify-center gap-2`}
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist(service.id) ? 'fill-neru-purple' : ''}`} />
                    {isInWishlist(service.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Related Services */}
        <section className="py-12 bg-neru-lightGray">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-neru-purple mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* We would normally map through related services here */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1617220275046-90170ad2815f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Related service" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-neru-purple mb-2">Themed Birthday Makeup</h3>
                  <p className="text-gray-600 mb-4">Customized makeup to match your birthday theme or costume.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-neru-gold font-semibold">From $100</span>
                    <Button size="sm" asChild className="bg-neru-purple hover:bg-purple-600 text-white">
                      <Link to="/services/birthday-themed">View Details</Link>
                    </Button>
                  </div>
                </div>
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
