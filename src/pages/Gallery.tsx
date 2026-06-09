import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { X, ZoomIn, Camera, ArrowRight, Sparkles, Instagram } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  featured: boolean;
}

const galleryItems: GalleryItem[] = [
  // Bridal
  { id: 'b1', title: 'Classic Bridal Elegance', category: 'bridal', image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80', description: 'Timeless bridal look with soft glam', featured: true },
  { id: 'b2', title: 'Traditional Bridal Glow', category: 'bridal', image: 'https://images.unsplash.com/photo-1595159901089-7d0b3608515e?auto=format&fit=crop&w=600&q=80', description: 'Rich traditional bridal makeup', featured: false },
  { id: 'b3', title: 'Modern Bridal Radiance', category: 'bridal', image: 'https://images.unsplash.com/photo-1607779097040-17baf87ddab0?auto=format&fit=crop&w=600&q=80', description: 'Contemporary dewy bridal finish', featured: true },
  // Reception
  { id: 'r1', title: 'Soft Reception Glam', category: 'reception', image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=600&q=80', description: 'Elegant soft glam for receptions', featured: false },
  { id: 'r2', title: 'Full Glam Reception', category: 'reception', image: 'https://images.unsplash.com/photo-1602910344008-22f323cc1817?auto=format&fit=crop&w=600&q=80', description: 'Bold and beautiful reception look', featured: true },
  { id: 'r3', title: 'Festive Reception', category: 'reception', image: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=600&q=80', description: 'Vibrant festive reception makeup', featured: false },
  // Party
  { id: 'p1', title: 'Birthday Party Glam', category: 'party', image: 'https://images.unsplash.com/photo-1596704017254-9b80443994d7?auto=format&fit=crop&w=600&q=80', description: 'Fun and glam birthday look', featured: false },
  { id: 'p2', title: 'Evening Shimmer', category: 'party', image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80', description: 'Shimmer and glow for evening events', featured: false },
  { id: 'p3', title: 'Themed Glam', category: 'party', image: 'https://images.unsplash.com/photo-1617220275046-90170ad2815f?auto=format&fit=crop&w=600&q=80', description: 'Custom themed party makeup', featured: false },
  // Hair
  { id: 'h1', title: 'Elegant Bridal Updo', category: 'hair', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80', description: 'Classic bridal updo styling', featured: true },
  { id: 'h2', title: 'Flowing Waves', category: 'hair', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80', description: 'Soft romantic waves styling', featured: false },
  // Facial
  { id: 'f1', title: 'Radiance Facial', category: 'facial', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80', description: 'Skin rejuvenating facial treatment', featured: false },
  { id: 'f2', title: 'Deep Cleanse Glow', category: 'facial', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', description: 'Deep cleansing and brightening', featured: true },
  // Nail Art
  { id: 'n1', title: 'Bridal Nail Art', category: 'nails', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80', description: 'Intricate bridal nail designs', featured: false },
  // Before & After
  { id: 'ba1', title: 'Bridal Transformation', category: 'before-after', image: 'https://images.unsplash.com/photo-1487412947147-5cdc1cdc5564?auto=format&fit=crop&w=600&q=80', description: 'Complete bridal transformation', featured: true },
  { id: 'ba2', title: 'Evening Glow', category: 'before-after', image: 'https://images.unsplash.com/photo-1509955252650-8f9d8a65b610?auto=format&fit=crop&w=600&q=80', description: 'Evening glam transformation', featured: false },
];

const categories = [
  { id: 'all',          label: 'All Work'           },
  { id: 'bridal',       label: 'Bridal Makeup'      },
  { id: 'reception',    label: 'Reception Makeup'   },
  { id: 'party',        label: 'Party Makeup'       },
  { id: 'hair',         label: 'Hair Styling'       },
  { id: 'nails',        label: 'Nail Art'           },
  { id: 'facial',       label: 'Facial Treatments'  },
  { id: 'before-after', label: 'Before & After'     },
];

const beforeAfterPairs = [
  {
    title: 'Bridal Transformation',
    before: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80',
    after:  'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=500&q=80',
    desc: 'From natural to breathtaking bridal glam',
  },
  {
    title: 'Reception Look',
    before: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
    after:  'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=500&q=80',
    desc: 'Elegant reception glam perfected',
  },
  {
    title: 'Birthday Party Glam',
    before: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&q=80',
    after:  'https://images.unsplash.com/photo-1596704017254-9b80443994d7?auto=format&fit=crop&w=500&q=80',
    desc: 'Party-ready transformation that wows',
  },
];

const SectionBadge = ({ text }: { text: string }) => (
  <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-neru-purple bg-neru-purple/10 px-4 py-1.5 rounded-full mb-4">
    {text}
  </span>
);

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightbox, setLightbox] = useState<{ open: boolean; item: GalleryItem | null }>({
    open: false, item: null,
  });

  const filtered = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter(g => g.category === activeCategory);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox({ open: false, item: null });
    };
    if (lightbox.open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox.open]);

  useEffect(() => {
    document.body.style.overflow = lightbox.open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightbox.open]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">

        {/* ── Hero ───────────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-24 md:py-32" style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 40%, #8B5CF6 70%, #D4A53F 100%)' }}>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900/30" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <SectionBadge text="Our Portfolio" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-5 leading-tight">
              Beauty Artistry
              <span className="block text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #FCD34D, #D4A53F)' }}>
                Gallery
              </span>
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Explore our curated collection of transformations — from radiant brides to glam party looks, every image tells a story of artistry and confidence.
            </p>
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
              <Camera size={16} />
              <span>{galleryItems.length}+ Professional Looks</span>
            </div>
          </div>
        </section>

        {/* ── Category Filters ───────────────────────────────────── */}
        <section className="py-10 bg-white border-b border-gray-100 sticky top-[70px] z-40">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveCategory(id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === id
                      ? 'bg-neru-purple text-white shadow-md shadow-neru-purple/25'
                      : 'bg-gray-100 text-gray-600 hover:bg-neru-purple/10 hover:text-neru-purple'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Gallery Grid ───────────────────────────────────────── */}
        <section className="py-16 bg-neru-lightGray">
          <div className="container mx-auto px-4">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Camera size={48} className="mx-auto mb-4 opacity-40" />
                <p className="text-lg">No images in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setLightbox({ open: true, item })}
                    className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white font-semibold text-sm leading-tight">{item.title}</p>
                      <p className="text-white/70 text-xs mt-1">{item.description}</p>
                    </div>
                    <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <ZoomIn size={14} className="text-white" />
                    </div>
                    {item.featured && (
                      <div className="absolute top-3 left-3 bg-neru-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles size={9} /> Featured
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Featured Transformations ──────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <SectionBadge text="Featured Work" />
              <h2 className="text-3xl md:text-4xl font-bold text-neru-darkGray mb-4">Our Best Transformations</h2>
              <p className="text-gray-500 max-w-xl mx-auto">Hand-picked looks from our most memorable client sessions.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {galleryItems.filter(g => g.featured).slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setLightbox({ open: true, item })}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <img src={item.image} alt={item.title} className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="text-xs text-neru-gold font-semibold uppercase tracking-wider">{item.category}</span>
                    <h3 className="text-white font-bold text-lg mt-1">{item.title}</h3>
                    <p className="text-white/70 text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Before & After ────────────────────────────────────── */}
        <section className="py-20 bg-gradient-to-br from-neru-lightGray to-neru-pink/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <SectionBadge text="Transformations" />
              <h2 className="text-3xl md:text-4xl font-bold text-neru-darkGray mb-4">Before & After</h2>
              <p className="text-gray-500 max-w-xl mx-auto">See the remarkable difference our expert artists make for every client.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {beforeAfterPairs.map(({ title, before, after, desc }) => (
                <div key={title} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="grid grid-cols-2 h-52">
                    <div className="relative overflow-hidden">
                      <img src={before} alt="Before" className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-gray-800/70 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">BEFORE</span>
                    </div>
                    <div className="relative overflow-hidden">
                      <img src={after} alt="After" className="w-full h-full object-cover" />
                      <span className="absolute top-2 right-2 bg-neru-purple/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">AFTER</span>
                    </div>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 w-px h-full bg-white/60" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-neru-darkGray">{title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Instagram-inspired row ─────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <SectionBadge text="Follow Our Journey" />
              <h2 className="text-3xl font-bold text-neru-darkGray mb-3 flex items-center justify-center gap-3">
                <Instagram size={28} className="text-neru-purple" />
                @NeruBeauty
              </h2>
              <p className="text-gray-500">Follow us for daily beauty inspiration and behind-the-scenes moments.</p>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
              {galleryItems.slice(0, 8).map((item) => (
                <div key={item.id} className="group aspect-square rounded-xl overflow-hidden cursor-pointer">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-90"
                  />
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <a
                href="#"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-neru-purple/30 text-neru-purple text-sm font-semibold hover:bg-neru-purple hover:text-white transition-all duration-200"
              >
                <Instagram size={16} />
                Follow on Instagram
              </a>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="py-16 bg-neru-darkGray">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Love What You See?</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">Book your appointment today and let us create your perfect look.</p>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-neru-darkGray bg-neru-gold rounded-full hover:bg-amber-400 hover:shadow-lg hover:shadow-neru-gold/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              Book Your Session
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

      </main>

      <Footer />

      {/* ── Lightbox ──────────────────────────────────────────── */}
      {lightbox.open && lightbox.item && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox({ open: false, item: null })}
        >
          <button
            className="absolute top-5 right-5 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
            onClick={() => setLightbox({ open: false, item: null })}
          >
            <X size={20} />
          </button>
          <div
            className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={lightbox.item.image}
              alt={lightbox.item.title}
              className="w-full max-h-[65vh] object-cover"
            />
            <div className="p-5">
              <span className="text-xs font-bold tracking-widest text-neru-purple uppercase">{lightbox.item.category}</span>
              <h3 className="text-xl font-bold text-neru-darkGray mt-1">{lightbox.item.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{lightbox.item.description}</p>
              <div className="mt-4 flex gap-3">
                <Link
                  to="/booking"
                  className="flex-1 py-2.5 text-sm font-semibold text-center text-white bg-neru-purple rounded-xl hover:bg-purple-600 transition-colors"
                >
                  Book This Look
                </Link>
                <button
                  onClick={() => setLightbox({ open: false, item: null })}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
