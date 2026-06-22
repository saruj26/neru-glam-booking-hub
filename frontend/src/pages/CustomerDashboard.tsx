import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import {
  LayoutDashboard, Calendar, Tag, Award, Sparkles, Leaf, Bell,
  User, LogOut, Clock, CheckCircle, ArrowRight,
  Search, Star, Gift, Menu, X, Phone, Mail, MapPin,
  Edit, Key, Check, Crown, MessageSquare, ChevronRight,
  TrendingUp, CalendarCheck, Home, Settings, Sun, Moon, Package, Image,
  Lightbulb,
} from 'lucide-react';
import type { ServiceData } from '@/components/admin/ServiceForm';
import { getActiveTipsAsync, formatDate, type BeautyTip } from '@/lib/tipsUtils';
import { bookingsApi } from '@/lib/apiService';
import type { StoredBooking } from '@/lib/paymentUtils';

/* ─── Service seed (fallback when admin page not yet visited) ────── */
const SVC_SEED: ServiceData[] = [
  { id: 'birthday-basic',      title: 'Basic Birthday Glam',        description: 'A fresh, youthful look perfect for daytime birthday celebrations.',              category: 'birthday',  price: '₹2,500',  image: 'https://images.unsplash.com/photo-1596704017254-9b80443994d7?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1596704017254-9b80443994d7?auto=format&fit=crop&w=800&q=80'], active: true },
  { id: 'birthday-premium',    title: 'Premium Birthday Glam',      description: 'Elevated makeup with shimmer and glow, perfect for evening parties.',            category: 'birthday',  price: '₹3,500',  image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80'], active: true },
  { id: 'birthday-themed',     title: 'Themed Birthday Makeup',     description: 'Customized makeup to match your birthday theme or costume.',                      category: 'birthday',  price: '₹4,500',  image: 'https://images.unsplash.com/photo-1617220275046-90170ad2815f?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1617220275046-90170ad2815f?auto=format&fit=crop&w=800&q=80'], active: true },
  { id: 'puberty-traditional', title: 'Traditional Ceremony Look',  description: 'Classic makeup style perfect for traditional puberty ceremonies.',                category: 'puberty',   price: '₹4,000',  image: 'https://images.unsplash.com/photo-1487412947147-5cdc1cdc5564?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1487412947147-5cdc1cdc5564?auto=format&fit=crop&w=800&q=80'], active: true },
  { id: 'puberty-modern',      title: 'Modern Ceremony Look',       description: 'Contemporary makeup with traditional elements for a fresh take.',                 category: 'puberty',   price: '₹5,000',  image: 'https://images.unsplash.com/photo-1613324446652-383d8b677c7c?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1613324446652-383d8b677c7c?auto=format&fit=crop&w=800&q=80'], active: true },
  { id: 'reception-minimal',   title: 'Minimal Reception Glam',     description: 'Subtle, elegant makeup perfect for daytime receptions.',                         category: 'reception', price: '₹5,500',  image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=800&q=80'], active: true },
  { id: 'reception-glamour',   title: 'Full Glamour Reception',     description: 'Show-stopping makeup with dramatic eyes and perfect contouring.',                category: 'reception', price: '₹9,000',  image: 'https://images.unsplash.com/photo-1602910344008-22f323cc1817?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1602910344008-22f323cc1817?auto=format&fit=crop&w=800&q=80'], active: true },
  { id: 'wedding-traditional', title: 'Traditional Bridal Makeup',  description: 'Classic bridal look with traditional elements and rich colors.',                category: 'wedding',   price: '₹12,000', image: 'https://images.unsplash.com/photo-1595159901089-7d0b3608515e?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1595159901089-7d0b3608515e?auto=format&fit=crop&w=800&q=80'], active: true },
  { id: 'wedding-luxury',      title: 'Luxury Bridal Package',      description: 'Premium bridal makeup with hair styling, draping assistance, and touch-ups.',   category: 'wedding',   price: '₹18,000', image: 'https://images.unsplash.com/photo-1607779097040-17baf87ddab0?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1607779097040-17baf87ddab0?auto=format&fit=crop&w=800&q=80'], active: true },
  { id: 'festive-makeup',      title: 'Festive Makeup',             description: 'Special makeup for celebrations like Diwali, Eid, Christmas, etc.',              category: 'other',     price: '₹2,000',  image: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=800&q=80'], active: true },
];

/* ─── Types ──────────────────────────────────────────────────────── */
type Status = 'Pending' | 'Confirmed' | 'Upcoming' | 'Completed' | 'Cancelled';
interface Booking {
  id: string; service: string; bookingDate: string; appointmentDate: string;
  time: string; beautician: string | null; status: Status; amount: number;
}
interface AuthUser {
  name: string; email: string; phone: string; address: string;
  memberSince: string; level: string; points: number; pointsForNext: number; nextLevel: string;
}

/* ─── Helpers ────────────────────────────────────────────────────── */
function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

/* ─── Mock Data ──────────────────────────────────────────────────── */
const BOOKINGS: Booking[] = [
  { id: 'NB-2026-001', service: 'Bridal Makeup',          bookingDate: '20 May 2026', appointmentDate: '25 Jun 2026', time: '9:00 AM',  beautician: 'Neru Priya',   status: 'Confirmed', amount: 8500  },
  { id: 'NB-2026-002', service: 'Reception Makeup',        bookingDate: '28 May 2026', appointmentDate: '10 Jul 2026', time: '10:30 AM', beautician: 'Meena Sharma', status: 'Upcoming',  amount: 6500  },
  { id: 'NB-2026-003', service: 'Birthday Party Makeup',   bookingDate: '15 Apr 2026', appointmentDate: '30 Apr 2026', time: '2:00 PM',  beautician: 'Priya Artist', status: 'Completed', amount: 3500  },
  { id: 'NB-2026-004', service: 'Puberty Ceremony Makeup', bookingDate: '01 Jun 2026', appointmentDate: '20 Jul 2026', time: '8:00 AM',  beautician: null,           status: 'Pending',   amount: 4000  },
  { id: 'NB-2025-005', service: 'Wedding Makeup',          bookingDate: '10 Oct 2025', appointmentDate: '15 Nov 2025', time: '7:00 AM',  beautician: 'Neru Priya',   status: 'Completed', amount: 12000 },
  { id: 'NB-2025-006', service: 'Festival Makeup',         bookingDate: '01 Oct 2025', appointmentDate: '20 Oct 2025', time: '11:00 AM', beautician: 'Meena Sharma', status: 'Cancelled', amount: 2500  },
];

const OFFERS = [
  { id: 1, title: 'Bridal Package Special',  pct: 20, desc: 'Complete bridal look — makeup, hair & accessories',       expiry: '31 Jul 2026', tag: 'Bridal',   accent: '#D4A53F' },
  { id: 2, title: 'Birthday Beauty Gift',    pct: 15, desc: 'Celebrate your birthday month with a special treat',       expiry: '30 Jun 2026', tag: 'Birthday', accent: '#8B5CF6' },
  { id: 3, title: 'Festival Season Sale',    pct: 25, desc: 'Look stunning every festival with our seasonal package',   expiry: '15 Aug 2026', tag: 'Festival', accent: '#EC4899' },
  { id: 4, title: 'New Member Welcome',      pct: 10, desc: 'Exclusive first-time discount on any service you choose', expiry: '31 Dec 2026', tag: 'Member',   accent: '#10B981' },
];

