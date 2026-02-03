import React, { useState, useRef } from 'react';
import { Input } from '../Common/Input';
import mediaService, { Media } from '../../services/mediaService';

interface FocusArea {
  title: string;
}

interface FocusAreaImage {
  image: string;
  title: string;
  description: string;
}

interface KeyInitiative {
  title: string;
  description: string;
  icon: string;
  features?: string[];
  color?: string;
}

interface WhatWeDoContent {
  // Page Header
  pageTitle?: string;
  pageSubtitle?: string;

  // Focus Areas (Navy Blue Circles)
  focusAreas?: FocusArea[];

  // Focus Area Images (6 Image Grid)
  focusAreaImages?: FocusAreaImage[];

  // Key Initiatives
  keyInitiatives?: KeyInitiative[];
}

interface WhatWeDoEditorProps {
  content: WhatWeDoContent;
  onChange: (content: WhatWeDoContent) => void;
}

type TabKey = 'header' | 'focusAreas' | 'imageGrid' | 'initiatives';

// Image Upload Component
const ImageUpload: React.FC<{
  value: string;
  onChange: (url: string) => void;
  label: string;
}> = ({ value, onChange, label }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload JPEG, PNG, GIF, or WebP images.');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Maximum size is 5MB.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev >= 90 ? 90 : prev + 10));
      }, 100);

      const media = await mediaService.upload(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        onChange(mediaService.getFullUrl(media.url));
        setIsUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 300);
    } catch (error: any) {
      setIsUploading(false);
      setUploadProgress(0);
      alert(error.response?.data?.error || 'Failed to upload image');
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {value && (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
          >
            ×
          </button>
        </div>
      )}

      {isUploading ? (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
          >
            {value ? 'Change Image' : 'Upload Image'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
          />
        </div>
      )}
    </div>
  );
};

