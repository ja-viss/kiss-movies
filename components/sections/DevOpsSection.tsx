
import React from 'react';

const DevOpsSection: React.FC = () => {
  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-center gap-4 mb-8">
           <div className="w-1 h-8 bg-violet-500 rounded-full"></div>
           <h3 className="text-2xl font-bold text-white">Infraestructura Edge-First</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-8 rounded-3xl bg-[#0a0a0f] border border-white/5 flex flex-col items-center text-center hover:bg-white/[0.02] transition-colors">
            <i className="fa-brands fa-docker text-4xl text-blue-500 mb-6"></i>
            <h4 className="text-white font-bold text-sm">Contenerización</h4>
            <p className="text-[10px] text-slate-500 mt-2">Clusters de Kubernetes para escalado dinámico de scrapers.</p>
          </div>
          <div className="p-8 rounded-3xl bg-[#0a0a0f] border border-white/5 flex flex-col items-center text-center hover:bg-white/[0.02] transition-colors">
             <i className="fa-solid fa-bolt text-4xl text-yellow-500 mb-6"></i>
            <h4 className="text-white font-bold text-sm">Edge CDN</h4>
            <p className="text-[10px] text-slate-500 mt-2">Vercel Edge para entrega de pósters vía SSR en menos de 50ms.</p>
          </div>
          <div className="p-8 rounded-3xl bg-[#0a0a0f] border border-white/5 flex flex-col items-center text-center hover:bg-white/[0.02] transition-colors">
             <i className="fa-solid fa-database text-4xl text-green-500 mb-6"></i>
            <h4 className="text-white font-bold text-sm">DB Serverless</h4>
            <p className="text-[10px] text-slate-500 mt-2">Neon PostgreSQL para un almacenamiento eficiente en costos.</p>
          </div>
          <div className="p-8 rounded-3xl bg-[#0a0a0f] border border-white/5 flex flex-col items-center text-center hover:bg-white/[0.02] transition-colors">
             <i className="fa-solid fa-code-merge text-4xl text-pink-500 mb-6"></i>
            <h4 className="text-white font-bold text-sm">Motor CI/CD</h4>
            <p className="text-[10px] text-slate-500 mt-2">GitHub Actions para despliegues automatizados con tiempo de inactividad cero.</p>
          </div>
        </div>

        <div className="mt-12 p-10 rounded-3xl bg-[#0a0a0f] border border-white/5 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none"></div>
          <h4 className="text-lg font-bold text-white mb-8 text-center">Matriz de Despliegue Global</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             {[
               { region: 'NA-EAST', ping: '12ms', load: '12%' },
               { region: 'EU-CENTRAL', ping: '34ms', load: '45%' },
               { region: 'LATAM-SOUTH', ping: '42ms', load: '82%' },
               { region: 'ASIA-PAC', ping: '110ms', load: '5%' },
             ].map((node, i) => (
               <div key={i} className="text-center">
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{node.region}</div>
                 <div className="text-xl font-black text-white">{node.ping}</div>
                 <div className="mt-2 h-1 bg-slate-800 rounded-full">
                    <div className="h-full bg-pink-500 rounded-full" style={{ width: node.load }}></div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DevOpsSection;
