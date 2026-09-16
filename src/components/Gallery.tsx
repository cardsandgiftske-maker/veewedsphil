import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, Heart, Smartphone, Sparkles, Plus, Image as ImageIcon, X, ChevronLeft, ChevronRight, Pause, Play, Maximize2, Download, Cloud, CheckCircle2 } from 'lucide-react';
import { INITIAL_GALLERY } from '../data';
import { GalleryPhoto } from '../types';
import { saveGalleryPhoto, likeGalleryPhoto, subscribeToGalleryPhotos } from '../lib/firebase';
import { uploadToCloudinary } from '../lib/cloudinary';

export default function Gallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(INITIAL_GALLERY);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploaderName, setUploaderName] = useState('');
  const [caption, setCaption] = useState('');
  const [deviceInfo, setDeviceInfo] = useState('iPhone 15 Pro');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  // Cloudinary credentials with default presets
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'b6onpcyk';
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'veeandphil';

  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to real-time Firebase gallery updates
  useEffect(() => {
    const unsubscribe = subscribeToGalleryPhotos((updatedPhotos) => {
      setPhotos(updatedPhotos || []);
      if (updatedPhotos && updatedPhotos.length > 0) {
        setCurrentIndex((prev) => Math.min(prev, updatedPhotos.length - 1));
      } else {
        setCurrentIndex(0);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Next Slide Handler
  const handleNext = () => {
    if (photos.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  // Prev Slide Handler
  const handlePrev = () => {
    if (photos.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  // Lightbox Next / Prev Handlers
  const handleLightboxNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (photos.length === 0) return;
    const nextIndex = (currentIndex + 1) % photos.length;
    setCurrentIndex(nextIndex);
    setActivePhoto(photos[nextIndex]);
  };

  const handleLightboxPrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (photos.length === 0) return;
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    setCurrentIndex(prevIndex);
    setActivePhoto(photos[prevIndex]);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!activePhoto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleLightboxNext();
      } else if (e.key === 'ArrowLeft') {
        handleLightboxPrev();
      } else if (e.key === 'Escape') {
        setActivePhoto(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhoto, currentIndex, photos]);

  // Download Photo Handler
  const handleDownloadPhoto = async (e: React.MouseEvent, photo: GalleryPhoto) => {
    e.stopPropagation();
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const cleanCaption = (photo.caption || 'wedding-photo').replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.download = `${cleanCaption}.jpg`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } catch (err) {
      // Fallback if CORS or local blob fails
      const link = document.createElement('a');
      link.href = photo.url;
      link.target = '_blank';
      link.download = 'wedding-photo.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Auto-play timer
  useEffect(() => {
    if (isAutoplay && !isHovered && !isModalOpen && !activePhoto && photos.length > 0) {
      autoplayRef.current = setInterval(() => {
        handleNext();
      }, 3500);
    }
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [isAutoplay, isHovered, isModalOpen, activePhoto, photos.length]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadPreview && !selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // 1. Upload photo to Cloudinary (free tier unsigned upload endpoint)
      const cloudinaryUrl = await uploadToCloudinary(
        selectedFile || uploadPreview!,
        cloudName,
        uploadPreset
      );

      // 2. Save only the Cloudinary URL and metadata into Firestore
      const newPhoto: GalleryPhoto = {
        id: 'photo-' + Date.now(),
        url: cloudinaryUrl,
        caption: caption.trim() || 'Wedding Memory',
        uploaderName: uploaderName.trim() || 'Guest',
        deviceInfo: deviceInfo.trim() || 'iPhone',
        likes: 1,
        uploadedAt: new Date().toISOString()
      };

      await saveGalleryPhoto(newPhoto);

      // Jump slider to newly uploaded photo (index 0)
      setCurrentIndex(0);

      // Reset state
      setIsUploading(false);
      setSelectedFile(null);
      setUploadPreview(null);
      setCaption('');
      setUploaderName('');
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Failed to upload photo to Cloudinary:', err);
      setIsUploading(false);
      setUploadError(err?.message || 'Failed to upload photo. Please try again.');
    }
  };

  const handleLike = async (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    await likeGalleryPhoto(photoId);
  };

  const currentPhoto = photos.length > 0 ? (photos[currentIndex] || photos[0]) : null;

  return (
    <section className="relative py-24 bg-[#FCFAF7] text-stone-900 overflow-hidden" id="gallery-section">
      <div className="absolute inset-0 bg-radial-gradient from-amber-500/[0.03] via-transparent to-transparent pointer-events-none" />

      {/* Subtle passport guilloche pattern */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#8B1E3F 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }} 
      />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#002147] border border-[#D4AF37]/80 text-amber-200 text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase mb-3 shadow-sm">
            <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>PASSPORT PHOTO ARCHIVE // VISUAL LOGS</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-light text-stone-900 mt-2 mb-4">Photo Gallery</h2>
          <div className="w-28 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
          <p className="text-stone-700 text-sm md:text-base mt-4 max-w-xl mx-auto italic font-serif">
            Celebrate with Venessa &amp; Philemon! Captured memories, candid snapshots, and live wedding moments shared by our beloved guests.
          </p>
        </div>

        {photos.length > 0 ? (
          <>
            {/* iPhone & Upload Callout Banner */}
            <div className="bg-gradient-to-r from-[#002147] via-[#081b3a] to-[#8B1E3F] text-white rounded-2xl p-6 md:p-8 mb-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-[#D4AF37]/40">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 text-amber-300 flex items-center justify-center shrink-0 border border-[#D4AF37]/40">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/25 text-amber-200 text-[10px] uppercase font-sans font-extrabold tracking-wider mb-1">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    <span>Guest Photo Upload</span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl text-amber-100 font-medium">
                    Snap &amp; Share Your Photos
                  </h3>
                  <p className="text-stone-200 text-xs sm:text-sm font-sans mt-1">
                    Side Note: <span className="text-amber-200 font-bold">Latest iPhone photos preferred! 📱✨</span> High quality portrait &amp; action shots welcomed.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="shrink-0 px-6 py-3.5 bg-[#D4AF37] hover:bg-[#b8860b] text-[#002147] hover:text-white font-sans font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-2 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Photo</span>
              </button>
            </div>

            {/* Main Photo Slider Component */}
            <div 
              className="relative max-w-4xl mx-auto bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-800"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Main Slide Image Display */}
              <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden bg-stone-950 flex items-center justify-center group">
                <AnimatePresence mode="wait">
                  {currentPhoto && (
                    <motion.div
                      key={currentPhoto.id}
                      initial={{ opacity: 0, x: 50, scale: 0.98 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -50, scale: 0.98 }}
                      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                      className="relative w-full h-full flex items-center justify-center cursor-pointer"
                      onClick={() => setActivePhoto(currentPhoto)}
                    >
                      <img
                        src={currentPhoto.url}
                        alt={currentPhoto.caption}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {/* Gradient Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity" />
                      
                      {/* Photo Info Banner on Bottom of Slide */}
                      <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 text-white z-10">
                        <div>
                          <div className="flex items-center gap-2 text-amber-300 text-xs font-sans font-semibold tracking-wider uppercase mb-1">
                            <span>Shared by {currentPhoto.uploaderName || 'Guest'}</span>
                          </div>
                          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                            {currentPhoto.caption}
                          </h3>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => handleLike(e, currentPhoto.id)}
                            className="flex items-center gap-1.5 bg-rose-600/90 hover:bg-rose-600 text-white px-3.5 py-2 rounded-full border border-rose-400/40 font-sans text-xs font-bold shadow-md cursor-pointer active:scale-90 transition-all"
                          >
                            <Heart className="w-4 h-4 fill-white" />
                            <span>{currentPhoto.likes || 1}</span>
                          </button>

                          <button
                            onClick={(e) => handleDownloadPhoto(e, currentPhoto)}
                            className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md cursor-pointer transition-all"
                            title="Download Photo"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => { e.stopPropagation(); setActivePhoto(currentPhoto); }}
                            className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md cursor-pointer transition-all"
                            title="View Fullscreen"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95 z-20"
                  aria-label="Previous Photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95 z-20"
                  aria-label="Next Photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Top Bar Indicators (Counter & AutoPlay Toggle) */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
                  <div className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-semibold tracking-wider">
                    {currentIndex + 1} / {photos.length}
                  </div>

                  <button
                    onClick={() => setIsAutoplay(!isAutoplay)}
                    className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-sans font-medium cursor-pointer transition-all"
                  >
                    {isAutoplay ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-amber-300" />
                        <span>Autoplay On</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Paused</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Thumbnail Ribbon Selector */}
              <div className="bg-stone-900 p-4 border-t border-stone-800 flex items-center gap-3 overflow-x-auto scrollbar-none">
                {photos.map((photo, idx) => (
                  <button
                    key={photo.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      idx === currentIndex 
                        ? 'border-amber-400 scale-105 shadow-md shadow-amber-400/20' 
                        : 'border-transparent opacity-50 hover:opacity-100 hover:scale-100'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>

              {/* Dot Indicators */}
              <div className="bg-stone-950 py-3 flex items-center justify-center gap-2 border-t border-stone-900">
                {photos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex ? 'w-8 bg-amber-400' : 'w-2 bg-stone-700 hover:bg-stone-500'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Clean, elegant empty state */
          <div className="relative max-w-2xl mx-auto bg-white border-2 border-[#D4AF37]/50 rounded-3xl p-8 sm:p-14 text-center shadow-[0_8px_30px_rgba(0,33,71,0.06)] overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#D4AF37] p-1.5 flex items-center justify-center mb-5 bg-[#FCFAF7] shadow-inner">
                <div className="w-full h-full rounded-full bg-[#002147] flex items-center justify-center text-[#D4AF37] shadow-sm">
                  <Camera className="w-8 h-8" />
                </div>
              </div>

              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.25em] text-[#002147] uppercase mb-2">
                PASSPORT MEMORY LOG • READY FOR MOMENTS
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
                Wedding Photo Stream
              </h3>

              <p className="font-serif italic text-stone-600 max-w-lg mx-auto text-sm sm:text-base mb-8 leading-relaxed">
                No photos have been uploaded yet. During the ceremony and reception, guests can snap and share their favorite moments to be featured live in this gallery.
              </p>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-3.5 bg-[#002147] hover:bg-[#081b3a] border-2 border-[#D4AF37] text-amber-100 font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-[0_4px_18px_rgba(0,33,71,0.25)] hover:shadow-[0_6px_22px_rgba(212,175,55,0.35)] flex items-center gap-2.5 active:scale-95"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>Upload First Photo</span>
              </button>

              <div className="mt-8 pt-6 border-t border-dashed border-stone-200 w-full flex flex-wrap items-center justify-center gap-6 text-[10px] font-mono text-stone-600 uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-[#002147] font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  LIVE CLOUD SYNC
                </span>
                <span className="text-[#D4AF37] font-bold">•</span>
                <span className="flex items-center gap-1.5 text-[#002147] font-semibold">
                  <Smartphone className="w-3.5 h-3.5 text-[#002147]" />
                  HIGH RESOLUTION
                </span>
                <span className="text-[#D4AF37] font-bold">•</span>
                <span className="flex items-center gap-1.5 text-[#002147] font-semibold">
                  <Cloud className="w-3.5 h-3.5 text-sky-600" />
                  INSTANT SHARING
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-amber-50 text-amber-700 border border-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">Upload Wedding Photo</h3>
                <div className="flex items-center justify-center gap-1.5 mt-1 text-xs text-stone-500 font-sans">
                  <Cloud className="w-3.5 h-3.5 text-sky-600" />
                  <span>Images stored via Cloudinary &amp; synced with Firestore</span>
                </div>
              </div>

              {uploadError && (
                <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-sans flex items-start gap-2">
                  <X className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                  <div>
                    <span className="font-bold block">Upload Error</span>
                    <span>{uploadError}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                {/* Photo Dropzone / Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-stone-600">Select Image</label>
                  {uploadPreview ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-stone-200 bg-stone-100">
                      <img src={uploadPreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setUploadPreview(null);
                          setSelectedFile(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-stone-900/80 text-white rounded-full hover:bg-black cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-stone-300 hover:border-maroon-700 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-stone-50/50 hover:bg-maroon-50/20 transition-all">
                      <ImageIcon className="w-8 h-8 text-stone-400 mb-2" />
                      <span className="text-xs font-bold text-stone-700 font-sans">Click to browse or drop photo</span>
                      <span className="text-[10px] text-stone-500 font-sans mt-1">PNG, JPG, HEIC up to 10MB</span>
                      <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                    </label>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-stone-600">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aunt Sarah / Groom's Cousin"
                    value={uploaderName}
                    onChange={(e) => setUploaderName(e.target.value)}
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-maroon-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-stone-600">Photo Caption</label>
                  <input
                    type="text"
                    placeholder="e.g. The beautiful couple cutting cake!"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-maroon-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!uploadPreview || isUploading}
                  className="w-full py-3.5 bg-maroon-800 hover:bg-maroon-900 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Uploading to Cloudinary...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload &amp; Save to Gallery</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal with Scroll Navigation & Download */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-md cursor-pointer select-none"
            onClick={() => setActivePhoto(null)}
          >
            {/* Top Toolbar */}
            <div 
              className="absolute top-4 inset-x-4 max-w-5xl mx-auto flex items-center justify-between z-30 pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Counter */}
              <div className="px-3.5 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-semibold tracking-wider shadow-lg">
                {currentIndex + 1} / {photos.length}
              </div>

              {/* Action Buttons: Download & Close */}
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={(e) => handleDownloadPhoto(e, activePhoto)}
                  className="text-white hover:text-amber-300 bg-stone-900/80 hover:bg-stone-900 px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md transition-all shadow-lg text-xs font-sans font-semibold flex items-center gap-1.5 cursor-pointer"
                  title="Download Photo"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Download</span>
                </button>

                <button
                  onClick={() => setActivePhoto(null)}
                  className="text-white hover:text-rose-300 bg-stone-900/80 hover:bg-stone-900 px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md transition-all shadow-lg text-xs font-sans font-semibold flex items-center gap-1.5 cursor-pointer"
                  aria-label="Close photo view"
                >
                  <span>Close</span>
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Left Scroll Navigation Button */}
            <button
              onClick={handleLightboxPrev}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl cursor-pointer transition-all hover:scale-110 active:scale-90 z-30"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-7 h-7 text-amber-200" />
            </button>

            {/* Right Scroll Navigation Button */}
            <button
              onClick={handleLightboxNext}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl cursor-pointer transition-all hover:scale-110 active:scale-90 z-30"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-7 h-7 text-amber-200" />
            </button>

            {/* Main Lightbox Card */}
            <div 
              className="relative max-h-[85vh] max-w-[88vw] sm:max-w-[80vw] flex flex-col items-center cursor-default z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/15 bg-stone-950 flex flex-col items-center max-w-full">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activePhoto.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    src={activePhoto.url}
                    alt={activePhoto.caption}
                    className="max-h-[68vh] sm:max-h-[72vh] w-auto max-w-full object-contain"
                  />
                </AnimatePresence>

                <div className="w-full p-4 sm:p-5 bg-stone-950/95 text-white border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div>
                    <h4 className="font-serif text-lg sm:text-xl font-medium text-amber-200 leading-snug">{activePhoto.caption}</h4>
                    <p className="text-xs text-stone-400 font-sans mt-0.5">Shared by {activePhoto.uploaderName || 'Guest'}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => handleLike(e, activePhoto.id)}
                      className="flex items-center gap-1.5 bg-rose-600/90 hover:bg-rose-600 text-white px-3.5 py-1.5 rounded-full border border-rose-400/40 font-sans text-xs font-bold shadow-md cursor-pointer active:scale-90 transition-all"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>{activePhoto.likes || 1}</span>
                    </button>

                    <button
                      onClick={(e) => handleDownloadPhoto(e, activePhoto)}
                      className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-3.5 py-1.5 rounded-full border border-amber-400/30 font-sans text-xs font-semibold cursor-pointer active:scale-90 transition-all"
                      title="Download Photo"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

