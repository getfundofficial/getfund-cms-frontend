import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { contentService } from '../services/contentService';
import { Content } from '../types/content.types';
import { Button } from '../components/Common/Button';

export const HeroSlideViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadContent(id);
    }
  }, [id]);

  const loadContent = async (contentId: string) => {
    try {
      setIsLoading(true);
      const data = await contentService.getById(contentId);
      setContent(data);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to load content');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      in_review: 'bg-yellow-100 text-yellow-800',
      changes_requested: 'bg-orange-100 text-orange-800',
      approved: 'bg-green-100 text-green-800',
      published: 'bg-blue-100 text-blue-800',
    };

    const labels: Record<string, string> = {
      draft: 'Draft',
      in_review: 'In Review',
      changes_requested: 'Changes Requested',
      approved: 'Approved',
      published: 'Published',
    };

    return (
      <span className={`px-3 py-1 text-sm font-semibold rounded ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const canEdit = () => {
    if (!content) return false;
    if (user?.role === 'admin') return true;
    if (user?.role === 'creator' && content.created_by === user?.id) {
      return ['draft', 'changes_requested'].includes(content.status);
    }
    return false;
  };

  // Parse button data from body field
  let buttonData = { buttonText: '', buttonLink: '' };
  if (content?.body) {
    try {
      buttonData = JSON.parse(content.body);
    } catch {
      buttonData = { buttonText: '', buttonLink: '' };
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading hero slide...</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
        <p className="text-red-700">{error || 'Hero slide not found'}</p>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">View Hero Slide</h1>
          <p className="text-gray-600 mt-1">Preview how the slide will appear</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate('/admin/hero-slides')}
          >
            Back to List
          </Button>
          {canEdit() && (
            <Button
              variant="primary"
              onClick={() => navigate(`/admin/hero-slides/${id}/edit`)}
            >
              Edit Slide
            </Button>
          )}
        </div>
      </div>

      {/* Slide Info Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {getStatusBadge(content.status)}
              <span className="text-sm text-gray-500">
                by {content.creator_name}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {content.title}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-500">Slug</p>
            <p className="text-sm font-medium text-gray-900">{content.slug}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(content.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Updated</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(content.updated_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="text-sm font-medium text-gray-900 capitalize">Hero Slide</p>
          </div>
        </div>
      </div>

      {/* Preview - Full Width */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
          <p className="text-sm text-gray-600">How this slide will appear on the website</p>
        </div>

        <div className="relative aspect-video bg-gray-900">
          {content.featured_image_url ? (
            <img
              src={content.featured_image_url}
              alt={content.title}
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
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              {content.title}
            </h1>
            {content.excerpt && (
              <p className="text-xl md:text-2xl mb-6 drop-shadow-lg max-w-2xl">
                {content.excerpt}
              </p>
            )}
            {buttonData.buttonText && (
              <a
                href={buttonData.buttonLink || '#'}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                {buttonData.buttonText}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Slide Details</h3>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Title</p>
            <p className="text-base text-gray-900">{content.title}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Subtitle/Description</p>
            <p className="text-base text-gray-900">{content.excerpt}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Featured Image URL</p>
            <a
              href={content.featured_image_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-blue-600 hover:text-blue-800 break-all"
            >
              {content.featured_image_url || 'No image'}
            </a>
          </div>

          {buttonData.buttonText && (
            <>
              <div>
                <p className="text-sm font-medium text-gray-500">Button Text</p>
                <p className="text-base text-gray-900">{buttonData.buttonText}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Button Link</p>
                <a
                  href={buttonData.buttonLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-blue-600 hover:text-blue-800 break-all"
                >
                  {buttonData.buttonLink}
                </a>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Workflow Notes */}
      {content.review_notes && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            Review Notes
          </h3>
          <p className="text-yellow-800">{content.review_notes}</p>
        </div>
      )}
    </div>
  );
};
