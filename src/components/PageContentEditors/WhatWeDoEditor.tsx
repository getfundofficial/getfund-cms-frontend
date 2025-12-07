import React, { useState } from 'react';
import { Input } from '../Common/Input';
import { BannerBackgroundEditor } from './BannerBackgroundEditor';
import { BannerBackground } from '../../types/bannerBackground';

interface Service {
  title: string;
  description: string;
  link: string;
}

interface ImpactStat {
  number: string;
  label: string;
  description: string;
}

interface KeyInitiative {
  title: string;
  description: string;
  icon: string;
  features?: string[];
}

interface WhatWeDoContent {
  bannerBackground?: BannerBackground;

  // Hero/Services Section
  servicesTitle?: string;
  servicesSubtitle?: string;
  services?: Service[];

  // Impact Stats
  impactStats?: ImpactStat[];

  // Key Initiatives
  keyInitiatives?: KeyInitiative[];
}

interface WhatWeDoEditorProps {
  content: WhatWeDoContent;
  onChange: (content: WhatWeDoContent) => void;
}

type TabKey = 'hero' | 'services' | 'stats' | 'initiatives';

export const WhatWeDoEditor: React.FC<WhatWeDoEditorProps> = ({ content, onChange }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('hero');

  const updateContent = (updates: Partial<WhatWeDoContent>) => {
    onChange({ ...content, ...updates });
  };

  // Services array management
  const addService = () => {
    const newService: Service = {
      title: '',
      description: '',
      link: ''
    };
    updateContent({
      services: [...(content.services || []), newService]
    });
  };

  const updateService = (index: number, updates: Partial<Service>) => {
    const updatedServices = [...(content.services || [])];
    updatedServices[index] = { ...updatedServices[index], ...updates };
    updateContent({ services: updatedServices });
  };

  const removeService = (index: number) => {
    const updatedServices = (content.services || []).filter((_, i) => i !== index);
    updateContent({ services: updatedServices });
  };

  // Impact Stats array management
  const addStat = () => {
    const newStat: ImpactStat = {
      number: '',
      label: '',
      description: ''
    };
    updateContent({
      impactStats: [...(content.impactStats || []), newStat]
    });
  };

  const updateStat = (index: number, updates: Partial<ImpactStat>) => {
    const updatedStats = [...(content.impactStats || [])];
    updatedStats[index] = { ...updatedStats[index], ...updates };
    updateContent({ impactStats: updatedStats });
  };

  const removeStat = (index: number) => {
    const updatedStats = (content.impactStats || []).filter((_, i) => i !== index);
    updateContent({ impactStats: updatedStats });
  };

  // Key Initiatives array management
  const addInitiative = () => {
    const newInitiative: KeyInitiative = {
      title: '',
      description: '',
      icon: 'graduation-cap',
      features: []
    };
    updateContent({
      keyInitiatives: [...(content.keyInitiatives || []), newInitiative]
    });
  };

  const updateInitiative = (index: number, updates: Partial<KeyInitiative>) => {
    const updatedInitiatives = [...(content.keyInitiatives || [])];
    updatedInitiatives[index] = { ...updatedInitiatives[index], ...updates };
    updateContent({ keyInitiatives: updatedInitiatives });
  };

  const removeInitiative = (index: number) => {
    const updatedInitiatives = (content.keyInitiatives || []).filter((_, i) => i !== index);
    updateContent({ keyInitiatives: updatedInitiatives });
  };

  const addFeature = (initiativeIndex: number) => {
    const updatedInitiatives = [...(content.keyInitiatives || [])];
    updatedInitiatives[initiativeIndex].features = [
      ...(updatedInitiatives[initiativeIndex].features || []),
      ''
    ];
    updateContent({ keyInitiatives: updatedInitiatives });
  };

  const updateFeature = (initiativeIndex: number, featureIndex: number, value: string) => {
    const updatedInitiatives = [...(content.keyInitiatives || [])];
    const features = [...(updatedInitiatives[initiativeIndex].features || [])];
    features[featureIndex] = value;
    updatedInitiatives[initiativeIndex].features = features;
    updateContent({ keyInitiatives: updatedInitiatives });
  };

  const removeFeature = (initiativeIndex: number, featureIndex: number) => {
    const updatedInitiatives = [...(content.keyInitiatives || [])];
    updatedInitiatives[initiativeIndex].features = (updatedInitiatives[initiativeIndex].features || []).filter(
      (_, i) => i !== featureIndex
    );
    updateContent({ keyInitiatives: updatedInitiatives });
  };

  const tabs = [
    { key: 'hero' as TabKey, label: 'Hero Section' },
    { key: 'services' as TabKey, label: 'Services' },
    { key: 'stats' as TabKey, label: 'Impact Stats' },
    { key: 'initiatives' as TabKey, label: 'Key Initiatives' },
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
              previewTitle={content.servicesTitle || 'What We Do'}
              previewSubtitle={content.servicesSubtitle || 'GETFund is committed to transforming education in Ghana through strategic investments and key initiatives.'}
            />

            <Input
              label="Title"
              value={content.servicesTitle || ''}
              onChange={(e) => updateContent({ servicesTitle: e.target.value })}
              placeholder="What We Do"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <textarea
                value={content.servicesSubtitle || ''}
                onChange={(e) => updateContent({ servicesSubtitle: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="GETFund is committed to transforming education in Ghana through strategic investments and key initiatives."
              />
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Services</h3>
              <button
                type="button"
                onClick={addService}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Service
              </button>
            </div>
            <div className="space-y-4">
              {(content.services || []).map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-700">Service {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <Input
                    label="Title"
                    value={service.title}
                    onChange={(e) => updateService(index, { title: e.target.value })}
                    placeholder="Scholarship Programme"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={service.description}
                      onChange={(e) => updateService(index, { description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Financial support for talented Ghanaians to pursue higher education..."
                    />
                  </div>
                  <Input
                    label="Link"
                    value={service.link}
                    onChange={(e) => updateService(index, { link: e.target.value })}
                    placeholder="/service/scholarship-programme"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Impact Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Impact Statistics</h3>
              <button
                type="button"
                onClick={addStat}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Statistic
              </button>
            </div>
            <div className="space-y-4">
              {(content.impactStats || []).map((stat, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-700">Statistic {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeStat(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Number"
                      value={stat.number}
                      onChange={(e) => updateStat(index, { number: e.target.value })}
                      placeholder="5,000+"
                    />
                    <Input
                      label="Label"
                      value={stat.label}
                      onChange={(e) => updateStat(index, { label: e.target.value })}
                      placeholder="Schools Supported"
                    />
                  </div>
                  <Input
                    label="Description"
                    value={stat.description}
                    onChange={(e) => updateStat(index, { description: e.target.value })}
                    placeholder="Educational institutions nationwide"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Initiatives Tab */}
        {activeTab === 'initiatives' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Key Initiatives</h3>
              <button
                type="button"
                onClick={addInitiative}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Initiative
              </button>
            </div>
            <div className="space-y-4">
              {(content.keyInitiatives || []).map((initiative, initiativeIndex) => (
                <div key={initiativeIndex} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-700">Initiative {initiativeIndex + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeInitiative(initiativeIndex)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Title"
                      value={initiative.title}
                      onChange={(e) => updateInitiative(initiativeIndex, { title: e.target.value })}
                      placeholder="Infrastructure Development"
                    />
                    <Input
                      label="Icon"
                      value={initiative.icon}
                      onChange={(e) => updateInitiative(initiativeIndex, { icon: e.target.value })}
                      placeholder="graduation-cap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={initiative.description}
                      onChange={(e) => updateInitiative(initiativeIndex, { description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Building and renovating educational facilities..."
                    />
                  </div>

                  {/* Features Sub-section */}
                  <div className="mt-4 pl-4 border-l-2 border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700">Features</span>
                      <button
                        type="button"
                        onClick={() => addFeature(initiativeIndex)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                      >
                        Add Feature
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(initiative.features || []).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex gap-2">
                          <Input
                            label=""
                            value={feature}
                            onChange={(e) => updateFeature(initiativeIndex, featureIndex, e.target.value)}
                            placeholder="New classrooms and laboratories"
                          />
                          <button
                            type="button"
                            onClick={() => removeFeature(initiativeIndex, featureIndex)}
                            className="px-3 py-2 text-red-600 hover:text-red-800 text-sm self-end"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
