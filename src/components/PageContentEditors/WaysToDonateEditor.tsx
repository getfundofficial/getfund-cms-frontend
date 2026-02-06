import React, { useState } from 'react';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';
import MediaPickerModal from '../Media/MediaPickerModal';
import mediaService, { Media } from '../../services/mediaService';

interface PresetAmount {
  value: number;
  label: string;
}

interface DonationOption {
  title: string;
  description: string;
  buttonText: string;
  image?: string;
  presetAmounts?: PresetAmount[];
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
  impactVisualized: {
    totalRaised: string;
    totalDonations: string;
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

// Media Image Picker Component - Uses the site gallery
const MediaImagePicker: React.FC<{
  value: string;
  onChange: (url: string) => void;
  label: string;
}> = ({ value, onChange, label }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleMediaSelect = (media: Media) => {
    const fullUrl = mediaService.getFullUrl(media.url);
    console.log('[MediaImagePicker] Media selected:', {
      mediaId: media.id,
      originalUrl: media.url,
      fullUrl
    });
    onChange(fullUrl);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {value && (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {value ? 'Change from Gallery' : 'Select from Gallery'}
        </button>
      </div>

      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleMediaSelect}
        allowUpload={true}
        mediaType="image"
      />
    </div>
  );
};

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

  const handlePresetAmountChange = (optionIndex: number, presetIndex: number, field: 'value' | 'label', value: string | number) => {
    const newOptions = [...(content.donationOptions || [])];
    const presetAmounts = [...(newOptions[optionIndex].presetAmounts || [])];

    // If it's a value field and a string, remove commas before parsing
    if (field === 'value' && typeof value === 'string') {
      const cleanValue = value.replace(/,/g, '');
      value = parseFloat(cleanValue) || 0;
    }

    presetAmounts[presetIndex] = { ...presetAmounts[presetIndex], [field]: value };
    newOptions[optionIndex] = { ...newOptions[optionIndex], presetAmounts };
    onChange({ ...content, donationOptions: newOptions });
  };

  const formatNumberWithCommas = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const initializePresetAmounts = (optionIndex: number) => {
    const newOptions = [...(content.donationOptions || [])];
    newOptions[optionIndex] = {
      ...newOptions[optionIndex],
      presetAmounts: [
        { value: 50, label: 'Small contribution' },
        { value: 100, label: 'Medium contribution' },
        { value: 250, label: 'Large contribution' },
      ],
    };
    onChange({ ...content, donationOptions: newOptions });
  };

  const addDonationOption = () => {
    const options = content.donationOptions || [];
    const newOption: DonationOption = {
      title: '',
      description: '',
      buttonText: '',
      image: '',
      presetAmounts: [
        { value: 50, label: 'Small contribution' },
        { value: 100, label: 'Medium contribution' },
        { value: 250, label: 'Large contribution' },
      ],
    };
    onChange({ ...content, donationOptions: [...options, newOption] });
  };

  const handleDonationImageChange = (index: number, imageUrl: string) => {
    console.log('[WaysToDonateEditor] handleDonationImageChange called:', { index, imageUrl });
    const newOptions = [...(content.donationOptions || [])];
    newOptions[index] = { ...newOptions[index], image: imageUrl };
    console.log('[WaysToDonateEditor] Updated option:', newOptions[index]);
    console.log('[WaysToDonateEditor] All options:', newOptions);
    onChange({ ...content, donationOptions: newOptions });
  };

  const removeDonationOption = (index: number) => {
    const newOptions = [...(content.donationOptions || [])];
    newOptions.splice(index, 1);
    onChange({ ...content, donationOptions: newOptions });
  };

  const moveDonationOption = (index: number, direction: 'up' | 'down') => {
    const newOptions = [...(content.donationOptions || [])];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newOptions.length) return;

    [newOptions[index], newOptions[newIndex]] = [newOptions[newIndex], newOptions[index]];
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Header</h3>
        <p className="text-sm text-gray-500 mb-4">Configure the title and description that appears at the top of the Ways to Donate page</p>

        {/* Live Preview */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Preview</h4>
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {content.hero?.title || "Investing in Education. Building Ghana's Tomorrow."}
            </h2>
            <div className="w-16 h-1 mb-3" style={{ backgroundColor: '#2a3f75' }} />
            <p className="text-gray-600">
              {content.hero?.subtitle || 'The Ghana Education Trust Fund (GETFund) is committed to advancing education...'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
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

      {/* Impact Visualized Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Visualized Section</h3>
        <p className="text-sm text-gray-600 mb-4">
          These values appear at the top of the Ways to Donate page showing donation statistics.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            label="Total Raised"
            placeholder="GH₵ 2,500,000"
            value={content.impactVisualized?.totalRaised || ''}
            onChange={(e) => handleChange('impactVisualized', 'totalRaised', e.target.value)}
            helperText="Display format: GH₵ X,XXX,XXX"
          />
          <Input
            type="text"
            label="Total Donations"
            placeholder="1,234"
            value={content.impactVisualized?.totalDonations || ''}
            onChange={(e) => handleChange('impactVisualized', 'totalDonations', e.target.value)}
            helperText="Number of donations received"
          />
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
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">Option {index + 1}</h4>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveDonationOption(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDonationOption(index, 'down')}
                      disabled={index === (content.donationOptions || []).length - 1}
                      className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      ↓
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeDonationOption(index)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              </div>

              {/* Slide Image */}
              <MediaImagePicker
                value={option.image || ''}
                onChange={(url) => handleDonationImageChange(index, url)}
                label="Slide Image"
              />
              <p className="text-xs text-gray-500 -mt-1">
                Select from the media gallery. This image will be displayed as a full-width slide background.
              </p>

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

              {/* Preset Amounts Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-sm font-semibold text-gray-900">Quick Amount Presets (3)</h5>
                  {!option.presetAmounts && (
                    <button
                      type="button"
                      onClick={() => initializePresetAmounts(index)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      + Add Presets
                    </button>
                  )}
                </div>

                {option.presetAmounts && option.presetAmounts.length > 0 ? (
                  <div className="space-y-3">
                    {option.presetAmounts.map((preset, presetIndex) => (
                      <div key={presetIndex} className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-gray-500">Preset {presetIndex + 1}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Amount (GH₵)
                            </label>
                            <input
                              type="text"
                              placeholder="100"
                              value={formatNumberWithCommas(preset.value)}
                              onChange={(e) => handlePresetAmountChange(index, presetIndex, 'value', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Label/Description
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., Buy 1 year supply"
                              value={preset.label}
                              onChange={(e) => handlePresetAmountChange(index, presetIndex, 'label', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-gray-500 mt-2">
                      💡 These quick amounts will appear as preset buttons in the donation modal
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-xs text-gray-500">No preset amounts configured. Click "Add Presets" to create them.</p>
                  </div>
                )}
              </div>
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
          <strong>Note:</strong> The Donation Interface, Pledge to Support form, and Contact Section components are hardcoded and managed by developers. The Impact Visualized values (Total Raised and Total Donations) can be edited above. This form controls the text content, donation option cards, and impact statistics display.
        </p>
      </div>
    </div>
  );
};
