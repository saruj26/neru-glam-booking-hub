import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Clock, ArrowLeft, ArrowRight, Sparkles, Calendar, User,
  Tag, Lightbulb, Share2, ChevronRight,
} from 'lucide-react';
import { getTipById, getActiveTips, formatDate, type BeautyTip } from '@/lib/tipsUtils';

/* ── Category colours ───────────────────────────────────────── */
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

/* ── Content renderer ────────────────────────────────────────── */
function renderContent(raw: string) {
  return raw.split('\n').map((line, i) => {
    if (!line.trim()) return <div key={i} className="h-4" />;

    // Parse **bold** inline
    const parts: React.ReactNode[] = [];
    const regex = /\*\*(.+?)\*\*/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(line)) !== null) {
      if (m.index > last) parts.push(line.slice(last, m.index));
      parts.push(<strong key={m.index} className="font-bold text-gray-900">{m[1]}</strong>);
      last = m.index + m[0].length;
    }
    if (last < line.length) parts.push(line.slice(last));

    // Heading-like lines that start with **
    if (line.trimStart().startsWith('**') && line.trimEnd().endsWith('**')) {
      const heading = line.replace(/^\*\*|\*\*$/g, '').trim();
      return (
        <h3 key={i} className="text-lg font-extrabold text-gray-900 mt-6 mb-2 leading-snug
          border-l-4 border-neru-purple pl-3">
          {heading}
        </h3>
      );
    }

    return (
      <p key={i} className="text-gray-700 leading-relaxed text-[15px]">{parts}</p>
    );
  });
}

