/**
 * Permission Testing Utilities
 *
 * This file provides helper functions for testing RBAC permissions
 * in the CMS frontend application.
 */

import { UserRole, UserPermissions, DEFAULT_PERMISSIONS } from '../types/auth.types';

/**
 * Test user factory for creating mock users with specific roles
 */
export const createTestUser = (role: UserRole, customPermissions?: Partial<UserPermissions>) => {
  const basePermissions = DEFAULT_PERMISSIONS[role];

  return {
    id: 'test-user-id',
    email: `${role}@test.com`,
    full_name: `Test ${role.charAt(0).toUpperCase() + role.slice(1)}`,
    role,
    permissions: customPermissions ? { ...basePermissions, ...customPermissions } : basePermissions,
    is_active: true,
    created_at: new Date().toISOString(),
  };
};

/**
 * Check if a user has specific navigation permission
 */
export const testNavPermission = (
  role: UserRole,
  permission: keyof UserPermissions['navigation'],
  customPermissions?: Partial<UserPermissions>
): boolean => {
  const user = createTestUser(role, customPermissions);
  return user.permissions?.navigation?.[permission] ?? false;
};

/**
 * Check if a user has specific admin permission
 */
export const testAdminPermission = (
  role: UserRole,
  permission: keyof UserPermissions['admin'],
  customPermissions?: Partial<UserPermissions>
): boolean => {
  const user = createTestUser(role, customPermissions);
  return user.permissions?.admin?.[permission] ?? false;
};

/**
 * Check if a user has specific action permission
 */
export const testActionPermission = (
  role: UserRole,
  permission: keyof UserPermissions['actions'],
  customPermissions?: Partial<UserPermissions>
): boolean => {
  const user = createTestUser(role, customPermissions);
  return user.permissions?.actions?.[permission] ?? false;
};

/**
 * Get all routes a specific role can access
 */
export const getAccessibleRoutes = (role: UserRole): string[] => {
  const permissions = DEFAULT_PERMISSIONS[role];
  const routes: string[] = [];

  // Navigation permissions map to routes
  if (permissions.navigation.dashboard) routes.push('/admin/dashboard');
  if (permissions.navigation.news) routes.push('/admin/news');
  if (permissions.navigation.pages) routes.push('/admin/pages');
  if (permissions.navigation.heroSlides) routes.push('/admin/hero-slides');
  if (permissions.navigation.mediaLibrary) routes.push('/admin/media');
  if (permissions.navigation.impactStats) routes.push('/admin/impact-stats');
  if (permissions.navigation.campaigns) routes.push('/admin/campaigns');
  if (permissions.navigation.teamMembers) routes.push('/admin/team-members');
  if (permissions.navigation.partners) routes.push('/admin/partners');
  if (permissions.navigation.reviewQueue) routes.push('/admin/review');
  if (permissions.navigation.approvalQueue) routes.push('/admin/approval');

  // Admin permissions map to routes
  if (permissions.admin.users) routes.push('/admin/users');
  if (permissions.admin.menuConfig) routes.push('/admin/menu');
  if (permissions.admin.footerSettings) routes.push('/admin/footer-settings');
  if (permissions.admin.auditLogs) routes.push('/admin/audit-logs');
  if (permissions.admin.lotteryConfig) routes.push('/admin/lottery/config');
  if (permissions.admin.lotteryEntries) routes.push('/admin/lottery/entries');
  if (permissions.admin.pledges) routes.push('/admin/pledges');
  if (permissions.admin.donations) routes.push('/admin/donations');

  return routes;
};

/**
 * Print permission summary for a role (useful for debugging)
 */
export const printPermissionSummary = (role: UserRole): void => {
  const permissions = DEFAULT_PERMISSIONS[role];

  console.log(`\n========== Permission Summary for ${role.toUpperCase()} ==========`);

  console.log('\nNavigation Permissions:');
  Object.entries(permissions.navigation).forEach(([key, value]) => {
    console.log(`  ${key}: ${value ? '✓' : '✗'}`);
  });

  console.log('\nAdmin Permissions:');
  Object.entries(permissions.admin).forEach(([key, value]) => {
    console.log(`  ${key}: ${value ? '✓' : '✗'}`);
  });

  console.log('\nAction Permissions:');
  Object.entries(permissions.actions).forEach(([key, value]) => {
    console.log(`  ${key}: ${value ? '✓' : '✗'}`);
  });

  console.log(`\nAccessible Routes (${getAccessibleRoutes(role).length}):`);
  getAccessibleRoutes(role).forEach(route => {
    console.log(`  - ${route}`);
  });

  console.log('==================================================\n');
};

/**
 * Test if a role can perform a specific action
 */
export interface ActionTest {
  description: string;
  role: UserRole;
  action: 'view' | 'create' | 'edit' | 'delete' | 'publish' | 'review';
  resource: string;
  expected: boolean;
}

export const runActionTest = (test: ActionTest): boolean => {
  const { role, action, resource } = test;
  const permissions = DEFAULT_PERMISSIONS[role];

  // Determine which permission to check based on action and resource
  if (action === 'publish' && permissions.actions.canPublish) return true;
  if (action === 'review' && permissions.actions.canReview) return true;
  if (action === 'delete' && permissions.actions.canDelete) return true;

  // For view/create/edit, check navigation or admin permissions
  const navKey = resource as keyof UserPermissions['navigation'];
  const adminKey = resource as keyof UserPermissions['admin'];

  if (navKey in permissions.navigation) {
    return permissions.navigation[navKey];
  }

  if (adminKey in permissions.admin) {
    return permissions.admin[adminKey];
  }

  return false;
};
