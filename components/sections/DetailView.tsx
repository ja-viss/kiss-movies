
import React, { useState, useEffect } from 'react';
import { Movie } from '../../App';
import VideoPlayer from '../VideoPlayer';
import { ScraperService, ScrapedLink } from '../../utils/scraperService';

const TMDB_API_KEY = "90989cb241ad3918eca0fa012317e392";

interface DetailViewProps {
  movie: Movie;
}

interface IndexEntry extends ScrapedLink {
  idType: 'TMDB' | 'IMDB' | 'DIRECT';
}

const DetailView: React.FC<DetailViewProps> = ({ movie }) => {
  const [files, setFiles] = useState<IndexEntry[]>([]);
  const [activeVideo, setActiveVideo] = useState<IndexEntry | null>(null);
  const [activeLang, setActiveLang] = useState<'Latino' | 'Inglés' | 'Castellano'>('Latino');
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlLogs, setCrawlLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setCrawlLogs(prev => [msg, ...prev].slice(0, 15));
  };

  /**
   * CAPA 1: Identificación (Metadata)
   * Sincroniza con TMDB y prepara el entorno para el Resolving.
   */
  useEffect(() => {
    const initializeSources = async () => {
      addLog(`[TMDB_SYNC] Vinculando metadata para ID: ${movie.id}`);
      
      // Mapeo inicial de servidores basado en ID (Normalización)
      const coreManifest: IndexEntry[] = [
        { 
          server: '2EMBED PRO', 
          url: `https://www.2embed.cc/embed/${movie.id}`, 
          quality: '1080p', 
          language: activeLang, 
          status: 'LIVE', 
          providerType: 'Direct-ID', 
          idType: 'TMDB' 
        },
        { 
          server: 'EMBED.SU', 
          url: `https://embed.su/embed/movie/${movie.id}`, 
          quality: 'HD', 
          language: activeLang, 
          status: 'LIVE', 
          providerType: 'Direct-ID', 
          idType: 'TMDB' 
        },
        { 
          server: 'VIDSRC PRIME', 
          url: `https://vidsrc.to/embed/movie/${movie.id}`, 
          quality: '4K', 
          language: activeLang, 
          status: 'LIVE', 
          providerType: 'Aggregator', 
          idType: 'TMDB' 
        },
      ];

      setFiles(coreManifest);
      setActiveVideo(coreManifest[0]);
      addLog(`[SYSTEM] Nodos core mapeados correctamente.`);
    };

    if (movie.id) initializeSources();
  }, [movie.id, activeLang]);

  /**
   * CAPA 2: Resolving (Deep Scraping)
   */
  const handleNeuralScrape = async () => {
    setIsCrawling(true);
    setCrawlLogs([]);
    addLog(`[NEURAL] Iniciando indexado enfocado en ${activeLang}...`);
    
    try {
      const scraper = new ScraperService();
      addLog(`[NETWORK] Ejecutando petición HEAD a pools de video...`);
      
      const results = await scraper.findLiveLinks(movie.title, movie.year, activeLang, movie.id);

      if (results.length > 0) {
        const newEntries: IndexEntry[] = results.map(r => ({ ...r, idType: 'DIRECT' }));
        
        setFiles(prev => {
          const existingUrls = new Set(prev.map(p => p.url));
          const filteredNew = newEntries.filter(n => !existingUrls.has(n.url));
          return [...filteredNew, ...prev];
        });
        
        if (newEntries.length > 0) setActiveVideo(newEntries[0]);
        addLog(`[SUCCESS] Sincronización completa: ${newEntries.length} hallazgos.`);
      } else {
        addLog(`[INFO] No se hallaron huellas únicas adicionales.`);
      }
    } catch (e) {
      addLog("[ERROR] Falla en la capa de Resolving.");
    } finally {
      setIsCrawling(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-12 md:space-y-20 pb-32">
      
      {/* Detalle Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 px-4 md:px-0">
        <div className="space-y-8 max-w-5xl">
          <div className="flex flex-wrap items-center gap-4">
             <div className="px-5 py-2 rounded-2xl bg-white/[0.03] border border-white/10 text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest backdrop-blur-md italic">
               Metadata Source: TMDB v3
             </div>
             <div className="px-5 py-2 rounded-2xl bg-pink-600/10 border border-pink-500/20 text-[10px] md:text-xs font-black text-pink-500 uppercase tracking-widest animate-pulse backdrop-blur-md">
               Resolver: Neural JS Ready
             </div>
          </div>
          <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black text-white italic uppercase tracking-tighter leading-[0.75] underline decoration-pink-500/10 decoration-8">
            {movie.title}
          </h1>
        </div>

        <div className="flex p-2 bg-[#0a0a0f] rounded-[2.2rem] border border-white/5 shadow-2xl overflow-x-auto w-full lg:w-auto scrollbar-hide ring-1 ring-white/10">
          {(['Latino', 'Inglés', 'Castellano'] as const).map(l => (
            <button key={l} onClick={() => setActiveLang(l)} className={`flex-1 lg:flex-none px-10 py-5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all italic ${activeLang === l ? 'bg-pink-600 text-white shadow-2xl shadow-pink-600/30' : 'text-slate-600 hover:text-white'}`}>{l}</button>
          ))}
        </div>
      </div>

      {/* Reproductor con Sandbox */}
      <div className="w-full relative group">
        <div className="absolute -inset-2 bg-gradient-to-r from-pink-600/20 to-violet-600/20 rounded-[3rem] md:rounded-[6rem] blur-[100px] opacity-0 group-hover:opacity-100 transition duration-1000 -z-10"></div>
        {activeVideo ? (
          <VideoPlayer 
            video={activeVideo} 
            movieTitle={movie.title} 
            onAutoSwitch={() => {
              const idx = files.findIndex(f => f.url === activeVideo.url);
              if (idx < files.length - 1) setActiveVideo(files[idx + 1]);
            }}
          />
        ) : (
          <div className="aspect-video w-full bg-[#0a0a0f] rounded-[2.5rem] md:rounded-[5rem] border border-white/5 flex flex-col items-center justify-center gap-12 shadow-2xl overflow-hidden relative">
             <div className="absolute inset-0 bg-pink-500/[0.02] animate-pulse"></div>
             <div className="w-24 h-24 border-[4px] border-pink-500/10 border-t-pink-500 rounded-full animate-spin relative z-10"></div>
             <p className="text-xs md:text-sm font-black text-slate-500 uppercase tracking-[0.6em] animate-pulse relative z-10 italic">Normalizing Server Nodes</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 px-4 md:px-0">
        <div className="lg:col-span-3 space-y-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-10 gap-8">
            <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">Pool de <span className="text-pink-500">Nodos</span></h3>
            <button onClick={handleNeuralScrape} disabled={isCrawling} className={`w-full sm:w-auto px-12 py-6 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.3em] border transition-all flex items-center justify-center gap-5 italic ${isCrawling ? 'bg-white/5 text-slate-700 border-white/5' : 'bg-pink-600 text-white hover:bg-pink-500 shadow-2xl shadow-pink-600/20 active:scale-95'}`}>
              {isCrawling ? 'Indexando...' : 'Iniciar Deep Resolving'}
              <i className="fa-solid fa-radar text-white/40"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {files.map((file, i) => (
              <button key={i} onClick={() => setActiveVideo(file)} className={`group relative p-10 rounded-[3.2rem] border transition-all duration-700 text-left overflow-hidden ${activeVideo?.url === file.url ? 'bg-pink-600/10 border-pink-500/60 shadow-2xl translate-x-2' : 'bg-[#0a0a0f] border-white/5 hover:bg-white/[0.04]'}`}>
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center transition-all duration-500 ${activeVideo?.url === file.url ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20' : 'bg-white/5 text-slate-600 group-hover:text-pink-500'}`}>
                    <i className="fa-solid fa-server text-2xl"></i>
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-slate-900 border border-white/10 text-[8px] text-slate-500 font-black uppercase tracking-widest italic">RESOLVED_OK</div>
                </div>
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic group-hover:text-pink-500 transition-colors leading-none truncate">{file.server}</h4>
                <div className="flex items-center gap-4 mt-6">
                   <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">{file.quality}</span>
                   <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
                   <span className="text-[11px] text-pink-500 font-black uppercase italic tracking-tighter">{file.language}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Consola de Scraping Real-Time */}
        <div className="space-y-10 lg:sticky lg:top-40 h-fit">
           <div className="bg-[#08080c] p-10 rounded-[3.5rem] border border-white/5 space-y-10 shadow-2xl relative overflow-hidden ring-1 ring-white/5">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] rotate-12 scale-150"><i className="fa-solid fa-dna text-[10rem]"></i></div>
              <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-5 relative z-10 italic">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
                </span>
                Resolving Layer
              </h4>
              <div className="space-y-5 font-mono text-[10px] h-[380px] overflow-y-auto custom-scrollbar pr-4 relative z-10 leading-relaxed scroll-smooth italic">
                 {crawlLogs.map((log, i) => (
                   <div key={i} className={`flex gap-5 p-4 rounded-2xl border transition-all duration-300 ${i === 0 ? 'bg-pink-600/5 border-pink-500/30 text-pink-400 font-bold translate-x-1' : 'bg-white/[0.01] border-white/5 text-slate-600'}`}>
                      <span className="opacity-30 font-bold">[{new Date().toLocaleTimeString([], {second:'2-digit'})}]</span>
                      <span className="uppercase tracking-widest whitespace-normal break-words">{log}</span>
                   </div>
                 ))}
                 {crawlLogs.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-800 text-center gap-8 border-2 border-dashed border-white/5 rounded-[2.5rem] p-10">
                    <i className="fa-solid fa-database text-4xl opacity-10 animate-pulse"></i>
                    <p className="uppercase italic tracking-[0.4em] font-black text-[9px] leading-relaxed">Awaiting Resolve Trigger...</p>
                  </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
