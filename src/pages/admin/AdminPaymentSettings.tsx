import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { toast } from '@/components/ui/use-toast';
import {
  CreditCard, Banknote, Settings2, Save, RotateCcw,
  ShieldCheck, Percent, Info, Eye,
} from 'lucide-react';
import {
  getPaymentConfig, savePaymentConfig,
  DEFAULT_PAYMENT_CONFIG, type PaymentConfig,
} from '@/lib/paymentUtils';

/* ─── Toggle component ──────────────────────────────────────────────────── */
function Toggle({ checked, onChange, label, description, icon: Icon, color = '#7C3AED' }:
  { checked: boolean; onChange: (v: boolean) => void; label: string; description: string; icon: React.ElementType; color?: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-white">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm">{label}</p>
        <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className="flex-shrink-0 relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none"
        style={{ background: checked ? color : '#D1D5DB' }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
          style={{ left: checked ? '26px' : '2px' }}
        />
      </button>
    </div>
  );
}

/* ─── Percent Selector ──────────────────────────────────────────────────── */
const PERCENT_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 50, 100];

function PercentSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {PERCENT_OPTIONS.map(p => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className="px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all duration-150"
            style={value === p
              ? { background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)', color: '#fff', borderColor: '#7C3AED' }
              : { background: '#F9F7FF', color: '#6B7280', borderColor: '#E5E7EB' }}
          >
            {p === 0 ? 'No Advance' : `${p}%`}
          </button>
        ))}
      </div>
      {/* Custom input */}
      <div className="flex items-center gap-3">
        <label className="text-xs text-gray-500 font-medium flex-shrink-0">Custom %</label>
        <input
          type="number" min={0} max={100} value={value}
          onChange={e => onChange(Math.min(100, Math.max(0, Number(e.target.value))))}
          className="w-24 h-9 rounded-xl border border-gray-200 px-3 text-sm text-center font-bold text-neru-darkGray focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
        />
        <span className="text-gray-400 text-sm">%</span>
      </div>
    </div>
  );
}

/* ─── Preview Card ──────────────────────────────────────────────────────── */
function CustomerPreview({ config }: { config: PaymentConfig }) {
  const examplePrice = 8500;
  const advance = Math.round(examplePrice * config.advancePercent / 100);
  const remaining = examplePrice - advance;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-amber-50 rounded-2xl p-5 border border-purple-100">
      <div className="flex items-center gap-2 mb-4">
        <Eye size={14} className="text-purple-600" />
        <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">Customer Preview</p>
      </div>
      <p className="text-xs text-gray-500 mb-3">Example: Wedding Makeup — ₹8,500</p>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Service Price</span>
          <span className="font-semibold text-gray-800">₹{examplePrice.toLocaleString('en-IN')}</span>
        </div>
        {config.advancePercent > 0 && (
          <>
            <div className="flex justify-between text-purple-700">
              <span className="font-medium">Advance Online ({config.advancePercent}%)</span>
              <span className="font-bold">₹{advance.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span className="font-medium">Pay After Service</span>
              <span className="font-bold">₹{remaining.toLocaleString('en-IN')}</span>
            </div>
          </>
        )}
        {config.advancePercent === 0 && (
          <div className="flex justify-between text-emerald-700">
            <span className="font-medium">Pay After Service (Full)</span>
            <span className="font-bold">₹{examplePrice.toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>

      <div className="border-t border-purple-100 mt-3 pt-3">
        <p className="text-[11px] text-gray-400 mb-2 font-medium">Payment options shown to customer:</p>
        <div className="flex gap-2 flex-wrap">
          {config.onlineEnabled && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-700">
              <CreditCard size={10} /> Online Payment
            </span>
          )}
          {config.cashEnabled && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
              <Banknote size={10} /> Cash After Service
            </span>
          )}
          {!config.onlineEnabled && !config.cashEnabled && (
            <span className="text-[11px] text-red-500 font-medium">⚠ No payment option enabled</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────── */
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
    toast({ title: 'Settings Saved', description: 'Payment configuration updated successfully.' });
  };

  const handleReset = () => {
    setConfig({ ...DEFAULT_PAYMENT_CONFIG });
    toast({ title: 'Reset to Defaults', description: 'Payment settings restored to default values.' });
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
              <Settings2 size={18} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "'Playfair Display',serif" }}>
              Payment Settings
            </h1>
          </div>
          <p className="text-gray-500 text-sm ml-12">Configure how customers pay for their bookings</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Left — config */}
          <div className="space-y-6">

            {/* Advance payment percentage */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-1">
                <Percent size={16} className="text-purple-600" />
                <h2 className="font-bold text-gray-800">Advance Payment Percentage</h2>
              </div>
              <p className="text-gray-500 text-xs mb-5 leading-relaxed">
                Set how much the customer must pay online to confirm their booking.
                Set to <strong>0%</strong> to not require any advance payment.
              </p>

              <PercentSelector value={config.advancePercent} onChange={v => patch({ advancePercent: v })} />

              {config.advancePercent === 0 && (
                <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <Info size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-700 text-xs leading-relaxed">
                    No advance required. Customers can book without paying. Confirmation depends on cash availability.
                  </p>
                </div>
              )}
            </div>

            {/* Payment methods */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard size={16} className="text-purple-600" />
                <h2 className="font-bold text-gray-800">Payment Methods</h2>
              </div>
              <p className="text-gray-500 text-xs mb-5">Choose which payment options customers can use at checkout.</p>

              <div className="space-y-3">
                <Toggle
                  checked={config.onlineEnabled}
                  onChange={v => patch({ onlineEnabled: v })}
                  label="Online Payment (UPI / Card / Net Banking)"
                  description="Customer pays advance online to confirm booking instantly"
                  icon={CreditCard}
                  color="#7C3AED"
                />
                <Toggle
                  checked={config.cashEnabled}
                  onChange={v => patch({ cashEnabled: v })}
                  label="Cash / Pay After Service"
                  description="Customer pays the full amount in cash on the day of appointment"
                  icon={Banknote}
                  color="#059669"
                />
              </div>
            </div>

            {/* Security note */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
              <ShieldCheck size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-blue-700 text-xs leading-relaxed">
                <strong>Security:</strong> Payment rules are enforced server-side. Customers cannot override the advance
                percentage or payment options set here. All calculations use the values saved in this panel.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                style={{ background: saved ? '#059669' : 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}
              >
                <Save size={15} />
                {saved ? 'Saved!' : 'Save Settings'}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 h-11 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 font-medium text-sm transition-colors"
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </div>

          {/* Right — live preview */}
          <div className="space-y-4">
            <CustomerPreview config={config} />

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Current Config</p>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'Advance %', value: `${config.advancePercent}%` },
                  { label: 'Online Payment', value: config.onlineEnabled ? '✅ Enabled' : '❌ Disabled' },
                  { label: 'Cash Payment', value: config.cashEnabled ? '✅ Enabled' : '❌ Disabled' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-semibold text-gray-800">{value}</span>
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
