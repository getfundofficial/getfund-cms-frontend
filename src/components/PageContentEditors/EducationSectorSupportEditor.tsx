import React from 'react';
import { Input } from '../Common/Input';
import { BannerBackgroundEditor } from './BannerBackgroundEditor';
import { Plus, Trash2 } from 'lucide-react';

interface BannerBackground {
  imageUrl?: string | null;
  tintColor?: string;
  tintOpacity?: number;
}

interface SupportArea {
  heading: string;
  items: string[];
}

interface SupportProgram {
  title: string;
  description: string;
  subItems?: { title: string; description: string }[];
}

interface ImpactMetric {
  value: string;
  label: string;
}

interface EducationSectorSupportContent {
  bannerBackground?: BannerBackground;
  meta: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  mainContent: {
    heading: string;
    paragraph: string;
  };
  supportAreas: SupportArea[];
  supportPrograms: SupportProgram[];
  impactMetrics: {
    heading: string;
    metrics: ImpactMetric[];
  };
}

interface EducationSectorSupportEditorProps {
  content: EducationSectorSupportContent;
  onChange: (content: EducationSectorSupportContent) => void;
}

const defaultContent: EducationSectorSupportContent = {
  meta: {
    title: 'Education Sector Support | GETFund',
    description: 'Supporting initiatives that improve education quality and learning outcomes in Ghana.',
  },
  hero: {
    title: 'Education Sector Support',
    subtitle: 'Supporting initiatives that improve education quality and learning outcomes',
  },
  mainContent: {
    heading: 'Comprehensive Education Support',
    paragraph: 'GETFund provides comprehensive support to Ghana\'s education sector through various initiatives designed to improve the quality of education delivery and enhance learning outcomes at all levels of education.',
  },
  supportAreas: [
    {
      heading: 'Financial Support',
      items: [
        'Institutional funding assistance',
        'Scholarship Secretariat support',
        'Student Loan Trust Fund backing',
        'Emergency educational funding',
      ],
    },
    {
      heading: 'Capacity Building',
      items: [
        'Faculty training programs',
        'Research grants through NCTE',
        'Professional development initiatives',
        'Educational leadership programs',
      ],
    },
  ],
  supportPrograms: [
    {
      title: 'Ministry of Education Support',
      description: 'Direct financial assistance to institutions under the Ministry of Education to enhance their operational capacity and educational delivery.',
      subItems: [
        { title: 'Basic Education', description: 'Supporting primary and junior high schools' },
        { title: 'Secondary Education', description: 'Enhancing senior high school programs' },
        { title: 'Tertiary Education', description: 'Supporting universities and colleges' },
      ],
    },
    {
      title: 'NCTE Research Grants',
      description: 'Providing grants through the National Council for Tertiary Education (NCTE) for faculty member training and research initiatives.',
    },
  ],
  impactMetrics: {
    heading: 'Impact Metrics',
    metrics: [
      { value: '200+', label: 'Institutions supported annually' },
      { value: '1,500+', label: 'Faculty members trained' },
      { value: '₵500M+', label: 'Annual support provided' },
    ],
  },
};

