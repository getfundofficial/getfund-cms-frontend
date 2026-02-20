import React from 'react';
import { Input } from '../Common/Input';
import { ImageInput } from '../Common/ImageInput';
import { Plus, Trash2 } from 'lucide-react';

interface ScholarshipProgrammeContent {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    subtitle: string;
    heroImage: string;
  };
  overview: {
    heading: string;
    paragraph: string;
  };
  objectives: {
    heading: string;
    items: string[];
  };
  eligibility: {
    heading: string;
    items: string[];
  };
  applicationProcess: {
    heading: string;
    steps: string[];
  };
  importantNotes: {
    heading: string;
    items: string[];
  };
  closingParagraph: string;
}

interface ScholarshipProgrammeEditorProps {
  content: ScholarshipProgrammeContent;
  onChange: (content: ScholarshipProgrammeContent) => void;
}

const defaultContent: ScholarshipProgrammeContent = {
  meta: {
    title: 'GETFund Scholarship Programme | GETFund',
    description: 'Empowering Ghanaian students to achieve their academic dreams through scholarships.',
  },
  hero: {
    title: 'GETFund Scholarship Programme',
    subtitle: 'Empowering Ghanaian students to achieve their academic dreams.',
    heroImage: '/images/scholarship/GETFund-Scholarship-Programme.jpg',
  },
  overview: {
    heading: 'Programme Overview',
    paragraph: 'Since its inception, the GETFund Scholarship Programme has enabled thousands of Ghanaians to access quality higher education. The programme covers tuition, accommodation, and in some cases, stipends for living expenses. Scholarships are awarded based on merit, need, and alignment with national development priorities.',
  },
  objectives: {
    heading: 'Key Objectives',
    items: [
      'Expand access to tertiary education for Ghanaians from all backgrounds.',
      'Support students in fields critical to Ghana\'s socio-economic development.',
      'Promote gender equity and inclusion in higher education.',
      'Develop a skilled workforce to drive national progress.',
    ],
  },
  eligibility: {
    heading: 'Eligibility Criteria',
    items: [
      'Be a Ghanaian citizen with a valid national ID.',
      'Have gained admission to an accredited tertiary institution (local or international).',
      'Demonstrate academic excellence and financial need.',
      'Meet any additional requirements specified in the annual call for applications.',
    ],
  },
  applicationProcess: {
    heading: 'Application Process',
    steps: [
      'Monitor the GETFund website and official channels for the annual scholarship announcement.',
      'Prepare all required documents (admission letter, transcripts, national ID, etc.).',
      'Complete the online application form during the open application window.',
      'Upload supporting documents as specified in the guidelines.',
      'Submit the application before the published deadline.',
    ],
  },
  importantNotes: {
    heading: 'Important Notes',
    items: [
      'Only shortlisted applicants will be contacted for further steps.',
      'Decisions of the GETFund Scholarship Committee are final.',
      'Applicants are encouraged to read all instructions carefully before applying.',
    ],
  },
  closingParagraph: 'For detailed guidelines, application timelines, and frequently asked questions, please visit the Resources page or contact us for assistance.',
};

