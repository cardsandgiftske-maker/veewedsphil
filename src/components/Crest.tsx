import React from 'react';

interface CrestProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export default function Crest({ size = 'md' }: CrestProps) {
  // Dimension definitions for sizes
  const dimensions = {
    sm: 'w-28 h-28',
    md: 'w-36 h-36 sm:w-40 sm:h-40',
    lg: 'w-44 h-44 sm:w-48 sm:h-48',
    xl: 'w-56 h-56 sm:w-60 sm:h-60',
  };

  const dim = dimensions[size] || dimensions.md;

  return (
    <div className="relative flex items-center justify-center select-none" id="wedding-crest-container">
      {/* Background ambient warm gold/soft glow */}
      <div className="absolute -inset-3 rounded-full bg-amber-400/15 blur-xl pointer-events-none" />

      {/* Gold-Foiled Nuptial Coat of Arms matching closed envelope */}
      <div className={`relative ${dim} flex items-center justify-center`}>
        <svg 
          className="w-full h-full filter drop-shadow-[0_4px_10px_rgba(0,31,63,0.2)]" 
          viewBox="0 0 160 160" 
          fill="none"
        >
          <defs>
            <linearGradient id="hero-coat-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF4DB" />
              <stop offset="30%" stopColor="#F5D08B" />
              <stop offset="65%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8C5C15" />
            </linearGradient>

            <linearGradient id="hero-coat-gold-light" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF9E6" />
              <stop offset="50%" stopColor="#E3B353" />
              <stop offset="100%" stopColor="#966A1D" />
            </linearGradient>

            <filter id="hero-coat-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#001F3F" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Outer Ornamental Laurel Branch Left */}
          <path
            d="M42 120 C32 105, 30 75, 42 50 C45 44, 52 38, 56 36 C54 40, 50 48, 48 56 C44 72, 46 95, 54 110 C50 114, 46 117, 42 120 Z"
            fill="url(#hero-coat-gold)"
            opacity="0.92"
          />
          <circle cx="37" cy="60" r="2.5" fill="url(#hero-coat-gold)" />
          <circle cx="34" cy="74" r="2.5" fill="url(#hero-coat-gold)" />
          <circle cx="35" cy="88" r="2.5" fill="url(#hero-coat-gold)" />
          <circle cx="39" cy="102" r="2.5" fill="url(#hero-coat-gold)" />

          {/* Outer Ornamental Laurel Branch Right */}
          <path
            d="M118 120 C128 105, 130 75, 118 50 C115 44, 108 38, 104 36 C106 40, 110 48, 112 56 C116 72, 114 95, 106 110 C110 114, 114 117, 118 120 Z"
            fill="url(#hero-coat-gold)"
            opacity="0.92"
          />
          <circle cx="123" cy="60" r="2.5" fill="url(#hero-coat-gold)" />
          <circle cx="126" cy="74" r="2.5" fill="url(#hero-coat-gold)" />
          <circle cx="125" cy="88" r="2.5" fill="url(#hero-coat-gold)" />
          <circle cx="121" cy="102" r="2.5" fill="url(#hero-coat-gold)" />

          {/* Top 3 Heraldic Stars */}
          <g fill="url(#hero-coat-gold)" opacity="0.95">
            {/* Center Star */}
            <path d="M80 22 L82 27 L87 27 L83 30 L85 35 L80 32 L75 35 L77 30 L73 27 L78 27 Z" />
            {/* Left Star */}
            <path d="M66 26 L67.5 30 L71.5 30 L68.5 32.5 L70 36.5 L66 34 L62 36.5 L63.5 32.5 L60.5 30 L64.5 30 Z" transform="scale(0.8) translate(14, 8)" />
            {/* Right Star */}
            <path d="M94 26 L95.5 30 L99.5 30 L96.5 32.5 L98 36.5 L94 34 L90 36.5 L91.5 32.5 L88.5 30 L92.5 30 Z" transform="scale(0.8) translate(21, 8)" />
          </g>

          {/* Central Medallion Double Rings */}
          <circle cx="80" cy="80" r="42" stroke="url(#hero-coat-gold)" strokeWidth="1.8" fill="none" opacity="0.95" />
          <circle cx="80" cy="80" r="38" stroke="url(#hero-coat-gold)" strokeWidth="0.8" strokeDasharray="3 2" fill="none" opacity="0.8" />
          
          {/* Inner Navy Medallion Core */}
          <circle cx="80" cy="80" r="35" stroke="url(#hero-coat-gold)" strokeWidth="1.2" fill="#001F3F" />

          {/* Regal Monogram Initials VP */}
          <text
            x="80"
            y="88"
            fontFamily="'Playfair Display', 'Cormorant Garamond', Georgia, serif"
            fontSize="28"
            fontWeight="bold"
            letterSpacing="0.08em"
            fill="url(#hero-coat-gold)"
            textAnchor="middle"
          >
            VP
          </text>

          {/* Bottom Ribbon / Banner Frame with Names */}
          <g filter="url(#hero-coat-shadow)">
            <path
              d="M44 126 Q80 134 116 126 L113 134 Q80 142 47 134 Z"
              fill="url(#hero-coat-gold-light)"
              opacity="0.95"
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
    </div>
  );
}
