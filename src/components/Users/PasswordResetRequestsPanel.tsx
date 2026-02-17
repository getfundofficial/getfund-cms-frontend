import React, { useState, useEffect } from 'react';
import userService, { PasswordResetRequest } from '../../services/userService';

interface PasswordResetRequestsPanelProps {
  onResetComplete: () => void;
}

const PasswordResetRequestsPanel: React.FC<PasswordResetRequestsPanelProps> = ({ onResetComplete }) => {
  const [requests, setRequests] = useState<PasswordResetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await userService.getPasswordResetRequests();
      setRequests(data);
    } catch (err) {
      console.error('Error loading password reset requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Reset this user\'s password to the default? They will need to change it on next login.')) {
      return;
    }

    setProcessingId(id);
    try {
      await userService.approvePasswordResetRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      onResetComplete();
      window.dispatchEvent(new Event('notification-refresh'));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to approve reset request');
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading || requests.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
        <h3 className="font-semibold text-amber-800">
          Password Reset Requests ({requests.length})
        </h3>
      </div>

      <div className="space-y-2">
        {requests.map((req) => (
          <div key={req.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-amber-100">
            <div>
              <p className="text-sm font-medium text-gray-900">{req.user_full_name}</p>
              <p className="text-xs text-gray-500">{req.user_email} &middot; {formatDate(req.requested_at)}</p>
            </div>
            <button
              onClick={() => handleApprove(req.id)}
              disabled={processingId === req.id}
              className="px-3 py-1.5 text-xs font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 disabled:opacity-50 transition-colors"
            >
              {processingId === req.id ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordResetRequestsPanel;
