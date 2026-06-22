import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { X, ZoomIn, Camera, ArrowRight, Sparkles, Instagram } from 'lucide-react';
import {
  getActiveGalleryImages, getActiveGalleryCategories,
  getActiveBeforeAfterPairs, getFeaturedGalleryImages,
  type GalleryImage,
} from '@/lib/galleryUtils';

const SectionBadge = ({ text }: { text: string }) => (
  <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-neru-purple bg-neru-purple/10 px-4 py-1.5 rounded-full mb-4">
    {text}
  </span>
);

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightbox, setLightbox] = useState<{ open: boolean; item: GalleryImage | null }>({ open: false, item: null });

  /* ── live data from admin ─────────────────────────────────────── */
  const images       = getActiveGalleryImages();
  const galCats      = getActiveGalleryCategories();
  const beforeAfter  = getActiveBeforeAfterPairs();
  const featured     = getFeaturedGalleryImages(6);

  const categories = [
    { id: 'all', name: 'All Work' },
    ...galCats.map(c => ({ id: c.id, name: c.name })),
  ];

  const filtered = activeCategory === 'all'
    ? images
    : images.filter(img => img.galleryCategoryId === activeCategory);

  /* ── keyboard + scroll lock ───────────────────────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox({ open: false, item: null }); };
    if (lightbox.open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox.open]);

  useEffect(() => {
    document.body.style.overflow = lightbox.open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightbox.open]);

  const catName = (catId: string) => galCats.find(c => c.id === catId)?.name ?? catId;

  const tagBadge = (img: GalleryImage) => {
    if (!img.featured && img.tag === 'none') return null;
    const text = img.tag !== 'none' ? img.tag : 'featured';
    const colors: Record<string, string> = { featured: '#D4A53F', popular: '#EF4444', trending: '#8B5CF6' };
    return (
      <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white"
        style={{ background: colors[text] ?? '#D4A53F' }}>
        <Sparkles size={8} /> {text.charAt(0).toUpperCase() + text.slice(1)}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-24 md:py-32"
          style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 40%, #8B5CF6 70%, #D4A53F 100%)' }}>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900/30" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <SectionBadge text="Our Portfolio" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-5 leading-tight">
              Beauty Artistry
              <span className="block text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(to right, #FCD34D, #D4A53F)' }}>
                Gallery
              </span>
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Explore our curated collection of transformations — from radiant brides to glam party looks, every image tells a story of artistry and confidence.
            </p>
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
              <Camera size={16} />
              <span>{images.length}+ Professional Looks</span>
            </div>
          </div>
        </section>

        {/* ── Category Filters ─────────────────────────────────── */}
        <section className="py-8 bg-white border-b border-gray-100 sticky top-[70px] z-40">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(({ id, name }) => (
                <button key={id} onClick={() => setActiveCategory(id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === id
                      ? 'bg-neru-purple text-white shadow-md shadow-neru-purple/25'
                      : 'bg-gray-100 text-gray-600 hover:bg-neru-purple/10 hover:text-neru-purple'
                  }`}>
                  {name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Gallery Grid ─────────────────────────────────────── */}
        <section className="py-14 bg-neru-lightGray">
          <div className="container mx-auto px-4">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Camera size={48} className="mx-auto mb-4 opacity-40" />
                <p className="text-lg">No images in this category yet.</p>
                <p className="text-sm mt-1">Check back soon — our admin is adding new work!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map(item => (
                  <div key={item.id}
                    onClick={() => setLightbox({ open: true, item })}
                    className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <img src={item.imageUrl} alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white font-semibold text-sm leading-tight">{item.title}</p>
                      <p className="text-white/70 text-xs mt-1">{item.description}</p>
                    </div>
                    <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <ZoomIn size={14} className="text-white" />
                    </div>
                    {tagBadge(item)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Featured Transformations ──────────────────────────── */}
        {featured.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <SectionBadge text="Featured Work" />
                <h2 className="text-3xl md:text-4xl font-bold text-neru-darkGray mb-4">Our Best Transformations</h2>
                <p className="text-gray-500 max-w-xl mx-auto">Hand-picked looks from our most memorable client sessions.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featured.slice(0, 3).map(item => (
                  <div key={item.id}
                    onClick={() => setLightbox({ open: true, item })}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="text-xs text-neru-gold font-semibold uppercase tracking-wider">
                        {catName(item.galleryCategoryId)}
                      </span>
                      <h3 className="text-white font-bold text-lg mt-1">{item.title}</h3>
                      <p className="text-white/70 text-sm mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Before & After ────────────────────────────────────── */}
        {beforeAfter.length > 0 && (
          <section className="py-20 bg-gradient-to-br from-neru-lightGray to-neru-pink/20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <SectionBadge text="Transformations" />
                <h2 className="text-3xl md:text-4xl font-bold text-neru-darkGray mb-4">Before & After</h2>
                <p className="text-gray-500 max-w-xl mx-auto">See the remarkable difference our expert artists make for every client.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {beforeAfter.map(pair => (
                  <div key={pair.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                    <div className="grid grid-cols-2 h-52 relative">
                      <div className="relative overflow-hidden">
                        <img src={pair.beforeImage} alt="Before" className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-gray-800/70 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">BEFORE</span>
                      </div>
                      <div className="relative overflow-hidden">
                        <img src={pair.afterImage} alt="After" className="w-full h-full object-cover" />
                        <span className="absolute top-2 right-2 bg-neru-purple/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">AFTER</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-neru-darkGray">{pair.title}</h3>
                      {pair.serviceType && <p className="text-xs text-neru-purple mt-0.5 font-medium">{pair.serviceType}</p>}
                      {pair.description && <p className="text-gray-500 text-sm mt-1">{pair.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Instagram-style row ───────────────────────────────── */}
        {images.length >= 8 && (
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
                {images.slice(0, 8).map(item => (
                  <div key={item.id} className="group aspect-square rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => setLightbox({ open: true, item })}>
                    <img src={item.imageUrl} alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-90" />
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <a href="#" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-neru-purple/30 text-neru-purple text-sm font-semibold hover:bg-neru-purple hover:text-white transition-all duration-200">
                  <Instagram size={16} /> Follow on Instagram
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="py-16 bg-neru-darkGray">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Love What You See?</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">Book your appointment today and let us create your perfect look.</p>
            <Link to="/booking"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-neru-darkGray bg-neru-gold rounded-full hover:bg-amber-400 hover:shadow-lg hover:shadow-neru-gold/30 hover:-translate-y-0.5 transition-all duration-200">
              Book Your Session
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

      </main>
      <Footer />

      {/* ── Lightbox ─────────────────────────────────────────── */}
      {lightbox.open && lightbox.item && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox({ open: false, item: null })}>
          <button className="absolute top-5 right-5 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
            onClick={() => setLightbox({ open: false, item: null })}>
            <X size={20} />
          </button>
          <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <img src={lightbox.item.imageUrl} alt={lightbox.item.title} className="w-full max-h-[65vh] object-cover" />
            <div className="p-5">
              <span className="text-xs font-bold tracking-widest text-neru-purple uppercase">
                {catName(lightbox.item.galleryCategoryId)}
              </span>
              <h3 className="text-xl font-bold text-neru-darkGray mt-1">{lightbox.item.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{lightbox.item.description}</p>
              <div className="mt-4 flex gap-3">
                <Link to="/booking"
                  className="flex-1 py-2.5 text-sm font-semibold text-center text-white bg-neru-purple rounded-xl hover:bg-purple-600 transition-colors">
                  Book This Look
                </Link>
                <button onClick={() => setLightbox({ open: false, item: null })}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
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
