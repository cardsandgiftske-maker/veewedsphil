import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Volume2, VolumeX, Play, Pause, Upload, Check, Trash2, Sparkles, X } from 'lucide-react';
import { getCustomAudio, saveCustomAudio, deleteCustomAudio } from '../lib/audioStorage';

interface MusicPlayerProps {
  shouldPlay: boolean;
}

interface AudioPreset {
  id: string;
  name: string;
  description: string;
  youtubeId: string;
}

const PRESETS: AudioPreset[] = [
  {
    id: 'piano-instrumental',
    name: 'Gratitude (Piano & Strings Instrumental)',
    description: 'Gentle acoustic piano & strings wedding cover (5:48)',
    youtubeId: '-UIxUGbQDJw',
  },
  {
    id: 'acoustic-version',
    name: 'Gratitude (Acoustic - Brandon Lake)',
    description: 'Acoustic live worship performance',
    youtubeId: 'N4M2Jz_C97s',
  },
  {
    id: 'original-version',
    name: 'Gratitude (Original Radio Track)',
    description: 'Official Brandon Lake track',
    youtubeId: 'ffszHwWyRQc',
  },
];

export default function MusicPlayer({ shouldPlay }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('piano-instrumental');
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [customAudioName, setCustomAudioName] = useState<string | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPreset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];

  // Load custom audio from IndexedDB on startup
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const stored = await getCustomAudio();
        if (stored && active) {
          const url = URL.createObjectURL(stored.blob);
          setCustomAudioUrl(url);
          setCustomAudioName(stored.name);
        }
      } catch (err) {
        console.error('Error restoring custom audio:', err);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // Send command to YouTube iframe player
  const sendPlayerCommand = (func: string, args: any[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: func,
            args: args,
          }),
          '*'
        );
      } catch (e) {
        console.error('Error sending player command:', e);
      }
    }
  };

  // Play/Pause toggler
  const togglePlay = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (isPlaying) {
      if (customAudioUrl && audioRef.current) {
        audioRef.current.pause();
      } else {
        sendPlayerCommand('pauseVideo');
      }
      setIsPlaying(false);
    } else {
      if (customAudioUrl && audioRef.current) {
        audioRef.current.play().catch((err) => console.log('Audio play error:', err));
        audioRef.current.muted = isMuted;
      } else {
        sendPlayerCommand('playVideo');
        if (isMuted) {
          sendPlayerCommand('unMute');
          setIsMuted(false);
        }
      }
      setIsPlaying(true);
    }
  };

  // Mute/Unmute toggler
  const toggleMute = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (isMuted) {
      if (customAudioUrl && audioRef.current) {
        audioRef.current.muted = false;
        if (!isPlaying) {
          audioRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      } else {
        sendPlayerCommand('unMute');
        if (!isPlaying) {
          sendPlayerCommand('playVideo');
          setIsPlaying(true);
        }
      }
      setIsMuted(false);
    } else {
      if (customAudioUrl && audioRef.current) {
        audioRef.current.muted = true;
      } else {
        sendPlayerCommand('mute');
      }
      setIsMuted(true);
    }
  };

  // Handle auto-playback when trigger changes to true (envelope open)
  useEffect(() => {
    if (shouldPlay) {
      const timer = setTimeout(() => {
        if (customAudioUrl && audioRef.current) {
          audioRef.current.volume = 0.5;
          audioRef.current.muted = false;
          audioRef.current.play().then(() => {
            setIsPlaying(true);
            setIsMuted(false);
          }).catch(() => {});
        } else if (iframeLoaded) {
          sendPlayerCommand('setVolume', [45]);
          sendPlayerCommand('unMute');
          sendPlayerCommand('playVideo');
          setIsPlaying(true);
          setIsMuted(false);
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [shouldPlay, iframeLoaded, customAudioUrl]);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Create object URL for immediate playback
      const url = URL.createObjectURL(file);
      setCustomAudioUrl(url);
      setCustomAudioName(file.name);

      // Stop any existing YouTube playback
      sendPlayerCommand('pauseVideo');

      // Persist in IndexedDB
      await saveCustomAudio(file, file.name);

      // Start playing the newly uploaded track
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
        setIsMuted(false);
      }
    } catch (err) {
      console.error('Failed to load audio file:', err);
    }
  };

  const handleResetAudio = async () => {
    if (customAudioUrl) {
      URL.revokeObjectURL(customAudioUrl);
    }
    setCustomAudioUrl(null);
    setCustomAudioName(null);
    await deleteCustomAudio();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    // Switch back to YouTube stream
    setTimeout(() => {
      sendPlayerCommand('playVideo');
      setIsPlaying(true);
    }, 150);
  };

  const activeTrackTitle = customAudioName
    ? customAudioName.replace(/\.[^/.]+$/, '')
    : currentPreset.name;

  return (
    <>
      {/* Invisible HTML5 Audio Element for custom uploaded tracks */}
      <audio
        ref={audioRef}
        src={customAudioUrl || undefined}
        loop
        preload="auto"
        onEnded={() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        }}
      />

      {/* Invisible YouTube Iframe Player for default background music */}
      {!customAudioUrl && (
        <iframe
          ref={iframeRef}
          id="youtube-bg-player"
          width="1"
          height="1"
          src={`https://www.youtube.com/embed/${currentPreset.youtubeId}?enablejsapi=1&autoplay=0&controls=0&loop=1&playlist=${currentPreset.youtubeId}&origin=${typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''}`}
          allow="autoplay; encrypted-media"
          className="fixed -left-10 -top-10 w-[1px] h-[1px] opacity-0 pointer-events-none z-0"
          onLoad={() => setIframeLoaded(true)}
          title={`Background Music: ${currentPreset.name}`}
        />
      )}

      {/* Hidden File Input for Custom Audio/Video Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,video/mp4,video/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Floating Interactive Audio Hub Control */}
      <AnimatePresence>
        {shouldPlay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="fixed bottom-24 right-4 sm:right-6 z-45"
            id="music-control-floating-widget"
          >
            <div className="relative">
              {/* Settings / Track Switcher Popover */}
              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-full right-0 mb-3 w-80 sm:w-92 bg-[#FCFAF7] border border-[#D4AF37]/60 rounded-2xl shadow-2xl p-4 z-50 text-stone-800 backdrop-blur-md"
                  >
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2.5 mb-3">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#002147]">
                        <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Background Music Settings</span>
                      </div>
                      <button
                        onClick={() => setIsSettingsOpen(false)}
                        className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all cursor-pointer"
                        aria-label="Close music settings"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Custom Audio Upload Section */}
                    <div className="mb-3 p-3 bg-amber-50/60 border border-[#D4AF37]/30 rounded-xl">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-[#002147] flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5 text-[#8B1E3F]" />
                          Custom Audio File
                        </span>
                        {customAudioUrl && (
                          <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                            Active
                          </span>
                        )}
                      </div>

                      {customAudioName ? (
                        <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-[#D4AF37]/20">
                          <span className="text-xs text-stone-700 truncate font-mono max-w-[190px]">
                            {customAudioName}
                          </span>
                          <button
                            onClick={handleResetAudio}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded cursor-pointer transition-all flex items-center gap-1 text-[11px]"
                            title="Reset to default stream"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Reset</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full mt-1.5 py-2 px-3 bg-[#002147] hover:bg-[#081b3a] text-amber-200 border border-[#D4AF37]/80 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-xs"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Upload Audio / Video File</span>
                        </button>
                      )}
                      <p className="text-[10px] text-stone-500 mt-1 leading-tight">
                        Supports MP3, M4A, WAV, or MP4 files directly.
                      </p>
                    </div>

                    {/* Preset Playlist Renditions */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider font-semibold block px-1">
                        Gratitude Renditions
                      </span>
                      {PRESETS.map((preset) => {
                        const isSelected = !customAudioUrl && selectedPresetId === preset.id;
                        return (
                          <button
                            key={preset.id}
                            onClick={() => {
                              if (customAudioUrl) {
                                handleResetAudio();
                              }
                              setSelectedPresetId(preset.id);
                              setTimeout(() => {
                                sendPlayerCommand('playVideo');
                                setIsPlaying(true);
                              }, 150);
                            }}
                            className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-start gap-2 cursor-pointer ${
                              isSelected
                                ? 'bg-[#002147] text-amber-100 border border-[#D4AF37] font-semibold shadow-xs'
                                : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/80 hover:border-[#D4AF37]/50'
                            }`}
                          >
                            <div className={`mt-0.5 shrink-0 ${isSelected ? 'text-[#D4AF37]' : 'text-stone-400'}`}>
                              {isSelected ? <Check className="w-3.5 h-3.5" /> : <Music className="w-3.5 h-3.5" />}
                            </div>
                            <div className="overflow-hidden">
                              <p className="truncate font-medium">{preset.name}</p>
                              <p className={`text-[10px] truncate ${isSelected ? 'text-amber-200/80' : 'text-stone-400'}`}>
                                {preset.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Floating Pill Widget */}
              <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md border border-[#D4AF37]/50 rounded-full p-1.5 shadow-[0_8px_30px_rgba(0,33,71,0.15)] hover:shadow-[0_10px_35px_rgba(0,33,71,0.2)] hover:border-[#D4AF37] transition-all group">
                {/* Play/Pause Button with Pulsing Bars */}
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-[#002147] border border-[#D4AF37] flex items-center justify-center text-amber-200 hover:bg-[#081b3a] hover:text-amber-100 transition-all cursor-pointer relative overflow-hidden group/btn shadow-xs"
                  title={isPlaying ? 'Pause Music' : 'Play Music'}
                  aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
                >
                  {isPlaying ? (
                    <div className="flex items-end gap-[2px] h-3">
                      <span className="w-[2px] h-2 bg-current rounded-full animate-pulse" style={{ animationDuration: '0.6s' }} />
                      <span className="w-[2px] h-3 bg-current rounded-full animate-pulse" style={{ animationDuration: '0.8s', animationDelay: '0.15s' }} />
                      <span className="w-[2px] h-1.5 bg-current rounded-full animate-pulse" style={{ animationDuration: '0.5s', animationDelay: '0.3s' }} />
                      <span className="w-[2px] h-2.5 bg-current rounded-full animate-pulse" style={{ animationDuration: '0.7s', animationDelay: '0.05s' }} />
                    </div>
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                {/* Track Label Button (Opens Settings) */}
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="flex items-center gap-1.5 pr-2 pl-1 font-serif text-xs font-medium tracking-tight text-stone-700 hover:text-[#002147] transition-all cursor-pointer text-left select-none"
                  title="Click to view song options or upload custom audio"
                >
                  <div className="flex flex-col">
                    <span className="max-w-[110px] sm:max-w-[140px] truncate text-[#002147] font-semibold text-[11px] sm:text-xs">
                      {activeTrackTitle}
                    </span>
                    <span className="text-[9px] text-stone-400 font-mono flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                      <span>{customAudioUrl ? 'Custom File' : 'Piano & Strings'}</span>
                    </span>
                  </div>
                </button>

                <div className="w-[1px] h-4 bg-stone-200 mx-0.5" />

                {/* Mute/Unmute Button */}
                <button
                  onClick={toggleMute}
                  className="p-1.5 text-stone-500 hover:text-[#002147] active:scale-90 transition-all cursor-pointer rounded-full hover:bg-stone-100"
                  title={isMuted ? 'Unmute Music' : 'Mute Music'}
                  aria-label={isMuted ? 'Unmute Music' : 'Mute Music'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-red-500" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-[#002147]" />
                  )}
                </button>

                {/* Audio Settings Toggle Button */}
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    isSettingsOpen
                      ? 'bg-[#002147] text-amber-200'
                      : 'text-stone-400 hover:text-[#002147] hover:bg-stone-100'
                  }`}
                  title="Audio options & file upload"
                  aria-label="Audio options & file upload"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
