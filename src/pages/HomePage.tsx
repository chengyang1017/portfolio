import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { SectionHeader } from '../components/SectionHeader';
import { TechTag } from '../components/TechTag';
import { projects, type Project } from '../data/projects';
import { homeCategory, homeCopy, homeProjectDescription, homeStatus } from '../i18n/homeTranslations';
import { useI18n } from '../i18n/I18nProvider';
import type { AppLocale } from '../i18n/types';

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
          <div className="home-stack-group">
            <h3>{copy.stack.client}</h3>
            <div>{['Flutter', 'Dart', 'Android', 'Kotlin', 'React', 'TypeScript', 'Vite', 'Electron'].map((item) => <TechTag key={item}>{item}</TechTag>)}</div>
          </div>
          <div className="home-stack-group">
            <h3>{copy.stack.backend}</h3>
            <div>{['Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Python', 'Flask', 'SQLite', 'ASP.NET Core', 'EF Core'].map((item) => <TechTag key={item}>{item}</TechTag>)}</div>
          </div>
          <div className="home-stack-group">
            <h3>{copy.stack.platform}</h3>
            <div>{['Firebase', 'Stripe', 'Serverpod', 'Monaco Editor', 'Pandas'].map((item) => <TechTag key={item}>{item}</TechTag>)}</div>
          </div>
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
