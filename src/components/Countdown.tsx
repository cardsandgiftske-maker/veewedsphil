import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Calendar, Bell, Sparkles, Heart } from 'lucide-react';
import { WEDDING_DATE, WEDDING_DETAILS } from '../data';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = WEDDING_DATE.getTime() - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isPassed: false,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  // Generate Google Calendar Link
  const googleCalendarUrl = () => {
    const title = encodeURIComponent("Venessa & Philemon's Wedding");
    const details = encodeURIComponent("Join us in celebrating the holy matrimony of Venessa Kerubo & Philemon Araka.");
    const location = encodeURIComponent(`${WEDDING_DETAILS.ceremony.venue} & ${WEDDING_DETAILS.reception.venue}, Nairobi, Kenya`);
    // 25th October 2026 from 10:00 AM to 6:00 PM EAT (UTC+3 -> 07:00 UTC to 15:00 UTC)
    const dates = "20261025T070000Z/20261025T150000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  return (
    <section 
      id="countdown-section" 
      className="relative py-20 md:py-24 bg-gradient-to-b from-[#FCFAF7] via-[#F8F4EE] to-[#FCFAF7] border-y border-stone-200/60 overflow-hidden select-none"
    >
      {/* Background ambient lighting in burgundy, navy and gold */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-16 left-1/4 w-96 h-96 rounded-full bg-[#8B1E3F]/10 blur-[90px]" />
        <div className="absolute -bottom-16 right-1/4 w-96 h-96 rounded-full bg-[#002147]/10 blur-[90px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#D4AF37]/10 blur-[80px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 max-w-5xl text-center">
        {/* Section Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#002147] border border-[#D4AF37]/70 shadow-sm mb-4"
        >
          <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-amber-200">
            FLIGHT NO. VP-1025 // BOARDING COUNTDOWN
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        </motion.div>

        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight mb-2"
        >
          Until We Say “I Do”
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-3"
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-mono text-xs sm:text-sm text-stone-600 max-w-xl mx-auto mb-10 tracking-wider uppercase"
        >
          DEPARTURE: SUNDAY, 25TH OCTOBER 2026 • GATE: SDA NAIROBI SOUTH
        </motion.p>

        {/* Countdown Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-3xl mx-auto mb-10"
        >
          {/* Days - Strawberrish Burgundy with Gold Accent */}
          <div className="relative group bg-white rounded-3xl p-5 sm:p-7 border-2 border-[#8B1E3F]/30 shadow-[0_10px_25px_rgba(139,30,63,0.06)] hover:border-[#8B1E3F] hover:shadow-[0_12px_30px_rgba(139,30,63,0.12)] transition-all">
            <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
            <div className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#8B1E3F] tracking-tight">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-[0.2em] text-stone-500 mt-2">
              Days
            </div>
            <div className="text-[9px] font-serif italic text-[#8B1E3F] mt-1">To Go</div>
          </div>

          {/* Hours - Deep Navy Blue with Gold Accent */}
          <div className="relative group bg-gradient-to-b from-white to-[#F0F4FA] rounded-3xl p-5 sm:p-7 border-2 border-[#002147]/40 shadow-[0_10px_25px_rgba(0,33,71,0.08)] hover:border-[#002147] hover:shadow-[0_12px_30px_rgba(0,33,71,0.15)] transition-all">
            <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
            <div className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#002147] tracking-tight">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#002147]/80 mt-2">
              Hours
            </div>
            <div className="text-[9px] font-serif italic text-[#002147] mt-1">Joyful Hours</div>
          </div>

          {/* Minutes - Warm Metallic Gold with Navy Accent */}
          <div className="relative group bg-gradient-to-b from-white to-[#FDFBF7] rounded-3xl p-5 sm:p-7 border-2 border-[#D4AF37]/60 shadow-[0_10px_25px_rgba(212,175,55,0.1)] hover:border-[#D4AF37] hover:shadow-[0_12px_30px_rgba(212,175,55,0.2)] transition-all">
            <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#002147]" />
            <div className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#B8860B] tracking-tight">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#B8860B] mt-2">
              Minutes
            </div>
            <div className="text-[9px] font-serif italic text-[#B8860B] mt-1">Sweet Mins</div>
          </div>

          {/* Seconds - Live Pulsing Indicator in Navy */}
          <div className="relative group bg-white rounded-3xl p-5 sm:p-7 border-2 border-stone-200/90 shadow-[0_10px_25px_rgba(0,0,0,0.04)] hover:border-[#002147]/60 transition-all">
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
            <div className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#002147] tracking-tight">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-[0.2em] text-stone-500 mt-2">
              Seconds
            </div>
            <div className="text-[9px] font-serif italic text-stone-500 mt-1">Live Tick</div>
          </div>
        </motion.div>

        {/* Action Button: Add to Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href={googleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#002147] hover:bg-[#081b3a] border-2 border-[#D4AF37] text-amber-100 font-sans font-bold text-xs uppercase tracking-widest rounded-full shadow-[0_4px_18px_rgba(0,33,71,0.25)] hover:shadow-[0_6px_22px_rgba(212,175,55,0.35)] transition-all active:scale-95 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
            <span>Add to Google Calendar</span>
          </a>

          <div className="text-[11px] text-[#002147] font-sans font-semibold flex items-center gap-1.5 px-3 py-2 bg-white/80 border border-[#D4AF37]/30 rounded-full shadow-xs">
            <Heart className="w-3.5 h-3.5 text-[#8B1E3F] fill-[#8B1E3F]" />
            <span>Ceremony starts promptly at 10:00 AM</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
