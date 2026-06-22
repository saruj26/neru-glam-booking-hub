import { api } from './api';
import type { StoredBooking, Offer, PaymentConfig } from './paymentUtils';
import type { ServiceCategory, GalleryCategory, GalleryImage, BeforeAfterPair } from './galleryUtils';
import type { BeautyTip } from './tipsUtils';

/* ── Auth ──────────────────────────────────────────────────────────────── */
export interface AuthResponse {
  token: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  memberSince: string;
  level: string;
  points: number;
  pointsForNext: number;
  nextLevel: string;
  role: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/api/auth/login', { email, password }),

  register: (name: string, email: string, password: string, phone: string, address: string) =>
    api.post<AuthResponse>('/api/auth/register', { name, email, password, phone, address }),

  adminLogin: (username: string, password: string) =>
    api.post<{ token: string; name: string; role: string }>('/api/auth/admin/login', { username, password }),
};

/* ── Bookings ──────────────────────────────────────────────────────────── */
export const bookingsApi = {
  getAll: () =>
    api.get<StoredBooking[]>('/api/bookings'),

  getByCustomer: (email: string) =>
    api.get<StoredBooking[]>(`/api/bookings/customer/${encodeURIComponent(email)}`),

  create: (booking: Omit<StoredBooking, 'id' | 'createdAt'>) =>
    api.post<StoredBooking>('/api/bookings', booking),

  updateStatus: (bookingId: string, status: string, transactionId?: string) =>
    api.patch<{ message: string }>(`/api/bookings/${bookingId}/status`, { status, transactionId }),

  delete: (bookingId: string) =>
    api.delete<{ message: string }>(`/api/bookings/${bookingId}`),
};

/* ── Offers ────────────────────────────────────────────────────────────── */
export const offersApi = {
  getAll: () =>
    api.get<Offer[]>('/api/offers'),

  getActive: () =>
    api.get<Offer[]>('/api/offers/active'),

  getForCategory: (category: string) =>
    api.get<Offer[]>(`/api/offers/category/${encodeURIComponent(category)}`),

  create: (offer: Offer) =>
    api.post<Offer>('/api/offers', offer),

  update: (offerId: string, offer: Offer) =>
    api.put<Offer>(`/api/offers/${offerId}`, offer),

  bulkUpdate: (offers: Offer[]) =>
    api.put<{ message: string }>('/api/offers/bulk', offers),

  delete: (offerId: string) =>
    api.delete<{ message: string }>(`/api/offers/${offerId}`),
};

/* ── Payment Config ────────────────────────────────────────────────────── */
export const paymentApi = {
  getConfig: () =>
    api.get<PaymentConfig>('/api/payment/config'),

  updateConfig: (config: PaymentConfig) =>
    api.put<PaymentConfig>('/api/payment/config', config),
};

/* ── Service Categories ────────────────────────────────────────────────── */
export const serviceCategoriesApi = {
  getAll: () =>
    api.get<ServiceCategory[]>('/api/service-categories'),

  getActive: () =>
    api.get<ServiceCategory[]>('/api/service-categories/active'),

  create: (cat: ServiceCategory) =>
    api.post<ServiceCategory>('/api/service-categories', cat),

  update: (categoryId: string, cat: ServiceCategory) =>
    api.put<ServiceCategory>(`/api/service-categories/${categoryId}`, cat),

  bulkUpdate: (cats: ServiceCategory[]) =>
    api.put<{ message: string }>('/api/service-categories/bulk', cats),

  delete: (categoryId: string) =>
    api.delete<{ message: string }>(`/api/service-categories/${categoryId}`),
};

/* ── Gallery ───────────────────────────────────────────────────────────── */
export const galleryApi = {
  getCategories: () =>
    api.get<GalleryCategory[]>('/api/gallery/categories'),

  createCategory: (cat: GalleryCategory) =>
    api.post<GalleryCategory>('/api/gallery/categories', cat),

  updateCategory: (categoryId: string, cat: GalleryCategory) =>
    api.put<GalleryCategory>(`/api/gallery/categories/${categoryId}`, cat),

  bulkUpdateCategories: (cats: GalleryCategory[]) =>
    api.put<{ message: string }>('/api/gallery/categories/bulk', cats),

  getImages: (params?: { active?: boolean; featured?: boolean; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.active !== undefined) q.set('active', String(params.active));
    if (params?.featured !== undefined) q.set('featured', String(params.featured));
    if (params?.limit !== undefined) q.set('limit', String(params.limit));
    return api.get<GalleryImage[]>(`/api/gallery/images?${q}`);
  },

  createImage: (img: GalleryImage) =>
    api.post<GalleryImage>('/api/gallery/images', img),

  updateImage: (imageId: string, img: GalleryImage) =>
    api.put<GalleryImage>(`/api/gallery/images/${imageId}`, img),

  deleteImage: (imageId: string) =>
    api.delete<{ message: string }>(`/api/gallery/images/${imageId}`),

  bulkUpdateImages: (images: GalleryImage[]) =>
    api.put<{ message: string }>('/api/gallery/images/bulk', images),

  getBeforeAfter: (active?: boolean) => {
    const q = active !== undefined ? `?active=${active}` : '';
    return api.get<BeforeAfterPair[]>(`/api/gallery/before-after${q}`);
  },

  createBeforeAfter: (pair: BeforeAfterPair) =>
    api.post<BeforeAfterPair>('/api/gallery/before-after', pair),

  updateBeforeAfter: (pairId: string, pair: BeforeAfterPair) =>
    api.put<BeforeAfterPair>(`/api/gallery/before-after/${pairId}`, pair),

  deleteBeforeAfter: (pairId: string) =>
    api.delete<{ message: string }>(`/api/gallery/before-after/${pairId}`),

  bulkUpdateBeforeAfter: (pairs: BeforeAfterPair[]) =>
    api.put<{ message: string }>('/api/gallery/before-after/bulk', pairs),
};

/* ── Beauty Tips ───────────────────────────────────────────────────────── */
export const beautyTipsApi = {
  getAll: () =>
    api.get<BeautyTip[]>('/api/beauty-tips'),

  getActive: () =>
    api.get<BeautyTip[]>('/api/beauty-tips/active'),

  getFeatured: (limit?: number) => {
    const q = limit !== undefined ? `?limit=${limit}` : '';
    return api.get<BeautyTip[]>(`/api/beauty-tips/featured${q}`);
  },

  getById: (tipId: string) =>
    api.get<BeautyTip>(`/api/beauty-tips/${tipId}`),

  create: (tip: BeautyTip) =>
    api.post<BeautyTip>('/api/beauty-tips', tip),

  update: (tipId: string, tip: BeautyTip) =>
    api.put<BeautyTip>(`/api/beauty-tips/${tipId}`, tip),

  delete: (tipId: string) =>
    api.delete<{ message: string }>(`/api/beauty-tips/${tipId}`),

  bulkUpdate: (tips: BeautyTip[]) =>
    api.put<{ message: string }>('/api/beauty-tips/bulk', tips),
};

/* ── Reviews ───────────────────────────────────────────────────────────── */
export interface Review {
  id?: string;
  reviewId?: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  serviceCategory: string;
  bookingId?: string;
  approved: boolean;
  featured: boolean;
  createdAt?: string;
}

export const reviewsApi = {
  getAll: () =>
    api.get<Review[]>('/api/reviews'),

  getApproved: () =>
    api.get<Review[]>('/api/reviews/approved'),

  create: (review: Omit<Review, 'id' | 'reviewId' | 'createdAt'>) =>
    api.post<Review>('/api/reviews', review),

  approve: (reviewId: string) =>
    api.patch<{ message: string }>(`/api/reviews/${reviewId}/approve`, {}),

  delete: (reviewId: string) =>
    api.delete<{ message: string }>(`/api/reviews/${reviewId}`),
};
