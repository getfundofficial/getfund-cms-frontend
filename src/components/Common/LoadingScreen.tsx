import { useState } from 'react';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
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
        <p className="text-gray-600 text-lg font-medium">{message}</p>
      </div>
    </div>
  );
}
