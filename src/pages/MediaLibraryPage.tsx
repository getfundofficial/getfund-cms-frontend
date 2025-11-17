import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import mediaService, { Media } from '../services/mediaService';
import ImageUploader from '../components/Media/ImageUploader';

const MediaLibraryPage: React.FC = () => {
  const { user } = useAuth();
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [editingAltText, setEditingAltText] = useState<string>('');

  useEffect(() => {
    loadMedia();
  }, []);

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
  };

  const handleDelete = async (mediaItem: Media) => {
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

  const handleUpdateAltText = async () => {
    if (!selectedMedia) return;

    try {
      const updated = await mediaService.updateAltText(
        selectedMedia.id,
        editingAltText
      );

      setMedia(media.map((m) => (m.id === updated.id ? updated : m)));
      setSelectedMedia(updated);
      alert('Alt text updated successfully');
    } catch (err: any) {
      alert('Failed to update alt text');
      console.error('Error updating alt text:', err);
    }
  };

  const handleCopyUrl = (url: string) => {
    const fullUrl = mediaService.getFullUrl(url);
    navigator.clipboard.writeText(fullUrl);
    alert('URL copied to clipboard!');
  };

  const filteredMedia = media.filter((m) =>
    m.original_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your uploaded images
              </p>
            </div>
            <button
              onClick={() => setShowUploader(!showUploader)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {showUploader ? 'Cancel Upload' : 'Upload New'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showUploader ? (
          /* Upload Section */
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Upload New Image</h2>
            <ImageUploader
              onUploadSuccess={handleUploadSuccess}
              onUploadError={(error) => alert(error)}
            />
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search images by filename..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Total: {media.length} image{media.length !== 1 ? 's' : ''}
                </span>
                {searchTerm && (
                  <span>
                    Showing: {filteredMedia.length} result
                    {filteredMedia.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {loading ? (
              /* Loading */
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
              </div>
            ) : error ? (
              /* Error */
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
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
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
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
                <p className="mt-4 text-lg text-gray-600">
                  {searchTerm ? 'No images found' : 'No images uploaded yet'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowUploader(true)}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Upload Your First Image
                  </button>
                )}
              </div>
            ) : (
              /* Media Grid and Details */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Media Grid */}
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filteredMedia.map((mediaItem) => (
                      <div
                        key={mediaItem.id}
                        className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          selectedMedia?.id === mediaItem.id
                            ? 'border-blue-600 ring-2 ring-blue-600'
                            : 'border-transparent hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setSelectedMedia(mediaItem);
                          setEditingAltText(mediaItem.alt_text || '');
                        }}
                      >
                        {/* Image */}
                        <div className="aspect-square bg-gray-100">
                          <img
                            src={mediaService.getFullUrl(mediaItem.url)}
                            alt={mediaItem.alt_text || mediaItem.original_name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-end">
                          <div className="w-full p-2 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs truncate">
                              {mediaItem.original_name}
                            </p>
                          </div>
                        </div>

                        {/* Selected Indicator */}
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
                </div>

                {/* Details Panel */}
                <div className="lg:col-span-1">
                  {selectedMedia ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                      <h3 className="text-lg font-semibold mb-4">Image Details</h3>

                      {/* Preview */}
                      <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={mediaService.getFullUrl(selectedMedia.url)}
                          alt={selectedMedia.alt_text || selectedMedia.original_name}
                          className="w-full"
                        />
                      </div>

                      {/* Info */}
                      <div className="space-y-3 text-sm">
                        <div>
                          <label className="block text-gray-600 mb-1">
                            Filename
                          </label>
                          <p className="font-medium text-gray-900 break-all">
                            {selectedMedia.original_name}
                          </p>
                        </div>

                        <div>
                          <label className="block text-gray-600 mb-1">
                            File Size
                          </label>
                          <p className="font-medium text-gray-900">
                            {formatFileSize(selectedMedia.size_bytes)}
                          </p>
                        </div>

                        <div>
                          <label className="block text-gray-600 mb-1">
                            Type
                          </label>
                          <p className="font-medium text-gray-900">
                            {selectedMedia.mime_type}
                          </p>
                        </div>

                        <div>
                          <label className="block text-gray-600 mb-1">
                            Uploaded
                          </label>
                          <p className="font-medium text-gray-900">
                            {formatDate(selectedMedia.created_at)}
                          </p>
                        </div>

                        <div>
                          <label className="block text-gray-600 mb-1">URL</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={mediaService.getFullUrl(selectedMedia.url)}
                              readOnly
                              className="flex-1 px-2 py-1 text-xs bg-gray-50 border border-gray-300 rounded"
                            />
                            <button
                              onClick={() => handleCopyUrl(selectedMedia.url)}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium"
                            >
                              Copy
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-600 mb-1">
                            Alt Text (for accessibility)
                          </label>
                          <textarea
                            value={editingAltText}
                            onChange={(e) => setEditingAltText(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="Describe this image..."
                          />
                          <button
                            onClick={handleUpdateAltText}
                            className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Update Alt Text
                          </button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-6 pt-6 border-t">
                        <button
                          onClick={() => handleDelete(selectedMedia)}
                          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Delete Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
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
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="mt-4 text-gray-600">
                        Select an image to view details
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MediaLibraryPage;
