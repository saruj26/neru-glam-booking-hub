using MongoDB.Driver;
using NeruGlamApi.Models;

namespace NeruGlamApi.Services;

/// <summary>
/// Runs once at startup. Creates the NeruGlamDB database and seeds all
/// collections with default data if they are empty.
/// MongoDB creates the actual database on the first write operation.
/// </summary>
public static class DatabaseSeeder
{
    public static async Task SeedAsync(MongoDbService db)
    {
        await SeedPaymentConfigAsync(db);
        await SeedOffersAsync(db);
        await SeedServiceCategoriesAsync(db);
        await SeedGalleryCategoriesAsync(db);
        await SeedGalleryImagesAsync(db);
        await SeedBeforeAfterPairsAsync(db);
        await SeedBeautyTipsAsync(db);

        Console.WriteLine("[NeruGlam] Database seeding complete → NeruGlamDB is ready.");
    }

    /* ── Payment Config ──────────────────────────────────────────────── */
    private static async Task SeedPaymentConfigAsync(MongoDbService db)
    {
        if (await db.PaymentConfigs.CountDocumentsAsync(_ => true) > 0) return;

        await db.PaymentConfigs.InsertOneAsync(new PaymentConfig
        {
            ConfigKey      = "main",
            AdvancePercent = 10,
            OnlineEnabled  = true,
            CashEnabled    = true,
        });
        Console.WriteLine("[Seed] paymentConfig ✓");
    }

    /* ── Offers ──────────────────────────────────────────────────────── */
    private static async Task SeedOffersAsync(MongoDbService db)
    {
        if (await db.Offers.CountDocumentsAsync(_ => true) > 0) return;

        await db.Offers.InsertManyAsync(new[]
        {
            new Offer
            {
                OfferId           = "OFF-001",
                Name              = "Bridal Season Special",
                Description       = "Exclusive 20% off on all wedding and reception packages this season",
                DiscountType      = "percentage",
                DiscountValue     = 20,
                ApplicableServices= new List<string> { "wedding", "reception" },
                StartDate         = "2026-06-01",
                EndDate           = "2026-08-31",
                Active            = true,
                Code              = "BRIDAL20",
            },
            new Offer
            {
                OfferId           = "OFF-002",
                Name              = "Birthday Month Celebration",
                Description       = "₹500 flat off on all birthday makeup packages",
                DiscountType      = "fixed",
                DiscountValue     = 500,
                ApplicableServices= new List<string> { "birthday" },
                StartDate         = "2026-06-01",
                EndDate           = "2026-07-31",
                Active            = true,
                Code              = "BDAY500",
            },
            new Offer
            {
                OfferId           = "OFF-003",
                Name              = "Festival Season Offer",
                Description       = "15% off on all services — festival special!",
                DiscountType      = "percentage",
                DiscountValue     = 15,
                ApplicableServices= new List<string> { "all" },
                StartDate         = "2026-05-01",
                EndDate           = "2026-06-30",
                Active            = false,
            },
        });
        Console.WriteLine("[Seed] offers ✓");
    }

