import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { toast } from '@/components/ui/use-toast';
import {
  Tag, Plus, Edit2, Trash2, ToggleLeft, ToggleRight,
  X, Save, CalendarDays, Percent, IndianRupee, CheckCircle,
} from 'lucide-react';
import {
  type Offer,
} from '@/lib/paymentUtils';
import { offersApi } from '@/lib/apiService';

/* ─── Helpers ───────────────────────────────────────────────────────────── */
const SERVICE_OPTIONS = [
  { value: 'all',       label: 'All Services'     },
  { value: 'birthday',  label: 'Birthday Makeup'  },
  { value: 'puberty',   label: 'Puberty Ceremony' },
  { value: 'reception', label: 'Reception Makeup' },
  { value: 'wedding',   label: 'Wedding Makeup'   },
  { value: 'other',     label: 'Other Services'   },
];

const today = () => new Date().toISOString().split('T')[0];
const isActive = (o: Offer) => {
  const t = today();
  return o.active && o.startDate <= t && o.endDate >= t;
};

function newOffer(): Omit<Offer, 'id'> {
  return {
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    applicableServices: ['all'],
    startDate: today(),
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    active: true,
    code: '',
  };
}

/* ─── Status Badge ──────────────────────────────────────────────────────── */
function StatusBadge({ offer }: { offer: Offer }) {
  const live = isActive(offer);
  const t = today();
  const expired = offer.endDate < t;
  const scheduled = offer.startDate > t;

  if (!offer.active) return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-500">Inactive</span>;
  if (expired) return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-600">Expired</span>;
  if (scheduled) return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600">Scheduled</span>;
  if (live) return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 flex items-center gap-1 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />Live</span>;
  return null;
}

/* ─── Offer Dialog ──────────────────────────────────────────────────────── */
interface DialogProps {
  offer: Partial<Offer> | null;
  onClose: () => void;
  onSave: (o: Partial<Offer>) => void;
}

