/** Endpoint par défaut — surchargeable via prop sur `ErnestCyberChat`. */
export const DEFAULT_USER_MODULES_PROGRESS_URL =
  'https://xpls-geth-5exy.p7.xano.io/api:9x7E18zP/user_modules_progress';

/** Datasource Xano ciblée par défaut (ne pas toucher `live` tant que ce n’est pas voulu). */
export const DEFAULT_XANO_DATA_SOURCE = 'demo';

/**
 * Table `user_modules_progress` (export CSV Xano) :
 * `id` (auto), `created_at`, `user_id`, `module_id`, `answered_steps`, `current_step_id`, `completed`, `updated_at`.
 * Le corps JSON du POST ne doit contenir que les colonnes éditables (sans `id`).
 */
export type XanoUserModuleProgressPayload = {
  user_id: string;
  module_id: string;
  /** Liste d’ids d’étapes (texte), sérialisée en tableau JSON — aligné colonne JSON / text[] Xano. */
  answered_steps: string[];
  current_step_id: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export type BuildXanoUserModuleProgressParams = {
  userId: string;
  moduleId: string;
  answeredSteps: readonly string[];
  currentStepId: string;
  completed: boolean;
  /** ISO 8601 ; défaut : maintenant. */
  createdAt?: string;
  /** ISO 8601 ; défaut : maintenant. */
  updatedAt?: string;
};

/** Construit le corps exact attendu par la table (snake_case, types normalisés). */
export function buildXanoUserModuleProgressPayload(
  params: BuildXanoUserModuleProgressParams
): XanoUserModuleProgressPayload {
  const nowIso = new Date().toISOString();
  const created_at = params.createdAt ?? nowIso;
  const updated_at = params.updatedAt ?? nowIso;
  const answered_steps = [
    ...new Set(params.answeredSteps.map((s) => String(s).trim()).filter(Boolean)),
  ];

  return {
    user_id: String(params.userId).trim(),
    module_id: String(params.moduleId).trim(),
    answered_steps,
    current_step_id: String(params.currentStepId).trim(),
    completed: Boolean(params.completed),
    created_at,
    updated_at,
  };
}

export type PostUserModuleProgressOptions = {
  authToken?: string;
  /**
   * Header `X-Data-Source`. Par défaut : {@link DEFAULT_XANO_DATA_SOURCE} (`demo`).
   * Passe explicitement `live` (ou autre) uniquement quand tu veux écrire en prod.
   */
  dataSource?: string;
};

export async function postUserModuleProgress(
  url: string,
  payload: XanoUserModuleProgressPayload,
  options?: PostUserModuleProgressOptions
): Promise<void> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (options?.authToken) {
    headers.Authorization = `Bearer ${options.authToken}`;
  }
  headers['X-Data-Source'] =
    options?.dataSource ?? DEFAULT_XANO_DATA_SOURCE;

  const body = {
    user_id: payload.user_id,
    module_id: payload.module_id,
    answered_steps: payload.answered_steps,
    current_step_id: payload.current_step_id,
    completed: payload.completed,
    created_at: payload.created_at,
    updated_at: payload.updated_at,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Xano user_modules_progress ${res.status}: ${text || res.statusText}`
    );
  }
}
