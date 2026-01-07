import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import { useNavigate, useParams } from 'react-router-dom';
import { pageService, SectionType } from '../services/pageService';
import { Button } from '../components/Common/Button';
import { Input } from '../components/Common/Input';
import { RichTextEditor } from '../components/Editor/RichTextEditor';
import { StatsEditor } from '../components/SectionEditors/StatsEditor';
import { HeroEditor } from '../components/SectionEditors/HeroEditor';
import { HomePageEditor } from '../components/PageContentEditors/HomePageEditor';
import { SupportUsEditor } from '../components/PageContentEditors/SupportUsEditor';
import { WhoWeAreEditor } from '../components/PageContentEditors/WhoWeAreEditor';
import { ImpactEditor } from '../components/PageContentEditors/ImpactEditor';
import { ResourcesEditor } from '../components/PageContentEditors/ResourcesEditor';
import { WhatWeDoEditor } from '../components/PageContentEditors/WhatWeDoEditor';
import { WhyFundraisingEditor } from '../components/PageContentEditors/WhyFundraisingEditor';
import { WaysToDonateEditor } from '../components/PageContentEditors/WaysToDonateEditor';
import { PartnershipsEditor } from '../components/PageContentEditors/PartnershipsEditor';
import { BeneficiariesGiveBackEditor } from '../components/PageContentEditors/BeneficiariesGiveBackEditor';
import { EventsEditor } from '../components/PageContentEditors/EventsEditor';
import { NewsUpdatesEditor } from '../components/PageContentEditors/NewsUpdatesEditor';
import { GenericPageContentEditor } from '../components/PageContentEditors/GenericPageContentEditor';
import { InfrastructureProjectsEditor } from '../components/PageContentEditors/InfrastructureProjectsEditor';
import { ScholarshipProgrammeEditor } from '../components/PageContentEditors/ScholarshipProgrammeEditor';
import { EducationSectorSupportEditor } from '../components/PageContentEditors/EducationSectorSupportEditor';
import { CommunitySHSEditor } from '../components/PageContentEditors/CommunitySHSEditor';
import { SEIPEditor } from '../components/PageContentEditors/SEIPEditor';
import { FundraisingCampaignsEditor } from '../components/PageContentEditors/FundraisingCampaignsEditor';
import LoadingScreen from '../components/Common/LoadingScreen';

