import React from 'react';
import { Input } from '../Common/Input';
import { BannerBackgroundEditor } from './BannerBackgroundEditor';
import { Plus, Trash2 } from 'lucide-react';

interface BannerBackground {
  imageUrl?: string | null;
  tintColor?: string;
  tintOpacity?: number;
}

interface ProjectCard {
  title: string;
  description: string;
}

interface Achievement {
  text: string;
}

interface FundingHighlight {
  text: string;
}

interface InfrastructureProjectsContent {
  bannerBackground?: BannerBackground;
  meta: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  mainIntro: {
    paragraph: string;
  };
  projectHighlights: {
    heading: string;
    items: string[];
  };
  recentProjects: {
    heading: string;
    projects: ProjectCard[];
  };
  mandateSection: {
    paragraph: string;
  };
  achievements: {
    heading: string;
    items: Achievement[];
  };
  fundingHighlights: {
    heading: string;
    items: FundingHighlight[];
  };
  impactSection: {
    heading: string;
    paragraph: string;
  };
  ongoingCommitment: {
    heading: string;
    paragraph: string;
  };
}

interface InfrastructureProjectsEditorProps {
  content: InfrastructureProjectsContent;
  onChange: (content: InfrastructureProjectsContent) => void;
}

const defaultContent: InfrastructureProjectsContent = {
  meta: {
    title: 'Infrastructure Projects | GETFund',
    description: "GETFund's infrastructure investments have transformed the educational landscape of Ghana.",
  },
  hero: {
    title: 'Infrastructure Projects',
    subtitle: "GETFund's infrastructure investments have transformed the educational landscape of Ghana.",
  },
  mainIntro: {
    paragraph: "GETFund's infrastructure investments have transformed the educational landscape of Ghana. We build, rehabilitate, and equip schools and tertiary institutions to provide safe, modern, and inspiring spaces for learning and growth.",
  },
  projectHighlights: {
    heading: 'Project Highlights',
    items: [
      'Construction of classroom blocks, dormitories, libraries, science and ICT laboratories.',
      'Modern school infrastructure in both urban and rural communities.',
      'Special focus on underserved, remote, and disadvantaged areas.',
      'Collaboration with government, local authorities, and development partners.',
    ],
  },
  recentProjects: {
    heading: 'Recent Projects',
    projects: [
      {
        title: 'Community Day Senior High Schools',
        description: 'Newly constructed classroom blocks, dormitories, and science labs to expand access to secondary education, especially in rural communities.',
      },
      {
        title: 'Basic Education Infrastructure',
        description: 'Rehabilitation and equipping of basic schools with modern facilities, furniture, and teaching/learning materials.',
      },
      {
        title: 'Tertiary Institution Upgrades',
        description: 'Expansion and modernization of lecture halls, libraries, and laboratories in universities and colleges across Ghana.',
      },
      {
        title: 'Inclusive Facilities',
        description: 'Provision of disability-friendly infrastructure and resources to promote inclusive education for all learners.',
      },
    ],
  },
  mandateSection: {
    paragraph: "Since its inception, the core mandate of GETFund, per its enabling Act of parliament in 2000 (Act 581), has been to provide funding to supplement government effort for the provision of educational infrastructure and facilities within the public sector from the pre-tertiary to the tertiary level.",
  },
  achievements: {
    heading: 'Key Achievements',
    items: [
      { text: 'Expansion and improvement of academic facilities at tertiary, technical, and health institutions' },
      { text: 'Construction of lecture theatres, libraries, laboratories, and hostel facilities' },
      { text: 'Renovation of existing hostels and provision of essential laboratory equipment' },
      { text: 'Significant infrastructural improvements at institutions like University of Cape Coast (UCC)' },
    ],
  },
  fundingHighlights: {
    heading: 'Funding Highlights',
    items: [
      { text: 'In 2004, over 74% of total allocations were directed toward tertiary infrastructure' },
      { text: 'In 2018, Parliament approved GHC 924.8 million for disbursement, with 37.48% allocated to tertiary education' },
      { text: 'In 2019, GHC 1.2 billion was approved, with tertiary education receiving the largest share of 26.4%' },
    ],
  },
  impactSection: {
    heading: 'Impact',
    paragraph: "GETFund's investments have enhanced the learning environment and strengthened Ghana's capacity to train a new generation of skilled professionals. The Fund remains committed to ensuring that every Ghanaian learner has access to quality tertiary education in a modern, well-resourced academic environment.",
  },
  ongoingCommitment: {
    heading: 'Ongoing Commitment',
    paragraph: "Through sustained investments, GETFund continues to play a transformative role in Ghana's higher education landscape, ensuring access and quality for all.",
  },
};

