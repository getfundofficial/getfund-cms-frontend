import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import { Button } from '../components/Common/Button';
import FieldInspector from '../components/Efpi/FieldInspector';
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
      // The inspector focuses its own control when the selection changes,
      // so selecting is all that needs doing here.
      if (data.type === 'select' && typeof data.key === 'string') setSelected(data.key);
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
              Click any text or image on the page to change it.
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

          {/* Selected element */}
          <div
            className="rounded-xl border border-gray-200 bg-white flex flex-col overflow-hidden"
            style={{ height: 'calc(100vh - 210px)', minHeight: 520 }}
          >
            <div className="flex-1 min-h-0">
              {isLoading ? (
                <p className="p-4 text-sm text-gray-500">Loading…</p>
              ) : (
                <FieldInspector
                  field={fields.find((f) => f.key === selected) ?? null}
                  isChanged={
                    !!selected &&
                    original[selected] !== undefined &&
                    original[selected] !== fields.find((f) => f.key === selected)?.value
                  }
                  onChange={change}
                  onRevertField={(key) => {
                    const was = original[key];
                    if (was === undefined) return;
                    change(key, was);
                  }}
                />
              )}
            </div>

            {/*
              A way in for the handful of items the preview cannot locate —
              values that render into an attribute, or text that appears twice.
              Collapsed, because it is the exception, not the way to work.
            */}
            <details className="border-t border-gray-100 shrink-0">
              <summary className="px-4 py-2.5 text-xs text-gray-500 cursor-pointer select-none hover:bg-gray-50">
                Can’t click it? Search all {fields.length} items
              </summary>
              <div className="px-3 pb-3">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by its words…"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2"
                />
                <div className="max-h-52 overflow-y-auto space-y-1">
                  {visible.slice(0, 40).map((field) => (
                    <button
                      key={field.key}
                      type="button"
                      onClick={() => {
                        setSelected(field.key);
                        toPreview({ type: 'reveal', key: field.key });
                      }}
                      className={`block w-full text-left text-xs px-2 py-1.5 rounded hover:bg-gray-100 ${
                        field.key === selected ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                      }`}
                    >
                      {labelFor(field)}
                    </button>
                  ))}
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </>
  );
}
