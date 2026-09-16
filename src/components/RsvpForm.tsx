import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, CheckCircle2, AlertCircle, Sparkles, User, Phone, Check, Heart, QrCode, Ticket } from 'lucide-react';
import { RsvpGuest } from '../types';
import { WEDDING_DETAILS } from '../data';
import { saveRsvp, isFirebaseConfigured } from '../lib/firebase';
import RsvpPassModal from './RsvpPassModal';

export default function RsvpForm() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [willAttend, setWillAttend] = useState<'yes' | 'no'>('yes');
  const [adultsCount, setAdultsCount] = useState(1);
  const [notes, setNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [submittedGuest, setSubmittedGuest] = useState<RsvpGuest | null>(null);
  const [showPassModal, setShowPassModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Floating button state
  const [showFloatingBtn, setShowFloatingBtn] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const rsvpSection = document.getElementById('rsvp-section');
      if (rsvpSection) {
        const rect = rsvpSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setShowFloatingBtn(false);
        } else {
          setShowFloatingBtn(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('Please enter your phone number.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter your email address to receive your Digital Pass.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const newGuest: RsvpGuest = {
        id: 'rsvp-' + Date.now(),
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim() || undefined,
        willAttend,
        adultsCount: willAttend === 'yes' ? adultsCount : 0,
        submittedAt: new Date().toISOString(),
        notes: notes.trim() || undefined,
      };

      await saveRsvp(newGuest);

      // Attempt sending confirmation email if email is provided
      if (email.trim()) {
        try {
          await fetch('/api/send-rsvp-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              guest: newGuest,
              emailAddress: email.trim(),
            }),
          });
        } catch (e) {
          console.warn('Could not post to /api/send-rsvp-email:', e);
        }
      }

      setSubmittedGuest(newGuest);
      setShowPassModal(true);
      setLoading(false);

      setFullName('');
      setPhoneNumber('');
      setEmail('');
      setWillAttend('yes');
      setAdultsCount(1);
      setNotes('');

      window.dispatchEvent(new Event('rsvp_database_updated'));
    } catch (err) {
      setErrorMessage('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const scrollToRsvp = () => {
    const element = document.getElementById('rsvp-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="relative py-24 bg-[#FCFAF7] text-stone-850" id="rsvp-section">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-maroon-500/[0.015] via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#002147] border border-[#D4AF37]/80 text-amber-200 text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase mb-3 shadow-sm">
              <Ticket className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>PASSPORT CONTROL // BOARDING CLEARANCE</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-light text-stone-900 mt-2 mb-4">Confirm Attendance</h2>
            <div className="w-28 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
            <p className="text-stone-700 text-sm md:text-base mt-4 max-w-xl mx-auto italic font-serif leading-relaxed">
              Kindly register your clearance by 10th October to receive your official personalized Digital Wedding Pass and QR entry code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            {/* Form Column */}
            <div className="md:col-span-6 bg-white border-2 border-[#D4AF37]/30 p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,33,71,0.06)] relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl text-stone-900 flex items-center gap-2 font-medium">
                  <Mail className="w-5 h-5 text-[#002147]" />
                  <span>Passenger Clearance Form</span>
                </h3>
                {isFirebaseConfigured ? (
                  <span className="flex items-center gap-1.5 text-[9px] text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider shadow-sm">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" />
                    <span>Cloud Synced</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[9px] text-[#002147] bg-[#002147]/5 border border-[#D4AF37]/40 px-2.5 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                    <span>Local Database</span>
                  </span>
                )}
              </div>

              <form onSubmit={handleRsvpSubmit} className="space-y-5" id="rsvp-wedding-form">
                {/* Full Name input */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-widest text-stone-500 font-sans font-bold flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>Full Name <span className="text-rose-600">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Venessa & Philemon Guest"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-stone-50/50 border border-stone-200 focus:border-[#002147] focus:ring-1 focus:ring-[#002147]/20 rounded-xl px-4 py-3 text-sm text-stone-800 outline-none transition-all"
                  />
                </div>

                {/* Phone Number input */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-widest text-stone-500 font-sans font-bold flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>Phone Number <span className="text-rose-600">*</span></span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0711910037"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-stone-50/50 border border-stone-200 focus:border-[#002147] focus:ring-1 focus:ring-[#002147]/20 rounded-xl px-4 py-3 text-sm text-stone-800 outline-none transition-all"
                  />
                </div>

                {/* Email Address input for Digital Pass */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-widest text-stone-500 font-sans font-bold flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    <span>Email Address <span className="text-rose-600">*</span></span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. guest@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-50/50 border border-stone-200 focus:border-[#002147] focus:ring-1 focus:ring-[#002147]/20 rounded-xl px-4 py-3 text-sm text-stone-800 outline-none transition-all"
                  />
                </div>

                {/* Will Attend toggle radio */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-widest text-stone-500 font-sans font-bold block">
                    Will you attend?
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setWillAttend('yes')}
                      className={`flex-1 py-3 px-3 text-xs uppercase tracking-wider font-sans font-bold border rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        willAttend === 'yes'
                          ? 'bg-[#002147] border-[#002147] text-amber-100 shadow-md'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <Check className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                      <span>Yes, with pleasure!</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWillAttend('no')}
                      className={`py-2 px-2.5 text-[10px] uppercase tracking-wide font-sans font-medium border rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer shrink-0 ${
                        willAttend === 'no'
                          ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm font-semibold'
                          : 'bg-stone-50/80 border-stone-200/80 text-stone-400 hover:text-stone-600'
                      }`}
                      title="Decline attendance"
                    >
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>Regretfully decline</span>
                    </button>
                  </div>
                </div>

                {/* Custom Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-widest text-stone-500 font-sans font-bold block">
                    Warm Messages / Well Wishes
                  </label>
                  <textarea
                    placeholder="Send a heartfelt message to Venessa & Philemon..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full bg-stone-50/50 border border-stone-200 focus:border-[#002147] focus:ring-1 focus:ring-[#002147]/20 rounded-xl px-4 py-3 text-sm text-stone-800 outline-none transition-all resize-none"
                  />
                </div>

                {/* Errors display */}
                {errorMessage && (
                  <div className="p-3.5 bg-rose-50 border border-rose-250 rounded-xl flex items-center gap-2.5 text-xs text-rose-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#002147] hover:bg-[#081b3a] border-2 border-[#D4AF37] active:scale-98 disabled:opacity-50 text-amber-100 font-sans font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_18px_rgba(0,33,71,0.25)] hover:shadow-[0_6px_22px_rgba(212,175,55,0.35)]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span>Submit RSVP</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Confirmation & Direct Call Column */}
            <div className="md:col-span-6 flex flex-col items-center">
              <AnimatePresence mode="wait">
                {submittedGuest ? (
                  /* Success Card */
                  <motion.div
                    key="success-card-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-[360px] bg-gradient-to-b from-white to-[#FCFAF7] border-2 border-[#D4AF37]/50 rounded-3xl p-6 shadow-md relative flex flex-col overflow-hidden text-center"
                  >
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#002147] to-transparent" />

                    <div className="flex flex-col items-center mb-5 pb-5 border-b border-stone-100">
                      <div className="w-12 h-12 bg-green-50 border border-green-200 text-green-700 rounded-full flex items-center justify-center mb-3">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="font-sans font-bold uppercase text-xs tracking-widest text-green-800">RSVP Confirmed!</h4>
                      <p className="text-xs text-stone-600 font-serif mt-1">
                        Thank you, <span className="font-semibold text-stone-900">{submittedGuest.fullName}</span>!
                      </p>
                    </div>

                    <div className="space-y-4 my-2">
                      <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4 text-center">
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest font-sans font-bold">Attendance Status</p>
                        <p className="font-serif text-base text-[#002147] font-semibold mt-0.5">
                          {submittedGuest.willAttend === 'yes' ? 'Attending with pleasure' : 'Regretfully decline'}
                        </p>
                      </div>

                      <button
                        onClick={() => setShowPassModal(true)}
                        className="w-full py-3 px-4 bg-[#002147] hover:bg-[#081b3a] border border-[#D4AF37]/70 text-amber-100 font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                      >
                        <Ticket className="w-4 h-4 text-[#D4AF37]" />
                        <span>View Official Wedding Pass</span>
                      </button>

                      {submittedGuest.notes && (
                        <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4 text-center italic font-serif text-xs text-stone-700">
                          “{submittedGuest.notes}”
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 text-center text-[11px] text-stone-500 space-y-2">
                      <p>We look forward to celebrating together!</p>
                      <button
                        onClick={() => setSubmittedGuest(null)}
                        className="text-[#002147] hover:underline font-semibold block mx-auto cursor-pointer"
                      >
                        Submit another RSVP
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Standard Info Card */
                  <motion.div
                    key="standard-info-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full max-w-[360px] bg-white border-2 border-[#D4AF37]/30 shadow-md rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-5 relative overflow-hidden"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#002147] border-2 border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-sm">
                      <Heart className="w-7 h-7 text-[#D4AF37] fill-[#D4AF37]/30" />
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-serif text-lg text-stone-850 font-semibold">Join Our Celebration</h4>
                      <p className="text-xs text-stone-600 font-serif leading-relaxed max-w-[250px] mx-auto">
                        Please fill out the form to confirm your attendance for Venessa &amp; Philemon’s wedding celebration.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-stone-100 w-full text-[10px] text-[#002147] uppercase tracking-widest font-sans font-bold">
                      Kindly RSVP by 10th October
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <AnimatePresence>
        {showFloatingBtn && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 pointer-events-auto"
            id="floating-rsvp-button-wrapper"
          >
            <button
              onClick={scrollToRsvp}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-[#002147] hover:bg-[#081b3a] border-2 border-[#D4AF37] text-amber-100 font-sans font-bold text-xs uppercase tracking-wider rounded-full shadow-[0_6px_25px_rgba(0,33,71,0.4)] active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37] animate-spin" style={{ animationDuration: '4s' }} />
              <span>Confirm Attendance</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Official Wedding Email Pass Modal */}
      <AnimatePresence>
        {showPassModal && submittedGuest && (
          <RsvpPassModal 
            guest={submittedGuest} 
            onClose={() => setShowPassModal(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}

