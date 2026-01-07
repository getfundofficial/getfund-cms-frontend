import React, { useState } from 'react';
import { Button } from '../Common/Button';
import { Input } from '../Common/Input';
import { ImageInput } from '../Common/ImageInput';
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';

type FontSize = 'small' | 'medium' | 'large' | 'xlarge';
type GradientDirection = 'to right' | 'to bottom' | 'to bottom right' | 'to top right';

interface SlideOverlay {
  tintColor?: string;
  tintColor2?: string;
  useGradient?: boolean;
  gradientDirection?: GradientDirection;
  tintOpacity?: number;
}

interface HeroSlide {
  image: string;
  headline: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  titleFontSize?: FontSize;
  subtitleFontSize?: FontSize;
  overlay?: SlideOverlay;
}

interface Service {
  title: string;
  description: string;
  link?: string;
}

interface ImpactStat {
  number: string;
  label: string;
  description?: string;
}

interface VideoSection {
  url: string;
  provider: 'youtube' | 'vimeo' | 'upload';
  title?: string;
  subtitle?: string;
}

interface HomePageContent {
  heroSlides: HeroSlide[];
  aboutHeading?: string;
  aboutSubheading?: string;
  mission?: {
    title: string;
    description: string;
  };
  vision?: {
    title: string;
    description: string;
  };
  coreValues?: {
    title: string;
    description: string;
  };
  aboutGETFundHeading?: string;
  aboutGETFundContent?: string[];
  relevantFactors?: string[];
  servicesTitle?: string;
  services?: Service[];
  impactStats?: ImpactStat[];
  newsTitle?: string;
  newsSubtitle?: string;
  videoSection?: VideoSection;
}

interface HomePageEditorProps {
  content: HomePageContent;
  onChange: (content: HomePageContent) => void;
}

