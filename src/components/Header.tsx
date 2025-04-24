
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neru-pink/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-neru-purple">Neru</span>
            <span className="text-lg font-medium text-neru-darkGray">Beauty Center</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-neru-darkGray hover:text-neru-purple transition-colors">
              Home
            </Link>
            <Link to="/services" className="text-neru-darkGray hover:text-neru-purple transition-colors">
              Services
            </Link>
            <Link to="/booking" className="text-neru-darkGray hover:text-neru-purple transition-colors">
              Book Now
            </Link>
            <Link to="/contact" className="text-neru-darkGray hover:text-neru-purple transition-colors">
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="border-neru-purple text-neru-purple hover:bg-neru-purple/10">
              <Link to="/login">Log in</Link>
            </Button>
            <Button className="bg-neru-purple hover:bg-purple-600 text-white">
              <Link to="/register">Register</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-neru-darkGray focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 bg-white z-40 pt-20 px-6 transition-transform duration-300 md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col space-y-6">
          <Link 
            to="/" 
            className="text-lg text-neru-darkGray hover:text-neru-purple transition-colors"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link 
            to="/services" 
            className="text-lg text-neru-darkGray hover:text-neru-purple transition-colors"
            onClick={toggleMenu}
          >
            Services
          </Link>
          <Link 
            to="/booking" 
            className="text-lg text-neru-darkGray hover:text-neru-purple transition-colors"
            onClick={toggleMenu}
          >
            Book Now
          </Link>
          <Link 
            to="/contact" 
            className="text-lg text-neru-darkGray hover:text-neru-purple transition-colors"
            onClick={toggleMenu}
          >
            Contact
          </Link>
          <div className="pt-6 flex flex-col space-y-4">
            <Button variant="outline" className="border-neru-purple text-neru-purple hover:bg-neru-purple/10 w-full">
              <Link to="/login" onClick={toggleMenu}>Log in</Link>
            </Button>
            <Button className="bg-neru-purple hover:bg-purple-600 text-white w-full">
              <Link to="/register" onClick={toggleMenu}>Register</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
