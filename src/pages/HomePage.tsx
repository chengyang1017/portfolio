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

export function HomePage() {
  const { language } = useI18n();
  const copy = homeCopy(language);
  const selectedProjects = projects.slice(0, 5);
  const technologyGroups = [
    {
      label: copy.stack.client,
      tone: 'client',
      icon: Monitor,
      technologies: [
        { name: 'Flutter', icon: Smartphone },
        { name: 'Dart', icon: Braces },
        { name: 'Android', icon: Smartphone },
        { name: 'Kotlin', icon: Code2 },
        { name: 'React', icon: Atom },
        { name: 'TypeScript', icon: Braces },
        { name: 'Vite', icon: Zap },
        { name: 'Electron', icon: Laptop },
      ],
    },
    {
      label: copy.stack.backend,
      tone: 'backend',
      icon: Server,
      technologies: [
        { name: 'Node.js', icon: Server },
        { name: 'Express', icon: Network },
        { name: 'Prisma', icon: Workflow },
        { name: 'PostgreSQL', icon: Database },
        { name: 'Python', icon: Code2 },
        { name: 'Flask', icon: FlaskConical },
        { name: 'SQLite', icon: Database },
        { name: 'ASP.NET Core', icon: Boxes },
        { name: 'EF Core', icon: Workflow },
      ],
    },
    {
      label: copy.stack.platform,
      tone: 'platform',
      icon: Cloud,
      technologies: [
        { name: 'Firebase', icon: Flame },
        { name: 'Stripe', icon: CreditCard },
        { name: 'Serverpod', icon: Cloud },
        { name: 'Monaco Editor', icon: Terminal },
        { name: 'Pandas', icon: Table2 },
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
                  <div>
                    <span className="home-stack-group-number">{String(groupIndex + 1).padStart(2, '0')}</span>
                    <h3>{group.label}</h3>
                  </div>
                </div>

                <div className="home-stack-items">
                  {group.technologies.map((technology) => {
                    const TechnologyIcon = technology.icon;

                    return (
                      <div className="home-stack-item" key={technology.name}>
                        <span className="home-stack-item-icon" aria-hidden="true">
                          <TechnologyIcon />
                        </span>
                        <span className="home-stack-item-name">{technology.name}</span>
                      </div>
                    );
                  })}
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
