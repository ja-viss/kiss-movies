
import React from 'react';

const MicroservicesSection: React.FC = () => {
  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-center gap-4 mb-8">
           <div className="w-1 h-8 bg-pink-500 rounded-full"></div>
           <h3 className="text-2xl font-bold text-white">Estrategia de Aislamiento Modular</h3>
        </div>
        <p className="text-slate-400 text-lg max-w-3xl leading-relaxed mb-10">
          Escalar un indexador multimedia requiere una separación absoluta de responsabilidades. La capa de Scraping es altamente volátil; debe aislarse para evitar la propagación de fallos hacia la API principal.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="group bg-[#0a0a0f] p-8 rounded-3xl border border-white/5 hover:border-pink-500/30 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <i className="fa-brands fa-python text-8xl"></i>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500 border border-pink-500/20">
                <i className="fa-brands fa-python text-xl"></i>
              </div>
              <div>
                <h4 className="font-bold text-lg text-white">Microservicio de Scraping</h4>
                <p className="text-xs text-slate-500 font-mono">service-sc-01.kiss.io</p>
              </div>
            </div>
            <ul className="space-y-4">
              {[
                { label: 'Entorno', val: 'Python 3.12 / Playwright' },
                { label: 'Patrón', val: 'Trabajadores Distribuidos (Celery)' },
                { label: 'Almacenamiento', val: 'Redis (Estado Intermedio)' },
              ].map((item, idx) => (
                <li key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-sm text-slate-400">{item.label}</span>
                  <span className="text-sm text-white font-bold">{item.val}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="group bg-[#0a0a0f] p-8 rounded-3xl border border-white/5 hover:border-violet-500/30 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <i className="fa-solid fa-code text-8xl"></i>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400 border border-violet-500/20">
                <i className="fa-solid fa-server text-xl"></i>
              </div>
              <div>
                <h4 className="font-bold text-lg text-white">API Core Next.js</h4>
                <p className="text-xs text-slate-500 font-mono">api-core.kiss.io</p>
              </div>
            </div>
            <ul className="space-y-4">
              {[
                { label: 'Entorno', val: 'Node.js / Next.js 15' },
                { label: 'Patrón', val: 'Arquitectura Orientada a Eventos' },
                { label: 'Almacenamiento', val: 'PostgreSQL (Fuente de Verdad)' },
              ].map((item, idx) => (
                <li key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-sm text-slate-400">{item.label}</span>
                  <span className="text-sm text-white font-bold">{item.val}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        <div className="relative bg-[#0a0a0f] p-10 rounded-3xl border border-white/5">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
             <i className="fa-solid fa-network-wired text-pink-500"></i> Flujo de Trabajo de Alto Nivel
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-center font-mono text-xs uppercase tracking-widest text-pink-400">Cliente Usuario</div>
                <i className="fa-solid fa-arrow-down md:hidden text-slate-700"></i>
              </div>
              <div className="hidden md:flex justify-center"><i className="fa-solid fa-chevron-right text-slate-800"></i></div>
              <div className="flex flex-col items-center gap-4">
                <div className="w-full p-6 rounded-xl bg-gradient-to-br from-pink-600/20 to-violet-600/20 border border-white/10 text-center font-bold text-white shadow-xl">Proxy KIss Core</div>
                <i className="fa-solid fa-arrow-down md:hidden text-slate-700"></i>
              </div>
              <div className="hidden md:flex justify-center"><i className="fa-solid fa-chevron-right text-slate-800"></i></div>
              <div className="flex flex-col items-center gap-4 col-span-1 md:col-span-1">
                <div className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-center font-mono text-xs uppercase tracking-widest text-violet-400">Cluster Scraper</div>
              </div>
          </div>
          <p className="mt-8 text-xs text-slate-500 text-center uppercase tracking-[0.2em] font-bold">Pipeline de Comunicación Encriptada (gRPC / Redis Pub-Sub)</p>
        </div>
      </div>
    </div>
  );
};

export default MicroservicesSection;
