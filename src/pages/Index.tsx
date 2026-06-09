import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import TestimonialCard from '@/components/TestimonialCard';
import {
  Award, ShieldCheck, Heart, Clock, Users, Star, Layers, CalendarCheck,
  ArrowRight, Sparkles, Search, Check, Lightbulb, Camera, Leaf, TrendingUp,
} from 'lucide-react';

/* ─── Data ──────────────────────────────────────────────────────────── */

const categories = [
  { id: 'birthday',  title: 'Birthday Makeup',    description: 'Special looks for birthday parties, styled to match your personality and theme.',       image: 'https://images.unsplash.com/photo-1596704017254-9b80443994d7?auto=format&fit=crop&w=800&q=80', price: 'From $50'  },
  { id: 'puberty',   title: 'Puberty Ceremony',   description: 'Traditional makeup styles for puberty-related events and cultural ceremonies.',           image: 'https://images.unsplash.com/photo-1487412947147-5cdc1cdc5564?auto=format&fit=crop&w=800&q=80', price: 'From $80'  },
  { id: 'reception', title: 'Reception Makeup',   description: 'Elegant and soft glam looks suitable for wedding receptions or evening functions.',       image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=800&q=80', price: 'From $100' },
  { id: 'wedding',   title: 'Wedding Makeup',     description: 'Bridal makeup styles, from minimal to traditional full bridal glam.',                    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80', price: 'From $150' },
];

const stats = [
  { value: '500+',  label: 'Happy Clients',    icon: Users        },
  { value: '4.9★',  label: 'Average Rating',   icon: Star         },
  { value: '15+',   label: 'Services Offered', icon: Layers       },
  { value: '5 Yrs', label: 'Of Excellence',    icon: Award        },
];

const benefits = [
  { icon: Award,      title: 'Certified Artists',    desc: 'Our team holds professional certifications and has trained under industry-leading makeup academies.',   color: 'from-violet-500 to-neru-purple', bg: 'bg-violet-50'  },
  { icon: ShieldCheck, title: 'Premium Products',   desc: 'We exclusively use top-tier, skin-safe, long-lasting brands — your skin safety is our priority.',        color: 'from-rose-400 to-pink-500',     bg: 'bg-rose-50'    },
  { icon: Heart,      title: 'Personalised Service', desc: 'Every look is bespoke — tailored to your face shape, skin tone, and personal style vision.',            color: 'from-amber-400 to-neru-gold',   bg: 'bg-amber-50'   },
  { icon: Clock,      title: 'Long-lasting Results', desc: 'Our techniques and high-performance products keep your look flawless from morning till the last dance.',  color: 'from-emerald-400 to-teal-500',  bg: 'bg-emerald-50' },
];

const steps = [
  { num: '01', icon: Search,      title: 'Choose Your Service', desc: 'Browse our curated services and choose the perfect look for your occasion and personality.' },
  { num: '02', icon: CalendarCheck, title: 'Book Appointment',  desc: 'Pick your date and time. Confirm your slot with a quick 10% deposit — fast and simple.'  },
  { num: '03', icon: Sparkles,    title: 'Get Gorgeous',        desc: 'Arrive at our studio and let our expert artists create your dream look with precision.'    },
];

const beautyTips = [
  { icon: Lightbulb, title: 'Hydrate Before Any Event', tip: 'Drink plenty of water and apply a good moisturiser 24 hours before your appointment. Well-hydrated skin holds makeup better and gives a naturally radiant base.',     tag: 'Skin Prep'   },
  { icon: Leaf,      title: 'Less Is More for Day Looks', tip: 'For daytime events, opt for lightweight coverage with a dewy finish. Heavy layering in daylight can look cakey. Trust your artist to find your perfect balance.',    tag: 'Technique'   },
  { icon: Camera,    title: 'Flash-Proof Your Look',    tip: 'Ask for a matte primer under eyes and on the forehead to eliminate flash reflection in photos. Your pictures will thank you.',                                        tag: 'Photography' },
];

const bridalShowcaseFeatures = [
  'Pre-event trial session included',
  'Airbrush foundation for a flawless finish',
  'Long-wear 12–16 hour products',
  'On-site touch-up kit provided',
  'Traditional & contemporary styles available',
];

const latestTrends = [
  { title: 'Glass Skin Finish',     desc: 'Ultra-dewy, luminous skin that looks like porcelain glass — a top bridal trend for 2025.',      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=500&q=80', tag: 'Trending'   },
  { title: 'Soft Smoky Eyes',        desc: 'Blurred, lived-in smoky eyes in warm tones — romantic and modern at the same time.',           image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=500&q=80', tag: 'Popular'    },
  { title: 'Gold & Bronze Glam',     desc: 'Rich warm-toned looks with gold shimmer and bronze contouring for an editorial finish.',       image: 'https://images.unsplash.com/photo-1602910344008-22f323cc1817?auto=format&fit=crop&w=500&q=80', tag: 'Editorial'  },
];

const testimonials = [
  { name: 'Priya Shah',  role: 'Wedding Client',   quote: 'My bridal makeup was absolutely perfect! The artist understood exactly what I wanted and made me feel beautiful on my special day.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', rating: 5 },
  { name: 'Meera Patel', role: 'Birthday Client',  quote: 'I loved my birthday makeup — glamorous but still age-appropriate. The team was so professional and warm. Will definitely come back!',  image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80', rating: 5 },
  { name: 'Aisha Khan',  role: 'Reception Client', quote: 'The reception makeup was stunning and lasted all night through dancing and celebrations. Highly recommend Neru Beauty!',              image: 'https://images.unsplash.com/photo-1619946794135-5bc917a27793?auto=format&fit=crop&w=200&q=80', rating: 4 },
];

const SH = ({ badge, title, subtitle, light = false }: { badge: string; title: string; subtitle: string; light?: boolean }) => (
  <div className="text-center mb-14">
    <span className={`inline-block text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-4 ${light ? 'text-white/80 bg-white/15' : 'text-neru-purple bg-neru-purple/10'}`}>
      {badge}
    </span>
    <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${light ? 'text-white' : 'text-neru-darkGray'}`}>{title}</h2>
    <p className={`max-w-2xl mx-auto text-base leading-relaxed ${light ? 'text-white/70' : 'text-gray-500'}`}>{subtitle}</p>
  </div>
);

/* ─── Page ──────────────────────────────────────────────────────────── */
const Index = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-28 md:py-40" style={{ background: 'linear-gradient(135deg, #3B0764 0%, #6D28D9 35%, #8B5CF6 65%, #B45309 100%)' }}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-12" />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-neru-pink/10 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-semibold px-5 py-2 rounded-full mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-neru-gold animate-pulse" />
            Trusted by 500+ Beautiful Clients Across the City
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in" style={{ fontFamily: "'Playfair Display', serif" }}>
            Your Beauty,
            <span className="block text-transparent bg-clip-text mt-1" style={{ backgroundImage: 'linear-gradient(to right, #FCD34D, #F59E0B)' }}>
              Elevated.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '150ms' }}>
            Premium makeup artistry for every milestone — weddings, birthdays, receptions, and beyond. We craft looks that make you feel as beautiful as you are.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <Link to="/booking" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold bg-white text-neru-purple rounded-full shadow-xl hover:shadow-2xl hover:bg-gray-50 hover:-translate-y-1 transition-all duration-200">
              Book Appointment <ArrowRight size={16} />
            </Link>
            <Link to="/services" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border border-white/30 rounded-full hover:bg-white/10 hover:-translate-y-1 transition-all duration-200">
              View Services
            </Link>
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ═════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-4 px-6 py-7 group">
                <div className="w-11 h-11 rounded-2xl bg-neru-purple/10 flex items-center justify-center flex-shrink-0 group-hover:bg-neru-purple/20 transition-colors duration-200">
                  <Icon size={20} className="text-neru-purple" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neru-darkGray">{value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY CHOOSE US ═════════════════════════════════════════ */}
      <section className="py-20 bg-neru-lightGray">
        <div className="container mx-auto px-4">
          <SH badge="Why Choose Us" title="The Neru Beauty Difference" subtitle="We're more than a makeup service — we're your confidence partner for life's most memorable moments." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="group bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                <div className={`w-13 h-13 w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-7 h-7 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
                    <Icon size={15} className="text-white" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-neru-darkGray mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED SERVICES ═════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SH badge="Our Services" title="Beauty Made for Every Occasion" subtitle="From intimate birthdays to grand weddings, our personalised services are designed around your unique story." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => <CategoryCard key={cat.id} {...cat} />)}
          </div>
          <div className="mt-12 text-center">
            <Link to="/services" className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-neru-purple border-2 border-neru-purple/30 rounded-full hover:bg-neru-purple hover:text-white hover:border-neru-purple transition-all duration-200 shadow-sm">
              View All Services <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-neru-lightGray to-neru-pink/25">
        <div className="container mx-auto px-4">
          <SH badge="How It Works" title="Your Glamour in 3 Simple Steps" subtitle="Getting your dream look has never been easier. Let us guide you from first click to final transformation." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {steps.map(({ num, icon: Icon, title, desc }, i) => (
              <div key={num} className="group relative bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <span className="absolute top-4 right-5 text-5xl font-black text-gray-50 select-none leading-none">{num}</span>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6, #D4A53F)' }}>
                  <Icon size={26} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-neru-darkGray mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-neru-purple/10 border border-neru-purple/20 items-center justify-center z-10">
                    <ArrowRight size={12} className="text-neru-purple" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/booking" className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-neru-purple rounded-full shadow-md hover:bg-purple-700 hover:shadow-neru-purple/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              Book Appointment <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ BEFORE & AFTER SHOWCASE ═══════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SH badge="Transformations" title="Before & After" subtitle="Witness the power of professional artistry — real client transformations that speak for themselves." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Bridal Transformation', before: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', after: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=400&q=80' },
              { title: 'Reception Glam',         before: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', after: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=400&q=80' },
              { title: 'Birthday Party Look',   before: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80', after: 'https://images.unsplash.com/photo-1596704017254-9b80443994d7?auto=format&fit=crop&w=400&q=80' },
            ].map(({ title, before, after }) => (
              <div key={title} className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="relative grid grid-cols-2 h-56">
                  <div className="relative overflow-hidden">
                    <img src={before} alt="Before" className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">BEFORE</span>
                  </div>
                  <div className="relative overflow-hidden">
                    <img src={after} alt="After" className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 bg-neru-purple text-white text-[10px] font-bold px-2 py-0.5 rounded">AFTER</span>
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-white/50 z-10" />
                </div>
                <div className="bg-white p-4 border-t border-gray-100">
                  <p className="font-semibold text-neru-darkGray text-center">{title}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/gallery" className="inline-flex items-center gap-2 text-sm font-semibold text-neru-purple hover:text-purple-700 transition-colors">
              View Full Gallery <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-neru-purple/5 via-neru-pink/15 to-purple-50">
        <div className="container mx-auto px-4">
          <SH badge="Client Stories" title="What Our Clients Say" subtitle="Real words from real clients — see why hundreds of women trust Neru Beauty for their most important moments." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => <TestimonialCard key={i} {...t} />)}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
            {['500+ Five-Star Reviews', '4.9 Average Rating', 'Certified Artists', 'Premium Products'].map(t => (
              <span key={t} className="flex items-center gap-2"><Check size={14} className="text-neru-purple" />{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BEAUTY TIPS ═══════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SH badge="Beauty Tips" title="Pro Tips from Our Artists" subtitle="Expert advice to help you prep, maintain, and elevate your beauty routine between salon visits." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {beautyTips.map(({ icon: Icon, title, tip, tag }) => (
              <div key={title} className="group bg-gradient-to-br from-neru-lightGray to-neru-pink/20 rounded-2xl p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-neru-gold/20 text-neru-gold text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{tag}</div>
                <div className="w-12 h-12 rounded-2xl bg-neru-purple/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={22} className="text-neru-purple" />
                </div>
                <h3 className="text-base font-bold text-neru-darkGray mb-3">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BRIDAL SHOWCASE ═══════════════════════════════════════ */}
      <section className="py-20 bg-neru-lightGray">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1607779097040-17baf87ddab0?auto=format&fit=crop&w=700&q=80"
                alt="Bridal Makeup Showcase"
                className="rounded-3xl shadow-2xl w-full object-cover aspect-[4/5]"
              />
              <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl p-4 w-40">
                <p className="text-2xl font-bold text-neru-purple">5.0★</p>
                <p className="text-xs text-gray-500 mt-0.5">Bridal Rating</p>
                <p className="text-xs text-neru-gold font-semibold mt-1">120+ Brides</p>
              </div>
            </div>
            <div>
              <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-neru-purple bg-neru-purple/10 px-4 py-1.5 rounded-full mb-5">Featured</span>
              <h2 className="text-3xl md:text-4xl font-bold text-neru-darkGray mb-5 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Our Signature <span className="text-neru-purple">Bridal</span> Collection
              </h2>
              <p className="text-gray-600 mb-7 leading-relaxed">
                Your wedding day is the most photographed day of your life. Our Luxury Bridal Package ensures you look absolutely breathtaking — from your pre-wedding trial to the final ceremony touch-up.
              </p>
              <ul className="space-y-3 mb-8">
                {bridalShowcaseFeatures.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-neru-purple flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={11} className="text-white" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link to="/booking" className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold text-white bg-neru-purple rounded-full shadow-md hover:bg-purple-700 hover:-translate-y-0.5 transition-all duration-200">
                  Book Bridal Package <ArrowRight size={15} />
                </Link>
                <Link to="/services" className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold text-neru-purple border-2 border-neru-purple/30 rounded-full hover:bg-neru-purple hover:text-white hover:border-neru-purple transition-all duration-200">
                  View Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ LATEST TRENDS ═════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SH badge="2025 Trends" title="Latest Beauty Trends" subtitle="Stay ahead of the curve — our artists are always trained in the freshest techniques and looks from around the world." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestTrends.map(({ title, desc, image, tag }) => (
              <div key={title} className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-white border border-gray-100">
                <div className="relative h-52 overflow-hidden">
                  <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108" />
                  <span className="absolute top-3 left-3 bg-neru-gold text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp size={9} /> {tag}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-neru-darkGray mb-2 group-hover:text-neru-purple transition-colors">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  <Link to="/gallery" className="inline-flex items-center gap-1.5 text-sm font-semibold text-neru-purple mt-4 hover:gap-2.5 transition-all">
                    See Examples <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #4C1D95 40%, #6D28D9 70%, #7C3AED 100%)' }}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-8" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-neru-gold/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <SH badge="Ready to Glow?" title="Book Your Beauty Session Today" subtitle="Join hundreds of satisfied clients who trust us with their most special moments. Your transformation starts with one click." light />
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/booking" className="inline-flex items-center justify-center gap-2 px-9 py-4 text-base font-semibold text-neru-darkGray bg-neru-gold rounded-full hover:bg-amber-400 hover:shadow-lg hover:shadow-neru-gold/30 hover:-translate-y-0.5 transition-all duration-200">
              Book Appointment <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-9 py-4 text-base font-semibold text-white border border-white/30 rounded-full hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </main>
    <Footer />
  </div>
);

export default Index;