export const InfrastructureProjectsEditor: React.FC<InfrastructureProjectsEditorProps> = ({
  content,
  onChange,
}) => {
  // Merge with defaults
  const mergedContent = { ...defaultContent, ...content };

  const handleChange = (section: keyof InfrastructureProjectsContent, field: string, value: any) => {
    onChange({
      ...mergedContent,
      [section]: {
        ...(mergedContent[section] as any),
        [field]: value,
      },
    });
  };

  const handleArrayItemChange = (section: keyof InfrastructureProjectsContent, field: string, index: number, value: string) => {
    const sectionData = mergedContent[section] as any;
    const newItems = [...sectionData[field]];
    if (typeof newItems[index] === 'string') {
      newItems[index] = value;
    } else {
      newItems[index] = { ...newItems[index], text: value };
    }
    handleChange(section, field, newItems);
  };

  const addArrayItem = (section: keyof InfrastructureProjectsContent, field: string, defaultValue: any) => {
    const sectionData = mergedContent[section] as any;
    const newItems = [...sectionData[field], defaultValue];
    handleChange(section, field, newItems);
  };

  const removeArrayItem = (section: keyof InfrastructureProjectsContent, field: string, index: number) => {
    const sectionData = mergedContent[section] as any;
    const newItems = sectionData[field].filter((_: any, i: number) => i !== index);
    handleChange(section, field, newItems);
  };

  const handleProjectChange = (index: number, field: keyof ProjectCard, value: string) => {
    const newProjects = [...mergedContent.recentProjects.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    handleChange('recentProjects', 'projects', newProjects);
  };

  const addProject = () => {
    const newProjects = [...mergedContent.recentProjects.projects, { title: '', description: '' }];
    handleChange('recentProjects', 'projects', newProjects);
  };

  const removeProject = (index: number) => {
    const newProjects = mergedContent.recentProjects.projects.filter((_, i) => i !== index);
    handleChange('recentProjects', 'projects', newProjects);
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
            placeholder="Infrastructure Projects | GETFund"
            value={mergedContent.meta?.title || ''}
            onChange={(e) => handleChange('meta', 'title', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description (SEO)
            </label>
            <textarea
              placeholder="GETFund's infrastructure investments have transformed the educational landscape..."
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
            placeholder="Infrastructure Projects"
            value={mergedContent.hero?.title || ''}
            onChange={(e) => handleChange('hero', 'title', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hero Subtitle
            </label>
            <textarea
              placeholder="GETFund's infrastructure investments..."
              value={mergedContent.hero?.subtitle || ''}
              onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <BannerBackgroundEditor
            value={mergedContent.bannerBackground || {}}
            onChange={(bannerBackground) => onChange({ ...mergedContent, bannerBackground })}
            previewTitle={mergedContent.hero?.title || 'Infrastructure Projects'}
            previewSubtitle={mergedContent.hero?.subtitle || ''}
          />
        </div>
      </div>

      {/* Main Introduction */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Main Introduction</h3>
        <textarea
          placeholder="Main introduction paragraph..."
          value={mergedContent.mainIntro?.paragraph || ''}
          onChange={(e) => handleChange('mainIntro', 'paragraph', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Project Highlights */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Highlights</h3>
        <Input
          type="text"
          label="Section Heading"
          value={mergedContent.projectHighlights?.heading || ''}
          onChange={(e) => handleChange('projectHighlights', 'heading', e.target.value)}
        />
        <div className="mt-4 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Highlight Items</label>
          {mergedContent.projectHighlights?.items?.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayItemChange('projectHighlights', 'items', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('projectHighlights', 'items', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('projectHighlights', 'items', '')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
          >
            <Plus className="w-4 h-4" /> Add Highlight
          </button>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
        <Input
          type="text"
          label="Section Heading"
          value={mergedContent.recentProjects?.heading || ''}
          onChange={(e) => handleChange('recentProjects', 'heading', e.target.value)}
        />
        <div className="mt-4 space-y-4">
          {mergedContent.recentProjects?.projects?.map((project, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-500">Project {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <Input
                type="text"
                label="Title"
                value={project.title}
                onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
              />
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={project.description}
                  onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addProject}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>
      </div>

      {/* Mandate Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mandate Section</h3>
        <textarea
          placeholder="GETFund mandate description..."
          value={mergedContent.mandateSection?.paragraph || ''}
          onChange={(e) => handleChange('mandateSection', 'paragraph', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Achievements */}
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
                value={item.text}
                onChange={(e) => handleArrayItemChange('achievements', 'items', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('achievements', 'items', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('achievements', 'items', { text: '' })}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
          >
            <Plus className="w-4 h-4" /> Add Achievement
          </button>
        </div>
      </div>

      {/* Funding Highlights */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Funding Highlights</h3>
        <Input
          type="text"
          label="Section Heading"
          value={mergedContent.fundingHighlights?.heading || ''}
          onChange={(e) => handleChange('fundingHighlights', 'heading', e.target.value)}
        />
        <div className="mt-4 space-y-2">
          {mergedContent.fundingHighlights?.items?.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item.text}
                onChange={(e) => handleArrayItemChange('fundingHighlights', 'items', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('fundingHighlights', 'items', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('fundingHighlights', 'items', { text: '' })}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
          >
            <Plus className="w-4 h-4" /> Add Funding Highlight
          </button>
        </div>
      </div>

      {/* Impact Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Section</h3>
        <Input
          type="text"
          label="Section Heading"
          value={mergedContent.impactSection?.heading || ''}
          onChange={(e) => handleChange('impactSection', 'heading', e.target.value)}
        />
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={mergedContent.impactSection?.paragraph || ''}
            onChange={(e) => handleChange('impactSection', 'paragraph', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Ongoing Commitment */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ongoing Commitment</h3>
        <Input
          type="text"
          label="Section Heading"
          value={mergedContent.ongoingCommitment?.heading || ''}
          onChange={(e) => handleChange('ongoingCommitment', 'heading', e.target.value)}
        />
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={mergedContent.ongoingCommitment?.paragraph || ''}
            onChange={(e) => handleChange('ongoingCommitment', 'paragraph', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
