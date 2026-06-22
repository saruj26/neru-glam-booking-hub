const { MongoClient } = require('mongodb');

const CONNECTION_STRING = 'mongodb+srv://sarujanang_db:Saru2611@cluster0.on172xc.mongodb.net/?appName=Cluster0';
const DB_NAME = 'NeruGlamDB';

async function seed() {
  const client = new MongoClient(CONNECTION_STRING);

  try {
    console.log('\n[NeruGlam] Connecting to MongoDB Atlas...');
    await client.connect();
    const db = client.db(DB_NAME);
    console.log(`[NeruGlam] Connected → database: ${DB_NAME}\n`);

    await seedPaymentConfig(db);
    await seedOffers(db);
    await seedServiceCategories(db);
    await seedGalleryCategories(db);
    await seedGalleryImages(db);
    await seedBeforeAfterPairs(db);
    await seedBeautyTips(db);

    console.log('\n✅ All collections seeded successfully in MongoDB Atlas!');
    console.log('   Open MongoDB Atlas → Cluster0 → NeruGlamDB to verify.\n');
  } finally {
    await client.close();
  }
}

/* ── Payment Config ──────────────────────────────────────────── */
async function seedPaymentConfig(db) {
  const col = db.collection('paymentConfig');
  if (await col.countDocuments() > 0) { console.log('[Skip] paymentConfig already has data'); return; }
  await col.insertOne({ configKey: 'main', advancePercent: 10, onlineEnabled: true, cashEnabled: true, updatedAt: new Date() });
  console.log('[Seed] paymentConfig ✓');
}

/* ── Offers ──────────────────────────────────────────────────── */
async function seedOffers(db) {
  const col = db.collection('offers');
  if (await col.countDocuments() > 0) { console.log('[Skip] offers already has data'); return; }
  await col.insertMany([
    { offerId: 'OFF-001', name: 'Bridal Season Special',       description: 'Exclusive 20% off on all wedding and reception packages this season', discountType: 'percentage', discountValue: 20, applicableServices: ['wedding','reception'], startDate: '2026-06-01', endDate: '2026-08-31', active: true,  code: 'BRIDAL20', createdAt: new Date() },
    { offerId: 'OFF-002', name: 'Birthday Month Celebration',   description: '₹500 flat off on all birthday makeup packages',                        discountType: 'fixed',      discountValue: 500, applicableServices: ['birthday'],             startDate: '2026-06-01', endDate: '2026-07-31', active: true,  code: 'BDAY500',  createdAt: new Date() },
    { offerId: 'OFF-003', name: 'Festival Season Offer',        description: '15% off on all services — festival special!',                           discountType: 'percentage', discountValue: 15,  applicableServices: ['all'],                  startDate: '2026-05-01', endDate: '2026-06-30', active: false, code: null,       createdAt: new Date() },
  ]);
  console.log('[Seed] offers ✓');
}

