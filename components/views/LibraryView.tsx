import React, { useEffect, useState } from 'react';

// Interfaz de datos
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

// Props: Ahora pasamos también el 'year' porque el Scraper lo necesita
interface LibraryViewProps {
  onMovieSelect: (tmdbId: string, title: string, year: string) => void;
}

const LibraryView: React.FC<LibraryViewProps> = ({ onMovieSelect }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = "3fd2be6f0c70a2a598f084ddfb75487c"; 
  const BASE_URL = "https://api.themoviedb.org/3";
  const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        setLoading(true);
        // Traemos las mejores películas de la historia (Top Rated)
        const [res1, res2] = await Promise.all([
            fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=es-MX&page=1`),
            fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=es-MX&page=2`)
        ]);
        
        const data1 = await res1.json();
        const data2 = await res2.json();
        setMovies([...data1.results, ...data2.results]);
      } catch (err) {
        console.error("Error fetching library:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRated();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen text-white px-6 py-8 md:px-12">
      {/* Cabecera Premium */}
      <div className="flex items-center gap-4 mb-8 animate-fade-in">
        <div className="w-2 h-10 bg-gradient-to-b from-amber-400 to-orange-600 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.5)]"></div>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Mejores Rankeadas
          </h1>
          <p className="text-xs text-amber-500 font-mono tracking-[0.3em] uppercase opacity-80">
            Hall of Fame • Top Rated
          </p>
        </div>
      </div>

      {/* Grid de Películas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie, index) => {
          // Extraemos el año para el Scraper
          const year = movie.release_date ? movie.release_date.split('-')[0] : '2024';

          return (
            <div 
              key={movie.id}
              // AL CLICK: Pasamos ID, Título y AÑO
              onClick={() => onMovieSelect(movie.id.toString(), movie.title, year)}
              className="group relative cursor-pointer bg-[#18181b] rounded-2xl overflow-hidden ring-1 ring-white/5 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:ring-amber-500/50 hover:shadow-amber-500/20"
            >
              {/* Poster */}
              <div className="aspect-[2/3] w-full relative overflow-hidden">
                <img 
                  src={movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : 'https://via.placeholder.com/500x750'} 
                  alt={movie.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Badge Ranking */}
                <div className="absolute top-0 left-0 bg-amber-500 text-black font-black text-xs px-3 py-1 rounded-br-lg shadow-lg z-10">
                  #{index + 1}
                </div>

                {/* Overlay Play */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center backdrop-blur-md border border-amber-500/50 scale-50 group-hover:scale-100 transition-transform duration-300">
                     <i className="fa-solid fa-play text-2xl text-white ml-1"></i>
                  </div>
                </div>
              </div>

              {/* Info Footer */}
              <div className="p-4 bg-gradient-to-t from-black via-[#18181b] to-transparent">
                <h3 className="font-bold text-sm text-gray-100 truncate group-hover:text-amber-400 transition-colors">
                  {movie.title}
                </h3>
                <div className="flex justify-between items-center mt-2 text-xs font-mono text-gray-500">
                  <span>{year}</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <i className="fa-solid fa-star text-[10px]"></i>
                    <span>{movie.vote_average.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LibraryView;