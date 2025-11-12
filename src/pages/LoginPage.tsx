import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Common/Button';
import { Input } from '../components/Common/Input';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🏛️ GETFund CMS
          </h1>
          <p className="text-gray-600">Content Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email Address"
              placeholder="admin@getfund.gov.gh"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
            />

            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-900 mb-2">Test Accounts:</p>
            <div className="text-xs text-gray-700 space-y-1">
              <button
                type="button"
                onClick={() => { setEmail('admin@getfund.gov.gh'); setPassword('getfund2025'); }}
                className="block w-full text-left hover:bg-blue-100 px-2 py-1 rounded transition-colors"
              >
                <strong>Admin:</strong> admin@getfund.gov.gh
              </button>
              <button
                type="button"
                onClick={() => { setEmail('creator1@getfund.gov.gh'); setPassword('getfund2025'); }}
                className="block w-full text-left hover:bg-blue-100 px-2 py-1 rounded transition-colors"
              >
                <strong>Creator:</strong> creator1@getfund.gov.gh
              </button>
              <button
                type="button"
                onClick={() => { setEmail('reviewer@getfund.gov.gh'); setPassword('getfund2025'); }}
                className="block w-full text-left hover:bg-blue-100 px-2 py-1 rounded transition-colors"
              >
                <strong>Reviewer:</strong> reviewer@getfund.gov.gh
              </button>
              <button
                type="button"
                onClick={() => { setEmail('approver@getfund.gov.gh'); setPassword('getfund2025'); }}
                className="block w-full text-left hover:bg-blue-100 px-2 py-1 rounded transition-colors"
              >
                <strong>Approver:</strong> approver@getfund.gov.gh
              </button>
              <p className="mt-2 px-2"><strong>Password (all):</strong> getfund2025</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Secure login • Role-based access control
        </p>
      </div>
    </div>
  );
};
