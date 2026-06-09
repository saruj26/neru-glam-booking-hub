import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  MapPin, Mail, Phone, Clock, MessageSquare, Instagram, Facebook, Twitter,
  ArrowRight, Check, ChevronDown, Sparkles, Heart, Award, Users, Star,
} from 'lucide-react';
import { useState } from 'react';

/* ─── Form schema (unchanged) ────────────────────────────────────────── */
const formSchema = z.object({
  name:    z.string().min(2, { message: "Name must be at least 2 characters."           }),
  email:   z.string().email({ message: "Please enter a valid email address."            }),
  subject: z.string().min(2, { message: "Subject must be at least 2 characters."       }),
  message: z.string().min(10, { message: "Message must be at least 10 characters."     }),
  idea:    z.string().optional(),
});

/* ─── Data ──────────────────────────────────────────────────────────── */
const contactCards = [
  { icon: Phone,        title: 'Call Us',        lines: ['(123) 456-7890', 'Toll-free: 1-800-NERU'],  action: 'tel:+11234567890',    cta: 'Call Now',      color: 'from-violet-500 to-neru-purple' },
  { icon: MessageSquare, title: 'WhatsApp',       lines: ['(123) 456-7890', 'Chat with us anytime'],   action: '#',                   cta: 'Message Us',    color: 'from-emerald-400 to-teal-500'  },
  { icon: Mail,         title: 'Email',           lines: ['info@nerubeauty.com', 'bookings@neru.com'], action: 'mailto:info@neru.com', cta: 'Send Email',    color: 'from-rose-400 to-pink-500'     },
  { icon: MapPin,       title: 'Visit Us',        lines: ['123 Beauty Street', 'Glamour City, GC 12345'], action: '#',               cta: 'Get Directions', color: 'from-amber-400 to-neru-gold'  },
];

const faqs = [
  { q: 'How far in advance should I book?',         a: 'We recommend booking at least 2–4 weeks in advance for regular services. For bridal packages, please book 3–6 months ahead to secure your preferred date.' },
  { q: 'Do I need to pay a deposit to confirm?',    a: 'Yes, a 10% deposit is required to confirm your appointment. The remaining balance is due on the day of your session.' },
  { q: 'Can I request a specific makeup artist?',   a: 'Absolutely! During booking, you can request your preferred artist subject to availability. We always try to accommodate your preference.' },
  { q: 'What if I need to cancel or reschedule?',   a: 'You may reschedule up to 48 hours before your appointment at no charge. Late cancellations may forfeit the deposit.' },
  { q: 'Do you offer a trial session for brides?',  a: 'Yes, all premium bridal packages include a complimentary trial session. It\'s a great way to finalise your wedding-day look before the big day.' },
  { q: 'Are your products safe for sensitive skin?', a: 'All products we use are dermatologist-tested and hypoallergenic. Please inform us of any known allergies before your appointment.' },
];

