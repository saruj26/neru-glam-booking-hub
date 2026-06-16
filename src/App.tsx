import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WishlistProvider } from "@/contexts/WishlistContext";

import Index from "./pages/Index";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import Wishlist from "./pages/Wishlist";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminServices from "./pages/admin/AdminServices";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminPaymentSettings from "./pages/admin/AdminPaymentSettings";
import AdminOffers from "./pages/admin/AdminOffers";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminServiceCategories from "./pages/admin/AdminServiceCategories";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminBeautyTips from "./pages/admin/AdminBeautyTips";
import BeautyTips from "./pages/BeautyTips";
import BeautyTipDetail from "./pages/BeautyTipDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WishlistProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/service/:id" element={<ServiceDetail />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<CustomerDashboard />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
            <Route path="/admin/offers" element={<AdminOffers />} />
            <Route path="/admin/payment-settings" element={<AdminPaymentSettings />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/service-categories" element={<AdminServiceCategories />} />
            <Route path="/admin/gallery" element={<AdminGallery />} />
            <Route path="/admin/beauty-tips" element={<AdminBeautyTips />} />
            <Route path="/beauty-tips" element={<BeautyTips />} />
            <Route path="/beauty-tips/:id" element={<BeautyTipDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </WishlistProvider>
  </QueryClientProvider>
);

export default App;
