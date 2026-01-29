
import React, { useState } from 'react';

interface HeaderProps {
  onSearch: (query: string) => void;
  onNavigateHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onNavigateHome }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#050508]/80 backdrop-blur-xl border-b border-white/5 px-6 md:px-12 py-6">
      <div className="flex justify-between items-center max-w-7xl mx-auto w-full gap-8">
        <div className="hidden md:block">
          <button onClick={onNavigateHome} className="text-xl font-black text-white tracking-tighter hover:text-pink-500 transition-colors">
            EXPLORAR
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 max-w-2xl relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i className="fa-solid fa-search text-slate-500 group-focus-within:text-pink-500 transition-colors"></i>
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Busca películas, series o archivos indexados..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:bg-white/10 transition-all placeholder:text-slate-600"
          />
        </form>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Motor</span>
            <span className="text-xs text-green-500 font-bold">KISS-V3 ONLINE</span>
          </div>
          <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <i className="fa-solid fa-user text-slate-400"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
