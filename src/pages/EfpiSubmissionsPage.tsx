import { useCallback, useEffect, useMemo, useState } from 'react';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import {
  EfpiSubmission,
  FORM_LABELS,
  FormCount,
  efpiSubmissionsService,
  toCsv,
} from '../services/efpiSubmissionsService';

/**
 * Enquiries from the EFPI site: contact, partner and factsheet downloads.
 *
 * All three in one list, because to whoever follows them up they are the same
 * thing — someone who left their details and expects a reply. The distinction
 * that matters is not which form they used but whether anyone has dealt with
 * them, so unhandled is the default view and handled ones fade back.
 */
export default function EfpiSubmissionsPage() {
  const [rows, setRows] = useState<EfpiSubmission[]>([]);
  const [counts, setCounts] = useState<FormCount[]>([]);
  const [form, setForm] = useState<string>('');
  const [showHandled, setShowHandled] = useState(false);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (which: string) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await efpiSubmissionsService.list(which || undefined);
      setRows(data.submissions);
      setCounts(data.counts);
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Could not load submissions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(form);
  }, [form, load]);

  const toggleHandled = async (row: EfpiSubmission) => {
    // Optimistic: the list is the working surface and a round trip per tick
    // would make working through a morning's enquiries feel like wading.
    const next = !row.is_handled;
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_handled: next } : r)));
    try {
      await efpiSubmissionsService.setHandled(row.id, next);
    } catch {
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_handled: !next } : r)));
      setError('Could not update that one. Please try again.');
    }
  };

  const remove = async (row: EfpiSubmission) => {
    if (!window.confirm(`Delete the enquiry from ${row.email}? This cannot be undone.`)) return;
    try {
      await efpiSubmissionsService.remove(row.id);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Could not delete that one.');
    }
  };

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows
      .filter((r) => showHandled || !r.is_handled)
      .filter(
        (r) =>
          !q ||
          r.email.toLowerCase().includes(q) ||
          (r.name || '').toLowerCase().includes(q) ||
          Object.values(r.fields || {}).some((v) => String(v).toLowerCase().includes(q))
      );
  }, [rows, showHandled, search]);

  const totalUnhandled = counts.reduce((n, c) => n + c.unhandled, 0);

  const download = () => {
    const blob = new Blob([toCsv(visible)], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `efpi-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const when = (iso: string) => {
    const d = new Date(iso);
    const mins = Math.floor((Date.now() - d.getTime()) / 60000);
    if (mins < 60) return `${mins || 1} min ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    if (mins < 10080) return `${Math.floor(mins / 1440)}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <>
      <Breadcrumb />
      <div className="p-6 max-w-6xl mx-auto space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">EFPI enquiries</h1>
            <p className="text-gray-500 text-sm mt-1">
              {totalUnhandled > 0
                ? `${totalUnhandled} waiting for a reply`
                : 'Everything here has been dealt with'}
            </p>
          </div>
          <button
            type="button"
            onClick={download}
            disabled={visible.length === 0}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-40"
          >
            Export {visible.length} as CSV
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {[{ key: '', label: 'All' }, ...Object.entries(FORM_LABELS).map(([k, l]) => ({ key: k, label: l }))].map(
            (tab) => {
              const c = counts.find((x) => x.form_name === tab.key);
              return (
                <button
                  key={tab.key || 'all'}
                  type="button"
                  onClick={() => setForm(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    form === tab.key
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                  {c && c.unhandled > 0 && (
                    <span className={`ml-2 text-xs ${form === tab.key ? 'text-blue-100' : 'text-amber-600'}`}>
                      {c.unhandled}
                    </span>
                  )}
                </button>
              );
            }
          )}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email or message…"
            className="ml-auto border border-gray-300 rounded-lg px-3 py-1.5 text-sm min-w-[220px]"
          />
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showHandled}
              onChange={(e) => setShowHandled(e.target.checked)}
            />
            Show handled
          </label>
        </div>

        {/* List */}
        <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
          {isLoading && <p className="p-6 text-sm text-gray-500">Loading…</p>}

          {!isLoading && visible.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-sm text-gray-500">
                {rows.length === 0
                  ? 'No enquiries yet.'
                  : showHandled
                    ? 'Nothing matches that search.'
                    : 'Nothing outstanding — tick “Show handled” to see the rest.'}
              </p>
            </div>
          )}

          {visible.map((row) => (
            <div key={row.id} className={row.is_handled ? 'opacity-55' : ''}>
              <div className="flex items-start gap-3 p-4">
                <input
                  type="checkbox"
                  checked={row.is_handled}
                  onChange={() => toggleHandled(row)}
                  className="mt-1"
                  title={row.is_handled ? 'Mark as not handled' : 'Mark as handled'}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="font-medium text-gray-900">{row.name || 'No name given'}</span>
                    {/* mailto, because replying is the entire point of this screen */}
                    <a href={`mailto:${row.email}`} className="text-sm text-blue-600 hover:underline">
                      {row.email}
                    </a>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                      {FORM_LABELS[row.form_name] ?? row.form_name}
                    </span>
                    <span className="text-xs text-gray-400 ml-auto" title={new Date(row.created_at).toLocaleString()}>
                      {when(row.created_at)}
                    </span>
                  </div>

                  {/* The message itself, where the form collected one. */}
                  {(() => {
                    const message = Object.entries(row.fields || {}).find(([k]) =>
                      /message|description|comment|enquir/i.test(k)
                    )?.[1];
                    return message ? (
                      <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">{message}</p>
                    ) : null;
                  })()}

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setExpanded(expanded === row.id ? null : row.id)}
                      className="text-xs text-gray-500 hover:text-gray-800"
                    >
                      {expanded === row.id ? 'Hide details' : 'All details'}
                    </button>
                    {row.is_handled && row.handled_by_name && (
                      <span className="text-xs text-gray-400">handled by {row.handled_by_name}</span>
                    )}
                    <button
                      type="button"
                      onClick={() => remove(row)}
                      className="text-xs text-gray-400 hover:text-red-600 ml-auto"
                    >
                      Delete
                    </button>
                  </div>

                  {expanded === row.id && (
                    <dl className="mt-3 rounded-lg bg-gray-50 p-3 text-sm space-y-1.5">
                      {Object.entries(row.fields || {}).map(([k, v]) => (
                        <div key={k} className="flex gap-3">
                          <dt className="text-gray-500 min-w-[130px] shrink-0">{k}</dt>
                          <dd className="text-gray-800 break-words">{v}</dd>
                        </div>
                      ))}
                      {row.page && (
                        <div className="flex gap-3">
                          <dt className="text-gray-500 min-w-[130px] shrink-0">submitted from</dt>
                          <dd className="text-gray-800">{row.page}</dd>
                        </div>
                      )}
                    </dl>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
