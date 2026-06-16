import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ChevronLeft, ChevronRight, X, ZoomIn, Clock, Tag,
  ArrowRight, Check, Sparkles, ArrowLeft,
} from 'lucide-react';
import type { ServiceData } from '@/components/admin/ServiceForm';

/* ── load service from localStorage ───────────────────────────── */
function loadService(id: string): ServiceData | null {
  try {
    const raw = localStorage.getItem('neru-services');
    if (!raw) return null;
    const list: ServiceData[] = JSON.parse(raw);
    return list.find(s => s.id === id) ?? null;
  } catch { return null; }
}

/* ── Image Carousel ────────────────────────────────────────────── */
function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [active, setActive]     = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const thumbRef                = useRef<HTMLDivElement>(null);

  /* keep thumbnail strip centred on active item */
  useEffect(() => {
    const el = thumbRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [active]);

  /* keyboard nav in lightbox */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === 'ArrowRight') setActive(a => (a + 1) % images.length);
      if (e.key === 'ArrowLeft')  setActive(a => (a - 1 + images.length) % images.length);
      if (e.key === 'Escape')     setLightbox(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, images.length]);

  /* body scroll lock */
  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  const prev = () => setActive(a => (a - 1 + images.length) % images.length);
  const next = () => setActive(a => (a + 1) % images.length);

  if (!images.length) return null;

  return (
    <>
      {/* ── Main viewer ──────────────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-900 shadow-xl group">
        <div className="relative aspect-[4/3] overflow-hidden cursor-zoom-in" onClick={() => setLightbox(true)}>
          {images.map((src, i) => (
            <img key={i} src={src} alt={`${title} ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-400 ${i === active ? 'opacity-100' : 'opacity-0'}`} />
          ))}
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          {/* Zoom hint */}
          <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn size={16} className="text-white" />
          </div>
          {/* Counter */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-bold">
            {active + 1} / {images.length}
          </div>
        </div>

        {/* Prev / Next arrows (visible when > 1 image) */}
        {images.length > 1 && (
          <>
            <button onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100 z-10">
              <ChevronLeft size={18} />
            </button>
            <button onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100 z-10">
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* ── Dot indicators ───────────────────────────────────────── */}
      {images.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {images.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              className="rounded-full transition-all duration-200"
              style={{
                width:  i === active ? '20px' : '8px',
                height: '8px',
                background: i === active ? '#8B5CF6' : '#D1D5DB',
              }} />
          ))}
        </div>
      )}

      {/* ── Thumbnail strip ──────────────────────────────────────── */}
      {images.length > 1 && (
        <div ref={thumbRef}
          className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}>
          {images.map((src, i) => (
            <button key={i} onClick={() => setActive(i)} className="flex-shrink-0">
              <div className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${i === active ? 'border-neru-purple shadow-md shadow-purple-200' : 'border-transparent opacity-60 hover:opacity-90'}`}>
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── Lightbox ─────────────────────────────────────────────── */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center"
          onClick={() => setLightbox(false)}>
          {/* Close */}
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10"
            onClick={() => setLightbox(false)}>
            <X size={20} />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold">
            {active + 1} / {images.length}
          </div>

          {/* Image */}
          <div className="relative flex items-center justify-center w-full h-full px-16"
            onClick={e => e.stopPropagation()}>
            <img src={images[active]} alt={title}
              className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl" />
          </div>

          {/* Arrows */}
          {images.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
                <ChevronLeft size={22} />
              </button>
              <button onClick={e => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
                <ChevronRight size={22} />
              </button>
            </>
          )}

          {/* Bottom thumbnails in lightbox */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] pb-1"
              onClick={e => e.stopPropagation()}>
              {images.map((src, i) => (
                <button key={i} onClick={() => setActive(i)} className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === active ? 'border-white' : 'border-white/20 opacity-50 hover:opacity-80'}`}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

/* ═══ Page ══════════════════════════════════════════════════════════ */
const CATEGORY_LABELS: Record<string, string> = {
  birthday: 'Birthday Makeup', puberty: 'Puberty Ceremony',
  reception: 'Reception Makeup', wedding: 'Wedding / Bridal', other: 'Special Services',
};

export default function ServiceDetail() {
  const { id }    = useParams<{ id: string }>();
  const navigate  = useNavigate();
  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { navigate('/services'); return; }
    const found = loadService(id);
    setService(found);
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-neru-purple border-t-transparent animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-300 mb-2">Service not found</p>
            <Link to="/services" className="text-neru-purple text-sm font-semibold hover:underline">← Back to services</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = service.images?.length ? service.images : [service.image].filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-16 md:py-20"
          style={{ background: 'linear-gradient(135deg,#3B0764 0%,#6D28D9 40%,#8B5CF6 70%,#B45309 100%)' }}>
          <div className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{ backgroundImage: `url(${service.image})` }} />
          <div className="container mx-auto px-4 relative z-10">
            <Link to="/services"
              className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium mb-6 transition-colors">
              <ArrowLeft size={15} /> All Services
            </Link>
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold tracking-widest text-amber-300 uppercase">
                  {CATEGORY_LABELS[service.category] ?? service.category}
                </span>
                {!service.active && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/80 text-white">Unavailable</span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
                style={{ fontFamily: "'Playfair Display',serif" }}>
                {service.title}
              </h1>
              <p className="text-lg text-white/85">{service.description}</p>
              <div className="flex items-center gap-4 mt-5">
                <span className="text-2xl font-extrabold text-amber-300">{service.price}</span>
                {images.length > 1 && (
                  <span className="flex items-center gap-1.5 text-white/60 text-sm">
                    <Sparkles size={13} className="text-amber-300" />
                    {images.length} photos
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Content ──────────────────────────────────────────────── */}
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">

                {/* Left — image carousel */}
                <div>
                  <ImageCarousel images={images} title={service.title} />
                </div>

                {/* Right — details */}
                <div className="space-y-5">
                  {/* Price card */}
                  <div className="rounded-2xl border border-purple-100 overflow-hidden shadow-sm">
                    <div className="px-5 py-4 flex items-center justify-between"
                      style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
                      <div>
                        <p className="text-white/70 text-xs font-medium">Starting Price</p>
                        <p className="text-white text-2xl font-extrabold mt-0.5">{service.price}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                        <Tag size={20} className="text-amber-300" />
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Clock size={14} className="text-purple-400" />
                        <span>Duration varies by package</span>
                      </div>
                      {service.active ? (
                        <Link to={`/booking?category=${service.category}&serviceType=${encodeURIComponent(service.title)}&serviceId=${service.id}`}
                          className="flex items-center justify-center gap-2 w-full h-11 rounded-xl text-white font-bold text-sm shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all"
                          style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)', color: '#fff' }}>
                          Book This Service <ArrowRight size={15} />
                        </Link>
                      ) : (
                        <div className="flex items-center justify-center w-full h-11 rounded-xl bg-gray-100 text-gray-400 font-semibold text-sm">
                          Currently Unavailable
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category badge */}
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-50 border border-purple-100">
                    <Sparkles size={14} className="text-purple-500" />
                    <span className="text-sm font-semibold text-purple-700">
                      {CATEGORY_LABELS[service.category] ?? service.category}
                    </span>
                  </div>

                  {/* What's included — placeholder */}
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-sm font-bold text-gray-800 mb-3">What's Included</p>
                    <div className="space-y-2">
                      {[
                        'Professional consultation',
                        'Full face makeup application',
                        'Premium long-wear products',
                        'Setting spray for lasting finish',
                        'Touch-up tips & guidance',
                      ].map(item => (
                        <div key={item} className="flex items-center gap-2.5">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
                            <Check size={9} className="text-white" />
                          </div>
                          <span className="text-sm text-gray-600">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="py-14 bg-neru-darkGray">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to Look Stunning?</h2>
            <p className="text-gray-300 mb-6 max-w-md mx-auto text-sm">
              Book your {service.title} appointment today and let us create your perfect look.
            </p>
            {service.active && (
              <Link to={`/booking?service=${service.id}&name=${encodeURIComponent(service.title)}`}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold hover:-translate-y-0.5 hover:shadow-lg transition-all"
                style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)', color: '#3B0764' }}>
                Book Now <ArrowRight size={15} />
              </Link>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
