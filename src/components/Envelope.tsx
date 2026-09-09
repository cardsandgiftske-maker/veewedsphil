import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Plane, ShieldCheck } from 'lucide-react';

interface EnvelopeProps {
  onOpen: () => void;
  onSealBreak?: () => void;
}

export default function Envelope({ onOpen, onSealBreak }: EnvelopeProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isCoverOpen, setIsCoverOpen] = useState(false);

  const handleOpen = () => {
    if (isCoverOpen) return;
    setIsCoverOpen(true);
    
    if (onSealBreak) {
      onSealBreak();
    }
    
    setTimeout(() => {
      setIsOpened(true);
    }, 700);

    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.05,
        filter: 'blur(8px)',
        transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-stone-950/95 backdrop-blur-md p-3 sm:p-6 select-none"
    >
      {/* Ambient background lighting in royal navy and warm gold */}
      <div className="absolute inset-0 opacity-50 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full bg-[#001F3F]/60 blur-[130px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#0a192f]/80 blur-[110px]" />
        <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-[#D4AF37]/20 blur-[100px]" />
      </div>

      {/* Passport Book Wrapper with 3D Perspective */}
      <div 
        className="relative w-full max-w-[380px] sm:max-w-[400px] aspect-[1/1.48] max-h-[92vh] flex items-center justify-center"
        style={{ perspective: '1400px' }}
      >
        {/* Subtle shadow underneath passport */}
        <div className="absolute -bottom-8 inset-x-8 h-12 bg-black/60 rounded-full blur-2xl pointer-events-none" />

        {/* INSIDE PAGE: Boarding Pass & Visa Page (visible underneath when cover opens) */}
        <div className="absolute inset-0 bg-[#FFFDF9] rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col justify-between p-6 sm:p-8 select-none z-10">
          {/* Subtle Security Guilloche Pattern overlay */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#001F3F_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

          {/* Top Boarding Pass Header */}
          <div className="relative z-10 border-b-2 border-dashed border-stone-200 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#001F3F] text-amber-300 flex items-center justify-center font-serif text-xs font-bold shadow-sm">
                  VP
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] font-sans font-bold text-stone-400 block">
                    NUPTIAL AIRWAYS
                  </span>
                  <span className="text-xs font-serif font-bold text-[#001F3F]">
                    FIRST CLASS BOARDING PASS
                  </span>
                </div>
              </div>
              <Plane className="w-5 h-5 text-[#001F3F]" />
            </div>
          </div>

          {/* Flight & Destination Info */}
          <div className="relative z-10 py-4 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-left">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-stone-400 font-sans font-bold">Passenger</p>
                <p className="font-serif text-sm font-bold text-stone-900 truncate">Honored Wedding Guest</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-stone-400 font-sans font-bold">Flight / Date</p>
                <p className="font-serif text-sm font-bold text-[#8B1E3F]">VP-251026 • 25 OCT 2026</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-stone-400 font-sans font-bold">Origin</p>
                <p className="font-serif text-xs font-bold text-stone-800">Nairobi South SDA</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-stone-400 font-sans font-bold">Destination</p>
                <p className="font-serif text-xs font-bold text-stone-800">Mukuru Studyville</p>
              </div>
            </div>

            {/* Official Entry Visa Stamp */}
            <div className="pt-3 flex items-center justify-center">
              <div className="relative rotate-[-8deg] border-2 border-emerald-700/80 bg-emerald-50/50 rounded-xl px-4 py-2 text-center text-emerald-800 shadow-sm flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <div className="text-left">
                  <div className="text-[9px] font-sans font-extrabold uppercase tracking-widest text-emerald-900 leading-none">
                    ENTRY VISA GRANTED
                  </div>
                  <div className="text-[8px] font-serif italic text-emerald-700 leading-tight">
                    Authorized for Venessa &amp; Philemon
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barcode & Security strip at bottom */}
          <div className="relative z-10 pt-3 border-t-2 border-dashed border-stone-200 flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-6 w-36 bg-[repeating-linear-gradient(90deg,#001F3F,#001F3F_2px,transparent_2px,transparent_4px,#001F3F_4px,#001F3F_7px,transparent_7px,transparent_9px)] opacity-70" />
              <p className="text-[8px] font-mono text-stone-400">PASSPORT-VP-2026-NBO</p>
            </div>
            <span className="text-[10px] font-serif font-bold text-[#001F3F] uppercase tracking-wider">
              GATE: LOVE
            </span>
          </div>
        </div>

        {/* FRONT COVER: Navy Blue Leatherette Passport (Flips open like a booklet) */}
        <motion.div
          animate={isCoverOpen ? { 
            rotateY: -130, 
            x: -20,
            transition: { duration: 0.9, ease: [0.65, 0, 0.35, 1] } 
          } : { 
            rotateY: 0, 
            x: 0 
          }}
          onClick={handleOpen}
          style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
          className="absolute inset-0 bg-[#081730] rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85),_inset_0_2px_4px_rgba(255,255,255,0.15)] border-2 border-[#122b56] cursor-pointer overflow-hidden flex flex-col justify-between p-6 sm:p-7 select-none z-20 group active:scale-[0.99] transition-transform"
        >
          {/* Authentic Leather Texture Gradient & Grain */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0e254d] via-[#081730] to-[#040d1c] pointer-events-none" />
          
          {/* Subtle pebbled leather stippling overlay */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `radial-gradient(#FFF 0.75px, transparent 0.75px)`,
              backgroundSize: '8px 8px'
            }}
          />

          {/* Golden Corner Guards / Metal Caps */}
          <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-amber-300/60 rounded-tl pointer-events-none" />
          <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-amber-300/60 rounded-tr pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-amber-300/60 rounded-bl pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-amber-300/60 rounded-br pointer-events-none" />

          {/* Passport Spine Binding Stitch Line (Left side) */}
          <div className="absolute left-3 top-4 bottom-4 w-1 border-r border-dashed border-amber-400/25 pointer-events-none" />

          {/* Double Fine Gold Border Frame */}
          <div className="absolute inset-4 sm:inset-5 border border-amber-400/40 rounded-xl pointer-events-none">
            <div className="absolute inset-1 border border-amber-300/20 rounded-lg pointer-events-none" />
          </div>

          {/* Top Header: Official Wedding Passport Title */}
          <div className="relative z-10 text-center pt-3 px-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] uppercase bg-gradient-to-b from-[#FFF2D6] via-[#E8BE65] to-[#A87922] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              WEDDING PASSPORT
            </h1>
          </div>

          {/* Centerpiece: Nuptial Coat of Arms Crest with Laurel Wreath & "VP" Initials */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-2">
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
              {/* Gold Foil Glow on Hover */}
              <div className="absolute -inset-4 rounded-full bg-amber-400/15 blur-xl group-hover:bg-amber-300/25 transition-all duration-500" />

              {/* Passport Official Emblem SVG */}
              <svg className="w-full h-full filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)]" viewBox="0 0 160 160" fill="none">
                <defs>
                  <linearGradient id="passport-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF4DB" />
                    <stop offset="30%" stopColor="#F5D08B" />
                    <stop offset="65%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#8C5C15" />
                  </linearGradient>

                  <linearGradient id="passport-gold-light" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFF9E6" />
                    <stop offset="50%" stopColor="#E3B353" />
                    <stop offset="100%" stopColor="#966A1D" />
                  </linearGradient>
                </defs>

                {/* Outer Ornamental Laurel Branch Left */}
                <path
                  d="M42 120 C32 105, 30 75, 42 50 C45 44, 52 38, 56 36 C54 40, 50 48, 48 56 C44 72, 46 95, 54 110 C50 114, 46 117, 42 120 Z"
                  fill="url(#passport-gold)"
                  opacity="0.85"
                />
                <circle cx="37" cy="60" r="2.5" fill="url(#passport-gold)" />
                <circle cx="34" cy="74" r="2.5" fill="url(#passport-gold)" />
                <circle cx="35" cy="88" r="2.5" fill="url(#passport-gold)" />
                <circle cx="39" cy="102" r="2.5" fill="url(#passport-gold)" />

                {/* Outer Ornamental Laurel Branch Right */}
                <path
                  d="M118 120 C128 105, 130 75, 118 50 C115 44, 108 38, 104 36 C106 40, 110 48, 112 56 C116 72, 114 95, 106 110 C110 114, 114 117, 118 120 Z"
                  fill="url(#passport-gold)"
                  opacity="0.85"
                />
                <circle cx="123" cy="60" r="2.5" fill="url(#passport-gold)" />
                <circle cx="126" cy="74" r="2.5" fill="url(#passport-gold)" />
                <circle cx="125" cy="88" r="2.5" fill="url(#passport-gold)" />
                <circle cx="121" cy="102" r="2.5" fill="url(#passport-gold)" />

                {/* Top 3 Heraldic Stars */}
                <g fill="url(#passport-gold)" opacity="0.95">
                  {/* Center Star */}
                  <path d="M80 22 L82 27 L87 27 L83 30 L85 35 L80 32 L75 35 L77 30 L73 27 L78 27 Z" />
                  {/* Left Star */}
                  <path d="M66 26 L67.5 30 L71.5 30 L68.5 32.5 L70 36.5 L66 34 L62 36.5 L63.5 32.5 L60.5 30 L64.5 30 Z" transform="scale(0.8) translate(14, 8)" />
                  {/* Right Star */}
                  <path d="M94 26 L95.5 30 L99.5 30 L96.5 32.5 L98 36.5 L94 34 L90 36.5 L91.5 32.5 L88.5 30 L92.5 30 Z" transform="scale(0.8) translate(21, 8)" />
                </g>

                {/* Central Medallion Double Rings */}
                <circle cx="80" cy="80" r="42" stroke="url(#passport-gold)" strokeWidth="1.8" fill="none" opacity="0.9" />
                <circle cx="80" cy="80" r="38" stroke="url(#passport-gold)" strokeWidth="0.8" strokeDasharray="3 2" fill="none" opacity="0.75" />
                <circle cx="80" cy="80" r="35" stroke="url(#passport-gold)" strokeWidth="1.2" fill="#061226" fillOpacity="0.7" />

                {/* Regal Monogram Initials VP */}
                <text
                  x="80"
                  y="88"
                  fontFamily="'Playfair Display', 'Cormorant Garamond', Georgia, serif"
                  fontSize="28"
                  fontWeight="bold"
                  letterSpacing="0.08em"
                  fill="url(#passport-gold)"
                  textAnchor="middle"
                >
                  VP
                </text>

                {/* Bottom Ribbon / Banner Frame with Names */}
                <g filter="url(#passport-gold)">
                  <path
                    d="M44 126 Q80 134 116 126 L113 134 Q80 142 47 134 Z"
                    fill="url(#passport-gold-light)"
                    opacity="0.9"
                  />
                  <text
                    x="80"
                    y="132"
                    fontFamily="'Montserrat', 'Cinzel', sans-serif"
                    fontSize="5"
                    fontWeight="bold"
                    letterSpacing="0.18em"
                    fill="#1A1102"
                    textAnchor="middle"
                  >
                    VENESSA &amp; PHILEMON
                  </text>
                </g>
              </svg>
            </div>

            {/* Couple Names & Location */}
            <div className="mt-2 text-center">
              <span className="font-serif text-base sm:text-lg font-bold tracking-wider text-amber-200/95 block drop-shadow-sm">
                Venessa &amp; Philemon
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.2em] font-sans font-semibold text-amber-300/70 uppercase block mt-0.5">
                October 25, 2026 • Nairobi, Kenya
              </span>
            </div>
          </div>

          {/* Bottom Area: Biometric Chip Symbol & Interactive Tap Prompt */}
          <div className="relative z-10 flex flex-col items-center pb-2">
            {/* Interactive "TAP TO OPEN" Pill */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#001F3F]/80 backdrop-blur-md border border-amber-300/40 text-amber-200 font-sans text-xs tracking-wider uppercase font-bold shadow-lg group-hover:border-amber-300 group-hover:text-amber-100 transition-all animate-bounce" style={{ animationDuration: '2.5s' }}>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Tap to Open Passport</span>
              </span>
            </div>

            {/* Official International Biometric Passport Gold Chip Symbol */}
            <div className="w-12 h-8 border-[1.5px] border-amber-300/70 rounded-md flex items-center justify-center relative bg-amber-400/5 shadow-inner">
              <div className="w-full h-[1.5px] bg-amber-300/70 absolute inset-y-1/2 -translate-y-1/2" />
              <div className="w-3.5 h-3.5 rounded-full border-[1.5px] border-amber-300/90 bg-[#081730] relative z-10" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

