import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Download, Volume2, VolumeX, X, FastForward } from 'lucide-react';

interface AudioTrack {
  title: string;
  subtitle: string;
  audioUrl: string;
}

interface AudioPlayerBarProps {
  currentTrack: AudioTrack | null;
  onCloseTrack: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentTrack,
  onCloseTrack
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleSpeedChange = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-[var(--border-color)] px-4 py-3 shadow-2xl transition-all">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Track Metadata */}
        <div className="flex items-center gap-3 w-full md:w-1/4">
          <div className="w-10 h-10 rounded-xl bg-[var(--gold-primary)]/20 border border-[var(--gold-primary)] flex items-center justify-center text-[var(--gold-primary)] font-bold text-lg flex-shrink-0 animate-pulse">
            🔊
          </div>
          <div className="truncate">
            <h4 className="text-sm font-bold text-[var(--gold-light)] truncate">{currentTrack.title}</h4>
            <p className="text-xs text-[var(--text-muted)] truncate">{currentTrack.subtitle}</p>
          </div>
        </div>

        {/* Player Controls & Progress Slider */}
        <div className="flex flex-col items-center gap-1.5 w-full md:w-2/4">
          <div className="flex items-center gap-4">
            
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-[var(--gold-primary)] text-black flex items-center justify-center font-bold hover:scale-105 transition shadow-lg shadow-[var(--gold-primary)]/30"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black mr-0.5" />}
            </button>

            {/* Speed Option */}
            <button
              onClick={handleSpeedChange}
              className="text-xs font-bold px-2 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--gold-soft)] hover:bg-[var(--bg-card-hover)]"
              title="سرعة التشغيل"
            >
              {playbackSpeed}x
            </button>

            {/* Volume Toggle */}
            <button
              onClick={toggleMute}
              className="text-[var(--text-muted)] hover:text-[var(--gold-primary)] transition"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Timeline Bar */}
          <div className="flex items-center gap-2 w-full text-[10px] text-[var(--text-muted)] dir-ltr font-mono">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 accent-[var(--gold-primary)] h-1 bg-[var(--bg-card-hover)] rounded-lg cursor-pointer"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Extra Tools */}
        <div className="flex items-center justify-end gap-2 w-full md:w-1/4">
          <a
            href={currentTrack.audioUrl}
            download
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] transition text-xs flex items-center gap-1"
            title="تحميل المقطع الصوتي"
          >
            <Download className="w-4 h-4 text-[var(--gold-primary)]" />
            <span className="hidden sm:inline">تحميل</span>
          </a>

          <button
            onClick={onCloseTrack}
            className="p-2 rounded-xl bg-[var(--bg-card)] text-red-400 hover:bg-red-500/10 border border-red-500/20 transition"
            title="إغلاق المشغل"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
