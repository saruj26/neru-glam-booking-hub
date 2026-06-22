
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Star, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Mock review data type
type Review = {
  id: number;
  serviceId: string;
  serviceName: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
};

const AdminReviews = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem('neru-admin-auth') === 'true';
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }

    // In a real app, you'd fetch this data from backend
    setReviews([
      {
        id: 1,
        serviceId: 'birthday-basic',
        serviceName: 'Basic Birthday Glam',
        userName: 'Sarah M.',
        rating: 5,
        comment: 'Loved my birthday makeup! Looked natural but polished.',
        date: '2025-04-01',
        approved: true
      },
      {
        id: 2,
        serviceId: 'birthday-basic',
        serviceName: 'Basic Birthday Glam',
        userName: 'Jennifer L.',
        rating: 4,
        comment: 'Great service, lasted all day through my party.',
        date: '2025-04-03',
        approved: true
      },
      {
        id: 3,
        serviceId: 'birthday-premium',
        serviceName: 'Premium Birthday Glam',
        userName: 'Aisha K.',
        rating: 5,
        comment: 'Absolutely stunning! Got so many compliments at my party.',
        date: '2025-04-10',
        approved: true
      },
      {
        id: 4,
        serviceId: 'birthday-premium',
        serviceName: 'Premium Birthday Glam',
        userName: 'Rebecca T.',
        rating: 5,
        comment: 'Worth every penny! The false lashes really made my eyes pop.',
        date: '2025-04-15',
        approved: true
      },
      {
        id: 5,
        serviceId: 'wedding-traditional',
        serviceName: 'Traditional Bridal Makeup',
        userName: 'Maya Johnson',
        rating: 3,
        comment: 'The makeup was nice but started to fade after a few hours.',
        date: '2025-04-20',
        approved: false
      }
    ]);
  }, [navigate]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredReviews = reviews.filter((review) => {
    // Filter by search query
    const matchesSearch = 
      review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by approval status
    if (filter === 'approved') return matchesSearch && review.approved;
    if (filter === 'pending') return matchesSearch && !review.approved;
    return matchesSearch;
  });

  const handleApproveReview = (id: number) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, approved: true } : review
    ));
    toast({
      title: "Review approved",
      description: "The review is now publicly visible"
    });
  };

  const handleRejectReview = (id: number) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, approved: false } : review
    ));
    toast({
      title: "Review rejected",
      description: "The review has been hidden from public view"
    });
  };

  const handleDeleteReview = (id: number) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setReviews(reviews.filter(review => review.id !== id));
      toast({
        title: "Review deleted",
        description: "The review has been permanently deleted"
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-neru-purple">Reviews Management</h1>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-neru-purple hover:bg-neru-purple/90' : ''}
            >
              All
            </Button>
            <Button 
              variant={filter === 'approved' ? 'default' : 'outline'} 
              onClick={() => setFilter('approved')}
              className={filter === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              Approved
            </Button>
            <Button 
              variant={filter === 'pending' ? 'default' : 'outline'} 
              onClick={() => setFilter('pending')}
              className={filter === 'pending' ? 'bg-orange-500 hover:bg-orange-600' : ''}
            >
              Pending
            </Button>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    No reviews found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">{review.userName}</TableCell>
                    <TableCell>{review.serviceName}</TableCell>
                    <TableCell>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16}
                            className={i < review.rating ? 'text-neru-gold fill-neru-gold' : 'text-gray-300'} 
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{review.date}</TableCell>
                    <TableCell>
                      <span className={`py-1 px-2 rounded-full text-xs font-medium ${
                        review.approved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {review.approved ? 'Approved' : 'Pending'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {!review.approved && (
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => handleApproveReview(review.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {review.approved && (
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="text-orange-500 border-orange-200 hover:bg-orange-50"
                            onClick={() => handleRejectReview(review.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

export default AdminReviews;
