import { bookingsApi, offersApi, paymentApi } from './apiService';

/* ─── Types ────────────────────────────────────────────────────────────── */
export interface PaymentConfig {
  advancePercent: number;
  onlineEnabled: boolean;
  cashEnabled: boolean;
}

export interface Offer {
  id?: string;
  offerId?: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  applicableServices: string[];
  startDate: string;
  endDate: string;
  active: boolean;
  code?: string;
}

export interface PricingBreakdown {
  originalPrice: number;
  discountAmount: number;
  discountLabel: string;
  finalPrice: number;
  advancePercent: number;
  advanceAmount: number;
  remainingAmount: number;
  offer: Offer | null;
}

export interface BookingPaymentInfo {
  method: 'online' | 'cash';
  status: 'pending_payment' | 'confirmed' | 'partially_paid' | 'completed' | 'cancelled';
  paidAmount: number;
  remainingAmount: number;
  transactionId?: string;
}

export interface StoredBooking {
  id?: string;
  bookingId?: string;
  customer: { name: string; email: string; phone: string };
  service: { name: string; category: string; type: string };
  date: string;
  time: string;
  specialRequests: string;
  pricing: PricingBreakdown;
  payment: BookingPaymentInfo;
  createdAt: string;
  status: 'pending_payment' | 'confirmed' | 'partially_paid' | 'completed' | 'cancelled';
}

/* ─── Service Price Catalog ─────────────────────────────────────────────── */
export const SERVICE_PRICES: Record<string, Record<string, number>> = {
  birthday: {
    'Basic Birthday Glam': 2500,
    'Premium Birthday Glam': 3500,
    'Themed Birthday Makeup': 4500,
  },
  puberty: {
    'Traditional Ceremony Look': 4000,
    'Modern Ceremony Look': 5000,
    'Premium Ceremony Package': 6500,
  },
  reception: {
    'Minimal Reception Glam': 5500,
    'Classic Reception Look': 7000,
    'Full Glamour Reception': 9000,
  },
  wedding: {
    'Minimal Bridal Look': 8000,
    'Traditional Bridal Makeup': 12000,
    'Luxury Bridal Package': 18000,
  },
  other: {
    'Festive Makeup': 2000,
    'Modeling/Photoshoot Makeup': 3000,
    'Office/Interview Looks': 1500,
  },
};

export function getServicePrice(category: string, serviceType: string): number {
  return SERVICE_PRICES[category]?.[serviceType] ?? 3000;
}

/* ─── Defaults ──────────────────────────────────────────────────────────── */
export const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  advancePercent: 10,
  onlineEnabled: true,
  cashEnabled: true,
};

const SEED_OFFERS: Offer[] = [
  {
    id: 'OFF-001',
    name: 'Bridal Season Special',
    description: 'Exclusive 20% off on all wedding and reception packages this season',
    discountType: 'percentage',
    discountValue: 20,
    applicableServices: ['wedding', 'reception'],
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    active: true,
    code: 'BRIDAL20',
  },
  {
    id: 'OFF-002',
    name: 'Birthday Month Celebration',
    description: '₹500 flat off on all birthday makeup packages',
    discountType: 'fixed',
    discountValue: 500,
    applicableServices: ['birthday'],
    startDate: '2026-06-01',
    endDate: '2026-07-31',
    active: true,
    code: 'BDAY500',
  },
];

/* ─── API-backed storage helpers ─────────────────────────────────────────── */

export async function getPaymentConfigAsync(): Promise<PaymentConfig> {
  try {
    return await paymentApi.getConfig();
  } catch {
    return { ...DEFAULT_PAYMENT_CONFIG };
  }
}

export async function savePaymentConfigAsync(cfg: PaymentConfig): Promise<void> {
  await paymentApi.updateConfig(cfg);
}

export async function getOffersAsync(): Promise<Offer[]> {
  try {
    const offers = await offersApi.getAll();
    if (offers.length === 0) {
      await offersApi.bulkUpdate(SEED_OFFERS);
      return SEED_OFFERS;
    }
    return offers;
  } catch {
    return SEED_OFFERS;
  }
}

export async function saveOffersAsync(offers: Offer[]): Promise<void> {
  await offersApi.bulkUpdate(offers);
}

export async function getBookingsAsync(): Promise<StoredBooking[]> {
  try {
    return await bookingsApi.getAll();
  } catch {
    return [];
  }
}

export async function getBookingsByCustomerAsync(email: string): Promise<StoredBooking[]> {
  try {
    return await bookingsApi.getByCustomer(email);
  } catch {
    return [];
  }
}

