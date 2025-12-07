import React, { useState } from 'react';
import { Input } from '../Common/Input';
import { BannerBackgroundEditor } from './BannerBackgroundEditor';
import { BannerBackground } from '../../types/bannerBackground';

interface ResourcesContent {
  bannerBackground?: BannerBackground;

  // Hero Section
  heroTitle?: string;
  heroSubtitle?: string;

  // Stats
  stats?: {
    documentsAvailable?: number;
    policyDocuments?: number;
    researchStudies?: number;
    annualReports?: number;
  };

  // Annual Reports
  annualReportsTitle?: string;
  annualReportsDescription?: string;

  // Policies & Guidelines
  policiesGuidelinesTitle?: string;
  policiesGuidelinesDescription?: string;

  // Research & Studies
  researchStudiesTitle?: string;
  researchStudiesDescription?: string;

  // Strategic Publications
  strategicPublicationsTitle?: string;
  strategicPublicationsDescription?: string;

  // Newsletter Subscription
  newsletterTitle?: string;
  newsletterSubtitle?: string;
  newsletterPlaceholder?: string;
  newsletterButtonText?: string;
  newsletterFooterText?: string;
  newsletterContactEmail?: string;
  newsletterContactPhone?: string;
}

interface ResourcesEditorProps {
  content: ResourcesContent;
  onChange: (content: ResourcesContent) => void;
}

type TabKey = 'hero' | 'stats' | 'annual-reports' | 'policies' | 'research' | 'strategic' | 'newsletter';

