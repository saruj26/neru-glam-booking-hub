
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { ServiceForm } from '@/components/admin/ServiceForm';
import { toast } from '@/components/ui/use-toast';

// Mock service data types
type ServiceCategory = 'birthday' | 'puberty' | 'reception' | 'wedding' | 'other';

type ServiceData = {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  price: string;
  image: string;
  active: boolean;
};

const AdminServices = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<ServiceData[]>([]);
  const [editingService, setEditingService] = useState<ServiceData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem('neru-admin-auth') === 'true';
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }

    // In a real app, you'd fetch this data from backend
    setServices([
      {
        id: 'birthday-basic',
        title: 'Basic Birthday Glam',
        description: 'A fresh, youthful look perfect for daytime birthday celebrations',
        category: 'birthday',
        price: '$50',
        image: 'https://images.unsplash.com/photo-1596704017254-9b80443994d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        active: true
      },
      {
        id: 'birthday-premium',
        title: 'Premium Birthday Glam',
        description: 'Elevated makeup with shimmer and glow, perfect for evening parties',
        category: 'birthday',
        price: '$80',
        image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        active: true
      },
      {
        id: 'wedding-traditional',
        title: 'Traditional Bridal Makeup',
        description: 'Classic bridal look with traditional elements and rich colors',
        category: 'wedding',
        price: '$200',
        image: 'https://images.unsplash.com/photo-1595159901089-7d0b3608515e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        active: true
      }
    ]);
  }, [navigate]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredServices = services.filter((service) => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddService = (newService: ServiceData) => {
    setServices([...services, { ...newService, id: `service-${services.length + 1}` }]);
    setIsDialogOpen(false);
    toast({
      title: "Service added",
      description: "The service has been successfully added"
    });
  };

  const handleUpdateService = (updatedService: ServiceData) => {
    setServices(services.map(service => 
      service.id === updatedService.id ? updatedService : service
    ));
    setEditingService(null);
    setIsDialogOpen(false);
    toast({
      title: "Service updated",
      description: "The service has been successfully updated"
    });
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      setServices(services.filter(service => service.id !== id));
      toast({
        title: "Service deleted",
        description: "The service has been successfully deleted"
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-neru-purple">Services Management</h1>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-neru-gold hover:bg-amber-500 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? "Edit Service" : "Add New Service"}
                </DialogTitle>
              </DialogHeader>
              <ServiceForm 
                initialData={editingService} 
                onSubmit={editingService ? handleUpdateService : handleAddService} 
                onCancel={() => {
                  setEditingService(null);
                  setIsDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="h-10 w-10 rounded-md object-cover mr-3" 
                      />
                      <div>
                        <p>{service.title}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{service.category}</span>
                  </TableCell>
                  <TableCell>{service.price}</TableCell>
                  <TableCell>
                    <span className={`py-1 px-2 rounded-full text-xs font-medium ${
                      service.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {service.active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => {
                          setEditingService(service);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
