import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../Common/Button';
import NotificationBell from './NotificationBell';
import { useNotificationCount } from '../../hooks/useNotificationCount';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavChildItem {
  path: string;
  label: string;
}

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
  show: boolean;
  badge?: number;
  children?: NavChildItem[];
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout, hasNavPermission, hasAdminPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const { counts } = useNotificationCount({
    enabled: hasAdminPermission('users'),
  });

  const toggleMenu = (path: string) => {
    setExpandedMenus(prev =>
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  const isMenuExpanded = (path: string) => {
    return expandedMenus.includes(path) || location.pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin':
        return 'bg-gradient-to-r from-primary-600 to-primary-500';
      case 'restricted_admin':
        return 'bg-gradient-to-r from-indigo-600 to-indigo-500';
      case 'creator':
        return 'bg-gradient-to-r from-accent-600 to-accent-500';
      case 'reviewer':
        return 'bg-gradient-to-r from-secondary-600 to-secondary-500';
      case 'approver':
        return 'bg-gradient-to-r from-success-600 to-success-500';
      default:
        return 'bg-gradient-to-r from-gray-600 to-gray-500';
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems: NavItem[] = [
    {
      path: '/admin/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: 'Dashboard',
      show: hasNavPermission('dashboard'),
    },
    {
      path: '/admin/news',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      label: 'News Articles',
      show: hasNavPermission('news'),
    },
    {
      path: '/admin/pages',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      label: 'Pages',
      show: hasNavPermission('pages'),
    },
    {
      path: '/admin/review',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      label: 'Review Queue',
      show: hasNavPermission('reviewQueue'),
    },
    {
      path: '/admin/approval',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Approval Queue',
      show: hasNavPermission('approvalQueue'),
    },
    {
      path: '/admin/media',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Media Library',
      show: hasNavPermission('mediaLibrary'),
    },
    {
      path: '/admin/impact-stats',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      label: 'Impact Stats',
      show: hasNavPermission('impactStats'),
    },
    {
      path: '/admin/campaigns',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Fundraising Campaigns',
      show: hasNavPermission('campaigns'),
    },
    {
      path: '/admin/lottery',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      label: 'Lottery',
      show: hasAdminPermission('lotteryConfig') || hasAdminPermission('lotteryEntries'),
      children: [
        { path: '/admin/lottery/config', label: 'Lottery Config' },
        { path: '/admin/lottery/entries', label: 'Lottery Entries' },
      ],
    },
    {
      path: '/admin/footer-settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      label: 'Footer Settings',
      show: hasAdminPermission('footerSettings'),
    },
    {
      path: '/admin/pledges',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      label: 'Pledges',
      show: hasAdminPermission('pledges'),
    },
    {
      path: '/admin/donations',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'All Donations',
      show: hasAdminPermission('donations'),
    },
    {
      path: '/admin/team-members',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      label: 'Team Members',
      show: hasNavPermission('teamMembers'),
    },
    {
      path: '/admin/partners',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      label: 'Partners',
      show: true,
    },
    {
      path: '/admin/users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      label: 'Users',
      show: hasAdminPermission('users'),
      badge: counts.passwordResetRequests,
    },
    {
      path: '/admin/audit-logs',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      label: 'Audit Logs',
      show: hasAdminPermission('auditLogs'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed inset-y-0 left-0 z-50 w-64 ${
          isSidebarOpen ? 'lg:w-64' : 'lg:w-20'
        } bg-white shadow-xl transition-all duration-300 flex flex-col border-r border-gray-200 lg:rounded-r-2xl`}
      >
        {/* Logo/Brand */}
        <div className="p-5 border-b border-gray-200 bg-gradient-to-br from-primary-50 to-white">
          <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center lg:flex-col lg:gap-3'}`}>
            {/* Full logo on mobile, conditional on desktop */}
            <div className="lg:hidden flex items-center gap-3">
              <div className="bg-white rounded-xl shadow-sm p-2">
                <img
                  src="/images/logos/getfund-logo.png"
                  alt="GETFund Logo"
                  className="h-14 w-auto"
                />
              </div>
            </div>
            {/* Desktop: Show based on sidebar state */}
            {isSidebarOpen ? (
              <div className="hidden lg:flex items-center gap-3">
                <div className="bg-white rounded-xl shadow-sm p-2">
                  <img
                    src="/images/logos/getfund-logo.png"
                    alt="GETFund Logo"
                    className="h-14 w-auto"
                  />
                </div>
              </div>
            ) : (
              <div className="hidden lg:block bg-white rounded-xl shadow-sm p-2">
                <img
                  src="/images/logos/getfund-cropped-icon.png"
                  alt="GETFund"
                  className="h-10 w-10"
                />
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-primary-100 hidden lg:block transition-all hover:scale-105"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-4 h-4 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isSidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                )}
              </svg>
            </button>
            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-primary-100 lg:hidden transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems
            .filter(item => item.show)
            .map((item) => (
              <div key={item.path}>
                {item.children ? (
                  // Collapsible menu item
                  <>
                    <button
                      onClick={() => toggleMenu(item.path)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-md'
                          : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isActive(item.path) ? 'scale-110' : ''}>
                          {item.icon}
                        </span>
                        <span className={`text-sm font-medium lg:hidden`}>{item.label}</span>
                        {isSidebarOpen && <span className="hidden lg:inline text-sm font-medium">{item.label}</span>}
                      </div>
                      {isSidebarOpen && (
                        <svg
                          className={`w-4 h-4 transition-transform ${isMenuExpanded(item.path) ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>
                    {isMenuExpanded(item.path) && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                              location.pathname === child.path
                                ? 'bg-primary-100 text-primary-700 font-semibold'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-current opacity-50"></span>
                            <span className="text-sm">{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  // Regular menu item
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-md scale-105'
                        : 'text-gray-700 hover:bg-gray-100 hover:scale-102 hover:shadow-sm'
                    }`}
                  >
                    <span className={isActive(item.path) ? 'scale-110' : ''}>
                      {item.icon}
                    </span>
                    <span className={`text-sm font-medium lg:hidden flex-1`}>{item.label}</span>
                    {isSidebarOpen && <span className="hidden lg:inline text-sm font-medium flex-1">{item.label}</span>}
                    {item.badge && item.badge > 0 ? (
                      <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full ${
                        isActive(item.path) ? 'bg-white/30 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    ) : null}
                  </Link>
                )}
              </div>
            ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white">
          {/* Full user info on mobile */}
          <div className="lg:hidden">
            <div className="flex items-center gap-3 mb-3 bg-white rounded-xl p-3 shadow-sm border border-gray-200">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${getRoleColor()} shadow-sm`}>
                <span className="text-white font-bold text-lg">
                  {user?.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.full_name}
                </p>
                <span className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-bold text-white rounded-md ${getRoleColor()} shadow-sm`}>
                  {user?.role.toUpperCase()}
                </span>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              className="w-full text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Button>
          </div>

          {/* Desktop: Show based on sidebar state */}
          {isSidebarOpen ? (
            <div className="hidden lg:block">
              <div className="flex items-center gap-3 mb-3 bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${getRoleColor()} shadow-sm`}>
                  <span className="text-white font-bold text-lg">
                    {user?.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.full_name}
                  </p>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-bold text-white rounded-md ${getRoleColor()} shadow-sm`}>
                    {user?.role.toUpperCase()}
                  </span>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                className="w-full text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </Button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="hidden lg:block w-full p-3 rounded-xl hover:bg-primary-100 transition-all hover:scale-105 group"
              title="Logout"
              aria-label="Logout"
            >
              <svg className="w-5 h-5 text-primary-600 mx-auto group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 overflow-auto w-full ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-30 border-b border-gray-200 lg:rounded-b-2xl lg:mx-4 lg:mt-4">
          <div className="px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 rounded-xl hover:bg-primary-50 lg:hidden transition-all hover:scale-105"
                  aria-label="Open menu"
                >
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                    {navItems.find(item => isActive(item.path))?.label || 'Dashboard'}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                {hasAdminPermission('users') && (
                  <NotificationBell counts={counts} />
                )}
                <a
                  href={import.meta.env.VITE_PUBLIC_WEBSITE_URL || "https://getfund-website.vercel.app"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all hover:shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="hidden sm:inline">View Website</span>
                  <span className="sm:hidden">Website</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
