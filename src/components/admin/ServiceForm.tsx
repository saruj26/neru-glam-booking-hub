
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

// Service category type
type ServiceCategory = 'birthday' | 'puberty' | 'reception' | 'wedding' | 'other';

// Service data type
type ServiceData = {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  price: string;
  image: string;
  active: boolean;
};

// Form schema
const serviceFormSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  category: z.enum(['birthday', 'puberty', 'reception', 'wedding', 'other'], {
    required_error: 'Please select a category.',
  }),
  price: z.string().min(1, {
    message: 'Please enter a price.',
  }),
  image: z.string().url({
    message: 'Please enter a valid image URL.',
  }),
  active: z.boolean().default(true),
});

interface ServiceFormProps {
  initialData: ServiceData | null;
  onSubmit: (data: ServiceData) => void;
  onCancel: () => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const form = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      category: initialData.category,
      price: initialData.price,
      image: initialData.image,
      active: initialData.active,
    } : {
      title: '',
      description: '',
      category: 'birthday' as ServiceCategory,
      price: '',
      image: '',
      active: true,
    },
  });

  const handleSubmit = (values: z.infer<typeof serviceFormSchema>) => {
    // Ensure all required fields are present and create a complete ServiceData object
    const serviceData: ServiceData = {
      id: initialData?.id || '',
      title: values.title,
      description: values.description,
      category: values.category,
      price: values.price,
      image: values.image,
      active: values.active,
    };
    
    onSubmit(serviceData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter service title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter service description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="birthday">Birthday Makeup</SelectItem>
                      <SelectItem value="puberty">Puberty Ceremony</SelectItem>
                      <SelectItem value="reception">Reception Makeup</SelectItem>
                      <SelectItem value="wedding">Wedding Makeup</SelectItem>
                      <SelectItem value="other">Other Categories</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., $50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter image URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Make this service available for booking
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-neru-gold hover:bg-amber-500 text-white">
            {initialData ? 'Update Service' : 'Add Service'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
