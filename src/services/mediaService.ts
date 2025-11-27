import { api } from './api';

export interface Media {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  url: string;
  alt_text: string;
  uploaded_by: string;
  created_at: string;
}

export interface UploadResponse {
  message: string;
  media: Media;
}

const mediaService = {
  // Get all media files
  getAll: async (): Promise<Media[]> => {
    const response = await api.get<{ media: Media[] }>('/media');
    return response.data.media;
  },

  // Get single media file
  getById: async (id: string): Promise<Media> => {
    const response = await api.get<{ media: Media }>(`/media/${id}`);
    return response.data.media;
  },

  // Upload new media file
  upload: async (file: File, altText?: string): Promise<Media> => {
    const formData = new FormData();
    formData.append('file', file);
    if (altText) {
      formData.append('alt_text', altText);
    }

    const response = await api.post<UploadResponse>('/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.media;
  },

  // Update media alt text
  updateAltText: async (id: string, altText: string): Promise<Media> => {
    const response = await api.put<{ media: Media }>(`/media/${id}`, {
      alt_text: altText,
    });
    return response.data.media;
  },

  // Delete media file
  delete: async (id: string): Promise<void> => {
    await api.delete(`/media/${id}`);
  },

  // Get full URL for media
  getFullUrl: (url: string): string => {
    // If URL is already absolute (Blob storage URLs), return as-is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // For relative URLs (local development), prepend base URL
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    // Remove /api from base URL if present
    const apiBase = baseUrl.replace('/api', '');
    return `${apiBase}${url}`;
  },
};

export default mediaService;
