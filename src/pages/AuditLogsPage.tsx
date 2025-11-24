import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface AuditLog {
  id: string;
  user_id: string;
  user_name?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  changes?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

interface AuditLogsResponse {
  logs: AuditLog[];
  total: number;
  limit: number;
  offset: number;
}

interface ContentInfo {
  id: string;
  title: string;
  status: string;
}

const API_URL = import.meta.env.VITE_API_URL || '';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [contentDetails, setContentDetails] = useState<Record<string, ContentInfo>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    action: '',
    entity_type: '',
    user_id: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const logsPerPage = 50;

  useEffect(() => {
    loadAuditLogs();
  }, [filter, currentPage]);

  const loadAuditLogs = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      const offset = (currentPage - 1) * logsPerPage;

      const params: any = {
        limit: logsPerPage,
        offset,
      };

      if (filter.action) params.action = filter.action;
      if (filter.entity_type) params.entity_type = filter.entity_type;
      if (filter.user_id) params.user_id = filter.user_id;

      console.log('Fetching audit logs with params:', params);
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('API URL:', `${API_URL}/audit-logs`);

      const response = await axios.get<AuditLogsResponse>(`${API_URL}/audit-logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      console.log('Audit logs response:', response.data);

      setLogs(response.data.logs);
      setTotal(response.data.total);

      // Fetch content details for content-related logs
      const contentLogs = response.data.logs.filter(log => log.entity_type === 'content');
      const contentIds = [...new Set(contentLogs.map(log => log.entity_id))];

      // Fetch content details
      const contentDetailsMap: Record<string, ContentInfo> = {};
      await Promise.all(
        contentIds.map(async (id) => {
          try {
            const contentRes = await axios.get(`${API_URL}/content/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            contentDetailsMap[id] = {
              id: contentRes.data.id,
              title: contentRes.data.title,
              status: contentRes.data.status,
            };
          } catch (error) {
            // Content might be deleted, skip
          }
        })
      );

      setContentDetails(contentDetailsMap);
    } catch (error: any) {
      console.error('Failed to load audit logs:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    const styles: Record<string, string> = {
      create: 'bg-green-100 text-green-800',
      update: 'bg-blue-100 text-blue-800',
      delete: 'bg-red-100 text-red-800',
      publish: 'bg-purple-100 text-purple-800',
      approve: 'bg-yellow-100 text-yellow-800',
      login: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${styles[action] || 'bg-gray-100 text-gray-800'}`}>
        {action.toUpperCase()}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      in_review: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      published: 'bg-purple-100 text-purple-800',
      changes_requested: 'bg-red-100 text-red-800',
    };

    const labels: Record<string, string> = {
      draft: 'Draft',
      in_review: 'In Review',
      approved: 'Approved',
      published: 'Published',
      changes_requested: 'Changes Requested',
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalPages = Math.ceil(total / logsPerPage);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Audit Logs</h1>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">View all system activity and changes</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Action</label>
            <select
              value={filter.action}
              onChange={(e) => {
                setFilter({ ...filter, action: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-touch"
            >
              <option value="">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="publish">Publish</option>
              <option value="approve">Approve</option>
              <option value="login">Login</option>
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Entity Type</label>
            <select
              value={filter.entity_type}
              onChange={(e) => {
                setFilter({ ...filter, entity_type: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-touch"
            >
              <option value="">All Types</option>
              <option value="content">Content</option>
              <option value="user">User</option>
              <option value="page">Page</option>
            </select>
          </div>

          <div className="flex items-end sm:col-span-2 md:col-span-1">
            <button
              onClick={() => {
                setFilter({ action: '', entity_type: '', user_id: '' });
                setCurrentPage(1);
              }}
              className="w-full bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm min-h-touch"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {logs.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-sm sm:text-base text-gray-500">No audit logs found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Approval Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => {
                    const content = contentDetails[log.entity_id];
                    return (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(log.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {log.user_name || 'Unknown User'}
                          </div>
                          <div className="text-xs text-gray-500">{log.ip_address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getActionBadge(log.action)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{log.entity_type}</div>
                          {content && (
                            <div className="text-xs text-gray-500 max-w-xs truncate">
                              {content.title}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {log.changes && (
                            <div className="max-w-md">
                              {log.changes.title && (
                                <div className="truncate">
                                  <span className="font-medium">Title:</span> {log.changes.title}
                                </div>
                              )}
                              {log.changes.type && (
                                <div>
                                  <span className="font-medium">Type:</span> {log.changes.type}
                                </div>
                              )}
                              {log.changes.status && (
                                <div>
                                  <span className="font-medium">Status:</span> {log.changes.status}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {log.entity_type === 'content' && content ? (
                            <div className="space-y-1">
                              {getStatusBadge(content.status)}
                              {content.status === 'in_review' && (
                                <div className="text-xs text-blue-600 font-medium">In Review Queue</div>
                              )}
                              {content.status === 'approved' && (
                                <div className="text-xs text-green-600 font-medium">In Approval Queue</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-200">
              {logs.map((log) => {
                const content = contentDetails[log.entity_id];
                return (
                  <div key={log.id} className="p-4 hover:bg-gray-50">
                    {/* Date & Action */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900">
                          {formatDate(log.created_at)}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {log.user_name || 'Unknown User'}
                        </p>
                      </div>
                      {getActionBadge(log.action)}
                    </div>

                    {/* Entity Info */}
                    <div className="mb-2">
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Entity:</span> {log.entity_type}
                      </p>
                      {content && (
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {content.title}
                        </p>
                      )}
                    </div>

                    {/* Changes */}
                    {log.changes && (
                      <div className="mb-2 text-xs text-gray-500">
                        {log.changes.title && (
                          <div className="truncate">
                            <span className="font-medium">Title:</span> {log.changes.title}
                          </div>
                        )}
                        {log.changes.status && (
                          <div>
                            <span className="font-medium">Status:</span> {log.changes.status}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Approval Status */}
                    {log.entity_type === 'content' && content && (
                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(content.status)}
                        {content.status === 'in_review' && (
                          <span className="text-xs text-blue-600 font-medium">In Review Queue</span>
                        )}
                        {content.status === 'approved' && (
                          <span className="text-xs text-green-600 font-medium">In Approval Queue</span>
                        )}
                      </div>
                    )}

                    {/* IP Address */}
                    {log.ip_address && (
                      <p className="text-xs text-gray-400 mt-2">IP: {log.ip_address}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-3 sm:px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-touch"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-touch"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * logsPerPage + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(currentPage * logsPerPage, total)}</span> of{' '}
                      <span className="font-medium">{total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === pageNum
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
