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

      {/* Hero Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h3>
        <Input
          type="text"
          label="Hero Title"
          placeholder="GETFund Beneficiaries"
          value={content.hero?.title || ''}
          onChange={(e) => handleChange('hero', 'title', e.target.value)}
          required
        />
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