export async function upsertBookingAsync(booking: StoredBooking): Promise<StoredBooking> {
  return bookingsApi.create(booking);
}

export async function generateBookingIdAsync(): Promise<string> {
  const yr = new Date().getFullYear();
  try {
    const all = await bookingsApi.getAll();
    const n = String(all.length + 1).padStart(3, '0');
    return `NB-${yr}-${n}`;
  } catch {
    return `NB-${yr}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
  }
}

/* ─── Synchronous localStorage fallbacks (kept for backward compat) ─────── */
export function getPaymentConfig(): PaymentConfig {
  try {
    const raw = localStorage.getItem('neru-payment-config');
    if (raw) return { ...DEFAULT_PAYMENT_CONFIG, ...(JSON.parse(raw) as PaymentConfig) };
  } catch { /* */ }
  return { ...DEFAULT_PAYMENT_CONFIG };
}

export function savePaymentConfig(cfg: PaymentConfig): void {
  localStorage.setItem('neru-payment-config', JSON.stringify(cfg));
  savePaymentConfigAsync(cfg).catch(() => {/* */});
}

export function getOffers(): Offer[] {
  try {
    const raw = localStorage.getItem('neru-offers');
    if (raw) return JSON.parse(raw) as Offer[];
  } catch { /* */ }
  localStorage.setItem('neru-offers', JSON.stringify(SEED_OFFERS));
  return SEED_OFFERS;
}

export function saveOffers(offers: Offer[]): void {
  localStorage.setItem('neru-offers', JSON.stringify(offers));
  saveOffersAsync(offers).catch(() => {/* */});
}

export function getBookings(): StoredBooking[] {
  try {
    const raw = localStorage.getItem('neru-bookings');
    if (raw) return JSON.parse(raw) as StoredBooking[];
  } catch { /* */ }
  return [];
}

export function upsertBooking(booking: StoredBooking): void {
  const all = getBookings();
  const idx = all.findIndex(b => b.id === booking.id);
  if (idx >= 0) all[idx] = booking;
  else all.unshift(booking);
  localStorage.setItem('neru-bookings', JSON.stringify(all));
  upsertBookingAsync(booking).catch(() => {/* */});
}

export function generateBookingId(): string {
  const yr = new Date().getFullYear();
  const n = String(getBookings().length + 1).padStart(3, '0');
  return `NB-${yr}-${n}`;
}

/* ─── Active offer helpers ───────────────────────────────────────────────── */
export function getActiveOffersForCategory(category: string): Offer[] {
  const today = new Date().toISOString().split('T')[0];
  return getOffers().filter(
    o =>
      o.active &&
      o.startDate <= today &&
      o.endDate >= today &&
      (o.applicableServices.includes('all') || o.applicableServices.includes(category)),
  );
}

export async function getActiveOffersForCategoryAsync(category: string): Promise<Offer[]> {
  try {
    return await offersApi.getForCategory(category);
  } catch {
    return getActiveOffersForCategory(category);
  }
}

export function getBestOffer(category: string): Offer | null {
  const offers = getActiveOffersForCategory(category);
  if (!offers.length) return null;
  return offers.reduce((best, curr) => {
    const score = (o: Offer) =>
      o.discountType === 'percentage' ? o.discountValue * 100 : o.discountValue;
    return score(curr) > score(best) ? curr : best;
  });
}

/* ─── Pricing calculator ─────────────────────────────────────────────────── */
export function calculateDiscount(price: number, offer: Offer): number {
  if (offer.discountType === 'percentage')
    return Math.round((price * offer.discountValue) / 100);
  return Math.min(offer.discountValue, price);
}

export function calculatePricing(
  originalPrice: number,
  offer: Offer | null,
  advancePercent: number,
): PricingBreakdown {
  const discountAmount = offer ? calculateDiscount(originalPrice, offer) : 0;
  const finalPrice = originalPrice - discountAmount;
  const advanceAmount = Math.round((finalPrice * advancePercent) / 100);
  const remainingAmount = finalPrice - advanceAmount;
  const discountLabel = offer
    ? offer.discountType === 'percentage'
      ? `${offer.discountValue}% OFF`
      : `₹${offer.discountValue.toLocaleString()} OFF`
    : '';

  return {
    originalPrice,
    discountAmount,
    discountLabel,
    finalPrice,
    advancePercent,
    advanceAmount,
    remainingAmount,
    offer,
  };
}

export function fmt(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}
