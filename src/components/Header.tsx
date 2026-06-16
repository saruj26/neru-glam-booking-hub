import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, Sparkles, CalendarCheck } from 'lucide-react';

const navLinks = [
  { to: '/',             label: 'Home'        },
  { to: '/services',     label: 'Services'    },
  { to: '/gallery',      label: 'Gallery'     },
  { to: '/beauty-tips',  label: 'Beauty Tips' },
  { to: '/contact',      label: 'Contact Us'  },
];

const Header = () => {
  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setIsOpen(false), [location.pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/97 backdrop-blur-xl shadow-[0_4px_30px_rgba(139,92,246,0.10)] border-b border-purple-100'
          : 'bg-white/85 backdrop-blur-md border-b border-purple-50',
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[70px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative w-9 h-9">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neru-purple via-purple-500 to-neru-gold flex items-center justify-center shadow-md group-hover:shadow-neru-purple/40 group-hover:scale-105 transition-all duration-200">
                <Sparkles size={16} className="text-white" />
              </div>
            </div>
            <div className="leading-none">
              <span className="block text-[18px] font-bold tracking-tight" style={{ color: '#6D28D9', fontFamily: "'Playfair Display', serif" }}>
                Neru <span className="text-neru-gold">Beauty</span>
              </span>
              <span className="block text-[9px] tracking-[0.25em] uppercase text-gray-400 mt-0.5">Premium Salon</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ to, label }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 select-none',
                    active
                      ? 'text-neru-purple'
                      : 'text-gray-600 hover:text-neru-purple hover:bg-purple-50',
                  )}
                >
                  {label}
                  <span
                    className={cn(
                      'absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-gradient-to-r from-neru-purple to-neru-gold transition-all duration-300',
                      active ? 'w-6 opacity-100' : 'w-0 opacity-0',
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-neru-purple transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-full shadow-md hover:shadow-lg hover:shadow-neru-purple/30 hover:-translate-y-0.5 transition-all duration-200"
              style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #D4A53F 100%)' }}
            >
              <CalendarCheck size={14} />
              Book Appointment
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-purple-50 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'lg:hidden overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="bg-white border-t border-purple-50 px-4 pt-3 pb-5 space-y-1">
          {navLinks.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  active
                    ? 'text-neru-purple bg-purple-50 font-semibold'
                    : 'text-gray-700 hover:text-neru-purple hover:bg-purple-50',
                )}
              >
                {active && <span className="w-1.5 h-1.5 rounded-full bg-neru-purple flex-shrink-0" />}
                {label}
              </Link>
            );
          })}
          <div className="pt-3 flex flex-col gap-2">
            <Link
              to="/login"
              className="w-full py-3 text-sm font-medium text-center text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
            >
              Login / Register
            </Link>
            <Link
              to="/booking"
              className="w-full py-3 text-sm font-semibold text-center text-white rounded-xl shadow-sm transition-all"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)' }}
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
