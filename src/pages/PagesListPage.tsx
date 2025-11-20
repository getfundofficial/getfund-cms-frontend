import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { pageService, Page } from '../services/pageService';
import { Button } from '../components/Common/Button';

export const PagesListPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setIsLoading(true);
      const data = await pageService.getAll();
      setPages(data);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to load pages');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async (slug: string) => {
    if (!confirm('Publish this page?')) return;

    try {
      await pageService.publish(slug);
      loadPages();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to publish page');
    }
  };

  const handleUnpublish = async (slug: string) => {
    if (!confirm('Unpublish this page? It will no longer be visible on the website.')) return;

    try {
      await pageService.unpublish(slug);
      loadPages();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to unpublish page');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this page? This action cannot be undone and will delete all sections.')) return;

    try {
      await pageService.delete(slug);
      loadPages();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete page');
    }
  };

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
          <p className="text-gray-600 mt-1">Edit website pages and manage their sections</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Search pages by title or slug..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Page
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sections
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPages.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  {searchQuery ? 'No pages found matching your search.' : 'No pages available yet. Pages need to be created by an administrator to represent your website structure (About, Programs, Contact, etc.).'}
                </td>
              </tr>
            ) : (
              filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{page.title}</div>
                      <div className="text-sm text-gray-500">/{page.slug}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {page.section_count || 0} {page.section_count === 1 ? 'section' : 'sections'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        page.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {page.is_active ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(page.updated_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      by {page.updater_name || 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => navigate(`/admin/pages/${page.slug}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>

                    {user?.role === 'admin' && (
                      <>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => navigate(`/admin/pages/${page.slug}/permissions`)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Permissions
                        </button>
                      </>
                    )}

                    {(user?.role === 'admin' || user?.role === 'approver') && (
                      <>
                        <span className="text-gray-300">|</span>
                        {page.is_active ? (
                          <button
                            onClick={() => handleUnpublish(page.slug)}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            Unpublish
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePublish(page.slug)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Publish
                          </button>
                        )}
                      </>
                    )}

                    {user?.role === 'admin' && (
                      <>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleDelete(page.slug)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          About Page Management
        </h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Edit existing website pages (About, Programs, Contact, etc.)</li>
          <li>Each page is divided into editable sections you can modify independently</li>
          <li>Add new sections or edit existing ones with different content types</li>
          <li>Changes are auto-saved and version tracked</li>
          <li>Only published pages are visible on the public website</li>
        </ul>
      </div>
    </div>
  );
};
