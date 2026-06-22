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
            style={{ background: 'linear-gradient(160deg,#1e0940 0%,#3B0764 25%,#5B21B6 55%,#7C3AED 80%,#9333EA 100%)' }}
          >
            {/* layered decorative elements */}
            <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full opacity-20" style={{ background: 'radial-gradient(circle,#FCD34D,transparent 70%)' }} />
            <div className="absolute -bottom-40 -right-24 w-[32rem] h-[32rem] rounded-full opacity-12" style={{ background: 'radial-gradient(circle,#F9A8D4,transparent 65%)' }} />
            <div className="absolute top-1/2 -left-20 w-72 h-72 rounded-full opacity-8" style={{ background: 'radial-gradient(circle,#A78BFA,transparent 70%)' }} />

            {/* geometric accent lines */}
            <div className="absolute top-0 right-0 w-px h-full opacity-10" style={{ background: 'linear-gradient(180deg,transparent,#FCD34D,transparent)' }} />
            <div className="absolute top-0 left-0 right-0 h-px opacity-20" style={{ background: 'linear-gradient(90deg,transparent,rgba(212,165,63,0.8),transparent)' }} />

            {/* hero image overlay */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center opacity-[0.08]" />

            {/* ── Brand Header ── */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-4">
                {/* Logo mark */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-13 h-13 w-[52px] h-[52px] rounded-2xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg,rgba(212,165,63,0.35),rgba(212,165,63,0.12))',
                      border: '1.5px solid rgba(212,165,63,0.65)',
                      boxShadow: '0 0 24px rgba(212,165,63,0.25)',
                    }}
                  >
                    <Sparkles size={22} className="text-amber-300" />
                  </div>
                  {/* live dot */}
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-purple-900 animate-pulse" />
                </div>

                {/* Brand name + badge */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <p
                      className="text-white font-extrabold text-xl tracking-tight leading-none"
                      style={{ fontFamily: "'Playfair Display',serif", textShadow: '0 1px 12px rgba(0,0,0,0.4)' }}
                    >
                      Neru Beauty
                    </p>
                    {/* Premium badge */}
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-[0.15em] uppercase text-amber-900 flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg,#FCD34D,#F59E0B)', boxShadow: '0 2px 8px rgba(245,158,11,0.4)' }}
                    >
                      ✦ PREMIUM
                    </span>
                  </div>
                  <p className="text-white/40 text-[10px] tracking-[0.28em] uppercase mt-1.5">Luxury Beauty Studio · Est. 2019</p>
                </div>
              </div>

              {/* gold separator */}
              <div className="h-px" style={{ background: 'linear-gradient(90deg,rgba(212,165,63,0.7),rgba(212,165,63,0.15),transparent)' }} />
            </div>

            {/* ── Centre Content ── */}
            <div className="relative z-10 space-y-7">
              <div>
                {/* Eyebrow label */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-px w-8" style={{ background: 'linear-gradient(90deg,#FCD34D,transparent)' }} />
                  <p className="text-amber-300 text-[10px] font-bold tracking-[0.28em] uppercase">Welcome Back</p>
                </div>

                <h2
                  className="text-[2.4rem] font-extrabold text-white leading-[1.15]"
                  style={{ fontFamily: "'Playfair Display',serif", textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
                >
                  Enhancing Beauty,
                  <br />
                  <span
                    className="text-transparent bg-clip-text"
                    style={{ backgroundImage: 'linear-gradient(100deg,#FCD34D 0%,#F59E0B 50%,#FBBF24 100%)' }}
                  >
                    Creating Confidence
                  </span>
                </h2>

                <p className="text-purple-200/80 mt-4 text-sm leading-relaxed max-w-[300px]">
                  Your beauty journey continues here. Sign in to access your appointments, exclusive offers, and personalised beauty tips.
                </p>
              </div>

              {/* benefits — numbered style */}
              <ul className="space-y-3">
                {benefits.map(({ icon: Icon, text }, i) => (
                  <li key={text} className="flex items-center gap-3.5 group">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                      style={{
                        background: 'rgba(212,165,63,0.15)',
                        border: '1px solid rgba(212,165,63,0.4)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }}
                    >
                      <Icon size={14} className="text-amber-300" />
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-amber-400/50 text-[10px] font-bold flex-shrink-0">0{i + 1}</span>
                      <span className="text-purple-100 text-sm">{text}</span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* divider + quote */}
              <div className="pt-5 border-t border-white/10 space-y-2">
                <div className="flex gap-2">
                  <span className="text-amber-400 text-2xl leading-none mt-[-4px] flex-shrink-0">"</span>
                  <p className="text-purple-200/65 text-xs italic leading-relaxed">
                    We don't just do makeup — we build confidence, one brushstroke at a time.
                  </p>
                </div>
                <div className="flex items-center gap-2 pl-6">
                  <div className="h-px w-6 bg-amber-400/40" />
                  <p className="text-amber-300/65 text-[10px] font-semibold tracking-wide">Neru Priya, Founder</p>
                </div>
              </div>
            </div>

            {/* ── Stats Footer ── */}
            <div className="relative z-10 grid grid-cols-3 gap-2.5">
              {[
                { val: '500+', lbl: 'Happy Clients',  icon: '👩‍🦰' },
                { val: '4.9★', lbl: 'Avg Rating',      icon: '⭐' },
                { val: '5 Yrs', lbl: 'Experience',     icon: '🏆' },
              ].map(({ val, lbl, icon }) => (
                <div
                  key={lbl}
                  className="text-center p-3 rounded-2xl relative overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <p className="text-sm mb-1">{icon}</p>
                  <p className="text-amber-300 font-extrabold text-base leading-none">{val}</p>
                  <p className="text-purple-200/50 text-[9px] mt-1 font-medium tracking-wide">{lbl}</p>
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
