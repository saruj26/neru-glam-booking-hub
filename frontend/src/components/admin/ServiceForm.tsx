import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, GripVertical, Image } from 'lucide-react';

type ServiceCategory = 'birthday' | 'puberty' | 'reception' | 'wedding' | 'other';

export type ServiceData = {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  price: string;
  image: string;       // cover / thumbnail (first image or explicit)
  images: string[];    // all images for the gallery
  active: boolean;
};

const serviceFormSchema = z.object({
  title:       z.string().min(2,  { message: 'Title must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  category:    z.enum(['birthday', 'puberty', 'reception', 'wedding', 'other'], { required_error: 'Please select a category.' }),
  price:       z.string().min(1,  { message: 'Please enter a price.' }),
  image:       z.string().url({ message: 'Please enter a valid image URL.' }),
  active:      z.boolean().default(true),
});

interface ServiceFormProps {
  initialData: ServiceData | null;
  onSubmit: (data: ServiceData) => void;
  onCancel: () => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ initialData, onSubmit, onCancel }) => {
  /* extra images (all images except the cover defined in the main field) */
  const [extraImages, setExtraImages] = useState<string[]>(
    initialData?.images?.length ? initialData.images.slice(1) : []
  );
  const [newUrl, setNewUrl] = useState('');

  const form = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: initialData ? {
      title:       initialData.title,
      description: initialData.description,
      category:    initialData.category,
      price:       initialData.price,
      image:       initialData.image,
      active:      initialData.active,
    } : {
      title: '', description: '', category: 'birthday', price: '', image: '', active: true,
    },
  });

  const addExtra = () => {
    const url = newUrl.trim();
    if (!url) return;
    try { new URL(url); } catch { return; }
    setExtraImages(prev => [...prev, url]);
    setNewUrl('');
  };

  const removeExtra = (idx: number) => setExtraImages(prev => prev.filter((_, i) => i !== idx));

  const moveExtra = (idx: number, dir: 'up' | 'down') => {
    setExtraImages(prev => {
      const next = [...prev];
      const swap = dir === 'up' ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= next.length) return next;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  };

  const handleSubmit = (values: z.infer<typeof serviceFormSchema>) => {
    const allImages = [values.image, ...extraImages].filter(Boolean);
    onSubmit({
      id:          initialData?.id ?? '',
      title:       values.title,
      description: values.description,
      category:    values.category,
      price:       values.price,
      image:       values.image,
      images:      allImages,
      active:      values.active,
    });
  };

  const coverUrl = form.watch('image');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 py-2">

        {/* Title */}
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>Service Title</FormLabel>
            <FormControl><Input placeholder="Enter service title" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Description */}
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl><Textarea placeholder="Enter service description" rows={3} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Category + Price */}
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="category" render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="birthday">Birthday Makeup</SelectItem>
                  <SelectItem value="puberty">Puberty Ceremony</SelectItem>
                  <SelectItem value="reception">Reception Makeup</SelectItem>
                  <SelectItem value="wedding">Wedding Makeup</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="price" render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl><Input placeholder="e.g. ₹2,500" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* Cover image */}
        <FormField control={form.control} name="image" render={({ field }) => (
          <FormItem>
            <FormLabel>Cover / Thumbnail Image URL</FormLabel>
            <FormControl><Input placeholder="https://…/cover.jpg" {...field} /></FormControl>
            <FormMessage />
            {coverUrl && (
              <div className="mt-2 h-28 rounded-xl overflow-hidden border border-gray-100">
                <img src={coverUrl} alt="cover preview" className="w-full h-full object-cover"
                  onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
          </FormItem>
        )} />

        {/* ── Multi-image gallery ─────────────────────────────────── */}
        <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/40 p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Image size={14} className="text-purple-600" />
            <p className="text-sm font-bold text-purple-800">Additional Gallery Images</p>
            <span className="ml-auto text-[11px] text-purple-400 font-medium">{extraImages.length} added</span>
          </div>
          <p className="text-[11px] text-purple-500">These appear in the scrollable gallery on the service detail page. Cover image is always shown first.</p>

          {/* existing extras */}
          {extraImages.length > 0 && (
            <div className="space-y-2">
              {extraImages.map((url, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 p-2">
                  {/* thumb */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img src={url} alt="" className="w-full h-full object-cover"
                      onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                  {/* url truncated */}
                  <p className="flex-1 text-[11px] text-gray-500 truncate min-w-0">{url}</p>
                  {/* reorder */}
                  <div className="flex flex-col gap-0.5">
                    <button type="button" onClick={() => moveExtra(idx, 'up')} disabled={idx === 0}
                      className="w-5 h-5 rounded text-gray-400 hover:text-purple-600 disabled:opacity-25 text-[10px] leading-none flex items-center justify-center">↑</button>
                    <button type="button" onClick={() => moveExtra(idx, 'down')} disabled={idx === extraImages.length - 1}
                      className="w-5 h-5 rounded text-gray-400 hover:text-purple-600 disabled:opacity-25 text-[10px] leading-none flex items-center justify-center">↓</button>
                  </div>
                  <button type="button" onClick={() => removeExtra(idx)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center border border-red-200 text-red-400 hover:bg-red-50 flex-shrink-0">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* add new URL */}
          <div className="flex gap-2">
            <input
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addExtra(); } }}
              placeholder="https://…/image.jpg — press Enter or click +"
              className="flex-1 h-9 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white"
            />
            <button type="button" onClick={addExtra}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
              <Plus size={15} />
            </button>
          </div>
        </div>

        {/* Active toggle */}
        <FormField control={form.control} name="active" render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
            <div>
              <FormLabel className="text-sm font-semibold">Active</FormLabel>
              <p className="text-xs text-gray-400 mt-0.5">Make this service available for booking</p>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )} />

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-1">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="bg-neru-gold hover:bg-amber-500 text-white">
            {initialData ? 'Update Service' : 'Add Service'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