export const HomePageEditor: React.FC<HomePageEditorProps> = ({ content, onChange }) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'video' | 'who-we-are' | 'about-getfund' | 'news'>('hero');

  // Debug logging
  console.log('[HomePageEditor] Received content:', content);
  console.log('[HomePageEditor] Hero slides count:', content?.heroSlides?.length || 0);
  console.log('[HomePageEditor] Hero slides:', content?.heroSlides);

  const updateContent = (updates: Partial<HomePageContent>) => {
    onChange({ ...content, ...updates });
  };

  // Font size options for dropdowns
  const fontSizeOptions: { value: FontSize; label: string }[] = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium (Default)' },
    { value: 'large', label: 'Large' },
    { value: 'xlarge', label: 'Extra Large' },
  ];

  // Gradient direction options
  const gradientDirectionOptions: { value: GradientDirection; label: string }[] = [
    { value: 'to bottom', label: 'Top to Bottom' },
    { value: 'to right', label: 'Left to Right' },
    { value: 'to bottom right', label: 'Diagonal (↘)' },
    { value: 'to top right', label: 'Diagonal (↗)' },
  ];

  // Default overlay settings
  const defaultOverlay: SlideOverlay = {
    tintColor: '#059669',
    tintColor2: '#0d9488',
    useGradient: true,
    gradientDirection: 'to bottom',
    tintOpacity: 60,
  };

  // Hero Slides Methods
  const addHeroSlide = () => {
    const newSlide: HeroSlide = {
      image: '',
      headline: '',
      description: '',
      ctaText: '',
      ctaLink: '',
      titleFontSize: 'medium',
      subtitleFontSize: 'medium',
      overlay: { ...defaultOverlay },
    };
    updateContent({ heroSlides: [...(content.heroSlides || []), newSlide] });
  };

  const updateHeroSlide = (index: number, slide: HeroSlide) => {
    const slides = [...(content.heroSlides || [])];
    slides[index] = slide;
    updateContent({ heroSlides: slides });
  };

  const removeHeroSlide = (index: number) => {
    const slides = content.heroSlides?.filter((_, i) => i !== index) || [];
    updateContent({ heroSlides: slides });
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const slides = [...(content.heroSlides || [])];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;

    [slides[index], slides[newIndex]] = [slides[newIndex], slides[index]];
    updateContent({ heroSlides: slides });
  };

  // About GETFund Content Methods
  const addAboutParagraph = () => {
    updateContent({ aboutGETFundContent: [...(content.aboutGETFundContent || []), ''] });
  };

  const updateAboutParagraph = (index: number, text: string) => {
    const paragraphs = [...(content.aboutGETFundContent || [])];
    paragraphs[index] = text;
    updateContent({ aboutGETFundContent: paragraphs });
  };

  const removeAboutParagraph = (index: number) => {
    const paragraphs = content.aboutGETFundContent?.filter((_, i) => i !== index) || [];
    updateContent({ aboutGETFundContent: paragraphs });
  };

  // Relevant Factors Methods
  const addRelevantFactor = () => {
    updateContent({ relevantFactors: [...(content.relevantFactors || []), ''] });
  };

  const updateRelevantFactor = (index: number, text: string) => {
    const factors = [...(content.relevantFactors || [])];
    factors[index] = text;
    updateContent({ relevantFactors: factors });
  };

  const removeRelevantFactor = (index: number) => {
    const factors = content.relevantFactors?.filter((_, i) => i !== index) || [];
    updateContent({ relevantFactors: factors });
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'hero', label: 'Hero Slides' },
            { key: 'video', label: 'Impact Video' },
            { key: 'who-we-are', label: 'Who We Are' },
            { key: 'about-getfund', label: 'About GETFund' },
            { key: 'news', label: 'News & Updates' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.key
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

      {/* Hero Slides Tab */}
      {activeTab === 'hero' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Hero Carousel Slides</h3>
            <Button onClick={addHeroSlide} variant="secondary" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Slide
            </Button>
          </div>

          {content.heroSlides?.map((slide, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-4 space-y-3 bg-gray-50">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Slide {index + 1}</h4>
                <div className="flex gap-2">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveSlide(index, 'up')}
                      className="p-1 text-gray-600 hover:text-gray-900"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                  )}
                  {index < (content.heroSlides?.length || 0) - 1 && (
                    <button
                      type="button"
                      onClick={() => moveSlide(index, 'down')}
                      className="p-1 text-gray-600 hover:text-gray-900"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeHeroSlide(index)}
                    className="p-1 text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <ImageInput
                label="Image URL"
                value={slide.image}
                onChange={(value) => updateHeroSlide(index, { ...slide, image: value })}
                placeholder="/images/hero/slide.jpg"
              />

              <Input
                label="Headline"
                value={slide.headline}
                onChange={(e) => updateHeroSlide(index, { ...slide, headline: e.target.value })}
                placeholder="Every Ghanaian Child Deserves..."
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={slide.description}
                  onChange={(e) => updateHeroSlide(index, { ...slide, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={2}
                  placeholder="Supporting the delivery of quality education..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="CTA Button Text (Optional)"
                  value={slide.ctaText || ''}
                  onChange={(e) => updateHeroSlide(index, { ...slide, ctaText: e.target.value })}
                  placeholder="Apply for Scholarship"
                />

                <Input
                  label="CTA Button Link (Optional)"
                  value={slide.ctaLink || ''}
                  onChange={(e) => updateHeroSlide(index, { ...slide, ctaLink: e.target.value })}
                  placeholder="/scholarship-apply"
                />
              </div>

              {/* Font Size Settings */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Text Sizes</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Headline Font Size
                    </label>
                    <select
                      value={slide.titleFontSize || 'medium'}
                      onChange={(e) => updateHeroSlide(index, { ...slide, titleFontSize: e.target.value as FontSize })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {fontSizeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Description Font Size
                    </label>
                    <select
                      value={slide.subtitleFontSize || 'medium'}
                      onChange={(e) => updateHeroSlide(index, { ...slide, subtitleFontSize: e.target.value as FontSize })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {fontSizeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Overlay/Tint Settings */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Overlay & Tint</h5>

                {/* Use Gradient Toggle */}
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    id={`useGradient-${index}`}
                    checked={slide.overlay?.useGradient ?? true}
                    onChange={(e) => updateHeroSlide(index, {
                      ...slide,
                      overlay: { ...defaultOverlay, ...slide.overlay, useGradient: e.target.checked }
                    })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`useGradient-${index}`} className="text-sm text-gray-600">
                    Use gradient (two colors)
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  {/* Primary Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {slide.overlay?.useGradient ? 'Primary Color' : 'Tint Color'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={slide.overlay?.tintColor || '#059669'}
                        onChange={(e) => updateHeroSlide(index, {
                          ...slide,
                          overlay: { ...defaultOverlay, ...slide.overlay, tintColor: e.target.value }
                        })}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={slide.overlay?.tintColor || '#059669'}
                        onChange={(e) => updateHeroSlide(index, {
                          ...slide,
                          overlay: { ...defaultOverlay, ...slide.overlay, tintColor: e.target.value }
                        })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="#059669"
                      />
                    </div>
                  </div>

                  {/* Secondary Color (only shown when gradient is enabled) */}
                  {(slide.overlay?.useGradient ?? true) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Secondary Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={slide.overlay?.tintColor2 || '#0d9488'}
                          onChange={(e) => updateHeroSlide(index, {
                            ...slide,
                            overlay: { ...defaultOverlay, ...slide.overlay, tintColor2: e.target.value }
                          })}
                          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={slide.overlay?.tintColor2 || '#0d9488'}
                          onChange={(e) => updateHeroSlide(index, {
                            ...slide,
                            overlay: { ...defaultOverlay, ...slide.overlay, tintColor2: e.target.value }
                          })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="#0d9488"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Gradient Direction (only shown when gradient is enabled) */}
                  {(slide.overlay?.useGradient ?? true) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Gradient Direction
                      </label>
                      <select
                        value={slide.overlay?.gradientDirection || 'to bottom'}
                        onChange={(e) => updateHeroSlide(index, {
                          ...slide,
                          overlay: { ...defaultOverlay, ...slide.overlay, gradientDirection: e.target.value as GradientDirection }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {gradientDirectionOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Opacity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Opacity: {slide.overlay?.tintOpacity ?? 60}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={slide.overlay?.tintOpacity ?? 60}
                      onChange={(e) => updateHeroSlide(index, {
                        ...slide,
                        overlay: { ...defaultOverlay, ...slide.overlay, tintOpacity: parseInt(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Preview</label>
                  <div
                    className="h-16 rounded-md border border-gray-300"
                    style={{
                      background: (slide.overlay?.useGradient ?? true)
                        ? `linear-gradient(${slide.overlay?.gradientDirection || 'to bottom'}, ${slide.overlay?.tintColor || '#059669'}${Math.round(((slide.overlay?.tintOpacity ?? 60) / 100) * 255).toString(16).padStart(2, '0')}, ${slide.overlay?.tintColor2 || '#0d9488'}${Math.round(((slide.overlay?.tintOpacity ?? 60) / 100) * 255).toString(16).padStart(2, '0')})`
                        : `${slide.overlay?.tintColor || '#059669'}${Math.round(((slide.overlay?.tintOpacity ?? 60) / 100) * 255).toString(16).padStart(2, '0')}`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          {(!content.heroSlides || content.heroSlides.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              No slides added yet. Click "Add Slide" to create your first slide.
            </div>
          )}
        </div>
      )}

      {/* Video Tab */}
      {activeTab === 'video' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">See Our Impact Video</h3>
          <p className="text-sm text-gray-600">
            This video appears in the "See Our Impact" section on the homepage.
          </p>

          <div className="border border-gray-300 rounded-lg p-4 space-y-4 bg-gray-50">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={content.videoSection?.url || ''}
                onChange={(e) => {
                  const url = e.target.value;
                  // Auto-detect provider
                  let provider: 'youtube' | 'vimeo' | 'upload' = 'upload';
                  if (url.includes('youtube.com') || url.includes('youtu.be')) {
                    provider = 'youtube';
                  } else if (url.includes('vimeo.com')) {
                    provider = 'vimeo';
                  }
                  updateContent({
                    videoSection: {
                      ...content.videoSection,
                      url,
                      provider,
                      title: content.videoSection?.title || 'See Our Impact in Action',
                      subtitle: content.videoSection?.subtitle || ''
                    }
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
              />
              {content.videoSection?.url && (
                <p className="text-sm text-gray-500 mt-1">
                  Detected provider: <span className="font-medium capitalize">{content.videoSection?.provider || 'unknown'}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video Title
              </label>
              <input
                type="text"
                value={content.videoSection?.title || ''}
                onChange={(e) => updateContent({
                  videoSection: {
                    ...content.videoSection,
                    url: content.videoSection?.url || '',
                    provider: content.videoSection?.provider || 'youtube',
                    title: e.target.value
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="See Our Impact in Action"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video Subtitle
              </label>
              <input
                type="text"
                value={content.videoSection?.subtitle || ''}
                onChange={(e) => updateContent({
                  videoSection: {
                    ...content.videoSection,
                    url: content.videoSection?.url || '',
                    provider: content.videoSection?.provider || 'youtube',
                    title: content.videoSection?.title || '',
                    subtitle: e.target.value
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Watch how GETFund is transforming education across Ghana"
              />
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Supported formats:</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-2 list-disc list-inside">
              <li>YouTube: https://www.youtube.com/watch?v=VIDEO_ID</li>
              <li>YouTube (short): https://youtu.be/VIDEO_ID</li>
              <li>Vimeo: https://vimeo.com/VIDEO_ID</li>
            </ul>
          </div>
        </div>
      )}

      {/* Who We Are Tab */}
      {activeTab === 'who-we-are' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Who We Are Section</h3>

          <Input
            label="Section Heading"
            value={content.aboutHeading || ''}
            onChange={(e) => updateContent({ aboutHeading: e.target.value })}
            placeholder="Who We Are"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Subtitle
            </label>
            <textarea
              value={content.aboutSubheading || ''}
              onChange={(e) => updateContent({ aboutSubheading: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={2}
              placeholder="The Ghana Education Trust Fund is a statutory body..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Mission */}
            <div className="border border-gray-300 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold">Mission</h4>
              <Input
                label="Title"
                value={content.mission?.title || ''}
                onChange={(e) => updateContent({
                  mission: { ...content.mission, title: e.target.value, description: content.mission?.description || '' }
                })}
                placeholder="Our Mission"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={content.mission?.description || ''}
                  onChange={(e) => updateContent({
                    mission: { title: content.mission?.title || '', description: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
            </div>

            {/* Vision */}
            <div className="border border-gray-300 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold">Vision</h4>
              <Input
                label="Title"
                value={content.vision?.title || ''}
                onChange={(e) => updateContent({
                  vision: { ...content.vision, title: e.target.value, description: content.vision?.description || '' }
                })}
                placeholder="Our Vision"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={content.vision?.description || ''}
                  onChange={(e) => updateContent({
                    vision: { title: content.vision?.title || '', description: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
            </div>

            {/* Core Values */}
            <div className="border border-gray-300 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold">Core Values</h4>
              <Input
                label="Title"
                value={content.coreValues?.title || ''}
                onChange={(e) => updateContent({
                  coreValues: { ...content.coreValues, title: e.target.value, description: content.coreValues?.description || '' }
                })}
                placeholder="Core Values"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={content.coreValues?.description || ''}
                  onChange={(e) => updateContent({
                    coreValues: { title: content.coreValues?.title || '', description: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About GETFund Tab */}
      {activeTab === 'about-getfund' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">About GETFund Section</h3>

          <Input
            label="Section Heading"
            value={content.aboutGETFundHeading || ''}
            onChange={(e) => updateContent({ aboutGETFundHeading: e.target.value })}
            placeholder="About GETFund"
          />

          {/* Content Paragraphs */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Content Paragraphs</label>
              <Button onClick={addAboutParagraph} variant="secondary" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Paragraph
              </Button>
            </div>

            {content.aboutGETFundContent?.map((paragraph, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-4 space-y-3 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Paragraph {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeAboutParagraph(index)}
                    className="p-1 text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <textarea
                  value={paragraph}
                  onChange={(e) => updateAboutParagraph(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={4}
                  placeholder="Since its establishment in the year 2000..."
                />
              </div>
            ))}

            {(!content.aboutGETFundContent || content.aboutGETFundContent.length === 0) && (
              <div className="text-center py-4 text-gray-500 text-sm">
                No paragraphs added yet. Click "Add Paragraph" to add content.
              </div>
            )}
          </div>

          {/* Relevant Factors */}
          <div className="space-y-3 mt-6">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Relevant Factors</label>
              <Button onClick={addRelevantFactor} variant="secondary" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Factor
              </Button>
            </div>

            {content.relevantFactors?.map((factor, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-3 bg-gray-50 flex items-start gap-2">
                <span className="text-gray-500 mt-2">•</span>
                <textarea
                  value={factor}
                  onChange={(e) => updateRelevantFactor(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  rows={2}
                  placeholder="Promotion of the study of Mathematics, Science and Technology"
                />
                <button
                  type="button"
                  onClick={() => removeRelevantFactor(index)}
                  className="p-1 text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {(!content.relevantFactors || content.relevantFactors.length === 0) && (
              <div className="text-center py-4 text-gray-500 text-sm">
                No factors added yet. Click "Add Factor" to add a bullet point.
              </div>
            )}
          </div>
        </div>
      )}

      {/* News & Updates Tab */}
      {activeTab === 'news' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">News & Updates Section</h3>

          <Input
            label="Section Title"
            value={content.newsTitle || ''}
            onChange={(e) => updateContent({ newsTitle: e.target.value })}
            placeholder="News & Updates"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Subtitle
            </label>
            <textarea
              value={content.newsSubtitle || ''}
              onChange={(e) => updateContent({ newsSubtitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={2}
              placeholder="Stay updated with the latest developments and achievements from GETFund"
            />
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The actual news articles are managed separately in the News section.
              This section only controls the title and subtitle displayed above the news items on the homepage.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
