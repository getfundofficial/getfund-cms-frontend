import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Button } from '../components/Common/Button';
import { Input } from '../components/Common/Input';

export const ForcePasswordChangePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, mustChangePassword, clearMustChangePassword, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not authenticated or doesn't need to change password
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!mustChangePassword) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, mustChangePassword, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await authService.changePassword(currentPassword, newPassword);
      clearMustChangePassword();
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-blue-50 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block bg-white rounded-2xl shadow-soft p-4 mb-6">
            <img src="/images/logos/getfund-logo.png" alt="GETFund Logo" className="h-20 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Change Your Password</h1>
          <p className="text-gray-600">You must change your password before continuing.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-large p-8 border border-gray-100 animate-slide-up">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-amber-800">
              For security, please set a new password. It must be at least 8 characters with uppercase, lowercase, number, and special character.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              label="Current Password"
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
              autoFocus
            />

            <Input
              type="password"
              label="New Password"
              placeholder="Enter a new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <Input
              type="password"
              label="Confirm New Password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            {error && (
              <div className="border-l-4 border-red-400 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
              Change Password
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700 underline">
              Log out instead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
