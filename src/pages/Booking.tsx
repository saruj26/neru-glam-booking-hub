import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, CreditCard, Banknote, Tag, CheckCircle, Sparkles, Clock, ArrowRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  getPaymentConfig, getBestOffer, getServicePrice, calculatePricing,
  generateBookingId, upsertBooking, fmt,
  type PricingBreakdown, type Offer,
} from '@/lib/paymentUtils';

/* ─── Schema ────────────────────────────────────────────────────────────── */
const formSchema = z.object({
  name:             z.string().min(2,  { message: 'Name must be at least 2 characters.' }),
  email:            z.string().email({ message: 'Please enter a valid email address.' }),
  phone:            z.string().min(10, { message: 'Phone number must be at least 10 digits.' }),
  serviceCategory:  z.string({ required_error: 'Please select a service category.' }),
  serviceType:      z.string({ required_error: 'Please select a service type.' }),
  date:             z.date({ required_error: 'Please select a date.' }),
  time:             z.string({ required_error: 'Please select a time.' }),
  specialRequests:  z.string().optional(),
});

/* ─── Service options ───────────────────────────────────────────────────── */
const serviceOptions: Record<string, string[]> = {
  birthday:  ['Basic Birthday Glam', 'Premium Birthday Glam', 'Themed Birthday Makeup'],
  puberty:   ['Traditional Ceremony Look', 'Modern Ceremony Look', 'Premium Ceremony Package'],
  reception: ['Minimal Reception Glam', 'Classic Reception Look', 'Full Glamour Reception'],
  wedding:   ['Minimal Bridal Look', 'Traditional Bridal Makeup', 'Luxury Bridal Package'],
  other:     ['Festive Makeup', 'Modeling/Photoshoot Makeup', 'Office/Interview Looks'],
};

const categoryLabels: Record<string, string> = {
  birthday: 'Birthday Makeup', puberty: 'Puberty Ceremony',
  reception: 'Reception Makeup', wedding: 'Wedding Makeup', other: 'Other Services',
};

const TIME_SLOTS = [
  '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM',
];

