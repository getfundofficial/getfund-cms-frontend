import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { pageService, Page } from '../services/pageService';
import { footerService, FooterConfig } from '../services/footerService';
import { Button } from '../components/Common/Button';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import {
  GripVertical,
  Eye,
  EyeOff,
  Star,
  Search,
  Plus,
  MoreVertical,
  FileText,
  Layout,
  ExternalLink,
  Trash2,
  Edit3,
  Globe,
  CheckCircle2,
  XCircle,
  Layers,
  Link2,
  Save,
  ChevronDown,
  ChevronRight,
  FolderTree,
  CornerDownRight
} from 'lucide-react';

interface QuickLink {
  name: string;
  href: string;
  visible?: boolean;
}

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
  const [activeTab, setActiveTab] = useState<'menu' | 'all' | 'footer'>('menu');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Footer state
  const [footerConfig, setFooterConfig] = useState<FooterConfig | null>(null);
  const [footerLinks, setFooterLinks] = useState<QuickLink[]>([]);
  const [footerDraggedIndex, setFooterDraggedIndex] = useState<number | null>(null);
  const [hasFooterChanges, setHasFooterChanges] = useState(false);
  const [editingFooterLink, setEditingFooterLink] = useState<number | null>(null);
  const [showAddFooterLink, setShowAddFooterLink] = useState(false);
  const [newFooterLink, setNewFooterLink] = useState<QuickLink>({ name: '', href: '', visible: true });

  // Submenu hierarchy state
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());
  const [showParentSelector, setShowParentSelector] = useState<string | null>(null);
  const [draggedChildIndex, setDraggedChildIndex] = useState<{ parentId: string; index: number } | null>(null);

  useEffect(() => {
    loadPages();
    loadFooterConfig();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingTime(prev => prev + 1);
      }, 1000);
    } else {
      setLoadingTime(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const loadPages = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await pageService.getAll();
      const sorted = data.sort((a, b) => (a.menu_order || 0) - (b.menu_order || 0));
      setPages(sorted);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.response?.data?.details || error.message || 'Failed to load pages';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFooterConfig = async () => {
    try {
      const config = await footerService.getFooterConfig();
      setFooterConfig(config);
      setFooterLinks(config.quick_links || []);
    } catch (error: any) {
      console.error('Failed to load footer config:', error);
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

    newMenuItems.splice(draggedIndex, 1);
    newMenuItems.splice(targetIndex, 0, draggedPage);

    newMenuItems.forEach((page, idx) => {
      page.menu_order = idx + 1;
    });

    const nonMenuPages = pages.filter(p => !p.show_in_menu || p.is_cta_button);
    const allPages = [...newMenuItems, ...nonMenuPages];

    setPages(allPages);
    setDraggedIndex(null);
    setHasUnsavedChanges(true);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Footer drag handlers
  const handleFooterDragStart = (index: number) => {
    setFooterDraggedIndex(index);
  };

  const handleFooterDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (footerDraggedIndex === null || footerDraggedIndex === targetIndex) return;

    const newLinks = [...footerLinks];
    const draggedLink = newLinks[footerDraggedIndex];

    newLinks.splice(footerDraggedIndex, 1);
    newLinks.splice(targetIndex, 0, draggedLink);

    setFooterLinks(newLinks);
    setFooterDraggedIndex(null);
    setHasFooterChanges(true);
  };

  const handleFooterDragEnd = () => {
    setFooterDraggedIndex(null);
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
      setHasUnsavedChanges(false);
      alert('Menu order saved successfully!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to save menu order');
    } finally {
      setIsSaving(false);
    }
  };

  const saveFooterLinks = async () => {
    if (!footerConfig) return;

    try {
      setIsSaving(true);
      await footerService.updateFooterConfig({
        ...footerConfig,
        quick_links: footerLinks
      });
      setHasFooterChanges(false);
      alert('Footer links saved successfully!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to save footer links');
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

  // Submenu hierarchy handlers
  const toggleParentExpanded = (parentId: string) => {
    setExpandedParents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(parentId)) {
        newSet.delete(parentId);
      } else {
        newSet.add(parentId);
      }
      return newSet;
    });
  };

  const setParentPage = async (slug: string, parentPageId: string | null) => {
    try {
      await pageService.updateMenuConfig(slug, { parent_page_id: parentPageId });
      setShowParentSelector(null);
      await loadPages();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to set parent page');
    }
  };

  // Get parent menu items (pages that can have children)
  const getParentMenuItems = () => {
    return pages.filter(p => p.show_in_menu && !p.is_cta_button && !p.parent_page_id);
  };

  // Get child pages for a parent
  const getChildPages = (parentId: string) => {
    return pages
      .filter(p => p.parent_page_id === parentId && p.show_in_menu)
      .sort((a, b) => (a.menu_order || 0) - (b.menu_order || 0));
  };

  // Handle child item drag
  const handleChildDragStart = (parentId: string, index: number) => {
    setDraggedChildIndex({ parentId, index });
  };

  const handleChildDrop = async (e: React.DragEvent, parentId: string, targetIndex: number) => {
    e.preventDefault();
    if (!draggedChildIndex || draggedChildIndex.parentId !== parentId || draggedChildIndex.index === targetIndex) {
      setDraggedChildIndex(null);
      return;
    }

    const children = getChildPages(parentId);
    const newChildren = [...children];
    const draggedPage = newChildren[draggedChildIndex.index];

    newChildren.splice(draggedChildIndex.index, 1);
    newChildren.splice(targetIndex, 0, draggedPage);

    // Update menu_order for all children
    try {
      for (let i = 0; i < newChildren.length; i++) {
        await pageService.updateMenuConfig(newChildren[i].slug, { menu_order: i + 1 });
      }
      await loadPages();
    } catch (error: any) {
      alert('Failed to reorder submenu items');
    }

    setDraggedChildIndex(null);
  };

  const handleChildDragEnd = () => {
    setDraggedChildIndex(null);
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
    if (!confirm('Unpublish this page?')) return;
    try {
      await pageService.unpublish(slug);
      loadPages();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to unpublish page');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this page? This action cannot be undone.')) return;
    try {
      await pageService.delete(slug);
      loadPages();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete page');
    }
  };

  // Footer link handlers
  const addFooterLink = () => {
    if (!newFooterLink.name || !newFooterLink.href) {
      alert('Please enter both name and URL');
      return;
    }
    setFooterLinks([...footerLinks, { ...newFooterLink, visible: true }]);
    setNewFooterLink({ name: '', href: '', visible: true });
    setShowAddFooterLink(false);
    setHasFooterChanges(true);
  };

  const updateFooterLink = (index: number, field: 'name' | 'href', value: string) => {
    const newLinks = [...footerLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFooterLinks(newLinks);
    setHasFooterChanges(true);
  };

  // Toggle visibility of footer link (show/hide in website footer)
  const toggleFooterLinkVisibility = (index: number) => {
    const newLinks = [...footerLinks];
    newLinks[index] = { ...newLinks[index], visible: newLinks[index].visible === false ? true : false };
    setFooterLinks(newLinks);
    setHasFooterChanges(true);
  };

  const removeFooterLink = (index: number) => {
    if (!confirm('Remove this link from the footer?')) return;
    setFooterLinks(footerLinks.filter((_, i) => i !== index));
    setHasFooterChanges(true);
  };

  const addPageToFooter = (page: Page) => {
    const exists = footerLinks.some(link => link.href === `/${page.slug}`);
    if (exists) {
      alert('This page is already in the footer');
      return;
    }
    setFooterLinks([...footerLinks, { name: page.title, href: `/${page.slug}`, visible: true }]);
    setHasFooterChanges(true);
  };

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const menuItems = filteredPages.filter(p => p.show_in_menu && !p.is_cta_button);
  const ctaButton = filteredPages.find(p => p.is_cta_button);
  const publishedCount = pages.filter(p => p.is_active).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            <FileText className="absolute inset-0 m-auto w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg font-medium mb-2">Loading pages...</p>
          {loadingTime > 5 && (
            <p className="text-gray-500 text-sm">
              {loadingTime > 30 ? 'The database may be waking up...' : `Please wait... (${loadingTime}s)`}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
            <p className="text-gray-500 mt-1">Manage website pages, navigation menu, and footer links</p>
          </div>

          <div className="flex items-center gap-3">
            {(hasUnsavedChanges || hasFooterChanges) && (
              <span className="text-sm text-amber-600 font-medium animate-pulse">
                Unsaved changes
              </span>
            )}
            {activeTab === 'footer' ? (
              <Button
                onClick={saveFooterLinks}
                disabled={isSaving || !hasFooterChanges}
                className={`${hasFooterChanges ? 'bg-amber-500 hover:bg-amber-600' : 'bg-gray-400'} transition-colors`}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Footer'}
              </Button>
            ) : (
              <Button
                onClick={saveMenuOrder}
                disabled={isSaving || !hasUnsavedChanges}
                className={`${hasUnsavedChanges ? 'bg-amber-500 hover:bg-amber-600' : 'bg-gray-400'} transition-colors`}
              >
                {isSaving ? 'Saving...' : 'Save Order'}
              </Button>
            )}
            <Button
              onClick={() => navigate('/admin/pages/new')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Page
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pages.length}</p>
                <p className="text-sm text-gray-500">Total Pages</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{publishedCount}</p>
                <p className="text-sm text-gray-500">Published</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Layout className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{menuItems.length}</p>
                <p className="text-sm text-gray-500">In Menu</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{ctaButton ? '1' : '0'}</p>
                <p className="text-sm text-gray-500">CTA Button</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Link2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {footerLinks.filter(l => l.visible !== false).length}
                  <span className="text-sm font-normal text-gray-400">/{footerLinks.length}</span>
                </p>
                <p className="text-sm text-gray-500">Footer Links</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
            <button onClick={loadPages} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
              Retry
            </button>
          </div>
        )}

        {/* Search & Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Tabs */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('menu')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'menu'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Menu Items
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'all'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Pages
                </button>
                <button
                  onClick={() => setActiveTab('footer')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'footer'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Footer Links
                </button>
              </div>
            </div>
          </div>

          {/* Menu Items Tab */}
          {activeTab === 'menu' && (
            <div>
              {/* CTA Button Section */}
              {ctaButton && (
                <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <Star className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">CTA Button</span>
                        <p className="font-medium text-gray-900">{ctaButton.menu_label || ctaButton.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/pages/${ctaButton.slug}`)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleCTAButton(ctaButton.slug, true)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Hierarchical Menu Items List with Submenu Support */}
              <div className="divide-y divide-gray-100">
                {menuItems.length === 0 ? (
                  <div className="py-12 text-center">
                    <Layout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No menu items yet</p>
                    <p className="text-sm text-gray-400 mt-1">Add pages to the menu from the "All Pages" tab</p>
                  </div>
                ) : (
                  <>
                    {/* Info banner about submenu support */}
                    <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <FolderTree className="w-4 h-4" />
                        <span>Drag to reorder. Click the folder icon to manage submenus.</span>
                      </div>
                    </div>

                    {/* Parent menu items (top-level) */}
                    {getParentMenuItems().map((page, index) => {
                      const children = getChildPages(page.id);
                      const hasChildren = children.length > 0;
                      const isExpanded = expandedParents.has(page.id);

                      return (
                        <div key={page.id}>
                          {/* Parent item */}
                          <div
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`group px-4 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-move ${
                              draggedIndex === index ? 'opacity-50 bg-blue-50' : ''
                            }`}
                          >
                            {/* Drag Handle */}
                            <div className="flex-shrink-0 p-1 rounded hover:bg-gray-200 transition-colors">
                              <GripVertical className="w-4 h-4 text-gray-400" />
                            </div>

                            {/* Expand/Collapse for items with children */}
                            <button
                              onClick={() => hasChildren && toggleParentExpanded(page.id)}
                              className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded transition-colors ${
                                hasChildren ? 'hover:bg-gray-200 cursor-pointer' : 'cursor-default'
                              }`}
                            >
                              {hasChildren ? (
                                isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-gray-600" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-600" />
                                )
                              ) : (
                                <span className="w-4 h-4" />
                              )}
                            </button>

                            {/* Order Number */}
                            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-semibold text-gray-600">{index + 1}</span>
                            </div>

                            {/* Page Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
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
                                  className="font-medium text-gray-900 bg-transparent border-0 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:ring-0 px-0 py-0.5 transition-colors"
                                />
                                {hasChildren && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                    {children.length} submenu{children.length > 1 ? 's' : ''}
                                  </span>
                                )}
                                {page.is_active ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                    Live
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                    Draft
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 truncate">/{page.slug}</p>
                            </div>

                            {/* Sections Count */}
                            <div className="hidden md:flex items-center gap-1 text-sm text-gray-500">
                              <FileText className="w-4 h-4" />
                              <span>{page.section_count || 0}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => navigate(`/admin/pages/${page.slug}`)}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit page"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toggleShowInMenu(page.slug, true)}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove from menu"
                              >
                                <EyeOff className="w-4 h-4" />
                              </button>
                              {user?.role === 'admin' && (
                                <button
                                  onClick={() => handleDelete(page.slug)}
                                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete page"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Child items (submenu) - shown when expanded */}
                          {hasChildren && isExpanded && (
                            <div className="bg-gray-50 border-l-4 border-purple-200">
                              {children.map((child, childIndex) => (
                                <div
                                  key={child.id}
                                  draggable
                                  onDragStart={() => handleChildDragStart(page.id, childIndex)}
                                  onDragOver={handleDragOver}
                                  onDrop={(e) => handleChildDrop(e, page.id, childIndex)}
                                  onDragEnd={handleChildDragEnd}
                                  className={`group pl-12 pr-4 py-2 flex items-center gap-4 hover:bg-gray-100 transition-colors cursor-move ${
                                    draggedChildIndex?.parentId === page.id && draggedChildIndex?.index === childIndex
                                      ? 'opacity-50 bg-purple-50'
                                      : ''
                                  }`}
                                >
                                  {/* Drag Handle */}
                                  <div className="flex-shrink-0 p-1 rounded hover:bg-gray-200 transition-colors">
                                    <GripVertical className="w-4 h-4 text-gray-400" />
                                  </div>

                                  {/* Submenu indicator */}
                                  <CornerDownRight className="w-4 h-4 text-purple-400 flex-shrink-0" />

                                  {/* Order Number */}
                                  <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                                    <span className="text-xs font-semibold text-purple-600">{childIndex + 1}</span>
                                  </div>

                                  {/* Child Page Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        value={child.menu_label || child.title}
                                        onChange={(e) => {
                                          const newPages = [...pages];
                                          const pageIndex = newPages.findIndex(p => p.id === child.id);
                                          newPages[pageIndex].menu_label = e.target.value;
                                          setPages(newPages);
                                        }}
                                        onBlur={(e) => updateMenuLabel(child.slug, e.target.value)}
                                        className="text-sm font-medium text-gray-700 bg-transparent border-0 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:ring-0 px-0 py-0.5 transition-colors"
                                      />
                                      {child.is_active ? (
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                          Live
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                          Draft
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-400 truncate">/{child.slug}</p>
                                  </div>

                                  {/* Child Actions */}
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => setParentPage(child.slug, null)}
                                      className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                      title="Remove from submenu (make top-level)"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => navigate(`/admin/pages/${child.slug}`)}
                                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                      title="Edit page"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Child pages without parents (pages with parent_page_id that are shown in menu but parent not in menu) */}
                    {pages
                      .filter(p => p.show_in_menu && !p.is_cta_button && p.parent_page_id && !getParentMenuItems().some(parent => parent.id === p.parent_page_id))
                      .map((orphanChild) => (
                        <div
                          key={orphanChild.id}
                          className="group px-4 py-3 flex items-center gap-4 bg-amber-50 border-l-4 border-amber-300"
                        >
                          <div className="flex-shrink-0 p-1">
                            <CornerDownRight className="w-4 h-4 text-amber-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{orphanChild.menu_label || orphanChild.title}</span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                Orphan submenu
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">Parent page not in menu. Assign a new parent or make top-level.</p>
                          </div>
                          <button
                            onClick={() => setParentPage(orphanChild.slug, null)}
                            className="px-3 py-1 text-sm bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors"
                          >
                            Make Top-Level
                          </button>
                        </div>
                      ))
                    }
                  </>
                )}
              </div>

              {/* Add submenu section - for assigning pages to parent menus */}
              {getParentMenuItems().length > 0 && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FolderTree className="w-4 h-4" />
                      Add Pages to Submenus
                    </h4>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Select a page to add as a submenu item under a parent menu.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pages
                      .filter(p => p.show_in_menu && !p.is_cta_button && !p.parent_page_id)
                      .map((parentPage) => (
                        <div key={parentPage.id} className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowParentSelector(showParentSelector === parentPage.id ? null : parentPage.id);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add to {parentPage.menu_label || parentPage.title}
                          </button>

                          {/* Dropdown for selecting child page */}
                          {showParentSelector === parentPage.id && (
                            <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 max-h-60 overflow-y-auto">
                              <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                                Select page to add under "{parentPage.menu_label || parentPage.title}"
                              </div>
                              {pages
                                .filter(p =>
                                  p.show_in_menu &&
                                  !p.is_cta_button &&
                                  p.id !== parentPage.id &&
                                  !p.parent_page_id &&
                                  !getChildPages(p.id).length // Don't allow pages with children to become children
                                )
                                .map((childCandidate) => (
                                  <button
                                    key={childCandidate.id}
                                    onClick={() => setParentPage(childCandidate.slug, parentPage.id)}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                  >
                                    {childCandidate.menu_label || childCandidate.title}
                                  </button>
                                ))
                              }
                              {pages.filter(p =>
                                p.show_in_menu &&
                                !p.is_cta_button &&
                                p.id !== parentPage.id &&
                                !p.parent_page_id &&
                                !getChildPages(p.id).length
                              ).length === 0 && (
                                <div className="px-3 py-2 text-sm text-gray-400 italic">
                                  No available pages
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          )}

          {/* All Pages Tab */}
          {activeTab === 'all' && (
            <div className="divide-y divide-gray-100">
              {filteredPages.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No pages found</p>
                </div>
              ) : (
                filteredPages.map((page) => (
                  <div
                    key={page.id}
                    className="group px-4 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Page Icon */}
                    <div className={`flex-shrink-0 p-2.5 rounded-lg ${
                      page.is_cta_button
                        ? 'bg-amber-100'
                        : page.show_in_menu
                          ? 'bg-purple-100'
                          : 'bg-gray-100'
                    }`}>
                      {page.is_cta_button ? (
                        <Star className="w-5 h-5 text-amber-600" />
                      ) : page.show_in_menu ? (
                        <Layout className="w-5 h-5 text-purple-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-gray-500" />
                      )}
                    </div>

                    {/* Page Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-gray-900">{page.title}</h3>
                        {page.is_cta_button && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            CTA
                          </span>
                        )}
                        {page.show_in_menu && !page.is_cta_button && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            In Menu
                          </span>
                        )}
                        {footerLinks.some(link => link.href === `/${page.slug}`) && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                            In Footer
                          </span>
                        )}
                        {page.is_active ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Draft
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span>/{page.slug}</span>
                        <span className="text-gray-300">•</span>
                        <span>{page.section_count || 0} sections</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {/* Add to Footer */}
                      {!footerLinks.some(link => link.href === `/${page.slug}`) && (
                        <button
                          onClick={() => addPageToFooter(page)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Add to footer"
                        >
                          <Link2 className="w-4 h-4" />
                        </button>
                      )}

                      {!page.is_cta_button && (
                        <button
                          onClick={() => toggleShowInMenu(page.slug, page.show_in_menu || false)}
                          className={`p-2 rounded-lg transition-colors ${
                            page.show_in_menu
                              ? 'text-purple-600 hover:text-red-600 hover:bg-red-50'
                              : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                          }`}
                          title={page.show_in_menu ? 'Remove from menu' : 'Add to menu'}
                        >
                          {page.show_in_menu ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      )}

                      {!page.show_in_menu && !page.is_cta_button && (
                        <button
                          onClick={() => toggleCTAButton(page.slug, false)}
                          disabled={!!ctaButton}
                          className={`p-2 rounded-lg transition-colors ${
                            ctaButton
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                          }`}
                          title={ctaButton ? 'CTA slot filled' : 'Set as CTA'}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}

                      {page.is_cta_button && (
                        <button
                          onClick={() => toggleCTAButton(page.slug, true)}
                          className="p-2 text-amber-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove as CTA"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => navigate(`/admin/pages/${page.slug}`)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit page"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* More Actions Dropdown */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(openDropdown === page.slug ? null : page.slug);
                          }}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openDropdown === page.slug && (
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            {page.is_active && (
                              <a
                                href={`/${page.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <ExternalLink className="w-4 h-4" />
                                View Live
                              </a>
                            )}
                            {(user?.role === 'admin' || user?.role === 'approver') && (
                              <>
                                {page.is_active ? (
                                  <button
                                    onClick={() => {
                                      handleUnpublish(page.slug);
                                      setOpenDropdown(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:bg-orange-50"
                                  >
                                    <EyeOff className="w-4 h-4" />
                                    Unpublish
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      handlePublish(page.slug);
                                      setOpenDropdown(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                                  >
                                    <Globe className="w-4 h-4" />
                                    Publish
                                  </button>
                                )}
                              </>
                            )}
                            {user?.role === 'admin' && (
                              <button
                                onClick={() => {
                                  handleDelete(page.slug);
                                  setOpenDropdown(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Footer Links Tab */}
          {activeTab === 'footer' && (
            <div>
              {/* Add Link Button */}
              <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Link2 className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Footer Quick Links</span>
                      <p className="text-sm text-gray-600">Drag to reorder • These appear in the website footer</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddFooterLink(true)}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Link
                  </button>
                </div>
              </div>

              {/* Add Link Form */}
              {showAddFooterLink && (
                <div className="px-4 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Link Name (e.g., About Us)"
                      value={newFooterLink.name}
                      onChange={(e) => setNewFooterLink({ ...newFooterLink, name: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="URL (e.g., /about)"
                      value={newFooterLink.href}
                      onChange={(e) => setNewFooterLink({ ...newFooterLink, href: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={addFooterLink}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowAddFooterLink(false);
                          setNewFooterLink({ name: '', href: '' });
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Links List */}
              <div className="divide-y divide-gray-100">
                {footerLinks.length === 0 ? (
                  <div className="py-12 text-center">
                    <Link2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No footer links yet</p>
                    <p className="text-sm text-gray-400 mt-1">Add links using the button above or from "All Pages"</p>
                  </div>
                ) : (
                  footerLinks.map((link, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={() => handleFooterDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleFooterDrop(e, index)}
                      onDragEnd={handleFooterDragEnd}
                      className={`group px-4 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-move ${
                        footerDraggedIndex === index ? 'opacity-50 bg-indigo-50' : ''
                      } ${link.visible === false ? 'opacity-60 bg-gray-50' : ''}`}
                    >
                      {/* Drag Handle */}
                      <div className="flex-shrink-0 p-1 rounded hover:bg-gray-200 transition-colors">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                      </div>

                      {/* Order Number */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                        link.visible === false ? 'bg-gray-200' : 'bg-indigo-100'
                      }`}>
                        <span className={`text-sm font-semibold ${
                          link.visible === false ? 'text-gray-400' : 'text-indigo-600'
                        }`}>{index + 1}</span>
                      </div>

                      {/* Link Info */}
                      <div className="flex-1 min-w-0">
                        {editingFooterLink === index ? (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={link.name}
                              onChange={(e) => updateFooterLink(index, 'name', e.target.value)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Link name"
                            />
                            <input
                              type="text"
                              value={link.href}
                              onChange={(e) => updateFooterLink(index, 'href', e.target.value)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="URL"
                            />
                            <button
                              onClick={() => setEditingFooterLink(null)}
                              className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
                            >
                              Done
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className={link.visible === false ? 'line-through text-gray-400' : ''}>
                              <p className={`font-medium ${link.visible === false ? 'text-gray-400' : 'text-gray-900'}`}>{link.name}</p>
                              <p className="text-sm text-gray-500 truncate">{link.href}</p>
                            </div>
                            {link.visible === false && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                                Hidden
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {editingFooterLink !== index && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => toggleFooterLinkVisibility(index)}
                            className={`p-2 rounded-lg transition-colors ${
                              link.visible === false
                                ? 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                : 'text-green-600 hover:text-gray-400 hover:bg-gray-100'
                            }`}
                            title={link.visible === false ? 'Show in footer' : 'Hide from footer'}
                          >
                            {link.visible === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => setEditingFooterLink(index)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit link"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFooterLink(index)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove link"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Help Tooltip */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            {activeTab === 'footer'
              ? 'Drag to reorder • Click to edit • Save changes with the button above'
              : 'Drag items to reorder • Click icons to toggle visibility • Changes are saved automatically'}
          </p>
        </div>
      </div>
    </>
  );
};
