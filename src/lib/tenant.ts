export const DEFAULT_TENANT = "demo";
export const SUPPORTED_TENANTS = ["demo", "klesia"] as const;
export type Tenant = (typeof SUPPORTED_TENANTS)[number];

const TENANT_STORAGE_KEY = "activeTenant";
const TENANT_PARAM = "tenant";

const sanitizeTenant = (value: string | null | undefined): Tenant | null => {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;

  if (!/^[a-z0-9-]+$/.test(normalized)) return null;
  return SUPPORTED_TENANTS.includes(normalized as Tenant) ? (normalized as Tenant) : null;
};

const resolveTenantFromHostname = (): string | null => {
  const host = window.location.hostname.toLowerCase();

  if (host === "localhost" || host === "127.0.0.1") {
    return null;
  }

  const [subdomain] = host.split(".");
  if (!subdomain || subdomain === "www") {
    return null;
  }

  return sanitizeTenant(subdomain);
};

export const resolveTenant = (): Tenant => {
  const searchParams = new URLSearchParams(window.location.search);
  const queryTenant = sanitizeTenant(searchParams.get(TENANT_PARAM));
  if (queryTenant) return queryTenant;

  const storedTenant = sanitizeTenant(localStorage.getItem(TENANT_STORAGE_KEY));
  if (storedTenant) return storedTenant;

  const hostnameTenant = resolveTenantFromHostname();
  if (hostnameTenant) return hostnameTenant;

  return DEFAULT_TENANT;
};

export const applyTenant = (tenant: string): Tenant => {
  const safeTenant = sanitizeTenant(tenant) ?? DEFAULT_TENANT;

  document.documentElement.dataset.tenant = safeTenant;
  localStorage.setItem(TENANT_STORAGE_KEY, safeTenant);

  return safeTenant;
};
