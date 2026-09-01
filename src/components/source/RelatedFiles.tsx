import type { SourceRelatedFile } from '../../data/source-explanations';
import { useI18n } from '../../i18n/I18nProvider';

export function RelatedFiles({ files }: { files: SourceRelatedFile[] }) {
  const { t } = useI18n();
  return <section className="source-subsection"><h2>{t('source.relatedFiles')}</h2>{files.length === 0 ? <p className="source-inline-empty">{t('source.empty.files')}</p> : <div className="related-files">{files.map((file) => <article key={file.path}><code>{file.path}</code>{file.descriptionKey && <p>{t(file.descriptionKey)}</p>}</article>)}</div>}</section>;
}
