import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import { useAuth } from '../context/AuthContext';
import { lotteryService, LotteryEntry } from '../services/lotteryService';
import LoadingScreen from '../components/Common/LoadingScreen';

export const LotteryEntriesPage: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LotteryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);

  const [filters, setFilters] = useState({
    draw_month: '',
    is_winner: '',
    campaign_id: '',
    limit: 50,
  });

  useEffect(() => {
    loadEntries();
  }, [currentPage, filters]);

  const loadEntries = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: currentPage,
        limit: filters.limit,
      };

      if (filters.draw_month) params.draw_month = filters.draw_month;
      if (filters.is_winner !== '') params.is_winner = filters.is_winner === 'true';
      if (filters.campaign_id) params.campaign_id = filters.campaign_id;

      const data = await lotteryService.getEntries(params);
      setEntries(data.entries);
      setTotalPages(data.pagination.totalPages);
      setTotalEntries(data.pagination.total);
    } catch (error) {
      console.error('Failed to load lottery entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (field: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const formatCurrency = (amount: number, currency: string = 'GHS') => {
    if (currency === 'GHS') {
      return `GH₵ ${amount.toLocaleString()}`;
    }
    return `${currency} ${amount.toLocaleString()}`;
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

  const maskEmail = (email: string) => {
    const [local, domain] = email.split('@');
    if (local.length <= 3) return email;
    return `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
  };

  if (isLoading && entries.length === 0) {
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
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Lottery Entries', path: '' }
        ]}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lottery Entries</h1>
        <div className="text-sm text-gray-600">
          Total Entries: <span className="font-semibold">{totalEntries}</span>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Draw Month
              </label>
              <input
                type="month"
                value={filters.draw_month}
                onChange={(e) => handleFilterChange('draw_month', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Winner Status
              </label>
              <select
                value={filters.is_winner}
                onChange={(e) => handleFilterChange('is_winner', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="true">Winners Only</option>
                <option value="false">Non-Winners</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entries Per Page
              </label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({
                    draw_month: '',
                    is_winner: '',
                    campaign_id: '',
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

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Draw Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prize
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No entries found
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className={`hover:bg-gray-50 ${entry.is_winner ? 'bg-yellow-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {entry.donor_name || 'Anonymous'}
                        </div>
                        <div className="text-gray-500">
                          {maskEmail(entry.donor_email)}
                        </div>
                        {entry.donor_phone && (
                          <div className="text-gray-400 text-xs">
                            {entry.donor_phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {formatCurrency(entry.donation_amount, entry.currency)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Ref: {entry.payment_reference}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {entry.campaign_title || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(entry.draw_month).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {entry.is_winner && (
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">
                            Winner
                          </span>
                        )}
                        {!entry.is_valid && (
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800">
                            Invalid
                          </span>
                        )}
                        {entry.is_valid && !entry.is_winner && (
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
                            Valid
                          </span>
                        )}
                        {entry.notified_at && (
                          <div className="text-xs text-gray-500">
                            Notified
                          </div>
                        )}
                        {entry.claimed_at && (
                          <div className="text-xs text-green-600 font-medium">
                            Claimed
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {entry.is_winner && entry.prize_rank && entry.prize_amount ? (
                        <div>
                          <div className="font-medium text-gray-900">
                            Rank {entry.prize_rank}
                          </div>
                          <div className="text-gray-600">
                            {formatCurrency(entry.prize_amount, entry.currency)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(entry.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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
    </div>
  );
};
