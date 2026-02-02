import React, { useState } from 'react';
import { Button } from './Button';
import MediaPickerModal from '../Media/MediaPickerModal';
import mediaService, { Media } from '../../services/mediaService';
import { Video, Upload, Link, X } from 'lucide-react';

export type VideoProvider = 'youtube' | 'vimeo' | 'upload';

export interface VideoValue {
  url: string;
  provider: VideoProvider;
  thumbnail?: string;
}

interface VideoInputProps {
  label: string;
  value: VideoValue;
  onChange: (value: VideoValue) => void;
  placeholder?: string;
}

// Helper to detect video provider from URL
const detectProvider = (url: string): VideoProvider => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  if (url.includes('vimeo.com')) {
    return 'vimeo';
  }
  return 'upload';
};

// Helper to extract YouTube video ID
const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Helper to extract Vimeo video ID
const getVimeoId = (url: string): string | null => {
  const regExp = /vimeo\.com\/(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

// Get thumbnail URL for video
const getThumbnailUrl = (url: string, provider: VideoProvider): string | undefined => {
  if (provider === 'youtube') {
    const videoId = getYouTubeId(url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }
  // Vimeo thumbnails require an API call, so we don't auto-generate
  return undefined;
};

export const VideoInput: React.FC<VideoInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'https://www.youtube.com/watch?v=...',
}) => {
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [inputMode, setInputMode] = useState<'url' | 'upload'>(
    value.provider === 'upload' && value.url ? 'upload' : 'url'
  );

  const handleUrlChange = (url: string) => {
    const provider = detectProvider(url);
    const thumbnail = getThumbnailUrl(url, provider);
    onChange({ url, provider, thumbnail });
  };

  const handleSelectMedia = (media: Media) => {
    const fullUrl = mediaService.getFullUrl(media.url);
    onChange({
      url: fullUrl,
      provider: 'upload',
      thumbnail: undefined,
    });
    setIsMediaPickerOpen(false);
    setInputMode('upload');
  };

  const handleClear = () => {
    onChange({ url: '', provider: 'youtube', thumbnail: undefined });
    setInputMode('url');
  };

  const renderPreview = () => {
    if (!value.url) return null;

    if (value.provider === 'youtube') {
      const videoId = getYouTubeId(value.url);
      if (videoId) {
        return (
          <div className="mt-3 relative rounded-lg overflow-hidden bg-black aspect-video max-w-md">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="Video preview"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }
    }

    if (value.provider === 'vimeo') {
      const videoId = getVimeoId(value.url);
      if (videoId) {
        return (
          <div className="mt-3 relative rounded-lg overflow-hidden bg-black aspect-video max-w-md">
            <iframe
              src={`https://player.vimeo.com/video/${videoId}`}
              title="Video preview"
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }
    }

    if (value.provider === 'upload') {
      return (
        <div className="mt-3 relative rounded-lg overflow-hidden bg-black aspect-video max-w-md">
          <video
            src={value.url}
            controls
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">{label}</label>

        {/* Mode Toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
              inputMode === 'url'
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Link className="w-4 h-4" />
            YouTube / Vimeo URL
          </button>
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
              inputMode === 'upload'
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload Video
          </button>
        </div>

        {/* URL Input Mode */}
        {inputMode === 'url' && (
          <div className="flex gap-2">
            <input
              type="text"
              value={value.provider !== 'upload' ? value.url : ''}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {value.url && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Upload Mode */}
        {inputMode === 'upload' && (
          <div className="space-y-3">
            {value.provider === 'upload' && value.url ? (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Video className="w-8 h-8 text-blue-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Video uploaded
                  </p>
                  <p className="text-xs text-gray-500 truncate">{value.url}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => setIsMediaPickerOpen(true)}
                    variant="secondary"
                    size="sm"
                  >
                    Change
                  </Button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setIsMediaPickerOpen(true)}
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-600">
                  Click to browse and upload a video
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  MP4, WebM, MOV up to 100MB
                </p>
              </div>
            )}
          </div>
        )}

        {/* Provider Badge */}
        {value.url && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Provider:</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              value.provider === 'youtube'
                ? 'bg-red-100 text-red-700'
                : value.provider === 'vimeo'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {value.provider === 'youtube' && 'YouTube'}
              {value.provider === 'vimeo' && 'Vimeo'}
              {value.provider === 'upload' && 'Uploaded'}
            </span>
          </div>
        )}

        {/* Video Preview */}
        {renderPreview()}
      </div>

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleSelectMedia}
        allowUpload={true}
        mediaType="video"
      />
    </>
  );
};
