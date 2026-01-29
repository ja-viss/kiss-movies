import React, { useEffect, useState } from 'react';

// 1. Definimos la estructura de datos que nos devuelve TMDB
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

// Props opcionales por si quieres pasar una función al hacer click
interface TrendingViewProps {
  onMovieSelect?: (movieId: string, title: string) => void;
}

const TrendingView: React.FC<TrendingViewProps> = ({ onMovieSelect }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tu API Key (idealmente ponla en un archivo .env como VITE_TMDB_KEY)
  const API_KEY = "3fd2be6f0c70a2a598f084ddfb75487c"; 
  const BASE_URL = "https://api.themoviedb.org/3";
  const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        // Endpoint: Tendencias de la semana
        const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=es-MX`);
        
        if (!response.ok) throw new Error('Error conectando con TMDB');
        
        const data = await response.json();
        setMovies(data.results);
      } catch (err) {
        setError("No se pudieron cargar las tendencias.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  // --- RENDERIZADO ---

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-10">{error}</div>;
  }

  return (
    <div className="text-white px-4 py-8 md:px-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
        <h1 className="text-3xl font-black uppercase tracking-wider">Tendencias Globales</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <div 
            key={movie.id}
            onClick={() => onMovieSelect && onMovieSelect(movie.id.toString(), movie.title)}
            className="group relative cursor-pointer bg-[#1a1a2e] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-emerald-500/20 ring-1 ring-white/5 hover:ring-emerald-500/50"
          >
            {/* Poster Image */}
            <div className="aspect-[2/3] w-full relative overflow-hidden">
              <img 
                src={movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'} 
                alt={movie.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay Oscuro al hacer hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <i className="fa-solid fa-play text-4xl text-white drop-shadow-lg scale-50 group-hover:scale-100 transition-transform duration-300"></i>
              </div>

              {/* Badge de Puntuación */}
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                <i className="fa-solid fa-star text-yellow-400 text-[10px]"></i>
                <span className="text-xs font-bold">{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>

            {/* Info Footer */}
            <div className="p-4 bg-gradient-to-t from-[#0a0a12] to-[#161625]">
              <h3 className="font-bold text-sm md:text-base truncate text-gray-100 group-hover:text-emerald-400 transition-colors">
                {movie.title}
              </h3>
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500 font-mono">
                <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
                <span className="uppercase tracking-widest text-[9px] border border-gray-700 px-1 rounded">Movie</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingView;