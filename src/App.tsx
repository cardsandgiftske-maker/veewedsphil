import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Shirt, Sparkles, Mail, Camera, ChevronUp, Clock, Gift, Menu, X } from 'lucide-react';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import Program from './components/Program';
import DressCode from './components/DressCode';
import LocationMap from './components/LocationMap';
import Gallery from './components/Gallery';
import Gifts from './components/Gifts';
import RsvpForm from './components/RsvpForm';
import AdminPanel from './components/AdminPanel';
import Envelope from './components/Envelope';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero-section');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [shouldPlayMusic, setShouldPlayMusic] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isEnvelopeOpened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isEnvelopeOpened]);

  const handleEnvelopeOpen = () => {
    setIsEnvelopeOpened(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      const sections = ['hero-section', 'countdown-section', 'maps-section', 'program-section', 'dress-code-section', 'gallery-section', 'gifting-section', 'rsvp-section'];
      const scrollPosition = window.scrollY + window.innerHeight * 0.4;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'hero-section', label: 'Welcome', icon: Sparkles },
    { id: 'countdown-section', label: 'Countdown', icon: Clock },
    { id: 'maps-section', label: 'When & Where', icon: MapPin },
    { id: 'program-section', label: 'Program', icon: Calendar },
    { id: 'dress-code-section', label: 'Dress Code', icon: Shirt },
    { id: 'gallery-section', label: 'Gallery', icon: Camera },
    { id: 'gifting-section', label: 'Gifting', icon: Gift },
    { id: 'rsvp-section', label: 'RSVP', icon: Mail },
  ];

  return (
    <>
      <MusicPlayer shouldPlay={shouldPlayMusic} />
      
      <AnimatePresence>
        {!isEnvelopeOpened && (
          <Envelope 
            onOpen={handleEnvelopeOpen} 
            onSealBreak={() => setShouldPlayMusic(true)} 
          />
        )}
      </AnimatePresence>

      {isEnvelopeOpened && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="relative min-h-screen bg-[#FCFAF7] text-stone-800 font-sans selection:bg-maroon-100 selection:text-maroon-900 overflow-x-hidden antialiased"
        >
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-maroon-500/[0.015] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[#FCFAF7]" />
        </div>

      {/* Floating Header Navigation with Navy & Gold Accents */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#FCFAF7]/95 backdrop-blur-md border-b border-[#D4AF37]/30 shadow-[0_4px_20px_rgba(0,33,71,0.04)] transition-all">
        {/* Subtle Top Gold Foil Trim */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo Name */}
          <button 
            onClick={() => scrollToSection('hero-section')}
            className="font-serif text-lg tracking-widest font-bold cursor-pointer flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <span className="text-[#8B1E3F]">VENESSA</span>
            <span className="text-[#D4AF37] font-serif text-base italic">&amp;</span>
            <span className="text-[#002147]">PHILEMON</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono font-bold tracking-widest text-amber-200 bg-[#002147] border border-[#D4AF37]/60 px-2.5 py-0.5 rounded-full ml-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              PASSPORT VP-1025
            </span>
          </button>

          {/* Desktop Nav menu items */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-stone-600">
            {navItems.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3.5 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeSection === item.id 
                      ? 'bg-[#002147] text-amber-100 border border-[#D4AF37]/80 font-bold shadow-[0_2px_10px_rgba(0,33,71,0.25)]' 
                      : 'border border-transparent hover:text-[#002147] hover:border-[#D4AF37]/40 hover:bg-white/60'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${activeSection === item.id ? 'text-[#D4AF37]' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Right Controls: Quick RSVP button + Hamburger Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => scrollToSection('rsvp-section')}
              className="text-[11px] font-mono font-bold uppercase tracking-wider bg-[#002147] hover:bg-[#081b3a] text-amber-200 border border-[#D4AF37]/80 px-3 py-1.5 rounded-full shadow-xs flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
            >
              <Mail className="w-3 h-3 text-[#D4AF37]" />
              <span>RSVP</span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-[#D4AF37]/40 text-[#002147] transition-all cursor-pointer active:scale-95 flex items-center justify-center"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#8B1E3F]" />
              ) : (
                <Menu className="w-5 h-5 text-[#002147]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Quick Nav Strip */}
        <div className="md:hidden border-t border-[#D4AF37]/20 bg-[#FCFAF7]/95 px-3 py-1.5 overflow-x-auto scrollbar-none flex items-center gap-1.5">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={`quick-${item.id}`}
                onClick={() => scrollToSection(item.id)}
                className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#002147] text-amber-200 border border-[#D4AF37] font-bold shadow-xs'
                    : 'text-stone-600 bg-white/80 border border-stone-200/80 hover:text-[#002147]'
                }`}
              >
                <IconComp className={`w-3 h-3 ${isActive ? 'text-[#D4AF37]' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Expandable Drawer Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden bg-[#FCFAF7] border-t border-[#D4AF37]/40 shadow-2xl overflow-hidden"
            >
              <div className="p-4 space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#002147] font-bold flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Passport Navigation Menu
                  </span>
                  <span className="text-stone-400 font-normal">VP-1025</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {navItems.map((item) => {
                    const IconComp = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={`drawer-${item.id}`}
                        onClick={() => scrollToSection(item.id)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer text-left ${
                          isActive
                            ? 'bg-[#002147] text-amber-100 border-2 border-[#D4AF37] font-bold shadow-md'
                            : 'bg-white text-stone-700 border border-stone-200 hover:border-[#D4AF37]/60 hover:bg-amber-50/40 hover:text-[#002147]'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive ? 'bg-white/10 text-[#D4AF37]' : 'bg-stone-100 text-stone-500'
                        }`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between text-[10px] font-mono text-stone-500">
                  <span className="text-[#8B1E3F] font-bold tracking-wider">VENESSA &amp; PHILEMON</span>
                  <span className="text-[#002147] font-bold">25 OCTOBER 2026</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Backdrop for Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-35"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Main Content Sections Wrapper */}
      <main className="relative z-10 pt-26 md:pt-16">
        <Hero />
        <Countdown />
        <LocationMap />
        <Program />
        <DressCode />
        <Gallery />
        <Gifts />
        <RsvpForm />
      </main>

      {/* Couple Administrative Database Section */}
      <AdminPanel />

      {/* Desktop Vertical Indicator Navigation Dots (Right Edge) */}
      <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-4 items-center">
        {navItems.map((item) => (
          <button
            key={`dot-${item.id}`}
            onClick={() => scrollToSection(item.id)}
            className="group relative flex items-center justify-end cursor-pointer"
            title={item.label}
          >
            <span className="absolute right-full mr-4 bg-white/95 border border-[#D4AF37]/40 px-2.5 py-1 rounded text-[10px] font-sans font-bold uppercase tracking-wider shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 text-[#002147]">
              {item.label}
            </span>
            <span className={`w-2.5 h-2.5 rounded-full border transition-all ${
              activeSection === item.id 
                ? 'bg-[#002147] border-[#D4AF37] ring-2 ring-[#D4AF37]/30 scale-125' 
                : 'bg-stone-200 border-stone-300 group-hover:border-[#002147] group-hover:scale-110'
            }`} />
          </button>
        ))}
      </div>

      {/* Floating scroll-to-top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 left-6 z-45"
            id="scroll-to-top-button-container"
          >
            <button
              onClick={() => scrollToSection('hero-section')}
              className="p-3 bg-[#002147] hover:bg-[#081b3a] border-2 border-[#D4AF37]/70 text-amber-200 rounded-full shadow-lg active:scale-95 transition-all cursor-pointer group"
              title="Scroll to Top"
            >
              <ChevronUp className="w-5 h-5 text-amber-300 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    )}
    </>
  );
}
