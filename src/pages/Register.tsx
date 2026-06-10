import { useState } from 'react';
import { Link } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, MapPin,
  Sparkles, ShieldCheck, Star, Calendar, Gift, ArrowRight, Check,
} from 'lucide-react';

/* ─── Schema — UNCHANGED (+ optional address) ────────────────────── */
const formSchema = z.object({
  name:            z.string().min(2,  { message: "Name must be at least 2 characters." }),
  email:           z.string().email({ message: "Please enter a valid email address." }),
  phone:           z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  address:         z.string().optional(),
  password:        z.string().min(6,  { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6,  { message: "Please confirm your password." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

/* ─── Password strength ──────────────────────────────────────────── */
function getStrength(pwd: string) {
  if (!pwd) return { score: 0, label: '', color: '', bars: [false, false, false, false] as boolean[] };
  let s = 0;
  if (pwd.length >= 8)          s++;
  if (/[A-Z]/.test(pwd))        s++;
  if (/[0-9]/.test(pwd))        s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#F87171', '#FBBF24', '#60A5FA', '#34D399'];
  return {
    score: s,
    label: labels[s],
    color: colors[s],
    bars: [s >= 1, s >= 2, s >= 3, s >= 4] as boolean[],
  };
}

/* ─── Why Join cards ─────────────────────────────────────────────── */
const joinReasons = [
  { icon: Calendar,    title: 'Easy Booking',   desc: 'Book appointments 24/7 online in seconds'  },
  { icon: Gift,        title: 'Member Perks',   desc: 'Exclusive discounts & birthday surprises'  },
  { icon: Star,        title: '5-Star Artists', desc: 'Certified makeup pros for every look'      },
  { icon: ShieldCheck, title: 'Privacy Safe',   desc: 'Your data is 100% secure with us'          },
];

const Register = () => {
  const [showPwd,     setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [agreed,      setAgreed]      = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', phone: '', address: '', password: '', confirmPassword: '' },
  });

  const watchedPwd = form.watch('password');
  const strength   = getStrength(watchedPwd);

  /* onSubmit — logic UNCHANGED */
  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setTimeout(() => {
      toast({
        title: 'Registration attempt',
        description: "You've attempted to register. This feature is not fully implemented yet.",
      });
      console.log(values);
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
            className="hidden lg:flex lg:w-[42%] flex-col justify-between p-12 relative overflow-hidden"
            style={{ background: 'linear-gradient(150deg,#3B0764 0%,#6D28D9 40%,#8B5CF6 75%,#B45309 100%)' }}
          >
            {/* decorative blobs */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-15" style={{ background: 'radial-gradient(circle,#FCD34D,transparent)' }} />
            <div className="absolute -bottom-32 -left-16 w-[28rem] h-[28rem] rounded-full opacity-10" style={{ background: 'radial-gradient(circle,#F9A8D4,transparent)' }} />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center opacity-[0.10]" />

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

            {/* headline */}
            <div className="relative z-10 space-y-8">
              <div>
                <p className="text-amber-300 text-xs font-bold tracking-[0.2em] uppercase mb-4">Join the Family</p>
                <h2
                  className="text-4xl font-extrabold text-white leading-tight"
                  style={{ fontFamily: "'Playfair Display',serif" }}
                >
                  Your Beauty,<br />
                  <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right,#FCD34D,#F59E0B)' }}>
                    Our Passion
                  </span>
                </h2>
                <p className="text-purple-200 mt-4 text-sm leading-relaxed max-w-xs">
                  Create your free account today and unlock exclusive beauty offers, priority booking, and personalised care.
                </p>
              </div>

              {/* Why Join grid */}
              <div className="grid grid-cols-2 gap-3">
                {joinReasons.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="rounded-2xl p-4 flex flex-col gap-2"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,165,63,0.2)' }}>
                      <Icon size={13} className="text-amber-300" />
                    </div>
                    <p className="text-white text-xs font-bold">{title}</p>
                    <p className="text-purple-200/60 text-[10px] leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>

              {/* trust indicators */}
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: ShieldCheck, text: 'Secure Registration' },
                  { icon: Lock,        text: 'Privacy Protected'   },
                  { icon: Star,        text: '500+ Happy Members'  },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold text-purple-100"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                  >
                    <Icon size={11} className="text-amber-300" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* bottom quote */}
            <div className="relative z-10 pt-4 border-t border-white/15">
              <p className="text-purple-200/70 text-xs italic leading-relaxed">
                "Every woman deserves to feel beautiful. Join us and let us make that happen."
              </p>
              <p className="text-amber-300/70 text-[10px] mt-1">— Neru Priya, Founder</p>
            </div>
          </div>

          {/* ── RIGHT PANEL ─────────────────────────────────────── */}
          <div className="flex-1 flex items-start justify-center bg-[#FDF8F5] px-6 py-10 lg:px-12 overflow-y-auto">
            <div className="w-full max-w-[460px] space-y-5 animate-fade-in">

              {/* mobile logo */}
              <div className="lg:hidden flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
                  <Sparkles size={14} className="text-white" />
                </div>
                <span className="font-bold text-neru-purple" style={{ fontFamily: "'Playfair Display',serif" }}>Neru Beauty</span>
              </div>

              {/* heading */}
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                  <ShieldCheck size={12} /> Free to Join · No Credit Card
                </div>
                <h1 className="text-3xl font-extrabold text-neru-darkGray leading-tight" style={{ fontFamily: "'Playfair Display',serif" }}>
                  Create Account
                </h1>
                <p className="text-gray-500 text-sm mt-1.5">Join Neru Beauty and start your glow-up journey</p>
              </div>

              {/* form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                  {/* ── Personal Info ── */}
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Personal Information</p>

                  {/* name + phone row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Full Name</label>
                        <FormControl>
                          <div className="relative">
                            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <Input placeholder="Jane Doe" {...field} className="pl-10 h-11 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-2 focus-visible:ring-neru-purple/30 focus-visible:border-neru-purple/50 transition-all" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Phone Number</label>
                        <FormControl>
                          <div className="relative">
                            <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <Input placeholder="+1 234 567 890" {...field} className="pl-10 h-11 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-2 focus-visible:ring-neru-purple/30 focus-visible:border-neru-purple/50 transition-all" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )} />
                  </div>

                  {/* email */}
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Email Address</label>
                      <FormControl>
                        <div className="relative">
                          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <Input placeholder="your@email.com" {...field} className="pl-10 h-11 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-2 focus-visible:ring-neru-purple/30 focus-visible:border-neru-purple/50 transition-all" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />

                  {/* address (optional) */}
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">
                        Address <span className="text-gray-400 normal-case font-normal">(optional)</span>
                      </label>
                      <FormControl>
                        <div className="relative">
                          <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <Input placeholder="123 Beauty Lane, City" {...field} className="pl-10 h-11 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-2 focus-visible:ring-neru-purple/30 focus-visible:border-neru-purple/50 transition-all" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />

                  {/* ── Security ── */}
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 pt-1">Account Security</p>

                  {/* password */}
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Password</label>
                      <FormControl>
                        <div className="relative">
                          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <Input
                            type={showPwd ? 'text' : 'password'}
                            placeholder="Min. 6 characters"
                            {...field}
                            className="pl-10 pr-11 h-11 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-2 focus-visible:ring-neru-purple/30 focus-visible:border-neru-purple/50 transition-all"
                          />
                          <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </FormControl>
                      {watchedPwd && (
                        <div className="mt-2 space-y-1">
                          <div className="flex gap-1">
                            {strength.bars.map((filled, i) => (
                              <div
                                key={i}
                                className="flex-1 h-1 rounded-full transition-all duration-300"
                                style={{ backgroundColor: filled ? strength.color : '#E5E7EB' }}
                              />
                            ))}
                          </div>
                          <p className="text-[10px] font-semibold" style={{ color: strength.color || '#9CA3AF' }}>
                            {strength.label} password
                            {strength.score < 3 && (
                              <span className="text-gray-400 font-normal"> — add uppercase, numbers & symbols</span>
                            )}
                          </p>
                        </div>
                      )}
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />

                  {/* confirm password */}
                  <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Confirm Password</label>
                      <FormControl>
                        <div className="relative">
                          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <Input
                            type={showConfirm ? 'text' : 'password'}
                            placeholder="Re-enter your password"
                            {...field}
                            className="pl-10 pr-11 h-11 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-2 focus-visible:ring-neru-purple/30 focus-visible:border-neru-purple/50 transition-all"
                          />
                          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />

                  {/* T&C */}
                  <label className="flex items-start gap-3 cursor-pointer group mt-1">
                    <div
                      onClick={() => setAgreed(!agreed)}
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border flex-shrink-0 transition-all duration-150 cursor-pointer ${agreed ? 'bg-neru-purple border-neru-purple' : 'border-gray-300 bg-white group-hover:border-neru-purple/50'}`}
                    >
                      {agreed && <Check size={10} className="text-white" />}
                    </div>
                    <span className="text-sm text-gray-600 leading-snug">
                      I agree to the{' '}
                      <a href="#" className="text-neru-purple hover:underline font-medium">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-neru-purple hover:underline font-medium">Privacy Policy</a>
                    </span>
                  </label>

                  {/* submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl text-white font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl hover:shadow-neru-purple/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                    style={{ background: loading ? '#7C3AED' : 'linear-gradient(135deg,#7C3AED 0%,#8B5CF6 60%,#B45309 100%)' }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Creating account…
                      </>
                    ) : (
                      <>Create My Account <ArrowRight size={15} /></>
                    )}
                  </button>
                </form>
              </Form>

              {/* divider */}
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400">Already a member?</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* login CTA */}
              <Link
                to="/login"
                className="block w-full h-12 rounded-xl border-2 border-neru-purple/25 text-neru-purple text-sm font-semibold text-center leading-[46px] hover:bg-neru-purple hover:text-white hover:border-neru-purple transition-all duration-200"
              >
                Sign In Instead
              </Link>

              <p className="text-center text-xs text-gray-400 pb-6">
                Your data is encrypted and never shared with third parties.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
