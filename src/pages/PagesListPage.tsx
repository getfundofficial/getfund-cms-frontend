import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { pageService, Page } from '../services/pageService';
import { Button } from '../components/Common/Button';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import { GripVertical, Eye, EyeOff, Star, Menu, Save } from 'lucide-react';
import LoadingScreen from '../components/Common/LoadingScreen';

export const PagesListPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);

  useEffect(() => {
    loadPages();
  }, []);

  // Track loading time to show timeout message
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingTime(prev => prev + 1);
      }, 1000);
    } else {
      setLoadingTime(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const loadPages = async () => {
    try {
      setIsLoading(true);
      setError('');
      console.log('[PagesListPage] Fetching pages...');
      const data = await pageService.getAll();
      console.log('[PagesListPage] Received pages:', data?.length);
      // Sort by menu_order
      const sorted = data.sort((a, b) => (a.menu_order || 0) - (b.menu_order || 0));
      setPages(sorted);
    } catch (error: any) {
      console.error('[PagesListPage] Error loading pages:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.details || error.message || 'Failed to load pages';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const menuItems = pages.filter(p => p.show_in_menu && !p.is_cta_button);
    const newMenuItems = [...menuItems];
    const draggedPage = newMenuItems[draggedIndex];
    
    // Remove from old position and insert at new position
    newMenuItems.splice(draggedIndex, 1);
    newMenuItems.splice(targetIndex, 0, draggedPage);

    // Update menu_order for all menu items
    newMenuItems.forEach((page, idx) => {
      page.menu_order = idx + 1;
    });

    // Merge back with non-menu pages
    const nonMenuPages = pages.filter(p => !p.show_in_menu || p.is_cta_button);
    const allPages = [...newMenuItems, ...nonMenuPages];
    
    setPages(allPages);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const toggleShowInMenu = async (slug: string, currentValue: boolean) => {
    try {
      await pageService.updateMenuConfig(slug, { show_in_menu: !currentValue });
      loadPages();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update menu visibility');
    }
  };

  const toggleCTAButton = async (slug: string, currentValue: boolean) => {
    const ctaButtons = pages.filter(p => p.is_cta_button);
    
    if (!currentValue && ctaButtons.length >= 1) {
      alert('Only 1 CTA button allowed. Please remove the existing CTA button first.');
      return;
    }

    try {
      await pageService.updateMenuConfig(slug, {
        is_cta_button: !currentValue,
        show_in_menu: !currentValue ? false : undefined
      });
      loadPages();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update CTA button');
    }
  };

  const saveMenuOrder = async () => {
    try {
      setIsSaving(true);
      for (const page of pages) {
        await pageService.updateMenuConfig(page.slug, { menu_order: page.menu_order });
      }
      alert('Menu order saved successfully!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to save menu order');
    } finally {
      setIsSaving(false);
    }
  };

  const updateMenuLabel = async (slug: string, newLabel: string) => {
    try {
      await pageService.updateMenuConfig(slug, { menu_label: newLabel });
    } catch (error: any) {
      console.error('Failed to update menu label:', error);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <img
              src="/images/logos/getfund-cropped-icon.png"
              alt="GETFund Logo"
              className="w-full h-full object-contain animate-spin-slow"
              loading="eager"
            />
          </div>
          <p className="text-gray-600 text-lg font-medium mb-2">Loading pages...</p>
          {loadingTime > 5 && (
            <p className="text-gray-500 text-sm">
              {loadingTime > 30
                ? 'This is taking longer than expected. The database may be waking up...'
                : `Please wait... (${loadingTime}s)`}
            </p>
          )}
          {loadingTime > 60 && (
            <button
              onClick={() => loadPages()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  const menuItems = filteredPages.filter(p => p.show_in_menu && !p.is_cta_button);
  const ctaButton = filteredPages.find(p => p.is_cta_button);
  const otherPages = filteredPages.filter(p => !p.show_in_menu && !p.is_cta_button);

  return (
    <>
      <Breadcrumb />
      <div className="space-y-4 sm:space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Pages & Menu</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Configure navigation menu and edit website pages</p>
          </div>
        <Button
          onClick={saveMenuOrder}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Menu Order'}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">Failed to load pages</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => loadPages()}
              className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Menu Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm font-semibold text-blue-900 mb-1">Menu Configuration</h3>
            <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
              <li>• Add pages to the main navigation using the eye icon</li>
              <li>• <strong>1 CTA button</strong> (Call-to-Action button)</li>
              <li className="hidden sm:block">• Drag and drop to reorder menu items</li>
              <li>• Currently: <strong>{menuItems.length} menu items</strong>, <strong>{ctaButton ? '1/1' : '0/1'} CTA button</strong></li>
            </ul>
          </div>
        </div>
      </div>

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

      {/* Main Menu Items */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Main Menu Items ({menuItems.length})</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            <span className="hidden sm:inline">Drag to reorder • Click eye icon to hide from menu</span>
            <span className="sm:hidden">Tap to edit • Click eye to remove</span>
          </p>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block divide-y divide-gray-200">
          {menuItems.map((page, index) => (
            <div
              key={page.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`px-6 py-4 flex items-center space-x-4 hover:bg-gray-50 cursor-move ${
                draggedIndex === index ? 'opacity-50 bg-blue-50' : ''
              }`}
            >
              <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1">
                  <span className="text-sm font-medium text-gray-500">#{page.menu_order}</span>
                </div>
                <div className="col-span-4">
                  <input
                    type="text"
                    value={page.menu_label || page.title}
                    onChange={(e) => {
                      const newPages = [...pages];
                      const pageIndex = newPages.findIndex(p => p.id === page.id);
                      newPages[pageIndex].menu_label = e.target.value;
                      setPages(newPages);
                    }}
                    onBlur={(e) => updateMenuLabel(page.slug, e.target.value)}
                    className="text-sm font-medium text-gray-900 border-0 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:ring-0 px-0 py-1 w-full"
                    placeholder="Menu label"
                  />
                  <div className="text-xs text-gray-500">/{page.slug}</div>
                </div>
                <div className="col-span-2 text-center">
                  <div className="text-sm text-gray-900">
                    {page.section_count || 0} {page.section_count === 1 ? 'section' : 'sections'}
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      page.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {page.is_active ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="col-span-3 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => toggleShowInMenu(page.slug, true)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                    title="Remove from menu"
                  >
                    <EyeOff className="w-4 h-4" />
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => navigate(`/admin/pages/${page.slug}`)}
                    className="text-sm text-blue-600 hover:text-blue-900 font-medium"
                  >
                    Edit
                  </button>
                  {(user?.role === 'admin' || user?.role === 'approver') && (
                    <>
                      <span className="text-gray-300">|</span>
                      {page.is_active ? (
                        <button
                          onClick={() => handleUnpublish(page.slug)}
                          className="text-sm text-orange-600 hover:text-orange-900 font-medium"
                        >
                          Unpublish
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePublish(page.slug)}
                          className="text-sm text-green-600 hover:text-green-900 font-medium"
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
                        className="text-sm text-red-600 hover:text-red-900 font-medium"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          {menuItems.length === 0 && !searchQuery && (
            <div className="px-6 py-8 text-center text-gray-500">
              No menu items configured. Add pages to the menu from "Other Pages" below.
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200">
          {menuItems.map((page) => (
            <div key={page.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-500">#{page.menu_order}</span>
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                        page.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {page.is_active ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={page.menu_label || page.title}
                    onChange={(e) => {
                      const newPages = [...pages];
                      const pageIndex = newPages.findIndex(p => p.id === page.id);
                      newPages[pageIndex].menu_label = e.target.value;
                      setPages(newPages);
                    }}
                    onBlur={(e) => updateMenuLabel(page.slug, e.target.value)}
                    className="text-sm font-medium text-gray-900 border-0 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:ring-0 px-0 py-1 w-full mb-1"
                    placeholder="Menu label"
                  />
                  <div className="text-xs text-gray-500">
                    /{page.slug} • {page.section_count || 0} {page.section_count === 1 ? 'section' : 'sections'}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => toggleShowInMenu(page.slug, true)}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100"
                >
                  <EyeOff className="w-3 h-3 mr-1" />
                  Remove
                </button>
                <button
                  onClick={() => navigate(`/admin/pages/${page.slug}`)}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
                >
                  Edit
                </button>
                {(user?.role === 'admin' || user?.role === 'approver') && (
                  <>
                    {page.is_active ? (
                      <button
                        onClick={() => handleUnpublish(page.slug)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-50 rounded-md hover:bg-orange-100"
                      >
                        Unpublish
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePublish(page.slug)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100"
                      >
                        Publish
                      </button>
                    )}
                  </>
                )}
                {user?.role === 'admin' && (
                  <button
                    onClick={() => handleDelete(page.slug)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
          {menuItems.length === 0 && !searchQuery && (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              No menu items configured. Add pages to the menu from "Other Pages" below.
            </div>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">CTA Button ({ctaButton ? '1/1' : '0/1'})</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Primary call-to-action button</p>
        </div>
        <div className="p-4 sm:p-6">
          {ctaButton ? (
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:space-x-4 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600 flex-shrink-0 hidden md:block" />
              <div className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 md:items-center">
                <div className="md:col-span-5">
                  <input
                    type="text"
                    value={ctaButton.menu_label || ctaButton.title}
                    onChange={(e) => {
                      const newPages = [...pages];
                      const pageIndex = newPages.findIndex(p => p.id === ctaButton.id);
                      newPages[pageIndex].menu_label = e.target.value;
                      setPages(newPages);
                    }}
                    onBlur={(e) => updateMenuLabel(ctaButton.slug, e.target.value)}
                    className="text-sm font-medium text-gray-900 border-0 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:ring-0 px-0 py-1 bg-transparent w-full"
                  />
                  <div className="text-xs text-gray-500">/{ctaButton.slug}</div>
                </div>
                <div className="md:col-span-2 flex md:justify-center items-center gap-2">
                  <span className="text-xs text-gray-900">
                    {ctaButton.section_count || 0} sections
                  </span>
                  <span
                    className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                      ctaButton.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {ctaButton.is_active ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="md:col-span-2"></div>
                <div className="md:col-span-3 flex flex-wrap items-center gap-2 md:justify-end">
                  <button
                    onClick={() => toggleCTAButton(ctaButton.slug, true)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100"
                  >
                    Remove CTA
                  </button>
                  <button
                    onClick={() => navigate(`/admin/pages/${ctaButton.slug}`)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No CTA button configured. Set one from "Other Pages" below.
            </div>
          )}
        </div>
      </div>

      {/* Other Pages */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Other Pages</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Pages not shown in the menu</p>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block divide-y divide-gray-200">
          {otherPages.map((page) => (
            <div key={page.id} className="px-6 py-4 flex items-center space-x-4 hover:bg-gray-50">
              <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-5">
                  <div className="text-sm font-medium text-gray-900">{page.title}</div>
                  <div className="text-xs text-gray-500">/{page.slug}</div>
                </div>
                <div className="col-span-2 text-center">
                  <div className="text-sm text-gray-900">
                    {page.section_count || 0} sections
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      page.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {page.is_active ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="col-span-3 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => toggleShowInMenu(page.slug, false)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-green-600"
                    title="Add to menu"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleCTAButton(page.slug, false)}
                    className={`p-2 rounded-lg hover:bg-gray-100 ${
                      ctaButton
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-400 hover:text-yellow-600'
                    }`}
                    title={ctaButton ? 'CTA slot is filled' : 'Set as CTA button'}
                    disabled={!!ctaButton}
                  >
                    <Star className="w-4 h-4" />
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => navigate(`/admin/pages/${page.slug}`)}
                    className="text-sm text-blue-600 hover:text-blue-900 font-medium"
                  >
                    Edit
                  </button>
                  {user?.role === 'admin' && (
                    <>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => handleDelete(page.slug)}
                        className="text-sm text-red-600 hover:text-red-900 font-medium"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          {otherPages.length === 0 && !searchQuery && (
            <div className="px-6 py-8 text-center text-gray-500">
              All pages are configured in the menu.
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200">
          {otherPages.map((page) => (
            <div key={page.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 mb-1">{page.title}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>/{page.slug}</span>
                    <span>•</span>
                    <span>{page.section_count || 0} {page.section_count === 1 ? 'section' : 'sections'}</span>
                  </div>
                </div>
                <span
                  className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                    page.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {page.is_active ? 'Published' : 'Draft'}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleShowInMenu(page.slug, false)}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100"
                  title="Add to menu"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Add to Menu
                </button>
                <button
                  onClick={() => toggleCTAButton(page.slug, false)}
                  disabled={!!ctaButton}
                  className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md ${
                    ctaButton
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
                  }`}
                  title={ctaButton ? 'CTA slot is filled' : 'Set as CTA button'}
                >
                  <Star className="w-3 h-3 mr-1" />
                  Set as CTA
                </button>
                <button
                  onClick={() => navigate(`/admin/pages/${page.slug}`)}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
                >
                  Edit
                </button>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => handleDelete(page.slug)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
          {otherPages.length === 0 && !searchQuery && (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              All pages are configured in the menu.
            </div>
          )}
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm font-semibold text-blue-900 mb-2">
              How to Manage Menu
            </h3>
            <ul className="text-xs sm:text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li className="hidden md:list-item">Drag menu items to reorder them</li>
              <li>Click the eye icon to show/hide pages in the menu</li>
              <li>Click the star icon to set/unset a page as CTA button</li>
              <li>Edit menu labels by clicking and typing in the text field</li>
              <li>Don't forget to click "Save Menu Order" after rearranging</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
