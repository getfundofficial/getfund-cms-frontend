import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { pageService, PageSection } from '../services/pageService';
import { isAdminRole } from '../types/auth.types';
import { Button } from '../components/Common/Button';
import { Input } from '../components/Common/Input';
import LoadingScreen from '../components/Common/LoadingScreen';

// Page templates are managed in code (getfund-website/src/templates/pages/)
// These are read-only options for the CMS
const AVAILABLE_PAGE_TEMPLATES = [
  { name: 'home', displayName: 'Home', description: 'Homepage template with hero carousel, mission/vision/values, about section, services, impact stats, and news' },
  { name: 'who-we-are', displayName: 'Who We Are', description: 'Template for Who We Are pages with mission, vision, history, and leadership sections' },
  { name: 'what-we-do', displayName: 'What We Do', description: 'Template showcasing programs, initiatives, and key areas of focus' },
  { name: 'scholarship-programme', displayName: 'Scholarship Programme (Legacy)', description: 'Legacy template for scholarship programs' },
  { name: 'scholarships', displayName: 'Scholarships', description: 'Comprehensive scholarships page with programme overview, application info, FAQs, and scholars database' },
  { name: 'infrastructure-projects', displayName: 'Infrastructure Projects', description: 'Template for showcasing infrastructure development projects' },
  { name: 'impact', displayName: 'Impact', description: 'Template for displaying impact statistics, stories, and regional data' },
  { name: 'support-us', displayName: 'Support Us', description: 'Template for donations and support page with impact stats, support options, and scholarship info' },
  { name: 'faq', displayName: 'FAQ', description: 'Template for frequently asked questions with collapsible sections' },
  { name: 'contact', displayName: 'Contact Page', description: 'Template for Contact pages with contact form, office locations, and social media links' },
  { name: 'fundraising-campaigns', displayName: 'Fundraising Campaigns', description: 'Template for the Fundraising Campaigns page with hero banner, campaigns, and lottery sections' },
  { name: 'generic', displayName: 'Generic Page', description: 'Use custom sections (hero, text, stats, etc.) to build the page' },
];

export const PageEditorPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEditMode = slug && slug !== 'new';

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [sections, setSections] = useState<PageSection[]>([]);
  const [isSettingsCollapsed, setIsSettingsCollapsed] = useState(true);

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    meta_title: '',
    meta_description: '',
    layout_template: 'generic',
  });

  useEffect(() => {
    if (isEditMode) {
      loadPage();
    }
  }, [slug, isEditMode]);

  const loadPage = async () => {
    if (!slug) return;

    try {
      setIsLoading(true);
      const data = await pageService.getBySlug(slug);
      setFormData({
        slug: data.slug,
        title: data.title,
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        layout_template: data.layout_template,
      });
      setSections(data.sections || []);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to load page');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: !isEditMode || !prev.slug ? generateSlug(title) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      if (isEditMode) {
        await pageService.update(slug!, {
          title: formData.title,
          meta_title: formData.meta_title,
          meta_description: formData.meta_description,
          layout_template: formData.layout_template,
        });
      } else {
        const newPage = await pageService.create({
          slug: formData.slug,
          title: formData.title,
          meta_title: formData.meta_title,
          meta_description: formData.meta_description,
          layout_template: formData.layout_template,
          is_active: false,
        });
        navigate(`/admin/pages/${newPage.slug}`);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to save page');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to discard your changes?')) {
      navigate('/admin/pages');
    }
  };

  const handleDeleteSection = async (sectionKey: string) => {
    if (!confirm('Delete this section?')) return;

    try {
      await pageService.deleteSection(slug!, sectionKey);
      await loadPage();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete section');
    }
  };

  const handleToggleSectionVisibility = async (sectionKey: string, currentStatus: boolean) => {
    try {
      await pageService.updateSection(slug!, sectionKey, { is_active: !currentStatus });
      await loadPage();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update section visibility');
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading page..." />;
  }

  if (error && isEditMode) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
        <p className="text-red-700">{error}</p>
        <Button
          variant="secondary"
          onClick={() => navigate('/admin/pages')}
          className="mt-4"
        >
          Back to Pages
        </Button>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb />
      <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Page' : 'Create New Page'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode ? 'Update page settings and manage sections' : 'Create a new static page'}
          </p>
        </div>
      </div>

      {/* Sections Management (only in edit mode) - Now at the top */}
      {isEditMode && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Page Sections</h2>
            <Button
              variant="primary"
              onClick={() => navigate(`/admin/pages/${slug}/sections/new`)}
            >
              + Add Section
            </Button>
          </div>

          {sections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No sections yet. Add your first section to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-gray-500">{section.order_index}</span>
                      <div>
                        <div className="font-medium text-gray-900">
                          {section.title || section.section_key}
                        </div>
                        <div className="text-sm text-gray-500">
                          Type: {section.section_type} • Key: {section.section_key}
                          {!section.is_active && <span className="ml-2 text-orange-600">(Hidden)</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleSectionVisibility(section.section_key, section.is_active)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        section.is_active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      }`}
                      title={section.is_active ? 'Click to hide this section' : 'Click to show this section'}
                    >
                      {section.is_active ? 'Visible' : 'Hidden'}
                    </button>
                    <button
                      onClick={() => navigate(`/admin/pages/${slug}/sections/${section.section_key}`)}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    {isAdminRole(user?.role) && (
                      <button
                        onClick={() => handleDeleteSection(section.section_key)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Page Settings Card - Now at the bottom */}
        <div className="bg-white rounded-lg shadow">
          <button
            type="button"
            onClick={() => setIsSettingsCollapsed(!isSettingsCollapsed)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-xl font-semibold text-gray-900">Page Settings</h2>
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
            label="Title"
            placeholder="About Us"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            autoFocus
          />

          <Input
            type="text"
            label="Slug (URL)"
            placeholder="about-us"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            required
            disabled={!!isEditMode}
            helperText={isEditMode ? 'Cannot change slug after creation' : 'Will be used in the page URL'}
          />

          <Input
            type="text"
            label="Meta Title (SEO)"
            placeholder="About GETFund - Ghana Education Trust Fund"
            value={formData.meta_title}
            onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
            helperText="Title shown in search engines"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description (SEO)
            </label>
            <textarea
              placeholder="Brief description for search engines"
              value={formData.meta_description}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Template
            </label>
            <select
              value={formData.layout_template}
              onChange={(e) => setFormData(prev => ({ ...prev, layout_template: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {AVAILABLE_PAGE_TEMPLATES.map((template) => (
                <option key={template.name} value={template.name}>
                  {template.displayName}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {AVAILABLE_PAGE_TEMPLATES.find(t => t.name === formData.layout_template)?.description}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              💡 Templates are managed in code at: getfund-website/src/templates/pages/
            </p>
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
            disabled={isSaving || !formData.title || !formData.slug}
          >
            {isEditMode ? 'Update Page' : 'Create Page'}
          </Button>
        </div>
      </form>

      {/* Help Text */}
      {!isEditMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Next Steps
          </h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>After creating the page, you can add sections (hero, text, images, etc.)</li>
            <li>Each section can be edited independently with granular permissions</li>
            <li>The page must be published to appear on the website</li>
          </ul>
        </div>
      )}
    </div>
    </>
  );
};