/* ─── Pricing Summary Card ──────────────────────────────────────────────── */
function PricingSummary({
  pricing, offer, category, serviceType, paymentMethod, onMethodChange, onlineEnabled, cashEnabled,
}: {
  pricing: PricingBreakdown;
  offer: Offer | null;
  category: string;
  serviceType: string;
  paymentMethod: 'online' | 'cash';
  onMethodChange: (m: 'online' | 'cash') => void;
  onlineEnabled: boolean;
  cashEnabled: boolean;
}) {
  const hasDiscount = pricing.discountAmount > 0;
  const requiresAdvance = pricing.advancePercent > 0 && paymentMethod === 'online';

  return (
    <div className="sticky top-6 space-y-4">
      {/* Offer banner */}
      {offer && (
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#3B0764,#7C3AED,#D4A53F)' }} />
          <div className="relative p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Zap size={18} className="text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-extrabold text-sm">{offer.name}</span>
                <span className="bg-amber-400 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {pricing.discountLabel}
                </span>
              </div>
              <p className="text-purple-200 text-xs mt-0.5">{offer.description}</p>
              {offer.code && (
                <p className="text-amber-300 text-[10px] font-mono font-bold mt-1">Code: {offer.code}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pricing breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Price Breakdown</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{categoryLabels[category] || 'Service'}</span>
              <div className="text-right">
                {hasDiscount && (
                  <span className="line-through text-gray-400 text-xs mr-2">{fmt(pricing.originalPrice)}</span>
                )}
                <span className="font-semibold text-gray-800">{fmt(pricing.finalPrice)}</span>
              </div>
            </div>

            {hasDiscount && (
              <div className="flex justify-between text-sm text-emerald-600">
                <span className="flex items-center gap-1"><Tag size={11} /> Discount ({pricing.discountLabel})</span>
                <span className="font-semibold">- {fmt(pricing.discountAmount)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-800">Total Payable</span>
            <span className="text-xl font-extrabold text-neru-purple">{fmt(pricing.finalPrice)}</span>
          </div>

          {pricing.advancePercent > 0 && paymentMethod === 'online' && (
            <>
              <div className="h-px bg-gray-100" />
              <div className="flex justify-between text-sm">
                <span className="text-purple-700 font-medium flex items-center gap-1">
                  <CreditCard size={11} /> Pay Now ({pricing.advancePercent}% advance)
                </span>
                <span className="font-bold text-purple-700">{fmt(pricing.advanceAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <Banknote size={11} /> Pay After Service
                </span>
                <span className="font-bold text-emerald-700">{fmt(pricing.remainingAmount)}</span>
              </div>
            </>
          )}

          {paymentMethod === 'cash' && (
            <>
              <div className="h-px bg-gray-100" />
              <div className="flex justify-between text-sm">
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <Banknote size={11} /> Pay After Service (Cash)
                </span>
                <span className="font-bold text-emerald-700">{fmt(pricing.finalPrice)}</span>
              </div>
            </>
          )}
        </div>

        {/* Savings pill */}
        {hasDiscount && (
          <div className="px-4 pb-4">
            <div className="bg-emerald-50 rounded-xl p-2.5 flex items-center justify-center gap-2">
              <CheckCircle size={13} className="text-emerald-600" />
              <p className="text-emerald-700 text-xs font-semibold">
                You save {fmt(pricing.discountAmount)} with this offer!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Payment method selection */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Payment Method</p>
        <div className="space-y-2.5">
          {onlineEnabled && (
            <button
              type="button"
              onClick={() => onMethodChange('online')}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left"
              style={paymentMethod === 'online'
                ? { borderColor: '#7C3AED', background: '#F5F3FF' }
                : { borderColor: '#E5E7EB', background: 'white' }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: paymentMethod === 'online' ? '#EDE9FE' : '#F9F9F9' }}>
                <CreditCard size={16} style={{ color: paymentMethod === 'online' ? '#7C3AED' : '#9CA3AF' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: paymentMethod === 'online' ? '#7C3AED' : '#374151' }}>
                  Online Payment
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {pricing.advancePercent > 0
                    ? `Pay ${fmt(pricing.advanceAmount)} now to confirm instantly`
                    : 'No advance required — confirm online'}
                </p>
              </div>
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                style={{ borderColor: paymentMethod === 'online' ? '#7C3AED' : '#D1D5DB' }}>
                {paymentMethod === 'online' && <div className="w-2 h-2 rounded-full bg-neru-purple" />}
              </div>
            </button>
          )}

          {cashEnabled && (
            <button
              type="button"
              onClick={() => onMethodChange('cash')}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left"
              style={paymentMethod === 'cash'
                ? { borderColor: '#059669', background: '#F0FDF4' }
                : { borderColor: '#E5E7EB', background: 'white' }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: paymentMethod === 'cash' ? '#DCFCE7' : '#F9F9F9' }}>
                <Banknote size={16} style={{ color: paymentMethod === 'cash' ? '#059669' : '#9CA3AF' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: paymentMethod === 'cash' ? '#059669' : '#374151' }}>
                  Cash / Pay After Service
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Pay the full amount on your appointment day</p>
              </div>
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                style={{ borderColor: paymentMethod === 'cash' ? '#059669' : '#D1D5DB' }}>
                {paymentMethod === 'cash' && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Confirmation Modal ─────────────────────────────────────────────────── */
function ConfirmationModal({ bookingId, paymentMethod, pricing, onClose }:
  { bookingId: string; paymentMethod: 'online' | 'cash'; pricing: PricingBreakdown; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'linear-gradient(135deg,#059669,#10B981)' }}>
          <CheckCircle size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>
          Booking Confirmed!
        </h2>
        <p className="text-gray-500 text-sm mb-4">Your beauty appointment has been successfully booked.</p>

        <div className="bg-gray-50 rounded-2xl p-4 mb-5 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Booking ID</span>
            <span className="font-bold text-neru-purple font-mono">{bookingId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Amount</span>
            <span className="font-bold text-gray-800">{fmt(pricing.finalPrice)}</span>
          </div>
          {paymentMethod === 'online' && pricing.advancePercent > 0 && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Paid Now</span>
                <span className="font-bold text-purple-600">{fmt(pricing.advanceAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Pay After Service</span>
                <span className="font-bold text-emerald-600">{fmt(pricing.remainingAmount)}</span>
              </div>
            </>
          )}
          {paymentMethod === 'cash' && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment</span>
              <span className="font-bold text-emerald-600">Cash on Appointment Day</span>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 mb-5">
          A confirmation will be sent to your email. Our team will contact you within 24 hours.
        </p>

        <button onClick={onClose}
          className="w-full h-11 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
          Done <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ─── Main Booking Page ──────────────────────────────────────────────────── */
const Booking = () => {
  const navigate = useNavigate();
  const [serviceCategory, setServiceCategory] = useState<string | null>(null);
  const [serviceType,     setServiceType]     = useState<string | null>(null);
  const [paymentMethod,   setPaymentMethod]   = useState<'online' | 'cash'>('online');
  const [pricing,         setPricing]         = useState<PricingBreakdown | null>(null);
  const [activeoffer,     setActiveOffer]      = useState<Offer | null>(null);
  const [payConfig,       setPayConfig]        = useState(getPaymentConfig());
  const [confirmedId,     setConfirmedId]      = useState<string | null>(null);
  const [submitting,      setSubmitting]       = useState(false);

  /* Load payment config */
  useEffect(() => { setPayConfig(getPaymentConfig()); }, []);

  /* Recalculate pricing when category or type changes */
  useEffect(() => {
    if (!serviceCategory || !serviceType) { setPricing(null); return; }
    const price = getServicePrice(serviceCategory, serviceType);
    const offer = getBestOffer(serviceCategory);
    setActiveOffer(offer);
    setPricing(calculatePricing(price, offer, payConfig.advancePercent));
  }, [serviceCategory, serviceType, payConfig.advancePercent]);

  /* Default payment method to first available */
  useEffect(() => {
    if (!payConfig.onlineEnabled && payConfig.cashEnabled) setPaymentMethod('cash');
    if (payConfig.onlineEnabled) setPaymentMethod('online');
  }, [payConfig]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', phone: '', specialRequests: '' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!pricing) return;
    setSubmitting(true);

    setTimeout(() => {
      const bookingId = generateBookingId();
      const isCash = paymentMethod === 'cash';
      const isFullOnline = paymentMethod === 'online' && pricing.advancePercent === 100;

      const status = isCash
        ? 'confirmed'
        : pricing.advancePercent === 0
          ? 'confirmed'
          : 'partially_paid';

      upsertBooking({
        id: bookingId,
        customer: { name: values.name, email: values.email, phone: values.phone },
        service: {
          name: values.serviceType,
          category: values.serviceCategory,
          type: values.serviceType,
        },
        date: format(values.date, 'yyyy-MM-dd'),
        time: values.time,
        specialRequests: values.specialRequests ?? '',
        pricing,
        payment: {
          method: paymentMethod,
          status: isFullOnline ? 'confirmed' : status,
          paidAmount: isCash ? 0 : pricing.advanceAmount,
          remainingAmount: isCash ? pricing.finalPrice : pricing.remainingAmount,
          transactionId: paymentMethod === 'online' ? `TXN-${Date.now()}` : undefined,
        },
        createdAt: new Date().toISOString(),
        status: isCash ? 'confirmed' : status,
      });

      setSubmitting(false);
      setConfirmedId(bookingId);
    }, 1200);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section className="relative py-12 md:py-20" style={{ background: 'linear-gradient(135deg,#3B0764 0%,#6D28D9 50%,#7C3AED 80%,#B45309 100%)' }}>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1525095182007-3364fc39a332?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-15" />
          <div className="container mx-auto px-4 relative text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 px-4 py-1.5 rounded-full text-white text-xs font-semibold mb-4">
              <Sparkles size={12} className="text-amber-300" /> Premium Beauty Services
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "'Playfair Display',serif" }}>
              Book Your Appointment
            </h1>
            <p className="text-purple-200 text-lg max-w-xl mx-auto">
              Reserve your spot for a personalised beauty experience crafted just for you.
            </p>
          </div>
        </section>

        {/* Form + Pricing */}
        <section className="py-12 bg-neru-lightGray">
          <div className="container mx-auto px-4">
            <div className={cn('gap-8', pricing ? 'grid lg:grid-cols-[1fr_360px]' : 'max-w-2xl mx-auto')}>

              {/* ── Form ── */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
                    <CalendarIcon size={15} className="text-white" />
                  </div>
                  <h2 className="text-xl font-extrabold text-neru-darkGray" style={{ fontFamily: "'Playfair Display',serif" }}>
                    Book Your Beauty Service
                  </h2>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field}
                              className="h-11 rounded-xl border-gray-200 focus-visible:ring-neru-purple/30 focus-visible:border-neru-purple/50" />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="your@email.com" {...field}
                              className="h-11 rounded-xl border-gray-200 focus-visible:ring-neru-purple/30 focus-visible:border-neru-purple/50" />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )} />
                    </div>

                    {/* Phone */}
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 98765 43210" {...field}
                            className="h-11 rounded-xl border-gray-200 focus-visible:ring-neru-purple/30 focus-visible:border-neru-purple/50" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )} />

                    {/* Category + Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField control={form.control} name="serviceCategory" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider">Service Category</FormLabel>
                          <Select onValueChange={v => { field.onChange(v); setServiceCategory(v); setServiceType(null); form.setValue('serviceType', ''); }}
                            defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 rounded-xl border-gray-200 focus:ring-neru-purple/30">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(categoryLabels).map(([val, lbl]) => (
                                <SelectItem key={val} value={val}>{lbl}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="serviceType" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider">Service Type</FormLabel>
                          <Select onValueChange={v => { field.onChange(v); setServiceType(v); }}
                            defaultValue={field.value} disabled={!serviceCategory}>
                            <FormControl>
                              <SelectTrigger className="h-11 rounded-xl border-gray-200 focus:ring-neru-purple/30">
                                <SelectValue placeholder={serviceCategory ? 'Select type' : 'First select a category'} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {serviceCategory && serviceOptions[serviceCategory]?.map(opt => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )} />
                    </div>

                    {/* Date + Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField control={form.control} name="date" render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider">Appointment Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline"
                                  className={cn('h-11 rounded-xl border-gray-200 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                  {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange}
                                disabled={d => d < new Date()} initialFocus className="p-3 pointer-events-auto" />
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="time" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider">Preferred Time</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 rounded-xl border-gray-200 focus:ring-neru-purple/30">
                                <SelectValue placeholder="Select time slot" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TIME_SLOTS.map(t => (
                                <SelectItem key={t} value={t}>
                                  <span className="flex items-center gap-2"><Clock size={12} />{t}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )} />
                    </div>

                    {/* Special requests */}
                    <FormField control={form.control} name="specialRequests" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider">Special Requests (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Any special requirements, skin sensitivities, or notes for our artists…"
                            {...field} className="rounded-xl border-gray-200 min-h-[90px] focus-visible:ring-neru-purple/30 focus-visible:border-neru-purple/50 resize-none" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )} />

                    {/* Mobile pricing (shows below form on mobile when pricing available) */}
                    {pricing && (
                      <div className="lg:hidden">
                        <PricingSummary
                          pricing={pricing} offer={activeoffer}
                          category={serviceCategory ?? ''} serviceType={serviceType ?? ''}
                          paymentMethod={paymentMethod} onMethodChange={setPaymentMethod}
                          onlineEnabled={payConfig.onlineEnabled} cashEnabled={payConfig.cashEnabled}
                        />
                      </div>
                    )}

                    {/* No service selected hint */}
                    {!pricing && (
                      <div className="flex items-center gap-2 p-3.5 rounded-xl bg-amber-50 border border-amber-100">
                        <Tag size={14} className="text-amber-600 flex-shrink-0" />
                        <p className="text-amber-700 text-xs leading-relaxed">
                          Select a service category and type to see pricing, available offers, and payment options.
                        </p>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting || !pricing}
                      className="w-full h-12 rounded-xl text-white font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg,#7C3AED 0%,#8B5CF6 60%,#B45309 100%)' }}
                    >
                      {submitting ? (
                        <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg> Processing…</>
                      ) : (
                        <>Confirm Booking
                          {pricing && paymentMethod === 'online' && pricing.advancePercent > 0
                            ? ` & Pay ${fmt(pricing.advanceAmount)}`
                            : ''}
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-gray-400">
                      By booking you agree to our <a href="#" className="text-neru-purple hover:underline">cancellation policy</a>
                    </p>
                  </form>
                </Form>
              </div>

              {/* ── Pricing Panel (desktop only, hidden on mobile — shown inline above) ── */}
              {pricing && (
                <div className="hidden lg:block">
                  <PricingSummary
                    pricing={pricing} offer={activeoffer}
                    category={serviceCategory ?? ''} serviceType={serviceType ?? ''}
                    paymentMethod={paymentMethod} onMethodChange={setPaymentMethod}
                    onlineEnabled={payConfig.onlineEnabled} cashEnabled={payConfig.cashEnabled}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Info cards */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Booking Policy',
                  items: [
                    'One booking per customer per day for quality service',
                    `Advance payment of ${payConfig.advancePercent}% required to confirm booking`,
                    'Appointments should be made at least 48 hours in advance',
                    'Confirmation will be sent via email and phone',
                  ],
                },
                {
                  title: 'Cancellation Policy',
                  items: [
                    'Free cancellation up to 24 hours before appointment',
                    'Cancellations within 24 hours forfeit advance payment',
                    'One free rescheduling with 24-hour notice',
                    'No-shows result in full forfeiture of advance payment',
                  ],
                },
              ].map(({ title, items }) => (
                <div key={title} className="bg-neru-lightGray rounded-2xl p-6">
                  <h3 className="text-base font-bold text-neru-purple mb-4">{title}</h3>
                  <ul className="space-y-3">
                    {items.map(item => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <CheckCircle size={14} className="text-neru-gold mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Booking confirmation modal */}
      {confirmedId && pricing && (
        <ConfirmationModal
          bookingId={confirmedId}
          paymentMethod={paymentMethod}
          pricing={pricing}
          onClose={() => { setConfirmedId(null); navigate('/dashboard'); }}
        />
      )}
    </div>
  );
};

export default Booking;
