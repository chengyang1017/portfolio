import type { Project } from '../data/projects';
import type {
  ProjectTranslation,
  ProjectTranslationLocale,
} from '../data/projectTranslationCatalog';

export type AgentMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ProjectAgentProposal = {
  message: string;
  projectPatch?: Partial<Project>;
  translationsPatch?: Partial<Record<ProjectTranslationLocale, Partial<ProjectTranslation>>>;
  changedFields: string[];
};

export async function runProjectAgent({
  instruction,
  project,
  translations,
  activeLocale,
  history,
}: {
  instruction: string;
  project: Project;
  translations: Partial<Record<ProjectTranslationLocale, ProjectTranslation>>;
  activeLocale: 'en' | ProjectTranslationLocale;
  history: AgentMessage[];
}): Promise<ProjectAgentProposal> {
  const response = await fetch('/api/portfolio-ai', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mode: 'project-agent',
      instruction,
      project,
      translations,
      activeLocale,
      history: history.slice(-10),
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | {
        message?: string;
        projectPatch?: Partial<Project>;
        translationsPatch?: Partial<
          Record<ProjectTranslationLocale, Partial<ProjectTranslation>>
        >;
        changedFields?: string[];
        error?: string;
        detail?: string;
      }
    | null;

  if (!response.ok) {
    throw new Error(
      payload?.detail ||
        payload?.error ||
        `Project agent failed (${response.status}).`,
    );
  }

  return {
    message: payload?.message?.trim() || 'I prepared a draft change for review.',
    projectPatch: payload?.projectPatch,
    translationsPatch: payload?.translationsPatch,
    changedFields: Array.isArray(payload?.changedFields) ? payload.changedFields : [],
  };
}
