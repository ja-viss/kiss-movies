
import React, { useState } from 'react';
import { ViewType } from '../App';

interface SidebarProps {
  currentView: ViewType;
  onNavigateHome: () => void;
  systemNodes: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigateHome, systemNodes }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: ViewType.HOME, label: 'Inicio', icon: 'fa-house', action: () => { onNavigateHome(); setIsOpen(false); } },
    { id: ViewType.SEARCH, label: 'Explorar', icon: 'fa-compass', action: () => {} },
    { id: 'trending', label: 'Tendencias', icon: 'fa-fire-flame-curved', action: () => {} },
    { id: 'library', label: 'Mi Biblioteca', icon: 'fa-box-archive', action: () => {} },
  ];

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
        <div className="p-10">
          <button onClick={onNavigateHome} className="flex items-center gap-5 mb-16 hover:opacity-80 transition-opacity">
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

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full group flex items-center gap-5 px-6 py-4 rounded-[1.2rem] transition-all duration-500 text-xs font-black uppercase tracking-widest italic ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-xl shadow-pink-600/20 translate-x-1'
                    : 'text-slate-500 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-6 text-center transition-transform duration-500 group-hover:scale-125`}></i>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-10 space-y-8">
          <div className="bg-[#050508] rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-700">
               <i className="fa-brands fa-js-square text-6xl"></i>
            </div>
            <p className="text-[10px] text-slate-600 font-black tracking-[0.2em] uppercase mb-6 italic">Neural JS Engine</p>
            <div className="space-y-5">
               <div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-2">
                     <span>ACTIVE_NODES</span>
                     <span className="text-pink-500 font-bold">{systemNodes}</span>
                  </div>
                  <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                     <div className="h-full bg-pink-500 transition-all duration-1000" style={{ width: `${(systemNodes / 1600) * 100}%` }}></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-2">
                     <span>BYPASS_SUCCESS</span>
                     <span className="text-violet-400 font-bold">98.2%</span>
                  </div>
                  <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                     <div className="h-full bg-violet-500" style={{ width: '98%' }}></div>
                  </div>
               </div>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <span className="text-[9px] text-emerald-500 font-black tracking-widest uppercase flex items-center gap-2">
                 <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                 </span>
                 JS_WORKER_OK
              </span>
              <span className="text-[8px] text-slate-700 font-mono">LAT: 0.8s</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
