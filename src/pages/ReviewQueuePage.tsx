import React, { useEffect, useState } from 'react';
import { contentService } from '../services/contentService';
import { Content } from '../types/content.types';
import { Button } from '../components/Common/Button';

export const ReviewQueuePage: React.FC = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Content | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadReviewQueue();
  }, []);

  const loadReviewQueue = async () => {
    try {
      setIsLoading(true);
      // Get all content in review status
      const allContent = await contentService.getAll({});
      const reviewItems = allContent.filter(item => item.status === 'in_review');
      setContent(reviewItems);
    } catch (error) {
      console.error('Failed to load review queue:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Are you sure you want to approve this content?')) return;

    try {
      setIsSubmitting(true);
      await contentService.approve(id);
      await loadReviewQueue();
      setSelectedItem(null);
      setReviewNotes('');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to approve content');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestChanges = async (id: string) => {
    if (!reviewNotes.trim()) {
      alert('Please provide notes explaining what changes are needed');
      return;
    }

    try {
      setIsSubmitting(true);
      await contentService.requestChanges(id, reviewNotes);
      await loadReviewQueue();
      setSelectedItem(null);
      setReviewNotes('');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to request changes');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getContentTypeBadge = (type: string) => {
    const styles = {
      news: 'bg-blue-100 text-blue-800',
      hero_slide: 'bg-purple-100 text-purple-800',
    };

    const labels = {
      news: 'News Article',
      hero_slide: 'Hero Slide',
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${styles[type as keyof typeof styles]}`}>
        {labels[type as keyof typeof labels]}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading review queue...</p>
        </div>
      </div>
    );
  }

  if (selectedItem) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Review Content</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Review and provide feedback</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedItem(null);
              setReviewNotes('');
            }}
            className="w-full sm:w-auto"
          >
            Back to Queue
          </Button>
        </div>

        {/* Content Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            {getContentTypeBadge(selectedItem.type)}
            <span className="text-sm text-gray-500">
              by {selectedItem.creator_name}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {selectedItem.title}
          </h2>
          {selectedItem.excerpt && (
            <p className="text-gray-600">{selectedItem.excerpt}</p>
          )}
        </div>

        {/* Content Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Preview</h3>

          {selectedItem.featured_image_url && (
            <img
              src={selectedItem.featured_image_url}
              alt={selectedItem.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}

          {selectedItem.type === 'news' ? (
            <div
              className="prose prose-sm sm:prose lg:prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedItem.body || '' }}
            />
          ) : (
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Subtitle</p>
                <p className="text-base text-gray-900">{selectedItem.excerpt}</p>
              </div>
              {selectedItem.body && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Button Configuration</p>
                  <pre className="text-sm bg-gray-50 p-3 rounded">
                    {JSON.stringify(JSON.parse(selectedItem.body), null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Review Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Decision</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review Notes (Optional for approval, Required for requesting changes)
            </label>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Provide feedback or notes about this content..."
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="success"
              onClick={() => handleApprove(selectedItem.id)}
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              ✓ Approve Content
            </Button>
            <Button
              variant="danger"
              onClick={() => handleRequestChanges(selectedItem.id)}
              disabled={isSubmitting || !reviewNotes.trim()}
            >
              ✗ Request Changes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Review Queue</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Content awaiting review ({content.length} items)
        </p>
      </div>

      {/* Queue List */}
      {content.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center">
          <svg
            className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Review queue is empty</h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            No content is currently waiting for review
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {content.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.title}
                      </div>
                      {item.excerpt && (
                        <div className="text-sm text-gray-500 truncate max-w-md">
                          {item.excerpt}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getContentTypeBadge(item.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.creator_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setSelectedItem(item)}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden bg-white rounded-lg shadow-sm divide-y divide-gray-200">
            {content.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50">
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  {item.excerpt && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {item.excerpt}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    {getContentTypeBadge(item.type)}
                    <span className="text-xs text-gray-500">
                      By {item.creator_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(item.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedItem(item)}
                  className="w-full"
                >
                  Review
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
