
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16" aria-label="Loading...">
      <div className="relative flex justify-center items-center">
        <div className="absolute w-24 h-24 rounded-full border-4 border-[#F9A88C] opacity-50"></div>
        <div className="absolute w-24 h-24 rounded-full border-4 border-transparent border-t-[#F9A88C] animate-spin"></div>
        <div className="text-gray-600 text-sm">Searching...</div>
      </div>
    </div>
  );
};
