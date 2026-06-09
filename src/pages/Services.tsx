import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import {
  ArrowRight, Check, Star, Crown, Layers, Award, Shield, Heart, Clock,
  Sparkles, Camera, Scissors,
} from 'lucide-react';

/* ─── Service data (unchanged) ──────────────────────────────────────── */
const services = [
  { category: 'birthday', items: [
    { id: 'birthday-basic',   title: 'Basic Birthday Glam',    description: 'A fresh, youthful look perfect for daytime birthday celebrations.',              image: 'https://images.unsplash.com/photo-1596704017254-9b80443994d7?auto=format&fit=crop&w=800&q=80', price: 'From $50'  },
    { id: 'birthday-premium', title: 'Premium Birthday Glam',  description: 'Elevated makeup with shimmer and glow, perfect for evening parties.',            image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80', price: 'From $80'  },
    { id: 'birthday-themed',  title: 'Themed Birthday Makeup', description: 'Customized makeup to match your birthday theme or costume.',                      image: 'https://images.unsplash.com/photo-1617220275046-90170ad2815f?auto=format&fit=crop&w=800&q=80', price: 'From $100' },
  ]},
  { category: 'puberty', items: [
    { id: 'puberty-traditional', title: 'Traditional Ceremony Look', description: 'Classic makeup style perfect for traditional puberty ceremonies.',              image: 'https://images.unsplash.com/photo-1487412947147-5cdc1cdc5564?auto=format&fit=crop&w=800&q=80', price: 'From $80'  },
    { id: 'puberty-modern',      title: 'Modern Ceremony Look',      description: 'Contemporary makeup with traditional elements for a fresh take.',              image: 'https://images.unsplash.com/photo-1613324446652-383d8b677c7c?auto=format&fit=crop&w=800&q=80', price: 'From $100' },
    { id: 'puberty-premium',     title: 'Premium Ceremony Package',  description: 'Complete beauty package including hair styling and draping assistance.',       image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=800&q=80', price: 'From $150' },
  ]},
  { category: 'reception', items: [
    { id: 'reception-minimal',  title: 'Minimal Reception Glam',  description: 'Subtle, elegant makeup perfect for daytime receptions.',                         image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=800&q=80', price: 'From $100' },
    { id: 'reception-classic',  title: 'Classic Reception Look',  description: 'Timeless makeup with defined eyes and natural lips.',                            image: 'https://images.unsplash.com/photo-1509955252650-8f9d8a65b610?auto=format&fit=crop&w=800&q=80', price: 'From $120' },
    { id: 'reception-glamour',  title: 'Full Glamour Reception',  description: 'Show-stopping makeup with dramatic eyes and perfect contouring.',                image: 'https://images.unsplash.com/photo-1602910344008-22f323cc1817?auto=format&fit=crop&w=800&q=80', price: 'From $150' },
  ]},
  { category: 'wedding', items: [
    { id: 'wedding-minimal',     title: 'Minimal Bridal Look',       description: 'Natural, fresh bridal makeup that enhances your features subtly.',           image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80', price: 'From $150' },
    { id: 'wedding-traditional', title: 'Traditional Bridal Makeup', description: 'Classic bridal look with traditional elements and rich colors.',             image: 'https://images.unsplash.com/photo-1595159901089-7d0b3608515e?auto=format&fit=crop&w=800&q=80', price: 'From $200' },
    { id: 'wedding-luxury',      title: 'Luxury Bridal Package',     description: 'Premium bridal makeup with hair styling, draping assistance, and touch-ups.', image: 'https://images.unsplash.com/photo-1607779097040-17baf87ddab0?auto=format&fit=crop&w=800&q=80', price: 'From $300' },
  ]},
  { category: 'other', items: [
    { id: 'festive-makeup',    title: 'Festive Makeup',           description: 'Special makeup for celebrations like Diwali, Eid, Christmas, etc.',               image: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=800&q=80', price: 'From $70'  },
    { id: 'photoshoot-makeup', title: 'Modeling/Photoshoot Makeup', description: 'Camera-ready makeup that looks perfect in photographs.',                       image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80', price: 'From $120' },
    { id: 'office-makeup',    title: 'Office/Interview Looks',    description: 'Professional makeup for workplace environments and interviews.',                  image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80', price: 'From $60'  },
  ]},
];

/* ─── Packages ──────────────────────────────────────────────────────── */
const packages = [
  {
    icon: Layers,
    name: 'Basic Beauty',
    tagline: 'Everyday Glam',
    price: 'From $50',
    desc: 'Perfect for casual events, birthdays, and everyday occasions when you want to look polished without the full works.',
    features: ['Foundation & concealer', 'Eye shadow & liner', 'Lip colour of your choice', 'Setting spray finish', 'Up to 45-min session'],
    cta: 'Book Basic',
    highlight: false,
    badge: null,
  },
  {
    icon: Star,
    name: 'Standard Beauty',
    tagline: 'Occasion Ready',
    price: 'From $100',
    desc: 'Our most popular package — ideal for receptions, puberty ceremonies, and any event where you want to truly stand out.',
    features: ['Everything in Basic', 'Contouring & highlighting', 'Lash application', 'Long-wear products', 'Up to 75-min session', 'Mini touch-up kit'],
    cta: 'Book Standard',
    highlight: true,
    badge: '★ Most Popular',
  },
  {
    icon: Crown,
    name: 'Premium Bridal',
    tagline: 'Bridal Luxury',
    price: 'From $200',
    desc: 'The ultimate bridal experience. Full-glam artistry, airbrush finish, and a pre-event consultation included.',
    features: ['Everything in Standard', 'Airbrush foundation', 'Pre-event consultation', 'Trial session included', 'Full-day touch-up kit', 'Priority booking slot'],
    cta: 'Book Premium',
    highlight: false,
    badge: null,
  },
];

/* ─── Why Love section data ──────────────────────────────────────────── */
const reasons = [
  { icon: Award,   title: 'Certified Experts',    desc: 'Every artist is professionally trained and certified with 100+ hours of practice.' },
  { icon: Shield,  title: 'Skin-Safe Products',   desc: 'We use only dermatologist-tested, hypoallergenic, premium beauty products.'        },
  { icon: Heart,   title: 'Personalised Styles',  desc: 'Your look is crafted uniquely for your face shape, tone, and event.'               },
  { icon: Clock,   title: 'Punctual & Reliable',  desc: 'We respect your time — sessions start on schedule, always.'                        },
  { icon: Camera,  title: 'Photo-Ready Finish',   desc: 'Our looks are designed to photograph beautifully in all lighting conditions.'       },
  { icon: Scissors, title: 'Full Hair Service',   desc: 'Beyond makeup — we offer complete hair styling for your perfect look.'              },
];

const SH = ({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) => (
  <div className="text-center mb-14">
    <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-neru-purple bg-neru-purple/10 px-4 py-1.5 rounded-full mb-4">{badge}</span>
    <h2 className="text-3xl md:text-4xl font-bold text-neru-darkGray mb-4">{title}</h2>
    <p className="text-gray-500 max-w-2xl mx-auto text-base leading-relaxed">{subtitle}</p>
  </div>
);

const Services = () => (
  <div className="flex flex-col min-h-screen">
    <Header />

    <main className="flex-grow">

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 md:py-28" style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 50%, #8B5CF6 100%)' }}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1588367867362-fb8db888bfdd?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-12" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-white/70 bg-white/15 px-4 py-1.5 rounded-full mb-6">Our Services</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Premium Beauty <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right,#FCD34D,#F59E0B)' }}>Services</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Explore our range of premium makeup services tailored for every special occasion in your life — from intimate celebrations to grand ceremonies.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-white/70">
            {['15+ Services', 'Certified Artists', 'Premium Products', 'Same-Day Booking'].map(t => (
              <span key={t} className="flex items-center gap-1.5"><Check size={14} className="text-neru-gold" />{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Service intro ──────────────────────────────────────── */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            {[
              { icon: Sparkles, label: 'Birthday & Party',  sub: '3 packages'  },
              { icon: Heart,    label: 'Bridal & Wedding',  sub: '3 packages'  },
              { icon: Star,     label: 'Reception Glam',    sub: '3 packages'  },
              { icon: Camera,   label: 'Photoshoot Ready',  sub: '3 packages'  },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="group p-5 rounded-2xl hover:bg-neru-lightGray transition-colors duration-200">
                <div className="w-12 h-12 rounded-2xl bg-neru-purple/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                  <Icon size={20} className="text-neru-purple" />
                </div>
                <p className="font-semibold text-neru-darkGray text-sm">{label}</p>
                <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          ⚠️  EXISTING TABS — NOT MODIFIED (structure/classNames kept identical)
          ════════════════════════════════════════════════════════════ */}
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
                  <Link
                    to="/booking"
                    className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold text-white bg-neru-purple rounded-full shadow-md hover:bg-purple-600 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Book This Service <ArrowRight size={15} />
                  </Link>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* ── Why customers love our services ───────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SH badge="Why Us" title="Why Customers Love Our Services" subtitle="Every service is crafted with care, skill, and premium products to ensure you look and feel your absolute best." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {reasons.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group flex items-start gap-4 p-6 rounded-2xl bg-neru-lightGray hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-gray-100">
                <div className="w-11 h-11 rounded-2xl bg-neru-purple/10 flex items-center justify-center flex-shrink-0 group-hover:bg-neru-purple group-hover:scale-110 transition-all duration-200">
                  <Icon size={18} className="text-neru-purple group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-neru-darkGray mb-1 text-sm">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Before & After ─────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-neru-lightGray to-neru-pink/20">
        <div className="container mx-auto px-4">
          <SH badge="Results" title="Before & After" subtitle="Real transformations from real clients — see what our expert artists can do for you." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { label: 'Bridal Transformation',  before: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', after: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=400&q=80' },
              { label: 'Reception Glow',          before: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', after: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=400&q=80' },
              { label: 'Birthday Party Glam',    before: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80', after: 'https://images.unsplash.com/photo-1596704017254-9b80443994d7?auto=format&fit=crop&w=400&q=80' },
            ].map(({ label, before, after }) => (
              <div key={label} className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white">
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
                <div className="p-4 text-center">
                  <p className="font-semibold text-neru-darkGray text-sm">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Packages ───────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SH badge="Packages & Pricing" title="Choose Your Perfect Package" subtitle="Transparent pricing with no hidden fees. All packages include professional artistry and premium products." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
            {packages.map(({ icon: Icon, name, tagline, price, desc, features, cta, highlight, badge }) => (
              <div
                key={name}
                className={`relative rounded-2xl border flex flex-col overflow-hidden transition-all duration-300
                  ${highlight
                    ? 'border-neru-purple shadow-2xl shadow-neru-purple/20 scale-105'
                    : 'border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1'}`}
              >
                {badge && (
                  <div className="py-1.5 text-center text-xs font-bold text-white tracking-widest uppercase" style={{ background: 'linear-gradient(to right, #7C3AED, #8B5CF6)' }}>
                    {badge}
                  </div>
                )}
                <div className={`p-7 flex flex-col h-full ${badge ? '' : 'pt-7'}`}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${highlight ? 'bg-neru-purple' : 'bg-neru-lightGray'}`}>
                      <Icon size={19} className={highlight ? 'text-white' : 'text-neru-purple'} />
                    </div>
                    <div>
                      <p className="font-bold text-neru-darkGray leading-none">{name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{tagline}</p>
                    </div>
                  </div>
                  <p className="text-3xl font-extrabold text-neru-darkGray mb-3">{price}</p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">{desc}</p>
                  <ul className="space-y-2.5 mb-8 flex-grow">
                    {features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <span className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${highlight ? 'bg-neru-purple' : 'bg-neru-purple/15'}`}>
                          <Check size={10} className={highlight ? 'text-white' : 'text-neru-purple'} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/booking"
                    className={`w-full py-3 rounded-xl text-sm font-semibold text-center transition-all duration-200 ${
                      highlight
                        ? 'bg-neru-purple text-white hover:bg-purple-700 shadow-md'
                        : 'border-2 border-neru-purple/25 text-neru-purple hover:bg-neru-purple hover:text-white'
                    }`}
                  >
                    {cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Custom Requests (original) ─────────────────────────── */}
      <section className="py-16 bg-neru-lightGray">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-neru-purple bg-neru-purple/10 px-4 py-1.5 rounded-full mb-5">Custom Services</span>
            <h2 className="text-3xl font-bold text-neru-darkGray mb-5">Need Something Special?</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Can't find exactly what you're looking for? We offer fully customised makeup services tailored to your specific needs, preferences, and budget.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              style={{ background: 'linear-gradient(135deg,#B45309,#D4A53F)' }}
            >
              Contact Us for Custom Services <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

    </main>
    <Footer />
  </div>
);

export default Services;