function OfferDialog({ offer, onClose, onSave }: DialogProps) {
  const [form, setForm] = useState<Partial<Offer>>(offer ?? newOffer());
  const patch = (p: Partial<Offer>) => setForm(f => ({ ...f, ...p }));

  const toggleService = (val: string) => {
    if (val === 'all') { patch({ applicableServices: ['all'] }); return; }
    const cur = form.applicableServices?.filter(s => s !== 'all') ?? [];
    if (cur.includes(val)) patch({ applicableServices: cur.filter(s => s !== val) || ['all'] });
    else patch({ applicableServices: [...cur, val] });
  };

  const handleSubmit = () => {
    if (!form.name?.trim()) { toast({ title: 'Offer name is required', variant: 'destructive' }); return; }
    if (!form.discountValue || form.discountValue <= 0) { toast({ title: 'Discount value must be > 0', variant: 'destructive' }); return; }
    if (!form.applicableServices?.length) { toast({ title: 'Select at least one service', variant: 'destructive' }); return; }
    if ((form.startDate ?? '') > (form.endDate ?? '')) { toast({ title: 'End date must be after start date', variant: 'destructive' }); return; }
    onSave(form);
  };

  const services = form.applicableServices ?? ['all'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)' }}>
              <Tag size={15} className="text-white" />
            </div>
            <h2 className="font-bold text-gray-900">{(offer?.id || offer?.offerId) ? 'Edit Offer' : 'New Offer'}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"><X size={16} /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Offer Name *</label>
            <input value={form.name ?? ''} onChange={e => patch({ name: e.target.value })}
              placeholder="e.g. Bridal Season Special"
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Description</label>
            <textarea value={form.description ?? ''} onChange={e => patch({ description: e.target.value })}
              placeholder="Brief description shown to customers"
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
          </div>

          {/* Discount type + value */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Discount Type *</label>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                {(['percentage', 'fixed'] as const).map(t => (
                  <button key={t} onClick={() => patch({ discountType: t })}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-all"
                    style={form.discountType === t
                      ? { background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)', color: '#fff' }
                      : { color: '#6B7280' }}>
                    {t === 'percentage' ? <Percent size={12} /> : <IndianRupee size={12} />}
                    {t === 'percentage' ? 'Percentage' : 'Fixed ₹'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                Value * {form.discountType === 'percentage' ? '(%)' : '(₹)'}
              </label>
              <input type="number" min={1} value={form.discountValue ?? ''}
                onChange={e => patch({ discountValue: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
            </div>
          </div>

          {/* Applicable services */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Applicable Services *</label>
            <div className="flex flex-wrap gap-2">
              {SERVICE_OPTIONS.map(s => {
                const sel = services.includes(s.value) || (s.value !== 'all' && services.includes('all'));
                const directSel = services.includes(s.value);
                return (
                  <button key={s.value} onClick={() => toggleService(s.value)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all"
                    style={directSel
                      ? { background: '#EDE9FE', color: '#7C3AED', borderColor: '#7C3AED' }
                      : sel
                        ? { background: '#F3F4F6', color: '#6B7280', borderColor: '#E5E7EB' }
                        : { background: 'white', color: '#6B7280', borderColor: '#E5E7EB' }}>
                    {directSel && <CheckCircle size={11} className="inline mr-1" />}
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Start Date *</label>
              <div className="relative">
                <CalendarDays size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="date" value={form.startDate ?? ''} onChange={e => patch({ startDate: e.target.value })}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">End Date *</label>
              <div className="relative">
                <CalendarDays size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="date" value={form.endDate ?? ''} onChange={e => patch({ endDate: e.target.value })}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
              </div>
            </div>
          </div>

          {/* Code + Active */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Promo Code (Optional)</label>
              <input value={form.code ?? ''} onChange={e => patch({ code: e.target.value.toUpperCase() })}
                placeholder="e.g. BRIDAL20"
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm font-mono font-bold focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Status</label>
              <button onClick={() => patch({ active: !form.active })}
                className="w-full h-10 flex items-center justify-center gap-2 rounded-xl border-2 text-sm font-semibold transition-all"
                style={form.active
                  ? { background: '#ECFDF5', color: '#059669', borderColor: '#059669' }
                  : { background: '#F9FAFB', color: '#6B7280', borderColor: '#E5E7EB' }}>
                {form.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                {form.active ? 'Active' : 'Inactive'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-gray-100">
          <button onClick={handleSubmit}
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-white font-semibold text-sm"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
            <Save size={14} /> Save Offer
          </button>
          <button onClick={onClose}
            className="px-5 h-10 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────── */
export default function AdminOffers() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [dialogOffer, setDialogOffer] = useState<Partial<Offer> | null | undefined>(undefined);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('neru-admin-auth')) navigate('/admin');
    offersApi.getAll().then(setOffers).catch(() => {});
  }, [navigate]);

  const handleSave = (form: Partial<Offer>) => {
    const routeId = form.offerId ?? form.id;
    if (routeId) {
      const updated = { ...offers.find(o => (o.offerId ?? o.id) === routeId)!, ...form } as Offer;
      offersApi.update(routeId, updated)
        .then(o => { setOffers(prev => prev.map(x => (x.offerId ?? x.id) === routeId ? o : x)); toast({ title: 'Offer Updated', description: `"${form.name}" has been updated.` }); })
        .catch(() => toast({ title: 'Update failed', variant: 'destructive' }));
    } else {
      offersApi.create(form as Offer)
        .then(o => { setOffers(prev => [o, ...prev]); toast({ title: 'Offer Created', description: `"${form.name}" is now active.` }); })
        .catch(() => toast({ title: 'Create failed', variant: 'destructive' }));
    }
    setDialogOffer(undefined);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this offer?')) return;
    offersApi.delete(id)
      .then(() => { setOffers(prev => prev.filter(o => (o.offerId ?? o.id) !== id)); toast({ title: 'Offer Deleted' }); })
      .catch(() => toast({ title: 'Delete failed', variant: 'destructive' }));
  };

  const handleToggle = (id: string) => {
    const offer = offers.find(o => (o.offerId ?? o.id) === id);
    if (!offer) return;
    const updated = { ...offer, active: !offer.active };
    offersApi.update(id, updated)
      .then(o => setOffers(prev => prev.map(x => (x.offerId ?? x.id) === id ? o : x)))
      .catch(() => {});
  };

  const filtered = offers.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.description.toLowerCase().includes(search.toLowerCase())
  );

  const liveCount = offers.filter(isActive).length;

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)' }}>
                <Tag size={18} className="text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "'Playfair Display',serif" }}>
                Offers & Discounts
              </h1>
            </div>
            <p className="text-gray-500 text-sm ml-12">
              {liveCount} offer{liveCount !== 1 ? 's' : ''} currently live
            </p>
          </div>
          <button
            onClick={() => setDialogOffer(newOffer())}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)' }}
          >
            <Plus size={16} /> New Offer
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Offers', value: offers.length, color: '#7C3AED', bg: '#F3E8FF' },
            { label: 'Live Now', value: liveCount, color: '#059669', bg: '#ECFDF5' },
            { label: 'Inactive', value: offers.filter(o => !o.active).length, color: '#6B7280', bg: '#F9FAFB' },
            { label: 'Expired', value: offers.filter(o => o.endDate < today()).length, color: '#DC2626', bg: '#FEF2F2' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <p className="text-2xl font-extrabold" style={{ color }}>{value}</p>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-4">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search offers…"
            className="w-full sm:w-72 h-10 pl-4 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
        </div>

        {/* Offers grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Tag size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No offers yet. Create your first offer to get started.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(offer => {
              const live = isActive(offer);
              const expired = offer.endDate < today();
              return (
                <div key={offer.offerId ?? offer.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Accent bar */}
                  <div className="h-1.5" style={{
                    background: live
                      ? 'linear-gradient(90deg,#059669,#10B981)'
                      : expired
                        ? 'linear-gradient(90deg,#DC2626,#EF4444)'
                        : 'linear-gradient(90deg,#D1D5DB,#9CA3AF)',
                  }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-gray-900 text-sm truncate">{offer.name}</h3>
                          <StatusBadge offer={offer} />
                        </div>
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{offer.description}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-2xl font-extrabold" style={{ color: live ? '#059669' : '#9CA3AF' }}>
                          {offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue.toLocaleString('en-IN')}`}
                        </p>
                        <p className="text-[10px] text-gray-400 font-semibold">
                          {offer.discountType === 'percentage' ? 'OFF' : 'FLAT OFF'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {offer.applicableServices.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700">
                          {SERVICE_OPTIONS.find(x => x.value === s)?.label ?? s}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 mb-4">
                      <span>{offer.startDate} → {offer.endDate}</span>
                      {offer.code && <span className="font-mono font-bold bg-gray-100 px-2 py-0.5 rounded">{offer.code}</span>}
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => handleToggle(offer.offerId ?? offer.id!)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-all"
                        style={offer.active
                          ? { background: '#ECFDF5', color: '#059669', borderColor: '#059669' }
                          : { background: '#F9FAFB', color: '#6B7280', borderColor: '#E5E7EB' }}>
                        {offer.active ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                        {offer.active ? 'Active' : 'Inactive'}
                      </button>
                      <button onClick={() => setDialogOffer(offer)}
                        className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-all">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(offer.offerId ?? offer.id!)}
                        className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dialog */}
      {dialogOffer !== undefined && (
        <OfferDialog
          offer={dialogOffer}
          onClose={() => setDialogOffer(undefined)}
          onSave={handleSave}
        />
      )}
    </AdminLayout>
  );
}
