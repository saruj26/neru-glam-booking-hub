/* ═══════════════════════════════════════════════════════════════════
   GALLERY & CATEGORY DATA LAYER
   All data stored in localStorage; admin writes, customer reads.
═══════════════════════════════════════════════════════════════════ */

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  banner: string;
  order: number;
  active: boolean;
  featured: boolean;
  createdAt: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  active: boolean;
  order: number;
}

export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  galleryCategoryId: string;
  featured: boolean;
  tag: 'featured' | 'popular' | 'trending' | 'none';
  active: boolean;
  order: number;
  createdAt: string;
}

export interface BeforeAfterPair {
  id: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  serviceType: string;
  active: boolean;
  featured: boolean;
  createdAt: string;
}

/* ── Keys ─────────────────────────────────────────────────────── */
const K = {
  svcCats:    'neru-service-categories',
  galCats:    'neru-gallery-categories',
  galImages:  'neru-gallery-images',
  beforeAfter:'neru-before-after',
} as const;

/* ── Service Category seeds ───────────────────────────────────── */
const DEFAULT_SERVICE_CATS: ServiceCategory[] = [
  { id: 'cat-1', name: 'Birthday Makeup',       slug: 'birthday',  description: 'Special looks for birthday parties styled to match your personality and theme.',            thumbnail: 'https://images.unsplash.com/photo-1596704017254-9b80443994d7?auto=format&fit=crop&w=800&q=80', banner: '', order: 1, active: true, featured: true,  createdAt: new Date().toISOString() },
  { id: 'cat-2', name: 'Puberty Ceremony',       slug: 'puberty',   description: 'Traditional makeup styles for puberty-related events and cultural ceremonies.',             thumbnail: 'https://images.unsplash.com/photo-1487412947147-5cdc1cdc5564?auto=format&fit=crop&w=800&q=80', banner: '', order: 2, active: true, featured: false, createdAt: new Date().toISOString() },
  { id: 'cat-3', name: 'Reception Makeup',       slug: 'reception', description: 'Elegant and soft glam looks suitable for wedding receptions or evening functions.',         thumbnail: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=800&q=80', banner: '', order: 3, active: true, featured: true,  createdAt: new Date().toISOString() },
  { id: 'cat-4', name: 'Wedding / Bridal Makeup',slug: 'wedding',   description: 'Bridal makeup styles, from minimal to traditional full bridal glam.',                      thumbnail: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80', banner: '', order: 4, active: true, featured: true,  createdAt: new Date().toISOString() },
  { id: 'cat-5', name: 'Hair Styling',           slug: 'hair',      description: 'Professional hairstyling for all occasions — updos, waves, braids and more.',              thumbnail: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80', banner: '', order: 5, active: true, featured: false, createdAt: new Date().toISOString() },
  { id: 'cat-6', name: 'Facial Treatments',      slug: 'facial',    description: 'Skin rejuvenating facials for a clear, glowing complexion before any event.',              thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80', banner: '', order: 6, active: true, featured: false, createdAt: new Date().toISOString() },
  { id: 'cat-7', name: 'Nail Art',               slug: 'nails',     description: 'Intricate nail art designs, gel manicures and bridal nail packages.',                      thumbnail: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80', banner: '', order: 7, active: true, featured: false, createdAt: new Date().toISOString() },
  { id: 'cat-8', name: 'Party / Event Makeup',   slug: 'party',     description: 'Glam looks for parties, festivals and special evening events.',                            thumbnail: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80', banner: '', order: 8, active: true, featured: false, createdAt: new Date().toISOString() },
];

/* ── Gallery Category seeds ───────────────────────────────────── */
const DEFAULT_GALLERY_CATS: GalleryCategory[] = [
  { id: 'gc-1', name: 'Bridal Makeup',           slug: 'bridal',       description: '', coverImage: '', active: true, order: 1 },
  { id: 'gc-2', name: 'Reception Makeup',         slug: 'reception',    description: '', coverImage: '', active: true, order: 2 },
  { id: 'gc-3', name: 'Party Makeup',             slug: 'party',        description: '', coverImage: '', active: true, order: 3 },
  { id: 'gc-4', name: 'Hair Styling',             slug: 'hair',         description: '', coverImage: '', active: true, order: 4 },
  { id: 'gc-5', name: 'Nail Art',                 slug: 'nails',        description: '', coverImage: '', active: true, order: 5 },
  { id: 'gc-6', name: 'Facial Treatments',        slug: 'facial',       description: '', coverImage: '', active: true, order: 6 },
  { id: 'gc-7', name: 'Before & After',           slug: 'before-after', description: '', coverImage: '', active: true, order: 7 },
  { id: 'gc-8', name: 'Customer Transformations', slug: 'transformations', description: '', coverImage: '', active: true, order: 8 },
];

/* ── Gallery Image seeds ──────────────────────────────────────── */
const DEFAULT_GALLERY_IMAGES: GalleryImage[] = [
  { id: 'gi-1',  title: 'Classic Bridal Elegance',     description: 'Timeless bridal look with soft glam',         imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-1', featured: true,  tag: 'featured', active: true, order: 1, createdAt: new Date().toISOString() },
  { id: 'gi-2',  title: 'Traditional Bridal Glow',     description: 'Rich traditional bridal makeup',              imageUrl: 'https://images.unsplash.com/photo-1595159901089-7d0b3608515e?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-1', featured: false, tag: 'none',     active: true, order: 2, createdAt: new Date().toISOString() },
  { id: 'gi-3',  title: 'Modern Bridal Radiance',      description: 'Contemporary dewy bridal finish',             imageUrl: 'https://images.unsplash.com/photo-1607779097040-17baf87ddab0?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-1', featured: true,  tag: 'trending', active: true, order: 3, createdAt: new Date().toISOString() },
  { id: 'gi-4',  title: 'Soft Reception Glam',         description: 'Elegant soft glam for receptions',            imageUrl: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-2', featured: false, tag: 'none',     active: true, order: 4, createdAt: new Date().toISOString() },
  { id: 'gi-5',  title: 'Full Glam Reception',         description: 'Bold and beautiful reception look',           imageUrl: 'https://images.unsplash.com/photo-1602910344008-22f323cc1817?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-2', featured: true,  tag: 'popular',  active: true, order: 5, createdAt: new Date().toISOString() },
  { id: 'gi-6',  title: 'Festive Reception',           description: 'Vibrant festive reception makeup',            imageUrl: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-2', featured: false, tag: 'none',     active: true, order: 6, createdAt: new Date().toISOString() },
  { id: 'gi-7',  title: 'Birthday Party Glam',         description: 'Fun and glam birthday look',                  imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b80443994d7?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-3', featured: false, tag: 'none',     active: true, order: 7, createdAt: new Date().toISOString() },
  { id: 'gi-8',  title: 'Evening Shimmer',             description: 'Shimmer and glow for evening events',         imageUrl: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-3', featured: false, tag: 'none',     active: true, order: 8, createdAt: new Date().toISOString() },
  { id: 'gi-9',  title: 'Elegant Bridal Updo',         description: 'Classic bridal updo styling',                 imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-4', featured: true,  tag: 'popular',  active: true, order: 9, createdAt: new Date().toISOString() },
  { id: 'gi-10', title: 'Flowing Waves',               description: 'Soft romantic waves styling',                 imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-4', featured: false, tag: 'none',     active: true, order: 10, createdAt: new Date().toISOString() },
  { id: 'gi-11', title: 'Radiance Facial',             description: 'Skin rejuvenating facial treatment',          imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-6', featured: false, tag: 'none',     active: true, order: 11, createdAt: new Date().toISOString() },
  { id: 'gi-12', title: 'Deep Cleanse Glow',           description: 'Deep cleansing and brightening treatment',    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-6', featured: true,  tag: 'featured', active: true, order: 12, createdAt: new Date().toISOString() },
  { id: 'gi-13', title: 'Bridal Nail Art',             description: 'Intricate bridal nail designs',               imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-5', featured: false, tag: 'none',     active: true, order: 13, createdAt: new Date().toISOString() },
  { id: 'gi-14', title: 'Bridal Transformation',       description: 'Complete bridal transformation',              imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cdc1cdc5564?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-7', featured: true,  tag: 'featured', active: true, order: 14, createdAt: new Date().toISOString() },
];

/* ── Before & After seeds ─────────────────────────────────────── */
const DEFAULT_BEFORE_AFTER: BeforeAfterPair[] = [
  { id: 'ba-1', title: 'Bridal Transformation',   description: 'From natural to breathtaking bridal glam',   beforeImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80', afterImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=500&q=80', serviceType: 'Bridal Makeup',    active: true, featured: true,  createdAt: new Date().toISOString() },
  { id: 'ba-2', title: 'Reception Look',          description: 'Elegant reception glam perfected',           beforeImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80', afterImage: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=500&q=80', serviceType: 'Reception Makeup', active: true, featured: true,  createdAt: new Date().toISOString() },
  { id: 'ba-3', title: 'Birthday Party Glam',     description: 'Party-ready transformation that wows',        beforeImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&q=80', afterImage: 'https://images.unsplash.com/photo-1596704017254-9b80443994d7?auto=format&fit=crop&w=500&q=80', serviceType: 'Birthday Makeup',  active: true, featured: false, createdAt: new Date().toISOString() },
];

/* ═══ CRUD helpers ════════════════════════════════════════════════ */

function read<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) { localStorage.setItem(key, JSON.stringify(seed)); return seed; }
    return JSON.parse(raw) as T[];
  } catch { return seed; }
}
function write<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

/* ── Service Categories ─────────────────────────────────────────── */
export function getServiceCategories(): ServiceCategory[]  { return read(K.svcCats, DEFAULT_SERVICE_CATS); }
export function saveServiceCategories(cats: ServiceCategory[]): void { write(K.svcCats, cats); }
export function getActiveServiceCategories(): ServiceCategory[] {
  return getServiceCategories().filter(c => c.active).sort((a, b) => a.order - b.order);
}

/* ── Gallery Categories ─────────────────────────────────────────── */
export function getGalleryCategories(): GalleryCategory[]  { return read(K.galCats, DEFAULT_GALLERY_CATS); }
export function saveGalleryCategories(cats: GalleryCategory[]): void { write(K.galCats, cats); }
export function getActiveGalleryCategories(): GalleryCategory[] {
  return getGalleryCategories().filter(c => c.active).sort((a, b) => a.order - b.order);
}

/* ── Gallery Images ─────────────────────────────────────────────── */
export function getGalleryImages(): GalleryImage[]  { return read(K.galImages, DEFAULT_GALLERY_IMAGES); }
export function saveGalleryImages(imgs: GalleryImage[]): void { write(K.galImages, imgs); }
export function getActiveGalleryImages(): GalleryImage[] {
  return getGalleryImages().filter(i => i.active).sort((a, b) => a.order - b.order);
}
export function getFeaturedGalleryImages(limit = 6): GalleryImage[] {
  return getActiveGalleryImages().filter(i => i.featured).slice(0, limit);
}

/* ── Before & After ─────────────────────────────────────────────── */
export function getBeforeAfterPairs(): BeforeAfterPair[]  { return read(K.beforeAfter, DEFAULT_BEFORE_AFTER); }
export function saveBeforeAfterPairs(pairs: BeforeAfterPair[]): void { write(K.beforeAfter, pairs); }
export function getActiveBeforeAfterPairs(): BeforeAfterPair[] {
  return getBeforeAfterPairs().filter(p => p.active);
}

/* ── ID generator ───────────────────────────────────────────────── */
export function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
