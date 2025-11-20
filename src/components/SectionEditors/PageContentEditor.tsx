import React, { useState, useEffect } from 'react';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';
import { Plus, Trash2 } from 'lucide-react';

interface Service {
  link: string;
  title: string;
  description: string;
}

interface PageContentEditorProps {
  initialData: any;
  onChange: (data: any) => void;
}

export const PageContentEditor: React.FC<PageContentEditorProps> = ({ initialData, onChange }) => {
  const [description, setDescription] = useState(initialData?.description || '');
  const [services, setServices] = useState<Service[]>(initialData?.services || []);

  useEffect(() => {
    onChange({
      description,
      services,
    });
  }, [description, services]);

  const addService = () => {
    setServices([...services, { link: '', title: '', description: '' }]);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: keyof Service, value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Page Description
        </label>
        <textarea
          placeholder="Brief description or mission statement"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          A brief overview or mission statement for this page
        </p>
      </div>

      {/* Services */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Services / Programs</h3>
            <p className="text-sm text-gray-600">Add the main services or programs featured on this page</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={addService}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </Button>
        </div>

        {services.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">No services added yet. Click "Add Service" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Service {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Remove service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <Input
                  type="text"
                  label="Title"
                  placeholder="Scholarship Programme"
                  value={service.title}
                  onChange={(e) => updateService(index, 'title', e.target.value)}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Brief description of this service..."
                    value={service.description}
                    onChange={(e) => updateService(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <Input
                  type="text"
                  label="Link"
                  placeholder="/service/scholarship-programme"
                  value={service.link}
                  onChange={(e) => updateService(index, 'link', e.target.value)}
                  helperText="The URL or path where users can learn more"
                  required
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">📝 Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Keep descriptions concise and focused</li>
          <li>Use relative URLs (e.g., /service/...) for internal links</li>
          <li>Order services by priority (drag functionality coming soon)</li>
          <li>Aim for 3-6 main services for optimal display</li>
        </ul>
      </div>
    </div>
  );
};
