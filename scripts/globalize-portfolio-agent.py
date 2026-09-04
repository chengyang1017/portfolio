from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise SystemExit(f'{label} anchor not found')
    return text.replace(old, new, 1)

# --- Agent client: make it portfolio-wide ---------------------------------
agent_path = Path('src/admin/projectAgent.ts')
agent_path.write_text(r'''import type { Project } from '../data/projects';
import type {
  ProjectTranslation,
  ProjectTranslationCatalog,
  ProjectTranslationLocale,
} from '../data/projectTranslationCatalog';
import type {
  TechnologyCatalog,
  TechnologyGroupId,
  TechnologyItem,
} from '../data/technologyCatalog';

export type AgentMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type PortfolioProjectPatch = {
  slug: string;
  patch: Partial<Project>;
};

export type PortfolioTranslationPatch = {
  slug: string;
  locale: ProjectTranslationLocale;
  patch: Partial<ProjectTranslation>;
};

export type PortfolioTechnologyOperation =
  | { action: 'add'; group: TechnologyGroupId; item: TechnologyItem }
  | { action: 'update'; group: TechnologyGroupId; name: string; patch: Partial<TechnologyItem> }
  | { action: 'remove'; group: TechnologyGroupId; name: string };

export type PortfolioAgentProposal = {
  message: string;
  projectPatches: PortfolioProjectPatch[];
  translationPatches: PortfolioTranslationPatch[];
  newProjects: Project[];
  deleteProjectSlugs: string[];
  technologyOperations: PortfolioTechnologyOperation[];
  changedFields: string[];
};

export async function runPortfolioAgent({
  instruction,
  projects,
  translations,
  technologyCatalog,
  selectedSlug,
  activeLocale,
  history,
}: {
  instruction: string;
  projects: Project[];
  translations: ProjectTranslationCatalog;
  technologyCatalog: TechnologyCatalog;
  selectedSlug: string;
  activeLocale: 'en' | ProjectTranslationLocale;
  history: AgentMessage[];
}): Promise<PortfolioAgentProposal> {
  const response = await fetch('/api/portfolio-ai', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode: 'portfolio-agent',
      instruction,
      projects,
      translations,
      technologyCatalog,
      selectedSlug,
      activeLocale,
      history: history.slice(-12),
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | (Partial<PortfolioAgentProposal> & { error?: string; detail?: string })
    | null;

  if (!response.ok) {
    throw new Error(
      payload?.detail || payload?.error || `Portfolio agent failed (${response.status}).`,
    );
  }

  return {
    message: payload?.message?.trim() || 'I prepared a portfolio draft proposal for review.',
    projectPatches: Array.isArray(payload?.projectPatches) ? payload.projectPatches : [],
    translationPatches: Array.isArray(payload?.translationPatches)
      ? payload.translationPatches
      : [],
    newProjects: Array.isArray(payload?.newProjects) ? payload.newProjects : [],
    deleteProjectSlugs: Array.isArray(payload?.deleteProjectSlugs)
      ? payload.deleteProjectSlugs
      : [],
    technologyOperations: Array.isArray(payload?.technologyOperations)
      ? payload.technologyOperations
      : [],
    changedFields: Array.isArray(payload?.changedFields) ? payload.changedFields : [],
  };
}
''', encoding='utf-8')

# --- Admin page -------------------------------------------------------------
page_path = Path('src/pages/AdminPage.tsx')
page = page_path.read_text(encoding='utf-8')
page = replace_once(
    page,
    "  runProjectAgent,\n  type AgentMessage,\n  type ProjectAgentProposal,\n",
    "  runPortfolioAgent,\n  type AgentMessage,\n  type PortfolioAgentProposal,\n",
    'agent import',
)
page = replace_once(
    page,
    "  const [agentMessages, setAgentMessages] = useState<Record<string, AgentMessage[]>>({});\n  const [agentProposal, setAgentProposal] = useState<ProjectAgentProposal | null>(null);",
    "  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);\n  const [agentProposal, setAgentProposal] = useState<PortfolioAgentProposal | null>(null);",
    'agent state',
)
# remove per-project memo and reset effect
start = page.index("  const currentAgentMessages = useMemo(")
end = page.index("\n  async function handleUnlock()", start)
page = page[:start] + page[end:]

# replace submit/apply block
start = page.index("  async function handleAgentSubmit(prefill?: string) {")
end = page.index("\n  function updateTechnology(", start)
new_handlers = r'''  async function handleAgentSubmit(prefill?: string) {
    if (agentState === 'loading') return;

    const instruction = (prefill ?? agentInstruction).trim();
    if (!instruction) return;

    const userMessage: AgentMessage = { role: 'user', content: instruction };
    setAgentMessages((current) => [...current, userMessage].slice(-16));
    if (!prefill) setAgentInstruction('');
    setAgentProposal(null);
    setAgentState('loading');
    setAgentStatus(ui.agentThinking);

    try {
      const proposal = await runPortfolioAgent({
        instruction,
        projects: projectDrafts,
        translations: translationDrafts,
        technologyCatalog: technologyDrafts,
        selectedSlug,
        activeLocale: contentLocale,
        history: agentMessages.slice(-12),
      });

      const assistantMessage: AgentMessage = {
        role: 'assistant',
        content: proposal.message,
      };
      setAgentMessages((current) => [...current, assistantMessage].slice(-16));
      setAgentProposal(proposal);
      setAgentState('idle');
      setAgentStatus(
        proposal.changedFields.length > 0 ? ui.agentReviewBeforeApply : ui.agentNoChanges,
      );
    } catch (error) {
      setAgentState('error');
      setAgentStatus(error instanceof Error ? error.message : ui.agentFailed);
    }
  }

  function applyAgentProposal() {
    if (!agentProposal) return;

    if (agentProposal.projectPatches.length > 0 || agentProposal.newProjects.length > 0 || agentProposal.deleteProjectSlugs.length > 0) {
      setProjectDrafts((current) => {
        const deleteSet = new Set(agentProposal.deleteProjectSlugs);
        let next = current.filter((project) => !deleteSet.has(project.slug));
        next = next.map((project) => {
          const operation = agentProposal.projectPatches.find((item) => item.slug === project.slug);
          return operation ? { ...project, ...operation.patch, slug: project.slug, number: project.number } : project;
        });
        for (const project of agentProposal.newProjects) {
          if (!next.some((item) => item.slug === project.slug)) next.push(project);
        }
        return next;
      });
    }

    if (agentProposal.translationPatches.length > 0 || agentProposal.deleteProjectSlugs.length > 0) {
      setTranslationDrafts((current) => {
        const next = { ...current };
        for (const slug of agentProposal.deleteProjectSlugs) delete next[slug];
        for (const operation of agentProposal.translationPatches) {
          next[operation.slug] = {
            ...(next[operation.slug] ?? {}),
            [operation.locale]: {
              ...(next[operation.slug]?.[operation.locale] ?? emptyProjectTranslation()),
              ...operation.patch,
            },
          };
        }
        return next;
      });
    }

    if (agentProposal.technologyOperations.length > 0) {
      setTechnologyDrafts((current) => {
        const next: TechnologyCatalog = {
          client: current.client.map((item) => ({ ...item })),
          backend: current.backend.map((item) => ({ ...item })),
          platform: current.platform.map((item) => ({ ...item })),
        };
        for (const operation of agentProposal.technologyOperations) {
          if (operation.action === 'add') {
            if (!next[operation.group].some((item) => item.name === operation.item.name)) {
              next[operation.group].push(operation.item);
            }
          } else if (operation.action === 'remove') {
            next[operation.group] = next[operation.group].filter((item) => item.name !== operation.name);
          } else {
            next[operation.group] = next[operation.group].map((item) =>
              item.name === operation.name ? { ...item, ...operation.patch } : item,
            );
          }
        }
        return next;
      });
    }

    if (agentProposal.deleteProjectSlugs.includes(selectedSlug)) {
      const remaining = projectDrafts.filter((project) => !agentProposal.deleteProjectSlugs.includes(project.slug));
      setSelectedSlug(remaining[0]?.slug ?? '');
    }

    setAgentProposal(null);
    setAgentState('idle');
    setAgentStatus(ui.agentApplied);
  }
'''
page = page[:start] + new_handlers + page[end:]

# remove per-project panel
start = page.index('              <section className="admin-project-agent" aria-label={ui.agentTitle}>')
end_marker = "\n              {translationMessage && ("
end = page.index(end_marker, start)
page = page[:start] + page[end:]

