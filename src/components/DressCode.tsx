import React from 'react';
import { motion } from 'motion/react';
import { Shirt, Sparkles } from 'lucide-react';

export default function DressCode() {
  const colorSwatches = [
    {
      name: 'Burgundy',
      hex: '#8B1E3F',
      bgClass: 'bg-[#8B1E3F]',
      borderClass: 'border-[#A52B52]/40',
      description: 'Strawberrish Burgundy',
    },
    {
      name: 'Navy Blue',
      hex: '#002147',
      bgClass: 'bg-[#002147]',
      borderClass: 'border-[#1A3D6D]/40',
      description: 'Royal Navy',
    },
    {
      name: 'Touch of Gold',
      hex: '#D4AF37',
      bgClass: 'bg-[#D4AF37]',
      borderClass: 'border-[#F5D08B]/50',
      description: 'Metallic Accent',
    },
  ];

  return (
    <section className="relative py-20 md:py-24 bg-gradient-to-b from-[#8B1E3F] via-[#4d0f22] to-[#002147] text-white overflow-hidden" id="dress-code-section">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/15 via-transparent to-black/40 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-3xl relative z-10 text-center">
        {/* Section Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#002147]/90 border border-[#D4AF37]/80 text-amber-200 text-xs font-mono font-bold uppercase tracking-[0.2em] mb-4 shadow-md"
        >
          <Shirt className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>PASSPORT TRAVEL SPECIFICATION // ATTIRE</span>
        </motion.div>

        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4"
        >
          Dress Code
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6"
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-amber-100/95 text-base sm:text-lg max-w-xl mx-auto italic font-serif leading-relaxed mb-12"
        >
          We kindly invite you to celebrate with us in elegant attire inspired by our royal navy, burgundy, and gold color palette.
        </motion.p>

        {/* Simplified Color Palette Swatches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto mb-10"
        >
          {colorSwatches.map((swatch) => (
            <div
              key={swatch.name}
              className="group bg-[#040d1c]/60 backdrop-blur-md rounded-2xl p-6 border-2 border-[#D4AF37]/40 hover:border-[#D4AF37] hover:shadow-[0_8px_30px_rgba(212,175,55,0.2)] transition-all text-center flex flex-col items-center relative overflow-hidden"
            >
              <span className="absolute top-3 right-3 text-[9px] font-mono text-amber-200 font-bold tracking-wider">
                {swatch.hex}
              </span>
              <div
                className={`w-16 h-16 rounded-full ${swatch.bgClass} shadow-lg border-2 ${swatch.borderClass} mb-3 group-hover:scale-105 transition-transform`}
              />
              <h4 className="font-serif font-bold text-lg text-white mb-0.5">{swatch.name}</h4>
              <p className="text-xs font-sans text-amber-200 tracking-wide font-medium">{swatch.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Clearance Seal */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/60 bg-[#002147]/80 text-[10px] font-mono tracking-widest text-amber-200 uppercase shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>PALETTE CLEARANCE: OFFICIALLY APPROVED FOR PASSENGERS</span>
        </motion.div>
      </div>
    </section>
  );
}
