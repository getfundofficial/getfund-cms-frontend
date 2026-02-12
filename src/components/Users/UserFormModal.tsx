import React, { useState, useEffect } from 'react';
import userService, { User, UserRole, CreateUserData } from '../../services/userService';
import { UserPermissions, DEFAULT_PERMISSIONS } from '../../types/auth.types';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';
import { PermissionSelector } from './PermissionSelector';
import { PagePermissionSelector } from './PagePermissionSelector';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: User | null;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user,
}) => {
  const isEditMode = !!user;

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'creator' as UserRole,
    password: '',
    is_active: true,
  });

  const [permissions, setPermissions] = useState<UserPermissions>(DEFAULT_PERMISSIONS.creator);
  const [editablePageIds, setEditablePageIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [showPermissions, setShowPermissions] = useState(false);
  const [showPagePermissions, setShowPagePermissions] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        password: '',
        is_active: user.is_active,
      });
      setPermissions(user.permissions || DEFAULT_PERMISSIONS[user.role]);
      // Load existing page permissions
      loadUserPagePermissions(user.id);
    } else {
      setFormData({
        email: '',
        full_name: '',
        role: 'creator',
        password: '',
        is_active: true,
      });
      setPermissions(DEFAULT_PERMISSIONS.creator);
      setEditablePageIds([]);
    }
    setError(null);
    setGeneratedPassword(null);
    setShowPermissions(false);
    setShowPagePermissions(false);
  }, [user, isOpen]);

  const loadUserPagePermissions = async (userId: string) => {
    try {
      const pagePerms = await userService.getUserPagePermissions(userId);
      const selectedIds = pagePerms
        .filter(p => p.has_edit_permission)
        .map(p => p.page_id);
      setEditablePageIds(selectedIds);
    } catch (err) {
      console.error('Error loading page permissions:', err);
      setEditablePageIds([]);
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData({ ...formData, role });
    setPermissions(DEFAULT_PERMISSIONS[role]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      let userId: string;

      if (isEditMode && user) {
        await userService.update(user.id, {
          full_name: formData.full_name,
          role: formData.role,
          is_active: formData.is_active,
          permissions,
          ...(formData.password ? { password: formData.password } : {}),
        });
        userId = user.id;

        // Sync page permissions for existing user
        await userService.syncUserPagePermissions(userId, editablePageIds);
      } else {
        const createData: CreateUserData = {
          email: formData.email,
          full_name: formData.full_name,
          role: formData.role,
          permissions,
          ...(formData.password ? { password: formData.password } : {}),
        };

        const response = await userService.create(createData);
        userId = response.user.id;

        // Sync page permissions for new user
        if (editablePageIds.length > 0) {
          await userService.syncUserPagePermissions(userId, editablePageIds);
        }

        if (response.generatedPassword) {
          setGeneratedPassword(response.generatedPassword);
          return;
        }
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save user');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyPassword = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      alert('Password copied to clipboard!');
    }
  };

  const handleCloseWithPassword = () => {
    setGeneratedPassword(null);
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={generatedPassword ? undefined : onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative bg-white rounded-lg shadow-xl w-full transition-all ${
            showPermissions || showPagePermissions ? 'max-w-3xl' : 'max-w-md'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {generatedPassword ? (
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-center mb-2">User Created Successfully!</h3>
              <p className="text-sm text-gray-600 text-center mb-4">
                A temporary password has been generated. Please copy it and share it with the user securely.
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Generated Password
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generatedPassword}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded font-mono text-sm"
                  />
                  <button
                    onClick={handleCopyPassword}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-yellow-800">
                  <strong>Important:</strong> This password will not be shown again. Make sure to copy it before closing this window.
                </p>
              </div>

              <button
                onClick={handleCloseWithPassword}
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                I've Copied the Password
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  {isEditMode ? 'Edit User' : 'Create New User'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={isSaving}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Input
                  type="email"
                  label="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isEditMode}
                  placeholder="user@getfund.gov.gh"
                />

                <Input
                  type="text"
                  label="Full Name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                  placeholder="John Doe"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="creator">Creator</option>
                    <option value="reviewer">Reviewer</option>
                    <option value="approver">Approver</option>
                    <option value="restricted_admin">Restricted Admin</option>
                    <option value="admin">Admin</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.role === 'creator' && 'Can create and edit drafts'}
                    {formData.role === 'reviewer' && 'Can review and approve content'}
                    {formData.role === 'approver' && 'Can publish approved content'}
                    {formData.role === 'restricted_admin' && 'Admin access with configurable permissions'}
                    {formData.role === 'admin' && 'Full system access'}
                  </p>
                </div>

                {isEditMode && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                      Active (user can login)
                    </label>
                  </div>
                )}

                <Input
                  type="password"
                  label={isEditMode ? "New Password (optional)" : "Password (optional)"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={isEditMode ? "Leave blank to keep current" : "Leave blank to auto-generate"}
                  helperText={
                    isEditMode
                      ? "Only enter if you want to change the password"
                      : "If left blank, a secure password will be generated automatically"
                  }
                />

                {/* Permissions Toggle */}
                <div className="border-t pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPermissions(!showPermissions)}
                    className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform ${showPermissions ? 'rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {showPermissions ? 'Hide' : 'Customize'} Permissions
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    Click to customize individual permissions for this user
                  </p>
                </div>

                {/* Permission Selector */}
                {showPermissions && (
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <PermissionSelector
                      permissions={permissions}
                      onChange={setPermissions}
                      disabled={isSaving}
                    />
                  </div>
                )}

                {/* Page Permissions Toggle */}
                <div className="border-t pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPagePermissions(!showPagePermissions)}
                    className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform ${showPagePermissions ? 'rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {showPagePermissions ? 'Hide' : 'Configure'} Page Edit Permissions
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    Select which pages this user can edit
                  </p>
                </div>

                {/* Page Permission Selector */}
                {showPagePermissions && (
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <PagePermissionSelector
                      selectedPageIds={editablePageIds}
                      onChange={setEditablePageIds}
                      disabled={isSaving}
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSaving}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {isEditMode ? 'Update User' : 'Create User'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;