const NOTIFS = [
  { id: 1, type: 'confirmation', title: 'Booking Confirmed!',     body: 'Your Bridal Makeup on 25 Jun at 9:00 AM is confirmed with Neru Priya.',    time: '2 hours ago' },
  { id: 2, type: 'reminder',     title: 'Upcoming Appointment',   body: 'Reminder: Reception Makeup on 10 Jul. Please arrive 15 min early.',          time: '1 day ago'   },
  { id: 3, type: 'offer',        title: 'Festival Sale is Live!', body: 'Save 25% on all services this festival season. Valid till 15 Aug.',           time: '3 days ago'  },
  { id: 4, type: 'announcement', title: 'New Artist Joined',      body: 'Celebrity makeup artist Meena Sharma has joined the Neru Beauty team!',      time: '5 days ago'  },
  { id: 5, type: 'points',       title: 'Points Earned!',         body: 'You earned 350 loyalty points for Birthday Makeup. Total: 1,250 pts.',        time: '1 week ago'  },
];

const TIPS = [
  { emoji: '💧', cat: 'Hydration',      title: 'Drink More Water',  tip: 'Drink 8+ glasses daily. Hydrated skin looks plump, dewy, and naturally glowing from within.'        },
  { emoji: '🌿', cat: 'Natural Care',   title: 'Aloe Vera Magic',   tip: 'Apply fresh aloe vera gel overnight. It soothes, reduces dark spots, and deeply moisturises.'       },
  { emoji: '✨', cat: 'Makeup',          title: 'Primer First',      tip: 'Always apply primer before foundation. Creates a smooth base and extends makeup wear by hours.'    },
  { emoji: '💆', cat: 'Hair Care',       title: 'Oil Massage',       tip: 'Warm coconut oil twice a week strengthens roots, reduces breakage, and adds a natural shine.'      },
  { emoji: '🌙', cat: 'Night Routine',  title: 'Double Cleanse',    tip: 'Oil cleanser then foaming cleanser — removes all makeup and pollution before your night cream.'     },
  { emoji: '☀️', cat: 'Sun Protection', title: 'SPF Every Day',     tip: 'Apply SPF 30+ even on cloudy days. UV rays cause 80% of all visible skin ageing signs.'            },
];

const RECOMMENDED = [
  { id: 'wedding',   title: 'Wedding Makeup',         desc: 'Full bridal look with HD foundation & airbrush finish',     price: '₹8,500',  badge: 'Popular'  },
  { id: 'reception', title: 'Reception Makeup',        desc: 'Glamorous evening look with expert contouring & glow',      price: '₹6,500',  badge: 'New'      },
  { id: 'birthday',  title: 'Birthday Party Look',     desc: 'Fresh & vibrant party-ready look in under 2 hours',         price: '₹3,500',  badge: ''         },
  { id: 'puberty',   title: 'Puberty Ceremony Makeup', desc: 'Traditional cultural ceremony look with accessory styling', price: '₹4,000',  badge: 'Trending' },
];

/* ─── Badge helpers ──────────────────────────────────────────────── */
const BADGE_CLS: Record<string, string> = {
  Pending:   'bg-amber-50 text-amber-700',
  Confirmed: 'bg-blue-50 text-blue-700',
  Upcoming:  'bg-indigo-50 text-indigo-700',
  Completed: 'bg-emerald-50 text-emerald-700',
  Cancelled: 'bg-red-50 text-red-600',
};
const DOT_CLS: Record<string, string> = {
  Pending: 'bg-amber-400', Confirmed: 'bg-blue-400', Upcoming: 'bg-indigo-400',
  Completed: 'bg-emerald-500', Cancelled: 'bg-red-400',
};
const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${BADGE_CLS[status] ?? BADGE_CLS.Pending}`}>
    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${DOT_CLS[status] ?? DOT_CLS.Pending}`} />
    {status}
  </span>
);

const NOTIF_ICON: Record<string, { icon: typeof CheckCircle; cls: string }> = {
  confirmation: { icon: CheckCircle,   cls: 'bg-emerald-100 text-emerald-600' },
  reminder:     { icon: Clock,         cls: 'bg-amber-100 text-amber-600'     },
  offer:        { icon: Tag,           cls: 'bg-purple-100 text-purple-600'   },
  announcement: { icon: MessageSquare, cls: 'bg-blue-100 text-blue-600'       },
  points:       { icon: Star,          cls: 'bg-pink-100 text-pink-600'       },
};

/* ─── Navigation config ──────────────────────────────────────────── */
const NAV = [
  { id: 'overview',      label: 'Overview',       icon: LayoutDashboard },
  { id: 'bookings',      label: 'My Bookings',    icon: Calendar        },
  { id: 'services',      label: 'Our Services',   icon: Package         },
  { id: 'offers',        label: 'Offers & Deals', icon: Tag             },
  { id: 'loyalty',       label: 'Loyalty Rewards',icon: Award           },
  { id: 'recommended',   label: 'Recommended',    icon: Sparkles        },
  { id: 'tips',          label: 'Beauty Tips',    icon: Leaf            },
  { id: 'notifications', label: 'Notifications',  icon: Bell            },
  { id: 'profile',       label: 'My Profile',     icon: User            },
];

/* ─── Service tab config ─────────────────────────────────────────── */
const SVC_TABS = [
  { key: 'birthday',  label: 'Birthday'         },
  { key: 'puberty',   label: 'Puberty Ceremony' },
  { key: 'reception', label: 'Reception'         },
  { key: 'wedding',   label: 'Wedding'           },
  { key: 'other',     label: 'Other'             },
] as const;

const SIDEBAR_BG = 'linear-gradient(180deg,#2D1B69 0%,#5B21B6 45%,#7C3AED 80%,#8B5CF6 100%)';

