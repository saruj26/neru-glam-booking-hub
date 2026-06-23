import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { toast } from '@/components/ui/use-toast';
import {
  Layers, Plus, Edit2, Trash2, ChevronUp, ChevronDown,
  Star, Eye, EyeOff, Save, X, Check, Search, Sparkles,
} from 'lucide-react';
import {
  type ServiceCategory, newId,
} from '@/lib/galleryUtils';
import { serviceCategoriesApi } from '@/lib/apiService';

/* ═══ helpers ══════════════════════════════════════════════════════ */
const BLANK: Omit<ServiceCategory, 'id' | 'createdAt'> = {
  name: '', slug: '', description: '', thumbnail: '', banner: '',
  order: 0, active: true, featured: false,
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/* ═══ Image Preview ════════════════════════════════════════════════ */
function ImgInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 mb-1.5">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder="https://…/image.jpg"
        className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
      {value && (
        <div className="mt-2 w-full h-24 rounded-xl overflow-hidden border border-gray-100">
          <img src={value} alt="preview" className="w-full h-full object-cover"
            onError={e => (e.currentTarget.style.display = 'none')} />
        </div>
      )}
    </div>
  );
}

/* ═══ Add / Edit Dialog ════════════════════════════════════════════ */
function CategoryDialog({ initial, onSave, onClose }: {
  initial: Partial<ServiceCategory> | null;
  onSave: (c: ServiceCategory) => void;
  onClose: () => void;
}) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({ ...BLANK, ...initial });
  const p = (k: string) => (v: string | boolean | number) =>
    setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.name.trim()) { toast({ title: 'Category name is required', variant: 'destructive' }); return; }
    onSave({
      ...form,
      id: initial?.id ?? newId('cat'),
      slug: form.slug || slugify(form.name),
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    } as ServiceCategory);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
              <Layers size={16} className="text-white" />
            </div>
            <h2 className="font-bold text-gray-900">{isEdit ? 'Edit Category' : 'New Category'}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400 transition">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Category Name *</label>
              <input value={form.name} placeholder="e.g. Bridal Makeup"
                onChange={e => { p('name')(e.target.value); if (!isEdit) p('slug')(slugify(e.target.value)); }}
                className="w-full h-10 rounded-xl border border-gray-200 px-3.5 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">URL Slug</label>
              <input value={form.slug} placeholder="bridal-makeup"
                onChange={e => p('slug')(slugify(e.target.value))}
                className="w-full h-10 rounded-xl border border-gray-200 px-3.5 text-sm font-mono focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Description</label>
              <textarea value={form.description} placeholder="Short description shown to customers…" rows={2}
                onChange={e => p('description')(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
            </div>
          </div>

          <ImgInput label="Thumbnail Image URL" value={form.thumbnail} onChange={p('thumbnail')} />
          <ImgInput label="Banner Image URL (optional)" value={form.banner} onChange={p('banner')} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Display Order</label>
              <input type="number" value={form.order} min={0}
                onChange={e => p('order')(Number(e.target.value))}
                className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm text-center font-bold focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
            </div>
            <div className="flex flex-col gap-3 pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => p('active')(e.target.checked)} className="rounded" />
                <span className="text-sm font-semibold text-gray-700">Active (visible)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => p('featured')(e.target.checked)} className="rounded" />
                <span className="text-sm font-semibold text-gray-700">Featured on home page</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={submit}
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
            <Save size={14} /> {isEdit ? 'Save Changes' : 'Create Category'}
          </button>
          <button onClick={onClose} className="px-4 h-10 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50 transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══ Category Card ════════════════════════════════════════════════ */
function CategoryCard({ cat, onEdit, onDelete, onToggleActive, onToggleFeatured, onMoveUp, onMoveDown, isFirst, isLast }: {
  cat: ServiceCategory;
  onEdit: () => void; onDelete: () => void;
  onToggleActive: () => void; onToggleFeatured: () => void;
  onMoveUp: () => void; onMoveDown: () => void;
  isFirst: boolean; isLast: boolean;
}) {
  return (
    <div className={`bg-white rounded-2xl border-2 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${cat.active ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
      {/* Thumbnail */}
      <div className="relative h-36 bg-gradient-to-br from-purple-50 to-pink-50">
        {cat.thumbnail ? (
          <img src={cat.thumbnail} alt={cat.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Layers size={32} className="text-purple-200" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Order badge */}
        <span className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-extrabold flex items-center justify-center">
          {cat.order}
        </span>
        {/* Featured badge */}
        {cat.featured && (
          <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold" style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)', color: '#fff' }}>
            <Sparkles size={9} /> Featured
          </span>
        )}
        {/* Status */}
        <span className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${cat.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
          {cat.active ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm truncate">{cat.name}</h3>
        <p className="text-gray-400 text-[11px] font-mono mt-0.5">/{cat.slug}</p>
        {cat.description && <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">{cat.description}</p>}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex items-center gap-1.5 flex-wrap">
        <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-bold transition">
          <Edit2 size={11} /> Edit
        </button>
        <button onClick={onToggleActive} title={cat.active ? 'Deactivate' : 'Activate'}
          className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition">
          {cat.active ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
        <button onClick={onToggleFeatured} title={cat.featured ? 'Unfeature' : 'Mark Featured'}
          className="w-8 h-8 rounded-xl border flex items-center justify-center transition"
          style={cat.featured ? { borderColor: '#D4A53F', color: '#D4A53F', background: '#FEF3C7' } : { borderColor: '#E5E7EB', color: '#9CA3AF' }}>
          <Star size={13} fill={cat.featured ? 'currentColor' : 'none'} />
        </button>
        <button onClick={onMoveUp} disabled={isFirst} className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 disabled:opacity-30 hover:bg-gray-50 transition">
          <ChevronUp size={14} />
        </button>
        <button onClick={onMoveDown} disabled={isLast} className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 disabled:opacity-30 hover:bg-gray-50 transition">
          <ChevronDown size={14} />
        </button>
        <button onClick={onDelete} className="w-8 h-8 rounded-xl border border-red-200 flex items-center justify-center text-red-400 hover:bg-red-50 transition">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

/* ═══ Main Page ════════════════════════════════════════════════════ */
export default function AdminServiceCategories() {
  const navigate = useNavigate();
  const [cats, setCats] = useState<ServiceCategory[]>([]);
  const [dialog, setDialog] = useState<{ open: boolean; data: Partial<ServiceCategory> | null }>({ open: false, data: null });
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('neru-admin-auth')) navigate('/admin');
    serviceCategoriesApi.getAll().then(c => setCats(c.sort((a, b) => a.order - b.order))).catch(() => {});
  }, [navigate]);

  const handleSave = (cat: ServiceCategory) => {
    const existing = cats.find(c => c.id === cat.id);
    if (existing) {
      serviceCategoriesApi.update(cat.categoryId ?? cat.id, cat)
        .then(c => { setCats(prev => prev.map(x => x.id === cat.id ? c : x).sort((a, b) => a.order - b.order)); toast({ title: 'Category updated ✓' }); })
        .catch(() => toast({ title: 'Update failed', variant: 'destructive' }));
    } else {
      cat.order = cats.length + 1;
      serviceCategoriesApi.create(cat)
        .then(c => { setCats(prev => [...prev, c].sort((a, b) => a.order - b.order)); toast({ title: 'Category created ✓' }); })
        .catch(() => toast({ title: 'Create failed', variant: 'destructive' }));
    }
    setDialog({ open: false, data: null });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this category?')) return;
    const cat = cats.find(c => c.id === id);
    serviceCategoriesApi.delete(cat?.categoryId ?? id)
      .then(() => { setCats(prev => prev.filter(c => c.id !== id)); toast({ title: 'Category deleted' }); })
      .catch(() => toast({ title: 'Delete failed', variant: 'destructive' }));
  };

  const toggle = (id: string, key: 'active' | 'featured') => {
    const cat = cats.find(c => c.id === id);
    if (!cat) return;
    const updated = { ...cat, [key]: !cat[key] };
    serviceCategoriesApi.update(cat.categoryId ?? id, updated)
      .then(c => setCats(prev => prev.map(x => x.id === id ? c : x)))
      .catch(() => {});
  };

  const move = (id: string, dir: 'up' | 'down') => {
    const idx = cats.findIndex(c => c.id === id);
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === cats.length - 1) return;
    const next = [...cats];
    const swap = dir === 'up' ? idx - 1 : idx + 1;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    const reordered = next.map((c, i) => ({ ...c, order: i + 1 }));
    serviceCategoriesApi.bulkUpdate(reordered)
      .then(() => setCats(reordered))
      .catch(() => {});
  };

  const filtered = cats.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const total = cats.length;
  const active = cats.filter(c => c.active).length;
  const featured = cats.filter(c => c.featured).length;

  const statCards = [
    { label: 'Total Categories', value: total,    gradient: 'linear-gradient(135deg,#9B1B30,#C0392B)' },
    { label: 'Active',           value: active,   gradient: 'linear-gradient(135deg,#059669,#10B981)' },
    { label: 'Inactive',         value: total - active, gradient: 'linear-gradient(135deg,#6B7280,#9CA3AF)' },
    { label: 'Featured',         value: featured, gradient: 'linear-gradient(135deg,#D97706,#F59E0B)' },
  ];

  return (
    <AdminLayout>
      {/* Hero */}
      <div className="px-5 lg:px-7 py-6" style={{ background: 'linear-gradient(135deg,#7B0D1E 0%,#9B1B30 55%,#A83222 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
                <Layers size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white" style={{ fontFamily: "'Playfair Display',serif" }}>Service Categories</h1>
                <p className="text-rose-200 text-xs mt-0.5">Manage all service categories shown to customers</p>
              </div>
            </div>
            <button onClick={() => setDialog({ open: true, data: null })}
              className="flex items-center gap-2 px-5 h-9 rounded-xl font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all"
              style={{ background: 'linear-gradient(135deg,#FCD34D,#F59E0B)', color: '#7B0D1E' }}>
              <Plus size={15} /> Add Category
            </button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
            {statCards.map(({ label, value, gradient }) => (
              <div key={label} className="rounded-2xl p-3.5 text-white" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div className="w-7 h-7 rounded-lg mb-2" style={{ background: gradient }} />
                <p className="text-lg font-extrabold">{value}</p>
                <p className="text-xs text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 lg:p-6 max-w-6xl mx-auto">
        {/* Search */}
        <div className="relative mb-5 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search categories…"
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white" />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Layers size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No categories found</p>
            <button onClick={() => setDialog({ open: true, data: null })}
              className="mt-4 flex items-center gap-2 px-5 h-9 rounded-xl text-white font-bold text-sm mx-auto"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
              <Plus size={14} /> Create First Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((cat, idx) => (
              <CategoryCard
                key={cat.id} cat={cat}
                onEdit={() => setDialog({ open: true, data: cat })}
                onDelete={() => handleDelete(cat.id)}
                onToggleActive={() => toggle(cat.id, 'active')}
                onToggleFeatured={() => toggle(cat.id, 'featured')}
                onMoveUp={() => move(cat.id, 'up')}
                onMoveDown={() => move(cat.id, 'down')}
                isFirst={idx === 0}
                isLast={idx === filtered.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialog */}
      {dialog.open && (
        <CategoryDialog
          initial={dialog.data}
          onSave={handleSave}
          onClose={() => setDialog({ open: false, data: null })}
        />
      )}
    </AdminLayout>
  );
}