    /* ── Service Categories ──────────────────────────────────────────── */
    private static async Task SeedServiceCategoriesAsync(MongoDbService db)
    {
        if (await db.ServiceCategories.CountDocumentsAsync(_ => true) > 0) return;

        await db.ServiceCategories.InsertManyAsync(new[]
        {
            new ServiceCategory { CategoryId = "cat-1", Name = "Birthday Makeup",        Slug = "birthday",  Description = "Special looks for birthday parties styled to match your personality and theme.",           Thumbnail = "https://images.unsplash.com/photo-1596704017254-9b80443994d7?auto=format&fit=crop&w=800&q=80", Order = 1, Active = true, Featured = true  },
            new ServiceCategory { CategoryId = "cat-2", Name = "Puberty Ceremony",        Slug = "puberty",   Description = "Traditional makeup styles for puberty-related events and cultural ceremonies.",            Thumbnail = "https://images.unsplash.com/photo-1487412947147-5cdc1cdc5564?auto=format&fit=crop&w=800&q=80", Order = 2, Active = true, Featured = false },
            new ServiceCategory { CategoryId = "cat-3", Name = "Reception Makeup",        Slug = "reception", Description = "Elegant and soft glam looks suitable for wedding receptions or evening functions.",        Thumbnail = "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=800&q=80", Order = 3, Active = true, Featured = true  },
            new ServiceCategory { CategoryId = "cat-4", Name = "Wedding / Bridal Makeup", Slug = "wedding",   Description = "Bridal makeup styles, from minimal to traditional full bridal glam.",                     Thumbnail = "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80", Order = 4, Active = true, Featured = true  },
            new ServiceCategory { CategoryId = "cat-5", Name = "Hair Styling",            Slug = "hair",      Description = "Professional hairstyling for all occasions — updos, waves, braids and more.",             Thumbnail = "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80", Order = 5, Active = true, Featured = false },
            new ServiceCategory { CategoryId = "cat-6", Name = "Facial Treatments",       Slug = "facial",    Description = "Skin rejuvenating facials for a clear, glowing complexion before any event.",             Thumbnail = "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80", Order = 6, Active = true, Featured = false },
            new ServiceCategory { CategoryId = "cat-7", Name = "Nail Art",                Slug = "nails",     Description = "Intricate nail art designs, gel manicures and bridal nail packages.",                     Thumbnail = "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80", Order = 7, Active = true, Featured = false },
            new ServiceCategory { CategoryId = "cat-8", Name = "Party / Event Makeup",    Slug = "party",     Description = "Glam looks for parties, festivals and special evening events.",                           Thumbnail = "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80", Order = 8, Active = true, Featured = false },
        });
        Console.WriteLine("[Seed] serviceCategories ✓");
    }

    /* ── Gallery Categories ──────────────────────────────────────────── */
    private static async Task SeedGalleryCategoriesAsync(MongoDbService db)
    {
        if (await db.GalleryCategories.CountDocumentsAsync(_ => true) > 0) return;

        await db.GalleryCategories.InsertManyAsync(new[]
        {
            new GalleryCategory { CategoryId = "gc-1", Name = "Bridal Makeup",           Slug = "bridal",          Active = true, Order = 1 },
            new GalleryCategory { CategoryId = "gc-2", Name = "Reception Makeup",         Slug = "reception",       Active = true, Order = 2 },
            new GalleryCategory { CategoryId = "gc-3", Name = "Party Makeup",             Slug = "party",           Active = true, Order = 3 },
            new GalleryCategory { CategoryId = "gc-4", Name = "Hair Styling",             Slug = "hair",            Active = true, Order = 4 },
            new GalleryCategory { CategoryId = "gc-5", Name = "Nail Art",                 Slug = "nails",           Active = true, Order = 5 },
            new GalleryCategory { CategoryId = "gc-6", Name = "Facial Treatments",        Slug = "facial",          Active = true, Order = 6 },
            new GalleryCategory { CategoryId = "gc-7", Name = "Before & After",           Slug = "before-after",    Active = true, Order = 7 },
            new GalleryCategory { CategoryId = "gc-8", Name = "Customer Transformations", Slug = "transformations", Active = true, Order = 8 },
        });
        Console.WriteLine("[Seed] galleryCategories ✓");
    }

