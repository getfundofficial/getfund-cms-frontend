import React, { useState } from 'react';
import { Button } from '../Common/Button';
import { Input } from '../Common/Input';
import { ImageInput } from '../Common/ImageInput';

interface WhoWeAreContent {
  // Hero Section
  heroTitle?: string;
  heroSubtitle?: string;

  // About GETFund Section
  mainImage?: string;
  mainImageAlt?: string;
  mainHeading?: string;
  redHeading?: string;
  paragraph1?: string;
  paragraph2?: string;

  // Mission, Vision, Values
  vision?: { title: string; description: string };
  mission?: { title: string; description: string };
  values?: { title: string; description: string };

  // Educational Financing
  financingTitle?: string;
  costSharingPolicy?: string;
  publicResponsibility?: string;

  // Funding Formula
  fundingFormulaTitle?: string;
  fundingFormulaIntro?: string;
  relevantFactors?: string[];

  // Leadership & Governance
  leadershipTitle?: string;
  leadershipSubtitle?: string;
  boardImage?: string;
  boardTitle?: string;
  boardDescription?: string;
  boardCommitments?: Array<{
    title: string;
    description: string;
  }>;

  // Footer Message
  footerMessage?: string;
}

interface WhoWeAreEditorProps {
  content: WhoWeAreContent;
  onChange: (content: WhoWeAreContent) => void;
}

type TabKey = 'hero' | 'about' | 'vision-mission' | 'financing' | 'funding' | 'leadership' | 'footer';

