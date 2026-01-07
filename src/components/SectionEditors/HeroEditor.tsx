import React, { useState } from 'react';
import { Button } from '../Common/Button';
import { Input } from '../Common/Input';

interface HeroSlide {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText?: string;
  ctaLink?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  blueBoxText?: string; // Label text shown above the headline in blue box
  blueBoxColor?: string; // Background color of the content box
  blueBoxOpacity?: number; // Opacity of the content box (0-100)
}

interface HeroEditorProps {
  initialData?: {
    slides?: HeroSlide[];
    autoplay?: boolean;
    interval?: number;
  };
  onChange: (data: { slides: HeroSlide[]; autoplay: boolean; interval: number }) => void;
}

export const HeroEditor: React.FC<HeroEditorProps> = ({ initialData, onChange }) => {
  const [slides, setSlides] = useState<HeroSlide[]>(initialData?.slides || []);
  const [autoplay, setAutoplay] = useState(initialData?.autoplay ?? true);
  const [interval, setInterval] = useState(initialData?.interval || 5000);
  const [activeSlide, setActiveSlide] = useState(0);

  const updateData = (newSlides: HeroSlide[], newAutoplay = autoplay, newInterval = interval) => {
    setSlides(newSlides);
    setAutoplay(newAutoplay);
    setInterval(newInterval);
    onChange({ slides: newSlides, autoplay: newAutoplay, interval: newInterval });
  };

  const addSlide = () => {
    const newSlides = [
      ...slides,
      {
        title: '',
        subtitle: '',
        backgroundImage: '',
        overlay: true,
        overlayOpacity: 0.5,
      },
    ];
    updateData(newSlides);
    setActiveSlide(newSlides.length - 1);
  };

  const removeSlide = (index: number) => {
    const newSlides = slides.filter((_, i) => i !== index);
    updateData(newSlides);
    if (activeSlide >= newSlides.length) {
      setActiveSlide(Math.max(0, newSlides.length - 1));
    }
  };

  const updateSlide = (index: number, field: keyof HeroSlide, value: any) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    updateData(newSlides);
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === slides.length - 1)
    ) {
      return;
    }

    const newSlides = [...slides];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
    updateData(newSlides);
    setActiveSlide(newIndex);
  };

  return (
    <div className="space-y-6">
      {/* Slider Settings */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Slider Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoplay"
              checked={autoplay}
              onChange={(e) => updateData(slides, e.target.checked, interval)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="autoplay" className="text-sm font-medium text-gray-700">
              Enable Autoplay
            </label>
          </div>
          {autoplay && (
            <Input
              type="number"
              label="Interval (ms)"
              value={interval}
              onChange={(e) => updateData(slides, autoplay, parseInt(e.target.value) || 5000)}
              min={1000}
              step={1000}
            />
          )}
        </div>
      </div>

      {/* Slides Management */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Hero Slides ({slides.length})
          </h3>
          <Button onClick={addSlide} variant="primary" size="sm">
            + Add Slide
          </Button>
        </div>

        {slides.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-gray-500">No slides yet. Click "Add Slide" to get started.</p>
          </div>
        )}

        {/* Slide Tabs */}
        {slides.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSlide === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Slide {index + 1}
                {slide.title && `: ${slide.title.slice(0, 20)}${slide.title.length > 20 ? '...' : ''}`}
              </button>
            ))}
          </div>
        )}

        {/* Active Slide Editor */}
        {slides[activeSlide] && (
          <div className="border border-gray-300 rounded-lg p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-900">Slide {activeSlide + 1}</h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => moveSlide(activeSlide, 'up')}
                  disabled={activeSlide === 0}
                  className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => moveSlide(activeSlide, 'down')}
                  disabled={activeSlide === slides.length - 1}
                  className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to remove this slide?')) {
                      removeSlide(activeSlide);
                    }
                  }}
                  className="ml-2 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                >
                  Remove Slide
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Content Box Settings */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h5 className="text-sm font-semibold text-gray-900 mb-3">Content Box Settings</h5>
                <div className="space-y-4">
                  <Input
                    type="text"
                    label="Box Label (Optional)"
                    placeholder="e.g., GETFund Initiative, Featured Program"
                    value={slides[activeSlide].blueBoxText || ''}
                    onChange={(e) => updateSlide(activeSlide, 'blueBoxText', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 -mt-2">Small label text displayed above the headline</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Box Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={slides[activeSlide].blueBoxColor || '#2a3f75'}
                          onChange={(e) => updateSlide(activeSlide, 'blueBoxColor', e.target.value)}
                          className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={slides[activeSlide].blueBoxColor || '#2a3f75'}
                          onChange={(e) => updateSlide(activeSlide, 'blueBoxColor', e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm font-mono"
                          placeholder="#2a3f75"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Box Opacity: {slides[activeSlide].blueBoxOpacity ?? 100}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={slides[activeSlide].blueBoxOpacity ?? 100}
                        onChange={(e) => updateSlide(activeSlide, 'blueBoxOpacity', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Title */}
              <Input
                type="text"
                label="Slide Title *"
                placeholder="Transforming Education in Ghana"
                value={slides[activeSlide].title}
                onChange={(e) => updateSlide(activeSlide, 'title', e.target.value)}
                required
              />

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle
                </label>
                <textarea
                  placeholder="Building a brighter future through quality educational infrastructure"
                  value={slides[activeSlide].subtitle}
                  onChange={(e) => updateSlide(activeSlide, 'subtitle', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Background Image */}
              <Input
                type="text"
                label="Background Image URL *"
                placeholder="https://example.com/hero-image.jpg or /uploads/hero.jpg"
                value={slides[activeSlide].backgroundImage}
                onChange={(e) => updateSlide(activeSlide, 'backgroundImage', e.target.value)}
                required
              />

              {/* Image Preview */}
              {slides[activeSlide].backgroundImage && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Image Preview:</p>
                  <div className="relative h-48 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={slides[activeSlide].backgroundImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                      }}
                    />
                    {slides[activeSlide].overlay && (
                      <div
                        className="absolute inset-0 bg-black"
                        style={{ opacity: slides[activeSlide].overlayOpacity || 0.5 }}
                      />
                    )}
                    {/* Blue Box Preview - Bottom Left */}
                    <div
                      className="absolute bottom-4 left-4 p-4 max-w-[60%] text-white"
                      style={{
                        backgroundColor: slides[activeSlide].blueBoxColor || '#2a3f75',
                        opacity: (slides[activeSlide].blueBoxOpacity ?? 100) / 100,
                      }}
                    >
                      {slides[activeSlide].blueBoxText && (
                        <span className="text-xs text-blue-200 uppercase tracking-wider block mb-1">
                          {slides[activeSlide].blueBoxText}
                        </span>
                      )}
                      <h3 className="text-lg font-bold mb-1">{slides[activeSlide].title || 'Title'}</h3>
                      <p className="text-xs text-gray-200">{slides[activeSlide].subtitle || 'Subtitle'}</p>
                      {slides[activeSlide].ctaText && (
                        <span className="text-xs uppercase tracking-wider mt-2 inline-flex items-center gap-1">
                          {slides[activeSlide].ctaText} →
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Overlay Settings */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`overlay-${activeSlide}`}
                    checked={slides[activeSlide].overlay ?? true}
                    onChange={(e) => updateSlide(activeSlide, 'overlay', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`overlay-${activeSlide}`} className="text-sm font-medium text-gray-700">
                    Dark Overlay
                  </label>
                </div>
                {slides[activeSlide].overlay && (
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">
                      Overlay Opacity: {Math.round((slides[activeSlide].overlayOpacity || 0.5) * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={slides[activeSlide].overlayOpacity || 0.5}
                      onChange={(e) => updateSlide(activeSlide, 'overlayOpacity', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h5 className="text-sm font-semibold text-gray-900 mb-3">Call-to-Action Button (Optional)</h5>
                <div className="space-y-3">
                  <Input
                    type="text"
                    label="Button Text"
                    placeholder="Learn More"
                    value={slides[activeSlide].ctaText || ''}
                    onChange={(e) => updateSlide(activeSlide, 'ctaText', e.target.value)}
                  />
                  <Input
                    type="text"
                    label="Button Link"
                    placeholder="#about or /programs"
                    value={slides[activeSlide].ctaLink || ''}
                    onChange={(e) => updateSlide(activeSlide, 'ctaLink', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
