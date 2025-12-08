import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { contentService } from '../services/contentService';
import mediaService, { Media } from '../services/mediaService';
import { Button } from '../components/Common/Button';
import { Input } from '../components/Common/Input';
import MediaPickerModal from '../components/Media/MediaPickerModal';
import { useAutoSave, useLocalStorageRecovery } from '../hooks/useAutoSave';
import { AutoSaveIndicator } from '../components/Common/AutoSaveIndicator';
import LoadingScreen from '../components/Common/LoadingScreen';

export const HeroSlideEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
  });

  // Auto-save configuration
  const localStorageKey = isEditMode ? `hero-draft-${id}` : 'hero-draft-new';

  // Recover from localStorage on mount
  const { data: recoveredData, timestamp: recoveryTimestamp, clear: clearRecovery } =
    useLocalStorageRecovery<typeof formData>(localStorageKey);

  // Auto-save hook
  const { status: autoSaveStatus, lastSaved, error: autoSaveError } = useAutoSave({
    data: formData,
    onSave: async (data) => {
      if (isEditMode && id) {
        await contentService.update(id, {
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          body: data.content,
          featured_image_url: data.featured_image || undefined,
        });
      }
    },
    delay: 3000,
    enabled: isEditMode && !isSaving,
    localStorageKey,
  });

  // Show recovery prompt if data exists
  useEffect(() => {
    if (recoveredData && recoveryTimestamp) {
      const timeDiff = new Date().getTime() - new Date(recoveryTimestamp).getTime();
      const minutesAgo = Math.floor(timeDiff / 60000);

      if (minutesAgo < 60) {
        const shouldRecover = confirm(
          `Found unsaved changes from ${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago. Do you want to restore them?`
        );

        if (shouldRecover) {
          setFormData(recoveredData);
        }
        clearRecovery();
      } else {
        clearRecovery();
      }
    }
  }, []);

  useEffect(() => {
    if (isEditMode && id) {
      loadContent(id);
    }
  }, [id, isEditMode]);

  const loadContent = async (contentId: string) => {
    try {
      setIsLoading(true);
      const data = await contentService.getById(contentId);

      // Check if user can edit this content
      if (user?.role !== 'admin' && data.created_by !== user?.id) {
        setError('You do not have permission to edit this content');
        return;
      }

      // Allow editing in any status for simplified workflow
      console.log('[Hero Editor] Loaded slide:', data.title, 'Status:', data.status);

      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || '',
        content: data.body || '',
        featured_image: data.featured_image_url || '',
      });
    } catch (error: any) {
      console.error('[Hero Editor] Load error:', error);
      setError(error.response?.data?.error || 'Failed to load content');
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
      slug: (!isEditMode || !prev.slug) ? generateSlug(title) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const payload = {
        type: 'hero_slide' as const,
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        featured_image: formData.featured_image,
        tags: [],
      };

      let slideId = id;
      
      if (isEditMode && id) {
        console.log('[Hero Editor] Updating slide:', id);
        await contentService.update(id, payload);
        slideId = id;
      } else {
        console.log('[Hero Editor] Creating new slide');
        const created = await contentService.create(payload);
        slideId = created.id;
      }

      // Auto-publish the slide so it appears immediately on the website
      if (slideId) {
        console.log('[Hero Editor] Publishing slide:', slideId);
        await contentService.publish(slideId);
        console.log('[Hero Editor] Slide published successfully');
      }

      alert('Hero slide saved and published! It should appear on the website immediately.');
      navigate('/admin/hero-slides');
    } catch (error: any) {
      console.error('[Hero Editor] Save error:', error);
      setError(error.response?.data?.error || 'Failed to save hero slide');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to discard your changes?')) {
      navigate('/admin/hero-slides');
    }
  };

  const handleMediaSelect = (media: Media) => {
    const fullUrl = mediaService.getFullUrl(media.url);
    setFormData(prev => ({ ...prev, featured_image: fullUrl }));
  };

  const handleRemoveImage = () => {
    if (confirm('Remove background image?')) {
      setFormData(prev => ({ ...prev, featured_image: '' }));
    }
  };

  // Parse button data from content field
  let buttonData = { buttonText: '', buttonLink: '' };
  try {
    buttonData = JSON.parse(formData.content || '{}');
  } catch {
    buttonData = { buttonText: '', buttonLink: '' };
  }

  const updateButtonData = (field: string, value: string) => {
    const current = { ...buttonData, [field]: value };
    setFormData(prev => ({ ...prev, content: JSON.stringify(current) }));
  };

  if (isLoading) {
    return <LoadingScreen message="Loading hero slide..." />;
  }

  if (error && isEditMode) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
        <p className="text-red-700">{error}</p>
        <Button
          variant="secondary"
          onClick={() => navigate('/admin/hero-slides')}
          className="mt-4"
        >
          Back to Hero Slides
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
            {isEditMode ? 'Edit Hero Slide' : 'Create New Hero Slide'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode ? 'Update the hero slide details below' : 'Fill in the details to create a new hero slide'}
          </p>
        </div>
        {isEditMode && (
          <AutoSaveIndicator
            status={autoSaveStatus}
            lastSaved={lastSaved}
            error={autoSaveError}
            className="mt-1"
          />
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Basic Info Card */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Slide Information</h2>

          <Input
            type="text"
            label="Title"
            placeholder="Enter slide title (main heading)"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            autoFocus
            helperText="The main headline displayed on the slide"
          />

          <Input
            type="text"
            label="Slug (URL)"
            placeholder="slide-url-slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            required
            helperText="This will be used in the slide identifier"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle / Description
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              placeholder="Brief description or tagline for the slide"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              required
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Background Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Image
              <span className="text-red-500 ml-1">*</span>
            </label>

            {formData.featured_image ? (
              /* Image Preview */
              <div className="space-y-3">
                <div className="relative inline-block">
                  <img
                    src={formData.featured_image}
                    alt="Hero background"
                    className="h-48 w-auto rounded-lg border border-gray-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/1920x1080?text=Image+Not+Found';
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                    title="Remove image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            ) : (
              /* No Image - Show Upload Button */
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600">No background image</p>
                <button
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Upload or Select Image
                </button>
              </div>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Full-width background image for the slide (recommended: 1920x1080)
            </p>
          </div>
        </div>

        {/* Call-to-Action Card */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Call-to-Action Button</h2>

          <Input
            type="text"
            label="Button Text"
            placeholder="Learn More"
            value={buttonData.buttonText}
            onChange={(e) => updateButtonData('buttonText', e.target.value)}
            helperText="Text displayed on the button (leave empty to hide button)"
          />

          <Input
            type="url"
            label="Button Link"
            placeholder="https://example.com/page"
            value={buttonData.buttonLink}
            onChange={(e) => updateButtonData('buttonLink', e.target.value)}
            helperText="URL the button links to"
          />
        </div>

        {/* Preview Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview</h2>
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            {formData.featured_image ? (
              <img
                src={formData.featured_image}
                alt={formData.title}
                className="w-full h-full object-cover opacity-70"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No image
              </div>
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                {formData.title || 'Hero Slide Title'}
              </h1>
              {formData.excerpt && (
                <p className="text-xl md:text-2xl mb-6 drop-shadow-lg max-w-2xl">
                  {formData.excerpt}
                </p>
              )}
              {buttonData.buttonText && (
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg">
                  {buttonData.buttonText}
                </button>
              )}
            </div>
          </div>
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

          <div className="flex gap-3">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              disabled={isSaving || !formData.title || !formData.slug || !formData.excerpt || !formData.featured_image}
            >
              {isSaving ? 'Publishing...' : (isEditMode ? 'Update & Publish' : 'Create & Publish')}
            </Button>
          </div>
        </div>
      </form>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          📝 Hero Slide Tips
        </h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Use high-quality, wide images (1920x1080 recommended)</li>
          <li>Keep titles short and impactful (5-8 words)</li>
          <li>Make subtitles concise and clear</li>
          <li>Use action-oriented button text (e.g., "Get Started", "Learn More")</li>
          <li>Test how the slide looks on different screen sizes</li>
        </ul>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        allowUpload={true}
      />
    </div>
    </>
  );
};
