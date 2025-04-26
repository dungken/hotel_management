import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const FullPageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-100 flex flex-col items-center justify-center z-50">
      <LoadingSpinner size="large" />
      <p className="mt-4 text-gray-600 font-medium">Loading...</p>
    </div>
  );
};

export default FullPageLoader;
