import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Phone, Mail, Clock, ArrowRight, Heart } from 'lucide-react';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const quickLinks = [
  { to: '/',         label: 'Home'             },
  { to: '/services', label: 'Services'         },
  { to: '/gallery',  label: 'Gallery'          },
  { to: '/contact',  label: 'Contact Us'       },
  { to: '/booking',  label: 'Book Appointment' },
  { to: '/login',    label: 'Client Login'     },
];

const serviceLinks = [
  { to: '/service/birthday',  label: 'Birthday Makeup'    },
  { to: '/service/puberty',   label: 'Puberty Ceremony'   },
  { to: '/service/reception', label: 'Reception Makeup'   },
  { to: '/service/wedding',   label: 'Wedding Makeup'     },
  { to: '/services',          label: 'Photoshoot Makeup'  },
  { to: '/services',          label: 'Festive Makeup'     },
];

const contactInfo = [
  { icon: MapPin, text: '123 Beauty Street, Glamour City, GC 12345' },
  { icon: Phone,  text: '(123) 456-7890'                             },
  { icon: Mail,   text: 'info@nerubeauty.com'                        },
  { icon: Clock,  text: 'Mon–Sat · 9 AM – 8 PM'                     },
];

const socials = [
  { icon: InstagramIcon, label: 'Instagram', href: '#', hover: 'hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500' },
  { icon: FacebookIcon,  label: 'Facebook',  href: '#', hover: 'hover:bg-blue-600'  },
  { icon: XIcon,         label: 'X',         href: '#', hover: 'hover:bg-gray-900'  },
];

const Footer = () => (
  <footer className="bg-neru-darkGray text-white">

    {/* ── Appointment CTA strip ──────────────────────────────── */}
    <div style={{ background: 'linear-gradient(135deg,#4C1D95,#6D28D9,#8B5CF6)' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <Sparkles size={18} className="text-neru-gold" />
            </div>
            <div>
              <p className="font-bold text-white leading-none">Ready to look stunning?</p>
              <p className="text-white/70 text-sm mt-0.5">Book your session today — limited slots available.</p>
            </div>
          </div>
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-neru-darkGray bg-neru-gold rounded-full hover:bg-amber-400 hover:shadow-lg hover:shadow-neru-gold/30 hover:-translate-y-0.5 transition-all duration-200 flex-shrink-0"
          >
            Book Appointment <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>

    {/* ── Main grid ──────────────────────────────────────────── */}
    <div className="container mx-auto px-4 pt-14 pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6,#D4A53F)' }}>
              <Sparkles size={15} className="text-white" />
            </div>
            <div className="leading-none">
              <span className="block font-bold text-white text-base">Neru Beauty</span>
              <span className="block text-[9px] text-white/40 tracking-[0.25em] uppercase mt-0.5">Premium Salon</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
            Your destination for premium makeup artistry and personalised beauty experiences for every special occasion.
          </p>
          <div className="flex items-center gap-2.5">
            {socials.map(({ icon: Icon, label, href, hover }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className={`w-9 h-9 rounded-xl bg-white/8 text-gray-400 hover:text-white flex items-center justify-center ${hover} hover:scale-110 transition-all duration-200`}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-neru-pink mb-5">Quick Links</h4>
          <ul className="space-y-2.5">
            {quickLinks.map(({ to, label }) => (
              <li key={to + label}>
                <Link
                  to={to}
                  className="group flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors duration-150"
                >
                  <ArrowRight
                    size={12}
                    className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-neru-pink flex-shrink-0"
                  />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-neru-pink mb-5">Our Services</h4>
          <ul className="space-y-2.5">
            {serviceLinks.map(({ to, label }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="group flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors duration-150"
                >
                  <ArrowRight
                    size={12}
                    className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-neru-pink flex-shrink-0"
                  />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-neru-pink mb-5">Get In Touch</h4>
          <ul className="space-y-4">
            {contactInfo.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 group">
                <div className="w-7 h-7 rounded-lg bg-white/6 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-neru-purple/30 transition-colors duration-200">
                  <Icon size={13} className="text-neru-pink" />
                </div>
                <span className="text-sm text-gray-400 leading-snug group-hover:text-white transition-colors duration-150">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    {/* ── Bottom bar ─────────────────────────────────────────── */}
    <div className="border-t border-white/8">
      <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-500 flex items-center gap-1.5">
          © {new Date().getFullYear()} Neru Beauty Center. Made with
          <Heart size={11} className="text-neru-pink fill-neru-pink" />
          for beauty.
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
          <span className="w-px h-3 bg-white/15" />
          <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
          <span className="w-px h-3 bg-white/15" />
          <a href="#" className="hover:text-gray-300 transition-colors">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
