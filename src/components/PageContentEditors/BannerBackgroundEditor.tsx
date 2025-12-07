import React, { useState } from 'react';
import { Image as ImageIcon, Palette, Droplet, Blend } from 'lucide-react';
import { Input } from '../Common/Input';
import MediaPickerModal from '../Media/MediaPickerModal';
import { Media } from '../../services/mediaService';
import { BannerBackground } from '../../types/bannerBackground';

interface BannerBackgroundEditorProps {
  value: BannerBackground;
  onChange: (value: BannerBackground) => void;
}

/**
 * Reusable component for editing banner background settings
 * Supports background image, tint color/gradient, and tint opacity
 */
export const BannerBackgroundEditor: React.FC<BannerBackgroundEditorProps> = ({
  value,
  onChange,
}) => {
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const bannerBg = value || {};
  const imageUrl = bannerBg.imageUrl || null;
  const tintColor = bannerBg.tintColor || '#DC143C';
  const tintColor2 = bannerBg.tintColor2 || '#B22222';
  const useGradient = bannerBg.useGradient ?? false;
  const gradientDirection = bannerBg.gradientDirection || 'to right';
  const tintOpacity = bannerBg.tintOpacity ?? 50;
  const titleColor = bannerBg.titleColor || '#FFFFFF';
  const subtitleColor = bannerBg.subtitleColor || '#FCA5A5';

  const handleImageSelect = (media: Media) => {
    onChange({
      ...bannerBg,
      imageUrl: media.url,
    });
    setShowMediaPicker(false);
  };

  const handleImageRemove = () => {
    onChange({
      ...bannerBg,
      imageUrl: null,
    });
  };

  const handleTintColorChange = (color: string) => {
    onChange({
      ...bannerBg,
      tintColor: color,
    });
  };

  const handleTintColor2Change = (color: string) => {
    onChange({
      ...bannerBg,
      tintColor2: color,
    });
  };

  const handleUseGradientToggle = () => {
    onChange({
      ...bannerBg,
      useGradient: !useGradient,
    });
  };

  const handleGradientDirectionChange = (direction: string) => {
    onChange({
      ...bannerBg,
      gradientDirection: direction as BannerBackground['gradientDirection'],
    });
  };

  const handleTintOpacityChange = (opacity: number) => {
    // Clamp between 0 and 100
    const clampedOpacity = Math.min(100, Math.max(0, opacity));
    onChange({
      ...bannerBg,
      tintOpacity: clampedOpacity,
    });
  };

  const handleTitleColorChange = (color: string) => {
    onChange({
      ...bannerBg,
      titleColor: color,
    });
  };

  const handleSubtitleColorChange = (color: string) => {
    onChange({
      ...bannerBg,
      subtitleColor: color,
    });
  };

  // Generate the tint style for preview
  const getTintStyle = () => {
    if (useGradient) {
      return {
        backgroundImage: `linear-gradient(${gradientDirection}, ${tintColor}, ${tintColor2})`,
        opacity: imageUrl ? tintOpacity / 100 : 1,
      };
    } else {
      return {
        backgroundColor: tintColor,
        opacity: imageUrl ? tintOpacity / 100 : 1,
      };
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-900">Banner Background Settings</h3>
      </div>

      <p className="text-sm text-gray-600 -mt-2">
        Customize the banner background with an optional image and colored tint overlay.
        Without an image, the banner will use a solid gradient background.
      </p>

      {/* Background Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Background Image (Optional)
        </label>

        {imageUrl ? (
          <div className="space-y-3">
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300">
              <img
                src={imageUrl}
                alt="Banner background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowMediaPicker(true)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={handleImageRemove}
                className="px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50"
              >
                Remove Image
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowMediaPicker(true)}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-3 hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <ImageIcon className="w-12 h-12 text-gray-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Choose Background Image</p>
              <p className="text-xs text-gray-500 mt-1">Click to select from media library</p>
            </div>
          </button>
        )}
        <p className="text-xs text-gray-500 mt-2">
          If no image is selected, the banner will display with a solid gradient background
        </p>
      </div>

      {/* Gradient Toggle */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={useGradient}
            onChange={handleUseGradientToggle}
            className="w-5 h-5 rounded border-gray-300 text-getfund-primary focus:ring-getfund-primary cursor-pointer"
          />
          <div className="flex items-center gap-2">
            <Blend className="w-4 h-4 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">Use Gradient Tint</span>
          </div>
        </label>
        <p className="text-xs text-gray-500 mt-2 ml-8">
          Enable to create a two-color gradient overlay instead of a solid color
        </p>
      </div>

      {/* Tint Color(s) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span>{useGradient ? 'Gradient Colors' : 'Tint Color'}</span>
          </div>
        </label>

        {/* First Color */}
        <div className="space-y-3">
          <div>
            {useGradient && <label className="text-xs text-gray-600 mb-1 block">Start Color</label>}
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={tintColor}
                onChange={(e) => handleTintColorChange(e.target.value)}
                className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <Input
                type="text"
                value={tintColor}
                onChange={(e) => handleTintColorChange(e.target.value)}
                placeholder="#DC143C"
                className="flex-1 font-mono"
              />
            </div>
          </div>

          {/* Second Color (only for gradient) */}
          {useGradient && (
            <div>
              <label className="text-xs text-gray-600 mb-1 block">End Color</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={tintColor2}
                  onChange={(e) => handleTintColor2Change(e.target.value)}
                  className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  type="text"
                  value={tintColor2}
                  onChange={(e) => handleTintColor2Change(e.target.value)}
                  placeholder="#B22222"
                  className="flex-1 font-mono"
                />
              </div>
            </div>
          )}

          {/* Gradient Direction (only for gradient) */}
          {useGradient && (
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Gradient Direction</label>
              <select
                value={gradientDirection}
                onChange={(e) => handleGradientDirectionChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="to right">Left to Right →</option>
                <option value="to bottom">Top to Bottom ↓</option>
                <option value="to bottom right">Diagonal ↘</option>
                <option value="to top right">Diagonal ↗</option>
              </select>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-2">
          {imageUrl
            ? useGradient
              ? 'This gradient will be overlaid on the background image'
              : 'This color will be overlaid on the background image'
            : useGradient
              ? 'This gradient is used for the background'
              : 'This color is used in the gradient background'
          }
        </p>
      </div>

      {/* Tint Opacity */}
      {imageUrl && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Droplet className="w-4 h-4" />
              <span>Tint Opacity: {tintOpacity}%</span>
            </div>
          </label>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="100"
              value={tintOpacity}
              onChange={(e) => handleTintOpacityChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-getfund-primary"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Transparent (0%)</span>
              <span>Opaque (100%)</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Controls how much the tint color covers the background image.
            Lower values show more of the image.
          </p>
        </div>
      )}

      {/* Text Colors */}
      <div className="border-t border-gray-300 pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span>Text Colors</span>
          </div>
        </label>

        <div className="space-y-3">
          {/* Title Color */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Title Color</label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={titleColor}
                onChange={(e) => handleTitleColorChange(e.target.value)}
                className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <Input
                type="text"
                value={titleColor}
                onChange={(e) => handleTitleColorChange(e.target.value)}
                placeholder="#FFFFFF"
                className="flex-1 font-mono"
              />
            </div>
          </div>

          {/* Subtitle Color */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Subtitle Color</label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={subtitleColor}
                onChange={(e) => handleSubtitleColorChange(e.target.value)}
                className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <Input
                type="text"
                value={subtitleColor}
                onChange={(e) => handleSubtitleColorChange(e.target.value)}
                placeholder="#FCA5A5"
                className="flex-1 font-mono"
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Choose colors for the title and subtitle text that will be displayed on the banner
        </p>
      </div>

      {/* Preview */}
      <div className="border-t border-gray-300 pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
        <div
          className="w-full h-32 rounded-lg relative overflow-hidden"
          style={{
            backgroundImage: imageUrl
              ? `url(${imageUrl})`
              : useGradient
                ? `linear-gradient(${gradientDirection}, ${tintColor}, ${tintColor2})`
                : 'linear-gradient(to bottom right, #DC143C, #B22222)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {imageUrl && (
            <div className="absolute inset-0" style={getTintStyle()}></div>
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4">
            <h1 className="text-2xl font-bold drop-shadow-lg text-center" style={{ color: titleColor }}>
              About Us
            </h1>
            <p className="text-sm drop-shadow-md text-center" style={{ color: subtitleColor }}>
              Supporting the delivery of quality education to Ghanaians from basic to tertiary level
            </p>
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleImageSelect}
        allowUpload={true}
      />
    </div>
  );
};
