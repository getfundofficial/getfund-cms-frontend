import React from 'react';
import { Link } from 'react-router-dom';

interface NotificationBellProps {
  count: number;
  to: string;
  ariaLabel?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  count,
  to,
  ariaLabel = 'View notifications',
}) => {
  return (
    <Link
      to={to}
      className="relative inline-flex items-center justify-center p-2 rounded-xl hover:bg-primary-50 transition-all hover:scale-105 group"
      aria-label={`${ariaLabel}${count > 0 ? `, ${count} pending` : ''}`}
    >
      <svg
        className="w-5 h-5 text-gray-600 group-hover:text-primary-600 transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      {count > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-red-500 rounded-full ring-2 ring-white"
          aria-hidden="true"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;
