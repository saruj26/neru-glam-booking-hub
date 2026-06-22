import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { toast } from '@/components/ui/use-toast';
import {
  Search, Calendar, CreditCard, Banknote, CheckCircle,
  XCircle, Clock, Eye, RefreshCw, Tag,
} from 'lucide-react';
import {
  getBookings, upsertBooking, fmt, type StoredBooking,
} from '@/lib/paymentUtils';

/* ─── Types ─────────────────────────────────────────────────────────────── */
type StatusKey = StoredBooking['status'];
type FilterTab = 'all' | StatusKey;

/* ─── Badge helpers ──────────────────────────────────────────────────────── */
const STATUS_CFG: Record<StatusKey, { label: string; cls: string; dot: string }> = {
  confirmed:       { label: 'Confirmed',    cls: 'bg-blue-50 text-blue-700',     dot: 'bg-blue-500'    },
  partially_paid:  { label: 'Partial Paid', cls: 'bg-indigo-50 text-indigo-700', dot: 'bg-indigo-500'  },
  pending_payment: { label: 'Pending Pay',  cls: 'bg-amber-50 text-amber-700',   dot: 'bg-amber-500'   },
  completed:       { label: 'Completed',    cls: 'bg-emerald-50 text-emerald-700',dot:'bg-emerald-500'  },
  cancelled:       { label: 'Cancelled',    cls: 'bg-red-50 text-red-600',        dot: 'bg-red-500'     },
};

