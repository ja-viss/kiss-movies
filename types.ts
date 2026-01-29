
export interface ArchitectureSection {
  id: string;
  title: string;
  icon: string;
  content: string;
  techStack: string[];
}

export enum SectionType {
  MICROSERVICES = 'microservices',
  DATABASE = 'database',
  SCRAPING = 'scraping',
  SECURITY = 'security',
  DEVOPS = 'devops'
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  language: 'es-LATAM' | 'en-US';
  history: string[];
}
