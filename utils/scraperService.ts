import { YoutubeVideo } from "../App";

// 1. Interfaces para los resultados
export interface ScrapedLink {
  server: string;
  url: string;
  quality: string;
  language: string;
  status: 'LIVE' | 'STALE' | 'VALIDATING' | 'OFFLINE';
  providerType: string;
  latency?: number;
}

// Interfaz para Internet Archive
export interface ArchiveItem {
  identifier: string;
  title: string;
  description: string;
  mediaType: string;
  year: string;
  downloads: number;
  thumbnail: string;
  link: string;
  language?: string;
  duration?: string;
}

export class ScraperService {
  private apiKey: string;
  private youtubeApiBase: string;
  private archiveApiBase: string;

  constructor() {
    this.apiKey = "AIzaSyDygRMPt04-u25wdosdVXlYnUs97bBi6nk"; 
    this.youtubeApiBase = "https://www.googleapis.com/youtube/v3";
    this.archiveApiBase = "https://archive.org/advancedsearch.php";
  }

  // --- HELPER: Parsear duración a segundos ---
  private parseDurationToSeconds(duration: any): number {
    if (!duration) return 0;
    const str = Array.isArray(duration) ? duration[0] : duration; 
    if (typeof str !== 'string') return 0;
    if (!str.includes(':')) return parseInt(str, 10);

    const parts = str.split(':').map(part => parseInt(part, 10));
    let seconds = 0;

    if (parts.length === 3) { // HH:MM:SS
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) { // MM:SS
      seconds = parts[0] * 60 + parts[1];
    }
    return seconds;
  }

  // --- 1. MÓDULO YOUTUBE ---
  async fetchYoutubeCollection(query: string, limit: number = 8): Promise<YoutubeVideo[]> {
      try {
        const apiMaxResults = limit * 2;
        const searchUrl = `${this.youtubeApiBase}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoDuration=long&relevanceLanguage=es&maxResults=${apiMaxResults}&key=${this.apiKey}`;
        
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
          const durationRegex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
          const matches = item.contentDetails.duration.match(durationRegex);
          if (!matches) return null;
          const hours = parseInt(matches[1] || '0');
          const minutes = parseInt(matches[2] || '0');
          
          if (hours === 0 && minutes < 20) return null;
  
          return {
            id: item.id,
            title: item.snippet.title,
            duration: `${hours > 0 ? `${hours}h ` : ''}${minutes}m`,
            thumbnail: `https://img.youtube.com/vi/${item.id}/mqdefault.jpg`
          };
        }).filter((v): v is YoutubeVideo => v !== null);
  
