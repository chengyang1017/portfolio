import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import type { AppLocale } from '../i18n/types';

type LanguagePanel = 'root' | 'zh' | 'vi';

function triggerLabel(language: AppLocale) {
  switch (language) {
    case 'zh-CN':
      return { primary: '中', secondary: '简' };
    case 'zh-TW':
      return { primary: '中', secondary: '繁' };
    case 'vi-Latn':
      return { primary: 'VI', secondary: 'ABC' };
    case 'vi-Hani':
      return { primary: 'VI', secondary: 'Nôm' };
    default:
      return { primary: 'EN', secondary: '' };
  }
}

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<LanguagePanel>('root');
  const rootRef = useRef<HTMLDivElement>(null);
  const label = triggerLabel(language);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setPanel('root');
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        setPanel('root');
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  function choose(nextLanguage: AppLocale) {
    setLanguage(nextLanguage);
    setOpen(false);
    setPanel('root');
  }

  return (
    <div
      className="language-switcher"
      ref={rootRef}
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="language-switcher-trigger"
        aria-label={t('language.label')}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          setOpen((current) => !current);
          setPanel('root');
        }}
      >
        <span className="language-trigger-primary">{label.primary}</span>
        {label.secondary && <span className="language-trigger-secondary">{label.secondary}</span>}
        <ChevronDown size={14} strokeWidth={1.8} aria-hidden="true" />
      </button>

      {open && (
        <div className="language-menu" role="menu" aria-label={t('language.label')}>
          {panel === 'root' && (
            <div className="language-menu-panel">
              <div className="language-menu-heading">
                <span>{t('language.label')}</span>
                <small>Language → script</small>
              </div>

              <button
                type="button"
                className="language-menu-row"
                role="menuitemradio"
                aria-checked={language === 'en'}
                onClick={() => choose('en')}
              >
                <span className="language-menu-code">EN</span>
                <span className="language-menu-copy">
                  <strong>English</strong>
                  <small>Latin</small>
                </span>
                {language === 'en' ? <Check size={15} aria-hidden="true" /> : <span />}
              </button>

              <button
                type="button"
                className="language-menu-row"
                role="menuitem"
                onClick={() => setPanel('zh')}
              >
                <span className="language-menu-code">中</span>
                <span className="language-menu-copy">
                  <strong>中文</strong>
                  <small>简体 · 繁體</small>
                </span>
                <ChevronRight size={15} aria-hidden="true" />
              </button>

              <button
                type="button"
                className="language-menu-row"
                role="menuitem"
                onClick={() => setPanel('vi')}
              >
                <span className="language-menu-code">VI</span>
                <span className="language-menu-copy">
                  <strong>Tiếng Việt</strong>
                  <small>Quốc ngữ · 𡨸喃</small>
                </span>
                <ChevronRight size={15} aria-hidden="true" />
              </button>
            </div>
          )}

          {panel === 'zh' && (
            <div className="language-menu-panel">
              <button
                type="button"
                className="language-menu-back"
                onClick={() => setPanel('root')}
              >
                <ChevronLeft size={14} aria-hidden="true" />
                <span>中文</span>
              </button>

              <div className="language-script-intro">
                <span>选择书写形式</span>
                <small>Chinese writing system</small>
              </div>

              <button
                type="button"
                className="language-script-row"
                role="menuitemradio"
                aria-checked={language === 'zh-CN'}
                onClick={() => choose('zh-CN')}
              >
                <span>
                  <strong>简体中文</strong>
                  <small>Simplified</small>
                </span>
                {language === 'zh-CN' && <Check size={15} aria-hidden="true" />}
              </button>

              <button
                type="button"
                className="language-script-row"
                role="menuitemradio"
                aria-checked={language === 'zh-TW'}
                onClick={() => choose('zh-TW')}
              >
                <span>
                  <strong>繁體中文</strong>
                  <small>Traditional</small>
                </span>
                {language === 'zh-TW' && <Check size={15} aria-hidden="true" />}
              </button>
            </div>
          )}

          {panel === 'vi' && (
            <div className="language-menu-panel">
              <button
                type="button"
                className="language-menu-back"
                onClick={() => setPanel('root')}
              >
                <ChevronLeft size={14} aria-hidden="true" />
                <span>Tiếng Việt</span>
              </button>

              <div className="language-script-intro">
                <span>Chọn hệ chữ</span>
                <small>Writing system</small>
              </div>

              <button
                type="button"
                className="language-script-row"
                role="menuitemradio"
                aria-checked={language === 'vi-Latn'}
                onClick={() => choose('vi-Latn')}
              >
                <span>
                  <strong>Quốc ngữ</strong>
                  <small>Latin alphabet</small>
                </span>
                {language === 'vi-Latn' && <Check size={15} aria-hidden="true" />}
              </button>

              <button
                type="button"
                className="language-script-row language-script-row-nom"
                role="menuitemradio"
                aria-checked={language === 'vi-Hani'}
                onClick={() => choose('vi-Hani')}
              >
                <span>
                  <strong>𡨸喃</strong>
                  <small>Chữ Nôm</small>
                </span>
                {language === 'vi-Hani' && <Check size={15} aria-hidden="true" />}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
