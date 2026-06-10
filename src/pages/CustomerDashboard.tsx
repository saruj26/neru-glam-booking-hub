import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import {
  LayoutDashboard, Calendar, Tag, Award, Sparkles, Leaf, Bell,
  User, LogOut, Clock, CheckCircle, AlertCircle, ArrowRight,
  Search, Star, Gift, Menu, X, Phone, Mail, MapPin,
  Edit, Key, Check, Crown, Shield, MessageSquare, ChevronRight, Heart,
  TrendingUp, CalendarCheck,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────────── */
type Status = 'Pending' | 'Confirmed' | 'Upcoming' | 'Completed' | 'Cancelled';
interface Booking {
  id: string; service: string; bookingDate: string; appointmentDate: string;
  time: string; beautician: string | null; status: Status; amount: number;
}

/* ─── Mock Data ──────────────────────────────────────────────────── */
const USER = {
  name: 'Kavitha Rajan', initials: 'KR',
  email: 'kavitha@example.com', phone: '+91 98765 43210',
  address: '42 Rose Garden, Chennai – 600001', memberSince: 'January 2023',
  level: 'Gold', points: 1250, pointsForNext: 2000, nextLevel: 'Platinum',
};

const BOOKINGS: Booking[] = [
  { id: 'NB-2026-001', service: 'Bridal Makeup',          bookingDate: '20 May 2026', appointmentDate: '25 Jun 2026', time: '9:00 AM',  beautician: 'Neru Priya',    status: 'Confirmed', amount: 8500  },
  { id: 'NB-2026-002', service: 'Reception Makeup',        bookingDate: '28 May 2026', appointmentDate: '10 Jul 2026', time: '10:30 AM', beautician: 'Meena Sharma',  status: 'Upcoming',  amount: 6500  },
  { id: 'NB-2026-003', service: 'Birthday Party Makeup',   bookingDate: '15 Apr 2026', appointmentDate: '30 Apr 2026', time: '2:00 PM',  beautician: 'Priya Artist',  status: 'Completed', amount: 3500  },
  { id: 'NB-2026-004', service: 'Puberty Ceremony Makeup', bookingDate: '01 Jun 2026', appointmentDate: '20 Jul 2026', time: '8:00 AM',  beautician: null,             status: 'Pending',   amount: 4000  },
  { id: 'NB-2025-005', service: 'Wedding Makeup',          bookingDate: '10 Oct 2025', appointmentDate: '15 Nov 2025', time: '7:00 AM',  beautician: 'Neru Priya',    status: 'Completed', amount: 12000 },
  { id: 'NB-2025-006', service: 'Festival Makeup',         bookingDate: '01 Oct 2025', appointmentDate: '20 Oct 2025', time: '11:00 AM', beautician: 'Meena Sharma',  status: 'Cancelled', amount: 2500  },
];

const OFFERS = [
  { id: 1, title: 'Bridal Package Special',  pct: 20, desc: 'Complete bridal look — makeup, hair & accessories',       expiry: '31 Jul 2026', tag: 'Bridal',   accent: '#D4A53F' },
  { id: 2, title: 'Birthday Beauty Gift',    pct: 15, desc: 'Celebrate your birthday month with a special treat',       expiry: '30 Jun 2026', tag: 'Birthday', accent: '#8B5CF6' },
  { id: 3, title: 'Festival Season Sale',    pct: 25, desc: 'Look stunning every festival with our seasonal package',   expiry: '15 Aug 2026', tag: 'Festival', accent: '#EC4899' },
  { id: 4, title: 'New Member Welcome',      pct: 10, desc: 'Exclusive first-time discount on any service you choose', expiry: '31 Dec 2026', tag: 'Member',   accent: '#10B981' },
];

const NOTIFS = [
  { id: 1, type: 'confirmation', title: 'Booking Confirmed!',    body: 'Your Bridal Makeup on 25 Jun at 9:00 AM is confirmed with Neru Priya.',      time: '2 hours ago' },
  { id: 2, type: 'reminder',     title: 'Upcoming Appointment',  body: 'Reminder: Reception Makeup on 10 Jul. Please arrive 15 min early.',            time: '1 day ago'   },
  { id: 3, type: 'offer',        title: 'Festival Sale is Live!',body: 'Save 25% on all services this festival season. Valid till 15 Aug.',             time: '3 days ago'  },
  { id: 4, type: 'announcement', title: 'New Artist Joined',     body: 'Celebrity makeup artist Meena Sharma has joined the Neru Beauty team!',        time: '5 days ago'  },
  { id: 5, type: 'points',       title: 'Points Earned!',        body: 'You earned 350 loyalty points for Birthday Makeup. Total: 1,250 pts.',          time: '1 week ago'  },
];

const TIPS = [
  { emoji: '💧', cat: 'Hydration',      title: 'Drink More Water',  tip: 'Drink 8+ glasses daily. Hydrated skin looks plump, dewy, and naturally glowing from within.'         },
  { emoji: '🌿', cat: 'Natural Care',   title: 'Aloe Vera Magic',   tip: 'Apply fresh aloe vera gel overnight. It soothes, reduces dark spots, and deeply moisturises.'        },
  { emoji: '✨', cat: 'Makeup',          title: 'Primer First',      tip: 'Always apply primer before foundation. Creates a smooth base and extends makeup wear by hours.'     },
  { emoji: '💆', cat: 'Hair Care',       title: 'Oil Massage',       tip: 'Warm coconut oil twice a week strengthens roots, reduces breakage, and adds a natural shine.'       },
  { emoji: '🌙', cat: 'Night Routine',  title: 'Double Cleanse',    tip: 'Oil cleanser then foaming cleanser — removes all makeup and pollution before your night cream.'      },
  { emoji: '☀️', cat: 'Sun Protection', title: 'SPF Every Day',     tip: 'Apply SPF 30+ even on cloudy days. UV rays cause 80% of all visible skin ageing signs.'             },
];

const RECOMMENDED = [
  { id: 'wedding',   title: 'Wedding Makeup',         desc: 'Full bridal look with HD foundation & airbrush finish',      price: '₹8,500',  badge: 'Popular'  },
  { id: 'reception', title: 'Reception Makeup',        desc: 'Glamorous evening look with expert contouring & glow',       price: '₹6,500',  badge: 'New'      },
  { id: 'birthday',  title: 'Birthday Party Look',     desc: 'Fresh & vibrant party-ready look in under 2 hours',          price: '₹3,500',  badge: ''         },
  { id: 'puberty',   title: 'Puberty Ceremony Makeup', desc: 'Traditional cultural ceremony look with accessory styling',  price: '₹4,000',  badge: 'Trending' },
];

/* ─── Helpers ────────────────────────────────────────────────────── */
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
  confirmation: { icon: CheckCircle,  cls: 'bg-emerald-100 text-emerald-600' },
  reminder:     { icon: Clock,        cls: 'bg-amber-100 text-amber-600'     },
  offer:        { icon: Tag,          cls: 'bg-purple-100 text-purple-600'   },
  announcement: { icon: MessageSquare,cls: 'bg-blue-100 text-blue-600'       },
  points:       { icon: Star,         cls: 'bg-pink-100 text-pink-600'       },
};

