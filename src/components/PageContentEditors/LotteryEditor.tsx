import React from 'react';
import { Input } from '../Common/Input';
import { BannerBackgroundEditor } from './BannerBackgroundEditor';
import { BannerBackground } from '../../types/bannerBackground';

interface LotteryContent {
  bannerBackground?: BannerBackground;
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

      {/* Hero Section */}
      <div className="border border-gray-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Banner</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Title"
            placeholder="GETFund Scholarship Lottery"
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
          <BannerBackgroundEditor
            value={content.bannerBackground || {}}
            onChange={(bannerBackground) => onChange({ ...content, bannerBackground })}
            previewTitle={content.hero?.title || 'GETFund Scholarship Lottery'}
            previewSubtitle={content.hero?.subtitle || ''}
          />
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
          This form controls the page banner, intro text, and SEO settings.
        </p>
      </div>
    </div>
  );
};
