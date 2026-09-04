import {
  ArrowUpRight,
  Code2,
  Database,
  GitBranch,
  Languages,
  Server,
  Smartphone,
  Terminal,
} from 'lucide-react';

import { aboutCopy } from '../i18n/aboutTranslations';
import { useI18n } from '../i18n/I18nProvider';

const areaIcons = [
  Languages,   // 语言工具
  Smartphone,  // 移动软件
  Code2,       // 开发者工具
  Server,      // 后端系统
];

export function AboutPage() {
  const { language } = useI18n();
  const copy = aboutCopy(language);

  return (
    <main className="page about-page">

      {/* HERO */}
      <section className="about-hero shell">
        <div className="about-hero-main">
          <p className="eyebrow">
            {copy.hero.eyebrow}
          </p>

          <h1>
            {copy.hero.titleLead}
            <span className="about-hero-accent">
              {copy.hero.titleAccent}
            </span>
          </h1>
        </div>

        <aside className="about-hero-aside">
          <p className="about-hero-description">
            {copy.hero.description}
          </p>

          <div className="about-hero-facts">
            {copy.hero.facts.map((fact, index) => (
              <div key={fact.label}>
                <span>
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div>
                  <small>{fact.label}</small>
                  <strong>{fact.value}</strong>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>


      {/* SOURCE OF TRUTH */}
      <section className="about-source-section">
        <div className="shell about-source-grid">

          <div className="about-source-card">

            <div className="about-source-card-top">
              <div className="about-source-brand">
                <span className="about-source-github-icon">
                  <GitBranch />
                </span>

                <div>
                  <small>GITHUB</small>
                  <strong>chengyang1017</strong>
                </div>
              </div>

              <Code2 className="about-source-check" />
            </div>

            <div className="about-source-symbol">
              <Code2 />
            </div>

            <div className="about-source-rows">
              <div>
                <Code2 />
                <span>
                  <small>
                    {copy.source.repository.label}
                  </small>

                  <strong>
                    {copy.source.repository.value}
                  </strong>
                </span>
              </div>

              <div>
                <Code2 />
                <span>
                  <small>
                    {copy.source.implementation.label}
                  </small>

                  <strong>
                    {copy.source.implementation.value}
                  </strong>
                </span>
              </div>

              <div>
                <Database />
                <span>
                  <small>
                    {copy.source.readme.label}
                  </small>

                  <strong>
                    {copy.source.readme.value}
                  </strong>
                </span>
              </div>
            </div>

            <div className="about-source-card-footer">
              <span>PUBLIC SOURCE</span>
              <span>LCY / 2026</span>
            </div>
          </div>


          <div className="about-source-copy">
            <p className="eyebrow">
              01 / {copy.source.eyebrow}
            </p>

            <h2>
              {copy.source.title}
            </h2>

            <div className="about-source-body">
              <p>
                {copy.source.description}
              </p>

              <p>
                {copy.source.note}
              </p>
            </div>

            <blockquote>
              <span />
              <p>
                {copy.source.quote}
              </p>
            </blockquote>
          </div>

        </div>
      </section>


      {/* AREAS */}
      <section className="about-areas shell">

        <div className="about-areas-heading">

          <div>
            <p className="eyebrow">
              02 / {copy.areas.eyebrow}
            </p>

            <h2>
              {copy.areas.title}
            </h2>
          </div>

          <p className="about-areas-description">
            {copy.areas.description}
          </p>

        </div>


        <div className="about-area-grid">
          {copy.areas.items.map((item, index) => {
            const AreaIcon =
              areaIcons[index] ?? Code2;

            return (
              <article
  className="about-area-card"
  key={item.title}
>
 <div className="about-area-card-top">
  <span>
    {String(index + 1).padStart(2, '0')}
  </span>
</div>

  <div className="about-area-visual" aria-hidden="true">
    <AreaIcon />
  </div>

  <div className="about-area-card-copy">
    <h3>{item.title}</h3>

    <p>
      {item.description}
    </p>
  </div>

  <span className="about-area-meta">
    {item.meta}
  </span>
</article>
            );
          })}
        </div>

      </section>


      {/* CTA */}
      <section className="about-cta shell">

        <div className="about-cta-inner">

          <div className="about-cta-copy">
            <p className="eyebrow">
              03 / {copy.cta.eyebrow}
            </p>

            <h2>
              {copy.cta.title}
            </h2>

            <p>
              {copy.cta.description}
            </p>
          </div>

          <a
            className="about-github-link"
            href="https://github.com/chengyang1017"
            target="_blank"
            rel="noreferrer"
          >
            <GitBranch />

            <span>
              {copy.cta.action}
            </span>

            <ArrowUpRight />
          </a>

        </div>

      </section>

    </main>
  );
}