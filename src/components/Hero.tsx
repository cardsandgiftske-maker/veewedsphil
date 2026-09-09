import React from 'react';
import { motion } from 'motion/react';
import { Heart, Calendar, MapPin, Clock, Sparkles } from 'lucide-react';
import { WEDDING_DETAILS } from '../data';
import Crest from './Crest';

export default function Hero() {

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FCFAF7] text-stone-850 py-16" id="hero-section">
      {/* Background Image with Theme Color Wash Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/src/assets/images/carol_and_john_portrait_1784461506194.jpg"
          alt="Venessa and Philemon Portrait"
          className="w-full h-full object-cover object-center opacity-[0.16] scale-105 filter brightness-[1.02] contrast-[0.98]"
          referrerPolicy="no-referrer"
        />
        {/* Subtle theme color ambient glows */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-[#8B1E3F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-20 w-96 h-96 bg-[#002147]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Passport Guilloche Security Line Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.035] pointer-events-none" 
          style={{ 
            backgroundImage: `radial-gradient(#8B1E3F 1px, transparent 1px), radial-gradient(#002147 1px, #FCFAF7 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }} 
        />

        {/* Elegant warm radial and gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FCFAF7] via-[#FCFAF7]/90 to-[#FCFAF7]/60" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#FCFAF7]/50 to-[#FCFAF7]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center max-w-4xl pt-6">
        {/* Passport Top Header Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl flex items-center justify-between border-b border-dashed border-[#D4AF37]/60 pb-2 mb-8 text-[10px] sm:text-[11px] font-mono tracking-wider text-stone-500 uppercase"
        >
          <span className="flex items-center gap-1.5 text-[#8B1E3F] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#8B1E3F]" />
            PASSPORT: REPUBLIC OF LOVE
          </span>
          <span className="font-semibold text-stone-700">PAGE 02 // BIODATA</span>
          <span className="text-[#002147] font-bold">DOC NO: VP-2026-1025</span>
        </motion.div>

        {/* Elegant Crest with subtle passport security halo */}
        <div className="relative mb-6">
          <Crest size="md" />

          {/* Authentic Tilted Passport Entry Stamp */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -25 }}
            animate={{ opacity: 1, scale: 1, rotate: -12 }}
            transition={{ duration: 0.8, delay: 0.7, type: 'spring', bounce: 0.4 }}
            className="absolute -top-3 -right-8 sm:-right-16 select-none pointer-events-none z-20"
          >
            <div className="w-28 sm:w-32 h-28 sm:h-32 rounded-full border-2 border-dashed border-[#8B1E3F]/80 p-1 flex items-center justify-center shadow-xs bg-white/40 backdrop-blur-[1px]">
              <div className="w-full h-full rounded-full border border-[#8B1E3F]/70 flex flex-col items-center justify-center p-2 text-center text-[#8B1E3F]">
                <span className="text-[7px] tracking-[0.2em] font-bold uppercase font-sans">REPUBLIC OF LOVE</span>
                <span className="text-[10px] font-serif font-black tracking-widest my-0.5 text-[#8B1E3F]">ENTRY VISA</span>
                <span className="text-[8px] font-mono font-bold tracking-tight bg-[#8B1E3F]/10 px-1.5 py-0.5 rounded">25 OCT 2026</span>
                <span className="text-[7px] tracking-wider uppercase font-sans mt-0.5">NAIROBI • KENYA</span>
                <span className="text-[6px] tracking-widest text-emerald-700 font-bold uppercase mt-0.5">★ APPROVED ★</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature tagline badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#002147]/10 via-[#8B1E3F]/10 to-[#D4AF37]/20 border border-[#D4AF37]/60 text-[#002147] text-xs font-serif italic mb-4 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="font-semibold">{WEDDING_DETAILS.couple.featureHeadline}</span>
        </motion.div>

        {/* Family invitation text block */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-stone-600 font-serif leading-relaxed text-sm sm:text-base max-w-2xl mx-auto mb-6 px-2"
        >
          <p className="italic">
            With grateful hearts and our families' blessings,
          </p>
          <p className="text-base sm:text-lg md:text-xl text-stone-900 font-serif mt-2.5 font-bold tracking-wide">
            {WEDDING_DETAILS.families.brideFamily}
          </p>
          <p className="text-sm sm:text-base text-[#D4AF37] font-serif italic my-1 font-bold">&amp;</p>
          <p className="text-base sm:text-lg md:text-xl text-stone-900 font-serif font-bold tracking-wide">
            {WEDDING_DETAILS.families.groomFamily}
          </p>
          <p className="italic text-stone-600 text-xs sm:text-sm mt-2">
            joyfully invite you to witness as
          </p>
        </motion.div>

        {/* Main Couple Names with Theme Colors */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-light tracking-tight mb-4"
        >
          <span className="block mb-1 md:inline md:mb-0 text-[#8B1E3F] font-semibold drop-shadow-sm">{WEDDING_DETAILS.couple.bride}</span>
          <span className="font-serif text-[#D4AF37] mx-3 text-3xl sm:text-4xl md:text-5xl italic font-normal">&amp;</span>
          <span className="block mt-1 md:inline md:mt-0 text-[#002147] font-semibold drop-shadow-sm">{WEDDING_DETAILS.couple.groom}</span>
        </motion.h1>

        {/* Hashtag / Nickname */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-[#002147] font-sans text-xs tracking-widest font-extrabold uppercase mb-6 flex items-center justify-center gap-2"
        >
          <span className="w-8 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          <span className="text-[#8B1E3F]">#{WEDDING_DETAILS.couple.nickname}</span>
          <span className="w-8 h-px bg-gradient-to-l from-transparent via-[#D4AF37] to-transparent" />
        </motion.div>

        {/* Request presence string */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-stone-700 font-serif tracking-wide text-sm md:text-base mb-8 max-w-xl mx-auto leading-relaxed italic"
        >
          unite in holy matrimony and celebrate their new beginning before God and beloved guests.
        </motion.p>

        {/* Key Event Summary Pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-stone-700 font-sans text-xs sm:text-sm font-medium mb-8 bg-white/95 backdrop-blur-sm border-2 border-[#D4AF37]/40 px-6 py-3.5 rounded-2xl shadow-[0_4px_16px_rgba(0,33,71,0.05)]"
        >
          <div className="flex items-center gap-1.5 text-[#8B1E3F] font-semibold">
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
            <span>Sunday, 25th October 2026</span>
          </div>
          <span className="hidden sm:inline text-[#D4AF37] font-bold">•</span>
          <div className="flex items-center gap-1.5 text-[#002147] font-bold">
            <Clock className="w-4 h-4 text-[#D4AF37]" />
            <span>{WEDDING_DETAILS.ceremony.time}</span>
          </div>
          <span className="hidden sm:inline text-[#D4AF37] font-bold">•</span>
          <div className="flex items-center gap-1.5 text-stone-800 font-medium">
            <MapPin className="w-4 h-4 text-[#002147]" />
            <span>{WEDDING_DETAILS.ceremony.venue}</span>
          </div>
        </motion.div>

        {/* Biblical Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="max-w-md mx-auto mb-8 text-stone-700 italic font-serif text-sm md:text-base border-y-2 border-[#D4AF37]/45 py-4"
        >
          <p className="mb-1.5 leading-relaxed">“{WEDDING_DETAILS.bibleVerses[0].text}”</p>
          <p className="text-[#002147] text-xs tracking-wider uppercase font-sans font-bold not-italic flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>{WEDDING_DETAILS.bibleVerses[0].reference}</span>
          </p>
        </motion.div>

        {/* Passport Machine-Readable Zone (MRZ) Footer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="w-full max-w-xl bg-white/90 backdrop-blur-xs border-2 border-dashed border-[#D4AF37]/60 rounded-xl p-3.5 select-none text-left overflow-x-auto shadow-sm"
        >
          <div className="flex items-center justify-between text-[8px] font-sans font-bold uppercase tracking-widest text-[#002147] mb-1.5">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              OFFICIAL BIODATA CODE // ICAO DOC 9303
            </span>
            <span className="text-[#8B1E3F]">CLASS: SACRED UNION</span>
          </div>
          <div className="font-mono text-[10px] sm:text-[11px] leading-tight text-stone-700 tracking-[0.22em] sm:tracking-[0.28em] whitespace-nowrap font-medium">
            <p>P&lt;KENKERUBO&lt;&lt;VENESSA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</p>
            <p>VP202610254KEN9610258F2610254ARAKA&lt;PHILEMON02</p>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FCFAF7] to-transparent pointer-events-none" />
    </section>
  );
}