export const WhoWeAreEditor: React.FC<WhoWeAreEditorProps> = ({ content, onChange }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('hero');

  const updateContent = (updates: Partial<WhoWeAreContent>) => {
    onChange({ ...content, ...updates });
  };

  // Relevant Factors Methods
  const addRelevantFactor = () => {
    updateContent({ relevantFactors: [...(content.relevantFactors || []), ''] });
  };

  const updateRelevantFactor = (index: number, value: string) => {
    const factors = [...(content.relevantFactors || [])];
    factors[index] = value;
    updateContent({ relevantFactors: factors });
  };

  const removeRelevantFactor = (index: number) => {
    const factors = content.relevantFactors?.filter((_, i) => i !== index) || [];
    updateContent({ relevantFactors: factors });
  };

  // Board Commitments Methods
  const addBoardCommitment = () => {
    updateContent({
      boardCommitments: [...(content.boardCommitments || []), { title: '', description: '' }]
    });
  };

  const updateBoardCommitment = (index: number, field: 'title' | 'description', value: string) => {
    const commitments = [...(content.boardCommitments || [])];
    commitments[index] = { ...commitments[index], [field]: value };
    updateContent({ boardCommitments: commitments });
  };

  const removeBoardCommitment = (index: number) => {
    const commitments = content.boardCommitments?.filter((_, i) => i !== index) || [];
    updateContent({ boardCommitments: commitments });
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { key: 'hero', label: 'Hero Section' },
            { key: 'about', label: 'About GETFund' },
            { key: 'vision-mission', label: 'Vision/Mission/Values' },
            { key: 'financing', label: 'Educational Financing' },
            { key: 'funding', label: 'Funding Formula' },
            { key: 'leadership', label: 'Leadership' },
            { key: 'footer', label: 'Footer Message' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        {/* Hero Section Tab */}
        {activeTab === 'hero' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
            <Input
              label="Hero Title"
              value={content.heroTitle || ''}
              onChange={(e) => updateContent({ heroTitle: e.target.value })}
              placeholder="About Us"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
              <textarea
                value={content.heroSubtitle || ''}
                onChange={(e) => updateContent({ heroSubtitle: e.target.value })}
                placeholder="Supporting the delivery of quality education..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* About GETFund Tab */}
        {activeTab === 'about' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">About GETFund Section</h3>
            <ImageInput
              label="Main Image URL"
              value={content.mainImage || ''}
              onChange={(value) => updateContent({ mainImage: value })}
              placeholder="/images/about/getfund-board.jpg"
            />
            <Input
              label="Main Image Alt Text"
              value={content.mainImageAlt || ''}
              onChange={(e) => updateContent({ mainImageAlt: e.target.value })}
              placeholder="GETFund Board"
            />
            <Input
              label="Main Heading"
              value={content.mainHeading || ''}
              onChange={(e) => updateContent({ mainHeading: e.target.value })}
              placeholder="Ghana Education Trust Fund"
            />
            <Input
              label="Red Subheading"
              value={content.redHeading || ''}
              onChange={(e) => updateContent({ redHeading: e.target.value })}
              placeholder="Since its establishment in the year 2000,"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 1</label>
              <textarea
                value={content.paragraph1 || ''}
                onChange={(e) => updateContent({ paragraph1: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 2</label>
              <textarea
                value={content.paragraph2 || ''}
                onChange={(e) => updateContent({ paragraph2: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Vision/Mission/Values Tab */}
        {activeTab === 'vision-mission' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Vision, Mission & Values</h3>

            {/* Vision */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold mb-3">Vision</h4>
              <Input
                label="Title"
                value={content.vision?.title || ''}
                onChange={(e) => updateContent({
                  vision: { ...content.vision, title: e.target.value, description: content.vision?.description || '' }
                })}
                placeholder="Our Vision"
              />
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={content.vision?.description || ''}
                  onChange={(e) => updateContent({
                    vision: { ...content.vision, title: content.vision?.title || '', description: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Mission */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold mb-3">Mission</h4>
              <Input
                label="Title"
                value={content.mission?.title || ''}
                onChange={(e) => updateContent({
                  mission: { ...content.mission, title: e.target.value, description: content.mission?.description || '' }
                })}
                placeholder="Our Mission"
              />
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={content.mission?.description || ''}
                  onChange={(e) => updateContent({
                    mission: { ...content.mission, title: content.mission?.title || '', description: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Values */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold mb-3">Core Values</h4>
              <Input
                label="Title"
                value={content.values?.title || ''}
                onChange={(e) => updateContent({
                  values: { ...content.values, title: e.target.value, description: content.values?.description || '' }
                })}
                placeholder="Our Values"
              />
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={content.values?.description || ''}
                  onChange={(e) => updateContent({
                    values: { ...content.values, title: content.values?.title || '', description: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Educational Financing Tab */}
        {activeTab === 'financing' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Educational Financing</h3>
            <Input
              label="Section Title"
              value={content.financingTitle || ''}
              onChange={(e) => updateContent({ financingTitle: e.target.value })}
              placeholder="The Issue of Educational Financing"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost Sharing Policy</label>
              <textarea
                value={content.costSharingPolicy || ''}
                onChange={(e) => updateContent({ costSharingPolicy: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Public Responsibility</label>
              <textarea
                value={content.publicResponsibility || ''}
                onChange={(e) => updateContent({ publicResponsibility: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Funding Formula Tab */}
        {activeTab === 'funding' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Funding Formula</h3>
            <Input
              label="Section Title"
              value={content.fundingFormulaTitle || ''}
              onChange={(e) => updateContent({ fundingFormulaTitle: e.target.value })}
              placeholder="Funding Formula"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Introduction Text</label>
              <textarea
                value={content.fundingFormulaIntro || ''}
                onChange={(e) => updateContent({ fundingFormulaIntro: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Relevant Factors */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">Relevant Factors</label>
                <Button onClick={addRelevantFactor} variant="secondary" size="sm">
                  + Add Factor
                </Button>
              </div>
              <div className="space-y-2">
                {(content.relevantFactors || []).map((factor, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={factor}
                      onChange={(e) => updateRelevantFactor(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter a relevant factor"
                    />
                    <Button onClick={() => removeRelevantFactor(index)} variant="secondary" size="sm">
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Leadership Tab */}
        {activeTab === 'leadership' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Leadership & Governance</h3>
            <Input
              label="Section Title"
              value={content.leadershipTitle || ''}
              onChange={(e) => updateContent({ leadershipTitle: e.target.value })}
              placeholder="Leadership & Governance"
            />
            <Input
              label="Section Subtitle"
              value={content.leadershipSubtitle || ''}
              onChange={(e) => updateContent({ leadershipSubtitle: e.target.value })}
              placeholder="Strong leadership and transparent governance..."
            />
            <ImageInput
              label="Board Image URL"
              value={content.boardImage || ''}
              onChange={(value) => updateContent({ boardImage: value })}
              placeholder="/images/about/getfund-board.jpg"
            />
            <Input
              label="Board Title"
              value={content.boardTitle || ''}
              onChange={(e) => updateContent({ boardTitle: e.target.value })}
              placeholder="Committed Board of Directors"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Board Description</label>
              <textarea
                value={content.boardDescription || ''}
                onChange={(e) => updateContent({ boardDescription: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Board Commitments */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">Board Commitments</label>
                <Button onClick={addBoardCommitment} variant="secondary" size="sm">
                  + Add Commitment
                </Button>
              </div>
              <div className="space-y-3">
                {(content.boardCommitments || []).map((commitment, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <Input
                      label="Title"
                      value={commitment.title}
                      onChange={(e) => updateBoardCommitment(index, 'title', e.target.value)}
                      placeholder="Strategic Direction"
                    />
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={commitment.description}
                        onChange={(e) => updateBoardCommitment(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Setting priorities and overseeing implementation"
                      />
                    </div>
                    <Button onClick={() => removeBoardCommitment(index)} variant="secondary" size="sm" className="mt-2">
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Message Tab */}
        {activeTab === 'footer' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Footer Message</h3>
            <Input
              label="Footer Call-to-Action Message"
              value={content.footerMessage || ''}
              onChange={(e) => updateContent({ footerMessage: e.target.value })}
              placeholder="Supporting the delivery of quality education."
            />
          </div>
        )}
      </div>
    </div>
  );
};
