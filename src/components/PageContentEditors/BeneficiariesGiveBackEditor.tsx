import React from 'react';
import { Input } from '../Common/Input';

interface BeneficiariesGiveBackContent {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
  };
  mainContent: {
    heading: string;
    paragraph1: string;
    paragraph2: string;
    ctaButtonText: string;
  };
  featuredImage?: {
    url: string;
    alt: string;
    caption?: string;
  };
}

interface BeneficiariesGiveBackEditorProps {
  content: BeneficiariesGiveBackContent;
  onChange: (content: BeneficiariesGiveBackContent) => void;
}

export const BeneficiariesGiveBackEditor: React.FC<BeneficiariesGiveBackEditorProps> = ({
  content,
  onChange,
}) => {
  const handleChange = (section: keyof BeneficiariesGiveBackContent, field: string, value: string) => {
    onChange({
      ...content,
      [section]: {
        ...content[section],
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
    <div className="space-y-8">
      {/* Meta Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Meta Information</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Page Title (Browser Tab)"
            placeholder="GETFund Beneficiaries - Give Back | GETFund"
            value={content.meta?.title || ''}
            onChange={(e) => handleChange('meta', 'title', e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description (SEO)
            </label>
            <textarea
              placeholder="To All GETFund Beneficiaries – Give Back, Build Forward"
              value={content.meta?.description || ''}
              onChange={(e) => handleChange('meta', 'description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Shown in search results (150-160 characters recommended)</p>
          </div>
        </div>
      </div>

      {/* Page Title Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Title</h3>
        <div className="space-y-6">
          <Input
            type="text"
            label="Title"
            placeholder="GETFund Beneficiaries"
            value={content.hero?.title || ''}
            onChange={(e) => handleChange('hero', 'title', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Featured Image Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image (Optional)</h3>
        <p className="text-sm text-gray-600 mb-4">
          Add an optional featured image to display below the page title.
        </p>
        <div className="space-y-4">
          <Input
            type="text"
            label="Image URL"
            placeholder="https://example.com/image.jpg or /uploads/beneficiaries.jpg"
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

      {/* Main Content */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Main Content Section</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Section Heading"
            placeholder="To All GETFund Beneficiaries – Give Back, Build Forward"
            value={content.mainContent?.heading || ''}
            onChange={(e) => handleChange('mainContent', 'heading', e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paragraph 1
            </label>
            <textarea
              placeholder="If GETFund played a part in your educational journey..."
              value={content.mainContent?.paragraph1 || ''}
              onChange={(e) => handleChange('mainContent', 'paragraph1', e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.mainContent?.paragraph1?.length || 0} characters
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paragraph 2
            </label>
            <textarea
              placeholder="Your contribution, no matter the amount..."
              value={content.mainContent?.paragraph2 || ''}
              onChange={(e) => handleChange('mainContent', 'paragraph2', e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.mainContent?.paragraph2?.length || 0} characters
            </p>
          </div>
          <Input
            type="text"
            label="CTA Button Text"
            placeholder="Make a Donation"
            value={content.mainContent?.ctaButtonText || ''}
            onChange={(e) => handleChange('mainContent', 'ctaButtonText', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> This is the simplest fundraising page with just hero and main content sections. The CTA button links to the Ways to Donate page.
        </p>
      </div>
    </div>
  );
};
