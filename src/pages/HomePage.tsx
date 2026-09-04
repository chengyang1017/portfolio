import type { CSSProperties } from 'react';
import { Cloud, Monitor, Server, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { SectionHeader } from '../components/SectionHeader';
import { projects, type Project } from '../data/projects';
import { homeCategory, homeCopy, homeProjectDescription, homeStatus } from '../i18n/homeTranslations';
import { useI18n } from '../i18n/I18nProvider';
import type { AppLocale } from '../i18n/types';
import '../styles/technology-stack.css';

const SIMPLE_ICONS = 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons';

function ProjectIndexRow({ project, language, action }: { project: Project; language: AppLocale; action: string }) {
  return (
    <Link className="home-project-row" data-tone={project.tone} to={`/projects/${project.slug}`}>
      <span className="home-project-number">{project.number}</span>

      <div className="home-project-identity">
        <p>{homeCategory(project.category, language)} · {homeStatus(project.status, language)}</p>
        <h3>{project.title}</h3>
      </div>

      <p className="home-project-summary">
        {homeProjectDescription(project.slug, language, project.summary)}
      </p>

      <div className="home-project-stack">
        {project.technologies.slice(0, 3).map((technology) => (
          <span key={technology}>{technology}</span>
        ))}
      </div>

      <span className="home-project-action" aria-label={`${action}: ${project.title}`}>↗</span>
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

type BrandTechnology = {
  name: string;
  logo?: string;
  wideLogo?: boolean;
};

export function HomePage() {
  const { language } = useI18n();
  const copy = homeCopy(language);
  const stackDetails = stackDetailCopy(language);
  const selectedProjects = projects.slice(0, 5);
  const technologyGroups: Array<{
    label: string;
    tone: 'client' | 'backend' | 'platform';
    icon: typeof Monitor;
    description: string;
    technologies: BrandTechnology[];
  }> = [
    {
      label: copy.stack.client,
      tone: 'client',
      icon: Monitor,
      description: stackDetails.client,
      technologies: [
        { name: 'Flutter', logo: `${SIMPLE_ICONS}/flutter.svg` },
        { name: 'Dart', logo: `${SIMPLE_ICONS}/dart.svg` },
        { name: 'Android', logo: `${SIMPLE_ICONS}/android.svg` },
        { name: 'Kotlin', logo: `${SIMPLE_ICONS}/kotlin.svg` },
        { name: 'React', logo: `${SIMPLE_ICONS}/react.svg` },
        { name: 'TypeScript', logo: `${SIMPLE_ICONS}/typescript.svg` },
        { name: 'Vite', logo: `${SIMPLE_ICONS}/vite.svg` },
        { name: 'Electron', logo: `${SIMPLE_ICONS}/electron.svg` },
      ],
    },
    {
      label: copy.stack.backend,
      tone: 'backend',
      icon: Server,
      description: stackDetails.backend,
      technologies: [
        { name: 'Node.js', logo: `${SIMPLE_ICONS}/nodedotjs.svg` },
        { name: 'Express', logo: `${SIMPLE_ICONS}/express.svg` },
        { name: 'Prisma', logo: `${SIMPLE_ICONS}/prisma.svg` },
        { name: 'PostgreSQL', logo: `${SIMPLE_ICONS}/postgresql.svg` },
        { name: 'Python', logo: `${SIMPLE_ICONS}/python.svg` },
        { name: 'Flask', logo: `${SIMPLE_ICONS}/flask.svg` },
        { name: 'SQLite', logo: `${SIMPLE_ICONS}/sqlite.svg` },
        { name: 'ASP.NET Core', logo: `${SIMPLE_ICONS}/dotnet.svg` },
        { name: 'EF Core', logo: `${SIMPLE_ICONS}/dotnet.svg` },
      ],
    },
    {
      label: copy.stack.platform,
      tone: 'platform',
      icon: Cloud,
      description: stackDetails.platform,
      technologies: [
        { name: 'Firebase', logo: `${SIMPLE_ICONS}/firebase.svg` },
        { name: 'Stripe', logo: `${SIMPLE_ICONS}/stripe.svg` },
        {
          name: 'Serverpod',
          logo: 'https://raw.githubusercontent.com/serverpod/serverpod/main/examples/legacy/chat/chat_server/web/static/serverpod-logo.svg',
          wideLogo: true,
        },
        { name: 'Monaco Editor' },
        { name: 'Pandas', logo: `${SIMPLE_ICONS}/pandas.svg` },
      ],
    },
  ];

  return (
    <>
      <Hero />

      <section className="home-section home-work shell">
        <div className="home-section-intro">
          <div>
            <p className="eyebrow">01 / {copy.work.eyebrow}</p>
            <h2>{copy.work.title}</h2>
          </div>
          <div className="home-section-note">
            <p>{copy.work.description}</p>
            <Link className="text-link" to="/projects">{copy.work.allProjects}</Link>
          </div>
        </div>

        <div className="home-project-index">
          {selectedProjects.map((project) => (
            <ProjectIndexRow
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
          <SectionHeader index="02" eyebrow={copy.areas.eyebrow} title={copy.areas.title} />
          <div className="home-area-list">
            {copy.areas.items.map((item, index) => (
              <article className="home-area-row" key={item.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
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
                    const brandStyle = technology.logo
                      ? ({ '--brand-logo': `url("${technology.logo}")` } as CSSProperties)
                      : undefined;

                    return (
                      <div className="home-stack-item" key={technology.name}>
                        <span className="home-stack-item-icon" aria-hidden="true">
                          {technology.logo ? (
                            <span
                              className={`home-stack-brand-logo${technology.wideLogo ? ' is-wide' : ''}`}
                              style={brandStyle}
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
        <div className="shell home-about-grid">
          <div className="home-about-identity">
            <p className="eyebrow">04 / {copy.about.eyebrow}</p>
            <div className="home-about-monogram">
              <strong>LCY</strong>
              <span>{copy.about.label}</span>
            </div>
          </div>

          <div className="home-about-copy">
            <h2>{copy.about.title} <em>{copy.about.accent}</em></h2>
            <p>{copy.about.description}</p>
            <Link className="text-link" to="/about">{copy.about.link}</Link>
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
