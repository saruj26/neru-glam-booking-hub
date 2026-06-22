import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { toast } from '@/components/ui/use-toast';
import {
  Store, Calendar, CreditCard, Tag, Layers, Image,
  Bell, Palette, Clock, Share2, ShieldCheck, Database,
  Save, RotateCcw, ChevronRight, Eye, EyeOff,
  Facebook, Instagram, Youtube, Phone, Mail, MapPin,
  Globe, Lock, Key, Download, HardDrive, Info,
  Banknote, Percent, Plus, Trash2, Check, X,
  Sun, Moon, Upload, AlertTriangle, Cpu, Wifi,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
══════════════════════════════════════════════════════════════════════════════ */

function SectionCard({ title, icon: Icon, color = '#7C3AED', children }: {
  title: string; icon: React.ElementType; color?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `linear-gradient(135deg,${color},${color}CC)` }}>
          <Icon size={16} className="text-white" />
        </div>
        <h2 className="font-bold text-gray-900 text-sm">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full h-10 rounded-xl border border-gray-200 px-3.5 text-sm text-gray-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white placeholder-gray-400 transition" />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white placeholder-gray-400 resize-none transition" />
  );
}

function NumberInput({ value, onChange, min = 0, max = 9999, suffix }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; suffix?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input type="number" value={value} min={min} max={max}
        onChange={e => onChange(Math.min(max, Math.max(min, Number(e.target.value))))}
        className="w-28 h-10 rounded-xl border border-gray-200 px-3 text-sm text-center font-bold text-gray-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white transition" />
      {suffix && <span className="text-sm text-gray-400 font-medium">{suffix}</span>}
    </div>
  );
}

function Toggle({ checked, onChange, label, description, color = '#7C3AED' }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; description?: string; color?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button onClick={() => onChange(!checked)}
        className="flex-shrink-0 relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
        style={{ background: checked ? color : '#D1D5DB' }}>
        <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
          style={{ left: checked ? '22px' : '2px' }} />
      </button>
    </div>
  );
}

