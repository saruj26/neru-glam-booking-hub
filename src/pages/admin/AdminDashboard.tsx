
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem('neru-admin-auth') === 'true';
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);

  // Mock data for dashboard
  const dashboardData = {
    totalBookings: 325,
    pendingBookings: 42,
    completedBookings: 283,
    totalCustomers: 189,
    totalServices: 15,
    totalRevenue: '$12,450',
    recentBookings: [
      { id: 'BK001', customer: 'Maya Johnson', service: 'Premium Birthday Glam', date: '2025-04-22', time: '14:00', status: 'confirmed' },
      { id: 'BK002', customer: 'Sarah Williams', service: 'Traditional Bridal Makeup', date: '2025-04-24', time: '10:00', status: 'pending' },
      { id: 'BK003', customer: 'Aisha Khan', service: 'Festive Makeup', date: '2025-04-25', time: '16:30', status: 'confirmed' },
    ],
    popularServices: [
      { id: 'SV001', name: 'Premium Birthday Glam', bookings: 45 },
      { id: 'SV002', name: 'Traditional Bridal Makeup', bookings: 38 },
      { id: 'SV003', name: 'Photoshoot Makeup', bookings: 32 },
    ]
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-neru-purple mb-6">Dashboard Overview</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
            <p className="text-3xl font-bold text-neru-purple mt-2">{dashboardData.totalBookings}</p>
            <div className="mt-2 text-xs text-gray-500">
              <span className="text-green-600 font-medium">{dashboardData.completedBookings}</span> completed, 
              <span className="text-orange-500 font-medium ml-1">{dashboardData.pendingBookings}</span> pending
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
            <p className="text-3xl font-bold text-neru-purple mt-2">{dashboardData.totalCustomers}</p>
            <div className="mt-2 text-xs text-green-600">
              +12% from last month
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Total Services</h3>
            <p className="text-3xl font-bold text-neru-purple mt-2">{dashboardData.totalServices}</p>
            <div className="mt-2 text-xs text-gray-500">
              Across 5 categories
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="text-3xl font-bold text-neru-gold mt-2">{dashboardData.totalRevenue}</p>
            <div className="mt-2 text-xs text-green-600">
              +8% from last month
            </div>
          </div>
        </div>

        {/* Recent Bookings Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-neru-purple mb-4">Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-left">Service</th>
                  <th className="py-3 px-4 text-left">Date & Time</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dashboardData.recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{booking.id}</td>
                    <td className="py-3 px-4">{booking.customer}</td>
                    <td className="py-3 px-4">{booking.service}</td>
                    <td className="py-3 px-4">{`${booking.date} at ${booking.time}`}</td>
                    <td className="py-3 px-4">
                      <span className={`py-1 px-2 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Services */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-neru-purple mb-4">Popular Services</h2>
          <div className="space-y-4">
            {dashboardData.popularServices.map((service) => (
              <div key={service.id} className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-sm text-gray-500">{service.bookings} bookings</p>
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-neru-gold h-2.5 rounded-full" 
                    style={{ width: `${(service.bookings / dashboardData.popularServices[0].bookings) * 100}%` }}
                  ></div>
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