export const EducationSectorSupportEditor: React.FC<EducationSectorSupportEditorProps> = ({
  content,
  onChange,
}) => {
  const mergedContent = { ...defaultContent, ...content };

  const handleChange = (section: keyof EducationSectorSupportContent, field: string, value: any) => {
    onChange({
      ...mergedContent,
      [section]: {
        ...(mergedContent[section] as any),
        [field]: value,
      },
    });
  };

  // Support Areas handlers
  const handleSupportAreaChange = (index: number, field: string, value: any) => {
    const newAreas = [...mergedContent.supportAreas];
    newAreas[index] = { ...newAreas[index], [field]: value };
    onChange({ ...mergedContent, supportAreas: newAreas });
  };

  const handleSupportAreaItemChange = (areaIndex: number, itemIndex: number, value: string) => {
    const newAreas = [...mergedContent.supportAreas];
    const newItems = [...newAreas[areaIndex].items];
    newItems[itemIndex] = value;
    newAreas[areaIndex] = { ...newAreas[areaIndex], items: newItems };
    onChange({ ...mergedContent, supportAreas: newAreas });
  };

  const addSupportAreaItem = (areaIndex: number) => {
    const newAreas = [...mergedContent.supportAreas];
    newAreas[areaIndex] = { ...newAreas[areaIndex], items: [...newAreas[areaIndex].items, ''] };
    onChange({ ...mergedContent, supportAreas: newAreas });
  };

  const removeSupportAreaItem = (areaIndex: number, itemIndex: number) => {
    const newAreas = [...mergedContent.supportAreas];
    newAreas[areaIndex] = {
      ...newAreas[areaIndex],
      items: newAreas[areaIndex].items.filter((_, i) => i !== itemIndex),
    };
    onChange({ ...mergedContent, supportAreas: newAreas });
  };

  const addSupportArea = () => {
    onChange({
      ...mergedContent,
      supportAreas: [...mergedContent.supportAreas, { heading: '', items: [] }],
    });
  };

  const removeSupportArea = (index: number) => {
    onChange({
      ...mergedContent,
      supportAreas: mergedContent.supportAreas.filter((_, i) => i !== index),
    });
  };

  // Support Programs handlers
  const handleProgramChange = (index: number, field: string, value: any) => {
    const newPrograms = [...mergedContent.supportPrograms];
    newPrograms[index] = { ...newPrograms[index], [field]: value };
    onChange({ ...mergedContent, supportPrograms: newPrograms });
  };

  const addProgram = () => {
    onChange({
      ...mergedContent,
      supportPrograms: [...mergedContent.supportPrograms, { title: '', description: '' }],
    });
  };

  const removeProgram = (index: number) => {
    onChange({
      ...mergedContent,
      supportPrograms: mergedContent.supportPrograms.filter((_, i) => i !== index),
    });
  };

  // Impact Metrics handlers
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
            placeholder="Education Sector Support | GETFund"
            value={mergedContent.meta?.title || ''}
            onChange={(e) => handleChange('meta', 'title', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description (SEO)
            </label>
            <textarea
              placeholder="Supporting initiatives that improve education..."
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Hero Title"
            placeholder="Education Sector Support"
            value={mergedContent.hero?.title || ''}
            onChange={(e) => handleChange('hero', 'title', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
            <textarea
              placeholder="Supporting initiatives..."
              value={mergedContent.hero?.subtitle || ''}
              onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <BannerBackgroundEditor
            value={mergedContent.bannerBackground || {}}
            onChange={(bannerBackground) => onChange({ ...mergedContent, bannerBackground })}
            previewTitle={mergedContent.hero?.title || 'Education Sector Support'}
            previewSubtitle={mergedContent.hero?.subtitle || ''}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Main Content</h3>
        <Input
          type="text"
          label="Section Heading"
          value={mergedContent.mainContent?.heading || ''}
          onChange={(e) => handleChange('mainContent', 'heading', e.target.value)}
        />
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={mergedContent.mainContent?.paragraph || ''}
            onChange={(e) => handleChange('mainContent', 'paragraph', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Support Areas */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Support Areas</h3>
        <div className="space-y-6">
          {mergedContent.supportAreas?.map((area, areaIndex) => (
            <div key={areaIndex} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <Input
                  type="text"
                  label="Area Heading"
                  value={area.heading}
                  onChange={(e) => handleSupportAreaChange(areaIndex, 'heading', e.target.value)}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeSupportArea(areaIndex)}
                  className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Items</label>
                {area.items?.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleSupportAreaItemChange(areaIndex, itemIndex, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeSupportAreaItem(areaIndex, itemIndex)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSupportAreaItem(areaIndex)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addSupportArea}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Support Area
          </button>
        </div>
      </div>

      {/* Support Programs */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Programs</h3>
        <div className="space-y-4">
          {mergedContent.supportPrograms?.map((program, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-500">Program {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeProgram(index)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <Input
                type="text"
                label="Title"
                value={program.title}
                onChange={(e) => handleProgramChange(index, 'title', e.target.value)}
              />
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={program.description}
                  onChange={(e) => handleProgramChange(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addProgram}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Program
          </button>
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
                  placeholder="200+"
                  value={metric.value}
                  onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  label={index === 0 ? 'Label' : ''}
                  placeholder="Institutions supported annually"
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
    </div>
  );
};
