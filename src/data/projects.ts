export type ProjectCategory = 'Language' | 'AI & Developer Tools' | 'Product';

export interface Project {
  slug: string;
  title: string;
  shortTitle: string;
  category: ProjectCategory;
  status: string;
  number: string;
  summary: string;
  overview: string;
  technologies: string[];
  features: string[];
  challenges: { title: string; description: string }[];
  architecture: { label: string; detail: string }[];
  gallery: { title: string; caption: string; image?: string }[];
  github?: string;
  tone: 'lime' | 'blue' | 'sand' | 'lavender' | 'slate' | 'coral';
  mockup: 'morphology' | 'commerce' | 'language' | 'keyboard' | 'ide' | 'inflection';
}

export const projects: Project[] = [
  {
    slug: 'glyphora', title: 'Glyphora', shortTitle: 'Glyphora', category: 'Product', status: 'Active development', number: '01',
    summary: 'A multilingual community built as a language ecosystem, with Chữ Nôm support and a long-term focus on underrepresented languages, dialects, and writing systems.',
    overview: 'Glyphora (万文社) is not designed as a generic social network with translation added on top. It treats language itself as a community layer: people can publish, discover, chat, and share notes around the languages and scripts they use. Chữ Nôm is one of its current focal areas, while the broader direction is to expand support for more underrepresented languages, dialects, and writing systems and give them room to build lasting digital communities and ecosystems. The repository contains Flutter and React Native clients, a Node.js API, a React administration app, PostgreSQL data, and Firebase services.',
    technologies: ['Flutter', 'Dart', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Firebase', 'React'],
    features: ['Text and image posts', 'Likes, comments, categories, and feeds', 'Friends, direct messages, and real-time chat', 'Shared rich-text notes', 'Chữ Nôm and multilingual language spaces', 'Profiles, discovery, and administration'],
    challenges: [
      { title: 'Message lifecycle', description: 'The repository documents logical message deletion, scheduled cleanup, media cleanup, and chat-preview refresh behavior.' },
      { title: 'Hybrid data services', description: 'Server-side business data uses Node.js, Prisma, and PostgreSQL while authentication, chat, storage, and other real-time services use Firebase.' },
    ],
    architecture: [{ label: 'Flutter', detail: 'Mobile client' }, { label: 'Node.js API', detail: 'Express + Prisma' }, { label: 'PostgreSQL', detail: 'Application data' }, { label: 'Firebase', detail: 'Auth + real-time services' }],
    gallery: [{ title: 'Community posts', caption: 'Text, images, categories, likes, and comments.' }, { title: 'Real-time chat', caption: 'Direct messages, chat previews, and message lifecycle handling.' }, { title: 'Shared notes', caption: 'Rich-text notes shared by chat participants.' }],
    github: 'https://github.com/chengyang1017/glyphora', tone: 'lime', mockup: 'language',
  },
  {
    slug: 'shopping-app', title: 'ShoppingApp123', shortTitle: 'Commerce', category: 'Product', status: 'Active development', number: '02',
    summary: 'A full-stack commerce monorepo with a Flutter customer app, React administration dashboard, and Node.js backend API.',
    overview: 'ShoppingApp123 combines a Flutter customer application, a React and Vite administration dashboard, and a shared Node.js and Express REST API. Prisma connects the backend to PostgreSQL, and Stripe handles payments.',
    technologies: ['Flutter', 'Dart', 'BLoC / Cubit', 'React', 'TypeScript', 'Vite', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Stripe'],
    features: ['Customer authentication and product browsing', 'Cart, checkout, addresses, and order management', 'Stripe payment integration', 'Admin product, category, order, and inventory management', 'English and Chinese localization'],
    challenges: [
      { title: 'Shared commerce backend', description: 'The Flutter app and React admin dashboard use the same Express API and business data.' },
      { title: 'Payment authority', description: 'The repository keeps final payment status on the backend rather than treating a client submission as confirmation.' },
    ],
    architecture: [{ label: 'Flutter', detail: 'Customer app' }, { label: 'React', detail: 'Admin dashboard' }, { label: 'Express API', detail: 'Node.js + TypeScript' }, { label: 'Prisma', detail: 'PostgreSQL + Stripe' }],
    gallery: [{ title: 'Customer application', caption: 'Product browsing, cart, checkout, and orders in Flutter.' }, { title: 'Administration', caption: 'React tools for catalog, orders, and inventory.' }, { title: 'Commerce API', caption: 'Express, Prisma, PostgreSQL, and Stripe.' }],
    github: 'https://github.com/chengyang1017/shoppingapp123', tone: 'coral', mockup: 'commerce',
  },
  {
    slug: 'language-platform', title: 'Language Platform', shortTitle: 'Language Platform', category: 'Language', status: 'In Development', number: '03',
    summary: 'A language platform in development using ASP.NET Core, Entity Framework Core, and PostgreSQL.',
    overview: 'This project is currently in development. The verified technology stack is ASP.NET Core, Entity Framework Core, and PostgreSQL. No public repository or demo was provided.',
    technologies: ['ASP.NET Core', 'Entity Framework Core', 'PostgreSQL'],
    features: [], challenges: [],
    architecture: [{ label: 'ASP.NET Core', detail: 'Application backend' }, { label: 'EF Core', detail: 'Data access' }, { label: 'PostgreSQL', detail: 'Database' }],
    gallery: [], tone: 'blue', mockup: 'language',
  },
  {
    slug: 'nom-input-method', title: 'Nôm Input Method', shortTitle: 'Nôm IME', category: 'Language', status: 'Public repository', number: '04',
    summary: 'An offline Android input method for composing Vietnamese Chữ Nôm with local dictionary data and ranked candidates.',
    overview: 'The chu-nom-ime repository is an Android application written in Kotlin. It implements an Android InputMethodService, Telex input parsing, local SQLite-backed Nôm data, sentence candidate generation and ranking, and bundled Nôm fonts.',
    technologies: ['Android', 'Kotlin', 'SQLite', 'InputMethodService', 'Telex'],
    features: ['Android Chữ Nôm keyboard service', 'Telex composition and Vietnamese tone handling', 'Local SQLite dictionary', 'Sentence segmentation and ranked candidates', 'Bundled fonts and offline operation'],
    challenges: [
      { title: 'Local candidate pipeline', description: 'Kotlin source implements parsing, phrase segmentation, dictionary lookup, candidate generation, and ranking on device.' },
      { title: 'Nôm font coverage', description: 'The app bundles Nôm fonts and includes runtime typeface selection for variation selectors and glyph coverage.' },
    ],
    architecture: [{ label: 'Android IME', detail: 'Kotlin service' }, { label: 'Input engine', detail: 'Telex + sentence parser' }, { label: 'Ranker', detail: 'Candidate scoring' }, { label: 'SQLite', detail: 'Offline Nôm data' }],
    gallery: [{ title: 'Input method', caption: 'Android InputMethodService and keyboard controller.' }, { title: 'Candidate engine', caption: 'Sentence generation and ranking from Vietnamese input.' }, { title: 'Offline data', caption: 'Bundled dictionary assets and SQLite access.' }],
    github: 'https://github.com/chengyang1017/chu-nom-ime', tone: 'sand', mockup: 'keyboard',
  },
  {
    slug: 'ai-code-tutor', title: 'AI Code Tutor IDE', shortTitle: 'Code Tutor IDE', category: 'AI & Developer Tools', status: 'Alpha 0.14', number: '05',
    summary: 'An Electron desktop editor prototype with Monaco, an animated in-editor tutor, Dart semantic navigation, speech, and persistent code notes.',
    overview: 'AI Code Tutor IDE is an Electron and Vite desktop editor written in TypeScript. The current alpha uses Monaco Editor, works with real project files, provides Dart semantic navigation through the Dart Analysis Server, and places an animated tutor inside the code view.',
    technologies: ['Electron', 'Vite', 'TypeScript', 'Monaco Editor', 'Dart Analysis Server', 'WebSocket'],
    features: ['Open and edit real project files', 'Ctrl+S writes changes to disk', 'Dart definition, references, and call hierarchy', 'Animated tutor that moves across files', 'Persistent code notes', 'Windows native text-to-speech and session restore'],
    challenges: [
      { title: 'Semantic Dart navigation', description: 'Definition, references, document symbols, and call hierarchy are sourced from the Dart Analysis Server.' },
      { title: 'Persistent local state', description: 'The Electron main process stores project state, code notes, preferences, and an encrypted API key through safeStorage.' },
    ],
    architecture: [{ label: 'Electron', detail: 'Desktop process' }, { label: 'Vite UI', detail: 'TypeScript renderer' }, { label: 'Monaco', detail: 'Code editor' }, { label: 'Dart Analysis', detail: 'Semantic navigation' }],
    gallery: [{ title: 'Real project editing', caption: 'Monaco-based editing and Ctrl+S disk writes.' }, { title: 'In-editor tutor', caption: 'Animated tutor movement and teaching steps inside the code view.' }, { title: 'Code notes', caption: 'Persistent notes anchored to project files and lines.' }],
    github: 'https://github.com/chengyang1017/ai-ide', tone: 'slate', mockup: 'ide',
  },
  {
    slug: 'kyrgyz-inflection-generator', title: 'Kyrgyz Inflection Generator', shortTitle: 'Kyrgyz Forms', category: 'Language', status: 'Public repository', number: '06',
    summary: 'A rule-based Python generator for Kyrgyz noun and verb inflection with structured dataset exports.',
    overview: 'This Python project encodes Kyrgyz morphology rules and applies them to noun and verb stems. It handles vowel harmony, consonant behavior, grammatical forms, batch processing, tests, and data export.',
    technologies: ['Python', 'Pandas', 'SQLite', 'CSV', 'JSON', 'Excel'],
    features: ['Noun plural, case, and possessive forms', 'Verb person, tense, and negative forms', 'Vowel harmony and consonant changes', 'Batch vocabulary processing', 'CSV, JSON, Excel, and SQLite export', 'Automated tests'],
    challenges: [
      { title: 'Rule-based suffix selection', description: 'Suffixes are selected from the final vowel, vowel harmony, final consonant class, and special forms.' },
      { title: 'Structured dataset generation', description: 'Generated forms are assembled with Pandas and exported to multiple data formats.' },
    ],
    architecture: [{ label: 'Vocabulary', detail: 'Nouns + verbs' }, { label: 'Grammar', detail: 'Kyrgyz rules' }, { label: 'Generator', detail: 'Inflected forms' }, { label: 'Exports', detail: 'CSV + JSON + Excel + SQLite' }],
    gallery: [{ title: 'Noun inflection', caption: 'Plural, case, and possessive generation.' }, { title: 'Verb inflection', caption: 'Person, tense, and negative forms.' }, { title: 'Dataset output', caption: 'Structured export through Pandas.' }],
    github: 'https://github.com/chengyang1017/kyrgyz-inflection-generator', tone: 'lavender', mockup: 'inflection',
  },
  {
    slug: 'multilanguage-dictionary', title: 'Multilanguage Dictionary', shortTitle: 'Dictionary', category: 'Language', status: 'Public repository', number: '07',
    summary: 'A Chinese-centric multilingual dictionary architecture for vocabulary across more than 100 languages.',
    overview: 'Multilanguage Dictionary uses Flask and SQLite for search, with an HTML, CSS, and JavaScript interface. Language-specific schemas support different entry structures, and Python scripts convert Excel source dictionaries to SQLite.',
    technologies: ['Python', 'Flask', 'SQLite', 'HTML', 'CSS', 'JavaScript', 'Excel'],
    features: ['Chinese and target-language search', 'Architecture for 100+ languages', 'Per-language SQLite databases', 'Language-specific entry schemas', 'Excel-to-SQLite conversion', 'Responsive web interface'],
    challenges: [
      { title: 'Language-specific schemas', description: 'Different languages can define fields for their own parts of speech and grammatical data.' },
      { title: 'Dictionary data pipeline', description: 'Excel source files are transformed into the SQLite databases used by the Flask search service.' },
    ],
    architecture: [{ label: 'Excel', detail: 'Dictionary sources' }, { label: 'Python', detail: 'Data conversion' }, { label: 'SQLite', detail: 'Per-language data' }, { label: 'Flask', detail: 'Search API + web UI' }],
    gallery: [{ title: 'Dictionary search', caption: 'Chinese and target-language queries.' }, { title: 'Language schemas', caption: 'Dynamic fields for different languages and parts of speech.' }, { title: 'Data conversion', caption: 'Excel source dictionaries converted to SQLite.' }],
    github: 'https://github.com/chengyang1017/multilanguage-dictionary', tone: 'blue', mockup: 'language',
  },
  {
    slug: 'morphology-engine', title: 'morphology-engine', shortTitle: 'Morphology Engine', category: 'Language', status: 'v0.1', number: '08',
    summary: 'A reusable Python morphology engine with rule tracing and initial support for Kyrgyz nominal morphology.',
    overview: 'Multilingual Morphology Engine separates phonological analysis, suffix selection, morphophonological exceptions, result generation, and human-readable traces. Version 0.1 supports Kyrgyz noun plurals and the dative case.',
    technologies: ['Python', 'Pytest', 'CLI'],
    features: ['Kyrgyz plural noun formation', 'Kyrgyz dative case', 'Vowel harmony', 'Consonant assimilation', 'Human-readable rule traces', 'Explicit exception table'],
    challenges: [
      { title: 'Reusable language modules', description: 'The core engine is separate from the Kyrgyz-specific phonology and noun rules.' },
      { title: 'Explainable output', description: 'The command-line interface can trace phonological features, allomorph selection, and the resulting suffix.' },
    ],
    architecture: [{ label: 'Core', detail: 'Models + phonology' }, { label: 'Kyrgyz module', detail: 'Noun rules' }, { label: 'Engine', detail: 'Generation + trace' }, { label: 'CLI', detail: 'Command interface' }],
    gallery: [{ title: 'Plural generation', caption: 'Kyrgyz plural allomorph selection.' }, { title: 'Dative generation', caption: 'Dative forms with harmony and consonant handling.' }, { title: 'Rule trace', caption: 'Human-readable explanation of each generated form.' }],
    github: 'https://github.com/chengyang1017/morphology-engine', tone: 'lime', mockup: 'inflection',
  },
  {
    slug: 'nestless', title: 'nestless', shortTitle: 'Nestless', category: 'AI & Developer Tools', status: 'Public repository', number: '09',
    summary: 'A Flutter package for keeping common UI source shallow and readable while preserving normal widget trees.',
    overview: 'nestless_flutter provides semantic layout widgets and short modifiers for common Flutter UI compositions. It does not replace Flutter widgets and is designed to mix with ordinary widget code.',
    technologies: ['Flutter', 'Dart'],
    features: ['NColumn and NRow layouts', 'NBox layout wrapper', 'Scrollable column composition', 'Short widget modifier chains', 'Compatibility with standard Flutter widgets and DevTools'],
    challenges: [{ title: 'Source readability', description: 'Common padding, sizing, scrolling, and layout wrappers are combined into small semantic widgets.' }],
    architecture: [{ label: 'Flutter widgets', detail: 'Normal runtime tree' }, { label: 'Nestless layouts', detail: 'Semantic combinations' }, { label: 'Modifiers', detail: 'Short wrapper chains' }],
    gallery: [{ title: 'Semantic layouts', caption: 'NColumn, NRow, NBox, and scrollable compositions.' }, { title: 'Modifiers', caption: 'Short helpers for alignment, padding, and sizing.' }],
    github: 'https://github.com/chengyang1017/nestless', tone: 'slate', mockup: 'ide',
  },
  {
    slug: 'shipin-serverpod', title: 'shipin-serverpod', shortTitle: 'Shipin Serverpod', category: 'Product', status: 'Archived', number: '10',
    summary: 'Archived Serverpod backend source retained after the Shipin backend moved into the main Shipin monorepo.',
    overview: 'This repository is no longer the active Shipin backend. Its README states that the Serverpod backend was merged into the main Shipin monorepo and that this repository remains for historical reference.',
    technologies: ['Dart', 'Serverpod', 'PostgreSQL'],
    features: [], challenges: [], architecture: [{ label: 'Serverpod', detail: 'Dart backend' }, { label: 'PostgreSQL', detail: 'Database' }], gallery: [],
    github: 'https://github.com/chengyang1017/shipin-serverpod', tone: 'slate', mockup: 'commerce',
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
