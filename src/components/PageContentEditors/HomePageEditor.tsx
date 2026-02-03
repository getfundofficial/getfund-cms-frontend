import React, { useState } from 'react';
import { Button } from '../Common/Button';
import { Input } from '../Common/Input';
import { ImageInput } from '../Common/ImageInput';
import { LinkInput } from '../Common/LinkInput';
import { Plus, Trash2, MoveUp, MoveDown, ChevronDown, ChevronRight } from 'lucide-react';

type FontSize = 'small' | 'medium' | 'large' | 'xlarge';
type GradientDirection = 'to right' | 'to bottom' | 'to bottom right' | 'to top right';

interface SlideOverlay {
  tintColor?: string;
  tintColor2?: string;
  useGradient?: boolean;
  gradientDirection?: GradientDirection;
  tintOpacity?: number;
}

interface BlueBoxSettings {
  text?: string;
  color?: string;
  opacity?: number;
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
  blueBox?: BlueBoxSettings;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
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

interface AchievementCircle {
  title: string;
  value: string;
}

interface AchievementCategory {
  title: string;
  description: string;
  image: string;
  link?: string;
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
  // Achievements Section
  achievementsTitle?: string;
  achievementsSubtitle?: string;
  achievementCircles?: AchievementCircle[];
  achievementCategories?: AchievementCategory[];
}

interface HomePageEditorProps {
  content: HomePageContent;
  onChange: (content: HomePageContent) => void;
}

export const HomePageEditor: React.FC<HomePageEditorProps> = ({ content, onChange }) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'achievements' | 'who-we-are' | 'about-getfund' | 'news'>('hero');
  const [expandedSlides, setExpandedSlides] = useState<Set<number>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Record<number, Set<string>>>({});

  const toggleSlideExpanded = (index: number) => {
    const newExpanded = new Set(expandedSlides);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSlides(newExpanded);
  };

  const toggleSection = (slideIndex: number, section: string) => {
    const slideSections = expandedSections[slideIndex] || new Set();
    const newSections = new Set(slideSections);
    if (newSections.has(section)) {
      newSections.delete(section);
    } else {
      newSections.add(section);
    }
    setExpandedSections({ ...expandedSections, [slideIndex]: newSections });
  };

  const isSectionExpanded = (slideIndex: number, section: string) => {
    return expandedSections[slideIndex]?.has(section) || false;
  };

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

