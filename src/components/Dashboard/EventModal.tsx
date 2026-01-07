import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { eventService, CompanyEvent, CreateEventInput } from '../../services/eventService';
import { Button } from '../Common/Button';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  event: CompanyEvent | null;
  defaultDate?: string;
}

const EVENT_TYPES = [
  { value: 'meeting', label: 'Meeting', color: 'bg-blue-500' },
  { value: 'deadline', label: 'Deadline', color: 'bg-red-500' },
  { value: 'celebration', label: 'Celebration', color: 'bg-green-500' },
  { value: 'training', label: 'Training', color: 'bg-purple-500' },
  { value: 'other', label: 'Other', color: 'bg-primary-500' },
];

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  event,
  defaultDate,
}) => {
  const [formData, setFormData] = useState<CreateEventInput>({
    title: '',
    description: '',
    event_date: '',
    event_type: 'other',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen && event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        event_date: event.event_date.split('T')[0],
        event_type: event.event_type,
      });
    } else if (isOpen && !event) {
      setFormData({
        title: '',
        description: '',
        event_date: defaultDate || new Date().toISOString().split('T')[0],
        event_type: 'other',
      });
    }
    setErrors({});
    setShowDeleteConfirm(false);
  }, [isOpen, event, defaultDate]);

  const handleChange = (field: keyof CreateEventInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.event_date) {
      newErrors.event_date = 'Event date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsSubmitting(true);

      if (event) {
        await eventService.updateEvent(event.id, formData);
      } else {
        await eventService.createEvent(formData);
      }

      onSave();
    } catch (error: any) {
      console.error('Failed to save event:', error);
      alert(error.response?.data?.error || 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    try {
      setIsDeleting(true);
      await eventService.deleteEvent(event.id);
      onSave();
    } catch (error: any) {
      console.error('Failed to delete event:', error);
      alert(error.response?.data?.error || 'Failed to delete event');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {event ? 'Edit Event' : 'Add Event'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Quarterly Review Meeting"
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Date *
            </label>
            <input
              type="date"
              value={formData.event_date}
              onChange={(e) => handleChange('event_date', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.event_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.event_date && (
              <p className="text-xs text-red-600 mt-1">{errors.event_date}</p>
            )}
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleChange('event_type', type.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                    formData.event_type === type.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                  <span className="text-sm">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Additional details about the event..."
            />
          </div>

          {/* Delete Confirmation */}
          {event && showDeleteConfirm && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700 mb-3">
                Are you sure you want to delete this event? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {event && !showDeleteConfirm && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <div className="flex-1 flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting || isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={isSubmitting || isDeleting}
              >
                {isSubmitting ? 'Saving...' : event ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
