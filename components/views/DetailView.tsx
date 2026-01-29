import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Movie, YoutubeVideo } from '../../App';
import VideoPlayer from '../VideoPlayer';
import { ScraperService, ScrapedLink } from '../../utils/scraperService';

const TMDB_API_KEY = "90989cb241ad3918eca0fa012317e392";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original";

interface DetailViewProps {
  movie: Movie;
}

interface IndexEntry extends ScrapedLink {
  idType: 'FAST_NODE' | 'YT_NODE' | 'PLAYLIST_NODE' | 'COLLECTION_NODE';
}

const DetailView: React.FC<DetailViewProps> = ({ movie }) => {
  const [files, setFiles] = useState<IndexEntry[]>([]);
  const [activeVideo, setActiveVideo] = useState<IndexEntry | null>(null);
  const [collectionVideos, setCollectionVideos] = useState<YoutubeVideo[]>([]);
  const [isResolving, setIsResolving] = useState(false);
  const [engineTrace, setEngineTrace] = useState<string[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const watchdogRef = useRef<number | null>(null);

  const addTrace = (msg: string) => {
    setEngineTrace(prev => [msg, ...prev].slice(0, 15));
  };

  const fastResolve = useCallback(async (imdbId?: string) => {
    setIsResolving(true);
    setFiles([]);
    setActiveVideo(null);
    const scraper = new ScraperService();

    // MODO COLECCIÓN (GÉNERO YOUTUBE)
    if (movie.isCollection && movie.searchQuery) {
      addTrace(`🔍 INDEX_SEARCH: Analizando clúster de YouTube para "${movie.searchQuery}"`);
      const videos = await scraper.fetchYoutubeCollection(movie.searchQuery);
      setCollectionVideos(videos);
      
      if (videos.length > 0) {
        const firstEntry: IndexEntry = {
          server: 'YOUTUBE_PRIMARY_NODE',
          url: `https://www.youtube.com/embed/${videos[0].id}?autoplay=1&rel=0&modestbranding=1`,
          quality: '1080p',
          language: 'Español',
          status: 'LIVE',
          providerType: 'Collection-Sync-v4',
          idType: 'COLLECTION_NODE',
          latency: 2
        };
        setFiles([firstEntry]);
        setActiveVideo(firstEntry);
        addTrace(`✅ READY: Galería dinámica de ${videos.length} videos vinculada.`);
      } else {
        addTrace(`❌ FAIL: No se hallaron archivos reproducibles.`);
      }
      setIsResolving(false);
      return;
    }
    
    // MODO PELÍCULA / PLAYLIST TRADICIONAL
    const isYT = movie.id.startsWith('yt_');
    const nativeId = movie.id.replace('yt_', '');
    addTrace(`🚀 HANDSHAKE: Sincronizando con nodo ${isYT ? 'YouTube' : 'Mirror Engine'}`);
    
    // Watchdog de seguridad
    watchdogRef.current = window.setTimeout(() => {
        if (!activeVideo && isResolving) {
            addTrace(`⚠️ TIMEOUT: Activando nodo de rescate forzado.`);
            const fallback: IndexEntry = {
                server: 'RESCUE_NODE_NATIVE',
                url: isYT ? `https://www.youtube.com/embed/${nativeId}?autoplay=1&rel=0` : `https://www.2embed.cc/embed/${nativeId}`,
                quality: 'HD',
                language: 'Español',
                status: 'LIVE',
                providerType: 'Watchdog-Force',
                idType: isYT ? 'YT_NODE' : 'FAST_NODE'
            };
            setFiles([fallback]);
            setActiveVideo(fallback);
            setIsResolving(false);
        }
    }, 8000); // Le di un poco más de tiempo al watchdog (8s)

    try {
        // Llamamos al scraper con el ID de IMDB si existe
        const results = await scraper.findLiveLinks(movie.title, movie.year, 'Latino', movie.id, imdbId);
        const entries: IndexEntry[] = results.map(r => ({ ...r, idType: isYT ? 'YT_NODE' : 'FAST_NODE' }));
        
        if (entries.length > 0) {
          if (watchdogRef.current) window.clearTimeout(watchdogRef.current);
          setFiles(entries);
          setActiveVideo(entries[0]); // Por defecto reproduce el primero
          addTrace(`✅ LINKED: ${entries.length} motores de streaming encontrados.`);
        }
    } catch (e) { 
      addTrace(`❌ CRITICAL: Error de resolución en clúster.`); 
    } finally { 
      setIsResolving(false); 
    }
  }, [movie]);

  useEffect(() => {
    const init = async () => {
      if (movie.isCollection || movie.isPlaylist || movie.id.startsWith('yt_')) {
        fastResolve();
        return;
      }
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}&append_to_response=external_ids&language=es-MX`);
        const data = await res.json();
        setMeta(data);
        fastResolve(data.external_ids?.imdb_id);
      } catch { fastResolve(); }
    };
    init();
    return () => { if (watchdogRef.current) window.clearTimeout(watchdogRef.current); };
  }, [movie, fastResolve]);

  // Handler para cambiar de video en colecciones de YouTube
  const handleYoutubeCollectionSwitch = (video: YoutubeVideo) => {
    addTrace(`🔄 SWITCH: Transfiriendo flujo a ID [${video.id}]`);
    const newEntry: IndexEntry = {
      server: 'YOUTUBE_LIVE_FEED',
      url: `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`,
      quality: 'HD/4K',
      language: 'Español',
      status: 'LIVE',
      providerType: 'Gallery-Selector',
      idType: 'COLLECTION_NODE',
      latency: 1
    };
    setActiveVideo(newEntry);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler para cambiar de SERVIDOR (VidSrc, Smashy, etc)
  const handleServerSwitch = (serverEntry: IndexEntry) => {
    addTrace(`🔀 NODE_JUMP: Cambiando a servidor ${serverEntry.server}`);
    setActiveVideo(serverEntry);
  };

  return (
    <div className="animate-in fade-in duration-700 pb-32 space-y-12">
      
      {/* Background Ambience */}
      {meta?.backdrop_path && (
        <div className="fixed inset-0 -z-20 pointer-events-none overflow-hidden">
          <img src={`${TMDB_IMAGE_BASE}${meta.backdrop_path}`} className="w-full h-full object-cover opacity-10 blur-[120px]" alt="bg" />
        </div>
      )}

      {/* Detail Header */}
      <div className="flex flex-col lg:flex-row gap-12 items-start px-4 md:px-0">
        <div className="w-full max-w-[350px] shrink-0">
          <div className={`aspect-[2/3] rounded-[3.5rem] md:rounded-[5rem] overflow-hidden border shadow-2xl bg-[#0a0a0f] ring-1 transition-all duration-700 ${movie.isCollection ? 'border-red-600/40 ring-red-500/20 shadow-red-500/20' : 'border-white/5 ring-white/10'}`}>
            <img src={movie.poster} className="w-full h-full object-cover" alt={movie.title} />
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">INDEX: {movie.isCollection ? 'GENRE_COLLECTION' : 'SINGLE_STREAM'}</span>
            <div className={`px-5 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest italic transition-all duration-700 ${isResolving ? 'bg-orange-600/10 border-orange-500/30 text-orange-500 animate-pulse' : (movie.isCollection ? 'bg-red-600/10 border-red-500/30 text-red-500 shadow-lg shadow-red-500/10' : 'bg-pink-500/10 border-pink-500/20 text-pink-500')}`}>
              {isResolving ? 'INDEXANDO ARCHIVOS...' : (movie.isCollection ? 'ARCHIVE_INDEX_ACTIVE' : 'NODES_SYNCHRONIZED')}
            </div>
          </div>
          <h1 className="text-6xl md:text-[9.5rem] font-black text-white italic uppercase tracking-tighter leading-[0.75] drop-shadow-2xl">{movie.title}</h1>
          <p className="text-slate-500 text-lg leading-relaxed italic max-w-3xl border-l-4 border-white/5 pl-8">{movie.description}</p>
        </div>
      </div>

      {/* Player Section */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
        <div className="xl:col-span-3 space-y-16">
           
           <div className="relative aspect-video w-full rounded-[4rem] md:rounded-[6rem] overflow-hidden border border-white/5 shadow-2xl ring-1 ring-white/5 bg-[#020205]">
              {activeVideo ? (
                <VideoPlayer video={activeVideo} movieTitle={movie.title} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-14">
                   <div className="w-32 h-32 border-[4px] border-white/5 border-t-pink-500 rounded-full animate-spin"></div>
                   <p className="text-xs font-black text-slate-600 uppercase tracking-[0.8em] animate-pulse italic">Establishing Neural Link...</p>
                </div>
              )}
           </div>

           {/* --- NUEVA SECCIÓN: SELECTOR DE SERVIDORES --- */}
           {!movie.isCollection && files.length > 0 && (
             <section className="animate-in slide-in-from-bottom-10 fade-in duration-700">
               <h3 className="text-xl font-black text-white uppercase italic tracking-widest mb-6 flex items-center gap-4">
                 <i className="fa-solid fa-server text-pink-500"></i> Nodos de Transmisión ({files.length})
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {files.map((file, idx) => (
                   <button 
                     key={idx}
                     onClick={() => handleServerSwitch(file)}
                     className={`relative p-5 rounded-3xl border text-left transition-all duration-300 group overflow-hidden ${activeVideo?.url === file.url ? 'bg-pink-600/10 border-pink-500/50 ring-1 ring-pink-500/20' : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/20'}`}
                   >
                     <div className="flex justify-between items-start mb-2">
                       <span className={`text-xs font-black uppercase tracking-widest italic ${activeVideo?.url === file.url ? 'text-pink-500' : 'text-white'}`}>
                         {file.server}
                       </span>
                       {activeVideo?.url === file.url && <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse shadow-[0_0_10px_#ec4899]"></div>}
                     </div>
                     <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                       <span className="px-2 py-1 rounded bg-black/30 border border-white/5">{file.quality}</span>
                       <span className="truncate max-w-[100px]">{file.language}</span>
                       <span className={`ml-auto ${file.latency && file.latency < 20 ? 'text-emerald-500' : 'text-yellow-500'}`}>{file.latency}ms</span>
                     </div>
                   </button>
                 ))}
               </div>
             </section>
           )}

           {/* Galería Dinámica de YouTube (Solo visible si es Colección) */}
           {movie.isCollection && collectionVideos.length > 0 && (
             <section className="space-y-12">
                <div className="flex items-center justify-between border-b border-white/5 pb-10">
                   <div className="flex items-center gap-6">
                      <div className="w-4 h-14 bg-red-600 rounded-full shadow-2xl shadow-red-500/50"></div>
                      <div>
                        <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Colección <span className="text-red-500">YouTube</span></h3>
                      </div>
                   </div>
                   <div className="px-6 py-2 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] text-slate-600 font-mono tracking-widest italic">{collectionVideos.length} NODES</div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                   {collectionVideos.map((video) => (
                     <button 
                       key={video.id} 
                       onClick={() => handleYoutubeCollectionSwitch(video)}
                       className={`flex flex-col text-left group p-7 rounded-[3.5rem] border transition-all duration-700 ${activeVideo?.url.includes(video.id) ? 'bg-red-600/10 border-red-500/50 ring-1 ring-red-500/20' : 'bg-[#0a0a0f] border-white/5 hover:border-white/20'}`}
                     >
                        {/* (Mismo diseño de tarjeta de YouTube que tenías antes) */}
                        <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-black mb-6 border border-white/5">
                           <img src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" alt={video.title} loading="lazy" />
                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/40 backdrop-blur-sm"><i className="fa-solid fa-play text-white text-2xl"></i></div>
                        </div>
                        <h4 className={`text-sm font-black uppercase italic line-clamp-2 ${activeVideo?.url.includes(video.id) ? 'text-red-500' : 'text-slate-300'}`}>{video.title}</h4>
                     </button>
                   ))}
                </div>
             </section>
           )}
        </div>

        {/* Sidebar Diagnostics */}
        <div className="space-y-12">
           <div className="bg-[#08080c] p-12 rounded-[4.5rem] border border-white/5 shadow-2xl relative overflow-hidden ring-1 ring-white/5">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12 scale-150"><i className="fa-solid fa-code-branch text-[8rem]"></i></div>
              <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] flex items-center gap-5 relative z-10 italic mb-12">
                <span className={`h-2.5 w-2.5 rounded-full animate-pulse ${movie.isCollection ? 'bg-red-600' : 'bg-pink-600'}`}></span>
                Cluster Trace
              </h4>
              <div className="space-y-4 font-mono text-[10px] h-[450px] overflow-y-auto custom-scrollbar pr-4 relative z-10 leading-relaxed scroll-smooth italic">
                 {engineTrace.map((log, i) => (
                   <div key={i} className={`p-4 rounded-3xl border transition-all duration-500 ${i === 0 ? 'bg-white/5 border-white/10 text-white shadow-xl' : 'text-slate-700 border-white/5'}`}>
                      {log}
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;