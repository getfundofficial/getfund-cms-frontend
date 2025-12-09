import { useState, useEffect } from 'react';
import { footerService, FooterConfig, UpdateFooterConfigInput } from '../services/footerService';

export default function FooterConfigEditor() {
  const [, setConfig] = useState<FooterConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('organization');

  // Form state
  const [formData, setFormData] = useState<UpdateFooterConfigInput>({
    logo_url: '',
    about_text: '',
    phone: '',
    email: '',
    address: '',
    office_hours_weekday: '',
    office_hours_weekend: '',
    background_color: '#1e3a5f',
    social_links: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      youtube: '',
      whatsapp: '',
    },
    quick_links: [],
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await footerService.getFooterConfig();
      setConfig(data);
      setFormData({
        logo_url: data.logo_url || '',
        about_text: data.about_text || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        office_hours_weekday: data.office_hours_weekday || '',
        office_hours_weekend: data.office_hours_weekend || '',
        background_color: data.background_color || '#1e3a5f',
        social_links: data.social_links || {},
        quick_links: data.quick_links || [],
      });
    } catch (err: any) {
      setError('Failed to fetch footer configuration');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Validation
      if (!formData.phone || !formData.email) {
        setError('Phone and email are required');
        setSaving(false);
        return;
      }

      const updatedConfig = await footerService.updateFooterConfig(formData);
      setConfig(updatedConfig);
      setSuccess('Footer configuration saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save footer configuration');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof UpdateFooterConfigInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value,
      },
    }));
  };

  const handleQuickLinkChange = (index: number, field: 'name' | 'href', value: string) => {
    const newQuickLinks = [...(formData.quick_links || [])];
    newQuickLinks[index] = { ...newQuickLinks[index], [field]: value };
    setFormData(prev => ({ ...prev, quick_links: newQuickLinks }));
  };

  const addQuickLink = () => {
    setFormData(prev => ({
      ...prev,
      quick_links: [...(prev.quick_links || []), { name: '', href: '' }],
    }));
  };

  const removeQuickLink = (index: number) => {
    const newQuickLinks = (formData.quick_links || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, quick_links: newQuickLinks }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading footer configuration...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'organization', label: 'Organization Info' },
    { id: 'styling', label: 'Styling' },
    { id: 'contact', label: 'Contact Info' },
    { id: 'hours', label: 'Office Hours' },
    { id: 'social', label: 'Social Media' },
    { id: 'links', label: 'Quick Links' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Footer Settings</h2>
          <p className="text-sm text-gray-600 mt-1">Configure your website footer content</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 px-6" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Messages */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {success && (
          <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {/* Tab Content */}
        <div className="p-6 space-y-6">
          {/* Organization Info Tab */}
          {activeTab === 'organization' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="text"
                  value={formData.logo_url}
                  onChange={e => handleInputChange('logo_url', e.target.value)}
                  placeholder="/images/logos/getfund-logo-light-main.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.logo_url && (
                  <div className="mt-3 p-4 bg-gray-900 rounded-md">
                    <img src={formData.logo_url} alt="Logo preview" className="h-16 object-contain" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Text <span className="text-xs text-gray-500">(500 chars max)</span>
                </label>
                <textarea
                  value={formData.about_text}
                  onChange={e => handleInputChange('about_text', e.target.value)}
                  placeholder="Supporting the delivery of quality education..."
                  maxLength={500}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.about_text?.length || 0}/500 characters</p>
              </div>
            </div>
          )}

          {/* Styling Tab */}
          {activeTab === 'styling' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={formData.background_color}
                    onChange={e => handleInputChange('background_color', e.target.value)}
                    className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.background_color}
                    onChange={e => handleInputChange('background_color', e.target.value)}
                    placeholder="#1e3a5f"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Choose a background color for the footer</p>
              </div>
              <div className="mt-6 p-6 rounded-lg" style={{ backgroundColor: formData.background_color }}>
                <p className="text-white font-medium">Preview</p>
                <p className="text-gray-300 text-sm mt-2">This is how your footer background will look</p>
              </div>
            </div>
          )}

          {/* Contact Info Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  placeholder="+233 (544) 323-020"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder="info@getfund.gov.gh"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Physical Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={e => handleInputChange('address', e.target.value)}
                  placeholder="No. 42, 4th Close, Airport Residential Area, Accra"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Office Hours Tab */}
          {activeTab === 'hours' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weekday Hours
                </label>
                <input
                  type="text"
                  value={formData.office_hours_weekday}
                  onChange={e => handleInputChange('office_hours_weekday', e.target.value)}
                  placeholder="Monday - Friday: 8:00 AM - 5:00 PM"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weekend Hours
                </label>
                <input
                  type="text"
                  value={formData.office_hours_weekend}
                  onChange={e => handleInputChange('office_hours_weekend', e.target.value)}
                  placeholder="Saturday - Sunday: Closed"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              {['facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'whatsapp'].map(platform => (
                <div key={platform}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {platform === 'twitter' ? 'X (Twitter)' : platform} URL
                  </label>
                  <input
                    type="url"
                    value={(formData.social_links as any)?.[platform] || ''}
                    onChange={e => handleSocialLinkChange(platform, e.target.value)}
                    placeholder={`https://${platform}.com/...`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Quick Links Tab */}
          {activeTab === 'links' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Quick Links</h3>
                <button
                  onClick={addQuickLink}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Link
                </button>
              </div>
              <div className="space-y-3">
                {(formData.quick_links || []).map((link, index) => (
                  <div key={index} className="flex gap-3 items-start p-4 bg-gray-50 rounded-md">
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={link.name}
                        onChange={e => handleQuickLinkChange(index, 'name', e.target.value)}
                        placeholder="Link Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={link.href}
                        onChange={e => handleQuickLinkChange(index, 'href', e.target.value)}
                        placeholder="/link-url"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={() => removeQuickLink(index)}
                      className="mt-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {(formData.quick_links || []).length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-8">No quick links added yet. Click "Add Link" to get started.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={fetchConfig}
            disabled={saving}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
