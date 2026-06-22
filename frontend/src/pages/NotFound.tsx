
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NotFound = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-16 bg-neru-lightGray">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <h1 className="text-9xl font-bold text-neru-purple mb-4">404</h1>
            <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <Button size="lg" className="bg-neru-purple hover:bg-purple-600 text-white">
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
