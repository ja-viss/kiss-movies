import React, { useState, useEffect, useMemo } from 'react';
import { ScraperService, ArchiveItem } from '../../utils/scraperService'; 

// Definimos las categorías
const MEDIA_TYPES = [
  { id: 'movies', label: 'Películas', icon: 'fa-film' },
  { id: 'software', label: 'Software', icon: 'fa-floppy-disk' },
  { id: 'texts', label: 'Libros', icon: 'fa-book' },
  { id: 'audio', label: 'Audio', icon: 'fa-music' }, // 'audio' busca en todo el archivo sonoro (incluyendo etree)
  { id: 'image', label: 'Imágenes', icon: 'fa-image' }
];

const InternetArchiveView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState('movies');
  const [results, setResults] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Estado para el visor modal
  const [viewingItem, setViewingItem] = useState<ArchiveItem | null>(null);

  // Instanciamos el servicio una sola vez (Mejora de rendimiento)
  const scraper = useMemo(() => new ScraperService(), []);

  // Buscar automáticamente al cambiar de categoría
  useEffect(() => {
    handleSearch();
  }, [activeType]);

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    
    // Llamada al servicio
    const data = await scraper.searchInternetArchive(query, activeType);
    setResults(data);
    
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const closeViewer = () => setViewingItem(null);

  return (
    <div className="animate-fade-in w-full h-full flex flex-col relative">
      
      {/* --- VISOR MULTIMEDIA UNIVERSAL (MODAL) --- */}
      {viewingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-0 md:p-6 animate-in fade-in zoom-in duration-300">
           <div className="relative w-full h-full max-w-7xl bg-[#121215] md:rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
              
              {/* Header Modal */}
              <div className="flex items-center justify-between px-6 py-4 bg-[#0a0a0f] border-b border-white/10">
                 <div className="flex flex-col">
                    <h3 className="text-white font-bold text-sm md:text-lg line-clamp-1">{viewingItem.title}</h3>
                    <span className="text-[10px] text-cyan-500 font-mono uppercase tracking-wider">
                      {viewingItem.mediaType} Viewer
                    </span>
                 </div>
                 <div className="flex gap-3">
                    <a 
                      href={viewingItem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-colors"
                    >
                      <i className="fa-solid fa-external-link-alt"></i> Fuente Original
                    </a>
                    <button 
                      onClick={closeViewer} 
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500 text-white flex items-center justify-center transition-all"
                    >
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                 </div>
              </div>

              {/* Contenido (Smart Viewer) */}
              <div className="flex-1 bg-black relative flex items-center justify-center">
                 {viewingItem.mediaType === 'image' ? (
                    // Si es IMAGEN: Usamos <img> para mejor calidad y zoom nativo del navegador
                    <img 
                      src={`https://archive.org/services/img/${viewingItem.identifier}`} 
                      alt={viewingItem.title}
                      className="max-w-full max-h-full object-contain"
                    />
                 ) : (
                    // Si es VIDEO, AUDIO, SOFTWARE o LIBRO: Usamos el Embed Player
                    // 'gamepad' permite usar controles en juegos MS-DOS
                    <iframe 
                      src={`https://archive.org/embed/${viewingItem.identifier}?autoplay=1`}
                      className="w-full h-full border-0"
                      allow="fullscreen; autoplay; gamepad" 
                      title="Archive Player"
                      allowFullScreen
                    ></iframe>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* --- UI PRINCIPAL --- */}
      
      {/* Cabecera Compacta */}
      <div className="flex flex-col md:flex-row gap-6 items-end justify-between mb-8 pb-6 border-b border-white/5">
        <div className="w-full md:w-auto">
           <div className="flex items-center gap-3 mb-2">
              <i className="fa-solid fa-building-columns text-cyan-400 text-xl"></i>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                Internet <span className="text-cyan-400">Archive</span>
              </h2>
           </div>
           
           {/* Buscador */}
           <div className="relative group w-full md:w-96">
             <input 
               type="text" 
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               onKeyDown={handleKeyDown}
               placeholder={`Buscar en ${MEDIA_TYPES.find(t => t.id === activeType)?.label}...`}
               className="w-full bg-[#121215] border border-white/10 rounded-xl py-3 pl-10 pr-12 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all shadow-lg"
             />
             <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
             <button 
               onClick={handleSearch}
               className="absolute right-2 top-2 bottom-2 px-3 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-black rounded-lg text-[10px] font-bold uppercase transition-all"
             >
               Go
             </button>
           </div>
        </div>

        {/* Categorías (Pestañas) */}
        <div className="flex bg-[#121215] p-1 rounded-xl border border-white/5 overflow-x-auto custom-scrollbar w-full md:w-auto">
          {MEDIA_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                ${activeType === type.id 
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'}
              `}
            >
              <i className={`fa-solid ${type.icon}`}></i>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- GRID DE RESULTADOS --- */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
          <span className="text-cyan-500 font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">Buscando Archivos...</span>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {results.map((item) => (
            <div 
              key={item.identifier}
              onClick={() => setViewingItem(item)} 
              className="group relative bg-[#121215] rounded-xl overflow-hidden border border-white/5 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col h-[260px] shadow-lg hover:shadow-cyan-500/10"
            >
              {/* Thumbnail */}
              <div className="h-36 w-full relative bg-[#0a0a0f] overflow-hidden">
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://archive.org/images/not_found.png'; 
                    target.style.opacity = '0.3';
                  }}
                />
                
                {/* Badge de Año */}
                {item.year && item.year !== 'N/A' && (
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-cyan-200 border border-white/10">
                    {item.year}
                  </div>
                )}

                {/* Overlay Play */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px]">
                   <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center shadow-xl scale-50 group-hover:scale-100 transition-transform">
                      <i className={`fa-solid ${
                        item.mediaType === 'image' ? 'fa-magnifying-glass-plus' : 
                        item.mediaType === 'texts' ? 'fa-book-open' : 'fa-play'
                      } text-black text-lg`}></i>
                   </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-3 flex flex-col flex-1 bg-gradient-to-b from-[#121215] to-[#0a0a0f]">
                 <h3 className="text-gray-200 font-bold text-xs line-clamp-2 mb-1 group-hover:text-cyan-400 transition-colors leading-snug">
                   {item.title}
                 </h3>
                 <div className="mt-auto flex items-center justify-between pt-2 border-t border-white/5 text-[9px] text-slate-500 font-mono">
                    <span className="truncate max-w-[50%]">{item.mediaType.toUpperCase()}</span>
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-download"></i> {item.downloads.toLocaleString()}
                    </span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] opacity-40">
           <i className="fa-solid fa-box-open text-4xl text-slate-600 mb-2"></i>
           <p className="text-slate-500 text-xs font-mono">
             {hasSearched ? "No se encontraron resultados." : "Selecciona una categoría para empezar..."}
           </p>
        </div>
      )}
    </div>
  );
};

export default InternetArchiveView;