import React, { useEffect, useState } from 'react';
import { menuService, MenuItem, CreateMenuItemInput } from '../services/menuService';
import { pageService } from '../services/pageService';
import { Button } from '../components/Common/Button';
import { Input } from '../components/Common/Input';

interface PageOption {
  slug: string;
  title: string;
}

export const MenuManagementPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [ctaButtons, setCtaButtons] = useState<MenuItem[]>([]);
  const [pages, setPages] = useState<PageOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAddCta, setShowAddCta] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [formData, setFormData] = useState({
    label: '',
    url: '',
    page_slug: '',
    is_active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [allItems, allPages] = await Promise.all([
        menuService.getAll(true),
        pageService.getAll(),
      ]);

      const menus = allItems.filter(item => item.item_type === 'menu');
      const ctas = allItems.filter(item => item.item_type === 'cta');

      setMenuItems(menus);
      setCtaButtons(ctas);
      setPages(allPages.map(p => ({ slug: p.slug, title: p.title })));
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      label: '',
      url: '',
      page_slug: '',
      is_active: true,
    });
    setEditingItem(null);
    setShowAddMenu(false);
    setShowAddCta(false);
  };

  const handleSubmit = async (e: React.FormEvent, itemType: 'menu' | 'cta') => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingItem) {
        await menuService.update(editingItem.id, {
          label: formData.label,
          url: formData.url,
          page_slug: formData.page_slug || null,
          is_active: formData.is_active,
        });
        setSuccess(`${itemType === 'menu' ? 'Menu item' : 'CTA button'} updated successfully`);
      } else {
        const items = itemType === 'menu' ? menuItems : ctaButtons;
        const createData: CreateMenuItemInput = {
          label: formData.label,
          url: formData.url,
          page_slug: formData.page_slug || undefined,
          order_index: items.length,
          is_active: formData.is_active,
          item_type: itemType,
        };
        await menuService.create(createData);
        setSuccess(`${itemType === 'menu' ? 'Menu item' : 'CTA button'} created successfully`);
      }

      resetForm();
      await loadData();
    } catch (error: any) {
      setError(error.response?.data?.error || `Failed to ${editingItem ? 'update' : 'create'} item`);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      label: item.label,
      url: item.url,
      page_slug: item.page_slug || '',
      is_active: item.is_active,
    });
    if (item.item_type === 'menu') {
      setShowAddMenu(true);
    } else {
      setShowAddCta(true);
    }
  };

  const handleDelete = async (id: number, itemType: 'menu' | 'cta') => {
    if (!confirm(`Are you sure you want to delete this ${itemType === 'menu' ? 'menu item' : 'CTA button'}?`)) {
      return;
    }

    try {
      setError('');
      await menuService.delete(id);
      setSuccess(`${itemType === 'menu' ? 'Menu item' : 'CTA button'} deleted successfully`);
      await loadData();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to delete item');
    }
  };

  const handleMoveUp = async (items: MenuItem[], index: number) => {
    if (index === 0) return;

    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];

    const reorderData = newItems.map((item, idx) => ({
      id: item.id,
      order_index: idx,
    }));

    try {
      await menuService.reorder(reorderData);
      await loadData();
    } catch (error: any) {
      setError('Failed to reorder items');
    }
  };

  const handleMoveDown = async (items: MenuItem[], index: number) => {
    if (index === items.length - 1) return;

    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];

    const reorderData = newItems.map((item, idx) => ({
      id: item.id,
      order_index: idx,
    }));

    try {
      await menuService.reorder(reorderData);
      await loadData();
    } catch (error: any) {
      setError('Failed to reorder items');
    }
  };

  const renderForm = (itemType: 'menu' | 'cta') => (
    <form onSubmit={(e) => handleSubmit(e, itemType)} className="bg-white p-6 rounded-lg border border-gray-300 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {editingItem ? 'Edit' : 'Add'} {itemType === 'menu' ? 'Menu Item' : 'CTA Button'}
      </h3>

      <Input
        type="text"
        label="Label"
        placeholder={itemType === 'menu' ? 'About' : 'Apply Now'}
        value={formData.label}
        onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Link to Page (Optional)
        </label>
        <select
          value={formData.page_slug}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            page_slug: e.target.value,
            url: e.target.value ? `/${e.target.value}` : prev.url
          }))}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Custom URL --</option>
          {pages.map((page) => (
            <option key={page.slug} value={page.slug}>
              {page.title} (/{page.slug})
            </option>
          ))}
        </select>
      </div>

      <Input
        type="text"
        label="URL"
        placeholder="/about or https://example.com"
        value={formData.url}
        onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
        required
        helperText="Page link will auto-fill this field, or enter a custom URL"
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="is_active" className="text-sm text-gray-700">
          Show on website
        </label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" variant="primary">
          {editingItem ? 'Update' : 'Add'} {itemType === 'menu' ? 'Menu Item' : 'CTA Button'}
        </Button>
        <Button type="button" variant="secondary" onClick={resetForm}>
          Cancel
        </Button>
      </div>
    </form>
  );

  const renderItemList = (items: MenuItem[], itemType: 'menu' | 'cta') => (
    <div className="space-y-2">
      {items.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">
            No {itemType === 'menu' ? 'menu items' : 'CTA buttons'} yet.
          </p>
        </div>
      )}

      {items.map((item, index) => (
        <div
          key={item.id}
          className={`flex items-center justify-between p-4 border rounded-lg ${
            item.is_active ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">{item.label}</h4>
              {!item.is_active && (
                <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">Hidden</span>
              )}
            </div>
            <p className="text-sm text-gray-600">{item.url}</p>
            {item.page_slug && (
              <p className="text-xs text-gray-500">Linked to: {item.page_slug}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleMoveUp(items, index)}
              disabled={index === 0}
              className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Move up"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              onClick={() => handleMoveDown(items, index)}
              disabled={index === items.length - 1}
              className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Move down"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={() => handleEdit(item)}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id, itemType)}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
        <p className="text-gray-600 mt-1">
          Manage your website navigation menu and CTA buttons
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{success}</p>
        </div>
      )}

      {/* Menu Items Section */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Menu Items ({menuItems.length}/5)
            </h2>
            <p className="text-sm text-gray-600">Maximum 5 menu items allowed</p>
          </div>
          {!showAddMenu && !editingItem && menuItems.length < 5 && (
            <Button onClick={() => setShowAddMenu(true)} variant="primary" size="sm">
              + Add Menu Item
            </Button>
          )}
        </div>

        {showAddMenu && renderForm('menu')}
        {renderItemList(menuItems, 'menu')}
      </div>

      {/* CTA Buttons Section */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              CTA Buttons ({ctaButtons.length}/2)
            </h2>
            <p className="text-sm text-gray-600">Maximum 2 CTA buttons allowed</p>
          </div>
          {!showAddCta && !editingItem && ctaButtons.length < 2 && (
            <Button onClick={() => setShowAddCta(true)} variant="primary" size="sm">
              + Add CTA Button
            </Button>
          )}
        </div>

        {showAddCta && renderForm('cta')}
        {renderItemList(ctaButtons, 'cta')}
      </div>
    </div>
  );
};
