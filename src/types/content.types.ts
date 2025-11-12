export type ContentType = 'news' | 'hero_slide';

export type WorkflowStatus =
  | 'draft'
  | 'in_review'
  | 'changes_requested'
  | 'approved'
  | 'published';

export interface HeroSlideMetaData {
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  order?: number;
}

export interface Content {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  excerpt?: string;
  body?: string;
  author?: string;
  category?: string;
  featured_image_url?: string;
  meta_data?: HeroSlideMetaData;
  status: WorkflowStatus;
  created_by: string;
  reviewed_by?: string;
  approved_by?: string;
  published_by?: string;
  review_notes?: string;
  created_at: string;
  updated_at: string;
  submitted_for_review_at?: string;
  reviewed_at?: string;
  approved_at?: string;
  published_at?: string;
  creator_name?: string;
  reviewer_name?: string;
  approver_name?: string;
  publisher_name?: string;
}

export interface DashboardStats {
  draft: number;
  in_review: number;
  changes_requested: number;
  approved: number;
  published: number;
}
