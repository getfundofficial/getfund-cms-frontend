import { api } from './api';

export interface Page {
  id: string;
  slug: string;
  title: string;
  meta_title?: string;
  meta_description?: string;
  is_active: boolean;
  layout_template: string;
  layout_id?: string | null;
  layout_name?: string;
  layout_display_name?: string;
  layout_structure?: any;
  template_variables?: Record<string, any>;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  creator_name?: string;
  updater_name?: string;
  section_count?: number;
  sections?: PageSection[];
}

export interface PageSection {
  id: string;
  page_id: string;
  section_key: string;
  section_type: SectionType;
  title?: string;
  content: SectionContent;
  order_index: number;
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  creator_name?: string;
  updater_name?: string;
}

export type SectionType = 'text' | 'html' | 'image' | 'gallery' | 'video' | 'stats' | 'hero' | 'cta' | 'page_content';

export type SectionContent =
  | TextSectionContent
  | ImageSectionContent
  | GallerySectionContent
  | VideoSectionContent
  | StatsSectionContent
  | HeroSectionContent
  | CTASectionContent;

export interface TextSectionContent {
  body: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface ImageSectionContent {
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface GallerySectionContent {
  images: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
  layout?: 'grid' | 'masonry' | 'carousel';
}

export interface VideoSectionContent {
  url: string;
  provider?: 'youtube' | 'vimeo' | 'upload';
  thumbnail?: string;
  caption?: string;
}

export interface StatsSectionContent {
  stats: Array<{
    value: string;
    label: string;
    icon?: string;
  }>;
}

export interface HeroSectionContent {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface CTASectionContent {
  text: string;
  buttonText: string;
  buttonLink: string;
  style?: 'primary' | 'secondary';
}

export interface PagePermission {
  id: string;
  page_id?: string;
  section_id?: string;
  user_id?: string;
  role?: string;
  permission_type: 'view' | 'edit' | 'publish';
  created_at: string;
  user_name?: string;
  user_email?: string;
  section_key?: string;
  section_title?: string;
}

export const pageService = {
  // Pages
  async getAll(): Promise<Page[]> {
    const response = await api.get('/pages');
    return response.data.pages;
  },

  async getBySlug(slug: string): Promise<Page> {
    const response = await api.get(`/pages/${slug}`);
    return response.data.page;
  },

  async create(data: {
    slug: string;
    title: string;
    meta_title?: string;
    meta_description?: string;
    layout_template?: string;
    is_active?: boolean;
  }): Promise<Page> {
    const response = await api.post('/pages', data);
    return response.data.page;
  },

  async update(
    slug: string,
    data: {
      title?: string;
      meta_title?: string;
      meta_description?: string;
      layout_template?: string;
    }
  ): Promise<Page> {
    const response = await api.put(`/pages/${slug}`, data);
    return response.data.page;
  },

  async delete(slug: string): Promise<void> {
    await api.delete(`/pages/${slug}`);
  },

  async publish(slug: string): Promise<Page> {
    const response = await api.post(`/pages/${slug}/publish`);
    return response.data.page;
  },

  async unpublish(slug: string): Promise<Page> {
    const response = await api.post(`/pages/${slug}/unpublish`);
    return response.data.page;
  },

  // Sections
  async getSections(slug: string): Promise<PageSection[]> {
    const response = await api.get(`/pages/${slug}/sections`);
    return response.data.sections;
  },

  async getSection(slug: string, sectionKey: string): Promise<PageSection> {
    const response = await api.get(`/pages/${slug}/sections/${sectionKey}`);
    return response.data.section;
  },

  async createSection(
    slug: string,
    data: {
      section_key: string;
      section_type: SectionType;
      title?: string;
      content?: SectionContent;
      order_index?: number;
      is_active?: boolean;
    }
  ): Promise<PageSection> {
    const response = await api.post(`/pages/${slug}/sections`, data);
    return response.data.section;
  },

  async updateSection(
    slug: string,
    sectionKey: string,
    data: {
      title?: string;
      content?: SectionContent;
      is_active?: boolean;
      order_index?: number;
    }
  ): Promise<PageSection> {
    const response = await api.put(`/pages/${slug}/sections/${sectionKey}`, data);
    return response.data.section;
  },

  async deleteSection(slug: string, sectionKey: string): Promise<void> {
    await api.delete(`/pages/${slug}/sections/${sectionKey}`);
  },

  // Permissions
  async getPermissions(slug: string): Promise<PagePermission[]> {
    const response = await api.get(`/pages/${slug}/permissions`);
    return response.data.permissions;
  },

  async grantPermission(
    slug: string,
    data: {
      section_key?: string;
      user_id?: string;
      role?: string;
      permission_type: 'view' | 'edit' | 'publish';
    }
  ): Promise<PagePermission> {
    const response = await api.post(`/pages/${slug}/permissions`, data);
    return response.data.permission;
  },

  async revokePermission(permissionId: string): Promise<void> {
    await api.delete(`/permissions/${permissionId}`);
  },
};
