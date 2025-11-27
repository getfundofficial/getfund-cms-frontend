import React from 'react';
import { Input } from '../Common/Input';

interface NewsUpdatesContent {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  sidebar: {
    searchLabel: string;
    searchPlaceholder: string;
    recentPostsLabel: string;
    categoriesLabel: string;
  };
  emptyState: {
    noArticlesMessage: string;
  };
}

interface NewsUpdatesEditorProps {
  content: NewsUpdatesContent;
  onChange: (content: NewsUpdatesContent) => void;
}

export const NewsUpdatesEditor: React.FC<NewsUpdatesEditorProps> = ({
  content,
  onChange,
}) => {
  const handleChange = (section: keyof NewsUpdatesContent, field: string, value: string) => {
    onChange({
      ...content,
      [section]: {
        ...content[section],
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Meta Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Meta Information</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Page Title (Browser Tab)"
            placeholder="News & Updates | GETFund"
            value={content.meta?.title || ''}
            onChange={(e) => handleChange('meta', 'title', e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description (SEO)
            </label>
            <textarea
              placeholder="Stay updated with the latest news, announcements, and stories from GETFund's work..."
              value={content.meta?.description || ''}
              onChange={(e) => handleChange('meta', 'description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Shown in search results (150-160 characters recommended) - {content.meta?.description?.length || 0} characters
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Hero Title"
            placeholder="News & Updates"
            value={content.hero?.title || ''}
            onChange={(e) => handleChange('hero', 'title', e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hero Subtitle
            </label>
            <textarea
              placeholder="Transforming Ghana's educational landscape through strategic investments and partnerships"
              value={content.hero?.subtitle || ''}
              onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.hero?.subtitle?.length || 0} characters
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar Labels */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sidebar Labels</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Search Section Label"
            placeholder="Search"
            value={content.sidebar?.searchLabel || ''}
            onChange={(e) => handleChange('sidebar', 'searchLabel', e.target.value)}
            required
          />
          <Input
            type="text"
            label="Search Input Placeholder"
            placeholder="Search articles..."
            value={content.sidebar?.searchPlaceholder || ''}
            onChange={(e) => handleChange('sidebar', 'searchPlaceholder', e.target.value)}
            required
          />
          <Input
            type="text"
            label="Recent Posts Section Label"
            placeholder="Recent Posts"
            value={content.sidebar?.recentPostsLabel || ''}
            onChange={(e) => handleChange('sidebar', 'recentPostsLabel', e.target.value)}
            required
          />
          <Input
            type="text"
            label="Categories Section Label"
            placeholder="Categories"
            value={content.sidebar?.categoriesLabel || ''}
            onChange={(e) => handleChange('sidebar', 'categoriesLabel', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Empty State */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Empty State Messages</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              No Articles Found Message
            </label>
            <textarea
              placeholder="No articles found matching your criteria."
              value={content.emptyState?.noArticlesMessage || ''}
              onChange={(e) => handleChange('emptyState', 'noArticlesMessage', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Shown when search/filter returns no results - {content.emptyState?.noArticlesMessage?.length || 0} characters
            </p>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700 mb-2">
          <strong>Note:</strong> This editor manages the static text elements of the News & Updates landing page.
        </p>
        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
          <li>Individual news articles are managed through the News Articles section in the CMS</li>
          <li>Categories are automatically generated from article tags</li>
          <li>Search and filtering functionality is handled by the page component</li>
          <li>This editor only controls labels, headings, and static text displayed on the page</li>
        </ul>
      </div>
    </div>
  );
};
