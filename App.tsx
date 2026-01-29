import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomeView from './components/views/HomeView';
import SearchView from './components/views/SearchView';
import DetailView from './components/views/DetailView';
import TrendingView from './components/views/TrendingView';
import LibraryView from './components/views/LibraryView';

// NUEVO: Importamos el Reproductor y el Servicio
import VideoPlayer from './components/VideoPlayer'; 
import { ScraperService } from './utils/scraperService'; 

export enum ViewType {
  HOME = 'home',
  SEARCH = 'search',
  DETAIL = 'detail',
  TRENDING = 'trending',
  LIBRARY = 'library',
  PLAYER = 'player' // NUEVO: Estado para el reproductor
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

  // NUEVO: Estados para el Reproductor y el Scraper
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [playingTitle, setPlayingTitle] = useState("");
  
  // Instancia del servicio (No se recrea en cada render)
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentView(ViewType.SEARCH);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setCurrentView(ViewType.DETAIL);
  };

  const navigateToHome = () => {
    setCurrentView(ViewType.HOME);
    setSearchQuery("");
    setSelectedMovie(null);
  };

  const navigateToSearch = () => {
    setCurrentView(ViewType.SEARCH);
    setSearchQuery("");
    setSelectedMovie(null);
  };

  const navigateToTrending = () => {
    setCurrentView(ViewType.TRENDING);
    setSearchQuery("");
    setSelectedMovie(null);
  };

  const navigateToLibrary = () => {
    setCurrentView(ViewType.LIBRARY);
    setSearchQuery("");
    setSelectedMovie(null);
  };

  // NUEVO: Lógica Maestra para reproducir desde la Librería
  const handleLibraryPlay = async (tmdbId: string, title: string, year: string) => {
    // 1. Preparamos la interfaz
    setPlayingTitle(title);
    setCurrentView(ViewType.PLAYER); // Cambiamos a la vista de reproductor
    
    // 2. Estado de "Buscando..."
    setActiveVideo({
      server: 'SEARCHING_NODES',
      url: '', 
      quality: 'Scanning...',
      providerType: 'AI-Indexer'
    });

    try {
      console.log(`🧠 Neural Search Iniciada: ${title} (${year})`);

      // 3. Ejecutamos el Scraper (Frontend puro)
      // "es" es el idioma por defecto
      const links = await scraper.findLiveLinks(title, year, "es", tmdbId);

      if (links && links.length > 0) {
        // Tomamos la mejor opción (VidLink o Youtube)
        const bestOption = links[0];
        
        setActiveVideo({
          server: bestOption.server,
          url: bestOption.url,
          quality: bestOption.quality,
          providerType: bestOption.providerType
        });
      } else {
        // Fallback si no encuentra nada
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
    <div className="flex min-h-screen bg-[#050508] text-slate-200 overflow-hidden font-sans">
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-pink-600/[0.04] blur-[180px] rounded-full -z-10 animate-pulse"></div>
      
      <Sidebar 
        currentView={currentView} 
        onNavigateHome={navigateToHome} 
        onNavigateSearch={navigateToSearch}
        onNavigateTrending={navigateToTrending}
        onNavigateLibrary={navigateToLibrary}
        systemNodes={systemLoad.nodes}
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-y-auto scroll-smooth relative custom-scrollbar">
        <Header onSearch={handleSearch} onNavigateHome={navigateToHome} />
        
        <div className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full mb-12">
          {currentView === ViewType.HOME && (
            <HomeView onSelectMovie={handleSelectMovie} />
          )}
          
          {currentView === ViewType.SEARCH && (
            <SearchView 
              query={searchQuery} 
              onSelectMovie={handleSelectMovie} 
            />
          )}
          
          {currentView === ViewType.DETAIL && selectedMovie && (
            <DetailView movie={selectedMovie} />
          )}

          {currentView === ViewType.TRENDING && (
            <TrendingView />
          )}

          {/* NUEVO: Conectamos la Librería con el Handler */}
          {currentView === ViewType.LIBRARY && (
            <LibraryView onMovieSelect={handleLibraryPlay} />
          )}

          {/* NUEVO: Vista del Reproductor */}
          {currentView === ViewType.PLAYER && activeVideo && (
            <div className="w-full animate-fade-in">
              <button 
                onClick={navigateToLibrary} 
                className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase text-xs font-black tracking-widest"
              >
                <i className="fa-solid fa-arrow-left"></i> Volver a Librería
              </button>
              
              <VideoPlayer 
                video={activeVideo} 
                movieTitle={playingTitle}
                onAutoSwitch={() => { console.log("Switch requested"); }}
              />

              <div className="mt-8 p-6 bg-[#0a0a0c] rounded-3xl border border-white/5">
                <h2 className="text-2xl font-black text-white mb-2">{playingTitle}</h2>
                <div className="flex gap-4 text-xs font-mono text-slate-500">
                   <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded">SECURE STREAM</span>
                   <span className="bg-pink-500/10 text-pink-500 px-2 py-1 rounded">NODE: {activeVideo.server}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer (Sin cambios) */}
        <footer className="w-full bg-[#030305] border-t border-white/5 py-16 px-6 md:px-12 mt-auto">
          {/* ... tu footer existente ... */}
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-12 text-center">
             {/* ... contenido del footer ... */}
             <div className="flex items-center justify-center">
               <div className="px-8 py-4 bg-slate-900/40 rounded-full border border-white/10 shadow-2xl backdrop-blur-md">
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-slate-400">
                    Neural Mode: <span className="text-pink-500 italic">ACTIVE_SEARCH_INDEXER</span>
                  </span>
               </div>
            </div>
             <span className="text-[9px] text-slate-800 uppercase font-black tracking-widest">&copy; 2025 Digital Media Infrastructure</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;