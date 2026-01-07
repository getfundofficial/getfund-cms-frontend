import React, { useState, useEffect, useRef } from 'react';
import { pageService, Page } from '../../services/pageService';

interface LinkInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Static routes that are always available
const STATIC_ROUTES = [
  { path: '/scholarship-apply', label: 'Scholarship Application' },
  { path: '/news', label: 'News' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
  { path: '/donate', label: 'Donate' },
  { path: '/lottery', label: 'Lottery' },
  { path: '/campaigns', label: 'Campaigns' },
];

export const LinkInput: React.FC<LinkInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '/page-slug',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pages, setPages] = useState<Page[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<{ path: string; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch pages on mount
  useEffect(() => {
    const fetchPages = async () => {
      try {
        setIsLoading(true);
        const fetchedPages = await pageService.getAll();
        setPages(fetchedPages);
      } catch {
        setPages([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPages();
  }, []);

  // Filter options based on input
  useEffect(() => {
    // Don't show dropdown for external URLs or empty value
    if (!value || value.startsWith('http://') || value.startsWith('https://') || value.startsWith('mailto:')) {
      setFilteredOptions([]);
      setIsOpen(false);
      return;
    }

    // Only show dropdown when typing "/" for internal routes
    if (!value.startsWith('/')) {
      setFilteredOptions([]);
      setIsOpen(false);
      return;
    }

    const searchTerm = value.toLowerCase();

    // Combine static routes and dynamic pages
    const pageRoutes = pages.map((page) => ({
      path: `/${page.slug}`,
      label: page.title,
    }));

    const allRoutes = [...STATIC_ROUTES, ...pageRoutes];

    // Filter and dedupe
    const seen = new Set<string>();
    const filtered = allRoutes.filter((route) => {
      if (seen.has(route.path)) return false;
      seen.add(route.path);
      return route.path.toLowerCase().includes(searchTerm) ||
             route.label.toLowerCase().includes(searchTerm.replace('/', ''));
    });

    setFilteredOptions(filtered);
    setIsOpen(filtered.length > 0 && value.length > 0);
  }, [value, pages]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (path: string) => {
    onChange(path);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleFocus = () => {
    if (value.startsWith('/') && filteredOptions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <div className="px-3 py-2 text-gray-500 text-sm">Loading pages...</div>
          ) : filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.path}
                type="button"
                onClick={() => handleSelect(option.path)}
                className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex justify-between items-center"
              >
                <span className="font-mono text-sm text-blue-600">{option.path}</span>
                <span className="text-xs text-gray-500 ml-2">{option.label}</span>
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500 text-sm">No matching routes</div>
          )}
        </div>
      )}

      <p className="mt-1 text-xs text-gray-500">
        Type "/" for page suggestions, or enter any URL (e.g., https://example.com)
      </p>
    </div>
  );
};
