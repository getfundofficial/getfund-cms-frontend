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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo/Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block bg-white rounded-2xl shadow-soft p-4 mb-6">
            <img
              src="/images/logos/getfund-logo.png"
              alt="GETFund Logo"
              className="h-20 mx-auto"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            GETFund CMS
          </h1>
          <p className="text-gray-600 text-lg">Content Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-large p-8 border border-gray-100 animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
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
          <div className="mt-6 p-5 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border border-primary-200">
            <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Test Accounts
            </p>
            <div className="text-xs text-gray-700 space-y-2">
              <button
                type="button"
                onClick={() => { setEmail('admin@getfund.gov.gh'); setPassword('getfund2025'); }}
                className="block w-full text-left hover:bg-white px-3 py-2 rounded-lg transition-all hover:shadow-sm border border-transparent hover:border-primary-200"
              >
                <span className="inline-block bg-primary-600 text-white px-2 py-0.5 rounded text-xs font-bold mr-2">ADMIN</span>
                admin@getfund.gov.gh
              </button>
              <button
                type="button"
                onClick={() => { setEmail('creator1@getfund.gov.gh'); setPassword('getfund2025'); }}
                className="block w-full text-left hover:bg-white px-3 py-2 rounded-lg transition-all hover:shadow-sm border border-transparent hover:border-accent-200"
              >
                <span className="inline-block bg-accent-600 text-white px-2 py-0.5 rounded text-xs font-bold mr-2">CREATOR</span>
                creator1@getfund.gov.gh
              </button>
              <button
                type="button"
                onClick={() => { setEmail('reviewer@getfund.gov.gh'); setPassword('getfund2025'); }}
                className="block w-full text-left hover:bg-white px-3 py-2 rounded-lg transition-all hover:shadow-sm border border-transparent hover:border-secondary-200"
              >
                <span className="inline-block bg-secondary-600 text-white px-2 py-0.5 rounded text-xs font-bold mr-2">REVIEWER</span>
                reviewer@getfund.gov.gh
              </button>
              <button
                type="button"
                onClick={() => { setEmail('approver@getfund.gov.gh'); setPassword('getfund2025'); }}
                className="block w-full text-left hover:bg-white px-3 py-2 rounded-lg transition-all hover:shadow-sm border border-transparent hover:border-success-200"
              >
                <span className="inline-block bg-success-600 text-white px-2 py-0.5 rounded text-xs font-bold mr-2">APPROVER</span>
                approver@getfund.gov.gh
              </button>
              <p className="mt-3 px-3 text-gray-600">
                <strong>Password (all):</strong> <code className="bg-white px-2 py-1 rounded">getfund2025</code>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-gray-600 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure login • Role-based access control
        </p>
      </div>
    </div>
  );
};
