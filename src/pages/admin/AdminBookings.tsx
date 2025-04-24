
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Calendar, Eye, XCircle, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Mock booking data type
type Booking = {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  service: {
    id: string;
    name: string;
  };
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment: {
    amount: string;
    paid: boolean;
  };
};

const AdminBookings = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem('neru-admin-auth') === 'true';
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }

    // In a real app, you'd fetch this data from backend
    setBookings([
      {
        id: 'BK001',
        customer: {
          name: 'Maya Johnson',
          email: 'maya@example.com',
          phone: '123-456-7890'
        },
        service: {
          id: 'birthday-premium',
          name: 'Premium Birthday Glam'
        },
        date: '2025-04-25',
        time: '14:00',
        status: 'confirmed',
        payment: {
          amount: '$80',
          paid: true
        }
      },
      {
        id: 'BK002',
        customer: {
          name: 'Sarah Williams',
          email: 'sarah@example.com',
          phone: '234-567-8901'
        },
        service: {
          id: 'wedding-traditional',
          name: 'Traditional Bridal Makeup'
        },
        date: '2025-04-28',
        time: '10:00',
        status: 'pending',
        payment: {
          amount: '$200',
          paid: false
        }
      },
      {
        id: 'BK003',
        customer: {
          name: 'Aisha Khan',
          email: 'aisha@example.com',
          phone: '345-678-9012'
        },
        service: {
          id: 'festive-makeup',
          name: 'Festive Makeup'
        },
        date: '2025-05-05',
        time: '16:30',
        status: 'confirmed',
        payment: {
          amount: '$70',
          paid: true
        }
      },
      {
        id: 'BK004',
        customer: {
          name: 'Jennifer Lee',
          email: 'jennifer@example.com',
          phone: '456-789-0123'
        },
        service: {
          id: 'birthday-basic',
          name: 'Basic Birthday Glam'
        },
        date: '2025-05-10',
        time: '11:00',
        status: 'cancelled',
        payment: {
          amount: '$50',
          paid: false
        }
      },
      {
        id: 'BK005',
        customer: {
          name: 'Rebecca Thomas',
          email: 'rebecca@example.com',
          phone: '567-890-1234'
        },
        service: {
          id: 'photoshoot-makeup',
          name: 'Photoshoot Makeup'
        },
        date: '2025-04-20',
        time: '09:00',
        status: 'completed',
        payment: {
          amount: '$120',
          paid: true
        }
      }
    ]);
  }, [navigate]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredBookings = bookings.filter((booking) => {
    // Filter by search query
    const matchesSearch = 
      booking.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by status
    if (statusFilter !== 'all') {
      return matchesSearch && booking.status === statusFilter;
    }
    
    return matchesSearch;
  });

  const handleConfirmBooking = (id: string) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? { ...booking, status: 'confirmed' } : booking
    ));
    toast({
      title: "Booking confirmed",
      description: "The booking has been confirmed"
    });
  };

  const handleCancelBooking = (id: string) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, status: 'cancelled' } : booking
      ));
      toast({
        title: "Booking cancelled",
        description: "The booking has been cancelled"
      });
    }
  };

  const handleCompleteBooking = (id: string) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? { ...booking, status: 'completed' } : booking
    ));
    toast({
      title: "Booking marked as completed",
      description: "The booking has been marked as completed"
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-neru-purple">Bookings Management</h1>
          <Button className="bg-neru-gold hover:bg-amber-500 text-white">
            <Calendar className="mr-2 h-4 w-4" /> Export Calendar
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          <div className="w-full md:w-[200px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                    No bookings found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.customer.name}</p>
                        <p className="text-xs text-gray-500">{booking.customer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{booking.service.name}</TableCell>
                    <TableCell>{`${booking.date} at ${booking.time}`}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="font-medium">{booking.payment.amount}</span>
                        <span className={`ml-2 py-1 px-2 rounded-full text-xs ${
                          booking.payment.paid 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.payment.paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`py-1 px-2 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {booking.status === 'pending' && (
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            title="Confirm Booking"
                            onClick={() => handleConfirmBooking(booking.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}

                        {(booking.status === 'confirmed' || booking.status === 'pending') && (
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="text-red-500 border-red-200 hover:bg-red-50"
                            title="Cancel Booking"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}

                        {booking.status === 'confirmed' && (
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            title="Mark as Completed"
                            onClick={() => handleCompleteBooking(booking.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