# insert global panel after hero, before repo assistant
anchor = "      </header>\n\n      <section className=\"admin-panel admin-ai-panel\">"
global_panel = r'''      </header>

      <section className="admin-panel admin-global-agent-panel" aria-label={ui.agentTitle}>
        <div className="admin-panel-heading admin-agent-heading">
          <div>
            <p className="eyebrow">AI / GLOBAL AGENT</p>
            <h2>{ui.agentTitle}</h2>
          </div>
          <p>{ui.agentDraftOnly}</p>
        </div>

        <div className="admin-global-agent-context">
          <span>{ui.agentPortfolioScope}</span>
          <strong>{projectDrafts.length} {ui.projects} · {allTechnologyNames.length} {ui.technologies}</strong>
          {selectedProject && (
            <small>{ui.agentCurrentFocus}: {selectedProject.title} · {CONTENT_LOCALES.find((locale) => locale.id === contentLocale)?.label}</small>
          )}
        </div>

        {agentMessages.length > 0 && (
          <div className="admin-agent-thread admin-global-agent-thread">
            {agentMessages.map((message, index) => (
              <div className={`admin-agent-message ${message.role}`} key={`${index}-${message.role}`}>
                <span>{message.role === 'user' ? ui.agentYou : 'AI'}</span>
                <p>{message.content}</p>
              </div>
            ))}
          </div>
        )}

        <div className="admin-agent-quick-actions">
          <button
            type="button"
            className="secondary"
            onClick={() => void handleAgentSubmit('Review the entire portfolio and fill only genuinely empty or incomplete portfolio fields across projects. Preserve good existing content and do not invent facts.')}
            disabled={agentState === 'loading'}
          >
            {ui.agentFillEmpty}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => void handleAgentSubmit('Find missing translations across every project and fill the missing Simplified Chinese, Traditional Chinese, Vietnamese, and Chữ Nôm fields. Do not change English unless necessary for consistency.')}
            disabled={agentState === 'loading'}
          >
            {ui.agentTranslateAll}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => void handleAgentSubmit(`Focus on the currently selected project (${selectedSlug || 'none'}) and active locale (${contentLocale}). Improve only that scope unless another edit is required for consistency.`)}
            disabled={agentState === 'loading' || !selectedProject}
          >
            {ui.agentImproveCurrent}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => void handleAgentSubmit('Audit the portfolio for inconsistent project descriptions, duplicated technologies, missing technology catalog entries, and multilingual coverage problems. Propose only safe draft corrections.')}
            disabled={agentState === 'loading'}
          >
            {ui.agentAuditPortfolio}
          </button>
        </div>

        <div className="admin-agent-compose admin-global-agent-compose">
          <textarea
            value={agentInstruction}
            onChange={(event) => setAgentInstruction(event.target.value)}
            onKeyDown={(event) => {
              if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                event.preventDefault();
                void handleAgentSubmit();
              }
            }}
            placeholder={ui.agentPlaceholder}
            disabled={agentState === 'loading'}
          />
          <button
            type="button"
            onClick={() => void handleAgentSubmit()}
            disabled={agentState === 'loading' || !agentInstruction.trim()}
          >
            {agentState === 'loading' ? ui.agentThinking : ui.agentSend}
          </button>
        </div>

        {agentStatus && (
          <p className={agentState === 'error' ? 'admin-message error' : 'admin-message'}>{agentStatus}</p>
        )}

        {agentProposal && agentProposal.changedFields.length > 0 && (
          <div className="admin-agent-proposal admin-global-agent-proposal">
            <div className="admin-agent-proposal-heading">
              <strong>{ui.agentProposedChanges}</strong>
              <span>{agentProposal.changedFields.length} {ui.agentFields}</span>
            </div>
            <div className="admin-chip-row">
              {agentProposal.changedFields.map((field) => <span key={field}>{field}</span>)}
            </div>
            <div className="admin-actions">
              <button type="button" onClick={applyAgentProposal}>{ui.agentApply}</button>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setAgentProposal(null);
                  setAgentStatus(ui.agentDiscarded);
                }}
              >
                {ui.agentDiscard}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="admin-panel admin-ai-panel">'''
page = replace_once(page, anchor, global_panel, 'global agent panel insertion')
page_path.write_text(page, encoding='utf-8')

