import React from 'react';
import { Movie } from '../../App';

interface YouTubeCinemaViewProps {
  onSelectMovie: (movie: Movie) => void;
}

const YouTubeCinemaView: React.FC<YouTubeCinemaViewProps> = ({ onSelectMovie }) => {
  
  // Definimos las colecciones (igual que tenías en Home, pero ahora en su propia página)
  const youtubeCollections = [
    { 
      id: 'coll_zombies', 
      query: 'peliculas de zombies completas en español hd gratis', 
      title: 'Zombies & Infección', 
      poster: 'https://images.unsplash.com/photo-1526547462705-121430d02c2c', 
      desc: 'Supervivencia extrema y hordas implacables.', 
      year: '2025' 
    },
    { 
      id: 'coll_drama', 
      query: 'peliculas de drama completas en español latino 2024', 
      title: 'Drama & Cine Intenso', 
      poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728', 
      desc: 'Historias profundas que desafían la emoción humana.', 
      year: '2024' 
    },
    { 
      id: 'coll_accion', 
      query: 'peliculas de accion completas en español latino 2024 hd', 
      title: 'Acción Explosiva', 
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1', 
      desc: 'Adrenalina pura, persecuciones y combates.', 
      year: '2024' 
    },
    { 
      id: 'coll_terror', 
      query: 'peliculas de terror completas en español latino hd', 
      title: 'Horror & Suspenso', 
      poster: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c', 
      desc: 'Lo desconocido acecha en cada sombra.', 
      year: '2023' 
    },
    { 
      id: 'coll_scifi', 
      query: 'peliculas ciencia ficcion completas español latino', 
      title: 'Sci-Fi & Futuro', 
      poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa', 
      desc: 'Viajes espaciales, distopías y tecnología.', 
      year: '2025' 
    },
    { 
      id: 'coll_anime', 
      query: 'peliculas anime completas español latino hd', 
      title: 'Anime & Animación', 
      poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477', 
      desc: 'Lo mejor del cine de animación japonés.', 
      year: '2024' 
    },
    { 
      id: 'coll_western', 
      query: 'peliculas del oeste completas en español', 
      title: 'Western & Vaqueros', 
      poster: 'https://images.unsplash.com/photo-1533167649158-6d508895b680', 
      desc: 'Duelos al sol y forajidos.', 
      year: 'CLÁSICOS' 
    },
    { 
      id: 'coll_docs', 
      query: 'documentales completos en español interesantes', 
      title: 'Documentales', 
      poster: 'https://images.unsplash.com/photo-1507842217121-9d5961143686', 
      desc: 'Aprende sobre el mundo real.', 
      year: 'DOCS' 
    }
  ];

  return (
    <div className="animate-fade-in w-full pt-8 pb-20">
      {/* Cabecera de la Página */}
      <div className="mb-12 border-b border-white/5 pb-8">
         <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-4">
           YouTube <span className="text-red-600">Cinema</span>
         </h2>
         <p className="text-slate-400 max-w-2xl text-sm leading-relaxed border-l-2 border-red-600 pl-4">
           Una colección curada de cine completo legalmente disponible en YouTube. 
           Sin cortes, sin registros, directamente desde los canales oficiales de distribución.
         </p>
      </div>

      {/* Grid de Colecciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {youtubeCollections.map(p => (
           <button 
             key={p.id}
             onClick={() => onSelectMovie({
                id: p.id,
                title: p.title,
                year: p.year,
                poster: p.poster,
                rating: '9.8',
                description: p.desc,
                genres: ['Colección', 'YouTube'],
                quality: 'HD',
                isCollection: true,
                searchQuery: p.query
             } as Movie)}
             className="group relative aspect-video rounded-3xl overflow-hidden border border-white/10 hover:border-red-600/50 transition-all hover:scale-[1.02] shadow-2xl text-left"
           >
              {/* Imagen de Fondo */}
              <img 
                src={p.poster} 
                alt={p.title} 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
              />
              
              {/* Overlay Gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6 flex flex-col justify-end">
                 <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-1">{p.title}</h3>
                 <p className="text-xs text-gray-300 line-clamp-1 font-medium">{p.desc}</p>
                 
                 <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-500 bg-red-500/10 px-3 py-1 rounded-full backdrop-blur-md border border-red-500/20">
                        <i className="fa-brands fa-youtube"></i> Explorar
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{p.year}</span>
                 </div>
              </div>
           </button>
        ))}
      </div>
    </div>
  );
}

export default YouTubeCinemaView;