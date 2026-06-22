import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { toast } from '@/components/ui/use-toast';
import {
  Image, Plus, Edit2, Trash2, Star, Eye, EyeOff, Save, X,
  Search, Sparkles, Tag, Layers, ChevronUp, ChevronDown,
  Zap, TrendingUp, Check,
} from 'lucide-react';
import {
  type GalleryImage, type GalleryCategory, type BeforeAfterPair,
  newId,
} from '@/lib/galleryUtils';
import { galleryApi } from '@/lib/apiService';

/* ═══ shared ════════════════════════════════════════════════════════ */
function ImgPreview({ url }: { url: string }) {
  if (!url) return null;
  return (
    <div className="mt-2 h-20 rounded-xl overflow-hidden border border-gray-100">
      <img src={url} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
    </div>
  );
}

function FInput({ label, value, onChange, placeholder, type = 'text', hint }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

const TAG_OPTS = [
  { value: 'none',     label: 'None'     },
  { value: 'featured', label: '⭐ Featured' },
  { value: 'popular',  label: '🔥 Popular'  },
  { value: 'trending', label: '📈 Trending' },
] as const;

/* ═══════════════════════════════════════════════════════════════════
   TAB 1 — GALLERY IMAGES
═══════════════════════════════════════════════════════════════════ */
function ImageDialog({ initial, categories, onSave, onClose }: {
  initial: Partial<GalleryImage> | null;
  categories: GalleryCategory[];
  onSave: (img: GalleryImage) => void;
  onClose: () => void;
}) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState<Omit<GalleryImage, 'id' | 'createdAt'>>({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    imageUrl: initial?.imageUrl ?? '',
    galleryCategoryId: initial?.galleryCategoryId ?? (categories[0]?.id ?? ''),
    featured: initial?.featured ?? false,
    tag: initial?.tag ?? 'none',
    active: initial?.active ?? true,
    order: initial?.order ?? 0,
  });
  const p = (k: string) => (v: string | boolean | number) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.imageUrl.trim()) { toast({ title: 'Image URL is required', variant: 'destructive' }); return; }
    if (!form.title.trim()) { toast({ title: 'Title is required', variant: 'destructive' }); return; }
    onSave({
      ...form,
      id: initial?.id ?? newId('gi'),
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    } as GalleryImage);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
              <Image size={16} className="text-white" />
            </div>
            <h2 className="font-bold text-gray-900">{isEdit ? 'Edit Image' : 'Add Image'}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400"><X size={16} /></button>
        </div>

        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          <FInput label="Title *" value={form.title} onChange={p('title')} placeholder="e.g. Classic Bridal Elegance" />
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Image URL *</label>
            <input value={form.imageUrl} onChange={e => p('imageUrl')(e.target.value)} placeholder="https://…/image.jpg"
              className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
            <ImgPreview url={form.imageUrl} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => p('description')(e.target.value)} rows={2} placeholder="Short description…"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Gallery Category</label>
              <select value={form.galleryCategoryId} onChange={e => p('galleryCategoryId')(e.target.value)}
                className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:border-purple-400 bg-white">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Tag</label>
              <select value={form.tag} onChange={e => p('tag')(e.target.value)}
                className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:border-purple-400 bg-white">
                {TAG_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Display Order</label>
              <input type="number" value={form.order} min={0}
                onChange={e => p('order')(Number(e.target.value))}
                className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm text-center font-bold focus:outline-none focus:border-purple-400" />
            </div>
            <div className="flex flex-col gap-2 pt-5">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => p('active')(e.target.checked)} /> Active
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => p('featured')(e.target.checked)} /> Featured
              </label>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 flex gap-3 border-t border-gray-100 pt-4">
          <button onClick={submit} className="flex-1 h-10 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
            <Save size={14} /> {isEdit ? 'Save Changes' : 'Add Image'}
          </button>
          <button onClick={onClose} className="px-4 h-10 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function ImageCard({ img, catName, onEdit, onDelete, onToggleActive, onToggleFeatured, onMoveUp, onMoveDown, isFirst, isLast }: {
  img: GalleryImage; catName: string;
  onEdit: () => void; onDelete: () => void;
  onToggleActive: () => void; onToggleFeatured: () => void;
  onMoveUp: () => void; onMoveDown: () => void;
  isFirst: boolean; isLast: boolean;
}) {
  const TAG_COLORS: Record<string, string> = { featured: '#D4A53F', popular: '#EF4444', trending: '#8B5CF6', none: '' };
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all ${!img.active ? 'opacity-55' : ''}`}>
      <div className="relative h-40">
        <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover"
          onError={e => { e.currentTarget.style.display = 'none'; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {img.tag !== 'none' && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white" style={{ background: TAG_COLORS[img.tag] }}>
            {img.tag === 'featured' ? '⭐' : img.tag === 'popular' ? '🔥' : '📈'} {img.tag}
          </span>
        )}
        {img.featured && img.tag === 'none' && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold" style={{ background: '#D4A53F', color: '#fff' }}>
            <Sparkles size={8} className="inline" /> Featured
          </span>
        )}
        <span className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${img.active ? 'bg-green-500' : 'bg-gray-500'}`}>
          {img.active ? 'Active' : 'Off'}
        </span>
        <span className="absolute bottom-2 right-2 w-6 h-6 rounded-md bg-black/60 text-white text-[10px] font-bold flex items-center justify-center">{img.order}</span>
      </div>
      <div className="p-3">
        <p className="text-xs font-bold text-gray-900 truncate">{img.title}</p>
        <p className="text-[10px] text-purple-500 mt-0.5 font-medium">{catName}</p>
        {img.description && <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{img.description}</p>}
      </div>
      <div className="px-3 pb-3 flex gap-1 flex-wrap">
        <button onClick={onEdit} className="flex-1 h-7 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 text-[10px] font-bold flex items-center justify-center gap-1 transition">
          <Edit2 size={9} /> Edit
        </button>
        <button onClick={onToggleActive} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">
          {img.active ? <EyeOff size={11} /> : <Eye size={11} />}
        </button>
        <button onClick={onToggleFeatured} className="w-7 h-7 rounded-lg border flex items-center justify-center"
          style={img.featured ? { borderColor: '#D4A53F', color: '#D4A53F', background: '#FEF3C7' } : { borderColor: '#E5E7EB', color: '#9CA3AF' }}>
          <Star size={11} fill={img.featured ? 'currentColor' : 'none'} />
        </button>
        <button onClick={onMoveUp} disabled={isFirst} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 disabled:opacity-30">
          <ChevronUp size={12} />
        </button>
        <button onClick={onMoveDown} disabled={isLast} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 disabled:opacity-30">
          <ChevronDown size={12} />
        </button>
        <button onClick={onDelete} className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center text-red-400 hover:bg-red-50">
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  );
}

function GalleryImagesTab({ galCats }: { galCats: GalleryCategory[] }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [dialog, setDialog] = useState<{ open: boolean; data: Partial<GalleryImage> | null }>({ open: false, data: null });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    galleryApi.getImages().then(imgs => setImages(imgs.sort((a, b) => a.order - b.order))).catch(() => {});
  }, []);

  const handleSave = (img: GalleryImage) => {
    const exists = images.find(i => i.id === img.id);
    if (exists) {
      galleryApi.updateImage(img.id, img)
        .then(i => { setImages(prev => prev.map(x => x.id === img.id ? i : x)); toast({ title: 'Image updated ✓' }); })
        .catch(() => toast({ title: 'Update failed', variant: 'destructive' }));
    } else {
      galleryApi.createImage({ ...img, order: images.length + 1 })
        .then(i => { setImages(prev => [...prev, i]); toast({ title: 'Image added ✓' }); })
        .catch(() => toast({ title: 'Create failed', variant: 'destructive' }));
    }
    setDialog({ open: false, data: null });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this image?')) return;
    galleryApi.deleteImage(id)
      .then(() => { setImages(prev => prev.filter(i => i.id !== id)); toast({ title: 'Image deleted' }); })
      .catch(() => toast({ title: 'Delete failed', variant: 'destructive' }));
  };

  const toggle = (id: string, key: 'active' | 'featured') => {
    const img = images.find(i => i.id === id);
    if (!img) return;
    galleryApi.updateImage(id, { ...img, [key]: !img[key] })
      .then(i => setImages(prev => prev.map(x => x.id === id ? i : x)))
      .catch(() => {});
  };
  const move = (id: string, dir: 'up' | 'down') => {
    const sorted = [...images].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(i => i.id === id);
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === sorted.length - 1) return;
    const swap = dir === 'up' ? idx - 1 : idx + 1;
    [sorted[idx], sorted[swap]] = [sorted[swap], sorted[idx]];
    const reordered = sorted.map((i, n) => ({ ...i, order: n + 1 }));
    galleryApi.bulkUpdateImages(reordered).then(() => setImages(reordered)).catch(() => {});
  };

  const catName = (id: string) => galCats.find(c => c.id === id)?.name ?? 'Uncategorized';

  const filtered = images
    .filter(i => filter === 'all' || i.galleryCategoryId === filter)
    .filter(i => i.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search images…"
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 bg-white" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="h-9 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:border-purple-400 bg-white">
          <option value="all">All Categories</option>
          {galCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={() => setDialog({ open: true, data: null })}
          className="flex items-center gap-1.5 px-4 h-9 rounded-xl text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
          <Plus size={14} /> Add Image
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total',    value: images.length,                    color: '#7C3AED' },
          { label: 'Active',   value: images.filter(i => i.active).length,   color: '#059669' },
          { label: 'Featured', value: images.filter(i => i.featured).length, color: '#D4A53F' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
            <p className="text-xl font-extrabold" style={{ color }}>{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Image size={36} className="mx-auto mb-3 opacity-30" />
          <p>No images found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((img, idx) => (
            <ImageCard key={img.id} img={img} catName={catName(img.galleryCategoryId)}
              onEdit={() => setDialog({ open: true, data: img })}
              onDelete={() => handleDelete(img.id)}
              onToggleActive={() => toggle(img.id, 'active')}
              onToggleFeatured={() => toggle(img.id, 'featured')}
              onMoveUp={() => move(img.id, 'up')}
              onMoveDown={() => move(img.id, 'down')}
              isFirst={idx === 0} isLast={idx === filtered.length - 1}
            />
          ))}
        </div>
      )}

      {dialog.open && (
        <ImageDialog initial={dialog.data} categories={galCats}
          onSave={handleSave} onClose={() => setDialog({ open: false, data: null })} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TAB 2 — BEFORE & AFTER
═══════════════════════════════════════════════════════════════════ */
function BADialog({ initial, onSave, onClose }: {
  initial: Partial<BeforeAfterPair> | null;
  onSave: (p: BeforeAfterPair) => void;
  onClose: () => void;
}) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({
    title: initial?.title ?? '', description: initial?.description ?? '',
    beforeImage: initial?.beforeImage ?? '', afterImage: initial?.afterImage ?? '',
    serviceType: initial?.serviceType ?? '', active: initial?.active ?? true, featured: initial?.featured ?? false,
  });
  const p = (k: string) => (v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.beforeImage || !form.afterImage) { toast({ title: 'Both before and after images are required', variant: 'destructive' }); return; }
    onSave({ ...form, id: initial?.id ?? newId('ba'), createdAt: initial?.createdAt ?? new Date().toISOString() } as BeforeAfterPair);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{isEdit ? 'Edit' : 'Add'} Before & After</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400"><X size={16} /></button>
        </div>
        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          <FInput label="Title *" value={form.title} onChange={p('title')} placeholder="e.g. Bridal Transformation" />
          <FInput label="Service Type" value={form.serviceType} onChange={p('serviceType')} placeholder="e.g. Bridal Makeup" />
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Before Image URL *</label>
            <input value={form.beforeImage} onChange={e => p('beforeImage')(e.target.value)} placeholder="https://…/before.jpg"
              className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
            <ImgPreview url={form.beforeImage} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">After Image URL *</label>
            <input value={form.afterImage} onChange={e => p('afterImage')(e.target.value)} placeholder="https://…/after.jpg"
              className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
            <ImgPreview url={form.afterImage} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => p('description')(e.target.value)} rows={2}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => p('active')(e.target.checked)} /> Active
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => p('featured')(e.target.checked)} /> Featured
            </label>
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-3 border-t border-gray-100 pt-4">
          <button onClick={submit} className="flex-1 h-10 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
            <Save size={14} /> {isEdit ? 'Save' : 'Add Pair'}
          </button>
          <button onClick={onClose} className="px-4 h-10 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function BeforeAfterTab() {
  const [pairs, setPairs] = useState<BeforeAfterPair[]>([]);
  const [dialog, setDialog] = useState<{ open: boolean; data: Partial<BeforeAfterPair> | null }>({ open: false, data: null });

  useEffect(() => { galleryApi.getBeforeAfter().then(setPairs).catch(() => {}); }, []);

  const handleSave = (pair: BeforeAfterPair) => {
    const exists = pairs.find(p => p.id === pair.id);
    if (exists) {
      galleryApi.updateBeforeAfter(pair.id, pair)
        .then(p => { setPairs(prev => prev.map(x => x.id === pair.id ? p : x)); toast({ title: 'Pair updated ✓' }); })
        .catch(() => toast({ title: 'Update failed', variant: 'destructive' }));
    } else {
      galleryApi.createBeforeAfter(pair)
        .then(p => { setPairs(prev => [...prev, p]); toast({ title: 'Pair added ✓' }); })
        .catch(() => toast({ title: 'Create failed', variant: 'destructive' }));
    }
    setDialog({ open: false, data: null });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <p className="text-sm text-gray-500">{pairs.length} before & after pair{pairs.length !== 1 ? 's' : ''}</p>
        <button onClick={() => setDialog({ open: true, data: null })}
          className="flex items-center gap-1.5 px-4 h-9 rounded-xl text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
          <Plus size={14} /> Add Pair
        </button>
      </div>

      {pairs.length === 0 ? (
        <div className="text-center py-16 text-gray-400"><p>No before & after pairs yet.</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pairs.map(pair => (
            <div key={pair.id} className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${!pair.active ? 'opacity-55' : ''}`}>
              <div className="grid grid-cols-2 h-44">
                <div className="relative overflow-hidden">
                  {pair.beforeImage ? <img src={pair.beforeImage} alt="Before" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">Before</div>}
                  <span className="absolute top-2 left-2 bg-gray-800/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">BEFORE</span>
                </div>
                <div className="relative overflow-hidden">
                  {pair.afterImage ? <img src={pair.afterImage} alt="After" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">After</div>}
                  <span className="absolute top-2 right-2 bg-purple-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">AFTER</span>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{pair.title}</p>
                    {pair.serviceType && <p className="text-[11px] text-purple-500 mt-0.5">{pair.serviceType}</p>}
                    {pair.description && <p className="text-xs text-gray-500 mt-1">{pair.description}</p>}
                  </div>
                  <div className="flex gap-1.5 ml-2">
                    {pair.featured && <span className="text-amber-500"><Star size={12} fill="currentColor" /></span>}
                    {pair.active ? <span className="w-2 h-2 rounded-full bg-green-400 mt-0.5" /> : <span className="w-2 h-2 rounded-full bg-gray-300 mt-0.5" />}
                  </div>
                </div>
                <div className="flex gap-1.5 mt-3">
                  <button onClick={() => setDialog({ open: true, data: pair })}
                    className="flex-1 h-7 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 text-[10px] font-bold flex items-center justify-center gap-1">
                    <Edit2 size={9} /> Edit
                  </button>
                  <button onClick={() => { galleryApi.updateBeforeAfter(pair.id, { ...pair, active: !pair.active }).then(p => setPairs(prev => prev.map(x => x.id === pair.id ? p : x))).catch(() => {}); }}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
                    {pair.active ? <EyeOff size={11} /> : <Eye size={11} />}
                  </button>
                  <button onClick={() => { galleryApi.updateBeforeAfter(pair.id, { ...pair, featured: !pair.featured }).then(p => setPairs(prev => prev.map(x => x.id === pair.id ? p : x))).catch(() => {}); }}
                    className="w-7 h-7 rounded-lg border flex items-center justify-center"
                    style={pair.featured ? { borderColor: '#D4A53F', color: '#D4A53F' } : { borderColor: '#E5E7EB', color: '#9CA3AF' }}>
                    <Star size={11} fill={pair.featured ? 'currentColor' : 'none'} />
                  </button>
                  <button onClick={() => { if (!window.confirm('Delete?')) return; galleryApi.deleteBeforeAfter(pair.id).then(() => { setPairs(prev => prev.filter(p => p.id !== pair.id)); toast({ title: 'Deleted' }); }).catch(() => {}); }}
                    className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center text-red-400">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {dialog.open && <BADialog initial={dialog.data} onSave={handleSave} onClose={() => setDialog({ open: false, data: null })} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TAB 3 — GALLERY CATEGORIES
═══════════════════════════════════════════════════════════════════ */
function GalCatTab() {
  const [cats, setCats] = useState<GalleryCategory[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCover, setNewCover] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    galleryApi.getCategories().then(c => setCats(c.sort((a, b) => a.order - b.order))).catch(() => {});
  }, []);

  const addCat = () => {
    if (!newName.trim()) { toast({ title: 'Name required', variant: 'destructive' }); return; }
    const cat: GalleryCategory = { id: newId('gc'), name: newName, slug: newName.toLowerCase().replace(/\s+/g, '-'), description: newDesc, coverImage: newCover, active: true, order: cats.length + 1 };
    galleryApi.createCategory(cat)
      .then(c => { setCats(prev => [...prev, c].sort((a, b) => a.order - b.order)); toast({ title: 'Category added ✓' }); })
      .catch(() => toast({ title: 'Create failed', variant: 'destructive' }));
    setNewName(''); setNewDesc(''); setNewCover(''); setAdding(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <p className="text-sm text-gray-500">{cats.length} gallery categories</p>
        <button onClick={() => setAdding(a => !a)}
          className="flex items-center gap-1.5 px-4 h-9 rounded-xl text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
          {adding ? <><X size={13} /> Cancel</> : <><Plus size={14} /> Add Category</>}
        </button>
      </div>

      {adding && (
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 mb-5 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <FInput label="Category Name *" value={newName} onChange={setNewName} placeholder="e.g. Bridal Makeup" />
            <FInput label="Cover Image URL" value={newCover} onChange={setNewCover} placeholder="https://…/cover.jpg" />
          </div>
          <FInput label="Description" value={newDesc} onChange={setNewDesc} placeholder="Optional description" />
          <button onClick={addCat} className="flex items-center gap-2 px-5 h-9 rounded-xl text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
            <Check size={13} /> Add Category
          </button>
        </div>
      )}

      <div className="space-y-2">
        {cats.map((cat, idx) => (
          <div key={cat.id} className={`flex items-center gap-3 p-3.5 bg-white rounded-xl border border-gray-100 ${!cat.active ? 'opacity-55' : ''}`}>
            {cat.coverImage && <img src={cat.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
            {!cat.coverImage && <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0"><Layers size={16} className="text-purple-400" /></div>}
            {editId === cat.id ? (
              <input defaultValue={cat.name} autoFocus
                onBlur={e => {
                  const updated = { ...cat, name: e.target.value };
                  galleryApi.updateCategory(cat.id, updated)
                    .then(c => setCats(prev => prev.map(x => x.id === cat.id ? c : x)))
                    .catch(() => {});
                  setEditId(null);
                }}
                className="flex-1 h-8 rounded-lg border border-purple-300 px-3 text-sm focus:outline-none" />
            ) : (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{cat.name}</p>
                <p className="text-[10px] text-gray-400 font-mono">/{cat.slug}</p>
              </div>
            )}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{cat.active ? 'Active' : 'Off'}</span>
            <div className="flex gap-1">
              <button onClick={() => setEditId(cat.id)} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50"><Edit2 size={11} /></button>
              <button onClick={() => {
                galleryApi.updateCategory(cat.id, { ...cat, active: !cat.active })
                  .then(c => setCats(prev => prev.map(x => x.id === cat.id ? c : x))).catch(() => {});
              }} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">{cat.active ? <EyeOff size={11} /> : <Eye size={11} />}</button>
              <button onClick={() => {
                if (!window.confirm('Delete?')) return;
                galleryApi.deleteImage(cat.id).catch(() => {});
                setCats(prev => prev.filter(c => c.id !== cat.id));
                toast({ title: 'Deleted' });
              }} className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center text-red-400 hover:bg-red-50"><Trash2 size={11} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ Main Page ═════════════════════════════════════════════════════ */
export default function AdminGallery() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'images' | 'beforeafter' | 'categories'>('images');
  const [galCats, setGalCats] = useState<GalleryCategory[]>([]);

  useEffect(() => {
    if (!localStorage.getItem('neru-admin-auth')) navigate('/admin');
    galleryApi.getCategories().then(setGalCats).catch(() => {});
  }, [navigate]);

  const TABS = [
    { id: 'images',       label: 'Gallery Images',    icon: Image },
    { id: 'beforeafter',  label: 'Before & After',    icon: Zap   },
    { id: 'categories',   label: 'Gallery Categories', icon: Tag   },
  ] as const;

  return (
    <AdminLayout>
      {/* Hero */}
      <div className="px-5 lg:px-7 py-6" style={{ background: 'linear-gradient(135deg,#7B0D1E 0%,#9B1B30 55%,#A83222 100%)' }}>
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
            <Image size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white" style={{ fontFamily: "'Playfair Display',serif" }}>Gallery Management</h1>
            <p className="text-rose-200 text-xs mt-0.5">Manage images, before & after pairs, and gallery categories</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-5 flex gap-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors"
              style={activeTab === id
                ? { borderColor: '#7C3AED', color: '#7C3AED' }
                : { borderColor: 'transparent', color: '#6B7280' }}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 lg:p-6 max-w-6xl mx-auto">
        {activeTab === 'images'      && <GalleryImagesTab galCats={galCats} />}
        {activeTab === 'beforeafter' && <BeforeAfterTab />}
        {activeTab === 'categories'  && <GalCatTab />}
      </div>
    </AdminLayout>
  );
}
