import React, { useState, useEffect } from 'react';
import { Movie } from '../../App';
// 1. Importamos las secciones especiales
import CoursesSection from './CoursesSection';
import BooksSection from './BooksSection';

const TMDB_API_KEY = "90989cb241ad3918eca0fa012317e392";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w780"; 

interface HomeViewProps {
  onSelectMovie: (movie: Movie) => void;
}

interface ListCardProps {
  item: Movie;
  onSelect: (movie: Movie) => void;
}

const ListCard: React.FC<ListCardProps> = ({ item, onSelect }) => (
  <button 
    onClick={() => onSelect(item)} 
    className="group flex flex-col text-left transition-all duration-700"
  >
    <div className={`relative aspect-[16/9] md:aspect-[2/3] overflow-hidden rounded-[2rem] md:rounded-[3.5rem] border border-white/5 shadow-2xl bg-[#0a0a0f] transition-all group-hover:-translate-y-4 ring-1 ${item.isCollection ? 'group-hover:ring-red-500/50' : 'group-hover:ring-pink-500/50'}`}>
      <img 
        src={item.poster} 
        alt={item.title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s] opacity-80" 
        loading="lazy" 
      />
      
      {item.isCollection && (
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <div className="px-4 py-2 bg-red-600 rounded-2xl text-[9px] font-black text-white uppercase tracking-widest shadow-2xl flex items-center gap-2">
             <i className="fa-brands fa-youtube"></i> LIVE COLLECTION
          </div>
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100 bg-black/20 backdrop-blur-[2px]">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl shadow-2xl ${item.isCollection ? 'bg-red-600' : 'bg-pink-600'}`}>
          <i className={`fa-solid ${item.isCollection ? 'fa-clapperboard' : 'fa-play'} ${item.isCollection ? '' : 'ml-1'}`}></i>
        </div>
      </div>
    </div>
    <div className="mt-8 px-4">
      <h4 className={`text-xl font-black text-white truncate transition-colors uppercase italic tracking-tighter ${item.isCollection ? 'group-hover:text-red-500' : 'group-hover:text-pink-500'}`}>
        {item.title}
      </h4>
      <div className="flex items-center gap-4 mt-2">
         <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{item.year}</span>
         <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
         <span className={`text-[10px] font-black uppercase italic ${item.isCollection ? 'text-red-500' : 'text-emerald-500'}`}>
           {item.isCollection ? 'Explorar Género' : 'Engine v4'}
         </span>
      </div>
    </div>
  </button>
);

const HomeView: React.FC<HomeViewProps> = ({ onSelectMovie }) => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [curatedPlaylists, setCuratedPlaylists] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const youtubeCollections = [
    { id: 'coll_zombies', query: 'peliculas de zombies completas en español hd gratis', title: 'Zombies & Infección', poster: 'https://images.unsplash.com/photo-1526547462705-121430d02c2c?q=80&w=386&auto=format&fit=crop', desc: 'Supervivencia extrema y hordas implacables.' },
    { id: 'coll_drama', query: 'peliculas de drama completas en español latino 2024', title: 'Drama & Cine Intenso', poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop', desc: 'Historias profundas que desafían la emoción humana.' },
    { id: 'coll_accion', query: 'peliculas de accion completas en español latino 2024 hd', title: 'Acción Explosiva', poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop', desc: 'Adrenalina pura, persecuciones y combates.' },
    { id: 'coll_terror', query: 'peliculas de terror completas en español latino hd', title: 'Horror & Suspenso', poster: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800&auto=format&fit=crop', desc: 'Lo desconocido acecha en cada sombra.' }
  ];

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      try {
        const trendRes = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}&language=es-MX`);
        const trendData = await trendRes.json();
        const mappedTrends = trendData.results.slice(0, 10).map((m: any) => ({
          id: m.id.toString(),
          title: m.title,
          year: m.release_date?.split('-')[0] || 'N/A',
          poster: m.poster_path ? `${TMDB_IMAGE_BASE}${m.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster',
          rating: m.vote_average.toFixed(1),
          description: m.overview,
          genres: ['Tendencia'],
          quality: 'HD'
        }));
        setTrending(mappedTrends);

        const mappedCollections: Movie[] = youtubeCollections.map(p => ({
          id: p.id,
          title: p.title,
          year: '2025',
          poster: p.poster,
          rating: '9.9',
          description: p.desc,
          genres: ['YouTube', 'Cine Libre'],
          quality: '4K',
          isCollection: true,
          searchQuery: p.query
        }));
        setCuratedPlaylists(mappedCollections);

      } catch (e) {
        console.error("Home Data Sync Error:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadAll();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 p-20">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="aspect-[2/3] bg-white/[0.02] rounded-[3rem] animate-pulse border border-white/5"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-1000 pb-20 space-y-32">
      {/* Hero Section */}
      <section className="relative h-[450px] md:h-[650px] rounded-[4rem] md:rounded-[6rem] border border-white/5 overflow-hidden flex items-center px-12 md:px-24 bg-[#0a0a0f] shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#050508] via-[#050508]/60 to-transparent z-10"></div>
        <div className="relative z-20 space-y-10 max-w-4xl">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-pink-500/10 border border-pink-500/30 text-[10px] font-black text-pink-500 uppercase tracking-[0.4em] italic backdrop-blur-md">
            <i className="fa-solid fa-satellite-dish animate-pulse"></i>
            Active Media Architect
          </div>
          <h2 className="text-6xl md:text-[10rem] font-black text-white italic uppercase tracking-tighter leading-[0.75]">
            Cine <br/> <span className="text-pink-500">Ilimitado</span> <br/> Indexado.
          </h2>
          <p className="text-slate-400 text-sm md:text-xl font-medium leading-relaxed max-w-xl">
            Bienvenido a la nueva arquitectura de streaming. Disfruta de contenido descentralizado, cursos y cine global en una sola interfaz unificada.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-full h-full -z-10 opacity-30">
           <img src="https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover scale-110" alt="bg-hero" />
        </div>
      </section>

      {/* 1. SECCIÓN: YOUTUBE CINEMA */}
      <section>
        <div className="mb-14 px-4 md:px-0 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
          <div className="space-y-4 max-w-3xl">
            <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">YouTube <span className="text-red-500">Cinema</span></h3>
            <p className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-[0.5em] italic flex items-center gap-4">
              <span className="w-10 h-[2px] bg-red-600"></span>
              Cine Gratuito y Legal
            </p>
            <p className="text-slate-400 text-sm leading-relaxed mt-4 border-l-2 border-red-500/30 pl-6">
              Esta sección recopila películas completas alojadas oficialmente en YouTube. 
              Disfruta de cine clásico, independiente y de culto sin salir de la plataforma.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {curatedPlaylists.map(p => (
            <ListCard key={p.id} item={p} onSelect={onSelectMovie} />
          ))}
        </div>
      </section>

      {/* 2. SECCIÓN: CURSOS (ACADEMIA KISS) */}
      <section className="py-16 border-t border-white/5 border-b border-white/5 bg-[#08080c]/50">
         <div className="px-4 md:px-0 mb-8 max-w-3xl">
            <div className="flex items-center gap-3 mb-2">
               <i className="fa-solid fa-graduation-cap text-pink-500"></i>
               <span className="text-xs font-black uppercase tracking-widest text-pink-500">Zona de Aprendizaje</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
               No solo es entretenimiento. Hemos indexado los mejores <strong>cursos completos y gratuitos</strong> de YouTube 
               (Programación, Trading, Finanzas) para que adquieras nuevas habilidades.
            </p>
         </div>
         <CoursesSection onCourseSelect={onSelectMovie} />
      </section>

      {/* 3. SECCIÓN: LIBRERÍA DIGITAL (GOOGLE BOOKS) */}
      <section className="py-16 border-b border-white/5 bg-[#050508]">
         <div className="px-4 md:px-0 mb-8 max-w-3xl">
             <div className="flex items-center gap-3 mb-2">
                <i className="fa-solid fa-book text-amber-500"></i>
                <span className="text-xs font-black uppercase tracking-widest text-amber-500">Biblioteca Inteligente</span>
             </div>
             <p className="text-slate-400 text-sm leading-relaxed">
                 Accede instantáneamente a millones de libros y documentos a través de nuestra integración con 
                 <strong> Google Books API</strong>. Disponible en Inglés y Español.
             </p>
         </div>
         <BooksSection />
      </section>

      {/* 4. SECCIÓN: GLOBAL TRENDING */}
      <section>
        <div className="mb-14 px-4 md:px-0 mt-20">
          <div className="space-y-4 max-w-3xl">
            <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">Global <span className="text-pink-500">Trending</span></h3>
            <p className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-[0.5em] italic flex items-center gap-4">
              <span className="w-10 h-[2px] bg-pink-500"></span>
              El pulso del cine mundial
            </p>
            <p className="text-slate-400 text-sm leading-relaxed mt-4 border-l-2 border-pink-500/30 pl-6">
               Descubre qué está viendo el mundo en este momento. Esta lista se actualiza semanalmente 
               utilizando la base de datos de <strong>TMDB</strong>.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 md:gap-14">
          {trending.map(movie => (
            <ListCard key={movie.id} item={movie} onSelect={onSelectMovie} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeView;