import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Compass, ArrowUpRight, Calendar, Clock } from 'lucide-react';
import { WEDDING_DETAILS } from '../data';

import churchVenueImg from '../assets/images/church_venue_1784464948619.jpg';
import receptionVenueImg from '../assets/images/reception_venue_1784475057575.jpg';

export default function LocationMap() {
  const [activeVenue, setActiveVenue] = useState<'ceremony' | 'reception'>('ceremony');

  const venueInfo = activeVenue === 'ceremony' ? WEDDING_DETAILS.ceremony : WEDDING_DETAILS.reception;

  const getNavigationUrl = () => {
    const destination = encodeURIComponent(`${venueInfo.venue}, ${venueInfo.address}`);
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  };

  return (
    <section className="relative py-24 bg-[#002147] text-stone-100 overflow-hidden" id="maps-section">
      <div className="absolute inset-0 bg-radial-gradient from-amber-500/[0.03] via-transparent to-transparent pointer-events-none" />

      {/* Subtle passport guilloche grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#D4AF37 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }} 
      />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Section Header with Passport Badge */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#040d1c]/90 border border-[#D4AF37]/80 text-amber-200 text-[11px] font-mono font-bold tracking-widest uppercase mb-3 shadow-md">
            <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>PORTS OF ENTRY &amp; TRAVEL VISAS</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-light text-white mt-2 mb-4">When &amp; Where</h2>
          <div className="w-28 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
          <p className="text-stone-200 text-sm md:text-base mt-4 max-w-xl mx-auto italic font-serif">
            Official flight destinations, port coordinates, and navigation for our sacred ceremony and reception.
          </p>
        </div>

        {/* Date, Location, Time Info Panel (Passport Visa Summary) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto bg-[#081b3a]/90 border-2 border-[#D4AF37]/50 p-6 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] mb-12 relative z-10 backdrop-blur-md">
          {/* Calendar Card */}
          <div className="flex flex-col items-center text-center p-3 relative">
            <div className="w-11 h-11 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/60 text-amber-200 flex items-center justify-center mb-2 shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-[10px] text-amber-200 uppercase tracking-widest font-mono font-bold mb-1">DATE OF ENTRY</p>
            <p className="text-sm text-stone-200 font-serif font-medium">Sunday</p>
            <p className="text-base text-amber-300 font-serif font-bold">25th October 2026</p>
          </div>

          {/* Time Card */}
          <div className="flex flex-col items-center text-center p-3 border-y sm:border-y-0 sm:border-x border-[#D4AF37]/25 relative">
            <div className="w-11 h-11 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/60 text-amber-200 flex items-center justify-center mb-2 shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-[10px] text-amber-200 uppercase tracking-widest font-mono font-bold mb-1">ARRIVAL &amp; CEREMONY</p>
            <p className="text-sm text-stone-200 font-serif font-medium">10:00 AM Ceremony</p>
            <p className="text-xs text-amber-300 font-sans mt-1 font-semibold">Guest Arrival: 9:15 AM</p>
          </div>

          {/* Venue Card */}
          <div className="flex flex-col items-center text-center p-3 relative">
            <div className="w-11 h-11 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/60 text-amber-200 flex items-center justify-center mb-2 shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <p className="text-[10px] text-amber-200 uppercase tracking-widest font-mono font-bold mb-1">PRIMARY PORT</p>
            <p className="text-sm text-stone-200 font-serif font-medium leading-tight">{WEDDING_DETAILS.ceremony.venue}</p>
            <p className="text-xs text-amber-300 font-sans mt-1 font-semibold">Nairobi South, Kenya</p>
          </div>
        </div>

        {/* Location Toggle Selector styled as Visa Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-[#081b3a] border-2 border-[#D4AF37]/50 p-1.5 rounded-full shadow-lg backdrop-blur-md">
            <button
              onClick={() => setActiveVenue('ceremony')}
              className={`px-6 py-2.5 text-xs md:text-sm font-mono font-bold uppercase tracking-wider rounded-full transition-all flex items-center gap-2 cursor-pointer ${
                activeVenue === 'ceremony' ? 'bg-[#8B1E3F] text-amber-100 border border-[#D4AF37]/80 shadow-md' : 'text-stone-300 hover:text-amber-200'
              }`}
            >
              <Compass className="w-4 h-4 text-[#D4AF37]" />
              <span>PORT 01: CEREMONY (CHURCH)</span>
            </button>
            <button
              onClick={() => setActiveVenue('reception')}
              className={`px-6 py-2.5 text-xs md:text-sm font-mono font-bold uppercase tracking-wider rounded-full transition-all flex items-center gap-2 cursor-pointer ${
                activeVenue === 'reception' ? 'bg-[#8B1E3F] text-amber-100 border border-[#D4AF37]/80 shadow-md' : 'text-stone-300 hover:text-amber-200'
              }`}
            >
              <Navigation className="w-4 h-4 text-[#D4AF37]" />
              <span>PORT 02: RECEPTION (FEAST)</span>
            </button>
          </div>
        </div>

        {/* Info + Map Container Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Venue Details Card */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-[#081b3a]/95 border-2 border-[#D4AF37]/45 rounded-2xl shadow-xl relative overflow-hidden text-stone-100">
            {/* Venue Photo header */}
            <div className="relative h-48 w-full overflow-hidden border-b border-stone-800">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeVenue}
                  src={activeVenue === 'ceremony' ? churchVenueImg : receptionVenueImg}
                  alt={venueInfo.venue}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="p-8 flex flex-col justify-between flex-1">
              <div className="space-y-6 z-10">
                <span className="text-[10px] tracking-widest uppercase font-sans font-extrabold text-amber-300 px-3 py-1 bg-amber-400/10 rounded-full border border-amber-400/30 inline-block">
                  {activeVenue === 'ceremony' ? 'Part A: Wedding Service' : 'Part B: The Celebration'}
                </span>

                <div className="space-y-2">
                  <h3 className="font-serif text-2xl lg:text-3xl text-white leading-tight font-medium">
                    {venueInfo.venue}
                  </h3>
                  <p className="text-amber-300/90 text-xs tracking-wider uppercase font-sans font-medium">
                    {activeVenue === 'ceremony' ? 'Nuptial Service' : 'Reception & Feast'}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-stone-800">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-stone-400 uppercase tracking-widest font-sans font-bold">Address</p>
                      <p className="text-sm text-stone-200 leading-normal mt-0.5">{venueInfo.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Navigation className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-stone-400 uppercase tracking-widest font-sans font-bold">Timeline</p>
                      <p className="text-sm text-stone-200 mt-0.5">
                        {activeVenue === 'ceremony' ? '9:15 AM Guest Arrival | 10:00 AM Nuptial Service' : '1:00 PM Reception Arrival | 2:00 PM Feast & Celebration'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Passport Visa Clearance Stamp */}
                <div className="mt-4 pt-3 border-t border-dashed border-stone-800 flex items-center justify-between text-[9px] font-mono text-stone-400">
                  <span className="text-amber-300">VISA: {activeVenue === 'ceremony' ? 'NAI-CHURCH-01' : 'NAI-RECEPTION-02'}</span>
                  <span className="text-emerald-400 font-bold uppercase tracking-wider">★ PORT CLEARANCE GRANTED</span>
                </div>
              </div>

              {/* Driving navigation CTA button */}
              <div className="mt-8 pt-6 border-t border-stone-800 z-10">
                <a
                  href={getNavigationUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#D4AF37] hover:bg-[#b8860b] text-[#002147] hover:text-white font-sans font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow-[0_4px_16px_rgba(212,175,55,0.3)] group cursor-pointer"
                >
                  <span>Navigate on Maps</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Map Iframe */}
          <div className="lg:col-span-8 bg-stone-900 border border-amber-500/30 rounded-2xl overflow-hidden min-h-[350px] lg:min-h-auto flex shadow-xl relative animate-fade-in">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeVenue}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full min-h-[350px] flex"
              >
                <iframe
                  title={`Map of ${venueInfo.venue}`}
                  src={venueInfo.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  className="w-full min-h-[400px] border-0 filter contrast-[0.98] hover:contrast-100 transition-all duration-500"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
