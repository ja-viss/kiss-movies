
import React, { useState, useEffect } from 'react';
import { SectionType } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomeView from './components/views/HomeView';
import SearchView from './components/views/SearchView';
import DetailView from './components/views/DetailView';

export enum ViewType {
  HOME = 'home',
  SEARCH = 'search',
  DETAIL = 'detail'
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

  return (
    <div className="flex min-h-screen bg-[#050508] text-slate-200 overflow-hidden font-sans">
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-pink-600/[0.04] blur-[180px] rounded-full -z-10 animate-pulse"></div>
      
      <Sidebar 
        currentView={currentView} 
        onNavigateHome={navigateToHome} 
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
        </div>

        <footer className="w-full bg-[#030305] border-t border-white/5 py-16 px-6 md:px-12 mt-auto">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-12 text-center">
            
            {/* Logos Seccion */}
            <div className="w-full max-w-2xl bg-white/[0.02] border border-white/5 p-8 rounded-[3rem] flex flex-col sm:flex-row items-center justify-center gap-10 group hover:bg-white/[0.04] transition-all">
               <div className="flex items-center gap-8 border-r border-white/5 pr-8 sm:border-r sm:pr-10">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img 
                      src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg" 
                      alt="TMDB Logo" 
                      className="w-full h-full object-contain brightness-110"
                    />
                  </div>
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" 
                      alt="YouTube Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
               </div>
               
               <div className="text-center sm:text-left space-y-2">
                 <h5 className="text-white font-black text-xs md:text-sm uppercase tracking-[0.3em] italic">Metadata Optimized by TMDB & YouTube</h5>
                 <p className="text-slate-500 text-[10px] md:text-xs font-medium italic max-w-xs">
                   Indexación híbrida de colecciones dinámicas y motores de búsqueda en tiempo real.
                 </p>
               </div>
            </div>

            <p className="text-[10px] md:text-[11px] text-slate-500 font-medium leading-relaxed tracking-wide text-center max-w-xl">
              Este sitio utiliza inteligencia artificial para indexar contenido público de YouTube y otros servidores externos mediante búsqueda semántica avanzada.
            </p>
            
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
