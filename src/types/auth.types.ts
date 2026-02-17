export type UserRole = 'admin' | 'restricted_admin' | 'creator' | 'reviewer' | 'approver';
export type ContentType = 'news' | 'hero_slide';

/** Checks if a role has admin-level access (both full admin and restricted admin) */
export function isAdminRole(role: string | undefined): boolean {
  return role === 'admin' || role === 'restricted_admin';
}

// Granular permissions structure
export interface UserPermissions {
  navigation: {
    dashboard: boolean;
    news: boolean;
    pages: boolean;
    heroSlides: boolean;
    mediaLibrary: boolean;
    impactStats: boolean;
    campaigns: boolean;
    teamMembers: boolean;
    partners: boolean;
    reviewQueue: boolean;
    approvalQueue: boolean;
  };
  admin: {
    users: boolean;
    menuConfig: boolean;
    footerSettings: boolean;
    auditLogs: boolean;
    lotteryConfig: boolean;
    lotteryEntries: boolean;
    pledges: boolean;
    donations: boolean;
  };
  actions: {
    canPublish: boolean;
    canReview: boolean;
    canDelete: boolean;
  };
}

// Default permissions by role
export const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  admin: {
    navigation: {
      dashboard: true, news: true, pages: true, heroSlides: true,
      mediaLibrary: true, impactStats: true, campaigns: true, teamMembers: true,
      partners: true, reviewQueue: true, approvalQueue: true
    },
    admin: {
      users: true, menuConfig: true, footerSettings: true, auditLogs: true,
      lotteryConfig: true, lotteryEntries: true, pledges: true, donations: true
    },
    actions: { canPublish: true, canReview: true, canDelete: true }
  },
  restricted_admin: {
    navigation: {
      dashboard: true, news: true, pages: true, heroSlides: true,
      mediaLibrary: true, impactStats: true, campaigns: true, teamMembers: true,
      partners: true, reviewQueue: true, approvalQueue: true
    },
    admin: {
      users: false, menuConfig: true, footerSettings: true, auditLogs: true,
      lotteryConfig: true, lotteryEntries: true, pledges: true, donations: true
    },
    actions: { canPublish: true, canReview: true, canDelete: true }
  },
  creator: {
    navigation: {
      dashboard: true, news: true, pages: true, heroSlides: true,
      mediaLibrary: true, impactStats: true, campaigns: true, teamMembers: true,
      partners: true, reviewQueue: false, approvalQueue: false
    },
    admin: {
      users: false, menuConfig: false, footerSettings: false, auditLogs: false,
      lotteryConfig: false, lotteryEntries: false, pledges: false, donations: false
    },
    actions: { canPublish: false, canReview: false, canDelete: false }
  },
  reviewer: {
    navigation: {
      dashboard: true, news: true, pages: true, heroSlides: true,
      mediaLibrary: true, impactStats: true, campaigns: true, teamMembers: true,
      partners: true, reviewQueue: true, approvalQueue: false
    },
    admin: {
      users: false, menuConfig: false, footerSettings: false, auditLogs: false,
      lotteryConfig: false, lotteryEntries: false, pledges: false, donations: false
    },
    actions: { canPublish: false, canReview: true, canDelete: false }
  },
  approver: {
    navigation: {
      dashboard: true, news: true, pages: true, heroSlides: true,
      mediaLibrary: true, impactStats: true, campaigns: true, teamMembers: true,
      partners: true, reviewQueue: false, approvalQueue: true
    },
    admin: {
      users: false, menuConfig: false, footerSettings: false, auditLogs: false,
      lotteryConfig: false, lotteryEntries: false, pledges: false, donations: false
    },
    actions: { canPublish: true, canReview: false, canDelete: false }
  }
};

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  permissions?: UserPermissions;
  is_active?: boolean;
  must_change_password?: boolean;
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
  mustChangePassword: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearMustChangePassword: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  hasNavPermission: (key: keyof UserPermissions['navigation']) => boolean;
  hasAdminPermission: (key: keyof UserPermissions['admin']) => boolean;
  hasActionPermission: (key: keyof UserPermissions['actions']) => boolean;
}
