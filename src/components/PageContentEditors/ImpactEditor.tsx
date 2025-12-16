import React, { useState } from 'react';
import { Input } from '../Common/Input';
import { ImageInput } from '../Common/ImageInput';
import { BannerBackgroundEditor } from './BannerBackgroundEditor';
import { BannerBackground } from '../../types/bannerBackground';

interface StatItem {
  number: string;
  label: string;
  description: string;
  icon?: string;
}

interface ImpactStory {
  id: string;
  name: string;
  story: string;
  image: string;
  category: string;
}

interface Achievement {
  year: string;
  title: string;
  description: string;
}

interface ProjectCategory {
  category: string;
  count: number;
  description: string;
  image?: string;
}

interface ResourceDistribution {
  type: string;
  count: number;
  period: string;
  image?: string;
}

interface ScholarshipCategory {
  title: string;
  description: string;
}

interface Region {
  name: string;
  totalProjects: number;
  basicEducation?: number;
  secondaryEducation?: number;
  tertiaryEducation?: number;
  modelSchools?: number;
  tvetCenters?: number;
}

interface ImpactContent {
  bannerBackground?: BannerBackground;

  // Hero Section
  heroTitle?: string;
  heroSubtitle?: string;

  // Impact Statistics
  statsTitle?: string;
  statsSubtitle?: string;
  stats?: StatItem[];

  // Project Portfolio
  portfolioTitle?: string;
  portfolioSubtitle?: string;
  projectCategories?: ProjectCategory[];

  // Resources Distributed
  resourcesTitle?: string;
  resourcesSubtitle?: string;
  resources?: ResourceDistribution[];

  // Impact Stories
  storiesTitle?: string;
  storiesSubtitle?: string;
  stories?: ImpactStory[];

  // Scholarship Program
  scholarshipTitle?: string;
  scholarshipSubtitle?: string;
  totalScholars?: string;
  scholarshipGrowth?: {
    from: { year: string; count: number };
    to: { year: string; count: number };
  };
  percentToPublicUniversities?: string;
  scholarshipCategories?: ScholarshipCategory[];
  reforms?: string[];
  universityLogos?: string[];
  scholarshipImages?: string[];

  // Achievements Timeline
  achievementsTitle?: string;
  achievementsSubtitle?: string;
  achievements?: Achievement[];

  // Regional Impact
  regionalTitle?: string;
  regionalSubtitle?: string;
  regionalDescription?: string;
  regionalMap?: string;
  regions?: Region[];

  // Call to Action
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
}

interface ImpactEditorProps {
  content: ImpactContent;
  onChange: (content: ImpactContent) => void;
}

type TabKey = 'hero' | 'statistics' | 'portfolio' | 'resources' | 'stories' | 'scholarship' | 'achievements' | 'regional' | 'cta';

