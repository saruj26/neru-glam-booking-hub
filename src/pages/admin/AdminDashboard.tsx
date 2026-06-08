import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  CalendarCheck,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  Sparkles,
  Star,
  ArrowUpRight,
} from 'lucide-react';

const stats = [
  {
    label: 'Total Bookings',
    value: '325',
    sub: '283 completed',
    icon: CalendarCheck,
    trend: '+14%',
    trendUp: true,
    gradient: 'linear-gradient(135deg,#9B1B30,#C0392B)',
    iconBg: 'rgba(255,255,255,0.2)',
  },
  {
    label: 'Pending',
    value: '42',
    sub: 'Awaiting confirmation',
    icon: Clock,
    trend: '-3%',
    trendUp: false,
    gradient: 'linear-gradient(135deg,#D4570A,#F59E0B)',
    iconBg: 'rgba(255,255,255,0.2)',
  },
  {
    label: 'Clients',
    value: '189',
    sub: '+12% this month',
    icon: Users,
    trend: '+12%',
    trendUp: true,
    gradient: 'linear-gradient(135deg,#7B0D1E,#9B1B30)',
    iconBg: 'rgba(255,255,255,0.2)',
  },
  {
    label: 'Revenue',
    value: '$12,450',
    sub: '+8% this month',
    icon: DollarSign,
    trend: '+8%',
    trendUp: true,
    gradient: 'linear-gradient(135deg,#B7791F,#D97706)',
    iconBg: 'rgba(255,255,255,0.2)',
  },
];

const recentBookings = [
  { id: 'BK001', customer: 'Maya Johnson',   service: 'Premium Birthday Glam',      date: '22 Apr', time: '2:00 PM', status: 'confirmed' },
  { id: 'BK002', customer: 'Sarah Williams', service: 'Traditional Bridal Makeup',  date: '24 Apr', time: '10:00 AM', status: 'pending'   },
  { id: 'BK003', customer: 'Aisha Khan',     service: 'Festive Makeup',             date: '25 Apr', time: '4:30 PM', status: 'confirmed' },
  { id: 'BK004', customer: 'Priya Nair',     service: 'Photoshoot Makeup',          date: '26 Apr', time: '11:00 AM', status: 'pending'  },
  { id: 'BK005', customer: 'Lena Park',      service: 'Engagement Glam',            date: '27 Apr', time: '1:00 PM', status: 'confirmed' },
];

const popularServices = [
  { name: 'Premium Birthday Glam',      bookings: 45, rating: 4.9, revenue: '$2,250' },
  { name: 'Traditional Bridal Makeup',  bookings: 38, rating: 5.0, revenue: '$3,800' },
  { name: 'Photoshoot Makeup',          bookings: 32, rating: 4.8, revenue: '$1,920' },
  { name: 'Festive Makeup',             bookings: 28, rating: 4.7, revenue: '$1,400' },
];

const activities = [
  { icon: CalendarCheck, text: 'New booking from Priya Nair',         time: '5 min ago',  color: '#9B1B30' },
  { icon: Users,         text: 'New client registered: Lena Park',    time: '1 hr ago',   color: '#D97706' },
  { icon: Star,          text: 'Maya Johnson left a 5-star review',   time: '3 hrs ago',  color: '#9B1B30' },
  { icon: TrendingUp,    text: 'April revenue target reached',        time: 'Yesterday',  color: '#B7791F' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('neru-admin-auth') !== 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const maxBookings = popularServices[0].bookings;

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-8">

        {/* Welcome banner */}
        <div
          className="rounded-2xl p-6 flex items-center justify-between overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg,#7B0D1E 0%,#9B1B30 50%,#C0392B 80%,#D4570A 100%)' }}
        >
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle,#FCD34D,transparent)' }} />
          <div className="relative z-10">
            <p className="text-amber-300 text-xs font-semibold tracking-[0.18em] uppercase mb-1">Good morning</p>
            <h2 className="text-white text-2xl font-extrabold">Admin Dashboard</h2>
            <p className="text-rose-200 text-sm mt-1">Here's what's happening with Neru Beauty today.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 relative z-10">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(245,158,11,0.2)', border: '1.5px solid rgba(245,158,11,0.4)' }}>
              <Sparkles size={22} className="text-amber-300" />
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map(({ label, value, sub, icon: Icon, trend, trendUp, gradient }) => (
            <div key={label} className="rounded-2xl p-5 text-white shadow-lg relative overflow-hidden" style={{ background: gradient }}>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20">
                  <Icon size={20} className="text-white" />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${trendUp ? 'bg-green-400/20 text-green-200' : 'bg-red-400/20 text-red-200'}`}>
                  <ArrowUpRight size={11} className={trendUp ? '' : 'rotate-180'} />
                  {trend}
                </span>
              </div>
              <p className="text-3xl font-extrabold leading-none">{value}</p>
              <p className="text-sm font-medium mt-1 opacity-90">{label}</p>
              <p className="text-xs mt-1 opacity-60">{sub}</p>
            </div>
          ))}
        </div>

        {/* Two-column section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Recent Bookings — 2 cols */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-rose-50">
              <h2 className="font-bold text-base" style={{ color: '#7B0D1E' }}>Recent Bookings</h2>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full cursor-pointer hover:bg-amber-100 transition">
                View all →
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#FDF5F0] text-xs font-semibold text-gray-500 tracking-wide uppercase">
                    <th className="py-3 px-6 text-left">ID</th>
                    <th className="py-3 px-4 text-left">Client</th>
                    <th className="py-3 px-4 text-left">Service</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-50">
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-[#FDF5F0] transition-colors">
                      <td className="py-3.5 px-6 font-mono text-xs text-gray-400">{b.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg,#9B1B30,#C0392B)' }}>
                            {b.customer[0]}
                          </div>
                          <span className="font-medium text-gray-800 text-xs">{b.customer}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 text-xs max-w-[140px] truncate">{b.service}</td>
                      <td className="py-3.5 px-4 text-xs text-gray-500 whitespace-nowrap">{b.date} · {b.time}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${b.status === 'confirmed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity feed — 1 col */}
          <div className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-rose-50">
              <h2 className="font-bold text-base" style={{ color: '#7B0D1E' }}>Recent Activity</h2>
            </div>
            <div className="p-5 space-y-4">
              {activities.map(({ icon: Icon, text, time, color }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                    <Icon size={15} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800 leading-snug">{text}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular services */}
        <div className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-rose-50">
            <h2 className="font-bold text-base" style={{ color: '#7B0D1E' }}>Popular Services</h2>
            <span className="text-xs text-gray-400">{popularServices.reduce((a, s) => a + s.bookings, 0)} total bookings</span>
          </div>
          <div className="p-6 space-y-5">
            {popularServices.map((s, i) => (
              <div key={s.name} className="flex items-center gap-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: i === 0 ? 'linear-gradient(135deg,#D97706,#F59E0B)' : 'linear-gradient(135deg,#9B1B30,#C0392B)' }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-semibold text-gray-800 truncate">{s.name}</p>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        {s.rating}
                      </span>
                      <span className="text-xs font-semibold text-gray-500">{s.revenue}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-rose-50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(s.bookings / maxBookings) * 100}%`,
                          background: i === 0
                            ? 'linear-gradient(90deg,#D97706,#F59E0B)'
                            : 'linear-gradient(90deg,#9B1B30,#C0392B)',
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-14 text-right flex-shrink-0">{s.bookings} bookings</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
