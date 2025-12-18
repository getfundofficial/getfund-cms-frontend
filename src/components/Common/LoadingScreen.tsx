import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  message?: string;
  showTimer?: boolean;
  onRetry?: () => void;
}

export default function LoadingScreen({ message = 'Loading...', showTimer = false, onRetry }: LoadingScreenProps) {
  const [imageError, setImageError] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!showTimer) return;
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [showTimer]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <div className="relative w-32 h-32 mx-auto mb-6">
          {!imageError ? (
            <img
              src="/images/logos/getfund-cropped-icon.png"
              alt="GETFund Logo"
              className="w-full h-full object-contain animate-spin-slow"
              onError={() => {
                console.error('Failed to load cropped icon, trying main logo');
                setImageError(true);
              }}
              loading="eager"
            />
          ) : (
            <img
              src="/images/logos/getfund-logo.png"
              alt="GETFund Logo"
              className="w-full h-full object-contain animate-spin-slow"
              loading="eager"
            />
          )}
        </div>
        <p className="text-gray-600 text-lg font-medium mb-2">{message}</p>
        {showTimer && elapsedTime > 5 && (
          <p className="text-gray-500 text-sm">
            {elapsedTime > 30
              ? 'This is taking longer than expected. The database may be waking up...'
              : `Please wait... (${elapsedTime}s)`}
          </p>
        )}
        {showTimer && elapsedTime > 60 && onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
