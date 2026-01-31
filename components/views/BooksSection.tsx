import React, { useState, useEffect, useRef } from 'react';

// Tipos para los libros
interface BookItem {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string;
  description: string;
  previewLink: string;
  pageCount: number;
  embeddable: boolean;
  viewability: string;
  language: string; // Nuevo: Para depurar idioma
}

// 1. MEJORA: CATEGORÍAS CON BÚSQUEDA LOCALIZADA
// Definimos términos específicos para cada idioma para obtener mejores resultados
const CATEGORIES = [
  { 
    id: 'fiction', 
    label: 'Ficción', 
    query: { es: 'ficción novelas destacadas', en: 'subject:fiction best sellers' } 
  },
  { 
    id: 'technology', 
    label: 'Tecnología', 
    query: { es: 'programación desarrollo software tecnologia', en: 'computer science programming technology' } 
  },
  { 
    id: 'business', 
    label: 'Negocios', 
    query: { es: 'negocios emprendimiento finanzas', en: 'subject:business entrepreneurship' } 
  },
  { 
    id: 'horror', 
    label: 'Terror', 
    query: { es: 'libros de terror miedo suspenso', en: 'subject:horror thriller' } 
  },
  { 
    id: 'history', 
    label: 'Historia', 
    query: { es: 'historia universal y latinoamericana', en: 'subject:history world' } 
  },
  { 
    id: 'science', 
    label: 'Ciencia', 
    query: { es: 'ciencia divulgación científica', en: 'subject:science' } 
  }
];

const BooksSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(CATEGORIES[0].id);
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [onlyFree, setOnlyFree] = useState(false);
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // ESTADOS DEL LECTOR
  const [readingBook, setReadingBook] = useState<BookItem | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(true); 
  const readerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const category = CATEGORIES.find(c => c.id === activeTab);
      
      if (category) {
        try {
          const filterParam = onlyFree ? '&filter=free-ebooks' : '';
          
          // 2. MEJORA: USAMOS LA QUERY CORRECTA SEGÚN EL IDIOMA
          // Esto asegura que busquemos "Programación" en vez de "Programming" si estamos en español
          const searchQuery = category.query[language];

          // Pedimos 40 resultados para tener margen de sobras al filtrar manualmente
          const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&langRestrict=${language}&orderBy=relevance&maxResults=40${filterParam}`
          );
          const data = await response.json();

          if (data.items) {
            // 3. MEJORA: FILTRADO ESTRICTO DE IDIOMA (Client-Side)
            // Google a veces se equivoca, así que nosotros lo corregimos manualmente.
            const strictFilteredItems = data.items.filter((item: any) => 
              item.volumeInfo.language === language
            );

            const mappedBooks = strictFilteredItems.map((item: any) => ({
              id: item.id,
              title: item.volumeInfo.title,
              authors: item.volumeInfo.authors || ['Autor Desconocido'],
              thumbnail: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x196?text=No+Cover',
              description: item.volumeInfo.description,
              previewLink: item.volumeInfo.previewLink,
              pageCount: item.volumeInfo.pageCount || 0,
              embeddable: item.accessInfo?.embeddable || false,
              viewability: item.accessInfo?.viewability || 'NO_PAGES',
              language: item.volumeInfo.language
            }));

            // Cortamos a los primeros 12 o 18 para mostrar
            setBooks(mappedBooks.slice(0, 18));
          } else {
            setBooks([]);
          }
        } catch (error) {
          console.error("Error fetching books:", error);
        }
      }
      setLoading(false);
    };

    fetchBooks();
  }, [activeTab, language, onlyFree]);

  const openBook = (book: BookItem) => {
    setReadingBook(book);
    setIframeLoaded(false); 
  };

  const closeReader = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setReadingBook(null);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && readerContainerRef.current) {
      readerContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="w-full mt-12 mb-8 animate-fade-in relative">
      
      {/* --- VISOR DE LIBROS PREMIUM --- */}
      {readingBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          
          <div 
            ref={readerContainerRef}
            className="relative w-full h-full md:w-[95%] md:h-[95%] bg-[#1a1a20] md:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10"
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-3 bg-[#121215] border-b border-white/10 select-none">
              <div className="flex items-center gap-4">
                 <div className="w-6 h-8 rounded overflow-hidden shadow hidden md:block">
                    <img src={readingBook.thumbnail} className="w-full h-full object-cover opacity-80" alt="cover" />
                 </div>
                 <div>
                   <h3 className="text-white font-bold text-sm md:text-base line-clamp-1">{readingBook.title}</h3>
                   <div className="flex items-center gap-2">
                     <span className="text-amber-500 text-xs font-mono">{readingBook.authors[0]}</span>
                     {readingBook.embeddable && <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 rounded border border-emerald-500/20">LECTURA DISPONIBLE</span>}
                   </div>
                 </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button onClick={toggleFullscreen} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all active:scale-95">
                  <i className="fa-solid fa-expand"></i>
                </button>
                <button onClick={closeReader} className="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all active:scale-95 ml-2">
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>
            </div>

            {/* Area Lectura */}
            <div className="flex-1 w-full h-full bg-[#f8f9fa] relative">
              {!iframeLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1a20] z-0">
                  <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <span className="text-xs text-amber-500 font-mono animate-pulse uppercase tracking-widest">Cargando Páginas...</span>
                </div>
              )}

              {readingBook.embeddable ? (
                <iframe 
                  src={`https://books.google.com/books?id=${readingBook.id}&printsec=frontcover&output=embed`}
                  className={`w-full h-full border-0 transition-opacity duration-700 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
                  title="Google Books Reader"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                  onLoad={() => setIframeLoaded(true)}
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a0f] text-center p-8 z-20 relative">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                     <i className="fa-solid fa-book-medical text-4xl text-slate-500"></i>
                  </div>
                  <h3 className="text-3xl text-white font-black mb-3 tracking-tight">Lectura Restringida</h3>
                  <p className="text-slate-400 mb-8 max-w-md leading-relaxed text-sm">
                    Este libro tiene derechos de autor estrictos. Puedes intentar buscar una versión gratuita activando el filtro <span className="text-amber-500 font-bold">"Solo Gratis"</span> o leer la vista previa oficial.
                  </p>
                  <a href={readingBook.previewLink} target="_blank" rel="noopener noreferrer" className="px-10 py-4 bg-amber-500 text-black font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 hover:bg-white transition-all shadow-xl shadow-amber-500/20">
                    Abrir en Google Books
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- CONTROLES Y GRID --- */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-10 bg-gradient-to-b from-amber-400 to-orange-600 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-wider text-white">
              Biblioteca <span className="text-amber-500">Digital</span>
            </h2>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.3em]">Google Books API Integration</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button 
             onClick={() => setOnlyFree(!onlyFree)}
             className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border transition-all ${
               onlyFree 
               ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
               : 'bg-[#1a1a20] border-white/5 text-slate-400 hover:border-white/20'
             }`}
          >
             <i className={`fa-solid ${onlyFree ? 'fa-unlock' : 'fa-lock'} text-xs`}></i>
             <span className="text-[10px] font-black uppercase tracking-widest">
               {onlyFree ? 'Solo Libros Gratis' : 'Todo el Catálogo'}
             </span>
             <div className={`w-3 h-3 rounded-full ${onlyFree ? 'bg-amber-500 animate-pulse' : 'bg-slate-600'}`}></div>
          </button>

          <div className="flex bg-[#1a1a20] rounded-xl p-1 border border-white/5">
            <button 
              onClick={() => setLanguage('es')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${language === 'es' ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              ES
            </button>
            <button 
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${language === 'en' ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-6 mb-2 custom-scrollbar px-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`
              whitespace-nowrap px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border
              ${activeTab === cat.id 
                ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-105' 
                : 'bg-[#0a0a0f] text-slate-500 border-white/5 hover:border-white/20 hover:text-white'}
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-80">
           <div className="flex flex-col items-center gap-6">
             <div className="relative">
                <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <i className="fa-solid fa-book text-amber-500/50 text-xl"></i>
                </div>
             </div>
             <span className="text-[10px] uppercase tracking-[0.5em] text-amber-500 animate-pulse font-bold">
               Indexando Biblioteca...
             </span>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 px-2">
          {books.map((book) => (
            <div 
              key={book.id}
              onClick={() => openBook(book)}
              className="group relative flex flex-col bg-[#121215] rounded-[1.5rem] overflow-hidden border border-white/5 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-500 hover:-translate-y-2 cursor-pointer ring-1 ring-white/0 hover:ring-white/10"
            >
              <div className="aspect-[2/3] w-full relative overflow-hidden bg-gray-900/50">
                <img src={book.thumbnail} alt={book.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-mono font-bold text-amber-500 border border-white/10 shadow-xl">
                  {book.pageCount > 0 ? `${book.pageCount} pg` : 'N/A'}
                </div>
                {book.embeddable ? (
                   <div className="absolute top-3 left-3 bg-emerald-500 text-black px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider shadow-xl shadow-emerald-500/20">Disponible</div>
                ) : (
                   <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider">Protegido</div>
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-[2px] gap-3">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-300 delay-75">
                    <i className={`fa-solid ${book.embeddable ? 'fa-book-open' : 'fa-lock'} text-black text-lg`}></i>
                  </div>
                  <span className="text-[9px] font-black text-white uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full border border-white/10">{book.embeddable ? 'Leer Ahora' : 'Vista Previa'}</span>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1 bg-gradient-to-b from-[#121215] to-[#0a0a0f]">
                <h3 className="text-xs font-bold text-gray-100 line-clamp-2 leading-relaxed group-hover:text-amber-500 transition-colors mb-1">{book.title}</h3>
                <p className="text-[10px] text-gray-500 font-medium line-clamp-1 mb-3">{book.authors[0]}</p>
                <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity">
                   <div className="flex items-center gap-1.5"><i className="fa-brands fa-google text-[10px] text-slate-400"></i><span className="text-[8px] text-slate-500 font-black uppercase tracking-wider">Books API</span></div>
                   <div className="flex items-center gap-1.5"><i className="fa-solid fa-language text-[10px] text-slate-400"></i><span className="text-[8px] text-slate-500 font-black uppercase tracking-wider">{book.language.toUpperCase()}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksSection;