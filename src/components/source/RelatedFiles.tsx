import type { SourceRelatedFile } from '../../data/source-explanations';
import { useI18n } from '../../i18n/I18nProvider';

function splitFilePath(path: string) {
  const lastSlash = path.lastIndexOf('/');

  if (lastSlash === -1) {
    return {
      directory: '',
      fileName: path,
    };
  }

  return {
    directory: path.slice(0, lastSlash + 1),
    fileName: path.slice(lastSlash + 1),
  };
}

function getFileType(fileName: string) {
  const extension = fileName.split('.').pop();

  return extension?.toUpperCase() || 'FILE';
}

export function RelatedFiles({
  files,
}: {
  files: SourceRelatedFile[];
}) {
  const { t } = useI18n();

  return (
    <section className="source-subsection related-files-section">
      <div className="related-files-heading">
        <div>
          <p className="related-files-label">
            Repository references
          </p>

          <h2>{t('source.relatedFiles')}</h2>
        </div>

        <span className="related-files-count">
          {String(files.length).padStart(2, '0')} files
        </span>
      </div>

      {files.length === 0 ? (
        <p className="source-inline-empty">
          {t('source.empty.files')}
        </p>
      ) : (
        <div className="related-files">
          {files.map((file, index) => {
            const { directory, fileName } =
              splitFilePath(file.path);

            return (
              <article key={file.path}>
                <span className="related-file-index">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="related-file-content">
                  <div className="related-file-title">
                    <strong>{fileName}</strong>

                    <span className="related-file-type">
                      {getFileType(fileName)}
                    </span>
                  </div>

                  {directory && (
                    <code className="related-file-path">
                      {directory}
                    </code>
                  )}

                  {file.descriptionKey && (
                    <p>
                      {t(file.descriptionKey)}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}