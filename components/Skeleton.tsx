import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-sm overflow-hidden border border-gray-700 h-full flex flex-col animate-pulse">
      <div className="relative aspect-[4/5] bg-gray-700 overflow-hidden" />
      <div className="p-3 flex flex-col flex-grow">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
        <div className="mt-auto flex gap-2">
          <div className="h-5 bg-gray-700 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonDetails: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto bg-gray-800 p-6 md:p-10 rounded-2xl border border-gray-700 w-full animate-pulse">
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="relative w-full aspect-square bg-gray-700 rounded-xl overflow-hidden" />
        <div className="flex space-x-3 mt-6 justify-center">
          <div className="w-20 h-20 bg-gray-700 rounded-lg" />
          <div className="w-20 h-20 bg-gray-700 rounded-lg" />
          <div className="w-20 h-20 bg-gray-700 rounded-lg" />
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col space-y-4">
        <div className="h-10 bg-gray-700 rounded w-3/4" />
        <div className="h-6 bg-gray-700 rounded w-1/4" />
        <div className="h-12 bg-gray-700 rounded w-1/3 mt-4" />
        <div className="h-32 bg-gray-700 rounded w-full mt-6" />
        <div className="mt-auto pt-6">
          <div className="h-14 bg-gray-700 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
};
