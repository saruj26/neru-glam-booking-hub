import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit, Trash2, Images } from 'lucide-react';
import { ServiceForm, type ServiceData } from '@/components/admin/ServiceForm';
import { toast } from '@/components/ui/use-toast';

/* ── Seed data (used on first load when localStorage is empty) ─── */
const SEED_SERVICES: ServiceData[] = [
  { id: 'birthday-basic',      title: 'Basic Birthday Glam',        description: 'A fresh, youthful look perfect for daytime birthday celebrations.',              category: 'birthday',  price: '₹2,500', image: 'https://images.unsplash.com/photo-1596704017254-9b80443994d7?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1596704017254-9b80443994d7?auto=format&fit=crop&w=800&q=80'], active: true },
  { id: 'birthday-premium',    title: 'Premium Birthday Glam',      description: 'Elevated makeup with shimmer and glow, perfect for evening parties.',            category: 'birthday',  price: '₹3,500', image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80'], active: true },
  { id: 'birthday-themed',     title: 'Themed Birthday Makeup',     description: 'Customized makeup to match your birthday theme or costume.',                      category: 'birthday',  price: '₹4,500', image: 'https://images.unsplash.com/photo-1617220275046-90170ad2815f?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1617220275046-90170ad2815f?auto=format&fit=crop&w=800&q=80'], active: true },
  { id: 'puberty-traditional', title: 'Traditional Ceremony Look',  description: 'Classic makeup style perfect for traditional puberty ceremonies.',              category: 'puberty',   price: '₹4,000', image: 'https://images.unsplash.com/photo-1487412947147-5cdc1cdc5564?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1487412947147-5cdc1cdc5564?auto=format&fit=crop&w=800&q=80'], active: true },
  { id: 'puberty-modern',      title: 'Modern Ceremony Look',       description: 'Contemporary makeup with traditional elements for a fresh take.',                 category: 'puberty',   price: '₹5,000', image: 'https://images.unsplash.com/photo-1613324446652-383d8b677c7c?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1613324446652-383d8b677c7c?auto=format&fit=crop&w=800&q=80'], active: true },
  { id: 'reception-minimal',   title: 'Minimal Reception Glam',     description: 'Subtle, elegant makeup perfect for daytime receptions.',                         category: 'reception', price: '₹5,500', image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=800&q=80'], active: true },
  { id: 'reception-glamour',   title: 'Full Glamour Reception',     description: 'Show-stopping makeup with dramatic eyes and perfect contouring.',                category: 'reception', price: '₹9,000', image: 'https://images.unsplash.com/photo-1602910344008-22f323cc1817?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1602910344008-22f323cc1817?auto=format&fit=crop&w=800&q=80'], active: true },
  { id: 'wedding-traditional', title: 'Traditional Bridal Makeup',  description: 'Classic bridal look with traditional elements and rich colors.',                category: 'wedding',   price: '₹12,000', image: 'https://images.unsplash.com/photo-1595159901089-7d0b3608515e?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1595159901089-7d0b3608515e?auto=format&fit=crop&w=800&q=80'], active: true },
  { id: 'wedding-luxury',      title: 'Luxury Bridal Package',      description: 'Premium bridal makeup with hair styling, draping assistance, and touch-ups.',   category: 'wedding',   price: '₹18,000', image: 'https://images.unsplash.com/photo-1607779097040-17baf87ddab0?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1607779097040-17baf87ddab0?auto=format&fit=crop&w=800&q=80'], active: true },
  { id: 'festive-makeup',      title: 'Festive Makeup',             description: 'Special makeup for celebrations like Diwali, Eid, Christmas, etc.',              category: 'other',     price: '₹2,000', image: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=800&q=80'], active: true },
];

const STORAGE_KEY = 'neru-services';

function loadServices(): ServiceData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) { localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_SERVICES)); return SEED_SERVICES; }
    return JSON.parse(raw) as ServiceData[];
  } catch { return SEED_SERVICES; }
}

function persistServices(list: ServiceData[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/* ═══ Page ══════════════════════════════════════════════════════════ */
const AdminServices = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery]     = useState('');
  const [services, setServices]           = useState<ServiceData[]>([]);
  const [editingService, setEditingService] = useState<ServiceData | null>(null);
  const [isDialogOpen, setIsDialogOpen]   = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('neru-admin-auth')) { navigate('/admin'); return; }
    setServices(loadServices());
  }, [navigate]);

  /* helpers */
  const save = (list: ServiceData[]) => { setServices(list); persistServices(list); };

  const filteredServices = services.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddService = (s: ServiceData) => {
    const next = [...services, { ...s, id: `service-${Date.now()}` }];
    save(next);
    setIsDialogOpen(false);
    toast({ title: 'Service added', description: 'The service has been successfully added.' });
  };

  const handleUpdateService = (s: ServiceData) => {
    save(services.map(existing => existing.id === s.id ? s : existing));
    setEditingService(null);
    setIsDialogOpen(false);
    toast({ title: 'Service updated', description: 'The service has been successfully updated.' });
  };

  const handleDeleteService = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    save(services.filter(s => s.id !== id));
    toast({ title: 'Service deleted', description: 'The service has been removed.' });
  };

  const openEdit = (s: ServiceData) => { setEditingService(s); setIsDialogOpen(true); };
  const openAdd  = () => { setEditingService(null); setIsDialogOpen(true); };
  const closeDialog = () => { setEditingService(null); setIsDialogOpen(false); };

  return (
    <AdminLayout>
      <div className="p-5 lg:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-neru-purple">Services Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={open => { if (!open) closeDialog(); }}>
            <DialogTrigger asChild>
              <Button onClick={openAdd} className="bg-neru-gold hover:bg-amber-500 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
              </DialogHeader>
              <ServiceForm
                initialData={editingService}
                onSubmit={editingService ? handleUpdateService : handleAddService}
                onCancel={closeDialog}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-5 flex items-center gap-4">
          <div className="relative flex-grow max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search services…" value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <p className="text-sm text-gray-400">{filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[280px]">Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Images</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-400">No services found</TableCell>
                </TableRow>
              ) : filteredServices.map(service => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {/* thumbnail strip */}
                      <div className="relative flex-shrink-0">
                        <img src={service.image} alt={service.title}
                          className="h-10 w-10 rounded-lg object-cover" />
                        {(service.images?.length ?? 0) > 1 && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] font-extrabold flex items-center justify-center">
                            {service.images.length}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{service.title}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[200px]">{service.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><span className="capitalize">{service.category}</span></TableCell>
                  <TableCell className="font-semibold">{service.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Images size={13} className="text-gray-400" />
                      <span className="text-sm text-gray-600">{service.images?.length ?? 1}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`py-1 px-2.5 rounded-full text-xs font-semibold ${service.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {service.active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon" onClick={() => openEdit(service)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => handleDeleteService(service.id)}>
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
