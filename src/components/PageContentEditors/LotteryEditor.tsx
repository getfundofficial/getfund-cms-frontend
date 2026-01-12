import React from 'react';
import { Input } from '../Common/Input';

interface LotteryContent {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  intro: {
    paragraph: string;
  };
  featuredImage?: {
    url: string;
    alt: string;
    caption?: string;
  };
}

interface LotteryEditorProps {
  content: LotteryContent;
  onChange: (content: LotteryContent) => void;
}

export const LotteryEditor: React.FC<LotteryEditorProps> = ({
  content,
  onChange,
}) => {
  const handleChange = (section: keyof LotteryContent, field: string, value: string) => {
    onChange({
      ...content,
      [section]: {
        ...(content[section] as Record<string, unknown>),
        [field]: value,
      },
    });
  };

  const handleFeaturedImageChange = (field: string, value: string) => {
    onChange({
      ...content,
      featuredImage: {
        ...content.featuredImage,
        url: content.featuredImage?.url || '',
        alt: content.featuredImage?.alt || '',
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Meta Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO & Meta</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Page Title"
            placeholder="Scholarship Lottery | GETFund"
            value={content.meta?.title || ''}
            onChange={(e) => handleChange('meta', 'title', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea
              placeholder="Enter the GETFund Scholarship Lottery - every donation gives you a chance to win..."
              value={content.meta?.description || ''}
              onChange={(e) => handleChange('meta', 'description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Page Title Section */}
      <div className="border border-gray-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Title</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Title"
            placeholder="Scholarship Lottery"
            value={content.hero?.title || ''}
            onChange={(e) => handleChange('hero', 'title', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <textarea
              placeholder="Every contribution gives you a chance to win full scholarships..."
              value={content.hero?.subtitle || ''}
              onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Featured Image Section */}
      <div className="border border-gray-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image (Optional)</h3>
        <p className="text-sm text-gray-600 mb-4">
          Add an optional featured image to display below the page title.
        </p>
        <div className="space-y-4">
          <Input
            type="text"
            label="Image URL"
            placeholder="https://example.com/image.jpg or /uploads/lottery-banner.jpg"
            value={content.featuredImage?.url || ''}
            onChange={(e) => handleFeaturedImageChange('url', e.target.value)}
          />
          <Input
            type="text"
            label="Alt Text"
            placeholder="Description of the image for accessibility"
            value={content.featuredImage?.alt || ''}
            onChange={(e) => handleFeaturedImageChange('alt', e.target.value)}
          />
          <Input
            type="text"
            label="Caption (Optional)"
            placeholder="Image caption displayed below the image"
            value={content.featuredImage?.caption || ''}
            onChange={(e) => handleFeaturedImageChange('caption', e.target.value)}
          />
          {content.featuredImage?.url && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div className="rounded-lg overflow-hidden border border-gray-200 max-w-md">
                <img
                  src={content.featuredImage.url}
                  alt={content.featuredImage.alt || 'Featured image preview'}
                  className="w-full h-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Introduction */}
      <div className="border border-gray-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Introduction</h3>
        <textarea
          placeholder="Every contribution to our campaigns automatically enters you into our monthly scholarship lottery..."
          value={content.intro?.paragraph || ''}
          onChange={(e) => handleChange('intro', 'paragraph', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Help Text */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> The lottery prizes, countdown timer, and "How It Works" steps are managed in the Lottery Settings section.
          This form controls the page title, featured image, intro text, and SEO settings.
        </p>
      </div>
    </div>
  );
};
