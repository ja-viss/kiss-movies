import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// 1. Vistas Actualizadas (Nuevas y Existentes)
import HomeView from './components/views/HomeView';
import SearchView from './components/views/SearchView';
import DetailView from './components/views/DetailView';
import TrendingView from './components/views/TrendingView';
import LibraryView from './components/views/LibraryView'; // Tu "Mi Biblioteca" (Top Rated)

// 2. Nuevas Vistas Dedicadas
import YouTubeCinemaView from './components/views/YouTubeCinemaView';
import CoursesSection from './components/views/CoursesSection'; // Reusamos como página
import BooksSection from './components/views/BooksSection';     // Reusamos como página
import InternetArchiveView from './components/views/InternetArchiveView'; // 🏛️ NUEVA VISTA

// 3. Reproductor y Servicios
import VideoPlayer from './components/VideoPlayer'; 
import { ScraperService } from './utils/scraperService'; 

// 4. DEFINICIÓN DE TODOS LOS ESTADOS DE VISTA
export enum ViewType {
  HOME = 'home',
  SEARCH = 'search',
  DETAIL = 'detail',
  PLAYER = 'player',
  // Páginas del Menú Lateral
  YOUTUBE_CINEMA = 'youtube_cinema',
  ACADEMY = 'academy',
  DIGITAL_LIBRARY = 'digital_library',
  ARCHIVE = 'archive', // 🏛️ NUEVO ENUM
  GLOBAL_TRENDING = 'global_trending',
  // Compatibilidad
  LIBRARY = 'library', 
  TRENDING = 'trending' 
}

export interface YoutubeVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

