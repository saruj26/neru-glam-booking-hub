import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { toast } from '@/components/ui/use-toast';
import {
  Lightbulb, Plus, Edit2, Trash2, Star, Eye, EyeOff,
  Save, X, Search, Clock, Tag, Sparkles, Check,
} from 'lucide-react';
import {
  TIP_CATEGORIES, newTipId,
  type BeautyTip, formatDate,
} from '@/lib/tipsUtils';
import { beautyTipsApi } from '@/lib/apiService';

/* ══════════════════════════════════════════════════════════════════
   TIP DIALOG — Add / Edit
══════════════════════════════════════════════════════════════════ */
const BLANK: Omit<BeautyTip, 'id' | 'createdAt'> = {
  title: '', excerpt: '', content: '', category: 'General Beauty',
  coverImage: '', tags: [], author: 'Neru Beauty Team',
  readTime: 3, featured: false, active: true,
};

function TipDialog({ initial, onSave, onClose }: {
  initial: Partial<BeautyTip> | null;
  onSave: (t: BeautyTip) => void;
  onClose: () => void;
}) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState<Omit<BeautyTip, 'id' | 'createdAt'>>({ ...BLANK, ...initial });
  const [tagInput, setTagInput] = useState('');

  const p = (k: string) => (v: string | boolean | number | string[]) =>
    setForm(f => ({ ...f, [k]: v }));

  const addTag = () => {
    const t = tagInput.trim();
    if (!t || form.tags.includes(t)) { setTagInput(''); return; }
    p('tags')([...form.tags, t]);
    setTagInput('');
  };
  const removeTag = (t: string) => p('tags')(form.tags.filter(x => x !== t));

  const submit = () => {
    if (!form.title.trim())   { toast({ title: 'Title is required', variant: 'destructive' }); return; }
    if (!form.excerpt.trim()) { toast({ title: 'Excerpt is required', variant: 'destructive' }); return; }
    if (!form.content.trim()) { toast({ title: 'Content is required', variant: 'destructive' }); return; }
    onSave({
      ...form,
      id:        initial?.id ?? newTipId(),
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    } as BeautyTip);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
              <Lightbulb size={16} className="text-white" />
            </div>
            <h2 className="font-bold text-gray-900">{isEdit ? 'Edit Beauty Tip' : 'New Beauty Tip'}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-6 space-y-4 flex-1">

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Title *</label>
            <input value={form.title} onChange={e => p('title')(e.target.value)}
              placeholder="e.g. How to Make Your Bridal Makeup Last All Day"
              className="w-full h-10 rounded-xl border border-gray-200 px-3.5 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Excerpt (Short Summary) *</label>
            <textarea value={form.excerpt} onChange={e => p('excerpt')(e.target.value)} rows={2}
              placeholder="2–3 sentence summary shown on the tips listing card…"
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
          </div>

          {/* Cover image */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Cover Image URL</label>
            <input value={form.coverImage} onChange={e => p('coverImage')(e.target.value)}
              placeholder="https://…/cover.jpg"
              className="w-full h-10 rounded-xl border border-gray-200 px-3.5 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
            {form.coverImage && (
              <div className="mt-2 h-24 rounded-xl overflow-hidden border border-gray-100">
                <img src={form.coverImage} alt="" className="w-full h-full object-cover"
                  onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
          </div>

          {/* Category + Read time + Author */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Category</label>
              <select value={form.category} onChange={e => p('category')(e.target.value)}
                className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:border-purple-400 bg-white">
                {TIP_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Read Time (min)</label>
              <input type="number" min={1} max={60} value={form.readTime}
                onChange={e => p('readTime')(Number(e.target.value))}
                className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm text-center font-bold focus:outline-none focus:border-purple-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Author</label>
              <input value={form.author} onChange={e => p('author')(e.target.value)}
                className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:border-purple-400" />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.tags.map(t => (
                <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                  {t}
                  <button onClick={() => removeTag(t)} className="hover:text-red-500 ml-0.5"><X size={10} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="Type a tag and press Enter"
                className="flex-1 h-9 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:border-purple-400" />
              <button onClick={addTag} className="px-3 h-9 rounded-xl text-white text-sm font-bold"
                style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>Add</button>
            </div>
          </div>

          {/* Full content */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Article Content *</label>
            <p className="text-[11px] text-gray-400 mb-2">
              Use <code className="bg-gray-100 px-1 rounded">**bold text**</code> for headings/emphasis. Separate sections with a blank line.
            </p>
            <textarea value={form.content} onChange={e => p('content')(e.target.value)} rows={14}
              placeholder={"Write the full beauty tip article here…\n\n**Step 1 — Cleanse**\nStart with a gentle cleanser…\n\n**Step 2 — Tone**\nApply a hydrating toner…"}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-sm font-mono leading-relaxed resize-y focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
            <p className="text-[11px] text-gray-400 mt-1">{form.content.length} characters · ~{Math.ceil(form.content.split(' ').length / 200)} min read</p>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'active',   label: 'Published', desc: 'Visible to customers', color: '#059669' },
              { key: 'featured', label: 'Featured',  desc: 'Shown in highlighted section', color: '#D97706' },
            ].map(({ key, label, desc, color }) => (
              <button key={key} onClick={() => p(key)(!(form as Record<string, unknown>)[key])}
                className="flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left"
                style={(form as Record<string, unknown>)[key]
                  ? { borderColor: `${color}50`, background: `${color}08` }
                  : { borderColor: '#F3F4F6', background: 'white' }}>
                <div>
                  <p className="text-sm font-bold text-gray-800">{label}</p>
                  <p className="text-[11px] text-gray-400">{desc}</p>
                </div>
                <div className="relative w-10 h-5 rounded-full transition-colors"
                  style={{ background: (form as Record<string, unknown>)[key] ? color : '#D1D5DB' }}>
                  <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                    style={{ left: (form as Record<string, unknown>)[key] ? '22px' : '2px' }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={submit}
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
            <Save size={14} /> {isEdit ? 'Save Changes' : 'Publish Tip'}
          </button>
          <button onClick={onClose} className="px-5 h-10 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TIP CARD (admin grid)
══════════════════════════════════════════════════════════════════ */
function TipCard({ tip, onEdit, onDelete, onToggle }: {
  tip: BeautyTip;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (k: 'active' | 'featured') => void;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col ${!tip.active ? 'opacity-60' : ''}`}>
      {/* Cover */}
      <div className="relative h-44 bg-gradient-to-br from-purple-50 to-pink-50 flex-shrink-0">
        {tip.coverImage
          ? <img src={tip.coverImage} alt={tip.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center"><Lightbulb size={36} className="text-purple-200" /></div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/50 backdrop-blur-sm text-white">
            {tip.category}
          </span>
          {tip.featured && (
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold"
              style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)', color: '#fff' }}>
              <Sparkles size={8} /> Featured
            </span>
          )}
        </div>
        <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${tip.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
          {tip.active ? 'Live' : 'Draft'}
        </span>
        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white/80 text-[10px]">
          <Clock size={9} /> {tip.readTime} min read
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{tip.title}</h3>
        <p className="text-gray-500 text-xs mt-1.5 line-clamp-2 flex-1">{tip.excerpt}</p>
        {tip.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tip.tags.slice(0, 3).map(t => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">{t}</span>
            ))}
          </div>
        )}
        <p className="text-[10px] text-gray-400 mt-2">{formatDate(tip.createdAt)}</p>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-1.5">
        <button onClick={onEdit}
          className="flex-1 h-8 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-bold flex items-center justify-center gap-1.5 transition">
          <Edit2 size={11} /> Edit
        </button>
        <button onClick={() => onToggle('active')} title={tip.active ? 'Unpublish' : 'Publish'}
          className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition">
          {tip.active ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
        <button onClick={() => onToggle('featured')}
          className="w-8 h-8 rounded-xl border flex items-center justify-center transition"
          style={tip.featured ? { borderColor: '#D4A53F', color: '#D4A53F', background: '#FEF3C7' } : { borderColor: '#E5E7EB', color: '#9CA3AF' }}>
          <Star size={13} fill={tip.featured ? 'currentColor' : 'none'} />
        </button>
        <button onClick={onDelete}
          className="w-8 h-8 rounded-xl border border-red-200 flex items-center justify-center text-red-400 hover:bg-red-50 transition">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════ */
export default function AdminBeautyTips() {
  const navigate = useNavigate();
  const [tips,   setTips]   = useState<BeautyTip[]>([]);
  const [dialog, setDialog] = useState<{ open: boolean; data: Partial<BeautyTip> | null }>({ open: false, data: null });
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');

  useEffect(() => {
    if (!localStorage.getItem('neru-admin-auth')) navigate('/admin');
    beautyTipsApi.getAll().then(setTips).catch(() => {});
  }, [navigate]);

  const handleSave = (tip: BeautyTip) => {
    const exists = tips.find(t => t.id === tip.id);
    if (exists) {
      beautyTipsApi.update(tip.tipId ?? tip.id, tip)
        .then(t => { setTips(prev => prev.map(x => x.id === tip.id ? t : x)); toast({ title: 'Tip updated ✓' }); })
        .catch(() => toast({ title: 'Update failed', variant: 'destructive' }));
    } else {
      beautyTipsApi.create(tip)
        .then(t => { setTips(prev => [t, ...prev]); toast({ title: 'Tip published ✓' }); })
        .catch(() => toast({ title: 'Create failed', variant: 'destructive' }));
    }
    setDialog({ open: false, data: null });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this beauty tip?')) return;
    const tip = tips.find(t => t.id === id);
    beautyTipsApi.delete(tip?.tipId ?? id)
      .then(() => { setTips(prev => prev.filter(t => t.id !== id)); toast({ title: 'Tip deleted' }); })
      .catch(() => toast({ title: 'Delete failed', variant: 'destructive' }));
  };

  const toggle = (id: string, key: 'active' | 'featured') => {
    const tip = tips.find(t => t.id === id);
    if (!tip) return;
    const updated = { ...tip, [key]: !tip[key] };
    beautyTipsApi.update(tip.tipId ?? id, updated)
      .then(t => setTips(prev => prev.map(x => x.id === id ? t : x)))
      .catch(() => {});
  };

  const filtered = tips
    .filter(t => catFilter === 'All' || t.category === catFilter)
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.excerpt.toLowerCase().includes(search.toLowerCase()));

  const stats = [
    { label: 'Total Tips',   value: tips.length,                       gradient: 'linear-gradient(135deg,#9B1B30,#C0392B)' },
    { label: 'Published',    value: tips.filter(t => t.active).length, gradient: 'linear-gradient(135deg,#059669,#10B981)' },
    { label: 'Featured',     value: tips.filter(t => t.featured).length, gradient: 'linear-gradient(135deg,#D97706,#F59E0B)' },
    { label: 'Drafts',       value: tips.filter(t => !t.active).length,  gradient: 'linear-gradient(135deg,#6B7280,#9CA3AF)' },
  ];

  return (
    <AdminLayout>
      {/* Hero */}
      <div className="px-5 lg:px-7 py-6" style={{ background: 'linear-gradient(135deg,#7B0D1E 0%,#9B1B30 55%,#A83222 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
                <Lightbulb size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white" style={{ fontFamily: "'Playfair Display',serif" }}>Beauty Tips</h1>
                <p className="text-rose-200 text-xs mt-0.5">Publish expert beauty advice for your customers</p>
              </div>
            </div>
            <button onClick={() => setDialog({ open: true, data: null })}
              className="flex items-center gap-2 px-5 h-9 rounded-xl font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all"
              style={{ background: 'linear-gradient(135deg,#FCD34D,#F59E0B)', color: '#7B0D1E' }}>
              <Plus size={15} /> New Tip
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
            {stats.map(({ label, value, gradient }) => (
              <div key={label} className="rounded-2xl p-3.5 text-white"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div className="w-7 h-7 rounded-lg mb-2" style={{ background: gradient }} />
                <p className="text-lg font-extrabold">{value}</p>
                <p className="text-xs text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 lg:p-5 max-w-6xl mx-auto">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tips…"
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 bg-white" />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            className="h-9 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none bg-white">
            <option value="All">All Categories</option>
            {TIP_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Lightbulb size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No tips found</p>
            <button onClick={() => setDialog({ open: true, data: null })}
              className="mt-4 flex items-center gap-2 px-5 h-9 rounded-xl text-white font-bold text-sm mx-auto"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
              <Plus size={14} /> Write First Tip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(tip => (
              <TipCard key={tip.id} tip={tip}
                onEdit={() => setDialog({ open: true, data: tip })}
                onDelete={() => handleDelete(tip.id)}
                onToggle={key => toggle(tip.id, key)}
              />
            ))}
          </div>
        )}
      </div>

      {dialog.open && (
        <TipDialog initial={dialog.data} onSave={handleSave} onClose={() => setDialog({ open: false, data: null })} />
      )}
    </AdminLayout>
  );
}
