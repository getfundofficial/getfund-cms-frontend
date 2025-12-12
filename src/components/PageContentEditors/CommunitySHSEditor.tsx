import React from 'react';
import { Input } from '../Common/Input';
import { BannerBackgroundEditor } from './BannerBackgroundEditor';
import { Plus, Trash2 } from 'lucide-react';

interface BannerBackground {
  imageUrl?: string | null;
  tintColor?: string;
  tintOpacity?: number;
}

interface Section {
  heading: string;
  content: string;
}

interface ListSection {
  heading: string;
  items: string[];
}

interface CommunitySHSContent {
  bannerBackground?: BannerBackground;
  meta: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  infrastructureIntervention: Section;
  educationalMaterials: Section;
  policyObjectives: ListSection;
  impact: Section;
  roleOfGETFund: Section;
}

interface CommunitySHSEditorProps {
  content: CommunitySHSContent;
  onChange: (content: CommunitySHSContent) => void;
}

const defaultContent: CommunitySHSContent = {
  meta: {
    title: 'Free SHS Intervention Project | GETFund',
    description: 'Infrastructure intervention and educational materials support for the Free SHS Programme.',
  },
  hero: {
    title: 'Free SHS Intervention Project',
    subtitle: 'Supporting Ghana\'s Free and Quality Education Agenda through infrastructure and materials.',
  },
  infrastructureIntervention: {
    heading: 'Infrastructure Intervention',
    content: 'The increase in enrollment figures necessitated investment in education infrastructure to support the Free and Quality Education Agenda. The infrastructure gap widened following the increase in secondary school enrollment numbers.',
  },
  educationalMaterials: {
    heading: 'Educational Materials & Supplies',
    content: 'In addition to infrastructure intervention, additional supplies and learning materials were distributed to various schools (e.g. bunk beds, mattresses, teachers\' tables & chairs, common room chairs, mono desks, etc).',
  },
  policyObjectives: {
    heading: 'Policy Objectives',
    items: [
      'Removal of cost barriers',
      'Expansion of infrastructure',
      'Improvement in Quality and Equity',
      'Development of Employable Skills',
    ],
  },
  impact: {
    heading: 'Impact',
    content: 'Government has given full effect to SDG 4.1 with the implementation of a Free SHS Policy. The programme is anchored in the above pillars and has significantly increased access to secondary education in Ghana.',
  },
  roleOfGETFund: {
    heading: 'The Role of GETFund',
    content: 'GETFund provides financial support for infrastructure, educational materials, and supplementary funding to institutions under the Ministry of Education, Scholarship Secretariat, and Student Loan Trust Fund.',
  },
};

export const CommunitySHSEditor: React.FC<CommunitySHSEditorProps> = ({
  content,
  onChange,
}) => {
  const mergedContent = { ...defaultContent, ...content };

  const handleChange = (section: keyof CommunitySHSContent, field: string, value: any) => {
    onChange({
      ...mergedContent,
      [section]: {
        ...(mergedContent[section] as any),
        [field]: value,
      },
    });
  };

  const handlePolicyObjectiveChange = (index: number, value: string) => {
    const newItems = [...mergedContent.policyObjectives.items];
    newItems[index] = value;
    handleChange('policyObjectives', 'items', newItems);
  };

  const addPolicyObjective = () => {
    handleChange('policyObjectives', 'items', [...mergedContent.policyObjectives.items, '']);
  };

  const removePolicyObjective = (index: number) => {
    handleChange(
      'policyObjectives',
      'items',
      mergedContent.policyObjectives.items.filter((_, i) => i !== index)
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
            placeholder="Free SHS Intervention Project | GETFund"
            value={mergedContent.meta?.title || ''}
            onChange={(e) => handleChange('meta', 'title', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description (SEO)
            </label>
            <textarea
              placeholder="Infrastructure intervention and educational materials support..."
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
            placeholder="Free SHS Intervention Project"
            value={mergedContent.hero?.title || ''}
            onChange={(e) => handleChange('hero', 'title', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
            <textarea
              placeholder="Supporting Ghana's Free and Quality Education Agenda..."
              value={mergedContent.hero?.subtitle || ''}
              onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <BannerBackgroundEditor
            value={mergedContent.bannerBackground || {}}
            onChange={(bannerBackground) => onChange({ ...mergedContent, bannerBackground })}
            previewTitle={mergedContent.hero?.title || 'Free SHS Intervention Project'}
            previewSubtitle={mergedContent.hero?.subtitle || ''}
          />
        </div>
      </div>

      {/* Infrastructure Intervention */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Infrastructure Intervention</h3>
        <Input
          type="text"
          label="Section Heading"
          value={mergedContent.infrastructureIntervention?.heading || ''}
          onChange={(e) => handleChange('infrastructureIntervention', 'heading', e.target.value)}
        />
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={mergedContent.infrastructureIntervention?.content || ''}
            onChange={(e) => handleChange('infrastructureIntervention', 'content', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Educational Materials */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Educational Materials & Supplies</h3>
        <Input
          type="text"
          label="Section Heading"
          value={mergedContent.educationalMaterials?.heading || ''}
          onChange={(e) => handleChange('educationalMaterials', 'heading', e.target.value)}
        />
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={mergedContent.educationalMaterials?.content || ''}
            onChange={(e) => handleChange('educationalMaterials', 'content', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Policy Objectives */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Objectives</h3>
        <Input
          type="text"
          label="Section Heading"
          value={mergedContent.policyObjectives?.heading || ''}
          onChange={(e) => handleChange('policyObjectives', 'heading', e.target.value)}
        />
        <div className="mt-4 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Objectives</label>
          {mergedContent.policyObjectives?.items?.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handlePolicyObjectiveChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removePolicyObjective(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addPolicyObjective}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
          >
            <Plus className="w-4 h-4" /> Add Objective
          </button>
        </div>
      </div>

      {/* Impact */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact</h3>
        <Input
          type="text"
          label="Section Heading"
          value={mergedContent.impact?.heading || ''}
          onChange={(e) => handleChange('impact', 'heading', e.target.value)}
        />
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={mergedContent.impact?.content || ''}
            onChange={(e) => handleChange('impact', 'content', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Role of GETFund */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">The Role of GETFund</h3>
        <Input
          type="text"
          label="Section Heading"
          value={mergedContent.roleOfGETFund?.heading || ''}
          onChange={(e) => handleChange('roleOfGETFund', 'heading', e.target.value)}
        />
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={mergedContent.roleOfGETFund?.content || ''}
            onChange={(e) => handleChange('roleOfGETFund', 'content', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
