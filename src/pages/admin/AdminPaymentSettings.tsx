import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { toast } from '@/components/ui/use-toast';
import {
  CreditCard, Banknote, Settings2, Save, RotateCcw,
  ShieldCheck, Percent, Info, Eye, CheckCircle2,
  Wallet, ArrowRight, Zap, Clock, AlertTriangle,
  TrendingUp, Users, DollarSign,
} from 'lucide-react';
import {
  getPaymentConfig, savePaymentConfig,
  DEFAULT_PAYMENT_CONFIG, type PaymentConfig,
} from '@/lib/paymentUtils';

/* ─── Toggle ───────────────────────────────────────────────────────────────── */
function Toggle({
  checked, onChange, label, description, icon: Icon, color = '#7C3AED', badge,
}: {
  checked: boolean; onChange: (v: boolean) => void;
  label: string; description: string; icon: React.ElementType;
  color?: string; badge?: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full text-left flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-200"
      style={{
        borderColor: checked ? `${color}40` : '#F3F4F6',
        background: checked ? `${color}08` : 'white',
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: checked ? `${color}20` : '#F9FAFB' }}
      >
        <Icon size={20} style={{ color: checked ? color : '#9CA3AF' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-gray-800 text-sm">{label}</p>
          {badge && (
            <span
              className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
              style={{ background: `${color}20`, color }}
            >{badge}</span>
          )}
        </div>
        <p className="text-gray-500 text-xs mt-1 leading-relaxed">{description}</p>
      </div>
      {/* Switch */}
      <div
        className="flex-shrink-0 relative w-12 h-6 rounded-full transition-colors duration-200 mt-0.5"
        style={{ background: checked ? color : '#D1D5DB' }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
          style={{ left: checked ? '26px' : '2px' }}
        />
      </div>
    </button>
  );
}

/* ─── Percent Presets ──────────────────────────────────────────────────────── */
const PERCENT_OPTIONS = [0, 10, 20, 25, 30, 50, 75, 100];

function PercentSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-5">
      {/* Visual split bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold text-gray-500">
          <span>Pay Now (Advance)</span>
          <span>Pay After Service</span>
        </div>
        <div className="h-5 rounded-full overflow-hidden flex gap-0.5">
          <div
            className="h-full rounded-l-full transition-all duration-300 flex items-center justify-center"
            style={{
              width: value === 0 ? '4px' : `${value}%`,
              background: 'linear-gradient(90deg,#7C3AED,#8B5CF6)',
              minWidth: value > 0 ? '36px' : '4px',
            }}
          >
            {value >= 15 && (
              <span className="text-white text-[10px] font-extrabold">{value}%</span>
            )}
          </div>
          <div
            className="h-full rounded-r-full flex-1 flex items-center justify-center"
            style={{ background: 'linear-gradient(90deg,#10B981,#059669)' }}
          >
            {value < 100 && (
              <span className="text-white text-[10px] font-extrabold">{100 - value}%</span>
            )}
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span style={{ color: '#7C3AED' }}>₹{Math.round(8500 * value / 100).toLocaleString('en-IN')}</span>
          <span className="text-gray-400">based on ₹8,500 example</span>
          <span style={{ color: '#059669' }}>₹{Math.round(8500 * (100 - value) / 100).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Preset chips */}
      <div className="flex flex-wrap gap-2">
        {PERCENT_OPTIONS.map(p => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className="h-9 px-4 rounded-xl text-sm font-bold border-2 transition-all duration-150"
            style={value === p
              ? { background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)', color: '#fff', borderColor: '#7C3AED', boxShadow: '0 4px 12px rgba(124,58,237,0.35)' }
              : { background: '#F9F7FF', color: '#6B7280', borderColor: '#E9D5FF' }}
          >
            {p === 0 ? 'No Advance' : p === 100 ? 'Full Upfront' : `${p}%`}
          </button>
        ))}
      </div>

      {/* Custom input */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
        <Percent size={14} className="text-gray-400 flex-shrink-0" />
        <label className="text-xs text-gray-500 font-medium flex-shrink-0">Custom value</label>
        <input
          type="number" min={0} max={100} value={value}
          onChange={e => onChange(Math.min(100, Math.max(0, Number(e.target.value))))}
          className="w-20 h-8 rounded-lg border border-gray-200 px-2 text-sm text-center font-bold text-gray-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white"
        />
        <span className="text-gray-400 text-sm font-semibold">%</span>
        <div className="ml-auto text-xs text-gray-400">0 – 100</div>
      </div>
    </div>
  );
}

/* ─── Customer Preview ─────────────────────────────────────────────────────── */
function CustomerPreview({ config }: { config: PaymentConfig }) {
  const price = 8500;
  const advance = Math.round(price * config.advancePercent / 100);
  const remaining = price - advance;

  return (
    <div className="rounded-2xl overflow-hidden border border-purple-100 shadow-sm">
      <div className="px-5 py-3.5 flex items-center gap-2" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
        <Eye size={13} className="text-white/80" />
        <p className="text-white text-xs font-bold tracking-wider uppercase">Customer Preview</p>
        <span className="ml-auto text-white/60 text-[10px]">Live</span>
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      </div>

      <div className="bg-white p-5 space-y-4">
        {/* Service row */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 border border-purple-100">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
            <Wallet size={14} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">Traditional Bridal Makeup</p>
            <p className="text-[10px] text-gray-400">Wedding · Premium</p>
          </div>
          <p className="ml-auto font-extrabold text-gray-900 text-sm">₹8,500</p>
        </div>

        {/* Pricing breakdown */}
        <div className="space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Service Price</span>
            <span className="font-semibold text-gray-800">₹{price.toLocaleString('en-IN')}</span>
          </div>

          {config.advancePercent > 0 && config.advancePercent < 100 && (
            <>
              <div className="flex justify-between text-sm">
                <span className="font-medium" style={{ color: '#7C3AED' }}>
                  Advance Now ({config.advancePercent}%)
                </span>
                <span className="font-bold" style={{ color: '#7C3AED' }}>
                  ₹{advance.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-emerald-700">Remaining (after service)</span>
                <span className="font-bold text-emerald-700">₹{remaining.toLocaleString('en-IN')}</span>
              </div>
            </>
          )}

          {config.advancePercent === 0 && (
            <div className="flex justify-between text-sm">
              <span className="font-medium text-emerald-700">Pay After Service (Full)</span>
              <span className="font-bold text-emerald-700">₹{price.toLocaleString('en-IN')}</span>
            </div>
          )}

          {config.advancePercent === 100 && (
            <div className="flex justify-between text-sm">
              <span className="font-medium" style={{ color: '#7C3AED' }}>Pay Full Upfront</span>
              <span className="font-bold" style={{ color: '#7C3AED' }}>₹{price.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Payment method pills */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Payment options visible to customer
          </p>
          <div className="flex gap-2 flex-wrap">
            {config.onlineEnabled ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-purple-100 text-purple-700">
                <CreditCard size={10} /> Online (UPI / Card)
              </span>
            ) : null}
            {config.cashEnabled ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-100 text-emerald-700">
                <Banknote size={10} /> Cash After Service
              </span>
            ) : null}
            {!config.onlineEnabled && !config.cashEnabled && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-red-100 text-red-600">
                <AlertTriangle size={10} /> No method enabled
              </span>
            )}
          </div>
        </div>

        {/* CTA mock */}
        {(config.onlineEnabled || config.cashEnabled) && (
          <div
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}
          >
            <CheckCircle2 size={13} />
            {config.advancePercent > 0 && config.onlineEnabled
              ? `Confirm & Pay ₹${advance.toLocaleString('en-IN')} Now`
              : 'Confirm Booking'}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Booking Status Rules Card ────────────────────────────────────────────── */
function BookingStatusRules({ config }: { config: PaymentConfig }) {
  const rules = [
    {
      condition: 'Online + Advance > 0%',
      status: 'Partially Paid',
      color: '#F59E0B',
      bg: '#FEF3C7',
      show: config.onlineEnabled && config.advancePercent > 0 && config.advancePercent < 100,
    },
    {
      condition: 'Online + 100% Advance',
      status: 'Confirmed',
      color: '#059669',
      bg: '#D1FAE5',
      show: config.onlineEnabled && config.advancePercent === 100,
    },
    {
      condition: 'Online + 0% Advance',
      status: 'Confirmed',
      color: '#059669',
      bg: '#D1FAE5',
      show: config.onlineEnabled && config.advancePercent === 0,
    },
    {
      condition: 'Cash Payment',
      status: 'Confirmed (Pay Later)',
      color: '#2563EB',
      bg: '#DBEAFE',
      show: config.cashEnabled,
    },
  ].filter(r => r.show);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={15} className="text-amber-500" />
        <p className="text-sm font-bold text-gray-800">Auto Booking Status Rules</p>
      </div>
      {rules.length === 0 ? (
        <p className="text-xs text-red-500 font-medium">Enable at least one payment method to see rules.</p>
      ) : (
        <div className="space-y-2">
          {rules.map((r, i) => (
            <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-xl" style={{ background: `${r.bg}60` }}>
              <div className="flex items-center gap-2">
                <ArrowRight size={12} className="text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-600 font-medium">{r.condition}</span>
              </div>
              <span
                className="text-[10px] font-extrabold px-2.5 py-1 rounded-full flex-shrink-0"
                style={{ background: r.bg, color: r.color }}
              >{r.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────────── */
export default function AdminPaymentSettings() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<PaymentConfig>({ ...DEFAULT_PAYMENT_CONFIG });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('neru-admin-auth')) navigate('/admin');
    setConfig(getPaymentConfig());
  }, [navigate]);

  const patch = (partial: Partial<PaymentConfig>) =>
    setConfig(c => ({ ...c, ...partial }));

  const handleSave = () => {
    if (!config.onlineEnabled && !config.cashEnabled) {
      toast({ title: 'Validation Error', description: 'At least one payment method must be enabled.', variant: 'destructive' });
      return;
    }
    savePaymentConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    toast({ title: 'Settings Saved ✓', description: 'Payment configuration updated. All new bookings will use these settings.' });
  };

  const handleReset = () => {
    setConfig({ ...DEFAULT_PAYMENT_CONFIG });
    toast({ title: 'Reset to Defaults', description: 'Payment settings restored to default values.' });
  };

  /* quick-stat cards */
  const statCards = [
    {
      icon: Percent,
      label: 'Advance Rate',
      value: config.advancePercent === 0 ? 'No Advance' : `${config.advancePercent}%`,
      sub: config.advancePercent === 0 ? 'Customers pay after service' : 'Collected at booking',
      gradient: 'linear-gradient(135deg,#7C3AED,#8B5CF6)',
    },
    {
      icon: CreditCard,
      label: 'Online Payments',
      value: config.onlineEnabled ? 'Enabled' : 'Disabled',
      sub: 'UPI / Card / Net Banking',
      gradient: config.onlineEnabled
        ? 'linear-gradient(135deg,#059669,#10B981)'
        : 'linear-gradient(135deg,#6B7280,#9CA3AF)',
    },
    {
      icon: Banknote,
      label: 'Cash Payments',
      value: config.cashEnabled ? 'Enabled' : 'Disabled',
      sub: 'Pay on appointment day',
      gradient: config.cashEnabled
        ? 'linear-gradient(135deg,#D97706,#F59E0B)'
        : 'linear-gradient(135deg,#6B7280,#9CA3AF)',
    },
    {
      icon: Users,
      label: 'Active Methods',
      value: `${(config.onlineEnabled ? 1 : 0) + (config.cashEnabled ? 1 : 0)} / 2`,
      sub: 'Payment options for customers',
      gradient: 'linear-gradient(135deg,#9B1B30,#C0392B)',
    },
  ];

  return (
    <AdminLayout>
      {/* ── Hero banner ── */}
      <div
        className="px-6 lg:px-8 py-8"
        style={{ background: 'linear-gradient(135deg,#7B0D1E 0%,#9B1B30 50%,#A83222 100%)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)' }}
              >
                <Settings2 size={24} className="text-white" />
              </div>
              <div>
                <h1
                  className="text-2xl font-extrabold text-white"
                  style={{ fontFamily: "'Playfair Display',serif", textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                >
                  Payment Settings
                </h1>
                <p className="text-rose-200 text-sm mt-0.5">
                  Configure how customers pay for their bookings
                </p>
              </div>
            </div>

            {/* Action buttons in hero */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 h-9 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 font-medium text-sm transition-colors"
              >
                <RotateCcw size={13} /> Reset
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 h-9 rounded-xl font-bold text-sm shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
                style={{
                  background: saved
                    ? 'linear-gradient(135deg,#059669,#10B981)'
                    : 'linear-gradient(135deg,#FCD34D,#F59E0B)',
                  color: saved ? '#fff' : '#7B0D1E',
                }}
              >
                {saved ? <><CheckCircle2 size={14} /> Saved!</> : <><Save size={14} /> Save Settings</>}
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
            {statCards.map(({ icon: Icon, label, value, sub, gradient }) => (
              <div
                key={label}
                className="rounded-2xl p-4 text-white shadow-lg"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: gradient }}
                >
                  <Icon size={15} className="text-white" />
                </div>
                <p className="text-base font-extrabold leading-tight">{value}</p>
                <p className="text-[11px] font-semibold text-white/80 mt-0.5">{label}</p>
                <p className="text-[10px] text-white/50 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">

          {/* ── Left column ── */}
          <div className="space-y-5">

            {/* Advance % section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
                  <Percent size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-sm">Advance Payment Percentage</h2>
                  <p className="text-gray-400 text-xs mt-0.5">How much must be paid online to confirm a booking</p>
                </div>
                <span
                  className="ml-auto text-sm font-extrabold px-3 py-1 rounded-full"
                  style={{ background: '#EDE9FE', color: '#7C3AED' }}
                >
                  {config.advancePercent}%
                </span>
              </div>
              <div className="p-6">
                <PercentSelector value={config.advancePercent} onChange={v => patch({ advancePercent: v })} />

                {config.advancePercent === 0 && (
                  <div className="mt-4 flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-100">
                    <Info size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-amber-700 text-xs leading-relaxed">
                      <strong>No advance required.</strong> Customers book without upfront payment.
                      Booking is confirmed immediately — suitable for trusted/returning clients.
                    </p>
                  </div>
                )}
                {config.advancePercent === 100 && (
                  <div className="mt-4 flex items-start gap-2.5 p-3.5 rounded-xl bg-purple-50 border border-purple-100">
                    <Zap size={14} className="text-purple-600 flex-shrink-0 mt-0.5" />
                    <p className="text-purple-700 text-xs leading-relaxed">
                      <strong>Full payment upfront.</strong> Customer pays the complete amount at booking.
                      Booking is confirmed instantly with no remaining balance.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment methods section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#059669,#10B981)' }}>
                  <CreditCard size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-sm">Payment Methods</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Choose which options appear at checkout</p>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <Toggle
                  checked={config.onlineEnabled}
                  onChange={v => patch({ onlineEnabled: v })}
                  label="Online Payment"
                  description="UPI, Debit/Credit Card, Net Banking — customer pays advance to confirm instantly"
                  icon={CreditCard}
                  color="#7C3AED"
                  badge="Recommended"
                />
                <Toggle
                  checked={config.cashEnabled}
                  onChange={v => patch({ cashEnabled: v })}
                  label="Cash / Pay After Service"
                  description="Customer pays the full amount in cash on the day of the appointment"
                  icon={Banknote}
                  color="#059669"
                />

                {!config.onlineEnabled && !config.cashEnabled && (
                  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200">
                    <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-600 text-xs leading-relaxed font-medium">
                      At least one payment method must be enabled. Customers cannot complete bookings right now.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Booking status rules */}
            <BookingStatusRules config={config} />

            {/* Security notice */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl border border-blue-100" style={{ background: '#EFF6FF' }}>
              <ShieldCheck size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-800 text-sm font-bold mb-0.5">Payment Rules are Enforced Securely</p>
                <p className="text-blue-600 text-xs leading-relaxed">
                  Customers cannot override the advance percentage or payment methods configured here.
                  All pricing calculations use the values saved in this panel. Changes take effect immediately
                  for all new bookings.
                </p>
              </div>
            </div>

            {/* Bottom save/reset bar */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl text-white font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                style={{ background: saved ? 'linear-gradient(135deg,#059669,#10B981)' : 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}
              >
                {saved ? <><CheckCircle2 size={16} /> Settings Saved!</> : <><Save size={16} /> Save Payment Settings</>}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 h-12 rounded-2xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 font-semibold text-sm transition-all"
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="space-y-4">
            <CustomerPreview config={config} />

            {/* Tips card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={14} className="text-amber-500" />
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Best Practices</p>
              </div>
              <div className="space-y-3">
                {[
                  {
                    icon: Clock,
                    color: '#7C3AED',
                    title: '20–30% advance',
                    desc: 'Balances commitment without putting off price-sensitive clients.',
                  },
                  {
                    icon: CheckCircle2,
                    color: '#059669',
                    title: 'Keep Cash enabled',
                    desc: 'Many clients prefer paying in-person; disabling cash reduces conversions.',
                  },
                  {
                    icon: Zap,
                    color: '#F59E0B',
                    title: '100% for peak dates',
                    desc: 'Raise advance to 100% during high-demand seasons to secure bookings.',
                  },
                ].map(({ icon: Icon, color, title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${color}18` }}
                    >
                      <Icon size={13} style={{ color }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-700">{title}</p>
                      <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current config summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Active Configuration</p>
              <div className="space-y-2.5">
                {[
                  { label: 'Advance %', value: config.advancePercent === 0 ? 'No Advance' : `${config.advancePercent}%` },
                  { label: 'Online', value: config.onlineEnabled ? '✅ Enabled' : '❌ Disabled' },
                  { label: 'Cash', value: config.cashEnabled ? '✅ Enabled' : '❌ Disabled' },
                  {
                    label: 'Status on Booking',
                    value: config.cashEnabled && !config.onlineEnabled
                      ? 'Confirmed'
                      : config.advancePercent === 0 || config.advancePercent === 100
                      ? 'Confirmed'
                      : 'Partially Paid',
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-xs font-bold text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