export const WhatWeDoEditor: React.FC<WhatWeDoEditorProps> = ({ content, onChange }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('header');

  const updateContent = (updates: Partial<WhatWeDoContent>) => {
    onChange({ ...content, ...updates });
  };

  // Default focus areas
  const defaultFocusAreas: FocusArea[] = [
    { title: 'Educational Infrastructure Support' },
    { title: 'Ministry of Education & Agencies Financial Support' },
    { title: 'Government Policy & Programme Support' },
    { title: 'Scholar & capacity Building Programmes' },
    { title: 'Others' },
  ];

  // Default focus area images
  const defaultFocusAreaImages: FocusAreaImage[] = [
    { image: '/images/hero/main-slider-1.jpg', title: 'Educational Infrastructure', description: 'Building schools across Ghana' },
    { image: '/images/hero/main-slider-2.jpg', title: 'Scholarship Programs', description: 'Supporting students nationwide' },
    { image: '/images/hero/main-slider-3.jpg', title: 'Teacher Training', description: 'Empowering educators' },
    { image: '/images/hero/main-slider-1.jpg', title: 'STEM Education', description: 'Advancing science and technology' },
    { image: '/images/hero/main-slider-2.jpg', title: 'Community Schools', description: 'Bringing education closer' },
    { image: '/images/hero/main-slider-3.jpg', title: 'Research & Development', description: 'Innovating for the future' },
  ];

  // Focus Areas management
  const focusAreas = content.focusAreas || defaultFocusAreas;

  const addFocusArea = () => {
    updateContent({
      focusAreas: [...focusAreas, { title: '' }],
    });
  };

  const updateFocusArea = (index: number, title: string) => {
    const updated = [...focusAreas];
    updated[index] = { title };
    updateContent({ focusAreas: updated });
  };

  const removeFocusArea = (index: number) => {
    updateContent({
      focusAreas: focusAreas.filter((_, i) => i !== index),
    });
  };

  // Focus Area Images management
  const focusAreaImages = content.focusAreaImages || defaultFocusAreaImages;

  const addFocusAreaImage = () => {
    updateContent({
      focusAreaImages: [...focusAreaImages, { image: '', title: '', description: '' }],
    });
  };

  const updateFocusAreaImage = (index: number, updates: Partial<FocusAreaImage>) => {
    const updated = [...focusAreaImages];
    updated[index] = { ...updated[index], ...updates };
    updateContent({ focusAreaImages: updated });
  };

  const removeFocusAreaImage = (index: number) => {
    updateContent({
      focusAreaImages: focusAreaImages.filter((_, i) => i !== index),
    });
  };

  // Key Initiatives management
  const addInitiative = () => {
    const newInitiative: KeyInitiative = {
      title: '',
      description: '',
      icon: 'graduation-cap',
      features: [],
      color: 'green',
    };
    updateContent({
      keyInitiatives: [...(content.keyInitiatives || []), newInitiative],
    });
  };

  const updateInitiative = (index: number, updates: Partial<KeyInitiative>) => {
    const updated = [...(content.keyInitiatives || [])];
    updated[index] = { ...updated[index], ...updates };
    updateContent({ keyInitiatives: updated });
  };

  const removeInitiative = (index: number) => {
    updateContent({
      keyInitiatives: (content.keyInitiatives || []).filter((_, i) => i !== index),
    });
  };

  const addFeature = (initiativeIndex: number) => {
    const updated = [...(content.keyInitiatives || [])];
    updated[initiativeIndex].features = [...(updated[initiativeIndex].features || []), ''];
    updateContent({ keyInitiatives: updated });
  };

  const updateFeature = (initiativeIndex: number, featureIndex: number, value: string) => {
    const updated = [...(content.keyInitiatives || [])];
    const features = [...(updated[initiativeIndex].features || [])];
    features[featureIndex] = value;
    updated[initiativeIndex].features = features;
    updateContent({ keyInitiatives: updated });
  };

  const removeFeature = (initiativeIndex: number, featureIndex: number) => {
    const updated = [...(content.keyInitiatives || [])];
    updated[initiativeIndex].features = (updated[initiativeIndex].features || []).filter(
      (_, i) => i !== featureIndex
    );
    updateContent({ keyInitiatives: updated });
  };

  const tabs = [
    { key: 'header' as TabKey, label: 'Page Header' },
    { key: 'focusAreas' as TabKey, label: 'Focus Areas' },
    { key: 'imageGrid' as TabKey, label: 'Image Grid' },
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
        {/* Page Header Tab */}
        {activeTab === 'header' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Page Header</h3>

            {/* Live Preview */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-4">Preview</h4>
              <div className="text-center py-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {content.pageTitle || 'What We Do'}
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  {content.pageSubtitle || 'GETFund is committed to transforming education in Ghana through strategic investments and key initiatives.'}
                </p>
              </div>
            </div>

            <Input
              label="Page Title"
              value={content.pageTitle || ''}
              onChange={(e) => updateContent({ pageTitle: e.target.value })}
              placeholder="What We Do"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Subtitle
              </label>
              <textarea
                value={content.pageSubtitle || ''}
                onChange={(e) => updateContent({ pageSubtitle: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="GETFund is committed to transforming education in Ghana through strategic investments and key initiatives."
              />
            </div>
          </div>
        )}

        {/* Focus Areas Tab (Navy Blue Circles) */}
        {activeTab === 'focusAreas' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Focus Areas</h3>
                <p className="text-sm text-gray-500 mt-1">These appear as navy blue circles on the page</p>
              </div>
              <button
                type="button"
                onClick={addFocusArea}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Focus Area
              </button>
            </div>

            {/* Live Preview */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-4">Preview</h4>
              <div className="flex flex-wrap justify-center gap-4">
                {focusAreas.map((area, index) => (
                  <div
                    key={index}
                    className="w-28 h-28 rounded-full flex items-center justify-center p-3"
                    style={{ backgroundColor: '#2a3f75' }}
                  >
                    <span className="text-white text-[10px] font-bold text-center leading-tight">
                      {area.title || 'Focus Area'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {focusAreas.map((area, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: '#2a3f75' }}
                  >
                    {index + 1}
                  </div>
                  <Input
                    label=""
                    value={area.title}
                    onChange={(e) => updateFocusArea(index, e.target.value)}
                    placeholder="Enter focus area title"
                  />
                  <button
                    type="button"
                    onClick={() => removeFocusArea(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Grid Tab */}
        {activeTab === 'imageGrid' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Focus Area Images</h3>
                <p className="text-sm text-gray-500 mt-1">6 edge-to-edge images displayed in a grid (2 columns on mobile, 3 on desktop)</p>
              </div>
              <button
                type="button"
                onClick={addFocusAreaImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Image
              </button>
            </div>

            {/* Live Preview */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-4">Preview (hover over images to see overlay)</h4>
              <div className="grid grid-cols-3 gap-1">
                {focusAreaImages.slice(0, 6).map((item, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden group bg-gray-200">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                      <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-2">
                        <h5 className="text-white text-sm font-bold">{item.title || 'Title'}</h5>
                        <p className="text-white/80 text-xs">{item.description || 'Description'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {focusAreaImages.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-700">Image {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeFocusAreaImage(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <ImageUpload
                    value={item.image}
                    onChange={(url) => updateFocusAreaImage(index, { image: url })}
                    label="Image"
                  />

                  <Input
                    label="Title"
                    value={item.title}
                    onChange={(e) => updateFocusAreaImage(index, { title: e.target.value })}
                    placeholder="Educational Infrastructure"
                  />

                  <Input
                    label="Description"
                    value={item.description}
                    onChange={(e) => updateFocusAreaImage(index, { description: e.target.value })}
                    placeholder="Building schools across Ghana"
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
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Key Initiatives</h3>
                <p className="text-sm text-gray-500 mt-1">Detailed initiative cards shown below the image grid</p>
              </div>
              <button
                type="button"
                onClick={addInitiative}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Initiative
              </button>
            </div>

            <div className="space-y-6">
              {(content.keyInitiatives || []).map((initiative, initiativeIndex) => (
                <div key={initiativeIndex} className="border border-gray-200 rounded-lg p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-base font-semibold text-gray-900">Initiative {initiativeIndex + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeInitiative(initiativeIndex)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Title"
                      value={initiative.title}
                      onChange={(e) => updateInitiative(initiativeIndex, { title: e.target.value })}
                      placeholder="Free SHS Policy"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                      <select
                        value={initiative.icon}
                        onChange={(e) => updateInitiative(initiativeIndex, { icon: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="graduation-cap">Graduation Cap</option>
                        <option value="users">Users</option>
                        <option value="trending-up">Trending Up</option>
                        <option value="book-open">Book Open</option>
                        <option value="building">Building</option>
                        <option value="award">Award</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={initiative.description}
                      onChange={(e) => updateInitiative(initiativeIndex, { description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Introduced in September 2017, this transformative policy removes cost barriers..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                    <select
                      value={initiative.color || 'green'}
                      onChange={(e) => updateInitiative(initiativeIndex, { color: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="green">Green (Primary)</option>
                      <option value="blue">Blue (Secondary)</option>
                      <option value="yellow">Yellow (Accent)</option>
                      <option value="teal">Teal</option>
                    </select>
                  </div>

                  {/* Features Sub-section */}
                  <div className="mt-4 pl-4 border-l-2 border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700">Features / Bullet Points</span>
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
                            placeholder="Remove financial barriers to education"
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

              {(content.keyInitiatives || []).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No initiatives added yet. Click "Add Initiative" to get started.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
