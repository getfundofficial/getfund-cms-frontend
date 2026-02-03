import React from 'react';
import { Input } from '../Common/Input';
import { Plus, Trash2 } from 'lucide-react';

interface Section {
  heading: string;
  content: string;
}

interface ListSection {
  heading: string;
  items: string[];
}

interface ImpactMetric {
  value: string;
  label: string;
}

interface SEIPContent {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  overview: Section;
  objectives: ListSection;
  keyComponents: ListSection;
  implementation: Section;
  impactMetrics: {
    heading: string;
    metrics: ImpactMetric[];
  };
  achievements: ListSection;
  futureOutlook: Section;
}

interface SEIPEditorProps {
  content: SEIPContent;
  onChange: (content: SEIPContent) => void;
}

const defaultContent: SEIPContent = {
  meta: {
    title: 'Secondary Education Improvement Programme | GETFund',
    description: 'Details about the Secondary Education Improvement Programme, its goals, and achievements.',
  },
  hero: {
    title: 'Secondary Education Improvement Programme',
    subtitle: 'Enhancing the quality of secondary education across Ghana.',
  },
  overview: {
    heading: 'Programme Overview',
    content: 'The Secondary Education Improvement Programme (SEIP) is a comprehensive initiative designed to enhance the quality of secondary education in Ghana. The programme focuses on infrastructure development, teacher training, and curriculum enhancement to ensure students receive world-class education.',
  },
  objectives: {
    heading: 'Programme Objectives',
    items: [
      'Improve the quality of teaching and learning in secondary schools',
      'Enhance infrastructure and facilities in senior high schools',
      'Strengthen school management and governance',
      'Increase access to quality secondary education for all Ghanaians',
    ],
  },
  keyComponents: {
    heading: 'Key Components',
    items: [
      'Infrastructure Development - Construction and rehabilitation of school facilities',
      'Teacher Professional Development - Training and capacity building for educators',
      'Curriculum Enhancement - Modernization of educational content and methods',
      'ICT Integration - Digital learning tools and technology infrastructure',
      'School Management Support - Administrative systems and governance training',
    ],
  },
  implementation: {
    heading: 'Implementation Strategy',
    content: 'The programme is implemented through a phased approach, prioritizing schools with the greatest need while ensuring equitable distribution of resources across all regions. GETFund works closely with the Ministry of Education and Ghana Education Service to coordinate activities and maximize impact.',
  },
  impactMetrics: {
    heading: 'Impact Metrics',
    metrics: [
      { value: '500+', label: 'Schools Supported' },
      { value: '10,000+', label: 'Teachers Trained' },
      { value: '2M+', label: 'Students Benefited' },
    ],
  },
  achievements: {
    heading: 'Key Achievements',
    items: [
      'Improved pass rates in WASSCE examinations',
      'Reduced student-to-teacher ratios in participating schools',
      'Enhanced laboratory and ICT facilities in over 300 schools',
      'Trained over 10,000 teachers in modern pedagogical methods',
    ],
  },
  futureOutlook: {
    heading: 'Future Outlook',
    content: 'SEIP continues to evolve to meet the changing needs of secondary education in Ghana. Future phases will focus on expanding ICT infrastructure, strengthening STEM education, and ensuring that all Ghanaian students have access to quality secondary education regardless of their location or background.',
  },
};

