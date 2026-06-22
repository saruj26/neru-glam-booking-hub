import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Calendar,
  Package,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Bell,
  ChevronDown,
  Tag,
  CreditCard,
  Layers,
  Image,
  Lightbulb,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { path: '/admin/dashboard',          icon: BarChart3,     label: 'Dashboard'          },
  { path: '/admin/services',           icon: Package,       label: 'Services'           },
  { path: '/admin/service-categories', icon: Layers,        label: 'Categories'         },
  { path: '/admin/gallery',            icon: Image,         label: 'Gallery'            },
  { path: '/admin/bookings',           icon: Calendar,      label: 'Bookings'           },
  { path: '/admin/offers',             icon: Tag,           label: 'Offers'             },
  { path: '/admin/reviews',            icon: MessageSquare, label: 'Reviews'            },
  { path: '/admin/payment-settings',   icon: CreditCard,    label: 'Payment Settings'   },
  { path: '/admin/beauty-tips',        icon: Lightbulb,     label: 'Beauty Tips'         },
  { path: '/admin/settings',           icon: Settings,      label: 'Settings'           },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('neru-admin-auth');
    toast({ title: "Signed out", description: "See you next time!" });
    navigate('/admin');
  };

  const Sidebar = () => (
    <div className="h-full flex flex-col" style={{ background: 'linear-gradient(180deg,#7B0D1E 0%,#9B1B30 55%,#A83222 100%)' }}>
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(245,158,11,0.2)', border: '1.5px solid rgba(245,158,11,0.45)' }}>
          <Sparkles size={15} className="text-amber-300" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none">Neru Beauty</p>
          <p className="text-rose-300 text-[10px] mt-0.5 tracking-widest uppercase">Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? 'text-white shadow-md'
                  : 'text-rose-200 hover:text-white hover:bg-white/10'
              }`}
              style={active ? { background: 'linear-gradient(135deg,rgba(212,87,10,0.7),rgba(245,158,11,0.55))' } : {}}
            >
              <Icon size={18} className={active ? 'text-amber-300' : ''} />
              {label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-300" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-200 hover:text-white hover:bg-white/10 text-sm font-medium transition-all duration-150"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDF5F0]">
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-rose-100 shadow-sm">
        <button onClick={() => setOpen(!open)} className="p-2 rounded-lg text-rose-800 hover:bg-rose-50 transition">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500" />
          <span className="font-bold text-sm" style={{ color: '#7B0D1E' }}>Neru Beauty</span>
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ background: 'linear-gradient(135deg,#9B1B30,#C0392B)' }}>A</div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-64 h-full" onClick={e => e.stopPropagation()}>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-60 z-30 shadow-xl">
        <Sidebar />
      </aside>

      {/* Main */}
      <div className="lg:pl-60 min-h-screen flex flex-col">
        {/* Desktop header */}
        <header className="hidden lg:flex h-16 bg-white border-b border-rose-100 items-center justify-between px-8 shadow-sm">
          <div>
            <h1 className="text-base font-bold" style={{ color: '#7B0D1E' }}>
              {menuItems.find(m => m.path === location.pathname)?.label ?? 'Admin'}
            </h1>
            <p className="text-xs text-gray-400">Neru Beauty Management Portal</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl text-gray-500 hover:bg-rose-50 hover:text-rose-700 transition">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
            </button>

            <div className="flex items-center gap-2.5 pl-4 border-l border-gray-100">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow"
                style={{ background: 'linear-gradient(135deg,#9B1B30,#C0392B)' }}>A</div>
              <div className="text-sm leading-none">
                <p className="font-semibold text-gray-800">Admin User</p>
                <p className="text-gray-400 text-[11px] mt-0.5">admin@neru.beauty</p>
              </div>
              <ChevronDown size={14} className="text-gray-400 ml-1" />
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};
