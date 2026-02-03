import React from 'react';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
}

interface EventsContent {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
  };
  upcomingEvents: {
    heading: string;
    events: Event[];
    emptyStateTitle: string;
    emptyStateSubtitle: string;
  };
}

interface EventsEditorProps {
  content: EventsContent;
  onChange: (content: EventsContent) => void;
}

export const EventsEditor: React.FC<EventsEditorProps> = ({
  content,
  onChange,
}) => {
  const handleChange = (section: keyof EventsContent, field: string, value: any) => {
    onChange({
      ...content,
      [section]: {
        ...content[section],
        [field]: value,
      },
    });
  };

  const handleEventChange = (index: number, field: keyof Event, value: string | number) => {
    const newEvents = [...(content.upcomingEvents?.events || [])];
    newEvents[index] = { ...newEvents[index], [field]: value };
    handleChange('upcomingEvents', 'events', newEvents);
  };

  const addEvent = () => {
    const events = content.upcomingEvents?.events || [];
    const newId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
    const newEvent: Event = {
      id: newId,
      title: '',
      date: '',
      description: '',
    };
    handleChange('upcomingEvents', 'events', [...events, newEvent]);
  };

  const removeEvent = (index: number) => {
    const newEvents = [...(content.upcomingEvents?.events || [])];
    newEvents.splice(index, 1);
    handleChange('upcomingEvents', 'events', newEvents);
  };

  return (
    <div className="space-y-8">
      {/* Meta Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Meta Information</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Page Title (Browser Tab)"
            placeholder="Events | GETFund"
            value={content.meta?.title || ''}
            onChange={(e) => handleChange('meta', 'title', e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description (SEO)
            </label>
            <textarea
              placeholder="Upcoming GETFund events and fundraising activities"
              value={content.meta?.description || ''}
              onChange={(e) => handleChange('meta', 'description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Shown in search results (150-160 characters recommended)</p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Header</h3>
        <p className="text-sm text-gray-500 mb-4">Configure the title that appears at the top of the Events page</p>

        {/* Live Preview */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Preview</h4>
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {content.hero?.title || 'Events'}
            </h2>
            <div className="w-16 h-1 mb-3" style={{ backgroundColor: '#2a3f75' }} />
            <p className="text-gray-600">Upcoming GETFund events and fundraising activities</p>
          </div>
        </div>

        <div className="space-y-6">
          <Input
            type="text"
            label="Page Title"
            placeholder="Events"
            value={content.hero?.title || ''}
            onChange={(e) => handleChange('hero', 'title', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events Section</h3>
        <div className="space-y-6">
          <Input
            type="text"
            label="Section Heading"
            placeholder="Upcoming events"
            value={content.upcomingEvents?.heading || ''}
            onChange={(e) => handleChange('upcomingEvents', 'heading', e.target.value)}
            required
          />

          {/* Events List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Events ({(content.upcomingEvents?.events || []).length})
              </label>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={addEvent}
              >
                + Add Event
              </Button>
            </div>

            {(content.upcomingEvents?.events || []).map((event, index) => (
              <div key={event.id} className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Event {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeEvent(index)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>

                <Input
                  type="text"
                  label="Event Title"
                  placeholder="Annual Fundraising Gala"
                  value={event.title}
                  onChange={(e) => handleEventChange(index, 'title', e.target.value)}
                  required
                />

                <Input
                  type="text"
                  label="Event Date"
                  placeholder="December 15, 2024 or TBD"
                  value={event.date}
                  onChange={(e) => handleEventChange(index, 'date', e.target.value)}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Description
                  </label>
                  <textarea
                    placeholder="Event details coming soon"
                    value={event.description}
                    onChange={(e) => handleEventChange(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <Input
                  type="text"
                  label="Event Image URL (Optional)"
                  placeholder="/uploads/event-image.jpg"
                  value={event.imageUrl || ''}
                  onChange={(e) => handleEventChange(index, 'imageUrl', e.target.value)}
                  helperText="Upload image to Media Library first, then paste URL here"
                />
              </div>
            ))}

            {(content.upcomingEvents?.events || []).length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">No events added yet. Click "Add Event" to create one.</p>
              </div>
            )}
          </div>

          {/* Empty State Messages */}
          <div className="pt-4 border-t border-gray-300">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Empty State Messages</h4>
            <p className="text-xs text-gray-500 mb-3">These messages show when there are no events to display</p>
            <div className="space-y-3">
              <Input
                type="text"
                label="Empty State Title"
                placeholder="No upcoming events at the moment."
                value={content.upcomingEvents?.emptyStateTitle || ''}
                onChange={(e) => handleChange('upcomingEvents', 'emptyStateTitle', e.target.value)}
              />
              <Input
                type="text"
                label="Empty State Subtitle"
                placeholder="Check back soon for updates!"
                value={content.upcomingEvents?.emptyStateSubtitle || ''}
                onChange={(e) => handleChange('upcomingEvents', 'emptyStateSubtitle', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> Events will be displayed in a card grid. Upload event images to the Media Library first, then paste the URL in the "Event Image URL" field.
        </p>
      </div>
    </div>
  );
};
