import type { LucideIcon } from 'lucide-react';
import {
  BookOpenText,
  Code2,
  CreditCard,
  Database,
  Heart,
  ImageIcon,
  Keyboard,
  Languages,
  MessageCircleMore,
  Search,
  ShoppingBag,
  Sparkles,
  UsersRound,
} from 'lucide-react';

type FeatureMeta = {
  label: string;
  description: string;
  tags: string[];
  icon: LucideIcon;
  tone: 'lime' | 'sky' | 'violet' | 'amber' | 'mint';
};

function resolveFeatureMeta(feature: string): FeatureMeta {
  const value = feature.toLowerCase();

  if (/text|image|post|publish|media/.test(value)) {
    return {
      label: 'Publishing',
      description: 'Content creation and media publishing flows verified in the repository.',
      tags: ['Content', 'Media'],
      icon: ImageIcon,
      tone: 'sky',
    };
  }

  if (/like|comment|feed|categor|engagement/.test(value)) {
    return {
      label: 'Engagement',
      description: 'Interaction and discovery surfaces that keep the product socially connected.',
      tags: ['Social', 'Discovery'],
      icon: Heart,
      tone: 'lime',
    };
  }

  if (/friend|message|chat|conversation|real-time|realtime/.test(value)) {
    return {
      label: 'Communication',
      description: 'Conversation flows for direct communication and real-time activity.',
      tags: ['Realtime', 'Messaging'],
      icon: MessageCircleMore,
      tone: 'violet',
    };
  }

  if (/note|rich-text|collaborat|editor/.test(value)) {
    return {
      label: 'Collaboration',
      description: 'Shared editing and structured content designed for collaborative use.',
      tags: ['Rich text', 'Shared'],
      icon: BookOpenText,
      tone: 'amber',
    };
  }

  if (/profile|admin|moderation|discover|identity/.test(value)) {
    return {
      label: 'Operations',
      description: 'Identity, discovery, moderation, and administration surfaces around the core product.',
      tags: ['Identity', 'Admin'],
      icon: UsersRound,
      tone: 'mint',
    };
  }

  if (/cart|checkout|order|product|catalog|inventory|commerce/.test(value)) {
    return {
      label: 'Commerce',
      description: 'Customer and operational flows that move data through the commerce experience.',
      tags: ['Commerce', 'Workflow'],
      icon: ShoppingBag,
      tone: 'amber',
    };
  }

  if (/stripe|payment/.test(value)) {
    return {
      label: 'Payments',
      description: 'Payment handling integrated into the project’s end-to-end transaction flow.',
      tags: ['Payments', 'Backend'],
      icon: CreditCard,
      tone: 'violet',
    };
  }

  if (/language|locali[sz]|translation|multilingual/.test(value)) {
    return {
      label: 'Language',
      description: 'Language-aware product behaviour and localisation across the interface.',
      tags: ['i18n', 'Language'],
      icon: Languages,
      tone: 'lime',
    };
  }

  if (/keyboard|input|telex|composition/.test(value)) {
    return {
      label: 'Input',
      description: 'On-device input and composition behaviour implemented as a product capability.',
      tags: ['Input', 'Mobile'],
      icon: Keyboard,
      tone: 'sky',
    };
  }

  if (/sqlite|database|data|export|csv|json|excel/.test(value)) {
    return {
      label: 'Data',
      description: 'Structured data access, transformation, or export supporting the feature set.',
      tags: ['Data', 'Pipeline'],
      icon: Database,
      tone: 'mint',
    };
  }

  if (/search|discovery|browse/.test(value)) {
    return {
      label: 'Discovery',
      description: 'Search and browsing flows that help users move through the product quickly.',
      tags: ['Search', 'UX'],
      icon: Search,
      tone: 'sky',
    };
  }

  if (/code|dart|definition|reference|hierarchy|test|cli|package/.test(value)) {
    return {
      label: 'Developer tooling',
      description: 'Repository-backed developer workflow or code intelligence capability.',
      tags: ['Developer', 'Tooling'],
      icon: Code2,
      tone: 'violet',
    };
  }

  return {
    label: 'Verified capability',
    description: 'A repository-backed product capability represented in the current implementation.',
    tags: ['Verified', 'Product'],
    icon: Sparkles,
    tone: 'lime',
  };
}

export function FeatureShowcase({ features }: { features: string[] }) {
  return (
    <div className="feature-showcase">
      {features.map((feature, index) => {
        const meta = resolveFeatureMeta(feature);
        const Icon = meta.icon;

        return (
          <article
            className={`feature-card ${index === 0 ? 'feature-card-featured' : ''}`}
            data-tone={meta.tone}
            key={feature}
          >
            <div className="feature-card-topline">
              <span className="feature-card-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="feature-card-status">Verified</span>
            </div>

            <div className="feature-card-icon" aria-hidden="true">
              <Icon size={28} strokeWidth={1.65} />
            </div>

            <div className="feature-card-copy">
              <span className="feature-card-label">{meta.label}</span>
              <h3>{feature}</h3>
              <p>{meta.description}</p>
            </div>

            <div className="feature-card-tags" aria-label={`${feature} capability tags`}>
              {meta.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
