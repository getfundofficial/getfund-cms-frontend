import React, { useState, useEffect } from 'react';
import { Input } from '../Common/Input';
import { BannerBackgroundEditor } from './BannerBackgroundEditor';

const API_URL = import.meta.env.VITE_API_URL || 'https://getfund-cms-backend.vercel.app/api';

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
  const [floatingContact, setFloatingContact] = useState({
    phone: '+233 30 266 4061',
    email: 'info@getfund.gov.gh',
    address: 'GETFund House, Accra',
  });
  const [contactLoading, setContactLoading] = useState(true);
  const [contactSaving, setContactSaving] = useState(false);
  const [contactMessage, setContactMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/fundraising-contact`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setFloatingContact({
            phone: data.phone || '+233 30 266 4061',
            email: data.email || 'info@getfund.gov.gh',
            address: data.address || 'GETFund House, Accra',
          });
        }
      })
      .catch(() => {})
      .finally(() => setContactLoading(false));
  }, []);

  const saveFloatingContact = async () => {
    setContactSaving(true);
    setContactMessage(null);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/fundraising-contact`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(floatingContact),
      });
      if (res.ok) {
        setContactMessage({ type: 'success', text: 'Saved!' });
        setTimeout(() => setContactMessage(null), 3000);
      } else {
        const data = await res.json();
        setContactMessage({ type: 'error', text: data.error || 'Failed to save' });
      }
    } catch {
      setContactMessage({ type: 'error', text: 'Failed to save' });
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

      {/* Hero Section */}
      <div className="border border-gray-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Banner</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Title"
            placeholder="Why Fundraising?"
            value={content.hero?.title || ''}
            onChange={(e) => handleChange('hero', 'title', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <textarea
              placeholder="Your support helps us expand access to quality education..."
              value={content.hero?.subtitle || ''}
              onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <BannerBackgroundEditor
            value={content.bannerBackground || {}}
            onChange={(bannerBackground) => onChange({ ...content, bannerBackground })}
            previewTitle={content.hero?.title || 'Why Fundraising?'}
            previewSubtitle={content.hero?.subtitle || ''}
          />
        </div>
      </div>

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
        )}
      </div>
    </div>
  );
};
