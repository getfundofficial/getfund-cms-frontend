import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import { useAuth } from '../context/AuthContext';
import { contentService } from '../services/contentService';
import { Content, WorkflowStatus } from '../types/content.types';
import { isAdminRole } from '../types/auth.types';
import { Button } from '../components/Common/Button';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/Common/LoadingScreen';

export const NewsListPage: React.FC = () => {
  const { user, hasActionPermission } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState<Content[]>([]);
  const [filteredContent, setFilteredContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    filterContent();
  }, [content, searchQuery, statusFilter, sortOrder]);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const data = await contentService.getAll({ type: 'news' });
      setContent(data);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterContent = () => {
    let filtered = [...content];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.excerpt?.toLowerCase().includes(query) ||
        item.creator_name?.toLowerCase().includes(query)
      );
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at).getTime();
      const dateB = new Date(b.published_at || b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredContent(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      await contentService.delete(id);
      setContent(content.filter(item => item.id !== id));
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete article');
    }
  };

  const handleSubmitForReview = async (id: string) => {
    try {
      await contentService.submit(id);
      await loadContent();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to submit for review');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await contentService.publish(id);
      await loadContent();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to publish');
    }
  };

  const handleUnpublish = async (id: string) => {
    if (!confirm('Are you sure you want to unpublish this article?')) return;

    try {
      await contentService.unpublish(id);
      await loadContent();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to unpublish');
    }
  };

  const handleToggleVisibility = async (item: Content) => {
    try {
      if (item.status === 'published') {
        await contentService.unpublish(item.id);
      } else {
        await contentService.publish(item.id);
      }
      await loadContent();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to toggle visibility');
    }
  };

  const canToggleVisibility = (item: Content) => {
    // Only admins with publish permission can toggle visibility
    if (!isAdminRole(user?.role) || !hasActionPermission('canPublish')) return false;
    return item.status === 'published' || item.status === 'approved';
  };

  const getStatusBadge = (status: WorkflowStatus) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700 border border-gray-300',
      in_review: 'bg-warning-50 text-warning-700 border border-warning-300',
      changes_requested: 'bg-orange-50 text-orange-700 border border-orange-300',
      approved: 'bg-success-50 text-success-700 border border-success-300',
      published: 'bg-accent-50 text-accent-700 border border-accent-300',
    };

    const labels = {
      draft: 'Draft',
      in_review: 'In Review',
      changes_requested: 'Changes Requested',
      approved: 'Approved',
      published: 'Published',
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-lg shadow-sm ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const canEdit = (item: Content) => {
    if (isAdminRole(user?.role)) return true;
    if (user?.role === 'creator' && item.created_by === user?.id) {
      return ['draft', 'changes_requested'].includes(item.status);
    }
    return false;
  };

  const canDelete = (item: Content) => {
    // Check if user has delete permission
    if (!hasActionPermission('canDelete')) {
      // Creators can delete their own drafts even without explicit permission
      if (user?.role === 'creator' && item.created_by === user?.id && item.status === 'draft') {
        return true;
      }
      return false;
    }

    // Users with delete permission can delete based on ownership and status
    if (isAdminRole(user?.role)) return true;
    if (item.created_by === user?.id) {
      return item.status === 'draft';
    }
    return false;
  };

  const canSubmit = (item: Content) => {
    if (user?.role !== 'creator' && !isAdminRole(user?.role)) return false;
    return item.status === 'draft' || item.status === 'changes_requested';
  };

  const canPublish = (item: Content) => {
    // Check if user has publish permission
    if (!hasActionPermission('canPublish')) return false;
    // Can only publish content that's been approved
    return item.status === 'approved';
  };

  const canUnpublish = (item: Content) => {
    // Only admins with publish permission can unpublish
    if (!isAdminRole(user?.role) || !hasActionPermission('canPublish')) return false;
    return item.status === 'published';
  };

  if (isLoading) {
    return <LoadingScreen message="Loading news articles..." />;
  }

  return (
    <>
      <Breadcrumb />
      <div className="space-y-4 sm:space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">News Articles</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage news articles and blog posts
          </p>
        </div>
        {(isAdminRole(user?.role) || user?.role === 'creator') && (
          <Button
            variant="primary"
            onClick={() => navigate('/admin/news/new')}
            className="w-full sm:w-auto"
          >
            + Create Article
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-soft p-5 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by title, excerpt, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as WorkflowStatus | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="in_review">In Review</option>
              <option value="changes_requested">Changes Requested</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredContent.length} of {content.length} articles
          </span>
          {(searchQuery || statusFilter !== 'all' || sortOrder !== 'newest') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setSortOrder('newest');
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Content Table/Cards */}
      <div className="bg-white rounded-xl shadow-soft overflow-hidden border border-gray-100">
        {filteredContent.length === 0 ? (
          <div className="text-center py-12 px-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating a new article'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filteredContent.map((item) => (
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
                      <div className="text-sm text-gray-900">{item.creator_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.published_at
                        ? new Date(item.published_at).toLocaleDateString()
                        : <span className="text-gray-400">Not set</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {/* Toggle Visibility */}
                        {canToggleVisibility(item) && (
                          <button
                            onClick={() => handleToggleVisibility(item)}
                            className={item.status === 'published' ? 'text-green-600 hover:text-green-900' : 'text-gray-400 hover:text-gray-600'}
                            title={item.status === 'published' ? 'Hide (Unpublish)' : 'Show (Publish)'}
                          >
                            {item.status === 'published' ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                            )}
                          </button>
                        )}

                        {/* Edit */}
                        {canEdit(item) && (
                          <button
                            onClick={() => navigate(`/admin/news/${item.id}/edit`)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        )}

                        {/* Submit for Review */}
                        {canSubmit(item) && (
                          <button
                            onClick={() => handleSubmitForReview(item.id)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Submit for Review"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          </button>
                        )}

                        {/* Publish */}
                        {canPublish(item) && (
                          <button
                            onClick={() => handlePublish(item.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Publish"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}

                        {/* Unpublish */}
                        {canUnpublish(item) && (
                          <button
                            onClick={() => handleUnpublish(item.id)}
                            className="text-orange-600 hover:text-orange-900"
                            title="Unpublish"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          </button>
                        )}

                        {/* Delete */}
                        {canDelete(item) && (
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-200">
            {filteredContent.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                        {item.excerpt}
                      </p>
                    )}
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="truncate">{item.creator_name}</span>
                  <span className="whitespace-nowrap ml-2">
                    {item.published_at
                      ? new Date(item.published_at).toLocaleDateString()
                      : 'No date'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {canToggleVisibility(item) && (
                    <button
                      onClick={() => handleToggleVisibility(item)}
                      className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md ${
                        item.status === 'published'
                          ? 'text-green-700 bg-green-50 hover:bg-green-100'
                          : 'text-gray-700 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {item.status === 'published' ? (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Hide
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                          Show
                        </>
                      )}
                    </button>
                  )}

                  {canEdit(item) && (
                    <button
                      onClick={() => navigate(`/admin/news/${item.id}/edit`)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-md hover:bg-indigo-100"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                  )}

                  {canSubmit(item) && (
                    <button
                      onClick={() => handleSubmitForReview(item.id)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-yellow-700 bg-yellow-50 rounded-md hover:bg-yellow-100"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Submit
                    </button>
                  )}

                  {canPublish(item) && (
                    <button
                      onClick={() => handlePublish(item.id)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Publish
                    </button>
                  )}

                  {canUnpublish(item) && (
                    <button
                      onClick={() => handleUnpublish(item.id)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-50 rounded-md hover:bg-orange-100"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      Unpublish
                    </button>
                  )}

                  {canDelete(item) && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          </>
        )}
      </div>
    </div>
    </>
  );
};
