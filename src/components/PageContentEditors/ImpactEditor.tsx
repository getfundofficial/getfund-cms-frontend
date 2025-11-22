import React, { useState } from 'react';
import { Input } from '../Common/Input';
import { ImageInput } from '../Common/ImageInput';

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

interface Region {
  name: string;
  schools: number;
  students: number;
  projects: number;
}

interface ImpactContent {
  // Hero Section
  heroTitle?: string;
  heroSubtitle?: string;

  // Impact Statistics
  statsTitle?: string;
  statsSubtitle?: string;
  stats?: StatItem[];

  // Impact Stories
  storiesTitle?: string;
  storiesSubtitle?: string;
  stories?: ImpactStory[];

  // Achievements Timeline
  achievementsTitle?: string;
  achievementsSubtitle?: string;
  achievements?: Achievement[];

  // Regional Impact
  regionalTitle?: string;
  regionalSubtitle?: string;
  regionalDescription?: string;
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

type TabKey = 'hero' | 'statistics' | 'stories' | 'achievements' | 'regional' | 'cta';

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

  // Regions array management
  const addRegion = () => {
    const newRegion: Region = {
      name: '',
      schools: 0,
      students: 0,
      projects: 0
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
    { key: 'stories' as TabKey, label: 'Impact Stories' },
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
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Hero Section</h3>
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
                      placeholder="Greater Accra"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <Input
                        label="Schools"
                        type="number"
                        value={region.schools.toString()}
                        onChange={(e) => updateRegion(index, { schools: parseInt(e.target.value) || 0 })}
                        placeholder="850"
                      />
                      <Input
                        label="Students"
                        type="number"
                        value={region.students.toString()}
                        onChange={(e) => updateRegion(index, { students: parseInt(e.target.value) || 0 })}
                        placeholder="425000"
                      />
                      <Input
                        label="Projects"
                        type="number"
                        value={region.projects.toString()}
                        onChange={(e) => updateRegion(index, { projects: parseInt(e.target.value) || 0 })}
                        placeholder="12"
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