  // Default blue box settings
  const defaultBlueBox: BlueBoxSettings = {
    text: '',
    color: '#2a3f75',
    opacity: 100,
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
      blueBox: { ...defaultBlueBox },
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
            { key: 'achievements', label: 'Achievements' },
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
            <div>
              <h3 className="text-lg font-semibold">Hero Carousel Slides</h3>
              <p className="text-sm text-gray-500">Manage the slides that appear in the homepage hero section</p>
            </div>
            <Button onClick={addHeroSlide} variant="secondary" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Slide
            </Button>
          </div>

          {content.heroSlides?.map((slide, index) => (
            <div key={index} className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
              {/* Slide Header - Always Visible */}
              <div
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleSlideExpanded(index)}
              >
                <div className="flex items-center gap-3">
                  {expandedSlides.has(index) ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">Slide {index + 1}</h4>
                    <p className="text-sm text-gray-500 truncate max-w-md">
                      {slide.headline || 'No headline set'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveSlide(index, 'up')}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                      title="Move up"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                  )}
                  {index < (content.heroSlides?.length || 0) - 1 && (
                    <button
                      type="button"
                      onClick={() => moveSlide(index, 'down')}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                      title="Move down"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeHeroSlide(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    title="Delete slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Slide Content - Collapsible */}
              {expandedSlides.has(index) && (
                <div className="p-4 space-y-4 border-t border-gray-200">
                  {/* Media Type Selection */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleSection(index, 'mediaSettings')}
                      className="w-full flex justify-between items-center p-3 bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <span className="font-medium text-sm text-blue-700">Media Settings (Image or Video)</span>
                      {isSectionExpanded(index, 'mediaSettings') ? (
                        <ChevronDown className="w-4 h-4 text-blue-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-blue-500" />
                      )}
                    </button>
                    {isSectionExpanded(index, 'mediaSettings') && (
                      <div className="p-3 space-y-3 bg-white">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`mediaType-${index}`}
                                value="image"
                                checked={slide.mediaType !== 'video'}
                                onChange={() => updateHeroSlide(index, { ...slide, mediaType: 'image' })}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="text-sm text-gray-700">Image</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`mediaType-${index}`}
                                value="video"
                                checked={slide.mediaType === 'video'}
                                onChange={() => updateHeroSlide(index, { ...slide, mediaType: 'video' })}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="text-sm text-gray-700">Video</span>
                            </label>
                          </div>
                        </div>

                        {slide.mediaType === 'video' && (
                          <div>
                            <Input
                              label="Video URL"
                              value={slide.videoUrl || ''}
                              onChange={(e) => updateHeroSlide(index, { ...slide, videoUrl: e.target.value })}
                              placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Supports YouTube, Vimeo, or direct video files (.mp4, .webm)
                            </p>
                          </div>
                        )}

                        <ImageInput
                          label={slide.mediaType === 'video' ? "Fallback Image (shown while video loads)" : "Background Image"}
                          value={slide.image}
                          onChange={(value) => updateHeroSlide(index, { ...slide, image: value })}
                          placeholder="/images/hero/slide.jpg"
                        />
                      </div>
                    )}
                  </div>

                  {/* Quick Image Input (when media settings collapsed) */}
                  {!isSectionExpanded(index, 'mediaSettings') && (
                    <ImageInput
                      label="Background Image"
                      value={slide.image}
                      onChange={(value) => updateHeroSlide(index, { ...slide, image: value })}
                      placeholder="/images/hero/slide.jpg"
                    />
                  )}

                  <Input
                    label="Headline"
                    value={slide.headline}
                    onChange={(e) => updateHeroSlide(index, { ...slide, headline: e.target.value })}
                    placeholder="Every Ghanaian Child Deserves..."
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={slide.description}
                      onChange={(e) => updateHeroSlide(index, { ...slide, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Supporting the delivery of quality education..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Button Text (Optional)"
                      value={slide.ctaText || ''}
                      onChange={(e) => updateHeroSlide(index, { ...slide, ctaText: e.target.value })}
                      placeholder="Apply for Scholarship"
                    />
                    <LinkInput
                      label="Button Link"
                      value={slide.ctaLink || ''}
                      onChange={(value) => updateHeroSlide(index, { ...slide, ctaLink: value })}
                      placeholder="/scholarship-apply"
                    />
                  </div>

                  {/* Content Box Section - Collapsible */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleSection(index, 'contentBox')}
                      className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium text-sm text-gray-700">Content Box Styling</span>
                      {isSectionExpanded(index, 'contentBox') ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                    {isSectionExpanded(index, 'contentBox') && (
                      <div className="p-3 space-y-3 bg-white">
                        <Input
                          label="Label Text (appears above headline)"
                          value={slide.blueBox?.text || ''}
                          onChange={(e) => updateHeroSlide(index, {
                            ...slide,
                            blueBox: { ...defaultBlueBox, ...slide.blueBox, text: e.target.value }
                          })}
                          placeholder="e.g., GETFund Initiative"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Box Color</label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={slide.blueBox?.color || '#2a3f75'}
                                onChange={(e) => updateHeroSlide(index, {
                                  ...slide,
                                  blueBox: { ...defaultBlueBox, ...slide.blueBox, color: e.target.value }
                                })}
                                className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={slide.blueBox?.color || '#2a3f75'}
                                onChange={(e) => updateHeroSlide(index, {
                                  ...slide,
                                  blueBox: { ...defaultBlueBox, ...slide.blueBox, color: e.target.value }
                                })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Opacity: {slide.blueBox?.opacity ?? 100}%
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              value={slide.blueBox?.opacity ?? 100}
                              onChange={(e) => updateHeroSlide(index, {
                                ...slide,
                                blueBox: { ...defaultBlueBox, ...slide.blueBox, opacity: parseInt(e.target.value) }
                              })}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-3"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Text Settings Section - Collapsible */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleSection(index, 'textSettings')}
                      className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium text-sm text-gray-700">Text Size Settings</span>
                      {isSectionExpanded(index, 'textSettings') ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                    {isSectionExpanded(index, 'textSettings') && (
                      <div className="p-3 bg-white">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Headline Size</label>
                            <select
                              value={slide.titleFontSize || 'medium'}
                              onChange={(e) => updateHeroSlide(index, { ...slide, titleFontSize: e.target.value as FontSize })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                            >
                              {fontSizeOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Description Size</label>
                            <select
                              value={slide.subtitleFontSize || 'medium'}
                              onChange={(e) => updateHeroSlide(index, { ...slide, subtitleFontSize: e.target.value as FontSize })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                            >
                              {fontSizeOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Overlay Settings Section - Collapsible */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleSection(index, 'overlay')}
                      className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium text-sm text-gray-700">Image Overlay Settings</span>
                      {isSectionExpanded(index, 'overlay') ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                    {isSectionExpanded(index, 'overlay') && (
                      <div className="p-3 space-y-3 bg-white">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`useGradient-${index}`}
                            checked={slide.overlay?.useGradient ?? true}
                            onChange={(e) => updateHeroSlide(index, {
                              ...slide,
                              overlay: { ...defaultOverlay, ...slide.overlay, useGradient: e.target.checked }
                            })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                          />
                          <label htmlFor={`useGradient-${index}`} className="text-sm text-gray-600">
                            Use gradient overlay
                          </label>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              {slide.overlay?.useGradient ? 'Start Color' : 'Overlay Color'}
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={slide.overlay?.tintColor || '#059669'}
                                onChange={(e) => updateHeroSlide(index, {
                                  ...slide,
                                  overlay: { ...defaultOverlay, ...slide.overlay, tintColor: e.target.value }
                                })}
                                className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={slide.overlay?.tintColor || '#059669'}
                                onChange={(e) => updateHeroSlide(index, {
                                  ...slide,
                                  overlay: { ...defaultOverlay, ...slide.overlay, tintColor: e.target.value }
                                })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                              />
                            </div>
                          </div>
                          {(slide.overlay?.useGradient ?? true) && (
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">End Color</label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={slide.overlay?.tintColor2 || '#0d9488'}
                                  onChange={(e) => updateHeroSlide(index, {
                                    ...slide,
                                    overlay: { ...defaultOverlay, ...slide.overlay, tintColor2: e.target.value }
                                  })}
                                  className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={slide.overlay?.tintColor2 || '#0d9488'}
                                  onChange={(e) => updateHeroSlide(index, {
                                    ...slide,
                                    overlay: { ...defaultOverlay, ...slide.overlay, tintColor2: e.target.value }
                                  })}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {(slide.overlay?.useGradient ?? true) && (
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">Direction</label>
                              <select
                                value={slide.overlay?.gradientDirection || 'to bottom'}
                                onChange={(e) => updateHeroSlide(index, {
                                  ...slide,
                                  overlay: { ...defaultOverlay, ...slide.overlay, gradientDirection: e.target.value as GradientDirection }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                              >
                                {gradientDirectionOptions.map((option) => (
                                  <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                              </select>
                            </div>
                          )}
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
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                            />
                          </div>
                        </div>

                        {/* Overlay Preview */}
                        <div
                          className="h-12 rounded-md border border-gray-300"
                          style={{
                            background: (slide.overlay?.useGradient ?? true)
                              ? `linear-gradient(${slide.overlay?.gradientDirection || 'to bottom'}, ${slide.overlay?.tintColor || '#059669'}${Math.round(((slide.overlay?.tintOpacity ?? 60) / 100) * 255).toString(16).padStart(2, '0')}, ${slide.overlay?.tintColor2 || '#0d9488'}${Math.round(((slide.overlay?.tintOpacity ?? 60) / 100) * 255).toString(16).padStart(2, '0')})`
                              : `${slide.overlay?.tintColor || '#059669'}${Math.round(((slide.overlay?.tintOpacity ?? 60) / 100) * 255).toString(16).padStart(2, '0')}`
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Live Preview */}
                  <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Live Preview {slide.mediaType === 'video' && <span className="text-blue-600">(Video Slide)</span>}
                    </label>
                    <div
                      className="relative rounded-md overflow-hidden"
                      style={{ minHeight: '120px' }}
                    >
                      {/* Video indicator or Background Image */}
                      {slide.mediaType === 'video' && slide.videoUrl ? (
                        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                          <div className="text-center text-white">
                            <svg className="w-12 h-12 mx-auto mb-2 opacity-70" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                            <p className="text-xs opacity-70">Video will play here</p>
                          </div>
                          {slide.image && (
                            <img
                              src={slide.image}
                              alt="Preview"
                              className="absolute inset-0 w-full h-full object-cover opacity-30"
                            />
                          )}
                        </div>
                      ) : slide.image && (
                        <img
                          src={slide.image}
                          alt="Preview"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                      {/* Overlay */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: (slide.overlay?.useGradient ?? true)
                            ? `linear-gradient(${slide.overlay?.gradientDirection || 'to bottom'}, ${slide.overlay?.tintColor || '#059669'}${Math.round(((slide.overlay?.tintOpacity ?? 60) / 100) * 255).toString(16).padStart(2, '0')}, ${slide.overlay?.tintColor2 || '#0d9488'}${Math.round(((slide.overlay?.tintOpacity ?? 60) / 100) * 255).toString(16).padStart(2, '0')})`
                            : `${slide.overlay?.tintColor || '#059669'}${Math.round(((slide.overlay?.tintOpacity ?? 60) / 100) * 255).toString(16).padStart(2, '0')}`
                        }}
                      />
                      {/* Content Box */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <div
                          className="p-3 rounded text-white max-w-xs"
                          style={{
                            backgroundColor: slide.blueBox?.color || '#2a3f75',
                            opacity: (slide.blueBox?.opacity ?? 100) / 100,
                          }}
                        >
                          {slide.blueBox?.text && (
                            <span className="text-xs text-blue-200 uppercase tracking-wider block mb-1">
                              {slide.blueBox.text}
                            </span>
                          )}
                          <h4 className="font-bold text-sm">{slide.headline || 'Headline'}</h4>
                          <p className="text-xs text-gray-200 mt-1">{slide.description || 'Description'}</p>
                          {slide.ctaText && (
                            <span className="text-xs uppercase tracking-wider mt-2 inline-flex items-center gap-1">
                              {slide.ctaText} →
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {(!content.heroSlides || content.heroSlides.length === 0) && (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="mb-2">No slides added yet</p>
              <Button onClick={addHeroSlide} variant="secondary" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Slide
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Achievements Section</h3>
            <p className="text-sm text-gray-500">Edit the "What GETFund Has Done" section with green circles and category images</p>
          </div>

          {/* Section Title & Subtitle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Section Title"
              value={content.achievementsTitle || ''}
              onChange={(e) => updateContent({ achievementsTitle: e.target.value })}
              placeholder="What GETFund Has Done"
            />
            <Input
              label="Section Subtitle"
              value={content.achievementsSubtitle || ''}
              onChange={(e) => updateContent({ achievementsSubtitle: e.target.value })}
              placeholder="Transforming education across Ghana since 2000"
            />
          </div>

          {/* Green Circles */}
          <div className="border border-gray-300 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">Green Circles (Stats)</h4>
                <p className="text-sm text-gray-500">5 circles displayed at the top with numbers and labels</p>
              </div>
              <Button
                onClick={() => {
                  const circles = content.achievementCircles || [];
                  if (circles.length < 5) {
                    updateContent({
                      achievementCircles: [...circles, { title: '', value: '' }]
                    });
                  }
                }}
                variant="secondary"
                size="sm"
                disabled={(content.achievementCircles?.length || 0) >= 5}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Circle
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {(content.achievementCircles || []).map((circle, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500">Circle {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const circles = content.achievementCircles?.filter((_, i) => i !== index) || [];
                        updateContent({ achievementCircles: circles });
                      }}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <Input
                    label="Value"
                    value={circle.value}
                    onChange={(e) => {
                      const circles = [...(content.achievementCircles || [])];
                      circles[index] = { ...circle, value: e.target.value };
                      updateContent({ achievementCircles: circles });
                    }}
                    placeholder="5,000+"
                  />
                  <Input
                    label="Label"
                    value={circle.title}
                    onChange={(e) => {
                      const circles = [...(content.achievementCircles || [])];
                      circles[index] = { ...circle, title: e.target.value };
                      updateContent({ achievementCircles: circles });
                    }}
                    placeholder="Scholarships"
                  />
                </div>
              ))}
            </div>

            {(!content.achievementCircles || content.achievementCircles.length === 0) && (
              <div className="text-center py-4 text-gray-500 text-sm border-2 border-dashed border-gray-300 rounded-lg">
                No circles added yet. Click "Add Circle" to add up to 5 stat circles.
              </div>
            )}
          </div>

          {/* Category Cards */}
          <div className="border border-gray-300 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">Category Cards (Images)</h4>
                <p className="text-sm text-gray-500">Circular images with titles and descriptions</p>
              </div>
              <Button
                onClick={() => {
                  const categories = content.achievementCategories || [];
                  updateContent({
                    achievementCategories: [...categories, { title: '', description: '', image: '', link: '' }]
                  });
                }}
                variant="secondary"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(content.achievementCategories || []).map((category, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Category {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const categories = content.achievementCategories?.filter((_, i) => i !== index) || [];
                        updateContent({ achievementCategories: categories });
                      }}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <ImageInput
                    label="Image"
                    value={category.image}
                    onChange={(value) => {
                      const categories = [...(content.achievementCategories || [])];
                      categories[index] = { ...category, image: value };
                      updateContent({ achievementCategories: categories });
                    }}
                    placeholder="/images/category.jpg"
                  />

                  <Input
                    label="Title"
                    value={category.title}
                    onChange={(e) => {
                      const categories = [...(content.achievementCategories || [])];
                      categories[index] = { ...category, title: e.target.value };
                      updateContent({ achievementCategories: categories });
                    }}
                    placeholder="Scholarships"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={category.description}
                      onChange={(e) => {
                        const categories = [...(content.achievementCategories || [])];
                        categories[index] = { ...category, description: e.target.value };
                        updateContent({ achievementCategories: categories });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      rows={2}
                      placeholder="Brief description..."
                    />
                  </div>

                  <LinkInput
                    label="Link (Optional)"
                    value={category.link || ''}
                    onChange={(value) => {
                      const categories = [...(content.achievementCategories || [])];
                      categories[index] = { ...category, link: value };
                      updateContent({ achievementCategories: categories });
                    }}
                    placeholder="/scholarship"
                  />
                </div>
              ))}
            </div>

            {(!content.achievementCategories || content.achievementCategories.length === 0) && (
              <div className="text-center py-4 text-gray-500 text-sm border-2 border-dashed border-gray-300 rounded-lg">
                No categories added yet. Click "Add Category" to add image cards.
              </div>
            )}
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
