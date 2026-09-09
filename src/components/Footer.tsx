import React from 'react';
import { Shield } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export default function Footer({ onOpenAdmin }: FooterProps) {
  return (
    <footer
      id="main-footer"
      className="relative bg-[#002147] border-t-2 border-[#D4AF37]/50 text-stone-200 py-12 px-4 select-none overflow-hidden"
    >
      {/* Subtle background ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-black/30 pointer-events-none" />

      <div className="container mx-auto max-w-4xl relative z-10 flex flex-col items-center text-center space-y-4">
        {/* Monogram / Couple Signature */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#002147] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-serif font-bold text-xs shadow-xs">
            VP
          </div>
          <span className="font-serif text-base sm:text-lg text-amber-100 tracking-wide font-medium">
            Venessa &amp; Philemon
          </span>
          <span className="text-[#D4AF37] font-bold">•</span>
          <span className="font-mono text-xs text-amber-200/90 font-semibold tracking-wider">
            25.10.2026
          </span>
        </div>

        {/* Couple Admin Portal Button */}
        {onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            id="admin-portal-trigger-btn"
            className="text-amber-100/90 hover:text-white transition-all flex items-center gap-2 cursor-pointer text-xs bg-[#040d1c]/80 hover:bg-[#040d1c] px-4 py-2 rounded-full border border-[#D4AF37]/50 shadow-md active:scale-95"
            title="Password-Protected Couple Admin Panel"
          >
            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-sans font-medium text-[11px] tracking-wide">Couple Admin Portal</span>
            <span className="bg-[#002147] text-amber-200 border border-[#D4AF37]/40 px-2 py-0.5 rounded-full font-mono text-[8px] font-bold tracking-wider uppercase">
              Secured
            </span>
          </button>
        )}

        {/* Divider */}
        <div className="w-36 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent my-1" />

        {/* Primary requested footer text */}
        <div className="text-xs sm:text-sm text-stone-300 font-sans tracking-wide">
          <a
            href="https://chartisanddonis.co.ke"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-300 hover:text-amber-200 hover:underline font-semibold transition-colors"
          >
            chartisanddonis.co.ke
          </a>
          <span className="mx-2.5 text-stone-400 font-normal">|</span>
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
