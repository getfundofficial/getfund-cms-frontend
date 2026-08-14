/**
 * Which site the CMS is currently editing.
 *
 * This CMS now serves two: GETFund and EFPI (efpi.getfund.gov.gh). They share
 * the pages/page_sections tables, so every page request has to say which one it
 * means — both have an `about`, an `impact` and a `contact`, and a lookup by
 * slug alone matches two rows.
 *
 * Held here rather than threaded through the twenty-odd pageService call sites.
 * The trade is real — this is module state, not React state — but the
 * alternative is a `site` argument on every method and every caller, where one
 * missed call site silently edits the wrong site's page. One place to get right
 * is better than twenty places to forget.
 *
 * Persisted so a refresh does not bounce an editor back to GETFund midway
 * through working on EFPI.
 */

export type SiteKey = 'getfund' | 'efpi';

export const SITES: { key: SiteKey; label: string; hint: string }[] = [
  { key: 'getfund', label: 'GETFund', hint: 'getfund.gov.gh' },
  { key: 'efpi', label: 'EFPI', hint: 'efpi.getfund.gov.gh' },
];

const STORAGE_KEY = 'cms_active_site';
const DEFAULT_SITE: SiteKey = 'getfund';

const isSiteKey = (value: unknown): value is SiteKey =>
  value === 'getfund' || value === 'efpi';

let active: SiteKey = (() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isSiteKey(stored) ? stored : DEFAULT_SITE;
  } catch {
    // Private browsing, or storage disabled. Not worth failing over.
    return DEFAULT_SITE;
  }
})();

const listeners = new Set<(site: SiteKey) => void>();

export function getSite(): SiteKey {
  return active;
}

export function setSite(site: SiteKey): void {
  if (!isSiteKey(site) || site === active) return;
  active = site;
  try {
    localStorage.setItem(STORAGE_KEY, site);
  } catch {
    // Ignore: the switch still works for this session.
  }
  listeners.forEach((fn) => fn(site));
}

/** Subscribe to switches. Returns an unsubscribe function. */
export function onSiteChange(fn: (site: SiteKey) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function siteLabel(site: SiteKey = active): string {
  return SITES.find((s) => s.key === site)?.label ?? site;
}

/** Query params for a page request. Spread into an axios config. */
export function siteParams(): { site: SiteKey } {
  return { site: active };
}
