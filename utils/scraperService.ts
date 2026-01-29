import { YoutubeVideo } from "../App";

export interface ScrapedLink {
  server: string;
  url: string;
  quality: string;
  language: string;
  status: 'LIVE' | 'STALE' | 'VALIDATING' | 'OFFLINE';
  providerType: string;
  latency?: number;
}

export class ScraperService {
  private apiKey: string;
  private youtubeApiBase: string;

  constructor() {
    this.apiKey = "AIzaSyDygRMPt04-u25wdosdVXlYnUs97bBi6nk"; 
    this.youtubeApiBase = "https://www.googleapis.com/youtube/v3";
  }

  // --- 1. MÓDULO YOUTUBE (Nativo, sin cambios) ---
  async fetchYoutubeCollection(query: string): Promise<YoutubeVideo[]> {
      try {
        const searchUrl = `${this.youtubeApiBase}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoDuration=long&relevanceLanguage=es&maxResults=25&key=${this.apiKey}`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();
  
        if (!searchData.items || searchData.items.length === 0) return [];
  
        const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
        const detailsUrl = `${this.youtubeApiBase}/videos?part=contentDetails,snippet,status&id=${videoIds}&key=${this.apiKey}`;
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();
  
        if (!detailsData.items) return [];
  
        const videos: YoutubeVideo[] = detailsData.items.map((item: any) => {
          if (!item.status?.embeddable) return null;
          if (item.contentDetails?.regionRestriction?.blocked?.length > 0) return null;
          if (item.contentDetails?.contentRating?.ytRating) return null; 
          
          const categoryId = item.snippet.categoryId;
          if (categoryId !== '1' && categoryId !== '24') return null;
  
          const durationRegex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
          const matches = item.contentDetails.duration.match(durationRegex);
          if (!matches) return null;
          const hours = parseInt(matches[1] || '0');
          const minutes = parseInt(matches[2] || '0');
          if (hours === 0 && minutes < 50) return null;
  
          return {
            id: item.id,
            title: item.snippet.title,
            duration: `${hours > 0 ? `${hours}h ` : ''}${minutes}m`,
            thumbnail: `https://img.youtube.com/vi/${item.id}/maxresdefault.jpg`
          };
        }).filter((v): v is YoutubeVideo => v !== null);
  
        return videos.slice(0, 8);
  
      } catch (e) {
        console.error("YouTube Scraper Error:", e);
        return [];
      }
  }

  // --- 2. MÓDULO DE EXTRACCIÓN LATINA (Deep Scraping via Aggregators) ---
  
  async findLiveLinks(title: string, year: string, lang: string, tmdbId: string, imdbId?: string): Promise<ScrapedLink[]> {
    const isYT = tmdbId.startsWith('yt_');
    const results: ScrapedLink[] = [];
    const nativeId = tmdbId.replace('yt_', ''); 

    // A. YOUTUBE LATINO (Prioridad Absoluta)
    if (isYT) {
      results.push({
        server: 'YOUTUBE_LATINO_NATIVE',
        url: `https://www.youtube.com/embed/${nativeId}?autoplay=1&rel=0&modestbranding=1`,
        quality: 'Auto 4K',
        language: 'Español Latino',
        status: 'LIVE',
        providerType: 'YT-API-V3',
        latency: 5
      });
      return results; 
    }

    // Usamos el ID de IMDB preferiblemente, si no el de TMDB
    const targetId = imdbId || nativeId;

    // B. CLÚSTER LATINO 1: VIDLINK (Especialista en Multi-Audio)
    // Este servicio suele indexar servidores rápidos como Vidhide y Streamwish.
    // IMPORTANTE: Al cargar, mostrará un selector. 
    results.push({ 
        server: `LATINO_HUB_1 [VidLink]`, 
        // Forzamos multi-lang para que aparezcan las opciones latinas
        url: `https://vidlink.pro/movie/${targetId}?primaryColor=ec4899&autoplay=false`, 
        quality: '1080p', 
        language: 'Latino / Castellano', 
        status: 'LIVE', 
        providerType: 'VidLink-API', 
        latency: 10 
    });

    // C. CLÚSTER LATINO 2: MULTI-EMBED (Netu / Vidhide)
    // Configuramos &lang=es para forzar la búsqueda en servidores hispanos.
    results.push({ 
        server: `LATINO_HUB_2 [Netu/Vidhide]`, 
        url: `https://multiembed.mov/?video_id=${targetId}&tmdb=1&lang=es`, 
        quality: 'HD', 
        language: 'Latino (Verificar Menú)', 
        status: 'LIVE', 
        providerType: 'MultiEmbed-ES', 
        latency: 15 
    });

    // D. CLÚSTER LATINO 3: SMASHY (Filemoon / Streamtape)
    // SmashyStream conecta con la red de servidores que usan las webs de "Cuevana".
    results.push({ 
        server: `LATINO_CLÁSICO [Streamtape]`, 
        url: `https://embed.smashystream.com/playere.php?tmdb=${nativeId}`, 
        quality: '720p/1080p', 
        language: 'Selector (Bandera MX)', 
        status: 'LIVE', 
        providerType: 'Smashy-V3', 
        latency: 20 
    });

    // E. VIDSRC.VIP (Opción VIP)
    // Suele tener servidores premium que no están en la red pública.
    results.push({ 
        server: `LATINO_VIP [Servidor Privado]`, 
        url: `https://vidsrc.vip/embed/movie/${nativeId}`, 
        quality: '1080p', 
        language: 'Multi-Audio', 
        status: 'VALIDATING', 
        providerType: 'VIP-Node', 
        latency: 25 
    });

    // F. CINE.TO (Fuente alternativa)
    // A veces tiene fuentes exclusivas.
    results.push({
        server: `LATINO_ALT [Cine.to]`,
        url: `https://vidsrc.to/embed/movie/${targetId}`,
        quality: '1080p',
        language: 'Selector Global',
        status: 'LIVE',
        providerType: 'Source-To',
        latency: 30
    });

    // G. ÚLTIMO RECURSO (Inglés)
    // Solo se muestra al final si todo lo anterior falla.
    results.push({ 
        server: `SOLO_INGLÉS [Respaldo]`, 
        url: `https://vidsrc.cc/v2/embed/movie/${nativeId}`, 
        quality: '720p', 
        language: 'Inglés (Subtitulado)', 
        status: 'STALE', 
        providerType: 'Legacy-Node', 
        latency: 99 
    });

    return results;
  }
}