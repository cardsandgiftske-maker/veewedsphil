import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gift, Heart, Copy, Check, Smartphone, Sparkles, Send } from 'lucide-react';

export default function Gifts() {
  const [copied, setCopied] = useState(false);

  const mpesaNumber = '+254 713 166985';
  const rawNumber = '+254713166985';
  const recipientName = 'Philemon Momanyi';

  const handleCopy = () => {
    navigator.clipboard.writeText(rawNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section
      id="gifting-section"
      className="relative py-20 md:py-24 bg-[#FCFAF7] border-t border-[#D4AF37]/30 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/40 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#002147] border border-[#D4AF37]/80 text-amber-200 text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase mb-3 shadow-sm"
          >
            <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>PASSPORT REGISTRY // LOVE &amp; BLESSINGS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-light text-stone-900 mt-2 mb-4"
          >
            Wedding Gifting
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-28 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-stone-700 text-sm md:text-base mt-4 max-w-xl mx-auto italic font-serif leading-relaxed"
          >
            Your presence and prayers as we begin our holy matrimony are the greatest gifts of all. Should you wish to honor us with a token of love or blessing toward our new journey, cash gifts can be sent directly via M-Pesa.
          </motion.p>
        </div>

        {/* Gifting Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch max-w-3xl mx-auto">
          {/* M-Pesa Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-7 bg-white border-2 border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,33,71,0.06)] relative flex flex-col justify-between overflow-hidden"
          >
            {/* Top decorative stripe */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#002147] via-[#D4AF37] to-[#002147]" />

            <div>
              {/* Header badge */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#002147] border border-[#D4AF37]/60 flex items-center justify-center text-[#D4AF37] shadow-xs">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900 leading-tight">M-Pesa Gift</h3>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
                      Direct Mobile Transfer
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-[10px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Safaricom
                </span>
              </div>

              {/* Details Box */}
              <div className="bg-[#FCFAF7] border border-[#D4AF37]/30 rounded-2xl p-5 space-y-4 mb-6">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-stone-500 block mb-0.5">
                    Account Name / Recipient
                  </span>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-[#002147] tracking-tight">
                    {recipientName}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/80">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-stone-500 block mb-1">
                    M-Pesa Mobile Number
                  </span>
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-mono text-xl sm:text-2xl font-bold text-stone-900 tracking-wider">
                      {mpesaNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleCopy}
                id="copy-mpesa-number-btn"
                className={`w-full py-3.5 px-4 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98 ${
                  copied
                    ? 'bg-emerald-700 text-white border-2 border-emerald-600 shadow-md'
                    : 'bg-[#002147] hover:bg-[#081b3a] border-2 border-[#D4AF37] text-amber-100 hover:shadow-md'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-200" />
                    <span>Number Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#D4AF37]" />
                    <span>Copy M-Pesa Number</span>
                  </>
                )}
              </button>

              <a
                href={`tel:${rawNumber}`}
                className="w-full py-2.5 px-4 rounded-xl font-sans text-xs font-semibold text-stone-600 hover:text-[#002147] bg-stone-100/70 hover:bg-stone-100 border border-stone-200/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#002147]" />
                <span>Call or Open Phone Dialer</span>
              </a>
            </div>
          </motion.div>

          {/* Envelope / Blessing Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-5 bg-gradient-to-b from-[#002147] to-[#04162e] text-white border-2 border-[#D4AF37]/60 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,33,71,0.12)] relative flex flex-col justify-between overflow-hidden"
          >
            {/* Ambient watermarking */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="w-10 h-10 rounded-full bg-white/10 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mb-4 shadow-sm">
                <Heart className="w-5 h-5 fill-[#D4AF37]/40" />
              </div>

              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold block mb-2">
                WARMEST GRATITUDE
              </span>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-100 mb-3 leading-snug">
                Thank You for Your Love &amp; Support
              </h3>

              <p className="text-stone-300 text-xs sm:text-sm font-serif italic leading-relaxed mb-6">
                &ldquo;Every good and perfect gift is from above.&rdquo; Your encouragement, prayers, and generosity mean the world to us as we set up our family home.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-[11px] font-mono text-amber-200/90 tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Envelope Drop Available at Reception</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
