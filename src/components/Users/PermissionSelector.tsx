import React from 'react';
import { UserPermissions, UserRole, DEFAULT_PERMISSIONS } from '../../types/auth.types';

interface PermissionSelectorProps {
  permissions: UserPermissions;
  onChange: (permissions: UserPermissions) => void;
  selectedRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  disabled?: boolean;
}

const PERMISSION_LABELS = {
  navigation: {
    dashboard: 'Dashboard',
    news: 'News',
    pages: 'Pages',
    heroSlides: 'Hero Slides',
    mediaLibrary: 'Media Library',
    impactStats: 'Impact Stats',
    campaigns: 'Campaigns',
    teamMembers: 'Team Members',
    reviewQueue: 'Review Queue',
    approvalQueue: 'Approval Queue',
  },
  admin: {
    users: 'Users',
    menuConfig: 'Menu Config',
    footerSettings: 'Footer Settings',
    auditLogs: 'Audit Logs',
    lotteryConfig: 'Lottery Config',
    lotteryEntries: 'Lottery Entries',
    pledges: 'Pledges',
  },
  actions: {
    canPublish: 'Can Publish',
    canReview: 'Can Review',
    canDelete: 'Can Delete',
  },
};

export const PermissionSelector: React.FC<PermissionSelectorProps> = ({
  permissions,
  onChange,
  selectedRole,
  onRoleChange,
  disabled = false,
}) => {
  const handleRoleChange = (role: UserRole) => {
    if (onRoleChange) {
      onRoleChange(role);
    }
    // Apply role template permissions
    onChange(DEFAULT_PERMISSIONS[role]);
  };

  const handlePermissionChange = (
    category: keyof UserPermissions,
    key: string,
    value: boolean
  ) => {
    onChange({
      ...permissions,
      [category]: {
        ...permissions[category],
        [key]: value,
      },
    });
  };

  const handleSelectAll = (category: keyof UserPermissions, value: boolean) => {
    const updatedCategory = Object.keys(permissions[category]).reduce(
      (acc, key) => ({ ...acc, [key]: value }),
      {}
    );
    onChange({
      ...permissions,
      [category]: updatedCategory,
    });
  };

  const getCategoryCheckedCount = (category: keyof UserPermissions) => {
    const categoryPerms = permissions[category];
    const total = Object.keys(categoryPerms).length;
    const checked = Object.values(categoryPerms).filter(Boolean).length;
    return { checked, total };
  };

  const renderCheckbox = (
    category: keyof UserPermissions,
    key: string,
    label: string
  ) => {
    const value = (permissions[category] as Record<string, boolean>)[key];
    return (
      <label
        key={key}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
          value
            ? 'bg-primary-50 border-primary-300 text-primary-700'
            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => handlePermissionChange(category, key, e.target.checked)}
          disabled={disabled}
          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <span className="text-sm font-medium">{label}</span>
      </label>
    );
  };

  const renderCategory = (
    category: keyof UserPermissions,
    title: string,
    icon: React.ReactNode
  ) => {
    const { checked, total } = getCategoryCheckedCount(category);
    const allChecked = checked === total;
    const someChecked = checked > 0 && checked < total;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h4 className="font-semibold text-gray-800">{title}</h4>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {checked}/{total}
            </span>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={allChecked}
              ref={(el) => {
                if (el) el.indeterminate = someChecked;
              }}
              onChange={(e) => handleSelectAll(category, e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            Select All
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {Object.entries(PERMISSION_LABELS[category]).map(([key, label]) =>
            renderCheckbox(category, key, label)
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Role Template Selector */}
      {onRoleChange && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Role Template
          </label>
          <div className="flex flex-wrap gap-2">
            {(['admin', 'creator', 'reviewer', 'approver'] as UserRole[]).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleChange(role)}
                disabled={disabled}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedRole === role
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Selecting a role applies its default permissions. You can then customize individual permissions below.
          </p>
        </div>
      )}

      {/* Navigation Permissions */}
      {renderCategory(
        'navigation',
        'Navigation Access',
        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )}

      {/* Admin Permissions */}
      {renderCategory(
        'admin',
        'Admin Features',
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )}

      {/* Action Permissions */}
      {renderCategory(
        'actions',
        'Actions',
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )}
    </div>
  );
};