export const ResourcesEditor: React.FC<ResourcesEditorProps> = ({ content, onChange }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('hero');

  const updateContent = (updates: Partial<ResourcesContent>) => {
    onChange({ ...content, ...updates });
  };

  const updateStats = (updates: Partial<NonNullable<ResourcesContent['stats']>>) => {
    updateContent({
      stats: { ...content.stats, ...updates }
    });
  };

  const tabs = [
    { key: 'hero' as TabKey, label: 'Hero Section' },
    { key: 'stats' as TabKey, label: 'Statistics' },
    { key: 'annual-reports' as TabKey, label: 'Annual Reports' },
    { key: 'policies' as TabKey, label: 'Policies & Guidelines' },
    { key: 'research' as TabKey, label: 'Research & Studies' },
    { key: 'strategic' as TabKey, label: 'Strategic Publications' },
    { key: 'newsletter' as TabKey, label: 'Newsletter' },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
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
      <div className="py-6">
        {/* Hero Section Tab */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Hero Section</h3>

            <BannerBackgroundEditor
              value={content.bannerBackground || {}}
              onChange={(bannerBackground) => updateContent({ bannerBackground })}
              previewTitle={content.heroTitle || 'Resources & Publications'}
              previewSubtitle={content.heroSubtitle || 'Access our comprehensive collection of reports, policies, research studies, and strategic documents that showcase Ghana\'s educational development journey.'}
            />

            <Input
              label="Hero Title"
              value={content.heroTitle || ''}
              onChange={(e) => updateContent({ heroTitle: e.target.value })}
              placeholder="Resources & Publications"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Subtitle
              </label>
              <textarea
                value={content.heroSubtitle || ''}
                onChange={(e) => updateContent({ heroSubtitle: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Access our comprehensive collection of reports, policies, research studies, and strategic documents that showcase Ghana's educational development journey."
              />
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Resource Statistics</h3>
            <p className="text-sm text-gray-600">
              Display key metrics about the resources available on the platform.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Documents Available"
                type="number"
                value={content.stats?.documentsAvailable?.toString() || '0'}
                onChange={(e) => updateStats({ documentsAvailable: parseInt(e.target.value) || 0 })}
                placeholder="50"
              />
              <Input
                label="Policy Documents"
                type="number"
                value={content.stats?.policyDocuments?.toString() || '0'}
                onChange={(e) => updateStats({ policyDocuments: parseInt(e.target.value) || 0 })}
                placeholder="15"
              />
              <Input
                label="Research Studies"
                type="number"
                value={content.stats?.researchStudies?.toString() || '0'}
                onChange={(e) => updateStats({ researchStudies: parseInt(e.target.value) || 0 })}
                placeholder="25"
              />
              <Input
                label="Annual Reports"
                type="number"
                value={content.stats?.annualReports?.toString() || '0'}
                onChange={(e) => updateStats({ annualReports: parseInt(e.target.value) || 0 })}
                placeholder="12"
              />
            </div>
          </div>
        )}

        {/* Annual Reports Tab */}
        {activeTab === 'annual-reports' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Annual Reports Section</h3>
            <Input
              label="Section Title"
              value={content.annualReportsTitle || ''}
              onChange={(e) => updateContent({ annualReportsTitle: e.target.value })}
              placeholder="Annual Reports"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Description
              </label>
              <textarea
                value={content.annualReportsDescription || ''}
                onChange={(e) => updateContent({ annualReportsDescription: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Comprehensive yearly summaries of our activities, achievements, and financial performance"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The actual documents are managed separately through the document management system. This section only controls the display text.
              </p>
            </div>
          </div>
        )}

        {/* Policies & Guidelines Tab */}
        {activeTab === 'policies' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Policies & Guidelines Section</h3>
            <Input
              label="Section Title"
              value={content.policiesGuidelinesTitle || ''}
              onChange={(e) => updateContent({ policiesGuidelinesTitle: e.target.value })}
              placeholder="Policies & Guidelines"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Description
              </label>
              <textarea
                value={content.policiesGuidelinesDescription || ''}
                onChange={(e) => updateContent({ policiesGuidelinesDescription: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Official policies, guidelines, and frameworks governing our operations and programs"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The actual documents are managed separately through the document management system. This section only controls the display text.
              </p>
            </div>
          </div>
        )}

        {/* Research & Studies Tab */}
        {activeTab === 'research' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Research & Studies Section</h3>
            <Input
              label="Section Title"
              value={content.researchStudiesTitle || ''}
              onChange={(e) => updateContent({ researchStudiesTitle: e.target.value })}
              placeholder="Research & Studies"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Description
              </label>
              <textarea
                value={content.researchStudiesDescription || ''}
                onChange={(e) => updateContent({ researchStudiesDescription: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="In-depth research studies and impact assessments of our educational initiatives"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The actual documents are managed separately through the document management system. This section only controls the display text.
              </p>
            </div>
          </div>
        )}

        {/* Strategic Publications Tab */}
        {activeTab === 'strategic' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Strategic Publications Section</h3>
            <Input
              label="Section Title"
              value={content.strategicPublicationsTitle || ''}
              onChange={(e) => updateContent({ strategicPublicationsTitle: e.target.value })}
              placeholder="Strategic Publications"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Description
              </label>
              <textarea
                value={content.strategicPublicationsDescription || ''}
                onChange={(e) => updateContent({ strategicPublicationsDescription: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Strategic plans, frameworks, and roadmaps for Ghana's educational development"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The actual documents are managed separately through the document management system. This section only controls the display text.
              </p>
            </div>
          </div>
        )}

        {/* Newsletter Tab */}
        {activeTab === 'newsletter' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Newsletter Subscription Section</h3>
            <Input
              label="Newsletter Title"
              value={content.newsletterTitle || ''}
              onChange={(e) => updateContent({ newsletterTitle: e.target.value })}
              placeholder="Stay Updated with Our Latest Publications"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Newsletter Subtitle
              </label>
              <textarea
                value={content.newsletterSubtitle || ''}
                onChange={(e) => updateContent({ newsletterSubtitle: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Subscribe to our newsletter to receive notifications about new reports, policies, and research studies as published."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Email Placeholder"
                value={content.newsletterPlaceholder || ''}
                onChange={(e) => updateContent({ newsletterPlaceholder: e.target.value })}
                placeholder="Enter your email address"
              />
              <Input
                label="Subscribe Button Text"
                value={content.newsletterButtonText || ''}
                onChange={(e) => updateContent({ newsletterButtonText: e.target.value })}
                placeholder="Subscribe"
              />
            </div>
            <div className="border-t border-gray-200 pt-4 mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Contact Information</h4>
              <Input
                label="Footer Text"
                value={content.newsletterFooterText || ''}
                onChange={(e) => updateContent({ newsletterFooterText: e.target.value })}
                placeholder="Need help finding a specific document?"
              />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input
                  label="Contact Email"
                  type="email"
                  value={content.newsletterContactEmail || ''}
                  onChange={(e) => updateContent({ newsletterContactEmail: e.target.value })}
                  placeholder="info@getfund.gov.gh"
                />
                <Input
                  label="Contact Phone"
                  type="tel"
                  value={content.newsletterContactPhone || ''}
                  onChange={(e) => updateContent({ newsletterContactPhone: e.target.value })}
                  placeholder="+233 (0)302 664 928-930"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
