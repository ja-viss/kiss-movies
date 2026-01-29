
import React from 'react';

const DatabaseSection: React.FC = () => {
  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-center gap-4 mb-8">
           <div className="w-1 h-8 bg-violet-500 rounded-full"></div>
           <h3 className="text-2xl font-bold text-white">Base Relacional de Datos</h3>
        </div>
        
        <div className="overflow-hidden rounded-3xl border border-white/5 bg-[#0a0a0f] shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-white/5">Entidad</th>
                <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-white/5">Tipo de Llave Primaria</th>
                <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-white/5">Estrategia de Indexación</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-400">
              {[
                { name: 'Media_Master', pk: 'UUID (v7)', idx: 'GIST en Vector de Búsqueda' },
                { name: 'Episode_Entry', pk: 'Compuesta (Media + SN + EN)', idx: 'B-Tree en Fecha de Estreno' },
                { name: 'Server_Manifest', pk: 'UUID', idx: 'Filtro Parcial (Active=True)' },
                { name: 'Provider_Resolver', pk: 'Slug (String)', idx: 'Hash para búsquedas rápidas' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                  <td className="p-6 border-b border-white/5 text-white font-bold">{row.name}</td>
                  <td className="p-6 border-b border-white/5 font-mono text-xs">{row.pk}</td>
                  <td className="p-6 border-b border-white/5 text-xs text-violet-400 font-bold">{row.idx}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0a0a0f] to-[#111] border border-white/5 relative group overflow-hidden">
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-pink-500/5 blur-3xl group-hover:bg-pink-500/10 transition-all"></div>
          <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <i className="fa-solid fa-cloud-moon text-pink-500"></i> La Sinergia con TMDB
          </h4>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-xs text-slate-400 font-bold">01</div>
              <p className="text-sm text-slate-400">El sistema detecta nueva carga de contenido vía el cluster de scraping.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-xs text-slate-400 font-bold">02</div>
              <p className="text-sm text-slate-400">Un trabajador asíncrono consulta la <strong>API de TMDB</strong> para el enriquecimiento de metadatos.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-xs text-slate-400 font-bold">03</div>
              <p className="text-sm text-slate-400">El ID del contenido se vincula al <code>TMDB_ID</code> como fuente de verdad para la indexación global.</p>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-[#0a0a0f] border border-white/5 flex flex-col justify-center">
          <div className="p-6 bg-black rounded-2xl border border-white/5 font-mono text-xs leading-relaxed text-indigo-300">
            <p className="text-slate-600 mb-2">// Muestra de Optimización de Consulta</p>
            <p className="text-white">SELECT m.title, s.embed_url</p>
            <p>FROM media_master m</p>
            <p>JOIN server_manifest s ON m.id = s.media_id</p>
            <p>WHERE m.tmdb_id = $1</p>
            <p>AND s.active = true</p>
            <p>ORDER BY s.priority DESC;</p>
          </div>
          <p className="mt-4 text-[10px] text-slate-500 text-center uppercase tracking-widest font-bold">Latencia: 0.42ms (Cacheado en Redis)</p>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSection;
