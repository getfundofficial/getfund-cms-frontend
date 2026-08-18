import { api } from './api';

/**
 * Submissions from the EFPI site's three forms.
 *
 * They are written by the EFPI site's own server rather than posted here from
 * a browser, so nothing in this app creates them — it only reads, marks them
 * handled, and deletes.
 */

export interface EfpiSubmission {
  id: string;
  form_name: 'contact' | 'partner' | 'factsheet';
  page: string | null;
  name: string | null;
  email: string;
  /** Everything the form collected, including questions added since. */
  fields: Record<string, string>;
  is_handled: boolean;
  handled_at: string | null;
  handled_by_name: string | null;
  notes: string | null;
  created_at: string;
}

export interface FormCount {
  form_name: string;
  total: number;
  unhandled: number;
}

export const FORM_LABELS: Record<string, string> = {
  contact: 'Contact',
  partner: 'Partner enquiry',
  factsheet: 'Factsheet download',
};

export const efpiSubmissionsService = {
  async list(form?: string): Promise<{ submissions: EfpiSubmission[]; counts: FormCount[] }> {
    const response = await api.get('/efpi/submissions', {
      params: form ? { form, limit: 500 } : { limit: 500 },
    });
    return {
      submissions: response.data.submissions ?? [],
      counts: response.data.counts ?? [],
    };
  },

  async setHandled(id: string, isHandled: boolean): Promise<void> {
    await api.patch(`/efpi/submissions/${id}`, { is_handled: isHandled });
  },

  async setNotes(id: string, notes: string): Promise<void> {
    await api.patch(`/efpi/submissions/${id}`, { notes });
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/efpi/submissions/${id}`);
  },
};

/**
 * A CSV of what is on screen.
 *
 * Built from the rows already loaded rather than a second request, so the file
 * matches the filter the user is looking at. Values are quoted and internal
 * quotes doubled — a partner enquiry is free text and will contain commas,
 * newlines and apostrophes.
 */
export function toCsv(rows: EfpiSubmission[]): string {
  // The union of every field any row carries, so a form that gained a question
  // does not lose it here.
  const extra = new Set<string>();
  rows.forEach((r) => Object.keys(r.fields || {}).forEach((k) => extra.add(k)));
  const extras = [...extra];

  const header = ['Received', 'Form', 'Name', 'Email', 'Page', 'Handled', 'Notes', ...extras];
  const escape = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;

  const lines = rows.map((r) =>
    [
      new Date(r.created_at).toISOString(),
      FORM_LABELS[r.form_name] ?? r.form_name,
      r.name ?? '',
      r.email,
      r.page ?? '',
      r.is_handled ? 'yes' : 'no',
      r.notes ?? '',
      ...extras.map((k) => r.fields?.[k] ?? ''),
    ]
      .map(escape)
      .join(',')
  );

  return [header.map(escape).join(','), ...lines].join('\n');
}