const teamMembers = [
  { name: 'Neru Priya',    role: 'Founder & Lead Artist', exp: '10+ years', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80', specialty: 'Bridal & Traditional' },
  { name: 'Aanya Sharma',  role: 'Senior Makeup Artist',  exp: '7 years',   image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', specialty: 'Editorial & Photoshoot' },
  { name: 'Meera Kapoor',  role: 'Hair & Makeup Stylist', exp: '5 years',   image: 'https://images.unsplash.com/photo-1619946794135-5bc917a27793?auto=format&fit=crop&w=300&q=80', specialty: 'Reception & Party' },
];

const timeline = [
  { year: '2019', title: 'Founded',           desc: 'Neru Beauty was born with a simple mission — to make every woman feel extraordinary on her special day.'           },
  { year: '2020', title: 'First 100 Clients', desc: 'Within our first year we crossed 100 happy clients and built a reputation for quality and personalised care.'     },
  { year: '2022', title: 'Certified Team',    desc: 'Our full team achieved professional certifications from leading beauty academies across the country.'              },
  { year: '2023', title: '500+ Weddings',     desc: 'We crossed a milestone of 500+ bridal sessions — each one unique, each one unforgettable.'                       },
  { year: '2025', title: 'Premium Studio',    desc: 'Moved to our state-of-the-art studio with private consultation rooms and a dedicated bridal suite.'               },
];

const SH = ({ badge, title, subtitle, light = false }: { badge: string; title: string; subtitle: string; light?: boolean }) => (
  <div className="text-center mb-14">
    <span className={`inline-block text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-4 ${light ? 'text-white/80 bg-white/15' : 'text-neru-purple bg-neru-purple/10'}`}>{badge}</span>
    <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${light ? 'text-white' : 'text-neru-darkGray'}`}>{title}</h2>
    <p className={`max-w-2xl mx-auto text-base leading-relaxed ${light ? 'text-white/70' : 'text-gray-500'}`}>{subtitle}</p>
  </div>
);

/* ─── FAQ Item ──────────────────────────────────────────────────────── */
const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white hover:border-neru-purple/30 transition-colors duration-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
      >
        <span className="font-semibold text-neru-darkGray text-sm pr-4">{q}</span>
        <ChevronDown size={18} className={`text-neru-purple flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
};

/* ─── Page ──────────────────────────────────────────────────────────── */
const Contact = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', subject: '', message: '', idea: '' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({ title: 'Message sent!', description: "Thank you for reaching out. We'll respond soon." });
    console.log(values);
    form.reset();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">

        {/* ── Contact Hero ─────────────────────────────────────── */}
        <section className="relative overflow-hidden py-24 md:py-32" style={{ background: 'linear-gradient(135deg,#4C1D95 0%,#6D28D9 50%,#8B5CF6 100%)' }}>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-10" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-neru-gold/10 blur-3xl" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-white/70 bg-white/15 px-4 py-1.5 rounded-full mb-6">Get In Touch</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
              We'd Love to <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right,#FCD34D,#F59E0B)' }}>Hear from You</span>
            </h1>
            <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
              Whether you want to book an appointment, ask a question, or simply say hello — our team is always here for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-white/70">
              {['Responds within 2 hours', 'Available Mon–Sat', 'Friendly expert team'].map(t => (
                <span key={t} className="flex items-center gap-2"><Check size={13} className="text-neru-gold" />{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact Cards ─────────────────────────────────────── */}
        <section className="py-14 bg-neru-lightGray">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {contactCards.map(({ icon: Icon, title, lines, action, cta, color }) => (
                <div key={title} className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-gray-100 flex flex-col">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-bold text-neru-darkGray mb-2">{title}</h3>
                  {lines.map(l => <p key={l} className="text-gray-500 text-sm">{l}</p>)}
                  <a href={action} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-neru-purple hover:gap-3 transition-all duration-200">
                    {cta} <ArrowRight size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Business Hours strip ──────────────────────────────── */}
        <section className="bg-neru-darkGray py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              {[
                { day: 'Mon – Fri', time: '9:00 AM – 8:00 PM' },
                { day: 'Saturday',  time: '9:00 AM – 6:00 PM' },
                { day: 'Sunday',    time: 'By Appointment'     },
              ].map(({ day, time }) => (
                <div key={day} className="flex items-center gap-3 text-white">
                  <Clock size={14} className="text-neru-gold flex-shrink-0" />
                  <span className="text-white/60">{day}</span>
                  <span className="font-semibold">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Form + Info + Map ─────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

              {/* Form — existing logic unchanged */}
              <div className="lg:col-span-3 bg-white shadow-lg rounded-2xl p-8 border border-gray-100 animate-fade-in">
                <h2 className="text-2xl font-bold text-neru-darkGray mb-2">Send Us a Message</h2>
                <p className="text-gray-500 text-sm mb-7">Fill out the form and we'll get back to you within 2 hours.</p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">Your Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Doe" {...field} className="h-11 rounded-xl border-gray-200 focus-visible:ring-neru-purple/40 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="example@email.com" {...field} className="h-11 rounded-xl border-gray-200 focus-visible:ring-neru-purple/40 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="subject" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Your message subject" {...field} className="h-11 rounded-xl border-gray-200 focus-visible:ring-neru-purple/40 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Your Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Type your message here..." {...field} className="rounded-xl border-gray-200 min-h-[110px] focus-visible:ring-neru-purple/40 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="idea" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Share Your Ideas <span className="font-normal text-gray-400">(Optional)</span></FormLabel>
                        <FormControl>
                          <Textarea placeholder="Have a makeup idea or special request? Tell us!" {...field} className="rounded-xl border-gray-200 min-h-[90px] focus-visible:ring-neru-purple/40 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full h-12 rounded-xl text-white font-semibold text-sm hover:shadow-lg hover:shadow-neru-purple/25 transition-all" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
                      Send Message
                    </Button>
                  </form>
                </Form>
              </div>

              {/* Info + Social */}
              <div className="lg:col-span-2 space-y-6">
                {/* Map placeholder */}
                <div className="h-52 bg-neru-lightGray rounded-2xl overflow-hidden relative">
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <MapPin size={32} className="text-neru-purple mb-2" />
                    <p className="font-semibold text-neru-darkGray">123 Beauty Street</p>
                    <p className="text-sm">Glamour City, GC 12345</p>
                    <a href="#" className="mt-3 text-xs text-neru-purple font-semibold hover:underline">Open in Maps →</a>
                  </div>
                </div>

                {/* Social */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-neru-darkGray mb-4">Connect With Us</h3>
                  <div className="flex items-center gap-3">
                    {[
                      { icon: Instagram, label: 'Instagram', href: '#', color: 'hover:bg-pink-500'    },
                      { icon: Facebook,  label: 'Facebook',  href: '#', color: 'hover:bg-blue-600'   },
                      { icon: Twitter,   label: 'Twitter',   href: '#', color: 'hover:bg-sky-500'     },
                    ].map(({ icon: Icon, label, href, color }) => (
                      <a key={label} href={href} aria-label={label}
                        className={`w-11 h-11 rounded-xl bg-neru-lightGray flex items-center justify-center text-neru-purple ${color} hover:text-white hover:scale-110 transition-all duration-200`}>
                        <Icon size={18} />
                      </a>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs mt-4">Follow us for daily beauty tips and exclusive offers.</p>
                </div>

                {/* Quick booking card */}
                <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6,#B45309)' }}>
                  <Sparkles size={24} className="text-neru-gold mb-3" />
                  <h3 className="font-bold text-lg mb-2">Ready to Book?</h3>
                  <p className="text-white/80 text-sm mb-4">Skip the form — go straight to our booking page and reserve your slot now.</p>
                  <Link to="/booking" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-neru-darkGray bg-neru-gold rounded-full hover:bg-amber-400 transition-colors">
                    Book Appointment <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="py-20 bg-neru-lightGray">
          <div className="container mx-auto px-4">
            <SH badge="FAQ" title="Frequently Asked Questions" subtitle="Everything you need to know about our services, bookings, and beauty experience." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {faqs.map(faq => <FAQItem key={faq.q} {...faq} />)}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            ABOUT US SECTION
            ════════════════════════════════════════════════════════ */}

        {/* ── Our Story ────────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=700&q=80" alt="Our Story" className="rounded-3xl shadow-2xl w-full aspect-[4/5] object-cover" />
                <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl p-5 w-44">
                  <p className="text-3xl font-black text-neru-purple">5+</p>
                  <p className="text-xs text-gray-500 mt-0.5">Years of Excellence</p>
                  <div className="flex mt-2">{Array.from({length:5}).map((_,i) => <Star key={i} size={12} className="fill-neru-gold text-neru-gold" />)}</div>
                </div>
              </div>
              <div>
                <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-neru-purple bg-neru-purple/10 px-4 py-1.5 rounded-full mb-5">Our Story</span>
                <h2 className="text-3xl md:text-4xl font-bold text-neru-darkGray mb-5 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Born from a <span className="text-neru-purple">Passion</span> for Beauty
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Neru Beauty was founded in 2019 with a simple but powerful belief: every woman deserves to feel extraordinary on her most special days. What started as a one-artist studio has grown into a full-service beauty brand trusted by hundreds of clients across the city.
                </p>
                <p className="text-gray-600 mb-7 leading-relaxed">
                  Our founder, Neru Priya, trained under award-winning makeup artists and brought that expertise home — creating a space where artistry meets warmth, and where every client feels like the most beautiful version of herself.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[{val:'500+',lbl:'Clients'},{val:'5★',lbl:'Rating'},{val:'120+',lbl:'Weddings'}].map(({val,lbl})=>(
                    <div key={lbl} className="text-center p-4 bg-neru-lightGray rounded-2xl">
                      <p className="text-2xl font-black text-neru-purple">{val}</p>
                      <p className="text-xs text-gray-500 mt-1">{lbl}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Mission / Vision / Philosophy ────────────────────── */}
        <section className="py-20 bg-gradient-to-br from-neru-lightGray to-neru-pink/20">
          <div className="container mx-auto px-4">
            <SH badge="Who We Are" title="Our Mission, Vision & Philosophy" subtitle="The values that guide every brush stroke, every appointment, and every client interaction." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Heart,   title: 'Our Mission',     color: 'from-rose-400 to-pink-500',     bg: 'bg-rose-50',   text: 'To empower every woman to look and feel her absolute best on her most memorable occasions, using professional artistry and premium products that honour her natural beauty.' },
                { icon: Sparkles, title: 'Our Vision',     color: 'from-violet-500 to-neru-purple', bg: 'bg-violet-50', text: 'To be the most trusted and celebrated beauty brand in the region — known for consistency, creativity, and an unwavering commitment to client satisfaction.' },
                { icon: Award,   title: 'Our Philosophy',  color: 'from-amber-400 to-neru-gold',   bg: 'bg-amber-50',  text: 'Beauty is not one-size-fits-all. We celebrate diversity — every skin tone, every face shape, every style. Our art begins with listening to you.' },
              ].map(({ icon: Icon, title, color, bg, text }) => (
                <div key={title} className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-gray-100">
                  <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-5`}>
                    <div className={`w-6 h-6 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center`}>
                      <Icon size={13} className="text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-neru-darkGray text-lg mb-3">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Our Team ─────────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <SH badge="Meet the Team" title="The Artists Behind Your Look" subtitle="Passionate, certified, and deeply committed to making you feel beautiful — meet the Neru Beauty team." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {teamMembers.map(({ name, role, exp, image, specialty }) => (
                <div key={name} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-gray-100">
                  <div className="relative h-60 overflow-hidden">
                    <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-neru-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{exp} Experience</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-neru-darkGray">{name}</h3>
                    <p className="text-neru-purple text-sm font-medium mt-0.5">{role}</p>
                    <p className="text-gray-400 text-xs mt-2 flex items-center gap-1.5"><Sparkles size={11} />{specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Journey Timeline ──────────────────────────────────── */}
        <section className="py-20 bg-neru-lightGray">
          <div className="container mx-auto px-4">
            <SH badge="Our Journey" title="The Neru Beauty Timeline" subtitle="From a one-artist studio to a premium brand — every milestone brought us closer to our mission." />
            <div className="max-w-3xl mx-auto relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-neru-purple/20" />
              <div className="space-y-8">
                {timeline.map(({ year, title, desc }, i) => (
                  <div key={year} className="relative flex gap-6 items-start">
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center z-10 shadow-sm" style={{ background: i === timeline.length - 1 ? 'linear-gradient(135deg,#7C3AED,#8B5CF6)' : 'white', border: i === timeline.length - 1 ? 'none' : '2px solid #EDE9FE' }}>
                      <span className={`text-sm font-black ${i === timeline.length - 1 ? 'text-white' : 'text-neru-purple'}`}>{year}</span>
                    </div>
                    <div className="bg-white rounded-2xl p-5 flex-1 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <h3 className="font-bold text-neru-darkGray mb-1">{title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Awards & Trust ────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <SH badge="Recognition" title="Awards & Why Clients Trust Us" subtitle="Our work speaks for itself — but these recognitions remind us why we do what we do every day." />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto mb-14">
              {[
                { icon: Award,  label: 'Best Bridal Salon 2024',      sub: 'City Beauty Awards'    },
                { icon: Star,   label: '4.9★ Average Rating',         sub: 'Across all platforms'  },
                { icon: Users,  label: '500+ Happy Clients',          sub: 'And counting'           },
                { icon: Heart,  label: '100% Satisfaction',           sub: 'Our promise to you'     },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="group text-center p-6 rounded-2xl bg-neru-lightGray hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100">
                  <div className="w-12 h-12 rounded-2xl bg-neru-purple/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon size={22} className="text-neru-purple" />
                  </div>
                  <p className="font-bold text-neru-darkGray text-sm">{label}</p>
                  <p className="text-gray-400 text-xs mt-1">{sub}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link to="/booking" className="inline-flex items-center gap-2 px-9 py-4 text-base font-semibold text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
                Book Your Appointment <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Contact;
