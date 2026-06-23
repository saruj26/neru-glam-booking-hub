
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
import { Search, Star, Trash2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { reviewsApi, type Review } from '@/lib/apiService';

const AdminReviews = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    reviewsApi.getAll()
      .then(setReviews)
      .catch(() => toast({ title: 'Failed to load reviews', variant: 'destructive' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!localStorage.getItem('neru-admin-auth')) {
      navigate('/admin');
      return;
    }
    load();
  }, [navigate]);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.serviceCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === 'approved') return matchesSearch && review.approved;
    if (filter === 'pending') return matchesSearch && !review.approved;
    return matchesSearch;
  });

  const handleApproveReview = (review: Review) => {
    reviewsApi.approve(review.reviewId ?? review.id!)
      .then(() => {
        setReviews(prev => prev.map(r => (r.id === review.id) ? { ...r, approved: true } : r));
        toast({ title: 'Review approved', description: 'The review is now publicly visible' });
      })
      .catch(() => toast({ title: 'Approve failed', variant: 'destructive' }));
  };

  const handleRejectReview = (review: Review) => {
    setReviews(prev => prev.map(r => r.id === review.id ? { ...r, approved: false } : r));
    toast({ title: 'Review hidden', description: 'The review has been hidden from public view' });
  };

  const handleDeleteReview = (review: Review) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    reviewsApi.delete(review.reviewId ?? review.id!)
      .then(() => {
        setReviews(prev => prev.filter(r => r.id !== review.id));
        toast({ title: 'Review deleted', description: 'The review has been permanently deleted' });
      })
      .catch(() => toast({ title: 'Delete failed', variant: 'destructive' }));
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold" style={{ color: '#7B0D1E' }}>Reviews Management</h1>
          <button onClick={load}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm font-medium transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-rose-700 hover:bg-rose-800' : ''}
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-400">Loading reviews…</TableCell>
                </TableRow>
              ) : filteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    No reviews found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviews.map((review) => (
                  <TableRow key={review.reviewId ?? review.id}>
                    <TableCell className="font-medium">{review.customerName}</TableCell>
                    <TableCell>{review.serviceCategory}</TableCell>
                    <TableCell>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-IN') : '—'}</TableCell>
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
                            onClick={() => handleApproveReview(review)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {review.approved && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-orange-500 border-orange-200 hover:bg-orange-50"
                            onClick={() => handleRejectReview(review)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => handleDeleteReview(review)}
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