const NAV = [
  { id: 'overview',      label: 'Overview',          icon: LayoutDashboard },
  { id: 'bookings',      label: 'My Bookings',        icon: Calendar        },
  { id: 'offers',        label: 'Offers & Deals',     icon: Tag             },
  { id: 'loyalty',       label: 'Loyalty Rewards',    icon: Award           },
  { id: 'recommended',   label: 'Recommended',        icon: Sparkles        },
  { id: 'tips',          label: 'Beauty Tips',        icon: Leaf            },
  { id: 'notifications', label: 'Notifications',      icon: Bell            },
  { id: 'profile',       label: 'My Profile',         icon: User            },
];

/* ─── Sidebar ────────────────────────────────────────────────────── */
const SIDEBAR_BG = 'linear-gradient(180deg,#2D1B69 0%,#5B21B6 45%,#7C3AED 80%,#8B5CF6 100%)';

function SidebarNav({ active, onNav }: { active: string; onNav: (id: string) => void }) {
  return (
    <div className="flex flex-col h-full py-6">
      {/* logo */}
      <div className="flex items-center gap-3 px-6 mb-8">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,165,63,0.25)', border: '1.5px solid rgba(212,165,63,0.5)' }}>
          <Sparkles size={16} className="text-amber-300" />
        </div>
        <div className="leading-none">
          <p className="text-white font-bold" style={{ fontFamily: "'Playfair Display',serif" }}>Neru Beauty</p>
          <p className="text-white/40 text-[9px] tracking-[0.2em] uppercase mt-0.5">Customer Portal</p>
        </div>
      </div>

      {/* nav */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'text-white shadow-lg'
                  : 'text-white/55 hover:text-white hover:bg-white/10'
              }`}
              style={isActive ? { background: 'rgba(255,255,255,0.18)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' } : {}}
            >
              <Icon size={16} className={isActive ? 'text-amber-300' : 'text-white/40 group-hover:text-white/70'} />
              {label}
              {id === 'notifications' && (
                <span className="ml-auto w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center">2</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* profile mini */}
      <div className="px-4 mt-4 space-y-3">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)' }}>
            {USER.initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{USER.name}</p>
            <p className="text-white/40 text-[10px] truncate">{USER.level} Member</p>
          </div>
        </div>
        <Link
          to="/login"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all text-xs"
        >
          <LogOut size={13} /> Sign Out
        </Link>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────────── */
const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);

  /* bookings state */
  const [bSearch, setBSearch] = useState('');
  const [bTab, setBTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  /* notification read state */
  const [readIds, setReadIds] = useState<number[]>([3, 4, 5]);

  /* profile edit */
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: USER.name, email: USER.email, phone: USER.phone, address: USER.address });

  const unread = NOTIFS.filter(n => !readIds.includes(n.id)).length;

  const filteredBookings = useMemo(() => {
    let b = BOOKINGS;
    if (bTab === 'active')    b = b.filter(x => ['Confirmed','Upcoming','Pending'].includes(x.status));
    if (bTab === 'completed') b = b.filter(x => x.status === 'Completed');
    if (bTab === 'cancelled') b = b.filter(x => x.status === 'Cancelled');
    if (bSearch) b = b.filter(x => x.service.toLowerCase().includes(bSearch.toLowerCase()) || x.id.toLowerCase().includes(bSearch.toLowerCase()));
    return b;
  }, [bSearch, bTab]);

  const nav = (id: string) => { setSection(id); setMenuOpen(false); };

  const activeBookings = BOOKINGS.filter(b => ['Confirmed','Upcoming','Pending'].includes(b.status));
  const completedCount = BOOKINGS.filter(b => b.status === 'Completed').length;

  /* ── Overview ─────────────────────────────────────────────────── */
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div
        className="rounded-2xl p-6 lg:p-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#3B0764 0%,#6D28D9 50%,#7C3AED 80%,#B45309 100%)' }}
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-10" style={{ background: 'radial-gradient(circle,#FCD34D,transparent)' }} />
        <div className="absolute -bottom-16 -left-10 w-56 h-56 rounded-full opacity-10" style={{ background: 'radial-gradient(circle,#F9A8D4,transparent)' }} />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)' }}>{USER.initials}</div>
              <div>
                <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">Welcome Back</p>
                <h2 className="text-white font-bold text-xl" style={{ fontFamily: "'Playfair Display',serif" }}>{USER.name}</h2>
              </div>
            </div>
            <p className="text-purple-200 text-sm">Ready for your next beauty transformation? ✨</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/booking" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-neru-darkGray hover:opacity-90 transition-all shadow-lg" style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)' }}>
              <Calendar size={14} /> Book Now
            </Link>
            <Link to="/services" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-white/15 hover:bg-white/25 transition-all">
              <Sparkles size={14} /> Services
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-white/15 hover:bg-white/25 transition-all">
              <Phone size={14} /> Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings',        value: BOOKINGS.length,  sub: 'All time',           icon: CalendarCheck, grad: 'linear-gradient(135deg,#4C1D95,#7C3AED)' },
          { label: 'Active Bookings',        value: activeBookings.length, sub: 'Pending / Upcoming', icon: Clock,    grad: 'linear-gradient(135deg,#B45309,#D97706)' },
          { label: 'Completed Services',    value: completedCount,   sub: 'Successfully done',  icon: CheckCircle,  grad: 'linear-gradient(135deg,#065F46,#059669)'  },
          { label: 'Active Offers',          value: OFFERS.length,   sub: 'Claim before expiry',icon: Gift,         grad: 'linear-gradient(135deg,#BE185D,#EC4899)'  },
        ].map(({ label, value, sub, icon: Icon, grad }) => (
          <div key={label} className="rounded-2xl p-5 text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200" style={{ background: grad }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20"><Icon size={18} /></div>
              <TrendingUp size={14} className="opacity-60 mt-1" />
            </div>
            <p className="text-2xl font-extrabold">{value}</p>
            <p className="text-xs font-semibold opacity-90 mt-0.5">{label}</p>
            <p className="text-[10px] opacity-60 mt-0.5">{sub}</p>
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
              <div key={b.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-neru-darkGray text-sm">{b.service}</p>
                    <p className="text-gray-400 text-xs mt-0.5">#{b.id}</p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
                <div className="space-y-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-2"><Calendar size={12} className="text-neru-purple" />{b.appointmentDate} · {b.time}</div>
                  {b.beautician && <div className="flex items-center gap-2"><User size={12} className="text-neru-purple" />{b.beautician}</div>}
                  <div className="flex items-center gap-2"><Tag size={12} className="text-neru-purple" />₹{b.amount.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent bookings */}
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
                {BOOKINGS.slice(0, 4).map((b, i) => (
                  <tr key={b.id} className={`hover:bg-gray-50 transition-colors ${i < 3 ? 'border-b border-gray-50' : ''}`}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-neru-darkGray text-xs">{b.service}</p>
                      <p className="text-gray-400 text-[10px] mt-0.5">#{b.id}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs hidden sm:table-cell">{b.appointmentDate}</td>
                    <td className="px-5 py-4"><StatusBadge status={b.status} /></td>
                    <td className="px-5 py-4 text-right text-xs font-semibold text-neru-darkGray hidden md:table-cell">₹{b.amount.toLocaleString()}</td>
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
            <span className="font-bold text-neru-darkGray">{USER.level} Member</span>
          </div>
          <button onClick={() => nav('loyalty')} className="text-neru-purple text-sm font-medium hover:underline flex items-center gap-1">Details <ChevronRight size={14} /></button>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-2xl font-extrabold text-neru-purple">{USER.points.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Loyalty Points</p>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress to {USER.nextLevel}</span>
              <span>{USER.points}/{USER.pointsForNext}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(USER.points / USER.pointsForNext) * 100}%`, background: 'linear-gradient(90deg,#7C3AED,#D4A53F)' }} />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">{USER.pointsForNext - USER.points} more points to reach {USER.nextLevel}</p>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Bookings ──────────────────────────────────────────────────── */
  const renderBookings = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-neru-darkGray" style={{ fontFamily: "'Playfair Display',serif" }}>My Bookings</h2>
        <p className="text-gray-500 text-sm mt-1">Track, manage and review all your beauty appointments</p>
      </div>

      {/* search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            value={bSearch}
            onChange={e => setBSearch(e.target.value)}
            placeholder="Search by service or booking ID…"
            className="w-full pl-10 pr-4 h-11 rounded-xl border border-gray-200 bg-white text-sm text-neru-darkGray placeholder-gray-400 focus:outline-none focus:border-neru-purple/40 focus:ring-2 focus:ring-neru-purple/10 transition-all"
          />
        </div>
        <div className="flex gap-1.5 bg-white border border-gray-200 rounded-xl p-1 flex-shrink-0">
          {(['all', 'active', 'completed', 'cancelled'] as const).map(t => (
            <button
              key={t}
              onClick={() => setBTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${bTab === t ? 'text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              style={bTab === t ? { background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' } : {}}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* booking cards */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
          <Calendar size={36} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No bookings found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map(b => (
            <div key={b.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-bold text-neru-darkGray">{b.service}</h4>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-gray-400 text-xs mb-3">Booking ID: {b.id}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1.5 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5"><Calendar size={11} className="text-neru-purple" /><span>Booked: {b.bookingDate}</span></div>
                    <div className="flex items-center gap-1.5"><CalendarCheck size={11} className="text-neru-purple" /><span>Appt: {b.appointmentDate}</span></div>
                    <div className="flex items-center gap-1.5"><Clock size={11} className="text-neru-purple" /><span>{b.time}</span></div>
                    <div className="flex items-center gap-1.5"><User size={11} className="text-neru-purple" /><span>{b.beautician ?? 'TBA'}</span></div>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-3 flex-shrink-0">
                  <p className="text-lg font-extrabold text-neru-darkGray">₹{b.amount.toLocaleString()}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toast({ title: 'Booking Details', description: `${b.service} on ${b.appointmentDate} at ${b.time}. Amount: ₹${b.amount.toLocaleString()}` })}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neru-purple bg-neru-purple/8 hover:bg-neru-purple/15 transition-colors"
                    >
                      View Details
                    </button>
                    {['Confirmed','Upcoming','Pending'].includes(b.status) && (
                      <button
                        onClick={() => toast({ title: 'Reschedule Request', description: 'Your reschedule request has been sent. We\'ll contact you shortly.' })}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors"
                      >
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

  /* ── Offers ────────────────────────────────────────────────────── */
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
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock size={11} />Expires: {o.expiry}
                </div>
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-all shadow-sm"
                  style={{ background: `linear-gradient(135deg,${o.accent},${o.accent}cc)` }}
                >
                  Claim Offer <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ── Loyalty ───────────────────────────────────────────────────── */
  const renderLoyalty = () => {
    const pct = Math.round((USER.points / USER.pointsForNext) * 100);
    const levels = [
      { name: 'Silver',   range: '0–500',   perks: ['5% off all services', 'Birthday offer', 'Priority booking'],                           color: '#64748B', active: false },
      { name: 'Gold',     range: '500–2000',perks: ['10% off all services', 'Monthly surprise gift', 'Dedicated beautician'],               color: '#D4A53F', active: true  },
      { name: 'Platinum', range: '2000+',   perks: ['20% off all services', 'Free consultation', 'VIP lounge access', 'Home service option'],color: '#7C3AED', active: false },
    ];
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-extrabold text-neru-darkGray" style={{ fontFamily: "'Playfair Display',serif" }}>Loyalty Rewards</h2>
          <p className="text-gray-500 text-sm mt-1">Your beauty journey, beautifully rewarded</p>
        </div>

        {/* current level card */}
        <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#3B0764,#6D28D9,#B45309)' }}>
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-10" style={{ background: 'radial-gradient(circle,#FCD34D,transparent)' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(212,165,63,0.25)', border: '1.5px solid rgba(212,165,63,0.5)' }}>
                <Crown size={22} className="text-amber-300" />
              </div>
              <div>
                <p className="text-amber-300 text-xs font-bold uppercase tracking-wider">{USER.level} Member</p>
                <p className="text-white font-bold text-lg" style={{ fontFamily: "'Playfair Display',serif" }}>{USER.name}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-3xl font-extrabold text-white">{USER.points.toLocaleString()}</p>
                <p className="text-white/50 text-xs">Total Points</p>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-white/60 mb-1.5">
                <span>{USER.level}</span>
                <span>{pct}% to {USER.nextLevel}</span>
                <span>{USER.nextLevel}</span>
              </div>
              <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#FCD34D,#F59E0B)' }} />
              </div>
              <p className="text-white/50 text-xs mt-1.5">{USER.pointsForNext - USER.points} more points to reach {USER.nextLevel}</p>
            </div>
          </div>
        </div>

        {/* level cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {levels.map(lv => (
            <div key={lv.name} className={`rounded-2xl p-5 border-2 transition-all ${lv.active ? 'shadow-lg shadow-amber-100' : 'border-gray-100'}`} style={{ borderColor: lv.active ? lv.color : undefined, background: lv.active ? `${lv.color}0A` : 'white' }}>
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

  /* ── Recommended ───────────────────────────────────────────────── */
  const renderRecommended = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-neru-darkGray" style={{ fontFamily: "'Playfair Display',serif" }}>Recommended For You</h2>
        <p className="text-gray-500 text-sm mt-1">Handpicked services based on your beauty journey</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {RECOMMENDED.map(r => (
          <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden group">
            <div className="h-32 flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#F3E8FF,#FDF4FF)' }}>
              <Sparkles size={40} className="text-neru-purple/20 group-hover:scale-110 transition-transform duration-300" />
              {r.badge && (
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>{r.badge}</span>
              )}
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

  /* ── Beauty Tips ───────────────────────────────────────────────── */
  const renderTips = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-neru-darkGray" style={{ fontFamily: "'Playfair Display',serif" }}>Beauty Tips</h2>
        <p className="text-gray-500 text-sm mt-1">Expert beauty secrets from our professional artists</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TIPS.map(t => (
          <div key={t.title} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
            <div className="flex items-start gap-3 mb-3">
              <div className="text-2xl flex-shrink-0 mt-0.5">{t.emoji}</div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neru-purple/70 bg-neru-purple/8 px-2 py-0.5 rounded-full">{t.cat}</span>
                <h3 className="font-bold text-neru-darkGray text-sm mt-1.5">{t.title}</h3>
              </div>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">{t.tip}</p>
            <div className="h-0.5 w-0 bg-gradient-to-r from-neru-purple to-amber-400 group-hover:w-full transition-all duration-400 mt-4 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );

  /* ── Notifications ─────────────────────────────────────────────── */
  const renderNotifications = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-neru-darkGray" style={{ fontFamily: "'Playfair Display',serif" }}>Notifications</h2>
          <p className="text-gray-500 text-sm mt-1">{unread > 0 ? `${unread} unread messages` : 'All caught up!'}</p>
        </div>
        {unread > 0 && (
          <button
            onClick={() => setReadIds(NOTIFS.map(n => n.id))}
            className="text-xs font-semibold text-neru-purple bg-neru-purple/8 px-4 py-2 rounded-xl hover:bg-neru-purple/15 transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>
      <div className="space-y-3">
        {NOTIFS.map(n => {
          const isRead = readIds.includes(n.id);
          const cfg = NOTIF_ICON[n.type] ?? NOTIF_ICON.announcement;
          const Icon = cfg.icon;
          return (
            <div
              key={n.id}
              onClick={() => setReadIds(prev => prev.includes(n.id) ? prev : [...prev, n.id])}
              className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${isRead ? 'bg-white border-gray-100' : 'bg-purple-50/40 border-neru-purple/15 hover:bg-purple-50/60'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.cls}`}>
                <Icon size={16} />
              </div>
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

  /* ── Profile ───────────────────────────────────────────────────── */
  const renderProfile = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-neru-darkGray" style={{ fontFamily: "'Playfair Display',serif" }}>My Profile</h2>
        <p className="text-gray-500 text-sm mt-1">Manage your personal information and account settings</p>
      </div>

      {/* avatar card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg,#6D28D9,#D4A53F)' }}>
            {USER.initials}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-extrabold text-xl text-neru-darkGray" style={{ fontFamily: "'Playfair Display',serif" }}>{profileForm.name}</h3>
            <p className="text-gray-500 text-sm">{profileForm.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full text-amber-700 bg-amber-50 flex items-center gap-1"><Crown size={10} />{USER.level} Member</span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full text-purple-700 bg-purple-50 flex items-center gap-1"><Star size={10} />{USER.points.toLocaleString()} pts</span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full text-gray-600 bg-gray-100">Member since {USER.memberSince}</span>
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-neru-purple border border-neru-purple/25 hover:bg-neru-purple hover:text-white transition-all flex-shrink-0"
          >
            <Edit size={14} /> {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* info / edit form */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h4 className="font-bold text-neru-darkGray mb-5">Personal Information</h4>
        <div className="grid sm:grid-cols-2 gap-4">
          {([
            { label: 'Full Name',     key: 'name',    icon: User,    type: 'text'  },
            { label: 'Email Address', key: 'email',   icon: Mail,    type: 'email' },
            { label: 'Phone Number',  key: 'phone',   icon: Phone,   type: 'tel'   },
            { label: 'Address',       key: 'address', icon: MapPin,  type: 'text'  },
          ] as const).map(({ label, key, icon: Icon, type }) => (
            <div key={key} className={key === 'address' ? 'sm:col-span-2' : ''}>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">{label}</label>
              {editMode ? (
                <div className="relative">
                  <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type={type}
                    value={profileForm[key]}
                    onChange={e => setProfileForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full pl-10 pr-4 h-11 rounded-xl border border-gray-200 bg-white text-sm text-neru-darkGray focus:outline-none focus:border-neru-purple/40 focus:ring-2 focus:ring-neru-purple/10 transition-all"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 text-sm text-neru-darkGray">
                  <Icon size={14} className="text-neru-purple flex-shrink-0" />
                  {profileForm[key]}
                </div>
              )}
            </div>
          ))}
        </div>
        {editMode && (
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => { setEditMode(false); toast({ title: 'Profile Updated', description: 'Your profile information has been saved successfully.' }); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}
            >
              <Check size={14} /> Save Changes
            </button>
            <button onClick={() => setEditMode(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
          </div>
        )}
      </div>

      {/* change password */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center"><Key size={16} className="text-neru-purple" /></div>
            <div>
              <p className="font-bold text-neru-darkGray text-sm">Password & Security</p>
              <p className="text-gray-400 text-xs">Keep your account safe</p>
            </div>
          </div>
          <button
            onClick={() => toast({ title: 'Change Password', description: 'Password reset link sent to your email address.' })}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-neru-purple border border-neru-purple/25 hover:bg-neru-purple hover:text-white transition-all"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* danger zone */}
      <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-red-700 text-sm">Sign Out</p>
            <p className="text-red-400 text-xs">You will be returned to the login page</p>
          </div>
          <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 bg-red-100 hover:bg-red-200 transition-colors">
            <LogOut size={14} /> Sign Out
          </Link>
        </div>
      </div>
    </div>
  );

  /* ── Section router ────────────────────────────────────────────── */
  const renderSection = () => {
    switch (section) {
      case 'overview':      return renderOverview();
      case 'bookings':      return renderBookings();
      case 'offers':        return renderOffers();
      case 'loyalty':       return renderLoyalty();
      case 'recommended':   return renderRecommended();
      case 'tips':          return renderTips();
      case 'notifications': return renderNotifications();
      case 'profile':       return renderProfile();
      default:              return renderOverview();
    }
  };

  /* ── Layout ────────────────────────────────────────────────────── */
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F8F5FF', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Desktop Sidebar ────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 h-full" style={{ background: SIDEBAR_BG }}>
        <SidebarNav active={section} onNav={nav} />
      </aside>

      {/* ── Mobile overlay ─────────────────────────────────────── */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMenuOpen(false)} />
      )}

      {/* ── Mobile drawer ──────────────────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 z-40 lg:hidden flex flex-col transition-transform duration-300 ease-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: SIDEBAR_BG }}
      >
        <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">
          <X size={16} />
        </button>
        <SidebarNav active={section} onNav={nav} />
      </aside>

      {/* ── Main ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex-shrink-0 flex items-center gap-3 px-4 lg:px-6 h-16 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-neru-darkGray capitalize text-sm lg:text-base truncate">
              {NAV.find(n => n.id === section)?.label ?? 'Overview'}
            </h1>
            <p className="text-gray-400 text-[10px] hidden sm:block">Neru Beauty · Customer Portal</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => nav('notifications')}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Bell size={16} />
              {unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-pink-500 text-white text-[9px] font-bold flex items-center justify-center">{unread}</span>}
            </button>
            <Link to="/booking" className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
              <Calendar size={12} /> Book
            </Link>
            <button onClick={() => nav('profile')} className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg,#D4A53F,#F59E0B)' }}>
              {USER.initials}
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6">
            <div className="animate-fade-in">
              {renderSection()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;
