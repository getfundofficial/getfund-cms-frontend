import React, { useEffect, useState } from 'react';
import { pageService, Page } from '../../services/pageService';

interface PagePermissionSelectorProps {
  selectedPageIds: string[];
  onChange: (pageIds: string[]) => void;
  disabled?: boolean;
}

export const PagePermissionSelector: React.FC<PagePermissionSelectorProps> = ({
  selectedPageIds,
  onChange,
  disabled = false,
}) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      setError(null);
      const allPages = await pageService.getAll();
      setPages(allPages);
    } catch (err: any) {
      setError('Failed to load pages');
      console.error('Error loading pages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePage = (pageId: string) => {
    if (disabled) return;

    if (selectedPageIds.includes(pageId)) {
      onChange(selectedPageIds.filter(id => id !== pageId));
    } else {
      onChange([...selectedPageIds, pageId]);
    }
  };

  const handleSelectAll = () => {
    if (disabled) return;
    onChange(pages.map(p => p.id));
  };

  const handleDeselectAll = () => {
    if (disabled) return;
    onChange([]);
  };

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allSelected = pages.length > 0 && selectedPageIds.length === pages.length;
  const someSelected = selectedPageIds.length > 0 && selectedPageIds.length < pages.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-sm text-gray-500">Loading pages...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-red-600">{error}</p>
        <button
          type="button"
          onClick={loadPages}
          className="mt-2 text-sm text-primary-600 hover:text-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">No pages available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h4 className="font-semibold text-gray-800">Page Edit Permissions</h4>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {selectedPageIds.length}/{pages.length}
          </span>
        </div>
      </div>

      {/* Search input */}
      {pages.length > 5 && (
        <input
          type="text"
          placeholder="Search pages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      )}

      {/* Select All / Deselect All */}
      <div className="flex items-center gap-4 pb-2 border-b border-gray-200">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected;
            }}
            onChange={() => allSelected ? handleDeselectAll() : handleSelectAll()}
            disabled={disabled}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-600">
            {allSelected ? 'Deselect All' : 'Select All'}
          </span>
        </label>
      </div>

      {/* Pages list */}
      <div className="max-h-60 overflow-y-auto space-y-1">
        {filteredPages.map((page) => {
          const isSelected = selectedPageIds.includes(page.id);
          return (
            <label
              key={page.id}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-primary-50 border-primary-300 text-primary-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleTogglePage(page.id)}
                disabled={disabled}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium block truncate">{page.title}</span>
                <span className="text-xs text-gray-500 block truncate">/{page.slug}</span>
              </div>
              {page.is_active ? (
                <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Active</span>
              ) : (
                <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Draft</span>
              )}
            </label>
          );
        })}
        {filteredPages.length === 0 && searchTerm && (
          <p className="text-sm text-gray-500 text-center py-4">No pages match "{searchTerm}"</p>
        )}
      </div>
    </div>
  );
};