# --- UI copy ---------------------------------------------------------------
copy_path = Path('src/admin/adminUiCopy.ts')
copy = copy_path.read_text(encoding='utf-8')
copy = replace_once(copy, "  agentDiscarded: string;\n", "  agentDiscarded: string;\n  agentPortfolioScope: string;\n  agentCurrentFocus: string;\n  agentAuditPortfolio: string;\n", 'copy interface')
copy = replace_once(copy, "  agentTitle: 'Project AI agent',", "  agentTitle: 'Global portfolio AI agent',", 'english title')
copy = replace_once(copy, "  agentDraftOnly: 'Draft only · you decide what gets applied',", "  agentDraftOnly: 'Works across projects, translations, and technology data · draft only · you decide what gets applied',", 'english scope')
copy = replace_once(copy, "  agentFillEmpty: 'Fill empty fields',", "  agentFillEmpty: 'Fill portfolio gaps',", 'english quick1')
copy = replace_once(copy, "  agentTranslateAll: 'Translate all locales',", "  agentTranslateAll: 'Fill missing translations',", 'english quick2')
copy = replace_once(copy, "  agentImproveCurrent: 'Improve current language',", "  agentImproveCurrent: 'Focus selected project',", 'english quick3')
copy = replace_once(copy, "  agentPlaceholder: 'Tell the agent what to change in this project…',", "  agentPlaceholder: 'Tell the global agent what to change anywhere in the portfolio…',", 'english placeholder')
copy = replace_once(copy, "  agentFailed: 'Project agent failed.',", "  agentFailed: 'Portfolio agent failed.',", 'english failure')
copy = replace_once(copy, "  agentDiscarded: 'Agent proposal discarded.',", "  agentDiscarded: 'Agent proposal discarded.',\n  agentPortfolioScope: 'Portfolio-wide scope',\n  agentCurrentFocus: 'Current focus',\n  agentAuditPortfolio: 'Audit entire portfolio',", 'english extras')

# Chinese variants
copy = replace_once(copy, "  agentTitle: '项目 AI Agent',", "  agentTitle: '全局作品集 AI Agent',", 'zh title')
copy = replace_once(copy, "  agentDraftOnly: '只修改草稿 · 是否应用由你决定',", "  agentDraftOnly: '可操作全部项目、多语言和技术数据 · 只修改草稿 · 是否应用由你决定',", 'zh scope')
copy = replace_once(copy, "  agentFillEmpty: '补全空白字段',", "  agentFillEmpty: '补全作品集缺口',", 'zh quick1')
copy = replace_once(copy, "  agentTranslateAll: '翻译全部语言',", "  agentTranslateAll: '补全缺失翻译',", 'zh quick2')
copy = replace_once(copy, "  agentImproveCurrent: '优化当前语言',", "  agentImproveCurrent: '聚焦当前项目',", 'zh quick3')
copy = replace_once(copy, "  agentPlaceholder: '告诉 Agent 要怎么修改这个项目…',", "  agentPlaceholder: '告诉全局 Agent 要修改作品集里的什么内容…',", 'zh placeholder')
copy = replace_once(copy, "  agentFailed: '项目 Agent 执行失败。',", "  agentFailed: '作品集 Agent 执行失败。',", 'zh failure')
copy = replace_once(copy, "  agentDiscarded: '已丢弃 Agent 修改建议。',", "  agentDiscarded: '已丢弃 Agent 修改建议。',\n  agentPortfolioScope: '全局作品集范围',\n  agentCurrentFocus: '当前焦点',\n  agentAuditPortfolio: '检查整个作品集',", 'zh extras')

