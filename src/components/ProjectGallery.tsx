import { useEffect, useState } from 'react';
import type { Project } from '../data/projects';
import '../styles/project-gallery.css';
import { ProjectVisual } from './ProjectVisual';

type ScreenshotOrientation = 'portrait' | 'landscape';

type LightboxImage = {
  src: string;
  title: string;
  caption: string;
  alt: string;
};

export function ProjectGallery({ project }: { project: Project }) {
  const [orientations, setOrientations] = useState<Record<number, ScreenshotOrientation>>({});
  const [activeImage, setActiveImage] = useState<LightboxImage | null>(null);

  useEffect(() => {
    if (!activeImage) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveImage(null);
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeImage]);

  return (
    <>
      <div className="gallery">
        {project.gallery.map((image, index) => {
          const orientation = orientations[index];
          const cardClass = image.image
            ? `gallery-card ${orientation ? `is-${orientation}` : 'is-loading'}`
            : 'gallery-card is-generated';

          return (
            <figure className={cardClass} key={`${image.title}-${index}`}>
              {image.image ? (
                <button
                  className="gallery-screenshot-button"
                  type="button"
                  aria-label={`Open ${image.title || `project screenshot ${index + 1}`} in full size`}
                  onClick={() =>
                    setActiveImage({
                      src: image.image!,
                      title: image.title,
                      caption: image.caption,
                      alt: image.title || `Project screenshot ${index + 1}`,
                    })
                  }
                >
                  <img
                    className="gallery-screenshot"
                    src={image.image}
                    alt={image.title || `Project screenshot ${index + 1}`}
                    loading="lazy"
                    onLoad={(event) => {
                      const { naturalWidth, naturalHeight } = event.currentTarget;
                      const nextOrientation: ScreenshotOrientation =
                        naturalHeight > naturalWidth * 1.08 ? 'portrait' : 'landscape';

                      setOrientations((current) =>
                        current[index] === nextOrientation
                          ? current
                          : { ...current, [index]: nextOrientation },
                      );
                    }}
                  />
                  <span className="gallery-zoom-mark" aria-hidden="true">
                    +
                  </span>
                </button>
              ) : (
                <ProjectVisual
                  project={project}
                  compact
                  focus={{
                    title: image.title,
                    caption: image.caption,
                    index,
                  }}
                />
              )}

              <figcaption>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{image.title}</strong>
                  <p>{image.caption}</p>
                </div>
              </figcaption>
            </figure>
          );
        })}
      </div>

      {activeImage ? (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.title || 'Project screenshot'}
          onClick={() => setActiveImage(null)}
        >
          <button
            className="gallery-lightbox-close"
            type="button"
            aria-label="Close image preview"
            onClick={() => setActiveImage(null)}
          >
            ×
          </button>

          <div className="gallery-lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <img className="gallery-lightbox-image" src={activeImage.src} alt={activeImage.alt} />
            <div className="gallery-lightbox-caption">
              <strong>{activeImage.title}</strong>
              {activeImage.caption ? <p>{activeImage.caption}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