export const ImpactEditor: React.FC<ImpactEditorProps> = ({ content, onChange }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('hero');

  const updateContent = (updates: Partial<ImpactContent>) => {
    onChange({ ...content, ...updates });
  };

  // Statistics array management
  const addStat = () => {
    const newStat: StatItem = {
      number: '',
      label: '',
      description: '',
      icon: 'trending-up'
    };
    updateContent({
      stats: [...(content.stats || []), newStat]
    });
  };

  const updateStat = (index: number, updates: Partial<StatItem>) => {
    const updatedStats = [...(content.stats || [])];
    updatedStats[index] = { ...updatedStats[index], ...updates };
    updateContent({ stats: updatedStats });
  };

  const removeStat = (index: number) => {
    const updatedStats = (content.stats || []).filter((_, i) => i !== index);
    updateContent({ stats: updatedStats });
  };

  // Stories array management
  const addStory = () => {
    const newStory: ImpactStory = {
      id: Date.now().toString(),
      name: '',
      story: '',
      image: '',
      category: ''
    };
    updateContent({
      stories: [...(content.stories || []), newStory]
    });
  };

  const updateStory = (index: number, updates: Partial<ImpactStory>) => {
    const updatedStories = [...(content.stories || [])];
    updatedStories[index] = { ...updatedStories[index], ...updates };
    updateContent({ stories: updatedStories });
  };

  const removeStory = (index: number) => {
    const updatedStories = (content.stories || []).filter((_, i) => i !== index);
    updateContent({ stories: updatedStories });
  };

  // Achievements array management
  const addAchievement = () => {
    const newAchievement: Achievement = {
      year: '',
      title: '',
      description: ''
    };
    updateContent({
      achievements: [...(content.achievements || []), newAchievement]
    });
  };

  const updateAchievement = (index: number, updates: Partial<Achievement>) => {
    const updatedAchievements = [...(content.achievements || [])];
    updatedAchievements[index] = { ...updatedAchievements[index], ...updates };
    updateContent({ achievements: updatedAchievements });
  };

  const removeAchievement = (index: number) => {
    const updatedAchievements = (content.achievements || []).filter((_, i) => i !== index);
    updateContent({ achievements: updatedAchievements });
  };

  // Project Categories array management
  const addProjectCategory = () => {
    const newCategory: ProjectCategory = {
      category: '',
      count: 0,
      description: '',
      image: ''
    };
    updateContent({
      projectCategories: [...(content.projectCategories || []), newCategory]
    });
  };

  const updateProjectCategory = (index: number, updates: Partial<ProjectCategory>) => {
    const updatedCategories = [...(content.projectCategories || [])];
    updatedCategories[index] = { ...updatedCategories[index], ...updates };
    updateContent({ projectCategories: updatedCategories });
  };

  const removeProjectCategory = (index: number) => {
    const updatedCategories = (content.projectCategories || []).filter((_, i) => i !== index);
    updateContent({ projectCategories: updatedCategories });
  };

  // Resources array management
  const addResource = () => {
    const newResource: ResourceDistribution = {
      type: '',
      count: 0,
      period: '',
      image: ''
    };
    updateContent({
      resources: [...(content.resources || []), newResource]
    });
  };

  const updateResource = (index: number, updates: Partial<ResourceDistribution>) => {
    const updatedResources = [...(content.resources || [])];
    updatedResources[index] = { ...updatedResources[index], ...updates };
    updateContent({ resources: updatedResources });
  };

  const removeResource = (index: number) => {
    const updatedResources = (content.resources || []).filter((_, i) => i !== index);
    updateContent({ resources: updatedResources });
  };

  // Scholarship Categories array management
  const addScholarshipCategory = () => {
    const newCategory: ScholarshipCategory = {
      title: '',
      description: ''
    };
    updateContent({
      scholarshipCategories: [...(content.scholarshipCategories || []), newCategory]
    });
  };

  const updateScholarshipCategory = (index: number, updates: Partial<ScholarshipCategory>) => {
    const updatedCategories = [...(content.scholarshipCategories || [])];
    updatedCategories[index] = { ...updatedCategories[index], ...updates };
    updateContent({ scholarshipCategories: updatedCategories });
  };

  const removeScholarshipCategory = (index: number) => {
    const updatedCategories = (content.scholarshipCategories || []).filter((_, i) => i !== index);
    updateContent({ scholarshipCategories: updatedCategories });
  };

  // Reforms array management
  const addReform = () => {
    updateContent({
      reforms: [...(content.reforms || []), '']
    });
  };

  const updateReform = (index: number, value: string) => {
    const updatedReforms = [...(content.reforms || [])];
    updatedReforms[index] = value;
    updateContent({ reforms: updatedReforms });
  };

  const removeReform = (index: number) => {
    const updatedReforms = (content.reforms || []).filter((_, i) => i !== index);
    updateContent({ reforms: updatedReforms });
  };

  // University Logos array management
  const addUniversityLogo = () => {
    updateContent({
      universityLogos: [...(content.universityLogos || []), '']
    });
  };

  const updateUniversityLogo = (index: number, value: string) => {
    const updatedLogos = [...(content.universityLogos || [])];
    updatedLogos[index] = value;
    updateContent({ universityLogos: updatedLogos });
  };

  const removeUniversityLogo = (index: number) => {
    const updatedLogos = (content.universityLogos || []).filter((_, i) => i !== index);
    updateContent({ universityLogos: updatedLogos });
  };

  // Scholarship Images array management
  const addScholarshipImage = () => {
    updateContent({
      scholarshipImages: [...(content.scholarshipImages || []), '']
    });
  };

  const updateScholarshipImage = (index: number, value: string) => {
    const updatedImages = [...(content.scholarshipImages || [])];
    updatedImages[index] = value;
    updateContent({ scholarshipImages: updatedImages });
  };

  const removeScholarshipImage = (index: number) => {
    const updatedImages = (content.scholarshipImages || []).filter((_, i) => i !== index);
    updateContent({ scholarshipImages: updatedImages });
  };

  // Regions array management
  const addRegion = () => {
    const newRegion: Region = {
      name: '',
      totalProjects: 0,
      basicEducation: 0,
      secondaryEducation: 0,
      tertiaryEducation: 0,
      modelSchools: 0,
      tvetCenters: 0
    };
    updateContent({
      regions: [...(content.regions || []), newRegion]
    });
  };

  const updateRegion = (index: number, updates: Partial<Region>) => {
    const updatedRegions = [...(content.regions || [])];
    updatedRegions[index] = { ...updatedRegions[index], ...updates };
    updateContent({ regions: updatedRegions });
  };

  const removeRegion = (index: number) => {
    const updatedRegions = (content.regions || []).filter((_, i) => i !== index);
    updateContent({ regions: updatedRegions });
  };

  const tabs = [
    { key: 'hero' as TabKey, label: 'Hero Section' },
    { key: 'statistics' as TabKey, label: 'Statistics' },
    { key: 'portfolio' as TabKey, label: 'Project Portfolio' },
    { key: 'resources' as TabKey, label: 'Resources Distributed' },
    { key: 'stories' as TabKey, label: 'Impact Stories' },
    { key: 'scholarship' as TabKey, label: 'Scholarship Program' },
    { key: 'achievements' as TabKey, label: 'Achievements' },
    { key: 'regional' as TabKey, label: 'Regional Impact' },
    { key: 'cta' as TabKey, label: 'Call to Action' },
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
              previewTitle={content.heroTitle || 'Our Impact'}
              previewSubtitle={content.heroSubtitle || 'Transforming lives and communities through quality education across Ghana'}
            />

            <Input
              label="Hero Title"
              value={content.heroTitle || ''}
              onChange={(e) => updateContent({ heroTitle: e.target.value })}
              placeholder="Our Impact"
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
                placeholder="Transforming lives and communities through quality education across Ghana"
              />
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Statistics</h3>
              <div className="space-y-4">
                <Input
                  label="Section Title"
                  value={content.statsTitle || ''}
                  onChange={(e) => updateContent({ statsTitle: e.target.value })}
                  placeholder="Our Impact in Numbers"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Subtitle
                  </label>
                  <textarea
                    value={content.statsSubtitle || ''}
                    onChange={(e) => updateContent({ statsSubtitle: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Measurable results that showcase our commitment to educational excellence"
                  />
                </div>
              </div>
            </div>

            {/* Statistics Items */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900">Statistics</h4>
                <button
                  type="button"
                  onClick={addStat}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Statistic
                </button>
              </div>
              <div className="space-y-4">
                {(content.stats || []).map((stat, index) => (
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon (optional)
                      </label>
                      <select
                        value={stat.icon || 'trending-up'}
                        onChange={(e) => updateStat(index, { icon: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="trending-up">Trending Up</option>
                        <option value="users">Users</option>
                        <option value="building">Building</option>
                        <option value="award">Award</option>
                        <option value="book-open">Book Open</option>
                        <option value="graduation-cap">Graduation Cap</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Project Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Portfolio</h3>
              <div className="space-y-4">
                <Input
                  label="Section Title"
                  value={content.portfolioTitle || ''}
                  onChange={(e) => updateContent({ portfolioTitle: e.target.value })}
                  placeholder="Project Portfolio"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Subtitle
                  </label>
                  <textarea
                    value={content.portfolioSubtitle || ''}
                    onChange={(e) => updateContent({ portfolioSubtitle: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Our comprehensive investment across all levels of education"
                  />
                </div>
              </div>
            </div>

            {/* Project Category Items */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900">Project Categories</h4>
                <button
                  type="button"
                  onClick={addProjectCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Category
                </button>
              </div>
              <div className="space-y-4">
                {(content.projectCategories || []).map((category, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-700">Category {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeProjectCategory(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Category Name"
                        value={category.category}
                        onChange={(e) => updateProjectCategory(index, { category: e.target.value })}
                        placeholder="Basic Education"
                      />
                      <Input
                        label="Count"
                        type="number"
                        value={category.count.toString()}
                        onChange={(e) => updateProjectCategory(index, { count: parseInt(e.target.value) || 0 })}
                        placeholder="6272"
                      />
                    </div>
                    <Input
                      label="Description"
                      value={category.description}
                      onChange={(e) => updateProjectCategory(index, { description: e.target.value })}
                      placeholder="Primary and elementary schools"
                    />
                    <ImageInput
                      label="Image URL"
                      value={category.image || ''}
                      onChange={(value) => updateProjectCategory(index, { image: value })}
                      placeholder="/images/impact/infrastructure-1.jpg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Resources Distributed Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources Distributed</h3>
              <div className="space-y-4">
                <Input
                  label="Section Title"
                  value={content.resourcesTitle || ''}
                  onChange={(e) => updateContent({ resourcesTitle: e.target.value })}
                  placeholder="Resources Distributed"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Subtitle
                  </label>
                  <textarea
                    value={content.resourcesSubtitle || ''}
                    onChange={(e) => updateContent({ resourcesSubtitle: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Supporting education with essential equipment and resources"
                  />
                </div>
              </div>
            </div>

            {/* Resource Items */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900">Resources</h4>
                <button
                  type="button"
                  onClick={addResource}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Resource
                </button>
              </div>
              <div className="space-y-4">
                {(content.resources || []).map((resource, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-700">Resource {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeResource(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <Input
                        label="Type"
                        value={resource.type}
                        onChange={(e) => updateResource(index, { type: e.target.value })}
                        placeholder="Vehicles"
                      />
                      <Input
                        label="Count"
                        type="number"
                        value={resource.count.toString()}
                        onChange={(e) => updateResource(index, { count: parseInt(e.target.value) || 0 })}
                        placeholder="2718"
                      />
                      <Input
                        label="Period"
                        value={resource.period}
                        onChange={(e) => updateResource(index, { period: e.target.value })}
                        placeholder="2019-2021"
                      />
                    </div>
                    <ImageInput
                      label="Image URL"
                      value={resource.image || ''}
                      onChange={(value) => updateResource(index, { image: value })}
                      placeholder="/images/impact/vehicles-1.jpg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stories Tab */}
        {activeTab === 'stories' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Stories</h3>
              <div className="space-y-4">
                <Input
                  label="Section Title"
                  value={content.storiesTitle || ''}
                  onChange={(e) => updateContent({ storiesTitle: e.target.value })}
                  placeholder="Stories of Impact"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Subtitle
                  </label>
                  <textarea
                    value={content.storiesSubtitle || ''}
                    onChange={(e) => updateContent({ storiesSubtitle: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Real people, real transformations, real futures"
                  />
                </div>
              </div>
            </div>

            {/* Story Items */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900">Stories</h4>
                <button
                  type="button"
                  onClick={addStory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Story
                </button>
              </div>
              <div className="space-y-4">
                {(content.stories || []).map((story, index) => (
                  <div key={story.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-700">Story {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeStory(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Name"
                        value={story.name}
                        onChange={(e) => updateStory(index, { name: e.target.value })}
                        placeholder="Akosua Mensah"
                      />
                      <Input
                        label="Category"
                        value={story.category}
                        onChange={(e) => updateStory(index, { category: e.target.value })}
                        placeholder="Scholarship Beneficiary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Story
                      </label>
                      <textarea
                        value={story.story}
                        onChange={(e) => updateStory(index, { story: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Share their impact story..."
                      />
                    </div>
                    <ImageInput
                      label="Image URL"
                      value={story.image}
                      onChange={(value) => updateStory(index, { image: value })}
                      placeholder="/images/impact/student-1.jpg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scholarship Program Tab */}
        {activeTab === 'scholarship' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Scholarship Program</h3>
              <div className="space-y-4">
                <Input
                  label="Section Title"
                  value={content.scholarshipTitle || ''}
                  onChange={(e) => updateContent({ scholarshipTitle: e.target.value })}
                  placeholder="Scholarship Program"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Subtitle
                  </label>
                  <textarea
                    value={content.scholarshipSubtitle || ''}
                    onChange={(e) => updateContent({ scholarshipSubtitle: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Transforming lives through educational opportunities"
                  />
                </div>
                <Input
                  label="Total Scholars"
                  value={content.totalScholars || ''}
                  onChange={(e) => updateContent({ totalScholars: e.target.value })}
                  placeholder="16,000+"
                />
                <Input
                  label="Percent to Public Universities"
                  value={content.percentToPublicUniversities || ''}
                  onChange={(e) => updateContent({ percentToPublicUniversities: e.target.value })}
                  placeholder="74%"
                />
              </div>
            </div>

            {/* Scholarship Growth */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Scholarship Growth</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">From Year</label>
                  <Input
                    label="Year"
                    value={content.scholarshipGrowth?.from?.year || ''}
                    onChange={(e) => updateContent({
                      scholarshipGrowth: {
                        ...content.scholarshipGrowth,
                        from: {
                          year: e.target.value,
                          count: content.scholarshipGrowth?.from?.count || 0
                        } as { year: string; count: number },
                        to: content.scholarshipGrowth?.to || { year: '', count: 0 }
                      }
                    })}
                    placeholder="2019/20"
                  />
                  <Input
                    label="Count"
                    type="number"
                    value={content.scholarshipGrowth?.from?.count?.toString() || ''}
                    onChange={(e) => updateContent({
                      scholarshipGrowth: {
                        ...content.scholarshipGrowth,
                        from: {
                          year: content.scholarshipGrowth?.from?.year || '',
                          count: parseInt(e.target.value) || 0
                        } as { year: string; count: number },
                        to: content.scholarshipGrowth?.to || { year: '', count: 0 }
                      }
                    })}
                    placeholder="1680"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">To Year</label>
                  <Input
                    label="Year"
                    value={content.scholarshipGrowth?.to?.year || ''}
                    onChange={(e) => updateContent({
                      scholarshipGrowth: {
                        ...content.scholarshipGrowth,
                        from: content.scholarshipGrowth?.from || { year: '', count: 0 },
                        to: {
                          year: e.target.value,
                          count: content.scholarshipGrowth?.to?.count || 0
                        } as { year: string; count: number }
                      }
                    })}
                    placeholder="2023/24"
                  />
                  <Input
                    label="Count"
                    type="number"
                    value={content.scholarshipGrowth?.to?.count?.toString() || ''}
                    onChange={(e) => updateContent({
                      scholarshipGrowth: {
                        ...content.scholarshipGrowth,
                        from: content.scholarshipGrowth?.from || { year: '', count: 0 },
                        to: {
                          year: content.scholarshipGrowth?.to?.year || '',
                          count: parseInt(e.target.value) || 0
                        } as { year: string; count: number }
                      }
                    })}
                    placeholder="5026"
                  />
                </div>
              </div>
            </div>

            {/* Scholarship Categories */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900">Scholarship Categories</h4>
                <button
                  type="button"
                  onClick={addScholarshipCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Category
                </button>
              </div>
              <div className="space-y-4">
                {(content.scholarshipCategories || []).map((category, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-700">Category {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeScholarshipCategory(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <Input
                      label="Title"
                      value={category.title}
                      onChange={(e) => updateScholarshipCategory(index, { title: e.target.value })}
                      placeholder="General Scholarships"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={category.description}
                        onChange={(e) => updateScholarshipCategory(index, { description: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Applications from general population for Tertiary education"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reforms */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900">Key Reforms</h4>
                <button
                  type="button"
                  onClick={addReform}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Reform
                </button>
              </div>
              <div className="space-y-3">
                {(content.reforms || []).map((reform, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={reform}
                      onChange={(e) => updateReform(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Streamlined eligibility criteria"
                    />
                    <button
                      type="button"
                      onClick={() => removeReform(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* University Logos */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900">University Logos</h4>
                <button
                  type="button"
                  onClick={addUniversityLogo}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Logo
                </button>
              </div>
              <div className="space-y-3">
                {(content.universityLogos || []).map((logo, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={logo}
                      onChange={(e) => updateUniversityLogo(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="/images/impact/universities/ug-logo.png"
                    />
                    <button
                      type="button"
                      onClick={() => removeUniversityLogo(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Scholarship Images */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900">Scholarship Images</h4>
                <button
                  type="button"
                  onClick={addScholarshipImage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Image
                </button>
              </div>
              <div className="space-y-3">
                {(content.scholarshipImages || []).map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => updateScholarshipImage(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="/images/impact/scholarship-1.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => removeScholarshipImage(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements Timeline</h3>
              <div className="space-y-4">
                <Input
                  label="Section Title"
                  value={content.achievementsTitle || ''}
                  onChange={(e) => updateContent({ achievementsTitle: e.target.value })}
                  placeholder="Key Achievements"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Subtitle
                  </label>
                  <textarea
                    value={content.achievementsSubtitle || ''}
                    onChange={(e) => updateContent({ achievementsSubtitle: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Milestones in our journey to transform education in Ghana"
                  />
                </div>
              </div>
            </div>

            {/* Achievement Items */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900">Achievements</h4>
                <button
                  type="button"
                  onClick={addAchievement}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Achievement
                </button>
              </div>
              <div className="space-y-4">
                {(content.achievements || []).map((achievement, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-700">Achievement {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeAchievement(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Year"
                        value={achievement.year}
                        onChange={(e) => updateAchievement(index, { year: e.target.value })}
                        placeholder="2000"
                      />
                      <Input
                        label="Title"
                        value={achievement.title}
                        onChange={(e) => updateAchievement(index, { title: e.target.value })}
                        placeholder="GETFund Established"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={achievement.description}
                        onChange={(e) => updateAchievement(index, { description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ghana Education Trust Fund established by Act of Parliament..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Regional Impact Tab */}
        {activeTab === 'regional' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Impact</h3>
              <div className="space-y-4">
                <Input
                  label="Section Title"
                  value={content.regionalTitle || ''}
                  onChange={(e) => updateContent({ regionalTitle: e.target.value })}
                  placeholder="Regional Impact"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Subtitle
                  </label>
                  <textarea
                    value={content.regionalSubtitle || ''}
                    onChange={(e) => updateContent({ regionalSubtitle: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ensuring equitable distribution of educational resources across all regions"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regional Description (optional)
                  </label>
                  <textarea
                    value={content.regionalDescription || ''}
                    onChange={(e) => updateContent({ regionalDescription: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Additional description about regional impact..."
                  />
                </div>
                <ImageInput
                  label="Regional Map Image URL"
                  value={content.regionalMap || ''}
                  onChange={(value) => updateContent({ regionalMap: value })}
                  placeholder="/images/impact/ghana-regional-map.png"
                />
              </div>
            </div>

            {/* Region Items */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900">Regions</h4>
                <button
                  type="button"
                  onClick={addRegion}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Region
                </button>
              </div>
              <div className="space-y-4">
                {(content.regions || []).map((region, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-700">Region {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeRegion(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <Input
                      label="Region Name"
                      value={region.name}
                      onChange={(e) => updateRegion(index, { name: e.target.value })}
                      placeholder="Ashanti"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Total Projects"
                        type="number"
                        value={region.totalProjects?.toString() || '0'}
                        onChange={(e) => updateRegion(index, { totalProjects: parseInt(e.target.value) || 0 })}
                        placeholder="748"
                      />
                      <Input
                        label="Basic Education"
                        type="number"
                        value={region.basicEducation?.toString() || '0'}
                        onChange={(e) => updateRegion(index, { basicEducation: parseInt(e.target.value) || 0 })}
                        placeholder="451"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Secondary Education"
                        type="number"
                        value={region.secondaryEducation?.toString() || '0'}
                        onChange={(e) => updateRegion(index, { secondaryEducation: parseInt(e.target.value) || 0 })}
                        placeholder="281"
                      />
                      <Input
                        label="Tertiary Education"
                        type="number"
                        value={region.tertiaryEducation?.toString() || '0'}
                        onChange={(e) => updateRegion(index, { tertiaryEducation: parseInt(e.target.value) || 0 })}
                        placeholder="12"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Model Schools"
                        type="number"
                        value={region.modelSchools?.toString() || '0'}
                        onChange={(e) => updateRegion(index, { modelSchools: parseInt(e.target.value) || 0 })}
                        placeholder="2"
                      />
                      <Input
                        label="TVET Centers"
                        type="number"
                        value={region.tvetCenters?.toString() || '0'}
                        onChange={(e) => updateRegion(index, { tvetCenters: parseInt(e.target.value) || 0 })}
                        placeholder="2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Call to Action Tab */}
        {activeTab === 'cta' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Call to Action</h3>
            <Input
              label="CTA Title"
              value={content.ctaTitle || ''}
              onChange={(e) => updateContent({ ctaTitle: e.target.value })}
              placeholder="Be Part of Our Impact Story"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Description
              </label>
              <textarea
                value={content.ctaDescription || ''}
                onChange={(e) => updateContent({ ctaDescription: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Join us in transforming education and creating opportunities for future generations"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Button Text"
                value={content.ctaButtonText || ''}
                onChange={(e) => updateContent({ ctaButtonText: e.target.value })}
                placeholder="Support Our Mission"
              />
              <Input
                label="Button Link"
                value={content.ctaButtonLink || ''}
                onChange={(e) => updateContent({ ctaButtonLink: e.target.value })}
                placeholder="/support-us"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
