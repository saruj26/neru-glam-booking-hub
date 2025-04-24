
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  Package, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('neru-admin-auth');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
    navigate('/admin');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: <BarChart3 size={20} />, label: 'Dashboard' },
    { path: '/admin/services', icon: <Package size={20} />, label: 'Services' },
    { path: '/admin/bookings', icon: <Calendar size={20} />, label: 'Bookings' },
    { path: '/admin/customers', icon: <User size={20} />, label: 'Customers' },
    { path: '/admin/reviews', icon: <MessageSquare size={20} />, label: 'Reviews' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden p-4 flex justify-between items-center bg-white border-b">
        <div className="flex items-center">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="ml-3 text-xl font-bold text-neru-purple">Neru Admin</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Admin</span>
          <img 
            src="https://ui-avatars.com/api/?name=Admin&background=8B5CF6&color=fff" 
            alt="Admin" 
            className="h-8 w-8 rounded-full"
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        lg:w-64 lg:flex-shrink-0 bg-white border-r fixed inset-y-0 left-0 z-30 lg:z-0
        transition-transform duration-300 ease-in-out transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-center border-b">
            <h1 className="text-xl font-bold text-neru-purple">Neru Beauty Admin</h1>
          </div>

          {/* Sidebar Menu */}
          <div className="flex-grow p-4 space-y-1">
            {menuItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === item.path 
                    ? 'bg-neru-purple text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t">
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="w-full border-neru-purple/20 text-neru-purple flex items-center justify-center"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64 min-h-screen">
        {/* Header */}
        <header className="hidden lg:flex h-16 bg-white border-b items-center justify-between px-6">
          <h1 className="text-xl font-bold text-neru-purple">Admin Dashboard</h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="text-sm mr-2">
                <p className="font-medium text-gray-700">Admin User</p>
                <p className="text-gray-500 text-xs">admin@neru.beauty</p>
              </div>
              <img 
                src="https://ui-avatars.com/api/?name=Admin&background=8B5CF6&color=fff" 
                alt="Admin" 
                className="h-10 w-10 rounded-full"
              />
              <ChevronDown size={16} className="ml-1 text-gray-600" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};
