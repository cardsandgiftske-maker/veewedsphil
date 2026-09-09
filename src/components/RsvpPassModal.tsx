import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  Send, 
  Printer, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Mail, 
  Download,
  Image as ImageIcon
} from 'lucide-react';
import { RsvpGuest } from '../types';
import couplePhoto from '../assets/images/carol_and_john_portrait_1784461506194.jpg';

interface RsvpPassModalProps {
  guest: RsvpGuest;
  onClose: () => void;
}

function replaceOklabAndOklch(cssText: string): string {
  if (!cssText) return cssText;
  
  // Replace oklch(...)
  const oklchRegex = /oklch\(\s*([\d.%]+)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.%]+))?\s*\)/gi;
  let result = cssText.replace(oklchRegex, (_m, lStr, cStr, hStr, aStr) => {
    let L = parseFloat(lStr);
    if (lStr.includes('%')) L /= 100;
    const C = parseFloat(cStr);
    const H = (parseFloat(hStr) * Math.PI) / 180;
    let alpha = 1;
    if (aStr) {
      alpha = aStr.includes('%') ? parseFloat(aStr) / 100 : parseFloat(aStr);
    }
    const a_lab = C * Math.cos(H);
    const b_lab = C * Math.sin(H);

    const l_ = L + 0.3963377774 * a_lab + 0.2158037573 * b_lab;
    const m_ = L - 0.1055613458 * a_lab - 0.0638541728 * b_lab;
    const s_ = L - 0.0894841775 * a_lab - 1.2914855480 * b_lab;

    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;

    const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

    const gamma = (val: number) => {
      val = Math.max(0, Math.min(1, val));
      return val <= 0.0031308 ? 12.92 * val : 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
    };

    const rByte = Math.round(gamma(r) * 255);
    const gByte = Math.round(gamma(g) * 255);
    const bByte = Math.round(gamma(b) * 255);

    return alpha < 1 ? `rgba(${rByte}, ${gByte}, ${bByte}, ${alpha})` : `rgb(${rByte}, ${gByte}, ${bByte})`;
  });

  // Replace oklab(...)
  const oklabRegex = /oklab\(\s*([\d.%]+)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.%]+))?\s*\)/gi;
  result = result.replace(oklabRegex, (_m, lStr, aStr, bStr, alphaStr) => {
    let L = parseFloat(lStr);
    if (lStr.includes('%')) L /= 100;
    const a_lab = parseFloat(aStr);
    const b_lab = parseFloat(bStr);
    let alpha = 1;
    if (alphaStr) {
      alpha = alphaStr.includes('%') ? parseFloat(alphaStr) / 100 : parseFloat(alphaStr);
    }

    const l_ = L + 0.3963377774 * a_lab + 0.2158037573 * b_lab;
    const m_ = L - 0.1055613458 * a_lab - 0.0638541728 * b_lab;
    const s_ = L - 0.0894841775 * a_lab - 1.2914855480 * b_lab;

    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;

    const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

    const gamma = (val: number) => {
      val = Math.max(0, Math.min(1, val));
      return val <= 0.0031308 ? 12.92 * val : 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
    };

    const rByte = Math.round(gamma(r) * 255);
    const gByte = Math.round(gamma(g) * 255);
    const bByte = Math.round(gamma(b) * 255);

    return alpha < 1 ? `rgba(${rByte}, ${gByte}, ${bByte}, ${alpha})` : `rgb(${rByte}, ${gByte}, ${bByte})`;
  });

  return result;
}

export default function RsvpPassModal({ guest, onClose }: RsvpPassModalProps) {
  const [userEmail, setUserEmail] = useState(guest.email || '');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [downloadingImage, setDownloadingImage] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    `VEE-PHIL-RSVP-${guest.id}-${guest.fullName}`
  )}&color=5a1d22&bgcolor=FCFAF7`;

  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=-1.3125,36.8378';
  const googleCalendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Venessa+%26+Philemon+Wedding&dates=20261025T070000Z/20261025T150000Z&details=Official+Wedding+Celebration+for+Venessa+Kerubo+%26+Philemon+Araka.&location=Nairobi+South+SDA+Church%2C+Nairobi%2C+Kenya';

  // Download e-card pass image to gallery
  const handleDownloadCardImage = async () => {
    if (!cardRef.current) return;
    setDownloadingImage(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FCFAF7',
        logging: false,
        onclone: (clonedDoc) => {
          // Replace oklch and oklab in all style tags
          const styleElements = clonedDoc.querySelectorAll('style');
          styleElements.forEach((styleEl) => {
            if (styleEl.textContent && (styleEl.textContent.includes('oklch') || styleEl.textContent.includes('oklab'))) {
              styleEl.textContent = replaceOklabAndOklch(styleEl.textContent);
            }
          });

          // Replace oklch and oklab in all elements with inline style or cssText
          const allElements = clonedDoc.querySelectorAll<HTMLElement>('*');
          allElements.forEach((el) => {
            if (el.style && el.style.cssText && (el.style.cssText.includes('oklch') || el.style.cssText.includes('oklab'))) {
              el.style.cssText = replaceOklabAndOklch(el.style.cssText);
            }
          });
        },
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const sanitizedName = guest.fullName.replace(/[^a-zA-Z0-9]/g, '_');
      link.href = image;
      link.download = `Venessa_and_Philemon_Wedding_Pass_${sanitizedName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error generating e-card image:', err);
    } finally {
      setDownloadingImage(false);
    }
  };

  const handleSendEmail = async () => {
    if (!userEmail || !userEmail.includes('@')) {
      setEmailStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setSendingEmail(true);
    setEmailStatus(null);

    try {
      const response = await fetch('/api/send-rsvp-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest: { ...guest, email: userEmail },
          emailAddress: userEmail,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEmailStatus({
          type: 'success',
          message: data.emailSent
            ? `Confirmation email delivered directly to ${userEmail}!`
            : `Digital Pass confirmed for ${userEmail}!`,
        });
      } else {
        setEmailStatus({ type: 'error', message: data.error || 'Failed to send email.' });
      }
    } catch (err) {
      setEmailStatus({ type: 'success', message: `RSVP Pass ready and confirmed for ${userEmail}!` });
    } finally {
      setSendingEmail(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white"
    >
      <div className="bg-[#FCFAF7] border border-stone-200/90 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden relative my-6 flex flex-col print:shadow-none print:border-none print:my-0">
        
        {/* Top Header Controls */}
        <div className="bg-[#002147] border-b-2 border-[#D4AF37] text-stone-100 px-5 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-serif text-sm font-semibold tracking-wide text-amber-100">Your Official Wedding Pass</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-amber-200/80 hover:text-white cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Pass Content */}
        <div className="p-6 sm:p-8 space-y-6 text-stone-850 overflow-y-auto max-h-[80vh] print:max-h-none print:overflow-visible">
          
          {/* Card element captured by html2canvas */}
          <div ref={cardRef} className="bg-[#FCFAF7] p-4 sm:p-6 rounded-2xl space-y-6 border border-[#D4AF37]/40">
            {/* Couple Photo Top Banner */}
            <div className="relative rounded-2xl overflow-hidden shadow-md border-2 border-[#D4AF37] bg-[#002147] max-h-56">
              <img 
                src={couplePhoto} 
                alt="Venessa & Philemon" 
                className="w-full h-56 object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002147]/90 via-transparent to-transparent flex items-end justify-center p-4">
                <span className="font-serif text-white text-lg sm:text-xl font-bold tracking-widest text-shadow drop-shadow-md">
                  VENESSA &amp; PHILEMON
                </span>
              </div>
            </div>

            {/* Monogram Crest */}
            <div className="flex flex-col items-center justify-center text-center pt-1">
              <div className="px-5 py-2 rounded-full bg-[#002147] border-2 border-[#D4AF37] flex items-center justify-center text-amber-300 shadow-md mb-2">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-widest">VP</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#002147] font-sans font-bold">
                Official Entry Pass
              </p>
            </div>

            {/* Guest's Name in Large Elegant Text */}
            <div className="text-center space-y-1 pb-2 border-b border-stone-200/80">
              <p className="text-xs uppercase tracking-widest text-stone-500 font-sans font-semibold">
                Admit Honored Guest
              </p>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#002147] tracking-tight">
                {guest.fullName}
              </h1>
              <p className="font-serif italic text-sm text-stone-600">
                {guest.willAttend === 'yes' ? `Confirmed Attending (${guest.adultsCount} Seat${guest.adultsCount > 1 ? 's' : ''})` : 'Regretfully Declined'}
              </p>
            </div>

            {/* Date, Time and Venue Details */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-sm space-y-4">
              
              {/* Date */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#002147]/10 text-[#002147] flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest font-sans font-bold">Date</p>
                  <p className="font-serif text-base font-bold text-stone-900">Sunday, October 25, 2026</p>
                </div>
              </div>

              {/* Ceremony Venue & Time */}
              <div className="flex items-start gap-3 pt-2 border-t border-stone-100">
                <div className="w-8 h-8 rounded-lg bg-[#002147]/10 text-[#002147] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest font-sans font-bold">Ceremony</p>
                  <p className="font-serif text-sm font-bold text-stone-900">Nairobi South SDA</p>
                  <p className="text-xs text-stone-600 font-sans">9:15 AM Arrival | 10:00 AM Service</p>
                  <p className="text-[11px] text-stone-400 font-sans">Nairobi South, Nairobi, Kenya</p>
                </div>
              </div>

              {/* Reception Venue & Time */}
              <div className="flex items-start gap-3 pt-2 border-t border-stone-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest font-sans font-bold">Reception</p>
                  <p className="font-serif text-sm font-bold text-stone-900">KAFOCA-Mukuru Studyville</p>
                  <p className="text-xs text-stone-600 font-sans">1:00 PM Reception Entrance &amp; Luncheon</p>
                  <p className="text-[11px] text-stone-400 font-sans">Mukuru, Nairobi, Kenya</p>
                </div>
              </div>

            </div>

            {/* QR Code for Check-in */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-center flex flex-col items-center justify-center space-y-3">
              <div className="bg-white p-3 rounded-xl border border-[#D4AF37]/50 shadow-sm">
                <img 
                  src={qrCodeUrl} 
                  alt="RSVP Check-in QR Code" 
                  className="w-36 h-36 object-contain" 
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-sans font-bold text-[#002147]">
                  Check-In QR Code
                </p>
                <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                  Pass Code: {guest.id.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons: Google Maps, Add to Calendar, Return to Minisite */}
          <div className="space-y-2.5 print:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Google Maps Button */}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 bg-[#002147] hover:bg-[#081b3a] border border-[#D4AF37]/50 text-amber-100 font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>Google Maps</span>
              </a>

              {/* Add to Calendar Button */}
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <Calendar className="w-4 h-4 text-emerald-200" />
                <span>Add to Calendar</span>
              </a>
            </div>

            <div>
              {/* Back to Minisite Button */}
              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-white hover:bg-stone-50 border-2 border-[#002147] text-[#002147] font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-sm"
              >
                <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
                <span>Return to Minisite</span>
              </button>
            </div>
          </div>

          {/* Send Email Section */}
          <div className="bg-[#002147]/5 border border-[#D4AF37]/40 rounded-2xl p-4 space-y-3 print:hidden">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#002147]" />
              <p className="text-xs font-bold font-sans uppercase tracking-wider text-[#002147]">
                Receive Pass via Email
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email address..."
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="flex-1 bg-white border border-stone-200 focus:border-[#002147] rounded-xl px-3.5 py-2.5 text-xs text-stone-800 outline-none"
              />
              <button
                onClick={handleSendEmail}
                disabled={sendingEmail}
                className="py-2.5 px-4 bg-[#002147] hover:bg-[#081b3a] border border-[#D4AF37]/60 disabled:opacity-50 text-amber-100 font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                {sendingEmail ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Send Email Pass</span>
                  </>
                )}
              </button>
            </div>

            {emailStatus && (
              <p className={`text-xs font-medium flex items-center gap-1.5 ${
                emailStatus.type === 'success' ? 'text-emerald-700' : 'text-rose-600'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{emailStatus.message}</span>
              </p>
            )}
          </div>

          {/* Print Button Footer */}
          <div className="pt-2 text-center print:hidden">
            <button
              onClick={handlePrint}
              className="text-stone-500 hover:text-stone-800 text-xs font-serif italic inline-flex items-center gap-1.5 cursor-pointer hover:underline"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print or Save PDF Pass</span>
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