function SaveBar({ onSave, onReset, saved }: { onSave: () => void; onReset: () => void; saved: boolean }) {
  return (
    <div className="flex gap-3 pt-2">
      <button onClick={onSave}
        className="flex items-center gap-2 px-6 h-10 rounded-xl text-white font-bold text-sm shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
        style={{ background: saved ? 'linear-gradient(135deg,#059669,#10B981)' : 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
        {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
      </button>
      <button onClick={onReset}
        className="flex items-center gap-2 px-5 h-10 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 font-semibold text-sm transition-all">
        <RotateCcw size={13} /> Reset
      </button>
    </div>
  );
}

function SelectInput({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: { label: string; value: string }[];
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full h-10 rounded-xl border border-gray-200 px-3.5 text-sm text-gray-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white transition">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. GENERAL SETTINGS
══════════════════════════════════════════════════════════════════════════════ */
function GeneralSettings() {
  const init = () => {
    try { return JSON.parse(localStorage.getItem('neru-general-settings') || '{}'); } catch { return {}; }
  };
  const d = init();
  const [form, setForm] = useState({
    salonName: d.salonName ?? 'Neru Beauty Studio',
    description: d.description ?? 'Premium beauty salon offering bridal, birthday, and special occasion makeup services.',
    email: d.email ?? 'hello@nerubeauty.com',
    phone: d.phone ?? '+91 98765 43210',
    whatsapp: d.whatsapp ?? '+91 98765 43210',
    address: d.address ?? '42, Anna Salai, Chennai, Tamil Nadu 600002',
    mapsLink: d.mapsLink ?? '',
    regNumber: d.regNumber ?? '',
  });
  const [saved, setSaved] = useState(false);
  const p = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));
  const save = () => {
    localStorage.setItem('neru-general-settings', JSON.stringify(form));
    setSaved(true); setTimeout(() => setSaved(false), 2500);
    toast({ title: 'General settings saved ✓' });
  };
  const reset = () => { setForm({ salonName: 'Neru Beauty Studio', description: '', email: '', phone: '', whatsapp: '', address: '', mapsLink: '', regNumber: '' }); };

  return (
    <div className="space-y-5">
      <SectionCard title="Salon Identity" icon={Store} color="#9B1B30">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Salon Name"><TextInput value={form.salonName} onChange={p('salonName')} placeholder="Neru Beauty Studio" /></Field>
          <Field label="Business Registration Number"><TextInput value={form.regNumber} onChange={p('regNumber')} placeholder="GSTIN / CIN" /></Field>
          <div className="sm:col-span-2">
            <Field label="Salon Description" hint="Shown on the home page and booking confirmation emails.">
              <TextArea value={form.description} onChange={p('description')} placeholder="Describe your salon…" rows={3} />
            </Field>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Contact Details" icon={Phone} color="#059669">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Business Email"><TextInput value={form.email} onChange={p('email')} placeholder="hello@salon.com" type="email" /></Field>
          <Field label="Contact Number"><TextInput value={form.phone} onChange={p('phone')} placeholder="+91 98765 43210" /></Field>
          <Field label="WhatsApp Number" hint="Customers will click this to chat directly."><TextInput value={form.whatsapp} onChange={p('whatsapp')} placeholder="+91 98765 43210" /></Field>
        </div>
      </SectionCard>

      <SectionCard title="Location" icon={MapPin} color="#D97706">
        <div className="space-y-4">
          <Field label="Salon Address">
            <TextArea value={form.address} onChange={p('address')} placeholder="Full address…" rows={2} />
          </Field>
          <Field label="Google Maps Link" hint="Paste the share link from Google Maps.">
            <TextInput value={form.mapsLink} onChange={p('mapsLink')} placeholder="https://maps.google.com/…" />
          </Field>
        </div>
      </SectionCard>

      <SaveBar onSave={save} onReset={reset} saved={saved} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. BOOKING SETTINGS
══════════════════════════════════════════════════════════════════════════════ */
function BookingSettings() {
  const init = () => { try { return JSON.parse(localStorage.getItem('neru-booking-settings') || '{}'); } catch { return {}; } };
  const d = init();
  const [cfg, setCfg] = useState({
    onlineBooking: d.onlineBooking ?? true,
    sameDayBooking: d.sameDayBooking ?? false,
    maxPerDay: d.maxPerDay ?? 8,
    cancelHours: d.cancelHours ?? 24,
    bufferMinutes: d.bufferMinutes ?? 30,
    advanceBookingDays: d.advanceBookingDays ?? 60,
    reminderHours: d.reminderHours ?? 24,
    autoConfirm: d.autoConfirm ?? false,
  });
  const [saved, setSaved] = useState(false);
  const p = (k: string) => (v: boolean | number) => setCfg(c => ({ ...c, [k]: v }));
  const save = () => {
    localStorage.setItem('neru-booking-settings', JSON.stringify(cfg));
    setSaved(true); setTimeout(() => setSaved(false), 2500);
    toast({ title: 'Booking settings saved ✓' });
  };

  return (
    <div className="space-y-5">
      <SectionCard title="Booking Controls" icon={Calendar} color="#7C3AED">
        <div className="divide-y divide-gray-50">
          <Toggle checked={cfg.onlineBooking} onChange={p('onlineBooking')} label="Enable Online Booking" description="Allow customers to book appointments through the website" color="#7C3AED" />
          <Toggle checked={cfg.sameDayBooking} onChange={p('sameDayBooking')} label="Allow Same-Day Booking" description="Customers can book for the same day (may cause scheduling conflicts)" color="#7C3AED" />
          <Toggle checked={cfg.autoConfirm} onChange={p('autoConfirm')} label="Auto-Confirm Bookings" description="Skip manual confirmation — bookings are confirmed instantly on payment" color="#059669" />
        </div>
      </SectionCard>

      <SectionCard title="Capacity & Timing" icon={Clock} color="#D97706">
        <div className="grid sm:grid-cols-2 gap-6">
          <Field label="Max Bookings Per Day" hint="Total appointments allowed per day across all services.">
            <NumberInput value={cfg.maxPerDay} onChange={p('maxPerDay')} min={1} max={50} suffix="bookings" />
          </Field>
          <Field label="Appointment Buffer Time" hint="Gap added between consecutive appointments.">
            <NumberInput value={cfg.bufferMinutes} onChange={p('bufferMinutes')} min={0} max={120} suffix="minutes" />
          </Field>
          <Field label="Cancellation Window" hint="Minimum hours before appointment that cancellation is allowed.">
            <NumberInput value={cfg.cancelHours} onChange={p('cancelHours')} min={1} max={168} suffix="hours" />
          </Field>
          <Field label="Advance Booking Limit" hint="How far in the future customers can book.">
            <NumberInput value={cfg.advanceBookingDays} onChange={p('advanceBookingDays')} min={1} max={365} suffix="days" />
          </Field>
          <Field label="Reminder Notice" hint="Hours before appointment to send a reminder.">
            <NumberInput value={cfg.reminderHours} onChange={p('reminderHours')} min={1} max={72} suffix="hours before" />
          </Field>
        </div>
      </SectionCard>

      <SaveBar onSave={save} onReset={() => setCfg({ onlineBooking: true, sameDayBooking: false, maxPerDay: 8, cancelHours: 24, bufferMinutes: 30, advanceBookingDays: 60, reminderHours: 24, autoConfirm: false })} saved={saved} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. PAYMENT SETTINGS  (links through to /admin/payment-settings)
══════════════════════════════════════════════════════════════════════════════ */
function PaymentSettingsSection() {
  const navigate = useNavigate();
  const init = () => { try { return JSON.parse(localStorage.getItem('neru-payment-config') || '{}'); } catch { return {}; } };
  const d = init();
  const [cfg, setCfg] = useState({ advancePercent: d.advancePercent ?? 20, onlineEnabled: d.onlineEnabled ?? true, cashEnabled: d.cashEnabled ?? true, instructions: d.instructions ?? '' });
  const [saved, setSaved] = useState(false);
  const PRESETS = [0, 10, 20, 30, 50, 100];
  const exPrice = 5000;
  const advance = Math.round(exPrice * cfg.advancePercent / 100);

  const save = () => {
    localStorage.setItem('neru-payment-config', JSON.stringify(cfg));
    setSaved(true); setTimeout(() => setSaved(false), 2500);
    toast({ title: 'Payment settings saved ✓' });
  };

  return (
    <div className="space-y-5">
      <SectionCard title="Advance Payment Percentage" icon={Percent} color="#7C3AED">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <button key={p} onClick={() => setCfg(c => ({ ...c, advancePercent: p }))}
                className="h-9 px-4 rounded-xl text-sm font-bold border-2 transition-all"
                style={cfg.advancePercent === p
                  ? { background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)', color: '#fff', borderColor: '#7C3AED' }
                  : { background: '#F9F7FF', color: '#6B7280', borderColor: '#E9D5FF' }}>
                {p === 0 ? 'No Advance' : p === 100 ? 'Full Upfront' : `${p}%`}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-xs text-gray-500 font-medium">Custom %</span>
            <input type="number" min={0} max={100} value={cfg.advancePercent}
              onChange={e => setCfg(c => ({ ...c, advancePercent: Math.min(100, Math.max(0, Number(e.target.value))) }))}
              className="w-20 h-8 rounded-lg border border-gray-200 px-2 text-sm text-center font-bold focus:outline-none focus:border-purple-400 bg-white" />
            <span className="text-gray-400 text-sm">%</span>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Payment Methods" icon={CreditCard} color="#059669">
        <div className="divide-y divide-gray-50">
          <Toggle checked={cfg.onlineEnabled} onChange={v => setCfg(c => ({ ...c, onlineEnabled: v }))} label="Online Payment (UPI / Card / Net Banking)" description="Customer pays advance online to confirm booking" color="#7C3AED" />
          <Toggle checked={cfg.cashEnabled} onChange={v => setCfg(c => ({ ...c, cashEnabled: v }))} label="Cash / Pay After Service" description="Customer pays full amount in cash on appointment day" color="#059669" />
        </div>
        <div className="mt-4">
          <Field label="Payment Instructions" hint="Shown to customer at checkout.">
            <TextArea value={cfg.instructions} onChange={v => setCfg(c => ({ ...c, instructions: v }))} placeholder="e.g. UPI ID: nerubeauty@upi — scan QR at studio…" rows={2} />
          </Field>
        </div>
      </SectionCard>

      {/* Live preview */}
      <div className="rounded-2xl border border-purple-100 overflow-hidden">
        <div className="px-5 py-3 flex items-center gap-2" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
          <Eye size={12} className="text-white/80" />
          <p className="text-white text-xs font-bold">Customer Preview · ₹5,000 service</p>
        </div>
        <div className="bg-white p-5 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Service Price</span><span className="font-semibold">₹{exPrice.toLocaleString('en-IN')}</span></div>
          {cfg.advancePercent > 0 && <div className="flex justify-between text-purple-700"><span className="font-medium">Pay Now ({cfg.advancePercent}%)</span><span className="font-bold">₹{advance.toLocaleString('en-IN')}</span></div>}
          <div className="flex justify-between text-emerald-700"><span className="font-medium">{cfg.advancePercent > 0 ? 'Remaining After Service' : 'Pay After Service'}</span><span className="font-bold">₹{(exPrice - advance).toLocaleString('en-IN')}</span></div>
          <div className="flex gap-2 pt-2 flex-wrap">
            {cfg.onlineEnabled && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-700"><CreditCard size={9} /> Online</span>}
            {cfg.cashEnabled && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700"><Banknote size={9} /> Cash</span>}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <SaveBar onSave={save} onReset={() => setCfg({ advancePercent: 20, onlineEnabled: true, cashEnabled: true, instructions: '' })} saved={saved} />
        <button onClick={() => navigate('/admin/payment-settings')}
          className="flex items-center gap-2 px-4 h-10 rounded-xl border-2 border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold text-sm transition-all">
          Advanced Settings <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. OFFERS SETTINGS  (redirect card)
══════════════════════════════════════════════════════════════════════════════ */
function OffersSettingsSection() {
  const navigate = useNavigate();
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-amber-100 overflow-hidden">
        <div className="px-6 py-5 flex items-center gap-4" style={{ background: 'linear-gradient(135deg,#92400E,#D97706)' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/20"><Tag size={22} className="text-white" /></div>
          <div>
            <p className="text-white font-extrabold text-base">Offers & Discount Management</p>
            <p className="text-amber-100 text-xs mt-0.5">Create, edit, and manage promotional offers</p>
          </div>
        </div>
        <div className="bg-white p-6">
          <p className="text-sm text-gray-600 mb-4">The full Offers Management panel lets you create percentage or fixed-amount discounts, set validity dates, apply per-service, and toggle active/inactive status.</p>
          <div className="grid sm:grid-cols-3 gap-3 mb-5">
            {[['Create Offers', 'Set % or ₹ discounts', '#7C3AED'], ['Auto-Detection', 'Best offer applied at booking', '#059669'], ['Promo Codes', 'Customer-entered coupon codes', '#D97706']].map(([t, d, c]) => (
              <div key={t} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50">
                <div className="w-6 h-6 rounded-lg mb-2" style={{ background: `${c}20` }} />
                <p className="text-xs font-bold text-gray-800">{t}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{d}</p>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/admin/offers')}
            className="flex items-center gap-2 px-6 h-10 rounded-xl text-white font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all"
            style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)', color: '#7B0D1E' }}>
            Open Offers Manager <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. BUSINESS HOURS
══════════════════════════════════════════════════════════════════════════════ */
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = Array.from({ length: 29 }, (_, i) => {
  const h = Math.floor(i / 2) + 7;
  const m = i % 2 === 0 ? '00' : '30';
  const ampm = h < 12 ? 'AM' : 'PM';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return { label: `${h12}:${m} ${ampm}`, value: `${String(h).padStart(2, '0')}:${m}` };
});

function BusinessHoursSettings() {
  const init = () => { try { return JSON.parse(localStorage.getItem('neru-hours-settings') || 'null'); } catch { return null; } };
  const [hours, setHours] = useState<{ open: string; close: string; closed: boolean }[]>(
    init() ?? DAYS.map((d) => ({ open: '09:00', close: '19:00', closed: d === 'Sunday' }))
  );
  const [saved, setSaved] = useState(false);
  const save = () => {
    localStorage.setItem('neru-hours-settings', JSON.stringify(hours));
    setSaved(true); setTimeout(() => setSaved(false), 2500);
    toast({ title: 'Business hours saved ✓' });
  };

  return (
    <div className="space-y-5">
      <SectionCard title="Weekly Schedule" icon={Clock} color="#7C3AED">
        <div className="space-y-2">
          {DAYS.map((day, i) => (
            <div key={day} className={`flex items-center gap-3 p-3 rounded-xl transition ${hours[i].closed ? 'bg-gray-50 opacity-70' : 'bg-white border border-gray-100'}`}>
              <div className="w-24 flex-shrink-0">
                <p className="text-xs font-bold text-gray-700">{day}</p>
              </div>
              <button onClick={() => setHours(h => h.map((r, idx) => idx === i ? { ...r, closed: !r.closed } : r))}
                className="flex-shrink-0 relative w-10 h-5 rounded-full transition-colors duration-200"
                style={{ background: !hours[i].closed ? '#7C3AED' : '#D1D5DB' }}>
                <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                  style={{ left: !hours[i].closed ? '22px' : '2px' }} />
              </button>
              <span className="text-[10px] text-gray-400 w-10">{hours[i].closed ? 'Closed' : 'Open'}</span>
              {!hours[i].closed && (
                <>
                  <select value={hours[i].open}
                    onChange={e => setHours(h => h.map((r, idx) => idx === i ? { ...r, open: e.target.value } : r))}
                    className="flex-1 h-8 rounded-lg border border-gray-200 px-2 text-xs text-gray-700 focus:outline-none focus:border-purple-400 bg-white">
                    {TIME_SLOTS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <span className="text-gray-300 text-xs">→</span>
                  <select value={hours[i].close}
                    onChange={e => setHours(h => h.map((r, idx) => idx === i ? { ...r, close: e.target.value } : r))}
                    className="flex-1 h-8 rounded-lg border border-gray-200 px-2 text-xs text-gray-700 focus:outline-none focus:border-purple-400 bg-white">
                    {TIME_SLOTS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
      <SaveBar onSave={save} onReset={() => setHours(DAYS.map(d => ({ open: '09:00', close: '19:00', closed: d === 'Sunday' })))} saved={saved} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   6. NOTIFICATION SETTINGS
══════════════════════════════════════════════════════════════════════════════ */
function NotificationSettings() {
  const init = () => { try { return JSON.parse(localStorage.getItem('neru-notif-settings') || '{}'); } catch { return {}; } };
  const d = init();
  const [cfg, setCfg] = useState({
    bookingNew: d.bookingNew ?? true, bookingConfirmed: d.bookingConfirmed ?? true,
    bookingCancelled: d.bookingCancelled ?? true, bookingReminder: d.bookingReminder ?? true,
    offerAlerts: d.offerAlerts ?? false, emailEnabled: d.emailEnabled ?? true,
    smsEnabled: d.smsEnabled ?? false, whatsappEnabled: d.whatsappEnabled ?? true,
    adminEmail: d.adminEmail ?? true, customerEmail: d.customerEmail ?? true,
  });
  const [saved, setSaved] = useState(false);
  const p = (k: string) => (v: boolean) => setCfg(c => ({ ...c, [k]: v }));
  const save = () => {
    localStorage.setItem('neru-notif-settings', JSON.stringify(cfg));
    setSaved(true); setTimeout(() => setSaved(false), 2500);
    toast({ title: 'Notification settings saved ✓' });
  };

  return (
    <div className="space-y-5">
      <SectionCard title="Booking Notifications" icon={Bell} color="#7C3AED">
        <Toggle checked={cfg.bookingNew} onChange={p('bookingNew')} label="New Booking Alert" description="Notify admin when a customer places a new booking" />
        <Toggle checked={cfg.bookingConfirmed} onChange={p('bookingConfirmed')} label="Booking Confirmed" description="Send confirmation to customer when booking is confirmed" />
        <Toggle checked={cfg.bookingCancelled} onChange={p('bookingCancelled')} label="Cancellation Alert" description="Notify both admin and customer when a booking is cancelled" />
        <Toggle checked={cfg.bookingReminder} onChange={p('bookingReminder')} label="Appointment Reminder" description="Send reminder to customer before their appointment" />
        <Toggle checked={cfg.offerAlerts} onChange={p('offerAlerts')} label="Offer Alerts" description="Notify customers when new offers or discounts go live" color="#D97706" />
      </SectionCard>

      <SectionCard title="Delivery Channels" icon={Wifi} color="#059669">
        <Toggle checked={cfg.emailEnabled} onChange={p('emailEnabled')} label="Email Notifications" description="Send notifications via email" color="#7C3AED" />
        <Toggle checked={cfg.whatsappEnabled} onChange={p('whatsappEnabled')} label="WhatsApp Notifications" description="Send WhatsApp messages (requires WhatsApp Business API)" color="#25D366" />
        <Toggle checked={cfg.smsEnabled} onChange={p('smsEnabled')} label="SMS Notifications" description="Send SMS messages (carrier charges may apply)" color="#059669" />
        <Toggle checked={cfg.adminEmail} onChange={p('adminEmail')} label="Admin Email Digest" description="Receive a daily summary of bookings and activity" />
        <Toggle checked={cfg.customerEmail} onChange={p('customerEmail')} label="Customer Marketing Emails" description="Send promotional emails to customers (respect unsubscribe)" />
      </SectionCard>

      <SaveBar onSave={save} onReset={() => setCfg({ bookingNew: true, bookingConfirmed: true, bookingCancelled: true, bookingReminder: true, offerAlerts: false, emailEnabled: true, smsEnabled: false, whatsappEnabled: true, adminEmail: true, customerEmail: true })} saved={saved} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   7. APPEARANCE SETTINGS
══════════════════════════════════════════════════════════════════════════════ */
function AppearanceSettings() {
  const init = () => { try { return JSON.parse(localStorage.getItem('neru-appearance-settings') || '{}'); } catch { return {}; } };
  const d = init();
  const [cfg, setCfg] = useState({ primaryColor: d.primaryColor ?? '#8B5CF6', accentColor: d.accentColor ?? '#D4A53F', theme: d.theme ?? 'light', fontFamily: d.fontFamily ?? 'Playfair Display', logoUrl: d.logoUrl ?? '', bannerUrl: d.bannerUrl ?? '' });
  const [saved, setSaved] = useState(false);
  const p = (k: string) => (v: string) => setCfg(c => ({ ...c, [k]: v }));
  const save = () => {
    localStorage.setItem('neru-appearance-settings', JSON.stringify(cfg));
    setSaved(true); setTimeout(() => setSaved(false), 2500);
    toast({ title: 'Appearance settings saved ✓' });
  };

  return (
    <div className="space-y-5">
      <SectionCard title="Brand Colors" icon={Palette} color="#EC4899">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Primary Color" hint="Used for buttons, highlights, and accents.">
            <div className="flex items-center gap-3">
              <input type="color" value={cfg.primaryColor} onChange={e => p('primaryColor')(e.target.value)}
                className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5" />
              <TextInput value={cfg.primaryColor} onChange={p('primaryColor')} placeholder="#8B5CF6" />
            </div>
          </Field>
          <Field label="Accent Color" hint="Used for gold/luxury details.">
            <div className="flex items-center gap-3">
              <input type="color" value={cfg.accentColor} onChange={e => p('accentColor')(e.target.value)}
                className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5" />
              <TextInput value={cfg.accentColor} onChange={p('accentColor')} placeholder="#D4A53F" />
            </div>
          </Field>
        </div>
        <div className="mt-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
          <p className="text-xs font-bold text-gray-500 mb-3">Color Preview</p>
          <div className="flex gap-3">
            <div className="flex-1 h-10 rounded-xl shadow-sm" style={{ background: cfg.primaryColor }} />
            <div className="flex-1 h-10 rounded-xl shadow-sm" style={{ background: cfg.accentColor }} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Typography & Theme" icon={Sun} color="#D97706">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Heading Font">
            <SelectInput value={cfg.fontFamily} onChange={p('fontFamily')} options={[
              { label: 'Playfair Display (Current)', value: 'Playfair Display' },
              { label: 'Cormorant Garamond', value: 'Cormorant Garamond' },
              { label: 'Libre Baskerville', value: 'Libre Baskerville' },
              { label: 'Montserrat', value: 'Montserrat' },
            ]} />
          </Field>
          <Field label="Default Theme">
            <div className="flex gap-2">
              {(['light', 'dark', 'system'] as const).map(t => (
                <button key={t} onClick={() => p('theme')(t)}
                  className="flex-1 h-10 rounded-xl border-2 text-xs font-bold capitalize transition-all"
                  style={cfg.theme === t ? { borderColor: '#7C3AED', background: '#EDE9FE', color: '#7C3AED' } : { borderColor: '#E5E7EB', background: 'white', color: '#6B7280' }}>
                  {t === 'light' ? '☀ Light' : t === 'dark' ? '🌙 Dark' : '⚙ System'}
                </button>
              ))}
            </div>
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Branding Assets" icon={Image} color="#9B1B30">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Logo URL" hint="Recommended: 200×60px PNG with transparent background.">
            <TextInput value={cfg.logoUrl} onChange={p('logoUrl')} placeholder="https://…/logo.png" />
          </Field>
          <Field label="Home Banner URL" hint="Recommended: 1920×600px JPG.">
            <TextInput value={cfg.bannerUrl} onChange={p('bannerUrl')} placeholder="https://…/banner.jpg" />
          </Field>
        </div>
        <div className="mt-4 flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50 border border-blue-100">
          <Info size={13} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-blue-600 text-xs">Upload images to a CDN (e.g. Cloudinary) and paste the URL here. Direct file upload requires backend storage.</p>
        </div>
      </SectionCard>

      <SaveBar onSave={save} onReset={() => setCfg({ primaryColor: '#8B5CF6', accentColor: '#D4A53F', theme: 'light', fontFamily: 'Playfair Display', logoUrl: '', bannerUrl: '' })} saved={saved} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   8. SOCIAL MEDIA
══════════════════════════════════════════════════════════════════════════════ */
function SocialMediaSettings() {
  const init = () => { try { return JSON.parse(localStorage.getItem('neru-social-settings') || '{}'); } catch { return {}; } };
  const d = init();
  const [form, setForm] = useState({ facebook: d.facebook ?? '', instagram: d.instagram ?? '', tiktok: d.tiktok ?? '', youtube: d.youtube ?? '', whatsapp: d.whatsapp ?? '' });
  const [saved, setSaved] = useState(false);
  const p = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));
  const save = () => {
    localStorage.setItem('neru-social-settings', JSON.stringify(form));
    setSaved(true); setTimeout(() => setSaved(false), 2500);
    toast({ title: 'Social media links saved ✓' });
  };

  const links = [
    { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/nerubeauty', color: '#E1306C' },
    { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/nerubeauty', color: '#1877F2' },
    { key: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@nerubeauty', color: '#FF0000' },
    { key: 'tiktok', label: 'TikTok', icon: Globe, placeholder: 'https://tiktok.com/@nerubeauty', color: '#010101' },
    { key: 'whatsapp', label: 'WhatsApp Business', icon: Phone, placeholder: 'https://wa.me/919876543210', color: '#25D366' },
  ];

  return (
    <div className="space-y-5">
      <SectionCard title="Social Media Links" icon={Share2} color="#E1306C">
        <div className="space-y-4">
          {links.map(({ key, label, icon: Icon, placeholder, color }) => (
            <Field key={key} label={label}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}18` }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <TextInput value={(form as Record<string, string>)[key]} onChange={p(key)} placeholder={placeholder} />
              </div>
            </Field>
          ))}
        </div>
      </SectionCard>
      <SaveBar onSave={save} onReset={() => setForm({ facebook: '', instagram: '', tiktok: '', youtube: '', whatsapp: '' })} saved={saved} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   9. SECURITY SETTINGS
══════════════════════════════════════════════════════════════════════════════ */
function SecuritySettings() {
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [emailForm, setEmailForm] = useState({ newEmail: '', password: '' });
  const [twoFa, setTwoFa] = useState(false);

  const changePw = () => {
    if (!pwForm.current || !pwForm.next) { toast({ title: 'Fill all password fields', variant: 'destructive' }); return; }
    if (pwForm.next !== pwForm.confirm) { toast({ title: 'Passwords do not match', variant: 'destructive' }); return; }
    if (pwForm.next.length < 8) { toast({ title: 'Password must be at least 8 characters', variant: 'destructive' }); return; }
    toast({ title: 'Password updated ✓', description: 'Your admin password has been changed.' });
    setPwForm({ current: '', next: '', confirm: '' });
  };

  const changeEmail = () => {
    if (!emailForm.newEmail || !emailForm.password) { toast({ title: 'Fill all fields', variant: 'destructive' }); return; }
    toast({ title: 'Email updated ✓', description: 'Admin email address has been changed.' });
    setEmailForm({ newEmail: '', password: '' });
  };

  return (
    <div className="space-y-5">
      <SectionCard title="Change Password" icon={Key} color="#7C3AED">
        <div className="space-y-4 max-w-md">
          <Field label="Current Password">
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={pwForm.current}
                onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))}
                className="w-full h-10 rounded-xl border border-gray-200 px-3.5 pr-10 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                placeholder="Enter current password" />
              <button onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>
          <Field label="New Password" hint="Minimum 8 characters.">
            <input type={showPw ? 'text' : 'password'} value={pwForm.next}
              onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))}
              className="w-full h-10 rounded-xl border border-gray-200 px-3.5 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              placeholder="Enter new password" />
          </Field>
          <Field label="Confirm New Password">
            <input type={showPw ? 'text' : 'password'} value={pwForm.confirm}
              onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
              className="w-full h-10 rounded-xl border border-gray-200 px-3.5 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              placeholder="Confirm new password" />
          </Field>
          {pwForm.next && pwForm.confirm && pwForm.next !== pwForm.confirm && (
            <div className="flex items-center gap-2 text-red-500 text-xs"><AlertTriangle size={12} /> Passwords do not match</div>
          )}
          <button onClick={changePw}
            className="flex items-center gap-2 px-5 h-10 rounded-xl text-white font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
            <Lock size={13} /> Update Password
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Update Email" icon={Mail} color="#059669">
        <div className="space-y-4 max-w-md">
          <Field label="New Email Address">
            <TextInput value={emailForm.newEmail} onChange={v => setEmailForm(f => ({ ...f, newEmail: v }))} placeholder="new@email.com" type="email" />
          </Field>
          <Field label="Confirm with Password">
            <input type="password" value={emailForm.password}
              onChange={e => setEmailForm(f => ({ ...f, password: e.target.value }))}
              className="w-full h-10 rounded-xl border border-gray-200 px-3.5 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              placeholder="Enter your password" />
          </Field>
          <button onClick={changeEmail}
            className="flex items-center gap-2 px-5 h-10 rounded-xl text-white font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all"
            style={{ background: 'linear-gradient(135deg,#059669,#10B981)' }}>
            <Mail size={13} /> Update Email
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Two-Factor Authentication" icon={ShieldCheck} color="#D97706">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-1">Enable 2FA</p>
            <p className="text-xs text-gray-500">Add an extra layer of security to your admin account using an authenticator app.</p>
            {twoFa && <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-700"><Check size={9} /> Active</span>}
          </div>
          <button onClick={() => { setTwoFa(t => !t); toast({ title: twoFa ? '2FA disabled' : '2FA enabled ✓' }); }}
            className="flex-shrink-0 relative w-11 h-6 rounded-full transition-colors duration-200"
            style={{ background: twoFa ? '#059669' : '#D1D5DB' }}>
            <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200" style={{ left: twoFa ? '22px' : '2px' }} />
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   10. BACKUP & SYSTEM
══════════════════════════════════════════════════════════════════════════════ */
function BackupSettings() {
  const [exporting, setExporting] = useState(false);

  const exportData = () => {
    setExporting(true);
    setTimeout(() => {
      const data: Record<string, unknown> = {};
      const keys = ['neru-bookings', 'neru-offers', 'neru-payment-config', 'neru-general-settings', 'neru-hours-settings', 'neru-notif-settings', 'neru-social-settings', 'neru-booking-settings'];
      keys.forEach(k => { try { data[k] = JSON.parse(localStorage.getItem(k) || 'null'); } catch { data[k] = null; } });
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url;
      a.download = `neru-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
      URL.revokeObjectURL(url);
      setExporting(false);
      toast({ title: 'Backup downloaded ✓', description: 'All data exported as JSON.' });
    }, 800);
  };

  const sysInfo = [
    { label: 'App Version', value: '1.0.0' },
    { label: 'Build', value: 'Vite + React 18 + TypeScript' },
    { label: 'Storage Used', value: `${(JSON.stringify(localStorage).length / 1024).toFixed(1)} KB` },
    { label: 'Total Bookings', value: (() => { try { return JSON.parse(localStorage.getItem('neru-bookings') || '[]').length; } catch { return 0; } })() },
    { label: 'Total Offers', value: (() => { try { return JSON.parse(localStorage.getItem('neru-offers') || '[]').length; } catch { return 0; } })() },
    { label: 'Storage Engine', value: 'localStorage (client-side)' },
  ];

  return (
    <div className="space-y-5">
      <SectionCard title="Export & Backup" icon={Download} color="#7C3AED">
        <p className="text-sm text-gray-600 mb-4">Download a full JSON backup of all bookings, settings, offers, and configuration stored in this browser.</p>
        <button onClick={exportData} disabled={exporting}
          className="flex items-center gap-2 px-6 h-10 rounded-xl text-white font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
          {exporting ? <><Cpu size={14} className="animate-spin" /> Exporting…</> : <><Download size={14} /> Export All Data</>}
        </button>
        <div className="mt-4 flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-100">
          <AlertTriangle size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-amber-700 text-xs">Data is stored locally in your browser. Export regularly to prevent data loss when clearing browser storage.</p>
        </div>
      </SectionCard>

      <SectionCard title="System Information" icon={HardDrive} color="#059669">
        <div className="space-y-0 divide-y divide-gray-50">
          {sysInfo.map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-3">
              <span className="text-xs text-gray-500">{label}</span>
              <span className="text-xs font-bold text-gray-800">{String(value)}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Danger Zone" icon={AlertTriangle} color="#DC2626">
        <p className="text-sm text-gray-600 mb-4">Permanently clear all locally stored data. This action cannot be undone.</p>
        <button
          onClick={() => {
            if (!window.confirm('This will DELETE ALL data stored locally. Are you absolutely sure?')) return;
            const keys = ['neru-bookings', 'neru-offers', 'neru-payment-config', 'neru-general-settings', 'neru-hours-settings', 'neru-notif-settings', 'neru-social-settings', 'neru-booking-settings', 'neru-customers', 'neru-customer-auth'];
            keys.forEach(k => localStorage.removeItem(k));
            toast({ title: 'All data cleared', description: 'Local storage has been wiped.', variant: 'destructive' });
          }}
          className="flex items-center gap-2 px-5 h-10 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 font-bold text-sm transition-all">
          <Trash2 size={14} /> Clear All Local Data
        </button>
      </SectionCard>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CATEGORY NAV CONFIG
══════════════════════════════════════════════════════════════════════════════ */
const CATEGORIES = [
  { id: 'general',       label: 'General',          icon: Store,       color: '#9B1B30',  component: GeneralSettings        },
  { id: 'booking',       label: 'Booking',           icon: Calendar,    color: '#7C3AED',  component: BookingSettings        },
  { id: 'payment',       label: 'Payment',           icon: CreditCard,  color: '#059669',  component: PaymentSettingsSection  },
  { id: 'offers',        label: 'Offers',            icon: Tag,         color: '#D97706',  component: OffersSettingsSection   },
  { id: 'hours',         label: 'Business Hours',    icon: Clock,       color: '#7C3AED',  component: BusinessHoursSettings   },
  { id: 'notifications', label: 'Notifications',     icon: Bell,        color: '#EC4899',  component: NotificationSettings    },
  { id: 'appearance',    label: 'Appearance',        icon: Palette,     color: '#8B5CF6',  component: AppearanceSettings      },
  { id: 'social',        label: 'Social Media',      icon: Share2,      color: '#E1306C',  component: SocialMediaSettings     },
  { id: 'security',      label: 'Security',          icon: ShieldCheck, color: '#DC2626',  component: SecuritySettings        },
  { id: 'backup',        label: 'Backup & System',   icon: Database,    color: '#374151',  component: BackupSettings          },
] as const;

type CategoryId = (typeof CATEGORIES)[number]['id'];

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════════════ */
export default function AdminSettings() {
  const navigate = useNavigate();
  const [active, setActive] = useState<CategoryId>('general');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('neru-admin-auth')) navigate('/admin');
  }, [navigate]);

  const activeCat = CATEGORIES.find(c => c.id === active)!;
  const ActiveComponent = activeCat.component;

  return (
    <AdminLayout>
      {/* ── Hero ── */}
      <div className="px-5 lg:px-7 py-6" style={{ background: 'linear-gradient(135deg,#7B0D1E 0%,#9B1B30 55%,#A83222 100%)' }}>
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl flex items-center justify-center flex-shrink-0 w-14 h-14"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
            <activeCat.icon size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white" style={{ fontFamily: "'Playfair Display',serif" }}>
              Settings
            </h1>
            <p className="text-rose-200 text-sm mt-0.5">{activeCat.label} · Neru Beauty Management Portal</p>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto p-4 lg:p-5">
        {/* Mobile category picker */}
        <div className="lg:hidden mb-4">
          <button onClick={() => setMobileOpen(o => !o)}
            className="w-full flex items-center justify-between px-4 h-11 rounded-2xl bg-white border border-gray-200 shadow-sm text-sm font-bold text-gray-700">
            <span className="flex items-center gap-2.5">
              <activeCat.icon size={15} style={{ color: activeCat.color }} />
              {activeCat.label}
            </span>
            <ChevronRight size={15} className={`text-gray-400 transition-transform ${mobileOpen ? 'rotate-90' : ''}`} />
          </button>
          {mobileOpen && (
            <div className="mt-2 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => { setActive(cat.id); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors border-b border-gray-50 last:border-0"
                  style={active === cat.id ? { background: `${cat.color}10`, color: cat.color } : { color: '#374151' }}>
                  <cat.icon size={15} style={{ color: cat.color }} />
                  {cat.label}
                  {active === cat.id && <Check size={12} className="ml-auto" style={{ color: cat.color }} />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* ── Desktop sidebar ── */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Settings Menu</p>
              </div>
              <nav className="py-2">
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => setActive(cat.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-all duration-150 relative group"
                    style={active === cat.id
                      ? { background: `${cat.color}12`, color: cat.color }
                      : { color: '#6B7280' }}>
                    {active === cat.id && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full" style={{ background: cat.color }} />
                    )}
                    <cat.icon size={15} style={{ color: active === cat.id ? cat.color : '#9CA3AF' }} />
                    <span className="truncate">{cat.label}</span>
                    {active === cat.id && <ChevronRight size={12} className="ml-auto opacity-50" style={{ color: cat.color }} />}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* ── Content ── */}
          <main className="flex-1 min-w-0">
            <ActiveComponent />
          </main>
        </div>
      </div>
    </AdminLayout>
  );
}