export const SectionEditorPage: React.FC = () => {
  const { slug, sectionKey } = useParams<{ slug: string; sectionKey: string }>();
  const navigate = useNavigate();
  const isEditMode = sectionKey && sectionKey !== 'new';

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSettingsCollapsed, setIsSettingsCollapsed] = useState(true);

  const [formData, setFormData] = useState({
    section_key: '',
    section_type: 'text' as SectionType,
    title: '',
    content: {} as any,
    order_index: 0,
    is_active: true,
  });

  useEffect(() => {
    if (isEditMode && slug && sectionKey) {
      loadSection();
    }
  }, [slug, sectionKey, isEditMode]);

  const loadSection = async () => {
    if (!slug || !sectionKey) return;

    try {
      setIsLoading(true);
      const data = await pageService.getSection(slug, sectionKey);
      console.log('[SectionEditorPage] Loaded section data:', data);
      console.log('[SectionEditorPage] Section content:', data.content);
      console.log('[SectionEditorPage] Content heroSlides:', (data.content as any)?.heroSlides);
      setFormData({
        section_key: data.section_key,
        section_type: data.section_type,
        title: data.title || '',
        content: data.content,
        order_index: data.order_index,
        is_active: data.is_active,
      });
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to load section');
    } finally {
      setIsLoading(false);
    }
  };

  const generateKey = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      section_key: !isEditMode || !prev.section_key ? generateKey(title) : prev.section_key,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSaving(true);

    try {
      if (isEditMode) {
        await pageService.updateSection(slug!, sectionKey!, {
          title: formData.title,
          content: formData.content,
          is_active: formData.is_active,
          order_index: formData.order_index,
        });
        setSuccessMessage('Section updated successfully!');
        // Auto-hide success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        await pageService.createSection(slug!, {
          section_key: formData.section_key,
          section_type: formData.section_type,
          title: formData.title,
          content: formData.content,
          order_index: formData.order_index,
          is_active: formData.is_active,
        });
        // Navigate to edit the newly created section
        navigate(`/admin/pages/${slug}/sections/${formData.section_key}`);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to save section');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to discard your changes?')) {
      navigate(`/admin/pages/${slug}`);
    }
  };

  const renderContentEditor = () => {
    switch (formData.section_type) {
      case 'text':
      case 'html':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <RichTextEditor
              content={formData.content.body || ''}
              onChange={(body) => setFormData(prev => ({
                ...prev,
                content: { ...prev.content, body }
              }))}
              placeholder="Write your content here..."
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <Input
              type="text"
              label="Image URL"
              placeholder="https://example.com/image.jpg or /uploads/image.jpg"
              value={formData.content.url || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: { ...prev.content, url: e.target.value }
              }))}
              required
            />
            <Input
              type="text"
              label="Alt Text"
              placeholder="Description of the image"
              value={formData.content.alt || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: { ...prev.content, alt: e.target.value }
              }))}
              required
            />
            <Input
              type="text"
              label="Caption (Optional)"
              placeholder="Image caption"
              value={formData.content.caption || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: { ...prev.content, caption: e.target.value }
              }))}
            />
          </div>
        );

      case 'video':
        // Auto-detect provider from URL
        const detectProvider = (url: string) => {
          if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
          if (url.includes('vimeo.com')) return 'vimeo';
          return 'upload';
        };
        return (
          <div className="space-y-4">
            <Input
              type="text"
              label="Video URL"
              placeholder="Paste YouTube or Vimeo link here"
              value={formData.content.url || ''}
              onChange={(e) => {
                const url = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  content: {
                    ...prev.content,
                    url,
                    provider: detectProvider(url)
                  }
                }));
              }}
              required
            />
            {formData.content.url && (
              <p className="text-sm text-gray-500">
                Detected: <span className="font-medium capitalize">{formData.content.provider || detectProvider(formData.content.url)}</span>
              </p>
            )}
            <Input
              type="text"
              label="Title"
              placeholder="See Our Impact in Action"
              value={formData.content.title || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: { ...prev.content, title: e.target.value }
              }))}
            />
            <Input
              type="text"
              label="Subtitle"
              placeholder="Watch how GETFund is transforming education across Ghana"
              value={formData.content.subtitle || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: { ...prev.content, subtitle: e.target.value }
              }))}
            />
          </div>
        );

      case 'hero':
        return (
          <HeroEditor
            initialData={formData.content}
            onChange={(data) => setFormData(prev => ({ ...prev, content: data }))}
          />
        );

      case 'cta':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Call-to-Action Text
              </label>
              <textarea
                placeholder="Compelling message to encourage action"
                value={formData.content.text || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  content: { ...prev.content, text: e.target.value }
                }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <Input
              type="text"
              label="Button Text"
              placeholder="Get Started"
              value={formData.content.buttonText || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: { ...prev.content, buttonText: e.target.value }
              }))}
              required
            />
            <Input
              type="text"
              label="Button Link"
              placeholder="/contact"
              value={formData.content.buttonLink || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: { ...prev.content, buttonLink: e.target.value }
              }))}
              required
            />
          </div>
        );

      case 'stats':
        return (
          <StatsEditor
            initialData={formData.content}
            onChange={(data) => setFormData(prev => ({ ...prev, content: data }))}
          />
        );

      case 'page_content':
        // Use custom editors for specific pages
        if (slug === 'home') {
          return (
            <HomePageEditor
              content={formData.content}
              onChange={(data) => setFormData(prev => ({ ...prev, content: data }))}
            />
          );
        }
        if (slug === 'support-us') {
          return (
            <SupportUsEditor
              initialData={formData.content}
              onChange={(data) => setFormData(prev => ({ ...prev, content: data }))}
            />
          );
        }
        if (slug === 'who-we-are') {
          return (
            <WhoWeAreEditor
              content={formData.content}
              onChange={(data) => setFormData(prev => ({ ...prev, content: data }))}
            />
          );
        }
        if (slug === 'impact') {
          return (
            <ImpactEditor
              content={formData.content}
              onChange={(data) => setFormData(prev => ({ ...prev, content: data }))}
            />
          );
        }
        if (slug === 'resources') {
          return (
            <ResourcesEditor
              content={formData.content}
              onChange={(data) => setFormData(prev => ({ ...prev, content: data }))}
            />
          );
        }
        if (slug === 'what-we-do') {
          return (
            <WhatWeDoEditor
              content={formData.content}
              onChange={(data) => setFormData(prev => ({ ...prev, content: data }))}
            />
          );
        }
        // Fundraising pages
        if (slug === 'why-fundraising') {
          return (
            <WhyFundraisingEditor
              content={formData.content}
              onChange={(data) => setFormData(prev => ({ ...prev, content: data }))}
            />
          );
        }
        if (slug === 'ways-to-donate') {
          return (
            <WaysToDonateEditor
              content={formData.content}
              onChange={(data) => setFormData(prev => ({ ...prev, content: data }))}
            />
          );
        }
        if (slug === 'partnerships') {
          return (
            <PartnershipsEditor
              content={formData.content}
              onChange={(data) => setFormData(prev => ({ ...prev, content: data }))}
            />
          );
        }
        if (slug === 'beneficiaries-give-back') {
          return (
            <BeneficiariesGiveBackEditor
              content={formData.content}
              onChange={(data) => setFormData(prev => ({ ...prev, content: data }))}
            />
          );
        }
        if (slug === 'events') {
          return (
            <EventsEditor
              content={formData.content}
              onChange={(data) => setFormData(prev => ({ ...prev, content: data }))}
            />
          );
        }
        if (slug === 'news') {
          return (
            <NewsUpdatesEditor
              content={formData.content}
              onChange={(data) => setFormData(prev => ({ ...prev, content: data }))}
            />
          );
        }
        // Service pages
        if (slug === 'infrastructure-projects') {
          return (
            <InfrastructureProjectsEditor
              content={formData.content}
              onChange={(data) => setFormData(prev => ({ ...prev, content: data }))}
            />
          );
        }
        if (slug === 'scholarship-programme') {
          return (
            <ScholarshipProgrammeEditor
              content={formData.content}
              onChange={(data) => setFormData(prev => ({ ...prev, content: data }))}
            />
          );
        }
        if (slug === 'education-sector-support') {
          return (
            <EducationSectorSupportEditor
              content={formData.content}
              onChange={(data) => setFormData(prev => ({ ...prev, content: data }))}
            />
          );
        }
        // Portfolio pages
        if (slug === 'community-shs-programme' || slug === 'free-shs-intervention') {
          return (
            <CommunitySHSEditor
              content={formData.content}
              onChange={(data) => setFormData(prev => ({ ...prev, content: data }))}
            />
          );
        }
        if (slug === 'secondary-education-improvement-programme' || slug === 'seip') {
          return (
            <SEIPEditor
              content={formData.content}
              onChange={(data) => setFormData(prev => ({ ...prev, content: data }))}
            />
          );
        }
        // Fundraising Campaigns page
        if (slug === 'fundraising-campaigns') {
          return (
            <FundraisingCampaignsEditor
              content={formData.content}
              onChange={(data) => setFormData(prev => ({ ...prev, content: data }))}
            />
          );
        }
        // Use generic JSON editor for other pages without custom editors
        return (
          <GenericPageContentEditor
            content={formData.content}
            onChange={(data) => setFormData(prev => ({ ...prev, content: data }))}
          />
        );

      default:
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-700">
              Section type "{formData.section_type}" requires a custom editor.
              For now, you can edit the JSON content directly or contact an administrator.
            </p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content (JSON)
              </label>
              <textarea
                value={JSON.stringify(formData.content, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData(prev => ({ ...prev, content: parsed }));
                  } catch (err) {
                    // Invalid JSON, ignore
                  }
                }}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading section..." />;
  }

  return (
    <>
      <Breadcrumb />
      <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Edit Section' : 'Create New Section'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditMode ? 'Update section content' : 'Add a new section to the page'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm font-medium">{successMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMessage('')}
              className="text-green-500 hover:text-green-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Visibility Toggle - Prominent at the top */}
        <div className={`rounded-lg shadow p-4 flex items-center justify-between ${
          formData.is_active ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${formData.is_active ? 'bg-green-500' : 'bg-orange-500'}`}></div>
            <div>
              <span className={`font-medium ${formData.is_active ? 'text-green-800' : 'text-orange-800'}`}>
                {formData.is_active ? 'Section is Visible' : 'Section is Hidden'}
              </span>
              <p className={`text-sm ${formData.is_active ? 'text-green-600' : 'text-orange-600'}`}>
                {formData.is_active
                  ? 'This section will appear on the website'
                  : 'This section will not appear on the website'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              formData.is_active
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {formData.is_active ? 'Hide Section' : 'Show Section'}
          </button>
        </div>

        {/* Content Editor Card - Now at the top */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Section Content</h2>
          {renderContentEditor()}
        </div>

        {/* Section Settings Card - Now at the bottom */}
        <div className="bg-white rounded-lg shadow">
          <button
            type="button"
            onClick={() => setIsSettingsCollapsed(!isSettingsCollapsed)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-xl font-semibold text-gray-900">Section Settings</h2>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${isSettingsCollapsed ? '' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {!isSettingsCollapsed && (
            <div className="px-6 pb-6 space-y-4 border-t border-gray-100">
              <Input
            type="text"
            label="Section Title"
            placeholder="Mission Statement"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            autoFocus
          />

          <Input
            type="text"
            label="Section Key"
            placeholder="mission_statement"
            value={formData.section_key}
            onChange={(e) => setFormData(prev => ({ ...prev, section_key: e.target.value }))}
            required
            disabled={Boolean(isEditMode)}
            helperText={isEditMode ? 'Cannot change key after creation' : 'Unique identifier for this section'}
          />

          {!isEditMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.section_type}
                onChange={(e) => setFormData(prev => ({ ...prev, section_type: e.target.value as SectionType }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="text">Text</option>
                <option value="html">HTML</option>
                <option value="image">Image</option>
                <option value="gallery">Gallery</option>
                <option value="video">Video</option>
                <option value="stats">Statistics</option>
                <option value="hero">Hero Banner</option>
                <option value="cta">Call-to-Action</option>
                <option value="page_content">Page Content</option>
              </select>
            </div>
          )}

          <Input
            type="number"
            label="Display Order"
            placeholder="0"
            value={formData.order_index}
            onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
            helperText="Lower numbers appear first"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Show section on website
            </label>
          </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center bg-white rounded-lg shadow p-6">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
            disabled={isSaving || !formData.title || !formData.section_key}
          >
            {isEditMode ? 'Update Section' : 'Create Section'}
          </Button>
        </div>
      </form>
    </div>
    </>
  );
};
