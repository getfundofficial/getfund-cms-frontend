import React, { useState } from 'react';
import { Button } from './Button';
import MediaPickerModal from '../Media/MediaPickerModal';
import mediaService, { Media } from '../../services/mediaService';

interface ImageInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const ImageInput: React.FC<ImageInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '/images/placeholder.jpg',
}) => {
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const handleSelectImage = (media: Media) => {
    onChange(mediaService.getFullUrl(media.url));
    setIsMediaPickerOpen(false);
  };

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            type="button"
            onClick={() => setIsMediaPickerOpen(true)}
            variant="secondary"
          >
            Browse
          </Button>
        </div>
      </div>

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleSelectImage}
        allowUpload={true}
      />
    </>
  );
};
