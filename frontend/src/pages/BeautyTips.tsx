import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Clock, ArrowRight, Sparkles, Search, Lightbulb, BookOpen, Star } from 'lucide-react';
import { getActiveTipsAsync, getFeaturedTipsAsync, TIP_CATEGORIES, formatDate, type BeautyTip } from '@/lib/tipsUtils';

/* ── Category pill colours ───────────────────────────────────── */
const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  'Skincare':        { bg: '#EDE9FE', text: '#7C3AED' },
  'Bridal Makeup':   { bg: '#FDF2F8', text: '#BE185D' },
  'Eye Makeup':      { bg: '#EFF6FF', text: '#1D4ED8' },
  'Lip Care':        { bg: '#FFF1F2', text: '#E11D48' },
  'Hair Care':       { bg: '#F0FDF4', text: '#15803D' },
  'Nail Art':        { bg: '#FFF7ED', text: '#C2410C' },
  'Festive Looks':   { bg: '#FFFBEB', text: '#B45309' },
  'General Beauty':  { bg: '#F9F5FF', text: '#9333EA' },
};
function catStyle(cat: string) { return CAT_COLORS[cat] ?? { bg: '#F3F4F6', text: '#374151' }; }

/* ── Shared badge ───────────────────────────────────────────── */
const SectionBadge = ({ text }: { text: string }) => (
  <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-neru-purple bg-neru-purple/10 px-4 py-1.5 rounded-full mb-4">
    {text}
  </span>
);

