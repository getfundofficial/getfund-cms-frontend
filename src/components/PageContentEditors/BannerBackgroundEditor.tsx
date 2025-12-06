import React, { useState } from 'react';
import { Image as ImageIcon, Palette, Droplet } from 'lucide-react';
import { Input } from '../Common/Input';
import MediaPickerModal from '../Media/MediaPickerModal';
import { Media } from '../../services/mediaService';

interface BannerBackground {
  imageUrl?: string | null;
  tintColor?: string;
  tintOpacity?: number;
}

interface BannerBackgroundEditorProps {
  value: BannerBackground;
  onChange: (value: BannerBackground) => void;
}

/**
 * Reusable component for editing banner background settings
 * Supports background image, tint color, and tint opacity
 */
export const BannerBackgroundEditor: React.FC<BannerBackgroundEditorProps> = ({
  value,
  onChange,
}) => {
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const bannerBg = value || {};
  const imageUrl = bannerBg.imageUrl || null;
  const tintColor = bannerBg.tintColor || '#DC143C';
  const tintOpacity = bannerBg.tintOpacity ?? 50;

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

  const handleTintOpacityChange = (opacity: number) => {
    // Clamp between 0 and 100
    const clampedOpacity = Math.min(100, Math.max(0, opacity));
    onChange({
      ...bannerBg,
      tintOpacity: clampedOpacity,
    });
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

      {/* Tint Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span>Tint Color</span>
          </div>
        </label>
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
        <p className="text-xs text-gray-500 mt-2">
          {imageUrl
            ? 'This color will be overlaid on the background image'
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

      {/* Preview */}
      <div className="border-t border-gray-300 pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
        <div
          className="w-full h-32 rounded-lg relative overflow-hidden"
          style={{
            backgroundImage: imageUrl ? `url(${imageUrl})` : 'linear-gradient(to bottom right, #DC143C, #B22222)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {imageUrl && (
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: tintColor,
                opacity: tintOpacity / 100,
              }}
            ></div>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white text-xl font-bold drop-shadow-lg">Sample Banner Text</p>
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
