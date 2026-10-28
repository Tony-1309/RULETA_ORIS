export interface University {
  id: string;
  name: string;
  shortName: string;
  role: string;
  isHost?: boolean;
  color: string;
}

export interface Panelist {
  id: number;
  name: string;
  type: 'Saliente' | 'Entrante' | 'Egresado Especial';
  program: string;
  homeInstitution: string;
  hostInstitution: string;
  country: string;
  flag: string;
  destinationOrOrigin: string;
  programType?: string;
}

export const UNIVERSITIES: University[] = [
  { id: 'udenar', name: 'Universidad de Nariño', shortName: 'U. de Nariño', role: 'Fundadora ORIS', color: '#047857' },
  { id: 'ucc', name: 'Universidad Cooperativa de Colombia', shortName: 'UCC Pasto', role: 'Fundadora ORIS', color: '#0284c7' },
  { id: 'cesmag', name: 'Universidad CESMAG', shortName: 'U. CESMAG', role: 'Anfitriona del Evento (Auditorio San Francisco 2)', isHost: true, color: '#e11d48' },
  { id: 'mariana', name: 'Universidad Mariana', shortName: 'U. Mariana', role: 'Fundadora ORIS', color: '#f59e0b' },
  { id: 'sanmartin', name: 'Fundación Universitaria San Martín', shortName: 'F.U. San Martín', role: 'Fundadora ORIS', color: '#6366f1' },
  { id: 'uniminuto', name: 'UNIMINUTO', shortName: 'UNIMINUTO', role: 'Fundadora ORIS', color: '#ec4899' },
  { id: 'unicatolica', name: 'UniCatólica del Sur', shortName: 'UniCatólica del Sur', role: 'Fundadora ORIS', color: '#14b8a6' },
];

export const COUNTRIES = [
  { name: 'Colombia', flag: '🇨🇴', code: 'CO' },
  { name: 'Chile', flag: '🇨🇱', code: 'CL' },
  { name: 'Perú', flag: '🇵🇪', code: 'PE' },
  { name: 'México', flag: '🇲🇽', code: 'MX' },
  { name: 'Bolivia', flag: '🇧🇴', code: 'BO' },
  { name: 'Inglaterra', flag: '🇬🇧', code: 'GB' },
  { name: 'España', flag: '🇪🇸', code: 'ES' },
  { name: 'China', flag: '🇨🇳', code: 'CN' },
];

export const PANELISTAS: Panelist[] = [
  {
    id: 1,
    name: 'Gladys Anyelynne Coral Riascos',
    type: 'Saliente',
    program: 'Derecho',
    homeInstitution: 'Universidad CESMAG',
    hostInstitution: 'Universidad de La Guajira',
    country: 'Colombia',
    flag: '🇨🇴',
    destinationOrOrigin: 'La Guajira, Colombia'
  },
  {
    id: 2,
    name: 'Jonathan David López Criollo',
    type: 'Saliente',
    program: 'Derecho',
    homeInstitution: 'Universidad CESMAG',
    hostInstitution: 'Universidad de La Guajira',
    country: 'Colombia',
    flag: '🇨🇴',
    destinationOrOrigin: 'La Guajira, Colombia'
  },
  {
    id: 3,
    name: 'Thiago Rodríguez Arturo',
    type: 'Saliente',
    program: 'Psicología',
    homeInstitution: 'Universidad CESMAG',
    hostInstitution: 'Universidad de La Guajira',
    country: 'Colombia',
    flag: '🇨🇴',
    destinationOrOrigin: 'La Guajira, Colombia'
  },
  {
    id: 4,
    name: 'María Camila Parra Cárdenas',
    type: 'Saliente',
    program: 'Psicología',
    homeInstitution: 'Universidad CESMAG',
    hostInstitution: 'Universidad Católica de Pereira',
    country: 'Colombia',
    flag: '🇨🇴',
    destinationOrOrigin: 'Pereira, Colombia'
  },
  {
    id: 5,
    name: 'Luisa Fernanda Guerrero Burbano',
    type: 'Saliente',
    program: 'Administración de Empresas',
    homeInstitution: 'Universidad CESMAG',
    hostInstitution: 'Universidad Veracruzana',
    country: 'México',
    flag: '🇲🇽',
    destinationOrOrigin: 'Veracruz, México'
  },
  {
    id: 6,
    name: 'Luciana Andrea Valencia Guzmán',
    type: 'Entrante',
    program: 'Terapia Ocupacional',
    homeInstitution: 'Universidad de La Frontera (UFRO), Chile',
    hostInstitution: 'Universidad Mariana',
    country: 'Chile',
    flag: '🇨🇱',
    destinationOrOrigin: 'Temuco, Chile',
    programType: 'Programa de Becas de Reciprocidad'
  },
  {
    id: 7,
    name: 'Luz Celene Tello Fernández',
    type: 'Entrante',
    program: 'Psicología',
    homeInstitution: 'Universidad César Vallejo (UCV), Perú',
    hostInstitution: 'Universidad Mariana',
    country: 'Perú',
    flag: '🇵🇪',
    destinationOrOrigin: 'Lima / Trujillo, Perú',
    programType: 'Programa de Becas de Reciprocidad'
  },
  {
    id: 8,
    name: 'Diego Navarrete Salmerón',
    type: 'Entrante',
    program: 'Mercadeo',
    homeInstitution: 'Universidad del Valle de Atemajac (UNIVA), México',
    hostInstitution: 'Universidad Mariana',
    country: 'México',
    flag: '🇲🇽',
    destinationOrOrigin: 'Guadalajara, México',
    programType: 'Programa de Becas de Reciprocidad'
  },
  {
    id: 9,
    name: 'Lucy Mary Rengifo Arias',
    type: 'Entrante',
    program: 'Movilidad Académica',
    homeInstitution: 'U. Mayor, Real y Pontificia de San Francisco Xavier de Chuquisaca',
    hostInstitution: 'Universidad Cooperativa de Colombia (UCC)',
    country: 'Bolivia',
    flag: '🇧🇴',
    destinationOrOrigin: 'Sucre, Bolivia',
    programType: 'Programa MARCA (ARCU-SUR)'
  },
  {
    id: 10,
    name: 'Esteban Paz Arturo',
    type: 'Egresado Especial',
    program: 'Adm. Negocios Internacionales (U. Mariana) | Esp. Gerencia Social (U. de Nariño) | Máster Negocios Int. (U. Europea de Valencia)',
    homeInstitution: 'U. Mariana & U. de Nariño',
    hostInstitution: 'Oficina de Asuntos Internacionales de la Alcaldía Municipal de Pasto',
    country: 'Internacional',
    flag: '🌐',
    destinationOrOrigin: 'Experiencias en Inglaterra 🇬🇧, España 🇪🇸 y China 🇨🇳'
  }
];

export const MODERATOR = {
  name: 'Profesora Sofía Vallejos',
  title: 'Directora de la Oficina de Relaciones Nacionales e Internacionales (ORI)',
  institution: 'Universidad Mariana'
};