# Traditional
copy = replace_once(copy, "  agentTitle: '專案 AI Agent',", "  agentTitle: '全域作品集 AI Agent',", 'zhtw title')
copy = replace_once(copy, "  agentDraftOnly: '只修改草稿 · 是否套用由你決定',", "  agentDraftOnly: '可操作全部專案、多語言與技術資料 · 只修改草稿 · 是否套用由你決定',", 'zhtw scope')
copy = replace_once(copy, "  agentFillEmpty: '補全空白欄位',", "  agentFillEmpty: '補全作品集缺口',", 'zhtw quick1')
copy = replace_once(copy, "  agentTranslateAll: '翻譯全部語言',", "  agentTranslateAll: '補全缺失翻譯',", 'zhtw quick2')
copy = replace_once(copy, "  agentImproveCurrent: '優化目前語言',", "  agentImproveCurrent: '聚焦目前專案',", 'zhtw quick3')
copy = replace_once(copy, "  agentPlaceholder: '告訴 Agent 要怎麼修改這個專案…',", "  agentPlaceholder: '告訴全域 Agent 要修改作品集裡的什麼內容…',", 'zhtw placeholder')
copy = replace_once(copy, "  agentFailed: '專案 Agent 執行失敗。',", "  agentFailed: '作品集 Agent 執行失敗。',", 'zhtw failure')
copy = replace_once(copy, "  agentDiscarded: '已丟棄 Agent 修改建議。',", "  agentDiscarded: '已丟棄 Agent 修改建議。',\n  agentPortfolioScope: '全域作品集範圍',\n  agentCurrentFocus: '目前焦點',\n  agentAuditPortfolio: '檢查整個作品集',", 'zhtw extras')

# Vietnamese
copy = replace_once(copy, "  agentTitle: 'AI Agent cho dự án',", "  agentTitle: 'AI Agent toàn bộ portfolio',", 'vi title')
copy = replace_once(copy, "  agentDraftOnly: 'Chỉ sửa bản nháp · bạn quyết định có áp dụng hay không',", "  agentDraftOnly: 'Có thể làm việc trên mọi dự án, bản dịch và dữ liệu công nghệ · chỉ sửa bản nháp · bạn quyết định có áp dụng hay không',", 'vi scope')
copy = replace_once(copy, "  agentFillEmpty: 'Điền các trường còn trống',", "  agentFillEmpty: 'Bổ sung phần còn thiếu',", 'vi quick1')
copy = replace_once(copy, "  agentTranslateAll: 'Dịch tất cả ngôn ngữ',", "  agentTranslateAll: 'Bổ sung bản dịch còn thiếu',", 'vi quick2')
copy = replace_once(copy, "  agentImproveCurrent: 'Cải thiện ngôn ngữ hiện tại',", "  agentImproveCurrent: 'Tập trung dự án đang chọn',", 'vi quick3')
copy = replace_once(copy, "  agentPlaceholder: 'Hãy nói Agent cần sửa gì trong dự án này…',", "  agentPlaceholder: 'Hãy nói AI Agent toàn cục cần sửa gì ở bất kỳ đâu trong portfolio…',", 'vi placeholder')
copy = replace_once(copy, "  agentFailed: 'Project agent failed.',", "  agentFailed: 'Portfolio agent failed.',", 'vi failure')
copy = replace_once(copy, "  agentDiscarded: 'Đã bỏ đề xuất của Agent.',", "  agentDiscarded: 'Đã bỏ đề xuất của Agent.',\n  agentPortfolioScope: 'Phạm vi toàn bộ portfolio',\n  agentCurrentFocus: 'Tiêu điểm hiện tại',\n  agentAuditPortfolio: 'Kiểm tra toàn bộ portfolio',", 'vi extras')
copy_path.write_text(copy, encoding='utf-8')