function StatusBadge({ status }: { status: StatusKey }) {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.pending_payment;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function PaymentBadge({ method, paid, remaining }: { method: 'online' | 'cash'; paid: number; remaining: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        {method === 'online'
          ? <CreditCard size={11} className="text-purple-500" />
          : <Banknote size={11} className="text-emerald-600" />}
        <span className="text-[11px] font-semibold text-gray-600">
          {method === 'online' ? 'Online' : 'Cash'}
        </span>
      </div>
      {paid > 0 && <p className="text-[10px] text-emerald-600 font-medium">Paid: {fmt(paid)}</p>}
      {remaining > 0 && <p className="text-[10px] text-amber-600 font-medium">Due: {fmt(remaining)}</p>}
    </div>
  );
}

/* ─── Detail Modal ───────────────────────────────────────────────────────── */
function DetailModal({ booking, onClose }: { booking: StoredBooking; onClose: () => void }) {
  const p = booking.pricing;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
        <div className="p-5 border-b border-gray-100" style={{ background: 'linear-gradient(135deg,#3B0764,#7C3AED)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-300 text-xs font-bold tracking-wider uppercase mb-0.5">Booking Details</p>
              <p className="text-white font-extrabold text-lg font-mono">{booking.id}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto max-h-[65vh]">
          {/* Customer */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer</p>
            <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-sm">
              <p className="font-semibold text-gray-800">{booking.customer.name}</p>
              <p className="text-gray-500">{booking.customer.email}</p>
              <p className="text-gray-500">{booking.customer.phone}</p>
            </div>
          </div>

          {/* Service */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Service</p>
            <div className="bg-gray-50 rounded-xl p-3 text-sm">
              <p className="font-semibold text-gray-800">{booking.service.name}</p>
              <p className="text-gray-500 capitalize">{booking.service.category} · {booking.date} at {booking.time}</p>
              {booking.specialRequests && (
                <p className="text-gray-400 text-xs mt-1 italic">"{booking.specialRequests}"</p>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pricing Breakdown</p>
            <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Original Price</span>
                <span className={p.discountAmount > 0 ? 'line-through text-gray-400 text-xs' : 'font-semibold text-gray-800'}>
                  {fmt(p.originalPrice)}
                </span>
              </div>
              {p.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span className="flex items-center gap-1"><Tag size={10} /> Discount ({p.discountLabel})</span>
                  <span className="font-semibold">- {fmt(p.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t border-gray-200 pt-2">
                <span className="text-gray-700">Total Payable</span>
                <span style={{ color: '#7C3AED' }}>{fmt(p.finalPrice)}</span>
              </div>
              {booking.payment.method === 'online' && p.advancePercent > 0 && (
                <>
                  <div className="flex justify-between text-purple-700 text-xs">
                    <span>Advance Paid ({p.advancePercent}%)</span>
                    <span className="font-bold">{fmt(p.advanceAmount)}</span>
                  </div>
                  <div className="flex justify-between text-amber-700 text-xs">
                    <span>Remaining (After Service)</span>
                    <span className="font-bold">{fmt(p.remainingAmount)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Offer */}
          {p.offer && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Offer Applied</p>
              <div className="rounded-xl p-3 text-sm" style={{ background: '#F5F3FF', border: '1px solid #EDE9FE' }}>
                <p className="font-semibold text-purple-800">{p.offer.name}</p>
                <p className="text-purple-600 text-xs mt-0.5">{p.discountLabel} applied</p>
                {p.offer.code && <p className="text-purple-400 text-[10px] font-mono mt-0.5">Code: {p.offer.code}</p>}
              </div>
            </div>
          )}

          {/* Payment */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment</p>
            <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="font-semibold flex items-center gap-1">
                  {booking.payment.method === 'online'
                    ? <><CreditCard size={12} className="text-purple-500" /> Online</>
                    : <><Banknote size={12} className="text-emerald-600" /> Cash</>}
                </span>
              </div>
              {booking.payment.transactionId && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="font-mono text-xs text-gray-700">{booking.payment.transactionId}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button onClick={onClose}
            className="w-full h-10 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function AdminBookings() {
  const navigate = useNavigate();
  const [bookings,    setBookings]    = useState<StoredBooking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab,   setFilterTab]   = useState<FilterTab>('all');
  const [detail,      setDetail]      = useState<StoredBooking | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('neru-admin-auth')) navigate('/admin');
    setBookings(getBookings());
  }, [navigate]);

  const refresh = () => { setBookings(getBookings()); toast({ title: 'Refreshed' }); };

  const updateStatus = (id: string, status: StatusKey) => {
    const b = bookings.find(x => x.id === id);
    if (!b) return;
    const updated: StoredBooking = { ...b, status, payment: { ...b.payment, status } };
    upsertBooking(updated);
    setBookings(prev => prev.map(x => x.id === id ? updated : x));
    toast({ title: `Status → ${STATUS_CFG[status].label}` });
  };

  const filtered = useMemo(() => {
    let list = bookings;
    if (filterTab !== 'all') list = list.filter(b => b.status === filterTab);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(b =>
        b.id.toLowerCase().includes(q) ||
        b.customer.name.toLowerCase().includes(q) ||
        b.customer.email.toLowerCase().includes(q) ||
        b.service.name.toLowerCase().includes(q),
      );
    }
    return list;
  }, [bookings, filterTab, searchQuery]);

  const stats = useMemo(() => ({
    total:    bookings.length,
    pending:  bookings.filter(b => b.status === 'pending_payment').length,
    active:   bookings.filter(b => ['confirmed', 'partially_paid'].includes(b.status)).length,
    completed:bookings.filter(b => b.status === 'completed').length,
    revenue:  bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.pricing.finalPrice, 0),
  }), [bookings]);

  const TABS: { key: FilterTab; label: string }[] = [
    { key: 'all',             label: `All (${stats.total})`        },
    { key: 'pending_payment', label: `Pending (${stats.pending})`  },
    { key: 'confirmed',       label: 'Confirmed'                   },
    { key: 'partially_paid',  label: 'Partial Paid'                },
    { key: 'completed',       label: `Done (${stats.completed})`   },
    { key: 'cancelled',       label: 'Cancelled'                   },
  ];

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
                <Calendar size={18} className="text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "'Playfair Display',serif" }}>
                Bookings
              </h1>
            </div>
            <p className="text-gray-500 text-sm ml-12">
              {stats.total} bookings · Total revenue: {fmt(stats.revenue)}
            </p>
          </div>
          <button onClick={refresh}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm font-medium transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total',     value: stats.total,    color: '#7C3AED' },
            { label: 'Pending',   value: stats.pending,  color: '#D97706' },
            { label: 'Active',    value: stats.active,   color: '#2563EB' },
            { label: 'Completed', value: stats.completed,color: '#059669' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <p className="text-2xl font-extrabold" style={{ color }}>{value}</p>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Search + Tabs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-shrink-0">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search bookings…"
              className="w-full sm:w-64 pl-9 pr-4 h-10 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {TABS.map(({ key, label }) => (
              <button key={key} onClick={() => setFilterTab(key)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={filterTab === key
                  ? { background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)', color: '#fff' }
                  : { background: 'white', color: '#6B7280', border: '1px solid #E5E7EB' }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Calendar size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              {bookings.length === 0
                ? 'No bookings yet. Customer bookings will appear here.'
                : 'No bookings match your current filter.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-50 bg-gray-50/60">
                      {['Booking ID', 'Customer', 'Service', 'Date & Time', 'Pricing', 'Payment', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((b, i) => (
                      <tr key={b.id} className={`hover:bg-gray-50/50 transition-colors ${i < filtered.length - 1 ? 'border-b border-gray-50' : ''}`}>
                        <td className="px-4 py-3.5">
                          <p className="font-mono font-bold text-xs" style={{ color: '#7C3AED' }}>{b.id}</p>
                          <p className="text-gray-400 text-[10px] mt-0.5">{new Date(b.createdAt).toLocaleDateString('en-IN')}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-gray-800 text-xs">{b.customer.name}</p>
                          <p className="text-gray-400 text-[10px]">{b.customer.email}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-gray-800 text-xs">{b.service.name}</p>
                          <p className="text-gray-400 text-[10px] capitalize">{b.service.category}</p>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Calendar size={10} style={{ color: '#7C3AED' }} />{b.date}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                            <Clock size={10} />{b.time}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          {b.pricing.discountAmount > 0 && (
                            <p className="line-through text-gray-400 text-[10px]">{fmt(b.pricing.originalPrice)}</p>
                          )}
                          <p className="font-bold text-gray-800 text-xs">{fmt(b.pricing.finalPrice)}</p>
                          {b.pricing.offer && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[9px] font-bold mt-0.5">
                              <Tag size={8} />{b.pricing.discountLabel}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <PaymentBadge method={b.payment.method} paid={b.payment.paidAmount} remaining={b.payment.remainingAmount} />
                        </td>
                        <td className="px-4 py-3.5"><StatusBadge status={b.status} /></td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1">
                            <button onClick={() => setDetail(b)} title="View" className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all"><Eye size={13} /></button>
                            {b.status === 'pending_payment' && (
                              <button onClick={() => updateStatus(b.id, 'confirmed')} title="Confirm" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><CheckCircle size={13} /></button>
                            )}
                            {['confirmed', 'partially_paid'].includes(b.status) && (
                              <button onClick={() => updateStatus(b.id, 'completed')} title="Complete" className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"><CheckCircle size={13} /></button>
                            )}
                            {!['completed', 'cancelled'].includes(b.status) && (
                              <button onClick={() => updateStatus(b.id, 'cancelled')} title="Cancel" className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"><XCircle size={13} /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden space-y-3">
              {filtered.map(b => (
                <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-mono font-bold text-xs" style={{ color: '#7C3AED' }}>{b.id}</p>
                      <p className="font-semibold text-gray-800 text-sm">{b.customer.name}</p>
                      <p className="text-gray-500 text-xs">{b.service.name}</p>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-3">
                    <span>{b.date} · {b.time}</span>
                    <span className="font-bold text-gray-800">{fmt(b.pricing.finalPrice)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setDetail(b)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700">
                      <Eye size={12} /> Details
                    </button>
                    {['confirmed', 'partially_paid'].includes(b.status) && (
                      <button onClick={() => updateStatus(b.id, 'completed')} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700">
                        <CheckCircle size={12} /> Complete
                      </button>
                    )}
                    {!['completed', 'cancelled'].includes(b.status) && (
                      <button onClick={() => updateStatus(b.id, 'cancelled')} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-600">
                        <XCircle size={12} /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {detail && <DetailModal booking={detail} onClose={() => setDetail(null)} />}
    </AdminLayout>
  );
}
