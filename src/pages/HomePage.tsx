import type { CSSProperties } from 'react';
import { Cloud, Monitor, Server, Terminal, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { SectionHeader } from '../components/SectionHeader';
import { projects, type Project } from '../data/projects';
import { technologyCatalog, type TechnologyItem } from '../data/technologyCatalog';
import { homeCategory, homeCopy, homeProjectDescription, homeStatus } from '../i18n/homeTranslations';
import { useI18n } from '../i18n/I18nProvider';
import { localizeProject } from '../i18n/localizeProject';
import type { AppLocale } from '../i18n/types';
import '../styles/technology-stack.css';
import '../styles/home-icons.css';
import '../styles/home-work-redesign.css';

function HomeWorkFeaturedProject({
  project,
  language,
  action,
}: {
  project: Project;
  language: AppLocale;
  action: string;
}) {
  const localizedProject = localizeProject(project, language);

  return (
    <Link
      className="home-work-featured-card"
      data-tone={project.tone}
      to={`/projects/${project.slug}`}
      aria-label={`${action}: ${localizedProject.title}`}
    >
      <div className="home-work-card-top">
        <span className="home-work-card-number">{project.number}</span>
        <span className="home-work-card-arrow" aria-hidden="true">↗</span>
      </div>

      <div className="home-work-card-meta">
        <span>{homeCategory(project.category, language)}</span>
        <span className="home-work-card-meta-dot">·</span>
        <span>{homeStatus(project.status, language)}</span>
      </div>

      <div className="home-work-card-body">
        <h3>{localizedProject.title}</h3>
        <p>{homeProjectDescription(project.slug, language, localizedProject.summary)}</p>
      </div>

      <div className="home-work-card-stack">
        {project.technologies.slice(0, 4).map((technology) => (
          <span key={technology}>{technology}</span>
        ))}
      </div>
    </Link>
  );
}

function HomeWorkProjectCard({
  project,
  language,
  action,
}: {
  project: Project;
  language: AppLocale;
  action: string;
}) {
  const localizedProject = localizeProject(project, language);

  return (
    <Link
      className="home-work-mini-card"
      data-tone={project.tone}
      to={`/projects/${project.slug}`}
      aria-label={`${action}: ${localizedProject.title}`}
    >
      <div className="home-work-card-top">
        <span className="home-work-card-number">{project.number}</span>
        <span className="home-work-card-arrow" aria-hidden="true">↗</span>
      </div>

      <div className="home-work-card-meta">
        <span>{homeCategory(project.category, language)}</span>
        <span className="home-work-card-meta-dot">·</span>
        <span>{homeStatus(project.status, language)}</span>
      </div>

      <div className="home-work-card-body">
        <h3>{localizedProject.title}</h3>
        <p>{homeProjectDescription(project.slug, language, localizedProject.summary)}</p>
      </div>

      <div className="home-work-card-stack">
        {project.technologies.slice(0, 3).map((technology) => (
          <span key={technology}>{technology}</span>
        ))}
      </div>
    </Link>
  );
}

function stackDetailCopy(language: AppLocale) {
  const values: Record<AppLocale, {
    client: string;
    backend: string;
    platform: string;
    count: (value: number) => string;
  }> = {
    en: {
      client: 'Mobile, front-end, and desktop technologies used in shipped work.',
      backend: 'APIs, storage, data models, and service logic behind the products.',
      platform: 'Payments, cloud services, editor infrastructure, and supporting tools in use.',
      count: (value) => `${value} tools used in real projects`,
    },
    'zh-CN': {
      client: '真实项目中使用的移动端、前端与桌面端技术。',
      backend: '支撑产品运行的 API、数据模型、存储与服务端实现。',
      platform: '实际使用的支付、云服务、编辑器基础设施与支撑工具。',
      count: (value) => `${value} 项技术已用于真实项目`,
    },
    'zh-TW': {
      client: '真實專案中使用的行動端、前端與桌面端技術。',
      backend: '支撐產品運作的 API、資料模型、儲存與伺服器端實作。',
      platform: '實際使用的付款、雲端服務、編輯器基礎設施與支援工具。',
      count: (value) => `${value} 項技術已用於真實專案`,
    },
    'vi-Latn': {
      client: 'Công nghệ mobile, front-end và desktop được dùng trong các dự án thực tế.',
      backend: 'API, lưu trữ, mô hình dữ liệu và logic phía máy chủ đứng sau sản phẩm.',
      platform: 'Thanh toán, dịch vụ đám mây, hạ tầng editor và các công cụ hỗ trợ đã dùng.',
      count: (value) => `${value} công nghệ đã dùng trong dự án thực tế`,
    },
    'vi-Hani': {
      client: '工藝移動、front-end 吧 desktop 得使用𥪝各預案寔際。',
      backend: 'API、存儲、模型數料吧 logic 服務𠊛 sau 各產品。',
      platform: '清算、服務雲、基礎 editor 吧各工具扶助㐌使用。',
      count: (value) => `${value} 工藝㐌使用𥪝預案寔際`,
    },
  };

  return values[language];
}

export function HomePage() {
  const { language } = useI18n();
  const copy = homeCopy(language);
  const stackDetails = stackDetailCopy(language);
  const selectedProjects = projects.slice(-4).reverse();
  const technologyGroups: Array<{
    label: string;
    tone: 'client' | 'backend' | 'platform';
    icon: LucideIcon;
    description: string;
    technologies: TechnologyItem[];
  }> = [
    {
      label: copy.stack.client,
      tone: 'client',
      icon: Monitor,
      description: stackDetails.client,
      technologies: technologyCatalog.client,
    },
    {
      label: copy.stack.backend,
      tone: 'backend',
      icon: Server,
      description: stackDetails.backend,
      technologies: technologyCatalog.backend,
    },
    {
      label: copy.stack.platform,
      tone: 'platform',
      icon: Cloud,
      description: stackDetails.platform,
      technologies: technologyCatalog.platform,
    },
  ];

  return (
    <>
      <Hero />

      <section className="home-section shell home-work-showcase">
        <div className="home-work-header">
          <div className="home-work-header-main">
            <p className="eyebrow">01 / {copy.work.eyebrow}</p>
            <h2>{copy.work.title}</h2>
          </div>

          <div className="home-work-header-side">
            <p>{copy.work.description}</p>
            <Link className="text-link" to="/projects">{copy.work.allProjects}</Link>
          </div>
        </div>

        <div className="home-work-showcase-grid">
          {selectedProjects.map((project) => (
            <HomeWorkProjectCard
              key={project.slug}
              project={project}
              language={language}
              action={copy.work.viewProject}
            />
          ))}
        </div>
      </section>

      <section className="home-section home-areas">
        <div className="shell">
          <SectionHeader
            index="02"
            eyebrow={copy.areas.eyebrow}
            title={copy.areas.title}
          />

          <div className="home-area-grid">
            {copy.areas.items.map((item, index) => {
              const AreaIcon =
                index === 0
                  ? Monitor
                  : index === 1
                    ? Terminal
                    : Server;

              return (
                <article
                  className="home-area-card"
                  data-area={index + 1}
                  key={item.title}
                >
                  <div className="home-area-card-top">
                    <span className="home-area-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="home-area-icon" aria-hidden="true">
                      <AreaIcon />
                    </span>
                  </div>

                  <div className="home-area-card-copy">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>

                  <div className="home-area-card-line" />
                </article>
              );
            })}
          </div>
        </div>
</section>

      <section className="home-section shell home-stack-section">
        <SectionHeader index="03" eyebrow={copy.stack.eyebrow} title={copy.stack.title} />
        <div className="home-stack-grid">
          {technologyGroups.map((group, groupIndex) => {
            const GroupIcon = group.icon;

            return (
              <article className="home-stack-group" data-stack-tone={group.tone} key={group.label}>
                <div className="home-stack-group-heading">
                  <span className="home-stack-group-icon" aria-hidden="true">
                    <GroupIcon />
                  </span>
                  <div className="home-stack-group-copy">
                    <div className="home-stack-group-title-row">
                      <h3>{group.label}</h3>
                      <span className="home-stack-group-number">{String(groupIndex + 1).padStart(2, '0')}</span>
                    </div>
                    <p>{group.description}</p>
                  </div>
                </div>

                <div className="home-stack-items">
                  {group.technologies.map((technology) => {
                    const brandStyle = {
                      '--tech-color': technology.color,
                      ...(technology.logo
                        ? { '--brand-logo': `url("${technology.logo}")` }
                        : {}),
                    } as CSSProperties;

                    return (
                      <div className="home-stack-item" key={technology.name}>
                        <span
                          className="home-stack-item-icon"
                          aria-hidden="true"
                          style={brandStyle}
                        >
                          {technology.logo ? (
                            <span
                              className={`home-stack-brand-logo${technology.wideLogo ? ' is-wide' : ''}`}
                            />
                          ) : (
                            <Terminal className="home-stack-fallback-logo" />
                          )}
                        </span>
                        <span className="home-stack-item-name">{technology.name}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="home-stack-group-footer">
                  {stackDetails.count(group.technologies.length)}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="home-section home-about-preview">
  <div className="shell home-about-layout">

    <aside className="home-about-card">
      <div className="home-about-card-top">
        <span>04</span>
        <span>LCY</span>
      </div>

      <div className="home-about-card-main">
        <p>{copy.about.eyebrow}</p>

        <strong>
          Language
          <span>Product</span>
          Tooling
        </strong>
      </div>

      <div className="home-about-card-bottom">
        <span>{copy.about.label}</span>
        <span className="home-about-card-mark">↘</span>
      </div>
    </aside>

    <div className="home-about-content">
      <p className="eyebrow">04 / {copy.about.eyebrow}</p>

      <h2>
        {copy.about.title}
        <em>{copy.about.accent}</em>
      </h2>

      <div className="home-about-content-bottom">
        <p>{copy.about.description}</p>

        <Link className="home-about-link" to="/about">
          <span>{copy.about.link}</span>
          <span>↗</span>
        </Link>
      </div>

      <div className="home-about-pill-row">
        <span>01 · LANGUAGE</span>
        <span>02 · PRODUCT</span>
        <span>03 · TOOLING</span>
      </div>
    </div>

  </div>
</section>

      <section className="home-contact shell" id="contact">
        <div>
          <p className="eyebrow">05 / {copy.contact.eyebrow}</p>
          <h2>{copy.contact.title}</h2>
        </div>
        <div>
          <p>{copy.contact.description}</p>
          <a className="button" href="https://github.com/chengyang1017">{copy.contact.action}</a>
        </div>
      </section>
    </>
  );
}