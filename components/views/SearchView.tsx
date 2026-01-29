
import React, { useState, useEffect } from 'react';
import { Movie } from '../../App';

const TMDB_API_KEY = "90989cb241ad3918eca0fa012317e392";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

interface SearchViewProps {
  query: string;
  onSelectMovie: (movie: Movie) => void;
}

const SearchView: React.FC<SearchViewProps> = ({ query, onSelectMovie }) => {
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 8));
  };

  useEffect(() => {
    const performSearch = async () => {
      if (!query) return;
      setIsLoading(true);
      setLogs([]);
      
      const sequence = [
        "Iniciando cluster de scrapers (Playwright/Python)...",
        "Validando API Key de TMDB...",
        "Querying: api.themoviedb.org/3/search/movie...",
        "Extrayendo metadatos oficiales y posters...",
        "Sincronizando Source of Truth con PostgreSQL..."
      ];

      sequence.forEach((s, i) => {
        setTimeout(() => addLog(s), i * 300);
      });

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=es-MX`
        );
        const data = await response.json();
        
        const mappedResults: Movie[] = data.results.map((m: any) => ({
          id: m.id.toString(),
          title: m.title,
          year: m.release_date?.split('-')[0] || 'N/A',
          poster: m.poster_path ? `${TMDB_IMAGE_BASE}${m.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster',
          rating: m.vote_average.toFixed(1),
          description: m.overview || 'Sin descripción disponible.',
          genres: ['Resultado', 'Búsqueda']
        }));
        
        // Retraso artificial corto para simular el proceso de indexado
        setTimeout(() => {
           setResults(mappedResults);
           setIsLoading(false);
        }, 1500);

      } catch (error) {
        console.error("Error en búsqueda TMDB:", error);
        setIsLoading(false);
      }
    };

    performSearch();
  }, [query]);

  return (
    <div className="space-y-12 min-h-screen">
      <div>
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Búsqueda <span className="text-pink-500">Masiva</span></h2>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-2">Indexando resultados reales para: "{query}"</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-10">
          <div className="w-24 h-24 border-[6px] border-pink-500/10 border-t-pink-500 rounded-full animate-spin"></div>
          <div className="w-full max-w-2xl bg-[#0a0a0f] border border-white/5 rounded-3xl p-8 font-mono text-[11px] space-y-2.5">
             {logs.map((log, i) => (
               <div key={i} className={`flex gap-4 ${i === 0 ? 'text-pink-400 font-bold' : 'text-slate-600'}`}>
                 <span className="opacity-40">[{new Date().toLocaleTimeString()}]</span>
                 <span className="uppercase tracking-widest">{log}</span>
               </div>
             ))}
          </div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {results.map((movie) => (
            <button
              key={movie.id}
              onClick={() => onSelectMovie(movie)}
              className="group flex flex-col text-left transition-all duration-500 hover:-translate-y-2"
            >
              <div className="aspect-[2/3] rounded-[2.5rem] overflow-hidden mb-6 relative border border-white/10 shadow-2xl bg-[#0a0a0f]">
                <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-[10px] font-black text-pink-400">
                  <i className="fa-solid fa-star mr-1.5"></i> {movie.rating}
                </div>
              </div>
              <div className="px-3">
                <h4 className="font-bold text-white text-xl truncate group-hover:text-pink-500 transition-colors tracking-tight leading-tight">{movie.title}</h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-2">{movie.year}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-[#0a0a0f] rounded-[3.5rem] border border-white/5">
          <i className="fa-solid fa-satellite-dish text-7xl text-slate-800 mb-8 animate-pulse"></i>
          <h3 className="text-2xl font-black text-white mb-3 tracking-tighter uppercase">Sin resultados reales</h3>
          <p className="text-slate-500 max-w-sm mx-auto text-sm">No se encontraron archivos válidos para "{query}" en la API de TMDB.</p>
        </div>
      )}
    </div>
  );
};

export default SearchView;
