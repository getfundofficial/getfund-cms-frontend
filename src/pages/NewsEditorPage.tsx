import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { contentService } from '../services/contentService';
import { Button } from '../components/Common/Button';
import { Input } from '../components/Common/Input';
import { RichTextEditor } from '../components/Editor/RichTextEditor';

export const NewsEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    tags: '',
  });

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

      if (!['draft', 'changes_requested'].includes(data.status)) {
        setError('You can only edit content in draft or changes_requested status');
        return;
      }

      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || '',
        content: data.body || '',
        featured_image: data.featured_image_url || '',
        tags: '',
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
      const payload = {
        type: 'news' as const,
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        featured_image: formData.featured_image || null,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Edit Article' : 'Create New Article'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditMode ? 'Update the article details below' : 'Fill in the details to create a new article'}
        </p>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Input
            type="url"
            label="Featured Image URL"
            placeholder="https://example.com/image.jpg"
            value={formData.featured_image}
            onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
            helperText="Optional: URL of the main image for this article"
          />

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
                className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none"
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
    </div>
  );
};
