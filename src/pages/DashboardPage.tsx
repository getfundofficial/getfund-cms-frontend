import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { contentService } from '../services/contentService';
import { DashboardStats } from '../types/content.types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await contentService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDescription = () => {
    switch (user?.role) {
      case 'admin':
        return 'Full system access - Manage all content, users, and settings';
      case 'creator':
        return 'Create and edit draft content';
      case 'reviewer':
        return 'Review content and request changes';
      case 'approver':
        return 'Approve content for publication';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.full_name}!
          </h2>
          <p className="text-sm sm:text-base text-gray-600">{getRoleDescription()}</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {/* Total Web Pages */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Web Pages</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{stats.total_pages || 0}</p>
                </div>
                <div className="bg-blue-100 rounded-full p-2 sm:p-3 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total News Articles */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total News Articles</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{stats.total_news || 0}</p>
                </div>
                <div className="bg-purple-100 rounded-full p-2 sm:p-3 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Published */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Published</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1 sm:mt-2">{stats.published}</p>
                </div>
                <div className="bg-green-100 rounded-full p-2 sm:p-3 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* In Review */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">In Review</p>
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mt-1 sm:mt-2">{stats.in_review}</p>
                </div>
                <div className="bg-yellow-100 rounded-full p-2 sm:p-3 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Drafts */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Drafts</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-600 mt-1 sm:mt-2">{stats.draft}</p>
                </div>
                <div className="bg-gray-100 rounded-full p-2 sm:p-3 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {(user?.role === 'admin' || user?.role === 'creator') && (
              <button
                onClick={() => navigate('/admin/news/new')}
                className="flex items-center p-3 sm:p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition text-left"
              >
                <div className="bg-blue-100 rounded-full p-2 sm:p-3 mr-3 sm:mr-4 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate">Create News Article</h4>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Write a new article</p>
                </div>
              </button>
            )}

            {(user?.role === 'admin' || user?.role === 'creator') && (
              <button
                onClick={() => navigate('/admin/hero-slides/new')}
                className="flex items-center p-3 sm:p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition text-left"
              >
                <div className="bg-purple-100 rounded-full p-2 sm:p-3 mr-3 sm:mr-4 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate">Create Hero Slide</h4>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Add a carousel slide</p>
                </div>
              </button>
            )}

            <button
              onClick={() => navigate('/admin/news')}
              className="flex items-center p-3 sm:p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition text-left"
            >
              <div className="bg-green-100 rounded-full p-2 sm:p-3 mr-3 sm:mr-4 flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate">View All Content</h4>
                <p className="text-xs sm:text-sm text-gray-600 truncate">Browse all articles</p>
              </div>
            </button>

            {(user?.role === 'reviewer' || user?.role === 'admin') && (
              <button
                onClick={() => navigate('/admin/review')}
                className="flex items-center p-3 sm:p-4 border-2 border-yellow-200 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition text-left"
              >
                <div className="bg-yellow-100 rounded-full p-2 sm:p-3 mr-3 sm:mr-4 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate">Review Queue</h4>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{stats?.in_review || 0} items pending</p>
                </div>
              </button>
            )}

            {(user?.role === 'approver' || user?.role === 'admin') && (
              <button
                onClick={() => navigate('/admin/approval')}
                className="flex items-center p-3 sm:p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition text-left"
              >
                <div className="bg-indigo-100 rounded-full p-2 sm:p-3 mr-3 sm:mr-4 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate">Approval Queue</h4>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{stats?.approved || 0} ready to publish</p>
                </div>
              </button>
            )}

            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin/users')}
                className="flex items-center p-3 sm:p-4 border-2 border-red-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition text-left"
              >
                <div className="bg-red-100 rounded-full p-2 sm:p-3 mr-3 sm:mr-4 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate">Manage Users</h4>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">User accounts & roles</p>
                </div>
              </button>
            )}
          </div>
        </div>

      {/* Coming Soon Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          🚧 Content Management Interface
        </h3>
        <p className="text-blue-700">
          The full content management interface is being built. You can currently:
        </p>
        <ul className="list-disc list-inside mt-2 text-blue-700 space-y-1">
          <li>View your role and permissions</li>
          <li>See content statistics</li>
          <li>Navigate between pages using the sidebar</li>
          <li>Access the backend API directly at <code className="bg-blue-100 px-2 py-1 rounded">http://localhost:5000</code></li>
        </ul>
      </div>
    </div>
  );
};
