import React, { useState, useEffect } from 'react';
import { Input } from '../Common/Input';
import { BannerBackgroundEditor } from './BannerBackgroundEditor';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://getfund-cms-backend.vercel.app/api';

interface FloatingContactInfo {
  phone: string;
  email: string;
  address: string;
}

interface BannerBackground {
  imageUrl?: string | null;
  tintColor?: string;
  tintOpacity?: number;
}

interface WhyFundraisingContent {
  bannerBackground?: BannerBackground;
  meta: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaButtonText: string;
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
}

interface WhyFundraisingEditorProps {
  content: WhyFundraisingContent;
  onChange: (content: WhyFundraisingContent) => void;
}

export const WhyFundraisingEditor: React.FC<WhyFundraisingEditorProps> = ({
  content,
  onChange,
}) => {
  const [floatingContact, setFloatingContact] = useState<FloatingContactInfo>({
    phone: '+233 30 266 4061',
    email: 'info@getfund.gov.gh',
    address: 'GETFund House, Accra',
  });
  const [contactLoading, setContactLoading] = useState(true);
  const [contactSaving, setContactSaving] = useState(false);
  const [contactMessage, setContactMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchFloatingContact = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/fundraising-contact`);
        if (response.ok) {
          const data = await response.json();
          setFloatingContact({
            phone: data.phone || '+233 30 266 4061',
            email: data.email || 'info@getfund.gov.gh',
            address: data.address || 'GETFund House, Accra',
          });
        }
      } catch (error) {
        console.error('Failed to fetch floating contact:', error);
      } finally {
        setContactLoading(false);
      }
    };
    fetchFloatingContact();
  }, []);

  const saveFloatingContact = async () => {
    setContactSaving(true);
    setContactMessage(null);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/fundraising-contact`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(floatingContact),
      });
      if (response.ok) {
        setContactMessage({ type: 'success', text: 'Contact info saved successfully!' });
        setTimeout(() => setContactMessage(null), 3000);
      } else {
        const data = await response.json();
        setContactMessage({ type: 'error', text: data.error || 'Failed to save contact info' });
      }
    } catch (error) {
      setContactMessage({ type: 'error', text: 'Failed to save contact info' });
    } finally {
      setContactSaving(false);
    }
  };

  const handleChange = (section: keyof WhyFundraisingContent, field: string, value: string) => {
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
            placeholder="Why Fundraising? | GETFund"
            value={content.meta?.title || ''}
            onChange={(e) => handleChange('meta', 'title', e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description (SEO)
            </label>
            <textarea
              placeholder="Your support helps us expand access to quality education..."
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
        <div className="space-y-6">
          <Input
            type="text"
            label="Hero Title"
            placeholder="Why Fundraising?"
            value={content.hero?.title || ''}
            onChange={(e) => handleChange('hero', 'title', e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hero Subtitle
            </label>
            <textarea
              placeholder="Your support helps us expand access to quality education..."
              value={content.hero?.subtitle || ''}
              onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Input
            type="text"
            label="CTA Button Text"
            placeholder="Make a Donation"
            value={content.hero?.ctaButtonText || ''}
            onChange={(e) => handleChange('hero', 'ctaButtonText', e.target.value)}
            required
          />

          {/* Banner Background Editor */}
          <BannerBackgroundEditor
            value={content.bannerBackground || {}}
            onChange={(bannerBackground) => onChange({ ...content, bannerBackground })}
            previewTitle={content.hero?.title || 'Why Fundraising?'}
            previewSubtitle={content.hero?.subtitle || 'Your support helps us expand access to quality education...'}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Main Content</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Main Paragraph
          </label>
          <textarea
            placeholder="At the Ghana Education Trust Fund (GETFund), fundraising is a strategic pillar..."
            value={content.mainContent?.paragraph || ''}
            onChange={(e) => handleChange('mainContent', 'paragraph', e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            {content.mainContent?.paragraph?.length || 0} characters
          </p>
        </div>
      </div>

      {/* Why Donate Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Donate to Us Section</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Section Heading"
            placeholder="Why Donate to Us - Give with Confidence"
            value={content.whyDonate?.heading || ''}
            onChange={(e) => handleChange('whyDonate', 'heading', e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paragraph 1
            </label>
            <textarea
              placeholder="Imagine a brilliant young student in Ghana..."
              value={content.whyDonate?.paragraph1 || ''}
              onChange={(e) => handleChange('whyDonate', 'paragraph1', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.whyDonate?.paragraph1?.length || 0} characters
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paragraph 2
            </label>
            <textarea
              placeholder="The Ghana Education Trust Fund (GETFund) was created to rewrite this story..."
              value={content.whyDonate?.paragraph2 || ''}
              onChange={(e) => handleChange('whyDonate', 'paragraph2', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.whyDonate?.paragraph2?.length || 0} characters
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paragraph 3
            </label>
            <textarea
              placeholder="Your trust is our priority. GETFund is committed to the highest standards..."
              value={content.whyDonate?.paragraph3 || ''}
              onChange={(e) => handleChange('whyDonate', 'paragraph3', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.whyDonate?.paragraph3?.length || 0} characters
            </p>
          </div>
        </div>
      </div>

      {/* Get Involved Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Involved Section</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Section Heading"
            placeholder="Get Involved"
            value={content.getInvolved?.heading || ''}
            onChange={(e) => handleChange('getInvolved', 'heading', e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Every contribution, irrespective of the amount..."
              value={content.getInvolved?.description || ''}
              onChange={(e) => handleChange('getInvolved', 'description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Input
            type="text"
            label="Donation Form Heading"
            placeholder="Make Your Donation"
            value={content.getInvolved?.donationHeading || ''}
            onChange={(e) => handleChange('getInvolved', 'donationHeading', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Floating Contact Button */}
      <div className="border border-green-200 bg-green-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Floating Contact Button</h3>
            <p className="text-sm text-gray-600">Edit the contact info shown in the floating button on fundraising pages</p>
          </div>
          <button
            onClick={saveFloatingContact}
            disabled={contactSaving || contactLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {contactSaving ? 'Saving...' : 'Save Contact Info'}
          </button>
        </div>

        {contactMessage && (
          <div className={`mb-4 p-3 rounded-lg ${contactMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {contactMessage.text}
          </div>
        )}

        {contactLoading ? (
          <div className="text-center py-4 text-gray-500">Loading contact info...</div>
        ) : (
          <div className="space-y-4">
            <Input
              type="text"
              label="Phone Number"
              placeholder="+233 30 266 4061"
              value={floatingContact.phone}
              onChange={(e) => setFloatingContact({ ...floatingContact, phone: e.target.value })}
              required
            />
            <Input
              type="email"
              label="Email Address"
              placeholder="info@getfund.gov.gh"
              value={floatingContact.email}
              onChange={(e) => setFloatingContact({ ...floatingContact, email: e.target.value })}
              required
            />
            <Input
              type="text"
              label="Address"
              placeholder="GETFund House, Accra"
              value={floatingContact.address}
              onChange={(e) => setFloatingContact({ ...floatingContact, address: e.target.value })}
              required
            />
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> The Donation Interface component is managed by developers. Impact Stats can be edited via the Impact Stats Manager. The Floating Contact Button info is saved separately using the button above.
        </p>
      </div>
    </div>
  );
};
