import { useState } from 'react';
import { Link } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail, Sparkles, ArrowRight, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setTimeout(() => {
      setSentEmail(values.email);
      setSent(true);
      setLoading(false);
    }, 1000);
  }

  return (
    <div className="flex h-screen overflow-hidden">

      {/* ── LEFT PANEL ──────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(150deg,#3B0764 0%,#6D28D9 40%,#8B5CF6 75%,#B45309 100%)' }}
      >
        <div className="absolute -top-28 -left-28 w-96 h-96 rounded-full opacity-15" style={{ background: 'radial-gradient(circle,#FCD34D,transparent)' }} />
        <div className="absolute -bottom-36 -right-20 w-[30rem] h-[30rem] rounded-full opacity-10" style={{ background: 'radial-gradient(circle,#F9A8D4,transparent)' }} />
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

        {/* center */}
        <div className="relative z-10 space-y-8">
          <div>
            <p className="text-amber-300 text-xs font-bold tracking-[0.2em] uppercase mb-4">Account Recovery</p>
            <h2 className="text-4xl font-extrabold text-white leading-tight" style={{ fontFamily: "'Playfair Display',serif" }}>
              Forgot Your<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right,#FCD34D,#F59E0B)' }}>
                Password?
              </span>
            </h2>
            <p className="text-purple-200 mt-4 text-sm leading-relaxed max-w-xs">
              No worries! Enter your registered email address and we'll send you a secure link to reset your password in minutes.
            </p>
          </div>

          <ul className="space-y-4">
            {[
              { num: '01', text: 'Enter your registered email address' },
              { num: '02', text: 'Check your inbox for the reset link' },
              { num: '03', text: 'Set a new secure password'            },
            ].map(({ num, text }) => (
              <li key={num} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold text-amber-300"
                  style={{ background: 'rgba(212,165,63,0.2)', border: '1px solid rgba(212,165,63,0.35)' }}
                >
                  {num}
                </div>
                <span className="text-purple-100 text-sm">{text}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-white/15">
            <p className="text-purple-200/70 text-xs italic leading-relaxed">
              "Your security is our priority. Your data is always safe with us."
            </p>
            <p className="text-amber-300/70 text-[10px] mt-2">— Neru Beauty Security Team</p>
          </div>
        </div>

        {/* stats */}
        <div className="relative z-10 grid grid-cols-3 gap-3">
          {[['256-bit','Encryption'],['100%','Secure'],['24/7','Support']].map(([val, lbl]) => (
            <div key={lbl} className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <p className="text-amber-300 font-bold text-lg leading-none">{val}</p>
              <p className="text-purple-200/60 text-[10px] mt-1">{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-[#FDF8F5] px-6 py-14 lg:px-14">
        <div className="w-full max-w-[420px] space-y-8 animate-fade-in">

          {/* mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-bold text-neru-purple" style={{ fontFamily: "'Playfair Display',serif" }}>Neru Beauty</span>
          </div>

          {!sent ? (
            <>
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                  <ShieldCheck size={12} /> Secure Password Reset
                </div>
                <h1 className="text-3xl font-extrabold text-neru-darkGray leading-tight" style={{ fontFamily: "'Playfair Display',serif" }}>
                  Reset Password
                </h1>
                <p className="text-gray-500 text-sm mt-2">Enter your email and we'll send you a reset link</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl text-white font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl hover:shadow-neru-purple/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: loading ? '#7C3AED' : 'linear-gradient(135deg,#7C3AED 0%,#8B5CF6 60%,#B45309 100%)' }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Sending link…
                      </>
                    ) : (
                      <>Send Reset Link <ArrowRight size={15} /></>
                    )}
                  </button>
                </form>
              </Form>

              <div className="flex items-center gap-3 text-xs text-gray-300">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400">Remember your password?</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border-2 border-neru-purple/25 text-neru-purple text-sm font-semibold hover:bg-neru-purple hover:text-white hover:border-neru-purple transition-all duration-200"
              >
                <ArrowLeft size={15} /> Back to Sign In
              </Link>
            </>
          ) : (
            /* ── Success state ── */
            <div className="text-center space-y-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                style={{ background: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)', border: '2px solid #6EE7B7' }}
              >
                <CheckCircle size={40} className="text-emerald-500" />
              </div>

              <div>
                <h1 className="text-3xl font-extrabold text-neru-darkGray leading-tight" style={{ fontFamily: "'Playfair Display',serif" }}>
                  Check Your Email
                </h1>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                  We've sent a password reset link to<br />
                  <span className="font-semibold text-neru-darkGray">{sentEmail}</span>
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-left space-y-2">
                <p className="text-xs font-bold text-blue-800">What to do next:</p>
                <ul className="space-y-1.5 text-xs text-blue-700">
                  {[
                    'Check your inbox (and spam folder)',
                    'Click the reset link in the email',
                    'Create a new secure password',
                  ].map(s => (
                    <li key={s} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => { setSent(false); form.reset(); }}
                className="text-sm text-neru-purple hover:underline font-medium"
              >
                Didn't receive the email? Try again
              </button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border-2 border-neru-purple/25 text-neru-purple text-sm font-semibold hover:bg-neru-purple hover:text-white hover:border-neru-purple transition-all duration-200"
              >
                <ArrowLeft size={15} /> Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
