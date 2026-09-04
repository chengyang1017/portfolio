type BrandIconName =
  | 'flutter'
  | 'dart'
  | 'android'
  | 'kotlin'
  | 'react'
  | 'typescript'
  | 'vite'
  | 'electron'
  | 'nodejs'
  | 'express'
  | 'prisma'
  | 'postgresql'
  | 'python'
  | 'flask'
  | 'sqlite'
  | 'dotnet'
  | 'firebase'
  | 'stripe'
  | 'serverpod'
  | 'monaco'
  | 'pandas';

const SIMPLE_ICONS =
  'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons';

const iconMap: Record<
  BrandIconName,
  {
    slug: string;
    label: string;
  }
> = {
  flutter: { slug: 'flutter', label: 'Flutter' },
  dart: { slug: 'dart', label: 'Dart' },
  android: { slug: 'android', label: 'Android' },
  kotlin: { slug: 'kotlin', label: 'Kotlin' },
  react: { slug: 'react', label: 'React' },
  typescript: { slug: 'typescript', label: 'TypeScript' },
  vite: { slug: 'vite', label: 'Vite' },
  electron: { slug: 'electron', label: 'Electron' },
  nodejs: { slug: 'nodedotjs', label: 'Node.js' },
  express: { slug: 'express', label: 'Express' },
  prisma: { slug: 'prisma', label: 'Prisma' },
  postgresql: { slug: 'postgresql', label: 'PostgreSQL' },
  python: { slug: 'python', label: 'Python' },
  flask: { slug: 'flask', label: 'Flask' },
  sqlite: { slug: 'sqlite', label: 'SQLite' },
  dotnet: { slug: 'dotnet', label: '.NET' },
  firebase: { slug: 'firebase', label: 'Firebase' },
  stripe: { slug: 'stripe', label: 'Stripe' },
  serverpod: { slug: 'serverpod', label: 'Serverpod' },
  monaco: { slug: 'visualstudiocode', label: 'Monaco Editor' },
  pandas: { slug: 'pandas', label: 'Pandas' },
};

export function BrandIcon({
  name,
  size = 'md',
}: {
  name: BrandIconName;
  size?: 'sm' | 'md' | 'lg';
}) {
  const icon = iconMap[name];

  return (
    <span
      className="brand-icon"
      data-brand={name}
      data-size={size}
      aria-hidden="true"
      title={icon.label}
    >
      <img
        src={`${SIMPLE_ICONS}/${icon.slug}.svg`}
        alt=""
      />
    </span>
  );
}