export const SEIPEditor: React.FC<SEIPEditorProps> = ({
  content,
  onChange,
}) => {
  const mergedContent = { ...defaultContent, ...content };

  const handleChange = (section: keyof SEIPContent, field: string, value: any) => {
    onChange({
      ...mergedContent,
      [section]: {
        ...(mergedContent[section] as any),
        [field]: value,
      },
    });
  };

  const handleListChange = (section: keyof SEIPContent, index: number, value: string) => {
    const sectionData = mergedContent[section] as ListSection;
    const newItems = [...sectionData.items];
    newItems[index] = value;
    handleChange(section, 'items', newItems);
  };

  const addListItem = (section: keyof SEIPContent) => {
    const sectionData = mergedContent[section] as ListSection;
    handleChange(section, 'items', [...sectionData.items, '']);
  };

  const removeListItem = (section: keyof SEIPContent, index: number) => {
    const sectionData = mergedContent[section] as ListSection;
    handleChange(section, 'items', sectionData.items.filter((_, i) => i !== index));
  };

  const handleMetricChange = (index: number, field: string, value: string) => {
    const newMetrics = [...mergedContent.impactMetrics.metrics];
    newMetrics[index] = { ...newMetrics[index], [field]: value };
    handleChange('impactMetrics', 'metrics', newMetrics);
  };

  const addMetric = () => {
    handleChange('impactMetrics', 'metrics', [
      ...mergedContent.impactMetrics.metrics,
      { value: '', label: '' },
    ]);
  };

  const removeMetric = (index: number) => {
    handleChange(
      'impactMetrics',
      'metrics',
      mergedContent.impactMetrics.metrics.filter((_, i) => i !== index)
    );
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
            placeholder="Secondary Education Improvement Programme | GETFund"
            value={mergedContent.meta?.title || ''}
            onChange={(e) => handleChange('meta', 'title', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description (SEO)
            </label>
            <textarea
              placeholder="Details about the Secondary Education Improvement Programme..."
              value={mergedContent.meta?.description || ''}
              onChange={(e) => handleChange('meta', 'description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Header</h3>
        <p className="text-sm text-gray-500 mb-4">Configure the title and description that appears at the top of the page</p>

        {/* Live Preview */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Preview</h4>
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {mergedContent.hero?.title || 'Secondary Education Improvement Programme'}
            </h2>
            <div className="w-16 h-1 mb-3" style={{ backgroundColor: '#2a3f75' }} />
            <p className="text-gray-600">
              {mergedContent.hero?.subtitle || 'Enhancing the quality of secondary education across Ghana.'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            type="text"
            label="Page Title"
            placeholder="Secondary Education Improvement Programme"
            value={mergedContent.hero?.title || ''}
            onChange={(e) => handleChange('hero', 'title', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Page Subtitle</label>
            <textarea
              placeholder="Enhancing the quality of secondary education..."
              value={mergedContent.hero?.subtitle || ''}
              onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Programme Overview */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Programme Overview</h3>
        <Input
          type="text"
          label="Section Heading"
          value={mergedContent.overview?.heading || ''}
          onChange={(e) => handleChange('overview', 'heading', e.target.value)}
        />
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={mergedContent.overview?.content || ''}
            onChange={(e) => handleChange('overview', 'content', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Programme Objectives */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Programme Objectives</h3>
        <Input
          type="text"
          label="Section Heading"
          value={mergedContent.objectives?.heading || ''}
          onChange={(e) => handleChange('objectives', 'heading', e.target.value)}
        />
        <div className="mt-4 space-y-2">
          {mergedContent.objectives?.items?.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleListChange('objectives', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeListItem('objectives', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem('objectives')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
          >
            <Plus className="w-4 h-4" /> Add Objective
          </button>
        </div>
      </div>

      {/* Key Components */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Components</h3>
        <Input
          type="text"
          label="Section Heading"
          value={mergedContent.keyComponents?.heading || ''}
          onChange={(e) => handleChange('keyComponents', 'heading', e.target.value)}
        />
        <div className="mt-4 space-y-2">
          {mergedContent.keyComponents?.items?.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleListChange('keyComponents', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeListItem('keyComponents', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem('keyComponents')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
          >
            <Plus className="w-4 h-4" /> Add Component
          </button>
        </div>
      </div>

      {/* Implementation Strategy */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Implementation Strategy</h3>
        <Input
          type="text"
          label="Section Heading"
          value={mergedContent.implementation?.heading || ''}
          onChange={(e) => handleChange('implementation', 'heading', e.target.value)}
        />
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={mergedContent.implementation?.content || ''}
            onChange={(e) => handleChange('implementation', 'content', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Metrics</h3>
        <Input
          type="text"
          label="Section Heading"
          value={mergedContent.impactMetrics?.heading || ''}
          onChange={(e) => handleChange('impactMetrics', 'heading', e.target.value)}
        />
        <div className="mt-4 space-y-3">
          {mergedContent.impactMetrics?.metrics?.map((metric, index) => (
            <div key={index} className="flex gap-3 items-end">
              <div className="w-32">
                <Input
                  type="text"
                  label={index === 0 ? 'Value' : ''}
                  placeholder="500+"
                  value={metric.value}
                  onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  label={index === 0 ? 'Label' : ''}
                  placeholder="Schools Supported"
                  value={metric.label}
                  onChange={(e) => handleMetricChange(index, 'label', e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => removeMetric(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg mb-1"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMetric}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
          >
            <Plus className="w-4 h-4" /> Add Metric
          </button>
        </div>
      </div>

      {/* Key Achievements */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Achievements</h3>
        <Input
          type="text"
          label="Section Heading"
          value={mergedContent.achievements?.heading || ''}
          onChange={(e) => handleChange('achievements', 'heading', e.target.value)}
        />
        <div className="mt-4 space-y-2">
          {mergedContent.achievements?.items?.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleListChange('achievements', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeListItem('achievements', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem('achievements')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
          >
            <Plus className="w-4 h-4" /> Add Achievement
          </button>
        </div>
      </div>

      {/* Future Outlook */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Future Outlook</h3>
        <Input
          type="text"
          label="Section Heading"
          value={mergedContent.futureOutlook?.heading || ''}
          onChange={(e) => handleChange('futureOutlook', 'heading', e.target.value)}
        />
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={mergedContent.futureOutlook?.content || ''}
            onChange={(e) => handleChange('futureOutlook', 'content', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
