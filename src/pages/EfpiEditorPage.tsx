import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import { Button } from '../components/Common/Button';
import {
  EFPI_PAGES,
  EFPI_SITE_URL,
  EfpiField,
  efpiService,
  labelFor,
} from '../services/efpiService';

/**
 * The EFPI editor: the live site on the left, its copy on the right.
 *
 * EFPI's pages are fixed Elementor markup with strings injected by keys like
 * `1eadbbf.0`, and the home page has 168 of them. A flat list of 168 inputs
 * named after element ids would be unusable, so the two panels talk to each
 * other: click a headline in the preview and its field opens here; edit a field
 * and the preview updates before anything is saved.
 *
 * The preview is the real site in an iframe, running with ?cmsEdit=1. It is not
 * a rendering of the page by this app — a reimplementation would drift from what
 * visitors actually see, which is the one thing a preview must not do.
 */
export default function EfpiEditorPage() {
  const [slug, setSlug] = useState('home');
  const [fields, setFields] = useState<EfpiField[]>([]);
  const [original, setOriginal] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);

  const frameRef = useRef<HTMLIFrameElement>(null);
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

  const page = EFPI_PAGES.find((p) => p.slug === slug) ?? EFPI_PAGES[0];

  const dirty = useMemo(
    () => fields.some((f) => original[f.key] !== undefined && original[f.key] !== f.value),
    [fields, original]
  );

  // Warn before losing work — this is a form with up to 168 fields in it.
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const load = useCallback(async (which: string) => {
    setIsLoading(true);
    setError('');
    setPreviewReady(false);
    try {
      const loaded = await efpiService.getPage(which);
      setFields(loaded);
      setOriginal(Object.fromEntries(loaded.map((f) => [f.key, f.value])));
      setSelected(null);
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Could not load this page');
      setFields([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(slug);
  }, [slug, load]);

  const toPreview = useCallback((message: Record<string, unknown>) => {
    frameRef.current?.contentWindow?.postMessage({ source: 'efpi-cms', ...message }, '*');
  }, []);

  // The preview tells us when it is ready, and which element was clicked.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.source !== 'efpi-site') return;
      if (data.type === 'ready') setPreviewReady(true);
      if (data.type === 'select' && typeof data.key === 'string') {
        setSelected(data.key);
        setSearch('');
        // Wait for the filter to clear before scrolling to the field.
        requestAnimationFrame(() => {
          const el = fieldRefs.current[data.key];
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el?.querySelector<HTMLElement>('textarea, input')?.focus();
        });
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const change = (key: string, value: string) => {
    setFields((prev) => prev.map((f) => (f.key === key ? { ...f, value } : f)));
    setSaved(false);
    // Straight to the preview, so the left panel keeps up with the typing.
    toPreview({ type: 'draft', values: { [key]: value } });
  };

  const save = async () => {
    setIsSaving(true);
    setError('');
    try {
      await efpiService.savePage(slug, fields);
      setOriginal(Object.fromEntries(fields.map((f) => [f.key, f.value])));
      setSaved(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Could not save');
    } finally {
      setIsSaving(false);
    }
  };

  const revert = () => {
    const restored = fields.map((f) => ({ ...f, value: original[f.key] ?? f.value }));
    setFields(restored);
    toPreview({ type: 'draft', values: original });
    setSaved(false);
  };

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return fields;
    return fields.filter(
      (f) => f.value.toLowerCase().includes(q) || f.key.toLowerCase().includes(q)
    );
  }, [fields, search]);

  const changedCount = fields.filter(
    (f) => original[f.key] !== undefined && original[f.key] !== f.value
  ).length;

  return (
    <>
      <Breadcrumb />
      <div className="p-4 max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">EFPI website</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Click any text in the preview to edit it, or search below.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={slug}
              onChange={(e) => {
                if (dirty && !window.confirm('Discard unsaved changes on this page?')) return;
                setSlug(e.target.value);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {EFPI_PAGES.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.label}
                </option>
              ))}
            </select>
            {dirty && (
              <span className="text-sm text-amber-600 font-medium">
                {changedCount} unsaved
              </span>
            )}
            {saved && !dirty && <span className="text-sm text-green-600">Saved</span>}
            <Button onClick={revert} disabled={!dirty || isSaving} className="bg-gray-200 !text-gray-700 hover:bg-gray-300">
              Revert
            </Button>
            <Button onClick={save} disabled={!dirty || isSaving} className="bg-blue-600 hover:bg-blue-700">
              {isSaving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-4 items-start">
          {/* Preview */}
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50">
              <span className="text-xs text-gray-500 font-mono">
                {EFPI_SITE_URL}
                {page.path}
              </span>
              <span className={`text-xs ${previewReady ? 'text-green-600' : 'text-gray-400'}`}>
                {previewReady ? 'click text to edit' : 'loading preview…'}
              </span>
            </div>
            <iframe
              ref={frameRef}
              title="EFPI preview"
              // key: a page change must reload the frame, not just re-point it
              key={page.path}
              src={`${EFPI_SITE_URL}${page.path}?cmsEdit=1`}
              className="w-full bg-white"
              style={{ height: 'calc(100vh - 210px)', minHeight: 520 }}
            />
          </div>

          {/* Fields */}
          <div className="rounded-xl border border-gray-200 bg-white flex flex-col" style={{ height: 'calc(100vh - 210px)', minHeight: 520 }}>
            <div className="p-3 border-b border-gray-100">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${fields.length} fields on this page…`}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {isLoading && <p className="text-sm text-gray-500">Loading…</p>}
              {!isLoading && visible.length === 0 && (
                <p className="text-sm text-gray-500">Nothing matches “{search}”.</p>
              )}

              {visible.map((field) => {
                const isSelected = field.key === selected;
                const isChanged = original[field.key] !== undefined && original[field.key] !== field.value;
                return (
                  <div
                    key={field.key}
                    ref={(el) => { fieldRefs.current[field.key] = el; }}
                    className={`rounded-lg border p-2.5 transition-colors ${
                      isSelected ? 'border-blue-500 bg-blue-50/40' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <button
                        type="button"
                        // Clicking the label walks the preview to this element —
                        // the reverse of clicking the preview to reach the field.
                        onClick={() => {
                          setSelected(field.key);
                          toPreview({ type: 'reveal', key: field.key });
                        }}
                        className="text-left text-xs font-medium text-gray-700 hover:text-blue-600 leading-snug"
                        title="Show this on the page"
                      >
                        {labelFor(field)}
                      </button>
                      {isChanged && <span className="text-[10px] text-amber-600 shrink-0">edited</span>}
                    </div>

                    {field.kind === 'text' && (
                      <input
                        value={field.value}
                        onChange={(e) => change(field.key, e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                      />
                    )}

                    {(field.kind === 'longtext' || field.kind === 'html') && (
                      <textarea
                        value={field.value}
                        onChange={(e) => change(field.key, e.target.value)}
                        rows={field.kind === 'html' ? 6 : 3}
                        className={`w-full border border-gray-300 rounded px-2 py-1.5 text-sm ${
                          field.kind === 'html' ? 'font-mono text-xs' : ''
                        }`}
                      />
                    )}

                    {field.kind === 'asset' && (
                      <div className="space-y-1.5">
                        {/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(field.value) && (
                          <img
                            src={field.value.startsWith('http') ? field.value : `${EFPI_SITE_URL}${field.value}`}
                            alt=""
                            className="h-16 w-auto rounded border border-gray-200 bg-gray-50 object-contain"
                          />
                        )}
                        <input
                          value={field.value}
                          onChange={(e) => change(field.key, e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs font-mono"
                        />
                      </div>
                    )}

                    {field.kind === 'html' && (
                      <p className="mt-1 text-[10px] text-gray-400">
                        Contains formatting — keep the tags intact.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
