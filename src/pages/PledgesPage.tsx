import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import { useAuth } from '../context/AuthContext';
import { isAdminRole } from '../types/auth.types';
import { pledgesService, Pledge, UpdatePledgeDto } from '../services/pledgesService';
import LoadingScreen from '../components/Common/LoadingScreen';

const COUNTRIES = [
  'Ghana', 'Nigeria', 'United States', 'United Kingdom', 'South Africa',
  'Kenya', 'Germany', 'Canada', 'France', 'Netherlands', 'Other'
];

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'contacted', label: 'Contacted', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

export const PledgesPage: React.FC = () => {
  const { user } = useAuth();
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPledges, setTotalPledges] = useState(0);

  const [filters, setFilters] = useState({
    country: '',
    status: '',
    search: '',
    start_date: '',
    end_date: '',
    limit: 50,
  });

  // Edit modal state
  const [editingPledge, setEditingPledge] = useState<Pledge | null>(null);
  const [editForm, setEditForm] = useState<UpdatePledgeDto>({});
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirmation state
  const [deletingPledge, setDeletingPledge] = useState<Pledge | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Export state
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadPledges();
  }, [currentPage, filters]);

  const loadPledges = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: currentPage,
        limit: filters.limit,
      };

      if (filters.country) params.country = filters.country;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;

      const data = await pledgesService.getPledges(params);
      setPledges(data.pledges);
      setTotalPages(data.pagination.totalPages);
      setTotalPledges(data.pagination.total);
    } catch (error) {
      console.error('Failed to load pledges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (field: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status);
    return statusOption ? (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${statusOption.color}`}>
        {statusOption.label}
      </span>
    ) : null;
  };

  const handleEdit = (pledge: Pledge) => {
    setEditingPledge(pledge);
    setEditForm({
      first_name: pledge.first_name,
      last_name: pledge.last_name,
      email: pledge.email,
      phone_country_code: pledge.phone_country_code,
      phone_number: pledge.phone_number,
      country: pledge.country,
      address: pledge.address || '',
      donation_description: pledge.donation_description,
      status: pledge.status,
      notes: pledge.notes || '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editingPledge) return;

    try {
      setIsSaving(true);
      await pledgesService.updatePledge(editingPledge.id, editForm);
      setEditingPledge(null);
      loadPledges();
    } catch (error) {
      console.error('Failed to update pledge:', error);
      alert('Failed to update pledge. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPledge) return;

    try {
      setIsDeleting(true);
      await pledgesService.deletePledge(deletingPledge.id);
      setDeletingPledge(null);
      loadPledges();
    } catch (error) {
      console.error('Failed to delete pledge:', error);
      alert('Failed to delete pledge. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const params: any = {};
      if (filters.country) params.country = filters.country;
      if (filters.status) params.status = filters.status;
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;

      const blob = await pledgesService.exportPledges(params);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pledges-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export pledges:', error);
      alert('Failed to export pledges. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading && pledges.length === 0) {
    return <LoadingScreen />;
  }

  if (!isAdminRole(user?.role)) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          You do not have permission to access this page.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Breadcrumb
        items={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Pledge Submissions', path: '' }
        ]}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pledge to Support Submissions</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Total Pledges: <span className="font-semibold">{totalPledges}</span>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Name or email..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Countries</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({
                    country: '',
                    status: '',
                    search: '',
                    start_date: '',
                    end_date: '',
                    limit: 50,
                  });
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pledges.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No pledges found
                  </td>
                </tr>
              ) : (
                pledges.map((pledge) => (
                  <tr key={pledge.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {pledge.first_name} {pledge.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900">{pledge.email}</div>
                        <div className="text-gray-500">
                          {pledge.phone_country_code} {pledge.phone_number}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {pledge.country}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={pledge.donation_description}>
                        {pledge.donation_description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(pledge.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(pledge.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(pledge)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingPledge(pledge)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingPledge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit Pledge</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={editForm.first_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editForm.last_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
                  <input
                    type="text"
                    value={editForm.phone_country_code || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone_country_code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phone_number || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  value={editForm.country || ''}
                  onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={editForm.address || ''}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Donation Description</label>
                <textarea
                  value={editForm.donation_description || ''}
                  onChange={(e) => setEditForm({ ...editForm, donation_description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editForm.status || 'pending'}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                <textarea
                  value={editForm.notes || ''}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  rows={2}
                  placeholder="Internal notes about this pledge..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setEditingPledge(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPledge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Delete Pledge</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the pledge from{' '}
                <strong>{deletingPledge.first_name} {deletingPledge.last_name}</strong>?
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeletingPledge(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
