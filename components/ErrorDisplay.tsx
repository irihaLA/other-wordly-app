
import React from 'react';
import { AlertTriangleIcon } from './Icons';

interface ErrorDisplayProps {
  message: string | null;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="mt-8 flex flex-col items-center text-center bg-red-50 border border-red-200 text-red-700 px-4 py-5 rounded-lg max-w-md mx-auto animate-fade-in">
      <AlertTriangleIcon />
      <h3 className="text-lg font-bold mt-2">Oh no!</h3>
      <p className="mt-1">{message || 'An unexpected error occurred. Please try again.'}</p>
    </div>
  );
};
