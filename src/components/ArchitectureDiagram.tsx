import { useState, type CSSProperties } from 'react';
import type { Project } from '../data/projects';

type BrandIcon = {
  slug: string;
  color: string;
};

const BRAND_ICONS: Array<{ match: RegExp; icon: BrandIcon }> = [
  { match: /flutter/i, icon: { slug: 'flutter', color: '54C5F8' } },
  { match: /dart/i, icon: { slug: 'dart', color: '54C5F8' } },
  { match: /node|express api|server api/i, icon: { slug: 'nodedotjs', color: '5FA04E' } },
  { match: /react/i, icon: { slug: 'react', color: '61DAFB' } },
  { match: /postgre/i, icon: { slug: 'postgresql', color: '6C9BD1' } },
  { match: /firebase/i, icon: { slug: 'firebase', color: 'FFCA28' } },
  { match: /prisma/i, icon: { slug: 'prisma', color: 'A7BAC7' } },
  { match: /asp\.net|\.net|ef core/i, icon: { slug: 'dotnet', color: '8A6FE8' } },
  { match: /android/i, icon: { slug: 'android', color: '3DDC84' } },
  { match: /kotlin/i, icon: { slug: 'kotlin', color: 'A97BFF' } },
  { match: /sqlite/i, icon: { slug: 'sqlite', color: '63B7DB' } },
  { match: /electron/i, icon: { slug: 'electron', color: '9FEAF9' } },
  { match: /vite/i, icon: { slug: 'vite', color: 'BD8CFF' } },
  { match: /monaco|visual studio code|vscode/i, icon: { slug: 'visualstudiocode', color: '45A8F7' } },
  { match: /python/i, icon: { slug: 'python', color: 'FFD343' } },
  { match: /flask/i, icon: { slug: 'flask', color: 'DDE4E0' } },
  { match: /excel/i, icon: { slug: 'microsoftexcel', color: '33A06F' } },
  { match: /serverpod/i, icon: { slug: 'dart', color: '54C5F8' } },
  { match: /stripe/i, icon: { slug: 'stripe', color: '8B7CFF' } },
  { match: /typescript/i, icon: { slug: 'typescript', color: '5FA9E8' } },
  { match: /javascript/i, icon: { slug: 'javascript', color: 'F7DF1E' } },
  { match: /html/i, icon: { slug: 'html5', color: 'E56A4A' } },
  { match: /css/i, icon: { slug: 'css', color: '6EA8FE' } },
];

function getBrandIcon(label: string, detail: string): BrandIcon | undefined {
  const value = `${label} ${detail}`;
  return BRAND_ICONS.find(({ match }) => match.test(value))?.icon;
}

function getInitials(label: string) {
  const parts = label
    .replace(/[^a-zA-Z0-9.+# ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return '•';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function ArchitectureBrand({ brand, label }: { brand?: BrandIcon; label: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showBrandIcon = Boolean(brand) && !imageFailed;

  return (
    <div className="architecture-brand" aria-hidden="true">
      {showBrandIcon && brand ? (
        <img
          src={`https://cdn.simpleicons.org/${brand.slug}/${brand.color}`}
          alt=""
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className="architecture-brand-fallback">{getInitials(label)}</span>
      )}
    </div>
  );
}

export function ArchitectureDiagram({ nodes }: { nodes: Project['architecture'] }) {
  return (
    <div className="architecture" aria-label="Project architecture">
      {nodes.map((node, index) => {
        const brand = getBrandIcon(node.label, node.detail);
        const style = brand
          ? ({ '--architecture-accent': `#${brand.color}` } as CSSProperties)
          : undefined;

        return (
          <article className="architecture-node" key={node.label} style={style}>
            <div className="architecture-node-topline">
              <span className="architecture-number">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="architecture-role">{node.detail}</span>
            </div>

            <ArchitectureBrand brand={brand} label={node.label} />

            <div className="architecture-node-copy">
              <strong>{node.label}</strong>
              <small>{node.detail}</small>
            </div>

            {index < nodes.length - 1 && (
              <i className="architecture-connector" aria-hidden="true">→</i>
            )}
          </article>
        );
      })}
    </div>
  );
}
