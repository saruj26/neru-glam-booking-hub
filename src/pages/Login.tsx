import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Eye, EyeOff, Mail, Lock, Sparkles, ShieldCheck, Star, Calendar, ArrowRight, Check } from 'lucide-react';

/* ─── Schema — UNCHANGED ─────────────────────────────────────────── */
const formSchema = z.object({
  email:    z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6,  { message: "Password must be at least 6 characters." }),
});

/* ─── Left-panel benefits ────────────────────────────────────────── */
const benefits = [
  { icon: Star,         text: 'Premium beauty services for every occasion'  },
  { icon: ShieldCheck,  text: 'Certified artists & skin-safe products'       },
  { icon: Calendar,     text: 'Easy booking, real-time availability'         },
];

const Login = () => {
  const navigate = useNavigate();
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [remember, setRemember] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setTimeout(() => {
      try {
        const customers: { email: string; password: string; name: string; phone: string; address: string; memberSince: string; level: string; points: number; pointsForNext: number; nextLevel: string }[] =
          JSON.parse(localStorage.getItem('neru-customers') || '[]');
        const found = customers.find(c => c.email === values.email && c.password === values.password);
        if (found) {
          const authData = {
            name:          found.name,
            email:         found.email,
            phone:         found.phone         || '',
            address:       found.address       || '',
            memberSince:   found.memberSince   || 'Recently',
            level:         found.level         || 'Silver',
            points:        found.points        ?? 0,
            pointsForNext: found.pointsForNext ?? 500,
            nextLevel:     found.nextLevel     || 'Gold',
          };
          localStorage.setItem('neru-customer-auth', JSON.stringify(authData));
          toast({ title: `Welcome back, ${found.name}!`, description: 'Redirecting to your dashboard…' });
          navigate('/dashboard');
        } else {
          toast({
            title: 'Invalid credentials',
            description: 'Email or password is incorrect. Please try again.',
            variant: 'destructive',
          });
        }
      } catch {
        toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' });
      }
      setLoading(false);
    }, 900);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow flex">
        <div className="flex flex-1 min-h-0">

          {/* ── LEFT PANEL ──────────────────────────────────────── */}
          <div
            className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden"
            style={{ background: 'linear-gradient(150deg,#3B0764 0%,#6D28D9 40%,#8B5CF6 75%,#B45309 100%)' }}
          >
            {/* decorative blobs */}
            <div className="absolute -top-28 -left-28 w-96 h-96 rounded-full opacity-15" style={{ background: 'radial-gradient(circle,#FCD34D,transparent)' }} />
            <div className="absolute -bottom-36 -right-20 w-[30rem] h-[30rem] rounded-full opacity-10" style={{ background: 'radial-gradient(circle,#F9A8D4,transparent)' }} />

            {/* hero image */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center opacity-[0.12]" />

            {/* logo */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(212,165,63,0.25)', border: '1.5px solid rgba(212,165,63,0.5)' }}>
                <Sparkles size={18} className="text-amber-300" />
              </div>
              <div className="leading-none">
                <p className="text-white font-bold text-lg" style={{ fontFamily: "'Playfair Display',serif" }}>Neru Beauty</p>
                <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mt-0.5">Premium Salon</p>
              </div>
            </div>

            {/* centre content */}
            <div className="relative z-10 space-y-8">
              <div>
                <p className="text-amber-300 text-xs font-bold tracking-[0.2em] uppercase mb-4">Welcome Back</p>
                <h2
                  className="text-4xl font-extrabold text-white leading-tight"
                  style={{ fontFamily: "'Playfair Display',serif" }}
                >
                  Enhancing Beauty,<br />
                  <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right,#FCD34D,#F59E0B)' }}>
                    Creating Confidence
                  </span>
                </h2>
                <p className="text-purple-200 mt-4 text-sm leading-relaxed max-w-xs">
                  Your beauty journey continues here. Sign in to access your appointments, exclusive offers, and personalised beauty tips.
                </p>
              </div>

              {/* benefits */}
              <ul className="space-y-3">
                {benefits.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,165,63,0.2)', border: '1px solid rgba(212,165,63,0.35)' }}>
                      <Icon size={13} className="text-amber-300" />
                    </div>
                    <span className="text-purple-100 text-sm">{text}</span>
                  </li>
                ))}
              </ul>

              {/* divider + quote */}
              <div className="pt-4 border-t border-white/15">
                <p className="text-purple-200/70 text-xs italic leading-relaxed">
                  "We don't just do makeup — we build confidence, one brushstroke at a time."
                </p>
                <p className="text-amber-300/70 text-[10px] mt-2">— Neru Priya, Founder</p>
              </div>
            </div>

            {/* stats footer */}
            <div className="relative z-10 grid grid-cols-3 gap-3">
              {[['500+','Clients'],['4.9★','Rating'],['5 Yrs','Experience']].map(([val,lbl]) => (
                <div key={lbl} className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <p className="text-amber-300 font-bold text-lg leading-none">{val}</p>
                  <p className="text-purple-200/60 text-[10px] mt-1">{lbl}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT PANEL ─────────────────────────────────────── */}
          <div className="flex-1 flex items-center justify-center bg-[#FDF8F5] px-6 py-14 lg:px-14">
            <div className="w-full max-w-[420px] space-y-8 animate-fade-in">

              {/* mobile logo */}
              <div className="lg:hidden flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
                  <Sparkles size={14} className="text-white" />
                </div>
                <span className="font-bold text-neru-purple" style={{ fontFamily: "'Playfair Display',serif" }}>Neru Beauty</span>
              </div>

              {/* heading */}
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                  <ShieldCheck size={12} /> SSL Secured Login
                </div>
                <h1 className="text-3xl font-extrabold text-neru-darkGray leading-tight" style={{ fontFamily: "'Playfair Display',serif" }}>
                  Welcome Back
                </h1>
                <p className="text-gray-500 text-sm mt-2">Sign in to your Neru Beauty account</p>
              </div>

              {/* form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                  {/* email */}
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Email Address</label>
                      <FormControl>
                        <div className="relative">
                          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <Input
                            placeholder="your@email.com"
                            {...field}
                            className="pl-10 h-12 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-2 focus-visible:ring-neru-purple/30 focus-visible:border-neru-purple/50 transition-all"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />

                  {/* password */}
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Password</label>
                      <FormControl>
                        <div className="relative">
                          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <Input
                            type={showPwd ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...field}
                            className="pl-10 pr-11 h-12 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-2 focus-visible:ring-neru-purple/30 focus-visible:border-neru-purple/50 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPwd(!showPwd)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />

                  {/* remember + forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div
                        onClick={() => setRemember(!remember)}
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-all duration-150 cursor-pointer ${remember ? 'bg-neru-purple border-neru-purple' : 'border-gray-300 bg-white group-hover:border-neru-purple/50'}`}
                      >
                        {remember && <Check size={10} className="text-white" />}
                      </div>
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-sm font-medium text-neru-purple hover:text-purple-700 transition-colors hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  {/* submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl text-white font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl hover:shadow-neru-purple/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: loading ? '#7C3AED' : 'linear-gradient(135deg,#7C3AED 0%,#8B5CF6 60%,#B45309 100%)' }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Signing in…
                      </>
                    ) : (
                      <>Sign In <ArrowRight size={15} /></>
                    )}
                  </button>
                </form>
              </Form>

              {/* divider */}
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400">New to Neru Beauty?</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* register CTA */}
              <Link
                to="/register"
                className="block w-full h-12 rounded-xl border-2 border-neru-purple/25 text-neru-purple text-sm font-semibold text-center leading-[46px] hover:bg-neru-purple hover:text-white hover:border-neru-purple transition-all duration-200"
              >
                Create a Free Account
              </Link>

              {/* privacy note */}
              <p className="text-center text-xs text-gray-400 leading-relaxed">
                By signing in you agree to our{' '}
                <a href="#" className="text-neru-purple hover:underline">Terms</a> &{' '}
                <a href="#" className="text-neru-purple hover:underline">Privacy Policy</a>.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