    /* ── Gallery Images ──────────────────────────────────────────────── */
    private static async Task SeedGalleryImagesAsync(MongoDbService db)
    {
        if (await db.GalleryImages.CountDocumentsAsync(_ => true) > 0) return;

        await db.GalleryImages.InsertManyAsync(new[]
        {
            new GalleryImage { ImageId = "gi-1",  Title = "Classic Bridal Elegance",  Description = "Timeless bridal look with soft glam",       ImageUrl = "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80", GalleryCategoryId = "gc-1", Featured = true,  Tag = "featured", Active = true, Order = 1  },
            new GalleryImage { ImageId = "gi-2",  Title = "Traditional Bridal Glow",  Description = "Rich traditional bridal makeup",            ImageUrl = "https://images.unsplash.com/photo-1595159901089-7d0b3608515e?auto=format&fit=crop&w=600&q=80", GalleryCategoryId = "gc-1", Featured = false, Tag = "none",     Active = true, Order = 2  },
            new GalleryImage { ImageId = "gi-3",  Title = "Modern Bridal Radiance",   Description = "Contemporary dewy bridal finish",           ImageUrl = "https://images.unsplash.com/photo-1607779097040-17baf87ddab0?auto=format&fit=crop&w=600&q=80", GalleryCategoryId = "gc-1", Featured = true,  Tag = "trending", Active = true, Order = 3  },
            new GalleryImage { ImageId = "gi-4",  Title = "Soft Reception Glam",      Description = "Elegant soft glam for receptions",          ImageUrl = "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=600&q=80", GalleryCategoryId = "gc-2", Featured = false, Tag = "none",     Active = true, Order = 4  },
            new GalleryImage { ImageId = "gi-5",  Title = "Full Glam Reception",      Description = "Bold and beautiful reception look",         ImageUrl = "https://images.unsplash.com/photo-1602910344008-22f323cc1817?auto=format&fit=crop&w=600&q=80", GalleryCategoryId = "gc-2", Featured = true,  Tag = "popular",  Active = true, Order = 5  },
            new GalleryImage { ImageId = "gi-6",  Title = "Festive Reception",        Description = "Vibrant festive reception makeup",          ImageUrl = "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=600&q=80", GalleryCategoryId = "gc-2", Featured = false, Tag = "none",     Active = true, Order = 6  },
            new GalleryImage { ImageId = "gi-7",  Title = "Birthday Party Glam",      Description = "Fun and glam birthday look",                ImageUrl = "https://images.unsplash.com/photo-1596704017254-9b80443994d7?auto=format&fit=crop&w=600&q=80", GalleryCategoryId = "gc-3", Featured = false, Tag = "none",     Active = true, Order = 7  },
            new GalleryImage { ImageId = "gi-8",  Title = "Evening Shimmer",          Description = "Shimmer and glow for evening events",       ImageUrl = "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80", GalleryCategoryId = "gc-3", Featured = false, Tag = "none",     Active = true, Order = 8  },
            new GalleryImage { ImageId = "gi-9",  Title = "Elegant Bridal Updo",      Description = "Classic bridal updo styling",               ImageUrl = "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80", GalleryCategoryId = "gc-4", Featured = true,  Tag = "popular",  Active = true, Order = 9  },
            new GalleryImage { ImageId = "gi-10", Title = "Flowing Waves",            Description = "Soft romantic waves styling",               ImageUrl = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80", GalleryCategoryId = "gc-4", Featured = false, Tag = "none",     Active = true, Order = 10 },
            new GalleryImage { ImageId = "gi-11", Title = "Radiance Facial",          Description = "Skin rejuvenating facial treatment",        ImageUrl = "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80", GalleryCategoryId = "gc-6", Featured = false, Tag = "none",     Active = true, Order = 11 },
            new GalleryImage { ImageId = "gi-12", Title = "Deep Cleanse Glow",        Description = "Deep cleansing and brightening treatment",  ImageUrl = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80", GalleryCategoryId = "gc-6", Featured = true,  Tag = "featured", Active = true, Order = 12 },
            new GalleryImage { ImageId = "gi-13", Title = "Bridal Nail Art",          Description = "Intricate bridal nail designs",             ImageUrl = "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80", GalleryCategoryId = "gc-5", Featured = false, Tag = "none",     Active = true, Order = 13 },
            new GalleryImage { ImageId = "gi-14", Title = "Bridal Transformation",    Description = "Complete bridal transformation",            ImageUrl = "https://images.unsplash.com/photo-1487412947147-5cdc1cdc5564?auto=format&fit=crop&w=600&q=80", GalleryCategoryId = "gc-7", Featured = true,  Tag = "featured", Active = true, Order = 14 },
        });
        Console.WriteLine("[Seed] galleryImages ✓");
    }

    /* ── Before & After Pairs ────────────────────────────────────────── */
    private static async Task SeedBeforeAfterPairsAsync(MongoDbService db)
    {
        if (await db.BeforeAfterPairs.CountDocumentsAsync(_ => true) > 0) return;

        await db.BeforeAfterPairs.InsertManyAsync(new[]
        {
            new BeforeAfterPair
            {
                PairId      = "ba-1",
                Title       = "Bridal Transformation",
                Description = "From natural to breathtaking bridal glam",
                BeforeImage = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80",
                AfterImage  = "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=500&q=80",
                ServiceType = "Bridal Makeup",
                Active      = true,
                Featured    = true,
            },
            new BeforeAfterPair
            {
                PairId      = "ba-2",
                Title       = "Reception Look",
                Description = "Elegant reception glam perfected",
                BeforeImage = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
                AfterImage  = "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=500&q=80",
                ServiceType = "Reception Makeup",
                Active      = true,
                Featured    = true,
            },
            new BeforeAfterPair
            {
                PairId      = "ba-3",
                Title       = "Birthday Party Glam",
                Description = "Party-ready transformation that wows",
                BeforeImage = "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&q=80",
                AfterImage  = "https://images.unsplash.com/photo-1596704017254-9b80443994d7?auto=format&fit=crop&w=500&q=80",
                ServiceType = "Birthday Makeup",
                Active      = true,
                Featured    = false,
            },
        });
        Console.WriteLine("[Seed] beforeAfterPairs ✓");
    }

    /* ── Beauty Tips ─────────────────────────────────────────────────── */
    private static async Task SeedBeautyTipsAsync(MongoDbService db)
    {
        if (await db.BeautyTips.CountDocumentsAsync(_ => true) > 0) return;

        await db.BeautyTips.InsertManyAsync(new[]
        {
            new BeautyTip
            {
                TipId      = "tip-1",
                Title      = "How to Make Your Bridal Makeup Last All Day",
                Excerpt    = "Discover the professional secrets to keeping your bridal look flawless from the morning ceremony to the last dance of the night.",
                Content    = "Your wedding day is one of the most photographed days of your life.\n\n**1. Start with a Perfect Base** — Apply a silicone-based primer, let it set 5 minutes.\n\n**2. Use Long-Wear Foundation** — Press translucent powder immediately to lock it in.\n\n**3. Bake Your Under-Eyes** — Leave loose powder for 5–10 minutes then dust away.\n\n**4. Waterproof Everything** — Tears of joy are inevitable!\n\n**5. Setting Spray** — 2–3 light mists to finish and after touch-ups.\n\n**6. Blot, Don't Wipe** — Use oil-blotting papers gently.\n\n**Pro Tip:** Do a full trial run at least 2 weeks before the wedding.",
                Category   = "Bridal Makeup",
                CoverImage = "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80",
                Tags       = new List<string> { "Bridal", "Long-Wear", "Setting Spray", "Foundation" },
                Author     = "Neru Beauty Team",
                ReadTime   = 5,
                Featured   = true,
                Active     = true,
                CreatedAt  = DateTime.UtcNow.AddDays(-7),
            },
            new BeautyTip
            {
                TipId      = "tip-2",
                Title      = "5 Skincare Steps You Must Do Before Any Makeup Application",
                Excerpt    = "Great makeup starts with great skin. These five simple prep steps will transform how your makeup looks and how long it stays.",
                Content    = "Makeup is only as good as the skin underneath.\n\n**Step 1 — Cleanse Thoroughly** — Use a gentle sulphate-free cleanser.\n\n**Step 2 — Tone and Balance** — Hydrating toner with hyaluronic acid or rose water.\n\n**Step 3 — Targeted Serum** — Vitamin C or retinol for specific concerns.\n\n**Step 4 — Moisturise Generously** — Even oily skin needs hydration.\n\n**Step 5 — SPF is Non-Negotiable** — SPF 30+ as the last skincare step.\n\n**Bonus Tip:** Wait 5–10 minutes after moisturiser before primer.",
                Category   = "Skincare",
                CoverImage = "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
                Tags       = new List<string> { "Skincare", "Prep", "Moisturiser", "SPF" },
                Author     = "Neru Beauty Team",
                ReadTime   = 4,
                Featured   = true,
                Active     = true,
                CreatedAt  = DateTime.UtcNow.AddDays(-14),
            },
            new BeautyTip
            {
                TipId      = "tip-3",
                Title      = "The Secret to Perfect Smoky Eyes — Step by Step",
                Excerpt    = "Smoky eyes don't have to be intimidating. Follow our professional step-by-step guide to achieve a flawless, blended smoky eye every time.",
                Content    = "The smoky eye is dramatic, sensual, and endlessly versatile.\n\n**Step 1** — Prime the lid with eyeshadow primer.\n\n**Step 2** — Apply medium brown transition shade in the crease.\n\n**Step 3** — Pack deep charcoal onto the outer two-thirds of the lid.\n\n**Step 4** — Blend for at least 2–3 minutes until edges are seamless.\n\n**Step 5** — Line the waterline with black kohl.\n\n**Step 6** — Highlight inner corners with shimmer gold.\n\n**Step 7** — Finish with volumising mascara.\n\n**Remember:** Strong eye = minimal lip.",
                Category   = "Eye Makeup",
                CoverImage = "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80",
                Tags       = new List<string> { "Smoky Eye", "Eye Makeup", "Eyeshadow", "Blending" },
                Author     = "Neru Beauty Team",
                ReadTime   = 6,
                Featured   = false,
                Active     = true,
                CreatedAt  = DateTime.UtcNow.AddDays(-21),
            },
            new BeautyTip
            {
                TipId      = "tip-4",
                Title      = "How to Choose the Right Lipstick Shade for Your Skin Tone",
                Excerpt    = "Finding your perfect lipstick shade can transform your entire look. Learn how to match lip colour to your unique skin tone like a pro.",
                Content    = "**Understanding Undertones** — Warm (yellow/golden), cool (pink/blue), or neutral.\n\n**Fair Skin** — Peachy nudes, coral, baby pink, rosy red.\n\n**Medium Skin** — Terracotta, mauve, fuchsia, brick reds. Most versatile!\n\n**Deep Skin** — Rich chocolate browns, golden nudes, deep plums, wine.\n\n**Pro Tip:** Always apply lip liner before lipstick to prevent feathering and extend wear.",
                Category   = "Lip Care",
                CoverImage = "https://images.unsplash.com/photo-1602910344008-22f323cc1817?auto=format&fit=crop&w=800&q=80",
                Tags       = new List<string> { "Lipstick", "Lip Colour", "Skin Tone", "Makeup Tips" },
                Author     = "Neru Beauty Team",
                ReadTime   = 4,
                Featured   = false,
                Active     = true,
                CreatedAt  = DateTime.UtcNow.AddDays(-28),
            },
            new BeautyTip
            {
                TipId      = "tip-5",
                Title      = "Festive Makeup Guide: Look Your Best for Every Celebration",
                Excerpt    = "From Diwali to Eid to Christmas parties, here is your complete guide to creating stunning festive makeup looks for every celebration.",
                Content    = "Festive seasons call for bolder, more dramatic makeup.\n\n**Diwali** — Bronze eyeshadow, gold eyeliner on waterline, deep wine lip.\n\n**Eid** — Dewy base, rose-gold eye, berry statement lip.\n\n**Christmas** — Classic red lip or glittery silver/green eyeshadow.\n\n**Tips for All Festive Looks:**\n- Highlighter on cheekbones and inner corners.\n- Contour to define your features.\n- Choose long-wear, waterproof formulas.\n- Exfoliate and moisturise lips 30 minutes before colour.",
                Category   = "Festive Looks",
                CoverImage = "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=800&q=80",
                Tags       = new List<string> { "Festive", "Diwali", "Eid", "Party Makeup", "Gold" },
                Author     = "Neru Beauty Team",
                ReadTime   = 5,
                Featured   = true,
                Active     = true,
                CreatedAt  = DateTime.UtcNow.AddDays(-3),
            },
        });
        Console.WriteLine("[Seed] beautyTips ✓");
    }
}
