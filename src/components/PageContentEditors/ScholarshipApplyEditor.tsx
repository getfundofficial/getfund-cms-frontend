import React from 'react';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';

interface ScholarshipApplyContent {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    subtitle?: string;
  };
  requiredDocuments: {
    heading: string;
    items: string[];
  };
  howToApply: {
    heading: string;
    steps: string[];
  };
  applyButton: {
    text: string;
    url: string;
  };
  footerNote: string;
}

interface ScholarshipApplyEditorProps {
  content: ScholarshipApplyContent;
  onChange: (content: ScholarshipApplyContent) => void;
}

export const ScholarshipApplyEditor: React.FC<ScholarshipApplyEditorProps> = ({
  content,
  onChange,
}) => {
  const handleChange = (section: keyof ScholarshipApplyContent, field: string, value: any) => {
    onChange({
      ...content,
      [section]: {
        ...(content[section] as Record<string, unknown>),
        [field]: value,
      },
    });
  };

  const handleDocumentItemChange = (index: number, value: string) => {
    const newItems = [...(content.requiredDocuments?.items || [])];
    newItems[index] = value;
    onChange({
      ...content,
      requiredDocuments: { ...content.requiredDocuments, items: newItems },
    });
  };

  const addDocumentItem = () => {
    const items = content.requiredDocuments?.items || [];
    onChange({
      ...content,
      requiredDocuments: { ...content.requiredDocuments, items: [...items, ''] },
    });
  };

  const removeDocumentItem = (index: number) => {
    const newItems = [...(content.requiredDocuments?.items || [])];
    newItems.splice(index, 1);
    onChange({
      ...content,
      requiredDocuments: { ...content.requiredDocuments, items: newItems },
    });
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...(content.howToApply?.steps || [])];
    newSteps[index] = value;
    onChange({
      ...content,
      howToApply: { ...content.howToApply, steps: newSteps },
    });
  };

  const addStep = () => {
    const steps = content.howToApply?.steps || [];
    onChange({
      ...content,
      howToApply: { ...content.howToApply, steps: [...steps, ''] },
    });
  };

  const removeStep = (index: number) => {
    const newSteps = [...(content.howToApply?.steps || [])];
    newSteps.splice(index, 1);
    onChange({
      ...content,
      howToApply: { ...content.howToApply, steps: newSteps },
    });
  };

  return (
    <div className="space-y-8">
      {/* Meta Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO & Meta</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Page Title (Browser Tab)"
            placeholder="Apply for Scholarship | GETFund"
            value={content.meta?.title || ''}
            onChange={(e) => handleChange('meta', 'title', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description
            </label>
            <textarea
              placeholder="Apply for GETFund scholarship..."
              value={content.meta?.description || ''}
              onChange={(e) => handleChange('meta', 'description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Page Title Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Title</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Title"
            placeholder="Apply for GETFund Scholarship"
            value={content.hero?.title || ''}
            onChange={(e) => handleChange('hero', 'title', e.target.value)}
          />
          <Input
            type="text"
            label="Subtitle"
            placeholder="Please review the eligibility criteria and guidelines..."
            value={content.hero?.subtitle || ''}
            onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
          />
        </div>
      </div>

      {/* Required Documents */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Required Documents</h3>
          <Button onClick={addDocumentItem} variant="primary" size="sm">
            + Add Item
          </Button>
        </div>
        <div className="space-y-4">
          <Input
            type="text"
            label="Section Heading"
            placeholder="Required Documents"
            value={content.requiredDocuments?.heading || ''}
            onChange={(e) => handleChange('requiredDocuments', 'heading', e.target.value)}
          />
          <div className="space-y-3">
            {(content.requiredDocuments?.items || []).map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="text"
                  placeholder={`Document ${index + 1}`}
                  value={item}
                  onChange={(e) => handleDocumentItemChange(index, e.target.value)}
                  className="flex-1"
                />
                <button
                  onClick={() => removeDocumentItem(index)}
                  className="px-3 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How to Apply */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">How to Apply</h3>
          <Button onClick={addStep} variant="primary" size="sm">
            + Add Step
          </Button>
        </div>
        <div className="space-y-4">
          <Input
            type="text"
            label="Section Heading"
            placeholder="How to Apply"
            value={content.howToApply?.heading || ''}
            onChange={(e) => handleChange('howToApply', 'heading', e.target.value)}
          />
          <div className="space-y-3">
            {(content.howToApply?.steps || []).map((step, index) => (
              <div key={index} className="flex gap-2 items-start">
                <span className="px-3 py-2 bg-gray-100 rounded-lg font-medium text-gray-700">
                  {index + 1}.
                </span>
                <Input
                  type="text"
                  placeholder={`Step ${index + 1}`}
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  className="flex-1"
                />
                <button
                  onClick={() => removeStep(index)}
                  className="px-3 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply Button</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            label="Button Text"
            placeholder="Start Application"
            value={content.applyButton?.text || ''}
            onChange={(e) => handleChange('applyButton', 'text', e.target.value)}
          />
          <Input
            type="text"
            label="Button URL"
            placeholder="https://scholarships.getfund.gov.gh/"
            value={content.applyButton?.url || ''}
            onChange={(e) => handleChange('applyButton', 'url', e.target.value)}
          />
        </div>
      </div>

      {/* Footer Note */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Footer Note</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note Text
          </label>
          <textarea
            placeholder="For more information on the application process..."
            value={content.footerNote || ''}
            onChange={(e) => onChange({ ...content, footerNote: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
