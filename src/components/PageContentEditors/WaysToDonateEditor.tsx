import React from 'react';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';

interface DonationOption {
  title: string;
  description: string;
  buttonText: string;
}

interface WaysToDonateContent {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  donationOptions: DonationOption[];
  otherWays: {
    heading: string;
    cheque: {
      title: string;
      description: string;
    };
    mobileMoney: {
      title: string;
      description: string;
    };
  };
  giveWithConfidence: {
    heading: string;
    description: string;
  };
}

interface WaysToDonateEditorProps {
  content: WaysToDonateContent;
  onChange: (content: WaysToDonateContent) => void;
}

export const WaysToDonateEditor: React.FC<WaysToDonateEditorProps> = ({
  content,
  onChange,
}) => {
  const handleChange = (section: keyof WaysToDonateContent, field: string, value: any) => {
    onChange({
      ...content,
      [section]: {
        ...content[section],
        [field]: value,
      },
    });
  };

  const handleNestedChange = (section: keyof WaysToDonateContent, subsection: string, field: string, value: string) => {
    onChange({
      ...content,
      [section]: {
        ...content[section],
        [subsection]: {
          ...(content[section] as any)[subsection],
          [field]: value,
        },
      },
    });
  };

  const handleDonationOptionChange = (index: number, field: keyof DonationOption, value: string) => {
    const newOptions = [...(content.donationOptions || [])];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onChange({ ...content, donationOptions: newOptions });
  };

  const addDonationOption = () => {
    const options = content.donationOptions || [];
    const newOption: DonationOption = {
      title: '',
      description: '',
      buttonText: '',
    };
    onChange({ ...content, donationOptions: [...options, newOption] });
  };

  const removeDonationOption = (index: number) => {
    const newOptions = [...(content.donationOptions || [])];
    newOptions.splice(index, 1);
    onChange({ ...content, donationOptions: newOptions });
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
            placeholder="Ways to Donate | GETFund"
            value={content.meta?.title || ''}
            onChange={(e) => handleChange('meta', 'title', e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description (SEO)
            </label>
            <textarea
              placeholder="Investing in Education. Building Ghana's Tomorrow."
              value={content.meta?.description || ''}
              onChange={(e) => handleChange('meta', 'description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
            placeholder="Investing in Education. Building Ghana's Tomorrow."
            value={content.hero?.title || ''}
            onChange={(e) => handleChange('hero', 'title', e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hero Subtitle
            </label>
            <textarea
              placeholder="The Ghana Education Trust Fund (GETFund) is committed to advancing education..."
              value={content.hero?.subtitle || ''}
              onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Donation Options */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Options</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Options ({(content.donationOptions || []).length})
            </label>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={addDonationOption}
            >
              + Add Option
            </Button>
          </div>

          {(content.donationOptions || []).map((option, index) => (
            <div key={index} className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">Option {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeDonationOption(index)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              </div>

              <Input
                type="text"
                label="Title"
                placeholder="Classroom construction support"
                value={option.title}
                onChange={(e) => handleDonationOptionChange(index, 'title', e.target.value)}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Imagine children clustered under a leaking roof..."
                  value={option.description}
                  onChange={(e) => handleDonationOptionChange(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {option.description?.length || 0} characters
                </p>
              </div>

              <Input
                type="text"
                label="Button Text"
                placeholder="Build a Classroom"
                value={option.buttonText}
                onChange={(e) => handleDonationOptionChange(index, 'buttonText', e.target.value)}
                required
              />
            </div>
          ))}

          {(content.donationOptions || []).length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">No donation options added yet. Click "Add Option" to create one.</p>
            </div>
          )}
        </div>
      </div>

      {/* Other Ways of Donating */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Ways of Donating</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Section Heading"
            placeholder="Other ways of donating"
            value={content.otherWays?.heading || ''}
            onChange={(e) => handleChange('otherWays', 'heading', e.target.value)}
            required
          />

          {/* Cheque */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-900">Send a Cheque</h4>
            <Input
              type="text"
              label="Card Title"
              placeholder="Send a Cheque"
              value={content.otherWays?.cheque?.title || ''}
              onChange={(e) => handleNestedChange('otherWays', 'cheque', 'title', e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="(mailing instructions to be included)"
                value={content.otherWays?.cheque?.description || ''}
                onChange={(e) => handleNestedChange('otherWays', 'cheque', 'description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Mobile Money */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-900">Mobile Money</h4>
            <Input
              type="text"
              label="Card Title"
              placeholder="Donate with Mobile Money"
              value={content.otherWays?.mobileMoney?.title || ''}
              onChange={(e) => handleNestedChange('otherWays', 'mobileMoney', 'title', e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="(shortcode, networks, etc)"
                value={content.otherWays?.mobileMoney?.description || ''}
                onChange={(e) => handleNestedChange('otherWays', 'mobileMoney', 'description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Give with Confidence */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Give with Confidence Section</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Section Heading"
            placeholder="Give with Confidence"
            value={content.giveWithConfidence?.heading || ''}
            onChange={(e) => handleChange('giveWithConfidence', 'heading', e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Your trust is our priority. GETFund is committed to the highest standards..."
              value={content.giveWithConfidence?.description || ''}
              onChange={(e) => handleChange('giveWithConfidence', 'description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.giveWithConfidence?.description?.length || 0} characters
            </p>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> The Donation Interface, Impact Stats, and Contact Section components are hardcoded and managed by developers. This form only controls the text content and donation option cards.
        </p>
      </div>
    </div>
  );
};
