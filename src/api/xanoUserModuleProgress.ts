/** Endpoint par défaut — surchargeable via prop sur `ErnestCyberChat`. */
export const DEFAULT_USER_MODULES_PROGRESS_URL =
  'https://xpls-geth-5exy.p7.xano.io/api:9x7E18zP/user_modules_progress';

/** Datasource Xano ciblée par défaut (ne pas toucher `live` tant que ce n’est pas voulu). */
export const DEFAULT_XANO_DATA_SOURCE = 'demo';

export type XanoUserModuleProgressPayload = {
  user_id: string;
  module_id: string;
  answered_steps: string[];
  current_step_id: string;
  completed: boolean;
  /** ISO 8601 — requis par plusieurs schémas de table Xano (dont datasource `demo`). */
  created_at: string;
  /** ISO 8601 (ex. `new Date().toISOString()`). */
  update_at: string;
};

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

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Xano user_modules_progress ${res.status}: ${text || res.statusText}`
    );
  }
}
