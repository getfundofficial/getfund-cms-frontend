import React, { useState } from 'react';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';
import MediaPickerModal from '../Media/MediaPickerModal';
import mediaService, { Media } from '../../services/mediaService';

interface PartnershipBenefit {
  title: string;
  description: string;
}

interface PartnershipsContent {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
  };
  intro: {
    paragraph: string;
    image?: string;
  };
  waysToPartner: {
    heading: string;
    ways: string[];
  };
  whySupport: {
    heading: string;
    benefits: PartnershipBenefit[];
  };
  ourPartners: {
    heading: string;
    description: string;
  };
}

interface PartnershipsEditorProps {
  content: PartnershipsContent;
  onChange: (content: PartnershipsContent) => void;
}

export const PartnershipsEditor: React.FC<PartnershipsEditorProps> = ({
  content,
  onChange,
}) => {
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const handleChange = (section: keyof PartnershipsContent, field: string, value: any) => {
    onChange({
      ...content,
      [section]: {
        ...content[section],
        [field]: value,
      },
    });
  };

  const handleWayChange = (index: number, value: string) => {
    const newWays = [...(content.waysToPartner?.ways || [])];
    newWays[index] = value;
    handleChange('waysToPartner', 'ways', newWays);
  };

  const addWay = () => {
    const ways = content.waysToPartner?.ways || [];
    handleChange('waysToPartner', 'ways', [...ways, '']);
  };

  const removeWay = (index: number) => {
    const newWays = [...(content.waysToPartner?.ways || [])];
    newWays.splice(index, 1);
    handleChange('waysToPartner', 'ways', newWays);
  };

  const handleBenefitChange = (index: number, field: keyof PartnershipBenefit, value: string) => {
    const newBenefits = [...(content.whySupport?.benefits || [])];
    newBenefits[index] = { ...newBenefits[index], [field]: value };
    handleChange('whySupport', 'benefits', newBenefits);
  };

  const addBenefit = () => {
    const benefits = content.whySupport?.benefits || [];
    const newBenefit: PartnershipBenefit = { title: '', description: '' };
    handleChange('whySupport', 'benefits', [...benefits, newBenefit]);
  };

  const removeBenefit = (index: number) => {
    const newBenefits = [...(content.whySupport?.benefits || [])];
    newBenefits.splice(index, 1);
    handleChange('whySupport', 'benefits', newBenefits);
  };

  const handleIntroImageSelect = (media: Media) => {
    handleChange('intro', 'image', media.url);
  };

  return (
    <div className="space-y-8">
      {/* Page Layout Preview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">Page Layout</h3>
        <p className="text-xs text-blue-600">
          This page uses a clean, professional layout with: Title section → Two-column intro (text + image) → Partners logos → Ways to Partner & Benefits side-by-side
        </p>
      </div>

      {/* Meta Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Meta Information</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Page Title (Browser Tab)"
            placeholder="Partnerships | GETFund"
            value={content.meta?.title || ''}
            onChange={(e) => handleChange('meta', 'title', e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description (SEO)
            </label>
            <textarea
              placeholder="Partner with GETFund to transform education in Ghana"
              value={content.meta?.description || ''}
              onChange={(e) => handleChange('meta', 'description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Page Title Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Title</h3>
        <Input
          type="text"
          label="Page Heading"
          placeholder="Partnerships"
          value={content.hero?.title || ''}
          onChange={(e) => handleChange('hero', 'title', e.target.value)}
          required
        />
        <p className="text-xs text-gray-500 mt-2">
          This title appears at the top of the page with a navy blue underline accent.
        </p>
      </div>

      {/* Introduction Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Introduction Section</h3>
        <p className="text-sm text-gray-600 mb-4">
          This section displays as two columns: text on the left, image on the right.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Introduction Paragraph
            </label>
            <textarea
              placeholder="GETFund partners with organizations, institutions, and individuals who share our commitment to transforming education in Ghana..."
              value={content.intro?.paragraph || ''}
              onChange={(e) => handleChange('intro', 'paragraph', e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.intro?.paragraph?.length || 0} characters
            </p>
          </div>

          {/* Intro Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Image
            </label>
            {content.intro?.image ? (
              <div className="relative">
                <img
                  src={mediaService.getFullUrl(content.intro.image)}
                  alt="Introduction"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMediaPicker(true)}
                    className="bg-white text-gray-700 px-3 py-1 rounded text-sm font-medium shadow hover:bg-gray-50"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('intro', 'image', '')}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm font-medium shadow hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setShowMediaPicker(true)}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <div className="text-gray-400 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">Click to select from media library</p>
                <p className="text-xs text-gray-500 mt-1">Recommended: 800x600px or larger</p>
              </div>
            )}
            <MediaPickerModal
              isOpen={showMediaPicker}
              onClose={() => setShowMediaPicker(false)}
              onSelect={handleIntroImageSelect}
              allowUpload={true}
            />
          </div>
        </div>
      </div>

      {/* Our Partners Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Partners Section</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Section Heading"
            placeholder="Our Partners"
            value={content.ourPartners?.heading || ''}
            onChange={(e) => handleChange('ourPartners', 'heading', e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              placeholder="Optional description about our partnerships..."
              value={content.ourPartners?.description || ''}
              onChange={(e) => handleChange('ourPartners', 'description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Partner logos are managed in the <strong>Partners</strong> section of the CMS. This section will automatically display all active partners.
            </p>
          </div>
        </div>
      </div>

      {/* Ways to Partner */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ways to Partner Section</h3>
        <p className="text-sm text-gray-600 mb-4">
          Each way to partner is displayed as a card with an auto-selected icon based on the text.
        </p>
        <div className="space-y-4">
          <Input
            type="text"
            label="Section Heading"
            placeholder="Ways to Partner"
            value={content.waysToPartner?.heading || ''}
            onChange={(e) => handleChange('waysToPartner', 'heading', e.target.value)}
            required
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Partnership Ways ({(content.waysToPartner?.ways || []).length})
              </label>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={addWay}
              >
                + Add Way
              </Button>
            </div>

            {(content.waysToPartner?.ways || []).map((way, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="e.g., Infrastructure Funding, Scholarship Support, Technology Donations"
                  value={way}
                  onChange={(e) => handleWayChange(index, e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => removeWay(index)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium whitespace-nowrap"
                >
                  Remove
                </button>
              </div>
            ))}

            {(content.waysToPartner?.ways || []).length === 0 && (
              <div className="text-center py-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500 text-sm">No ways added yet. Click "Add Way" to create one.</p>
              </div>
            )}

            <p className="text-xs text-gray-500">
              Icons are automatically selected based on keywords: infrastructure, scholarship, technology, volunteer, corporate, donation, etc.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits of Partnership */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits of Partnership</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Section Heading"
            placeholder="Benefits of Partnership"
            value={content.whySupport?.heading || ''}
            onChange={(e) => handleChange('whySupport', 'heading', e.target.value)}
            required
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Benefits ({(content.whySupport?.benefits || []).length})
              </label>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={addBenefit}
              >
                + Add Benefit
              </Button>
            </div>

            {(content.whySupport?.benefits || []).map((benefit, index) => (
              <div key={index} className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Benefit {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeBenefit(index)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>

                <Input
                  type="text"
                  label="Benefit Title"
                  placeholder="e.g., Tax Benefits"
                  value={benefit.title}
                  onChange={(e) => handleBenefitChange(index, 'title', e.target.value)}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Benefit Description
                  </label>
                  <textarea
                    placeholder="Describe the benefit..."
                    value={benefit.description}
                    onChange={(e) => handleBenefitChange(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}

            {(content.whySupport?.benefits || []).length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">No benefits added yet. Click "Add Benefit" to create one.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
