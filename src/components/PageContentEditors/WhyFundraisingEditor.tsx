import React, { useState, useEffect } from 'react';
import { Input } from '../Common/Input';
import { api } from '../../services/api';
import MediaPickerModal from '../Media/MediaPickerModal';
import mediaService, { Media } from '../../services/mediaService';

interface WhyFundraisingContent {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  mainContent: {
    paragraph: string;
  };
  whyDonate: {
    heading: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
  };
  getInvolved: {
    heading: string;
    description: string;
    donationHeading: string;
  };
  featuredImage?: {
    url: string;
    alt: string;
    caption?: string;
  };
}

interface WhyFundraisingEditorProps {
  content: WhyFundraisingContent;
  onChange: (content: WhyFundraisingContent) => void;
}

export const WhyFundraisingEditor: React.FC<WhyFundraisingEditorProps> = ({
  content,
  onChange,
}) => {
  const [floatingContact, setFloatingContact] = useState({
    phone: '+233 30 266 4061',
    email: 'info@getfund.gov.gh',
    address: 'GETFund House, Accra',
    button_text: 'Contact Fundraising Unit',
  });
  const [contactLoading, setContactLoading] = useState(true);
  const [contactSaving, setContactSaving] = useState(false);
  const [contactMessage, setContactMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  useEffect(() => {
    const loadContact = async () => {
      try {
        const response = await api.get('/fundraising-contact');
        const data = response.data;
        if (data) {
          setFloatingContact({
            phone: data.phone || '+233 30 266 4061',
            email: data.email || 'info@getfund.gov.gh',
            address: data.address || 'GETFund House, Accra',
            button_text: data.button_text || 'Contact Fundraising Unit',
          });
        }
      } catch (error) {
        console.error('Failed to load contact:', error);
      } finally {
        setContactLoading(false);
      }
    };
    loadContact();
  }, []);

  const saveFloatingContact = async () => {
    setContactSaving(true);
    setContactMessage(null);
    try {
      await api.put('/fundraising-contact', floatingContact);
      setContactMessage({ type: 'success', text: 'Saved!' });
      setTimeout(() => setContactMessage(null), 3000);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to save';
      setContactMessage({ type: 'error', text: errorMsg });
    } finally {
      setContactSaving(false);
    }
  };

  const handleChange = (section: keyof WhyFundraisingContent, field: string, value: string) => {
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

  const handleMediaSelect = (media: Media) => {
    onChange({
      ...content,
      featuredImage: {
        url: mediaService.getFullUrl(media.url),
        alt: media.alt_text || media.original_name,
        caption: content.featuredImage?.caption || '',
      },
    });
  };

  const handleRemoveImage = () => {
    onChange({
      ...content,
      featuredImage: undefined,
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
            placeholder="Why Fundraising? | GETFund"
            value={content.meta?.title || ''}
            onChange={(e) => handleChange('meta', 'title', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea
              placeholder="Your support helps us expand access to quality education..."
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
            placeholder="Why Fundraising?"
            value={content.hero?.title || ''}
            onChange={(e) => handleChange('hero', 'title', e.target.value)}
          />
        </div>
      </div>

      {/* Featured Image Section */}
      <div className="border border-gray-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Image (Optional)</h3>
        <p className="text-sm text-gray-600 mb-4">
          Add an optional image to display on the right side of the hero section text.
        </p>
        <div className="space-y-4">
          {content.featuredImage?.url ? (
            /* Image Preview with Edit/Remove Options */
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border border-gray-200 max-w-md">
                <img
                  src={content.featuredImage.url}
                  alt={content.featuredImage.alt || 'Featured image preview'}
                  className="w-full h-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" fill="%23f3f4f6"><rect width="100%" height="100%"/><text x="50%" y="50%" font-family="sans-serif" font-size="14" fill="%239ca3af" text-anchor="middle" dy=".3em">Image failed to load</text></svg>';
                  }}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowMediaPicker(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Change Image
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  Remove Image
                </button>
              </div>
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
            </div>
          ) : (
            /* No Image - Show Upload Button */
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-600 mb-4">No featured image selected</p>
              <button
                type="button"
                onClick={() => setShowMediaPicker(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Select from Gallery
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleMediaSelect}
        mediaType="image"
        allowUpload={true}
      />

      {/* Main Content */}
      <div className="border border-gray-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Introduction</h3>
        <textarea
          placeholder="At the Ghana Education Trust Fund (GETFund), fundraising is a strategic pillar..."
          value={content.mainContent?.paragraph || ''}
          onChange={(e) => handleChange('mainContent', 'paragraph', e.target.value)}
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Why Donate Section */}
      <div className="border border-gray-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Donate Section</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Heading"
            placeholder="Why Donate to Us - Give with Confidence"
            value={content.whyDonate?.heading || ''}
            onChange={(e) => handleChange('whyDonate', 'heading', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 1</label>
            <textarea
              value={content.whyDonate?.paragraph1 || ''}
              onChange={(e) => handleChange('whyDonate', 'paragraph1', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 2</label>
            <textarea
              value={content.whyDonate?.paragraph2 || ''}
              onChange={(e) => handleChange('whyDonate', 'paragraph2', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 3</label>
            <textarea
              value={content.whyDonate?.paragraph3 || ''}
              onChange={(e) => handleChange('whyDonate', 'paragraph3', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Get Involved Section */}
      <div className="border border-gray-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Involved Section</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Heading"
            placeholder="Get Involved"
            value={content.getInvolved?.heading || ''}
            onChange={(e) => handleChange('getInvolved', 'heading', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Every contribution, irrespective of the amount..."
              value={content.getInvolved?.description || ''}
              onChange={(e) => handleChange('getInvolved', 'description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <Input
            type="text"
            label="Donation Form Heading"
            placeholder="Make Your Donation"
            value={content.getInvolved?.donationHeading || ''}
            onChange={(e) => handleChange('getInvolved', 'donationHeading', e.target.value)}
          />
        </div>
      </div>

      {/* Floating Contact Button */}
      <div className="border border-green-200 bg-green-50 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Floating Contact Button</h3>
            <p className="text-sm text-gray-500">Contact info for the floating button</p>
          </div>
          <button
            onClick={saveFloatingContact}
            disabled={contactSaving || contactLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {contactSaving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {contactMessage && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${contactMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {contactMessage.text}
          </div>
        )}

        {contactLoading ? (
          <p className="text-center py-4 text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-4">
            <Input
              type="text"
              label="Button Text"
              placeholder="Contact Fundraising Unit"
              value={floatingContact.button_text}
              onChange={(e) => setFloatingContact({ ...floatingContact, button_text: e.target.value })}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="text"
                label="Phone"
                value={floatingContact.phone}
                onChange={(e) => setFloatingContact({ ...floatingContact, phone: e.target.value })}
              />
              <Input
                type="email"
                label="Email"
                value={floatingContact.email}
                onChange={(e) => setFloatingContact({ ...floatingContact, email: e.target.value })}
              />
              <Input
                type="text"
                label="Address"
                value={floatingContact.address}
                onChange={(e) => setFloatingContact({ ...floatingContact, address: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
