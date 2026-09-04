// Global portfolio editing agent client.
import type { Project } from '../data/projects';
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
