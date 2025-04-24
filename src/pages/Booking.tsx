
import React, { useState } from 'react';
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  serviceCategory: z.string({
    required_error: "Please select a service category.",
  }),
  serviceType: z.string({
    required_error: "Please select a service type.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  specialRequests: z.string().optional(),
});

const serviceOptions = {
  birthday: ["Basic Birthday Glam", "Premium Birthday Glam", "Themed Birthday Makeup"],
  puberty: ["Traditional Ceremony Look", "Modern Ceremony Look", "Premium Ceremony Package"],
  reception: ["Minimal Reception Glam", "Classic Reception Look", "Full Glamour Reception"],
  wedding: ["Minimal Bridal Look", "Traditional Bridal Makeup", "Luxury Bridal Package"],
  other: ["Festive Makeup", "Modeling/Photoshoot Makeup", "Office/Interview Looks"]
};

const Booking = () => {
  const [serviceCategory, setServiceCategory] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialRequests: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Booking submitted",
      description: "Your booking request has been submitted. We'll contact you soon to confirm the details.",
    });
    console.log(values);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-neru-purple to-purple-800 py-12 md:py-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1525095182007-3364fc39a332?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Book Your Appointment
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                Reserve your spot for a personalized beauty service tailored to your needs.
              </p>
            </div>
          </div>
        </section>
        
        {/* Booking Form Section */}
        <section className="py-16 bg-neru-lightGray">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-white shadow-lg rounded-lg p-6 md:p-10 animate-fade-in">
              <h2 className="text-2xl font-bold text-neru-purple mb-6 text-center">Book Your Beauty Service</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="John Doe" 
                              {...field} 
                              className="border-neru-purple/20 focus-visible:ring-neru-purple/40"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="example@email.com" 
                              {...field} 
                              className="border-neru-purple/20 focus-visible:ring-neru-purple/40"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="1234567890" 
                            {...field} 
                            className="border-neru-purple/20 focus-visible:ring-neru-purple/40"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="serviceCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Category</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              setServiceCategory(value);
                              form.setValue("serviceType", "");
                            }} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border-neru-purple/20 focus:ring-neru-purple/40">
                                <SelectValue placeholder="Select category" />
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
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={!serviceCategory}
                          >
                            <FormControl>
                              <SelectTrigger className="border-neru-purple/20 focus:ring-neru-purple/40">
                                <SelectValue placeholder={serviceCategory ? "Select type" : "First select a category"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {serviceCategory && serviceOptions[serviceCategory as keyof typeof serviceOptions]?.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Appointment Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal border-neru-purple/20 focus:ring-neru-purple/40",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specialRequests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requests (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us any special requests or requirements you have..." 
                            {...field} 
                            className="border-neru-purple/20 min-h-[100px] focus-visible:ring-neru-purple/40"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4">
                    <p className="text-sm text-gray-500 mb-6">
                      <span className="font-medium">Note:</span> A 10% advance payment is required to confirm your booking. The remaining balance can be paid on the day of your appointment.
                    </p>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-neru-purple hover:bg-purple-600 text-white"
                    >
                      Book Appointment
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </section>
        
        {/* Booking Information Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-neru-purple mb-4">Booking Information</h2>
                <p className="text-gray-600">
                  Important details to know before booking your beauty service with us.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-neru-lightGray p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-neru-purple">Booking Policy</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-neru-gold mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Only one booking per day per customer is allowed to ensure quality service.</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-neru-gold mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>10% advance payment is required to confirm your booking.</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-neru-gold mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Bookings should be made at least 48 hours in advance.</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-neru-gold mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Confirmation and reminders will be sent via email and SMS.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-neru-lightGray p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-neru-purple">Cancellation Policy</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-neru-gold mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Free cancellation up to 24 hours before appointment.</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-neru-gold mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Cancellations within 24 hours will forfeit the advance payment.</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-neru-gold mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>One-time free rescheduling is allowed with 24-hour notice.</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-neru-gold mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>No-shows will result in full forfeiture of the advance payment.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Booking;
