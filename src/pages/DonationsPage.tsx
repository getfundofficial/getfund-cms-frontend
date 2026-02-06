import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import { useAuth } from '../context/AuthContext';
import { donationsService, Donation, DonationsStats, UpdateDonationDto } from '../services/donationsService';
import LoadingScreen from '../components/Common/LoadingScreen';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
  { value: 'refunded', label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
];

const IMPACT_DONATION_CATEGORIES = [
  'Classroom construction support',
  'Student Scholarship (Local)',
  'Student Scholarship (International)',
  'School Meals',
  'Classroom Furniture',
  'Learning Materials',
  'ICT & Digital Learning Tools',
  'School Sanitation & Water Access',
];

const DONOR_TYPES = [
  { value: 'Individual', label: 'Individual' },
  { value: 'Corporate', label: 'Corporation/Organization' },
  { value: 'GETFund Beneficiary', label: 'GETFund Beneficiary' },
  { value: 'Anonymous', label: 'Anonymous' },
];

type TabType = 'impact' | 'general';

export const DonationsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('impact');
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonationsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDonations, setTotalDonations] = useState(0);

  const [filters, setFilters] = useState({
    donation_category: '',
    payment_status: '',
    donor_type: '',
    search: '',
    start_date: '',
    end_date: '',
    limit: 50,
  });

  // Edit modal state
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [editForm, setEditForm] = useState<UpdateDonationDto>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadDonations();
  }, [currentPage, filters, activeTab]);

  const loadDonations = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: currentPage,
        limit: filters.limit,
        donation_type: activeTab, // 'impact' or 'general'
      };

      if (filters.donation_category) params.donation_category = filters.donation_category;
      if (filters.payment_status) params.payment_status = filters.payment_status;
      if (filters.donor_type) params.donor_type = filters.donor_type;
      if (filters.search) params.search = filters.search;
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;

      const data = await donationsService.getDonations(params);
      setDonations(data.donations);
      setStats(data.stats);
      setTotalPages(data.pagination.totalPages);
      setTotalDonations(data.pagination.total);
    } catch (error) {
      console.error('Failed to load donations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setFilters({
      donation_category: '',
      payment_status: '',
      donor_type: '',
      search: '',
      start_date: '',
      end_date: '',
      limit: 50,
    });
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

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: { [key: string]: string } = {
      'GHS': 'GH\u20B5',
      'USD': '$',
      'EUR': '\u20AC',
      'GBP': '\u00A3'
    };
    return `${symbols[currency] || currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const getStatusBadge = (status: string) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status);
    return statusOption ? (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${statusOption.color}`}>
        {statusOption.label}
      </span>
    ) : null;
  };

  const getDonorTypeBadge = (donorType: string) => {
    const colors: { [key: string]: string } = {
      'Individual': 'bg-blue-100 text-blue-800',
      'Corporate': 'bg-purple-100 text-purple-800',
      'GETFund Beneficiary': 'bg-green-100 text-green-800',
      'Anonymous': 'bg-gray-100 text-gray-500',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${colors[donorType] || 'bg-gray-100 text-gray-800'}`}>
        {donorType}
      </span>
    );
  };

  const handleEdit = (donation: Donation) => {
    setEditingDonation(donation);
    setEditForm({
      payment_status: donation.payment_status,
      notes: donation.metadata?.notes || '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editingDonation) return;

    try {
      setIsSaving(true);
      await donationsService.updateDonation(editingDonation.id, editForm);
      setEditingDonation(null);
      loadDonations();
    } catch (error) {
      console.error('Failed to update donation:', error);
      alert('Failed to update donation. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && donations.length === 0) {
    return <LoadingScreen />;
  }

  if (user?.role !== 'admin') {
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
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Donations', path: '' }
        ]}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Donations Management</h1>
        <div className="text-sm text-gray-600">
          Total: <span className="font-semibold">{totalDonations}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange('impact')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'impact'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Choose How You Want to Make an Impact
              </span>
            </button>
            <button
              onClick={() => handleTabChange('general')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'general'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Make a Donation
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-yellow-800 text-sm font-medium">Pending</div>
            <div className="text-2xl font-bold text-yellow-900">{stats.pending.count}</div>
            <div className="text-sm text-yellow-700">
              {formatCurrency(stats.pending.total_amount, 'GHS')}
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-green-800 text-sm font-medium">Completed</div>
            <div className="text-2xl font-bold text-green-900">{stats.completed.count}</div>
            <div className="text-sm text-green-700">
              {formatCurrency(stats.completed.total_amount, 'GHS')}
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800 text-sm font-medium">Failed</div>
            <div className="text-2xl font-bold text-red-900">{stats.failed.count}</div>
            <div className="text-sm text-red-700">
              {formatCurrency(stats.failed.total_amount, 'GHS')}
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-gray-800 text-sm font-medium">Refunded</div>
            <div className="text-2xl font-bold text-gray-900">{stats.refunded.count}</div>
            <div className="text-sm text-gray-700">
              {formatCurrency(stats.refunded.total_amount, 'GHS')}
            </div>
          </div>
        </div>
      )}

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

            {activeTab === 'impact' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Impact Category
                </label>
                <select
                  value={filters.donation_category}
                  onChange={(e) => handleFilterChange('donation_category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {IMPACT_DONATION_CATEGORIES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.payment_status}
                onChange={(e) => handleFilterChange('payment_status', e.target.value)}
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
                Donor Type
              </label>
              <select
                value={filters.donor_type}
                onChange={(e) => handleFilterChange('donor_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Donor Types</option>
                {DONOR_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
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
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setFilters({
                  donation_category: '',
                  payment_status: '',
                  donor_type: '',
                  search: '',
                  start_date: '',
                  end_date: '',
                  limit: 50,
                });
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab === 'impact' ? 'Impact Category' : 'Donation Info'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor Type
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
              {donations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No donations found
                  </td>
                </tr>
              ) : (
                donations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {donation.donor_type === 'Anonymous' ? (
                          <span className="text-gray-500 italic">Anonymous</span>
                        ) : (
                          <>
                            <div className="font-medium text-gray-900">
                              {donation.donor_name || 'N/A'}
                            </div>
                            <div className="text-gray-500">{donation.donor_email || 'N/A'}</div>
                            {donation.donor_phone && (
                              <div className="text-gray-500">{donation.donor_phone}</div>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {donation.donation_category || 'General Donation'}
                      </div>
                      {donation.donation_description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs" title={donation.donation_description}>
                          {donation.donation_description}
                        </div>
                      )}
                      {donation.donation_reason && (
                        <div className="text-xs text-blue-600 mt-1 truncate max-w-xs" title={donation.donation_reason}>
                          Reason: {donation.donation_reason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(donation.amount, donation.currency)}
                      </div>
                      <div className="text-xs text-gray-500">{donation.donation_frequency}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getDonorTypeBadge(donation.donor_type)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(donation.payment_status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(donation.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEdit(donation)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        Edit
                      </button>
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
      {editingDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full m-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit Donation</h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Read-only info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Donor:</span>
                  <span className="text-sm font-medium">
                    {editingDonation.donor_type === 'Anonymous' ? 'Anonymous' : (editingDonation.donor_name || 'N/A')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Category:</span>
                  <span className="text-sm font-medium">{editingDonation.donation_category || 'General Donation'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Amount:</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(editingDonation.amount, editingDonation.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Donor Type:</span>
                  <span className="text-sm font-medium">{editingDonation.donor_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Created:</span>
                  <span className="text-sm font-medium">{formatDate(editingDonation.created_at)}</span>
                </div>
                {editingDonation.donation_reason && (
                  <div className="pt-2 border-t">
                    <span className="text-sm text-gray-500 block mb-1">Reason for donating:</span>
                    <span className="text-sm text-gray-700">{editingDonation.donation_reason}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  value={editForm.payment_status || 'pending'}
                  onChange={(e) => setEditForm({ ...editForm, payment_status: e.target.value as any })}
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
                  rows={3}
                  placeholder="Internal notes about this donation..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setEditingDonation(null)}
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
    </div>
  );
};
