import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Common/Button';
import { pageService, PagePermission } from '../services/pageService';
import { api } from '../services/api';

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export const PagePermissionsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<PagePermission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [grantType, setGrantType] = useState<'user' | 'role'>('role');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('content_creator');
  const [permissionType, setPermissionType] = useState<'view' | 'edit' | 'publish'>('edit');

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/admin/pages');
      return;
    }
    loadPermissions();
    loadUsers();
  }, [slug, user, navigate]);

  const loadPermissions = async () => {
    if (!slug) return;

    try {
      setIsLoading(true);
      setError(''); // Clear previous errors
      const data = await pageService.getPermissions(slug);
      setPermissions(data || []);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to load permissions';
      setError(errorMessage);
      console.error('Error loading permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users || []);
    } catch (error: any) {
      console.error('Failed to load users:', error);
    }
  };

  const handleGrantPermission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;

    try {
      const data: any = {
        permission_type: permissionType,
      };

      if (grantType === 'user') {
        data.user_id = selectedUser;
      } else {
        data.role = selectedRole;
      }

      await pageService.grantPermission(slug, data);

      setShowAddForm(false);
      setSelectedUser('');
      setSelectedRole('content_creator');
      setPermissionType('edit');
      loadPermissions();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message || 'Failed to grant permission');
    }
  };

  const handleDeletePermission = async (permissionId: string) => {
    if (!confirm('Remove this permission?')) return;

    try {
      await pageService.revokePermission(permissionId);
      loadPermissions();
    } catch (error: any) {
      alert(error.response?.data?.error || error.message || 'Failed to delete permission');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/admin/pages')}
            className="text-blue-600 hover:text-blue-800 mb-2 inline-flex items-center"
          >
            ← Back to Pages
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Page Permissions</h1>
          <p className="text-gray-600 mt-1">Manage who can access and edit this page: /{slug}</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Grant Permission'}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Add Permission Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Grant New Permission</h2>
          <form onSubmit={handleGrantPermission} className="space-y-4">
            {/* Grant Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grant permission to:
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="role"
                    checked={grantType === 'role'}
                    onChange={(e) => setGrantType(e.target.value as 'role')}
                    className="mr-2"
                  />
                  By Role
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="user"
                    checked={grantType === 'user'}
                    onChange={(e) => setGrantType(e.target.value as 'user')}
                    className="mr-2"
                  />
                  Specific User
                </label>
              </div>
            </div>

            {/* Role or User Selection */}
            {grantType === 'role' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="content_creator">Content Creator</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="approver">Approver</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a user...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name} ({u.email}) - {u.role}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Permission Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permission Level
              </label>
              <select
                value={permissionType}
                onChange={(e) => setPermissionType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="view">View Only</option>
                <option value="edit">Edit</option>
                <option value="publish">Publish</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button type="submit">Grant Permission</Button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Permissions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Granted To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permission Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Scope
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {permissions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No permissions set. By default, only admins can access this page.
                </td>
              </tr>
            ) : (
              permissions.map((permission) => (
                <tr key={permission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      {permission.user_id ? (
                        <>
                          <div className="text-sm font-medium text-gray-900">
                            {permission.user_name || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500">{permission.user_email}</div>
                        </>
                      ) : (
                        <div className="text-sm font-medium text-gray-900">
                          Role: {permission.role?.replace('_', ' ').toUpperCase()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      permission.permission_type === 'publish'
                        ? 'bg-green-100 text-green-800'
                        : permission.permission_type === 'edit'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {permission.permission_type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {permission.section_id ? (
                        <>
                          Section: {permission.section_title}
                          <div className="text-xs text-gray-500">({permission.section_key})</div>
                        </>
                      ) : (
                        'Entire Page'
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(permission.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeletePermission(permission.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          About Permissions
        </h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li><strong>View:</strong> Can see the page and its content in the CMS</li>
          <li><strong>Edit:</strong> Can modify page content and sections</li>
          <li><strong>Publish:</strong> Can publish changes to make them live on the website</li>
          <li><strong>Role-based:</strong> Applies to all users with that role</li>
          <li><strong>User-specific:</strong> Applies only to the selected user</li>
          <li>Admins always have full access to all pages</li>
        </ul>
      </div>
    </div>
  );
};
