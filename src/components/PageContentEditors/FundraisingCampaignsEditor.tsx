import React from 'react';
import { Input } from '../Common/Input';

interface FundraisingCampaignsContent {
  // Hero Section
  heroTitle?: string;

  // Featured Campaigns Section
  campaignsSectionTitle?: string;
  campaignsSectionSubtitle?: string;
  viewAllButtonText?: string;

  // Featured Image
  featuredImage?: {
    url: string;
    alt: string;
    caption?: string;
  };
}

interface FundraisingCampaignsEditorProps {
  content: FundraisingCampaignsContent;
  onChange: (content: FundraisingCampaignsContent) => void;
}

export const FundraisingCampaignsEditor: React.FC<FundraisingCampaignsEditorProps> = ({
  content,
  onChange,
}) => {
  const updateContent = (updates: Partial<FundraisingCampaignsContent>) => {
    onChange({ ...content, ...updates });
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
      {/* Page Title Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Title</h3>
        <div className="space-y-6">
          <Input
            type="text"
            label="Title"
            placeholder="Fundraising Campaigns"
            value={content.heroTitle || ''}
            onChange={(e) => updateContent({ heroTitle: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Join thousands of Ghanaians making a difference through our targeted fundraising campaigns..."
              value={content.campaignsSectionSubtitle || ''}
              onChange={(e) => updateContent({ campaignsSectionSubtitle: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              This description appears below the page title.
            </p>
          </div>
        </div>
      </div>

      {/* Button Text */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Actions</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="View All Button Text"
            placeholder="View All Campaigns"
            value={content.viewAllButtonText || ''}
            onChange={(e) => updateContent({ viewAllButtonText: e.target.value })}
          />
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> The actual campaigns are managed separately in the Campaigns section.
            This controls the page title, description, and button text.
          </p>
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
            placeholder="https://example.com/image.jpg or /uploads/campaigns-banner.jpg"
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

      {/* Help Text */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> The Campaign Cards display data from the Campaigns section.
          This form controls the page title and description text.
        </p>
      </div>
    </div>
  );
};
