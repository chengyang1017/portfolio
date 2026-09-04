import type { CSSProperties } from 'react';
import {
  Atom,
  Boxes,
  Braces,
  Cloud,
  Code2,
  CreditCard,
  Database,
  Flame,
  FlaskConical,
  Laptop,
  Monitor,
  Network,
  Server,
  Smartphone,
  Table2,
  Terminal,
  Workflow,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { SectionHeader } from '../components/SectionHeader';
import { projects, type Project } from '../data/projects';
import { homeCategory, homeCopy, homeProjectDescription, homeStatus } from '../i18n/homeTranslations';
import { useI18n } from '../i18n/I18nProvider';
import type { AppLocale } from '../i18n/types';
import '../styles/technology-stack.css';

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

export function HomePage() {
  const { language } = useI18n();
  const copy = homeCopy(language);
  const stackDetails = stackDetailCopy(language);
  const selectedProjects = projects.slice(0, 5);
  const technologyGroups = [
    {
      label: copy.stack.client,
      tone: 'client',
      icon: Monitor,
      description: stackDetails.client,
      technologies: [
        { name: 'Flutter', icon: Smartphone, color: '#027DFD' },
        { name: 'Dart', icon: Braces, color: '#0175C2' },
        { name: 'Android', icon: Smartphone, color: '#3DDC84' },
        { name: 'Kotlin', icon: Code2, color: '#7F52FF' },
        { name: 'React', icon: Atom, color: '#61DAFB' },
        { name: 'TypeScript', icon: Braces, color: '#3178C6' },
        { name: 'Vite', icon: Zap, color: '#646CFF' },
        { name: 'Electron', icon: Laptop, color: '#47848F' },
      ],
    },
    {
      label: copy.stack.backend,
      tone: 'backend',
      icon: Server,
      description: stackDetails.backend,
      technologies: [
        { name: 'Node.js', icon: Server, color: '#5FA04E' },
        { name: 'Express', icon: Network, color: '#F2F2F2' },
        { name: 'Prisma', icon: Workflow, color: '#2D3748' },
        { name: 'PostgreSQL', icon: Database, color: '#4169E1' },
        { name: 'Python', icon: Code2, color: '#3776AB' },
        { name: 'Flask', icon: FlaskConical, color: '#F2F2F2' },
        { name: 'SQLite', icon: Database, color: '#003B57' },
        { name: 'ASP.NET Core', icon: Boxes, color: '#512BD4' },
        { name: 'EF Core', icon: Workflow, color: '#512BD4' },
      ],
    },
    {
      label: copy.stack.platform,
      tone: 'platform',
      icon: Cloud,
      description: stackDetails.platform,
      technologies: [
        { name: 'Firebase', icon: Flame, color: '#FFCA28' },
        { name: 'Stripe', icon: CreditCard, color: '#635BFF' },
        { name: 'Serverpod', icon: Cloud, color: '#4B6BFB' },
        { name: 'Monaco Editor', icon: Terminal, color: '#007ACC' },
        { name: 'Pandas', icon: Table2, color: '#150458' },
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
                    const TechnologyIcon = technology.icon;
                    const technologyStyle = { '--tech-color': technology.color } as CSSProperties;

                    return (
                      <div className="home-stack-item" key={technology.name} style={technologyStyle}>
                        <span className="home-stack-item-icon" aria-hidden="true">
                          <TechnologyIcon />
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
