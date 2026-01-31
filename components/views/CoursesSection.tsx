import React, { useState, useEffect } from 'react';
import { ScraperService } from '../../utils/scraperService'; // Ajusta la ruta si es necesario

// Tipos para los cursos
interface CourseVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
}

interface CoursesSectionProps {
  onCourseSelect: (video: any) => void;
}

const CATEGORIES = [
  { id: 'programacion', label: 'Programación', query: 'curso completo programacion desde cero 2024' },
  { id: 'trading', label: 'Trading & Cripto', query: 'curso trading institucional completo 2025' },
  { id: 'finanzas', label: 'Finanzas', query: 'curso finanzas personales e inversiones' },
  { id: 'cocina', label: 'Gastronomía', query: 'curso cocina profesional completo masterclass' },
  { id: 'idiomas', label: 'Inglés', query: 'curso ingles completo rapido' },
  { id: 'ia', label: 'Inteligencia Artificial', query: 'curso inteligencia artificial generativa completo' }
];

const CoursesSection: React.FC<CoursesSectionProps> = ({ onCourseSelect }) => {
  const [activeTab, setActiveTab] = useState(CATEGORIES[0].id);
  const [courses, setCourses] = useState<CourseVideo[]>([]);
  const [loading, setLoading] = useState(false);
  
  const scraper = new ScraperService();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const category = CATEGORIES.find(c => c.id === activeTab);
      if (category) {
        // CAMBIO AQUÍ: Pasamos el segundo parámetro '12' para pedir 12 videos
        const results = await scraper.fetchYoutubeCollection(category.query, 12);
        
        const mappedCourses = results.map((vid: any) => ({
          id: vid.id,
          title: vid.title,
          thumbnail: vid.thumbnail,
          duration: vid.duration
        }));
        
        setCourses(mappedCourses);
      }
      setLoading(false);
    };

    fetchCourses();
  }, [activeTab]);

  return (
    <div className="w-full mt-12 mb-8 animate-fade-in">
      {/* Cabecera de Sección */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="w-1.5 h-8 bg-pink-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div>
        <h2 className="text-2xl font-black uppercase tracking-wider text-white">
          Academia <span className="text-pink-500">KISS</span>
        </h2>
        <span className="text-[10px] bg-white/5 px-2 py-1 rounded-full text-gray-500 font-mono">
          {courses.length} Cursos Disponibles
        </span>
      </div>

      {/* Pestañas de Categoría */}
      <div className="flex gap-4 overflow-x-auto pb-4 mb-4 custom-scrollbar px-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`
              whitespace-nowrap px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all
              ${activeTab === cat.id 
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20 scale-105' 
                : 'bg-[#1a1a20] text-gray-400 hover:bg-[#25252b] hover:text-white'}
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid de Cursos */}
      {loading ? (
        <div className="flex items-center justify-center h-60">
           <div className="flex flex-col items-center gap-4">
             <div className="w-10 h-10 border-[3px] border-pink-500 border-t-transparent rounded-full animate-spin"></div>
             <span className="text-[10px] uppercase tracking-widest text-pink-500 animate-pulse">
               Buscando Cursos de {CATEGORIES.find(c => c.id === activeTab)?.label}...
             </span>
           </div>
        </div>
      ) : (
        // Grid ajustado para soportar más elementos
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
          {courses.map((course) => (
            <div 
              key={course.id}
              onClick={() => {
                onCourseSelect({
                  id: `yt_${course.id}`,
                  title: course.title,
                  year: '2024',
                  poster: course.thumbnail,
                  rating: 'YT',
                  description: `Curso completo de ${CATEGORIES.find(c => c.id === activeTab)?.label}`,
                  genres: ['Educación', 'Curso'],
                  quality: 'HD',
                  videos: [{ id: course.id, title: course.title, thumbnail: course.thumbnail }] 
                });
              }}
              className="group relative cursor-pointer bg-[#121215] rounded-xl overflow-hidden border border-white/5 hover:border-pink-500/30 hover:shadow-pink-500/10 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Thumbnail */}
              <div className="aspect-video w-full relative">
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  loading="lazy"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute bottom-2 right-2 bg-black/90 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white shadow-lg">
                  {course.duration}
                </div>
                {/* Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px]">
                  <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform">
                    <i className="fa-solid fa-play text-white text-sm ml-0.5"></i>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col justify-between h-[110px]">
                <h3 className="text-sm font-bold text-gray-200 line-clamp-2 leading-relaxed group-hover:text-pink-400 transition-colors">
                  {course.title}
                </h3>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <i className="fa-brands fa-youtube text-red-500 text-xs"></i>
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                      Educación
                    </span>
                  </div>
                  <span className="text-[9px] bg-pink-500/10 text-pink-500 px-2 py-0.5 rounded font-bold uppercase">
                    Ver
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesSection;