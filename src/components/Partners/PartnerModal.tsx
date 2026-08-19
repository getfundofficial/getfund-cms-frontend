import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { partnersService, Partner, CreatePartnerInput } from '../../services/partnersService';
import { Button } from '../Common/Button';
import mediaService, { Media } from '../../services/mediaService';
import MediaPickerModal from '../Media/MediaPickerModal';

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  partner: Partner | null;
  defaultCategory?: string;
}

export const PartnerModal: React.FC<PartnerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  partner,
  defaultCategory = '',
}) => {
  const [formData, setFormData] = useState<CreatePartnerInput>({
    name: '',
    logo_url: '',
    website_url: '',
    description: '',
    category: '',
    display_order: 0,
    is_active: true,
    show_on_efpi: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  useEffect(() => {
    if (isOpen && partner) {
      setFormData({
        name: partner.name,
        logo_url: partner.logo_url,
        website_url: partner.website_url || '',
        description: partner.description || '',
        category: partner.category || '',
        display_order: partner.display_order,
        is_active: partner.is_active,
        show_on_efpi: partner.show_on_efpi ?? false,
      });
    } else if (isOpen && !partner) {
      setFormData({
        name: '',
        logo_url: '',
        website_url: '',
        description: '',
        category: defaultCategory,
        display_order: 0,
        is_active: true,
        show_on_efpi: false,
      });
    }
    setErrors({});
  }, [isOpen, partner, defaultCategory]);

  const handleChange = (field: keyof CreatePartnerInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, logo_url: 'Please select an image file' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, logo_url: 'Image must be less than 5MB' }));
      return;
    }

    try {
      setIsUploadingImage(true);
      const uploadedFile = await mediaService.upload(file);
      handleChange('logo_url', uploadedFile.url);
    } catch (error) {
      console.error('Failed to upload image:', error);
      setErrors(prev => ({ ...prev, logo_url: 'Failed to upload image' }));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleMediaSelect = (media: Media) => {
    handleChange('logo_url', media.url);
    setShowMediaPicker(false);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Partner name is required';
    }

    if (!formData.logo_url.trim()) {
      newErrors.logo_url = 'Logo is required';
    }

    if (formData.website_url && !formData.website_url.match(/^https?:\/\/.+/)) {
      newErrors.website_url = 'Please enter a valid URL (starting with http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsSubmitting(true);

      if (partner) {
        await partnersService.update(partner.id, formData);
      } else {
        await partnersService.create(formData);
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Failed to save partner:', error);
      alert(error.response?.data?.error || 'Failed to save partner');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {partner ? 'Edit Partner' : 'Add Partner'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Partner Logo *
            </label>
            <div className="flex items-center gap-4">
              {formData.logo_url ? (
                <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-gray-100 border">
                  <img
                    src={formData.logo_url}
                    alt="Preview"
                    className="w-full h-full object-contain p-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleChange('logo_url', '')}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}

              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                  <label
                    htmlFor="logo-upload"
                    className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    {isUploadingImage ? 'Uploading...' : 'Upload'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowMediaPicker(true)}
                    className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Gallery
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  PNG or SVG recommended for logos
                </p>
                {errors.logo_url && (
                  <p className="text-xs text-red-600">{errors.logo_url}</p>
                )}
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Partner Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., World Bank"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website URL
            </label>
            <input
              type="text"
              value={formData.website_url}
              onChange={(e) => handleChange('website_url', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.website_url ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://www.example.com"
            />
            {errors.website_url && (
              <p className="text-xs text-red-600 mt-1">{errors.website_url}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Optional link to partner's website
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Brief description of the partnership..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category || ''}
              onChange={(e) => handleChange('category', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">General</option>
              <option value="university">University</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              University partners appear on the Scholarships page
            </p>
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => handleChange('display_order', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Lower numbers appear first
            </p>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Active
              </label>
              <p className="text-xs text-gray-500">
                Show this partner on the website
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => handleChange('is_active', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* The two sites mean different things by "partner": GETFund's list is
              mostly scholarship universities, EFPI's is who funds projects. So
              this is chosen per partner rather than inferred, and starts off. */}
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Show on EFPI
              </label>
              <p className="text-xs text-gray-500">
                Also list this partner on efpi.getfund.gov.gh
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.show_on_efpi}
                onChange={(e) => handleChange('show_on_efpi', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : partner ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleMediaSelect}
        allowUpload={true}
      />
    </div>
  );
};
