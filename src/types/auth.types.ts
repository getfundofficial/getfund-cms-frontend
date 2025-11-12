export type UserRole = 'admin' | 'creator' | 'reviewer' | 'approver';
export type ContentType = 'news' | 'hero_slide';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  permissions: ContentType[];
  is_active?: boolean;
  created_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  hasPermission: (contentType: ContentType) => boolean;
}