/* ─── Desktop Sidebar Nav ────────────────────────────────────────── */
function SidebarNav({
  active, onNav, user, onSignOut, unread,
}: {
  active: string;
  onNav: (id: string) => void;
  user: { name: string; initials: string; level: string };
  onSignOut: () => void;
  unread: number;
}) {
  return (
    <div className="flex flex-col h-full py-6">
      <div className="flex items-center gap-3 px-6 mb-8">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,165,63,0.25)', border: '1.5px solid rgba(212,165,63,0.5)' }}>
          <Sparkles size={16} className="text-amber-300" />
        </div>
        <div className="leading-none">
          <p className="text-white font-bold" style={{ fontFamily: "'Playfair Display',serif" }}>Neru Beauty</p>
          <p className="text-white/40 text-[9px] tracking-[0.2em] uppercase mt-0.5">Customer Portal</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive ? 'text-white shadow-lg' : 'text-white/55 hover:text-white hover:bg-white/10'
              }`}
              style={isActive ? { background: 'rgba(255,255,255,0.18)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' } : {}}
            >
              <Icon size={16} className={isActive ? 'text-amber-300' : 'text-white/40 group-hover:text-white/70'} />
              {label}
              {id === 'notifications' && unread > 0 && (
                <span className="ml-auto w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center">{unread}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-4 mt-4 space-y-3">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)' }}>
            {user.initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user.name}</p>
            <p className="text-white/40 text-[10px] truncate">{user.level} Member</p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all text-xs"
        >
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────────── */
const CustomerDashboard = () => {
  const navigate = useNavigate();

  /* ── Auth guard ── */
  useEffect(() => {
    if (!localStorage.getItem('neru-customer-auth')) navigate('/login');
  }, [navigate]);

  /* ── Current user from localStorage ── */
  const currentUser: AuthUser = useMemo(() => {
    try {
      const raw = localStorage.getItem('neru-customer-auth');
      if (raw) return JSON.parse(raw) as AuthUser;
    } catch {}
    return { name: 'Guest', email: '', phone: '', address: '', memberSince: 'Recently', level: 'Silver', points: 0, pointsForNext: 500, nextLevel: 'Gold' };
  }, []);
  const userInitials = getInitials(currentUser.name);
  const firstName    = currentUser.name.split(' ')[0];

  const handleSignOut = () => {
    localStorage.removeItem('neru-customer-auth');
    navigate('/login');
  };

  /* ── UI state ── */
  const [section,         setSection]         = useState('overview');
  const [menuOpen,        setMenuOpen]         = useState(false);
  const [scrolled,        setScrolled]         = useState(false);
  const [showNotifPanel,  setShowNotifPanel]   = useState(false);
  const [showProfileMenu, setShowProfileMenu]  = useState(false);
  const [isDark,          setIsDark]           = useState(() => localStorage.getItem('neru-theme') === 'dark');

  /* ── Bookings state ── */
  const [bSearch, setBSearch] = useState('');
  const [bTab,    setBTab]    = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  /* ── Services state ── */
  const [allServices,  setAllServices] = useState<ServiceData[]>([]);
  const [svcTab,       setSvcTab]      = useState<'birthday' | 'puberty' | 'reception' | 'wedding' | 'other'>('birthday');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('neru-services');
      if (raw) {
        const parsed = JSON.parse(raw) as ServiceData[];
        setAllServices(parsed.length ? parsed : SVC_SEED);
        if (!parsed.length) localStorage.setItem('neru-services', JSON.stringify(SVC_SEED));
      } else {
        localStorage.setItem('neru-services', JSON.stringify(SVC_SEED));
        setAllServices(SVC_SEED);
      }
    } catch {
      setAllServices(SVC_SEED);
    }
  }, []);

  /* ── Tips state ── */
  const [tipsList,    setTipsList]    = useState<BeautyTip[]>([]);
  const [featTips,    setFeatTips]    = useState<BeautyTip[]>([]);

  useEffect(() => {
    getActiveTipsAsync()
      .then(tips => { setTipsList(tips); setFeatTips(tips.filter(t => t.featured).slice(0, 3)); })
      .catch(() => {});
  }, []);

  /* ── Real bookings from backend ── */
  const [realBookings, setRealBookings] = useState<StoredBooking[]>([]);
  useEffect(() => {
    if (currentUser.email) {
      bookingsApi.getByCustomer(currentUser.email).then(setRealBookings).catch(() => {});
    }
  }, [currentUser.email]);

  /* ── Notifications ── */
  const [readIds, setReadIds] = useState<number[]>([3, 4, 5]);

  /* ── Profile edit ── */
  const [editMode,     setEditMode]    = useState(false);
  const [profileForm, setProfileForm]  = useState({
    name: currentUser.name, email: currentUser.email,
    phone: currentUser.phone, address: currentUser.address,
  });

  /* ── Refs ── */
  const mainRef          = useRef<HTMLElement>(null);
  const desktopNotifRef  = useRef<HTMLDivElement>(null);
  const desktopProfileRef = useRef<HTMLDivElement>(null);

  /* ── Scroll effect ── */
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 20);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Dark mode persistence ── */
  useEffect(() => {
    localStorage.setItem('neru-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  /* ── Desktop click-outside ── */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (desktopNotifRef.current  && !desktopNotifRef.current.contains(e.target as Node))  setShowNotifPanel(false);
      if (desktopProfileRef.current && !desktopProfileRef.current.contains(e.target as Node)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /* ── Computed ── */
  const unread = NOTIFS.filter(n => !readIds.includes(n.id)).length;

  const filteredBookings = useMemo(() => {
    let b = realBookings;
    if (bTab === 'active')    b = b.filter(x => ['confirmed','pending_payment','partially_paid'].includes(x.status));
    if (bTab === 'completed') b = b.filter(x => x.status === 'completed');
    if (bTab === 'cancelled') b = b.filter(x => x.status === 'cancelled');
    if (bSearch) b = b.filter(x =>
      x.service.name.toLowerCase().includes(bSearch.toLowerCase()) ||
      (x.id ?? '').toLowerCase().includes(bSearch.toLowerCase()) ||
      x.bookingId.toLowerCase().includes(bSearch.toLowerCase())
    );
    return b;
  }, [bSearch, bTab, realBookings]);

  const activeBookings = realBookings.filter(b => ['confirmed','pending_payment','partially_paid'].includes(b.status));
  const completedCount = realBookings.filter(b => b.status === 'completed').length;

  const nav = (id: string) => { setSection(id); setMenuOpen(false); };

  /* ── Shared notification panel content ─────────────────────────── */
  const renderNotifPanelContent = () => (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3 pt-1">
        <p className="font-bold text-neru-darkGray text-sm">Notifications</p>
        <div className="flex items-center gap-3">
          {unread > 0 && (
            <button onClick={() => setReadIds(NOTIFS.map(n => n.id))} className="text-[11px] font-semibold text-neru-purple hover:underline">
              Mark all read
            </button>
          )}
          <button onClick={() => setShowNotifPanel(false)} className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors">
            <X size={15} />
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {NOTIFS.map(n => {
          const isRead = readIds.includes(n.id);
          const cfg    = NOTIF_ICON[n.type] ?? NOTIF_ICON.announcement;
          const Icon   = cfg.icon;
          return (
            <div
              key={n.id}
              onClick={() => { setReadIds(p => p.includes(n.id) ? p : [...p, n.id]); setShowNotifPanel(false); nav('notifications'); }}
              className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-all ${isRead ? 'bg-gray-50 hover:bg-gray-100' : 'bg-purple-50/60 border border-neru-purple/10 hover:bg-purple-50'}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.cls}`}><Icon size={13} /></div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold ${isRead ? 'text-gray-600' : 'text-neru-darkGray'}`}>{n.title}</p>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
                <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><Clock size={9} />{n.time}</p>
              </div>
              {!isRead && <span className="w-2 h-2 rounded-full bg-neru-purple flex-shrink-0 mt-1" />}
            </div>
          );
        })}
      </div>
      <button
        onClick={() => { setShowNotifPanel(false); nav('notifications'); }}
        className="w-full mt-3 py-2.5 rounded-xl text-xs font-semibold text-neru-purple bg-neru-purple/8 hover:bg-neru-purple/15 transition-colors flex items-center justify-center gap-1.5"
      >
        View All Notifications <ChevronRight size={12} />
      </button>
    </div>
  );

  /* ── Shared profile dropdown content ───────────────────────────── */
  const renderProfileDropdownContent = () => (
    <div className="py-2">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)' }}>
            {userInitials}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-neru-darkGray truncate">{currentUser.name}</p>
            <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
          </div>
        </div>
        <div className="flex gap-1.5 mt-2.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-amber-700 bg-amber-50 flex items-center gap-1"><Crown size={9} />{currentUser.level}</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-purple-700 bg-purple-50">{currentUser.points.toLocaleString()} pts</span>
        </div>
      </div>
      {([
        { icon: User,         label: 'My Profile',      action: () => { nav('profile');       setShowProfileMenu(false); } },
        { icon: Calendar,     label: 'My Bookings',     action: () => { nav('bookings');      setShowProfileMenu(false); } },
        { icon: Award,        label: 'Loyalty Rewards', action: () => { nav('loyalty');       setShowProfileMenu(false); } },
        { icon: Bell,         label: 'Notifications',   action: () => { nav('notifications'); setShowProfileMenu(false); } },
        { icon: Settings,     label: 'Settings',        action: () => { toast({ title: 'Settings', description: 'Coming soon!' }); setShowProfileMenu(false); } },
      ] as const).map(({ icon: Icon, label, action }) => (
        <button key={label} onClick={action}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
        >
          <Icon size={14} className="text-neru-purple" />{label}
        </button>
      ))}
      <div className="border-t border-gray-100 mt-1">
        <button onClick={() => { handleSignOut(); setShowProfileMenu(false); }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════════════════════
     SECTION RENDERERS
  ══════════════════════════════════════════════════════════════════ */

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl p-6 lg:p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#3B0764 0%,#6D28D9 50%,#7C3AED 80%,#B45309 100%)' }}>
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-10" style={{ background: 'radial-gradient(circle,#FCD34D,transparent)' }} />
        <div className="absolute -bottom-16 -left-10 w-56 h-56 rounded-full opacity-10" style={{ background: 'radial-gradient(circle,#F9A8D4,transparent)' }} />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)' }}>{userInitials}</div>
              <div>
                <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">Welcome Back</p>
                <h2 className="text-white font-bold text-xl" style={{ fontFamily: "'Playfair Display',serif" }}>{currentUser.name}</h2>
              </div>
            </div>
            <p className="text-purple-200 text-sm">Ready for your next beauty transformation? ✨</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/booking" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-neru-darkGray hover:opacity-90 transition-all shadow-lg" style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)' }}>
              <Calendar size={14} /> Book Now
            </Link>
            <button onClick={() => nav('services')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-white/15 hover:bg-white/25 transition-all">
              <Package size={14} /> Services
            </button>
            <Link to="/contact" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-white/15 hover:bg-white/25 transition-all">
              <Phone size={14} /> Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings',     value: realBookings.length,   sub: 'All time',            icon: CalendarCheck, grad: 'linear-gradient(135deg,#4C1D95,#7C3AED)' },
          { label: 'Active Bookings',    value: activeBookings.length, sub: 'Pending / Upcoming',  icon: Clock,         grad: 'linear-gradient(135deg,#B45309,#D97706)' },
          { label: 'Completed Services', value: completedCount,        sub: 'Successfully done',   icon: CheckCircle,   grad: 'linear-gradient(135deg,#065F46,#059669)' },
          { label: 'Active Offers',      value: OFFERS.length,         sub: 'Claim before expiry', icon: Gift,          grad: 'linear-gradient(135deg,#BE185D,#EC4899)' },
        ].map(({ label, value, sub, icon: Icon, grad }) => (
          <div key={label} className="rounded-2xl p-3.5 text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200" style={{ background: grad }}>
            <div className="flex items-start justify-between mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/20"><Icon size={15} /></div>
              <TrendingUp size={12} className="opacity-60" />
            </div>
            <p className="text-xl font-extrabold">{value}</p>
            <p className="text-xs font-semibold opacity-90 mt-0.5">{label}</p>
            <p className="text-[10px] opacity-60">{sub}</p>
          </div>
        ))}
      </div>

      {/* Upcoming appointments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-neru-darkGray text-lg" style={{ fontFamily: "'Playfair Display',serif" }}>Upcoming Appointments</h3>
          <button onClick={() => nav('bookings')} className="text-neru-purple text-sm font-medium hover:underline flex items-center gap-1">View all <ChevronRight size={14} /></button>
        </div>
        {activeBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <Calendar size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No upcoming appointments. <button onClick={() => nav('bookings')} className="text-neru-purple font-medium hover:underline">Book one now!</button></p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {activeBookings.slice(0, 2).map(b => (
              <div key={b.id ?? b.bookingId} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-neru-darkGray text-sm">{b.service.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">#{b.bookingId}</p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
                <div className="space-y-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-2"><Calendar size={12} className="text-neru-purple" />{b.date} · {b.time}</div>
                  <div className="flex items-center gap-2"><Tag size={12} className="text-neru-purple" />₹{b.pricing.finalPrice.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent bookings table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-neru-darkGray text-lg" style={{ fontFamily: "'Playfair Display',serif" }}>Recent Bookings</h3>
          <button onClick={() => nav('bookings')} className="text-neru-purple text-sm font-medium hover:underline flex items-center gap-1">Full history <ChevronRight size={14} /></button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Service</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Amount</th>
                </tr>
              </thead>
              <tbody>
                {realBookings.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400 text-sm">No bookings yet. <Link to="/booking" className="text-neru-purple font-semibold hover:underline">Book your first appointment →</Link></td></tr>
                ) : realBookings.slice(0, 4).map((b, i) => (
                  <tr key={b.id ?? b.bookingId} className={`hover:bg-gray-50 transition-colors ${i < 3 ? 'border-b border-gray-50' : ''}`}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-neru-darkGray text-xs">{b.service.name}</p>
                      <p className="text-gray-400 text-[10px] mt-0.5">#{b.bookingId}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs hidden sm:table-cell">{b.date}</td>
                    <td className="px-5 py-4"><StatusBadge status={b.status as Status} /></td>
                    <td className="px-5 py-4 text-right text-xs font-semibold text-neru-darkGray hidden md:table-cell">₹{b.pricing.finalPrice.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Loyalty snapshot */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Crown size={18} className="text-amber-500" />
            <span className="font-bold text-neru-darkGray">{currentUser.level} Member</span>
          </div>
          <button onClick={() => nav('loyalty')} className="text-neru-purple text-sm font-medium hover:underline flex items-center gap-1">Details <ChevronRight size={14} /></button>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-2xl font-extrabold text-neru-purple">{currentUser.points.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Loyalty Points</p>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress to {currentUser.nextLevel}</span>
              <span>{currentUser.points}/{currentUser.pointsForNext}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min((currentUser.points / currentUser.pointsForNext) * 100, 100)}%`, background: 'linear-gradient(90deg,#7C3AED,#D4A53F)' }} />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">{currentUser.pointsForNext - currentUser.points} more points to reach {currentUser.nextLevel}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-neru-darkGray" style={{ fontFamily: "'Playfair Display',serif" }}>My Bookings</h2>
        <p className="text-gray-500 text-sm mt-1">Track, manage and review all your beauty appointments</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input value={bSearch} onChange={e => setBSearch(e.target.value)} placeholder="Search by service or booking ID…"
            className="w-full pl-10 pr-4 h-11 rounded-xl border border-gray-200 bg-white text-sm text-neru-darkGray placeholder-gray-400 focus:outline-none focus:border-neru-purple/40 focus:ring-2 focus:ring-neru-purple/10 transition-all" />
        </div>
        <div className="flex gap-1.5 bg-white border border-gray-200 rounded-xl p-1 flex-shrink-0">
          {(['all', 'active', 'completed', 'cancelled'] as const).map(t => (
            <button key={t} onClick={() => setBTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${bTab === t ? 'text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              style={bTab === t ? { background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' } : {}}>
              {t}
            </button>
          ))}
        </div>
      </div>
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
          <Calendar size={36} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No bookings found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map(b => (
            <div key={b.id ?? b.bookingId} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-bold text-neru-darkGray">{b.service.name}</h4>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-gray-400 text-xs mb-3">Booking ID: {b.bookingId}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1.5 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5"><Calendar size={11} className="text-neru-purple" /><span>Booked: {b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN') : ''}</span></div>
                    <div className="flex items-center gap-1.5"><CalendarCheck size={11} className="text-neru-purple" /><span>Appt: {b.date}</span></div>
                    <div className="flex items-center gap-1.5"><Clock size={11} className="text-neru-purple" /><span>{b.time}</span></div>
                    <div className="flex items-center gap-1.5"><User size={11} className="text-neru-purple" /><span>TBA</span></div>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-3 flex-shrink-0">
                  <p className="text-lg font-extrabold text-neru-darkGray">₹{b.pricing.finalPrice.toLocaleString()}</p>
                  <div className="flex gap-2">
                    <button onClick={() => toast({ title: 'Booking Details', description: `${b.service.name} on ${b.date} at ${b.time}. Amount: ₹${b.pricing.finalPrice.toLocaleString()}` })}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neru-purple bg-neru-purple/8 hover:bg-neru-purple/15 transition-colors">
                      View Details
                    </button>
                    {['Confirmed', 'Upcoming', 'Pending'].includes(b.status) && (
                      <button onClick={() => toast({ title: 'Reschedule Request', description: "Your reschedule request has been sent. We'll contact you shortly." })}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors">
                        Reschedule
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderOffers = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-neru-darkGray" style={{ fontFamily: "'Playfair Display',serif" }}>Offers & Promotions</h2>
        <p className="text-gray-500 text-sm mt-1">Exclusive deals crafted just for you</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {OFFERS.map(o => (
          <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden">
            <div className="h-2" style={{ background: `linear-gradient(90deg,${o.accent},${o.accent}88)` }} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-2 text-white" style={{ background: o.accent }}>{o.tag}</span>
                  <h3 className="font-bold text-neru-darkGray">{o.title}</h3>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-extrabold" style={{ color: o.accent }}>{o.pct}%</p>
                  <p className="text-xs text-gray-400 font-semibold -mt-1">OFF</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">{o.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-400"><Clock size={11} />Expires: {o.expiry}</div>
                <Link to="/booking" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-all shadow-sm" style={{ background: `linear-gradient(135deg,${o.accent},${o.accent}cc)` }}>
                  Claim Offer <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLoyalty = () => {
    const pct = Math.round(Math.min((currentUser.points / currentUser.pointsForNext) * 100, 100));
    const levels = [
      { name: 'Silver',   range: '0–500',    perks: ['5% off all services', 'Birthday offer', 'Priority booking'],                            color: '#64748B', active: currentUser.level === 'Silver'   },
      { name: 'Gold',     range: '500–2000', perks: ['10% off all services', 'Monthly surprise gift', 'Dedicated beautician'],                color: '#D4A53F', active: currentUser.level === 'Gold'     },
      { name: 'Platinum', range: '2000+',    perks: ['20% off all services', 'Free consultation', 'VIP lounge access', 'Home service option'], color: '#7C3AED', active: currentUser.level === 'Platinum' },
    ];
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-extrabold text-neru-darkGray" style={{ fontFamily: "'Playfair Display',serif" }}>Loyalty Rewards</h2>
          <p className="text-gray-500 text-sm mt-1">Your beauty journey, beautifully rewarded</p>
        </div>
        <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#3B0764,#6D28D9,#B45309)' }}>
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-10" style={{ background: 'radial-gradient(circle,#FCD34D,transparent)' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(212,165,63,0.25)', border: '1.5px solid rgba(212,165,63,0.5)' }}>
                <Crown size={22} className="text-amber-300" />
              </div>
              <div>
                <p className="text-amber-300 text-xs font-bold uppercase tracking-wider">{currentUser.level} Member</p>
                <p className="text-white font-bold text-lg" style={{ fontFamily: "'Playfair Display',serif" }}>{currentUser.name}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-3xl font-extrabold text-white">{currentUser.points.toLocaleString()}</p>
                <p className="text-white/50 text-xs">Total Points</p>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-white/60 mb-1.5">
                <span>{currentUser.level}</span>
                <span>{pct}% to {currentUser.nextLevel}</span>
                <span>{currentUser.nextLevel}</span>
              </div>
              <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#FCD34D,#F59E0B)' }} />
              </div>
              <p className="text-white/50 text-xs mt-1.5">{currentUser.pointsForNext - currentUser.points} more points to reach {currentUser.nextLevel}</p>
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {levels.map(lv => (
            <div key={lv.name} className={`rounded-2xl p-5 border-2 transition-all ${lv.active ? 'shadow-lg' : 'border-gray-100'}`}
              style={{ borderColor: lv.active ? lv.color : undefined, background: lv.active ? `${lv.color}0A` : (isDark ? '#1a1a2e' : 'white') }}>
              <div className="flex items-center gap-2 mb-3">
                <Crown size={16} style={{ color: lv.color }} />
                <span className="font-bold text-sm" style={{ color: lv.color }}>{lv.name}</span>
                {lv.active && <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: lv.color }}>Current</span>}
              </div>
              <p className="text-xs text-gray-400 mb-3">{lv.range} points</p>
              <ul className="space-y-1.5">
                {lv.perks.map(p => (
                  <li key={p} className="flex items-center gap-2 text-xs text-gray-600">
                    <Check size={11} style={{ color: lv.color }} className="flex-shrink-0" />{p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRecommended = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-neru-darkGray" style={{ fontFamily: "'Playfair Display',serif" }}>Recommended For You</h2>
        <p className="text-gray-500 text-sm mt-1">Handpicked services based on your beauty journey</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {RECOMMENDED.map(r => (
          <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden group">
            <div className="h-32 flex items-center justify-center relative overflow-hidden" style={{ background: isDark ? 'linear-gradient(135deg,#1e1040,#2a1560)' : 'linear-gradient(135deg,#F3E8FF,#FDF4FF)' }}>
              <Sparkles size={40} className="text-neru-purple/20 group-hover:scale-110 transition-transform duration-300" />
              {r.badge && <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>{r.badge}</span>}
            </div>
            <div className="p-5">
              <h3 className="font-bold text-neru-darkGray mb-1">{r.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-3">{r.desc}</p>
              <div className="flex items-center justify-between">
                <p className="font-extrabold text-neru-purple text-lg">{r.price}</p>
                <Link to="/booking" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-all shadow-sm" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
                  Book Now <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTips = () => {
    const CAT_COLORS: Record<string, { bg: string; text: string }> = {
      'Skincare':        { bg: '#EDE9FE', text: '#7C3AED' },
      'Bridal Makeup':   { bg: '#FDF2F8', text: '#BE185D' },
      'Eye Makeup':      { bg: '#EFF6FF', text: '#1D4ED8' },
      'Lip Care':        { bg: '#FFF1F2', text: '#E11D48' },
      'Hair Care':       { bg: '#F0FDF4', text: '#15803D' },
      'Nail Art':        { bg: '#FFF7ED', text: '#C2410C' },
      'Festive Looks':   { bg: '#FFFBEB', text: '#B45309' },
      'General Beauty':  { bg: '#F9F5FF', text: '#9333EA' },
    };
    const cs = (cat: string) => CAT_COLORS[cat] ?? { bg: '#F3F4F6', text: '#374151' };

    const displayList = tipsList.length ? tipsList : [];

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-extrabold text-neru-darkGray" style={{ fontFamily: "'Playfair Display',serif" }}>Beauty Tips</h2>
            <p className="text-gray-500 text-sm mt-1">Expert beauty secrets from our professional artists</p>
          </div>
          <Link to="/beauty-tips"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-neru-purple hover:underline flex-shrink-0">
            View All Tips <ArrowRight size={14} />
          </Link>
        </div>

        {/* Featured highlight — top 3 */}
        {featTips.length > 0 && (
          <div className="grid sm:grid-cols-3 gap-4">
            {featTips.map(tip => {
              const c = cs(tip.category);
              return (
                <Link key={tip.id} to={`/beauty-tips/${tip.id}`}
                  className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col min-h-[220px]">
                  {tip.coverImage
                    ? <img src={tip.coverImage} alt={tip.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    : <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600" />
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="relative z-10 mt-auto p-5">
                    <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full mb-2" style={{ background: c.bg, color: c.text }}>{tip.category}</span>
                    <h3 className="text-white font-extrabold text-sm leading-snug line-clamp-2 mb-1">{tip.title}</h3>
                    <div className="flex items-center gap-2 text-white/60 text-[11px]">
                      <Clock size={10} /> {tip.readTime} min read
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* All tips grid */}
        {displayList.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
            <Lightbulb size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No beauty tips yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayList.map(tip => {
              const c = cs(tip.category);
              return (
                <Link key={tip.id} to={`/beauty-tips/${tip.id}`}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col">
                  {/* Cover */}
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 flex-shrink-0">
                    {tip.coverImage
                      ? <img src={tip.coverImage} alt={tip.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      : <div className="w-full h-full flex items-center justify-center"><Lightbulb size={32} className="text-purple-200" /></div>
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.text }}>{tip.category}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-1.5">
                      <Clock size={10} /> {tip.readTime} min read
                      <span>·</span>
                      <span>{formatDate(tip.createdAt)}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-neru-purple transition-colors line-clamp-2 mb-1.5">
                      {tip.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 flex-1">{tip.excerpt}</p>
                    <div className="flex items-center gap-1 mt-3 text-neru-purple text-xs font-bold group-hover:gap-2 transition-all">
                      Read Full Tip <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="rounded-2xl p-6 text-center" style={{ background: 'linear-gradient(135deg,#3B0764,#6D28D9,#8B5CF6)' }}>
          <Sparkles size={22} className="text-amber-300 mx-auto mb-2" />
          <p className="font-bold text-white mb-1">Want more expert tips?</p>
          <p className="text-white/70 text-xs mb-4">Our full library has tips on skincare, bridal, festive looks and more</p>
          <Link to="/beauty-tips"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold hover:-translate-y-0.5 transition-all"
            style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)', color: '#3B0764' }}>
            Browse All Beauty Tips <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    );
  };

  const renderNotifications = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-neru-darkGray" style={{ fontFamily: "'Playfair Display',serif" }}>Notifications</h2>
          <p className="text-gray-500 text-sm mt-1">{unread > 0 ? `${unread} unread messages` : 'All caught up!'}</p>
        </div>
        {unread > 0 && (
          <button onClick={() => setReadIds(NOTIFS.map(n => n.id))} className="text-xs font-semibold text-neru-purple bg-neru-purple/8 px-4 py-2 rounded-xl hover:bg-neru-purple/15 transition-colors">
            Mark all read
          </button>
        )}
      </div>
      <div className="space-y-3">
        {NOTIFS.map(n => {
          const isRead = readIds.includes(n.id);
          const cfg    = NOTIF_ICON[n.type] ?? NOTIF_ICON.announcement;
          const Icon   = cfg.icon;
          return (
            <div key={n.id}
              onClick={() => setReadIds(prev => prev.includes(n.id) ? prev : [...prev, n.id])}
              className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${isRead ? 'bg-white border-gray-100' : 'bg-purple-50/40 border-neru-purple/15 hover:bg-purple-50/60'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.cls}`}><Icon size={16} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-bold ${isRead ? 'text-gray-700' : 'text-neru-darkGray'}`}>{n.title}</p>
                  {!isRead && <span className="w-2 h-2 rounded-full bg-neru-purple flex-shrink-0" />}
                </div>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{n.body}</p>
                <p className="text-gray-400 text-[10px] mt-1.5 flex items-center gap-1"><Clock size={9} />{n.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-neru-darkGray" style={{ fontFamily: "'Playfair Display',serif" }}>My Profile</h2>
        <p className="text-gray-500 text-sm mt-1">Manage your personal information and account settings</p>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg,#6D28D9,#D4A53F)' }}>
            {userInitials}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-extrabold text-xl text-neru-darkGray" style={{ fontFamily: "'Playfair Display',serif" }}>{profileForm.name}</h3>
            <p className="text-gray-500 text-sm">{profileForm.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full text-amber-700 bg-amber-50 flex items-center gap-1"><Crown size={10} />{currentUser.level} Member</span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full text-purple-700 bg-purple-50 flex items-center gap-1"><Star size={10} />{currentUser.points.toLocaleString()} pts</span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full text-gray-600 bg-gray-100">Member since {currentUser.memberSince}</span>
            </div>
          </div>
          <button onClick={() => setEditMode(!editMode)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-neru-purple border border-neru-purple/25 hover:bg-neru-purple hover:text-white transition-all flex-shrink-0">
            <Edit size={14} /> {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h4 className="font-bold text-neru-darkGray mb-5">Personal Information</h4>
        <div className="grid sm:grid-cols-2 gap-4">
          {([
            { label: 'Full Name',     key: 'name',    icon: User,   type: 'text'  },
            { label: 'Email Address', key: 'email',   icon: Mail,   type: 'email' },
            { label: 'Phone Number',  key: 'phone',   icon: Phone,  type: 'tel'   },
            { label: 'Address',       key: 'address', icon: MapPin, type: 'text'  },
          ] as const).map(({ label, key, icon: Icon, type }) => (
            <div key={key} className={key === 'address' ? 'sm:col-span-2' : ''}>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">{label}</label>
              {editMode ? (
                <div className="relative">
                  <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input type={type} value={profileForm[key]}
                    onChange={e => setProfileForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full pl-10 pr-4 h-11 rounded-xl border border-gray-200 bg-white text-sm text-neru-darkGray focus:outline-none focus:border-neru-purple/40 focus:ring-2 focus:ring-neru-purple/10 transition-all" />
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 text-sm text-neru-darkGray">
                  <Icon size={14} className="text-neru-purple flex-shrink-0" />
                  {profileForm[key] || <span className="text-gray-400">Not set</span>}
                </div>
              )}
            </div>
          ))}
        </div>
        {editMode && (
          <div className="flex gap-3 mt-5">
            <button onClick={() => { setEditMode(false); toast({ title: 'Profile Updated', description: 'Your profile has been saved successfully.' }); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
              <Check size={14} /> Save Changes
            </button>
            <button onClick={() => setEditMode(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
          </div>
        )}
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center"><Key size={16} className="text-neru-purple" /></div>
            <div>
              <p className="font-bold text-neru-darkGray text-sm">Password & Security</p>
              <p className="text-gray-400 text-xs">Keep your account safe</p>
            </div>
          </div>
          <button onClick={() => toast({ title: 'Change Password', description: 'Password reset link sent to your email address.' })}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-neru-purple border border-neru-purple/25 hover:bg-neru-purple hover:text-white transition-all">
            Change Password
          </button>
        </div>
      </div>
      <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-red-700 text-sm">Sign Out</p>
            <p className="text-red-400 text-xs">You will be returned to the login page</p>
          </div>
          <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 bg-red-100 hover:bg-red-200 transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  const renderServices = () => {
    const tabServices = allServices.filter(s => s.active && s.category === svcTab);

    return (
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-extrabold text-neru-darkGray" style={{ fontFamily: "'Playfair Display',serif" }}>Our Services</h2>
          <p className="text-gray-500 text-sm mt-1">Browse all beauty services — click any card to see full details and book instantly</p>
        </div>

        {/* Category tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 flex gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {SVC_TABS.map(t => (
            <button key={t.key} onClick={() => setSvcTab(t.key)}
              className="flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={svcTab === t.key
                ? { background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)', color: '#fff', boxShadow: '0 4px 12px rgba(124,58,237,0.25)' }
                : { color: '#6B7280' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        {tabServices.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
            <Package size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No services in this category yet.</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tabServices.map(svc => (
                <div key={svc.id}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-gray-100">
                  {/* Image — same height as public CategoryCard */}
                  <div className="h-56 overflow-hidden relative">
                    {svc.image
                      ? <img src={svc.image} alt={svc.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      : <div className="w-full h-full bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center"><Image size={36} className="text-purple-200" /></div>
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 bg-neru-gold text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                      {svc.price}
                    </span>
                    {(svc.images?.length ?? 0) > 1 && (
                      <span className="absolute top-3 right-3 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Image size={9} /> {svc.images.length}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-neru-darkGray mb-2 group-hover:text-neru-purple transition-colors duration-200">
                      {svc.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{svc.description}</p>
                    <div className="flex items-center gap-3">
                      <Link to={`/service/${svc.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-neru-purple hover:gap-2.5 transition-all duration-200 flex-1">
                        View Details <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                      <Link to={`/booking?category=${svc.category}&serviceType=${encodeURIComponent(svc.title)}&serviceId=${svc.id}`}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 transition-all flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)' }}>
                        Book Now
                      </Link>
                    </div>
                  </div>

                  {/* Bottom accent bar */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-neru-purple to-purple-400 group-hover:w-full transition-all duration-400 rounded-b-2xl" />
                </div>
              ))}
            </div>

            {/* Book CTA */}
            <div className="text-center pt-2">
              <Link to="/booking"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-full shadow-md hover:-translate-y-0.5 transition-all duration-200"
                style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
                Book This Service <ArrowRight size={15} />
              </Link>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderSection = () => {
    switch (section) {
      case 'overview':      return renderOverview();
      case 'bookings':      return renderBookings();
      case 'services':      return renderServices();
      case 'offers':        return renderOffers();
      case 'loyalty':       return renderLoyalty();
      case 'recommended':   return renderRecommended();
      case 'tips':          return renderTips();
      case 'notifications': return renderNotifications();
      case 'profile':       return renderProfile();
      default:              return renderOverview();
    }
  };

  /* ══════════════════════════════════════════════════════════════════
     LAYOUT
  ══════════════════════════════════════════════════════════════════ */
  return (
    <div
      data-theme={isDark ? 'dark' : 'light'}
      className="flex h-screen overflow-hidden"
      style={{ background: isDark ? '#0f0f1a' : '#F8F5FF', fontFamily: 'Inter, sans-serif' }}
    >

      {/* ── Desktop Sidebar ────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 h-full" style={{ background: SIDEBAR_BG }}>
        <SidebarNav
          active={section} onNav={nav}
          user={{ name: currentUser.name, initials: userInitials, level: currentUser.level }}
          onSignOut={handleSignOut} unread={unread}
        />
      </aside>

      {/* ── Mobile overlay ─────────────────────────────────────────── */}
      {menuOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMenuOpen(false)} />}

      {/* ── Mobile drawer ──────────────────────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 z-40 lg:hidden flex flex-col transition-transform duration-300 ease-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: SIDEBAR_BG }}
      >
        <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">
          <X size={16} />
        </button>
        <SidebarNav
          active={section} onNav={nav}
          user={{ name: currentUser.name, initials: userInitials, level: currentUser.level }}
          onSignOut={handleSignOut} unread={unread}
        />
      </aside>

      {/* ── Main column ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* ════════════════════════════════════════════════════════════
            MOBILE HEADER (hidden on desktop)
        ════════════════════════════════════════════════════════════ */}
        <header
          className={`lg:hidden flex-shrink-0 z-20 transition-all duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}
          style={{
            background:           isDark
              ? (scrolled ? 'rgba(15,15,26,0.98)' : 'rgba(15,15,26,0.92)')
              : (scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.90)'),
            backdropFilter:       'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Top row */}
          <div className={`flex items-center gap-2 px-4 transition-all duration-300 ${scrolled ? 'h-12' : 'h-14'}`}>
            {/* Logo + name */}
            <div className={`flex items-center gap-2 flex-1 min-w-0 transition-all duration-300 origin-left ${scrolled ? 'scale-[0.92]' : 'scale-100'}`}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
                <Sparkles size={14} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-neru-darkGray text-sm leading-none" style={{ fontFamily: "'Playfair Display',serif" }}>Neru Beauty</p>
                {!scrolled && <p className="text-[9px] text-gray-400 tracking-widest uppercase mt-0.5">Premium Salon</p>}
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Notification bell */}
              <button
                onClick={() => { setShowNotifPanel(v => !v); setShowProfileMenu(false); }}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <Bell size={16} />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-pink-500 text-white text-[9px] font-bold flex items-center justify-center">{unread}</span>
                )}
              </button>

              {/* Dark mode toggle */}
              <button
                onClick={() => setIsDark(d => !d)}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 transition-colors"
                style={{ color: isDark ? '#FCD34D' : '#6B7280', background: isDark ? 'rgba(253,211,77,0.1)' : undefined }}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* Hamburger (drawer access for full nav) */}
              <button
                onClick={() => setMenuOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <Menu size={16} />
              </button>

              {/* Avatar / profile */}
              <button
                onClick={() => { setShowProfileMenu(v => !v); setShowNotifPanel(false); }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-sm"
                style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)' }}
              >
                {userInitials}
              </button>
            </div>
          </div>

          {/* Personalised greeting (hides when scrolled) */}
          {!scrolled && (
            <div className="flex items-center justify-between px-4 pb-2.5">
              <div>
                <p className="text-sm font-bold text-neru-darkGray leading-tight">
                  Welcome Back, <span style={{ color: '#7C3AED' }}>{firstName}</span> ✨
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">Ready for your next beauty session?</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-amber-700 bg-amber-50 flex items-center gap-1 border border-amber-100">
                  <Crown size={9} /> {currentUser.level}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-purple-700 bg-purple-50 border border-purple-100">
                  {currentUser.points.toLocaleString()} pts
                </span>
              </div>
            </div>
          )}

          {/* Quick action chips */}
          <div className="px-4 pb-3 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {([
              { icon: Calendar,     label: 'Book Now',  action: () => navigate('/booking'), color: '#7C3AED', bg: '#7C3AED12' },
              { icon: CalendarCheck,label: 'Bookings',  action: () => nav('bookings'),      color: '#D4A53F', bg: '#D4A53F12' },
              { icon: Package,      label: 'Services',  action: () => nav('services'),      color: '#7C3AED', bg: '#7C3AED12' },
              { icon: Tag,          label: 'Offers',    action: () => nav('offers'),         color: '#EC4899', bg: '#EC489912' },
              { icon: Phone,        label: 'Contact',   action: () => navigate('/contact'), color: '#10B981', bg: '#10B98112' },
            ] as const).map(({ icon: Icon, label, action, color, bg }) => (
              <button
                key={label}
                onClick={action}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                style={{ background: bg, color }}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>
        </header>

        {/* ════════════════════════════════════════════════════════════
            DESKTOP TOP BAR (hidden on mobile)
        ════════════════════════════════════════════════════════════ */}
        <header
          className="hidden lg:flex flex-shrink-0 items-center gap-3 px-6 h-16 backdrop-blur-sm border-b shadow-sm"
          style={{
            background:   isDark ? 'rgba(15,15,26,0.95)' : 'rgba(255,255,255,0.85)',
            borderColor:  isDark ? '#2d2d45' : '#f3f4f6',
          }}
        >
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-neru-darkGray text-base truncate">
              {NAV.find(n => n.id === section)?.label ?? 'Overview'}
            </h1>
            <p className="text-gray-400 text-[10px]">Neru Beauty · Customer Portal</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={() => setIsDark(d => !d)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 transition-all duration-200"
              style={{ color: isDark ? '#FCD34D' : '#6B7280', background: isDark ? 'rgba(253,211,77,0.1)' : undefined }}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Desktop notification */}
            <div className="relative" ref={desktopNotifRef}>
              <button
                onClick={() => { setShowNotifPanel(v => !v); setShowProfileMenu(false); }}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Bell size={16} />
                {unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-pink-500 text-white text-[9px] font-bold flex items-center justify-center">{unread}</span>}
              </button>
              {showNotifPanel && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-[480px] overflow-y-auto">
                  {renderNotifPanelContent()}
                </div>
              )}
            </div>

            <Link to="/booking" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
              <Calendar size={12} /> Book
            </Link>

            {/* Desktop profile */}
            <div className="relative" ref={desktopProfileRef}>
              <button
                onClick={() => { setShowProfileMenu(v => !v); setShowNotifPanel(false); }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)' }}
              >
                {userInitials}
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  {renderProfileDropdownContent()}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Scrollable content ──────────────────────────────────── */}
        <main ref={mainRef} className="flex-1 overflow-y-auto">
          <div className="px-4 lg:px-6 py-6 pb-28 lg:pb-6">
            <div className="animate-fade-in">
              {renderSection()}
            </div>
          </div>
        </main>

        {/* ════════════════════════════════════════════════════════════
            BOTTOM NAVIGATION (mobile only)
        ════════════════════════════════════════════════════════════ */}
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 z-20 border-t shadow-lg"
          style={{
            background:   isDark ? 'rgba(15,15,26,0.97)' : 'rgba(255,255,255,0.97)',
            borderColor:  isDark ? '#2d2d45' : '#f3f4f6',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <div className="flex items-stretch">
            {([
              { id: 'overview',  label: 'Home',     icon: Home     },
              { id: 'bookings',  label: 'Bookings', icon: Calendar },
              { id: 'offers',    label: 'Offers',   icon: Tag      },
              { id: 'loyalty',   label: 'Rewards',  icon: Award    },
              { id: 'profile',   label: 'Profile',  icon: User     },
            ] as const).map(({ id, label, icon: Icon }) => {
              const isActive = section === id;
              return (
                <button
                  key={id}
                  onClick={() => nav(id)}
                  className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 relative transition-all duration-200 active:scale-95"
                >
                  {isActive && (
                    <span
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full"
                      style={{ background: 'linear-gradient(90deg,#7C3AED,#8B5CF6)' }}
                    />
                  )}
                  <Icon
                    size={19}
                    style={isActive ? { color: '#7C3AED' } : { color: isDark ? '#6B7280' : '#9CA3AF' }}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <span className={`text-[10px] font-semibold leading-none ${isActive ? 'text-neru-purple' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>{label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* ════════════════════════════════════════════════════════════
          MOBILE NOTIFICATION BOTTOM SHEET
      ════════════════════════════════════════════════════════════ */}
      {showNotifPanel && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowNotifPanel(false)} />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[82vh] overflow-y-auto"
            style={{ animation: 'slideUp 0.28s cubic-bezier(0.32,0.72,0,1)' }}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3" />
            {renderNotifPanelContent()}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          MOBILE PROFILE MENU BOTTOM SHEET
      ════════════════════════════════════════════════════════════ */}
      {showProfileMenu && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowProfileMenu(false)} />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl overflow-hidden"
            style={{ animation: 'slideUp 0.28s cubic-bezier(0.32,0.72,0,1)' }}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-1" />
            {renderProfileDropdownContent()}
            <div className="h-safe-area pb-5" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
