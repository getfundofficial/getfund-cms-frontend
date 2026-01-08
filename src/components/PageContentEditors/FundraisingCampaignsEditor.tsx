import React from 'react';
import { Input } from '../Common/Input';
import { BannerBackgroundEditor } from './BannerBackgroundEditor';
import { BannerBackground } from '../../types/bannerBackground';

interface FundraisingCampaignsContent {
  // Hero Section
  heroTitle?: string;
  heroSubtitle?: string;
  bannerBackground?: BannerBackground;

  // Featured Campaigns Section
  campaignsSectionTitle?: string;
  campaignsSectionSubtitle?: string;
  viewAllButtonText?: string;
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

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h3>
        <div className="space-y-6">
          <Input
            type="text"
            label="Hero Title"
            placeholder="Support Education Through Giving"
            value={content.heroTitle || ''}
            onChange={(e) => updateContent({ heroTitle: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hero Subtitle
            </label>
            <textarea
              placeholder="Your donations directly fund scholarships, infrastructure, and educational programs across Ghana"
              value={content.heroSubtitle || ''}
              onChange={(e) => updateContent({ heroSubtitle: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Banner Background Editor */}
          <BannerBackgroundEditor
            value={content.bannerBackground || {}}
            onChange={(bannerBackground) => updateContent({ bannerBackground })}
            previewTitle={content.heroTitle || 'Support Education Through Giving'}
            previewSubtitle={content.heroSubtitle || 'Your donations directly fund scholarships...'}
          />
        </div>
      </div>

      {/* Featured Campaigns Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Campaigns Section</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Section Title"
            placeholder="Featured Fundraising Campaigns"
            value={content.campaignsSectionTitle || ''}
            onChange={(e) => updateContent({ campaignsSectionTitle: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Subtitle
            </label>
            <textarea
              placeholder="Join thousands of Ghanaians making a difference through our targeted fundraising campaigns..."
              value={content.campaignsSectionSubtitle || ''}
              onChange={(e) => updateContent({ campaignsSectionSubtitle: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
            This only controls the section title and description.
          </p>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> The Campaign Cards display data from the Campaigns section.
          This form controls the page text content and hero banner appearance.
        </p>
      </div>
    </div>
  );
};
