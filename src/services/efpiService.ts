import { api } from './api';

/**
 * EFPI content, as the two-panel editor needs it.
 *
 * EFPI is a React port of an Elementor build: fixed markup with strings injected
 * by key. All of a page's copy lives in one page_sections row, section_key
 * 'content', whose JSONB is a flat map of Elementor element id to string. So
 * "save" here means writing that whole map back, not patching a field.
 */

export const EFPI_SITE_URL =
  import.meta.env.VITE_EFPI_SITE_URL || 'https://efpi.getfund.gov.gh';

export type FieldKind = 'text' | 'longtext' | 'html' | 'asset';

export interface EfpiField {
  key: string;
  value: string;
  kind: FieldKind;
}

/** Which page each content file drives, and where it lives on the site. */
export const EFPI_PAGES: { slug: string; label: string; path: string | null }[] = [
  { slug: 'home', label: 'Home', path: '/' },
  { slug: 'about', label: 'About', path: '/about' },
  { slug: 'impact', label: 'Impact', path: '/impact' },
  { slug: 'initiative', label: 'The Initiative', path: '/initiative' },
  { slug: 'partner', label: 'Partner', path: '/partner' },
  { slug: 'contact', label: 'Contact', path: '/contact' },
  // Chrome and popups appear on every page, so the preview stays on the home
  // page for these — there is no route of their own to show.
  { slug: 'header', label: 'Header', path: '/' },
  { slug: 'footer', label: 'Footer', path: '/' },
  { slug: 'popup-donate', label: 'Donation popup', path: '/' },
  { slug: 'popup-3934', label: 'Partner popup', path: '/' },
  { slug: 'popup-3861', label: 'Newsletter popup', path: '/' },
];

/**
 * What kind of control a value needs. The editor is useless if a 400-word HTML
 * blob and a link URL both get the same single-line input.
 */
export function kindOf(value: string): FieldKind {
  const trimmed = value.trim();
  if (trimmed.startsWith('<')) return 'html';
  if (/^(\/|https?:\/\/)/.test(trimmed)) return 'asset';
  return value.length > 90 ? 'longtext' : 'text';
}

/**
 * A readable name for a key.
 *
 * The keys are Elementor element ids — `1eadbbf.0` — which tell an editor
 * nothing. The value itself is the only meaningful label, so the field is
 * labelled by its own opening words, and the id is kept as a subtitle for
 * anyone who needs to trace it back.
 */
export function labelFor(field: EfpiField): string {
  if (field.kind === 'asset') {
    const name = field.value.split('/').pop() || field.value;
    return name.length > 40 ? `${name.slice(0, 40)}…` : name;
  }
  const text = field.value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return '(empty)';
  return text.length > 60 ? `${text.slice(0, 60)}…` : text;
}

export const efpiService = {
  /** Every field on one page, in the order the content file defines. */
  async getPage(slug: string): Promise<EfpiField[]> {
    const response = await api.get(`/pages/${slug}/sections/content`, {
      params: { site: 'efpi' },
    });
    const content = (response.data.section?.content ?? {}) as Record<string, unknown>;
    return Object.entries(content)
      .filter(([, value]) => typeof value === 'string')
      .map(([key, value]) => ({ key, value: value as string, kind: kindOf(value as string) }));
  },

  /**
   * Writes the page's whole map back.
   *
   * Built from the fields the editor is holding rather than patching keys, so
   * what is saved is exactly what was on screen. Two people editing the same
   * page will overwrite each other — acceptable for a handful of editors, and
   * worth knowing before it surprises someone.
   */
  async savePage(slug: string, fields: EfpiField[]): Promise<void> {
    const content: Record<string, string> = {};
    for (const field of fields) content[field.key] = field.value;
    await api.put(
      `/pages/${slug}/sections/content`,
      { content },
      { params: { site: 'efpi' } }
    );
  },
};
