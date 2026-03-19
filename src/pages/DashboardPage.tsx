import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { contentService } from '../services/contentService';
import { DashboardStats } from '../types/content.types';
import { isAdminRole } from '../types/auth.types';
import LoadingScreen from '../components/Common/LoadingScreen';
import { CalendarWidget } from '../components/Dashboard/CalendarWidget';

export const DashboardPage: React.FC = () => {
  const { user, hasAdminPermission } = useAuth();
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
    return <LoadingScreen message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-large p-6 sm:p-8 text-white animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1">
                Welcome back, {user?.full_name}!
              </h2>
              <p className="text-sm sm:text-base text-primary-50">{getRoleDescription()}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {/* Total Web Pages */}
            <div className="bg-white rounded-xl shadow-soft hover:shadow-medium transition-shadow p-5 sm:p-6 border border-gray-100 card-hover animate-fade-in">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg p-3 shadow-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Total Web Pages</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_pages || 0}</p>
              </div>
            </div>

            {/* Total News Articles */}
            <div className="bg-white rounded-xl shadow-soft hover:shadow-medium transition-shadow p-5 sm:p-6 border border-gray-100 card-hover animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg p-3 shadow-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Total News Articles</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_news || 0}</p>
              </div>
            </div>

            {/* Published */}
            <div className="bg-white rounded-xl shadow-soft hover:shadow-medium transition-shadow p-5 sm:p-6 border border-gray-100 card-hover animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-gradient-to-br from-success-500 to-success-600 rounded-lg p-3 shadow-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Published</p>
                <p className="text-3xl font-bold text-success-600">{stats.published}</p>
              </div>
            </div>

            {/* In Review */}
            <div className="bg-white rounded-xl shadow-soft hover:shadow-medium transition-shadow p-5 sm:p-6 border border-gray-100 card-hover animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-gradient-to-br from-warning-500 to-warning-600 rounded-lg p-3 shadow-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">In Review</p>
                <p className="text-3xl font-bold text-warning-600">{stats.in_review}</p>
              </div>
            </div>

            {/* Drafts */}
            <div className="bg-white rounded-xl shadow-soft hover:shadow-medium transition-shadow p-5 sm:p-6 border border-gray-100 card-hover animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg p-3 shadow-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Drafts</p>
                <p className="text-3xl font-bold text-gray-600">{stats.draft}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions and Calendar Row */}
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-4 sm:gap-6">
          {/* Quick Actions */}
          <div className="flex-1 bg-white rounded-xl shadow-soft p-6 sm:p-8 border border-gray-100 flex flex-col">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Actions
            </h3>
            <div className="space-y-6">
              {/* Content Creation */}
              {(isAdminRole(user?.role) || user?.role === 'creator') && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Content Creation</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => navigate('/admin/news/new')}
                      className="group flex items-center p-4 border-2 border-accent-200 rounded-xl hover:border-accent-400 hover:bg-accent-50 transition-all hover:shadow-md text-left"
                    >
                      <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg p-3 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900">New Article</h4>
                        <p className="text-xs text-gray-500">Write a news article</p>
                      </div>
                    </button>

                    <button
                      onClick={() => navigate('/admin/media')}
                      className="group flex items-center p-4 border-2 border-primary-200 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-all hover:shadow-md text-left"
                    >
                      <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg p-3 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900">Upload Media</h4>
                        <p className="text-xs text-gray-500">Add images & files</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Workflow */}
              {(user?.role === 'reviewer' || user?.role === 'approver' || isAdminRole(user?.role)) && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Workflow</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(user?.role === 'reviewer' || isAdminRole(user?.role)) && (
                      <button
                        onClick={() => navigate('/admin/review')}
                        className="group flex items-center p-4 border-2 border-yellow-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition-all hover:shadow-md text-left"
                      >
                        <div className="bg-gradient-to-br from-warning-500 to-warning-600 rounded-lg p-3 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-900">Review Queue</h4>
                          <p className="text-xs text-gray-500">{stats?.in_review || 0} items pending</p>
                        </div>
                        {(stats?.in_review || 0) > 0 && (
                          <span className="bg-warning-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                            {stats?.in_review}
                          </span>
                        )}
                      </button>
                    )}

                    {(user?.role === 'approver' || isAdminRole(user?.role)) && (
                      <button
                        onClick={() => navigate('/admin/approval')}
                        className="group flex items-center p-4 border-2 border-indigo-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all hover:shadow-md text-left"
                      >
                        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-3 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-900">Approval Queue</h4>
                          <p className="text-xs text-gray-500">{stats?.approved || 0} ready to publish</p>
                        </div>
                        {(stats?.approved || 0) > 0 && (
                          <span className="bg-indigo-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                            {stats?.approved}
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="lg:w-80 flex-shrink-0 flex">
            <div className="w-full">
              <CalendarWidget />
            </div>
          </div>
        </div>
    </div>
  );
};
