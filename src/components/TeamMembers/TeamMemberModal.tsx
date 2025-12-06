import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { teamMembersService, TeamMember, CreateTeamMemberInput } from '../../services/teamMembersService';
import { Button } from '../Common/Button';
import mediaService, { Media } from '../../services/mediaService';
import MediaPickerModal from '../Media/MediaPickerModal';
import { RichTextEditor } from '../Editor/RichTextEditor';

interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  member: TeamMember | null;
}

export const TeamMemberModal: React.FC<TeamMemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  member,
}) => {
  const [formData, setFormData] = useState<CreateTeamMemberInput>({
    name: '',
    title: '',
    role: 'management',
    image_url: '',
    bio: '',
    date_range: '',
    display_order: 0,
    status: 'active',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  useEffect(() => {
    if (isOpen && member) {
      setFormData({
        name: member.name,
        title: member.title,
        role: member.role,
        image_url: member.image_url || '',
        bio: member.bio || '',
        date_range: member.date_range || '',
        display_order: member.display_order,
        status: member.status,
      });
    } else if (isOpen && !member) {
      setFormData({
        name: '',
        title: '',
        role: 'management',
        image_url: '',
        bio: '',
        date_range: '',
        display_order: 0,
        status: 'active',
      });
    }
    setErrors({});
  }, [isOpen, member]);

  const handleChange = (field: keyof CreateTeamMemberInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image_url: 'Please select an image file' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image_url: 'Image must be less than 5MB' }));
      return;
    }

    try {
      setIsUploadingImage(true);
      const uploadedFile = await mediaService.upload(file);
      handleChange('image_url', uploadedFile.url);
    } catch (error) {
      console.error('Failed to upload image:', error);
      setErrors(prev => ({ ...prev, image_url: 'Failed to upload image' }));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleMediaSelect = (media: Media) => {
    handleChange('image_url', media.url);
    setShowMediaPicker(false);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.role === 'historical_admin' && !formData.date_range) {
      newErrors.date_range = 'Date range is required for historical administrators';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsSubmitting(true);

      if (member) {
        await teamMembersService.update(member.id, formData);
      } else {
        await teamMembersService.create(formData);
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Failed to save team member:', error);
      alert(error.response?.data?.error || 'Failed to save team member');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {member ? 'Edit Team Member' : 'Add Team Member'}
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
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo
            </label>
            <div className="flex items-center gap-4">
              {formData.image_url ? (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleChange('image_url', '')}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}

              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    {isUploadingImage ? 'Uploading...' : 'Upload Photo'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowMediaPicker(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Choose from Gallery
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  JPG, PNG or GIF (max 5MB)
                </p>
                {errors.image_url && (
                  <p className="text-xs text-red-600">{errors.image_url}</p>
                )}
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Hon. Emmanuel K. Bedzrah"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Board Chairman"
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="board_chairman">Board Chairman</option>
              <option value="board_member">Board Member</option>
              <option value="management">Management</option>
              <option value="historical_admin">Historical Administrator</option>
            </select>
          </div>

          {/* Date Range (for historical admins) */}
          {formData.role === 'historical_admin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range *
              </label>
              <input
                type="text"
                value={formData.date_range}
                onChange={(e) => handleChange('date_range', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.date_range ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 2001-2009"
              />
              {errors.date_range && (
                <p className="text-xs text-red-600 mt-1">{errors.date_range}</p>
              )}
            </div>
          )}

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biography
            </label>
            <RichTextEditor
              content={formData.bio || ''}
              onChange={(content) => handleChange('bio', content)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Use the editor toolbar to format text, add links, and style the biography
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
              Lower numbers appear first (or use drag-and-drop in the list)
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
              {isSubmitting ? 'Saving...' : member ? 'Update' : 'Create'}
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
