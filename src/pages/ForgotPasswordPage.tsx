import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Button } from '../components/Common/Button';
import { Input } from '../components/Common/Input';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to process request. Please try again.');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
          <p className="text-gray-600">Enter your email to request a password reset from your administrator.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-large p-8 border border-gray-100 animate-slide-up">
          {submitted ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Submitted</h3>
              <p className="text-sm text-gray-600 mb-6">
                If an account with that email exists, a password reset request has been sent to the administrator. You will be notified when your password has been reset.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-accent-600 hover:text-accent-700 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="your.email@getfund.gov.gh"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                />

                {error && (
                  <div className="border-l-4 border-red-400 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
                  Request Password Reset
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700 underline">
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
