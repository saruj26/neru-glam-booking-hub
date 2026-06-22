import { beautyTipsApi } from './apiService';

export interface BeautyTip {
  id: string;
  tipId?: string;   // backend route key (e.g. "tip-1")
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  tags: string[];
  author: string;
  readTime: number;
  featured: boolean;
  active: boolean;
  createdAt: string;
}

export const TIP_CATEGORIES = [
  'Skincare', 'Bridal Makeup', 'Eye Makeup', 'Lip Care',
  'Hair Care', 'Nail Art', 'Festive Looks', 'General Beauty',
] as const;

const KEY = 'neru-beauty-tips';

const SEEDS: BeautyTip[] = [
  {
    id: 'tip-1',
    title: 'How to Make Your Bridal Makeup Last All Day',
    excerpt: 'Discover the professional secrets to keeping your bridal look flawless from the morning ceremony to the last dance of the night.',
    content: `Your wedding day is one of the most photographed days of your life — and your makeup needs to keep up. Here are the expert techniques our artists use to ensure every look lasts.\n\n**1. Start with a Perfect Base**\nBegin with a well-moisturised, primed face. Apply a silicone-based primer to fill pores and create a smooth canvas. Allow it to set for 5 minutes before applying foundation.\n\n**2. Use Long-Wear Foundation**\nChoose a full-coverage, long-wear foundation. Set it immediately with a translucent powder using a pressing (not swiping) motion. This locks the foundation in place.\n\n**3. Bake Your Under-Eyes**\nApply a generous amount of loose powder under the eyes and on the T-zone. Leave it for 5–10 minutes, then dust it away. This technique — called "baking" — gives flawless, crease-free coverage.\n\n**4. Waterproof Everything**\nOpt for waterproof mascara, eyeliner, and even eyebrow products. Tears of joy are inevitable — be prepared!\n\n**5. Setting Spray is Your Best Friend**\nFinish your entire look with 2–3 light mists of a professional setting spray. Hold it 25–30 cm from your face and let it dry naturally. Reapply after touch-ups.\n\n**6. Blot, Don't Wipe**\nCarry oil-blotting papers for shine control. Always blot gently — never rub — to avoid disturbing your makeup.\n\n**Pro Tip from Our Artists:** Do a full trial run at least 2 weeks before your wedding day, wearing the makeup for 8+ hours. This helps you identify any problem areas and adjust the formula accordingly.`,
    category: 'Bridal Makeup',
    coverImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    tags: ['Bridal', 'Long-Wear', 'Setting Spray', 'Foundation'],
    author: 'Neru Beauty Team',
    readTime: 5,
    featured: true,
    active: true,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'tip-2',
    title: '5 Skincare Steps You Must Do Before Any Makeup Application',
    excerpt: 'Great makeup starts with great skin. These five simple prep steps will transform how your makeup looks and how long it stays.',
    content: `Makeup is only as good as the skin underneath. Our professional artists always follow these five steps before picking up any brush.\n\n**Step 1 — Cleanse Thoroughly**\nStart with a gentle, sulphate-free cleanser to remove any dirt, oil, or residual product from the previous day. A clean base ensures better makeup adhesion and prevents breakouts.\n\n**Step 2 — Tone and Balance**\nApply a hydrating toner with a cotton pad or your fingertips. Look for ingredients like hyaluronic acid, niacinamide, or rose water. This restores your skin's pH and prepares it to absorb the next steps.\n\n**Step 3 — Targeted Serum**\nIf you have specific concerns — dark spots, fine lines, or dullness — apply a vitamin C or retinol serum. Let it absorb for 2–3 minutes before moving on.\n\n**Step 4 — Moisturise Generously**\nNever skip moisturiser, even if you have oily skin. A well-hydrated face holds makeup far better. For oily skin types, choose a lightweight, oil-free gel moisturiser.\n\n**Step 5 — SPF is Non-Negotiable**\nApply an SPF 30+ sunscreen as the final step of your skincare routine and the first step before your makeup. This protects your skin and creates a smooth, even surface.\n\n**Bonus Tip:** Wait 5–10 minutes after your moisturiser before applying primer. This allows the skincare to fully absorb and prevents your makeup from "sliding."\n\nFollowing this routine consistently will improve your skin over time, making makeup application easier and the results more beautiful.`,
    category: 'Skincare',
    coverImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    tags: ['Skincare', 'Prep', 'Moisturiser', 'SPF'],
    author: 'Neru Beauty Team',
    readTime: 4,
    featured: true,
    active: true,
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: 'tip-3',
    title: 'The Secret to Perfect Smoky Eyes — Step by Step',
    excerpt: "Smoky eyes don't have to be intimidating. Follow our professional step-by-step guide to achieve a flawless, blended smoky eye every time.",
    content: `The smoky eye is one of the most iconic looks in makeup — dramatic, sensual, and endlessly versatile. Here is how our artists create it.\n\n**Tools You Need**\nFlat eyeshadow brush, blending brush, pencil brush, black or dark eyeshadow, transition shade (medium brown), base shade (cream or light beige), kohl pencil or gel liner, mascara.\n\n**Step 1 — Prime the Lid**\nApply an eyeshadow primer or concealer over the entire eyelid.\n\n**Step 2 — Apply the Transition Shade**\nUsing a fluffy blending brush, apply a medium brown shadow in the crease using windshield-wiper motions.\n\n**Step 3 — Pack the Dark Shade**\nUsing a flat brush, press a deep charcoal or black shadow onto the outer two-thirds of the lid.\n\n**Step 4 — Blend, Blend, Blend**\nWith a clean blending brush, soften all harsh edges. Spend at least 2–3 minutes here.\n\n**Step 5 — Line the Waterline**\nApply a creamy black kohl pencil or gel liner to your upper and lower waterline.\n\n**Step 6 — Highlight the Inner Corner**\nDab a shimmery champagne or gold shadow on the inner corners of the eyes.\n\n**Step 7 — Finish with Mascara**\nApply 2–3 coats of volumising mascara.\n\n**Remember:** A strong eye calls for a minimal lip.`,
    category: 'Eye Makeup',
    coverImage: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80',
    tags: ['Smoky Eye', 'Eye Makeup', 'Eyeshadow', 'Blending'],
    author: 'Neru Beauty Team',
    readTime: 6,
    featured: false,
    active: true,
    createdAt: new Date(Date.now() - 21 * 86400000).toISOString(),
  },
  {
    id: 'tip-4',
    title: 'How to Choose the Right Lipstick Shade for Your Skin Tone',
    excerpt: 'Finding your perfect lipstick shade can transform your entire look. Learn how to match lip colour to your unique skin tone like a pro.',
    content: `Lipstick is often the finishing touch that ties an entire look together.\n\n**Understanding Undertones First**\nBefore choosing a shade, identify your skin's undertone — warm (yellow/golden), cool (pink/blue), or neutral.\n\n**For Fair Skin**\n- Warm undertone: Peachy nudes, coral, and warm rose shades.\n- Cool undertone: Baby pink, rosy red, and berry tones.\n\n**For Medium Skin**\n- Warm undertone: Terracotta, burnt sienna, warm reds, and caramel browns.\n- Cool undertone: Mauve, fuchsia, magenta, and cool-toned reds.\n\n**For Deep Skin**\n- Warm undertone: Rich chocolate browns, golden nudes, and warm brick reds.\n- Cool undertone: Deep plums, wine, and classic blue-reds.\n\n**Pro Tip:** Always apply lip liner before lipstick.`,
    category: 'Lip Care',
    coverImage: 'https://images.unsplash.com/photo-1602910344008-22f323cc1817?auto=format&fit=crop&w=800&q=80',
    tags: ['Lipstick', 'Lip Colour', 'Skin Tone', 'Makeup Tips'],
    author: 'Neru Beauty Team',
    readTime: 4,
    featured: false,
    active: true,
    createdAt: new Date(Date.now() - 28 * 86400000).toISOString(),
  },
  {
    id: 'tip-5',
    title: 'Festive Makeup Guide: Look Your Best for Every Celebration',
    excerpt: 'From Diwali to Eid to Christmas parties, here is your complete guide to creating stunning festive makeup looks for every celebration.',
    content: `Festive seasons call for bolder, more dramatic makeup.\n\n**The Festive Colour Palette**\nFestive makeup thrives on rich, jewel-toned colours. Think deep emeralds, sapphires, golds, and burgundies.\n\n**Diwali Inspired Look**\nLean into gold and bronze tones. A warm, shimmery bronze eyeshadow with gold eyeliner on the waterline is breathtaking.\n\n**Eid Celebration Look**\nElegance is key. A soft, dewy base with defined brows, a subtle rose-gold eye, and a statement lip in deep rose or berry.\n\n**Christmas Party Look**\nA classic red lip with a clean eye is timeless. Alternatively, a glittery silver or green eyeshadow.\n\n**Tips for All Festive Looks**\n- Skin must glow: Use a highlighter on the cheekbones.\n- Choose long-wear formulas.\n- Prep your lips: Exfoliate and moisturise before applying colour.`,
    category: 'Festive Looks',
    coverImage: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=800&q=80',
    tags: ['Festive', 'Diwali', 'Eid', 'Party Makeup', 'Gold'],
    author: 'Neru Beauty Team',
    readTime: 5,
    featured: true,
    active: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

/* ═══ Async API helpers (primary) ════════════════════════════════════════ */

export async function getTipsAsync(): Promise<BeautyTip[]> {
  try {
    const tips = await beautyTipsApi.getAll();
    if (tips.length === 0) {
      await beautyTipsApi.bulkUpdate(SEEDS);
      return SEEDS;
    }
    return tips;
  } catch {
    return getTips();
  }
}

export async function getActiveTipsAsync(): Promise<BeautyTip[]> {
  try {
    return await beautyTipsApi.getActive();
  } catch {
    return getActiveTips();
  }
}

export async function getFeaturedTipsAsync(n = 3): Promise<BeautyTip[]> {
  try {
    return await beautyTipsApi.getFeatured(n);
  } catch {
    return getFeaturedTips(n);
  }
}

export async function getTipByIdAsync(id: string): Promise<BeautyTip | null> {
  try {
    return await beautyTipsApi.getById(id);
  } catch {
    return getTipById(id);
  }
}

export async function saveTipsAsync(tips: BeautyTip[]): Promise<void> {
  await beautyTipsApi.bulkUpdate(tips);
}

/* ═══ Synchronous localStorage fallbacks ═════════════════════════════════ */

function read(): BeautyTip[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) { localStorage.setItem(KEY, JSON.stringify(SEEDS)); return SEEDS; }
    return JSON.parse(raw) as BeautyTip[];
  } catch { return SEEDS; }
}
function write(tips: BeautyTip[]): void { localStorage.setItem(KEY, JSON.stringify(tips)); }

export function getTips(): BeautyTip[]            { return read(); }
export function saveTips(tips: BeautyTip[]): void {
  write(tips);
  saveTipsAsync(tips).catch(() => {/* */});
}
export function getActiveTips(): BeautyTip[]      { return read().filter(t => t.active); }
export function getFeaturedTips(n = 3): BeautyTip[] { return getActiveTips().filter(t => t.featured).slice(0, n); }
export function getTipById(id: string): BeautyTip | null {
  return read().find(t => t.id === id) ?? null;
}
export function newTipId(): string { return `tip-${Date.now()}`; }

export function formatDate(iso: string): string {
  try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }); }
  catch { return iso; }
}
