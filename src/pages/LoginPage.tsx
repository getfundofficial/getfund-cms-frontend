import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Common/Button';
import { Input } from '../components/Common/Input';
import { LogIn, Clock, Lock } from 'lucide-react';

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

  const testAccounts = [
    { role: 'ADMIN', email: 'admin@getfund.gov.gh', color: 'bg-blue-600' },
    { role: 'CREATOR', email: 'creator1@getfund.gov.gh', color: 'bg-teal-500' },
    { role: 'REVIEWER', email: 'reviewer@getfund.gov.gh', color: 'bg-purple-500' },
    { role: 'APPROVER', email: 'approver@getfund.gov.gh', color: 'bg-amber-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <img
            src="/images/logos/getfund-logo.png"
            alt="GETFund Logo"
            className="h-24 mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            GETFund CMS
          </h1>
          <p className="text-gray-600">Content Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-50 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <LogIn className="text-blue-600" size={24} />
            Sign In
          </h2>

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
              <div className="border-l-4 border-red-400 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
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
          <div className="mt-6 p-4 bg-white/60 rounded-lg">
            <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="text-blue-500" size={18} />
              Test Accounts
            </p>
            <div className="space-y-2">
              {testAccounts.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => { setEmail(account.email); setPassword('getfund2025'); }}
                  className="flex items-center gap-3 w-full text-left hover:bg-gray-100 px-2 py-1.5 rounded transition-colors"
                >
                  <span className={`${account.color} text-white text-xs font-semibold px-2 py-0.5 rounded`}>
                    {account.role}
                  </span>
                  <span className="text-sm text-gray-700">{account.email}</span>
                </button>
              ))}
              <p className="mt-3 px-2 text-sm text-gray-700">
                <strong>Password (all):</strong>{' '}
                <code className="bg-gray-200 px-2 py-0.5 rounded text-gray-800">getfund2025</code>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-gray-500 flex items-center justify-center gap-2">
          <Lock className="text-gray-400" size={16} />
          Secure login • Role-based access control
        </p>
      </div>
    </div>
  );
};
