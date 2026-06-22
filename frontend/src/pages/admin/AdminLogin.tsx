import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { authApi } from '@/lib/apiService';
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
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Sparkles, Lock, User } from 'lucide-react';

const formSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const data = await authApi.adminLogin(values.username, values.password);
      localStorage.setItem('neru-admin-auth', JSON.stringify(data));
      toast({ title: "Welcome back!", description: "Redirecting to your dashboard…" });
      navigate('/admin/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid username or password.';
      toast({ title: "Access denied", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #7B0D1E 0%, #9B1B30 40%, #C0392B 75%, #D4570A 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #F59E0B, transparent)' }} />
        <div className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #FCD34D, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #fff, transparent)' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.25)', border: '1.5px solid rgba(245,158,11,0.5)' }}>
            <Sparkles size={20} className="text-amber-300" />
          </div>
          <span className="text-white font-bold text-xl tracking-wide">Neru Glam</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-6">
          <div>
            <p className="text-amber-300 text-sm font-semibold tracking-[0.2em] uppercase mb-3">Admin Portal</p>
            <h1 className="text-white text-5xl font-extrabold leading-tight">
              Beauty<br />
              <span style={{ color: '#FCD34D' }}>Reimagined.</span>
            </h1>
          </div>
          <p className="text-rose-200 text-base leading-relaxed max-w-xs">
            Manage your bookings, services, and clients — all in one elegant workspace built for beauty professionals.
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/20" />
            <Sparkles size={14} className="text-amber-300/60" />
            <div className="h-px flex-1 bg-white/20" />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Bookings', value: '325+' },
              { label: 'Clients', value: '189' },
              { label: 'Services', value: '15' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-amber-300">{s.value}</p>
                <p className="text-xs text-rose-200 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-rose-300/60 text-xs">© 2026 Neru Beauty. All rights reserved.</p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center bg-[#FDF8F5] p-6 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#9B1B30,#C0392B)' }}>
              <Sparkles size={16} className="text-amber-300" />
            </div>
            <span className="font-bold text-lg" style={{ color: '#7B0D1E' }}>Neru Glam</span>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold" style={{ color: '#7B0D1E' }}>Welcome back</h2>
            <p className="mt-2 text-sm text-gray-500">Sign in to your admin dashboard to continue</p>
          </div>

          {/* Demo hint */}
          <div className="flex items-start gap-3 rounded-xl p-4" style={{ background: 'linear-gradient(135deg,#FEF3C7,#FDE68A)', border: '1px solid #FCD34D' }}>
            <Sparkles size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <span className="font-semibold">Demo credentials —</span>{' '}
              Username: <code className="font-bold">admin</code> &nbsp;·&nbsp; Password: <code className="font-bold">admin123</code>
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Enter your username"
                          {...field}
                          className="pl-10 h-12 rounded-xl border-gray-200 bg-white focus-visible:ring-2 text-sm"
                          style={{ '--tw-ring-color': 'rgba(155,27,48,0.35)' } as React.CSSProperties}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          {...field}
                          className="pl-10 pr-11 h-12 rounded-xl border-gray-200 bg-white focus-visible:ring-2 text-sm"
                          style={{ '--tw-ring-color': 'rgba(155,27,48,0.35)' } as React.CSSProperties}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl text-white font-semibold text-sm tracking-wide shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
                style={{ background: isLoading ? '#9B1B30' : 'linear-gradient(135deg, #9B1B30 0%, #C0392B 50%, #D4570A 100%)' }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in…
                  </span>
                ) : 'Sign In to Dashboard'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
