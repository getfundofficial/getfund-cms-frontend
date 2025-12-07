import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { contentService } from '../services/contentService';
import mediaService, { Media } from '../services/mediaService';
import { Button } from '../components/Common/Button';
import { Input } from '../components/Common/Input';
import { RichTextEditor } from '../components/Editor/RichTextEditor';
import MediaPickerModal from '../components/Media/MediaPickerModal';
import { useAutoSave, useLocalStorageRecovery } from '../hooks/useAutoSave';
import { AutoSaveIndicator } from '../components/Common/AutoSaveIndicator';

export const NewsEditorPage: React.FC = () => {
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
    category: 'NEWS',
    tags: '',
    published_at: '',
  });

  // Auto-save configuration
  const localStorageKey = isEditMode ? `news-draft-${id}` : 'news-draft-new';

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
      // Don't auto-save new articles, only updates
    },
    delay: 3000, // 3 seconds debounce
    enabled: isEditMode && !isSaving, // Only auto-save in edit mode and when not manually saving
    localStorageKey,
  });

  // Show recovery prompt if data exists
  useEffect(() => {
    if (recoveredData && recoveryTimestamp) {
      const timeDiff = new Date().getTime() - new Date(recoveryTimestamp).getTime();
      const minutesAgo = Math.floor(timeDiff / 60000);

      if (minutesAgo < 60) { // Only show if less than 1 hour old
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

      // Allow admins to edit any content, others can only edit draft or changes_requested
      if (user?.role !== 'admin' && !['draft', 'changes_requested'].includes(data.status)) {
        setError('You can only edit content in draft or changes_requested status');
        return;
      }

      // Format published_at for datetime-local input (YYYY-MM-DDTHH:MM)
      let publishedAtValue = '';
      if (data.published_at) {
        const date = new Date(data.published_at);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        publishedAtValue = `${year}-${month}-${day}T${hours}:${minutes}`;
      }

      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || '',
        content: data.body || '',
        featured_image: data.featured_image_url || '',
        category: data.category || 'NEWS',
        tags: '',
        published_at: publishedAtValue,
      });
    } catch (error: any) {
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
      // Auto-generate slug only if creating new or slug is empty
      slug: (!isEditMode || !prev.slug) ? generateSlug(title) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      // Convert datetime-local format to ISO 8601 for API
      let publishedAtISO = undefined;
      if (formData.published_at) {
        publishedAtISO = new Date(formData.published_at).toISOString();
      }

      const payload = {
        type: 'news' as const,
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        body: formData.content, // Changed from 'content' to 'body' to match database schema
        category: formData.category,
        featured_image_url: formData.featured_image || undefined,
        published_at: publishedAtISO,
      };

      if (isEditMode && id) {
        await contentService.update(id, payload);
      } else {
        await contentService.create(payload);
      }

      navigate('/admin/news');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to discard your changes?')) {
      navigate('/admin/news');
    }
  };

  const handleMediaSelect = (media: Media) => {
    const fullUrl = mediaService.getFullUrl(media.url);
    setFormData(prev => ({ ...prev, featured_image: fullUrl }));
  };

  const handleRemoveImage = () => {
    if (confirm('Remove featured image?')) {
      setFormData(prev => ({ ...prev, featured_image: '' }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error && isEditMode) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
        <p className="text-red-700">{error}</p>
        <Button
          variant="secondary"
          onClick={() => navigate('/admin/news')}
          className="mt-4"
        >
          Back to News List
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
            {isEditMode ? 'Edit Article' : 'Create New Article'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode ? 'Update the article details below' : 'Fill in the details to create a new article'}
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

          <Input
            type="text"
            label="Title"
            placeholder="Enter article title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            autoFocus
          />

          <Input
            type="text"
            label="Slug (URL)"
            placeholder="article-url-slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            required
            helperText="This will be used in the article URL"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              placeholder="Brief summary of the article (shown in previews)"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="NEWS">News</option>
              <option value="ANNOUNCEMENT">Announcement</option>
              <option value="EVENT">Event</option>
              <option value="UPDATE">Update</option>
              <option value="PRESS_RELEASE">Press Release</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Select the category for this article
            </p>
          </div>

          {/* Publish Date/Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publish Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.published_at}
              onChange={(e) => setFormData(prev => ({ ...prev, published_at: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Optional: Set a custom publish date and time. Leave empty to use the current time when published.
            </p>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>

            {formData.featured_image ? (
              /* Image Preview */
              <div className="space-y-3">
                <div className="relative inline-block">
                  <img
                    src={formData.featured_image}
                    alt="Featured"
                    className="h-48 w-auto rounded-lg border border-gray-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
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
                <p className="mt-2 text-sm text-gray-600">No featured image</p>
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
              Optional: Main image for this article
            </p>
          </div>

          <Input
            type="text"
            label="Tags"
            placeholder="education, scholarship, news"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            helperText="Comma-separated tags for categorization"
          />
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Article Content</h2>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
            placeholder="Write your article content here..."
          />
        </div>

        {/* Preview Card */}
        {formData.content && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview</h2>
            <div className="border-t border-gray-200 pt-4">
              {formData.featured_image && (
                <img
                  src={formData.featured_image}
                  alt={formData.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {formData.title || 'Article Title'}
              </h3>
              {formData.excerpt && (
                <p className="text-gray-600 italic mb-4">{formData.excerpt}</p>
              )}
              <div
                className="prose prose-lg max-w-none
                  prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-6
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                  prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4 prose-ul:text-gray-700
                  prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4 prose-ol:text-gray-700
                  prose-li:mb-2 prose-li:ml-2 prose-li:leading-relaxed
                  prose-strong:font-bold prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: formData.content }}
              />
            </div>
          </div>
        )}

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
              disabled={isSaving || !formData.title || !formData.slug || !formData.excerpt}
            >
              {isEditMode ? 'Update Article' : 'Create Article'}
            </Button>
          </div>
        </div>
      </form>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          📝 Writing Tips
        </h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Use headings to structure your content</li>
          <li>Keep paragraphs concise and focused</li>
          <li>Add images to make the article more engaging</li>
          <li>Write a clear, compelling excerpt to attract readers</li>
          <li>After saving, you can submit the article for review</li>
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
