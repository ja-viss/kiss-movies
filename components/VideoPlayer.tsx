
import React, { useState, useEffect, useRef } from 'react';

interface VideoPlayerProps {
  video: {
    server: string;
    url: string;
    quality: string;
    providerType: string;
    language?: string;
  };
  movieTitle: string;
  onAutoSwitch?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, movieTitle, onAutoSwitch }) => {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setStatus('loading');
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    // Watchdog de seguridad (12 segundos para YouTube, 20 para otros)
    const delay = video.server.includes('YOUTUBE') ? 12000 : 20000;
    timeoutRef.current = window.setTimeout(() => {
      if (status === 'loading') setStatus('error');
    }, delay);

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [video.url, video.server]);

  const handleLoad = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setStatus('ready');
  };

  const isYouTube = video.url.includes('youtube.com');

  return (
    <div className="relative aspect-video w-full bg-[#020205] rounded-[4rem] md:rounded-[6rem] overflow-hidden border border-white/5 shadow-2xl group ring-1 ring-white/10">
      
      <iframe
        ref={iframeRef}
        src={video.url}
        className={`w-full h-full border-0 transition-all duration-1000 ${status === 'ready' ? 'opacity-100 scale-100' : 'opacity-0 scale-110 blur-3xl'}`}
        allowFullScreen
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture;"
        onLoad={handleLoad}
        referrerPolicy="no-referrer"
        title={`${movieTitle} - ${video.server}`}
      />

      {/* Loading HUD Premium */}
      {status === 'loading' && (
        <div className="absolute inset-0 bg-[#050508] flex flex-col items-center justify-center gap-14 z-20">
          <div className="relative">
            <div className={`w-36 h-36 border-[4px] rounded-full animate-spin ${isYouTube ? 'border-red-500/10 border-t-red-500' : 'border-pink-500/10 border-t-pink-500'}`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <i className={`fa-solid ${isYouTube ? 'fa-brands fa-youtube' : 'fa-bolt'} text-3xl opacity-30 animate-pulse`}></i>
            </div>
          </div>
          <div className="text-center space-y-6">
            <p className="text-white font-black uppercase tracking-[0.8em] text-[10px] animate-pulse italic">
              Validando Nodo: {video.server}
            </p>
            <div className="flex items-center justify-center gap-8 italic">
               <span className="text-[9px] font-mono text-emerald-500 uppercase font-black">Handshake Active</span>
               <div className="w-2 h-2 bg-emerald-500/30 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      )}

      {/* Error / Offline View with Switcher */}
      {status === 'error' && (
        <div className="absolute inset-0 bg-[#050508] flex flex-col items-center justify-center gap-12 z-20 px-16 text-center">
          <div className="w-28 h-28 bg-red-600/10 rounded-[3rem] flex items-center justify-center border border-red-600/20 shadow-red-600/10 shadow-2xl animate-bounce">
             <i className="fa-solid fa-triangle-exclamation text-red-600 text-4xl"></i>
          </div>
          <div className="space-y-6">
            <h4 className="text-white font-black uppercase tracking-tighter text-4xl italic">Enlace No Disponible</h4>
            <p className="text-slate-500 text-xs max-w-sm mx-auto italic leading-relaxed uppercase tracking-widest">
              El nodo {video.server} ha reportado una falla de integridad o restricción de zona.
            </p>
            <button 
              onClick={onAutoSwitch} 
              className="mt-8 px-12 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-pink-500 hover:text-white transition-all shadow-2xl"
            >
              Conmutar a Nodo de Respaldo
            </button>
          </div>
        </div>
      )}

      {/* Information Overlay */}
      <div className="absolute bottom-12 left-12 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 z-10 hidden md:block">
        <div className="px-10 py-6 bg-black/70 backdrop-blur-3xl rounded-[3rem] border border-white/10 flex items-center gap-8 shadow-2xl ring-1 ring-white/10">
          <div className={`w-3 h-3 rounded-full ${status === 'ready' ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-red-500 animate-pulse'}`}></div>
          <div className="flex flex-col">
            <span className="text-[12px] font-black text-white uppercase tracking-widest italic">{video.server}</span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Latency: Verified OK</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
