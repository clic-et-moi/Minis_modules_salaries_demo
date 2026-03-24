/** Endpoint par défaut — surchargeable via prop sur `ErnestCyberChat`. */
export const DEFAULT_USER_MODULES_PROGRESS_URL =
  'https://xpls-geth-5exy.p7.xano.io/api:9x7E18zP/user_modules_progress';

export type XanoUserModuleProgressPayload = {
  user_id: string;
  module_id: string;
  answered_steps: string[];
  current_step_id: string;
  completed: boolean;
  /** ISO 8601 (ex. `new Date().toISOString()`). */
  update_at: string;
};

export async function postUserModuleProgress(
  url: string,
  payload: XanoUserModuleProgressPayload,
  authToken?: string
): Promise<void> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

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
