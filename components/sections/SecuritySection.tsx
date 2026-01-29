
import React from 'react';

const SecuritySection: React.FC = () => {
  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-center gap-4 mb-8">
           <div className="w-1 h-8 bg-pink-500 rounded-full"></div>
           <h3 className="text-2xl font-bold text-white">Fortalecimiento de Plataforma</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-[#0a0a0f] rounded-3xl border border-white/5 p-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-violet-600"></div>
            <h4 className="text-lg font-bold text-white mb-6">Entrega de Nodos sin Restricción (Native-Audio)</h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Priorizamos la funcionalidad total sobre el aislamiento agresivo. Al eliminar el sandbox, permitimos que los clústeres de video (como 2embed) ejecuten sus scripts nativos para la selección de pistas multi-idioma (Español Latino) y balanceo de carga interno.
            </p>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                 <div className="text-pink-500 mb-2"><i className="fa-solid fa-link-slash"></i></div>
                 <h5 className="text-white text-xs font-bold uppercase tracking-widest mb-1">Referrer-Shield</h5>
                 <p className="text-[10px] text-slate-500 leading-tight">Implementamos políticas de 'no-referrer' para evitar el bloqueo por hotlinking en servidores externos.</p>
               </div>
               <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                 <div className="text-violet-400 mb-2"><i className="fa-solid fa-bolt"></i></div>
                 <h5 className="text-white text-xs font-bold uppercase tracking-widest mb-1">Direct-Bridge</h5>
                 <p className="text-[10px] text-slate-500 leading-tight">Comunicación directa con el DOM del reproductor para capturar eventos de error y autoconmutación.</p>
               </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0a0a0f] to-[#111] rounded-3xl border border-white/5 p-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 mb-6 border border-pink-500/20">
              <i className="fa-solid fa-bolt-lightning text-3xl"></i>
            </div>
            <h4 className="text-white font-bold mb-2">Cache de Alto Desempeño</h4>
            <p className="text-xs text-slate-500 mb-6">Implementación multi-capa de Redis.</p>
            <div className="w-full space-y-3">
              {[
                { label: 'Metadatos', h: '80%' },
                { label: 'Sesión', h: '30%' },
                { label: 'Resolución', h: '95%' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 font-mono w-12 text-left">{item.label}</span>
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500 rounded-full" style={{ width: item.h }}></div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Tasa de Aciertos: 94.2%</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SecuritySection;