/* ── Related tip mini card ───────────────────────────────────── */
function RelatedCard({ tip }: { tip: BeautyTip }) {
  const cs = catStyle(tip.category);
  return (
    <Link to={`/beauty-tips/${tip.id}`}
      className="group flex gap-3 p-3 rounded-xl hover:bg-purple-50 transition-colors">
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-purple-100">
        {tip.coverImage
          ? <img src={tip.coverImage} alt={tip.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center"><Lightbulb size={18} className="text-purple-300" /></div>
        }
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <span className="text-[10px] font-bold mb-1" style={{ color: cs.text }}>{tip.category}</span>
        <p className="text-sm font-semibold text-gray-800 group-hover:text-neru-purple transition-colors leading-snug line-clamp-2">
          {tip.title}
        </p>
        <span className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
          <Clock size={9} /> {tip.readTime} min read
        </span>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
export default function BeautyTipDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tip, setTip]         = useState<BeautyTip | null>(null);
  const [related, setRelated] = useState<BeautyTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied]   = useState(false);

  useEffect(() => {
    if (!id) { navigate('/beauty-tips'); return; }
    const found = getTipById(id);
    if (!found || !found.active) { navigate('/beauty-tips'); return; }
    setTip(found);

    // Related: same category, exclude current, max 3
    const all = getActiveTips().filter(t => t.id !== id);
    const sameCat = all.filter(t => t.category === found.category);
    setRelated((sameCat.length >= 2 ? sameCat : all).slice(0, 3));
    setLoading(false);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, navigate]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!tip) return null;

  const cs = catStyle(tip.category);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFBFF]">
      <Header />
      <main className="flex-grow">

        {/* ── Hero / Cover ────────────────────────────────────── */}
        <div className="relative w-full overflow-hidden" style={{ maxHeight: 500, minHeight: 320 }}>
          {tip.coverImage
            ? <img src={tip.coverImage} alt={tip.title}
                className="w-full object-cover" style={{ maxHeight: 500, minHeight: 320, objectPosition: 'center 30%' }} />
            : <div className="w-full flex items-center justify-center"
                style={{ minHeight: 320, background: 'linear-gradient(135deg,#6D28D9,#8B5CF6,#A855F7)' }}>
                <Lightbulb size={72} className="text-white/40" />
              </div>
          }
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Back button */}
          <Link to="/beauty-tips"
            className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md
              text-white text-sm font-semibold hover:bg-white/20 transition-colors border border-white/20">
            <ArrowLeft size={14} /> All Tips
          </Link>

          {/* Hero text */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="max-w-3xl">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-white/60 text-xs mb-3">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight size={12} />
                <Link to="/beauty-tips" className="hover:text-white transition-colors">Beauty Tips</Link>
                <ChevronRight size={12} />
                <span className="text-white/90 truncate max-w-[160px]">{tip.title}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: cs.bg, color: cs.text }}>
                  {tip.category}
                </span>
                {tip.featured && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold text-white"
                    style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)' }}>
                    <Sparkles size={10} /> Featured
                  </span>
                )}
              </div>
              <h1 className="text-white font-extrabold text-2xl md:text-4xl leading-tight mb-3"
                style={{ fontFamily: "'Playfair Display',serif" }}>
                {tip.title}
              </h1>
              <p className="text-white/75 text-sm md:text-base leading-relaxed max-w-2xl">{tip.excerpt}</p>
            </div>
          </div>
        </div>

        {/* ── Meta bar ────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-5 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-1.5"><User size={14} className="text-purple-400" /> {tip.author}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-purple-400" /> {formatDate(tip.createdAt)}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} className="text-purple-400" /> {tip.readTime} min read</span>
            </div>
            <button onClick={handleShare}
              className="flex items-center gap-1.5 text-sm text-purple-600 font-semibold hover:text-purple-800 transition-colors">
              <Share2 size={14} />
              {copied ? 'Copied!' : 'Share'}
            </button>
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-10">

          {/* Article */}
          <article className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
              <div className="space-y-3">
                {renderContent(tip.content)}
              </div>

              {/* Tags */}
              {tip.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag size={13} className="text-gray-400" />
                    {tip.tags.map(tag => (
                      <Link key={tag} to={`/beauty-tips?q=${encodeURIComponent(tag)}`}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Author card */}
              <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white text-lg font-extrabold"
                  style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
                  {tip.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{tip.author}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Professional Beauty Artist · Neru Beauty Studio</p>
                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                    Expert in bridal, festive, and editorial makeup with years of experience creating stunning looks for every occasion.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Booking CTA ─────────────────────────────────── */}
            <div className="mt-6 rounded-2xl overflow-hidden shadow-sm border border-purple-100"
              style={{ background: 'linear-gradient(135deg,#3B0764,#6D28D9,#8B5CF6)' }}>
              <div className="p-7 md:p-10 text-center">
                <Sparkles size={28} className="text-amber-300 mx-auto mb-3" />
                <h3 className="text-2xl font-extrabold text-white mb-2"
                  style={{ fontFamily: "'Playfair Display',serif" }}>
                  Ready to Experience This?
                </h3>
                <p className="text-white/75 text-sm mb-6 max-w-sm mx-auto">
                  Let our professional artists bring this look to life for you at Neru Beauty Studio.
                </p>
                <Link to="/booking"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold hover:-translate-y-0.5 hover:shadow-lg transition-all"
                  style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)', color: '#3B0764' }}>
                  Book an Appointment <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-5">

            {/* Related */}
            {related.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-extrabold text-gray-900 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                  <Lightbulb size={14} className="text-neru-purple" /> Related Tips
                </h3>
                <div className="space-y-1">
                  {related.map(r => <RelatedCard key={r.id} tip={r} />)}
                </div>
                <Link to="/beauty-tips"
                  className="mt-4 flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors">
                  View all tips <ArrowRight size={12} />
                </Link>
              </div>
            )}

            {/* Quick Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-extrabold text-gray-900 mb-4 text-sm uppercase tracking-wide">About This Tip</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="font-semibold px-2.5 py-0.5 rounded-full text-xs" style={{ background: cs.bg, color: cs.text }}>
                    {tip.category}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Read Time</span>
                  <span className="font-semibold text-gray-800">{tip.readTime} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Published</span>
                  <span className="font-semibold text-gray-800">{formatDate(tip.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Author</span>
                  <span className="font-semibold text-gray-800 text-right max-w-[140px] truncate">{tip.author}</span>
                </div>
              </div>
            </div>

            {/* Browse more */}
            <div className="rounded-2xl p-5 text-center"
              style={{ background: 'linear-gradient(135deg,#EDE9FE,#FCE7F3)' }}>
              <Lightbulb size={22} className="text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-800 mb-1">More Expert Tips</p>
              <p className="text-xs text-gray-500 mb-4">Explore our full library of beauty guides</p>
              <Link to="/beauty-tips"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-bold transition-all hover:shadow-md"
                style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
                Browse All Tips <ArrowRight size={12} />
              </Link>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