/* ── Service Categories ──────────────────────────────────────── */
async function seedServiceCategories(db) {
  const col = db.collection('serviceCategories');
  if (await col.countDocuments() > 0) { console.log('[Skip] serviceCategories already has data'); return; }
  await col.insertMany([
    { categoryId: 'cat-1', name: 'Birthday Makeup',        slug: 'birthday',  description: 'Special looks for birthday parties styled to match your personality and theme.',          thumbnail: 'https://images.unsplash.com/photo-1596704017254-9b80443994d7?auto=format&fit=crop&w=800&q=80', banner: '', order: 1, active: true, featured: true,  createdAt: new Date() },
    { categoryId: 'cat-2', name: 'Puberty Ceremony',        slug: 'puberty',   description: 'Traditional makeup styles for puberty-related events and cultural ceremonies.',           thumbnail: 'https://images.unsplash.com/photo-1487412947147-5cdc1cdc5564?auto=format&fit=crop&w=800&q=80', banner: '', order: 2, active: true, featured: false, createdAt: new Date() },
    { categoryId: 'cat-3', name: 'Reception Makeup',        slug: 'reception', description: 'Elegant and soft glam looks suitable for wedding receptions or evening functions.',       thumbnail: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=800&q=80', banner: '', order: 3, active: true, featured: true,  createdAt: new Date() },
    { categoryId: 'cat-4', name: 'Wedding / Bridal Makeup', slug: 'wedding',   description: 'Bridal makeup styles, from minimal to traditional full bridal glam.',                    thumbnail: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80', banner: '', order: 4, active: true, featured: true,  createdAt: new Date() },
    { categoryId: 'cat-5', name: 'Hair Styling',            slug: 'hair',      description: 'Professional hairstyling for all occasions — updos, waves, braids and more.',            thumbnail: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80', banner: '', order: 5, active: true, featured: false, createdAt: new Date() },
    { categoryId: 'cat-6', name: 'Facial Treatments',       slug: 'facial',    description: 'Skin rejuvenating facials for a clear, glowing complexion before any event.',            thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80', banner: '', order: 6, active: true, featured: false, createdAt: new Date() },
    { categoryId: 'cat-7', name: 'Nail Art',                slug: 'nails',     description: 'Intricate nail art designs, gel manicures and bridal nail packages.',                    thumbnail: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80', banner: '', order: 7, active: true, featured: false, createdAt: new Date() },
    { categoryId: 'cat-8', name: 'Party / Event Makeup',    slug: 'party',     description: 'Glam looks for parties, festivals and special evening events.',                          thumbnail: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80', banner: '', order: 8, active: true, featured: false, createdAt: new Date() },
  ]);
  console.log('[Seed] serviceCategories ✓');
}

/* ── Gallery Categories ──────────────────────────────────────── */
async function seedGalleryCategories(db) {
  const col = db.collection('galleryCategories');
  if (await col.countDocuments() > 0) { console.log('[Skip] galleryCategories already has data'); return; }
  await col.insertMany([
    { categoryId: 'gc-1', name: 'Bridal Makeup',           slug: 'bridal',          description: '', coverImage: '', active: true, order: 1 },
    { categoryId: 'gc-2', name: 'Reception Makeup',         slug: 'reception',       description: '', coverImage: '', active: true, order: 2 },
    { categoryId: 'gc-3', name: 'Party Makeup',             slug: 'party',           description: '', coverImage: '', active: true, order: 3 },
    { categoryId: 'gc-4', name: 'Hair Styling',             slug: 'hair',            description: '', coverImage: '', active: true, order: 4 },
    { categoryId: 'gc-5', name: 'Nail Art',                 slug: 'nails',           description: '', coverImage: '', active: true, order: 5 },
    { categoryId: 'gc-6', name: 'Facial Treatments',        slug: 'facial',          description: '', coverImage: '', active: true, order: 6 },
    { categoryId: 'gc-7', name: 'Before & After',           slug: 'before-after',    description: '', coverImage: '', active: true, order: 7 },
    { categoryId: 'gc-8', name: 'Customer Transformations', slug: 'transformations', description: '', coverImage: '', active: true, order: 8 },
  ]);
  console.log('[Seed] galleryCategories ✓');
}

/* ── Gallery Images ──────────────────────────────────────────── */
async function seedGalleryImages(db) {
  const col = db.collection('galleryImages');
  if (await col.countDocuments() > 0) { console.log('[Skip] galleryImages already has data'); return; }
  await col.insertMany([
    { imageId: 'gi-1',  title: 'Classic Bridal Elegance',  description: 'Timeless bridal look with soft glam',       imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-1', featured: true,  tag: 'featured', active: true, order: 1,  createdAt: new Date() },
    { imageId: 'gi-2',  title: 'Traditional Bridal Glow',  description: 'Rich traditional bridal makeup',            imageUrl: 'https://images.unsplash.com/photo-1595159901089-7d0b3608515e?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-1', featured: false, tag: 'none',     active: true, order: 2,  createdAt: new Date() },
    { imageId: 'gi-3',  title: 'Modern Bridal Radiance',   description: 'Contemporary dewy bridal finish',           imageUrl: 'https://images.unsplash.com/photo-1607779097040-17baf87ddab0?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-1', featured: true,  tag: 'trending', active: true, order: 3,  createdAt: new Date() },
    { imageId: 'gi-4',  title: 'Soft Reception Glam',      description: 'Elegant soft glam for receptions',          imageUrl: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-2', featured: false, tag: 'none',     active: true, order: 4,  createdAt: new Date() },
    { imageId: 'gi-5',  title: 'Full Glam Reception',      description: 'Bold and beautiful reception look',         imageUrl: 'https://images.unsplash.com/photo-1602910344008-22f323cc1817?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-2', featured: true,  tag: 'popular',  active: true, order: 5,  createdAt: new Date() },
    { imageId: 'gi-6',  title: 'Festive Reception',        description: 'Vibrant festive reception makeup',          imageUrl: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-2', featured: false, tag: 'none',     active: true, order: 6,  createdAt: new Date() },
    { imageId: 'gi-7',  title: 'Birthday Party Glam',      description: 'Fun and glam birthday look',                imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b80443994d7?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-3', featured: false, tag: 'none',     active: true, order: 7,  createdAt: new Date() },
    { imageId: 'gi-8',  title: 'Evening Shimmer',          description: 'Shimmer and glow for evening events',       imageUrl: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-3', featured: false, tag: 'none',     active: true, order: 8,  createdAt: new Date() },
    { imageId: 'gi-9',  title: 'Elegant Bridal Updo',      description: 'Classic bridal updo styling',               imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-4', featured: true,  tag: 'popular',  active: true, order: 9,  createdAt: new Date() },
    { imageId: 'gi-10', title: 'Flowing Waves',            description: 'Soft romantic waves styling',               imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-4', featured: false, tag: 'none',     active: true, order: 10, createdAt: new Date() },
    { imageId: 'gi-11', title: 'Radiance Facial',          description: 'Skin rejuvenating facial treatment',        imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-6', featured: false, tag: 'none',     active: true, order: 11, createdAt: new Date() },
    { imageId: 'gi-12', title: 'Deep Cleanse Glow',        description: 'Deep cleansing and brightening treatment',  imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-6', featured: true,  tag: 'featured', active: true, order: 12, createdAt: new Date() },
    { imageId: 'gi-13', title: 'Bridal Nail Art',          description: 'Intricate bridal nail designs',             imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-5', featured: false, tag: 'none',     active: true, order: 13, createdAt: new Date() },
    { imageId: 'gi-14', title: 'Bridal Transformation',    description: 'Complete bridal transformation',            imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cdc1cdc5564?auto=format&fit=crop&w=600&q=80', galleryCategoryId: 'gc-7', featured: true,  tag: 'featured', active: true, order: 14, createdAt: new Date() },
  ]);
  console.log('[Seed] galleryImages ✓');
}

/* ── Before & After Pairs ────────────────────────────────────── */
async function seedBeforeAfterPairs(db) {
  const col = db.collection('beforeAfterPairs');
  if (await col.countDocuments() > 0) { console.log('[Skip] beforeAfterPairs already has data'); return; }
  await col.insertMany([
    { pairId: 'ba-1', title: 'Bridal Transformation',  description: 'From natural to breathtaking bridal glam',  beforeImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80', afterImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=500&q=80', serviceType: 'Bridal Makeup',    active: true, featured: true,  createdAt: new Date() },
    { pairId: 'ba-2', title: 'Reception Look',         description: 'Elegant reception glam perfected',          beforeImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80', afterImage: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=500&q=80', serviceType: 'Reception Makeup', active: true, featured: true,  createdAt: new Date() },
    { pairId: 'ba-3', title: 'Birthday Party Glam',    description: 'Party-ready transformation that wows',       beforeImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&q=80', afterImage: 'https://images.unsplash.com/photo-1596704017254-9b80443994d7?auto=format&fit=crop&w=500&q=80', serviceType: 'Birthday Makeup',  active: true, featured: false, createdAt: new Date() },
  ]);
  console.log('[Seed] beforeAfterPairs ✓');
}

/* ── Beauty Tips ─────────────────────────────────────────────── */
async function seedBeautyTips(db) {
  const col = db.collection('beautyTips');
  if (await col.countDocuments() > 0) { console.log('[Skip] beautyTips already has data'); return; }
  await col.insertMany([
    {
      tipId: 'tip-1', title: 'How to Make Your Bridal Makeup Last All Day',
      excerpt: 'Discover the professional secrets to keeping your bridal look flawless from the morning ceremony to the last dance of the night.',
      content: 'Your wedding day is one of the most photographed days of your life.\n\n**1. Start with a Perfect Base** — Apply a silicone-based primer, let it set 5 minutes.\n\n**2. Use Long-Wear Foundation** — Press translucent powder immediately to lock it in.\n\n**3. Bake Your Under-Eyes** — Leave loose powder for 5–10 minutes then dust away.\n\n**4. Waterproof Everything** — Tears of joy are inevitable!\n\n**5. Setting Spray** — 2–3 light mists to finish and after touch-ups.',
      category: 'Bridal Makeup', coverImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
      tags: ['Bridal','Long-Wear','Setting Spray','Foundation'], author: 'Neru Beauty Team', readTime: 5, featured: true, active: true, createdAt: new Date(Date.now() - 7*86400000),
    },
    {
      tipId: 'tip-2', title: '5 Skincare Steps You Must Do Before Any Makeup Application',
      excerpt: 'Great makeup starts with great skin. These five simple prep steps will transform how your makeup looks and how long it stays.',
      content: 'Makeup is only as good as the skin underneath.\n\n**Step 1 — Cleanse Thoroughly** — Use a gentle sulphate-free cleanser.\n\n**Step 2 — Tone and Balance** — Hydrating toner with hyaluronic acid or rose water.\n\n**Step 3 — Targeted Serum** — Vitamin C or retinol for specific concerns.\n\n**Step 4 — Moisturise Generously** — Even oily skin needs hydration.\n\n**Step 5 — SPF is Non-Negotiable** — SPF 30+ as the last skincare step.',
      category: 'Skincare', coverImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      tags: ['Skincare','Prep','Moisturiser','SPF'], author: 'Neru Beauty Team', readTime: 4, featured: true, active: true, createdAt: new Date(Date.now() - 14*86400000),
    },
    {
      tipId: 'tip-3', title: 'The Secret to Perfect Smoky Eyes — Step by Step',
      excerpt: "Smoky eyes don't have to be intimidating. Follow our professional step-by-step guide to achieve a flawless, blended smoky eye every time.",
      content: 'The smoky eye is dramatic, sensual, and endlessly versatile.\n\n**Step 1** — Prime the lid with eyeshadow primer.\n\n**Step 2** — Apply medium brown transition shade in the crease.\n\n**Step 3** — Pack deep charcoal onto the outer two-thirds of the lid.\n\n**Step 4** — Blend for at least 2–3 minutes until edges are seamless.\n\n**Step 5** — Line the waterline with black kohl.\n\n**Step 6** — Highlight inner corners with shimmer gold.',
      category: 'Eye Makeup', coverImage: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80',
      tags: ['Smoky Eye','Eye Makeup','Eyeshadow','Blending'], author: 'Neru Beauty Team', readTime: 6, featured: false, active: true, createdAt: new Date(Date.now() - 21*86400000),
    },
    {
      tipId: 'tip-4', title: 'How to Choose the Right Lipstick Shade for Your Skin Tone',
      excerpt: 'Finding your perfect lipstick shade can transform your entire look. Learn how to match lip colour to your unique skin tone like a pro.',
      content: '**Understanding Undertones** — Warm (yellow/golden), cool (pink/blue), or neutral.\n\n**Fair Skin** — Peachy nudes, coral, baby pink, rosy red.\n\n**Medium Skin** — Terracotta, mauve, fuchsia, brick reds.\n\n**Deep Skin** — Rich chocolate browns, golden nudes, deep plums, wine.\n\n**Pro Tip:** Always apply lip liner before lipstick to prevent feathering.',
      category: 'Lip Care', coverImage: 'https://images.unsplash.com/photo-1602910344008-22f323cc1817?auto=format&fit=crop&w=800&q=80',
      tags: ['Lipstick','Lip Colour','Skin Tone','Makeup Tips'], author: 'Neru Beauty Team', readTime: 4, featured: false, active: true, createdAt: new Date(Date.now() - 28*86400000),
    },
    {
      tipId: 'tip-5', title: 'Festive Makeup Guide: Look Your Best for Every Celebration',
      excerpt: 'From Diwali to Eid to Christmas parties, here is your complete guide to creating stunning festive makeup looks for every celebration.',
      content: 'Festive seasons call for bolder, more dramatic makeup.\n\n**Diwali** — Bronze eyeshadow, gold eyeliner on waterline, deep wine lip.\n\n**Eid** — Dewy base, rose-gold eye, berry statement lip.\n\n**Christmas** — Classic red lip or glittery silver/green eyeshadow.\n\n**Tips:** Use highlighter on cheekbones, contour to define features, choose long-wear waterproof formulas.',
      category: 'Festive Looks', coverImage: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=800&q=80',
      tags: ['Festive','Diwali','Eid','Party Makeup','Gold'], author: 'Neru Beauty Team', readTime: 5, featured: true, active: true, createdAt: new Date(Date.now() - 3*86400000),
    },
  ]);
  console.log('[Seed] beautyTips ✓');
}

seed().catch(err => {
  console.error('\n❌ Seeding failed:', err.message);
  process.exit(1);
});
