import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import { useAuth } from '../context/AuthContext';
import { contentService } from '../services/contentService';
import { Content, WorkflowStatus } from '../types/content.types';
import { Button } from '../components/Common/Button';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/Common/LoadingScreen';

export const HeroSlidesListPage: React.FC = () => {
  const { user, hasNavPermission, hasActionPermission } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState<Content[]>([]);
  const [filteredContent, setFilteredContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus | 'all'>('all');

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    filterContent();
  }, [content, statusFilter]);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const data = await contentService.getAll({ type: 'hero_slide' });
      setContent(data);
    } catch (error) {
      console.error('Failed to load hero slides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterContent = () => {
    let filtered = [...content];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredContent(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero slide?')) return;

    try {
      await contentService.delete(id);
      setContent(content.filter(item => item.id !== id));
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete hero slide');
    }
  };

  const getStatusBadge = (status: WorkflowStatus) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      in_review: 'bg-yellow-100 text-yellow-800',
      changes_requested: 'bg-orange-100 text-orange-800',
      approved: 'bg-green-100 text-green-800',
      published: 'bg-blue-100 text-blue-800',
    };

    const labels = {
      draft: 'Draft',
      in_review: 'In Review',
      changes_requested: 'Changes Requested',
      approved: 'Approved',
      published: 'Published',
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const canEdit = (item: Content) => {
    // Admins can edit anything
    if (user?.role === 'admin') return true;
    // Creators can edit their own content
    return user?.role === 'creator' && item.created_by === user?.id;
  };

  const canDelete = (item: Content) => {
    // Check if user has delete permission
    if (!hasActionPermission('canDelete')) {
      // Creators can delete their own content even without explicit permission
      if (user?.role === 'creator' && item.created_by === user?.id) {
        return true;
      }
      return false;
    }

    // Users with delete permission can delete based on ownership
    if (user?.role === 'admin') return true;
    return item.created_by === user?.id;
  };

  if (isLoading) {
    return <LoadingScreen message="Loading hero slides..." />;
  }

  return (
    <>
      <Breadcrumb />
      <div className="space-y-4 sm:space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Hero Slides</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage homepage carousel slides
          </p>
        </div>
        {hasNavPermission('heroSlides') && (
          <Button
            variant="primary"
            onClick={() => navigate('/admin/hero-slides/new')}
            className="w-full sm:w-auto"
          >
            + Create Hero Slide
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="w-full sm:w-64">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as WorkflowStatus | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-h-touch"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="in_review">In Review</option>
              <option value="changes_requested">Changes Requested</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-right">
            Showing {filteredContent.length} of {content.length} slides
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {filteredContent.length === 0 ? (
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hero slides found</h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            {statusFilter !== 'all'
              ? 'Try adjusting your filter'
              : 'Get started by creating a new hero slide'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredContent.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image */}
              {item.featured_image_url && (
                <div className="aspect-video bg-gray-200 relative">
                  <img
                    src={item.featured_image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=No+Image';
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(item.status)}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate">
                  {item.title}
                </h3>
                {item.excerpt && (
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                    {item.excerpt}
                  </p>
                )}
                <div className="text-xs text-gray-500 mb-3">
                  By {item.creator_name} • {new Date(item.updated_at).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {canEdit(item) && (
                    <button
                      onClick={() => navigate(`/admin/hero-slides/${item.id}/edit`)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-xs sm:text-sm font-medium transition-colors min-h-touch"
                    >
                      Edit
                    </button>
                  )}

                  {canDelete(item) && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-xs sm:text-sm font-medium transition-colors min-h-touch"
                    >
                      Delete
                    </button>
                  )}
                </div>

                {/* Status Info */}
                <div className="mt-2 text-xs text-gray-500">
                  {item.status === 'published' ? (
                    <span className="text-green-600 font-medium">✓ Live on website</span>
                  ) : (
                    <span className="text-orange-600">Not published yet</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};