export interface Movie {
  id: string;
  title: string;
  year: string;
  poster: string;
  rating: string;
  description: string;
  genres: string[];
  quality: 'CAM' | 'HD' | '4K';
  isPlaylist?: boolean;
  playlistId?: string;
  isCollection?: boolean;
  searchQuery?: string;
  videos?: YoutubeVideo[];
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.HOME);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [systemLoad, setSystemLoad] = useState({ nodes: 1449, tasks: 48 });

  // Estados del Reproductor
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [playingTitle, setPlayingTitle] = useState("");
  
  // Instancia del scraper
  const scraper = new ScraperService();

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad(prev => ({
        nodes: Math.floor(1440 + Math.random() * 20),
        tasks: Math.floor(Math.random() * 60)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // --- NAVEGACIÓN UNIFICADA ---
  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    setSearchQuery("");
    setSelectedMovie(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentView(ViewType.SEARCH);
  };

  // Seleccionar película para ver detalles (DetailView)
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setCurrentView(ViewType.DETAIL);
  };

  // --- LÓGICA DE REPRODUCCIÓN ---
  const handleDirectPlay = async (tmdbId: string, title: string, year: string) => {
    setPlayingTitle(title);
    setCurrentView(ViewType.PLAYER);
    
    setActiveVideo({
      server: 'SEARCHING_NODES',
      url: '', 
      quality: 'Scanning...',
      providerType: 'AI-Indexer'
    });

    try {
      console.log(`🧠 Neural Search Iniciada: ${title} (${year})`);
      const links = await scraper.findLiveLinks(title, year, "es", tmdbId);

      if (links && links.length > 0) {
        const bestOption = links[0];
        setActiveVideo({
          server: bestOption.server,
          url: bestOption.url,
          quality: bestOption.quality,
          providerType: bestOption.providerType
        });
      } else {
        setActiveVideo({
          server: 'FALLBACK_NET',
          url: `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}`,
          quality: 'Auto',
          providerType: 'Backup-System'
        });
      }
    } catch (e) {
      console.error("Error crítico en indexador:", e);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050508] text-slate-200 font-sans overflow-hidden">
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-pink-600/[0.04] blur-[180px] rounded-full -z-10 animate-pulse"></div>
      
      {/* Sidebar con Navegación Genérica */}
      <Sidebar 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        systemNodes={systemLoad.nodes}
      />
      
      {/* 👇 CORRECCIÓN: Sin márgenes extra para que Flexbox actúe correctamente */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto scroll-smooth relative custom-scrollbar transition-all duration-300">
        <Header onSearch={handleSearch} onNavigateHome={() => handleNavigate(ViewType.HOME)} />
        
        <div className="flex-1 p-6 md:p-12 max-w-[1920px] mx-auto w-full mb-12">
          
          {/* --- VISTA: HOME --- */}
          {currentView === ViewType.HOME && (
            <HomeView onSelectMovie={handleSelectMovie} />
          )}
          
          {/* --- VISTA: BUSQUEDA --- */}
          {currentView === ViewType.SEARCH && (
            <SearchView query={searchQuery} onSelectMovie={handleSelectMovie} />
          )}
          
          {/* --- VISTA: DETALLE --- */}
          {currentView === ViewType.DETAIL && selectedMovie && (
            <DetailView movie={selectedMovie} />
          )}

          {/* --- PÁGINAS DEDICADAS --- */}

          {/* 1. YouTube Cinema */}
          {currentView === ViewType.YOUTUBE_CINEMA && (
             <YouTubeCinemaView onSelectMovie={handleSelectMovie} />
          )}

          {/* 2. Academia Kiss (Cursos) */}
          {currentView === ViewType.ACADEMY && (
            <div className="animate-fade-in pt-4">
               <div className="mb-10 border-b border-white/5 pb-8">
                 <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
                   Academia <span className="text-pink-500">KISS</span>
                 </h1>
                 <p className="text-slate-400 mt-4 max-w-xl text-sm md:text-base">
                   Centro de aprendizaje de alto rendimiento. Accede a cursos completos de programación, finanzas y habilidades digitales.
                 </p>
               </div>
               <CoursesSection onCourseSelect={handleSelectMovie} />
            </div>
          )}

          {/* 3. Biblioteca Digital (Libros) */}
          {currentView === ViewType.DIGITAL_LIBRARY && (
             <div className="animate-fade-in pt-4">
                <div className="mb-10 border-b border-white/5 pb-8">
                  <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
                    Biblioteca <span className="text-amber-500">Digital</span>
                  </h1>
                  <p className="text-slate-400 mt-4 max-w-xl text-sm md:text-base">
                    Acceso directo a la API de Google Books. Encuentra documentación técnica, literatura y papers académicos al instante.
                  </p>
                </div>
                <BooksSection />
             </div>
          )}

          {/* 4. 🏛️ Internet Archive (NUEVO) */}
          {currentView === ViewType.ARCHIVE && (
             <InternetArchiveView />
          )}

          {/* 5. Global Trending */}
          {(currentView === ViewType.GLOBAL_TRENDING || currentView === ViewType.TRENDING) && (
             <div className="animate-fade-in pt-4">
                <h1 className="text-4xl md:text-5xl font-black mb-8 text-white uppercase italic">Tendencias Globales</h1>
                <TrendingView /> 
             </div>
          )}

          {/* 6. Mi Biblioteca (Top Rated Old) */}
          {currentView === ViewType.LIBRARY && (
            <LibraryView onMovieSelect={handleDirectPlay} />
          )}


          {/* --- VISTA: REPRODUCTOR --- */}
          {currentView === ViewType.PLAYER && activeVideo && (
            <div className="w-full animate-fade-in">
              <button 
                onClick={() => handleNavigate(ViewType.HOME)} 
                className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase text-xs font-black tracking-widest"
              >
                <i className="fa-solid fa-arrow-left"></i> Cerrar Reproductor
              </button>
              
              <VideoPlayer 
                video={activeVideo} 
                movieTitle={playingTitle}
                onAutoSwitch={() => console.log("Auto-switch triggered")}
              />

              <div className="mt-8 p-6 bg-[#0a0a0c] rounded-3xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white mb-2">{playingTitle}</h2>
                  <div className="flex gap-4 text-xs font-mono text-slate-500">
                    <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded">SECURE STREAM</span>
                    <span className="bg-pink-500/10 text-pink-500 px-2 py-1 rounded">NODE: {activeVideo.server}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <footer className="w-full bg-[#030305] border-t border-white/5 py-16 px-6 md:px-12 mt-auto">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-12 text-center">
            <div className="w-full max-w-2xl bg-white/[0.02] border border-white/5 p-8 rounded-[3rem] flex flex-col sm:flex-row items-center justify-center gap-10 group hover:bg-white/[0.04] transition-all">
               <div className="flex items-center gap-8 border-r border-white/5 pr-8 sm:border-r sm:pr-10">
                  <div className="w-16 h-16 flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                    <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg" alt="TMDB" className="w-full h-full object-contain" />
                  </div>
                  <div className="w-16 h-16 flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                    <i className="fa-brands fa-google text-4xl"></i>
                  </div>
               </div>
               <div className="text-center sm:text-left space-y-2">
                 <h5 className="text-white font-black text-xs md:text-sm uppercase tracking-[0.3em] italic">Multi-Source Engine</h5>
                 <p className="text-slate-500 text-[10px] md:text-xs font-medium italic max-w-xs">
                   Indexación híbrida: TMDB, YouTube Data API v3 & Google Books API.
                 </p>
               </div>
            </div>
            
            <div className="flex items-center justify-center">
               <div className="px-8 py-4 bg-slate-900/40 rounded-full border border-white/10 shadow-2xl backdrop-blur-md">
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-slate-400">
                    System Status: <span className="text-emerald-500 italic">ONLINE_V4.2</span>
                  </span>
               </div>
            </div>
            <span className="text-[9px] text-slate-800 uppercase font-black tracking-widest">&copy; 2025 Kiss Architecture Labs</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;