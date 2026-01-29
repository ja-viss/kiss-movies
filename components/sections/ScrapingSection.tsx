
import React from 'react';

const ScrapingSection: React.FC = () => {
  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-center gap-4 mb-8">
           <div className="w-1 h-8 bg-pink-500 rounded-full"></div>
           <h3 className="text-2xl font-bold text-white">Motor de Extracción Avanzado</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           <div className="bg-[#0a0a0f] rounded-3xl border border-white/5 p-8 group">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Suite Anti-Detección</h4>
                <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] text-green-400 font-bold uppercase">Activo</div>
              </div>
              
              <div className="space-y-6">
                {[
                  { icon: 'fa-mask', title: 'Suplantación de Huella', desc: 'Firmas de Canvas/WebGL aleatorizadas por solicitud.' },
                  { icon: 'fa-globe', title: 'Proxies Inteligentes', desc: 'Pool de IPs residenciales rotativas con persistencia de sesión.' },
                  { icon: 'fa-clock-rotate-left', title: 'Emulación de Comportamiento Humano', desc: 'Retrasos asíncronos y rutas de desplazamiento aleatorias.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-pink-500">
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <div>
                      <h5 className="text-white font-bold text-sm">{item.title}</h5>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="flex flex-col gap-6">
              <div className="bg-[#0a0a0f] rounded-3xl border border-white/5 p-8 flex-1">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Lógica de Salud de Enlaces</h4>
                <div className="p-4 bg-black rounded-xl border border-white/5 font-mono text-[11px] text-green-400 leading-relaxed">
                   <p className="text-slate-600"># Tarea Periódica de Celery</p>
                   <p><span className="text-pink-400">@app.task</span>(queue='health_checks')</p>
                   <p><span className="text-pink-400">def</span> verificar_integridad_enlaces():</p>
                   <p>&nbsp;&nbsp;enlaces_muertos = Server.ping_all()</p>
                   <p>&nbsp;&nbsp;if enlaces_muertos:</p>
                   <p>&nbsp;&nbsp;&nbsp;&nbsp;disparar_re_scraping(enlaces_muertos)</p>
                   <p>&nbsp;&nbsp;&nbsp;&nbsp;notificar_ops_webhook()</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-pink-600 to-violet-600 rounded-3xl p-8 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold">Auto-Resolver KIss</h4>
                  <p className="text-white/70 text-xs">Extracción directa de flujos desde reproductores ofuscados con JS.</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                   <i className="fa-solid fa-bolt text-white"></i>
                </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default ScrapingSection;