        return videos.slice(0, limit);
      } catch (e) {
        console.error("YouTube Scraper Error:", e);
        return [];
      }
  }

  // ==========================================
  // 2. MÓDULO INTERNET ARCHIVE (OPTIMIZADO V2)
  // ==========================================
  async searchInternetArchive(query: string, type: string = 'movies'): Promise<ArchiveItem[]> {
    try {
      const isMovie = type === 'movies';
      
      // OPTIMIZACIÓN: Al filtrar mejor la consulta, no necesitamos pedir 150 items.
      // Con 50 es suficiente para tener resultados de calidad.
      const rowsToFetch = isMovie ? 50 : 40;

      let luceneQuery = `mediatype:(${type})`;
      let sortParam = '&sort[]=downloads desc'; 

      // --- ESTRATEGIA PARA PELÍCULAS ---
      if (isMovie) {
        // En lugar de traer todo y filtrar, pedimos directamente a las colecciones de LARGOMETRAJES.
        // feature_films: Películas principales
        // sci-fi: Colección específica de Sci-Fi
        // horror_movies: Colección específica de Terror
        // silent_films: Cine clásico mudo
        luceneQuery += ` AND (collection:(feature_films) OR collection:(moviesandfilms) OR collection:(sci-fi) OR collection:(horror_movies) OR collection:(silent_films))`;
      }

      // --- ESTRATEGIA DE BÚSQUEDA ---
      if (query && query.trim().length > 0) {
        // Búsqueda abierta en TODOS los campos (Título, Descripción, Metadata)
        // Esto permite encontrar PDFs, EPUBs y documentos por su contenido o etiquetas
        luceneQuery += ` AND (${query})`;
        sortParam = ''; // Usamos relevancia
      }

      const encodedQuery = encodeURIComponent(luceneQuery);
      // Pedimos 'format' para saber si es PDF, EPUB, etc.
      const fields = 'identifier,title,mediatype,description,year,downloads,language,duration,format';
      const url = `${this.archiveApiBase}?q=${encodedQuery}&fl[]=${fields.split(',').join('&fl[]=')}&rows=${rowsToFetch}&output=json${sortParam}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.response && data.response.docs) {
        let docs = data.response.docs;

        // FILTRO DE SEGURIDAD (Solo Películas)
        // Aunque la query ya filtra por colección, nos aseguramos que sean > 45 mins
        if (isMovie) {
          docs = docs.filter((doc: any) => {
            if (!doc.duration) return true; // Si no tiene duración, a veces es mejor dejarlo pasar por si acaso
            const seconds = this.parseDurationToSeconds(doc.duration);
            return seconds > 2700; // > 45 minutos
          });
        }

        return docs.slice(0, 24).map((doc: any) => ({
          identifier: doc.identifier,
          title: doc.title,
          description: doc.description ? doc.description.replace(/<[^>]*>?/gm, '').slice(0, 180) + '...' : 'Sin descripción',
          mediaType: doc.mediatype,
          year: doc.year || 'N/A',
          downloads: doc.downloads || 0,
          // Normalización robusta de idioma (EJ: "SPA", "ENG", "UNK")
          language: Array.isArray(doc.language) 
            ? doc.language[0].toUpperCase().substring(0, 3) 
            : (doc.language ? doc.language.toUpperCase().substring(0, 3) : 'UNK'),
          thumbnail: `https://archive.org/services/img/${doc.identifier}`,
          link: `https://archive.org/details/${doc.identifier}`
        }));
      }
      
      return [];
    } catch (e) {
      console.error("Archive Scraper Error:", e);
      return [];
    }
  }

  // --- 3. MÓDULO DE EXTRACCIÓN LATINA (Sin cambios) ---
  async findLiveLinks(title: string, year: string, lang: string, tmdbId: string, imdbId?: string): Promise<ScrapedLink[]> {
    const isYT = tmdbId.startsWith('yt_');
    const results: ScrapedLink[] = [];
    const nativeId = tmdbId.replace('yt_', ''); 

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

    const targetId = imdbId || nativeId;

    results.push({ 
        server: `LATINO_HUB_1 [VidLink]`, 
        url: `https://vidlink.pro/movie/${targetId}?primaryColor=ec4899&autoplay=false`, 
        quality: '1080p', 
        language: 'Latino / Castellano', 
        status: 'LIVE', 
        providerType: 'VidLink-API', 
        latency: 10 
    });

    results.push({ 
        server: `LATINO_HUB_2 [Netu/Vidhide]`, 
        url: `https://multiembed.mov/?video_id=${targetId}&tmdb=1&lang=es`, 
        quality: 'HD', 
        language: 'Latino (Verificar Menú)', 
        status: 'LIVE', 
        providerType: 'MultiEmbed-ES', 
        latency: 15 
    });

    results.push({ 
        server: `LATINO_CLÁSICO [Streamtape]`, 
        url: `https://embed.smashystream.com/playere.php?tmdb=${nativeId}`, 
        quality: '720p/1080p', 
        language: 'Selector (Bandera MX)', 
        status: 'LIVE', 
        providerType: 'Smashy-V3', 
        latency: 20 
    });

    results.push({ 
        server: `LATINO_VIP [Servidor Privado]`, 
        url: `https://vidsrc.vip/embed/movie/${nativeId}`, 
        quality: '1080p', 
        language: 'Multi-Audio', 
        status: 'VALIDATING', 
        providerType: 'VIP-Node', 
        latency: 25 
    });

    results.push({
        server: `LATINO_ALT [Cine.to]`,
        url: `https://vidsrc.to/embed/movie/${targetId}`,
        quality: '1080p',
        language: 'Selector Global',
        status: 'LIVE',
        providerType: 'Source-To',
        latency: 30
    });

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