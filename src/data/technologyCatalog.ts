export type TechnologyGroupId = 'client' | 'backend' | 'platform';

export interface TechnologyItem {
  name: string;
  logo?: string;
  wideLogo?: boolean;
  color: string;
}

export type TechnologyCatalog = Record<TechnologyGroupId, TechnologyItem[]>;

const SIMPLE_ICONS = 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons';

export const technologyCatalog: TechnologyCatalog = {
  client: [
    { name: 'Flutter', logo: `${SIMPLE_ICONS}/flutter.svg`, color: '#54C5F8' },
    { name: 'Dart', logo: `${SIMPLE_ICONS}/dart.svg`, color: '#0175C2' },
    { name: 'Android', logo: `${SIMPLE_ICONS}/android.svg`, color: '#3DDC84' },
    { name: 'Kotlin', logo: `${SIMPLE_ICONS}/kotlin.svg`, color: '#7F52FF' },
    { name: 'React', logo: `${SIMPLE_ICONS}/react.svg`, color: '#61DAFB' },
    { name: 'TypeScript', logo: `${SIMPLE_ICONS}/typescript.svg`, color: '#3178C6' },
    { name: 'Vite', logo: `${SIMPLE_ICONS}/vite.svg`, color: '#646CFF' },
    { name: 'Electron', logo: `${SIMPLE_ICONS}/electron.svg`, color: '#9FEAF9' },
  ],
  backend: [
    { name: 'Node.js', logo: `${SIMPLE_ICONS}/nodedotjs.svg`, color: '#5FA04E' },
    { name: 'Express', logo: `${SIMPLE_ICONS}/express.svg`, color: '#B8C0BD' },
    { name: 'Prisma', logo: `${SIMPLE_ICONS}/prisma.svg`, color: '#7C8BA1' },
    { name: 'PostgreSQL', logo: `${SIMPLE_ICONS}/postgresql.svg`, color: '#4169E1' },
    { name: 'Python', logo: `${SIMPLE_ICONS}/python.svg`, color: '#3776AB' },
    { name: 'Flask', logo: `${SIMPLE_ICONS}/flask.svg`, color: '#D7DDDA' },
    { name: 'SQLite', logo: `${SIMPLE_ICONS}/sqlite.svg`, color: '#003B57' },
  ],
  platform: [
    { name: 'Firebase', logo: `${SIMPLE_ICONS}/firebase.svg`, color: '#FFCA28' },
    { name: 'Stripe', logo: `${SIMPLE_ICONS}/stripe.svg`, color: '#635BFF' },
    {
      name: 'Serverpod',
      logo: 'https://raw.githubusercontent.com/serverpod/serverpod/main/examples/legacy/chat/chat_server/web/static/serverpod-logo.svg',
      wideLogo: true,
      color: '#6EA8FE',
    },
    { name: 'Monaco Editor', color: '#5DADE2' },
    { name: 'Pandas', logo: `${SIMPLE_ICONS}/pandas.svg`, color: '#150458' },
  ],
};
