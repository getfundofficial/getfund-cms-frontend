import { useEffect, useRef, useState } from 'react';
import MediaPickerModal from '../Media/MediaPickerModal';
import { EFPI_SITE_URL, EfpiField, labelFor } from '../../services/efpiService';

/**
 * The panel for the one element currently selected in the preview.
 *
 * It replaced a list of every field on the page. With 168 fields on the home
 * page that list was a haystack: you had to recognise the paragraph you wanted
 * by its opening words, having already found it on the page with your eyes. The
 * page is the index — you already know what you want to change, because you are
 * looking at it. So the panel shows nothing until something is clicked, and then
 * shows only that.
 */
interface FieldInspectorProps {
  field: EfpiField | null;
  isChanged: boolean;
  onChange: (key: string, value: string) => void;
  onRevertField: (key: string) => void;
}

export default function FieldInspector({
  field,
  isChanged,
  onChange,
  onRevertField,
}: FieldInspectorProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  // Focus whatever was just selected, so you can type immediately after
  // clicking the page rather than clicking twice.
  useEffect(() => {
    if (!field) return;
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    const end = el.value.length;
    try {
      el.setSelectionRange(end, end);
    } catch {
      /* number/url inputs disallow selection ranges */
    }
  }, [field?.key]);

  if (!field) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-8 text-gray-400">
        <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
        <p className="text-sm font-medium text-gray-500">Click anything on the page</p>
        <p className="text-xs mt-1.5 leading-relaxed">
          Text becomes editable here. Images open the media library.
        </p>
      </div>
    );
  }

  const isImage = field.kind === 'asset' && /\.(png|jpe?g|gif|svg|webp|avif)$/i.test(field.value);
  const src = field.value.startsWith('http') ? field.value : `${EFPI_SITE_URL}${field.value}`;

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-gray-400">
              {field.kind === 'asset' ? 'Image' : field.kind === 'html' ? 'Formatted text' : 'Text'}
            </p>
            <p className="text-sm font-medium text-gray-800 truncate">{labelFor(field)}</p>
          </div>
          {isChanged && (
            <button
              type="button"
              onClick={() => onRevertField(field.key)}
              className="text-xs text-gray-500 hover:text-red-600 shrink-0"
              title="Undo changes to this item"
            >
              Undo
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isImage && (
          <>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 flex items-center justify-center">
              <img src={src} alt="" className="max-h-44 w-auto object-contain" />
            </div>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="w-full rounded-lg bg-blue-600 text-white text-sm font-medium py-2.5 hover:bg-blue-700"
            >
              Replace image
            </button>
            <details className="text-xs text-gray-500">
              <summary className="cursor-pointer select-none">Or paste a path</summary>
              <input
                value={field.value}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="mt-2 w-full border border-gray-300 rounded px-2 py-1.5 font-mono text-xs"
              />
            </details>
          </>
        )}

        {!isImage && field.kind === 'asset' && (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={field.value}
            onChange={(e) => onChange(field.key, e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-xs"
          />
        )}

        {field.kind === 'text' && (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={field.value}
            onChange={(e) => onChange(field.key, e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm leading-relaxed"
          />
        )}

        {field.kind === 'longtext' && (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={field.value}
            onChange={(e) => onChange(field.key, e.target.value)}
            rows={7}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm leading-relaxed"
          />
        )}

        {field.kind === 'html' && (
          <>
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={field.value}
              onChange={(e) => onChange(field.key, e.target.value)}
              rows={10}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-xs leading-relaxed"
            />
            <p className="text-xs text-amber-600">
              This one contains formatting tags. Edit the words between them and leave the
              &lt;tags&gt; alone, or the layout will break.
            </p>
          </>
        )}

        <p className="text-[10px] text-gray-300 font-mono pt-1">{field.key}</p>
      </div>

      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(media: any) => {
          // Store a site-relative path where possible: the EFPI site serves its
          // own assets, and an absolute CMS URL would tie its pages to this host.
          const url: string = media?.url || media?.file_path || '';
          onChange(field.key, url);
          setPickerOpen(false);
        }}
        allowUpload
        mediaType="image"
      />
    </div>
  );
}