export const ScholarshipProgrammeEditor: React.FC<ScholarshipProgrammeEditorProps> = ({
  content,
  onChange,
}) => {
  const mergedContent = { ...defaultContent, ...content };

  const handleChange = (section: keyof ScholarshipProgrammeContent, field: string, value: any) => {
    onChange({
      ...mergedContent,
      [section]: {
        ...(mergedContent[section] as any),
        [field]: value,
      },
    });
  };

  const handleArrayChange = (section: keyof ScholarshipProgrammeContent, field: string, index: number, value: string) => {
    const sectionData = mergedContent[section] as any;
    const newItems = [...sectionData[field]];
    newItems[index] = value;
    handleChange(section, field, newItems);
  };

  const addArrayItem = (section: keyof ScholarshipProgrammeContent, field: string) => {
    const sectionData = mergedContent[section] as any;
    const newItems = [...sectionData[field], ''];
    handleChange(section, field, newItems);
  };

  const removeArrayItem = (section: keyof ScholarshipProgrammeContent, field: string, index: number) => {
    const sectionData = mergedContent[section] as any;
    const newItems = sectionData[field].filter((_: any, i: number) => i !== index);
    handleChange(section, field, newItems);
  };

  return (
    <div className="space-y-8">
      {/* Page Layout Preview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">Page Layout</h3>
        <p className="text-xs text-blue-600">
          This page uses a clean, professional layout with: Title + icon → Two-column intro (text + image) → Key Objectives cards → Eligibility & Application Process side-by-side → Important Notes box → Navy CTA section
        </p>
      </div>

      {/* Meta Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Meta Information</h3>
        <div className="space-y-4">
          <Input
            type="text"
            label="Page Title (Browser Tab)"
            placeholder="GETFund Scholarship Programme | GETFund"
            value={mergedContent.meta?.title || ''}
            onChange={(e) => handleChange('meta', 'title', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description (SEO)
            </label>
            <textarea
              placeholder="Empowering Ghanaian students..."
              value={mergedContent.meta?.description || ''}
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
        <Input
          type="text"
          label="Page Heading"
          placeholder="GETFund Scholarship Programme"
          value={mergedContent.hero?.title || ''}
          onChange={(e) => handleChange('hero', 'title', e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-2">
          This title appears at the top with a graduation cap icon and navy blue underline accent.
        </p>
      </div>

      {/* Introduction Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Introduction Section</h3>
        <p className="text-sm text-gray-600 mb-4">
          This section displays as two columns: intro text on the left, image on the right.
        </p>
        <div className="space-y-4">
          <ImageInput
            label="Section Image (Right Column)"
            value={mergedContent.hero?.heroImage || ''}
            onChange={(value: string) => handleChange('hero', 'heroImage', value)}
            placeholder="/images/scholarship/scholarship-programme-hero.jpg"
          />
          {mergedContent.hero?.heroImage && (
            <img
              src={mergedContent.hero.heroImage}
              alt="Scholarship Programme"
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
            />
          )}
        </div>
      </div>

      {/* Programme Overview */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Programme Overview</h3>
        <p className="text-sm text-gray-600 mb-4">
          This text appears in the left column of the introduction section.
        </p>
        <Input
          type="text"
          label="Section Heading"
          value={mergedContent.overview?.heading || ''}
          onChange={(e) => handleChange('overview', 'heading', e.target.value)}
        />
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={mergedContent.overview?.paragraph || ''}
            onChange={(e) => handleChange('overview', 'paragraph', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Key Objectives */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Objectives</h3>
        <p className="text-sm text-gray-600 mb-4">
          Each objective is displayed as a card with a green checkmark icon.
        </p>
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
                onChange={(e) => handleArrayChange('objectives', 'items', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('objectives', 'items', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('objectives', 'items')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
          >
            <Plus className="w-4 h-4" /> Add Objective
          </button>
        </div>
      </div>

      {/* Eligibility Criteria */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Eligibility Criteria</h3>
        <p className="text-sm text-gray-600 mb-4">
          Each criterion is displayed with a numbered navy blue circle. Shown on the left side.
        </p>
        <Input
          type="text"
          label="Section Heading"
          value={mergedContent.eligibility?.heading || ''}
          onChange={(e) => handleChange('eligibility', 'heading', e.target.value)}
        />
        <div className="mt-4 space-y-2">
          {mergedContent.eligibility?.items?.map((item, index) => (
            <div key={index} className="flex gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-sm font-bold flex-shrink-0">
                {index + 1}
              </span>
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange('eligibility', 'items', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('eligibility', 'items', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('eligibility', 'items')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
          >
            <Plus className="w-4 h-4" /> Add Eligibility Criteria
          </button>
        </div>
      </div>

      {/* Application Process */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Process</h3>
        <p className="text-sm text-gray-600 mb-4">
          Each step is displayed with a numbered green circle. Shown on the right side.
        </p>
        <Input
          type="text"
          label="Section Heading"
          value={mergedContent.applicationProcess?.heading || ''}
          onChange={(e) => handleChange('applicationProcess', 'heading', e.target.value)}
        />
        <div className="mt-4 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Steps (in order)</label>
          {mergedContent.applicationProcess?.steps?.map((step, index) => (
            <div key={index} className="flex gap-2 items-center">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 text-sm font-bold flex-shrink-0">
                {index + 1}
              </span>
              <input
                type="text"
                value={step}
                onChange={(e) => handleArrayChange('applicationProcess', 'steps', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('applicationProcess', 'steps', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('applicationProcess', 'steps')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
          >
            <Plus className="w-4 h-4" /> Add Step
          </button>
        </div>
      </div>

      {/* Important Notes */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Notes</h3>
        <p className="text-sm text-gray-600 mb-4">
          Displayed in an amber/yellow highlighted box to draw attention.
        </p>
        <Input
          type="text"
          label="Section Heading"
          value={mergedContent.importantNotes?.heading || ''}
          onChange={(e) => handleChange('importantNotes', 'heading', e.target.value)}
        />
        <div className="mt-4 space-y-2">
          {mergedContent.importantNotes?.items?.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange('importantNotes', 'items', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('importantNotes', 'items', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('importantNotes', 'items')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
          >
            <Plus className="w-4 h-4" /> Add Note
          </button>
        </div>
      </div>

      {/* Closing Paragraph / CTA */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Call-to-Action Section</h3>
        <p className="text-sm text-gray-600 mb-4">
          This text appears in the navy blue CTA section at the bottom of the page.
        </p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CTA Description</label>
          <textarea
            placeholder="For detailed guidelines..."
            value={mergedContent.closingParagraph || ''}
            onChange={(e) => onChange({ ...mergedContent, closingParagraph: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> The CTA section includes "Apply Now" and "View Resources" buttons that link to the scholarship application and resources pages.
          </p>
        </div>
      </div>
    </div>
  );
};