# --- Worker: replace project-only agent with global operation planner -------
worker_path = Path('scripts/prepare-site-build.mjs')
worker = worker_path.read_text(encoding='utf-8')
start = worker.index("const AGENT_TRANSLATION_LOCALES = ['zh-CN', 'zh-TW', 'vi-Latn', 'vi-Hani'];")
end = worker.index("\nasync function analyzeRepository(payload, env) {", start)
new_worker = r'''const AGENT_TRANSLATION_LOCALES = ['zh-CN', 'zh-TW', 'vi-Latn', 'vi-Hani'];
const AGENT_GROUPS = ['client', 'backend', 'platform'];

function agentString(value, limit) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : undefined;
}

function agentStringArray(value, limit = 24, itemLimit = 900) {
  if (!Array.isArray(value)) return undefined;
  return value.filter((item) => typeof item === 'string').map((item) => item.trim().slice(0, itemLimit)).filter(Boolean).slice(0, limit);
}

function agentObjectArray(value, left, right, limit = 20) {
  if (!Array.isArray(value)) return undefined;
  return value.filter((item) => item && typeof item === 'object').map((item) => ({
    [left]: typeof item[left] === 'string' ? item[left].trim().slice(0, 500) : '',
    [right]: typeof item[right] === 'string' ? item[right].trim().slice(0, 1800) : '',
  })).filter((item) => item[left]).slice(0, limit);
}

function cleanAgentProjectPatch(value) {
  if (!value || typeof value !== 'object') return {};
  const patch = {};
  for (const [field, limit] of Object.entries({ title: 180, shortTitle: 120, status: 160, summary: 1200, overview: 5000, github: 500 })) {
    const cleaned = agentString(value[field], limit);
    if (cleaned !== undefined) patch[field] = cleaned;
  }
  const technologies = agentStringArray(value.technologies, 30, 120);
  const features = agentStringArray(value.features, 24, 900);
  const challenges = agentObjectArray(value.challenges, 'title', 'description');
  const architecture = agentObjectArray(value.architecture, 'label', 'detail');
  const gallery = agentObjectArray(value.gallery, 'title', 'caption');
  if (technologies !== undefined) patch.technologies = technologies;
  if (features !== undefined) patch.features = features;
  if (challenges !== undefined) patch.challenges = challenges;
  if (architecture !== undefined) patch.architecture = architecture;
  if (gallery !== undefined) patch.gallery = gallery;
  if (['Language', 'AI & Developer Tools', 'Product'].includes(value.category)) patch.category = value.category;
  if (['lime', 'blue', 'sand', 'lavender', 'slate', 'coral'].includes(value.tone)) patch.tone = value.tone;
  if (['morphology', 'commerce', 'language', 'keyboard', 'ide', 'inflection'].includes(value.mockup)) patch.mockup = value.mockup;
  return patch;
}

function cleanAgentTranslationPatch(value) {
  if (!value || typeof value !== 'object') return {};
  const patch = {};
  for (const [field, limit] of Object.entries({ title: 180, shortTitle: 120, summary: 1200, overview: 5000 })) {
    const cleaned = agentString(value[field], limit);
    if (cleaned !== undefined) patch[field] = cleaned;
  }
  const features = agentStringArray(value.features, 24, 900);
  const challenges = agentObjectArray(value.challenges, 'title', 'description');
  const architecture = agentObjectArray(value.architecture, 'label', 'detail');
  const gallery = agentObjectArray(value.gallery, 'title', 'caption');
  if (features !== undefined) patch.features = features;
  if (challenges !== undefined) patch.challenges = challenges;
  if (architecture !== undefined) patch.architecture = architecture;
  if (gallery !== undefined) patch.gallery = gallery;
  return patch;
}

function cleanAgentNewProject(value, index) {
  if (!value || typeof value !== 'object') return null;
  const slug = agentString(value.slug, 120)?.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
  const title = agentString(value.title, 180);
  if (!slug || !title) return null;
  return {
    slug,
    title,
    shortTitle: agentString(value.shortTitle, 120) || title,
    category: ['Language', 'AI & Developer Tools', 'Product'].includes(value.category) ? value.category : 'Product',
    status: agentString(value.status, 160) || 'In Development',
    number: agentString(value.number, 20) || String(index + 1).padStart(2, '0'),
    summary: agentString(value.summary, 1200) || '',
    overview: agentString(value.overview, 5000) || '',
    technologies: agentStringArray(value.technologies, 30, 120) || [],
    features: agentStringArray(value.features, 24, 900) || [],
    challenges: agentObjectArray(value.challenges, 'title', 'description') || [],
    architecture: agentObjectArray(value.architecture, 'label', 'detail') || [],
    gallery: agentObjectArray(value.gallery, 'title', 'caption') || [],
    github: agentString(value.github, 500),
    tone: ['lime', 'blue', 'sand', 'lavender', 'slate', 'coral'].includes(value.tone) ? value.tone : 'blue',
    mockup: ['morphology', 'commerce', 'language', 'keyboard', 'ide', 'inflection'].includes(value.mockup) ? value.mockup : 'language',
  };
}

function cleanTechnologyOperation(value) {
  if (!value || typeof value !== 'object' || !AGENT_GROUPS.includes(value.group)) return null;
  if (value.action === 'add' && value.item && typeof value.item === 'object') {
    const name = agentString(value.item.name, 120);
    const color = agentString(value.item.color, 32);
    if (!name || !color) return null;
    return { action: 'add', group: value.group, item: { name, color, logo: agentString(value.item.logo, 500) } };
  }
  if ((value.action === 'update' || value.action === 'remove') && typeof value.name === 'string') {
    const name = value.name.trim().slice(0, 120);
    if (!name) return null;
    if (value.action === 'remove') return { action: 'remove', group: value.group, name };
    const patch = {};
    const nextName = agentString(value.patch?.name, 120);
    const color = agentString(value.patch?.color, 32);
    const logo = agentString(value.patch?.logo, 500);
    if (nextName !== undefined) patch.name = nextName;
    if (color !== undefined) patch.color = color;
    if (logo !== undefined) patch.logo = logo;
    return { action: 'update', group: value.group, name, patch };
  }
  return null;
}

function portfolioAgentChangedFields(projectPatches, translationPatches, newProjects, deleteProjectSlugs, technologyOperations) {
  const fields = [];
  for (const item of projectPatches) for (const field of Object.keys(item.patch)) fields.push(item.slug + '.en.' + field);
  for (const item of translationPatches) for (const field of Object.keys(item.patch)) fields.push(item.slug + '.' + item.locale + '.' + field);
  for (const item of newProjects) fields.push('new-project:' + item.slug);
  for (const slug of deleteProjectSlugs) fields.push('delete-project:' + slug);
  for (const item of technologyOperations) fields.push('technology:' + item.group + ':' + (item.name || item.item?.name || item.action));
  return fields.slice(0, 120);
}

async function runPortfolioAgent(payload, env) {
  const instruction = typeof payload?.instruction === 'string' ? payload.instruction.trim() : '';
  const projects = Array.isArray(payload?.projects) ? payload.projects.slice(0, 60) : [];
  if (!instruction || projects.length === 0) return json({ error: 'Portfolio projects and agent instruction are required.' }, 400);

  const translations = payload?.translations && typeof payload.translations === 'object' ? payload.translations : {};
  const technologyCatalog = payload?.technologyCatalog && typeof payload.technologyCatalog === 'object' ? payload.technologyCatalog : {};
  const history = Array.isArray(payload?.history)
    ? payload.history.filter((item) => item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string').slice(-12).map((item) => ({ role: item.role, content: item.content.slice(0, 2000) }))
    : [];

  const instructions = [
    'You are the global editing agent for an entire developer portfolio CMS.',
    'You can reason across every project, every supported translation, and the shared technology catalog.',
    'The currently selected project and active locale are context only, not a scope restriction unless the user asks for that scope.',
    'The user owns the draft. Propose edits only. Never publish or claim that changes are already applied.',
    'Return JSON only with exactly these keys: message, projectPatches, translationPatches, newProjects, deleteProjectSlugs, technologyOperations.',
    'projectPatches is an array of {slug, patch}. patch may contain title, shortTitle, category, status, summary, overview, technologies, features, challenges, architecture, gallery, github, tone, mockup. Never change slug or project number through projectPatches.',
    'translationPatches is an array of {slug, locale, patch}. locale must be zh-CN, zh-TW, vi-Latn, or vi-Hani. Translation patch fields are title, shortTitle, summary, overview, features, challenges, architecture, gallery.',
    'newProjects is an array of complete project drafts and should be used only when the user explicitly asks to create or add a project.',
    'deleteProjectSlugs is allowed only when the user explicitly asks to delete or remove a project.',
    'technologyOperations supports add, update, and remove for client, backend, and platform technology groups. Do not remove technology entries unless explicitly requested or clearly duplicated and the user asked for cleanup.',
    'When the user says all, entire portfolio, every project, or globally, work across the whole portfolio instead of the selected project.',
    'When asked to fill missing translations, fill only missing or clearly incomplete translated fields and preserve good existing translations.',
    'When asked to improve copy, keep it factual, concise, portfolio-appropriate, and consistent across projects.',
    'Do not invent project facts, users, metrics, deployment state, features, or technologies. Existing portfolio data is evidence but may be incomplete.',
    'For vi-Hani, write Vietnamese in Chữ Nôm / Hán-Nôm rather than translating into Chinese; keep Latin technical names when uncertain.',
    'Preserve URLs, repository slugs, code identifiers, framework names, database names, and project brands unless the user explicitly requests a rename.',
    'If the request is only a question, answer in message and return empty operation arrays.',
    'Keep message concise and describe the scope of the proposal.',
  ].join(' ');

  try {
    const parsed = await runOpenAI(env, instructions, {
      instruction,
      selectedSlug: payload?.selectedSlug || '',
      activeLocale: payload?.activeLocale || 'en',
      projects,
      translations,
      technologyCatalog,
      recentConversation: history,
    }, 16000);

    const projectSlugs = new Set(projects.map((project) => project?.slug).filter(Boolean));
    const projectPatches = Array.isArray(parsed?.projectPatches)
      ? parsed.projectPatches.map((item) => ({ slug: typeof item?.slug === 'string' ? item.slug : '', patch: cleanAgentProjectPatch(item?.patch) })).filter((item) => projectSlugs.has(item.slug) && Object.keys(item.patch).length > 0).slice(0, 80)
      : [];
    const translationPatches = Array.isArray(parsed?.translationPatches)
      ? parsed.translationPatches.map((item) => ({ slug: typeof item?.slug === 'string' ? item.slug : '', locale: item?.locale, patch: cleanAgentTranslationPatch(item?.patch) })).filter((item) => projectSlugs.has(item.slug) && AGENT_TRANSLATION_LOCALES.includes(item.locale) && Object.keys(item.patch).length > 0).slice(0, 180)
      : [];
    const newProjects = Array.isArray(parsed?.newProjects)
      ? parsed.newProjects.map((item, index) => cleanAgentNewProject(item, projects.length + index)).filter(Boolean).slice(0, 12)
      : [];
    const explicitDelete = /\b(delete|remove)\b|删除|刪除|移除|xóa/i.test(instruction);
    const deleteProjectSlugs = explicitDelete && Array.isArray(parsed?.deleteProjectSlugs)
      ? parsed.deleteProjectSlugs.filter((slug) => typeof slug === 'string' && projectSlugs.has(slug)).slice(0, 20)
      : [];
    const technologyOperations = Array.isArray(parsed?.technologyOperations)
      ? parsed.technologyOperations.map(cleanTechnologyOperation).filter(Boolean).slice(0, 60)
      : [];

    return json({
      message: cleanString(parsed?.message, 'Portfolio draft proposal prepared for review.', 1400),
      projectPatches,
      translationPatches,
      newProjects,
      deleteProjectSlugs,
      technologyOperations,
      changedFields: portfolioAgentChangedFields(projectPatches, translationPatches, newProjects, deleteProjectSlugs, technologyOperations),
    });
  } catch (error) {
    return json({ error: error?.message || 'Portfolio agent failed.', status: error?.status, detail: error?.detail }, 502);
  }
}
'''
worker = worker[:start] + new_worker + worker[end:]
worker = replace_once(
    worker,
    "  if (payload?.mode === 'project-agent') {\n    return runProjectAgent(payload, env);\n  }",
    "  if (payload?.mode === 'portfolio-agent') {\n    return runPortfolioAgent(payload, env);\n  }",
    'worker route',
)
worker_path.write_text(worker, encoding='utf-8')

# --- Styles ----------------------------------------------------------------
style_path = Path('src/styles/admin.css')
style = style_path.read_text(encoding='utf-8')
style += r'''

.admin-global-agent-panel {
  padding-top: 38px;
}

.admin-agent-heading {
  align-items: end;
}

.admin-global-agent-context {
  display: grid;
  gap: 5px;
  margin-bottom: 16px;
  padding: 14px 16px;
  border: 1px solid #34473b;
  border-radius: 12px;
  background: rgba(199, 255, 74, 0.035);
}

.admin-global-agent-context > span {
  color: #c7ff4a;
  font-size: 0.63rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.admin-global-agent-context strong {
  color: #edf3ef;
  font-size: 0.95rem;
}

.admin-global-agent-context small {
  color: #8fa098;
  line-height: 1.5;
}

.admin-global-agent-thread {
  max-height: 330px;
  overflow-y: auto;
  margin-bottom: 14px;
}

.admin-global-agent-compose textarea {
  min-height: 118px;
}

.admin-global-agent-proposal {
  margin-top: 14px;
}
'''
style_path.write_text(style, encoding='utf-8')
