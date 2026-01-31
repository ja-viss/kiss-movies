import React, { useState } from 'react';
import { ViewType } from '../App';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  systemNodes: number;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onNavigate,
  systemNodes 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Definición del Menú con el nuevo apartado de Archivos
  const menuItems = [
    // 1. Básicos
    { 
      id: ViewType.HOME, 
      label: 'Inicio', 
      icon: 'fa-house', 
      color: 'text-slate-500 group-hover:text-white' 
    },
    { 
      id: ViewType.SEARCH, 
      label: 'Explorar', 
      icon: 'fa-compass', 
      color: 'text-slate-500 group-hover:text-white' 
    },
    
    // 2. SECCIONES DEDICADAS
    { 
      id: ViewType.YOUTUBE_CINEMA, 
      label: 'YouTube Cinema', 
      icon: 'fa-youtube', 
      color: 'text-red-500' 
    },
    { 
      id: ViewType.ACADEMY, 
      label: 'Academia Kiss', 
      icon: 'fa-graduation-cap', 
      color: 'text-pink-500' 
    },
    { 
      id: ViewType.DIGITAL_LIBRARY, 
      label: 'Biblioteca Digital', 
      icon: 'fa-book', 
      color: 'text-amber-500' 
    },
    // 👇 NUEVO: APARTADO DE ARCHIVOS (INTERNET ARCHIVE)
    { 
      id: ViewType.ARCHIVE, 
      label: 'Archivos & Media', 
      icon: 'fa-box-open', // Icono de caja/archivo
      color: 'text-cyan-400' // Color Cyan característico
    },
    { 
      id: ViewType.GLOBAL_TRENDING, 
      label: 'Global Trending', 
      icon: 'fa-fire-flame-curved', 
      color: 'text-violet-500' 
    },
  ];

  const handleNavigation = (view: ViewType) => {
    onNavigate(view);
    setIsOpen(false); // Cerramos el menú móvil al navegar
  };

  return (
    <>
      {/* Botón de Menú Móvil */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-8 right-8 z-50 w-16 h-16 bg-pink-600 text-white rounded-[1.5rem] shadow-2xl flex items-center justify-center border border-white/20 active:scale-90 transition-all"
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-xl`}></i>
      </button>

      {/* Sidebar Overlay Móvil */}
      {isOpen && <div className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-40" onClick={() => setIsOpen(false)}></div>}

      <aside className={`
        fixed lg:sticky top-0 h-screen z-40 bg-[#0a0a0f] border-r border-white/5 flex flex-col transition-all duration-700 ease-in-out
        w-72 ${isOpen ? 'left-0' : '-left-full lg:left-0'}
      `}>
        <div className="p-10 flex flex-col h-full">
          {/* Logo Area */}
          <button onClick={() => handleNavigation(ViewType.HOME)} className="flex items-center gap-5 mb-12 hover:opacity-80 transition-opacity">
            <div className="relative">
              <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-30"></div>
              <div className="w-14 h-14 bg-gradient-to-tr from-pink-600 to-violet-600 rounded-2xl flex items-center justify-center relative shadow-2xl border border-white/10">
                <span className="text-white font-black text-2xl italic tracking-tighter leading-none">K</span>
              </div>
            </div>
            <div className="text-left">
              <h1 className="font-black text-2xl tracking-tighter text-white uppercase italic">KIss <span className="text-pink-500">.</span></h1>
              <p className="text-[9px] text-slate-600 uppercase tracking-[0.4em] font-black">Architecture</p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {menuItems.map((item) => {
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`
                    w-full group flex items-center gap-5 px-6 py-4 rounded-[1.2rem] transition-all duration-300 text-xs font-black uppercase tracking-widest italic relative overflow-hidden
                    ${isActive 
                      ? 'bg-white/[0.03] text-white shadow-xl ring-1 ring-white/5' 
                      : 'text-slate-500 hover:bg-white/[0.02] hover:text-white'}
                  `}
                >
                  {/* Indicador lateral activo */}
                  {isActive && (
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.color.replace('text-', 'bg-')}`}></div>
                  )}

                  <i className={`
                    fa-solid ${item.icon} w-6 text-center transition-transform duration-500 group-hover:scale-110 text-lg
                    ${isActive ? item.color : 'text-slate-600 group-hover:text-white'}
                  `}></i>
                  
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* System Status Footer */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="bg-[#050508] rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group shadow-lg">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-700">
                 <i className="fa-brands fa-js-square text-5xl"></i>
              </div>
              <p className="text-[9px] text-slate-600 font-black tracking-[0.2em] uppercase mb-4 italic">Neural JS Engine</p>
              
              <div className="space-y-3">
                 <div>
                    <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-1">
                       <span>NODES</span>
                       <span className="text-pink-500 font-bold">{systemNodes}</span>
                    </div>
                    <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                       <div className="h-full bg-pink-500 transition-all duration-1000" style={{ width: `${(systemNodes / 1600) * 100}%` }}></div>
                    </div>
                 </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[8px] text-emerald-500 font-black tracking-widest uppercase flex items-center gap-1.5">
                   <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                   </span>
                   ONLINE
                </span>
                <span className="text-[8px] text-slate-700 font-mono">v3.0.1</span>
              </div>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;