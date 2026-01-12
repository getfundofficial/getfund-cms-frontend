import React from 'react';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQContent {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    subtitle?: string;
  };
  faqs: FAQItem[];
  contactCta: {
    text: string;
    buttonText: string;
    buttonLink: string;
  };
}

interface FAQEditorProps {
  content: FAQContent;
  onChange: (content: FAQContent) => void;
}

export const FAQEditor: React.FC<FAQEditorProps> = ({
  content,
  onChange,
}) => {
  const handleChange = (section: keyof FAQContent, field: string, value: any) => {
    onChange({
      ...content,
      [section]: {
        ...(content[section] as Record<string, unknown>),
        [field]: value,
      },
    });
  };

  const handleFAQChange = (index: number, field: keyof FAQItem, value: string) => {
    const newFAQs = [...(content.faqs || [])];
    newFAQs[index] = { ...newFAQs[index], [field]: value };
    onChange({ ...content, faqs: newFAQs });
  };

  const addFAQ = () => {
    const faqs = content.faqs || [];
    const newFAQ: FAQItem = {
      question: '',
      answer: '',
    };
    onChange({ ...content, faqs: [...faqs, newFAQ] });
  };

  const removeFAQ = (index: number) => {
    const newFAQs = [...(content.faqs || [])];
    newFAQs.splice(index, 1);
    onChange({ ...content, faqs: newFAQs });
  };

  const moveFAQ = (index: number, direction: 'up' | 'down') => {
    const faqs = content.faqs || [];
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === faqs.length - 1)
    ) {
      return;
    }
    const newFAQs = [...faqs];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newFAQs[index], newFAQs[swapIndex]] = [newFAQs[swapIndex], newFAQs[index]];
    onChange({ ...content, faqs: newFAQs });
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
            placeholder="FAQ | GETFund"
            value={content.meta?.title || ''}
            onChange={(e) => handleChange('meta', 'title', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description
            </label>
            <textarea
              placeholder="Frequently asked questions about GETFund..."
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
            placeholder="Frequently Asked Questions"
            value={content.hero?.title || ''}
            onChange={(e) => handleChange('hero', 'title', e.target.value)}
          />
          <Input
            type="text"
            label="Subtitle (Optional)"
            placeholder="Find answers to common questions about GETFund"
            value={content.hero?.subtitle || ''}
            onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
          />
        </div>
      </div>

      {/* FAQ Items */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">FAQ Items</h3>
          <Button onClick={addFAQ} variant="primary" size="sm">
            + Add FAQ
          </Button>
        </div>

        <div className="space-y-4">
          {(content.faqs || []).map((faq, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-700">FAQ #{index + 1}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveFAQ(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveFAQ(index, 'down')}
                    disabled={index === (content.faqs?.length || 0) - 1}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeFAQ(index)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Remove FAQ"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <Input
                  type="text"
                  label="Question"
                  placeholder="What is GETFund?"
                  value={faq.question}
                  onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Answer
                  </label>
                  <textarea
                    placeholder="Enter the answer to this question..."
                    value={faq.answer}
                    onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}

          {(!content.faqs || content.faqs.length === 0) && (
            <p className="text-center text-gray-500 py-8">
              No FAQ items yet. Click "Add FAQ" to create one.
            </p>
          )}
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Call-to-Action</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="CTA Text"
            placeholder="Can't find the answer you're looking for?"
            value={content.contactCta?.text || ''}
            onChange={(e) => handleChange('contactCta', 'text', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              label="Button Text"
              placeholder="Contact Us"
              value={content.contactCta?.buttonText || ''}
              onChange={(e) => handleChange('contactCta', 'buttonText', e.target.value)}
            />
            <Input
              type="text"
              label="Button Link"
              placeholder="/contact"
              value={content.contactCta?.buttonLink || ''}
              onChange={(e) => handleChange('contactCta', 'buttonLink', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