/* ── Tip Card ───────────────────────────────────────────────── */
function TipCard({ tip }: { tip: BeautyTip }) {
  const cs = catStyle(tip.category);
  return (
    <Link to={`/beauty-tips/${tip.tipId || tip.id}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Cover */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 flex-shrink-0">
        {tip.coverImage
          ? <img src={tip.coverImage} alt={tip.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          : <div className="w-full h-full flex items-center justify-center"><Lightbulb size={40} className="text-purple-200" /></div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {tip.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold text-white"
            style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)' }}>
            <Sparkles size={8} /> Featured
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ background: cs.bg, color: cs.text }}>
            {tip.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-2.5">
          <span className="flex items-center gap-1"><Clock size={10} /> {tip.readTime} min read</span>
          <span>·</span>
          <span>{formatDate(tip.createdAt)}</span>
        </div>
        <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-neru-purple transition-colors line-clamp-2 mb-2">
          {tip.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">{tip.excerpt}</p>

        {/* Tags */}
        {tip.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tip.tags.slice(0, 3).map(t => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">{t}</span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center gap-1.5 mt-4 text-neru-purple text-xs font-bold group-hover:gap-2.5 transition-all">
          Read Full Tip <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

/* ── Featured card (larger, left-side hero) ─────────────────── */
function FeaturedCard({ tip }: { tip: BeautyTip }) {
  const cs = catStyle(tip.category);
  return (
    <Link to={`/beauty-tips/${tip.tipId || tip.id}`}
      className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col min-h-[380px]">
      {tip.coverImage
        ? <img src={tip.coverImage} alt={tip.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        : <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600" />
      }
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="relative z-10 mt-auto p-7">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ background: cs.bg, color: cs.text }}>{tip.category}</span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold"
            style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)', color: '#fff' }}>
            <Star size={8} fill="currentColor" /> Featured
          </span>
        </div>
        <h3 className="text-white font-extrabold text-xl md:text-2xl leading-tight mb-2 line-clamp-2"
          style={{ fontFamily: "'Playfair Display',serif" }}>
          {tip.title}
        </h3>
        <p className="text-white/75 text-sm leading-relaxed line-clamp-2 mb-4">{tip.excerpt}</p>
        <div className="flex items-center gap-3 text-white/60 text-xs">
          <span className="flex items-center gap-1"><Clock size={11} /> {tip.readTime} min read</span>
          <span>·</span>
          <span className="flex items-center gap-1.5 font-bold text-amber-300">Read Now <ArrowRight size={12} /></span>
        </div>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
export default function BeautyTips() {
  const [allTips, setAllTips]   = useState<BeautyTip[]>([]);
  const [featured, setFeatured] = useState<BeautyTip[]>([]);
  const [catFilter, setCatFilter] = useState('All');
  const [search, setSearch]     = useState('');

  useEffect(() => {
    getActiveTipsAsync().then(setAllTips).catch(() => {});
    getFeaturedTipsAsync(3).then(setFeatured).catch(() => {});
  }, []);

  const filtered = allTips
    .filter(t => catFilter === 'All' || t.category === catFilter)
    .filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    );

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFBFF]">
      <Header />
      <main className="flex-grow">

        {/* ── Hero ────────────────────────────────────────────── */}
        <section className="relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#3B0764 0%,#6D28D9 45%,#8B5CF6 75%,#92400E 100%)', paddingTop: '80px', paddingBottom: '90px' }}>
          {/* Soft background texture */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487412947147-5cdc1cdc5564?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-10" />
          {/* Decorative blobs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle,#D4A53F,transparent)' }} />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle,#8B5CF6,transparent)' }} />
          {/* Bottom page-colour fade */}
          <div className="absolute -bottom-1 left-0 right-0 h-16 bg-gradient-to-t from-[#FAFBFF] to-transparent pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10 text-center">
            {/* Badge — white/amber on dark bg */}
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 backdrop-blur-sm px-5 py-2 rounded-full text-white text-xs font-semibold mb-6 tracking-wider uppercase">
              <Lightbulb size={13} className="text-amber-300" /> Expert Beauty Advice
            </div>

            <h1 className="font-extrabold text-white mb-5 leading-tight"
              style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.2rem,6vw,3.75rem)' }}>
              Beauty Tips &amp;
              <span className="block mt-1" style={{ color: '#FCD34D' }}>Expert Guides</span>
            </h1>

            <p className="text-white/80 max-w-2xl mx-auto mb-6 leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem,2vw,1.125rem)' }}>
              Discover professional beauty secrets, makeup tutorials, and skincare advice
              from our expert artists at Neru Beauty Studio.
            </p>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm mb-8">
              <BookOpen size={14} className="text-amber-300" />
              <span>{allTips.length} expert tips published</span>
            </div>

            {/* Search bar */}
            <div className="max-w-lg mx-auto relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tips, categories, or tags…"
                className="w-full h-13 pl-11 pr-5 rounded-2xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white shadow-xl"
                style={{ height: '52px' }}
              />
            </div>
          </div>
        </section>

        {/* ── Featured Tips ───────────────────────────────────── */}
        {featured.length > 0 && !search && catFilter === 'All' && (
          <section className="py-16 bg-[#FAFBFF]">
            <div className="container mx-auto px-4">
              <div className="mb-8">
                <SectionBadge text="Featured" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Editor's Picks</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                {featured.map(tip => <FeaturedCard key={tip.id} tip={tip} />)}
              </div>
            </div>
          </section>
        )}

        {/* ── Category filter ─────────────────────────────────── */}
        <section className="py-4 bg-white border-y border-gray-100 sticky top-[70px] z-40 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
              {['All', ...TIP_CATEGORIES].map(cat => (
                <button key={cat} onClick={() => setCatFilter(cat)}
                  className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                  style={catFilter === cat
                    ? { background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)', color: '#fff', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }
                    : { background: '#F3F4F6', color: '#6B7280' }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── All Tips Grid ───────────────────────────────────── */}
        <section className="py-14">
          <div className="container mx-auto px-4">
            {/* Result count */}
            {(search || catFilter !== 'All') && (
              <p className="text-sm text-gray-500 mb-6">
                {filtered.length} tip{filtered.length !== 1 ? 's' : ''} found
                {catFilter !== 'All' ? ` in "${catFilter}"` : ''}
                {search ? ` for "${search}"` : ''}
              </p>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Lightbulb size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No tips found</p>
                <p className="text-sm mt-1">Try a different category or search term</p>
                <button onClick={() => { setSearch(''); setCatFilter('All'); }}
                  className="mt-4 px-5 h-9 rounded-xl text-white text-sm font-bold mx-auto block"
                  style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map(tip => <TipCard key={tip.id} tip={tip} />)}
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <section className="py-16 bg-neru-darkGray">
          <div className="container mx-auto px-4 text-center">
            <Sparkles size={28} className="text-neru-gold mx-auto mb-3" />
            <h2 className="text-3xl font-bold text-white mb-3">Ready to Glow?</h2>
            <p className="text-gray-300 mb-7 max-w-md mx-auto">
              Put these tips into action with a professional session at Neru Beauty Studio.
            </p>
            <Link to="/booking"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold rounded-full hover:-translate-y-0.5 hover:shadow-lg transition-all"
              style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)', color: '#3B0764' }}>
              Book an Appointment <ArrowRight size={15} />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
