# RBAC & Permissions System - Security Improvements

This document outlines the comprehensive improvements made to the Role-Based Access Control (RBAC) and permissions system in the GETFund CMS frontend application.

## 📋 Table of Contents

- [Overview](#overview)
- [Changes Summary](#changes-summary)
- [What Was Fixed](#what-was-fixed)
- [Implementation Details](#implementation-details)
- [Migration Guide](#migration-guide)
- [Testing](#testing)
- [Security Best Practices](#security-best-practices)

---

## Overview

The RBAC system has been comprehensively audited and improved to enforce permissions consistently across the entire application. These changes ensure that user permissions are properly checked at multiple levels: routing, navigation, and action buttons.

### Key Improvements

✅ **Centralized Permission Enforcement** - All permission checks now use the centralized `hasActionPermission`, `hasNavPermission`, and `hasAdminPermission` functions
✅ **Permission-Based Routing** - All routes now enforce permissions, not just authentication
✅ **Consistent Navigation** - All navigation items properly check permissions
✅ **Action-Level Security** - Delete, publish, and review actions use the permission system
✅ **Complete Permission Coverage** - Added missing permissions for Partners and Donations

---

## Changes Summary

### 1. **Updated Permission Types** ([auth.types.ts](src/types/auth.types.ts))

**Added Missing Permissions:**
- `navigation.partners` - Access to Partners management
- `admin.donations` - Access to Donations dashboard

**Before:**
```typescript
navigation: {
  dashboard: boolean;
  news: boolean;
  // ... partners was missing
}
admin: {
  users: boolean;
  // ... donations was missing
}
```

**After:**
```typescript
navigation: {
  dashboard: boolean;
  news: boolean;
  partners: boolean;  // ✨ NEW
  // ...
}
admin: {
  users: boolean;
  donations: boolean;  // ✨ NEW
}
```

All role defaults (`DEFAULT_PERMISSIONS`) have been updated to include these new permissions.

---

### 2. **Enhanced ProtectedRoute Component** ([ProtectedRoute.tsx](src/components/Layout/ProtectedRoute.tsx))

The `ProtectedRoute` component now supports permission-based routing in addition to role-based access.

**New Props:**
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];                              // Existing
  requiredNavPermission?: keyof UserPermissions['navigation'];  // ✨ NEW
  requiredAdminPermission?: keyof UserPermissions['admin'];     // ✨ NEW
}
```

**Example Usage:**
```tsx
<ProtectedRoute requiredNavPermission="news">
  <NewsListPage />
</ProtectedRoute>

<ProtectedRoute requiredRoles={['admin']} requiredAdminPermission="users">
  <UsersListPage />
</ProtectedRoute>
```

**Benefits:**
- Prevents users from accessing routes via direct URL navigation
- Consistent with navigation menu visibility
- Supports custom user permissions

---

### 3. **Updated Routes** ([App.tsx](src/App.tsx))

All routes now enforce permission checks, closing the security gap where users could bypass navigation restrictions via direct URLs.

**Before:**
```tsx
<Route path="/admin/news" element={
  <ProtectedRoute>  {/* ⚠️ Only checks authentication */}
    <AdminLayout><NewsListPage /></AdminLayout>
  </ProtectedRoute>
}/>
```

**After:**
```tsx
<Route path="/admin/news" element={
  <ProtectedRoute requiredNavPermission="news">  {/* ✅ Checks permission */}
    <AdminLayout><NewsListPage /></AdminLayout>
  </ProtectedRoute>
}/>
```

**Routes Updated:**
- `/admin/dashboard` → `requiredNavPermission="dashboard"`
- `/admin/news` → `requiredNavPermission="news"`
- `/admin/pages` → `requiredNavPermission="pages"`
- `/admin/hero-slides` → `requiredNavPermission="heroSlides"`
- `/admin/media` → `requiredNavPermission="mediaLibrary"`
- `/admin/campaigns` → `requiredNavPermission="campaigns"`
- `/admin/team-members` → `requiredNavPermission="teamMembers"`
- `/admin/partners` → `requiredNavPermission="partners"`
- `/admin/impact-stats` → `requiredNavPermission="impactStats"`
- `/admin/review` → `requiredRoles` + `requiredNavPermission="reviewQueue"`
- `/admin/approval` → `requiredRoles` + `requiredNavPermission="approvalQueue"`
- `/admin/users` → `requiredRoles` + `requiredAdminPermission="users"`
- `/admin/menu` → `requiredRoles` + `requiredAdminPermission="menuConfig"`
- `/admin/footer-settings` → `requiredRoles` + `requiredAdminPermission="footerSettings"`
- `/admin/audit-logs` → `requiredRoles` + `requiredAdminPermission="auditLogs"`
- `/admin/lottery/*` → `requiredRoles` + `requiredAdminPermission`
- `/admin/pledges` → `requiredRoles` + `requiredAdminPermission="pledges"`
- `/admin/donations` → `requiredRoles` + `requiredAdminPermission="donations"`

---

### 4. **Fixed Action Permissions** ([NewsListPage.tsx](src/pages/NewsListPage.tsx), [HeroSlidesListPage.tsx](src/pages/HeroSlidesListPage.tsx))

Action buttons (delete, publish, review) now use the centralized `hasActionPermission` function instead of hardcoded role checks.

**Before:**
```tsx
const canDelete = (item: Content) => {
  if (user?.role === 'admin') return true;  // ⚠️ Hardcoded role check
  if (user?.role === 'creator' && item.created_by === user?.id) {
    return item.status === 'draft';
  }
  return false;
};
```

**After:**
```tsx
const { hasActionPermission } = useAuth();

const canDelete = (item: Content) => {
  // ✅ Check centralized permission
  if (!hasActionPermission('canDelete')) {
    // Creators can delete their own drafts even without explicit permission
    if (user?.role === 'creator' && item.created_by === user?.id && item.status === 'draft') {
      return true;
    }
    return false;
  }

  // Users with delete permission can delete based on ownership and status
  if (user?.role === 'admin') return true;
  if (item.created_by === user?.id) {
    return item.status === 'draft';
  }
  return false;
};
```

**Functions Updated:**
- `canDelete()` - Uses `hasActionPermission('canDelete')`
- `canPublish()` - Uses `hasActionPermission('canPublish')`
- `canUnpublish()` - Uses `hasActionPermission('canPublish')` + admin check
- `canToggleVisibility()` - Uses `hasActionPermission('canPublish')` + admin check

**Benefits:**
- Respects custom user permissions
- Consistent with permission system
- Easier to audit and maintain

---

### 5. **Updated Navigation** ([AdminLayout.tsx](src/components/Layout/AdminLayout.tsx))

**Added Hero Slides Navigation Item:**
```tsx
{
  path: '/admin/hero-slides',
  icon: <ImageIcon />,
  label: 'Hero Slides',
  show: hasNavPermission('heroSlides'),  // ✅ Proper permission check
}
```

**Fixed Inconsistent Permission Checks:**

| Nav Item | Before | After |
|----------|--------|-------|
| Footer Settings | `user?.role === 'admin'` ⚠️ | `hasAdminPermission('footerSettings')` ✅ |
| All Donations | `user?.role === 'admin'` ⚠️ | `hasAdminPermission('donations')` ✅ |
| Partners | `show: true` ⚠️ | `hasNavPermission('partners')` ✅ |

---

### 6. **Testing Utilities** ([permissionTestHelper.ts](src/utils/permissionTestHelper.ts))

Created comprehensive testing utilities for RBAC:

```typescript
// Create test users
const admin = createTestUser('admin');
const creator = createTestUser('creator');

// Test specific permissions
testNavPermission('creator', 'news');  // true
testAdminPermission('creator', 'users');  // false
testActionPermission('approver', 'canPublish');  // true

// Get accessible routes for a role
const routes = getAccessibleRoutes('reviewer');

// Print permission summary
printPermissionSummary('admin');
```

**Available Functions:**
- `createTestUser(role, customPermissions)` - Create mock users
- `testNavPermission(role, permission)` - Test navigation permissions
- `testAdminPermission(role, permission)` - Test admin permissions
- `testActionPermission(role, permission)` - Test action permissions
- `getAccessibleRoutes(role)` - Get all routes a role can access
- `printPermissionSummary(role)` - Print detailed permission info
- `runActionTest(test)` - Test specific actions

---

## What Was Fixed

### 🔴 **Critical Issues Fixed**

1. **Action Permissions Bypassed** ❌ → ✅
   - Components used direct role checks instead of `hasActionPermission()`
   - Custom user permissions were ignored
   - **Impact**: Users with custom permissions couldn't use granted actions

2. **Route Access Not Enforced** ❌ → ✅
   - Users could access routes via direct URL even without permission
   - Only authentication was checked, not permissions
   - **Impact**: Users bypassed navigation restrictions

### 🟡 **Medium Issues Fixed**

3. **Inconsistent Permission Checks** ❌ → ✅
   - Some nav items used `user?.role === 'admin'` instead of permission functions
   - **Impact**: Hard to maintain, custom permissions ignored

4. **Missing Permissions** ❌ → ✅
   - Partners and Donations lacked proper permission definitions
   - **Impact**: Couldn't grant/revoke access granularly

### 🟢 **Minor Issues Fixed**

5. **Missing Hero Slides Navigation** ❌ → ✅
   - Hero Slides routes existed but no navigation item
   - **Impact**: Users had to type URL manually

---

## Migration Guide

### For Developers

**No Breaking Changes** - All changes are backward compatible. Existing code continues to work.

#### Updating Components with Action Logic

If you have components with action permission logic:

**Old Pattern:**
```tsx
const canDelete = () => {
  if (user?.role === 'admin') return true;
  // ...
};
```

**New Pattern:**
```tsx
const { hasActionPermission } = useAuth();

const canDelete = () => {
  if (!hasActionPermission('canDelete')) return false;
  // Additional business logic...
};
```

#### Adding New Routes

When adding new protected routes, include permission checks:

```tsx
<Route path="/admin/new-feature" element={
  <ProtectedRoute
    requiredNavPermission="newFeature"  // Add this
    requiredRoles={['admin']}           // Optional
  >
    <AdminLayout><NewFeaturePage /></AdminLayout>
  </ProtectedRoute>
}/>
```

#### Adding New Navigation Items

```tsx
{
  path: '/admin/new-feature',
  icon: <Icon />,
  label: 'New Feature',
  show: hasNavPermission('newFeature'),  // Use permission check
}
```

### For Backend Developers

The backend should return user permissions in the JWT or `/auth/me` response:

```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "role": "creator",
    "permissions": {
      "navigation": {
        "dashboard": true,
        "news": true,
        "partners": false
      },
      "admin": {
        "users": false,
        "donations": false
      },
      "actions": {
        "canPublish": false,
        "canReview": false,
        "canDelete": false
      }
    }
  }
}
```

If `permissions` is `null` or missing, the frontend automatically falls back to `DEFAULT_PERMISSIONS[role]`.

---

## Testing

### Manual Testing Checklist

Test with each role (`admin`, `creator`, `reviewer`, `approver`):

#### Navigation Tests
- [ ] Only permitted nav items are visible
- [ ] Clicking nav items navigates correctly
- [ ] Hidden nav items are not accessible via URL

#### Route Access Tests
- [ ] Direct URL navigation respects permissions
- [ ] Unauthorized access shows "Access Denied" page
- [ ] Authorized routes load correctly

#### Action Button Tests
- [ ] Delete buttons only show for users with `canDelete` permission
- [ ] Publish buttons only show for users with `canPublish` permission
- [ ] Review actions only show for users with `canReview` permission

### Automated Testing

Use the testing utilities:

```typescript
import { printPermissionSummary, getAccessibleRoutes } from '@/utils/permissionTestHelper';

// Print complete permission info for each role
printPermissionSummary('admin');
printPermissionSummary('creator');
printPermissionSummary('reviewer');
printPermissionSummary('approver');

// Verify route access
console.log('Creator can access:', getAccessibleRoutes('creator'));
```

---

## Security Best Practices

### ✅ **DO**

1. **Always use permission helper functions**
   ```tsx
   const { hasNavPermission, hasAdminPermission, hasActionPermission } = useAuth();
   if (hasActionPermission('canDelete')) { /* ... */ }
   ```

2. **Add permission checks to new routes**
   ```tsx
   <ProtectedRoute requiredNavPermission="feature">
   ```

3. **Check permissions before showing actions**
   ```tsx
   {hasActionPermission('canPublish') && <PublishButton />}
   ```

4. **Use role checks only when truly role-specific**
   ```tsx
   // OK: Only admins can unpublish, regardless of permissions
   if (user?.role === 'admin' && hasActionPermission('canPublish')) {
     return <UnpublishButton />;
   }
   ```

### ❌ **DON'T**

1. **Don't hardcode role checks for permissions**
   ```tsx
   // ❌ BAD
   if (user?.role === 'admin') { /* show delete button */ }

   // ✅ GOOD
   if (hasActionPermission('canDelete')) { /* show delete button */ }
   ```

2. **Don't skip permission checks on routes**
   ```tsx
   // ❌ BAD
   <ProtectedRoute><FeaturePage /></ProtectedRoute>

   // ✅ GOOD
   <ProtectedRoute requiredNavPermission="feature"><FeaturePage /></ProtectedRoute>
   ```

3. **Don't forget to update navigation visibility**
   ```tsx
   // ❌ BAD
   show: true

   // ✅ GOOD
   show: hasNavPermission('feature')
   ```

---

## Appendix

### Permission Matrix

| Role | canPublish | canReview | canDelete | Users Admin | Audit Logs |
|------|-----------|-----------|-----------|-------------|------------|
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Creator** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Reviewer** | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Approver** | ✅ | ❌ | ❌ | ❌ | ❌ |

### Files Changed

| File | Changes |
|------|---------|
| `src/types/auth.types.ts` | Added `partners` and `donations` permissions |
| `src/components/Layout/ProtectedRoute.tsx` | Added permission-based routing props |
| `src/App.tsx` | Added permission checks to all routes |
| `src/pages/NewsListPage.tsx` | Updated action permissions to use `hasActionPermission` |
| `src/pages/HeroSlidesListPage.tsx` | Updated action permissions to use `hasActionPermission` |
| `src/components/Layout/AdminLayout.tsx` | Added Hero Slides nav, fixed inconsistent checks |
| `src/utils/permissionTestHelper.ts` | Created comprehensive testing utilities |

---

## Questions?

If you have questions about the RBAC system or need help implementing permissions for new features, refer to this document or review the updated code examples above.

**Security Note:** Remember that frontend permission checks are for UX only. Always enforce permissions on the backend API to prevent unauthorized access.
