import React, { useState, useEffect } from 'react';
import mediaService, { Media } from '../../services/mediaService';
import ImageUploader from './ImageUploader';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: Media) => void;
  allowUpload?: boolean;
  mediaType?: 'image' | 'video' | 'all';
}

const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  allowUpload = true,
  mediaType = 'image',
}) => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  const loadMedia = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedMedia = await mediaService.getAll();
      setMedia(fetchedMedia);
    } catch (err: any) {
      setError('Failed to load media');
      console.error('Error loading media:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newMedia: Media) => {
    setMedia([newMedia, ...media]);
    setShowUploader(false);
    setSelectedMedia(newMedia);
  };

  const handleSelect = (mediaItem: Media) => {
    if (selectedMedia?.id === mediaItem.id) {
      setSelectedMedia(null);
    } else {
      setSelectedMedia(mediaItem);
    }
  };

  const handleConfirm = () => {
    if (selectedMedia) {
      onSelect(selectedMedia);
      onClose();
      setSelectedMedia(null);
    }
  };

  const handleDelete = async (mediaItem: Media, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm(`Delete "${mediaItem.original_name}"?`)) {
      return;
    }

    try {
      await mediaService.delete(mediaItem.id);
      setMedia(media.filter((m) => m.id !== mediaItem.id));

      if (selectedMedia?.id === mediaItem.id) {
        setSelectedMedia(null);
      }
    } catch (err: any) {
      alert('Failed to delete media');
      console.error('Error deleting media:', err);
    }
  };

  const filteredMedia = media.filter((m) => {
    // Filter by search term
    const matchesSearch = m.original_name.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by media type
    let matchesType = true;
    if (mediaType === 'image') {
      matchesType = m.mime_type.startsWith('image/');
    } else if (mediaType === 'video') {
      matchesType = m.mime_type.startsWith('video/');
    }

    return matchesSearch && matchesType;
  });

  const mediaTypeLabel = mediaType === 'video' ? 'Video' : mediaType === 'all' ? 'Media' : 'Image';
  const uploaderAccept = mediaType === 'video'
    ? 'video/mp4,video/webm,video/quicktime,video/x-msvideo'
    : 'image/jpeg,image/jpg,image/png,image/gif,image/webp';
  const uploaderMaxSize = mediaType === 'video' ? 100 : 5;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              {showUploader ? `Upload ${mediaTypeLabel}` : `Select ${mediaTypeLabel}`}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Toolbar */}
          {!showUploader && (
            <div className="p-4 border-b space-y-4">
              {/* Search and Upload Button */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={`Search ${mediaTypeLabel.toLowerCase()}s...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {allowUpload && (
                  <button
                    onClick={() => setShowUploader(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Upload New
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {showUploader ? (
              /* Upload View */
              <div className="space-y-4">
                <ImageUploader
                  onUploadSuccess={handleUploadSuccess}
                  onUploadError={(error) => alert(error)}
                  accept={uploaderAccept}
                  maxSizeMB={uploaderMaxSize}
                />
                <button
                  onClick={() => setShowUploader(false)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : loading ? (
              /* Loading */
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
              </div>
            ) : error ? (
              /* Error */
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={loadMedia}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : filteredMedia.length === 0 ? (
              /* Empty State */
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {mediaType === 'video' ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  )}
                </svg>
                <p className="mt-4 text-gray-600">
                  {searchTerm ? `No ${mediaTypeLabel.toLowerCase()}s found` : `No ${mediaTypeLabel.toLowerCase()}s uploaded yet`}
                </p>
                {allowUpload && !searchTerm && (
                  <button
                    onClick={() => setShowUploader(true)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Upload First {mediaTypeLabel}
                  </button>
                )}
              </div>
            ) : (
              /* Media Grid */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredMedia.map((mediaItem) => (
                  <div
                    key={mediaItem.id}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedMedia?.id === mediaItem.id
                        ? 'border-blue-600 ring-2 ring-blue-600'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => handleSelect(mediaItem)}
                  >
                    {/* Media Preview */}
                    <div className="aspect-square bg-gray-100">
                      {mediaItem.mime_type.startsWith('video/') ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800 relative">
                          <svg className="w-12 h-12 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                            Video
                          </span>
                        </div>
                      ) : (
                        <img
                          src={mediaService.getFullUrl(mediaItem.url)}
                          alt={mediaItem.alt_text || mediaItem.original_name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-end">
                      <div className="w-full p-2 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs truncate">
                          {mediaItem.original_name}
                        </p>
                        <p className="text-gray-300 text-xs">
                          {formatFileSize(mediaItem.size_bytes)}
                        </p>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDelete(mediaItem, e)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>

                    {/* Selected Checkmark */}
                    {selectedMedia?.id === mediaItem.id && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white rounded-full p-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {!showUploader && (
            <div className="flex items-center justify-between p-6 border-t bg-gray-50">
              <div className="text-sm text-gray-600">
                {selectedMedia ? (
                  <>
                    <span className="font-medium">
                      {selectedMedia.original_name}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{formatFileSize(selectedMedia.size_bytes)}</span>
                  </>
                ) : (
                  `${filteredMedia.length} ${mediaTypeLabel.toLowerCase()}${
                    filteredMedia.length !== 1 ? 's' : ''
                  }`
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedMedia}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    selectedMedia
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Select {mediaTypeLabel}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaPickerModal;
